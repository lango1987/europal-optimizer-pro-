/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Version 15.0
 Layer Independent Optimizer
==================================================
*/



function optimize(job){


    const result = {

        name:
        "Optimierte Palette",


        boxes:[],


        layers:0,


        totalCartons:0,


        utilization:0,


        stability:0

    };




    const layerCount = Math.floor(

        (
            job.settings.maxHeight -
            job.pallet.height

        )

        /

        job.box.height

    );



    result.layers = layerCount;






    let previousLayer = [];






    for(

        let layer = 1;

        layer <= layerCount;

        layer++

    ){



        const layerBoxes =

            optimizeLayer(

                job,

                layer,

                previousLayer

            );





        result.boxes.push(

            ...layerBoxes

        );





        previousLayer = layerBoxes;



    }







    result.totalCartons =

        result.boxes.length;







    calculateResultStats(

        result,

        job

    );







    return [

        result

    ];



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 2
 Layer Optimierung
==================================================
*/



// ======================================
// Eine Lage optimieren
// ======================================


function optimizeLayer(

    job,

    layer,

    previousLayer

){



    const results = [];






    // Muster 1
    // normal links oben


    results.push(

        packLayer(

            job,

            layer,

            previousLayer,

            {

                startX:0,

                startY:0,

                reverse:false,

                rotateBias:0

            }

        )

    );







    // Muster 2
    // andere Reihenfolge


    results.push(

        packLayer(

            job,

            layer,

            previousLayer,

            {

                startX:0,

                startY:0,

                reverse:true,

                rotateBias:90

            }

        )

    );








    // Muster 3
    // andere Verteilung


    results.push(

        packLayer(

            job,

            layer,

            previousLayer,

            {

                startX:1,

                startY:0,

                reverse:false,

                rotateBias:90

            }

        )

    );








    // Muster 4
    // für ungerade Ebenen anders


    if(layer % 2 === 0){


        results.push(

            packLayer(

                job,

                layer,

                previousLayer,

                {

                    startX:0,

                    startY:1,

                    reverse:true,

                    rotateBias:0

                }

            )

        );


    }









    results.sort((a,b)=>{



        return (

            scoreLayer(

                b,

                job,

                previousLayer

            )

            -

            scoreLayer(

                a,

                job,

                previousLayer

            )

        );



    });








    return results[0];



}









// ======================================
// Eine Lage packen
// ======================================


function packLayer(

    job,

    layer,

    previousLayer,

    mode

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

        freeAreas.length

    ){



        sortFreeAreas(

            freeAreas

        );





        const area =

            freeAreas.shift();







        const placement =

            findBoxPlacement(

                area,

                job.box,

                mode

            );







        if(!placement){



            continue;

        }








        boxes.push({



            x:

            area.x,



            y:

            area.y,



            z:

            (layer-1)

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
// Beste Kartonposition finden
// ======================================


function findBoxPlacement(

    area,

    box,

    mode

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
    // 90 Grad gedreht
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
    // unterschiedliche Ebenenmuster
    // ==================================


    if(

        mode.rotateBias === 90

    ){



        options.sort((a,b)=>{



            return b.rotation-a.rotation;



        });



    }








    if(

        mode.rotateBias === 0

    ){



        options.sort((a,b)=>{



            return a.rotation-b.rotation;



        });



    }









    // ==================================
    // beste Flächennutzung
    // ==================================


    let best = options[0];



    let bestRest = Infinity;







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








        if(rest < bestRest){



            bestRest = rest;



            best = option;



        }



    });







    return best;



}









// ======================================
// Freiflächen sortieren
// ======================================


function sortFreeAreas(

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
 Freiflächen Verwaltung
==================================================
*/



// ======================================
// Fläche nach Karton teilen
// ======================================


function splitArea(

    freeAreas,

    area,

    length,

    width

){



    // Rechte Restfläche


    const right = {



        x:

        area.x + length,



        y:

        area.y,



        width:

        area.width - length,



        height:

        width



    };








    // Untere Restfläche


    const bottom = {



        x:

        area.x,



        y:

        area.y + width,



        width:

        area.width,



        height:

        area.height - width



    };








    if(

        right.width > 0

        &&

        right.height > 0

    ){



        freeAreas.push(

            right

        );



    }








    if(

        bottom.width > 0

        &&

        bottom.height > 0

    ){



        freeAreas.push(

            bottom

        );



    }








    removeBadAreas(

        freeAreas

    );



}









// ======================================
// Kleine Flächen entfernen
// ======================================


function removeBadAreas(

    areas

){



    for(

        let i = areas.length-1;

        i >= 0;

        i--

    ){



        const area =

        areas[i];







        if(



            area.width < 5

            ||

            area.height < 5



        ){



            areas.splice(

                i,

                1

            );



        }



    }



}









// ======================================
// Freie Flächen optimieren
// ======================================


function cleanFreeAreas(

    areas

){



    for(

        let i = 0;

        i < areas.length;

        i++

    ){



        for(

            let j = i+1;

            j < areas.length;

        j++

        ){



            const a =

            areas[i];



            const b =

            areas[j];







            // wenn eine Fläche komplett
            // in einer anderen liegt


            if(



                a.x <= b.x

                &&

                a.y <= b.y

                &&

                a.x+a.width >= b.x+b.width

                &&

                a.y+a.height >= b.y+b.height



            ){



                areas.splice(

                    j,

                    1

                );



                j--;



            }



        }



    }



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 5
 Bewertung
==================================================
*/



// ======================================
// Lage bewerten
// ======================================


function scoreLayer(

    boxes,

    job,

    previousLayer

){



    if(

        boxes.length === 0

    ){

        return 0;

    }







    let area = 0;







    boxes.forEach(box=>{



        area +=

        box.length *

        box.width;



    });







    const palletArea =

        job.pallet.length *

        job.pallet.width;







    const utilization =



        (

            area /

            palletArea

        )

        *

        100;







    const edge =

        calculateEdgeScore(

            boxes,

            job.pallet

        );







    const layerDifference =

        calculateLayerDifference(

            boxes,

            previousLayer

        );








    return (



        utilization *

        0.65



        +



        edge *

        0.15



        +



        boxes.length *

        0.15



        +



        layerDifference *

        0.05



    );



}









// ======================================
// Randnutzung
// ======================================


function calculateEdgeScore(

    boxes,

    pallet

){



    let score = 0;







    boxes.forEach(box=>{



        if(box.x === 0){


            score++;


        }



        if(box.y === 0){


            score++;


        }



        if(

            box.x +

            box.length

            ===

            pallet.length

        ){


            score++;


        }



        if(

            box.y +

            box.width

            ===

            pallet.width

        ){


            score++;


        }



    });







    return Math.min(

        score,

        100

    );



}









// ======================================
// Unterschied zur vorherigen Lage
// ======================================


function calculateLayerDifference(

    current,

    previous

){



    if(

        !previous

        ||

        previous.length === 0

    ){



        return 100;



    }







    let same = 0;







    current.forEach(a=>{



        previous.forEach(b=>{



            if(



                a.x === b.x

                &&

                a.y === b.y

                &&

                a.length === b.length

                &&

                a.width === b.width



            ){



                same++;



            }



        });



    });







    const max =

        Math.max(

            current.length,

            previous.length

        );








    return Math.max(



        0,



        100 -

        (

            same /

            max *

            100

        )



    );



}









// ======================================
// Gesamtauslastung
// ======================================


function calculateResultStats(

    result,

    job

){



    let area = 0;







    result.boxes.forEach(box=>{



        area +=

        box.length *

        box.width;



    });







    const maxArea =



        job.pallet.length *

        job.pallet.width *

        result.layers;








    result.utilization =



        Number(

            (

                area /

                maxArea *

                100

            )

            .toFixed(1)

        );



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 6
 Abschluss
==================================================
*/



// ======================================
// Schwerpunkt
// ======================================


function calculateCenterOfGravity(

    boxes

){



    let total = 0;

    let x = 0;

    let y = 0;







    boxes.forEach(box=>{



        const weight =

            box.length *

            box.width;







        total += weight;







        x +=

        (

            box.x +

            box.length / 2

        )

        *

        weight;







        y +=

        (

            box.y +

            box.width / 2

        )

        *

        weight;



    });








    if(total === 0){



        return {

            x:0,

            y:0

        };



    }







    return {



        x:

        x / total,



        y:

        y / total



    };



}









// ======================================
// Stabilität
// ======================================


function calculateStability(

    boxes,

    pallet

){



    const center =

        calculateCenterOfGravity(

            boxes

        );







    const target = {



        x:

        pallet.length / 2,



        y:

        pallet.width / 2



    };







    const distance = Math.sqrt(



        Math.pow(

            center.x -

            target.x,

            2

        )



        +



        Math.pow(

            center.y -

            target.y,

            2

        )



    );







    const max = Math.sqrt(



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



        Math.max(

            0,

            100 -

            (

                distance /

                max *

                100

            )

        )



        .toFixed(1)



    );



}









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
// Debug
// ======================================


function debugOptimizer(

    result

){



    console.log(

        "=========================="

    );



    console.log(

        "Optimierer Ergebnis"

    );



    console.log(

        "Kartons:",

        result.totalCartons

    );



    console.log(

        "Lagen:",

        result.layers

    );



    console.log(

        "Auslastung:",

        result.utilization,

        "%"

    );



    console.log(

        "Stabilität:",

        result.stability

    );



    console.log(

        result.boxes.map(

            b=>({

                layer:b.layer,

                rotation:b.rotation,

                x:b.x,

                y:b.y

            })

        )

    );



    console.log(

        "=========================="

    );



}







console.log(

    "Optimizer Version 15.0 geladen"

);
