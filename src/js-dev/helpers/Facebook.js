/* globals FB:true  */

window.fbAsyncInit = function() {
    FB.init({
        appId      : '596243747091537',
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });
};

// Load the SDK asynchronously
(function(d)
{
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

// Here we run a very simple test of the Graph API after login is successful.
// This testAPI() function is only called in those cases.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    console.log('Good to see you, ' + response.name + '.');
    });
}

function publishScoreToFB(level, stars){
    FB.ui(
        {
            method: 'stream.publish',
            display:'popup',
            message: '',
            name: 'Tjilp',
            caption: 'Check out my score!',
            description: (
                'I got '+ stars +' stars on level '+level
                ),
            link: 'http://tjilp.be',
            picture: 'http://jnthn.be/GAP/img/tjilp-score.png'
        },
        function(response) {
            if (response && response.post_id) {
                console.log('Post was published');
            } else {
                console.log('Post NOT published');
            }
        }
    );
}