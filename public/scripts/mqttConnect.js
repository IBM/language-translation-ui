var mqtt_host = 'agf5n9.messaging.internetofthings.ibmcloud.com'
var mqtt_port = 443
var useTLS = true // true ssl
var cleansession = true;
var clients = {}
// var useTLS = false // true ssl

// init first client
var client_prefix = 'a:agf5n9:'
var audio = document.getElementById('playResults');
var source = document.getElementById('wavSource');

clients['client1'] = new Messaging.Client(mqtt_host, mqtt_port, client_prefix + "client_" + parseInt(Math.random() * 100, 10));
clients['tokens'] = new Messaging.Client(mqtt_host, mqtt_port, client_prefix + "client_" + parseInt(Math.random() * 100, 10));

// this is a hacky way of adding serverside information, showing when new clients join, can add client name or number if from incoming text
clients['serverLogs'] = new Messaging.Client(mqtt_host, mqtt_port, client_prefix + "logs_" + parseInt(Math.random() * 100, 10));

// Instead of button for form, just have a selectFrom button that'll allow user to adjust from 1 to 4 clients, can increase once we get css solidified
// Each client should have a drop down that allows user to adjust client name and language


// submit.onClick = function() {
//     console.log(document.querySelector('#message').value)
//     publish(document.querySelector('#message').value,'languagetest/clientout/text/' + document.querySelector('#language').value + '/' + clientId ,2);
// }


// selectNumClients.onchange = function () {
//   clients = selectNumClients.val() ;
//   // adjust div

// };

// addClient.onclick = function () {
//   if (recordButton.getAttribute('style'))
//     {
//       publish($('#resultsText').val(),'languagetest/clientout/text/' + document.querySelector('#language').value + '/' + clientId ,2)
//     }
// };


// TODO, for now should we set a value for maxClients?

