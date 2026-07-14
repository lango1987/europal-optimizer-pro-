/*
==================================================
 Europal Optimizer Pro
 Optimizer
 Version 0.1.0
==================================================
*/

function optimize(job) {

    const variants = [];

    getPatterns().forEach(pattern => {

        variants.push(
            calculatePattern(job, pattern)
        );

    });

    variants.sort((a, b) => {

        if (b.cartonsPerLayer !== a.cartonsPerLayer) {
            return b.cartonsPerLayer - a.cartonsPerLayer;
        }

        return b.utilization - a.utilization;

    });

    return variants;

}

function calculatePattern(job, pattern) {

    let boxLength = job.box.length;
    let boxWidth = job.box.width;

    // 90° drehen
    if (pattern.id === "rotated") {

        boxLength = job.box.width;
        boxWidth = job.box.length;

    }

    const cols = Math.floor(job.pallet.length / boxLength);
    const rows = Math.floor(job.pallet.width / boxWidth);

    const cartonsPerLayer = cols * rows;

    const layers = Math.floor(
        (job.settings.maxHeight - job.pallet.height) /
        job.box.height
    );

    const totalCartons = cartonsPerLayer * layers;

    const palletArea =
        job.pallet.length * job.pallet.width;

    const usedArea =
        cartonsPerLayer * boxLength * boxWidth;

    const utilization =
        Number(((usedArea / palletArea) * 100).toFixed(1));

    return {

        id: pattern.id,

        name: pattern.name,

        stability: pattern.stability,

        cols,

        rows,

        boxLength,

        boxWidth,

        cartonsPerLayer,

        layers,

        totalCartons,

        utilization,

  boxes: createBoxes(

    cols,

    rows,

    layers,

    boxLength,

    boxWidth,

    job.box.height

)     

    };

}

function createBoxes(
    cols,
    rows,
    layers,
    boxLength,
    boxWidth,
    boxHeight
) {

    const boxes = [];

    for (let layer = 0; layer < layers; layer++) {

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < cols; col++) {

                boxes.push({

                    x: col * boxLength,

                    y: row * boxWidth,

                    z: layer * boxHeight,

                    length: boxLength,

                    width: boxWidth,

                    height: boxHeight,

                    rotation: 0,

                    layer: layer + 1

                });

            }

        }

    }

    return boxes;

}

    const boxes = [];

    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            boxes.push({

                x: col * boxLength,

                y: row * boxWidth,

                length: boxLength,

                width: boxWidth,

                rotation: 0

            });

        }

    }

    return boxes;

}
