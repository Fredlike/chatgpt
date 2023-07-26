const chatLog = document.getElementById("chat-log");
const inputText = document.getElementById("input-text");
const sendButton = document.getElementById("send-button");
const clearButton = document.getElementById("clear-button");

function displayMessage(message, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(isUser ? "user-message" : "ai-message");
  messageDiv.textContent = message;
  chatLog.appendChild(messageDiv);
}

async function typeWriterEffect(text) {
  const delay = 50; // Delay between each character (in milliseconds)

  for (const char of text) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    chatLog.lastChild.textContent += char;
  }
}

async function sendMessage() {
  const question = inputText.value.trim();
  if (!question) return;

  displayMessage(question, true);
  inputText.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "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", // Replace with your actual API key
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const answer = data.answer;
    typeWriterEffect(answer); // Show the response using typewriter effect
  } catch (error) {
    console.error("Error:", error);
    displayMessage("Sorry, an error occurred while processing your request.");
  }
}

function clearChat() {
  chatLog.innerHTML = "";
}

inputText.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

sendButton.addEventListener("click", sendMessage);
clearButton.addEventListener("click", clearChat);
