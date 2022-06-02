require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

app.event(
  'member_joined_channel',
  async ({ event, message, body, ...rest }) => {
    console.log('event', event);
    console.log('message', message);
    console.log('body', body);
    console.log('rest: (lines below)');
    console.dir(rest);
  }
);