function addClient(clientName, language) {

  // var clientName = 'client' + ( document.getElementById('clientContainer').children.length + 1 )
  var clientName = "client_" + parseInt(Math.random() * 100, 10)
  clients[clientName] = new Messaging.Client(mqtt_host, mqtt_port, client_prefix + clientName);
  var clientId = clients[clientName]._getClientId()
  console.log(clientName)

  clients[clientName].connect(
    Object.assign(
      options,
      {
        onSuccess: function() {
          clients[clientName].subscribe( watson_channel,
            {
              onSuccess: function () {
                console.log(clientName + ' successfully subscribed to ' + watson_channel);
                publish(clientName + " has joined the session",  'iot-2/type/MQTTDevice/id/965d11de/evt/logs/fmt/json', 2, 'serverLogs')
                  // subscribe to initial client
                 //  clientName = 'client1'
                 //  clients[clientName].subscribe('languagetest/translated/' + document.querySelector(`#${clientName}_language`).value);
                  // TODO, create div classes for
                  // document.getElementById('').style.backgroundColor = 'green';
                 //  console.log('subscribing to ' + 'languagetest/translated/' + document.querySelector(`#${clientName}_language`).value)
                 clients[clientName].onMessageArrived = function (message) {
                    //Do something with the push message you received
                    // $('#messages').append('<span>' + message.payloadString + '</span><br/>');
                   //  document.getElementById(`${clientName}_messages`).value += message.payloadString + '\n'

                   console.log("message")
                   console.log(message)
                   //  for (client in document.getElementsByClassName( message.d.language + '_client' )) {
                   //    client.value += "new message"
                   //    client.value += message.d.payload + '\n'
                   //  }
                   document.getElementById(`${clientName}_messages`).value += message.payloadString + '\n'
                 };
              },
              onFailure: function (message) {
                  console.log(clientName + " Subscription failed: " + message.errorMessage);
              }
            }
          );

          clients[clientName].onConnectionLost = function (responseObject) {
              //Depending on your scenario you could implement a reconnect logic here
              console.log("connection lost: " + responseObject.errorMessage);
              clients[clientName].connect(options)
          };


        }
    }
    )
  )


  // create additional div within main "clients" div


  /*
  $('#clientContainer').append(`
  <div id="${clientName}_div">
  <textarea readonly class="en_client" id="${clientName}_messages" style='border:solid 1px black;' dir='auto'></textarea>
  <form><input type='text' id="${clientName}_message"></form>
  <button onclick="console.log('sending ' + document.querySelector('#${clientName}_message').value) ;
      publish(
        {
          'd': {
            'language': document.querySelector('#${clientName}_language').value,
            'message': document.querySelector('#${clientName}_message').value,
            'client': '${clientName}'
        }
      },
      'iot-2/type/MQTTDevice/id/965d11de/evt/msgout/fmt/json',
      2,
      '${clientName}'
    )"
  >Submit</button>
  <select id="${clientName}_language" selected='english' onfocus="this.oldvalue = this.value;" onchange="document.getElementById('${clientName}_messages').className = this.value + '_client'">
    <option value="en">English</option>
    <option value="fr">French</option>
    <option value="es">Spanish</option>
    <option value="ar">Arabic</option>
    <option value="pt">Portuguese</option>
    <!-- <option value="jp">Japanese</option> -->
    <!-- <option value="de">German</option> -->
  </select>
  <img id="recordButton" height="42" width="42" src="images/microphone_hover.svg">
  <img id="${clientName}_audio" class="audioToggle" onfocus="this.oldvalue = this.value;" onclick="toggleAudio('${clientName}')" width="20px" height="20px"  src="data:image/png;base64,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"></src>
  </div>
  `)
  */
  $("#client1_div")[0].style.float = "left"
  $("#client1_div")[0].style.marginTop = "30px"
  $("#client1_div")[0].style.marginLeft = "30px"
  $('#clientContainer').append(`
    <div id="${clientName}_div" style="height:600px;width:500px;float:left;margin-top:30px;margin-left:30px">
    <!-- <textarea readonly id="${clientName}_messages" class="en_client" style="background-color:#edf8fc;" dir="auto"></textarea> -->
    <div style="background-color:#edf8fc;height:500px;width:400px; overflow: auto; padding-right: 30px"  dir="auto">
    <div>
        <img id="${clientName}_audio" style="float:right;margin-left:5px;margin-bottom:10px" class="audioToggle" onclick="toggleAudio('${clientName}')" width="20px" height="20px" src="https://cdn3.iconfinder.com/data/icons/audio-and-sound-3/512/audio512-06-512.png"></img>
        <select id="${clientName}_language" style="outline-width: 0; text-indent: -300px; background: url(images/en.png) ; border-radius: 50%; width:25px; background-size: cover; right no-repeat ; border:0 ; float:right; -webkit-appearance: none;" selected="english" onchange="updateIcon('${clientName}')" onfocus="this.oldvalue = this.value;">
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="pt">Portuguese</option>
          <!-- <option value="jp">Japanese</option> -->
          <!-- <option value="ar">Arabic</option> -->
          <option value="de">German</option>
        </select>

    </div>
      <div id="${clientName}_messages" class="en_client">
        <div style="float:right ;clear:both">
          <!-- <img style="float:right" src="https://cdn4.iconfinder.com/data/icons/sound-and-music-minimalist-icon-set/256/settings-512.png" onclick="" width="20" height="20"></img> -->


        </div>
      </div>
      </div>
    <div style="background-color:#FFFFFF;width:450px;height:75px">

      <!-- <div style="vertical-align: middle;display:table-cell;border-radius: 25px; border: 2px ;solid #73AD21;" width="600px"> -->
          <div style="float:center;margin: 0 auto;width:100%">
            <form>
              <input type="text" autocomplete="off" style="margin: 0 auto;width:75%;margin-left: 40px;border: none; text-align: left; border-bottom: 1px solid grey;" id="${clientName}_message" placeholder=" Enter a message">
              <!-- <input type="text" autocomplete="off" style="margin: 0 auto;width:75%;margin-left: 40px;border: none; text-align: center ; border-bottom: 1px solid grey;" id="${clientName}_message" placeholder="            Enter a message"> -->
            </form>
      </div>
      <div style="position:relative;float:right;left:-30px;top:-45px"><img id="recordButton"  height="25" width="25" src="images/micro_microphone_4764.png"></div>
      <!-- </div> -->
      <!-- <div style="float:left"><button onclick="publish(
                        {
                          'd': {
                            'language': document.querySelector('#${clientName}_language').value,
                            'message': document.querySelector('#${clientName}_message').value,
                            'client': '${clientName}'
                          }
                        },
                      'iot-2/type/MQTTDevice/id/965d11de/evt/msgout/fmt/json',
                      2,
                      '${clientName}'
      )">Submit</button>
      </div> -->

      <!-- 'languagetest/clientout/text/' + document.querySelector('#${clientName}_language').value + '/' + clients['${clientName}']._getClientId(), -->
      <!-- <select id="${clientName}_language" selected="english" onchange="refreshConnection('${clientName}', oldvalue)" onfocus="this.oldvalue = this.value;"> -->

    </div>
    </div>
  `
  )

  $('#' + clientName + '_message').keypress(function (e) {
         if (e.which == 13) {
              e.preventDefault();
              //do something
              // console.log("Enter button detected")
              publish(
                      {
                        'd': {
                          'language': document.querySelector('#' + clientName + '_language').value,
                          'message': document.querySelector('#' + clientName + '_message').value,
                          'client': clients[clientName]._getClientId()
                          // 'client': 'client1'
                        }
                      },
                    'iot-2/type/MQTTDevice/id/965d11de/evt/msgout/fmt/json',
                    2,
                    clientName
              )
         }
  });

}



