/*
 
highlight v3 - Modified by Marshal (beatgates@gmail.com) to add regexp highlight, 2011-6-24
 
Highlights arbitrary terms.
 
<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>
 
MIT license.
 
Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>
 
*/
 
var highlight = function(nodes, pattern) {
    var regex = typeof(pattern) === "string" ? new RegExp(pattern, "i") : pattern; // assume very LOOSELY pattern is regexp if not string
    function innerHighlight(node, pattern) {
        var skip = 0;
        if (node.nodeType === 3) { // 3 - Text node
            var pos = node.data.search(regex);
            if (pos >= 0 && node.data.length > 0) { // .* matching "" causes infinite loop
                var match = node.data.match(regex); // get the match(es), but we would only handle the 1st one, hence /g is not recommended
                var spanNode = document.createElement('span');
                spanNode.className = 'highlight'; // set css
                var middleBit = node.splitText(pos); // split to 2 nodes, node contains the pre-pos text, middleBit has the post-pos

                var middleLength = match[0].length;
                for (var i = 1; i < middleBit.data.length; i++ ){
                    if ( middleBit.data.substring(i).search(regex) == 0 ) 
                        middleLength = middleLength + 1;
                }
                var endBit = middleBit.splitText(middleLength); // similarly split middleBit to 2 nodes
                var middleClone = middleBit.cloneNode(true);
                spanNode.appendChild(middleClone);
                // parentNode ie. node, now has 3 nodes by 2 splitText()s, replace the middle with the highlighted spanNode:
                middleBit.parentNode.replaceChild(spanNode, middleBit); 
                skip = 1; // skip this middleBit, but still need to check endBit
            }
        } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) { // 1 - Element node
            for (var i = 0; i < node.childNodes.length; i++) { // highlight all children
                i += innerHighlight(node.childNodes[i], pattern); // skip highlighted ones
            }
        }
        return skip;
    }
     
    return $.each(nodes, function() {
        innerHighlight(this, pattern);
    });
};
 
jQuery.fn.removeHighlight = function() {
    return this.find("span.highlight").each(function() {
        this.removeClass('highlight');});
};



/* 
    https://github.com/mawkor2/grepNodes

    iteratively binary search in dom for text using a string or regex and get the nodes containing it. avoid 'Maximum call stack size exceeded'! 
    http://ollierat.tumblr.com/

    by Brandon Hutchinson
*/
function grepNodes(searchText, frameId) {
  var matchedNodes = [];
  var regXSearch;
  if (typeof searchText === "string") {
    regXSearch = new RegExp(searchText, "g");
  }
  else {
    regXSearch = searchText;
  } 
  var currentNode = null, matches = null;
  if (frameId && !window.frames[frameId]) {
    return null;
  }
  var theDoc = (frameId) ? window.frames[frameId].contentDocument : document;
  var allNodes = (theDoc.all) ? theDoc.all : theDoc.getElementsByTagName('*');
  for (var nodeIdx in allNodes) {
    currentNode = allNodes[nodeIdx];
    if (!currentNode.nodeName || currentNode.nodeName === undefined) {
      break;
    }
    if (!(currentNode.nodeName.toLowerCase().match(/html|script|head|meta|link|object/))) {
      matches = currentNode.innerText.match(regXSearch);
      var totalMatches = 0;
      if (matches) {
        var totalChildElements = 0;
        for (var i=0;i<currentNode.children.length;i++) {
          if (!(currentNode.children[i].nodeName.toLowerCase().match(/html|script|head|meta|link|object/))) {
            totalChildElements++;
          }
        }
        matchedNodes.push({node: currentNode, numMatches: matches.length, childElementsWithMatch: 0, nodesYetTraversed: totalChildElements});
      }
      for (var i = matchedNodes.length - 1; i >= 0; i--) {
        previousElement = matchedNodes[i - 1];
        if (!previousElement) {
          continue;
        }
        if (previousElement.nodesYetTraversed !== 0 && previousElement.numMatches !== previousElement.childElementsWithMatch) {
          previousElement.childElementsWithMatch++;
          previousElement.nodesYetTraversed--;
        }      
        else if (previousElement.nodesYetTraversed !== 0) {
          previousElement.nodesYetTraversed--;
        }               
      }
    }
  }
  var processedMatches = [];
  for (var i =0; i <  matchedNodes.length; i++) {
    if (matchedNodes[i].numMatches > matchedNodes[i].childElementsWithMatch) {
      processedMatches.push(matchedNodes[i].node);
    }
  }
  return processedMatches; 
};