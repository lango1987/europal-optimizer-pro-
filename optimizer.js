/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 3.0
 180 Grad Wechsellagen
==================================================
*/


function optimize(job){


    const variants = [];



    getPatterns().forEach(pattern=>{


        const result =
            calculatePattern(
                job,
                pattern
            );


        if(
            result.totalCartons > 0
        ){

            variants.push(result);

        }


    });





    variants.sort((a,b)=>{


        // Stabilste Variante zuerst

        if(
            b.stability !== a.stability
        ){

            return (
                b.stability -
                a.stability
            );

        }



        // Danach Anzahl Kartons

        return (

            b.cartonsPerLayer -

            a.cartonsPerLayer

        );



    });





    return variants;


}







// ======================================
// Berechnung einer Variante
// ======================================


function calculatePattern(

    job,

    pattern

){



    let boxLength =
        job.box.length;



    let boxWidth =
        job.box.width;





    if(
        pattern.rotation === 90
    ){


        boxLength =
            job.box.width;


        boxWidth =
            job.box.length;


    }





    const cols =
        Math.floor(

            job.pallet.length /
            boxLength

        );



    const rows =
        Math.floor(

            job.pallet.width /
            boxWidth

        );





    const cartonsPerLayer =
        cols * rows;





    const layers =
        Math.floor(

            (
                job.settings.maxHeight -
                job.pallet.height

            )
            /
            job.box.height

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





    const utilization =

        Number(

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

                job.box.height

            )



    };


}









// ======================================
// Kartons erzeugen
// ======================================


function createBoxes(

    cols,

    rows,

    layers,

    boxLength,

    boxWidth,

    boxHeight

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

                let rotation;







                // ==========================
                // Gerade Lage
                // ==========================


                if(
                    layer % 2 === 0
                ){



                    x =

                        col *
                        boxLength;



                    y =

                        row *
                        boxWidth;



                    rotation = 0;



                }




                // ==========================
                // Ungerade Lage 180 Grad
                // ==========================


                else {



                    x =

                    (
                        cols -
                        1 -
                        col

                    )
                    *
                    boxLength;




                    y =

                    (
                        rows -
                        1 -
                        row

                    )
                    *
                    boxWidth;




                    rotation = 180;



                }








                boxes.push({



                    x:x,


                    y:y,



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

                    rotation,



                    layer:

                    layer + 1



                });





            }





        }





    }







    return boxes;



}
