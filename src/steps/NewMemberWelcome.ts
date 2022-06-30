import { Step } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';

export class NewMemberWelcome<NextArgs> extends Step<null, null, NextArgs> {
  public onStart() {
    app.event('member_joined_channel', async ({ event, client }) => {
      if (event.channel === CHANNEL_ID_SELF_INTRO) {
        await client.chat.postEphemeral({
          channel: CHANNEL_ID_SELF_INTRO,
          user: event.user,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Hi there :wave:',
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Great to see you here! Please take this time to introduce yourself to the community! You can always come back and update your self introduction by using the `/intro` command.',
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Get Started',
                    emoji: true,
                  },
                  value: 'btn_get_started',
                  action_id: 'action_get_started',
                },
              ],
            },
          ],
        });
      }
    });
  }
}
