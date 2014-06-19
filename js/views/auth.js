(function() {
    if (!!window.opener) {
        var hash = window.location.hash,
            target = window.opener;
        if (hash) {
            var token = hash.split('&')[0].split('=')[1];
            target.postMessage(token, 'http://localhost/');
        }
    }
})();

var authView = new (Backbone.View.extend({
	events: {
		'click button': 'authenticate'
	},

	openAuthWindow: function() {
		var width = 400,
            height = 500,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);
        
        var params = {
            client_id: '44611d736d3b4e40904c60777a63508e',
            redirect_uri: 'http://localhost/htplaylist',
            scope: 'playlist-modify playlist-modify-private playlist-read-private',
            response_type: 'token'
        };

        this.authWindow = window.open(
            "https://accounts.spotify.com/authorize?" + toQueryString(params),
            "Spotify",
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
        );
	},

	authenticate: function() {
		this.openAuthWindow();
	},

	getUserInfo: function () {
		var token = app.viewstate.get('Token'),
			header = {
				'Authorization': 'Bearer ' + token
			};

		$.ajax({
			url: app.apiRoot + 'me',
			headers: header,
			type: "GET"
		}).done(function(resp) {
			app.viewstate.set('User', resp);
		});
	},

	processAuthMessage: function (ev) {
        if (ev.origin !== 'http://localhost') return;

        this.authWindow.close();
        var token = ev.data;

        var requestHeader = { 
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json'
        };
        app.viewstate.set('Token', token);
        this.reqHeader = app.viewstate.set('RequestHeader', requestHeader);
        this.getUserInfo();
	},

	initialize: function() {
		window.addEventListener("message", _.bind(this.processAuthMessage, this), false);
	}
}))({
	el: '#auth-view'
});