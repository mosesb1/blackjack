class Player {
    constructor(chips, opponent = false, dealer = false){
        this.chips = chips;
        this.hand = [];
        this.opponent = opponent;
        this.dealer = dealer;
    }
    static players = [];
    static createPlayers(numOfOpponents){
        for(let i = 0; i < numOfOpponents; i++){
            const opponent = new Player(1000,true);
            Player.players.push(opponent);
        }
        const player = new Player(1000);
        const dealer = new Player(1000,false,true);
        Player.players.push(player, dealer);
    }
}
class Deck {
    constructor(){}
    static deck = [];
    static createDeck(numOfDecks){
        for(let i = 0; i < numOfDecks; i++){
            Card.cards.forEach((card, idx) => {
                Card.suits.forEach(suit => {
                    let newCard = new Card(Card.cardNames[idx],card,suit);
                    if(newCard.value === 'J' || newCard.value === 'Q' || newCard.value === 'K'){
                        newCard.value = 10;
                    } else if (newCard.value === 'A'){
                        newCard.value = [1,11];
                    }
                    Deck.deck.push(newCard);
                })
            })
        }
    }
    static shuffleDeck(){
        let currentIdx = Deck.deck.length, randomIdx;
        while(currentIdx !== 0) {
            randomIdx = Math.floor(Math.random()*currentIdx);
            currentIdx--;
            [Deck.deck[currentIdx], Deck.deck[randomIdx]] = [Deck.deck[randomIdx], Deck.deck[currentIdx]];
        }
        // Fisher-Yates shuffle algorithm
    }
}

class Card {
    constructor(name,value,suit){
        this.name = name;
        this.value = value;
        this.suit = suit;
    }
    static suits = ['heart','club','spade','diamond'];
    static cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
    static cardNames = ['two','three','four','five','six','seven','eight','nine','ten','jack','queen','king','ace'];
}

const initializeGame = (numOfDecks, numOfOpponents) => {
    Deck.createDeck(numOfDecks);
    Deck.shuffleDeck(Deck.deck);
    Player.createPlayers(numOfOpponents);
}

let numOfDecks, numOfOpponents;
const deckBtns = document.querySelectorAll('#number-of-decks > button');
const opponentBtns = document.querySelectorAll('#number-of-opponents > button');
const opponentBtnsDiv = document.getElementById('choose-opponents');
deckBtns.forEach(deckBtn => {
    deckBtn.addEventListener('click', (evt) => {
        numOfDecks = parseInt(deckBtn.textContent);
        const deckBtnsDiv = document.getElementById('choose-decks');
        deckBtnsDiv.classList.add('hide');
        opponentBtnsDiv.classList.add('show');
    })
})

opponentBtns.forEach(opponentBtn => {
    opponentBtn.addEventListener('click', (evt) => {
        numOfOpponents = parseInt(opponentBtn.textContent);
        opponentBtnsDiv.classList.remove('show');
        initializeGame(numOfDecks, numOfOpponents);
    })
})

