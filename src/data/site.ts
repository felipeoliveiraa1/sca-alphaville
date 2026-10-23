/**
 * SCA — Super Carros Alphaville
 * Conteúdo central do site (PT-BR). Fonte: dossiê oficial + copy do site atual.
 * Mantém a "voz" da marca: exclusividade, alto nível, paixão e negócios.
 */

export const brand = {
  name: 'Super Carros Alphaville',
  shortName: 'SCA',
  legalName: 'SCA Super Carros Alphaville LTDA',
  cnpj: '48.048.498/0001-99',
  foundedMovement: 2019,
  foundedLegal: 2022,
  tagline: 'Experiência Além da Velocidade',
  positioning: 'O maior ecossistema de empresários do mundo',
  city: 'Alphaville · Barueri, SP',
  address: 'Al. Mamoré, 503, Conj. 194, Barueri / SP',
} as const;

export const contact = {
  whatsapp: '+55 11 99463-3003',
  whatsappDigits: '5511994633003',
  phoneDisplay: '(11) 99463-3003',
  email: 'contato@supercarrosalphaville.com.br',
  locations: 'Brasil · EUA · Europa',
} as const;

export const social = {
  instagram: 'https://www.instagram.com/supercarrosalphaville/',
  instagramHandle: '@supercarrosalphaville',
  youtube: 'https://www.youtube.com/@supercarrosalphaville',
  facebook: 'https://www.facebook.com/supercarrosalphaville1/',
} as const;

export const nav = [
  { label: 'O Ecossistema', href: '#ecossistema' },
  { label: 'Essência', href: '#essencia' },
  { label: 'Experiências', href: '#experiencias' },
  { label: 'Alcance', href: '#alcance' },
  { label: 'Parcerias', href: '#parcerias' },
] as const;

export const hero = {
  eyebrow: 'Clube Privado · Membros desde 2019',
  titleLines: ['Experiência', 'Além da', 'Velocidade'],
  lead:
    'Onde a paixão por supercarros encontra o networking de alto nível. Não é apenas um clube. É um universo de possibilidades, exclusividade e conexões que movem negócios.',
  ctaPrimary: { label: 'Seja Membro', href: '#membro' },
  ctaSecondary: { label: 'Conheça o Ecossistema', href: '#ecossistema' },
  marquee: ['Alphaville', '+12 Estados', 'EUA', 'Europa', '148 Edições', '+3.000 Membros'],
} as const;

/** Faixa de credenciais logo abaixo do hero ("+" na frente; 148 é o número exato de edições) */
export const trustStrip = [
  { value: '+3.000', label: 'Membros ativos' },
  { value: '148', label: 'Edições realizadas' },
  { value: '+12', label: 'Estados de atuação' },
  { value: '+30', label: 'Marcas parceiras' },
] as const;

export const essence = {
  eyebrow: 'A Essência da Exclusividade',
  title: 'Construído sobre os valores que movem o sucesso e a paixão.',
  pillars: [
    {
      index: '01',
      title: 'Paixão Compartilhada',
      body:
        'O elo que une nossos membros é o fascínio por supercarros e tudo o que eles representam, conquista, presença e excelência.',
    },
    {
      index: '02',
      title: 'Relacionamento de Alto Nível',
      body:
        'Aqui, conexões se transformam em amizades duradouras e em grandes oportunidades reais de negócios entre empresários e investidores.',
    },
    {
      index: '03',
      title: 'Experiências Incomparáveis',
      body:
        'Eventos projetados para entregar sempre o melhor, ambientes, curadoria e detalhes exclusivos. Do luxo ao desempenho.',
    },
  ],
} as const;

export const about = {
  eyebrow: 'Bem-vindo ao Universo SCA',
  title: 'Mais que um clube. Um estilo de vida, um selo de exclusividade e uma plataforma de crescimento.',
  body: [
    'O que começou como um encontro entre amigos em 2019 se transformou em uma referência nacional e internacional, reunindo empresários, influenciadores e famílias que compartilham a mesma paixão por carros.',
    'Proporcionamos experiências inesquecíveis que conectam pessoas e criam oportunidades reais de negócios, indo muito além da velocidade.',
  ],
} as const;

