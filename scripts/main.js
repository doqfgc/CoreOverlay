/*                                                                          ,,                    
  .g8"""bgd                           .g8""8q.                            `7MM                    
.dP'     `M                         .dP'    `YM.                            MM                    
dM'       ` ,pW"Wq.`7Mb,od8 .gP"Ya  dM'      `MM `7M'   `MF'.gP"Ya `7Mb,od8 MM   ,6"Yb.`7M'   `MF'
MM         6W'   `Wb MM' "',M'   Yb MM        MM   VA   ,V ,M'   Yb  MM' "' MM  8)   MM  VA   ,V  
MM.        8M     M8 MM    8M"""""" MM.      ,MP    VA ,V  8M""""""  MM     MM   ,pm9MM   VA ,V   
`Mb.     ,'YA.   ,A9 MM    YM.    , `Mb.    ,dP'     VVV   YM.    ,  MM     MM  8M   MM    VVV    
  `"bmmmd'  `Ybmd9'.JMML.   `Mbmmd'   `"bmmd"'        W     `Mbmmd'.JMML. .JMML.`Moo9^Yo.  ,V     
                                                                                          ,V      
                                                                                       OOb"         
	CoreOverlay ver.1.0.1
	made without blood or sweat, but a lot of tears by doc norberg

	main.js - the core code that powers all other components

	CoreOverlay is licensed under the terms of the MIT License; see the COPYING file for license details.
	CoreOverlay uses elements of Minified, which is in the Public Domain.
*/

// debug switch; disables transitions and sets active state automatically
// useful for final overlay placements
var debugswitch = true;


var MINI = require('minified'); 
var _=MINI._, $=MINI.$, $$=MINI.$$, EE=MINI.EE, HTML=MINI.HTML;

var inSpeed = 500;
var outSpeed = 500;
var cr1, cr2, p1, p2, s1, s2, r1w, r2w, r1l, r2l, mm, gg, olds1, olds2;
var updating = false;

// force the checkbox to get around the browser maintaining state between refreshes
var overlaystatus = false;
$('#overlaystatus').set('checked', false);

var faded = false;
var faded2 = false;
var inverted = false;
$('#inverted').set('checked', false);

// these are useful if you use score bars instead of score numbers
// var sc1 = ['.score11','.score12','.score13'];
// var sc2 = ['.score21','.score22','.score23'];

function statusdisp(err) {
	// statusdisp: 
	var g = [];
	g[0] = 'OK';
	g[11] = 'E 11: overlay is in the middle of updating';
	g[12] = 'E 12: can\'t send on a disabled overlay';

	$('#hol-status').set('innerHTML', g[err]);
}

function flashScore(parr) {
	// flashScore: when updating a score, put it through this function to flash the score a few times
	//             instead of just fading it in once.
	$(parr).animate({$$fade: 1}, 250).then(function() {
		$(parr).animate({$$fade: 0}, 250).then(function() {
			$(parr).animate({$$fade: 1}, 250).then(function() {
				$(parr).animate({$$fade: 0}, 250).then(function() {
					$(parr).animate({$$fade: 1}, 500);
				});
			});
		});
	});
}

function clearolcon() {
	// clearolcon: sets the overlay contents as empty strings. best used after disabling the overlay.
	$('#p1n').set("innerHTML", '');
	$('#p2n').set("innerHTML", '');
	$('#p1r').set("innerHTML", '');
	$('#p2r').set("innerHTML", '');
	$('#s1').set("innerHTML", '');
	$('#s2').set("innerHTML", '');
	$('#tt').set("innerHTML", '');
	$('#gg').set("innerHTML", '');
}

