require.config({
		baseUrl: '/sites/all/modules/films',		
    paths:{
        'domready': '../../libraries/domready/domready',
				'text': '../../libraries/require/text',
				'jquery': '../jquery_update/replace/jquery/1.8/jquery.min',
				'jqueryui': '../../libraries/jqueryui/jquery-ui.min',
				'jquerycookie': '../../libraries/jquery.cookie/jquery.cookie',				
				'jquerytoggles': '../../libraries/jquery.toggles/toggles.min',
        'underscore': '../../libraries/underscore/underscore-min',
        'backbone': '../../libraries/backbone/backbone-min',
        'marionette': '../../libraries/marionette/backbone.marionette',					
				'ip': 'imageprocess/js'
    },
  shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'  
        },
        'marionette': {
            deps: ['underscore', 'jquery', 'backbone'],
            exports: 'Marionette'  
        },
        'jquerycookie': {
            deps: ['jquery'],
            exports: 'cookie'  
        },
        'jquerytoggle': {
            deps: ['jquery'],
            exports: 'toggle'  
        }	
  }
});

require(["domready", "marionette", "ip/router"], function(domReady, Marionette, router) {
  domReady(function () {
		window.IpMain = new Backbone.Marionette.Application() || {};
		IpMain.framework = 'bootstrap';
		IpMain.Vent = IpMain.Vent || {};
		IpMain.eTarget = function(e) {
		  var target;
		  if(e.target) {
		  	target = e.target;
		  }
		  else {
		  	target = window.e.srcElement;
		  }
			
			return target;
		};		
		IpMain.subsPerPage = 30;
		_.extend(IpMain.Vent, Backbone.Events);
		
		//$('.ip.nav-tabs a').click(function() {
		//	var thisEl = $(this);
		//	if(thisEl.attr('href') == '#preview-tab') {
		//		$('#ip-tabs').hide();
		//		$('#preview-wrapper').removeClass('col-sm-6').addClass('col-sm-10 col-sm-offset-2');
		//		IpMain.Vent.trigger("position-borders", true);
		//		IpMain.Vent.trigger("redraw-canvas", null);
		//	}
		//	else if($('.ip.nav-tabs li.active a').attr('href') == '#preview-tab') {
		//		$('#ip-tabs').show();
		//		$('#preview-wrapper').addClass('col-sm-6').removeClass('col-sm-10 col-sm-offset-2');
		//		IpMain.Vent.trigger("position-borders", false);				
		//		IpMain.Vent.trigger("redraw-canvas", null);
		//	}			
		//});
		//
		//$(window).resize(function() {
		//	IpMain.Vent.trigger("position-borders", false);				
		//	IpMain.Vent.trigger("redraw-canvas", null);
		//});
				
		IpMain.intToTime = function(sliderTimerCurrentValue) {
			var sliderTimerCurrentSeconds = Math.floor(sliderTimerCurrentValue % 60);
			sliderTimerCurrentSeconds = sliderTimerCurrentSeconds < 10 ? '0' + sliderTimerCurrentSeconds : sliderTimerCurrentSeconds;		
			var sliderTimerCurrentMinutes = Math.floor(sliderTimerCurrentValue / 60) % 60;
			sliderTimerCurrentMinutes = sliderTimerCurrentMinutes < 10 ? '0' + sliderTimerCurrentMinutes : sliderTimerCurrentMinutes;		
			var sliderTimerCurrentHours = Math.floor(sliderTimerCurrentValue / 60 / 60);				
			var sliderTimerCurrentOutputValue = sliderTimerCurrentHours + ':' + sliderTimerCurrentMinutes + ':' + sliderTimerCurrentSeconds
			return sliderTimerCurrentOutputValue;		
		}	

    new router();
    Backbone.history.start();
  });
});	