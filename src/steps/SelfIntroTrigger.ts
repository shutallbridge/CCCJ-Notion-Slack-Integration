import { Step } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface SelfIntroTriggerReturnArgs {
  client: any;
  trigger_id: string;
}

export class SelfIntroTrigger<NextArgs> extends Step<
  null,
  SelfIntroTriggerReturnArgs,
  NextArgs
> {
  public onStart(next: (returnArgs: SelfIntroTriggerReturnArgs) => void) {
    app.action('action_get_started', async ({ ack, client, body }) => {
      await ack();
      next({ client, trigger_id: (body as unknown as any).trigger_id });
    });
    app.command('/intro', async ({ command, ack, body, client }) => {
      if (command.channel_id === CHANNEL_ID_SELF_INTRO) {
        await ack();
        next({ client, trigger_id: body.trigger_id });
      }
    });
  }
}
