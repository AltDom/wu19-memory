// Content array.
const gridItems = [
    { name: 'dreamcast', image: '/icons/dreamcast.svg' },
    { name: 'n64', image: '/icons/n64.svg' },
    { name: 'ps4', image: '/icons/ps4.svg' },
    { name: 'ps4-wireless', image: '/icons/ps4-wireless.svg' },
    { name: 'ps4-gamepad', image: '/icons/ps4-gamepad.svg' },
    { name: 'gamepad', image: '/icons/gamepad.svg' },
    { name: 'snes', image: '/icons/snes.svg' },
    { name: 'joystick', image: '/icons/joystick.svg' },
    { name: 'dreamcast', image: '/icons/dreamcast.svg' },
    { name: 'n64', image: '/icons/n64.svg' },
    { name: 'ps4', image: '/icons/ps4.svg' },
    { name: 'ps4-wireless', image: '/icons/ps4-wireless.svg' },
    { name: 'ps4-gamepad', image: '/icons/ps4-gamepad.svg' },
    { name: 'gamepad', image: '/icons/gamepad.svg' },
    { name: 'snes', image: '/icons/snes.svg' },
    { name: 'joystick', image: '/icons/joystick.svg' }
];
const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','Ö','Ä','Å','Ü'];

// Declaring variable for the number of top score lines (can be changed to whatever you like).
const numberOfTopScores = 10;
let sortBy = 'time';
let highScoresArray = [];
let topScores = [];
let playerNames = [];
let fastestMins = [];
let fastestSecs = [];
let fastestMillis = [];
let milli = 0, second = 0, minute = 0;
let interval;
// Declared variables for the timer.
let count = 0;
let counter = document.querySelector(".count");
// An declared array for opened tiles.
let openedTiles = [];
// An array of all matched tiles.
let matchedTile = document.getElementsByClassName("match");
let btn1 = document.querySelector('.btn1');
let btn2 = document.querySelector('.btn2');
let btn3 = document.querySelector('.btn3');
let letter1 = document.querySelector('.letter1');
let letter2 = document.querySelector('.letter2');
let letter3 = document.querySelector('.letter3');

// Functions to change name letters.
const nextLetter1 = () => {
  let currentLetter = letter1.innerHTML;
  for (let i=0 ; i<30 ; i++) {
    if (alpha[i] === currentLetter && i<29) {
      letter1.innerHTML = alpha[i+1];
      break;
    } else if (alpha[i] === null) {
      letter1.innerHTML = alpha[0];
      break;
    } else if (alpha[i] === 'Ü'){
      letter1.innerHTML = alpha[0];
      break;
    }
  }
};

const nextLetter2 = () => {
  let currentLetter = letter2.innerHTML;
  for (let i=0 ; i<30 ; i++) {
    if (alpha[i] === currentLetter && i<29) {
      letter2.innerHTML = alpha[i+1];
      break;
    } else if (alpha[i] === null) {
      letter2.innerHTML = alpha[0];
      break;
    } else if (alpha[i] === 'Ü'){
      letter2.innerHTML = alpha[0];
      break;
    }
  }
};

const nextLetter3 = () => {
  let currentLetter = letter3.innerHTML;
  for (let i=0 ; i<30 ; i++) {
    if (alpha[i] === currentLetter && i<29) {
      letter3.innerHTML = alpha[i+1];
      break;
    } else if (alpha[i] === null) {
      letter3.innerHTML = alpha[0];
      break;
    } else if (alpha[i] === 'Ü'){
      letter3.innerHTML = alpha[0];
      break;
    }
  }
};

btn1.addEventListener("click", nextLetter1);
btn2.addEventListener("click", nextLetter2);
btn3.addEventListener("click", nextLetter3);

// A function which shuffles unmatched grid items.
function shuffleGridItems(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  };
  return array;
};

