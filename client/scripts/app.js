if (!/(&|\?)username=/.test(window.location.search)) {
  var newSearch = window.location.search;
  if (newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}

var app = {};

app.init = () => {
  setInterval(function() {
    $.ajax({
      url: app.server + '/classes/messages',
      type: 'GET',
      dataType: 'json',
      success: app.fetch
    });
  }, 20000);

  app.server = 'http://127.0.0.1:3000';
  app.username = window.location.search.split('username=')[1];
  app.friends = [];
  app.likes = [];
};

//Send posts to other users
app.send = function(message) {
  console.log(message);
  $.ajax({
    url: app.server + '/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(response) {
      console.log('server response: ', response);
      console.log('Successful Post');
    },
    error: function(data) {
      console.log('An error has occurred Post');
    }
  });
  $('[name="message-box"]').val('');
  app.fetch();
};

//Get posts from other users
app.fetch = function() {
  $.ajax({
    url: app.server + '/classes/messages',
    type: 'GET',
    data: {
      format: 'json'
    },
    error: function(data) {
      console.log('An error has occurred Get');
    },
    success: function(data) {
      console.dir(data);
      console.log('Successful Get');
      var res = data.results;
      //Clear #chat to make way for new messages
      app.clearMessages();
      //Loop through all messages from server and add them to the #chat
      for (var i = 0; i < res.length; i++) {
        var message = {
          username: res[i].username || 'anonymous',
          text: res[i].text,
          roomname: res[i].roomname
        };
        //For specified title of the room, add corresponding messages
        if ($('#chat-room').text() === message.roomname || $('#chat-room').text() === 'all-rooms') {
          app.addMessage(message, res[i].objectId);
        }
      }
    }
  });
};

//Check for index in likes array of objId of specific message, and also take in like button jquery element
app.like = function(objId, $like) {
  var index = app.likes.indexOf(objId);
  // if element is found in likes array, add class to demonstrate that it is liked
  if (index > -1) {
    $like.addClass('liked-btn');
  } else {
    // otherwise remove objId from likes array
    app.likes.splice(index, 1);
  }
};

// when you enter a roomname, append an option to the scroll down
app.addRoom = function(roomname) {
  var $newRoom = $('<option value="' + roomname + '" class="room" id="' + roomname + '" ></option>').text(roomname);
  $('#roomSelect').append($newRoom);
};

app.clearMessages = function() {
  $('#chats').html('');
};

// create a message and append it to the #chats div
app.addMessage = function (message, objId) {
  var $msgBox = $('<div class="msg-box"></div>');
  var $userName = $('<h2 class="username"></h2>');
  var $date = $('<p class="date"></p>');
  var $message = $('<p class="message"></p>');
  var $like = $('<button class="glyphicon glyphicon-heart like-btn" id="' + objId + '"></button>');
  // check if message is liked, if it is it will stay liked
  app.like(objId, $like);
  $userName.text(message.username);
  $date.text(message.date);
  $message.text(message.text);
  $msgBox.append($like).append($userName).append($date).append($message);
  app.$chats.append($msgBox);
  // highlight all friends function
  app.showFriends(message.username, function() {
    $userName.addClass('friend');
  });
};

// add user to friends array if not already in it, remove friend from friends array if in it, and calls fetch to implement multiple users
app.addFriend = function(userName) {
  var user = userName.text();
  if (app.friends.indexOf(user) === -1) {
    app.friends.push(user);
  } else {
    var index = app.friends.indexOf(user);
    app.friends.splice(index, 1);
  }
  app.fetch();
};

// if username is found in friends list invoke callback
app.showFriends = function(username, callback) {
  if (app.friends.indexOf(username) > -1) {
    callback();
  }
};

// wraps up message, roomname, and username to send to the app.send function
app.handleSubmit = function() {
  var text = $('[name="message-box"]').val();
  var roomname = $('#roomSelect').val();
  if (roomname === 'all-rooms') {
    roomname = 'lobby';
  }
  var message = {
    username: app.username,
    text: text,
    roomname: roomname
  };
  app.send(message);
};

// on ready
$(function() {
  app.$chats = $('#chats');
  //fetch all messages from the server
  app.fetch();
  //send message to the parse api
  $('#send').on('click', '.submit', function(e) {
    e.preventDefault();
    app.handleSubmit();
  });
  //clear #chats and repopulate #chats when click on refresh button
  $('.clear-messages').click(function(e) {
    e.preventDefault();
    app.clearMessages();
    app.fetch();
  });
  //adds room with roomname specified in the add-room input
  $('#main').on('click', '[name="add-room-btn"]', function(e) {
    e.preventDefault();
    var roomname = $('[name="add-room"]').val();
    $('[name="add-room"]').val('');
    app.addRoom(roomname);
  });
  //when username is clicked, user is added to the friends list
  $('#chats').on('click', '.username', function(e) {
    e.preventDefault();
    app.addFriend($(this));
  });
  //when room is changed, show only messages in that room
  $('#roomSelect').on('change', function() {
    $('#chat-room').text($(this).val());
    var currentRoom = $('#chat-room').text();
    // empty our chat room
    app.clearMessages();
    // place only messages that are from the room
    app.fetch();
  });
  //when heart is clicked for specified message, add the liked button class to the like button, otherwise
  //remove liked-btn class. app.like will take the userId and the jquery element and keep it liked :)
  $('#chats').on('click', '.like-btn', function() {
    if ($(this).hasClass('liked-btn')) {
      $(this).removeClass('liked-btn');
      app.like($(this).attr('id'), $(this));
    } else {
      $(this).addClass('liked-btn');
      app.likes.push($(this).attr('id'));
    }
  });
});

app.init();