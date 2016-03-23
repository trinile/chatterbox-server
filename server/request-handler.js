/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var fs = require('fs');
var filed = require('filed');
var exports = module.exports = {};
var messages = {results: [{text: 'Hellooo', username: 'me'}]};
exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  var path = url.parse(request.url).pathname;
  var paths = ['scripts/app.js', 'client/styles/styles.css', 
  'client/lib/jquery.js',
  'bower_components/underscore/underscore-min.js'];
  var paths2 = ['app.js', 'styles.css', 
  'jquery.js',
  'underscore-min.js'];
  console.log(path);
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  if (path.indexOf('message') !== -1) {
    
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';

    response.writeHead(statusCode, headers);

    if (request.method === 'POST') {
      statusCode = 201;
      response.writeHead(statusCode, headers);
      var body = '';
      request.on('data', function(chunk) {
        body += body.concat(chunk);
      });

      request.on('end', function() {
        console.log(body);
        messages.results.push(JSON.parse(body));
        // console.log(messages);
        // at this point, `body` has the entire request body stored in it as a string
      });
      // response.writeHead(200, 'application/json');
      response.end('Post recieved!');
    } else if (request.method === 'GET') {
      response.end(JSON.stringify(messages));
    } else if (request.method === 'OPTIONS') {
      response.write('200', headers);
      response.end(JSON.stringify(messages));
    }
  } else if (path === '/') {
    var html = fs.readFileSync(__dirname + '/../client/index.html');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(html, 'utf8');
    response.end();
  } else if (path.indexOf('styles.css') !== -1) {
    var css = fs.readFileSync(__dirname + '/../client/styles/styles.css');
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.write(css, 'utf8');
    response.end();
  } else if (path.indexOf('app.js') !== -1) {
    var app = fs.readFileSync(__dirname + '/../client/scripts/app.js');
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    response.write(app, 'utf8');
    response.end();
  } else if (path.indexOf('jquery.js') !== -1) {
    var jq = fs.readFileSync(__dirname + '/../client/bower_components/jquery/dist/jquery.min.js');
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    response.write(jq, 'utf8');
    response.end();
  } else if (path.indexOf('underscore.js') !== -1) {
    var us = fs.readFileSync(__dirname + '/../client/bower_components/underscore/underscore-min.js');
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    response.write(us, 'utf8');
    response.end();
  } else {
    response.writeHead(404, headers);
    response.end('404, non-existant endpoint');
  }
};
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


// else if (paths.indexOf(path) !== -1) {
//     var directory = fs.readFileSync(__dirname + '/../' + path);
//     response.writeHead(200, headers);
//     response.write(directory);
//   }
  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify(messages));


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

