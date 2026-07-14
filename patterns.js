/*
=========================================
 Europal Optimizer Pro
 Packmuster
=========================================
*/

const PATTERNS = [

    {
        id: "standard",
        name: "Standard",
        description: "Alle Kartons gleich ausgerichtet",
        stability: 8.0
    },

    {
        id: "rotated",
        name: "90° gedreht",
        description: "Alle Kartons gedreht",
        stability: 7.8
    },

    {
        id: "brick",
        name: "Kreuzverband",
        description: "Versetzte Reihen für höhere Stabilität",
        stability: 9.5
    },

    {
        id: "mixed",
        name: "Gemischte Anordnung",
        description: "Kombination aus Standard und gedreht",
        stability: 8.8
    }

];

function getPatterns() {
    return PATTERNS;
}
