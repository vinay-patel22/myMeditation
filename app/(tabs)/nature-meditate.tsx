import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import {
    FlatList,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
    Alert,
    Button,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import MEDITATION_IMAGES from "@/constants/meditation-images";
import { MEDITATION_DATA } from "@/constants/MeditationData";
import AppGradient from "@/components/AppGradient";


const dataWithIds = MEDITATION_DATA.map((item, index) => ({
    ...item,
    id: index + 1,
}));

const Page = () => {
    const flatListRef = useRef<FlatList>(null);
    const [favorites, setFavorites] = useState(new Set<number>());
    const [paused, setPaused] = useState(false);

    const togglePause = () => {
        setPaused(!paused);
    };


    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem("favorites");
                if (storedFavorites) {
                    setFavorites(new Set(JSON.parse(storedFavorites)));
                }
            } catch (e) {
                console.error("Failed to load favorites:", e);
            }
        };
        loadFavorites();
    }, []);

    useEffect(() => {
        const saveFavorites = async () => {
            try {
                await AsyncStorage.setItem("favorites", JSON.stringify([...favorites]));
            } catch (e) {
                console.error("Failed to save favorites:", e);
            }
        };
        saveFavorites();
    }, [favorites]);

    useEffect(() => {
        let scrollValue = 0;
        let scrolled = 0;

        const itemHeight = 200;
        const totalHeight = itemHeight * MEDITATION_DATA.length;

        const interval = setInterval(() => {
            if (!paused) {
                scrolled++;
                if (scrolled < MEDITATION_DATA.length) {
                    scrollValue = scrollValue + itemHeight;
                } else {
                    scrollValue = 0;
                    scrolled = 0;
                }
                flatListRef.current?.scrollToOffset({
                    animated: true,
                    offset: scrollValue,
                });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [paused]);

    const toggleFavorite = async (id: number) => {
        setFavorites((prev) => {
            const updatedFavorites = new Set(prev);
            let actionMessage = '';
            if (updatedFavorites.has(id)) {
                updatedFavorites.delete(id);
                actionMessage = "Removed from favorites.";
            } else {
                updatedFavorites.add(id);
                actionMessage = "Added to favorites!";
            }

            AsyncStorage.setItem("favorites", JSON.stringify([...updatedFavorites]));

            Alert.alert("Favorite Updated", actionMessage);
            return updatedFavorites;
        });
    };



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

                <Pressable onPress={() => router.push('/favorites')}>
                    <Text style={styles.favoritesButton}>
                        View Favorites ({favorites.size})
                    </Text>
                </Pressable>

                <Text style={styles.sectionTitle}>Meditation Commentary</Text>
                <Button title={paused ? "Resume Scrolling" : "Pause Scrolling"} onPress={togglePause} />

                <FlatList
                    ref={flatListRef}
                    data={dataWithIds}
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

                                    <Pressable onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
                                        <Text style={styles.favoriteText}>
                                            {favorites.has(item.id) ? "♥" : "♡"}
                                        </Text>
                                    </Pressable>
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
    },
    header: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subtitle: {
        color: '#4B0082',
        fontSize: 20,
        fontWeight: '500',
    },
    sectionTitle: {
        color: 'black',
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
        height: 200,
        marginVertical: 5,
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
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 50,
        padding: 10,
    },
    favoriteText: {
        fontSize: 24,
        color: 'red',
        fontWeight: 'bold',
    },
    favoritesButton: {
        color: '#4B0082',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        paddingHorizontal: 20,
        paddingVertical: 10,
        textDecorationLine: 'underline'
    },
});

export default Page;
