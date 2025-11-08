const homeIcon = document.getElementById("home");
const crossIcon = document.getElementById("cross");
const topnav = document.getElementById("topnav");
const linkDiv = document.getElementById("rbox");
const searchBox = document.getElementById("searchbox");
const resultsDiv = document.getElementById("rbox");
const autoSearchButton = document.getElementById("autoSearchButton");

export function toggleNavigationUI(destinationName) {
  homeIcon.style.display = "none";
  crossIcon.style.display = "initial";
  autoSearchButton.style.display = "none";

  if (linkDiv) {
    linkDiv.style.display = "none";
  }

  topnav.innerHTML = "";
  const title = document.createElement("p");
  title.textContent = destinationName;
  Object.assign(title.style, {
    fontSize: "20px",
    fontWeight: "bold",
  });
  topnav.appendChild(title);
}

export function setupUI() {
  homeIcon.style.display = "initial";
  crossIcon.style.display = "none";
  autoSearchButton.style.display = "initial";

  if (!searchBox || !resultsDiv) return;

  const query = searchBox.value.trim();
  if (query.length === 0 && resultsDiv.innerHTML !== "") {
    resultsDiv.style.display = "none";
  }
}
