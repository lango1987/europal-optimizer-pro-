/*
=========================================
 Europal Optimizer Pro
 App
 Version 1.0
=========================================
*/

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {

    document
        .getElementById("calculate")
        .addEventListener("click", calculate);

}

function calculate() {

    const box = getBoxInput();
    const maxHeight = getMaxHeight();

    // Einfache Prüfung
    if (box.length <= 0 || box.width <= 0 || box.height <= 0) {
        showMessage("Bitte gültige Kartonmaße eingeben.");
        return;
    }

    // Aktuell immer Europalette
    const pallet = PALLETS.euro;

    // Varianten berechnen
    const variants = optimize(box, pallet);

    if (variants.length === 0) {
        showMessage("Keine Variante gefunden.");
        return;
    }

    // Beste Variante auswählen
    const best = variants[0];

    // Weitere Berechnungen
    const layers = calculateLayers(
        maxHeight,
        box.height,
        pallet.height
    );

    const total = calculateTotal(
        best.cartonsPerLayer,
        layers
    );

    const result = {
        cartonsPerLayer: best.cartonsPerLayer,
        layers: layers,
        total: total,
        utilization: best.utilization
    };

    // Dashboard aktualisieren
    updateDashboard(result);

    // Palette zeichnen
    drawVariant("canvas", best, pallet);

    console.log("Beste Variante:", best);

}
