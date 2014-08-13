define(["backbone", "ip/models/word"],
	function(Backbone, Word) {

    var Words = Backbone.Collection.extend({
      model: Word,
			
			comparator: function(model) {
				return model.get("subStartTime");
			}				
    });
		
		return Words;
	});		