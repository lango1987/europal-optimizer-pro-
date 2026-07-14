/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 10.0
 Best Layer Packing
==================================================
*/


function optimize(job){


    const variant =
        createBestVariant(job);



    return [

        variant

    ];



}








// ======================================
// Beste Variante erstellen
// ======================================


function createBestVariant(job){



    const variant = {


        id:

        "best_layer",



        name:

        "Optimale Wechsellagen",



        boxes:[],



        layers:0,



        cartonsPerLayer:0,



        totalCartons:0,



        utilization:0,



        stability:0



    };








    const layers =

        Math.floor(

            (

                job.settings.maxHeight -

                job.pallet.height

            )

            /

            job.box.height

        );







    variant.layers = layers;








    for(

        let layer = 0;

        layer < layers;

        layer++

    ){



        const preferredRotation =

            layer % 2 === 1

            ? 90

            : 0;







        const layerBoxes =

            packBestLayer(

                job,

                preferredRotation,

                layer

            );







        variant.boxes.push(

            ...layerBoxes

        );



    }







    variant.totalCartons =

        variant.boxes.length;






    variant.cartonsPerLayer =

        variant.boxes.filter(

            b=>b.layer===1

        ).length;







    return variant;



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 2
 Beste Lage berechnen
==================================================
*/



// ======================================
// Beste Packung für eine Lage finden
// ======================================


function packBestLayer(

    job,

    preferredRotation,

    layer

){



    const normal =

        packLayerDirection(

            job,

            job.box.length,

            job.box.width,

            0,

            layer

        );







    const rotated =

        packLayerDirection(

            job,

            job.box.width,

            job.box.length,

            90,

            layer

        );








    let best;






    if(

        rotated.length >

        normal.length

    ){



        best = rotated;



    }

    else if(

        normal.length >

        rotated.length

    ){



        best = normal;



    }

    else{



        // gleiche Anzahl:
        // bevorzugte Richtung nehmen



        if(preferredRotation===90){


            best = rotated;


        }

        else{


            best = normal;


        }



    }







    return best;



}









// ======================================
// Eine Richtung packen
// ======================================


function packLayerDirection(

    job,

    boxLength,

    boxWidth,

    rotation,

    layer

){



    const boxes=[];



    const freeAreas=[];






    freeAreas.push({


        x:0,


        y:0,


        width:

        job.pallet.length,


        height:

        job.pallet.width



    });








    while(

        freeAreas.length > 0

    ){



        const area =

            freeAreas.shift();







        if(

            area.width < boxLength

            ||

            area.height < boxWidth

        ){



            continue;

        }








        const box = {



            x:

            area.x,



            y:

            area.y,



            z:

            layer *

            job.box.height,



            length:

            boxLength,



            width:

            boxWidth,



            height:

            job.box.height,



            rotation:

            rotation,



            layer:

            layer + 1



        };






        boxes.push(box);







        splitFreeArea(

            freeAreas,

            area,

            boxLength,

            boxWidth

        );



    }








    return boxes;



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 3
 Freiflächen Verwaltung
==================================================
*/



// ======================================
// Freifläche aufteilen
// ======================================


function splitFreeArea(

    freeAreas,

    area,

    boxLength,

    boxWidth

){



    const rightArea = {



        x:

        area.x +

        boxLength,



        y:

        area.y,



        width:

        area.width -

        boxLength,



        height:

        boxWidth



    };







    const bottomArea = {



        x:

        area.x,



        y:

        area.y +

        boxWidth,



        width:

        area.width,



        height:

        area.height -

        boxWidth



    };







    if(

        rightArea.width > 0

        &&

        rightArea.height > 0

    ){



        freeAreas.push(

            rightArea

        );



    }








    if(

        bottomArea.width > 0

        &&

        bottomArea.height > 0

    ){



        freeAreas.push(

            bottomArea

        );



    }






    removeSmallAreas(

        freeAreas

    );



}









// ======================================
// Kleine Flächen entfernen
// ======================================


function removeSmallAreas(

    freeAreas

){



    for(

        let i = freeAreas.length - 1;

        i >= 0;

        i--

    ){



        if(

            freeAreas[i].width < 1

            ||

            freeAreas[i].height < 1

        ){



            freeAreas.splice(

                i,

                1

            );



        }



    }



}









// ======================================
// Freiflächen sortieren
// ======================================


function sortFreeAreas(

    freeAreas

){



    freeAreas.sort((a,b)=>{



        return (

            b.width *

            b.height

        )

        -

        (

            a.width *

            a.height

        );



    });



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 4
 Beste Position finden
==================================================
*/



// ======================================
// Optimierte Lage packen
// ======================================


function packSmartLayer(

    job,

    layer

){



    const boxes = [];



    const freeAreas = [];





    freeAreas.push({


        x:0,


        y:0,


        width:

        job.pallet.length,


        height:

        job.pallet.width



    });








    while(

        freeAreas.length > 0

    ){



        sortFreeAreas(

            freeAreas

        );





        const area =

            freeAreas.shift();






        const placement =

            findBestPlacement(

                area,

                job.box.length,

                job.box.width

            );







        if(!placement){



            continue;

        }








        const box = {



            x:

            area.x,



            y:

            area.y,



            z:

            layer *

            job.box.height,



            length:

            placement.length,



            width:

            placement.width,



            height:

            job.box.height,



            rotation:

            placement.rotation,



            layer:

            layer + 1



        };







        boxes.push(box);







        splitFreeArea(

            freeAreas,

            area,

            placement.length,

            placement.width

        );



    }







    return boxes;



}









// ======================================
// Beste Kartonrichtung finden
// ======================================


function findBestPlacement(

    area,

    boxLength,

    boxWidth

){



    const options = [];






    // normale Richtung


    if(

        boxLength <= area.width

        &&

        boxWidth <= area.height

    ){



        options.push({


            length:

            boxLength,


            width:

            boxWidth,


            rotation:0


        });



    }








    // gedrehte Richtung


    if(

        boxWidth <= area.width

        &&

        boxLength <= area.height

    ){



        options.push({


            length:

            boxWidth,


            width:

            boxLength,


            rotation:90


        });



    }







    if(

        options.length === 0

    ){



        return null;



    }







    // größte Flächennutzung wählen


    options.sort((a,b)=>{



        const restA =

        (

            area.width *
            area.height

        )

        -

        (

            a.length *
            a.width

        );





        const restB =

        (

            area.width *
            area.height

        )

        -

        (

            b.length *
            b.width

        );





        return restA - restB;



    });






    return options[0];



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 5
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

            b => b.layer === 1

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

        calculateLayerStability(

            variant.boxes,

            job.pallet

        );








    variant.totalCartons =

        variant.boxes.length;







    variant.score =



        (

            variant.utilization *

            0.55

        )



        +



        (

            variant.stability *

            0.35

        )



        +



        (

            Math.min(

                variant.totalCartons,

                200

            )

            *

            0.10

        );





}









// ======================================
// Stabilität
// ======================================


function calculateLayerStability(

    boxes,

    pallet

){



    let x = 0;

    let y = 0;

    let count = 0;







    boxes.forEach(box=>{



        x +=

        box.x +

        box.length / 2;




        y +=

        box.y +

        box.width / 2;




        count++;



    });








    if(count===0){



        return 0;



    }








    x /= count;

    y /= count;








    const centerX =

        pallet.length / 2;



    const centerY =

        pallet.width / 2;








    const distance = Math.sqrt(



        Math.pow(

            x-centerX,

            2

        )



        +



        Math.pow(

            y-centerY,

            2

        )



    );








    const maxDistance = Math.sqrt(



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








    return Math.max(

        0,

        Number(

            (

                100 -

                (

                    distance /

                    maxDistance *

                    100

                )

            )

            .toFixed(1)

        )

    );



}









// ======================================
// Beste Variante suchen
// ======================================


function chooseBestVariant(

    variants

){



    variants.sort((a,b)=>{



        return b.score-a.score;



    });






    return variants[0];



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 6
 Hilfsfunktionen
==================================================
*/



// ======================================
// Kartons prüfen
// ======================================


function validateBoxes(

    boxes,

    pallet

){



    return boxes.filter(box=>{



        return (

            box.x >= 0

            &&

            box.y >= 0

            &&

            box.x + box.length <= pallet.length

            &&

            box.y + box.width <= pallet.width


        );



    });



}








// ======================================
// Variante bereinigen
// ======================================


function cleanVariant(

    variant,

    pallet

){



    variant.boxes =

        validateBoxes(

            variant.boxes,

            pallet

        );





    variant.totalCartons =

        variant.boxes.length;






    return variant;



}









// ======================================
// Statistik
// ======================================


function getStatistics(

    variant

){



    const layers = {};





    variant.boxes.forEach(box=>{



        if(!layers[box.layer]){


            layers[box.layer] = 0;


        }



        layers[box.layer]++;



    });








    return {


        total:

        variant.boxes.length,



        layers:

        layers



    };



}








// ======================================
// Debug
// ======================================


function debugOptimizer(

    variant

){



    console.log(

        "=========================="

    );



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



    console.log(

        getStatistics(

            variant

        )

    );



    console.log(

        "=========================="

    );



}





console.log(
    "Optimizer Version 10.0 geladen"
);
