import { merge } from 'lodash'
import { CloudscraperOptions, Manga, Chapter, MangaSummary } from './interfaces'
import { RequestHelper, JaiminisboxHelper } from './helpers'

const version = require('../package.json').version // tslint:disable-line

export interface JaiminisboxApifyOptions {
  baseUrl?: string
  requestOptions?: CloudscraperOptions
}

const DEFAULT_OPTIONS: JaiminisboxApifyOptions = {
  baseUrl: 'https://jaiminisbox.com',
  requestOptions: {},
}

export class JaiminisboxApify {
  private options: JaiminisboxApifyOptions

  constructor(options: JaiminisboxApifyOptions = {}) {
    // Associate optional properties
    this.options = merge({}, DEFAULT_OPTIONS, options)
    this.validateOptionalParameters()
  }

  static get VERSION(): string {
    return version
  }

  async getManga(mangaId: string): Promise<Manga> {
    const url = JaiminisboxHelper.getMangaUrl(this.options.baseUrl!, mangaId)
    const pageContent = await RequestHelper.getRaw(url, this.options.requestOptions)
    return JaiminisboxHelper.parseMangaPage(mangaId, url, pageContent)
  }

  async getChapter(chapterId: number, mangaId: string): Promise<Chapter> {
    const chapterUrl = JaiminisboxHelper.getChapterUrl(this.options.baseUrl!, mangaId, chapterId)
    const pageContent = await RequestHelper.getRaw(chapterUrl, this.options.requestOptions)
    const pageUrls = JaiminisboxHelper.getChapterPageUrls(pageContent, this.options.baseUrl!, mangaId, chapterId)
    const pageFileUrls = await JaiminisboxHelper.getChapterPageFileUrls(pageUrls, this.options.requestOptions!)

    const chapter: Chapter = {
      id: chapterId,
      url: chapterUrl,
      page_urls: pageFileUrls,
    }

    return chapter
  }

  async search(query: string): Promise<MangaSummary[]> {
    throw new Error('Not implemented.')
  }

  private validateOptionalParameters() {
    // TODO
  }
}
