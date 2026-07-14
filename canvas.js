/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 4.0
 180 Grad Wechsellagen
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



    switch(currentView){


        case "iso":


            drawIsometric(

                ctx,

                variant,

                pallet

            );


        break;



        case "layer1":


            drawTopView(

                ctx,

                variant,

                pallet,

                1

            );


        break;



        case "layer2":


            drawTopView(

                ctx,

                variant,

                pallet,

                2

            );


        break;



        default:


            drawTopView(

                ctx,

                variant,

                pallet,

                0

            );

    }


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


        if(layer !== 0){


            if(box.layer !== layer){


                return;


            }


        }




        drawTopBox(


            ctx,


            margin +
            box.x * scale,


            margin +
            box.y * scale,


            box.length * scale,


            box.width * scale,


            box.rotation



        );


    });



}





// =======================================
// Karton Draufsicht
// =======================================


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



    // Richtung anzeigen

    ctx.strokeStyle="#1976D2";



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
// =======================================
// Isometrische Ansicht
// =======================================


function drawIsometric(

    ctx,

    variant,

    pallet

){


    const startX =
        SETTINGS.iso.startX;


    const startY =
        SETTINGS.iso.startY;


    const scale =
        SETTINGS.iso.scale;



    // Palette

    drawIsoPallet(

        ctx,

        startX,

        startY,

        pallet.length * scale,

        pallet.width * scale

    );




    // Kartons sortieren
    // hinten zuerst zeichnen


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



        const point =

            isoPoint(

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
// 3D Koordinaten umrechnen
// =======================================


function isoPoint(

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

            x * scale

            -

            y * scale,



        y:

            SETTINGS.iso.startY

            +

            (
                x * scale / 2
            )

            +

            (
                y * scale / 2
            )

            -

            (
                z * scale
            )


    };



}
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


    // Schatten

    ctx.fillStyle =
        COLORS.shadow;



    ctx.beginPath();


    ctx.moveTo(

        x-w+5,

        y+w/2+h+5

    );


    ctx.lineTo(

        x+l-w+5,

        y+l/2+w/2+h+5

    );


    ctx.lineTo(

        x+l+5,

        y+l/2+h+5

    );


    ctx.lineTo(

        x+5,

        y+h+5

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

        y+l/2+w/2+h

    );


    ctx.lineTo(

        x-w,

        y+w/2+h

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






    // =========================
    // Klebeband
    // =========================


    ctx.strokeStyle =
        "#8d7658";


    ctx.lineWidth = 1;



    ctx.beginPath();



    if(rotation===180){


        // gedrehte Lage

        ctx.moveTo(

            x+l/2,

            y+l/4

        );


        ctx.lineTo(

            x+l/2-w,

            y+l/4+w/2

        );


    }

    else{


        // normale Lage


        ctx.moveTo(

            x-w/2,

            y+w/4

        );


        ctx.lineTo(

            x+l-w/2,

            y+l/2+w/4

        );


    }



    ctx.stroke();





    // Richtungspfeil

    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth = 2;



    ctx.beginPath();



    if(rotation===180){


        ctx.moveTo(

            x+l-20,

            y+l/2

        );


        ctx.lineTo(

            x+20,

            y+10

        );


    }

    else{


        ctx.moveTo(

            x+20,

            y+10

        );


        ctx.lineTo(

            x+l-20,

            y+l/2

        );


    }



    ctx.stroke();



}
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


    const h = 25;



    // Schatten unter Palette

    ctx.fillStyle =
        "rgba(0,0,0,0.18)";



    ctx.beginPath();



    ctx.moveTo(

        x-w,

        y+w/2+h+10

    );


    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+h+10

    );


    ctx.lineTo(

        x+l,

        y+l/2+h+10

    );


    ctx.lineTo(

        x,

        y+10

    );


    ctx.closePath();

    ctx.fill();





    // =========================
    // Palettenoberseite
    // =========================


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






    // =========================
    // Vorderseite Palette
    // =========================


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






    // =========================
    // Rechte Seite
    // =========================


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






    // Bretter

    drawPalletBoards(

        ctx,

        x,

        y,

        l,

        w

    );



    // Klötze

    drawPalletBlocks(

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


function drawPalletBoards(

    ctx,

    x,

    y,

    l,

    w

){


    ctx.strokeStyle =
        "#A97943";


    ctx.lineWidth = 2;



    for(let i=1;i<5;i++){


        const offset =
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
// Palettenklötze
// =======================================


function drawPalletBlocks(

    ctx,

    x,

    y,

    l,

    w

){


    ctx.fillStyle =
        COLORS.palletDark;



    const positions=[


        [0.1,0.1],

        [0.45,0.1],

        [0.8,0.1],


        [0.1,0.7],

        [0.45,0.7],

        [0.8,0.7]


    ];



    positions.forEach(p=>{


        ctx.fillRect(


            x+l*p[0],


            y+w*p[1],


            18,

            12


        );


    });


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
