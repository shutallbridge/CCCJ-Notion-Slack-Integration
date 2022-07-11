import { Step } from '../Step';
import { CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface PostMessageAsArgs {
  client: any;
  trigger_id: string;
  userId: string;
  username: string;
  name: string;
  aboutYourself: string;
  tags: string[];
  linkedin: string;
}

export interface PostMessageAsReturnArgs {
  client: any;
  trigger_id: string;
  userId: string;
  name: string;
  aboutYourself: string;
  tags: string[];
  linkedin: string;
}

export class PostMessageAs<NextArgs> extends Step<
  PostMessageAsArgs,
  PostMessageAsReturnArgs,
  NextArgs
> {
  public async onExecute(
    args: PostMessageAsArgs
  ): Promise<PostMessageAsReturnArgs> {
    await args.client.chat.postMessage({
      channel: CHANNEL_ID_SELF_INTRO,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `Say hello to ${args.name} :wave:`,
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: args.aboutYourself,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: `Tags: ${args.tags?.join(', ')}`,
              emoji: true,
            },
            {
              type: 'mrkdwn',
              text: args.linkedin
                ? `LinkedIn: <${args.linkedin}|${args.name}'s LinkedIn Profile>`
                : 'LinkedIn: NA',
            },
            {
              type: 'plain_text',
              text: `Slack Handle: <@${args.username}>`,
              emoji: true,
            },
          ],
        },
        {
          type: 'divider',
        },
      ],
    });
    return {
      client: args.client,
      trigger_id: args.trigger_id,
      userId: args.userId,
      name: args.name,
      aboutYourself: args.aboutYourself,
      tags: args.tags,
      linkedin: args.linkedin,
    };
  }
}
