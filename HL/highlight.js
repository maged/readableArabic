//highlight fn based on :
/*highlight v3 - Modified by Marshal (beatgates@gmail.com) to add regexp highlight, 2011-6-24*/

function add_highlight() {
    //console.log("started highlight");

    // Arabic regexp match
    var arabic_reg = new RegExp('[\u0600-\u06FF]', "g");
    
    allNodes = document.all;
    highlighted = [];

    var en_reg = new RegExp("[a-zA-Z0-9]");

    for (var nodeid = 0; nodeid < allNodes.length; nodeid++) {
        currNode = allNodes[nodeid];

        if (!(currNode.nodeName.toLowerCase().match(/html|script|title|head|meta|link|object/))) {
            matches = currNode.innerText.match(arabic_reg);

            if (matches) {
                var matchInChild = false;
                var childrenlength = 0;  

                for (var i = 0; i < currNode.children.length; i++) {
                    childrenlength += currNode.children[i].innerText.length;
                    currChild = currNode.children[i];
                    if (currChild.innerText.match(arabic_reg)) {
                        matchInChild = true;
                    }
                }

                // does the current node have text outside its children? 
                var nonChildText = (currNode.innerText.length > childrenlength);

                if (!matchInChild || nonChildText) { 
                    /*
                     * none of the children have Arabic
                     * or the parent has text outside its children
                     * .: Arabic text may be solely in currNode 
                     */

                     if (nonChildText) {
                        // make text a seperate child
                        var spanNode = document.createElement('span');
                        
                        
                        // grabbing text not in child
                        // clever code from DotNetWala @
                        // http://stackoverflow.com/a/8851526/1795795
                        spanNode.innerText = $(currNode)
                                                .clone()    //clone the element
                                                .children() //select all the children
                                                .remove()   //remove all the children
                                                .end()  //again go back to selected element
                                                .text();
                        
                        if (spanNode.innerText.trim().length == 0){
                            continue;
                        }
                        currNode.appendChild(spanNode);

                        // we've mode the text to a span node
                        // now remove original
                        removeMyText(currNode);
                        
                        // apply Arabic style only to text not in children.
                        currNode = spanNode; 
                     }

                    var parent = currNode.parentNode;
                    // var clone = currNode.cloneNode(true);

                    var en_reg = new RegExp("[a-zA-Z0-9]");
                    var antimatches = currNode.innerText.match(en_reg);
                    if (antimatches) { 
                        // non-arabic in node as well -> split it

                        styledNodes = []; 
                        var innerText = currNode.innerText; // will be split, have safe copy 

                        // TODO: use constants, strings are performance heavy ya goon
                        currentLang = "";
                        prevLang = "";
                        var pos = 0;
                        for (var i = 0; i < innerText.length; i++) {
                            if (innerText[i].match(arabic_reg)) {
                                currentLang = "ar";
                                if (currentLang != prevLang) {
                                    // split to 2 nodes, currNode contains the pre-pos text, nextNode has the post-pos text
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

                        parent.appendChild(currNode);
                    }
                    else { // no inner English
                        highlighted.push(currNode)
                        $(currNode).addClass('ar_highlight');
                    }
                }
            }
        }
    }

    //console.log("eneded highlight"); // is it atomic?
    return highlighted;
}


function splitText(node, pos){
    fulltext = currNode.innerText;
    node.innerText = fulltext.substring(0, pos);
    var spanNode = document.createElement('span');
    spanNode.innerText = fulltext.substring(pos, fulltext.length);
    return spanNode;
}


function rm_highlight(nodes) {
    $('.ar_highlight').removeClass('ar_highlight');
}

function removeMyText(node) {
    //clone the node's children

    //remove the original 

    //
} 