define(["jquery", "underscore", "backbone", "text!ip/templates/subsinuse.html"],
	function($, _, Backbone, templateSubsInUse) {

    var LayoutView = Backbone.View.extend({
      el: '.main-container',
			
			templateSubsInUse: _.template(templateSubsInUse),
			
      events: {
        "click .ip.nav-tabs a"    : "handlePreviewSize"		
      },
      
      initialize: function() {
        _.bindAll(this, 'render');
				
				IpMain.Vent.on("subs-in-use", this.subInUseError, this);
				IpMain.Vent.on("language-changed", this.changeMovieTitle, this);	

        this.render();
      },
      
      render: function() {
				$(window).resize(function() {
					IpMain.Vent.trigger("position-borders", false);				
					IpMain.Vent.trigger("redraw-canvas", null);
				});
      },
			
      handlePreviewSize: function(e) {
				var thisEl = $(IpMain.eTarget(e));
				if(thisEl.attr('href') == '#preview-tab') {
					$('#ip-tabs').hide();
					$('#preview-wrapper').removeClass('col-sm-6').addClass('col-sm-10 col-sm-offset-2');
					IpMain.Vent.trigger("position-borders", true);
					IpMain.Vent.trigger("redraw-canvas", null);
				}
				else if($('.ip.nav-tabs li.active a').attr('href') == '#preview-tab') {
					$('#ip-tabs').show();
					$('#preview-wrapper').addClass('col-sm-6').removeClass('col-sm-10 col-sm-offset-2');
					IpMain.Vent.trigger("position-borders", false);				
					IpMain.Vent.trigger("redraw-canvas", null);
				}			
      },
			
      subInUseError: function() {
				this.$el.prepend(this.templateSubsInUse());
      },
			
      changeMovieTitle: function(newData) {
				this.$('h1.page-header').html(newData.movieTitle);
      }				
    });
		
		return LayoutView;
	});		