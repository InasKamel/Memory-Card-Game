$(function () {
    let waitingCard = false,
    openCards = null, //will store the two flipped card to compare similarity
    movesNo = 0,
    starRating = 3,
    totalSeconds = 0,
    defaultPage = $( 'body' ).html(),
    oopsPage,
    congratsPage,
    // the list of the cards
    cards = [
        '<i class="fa fa-diamond"></i>',
        '<i class="fa fa-paper-plane-o"></i>',
        '<i class="fa fa-anchor"></i>',
        '<i class="fa fa-bolt"></i>',
        '<i class="fa fa-cube"></i>',
        '<i class="fa fa-anchor"></i>',
        '<i class="fa fa-leaf"></i>',
        '<i class="fa fa-bicycle"></i>',
        '<i class="fa fa-diamond"></i>',
        '<i class="fa fa-bomb"></i>',
        '<i class="fa fa-leaf"></i>',
        '<i class="fa fa-bomb"></i>',
        '<i class="fa fa-bolt"></i>',
        '<i class="fa fa-bicycle"></i>',
        '<i class="fa fa-paper-plane-o"></i>',
        '<i class="fa fa-cube"></i>'
    ],
/**
 * @description randomly shuffle the list of cards.
 * @param {object} cardsList - the array of the game cards.
 * @return {object} the new shuffled array.
 */
    shuffle = function(cardsList) {
        let currentIndex = cardsList.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = cardsList[currentIndex];
            cardsList[currentIndex] = cardsList[randomIndex];
            cardsList[randomIndex] = temporaryValue;
        };
        return cardsList;
    },

    /**
     * @description flip the card.
     * @param {object} clickedCard - the card the player just clicked
     */

    showCard = function( clickedCard ) {
        $( clickedCard ).toggleClass( 'open show' );
        $( clickedCard ).off( 'click' );
        storeOpenCards();
    },
    storeOpenCards = function() {
        if(waitingCard === true) {
            openCards = $( '.open.show' );
        }
    },

    /**
     * @description reset the game when Play Again! button clicked
     */

    resetGame = function() {
        waitingCard = false,
        openCards = null,
        movesNo = 0;
        totalSeconds = 0;
        starRating = 3;
        $( 'body' ).html(defaultPage);
        setTimer();        
        arrangeCards();
        $('.restart').on('click', restartGame);
    },

    /**
     * @description restart the game when the restart button is clicked.
     */

    restartGame = function() {
        waitingCard = false,
        openCards = null,
        movesNo = 0;
        totalSeconds = 0;
        starRating = 3;
        $( '.moves' ).text('0');
        $ ( '.stars' ).find( '.fa.fa-star-o' ).toggleClass( ' fa fa-star-o fa fa-star');
        $( '.deck' ).empty();
        arrangeCards();
    },

    /**
     * @description display an oops pop up when there are no extra stars or the timer is expired.
     * @param {string} failure - the cause of oops pop up
     */

    displayOopsMessage = function( failure ) {
        oopsPage = `
        <div class="congrats-oops-container">
            <img src="img/crying-emoji.png">
            <h2>Oops! The Game Finished!</h2>
            <p>${ failureString }</p>
            <button>Try again!</button>
        </div>`
        $( 'body' ).html( oopsPage );
        $( 'button' ).click( resetGame );
    },

    /**
     * @description display a congrats. pop up when the player wins.
     */

    displayCongratsMessage = function() {
        congratsPage = `
    <div class="congrats-oops-container">
        <div class="circle-check">
            <i class="fa fa-check faa-pulse"></i>
        </div>
        <h2>Congratulations! You Won!</h2>
        <p>With ${movesNo} Moves and ${starRating} Stars in ${parseInt(totalSeconds / 60)} Mins. and ${totalSeconds % 60} Secs.</p>
        <p>Woooooooow!</p>
        <button>Play again!</button>
    </div>`;
        $( 'body' ).html( congratsPage );
        $( 'button' ).click( resetGame );
    },

 theyMatch = function() {
        openCards.toggleClass( 'open show correct match' );
    },

    theyNotMatch = function() {
        let symbol1 = openCards.first().children().attr('class' );
        let symbol2= openCards.last().children().attr('class' );
        setTimeout( function() {
            openCards.toggleClass( 'open incorrect' );
            openCards.children().attr('class', 'fa fa-bolt');
            setTimeout( function() {
                openCards.toggleClass( 'show incorrect' );
                openCards.first().children().attr( 'class', symbol1 );
                openCards.last().children().attr('class', symbol2 );
                openCards.on( 'click', cardClick );
            }, 200);
        }, 200 );
    },

    winTheGame = function() {
        if($( '.correct.match' ).length === cards.length) {
            setTimeout( function() {
                displayCongratsMessage();
            }, 300 );
        }
    },

    /**
    * @description compare the similarity between the two flipped cards.
    */

    compareCards = function() {
        if (openCards.first().children().attr( 'class' ) === openCards.last().children().attr( 'class' )) {
            theyMatch();
        } else {
            theyNotMatch();
        }
        waitingCard = false;
        winTheGame(); 
    },

    /**
     * @description decreases the number of stars after depending on the player moves
     * and checks the if the timer expires
     */

    playerPerformance = function() {
        if ( movesNo === 10 ) {
            starRating--;
            $( '.stars' ).find('.fa.fa-star').last().attr('class', 'fa fa-star-o');
        } else if ( movesNo === 25 ) {
            starRating--;
            $( '.stars' ).find('.fa.fa-star').last().attr('class', 'fa fa-star-o');
        } else if ( movesNo === 35 ) {
            displayOopsMessage( 'You Have No Extra Stars!!' );
        }
        if ( totalSeconds > 180 ) {
            displayOopsMessage( 'The Timer Expired!!' );
        }
    },

    cardClick = function( e ) {
        if ( waitingCard === false ) {
            showCard( e.target );
            waitingCard = true; 
        } else {
            $( '.moves' ).text( ++movesNo );
            showCard( e.target );
            playerPerformance();
            compareCards();
        }
    },

    setTimer = function() {

        setInterval(() => {
            ++totalSeconds;
            $( '.seconds' ).text( pad(totalSeconds % 60) );
            $( '.minutes' ).text( pad(parseInt(totalSeconds / 60)));
            function pad(val) {
                const valString = val + "";
                if (valString.length < 2) {
                  return "0" + valString;
                } else {
                  return valString;
                }
              }
        }, 1000);
    },

    /**
     * @description arrange the cards on the deck
     */

    arrangeCards = function() {
        cards = shuffle(cards);
        for( let card of cards ) {
            $('.deck').append(`<li class="card">${card}</li>`);
        }
        $('.card').on( 'click', cardClick);
    };

    setTimer();
    arrangeCards();
    $('.restart').on('click', restartGame);
});