/*
==================================================
 Europal Optimizer Pro
 Canvas
 Version 3.0
==================================================
*/

const ISO = {
    scale: 0.18,
    startX: 250,
    startY: 500
};

// ==================================================
// Einstieg
// ==================================================

function drawVariant(canvasId, variant, pallet) {

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentView === "iso") {

        drawIsometric(ctx, variant, pallet);
        return;

    }

    drawTopView(ctx, variant, pallet);

}

// ==================================================
// Draufsicht
// ==================================================

function drawTopView(ctx, variant, pallet) {

    const margin = 35;

    const scale = Math.min(
        (ctx.canvas.width - margin * 2) / pallet.length,
        (ctx.canvas.height - margin * 2) / pallet.width
    );

    drawTopPallet(
        ctx,
        margin,
        margin,
        pallet.length * scale,
        pallet.width * scale
    );

    variant.boxes.forEach(box => {

        drawTopBox(

            ctx,

            margin + box.x * scale,

            margin + box.y * scale,

            box.length * scale,

            box.width * scale

        );

    });

}

// ==================================================
// Palette
// ==================================================

function drawTopPallet(ctx, x, y, w, h) {

    ctx.fillStyle = "#E8D8B0";

    ctx.fillRect(x, y, w, h);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#6E4F2D";

    ctx.strokeRect(x, y, w, h);

    // Bretter

    ctx.strokeStyle = "#B78946";
    ctx.lineWidth = 2;

    const boardHeight = h / 5;

    for (let i = 1; i < 5; i++) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            y + i * boardHeight
        );

        ctx.lineTo(
            x + w,
            y + i * boardHeight
        );

        ctx.stroke();

    }

    // Klötze

    ctx.fillStyle = "#7A5730";

    const blockWidth = w / 10;
    const blockHeight = 18;

    const pos = [0.08, 0.42, 0.78];

    pos.forEach(p => {

        ctx.fillRect(

            x + w * p,

            y + h - blockHeight,

            blockWidth,

            blockHeight

        );

    });

}

// ==================================================
// Kartons Draufsicht
// ==================================================

function drawTopBox(ctx, x, y, w, h) {

    // Schatten

    ctx.fillStyle = "rgba(0,0,0,.08)";

    ctx.fillRect(
        x + 3,
        y + 3,
        w - 2,
        h - 2
    );

    // Karton

    ctx.fillStyle = "#7CCB77";

    ctx.fillRect(
        x,
        y,
        w - 2,
        h - 2
    );

    // Rand

    ctx.strokeStyle = "#2E7D32";
    ctx.lineWidth = 1;

    ctx.strokeRect(
        x,
        y,
        w - 2,
        h - 2
    );

    // Kartonlinien

    ctx.strokeStyle = "#9E8B72";

    ctx.beginPath();

    ctx.moveTo(
        x + w / 2,
        y
    );

    ctx.lineTo(
        x + w / 2,
        y + h
    );

    ctx.moveTo(
        x,
        y + h / 2
    );

    ctx.lineTo(
        x + w,
        y + h / 2
    );

    ctx.stroke();

}

// ==================================================
// Isometrische Ansicht
// ==================================================

function drawIsometric(ctx, variant, pallet) {

    drawIsoPallet(
        ctx,
        ISO.startX,
        ISO.startY,
        pallet.length * ISO.scale,
        pallet.width * ISO.scale
    );

    const boxes = [...variant.boxes];

    boxes.sort((a, b) => {

        if ((a.x + a.y) !== (b.x + b.y)) {
            return (a.x + a.y) - (b.x + b.y);
        }

        return a.z - b.z;

    });

    boxes.forEach(box => {

        const screenX =
            ISO.startX +
            box.x * ISO.scale -
            box.y * ISO.scale;

        const screenY =
            ISO.startY +
            box.x * ISO.scale / 2 +
            box.y * ISO.scale / 2 -
            box.z * ISO.scale;

        drawIsoBox(

            ctx,

            screenX,

            screenY,

            box.length * ISO.scale,

            box.width * ISO.scale,

            box.height * ISO.scale

        );

    });

}// ==================================================
// Isometrische Palette
// ==================================================

function drawIsoPallet(ctx, x, y, l, w) {

    const h = 18;

    // Oberseite
    ctx.fillStyle = "#C89D63";
    ctx.strokeStyle = "#6E4F2D";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + l, y + l / 2);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2);
    ctx.lineTo(x - w, y + w / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vorderseite
    ctx.fillStyle = "#B5834D";

    ctx.beginPath();
    ctx.moveTo(x - w, y + w / 2);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2 + h);
    ctx.lineTo(x - w, y + w / 2 + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rechte Seite
    ctx.fillStyle = "#9D6E3D";

    ctx.beginPath();
    ctx.moveTo(x + l, y + l / 2);
    ctx.lineTo(x + l, y + l / 2 + h);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2 + h);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

}

// ==================================================
// Isometrischer Karton
// ==================================================

function drawIsoBox(ctx, x, y, l, w, h) {

    // Schatten
    ctx.fillStyle = "rgba(0,0,0,.12)";

    ctx.beginPath();
    ctx.moveTo(x - w + 4, y + w / 2 + h + 4);
    ctx.lineTo(x + l - w + 4, y + l / 2 + w / 2 + h + 4);
    ctx.lineTo(x + l + 4, y + l / 2 + h + 4);
    ctx.lineTo(x + 4, y + h + 4);
    ctx.closePath();
    ctx.fill();

    // Oberseite
    ctx.fillStyle = "#DCC7A1";
    ctx.strokeStyle = "#7A6546";

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + l, y + l / 2);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2);
    ctx.lineTo(x - w, y + w / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vorderseite
    ctx.fillStyle = "#C9B089";

    ctx.beginPath();
    ctx.moveTo(x - w, y + w / 2);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2 + h);
    ctx.lineTo(x - w, y + w / 2 + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rechte Seite
    ctx.fillStyle = "#B69568";

    ctx.beginPath();
    ctx.moveTo(x + l, y + l / 2);
    ctx.lineTo(x + l, y + l / 2 + h);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2 + h);
    ctx.lineTo(x + l - w, y + l / 2 + w / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Kartonband oben
    ctx.strokeStyle = "#8B7355";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x - w / 2, y + w / 4);
    ctx.lineTo(x + l - w / 2, y + l / 2 + w / 4);

    ctx.moveTo(x + l / 2, y + l / 4);
    ctx.lineTo(x + l / 2 - w, y + l / 4 + w / 2);

    ctx.stroke();

}

// ==================================================
// Hilfsfunktion
// ==================================================

function isoPoint(x, y, z) {

    return {

        x: ISO.startX + x * ISO.scale - y * ISO.scale,

        y:
            ISO.startY +
            x * ISO.scale / 2 +
            y * ISO.scale / 2 -
            z * ISO.scale

    };

}
