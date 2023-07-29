import { vagaEncerrada } from '../responses/messages';
import { PutHashtagsResponse, RetrieveContentResponse } from '../types/shared-interfaces';

export const searchTerms = (terms: Object, body: string): string[] => {
  const optionsArray = Object.keys(terms);
  const arr: string[] = [];
  for (let i = 0; i < optionsArray.length; i++) {
    for (let j = 0; j < terms[optionsArray[i]].terms.length; j++) {
      const termRegex = new RegExp(
        terms[optionsArray[i]].terms[j],
        terms[optionsArray[i]].regexOpt,
      );
      if (body.search(termRegex) !== -1) {
        arr.push(terms[optionsArray[i]].hashtag);
        break;
      }
    }
  }
  return arr;
};

export const isUrl = (url: string) => {
  const urlRegex = new RegExp(
    '(\bhttps?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  );
  return urlRegex.test(url);
};

export const formatJob = (putHashtagsResponse: PutHashtagsResponse): string => {
  const { jobTitle, jobOpportunity, jobLevel, jobLocal, jobUrl, limitDate, footer, encerrada } =
    putHashtagsResponse;
  const job = encerrada
    ? [vagaEncerrada]
    : [jobOpportunity, jobLevel, jobLocal, jobTitle, jobUrl, limitDate, footer];
  return job.join('\n');
};

export const resultsEqual = (
  results: RetrieveContentResponse[],
): RetrieveContentResponse | undefined => {
  const firstResult = results[0];
  results.shift();
  for (const e of results) {
    if (e.jobTitle === firstResult.jobTitle || e.body === firstResult.body) {
      return e;
    }
  }
};

export const removeQueryString = (url: string, keepfirstQueryParam: boolean = false) => {
  const parsedUrl = new URL(url);
  const queryPairs = parsedUrl.search.split('&');

  parsedUrl.search = keepfirstQueryParam ? queryPairs[0] : '';
  return parsedUrl.toString();
};

export const isRetrieveContentResponse = (obj: any): obj is RetrieveContentResponse => {
  return Boolean(obj?.jobTitle && obj?.body);
};
