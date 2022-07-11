import { Step } from '../Step';
import {
  app,
  CHANNEL_ID_SELF_INTRO,
  SLACK_USER_OAUTH_TOKEN,
} from '../api/slack';
import { skipBots, skipThreadReplies, skipEventMessages } from '../middleware';

export interface MessageFilterReturnArgs {
  client: any;
  user: string;
  aboutYourself: string;
}

async function skipNonSelfIntroChannels({ message, next }) {
  if (message.channel !== CHANNEL_ID_SELF_INTRO) return;
  await next();
}

const re = /^\*Announcement\*/;

/**
 * Don't delete messages that starts with *Announcement*
 */
async function deleteEscape({ message, next }) {
  if (re.test(message.text ?? '')) return;
  await next();
}

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
      skipBots,
      skipThreadReplies,
      skipEventMessages,
      skipNonSelfIntroChannels,
      deleteEscape,
      async ({ client, message, event }) => {
        const messageText = (message as unknown as any).text as string;

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
