import { Context } from 'grammy';
import {
  artigoTemplate,
  comandos,
  comoFormatar,
  cursoTemplate,
  dicaTemplate,
  diversidadeTemplate,
  eventoTemplate,
  postCabecalho,
  vagaDemo,
  vagaModeloIncrementado,
  voluntariadoModelo,
} from '../../responses/messages';

export const ajuda = async (ctx: Context): Promise<void> => {
  await ctx.reply(comandos, { parse_mode: 'HTML' });
};

export const vaga = async (ctx: Context): Promise<void> => {
  await ctx.reply(vagaDemo, { parse_mode: 'HTML' });
  await ctx.reply(postCabecalho, { parse_mode: 'HTML' });
};

export const incrementado = async (ctx: Context): Promise<void> => {
  await ctx.reply(vagaModeloIncrementado, { parse_mode: 'HTML' });
};

export const voluntariado = async (ctx: Context): Promise<void> => {
  await ctx.reply(voluntariadoModelo, { parse_mode: 'HTML' });
};

export const curso = async (ctx: Context): Promise<void> => {
  await ctx.reply(cursoTemplate, { parse_mode: 'HTML' });
};

export const evento = async (ctx: Context): Promise<void> => {
  await ctx.reply(eventoTemplate, { parse_mode: 'HTML' });
};

export const artigo = async (ctx: Context): Promise<void> => {
  await ctx.reply(artigoTemplate, { parse_mode: 'HTML' });
};

export const dica = async (ctx: Context): Promise<void> => {
  await ctx.reply(dicaTemplate, { parse_mode: 'HTML' });
};

export const diversidade = async (ctx: Context): Promise<void> => {
  await ctx.reply(diversidadeTemplate, { parse_mode: 'HTML' });
};

export const formatar = async (ctx: Context): Promise<void> => {
  await ctx.reply(comoFormatar, { parse_mode: 'HTML' });
};
