import Telebot from "telebot";
import axios from "axios";
import cheerio from "cheerio";
import pretty from "pretty";

import { jobOpportunityTerms } from "./jobOpportunityTerms.js";
import { jobLevelTerms } from "./jobLevelTerms.js";
import { jobLocalTerms } from "./jobLocalTerms.js";
import { searchTerms } from "./searchTerms.js"

const bot = new Telebot(process.env.BOT_TOKEN);

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
🔗 

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>`;

    return bot.sendMessage(fromId, newJobMessage, { parseMode: "HTML" });
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
      
      if (body.search(/inscrições até o dia (\d+\/\d+)/gi) !== -1) {
        limitDate = body.match(/inscrições até o dia (\d+\/\d+)/gi);
      }

      const newJobMessage = `💻 ${jobOpportunity.join(" ")}
🧑🏽 ${jobLevel.join(" ")}
🌎 ${jobLocal.join(" ")}
${limitDate ? "📅 " + limitDate + "\n" : ""}${
        jobTitle ? "\n" + jobTitle + "\n" : ""
      }
🔗 ${url}

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>`;

      return bot.sendMessage(fromId, newJobMessage, { parseMode: "HTML" });
    } catch (err) {
      console.error(err);
      return bot.sendMessage(
        fromId,
        "Opa, não consegui ler essa vaga. 😥\n Tenta me enviar o conteúdo da vaga (copia e cola aqui) SEM O LINK."
      );
    }
  }

  scrapeData();
});

bot.connect();
