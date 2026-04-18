export type Episode = {
  id: string;
  title: string;
  audioUrl: string;
  published: string;
  description?: string;
  duration?: number | null;
  image?: string | null;
};

export type Podcast = {
  id: string;
  title: string;
  author?: string;
  image?: string;
  description?: string;
  feedUrl: string;
};