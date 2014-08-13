define(["jquery", "underscore", "backbone", "ip/models/word", "ip/views/word"],
	function($, _, Backbone, Word, PreviewWordView) {

    var WordsView = Backbone.View.extend({
			checkedWords: [],
			canBeCheckedWords: [],
			lastUncheckedWord: false,
			previewWordsViews: [],
			sentBody: '',

      events: {
      },      
  
      initialize: function(options) {
        _.bindAll(this, 'addOne', 'removeOne', 'render', 'renderPreviewWordsViews');
				this.parentView$El = options.parentView$El;
				
        this.collection.bind('add', this.addOne);
				this.collection.bind('remove', this.removeOne);
			
				IpMain.Vent.on("sub-model-triggered", this.subModelTriggered, this);
				IpMain.Vent.on("word-model-triggered", this.wordModelTriggered, this);
				IpMain.Vent.on("search-effected", this.searchEffected, this);
				IpMain.Vent.on("slider-moved", this.sliderMoved, this);
				IpMain.Vent.on('button-clicked', this.buttonClicked, this);
				IpMain.Vent.on("subscollection-changed", this.subsCollectionChanged, this);
				IpMain.Vent.on("edit-sent", this.toggleEditableWords, this);				

        this.render();
      },
  
      render: function() {
				this.parentView$El.append(this.$el);

				if(this.collection.length == 0) {
					this.noDocs();
        }
        
        return this;
      },
			
			subModelTriggered: function(subModel) {
				if(subModel.get('checked')) {
					this.addWordsFromSub(subModel);
					this.clearCheckedWords();
					this.populateWordsArrays();
					this.setCanBeChecked();	
					IpMain.Vent.trigger("words-updated", _.first(this.collection.models));
					IpMain.Vent.trigger("draw-canvas", null);
				}
				else {
					this.removeWordsFromSub(subModel);

					if(this.collection.length) {
						IpMain.Vent.trigger("draw-canvas", null);
					}
					else {
						this.clearCollectionPlus();
					}

					IpMain.Vent.trigger("words-updated", this.collection.length ? _.first(this.collection.models) : null);
				}
				this.setSentBody();

				IpMain.Vent.trigger("words-sentbody", this.sentBody);
			},
			
			wordModelTriggered: function(model) {
				if(model.get('checked')) {
					this.checkedWords.push(model);
				}
				else {
					this.checkedWords = _.without(this.checkedWords, model);					
				}
				this.populateWordsArrays();
				this.setCanBeChecked();
			},			
			
      buttonClicked: function() {
				var sentBody = '',
						subsStartTimes = [];
				_.each(this.collection.where({checked: false}), function(word) {
						sentBody += word.get('body') + ' ';
						subsStartTimes.push(word.get('subStartTime'));
					}
				, this);
				IpMain.Vent.trigger("sent-data", {
					sentBody: sentBody.trim(),
					subsStartTimes: _.uniq(subsStartTimes),
					subStartTime: _.min(subsStartTimes)
				});
      },
			
			addWordsFromSub: function(subModel) {
				var modelsToAdd = [];
				var index = 0;
				_.each(subModel.getFlatBody(), function(word) {
					modelsToAdd.push(new Word({body: word, subStartTime: subModel.get('subStartTime'), index: index++}));
				}, this);
				
				this.collection.add(modelsToAdd);
			},
			
			removeWordsFromSub: function(subModel) {
				var subModelStartTime = subModel.get('subStartTime');
				var modelsToRemove = [];
				_.each(this.collection.models, function(model) {
					if(model.get('subStartTime') == subModelStartTime) {
						modelsToRemove.push(model);
					}
				}, this);				
				this.collection.remove(modelsToRemove);
			},
			
			populateWordsArrays: function() {
				var afterUncheckedMiddle = false,
					lastIndex = 0,
					checkedWordsLeft = null,
					checkedWordsRight = null;
				this.canBeCheckedWords = [];
				this.lastUncheckedWord = (this.collection.models.length - this.checkedWords.length) == 1;

				this.checkedWords = _.sortBy(this.checkedWords, function(model) {
					return model.get('subStartTime');
				},
				this);				
				
				_.each(this.collection.models, function(model, index) {
					if(!afterUncheckedMiddle) {
						afterUncheckedMiddle = (index - lastIndex) > 1 ? true : false;   
					}						
					if(_.indexOf(this.checkedWords, model) > -1 && !checkedWordsRight) {
						if(index === 0) {
							checkedWordsLeft = model;
						}
						else {
							if(!checkedWordsLeft) {
								afterUncheckedMiddle = true;
							}
							if(checkedWordsLeft && !afterUncheckedMiddle) {
								checkedWordsLeft = model;
							}
							else if(afterUncheckedMiddle) {
								checkedWordsRight = model;
							}								
						}	
						lastIndex = index;	
					}
				}, this);

				if(checkedWordsLeft) {
					_.each(this.getWordSiblings(checkedWordsLeft, 'left'), function(model) {
							this.canBeCheckedWords.push(model);
					}, this);
				}
				else if(!this.lastUncheckedWord) {
					this.canBeCheckedWords.push(this.collection.at(0));
				}
				if(checkedWordsRight) {
					_.each(this.getWordSiblings(checkedWordsRight, 'right'), function(model) {
							this.canBeCheckedWords.push(model);
					}, this);
				}
				else if(!this.lastUncheckedWord) {
					this.canBeCheckedWords.push(this.collection.at(this.collection.length - 1));
				}
								
								
								

				//console.group('%cWords.js', 'color: green;');				
				//console.log('afterUncheckedMiddle : ' + afterUncheckedMiddle);									
				//console.log('this.canBeCheckedWords : ' + this.canBeCheckedWords);					
				//console.log('checkedWordsLeft : ' + checkedWordsLeft);
				//console.log('checkedWordsRight : ' + checkedWordsRight);
				//console.groupEnd();
			},
			
      getWordSiblings: function(model, wordPosition) {
				var checkedModelIndex = _.indexOf(this.collection.models, model);
				var siblingModels = [model];
				 if(!this.lastUncheckedWord) {
					if(wordPosition == 'left') {
						siblingModels.push(this.collection.at(checkedModelIndex + 1));
					}
					if(wordPosition == 'right') {
						siblingModels.push(this.collection.at(checkedModelIndex - 1));
					}
				}

				return siblingModels;
      },
			
      setCanBeChecked: function() {
				_.each(this.collection.models, function(model) {
					model.set('canBeChecked', false);
				}, this); 
				
				if(this.canBeCheckedWords.length) {
					_.each(this.canBeCheckedWords, function(model) {
						
						model.set('canBeChecked', true);
					}, this);
				}
      },
			
      clearCheckedWords: function() {
				this.checkedWords = [];
				_.each(this.collection.models, function(model) {
					model.set('checked', false);
				}, this); 
      },			

			searchEffected: function() {
				this.clearCollectionPlus();
			},
			
			sliderMoved: function() {
				this.clearCollectionPlus();
			},
			
			subsCollectionChanged: function() {
				this.clearCollectionPlus();
			},			
			
			clearCollectionPlus: function() {
				if(this.collection.models.length) {
					this.collection.reset();
					this.clear();
				}
			},				
      
      noDocs: function() {
      },
			
			setSentBody: function() {
				var sentBody = '';
				_.each(this.collection.where({checked: false}), function(word) {
						sentBody += word.get('body') + ' ';
					}
				, this);
				this.sentBody = sentBody;
      },
			
      addOne: function(model) {
				this.previewWordsViews.push(new PreviewWordView({model: model}));
				this.renderPreviewWordsViews();
      },
  
      renderPreviewWordsViews: function() {
				this.clear();

				this.collection.forEach(function(model) {
					this.previewWordsViews.push(new PreviewWordView({model: model}));
					this.$el.append(_.last(this.previewWordsViews).render().el);
				}, this);
      },
			
      toggleEditableWords: function(sentEditMode) {
				sentEditMode ? this.$('span.checked').show() : this.$('span.checked').hide();	
      },			
			
      removeOne: function(model) {
				this.renderPreviewWordsViews();
      },
      
      clear: function() {
				_.each(this.previewWordsViews, function(view) {view.remove();});
				this.previewWordsViews = [];
				this.$el.empty();

				IpMain.Vent.trigger("hide-canvas", null);
      }
    });  
		
		return WordsView;
	});		