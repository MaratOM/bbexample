define(["jquery", "underscore", "backbone", "ip/models/episode", "text!ip/templates/season.html", "text!ip/templates/episode.html"],
	function($, _, Backbone, Episode, seasonTemplate, episodeTemplate) {

    var EpisodeView = Backbone.View.extend({
			season: null,
			episode: null,			

      templateSeason: _.template(seasonTemplate),  
      templateEpisode: _.template(episodeTemplate),
      
      events: {
        "change select.seasons"    : "changeSeason",
        "change select.episodes"    : "changeEpisodeFromSelect"				
      },
      
      initialize: function() {
        _.bindAll(this, 'render', 'changeSeason');
				
				IpMain.Vent.on("change-episode", this.changeEpisode, this);
				
				this.setSeasonAndEpisode();
        this.render();
      },
      
      render: function() {
				var seasons = [];
				_.each(this.collection.models, function(model) { seasons.push(model.get('season'));	});
				this.seasons = seasons;
        this.$el.append(this.templateSeason({seasons: _.uniq(this.seasons)}));
        this.$el.append(this.templateEpisode({collection: this.collection.where({season: _.min(seasons)})}));
				$('#langs-line').prepend(this.el);
        
        return this;
      },
      
      changeSeason: function(e) {
				e.target = IpMain.eTarget(e);
				var selectedSeason = e.target.value;
				var selectedSeasonCollection = this.collection.where({season: selectedSeason});
				this.$el.find('select.episodes').html(this.templateEpisode({collection: selectedSeasonCollection}));
				var movieNid = _.find(Drupal.settings.ip.episodes, function(episode){
					return episode.season === selectedSeason && episode.episode == selectedSeasonCollection[0].get('episode');
				}).movieNid;
				this.changeEpisode(movieNid);
      },
			
      changeEpisodeFromSelect: function(e) {
				e.target = IpMain.eTarget(e);
				var movieNid = e.target.value;
				this.changeEpisode(movieNid);
      },			
			
      changeEpisode: function(movieNid) {
				$.ajax({
					async: false,
					url: "/imageprocess/get-subs/" + movieNid + "/" + Drupal.settings.ip.subsLang,
					success: function(data){
						Drupal.settings.ip.movieNid = movieNid;
						Drupal.settings.ip.subsCollection = [];
						IpMain.Vent.trigger("subscollection-changed", data);
					}
				});
				this.setSeasonAndEpisode();
        this.$el.find('select.seasons').html(this.templateSeason({seasons: _.uniq(this.seasons), selected: this.season}));				
				this.$el.find('select.episodes').html(this.templateEpisode({collection: this.collection.where({season: this.season}), selected: this.episode}));
      },
			
      setSeasonAndEpisode: function() {
				var episode = _.find(Drupal.settings.ip.episodes, function(episode){
					return episode.movieNid === Drupal.settings.ip.movieNid;
				});				

				this.season = episode.season;
				this.episode = episode.episode;
				
				Drupal.settings.ip.season = this.season;
				Drupal.settings.ip.episode = this.episode;				
      } 			
    });
		
		return EpisodeView;
	});		