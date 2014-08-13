define(["jquery", "jquerytoggles", "underscore", "backbone", "text!ip/templates/sentbutton.html"],
	function($, toggles, _, Backbone, template) {

    var SentButton = Backbone.View.extend({
			subsStartTimes: [],
			sentData: {},
			isFunny: 0,			
			
      templateButton: _.template(template),	
      
      events: {
				"click .save-sent"	: "saveSent",
				"click .clear-sent"	: "clearSent",
			  "click .go-preview" : "goPreview"
      },
      
      initialize: function(options) {
        _.bindAll(this, 'render');

				this.parentView = options.parentView;
				
				IpMain.Vent.on("search-effected", this.clear, this);
				IpMain.Vent.on("slider-moved", this.clear, this);
				IpMain.Vent.on("subscollection-changed", this.clear, this);						
				IpMain.Vent.on("words-updated", this.processButton, this);
				IpMain.Vent.on("position-borders", this.togglePreviewButton, this);				
				IpMain.Vent.on("sent-data", this.collectSentData, this);
      },
      
      render: function() {
				this.parentView.$el.append(this.el);
				this.setFunny(Drupal.settings.ip.isComedy);

        return this;
      },
			
      collectSentData: function(data) {
				_.extend(this.sentData, data);
      },			
			
      processButton: function(subModel) {
				if(subModel == null) {
					this.clear();
				}
				else {
					this.$el.html(this.templateButton());
					this.$('.toggle').toggles({
						drag:false,
						text: {
							on: 'YES',
							off: 'NO'
						},
						on: Boolean(this.isFunny)
					});console.log(this.isFunny)
					var thisView = this;
					this.$('.toggle').on('toggle', function (e, active) {
						thisView.setFunny(active);
					});					
				}
      },
			
      saveSent: function(e) {
				e.preventDefault();

				IpMain.Vent.trigger("button-clicked", null);
				var dataToSend = {
							movieNid: typeof Drupal.settings.ip.serialNid === 'undefined' ? Drupal.settings.ip.serialNid : Drupal.settings.ip.movieNid,
							movieTitle: Drupal.settings.ip.movieTitle,
							subsLang: Drupal.settings.ip.subsLang,					
							
							subStartTime: IpMain.intToTime(this.sentData.subStartTime),
							sentBody: this.sentData.sentBody,
							subsStartTimes: this.sentData.subsStartTimes,
							screenshotFid: this.sentData.screenshotFid,
							screenshotUri: this.sentData.screenshotUri,
							youtube: this.sentData.youtube,
							isFunny: this.sentData.isFunny					
						};
				
				//console.log(dataToSend);
				
				$.ajax({
					type: "POST",
					url: "/imageprocess/save-sent-image",
					data: dataToSend,
					success: function(sentImageNid) {
						if(sentImageNid == -100) {
							$.cookie('subInUseError', 1);		
							location.reload();
						}
						else {
							$.cookie('sentImageCreated' + Drupal.settings.ip.uid + Drupal.settings.ip.movieNid, 1);						
							location.href = '/sentimage/' + sentImageNid;
						}
					}					
				});				
      },			

      clearSent: function() {
				IpMain.Vent.trigger("search-effected", null);
				IpMain.Vent.trigger("scroll-allow", true);
				
				return false;
      },
			
      setFunny: function(active) {
				this.isFunny = active ? 1 : 0;
				IpMain.Vent.trigger("sent-data", {
					isFunny: this.isFunny
				});				
      },
			
      goPreview: function() {
				//Bootstrap tab doesn't work
				//http://getbootstrap.com/javascript/#tabs
				
				$('.nav-tabs li').removeClass('active');
				$('.nav-tabs a[href="#preview-tab"]').trigger('click').parents('li').addClass('active');
				
				return false;
      },
			
      togglePreviewButton: function(previewTab) {
				previewTab ? this.$('.go-preview').hide() : this.$('.go-preview').show();
      },			
			
      clear: function() {
				this.$el.empty();
      }				
    });
		
		return SentButton;
	});		