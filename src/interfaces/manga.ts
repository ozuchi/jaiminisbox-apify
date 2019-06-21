export interface ChapterLink {
  full_path: string
  chapter_name?: string
  chapter_id?: string
  chapter_number?: number
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
  full_path: string
}
