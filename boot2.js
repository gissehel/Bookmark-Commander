$(document).ready(function () {

	commander.boot()
	menu.init();

	/* EVIL Mac Fix */
	if( navigator.userAgent.has( "Mac" ) )
	{
		//Replace ═ with =, cause silly Mac OS
		$("#h2").text( function(index, oldtext) { return oldtext.replace( /═/gi , "=" ) });
		$("#h3").text( function(index, oldtext) { return oldtext.replace( /═/gi , "=" ) });
		$("#options").text( function(index, oldtext) { return oldtext.replace( /═/gi , "=" ) });
	}

	/* most anything happens here, definitely all the stuff with keymaps */
	$(document).keydown( function( event )
	{
		//document.getElementById("end").innerHTML = ("Key: " + event.which).extend( screenwidth - 91 );

		if( key_mapping.escape && event.which != 27)
		{
			if( escape_mapping[ event.which ] )
				event.which = escape_mapping[ event.which ];
		}

		//Remember whether we presssed escape for the next time
		key_mapping.escape = ( event.which == 27 );

		if( key_mapping[ event.which ] )
		{
			key_mapping[ event.which ]( event );
			return false;
		}

		return true;
	});

	/* Cleaning of js code and other salient stuff happens here */
	$(document).keyup( function( event )
	{
		if( commander.editing )
			editor.considerTextAreas();
	});

	/* Evil mouse code*/
	mouse.init();

});
