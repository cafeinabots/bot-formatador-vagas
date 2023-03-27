import { PutHashtagsResponse } from '../types/shared-interfaces';
import { searchTerms } from '../utils/helpers';
import { jobLevelTerms } from './terms/jobLevelTerms';
import { jobLocalTerms } from './terms/jobLocalTerms';
import { jobOpportunityTerms } from './terms/jobOpportunityTerms';

const vagaGupyEncerrada = (text: string) => /(?<!")Fazer login como candidato/gi.test(text);

const getLimitDateIfExists = (text: string) => {
  const limitDate = text.match(/inscrições até(?: o dia)? (\d+\/\d+(\/\d{2,4})?)/gi);
  return limitDate ? '📅 ' + limitDate + '\n' : '';
};

export const putHashtags = async (text: string): Promise<PutHashtagsResponse> => {
  const jobOpportunity = `💻 ${searchTerms(jobOpportunityTerms, text).join(' ')}`;
  const jobLevel = `🧑🏽 ${searchTerms(jobLevelTerms, text).join(' ')}`;
  const jobLocal = `🌎 ${searchTerms(jobLocalTerms, text).join(' ')}`;
  const footer =
    '☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>';
  const limitDate = getLimitDateIfExists(text);
  const encerrada = vagaGupyEncerrada(text);

  return { jobOpportunity, jobLevel, jobLocal, limitDate, footer, encerrada };
};
