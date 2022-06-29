import { Step } from '../Step';

interface AllDoneModalArgs {
  client?: any;
  trigger_id?: string;
}

export class AllDoneModal implements Step {
  public async execute(args: AllDoneModalArgs) {
    console.dir(args);
    if (args.client && args.trigger_id) {
      await args.client.views.open({
        trigger_id: args.trigger_id,
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: 'Self Intro',
            emoji: true,
          },
          close: {
            type: 'plain_text',
            text: 'Close',
            emoji: true,
          },
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':white_check_mark: All Done!',
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Thanks! Your self intro has been posted to this channel. Self introductions from other members are available for you to check out on our <https://google.com|CCCJ Notion Page>!',
              },
            },
          ],
        },
      });
    }
  }
}
