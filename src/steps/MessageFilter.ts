import { Step } from '../Step';
import {
  app,
  CHANNEL_ID_SELF_INTRO,
  SLACK_USER_OAUTH_TOKEN,
} from '../api/slack';

export interface MessageFilterReturnArgs {
  client: any;
  user: string;
  aboutYourself: string;
}

async function onlyHumansInSelfIntroChannel({ message, next }) {
  // Skip any message not in the self-intro channel
  if (message.channel !== CHANNEL_ID_SELF_INTRO) return;

  // Skip any message written by a bot
  if (!!message.bot_id) return;

  // Skip any channel_join messages
  if (message.subtype === 'channel_join') return;

  await next();
}

const re = /^\*Announcement\*/;

/**
 * Delete messages in the self-intro channel unless the
 * message begins with *Announcement*.
 */
export class MessageFilter<NextArgs> extends Step<
  null,
  MessageFilterReturnArgs,
  NextArgs
> {
  public onStart(next: (returnArgs: MessageFilterReturnArgs) => void) {
    app.message(
      onlyHumansInSelfIntroChannel,
      async ({ client, message, event }) => {
        const messageText = (message as unknown as any).text as string;

        // Don't delete message if it starts with *Announcement*
        if (re.test(messageText)) return;

        // Delete the message otherwise
        if (CHANNEL_ID_SELF_INTRO) {
          await client.chat.delete({
            channel: CHANNEL_ID_SELF_INTRO,
            ts: message.ts,
            token: SLACK_USER_OAUTH_TOKEN,
          });
        }

        next({
          client,
          user: (event as unknown as any).user,
          aboutYourself: messageText,
        });
      }
    );
  }
}
