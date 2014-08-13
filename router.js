define(["jquery", "jquerycookie", "backbone", "underscore",
	"ip/imageprocess.fw.data",
	"ip/models/lang", "ip/collections/langs",
	"ip/models/episode", "ip/collections/episodes",
	"ip/models/sub", "ip/collections/subs",
	"ip/views/layout",
	"ip/views/subs", "ip/views/subssearch", "ip/views/subsslider", "ip/views/subsscroll",
	"ip/views/subslang",
	"ip/views/episode",
	"ip/models/screenshot", "ip/collections/screenshots", "ip/views/screenshots",
	"ip/views/preview", "ip/views/p.screenshot",
	"ip/collections/words", "ip/views/words",
	"ip/models/sentcaption", "ip/views/sentcaption",
	"ip/views/sentbutton",
	"ip/collections/youtubes", "ip/views/youtubes"],
	function($, cookie, Backbone, _,
		ViewsFrameworkData,
		Lang, Langs,
		Episode, Episodes,
		Sub, Subs,
		LayoutView,
		SubsView, SubsSearchView, SubsSliderView, SubsScrollView,
		SubsLangView,
		EpisodeView,
		Screenshot, Screenshots, ScreenshotsView,
		PreviewView, PreviewScreenshotView,
		Words, WordsView,
		SentCaption, SentCaptionView,
		SentButtonView,
		Youtubes, YoutubesView) {

    var Router = Backbone.Router.extend({
      routes: {
        '': 'index'
      },
      
      index: function() {
				console.log('index loaded');

				var viewsAttrs = ViewsFrameworkData[IpMain.framework];
				
				new LayoutView();					
				
				new ScreenshotsView(_.extend(
					viewsAttrs.screenshots,
					//for debugging
					//{collection: new Screenshots(_.last(Drupal.settings.ip.screenshotsCollection))}
					{collection: new Screenshots(Drupal.settings.ip.screenshotsCollection)}
				));				
				//for debugging
				//var subsList = new Subs(_.map(_.rest(_.toArray(Drupal.settings.ip.subsCollection),1217), function(data){ return new Sub(data); }));
				var subsList = new Subs(_.toArray(Drupal.settings.ip.subsCollection));

				new SubsSearchView(_.extend(
					viewsAttrs.subssearch,
					{collection:	subsList,
					parentElSelector: viewsAttrs.subsWrapper.selector}
				));
				
				new SubsLangView(_.extend(
					viewsAttrs.subslang,
					{collection:	new Langs(Drupal.settings.ip.subsLangs),
					parentElSelector: viewsAttrs.subsWrapper.selector}
				));			
				
				if(Drupal.settings.ip.episodes !== null) {
					new EpisodeView(_.extend(
						viewsAttrs.episode,
						{collection: new Episodes(Drupal.settings.ip.episodes)}
					));
				}

				new SubsSliderView({collection:	subsList,
					parentElSelector: viewsAttrs.subsWrapper.selector});
				
				new SubsView(_.extend(
					viewsAttrs.subs,
					{collection:	subsList,
					parentElSelector: viewsAttrs.subsWrapper.selector}
				)).render();
				
				new SubsScrollView();

				new PreviewView(_.extend(
					viewsAttrs.preview
				)).render();
				
				//Needed when user returns to this page with back button of browser after saving sentimage to have correct subs info
				if($.cookie('subInUseError')) {
					$.cookie('subInUseError', '');
					IpMain.Vent.trigger("subs-in-use", null);			
				};
				if($.cookie('sentImageCreated' + Drupal.settings.ip.uid + Drupal.settings.ip.movieNid)) {
					$.cookie('sentImageCreated' + Drupal.settings.ip.uid + Drupal.settings.ip.movieNid, '');
					IpMain.Vent.trigger("sentimage-created", null);					
				};				
      }
    });
		
		return Router;
	});		