document.addEventListener('keydown', (event) => {
  if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
    event.preventDefault();
    toggleCommandPopup();
  }
  else if (event.key === 'Escape' && document.activeElement.tagName == 'INPUT') {
    event.preventDefault();
    toggleCommandPopup();
  }
});

document.querySelector('.clear-button').addEventListener('click', clearOutput);


let scrolling = false; // Track whether scrolling is active
let scrollDirection = 0; // 1 for down, -1 for up
let scrollSpeed = 2; // Initial scroll speed
let scrollStartTime = 0; // Time when scrolling started
const rampUpRate = 15; // Increase this to speed up the ramp-up
const initialScrollSpeed = 2; // Initial scroll speed
const maxScrollSpeed = 50; // Maximum scroll speed

// Function to start the scroll loop
function startScrolling(direction) {
  if (!scrolling) {
    scrolling = true;
    scrollDirection = direction;
    scrollSpeed = 2; // Reset speed to initial value
    scrollStartTime = Date.now(); // Record the start time
    scrollLoop();
  }
}

// Function to stop scrolling
function stopScrolling() {
  scrolling = false;
}

// Scroll loop function with progressive speed increase
function scrollLoop() {
  if (scrolling) {
    // Calculate how long the key has been held
    const elapsedTime = (Date.now() - scrollStartTime) / 1000; // in seconds

    // Increase scroll speed progressively based on elapsed time
    scrollSpeed = Math.min(initialScrollSpeed + elapsedTime * rampUpRate, maxScrollSpeed);

    window.scrollBy(0, scrollDirection * scrollSpeed); // Scroll by adjusted speed
    requestAnimationFrame(scrollLoop);
  }
}

// Keydown event listener to start scrolling
document.addEventListener('keydown', (event) => {
  //prevent scrolling while typinging
  if (event.key === 'j' && event.target.tagName !== 'INPUT') {
    startScrolling(1); // Scroll down
  } else if (event.key === 'k' && event.target.tagName !== 'INPUT') {
    startScrolling(-1); // Scroll up
  }
});

// Keyup event listener to stop scrolling
document.addEventListener('keyup', (event) => {
  if (event.key === 'j' || event.key === 'k') {
    stopScrolling();
  }
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

function toggleCommandPopup() {
  const popup = document.querySelector('.command-popup');
  popup.style.display = popup.style.display === 'block' ? 'none' : 'block';

  // botButton's <p>
  const botButton = document.querySelector('.bot-button');
  if (popup.style.display === 'block')
  {
    botButton.classList.remove('closed');
    botButton.classList.add('open');
    botButton.innerHTML = '<i class="fas fa-times"></i>';
  } else
  {
    botButton.classList.remove('open');
    botButton.classList.add('closed');
    botButton.innerHTML = '<i class="fas fa-question"></i>';
  }


  document.querySelector('.command-input').focus();
}

document.querySelector('.command-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const input = event.target.value.trim();

    const clear = ['clear', 'c', 'cls'];
    const exit = ['exit', 'q', 'quit', ':q'];
    if (clear.includes(input.toLowerCase())) {
      clearOutput();
    } else if (exit.includes(input.toLowerCase())) {
      toggleCommandPopup();
    } else {
      addUserMessage(input);
      generateResponse(input);
    }
    event.target.value = ''; // Clear input
  }
});

function addUserMessage(input) {
  const responseOutput = document.querySelector('.response-output');

  const usrMessage = document.createElement('div');
  usrMessage.classList.add('user-message');
  usrMessage.innerHTML = input;

  responseOutput.appendChild(usrMessage);
  responseOutput.scrollBottom = responseOutput.scrollHeight;
}

function generateResponse(input) {
  const responseOutput = document.querySelector('.response-output');


  // bank of inputs mapped to responses
  const responses = {
    'hello': 'Hi there!\nHow can I help you today?',
    'how are you': 'I am doing well, thank you!',
    'goodbye': 'Goodbye!',
    'bye': 'Goodbye!',
    'thank you': 'You are welcome!',
    'project': 'I’ve worked on various projects, including Project 1 and Project 2!',
    'about': 'I’m a computer science major with a passion for Vim, accessibility, and developer tools.',
    'what is your name': 'My name is Robert Voss',
  }

  // Placeholder for response generation
  let responseText;

  if (responses[input.toLowerCase()]) {
    responseText = responses[input.toLowerCase()];
  } else {
    responseText = "I'm not sure about that. Try asking about my projects or interests!";
  }

  const botMessage = document.createElement('div');
  botMessage.classList.add('bot-message');
  botMessage.innerHTML = responseText.replace(/\n/g, '<br>');

  responseOutput.appendChild(botMessage);
  responseOutput.scrollBottom = responseOutput.scrollHeight;
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

function clearOutput() {
  document.querySelector('.response-output').innerHTML = "";
  document.querySelector('.command-input').value = "";
  document.querySelector('.command-input').focus();
}
