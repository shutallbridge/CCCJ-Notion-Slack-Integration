import { Step } from '../Step';
import { CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface PostMessageAsArgs {
  client: any;
  trigger_id: string;
  username: string;
  name: string;
  aboutYourself: string;
  tags: string[];
}

export interface PostMessageAsReturnArgs {
  client: any;
  trigger_id: string;
  username: string;
  name: string;
  aboutYourself: string;
  tags: string[];
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
            type: 'plain_text',
            text: args.aboutYourself,
            emoji: true,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: `My Tags: ${args.tags?.join(', ')}`,
              emoji: true,
            },
          ],
        },
        {
          type: 'context',
          elements: [
            {
              type: 'plain_text',
              text: `My Handle: <@${args.username}>`,
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
      username: args.username,
      name: args.name,
      aboutYourself: args.aboutYourself,
      tags: args.tags,
    };
  }
}
