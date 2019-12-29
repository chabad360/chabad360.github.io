Array.prototype.slice.call(
        document.getElementsByClassName('js-img')
    ).forEach(function(asyncImgNode) {
        var fullImg = new Image()
        fullImg.src = asyncImgNode.dataset.src;
        fullImg.onload = function() {
            asyncImgNode.classList.remove('js-img');
            asyncImgNode.src = asyncImgNode.dataset.src;
        };
    }
);