function addClientRedacted(clientName, language) {
    // present form to user with fields for name and language

    // Predefine 4 clients per browser
    // clients[clientName] = new Messaging.Client(mqtt_host, mqtt_port, "myclientid_" + parseInt(Math.random() * 100, 10));
    // set onconnection lost, on message arrived, etc

    // create client

    // var clients[clientName] = new Messaging.Client(mqtt_host, mqtt_port, "myclientid_" + parseInt(Math.random() * 100, 10));
    var clientName = 'client' + ( Object.keys(clients).length + 1 )

    clients[clientName] = new Messaging.Client(mqtt_host, mqtt_port, "myclientid_" + parseInt(Math.random() * 100, 10) );
    clientId = clients[clientName]._getClientId()
    clients[clientName].connect(
      Object.assign(
        options,
        {
          onSuccess: function() {document.getElementById(clientName + "_div").style.border = "thick solid #0000FF";
        }
      }
      )
    )

    window.setTimeout(function(){
      // set client behavior
      clients[clientName].onMessageArrived = function (message) {
         //Do something with the push message you received
         // $('#messages').append('<span>' + message.payloadString + '</span><br/>');
        //  document.getElementById(`${clientName}_messages`).value += message.payloadString + '\n'

        console.log("message")
        console.log(message)
        for (client in document.getElementsByClassName( message.d.language + '_client' )) {
          // client.value += "new message"
          client.value += message.d.payload + '\n'
        }
        // document.getElementById(`${clientName}_messages`).value += message.payloadString + '\n'
      };

      clients[clientName].onConnectionLost = function (responseObject) {
          //Depending on your scenario you could implement a reconnect logic here
          console.log("connection lost: " + responseObject.errorMessage);
          clients[clientName].connect(options)
      };

      // subscribe client to given language channel
      // TODO, need a better way to wait until mqtt connection established to subscribe to channels
      // going to try the onSuccess condition
      clients[clientName].subscribe('languagetest/translated/' + document.querySelector(`#${clientName}_language`).value,
        {
          onSuccess: function () {
              console.log('subscribed to ' + 'languagetest/translated/' + document.querySelector(`#${clientName}_language`).value);
              // subscribe to initial client
             //  clientName = '${clientName}'
             //  clients[clientName].subscribe('languagetest/translated/' + document.querySelector(`#${clientName}_language`).value);
              // TODO, create div classes for
              // document.getElementById('').style.backgroundColor = 'green';
             //  console.log('subscribing to ' + 'languagetest/translated/' + document.querySelector(`#${clientName}_language`).value)
          },
          onFailure: function (message) {
              console.log("Connection failed: " + message.errorMessage);
          }
        }
      );
      // $('#${clientName}_language').value
      console.log('subscribing to ' + 'languagetest/translated/' + document.querySelector(`#${clientName}_language`).value)
    } , 3000);

    // create additional div within main "clients" div
    $('#clientContainer').append(`
        <div id="${clientName}_div">
        <textarea readonly id="${clientName}_messages" style='border:solid 1px black;' dir='auto'></textarea>
        <form><input type='text' id="${clientName}_message"></form>
        <button onclick="console.log(document.querySelector('#${clientName}_message').value) ;  publish(document.querySelector('#${clientName}_message').value,'languagetest/clientout/text/' + document.querySelector('#${clientName}_language').value + '/' + clients['${clientName}']._getClientId() ,2, '${clientName}');">Submit</button>
        <select id="${clientName}_language" selected='english' onfocus="this.oldvalue = this.value;" onchange="document.getElementById('#${clientName}_messages').className = this.value + '_client'">
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="ar">Arabic</option>
          <option value="pt">Portuguese</option>
          <!-- <option value="jp">Japanese</option> -->
          <!-- <option value="de">German</option> -->
        </select>
        <img id="${clientName}_audio" class="audioToggle" onfocus="this.oldvalue = this.value;" onclick="toggleAudio('${clientName}')" width="20px" height="20px"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8REREAAAB7e3ukpKR1dXWKiooODg4ICAgLCwv7+/vx8fEEBATr6+vW1tbMzMyenp6EhITi4uJISEhqamqysrLBwcHb29tAQEA5OTkxMTEpKSlgYGBWVlbu7u6rq6uRkZFZWVkdHR1iYmI7OzsaGhpHR0dra2vExMS5ublkEtjSAAAGv0lEQVR4nO2d63raMAyGE9MWCMe2UNbRA2vXrtz/DY7DCsSSbckkQ/aj728T6jcHy7a+yEWhUqlUKpVKpVKpVCqVSqVSqVQqlUqlUqlUqjY1Gl26Ba3q7o/Z6HN96Xa0ppUx3bIsjbm/dEta0syU/2R+XrotrejzALhBvL10a5rXy9sJ4AZxcOkGNa2FqQGWZn7pFjWsB9Mv64SZPabT+g3cEnYu3aZG1QGAmRE+Q8CsCAc/EcCcCO8MBpgR4cT0MMB8CF93A9GMCW/QJzQjwncnYB6E1Q83YBaEow8PYA6EYzP0AGZAuHZ1orkQrnxPaA6E1yHA1Anvg4BpEw6WYcCkCR1D7XwIv+z1itwIrwJRInnCW8oTmjLhLypgooTVIxkwTcJRjw6YJOHYsV6RDeGc2IkmSxgcaqdO+IcJmBzhJxcwMUIrNRhLOJqvVuvotGL1MF293p3F4ZSdGowjHLybna6rqEbc7M++b4MRpAajCA+XyZgIO0q1PJz91QzViWBqMIZwcLxMQ8O/i8fkT9c0fReR1GAM4ezUxcA2apwOh4ePjbHthKUGIwgHdRfDE68R9QmNGTfIh6cGIwjXlo2BleR/tU6eNgdIW6+gENovs3mlt2Jin+uOtItp55qjDmuo7SW8si+VmVABR/Z42Ek4ujdcsYbaXsIHm7BLjRlVz77M5go/cnzGExejOmEF/nmvT4sZcNLtCBeDqLB9hqxnCa7vmN8UQJihNM/4kbP/ewfh2/IBMlXmPQwIc8xdh2Fu8L8BASHoMDaH3IQA54gTyRENwZveukCPN0ZaG3D3Yae47Megt25dsE9n3JC9sNu+ch0sgRBZCPHGjKqEr+7MebQIQqS7G364Ywb0QZgf7ushg7D4zWg0vBy90hNChRBWXTAOdD14zEdaCiG981hzuyUphGCiUOIBgB9axBDSYsYLf3gghxAdiL1Yx7zxh3iCCIsnGDPe6kdAq4cJLs5IIsQmRLXvpGAGodcLTrVEEVZw7cBcH/8Mly8pK4iiCIs7pCM5LC8hkwTKkocsQjRmPOz/tED+RFm2EkZoLxDuTlhs/4CsRdCWHqURIqsa/d3kHRrKzC8KoDxCxLdilmicIKYA5BEWcDndPGF3lpjGEUiIvXFRcUIsIRYz4K+Qs4USCYuvsNHYsbydCmGwVRy3g0zCQPrVtbqdEqE3AbuNHukTIhH+W33e9+5iCd0Zo/0oLn3CzUgbjxnfI/H0CR0pFXayXjAhatjhu+IkExZ9+JzyTUWSCTF3PN8WJJgQ/76BOCtMgRCZ7e/PZ1YOEUuIrNh8/wDDVCSY0DeDopuKBBNWQ4/rimwqkkzo/waHaioSTOgpWLD/DZKpSDChu+TE4UcIpiLBhEgmEf5K0FQkmBBL8/JNRYIJsYz+FMvKED3P4ggddiCuA0MwocsOhJiKfC4auYRuEJ4TSiyh52GsSrKpSDCh1w7EciQKJQzYgYimIsGEQTsQ24gqjTDs+KaYigQTws9RoR0obCoSTEizA4VMRYIJsTiBpHmRqfGpqUgwIRYn0MUKr6lIMCHDDuQxFQkmZNmBnKYiyYQ8O5DLVCSYkGsHwk1FgglhjbeQHQgxFTlT+2FjR9MChBG2Uey9dcUM+IVj27IJo2yjnJgRLgPYsCxCbE5EsAMhz55rEI44j9uVRQhtJbTEBuxAeq4R6jlfnseoDjBi9Bl1QVOR8+EezLifcnsrsPIIwZSPbgcCd98z43+Zr24YWvnKBDMJ7Y6UYweyxwlN1vaB07RYQvt14tiB7JjRaPUicg3BEKHVJ/LsQNZ4nWHJJMhZcp1JWNR+h2sHqsfSmAo+Hk1iKxVYhKcz38BcFtHpa0xaPeUoNsrYb8txXSJmM6jjgMUM4+pMeUSqqRsmrD73Y44h2ymzU2d/oftmGVp0i1FUnSHke/zlNsg+Ru5YNtmVZuk2WH3nVDGDWqxPH43HZ+wCVY3H7W1aF1HvK62ae9v+mhs1UiPcRF3mKDU5wuLFu9dDDoT+/TqyIGTWKUqSkGBiSp2QU0s4UULn/lX5ENIH4skSFhWxWGS6hNTa+ikT0oq2Jk1IyvOkTUjZpyRxQkIB7NQJw2sbyRMG93zKgDCwmUAOhP4NIbIg9O6flwehb2OWTAiLUdf1pOZCWFSwnGVmhM4kY0aErg95MyLEk4xZEaJJxrwIsbWNzAiRgXhuhDDJSPnOJTFZSUbet+ZpqJZkdLrPktbpQDzHW1ic7BLSb9bVI0iD573nr9f8xlpitFjN3m+ZJZ5UKpVKpVKpVCqVSqVSqVQqlUqlUqlU8vUXVa9oQZ6GDQoAAAAASUVORK5CYII="></src>
        </div>
    `
    )
}
// source.src='audio/ogg/' + this.parentElement.getAttribute('data-value');


