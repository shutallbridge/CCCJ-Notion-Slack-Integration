import { Step } from '../Step';
import { notion, DATABASE_ID } from '../api/notion';
import { sleep } from '../utils/sleep';
import { queryPageIdByUserId } from '../utils/notion';
import { format } from 'date-fns';

export interface NewNotionEntryArgs {
  client: any;
  trigger_id: string;
  userId: string;
  name: string;
  aboutYourself: string;
  tags: string[];
  linkedin: string;
}

export interface NewNotionEntryReturnArgs {
  client: any;
  trigger_id: string;
}

async function createNewPageTemplate(
  entry: NewNotionEntryArgs,
  memberSinceDate: string,
  lastUpdateDate: string
) {
  await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      'Full Name': {
        type: 'title',
        title: [
          {
            text: {
              content: entry.name,
            },
          },
        ],
      },
      userId: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: {
              content: entry.userId,
            },
          },
        ],
      },
      'Member Since': {
        type: 'date',
        date: {
          start: memberSinceDate,
        },
      },
      'Last Updated': {
        type: 'date',
        date: {
          start: lastUpdateDate,
        },
      },
      Tags: {
        type: 'multi_select',
        multi_select: entry.tags.reduce<{ name: string }[]>(
          (prev, curr) => prev.concat({ name: curr }),
          []
        ),
      },
      ...(!!entry.linkedin && {
        LinkedIn: { type: 'url', url: entry.linkedin },
      }),
    },
    children: [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `About ${entry.name}`,
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: entry.aboutYourself,
              },
            },
          ],
        },
      },
    ],
  });
}

async function updatePage(pageId: string, entry: NewNotionEntryArgs) {
  const dateProperty = await notion.pages.properties.retrieve({
    page_id: pageId,
    property_id: 'Member Since',
  });
  const memberSinceDate = (dateProperty as unknown as any).date.start as string;
  // Notion API seems to required a time between requests?
  // https://www.reddit.com/r/Notion/comments/s8uast/error_deleting_all_the_blocks_in_a_page/
  sleep(1000);
  await notion.pages.update({
    page_id: pageId,
    archived: true,
  });
  sleep(1000);
  await createNewPageTemplate(
    entry,
    memberSinceDate,
    format(new Date(), 'yyyy-MM-dd')
  );
}

async function createNewPage(entry: NewNotionEntryArgs) {
  await createNewPageTemplate(
    entry,
    format(new Date(), 'yyyy-MM-dd'),
    format(new Date(), 'yyyy-MM-dd')
  );
}

export class NewNotionEntry<NextArgs> extends Step<
  NewNotionEntryArgs,
  NewNotionEntryReturnArgs,
  NextArgs
> {
  public async onExecute(args: NewNotionEntryArgs) {
    try {
      const pageId = await queryPageIdByUserId(args.userId);
      if (!!pageId) {
        updatePage(pageId, args);
      } else {
        createNewPage(args);
      }
    } catch (error) {
      console.error('notion error: ', error);
    }
    return { client: args.client, trigger_id: args.trigger_id };
  }
}
