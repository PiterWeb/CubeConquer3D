export default function setupGui() {

    const btnInit = document.getElementById("btn-init");

    btnInit.addEventListener("click", () => {
        
        const initGui = document.getElementById("init-gui");

        initGui.style.display = "none";

    });

}