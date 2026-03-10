// src/lib/activity/content-types.ts
export type ResourceType =
  | "case-study"
  | "article"
  | "slides"
  | "external"
  | "video";

export type ActivityLink = {
  title: string;
  url: string;
  description?: string;
  resourceType?: ResourceType;
};

export type ActivityMetaItem = {
  label: string;
  value: string;
  icon?: string;
};

export type ActivityListSection = {
  id: string;
  type: "list";
  title: string;
  items: string[];
};

export type ActivityTextSection = {
  id: string;
  type: "text";
  title: string;
  body: string[];
};

export type ActivityStepsSection = {
  id: string;
  type: "steps";
  title: string;
  steps: {
    title: string;
    duration?: string;
    body: string[];
    bullets?: string[];
  }[];
};

export type ActivityVideosSection = {
  id: string;
  type: "videos";
  title: string;
  items: {
    title: string;
    url: string;
    description?: string;
    thumbnailUrl?: string;
  }[];
};

export type ActivityLinksSection = {
  id: string;
  type: "links";
  title: string;
  items: ActivityLink[];
};

export type ActivityCardsSection = {
  id: string;
  type: "cards";
  title: string;
  cards: {
    title: string;
    items: string[];
  }[];
};

export type ActivitySection =
  | ActivityListSection
  | ActivityTextSection
  | ActivityStepsSection
  | ActivityVideosSection
  | ActivityLinksSection
  | ActivityCardsSection;

export type ActivityContent = {
  slug: string;
  title: string;
  moduleLabel: string;
  intro?: string;
  meta: ActivityMetaItem[];
  sections: ActivitySection[];
};
