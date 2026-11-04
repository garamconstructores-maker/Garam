import { Project, ProjectMedia, ServiceItem, ValuePillar, SlideData } from '../types/portfolio';

export const COMPANY_INFO = {
  name: 'GARAM CONSTRUCTORES',
  year: '2026',
  tagline: 'Construimos los espacios donde habita la excelencia.',
  closingTagline: 'Construir con sentido. Construir con GARAM.',
  pillarsSummary: 'Promoción · Gerencia · Construcción',
  profileText:
    'GARAM Constructores es una empresa dedicada a la promoción, gerencia de proyectos y construcción de espacios residenciales, comerciales y corporativos. Trabajamos bajo los más altos estándares de calidad, de la mano de un equipo altamente calificado en cada especialidad, para entregar obras que perduran y resignifican el habitar.',
  values: ['CALIDAD', 'EXPERIENCIA', 'EXCELENCIA'],
  stats: [
    { label: 'Obras de Alta Gama', value: '11+' },
    { label: 'Metros Cuadrados Construidos', value: '25,000+' },
    { label: 'Años de Trayectoria', value: '15+' },
    { label: 'Ciudades de Obra', value: '2' },
  ],
  contactInfo: {
    email: 'contacto@garamconstructores.com',
    phone: '+58 (212) 999-8800',
    address: 'Av. Francisco de Miranda, Torre Europa, El Rosal, Caracas - Venezuela',
  },
};

export const VALUE_PILLARS: ValuePillar[] = [
  {
    number: '01',
    title: 'DISEÑO Y EJECUCIÓN',
    description:
      'Integramos arquitectura, ingeniería y construcción bajo una sola gerencia, asegurando coherencia técnica y estética en cada decisión.',
  },
  {
    number: '02',
    title: 'ALIANZAS DE VALOR',
    description:
      'Trabajamos con oficinas de arquitectura de primer nivel para materializar visiones extraordinarias.',
  },
  {
    number: '03',
    title: 'ESTÁNDAR PREMIUM',
    description:
      'Acabados de lujo, sistemas de última generación y supervisión rigurosa que garantizan la durabilidad y el carácter de cada obra.',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'promocion',
    number: '01',
    title: 'PROMOCIÓN',
    description:
      'Identificación y desarrollo de oportunidades inmobiliarias con visión a largo plazo.',
    scopeItems: [
      'Estudios de factibilidad técnica y económica',
      'Desarrollo conceptual y posicionamiento de mercado',
      'Estructuración financiera y legal de proyectos',
      'Análisis de vocación de terrenos urbanos',
    ],
    iconName: 'TrendingUp',
  },
  {
    id: 'gerencia',
    number: '02',
    title: 'GERENCIA DE PROYECTO',
    description:
      'Coordinación integral de oficinas, ingenierías, presupuestos y cronogramas.',
    scopeItems: [
      'Supervisión y auditoría de proyectos de arquitectura e ingeniería',
      'Control riguroso de costes, presupuestos y compras',
      'Planificación temporal en Gantt / BIM',
      'Gestión de permisología municipal e institucional',
    ],
    iconName: 'Briefcase',
  },
  {
    id: 'construccion',
    number: '03',
    title: 'CONSTRUCCIÓN',
    description:
      'Ejecución de obras residenciales, comerciales y corporativas bajo estándares premium.',
    scopeItems: [
      'Edificación de estructuras de concreto armado y metálicas',
      'Control de calidad en obra e inspección técnica contínua',
      'Gestión integral de contratistas y mano de obra especializada',
      'Supervisión de acabados de alto nivel y detalles de arquitectura',
    ],
    iconName: 'Building2',
  },
  {
    id: 'remodelaciones',
    number: '04',
    title: 'REMODELACIONES',
    description:
      'Transformación de espacios existentes preservando su esencia y elevando su valor.',
    scopeItems: [
      'Reformas estructurales y redistribución espacial',
      'Actualización de instalaciones electro-mecánicas y domótica',
      'Rehabilitación de fachadas y envolventes térmico-acústicas',
      'Intervención boutique de interiores de lujo',
    ],
    iconName: 'RefreshCw',
  },
  {
    id: 'urbanismo',
    number: '05',
    title: 'URBANISMO',
    description:
      'Movimientos de tierra, vialidad e infraestructura para parcelas según las necesidades del proyecto.',
    scopeItems: [
      'Estabilización de taludes y terrazas en topografías complejas',
      'Muros de contención en gaviones y concreto armado',
      'Redes de servicios públicos, drenaje y vialidad interna',
      'Paisajismo integrado a la topografía natural',
    ],
    iconName: 'Compass',
  },
  {
    id: 'construccion-especializada',
    number: '06',
    title: 'CONSTRUCCIÓN ESPECIALIZADA',
    description:
      'Proyectos hospitalarios, comerciales y técnicos con normativa específica.',
    scopeItems: [
      'Centros de salud, quirófanos y unidades de urgencias médicas',
      'Instalaciones de gases medicinales y climatización limpia',
      'Adecuación de sedes corporativas con especificación acústica',
      'Cumplimiento estricto de normativas de bioseguridad y protección civil',
    ],
    iconName: 'ShieldCheck',
  },
];

