const form = document.getElementById('flames-form');
const firstInput = document.getElementById('your-name');
const secondInput = document.getElementById('their-name');
const result = document.getElementById('result');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const playAgainModal = document.getElementById('play-again-modal');
const playAgainButton = document.getElementById('play-again-button');
const modalClose = document.getElementById('modal-close');
const futureToast = document.getElementById('future-toast');
const revealFutureButton = document.getElementById('reveal-future-button');
const futureModal = document.getElementById('future-modal');
const futureClose = document.getElementById('future-close');
const anotherFutureButton = document.getElementById('another-future-button');
const futureTitle = document.getElementById('future-title');
const futurePrediction = document.getElementById('future-prediction');

let futureTimer;
let playAgainTimer;
let currentFutureResult;
let currentNames;
let currentPredictionIndex = -1;

const results = {
  F: {
    title: 'Friends',
    message: (first, second) => `${first} and ${second} have the kind of friendship that feels easy, honest, and worth holding onto.`
  },
  L: {
    title: 'Love',
    message: (first, second) => `${first} and ${second} share a sweet spark. Keep choosing each other and let this connection grow.`
  },
  A: {
    title: 'Affection',
    message: (first, second) => `${first} and ${second} have a warm affection between them. Small thoughtful moments could make it bloom.`
  },
  M: {
    title: 'Marriage',
    message: (first, second) => `${first} and ${second} have a connection full of promise. Maybe this story has a beautiful forever chapter.`
  },
  E: {
    title: 'Enemies',
    message: (first, second) => `${first} and ${second} may challenge each other, but every strong connection needs understanding and a little patience.`
  },
  S: {
    title: 'Siblings',
    message: (first, second) => `${first} and ${second} have a familiar bond. There is comfort, loyalty, and plenty of playful teasing here.`
  }
};

const futurePredictions = {
  F: [
    'Five years from now, you are still sending each other memes before saying hello. 😂',
    'Five years from now, your friendship has its own secret language and snack drawer. 🍿',
    'Five years from now, you still argue about who is the funniest one. 😂',
    'Five years from now, one of you still owes the other a treat from years ago. 🍫',
    'Five years from now, you have so many inside jokes that nobody else understands you. 🤣'
  ],
  L: [
    'Five years from now, you are still arguing about who liked who first. 😂',
    'Five years from now, date night still ends with sharing dessert and stealing fries. 🍟',
    'Five years from now, you still fight over silly things… and somehow still end up saying, “I love you.” 😂❤️',
    'Five years from now, your biggest love language is still stealing each other’s food. 🍕❤️',
    'Five years from now, you still remember the little things about each other that nobody else notices. 🥹❤️'
  ],
  A: [
    'Five years from now, you still remember tiny details and pretend it is not a superpower. ✨',
    'Five years from now, one thoughtful message can still turn an ordinary day around. 💌',
    'Five years from now, you still annoy each other just to get that little smile. 😄❤️',
    'Five years from now, a simple “Did you eat?” still means more than a thousand sweet words. 🥹🍲',
    'Five years from now, you still know exactly when the other needs a hug… even without asking. 🤗❤️'
  ],
  M: [
    'Five years from now, you have a shared calendar full of plans and absolutely no idea who made them. 📅',
    'Five years from now, you still call every grocery trip a tiny adventure. 🛒',
    'Five years from now, you still argue over who loves who more… and neither of you is willing to lose. 😂❤️',
    'Five years from now, you know each other’s favorite food, weird habits, and exactly how to make each other smile. 🥹🍕',
    'Five years from now, the person who once made your heart race is the person you come home to every day. ❤️🏠'
  ],
  E: [
    'Five years from now, you still debate the rules, but somehow always end up laughing. 😂',
    'Five years from now, your competitive streak has its own trophy shelf. 🏆',
    'Five years from now, you still say “I hate you” while secretly checking if they are okay. 😂❤️',
    'Five years from now, your biggest competition is still who can annoy the other first. 😈🤣',
    'Five years from now, you may call each other enemies… but deep down, you would still miss each other. 🥹❤️'
  ],
  S: [
    'Five years from now, you still tease each other about the same childhood story. 😄',
    'Five years from now, family gatherings remain a masterclass in playful chaos. 🍰',
    'Five years from now, you still fight like enemies but defend each other like superheroes. 😂❤️',
    'Five years from now, they still annoy you daily… but somehow life feels empty without them. 🥹🤣',
    'Five years from now, you still steal each other’s things and call it “family tax.” 😂🏠'
  ]
};

