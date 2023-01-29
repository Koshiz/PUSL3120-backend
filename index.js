/*const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()


const routes = require("./routes/routes")

mongoose.connect('mongodb://localhost/music', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
const PORT = 8000

db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database"))

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use("/api", routes)

app.listen(PORT, console.log(`Server started on port ${PORT}`))

*/

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const hbs = require("hbs")
const path = require("path")
const app = express()
const routes = require("./routes/routes")
var debug = require('debug')('angular2-nodejs:server');
const PORT = 8000
const WEBSOCKET_PORT = 8001

// Connect to MongoDB
mongoose.connect('mongodb://localhost/music', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database"))

// Use middlewares
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(express.static(path.join(__dirname, "../frontend_angular/public")));
app.use("/api", routes)

// Use hbs as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '..', 'frontend_angular', 'views'));
hbs.registerPartials(path.join(__dirname, '..', 'frontend_angular', 'views', 'partials'));

// Add a route for the index page
app.get('/', (req, res) => {
    res.render('index.hbs', { layout: false });
});

// Start the Express server
app.listen(PORT, console.log(`Server started on port ${PORT}`))

// Start the WebSocket server
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(WEBSOCKET_PORT);

io.on('connection',(socket)=>{

    console.log('new connection made.');


    socket.on('join', function(data){
      //joining
      socket.join(data.room);

      console.log(data.user + 'joined the room : ' + data.room);

      socket.broadcast.to(data.room).emit('new user joined', {user:data.user, message:'has joined this room.'});
    });


    socket.on('leave', function(data){
    
      console.log(data.user + 'left the room : ' + data.room);

      socket.broadcast.to(data.room).emit('left room', {user:data.user, message:'has left this room.'});

      socket.leave(data.room);
    });

    socket.on('message',function(data){

      io.in(data.room).emit('new message', {user:data.user, message:data.message});
    })
});

/**
 * Listen on provided port, on all network interfaces.
 */


server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  

  if (isNaN(WEBSOCKET_PORT)) {
    // named pipe
    return val;
  }

  if (WEBSOCKET_PORT >= 0) {
    // port number
    return WEBSOCKET_PORT;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof WEBSOCKET_PORT === 'string'
      ? 'Pipe ' + WEBSOCKET_PORT
      : 'Port ' + WEBSOCKET_PORT.port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof WEBSOCKET_PORT === 'string'
      ? 'pipe ' + WEBSOCKET_PORT
      : 'port ' + WEBSOCKET_PORT.port;
    debug('Listening on ' + bind);
  }
  