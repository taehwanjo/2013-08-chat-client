
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
var roomList = $('.rooms');
var roomObj = {};
var currentRoom;
var friendList = [];

// var Message = Backbone.Model.extend();
// var MessageView = Backbone.View.extend({model: Message});
// MessageView.render = function() {
//   
// }
// Message.prototype.add = function() {
// 
// }

var createRoom = function(room) {
  var jsonText = JSON.stringify({roomname: room});

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json',
    url: 'https://api.parse.com/1/classes/messages',
    data: jsonText,
    success: function(data) {
      console.log ('success!');
    }
  });
};

var renderFriendList = function(){
  $('#friendList').html('');
  for (var i=0; i<friendList.length; i++) {
    $('#friendList').append(friendList[i] + '<br>');
  }
};

var addFriend = function(friend) {
  if (_.contains(friendList, friend)) {
    return;
  } else {
    friendList.push(friend);
  }
  renderFriendList();
};

var postMessage = function(username, message, room) {

  var jsonText = JSON.stringify({username: username, text: message, roomname: room});

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json',
    url: 'https://api.parse.com/1/classes/messages',
    data: jsonText,
    success: function(data) {
      console.log('success!: ' + data);
    }
  });

};

var renderMessage = function(username, createdAt, message) {
  var messageSpan;

  if(_.contains(friendList, username)) {
    messageSpan = $('<b>').text(message);
  } else {
    messageSpan = $('<span>').text(message);
  }

  usernameSpan = $('<a class="username">').text(username);

  var newMessage = $('<li>').html('<b>Username: </b>');
  newMessage.append(usernameSpan);
  newMessage.append('<br><b>Created At: </b>' + createdAt + '<br><b>Message: </b>');

  newMessage.append(messageSpan).append('<hr>');
  messageList.append(newMessage);
};

var renderRoomList = function() {
  var roomOption;
  roomList.html('');
  roomList.append('<option>----</option>');
    for (var key in roomObj) {
      console.log("currentRoom: " + currentRoom + "\nkey: " + key);
      if (key === currentRoom) {
        roomOption = $('<option selected>').text(key);
      } else {
        roomOption = $('<option>').text(key);
      }
      roomList.append(roomOption);
    }
};

var fetchMessages = function(firstLoad) {

  $.get(
    'https://api.parse.com/1/classes/messages?order=-createdAt',
    function(data){
      console.log(data);
      messageList.empty();
      $.each(data.results, function(key, value) {
//iterate through all messages irrespective of the value.roomname of them
        if (currentRoom === undefined) { //generate room list
          if (roomObj[value.roomname]===undefined) {
            roomObj[value.roomname] = 1;
          } else {
            roomObj[value.roomname] += 1;
          }
        renderMessage(value.username, value.createdAt, value.text);

        } else {
          //iterate through all messages, grab only messages with value.roomname = currentRoom
          //store matching messages in variable.
          if (value.roomname === currentRoom) {
            renderMessage(value.username, value.createdAt, value.text);
          }
        }
      });

  renderRoomList();

    }
  );
};


//postMessage('tae', 'hi', 'testroom');

$('.send').on('click', function(){
  var draft = $('.draft').val();
  if (draft === '') {
    return;
  }
  postMessage(username, draft, currentRoom);
  $('.draft').val('');
});

$('.rooms').change(function() {
  currentRoom = $(".rooms").val();
  if (currentRoom === "----"){
    currentRoom = undefined;
  }
    console.log(currentRoom);

});

$('.newRoomButton').on('click', function(){
  // var roomName = $('.newRoom').val();
  // createRoom(roomName);
  // console.log(roomName + ' created');
  currentRoom = $('.newRoom').val();
  roomObj[currentRoom] = 1;
  $('.newRoom').val('');
});

$('#main').on('click', '.username', function(){
  var clickedUser = $(this).text();
  addFriend(clickedUser);
  console.log('username: ' + clickedUser);
});

fetchMessages(true);

setInterval(fetchMessages, 1000);

});







