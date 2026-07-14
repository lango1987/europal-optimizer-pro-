/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Pattern 3D Viewer
 Version 3.0
==================================================
*/


let canvas;

let ctx;


let currentResult = null;

let currentPallet = null;


let viewMode = "top";

let selectedLayer = 0;






// ======================================
// Start
// ======================================


function initCanvas(){


    canvas =
    document.getElementById(
        "canvas"
    );


    ctx =
    canvas.getContext(
        "2d"
    );


    resizeCanvas();


}







function resizeCanvas(){


    if(!canvas)return;



    canvas.width =
    canvas.clientWidth;



    canvas.height =
    canvas.clientHeight;



    drawCanvas();


}







window.addEventListener(

"resize",

resizeCanvas

);









// ======================================
// Daten übernehmen
// ======================================


function drawVariant(

id,

result,

pallet

){



    currentResult = result;


    currentPallet = pallet;



    drawCanvas();



}









// ======================================
// Ansicht
// ======================================


function setView(

mode

){


    viewMode = mode;


    drawCanvas();


}







function setLayer(

layer

){


    selectedLayer = layer;


    viewMode = "layer";


    drawCanvas();


}









// ======================================
// Hauptfunktion
// ======================================


function drawCanvas(){


    if(

        !ctx ||

        !currentResult

    ){

        return;

    }




    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );







    if(viewMode==="top"){


        drawTopView();


    }







    if(viewMode==="layer"){


        drawLayerView();


    }







    if(viewMode==="3d"){


        draw3DView();


    }



}
/*
==================================================
 canvas.js
 Teil 2
 2D Darstellung
==================================================
*/



// ======================================
// Alle Kartons von oben
// ======================================


function drawTopView(){



    drawPallet2D();







    currentResult.boxes.forEach(box=>{



        drawBox2D(box);



    });



}









// ======================================
// Eine Lage anzeigen
// ======================================


