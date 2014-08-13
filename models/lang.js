define(["backbone"],
	function(Backbone) {

    var Lang = Backbone.Model.extend({
      defaults: {
				langName: ''
      }
    });
		
		return Lang;
	});		