const { App } = require('@slack/bolt');
const request = require('request');
const { Request } = require("request")

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});
/*
// Listens to incoming messages that contain "hello"
app.message('studylane', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey <@${message.user}>! click button to ---------------------------->`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Subscribe"
          },
          "action_id": "button_click"
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  });
});
*/



// The studylane command simply echoes on command
app.command('/studylane', async ({ ack, body, client, logger }) => {
    // Acknowledge command request
    await ack();
    try {
        // Call views.open with the built-in client
        const result = await client.views.open({
          // Pass a valid trigger_id within 3 seconds of receiving it
          trigger_id: body.trigger_id,
          // View payload
          view: {
            type: 'modal',
            // View identifier
            callback_id: 'view_1',
            title: {
              type: 'plain_text',
              text: 'Modal title'
            },
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'You are welcome to subscribe to _Clean Code_ book'
                },
                accessory: {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Subscribe'
                  },
                  action_id: 'button_abc'
                }
              },
            ]
          }
        });
        logger.info(result);
      }
      catch (error) {
        logger.error(error);
      }
    });

  app.action('button_abc', async ({ body, ack}) => {
    // Acknowledge the action
    await ack();
    
    let json = {
      bookId: 1,
      webhookUrl: 'C057MRYSA6N',
      schedule: "DAILY"
    };
  
    request.post({
      url:     'http://45.79.160.133:8080/api/subscribe',
      headers: {
          'Content-Type': 'application/json'
        },
      body:    JSON.stringify(json)
    }, function(error, response, body){
      console.log(body);
    });
  });

(async () => {
  // Start your app
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();

