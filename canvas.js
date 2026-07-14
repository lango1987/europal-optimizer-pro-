/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 6.0
 90 Grad Wechsellagen
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



    drawBackground(ctx);





    if(currentView === "iso"){


        drawIsometric(

            ctx,

            variant,

            pallet

        );


        return;

    }







    if(currentView === "layer1"){


        drawTopView(

            ctx,

            variant,

            pallet,

            1

        );


        return;

    }







    if(currentView === "layer2"){


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








// ======================================
// Draufsicht
// ======================================


function drawTopView(

    ctx,

    variant,

    pallet,

    layer

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

            layer !== 0 &&

            box.layer !== layer

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







// ======================================
// Palette Draufsicht
// ======================================


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



    ctx.lineWidth = 3;



    ctx.strokeRect(

        x,

        y,

        w,

        h

    );


}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 2
 Karton Draufsicht
==================================================
*/


// ======================================
// Karton oben zeichnen
// ======================================


function drawTopBox(

    ctx,

    x,

    y,

    w,

    h,

    rotation

){


    ctx.save();




    ctx.fillStyle =
        COLORS.boxTop;



    ctx.strokeStyle =
        COLORS.boxBorder;



    ctx.lineWidth = 1;



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







    // ==================================
    // Ausrichtung anzeigen
    // ==================================


    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth = 3;



    ctx.beginPath();






    // 90 Grad gedreht

    if(rotation === 90){



        ctx.moveTo(

            x + w/2,

            y + h - 15

        );



        ctx.lineTo(

            x + w/2,

            y + 15

        );





        // Spitze

        ctx.moveTo(

            x+w/2,

            y+15

        );


        ctx.lineTo(

            x+w/2-6,

            y+28

        );



        ctx.moveTo(

            x+w/2,

            y+15

        );


        ctx.lineTo(

            x+w/2+6,

            y+28

        );



    }





    // normale Lage

    else{



        ctx.moveTo(

            x+15,

            y+h/2

        );



        ctx.lineTo(

            x+w-15,

            y+h/2

        );





        // Spitze

        ctx.moveTo(

            x+w-15,

            y+h/2

        );


        ctx.lineTo(

            x+w-28,

            y+h/2-6

        );



        ctx.moveTo(

            x+w-15,

            y+h/2

        );


        ctx.lineTo(

            x+w-28,

            y+h/2+6

        );



    }



    ctx.stroke();



    ctx.restore();



}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 3
 Isometrische Ansicht
==================================================
*/



// ======================================
// Isometrische Ansicht
// ======================================


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






    // Palette zuerst

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


        return (

            a.x +
            a.y +
            a.z

        )

        -

        (

            b.x +
            b.y +
            b.z

        );


    });








    boxes.forEach(box=>{



        const pos =
            isoConvert(

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








// ======================================
// Koordinaten umwandeln
// ======================================


function isoConvert(

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
 Teil 4
 3D Karton + Palette
==================================================
*/


// ======================================
// 3D Karton
// ======================================


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

        y+w/2+height

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+height

    );


    ctx.lineTo(

        x+l,

        y+l/2+height

    );


    ctx.lineTo(

        x,

        y+height

    );


    ctx.closePath();



    ctx.fill();







    // Oberseite

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








    // Vorderseite

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







    // Seite

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








    // Richtung anzeigen

    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth = 2;



    ctx.beginPath();





    if(rotation === 90){


        ctx.moveTo(

            x+l/2,

            y+10

        );


        ctx.lineTo(

            x+l/2,

            y+w/2

        );


    }

    else{


        ctx.moveTo(

            x+15,

            y+w/2

        );


        ctx.lineTo(

            x+l-15,

            y+10

        );


    }



    ctx.stroke();



}









// ======================================
// 3D Palette
// ======================================


function drawIsoPallet(

    ctx,

    x,

    y,

    l,

    w

){



    const h = 20;




    ctx.fillStyle =
        COLORS.palletTop;



    ctx.strokeStyle =
        COLORS.palletDark;



    ctx.lineWidth = 2;




    // Oberfläche


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








// ======================================
// Hintergrund
// ======================================


function drawBackground(ctx){


    ctx.fillStyle =
        COLORS.background;



    ctx.fillRect(

        0,

        0,

        ctx.canvas.width,

        ctx.canvas.height

    );


}



console.log(
    "Canvas Version 6.0 geladen"
);
