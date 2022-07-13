import { Step } from '../Step';
import { app } from '../api/slack';
import { CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface RequestSelfIntroArgs {
  channelId: string;
  threadTs?: string;
  userId: string;
}

export class RequestSelfIntro<NextArgs> extends Step<
  RequestSelfIntroArgs,
  void,
  NextArgs
> {
  public async onExecute(args: RequestSelfIntroArgs) {
    await app.client.chat.postEphemeral({
      channel: args.channelId,
      user: args.userId,
      ...(args.threadTs && { thread_ts: args.threadTs }),
      text: `Hey, it looks like you have not completed your self-intro yet. Please take this time to introduce yourself to the community. You can get started by typing \`/intro\` into the <#${CHANNEL_ID_SELF_INTRO}> channel. A new popup window will appear with a self-intro form for you to fill in.`,
    });
  }
}
