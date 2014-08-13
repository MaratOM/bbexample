define(["jquery", "underscore", "backbone", "text!ip/templates/subs.html", "ip/models/youtube", "ip/views/youtube"],
	function($, _, Backbone, template, Youtube, YoutubeView) {

    var YoutubesView = Backbone.View.extend({
			youtubesViews: [],

      templateSubs: _.template(template),

      events: {
      },      
  
      initialize: function() {
        _.bindAll(this, 'addOne', 'render', 'clear');
				IpMain.Vent.on("search-effected", this.noDocs, this);
				IpMain.Vent.on("slider-moved", this.noDocs, this);
				IpMain.Vent.on("subscollection-changed", this.noDocs, this);					
				IpMain.Vent.on("words-updated", this.clearOnNoWords, this);

				IpMain.Vent.on("words-sentbody", this.getYoutubeContent, this);

				this.render();
      },
  
      render: function() {				
				$('#videos-wrapper').html(this.el);
				this.noDocs();

        return this;
      },
			
      getYoutubeContent: function(sentBody) {
				if(sentBody) {
					var maxResults = 2;
					var film = Drupal.settings.ip.serialNid ? 'series' : 'movie';
					//var keyword = encodeURIComponent(Drupal.settings.ip.movieTitle + ' ' + film + ' ' + sentBody);console.log(keyword)
					var keyword = encodeURIComponent(sentBody);console.log(keyword)
					var yt_url = 'http://gdata.youtube.com/feeds/api/videos?q=' + keyword + '&format=5&max-results=' + maxResults + '&v=2&alt=jsonc';
					var viewThis = this;
					
					$.ajax({
						type: "GET",
						url: yt_url,
						dataType: "jsonp",
						success: function(response) {
							if (response.data.items) {
								viewThis.clear();
								$.each(response.data.items, function(i, data) {
									viewThis.addOne(new Youtube({urlId: data.id}));
								});
							}
							else {
								viewThis.noDocs('not found');
							}
						}
					});
				}
				else {
					this.noDocs();
				}
      },
			
      clearOnNoWords: function(subModel) {
				if(subModel == null) {
					this.noDocs();
				}			
      },			
      
      noDocs: function(found) {
				this.clear();
				noVideosLine = found == 'not found' ? 'No video for choosen words.' : 'Choose some words to search for video.';
				this.$el.html(noVideosLine);				
      },
  
      addOne: function(model) {
				this.youtubesViews.push(new YoutubeView({model: model}));
				this.collection.add(_.last(this.youtubesViews));
				this.$el.append(_.last(this.youtubesViews).render().el);
      },
      
      clear: function() {
				this.collection.reset();
				this.youtubesViews = [];
				this.$el.empty();
      }
    });  
		
		return YoutubesView;
	});		