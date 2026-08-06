/* ========================================
   KURT AI  |  Interactive Assistant & Page Controller
   ======================================== */

import { spawnToast } from './utils.js';

// Global action registry for interactive buttons in bot messages
window.chatActionRegistry = {};

// Global helper for prompt chips
window.sendQuickPrompt = function(promptText) {
  initChatWidget();
  window.sendQuickPrompt(promptText);
};

// Knowledge base with page control actions, inline action buttons, & weighted intent scoring
const botKnowledge = [
  {
    category: 'summary',
    keywords: ['summary', 'briefing', 'tldr', 'tl;dr', 'executive', 'recruiter', 'overview', 'quick summary', 'short', 'who is kurt', 'about kurt'],
    response: "**RECRUITER EXECUTIVE BRIEFING (30-SECOND TL;DR)**\n\n" +
              "• **Candidate**: Kurt Fariñas (BS Computer Science Graduate, STI College)\n" +
              "• **Leadership**: Elected **Alumni President** (Batch 2025–2026)\n" +
              "• **Target Roles**: Junior Frontend Developer / Junior Full-Stack Developer / Laravel & React Engineer\n" +
              "• **Key Achievements**:\n" +
              "  - Owned 100% frontend dev on DepEd HRIS Approval System project (342 hrs OJT, **98/100 rating**)\n" +
              "  - Solo-engineered and defended commercial Gym Management Platform with live QR camera check-ins\n" +
              "  - **1st Place Champion** in 2025 STI ThinkQuest academic competition\n" +
              "• **Core Stack**: React 19, Inertia.js, Laravel 12, Tailwind CSS v4, PHP, MySQL\n" +
              "• **Certifications**: Cisco Cybersecurity, Oracle Java Fundamentals\n" +
              "• **Availability**: Open immediately | Remote, Hybrid, or Onsite",
    action: () => {
      spawnToast('EXECUTIVE BRIEFING', 'Displaying Recruiter 30-Second Summary Card');
    },
    actionButtons: [
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" },
      { label: "Open HRIS Architecture Modal →", actionId: "open_hris_modal" },
      { label: "Go to Message Form →", actionId: "focus_contact" }
    ],
    followUps: ["Tell me about the DepEd HRIS System", "What is his primary tech stack?", "How can I contact Kurt?"]
  },
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
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" },
      { label: "Run Sudo Hire-Kurt Command →", actionId: "run_term_hire" }
    ],
    followUps: ["How can I contact Kurt?", "Download Kurt's CV", "What is his tech stack?"]
  },
  {
    category: 'education',
    keywords: ['education', 'college', 'sti', 'degree', 'awards', 'thinkquest', 'tagisan', 'gpa', 'certifications', 'cisco', 'oracle', 'alumni', 'president', 'leadership'],
    response: "Kurt earned his Bachelor of Science in Computer Science from **STI College San Jose** and served as **Alumni President for Batch 2025–2026**. He won 1st Place (Champion) in the 2025 STI ThinkQuest academic competition and 3rd Place in 2024.",
    action: () => {
      const awardsEl = document.getElementById('awards');
      if (awardsEl) awardsEl.scrollIntoView({ behavior: 'smooth' });
    },
    actionButtons: [
      { label: "View Awards Section →", actionId: "scroll_awards" },
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" }
    ],
    followUps: ["What systems has he built?", "View work availability", "Get contact information"]
  },
  {
    category: 'why_hire',
    keywords: ['why hire', 'why should we hire', 'strengths', 'capabilities', 'value', 'fit', 'reasons', 'what makes him'],
    response: "**4 REASONS TO HIRE KURT FARIÑAS FOR JUNIOR DEVELOPER SEATS**\n\n" +
              "1. **Proven Production Software**: Owned 100% frontend dev on a live DepEd leave approval system (342 OJT hrs, **98/100 rating**) and solo-built/defended a commercial gym platform.\n" +
              "2. **Modern Full-Stack Stack**: Skilled in React 19, Inertia.js, Laravel 12, Tailwind CSS v4, PHP, and MySQL.\n" +
              "3. **Academic Champion**: 1st Place Champion in 2025 STI ThinkQuest academic competition.\n" +
              "4. **Immediate Availability**: Open to Remote, Hybrid, or Onsite roles immediately.",
    action: () => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    },
    actionButtons: [
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" },
      { label: "Go to Contact Form →", actionId: "focus_contact" },
      { label: "Run Sudo Hire-Kurt Command →", actionId: "run_term_hire" }
    ],
    followUps: ["Tell me about DepEd HRIS", "What is his primary tech stack?", "Download Kurt's CV"]
  },
  {
    category: 'react',
    keywords: ['react', 'inertia', 'component', 'frontend', 'ui', 'spas', 'single page'],
    response: "Kurt builds high-performance SPAs using **React 19, Inertia.js, and Vanilla CSS/Tailwind CSS v4**. In his DepEd HRIS project, he built dynamic multi-role approval interfaces and digital Form CS No. 6 leave workflows.",
    action: () => {
      window.openProjectModal?.('hris');
    },
    actionButtons: [
      { label: "Open DepEd HRIS Modal →", actionId: "open_hris_modal" },
      { label: "View Primary Tech Stack →", actionId: "scroll_skills" }
    ],
    followUps: ["Tell me about his Laravel skills", "Has he defended a thesis?", "View work availability"]
  },
  {
    category: 'laravel',
    keywords: ['laravel', 'backend', 'api', 'controller', 'eloquent', 'php', 'mysql', 'database'],
    response: "Kurt engineers backend API architectures and relational databases using **Laravel 12**, custom **PHP 8+**, and **MySQL**. His thesis platform features automated membership subscriptions, AJAX real-time check-ins, and analytics dashboards.",
    action: () => {
      window.openProjectModal?.('gym');
    },
    actionButtons: [
      { label: "Open Gym Thesis Modal →", actionId: "open_gym_modal" },
      { label: "View Primary Tech Stack →", actionId: "scroll_skills" }
    ],
    followUps: ["Tell me about his React skills", "What is his OJT performance rating?", "Download CV"]
  }
];

