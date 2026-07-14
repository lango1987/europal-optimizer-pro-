/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 8.0
 Multi Varianten
==================================================
*/


function optimize(job){



    const variants = [];





    variants.push(

        createNormalVariant(job)

    );





    variants.push(

        createCrossVariant(job)

    );





    variants.push(

        createRotatedVariant(job)

    );







    variants.forEach(v=>{


        evaluateVariant(

            v,

            job

        );


    });







    variants.sort((a,b)=>{


        return (

            b.score -

            a.score

        );


    });







    return variants;



}









// ======================================
// Grundstruktur Variante
// ======================================


function createVariant(

    name

){



    return {



        id:name,



        name:name,



        boxes:[],


        layers:0,


        cartonsPerLayer:0,


        totalCartons:0,


        utilization:0,


        stability:0,


        score:0



    };



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 2
 Normale Variante
==================================================
*/



// ======================================
// Normale Stapelung
// ======================================


function createNormalVariant(job){



    const variant =

        createVariant(

            "normal"

        );





    const layers =

        calculateLayers(job);





    variant.layers = layers;






    for(

        let layer = 0;

        layer < layers;

        layer++

    ){



        const boxes =

            packSingleLayer(

                job.pallet.length,

                job.pallet.width,

                job.box.length,

                job.box.width,

                0,

                layer,

                job.box.height

            );





        variant.boxes.push(

            ...boxes

        );



    }







    finishVariant(

        variant,

        job

    );







    return variant;



}









// ======================================
// Anzahl Lagen
// ======================================


function calculateLayers(job){



    return Math.floor(

        (
            job.settings.maxHeight -
            job.pallet.height

        )

        /

        job.box.height

    );



}









// ======================================
// Eine Ebene packen
// ======================================


function packSingleLayer(

    palletLength,

    palletWidth,

    boxLength,

    boxWidth,

    rotation,

    layer,

    boxHeight

){



    const boxes=[];





    const cols = Math.floor(

        palletLength /

        boxLength

    );





    const rows = Math.floor(

        palletWidth /

        boxWidth

    );







    for(

        let y=0;

        y<rows;

        y++

    ){



        for(

            let x=0;

            x<cols;

            x++

        ){



            boxes.push({



                x:

                x *

                boxLength,



                y:

                y *

                boxWidth,



                z:

                layer *

                boxHeight,



                length:

                boxLength,



                width:

                boxWidth,



                height:

                boxHeight,



                rotation:

                rotation,



                layer:

                layer+1



            });



        }



    }






    return boxes;



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 3
 90 Grad Kreuzverband
==================================================
*/



// ======================================
// Kreuzverband Variante
// ======================================


function createCrossVariant(job){



    const variant =

        createVariant(

            "cross90"

        );







    const layers =

        calculateLayers(job);





    variant.layers = layers;







    for(

        let layer = 0;

        layer < layers;

        layer++

    ){



        const rotated =

            layer % 2 === 1;







        let length;

        let width;

        let rotation;







        if(rotated){



            length =

                job.box.width;



            width =

                job.box.length;



            rotation = 90;



        }

        else{



            length =

                job.box.length;



            width =

                job.box.width;



            rotation = 0;



        }








        const boxes =

            packSingleLayer(

                job.pallet.length,

                job.pallet.width,

                length,

                width,

                rotation,

                layer,

                job.box.height

            );







        variant.boxes.push(

            ...boxes

        );



    }








    finishVariant(

        variant,

        job

    );






    return variant;



}








// ======================================
// Gedrehte Variante
// ======================================


function createRotatedVariant(job){



    const variant =

        createVariant(

            "rotated"

        );





    const layers =

        calculateLayers(job);





    variant.layers = layers;







    for(

        let layer = 0;

        layer < layers;

        layer++

    ){





        const boxes =

            packSingleLayer(

                job.pallet.length,

                job.pallet.width,

                job.box.width,

                job.box.length,

                90,

                layer,

                job.box.height

            );







        variant.boxes.push(

            ...boxes

        );



    }






    finishVariant(

        variant,

        job

    );







    return variant;



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 4
 Bewertung
==================================================
*/



// ======================================
// Variante bewerten
// ======================================


function evaluateVariant(

    variant,

    job

){



    const firstLayer =

        variant.boxes.filter(

            box =>

            box.layer === 1

        );







    const usedArea =

        firstLayer.reduce(

            (sum,box)=>{


                return sum +

                (
                    box.length *

                    box.width

                );


            },

            0

        );








    const palletArea =

        job.pallet.length *

        job.pallet.width;








    variant.utilization =

        Number(

            (

                usedArea /

                palletArea *

                100

            )

            .toFixed(1)

        );








    variant.stability =

        calculateStability(

            variant.boxes,

            job.pallet

        );









    variant.totalCartons =

        variant.boxes.length;







    // ==================================
    // Gesamtbewertung
    // ==================================


    variant.score =


        (

            variant.utilization *

            0.5

        )

        +

        (

            variant.stability *

            0.4

        )

        +

        (

            Math.min(

                variant.totalCartons,

                100

            )

            *

            0.1

        );







}









// ======================================
// Stabilität
// ======================================


function calculateStability(

    boxes,

    pallet

){



    let centerX = 0;

    let centerY = 0;

    let total = 0;







    boxes.forEach(box=>{



        const weight =

            box.length *

            box.width;





        total += weight;





        centerX +=

            (

                box.x +

                box.length / 2

            )

            *

            weight;





        centerY +=

            (

                box.y +

                box.width / 2

            )

            *

            weight;



    });







    if(total === 0){

        return 0;

    }







    centerX /= total;

    centerY /= total;







    const palletCenterX =

        pallet.length / 2;



    const palletCenterY =

        pallet.width / 2;







    const distance = Math.sqrt(



        Math.pow(

            centerX -

            palletCenterX,

            2

        )



        +



        Math.pow(

            centerY -

            palletCenterY,

            2

        )



    );







    const maxDistance = Math.sqrt(



        Math.pow(

            pallet.length / 2,

            2

        )



        +



        Math.pow(

            pallet.width / 2,

            2

        )



    );







    return Number(

        (

            100 -

            (

                distance /

                maxDistance *

                100

            )

        )

        .toFixed(1)

    );



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 5
 Hilfsfunktionen + Abschluss
==================================================
*/



// ======================================
// Variante abschließen
// ======================================


function finishVariant(

    variant,

    job

){



    variant.boxes =

        variant.boxes.filter(

            box =>

            isInsidePallet(

                box,

                job.pallet

            )

        );





    variant.totalCartons =

        variant.boxes.length;





    if(variant.boxes.length > 0){



        variant.cartonsPerLayer =

            variant.boxes.filter(

                b =>

                b.layer === 1

            )

            .length;



    }






}









// ======================================
// Prüfen ob Karton auf Palette liegt
// ======================================


function isInsidePallet(

    box,

    pallet

){



    if(

        box.x < 0 ||

        box.y < 0

    ){

        return false;

    }







    if(

        box.x + box.length >

        pallet.length

    ){

        return false;

    }







    if(

        box.y + box.width >

        pallet.width

    ){

        return false;

    }






    return true;



}









// ======================================
// Mittelpunkt einer Lage
// ======================================


function getLayerCenter(

    boxes,

    layer

){



    const layerBoxes =

        boxes.filter(

            b =>

            b.layer === layer

        );





    if(layerBoxes.length === 0){



        return {


            x:0,

            y:0


        };



    }







    let x = 0;

    let y = 0;







    layerBoxes.forEach(box=>{



        x +=

        box.x +

        box.length/2;



        y +=

        box.y +

        box.width/2;



    });








    return {



        x:

        x /

        layerBoxes.length,



        y:

        y /

        layerBoxes.length



    };



}









// ======================================
// Debug Ausgabe
// ======================================


function debugVariant(

    variant

){



    console.log(

        "Variante:",

        variant.name

    );



    console.log(

        "Kartons:",

        variant.totalCartons

    );



    console.log(

        "Auslastung:",

        variant.utilization,

        "%"

    );



    console.log(

        "Stabilität:",

        variant.stability

    );



    console.log(

        "Score:",

        variant.score

    );



}
