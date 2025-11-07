export function createButton(id) {
  const controlButton = document.getElementById(id);
  controlButton.style.cursor = "pointer";
  controlButton.style.textAlign = "center";
  controlButton.title = "Itinéraire";
  controlButton.type = "button";
  return controlButton;
}
