<script lang="ts">
    import { handle_promise } from 'svelte/internal';
import type { Card, Player } from '../types'
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

    let seats = 4;
    let deckNum = 6;
    let currPlayer = -1;
    let seatsReady = false;

    function resetCards() {
        cards = []
        junk = []
    }

    function initSeats(index: number) {
        const newPlayers: Player[] = []
        for (let i = 0; i< seats; i++) {
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

    function generateCards(num: number) {
        resetCards()
        initSeats(0)
        const suits = ['club', 'diamond', 'heart', 'spade'];
        const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

        for (let i = 0; i < num; i++) {
            for (const suit of suits) {
                for (const value of values) {
                    cards.push({ suit, value })
                }
            }
        }

        shuffle(cards)
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
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div>
    Deck Number: 
    <input bind:value={deckNum} type="number"/>
</div>
<button on:click={() => generateCards(deckNum)}>start</button>

<div>Remaining cards: { cards.length }</div>
<div>Junk cards: { junk.length }</div>


<button on:click={() => initRound()}>Deal</button>

{#if seatsReady}
    <div>
        Dealer's Hands

        {#each dealer.hands[0].cards as card}
            <div>{ `${card.suit} ${card.value}` }</div>
        {/each}
    </div>

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

