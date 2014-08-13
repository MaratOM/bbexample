define(["backbone"],
	function(Backbone) {

    var Episode = Backbone.Model.extend({
      defaults: {
				season: 0,
				episode: 0,
				movieNid: 0
      }
    });
		
		return Episode;
	});		