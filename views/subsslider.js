define(["jquery", "underscore", "backbone", "ip/collections/subs", "text!ip/templates/subsslider.html",
		"jqueryui"],
	function($, _, Backbone, Subs, template) {

    var SubsSliderView = Backbone.View.extend({
			subsStartTimes: [],
			$slider: null,
			lastIndex: 0,
			
      templateSlider: _.template(template),
      
      events: {
      },
      
      initialize: function(options) {
        _.bindAll(this, 'render', 'sliderSlided');
				this.parentElSelector = options.parentElSelector;				
				
				IpMain.Vent.on("search-effected", this.sliderDisableToggle, this);
				IpMain.Vent.on("subscollection-changed", this.sliderReset, this);				
				IpMain.Vent.on("slider-slide", this.sliderSlide, this);				
				this.subsStartTimes = this.collection.pluck('subStartTime');
        this.render();
      },
      
      render: function() {
        this.$el.html(this.templateSlider({}));
				$(this.parentElSelector).append(this.el);
				this.$slider = this.$el.find('.slider');
				this.$timer = this.$el.find('.timer');

				var sliderSlided = $.proxy( this.sliderSlided, this ),
						subsLength  = this.subsStartTimes.length,
						subsFirstStartTime  = this.subsStartTimes.length;
				
				this.$slider.slider({
					min: 0,
					max: subsLength - 1,
					value: 0,
					animate: true,
					range: 'min',
					create: function(event, ui) {
						sliderSlided(event, ui, 0);
					},					
					slide: function(event, ui) {
						sliderSlided(event, ui, ui.value);
					},			
					stop: function(event, ui){
					}
				}, this);

        return this;
      },

			sliderSlided: function(event, ui, index) {
				this.setTimer(index);
				IpMain.Vent.trigger("slider-moved", index);
								
				if(index < this.lastIndex) {
					IpMain.Vent.trigger("scroll-atend", false);
				}
				this.lastIndex = index;
			},
			
			sliderSlide: function(index) {
				this.$slider.slider("enable");
				index = index > this.subsStartTimes.length - 1 ? this.subsStartTimes.length - 1 : index;
				this.$slider.slider("value", index);
				this.setTimer(index);
				if(index == this.subsStartTimes.length - 1) {
					IpMain.Vent.trigger("scroll-atend", null);	
				}
				IpMain.Vent.trigger("slider-moved", index);
			},			
			
			sliderReset: function() {
				this.$slider.slider("value", 0);
				this.setTimer(0);
			},
			
			sliderDisableToggle: function(searchResults) {
				if(searchResults === null) {
					this.$slider.slider("enable");
					this.sliderReset();
				}
				else {
					this.$slider.slider("disable");					
					this.sliderReset();
				}
			},			
			
			setTimer: function(timeInt) {
				this.$timer.text(IpMain.intToTime(this.subsStartTimes[timeInt]));
			},				
			
			getSubsLength: function() {debugger
				return this.subsStartTimes.length;
			}			
    });
		
		return SubsSliderView;
	});		