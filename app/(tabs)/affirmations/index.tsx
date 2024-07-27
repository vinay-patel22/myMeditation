import GuidedAffirmationsGallery from "@/components/GuidedAffirmationsGallery";
import AFFIRMATION_GALLERY from "@/constants/affirmation-gallary";
import images from "@/constants/affirmation-images";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Page = () => {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1">
            <LinearGradient
                // Background Linear Gradient
                colors={["#2e1f58", "#54426b", "#a790af"]}
                className="px-5"
                style={{ paddingTop: insets.top }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-zinc-50 text-3xl font-bold">
                        Change your beliefs with powerful affirmations
                    </Text>
                    <View>
                        {AFFIRMATION_GALLERY.map((g) => (
                            <GuidedAffirmationsGallery
                                key={g.title}
                                title={g.title}
                                products={g.data}
                            />
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
            <StatusBar style="light" />
        </View>
    );
};

const galleryData = [
    {
        title: "Positivity",
        data: [
            {
                id: 1,
                name: "test",
                image: images.PositivityOne,
            },
            {
                id: 2,
                name: "test",
                image: images.PositivityTwo,
            },
            {
                id: 3,
                name: "test",
                image: images.PositivityThree,
            },
            {
                id: 4,
                name: "test",
                image: images.PositivityFour,
            },
        ],
    },
    {
        title: "Reduce Anxiety",
        data: [
            {
                id: 1,
                name: "test",
                image: images.ReduceAnxietyOne,
            },
            {
                id: 2,
                name: "test",
                image: images.ReduceAnxietyTwo,
            },
            {
                id: 3,
                name: "test",
                image: images.ReduceAnxietyThree,
            },
            {
                id: 4,
                name: "test",
                image: images.ReduceAnxietyFour,
            },
        ],
    },
    {
        title: "Success",
        data: [
            {
                id: 1,
                name: "test",
                image: images.SuccessOne,
            },
            {
                id: 2,
                name: "test",
                image: images.SuccessTwo,
            },
            {
                id: 3,
                name: "test",
                image: images.SuccessThree,
            },
            {
                id: 4,
                name: "test",
                image: images.SuccessFour,
            },
        ],
    },
    {
        title: "Self-Belief",
        data: [
            {
                id: 1,
                name: "test",
                image: images.SelfBeliefOne,
            },
            {
                id: 2,
                name: "test",
                image: images.SelfBeliefTwo,
            },
            {
                id: 3,
                name: "test",
                image: images.SelfBeliefThree,
            },
            {
                id: 4,
                name: "test",
                image: images.SelfBeliefFour,
            },
        ],
    },
    {
        title: "Mental Health",
        data: [
            {
                id: 1,
                name: "test",
                image: images.MentalHealthOne,
            },
            {
                id: 2,
                name: "test",
                image: images.MentalHealthTwo,
            },
            {
                id: 3,
                name: "test",
                image: images.MentalHealthThree,
            },
            {
                id: 4,
                name: "test",
                image: images.MentalHealthFour,
            },
        ],
    },
    {
        title: "Law of Attraction",
        data: [
            {
                id: 1,
                name: "test",
                image: images.LawofAttractionOne,
            },
            {
                id: 2,
                name: "test",
                image: images.LawofAttractionTwo,
            },
            {
                id: 3,
                name: "test",
                image: images.LawofAttractionThree,
            },
            {
                id: 4,
                name: "test",
                image: images.LawofAttractionFour,
            },
        ],
    },
    {
        title: "Limiting Beliefs",
        data: [
            {
                id: 1,
                name: "test",
                image: images.LimitingBeliefsOne,
            },
            {
                id: 2,
                name: "test",
                image: images.LimitingBeliefsTwo,
            },
            {
                id: 3,
                name: "test",
                image: images.LimitingBeliefsThree,
            },
            {
                id: 4,
                name: "test",
                image: images.LimitingBeliefsFour,
            },
        ],
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
});

export default Page;
