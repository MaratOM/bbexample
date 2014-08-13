define(["jquery", "underscore", "backbone", "ip/models/sub", "ip/collections/subs", "text!ip/templates/subssearch.html"],
	function($, _, Backbone, Sub, Subs, template) {

    var SubsSearchView = Backbone.View.extend({
			$subsSearch: null,
			searchText: '',
			$button: null,
			searchButtonDisabled: false,
			searchResultsCollection: new Subs,
  
      templateSearch: _.template(template),
      
      events: {
        "input #subs-search"    : "docSearch",
        "change #serial-search" : "serialSearch",				
        "click .clear-search"   : "clearSearch"
      },
      
      initialize: function(options) {
        _.bindAll(this, 'render', 'docSearch');
				this.parentElSelector = options.parentElSelector;				
				
				IpMain.Vent.on("slider-moved", this.disableButton, this);
				IpMain.Vent.on("subscollection-changed", this.subsCollectionChanged, this);						
				IpMain.Vent.on("subscollection-changed-collection", this.subsCollectionChangedCollection, this);		
        this.render();
      },
      
      render: function() {
				this.setFullCollection();
				
        this.$el.html(this.templateSearch({}));
				$(this.parentElSelector).append(this.el);
				
				this.$subsSearch = this.$("#subs-search");
				this.$button = this.$el.find('.button');
				this.$spinner = this.$el.find('.spinner');
				this.$spinner.hide();
        
        return this;
      },
			
      setFullCollection: function() {
				this.fullCollection = _.clone(this.collection);
      },
			
      subsCollectionChangedCollection: function(newCollection) {
				this.collection = newCollection;
				this.setFullCollection();
      },				
      
      docSearch: function() {
        this.searchText = this.$subsSearch.val() || undefined;
        
        //if(this.searchText) {
				if(this.searchText && this.searchText.length > 2) {
					this.searchResultsCollection.reset();
          this.fullCollection.searchText = this.searchText;
          _.each(this.fullCollection.search(), function(model){
						this.searchResultsCollection.add(model);
          }, this);
					IpMain.Vent.trigger("search-effected", this.searchResultsCollection);
        }
        else {
					IpMain.Vent.trigger("search-effected", null);
        }

				this.toggleButtonDisabled();
      },
			
			serialSearch: function(e) {
				e.target = IpMain.eTarget(e);
				viewThis = this;
				if(e.target.checked) {
					this.$spinner.show('fast', function() {
						viewThis.serialSearchAjax(e);
					});
				}
				else {
					viewThis.serialSearchAjax(e);
				}
			},
			
      serialSearchAjax: function(e) {
				viewThis = this;
				if(e.target.checked) {
						$.ajax({
							async: false,						
							url: "/imageprocess/get-subs/" + Drupal.settings.ip.serialNid + "/" + Drupal.settings.ip.subsLang,
							success: function(data){
								Drupal.settings.ip.subsCollection = [];
								viewThis.subsCollectionChangedCollection(new Subs(_.map(data.subsCollection, function(sub){ return new Sub(sub); })));
								viewThis.$spinner.hide();
							}
						});
				}
				else {
					$.ajax({
						async: false,
						url: "/imageprocess/get-subs/" + Drupal.settings.ip.movieNid + "/" + Drupal.settings.ip.subsLang,
						success: function(data){
							Drupal.settings.ip.subsCollection = [];
							viewThis.subsCollectionChangedCollection(new Subs(_.map(data.subsCollection, function(sub){ return new Sub(sub); })));
							IpMain.Vent.trigger("subscollection-changed", data);
						}
					});
				}
				if(this.searchText) {
					this.docSearch();
				}
      },			
      
      subsCollectionChanged: function() {
				this.clearSearch();
				this.$el.find('#serial-search').attr('checked', false);
      },
			
      clearSearch: function() {
				if(!this.searchButtonDisabled) {
					this.disableButton();
					IpMain.Vent.trigger("search-effected", null);
				}
				
				return false;
      },
			
      disableButton: function() {
        this.$subsSearch.val('');
				this.$button.addClass('disabled');
				this.searchButtonDisabled = true;
      },
			
      toggleButtonDisabled: function() {
				if(!this.searchText || this.searchText && this.searchText.length < 1) {
					this.$button.addClass('disabled');
					this.searchButtonDisabled = true;
				}
				else {
					this.$button.removeClass('disabled');
					this.searchButtonDisabled = false;
				}
      }     
    });
		
		return SubsSearchView;
	});		