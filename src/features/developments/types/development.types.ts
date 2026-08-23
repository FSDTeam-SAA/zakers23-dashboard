export type ConstructionStage = "pre-construction" | "under construction" | "move in ready";
export type DevelopmentCategory = "waterfront" | "luxury";
export type ResidenceStatus = "available" | "sold";

export type DevelopmentResidence = {
  residenceType: string;
  bedrooms: string;
  bathrooms: string;
  interiorSize: string;
  terraceSize: string;
  startingPrice: number;
  status: ResidenceStatus;
  floorPlan: string;
};

export type DetailImage = { url: string; alt?: string; index?: number };
export type KeyFact = { label: string; value: string; description?: string };
export type DevelopmentDetailPage = {
  keyFacts?: KeyFact[];
  editorialSections?: { eyebrow?: string; title: string; body: string; image?: string; imagePosition?: "left" | "right" }[];
  highlights?: { title: string; description?: string; icon?: string }[];
  gallery?: DetailImage[];
  location?: { title?: string; description?: string; latitude?: number; longitude?: number; mapEmbedUrl?: string; neighbourhoodImages?: DetailImage[] };
  amenitiesSection?: { title?: string; description?: string; coverImage?: string; items?: { name: string; description?: string; icon?: string }[] };
  tourCta?: { title?: string; description?: string; backgroundImage?: string; buttonLabel?: string; buttonUrl?: string };
  agent?: { name: string; title?: string; photo?: string; bio?: string; phone?: string; email?: string; licence?: string; company?: string; stats?: KeyFact[] };
  relatedDevelopments?: { developmentName: string; propertySlug?: string; image: string; location?: string; startingPrice?: number }[];
};

export type Development = {
  _id: string;
  developmentName: string;
  propertySlug: string;
  selectedNeighbourhood: string | { _id: string; name: string; location?: { city?: string } };
  address: string;
  city: string;
  startingPrice: number;
  constructionStage: ConstructionStage;
  deliveryYear: string;
  developer: string;
  pricePerSqft: number;
  bedrooms: string;
  stories: number;
  totalResidencies: number;
  sizeRange: string;
  heroImage: string;
  galleryImages: { url: string; index: number }[];
  projectOverview: string;
  shortIntroduction: string;
  amenities: string[];
  category: DevelopmentCategory[];
  features: string[];
  depositStructure: string;
  salesProgress: string;
  rentalPolicy: string;
  residences: DevelopmentResidence[];
  currentStage?: string;
  expectedDelivery?: string;
  detailPage?: DevelopmentDetailPage;
  createdAt: string;
  updatedAt: string;
};

export type DevelopmentPayload = Omit<Development, "_id" | "createdAt" | "updatedAt">;

export type DevelopmentFilters = Partial<{
  developmentName: string;
  city: string;
  selectedNeighbourhood: string;
  constructionStage: ConstructionStage;
  category: string;
  amenities: string;
  features: string;
}>;
