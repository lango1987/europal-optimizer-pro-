/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Version 30.0
 Neue 2D + 3D Darstellung
==================================================
*/


let canvas;

let ctx;


let currentView = "top";


let currentLayer = 0;


let currentResult = null;






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


    drawCanvas();


}







// ======================================
// Optimierer Ergebnis setzen
// ======================================


function setCanvasResult(result){


    currentResult = result;


    currentLayer = 0;


    drawCanvas();


}







// ======================================
// Ansicht wechseln
// ======================================


function changeView(view){


    currentView = view;


    drawCanvas();


}







// ======================================
// Lage auswählen
// ======================================


function changeLayer(layer){


    currentLayer = layer;


    currentView = "layer";


    drawCanvas();


}







// ======================================
// Hauptzeichnung
// ======================================


function drawCanvas(){



    if(!ctx || !currentResult){

        return;

    }



    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );






    if(currentView==="top"){


        drawTopView();


    }



    if(currentView==="layer"){


        drawLayerView();


    }



    if(currentView==="3d"){


        draw3DView();


    }


}
/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Teil 2
 2D Darstellung
==================================================
*/



// ======================================
// Draufsicht
// ======================================


function drawTopView(){



    const boxes =

        currentResult.boxes;





    drawPallet2D();





    boxes.forEach(box=>{



        drawBox2D(

            box,

            false

        );



    });



}









// ======================================
// Einzelne Lage
// ======================================


function drawLayerView(){



    drawPallet2D();







    currentResult.boxes

    .filter(box=>{



        return (

            box.layer ===

            currentLayer

        );



    })

    .forEach(box=>{



        drawBox2D(

            box,

            true

        );



    });



}









// ======================================
// Palette 2D
// ======================================


function drawPallet2D(){



    const pallet =

        currentResult.pallet ||

        {

            length:1200,

            width:800

        };







    const scale =

        Math.min(

            canvas.width /

            pallet.length,



            canvas.height /

            pallet.width

        )

        *

        0.75;







    const offsetX =

        (

            canvas.width -

            pallet.length *

            scale

        )

        /2;







    const offsetY =

        (

            canvas.height -

            pallet.width *

            scale

        )

        /2;








    ctx.save();







    ctx.fillStyle =

        "#d6b27c";







    ctx.fillRect(



        offsetX,

        offsetY,



        pallet.length *

        scale,



        pallet.width *

        scale



    );







    ctx.strokeStyle =

        "#795548";







    ctx.strokeRect(



        offsetX,

        offsetY,



        pallet.length *

        scale,



        pallet.width *

        scale



    );







    ctx.restore();



}









// ======================================
// Karton 2D
// ======================================


function drawBox2D(

    box,

    showLayer

){



    const pallet =

        currentResult.pallet ||

        {

            length:1200,

            width:800

        };







    const scale =

        Math.min(

            canvas.width /

            pallet.length,



            canvas.height /

            pallet.width

        )

        *

        0.75;







    const offsetX =

        (

            canvas.width -

            pallet.length *

            scale

        )

        /2;







    const offsetY =

        (

            canvas.height -

            pallet.width *

            scale

        )

        /2;







    ctx.save();







    ctx.translate(



        offsetX +

        box.x *

        scale,



        offsetY +

        box.y *

        scale



    );







    ctx.fillStyle =

        "#c9a66b";







    ctx.strokeStyle =

        "#5d4037";








    ctx.fillRect(



        0,

        0,



        box.length *

        scale,



        box.width *

        scale



    );







    ctx.strokeRect(



        0,

        0,



        box.length *

        scale,



        box.width *

        scale



    );







    // Richtungspfeil


    drawDirectionArrow(

        box,

        scale

    );







    ctx.restore();



}
/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Teil 3
 3D Projektion
==================================================
*/



// ======================================
// 3D Ansicht
// ======================================


function draw3DView(){



    const boxes =

        currentResult.boxes;







    drawPallet3D();







    // hintere Kartons zuerst zeichnen


    boxes.sort((a,b)=>{



        return (

            a.z +

            a.y

        )

        -

        (

            b.z +

            b.y

        );



    });







    boxes.forEach(box=>{



        drawBox3D(

            box

        );



    });



}









// ======================================
// 3D Projektion
// ======================================


function project3D(

    x,

    y,

    z

){



    const scale = 0.55;







    const isoX =



        (

            x -

            y

        )

        *

        scale;







    const isoY =



        (

            x +

            y

        )

        *

        0.25

        -

        z *

        0.65;








    return {



        x:

        canvas.width/2 +

        isoX,



        y:

        canvas.height*0.75 +

        isoY



    };



}









// ======================================
// Palette 3D Boden
// ======================================


function drawPallet3D(){



    const pallet =

        currentResult.pallet ||

        {

            length:1200,

            width:800,

            height:150

        };








    const p1 =

        project3D(

            0,

            0,

            0

        );







    const p2 =

        project3D(

            pallet.length,

            0,

            0

        );







    const p3 =

        project3D(

            pallet.length,

            pallet.width,

            0

        );







    const p4 =

        project3D(

            0,

            pallet.width,

            0

        );







    ctx.save();







    ctx.fillStyle =

        "#b88a52";







    ctx.beginPath();



    ctx.moveTo(

        p1.x,

        p1.y

    );



    ctx.lineTo(

        p2.x,

        p2.y

    );



    ctx.lineTo(

        p3.x,

        p3.y

    );



    ctx.lineTo(

        p4.x,

        p4.y

    );



    ctx.closePath();



    ctx.fill();







    ctx.strokeStyle =

        "#6d4c41";



    ctx.stroke();







    ctx.restore();



}
/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Teil 4
 3D Karton Darstellung
==================================================
*/



