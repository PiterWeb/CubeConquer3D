export type role = "tank" | "healer" | "dps" | "dead";

export const roleColors = {
    tank: "gray",
    healer: "green",
    dps: "orange",
    dead: "transparent",
} as const;

export const roleStats = {
    tank: {
        health: 500,
        shield: 200,
        damage: 50,
    },
    healer: {
        health: 300,
        shield: 100,
        damage: 50,
    },
    dps: {
        health: 200,
        shield: 0,
        damage: 100,
    },
    dead: {
        health: 0,
        shield: 0,
        damage: 0
    }
} as const;
