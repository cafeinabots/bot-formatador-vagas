import axios from 'axios';
import * as cheerio from 'cheerio';
import { RetrieveContentResponse } from '../types/shared-interfaces';

export const retrieveContent = async (url: string): Promise<RetrieveContentResponse> => {
  url = url.startsWith('https://') ? url : 'https://' + url;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const jobTitle = $('title').text();
  const body = $('body').text();
  return { jobTitle, body };
};
