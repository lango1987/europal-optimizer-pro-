/*
=========================================
 Europal Optimizer Pro
 Canvas
 Version 2.0
=========================================
*/
const ISO = {

    angle: 30,

    scale: 0.18,

    startX: 260,

    startY: 430,

    palletHeight: 28

};


// ================================
// Einstieg
// ================================

function drawVariant(canvasId, variant, pallet){

    const canvas = document.getElementById(canvasId);

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
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

    drawTopView(
        ctx,
        variant,
        pallet
    );

}
// =====================================
// Draufsicht
// =====================================

function drawTopView(ctx,variant,pallet){

    const margin=30;

    const scale=Math.min(

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

    for(let row=0;row<variant.rows;row++){

        for(let col=0;col<variant.cols;col++){

            const x=

                margin+

                col*variant.boxLength*scale;

            const y=

                margin+

                row*variant.boxWidth*scale;

            drawTopBox(

                ctx,

                x,

                y,

                variant.boxLength*scale,

                variant.boxWidth*scale

            );

        }

    }

}
// =====================================
// Platzhalter
// =====================================

function drawTopPallet(){

}

function drawTopBox(){

}

function drawIsometric(){

}
