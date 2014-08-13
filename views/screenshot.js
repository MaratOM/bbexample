define(["jquery", "underscore", "backbone","text!ip/templates/screenshot.html"],
	function($, _, Backbone, template) {

    var ScreenshotView = Backbone.View.extend({
			tagName: 'li',
			screenshotTemplate: _.template(template),
  
      events: {
				"click img" : "chooseScreenshot"
      },
  
      initialize: function() {
        _.bindAll(this, 'render');
      },
  
      render: function() {
        this.$el.html(this.screenshotTemplate(this.model.toJSON()));

        return this;
      },
			
      chooseScreenshot: function() {
        IpMain.Vent.trigger('screenshot-choosen', this.model);console.log(this.model);
      }			
    });
		
		return ScreenshotView;
	});		