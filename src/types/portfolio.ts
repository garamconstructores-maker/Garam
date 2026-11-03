export type ProjectCategory = 'Residencial' | 'Comercial' | 'Corporativo' | 'Salud / Especializada' | 'Urbanismo';

export type ProjectStatus = 'Ejecutado' | 'En ejecución' | 'Por ejecutar';

export interface ProjectMedia {
  type: 'render' | 'obra' | 'antes_despues' | 'planta' | 'interior' | 'video';
  url: string;
  master8kUrl?: string;
  resolution?: string;
  caption: string;
  beforeUrl?: string; // For comparative urbanism or before/after
  afterUrl?: string;
  stage?: string; // Etapa de la obra para agrupar en la ficha (p. ej. Diseño, Proceso de obra)
  videoUrl?: string; // Video MP4 del recorrido; url funciona como imagen de portada
}

export interface Project {
  id: string;
  number: string; // e.g., '01', '02', '03'
  title: string;
  subtitle: string;
  category: ProjectCategory;
  location: string;
  area: string;
  parcelArea?: string;
  levels?: string;
  status: ProjectStatus;
  statusYear?: string;
  heroImage: string;
  heroImage8k?: string;
  has8kMasters?: boolean;
  slogan: string;
  memoria: string;
  engineeringChallenge?: string;
  keyFeatures: string[];
  materials: string[];
  detailedMaterials?: {
    name: string;
    spec: string;
    application: string;
  }[];
  gallery: ProjectMedia[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  scopeItems: string[];
  iconName: string;
}

export interface ValuePillar {
  number: string;
  title: string;
  description: string;
}

export interface SlideData {
  pageNumber: number; // 1 to 40
  formattedPage: string; // "001 / 039"
  sectionNumber?: string;
  sectionTitle?: string;
  slideTitle: string;
  subtitle?: string;
  bodyText?: string[];
  metaFields?: { label: string; value: string }[];
  category?: string;
  imageUrl?: string;
  imageCaption?: string;
  secondaryImages?: { url: string; label: string }[];
  isCover?: boolean;
  isSectionDivider?: boolean;
  isClosing?: boolean;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: ProjectCategory;
  location: string;
  estimatedArea: string;
  targetTimeline: string;
  budgetRange: string;
  comments: string;
}
