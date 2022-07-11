import { Step } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface ReceivedReplyMessageArgs {
  threadTs: string;
  threadAuthor: string;
  replyAuthor: string;
}

export class ReceivedReplyMessage<NextArgs> extends Step<
  ReceivedReplyMessageArgs,
  void,
  NextArgs
> {
  public async onExecute(args: ReceivedReplyMessageArgs) {
    // Typeguard
    if (!CHANNEL_ID_SELF_INTRO) return;

    await app.client.chat.postEphemeral({
      channel: CHANNEL_ID_SELF_INTRO,
      thread_ts: args.threadTs,
      user: args.threadAuthor,
      text: `You received a reply from <@${args.replyAuthor}> for your self-intro. Make sure to take a look!`,
    });
  }
}
