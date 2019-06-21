import { map, find } from 'lodash'
import * as cheerio from 'cheerio'
import Apify from 'Apify'
import { Manga, ChapterLink, Chapter, MangaSummary, CloudscraperOptions } from '../interfaces'

export class JaiminisboxHelper {
  static parseMangaPage(mangaId: string, mangaUrl: string, pageContent: string): Manga {
    const $ = cheerio.load(pageContent)

    const chapterLinks: ChapterLink[] = []
    $('.list .group .element').each((i: number, el: any) => {
      const $item = cheerio.load(el)
      const href = $item('.title a').attr('href')
      const chapterName = $item('.title a').text()
      const chapterId = JaiminisboxHelper.getChapterIdFromUrl(href)
      const chapterNumber = JaiminisboxHelper.getChapterNumberFromId(chapterId)

      if (href) {
        chapterLinks.push({
          full_path: href,
          chapter_name: chapterName,
          chapter_id: chapterId,
          chapter_number: chapterNumber,
        })
      }
    })

    const manga: Manga = {
      id: mangaId,
      url: mangaUrl,
      title: $('.comic.info .comic .title')
        .text()
        .replace(/(\r\n|\n|\r)/gm, ''),
      image_url: $('.comic.info .thumbnail img').attr('src'),
      synopsis: $('.comic.info .comic .info')
        .text()
        .replace(/(\r\n|\n|\r)/gm, ''),
      chapter_links: chapterLinks,
    }
    return manga
  }

  static getChapterPageUrls(pageContent: string, baseUrl: string, mangaId: string, chapterId: number): string[] {
    // throw new Error('Not implemented.')
    const $ = cheerio.load(pageContent)

    const chapterPageUrls: string[] = []
    $('.topbar .topbar_right select.selecto option').each((i: number, el: any) => {
      const optionNum = $(el).text()
      // TODO: make this into helper
      const url = JaiminisboxHelper.getPageUrl(baseUrl, mangaId, chapterId, optionNum)
      chapterPageUrls.push(url)
    })

    return chapterPageUrls
  }

  static async getChapterPageFileUrls(chapterPageUrls: string[], requestOptions: CloudscraperOptions): Promise<string[]> {
    console.log('getChapterPageFileUrls triggered.')

    let userAgentOverride: string | undefined
    if (requestOptions.headers && requestOptions.headers['User-Agent']) {
      userAgentOverride = requestOptions.headers['User-Agent']
    }
    const pageFileUrls: string[] = []
    const pageFileItem: any[] = []

    // Arrange
    const requestList = new Apify.RequestList({
      sources: map(chapterPageUrls, (url: string) => ({ url })),
    })
    await requestList.initialize()

    // Act
    const crawler = new Apify.PuppeteerCrawler({
      requestList,
      handlePageFunction: async ({ request, response, page }: any) => {
        // console.log(`> Processing [${request.url}]...`)
        const imageUrl = await page.$$eval('#page img.open', (elements: any[]) => elements[0].src)
        pageFileItem.push({ url: request.url, imageUrl })
      },
      maxRequestsPerCrawl: 100,
      maxConcurrency: 10,
      maxRequestRetries: 1,
      launchPuppeteerOptions: {
        userAgent: userAgentOverride,
      },
    })
    await crawler.run()

    // Sort order
    for (const pageUrl of chapterPageUrls) {
      const targetItem = find(pageFileItem, (item: any) => item.url === pageUrl)
      if (targetItem) {
        pageFileUrls.push(targetItem.imageUrl)
      }
    }

    return pageFileUrls
  }

  static parseSearchResultsPage(pageContent: string): MangaSummary[] {
    throw new Error('Not implemented.')
  }

  static getMangaUrl(baseUrl: string, mangaId: string): string {
    return baseUrl + '/reader/series/' + mangaId
  }

  static getChapterUrl(baseUrl: string, mangaId: string, chapterId: number): string {
    return baseUrl + '/reader/read/' + mangaId + '/en/0/' + chapterId + '/page/1'
  }

  static getPageUrl(baseUrl: string, mangaId: string, chapterId: number, pageNum: number | string): string {
    return baseUrl + '/reader/read/' + mangaId + '/en/0/' + chapterId + '/page/' + pageNum
  }

  static getSearchUrl(baseUrl: string, query: string, limit = 100): string {
    throw new Error('Not implemented.')
  }

  static getChapterIdFromUrl(url: string): string | undefined {
    /**
     * Turn 'https://jaiminisbox.com/reader/read/dr-stone/en/0/109/'
     * into '109'
     */
    const matchArr = url.match(/\/en\/0\/([0-9]{1,8})\//i)
    if (!matchArr || matchArr.length < 2) {
      return undefined
    }
    return matchArr[1]
  }

  static getChapterNumberFromId(id: string | undefined): number | undefined {
    /**
     * Turn '109'
     * into 109
     */
    if (!id) {
      return undefined
    }
    return parseFloat(id)
  }
}
