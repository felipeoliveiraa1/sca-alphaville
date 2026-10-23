/**
 * SCA — Media Kit do SCA Country · 148ª Edição (/media-kit)
 * Roteiro do José (áudios de 23/10/2026): uma página corrida, estilo PDF, com uma
 * imagem grande por página: capa, ecossistema, Arena VIP e os 11 setores do evento.
 *
 * IMAGENS: cada página procura src/assets/images/media-kit/<image>.(jpg|png|webp).
 * Sem o arquivo, usa `fallback` (foto real do site) ou vira uma página tipográfica.
 *
 * ⚠ CONFIRMAR: mês do evento; metragens, entregas e valores dos stands.
 */
import { contact } from './site';

/** Link de WhatsApp com mensagem pronta (o comercial já sabe do que se trata). */
export const waMessage = (text: string) =>
  `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(text)}`;

export const event = {
  name: 'SCA Country',
  edition: '148ª edição',
  place: 'Fazenda em Tatuí · SP',
  date: 'Dias 21 e 22',  // CONFIRMAR o mês (21–22/nov/2026 cai num sábado e domingo)
  hours: 'A partir das 9h · sem hora para terminar',
} as const;

export const mkNav = [
  { label: 'Ecossistema', href: '#ecossistema' },
  { label: 'Programação', href: '#programacao' },
  { label: 'Stands', href: '#stands' },
  { label: 'Contato', href: '#contato' },
] as const;

export const reserveCta = {
  label: 'Reservar meu stand',
  href: waMessage(`Olá! Quero expor no ${event.name} (${event.edition}). Pode me enviar valores e disponibilidade dos stands?`),
} as const;

/** Uma página do media kit (imagem grande + texto). */
export type Pagina = {
  id: string;
  label: string;
  title: string;
  accent?: string;                 // linha dourada em serifa
  mega?: string;                   // palavra/número gigante (VIP, +100, 5 mil)
  badge?: string;
  lead?: string;
  chips?: readonly string[];
  image?: string;                  // nome do arquivo em assets/images/media-kit
  imageMobile?: string;            // versão vertical p/ celular (padrão: "<image>-mobile", se existir)
  fallback?: string;               // foto real do site enquanto a imagem final não chega
  imageAlt?: string;
  position?: string;               // object-position da imagem
  copyAt?: 'top';                  // texto no alto quando o assunto da imagem está embaixo
  cta?: { label: string; href: string };
};

export const capa = {
  eyebrow: 'Media Kit · Expositores',
  titleLines: ['SCA Country', event.edition],
  image: 'capa',
  imageAlt: 'Supercarros alinhados ao lado da pista, público, tendas do SCA e um helicóptero no heliponto',
  ctaSecondary: { label: 'Ver a programação', href: '#programacao' },
} as const;

export const ecossistema = {
  page: {
    id: 'ecossistema',
    label: 'Ecossistema SCA',
    title: 'A SCA Super Carros Alphaville está em 12 estados do Brasil e em 7 países.',
    lead: 'São mais de 3 mil empresários proprietários de carros superesportivos. Um ecossistema com os maiores empresários do país.',
    image: 'ecossistema',
    fallback: 'dream-car-event',
    imageAlt: 'Membros do SCA circulando entre supercarros em um encontro do clube',
  } satisfies Pagina,
  stats: [
    { value: 12, label: 'Estados no Brasil' },
    { value: 7, label: 'Países' },
    { value: 3000, prefix: '+', label: 'Empresários' },
  ],
};

export const vip: Pagina = {
  id: 'vip',
  label: 'Exclusivo para membros',
  mega: 'VIP',
  title: 'Arena SCA Member',
  lead: 'Uma arena exclusiva para os membros do SCA. Os maiores empresários do país estarão lá dentro, com presenças já confirmadas.',
  image: 'arena-vip',
};

export const programacao = {
  id: 'programacao',
  label: 'Programação',
  title: 'Dois dias, onze setores e sem hora para terminar.',
};

/* ---------------- Stands (Setor 02) ---------------- */

