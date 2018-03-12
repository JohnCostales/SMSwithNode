//--- Client side Javascript ---//

// Values
const numberInput = document.getElementById('number'),
      textInput = document.getElementById('msg'),
      button = document.getElementById('button'),
      response = document.querySelector('.response');

//-- button event listener
button.addEventListener('click', send, false);

const socket = io();
socket.on('smsStatus', function(data){
      response.innerHTML = '<h5>Text message sent to ' + data.number  + '</h5>';
})

function send() {
      const number = numberInput.value.replace(/\D/g, ''); // validate only numeric characters
      const text = textInput.value;

      // Make a POST request to the server with the text value
      fetch('/', {
            method: 'post',
            headers: {
                  'Content-type': 'application/json'
            },
            body: JSON.stringify({number: number, text: text}) // Turn to JSON string
      })
      // Get response
      .then(function(res){
            console.log(res);
      })
      // Error log
      .catch(function(){
            console.log(err);
      });
}