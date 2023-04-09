import 'dotenv/config';
import bot from './bot';
import commands from './commands/composer';
import { checkLink, checkText } from './functions';
import { development } from './utils/start';

bot.use(commands);

bot.on(['::url', '::text_link'], checkLink);

bot.on(':text', checkText);

process.env.NODE_ENV === 'development' && development(bot);

export {};
