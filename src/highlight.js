function addHighlight() {
    console.log("UPDATED!!");

    var arabic_reg = new RegExp('[\u0600-\u06FF]', 'g');
    // Arabic or whitespace or punctuation.
    var arabic_plus_reg = new RegExp('[ .\u0600-\u06FF\p]');
    var span_head = '<span class="ar_highlight">'
    var span_tail = '</span>'

    var nodeIterator = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        function(node) {
            return node.className == "ar_highlight" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        });

    var curr_element;
    while (curr_element = nodeIterator.nextNode()) {
        var text = getText(curr_element);
        var matches = text.match(arabic_reg);

        var child_nodes = curr_element.childNodes;
        for (var j = 0; j < child_nodes.length; j++) {
            // Is it a text node?
            if (child_nodes[j].nodeType == 3 && 
                child_nodes[j].nodeValue.match(arabic_reg)) {
                var text_clone = child_nodes[j].nodeValue;
                for (var k = 0; k < child_nodes[j].nodeValue.length; k++) {
                    if (text_clone[k].match(arabic_reg)) {
                        var arabic_node = child_nodes[j].splitText(k);
                        for (k =0; k < arabic_node.nodeValue.length && arabic_node.nodeValue[k].match(arabic_plus_reg); k++) 
                            ;
                        var remaining = arabic_node.splitText(k);
                        var span = document.createElement('span');
                        span.className = 'ar_highlight';
                        span.appendChild(arabic_node);

                        curr_element.insertBefore(span, remaining);
                    }
                }
            }
        }
    }
}

function splitText(node, pos) {
    full_text = node.innerText;
    node.innerText = full_text.substring(0, pos);
    var span_node = document.createElement('span');

    span_node.innerText = fullText.substring(pos, full_text.length);
    return span_node;
}

function clone(array) {
    return array.slice(0);
}

/* 
 * Gets text belonging to current node,
 * not any of its children.
 * http://stackoverflow.com/a/6520212/1795795 
 */
function getText(node) {
    return $(node).clone() // clone the element
           .children()     // select all the children
           .remove()       // remove all the children
           .end()          // again go back to selected element
           .text();        // get the text of element
}

function rmHighlight(nodes) {
    $('.ar_highlight').removeClass('ar_highlight');
} 