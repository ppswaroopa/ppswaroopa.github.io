function on(a) {
  if (a == 1) {
    document.getElementById("sev-wea-det").style.display = "flex";
  }
  if (a == 2) {
    document.getElementById("autobot-det").style.display = "flex";
  }
  if (a == 3) {
    document.getElementById("astar-det").style.display = "flex";
  }
  if (a == 4) {
    document.getElementById("agrawal-lab-det").style.display = "flex";
  }
  document.querySelector('body').style.overflow = "hidden";
}

function off(b) {
  if (b == 1) {
    document.getElementById("sev-wea-det").style.display = "none";
  }
  if (b == 2) {
    document.getElementById("autobot-det").style.display = "none";
  }
  if (b == 3) {
    document.getElementById("astar-det").style.display = "none";
  }
  if (b == 4) {
    document.getElementById("agrawal-lab-det").style.display = "none";
  }
  document.querySelector('body').style.overflow = "auto";
}
  