import animateGuiVanish from "./animate_gui_vanish";
import Game from "../game/game";

export default function setupGui() {
    const btnInit = document.getElementById("btn-init");

    if (!btnInit) throw new Error("Button not found");

    btnInit.addEventListener("click", () => {
        animateGuiVanish();
        new Game().start();
    });
}