var CoreOverlay = {
	send: function(side, direction) {
	// send: take the current content of all inputs and send them directly to the overlay
	// useful for making changes to player names and set details
	// then update all items and run
	// send is also called when using the arrows to quick-update score, by using the side and direction local variables.

		// first, check if we're still updating and reject send until then
		if (updating) {
			statusdisp(11); return 11;
		}
		// next, check if we're not enabled and reject send until it's enabled
		if (!overlaystatus) {
			statusdisp(12); return 12;
		}
		switch (side) {
			case 'send':
				p1 = $('#ip1').get("value");
				p2 = $('#ip2').get("value");
				s1 = $('#is1').get("value");
				s2 = $('#is2').get("value");
				cr1 = $('#icr1').get("value");
				cr2 = $('#icr2').get("value");
				r1w = $('#ir1w').get("value");
				r2w = $('#ir2w').get("value");
				r1l = $('#ir1l').get("value");
				r2l = $('#ir2l').get("value");
				gg = $('#imm').get("value");
				mm = $('#igg').get("value");
				runUpdate();
				break;
		
			case 'left':
				if (direction == 'up') {
					$('#is1').set("value", ++s1);
					$('#ir1w').set("value", ++r1w);
					$('#ir2l').set("value", ++r2l);
					CoreOverlay.send('send');
				} else if (direction == 'down') {
					$('#is1').set("value", --s1);
					$('#ir1w').set("value", --r1w);
					$('#ir2l').set("value", --r2l);
					CoreOverlay.send('send');
				}
				break;
	
			case 'right':
				if (direction == 'up') {
					$('#is2').set("value", ++s2);
					$('#ir2w').set("value", ++r2w);
					$('#ir1l').set("value", ++r1l);
					CoreOverlay.send('send');
				} else if (direction == 'down') {
					$('#is2').set("value", --s2);
					$('#ir2w').set("value", --r2w);
					$('#ir1l').set("value", --r1l);
					CoreOverlay.send('send');
				}
				break;
			
			default:
				break;
		}
		statusdisp(0); return 0;
	},
	toggleOverlay: function () {
		// toggleOverlay: turns the overlay on and off. turning it on will also fire a Send.

		// the overlaystatus variable will be in sync with the #overlaystatus checkbox so this works
		if ( overlaystatus ) {
			updating = true;
			$('.p1la').set('$opacity', 0);
			$('.p2la').set('$opacity', 0);
			$('.p1nb').set('$width', '0px');
			$('.p2nb').set('$width', '0px');
			$('.bc').set('$width', '0px');
			$('.p1c').set('$opacity', 0);
			$('.p2c').set('$opacity', 0);
			$('#gg').set('$opacity', 0);
			$('#tt').set('$opacity', 0);
			$.wait(1500).then(function() {
				clearolcon();
				updating = false;
			});
			overlaystatus = false;
			statusdisp(0); return 0;
		} else {
			$('.p1c').set('$opacity', 1);
			$('.p2c').set('$opacity', 1);
			$.wait(100).then(function() {
				$('.bc').set('$width', '1000px');
				$.wait(300).then(function() {
					$('.p1nb').set('$width', '740px');
					$('.p2nb').set('$width', '740px');
					CoreOverlay.send('send');
				});
				$.wait(1500).then(function() {
					$('.p1la').set('$opacity', 0.5);
					$('.p2la').set('$opacity', 0.5);
				});
			});
			overlaystatus = true;
			statusdisp(0); return 0;
		}
	},
	switchp: function() {
		// switchp (can't call it switch): switches player, score, record and then re-sends.
		// takes immediate effect, except if the overlay isn't on

		// first, check if we're still updating and reject switchp until then
		if (updating) {
			statusdisp(11); return 11;
		}
		var pt, st, crt, rtw, rtl;
		if (overlaystatus) {
			pt = p1;
			st = s1;
			crt = cr1;
			rtw = r1w;
			rtl = r1l;
			p1 = p2;
			s1 = s2;
			cr1 = cr2;
			r1w = r2w;
			r1l = r2l;
			p2 = pt;
			s2 = st;
			cr2 = crt;
			r2w = rtw;
			r2l = rtl;
			$('#ip1').set("value", p1);
			$('#ip2').set("value", p2);
			$('#is1').set("value", s1);
			$('#is2').set("value", s2);
			$('#icr1').set("value", cr1);
			$('#icr2').set("value", cr2);
			$('#ir1w').set("value", r1w);
			$('#ir2w').set("value", r2w);
			$('#ir1l').set("value", r1l);
			$('#ir2l').set("value", r2l);
			CoreOverlay.send('send');
		} else {
			pt = $('#ip1').get("value");
			st = $('#is1').get("value");
			crt = $('#icr1').get("value");
			rtw = $('#ir1w').get("value");
			rtl = $('#ir1l').get("value");
			$('#ip1').set("value", $('#ip2').get("value"));
			$('#is1').set("value", $('#is2').get("value"));
			$('#icr1').set("value", $('#icr2').get("value"));
			$('#ir1w').set("value", $('#ir2w').get("value"));
			$('#ir1l').set("value", $('#ir2l').get("value"));
			$('#ip2').set("value", pt);
			$('#is2').set("value", st);
			$('#icr2').set("value", crt);
			$('#ir2w').set("value", rtw);
			$('#ir2l').set("value", rtl);
		}
		statusdisp(0); return 0;
	},
	invertColors: function() {
		// invertColors: flip the blacks and whites. useful for light stages where overlay visibility is poor.

		// enabling this if will silently return without actually inverting anything
		//if (!overlaystatus) {
		//	statusdisp(0); return 0;
		//}
		inverted = $('#inverted').get('checked');
		if (!inverted) {
			$('.pname').set('$color','#fff');
			$('.bc').set('$background-color','#000');
			$('.gtext').set('$color','#fff');
			$('.scorenum').set('$color','#fff');
		} else {
			$('.pname').set('$color','#000');
			$('.bc').set('$background-color','#fff');
			$('.gtext').set('$color','#000');
			$('.scorenum').set('$color','#000');
		}
	}
};

