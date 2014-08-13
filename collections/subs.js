define(["backbone", "ip/models/sub"],
	function(Backbone, Sub) {

    var Subs = Backbone.Collection.extend({
      model: Sub,
			searchText: '',
			
      search: function() {
        return this.filter(function(model){
					var bodyText = false,
							searchIndexOf,
							subModel = model;
					_.each(model.get('body'), function(line, index) {
						searchIndexOf = line.indexOf(this.searchText);
						if(searchIndexOf != -1) {
							subModel.set({
								'searchFounds': {'lineIndex': index, 'searchIndexOf': searchIndexOf},
								'searchText': this.searchText
							});
							bodyText = true; 
						}
					}, this);

					return bodyText;
				}, this);				
      },
			
			comparator: function(model) {
				return model.get("subStartTime");
			}			
    });
		
		return Subs;
	});		