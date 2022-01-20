class Player {
    constructor(chips, opponent = false, dealer = false){
        this.chips = chips;
        this.hand = [];
        this.opponent = opponent;
        this.dealer = dealer;
    }
    isPlayer(){
        return !this.opponent && !this.dealer
    }
    isBusted(){
        let sum = 0;
        this.hand.forEach(card => {
            sum += card.value;
        })
        return sum > 21;
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
                        newCard.value = 1;
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
    for(let i = 0; i < 2; i++){
        Player.players.forEach(player => {
            player.hand.push(Deck.deck.pop())
        })
    }

    currentPlayer = Player.players[0];
}

let numOfDecks, numOfOpponents;
const deckBtns = document.querySelectorAll('#number-of-decks > button');
const opponentBtns = document.querySelectorAll('#number-of-opponents > button');
const betBtns = document.querySelectorAll('#bet-options > button');
const choiceBtns = document.querySelectorAll('#choice-options > button');
const betBtnsDiv = document.getElementById('betting');
const choiceBtnsDiv = document.getElementById('choices');
const opponentBtnsDiv = document.getElementById('choose-opponents');
let currentBet = 50;
let currentPlayer;

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
        betBtnsDiv.classList.add('show');
    })
})

betBtns.forEach(betBtn => {
    betBtn.addEventListener('click', (evt) => {
        if(evt.target.textContent === 'Bet'){
            betBtnsDiv.classList.remove('show');
            choiceBtnsDiv.classList.add('show');
        } else if(evt.target.textContent[0] === '+'){
            currentBet = currentBet + parseInt(evt.target.textContent.slice(1))<= currentPlayer.chips ? currentBet + parseInt(evt.target.textContent.slice(1)): currentPlayer.chips;
        } else {
            currentBet = currentBet - parseInt(evt.target.textContent.slice(1)) >= 50 ? currentBet - parseInt(evt.target.textContent.slice(1)): 50;
        }
        document.querySelector('#betting > h3').textContent = `Current bet: ${currentBet}. Minimum bet is 50.`;
    })
})

choiceBtns.forEach(choiceBtn => {
    choiceBtn.addEventListener('click', (evt) => {
        if(!currentPlayer.isPlayer()){
            return
        } else if(evt.target.textContent === 'Hit'){
            currentPlayer.hand.push(Deck.deck.pop());
            console.log(currentPlayer.hand);
            if(currentPlayer.isBusted()){
                choiceBtnsDiv.remove('show');
                document.querySelector('#results > h1').textContent = 'Bust!';
                document.getElementById('results').classList.add('show');
            }
        } else {
            choiceBtnsDiv.classList.remove('show');

        }
    })
})

