/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 7.0
 Längsseiten-Pfeil
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

            box.width * scale

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
 Karton Darstellung
==================================================
*/



// ======================================
// Karton Draufsicht
// Pfeil folgt längerer Seite
// ======================================


function drawTopBox(

    ctx,

    x,

    y,

    w,

    h

){



    ctx.save();




    // Kartonfläche


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
    // Richtung längere Seite
    // ==================================


    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth = 3;



    ctx.beginPath();





    if(w >= h){



        // Länge horizontal



        const cy =
            y + h / 2;



        ctx.moveTo(

            x + 15,

            cy

        );



        ctx.lineTo(

            x + w - 15,

            cy

        );



        // Pfeilspitze


        ctx.moveTo(

            x+w-15,

            cy

        );


        ctx.lineTo(

            x+w-30,

            cy-8

        );



        ctx.moveTo(

            x+w-15,

            cy

        );


        ctx.lineTo(

            x+w-30,

            cy+8

        );



    }

    else{



        // Länge vertikal



        const cx =
            x + w / 2;



        ctx.moveTo(

            cx,

            y+h-15

        );



        ctx.lineTo(

            cx,

            y+15

        );



        // Pfeilspitze oben



        ctx.moveTo(

            cx,

            y+15

        );


        ctx.lineTo(

            cx-8,

            y+30

        );



        ctx.moveTo(

            cx,

            y+15

        );


        ctx.lineTo(

            cx+8,

            y+30

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


        const da =
            a.x +
            a.y +
            a.z;



        const db =
            b.x +
            b.y +
            b.z;



        return da - db;


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

            box.height * scale

        );



    });



}







// ======================================
// Weltkoordinaten -> ISO
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

    h

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
    // Seite
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





    // Oberfläche


    ctx.fillStyle =
        COLORS.palletTop;



    ctx.strokeStyle =
        COLORS.palletDark;



    ctx.lineWidth = 2;



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







    // Seite


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
    "Canvas Version 7.0 geladen"
);
