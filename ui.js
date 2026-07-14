/*
=========================================
 Europal Optimizer Pro
 UI
 Version 1.0
=========================================
*/

function getBoxInput() {

    return {
        length: Number(document.getElementById("length").value),
        width: Number(document.getElementById("width").value),
        height: Number(document.getElementById("height").value),
        weight: Number(document.getElementById("weight").value) || 0
    };

}

function getMaxHeight() {

    return Number(document.getElementById("maxHeight").value);

}

function updateDashboard(result) {

    document.getElementById("layer").textContent = result.cartonsPerLayer;
    document.getElementById("layers").textContent = result.layers;
    document.getElementById("total").textContent = result.total;
    document.getElementById("utilization").textContent = result.utilization + " %";

}

function showMessage(message) {

    alert(message);

}
