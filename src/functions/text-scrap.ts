import { Context } from 'grammy';
import { putHashtags } from '../filters/hashtags';
import { formatJob } from '../utils/helpers';

export const checkText = async (ctx: Context) => {
  const message = ctx.update?.message?.text || '';
  const answer = formatJob(await putHashtags(message));

  return ctx.reply(answer, { parse_mode: 'HTML', reply_to_message_id: ctx.msg?.message_id });
};
