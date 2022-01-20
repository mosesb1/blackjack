class Deck {
    constructor(){}
    static deck = [];
    static createDeck(numOfDecks){
        for(let i = 0; i < numOfDecks; i++){
            Card.cards.forEach((card, idx) => {
                Card.suits.forEach(suit => {
                    let newCard = new Card(Card.cardNames[idx],card,suit);
                    Deck.deck.push(newCard);
                })
            })
        }
    }
    static shuffleDeck(deck){
        let currentIdx = deck.length, randomIdx;
        while(currentIdx !== 0) {
            randomIdx = Math.floor(Math.random()*currentIdx);
            currentIdx--;
            [deck[currentIdx], deck[randomIdx]] = [deck[randomIdx], deck[currentIdx]];
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

