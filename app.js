/*
==================================================
 Europal Optimizer Pro
 App
 Version 0.2.0
==================================================
*/

document.addEventListener("DOMContentLoaded", initApp);

// Aktuelle Ansicht
let currentView = "top";

// Aktuelle Daten merken
let currentJob = null;
let currentVariant = null;

function initApp() {

    document
        .getElementById("maxHeight")
        .value = SETTINGS.defaultMaxHeight;

    document
        .getElementById("calculate")
        .addEventListener("click", calculate);

    // Ansichten umschalten
    addViewEvents();

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

    if (

        job.box.length <= 0 ||
        job.box.width <= 0 ||
        job.box.height <= 0

    ) {

        alert("Bitte gültige Kartonmaße eingeben.");
        return;

    }

    const variants = optimize(job);

    if (variants.length === 0) {

        alert("Keine Variante gefunden.");
        return;

    }

    const best = variants[0];

    currentJob = job;
    currentVariant = best;

    updateDashboard(best);

    drawCurrentView();

}

function updateDashboard(best){

    document.getElementById("layer").textContent =
        best.cartonsPerLayer;

    document.getElementById("layers").textContent =
        best.layers;

    document.getElementById("total").textContent =
        best.totalCartons;

    document.getElementById("utilization").textContent =
        best.utilization + " %";

}

function drawCurrentView(){

    if(!currentVariant) return;

    switch(currentView){

        case "top":

            drawVariant(
                "canvas",
                currentVariant,
                currentJob.pallet
            );

            break;

        case "layer1":

            drawVariant(
                "canvas",
                currentVariant,
                currentJob.pallet
            );

            break;

        case "layer2":

            drawVariant(
                "canvas",
                currentVariant,
                currentJob.pallet
            );

            break;

        case "iso":

            if(typeof drawIsometric === "function"){

                drawIsometric(
                    "canvas",
                    currentVariant,
                    currentJob.pallet
                );

            }else{

                drawVariant(
                    "canvas",
                    currentVariant,
                    currentJob.pallet
                );

            }

            break;

    }

}

function addViewEvents(){

    const top = document.getElementById("viewTop");
    const iso = document.getElementById("viewIso");
    const layer1 = document.getElementById("viewLayer1");
    const layer2 = document.getElementById("viewLayer2");

    if(top){

        top.onclick = ()=>{

            currentView="top";

            drawCurrentView();

        };

    }

    if(iso){

        iso.onclick = ()=>{

            currentView="iso";

            drawCurrentView();

        };

    }

    if(layer1){

        layer1.onclick = ()=>{

            currentView="layer1";

            drawCurrentView();

        };

    }

    if(layer2){

        layer2.onclick = ()=>{

            currentView="layer2";

            drawCurrentView();

        };

    }

}
