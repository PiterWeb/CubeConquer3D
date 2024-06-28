import { Tween } from "@tweenjs/tween.js";

const animationDuration = 500;

export default function animateGuiAppear() {
    const initGui = document.getElementById("init-gui");

    new Tween({ opacity: 0 })
        .to(
            {
                opacity: 1,
            },
            animationDuration
        )
        .onUpdate((object) => {
            initGui.style.opacity = object.opacity;
        }).onStart(() => {
            initGui.style.display = "block";
        })
        .start()

}
