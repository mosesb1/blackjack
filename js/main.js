class Player {
    constructor(chips, dealer = false){
        this.chips = chips;
        this.hand = [];
        this.splitHand = [];
        this.split = false;
        this.bet = 0;
        this.dealer = dealer;
    }
    isPlayer(){
        return !this.dealer
    }
    isBusted(){
        let sum = 0;
        this.hand.forEach(card => {
            if(card.name === 'ace'){
                sum += card.value[0];
            } else {
                sum += card.value;
            }
        })
        return sum > 21;
    }
    makeBet(){
        this.chips -= this.bet;
    }
    winChips(chips){
        this.chips += chips;
    }
    static players = [];
    static createPlayers(){
        while(Player.players.length){
            Player.players.pop();
        }
        const player = new Player(1000);
        const dealer = new Player(0,true);
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

const initializeGame = (numOfDecks) => {
    Deck.createDeck(numOfDecks);
    Deck.shuffleDeck(Deck.deck);
    Player.createPlayers();
    for(let i = 0; i < 2; i++){
        Player.players.forEach(player => {
            player.hand.push(Deck.deck.pop())
        })
    }

    currentPlayer = Player.players[0];
    document.querySelector('#betting > h3').textContent = `Current bet: ${currentBet}. Minimum bet is 50`
    document.querySelector('#betting > h4').textContent = `Current chip count: ${currentPlayer.chips}`
}

const getPlayerHandSums = () => {
    let playerSum = 0, dealerSum = 0;
    const player = Player.players[0];
    const dealer = Player.players[1];
    console.log(dealer.hand, player.hand);
    for(let i = 0; i < player.hand.length; i++){
        if(player.hand[i].name === 'ace'){
            playerSum += player.hand[i].value[0];
        } else {
            playerSum += Player.players[0].hand[i].value;
        }
    }
    for(let i = 0; i < dealer.hand.length; i++){
        if(dealer.hand[i].name === 'ace'){
            dealerSum += dealer.hand[i].value[0];
        } else {
            dealerSum += Player.players[1].hand[i].value;
        }
    }
    console.log(playerSum,dealerSum);
    return [playerSum, dealerSum]
}

const checkHands = () => {
    let playerSum, dealerSum
    [playerSum, dealerSum] = getPlayerHandSums();
    const handResult = document.querySelector('#hand-results > h1');
    const handSums = document.querySelector('#hand-results > h2');
    console.log(playerSum, dealerSum);
    if(playerSum === 21 && dealerSum === 21){
        currentPlayer.winChips(currentPlayer.bet);
        handResult.textContent = 'You and the dealer got a blackjack! It\'s a push!';
        handSums.textContent = '';
        endHand();
    } else if (playerSum === 21){
        currentPlayer.winChips(2.5 * currentPlayer.bet);
        handResult.textContent = `You got a blackjack! You won ${1.5*currentPlayer.bet}!`;
        handSums.textContent = '';
        endHand();
    } else if (dealerSum === 21){
        handResult.textContent = 'Dealer got a blackjack!';
        handSums.textContent = '';
        endHand();
    }
}

const endHand = () => {
    removeDouble();
    removeSplit();
    choiceBtnsDiv.classList.remove('show');
    const gameResults = document.querySelector('#game-results > h1');
    const handResultsDiv = document.getElementById('hand-results');
    const gameResultsDiv = document.getElementById('game-results');
    newGameBtn.textContent = 'Start New Game';
    resetHandDisplay();
    currentBet = 50;
    document.querySelector('#betting > h3').textContent = `Current bet: ${currentBet}. Minimum bet is 50`
    document.querySelector('#betting > h4').textContent = `Current chip count: ${currentPlayer.chips}`

    if(!currentPlayer.chips){
        gameResults.textContent = 'You ran out of chips! Game over!';
        gameResultsDiv.classList.add('show');
    } else if(currentPlayer.chips > 10000){
        gameResults.textContent = `You passed 10000 chips! You win!`;
        gameResultsDiv.classList.add('show');
    } else{
        handResultsDiv.classList.add('show');
        return
    }
}

const startNewGame = (evt) => {
    document.getElementById('game-results').classList.remove('show');
    document.getElementById('choose-decks').classList.remove('hide');
}

const startNewHand = (evt) => {
    document.getElementById('hand-results').classList.remove('show');
    dealNewHands();
    betBtnsDiv.classList.add('show');
}

const dealNewHands = () => {
    while(currentPlayer.hand.length){
        currentPlayer.hand.pop();
    }
    while(Player.players[1].hand.length){
        Player.players[1].hand.pop();
    }
    for(let i = 0; i < 2; i++){
        Player.players.forEach(player => {
            player.hand.push(Deck.deck.pop())
        })
    }
}

const resetHandDisplay = () => {
    const handUl = document.querySelector('#choices > ul');
    choiceBtnsDiv.removeChild(handUl);
}

const evaluateResult = () => {
    let playerSum, dealerSum;
    [playerSum, dealerSum] = getPlayerHandSums();
    const handResults = document.querySelector('#hand-results > h1');
    const handSums = document.querySelector('#hand-results > h2');
    const handSums2 = document.querySelector('#game-results > h2');
    handSums.textContent = `Your hand: ${playerSum}. The dealer's hand: ${dealerSum}.`;
    handSums2.textContent = `Your hand: ${playerSum}. The dealer's hand: ${dealerSum}.`;
    if(dealerSum > 21){
        handResults.textContent = `The dealer busts! You win ${currentPlayer.bet} chips!`;
        currentPlayer.winChips(2*currentPlayer.bet);
    } else if(dealerSum === playerSum){
        handResults.textContent = `It's a push! You get your ${currentPlayer.bet} chips back!`;
        currentPlayer.winChips(currentPlayer.bet);
    } else if(dealerSum > playerSum){
        handResults.textContent = `The dealer wins! You lose ${currentPlayer.bet} chips!`;
    } else {
        handResults.textContent = `You win! You win ${currentPlayer.bet} chips!`;
        currentPlayer.winChips(2*currentPlayer.bet);
    }
    endHand();
}

const executeDealerTurn = () => {
    let [playerSum, dealerSum] = getPlayerHandSums();
    while(dealerSum < 17){
        let newCard = Deck.deck.pop();
        Player.players[1].hand.push(newCard);
        dealerSum += newCard.value;
        console.log(Player.players[1].hand);
    }
}

const removeDouble = () => {
    if(document.querySelector('#choice-options > .double')){
        choiceOptions.removeChild(doubleBtn);
    }
}

const removeSplit = () => {
    if(document.querySelector('#choice-options > .split')){
        choiceOptions.removeChild(splitBtn);
    }
}

const splitHand = (evt) => {
    currentPlayer.splitHand.push(currentPlayer.hand.pop());
    currentPlayer.makeBet();
    removeSplit();
    removeDouble();
}

const doubleBet = (evt) => {
    currentPlayer.winChips(currentPlayer.bet);
    currentPlayer.bet = currentPlayer.bet * 2 <= currentPlayer.chips ? currentPlayer.bet * 2 : currentPlayer.chips;
    currentPlayer.makeBet();
    removeDouble();
}

const chooseNumOfDecks = (evt) => {
    numOfDecks = parseInt(evt.target.textContent);
    const deckBtnsDiv = document.getElementById('choose-decks');
    deckBtnsDiv.classList.add('hide');
    initializeGame(numOfDecks);
    betBtnsDiv.classList.add('show');
}

const makeBets = (evt) => {
    if(evt.target.textContent === 'Bet'){
        betBtnsDiv.classList.remove('show');
        let currHand = document.createElement('ul');
        currentPlayer.hand.forEach(card => {
            let currCard = document.createElement('li');
            currCard.textContent = card.value;
            currHand.appendChild(currCard);
        })
        currentPlayer.bet = currentBet;
        currentPlayer.makeBet();
        choiceBtnsDiv.appendChild(currHand);
        choiceBtnsDiv.classList.add('show');
        checkHands();
        choiceOptions.appendChild(doubleBtn);
        doubleBtn.addEventListener('click',doubleBet);
        if(currentPlayer.hand[0].value === currentPlayer.hand[1].value || currentPlayer.hand[0].name === currentPlayer.hand[1].name){
            choiceOptions.appendChild(splitBtn);
        }
        document.querySelector('#choices > h2').textContent = `Current hand total: ${getPlayerHandSums()[0]}. Dealer's visible card: ${Player.players[1].hand[0].name}.`;
    } else if(evt.target.textContent[0] === '+'){
        currentBet = currentBet + parseInt(evt.target.textContent.slice(1))<= currentPlayer.chips ? currentBet + parseInt(evt.target.textContent.slice(1)): currentPlayer.chips;
    } else {
        currentBet = currentBet - parseInt(evt.target.textContent.slice(1)) >= 50 ? currentBet - parseInt(evt.target.textContent.slice(1)): Math.min(50,currentPlayer.chips);
    }
    document.querySelector('#betting > h3').textContent = `Current bet: ${currentBet}. Minimum bet is 50`;
}

const makeChoices = (evt) => {
    if(evt.target.textContent === 'Hit'){
        removeDouble();
        removeSplit();
        currentPlayer.hand.push(Deck.deck.pop());
        let newCard = document.createElement('li');
        newCard.textContent = currentPlayer.hand[currentPlayer.hand.length-1].value;
        document.querySelector('#choices > ul').appendChild(newCard)
        document.querySelector('#choices > h2').textContent = `Current hand total: ${getPlayerHandSums()[0]}. Dealer's visible card: ${Player.players[1].hand[0].name}.`;
        if(currentPlayer.isBusted()){
            document.querySelector('#hand-results > h1').textContent = 'Bust!';
            document.querySelector('#hand-results > h2').textContent = `Your hand: ${getPlayerHandSums()[0]}.`;
            document.querySelector('#game-results > h2').textContent = `Your hand: ${getPlayerHandSums()[0]}.`;
            endHand();
        }
    } else if(evt.target.textContent === 'Stand'){
        choiceBtnsDiv.classList.remove('show');
        executeDealerTurn();
        evaluateResult();
    }
}

let numOfDecks;
const deckBtns = document.querySelectorAll('#number-of-decks > button');
const betBtns = document.querySelectorAll('#bet-options > button');
const choiceBtns = document.querySelectorAll('#choice-options > button');
const choiceOptions = document.getElementById('choice-options');
const betBtnsDiv = document.getElementById('betting');
const choiceBtnsDiv = document.getElementById('choices');
const newHandBtn = document.querySelector('#hand-results > button');
const newGameBtn = document.querySelector('#game-results > button');
const doubleBtn = document.createElement('button');
doubleBtn.textContent = 'Double Bet';
doubleBtn.classList.add('double');
const splitBtn = document.createElement('button');
splitBtn.textContent = 'Split';
splitBtn.classList.add('split');

let currentBet = 50;
let currentPlayer;

deckBtns.forEach(deckBtn => {
    deckBtn.addEventListener('click',chooseNumOfDecks);
})

betBtns.forEach(betBtn => {
    betBtn.addEventListener('click',makeBets);
})

choiceBtns.forEach(choiceBtn => {
    choiceBtn.addEventListener('click',makeChoices);
})

newHandBtn.addEventListener('click',startNewHand);
newGameBtn.addEventListener('click',startNewGame);