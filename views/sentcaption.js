define(["jquery", "underscore", "backbone", "text!ip/templates/sentcaption.html"],
	function($, _, Backbone, template) {

    var SentCaption = Backbone.View.extend({
			subsStartTimes: [],
			
      templateSentCaption: _.template(template),
      
      events: {
      },
      
      initialize: function(options) {
        _.bindAll(this, 'render');

				this.parentView$El = options.parentView$El;
				
				IpMain.Vent.on("search-effected", this.clear, this);
				IpMain.Vent.on("slider-moved", this.clear, this);
				IpMain.Vent.on("subscollection-changed", this.clear, this);
				IpMain.Vent.on("language-changed", this.changeMovieTitle, this);					
				IpMain.Vent.on("words-updated", this.setSubStartTime, this);

        this.render();
      },
      
      render: function() {
				this.parentView$El.append(this.el);

        return this;
      },
			
      changeMovieTitle: function(data) {
				this.model.set('movieTitle', data.movieTitle);
      },			
			
      setSubStartTime: function(subModel) {
				if(subModel == null) {
					this.clear();
					
					IpMain.Vent.trigger("scroll-allow", true);					
				}
				else {
					if(Drupal.settings.ip.serialNid) {
						var seasonEpisodeLine =
							'season ' + Drupal.settings.ip.season + '  ' +
							'episode ' + Drupal.settings.ip.episode + '  ';
					}
					this.model.set('subStartTime', IpMain.intToTime(subModel.get('subStartTime')));
					this.$el.html(this.templateSentCaption({model: this.model.toJSON(), seasonEpisodeLine: seasonEpisodeLine}));
					
					IpMain.Vent.trigger("scroll-allow", false);
				}
      },

      clear: function() {
				this.$el.empty();
      }				
    });
		
		return SentCaption;
	});		