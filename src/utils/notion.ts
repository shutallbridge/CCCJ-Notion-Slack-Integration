import { notion, DATABASE_ID } from '../api/notion';

export async function queryPageIdByUserId(userId: string) {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'userId',
        rich_text: {
          equals: userId,
        },
      },
    });
    if (response.results.length === 0) return null;
    return response.results[0].id;
  } catch (error) {
    console.error('notion query error', error);
    return null;
  }
}
