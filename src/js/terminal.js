/* ========================================
   TERMINAL — Interactive Shell
   ======================================== */

import { spawnToast } from './utils.js';

const cmdHistory = [];
let historyIdx = -1;

function printLine(html, cls) {
  const termOutput = document.getElementById('termOutput');
  if (!termOutput) return;
  const d = document.createElement('div');
  d.className = 'out-line ' + (cls || '');
  d.innerHTML = html;
  termOutput.appendChild(d);
  termOutput.scrollTop = termOutput.scrollHeight;
}

function printCmd(cmd) {
  const termOutput = document.getElementById('termOutput');
  if (!termOutput) return;
  const d = document.createElement('div');
  d.className = 'out-line out-cmd';
  d.textContent = cmd;
  termOutput.appendChild(d);
  termOutput.scrollTop = termOutput.scrollHeight;
}

const commands = {
  help: () => `Available commands: <span class="out-special">whoami, cv, timeline, skills, projects, awards, contact, minecraft, sudo hire-kurt, clear</span>`,
  whoami: () => `Kurt Fariñas — BS Computer Science graduate, San Jose City, Nueva Ecija. Frontend-leaning full-stack developer with 342 OJT hours on live government software.`,
  cv: () => {
    window.openResumeModal?.();
    return `Opening inline PDF Resume preview...`;
  },
  resume: () => {
    window.openResumeModal?.();
    return `Opening inline PDF Resume preview...`;
  },
  timeline: () => {
    setTimeout(() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' }), 300);
    return `Scrolling to career timeline...`;
  },
  skills: () => `React 19, Inertia.js, Laravel 12, Tailwind CSS v4, PHP, MySQL, JavaScript, Git.`,
  projects: () => {
    setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 300);
    return `Scrolling to projects...`;
  },
  awards: () => {
    setTimeout(() => document.getElementById('awards')?.scrollIntoView({ behavior: 'smooth' }), 300);
    return `5 earned: DepEd OJT completion, Cisco cybersecurity, 2x ThinkQuest, Oracle Java Fundamentals.`;
  },
  contact: () => {
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300);
    return `Scrolling to contact. Email: kurtfarinas2022@gmail.com`;
  },
  minecraft: () => `Yes, I run a self-hosted Paper Minecraft server for friends, tunneled through playit.gg. Uptime is rock solid.`,
  clear: () => {
    const termOutput = document.getElementById('termOutput');
    if (termOutput) termOutput.innerHTML = '';
    return null;
  },
  'sudo hire-kurt': () => {
    spawnToast('PERMISSION GRANTED', 'Redirecting to contact section...');
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 400);
    return `<span class="out-special">[sudo] password accepted. Welcome aboard.</span>`;
  }
};

function runCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  printCmd(cmd);
  cmdHistory.push(cmd);
  historyIdx = cmdHistory.length;
  const key = cmd.toLowerCase();
  if (key === 'clear') { commands.clear(); return; }
  if (commands[key]) {
    const out = commands[key]();
    if (out) printLine(out);
  } else {
    printLine(`command not found: ${cmd}. Type <span class="out-special">help</span> for options.`);
  }
}

// Exposed globally for onclick handlers in HTML
window.executeChip = function(cmd) {
  const termInput = document.getElementById('termInput');
  if (termInput) {
    termInput.value = cmd;
    runCommand(cmd);
    termInput.value = '';
  }
};

export function initTerminal() {
  const termInput = document.getElementById('termInput');
  if (!termInput) return;

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand(termInput.value);
      termInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        termInput.value = cmdHistory[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        termInput.value = cmdHistory[historyIdx];
      } else {
        historyIdx = cmdHistory.length;
        termInput.value = '';
      }
    }
  });
}