export type StandTier = {
  name: string;
  width: number;          // metros (frente)
  depth: number;          // metros (fundo)
  pitch: string;
  features: readonly string[];
  price: string | null;   // null → "Sob consulta"
  recommended?: boolean;
};

// CONFIRMAR: metragens, entregas e valores abaixo são uma proposta inicial.
const tiers: StandTier[] = [
  {
    name: 'Prata',
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
    name: 'Ouro',
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
    name: 'Diamante',
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

export const planos = {
  page: {
    id: 'planos',
    label: 'Setor 02 · Stands',
    title: 'Prata, Ouro ou Diamante.',
    lead: 'Três categorias de stand para três níveis de presença no SCA Country.',
  } satisfies Pagina,
  tiers,
  fine: 'Metragens, entregas e valores finais constam na proposta comercial enviada na reserva.',
};

/* ---------------- Setores (ordem e números ditados pelo José) ---------------- */

export type Setor = {
  n: number;
  name: string;
  summary: string;
  /** páginas do setor; 'planos' = página das categorias de stand */
  pages: readonly (Pagina | 'planos')[];
};

export const setores: Setor[] = [
  {
    n: 1,
    name: 'Track Day',
    summary: 'Supercarros de todas as marcas na pista.',
    pages: [
      {
        id: 'setor-01',
        label: 'Setor 01 · Programação',
        title: 'Track Day',
        lead: 'Supercarros de todas as marcas acelerando na pista do SCA Country.',
        chips: ['Porsche', 'Ferrari', 'Lamborghini', 'BMW M', 'Audi R8 & RS', 'Mustang'],
        image: 'setor-01-track-day',
        fallback: 'fleet-formation-saoroque',
        imageAlt: 'Supercarros de várias marcas em formação na pista',
      },
      {
        id: 'pista',
        label: 'Setor 01 · A pista',
        title: 'A pista',
        accent: 'Um campo de provas completo.',
        lead: 'Uma estrutura inteira de pistas em plena fazenda, em Tatuí.',
        chips: ['Pista oval', 'Slalom', 'Baixo atrito', 'Off-road', 'Rampa 20%'],
        image: 'setor-01-pista',
        imageAlt: 'Vista aérea do campo de provas em Tatuí, com a pista oval cercada por plantações',
        position: '100% 50%',  // na foto vertical (celular) a curva oval fica à direita
        copyAt: 'top',         // e na base das duas fotos
      },
    ],
  },
  {
    n: 2,
    name: 'Stands',
    summary: 'Mais de 100 empresas expondo.',
    pages: [
      {
        id: 'stands',
        label: 'Setor 02 · Stands',
        mega: '+100',
        title: 'Stands de empresas',
        lead: 'Uma feira dentro do evento, com mais de 100 empresas expondo. Seja uma empresa parceira e monte o seu stand.',
        image: 'setor-02-stands',
        cta: { label: 'Escolher meu stand', href: '#planos' },
      },
      'planos',
      {
        id: 'stand-sca',
        label: 'Setor 02 · Stand oficial',
        title: 'Loja oficial SCA',
        lead: 'O stand da marca SCA, com malas, bonés, camisas, moletons e toda a linha oficial do clube.',
        image: 'setor-02-stand-sca',
      },
    ],
  },
  {
    n: 3,
    name: 'Gastronomia',
    summary: 'Food trucks e costela fogo de chão.',
    pages: [
      {
        id: 'setor-03',
        label: 'Setor 03 · Gastronomia',
        title: 'Praça de alimentação',
        accent: 'Costela fogo de chão.',
        lead: 'Food trucks, sorvetes e o melhor da comida de fazenda, com os supercarros em volta.',
        image: 'setor-03-gastronomia',
      },
    ],
  },
  {
    n: 4,
    name: 'Arena Business',
    summary: 'Networking e a sua empresa no telão.',
    pages: [
      {
        id: 'setor-04',
        label: 'Setor 04 · Negócios',
        title: 'Arena Business',
        lead: 'O espaço para empresários se conectarem e fazerem negócios. No telão da arena, a empresa de cada empresário aparece para todos os presentes.',
        image: 'setor-04-arena-business',
      },
    ],
  },
  {
    n: 5,
    name: 'DJ Jesus Luz',
    summary: 'Presença confirmada nos dois dias.',
    pages: [
      {
        id: 'setor-05',
        label: 'Setor 05 · Atração',
        badge: 'Presença confirmada',
        title: 'DJ Jesus Luz',
        lead: 'Nos dois dias de SCA Country, ao lado de José Silva, fundador do SCA.',
        image: 'setor-05-dj',
      },
    ],
  },
  {
    n: 6,
    name: 'Aeronaves',
    summary: 'Helicópteros e aviões em exposição.',
    pages: [
      {
        id: 'setor-06',
        label: 'Setor 06 · Aeronaves',
        title: 'Aeronaves',
        lead: 'Helicópteros e aviões de pequeno porte reunidos em um setor próprio: o SCA Country também chega pelo céu.',
        image: 'setor-06-aeronaves',
      },
    ],
  },
  {
    n: 7,
    name: 'Show de Drift',
    summary: 'Os maiores pilotos do Brasil.',
    pages: [
      {
        id: 'setor-07',
        label: 'Setor 07 · Show',
        title: 'Show de Drift',
        lead: 'Apresentação de drift com os maiores pilotos do Brasil.',
        image: 'setor-07-drift',
        fallback: 'track-day-cornering',
        imageAlt: 'Supercarros contornando uma curva da pista',
      },
    ],
  },
  {
    n: 8,
    name: 'Volta Rápida',
    summary: 'Os carros mais exclusivos do Brasil.',
    pages: [
      {
        id: 'setor-08',
        label: 'Setor 08 · Experiência',
        title: 'Volta Rápida',
        lead: 'Uma volta na pista a bordo dos carros mais exclusivos do Brasil.',
        chips: ['Lamborghini Aventador', 'Toyota Supra', 'Nissan Skyline GT-R', 'Mitsubishi Evo', 'Nissan 370Z & 350Z Nismo'],
        image: 'setor-08-volta-rapida',
        fallback: 'lambo-forest-aventador',
        imageAlt: 'Lamborghini Aventador com os faróis acesos',
      },
    ],
  },
  {
    n: 9,
    name: 'SCA Podcast ao vivo',
    summary: 'Entrevistas com os maiores empresários.',
    pages: [
      {
        id: 'setor-09',
        label: 'Setor 09 · Conteúdo',
        title: 'SCA Podcast ao vivo',
        lead: 'Um estúdio fechado dentro do evento para entrevistar, ao vivo, os maiores empresários e empresas.',
        image: 'setor-09-podcast',
        fallback: 'founder-jose-silva',
        imageAlt: 'José Silva, fundador do SCA e apresentador do podcast',
        position: 'center 30%',
      },
    ],
  },
  {
    n: 10,
    name: 'Fogueira Country',
    summary: 'À noite: fogueira, DJ e sertanejo.',
    pages: [
      {
        id: 'setor-10',
        label: 'Setor 10 · À noite',
        title: 'Fogueira Country',
        lead: 'Quando a noite chega, a fazenda acende: fogueira gigante, DJ Jesus Luz e o cantor sertanejo oficial do SCA.',
        image: 'setor-10-fogueira',
      },
    ],
  },
  {
    n: 11,
    name: 'Estacionamento',
    summary: 'Espaço para 5 mil carros.',
    pages: [
      {
        id: 'setor-11',
        label: 'Setor 11 · Estrutura',
        mega: '5 mil',
        title: 'Estacionamento',
        lead: 'Estacionamento para 5 mil carros, pensado para receber os visitantes.',
        image: 'setor-11-estacionamento',
        imageAlt: 'Vista aérea de um grande estacionamento gramado lotado de carros',
      },
    ],
  },
];

/** Fecho da página: entra no bloco de CTA do rodapé. */
export const closingCta = {
  eyebrow: 'Vagas limitadas',
  line1: 'Garanta o seu stand no',
  line2: `${event.name}.`,
  label: 'Falar com o comercial',
  href: reserveCta.href,
} as const;
