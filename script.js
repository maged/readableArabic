var on = false; 
var doneOnce = false;
$( document ).ready(function() {
	chrome.runtime.sendMessage( {greeting : "hey"}, function(response) {
		;//nothing special
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  	if (!on){
	  		if ( doneOnce )
	  			$( '.highlight' ).css('background-colour', 'red');

	  		
	  		nodes = grepNodes('[\u0600-\u06FF]');
	  		highlight(nodes, '[\u0600-\u06FF]');
	  		doneOnce = true; 
	  		//combineHL();
	  	}
	  		
	  	else
	  		//$( '.highlight' ).css('background-colour', 'white');
			$(':parent').removeHighlight();
		on = !on; 
});	
/*
combineHL = function () { 
    $('.highlight').each( function( index, ele )  {
        var firstEle = ele; 
        while ( $( ele ).next().hasClass('highlight') ) 
        {
            $( ele ).parentElement.remove();
            ele = $( ele ).next();
        }
        $(firstEle).prepend( '<span class="highlight">' )
        $(ele).append('</span>')

    })  
}*/