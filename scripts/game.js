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

// Declaring variable for the number of top score lines (can be changed to whatever you like).
const numberOfTopScores = 10;
let topScores = [];
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
const createHighScore = (number, guesses, minute, second, milli) => {
  return `<div class="highScoreLines">${number}. ${guesses} guesses  ${minute} mins ${second}.${milli} secs.</div>`;
};

// Creates a high score line for when its one minute.
const createOneMinuteHighScore = (number, guesses, minute, second, milli) => {
  return `<div class="highScoreLines">${number}. ${guesses} guesses  ${minute} min ${second}.${milli} secs.</div>`;
};

// Creates an alternate high score line without minutes (if its a fast game).
const createMinutelessHighScore = (number, guesses, second, milli) => {
  return `<div class="highScoreLines">${number}. ${guesses} guesses  ${second}.${milli} secs.</div>`;
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

// Runs when tiles match.
function matched() {
  openedTiles[0].classList.add("match", "disabled");
  openedTiles[1].classList.add("match", "disabled");
  if (matchedTile.length === 16) {
    milli--;
    clearInterval(interval);
    guesses = parseInt(counter.innerHTML);
    // This if statement checks the current run and sorts the high scores list.
    if (topScores.length >= 1) {
      for (let i=0;i<topScores.length;i++) {
        if (guesses<topScores[i]) {
          if (i === numberOfTopScores-1) {
            topScores.pop();
            topScores.push(guesses);
            fastestMins.pop();
            fastestMins.push(minute);
            fastestSecs.pop();
            fastestSecs.push(second);
            fastestMillis.pop();
            fastestMillis.push(milli);
            break;
          } else if (i === 0) {
            topScores.unshift(guesses);
            fastestMins.unshift(minute);
            fastestSecs.unshift(second);
            fastestMillis.unshift(milli);
            break;
          } else {
            topScores.splice(i,0,guesses);
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
              fastestMins.pop();
              fastestMins.push(minute);
              fastestSecs.pop();
              fastestSecs.push(second);
              fastestMillis.pop();
              fastestMillis.push(milli);
              break;
            } else if (i === 0) {
              topScores.unshift(guesses);
              fastestMins.unshift(minute);
              fastestSecs.unshift(second);
              fastestMillis.unshift(milli);
              break;
            } else {
              topScores.splice(i,0,guesses);
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
                fastestMins.pop();
                fastestMins.push(minute);
                fastestSecs.pop();
                fastestSecs.push(second);
                fastestMillis.pop();
                fastestMillis.push(milli);
                break;
              } else if (i === 0) {
                topScores.unshift(guesses);
                fastestMins.unshift(minute);
                fastestSecs.unshift(second);
                fastestMillis.unshift(milli);
                break;
              } else {
                topScores.splice(i,0,guesses);
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
                  fastestMins.pop();
                  fastestMins.push(minute);
                  fastestSecs.pop();
                  fastestSecs.push(second);
                  fastestMillis.pop();
                  fastestMillis.push(milli);
                  break;
                } else if (i === 0) {
                  topScores.unshift(guesses);
                  fastestMins.unshift(minute);
                  fastestSecs.unshift(second);
                  fastestMillis.unshift(milli);
                  break;
                } else {
                  topScores.splice(i,0,guesses);
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
          fastestMins.push(minute);
          fastestSecs.push(second);
          fastestMillis.push(milli);
          break;
        }
      }
      if (topScores.length>numberOfTopScores) {
        topScores.pop();
        fastestMins.pop();
        fastestSecs.pop();
        fastestMillis.pop();
      }
    } else {
      topScores.push(guesses);
      fastestMins.push(minute);
      fastestSecs.push(second);
      fastestMillis.push(milli);
    }
    // let highScores = JSON.parse(localStorage.getItem('highScores'));
    // // console.log(highScores);
    // if(highScores!==null) {
    //   highScores.push(scores);
    //   localStorage.clear();
    //   localStorage.setItem('highScores', JSON.stringify(highScores));
    // } else {
    //   localStorage.clear();
    //   localStorage.setItem('highScores', JSON.stringify(scores));
    // }
    // scores = [];

    // print scores.
    let scoreListSize = topScores.length;
    const highScoresList = document.querySelector(".high-scores");
    highScoresList.innerHTML = "";
    for (let i=0;i<scoreListSize;i++) {
      let number = (i+1);
      if (fastestMins[i] === 0) {
        highScore = createMinutelessHighScore(number,topScores[i],fastestSecs[i],fastestMillis[i]);
      } else if (fastestMins[i] === 1) {
        highScore = createOneMinuteHighScore(number,topScores[i],fastestMins[i],fastestSecs[i],fastestMillis[i]);
      } else {
        highScore = createHighScore(number,topScores[i],fastestMins[i],fastestSecs[i],fastestMillis[i]);
      }
      highScoresList.appendChild(stringToHTML(highScore));
    }
  }
  openedTiles[0].classList.remove("show", "open");
  openedTiles[1].classList.remove("show", "open");
  openedTiles = [];
}

// function called when tiles don't match.
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
  if (count == 1) { // Start timer on first guess
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

// Loop that adds event listeners to each tile.
const tiles = document.querySelectorAll(".grid-item");
for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener("click", flip);
    tiles[i].addEventListener("click", tileFlip);
};
