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
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart')
const cardsDeck = document.querySelectorAll('.card');
const cardsList = [...cardsDeck];

let scoredStars = document.getElementsByClassName('scored')

let openedCards = [];
let moves = 0;
let myTimeout;


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
        const START_COUNT = 10
        const movesElement = document.querySelector('.moves');
        movesElement.innerHTML = moves;
        if ((moves%START_COUNT + 1) === START_COUNT) {
            scoredStars[scoredStars.length - 1].classList.remove('scored');
        }
    }
};

/** Object game */
const game = {
/** Randomize cards and add to deck container. */
    randomCards () {
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
            oneCard = event.target;
            if (oneCard.nodeName === 'LI') {
                cardOpen = oneCard.className.includes('open');
                cardMatch = oneCard.className.includes('match');
                if (!cardOpen && !cardMatch)
                    card.toggle(oneCard, ['open', 'show']);
            }
        });
    },
/** Reset the game by closing the cards and randomizing them. */
    resetGame () {
        moves = 0;
        clearTimeout(myTimeout);
        cardsDeck.forEach(card => {
            card.className = 'card'
        })
        game.randomCards();
    }
};

game.randomCards();
game.startGame();

restart.addEventListener('click', game.resetGame);