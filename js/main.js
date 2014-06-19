(function() {
    if (!!window.opener) {
        var hash = window.location.hash,
            target = window.opener;
        if (hash) {
            var token = hash.split('&')[0].split('=')[1];
            console.log(token);
            target.postMessage(token, 'http://localhost/'); //embedded
            //target.postMessage(token); // fullscreen
        }
    }
})();

$(function() {
    var token = localStorage.getItem('spot.token'),
        authWindow;

    $("#btnCreate").on('click', function(ev) {
        var width = 400,
            height = 500;
        var left = (screen.width / 2) - (width / 2);
        var top = (screen.height / 2) - (height / 2);
        
        var params = {
            client_id: '44611d736d3b4e40904c60777a63508e',
            redirect_uri: 'http://localhost/htplaylist',
            scope: 'playlist-modify playlist-modify-private playlist-read-private',
            response_type: 'token'
        };

        authWindow = window.open(
            "https://accounts.spotify.com/authorize?" + toQueryString(params),
            "Spotify",
            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
        );
    });

    window.addEventListener("message", function(ev) {
        console.log(ev);
        if (ev.origin !== 'http://localhost') return;

        authWindow.close();
        var token = ev.data;
        localStorage.setItem('spot.token', token);
    }, false);

    $("#btnSearch").on('click', function(ev) {
        var token = localStorage.getItem('spot.token');
        if(!token)  {
            alert("NO token!!");
            return;
        }

        var header = window.authHeader = { 
            'Authorization': 'Bearer ' + token, 
            'Content-Type': 'application/json'
        };
        var req = $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: header,
            type: "GET"
        });

        req.done(function(resp) {
            console.log(resp);
        });

    });

    window.getUserInfo = function() {

    };
});

/*
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
*/