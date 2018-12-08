// // speech to text
// // wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize
//
// // get token
// // token=$(curl -u $username:$password "https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/speech-to-text/api")
//
// var wsURI = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + token + "&model=es-ES_BroadbandModel";
// var websocket = new WebSocket(wsURI);
// websocket.onopen = function(evt) { onOpen(evt) };
// websocket.onclose = function(evt) { onClose(evt) };
// websocket.onmessage = function(evt) { onMessage(evt) };
// websocket.onerror = function(evt) { onError(evt) };

//_______
// Text to speech
// get token (automate this onload)
// username="785a64f7-7943-4325-bea9-0c3bba595b0c"
// password="wojsjZk2nf55"
// token=$(curl -u $username:$password "https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/text-to-speech/api")
// echo $token

var voices = {
  "en": "en-US_LisaVoice",
  "fr": "fr-FR_ReneeVoice",
  "es": "es-ES_EnriqueVoice",
  "pt": "pt-BR_IsabelaVoice",
  "ja": "ja-JP_EmiVoice",
  "it": "it-IT_FrancescaVoice",
  "de": "de-DE_BirgitVoice"
}

var stt_models = {
  "en": "en-US_BroadbandModel",
  "fr": "fr-FR_BroadbandModel",
  "es": "es-ES_BroadbandModel",
  "pt": "pt-BR_BroadbandModel",
  "ja": "ja-JP_BroadbandModel",
  "ko": "ko-KR_BroadbandModel",
  "it": "it-IT_BroadbandModel", // doesn't exist
  "ar": "ar-AR_BroadbandModel",
  "de": "de-DE_BroadbandModel"
}
var wsURI
// var wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice="
//   + voices[document.getElementById("client1_language").value]
//   $('#client1_language')
//   + "&watson-token="
//   + token;
var messages = "";
var audioStream = [];
var audioToggle
var MyBlobBuilder = function() {
  this.parts = [];
}

MyBlobBuilder.prototype.append = function(part) {
  this.parts.push(part);
  this.blob = undefined; // Invalidate the blob
};

MyBlobBuilder.prototype.getBlob = function() {
  if (!this.blob) {
    this.blob = new Blob(this.parts, { type: "audio/wav" });
  }
  return this.blob;
};

// flow
// onLoad
function onOpen(evt, messageObj) {
   console.log("websocket connection opened")
   console.log( "transcribing " + messageObj )
   websocket.send(messageObj)
  //  var message = {"text": "Hello world.", "accept": "*/*"};
  //  websocket.send(JSON.stringify(message));
}

function onClose(evt) {
   console.log("audio connection closed") ;
   var bb = myBlobBuilder.getBlob() ;
   var url = URL.createObjectURL(bb) ;
   audio.src = url ;
   audio.load()
   audio.play();
   console.log("src: " + audio.src)
   audio.addEventListener('ended', function(){console.log("audio finished playing")
   audio.src = ""
   console.log("src: " + audio.src) })
   //  audio.children('source').prop('src', '');
   //  audio.remove().length = 0;
   //  myBlobBuilder = null ;
   audioStream = []
  //  console.log(evt) ;
   console.log("connection closed") ;
}

function onError(evt) {
   console.log("error")
   console.log(evt) ;
}

function onMessage(evt) {
   console.log("message received")
   console.log(evt.data)
   console.log(typeof evt.data)
   // taken from http://stackoverflow.com/questions/15970729/appending-blob-data
   var MyBlobBuilder = function() {
     this.parts = [];
   }

   MyBlobBuilder.prototype.append = function(part) {
     this.parts.push(part);
     this.blob = undefined; // Invalidate the blob
   };

   MyBlobBuilder.prototype.getBlob = function() {
     if (!this.blob) {
       this.blob = new Blob(this.parts, { type: "audio/wav" });
     }
     return this.blob;
   };

   if (typeof evt.data === "string") {
      messages += evt.data;
   } else {
      console.log(evt.data)
      console.log('Received ' + evt.data.size + ' binary bytes');
      audioStream.push(evt.data);
      myBlobBuilder.append(evt.data) ;
   }
}

// function confWebsocket(websocket) {
//   if (websocket.readyState == '1') {
    // websocket.onopen = function(evt) { onOpen(evt) };
    // websocket.onclose = function(evt) { onClose(evt) };
    // websocket.onerror = function(evt) { onError(evt) };
    // websocket.onmessage = function(evt) { onMessage(evt) };
//     console.log("websocket behavior set")
//   }
// }

// // taken from http://stackoverflow.com/questions/15970729/appending-blob-data
var MyBlobBuilder = function() {
  this.parts = [];
}

MyBlobBuilder.prototype.append = function(part) {
  this.parts.push(part);
  this.blob = undefined; // Invalidate the blob
};

MyBlobBuilder.prototype.getBlob = function() {
  if (!this.blob) {
    this.blob = new Blob(this.parts, { type: "audio/wav" });
  }
  return this.blob;
};

