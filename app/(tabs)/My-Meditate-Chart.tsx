import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Page: React.FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [meditatedDays, setMeditatedDays] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [confirmedDates, setConfirmedDates] = useState<string[]>([]);
    const [todayMarked, setTodayMarked] = useState<boolean>(false);
    const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth()); // Use number for month index
    const [chartData, setChartData] = useState<any>(null); // Added state for chart data
    const navigation = useNavigation();

    useEffect(() => {
        const loadMeditatedDays = async () => {
            try {
                const savedMeditatedDays = await AsyncStorage.getItem('meditatedDays');
                const savedConfirmedDates = await AsyncStorage.getItem('confirmedDates');

                if (savedMeditatedDays) {
                    const meditatedDaysArray = JSON.parse(savedMeditatedDays);
                    setMeditatedDays(meditatedDaysArray);

                    const today = new Date().toISOString().split('T')[0];
                    setTodayMarked(meditatedDaysArray.includes(today));
                }

                if (savedConfirmedDates) {
                    setConfirmedDates(JSON.parse(savedConfirmedDates));
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        loadMeditatedDays();
    }, []);

    useEffect(() => {
        if (showModal) {
            const newChartData = prepareChartData();
            console.log('Chart Data:', newChartData); // Debugging log
            setChartData(newChartData);
        }
    }, [showModal, currentMonth, meditatedDays]);

    const handleMeditation = async (date: string) => {
        const updatedMeditatedDays = [...meditatedDays, date];
        setMeditatedDays(updatedMeditatedDays);
        setQuestionAnswered(true);

        try {
            await AsyncStorage.setItem('meditatedDays', JSON.stringify(updatedMeditatedDays));
            console.log('Meditated days saved:', updatedMeditatedDays);
        } catch (error) {
            console.error('Failed to save meditated days:', error);
        }
    };

    const handleShowProgress = () => {
        setShowModal(true);
    };

    const handleNoPress = () => {
        Alert.alert(
            "Meditate Now",
            "Would you like to start meditating now?",
            [
                {
                    text: "Start Now",
                    onPress: () => router.push('(tabs)/nature-meditate')
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    const handleDatePress = async (day: { dateString: string }) => {
        const today = new Date().toISOString().split('T')[0];
        if (new Date(day.dateString) > new Date()) {
            Alert.alert("Future Date Not Allowed", "You cannot mark future dates.");
            return;
        }

        if (confirmedDates.includes(day.dateString)) {
            Alert.alert("Date Already Confirmed", "This date is already marked.");
            return;
        }

        if (day.dateString === today && !questionAnswered) {
            Alert.alert("Answer the Question", "You must answer the meditation question before marking today's date.");
            return;
        }

        setSelectedDate(day.dateString);
        Alert.alert(
            "Confirm Date",
            `Do you want to mark ${day.dateString} as meditated?`,
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        if (day.dateString === today) {
                            setTodayMarked(true);
                        }
                        const updatedMeditatedDays = [...meditatedDays, day.dateString];
                        setMeditatedDays(updatedMeditatedDays);
                        const updatedConfirmedDates = [...confirmedDates, day.dateString];
                        setConfirmedDates(updatedConfirmedDates);
                        setSelectedDate(null);

                        try {
                            await AsyncStorage.setItem('meditatedDays', JSON.stringify(updatedMeditatedDays));
                            await AsyncStorage.setItem('confirmedDates', JSON.stringify(updatedConfirmedDates));
                            console.log('Updated confirmed dates:', updatedConfirmedDates);
                        } catch (error) {
                            console.error('Failed to save confirmed dates:', error);
                        }
                    },
                },
                {
                    text: "No",
                    onPress: () => setSelectedDate(null),
                    style: "cancel",
                }
            ]
        );
    };

    const handleMonthChange = (month: { year: number; month: number }) => {
        setCurrentMonth(month.month - 1); // Adjust month index for 0-based array
    };

    const prepareChartData = () => {
        const startOfMonth = new Date();
        startOfMonth.setFullYear(new Date().getFullYear(), currentMonth, 1);
        const endOfMonth = new Date();
        endOfMonth.setFullYear(new Date().getFullYear(), currentMonth + 1, 0);

        const labels: string[] = [];
        const data: number[] = [];

        for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 7)) {
            const weekLabel = `Week ${Math.ceil(date.getDate() / 7)}`;
            labels.push(weekLabel);

            const weekStart = new Date(date);
            const weekEnd = new Date(date);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const count = meditatedDays.filter(d => {
                const day = new Date(d);
                return day >= weekStart && day <= weekEnd;
            }).length;
            data.push(count);
        }

        return {
            labels,
            datasets: [
                {
                    data,
                },
            ],
        };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.question}>Did you meditate today?</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Yes"
                    onPress={() => handleMeditation(new Date().toISOString().split('T')[0])}
                    disabled={todayMarked}
                />
                <Button
                    title="No"
                    onPress={handleNoPress}
                    color={todayMarked ? '#d3d3d3' : '#007bff'}
                />
            </View>
            <Calendar
                markedDates={meditatedDays.reduce((acc, date) => {
                    acc[date] = {
                        selected: true,
                        selectedColor: 'red',
                        marked: true,
                        dotColor: 'red',
                    };
                    return acc;
                }, {} as Record<string, any>)}
                onDayPress={handleDatePress}
                onMonthChange={handleMonthChange}
                style={styles.calendar}
            />
            <TouchableOpacity style={styles.progressButton} onPress={handleShowProgress}>
                <Text style={styles.buttonText}>Show Monthly Progress</Text>
            </TouchableOpacity>

            <Modal isVisible={showModal} onBackdropPress={() => setShowModal(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Monthly Progress - {monthNames[currentMonth]}</Text>
                    {chartData ? (
                        <LineChart
                            data={chartData}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                            }}
                            bezier
                            style={styles.chart}
                        />
                    ) : (
                        <Text>No data available</Text>
                    )}
                </View>
            </Modal>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Small steps lead to big changes. Keep moving forward !</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    question: {
        fontSize: 18,
        marginVertical: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    progressButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    calendar: {
        marginBottom: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 20,
        color: '#555',
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
});



export default Page;
