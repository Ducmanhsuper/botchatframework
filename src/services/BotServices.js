//  import 
import request from "request";
 require("dotenv").config();
 let callSendAPI = async (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
await CheckMarkSeen(sender_psid);
await CheckSending(sender_psid);
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
let CheckMarkSeen = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
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
let CheckSending = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
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
 

 const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
 let SetupProfile = async  (req,res) => {
    // Construct the message body
    let request_body = {
      "get_started":{"payload":"Start"},
      "whitelisted_domains":["https://botchatkhkt.onrender.com/"]
   }
   
   // Send the HTTP request to the Messenger Platform
    await request({
       "uri": `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
       "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
       "method": "POST",
       "json": request_body
   }, (err, res, body) => {
       if (!err) {
           console.log('Setup startbutton success')
       } else {
           console.error("Unable to send message:" + err);
       }
   }); 
   
   return res.send("Good app, Thank You")
   }
let GetProfile = async (sender_psid) => {
    return new Promise((resolve, reject)=> {
try {
    return request({
        "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "GET",
    }, (err, res, body) => {
        if (!err) {
            body = JSON.parse(body);
       let usename = `${body.first_name} ${body.last_name}`;
         resolve(usename);
        } else {
            console.error("err:" + err);
            reject(err);
        }
    }); 
}
catch{

}
    })
    // Send the HTTP request to the Messenger Platform

   
}
let HandleStart  = async (sender_psid) => {
   let UserName = await GetProfile(sender_psid);
 let reponse2 = {text:`Hello ${UserName}, chúng tôi là bên hỗ trợ kỹ thuật, xin chào!`};
 callSendAPI(sender_psid,reponse2);
 HandleEventStarted(sender_psid,UserName);

}

let HandleEventStarted = (sender_psid,UserName) => {
    // send temple choose for user 
    let reponse3 =  {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Đây là các nút bạn có thể lựa chọn",
                    "subtitle": "các nút sẽ được thực thi khi bạn chọn",
                    "image_url":"",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Liên hệ của chúng tôi",
                            "payload": "contact",
                        },
                        {
                            "type": "postback",
                            "title": "Thông tin sản phẩm",
                            "payload": "info",
                        }
                    ],
                }]
            }
        }
    }
    callSendAPI(sender_psid,reponse3);
    let reponse4 = {
        text: `chúng tôi sẽ giúp bạn hết mình, chúc ${UserName} có 1 ngày vui vẻ`
      }
     callSendAPI(sender_psid,reponse4)
}
    module.exports = {
        SetupProfile:SetupProfile,
        GetProfile:GetProfile,
        HandleStart:HandleStart
    }