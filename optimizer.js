/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Version 16.0
 Wechsel-Lagen Optimierung
==================================================
*/



function optimize(job){


    const result = {


        name:
        "Optimierte Wechsel-Lagen",


        boxes:[],


        layers:0,


        totalCartons:0


    };






    const maxLayers = Math.floor(



        (

            job.settings.maxHeight -

            job.pallet.height

        )

        /

        job.box.height



    );





    result.layers = maxLayers;








    for(

        let layer = 1;

        layer <= maxLayers;

        layer++

    ){



        let layerBoxes;







        // ungerade Lage = Muster A

        if(

            layer % 2 === 1

        ){



            layerBoxes =

                createLayerA(

                    job,

                    layer

                );



        }







        // gerade Lage = Muster B

        else{



            layerBoxes =

                createLayerB(

                    job,

                    layer

                );



        }







        result.boxes.push(

            ...layerBoxes

        );



    }







    result.totalCartons =

        result.boxes.length;







    return [

        result

    ];



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 2
 Muster A / Muster B
==================================================
*/



// ======================================
// Muster A
// Ungerade Lagen
// ======================================


function createLayerA(

    job,

    layer

){



    return packLayerPattern(

        job,

        layer,

        {

            rotate:false,

            reverse:false,

            offsetX:0,

            offsetY:0

        }

    );

}









// ======================================
// Muster B
// Gerade Lagen
// ======================================


function createLayerB(

    job,

    layer

){



    return packLayerPattern(

        job,

        layer,

        {

            rotate:true,

            reverse:true,

            offsetX:

            job.box.width / 2,

            offsetY:

            job.box.length / 2

        }

    );

}









// ======================================
// Allgemeiner Layer-Packer
// ======================================


function packLayerPattern(

    job,

    layer,

    pattern

){



    const boxes = [];



    const freeAreas = [];








    freeAreas.push({



        x:

        pattern.offsetX,



        y:

        pattern.offsetY,



        width:

        job.pallet.length,



        height:

        job.pallet.width



    });








    while(

        freeAreas.length > 0

    ){



        sortAreas(

            freeAreas

        );





        const area =

            freeAreas.shift();







        const placement =

            findBestBox(

                area,

                job.box,

                pattern

            );







        if(

            !placement

        ){



            continue;

        }







        boxes.push({



            x:

            area.x,



            y:

            area.y,



            z:

            (

                layer - 1

            )

            *

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

            layer



        });







        splitArea(

            freeAreas,

            area,

            placement.length,

            placement.width

        );



    }







    return boxes;



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 3
 Karton Platzierung
==================================================
*/



// ======================================
// Beste Kartonposition suchen
// ======================================


function findBestBox(

    area,

    box,

    pattern

){



    const options = [];







    // ==================================
    // normale Richtung
    // ==================================


    if(



        box.length <= area.width

        &&

        box.width <= area.height



    ){



        options.push({



            length:

            box.length,



            width:

            box.width,



            rotation:

            0



        });



    }








    // ==================================
    // gedrehte Richtung
    // ==================================


    if(



        box.width <= area.width

        &&

        box.length <= area.height



    ){



        options.push({



            length:

            box.width,



            width:

            box.length,



            rotation:

            90



        });



    }








    if(

        options.length === 0

    ){



        return null;



    }








    // ==================================
    // Muster B bevorzugt Drehung
    // ==================================


    if(

        pattern.rotate

    ){



        options.sort((a,b)=>{



            return (

                b.rotation -

                a.rotation

            );



        });



    }









    // ==================================
    // Restfläche bewerten
    // ==================================


    let best = options[0];



    let bestScore = Infinity;







    options.forEach(option=>{



        const rest =



            (

                area.width *

                area.height

            )

            -

            (

                option.length *

                option.width

            );







        if(

            rest < bestScore

        ){



            bestScore = rest;



            best = option;



        }



    });







    return best;



}









// ======================================
// Freie Flächen sortieren
// ======================================


function sortAreas(

    areas

){



    areas.sort((a,b)=>{



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
 optimizer.js
 Teil 4
 Freiflächen + Abschluss
==================================================
*/



// ======================================
// Freifläche teilen
// ======================================


function splitArea(

    areas,

    area,

    length,

    width

){



    // rechte Fläche


    const right = {



        x:

        area.x +

        length,



        y:

        area.y,



        width:

        area.width -

        length,



        height:

        width



    };








    // untere Fläche


    const bottom = {



        x:

        area.x,



        y:

        area.y +

        width,



        width:

        area.width,



        height:

        area.height -

        width



    };








    if(

        right.width > 0

        &&

        right.height > 0

    ){



        areas.push(

            right

        );



    }








    if(

        bottom.width > 0

        &&

        bottom.height > 0

    ){



        areas.push(

            bottom

        );



    }







    cleanAreas(

        areas

    );



}









// ======================================
// Ungültige Flächen entfernen
// ======================================


function cleanAreas(

    areas

){



    for(

        let i = areas.length-1;

        i >= 0;

        i--

    ){



        const a =

            areas[i];







        if(

            a.width < 5

            ||

            a.height < 5

        ){



            areas.splice(

                i,

                1

            );



        }



    }



}









// ======================================
// Ergebnis prüfen
// ======================================


function validateResult(

    boxes,

    pallet

){



    return boxes.filter(box=>{



        return (



            box.x >= 0

            &&

            box.y >= 0



            &&



            box.x +

            box.length

            <=

            pallet.length



            &&



            box.y +

            box.width

            <=

            pallet.width



        );



    });



}









// ======================================
// Statistik
// ======================================


function getLayerCount(

    boxes

){



    const result = {};







    boxes.forEach(box=>{



        if(

            !result[box.layer]

        ){



            result[box.layer] = 0;



        }







        result[box.layer]++;



    });







    return result;



}









console.log(

    "Optimizer Version 16.0 Wechsel-Lagen geladen"

);
