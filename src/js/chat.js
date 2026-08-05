/* ========================================
   KURT AI — Interactive Chat Assistant Module
   ======================================== */

import { spawnToast } from './utils.js';

// Pre-defined knowledge base & responses for Kurt's portfolio assistant
const botKnowledge = [
  {
    keywords: ['ojt', 'deped', 'hris', 'government', 'leave', 'form 6', 'rating', 'hours'],
    response: "During my 342-hour OJT at DepEd San Jose City Division Office, I owned 100% of frontend development for their HRIS Approval System using React 19, Inertia.js, and Tailwind CSS v4. It digitalized paper CS Form No. 6 leave requests across a 3-role approval pipeline (Applicant → Admin → Approver) and earned me a 98/100 performance rating!"
  },
  {
    keywords: ['gym', 'thesis', 'boiyet', 'qr', 'scanner', 'attendance', 'php', 'mysql'],
    response: "Boiyet's Fitness Gym Management System was my solo-built and defended BSCS thesis project! Built with custom PHP, MySQL, AJAX, and JS, it replaced paper sign-in sheets with instant camera QR-code check-ins and gave the owner real-time revenue analytics."
  },
  {
    keywords: ['stack', 'tech', 'languages', 'skills', 'frameworks', 'laravel', 'react', 'tailwind'],
    response: "My primary engineering stack includes **React 19, Inertia.js, Laravel 12, Tailwind CSS v4, PHP, and MySQL**. I am also certified in Java (Oracle Academy) and Cybersecurity (Cisco Networking Academy), and currently expanding into TypeScript & Next.js."
  },
  {
    keywords: ['hire', 'available', 'job', 'role', 'work', 'junior', 'remote', 'fulltime', 'position'],
    response: "Yes! I am officially open to **Junior Developer roles** (Frontend, Full-Stack, or PHP/Laravel/React engineering). I ship clean, production-ready code built for non-technical end users. You can reach out via the contact form or email `kurtfarinas2022@gmail.com`!"
  },
  {
    keywords: ['education', 'college', 'sti', 'degree', 'awards', 'thinkquest', 'tagisan'],
    response: "I graduated with a BS in Computer Science from **STI College San Jose** (Class of 2026). During college, I competed in Tagisan ng Talino ThinkQuest academic competitions — placing 3rd in 2024 and crowning Champion (1st Place) in 2025!"
  },
  {
    keywords: ['minecraft', 'valorant', 'games', 'hobby', 'hobbies', 'music', 'opm', 'server'],
    response: "Off the clock: I play Valorant, run a self-hosted Paper Minecraft server for my friends (tunneled via playit.gg), and keep OPM acoustic playlists on loop while coding!"
  },
  {
    keywords: ['contact', 'email', 'linkedin', 'github', 'reach'],
    response: "You can email me at **kurtfarinas2022@gmail.com**, connect on LinkedIn (Kurt Vincent Fariñas), or check out my code on GitHub (`@kosaki20`)."
  }
];

const defaultFallback = "That's a great question! I'm trained on Kurt's portfolio details. You can ask about his **DepEd OJT experience, Gym thesis system, tech stack, availability to hire, or education** — or drop him a direct message using the contact form below!";

function findBestResponse(userText) {
  const text = userText.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  botKnowledge.forEach(item => {
    let score = 0;
    item.keywords.forEach(kw => {
      if (text.includes(kw)) score += 1;
    });
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item.response;
    }
  });

  return bestMatch || defaultFallback;
}

export function initChatWidget() {
  const launcher = document.getElementById('chatWidgetLauncher');
  const panel = document.getElementById('chatWidgetPanel');
  const closeBtn = document.getElementById('chatWidgetClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatWidgetForm');
  const chatInput = document.getElementById('chatInput');
  const badge = document.getElementById('chatUnreadBadge');

  if (!launcher || !panel) return;

  let isOpen = false;
  let hasOpenedBefore = false;

  function togglePanel(openState) {
    isOpen = typeof openState === 'boolean' ? openState : !isOpen;
    panel.classList.toggle('active', isOpen);
    launcher.classList.toggle('active', isOpen);
    if (badge) badge.style.display = 'none';

    if (isOpen) {
      if (!hasOpenedBefore) {
        hasOpenedBefore = true;
        spawnToast('KURT AI ACTIVE', 'Ask any question about Kurt\'s experience or stack!');
      }
      setTimeout(() => chatInput?.focus(), 250);
    }
  }

  launcher.addEventListener('click', () => togglePanel());
  closeBtn?.addEventListener('click', () => togglePanel(false));

  function addMessage(sender, text, isHtml = true) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender === 'user' ? 'msg-user' : 'msg-bot'}`;

    const avatarHtml = sender === 'bot'
      ? `<div class="msg-avatar">KF</div>`
      : `<div class="msg-avatar user-avatar">YOU</div>`;

    const contentHtml = `<div class="msg-text">${isHtml ? formatMarkdown(text) : escapeHtml(text)}</div>`;

    msgDiv.innerHTML = sender === 'bot' ? avatarHtml + contentHtml : contentHtml + avatarHtml;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg msg-bot typing-indicator-msg';
    typingDiv.id = 'chatTypingIndicator';
    typingDiv.innerHTML = `
      <div class="msg-avatar">KF</div>
      <div class="msg-text typing-text">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>`;
    chatMessages?.appendChild(typingDiv);
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();
  }

  function handleUserSubmit(text) {
    const query = text.trim();
    if (!query) return;

    addMessage('user', query, false);
    if (chatInput) chatInput.value = '';

    showTypingIndicator();

    const responseText = findBestResponse(query);
    const delay = Math.min(1200, 400 + query.length * 15);

    setTimeout(() => {
      removeTypingIndicator();
      addMessage('bot', responseText, true);
    }, delay);
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput) handleUserSubmit(chatInput.value);
  });

  // Global handler for chip prompt clicks
  window.sendQuickPrompt = function(promptText) {
    if (!isOpen) togglePanel(true);
    handleUserSubmit(promptText);
  };
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMarkdown(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}
