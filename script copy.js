// Obtén la referencia al elemento de audio
var audio = document.getElementById("backgroundAudio");

// Verifica si el navegador soporta la API de audio y si el audio está listo para reproducirse
if (audio && audio.play) {
  // Reproduce el audio
  audio.play();
}

// Añade un evento para manejar la recarga de la página
window.addEventListener("beforeunload", function(event) {
  // Detiene la reproducción del audio
  audio.pause();
});

  