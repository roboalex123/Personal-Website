// document.body.style.zoom = 1.5;
// Keyup event listener to stop scrolling
document.addEventListener('keyup', (event) => {
  if (event.key === 'j' || event.key === 'k') {
    stopScrolling();
  }
});

let keySequence = []; // To track sequences like "gg"

// Keybinding functionality
document.addEventListener('keydown', (event) => {
  const tag = event.target.tagName.toLowerCase();

  if (tag === 'input' && event.key === 'Escape') {
    event.preventDefault(); // Prevent default browser actions
    toggleCommandPopup();
  }

  // Ignore input fields and editable areas
  if (tag === 'input' || tag === 'textarea' || event.isComposing) {
    return;
  }


  // Handle single key presses for navigation
  switch (event.key) {
    case '/':
      event.preventDefault(); // Prevent default browser actions
      toggleCommandPopup();
      break;
    case 'G':
      event.preventDefault(); // Prevent default browser actions
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      break;
    case 'j':
      event.preventDefault(); // Prevent default browser actions
      startScrolling(1); // Scroll down
      break;
    case 'k':
      event.preventDefault(); // Prevent default browser actions
      startScrolling(-1); // Scroll up
      break;
    case 'h':
      event.preventDefault(); // Prevent default browser actions
      scrollToPreviousSection();
      break;
    case 'l':
      event.preventDefault(); // Prevent default browser actions
      scrollToNextSection();
      break;
    case '=':
      //reset zoom level
      document.body.style.zoom = 1;
      break;
    case '-':
      //zoom out
      document.body.style.zoom = parseFloat(document.body.style.zoom) - 0.1;
      break;
    case '+':
      //zoom in
      document.body.style.zoom = parseFloat(document.body.style.zoom) + 0.1;
      break;
    // case 'd':
    //   let scrollValueDown = window.scrollY + 500;
    //   window.scrollTo({ top: (scrollValueDown > window.innerHeight) ? (window.innerHeight + scrollValueDown) : (window.innerHeight), behavior: 'smooth' });
    //   break;
    // case 'u':
    //   let scrollValueUp = window.scrollY - 500;
    //   window.scrollTo({ top: (scrollValueUp < 0) ? (window.innerHeight - scrollValueUp) : (0), behavior: 'smooth' });
    //   window.scrollValueUp = sc
    //   break;
  }

  // Handle key sequences like "gg"
  keySequence.push(event.key);
  if (keySequence.join('') === 'gg') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    keySequence = [];
    currentSectionIndex = 0;
  }

  // Clear keySequence if it gets too long
  if (keySequence.length > 2) {
    keySequence = [];
  }
});

document.querySelector('.clear-button').addEventListener('click', clearOutput);

// Function to scroll to an element by ID
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

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


function toggleCommandPopup() {
  const popup = document.querySelector('.command-popup');
  popup.style.display = popup.style.display === 'block' ? 'none' : 'block';

  // botButton's
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

function clearOutput() {
  document.querySelector('.response-output').innerHTML = "";
  document.querySelector('.command-input').value = "";
  document.querySelector('.command-input').focus();
}

// Helper functions to navigate between sections
const sections = ['about', 'projects', 'resources', 'contact'];
let currentSectionIndex = 0;

function scrollToPreviousSection() {
  // if (currentSectionIndex > 0) {
  //   currentSectionIndex--;
  //   scrollToSection(sections[currentSectionIndex]);
  // }

  currentSectionIndex = (currentSectionIndex - 1 + sections.length) % sections.length;
  scrollToSection(sections[currentSectionIndex]);
}

function scrollToNextSection() {
    currentSectionIndex = (currentSectionIndex + 1) % sections.length;
    scrollToSection(sections[currentSectionIndex]);
}
