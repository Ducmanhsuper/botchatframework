// Denfined Views Function
require("dotenv").config();
import request from "request";
import service from "../services/BotServices";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};
let postWebhook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Get the webhook event. entry.messaging is an array, but 
            // will only ever contain one event, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);
            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }

        });
        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};
// Handle message
let  handleMessage = (sender_psid, received_message)=> {
}

// Handles messaging_postbacks events
let  handlePostback = async (sender_psid, received_postback) =>  {
    let payload = received_postback.payload;
    switch (payload){
        case  "Start":
         service.HandleStart(sender_psid); 
        break;
    }
    // let response;
    callSendAPI(sender_psid, response);
}
let persistent = async (req,res) => {
    // Construct the message body
    let request_body = {
      
            // "psid": `${sender_psid}`,
            "persistent_menu": [
                  {
                      "locale": "default",
                      "composer_input_disabled": false,
                      "call_to_actions": [
                          {
                              "type": "web_url",
                              "title": "Xem tài liệu của chúng tôi",
                              "url": "https://google.com",
                              "webview_height_ratio": "full"
                          },
                          {
                              "type": "postback",
                              "title": "Ghé thăm trang web",
                              "payload": "visitweb"
                          },
                          {
                              "type": "web_url",
                              "title": "Shop now",
                              "url": "https://www.originalcoastclothing.com/",
                              "webview_height_ratio": "full"
                          }
                      ]
                  }
              ]
   }
   
   
   // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
       "method": "POST",
       "json": request_body
   }, (err, res, body) => {
       if (!err) {
           console.log('Setup persistent menu success')
       } else {
           console.error("Unable to send message:" + err);
       }
   }); 
   
   return res.send("Good app, Thank You")
   }

let callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
         console.log("success");
         
        } else {
            console.error("err:" + err);
        }
    }); 

}
// export 
module.exports = {
  getWebhook:getWebhook,
  postWebhook:postWebhook,
  callSendAPI:callSendAPI,
  persistent:persistent
}