export interface MeditationType {
    id: number;
    title: string;
    image: string;
    audio: string;
}

export const MEDITATION_DATA: MeditationType[] = [
    {
        id: 1,
        title: "BK Suraj Bhai ji",
        image: "bksurajbhaiji.jpg",
        audio: "bksurajbhaiji.mp3",
    },
    {
        id: 2,
        title: "BK Shivani Didi",
        image: "bkshivanididi.jpg",
        audio: "BKShivani.mp3",
    },
    {
        id: 3,
        title: "BK Sachin Bhai ji",
        image: "bksachinbhaiji.jpg",
        audio: "bksachinbhaiji.mp3",
    },
    {
        id: 4,
        title: "BK Usha Didi",
        image: "bkushadidi.jpg",
        audio: "bkushadidi.mp3",
    },
    {
        id: 5,
        title: "English Meditation Commentary",
        image: "bkenglish.jpg",
        audio: "bkenglish.mp3",
    },
    {
        id: 6,
        title: "BK Sheilu Behan",
        image: "bksheiludidi.jpg",
        audio: "bksheiludidi.mp3",
    },
];

export const AUDIO_FILES: { [key: string]: any } = {
    "bksurajbhaiji.mp3": require("@/assets/audio/bksurajbhaiji.mp3"),
    "BKShivani.mp3": require("@/assets/audio/BKShivani.mp3"),
    "bksachinbhaiji.mp3": require("@/assets/audio/bksachinbhaiji.mp3"),
    "bkushadidi.mp3": require("@/assets/audio/bkushadidi.mp3"),
    "bkenglish.mp3": require("@/assets/audio/bkenglish.mp3"),
    "bksheiludidi.mp3": require("@/assets/audio/bksheiludidi.mp3"),
};
