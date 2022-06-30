import { Step } from '../Step';
import { notion, DATABASE_ID } from '../api/notion';
import { format } from 'date-fns';

export interface NewNotionEntryArgs {
  client: any;
  trigger_id: string;
  username: string;
  name: string;
  aboutYourself: string;
  tags: string[];
}

export interface NewNotionEntryReturnArgs {
  client: any;
  trigger_id: string;
}

async function queryPageIdByUserId(username: string) {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'username',
      rich_text: {
        equals: username,
      },
    },
  });
  if (response.results.length === 0) return null;
  return response.results[0].id;
}

async function updatePage(pageId: string, entry: NewNotionEntryArgs) {
  // Delete existing page content
  const result = await notion.blocks.children.list({
    block_id: pageId,
  });
  const childIds = result.results.reduce<string[]>(
    (prev, curr) => [...prev, curr.id],
    []
  );
  const promises = childIds.map((childId) =>
    notion.blocks.delete({ block_id: childId })
  );
  await Promise.allSettled(promises);

  // Update page meta data
  await notion.pages.update({
    page_id: pageId,
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
      'Last Updated': {
        type: 'date',
        date: {
          start: format(new Date(), 'yyyy-MM-dd'),
        },
      },
      Tags: {
        type: 'multi_select',
        multi_select: entry.tags.reduce<{ name: string }[]>(
          (prev, curr) => prev.concat({ name: curr }),
          []
        ),
      },
    },
  });

  // Append new page content
  await notion.blocks.children.append({
    block_id: pageId,
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

async function createNewPage(entry: NewNotionEntryArgs) {
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
      username: {
        type: 'rich_text',
        rich_text: [
          {
            type: 'text',
            text: {
              content: entry.username,
            },
          },
        ],
      },
      'Member Since': {
        type: 'date',
        date: {
          start: format(new Date(), 'yyyy-MM-dd'),
        },
      },
      'Last Updated': {
        type: 'date',
        date: {
          start: format(new Date(), 'yyyy-MM-dd'),
        },
      },
      Tags: {
        type: 'multi_select',
        multi_select: entry.tags.reduce<{ name: string }[]>(
          (prev, curr) => prev.concat({ name: curr }),
          []
        ),
      },
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

export class NewNotionEntry<NextArgs> extends Step<
  NewNotionEntryArgs,
  NewNotionEntryReturnArgs,
  NextArgs
> {
  public async onExecute(args: NewNotionEntryArgs) {
    try {
      const pageId = await queryPageIdByUserId(args.username);
      if (!!pageId) {
        updatePage(pageId, args);
      } else {
        createNewPage(args);
      }
    } catch (error) {
      console.log('notion error: ', error);
    }
    return { client: args.client, trigger_id: args.trigger_id };
  }
}
