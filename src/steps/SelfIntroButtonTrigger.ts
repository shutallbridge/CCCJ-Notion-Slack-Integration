import { Step } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';

export interface SelfIntroButtonTriggerReturnArgs {
  client: any;
  trigger_id: string;
  messageText?: string;
}

export class SelfIntroButtonTrigger<NextArgs> extends Step<
  null,
  SelfIntroButtonTriggerReturnArgs,
  NextArgs
> {
  public onStart(next: (returnArgs: SelfIntroButtonTriggerReturnArgs) => void) {
    app.action('action_get_started', async ({ ack, client, body }) => {
      await ack();

      const messageText = (body as unknown as any).actions[0].value as
        | string
        | undefined;

      next({
        client,
        trigger_id: (body as unknown as any).trigger_id,
        messageText,
      });
    });
  }
}
