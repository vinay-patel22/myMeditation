import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useRef, useEffect } from "react";
import {
    FlatList,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import MEDITATION_IMAGES from "@/constants/meditation-images";
import { MEDITATION_DATA } from "@/constants/MeditationData";
import AppGradient from "@/components/AppGradient";

const Page = () => {
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        let scrollValue = 0;
        let scrolled = 0;

        // Calculate item height and total content height
        const itemHeight = 200; // Adjust this based on your item height
        const totalHeight = itemHeight * MEDITATION_DATA.length;

        const interval = setInterval(() => {
            scrolled++;
            if (scrolled < MEDITATION_DATA.length) {
                scrollValue = scrollValue + itemHeight;
            } else {
                scrollValue = 0;
                scrolled = 0;
            }
            flatListRef.current?.scrollToOffset({ animated: true, offset: scrollValue });
        }, 2000); // Adjust the time interval for auto-scrolling

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <AppGradient colors={["#EF629F", "#C4E0E5", "#ffdde1"]}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        Welcome Divine Soul
                    </Text>
                    <Text style={styles.subtitle}>
                        Start Your Meditation Practice Today
                    </Text>
                </View>
                <Text style={styles.sectionTitle}>Meditation Commentary</Text>
                <FlatList
                    ref={flatListRef}
                    data={MEDITATION_DATA}
                    contentContainerStyle={styles.list}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => router.push(`/meditate/${item.id}`)}
                            style={styles.itemContainer}
                        >
                            <ImageBackground
                                source={MEDITATION_IMAGES[item.id - 1]}
                                resizeMode="cover"
                                style={styles.backgroundImage}
                            >
                                <LinearGradient
                                    colors={[
                                        "transparent",
                                        "rgba(0.2,0.3,0.7,0.4)",
                                    ]}
                                    style={styles.gradient}
                                >
                                    <Text style={styles.itemTitle}>
                                        {item.title}
                                    </Text>
                                </LinearGradient>
                            </ImageBackground>
                        </Pressable>
                    )}
                />
            </AppGradient>
            <StatusBar style="light" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: 75,
    },
    header: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    title: {
        color: 'white', // Example color, adjust as needed
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subtitle: {
        color: '#4B0082', // Example color, adjust as needed
        fontSize: 20,
        fontWeight: '500',
    },
    sectionTitle: {
        color: 'black', // Example color, adjust as needed
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 8,
    },
    list: {
        paddingVertical: 10,
    },
    itemContainer: {
        width: '100%',
        height: 200, // Adjust based on your item size
        marginVertical: 5, // Space between items
    },
    backgroundImage: {
        flex: 1,
        borderRadius: 10,
        justifyContent: "center",
    },
    gradient: {
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
        width: "100%",
    },
    itemTitle: {
        color: '#FFFFFF', // Example color, adjust as needed
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Page;
