<script lang="ts">
    import type { Card, Player } from '../types'
    import { GameStages }from '../types'
    let cards: Card[] = [];
    let junk: Card[] = [];
    let dealer: Player = {
        id: 'D',
        name: 'bot',
        hands: [{
            cards: []
        }]
    }
    let players: Player[]

    let maxNumPlayers = 4;
    let deckNum = 6;
    let currPlayer = -1;
    let seatsReady = false;
    let stage = GameStages.PREPARE;

    function resetCards() {
        cards = []
        junk = []
    }

    function initSeats(index: number) {
        const newPlayers: Player[] = []
        for (let i = 0; i< maxNumPlayers; i++) {
            newPlayers.push({
                id: i === index ? Math.random().toString() : null,
                name: 'player',
                hands: [{
                    cards: []
                }]
            })
        }
        players = newPlayers
        console.log(players)
        seatsReady = true
    }

    function generateDecks(num: number) {
        resetCards()
        const suits = ['club', 'diamond', 'heart', 'spade'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const newCards = []

        for (let i = 0; i < num; i++) {
            for (const suit of suits) {
                for (const value of values) {
                    newCards.push({ suit, value })
                }
            }
        }

        cards = newCards
    }

    function shuffle(array: Card[]) {
        console.time('shuffle')
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        console.timeEnd('shuffle')
        return array;
    }

    function initRound() {
        const maxCardNum = 2
        const usedCards = []

        for (let i=0; i < maxCardNum; i++) {
            dealer.hands[0].cards.push(cards[0])
            usedCards.push(cards[0])
            cards = cards.slice(1)

            for (const player of players) {
                if (!player.id) continue

                if (currPlayer < 0) {
                    currPlayer = players.findIndex(p => p.id === player.id)
                }

                player.hands[0].cards.push(cards[0])
                usedCards.push(cards[0])
                cards = cards.slice(1)
            }
        }

        dealer = dealer
        players = players
        junk = [...junk, ...usedCards]
        console.log(dealer)
        console.log(players)
    }

    function startGame() {
        initSeats(0)
        generateDecks(deckNum)
        shuffle(cards)
        initRound()

        stage = GameStages.START
    }
</script>

<div class="container">
    <div class="header">
        <h1>Blackjack</h1>
    </div>

    {#if stage === GameStages.PREPARE}
        <div class="input-field">
            <label for="decknum">Deck Number: </label>
            <input id="decknum" bind:value={deckNum} type="number"/>
            <span></span>
        </div>

        <div class="input-field">
            <button on:click={() => startGame()}>start</button>
        </div>
    {/if}

    {#if stage === GameStages.START}
        <div>
            <div class="dealer">
                <h3>{ dealer.name }</h3>

                {#each dealer.hands[0].cards as card}
                    <div>{ `${card.suit} ${card.value}` }</div>
                {/each}
            </div>
        </div>
    {/if}
</div>




<div>Remaining cards: { cards.length }</div>
<div>Junk cards: { junk.length }</div>


<button on:click={() => initRound()}>Deal</button>

{#if seatsReady}

    <div>
        {#each players as player}
            {#if player.id}
                <div>{ player.name }</div>
            {:else}
                <div> Empty </div>
            {/if}
            

            {#each player.hands as hand}
                <div>
                    {#each hand.cards as card}
                        <div>{ `${card.suit} ${card.value}` }</div>
                    {/each}
                </div>
            {/each}
        {/each}
    </div>
{/if}

<style>
    .container {
        border: 1px solid black;
        margin: auto;
        width: 100%;
        height: 100vh;
        max-width: 1280px;
    }

    .header {
        margin: 2rem 0;
        text-align: center;
    }

    .input-field {
        margin: 2rem 0;
        text-align: center;
    }

    .dealer {
        text-align: center;
    }

    .card {
        
    }
</style>