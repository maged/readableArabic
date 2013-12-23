
//highlight fn based on :
/*highlight v3 - Modified by Marshal (beatgates@gmail.com) to add regexp highlight, 2011-6-24

//-------------------------------------------------------
                /*Starting fresh*/
function getNodes(pattern) {
    if (typeof pattern == "string") {
        arabic_reg = new RegExp(pattern, "g");
    }
    else {
        arabic_reg = pattern;
    }

    allNodes = document.all;
    highlighted = [];

    for (var nodeid = 0; nodeid < allNodes.length; nodeid++) {
        currNode = allNodes[nodeid];

        if (!(currNode.nodeName.toLowerCase().match(/html|script|title|head|meta|link|object/))) {
            matches = currNode.innerText.match(arabic_reg);

            if (matches) {
                var matchInChild = false;
                for (var i = 0; i < currNode.children.length; i++) {
                    currChild = currNode.children[i];
                    if (currChild.innerText.match(arabic_reg)) {
                        matchInChild = true;
                    }
                }
                if (!matchInChild) {
                    var parent = currNode.parentNode;
                    var clone = currNode.cloneNode(true);

                    var en_reg = new RegExp("[a-zA-Z0-9]");
                    var antimatches = currNode.innerText.match(en_reg);
                    if (antimatches) { 
                        styledNodes = []; 
                        var innerText = currNode.innerText; // will be split, have safe copy 
                        currentLang = "";
                        prevLang = "";
                        var pos = 0;
                        for (var i = 0; i < innerText.length; i++){
                            if (innerText[i].match(arabic_reg)) {
                                currentLang = "ar";
                                if (currentLang != prevLang) {
                                    // split to 2 nodes, node contains the prepos text, nextNode has the postpos text
                                    var nextNode = splitText(currNode, pos); 
                                    pos -= currNode.innerText.length;
                                    $(nextNode).addClass('ar_highlight');

                                    parent.appendChild(currNode);
                                    currNode = nextNode; 
                                }
                            }
                            else if (innerText[i].match(en_reg)){
                                currentLang = "en";
                                if (currentLang != prevLang) {
                                    // split to 2 nodes, node contains the prepos text, nextNode has the postpos text
                                    var nextNode = splitText(currNode, pos); 
                                    pos -= currNode.innerText.length;

                                    parent.appendChild(currNode);
                                    currNode = nextNode;
                                }
                            }
                            prevLang = currentLang;
                            pos ++;
                        }
                    }
                    else {
                        highlighted.push(currNode)
                        $(currNode).addClass('ar_highlight');    
                    }
                }
            }
        }
    }
    return highlighted;
}

function splitText(node, pos){
    fulltext = currNode.innerText;
    node.innerText = fulltext.substring(0, pos);
    var spanNode = document.createElement('span');
    spanNode.innerText = fulltext.substring(pos, fulltext.length);
    return spanNode;
}

function rmHighlight(nodes) {
    $('.ar_highlight').removeClass('ar_highlight');
}
