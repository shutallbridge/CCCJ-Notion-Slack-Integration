import { Step } from '../Step';
import { CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface EnforcementMessageArgs {
  client: any;
  user: string;
  aboutYourself: string;
}

export class EnforcementMessage<NextArgs> extends Step<
  EnforcementMessageArgs,
  void,
  NextArgs
> {
  public async onExecute(args: EnforcementMessageArgs) {
    await args.client.chat.postEphemeral({
      channel: CHANNEL_ID_SELF_INTRO,
      user: args.user,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "This channel is managed by our Slackbot. To introduce yourself in this channel, use the button below to get started. Don't worry, your previous message has been saved and will be pre-filled in the next step.",
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
              value: args.aboutYourself,
              action_id: 'action_get_started',
            },
          ],
        },
      ],
    });
  }
}
