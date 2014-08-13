define(["jquery", "underscore", "backbone",
	"ip/imageprocess.fw.data",
	"ip/models/screenshot",
	"ip/views/p.screenshot",
	"ip/views/sentedit",	
	"ip/views/sentcanvas",
	"ip/collections/words", "ip/views/words",
	"ip/models/sentcaption", "ip/views/sentcaption",
	"ip/views/sentbutton",				
	"text!ip/templates/preview.html"],
	function($, _, Backbone,
ViewsFrameworkData,
		Screenshot,
		PreviewScreenshotView,
		SentEditView,
		SentCanvasView,
		Words, WordsView,
		SentCaption, SentCaptionView,
		SentButtonView,
		template) {

    var PreviewView = Backbone.View.extend({
			pScreenshotImg: null,
			sentCanvas: null,			
			bigBorder1: '#big-border-1',
			bigBorder2: '#big-border-2',			
			previewTemplate: _.template(template),
  
      events: {
      },
  
      initialize: function() {
        _.bindAll(this, 'render');

				IpMain.Vent.on('position-borders', this.positionBorders, this);					
      },
  
      render: function() {
				var viewsAttrs = ViewsFrameworkData[IpMain.framework];				
				
        this.$el.prepend(this.previewTemplate());
				
				this.sentCanvas = new SentCanvasView(_.extend(
					viewsAttrs.sentcanvas,
					{parentView: this}
				)).render().$el;
				
				new SentEditView({parentView: this});
				
				this.pScreenshotImg = new PreviewScreenshotView(_.extend(
					viewsAttrs.pscreenshot,
					{model: new Screenshot(_.first(Drupal.settings.ip.screenshotsCollection)),
					parentView: this}
				)).render().$el;
				
				new WordsView(_.extend(
					viewsAttrs.words,
					{collection: new Words(),
					parentView$El: this.sentCanvas}
				));
				
				var	sentButtonView = new SentButtonView({parentView: this});
				
				new SentCaptionView({
					model: new SentCaption({movieTitle: Drupal.settings.ip.movieTitle}),
					parentView$El: this.sentCanvas
				});
				
				sentButtonView.render();

        return this;
      },
			
      positionBorders: function(previewTab) {
				var offsetBorder1 = 5,
					offsetBorder2 = offsetBorder1 + 4,	
					pScreenshotImg = this.pScreenshotImg;						
					bigBorder1 = this.$(this.bigBorder1);
					bigBorder2 = this.$(this.bigBorder2);				
					border = parseInt(pScreenshotImg.css('borderTopWidth')),		
					padding = parseInt(pScreenshotImg.css('paddingTop')),
					widthBorder1 = pScreenshotImg.width() - offsetBorder1 * 2, 
					heightBorder1 = pScreenshotImg.height() - offsetBorder1 * 2,
					widthBorder2 = pScreenshotImg.width() - offsetBorder2 * 2, 
					heightBorder2 = pScreenshotImg.height() - offsetBorder2 * 2;
				
				bigBorder1.css('left', offsetBorder1 + border + padding);
				bigBorder1.css('top', offsetBorder1 + border + padding);
				bigBorder1.css('width', widthBorder1 + 'px');
				bigBorder1.css('height', heightBorder1 + 'px');
				
				bigBorder2.css('left', offsetBorder2 + border + padding);
				bigBorder2.css('top', offsetBorder2 + border + padding);
				bigBorder2.css('width', widthBorder2 + 'px');
				bigBorder2.css('height', heightBorder2 + 'px');
				
				var maxWidth = previewTab ? '60%' : '80%';
				this.sentCanvas.css('max-width', maxWidth);
      }	
    });
		
		return PreviewView;
	});		