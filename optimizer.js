/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 2.2
 Wechselnde 180° Lagen
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





// ==========================================
// Muster berechnen
// ==========================================


function calculatePattern(job, pattern){


    let boxLength = job.box.length;

    let boxWidth = job.box.width;



    // 90 Grad Drehung

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


        id:
            pattern.id,


        name:
            pattern.name,


        stability:
            pattern.stability,



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





// ==========================================
// Kartons erzeugen
// ==========================================


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



                let x;

                let y;

                let currentRotation = 0;




                /*
                =================================
                Jede zweite Lage 180 Grad drehen
                =================================
                */


                if(layer % 2 === 1){


                    x =

                    (
                        cols - 1 - col

                    )
                    *
                    boxLength;



                    y =

                    (
                        rows - 1 - row

                    )
                    *
                    boxWidth;



                    currentRotation = 180;



                }

                else{


                    x =

                    col *
                    boxLength;



                    y =

                    row *
                    boxWidth;



                    currentRotation = 0;


                }





                boxes.push({



                    x,

                    y,


                    z:

                    layer *
                    boxHeight,



                    length:

                    boxLength,



                    width:

                    boxWidth,



                    height:

                    boxHeight,



                    rotation:

                    currentRotation,



                    layer:

                    layer + 1


                });



            }


        }


    }



    return boxes;


}
