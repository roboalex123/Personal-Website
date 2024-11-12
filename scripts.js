document.addEventListener('DOMContentLoaded', () => {
  const botButton = document.createElement('button');
  botButton.textContent = 'Ask Me Something!';
  botButton.className = 'bot-button';
  document.body.appendChild(botButton);

  botButton.addEventListener('click', () => {
    const question = prompt("Ask me anything about me or my projects:");

    let response;
    if (question.toLowerCase().includes('projects')) {
      response = "I’ve worked on various projects, including [Project 1], [Project 2], and more!";
    } else if (question.toLowerCase().includes('about')) {
      response = "I’m a computer science major with a passion for Vim, accessibility, and developer tools.";
    } else if (question.toLowerCase().includes('workflow')) {
      response = "I use Sticky Keys and custom Vim bindings to navigate my setup efficiently.";
    } else {
      response = "I'm not sure about that, but feel free to explore the site!";
    }

    alert(response);
  });
});


let keySequence = []; // To track sequences like "gg"

// Function to scroll to an element by ID
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Keybinding functionality
document.addEventListener('keydown', (event) => {
  const tag = event.target.tagName.toLowerCase();

  // Ignore input fields and editable areas
  if (tag === 'input' || tag === 'textarea' || event.isComposing) {
    return;
  }

  // Handle single key presses for navigation
  switch (event.key) {
    case 'j':
      window.scrollBy({ top: 50, behavior: 'smooth' });
      break;
    case 'k':
      window.scrollBy({ top: -50, behavior: 'smooth' });
      break;
    case '/':
      event.preventDefault(); // Prevent default browser search
      openChatBot();
      break;
    case 'G':
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      break;
  }

  // Handle key sequences like "gg"
  keySequence.push(event.key);
  if (keySequence.join('') === 'gg') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    keySequence = [];
  }

  // Handle section navigation with Shift + h/l
  if (event.shiftKey && event.key === 'H') {
    scrollToPreviousSection();
  } else if (event.shiftKey && event.key === 'L') {
    scrollToNextSection();
  }

  // Clear keySequence if it gets too long
  if (keySequence.length > 2) {
    keySequence = [];
  }
});

// Function to open chat bot (simulates / key behavior)
function openChatBot() {
  const question = prompt("Ask me anything about me or my projects:");

  let response;
  if (question.toLowerCase().includes('projects')) {
    response = "I’ve worked on various projects, including [Project 1], [Project 2], and more!";
  } else if (question.toLowerCase().includes('about')) {
    response = "I’m a computer science major with a passion for Vim, accessibility, and developer tools.";
  } else if (question.toLowerCase().includes('workflow')) {
    response = "I use Sticky Keys and custom Vim bindings to navigate my setup efficiently.";
  } else {
    response = "I'm not sure about that, but feel free to explore the site!";
  }

  alert(response);
}

// Helper functions to navigate between sections
const sections = ['about', 'projects', 'resources', 'contact'];
let currentSectionIndex = 0;

function scrollToPreviousSection() {
  if (currentSectionIndex > 0) {
    currentSectionIndex--;
    scrollToSection(sections[currentSectionIndex]);
  }
}

function scrollToNextSection() {
  if (currentSectionIndex < sections.length - 1) {
    currentSectionIndex++;
    scrollToSection(sections[currentSectionIndex]);
  }
}