function removeClient(clientName) {

}

function getNumClients() {
    return
}
//Gets called whenever you receive a message for your subscriptions
// clients['${clientName}'].onMessageArrived = function (message) {
//     //Do something with the push message you received
//     // $('#messages').append('<span>' + message.payloadString + '</span><br/>');
//     document.getElementById("${clientName}_messages").value += message.payloadString + '\n'
// };

 //Connect Options
var options = {
     timeout: 40,
     cleanSession: cleansession,
     useSSL: useTLS,
     userName: 'a-agf5n9-ysppbltpx0',
     password: '9W1x8syMb-AOku(H_3',
     onSuccess: function () {
         console.log("Connected");

         var watson_channel = 'iot-2/type/MQTTDevice/id/965d11de/evt/'+  "msgin" + '/fmt/json'
         clients['client1'].subscribe( watson_channel,
           {
             onSuccess: function () {
                 console.log('subscribed to ' + watson_channel);
                 // subscribe to initial client
                //  clientName = '${clientName}'
                //  clients[clientName].subscribe('languagetest/translated/' + document.querySelector(`#${clientName}_language`).value);
                 // TODO, create div classes for
                 // document.getElementById('').style.backgroundColor = 'green';
                //  console.log('subscribing to ' + 'languagetest/translated/' + document.querySelector(`#${clientName}_language`).value)
             },
             onFailure: function (message) {
                 console.log("Connection failed: " + message.errorMessage);
             }
           }
         );
         // subscribe to initial client
        //  clientName = '${clientName}'
        //  clients[clientName].subscribe('languagetest/translated/' + document.querySelector(`#${clientName}_language`).value);
         // TODO, create div classes for
         // document.getElementById('').style.backgroundColor = 'green';
        //  console.log('subscribing to ' + 'languagetest/translated/' + document.querySelector(`#${clientName}_language`).value)
     },
     onFailure: function (message) {
         console.log("Connection failed: " + message.errorMessage);
     },
    //  onConnectionLost: function (responseObject) {
    //      //Depending on your scenario you could implement a reconnect logic here
    //      console.log("connection lost: " + responseObject.errorMessage);
    //     //  clients['${clientName}'].connect(options)
    //  }
 };

