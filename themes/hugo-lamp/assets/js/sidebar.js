
function openSidebar() {
  var sidebar = document.getElementById("sidebar");
  var mask = document.getElementById("sidebar-mask");
  sidebar.setAttribute("open", "");
  mask.removeAttribute("hidden", "");
  mask.setAttribute("open", "");
}

function closeSidebar() {
  var sidebar = document.getElementById("sidebar");
  var mask = document.getElementById("sidebar-mask");
  sidebar.removeAttribute("open", "");
  mask.removeAttribute("open", "");
  mask.setAttribute("hidden", "");
}
