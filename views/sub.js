define(["jquery", "underscore", "backbone","text!ip/templates/sub.html"],
	function($, _, Backbone, template) {

    var SubView = Backbone.View.extend({
			tagName: 'li',
			subTemplate: _.template(template),
  
      events: {
				"click" : "toggleSub"		
      },
			
  
      initialize: function() {
        _.bindAll(this, 'render', 'toggleSub');
				
				this.listenTo(IpMain.Vent, "search-effected", this.searchEffected);
				this.listenTo(IpMain.Vent, "sub-view-draw-class", this.toggleEditModeStyles);				
      },
  
      render: function() {
        this.$el.html(this.subTemplate({sub: this.model.toJSON(), searchHighlight : this.searchHighlight}));
				this.toggleEditModeStyles();

        return this;
      },

      toggleSub: function() {
				if(!this.model.get("sentImageNid")) {
					if(this.model.get("canBeChecked")) {
						this.model.toggleChecked();
						
						this.toggleEditModeStyles();
					}
				}
      },
			
			highlightCanBeCheckedSub: function() {
				this.$el.removeClass('alert-warning');				
				this.$el.addClass('can-be-checked alert alert-success');
			},
			
			unHighlightCanBeCheckedSub: function() {
				this.$el.removeClass('can-be-checked alert alert-success');
			},
			
			highlightCanNotBeCheckedSub: function() {
				this.$el.removeClass();
				this.$el.addClass('alert alert-warning');
			},			
			
			
			highlightCheckedSub: function() {
				this.$el.addClass('checked');
			},
			
			unHighlightCheckedSub: function() {
				this.$el.removeClass('checked');
			},			

			toggleEditModeStyles: function() {
				if(!this.model.get("sentImageNid")) {
					if(!this.model.get("checked") && !this.model.get("canBeChecked"))	{
						this.highlightCanNotBeCheckedSub();
					}
					else {
						this.model.get("checked") ? this.highlightCheckedSub() : this.unHighlightCheckedSub();
						this.model.get("canBeChecked") ? this.highlightCanBeCheckedSub() : this.unHighlightCanBeCheckedSub();						
					}
				}
			},		
			
      searchHighlight: function(textToHihglight, searchText) {
        if(searchText) {
          var startIndex = textToHihglight.indexOf(searchText);
          var splited = textToHihglight.split("");
          var line = '';
          for(var i in splited) {
            if(i == startIndex) line += '<span style="background:#7DC86D; color:white;">';						
            if(i == startIndex + searchText.length) line += '</span>';
            line += splited[i];
          }
        }
  
        return line;
      },
			
			searchEffected: function(searchResultsCollection) {
				if(searchResultsCollection === null
					  || searchResultsCollection.length === 0
					  || searchResultsCollection.length > 0 && !_.include(searchResultsCollection, this.model) 
					){
					this.model.set('searchFounds', {});	
				}

			}
    });
		
		return SubView;
	});		