import { Step } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';
import { skipBots, skipEventMessages } from '../middleware';
import { queryPageIdByUserId } from '../utils/notion';

export interface FilterIncompleteUserReturnArgs {
  channelId: string;
  threadTs?: string;
  userId: string;
}

async function skipSelfIntroChannels({ message, next }) {
  if (message.channel === CHANNEL_ID_SELF_INTRO) return;
  await next();
}

export class FilterIncompleteUser<NextArgs> extends Step<
  null,
  FilterIncompleteUserReturnArgs,
  NextArgs
> {
  public onStart(next: (returnArgs: FilterIncompleteUserReturnArgs) => void) {
    app.message(
      skipBots,
      skipEventMessages,
      skipSelfIntroChannels,
      async ({ event }) => {
        const userId = (event as unknown as any).user as string | undefined;

        const channelId = event.channel;

        const threadTs = (event as unknown as any).thread_ts as
          | string
          | undefined;

        if (!userId) return;

        // // Skip if pageId exists
        const pageId = await queryPageIdByUserId(userId);
        if (!!pageId) return;

        next({ userId, channelId, threadTs });
      }
    );
  }
}
