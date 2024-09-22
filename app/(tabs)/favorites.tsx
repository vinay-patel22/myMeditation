import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
    Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import MEDITATION_IMAGES from "@/constants/meditation-images";
import { MEDITATION_DATA } from "@/constants/MeditationData";
import AppGradient from "@/components/AppGradient";

const dataWithIds = MEDITATION_DATA.map((item, index) => ({
    ...item,
    id: index + 1,
}));

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState<number[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const loadFavorites = async () => {
                try {
                    const storedFavorites = await AsyncStorage.getItem("favorites");
                    if (storedFavorites) {
                        setFavorites(JSON.parse(storedFavorites));
                    }
                } catch (e) {
                    console.error("Failed to load favorites:", e);
                }
            };
            loadFavorites();
        }, [])
    );

    const removeFavorite = async (id: number) => {
        const updatedFavorites = favorites.filter(fav => fav !== id);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        Alert.alert("Favorite Removed", "This meditation has been removed from your favorites.");
    };

    const handleBackPress = () => {
        router.push('/nature-meditate');
    };

    return (
        <View style={styles.container}>
            <AppGradient colors={["#EF629F", "#C4E0E5", "#ffdde1"]}>
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back to Home</Text>
                </Pressable>
                <Text style={styles.title}>Your Favorites</Text>
                <FlatList
                    data={dataWithIds.filter(item => favorites.includes(item.id))}
                    keyExtractor={(item) => item.id.toString()}
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
                                    colors={["transparent", "rgba(0.2,0.3,0.7,0.4)"]}
                                    style={styles.gradient}
                                >
                                    <Text style={styles.itemTitle}>
                                        {item.title}
                                    </Text>
                                    <Pressable onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>Remove</Text>
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
    backButton: {
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
    },
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
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
    removeButton: {
        marginTop: 10,
        padding: 5,
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderRadius: 5,
    },
    removeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default FavoritesPage;
