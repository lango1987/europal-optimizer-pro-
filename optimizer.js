/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 6.0
 Randfüllung + Wechsellagen
==================================================
*/


function optimize(job){



    const variant =

        calculateVariant(job);




    return [

        variant

    ];



}







// ======================================
// Variante berechnen
// ======================================


function calculateVariant(job){



    const layers = Math.floor(

        (
            job.settings.maxHeight -
            job.pallet.height

        )
        /
        job.box.height

    );







    const boxes=[];





    for(

        let layer=0;

        layer<layers;

        layer++

    ){



        const rotated =

            layer % 2 === 1;





        const layerBoxes =

            packLayer(

                job.pallet.length,

                job.pallet.width,

                job.box.length,

                job.box.width,

                rotated,

                layer,

                job.box.height

            );





        boxes.push(
            ...layerBoxes
        );



    }






    const firstLayer =

        boxes.filter(

            b=>b.layer===1

        );







    const usedArea =

        firstLayer.reduce(

            (sum,b)=>{

                return sum +

                (
                    b.length *
                    b.width
                );

            },

            0

        );






    const palletArea =

        job.pallet.length *

        job.pallet.width;






    return {


        id:

        "edge_fill",



        name:

        "Randfüllung 90° Wechsellage",



        stability:

        98,



        layers:

        layers,



        cartonsPerLayer:

        firstLayer.length,



        totalCartons:

        boxes.length,



        utilization:

        Number(

            (
                usedArea /
                palletArea *
                100

            )
            .toFixed(1)

        ),



        boxes:

        boxes


    };


}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 2
 Packalgorithmus
==================================================
*/



// ======================================
// Eine Lage packen
// ======================================


function packLayer(

    palletLength,

    palletWidth,

    boxLength,

    boxWidth,

    rotated,

    layer,

    height

){



    const boxes = [];





    let length;

    let width;

    let rotation;





    if(rotated){



        length = boxWidth;

        width = boxLength;

        rotation = 90;



    }

    else{



        length = boxLength;

        width = boxWidth;

        rotation = 0;



    }







    const occupied=[];







    // ==================================
    // Ecke links oben
    // ==================================


    addBoxesFromArea(

        boxes,

        occupied,

        0,

        0,

        palletLength,

        palletWidth,

        length,

        width,

        rotation,

        layer,

        height

    );








    // ==================================
    // Restbereiche prüfen
    // ==================================


    fillRemainingAreas(

        boxes,

        occupied,

        palletLength,

        palletWidth,

        length,

        width,

        rotation,

        layer,

        height

    );






    return boxes;


}









// ======================================
// Kartons in Fläche setzen
// ======================================


function addBoxesFromArea(

    boxes,

    occupied,

    startX,

    startY,

    areaWidth,

    areaHeight,

    boxLength,

    boxWidth,

    rotation,

    layer,

    height

){



    let y = startY;





    while(

        y + boxWidth <=

        startY + areaHeight

    ){



        let x = startX;





        while(

            x + boxLength <=

            startX + areaWidth

        ){





            if(

                !collision(

                    occupied,

                    x,

                    y,

                    boxLength,

                    boxWidth

                )

            ){



                const box={



                    x:x,

                    y:y,

                    z:

                    layer *

                    height,



                    length:

                    boxLength,



                    width:

                    boxWidth,



                    height:

                    height,



                    rotation:

                    rotation,



                    layer:

                    layer+1



                };





                boxes.push(box);



                occupied.push(box);



            }





            x += boxLength;



        }





        y += boxWidth;



    }



}








// ======================================
// Überlappung prüfen
// ======================================


function collision(

    boxes,

    x,

    y,

    w,

    h

){



    return boxes.some(box=>{


        return !(

            x+w <= box.x ||

            x >= box.x+box.length ||

            y+h <= box.y ||

            y >= box.y+box.width

        );



    });



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 3
 Restflächen füllen
==================================================
*/



// ======================================
// Restflächen füllen
// ======================================


function fillRemainingAreas(

    boxes,

    occupied,

    palletLength,

    palletWidth,

    boxLength,

    boxWidth,

    rotation,

    layer,

    height

){



    const step = 10;



    for(

        let y = 0;

        y < palletWidth;

        y += step

    ){



        for(

            let x = 0;

            x < palletLength;

            x += step

        ){





            if(

                x + boxLength >

                palletLength

            ){

                continue;

            }





            if(

                y + boxWidth >

                palletWidth

            ){

                continue;

            }







            if(

                !collision(

                    occupied,

                    x,

                    y,

                    boxLength,

                    boxWidth

                )

            ){



                const box={



                    x:x,



                    y:y,



                    z:

                    layer *

                    height,



                    length:

                    boxLength,



                    width:

                    boxWidth,



                    height:

                    height,



                    rotation:

                    rotation,



                    layer:

                    layer+1



                };





                boxes.push(box);



                occupied.push(box);



            }




        }



    }



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 4
 Bewertung + Stabilität
==================================================
*/



// ======================================
// Schwerpunkt berechnen
// ======================================


function calculateCenterOfGravity(

    boxes

){



    let totalWeight = 0;



    let centerX = 0;

    let centerY = 0;



    boxes.forEach(box=>{



        const area =

            box.length *
            box.width;



        totalWeight += area;





        centerX +=

            (
                box.x +
                box.length / 2

            )
            *
            area;





        centerY +=

            (
                box.y +
                box.width / 2

            )
            *
            area;



    });







    if(totalWeight===0){


        return {


            x:0,

            y:0


        };


    }





    return {


        x:

        centerX /
        totalWeight,



        y:

        centerY /
        totalWeight



    };


}









// ======================================
// Stabilität bewerten
// ======================================


function calculateStability(

    boxes,

    pallet

){



    const center =

        calculateCenterOfGravity(

            boxes

        );





    const palletCenterX =

        pallet.length / 2;



    const palletCenterY =

        pallet.width / 2;






    const distance =

        Math.sqrt(

            Math.pow(

                center.x -
                palletCenterX,

                2

            )

            +

            Math.pow(

                center.y -
                palletCenterY,

                2

            )

        );






    const maxDistance =

        Math.sqrt(

            Math.pow(

                pallet.length/2,

                2

            )

            +

            Math.pow(

                pallet.width/2,

                2

            )

        );







    let score =

        100 -

        (
            distance /
            maxDistance *
            100

        );





    if(score < 0){

        score = 0;

    }



    return Number(

        score.toFixed(1)

    );



}









// ======================================
// Gewicht prüfen
// ======================================


function calculateWeightLoad(

    boxes,

    weight

){



    return (

        boxes.length *
        weight

    );



}









// ======================================
// Variante verbessern
// ======================================


function rateVariant(

    variant,

    job

){



    const stability =

        calculateStability(

            variant.boxes,

            job.pallet

        );






    const weight =

        calculateWeightLoad(

            variant.boxes,

            job.box.weight

        );





    variant.stability =

        stability;





    variant.totalWeight =

        weight;





    return variant;



}
