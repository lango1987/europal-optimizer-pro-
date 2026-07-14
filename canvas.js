/*
=========================================
 Europal Optimizer Pro
 Canvas
 Version 2.0
=========================================
*/

function drawVariant(canvasId, variant, pallet) {

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const margin = 20;

    const scale = Math.min(
        (canvas.width - margin * 2) / pallet.length,
        (canvas.height - margin * 2) / pallet.width
    );

    // Palette zeichnen
    drawPalletTop(
        ctx,
        margin,
        margin,
        pallet.length * scale,
        pallet.width * scale
    );

    // Kartons zeichnen
    for (let row = 0; row < variant.rows; row++) {

        for (let col = 0; col < variant.cols; col++) {

            const x = margin + col * variant.boxLength * scale;
            const y = margin + row * variant.boxWidth * scale;

            drawTopBox(
                ctx,
                x,
                y,
                variant.boxLength * scale,
                variant.boxWidth * scale
            );

        }

    }

}


/* =========================================
   Palette Draufsicht
========================================= */

function drawPalletTop(ctx,x,y,w,h){

    ctx.fillStyle="#EFE8D8";

    ctx.fillRect(x,y,w,h);

    ctx.strokeStyle="#8A6A43";

    ctx.lineWidth=3;

    ctx.strokeRect(x,y,w,h);

}


/* =========================================
   Karton Draufsicht
========================================= */

function drawTopBox(ctx,x,y,w,h){

    ctx.fillStyle="#7BC96F";

    ctx.strokeStyle="#2E7D32";

    ctx.lineWidth=1;

    ctx.fillRect(
        x+1,
        y+1,
        w-2,
        h-2
    );

    ctx.strokeRect(
        x+1,
        y+1,
        w-2,
        h-2
    );

}


/* =========================================
   Isometrische Ansicht
========================================= */

function drawIsometric(canvasId,variant,pallet){

    const canvas=document.getElementById(canvasId);

    const ctx=canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const startX=250;

    const startY=420;

    const scale=.18;

    // Palette

    drawIsoPallet(
        ctx,
        startX,
        startY,
        pallet.length*scale,
        pallet.width*scale
    );

    // Kartons

    for(let layer=0;layer<variant.layers;layer++){

        for(let row=0;row<variant.rows;row++){

            for(let col=0;col<variant.cols;col++){

                const x=
                    startX+
                    (col*variant.boxLength*scale)-
                    (row*variant.boxWidth*scale);

                const y=
                    startY+
                    (col*variant.boxLength*scale)/2+
                    (row*variant.boxWidth*scale)/2-
                    (layer*variant.boxHeight*scale);

                drawIsoBox(
                    ctx,
                    x,
                    y,
                    variant.boxLength*scale,
                    variant.boxWidth*scale,
                    variant.boxHeight*scale
                );

            }

        }

    }

}


/* =========================================
   Palette Isometrisch
========================================= */

function drawIsoPallet(ctx,x,y,l,w){

    ctx.strokeStyle="#6D4C41";

    ctx.fillStyle="#C8A165";

    ctx.beginPath();

    ctx.moveTo(x,y);

    ctx.lineTo(x+l,y+l/2);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.lineTo(x-w,y+w/2);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

}


/* =========================================
   Karton Isometrisch
========================================= */

function drawIsoBox(ctx,x,y,l,w,h){

    // Oberseite

    ctx.fillStyle="#A5D6A7";

    ctx.beginPath();

    ctx.moveTo(x,y);

    ctx.lineTo(x+l,y+l/2);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.lineTo(x-w,y+w/2);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

    // Vorderseite

    ctx.fillStyle="#66BB6A";

    ctx.beginPath();

    ctx.moveTo(x-w,y+w/2);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.lineTo(x+l-w,y+l/2+w/2+h);

    ctx.lineTo(x-w,y+w/2+h);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

    // Seite

    ctx.fillStyle="#43A047";

    ctx.beginPath();

    ctx.moveTo(x+l,y+l/2);

    ctx.lineTo(x+l,y+l/2+h);

    ctx.lineTo(x+l-w,y+l/2+w/2+h);

    ctx.lineTo(x+l-w,y+l/2+w/2);

    ctx.closePath();

    ctx.fill();

    ctx.stroke();

}
