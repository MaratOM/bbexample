define(["jquery", "underscore", "backbone", "ip/views/screenshot"],
	function($, _, Backbone, ScreenshotView) {

    var ScreenshotsView = Backbone.View.extend({
      events: {
      },      
  
      initialize: function() {
        _.bindAll(this, 'addOne', 'addAll', 'render');

        this.render();				
      },
  
      render: function() {
				this.collection.forEach(function(model) {
					this.$el.append(new ScreenshotView({model: model}).render().el)
				}, this);

        $('#screenshots').html(this.$el);				

				if(this.collection.length == 0) {
					this.noDocs();
        }
        
        return this;
      },
      
      noDocs: function() {
      }, 
  
      addOne: function(model) {
				//var element = new Screenshot({model: model}).render().el;
				//this.$el.append(element);
      },
  
      addAll: function() {

      },
      
      clear: function() {

      }
    });  
		
		return ScreenshotsView;
	});		