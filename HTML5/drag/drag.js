window.onload = () => {

    var dragSrcEl = null;
    function handleDragStart(e) {
        console.log(e);
        this.style.opacity = '0.4';  // this / e.target is the source node.

        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }
      
        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
    }

    function handleDragEnter(e) {
        // this / e.target is the current hover target.
        this.classList.add('over');
    }
    
    function handleDragLeave(e) {
        this.classList.remove('over');  // this / e.target is previous target element.
    }

    function handleDragEnd (e) {
        [].forEach.call(cols, function (col) {
            col.classList.remove('over');
          });
    }

    function handleDrop (e) {
        // this / e.target is current target element.

        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // Don't do anything if dropping the same column we're dragging.
        if (dragSrcEl != this) {
            // Set the source column's HTML to the HTML of the columnwe dropped on.
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }
        return false;
    }
    

    var cols = document.querySelectorAll('#columns .column');
    [].forEach.call(cols, function(col) {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragend', handleDragStart, false);
        col.addEventListener('dragenter', handleDragStart, false);
        col.addEventListener('dragleave', handleDragStart, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
    }); 
    // use 'call' method to call foreach.




}



