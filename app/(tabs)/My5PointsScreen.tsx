import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import moment from 'moment';

// Define a list of motivational quotes
const quotes = [
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "It does not matter how slowly you go as long as you do not stop.",
    "You are never too old to set another goal or to dream a new dream.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Start where you are. Use what you have. Do what you can.",
    "Success usually comes to those who are too busy to be looking for it.",
];

const My5PointsScreen = () => {
    const [points, setPoints] = useState<string[]>([]);
    const [completed, setCompleted] = useState<boolean[]>([]);
    const [streak, setStreak] = useState<number>(0);
    const [quote, setQuote] = useState<string>('');

    useEffect(() => {
        loadPoints();
        setupDailyReminder();
        calculateDailyStreak();
        displayDailyQuote();
    }, []);

    const loadPoints = async () => {
        try {
            const savedPoints = await AsyncStorage.getItem('points');
            const savedCompleted = await AsyncStorage.getItem('completed');
            if (savedPoints && savedCompleted) {
                setPoints(JSON.parse(savedPoints));
                setCompleted(JSON.parse(savedCompleted));
            }
        } catch (e) {
            console.log(e);
        }
    };

    const savePoints = async (newPoints: string[], newCompleted: boolean[]) => {
        try {
            await AsyncStorage.setItem('points', JSON.stringify(newPoints));
            await AsyncStorage.setItem('completed', JSON.stringify(newCompleted));
        } catch (e) {
            console.log(e);
        }
    };

    const addPoint = () => {
        if (points.length < 5) {
            setPoints([...points, '']);
            setCompleted([...completed, false]);
        } else {
            Alert.alert('Limit Reached', 'You can only add up to 5 points.');
        }
    };

    const updatePoint = (index: number, text: string) => {
        const newPoints = [...points];
        newPoints[index] = text;
        setPoints(newPoints);
        savePoints(newPoints, completed);
    };

    const toggleComplete = (index: number) => {
        const newCompleted = [...completed];
        newCompleted[index] = !newCompleted[index];
        setCompleted(newCompleted);
        savePoints(points, newCompleted);
    };

    const calculateTotalMarks = () => {
        return completed.filter(item => item).length * 20;
    };

    const progressPercentage = () => {
        const completedPoints = completed.filter(item => item).length;
        return (completedPoints / points.length) * 100;
    };

    const setupDailyReminder = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
            await Notifications.requestPermissionsAsync();
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Daily Reminder",
                body: "Don't forget to update your 5 points today!",
            },
            trigger: {
                hour: 9,
                minute: 0,
                repeats: true,
            },
        });
    };

    const calculateDailyStreak = async () => {
        try {
            const lastDate = await AsyncStorage.getItem('lastDate');
            const today = moment().startOf('day');
            const lastDateMoment = lastDate ? moment(lastDate) : null;

            if (lastDateMoment && today.isSame(lastDateMoment, 'day')) {
                const currentStreak = await AsyncStorage.getItem('streak');
                setStreak(currentStreak ? parseInt(currentStreak) : 0);
            } else {
                const newStreak = lastDateMoment && today.diff(lastDateMoment, 'days') === 1
                    ? (await AsyncStorage.getItem('streak') || '0') + 1
                    : 1;
                setStreak(newStreak);
                await AsyncStorage.setItem('lastDate', today.toISOString());
                await AsyncStorage.setItem('streak', newStreak.toString());
            }
        } catch (e) {
            console.log(e);
        }
    };

    const displayDailyQuote = async () => {
        const today = moment().format('YYYY-MM-DD');
        const savedDate = await AsyncStorage.getItem('quoteDate');
        if (savedDate !== today) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setQuote(randomQuote);
            await AsyncStorage.setItem('quoteDate', today);
            await AsyncStorage.setItem('dailyQuote', randomQuote);
        } else {
            const savedQuote = await AsyncStorage.getItem('dailyQuote');
            setQuote(savedQuote || '');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>My 5 Points for This Month</Text>
            <View style={styles.progressBarContainer}>
                <View
                    style={[styles.progressBar, { width: `${progressPercentage()}%` }]}
                />
            </View>
            <Text style={styles.quote}>{quote}</Text>
            {points.map((point, index) => (
                <View key={index} style={styles.pointContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={`Point ${index + 1}`}
                        value={point}
                        onChangeText={(text) => updatePoint(index, text)}
                    />
                    <TouchableOpacity onPress={() => toggleComplete(index)} style={[styles.checkbox, completed[index] && styles.checkboxChecked]}>
                        {completed[index] && <Text style={styles.checkmark}>✔</Text>}
                    </TouchableOpacity>
                </View>
            ))}
            {points.length < 5 && (
                <Button title="Add Point" onPress={addPoint} color="#6200ee" />
            )}
            {points.length > 0 && (
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Today total marks: {calculateTotalMarks()} / 100</Text>
                </View>
            )}
            <View style={styles.streakContainer}>
                <Text style={styles.streakText}>Current Streak: {streak} days</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f0f4f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    progressBarContainer: {
        width: '100%',
        height: 15,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4caf50',
        borderRadius: 10,
    },
    pointContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 12,
        backgroundColor: '#ffffff',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        borderColor: '#4caf50',
        backgroundColor: '#e8f5e9',
    },
    checkmark: {
        fontSize: 18,
        color: '#4caf50',
    },
    totalContainer: {
        marginTop: 20,
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    streakContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#ffe0b2',
    },
    streakText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d84315',
    },
    quote: {
        fontSize: 18,
        fontStyle: 'italic',
        marginBottom: 20,
        color: '#607d8b',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default My5PointsScreen;
