define(["backbone"],
	function(Backbone) {

    var Word = Backbone.Model.extend({
      defaults: {
				body: '',
				subStartTime: 0,
				index: 0,
				checked: false,
				canBeChecked: false
      },

      toggleChecked: function() {
        this.set({'checked': !this.get("checked")});
				IpMain.Vent.trigger("word-model-triggered", this);
      }			
    });
		
		return Word;
	});		