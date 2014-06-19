var app = {
	apiRoot: 'https://api.spotify.com/v1/',
	viewstate: new Backbone.Model(),
	setView: function (el) {
		$(".view").removeClass('active');
		el.addClass("active");
	}
};

app.templates = {};
$("#js-templates script").each(function() {
	var name = $(this).data('name'),
		temp = Handlebars.compile($(this).html());
	app.templates[name] = temp;
})
$("#js-templates").remove();

$(function() {
	app.setView($("#auth-view"));
});