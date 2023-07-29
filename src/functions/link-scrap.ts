import { Context } from 'grammy';
import { MessageEntity } from 'grammy/types';
import { RetrieveContentResponse } from 'src/types/shared-interfaces';
import { putHashtags } from '../filters/hashtags';
import { retrieveContent } from '../filters/retrieveContent';
import { erroUrl } from '../responses/messages';
import {
  formatJob,
  isRetrieveContentResponse,
  removeQueryString,
  resultsEqual,
} from '../utils/helpers';

export const checkLink = async (ctx: Context) => {
  const message =
    String(
      ctx.update?.message?.entities?.map(
        (e: MessageEntity) => (<MessageEntity.TextLinkMessageEntity>e)?.url,
      ),
    ) ||
    ctx.update?.message?.text ||
    '';
  const sanitizedUrl = removeQueryString(message);
  const sanitizedUrlWithFirstParam = removeQueryString(message, true);

  const resultFromMessage = await retrieveContent(message).catch(err => erroUrl);

  const resultFromSanitizedUrl =
    message !== sanitizedUrl && (await retrieveContent(sanitizedUrl).catch(() => undefined));

  const resultFromSanitizedUrlWithFirstParam =
    sanitizedUrl !== sanitizedUrlWithFirstParam &&
    (await retrieveContent(sanitizedUrlWithFirstParam).catch(() => undefined));

  const results: RetrieveContentResponse[] = [
    resultFromMessage,
    resultFromSanitizedUrl,
    resultFromSanitizedUrlWithFirstParam,
  ].filter(isRetrieveContentResponse);

  if (typeof resultFromMessage !== 'string') {
    const jobTitle = `\n${resultFromMessage?.jobTitle}`;
    const jobUrl = resultsEqual(results) ? `\n🔗 ${sanitizedUrl}` : `\n🔗 ${message}`;
    const answer = formatJob({
      ...(await putHashtags(resultFromMessage?.body || '')),
      jobUrl,
      jobTitle,
    });
    return ctx.reply(answer, { parse_mode: 'HTML', reply_to_message_id: ctx.msg?.message_id });
  }
  return ctx.reply(resultFromMessage, { reply_to_message_id: ctx.msg?.message_id });
};
