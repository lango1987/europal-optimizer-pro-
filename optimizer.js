/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 5.0
 90 Grad Wechsellagen
==================================================
*/


function optimize(job){


    const variants = [];



    const result =
        calculatePattern(job);



    variants.push(result);



    return variants;


}






// ======================================
// Berechnung
// ======================================


function calculatePattern(job){



    const boxLength =
        job.box.length;



    const boxWidth =
        job.box.width;



    const boxHeight =
        job.box.height;





    const layers = Math.floor(

        (
            job.settings.maxHeight -
            job.pallet.height

        )
        /
        boxHeight

    );





    const boxes = createBoxes(

        layers,

        boxLength,

        boxWidth,

        boxHeight,

        job.pallet.length,

        job.pallet.width

    );






    // Anzahl Kartons pro Lage

    const layerCount =
        boxes.filter(
            b => b.layer === 1
        ).length;





    const palletArea =
        job.pallet.length *
        job.pallet.width;



    const usedArea =
        boxLength *
        boxWidth *
        layerCount;





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
        "cross90",



        name:
        "90° Wechsellagen",



        stability:
        95,



        layers:
        layers,



        cartonsPerLayer:
        layerCount,



        totalCartons:
        boxes.length,



        utilization:
        utilization,



        boxLength:
        boxLength,



        boxWidth:
        boxWidth,



        boxHeight:
        boxHeight,



        boxes:
        boxes


    };


}









// ======================================
// Kartons erzeugen
// ======================================


function createBoxes(

    layers,

    boxLength,

    boxWidth,

    boxHeight,

    palletLength,

    palletWidth

){



    const boxes = [];






    for(

        let layer = 0;

        layer < layers;

        layer++

    ){



        let rotated =
            layer % 2 === 1;





        let length;

        let width;

        let rotation;






        if(rotated){


            length =
            boxWidth;



            width =
            boxLength;



            rotation =
            90;



        }
        else{


            length =
            boxLength;



            width =
            boxWidth;



            rotation =
            0;



        }








        const cols = Math.floor(

            palletLength /
            length

        );



        const rows = Math.floor(

            palletWidth /
            width

        );








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





                boxes.push({



                    x:

                    col *
                    length,



                    y:

                    row *
                    width,



                    z:

                    layer *
                    boxHeight,



                    length:
                    length,



                    width:
                    width,



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
