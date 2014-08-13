define(["backbone", "ip/models/youtube"],
	function(Backbone, Youtube) {

    var Youtubes = Backbone.Collection.extend({
      model: Youtube
    });
		
		return Youtubes;
	});		