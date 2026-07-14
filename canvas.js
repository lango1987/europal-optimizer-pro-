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
/* ===========================================
   Isometrischer Karton
=========================================== */
function drawIsoBox(
    ctx,
    x,
    y,
    l,
    w,
    h,
    rotation
){

    const depth = h * 0.15;


    // ----------------------------
    // Schatten
    // ----------------------------

    ctx.fillStyle = COLORS.shadow;

    ctx.beginPath();

    ctx.moveTo(
        x - w + 8,
        y + w/2 + h + 8
    );

    ctx.lineTo(
        x + l - w + 8,
        y + l/2 + w/2 + h + 8
    );

    ctx.lineTo(
        x + l + 8,
        y + l/2 + h + 8
    );

    ctx.lineTo(
        x + 8,
        y + h + 8
    );

    ctx.closePath();

    ctx.fill();



    // ----------------------------
    // Oberseite
    // ----------------------------

    ctx.fillStyle = COLORS.boxTop;

    ctx.strokeStyle = COLORS.boxBorder;

    ctx.lineWidth = 1.5;


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



    // ----------------------------
    // Linke Vorderseite
    // ----------------------------

    ctx.fillStyle = COLORS.boxFront;


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



    // ----------------------------
    // Rechte Seite
    // ----------------------------

    ctx.fillStyle = COLORS.boxSide;


    ctx.beginPath();

    ctx.moveTo(
        x+l,
        y+l/2
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
        x+l,
        y+l/2+h
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();



    // ----------------------------
    // Kartonband
    // ----------------------------

    ctx.strokeStyle="#8B7355";

    ctx.lineWidth=1;


    ctx.beginPath();


    ctx.moveTo(
        x-w/2,
        y+w/4
    );

    ctx.lineTo(
        x+l-w/2,
        y+l/2+w/4
    );


    ctx.stroke();



    // ----------------------------
    // Drehung anzeigen
    // ----------------------------

    if(rotation===90){

        ctx.strokeStyle="#1976D2";

        ctx.lineWidth=2;


        ctx.beginPath();

        ctx.moveTo(
            x,
            y+5
        );

        ctx.lineTo(
            x+l,
            y+l/2+5
        );

        ctx.stroke();

    }

}


    // Schatten

    ctx.fillStyle = COLORS.shadow;

    ctx.beginPath();

    ctx.moveTo(x-w+4,y+w/2+h+4);

    ctx.lineTo(x+l-w+4,y+l/2+w/2+h+4);

    ctx.lineTo(x+l+4,y+l/2+h+4);

    ctx.lineTo(x+4,y+h+4);

    ctx.closePath();

    ctx.fill();


    // ===========================
    // Oberseite
    // ===========================

    ctx.fillStyle = COLORS.boxTop;

    ctx.strokeStyle = COLORS.boxBorder;

    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(x,y);

    ctx.lineTo(x+l,y+l/2);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.lineTo(x-w,y+w/2);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // ===========================
    // Vorderseite
    // ===========================

    ctx.fillStyle = COLORS.boxFront;

    ctx.beginPath();

    ctx.moveTo(x-w,y+w/2);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.lineTo(x+l-w,y+l/2+w/2+h);

    ctx.lineTo(x-w,y+w/2+h);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // ===========================
    // Rechte Seite
    // ===========================

    ctx.fillStyle = COLORS.boxSide;

    ctx.beginPath();

    ctx.moveTo(x+l,y+l/2);

    ctx.lineTo(x+l,y+l/2+h);

    ctx.lineTo(x+l-w,y+l/2+w/2+h);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // ===========================
    // Klebeband oben
    // ===========================

    ctx.strokeStyle="#9A8765";

    ctx.lineWidth=1;

    ctx.beginPath();

    ctx.moveTo(
        x-w/2,
        y+w/4
    );

    ctx.lineTo(
        x+l-w/2,
        y+l/2+w/4
    );

    ctx.moveTo(
        x+l/2,
        y+l/4
    );

    ctx.lineTo(
        x+l/2-w,
        y+l/4+w/2
    );

    ctx.stroke();


    // ===========================
    // Drehung markieren
    // ===========================

    if(rotation===90){

        ctx.strokeStyle="#d32f2f";

        ctx.beginPath();

        ctx.moveTo(
            x-w/2,
            y+w/4
        );

        ctx.lineTo(
            x+l/2,
            y+l/4
        );

        ctx.stroke();

    }

}
/* ===========================================
   Hilfsfunktionen
=========================================== */

