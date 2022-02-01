# Technology Used: HTML/CSS/JavaScript VSCode Github

# Rules:

## Objective:
To get the total value of your hand as close to 21 without going over.

## Card Values:
Numbered cards are worth what is on the card. The face cards (Queen, Jack, King) are worth 10.
Aces are worth either 1 or 11, whichever results in the better hand total.

## Start of the game:
You will be asked to choose the number of 52 card decks that are shuffled in as well as the chip total that you wish to play toward (if you hit the total you win).

After these selections, you will place a bet. The minimum bet is 50 (or your chip total, whichever is lowest) and the maximum bet is your chip total.

After your bet, you and the dealer will both be dealt 2 cards. You can consider your cards to be hidden from the dealer and one of the dealer's cards will be hidden from you.

## Blackjack
For the purposes of this game, a blackjack is when 21 is dealt to one or both players in the opening hand.
This will automatically end the hand.

## Your turn
When you start your turn, you will have 3 or 4 options depending on your bet.

### Hit
This will ask the dealer for another card. Be careful! If your hand's total exceeds 21 you automatically lose!

### Stand
This will end your turn and start the dealer's turn. Try to get as close to 21 without going over before you stand!

### Double Bet
If you did not bet all your chips, you may double your bet *before* you choose to hit on your turn. Once you hit, you will no longer have the option to double. You may only double once on your turn.

If you do not have enough chips to double your current bet, it will bet the rest of your chips instead.

### Surrender
If you feel that your opening hand is too risky to hit/stand, you may surrender the turn. This will return half of your bet and end the turn. Similar to double, you may only surrender *before* you choose to hit. Doubling your bet will also prevent you from surrendering the hand.

## The dealer's turn
Once you stand, the dealer will use the following logic to hit/stand:
- hit if current hand total is less than 17
- stand otherwise

## How you win
There are 4 ways to win:
- Get a blackjack (21 in your opening hand)
- Dealer bust
- Have a higher hand total than the dealer
- Five Card Charlie: if you get 5 cards in your hand without exceeding 21, you automatically win

## Ties
In the event that the dealer and player have the same hand total (including a blackjack),
the hand will be declared a push and your chips will be returned.

## Payouts
- Dealer bust: 1x your bet
- Higher hand total than dealer: 1x your bet
- Blackjack: 1.5x your bet
- Five Card Charlie: 2x your bet

## Winning/Losing the game
You win the game if you reach the chip total you selected to play toward at the beginning of the game. 

You lose if you run out of chips. Don't worry though, you can always play again!