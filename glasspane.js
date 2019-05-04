
  /* These codes were retrieved from http://www.utf8-chartable.de/unicode-utf8-table.pl ( box drawing )
   ┌─┬─┐  ╔═╦═╗
   ├─┼─┤  ╠═╬═╣
   │ │ │  ║ ║ ║
   └─┴─┘  ╚═╩═╝
  */

      // EVIL Mac Fix
      if( navigator.userAgent.has( "Mac" ) )
        doublebar = '=';

      //Menu
      //Note the relative position and z-index, without this the dropdown would overlap the menu
      //and menu events would not trigger
      document.writeln( "<span id='menu' class='menu' style='position:relative;z-index:2'>" + ("  Left     File     Command     Options     Right").extend() + "</span>" );

      //Box Top, missing span here !, it's below now to fill up white spots
      document.writeln( "<span class='border'><span id='h1'><span id='leftroot'></span><span id='riteroot'></span></span>" );

      //Entries
      for( var counter = 0 ; counter < panelheight ; counter++ )
      {
        document.write(   "║<span id='left" + counter + "' class='border'>" + " ".repeat(panelwidth) + "</span>║" );
        document.writeln( "║<span id='rite" + counter + "' class='border'>" + " ".repeat(panelwidth) + "</span>║" );
      }

      //Box Bottom
      document.writeln(  "<span id='h2'>╠" + "═".repeat(panelwidth) + "╩╩" + "═".repeat(panelwidth) + "╣</span>" );
      document.writeln(  "║<span id='url'>" + " ".repeat((panelwidth+1)*2) + "</span>║" );
      document.writeln(  "<span id='h3'>╚" + "═".repeat((panelwidth+1)*2) + "╝" + "</span></span>" );

      var function_keys =
      [
        { id : 1 ,  description : "Help  " },
        { id : 2 ,  description : "Mirror" },
        { id : 3 ,  description : "View  " },
        { id : 4 ,  description : "Edit  " },
        { id : 5 ,  description : "Copy  " },
        { id : 6 ,  description : "Move  " },
        { id : 7 ,  description : "Mkdir " },
        { id : 8 ,  description : "Delete" },
        { id : 9 ,  description : "PullDn" },
        { id : 10 , description : "Quit  " },
      ];


      for( key in function_keys )
      {
        var f = function_keys[key];
        document.write( "<span class='fcode'>F" + f.id + "</span><span class='menu' id='f" + f.id + "'>" + f.description + "</span><span class='fcode'> </span>" );
      }
      document.writeln( "<span id='end' class='fcode'>" + " ".repeat( screenwidth - 91 ) + "</span>" );
