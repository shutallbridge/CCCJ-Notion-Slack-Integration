import { Step, NextCallback } from '../Step';
import { app } from '../api/slack';

export class SubmitTrigger implements Step {
  public initialRun(next: NextCallback) {
    app.view(
      'callback_self_intro_modal',
      async ({ ack, body, view, client }) => {
        await ack();
        const name =
          view['state']['values']['input_name']['plain_text_input-action'][
            'value'
          ];
        const aboutYourself =
          view['state']['values']['input_about_yourself']['text_input'][
            'value'
          ];
        // TODO: Fix type error?
        const tags = view['state']['values']['input_tags'][
          'multi_select_input'
        ]['selected_options']?.reduce(
          (prev, curr) => prev.concat(curr.value as unknown as any),
          []
        ) as string[];

        next({
          client,
          trigger_id: (body as unknown as any).trigger_id,
          username: body.user.name,
          name,
          aboutYourself,
          tags,
        });
      }
    );
  }
}
