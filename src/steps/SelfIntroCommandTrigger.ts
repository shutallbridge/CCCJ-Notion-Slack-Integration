import { Step } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface SelfIntroCommandTriggerReturnArgs {
  client: any;
  trigger_id: string;
}

export class SelfIntroCommandTrigger<NextArgs> extends Step<
  null,
  SelfIntroCommandTriggerReturnArgs,
  NextArgs
> {
  public onStart(
    next: (returnArgs: SelfIntroCommandTriggerReturnArgs) => void
  ) {
    app.command('/intro', async ({ command, ack, body, client }) => {
      if (command.channel_id === CHANNEL_ID_SELF_INTRO) {
        await ack();
        next({ client, trigger_id: body.trigger_id });
      }
    });
  }
}
