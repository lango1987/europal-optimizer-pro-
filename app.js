/*
==================================================
 Europal Optimizer Pro
 app.js
==================================================
*/


let currentResult = null;



// ======================================
// Optimierung starten
// ======================================


function startOptimization(){


    const job = {


        pallet:{


            length:Number(
                document.getElementById("palletLength").value
            ),


            width:Number(
                document.getElementById("palletWidth").value
            ),


            height:Number(
                document.getElementById("palletHeight").value
            )


        },



        box:{


            length:Number(
                document.getElementById("boxLength").value
            ),


            width:Number(
                document.getElementById("boxWidth").value
            ),


            height:Number(
                document.getElementById("boxHeight").value
            )


        },



        settings:{


            maxHeight:Number(
                document.getElementById("maxHeight").value
            )


        }


    };




    currentResult = optimize(job)[0];



    currentResult.pallet = job.pallet;



    drawVariant(

        "canvas",

        currentResult,

        job.pallet

    );


}







// ======================================
// Ansicht Buttons
// ======================================


function showTop(){


    setView("top");


}







function showLayer(layer){


    setLayer(layer);


}







function show3D(){


    setView("3d");


}







// ======================================
// Start
// ======================================


window.addEventListener(

"load",

function(){


    initCanvas();


}

);
