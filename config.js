/*
==================================================
 Europal Optimizer Pro
 Konfiguration
==================================================
*/

const APP = {
    name: "Europal Optimizer Pro",
    version: "0.1.0"
};

const PALLETS = {

    euro: {
        id: "euro",
        name: "Europalette",
        length: 1200,
        width: 800,
        height: 144
    },

    industry: {
        id: "industry",
        name: "Industriepalette",
        length: 1200,
        width: 1000,
        height: 144
    }

};

const SETTINGS = {

    defaultPallet: "euro",

    defaultMaxHeight: 1800,

    optimization: "balanced"

};

const COLORS = {

    pallet: "#555",

    carton: "#4CAF50",

    cartonBorder: "#2E7D32",

    background: "#EEF2F7",

    selected: "#1565C0"

};
