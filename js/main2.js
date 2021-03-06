// find template and compile it
var playlistsListTemplateSource = document.getElementById('playlists-list-template').innerHTML,
    playlistsListPlaceholder = document.getElementById('playlists-list'),
    
    playlistDetailTemplateSource = document.getElementById('playlist-detail-template').innerHTML,
    playlistDetailPlaceholder = document.getElementById('playlist-detail')

document.getElementById('btnCreate').addEventListener('click', function() {
    login();
});

function login() {
    var width = 400,
        height = 500;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
    
    var params = {
        client_id: '44611d736d3b4e40904c60777a63508e',
        redirect_uri: 'http://localhost/htplaylist/',
        scope: 'user-read-private playlist-read playlist-read-private',
        response_type: 'token'
    };
    authWindow = window.open(
        "https://accounts.spotify.com/authorize?" + toQueryString(params),
        "Spotify",
        'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    );
}

function receiveMessage(event){
    if (event.origin !== "http://jsfiddle.net") {
        return;
    }
    if (authWindow) {
        authWindow.close();
    }
    showInfo(event.data);
}

window.addEventListener("message", receiveMessage, false);

function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return parts.join("&");
}
var authWindow = null;

var token = null;

function showInfo(accessToken) {
    token = accessToken;
    // fetch my public playlists
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {         
            var user_id = response.id.toLowerCase();         
            $.ajax({
                url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                success: function(response) {
                    console.log(response);
                    playlistsListPlaceholder.innerHTML = playlistsListTemplate(response.items);
                }
            });
         
            $('div#login').hide();
            $('div#loggedin').show();
        }
    });
}

playlistsListPlaceholder.addEventListener('click', function(e) {
    var target = e.target;
    if (target !== null && target.classList.contains('load')) {
        e.preventDefault();
        var link = target.getAttribute('data-link');
               
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function(response) {
                console.log(response);
                playlistDetailPlaceholder.innerHTML = playlistDetailTemplate(response);
            }
        });
    }
});
