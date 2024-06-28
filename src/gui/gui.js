import animateGuiVanish from "./animate_gui_vanish";

export default function setupGui() {
    const btnInit = document.getElementById("btn-init");

    btnInit.addEventListener("click", () => {
        animateGuiVanish();
    });
}
