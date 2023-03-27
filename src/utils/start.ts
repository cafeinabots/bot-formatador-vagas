import 'dotenv/config';
import { Bot, Context } from 'grammy';

const production = async (bot: Bot<Context>): Promise<void> => {
  const webhookUrl = `${process.env.VERCEL_URL}/api/index`;
  console.log(`Bot starting webhook: ${process.env.BOT_TOKEN?.split(':')[0]} ${webhookUrl}`);
  return bot.api
    .setWebhook(webhookUrl)
    .then(() => {
      console.log('Bot starting webhook: Success');
    })
    .catch(console.error);
};

const development = async (bot: Bot<Context>): Promise<void> => {
  console.log(`Bot starting polling: ${process.env.BOT_TOKEN?.split(':')[0]}`);
  return bot.api
    .deleteWebhook()
    .then(async () => {
      console.log('Bot starting polling: Success');
      await bot.start();
    })
    .catch(console.error);
};

export { production, development };
