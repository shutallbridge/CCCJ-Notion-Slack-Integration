import { Step } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';
import {
  skipBots,
  skipEventMessages,
  skipNewConversations,
} from '../middleware';

export interface ThreadReplyReturnArgs {
  threadTs: string;
  threadAuthor: string;
  replyAuthor: string;
}

export class ThreadReply<NextArgs> extends Step<
  null,
  ThreadReplyReturnArgs,
  NextArgs
> {
  public onStart(next: (returnArgs: ThreadReplyReturnArgs) => void) {
    app.message(
      skipBots,
      skipEventMessages,
      skipNewConversations,
      async ({ client, message }) => {
        const threadTs = (message as unknown as any).thread_ts as
          | string
          | undefined;

        const replyAuthor = (message as unknown as any).user as
          | string
          | undefined;

        // Typeguard: Skip if threadTs or replyAuthor
        // is not defined
        if (!CHANNEL_ID_SELF_INTRO || !threadTs) return;

        try {
          const result = await client.conversations.history({
            channel: CHANNEL_ID_SELF_INTRO,
            latest: threadTs,
            inclusive: true,
            limit: 1,
          });

          // Skip if first message is not available
          const firstMessage = result.messages ? result.messages[0] : null;
          if (!firstMessage) return;

          // Extract original author's userId
          const handleRe = /Slack\sHandle:\s<@\w+>/;
          const captureRe = /Slack\sHandle:\s<@(\w+)>/;
          const userElement = firstMessage.blocks
            ?.find((block) => block.type === 'context')
            ?.elements?.find((element) =>
              handleRe.test(element.text as string)
            );
          const userRegexResult = captureRe.exec(
            (userElement?.text as string | undefined) ?? ''
          );
          const threadAuthor = userRegexResult ? userRegexResult[1] : null;

          // Skip if failed to extract either authors
          if (!threadAuthor || !replyAuthor) return;

          // Skip if thread and reply has the same author
          if (threadAuthor === replyAuthor) return;

          next({ threadTs, threadAuthor, replyAuthor });
        } catch (error) {
          console.log('slack error', error);
          return;
        }
      }
    );
  }
}