function drawLayerView(){



    drawPallet2D();







    currentResult.boxes

    .filter(box=>{



        return (

            box.layer ===

            selectedLayer

        );



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

        getScale2D();







    const offset =

        getOffset2D(

            scale

        );







    ctx.fillStyle =

        "#c49a62";



    ctx.fillRect(



        offset.x,

        offset.y,



        currentPallet.length *

        scale,



        currentPallet.width *

        scale



    );







    ctx.strokeStyle =

        "#5d4037";



    ctx.lineWidth = 3;



    ctx.strokeRect(



        offset.x,

        offset.y,



        currentPallet.length *

        scale,



        currentPallet.width *

        scale



    );



}









// ======================================
// Karton 2D
// ======================================


function drawBox2D(

    box

){



    const scale =

        getScale2D();







    const offset =

        getOffset2D(

            scale

        );







    const x =

        offset.x +

        box.x *

        scale;







    const y =

        offset.y +

        box.y *

        scale;







    ctx.fillStyle =

        getLayerColor(

            box.layer

        );







    ctx.fillRect(



        x,

        y,



        box.length *

        scale,



        box.width *

        scale



    );







    ctx.strokeStyle =

        "#333";



    ctx.strokeRect(



        x,

        y,



        box.length *

        scale,



        box.width *

        scale



    );







    drawRotationArrow(

        box,

        x,

        y,

        scale

    );



}









// ======================================
// Maßstab
// ======================================


function getScale2D(){



    return Math.min(



        650 /

        currentPallet.length,



        650 /

        currentPallet.width



    );



}









function getOffset2D(

    scale

){



    return {



        x:

        (

            canvas.width -

            currentPallet.length *

            scale

        )

        /2,



        y:

        (

            canvas.height -

            currentPallet.width *

            scale

        )

        /2



    };



}









// ======================================
// Richtung anzeigen
// ======================================


function drawRotationArrow(

    box,

    x,

    y,

    scale

){



    ctx.strokeStyle =

        "red";



    ctx.lineWidth = 2;







    ctx.beginPath();







    if(

        box.rotation === 90

    ){



        ctx.moveTo(

            x +

            box.length *

            scale/2,



            y+10

        );



        ctx.lineTo(

            x +

            box.length *

            scale/2,



            y +

            box.width *

            scale -

            10

        );



    }

    else{



        ctx.moveTo(

            x+10,



            y +

            box.width *

            scale/2

        );



        ctx.lineTo(

            x +

            box.length *

            scale -

            10,



            y +

            box.width *

            scale/2

        );



    }







    ctx.stroke();



}









// ======================================
// Farbe nach Lage
// ======================================


function getLayerColor(

    layer

){



    // Muster A


    if(

        layer % 2 === 1

    ){



        return "#d19a52";



    }







    // Muster B


    return "#8fb7d8";



}
/*
==================================================
 canvas.js
 Teil 3
 3D Ansicht
==================================================
*/



// ======================================
// 3D Hauptansicht
// ======================================


function draw3DView(){



    drawPallet3D();







    const boxes =

        [

            ...currentResult.boxes

        ];








    // richtige Zeichenreihenfolge

    boxes.sort((a,b)=>{



        return (



            a.z +

            a.y +

            a.x



        )

        -

        (



            b.z +

            b.y +

            b.x



        );



    });







    boxes.forEach(box=>{



        drawBox3D(

            box

        );



    });



}









// ======================================
// Isometrische Projektion
// ======================================


function iso(

    x,

    y,

    z

){



    const scale =

        0.45;







    return {



        x:

        canvas.width/2

        +

        (

            x -

            y

        )

        *

        scale,







        y:

        canvas.height *

        0.72

        +

        (

            x +

            y

        )

        *

        scale *

        0.35

        -

        z *

        scale *

        0.75



    };



}









// ======================================
// Palette 3D
// ======================================


function drawPallet3D(){



    const a =

        iso(

            0,

            0,

            0

        );





    const b =

        iso(

            currentPallet.length,

            0,

            0

        );





    const c =

        iso(

            currentPallet.length,

            currentPallet.width,

            0

        );





    const d =

        iso(

            0,

            currentPallet.width,

            0

        );







    drawPolygon3D(

        [

            a,

            b,

            c,

            d

        ],

        "#b88950"

    );



}









// ======================================
// Polygon
// ======================================


function drawPolygon3D(

    points,

    color

){



    ctx.beginPath();



    ctx.moveTo(

        points[0].x,

        points[0].y

    );







    for(

        let i=1;

        i<points.length;

        i++

    ){



        ctx.lineTo(

            points[i].x,

            points[i].y

        );



    }







    ctx.closePath();



    ctx.fillStyle =

        color;



    ctx.fill();



    ctx.strokeStyle =

        "#4a3728";



    ctx.stroke();



}
/*
==================================================
 canvas.js
 Teil 4
 3D Karton
==================================================
*/



// ======================================
// Karton 3D zeichnen
// ======================================


function drawBox3D(

    box

){



    let length =

        box.length;



    let width =

        box.width;







    // Rotation beachten


    if(

        box.rotation === 90

    ){



        length = box.width;



        width = box.length;



    }








    const x = box.x;

    const y = box.y;

    const z = box.z || 0;



    const h = box.height;








    // untere Punkte


    const p1 =

        iso(

            x,

            y,

            z

        );





    const p2 =

        iso(

            x + length,

            y,

            z

        );





    const p3 =

        iso(

            x + length,

            y + width,

            z

        );





    const p4 =

        iso(

            x,

            y + width,

            z

        );








    // obere Punkte


    const t1 =

        iso(

            x,

            y,

            z+h

        );





    const t2 =

        iso(

            x + length,

            y,

            z+h

        );





    const t3 =

        iso(

            x + length,

            y + width,

            z+h

        );





    const t4 =

        iso(

            x,

            y + width,

            z+h

        );









    // ==================================
    // Oberseite
    // ==================================


    drawPolygon3D(

        [

            t1,

            t2,

            t3,

            t4

        ],

        getLayerColor(

            box.layer

        )

    );








    // ==================================
    // Vorderseite
    // ==================================


    drawPolygon3D(

        [

            p4,

            p3,

            t3,

            t4

        ],

        "#b98246"

    );








    // ==================================
    // Rechte Seite
    // ==================================


    drawPolygon3D(

        [

            p2,

            p3,

            t3,

            t2

        ],

        "#8c6035"

    );








    // Umrandung


    ctx.strokeStyle =

        "#333";



}









// ======================================
// fertig
// ======================================


console.log(

    "Canvas Pattern 3D Viewer geladen"

);
