// Bring in dependencies
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init app
const app = express();

// Template engine setup (use .html as file extension for views)
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup (static assets)
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index route
app.get('/', (req, res) => {
    res.render('index');
  });

// Initialise Nexmo
const nexmo = new Nexmo({
  apiKey: '04ce8e05',
  apiSecret: 'ba37e51343e95f88'
}, {debug:true });

// Catch form submit
app.post('/', (req, res) =>{
  // res.send(req.body);
  // console.log(req.body);
  const number = req.body.number;
  const text = req.body.text;

  nexmo.message.sendSms(
    'NEXMO', number, text, { type: 'unicode' },
    (err, responseData) => {
      if(err){
        console.log(err);
      } else {
        console.dir(responseData);
        
        // Gather data from response
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        }
        // Emit data to the client
        io.emit('smsStatus', data);
      }
    }
  );  
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

// Connect socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Connected');
  io.on('diconnect', () => {
    console.log('Disconntected');
  })
})