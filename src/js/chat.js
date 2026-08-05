/* ========================================
   KURT AI — Professional Interactive Assistant
   ======================================== */

import { spawnToast } from './utils.js';

// Enhanced knowledge base with weighted scoring & follow-up suggestion chips
const botKnowledge = [
  {
    category: 'hris',
    keywords: ['ojt', 'deped', 'hris', 'government', 'leave', 'form 6', 'cs form', 'approval', 'rating', 'hours', 'department of education'],
    response: "During my 342-hour internship at the Department of Education (DepEd San Jose City Division Office), I served as the **lead frontend developer** for the DepEd HRIS Approval System. I engineered a three-role workflow (Applicant → Admin → Approver) using React 19, Inertia.js, and Tailwind CSS v4, replacing a paper-based leave application process and earning a **98/100 performance evaluation**.",
    followUps: ["Tell me about the Gym thesis system", "What is your primary tech stack?", "Are you open to full-time roles?"]
  },
  {
    category: 'gym',
    keywords: ['gym', 'thesis', 'boiyet', 'qr', 'scanner', 'attendance', 'php', 'mysql', 'fullstack', 'full-stack', 'client', 'revenue'],
    response: "For my Computer Science thesis, I solo-engineered a commercial **Gym Management & Attendance System** for Boiyet's Fitness Gym. Built with custom PHP, MySQL, and AJAX, the platform replaced manual sign-in ledgers with real-time camera QR check-ins, automated membership expiration alerts, and provided an executive revenue analytics dashboard.",
    followUps: ["What was your role in DepEd HRIS?", "What technologies do you use?", "How can I contact Kurt?"]
  },
  {
    category: 'stack',
    keywords: ['stack', 'tech', 'languages', 'frameworks', 'laravel', 'react', 'tailwind', 'php', 'mysql', 'javascript', 'java', 'cisco', 'css'],
    response: "Kurt's core production stack features **React 19, Inertia.js, Laravel 12, Tailwind CSS v4, PHP, and MySQL**. He holds official certifications in Java Fundamentals (Oracle Academy) and Cybersecurity (Cisco Networking Academy), and is currently expanding into TypeScript, Next.js, and Docker.",
    followUps: ["Tell me about his DepEd OJT work", "Has he defended a thesis?", "View work availability"]
  },
  {
    category: 'hiring',
    keywords: ['hire', 'available', 'job', 'role', 'work', 'junior', 'remote', 'fulltime', 'full-time', 'position', 'relocate', 'onsite', 'start'],
    response: "Kurt is a BS Computer Science graduate actively seeking **Junior Developer seats (Frontend, Full-Stack, or PHP/Laravel/React development)**. He is ready to contribute production-ready code immediately and is open to remote, hybrid, or onsite arrangements.",
    followUps: ["How can I contact Kurt?", "Download Kurt's CV", "What is his tech stack?"]
  },
  {
    category: 'education',
    keywords: ['education', 'college', 'sti', 'degree', 'awards', 'thinkquest', 'tagisan', 'gpa', 'certifications', 'cisco', 'oracle'],
    response: "Kurt earned his Bachelor of Science in Computer Science from **STI College San Jose** (Class of 2026). He won 1st Place (Champion) in the 2025 STI ThinkQuest academic competition and 3rd Place in 2024, alongside earning Cisco Cybersecurity and Oracle Java certifications.",
    followUps: ["What systems has he built?", "View work availability", "Get contact information"]
  },
  {
    category: 'contact',
    keywords: ['contact', 'email', 'linkedin', 'github', 'reach', 'message', 'phone'],
    response: "You can reach Kurt directly via email at **kurtfarinas2022@gmail.com**, connect on LinkedIn at **linkedin.com/in/kurt-vincent-fariñas**, or review his source code on GitHub at **github.com/kosaki20**.",
    followUps: ["Are you open to full-time roles?", "Tell me about his tech stack", "Download CV"]
  },
  {
    category: 'architecture',
    keywords: ['architecture', 'pattern', 'inertia', 'api', 'backend', 'frontend', 'design', 'database', 'schema'],
    response: "Kurt specializes in **Inertia.js monoliths and RESTful API integrations**, combining the rapid developer velocity of Laravel backend controllers with component-driven React interfaces. He prioritizes responsive UI design, defensive input validation, and relational MySQL schema normalization.",
    followUps: ["What was his DepEd HRIS project?", "What is his thesis project?", "View primary tech stack"]
  }
];

const fallbackResponse = {
  response: "I can provide details regarding Kurt's engineering background. You can ask about his **DepEd HRIS government system, Boiyet's Gym thesis platform, primary tech stack, academic background, or work availability**.",
  followUps: ["DepEd HRIS System", "Gym Management Platform", "Primary Tech Stack", "Work Availability"]
};

function scoreKnowledgeMatch(userText) {
  const text = userText.toLowerCase();
  let maxScore = 0;
  let bestMatch = null;

  botKnowledge.forEach(item => {
    let score = 0;
    item.keywords.forEach(kw => {
      if (text.includes(kw)) {
        score += kw.length > 4 ? 2 : 1; // Give extra weight to longer, specific technical keywords
      }
    });
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  });

  return (maxScore > 0 && bestMatch) ? bestMatch : fallbackResponse;
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
        spawnToast('ASSISTANT READY', 'Ask any question regarding Kurt\'s technical background.');
      }
      setTimeout(() => chatInput?.focus(), 250);
    }
  }

  launcher.addEventListener('click', () => togglePanel());
  closeBtn?.addEventListener('click', () => togglePanel(false));

  function addMessage(sender, text, isHtml = true, followUps = []) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender === 'user' ? 'msg-user' : 'msg-bot'}`;

    const avatarHtml = sender === 'bot'
      ? `<div class="msg-avatar">KF</div>`
      : `<div class="msg-avatar user-avatar">YOU</div>`;

    let contentHtml = `<div class="msg-text">${isHtml ? formatMarkdown(text) : escapeHtml(text)}`;

    // Add suggested follow-up chips if present
    if (sender === 'bot' && followUps && followUps.length > 0) {
      contentHtml += `<div class="msg-followups">`;
      followUps.forEach(chipText => {
        contentHtml += `<button type="button" class="chat-followup-chip" onclick="sendQuickPrompt('${escapeHtml(chipText)}')">${escapeHtml(chipText)}</button>`;
      });
      contentHtml += `</div>`;
    }
    contentHtml += `</div>`;

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

    const match = scoreKnowledgeMatch(query);
    const delay = Math.min(1000, 350 + query.length * 12);

    setTimeout(() => {
      removeTypingIndicator();
      addMessage('bot', match.response, true, match.followUps);
    }, delay);
  }

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput) handleUserSubmit(chatInput.value);
  });

  window.sendQuickPrompt = function(promptText) {
    if (!isOpen) togglePanel(true);
    handleUserSubmit(promptText);
  };
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatMarkdown(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}
