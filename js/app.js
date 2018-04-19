/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/** Checks if a function is iterative */
function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

/** Global Variables */  
const clock = document.querySelector('.clock');
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart')
const cardsDeck = document.querySelectorAll('.card');
const cardsList = [...cardsDeck];

let scoredStars = document.getElementsByClassName('scored');
let timer;
let gameStarted = false;

let openedCards = [];
let moves = 0;
let myTimeout;

/** 
 * @description Function to generate modal on the page, informing the player if he won or lost.
 * @param {string} myTitle - The title of the modal 
 * @param {string} classTitle - The class that will be in the modal title, possible choices are: success or game-over 
 * @param {string} myMessage - Message that will be displayed within the modal 
 */
function createModal(myTitle,classTitle, myMessage) {
    const modal = document.querySelector('.modal');
    const title = document.getElementById('title');
    const message = document.getElementById('message')
    const scoreMoves = document.querySelector('.scored-moves');
    const ScoreClock = document.querySelector('.scored-clock');
    const buttonRestart = document.querySelector('.button');
    modal.classList.add('show');
    title.innerHTML = myTitle;
    title.classList = classTitle;
    message.innerHTML = myMessage;
    scoreMoves.innerHTML = moves;
    ScoreClock.innerHTML = clock.innerHTML;
    buttonRestart.addEventListener('click', event => {
        modal.classList.remove('show');
        game.resetGame();
    });
}

/** Object Card */
let card = {
/** Add or remove classes on a selected card. */
    toggle (selectedCards, classes) {
        if (isIterable(selectedCards)) {
            selectedCards.forEach(selectedCard => {
                classes.forEach(classe => {
                    selectedCard.classList.toggle(classe);
                });
            });
        } else {
            classes.forEach(classe => {
                selectedCards.classList.toggle(classe);
            });
        }
        gameUtils.checkCards();
    }
};

/** Object gameUtils */
const gameUtils = {
/** Check if you have two cards selected. */
    checkCards () {
        openedCards = document.querySelectorAll('.open');
        if (openedCards.length === 2) {
            moves++;
            this.changeScore();
            this.matchedCards();
        }
    },
/** Check that the two cards selected are the same. */
    matchedCards () {
        let openCards = openedCards;
        const isEqualCard = openedCards[0].isEqualNode(openCards[1]);
        if (isEqualCard) {
            card.toggle(openedCards, ['open', 'match']);
        } else {
            myTimeout = setTimeout(() => {
                card.toggle(openCards, ['unmatch', 'show']);
            }, 1000);
            card.toggle(openedCards, ['unmatch', 'open']);
        }
    },
/** Updates player moves and score. */
    changeScore() {
        const START_COUNT = 16
        const movesElement = document.querySelector('.moves');
        movesElement.innerHTML = moves;
        if (moves%START_COUNT === 0 && moves !== 0 && scoredStars.length > 2) {
            scoredStars[scoredStars.length-scoredStars.length].classList.remove('scored');
            scoredStars[scoredStars.length-1].classList.remove('scored');
        }
    },
    startTime() {
        let startTime = new Date().getTime();

        // Update the timer every second
        timer = setInterval(function() {
        var now = new Date().getTime();
  
        // Find the time elapsed between now and start
        var elapsed = now - startTime;
  
        // Calculate minutes and seconds
        let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
  
        // Add starting 0 if seconds < 10
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
  
        let currentTime = minutes + ":" + seconds;
  
        // Update clock on game screen and modal
        clock.innerHTML = currentTime;
      }, 750);
    }
};

/** Object game */
const game = {
/** Randomize cards and add to deck container. */
    randomCards () {
        clock.innerHTML = "0:00"
        const suffleCards = shuffle(cardsList);
        deck.innerHTML = '';
        gameUtils.changeScore();
        suffleCards.forEach(element => {
            deck.appendChild(element); 
        });
    },
/** Add an event listener to the deck container. */
    startGame () {
        deck.addEventListener('click', event => {
            if (!gameStarted) {
                gameUtils.startTime();
                gameStarted = true;
            }
            oneCard = event.target;
            if (oneCard.nodeName === 'LI') {
                cardOpen = oneCard.className.includes('open');
                cardMatch = oneCard.className.includes('match');
                if (!cardOpen && !cardMatch)
                    card.toggle(oneCard, ['open', 'show']);
                    this.finishedGame();
            }
        });
    },
/** Reset the game by closing the cards and randomizing them. */
    resetGame () {
        const totalStars = document.getElementsByClassName('fa-star');
        moves = 0;
        gameStarted = false;
        clearInterval(timer);
        clearTimeout(myTimeout);
        cardsDeck.forEach(card => {
            card.className = 'card'
        });
        for (let star of totalStars) {
            star.classList.add('scored');
        }
        game.randomCards();
    },
    finishedGame() {
        const matchedCards = document.getElementsByClassName('match');
        if (matchedCards.length === 16) {
            clearInterval(timer);
            createModal(
                'Congratulations', 
                'success', 
                `You reached the throne! Let's celebrate!`)
        }
    }
};

game.randomCards();
game.startGame();

restart.addEventListener('click', game.resetGame);