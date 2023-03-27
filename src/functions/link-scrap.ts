import { Context } from 'grammy';
import { putHashtags } from '../filters/hashtags';
import { retrieveContent } from '../filters/retrieveContent';
import { erroUrl } from '../responses/messages';
import { formatJob } from '../utils/helpers';

export const checkLink = async (ctx: Context) => {
  const message =
    String(ctx.update?.message?.entities?.map((e: any) => e?.url)) ||
    ctx.update?.message?.text ||
    '';

  const result = await retrieveContent(message).catch(() => erroUrl);

  if (typeof result !== 'string') {
    const jobTitle = `\n${result?.jobTitle}`;
    const jobUrl = `\n🔗 ${message}`;
    const answer = formatJob({ ...(await putHashtags(result?.body || '')), jobUrl, jobTitle });
    return ctx.reply(answer, { parse_mode: 'HTML', reply_to_message_id: ctx.msg?.message_id });
  }
  return ctx.reply(result, { reply_to_message_id: ctx.msg?.message_id });
};
