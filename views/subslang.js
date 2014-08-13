define(["jquery", "underscore", "backbone", "ip/collections/subs", "text!ip/templates/subslang.html"],
	function($, _, Backbone, Subs, template) {

    var SubsLangView = Backbone.View.extend({
      templateLang: _.template(template),
      
      events: {
        "change select#langs"    : "getNewLang"
      },
      
      initialize: function(options) {
        _.bindAll(this, 'render', 'getNewLang');
				this.parentElSelector = options.parentElSelector;
				
        this.render();
      },
      
      render: function() {
        this.$el.html(this.templateLang({collectionModels: this.collection.models}));
				$(this.parentElSelector).append(this.el);
        
        return this;
      },
      
      getNewLang: function(e) {
				e.target = IpMain.eTarget(e);
				var lang = e.target.value;
				$.ajax({
					url: "/imageprocess/get-subs/" + Drupal.settings.ip.movieNid + "/" + lang,
					success: function(data){
						Drupal.settings.ip.movieTitle = data.movieTitle;
						Drupal.settings.ip.subsLang = null;
						Drupal.settings.ip.subsCollection = [];
						IpMain.Vent.trigger("subscollection-changed", data);
						IpMain.Vent.trigger("language-changed", data);						
					}
				});	
      } 
    });
		
		return SubsLangView;
	});		