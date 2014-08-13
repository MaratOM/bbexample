define(["backbone"],
	function(Backbone) {

    var Screenshot = Backbone.Model.extend({
      defaults: {
				screenshotFid: 0,
        screenshotUri: '',
        movieNid: 0,
				thumbnailUri: '',
				previewUri: ''
      }
    });
		
		return Screenshot;
	});		