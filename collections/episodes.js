define(["backbone", "ip/models/episode"],
	function(Backbone, Episode) {

    var Episodes = Backbone.Collection.extend({
      model: Episode
    });
		
		return Episodes;
	});		