import { Manga, MangaSummary, CloudscraperOptions } from '../interfaces';
export declare class JaiminisboxHelper {
    static parseMangaPage(mangaId: string, mangaUrl: string, pageContent: string): Manga;
    static getChapterPageUrls(pageContent: string, baseUrl: string, mangaId: string, chapterId: number): string[];
    static getChapterPageFileUrls(chapterPageUrls: string[], requestOptions: CloudscraperOptions): Promise<string[]>;
    static parseSearchResultsPage(pageContent: string): MangaSummary[];
    static getMangaUrl(baseUrl: string, mangaId: string): string;
    static getChapterUrl(baseUrl: string, mangaId: string, chapterId: number): string;
    static getPageUrl(baseUrl: string, mangaId: string, chapterId: number, pageNum: number | string): string;
    static getSearchUrl(baseUrl: string, query: string, limit?: number): string;
    static getChapterIdFromUrl(url: string): string | undefined;
    static getChapterNumberFromId(id: string | undefined): number | undefined;
}
