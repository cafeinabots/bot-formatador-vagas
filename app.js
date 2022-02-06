import Telebot from "telebot";
import axios from "axios";
import cheerio from "cheerio";
import pretty from "pretty";
import { jobOpportunityTerms } from "./jobOpportunityTerms.js";
import { jobLevelTerms } from "./jobLevelTerms.js";
import { jobLocalTerms } from "./jobLocalTerms.js";

const bot = new Telebot(process.env.BOT_TOKEN);

function searchTerms(terms, arrayToAdd, body) {
  const optionsArray = Object.keys(terms);
  for (let i = 0; i < optionsArray.length; i++) {
    for (let j = 0; j < terms[optionsArray[i]].terms.length; j++) {
      const termRegex = new RegExp(
        terms[optionsArray[i]].terms[j],
        terms[optionsArray[i]].regexOpt
      );
      if (body.search(termRegex) !== -1) {
        arrayToAdd.push(terms[optionsArray[i]].hashtag);
        break;
      }
    }
  }
}

const CHAT_ID = -1001608160303;
const URL_REGEX =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

// On every text message
bot.on(["text", "forward", "photo"], (msg) => {
  // Message infos
  const text = msg.text;
  const fromId = msg.from.id;
  const messageId = msg.message_id;

  // Job opportunity infos
  let url = "";
  let jobOpportunity = [];
  let jobLevel = [];
  let jobLocal = [];
  let jobTitle = "";
  let limitDate = "";

  const isUrl = text.search(URL_REGEX);

  if (isUrl === -1) {
      searchTerms(jobOpportunityTerms, jobOpportunity, text);
      searchTerms(jobLevelTerms, jobLevel, text);
      searchTerms(jobLocalTerms, jobLocal, text);

      if (text.search(/inscrições até (\d+\/\d+)/gi) !== -1) {
        limitDate = text.match(/inscrições até (\d+\/\d+)/gi);
      }

      const newJobMessage = `💻 ${jobOpportunity.join(" ")}
🧑🏽 ${jobLevel.join(" ")}
🌎 ${jobLocal.join(" ")}
${limitDate ? "📅 " + limitDate + "\n" : ""}${
        jobTitle ? "\n" + jobTitle + "\n" : ""
      }
🔗 `;

      bot.sendMessage(fromId, newJobMessage);
  }

  url = text.match(/\bhttps?:\/\/\S+/gi);

  async function scrapeData() {
    try {
      const { data } = await axios.get(url.toString());
      const $ = cheerio.load(data);

      jobTitle = $("title").text();
      const body = $("body").text();

      searchTerms(jobOpportunityTerms, jobOpportunity, body);
      searchTerms(jobLevelTerms, jobLevel, body);
      searchTerms(jobLocalTerms, jobLocal, body);

      if (body.search(/inscrições até (\d+\/\d+)/gi) !== -1) {
        limitDate = body.match(/inscrições até (\d+\/\d+)/gi);
      }

      const newJobMessage = `💻 ${jobOpportunity.join(" ")}
🧑🏽 ${jobLevel.join(" ")}
🌎 ${jobLocal.join(" ")}
${limitDate ? "📅 " + limitDate + "\n" : ""}${
        jobTitle ? "\n" + jobTitle + "\n" : ""
      }
🔗 ${url}`;

      bot.sendMessage(fromId, newJobMessage);
    } catch (err) {
      console.error(err);
      bot.sendMessage(fromId, 'Opa, não consegui ler essa vaga. :( Tenta me enviar o conteúdo da vaga (copia e cola aqui) SEM O LINK.);
    }
  }

  scrapeData();
});

bot.connect();
