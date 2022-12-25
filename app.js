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
  if(msg.text[0] === "/") {
    return;
  }
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

      const vagaGupyEncerrada = (str) => {
        return str.match(/Fazer login como candidato/gi)
      }
      if(vagaGupyEncerrada(body)) {
        return bot.sendMessage(fromId, "Esta Vaga da Gupy se encontra encerrada, se possível verifique o link acessando a página :D");
      }
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

bot.on(["/help", "/ajuda", "/start"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Comandos</b>
/vaga - template para vaga
/incrementado - cabeçalho do modelo incrementado de vagas
/voluntariado - template para trabalho voluntário
/curso - template para curso
/evento - template para evento
/artigo - template para artigo
/dica - template para dica
/diversidade - tags de diversidade
/formatar - dicas de como formatar textos
`, { parseMode: "HTML" });
});

bot.on(["/vaga"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Demo de vaga</b>

💻 #devops
🧑🏽 #junior
🌎 #presencial #SP (São Paulo)

Analista DevOps Jr - XPTO
Acompanhe
🔗 https://www.exemplo.com/xpto/job/analista-devops-jr

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>
`, { parseMode: "HTML" });
  bot.sendMessage(msg.from.id, `<b>Cabeçalho do post</b>

💻 #backend #frontend #dev #tecnologia #dados #infra #produtos #QA #automacao #UI_UX #BI (sem acento)
🧒🏽 #jovemaprendiz, #estagio, #trainee, #junior
🌍 #remoto #UF (Cidade1, Cidade2)
🌍 #hibrido #UF (Cidade1, Cidade2)
🌍 #presencial #UF (Cidade1, Cidade2)
`, { parseMode: "HTML" });
});

bot.on(["/incrementado"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Modelo incrementado de vagas</b>

💻 Área
🧒🏽 Nível
🌍 Local
💰 Salário | Ex: R$ 900 (6h) ou R$ 600 (4h)
🗓 Data final de inscrição | Ex: Até 30/09
🎓 Formação até
🇺🇸 #ingles - Avançado, Fluente, Intermediário, Técnico
💞 #Voluntariado
Descrição da vaga

🔗 Link da vaga
💌 Email

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>
`, { parseMode: "HTML" });
});

bot.on(["/voluntariado"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Template para voluntário</b>

💻 #dados #ia #tecnologia
🌎 #remoto
♀️ #ParaMulheres
💞 #Voluntariado

Curadoria de Eventos Data & IA

🔗 https://exemplo.com.br/vaga/curadoria-de-eventos-data-ia

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>
`, { parseMode: "HTML" });
});

bot.on(["/curso"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Template para curso</b>

#curso | Curso de Data Analytics & Science para iniciantes
#com_certificado

Neste curso, você aprende sobre análise de dados e também uma introdução ao mundo da ciência de dados.

🔗  https://www.exemplo.com/xpto/offers/1F8HMNG5

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>
`, { parseMode: "HTML" });
});

bot.on(["/evento"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Template para evento</b>

#evento | &lt;XPTO&gt; _Reinventando o futuro por meio da tecnologia
#com_certificado
🗓 Acontecerá de 25/12 a 28/12, ás 19h

Em apenas 5 horas você vai aprender as linguagens mais bombadas da atualidade: HTML, CSS e JavaScript aplicadas em um projeto para seu portfólio. 

🔗  https://www.exemplo.com/xpto/eventos/

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>
`, { parseMode: "HTML" });
});

bot.on(["/artigo"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Template para artigo</b>

#artigo | Construindo uma Carreira como Data Engineer

Um fato inegável é que a Engenharia de Dados abrange muitas disciplinas sobrepostas, portanto é difícil traçar um único caminho para se tornar um engenheiro de dados. Este artigo aborda 3 habilidades essenciais para que um aspirante a Data Engineer tenha sucesso em sua carreira.

🔗  https://www.exemplo.com/xpto/eventos//opiniao-construindo-uma-carreira-como-data-engineer

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>
`, { parseMode: "HTML" });
});

bot.on(["/dica"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Template para dica</b>

#dica | Open Source Society University
🇺🇸 #em_ingles

Repositório com objetivo de capacitar alunos para dominar os currículos universitários através de recursos gratuitos. Escolha um curso e comece hoje!

🔗 https://www.exemplo.com

☕️ <i>Acompanhe vagas e conteúdos para iniciantes em TI no Telegram da @CafeinaVagas</i>
`, { parseMode: "HTML" });
});

bot.on(["/diversidade"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Tags de diversidade</b>

♀️ #ParaMulheres
✊🏿 #PessoasNegras
🏳️‍🌈 #LGBTQIA+
♿️ #PCD
👵🏽 #MelhorIdade
🏳‍⚧ #PessoasTrans
`, { parseMode: "HTML" });
});

bot.on(["/formatar"], (msg) => {
  bot.sendMessage(msg.from.id, `<b>Como formatar texto</b>

No PC:
- Negrito: Ctrl + B
- Itálico: Ctrl + I
- Sublinhado: Ctrl + U
- Tachado: Ctrl + Shift + X
- Criar um link: Ctrl + K

No Celular:
Dependendo da versão do sistema, basta selecionar o texto, clicar nos 3 pontinhos e escolher o estilo.

Desktop e Celular:
- Negrito: **negrito**
- Itálico: __italico__
- Tachado: ~~tachado~~
`, { parseMode: "HTML" });
});
bot.connect();
