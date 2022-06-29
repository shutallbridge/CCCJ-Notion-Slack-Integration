import { Step, NextCallback } from '../Step';
import { app, CHANNEL_ID_SELF_INTRO } from '../api/slack';

export class SelfIntroTrigger implements Step {
  public initialRun(next: NextCallback) {
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
