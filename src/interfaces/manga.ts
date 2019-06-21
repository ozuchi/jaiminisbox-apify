export interface ChapterLink {
  relative_path: string
}

export interface Manga {
  id: string
  url: string
  title: string
  image_url: string
  synopsis: string
  chapter_links: ChapterLink[]
}

export interface MangaSummary {
  title: string
  image_url: string
  relative_path: string
}
