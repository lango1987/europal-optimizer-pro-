/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 4.0
 90 Grad Wechsellagen
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



        if(result.totalCartons > 0){

            variants.push(result);

        }


    });





    variants.sort((a,b)=>{


        if(
            b.stability !== a.stability
        ){

            return (
                b.stability -
                a.stability
            );

        }



        return (

            b.totalCartons -

            a.totalCartons

        );


    });





    return variants;


}







// ======================================
// Variante berechnen
// ======================================


function calculatePattern(

    job,

    pattern

){



    const normalLength =
        job.box.length;



    const normalWidth =
        job.box.width;






    const colsNormal = Math.floor(

        job.pallet.length /
        normalLength

    );



    const rowsNormal = Math.floor(

        job.pallet.width /
        normalWidth

    );





    const cartonsNormal =

        colsNormal *
        rowsNormal;







    const colsRotated = Math.floor(

        job.pallet.length /
        normalWidth

    );



    const rowsRotated = Math.floor(

        job.pallet.width /
        normalLength

    );





    const cartonsRotated =

        colsRotated *
        rowsRotated;








    const layers = Math.floor(

        (
            job.settings.maxHeight -
            job.pallet.height

        )
        /
        job.box.height

    );








    const boxes = createBoxes(

        layers,

        colsNormal,

        rowsNormal,

        colsRotated,

        rowsRotated,

        normalLength,

        normalWidth,

        job.box.height

    );







    const cartonsPerLayer = Math.max(

        cartonsNormal,

        cartonsRotated

    );







    const totalCartons =

        boxes.length;







    const palletArea =

        job.pallet.length *
        job.pallet.width;






    const usedArea =

        cartonsPerLayer *
        normalLength *
        normalWidth;






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
            "90° Wechsellagen",



        stability:
            95,



        layers,


        cartonsPerLayer,



        totalCartons,



        utilization,



        boxes


    };


}









// ======================================
// Kartons erzeugen
// ======================================


function createBoxes(

    layers,

    colsNormal,

    rowsNormal,

    colsRotated,

    rowsRotated,

    boxLength,

    boxWidth,

    boxHeight

){



    const boxes=[];







    for(

        let layer=0;

        layer<layers;

        layer++

    ){





        let rotated =
            layer % 2 === 1;





        let cols;

        let rows;

        let length;

        let width;

        let rotation;






        if(rotated){


            cols =
                colsRotated;


            rows =
                rowsRotated;



            length =
                boxWidth;



            width =
                boxLength;



            rotation =
                90;



        }

        else{


            cols =
                colsNormal;


            rows =
                rowsNormal;



            length =
                boxLength;



            width =
                boxWidth;



            rotation =
                0;



        }









        for(

            let row=0;

            row<rows;

            row++

        ){



            for(

                let col=0;

                col<cols;

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



                    length:length,



                    width:width,



                    height:
                    boxHeight,



                    rotation:rotation,



                    layer:
                    layer+1



                });




            }


        }




    }







    return boxes;


}
