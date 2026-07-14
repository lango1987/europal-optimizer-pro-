/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 7.0
 Ebenen sauber getrennt
==================================================
*/


function optimize(job){


    return [

        calculateVariant(job)

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





    let boxes = [];






    for(
        let layer = 0;
        layer < layers;
        layer++
    ){



        const rotated =

            layer % 2 === 1;






        const layerBoxes =

            packLayer(

                job,

                rotated,

                layer

            );






        boxes.push(

            ...layerBoxes

        );



    }






    const firstLayer =

        boxes.filter(

            b => b.layer === 1

        );






    const area =

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

        "90degree",



        name:

        "90° Wechsellage Randfüllung",



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
                area /
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
 PackLayer
==================================================
*/



// ======================================
// Eine Lage packen
// ======================================


function packLayer(

    job,

    rotated,

    layer

){



    const boxes = [];





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







    const palletLength =
        job.pallet.length;



    const palletWidth =
        job.pallet.width;








    const occupied = [];







    // ==================================
    // Raster füllen
    // ==================================


    for(

        let y = 0;

        y + width <= palletWidth;

        y += width

    ){





        for(

            let x = 0;

            x + length <= palletLength;

            x += length

        ){





            if(

                checkFree(

                    occupied,

                    x,

                    y,

                    length,

                    width

                )

            ){



                const box = {



                    x:x,



                    y:y,



                    z:

                    layer *
                    job.box.height,



                    length:length,



                    width:width,



                    height:

                    job.box.height,



                    rotation:

                    rotation,



                    layer:

                    layer + 1



                };





                boxes.push(box);



                occupied.push(box);



            }



        }


    }







    // ==================================
    // Restflächen nachfüllen
    // ==================================


    fillEdges(

        boxes,

        occupied,

        palletLength,

        palletWidth,

        length,

        width,

        rotation,

        layer,

        job.box.height

    );







    return boxes;


}









// ======================================
// Prüfen ob Platz frei ist
// ======================================


function checkFree(

    boxes,

    x,

    y,

    w,

    h

){



    return !boxes.some(box=>{


        return !(


            x+w <= box.x ||


            x >= box.x + box.length ||


            y+h <= box.y ||


            y >= box.y + box.width



        );


    });



}
/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Teil 3
 Randfüllung
==================================================
*/



// ======================================
// Randbereiche füllen
// ======================================


function fillEdges(

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

                checkFree(

                    occupied,

                    x,

                    y,

                    boxLength,

                    boxWidth

                )

            ){





                const box = {



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

                    layer + 1



                };







                boxes.push(box);



                occupied.push(box);



            }





        }



    }



}
