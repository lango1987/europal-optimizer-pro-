/*
==================================================
 Europal Optimizer Pro
 optimizer.js
 Version 1.0
 Wechsel-Lagen System
==================================================
*/



function optimize(job){


    const result = {


        boxes: [],


        layers: 0,


        totalCartons: 0


    };







    const layers = Math.floor(



        (

            job.settings.maxHeight -

            job.pallet.height

        )

        /

        job.box.height



    );







    result.layers = layers;








    for(

        let layer = 1;

        layer <= layers;

        layer++

    ){



        let boxes;







        if(

            layer % 2 === 1

        ){



            boxes = createPatternA(

                job,

                layer

            );



        }

        else{



            boxes = createPatternB(

                job,

                layer

            );



        }







        result.boxes.push(

            ...boxes

        );



    }








    result.totalCartons =

        result.boxes.length;







    return [

        result

    ];



}









// ======================================
// Muster A
// Lage 1,3,5
// ======================================


function createPatternA(

    job,

    layer

){



    return packLayer(

        job,

        layer,

        false

    );



}









// ======================================
// Muster B
// Lage 2,4,6
// ======================================


function createPatternB(

    job,

    layer

){



    return packLayer(

        job,

        layer,

        true

    );



}









// ======================================
// Eine Lage packen
// ======================================


function packLayer(

    job,

    layer,

    rotateFirst

){



    const boxes = [];



    const free = [];







    free.push({



        x:0,

        y:0,



        width:

        job.pallet.length,



        height:

        job.pallet.width



    });









    while(

        free.length > 0

    ){



        free.sort((a,b)=>{



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







        const area =

            free.shift();







        const placement =

            findPosition(

                area,

                job.box,

                rotateFirst

            );







        if(

            !placement

        ){



            continue;

        }







        boxes.push({



            x:

            area.x,



            y:

            area.y,



            z:

            (

                layer-1

            )

            *

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

            layer



        });







        splitFree(

            free,

            area,

            placement.length,

            placement.width

        );



    }







    return boxes;



}









// ======================================
// beste Drehung finden
// ======================================


function findPosition(

    area,

    box,

    rotateFirst

){



    const options = [];







    if(



        box.length <= area.width

        &&

        box.width <= area.height



    ){



        options.push({



            length:

            box.length,



            width:

            box.width,



            rotation:

            0



        });



    }








    if(



        box.width <= area.width

        &&

        box.length <= area.height



    ){



        options.push({



            length:

            box.width,



            width:

            box.length,



            rotation:

            90



        });



    }







    if(

        options.length === 0

    ){



        return null;



    }







    if(

        rotateFirst

    ){



        options.sort((a,b)=>{



            return b.rotation-a.rotation;



        });



    }







    return options[0];



}









// ======================================
// Freifläche teilen
// ======================================


function splitFree(

    free,

    area,

    length,

    width

){



    const right = {



        x:

        area.x+length,



        y:

        area.y,



        width:

        area.width-length,



        height:

        width



    };







    const bottom = {



        x:

        area.x,



        y:

        area.y+width,



        width:

        area.width,



        height:

        area.height-width



    };







    if(

        right.width>0

        &&

        right.height>0

    ){



        free.push(

            right

        );



    }







    if(

        bottom.width>0

        &&

        bottom.height>0

    ){



        free.push(

            bottom

        );



    }



}
