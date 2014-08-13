define(["jquery", "underscore", "backbone","text!ip/templates/word.html"],
	function($, _, Backbone, template) {

    var WordView = Backbone.View.extend({
			tagName: 'span',
			wordTemplate: _.template(template),
			editMode: false,			
  
      events: {
				"click" : "toggleWord"
      },
			
      initialize: function() {
        _.bindAll(this, 'render', 'toggleWord');
									
				this.listenTo(IpMain.Vent, "edit-sent", this.setEditMode);
				this.listenTo(IpMain.Vent, "word-choosen", this.toggleEditModeStyles);
      },
  
      render: function() {
        this.$el.html(this.wordTemplate(this.model.toJSON()));
				this.undelegateEvents();
				
        return this;
      },

      toggleWord: function() {
				if(this.model.get("canBeChecked")) {
					this.model.toggleChecked();
				}
				
				IpMain.Vent.trigger("word-choosen", null);
      },
			
			highlightCanBeCheckedWord: function() {
				this.$el.addClass('can-be-checked');
			},
			
			unHighlightCanBeCheckedWord: function() {
				this.$el.removeClass('can-be-checked');
			},
			
			
			highlightCheckedWord: function() {
				this.$el.addClass('checked');
			},
			
			unHighlightCheckedWord: function() {
				this.$el.removeClass('checked');
			},			

			toggleEditModeStyles: function() {
				if(this.editMode) {
					this.model.get("checked") ? this.highlightCheckedWord() : this.unHighlightCheckedWord();
					this.model.get("canBeChecked") ? this.highlightCanBeCheckedWord() : this.unHighlightCanBeCheckedWord();
				}
				else {
					this.unHighlightCanBeCheckedWord();
				}
			},			
			
			setEditMode: function() {
				this.editMode = !this.editMode;
				if(this.editMode) {
					this.delegateEvents();
				}
				else {
					this.undelegateEvents();
				}
				this.toggleEditModeStyles();
			}
    });
		
		return WordView;
	});		