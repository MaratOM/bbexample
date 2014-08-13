define(["backbone"],
	function(Backbone) {

    var Sub = Backbone.Model.extend({
      defaults: {
        subStartTime: 0,
        subEndTime: 0,
				sentImageNid: 0,
				body: [],
				checked: false,
				canBeChecked: true
      },
			searchFounds: {
				lineIndex: null,
				searchIndexOf: null
			},
			searchText: '',
			
			
      getBodyLength: function() {
				var bodyLength = 0;
				_.each(this.get('body'), function(line) { bodyLength += line.length; });
				
				return bodyLength;
      },			
			
      toggleChecked: function() {
        this.set({'checked': !this.get("checked")});
				IpMain.Vent.trigger("sub-model-triggered", this);
      },
			
      getFlatBody: function() {
				var flatBody = [];
				
				_.each(this.get('body'), function(line) {
						flatBody = flatBody.concat(line.trim().split(' '));
					}
				, this);
				
				return flatBody;
      }			
    });
		
		return Sub;
	});		