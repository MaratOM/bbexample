define(["backbone"],
	function(Backbone) {

    var Youtube = Backbone.Model.extend({
      defaults: {
				urlId: '',
				checked: false
      },

      toggleChecked: function() {
        this.set({'checked': !this.get("checked")});
      }		
    });
		
		return Youtube;
	});		