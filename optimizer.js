/*
=========================================
 Europal Optimizer Pro
 Optimierungsalgorithmus
 Version 1.0
=========================================
*/

function optimize(box, pallet) {

    const variants = [];

    getPatterns().forEach(pattern => {

        variants.push(
            createVariant(pattern, box, pallet)
        );

    });

    variants.sort((a, b) => b.cartonsPerLayer - a.cartonsPerLayer);

    return variants;

}

function createVariant(pattern, box, pallet) {

    let boxLength = box.length;
    let boxWidth = box.width;

    // 90° gedrehte Variante
    if (pattern.id === "rotated") {
        boxLength = box.width;
        boxWidth = box.length;
    }

    const cols = Math.floor(pallet.length / boxLength);
    const rows = Math.floor(pallet.width / boxWidth);

    const cartonsPerLayer = cols * rows;

    const utilization = calculateUtilization(
        pallet.length,
        pallet.width,
        boxLength,
        boxWidth,
        cartonsPerLayer
    );

    return {

        id: pattern.id,
        name: pattern.name,

        cols,
        rows,

        boxLength,
        boxWidth,

        cartonsPerLayer,
        utilization,

        stability: pattern.stability,

        boxes: []

    };

}
