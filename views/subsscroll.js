define(["jquery", "backbone"],
	function($, Backbone) {

    var SubsScrollView = Backbone.View.extend({
      el: "#subs",
			scrollAllowed: true,
			scrollAtStart: true,
			scrollAtEnd: false,			
			scrollProcessing: false,
      
      events: {
				"scroll"	: "detectScroll"
      },
			
      initialize: function() {
				IpMain.Vent.on("scroll-allow", this.setScrollAllowed, this);
				IpMain.Vent.on("search-effected", this.setScrollAllowedTrue, this);				
				IpMain.Vent.on("scroll-processing", this.setScrollProcessing, this);				
				IpMain.Vent.on("scroll-atstart", this.setScrollAtStart, this);
				IpMain.Vent.on("scroll-atend", this.setScrollAtEnd, this);				
      },			
      
			detectScroll: function() {
					//console.group('%cSubsScroll', 'color:green');
					//console.log('this.el.scrollTop : ' + this.el.scrollTop);
					//console.log('this.el.clientHeight : ' + this.el.clientHeight);
					//console.log('this.el.scrollHeight : ' + this.el.scrollHeight);
					//console.groupEnd('SubsScroll');
				
					
				if(this.scrollAllowed) {	
					if(this.scrollProcessing === false) {
						var triggerPoint = 60;
						if(this.el.scrollTop + this.el.clientHeight + triggerPoint > this.el.scrollHeight && !this.scrollAtEnd) {
							this.scrollAtStart = false;
							IpMain.Vent.trigger("scroll-effected", "down");
							this.$el.scrollTop(this.el.clientHeight * 3);
						}
						else if(this.el.scrollTop === 0 && !this.scrollAtStart) {
							this.scrollAtEnd = false;
							IpMain.Vent.trigger("scroll-effected", "up");
							this.$el.scrollTop(this.el.clientHeight * 3);
						}
					}
				}
			},
			
			setScrollProcessing: function(action) {
				if(action === 'started') {
					this.scrollProcessing = true;
				}
				else if(action === 'ended') {
					this.scrollProcessing = false;
				}				
			},				
			
			setScrollAtStart: function(status) {
				this.scrollAtStart = status === false ? status : true;
			},
			
			setScrollAtEnd: function(status) {
				this.scrollAtEnd = status === false ? status : true;
			},
			
			setScrollAllowed: function(action) {
				this.scrollAllowed = action;
			},
			
			setScrollAllowedTrue: function() {
				this.setScrollAllowed(true);
			}				
		});
			
		return SubsScrollView;
	});		