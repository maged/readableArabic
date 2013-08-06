
//highlight fn based on :
/*highlight v3 - Modified by Marshal (beatgates@gmail.com) to add regexp highlight, 2011-6-24
 
Highlights arbitrary terms.
 
<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>
 
MIT license.
 
Johann Burkard
*/
//use antipattern to add css at nodes parent
var highlight = function(nodes, antipattern) {
	for (var node in nodes) {
		var pos = node.data.search(antipattern)

		if (pos >= 0 && node.data.length >= 0){

		}
	}

}



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