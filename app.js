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







// ======================================
// Start
// ======================================


function initApp(){



    const maxHeight =
        document.getElementById(
            "maxHeight"
        );



    if(maxHeight){

        maxHeight.value =
            SETTINGS.defaultMaxHeight;

    }




    const button =
        document.getElementById(
            "calculate"
        );



    if(button){


        button.addEventListener(

            "click",

            calculate

        );


    }




    setupViewButtons();



}







// ======================================
// Berechnung
// ======================================


function calculate(){



    const palletSelect =
        document.getElementById(
            "pallet"
        );



    const job = {


        pallet:

            PALLETS[
                palletSelect.value
            ],




        box:{


            length:

                Number(

                    document.getElementById(
                        "length"
                    ).value

                ),



            width:

                Number(

                    document.getElementById(
                        "width"
                    ).value

                ),



            height:

                Number(

                    document.getElementById(
                        "height"
                    ).value

                ),



            weight:

                Number(

                    document.getElementById(
                        "weight"
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








    if(

        !job.pallet ||

        job.box.length<=0 ||

        job.box.width<=0 ||

        job.box.height<=0


    ){


        alert(

            "Bitte gültige Werte eingeben."

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

            "Keine Variante gefunden."

        );


        return;


    }







    currentJob = job;



    currentVariant = variants[0];






    updateDashboard(

        currentVariant

    );






    drawCurrent();






    showVariants(

        variants

    );



}







// ======================================
// Dashboard
// ======================================


function updateDashboard(result){



    setText(

        "layer",

        result.cartonsPerLayer

    );



    setText(

        "layers",

        result.layers

    );



    setText(

        "total",

        result.totalCartons

    );



    setText(

        "utilization",

        result.utilization+" %"

    );



}






function setText(id,value){



    const el =
        document.getElementById(id);



    if(el){

        el.textContent=value;

    }


}








// ======================================
// Zeichnen
// ======================================


function drawCurrent(){



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







// ======================================
// Ansichten
// ======================================


function setupViewButtons(){



    const buttons={



        viewTop:"top",


        viewIso:"iso",


        viewLayer1:"layer1",


        viewLayer2:"layer2"


    };







    Object.keys(buttons)

    .forEach(id=>{



        const btn =
            document.getElementById(id);




        if(!btn){

            return;

        }






        btn.onclick=function(){



            currentView =
                buttons[id];



            drawCurrent();



        };



    });



}







// ======================================
// Varianten
// ======================================


function showVariants(variants){



    const box =
        document.getElementById(
            "variantList"
        );



    if(!box){

        return;

    }




    box.innerHTML="";





    variants.forEach((v,index)=>{



        const div =
            document.createElement(
                "div"
            );



        div.className =
            "alert alert-light";



        div.innerHTML =



        "<b>"+

        (index+1)+

        ". "+

        v.name+

        "</b><br>"+


        "Kartons/Lage: "+

        v.cartonsPerLayer+

        "<br>"+


        "Gesamt: "+

        v.totalCartons+

        "<br>"+


        "Auslastung: "+

        v.utilization+

        "%";




        div.onclick=function(){



            currentVariant=v;


            drawCurrent();



        };




        box.appendChild(div);



    });



}