// ======================================
// 3D Karton zeichnen
// ======================================


function drawBox3D(

    box

){



    let length =

        box.length;



    let width =

        box.width;








    // Rotation berücksichtigen


    if(

        box.rotation === 90

    ){



        length =

            box.width;



        width =

            box.length;



    }








    const z =

        box.z;







    const h =

        box.height;








    // Untere Punkte


    const p1 =

        project3D(

            box.x,

            box.y,

            z

        );



    const p2 =

        project3D(

            box.x + length,

            box.y,

            z

        );



    const p3 =

        project3D(

            box.x + length,

            box.y + width,

            z

        );



    const p4 =

        project3D(

            box.x,

            box.y + width,

            z

        );







    // Obere Punkte


    const t1 =

        project3D(

            box.x,

            box.y,

            z+h

        );



    const t2 =

        project3D(

            box.x + length,

            box.y,

            z+h

        );



    const t3 =

        project3D(

            box.x + length,

            box.y + width,

            z+h

        );



    const t4 =

        project3D(

            box.x,

            box.y + width,

            z+h

        );







    ctx.save();







    // Oberseite


    ctx.fillStyle =

        "#d9bf91";



    ctx.beginPath();



    ctx.moveTo(

        t1.x,

        t1.y

    );



    ctx.lineTo(

        t2.x,

        t2.y

    );



    ctx.lineTo(

        t3.x,

        t3.y

    );



    ctx.lineTo(

        t4.x,

        t4.y

    );



    ctx.closePath();



    ctx.fill();



    ctx.stroke();








    // Vorderseite


    ctx.fillStyle =

        "#b98b55";



    ctx.beginPath();



    ctx.moveTo(

        p4.x,

        p4.y

    );



    ctx.lineTo(

        p3.x,

        p3.y

    );



    ctx.lineTo(

        t3.x,

        t3.y

    );



    ctx.lineTo(

        t4.x,

        t4.y

    );



    ctx.closePath();



    ctx.fill();



    ctx.stroke();








    // Seitenfläche


    ctx.fillStyle =

        "#a87545";



    ctx.beginPath();



    ctx.moveTo(

        p2.x,

        p2.y

    );



    ctx.lineTo(

        p3.x,

        p3.y

    );



    ctx.lineTo(

        t3.x,

        t3.y

    );



    ctx.lineTo(

        t2.x,

        t2.y

    );



    ctx.closePath();



    ctx.fill();



    ctx.stroke();








    // Richtungspfeil


    drawDirectionArrow3D(

        box,

        t1,

        t2,

        t3,

        t4

    );







    ctx.restore();



}
/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Teil 5
 Richtungspfeile
==================================================
*/



// ======================================
// 2D Richtungspfeil
// ======================================


function drawDirectionArrow(

    box,

    scale

){



    let length = box.length;



    let width = box.width;







    ctx.save();







    ctx.strokeStyle =

        "#d32f2f";



    ctx.fillStyle =

        "#d32f2f";



    ctx.lineWidth = 3;







    let horizontal =

        length >= width;








    ctx.beginPath();







    if(horizontal){



        ctx.moveTo(

            5,

            width *

            scale / 2

        );



        ctx.lineTo(

            length *

            scale - 5,

            width *

            scale / 2

        );



    }

    else{



        ctx.moveTo(

            length *

            scale / 2,

            5

        );



        ctx.lineTo(

            length *

            scale / 2,

            width *

            scale - 5

        );



    }







    ctx.stroke();








    ctx.restore();



}









// ======================================
// 3D Richtungspfeil
// ======================================


function drawDirectionArrow3D(

    box,

    p1,

    p2,

    p3,

    p4

){



    let start;

    let end;







    const longSide =



        box.length >=

        box.width;







    if(longSide){



        start = p1;

        end = p2;



    }

    else{



        start = p1;

        end = p4;



    }








    ctx.save();







    ctx.strokeStyle =

        "#ff0000";



    ctx.lineWidth = 3;







    ctx.beginPath();



    ctx.moveTo(

        start.x,

        start.y

    );



    ctx.lineTo(

        end.x,

        end.y

    );



    ctx.stroke();







    ctx.restore();



}
/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Teil 6
 Abschluss
==================================================
*/



// ======================================
// Alle Ebenen zeichnen
// ======================================


function drawAllLayers(){



    currentView = "top";



    currentLayer = 0;



    drawCanvas();



}









// ======================================
// Nur eine Lage zeichnen
// ======================================


function drawSingleLayer(

    layer

){



    currentView = "layer";



    currentLayer = layer;



    drawCanvas();



}









// ======================================
// 3D Ansicht öffnen
// ======================================


function draw3D(){



    currentView = "3d";



    currentLayer = 0;



    drawCanvas();



}









// ======================================
// Karton Farbe nach Lage
// ======================================


function getLayerColor(

    layer

){



    const colors = [



        "#c89b5b",

        "#d7b477",

        "#b8894d",

        "#e0c08a"



    ];







    return colors[

        (

            layer - 1

        )

        %

        colors.length

    ];



}









// ======================================
// Canvas Größe anpassen
// ======================================


function resizeCanvas(){



    if(!canvas){

        return;

    }







    canvas.width =

        canvas.clientWidth;







    canvas.height =

        canvas.clientHeight;







    drawCanvas();



}









// ======================================
// Fensteränderung
// ======================================


window.addEventListener(

    "resize",

    resizeCanvas

);









// ======================================
// Automatisch starten
// ======================================


window.addEventListener(

    "load",

    ()=>{



        const c =

        document.getElementById(

            "canvas"

        );



        if(c){



            initCanvas();



        }



    }

);









console.log(

    "Canvas Version 30.0 geladen"

);
