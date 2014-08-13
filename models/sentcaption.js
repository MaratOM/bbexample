define(["backbone"],
	function(Backbone) {

    var SentCaption = Backbone.Model.extend({
      defaults: {
        movieTitle: '',
				subStartTime: 0
      }
    });
		
		return SentCaption;
	});		