const BASE_PROJECTS: Project[] = [
  {
    id: 'casa-33',
    number: '01',
    title: 'Casa 33',
    subtitle: 'Resultado final residencial.',
    category: 'Residencial',
    location: 'Urb. Altamira · Caracas',
    area: '1.321 m²',
    parcelArea: '792 m²',
    status: 'Ejecutado',
    heroImage: '/obras/casa-33-garam.jpeg',
    heroImage8k: '/obras/casa-33-garam-8k.jpeg',
    has8kMasters: true,
    slogan: 'Acabados, atmósfera y diseño en diálogo con el paisaje.',
    memoria:
      'Una residencia unifamiliar concebida para integrar la arquitectura contemporánea con el clima templado de Altamira. Destaca por su volumetría limpia en tonos grises, una impactante escalera helicoidal exterior en color naranja que actúa como escultura urbana, piscina con solárium de madera sintética y amplias superficies acristaladas.',
    engineeringChallenge:
      'Cálculo estructural y montaje en voladizo de la escalera helicoidal autoportante de acero con 8.5 metros de desarrollo, anclada monolíticamente a pórtico de concreto visto sin apoyos intermedios en el espejo de agua.',
    keyFeatures: [
      'Escalera helicoidal escultórica en acero lacado en color naranja',
      'Terraza solárium con deck de madera sintética y vistas hacia el valle',
      'Acceso principal con puerta escultórica geométrica y muros de concreto visto',
      'Baños principales de lujo con doble lavamanos, iluminación perimetral y mármol',
    ],
    materials: ['Concreto Visto', 'Acero Lacado Naranja', 'Deck de Teca', 'Mármol Blanco', 'Vidrio Templado'],
    detailedMaterials: [
      {
        name: 'Concreto Obra Limpia',
        spec: "f'c = 280 kg/cm² con encofrado fenólico continuo y desmoldante vegetal",
        application: 'Muros portantes estructurales y volúmenes arquitectónicos de fachada',
      },
      {
        name: 'Acero Estructural Calibrado',
        spec: 'Plancha ASTM A36 con pintura electrostática naranja horneada a 200°C',
        application: 'Escalera helicoidal exterior autoportante y pasamanos escultórico',
      },
      {
        name: 'Deck de Teca & Madera Noble',
        spec: 'Listones curados en autoclave con sellador hidrófugo mate anti-UV',
        application: 'Plataforma de solárium perimetral y coronación de piscina',
      },
      {
        name: 'Mármol Blanco Calacatta',
        spec: 'Placas seleccionadas de 20 mm apomazadas con retroiluminación LED cálida',
        application: 'Mueble flotante y revestimiento continuo en baño principal',
      },
      {
        name: 'Vidrio Templado & Laminado',
        spec: 'Vidrio doble 6+6 mm con cámara de 12 mm y película de control solar Low-E',
        application: 'Grandes cerramientos correderos suelo-techo de integración interior-exterior',
      },
    ],
    gallery: [
      {
        type: 'obra',
        url: '/obras/casa-33-garam.jpeg',
        master8kUrl: '/obras/casa-33-garam-8k.jpeg',
        resolution: '7680 × 5360 (8K Ultra-HD)',
        caption: 'Casa 33 · Fachada Exterior - Volumetría gris centrada, jardines de grama y escalera helicoidal escultórica',
      },
      {
        type: 'obra',
        url: '/obras/casa-33-exterior-garam.jpeg',
        master8kUrl: '/obras/casa-33-exterior-garam-8k.jpeg',
        resolution: '7680 × 7096 (8K Ultra-HD)',
        caption: 'Casa 33 · Patio Interior - Escalera helicoidal en acero naranja, espejo de agua y acabados en madera',
      },
      {
        type: 'obra',
        url: '/obras/casa-33-exterior-2-garam.jpeg',
        master8kUrl: '/obras/casa-33-exterior-2-garam-8k.jpeg',
        resolution: '7680 × 4760 (8K Ultra-HD)',
        caption: 'Casa 33 · Terraza Solárium - Deck de madera con tumbonas y vista panorámica a la ciudad y montaña',
      },
      {
        type: 'obra',
        url: '/obras/casa-33-exterior-3-garam.jpeg',
        master8kUrl: '/obras/casa-33-exterior-3-garam-8k.jpeg',
        resolution: '7680 × 4870 (8K Ultra-HD)',
        caption: 'Casa 33 · Acceso Principal - Puerta escultórica de diseño geométrico en amarillo y muro de concreto visto',
      },
      {
        type: 'interior',
        url: '/obras/casa-33-interior-bano.jpeg',
        master8kUrl: '/obras/casa-33-interior-bano-8k.jpeg',
        resolution: '7680 × 4768 (8K Ultra-HD)',
        caption: 'Casa 33 · Baño Principal de Lujo - Mueble flotante en roble, grifería empotrada y mármol retroiluminado',
      },
    ],
  },
  {
    id: 'casa-am',
    number: '02',
    title: 'Casa AM',
    subtitle: 'Concreto obra limpia y vegetación, en diálogo permanente.',
    category: 'Residencial',
    location: 'Caracas',
    area: '2.476,44 m²',
    parcelArea: '2.476,44 m²',
    status: 'En ejecución',
    heroImage: '/obras/casa-am/casa-am-01.webp',
    slogan: 'Una arquitectura para el tiempo.',
    memoria:
      'Una vivienda concebida desde la calma, la luz y la permanencia. Una pieza que se hace paisaje, donde cada material elegido habla del oficio y del cuidado por los detalles. Presenta losas en voladizo en concreto visto, pilares metálicos esbeltos y una disposición curva que abraza la pendiente del terreno.',
    engineeringChallenge:
      'Encofrado curvo milimétrico y vaciado continuo de losas postensadas en voladizo sobre topografía de pendiente pronunciada, garantizando cero juntas frías en el concreto obra limpia.',
    keyFeatures: [
      'Volumetría curva continua con losas en voladizo y pilares metálicos esbeltos',
      'Galería interior de concreto visto con mural escultórico en bajorrelieve',
      'Terraza solárium superior en voladizo con visual panorámica hacia el Ávila',
      'Vista aérea de avance de fundaciones, losas postensadas y grúa torre',
    ],
    materials: ['Concreto Obra Limpia', 'Perfilería Estructural de Acero', 'Cristal Laminado UV', 'Piedra & Acabados Nobles'],
    detailedMaterials: [
      {
        name: 'Concreto Obra Limpia Arquitectónico',
        spec: "f'c = 350 kg/cm² con agregados seleccionados, formaleta metálica curva y vaciado monolítico",
        application: 'Losas en voladizo, muros estructurales vistos, mural en bajorrelieve y remates de cubierta',
      },
      {
        name: 'Perfilería de Acero Estructural',
        spec: 'Columnas tubulares esbeltas en racimos con imprimación epóxica anticorrosiva de alto rendimiento',
        application: 'Soporte puntual de voladizos y carpinterías monumentales de gran formato',
      },
      {
        name: 'Cristal Laminado de Seguridad',
        spec: 'Cristal 8+8 mm acústico con intercalario PVB y protección solar 99% UV',
        application: 'Grandes cerramientos panorámicos que integran el paisaje vegetal y el Ávila',
      },
      {
        name: 'Madera de Roble & Decks Exteriores',
        spec: 'Listones curados de alta densidad y tablones de roble con acabado al aceite natural poro abierto',
        application: 'Áreas de solárium perimetrales, revestimientos interiores y puertas pivotantes',
      },
    ],
    gallery: [
      {
        type: 'render',
        url: '/obras/casa-am/casa-am-render-01.webp',
        master8kUrl: '/obras/casa-am/casa-am-render-01-8k.webp',
        resolution: '3840 × 2160',
        caption: 'Render arquitectónico · 1 de 5',
        stage: 'Diseño',
      },
      {
        type: 'video',
        url: '/obras/casa-am/video/casa-am-poster.webp',
        videoUrl: '/obras/casa-am/video/casa-am.mp4',
        caption: 'Recorrido del proyecto',
        stage: 'Recorrido',
      },
      {
        type: 'obra',
        url: '/obras/casa-am/casa-am-obra-01.webp',
        caption: 'Avance de obra · 1 de 6',
        stage: 'Proceso de obra',
      },
      {
        type: 'obra',
        url: '/obras/casa-am/casa-am-obra-02.webp',
        caption: 'Avance de obra · 2 de 6',
        stage: 'Proceso de obra',
      },
      {
        type: 'obra',
        url: '/obras/casa-am/casa-am-obra-03.webp',
        caption: 'Avance de obra · 3 de 6',
        stage: 'Proceso de obra',
      },
      {
        type: 'obra',
        url: '/obras/casa-am/casa-am-obra-04.webp',
        caption: 'Avance de obra · 4 de 6',
        stage: 'Proceso de obra',
      },
      {
        type: 'obra',
        url: '/obras/casa-am/casa-am-obra-05.webp',
        caption: 'Avance de obra · 5 de 6',
        stage: 'Proceso de obra',
      },
      {
        type: 'obra',
        url: '/obras/casa-am/casa-am-obra-06.webp',
        caption: 'Avance de obra · 6 de 6',
        stage: 'Proceso de obra',
      },
      {
        type: 'render',
        url: '/obras/casa-am/casa-am-render-02.webp',
        master8kUrl: '/obras/casa-am/casa-am-render-02-8k.webp',
        resolution: '3840 × 2160',
        caption: 'Render arquitectónico · 2 de 5',
        stage: 'Diseño',
      },
      {
        type: 'render',
        url: '/obras/casa-am/casa-am-render-03.webp',
        master8kUrl: '/obras/casa-am/casa-am-render-03-8k.webp',
        resolution: '3840 × 2160',
        caption: 'Render arquitectónico · 3 de 5',
        stage: 'Diseño',
      },
      {
        type: 'render',
        url: '/obras/casa-am/casa-am-render-04.webp',
        master8kUrl: '/obras/casa-am/casa-am-render-04-8k.webp',
        resolution: '3840 × 2160',
        caption: 'Render arquitectónico · 4 de 5',
        stage: 'Diseño',
      },
      {
        type: 'render',
        url: '/obras/casa-am/casa-am-render-05.webp',
        master8kUrl: '/obras/casa-am/casa-am-render-05-8k.webp',
        resolution: '3840 × 2160',
        caption: 'Render arquitectónico · 5 de 5',
        stage: 'Diseño',
      },
    ],
  },
  {
    id: 'casa-blanca-galipan',
    number: '03',
    title: 'Casa Blanca Galipán',
    subtitle: 'Urbanismo y terrazas en la montaña.',
    category: 'Urbanismo',
    location: 'Galipán · Edo. La Guaira',
    area: 'Parcela 11.300 m²',
    parcelArea: '11.300 m²',
    status: 'En ejecución',
    heroImage: '/obras/portfolio/p03-galipan.jpg',
    slogan: 'Habilitar la montaña: terrazas para seis cabañas y un paisaje renovado.',
    memoria:
      'Intervención urbana y de ingeniería geotécnica en el Parque Nacional El Ávila (Galipán). Comprende la conformación de 6 terrazas estabilizadas mediante muros de contención geotécnicos y vialidad interna para el desarrollo de un complejo residencial ecológico boutique.',
    engineeringChallenge:
      'Estabilización geotécnica y movimiento de tierras en pendiente de hasta 42° mediante muros de gavión escalonados y pedraplén drenante, creando 6 plataformas sin alterar los acuíferos de montaña ni la flora autóctona.',
    keyFeatures: [
      'Movimientos de tierra de alta precisión en pendiente severa',
      'Construcción de muros de contención y sistemas de drenaje de montaña',
      'Conformación de 6 plataformas utilizables para cabañas independientes',
      'Preservación de la vegetación nativa del ecosistema de montaña',
    ],
    materials: ['Piedra de Gavión', 'Concreto Armado de Alta Resistencia', 'Geotextiles de Filtración', 'Asfalto Ecológico'],
    detailedMaterials: [
      {
        name: 'Muros de Gavión con Malla Triple Torsión',
        spec: 'Alambre galvanizado reforzado clase A relleno de roca volcánica seleccionada',
        application: 'Contención de taludes, absorción de empujes dinámicos y drenaje natural',
      },
      {
        name: 'Concreto Armado Estructural',
        spec: "f'c = 300 kg/cm² con hidrófugo de masa y aditivo superfluidificante",
        application: 'Cimentaciones profundas, cabezales de micropilotes y losas de plataformas',
      },
      {
        name: 'Geomembrana & Geotextil No Tejido',
        spec: 'Polipropileno de filamento continuo de 300 g/m² para retención de finos',
        application: 'Capa filtrante entre el suelo natural de montaña y los drenajes de roca',
      },
      {
        name: 'Vialidad Ecológica Permeable',
        spec: 'Adoquines de concreto poroso trabados sobre cama de arena lavada',
        application: 'Caminos de circulación interna y estacionamientos ecológicos',
      },
    ],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p03-galipan.jpg',
        caption: 'Casa Blanca Galipán · Urbanismo y terrazas escalonadas en ladera de montaña',
      },
      {
        type: 'obra',
        url: '/obras/casa-blanca-galipan/casa-blanca-01.webp',
        caption: 'Casa Blanca Galipán · Vista aérea 1 de 6',
      },
      {
        type: 'obra',
        url: '/obras/casa-blanca-galipan/casa-blanca-02.webp',
        caption: 'Casa Blanca Galipán · Vista aérea 2 de 6',
      },
      {
        type: 'obra',
        url: '/obras/casa-blanca-galipan/casa-blanca-03.webp',
        caption: 'Casa Blanca Galipán · Vista aérea 3 de 6',
      },
      {
        type: 'obra',
        url: '/obras/casa-blanca-galipan/casa-blanca-04.webp',
        caption: 'Casa Blanca Galipán · Vista aérea 4 de 6',
      },
      {
        type: 'obra',
        url: '/obras/casa-blanca-galipan/casa-blanca-05.webp',
        caption: 'Casa Blanca Galipán · Vista aérea 5 de 6',
      },
      {
        type: 'obra',
        url: '/obras/casa-blanca-galipan/casa-blanca-06.webp',
        caption: 'Casa Blanca Galipán · Vista aérea 6 de 6',
      },
    ],
  },
  {
    id: 'tienda-restaurante',
    number: '04',
    title: 'Tienda + Restaurante',
    subtitle: 'Edificación comercial vertical: tienda, gastronomía, servicio.',
    category: 'Comercial',
    location: 'Altamira · Caracas',
    area: '1.250 m²',
    status: 'En ejecución',
    heroImage: '/obras/portfolio/p04-comercial.jpg',
    slogan: 'Ingeniería estructural al servicio de un gesto arquitectónico.',
    memoria:
      'Un hito comercial de tres niveles con terraza superior en Altamira. La fachada combina elegantes arcos de doble altura vestidos con mosaico azul cobalto y acristalamiento reflejante. En el interior, la estructura metálica alberga una monumental escalera helicoidal de acero exenta.',
    keyFeatures: [
      'Estructura portante metálica con perfiles HEB/IPE expuestos',
      'Escalera helicoidal monumental en pletina de acero soldado',
      'Fachada con arcos neoclásicos reinterpretados en mosaico cerámico',
      'Roof-top para restaurante con vistas despejadas a la ciudad',
    ],
    materials: ['Estructura Metálica de Acero', 'Mosaico Cerámico Artesanal', 'Vidrio Termo-acústico', 'Porcelanato Gran Formato'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p04-comercial.jpg',
        caption: 'Tienda + Restaurante · Edificación comercial vertical en Altamira',
      },
      {
        type: 'obra',
        url: '/obras/portfolio/p04-comercial.jpg',
        caption: 'Tienda + Restaurante · Estructura metálica portante y escalera helicoidal en acero',
      },
      {
        type: 'obra',
        url: '/obras/portfolio/p04-comercial.jpg',
        caption: 'Tienda + Restaurante · Arquitectura interior y fachada monumental con arcos en mosaico cobalto',
      },
    ],
  },
  {
    id: 'fendi',
    number: '05',
    title: 'FENDI',
    subtitle: 'Edificio totalmente reformado.',
    category: 'Residencial',
    location: 'Urb. La Castellana · Caracas',
    area: 'Parcela 793,29 m²',
    parcelArea: '793,29 m²',
    status: 'Ejecutado',
    heroImage: '/obras/portfolio/p05-fendi.jpg',
    slogan: 'Una identidad nueva, una arquitectura definitiva.',
    memoria:
      'Una intervención integral que redefine el edificio y eleva el estándar del habitar en Caracas, con acabados, sistemas y detalles del más alto nivel. Alberga tres residencias exclusivas tipo penthouse con vistas francas al Parque Nacional El Ávila.',
    keyFeatures: [
      'Rehabilitación estructural y cambio radical de envolvente exterior',
      'Tres apartamentos de gran escala con distribución personalizada',
      'Penthouse con terraza panorámica de 180° hacia el Ávila',
      'Sistemas de climatización VRV de alta eficiencia y domótica integral',
    ],
    materials: ['Paneles de Aluminio Compuesto', 'Vidrio Low-E Insulado', 'Mármol Blanco Macael', 'Maderas Nobles'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p05-fendi.jpg',
        caption: 'FENDI · Rehabilitación integral y transformación de edificio en La Castellana',
      },
      {
        type: 'obra',
        url: '/obras/fendi/fendi-01.webp',
        caption: 'FENDI · Registro de obra 1 de 6',
      },
      {
        type: 'obra',
        url: '/obras/fendi/fendi-02.webp',
        caption: 'FENDI · Registro de obra 2 de 6',
      },
      {
        type: 'obra',
        url: '/obras/fendi/fendi-03.webp',
        caption: 'FENDI · Registro de obra 3 de 6',
      },
      {
        type: 'obra',
        url: '/obras/fendi/fendi-04.webp',
        caption: 'FENDI · Registro de obra 4 de 6',
      },
      {
        type: 'obra',
        url: '/obras/fendi/fendi-05.webp',
        caption: 'FENDI · Registro de obra 5 de 6',
      },
      {
        type: 'obra',
        url: '/obras/fendi/fendi-06.webp',
        caption: 'FENDI · Registro de obra 6 de 6',
      },
    ],
  },
  {
    id: 'residencias-caroni',
    number: '06',
    title: 'Residencias Caroní',
    subtitle: 'La obra más ambiciosa.',
    category: 'Residencial',
    location: 'Altamira · Caracas',
    area: 'Ocho residencias',
    status: 'En ejecución',
    heroImage: '/obras/portfolio/p06-caroni.jpg',
    slogan: 'Voladizos profundos, vegetación integrada, vistas al Ávila.',
    memoria:
      'El proyecto residencial insignia de GARAM Constructores en Altamira. Ocho residencias únicas dispuestas en un edificio de arquitectura escultórica caracterizada por profundos voladizos de concreto, jardineras orgánicas integradas en fachada y quiebrasoles de madera vertical.',
    keyFeatures: [
      'Losa volada audaz con voladizos de más de 4.5 metros de profundidad',
      'Integración biofílica de jardines colgantes regados por goteo automatizado',
      'Ocho residencias de lujo con acceso privado mediante ascensor directo',
      'Vistas ininterrumpidas a la cresta del Ávila desde cada planta',
    ],
    materials: ['Concreto Armado Texturizado', 'Teca Sostenible Tratada', 'Piedra Pizarra Gris', 'Sistemas Bioclimáticos'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p06-caroni.jpg',
        caption: 'Residencias Caroní · Ocho residencias exclusivas de alta gama en Altamira',
      },
      {
        type: 'obra',
        url: '/obras/portfolio/p06-caroni.jpg',
        caption: 'Residencias Caroní · Fachada principal y volumetría de losas suspendidas',
      },
      {
        type: 'obra',
        url: '/obras/portfolio/p06-caroni.jpg',
        caption: 'Residencias Caroní · Arquitectura biofílica: voladizos profundos y vegetación integrada',
      },
      {
        type: 'obra',
        url: '/obras/portfolio/p06-caroni.jpg',
        caption: 'Residencias Caroní · Detalle constructivo de fachada y terraza sur',
      },
    ],
  },
  {
    id: 'quinta-san-francisco',
    number: '07',
    title: 'Quinta San Francisco',
    subtitle: 'Una vivienda unifamiliar por venir.',
    category: 'Residencial',
    location: 'Altamira · Caracas',
    area: '1.914,59 m²',
    parcelArea: '844,57 m²',
    status: 'Por ejecutar',
    statusYear: '2026',
    heroImage: '/obras/portfolio/p07-sanfrancisco.jpg',
    slogan: 'Espacios diáfanos abiertos al jardín y a la luz.',
    memoria:
      'Una propuesta de residencia unifamiliar contemporánea que replantea la relación entre interior y exterior. Un gran volumen prismático flotante sobre una planta baja totalmente acristalada que se funde con la piscina y los jardines perimetrales.',
    keyFeatures: [
      'Salón de doble altura con grandes ventanales correderos empotrados',
      'Piscina integrada al deck de la terraza social',
      'Diseño bioclimático con ventilación cruzada natural',
      'Planta flexible de casi 2.000 m² habitables',
    ],
    materials: ['Concreto Gris Arquitectónico', 'Piedra Caliza', 'Vidrio Templado Acústico', 'Estructura de Acero'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p07-sanfrancisco.jpg',
        caption: 'Quinta San Francisco · Residencia unifamiliar contemporánea de alta gama',
      },
      {
        type: 'obra',
        url: '/obras/portfolio/p07-sanfrancisco.jpg',
        caption: 'Quinta San Francisco · Fachada principal y volumen escultórico de acceso',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p07-sanfrancisco.jpg',
        caption: 'Quinta San Francisco · Espacios diáfanos en doble altura integrados al jardín y a la luz',
      },
    ],
  },
  {
    id: 'torre-el-rosal-p10',
    number: '08',
    title: 'Torre El Rosal — Piso 10',
    subtitle: 'Oficinas corporativas, construidas desde cero.',
    category: 'Corporativo',
    location: 'El Rosal · Caracas',
    area: '500 m²',
    status: 'Ejecutado',
    heroImage: '/obras/portfolio/p08-rosalp10.jpg',
    slogan: 'Adecuación corporativa que jerarquiza espacios y luz.',
    memoria:
      'Habilitación integral llave en mano de 500 m² de oficina corporativa en una de las torres empresariales más prestigiosas de El Rosal. Incluye áreas de recepción, sala de juntas de alta tecnología, oficinas ejecutivas y zona de open office.',
    keyFeatures: [
      'Techos decorativos acústicos con iluminación cóncava LED artesanal',
      'Revestimientos de pared en panelería de madera de roble natural',
      'Sala de juntas ejecutiva integrada con sistemas audiovisual y domótica',
      'Distribución operativa optimizada para 40+ estaciones de trabajo',
    ],
    materials: ['Paneles Acústicos Fonoabsorbentes', 'Madera de Roble', 'Cristal Templado Opaco', 'Alfombra Modular'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p08-rosalp10.jpg',
        caption: 'Torre El Rosal Piso 10 · Habilitación integral de oficinas corporativas llave en mano',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p08-rosalp10.jpg',
        caption: 'Torre El Rosal Piso 10 · Espacios ejecutivos: sala de juntas con domótica y despachos privados',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p08-rosalp10.jpg',
        caption: 'Torre El Rosal Piso 10 · Open Office: distribución diáfana y divisiones acústicas de vidrio',
      },
    ],
  },
  {
    id: 'torre-el-rosal-p6',
    number: '09',
    title: 'Torre El Rosal — Piso 6',
    subtitle: 'Oficinas corporativas en ejecución.',
    category: 'Corporativo',
    location: 'El Rosal · Caracas',
    area: '500 m²',
    status: 'En ejecución',
    heroImage: '/obras/portfolio/p09-rosalp6.jpg',
    slogan: 'Una oficina pensada en jerarquías, fluidez y eficiencia.',
    memoria:
      'Proyecto corporativo en proceso de ejecución para una firma multinacional. Destaca por sus techos técnicos industriales vistos en tono concreto y tuberías vistas, combinados con divisiones de cristal tintado y mobiliario ergonómico de vanguardia.',
    keyFeatures: [
      'Diseño industrial cálido con forjados vistos e iluminación lineal suspendida',
      'Áreas ejecutivas privadas y boxes de reunión rápida',
      'Aislamiento acústico de alto nivel en tabiquería interna',
      'Eficiencia espacial en 500 m² de planta libre',
    ],
    materials: ['Concreto Visto Técnico', 'Perfilería de Aluminio Negro Mate', 'Mármol Gris en Revestimiento', 'Fieltro Acústico'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p09-rosalp6.jpg',
        caption: 'Torre El Rosal Piso 6 · Oficinas corporativas de vanguardia en proceso de habilitación',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p09-rosalp6.jpg',
        caption: 'Torre El Rosal Piso 6 · Arquitectura interior: área de gerencia y módulos técnicos de apoyo',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p09-rosalp6.jpg',
        caption: 'Torre El Rosal Piso 6 · Open Office: puestos operativos de alta densidad e iluminación técnica',
      },
    ],
  },
  {
    id: 'urgencias-la-candelaria',
    number: '10',
    title: 'Urgencias 9·11 La Candelaria',
    subtitle: 'Construcción especializada para el sector salud.',
    category: 'Salud / Especializada',
    location: 'La Candelaria · Caracas',
    area: '453,38 m²',
    levels: '4 niveles',
    status: 'Ejecutado',
    heroImage: '/obras/portfolio/p10-candelaria.jpg',
    slogan: 'Construir para cuidar.',
    memoria:
      'Un centro de urgencias médicas concebido con la rigurosidad y el detalle que exige el sector salud, expresión de nuestra experiencia en construcción especializada. Desarrollado en 4 niveles con instalaciones clínicas normadas.',
    keyFeatures: [
      'Cumplimiento estricto de normativas de salud y asepsia hospitalaria',
      'Sistemas de gases medicinales centralizados y respaldo eléctrico 100%',
      'Mostrador de recepción curvo en resina epóxica azul cobalto',
      'Pisos continuos de vinil conductivo antibacteriano',
    ],
    materials: ['Vinil Grado Hospitalario', 'Resina Epóxica Sanitaria', 'Acero Inoxidable 316', 'Paredes Plomadas para Rayos-X'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p10-candelaria.jpg',
        caption: 'Urgencias 9·11 La Candelaria · Centro clínico especializado desarrollado en 4 niveles',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p10-candelaria.jpg',
        caption: 'Urgencias 9·11 La Candelaria · Recepción curva de alto tránsito e instalaciones sanitarias normadas',
      },
    ],
  },
  {
    id: 'urgencias-torre-europa',
    number: '11',
    title: 'Urgencias 9·11 Torre Europa',
    subtitle: 'Centro de urgencias en plena Av. Francisco de Miranda.',
    category: 'Salud / Especializada',
    location: 'El Rosal · Chacao · Caracas',
    area: '437,15 m²',
    levels: '2 niveles',
    status: 'Ejecutado',
    heroImage: '/obras/portfolio/p11-europa.jpg',
    slogan: 'Funcionalidad hospitalaria al servicio de la urgencia.',
    memoria:
      'Unidad de atención inmediata ubicada en un punto estratégico neurálgico de la ciudad. Diseñada en 2 niveles con amplio hall de recepción en doble altura, boxes de tratamiento privado, área de observación de pacientes y estación de enfermería.',
    keyFeatures: [
      'Doble altura acristalada con vistas a la Av. Francisco de Miranda',
      'Mobiliario médico ergonómico de alta resistencia e higiene',
      'Box de reanimación y salas de observación con cortinas antibacterianas',
      'Flujos diferenciados para pacientes y personal médico',
    ],
    materials: ['Piso Continuo de Linóleo Clínico', 'Acero Inoxidable', 'Paneles de Vidrio Templado Azul', 'Techo Técnico Sanitario'],
    gallery: [
      {
        type: 'obra',
        url: '/obras/portfolio/p11-europa.jpg',
        caption: 'Urgencias 9·11 Torre Europa · Centro de atención médica inmediata en Av. Francisco de Miranda',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p11-europa.jpg',
        caption: 'Urgencias 9·11 Torre Europa · Recepción en doble altura acristalada y áreas de triaje clínico',
      },
      {
        type: 'interior',
        url: '/obras/portfolio/p11-europa.jpg',
        caption: 'Urgencias 9·11 Torre Europa · Área de tratamiento clínico y boxes de atención médica en planta baja',
      },
    ],
  },
];

// Legacy slide deck data purged in favor of pure web editorial architecture
export const SLIDES_DATA: SlideData[] = [];

export const PROJECTS: Project[] = BASE_PROJECTS;
