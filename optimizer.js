/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 13.0
 Individuelle Layer Optimierung
==================================================
*/



function optimize(job){


    const variant =

        createOptimizedStack(job);



    return [

        variant

    ];

}







// ======================================
// Komplette Palette erzeugen
// ======================================


function createOptimizedStack(job){



    const variant = {



        id:

        "optimized_layers",



        name:

        "Optimierte Einzellagen",



        boxes:[],



        layers:0,



        totalCartons:0,



        utilization:0,



        stability:0,



        score:0



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
// Eine einzelne Lage optimieren
// ======================================


function optimizeLayer(

    job,

    layer

){



    const attempts = [];







    // Versuch 1
    // normal von links oben


    attempts.push(

        packLayerAttempt(

            job,

            layer,

            {

                start:"topLeft",

                reverse:false

            }

        )

    );







    // Versuch 2
    // von rechts oben


    attempts.push(

        packLayerAttempt(

            job,

            layer,

            {

                start:"topRight",

                reverse:true

            }

        )

    );







    // Versuch 3
    // von unten links


    attempts.push(

        packLayerAttempt(

            job,

            layer,

            {

                start:"bottomLeft",

                reverse:false

            }

        )

    );







    // Versuch 4
    // gemischte Richtung


    attempts.push(

        packLayerAttempt(

            job,

            layer,

            {

                start:"mixed",

                reverse:true

            }

        )

    );








    // beste Lösung suchen


    attempts.sort((a,b)=>{


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







    return attempts[0];



}









// ======================================
// Eine Packung versuchen
// ======================================


function packLayerAttempt(

    job,

    layer,

    mode

){



    const boxes = [];



    const freeAreas = [];






    freeAreas.push(

        createStartArea(

            job,

            mode

        )

    );







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

                job.box.width,

                mode

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
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 3
 Platzierung + Drehung
==================================================
*/



// ======================================
// Startfläche erzeugen
// ======================================


function createStartArea(

    job,

    mode

){



    let x = 0;

    let y = 0;






    if(mode.start === "topRight"){


        x = 0;


        y = 0;



    }





    if(mode.start === "bottomLeft"){


        x = 0;


        y = 0;



    }





    if(mode.start === "mixed"){


        x = 0;


        y = 0;



    }







    return {



        x:x,



        y:y,



        width:

        job.pallet.length,



        height:

        job.pallet.width



    };



}









// ======================================
// Beste Kartonposition finden
// ======================================


function findBestPlacement(

    area,

    boxLength,

    boxWidth,

    mode

){



    const options=[];







    // normale Lage


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








    if(options.length===0){



        return null;



    }








    // Bei unterschiedlichen
    // Mustern anders sortieren


    if(mode.reverse){



        options.reverse();



    }









    // kleinste Restfläche gewinnt


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
// Freie Fläche teilen
// ======================================


function splitArea(

    freeAreas,

    area,

    boxLength,

    boxWidth

){



    // Rechte Restfläche


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







    // Untere Restfläche


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







    removeInvalidAreas(

        freeAreas

    );



}









// ======================================
// Freiflächen sortieren
// größte zuerst
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
// Ungültige Flächen entfernen
// ======================================


function removeInvalidAreas(

    freeAreas

){



    for(

        let i = freeAreas.length - 1;

        i >= 0;

        i--

    ){



        const area =

            freeAreas[i];







        if(

            area.width <= 0

            ||

            area.height <= 0

        ){



            freeAreas.splice(

                i,

                1

            );



        }



    }



}









// ======================================
// Überlappungen entfernen
// ======================================


function removeContainedAreas(

    freeAreas

){



    for(

        let i = 0;

        i < freeAreas.length;

        i++

    ){



        for(

            let j = i + 1;

            j < freeAreas.length;

            j++

        ){



            const a =

                freeAreas[i];



            const b =

                freeAreas[j];







            if(

                a.x <= b.x

                &&

                a.y <= b.y

                &&

                a.x+a.width >= b.x+b.width

                &&

                a.y+a.height >= b.y+b.height

            ){



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
 Bewertung der Lage
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

        * 100;







    const countScore =

        boxes.length *

        5;







    const edgeScore =

        calculateEdgeScore(

            boxes,

            job.pallet

        );







    return (



        utilization *

        0.65



        +



        countScore *

        0.25



        +



        edgeScore *

        0.10



    );



}









// ======================================
// Randkontakt bewerten
// ======================================


function calculateEdgeScore(

    boxes,

    pallet

){



    let score = 0;







    boxes.forEach(box=>{



        if(

            box.x === 0

        ){



            score += 1;



        }






        if(

            box.y === 0

        ){



            score += 1;



        }






        if(

            box.x +

            box.length

            ===

            pallet.length

        ){



            score += 1;



        }






        if(

            box.y +

            box.width

            ===

            pallet.width

        ){



            score += 1;



        }



    });








    return Math.min(

        score,

        100

    );



}









// ======================================
// Gesamtbewertung Palette
// ======================================


function calculateUtilization(

    variant,

    job

){



    let area = 0;







    variant.boxes.forEach(box=>{



        area +=

        box.length *

        box.width;



    });







    const maxArea =



        job.pallet.length *

        job.pallet.width *

        variant.layers;








    variant.utilization =



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
 Optimizer
 Teil 6
 Stabilität
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



        const weight =

            box.length *

            box.width;







        totalWeight += weight;







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
// Stabilität der Palette
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
// Lagenversatz prüfen
// ======================================


function calculateLayerShift(

    boxes,

    layers

){



    let score = 100;







    for(

        let layer = 1;

        layer < layers;

        layer++

    ){



        const lower =

            getLayerCenter(

                boxes,

                layer

            );







        const upper =

            getLayerCenter(

                boxes,

                layer+1

            );







        const distance = Math.sqrt(



            Math.pow(

                lower.x-upper.x,

                2

            )



            +



            Math.pow(

                lower.y-upper.y,

                2

            )



        );







        if(distance < 30){



            score -= 5;



        }



    }







    return Math.max(

        0,

        score

    );



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

            b.layer===layer

        );






    let x=0;

    let y=0;







    layerBoxes.forEach(box=>{



        x +=

        box.x +

        box.length/2;





        y +=

        box.y +

        box.width/2;



    });








    if(layerBoxes.length===0){



        return {


            x:0,


            y:0



        };



    }








    return {



        x:

        x /

        layerBoxes.length,



        y:

        y /

        layerBoxes.length



    };



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


function finalizeVariant(

    variant,

    job

){



    // Kartons außerhalb entfernen


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








    variant.utilization =

        calculateUtilizationValue(

            variant,

            job

        );








    variant.stability =

        calculateStability(

            variant.boxes,

            job.pallet

        );








    variant.score =



        (

            variant.utilization *

            0.65

        )



        +



        (

            variant.stability *

            0.35

        );








    return variant;



}









// ======================================
// Auslastungswert
// ======================================


function calculateUtilizationValue(

    variant,

    job

){



    let used = 0;







    variant.boxes.forEach(box=>{



        used +=

        box.length *

        box.width;



    });







    const max =



        job.pallet.length *

        job.pallet.width *

        variant.layers;







    return Number(



        (

            used /

            max *

            100

        )

        .toFixed(1)



    );



}









// ======================================
// Höhe prüfen
// ======================================


function checkMaxHeight(

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
// Ebenen Übersicht
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

    variant

){



    console.log(

        "=============================="

    );



    console.log(

        "Optimierung:",

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

        "Lagen:",

        getLayerInfo(

            variant.boxes

        )

    );



    console.log(

        "=============================="

    );








}



console.log(

    "Optimizer Version 13.0 geladen"

);
