// var mqtt_host = "localhost" ; // TODO
// var mqtt_port = 8000 ; // 8001 ssl
var mqtt_host = 'agf5n9.messaging.internetofthings.ibmcloud.com'
var mqtt_port = 443
var useTLS = true // true ssl

// MacbookPro:~ kalonji$ mqtt_sub -i 'a:agf5n9:foo' -u 'a-agf5n9-ysppbltpx0' -P '9W1x8syMb-AOku(H_3' -h 'agf5n9.messaging.internetofthings.ibmcloud.com' -p 443 -C wss -t 'iot-2/type/MQTTDevice/id/965d11de/evt/flight/fmt/json'
// var useTLS = false // true ssl

var cleansession = true;
var clients = {}

// init first client
var client_prefix = 'a:agf5n9:'
console.log(client_prefix + "myclientid_" + parseInt(Math.random() * 100))

clients['client1'] = new Messaging.Client(mqtt_host, mqtt_port, client_prefix + "myclientid_" + parseInt(Math.random() * 100, 10));
clients['tokens'] = new Messaging.Client(mqtt_host, mqtt_port, client_prefix + "myclientid_" + parseInt(Math.random() * 100, 10));

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
    // present form to user with fields for name and language

    // Predefine 4 clients per browser
    // clients[clientName] = new Messaging.Client(mqtt_host, mqtt_port, "myclientid_" + parseInt(Math.random() * 100, 10));
    // set onconnection lost, on message arrived, etc

    // create client

    // var clients[clientName] = new Messaging.Client(mqtt_host, mqtt_port, "myclientid_" + parseInt(Math.random() * 100, 10));
    var clientName = 'client' + ( Object.keys(clients).length + 1 )

    clients[clientName] = new Messaging.Client(mqtt_host, mqtt_port, "myclientid_" + parseInt(Math.random() * 100, 10) );
    clientId = clients[clientName]._getClientId()
    clients[clientName].connect(Object.assign(options, {onSuccess: function() {document.getElementById(clientName + "_div").style.border = "thick solid #0000FF"; } }))

    window.setTimeout(function(){
      // set client behavior
      clients[clientName].onMessageArrived = function (message) {
         //Do something with the push message you received
         // $('#messages').append('<span>' + message.payloadString + '</span><br/>');
         document.getElementById(`${clientName}_messages`).value += message.payloadString + '\n'
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
             //  clientName = 'client1'
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
      // $('#client2_language').value
      console.log('subscribing to ' + 'languagetest/translated/' + document.querySelector(`#${clientName}_language`).value)
    } , 3000);



    // create additional div within main "clients" div
    $('#clientContainer').append(`
        <div id="${clientName}_div">
        <textarea readonly id="${clientName}_messages" style='border:solid 1px black;' dir='auto'></textarea>
        <form><input type='text' id="${clientName}_message"></form>
        <button onclick="console.log(document.querySelector('#${clientName}_message').value) ;  publish(document.querySelector('#${clientName}_message').value,'languagetest/clientout/text/' + document.querySelector('#${clientName}_language').value + '/' + clients['${clientName}']._getClientId() ,2, '${clientName}');">Submit</button>
        <select id="${clientName}_language" selected='english' onfocus="this.oldvalue = this.value;" onchange="refreshConnection('${clientName}', oldvalue)">
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="ar">Arabic</option>
          <option value="pt">Portuguese</option>
          <!-- <option value="jp">Japanese</option> -->
          <!-- <option value="de">German</option> -->
        </select>
        <img id="${clientName}_audio" class="audioToggle" onfocus="this.oldvalue = this.value;" onclick="toggleAudio('${clientName}')" width="20px" height="20px"  src="data:image/png;base64,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"></src>
        </div>
    `
    )
}
// TODO, place these in the proper place
// mute icon
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8REREAAAB7e3ukpKR1dXWKiooODg4ICAgLCwv7+/vx8fEEBATr6+vW1tbMzMyenp6EhITi4uJISEhqamqysrLBwcHb29tAQEA5OTkxMTEpKSlgYGBWVlbu7u6rq6uRkZFZWVkdHR1iYmI7OzsaGhpHR0dra2vExMS5ublkEtjSAAAGv0lEQVR4nO2d63raMAyGE9MWCMe2UNbRA2vXrtz/DY7DCsSSbckkQ/aj728T6jcHy7a+yEWhUqlUKpVKpVKpVCqVSqVSqVQqlUqlUqlUqjY1Gl26Ba3q7o/Z6HN96Xa0ppUx3bIsjbm/dEta0syU/2R+XrotrejzALhBvL10a5rXy9sJ4AZxcOkGNa2FqQGWZn7pFjWsB9Mv64SZPabT+g3cEnYu3aZG1QGAmRE+Q8CsCAc/EcCcCO8MBpgR4cT0MMB8CF93A9GMCW/QJzQjwncnYB6E1Q83YBaEow8PYA6EYzP0AGZAuHZ1orkQrnxPaA6E1yHA1Anvg4BpEw6WYcCkCR1D7XwIv+z1itwIrwJRInnCW8oTmjLhLypgooTVIxkwTcJRjw6YJOHYsV6RDeGc2IkmSxgcaqdO+IcJmBzhJxcwMUIrNRhLOJqvVuvotGL1MF293p3F4ZSdGowjHLybna6rqEbc7M++b4MRpAajCA+XyZgIO0q1PJz91QzViWBqMIZwcLxMQ8O/i8fkT9c0fReR1GAM4ezUxcA2apwOh4ePjbHthKUGIwgHdRfDE68R9QmNGTfIh6cGIwjXlo2BleR/tU6eNgdIW6+gENovs3mlt2Jin+uOtItp55qjDmuo7SW8si+VmVABR/Z42Ek4ujdcsYbaXsIHm7BLjRlVz77M5go/cnzGExejOmEF/nmvT4sZcNLtCBeDqLB9hqxnCa7vmN8UQJihNM/4kbP/ewfh2/IBMlXmPQwIc8xdh2Fu8L8BASHoMDaH3IQA54gTyRENwZveukCPN0ZaG3D3Yae47Megt25dsE9n3JC9sNu+ch0sgRBZCPHGjKqEr+7MebQIQqS7G364Ywb0QZgf7ushg7D4zWg0vBy90hNChRBWXTAOdD14zEdaCiG981hzuyUphGCiUOIBgB9axBDSYsYLf3gghxAdiL1Yx7zxh3iCCIsnGDPe6kdAq4cJLs5IIsQmRLXvpGAGodcLTrVEEVZw7cBcH/8Mly8pK4iiCIs7pCM5LC8hkwTKkocsQjRmPOz/tED+RFm2EkZoLxDuTlhs/4CsRdCWHqURIqsa/d3kHRrKzC8KoDxCxLdilmicIKYA5BEWcDndPGF3lpjGEUiIvXFRcUIsIRYz4K+Qs4USCYuvsNHYsbydCmGwVRy3g0zCQPrVtbqdEqE3AbuNHukTIhH+W33e9+5iCd0Zo/0oLn3CzUgbjxnfI/H0CR0pFXayXjAhatjhu+IkExZ9+JzyTUWSCTF3PN8WJJgQ/76BOCtMgRCZ7e/PZ1YOEUuIrNh8/wDDVCSY0DeDopuKBBNWQ4/rimwqkkzo/waHaioSTOgpWLD/DZKpSDChu+TE4UcIpiLBhEgmEf5K0FQkmBBL8/JNRYIJsYz+FMvKED3P4ggddiCuA0MwocsOhJiKfC4auYRuEJ4TSiyh52GsSrKpSDCh1w7EciQKJQzYgYimIsGEQTsQ24gqjTDs+KaYigQTws9RoR0obCoSTEizA4VMRYIJsTiBpHmRqfGpqUgwIRYn0MUKr6lIMCHDDuQxFQkmZNmBnKYiyYQ8O5DLVCSYkGsHwk1FgglhjbeQHQgxFTlT+2FjR9MChBG2Uey9dcUM+IVj27IJo2yjnJgRLgPYsCxCbE5EsAMhz55rEI44j9uVRQhtJbTEBuxAeq4R6jlfnseoDjBi9Bl1QVOR8+EezLifcnsrsPIIwZSPbgcCd98z43+Zr24YWvnKBDMJ7Y6UYweyxwlN1vaB07RYQvt14tiB7JjRaPUicg3BEKHVJ/LsQNZ4nWHJJMhZcp1JWNR+h2sHqsfSmAo+Hk1iKxVYhKcz38BcFtHpa0xaPeUoNsrYb8txXSJmM6jjgMUM4+pMeUSqqRsmrD73Y44h2ymzU2d/oftmGVp0i1FUnSHke/zlNsg+Ru5YNtmVZuk2WH3nVDGDWqxPH43HZ+wCVY3H7W1aF1HvK62ae9v+mhs1UiPcRF3mKDU5wuLFu9dDDoT+/TqyIGTWKUqSkGBiSp2QU0s4UULn/lX5ENIH4skSFhWxWGS6hNTa+ikT0oq2Jk1IyvOkTUjZpyRxQkIB7NQJw2sbyRMG93zKgDCwmUAOhP4NIbIg9O6flwehb2OWTAiLUdf1pOZCWFSwnGVmhM4kY0aErg95MyLEk4xZEaJJxrwIsbWNzAiRgXhuhDDJSPnOJTFZSUbet+ZpqJZkdLrPktbpQDzHW1ic7BLSb9bVI0iD573nr9f8xlpitFjN3m+ZJZ5UKpVKpVKpVCqVSqVSqVQqlUqlUqlU8vUXVa9oQZ6GDQoAAAAASUVORK5CYII=


// speaker icon
// data:image/png;base64,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



var audio = document.getElementById('playResults');

var source = document.getElementById('wavSource');

// source.src='audio/ogg/' + this.parentElement.getAttribute('data-value');


function removeClient(clientName) {

}

function getNumClients() {
    return
}
//Gets called whenever you receive a message for your subscriptions
// clients['client1'].onMessageArrived = function (message) {
//     //Do something with the push message you received
//     // $('#messages').append('<span>' + message.payloadString + '</span><br/>');
//     document.getElementById("client1_messages").value += message.payloadString + '\n'
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
         // subscribe to initial client
        //  clientName = 'client1'
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
    //     //  clients['client1'].connect(options)
    //  }
 };

var clientId = clients['client1']._getClientId()
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
    // $('#client1_language').getAttribute("value")
    // document.querySelector("client1_language").value
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

//Creates a new Messaging.Message Object and sends it to the HiveMQ MQTT Broker
var publish = function (payload, topic, qos, clientName) {
     //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
     var message = new Messaging.Message(payload);
     message.destinationName = topic;
     message.qos = qos;
     console.log("clientName")
     console.log(clientName)
     clients[clientName].send(message);
}
