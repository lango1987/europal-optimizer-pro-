/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 1.0
 Teil 3A
==================================================
*/


function drawVariant(
    canvasId,
    variant,
    pallet
){

    const canvas =
        document.getElementById(canvasId);


    if(!canvas){

        return;

    }


    const ctx =
        canvas.getContext("2d");



    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    ctx.fillStyle =
        COLORS.background;



    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



    if(currentView==="iso"){


        drawIsometric(

            ctx,

            variant,

            pallet

        );


        return;


    }



    if(currentView==="layer1"){


        drawTopView(

            ctx,

            variant,

            pallet,

            1

        );


        return;


    }



    if(currentView==="layer2"){


        drawTopView(

            ctx,

            variant,

            pallet,

            2

        );


        return;


    }



    drawTopView(

        ctx,

        variant,

        pallet,

        0

    );


}





// =================================
// Draufsicht
// =================================


function drawTopView(

    ctx,

    variant,

    pallet,

    selectedLayer

){



    const margin =
        SETTINGS.canvas.margin;



    const scale = Math.min(


        (
            ctx.canvas.width -
            margin * 2

        )
        /
        pallet.length,



        (
            ctx.canvas.height -
            margin * 2

        )
        /
        pallet.width



    );





    drawTopPallet(

        ctx,

        margin,

        margin,

        pallet.length * scale,

        pallet.width * scale

    );






    variant.boxes.forEach(box=>{



        if(
            selectedLayer!==0
            &&
            box.layer!==selectedLayer
        ){

            return;

        }





        drawTopBox(

            ctx,

            margin + box.x * scale,

            margin + box.y * scale,

            box.length * scale,

            box.width * scale,

            box.rotation


        );



    });


}






// =================================
// Palette Draufsicht
// =================================


function drawTopPallet(

    ctx,

    x,

    y,

    w,

    h

){


    ctx.fillStyle =
        COLORS.palletTop;



    ctx.fillRect(

        x,

        y,

        w,

        h

    );



    ctx.strokeStyle =
        COLORS.palletDark;



    ctx.lineWidth=3;



    ctx.strokeRect(

        x,

        y,

        w,

        h

    );



}





// =================================
// Karton Draufsicht
// =================================


function drawTopBox(

    ctx,

    x,

    y,

    w,

    h,

    rotation

){



    ctx.fillStyle =
        COLORS.boxTop;



    ctx.strokeStyle =
        COLORS.boxBorder;



    ctx.lineWidth=1;



    ctx.fillRect(

        x,

        y,

        w,

        h

    );



    ctx.strokeRect(

        x,

        y,

        w,

        h

    );





    // Richtung anzeigen

    ctx.strokeStyle="#1976D2";

    ctx.lineWidth=2;



    ctx.beginPath();



    if(rotation===180){


        ctx.moveTo(

            x+w-10,

            y+h/2

        );


        ctx.lineTo(

            x+10,

            y+h/2

        );


    }

    else{


        ctx.moveTo(

            x+10,

            y+h/2

        );


        ctx.lineTo(

            x+w-10,

            y+h/2

        );


    }



    ctx.stroke();



}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 3B
 Isometrische Ansicht
==================================================
*/



// =================================
// Isometrische Ansicht
// =================================


function drawIsometric(

    ctx,

    variant,

    pallet

){


    const scale =
        SETTINGS.iso.scale;



    const startX =
        SETTINGS.iso.startX;



    const startY =
        SETTINGS.iso.startY;





    // Palette zeichnen

    drawIsoPallet(

        ctx,

        startX,

        startY,

        pallet.length * scale,

        pallet.width * scale

    );





    // Kartons sortieren

    const boxes =
        [...variant.boxes];



    boxes.sort((a,b)=>{


        const depthA =
            a.x + a.y + a.z;



        const depthB =
            b.x + b.y + b.z;



        return depthA - depthB;


    });







    boxes.forEach(box=>{



        const pos =
            convertIso(

                box.x,

                box.y,

                box.z

            );





        drawIsoBox(

            ctx,

            pos.x,

            pos.y,

            box.length * scale,

            box.width * scale,

            box.height * scale,

            box.rotation

        );



    });



}







// =================================
// 3D Koordinaten umwandeln
// =================================


