/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 12.0
 Individuelle Ebenen
==================================================
*/


function optimize(job){


    return [

        createOptimizedStack(job)

    ];

}








// ======================================
// Stapel erzeugen
// ======================================


function createOptimizedStack(job){



    const variant = {



        id:

        "individual_layers",



        name:

        "Individuelle optimale Lagen",



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







    variant.layers = layerCount;








    for(

        let layer = 0;

        layer < layerCount;

        layer++

    ){



        const layerBoxes =

            optimizeLayer(

                job,

                layer

            );







        variant.boxes.push(

            ...layerBoxes

        );



    }







    variant.totalCartons =

        variant.boxes.length;







    calculateUtilization(

        variant,

        job

    );







    return variant;



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 2
 Einzelne Lage optimieren
==================================================
*/



// ======================================
// Eine Lage berechnen
// ======================================


function optimizeLayer(

    job,

    layer

){



    const patterns = [

        createPattern(layer,0),

        createPattern(layer,1),

        createPattern(layer,2)

    ];







    let best = [];








    patterns.forEach(pattern=>{



        const result =

            packPattern(

                job,

                layer,

                pattern

            );






        if(

            result.length >

            best.length

        ){



            best = result;



        }



    });








    return best;



}









// ======================================
// Suchmuster erzeugen
// ======================================


function createPattern(

    layer,

    type

){



    if(type===0){



        return {



            name:

            "normal",



            startX:0,



            startY:0,



            reverse:false



        };



    }








    if(type===1){



        return {



            name:

            "gedreht_start",



            startX:1,



            startY:0,



            reverse:true



        };



    }








    return {



        name:

        "wechsel_start",



        startX:0,



        startY:1,



        reverse:

        layer%2===0



    };



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 3
 Packmuster ausführen
==================================================
*/



// ======================================
// Muster packen
// ======================================


function packPattern(

    job,

    layer,

    pattern

){



    const boxes = [];



    const freeAreas = [];








    // Startbereich abhängig vom Muster


    freeAreas.push({



        x:

        pattern.startX === 1

        ?

        job.pallet.length

        :

        0,





        y:

        pattern.startY === 1

        ?

        job.pallet.width

        :

        0,





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

            findBestBox(

                area,

                job.box.length,

                job.box.width,

                pattern

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







        splitArea(

            freeAreas,

            area,

            placement.length,

            placement.width

        );



    }







    return boxes;



}









// ======================================
// Besten Karton wählen
// ======================================


function findBestBox(

    area,

    boxLength,

    boxWidth,

    pattern

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



            rotation:

            0



        });



    }









    // 90 Grad gedreht


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



            rotation:

            90



        });



    }







    if(

        options.length === 0

    ){



        return null;



    }







    // beste Restfläche auswählen


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





        return restA-restB;



    });







    return options[0];



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 4
 Freiflächen Verwaltung
==================================================
*/



// ======================================
// Freifläche teilen
// ======================================


function splitArea(

    freeAreas,

    area,

    boxLength,

    boxWidth

){



    // rechte Fläche


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








    // untere Fläche


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








    cleanAreas(

        freeAreas

    );



}









// ======================================
// Größte Fläche zuerst
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









// ======================================
// Kleine Restflächen löschen
// ======================================


function cleanAreas(

    freeAreas

){



    for(

        let i = freeAreas.length-1;

        i >= 0;

        i--

    ){



        const area =

            freeAreas[i];






        if(

            area.width < 5

            ||

            area.height < 5

        ){



            freeAreas.splice(

                i,

                1

            );



        }



    }



}









// ======================================
// Freiflächen zusammenführen
// ======================================


