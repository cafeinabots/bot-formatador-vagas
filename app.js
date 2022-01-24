import Telebot from "telebot";
import axios from "axios";
import cheerio from "cheerio";
import pretty from "pretty";
import { jobOpportunityTerms } from "./jobOpportunityTerms.js";

const bot = new Telebot(process.env.BOT_TOKEN);

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
    return bot.sendMessage(
      fromId,
      "Por favor, envie um link de uma vaga para formatar."
    );
  }

  url = text.match(/\bhttps?:\/\/\S+/gi);

  async function scrapeData() {
    try {
      const { data } = await axios.get(url.toString());
      const $ = cheerio.load(data);

      jobTitle = $("title").text();
      const body = $("body").text();

      const opportunityArray = Object.keys(jobOpportunityTerms);
      console.log("opportunityArray", opportunityArray)
      for (let i = 0; i < opportunityArray.length; i++) {
        console.log("jobOpportunityTerms", jobOpportunityTerms)
        console.log("i", i)
        console.log("jobOpportunityTerms[i]", jobOpportunityTerms[i])
        for (let j = 0; j < jobOpportunityTerms[i].terms.length; j++) {
          const regexOpportunity = new RegExp(
            jobOpportunityTerms[i].terms[j],
            jobOpportunityTerms[i].regexOpt
          );
          if (body.search(regexOpportunity) !== -1) {
            jobOpportunity.push(jobOpportunityTerms[i].hashtag);
            break;
          }
        }
      }

      const internTerms = ["estagio", "estágio", "intern "];
      for (let i = 0; i < internTerms.length; i++) {
        const regexIntern = new RegExp(internTerms[i], "gi");
        if (body.search(regexIntern) !== -1) {
          jobLevel.push("#estagio");
          break;
        }
      }

      const traineeTerms = ["trainee"];
      for (let i = 0; i < traineeTerms.length; i++) {
        const regexTrainee = new RegExp(traineeTerms[i], "gi");
        if (body.search(regexTrainee) !== -1) {
          jobLevel.push("#trainee");
          break;
        }
      }

      const juniorTerms = ["junior", "júnior"];
      for (let i = 0; i < juniorTerms.length; i++) {
        const regexJunior = new RegExp(juniorTerms[i], "gi");
        if (body.search(regexJunior) !== -1) {
          jobLevel.push("#junior");
          break;
        }
      }

      const remoteTerms = ["remoto", "remota", "remotar"];
      for (let i = 0; i < remoteTerms.length; i++) {
        const regexRemote = new RegExp(remoteTerms[i], "gi");
        if (body.search(regexRemote) !== -1) {
          jobLocal.push("#remoto");
          break;
        }
      }

      const SPTerms = ["SP", "São Paulo", "Sao Paulo"];
      for (let i = 0; i < SPTerms.length; i++) {
        const regexSP = new RegExp(SPTerms[i], "gi");
        if (body.search(regexSP) !== -1) {
          jobLocal.push("#SP");
          break;
        }
      }

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
    }
  }

  scrapeData();
});

bot.connect();
