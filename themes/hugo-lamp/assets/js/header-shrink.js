// When the user scrolls down 50px from the top of the document, resize the header's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if(window.innerWidth <= 800){
    if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
      document.getElementById("title").setAttribute("hidden", "true");
      document.getElementById("subtitle").setAttribute("hidden", "true");
      document.getElementById("social").setAttribute("hidden", "true");
      document.getElementById("header").classList.add("header-shrunk");
    } else {
      document.getElementById("header").classList.remove("header-shrunk");
      document.getElementById("title").removeAttribute("hidden", "");
      document.getElementById("subtitle").removeAttribute("hidden", "");
      document.getElementById("social").removeAttribute("hidden", "");
    }
  }
}