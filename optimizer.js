/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Version 14.0
 Clean Layer Optimizer
==================================================
*/


function optimize(job){


    const result = createStack(job);


    return [result];

}






// ======================================
// Komplette Palette erzeugen
// ======================================


function createStack(job){



    const stack = {



        id:
        "best_layer_stack",



        name:
        "Optimierte Einzellagen",



        boxes:[],



        layers:0,



        totalCartons:0,



        utilization:0,



        stability:0



    };







    const layerCount =

        Math.floor(

            (

                job.settings.maxHeight -

                job.pallet.height

            )

            /

            job.box.height

        );







    stack.layers = layerCount;







    for(

        let layer = 0;

        layer < layerCount;

        layer++

    ){



        const boxes =

            createLayer(

                job,

                layer

            );







        stack.boxes.push(

            ...boxes

        );



    }







    stack.totalCartons =

        stack.boxes.length;







    finishStack(

        stack,

        job

    );







    return stack;



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 2
 Layer Packing
==================================================
*/



// ======================================
// Eine Lage optimieren
// ======================================


function createLayer(

    job,

    layer

){



    const tries = [];






    // verschiedene Startmuster


    tries.push(

        packLayer(

            job,

            layer,

            0

        )

    );



    tries.push(

        packLayer(

            job,

            layer,

            1

        )

    );



    tries.push(

        packLayer(

            job,

            layer,

            2

        )

    );








    // beste Lage auswählen


    tries.sort((a,b)=>{



        return scoreLayer(

            b,

            job

        )

        -

        scoreLayer(

            a,

            job

        );



    });








    return tries[0];



}









// ======================================
// Eine Packung erzeugen
// ======================================


function packLayer(

    job,

    layer,

    mode

){



    const boxes = [];



    const free = [];







    free.push({



        x:0,

        y:0,



        width:

        job.pallet.length,



        height:

        job.pallet.width



    });








    while(

        free.length > 0

    ){



        sortFreeAreas(

            free

        );





        const area =

            free.shift();








        const placement =

            findPlacement(

                area,

                job.box.length,

                job.box.width,

                mode

            );







        if(

            placement === null

        ){

            continue;

        }








        boxes.push({



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



        });








        splitFreeArea(

            free,

            area,

            placement.length,

            placement.width

        );



    }







    return boxes;



}









// ======================================
// Beste Kartonrichtung
// ======================================


function findPlacement(

    area,

    length,

    width,

    mode

){



    const options = [];








    // normale Richtung


    if(

        length <= area.width

        &&

        width <= area.height

    ){



        options.push({



            length:length,

            width:width,

            rotation:0



        });



    }








    // gedrehte Richtung


    if(

        width <= area.width

        &&

        length <= area.height

    ){



        options.push({



            length:width,

            width:length,

            rotation:90



        });



    }








    if(

        options.length === 0

    ){



        return null;



    }








    // jedes Muster sucht anders


    if(

        mode === 1

    ){



        options.reverse();



    }





    if(

        mode === 2

        &&

        options.length > 1

    ){



        return options[1];



    }








    return options[0];



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 3
 Freiflächen Verwaltung
==================================================
*/



// ======================================
// Freifläche teilen
// ======================================


function splitFreeArea(

    free,

    area,

    boxLength,

    boxWidth

){



    // rechte Restfläche


    const right = {



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







    // untere Restfläche


    const bottom = {



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

        right.width > 0

        &&

        right.height > 0

    ){



        free.push(

            right

        );



    }








    if(

        bottom.width > 0

        &&

        bottom.height > 0

    ){



        free.push(

            bottom

        );



    }








    cleanFreeAreas(

        free

    );



}









// ======================================
// Größte Fläche zuerst
// ======================================


function sortFreeAreas(

    free

){



    free.sort((a,b)=>{



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









// ======================================
// Ungültige Flächen entfernen
// ======================================


function cleanFreeAreas(

    free

){



    for(

        let i = free.length - 1;

        i >= 0;

        i--

    ){



        const area = free[i];







        if(

            area.width <= 0

            ||

            area.height <= 0

        ){



            free.splice(

                i,

                1

            );



        }



    }



}









// ======================================
// Überlappung prüfen
// ======================================


function overlap(

    a,

    b

){



    return !(



        a.x + a.width <= b.x

        ||

        b.x + b.width <= a.x

        ||

        a.y + a.height <= b.y

        ||

        b.y + b.height <= a.y



    );



}









// ======================================
// Freie Flächen verbessern
// ======================================


function optimizeFreeAreas(

    free

){



    for(

        let i = 0;

        i < free.length;

        i++

    ){



        for(

            let j = i + 1;

            j < free.length;

            j++

        ){



            if(

                overlap(

                    free[i],

                    free[j]

                )

            ){



                if(

                    free[i].width *

                    free[i].height

                    <

                    free[j].width *

                    free[j].height

                ){



                    free.splice(

                        i,

                        1

                    );



                    i--;

                    break;



                }

            }



        }



    }



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 4
 Bewertung
==================================================
*/



// ======================================
// Lage bewerten
// ======================================


function scoreLayer(

    boxes,

    job

){



    if(

        boxes.length === 0

    ){

        return 0;

    }







    let usedArea = 0;







    boxes.forEach(box=>{



        usedArea +=

        box.length *

        box.width;



    });







    const palletArea =

        job.pallet.length *

        job.pallet.width;







    const utilization =



        (

            usedArea /

            palletArea

        )

        *

        100;







    const edge =

        edgeScore(

            boxes,

            job.pallet

        );








    return (



        utilization *

        0.75



        +



        edge *

        0.15



        +



        boxes.length *

        0.10



    );



}









// ======================================
// Randbewertung
// ======================================


function edgeScore(

    boxes,

    pallet

){



    let score = 0;







    boxes.forEach(box=>{



        if(

            box.x === 0

        ){



            score++;



        }







        if(

            box.y === 0

        ){



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
// Palette Auslastung
// ======================================


function calculateUtilization(

    stack,

    job

){



    let used = 0;







    stack.boxes.forEach(box=>{



        used +=

        box.length *

        box.width;



    });







    const max =



        job.pallet.length *

        job.pallet.width *

        stack.layers;







    stack.utilization =



        Number(

            (

                used /

                max *

                100

            )

            .toFixed(1)

        );



}









// ======================================
// Schwerpunkt
// ======================================


function calculateCenter(

    boxes

){



    let weight = 0;

    let x = 0;

    let y = 0;







    boxes.forEach(box=>{



        const w =

            box.length *

            box.width;







        weight += w;







        x +=

        (

            box.x +

            box.length/2

        )

        *

        w;







        y +=

        (

            box.y +

            box.width/2

        )

        *

        w;



    });








    if(weight===0){



        return {

            x:0,

            y:0

        };



    }







    return {



        x:

        x/weight,



        y:

        y/weight



    };



}
/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Teil 5
 Abschluss
==================================================
*/



// ======================================
// Stapel fertig berechnen
// ======================================


function finishStack(

    stack,

    job

){



    stack.boxes =

        validateBoxes(

            stack.boxes,

            job.pallet

        );







    stack.totalCartons =

        stack.boxes.length;







    calculateUtilization(

        stack,

        job

    );







    stack.stability =

        calculateStability(

            stack.boxes,

            job.pallet

        );







    stack.score =



        (

            stack.utilization *

            0.7

        )



        +



        (

            stack.stability *

            0.3

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
// Stabilität
// ======================================


function calculateStability(

    boxes,

    pallet

){



    const center =

        calculateCenter(

            boxes

        );







    const palletCenter = {



        x:

        pallet.length/2,



        y:

        pallet.width/2



    };








    const distance = Math.sqrt(



        Math.pow(

            center.x -

            palletCenter.x,

            2

        )



        +



        Math.pow(

            center.y -

            palletCenter.y,

            2

        )



    );








    const max = Math.sqrt(



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
// Höhe kontrollieren
// ======================================


function checkHeight(

    boxes,

    maxHeight

){



    return boxes.every(box=>{



        return (

            box.z +

            box.height

            <=

            maxHeight

        );



    });



}









// ======================================
// Ebenen anzeigen
// ======================================


function getLayerInfo(

    boxes

){



    const info = {};







    boxes.forEach(box=>{



        if(!info[box.layer]){


            info[box.layer]=0;


        }







        info[box.layer]++;



    });







    return info;



}









// ======================================
// Debug
// ======================================


function debugOptimizer(

    stack

){



    console.log(

        "=========================="

    );



    console.log(

        "Optimizer",

        stack.name

    );



    console.log(

        "Kartons:",

        stack.totalCartons

    );



    console.log(

        "Lagen:",

        stack.layers

    );



    console.log(

        "Auslastung:",

        stack.utilization,

        "%"

    );



    console.log(

        "Stabilität:",

        stack.stability

    );



    console.log(

        "Score:",

        stack.score

    );



    console.log(

        "Pro Lage:",

        getLayerInfo(

            stack.boxes

        )

    );



    console.log(

        "=========================="

    );








}



console.log(

    "Optimizer Version 14.0 geladen"

);
