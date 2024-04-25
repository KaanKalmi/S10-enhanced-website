// Definieer een selector voor de knop die momenteel wordt ingedrukt
const pressedButtonSelector = '[data-theme][aria-pressed="true"]';

// Definieer het standaardthema
const defaultTheme = 'dark';

// Functie om een ​​bepaald thema toe te passen
const applyTheme = (theme) => {
  // Zoek de knop die bij het opgegeven thema hoort
  const target = document.querySelector(`[data-theme="${theme}"]`);
  
  // Stel het geselecteerde thema in op het root-HTML-element
  document.documentElement.setAttribute("data-selected-theme", theme);
  
  // Laat de momenteel ingedrukte knop los
  document.querySelector(pressedButtonSelector).setAttribute('aria-pressed', 'false');
  
  // Druk op de knop die bij het opgegeven thema hoort
  target.setAttribute('aria-pressed', 'true');
};

// Functie voor het afhandelen van de themaselectiegebeurtenis
const handleThemeSelection = (event) => {
  // Haal het doel van het evenement op (de knop waarop is geklikt)
  const target = event.target;
  
  // Controleer of de knop momenteel is ingedrukt
  const isPressed = target.getAttribute('aria-pressed');
  
  // Haal het thema op dat aan de knop is gekoppeld
  const theme = target.getAttribute('data-theme');        
  
  // Als de knop momenteel niet wordt ingedrukt, pas dan het bijbehorende thema toe en sla het op in de lokale opslag
  if(isPressed !== "true") {
    applyTheme(theme);
    localStorage.setItem('selected-theme', theme);
  }
}

// Functie om het initiële thema in te stellen wanneer de pagina wordt geladen
const setInitialTheme = () => {
  // Haal het opgeslagen thema op uit de lokale opslag
  const savedTheme = localStorage.getItem('selected-theme');
  
  // Als er een opgeslagen thema is en dit niet het standaardthema is, pas het dan toe
  if(savedTheme && savedTheme !== defaultTheme) {
    applyTheme(savedTheme);
  }
};

// Roep de functie aan om het initiële thema in te stellen
setInitialTheme();

// Verkrijg het themawisselaarelement
const themeSwitcher = document.querySelector('.theme-switcher');

// Verkrijg alle knoppen in de themawisselaar
const buttons = themeSwitcher.querySelectorAll('button');

// Voeg aan elke knop een klikgebeurtenislistener toe om de themaselectie af te handelen
buttons.forEach((button) => {
   button.addEventListener('click', handleThemeSelection);
});