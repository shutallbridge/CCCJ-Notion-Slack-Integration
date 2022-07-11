import { Step } from '../Step';
import { app } from '../api/slack';
import prependHttp from 'prepend-http';

export interface SubmitTriggerReturnArgs {
  client: any;
  trigger_id: string;
  username: string;
  name: string;
  aboutYourself: string;
  tags: string[];
  linkedin: string;
}

export class SubmitTrigger<NextArgs> extends Step<
  null,
  SubmitTriggerReturnArgs,
  NextArgs
> {
  public onStart(next: (returnArgs: SubmitTriggerReturnArgs) => void) {
    app.view(
      'callback_self_intro_modal',
      async ({ ack, body, view, client }) => {
        await ack();
        const name =
          view['state']['values']['input_name']['plain_text_input-action'][
            'value'
          ] ?? '';
        const aboutYourself =
          view['state']['values']['input_about_yourself']['text_input'][
            'value'
          ] ?? '';
        // TODO: Fix type error?
        const tags = view['state']['values']['input_tags'][
          'multi_select_input'
        ]['selected_options']?.reduce(
          (prev, curr) => prev.concat(curr.value as unknown as any),
          []
        ) as string[];
        const linkedin =
          view['state']['values']['input_linkedin']['plain_text_input-action'][
            'value'
          ] ?? '';

        const linkedinPrepended = prependHttp(linkedin, { https: false });

        next({
          client,
          trigger_id: (body as unknown as any).trigger_id,
          username: body.user.name,
          name,
          aboutYourself,
          tags,
          linkedin: linkedinPrepended,
        });
      }
    );
  }
}
