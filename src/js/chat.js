/* ========================================
   KURT AI — Interactive Assistant & Page Controller
   ======================================== */

import { spawnToast } from './utils.js';

// Global action registry for interactive buttons in bot messages
window.chatActionRegistry = {};

// Knowledge base with page control actions, inline action buttons, & weighted intent scoring
const botKnowledge = [
  {
    category: 'hris',
    keywords: ['ojt', 'deped', 'hris', 'government', 'leave', 'form 6', 'cs form', 'approval', 'rating', 'hours', 'department of education'],
    response: "During my 342-hour internship at DepEd San Jose City Division Office, I served as lead frontend developer for the **DepEd HRIS Approval System** using React 19, Inertia.js, and Tailwind CSS v4.",
    action: () => {
      window.openProjectModal?.('hris');
    },
    actionButtons: [
      { label: "Open HRIS Architecture Modal →", actionId: "open_hris_modal" }
    ],
    followUps: ["Tell me about the Gym thesis system", "What is your primary tech stack?", "Are you open to full-time roles?"]
  },
  {
    category: 'gym',
    keywords: ['gym', 'thesis', 'boiyet', 'qr', 'scanner', 'attendance', 'php', 'mysql', 'fullstack', 'full-stack', 'client', 'revenue'],
    response: "**Boiyet's Fitness Gym Management System** was my solo-built and defended BSCS thesis project! Built with custom PHP, MySQL, and AJAX, it replaced paper sign-in ledgers with real-time camera QR check-ins.",
    action: () => {
      window.openProjectModal?.('gym');
    },
    actionButtons: [
      { label: "Open Gym Platform Modal →", actionId: "open_gym_modal" }
    ],
    followUps: ["What was your role in DepEd HRIS?", "What technologies do you use?", "How can I contact Kurt?"]
  },
  {
    category: 'resume',
    keywords: ['resume', 'cv', 'curriculum', 'download cv', 'pdf', 'preview cv', 'view cv', 'show cv'],
    response: "I have launched the **inline PDF Resume viewer** for you. You can inspect Kurt's full technical qualifications directly on screen or download a copy.",
    action: () => {
      window.openResumeModal?.();
    },
    actionButtons: [
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" },
      { label: "Download Resume PDF", actionId: "download_resume" }
    ],
    followUps: ["Tell me about his DepEd OJT work", "What is his primary tech stack?", "Are you open to full-time roles?"]
  },
  {
    category: 'contact',
    keywords: ['contact', 'email', 'linkedin', 'github', 'reach', 'message', 'phone', 'send message'],
    response: "I have navigated to the contact section and focused the message form for you. You can also email Kurt directly at **kurtfarinas2022@gmail.com**.",
    action: () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => document.getElementById('contactName')?.focus(), 500);
    },
    actionButtons: [
      { label: "Focus Message Form →", actionId: "focus_contact" },
      { label: "Copy Email Address", actionId: "copy_email" }
    ],
    followUps: ["Are you open to full-time roles?", "Tell me about his tech stack", "Download CV"]
  },
  {
    category: 'stack',
    keywords: ['stack', 'tech', 'languages', 'frameworks', 'laravel', 'react', 'tailwind', 'php', 'mysql', 'javascript', 'java', 'cisco', 'css'],
    response: "Kurt's core production stack features **React 19, Inertia.js, Laravel 12, Tailwind CSS v4, PHP, and MySQL**. He holds official certifications in Java Fundamentals (Oracle Academy) and Cybersecurity (Cisco Networking Academy).",
    action: () => {
      const skillsEl = document.getElementById('skills');
      if (skillsEl) skillsEl.scrollIntoView({ behavior: 'smooth' });
    },
    actionButtons: [
      { label: "View Stack Section →", actionId: "scroll_skills" },
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" }
    ],
    followUps: ["Tell me about his DepEd OJT work", "Has he defended a thesis?", "View work availability"]
  },
  {
    category: 'theme',
    keywords: ['theme', 'emerald', 'cyan', 'orange', 'violet', 'color', 'accent'],
    response: "Theme accent updated! I have dynamically modified the portfolio CSS custom properties for you.",
    action: (userText) => {
      const text = userText.toLowerCase();
      if (text.includes('emerald')) window.setThemeAccent?.('emerald');
      else if (text.includes('cyan')) window.setThemeAccent?.('cyan');
      else if (text.includes('orange')) window.setThemeAccent?.('orange');
      else window.setThemeAccent?.('violet');
    },
    actionButtons: [
      { label: "Set Violet Theme", actionId: "theme_violet" },
      { label: "Set Emerald Theme", actionId: "theme_emerald" },
      { label: "Set Cyan Theme", actionId: "theme_cyan" }
    ],
    followUps: ["Show me your primary tech stack", "View DepEd HRIS project", "Preview Resume PDF"]
  },
  {
    category: 'hiring',
    keywords: ['hire', 'available', 'job', 'role', 'work', 'junior', 'remote', 'fulltime', 'full-time', 'position', 'relocate', 'onsite', 'start'],
    response: "Kurt is a BS Computer Science graduate actively seeking **Junior Developer seats (Frontend, Full-Stack, or PHP/Laravel/React development)**. He is ready to contribute production-ready code immediately and is open to remote, hybrid, or onsite arrangements.",
    action: () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
    },
    actionButtons: [
      { label: "Go to Contact Form →", actionId: "focus_contact" },
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" }
    ],
    followUps: ["How can I contact Kurt?", "Download Kurt's CV", "What is his tech stack?"]
  },
  {
    category: 'education',
    keywords: ['education', 'college', 'sti', 'degree', 'awards', 'thinkquest', 'tagisan', 'gpa', 'certifications', 'cisco', 'oracle'],
    response: "Kurt earned his Bachelor of Science in Computer Science from **STI College San Jose** (Class of 2026). He won 1st Place (Champion) in the 2025 STI ThinkQuest academic competition and 3rd Place in 2024.",
    action: () => {
      const awardsEl = document.getElementById('awards');
      if (awardsEl) awardsEl.scrollIntoView({ behavior: 'smooth' });
    },
    actionButtons: [
      { label: "View Awards Section →", actionId: "scroll_awards" }
    ],
    followUps: ["What systems has he built?", "View work availability", "Get contact information"]
  }
];

