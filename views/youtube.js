define(["jquery", "underscore", "backbone", "text!ip/templates/youtube.html", "text!ip/templates/p.youtube.html"],
	function($, _, Backbone, template, pTemplate) {

    var YoutubeView = Backbone.View.extend({
			tagName: 'li',
      youtubeTemplate: _.template(template),
			pYoutubeTemplate: _.template(pTemplate),

      events: {
				"click" : "toggleYoutube"
      },
			
      initialize: function() {
        _.bindAll(this, 'render', 'toggleYoutube');

				IpMain.Vent.on("search-effected", this.clear, this);
				IpMain.Vent.on("slider-moved", this.clear, this);
				IpMain.Vent.on("subscollection-changed", this.clear, this);
				IpMain.Vent.on("words-updated", this.wordsUpdatedClear, this);
				
				IpMain.Vent.on("youtube-checked", this.toggleHighlight, this);
				IpMain.Vent.on('button-clicked', this.buttonClicked, this);					
      },
  
      render: function() {
        this.$el.html(this.youtubeTemplate(this.model.toJSON()));

        return this;
      },
			
      toggleYoutube: function() {
				this.model.toggleChecked();
				IpMain.Vent.trigger("youtube-checked", this.model);
      },
			
      toggleHighlight: function(model) {
				if(this.model == model) {
					this.highlightSub();
					this.$el.find('input').attr('checked', true);
					this.setYoutubePreview();
				}
				else {
					this.unHighlightSub();
				}
      },
			
			setYoutubePreview: function() {
				$('#preview .youtube-video').remove();					
				$('#preview').append(this.pYoutubeTemplate(this.model.toJSON()));
			},			
			
			highlightSub: function() {
				this.$el.css('background', '#eeeeee');
			},
			
			unHighlightSub: function() {
				this.$el.css('background', '#ffffff');
			},
			
      buttonClicked: function() {
				if(this.model.get('checked')) {
					IpMain.Vent.trigger("sent-data", {youtube: this.model.get('urlId')});					
				}
      },
			
      wordsUpdatedClear: function(subModel) {
				if(subModel == null) {
					this.clear();
				}
      },				
			
      clear: function() {
				this.$el.empty();
				this.el.remove();
				$('#preview .youtube-video').remove();	
      }				
    });
		
		return YoutubeView;
	});		