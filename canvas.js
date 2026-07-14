/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 2.0
 Rotation Unterstützung
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






// =======================================
// Draufsicht
// =======================================


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






// =======================================
// Palette oben
// =======================================


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






// =======================================
// Karton oben mit 180° Drehung
// =======================================


function drawTopBox(
    ctx,
    x,
    y,
    w,
    h,
    rotation
){


    ctx.save();



    if(rotation === 180){


        ctx.translate(
            x + w/2,
            y + h/2
        );


        ctx.rotate(
            Math.PI
        );


        x = -w/2;

        y = -h/2;


    }
    else{


        x = x;

        y = y;


    }





    ctx.fillStyle =
        COLORS.boxTop;



    ctx.strokeStyle =
        COLORS.boxBorder;



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




    // Richtung

    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth = 2;



    ctx.beginPath();



    ctx.moveTo(

        x + 10,

        y + h/2

    );



    ctx.lineTo(

        x + w - 10,

        y + h/2

    );



    ctx.stroke();



    ctx.restore();


}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 2
 Isometrische Ansicht
==================================================
*/


// =======================================
// Isometrische Darstellung
// =======================================


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


        const depthA =

            a.x +
            a.y +
            a.z;



        const depthB =

            b.x +
            b.y +
            b.z;



        return depthA-depthB;



    });







    boxes.forEach(box=>{



        const point =
            isoConvert(

                box.x,

                box.y,

                box.z

            );





        drawIsoBox(

            ctx,

            point.x,

            point.y,

            box.length * scale,

            box.width * scale,

            box.height * scale,

            box.rotation

        );



    });



}






// =======================================
// Weltkoordinaten -> Isometrie
// =======================================


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
 Teil 3
 3D Karton
==================================================
*/


// =======================================
// 3D Karton zeichnen
// =======================================


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



    // ==========================
    // Schatten
    // ==========================


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







    // ==========================
    // Oberseite
    // ==========================


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







    // ==========================
    // Vorderseite
    // ==========================


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







    // ==========================
    // Rechte Seite
    // ==========================


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







    // ==========================
    // Richtung auf Karton
    // ==========================


    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth = 2;



    ctx.beginPath();




    if(rotation === 180){



        ctx.moveTo(

            x+l-20,

            y+10

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

            y+10

        );



    }



    ctx.stroke();




}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 4
 Palette + Hintergrund
==================================================
*/


// =======================================
// 3D Europalette
// =======================================


function drawIsoPallet(

    ctx,

    x,

    y,

    l,

    w

){


    const height = 20;



    // Schatten

    ctx.fillStyle =
        "rgba(0,0,0,0.15)";



    ctx.beginPath();


    ctx.moveTo(

        x-w,

        y+w/2+height+10

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+height+10

    );


    ctx.lineTo(

        x+l,

        y+l/2+height+10

    );


    ctx.lineTo(

        x,

        y+10

    );


    ctx.closePath();


    ctx.fill();







    // Oberseite

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

        y+l/2+w/2+height

    );



    ctx.lineTo(

        x-w,

        y+w/2+height

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





    // Bretter

    drawPalletLines(

        ctx,

        x,

        y,

        l,

        w

    );



}







// =======================================
// Paletten Bretter
// =======================================


function drawPalletLines(

    ctx,

    x,

    y,

    l,

    w

){



    ctx.strokeStyle =
        "#9C6B38";


    ctx.lineWidth = 2;



    for(
        let i=1;
        i<5;
        i++
    ){


        let offset =
            i*(w/5);



        ctx.beginPath();



        ctx.moveTo(

            x-offset,

            y+offset/2

        );



        ctx.lineTo(

            x+l-offset,

            y+l/2+offset/2

        );



        ctx.stroke();



    }


}







// =======================================
// Hintergrund
// =======================================


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
    "Europal Canvas Version 2.0 geladen"
);
