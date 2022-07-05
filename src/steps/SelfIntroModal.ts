import { Step } from '../Step';
import { app } from '../api/slack';

export interface SelfIntroModalArgs {
  client: any;
  trigger_id: string;
}

export class SelfIntroModal<NextArgs> extends Step<
  SelfIntroModalArgs,
  void,
  NextArgs
> {
  public async onExecute(args: SelfIntroModalArgs) {
    await args.client.views.open({
      trigger_id: args.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'callback_self_intro_modal',
        title: {
          type: 'plain_text',
          text: 'Self Intro',
          emoji: true,
        },
        submit: {
          type: 'plain_text',
          text: 'Submit',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Let us know things like your background, interests, specialities, favorite pastimes, and what you hope to gain and contribute from this community. Your response will be posted on our CCCJ Notion Page available publicly along with everyone else. \n\n Keep in mind you can always come back and update your self intro with the `/intro` command in the #self-intro channel. If this is not your first time, your previous response will be overridden.',
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'input',
            block_id: 'input_name',
            element: {
              type: 'plain_text_input',
              action_id: 'plain_text_input-action',
            },
            label: {
              type: 'plain_text',
              text: 'What is your full name?',
              emoji: true,
            },
          },
          {
            type: 'input',
            block_id: 'input_about_yourself',
            label: {
              type: 'plain_text',
              text: 'Tell us about yourself',
              emoji: true,
            },
            element: {
              type: 'plain_text_input',
              action_id: 'text_input',
              multiline: true,
            },
          },
          {
            type: 'section',
            block_id: 'input_tags',
            text: {
              type: 'mrkdwn',
              text: 'Choose tags that best describe you (you can select multiple)',
            },
            accessory: {
              type: 'multi_static_select',
              placeholder: {
                type: 'plain_text',
                text: 'Select tags',
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: 'plain_text',
                    text: 'Founder',
                    emoji: true,
                  },
                  value: 'Founder',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Marketing',
                    emoji: true,
                  },
                  value: 'Marketing',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Sales',
                    emoji: true,
                  },
                  value: 'Sales',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Growth',
                    emoji: true,
                  },
                  value: 'Growth',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Product Manager',
                    emoji: true,
                  },
                  value: 'Product Manager',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'UX/UI',
                    emoji: true,
                  },
                  value: 'UX/UI',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Graphic Designer',
                    emoji: true,
                  },
                  value: 'Graphic Designer',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Frontend Developer',
                    emoji: true,
                  },
                  value: 'Frontend Developer',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Backend Developer',
                    emoji: true,
                  },
                  value: 'Backend Developer',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Mobile Developer',
                    emoji: true,
                  },
                  value: 'Mobile Developer',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Data Scientist',
                    emoji: true,
                  },
                  value: 'Data Scientist',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Venture Capitalist',
                    emoji: true,
                  },
                  value: 'Venture Capitalist',
                },
                {
                  text: {
                    type: 'plain_text',
                    text: 'Angel Investmentor',
                    emoji: true,
                  },
                  value: 'Angel Investmentor',
                },
              ],
              action_id: 'multi_select_input',
            },
          },
        ],
      },
    });
    // `multi_select_input` action always has to be acknowledged?
    app.action('multi_select_input', async ({ ack }) => {
      await ack();
    });
  }
}