function convertIso(

    x,

    y,

    z

){



    const scale =
        SETTINGS.iso.scale;




    return {


        x:

            SETTINGS.iso.startX

            +

            (
                x -
                y
            )
            *
            scale,



        y:

            SETTINGS.iso.startY

            +

            (
                x +
                y
            )
            *
            scale
            *
            0.5

            -

            z *
            scale



    };


}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 3C
 3D Kartons + Palette
==================================================
*/



// =================================
// 3D Karton
// =================================


function drawIsoBox(

    ctx,

    x,

    y,

    l,

    w,

    h,

    rotation

){



    const height =
        h * 0.8;




    // Schatten

    ctx.fillStyle =
        COLORS.shadow;



    ctx.beginPath();


    ctx.moveTo(

        x-w,

        y+w/2+height+8

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+height+8

    );


    ctx.lineTo(

        x+l,

        y+l/2+height+8

    );


    ctx.lineTo(

        x,

        y+height+8

    );


    ctx.closePath();


    ctx.fill();






    // =========================
    // Oberseite
    // =========================


    ctx.fillStyle =
        COLORS.boxTop;


    ctx.strokeStyle =
        COLORS.boxBorder;



    ctx.beginPath();



    ctx.moveTo(

        x,

        y

    );


    ctx.lineTo(

        x+l,

        y+l/2

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2

    );


    ctx.lineTo(

        x-w,

        y+w/2

    );


    ctx.closePath();



    ctx.fill();

    ctx.stroke();







    // =========================
    // Vorderseite
    // =========================


    ctx.fillStyle =
        COLORS.boxFront;



    ctx.beginPath();



    ctx.moveTo(

        x-w,

        y+w/2

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+height

    );


    ctx.lineTo(

        x-w,

        y+w/2+height

    );



    ctx.closePath();



    ctx.fill();

    ctx.stroke();







    // =========================
    // Rechte Seite
    // =========================


    ctx.fillStyle =
        COLORS.boxSide;



    ctx.beginPath();



    ctx.moveTo(

        x+l,

        y+l/2

    );


    ctx.lineTo(

        x+l,

        y+l/2+height

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+height

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2

    );



    ctx.closePath();



    ctx.fill();

    ctx.stroke();







    // =========================
    // Drehung anzeigen
    // =========================


    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth=2;



    ctx.beginPath();



    if(rotation===180){



        ctx.moveTo(

            x+l-20,

            y+15

        );


        ctx.lineTo(

            x+20,

            y+w/2

        );



    }

    else{


        ctx.moveTo(

            x+20,

            y+w/2

        );


        ctx.lineTo(

            x+l-20,

            y+15

        );



    }



    ctx.stroke();



}








// =================================
// 3D Europalette
// =================================


function drawIsoPallet(

    ctx,

    x,

    y,

    l,

    w

){



    const h = 20;




    // Oberseite


    ctx.fillStyle =
        COLORS.palletTop;



    ctx.strokeStyle =
        COLORS.palletDark;



    ctx.beginPath();



    ctx.moveTo(x,y);



    ctx.lineTo(

        x+l,

        y+l/2

    );



    ctx.lineTo(

        x+l-w,

        y+l/2+w/2

    );



    ctx.lineTo(

        x-w,

        y+w/2

    );



    ctx.closePath();



    ctx.fill();

    ctx.stroke();







    // Vorderseite


    ctx.fillStyle =
        COLORS.palletSide;



    ctx.beginPath();



    ctx.moveTo(

        x-w,

        y+w/2

    );



    ctx.lineTo(

        x+l-w,

        y+l/2+w/2

    );



    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+h

    );



    ctx.lineTo(

        x-w,

        y+w/2+h

    );



    ctx.closePath();



    ctx.fill();

    ctx.stroke();







    // Rechte Seite


    ctx.fillStyle =
        COLORS.palletDark;



    ctx.beginPath();



    ctx.moveTo(

        x+l,

        y+l/2

    );



    ctx.lineTo(

        x+l,

        y+l/2+h

    );



    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+h

    );



    ctx.lineTo(

        x+l-w,

        y+l/2+w/2

    );



    ctx.closePath();



    ctx.fill();

    ctx.stroke();



}
