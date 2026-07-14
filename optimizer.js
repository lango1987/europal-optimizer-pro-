/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 11.0
 Individuelle Lagen Optimierung
==================================================
*/


function optimize(job){


    const variant =
        createOptimizedPallet(job);



    return [

        variant

    ];


}









// ======================================
// Palette erstellen
// ======================================


function createOptimizedPallet(job){



    const variant = {


        id:

        "layer_optimizer",



        name:

        "Individuelle Lagen Optimierung",



        boxes:[],



        layers:0,



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





        const layerBoxes =

            optimizeSingleLayer(

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
// Eine Lage optimal packen
// ======================================


function optimizeSingleLayer(

    job,

    layer

){



    const normal =

        packLayer(

            job,

            layer,

            [

                {

                    length:

                    job.box.length,


                    width:

                    job.box.width,


                    rotation:0


                }

            ]

        );








    const rotated =

        packLayer(

            job,

            layer,

            [

                {

                    length:

                    job.box.width,


                    width:

                    job.box.length,


                    rotation:90


                }

            ]

        );








    const mixed =

        packMixedLayer(

            job,

            layer

        );









    const options = [

        normal,

        rotated,

        mixed

    ];








    options.sort((a,b)=>{


        return (

            b.length -

            a.length

        );



    });








    return options[0];



}








// ======================================
// Eine Richtung packen
// ======================================


function packLayer(

    job,

    layer,

    patterns

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



        sortFreeAreas(

            freeAreas

        );





        const area =

            freeAreas.shift();







        let placed = false;








        for(

            let p of patterns

        ){



            if(

                p.length <= area.width

                &&

                p.width <= area.height

            ){



                boxes.push({



                    x:

                    area.x,



                    y:

                    area.y,



                    z:

                    layer *

                    job.box.height,



                    length:

                    p.length,



                    width:

                    p.width,



                    height:

                    job.box.height,



                    rotation:

                    p.rotation,



                    layer:

                    layer + 1



                });







                splitArea(

                    freeAreas,

                    area,

                    p.length,

                    p.width

                );





                placed = true;



                break;



            }



        }







        if(!placed){



            continue;



        }



    }







    return boxes;



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 3
 Mischpackung innerhalb einer Lage
==================================================
*/



// ======================================
// Gemischte Lage optimieren
// ======================================


function packMixedLayer(

    job,

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



        sortFreeAreas(

            freeAreas

        );





        const area =

            freeAreas.shift();








        const placement =

            findBestBoxForArea(

                area,

                job.box.length,

                job.box.width

            );







        if(!placement){



            continue;



        }







        const box={



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

            layer+1



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
// Besten Karton für freie Fläche suchen
// ======================================


function findBestBoxForArea(

    area,

    boxLength,

    boxWidth

){



    const possible=[];







    // normale Richtung


    if(

        boxLength <= area.width

        &&

        boxWidth <= area.height

    ){



        possible.push({



            length:

            boxLength,



            width:

            boxWidth,



            rotation:

            0



        });



    }









    // gedrehte Richtung


    if(

        boxWidth <= area.width

        &&

        boxLength <= area.height

    ){



        possible.push({



            length:

            boxWidth,



            width:

            boxLength,



            rotation:

            90



        });



    }









    if(

        possible.length === 0

    ){



        return null;



    }









    // Richtung wählen,
    // die Restfläche kleiner macht


    possible.sort((a,b)=>{



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








    return possible[0];



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
// Fläche teilen
// ======================================


function splitArea(

    freeAreas,

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








    cleanFreeAreas(

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



        const areaA =

        a.width *

        a.height;



        const areaB =

        b.width *

        b.height;





        return areaB-areaA;



    });



}









// ======================================
// Kleine Flächen entfernen
// ======================================


function cleanFreeAreas(

    freeAreas

){



    for(

        let i = freeAreas.length-1;

        i >= 0;

        i--

    ){



        if(

            freeAreas[i].width < 5

            ||

            freeAreas[i].height < 5

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


function mergeFreeAreas(

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








            if(

                a.x === b.x

                &&

                a.width === b.width

                &&

                a.y + a.height === b.y

            ){



                a.height +=

                b.height;



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



    let usedArea = 0;



    variant.boxes.forEach(box=>{



        usedArea +=

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

                usedArea /

                palletArea *

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



    let total = 0;


    let x = 0;


    let y = 0;






    boxes.forEach(box=>{



        const area =

            box.length *

            box.width;





        total += area;






        x +=

        (

            box.x +

            box.length/2

        )

        *

        area;






        y +=

        (

            box.y +

            box.width/2

        )

        *

        area;



    });








    if(total===0){



        return {


            x:0,

            y:0


        };



    }







    return {



        x:

        x/total,



        y:

        y/total



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

        calculateCenter(

            boxes

        );






    const cx =

        pallet.length/2;



    const cy =

        pallet.width/2;








    const distance = Math.sqrt(



        Math.pow(

            center.x-cx,

            2

        )



        +



        Math.pow(

            center.y-cy,

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

                distance/max*100

            )

        )

        .toFixed(1)



    );



}









// ======================================
// Randabdeckung
// ======================================


function calculateEdgeScore(

    boxes,

    pallet

){



    let score = 0;





    boxes.forEach(box=>{



        if(box.x===0){

            score += 1;

        }



        if(box.y===0){

            score += 1;

        }



        if(

            box.x + box.length

            ===

            pallet.length

        ){

            score += 1;

        }



        if(

            box.y + box.width

            ===

            pallet.width

        ){

            score += 1;

        }



    });







    return Math.min(

        100,

        score * 2

    );



}









// ======================================
// Gesamtbewertung
// ======================================


function evaluateLayerVariant(

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

        calculateEdgeScore(

            variant.boxes,

            job.pallet

        );







    variant.score =



        (

            variant.utilization *

            0.6

        )

        +



        (

            variant.stability *

            0.3

        )

        +



        (

            edge *

            0.1

        );





}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 6
 Abschluss + Ausgabe
==================================================
*/



// ======================================
// Variante fertigstellen
// ======================================


function finalizeVariant(

    variant,

    job

){



    variant.boxes =

        validateBoxes(

            variant.boxes,

            job.pallet

        );






    variant.totalCartons =

        variant.boxes.length;







    variant.layers =

        Math.max(

            ...variant.boxes.map(

                b=>b.layer

            )

        );






    evaluateLayerVariant(

        variant,

        job

    );






    return variant;



}









// ======================================
// Sicherheitsprüfung
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



            box.x + box.length

            <=

            pallet.length



            &&



            box.y + box.width

            <=

            pallet.width



        );



    });



}









// ======================================
// Ebenen Statistik
// ======================================


function getLayerStatistics(

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

        "Lagen Übersicht:",

        getLayerStatistics(

            variant.boxes

        )

    );



    console.log(

        "=========================="

    );



}






console.log(

    "Optimizer Version 11.0 geladen"

);
