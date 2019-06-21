"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const helpers_1 = require("./helpers");
const version = require('../package.json').version;
const DEFAULT_OPTIONS = {
    baseUrl: 'https://jaiminisbox.com',
    requestOptions: {},
};
class JaiminisboxApify {
    constructor(options = {}) {
        this.options = lodash_1.merge({}, DEFAULT_OPTIONS, options);
        this.validateOptionalParameters();
    }
    static get VERSION() {
        return version;
    }
    getManga(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = helpers_1.JaiminisboxHelper.getMangaUrl(this.options.baseUrl, mangaId);
            const pageContent = yield helpers_1.RequestHelper.getRaw(url, this.options.requestOptions);
            return helpers_1.JaiminisboxHelper.parseMangaPage(mangaId, url, pageContent);
        });
    }
    getChapter(chapterId, mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapterUrl = helpers_1.JaiminisboxHelper.getChapterUrl(this.options.baseUrl, mangaId, chapterId);
            const pageContent = yield helpers_1.RequestHelper.getRaw(chapterUrl, this.options.requestOptions);
            const pageUrls = helpers_1.JaiminisboxHelper.getChapterPageUrls(pageContent, this.options.baseUrl, mangaId, chapterId);
            const pageFileUrls = yield helpers_1.JaiminisboxHelper.getChapterPageFileUrls(pageUrls, this.options.requestOptions);
            const chapter = {
                id: chapterId,
                url: chapterUrl,
                page_urls: pageFileUrls,
            };
            return chapter;
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented.');
        });
    }
    validateOptionalParameters() {
    }
}
exports.JaiminisboxApify = JaiminisboxApify;
//# sourceMappingURL=jaiminisbox-apify.js.map