function drawDirectionArrow(ctx, x, y, w, h, rotation) {

    ctx.save();

    ctx.strokeStyle = "#1E88E5";
    ctx.fillStyle = "#1E88E5";
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    if (rotation === 90) {

        const cx = x + w / 2;

        ctx.moveTo(cx, y + 6);
        ctx.lineTo(cx, y + h - 10);

        ctx.lineTo(cx - 4, y + h - 16);

        ctx.moveTo(cx, y + h - 10);

        ctx.lineTo(cx + 4, y + h - 16);

    } else {

        const cy = y + h / 2;

        ctx.moveTo(x + 6, cy);
        ctx.lineTo(x + w - 10, cy);

        ctx.lineTo(x + w - 16, cy - 4);

        ctx.moveTo(x + w - 10, cy);

        ctx.lineTo(x + w - 16, cy + 4);

    }

    ctx.stroke();

    ctx.restore();

}


/* ===========================================
   Kartonnummer
=========================================== */

function drawBoxNumber(ctx, x, y, number) {

    ctx.save();

    ctx.fillStyle = "#37474F";

    ctx.font = "11px Inter";

    ctx.textAlign = "center";

    ctx.fillText(

        number,

        x,

        y

    );

    ctx.restore();

}


/* ===========================================
   Maßlinie
=========================================== */

function drawDimension(ctx, x1, y1, x2, y2, text) {

    ctx.save();

    ctx.strokeStyle = "#616161";

    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.stroke();

    ctx.fillStyle = "#424242";

    ctx.font = "12px Inter";

    ctx.textAlign = "center";

    ctx.fillText(

        text,

        (x1 + x2) / 2,

        (y1 + y2) / 2 - 6

    );

    ctx.restore();

}


/* ===========================================
   Raster
=========================================== */

function drawGrid(ctx) {

    const size = 25;

    ctx.save();

    ctx.strokeStyle = "#ECEFF1";

    ctx.lineWidth = 1;

    for (let x = 0; x < ctx.canvas.width; x += size) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, ctx.canvas.height);

        ctx.stroke();

    }

    for (let y = 0; y < ctx.canvas.height; y += size) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(ctx.canvas.width, y);

        ctx.stroke();

    }

    ctx.restore();

}
/* ===========================================
   Europalette Details
=========================================== */

function drawPalletBlocks(ctx,x,y,l,w){

    const blockColor="#8D633B";

    const blockWidth=18;

    const blockHeight=12;

    const rows=[0.12,0.48,0.84];

    const cols=[0.10,0.45,0.80];

    ctx.fillStyle=blockColor;

    rows.forEach(r=>{

        cols.forEach(c=>{

            ctx.fillRect(

                x+l*c,

                y+w*r,

                blockWidth,

                blockHeight

            );

        });

    });

}


/* ===========================================
   Palette Bretter
=========================================== */

function drawPalletBoards(ctx,x,y,l,w){

    ctx.strokeStyle="#B8894D";

    ctx.lineWidth=2;

    const boards=5;

    const step=w/boards;

    for(let i=1;i<boards;i++){

        ctx.beginPath();

        ctx.moveTo(
            x,
            y+i*step
        );

        ctx.lineTo(
            x+l,
            y+i*step
        );

        ctx.stroke();

    }

}


/* ===========================================
   Canvas Hintergrund
=========================================== */

function drawBackground(ctx){

    const g=ctx.createLinearGradient(

        0,

        0,

        0,

        ctx.canvas.height

    );

    g.addColorStop(

        0,

        "#ffffff"

    );

    g.addColorStop(

        1,

        "#eef3f8"

    );

    ctx.fillStyle=g;

    ctx.fillRect(

        0,

        0,

        ctx.canvas.width,

        ctx.canvas.height

    );

}


/* ===========================================
   Titel
=========================================== */

function drawTitle(ctx,text){

    ctx.save();

    ctx.fillStyle="#37474F";

    ctx.font="bold 22px Inter";

    ctx.fillText(

        text,

        35,

        35

    );

    ctx.restore();

}


/* ===========================================
   Legende
=========================================== */

function drawLegend(ctx){

    ctx.save();

    const x=20;

    let y=60;

    ctx.font="13px Inter";

    ctx.fillStyle="#37474F";

    ctx.fillText("Legende",x,y);

    y+=20;

    ctx.fillStyle=COLORS.boxTop;

    ctx.fillRect(x,y,16,16);

    ctx.strokeRect(x,y,16,16);

    ctx.fillStyle="#37474F";

    ctx.fillText("Karton",x+24,y+13);

    y+=24;

    ctx.fillStyle=COLORS.palletTop;

    ctx.fillRect(x,y,16,16);

    ctx.strokeRect(x,y,16,16);

    ctx.fillStyle="#37474F";

    ctx.fillText("Palette",x+24,y+13);

    ctx.restore();

}


/* ===========================================
   Ende Canvas Engine
=========================================== */

console.log(

    "Canvas Engine Version 3.0 geladen"

);
