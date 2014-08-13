define(["jquery", "underscore", "backbone", "text!ip/templates/sentedit.html"],
	function($, _, Backbone, template) {

    var SentCaption = Backbone.View.extend({
			tagName: 'a',
			className: 'btn btn-primary edit-sent',
      templateSentEdit: _.template(template),
			sentEditMode: false,	
      
      events: {
				"click"	: "editSent"				
      },
      
      initialize: function(options) {
        _.bindAll(this, 'render');
				
				this.parentView = options.parentView;
				
				IpMain.Vent.on('draw-canvas', this.editSentShow, this);
				IpMain.Vent.on('hide-canvas', this.editSentHide, this);
				
        this.render();
      },
      
      render: function() {
				this.$el.html(this.templateSentEdit());
				this.parentView.$el.append(this.el);

        return this;
      },
			
      editSent: function() {
				this.sentEditMode = !this.sentEditMode;
				if(this.sentEditMode) {
					this.editSentModeOn();
				}
				else {
					this.editSentModeOff();
				}
				IpMain.Vent.trigger("edit-sent", this.sentEditMode);
				
				return false;
      },
			
      resetEditSentMode: function() {
				if(this.sentEditMode) {
					this.sentEditMode = !this.sentEditMode;
					this.editSentModeOff();
				}
      },			
			
      editSentModeOn: function() {
				this.$el
						.removeClass('btn-primary').addClass('btn-success')
					.find('span')
						.removeClass('glyphicon-pencil').addClass('glyphicon-ok');
      },
			
      editSentModeOff: function() {
				this.$el
						.removeClass('btn-success').addClass('btn-primary')
					.find('span')
						.removeClass('glyphicon-ok').addClass('glyphicon-pencil');
      },			
			
      editSentShow: function() {
				this.$el.show();
      },
			
      editSentHide: function() {
				this.resetEditSentMode();
				this.$el.hide();
      }		
    });
		
		return SentCaption;
	});		