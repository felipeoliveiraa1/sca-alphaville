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
  { label: 'Fundador', href: '#fundador' },
  { label: 'Parcerias', href: '#parcerias' },
] as const;

export const hero = {
  eyebrow: 'Clube Privado · Membros desde 2019',
  titleLines: ['Experiência', 'Além da', 'Velocidade'],
  lead:
    'Onde a paixão por supercarros encontra o networking de alto nível. Não é apenas um clube. É um universo de possibilidades, exclusividade e conexões que movem negócios.',
  ctaPrimary: { label: 'Seja Membro', href: '#membro' },
  ctaSecondary: { label: 'Conheça o Ecossistema', href: '#ecossistema' },
  marquee: ['Alphaville', '+12 Estados', 'EUA', 'Europa', '140+ Edições', '2.000+ Membros'],
} as const;

/** Faixa de credenciais logo abaixo do hero */
export const trustStrip = [
  { value: '2.000+', label: 'Membros ativos' },
  { value: '140+', label: 'Edições realizadas' },
  { value: '+12', label: 'Estados de atuação' },
  { value: '30+', label: 'Marcas parceiras' },
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
  signature: 'José Édson Mendonça da Silva · Fundador & CEO',
} as const;

/** Métricas de alcance — "Uma Potência no Cenário Automotivo Global" */
export const reach = {
  eyebrow: 'Uma Potência no Cenário Global',
  title: 'Nosso alcance vai muito além da velocidade.',
  lead: 'Conectando marcas e pessoas em uma escala sem precedentes.',
  stats: [
    { value: 2000, suffix: '+', label: 'Membros ativos', note: 'Empresários, investidores e colecionadores' },
    { value: 12, prefix: '+', label: 'Estados no Brasil', note: 'Presença também nos EUA e Europa' },
    { value: 140, suffix: '+', label: 'Edições realizadas', note: 'Encontros, viagens e experiências' },
    { value: 30, suffix: '+', label: 'Marcas parceiras', note: 'Ecossistema de luxo e performance' },
  ],
} as const;

/** Experiências / formatos de evento */
export const experiences = [
  {
    tag: 'Edições Regulares',
    title: 'Encontros que já passaram de 140 edições',
    body:
      'De fazendas históricas a autódromos, cada edição é uma curadoria de máquinas raras e pessoas extraordinárias.',
    image: 'event-4anos-venue',
  },
  {
    tag: 'Track Days',
    title: 'A pista como extensão do clube',
    body:
      'Desempenho de verdade, no limite, com a segurança e o requinte que só um clube fechado proporciona.',
    image: 'corvette-z06-track',
  },
  {
    tag: 'Mega Encontros',
    title: 'Até 400 supercarros reunidos',
    body:
      'O aniversário do clube reuniu centenas de modelos esportivos no Complexo Dream Car Museum, em São Roque.',
    image: 'aerial-saoroque',
  },
  {
    tag: 'Edições Temáticas',
    title: 'SCA JDM e capítulos exclusivos',
    body:
      'Capítulos dedicados, como a 1ª Edição SCA JDM, celebram nichos e culturas dentro do universo automotivo.',
    image: 'porsche-row',
  },
  {
    tag: 'No Limite',
    title: 'O clube em movimento, no ápice da pista',
    body:
      'Aventador SVJ, Huracán STO e uma matilha de esportivos traçando as curvas lado a lado. O som, a precisão e a emoção que só a pista entrega.',
    image: 'track-day-cornering',
  },
] as const;

export const founder = {
  eyebrow: 'Liderança',
  name: 'José Édson Mendonça da Silva',
  role: 'Fundador & CEO',
  quote:
    'Transformamos uma paixão de fim de semana em um dos ecossistemas de negócios mais exclusivos do país. Aqui, cada relação importa.',
  body: [
    'Rosto à frente da expansão do clube e apresentador do Podcast Super Carros Alphaville, José Édson recebe personalidades do setor automotivo e do empreendedorismo para discutir negócios, mercado e estilo de vida.',
    'Sua visão uniu a paixão por alta performance ao networking de altíssimo nível, criando um ambiente onde empresários constroem relações que duram e geram oportunidades reais.',
  ],
  image: 'founder-jose-silva',
} as const;

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
    { title: 'Exposição & Ativação', body: 'Sua marca diante de um público de altíssimo poder aquisitivo.' },
    { title: 'Sampling & Test Drives', body: 'Experiências e demonstrações em ambiente controlado e exclusivo.' },
    { title: 'Cobertura Premium', body: 'Conteúdo digital de alto padrão registrando cada ativação.' },
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
