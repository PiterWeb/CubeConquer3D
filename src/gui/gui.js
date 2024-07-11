import animateGuiVanish from "./animate_gui_vanish";
import Game from "../game/game";
import { Player } from "../entities/player/player";

export default function setupGui() {
    const btnInit = document.getElementById("btn-init");

    if (!btnInit) throw new Error("Button not found");

    btnInit.addEventListener("click", () => {
        animateGuiVanish();
        Game.start();
    });
}

/**
 * Refreshes the unit GUI
 * @param {Player[]} redTeam - The red team
 * @param {Player[]} blueTeam - The blue team
 */
function refreshUnitGui(redTeam, blueTeam) {
    const red_units = document.getElementById("red_units");
    const blue_units = document.getElementById("blue_units");

    if (!red_units || !blue_units) throw new Error("Units not found");

    red_units.innerHTML = getTableUnits(redTeam);
    blue_units.innerHTML = getTableUnits(blueTeam);
}

/** @param {Player[]} units */
function getTableUnits(units) {

    return `
        <strong>Units:</strong>
        <ul>
        ${units
            .map(
                (unit) =>
                    `<li>${unit.userData.role}: ${unit.userData.current_health}</li>`
            )
            .join("")}
        </ul>
    `;
}

export function refreshGameGui() {
    if (!Game.isStarted) return;

    const redTeam = Game.teamController.RED;
    const blueTeam = Game.teamController.BLUE;

    refreshUnitGui(redTeam, blueTeam);
}
