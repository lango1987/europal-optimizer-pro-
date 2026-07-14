/*
==================================================
 Europal Optimizer Pro
 canvas.js
 Version 2.0
 2D + echte 3D Darstellung
==================================================
*/


let canvas;

let ctx;


let currentVariant = null;

let currentPallet = null;


let viewMode = "top";

let activeLayer = 1;







// ======================================
// Canvas starten
// ======================================


function initCanvas(){


    canvas = document.getElementById(
        "canvas"
    );


    if(!canvas){

        return;

    }



    ctx = canvas.getContext(
        "2d"
    );



    resizeCanvas();


}







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







window.addEventListener(

    "resize",

    resizeCanvas

);









// ======================================
// Verbindung mit app.js
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



    drawCanvas();



}









// ======================================
// Ansicht ändern
// ======================================


function setView(

    mode

){



    viewMode = mode;


    drawCanvas();



}









// ======================================
// Lage auswählen
// ======================================


function setLayer(

    layer

){



    activeLayer = layer;


    viewMode = "layer";


    drawCanvas();



}









// ======================================
// Hauptzeichnung
// ======================================


function drawCanvas(){



    if(

        !ctx ||

        !currentVariant

    ){

        return;

    }





    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );







    if(

        viewMode === "top"

    ){


        drawTopView();


    }






    if(

        viewMode === "layer"

    ){


        drawLayerView();


    }






    if(

        viewMode === "3d"

    ){


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
// Draufsicht
// ======================================


function drawTopView(){



    drawPallet2D();







    currentVariant.boxes.forEach(box=>{



        drawBox2D(

            box

        );



    });



}









// ======================================
// einzelne Lage
// ======================================


function drawLayerView(){



    drawPallet2D();







    currentVariant.boxes

    .filter(box=>{



        return (

            box.layer === activeLayer

        );



    })

    .forEach(box=>{



        drawBox2D(

            box

        );



    });



}









// ======================================
// Palette 2D
// ======================================


function drawPallet2D(){



    const scale =

        get2DScale();







    const offset =

        get2DOffset(

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

        get2DScale();







    const offset =

        get2DOffset(

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







    ctx.strokeStyle =

        "#333";







    ctx.lineWidth = 1;







    ctx.fillRect(



        x,

        y,



        box.length *

        scale,



        box.width *

        scale



    );







    ctx.strokeRect(



        x,

        y,



        box.length *

        scale,



        box.width *

        scale



    );







    drawArrow2D(

        box,

        x,

        y,

        scale

    );



}









// ======================================
// Maßstab
// ======================================


function get2DScale(){



    return Math.min(



        600 /

        currentPallet.length,



        600 /

        currentPallet.width



    );



}









function get2DOffset(

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
// Richtungspfeil
// ======================================


function drawArrow2D(

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

        box.length >= box.width

    ){



        ctx.moveTo(



            x + 10,

            y +

            box.width *

            scale /2



        );







        ctx.lineTo(



            x +

            box.length *

            scale -10,



            y +

            box.width *

            scale /2



        );



    }

    else{



        ctx.moveTo(



            x +

            box.length *

            scale /2,



            y + 10



        );







        ctx.lineTo(



            x +

            box.length *

            scale /2,



            y +

            box.width *

            scale -10



        );



    }







    ctx.stroke();



}









// ======================================
// Lagefarben
// ======================================


function getLayerColor(

    layer

){



    if(

        layer % 2 === 1

    ){



        return "#d2a15d";



    }



    return "#9fc5e8";



}
/*
==================================================
 canvas.js
 Teil 3
 3D Engine
==================================================
*/



// ======================================
// 3D Ansicht
// ======================================


function draw3DView(){



    drawPallet3D();







    const boxes =

        [...currentVariant.boxes];







    // hinten nach vorne zeichnen


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



        drawBox3D(

            box

        );



    });



}









// ======================================
// Isometrische Projektion
// ======================================


function project3D(

    x,

    y,

    z

){



    const scale = 0.45;







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

        0.70

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



    const p1 =

        project3D(

            0,

            0,

            0

        );





    const p2 =

        project3D(

            currentPallet.length,

            0,

            0

        );





    const p3 =

        project3D(

            currentPallet.length,

            currentPallet.width,

            0

        );





    const p4 =

        project3D(

            0,

            currentPallet.width,

            0

        );







    drawPolygon(

        [

            p1,

            p2,

            p3,

            p4

        ],

        "#b88952"

    );



}









// ======================================
// Polygon zeichnen
// ======================================


function drawPolygon(

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



    ctx.fillStyle = color;



    ctx.fill();



    ctx.strokeStyle = "#4e342e";



    ctx.stroke();



}
/*
==================================================
 canvas.js
 Teil 4
 3D Kartons
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







    // Drehung berücksichtigen


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








    // Untere Ecken


    const p1 =

        project3D(

            x,

            y,

            z

        );



    const p2 =

        project3D(

            x+length,

            y,

            z

        );



    const p3 =

        project3D(

            x+length,

            y+width,

            z

        );



    const p4 =

        project3D(

            x,

            y+width,

            z

        );







    // Obere Ecken


    const t1 =

        project3D(

            x,

            y,

            z+h

        );



    const t2 =

        project3D(

            x+length,

            y,

            z+h

        );



    const t3 =

        project3D(

            x+length,

            y+width,

            z+h

        );



    const t4 =

        project3D(

            x,

            y+width,

            z+h

        );









    // Oberseite


    drawPolygon(

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









    // Vorderseite


    drawPolygon(

        [

            p4,

            p3,

            t3,

            t4

        ],

        "#b8864b"

    );









    // Seitenfläche


    drawPolygon(

        [

            p2,

            p3,

            t3,

            t2

        ],

        "#8d6239"

    );



}









// ======================================
// Abschluss
// ======================================


console.log(

    "Canvas Version 2.0 geladen"

);
