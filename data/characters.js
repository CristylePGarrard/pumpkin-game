const characters = [
    {
        id: "pumpkin",
        name: "Pumpkin",

        states: {
            idle: "🎃",
            asking: "🎃",
            happy: "😋",
            angry: "😠"
        },

        dialogue: {
            requests: [
                {
                    text: "Give me the milk!",
                    audio: "assets/sounds/dialogue/pumpkin/milk.mp3",
                    correctItem: "milk"
                },

                {
                    text: "I want an apple!",
                    audio: "assets/sounds/dialogue/pumpkin/apple.mp3",
                    correctItem: "apple"
                },

                {
                    text: "Give me a burger!",
                    audio: "assets/sounds/dialogue/pumpkin/burger.mp3",
                    correctItem: "burger"
                },

                {
                    text: "Can I have a carrot?",
                    audio: "assets/sounds/dialogue/pumpkin/carrot.mp3",
                    correctItem: "carrot"
                }
            ],

            happy: [
                {
                    text: "Yum!",
                    audio: "assets/sounds/dialogue/pumpkin/yum1.mp3"
                },

                {
                    text: "Mmmm!",
                    audio: "assets/sounds/dialogue/pumpkin/yum2.mp3"
                },

                {
                    text: "Delicious!",
                    audio: "assets/sounds/dialogue/pumpkin/yum3.mp3"
                },

                {
                    text: "Nom nom nom!",
                    audio: "assets/sounds/dialogue/pumpkin/yum4.mp3"
                }
            ],

            wrong: [
                {
                    text: "I don't want that!",
                    audio: "assets/sounds/dialogue/pumpkin/wrong1.mp3"
                },

                {
                    text: "Ewwww!",
                    audio: "assets/sounds/dialogue/pumpkin/wrong2.mp3"
                },

                {
                    text: "That's not what I asked for!",
                    audio: "assets/sounds/dialogue/pumpkin/wrong3.mp3"
                },

                {
                    text: "NOPE!",
                    audio: "assets/sounds/dialogue/pumpkin/wrong4.mp3"
                },

                {
                    text: "Are you even listening to me?",
                    audio: "assets/sounds/dialogue/pumpkin/wrong5.mp3"
                },

                {
                    text: "I can't eat that!",
                    audio: "assets/sounds/dialogue/pumpkin/wrong6.mp3"
                }
            ]
        },

        sounds: {
            eating: [
                "assets/sounds/eating/pumpkin/eat1.mp3",
                "assets/sounds/eating/pumpkin/eat2.mp3",
                "assets/sounds/eating/pumpkin/eat3.mp3"
            ]
        }
    }
];
