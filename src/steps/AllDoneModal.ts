import { Step } from '../Step';

export interface AllDoneModalArgs {
  client?: any;
  trigger_id?: string;
}

export class AllDoneModal<NextArgs> extends Step<
  AllDoneModalArgs,
  void,
  NextArgs
> {
  public async onExecute(args: AllDoneModalArgs) {
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
                text: 'Thanks! Your self intro has been posted to this channel. Self introductions from other members are available for you to check out on our <https://startup-co-creation.notion.site/0e1a46d381b04bc8b5b55d3a73b2ebfa?v=aa4787fb2c8c48719f45dc19dbf8fddb|SCC Notion Page>!',
              },
            },
          ],
        },
      });
    }
  }
}
