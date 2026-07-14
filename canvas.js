/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 9.0
 Wechsellage 90 Grad
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





        case "iso":


            drawIsometric(

                ctx,

                variant,

                pallet

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









// ======================================
// Draufsicht
// ======================================


function drawTopView(

    ctx,

    variant,

    pallet,

    layer

){



    const margin = 50;



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

            layer !== 0

            &&

            box.layer !== layer

        ){

            return;

        }







        drawTopBox(

            ctx,

            margin +

            box.x * scale,



            margin +

            box.y * scale,



            box.length * scale,



            box.width * scale

        );



    });



}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 2
 Karton + Palette Draufsicht
==================================================
*/



// ======================================
// Palette oben
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









// ======================================
// Karton oben
// Pfeil zeigt längere Seite
// ======================================


function drawTopBox(

    ctx,

    x,

    y,

    w,

    h

){



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









    // ===============================
    // Richtung lange Seite
    // ===============================


    ctx.strokeStyle =
        "#1976D2";



    ctx.lineWidth = 3;



    ctx.beginPath();







    if(w >= h){



        // horizontal



        const cy =
            y + h / 2;



        ctx.moveTo(

            x + 10,

            cy

        );



        ctx.lineTo(

            x + w - 10,

            cy

        );






        // Spitze


        ctx.moveTo(

            x+w-10,

            cy

        );



        ctx.lineTo(

            x+w-25,

            cy-8

        );




        ctx.moveTo(

            x+w-10,

            cy

        );



        ctx.lineTo(

            x+w-25,

            cy+8

        );



    }

    else{



        // vertikal



        const cx =
            x + w / 2;



        ctx.moveTo(

            cx,

            y+h-10

        );



        ctx.lineTo(

            cx,

            y+10

        );







        // Spitze oben



        ctx.moveTo(

            cx,

            y+10

        );



        ctx.lineTo(

            cx-8,

            y+25

        );





        ctx.moveTo(

            cx,

            y+10

        );



        ctx.lineTo(

            cx+8,

            y+25

        );



    }




    ctx.stroke();



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
// Isometrische Darstellung
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
 3D Karton
==================================================
*/


// ======================================
// 3D Karton zeichnen
// ======================================


function drawIsoBox(

    ctx,

    x,

    y,

    length,

    width,

    height,

    rotation

){



    let l = length;

    let w = width;



    // ===============================
    // 90 Grad Lage
    // ===============================


    if(rotation === 90){


        l = width;

        w = length;


    }





    const h =
        height * 0.8;






    // ===============================
    // Schatten
    // ===============================


    ctx.fillStyle =
        COLORS.shadow;



    ctx.beginPath();



    ctx.moveTo(

        x-w,

        y+w/2+h+8

    );



    ctx.lineTo(

        x+l-w,

        y+l/2+w/2+h+8

    );



    ctx.lineTo(

        x+l,

        y+l/2+h+8

    );



    ctx.lineTo(

        x,

        y+h+8

    );



    ctx.closePath();



    ctx.fill();









    // ===============================
    // Oberseite
    // ===============================


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








    // ===============================
    // Vorderseite
    // ===============================


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








    // ===============================
    // Rechte Seite
    // ===============================


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







    // ===============================
    // Richtung der langen Seite
    // ===============================


    ctx.strokeStyle =
        "#1976D2";


    ctx.lineWidth = 2;



    ctx.beginPath();





    if(l >= w){



        ctx.moveTo(

            x+10,

            y+w/2

        );



        ctx.lineTo(

            x+l-10,

            y+10

        );



    }

    else{



        ctx.moveTo(

            x-w/2,

            y+10

        );



        ctx.lineTo(

            x-w/2,

            y+w-10

        );



    }





    ctx.stroke();



}
/*
==================================================
 Europal Optimizer Pro
 Canvas
 Teil 5
 Palette + Abschluss
==================================================
*/



// ======================================
// 3D Palette
// ======================================


function drawIsoPallet(

    ctx,

    x,

    y,

    length,

    width

){


    const h = 20;





    // Schatten


    ctx.fillStyle =
        COLORS.shadow;



    ctx.beginPath();



    ctx.moveTo(

        x-width,

        y+width/2+h+10

    );



    ctx.lineTo(

        x+length-width,

        y+length/2+width/2+h+10

    );



    ctx.lineTo(

        x+length,

        y+length/2+h+10

    );



    ctx.lineTo(

        x,

        y+h+10

    );



    ctx.closePath();



    ctx.fill();









    // ===============================
    // Oberseite
    // ===============================


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

        x+length,

        y+length/2

    );



    ctx.lineTo(

        x+length-width,

        y+length/2+width/2

    );



    ctx.lineTo(

        x-width,

        y+width/2

    );



    ctx.closePath();



    ctx.fill();

    ctx.stroke();









    // ===============================
    // Vorderseite
    // ===============================


    ctx.fillStyle =
        COLORS.palletSide;



    ctx.beginPath();



    ctx.moveTo(

        x-width,

        y+width/2

    );



    ctx.lineTo(

        x+length-width,

        y+length/2+width/2

    );



    ctx.lineTo(

        x+length-width,

        y+length/2+width/2+h

    );



    ctx.lineTo(

        x-width,

        y+width/2+h

    );



    ctx.closePath();



    ctx.fill();

    ctx.stroke();









    // ===============================
    // Rechte Seite
    // ===============================


    ctx.fillStyle =
        COLORS.palletDark;



    ctx.beginPath();



    ctx.moveTo(

        x+length,

        y+length/2

    );



    ctx.lineTo(

        x+length,

        y+length/2+h

    );



    ctx.lineTo(

        x+length-width,

        y+length/2+width/2+h

    );



    ctx.lineTo(

        x+length-width,

        y+length/2+width/2

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
    "Europal Canvas Version 9.0 geladen"
);
