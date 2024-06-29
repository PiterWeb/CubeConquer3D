import { Tween } from "@tweenjs/tween.js";

const animationDuration = 500;

export default function animateGuiVanish() {
    const initGui = document.getElementById("init-gui");

    if (!initGui) throw new Error("Init Gui not found");

    new Tween({ opacity: 1 })
        .to(
            {
                opacity: 0,
            },
            animationDuration
        )
        .onUpdate((object) => {
            initGui.style.opacity = object.opacity.toString();
        })
        .start()
        .onComplete(() => {
            initGui.style.display = "none";
            initGui.style.opacity = "1";
        });
}