// Initialize global action handlers
window.chatActionRegistry = {
  open_hris_modal: () => window.openProjectModal?.('hris'),
  open_gym_modal: () => window.openProjectModal?.('gym'),
  open_resume_modal: () => window.openResumeModal?.(),
  download_resume: () => {
    const link = document.createElement('a');
    link.href = 'resume.pdf';
    link.download = 'resume.pdf';
    link.click();
    spawnToast('DOWNLOAD STARTED', 'Downloading Kurt Fariñas Resume PDF');
  },
  focus_contact: () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('contactName')?.focus(), 500);
  },
  copy_email: () => window.copyEmail?.(),
  scroll_skills: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }),
  scroll_awards: () => document.getElementById('awards')?.scrollIntoView({ behavior: 'smooth' }),
  theme_violet: () => window.setThemeAccent?.('violet'),
  theme_emerald: () => window.setThemeAccent?.('emerald'),
  theme_cyan: () => window.setThemeAccent?.('cyan')
};

window.triggerChatAction = function(actionId) {
  if (window.chatActionRegistry[actionId]) {
    window.chatActionRegistry[actionId]();
  }
};

const fallbackResponse = {
  response: "I can provide details regarding Kurt's engineering background. You can ask about his **DepEd HRIS government system, Boiyet's Gym thesis platform, primary tech stack, academic credentials, or full-time availability**.",
  action: null,
  actionButtons: [
    { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" },
    { label: "Go to Contact Form →", actionId: "focus_contact" }
  ],
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
        score += kw.length > 4 ? 2 : 1;
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
        spawnToast('ASSISTANT READY', 'Kurt AI can answer questions and trigger actions for you.');
      }
      setTimeout(() => chatInput?.focus(), 250);
    }
  }

  launcher.addEventListener('click', () => togglePanel());
  closeBtn?.addEventListener('click', () => togglePanel(false));

  function addMessage(sender, text, isHtml = true, followUps = [], actionButtons = []) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender === 'user' ? 'msg-user' : 'msg-bot'}`;

    const avatarHtml = sender === 'bot'
      ? `<div class="msg-avatar">KF</div>`
      : `<div class="msg-avatar user-avatar">YOU</div>`;

    let contentHtml = `<div class="msg-text">${isHtml ? formatMarkdown(text) : escapeHtml(text)}`;

    // Render interactive inline action buttons inside message bubble
    if (sender === 'bot' && actionButtons && actionButtons.length > 0) {
      contentHtml += `<div class="msg-action-btns">`;
      actionButtons.forEach(btn => {
        contentHtml += `<button type="button" class="chat-action-btn" onclick="triggerChatAction('${btn.actionId}')">${escapeHtml(btn.label)}</button>`;
      });
      contentHtml += `</div>`;
    }

    // Render suggested follow-up chips below
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
    const delay = Math.min(900, 300 + query.length * 10);

    setTimeout(() => {
      removeTypingIndicator();
      addMessage('bot', match.response, true, match.followUps, match.actionButtons);

      // Execute background action if present
      if (typeof match.action === 'function') {
        try {
          match.action(query);
        } catch (err) {
          console.warn('Chat action error:', err);
        }
      }
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
