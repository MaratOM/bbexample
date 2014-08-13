define(["jquery", "underscore", "backbone"],
	function($, _, Backbone) {

    var PreviewScreenshotView = Backbone.View.extend({
      events: {
      },
  
      initialize: function(options) {
        _.bindAll(this, 'render');

				this.parentView = options.parentView;
				
				IpMain.Vent.on('screenshot-choosen', this.screenshotChoosen, this);
				IpMain.Vent.on('button-clicked', this.buttonClicked, this);				
      },
  
      render: function() {
				this.$el.attr('src', this.model.get('previewUri'));
				this.parentView.$el.prepend(this.el);

        return this;
      },
			
      screenshotChoosen: function(model) {
        this.model = model;
				this.render();
      },
			
      buttonClicked: function() {
				IpMain.Vent.trigger("sent-data", {
					screenshotUri: this.model.get('screenshotUri'),
					screenshotFid: this.model.get('screenshotFid')
				});
      }
    });
		
		return PreviewScreenshotView;
	});		