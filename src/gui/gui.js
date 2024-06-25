import { Tween } from "@tweenjs/tween.js";

export default function setupGui() {
    const btnInit = document.getElementById("btn-init");

    btnInit.addEventListener("click", () => {
        const initGui = document.getElementById("init-gui");

        new Tween({ opacity: 1 })
            .to(
                {
                    opacity: 0,
                },
                500
            )
            .onUpdate((object) => {
                initGui.style.opacity = object.opacity;
            })
            .start()
            .onComplete(() => {
                initGui.style.display = "none";
                initGui.style.opacity = 1;
            });
    });
}
