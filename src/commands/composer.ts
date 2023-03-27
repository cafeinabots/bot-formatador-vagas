import { Composer } from 'grammy';
import {
  ajuda,
  artigo,
  curso,
  dica,
  diversidade,
  evento,
  formatar,
  incrementado,
  vaga,
  voluntariado,
} from './text-only/index';

const composer = new Composer();

composer.command(['start', 'help', 'ajuda'], ajuda);

composer.command('vaga', vaga);

composer.command('incrementado', incrementado);

composer.command('voluntariado', voluntariado);

composer.command('curso', curso);

composer.command('evento', evento);

composer.command('artigo', artigo);

composer.command('dica', dica);

composer.command('diversidade', diversidade);

composer.command('formatar', formatar);

export default composer;
