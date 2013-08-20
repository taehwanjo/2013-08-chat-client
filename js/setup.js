
$(document).ready(function(){


if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }

  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

var username = window.location.search.split('username=')[1].split('&')[0];

//AJAX GET request from server
//build DOM nodes containing message data making sure to clean that shit
//append message DOM node to #main


// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});

var messageList = $(".messages");

var postMessage = function(username, message, room) {

  var jsonText = JSON.stringify({username: username, text: message, roomname: room});

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json',
    url: 'https://api.parse.com/1/classes/messages',
    data: jsonText,
    success: function(data) {
      console.log('succes!: ' + data);
    }
  });

};

var fetchMessages = function() {

  $.get(
    'https://api.parse.com/1/classes/messages?order=-createdAt',
    function(data){
      console.log(data);
      messageList.empty();
      $.each(data.results, function(key, value) {

        var messageSpan = $('<span>').text(value.text);
        var usernameSpan = $('<span>').text(value.username);

        var newMessage = $('<li>').html('<b>Username: </b>');
        newMessage.append(usernameSpan);
        newMessage.append('<br><b>Created At: </b>' + value.createdAt + '<br><b>Message: </b>');

        newMessage.append(messageSpan).append('<hr>');
        messageList.append(newMessage);

      });
    }
  );
};


//postMessage('tae', 'hi', 'testroom');

$('button').on('click', function(){
  var draft = $('.draft').val();
  postMessage(username, draft, 'someplace');
  $('.draft').val('');
});

fetchMessages();

setInterval(fetchMessages, 1000);

});







