// YOUR CODE HERE:
var app = {};

app.init = function() {
  app.server = 'https://api.parse.com/1/classes/messages';
  app.friends = [];
  app.room = 'lobby';
  app.rooms = ['lobby'];
  app.fetch();

  // Event listeners
  $('#submit').on('click', app.handleSubmit);
  $('#chats').on('click', '.username', app.addFriend);

};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent:', data);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function(data) { app.addAllChats(data.results); },
    error: function(error) {
      console.error(error);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.addMessage = function(message) {
  //message has username, roomname, text
  var user = message.username;
  var text = message.text;
  var roomname = message.roomname;
  var $user = $('<span class="lobby username"></span></div>');

  var $message = app.friends.indexOf(user) !== -1 ? 
  $('<div class="text friend"></div>') : $('<div class="text"></div>');

  var $chatBox = $('<div class="chat border"></div>');
  var html = $chatBox.append($user.text(message.username + ':').attr('data-roomname', roomname).attr('data-username', user).append($message.text('Message: ' + message.text)));

  $('#chats').append(html).fadeIn();

  //if option for room does not exist, call addRoom;
  if (app.rooms.indexOf(roomname) === -1) {
    app.addRoom(roomname);
  }
};


app.addAllChats = function(data) {
  var currentRoom = app.room;

  _.each(data, function(message) {
    if (app.room === 'lobby') {
      app.addMessage(message);
    } else if (message.roomname === app.room) {
      app.addMessage(message);
    }
  });

  setTimeout(function() {
    app.clearMessages();
    app.fetch();
  }, 10000);
};

app.addRoom = function(room) {
  if (room === 'Add a New Room here!') {
    var newRoom = prompt('What room do you want to add??');
    room = newRoom;
  }
  $('#roomSelect').append('<option>' + room + '</option>'); 

  app.rooms.push(room);
};

app.addFriend = function(event) { 
  // event.stopPropagation();
  //addClass to $this
  $(this).find('.text').addClass('friend');
  var friend = $(this).attr('data-username');

  if (app.friends.indexOf(friend) === -1) {
    app.friends.push(friend);
  }
};


app.handleSubmit = function(event) {
  event.preventDefault();
  event.stopPropagation();
  var message = { };
  message.username = window.location.search.replace('?username=', '');
  message.text = $('#input-value').val();
  message.roomname = app.room;

  app.send(message);
};


$(document).ready(function() {
  app.init();
  $('#roomSelect').change(function(event) {
    var room = $(this).find('option:selected').text(); 

    room === 'Add a New Room here!' ? app.addRoom(room) : app.room = room;
  });
});
