/*
==================================================
 Europal Optimizer Pro
 canvas.js
 kompatibel mit app.js
 Version 40.0
==================================================
*/


let canvas;
let ctx;



let canvasMode = "top";

let selectedLayer = 0;



// ======================================
// Hauptfunktion aus app.js
// ======================================


function drawVariant(

    canvasId,

    variant,

    pallet

){



    canvas = document.getElementById(

        canvasId

    );



    if(!canvas){

        return;

    }



    ctx = canvas.getContext(

        "2d"

    );



    canvas.width = canvas.clientWidth;

    canvas.height = canvas.clientHeight;



    variant.pallet = pallet;



    window.currentVariant = variant;



    clearCanvas();







    if(canvasMode === "top"){



        drawTopView(

            variant,

            pallet

        );



    }







    else if(canvasMode === "3d"){



        draw3DView(

            variant,

            pallet

        );



    }







    else if(canvasMode === "layer"){



        drawLayerView(

            variant,

            pallet,

            selectedLayer

        );



    }



}









// ======================================
// Ansicht wechseln
// ======================================


function setCanvasMode(

    mode

){



    canvasMode = mode;



    if(window.currentVariant){



        drawVariant(

            "canvas",

            window.currentVariant,

            window.currentVariant.pallet

        );



    }



}








// ======================================
// Lage auswählen
// ======================================


function setCanvasLayer(

    layer

){



    selectedLayer = layer;



    canvasMode = "layer";



    if(window.currentVariant){



        drawVariant(

            "canvas",

            window.currentVariant,

            window.currentVariant.pallet

        );



    }



}








function clearCanvas(){



    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );



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


function drawTopView(

    variant,

    pallet

){



    drawPallet2D(

        pallet

    );







    variant.boxes.forEach(box=>{



        drawBox2D(

            box,

            pallet

        );



    });



}









// ======================================
// Einzelne Lage
// ======================================


function drawLayerView(

    variant,

    pallet,

    layer

){



    drawPallet2D(

        pallet

    );







    variant.boxes

    .filter(box=>{



        return (

            box.layer === layer

        );



    })

    .forEach(box=>{



        drawBox2D(

            box,

            pallet

        );



    });



}









// ======================================
// Palette 2D
// ======================================


function drawPallet2D(

    pallet

){



    const scale =

        get2DScale(

            pallet

        );







    const offset =

        get2DOffset(

            pallet,

            scale

        );







    ctx.fillStyle =

        "#c8a165";



    ctx.fillRect(



        offset.x,

        offset.y,



        pallet.length *

        scale,



        pallet.width *

        scale



    );







    ctx.strokeStyle =

        "#654321";



    ctx.strokeRect(



        offset.x,

        offset.y,



        pallet.length *

        scale,



        pallet.width *

        scale



    );



}









// ======================================
// Karton 2D
// ======================================


function drawBox2D(

    box,

    pallet

){



    const scale =

        get2DScale(

            pallet

        );







    const offset =

        get2DOffset(

            pallet,

            scale

        );








    ctx.save();







    ctx.translate(



        offset.x +

        box.x *

        scale,



        offset.y +

        box.y *

        scale



    );







    ctx.fillStyle =

        getLayerColor(

            box.layer

        );







    ctx.strokeStyle =

        "#333";







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








    drawArrow2D(

        box,

        scale

    );







    ctx.restore();



}









// ======================================
// Maßstab
// ======================================


function get2DScale(

    pallet

){



    return Math.min(



        canvas.width /

        pallet.length,



        canvas.height /

        pallet.width



    )

    *

    0.75;



}









function get2DOffset(

    pallet,

    scale

){



    return {



        x:

        (

            canvas.width -

            pallet.length *

            scale

        )

        /2,



        y:

        (

            canvas.height -

            pallet.width *

            scale

        )

        /2



    };



}









// ======================================
// Pfeil 2D
// ======================================


function drawArrow2D(

    box,

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

            10,

            box.width *

            scale /

            2

        );



        ctx.lineTo(

            box.length *

            scale -

            10,

            box.width *

            scale /

            2

        );



    }

    else{



        ctx.moveTo(

            box.length *

            scale /

            2,

            10

        );



        ctx.lineTo(

            box.length *

            scale /

            2,

            box.width *

            scale -

            10

        );



    }







    ctx.stroke();



}
/*
==================================================
 canvas.js
 Teil 3
 3D Basis
==================================================
*/



// ======================================
// 3D Ansicht
// ======================================


