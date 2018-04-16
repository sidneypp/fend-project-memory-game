/*
 * Create a list that holds all of your cards
 */


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

/* 
* Verifica se uma função é iterativa
*/
function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

/* Global Variables */  
const deck = document.querySelector('.deck');
const cardsDeck = document.querySelectorAll('.card'); //NodeList
const cardsList = [...cardsDeck]; //ArrayList

let openedCards = [];


/* Object Card */
let card = {
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

/* Object gameUtils */
const gameUtils = {
    checkCards () {
        openedCards = document.querySelectorAll('.open');
        if (openedCards.length === 2) {
            this.matchedCards();
        }
    },
    matchedCards () {
        let openCards = openedCards;
        const isEqualCard = openedCards[0].isEqualNode(openCards[1]);
        if (isEqualCard) {
            card.toggle(openedCards, ['open', 'match']);
        } else {
            setTimeout(() => {
                card.toggle(openCards, ['unmatch', 'show']);
            }, 1000);
            card.toggle(openedCards, ['unmatch', 'open']);
        }
    }
};

/* Object game */
const game = {
    randomCards () {
        const fragment = document.createDocumentFragment();
        const suffleCards = shuffle(cardsList);
        deck.innerHTML = '';
        suffleCards.forEach(element => {
            deck.appendChild(element);
        });
    },
    startGame () {
        cardsDeck.forEach(oneCard => {
            oneCard.addEventListener('click', (event) => {
                if (!oneCard.className.includes("match") && !oneCard.className.includes("open"))
                    card.toggle(oneCard, ['open', 'show']);
            })
        });
    }
}

game.randomCards();
game.startGame();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
