'use strict';

var app = require('./app.js');
var fs = require('fs');
var express = require('express');
var https = require('https');
var httpProxy = require('http-proxy');
var pem = require('pem');


// Deployment tracking
require('cf-deployment-tracker-client').track();

var port = process.env.VCAP_APP_PORT || 5000;
app.set('port', (process.env.PORT || port));

var key = fs.readFileSync('public/ca.key').toString();
var cert = fs.readFileSync('public/ca.crt').toString();
var options = { key: key, cert: cert};

// http
app.listen(port);
console.log('listening at:', port);

// https
// https.createServer(options, app).listen(port, function(){
//   console.log("Node app is running at: " + app.get('port'));
// });

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     var httpsOptions = {
//         key: keys.serviceKey,
//         cert: keys.certificate
//     };
//
//     var proxy = httpProxy.createProxyServer({
//         target: "169.45.79.70",
//         port: 8000,
//         ws: true,
//         secure: false,
//         changeOrigin: true
//     });
//
//     var proxyWebsocket = function (req, socket, head) {
//         // replace the target with your signaling server ws url
//         proxy.ws(req, socket, head, {
//             target: '169.45.79.70',
//             port: 8000
//         });
//     };
//
//     var app = express();
//     var server = https.createServer(httpsOptions, app);
//     server.on('upgrade', proxyWebsocket);
//
//     server.listen(8000);
// });
