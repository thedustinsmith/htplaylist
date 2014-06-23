var mainView = new (Backbone.View.extend({
	events: {
		'click #btn-search': 'search',
		'click .song-listing a': 'addSong'
	},

	search: function(ev) {
		var searchTerm = this.$searchText.val(),
			searchType = this.$searchTypes.filter(":checked").val();

		if (!searchTerm || !searchType) {
			alert("Please fill otu search form");
			return;
		}

		$.ajax({
			url: app.apiRoot + 'search',
			type: 'GET',
			headers: app.viewstate.get("RequestHeader"),
			data: {
				q: searchTerm,
				type: searchType
			}
		}).done(_.bind(this.renderSearchResults, this));
	},

	addSong: function (ev) {
		var playlistID = '1BrVvW61DspS9XduxnBdRL',
			songID = $(ev.target).data('trackid');

		var data = JSON.stringify(['spotify:track:' + songID]);
		$.ajax({
			url: this.userApiRoot + 'playlists/' + playlistID + '/tracks',
			type: 'POST',
			headers: app.viewstate.get('RequestHeader'),
			data: data
		}).done(function (resp) {
			console.log(resp);
		});
	},

	renderSearchResults: function (results) {
		console.log(results);
		var resultsWrap = this.$searchListing;
		function appendSection(title, template, items) {
			resultsWrap.append("<h3>" + title + "</h3>");
			resultsWrap.append(template(items));
		}

		resultsWrap.html("");
		if (results.artists.items.length) {
			appendSection('Artists', app.templates.artistTemplate, results.artists.items);
		}
		if (results.tracks.items.length) {
			appendSection('Songs', app.templates.songTemplate, results.tracks.items);
		}
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
			var pls = resp.items;
			console.log(pls);
			self.$playlistListing.html(app.templates.playlistTemplate(pls));
		});
	},

	render: function () {
		app.setView(this.$el);
		this.getPlaylists();
	},

	initialize: function () {

		this.$playlistListing = this.$("#playlist-listing");
		this.$searchText = this.$("#search");
		this.$searchTypes = this.$("[name='search-type']");
		this.$searchListing = this.$("#search-results");

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