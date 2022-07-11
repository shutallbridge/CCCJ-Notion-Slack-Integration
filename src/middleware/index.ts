export async function skipBots({ message, next }) {
  if (!!message.bot_id) return;
  await next();
}

export async function skipThreadReplies({ message, next }) {
  if (!!message.thread_ts) return;
  await next();
}

export async function skipEventMessages({ message, next }) {
  if (
    message.subtype === 'channel_join' ||
    message.subtype === 'message_deleted' ||
    message.subtype === 'message_changed'
  )
    return;
  await next();
}
