import './canvas.css'

export function setupCanvas() {
    const canvas = document.querySelector("canvas");
    canvas.style.filter = "blur(1px)";
    canvas.style.clipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)"
    canvas.style.animation = "canvas-appear 1s ease-in-out";
}