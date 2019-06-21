import cloudscraper from 'cloudscraper'
import { CloudscraperOptions } from '../interfaces'

export class RequestHelper {
  static async getRaw(uri: string, options: CloudscraperOptions = {}): Promise<string> {
    return await cloudscraper({ ...options, uri })
  }

  static async getJson(uri: string, options: CloudscraperOptions = {}): Promise<object> {
    const res = await this.getRaw(uri, options)
    return JSON.parse(res)
  }

  static async getBuffer(uri: string, options: CloudscraperOptions = {}): Promise<Buffer> {
    const res = await cloudscraper({ ...options, uri, encoding: null }) // <Buffer ff d8 ... >
    return res as Buffer
  }
}
