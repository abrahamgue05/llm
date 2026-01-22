document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatWindow = document.getElementById('chat-window');
  const sendBtn = document.getElementById('send-btn');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // 1. Add User Message to UI
    appendMessage(message, 'user');
    userInput.value = '';
    userInput.focus();

    // 2. Add Loading Indicator
    const loadingId = appendLoading();
    scrollToBottom();

    try {
      // 3. Send to Backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      // 4. Remove Loading and Add Bot Response
      removeLoading(loadingId);

      // Show simulation log if present
      if (data.simulation) {
        appendSimulationLog(data.simulation);
      }

      appendMessage(data.reply, 'bot');

    } catch (error) {
      removeLoading(loadingId);
      appendMessage('Lo siento, hubo un error al procesar tu solicitud.', 'bot');
      console.error('Error:', error);
    }

    scrollToBottom();
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;

    msgDiv.appendChild(contentDiv);
    chatWindow.appendChild(msgDiv);
  }

  function appendSimulationLog(text) {
    const logDiv = document.createElement('div');
    logDiv.classList.add('simulation-log');
    logDiv.textContent = text.trim();
    chatWindow.appendChild(logDiv);
  }

  function appendLoading() {
    const id = 'loading-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'bot-message');
    msgDiv.id = id;

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

    contentDiv.appendChild(typingDiv);
    msgDiv.appendChild(contentDiv);
    chatWindow.appendChild(msgDiv);
    return id;
  }

  function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
