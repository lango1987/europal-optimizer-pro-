/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 2.1
 Kreuzverband / versetzte Lagen
==================================================
*/


function optimize(job) {

    const variants = [];


    getPatterns().forEach(pattern => {


        const result = calculatePattern(
            job,
            pattern
        );


        if(result.totalCartons > 0){

            variants.push(result);

        }


    });



    variants.sort((a,b)=>{


        if(
            b.cartonsPerLayer !== 
            a.cartonsPerLayer
        ){

            return (
                b.cartonsPerLayer -
                a.cartonsPerLayer
            );

        }


        return (
            b.utilization -
            a.utilization
        );


    });



    return variants;


}




// =======================================
// Muster berechnen
// =======================================


function calculatePattern(job, pattern){


    let boxLength = job.box.length;

    let boxWidth = job.box.width;



    if(pattern.rotation === 90){


        boxLength = job.box.width;

        boxWidth = job.box.length;


    }



    const cols = Math.floor(

        job.pallet.length /
        boxLength

    );



    const rows = Math.floor(

        job.pallet.width /
        boxWidth

    );



    const cartonsPerLayer =
        cols * rows;



    const layers = Math.max(

        0,

        Math.floor(

            (
                job.settings.maxHeight -
                job.pallet.height
            )
            /
            job.box.height

        )

    );



    const totalCartons =

        cartonsPerLayer *
        layers;



    const palletArea =

        job.pallet.length *
        job.pallet.width;



    const usedArea =

        cartonsPerLayer *
        boxLength *
        boxWidth;



    const utilization = Number(

        (
            usedArea /
            palletArea *
            100

        )
        .toFixed(1)

    );




    return {


        id: pattern.id,


        name: pattern.name,


        stability: pattern.stability,


        cols,


        rows,


        layers,


        cartonsPerLayer,


        totalCartons,


        utilization,


        boxLength,


        boxWidth,


        boxHeight:
            job.box.height,



        boxes:

            createBoxes(

                cols,

                rows,

                layers,

                boxLength,

                boxWidth,

                job.box.height,

                pattern.rotation

            )


    };


}




// =======================================
// Kartonpositionen erzeugen
// =======================================


function createBoxes(

    cols,

    rows,

    layers,

    boxLength,

    boxWidth,

    boxHeight,

    rotation

){


    const boxes = [];



    for(
        let layer = 0;
        layer < layers;
        layer++
    ){



        for(
            let row = 0;
            row < rows;
            row++
        ){



            for(
                let col = 0;
                col < cols;
                col++
            ){



                let offsetX = 0;

                let offsetY = 0;



                /*
                =================================
                Kreuzverband

                Jede zweite Lage wird
                halb versetzt
                =================================
                */


                if(layer % 2 === 1){


                    offsetX =
                        boxLength / 2;


                    offsetY =
                        boxWidth / 2;


                }




                let rot = rotation;



                if(rotation === "alternate"){


                    rot =
                    layer % 2 === 0
                    ?
                    0
                    :
                    90;


                }





                boxes.push({


                    x:

                        col * boxLength +
                        offsetX,



                    y:

                        row * boxWidth +
                        offsetY,



                    z:

                        layer * boxHeight,



                    length:
                        boxLength,



                    width:
                        boxWidth,



                    height:
                        boxHeight,



                    rotation:
                        rot,



                    layer:
                        layer + 1



                });



            }


        }


    }



    return boxes;


}
