# CCCJ-Notion-Slack-Integration

Slackbot for internal use at Co-Creation Community Japan. Keeps specific Notion pages in sync with helpful messages and prompts for our Slack members.

# Environment Variables

| ENV                   | Description                               |
| --------------------- | ----------------------------------------- |
| SLACK_BOT_TOKEN       | Token tied to a slack app                 |
| SLACK_SIGNING_SECRET  | Check authenticity of requests            |
| CHANNEL_ID_SELF_INTRO | Slack channel ID                          |
| NOTION_KEY            | API key for Notion                        |
| NOTION_DATABASE_ID    | ID of the database for slack to work with |

# Rationale

### Why have Steps and Flow instead of just Slack Listeners?

Using just the Slack event listerners got messy. Thinking about an interaction with a Slackbot in terms of steps makes sense.
