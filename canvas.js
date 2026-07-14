/*
=========================================
 Europal Optimizer Pro
 Canvas
 Version 1.0
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

    // Palette
    ctx.strokeStyle = COLORS.palletBorder;
    ctx.lineWidth = 2;

    ctx.strokeRect(
        margin,
        margin,
        pallet.length * scale,
        pallet.width * scale
    );

    ctx.fillStyle = COLORS.carton;
    ctx.strokeStyle = COLORS.cartonBorder;

    for (let row = 0; row < variant.rows; row++) {

        for (let col = 0; col < variant.cols; col++) {

            const x = margin + col * variant.boxLength * scale;
            const y = margin + row * variant.boxWidth * scale;

            ctx.fillRect(
                x,
                y,
                variant.boxLength * scale - 2,
                variant.boxWidth * scale - 2
            );

            ctx.strokeRect(
                x,
                y,
                variant.boxLength * scale - 2,
                variant.boxWidth * scale - 2
            );
        }
    }

}
