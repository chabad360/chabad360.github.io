(function() {
      'use strict';

  if(!document.queryCommandSupported('copy')) {
    return;
  }

  function flashCopyMessage(el, msg) {
    el.textContent = msg;
    setTimeout(function() {
      el.textContent = "Copy";
    }, 1000);
  }

  function selectText(node) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }

  function addCopyButton(containerEl) {
    var copyBtn = document.createElement("button");
    copyBtn.className = "highlight-copy-btn";
    copyBtn.textContent = "Copy";

    var codeEl = containerEl.firstElementChild;
    copyBtn.addEventListener('click', function() {
      try {
        var selection = selectText(codeEl);
        document.execCommand('copy');
        selection.removeAllRanges();

        flashCopyMessage(copyBtn, 'Copied!')
      } catch(e) {
        console && console.log(e);
        flashCopyMessage(copyBtn, 'Failed :\\')
      }
    });

    containerEl.appendChild(copyBtn);
  }

  // Add copy button to code blocks
  var highlightBlocks = document.getElementsByClassName('highlight');
  Array.prototype.forEach.call(highlightBlocks, addCopyButton);
})();
;
// When the user scrolls down 50px from the top of the document, resize the header's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if(window.innerWidth <= 800){
    if (document.body.scrollTop > 75 || document.documentElement.scrollTop > 75) {
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