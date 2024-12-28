import Game from "@/game/game";
import { Player } from "@player/player";

/**
 * Attack mode
 * @param {Player} player
 */
export default function attackMode(player) {

    console.log("Attack mode :", player.userData.attack_mode);

    const team = player.userData.team;

    const rivalTeam = team === "red" ? "blue" : "red";

    const playerCoords = player.position;

    const availableRivals = [];

    const rivalPlayers = rivalTeam === "red" ? Game.teamController.RED : Game.teamController.BLUE;

    for (let rivalPlayer of rivalPlayers) {
        const rivalCoords = rivalPlayer.position;

        const distance = playerCoords.distanceTo(rivalCoords);

        if (distance <= 1.5) {
            availableRivals.push(rivalPlayer);
        }
    }

    availableRivals.forEach((rivalPlayer) => {
        
        


    });

}