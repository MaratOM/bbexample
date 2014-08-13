define(["backbone", "ip/models/lang"],
	function(Backbone, Lang) {

    var Langs = Backbone.Collection.extend({
      model: Lang
    });
		
		return Langs;
	});