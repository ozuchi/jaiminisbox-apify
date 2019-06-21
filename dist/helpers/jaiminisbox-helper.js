"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const cheerio = __importStar(require("cheerio"));
const Apify_1 = __importDefault(require("Apify"));
class JaiminisboxHelper {
    static parseMangaPage(mangaId, mangaUrl, pageContent) {
        const $ = cheerio.load(pageContent);
        const chapterLinks = [];
        $('.list .group .element').each((i, el) => {
            const $item = cheerio.load(el);
            const href = $item('.title a').attr('href');
            if (href) {
                chapterLinks.push({
                    relative_path: href,
                });
            }
        });
        const manga = {
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
        };
        return manga;
    }
    static getChapterPageUrls(pageContent, baseUrl, mangaId, chapterId) {
        const $ = cheerio.load(pageContent);
        const chapterPageUrls = [];
        $('.topbar .topbar_right select.selecto option').each((i, el) => {
            const optionNum = $(el).text();
            const url = JaiminisboxHelper.getPageUrl(baseUrl, mangaId, chapterId, optionNum);
            chapterPageUrls.push(url);
        });
        return chapterPageUrls;
    }
    static getChapterPageFileUrls(chapterPageUrls, requestOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getChapterPageFileUrls triggered.');
            let userAgentOverride;
            if (requestOptions.headers && requestOptions.headers['User-Agent']) {
                userAgentOverride = requestOptions.headers['User-Agent'];
            }
            const pageFileUrls = [];
            const pageFileItem = [];
            const requestList = new Apify_1.default.RequestList({
                sources: lodash_1.map(chapterPageUrls, (url) => ({ url })),
            });
            yield requestList.initialize();
            const crawler = new Apify_1.default.PuppeteerCrawler({
                requestList,
                handlePageFunction: ({ request, response, page }) => __awaiter(this, void 0, void 0, function* () {
                    const imageUrl = yield page.$$eval('#page img.open', (elements) => elements[0].src);
                    pageFileItem.push({ url: request.url, imageUrl });
                }),
                maxRequestsPerCrawl: 100,
                maxConcurrency: 10,
                maxRequestRetries: 1,
                launchPuppeteerOptions: {
                    userAgent: userAgentOverride,
                },
            });
            yield crawler.run();
            for (const pageUrl of chapterPageUrls) {
                const targetItem = lodash_1.find(pageFileItem, (item) => item.url === pageUrl);
                if (targetItem) {
                    pageFileUrls.push(targetItem.imageUrl);
                }
            }
            return pageFileUrls;
        });
    }
    static parseSearchResultsPage(pageContent) {
        throw new Error('Not implemented.');
    }
    static getMangaUrl(baseUrl, mangaId) {
        return baseUrl + '/reader/series/' + mangaId;
    }
    static getChapterUrl(baseUrl, mangaId, chapterId) {
        return baseUrl + '/reader/read/' + mangaId + '/en/0/' + chapterId + '/page/1';
    }
    static getPageUrl(baseUrl, mangaId, chapterId, pageNum) {
        return baseUrl + '/reader/read/' + mangaId + '/en/0/' + chapterId + '/page/' + pageNum;
    }
    static getSearchUrl(baseUrl, query, limit = 100) {
        throw new Error('Not implemented.');
    }
}
exports.JaiminisboxHelper = JaiminisboxHelper;
//# sourceMappingURL=jaiminisbox-helper.js.map