function clearFutureFeature() {
  futureTimer = undefined;
  futureToast.classList.remove('visible');
  futureModal.classList.remove('visible');
  currentPredictionIndex = -1;
}

function showFutureToast() {
  futureToast.classList.add('visible');
}

function showFuturePrediction() {
  const predictions = futurePredictions[currentFutureResult];
  let nextIndex = Math.floor(Math.random() * predictions.length);

  if (predictions.length > 1 && nextIndex === currentPredictionIndex) {
    nextIndex = (nextIndex + 1) % predictions.length;
  }

  currentPredictionIndex = nextIndex;
  futurePrediction.textContent = predictions[nextIndex];
}

function getFlamesResult(firstName, secondName) {
  const first = firstName.toLowerCase().replace(/[^a-z]/g, '').split('');
  const second = secondName.toLowerCase().replace(/[^a-z]/g, '').split('');

  first.forEach((letter, index) => {
    const matchIndex = second.indexOf(letter);
    if (matchIndex !== -1) {
      first[index] = '';
      second[matchIndex] = '';
    }
  });

  const remainingCount = first.filter(Boolean).length + second.filter(Boolean).length;
  const letters = ['F', 'L', 'A', 'M', 'E', 'S'];
  let index = 0;

  while (letters.length > 1) {
    index = (index + remainingCount - 1) % letters.length;
    letters.splice(index, 1);
  }

  return letters[0];
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  clearTimeout(playAgainTimer);
  clearFutureFeature();

  const firstName = firstInput.value.trim();
  const secondName = secondInput.value.trim();

  if (!firstName || !secondName) {
    resultTitle.textContent = 'Two names, please';
    resultMessage.textContent = 'Add both names and we will reveal your playful connection.';
  } else {
    const match = results[getFlamesResult(firstName, secondName)];
    resultTitle.textContent = match.title;
    resultMessage.textContent = match.message(firstName, secondName);
  }

  firstInput.value = '';
  secondInput.value = '';

  result.classList.remove('visible');
  requestAnimationFrame(() => {
    result.classList.add('visible');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  if (firstName && secondName) {
    currentFutureResult = getFlamesResult(firstName, secondName);
    currentNames = { first: firstName, second: secondName };
    futureTimer = setTimeout(showFutureToast, 7000 + Math.random() * 5000);
    playAgainTimer = setTimeout(() => {
      playAgainModal.classList.add('visible');
      playAgainButton.focus();
    }, 9000);
  }
});

playAgainButton.addEventListener('click', () => {
  clearTimeout(playAgainTimer);
  clearFutureFeature();
  playAgainModal.classList.remove('visible');
  firstInput.focus();
});

modalClose.addEventListener('click', () => {
  playAgainModal.classList.remove('visible');
});

revealFutureButton.addEventListener('click', () => {
  futureToast.classList.remove('visible');
  futureTitle.textContent = `${currentNames.first} + ${currentNames.second}`;
  showFuturePrediction();
  futureModal.classList.add('visible');
  futureClose.focus();
});

anotherFutureButton.addEventListener('click', showFuturePrediction);

futureClose.addEventListener('click', () => {
  futureModal.classList.remove('visible');
});

futureModal.addEventListener('click', (event) => {
  if (event.target === futureModal) {
    futureModal.classList.remove('visible');
  }
});