// Pack and unpack scores from local storage.
function unpackScores() {
  playerNamesTime = JSON.parse(localStorage.getItem('playerNamesTime'));
  topScoresTime = JSON.parse(localStorage.getItem('topScoresTime'));
  fastestMinsTime = JSON.parse(localStorage.getItem('fastestMinsTime'));
  fastestSecsTime = JSON.parse(localStorage.getItem('fastestSecsTime'));
  fastestMillisTime = JSON.parse(localStorage.getItem('fastestMillisTime'));
  playerNamesGuess = JSON.parse(localStorage.getItem('playerNamesGuess'));
  topScoresGuess = JSON.parse(localStorage.getItem('topScoresGuess'));
  fastestMinsGuess = JSON.parse(localStorage.getItem('fastestMinsGuess'));
  fastestSecsGuess = JSON.parse(localStorage.getItem('fastestSecsGuess'));
  fastestMillisGuess = JSON.parse(localStorage.getItem('fastestMillisGuess'));
  if (topScoresTime === null) {
    topScoresTime = [];
    playerNamesTime = [];
    fastestMinsTime = [];
    fastestSecsTime = [];
    fastestMillisTime = [];
    topScoresGuess = [];
    playerNamesGuess = [];
    fastestMinsGuess = [];
    fastestSecsGuess = [];
    fastestMillisGuess = [];
  }
}

function storeScores() {
  localStorage.clear();
  localStorage.setItem('playerNamesTime', JSON.stringify(playerNamesTime));
  localStorage.setItem('topScoresTime', JSON.stringify(topScoresTime));
  localStorage.setItem('fastestMinsTime', JSON.stringify(fastestMinsTime));
  localStorage.setItem('fastestSecsTime', JSON.stringify(fastestSecsTime));
  localStorage.setItem('fastestMillisTime', JSON.stringify(fastestMillisTime));
  localStorage.setItem('playerNamesGuess', JSON.stringify(playerNamesGuess));
  localStorage.setItem('topScoresGuess', JSON.stringify(topScoresGuess));
  localStorage.setItem('fastestMinsGuess', JSON.stringify(fastestMinsGuess));
  localStorage.setItem('fastestSecsGuess', JSON.stringify(fastestSecsGuess));
  localStorage.setItem('fastestMillisGuess', JSON.stringify(fastestMillisGuess));
}

// Creates an HTML element from string.
const stringToHTML = str => {
  const div = document.createElement("div");
  div.innerHTML = str;
  return div.firstChild;
};

// Create tile template with a template literal.
const createTile = (title, icon) => {
  return `<div class="grid-item" title="${title}"><img src="${icon}"></div>`;
};

// Creates a high score line.
const createHighScoreTime = (number, guesses, name, minute, second, milli) => {
  if(milli >= 0 && milli < 10) {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${minute} mins ${second}.0${milli} secs</div><div class="smallLetters">${guesses} guesses</div></div>`;
  } else {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${minute} mins ${second}.${milli} secs</div><div class="smallLetters">${guesses} guesses</div></div>`;
  }
};

// Creates a high score line for when its one minute.
const createOneMinuteHighScoreTime = (number, guesses, name, minute, second, milli) => {
  if(milli >= 0 && milli < 10) {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${minute} min ${second}.0${milli} secs</div><div class="smallLetters">${guesses} guesses</div></div>`;
  } else {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${minute} min ${second}.${milli} secs</div><div class="smallLetters">${guesses} guesses</div></div>`;
  }
};

// Creates an alternate high score line without minutes (if its a fast game).
const createMinutelessHighScoreTime = (number, guesses, name, second, milli) => {
  if(milli >= 0 && milli < 10) {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${second}.0${milli} secs</div><div class="smallLetters">${guesses} guesses</div></div>`;
  } else {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${second}.${milli} secs</div><div class="smallLetters">${guesses} guesses</div></div>`;
  }
};

// Creates a high score line.
const createHighScoreGuess = (number, guesses, name, minute, second, milli) => {
  if(milli >= 0 && milli < 10) {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${guesses} guesses</div><div class="smallLetters">${minute} mins ${second}.0${milli} secs</div></div>`;
  } else {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${guesses} guesses</div><div class="smallLetters">${minute} mins ${second}.${milli} secs</div></div>`;
  }
};

