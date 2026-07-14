/*
==================================================
 Europal Optimizer Pro
 app.js
 Version 1.0
==================================================
*/


let currentResult = null;






// ======================================
// Optimierung starten
// ======================================


function startOptimization(){



    const job = {



        pallet:{



            length:

            Number(

                document.getElementById(

                    "palletLength"

                ).value

            ),



            width:

            Number(

                document.getElementById(

                    "palletWidth"

                ).value

            ),



            height:

            Number(

                document.getElementById(

                    "palletHeight"

                ).value

            )



        },







        box:{



            length:

            Number(

                document.getElementById(

                    "boxLength"

                ).value

            ),



            width:

            Number(

                document.getElementById(

                    "boxWidth"

                ).value

            ),



            height:

            Number(

                document.getElementById(

                    "boxHeight"

                ).value

            )



        },







        settings:{



            maxHeight:

            Number(

                document.getElementById(

                    "maxHeight"

                ).value

            )



        }



    };









    const result =

        optimize(

            job

        );







    currentResult = result[0];



    currentResult.pallet =

        job.pallet;








    drawVariant(

        "canvas",

        currentResult,

        job.pallet

    );



}









// ======================================
// Draufsicht
// ======================================


function showTop(){



    setView(

        "top"

    );



}









// ======================================
// Lage anzeigen
// ======================================


function showLayer(

    layer

){



    setLayer(

        layer

    );



}









// ======================================
// 3D
// ======================================


function show3D(){



    setView(

        "3d"

    );



}









// ======================================
// Start
// ======================================


window.onload = function(){



    const canvas =

        document.getElementById(

            "canvas"

        );



    if(canvas){



        initCanvas();



    }



};
