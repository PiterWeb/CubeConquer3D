type role = "tank" | "healer" | "dps";

export const roleColors = {
    tank: "gray",
    healer: "green",
    dps: "orange",
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
} as const;

export default role;
