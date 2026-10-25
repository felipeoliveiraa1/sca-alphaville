/**
 * SCA — Media Kit do SCA Country · 148ª Edição (/media-kit)
 * Roteiro do José (áudios de 23/10/2026): uma página corrida, estilo PDF, com uma
 * imagem grande por página: capa, ecossistema, Arena VIP e os 11 setores do evento.
 *
 * IMAGENS: cada página procura src/assets/images/media-kit/<image>.(jpg|png|webp) e a
 * mostra inteira, emoldurada ao lado do texto (nunca com texto por cima).
 * Sem o arquivo, usa `fallback` (foto real do site) ou vira uma página tipográfica.
 *
 * STANDS: uma opção só ("Reservar meu stand"), sem tamanhos nem categorias.
 * ⚠ CONFIRMAR: mês do evento.
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
  fallback?: string;               // foto real do site enquanto a imagem final não chega
  imageAlt?: string;
  cta?: { label: string; href: string };
  video?: { src: string; poster: string; title: string };  // vídeo vertical (9:16) em public/video
};

export const capa = {
  eyebrow: 'Media Kit · Expositores',
  titleLines: ['SCA Country', event.edition],
  image: 'capa',
  imageAlt: 'Vista do SCA Country ao pôr do sol: pista, supercarros alinhados na grama, tendas e helicópteros do SCA',
  ctaSecondary: { label: 'Ver a programação', href: '#programacao' },
} as const;

export const ecossistema = {
  page: {
    id: 'ecossistema',
    label: 'Quem somos',
    mega: 'Ecossistema SCA',
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
  imageAlt: 'Lounge VIP elevado com letreiro "VIP · Arena SCA Member" e supercarros estacionados em frente',
};

export const programacao = {
  id: 'programacao',
  label: 'Programação',
  title: 'Dois dias, onze setores e sem hora para terminar.',
};

/* ---------------- Setores (ordem e números ditados pelo José) ---------------- */

export type Setor = {
  n: number;
  name: string;
  summary: string;
  pages: readonly Pagina[];
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
        imageAlt: 'Fileiras de supercarros de várias marcas ao lado da pista, com faixas SCA nas grades e público',
        fallback: 'fleet-formation-saoroque',
      },
      {
        id: 'pista',
        label: 'Setor 01 · A pista',
        title: 'A pista',
        accent: 'Um campo de provas completo.',
        lead: 'Uma estrutura inteira de pistas em plena fazenda, em Tatuí.',
        chips: ['Pista oval', 'Slalom', 'Baixo atrito', 'Off-road', 'Rampa 20%', 'Pistas especiais'],
        image: 'setor-01-pista-mapa',
        imageAlt: 'Vista aérea do campo de provas em Tatuí com as áreas legendadas: pista oval, pista slalom, pista de baixo atrito, pistas off-road, rampa de 20%, pistas especiais, acessórios e portaria',
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
        imageAlt: 'Fileira de tendas pretas de expositores com supercarros estacionados em frente',
        cta: { label: reserveCta.label, href: reserveCta.href },
      },
      {
        id: 'stand-sca',
        label: 'Setor 02 · Stand oficial',
        title: 'Loja oficial SCA',
        lead: 'O stand da marca SCA, com malas, bonés, camisas, moletons e toda a linha oficial do clube.',
        image: 'setor-02-stand-sca',
        imageAlt: 'Stand da loja oficial SCA com bonés, camisetas, moletons e malas, e uma Lamborghini preta ao lado',
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
        imageAlt: 'Costela fogo de chão, food trucks e mesas rústicas ao pôr do sol',
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
        imageAlt: 'Arena Business com telão, sofás de couro e empresários conversando',
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
        imageAlt: 'Palco de DJ com o logo SCA, público dançando e supercarros nas laterais',
        video: { src: '/video/jesus-luz.mp4', poster: '/video/jesus-luz-poster.jpg', title: 'Vídeo do DJ Jesus Luz' },
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
        imageAlt: 'Helicópteros e aviões de pequeno porte expostos na grama do evento',
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
        imageAlt: 'Dois carros fazendo drift lado a lado na pista, com fumaça dos pneus',
        fallback: 'track-day-cornering',
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
        chips: ['Lamborghini Aventador', 'Toyota Supra', 'Nissan Skyline GT-R', 'Mitsubishi Evo', 'Nissan 370Z & 350Z Nismo', 'Fúria', 'Chevrolet S10'],
        image: 'setor-08-volta-rapida',
        imageAlt: 'Carros exclusivos alinhados na reta da pista ao pôr do sol',
        fallback: 'lambo-forest-aventador',
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
        imageAlt: 'Estúdio do SCA Podcast montado no evento, com poltronas, microfones e câmeras',
        fallback: 'founder-jose-silva',
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
        imageAlt: 'Fogueira gigante à noite, com público e palco de show ao fundo',
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
        imageAlt: 'Vista aérea do estacionamento do evento, com milhares de carros em fileiras',
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