// Creates a high score line for when its one minute.
const createOneMinuteHighScoreGuess = (number, guesses, name, minute, second, milli) => {
  if(milli >= 0 && milli < 10) {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${guesses} guesses</div><div class="smallLetters">${minute} min ${second}.0${milli} secs</div></div>`;
  } else {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${guesses} guesses</div><div class="smallLetters">${minute} min ${second}.${milli} secs</div></div>`;
  }
};

// Creates an alternate high score line without minutes (if its a fast game).
const createMinutelessHighScoreGuess = (number, guesses, name, second, milli) => {
  if(milli >= 0 && milli < 10) {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${guesses} guesses</div><div class="smallLetters">${second}.0${milli} secs</div></div>`;
  } else {
    return `<div class="highScoreLines"><div>${number}. ${name}</div><div>${guesses} guesses</div><div class="smallLetters">${second}.${milli} secs</div></div>`;
  }
};

// Refresh/reshuffle function (Note: we can pass in a subset of gridItems).
function refresh(array) {
  const grid = document.querySelector(".grid");
  let shuffledGridItems = shuffleGridItems(array);
  shuffledGridItems.forEach(banana => { // Create each tile.
    const element = createTile(banana.name, banana.image);
    grid.appendChild(stringToHTML(element));
  });
  openedTiles = [];
  count = 0; // Reset number of guesses and timer.
  counter.innerHTML = count;
  second = 0;
  minute = 0;
  let timer = document.querySelector(".timer");
  timer.innerHTML = "0.00 secs";
  clearInterval(interval);
};

// This function runs if the New Game / Replay button is clicked (different to refresh / reloading the browser).
function restart() {
  const grid = document.querySelector(".grid");
  if (grid.innerHTML === "") { // Precautionary - if there are no tiles run the usual refresh() function.
    refresh(gridItems);
  } else { // Remove all existing divs and classes from each the grid, run the refresh() function and initiate the flip event listeners.
    grid.innerHTML = "";
    refresh(gridItems);
    let tiles = document.querySelectorAll(".grid-item");
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener("click", flip);
      tiles[i].addEventListener("click", tileFlip);
    };
  }
}

// refresh the grid with each reload of the window.
window.onload = refresh(gridItems);

// Runs when tiles are clicked and flipped. Tile is added to OpenedTiles array, and if there are 2, match or unmatch functions are run.
function tileFlip() {
  openedTiles.push(this);
  let len = openedTiles.length;
  if (len === 2) {
    guessCounter();
    if (openedTiles[0]['title'] === openedTiles[1]['title']) {
      matched();
    } else {
      unmatched();
    }
  }
};

function grabPlayerName() {
  let letter1 = document.querySelector('.letter1');
  let letter2 = document.querySelector('.letter2');
  let letter3 = document.querySelector('.letter3');
  let playerNameLetter1 = letter1.innerHTML;
  let playerNameLetter2 = letter2.innerHTML;
  let playerNameLetter3 = letter3.innerHTML;
  let playerName = playerNameLetter1+playerNameLetter2+playerNameLetter3;
  return playerName;
}

// Checks and sorts the current results with those from the current high scores lists.
function sortScoresByTime(topScores,playerNames,fastestMins,fastestSecs,fastestMillis) {
  // This if statement checks the current run and sorts the high scores list.
  if (topScores.length >= 1) {
    for (let i=0;i<topScores.length;i++) {
      if (minute<fastestMins[i]) {
        if (i === numberOfTopScores-1) {
          topScores.pop();
          topScores.push(guesses);
          playerNames.pop();
          playerNames.push(playerName);
          fastestMins.pop();
          fastestMins.push(minute);
          fastestSecs.pop();
          fastestSecs.push(second);
          fastestMillis.pop();
          fastestMillis.push(milli);
          break;
        } else if (i === 0) {
          topScores.unshift(guesses);
          playerNames.unshift(playerName);
          fastestMins.unshift(minute);
          fastestSecs.unshift(second);
          fastestMillis.unshift(milli);
          break;
        } else {
          topScores.splice(i,0,guesses);
          playerNames.splice(i,0,playerName);
          fastestMins.splice(i,0,minute);
          fastestSecs.splice(i,0,second);
          fastestMillis.splice(i,0,milli);
          break;
        }
      } else if (minute === fastestMins[i]) {
        if (second<fastestSecs[i]) {
          if (i === numberOfTopScores-1) {
            topScores.pop();
            topScores.push(guesses);
            playerNames.pop();
            playerNames.push(playerName);
            fastestMins.pop();
            fastestMins.push(minute);
            fastestSecs.pop();
            fastestSecs.push(second);
            fastestMillis.pop();
            fastestMillis.push(milli);
            break;
          } else if (i === 0) {
            topScores.unshift(guesses);
            playerNames.unshift(playerName);
            fastestMins.unshift(minute);
            fastestSecs.unshift(second);
            fastestMillis.unshift(milli);
            break;
          } else {
            topScores.splice(i,0,guesses);
            playerNames.splice(i,0,playerName);
            fastestMins.splice(i,0,minute);
            fastestSecs.splice(i,0,second);
            fastestMillis.splice(i,0,milli);
            break;
          }
        } else if (second === fastestSecs[i]) {
          if (milli<fastestMillis[i]) {
            if (i === numberOfTopScores-1) {
              topScores.pop();
              topScores.push(guesses);
              playerNames.pop();
              playerNames.push(playerName);
              fastestMins.pop();
              fastestMins.push(minute);
              fastestSecs.pop();
              fastestSecs.push(second);
              fastestMillis.pop();
              fastestMillis.push(milli);
              break;
            } else if (i === 0) {
              topScores.unshift(guesses);
              playerNames.unshift(playerName);
              fastestMins.unshift(minute);
              fastestSecs.unshift(second);
              fastestMillis.unshift(milli);
              break;
            } else {
              topScores.splice(i,0,guesses);
              playerNames.splice(i,0,playerName);
              fastestMins.splice(i,0,minute);
              fastestSecs.splice(i,0,second);
              fastestMillis.splice(i,0,milli);
              break;
            }
          } else if (milli === fastestMillis[i]) {
            if (guesses<topScores[i]) {
              if (i === numberOfTopScores-1) {
                topScores.pop();
                topScores.push(guesses);
                playerNames.pop();
                playerNames.push(playerName);
                fastestMins.pop();
                fastestMins.push(minute);
                fastestSecs.pop();
                fastestSecs.push(second);
                fastestMillis.pop();
                fastestMillis.push(milli);
                break;
              } else if (i === 0) {
                topScores.unshift(guesses);
                playerNames.unshift(playerName);
                fastestMins.unshift(minute);
                fastestSecs.unshift(second);
                fastestMillis.unshift(milli);
                break;
              } else {
                topScores.splice(i,0,guesses);
                playerNames.splice(i,0,playerName);
                fastestMins.splice(i,0,minute);
                fastestSecs.splice(i,0,second);
                fastestMillis.splice(i,0,milli);
                break;
              }
            }
          }
        }
      }
      if (i===topScores.length-1 && topScores.length<numberOfTopScores) {
        topScores.push(guesses);
        playerNames.push(playerName);
        fastestMins.push(minute);
        fastestSecs.push(second);
        fastestMillis.push(milli);
        break;
      }
    }
    if (topScores.length>numberOfTopScores) {
      topScores.pop();
      playerNames.pop();
      fastestMins.pop();
      fastestSecs.pop();
      fastestMillis.pop();
    }
  } else {
    topScores.push(guesses);
    playerNames.push(playerName);
    fastestMins.push(minute);
    fastestSecs.push(second);
    fastestMillis.push(milli);
  }
  return [topScores,playerNames,fastestMins,fastestSecs,fastestMillis];
};

function sortScoresByGuess(topScores,playerNames,fastestMins,fastestSecs,fastestMillis) {
  // This if statement checks the current run and sorts the high scores list.
  if (topScores.length >= 1) {
    for (let i=0;i<topScores.length;i++) {
      if (guesses<topScores[i]) {
        if (i === numberOfTopScores-1) {
          topScores.pop();
          topScores.push(guesses);
          playerNames.pop();
          playerNames.push(playerName);
          fastestMins.pop();
          fastestMins.push(minute);
          fastestSecs.pop();
          fastestSecs.push(second);
          fastestMillis.pop();
          fastestMillis.push(milli);
          break;
        } else if (i === 0) {
          topScores.unshift(guesses);
          playerNames.unshift(playerName);
          fastestMins.unshift(minute);
          fastestSecs.unshift(second);
          fastestMillis.unshift(milli);
          break;
        } else {
          topScores.splice(i,0,guesses);
          playerNames.splice(i,0,playerName);
          fastestMins.splice(i,0,minute);
          fastestSecs.splice(i,0,second);
          fastestMillis.splice(i,0,milli);
          break;
        }
      } else if (guesses === topScores[i]) {
        if (minute<fastestMins[i]) {
          if (i === numberOfTopScores-1) {
            topScores.pop();
            topScores.push(guesses);
            playerNames.pop();
            playerNames.push(playerName);
            fastestMins.pop();
            fastestMins.push(minute);
            fastestSecs.pop();
            fastestSecs.push(second);
            fastestMillis.pop();
            fastestMillis.push(milli);
            break;
          } else if (i === 0) {
            topScores.unshift(guesses);
            playerNames.unshift(playerName);
            fastestMins.unshift(minute);
            fastestSecs.unshift(second);
            fastestMillis.unshift(milli);
            break;
          } else {
            topScores.splice(i,0,guesses);
            playerNames.splice(i,0,playerName);
            fastestMins.splice(i,0,minute);
            fastestSecs.splice(i,0,second);
            fastestMillis.splice(i,0,milli);
            break;
          }
        } else if (minute === fastestMins[i]) {
          if (second<fastestSecs[i]) {
            if (i === numberOfTopScores-1) {
              topScores.pop();
              topScores.push(guesses);
              playerNames.pop();
              playerNames.push(playerName);
              fastestMins.pop();
              fastestMins.push(minute);
              fastestSecs.pop();
              fastestSecs.push(second);
              fastestMillis.pop();
              fastestMillis.push(milli);
              break;
            } else if (i === 0) {
              topScores.unshift(guesses);
              playerNames.unshift(playerName);
              fastestMins.unshift(minute);
              fastestSecs.unshift(second);
              fastestMillis.unshift(milli);
              break;
            } else {
              topScores.splice(i,0,guesses);
              playerNames.splice(i,0,playerName);
              fastestMins.splice(i,0,minute);
              fastestSecs.splice(i,0,second);
              fastestMillis.splice(i,0,milli);
              break;
            }
          } else if (second === fastestSecs[i]) {
            if (milli<fastestMillis[i]) {
              if (i === numberOfTopScores-1) {
                topScores.pop();
                topScores.push(guesses);
                playerNames.pop();
                playerNames.push(playerName);
                fastestMins.pop();
                fastestMins.push(minute);
                fastestSecs.pop();
                fastestSecs.push(second);
                fastestMillis.pop();
                fastestMillis.push(milli);
                break;
              } else if (i === 0) {
                topScores.unshift(guesses);
                playerNames.unshift(playerName);
                fastestMins.unshift(minute);
                fastestSecs.unshift(second);
                fastestMillis.unshift(milli);
                break;
              } else {
                topScores.splice(i,0,guesses);
                playerNames.splice(i,0,playerName);
                fastestMins.splice(i,0,minute);
                fastestSecs.splice(i,0,second);
                fastestMillis.splice(i,0,milli);
                break;
              }
            }
          }
        }
      }
      if (i===topScores.length-1 && topScores.length<numberOfTopScores) {
        topScores.push(guesses);
        playerNames.push(playerName);
        fastestMins.push(minute);
        fastestSecs.push(second);
        fastestMillis.push(milli);
        break;
      }
    }
    if (topScores.length>numberOfTopScores) {
      topScores.pop();
      playerNames.pop();
      fastestMins.pop();
      fastestSecs.pop();
      fastestMillis.pop();
    }
  } else {
    topScores.push(guesses);
    playerNames.push(playerName);
    fastestMins.push(minute);
    fastestSecs.push(second);
    fastestMillis.push(milli);
  }
  return [topScores,playerNames,fastestMins,fastestSecs,fastestMillis];
};

// Print scores by Time.
function printScoresTime(topScores,playerNames,fastestMins,fastestSecs,fastestMillis) {
  let scoreListSize = topScores.length;
  const highScoresList = document.querySelector(".high-scores");
  highScoresList.innerHTML = "";
  const highScoresHeading = document.querySelector(".highScoreHeading");
  highScoresHeading.innerHTML = `<div>High Scores</div>`;
  for (let i=0;i<scoreListSize;i++) {
    let number = (i+1);
    if (fastestMins[i] === 0) {
      highScore = createMinutelessHighScoreTime(number,topScores[i],playerNames[i],fastestSecs[i],fastestMillis[i]);
    } else if (fastestMins[i] === 1) {
      highScore = createOneMinuteHighScoreTime(number,topScores[i],playerNames[i],fastestMins[i],fastestSecs[i],fastestMillis[i]);
    } else {
      highScore = createHighScoreTime(number,topScores[i],playerNames[i],fastestMins[i],fastestSecs[i],fastestMillis[i]);
    }
    highScoresList.appendChild(stringToHTML(highScore));
  }
}

// Print scores by Guess.
function printScoresGuess(topScores,playerNames,fastestMins,fastestSecs,fastestMillis) {
  let scoreListSize = topScores.length;
  const highScoresList = document.querySelector(".high-scores");
  highScoresList.innerHTML = "";
  const highScoresHeading = document.querySelector(".highScoreHeading");
  highScoresHeading.innerHTML = `<div>High Scores</div>`;
  for (let i=0;i<scoreListSize;i++) {
    let number = (i+1);
    if (fastestMins[i] === 0) {
      highScore = createMinutelessHighScoreGuess(number,topScores[i],playerNames[i],fastestSecs[i],fastestMillis[i]);
    } else if (fastestMins[i] === 1) {
      highScore = createOneMinuteHighScoreGuess(number,topScores[i],playerNames[i],fastestMins[i],fastestSecs[i],fastestMillis[i]);
    } else {
      highScore = createHighScoreGuess(number,topScores[i],playerNames[i],fastestMins[i],fastestSecs[i],fastestMillis[i]);
    }
    highScoresList.appendChild(stringToHTML(highScore));
  }
}

// Runs when tiles match.
function matched() {
  openedTiles[0].classList.add("match", "disabled");
  openedTiles[1].classList.add("match", "disabled");
  if (matchedTile.length === 16) {
    milli--;
    if (milli === -1) {
      milli = 99;
      second--;
    }
    clearInterval(interval);
    guesses = parseInt(counter.innerHTML);
    playerName = grabPlayerName();

    // Unpack scores from local storage.
    unpackScores();

    // Sort scores by time and guesses.
    highScoresArrayTime = sortScoresByTime(topScoresTime,playerNamesTime,fastestMinsTime,fastestSecsTime,fastestMillisTime);
    highScoresArrayGuess = sortScoresByGuess(topScoresGuess,playerNamesGuess,fastestMinsGuess,fastestSecsGuess,fastestMillisGuess);

    // Unpack scores after being sorted.
    topScoresTime = highScoresArrayTime[0];
    playerNamesTime = highScoresArrayTime[1];
    fastestMinsTime = highScoresArrayTime[2];
    fastestSecsTime = highScoresArrayTime[3];
    fastestMillisTime = highScoresArrayTime[4];
    topScoresGuess = highScoresArrayGuess[0];
    playerNamesGuess = highScoresArrayGuess[1];
    fastestMinsGuess = highScoresArrayGuess[2];
    fastestSecsGuess = highScoresArrayGuess[3];
    fastestMillisGuess = highScoresArrayGuess[4];

    // Put scores into local storage.
    storeScores();
    // Print scores.
    if (sortBy === 'time') {
      printScoresTime(topScoresTime,playerNamesTime,fastestMinsTime,fastestSecsTime,fastestMillisTime);
    } else if (sortBy === 'guess') {
      printScoresGuess(topScoresGuess,playerNamesGuess,fastestMinsGuess,fastestSecsGuess,fastestMillisGuess);
    }
  }
  openedTiles[0].classList.remove("show", "open");
  openedTiles[1].classList.remove("show", "open");
  openedTiles = [];
}

// Function called when tiles don't match.
function unmatched() {
  openedTiles[0].classList.add("unmatched");
  openedTiles[1].classList.add("unmatched");
  disable();
  setTimeout(function() {
    openedTiles[0].classList.remove("show", "open", "unmatched");
    openedTiles[1].classList.remove("show", "open", "unmatched");
    enable();
    openedTiles = [];
  },1000);
}

// Stops a tile being clickable after being clicked or during unmatched.
function disable() {
  let tiles = document.querySelectorAll(".grid-item");
  tiles.forEach(element => {
    element.classList.add('disabled');

  });
}

// Enable tiles that have been disabled.
function enable() {
  let tiles = document.querySelectorAll(".grid-item");
  tiles.forEach(element => {
    element.classList.remove('disabled');
      for (let i = 0; i < matchedTile.length; i++) {
        matchedTile[i].classList.add("disabled");
      }
  });
}

// Count player's guesses.
function guessCounter() {
  count++;
  counter.innerHTML = count;
  if (count == 1) { // Start timer on first paired guess.
    second = 0;
    minute = 0;
    hour = 0;
    startTimer();
  }
}

// Game timer.
let timer = document.querySelector(".timer");
function startTimer() {
  interval = setInterval(function() {
    if (minute===0) {
      if (milli>=0 && milli<=9) {
        timer.innerHTML = second+".0"+milli+" secs";
      } else {
        timer.innerHTML = second+"."+milli+" secs";
      }
    } else if (minute===1) {
      if (milli>=0 && milli<=9) {
        timer.innerHTML = minute+" min "+second+".0"+milli+" secs";
      } else {
        timer.innerHTML = minute+" min "+second+"."+milli+" secs";
      }
    } else {
      if (milli>=0 && milli<=9) {
        timer.innerHTML = minute+" mins "+second+".0"+milli+" secs";
      } else {
        timer.innerHTML = minute+" mins "+second+"."+milli+" secs";
      }
    }
    milli++;
    if (milli == 100) {
        second++;
        milli=0;
    }
    if (second == 60) {
      minute++;
      second=0;
    }
  },10);
}

// Toggles the open, show & disabled classed on the clicked tile/grid-item.
const flip = function () {
  this.classList.toggle("open");
  this.classList.toggle("show");
  this.classList.toggle("disabled");
}

function toggleSort() {
  unpackScores();
  if (sortBy === 'time') {
    sortBy = 'guess';
    printScoresGuess(topScoresGuess,playerNamesGuess,fastestMinsGuess,fastestSecsGuess,fastestMillisGuess);
  } else if (sortBy === 'guess') {
    sortBy = 'time';
    printScoresTime(topScoresTime,playerNamesTime,fastestMinsTime,fastestSecsTime,fastestMillisTime);
  }
};

// Clears scores from view and local storage.
function clearScores() {
  const highScoresList = document.querySelector(".high-scores");
  highScoresList.innerHTML = "";
  const highScoresHeading = document.querySelector(".highScoreHeading");
  highScoresHeading.innerHTML = "";
  localStorage.clear();
};

// Loop that adds event listeners to each tile.
const tiles = document.querySelectorAll(".grid-item");
for (let i = 0; i < tiles.length; i++) {
  tiles[i].addEventListener("click", flip);
  tiles[i].addEventListener("click", tileFlip);
};