function draw3DView(

    variant,

    pallet

){



    drawPallet3D(

        pallet

    );







    const boxes =

        [...variant.boxes];







    // hinten zuerst zeichnen


    boxes.sort((a,b)=>{



        return (

            a.y +

            a.z

        )

        -

        (

            b.y +

            b.z

        );



    });







    boxes.forEach(box=>{



        drawBox3D(

            box,

            pallet

        );



    });



}









// ======================================
// 3D Projektion
// ======================================


function project3D(

    x,

    y,

    z,

    pallet

){



    const scale =



        Math.min(



            canvas.width /

            (

                pallet.length +

                pallet.width

            ),



            canvas.height /

            (

                pallet.length +

                pallet.width

            )



        )

        *

        0.8;







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

            0.65

            +

            (

                x +

                y

            )

            *

            scale

            *

            0.45

            -

            z

            *

            scale

            *

            0.7



    };



}









// ======================================
// Palette 3D
// ======================================


function drawPallet3D(

    pallet

){



    const z = 0;







    const p1 =

        project3D(

            0,

            0,

            z,

            pallet

        );







    const p2 =

        project3D(

            pallet.length,

            0,

            z,

            pallet

        );







    const p3 =

        project3D(

            pallet.length,

            pallet.width,

            z,

            pallet

        );







    const p4 =

        project3D(

            0,

            pallet.width,

            z,

            pallet

        );







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







    ctx.fillStyle =

        "#b88652";



    ctx.fill();







    ctx.strokeStyle =

        "#5d4037";



    ctx.stroke();



}
/*
==================================================
 canvas.js
 Teil 4
 3D Karton Darstellung
==================================================
*/



// ======================================
// Karton 3D zeichnen
// ======================================


function drawBox3D(

    box,

    pallet

){



    let length =

        box.length;



    let width =

        box.width;







    // Drehung berücksichtigen


    if(

        box.rotation === 90

    ){



        length =

            box.width;



        width =

            box.length;



    }







    const z =

        box.z || 0;







    const h =

        box.height || 0;







    // Untere Ebene


    const p1 = project3D(

        box.x,

        box.y,

        z,

        pallet

    );



    const p2 = project3D(

        box.x + length,

        box.y,

        z,

        pallet

    );



    const p3 = project3D(

        box.x + length,

        box.y + width,

        z,

        pallet

    );



    const p4 = project3D(

        box.x,

        box.y + width,

        z,

        pallet

    );







    // Obere Ebene


    const t1 = project3D(

        box.x,

        box.y,

        z+h,

        pallet

    );



    const t2 = project3D(

        box.x + length,

        box.y,

        z+h,

        pallet

    );



    const t3 = project3D(

        box.x + length,

        box.y + width,

        z+h,

        pallet

    );



    const t4 = project3D(

        box.x,

        box.y + width,

        z+h,

        pallet

    );







    ctx.save();







    // Oberseite


    drawPolygon3D(

        [

            t1,

            t2,

            t3,

            t4

        ],

        "#d9b77a"

    );








    // Vorderseite


    drawPolygon3D(

        [

            p4,

            p3,

            t3,

            t4

        ],

        "#b9874f"

    );








    // rechte Seite


    drawPolygon3D(

        [

            p2,

            p3,

            t3,

            t2

        ],

        "#986738"

    );








    ctx.restore();



}









// ======================================
// Polygon zeichnen
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
 Teil 5
 Abschluss
==================================================
*/



// ======================================
// Farbe je Lage
// ======================================


function getLayerColor(

    layer

){



    const colors = [



        "#c89b5b",

        "#d7b477",

        "#b88950",

        "#e0c28c"



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
// 3D Richtungspfeil
// ======================================


function drawArrow3D(

    box,

    pallet

){



    let start;

    let end;







    const z =

        box.z +

        box.height +

        2;








    if(

        box.length >= box.width

    ){



        start = project3D(

            box.x + 20,

            box.y + box.width/2,

            z,

            pallet

        );





        end = project3D(

            box.x + box.length - 20,

            box.y + box.width/2,

            z,

            pallet

        );



    }

    else{



        start = project3D(

            box.x + box.length/2,

            box.y + 20,

            z,

            pallet

        );





        end = project3D(

            box.x + box.length/2,

            box.y + box.width - 20,

            z,

            pallet

        );



    }







    ctx.strokeStyle =

        "red";



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



}









// ======================================
// Tastatur Steuerung optional
// ======================================


document.addEventListener(

    "keydown",

    function(e){



        if(e.key==="1"){



            setCanvasMode(

                "top"

            );



        }







        if(e.key==="2"){



            setCanvasMode(

                "3d"

            );



        }



    }

);









console.log(

    "Canvas Version 40.0 geladen"

);
