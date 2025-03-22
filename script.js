// Show Sections Based on Navigation Click
function showSection(sectionId) {
    document.querySelectorAll('.content').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Display Home Section by Default
document.addEventListener("DOMContentLoaded", function () {
    showSection('home');
});

// ✅ Motivational Quotes with Text-to-Speech
const quotes = [
    "Believe in yourself and all that you are!",
    "Every day is a second chance.",
    "The only way to do great work is to love what you do.",
    "Push yourself, because no one else is going to do it for you.",
    "Your limitation—it’s only your imagination."
];

function generateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteText = quotes[randomIndex];
    document.getElementById("quote").textContent = quoteText;
    speakText(quoteText); // Speak the quote
}

// ✅ Task Reminders with Delete Option
function addReminder() {
    const reminderInput = document.getElementById("reminderInput").value.trim();
    if (reminderInput === "") {
        alert("Please enter a reminder!");
        return;
    }

    const reminderList = document.getElementById("reminderList");
    const li = document.createElement("li");
    li.textContent = reminderInput;

    // Delete Button for Reminder
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌";
    deleteButton.style.marginLeft = "10px";
    deleteButton.onclick = function() {
        reminderList.removeChild(li);
    };

    li.appendChild(deleteButton);
    reminderList.appendChild(li);
    
    document.getElementById("reminderInput").value = ""; // Clear input field
}

// ✅ AI Chatbot Configuration
const API_KEY = 'AIzaSyAr0RiT4gA2muZuZkj85eT-_cG6cUELaxU';  // ❗ Replace securely
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to Fetch AI Response
async function generateResponse(prompt) {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate response');
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
    } catch (error) {
        console.error('Error:', error);
        return "Oops! Something went wrong. Please try again later.";
    }
}

// Function to Clean AI Response
function cleanMarkdown(text) {
    return text.replace(/#{1,6}\s?/g, '')
               .replace(/[*_~]/g, '') // Removes markdown symbols
               .replace(/\n{2,}/g, '\n') // Normalize line breaks
               .trim();
}

// Function to Add Messages to Chatbox
function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    // Create Profile Image Element
    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.jpg' : 'bot.jpg'; // Replace with correct paths
    profileImage.alt = isUser ? 'User' : 'Bot';

    // Create Message Content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    // Append Profile Image and Message Content
    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to Handle User Input in Chatbot
async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;

    try {
        const botMessage = await generateResponse(userMessage);
        const cleanedMessage = cleanMarkdown(botMessage);
        addMessage(cleanedMessage, false);
        speakText(cleanedMessage); // Speak AI response
    } catch (error) {
        addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

// ✅ Event Listeners for Chatbot
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});

// ✅ TEXT-TO-SPEECH FUNCTION
function speakText(text) {
    if (!window.speechSynthesis) {
        console.warn("Text-to-Speech is not supported in this browser.");
        return;
    }

    let utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;  // Slower pace for a soothing voice
    utterance.pitch = 1.1; // Slightly high pitch for a calm tone
    utterance.volume = isMuted ? 0 : 1; // Control mute/unmute

    // Select a female voice dynamically
    let voices = speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.name.includes("Female") || voice.name.includes("Google UK English Female")) || voices[0];

    speechSynthesis.speak(utterance);
}

// ✅ MUTE/UNMUTE TOGGLE BUTTON
let isMuted = false;
function toggleMute() {
    isMuted = !isMuted;
    document.getElementById("mute-button").textContent = isMuted ? "Unmute" : "Mute";
}

// Add Mute/Unmute Button
let muteButton = document.createElement("button");
muteButton.id = "mute-button";
muteButton.textContent = "Mute";
muteButton.style.position = "fixed";
muteButton.style.bottom = "20px";
muteButton.style.right = "20px";
muteButton.style.padding = "10px 20px";
muteButton.style.borderRadius = "8px";
muteButton.style.backgroundColor = "#58a6ff";
muteButton.style.color = "white";
muteButton.style.border = "none";
muteButton.style.cursor = "pointer";
muteButton.onclick = toggleMute;

document.body.appendChild(muteButton);
