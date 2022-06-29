import { Step, NextArg } from '../Step';
import { CHANNEL_ID_SELF_INTRO } from '../api/slack';

interface PostMessageAsArgs {
  client?: any;
  trigger_id?: string;
  username?: string;
  name?: string;
  aboutYourself?: string;
  tags?: string[];
}

export class PostMessageAs implements Step {
  public async execute(args: PostMessageAsArgs) {
    if (args.client && args.username && args.name && args.aboutYourself) {
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
        username: args.username,
        name: args.name,
        aboutYourself: args.aboutYourself,
        tags: args.tags,
      };
    }
  }
}
