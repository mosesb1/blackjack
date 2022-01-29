class Player {
    constructor(chips, dealer = false){
        this.chips = chips;
        this.hand = [];
        this.bet = 0;
        this.dealer = dealer;
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
        let unrandomizedLength = Deck.deck.length, randomIdx;
        while(unrandomizedLength !== 0) {
            randomIdx = Math.floor(Math.random()*unrandomizedLength);
            unrandomizedLength--;
            [Deck.deck[unrandomizedLength], Deck.deck[randomIdx]] = [Deck.deck[randomIdx], Deck.deck[unrandomizedLength]];
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
    static suits = ['hearts','clubs','spades','diams'];
    static cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
    static cardNames = ['two','three','four','five','six','seven','eight','nine','ten','jack','queen','king','ace'];
}

const initializeGame = (numOfDecks) => {
    resetHandDivs();
    Deck.createDeck(numOfDecks);
    Deck.shuffleDeck(Deck.deck);
    Player.createPlayers();
    for(let i = 0; i < 2; i++){
        Player.players.forEach(player => {
            let newCard = drawCard(player);
            player.hand.push(newCard)
        })
    }
    currentPlayer = Player.players[0];
    currentDealer = Player.players[1];
    bettingHead3.textContent = `Current bet: ${currentBet}. Minimum bet is 50`
    bettingHead4.textContent = `Current chip count: ${currentPlayer.chips}`
}

const getPlayerHandSums = () => {
    let playerSum = 0, dealerSum = 0;

    let playerAceCounter = 0;
    currentPlayer.hand.forEach(card => {
        if(card.name !== 'ace'){
            playerSum += card.value;
        } else {
            playerAceCounter++;
        }
    })
    while(playerAceCounter){
        if(playerSum + 11 + (playerAceCounter - 1) > 21){
            playerSum += 1;
        } else {
            playerSum += 11;
        }
        playerAceCounter--;
    }

    let dealerAceCounter = 0;
    currentDealer.hand.forEach(card => {
        if(card.name !== 'ace'){
            dealerSum += card.value;
        } else {
            dealerAceCounter++;
        }
    })
    while(dealerAceCounter){
        if(dealerSum + 11 + (dealerAceCounter - 1) > 21){
            dealerSum += 1;
        } else {
            dealerSum += 11;
        }
        dealerAceCounter--;
    }
    return [playerSum, dealerSum]
}

const checkHands = () => {
    let playerSum, dealerSum
    [playerSum, dealerSum] = getPlayerHandSums();
    if(playerSum === 21 && dealerSum === 21){
        currentPlayer.winChips(currentPlayer.bet);
        handResultsHead.textContent = 'You and the dealer got a blackjack! It\'s a push!';
        endHand();
    } else if (playerSum === 21){
        currentPlayer.winChips(2.5 * currentPlayer.bet);
        handResultsHead.textContent = `You got a blackjack! You won ${1.5*currentPlayer.bet}!`;
        endHand();
    } else if (dealerSum === 21){
        handResultsHead.textContent = 'Dealer got a blackjack!';
        endHand();
    }
}

const endHand = () => {
    removeDoubleBtn();
    const cardFrames = document.querySelectorAll('#dealer-cards > .hidden-frame');
    cardFrames.forEach(cardFrame => {
        cardFrame.classList.remove('hidden-frame');
    })
    choiceBtnsDiv.classList.remove('show');
    newGameBtn.textContent = 'Start New Game';
    currentBet = currentPlayer.chips > 0 ? Math.min(currentPlayer.chips,50) : 50;
    bettingHead3.textContent = `Current bet: ${currentBet}. Minimum bet is 50`
    bettingHead4.textContent = `Current chip count: ${currentPlayer.chips}`
    if(!currentPlayer.chips){
        gameResultsHead.textContent = 'You ran out of chips! Game over!';
        gameResults.classList.add('show');
    } else if(currentPlayer.chips > chipGoal){
        gameResultsHead.textContent = `You passed ${chipGoal} chips! You win!`;
        gameResults.classList.add('show');
    } else{
        handResults.classList.add('show');
    }
}

const startNewGame = (evt) => {
    dealerCards.classList.remove('show');
    playerCards.classList.remove('show');
    gameResults.classList.remove('show');
    difficultyDiv.classList.remove('hide');
    while(dealerCards.hasChildNodes()){
        dealerCards.removeChild(dealerCards.lastChild);
    }
    while(playerCards.hasChildNodes()){
        playerCards.removeChild(playerCards.lastChild);
    }
}

const startNewHand = (evt) => {
    dealerCards.classList.remove('show');
    playerCards.classList.remove('show');
    handResults.classList.remove('show');
    resetHandDivs();
    dealNewHands();
    betBtnsDiv.classList.add('show');
}

const dealNewHands = () => {
    while(currentPlayer.hand.length){
        currentPlayer.hand.pop();
    }
    while(currentDealer.hand.length){
        currentDealer.hand.pop();
    }

    for(let i = 0; i < 2; i++){
        Player.players.forEach(player => {
            let newCard = drawCard(player);
            player.hand.push(newCard);
        })
    }
}

const resetHandDivs = () => {
    while(dealerCards.hasChildNodes()){
        dealerCards.removeChild(dealerCards.lastChild);
    }
    while(playerCards.hasChildNodes()){
        playerCards.removeChild(playerCards.lastChild);
    }
}

const evaluateResult = () => {
    let playerSum, dealerSum;
    [playerSum, dealerSum] = getPlayerHandSums();
    if(dealerSum > 21){
        handResultsHead.textContent = `The dealer busts! You win ${currentPlayer.bet} chips!`;
        currentPlayer.winChips(2*currentPlayer.bet);
    } else if(dealerSum === playerSum){
        handResultsHead.textContent = `It's a push! You get your ${currentPlayer.bet} chips back!`;
        currentPlayer.winChips(currentPlayer.bet);
    } else if(dealerSum > playerSum){
        handResultsHead.textContent = `The dealer wins! You lose ${currentPlayer.bet} chips!`;
    } else {
        handResultsHead.textContent = `You win! You win ${currentPlayer.bet} chips!`;
        currentPlayer.winChips(2*currentPlayer.bet);
    }
    endHand();
}

const executeDealerTurn = () => {
    let [playerSum, dealerSum] = getPlayerHandSums();
    while(dealerSum < 17){
        let newCard = drawCard(currentDealer);
        currentDealer.hand.push(newCard);
        dealerSum = getPlayerHandSums()[1];
    }
}

const removeDoubleBtn = () => {
    if(document.querySelector('#choice-options > .double')){
        choiceOptions.removeChild(doubleBtn);
    }
}

const removeSurrenderBtn = () => {
    if(document.querySelector('#choice-options > .surrender')){
        choiceOptions.removeChild(surrenderBtn);
    }
}

const drawCard = (player) => {
    let newCard = Deck.deck.pop();
    createCard(newCard, player);
    return newCard;
}

const createCard = (card, player) => {
    const cardFrame = document.createElement('div');
    cardFrame.classList.add('card');
    ['spades','clubs'].includes(card.suit) ? cardFrame.classList.add('black') : cardFrame.classList.add('red');
    const cardValue = document.createElement('p');
    cardValue.classList.add('card-value');
    if(['ace','jack','queen','king'].includes(card.name)){
        cardValue.textContent = card.name[0].toUpperCase();
    } else {
        cardValue.textContent = card.value;
    }
    const cardSuit = document.createElement('p');
    cardSuit.classList.add('card-suit');
    cardSuit.innerHTML = `&${card.suit};`;
    cardFrame.appendChild(cardValue);
    cardFrame.appendChild(cardSuit);
    if(player.dealer){
        if(!player.hand.length){
            cardFrame.classList.add('hidden-frame');
        }
        dealerCards.appendChild(cardFrame);
    }else{
        playerCards.appendChild(cardFrame);
    }
}

const doubleBet = (evt) => {
    currentPlayer.winChips(currentPlayer.bet);
    currentPlayer.bet = currentPlayer.bet * 2 <= currentPlayer.chips ? currentPlayer.bet * 2 : currentPlayer.chips;
    currentPlayer.makeBet();
    choicesHead.innerHTML = `Current chip total: ${currentPlayer.chips} </br> Current bet: ${currentPlayer.bet}`
    removeDoubleBtn();
    removeSurrenderBtn();
}

const surrenderHand = (evt) => {
    currentPlayer.winChips(.5*currentPlayer.bet);
    handResultsHead.textContent = `You surrendered the hand! You got back ${.5*currentPlayer.bet} chips!`;
    endHand();
}

const chooseNumOfDecks = (evt) => {
    numOfDecks = parseInt(evt.target.textContent);
    deckBtnsDiv.classList.remove('show');
    initializeGame(numOfDecks);
    betBtnsDiv.classList.add('show');
}

const makeBets = (evt) => {
    if(evt.target.textContent === 'Submit Bet'){
        betBtnsDiv.classList.remove('show');
        currentPlayer.bet = currentBet;
        currentPlayer.makeBet();
        choiceBtnsDiv.classList.add('show');
        checkHands();
        choiceOptions.appendChild(doubleBtn);
        choiceOptions.appendChild(surrenderBtn);
        dealerCards.classList.add('show');
        playerCards.classList.add('show');
        choicesHead.innerHTML = `Current chip total: ${currentPlayer.chips} </br> Current bet: ${currentBet}`;
        if(!currentPlayer.chips){
            removeDoubleBtn();
        }
    } else if(evt.target.textContent[0] === '+'){
        currentBet = currentBet + parseInt(evt.target.textContent.slice(1))<= currentPlayer.chips ? currentBet + parseInt(evt.target.textContent.slice(1)): currentPlayer.chips;
    } else if(evt.target.textContent === 'Bet All Chips') {
        currentBet = currentPlayer.chips;
    } else {
        currentBet = currentBet - parseInt(evt.target.textContent.slice(1)) >= 50 ? currentBet - parseInt(evt.target.textContent.slice(1)): Math.min(50,currentPlayer.chips);
    }
    bettingHead3.textContent = `Current bet: ${currentBet}. Minimum bet is 50`;
}

const makeChoices = (evt) => {
    if(evt.target.textContent === 'Hit'){
        removeDoubleBtn();
        removeSurrenderBtn();
        let newCard = drawCard(currentPlayer);
        currentPlayer.hand.push(newCard);
        if(currentPlayer.isBusted()){
            handResultsHead.textContent = 'Bust!';
            endHand();
        } else if(currentPlayer.hand.length >= 5){
            handResultsHead.textContent = `Five card Charlie! You win ${2*currentPlayer.bet}!`;
            currentPlayer.winChips(3*currentPlayer.bet);
            endHand();
        }
    } else if(evt.target.textContent === 'Stand'){
        choiceBtnsDiv.classList.remove('show');
        executeDealerTurn();
        evaluateResult();
    }
}

const chooseDifficulty = (evt) => {
    chipGoal = parseInt(evt.target.textContent);
    difficultyDiv.classList.add('hide');
    deckBtnsDiv.classList.add('show');
}

let numOfDecks;
const choicesHead = document.querySelector('#choices > h2');
const bettingHead3 = document.querySelector('#betting > h3');
const bettingHead4 = document.querySelector('#betting > h4');
const handResultsHead = document.querySelector('#hand-results > h1');
const gameResultsHead = document.querySelector('#game-results > h1');
const gameResults = document.getElementById('game-results');
const handResults = document.getElementById('hand-results');
const playerCards = document.getElementById('player-cards');
const dealerCards = document.getElementById('dealer-cards');
const difficultyBtns = document.querySelectorAll('#chip-total > button');
const difficultyDiv = document.getElementById('choose-difficulty');
const deckBtns = document.querySelectorAll('#number-of-decks > button');
const deckBtnsDiv = document.getElementById('choose-decks');
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
const surrenderBtn = document.createElement('button');
surrenderBtn.textContent = 'Surrender';
surrenderBtn.classList.add('surrender');
let currentBet = 50;
let currentPlayer, currentDealer, chipGoal;

difficultyBtns.forEach(difficultyBtn => {
    difficultyBtn.addEventListener('click', chooseDifficulty);
})

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
doubleBtn.addEventListener('click',doubleBet);
surrenderBtn.addEventListener('click',surrenderHand);