// Initialize global action handlers
window.chatActionRegistry = {
  open_hris_modal: () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    window.openProjectModal?.('hris');
  },
  open_gym_modal: () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    window.openProjectModal?.('gym');
  },
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
  scroll_projects: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }),
  scroll_skills: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }),
  scroll_awards: () => document.getElementById('awards')?.scrollIntoView({ behavior: 'smooth' }),
  run_term_whoami: () => window.executeChip?.('whoami'),
  run_term_cv: () => window.executeChip?.('cv'),
  run_term_hire: () => window.executeChip?.('sudo hire-kurt'),
  theme_violet: () => window.setThemeAccent?.('violet'),
  theme_emerald: () => window.setThemeAccent?.('emerald'),
  theme_cyan: () => window.setThemeAccent?.('cyan'),
  theme_orange: () => window.setThemeAccent?.('orange')
};

window.triggerChatAction = function(actionId) {
  if (window.chatActionRegistry[actionId]) {
    window.chatActionRegistry[actionId]();
  }
};

window.chatActionRegistry.recruiter_briefing = () => {
  window.sendQuickPrompt?.('Recruiter Summary');
};

function generateDynamicResponse(userText) {
  const query = userText.trim();
  const lower = query.toLowerCase();

  // Custom greeting handling
  if (/^(hi|hello|hey|sup|greetings|good\s(morning|afternoon|evening)|who are you|what is your name)/i.test(lower)) {
    return {
      category: 'greeting',
      response: "Hello there! I'm **Kurt AI**, Kurt Fariñas's interactive assistant. I can answer any questions about his **DepEd HRIS government project**, **Boiyet's Gym thesis platform**, **React/Laravel stack**, or **work availability**! What would you like to explore?",
      action: null,
      actionButtons: [
        { label: "Recruiter 30-Sec Briefing →", actionId: "recruiter_briefing" },
        { label: "Open DepEd HRIS Modal →", actionId: "open_hris_modal" },
        { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" }
      ],
      followUps: ["Recruiter Summary", "Tell me about DepEd HRIS", "What is his tech stack?"]
    };
  }

  // Courtesy handling
  if (/(thank|thanks|great|cool|awesome|perfect|nice|bye|goodbye|appreciate)/i.test(lower)) {
    return {
      category: 'courtesy',
      response: "You're very welcome! If you have any further questions or would like to schedule an interview with Kurt, feel free to send a message via the contact form or download his resume.",
      action: null,
      actionButtons: [
        { label: "Go to Contact Form →", actionId: "focus_contact" },
        { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" }
      ],
      followUps: ["How can I contact Kurt?", "Download Kurt's CV", "What is his primary tech stack?"]
    };
  }

  // Tailored dynamic fallback generator for custom queries
  let topicSummary = "";
  if (lower.includes('experience') || lower.includes('work') || lower.includes('background') || lower.includes('history')) {
    topicSummary = "Kurt has completed a **342-hour OJT internship at DepEd** (98/100 performance rating) as lead frontend developer for their leave approval system, and solo-engineered/defended **Boiyet's Fitness Gym Management System**.";
  } else if (lower.includes('code') || lower.includes('programming') || lower.includes('tech') || lower.includes('skill') || lower.includes('stack')) {
    topicSummary = "Kurt specializes in **React 19, Inertia.js, Laravel 12, Tailwind CSS v4, PHP, and MySQL**. He holds official certifications in Java Fundamentals (Oracle Academy) and Cybersecurity (Cisco Academy).";
  } else if (lower.includes('contact') || lower.includes('email') || lower.includes('reach') || lower.includes('hire') || lower.includes('availabl')) {
    topicSummary = "Kurt is actively seeking **Junior Developer seats** (Remote, Hybrid, or Onsite). You can reach him directly at **kurtfarinas2022@gmail.com** or send a message below.";
  } else {
    topicSummary = `Regarding "${query}": Kurt Fariñas is a BS Computer Science graduate (STI College Class of 2026) who builds production web applications using React, Laravel, and Tailwind CSS.`;
  }

  return {
    category: 'dynamic',
    response: topicSummary + "\n\nFeel free to explore the interactive cards below or ask for specific details about his projects, certifications, or resume!",
    action: null,
    actionButtons: [
      { label: "Recruiter 30-Sec Briefing →", actionId: "recruiter_briefing" },
      { label: "Launch Resume PDF Viewer →", actionId: "open_resume_modal" },
      { label: "Go to Contact Form →", actionId: "focus_contact" }
    ],
    followUps: ["Tell me about DepEd HRIS", "What is his primary tech stack?", "Are you open to full-time roles?"]
  };
}

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

  return (maxScore > 0 && bestMatch) ? bestMatch : generateDynamicResponse(userText);
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
        spawnToast('ASSISTANT READY', 'Kurt AI can provide executive summaries and navigate the portfolio.');
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

    if (sender === 'bot' && actionButtons && actionButtons.length > 0) {
      contentHtml += `<div class="msg-action-btns">`;
      actionButtons.forEach(btn => {
        contentHtml += `<button type="button" class="chat-action-btn" onclick="triggerChatAction('${btn.actionId}')">${escapeHtml(btn.label)}</button>`;
      });
      contentHtml += `</div>`;
    }

    if (sender === 'bot' && followUps && followUps.length > 0) {
      contentHtml += `<div class="msg-followups">`;
      followUps.forEach(chipText => {
        contentHtml += `<button type="button" class="chat-followup-chip" data-prompt="${escapeHtml(chipText)}">${escapeHtml(chipText)}</button>`;
      });
      contentHtml += `</div>`;
    }
    contentHtml += `</div>`;

    msgDiv.innerHTML = sender === 'bot' ? avatarHtml + contentHtml : contentHtml + avatarHtml;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatMessages?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chat-followup-chip');
    if (chip && chip.dataset.prompt) {
      window.sendQuickPrompt(chip.dataset.prompt);
    }
  });

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
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMarkdown(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n• /g, '<br>• ');
}
