document.addEventListener('DOMContentLoaded', () => {
  const botButton = document.createElement('button');
  botButton.textContent = 'Ask Me Something!';
  document.body.appendChild(botButton);

  botButton.addEventListener('click', () => {
    const question = prompt("Ask me anything about me or my projects:");

    let response;
    if (question.toLowerCase().includes('projects')) {
      response = "I have worked on various projects including [Project 1], [Project 2], and more!";
    } else if (question.toLowerCase().includes('about')) {
      response = "I'm a computer science major with a passion for Vim and accessibility in tech.";
    } else {
      response = "I'm not sure about that, but feel free to explore the site!";
    }

    alert(response);
  });
});
