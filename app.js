/*
==================================================
 Europal Optimizer Pro
 App
 Version 1.0
==================================================
*/

let currentView = "top";

let currentJob = null;

let currentVariant = null;


document.addEventListener(
    "DOMContentLoaded",
    initApp
);


function initApp(){

    const maxHeight =
        document.getElementById("maxHeight");


    if(maxHeight){

        maxHeight.value =
            SETTINGS.defaultMaxHeight;

    }


    const calculate =
        document.getElementById("calculate");


    if(calculate){

        calculate.addEventListener(
            "click",
            calculateOptimization
        );

    }


    setupButtons();

}



// =======================================
// Berechnung
// =======================================

function calculateOptimization(){

    const palletSelect =
        document.getElementById("pallet");


    const job = {

        pallet:
            PALLETS[palletSelect.value],


        box: {

            length:
                Number(
                    document.getElementById("length").value
                ),

            width:
                Number(
                    document.getElementById("width").value
                ),

            height:
                Number(
                    document.getElementById("height").value
                ),

            weight:
                Number(
                    document.getElementById("weight").value
                )

        },


        settings: {

            maxHeight:
                Number(
                    document.getElementById("maxHeight").value
                )

        }

    };


    if(

        !job.pallet ||

        job.box.length <=0 ||

        job.box.width <=0 ||

        job.box.height <=0

    ){

        alert(
            "Bitte gültige Kartondaten eingeben."
        );

        return;

    }



    const variants =
        optimize(job);



    if(
        !variants ||
        variants.length===0
    ){

        alert(
            "Keine Optimierung möglich."
        );

        return;

    }


    currentJob = job;

    currentVariant = variants[0];


    updateDashboard(
        currentVariant
    );


    drawCurrentView();

}



// =======================================
// Dashboard
// =======================================

function updateDashboard(result){


    const layer =
        document.getElementById("layer");


    const layers =
        document.getElementById("layers");


    const total =
        document.getElementById("total");


    const util =
        document.getElementById("utilization");



    if(layer)

        layer.textContent =
            result.cartonsPerLayer;



    if(layers)

        layers.textContent =
            result.layers;



    if(total)

        total.textContent =
            result.totalCartons;



    if(util)

        util.textContent =
            result.utilization+" %";


}



// =======================================
// Zeichnen
// =======================================

function drawCurrentView(){

    if(
        !currentVariant ||
        !currentJob
    ){

        return;

    }


    drawVariant(

        "canvas",

        currentVariant,

        currentJob.pallet

    );

}



// =======================================
// Buttons
// =======================================

function setupButtons(){


    const buttons = {

        viewTop:"top",

        viewIso:"iso",

        viewLayer1:"layer1",

        viewLayer2:"layer2"

    };


    Object.keys(buttons)
    .forEach(id=>{


        const button =
            document.getElementById(id);



        if(!button)

            return;



        button.onclick=function(){


            currentView =
                buttons[id];


            drawCurrentView();


        };


    });


}
