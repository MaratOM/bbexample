define(["jquery", "underscore", "backbone"],
	function($, _, Backbone) {

    var SentCanvasView = Backbone.View.extend({
			canvasDrawn: false,
			
      events: {
      },
      
      initialize: function(options) {
        _.bindAll(this, 'render');

				this.parentView = options.parentView;

				IpMain.Vent.on('draw-canvas', this.positionCanvas, this);
				IpMain.Vent.on('redraw-canvas', this.redrawCanvas, this);				
				IpMain.Vent.on('hide-canvas', this.sentCanvasHide, this);					
      },
      
      render: function() {
				this.parentView.$el.append(this.el);

        return this;
      },
			
      redrawCanvas: function() {
				if(this.canvasDrawn) {
					this.positionCanvas();
				}
      },			
			
      positionCanvas: function() {
				var bottomOffset = 40,
						xPadding = 0,
						pScreenshot = $('#p-screenshot'),
						sentCanvas = this.$el;
						borderThickness = parseInt(pScreenshot.css('borderTopWidth')),
						xOffset = (pScreenshot.width() - sentCanvas.width() - borderThickness - xPadding) / 2, 
						yOffset = pScreenshot.height() - sentCanvas.height() - bottomOffset;

				sentCanvas.css('left', xOffset);
				sentCanvas.css('top', yOffset);
				sentCanvas.css('border', '1px solid white');				

				this.sentCanvasShow();
      },				
			
      sentCanvasShow: function() {
				this.$el.show();
				this.canvasDrawn = true;
      },
			
      sentCanvasHide: function() {
				this.$el.hide();
				this.canvasDrawn = false;
      }				
    });
		
		return SentCanvasView;
	});		