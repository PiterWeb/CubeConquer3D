import { Tween } from "@tweenjs/tween.js";

const animationDuration = 500;

export default function animateGuiVanish() {
    const initGui = document.getElementById("init-gui");

    new Tween({ opacity: 1 })
        .to(
            {
                opacity: 0,
            },
            animationDuration
        )
        .onUpdate((object) => {
            initGui.style.opacity = object.opacity;
        })
        .start()
        .onComplete(() => {
            initGui.style.display = "none";
            initGui.style.opacity = 1;
        });
}
