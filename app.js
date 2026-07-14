/*
==================================================
 Europal Optimizer Pro
 App
 Version 0.3.0
==================================================
*/

document.addEventListener("DOMContentLoaded", initApp);

let currentView = "top";

let currentJob = null;
let currentVariant = null;

function initApp() {

    document.getElementById("maxHeight").value =
        SETTINGS.defaultMaxHeight;

    document
        .getElementById("calculate")
        .addEventListener("click", calculate);

    addViewEvents();

}

function calculate() {

    const palletKey =
        document.getElementById("pallet").value;

    currentJob = {

        pallet: PALLETS[palletKey],

        box: {

            length: Number(document.getElementById("length").value),

            width: Number(document.getElementById("width").value),

            height: Number(document.getElementById("height").value),

            weight: Number(document.getElementById("weight").value)

        },

        settings: {

            maxHeight: Number(document.getElementById("maxHeight").value)

        }

    };

    if (

        currentJob.box.length <= 0 ||
        currentJob.box.width <= 0 ||
        currentJob.box.height <= 0

    ) {

        alert("Bitte gültige Kartonmaße eingeben.");

        return;

    }

    const variants = optimize(currentJob);

    if (!variants.length) {

        alert("Keine Variante gefunden.");

        return;

    }

    currentVariant = variants[0];

    updateDashboard();

    drawCurrentView();

}

function updateDashboard() {

    document.getElementById("layer").textContent =
        currentVariant.cartonsPerLayer;

    document.getElementById("layers").textContent =
        currentVariant.layers;

    document.getElementById("total").textContent =
        currentVariant.totalCartons;

    document.getElementById("utilization").textContent =
        currentVariant.utilization + " %";

}

function drawCurrentView() {

    if (!currentVariant) return;

    drawVariant(

        "canvas",

        currentVariant,

        currentJob.pallet

    );

}

function addViewEvents() {

    const views = {

        viewTop: "top",

        viewIso: "iso",

        viewLayer1: "layer1",

        viewLayer2: "layer2"

    };

    Object.keys(views).forEach(id => {

        const button = document.getElementById(id);

        if (!button) return;

        button.addEventListener("click", () => {

            currentView = views[id];

            document
                .querySelectorAll(".viewButton")
                .forEach(btn => {

                    btn.classList.remove("btn-primary");

                    btn.classList.add("btn-outline-primary");

                });

            button.classList.remove("btn-outline-primary");

            button.classList.add("btn-primary");

            drawCurrentView();

        });

    });

}
