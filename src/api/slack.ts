import { App } from '@slack/bolt';

export const CHANNEL_ID_SELF_INTRO = process.env.CHANNEL_ID_SELF_INTRO;
export const SLACK_USER_OAUTH_TOKEN = process.env.SLACK_USER_OAUTH_TOKEN;

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('Started Bolt App');
})();