// var clientId = clients['${clientName}']._getClientId()
var languageTopics = [
    "languagetest/translated/en",
    "languagetest/translated/es",
    "languagetest/translated/fr",
    "languagetest/translated/ar"
]
var unsubscribeOptions = {
    onFailure: function(err){err}
}

function refreshConnection (clientName, oldLang) {
    // clients[clientName].connect(options)
    // console.log(clientName)
    // console.log("subscribing to " + document.querySelector('#' + clientName + '_language').value + " topic");

    // languageTopics.forEach( function(topic) {
        // clients[clientName].unsubscribe(topic, unsubscribeOptions);
        // console.log("unsubscribed from " + topic);
    // });
    // $('#${clientName}_language').getAttribute("value")
    // document.querySelector("${clientName}_language").value
    // console.log("subscribing to " + document.querySelector(`#${clientName}_language`).value )
    console.log(clientName + " unsubscribing from " + oldLang)

    clients[clientName].unsubscribe('languagetest/translated/' + oldLang,
      {
        onSuccess: function(){ console.log(clientName + " successfully unsubscribed from channel " + oldLang) }
      });
    console.log(clientName + " subscribing to " + document.querySelector(`#${clientName}_language`).value)
    clients[clientName].subscribe('languagetest/translated/' + document.querySelector(`#${clientName}_language`).value,
      {
        onSuccess: function(){ console.log(clientName + " successfully subscribed to new channel " + document.querySelector(`#${clientName}_language`).value) }
      });
    // clients[clientName].disconnect()
    // clients[clientName].connect(options)
}

//Creates a new Messaging.Message Object and sends it to the MQTT Broker
var publish = function (payload, topic, qos, clientName) {
     //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
    //  console.log("payload '" + payload.d.message + "' sent")
     console.log(JSON.stringify(payload))
     var message = new Messaging.Message(JSON.stringify(payload));
     message.destinationName = topic;
     message.qos = qos;
     //  window.setTimeout(function(){
    //  clients['${clientName}'].send(message);
     clients[clientName].send(message);
     $('#' + clientName + '_message').val("")
    //  } , 3000);
}