/** Métricas de alcance — "Uma Potência no Cenário Automotivo Global" */
export const reach = {
  eyebrow: 'Uma Potência no Cenário Global',
  title: 'Nosso alcance vai muito além da velocidade.',
  lead: 'Conectando marcas e pessoas em uma escala sem precedentes.',
  stats: [
    { value: 3000, prefix: '+', label: 'Membros ativos', note: 'Empresários, investidores e colecionadores' },
    { value: 12, prefix: '+', label: 'Estados no Brasil', note: 'Presença também nos EUA e Europa' },
    { value: 148, label: 'Edições realizadas', note: 'Encontros, viagens e experiências' },
    { value: 30, prefix: '+', label: 'Marcas parceiras', note: 'Ecossistema de luxo e performance' },
  ],
} as const;

/** Experiências / formatos de evento (tag é opcional: sem ela, só o título) */
type Experience = { tag?: string; title: string; body: string; image: string };

export const experiences: readonly Experience[] = [
  {
    tag: 'Aniversário de 4 anos',
    title: 'A edição dos 4 anos do SCA',
    body:
      'O clube comemorou seus quatro anos com uma edição especial, reunindo membros, famílias e parceiros.',
    image: 'event-4anos-venue',
  },
  {
    title: 'Nosso track day',
    body:
      'Um registro do track day do SCA: membros acelerando os próprios carros na pista, com toda a estrutura do clube.',
    image: 'corvette-z06-track',
  },
  {
    title: 'Eventos em São Roque',
    body:
      'Um mega encontro em São Roque, reunindo membros, famílias e parceiros do clube.',
    image: 'aerial-saoroque',
  },
  {
    tag: 'Porsche',
    title: 'Porsches lado a lado',
    body:
      'Do 718 Boxster ao 911, uma fileira de cores que traduz a paixão dos membros pela marca alemã.',
    image: 'porsche-row',
  },
  {
    tag: 'No Limite',
    title: 'SCA Track Day',
    body:
      'Carros superesportivos lado a lado. O som e a experiência que só a pista entrega.',
    image: 'track-day-cornering',
  },
];

export const partners = {
  eyebrow: 'Ecossistema de Parcerias',
  title: 'Mais de 30 marcas de luxo ativam suas experiências dentro do SCA.',
  body:
    'Concessionárias premium, blindagem, estética automotiva e serviços financeiros encontram no SCA um palco de alto valor para exposição, test drives e cobertura digital.',
  categories: [
    'Concessionárias Premium',
    'Blindagem',
    'Estética Automotiva',
    'Serviços Financeiros',
    'Lifestyle & Hospitalidade',
    'Cobertura Digital',
  ],
  benefits: [
    { title: 'Sua marca em destaque', body: 'Exponha sua marca nos eventos do SCA, para empresários com alto poder de compra.' },
    { title: 'Amostras e test drives', body: 'Deixe o público conhecer de perto o seu produto, com amostras, demonstrações e test drives.' },
    { title: 'Divulgação nas redes', body: 'Sua participação aparece nas fotos e vídeos que o SCA publica nas redes sociais.' },
  ],
} as const;

export const membership = {
  eyebrow: 'Acesso por Convite',
  title: 'O SCA é um clube fechado. A entrada é uma decisão e um privilégio.',
  body:
    'Os eventos não são abertos ao público. São exclusivos para membros, suas famílias e empresas parceiras. Candidate-se e dê o primeiro passo para entrar no ecossistema.',
  tiers: [
    {
      name: 'Membro',
      for: 'Para apaixonados por supercarros e networking de alto nível.',
      points: ['Acesso aos encontros e edições', 'Rede de empresários e investidores', 'Experiências e viagens exclusivas'],
      cta: 'Seja Membro',
    },
    {
      name: 'Parceiro',
      for: 'Para marcas que querem ativar diante de um público premium.',
      points: ['Exposição e ativação de marca', 'Test drives e sampling', 'Cobertura digital premium'],
      cta: 'Seja Parceiro',
    },
  ],
} as const;

export const finalCta = {
  eyebrow: 'O próximo capítulo é seu',
  title: 'Entre para o universo Super Carros Alphaville.',
  body: 'Um estilo de vida, um selo de exclusividade e uma plataforma de crescimento.',
  cta: { label: 'Falar no WhatsApp', href: `https://wa.me/${contact.whatsappDigits}` },
} as const;
