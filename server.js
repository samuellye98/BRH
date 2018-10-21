var http = require('http');
var express = require('express');
var config = require('./web/chat/config');
var path = require('path');
var express = require('express');
var twilio = require('twilio');
var http = require('http');
var AccessToken = require('twilio').AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;
var twiliAccntInfoFromFile=config.getTwiliAccountSettingsfromFile ;


if (twiliAccntInfoFromFile !="Y" )
   {
     console.log("Loading Configuration from environment");
     // Load configuration information from system environment variables
     var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
     var    TWILIO_IPM_SERVICE_SID = process.env.TWILIO_IPM_SERVICE_SID ;
     var    TWILIO_IPM_API_KEY = process.env.TWILIO_IPM_API_KEY;
     var    TWILIO_IPM_API_SECRET = process.env.TWILIO_IPM_API_SECRET;
   }
else
   {
     console.log("Loading Configuration from config.js");

     // Load configuration information config file
     var TWILIO_ACCOUNT_SID = config.accountSid;
     var    TWILIO_IPM_SERVICE_SID = config.serviceSid ;
     var    TWILIO_IPM_API_KEY = config.apiKey;
     var    TWILIO_IPM_API_SECRET =  config.apiSecret;
   }


// Create an Express web app
var app = express();





    // Mount Express middleware for serving static content from the "public"
    // directory
    app.use(express.static(path.join(process.cwd(), 'web', 'chat', 'public')));
    app.use(express.static(path.join(process.cwd(), 'web', 'chat', 'assets')));



    // In production, validate that inbound requests have in fact originated
    // from Twilio. In our node.js helper library, we provide Express middleware
    // for this purpose. This validation will only be performed in production
    if (config.nodeEnv === 'production') {
        // For all webhook routes prefixed by "/twilio", apply validation
        // middleware
        app.use('/twilio/*', twilio.webhook(config.authToken, {
            host: config.host,
            protocol: 'https' // Assumes you're being safe and using SSL
        }));
    }


/*
Generate an Access Token for a chat application user - it generates a random
username for the client requesting a token, and takes a device ID as a query
parameter.
*/
app.get('/token', function(request, response) {
    var identity = request.query.identity;
    var endpointId = request.query.endpointId;

    // Create a "grant" which enables a client to use IPM as a given user,
    // on a given device
    var ipmGrant = new IpMessagingGrant({
        serviceSid: TWILIO_IPM_SERVICE_SID,
        endpointId: endpointId
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    console.log(TWILIO_ACCOUNT_SID);
    console.log(TWILIO_IPM_API_KEY);
    console.log(TWILIO_IPM_API_SECRET);
    console.log(TWILIO_IPM_SERVICE_SID);

    var token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_IPM_API_KEY, TWILIO_IPM_API_SECRET);
    token.addGrant(ipmGrant);
    token.identity = identity;

    // Serialize the token to a JWT string and include it in a JSON response
    response.send({
        identity: identity,
        token: token.toJwt()
    });
});

app.use(express.static(__dirname + '/web'))

//routes
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/web', 'index.html'));
});

app.get("/chat" , function(req,res)
 {
    res.sendFile(__dirname + "/web/chat/chat.html");
 }
);

app.get('/frame', function (req, res) {
  res.sendFile(__dirname +"/chat/framechat.html");
})

app.listen(8000, () => {
   console.log('Server running on port 8000!');
});
