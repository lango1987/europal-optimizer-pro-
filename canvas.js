/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Version 1.0
==================================================
*/


let canvas;

let ctx;


let currentVariant = null;

let currentPallet = null;


let currentMode = "top";

let currentLayer = 1;







// ======================================
// Canvas starten
// ======================================


function initCanvas(){


    canvas = document.getElementById(
        "canvas"
    );


    ctx = canvas.getContext(
        "2d"
    );


    resizeCanvas();


}









window.addEventListener(

    "resize",

    resizeCanvas

);








function resizeCanvas(){


    if(!canvas){

        return;

    }



    canvas.width =

        canvas.clientWidth;



    canvas.height =

        canvas.clientHeight;



}









// ======================================
// Von app.js aufgerufen
// ======================================


function drawVariant(

    id,

    variant,

    pallet

){



    if(!ctx){

        initCanvas();

    }





    currentVariant = variant;


    currentPallet = pallet;



    draw();



}









// ======================================
// Ansicht ändern
// ======================================


function setView(

    view

){



    currentMode = view;


    draw();



}








function setLayer(

    layer

){



    currentLayer = layer;


    currentMode = "layer";


    draw();



}









// ======================================
// Hauptzeichnung
// ======================================


function draw(){



    if(!currentVariant){

        return;

    }



    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );







    if(currentMode==="top"){



        drawTop();

    }







    if(currentMode==="layer"){



        drawLayer();

    }







    if(currentMode==="3d"){



        draw3D();

    }



}









// ======================================
// Draufsicht
// ======================================


function drawTop(){



    drawPallet2D();



    currentVariant.boxes.forEach(box=>{


        drawBox2D(box);


    });



}









// ======================================
// einzelne Lage
// ======================================


function drawLayer(){



    drawPallet2D();







    currentVariant.boxes

    .filter(box=>{


        return box.layer===currentLayer;


    })

    .forEach(box=>{


        drawBox2D(box);


    });



}









// ======================================
// Palette 2D
// ======================================


function drawPallet2D(){



    const scale =

        getScale();




    ctx.fillStyle="#d0a060";



    ctx.fillRect(



        100,

        80,

        currentPallet.length*scale,

        currentPallet.width*scale



    );



}









// ======================================
// Karton 2D
// ======================================


function drawBox2D(

    box

){



    const scale =

        getScale();





    ctx.fillStyle =

        getColor(box.layer);



    ctx.strokeStyle="#333";







    ctx.fillRect(



        100 +

        box.x*scale,



        80 +

        box.y*scale,



        box.length*scale,



        box.width*scale



    );







    ctx.strokeRect(



        100 +

        box.x*scale,



        80 +

        box.y*scale,



        box.length*scale,



        box.width*scale



    );



}









function getScale(){



    return Math.min(



        500/currentPallet.length,



        500/currentPallet.width



    );



}









// ======================================
// 3D Ansicht
// ======================================


function draw3D(){



    currentVariant.boxes

    .sort((a,b)=>{


        return a.z+b.y-b.z-a.y;


    })

    .forEach(box=>{


        drawBox3D(box);


    });



}









// ======================================
// 3D Karton
// ======================================


function drawBox3D(

    box

){



    const s=0.45;



    const x =

        canvas.width/2

        +

        (box.x-box.y)*s;



    const y =

        350

        +

        (box.x+box.y)*0.25*s

        -

        box.z*0.5*s;







    ctx.fillStyle =

        getColor(box.layer);



    ctx.fillRect(



        x,

        y,

        box.length*s,

        box.width*s/2



    );



}









function getColor(

    layer

){



    const c=[

        "#c89b5b",

        "#e0bb7a"

    ];



    return c[(layer-1)%2];


}
