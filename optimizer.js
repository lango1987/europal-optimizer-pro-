/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Pattern Layer System
 Version 3.0
==================================================
*/


function optimize(job){


    const result = {


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







    const patternA =

        createBestPattern(

            job,

            false

        );







    const patternB =

        createBestPattern(

            job,

            true

        );









    for(

        let layer=1;

        layer<=maxLayers;

        layer++

    ){



        let pattern;







        if(

            layer % 2 === 1

        ){



            pattern = patternA;



        }

        else{



            pattern = patternB;



        }







        result.boxes.push(

            ...createLayer(

                pattern,

                layer,

                job

            )

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
 optimizer.js
 Teil 2
 Muster Berechnung
==================================================
*/



// ======================================
// Bestes Lagenmuster finden
// ======================================


function createBestPattern(

    job,

    rotated

){



    const palletLength =

        job.pallet.length;



    const palletWidth =

        job.pallet.width;







    let boxLength;

    let boxWidth;







    if(rotated){



        boxLength =

            job.box.width;



        boxWidth =

            job.box.length;



    }

    else{



        boxLength =

            job.box.length;



        boxWidth =

            job.box.width;



    }








    const columns = Math.floor(



        palletLength /

        boxLength



    );








    const rows = Math.floor(



        palletWidth /

        boxWidth



    );








    const count =



        columns *

        rows;








    return {



        columns,



        rows,



        count,



        length:

        boxLength,



        width:

        boxWidth,



        rotation:

        rotated ? 90 : 0



    };



}









// ======================================
// Vergleich zweier Muster
// ======================================


function comparePatterns(

    a,

    b

){



    if(

        a.count >

        b.count

    ){



        return a;



    }







    if(

        b.count >

        a.count

    ){



        return b;



    }







    // gleiche Anzahl:
    // bessere Flächennutzung



    const areaA =

        a.columns *

        a.length *

        a.rows *

        a.width;







    const areaB =

        b.columns *

        b.length *

        b.rows *

        b.width;







    return areaA >= areaB ? a : b;



}
/*
==================================================
 optimizer.js
 Teil 3
 Lage erzeugen
==================================================
*/



// ======================================
// Eine komplette Lage erzeugen
// ======================================


function createLayer(

    pattern,

    layer,

    job

){



    const boxes = [];







    for(

        let row = 0;

        row < pattern.rows;

        row++

    ){



        for(

            let col = 0;

            col < pattern.columns;

            col++

        ){



            boxes.push({



                x:

                col *

                pattern.length,



                y:

                row *

                pattern.width,



                z:

                (

                    layer - 1

                )

                *

                job.box.height,



                length:

                pattern.length,



                width:

                pattern.width,



                height:

                job.box.height,



                rotation:

                pattern.rotation,



                layer:

                layer



            });



        }



    }







    return boxes;



}









// ======================================
// Flächenberechnung
// ======================================


function calculateLayerArea(

    pattern

){



    return (



        pattern.columns *

        pattern.length



    )

    *

    (



        pattern.rows *

        pattern.width



    );



}









// ======================================
// Auslastung
// ======================================


function calculateUtilization(

    boxes,

    pallet

){



    let used = 0;







    boxes.forEach(box=>{



        used +=

        box.length *

        box.width;



    });







    const max =



        pallet.length *

        pallet.width *

        (

            Math.max(

                ...boxes.map(

                    b=>b.layer

                )

            )

        );







    return (

        used /

        max *

        100

    ).toFixed(1);



}
/*
==================================================
 optimizer.js
 Teil 4
 Abschluss
==================================================
*/



// ======================================
// Ergebnis prüfen
// ======================================


function validateBoxes(

    boxes,

    pallet

){



    return boxes.filter(box=>{



        return (



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
// Restfläche bewerten
// ======================================


function calculateFreeSpace(

    pattern,

    pallet

){



    const used =



        pattern.columns *

        pattern.length *

        pattern.rows *

        pattern.width;







    const total =



        pallet.length *

        pallet.width;







    return total - used;



}









// ======================================
// Muster Auswahl
// ======================================


function getBestPattern(

    job

){



    const normal =

        createBestPattern(

            job,

            false

        );







    const rotated =

        createBestPattern(

            job,

            true

        );







    return comparePatterns(

        normal,

        rotated

    );



}









// ======================================
// Debug Ausgabe
// ======================================


function debugOptimizer(

    result

){



    console.log(

        "=========================="

    );



    console.log(

        "Europal Optimizer"

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

        result.boxes.map(

            box=>({


                layer:

                box.layer,


                x:

                box.x,


                y:

                box.y,


                rotation:

                box.rotation



            })

        )

    );



    console.log(

        "=========================="

    );



}







console.log(

    "Optimizer Pattern System geladen"

);
