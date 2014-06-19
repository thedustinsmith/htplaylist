var mainView = new (Backbone.View.extend({
	events: {

	},

	getPlaylists: function () {
		var header = app.viewstate.get('RequestHeader'),
			url = this.userApiRoot;

		var self = this;
		$.ajax({
			url: url + 'playlists',
			type: "GET",
			headers: header
		}).done(function (resp) {
			app.viewstate.set('Playlists', resp.items);
			var pls = _.map(resp.items, function (i) {
				return {
					pname: i.name
				};
			});
			console.log(pls,app.templates.playlistTemplate(pls));
			self.playlistListing.html(app.templates.playlistTemplate(pls));
		});
	},

	render: function () {
		app.setView(this.$el);
		this.getPlaylists();
	},

	initialize: function () {

		this.playlistListing = this.$("#playlist-listing");
		var self = this;
		this.listenTo(app.viewstate, 'change:User', function(m, v) {
			if(!v) return;

			self.user = v;
			self.userApiRoot = app.apiRoot + 'users/' + v.id + '/';
			self.render();
		});
	}
}))({
	el: '#main-view'
});