var myBlobBuilder, watsonTextToSpeechToken
// onMessageArrived
function initWs(client) {
  // var token = 'bfZFiahMjTlcJb%2F74ZTyrbOd%2FGwvK72bda55HAXnbPe59vGirX32xt6l135MW7mKJ%2BnZed4ZewxcHAJfxb6l6rRSxLJ5uithS9Z5RN9xKktSQlIhDYxKUfXWbb2q4Mgxd3cD6x7ihtOjMGaEHimzS1GiTWhgdpoPp3v%2Fa5JoESHYnHKjDDrnTKf3iAgGJXyEKLOtq7v5d4E1urBsTCHQsQMZqAqUaTPXJGo8YVe6mOQ69oxtCpbx%2FPItC1Uwx6iDCWUR3MK%2BT41qg0Eq8J0FtIw3AWX75aGYEyk%2FtCj%2BFLdNAuKe1gSACnvC%2B6NhC3LS0anpRJ5lzvwUzOf2%2B5uHzuiEvknpQ8wm55Rb7TN%2BCsTWDqm%2B8F4tHoF8VSx8ROv0yLcFQKXhjinSVnXXui0bT2SDHlQaNkpnMMtTiocOO8SmIvxl6LZDjRHaqdaphY0px9qbgP2XsKwb%2BbSfqqv2A4EyEMlYsVWjnHTj6ZqkBJQA6dinxxNKc32Pe2LLc9dEr6%2FTQW6xOc81jlqOia4INfiAI82aWNoIkWZRE2YsybCTqPv9NllOnN1%2F%2B5h7Pv%2BSrTAwo%2BoNzil4y%2FxrOaXdUHtKQURatRWna6ibIMCLGPuTqfAObS1oN5%2BPQCo9%2BQp%2BjumwiZWF5uG5B4fSYERUPhy1WgkcXWpKHQxvPBBVWeIeIhxJzuwO%2FbqeBo6mx4nQ1FNA3iCnofroGtvvOSiPVpaeojGNiry%2F%2Fp%2BqFAT2YohsETGF4OQerzxrAtcDmi%2BfeBz89O8PS9VIy4WBwpOcv%2BG5y3CH5M0zFYm8mTQkouXj4Q0iKl1O0L9%2FyUZQJjeJb50ZDVQkNli6Rw0fZKD4CLA8JkpsWKnvj2y7%2F1EvTTJN0zW8NSzbjM7mXBy86w71APbIU6xxS%2F8%3D';
  // var wsURI = "wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=" + token + "&model=es-ES_BroadbandModel";
  // watson_text_to_speech_token = function() {
  //   var xmlhttp = new XMLHttpRequest();
  //   xmlhttp.setRequestHeader("Authorization", "Basic " + Base64.encode(user + ":" + pass));
  //   var url = "https://stream.watsonplatform.net/authorization/api/v1/token?url=https://stream.watsonplatform.net/text-to-speech/api";
  //   xmlhttp.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //       var myArr = JSON.parse(this.responseText);
  //       myFunction(myArr);
  //     }
  //   xmlhttp.open("POST", url, true);
  //   xmlhttp.send();
  //
  //   };
  //
  //
  // }

  wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice="
    + voices[document.getElementById(client + "_language").value]
    + "&watson-token="
    + watsonTextToSpeechToken;
  websocket = new WebSocket(wsURI);
  websocket.onopen = function(evt) { onOpen(evt) };
  websocket.onclose = function(evt) { onClose(evt) };
  websocket.onmessage = function(evt) { onMessage(evt) };
  websocket.onerror = function(evt) { onError(evt) };
}

var websocket, token
// var messageObj

var audio = document.getElementById('playResults');

// clients['tokens'] = new Messaging.Client(mqtt_host, mqtt_port, "myclientid_" + parseInt(Math.random() * 100, 10));

clients['tokens'].onMessageArrived = function (message) {
  console.log("new token incoming")
  console.log("payload: " + message.d.payloadString)
  if (watsonTextToSpeechToken == undefined) {
    console.log("tts token being set")
    watsonTextToSpeechToken = message.d.payloadString ;
  }
  wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice="
    + "en" //+ voices[msgObj.language]
    + "&watson-token="
    + watsonTextToSpeechToken;

}

clients['serverLogs'].onMessageArrived = function (message) {
  console.log(message)
  console.log("log received: " +  message._getPayloadString())
  document.querySelectorAll('[id^="client"][id$="messages"]').forEach(
    function(e){
      // console.log(e)
      $('#' + e.id).append(`<div><p height=1px style='color: #BCD7C6 ; float: right ;  text-align:right; margin-top: 0.5px; font-size:12px ; margin-bottom: 0.5px' >${message._getPayloadString().replace(/['"]+/g, '')}</p></div>`)
      // e.value += message._getPayloadString() + '\n'
    }
  )
}

// TODO, client1 doesn't unsubscribe when changing language

// all audio icons have an identical class, unique id

