define([],
	function() {

    var ViewsFrameworkData = {
			bootstrap: {
				subsWrapper: {
					selector: "#subs-wrapper"
				},					
				episode: {
					className: "form-group episode-season"
				},
				preview: {
					el: '#preview'					
				},
				sentcanvas: {
					id: 'sent-canvas'					
				},				
				pscreenshot: {
					tagName: 'img',
					id: 'p-screenshot',
					className: 'thumbnail img-responsive'				
				},			
				screenshots: {
					tagName: 'ul',
					className: 'list-unstyled',
					attributes: {style: "height:500px; overflow-y:scroll;"}					
				},
				subs: {
					tagName: 'ul',
					id: 'subs',
					className: 'list-unstyled'
				},
				subslang: {
					tagName: 'form', 
					className: "row form-inline pull-right",
					id: "langs-line"					
				},
				subssearch: {
					tagName: "div",
					id: "search-line",
					className: "row"
				},
				words: {
					id: 'words'
				},
				youtubes: {
					tagName: 'ul',
					id: 'videos',
					className: 'list-unstyled'
				}				
			}	
    };
		
		return ViewsFrameworkData;
	});		