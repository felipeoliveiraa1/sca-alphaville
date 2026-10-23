/**
 * SCA — Media Kit de expositores (/media-kit)
 * Conteúdo da página de venda de stands do SCA Country · 3ª Edição (PT-BR).
 * Números do clube (membros, edições, estados, marcas) vêm de site.ts: atualize lá.
 *
 * ⚠ RASCUNHO COMERCIAL: tudo marcado com "CONFIRMAR" (data, local, metragens,
 * o que cada stand inclui, valores) precisa ser validado com o SCA antes de divulgar.
 * Campos `null` aparecem como "Em breve" / "Sob consulta" na página.
 */
import { contact } from './site';

/** Link de WhatsApp com mensagem pronta (o comercial já sabe do que se trata). */
export const waMessage = (text: string) =>
  `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(text)}`;

export const event = {
  name: 'SCA Country',
  edition: '3ª Edição',
  date: null as string | null,   // CONFIRMAR, ex.: '15 de novembro de 2026'
  venue: null as string | null,  // CONFIRMAR, ex.: 'Circuito de São Roque · SP'
  access: 'Fechado · membros e parceiros',
} as const;

export const mkNav = [
  { label: 'O SCA', href: '#sca' },
  { label: 'Público', href: '#publico' },
  { label: 'Stands', href: '#stands' },
  { label: 'Como reservar', href: '#reserva' },
] as const;

export const reserveCta = {
  label: 'Reservar meu stand',
  href: waMessage(`Olá! Quero expor no ${event.name} ${event.edition}. Pode me enviar valores e disponibilidade dos stands?`),
} as const;

export const capa = {
  eyebrow: 'Media Kit · Expositores',
  titleLines: ['Sua marca', 'na pista', 'do SCA Country'],
  lead:
    'A 3ª edição do SCA Country abre espaço para marcas que querem estar frente a frente com empresários, investidores e colecionadores de supercarros, em um evento fechado, só para membros, famílias e parceiros.',
  ctaSecondary: { label: 'Ver os stands', href: '#stands' },
  posterAlt: 'Arte oficial do SCA Country 3ª Edição: supercarros em formação numa pista cercada de montanhas ao pôr do sol',
} as const;

export const sobre = {
  eyebrow: 'Quem somos',
  title: 'O maior ecossistema de empresários do mundo.',
  gallery: [
    { image: 'aerial-saoroque', caption: 'Mega encontro · São Roque', alt: 'Vista aérea de centenas de supercarros reunidos em um encontro do SCA em São Roque' },
    { image: 'dream-car-event', caption: 'Comunidade SCA · Dream Car', alt: 'Membros do SCA circulando entre supercarros no evento Dream Car' },
    { image: 'track-day-cornering', caption: 'Track day · O clube na pista', alt: 'Lamborghinis e esportivos do SCA contornando uma curva durante um track day' },
  ],
} as const;

export const publico = {
  eyebrow: 'O público',
  title: 'Quem passa pelo seu stand decide.',
  lead:
    'Os eventos do SCA não são abertos ao público. Cada visitante é membro do clube, familiar ou convidado de uma empresa parceira.',
  profiles: [
    {
      title: 'Empresários & investidores',
      body: 'Donos de negócio e investidores que fazem do clube uma plataforma de relacionamento e de novos negócios.',
    },
    {
      title: 'Colecionadores de supercarros',
      body: 'Proprietários de esportivos e superesportivos, exigentes com performance, exclusividade e atendimento.',
    },
    {
      title: 'Famílias de alto padrão',
      body: 'Os eventos recebem as famílias dos membros: decisões de consumo que vão do carro à casa, da viagem à saúde.',
    },
    {
      title: 'Influenciadores do setor',
      body: 'Criadores e personalidades do universo automotivo que levam cada ativação para muito além do evento.',
    },
  ],
} as const;

export type StandTier = {
  name: string;
  width: number;          // metros (frente)
  depth: number;          // metros (fundo)
  pitch: string;
  features: readonly string[];
  price: string | null;   // null → "Sob consulta"
  recommended?: boolean;
};

// CONFIRMAR: nomes, metragens, entregas e valores abaixo são uma proposta inicial.
const tiers: StandTier[] = [
  {
    name: 'Paddock',
    width: 3,
    depth: 3,
    pitch: 'Presença essencial para apresentar a marca e gerar contatos qualificados.',
    features: [
      'Espaço demarcado na área de expositores',
      '2 credenciais de expositor',
      'Marca citada na cobertura do evento',
    ],
    price: null,
  },
  {
    name: 'Grid',
    width: 6,
    depth: 3,
    pitch: 'O dobro de frente para demonstrações, atendimento e ativação de produto.',
    features: [
      'Espaço demarcado na área de expositores',
      '4 credenciais de expositor',
      'Marca citada na cobertura do evento',
      'Logo no mapa oficial do evento',
    ],
    price: null,
    recommended: true,
  },
  {
    name: 'Pole Position',
    width: 10,
    depth: 6,
    pitch: 'Área nobre, com espaço para veículo em exposição e ativação completa.',
    features: [
      'Posição de destaque na área de expositores',
      'Espaço para veículo em exposição',
      '8 credenciais de expositor',
      'Post colaborativo no Instagram do SCA',
      'Logo no mapa oficial do evento',
    ],
    price: null,
  },
];

export const stands = {
  eyebrow: 'Stands',
  title: 'Escolha o seu lugar no grid.',
  lead:
    'Três formatos para três níveis de presença, do primeiro contato à ativação completa da marca. As vagas são limitadas.',
  benefits: [
    { title: 'Contato direto', body: 'Conversa olho no olho com quem decide, sem a dispersão de um evento aberto.' },
    { title: 'Ativação & test drive', body: 'Demonstrações, sampling e test drives em ambiente controlado e exclusivo.' },
    { title: 'Cobertura digital', body: 'Conteúdo de alto padrão nas redes do SCA registrando o evento e as marcas presentes.' },
  ],
  tiers,
  fine: 'Metragens, entregas e valores finais constam na proposta comercial enviada na reserva.',
} as const;

export const reserva = {
  eyebrow: 'Como reservar',
  title: 'Do primeiro contato ao dia do evento.',
  steps: [
    { title: 'Escolha o formato', body: 'Paddock, Grid ou Pole Position, conforme a ativação que a sua marca quer fazer.' },
    { title: 'Fale com o comercial', body: 'Pelo WhatsApp, a equipe do SCA envia a proposta com valores e disponibilidade.' },
    { title: 'Garanta o espaço', body: 'Com a proposta aceita, o seu stand fica reservado para o evento.' },
    { title: 'Ative a sua marca', body: 'No dia, é montar, receber os membros e fazer negócio.' },
  ],
} as const;

/** Fecho da página: entra no bloco de CTA do rodapé. */
export const closingCta = {
  eyebrow: 'Vagas limitadas',
  line1: 'Garanta o seu stand no',
  line2: `${event.name}.`,
  label: 'Falar com o comercial',
  href: reserveCta.href,
} as const;
