/*
==================================================
 Europal Optimizer Pro
 Patterns
 Version 2.0
==================================================
*/

function getPatterns() {

    return [

        {
            id: "standard",
            name: "Standard",
            rotation: 0,
            stability: 70
        },

        {
            id: "rotated",
            name: "90° gedreht",
            rotation: 90,
            stability: 75
        },

        {
            id: "cross",
            name: "Kreuzverband",
            rotation: "alternate",
            stability: 95
        },

        {
            id: "block",
            name: "Blockstapel",
            rotation: 0,
            stability: 90
        }

    ];

}
