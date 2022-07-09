export type Card = {
    suit: string
    value: string
}

export type Hand = {
    cards: Card[]
}

export interface Player {
    id: string | null
    name: string
    hands: Hand[]
}