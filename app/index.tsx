import { View, Text, Image, ImageBackground } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import { useRouter } from "expo-router";
import Animated, {
    FadeInDown,
    FadeInUp,
    withSpring,
} from "react-native-reanimated";

import beachImage from "@/assets/meditation-images/Screenbeach.webp";

const App = () => {
    const router = useRouter();

    return (
        <View className="flex-1">
            <ImageBackground
                source={beachImage}
                resizeMode="cover"
                className="flex-1"
            >
                <AppGradient
                    // Background Linear Gradient
                    colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
                >
                    <SafeAreaView className="flex flex-1 px-1 justify-between">
                        <Animated.View
                            entering={FadeInDown.delay(300)
                                .mass(0.5)
                                .stiffness(80)
                                .springify(20)}
                        >
                            <Text className="text-center text-white font-bold text-4xl">
                                Calm Your mind
                            </Text>
                            <Text className="text-center text-white font-regular text-2xl mt-3">
                                Easy Meditation For You
                            </Text>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInDown.delay(300)
                                .mass(0.5)
                                .stiffness(80)
                                .springify(20)}
                        >
                            <CustomButton
                                onPress={() => router.push("/nature-meditate")}
                                title="Let's Start...."
                            />
                        </Animated.View>

                        <StatusBar style="light" />
                    </SafeAreaView>
                </AppGradient>
            </ImageBackground>
        </View>
    );
};

export default App;
