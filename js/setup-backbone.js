

$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});



var Message = Backbone.Model.extend({

});

var MessagesView = Backbone.View.extend({
  // initialize: function(messages){
  //   this.collection.on('add', this.appendMessage, this);
  // },
  // appendMessage: function() {
  //   this.$('ol').append('<li>' +   + '</li>');
  // }
  render: function(){
    var username = this.model.get('username');
    var text = this.model.get('text');
    var createdAt = this.model.get('createdAt');

    var usernameSpan = $('<a class="username"/>').text(username);

    return $(".messages").append(usernameSpan).append(this.$el.text(text)).append('<hr>');
  }
});

var fetch = function(){
  $.ajax({
    contentType: 'application/json',
    type: 'GET',
    dataType: 'json',
    url: 'https://api.parse.com/1/classes/messages?order=-createdAt',
    success: function(data) {
      console.log(data);
      var messages = $.map(data.results, function(messageData){
        return new Message(messageData);
      });
      var messageViews = $.map(messages, function(message){
        return new MessagesView({model: message});
      });
      var messageNodes = $.map(messageViews, function(messageView){
        messageView.render();
      });
      $(".messageContainer").append(messageNodes);
    }
  });
};

fetch();
setInterval(fetch, 1000);

// var Messages = Backbone.Collection.extend({
//   initialize: function(){
//     $.ajax({
//       contentType: 'application/json',
//       type: 'GET',
//       dataType: 'json',
//       url: 'https://api.parse.com/1/classes/messages?order=-createdAt',
//       success: function(data) {
//         console.log(data);
//         $.each(data.results, function(m){
           
//         });
//       }
//     });
//   },
//   model: Message
// });

// var NewMessageView = Backbone.View.extend({
//   model: Message,
//   events: {
//     'submit form': 'addMessage'
//   },

//   initialize: function() {
//     this.collection.on('add', this.clearInput, this);
//   },

//   addMessage: function(e) {
//     e.preventDefault();
//     this.collection.create({text: this.$('textarea').val() });
//   },

//   clearInput: function() {
//     this.$('textarea').val('');
//   }
// });


//1) get messages from server
//2) create collection of messages
//3) render collection through view



// $(document).ready(function(){
//   var messages = new Messages();
//   new MessagesView({ el: $('#main'), collection: messages });
//   //new NewMessageView({ el: $('#main'), collection: messages});
// });