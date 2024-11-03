// Prompt storage
const prompts: { [key: number]: string[] } = {
    '-5': [
        "It sounds like today’s been tough. Want to share what’s on your mind? I’m here for you!",
        "I’m so sorry you’re feeling down. What’s one small thing that helped you get through today?",
        "Even on the hardest days, you’re stronger than you realize. What’s one thing that gave you hope today?",
        "It’s okay to feel this way. How did you take care of yourself today? I’d love to hear about it!",
        "You’ve been through a lot today. Let’s talk about how you managed to keep going."
    ],
    '-4': [
        "It sounds like today was a bit rough. What was the hardest part, and how did you handle it?",
        "You’ve faced some challenges today, but you’re still here! What’s something you did to cope?",
        "Even on sad days, you’re doing your best. What’s one thing that helped you keep going?",
        "I know things were difficult, but you’ve made it through! Can you share how you got through today?",
        "Let’s talk about today. What was one moment that was especially hard, but you made it through?"
    ],
    '-3': [
        "Today might’ve been a little gloomy, but you did your best. What was one moment that felt a little brighter?",
        "I’m sure today wasn’t easy, but you’ve done well. What helped you lift your spirits, even if just a bit?",
        "You’re doing great, even on tough days. Can you share one small victory you had today?",
        "I know it’s been a hard day, but I’m proud of you. What’s one thing that helped you get by?",
        "Some days are harder than others. What’s something that gave you comfort today?"
    ],
    '-2': [
        "It seems like today was a bit low, but you’re handling it. What’s something you’re proud of from today?",
        "You’ve faced today’s challenges head-on. What’s one thing that made the day feel a little better?",
        "Even when things feel off, you’re doing your best. What helped you through today?",
        "I can tell today wasn’t perfect, but you’ve come far. What’s one moment you felt even a little lighter?",
        "Let’s reflect on today. What’s something you did to bring a little positivity into your day?"
    ],
    '-1': [
        "Today might’ve been a little flat, but you’ve got this. What’s something you did that you’re proud of?",
        "Even on days that aren’t great, you’re making progress. What’s one thing that kept you going?",
        "You’ve done your best today, even if it felt a bit low. What’s something you appreciate about today?",
        "It sounds like today was a bit off, but you’ve kept going. What’s one thing that brought you peace?",
        "Not every day feels great, but you’re still here. What’s one small moment of joy from today?"
    ],
    '0': [
        "Today seems like it was pretty steady. Want to share one thing that felt just right?",
        "A neutral day can still be a good day! What’s one thing that made today go smoothly?",
        "Even when things feel balanced, there’s always something to reflect on. What’s one small win today?",
        "A steady day is sometimes just what we need. What’s something that kept you grounded today?",
        "It sounds like things were calm today. What’s one thing that brought you a sense of peace?"
    ],
    '1': [
        "It sounds like today had a little spark! What’s something that made you smile?",
        "You’re doing well today! What’s one small thing that lifted your spirits?",
        "Today felt a bit brighter! What’s something that added a little joy to your day?",
        "It seems like you had some good moments today. What’s one thing that gave you a boost?",
        "Even small victories matter! What’s one little thing that made today feel good?"
    ],
    '2': [
        "You’re feeling good today! What’s something that made your day even better?",
        "It seems like today was a good one! What’s something you’re proud of?",
        "You’ve had a positive day! Want to share one moment that stood out?",
        "I’m glad you had a good day! What’s something that made today feel special?",
        "Today was a solid day! What’s one thing that added to the good vibes?"
    ],
    '3': [
        "It sounds like today was pretty great! What’s one thing that really made you smile?",
        "I love hearing that you had a good day! What’s something that brought you joy?",
        "Today seems like it was full of good vibes! What’s one highlight you want to share?",
        "You’ve had a joyful day! What’s one thing that made you feel really happy?",
        "It’s wonderful that today went so well! What’s one moment you’ll want to remember?"
    ],
    '4': [
        "Today sounds amazing! What’s something that made you feel really excited?",
        "You’re feeling great today! What’s one thing that made your heart feel full?",
        "It’s awesome to hear today was so happy! What’s something that made it truly special?",
        "I’m so glad today was filled with joy! Want to share one moment that was unforgettable?",
        "Today was full of happiness! What’s something that made you feel on top of the world?"
    ],
    '5': [
        "Wow, today was incredible! What’s one thing that made you feel on cloud nine?",
        "It sounds like you’re on top of the world today! What’s something that made today extraordinary?",
        "I love hearing how amazing today was! What’s one thing that made you feel unstoppable?",
        "You’ve had an incredible day! What’s one moment that filled your heart with joy?",
        "Today sounds like it was perfect! What’s something that made it one of your best days ever?"
    ],
    '10': [
        "Hi! I’m happy to see you 😊",
        "Hey! So glad you stopped by 💫",
        "Hey! Ready to make today a little brighter together? 🌞",
        "Hi! I’m excited to hear about your day 🌈",
    ]
};


export const getRandomPrompt = (emotionValue: number) => {
    const promptsForEmotion = prompts[emotionValue] || [];
    if (promptsForEmotion.length > 0) {
        const randomIndex = Math.floor(Math.random() * promptsForEmotion.length);
        return promptsForEmotion[randomIndex];
    }
    return "You're doing great!";
};