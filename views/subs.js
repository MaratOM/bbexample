define(["jquery", "underscore", "backbone", "text!ip/templates/subs.html", "text!ip/templates/nomatches.html", "ip/models/sub", "ip/collections/subs", "ip/views/sub"],
	function($, _, Backbone, template, noMatchesTemplate, Sub, Subs, SubView) {

    var SubsView = Backbone.View.extend({
			startingSub: 0,
			startingCollection: new Subs(),
			fullCollection: new Subs(),
			isSearchResults: false,
			subsViews: [],
			checkedSubs: [],
			canBeCheckedSubs: [],
			maxCheckedSubsChars: 150,
			checkedSubsBodiesLength: 0,

      templateSubs: _.template(template),
      noMatchesTemplate: _.template(noMatchesTemplate),			

      events: {
      },      
  
      initialize: function(options) {
        _.bindAll(this, 'addOne', 'addAll', 'render', 'clear');
				this.parentElSelector = options.parentElSelector;

				IpMain.Vent.on("sub-model-triggered", this.modelTriggered, this);
				IpMain.Vent.on("scroll-effected", this.scrollEffected, this);
				IpMain.Vent.on("search-effected", this.searchEffected, this);
				IpMain.Vent.on("slider-moved", this.sliderMoved, this);
				IpMain.Vent.on("subscollection-changed", this.subsCollectionChanged, this);
				IpMain.Vent.on("sentimage-created", this.sentimageCreated, this);				
      },
  
      render: function() {
				this.setFullCollection();

				$(this.parentElSelector).append(this.el);				
        
        return this;
      },
			
      setFullCollection: function() {
				this.fullCollection = _.clone(this.collection);
				this.startingCollection.reset(this.collection.slice(0, IpMain.subsPerPage));

				this.reFillCollection(this.startingCollection.models);	
				this.addAll();
      },				
			
      subsCollectionChanged: function(newSubsData) {
				Drupal.settings.ip.subsLang = newSubsData.subsLang;
				this.collection = new Subs(_.map(newSubsData.subsCollection, function(data){ return new Sub(data); }));
				IpMain.Vent.trigger("subscollection-changed-collection", this.collection);
				this.setFullCollection();
      },			
			
			modelTriggered: function(model) {
				if(model.get('checked')) {
					if(this.isSearchResults) {
						var indexOfChecked = _.indexOf(this.fullCollection.models, model);
						if(indexOfChecked === -1 && Drupal.settings.ip.serialNid) {
							var movieNid = _.find(Drupal.settings.ip.episodes, function(episode){
								return episode.season === model.get('season') && episode.episode === model.get('episode');
							}).movieNid;
							IpMain.Vent.trigger("change-episode", movieNid);
							for(i = 0; i < this.fullCollection.models.length; i++) {
								if(this.fullCollection.at(i).get('subStartTime') === model.get('subStartTime')) {
									indexOfChecked = i;
									model = this.fullCollection.at(i);
									model.set('checked', true);
									break;
								}
							}
						}
						var substr = indexOfChecked > 4 ? 4 : indexOfChecked;
						IpMain.Vent.trigger("slider-slide", indexOfChecked - substr); 						
						this.isSearchResults = false;
					}
					this.checkedSubs.push(model);
					this.checkedSubsBodiesLength += model.getBodyLength();
					this.populateSubsArrays();
				}
				else {
					this.checkedSubs = _.without(this.checkedSubs, model);
					this.checkedSubsBodiesLength -= model.getBodyLength();
					
					if(this.checkedSubs.length > 0) {
						this.populateSubsArrays();
					}
					else {
						this.canBeCheckedSubs = [];
					}
				}
				
				this.setCanBeChecked();
				IpMain.Vent.trigger("sub-view-draw-class", null);
			},
			
			clearCheckedSubs: function() {
				_.each(this.checkedSubs, function(model) {
					model.set('checked', false);
				}, this);
				this.checkedSubs = [];
				this.checkedSubsBodiesLength = 0;
				this.setCanBeChecked();
			},			
			
			populateSubsArrays: function() {
				this.canBeCheckedSubs = [];
				
				if(this.checkedSubsBodiesLength <= this.maxCheckedSubsChars) {
					_.each(this.checkedSubs, function(model) {
						_.each(this.getSubSiblings(model), function(model) {
							if(_.indexOf(this.canBeCheckedSubs, model) < 0) {
								this.canBeCheckedSubs.push(model);
							}
						}, this);
					}, this);
				}
				else {
					this.canBeCheckedSubs = this.checkedSubs;
				}

				if(this.checkedSubs.length > 2) {
					this.setMiddleSubsToCanNotBeChecked();
				}						
			},
			
      setMiddleSubsToCanNotBeChecked: function() {
				this.checkedSubs = _.sortBy(this.checkedSubs, function(model) {
					return model.get('subEndTime');
				},
				this);
				_.each(this.checkedSubs, function(model) {
					var modelIndex = _.indexOf(this.checkedSubs, model);
					if(modelIndex != 0 && modelIndex != this.checkedSubs.length - 1) {
						this.canBeCheckedSubs = _.without(this.canBeCheckedSubs, model);
					}
				},
				this);
      },			
			
      getSubSiblings: function(model) {
				var checkedModelIndex = _.indexOf(this.collection.models, model);
				var siblingModels = [model];
				if(checkedModelIndex != 0) {
					siblingModels.push(this.collection.at(checkedModelIndex - 1));
				}
				if(checkedModelIndex != this.collection.length - 1) {
					siblingModels.push(this.collection.at(checkedModelIndex + 1));
				}
				
				return siblingModels;
      },
			
      setCanBeChecked: function() {
				if(this.checkedSubs.length != 0) {
					_.each(this.collection.models, function(model) {
						model.set('canBeChecked', false);
					}, this); 
	
					_.each(this.canBeCheckedSubs, function(model) {
						model.set('canBeChecked', true);
					}, this);
				}
				else {
					_.each(this.collection.models, function(model) {
						model.set('canBeChecked', true);
					}, this);					
				}
      },
			
			scrollEffected: function(direction) {
				if(!this.isSearchResults) {
					var sliceBeginningSub,
							sliceEndingSub,
							newSubsCollection;					
					IpMain.Vent.trigger("scroll-processing", "started");
					if(direction == 'down') {
						if(this.collection.length >= IpMain.subsPerPage * 2) {
							sliceBeginningSub = this.startingSub + IpMain.subsPerPage;
							sliceEndingSub = sliceBeginningSub + IpMain.subsPerPage * 2;
						}
						else {
							sliceBeginningSub = this.startingSub;
							sliceEndingSub = this.startingSub + this.collection.length + IpMain.subsPerPage;
						}
						
						IpMain.Vent.trigger("slider-slide", sliceEndingSub - IpMain.subsPerPage);
					}
					else if(direction == 'up') {
						if(this.startingSub >= IpMain.subsPerPage) {
							sliceBeginningSub = this.startingSub - IpMain.subsPerPage;
							sliceEndingSub = sliceBeginningSub + IpMain.subsPerPage * 2;
						}
						else {
							this.startingSub = 0;
							sliceBeginningSub = 0;
							sliceEndingSub = IpMain.subsPerPage * 2;
						}
						
						if(sliceBeginningSub == 0) {
							IpMain.Vent.trigger("slider-slide", 0);
						}
						else {
							IpMain.Vent.trigger("slider-slide", this.startingSub);
						}	
					}					

					newSubsCollection = this.fullCollection.slice(sliceBeginningSub, sliceEndingSub);
					this.startingSub = sliceBeginningSub;

					this.reFillCollection(newSubsCollection);		
					this.addAll();						
					
					IpMain.Vent.trigger("scroll-processing", "ended");

					if(this.startingSub == 0) {
						IpMain.Vent.trigger("scroll-atstart", null);
					}
				}
			},			
			
			searchEffected: function(searchResultsCollection) {
				if(searchResultsCollection === null){
					this.reFillCollection(this.startingCollection.models);	
				}
				else if(searchResultsCollection.length) {
					this.isSearchResults = true;
					this.reFillCollection(searchResultsCollection.models);					
				}
				else {
					this.collection.reset();
				}
				this.startingSub = 0;
				this.addAll();
			},
			
			sliderMoved: function(index) {
				if(index <= IpMain.subsPerPage) {
					index = 0;
					//IpMain.Vent.trigger("slider-reset", null);
					IpMain.Vent.trigger("scroll-atstart", null);
				}
				else {
					IpMain.Vent.trigger("scroll-atstart", false);
				}
				this.startingSub = index;
				this.reFillCollection(this.fullCollection.slice(index, index + IpMain.subsPerPage));
				this.addAll();
			},			
      
      noDocs: function() {
				this.$el.append(noMatchesTemplate);
      },
			
			reFillCollection: function(newCollection) {
				this.collection.reset(newCollection);
			},
  
      addOne: function(model) {
				this.subsViews.push(new SubView({model: model}));
				this.$el.append(_.last(this.subsViews).render().el);
      },
  
      addAll: function() {
				this.clear();
				if(!this.collection.length) {
					this.noDocs();
				}
				else {
					this.collection.forEach(function(model) {
						this.addOne(model);
					}, this);
				}
      },
			
      sentimageCreated: function() {
					$.ajax({
						async: false,
						url: "/imageprocess/get-subs/" + Drupal.settings.ip.movieNid + "/" + Drupal.settings.ip.subsLang,
						success: function(data){
							Drupal.settings.ip.subsCollection = [];
							IpMain.Vent.trigger("subscollection-changed", data);
						}
					});				
      },			
      
      clear: function() {
				_.each(this.subsViews, function(view) {view.remove();});
				this.subsViews = [];
				this.clearCheckedSubs();
				this.$el.empty();
      }
    });  
		
		return SubsView;
	});		