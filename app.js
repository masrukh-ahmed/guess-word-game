const words = ["example", "javascript", "coding", "challenge"];
// let unscrambledForm = localStorage.getItem("unscrambledForm") || "";
// let scrambledForm = localStorage.getItem("scrambledForm") || "";

//selecting the elements
const randomBtn = document.querySelector(".random-btn");
const resetBtn = document.querySelector(".reset-btn");
const scrambledWordDisplay = document.querySelector(".text-jumbled");
const wordInputSec = document.querySelector(".input-sec input");
const mistakesSec = document.querySelector(".mistakes-sec");
const triesLeftText = document.querySelector(".tries-sec");
const triesLeftDiv = Array.from(document.querySelectorAll(".attempts div"));

//functions needed
function scrambledWordArr(word) {
  let numSequence = [];
  //creating a random number sequence for the given word for jumbling without missing any single word
  while (numSequence.length != word.length) {
    let randomNum = Math.floor(Math.random() * word.length);
    if (numSequence.join("").includes(randomNum)) {
      continue;
    } else {
      numSequence.push(randomNum);
    }
  }
  //arranging the passed word following the generated number sequence in array
  let scrambledWordArr = [];
  for (i = 0; i < numSequence.length; i++) {
    scrambledWordArr.push(word[numSequence[i]]);
  }
  return scrambledWordArr; //returning the scrambled form of the passed word in array
}

function displayScrambledWord() {
  let randomNum = Math.floor(Math.random() * words.length); //generates random num to select a random word for scrambling
  let wordToBeScrambled = words[randomNum]; //storing original word
  localStorage.setItem("unscrambledForm", `${words[randomNum]}`); //storing original word in local storage
  let scrambledWord = scrambledWordArr(wordToBeScrambled).join(""); //storing scrambled form of the word
  localStorage.setItem("scrambledForm", `${scrambledWord}`); //storing scrambled form of the word in local storage
  scrambledWordDisplay.innerHTML = scrambledWord; //displaying the scrambled form
}

let enteredUserWord = [];
let triesLeft = 5;
let mistakes = [0];
let correct;
displayMistakesTries(mistakes, triesLeft);
function handleInput(e) {
  let originalWord = localStorage.getItem("unscrambledForm");
  enteredUserWord.push(e.key);
  // console.log(originalWord);
  if (triesLeft != 0) {
    if (enteredUserWord.length == originalWord.length) {
      let { correct, mistakes } = checkInput(enteredUserWord.join(""));
      wordInputSec.value = "";
      enteredUserWord = [];

      if (correct) {
        console.log(mistakes, triesLeft);
        alert(`Congratulations!! U guessed the correct word.`);
        resetAll();
        displayMistakesTries(mistakes, triesLeft);
      } else {
        triesLeft--;
        console.log(mistakes, triesLeft);
        displayMistakesTries(mistakes, triesLeft);
        if (triesLeft == 0) {
          alert(`You lost all chances !! RESET..`);
          resetAll();
          displayMistakesTries(mistakes, triesLeft);
          return;
        }
        alert(`Try again !!`);
      }
    }
  }
}

function checkInput(userEnteredWord) {
  let originalWord = localStorage.getItem("unscrambledForm");
  mistakes = [];
  if (userEnteredWord == originalWord) {
    correct = true;
  } else {
    correct = false;
    for (i = 0; i < userEnteredWord.length; i++) {
      if (userEnteredWord[i] != originalWord[i]) {
        mistakes.push(userEnteredWord[i]);
      }
    }
  }
  if (mistakes.length == 0) {
    mistakes = [0];
  }
  return { correct, mistakes };
}

function displayMistakesTries(mistakes, tries) {
  mistakesSec.innerHTML = `Mistakes: ${mistakes.join(", ")}`;

  triesLeftText.innerHTML =
    `Tries (${tries}/5): <div class="attempts">` +
    `${triesLeftDiv
      .map((div, index) => {
        if (index < tries) {
          return `<div style="background-color: var(--violet-shade)"></div>`;
        } else {
          return `<div style="background-color: var(--dark-grey-shade)"></div>`;
        }
      })
      .join("")}</div>`;
}

function resetAll() {
  enteredUserWord = [];
  triesLeft = 5;
  mistakes = [0];
  wordInputSec.value = "";
  localStorage.removeItem("unscrambledForm");
  localStorage.removeItem("scrambledForm");
  scrambledWordDisplay.innerHTML = "-";
  displayMistakesTries(mistakes, triesLeft);
}

randomBtn.addEventListener("click", () => {
  displayScrambledWord();
}); //functionality of the random button

resetBtn.addEventListener("click", resetAll);

wordInputSec.addEventListener("keyup", handleInput);
