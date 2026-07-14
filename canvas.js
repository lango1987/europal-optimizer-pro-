/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 3.0
==================================================
*/

function drawVariant(canvasId, variant, pallet) {

    const canvas = document.getElementById(canvasId);

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Hintergrund

    ctx.fillStyle = COLORS.background;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    switch (currentView) {

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


/* ===========================================
   Draufsicht
=========================================== */

function drawTopView(
    ctx,
    variant,
    pallet,
    layer
){

    const margin = SETTINGS.canvas.margin;

    const scale = Math.min(

        (ctx.canvas.width-margin*2)/pallet.length,

        (ctx.canvas.height-margin*2)/pallet.width

    );

    drawTopPallet(

        ctx,

        margin,

        margin,

        pallet.length*scale,

        pallet.width*scale

    );

    variant.boxes.forEach(box=>{

        if(layer!==0){

            if(box.layer!==layer){

                return;

            }

        }

        drawTopBox(

            ctx,

            margin + box.x*scale,

            margin + box.y*scale,

            box.length*scale,

            box.width*scale,

            box.rotation

        );

    });

}


/* ===========================================
   Palette oben
=========================================== */

function drawTopPallet(
    ctx,
    x,
    y,
    w,
    h
){

    ctx.fillStyle = COLORS.palletTop;

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

    ctx.lineWidth = 3;

    ctx.strokeStyle = COLORS.palletDark;

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    // Bretter

    ctx.strokeStyle = COLORS.palletSide;

    ctx.lineWidth = 2;

    const boardHeight = h/5;

    for(let i=1;i<5;i++){

        ctx.beginPath();

        ctx.moveTo(
            x,
            y+i*boardHeight
        );

        ctx.lineTo(
            x+w,
            y+i*boardHeight
        );

        ctx.stroke();

    }

}


/* ===========================================
   Karton oben
=========================================== */

function drawTopBox(
    ctx,
    x,
    y,
    w,
    h,
    rotation
){

    ctx.fillStyle = COLORS.shadow;

    ctx.fillRect(
        x+3,
        y+3,
        w,
        h
    );

    ctx.fillStyle = COLORS.boxTop;

    ctx.fillRect(
        x,
        y,
        w,
        h
    );

    ctx.strokeStyle = COLORS.boxBorder;

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    ctx.beginPath();

    ctx.moveTo(
        x+w/2,
        y
    );

    ctx.lineTo(
        x+w/2,
        y+h
    );

    ctx.moveTo(
        x,
        y+h/2
    );

    ctx.lineTo(
        x+w,
        y+h/2
    );

    ctx.stroke();

    if(rotation===90){

        ctx.strokeStyle="#c0392b";

        ctx.beginPath();

        ctx.moveTo(
            x,
            y
        );

        ctx.lineTo(
            x+w,
            y+h
        );

        ctx.stroke();

    }

}
/* ===========================================
   Isometrische Ansicht
=========================================== */

function drawIsometric(
    ctx,
    variant,
    pallet
){

    const startX = SETTINGS.iso.startX;

    const startY = SETTINGS.iso.startY;

    const scale = SETTINGS.iso.scale;

    drawIsoPallet(

        ctx,

        startX,

        startY,

        pallet.length * scale,

        pallet.width * scale

    );

    // Kartons nach hinten sortieren

    const boxes = [...variant.boxes];

    boxes.sort((a,b)=>{

        if((a.x+a.y)!==(b.x+b.y)){

            return (a.x+a.y)-(b.x+b.y);

        }

        return a.z-b.z;

    });

    boxes.forEach(box=>{

        const sx =

            startX +

            box.x*scale -

            box.y*scale;

        const sy =

            startY +

            box.x*scale/2 +

            box.y*scale/2 -

            box.z*scale;

        drawIsoBox(

            ctx,

            sx,

            sy,

            box.length*scale,

            box.width*scale,

            box.height*scale,

            box.rotation

        );

    });

}


/* ===========================================
   Europalette Isometrisch
=========================================== */

function drawIsoPallet(
    ctx,
    x,
    y,
    l,
    w
){

    const h = 20;

    // Oberseite

    ctx.fillStyle = COLORS.palletTop;

    ctx.strokeStyle = COLORS.palletDark;

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(x,y);

    ctx.lineTo(x+l,y+l/2);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.lineTo(x-w,y+w/2);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

    // Vorderseite

    ctx.fillStyle = COLORS.palletSide;

    ctx.beginPath();

    ctx.moveTo(x-w,y+w/2);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.lineTo(x+l-w,y+l/2+w/2+h);

    ctx.lineTo(x-w,y+w/2+h);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

    // Rechte Seite

    ctx.fillStyle = COLORS.palletDark;

    ctx.beginPath();

    ctx.moveTo(x+l,y+l/2);

    ctx.lineTo(x+l,y+l/2+h);

    ctx.lineTo(x+l-w,y+l/2+w/2+h);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

}
