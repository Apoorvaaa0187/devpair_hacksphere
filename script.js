const API_KEY = "AIzaSyAr0RiT4gA2muZuZkj85eT-_cG6cUELaxU";  // Replace with your actual API key
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

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
    window.speechSynthesis.getVoices(); // Load voices early
});

// ✅ Motivational Quotes (Slider Feature Can Be Added)
const quotes = [
    "Believe in yourself and all that you are!",
    "Every day is a second chance.",
    "The only way to do great work is to love what you do.",
    "Push yourself, because no one else is going to do it for you.",
    "Your limitation—it’s only your imagination."
];

function generateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quote").textContent = quotes[randomIndex];
}

// ✅ Task Reminders
function addReminder() {
    const reminderInput = document.getElementById("reminderInput").value;
    if (reminderInput.trim() === "") {
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
    deleteButton.onclick = function () {
        reminderList.removeChild(li);
    };

    li.appendChild(deleteButton);
    reminderList.appendChild(li);

    document.getElementById("reminderInput").value = ""; // Clear input field
}

// ✅ AI Chatbot Configuration
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// ✅ Text-to-Speech Function
function speakText(text) {
    if (!'speechSynthesis' in window) {
        console.error("Speech Synthesis API is not supported in this browser.");
        return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1;  // Adjust speed (1 is normal)
    speech.pitch = 1; // Adjust pitch (1 is normal)
    speech.volume = 1; // Volume control (0 to 1)

    // Ensure voices are loaded before speaking
    window.speechSynthesis.onvoiceschanged = function () {
        console.log("Speech voices updated!");
    };

    setTimeout(() => {
        window.speechSynthesis.speak(speech);
    }, 300);
}

// ✅ Function to Fetch AI Response
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

// ✅ Function to Remove Markdown from AI Response
function cleanMarkdown(text) {
    return text.replace(/#{1,6}\s?/g, '').replace(/\\/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

// ✅ Function to Add Messages to Chatbox
function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    // Create Profile Image Element
    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user_image.jpg' : 'bot_image.jpg'; // Ensure these files exist in your project folder
    profileImage.alt = isUser ? 'User' : 'Bot';

    // Create Message Content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    // Append Profile Image and Message Content
    if (isUser) {
        messageElement.appendChild(messageContent);
        messageElement.appendChild(profileImage); // User image on the right
    } else {
        messageElement.appendChild(profileImage); // Bot image on the left
        messageElement.appendChild(messageContent);
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Speak Bot Message
    if (!isUser) {
        speakText(message);
    }
}

// ✅ Function to Handle User Input in Chatbot
async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;

    try {
        const botMessage = await generateResponse(userMessage);
        addMessage(cleanMarkdown(botMessage), false);
    } catch (error) {
        addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

// ✅ Event Listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});