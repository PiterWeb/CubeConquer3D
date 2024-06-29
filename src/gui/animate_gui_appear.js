import { Tween } from "@tweenjs/tween.js";

const animationDuration = 500;

export default function animateGuiAppear() {
    const initGui = document.getElementById("init-gui");

    if (!initGui) throw new Error("Init Gui not found");

    new Tween({ opacity: 0 })
        .to(
            {
                opacity: 1,
            },
            animationDuration
        )
        .onUpdate((object) => {
            initGui.style.opacity = object.opacity.toString();
        }).onStart(() => {
            initGui.style.display = "block";
        })
        .start()

}
