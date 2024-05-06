document.body.onmousemove = function(event) { // wanneer muis beweegt doe:
    var blob = document.getElementById('blob'); // zoek element met id 'blob'
    blob.style.left = event.clientX + 'px'; // verander de x positie van 'blob' naar de x positie van de muis
    blob.style.top = event.clientY + 'px'; // verander de y positie van 'blob' naar de y positie van de muis
}