function mergeAreas(

    freeAreas

){



    for(

        let i=0;

        i<freeAreas.length;

        i++

    ){



        for(

            let j=i+1;

        j<freeAreas.length;

        j++

        ){



            const a =

            freeAreas[i];



            const b =

            freeAreas[j];







            // nebeneinander


            if(


                a.y === b.y

                &&

                a.height === b.height

                &&

                a.x + a.width === b.x


            ){



                a.width +=

                b.width;



                freeAreas.splice(

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
 Optimizer
 Teil 5
 Bewertung
==================================================
*/



// ======================================
// Auslastung berechnen
// ======================================


function calculateUtilization(

    variant,

    job

){



    let used = 0;





    variant.boxes.forEach(box=>{



        used +=

        box.length *

        box.width;



    });







    const palletArea =

        job.pallet.length *

        job.pallet.width *

        variant.layers;








    variant.utilization =

        Number(

            (

                used /

                palletArea *

                100

            )

            .toFixed(1)

        );



}









// ======================================
// Schwerpunkt berechnen
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
// Stabilität berechnen
// ======================================


function calculateStability(

    boxes,

    pallet

){



    const center =

        calculateCenterOfGravity(

            boxes

        );






    const palletCenter = {



        x:

        pallet.length / 2,



        y:

        pallet.width / 2



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



        Math.max(

            0,

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









// ======================================
// Randnutzung
// ======================================


function calculateEdgeUsage(

    boxes,

    pallet

){



    let points = 0;







    boxes.forEach(box=>{



        if(box.x === 0){

            points++;

        }





        if(box.y === 0){

            points++;

        }





        if(

            box.x +

            box.length

            ===

            pallet.length

        ){

            points++;

        }





        if(

            box.y +

            box.width

            ===

            pallet.width

        ){

            points++;

        }





    });








    return Math.min(

        100,

        points * 2

    );



}









// ======================================
// Gesamtbewertung
// ======================================


function evaluateVariant(

    variant,

    job

){



    calculateUtilization(

        variant,

        job

    );








    variant.stability =

        calculateStability(

            variant.boxes,

            job.pallet

        );








    const edge =

        calculateEdgeUsage(

            variant.boxes,

            job.pallet

        );







    variant.score =



        (

            variant.utilization *

            0.60

        )



        +



        (

            variant.stability *

            0.30

        )



        +



        (

            edge *

            0.10

        );



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 6
 Stabilität der Lagen
==================================================
*/



// ======================================
// Lage auslesen
// ======================================


function getLayerBoxes(

    boxes,

    layer

){



    return boxes.filter(

        box =>

        box.layer === layer

    );



}









// ======================================
// Mittelpunkt einer Lage
// ======================================


function getLayerCenter(

    boxes

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



        return {


            x:0,


            y:0


        };



    }







    return {



        x:

        x / count,



        y:

        y / count



    };



}









// ======================================
// Versatz zwischen Lagen prüfen
// ======================================


function calculateLayerOffset(

    boxes,

    layers

){



    let score = 100;







    for(

        let i=1;

        i<layers;

        i++

    ){



        const previous =

            getLayerCenter(

                getLayerBoxes(

                    boxes,

                    i

                )

            );





        const current =

            getLayerCenter(

                getLayerBoxes(

                    boxes,

                    i+1

                )

            );







        const distance = Math.sqrt(



            Math.pow(

                previous.x -

                current.x,

                2

            )



            +



            Math.pow(

                previous.y -

                current.y,

                2

            )



        );







        if(distance < 20){



            score -= 5;



        }



    }








    return Math.max(

        0,

        score

    );



}









// ======================================
// Endgültige Stabilitätswertung
// ======================================


function calculateFinalStability(

    variant,

    job

){



    const centerScore =

        calculateStability(

            variant.boxes,

            job.pallet

        );








    const offsetScore =

        calculateLayerOffset(

            variant.boxes,

            variant.layers

        );








    variant.stability =



        Number(

            (

                centerScore *

                0.7

                +

                offsetScore *

                0.3

            )

            .toFixed(1)

        );



}









// ======================================
// Stapelhöhe prüfen
// ======================================


function checkHeight(

    boxes,

    maxHeight

){



    let highest = 0;







    boxes.forEach(box=>{



        const top =

        box.z +

        box.height;







        if(top > highest){



            highest = top;



        }



    });







    return highest <= maxHeight;



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 7
 Abschluss
==================================================
*/



// ======================================
// Finale Variante vorbereiten
// ======================================


function finalizeOptimizer(

    variant,

    job

){



    // ungültige Kartons entfernen


    variant.boxes =

        variant.boxes.filter(box=>{



            return (

                box.x >= 0

                &&

                box.y >= 0



                &&



                box.x +

                box.length

                <=

                job.pallet.length



                &&



                box.y +

                box.width

                <=

                job.pallet.width



            );



        });







    variant.totalCartons =

        variant.boxes.length;







    calculateUtilization(

        variant,

        job

    );








    calculateFinalStability(

        variant,

        job

    );








    return variant;



}









// ======================================
// Ebenen Statistik
// ======================================


function layerStatistics(

    boxes

){



    const result = {};






    boxes.forEach(box=>{



        if(!result[box.layer]){


            result[box.layer] = 0;


        }






        result[box.layer]++;



    });







    return result;



}









// ======================================
// Debug Ausgabe
// ======================================


function debugOptimizer(

    variant

){



    console.log(

        "=========================="

    );



    console.log(

        "Name:",

        variant.name

    );



    console.log(

        "Kartons:",

        variant.totalCartons

    );



    console.log(

        "Lagen:",

        variant.layers

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

        "Kartons pro Lage:",

        layerStatistics(

            variant.boxes

        )

    );



    console.log(

        "=========================="

    );



}








console.log(

    "Optimizer Version 12.0 geladen"

);