// TODO, onMessageArrived function should be overridden every time audio button is clicked
// TODO, make a generic function here
var debugMessage, debugClient
clients['client1'].onMessageArrived = function (message) {
  //audio and text
  //Do something with the push message you received
  console.log("client message received")
  console.log(message._getPayloadString())
  debugMessage = message
  var msgObj = JSON.parse(message.payloadString).d
  // console.log(msgObj)
  // console.log("language: " + msgObj.language)
  // console.log("message: " + msgObj.payload)
  // document.getElementById("client1_messages").value += message.payloadString + '\n'

  // console.log("selecting clients " + msgObj.language + '_client')
  // console.log("clients " + document.getElementsByClassName( msgObj.language + '_client' ))

  // append incoming message text to clients with same language
  var langClients = document.getElementsByClassName( msgObj.language + '_client' )
  console.log("langClients")
  console.log(langClients)
  for (var i = 0; i < langClients.length; i++) {
  // for (client in Array(document.getElementsByClassName( msgObj.language + '_client' ))) {
    // langClients.item(i).value += msgObj.payload + '\n'
    // langClients.item(i).value += <div> msgObj.payload </div>
    // $("#client1_messages").append("<span><div style='margin-left: 18px;margin-top: 5px'>foo</div></span>")
    console.log("msgObj")
    console.log(msgObj)
    console.log("appending " + msgObj.language + " message " + msgObj.payload + " to " + langClients.item(i).id )
    $('#' + langClients.item(i).id).append("<div class='speech-bubble' align='left' ;  style='margin-left: 18px;margin-top: 5px'>" + (msgObj.client.split(':')[2] || msgObj.client) + ": " + msgObj.payload + "</div>")
    // $('#' + langClients.item(i).id).animate({scrollTop: $('#' + langClients.item(i).id).prop("scrollHeight")}, 500);
  }

  // determine if any clients subscribed to language have the "audioEnabled" class
  audioClients = document.getElementsByClassName('audioEnabled')[0] // TODO fix hack
  if ( (audioClients) && ( msgObj.language == document.getElementById(audioClients.id.split('_')[0] + '_language').value) )
  {

    var messageObj = JSON.stringify({"text": `${msgObj.payload}`, "accept": "audio/wav"});
    console.log("transcribing " + msgObj.payload)
    console.log(messageObj)
    // return
    var MyBlobBuilder = function() {
      this.parts = [];
    }

    MyBlobBuilder.prototype.append = function(part) {
      this.parts.push(part);
      this.blob = undefined; // Invalidate the blob
    };

    MyBlobBuilder.prototype.getBlob = function() {
      if (!this.blob) {
        this.blob = new Blob(this.parts, { type: "audio/wav" });
      }
      return this.blob;
    };
    myBlobBuilder = new MyBlobBuilder();
    console.log("Initialized blob builder")
    wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice="
      + voices[msgObj.language]
      + "&watson-token="
      + watsonTextToSpeechToken;
    console.log("watsonTextToSpeechToken")
    console.log(watsonTextToSpeechToken)
    websocket = new WebSocket(wsURI);
    websocket.onopen = function(evt) { onOpen(evt, messageObj) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };

  }
  // if ( 'audioEnabled' in document.getElementsByClassName( msgObj.language + '_audio' ).classList ) {
  //
  // }


  // if ${lang}_audio.classList includes 'audioEnabled'
  // return
  // this should be done for client that
  // initWs('client1')

  // each client's speaker icon should have a class dictacting whether they are on or off
  // class should also

  // if any client boxes are
  /*
  audioToggle = document.getElementById(msgObj.client + "_audio")
  // if document.getElementById(msgObj.lang + "_audio")
  if (msgObj.client.audioEnabled) {
    console.log("transcribing " + msgObj.payload)
    var messageObj = JSON.stringify({"text": `"${msgObj.payload}"`, "accept": "audio/wav"});
    var MyBlobBuilder = function() {
      this.parts = [];
    }

    MyBlobBuilder.prototype.append = function(part) {
      this.parts.push(part);
      this.blob = undefined; // Invalidate the blob
    };

    MyBlobBuilder.prototype.getBlob = function() {
      if (!this.blob) {
        this.blob = new Blob(this.parts, { type: "audio/wav" });
      }
      return this.blob;
    };
    myBlobBuilder = new MyBlobBuilder();
    wsURI = "wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice="
      + voices[document.getElementById('client1' + "_language").value]
      + "&watson-token="
      + watsonTextToSpeechToken;
    websocket = new WebSocket(wsURI);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };*/
  // }

  // var promise = new Promise(function(resolve, reject) {
  //   // do a thing, possibly async, then…
};
  //   if (websocket.readyState == 1) {
  //     resolve("Stuff worked!");
  //   }
  //   else {
  //     reject(("It broke"));
  //   }
  // });

  // window.setTimeout(function(){
  // // console.log(ready)
  // // TODO wait until websocket ready
  //   console.log(websocket.readyState)
  //   console.log("websocket.readyState")
  //   confWebsocket(websocket)
  //   window.setTimeout(function(){
  //     websocket.send(messageObj)
  //   }, 2500) ;
  //   // taken from http://stackoverflow.com/questions/15970729/appending-blob-data
  //   window.setTimeout(function(){
  //     var bb = myBlobBuilder.getBlob();
  //     var url = URL.createObjectURL(bb);
  //     audio.src = url;
  //   }, 3500) ;
  //
  //  }, 5000) ;
// };
