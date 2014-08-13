define(["backbone", "ip/models/screenshot"],
	function(Backbone, Screenshot) {

    var ScreenshotsList = Backbone.Collection.extend({
      model: Screenshot
    });
		
		return ScreenshotsList;
	});