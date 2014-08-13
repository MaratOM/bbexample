({
		//node r.js -o build.js
    paths:{
        'domready': '../../../../libraries/domready/domready',
				'text': '../../../../libraries/require/text',
				'jquery': '../../../jquery_update/replace/jquery/1.7/jquery.min',
				'jqueryui': '../../../../libraries/jqueryui/jquery-ui.min',
				'jquerycookie': '../../../../libraries/jquery.cookie/jquery.cookie',
				'jquerytoggles': '../../../../libraries/jquery.toggles/toggles.min',				
        'underscore': '../../../../libraries/underscore/underscore-min',
        'backbone': '../../../../libraries/backbone/backbone-min',
        'marionette': '../../../../libraries/marionette/backbone.marionette',				
				'ip': '../../imageprocess/js'
    },
    include: '../../../../libraries/require/require',
		shim: {
					'underscore': {
							exports: '_'
					},
					'backbone': {
							deps: ['underscore', 'jquery'],
							exports: 'Backbone'  
					},
					'marionette': {
							deps: ['underscore', 'jquery', 'backbone'],
							exports: 'Marionette'  
					},
					'jquerycookie': {
							deps: ['jquery'],
							exports: 'cookie'  
					},
					'jquerytoggle': {
							deps: ['jquery'],
							exports: 'toggle'  
					}	
		},
    name: "imageprocess.js",
    out: "ip-built.js",
    preserveLicenseComments: false
})