function runUpdate() {
	// runUpdate: function that actually updates the items on the overlay display.

	if ($('#p1n').get("innerHTML") != '<small>' + cr1 + '</small>' + p1) {
		updating = true;
		$('#p1n').set('$opacity', 0);
		$.wait(inSpeed).then(function() {
				$('#p1n').set("innerHTML", '<small>' + cr1 + '</small>' + p1);
				$('#p1n').set('$opacity', 1);
				$.wait(inSpeed).then(function() { updating = false; });
		});
	}

	if ($('#p2n').get("innerHTML") != '<small>' + cr2 + '</small>' + p2) {
		updating = true;
		$('#p2n').set('$opacity', 0);
		$.wait(inSpeed).then(function() {
				$('#p2n').set("innerHTML", '<small>' + cr2 + '</small>' + p2);
				$('#p2n').set('$opacity', 1);
				$.wait(inSpeed).then(function() { updating = false; });
			});
	}

	if ($('#s1').get("innerHTML") != s1) {
		updating = true;
		$('.p1s').animate({$$fade: 0}, outSpeed).then(function() {
			$('#s1').set("innerHTML", s1);
			$('.p1s').animate({$$fade: 1}, inSpeed);
			updating = false;
		});
	}

	if ($('#s2').get("innerHTML") != s2) {
        $('.dummy').animate({$$fade: 0}, 1).then(function() {
			updating = true;
			$('.p2s').animate({$$fade: 0}, outSpeed).then(function() {
				$('#s2').set("innerHTML", s2);
				$('.p2s').animate({$$fade: 1}, inSpeed);
				updating = false;
			});
		});
	}

	if ($('#gg').get("innerHTML") != gg) {
		updating = true;
		$('#gg').set('$opacity', 0);
		$.wait(inSpeed).then(function() {
				$('#gg').set("innerHTML", gg);
				$('#gg').set('$opacity', 1);
				$.wait(inSpeed).then(function() { updating = false; });
	    });
	}

	if ($('#tt').get("innerHTML") != mm) {
		updating = true;
		$('#tt').set('$opacity', 0);
		$.wait(inSpeed).then(function() {
				$('#tt').set("innerHTML", mm);
				$('#tt').set('$opacity', 1);
				$.wait(inSpeed).then(function() { updating = false; });
	    });
	}
}


