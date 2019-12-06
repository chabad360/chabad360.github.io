var e=0;var d=document.getElementById("title");var n=document.getElementById("subtitle");var i=document.getElementById("social");var r=document.getElementById("header");var h=document.body;window.onscroll=function(){if(window.innerWidth<=800){if(h.scrollTop>5||document.documentElement.scrollTop>5){d.setAttribute("hidden","true");n.setAttribute("hidden","true");i.setAttribute("hidden","true");r.classList.add("header-shrunk");if(h.scrollTop>160||document.documentElement.scrollTop>160){if(h.getBoundingClientRect().top>e){r.classList.remove("header-hidden")}else{r.classList.add("header-hidden")}e=h.getBoundingClientRect().top}}else{r.classList.remove("header-shrunk");d.removeAttribute("hidden","");n.removeAttribute("hidden","");i.removeAttribute("hidden","")}}};

//var scrollPos = 0;

//var title = document.getElementById("title");
//var subtitle = document.getElementById("subtitle");
//var social = document.getElementById("social");
//var header = document.getElementById("header");
//var db = document.body;

//window.onscroll = function() {
//  if(window.innerWidth <= 800) {
//    if (db.scrollTop > 5 || document.documentElement.scrollTop > 5) {
//      title.setAttribute("hidden", "true");
//      subtitle.setAttribute("hidden", "true");
//      social.setAttribute("hidden", "true");
//      header.classList.add("header-shrunk");
//      if (db.scrollTop > 160 || document.documentElement.scrollTop > 160) {
//        if ((db.getBoundingClientRect()).top > scrollPos ) {
//          header.classList.remove("header-hidden")
//	      } else {
//          header.classList.add("header-hidden");
//        }
//        scrollPos = (db.getBoundingClientRect()).top;
//      }
//    } else {
//      header.classList.remove("header-shrunk");
//      title.removeAttribute("hidden", "");
//      subtitle.removeAttribute("hidden", "");
//      social.removeAttribute("hidden", "");
//    }
//  }
//}
