var scrollPos = 0;

var title = document.getElementById("title");
var subtitle = document.getElementById("subtitle");
var social = document.getElementById("social");
var header = document.getElementById("header");
var db = document.body;

window.onscroll = function() {
  if(window.innerWidth <= 800) {
    if (db.scrollTop > 5 || document.documentElement.scrollTop > 5) {
      title.setAttribute("hidden", "true");
      subtitle.setAttribute("hidden", "true");
      social.setAttribute("hidden", "true");
      header.classList.add("header-shrunk");
      if (db.scrollTop > 160 || document.documentElement.scrollTop > 160) {
        if ((db.getBoundingClientRect()).top > scrollPos ) {
          header.classList.remove("header-hidden");
	      } else {
          header.classList.add("header-hidden");
        }
        scrollPos = (db.getBoundingClientRect()).top;
      }
    } else {
      header.classList.remove("header-shrunk");
      title.removeAttribute("hidden", "");
      subtitle.removeAttribute("hidden", "");
      social.removeAttribute("hidden", "");
    }
  }
}
