/*
==================================================
 Europal Optimizer Pro
 App
 Version 0.1.0
==================================================
*/

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

    document
        .getElementById("maxHeight")
        .value = SETTINGS.defaultMaxHeight;

    document
        .getElementById("calculate")
        .addEventListener("click", calculate);

}

function calculate() {

    const palletKey = document.getElementById("pallet").value;

    const job = {

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

    // Eingaben prüfen
    if (
        job.box.length <= 0 ||
        job.box.width <= 0 ||
        job.box.height <= 0
    ) {

        alert("Bitte gültige Kartonmaße eingeben.");
        return;

    }

    // Optimierung starten
    const variants = optimize(job);

    if (variants.length === 0) {

        alert("Keine Variante gefunden.");
        return;

    }

    const best = variants[0];

    // Dashboard
    document.getElementById("layer").textContent =
        best.cartonsPerLayer;

    document.getElementById("layers").textContent =
        best.layers;

    document.getElementById("total").textContent =
        best.totalCartons;

    document.getElementById("utilization").textContent =
        best.utilization + " %";

    // Zeichnen
    drawVariant(
        "canvas",
        best,
        job.pallet
    );

    console.log(best);

}
