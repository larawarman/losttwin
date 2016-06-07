/* custom js c/o lara warman – twitter.com/larawarman */

$(document).ready(function() {

//////  SOUNDCLOUD PLAYER //////
/* initialize soundmanager */
	soundManager.url = 'script/swf/';
	soundManager.flashVersion = 9;
	soundManager.useFlashBlock = false;
	soundManager.useHighPerformance = true;
	soundManager.wmode = 'transparent';
	soundManager.useFastPolling = true;
	//soundManager.preferFlash = false;
	soundManager.onready(function() {
		
		var consumer_key = "09e017316a6b18e98bcc9c98fe0c35c7",
			url = "https://soundcloud.com/losttwin-1/sets/whirlpool";		
		
		$.getJSON('http://api.soundcloud.com/resolve?url=' + url + '&format=json&consumer_key=' + consumer_key + '&callback=?', function(playlist){
			$('.title').text(playlist.tracks[0].title);			
			$.each(playlist.tracks, function(index, track) {
				$('<li>' + track.title + '</li>').data('track', track).appendTo('.tracks').addClass("song"+(index+1));
				// * Get appropriate stream url depending on whether the playlist is private or public.
				// * If the track includes a *secret_token* add a '&' to the url, else add a '?'.
				// * Finally, append the consumer key and you'll have a working stream url.
				url = track.stream_url;
				(url.indexOf("secret_token") == -1) ? url = url + '?' : url = url + '&';
				url = url + 'consumer_key=' + consumer_key;
				
				soundManager.createSound({
					id: 'track_' + track.id,
					url: url,
					onplay: function() {
						$('.player').addClass('playing');
						$('.title').text(track.title);
					},
					onresume: function() {
						$('.player').addClass('playing');
					},					
					onpause: function() {
						$('.player').removeClass('playing');
					},
					onfinish: function() {
						nextTrack();
					},
					whileplaying: function() {
   			 			//console.log("hi");
   			 			$(".playhead").css('width', ((this.position/this.duration) * 100) + '%');
        			}
				});
			});
		});

		/* hide the tracklist since we're playing it from the image */
		// $('.tracks').hide();
		
		/*function to play the sound*/
		var playtrack = function(){
			var $track = $(this),
				data = $track.data('track'),
				playing = $track.is('.active');
			if (playing) {				
				soundManager.pause('track_' + data.id);				
			} else {
				if ($track.siblings('li').hasClass('active')) { 
					soundManager.stopAll(); 
				}
				soundManager.play('track_' + data.id);
			}	
			$track.toggleClass('active').siblings('li').removeClass('active');
		}

		
		/* play the sound when clicking on the list element */
		$('.player').on("click", ".tracks li", playtrack);
		
		/* set up play/pause, prev, next buttons in the interface */
		$('body').on("click", '.play, .pause', function(){
			if ( $('li').hasClass('active') == true ) {
				soundManager.togglePause( 'track_' + $('li.active').data('track').id );	
			} else {
				$('.tracks li:first').click();
			}
		});
		
		$('.next').on('click', function(){
			nextTrack();
		});
				
		$('.prev').on('click', function(){
			prevTrack();
		});
		
		/* functions for next, prev */
		var nextTrack = function(){
			soundManager.stopAll();
			if ( $('li.active').next().click().length == 0 ) {
				$('.tracks li:first').click();
			}
		}

		var prevTrack = function(){						
			soundManager.stopAll();
			if ( $('li.active').prev().click().length == 0 ) {
				$('.tracks li:last').click();
			}
		}

		var playhead = function(){						
			console.log(this.position);
			//$(".playhead").css('width', ((this.position/this.duration) * 100) + '%');
		}
		 
	}); /* end soundmanager */


//////  ANIMATION //////

	////*** these vars can be changed to affect animation. Z's are vanishing point, speeds are ms to complete animation
	var spaceZ1 = -10000;
	var spaceZ2 = -10200;
	var speed1 = 10000;
	var speed2 = 200;



	////*** calculate browser width/height
	//var wwidth = $(window).width();
	//var wheight = $( window ).height();
	 var wwidth;
	 var wheight;
	 var theResize = function(){
	 	wwidth = $(window).width();
	 	wheight = $( window ).height();
	 	console.log('width: ' + wwidth + ' / height: ' + wheight);
	 }


	////*** array of images
	var spacejunk = [
		'plane.png',
		'rocket.png',
		'rover.png',
		'soyuz.png',
		'space-coaster.png',
		'spaceMan.png',
		'submarine.png'
		// 'apu.png',
		// 'barney.png',
		// 'bart.png',
		// 'burns.png',
		// 'captain-pete.png',
		// 'carl.png',
		// 'chief-wiggum.png',
		// 'dolph.png',
		// 'dr-hibbert.png',
		// 'dr-marvin-monroe.png',
		// 'grandpa.png',
		// 'groundskeeper-willie.png',
		// 'helen-lovejoy.png',
		// 'homer.png',
		// 'itchy.png',
		// 'jasper.png',
		// 'jimbo-jones.png',
		// 'kearney.png',
		// 'kent-brockman.png',
		// 'krusty.png',
		// 'lenny.png',
		// 'lionel-hutz.png',
		// 'lisa.png',
		// 'maggie.png',
		// 'marge.png',
		// 'martin.png',
		// 'maude.png',
		// 'mayor-quimby.png',
		// 'mcbain.png',
		// 'millhouse.png',
		// 'miss-hoover.png',
		// 'moe.png',
		// 'mrs-krabapell.png',
		// 'ned.png',
		// 'nelson.png',
		// 'otto.png',
		// 'patty.png',
		// 'selma.png',
		// 'sherri.png',
		// 'sideshow-bob.png',
		// 'sideshow-mel.png',
		// 'smithers.png',
		// 'snake.png',
		// 'snowball-II.png',
		// 'terri.png',
		// 'todd.png',
		// 'troy-mcclure.png'
	]

	var spacejunksize = spacejunk.length;

	////*** create some numbers to start the space junk randomly outside of the browser
	var randX;
	var randY;
	
	var randPositions = function(){
		randX = Math.floor(Math.random()*wwidth) + 1; // this will get a number between 1 and 99;
		randX *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
		//console.log('randX: ' + randX);

		if (randX > 0 && randX < wwidth){
			randY = Math.floor(Math.random()*wheight) + 1;
			randY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
			//console.log('randY: ' + randY);
		}
		else {
			randY = -1 * (Math.floor(Math.random()*wheight));
			//console.log('else randY: ' + randY);
		}
	}
	
	////*** set the container to be full width

	var randJunk;
	var randJunkChoose = function(){
		randJunk = (Math.floor(Math.random()*spacejunksize));
	}

	
	var sendJunk = function(){
		randJunkChoose();
		randPositions();
		$('#animaniacs').append("<div class='junk " + randJunk + "'></div>");
		$('.' + randJunk).css({
			'background' : 'url(images/spacejunk/' + spacejunk[randJunk] + ') no-repeat',
			'background-size':'100%', 
			'display':'block', 
			'top':randY + 'px', 
			'left':randX + 'px'
			}).animate({ translateZ: spaceZ1 }, speed1, function(){
				$(this).animate ({ translateZ: spaceZ2, opacity: 0.0 }, speed2);
		});
	}

	////*** set it all up!
	var letsgo;
	var runthisthing = function(){
		theResize();
		$("#animaniacs").css({'width':wwidth,'height':wheight});
		randPositions();
		randJunkChoose();
		sendJunk();
		letsgo = setInterval(function(){sendJunk()}, 4000);
	}

	runthisthing();
	

	////*** and, if someone tries to resize...
	function debouncer( func , timeout ) {
	   var timeoutID , timeout = timeout || 200;
	   return function () {
	      var scope = this , args = arguments;
	      clearTimeout( timeoutID );
	      timeoutID = setTimeout( function () {
	          func.apply( scope , Array.prototype.slice.call( args ) );
	      } , timeout );
	   }
	}
	
	$( window ).resize( debouncer( function ( e ) {
	 	clearInterval(letsgo);
		runthisthing();
	 }));

});