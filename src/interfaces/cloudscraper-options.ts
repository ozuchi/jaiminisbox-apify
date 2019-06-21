import { CoreOptions } from 'request'

export interface CloudscraperOptions extends CoreOptions {
  uri?: string
  cloudflareTimeout?: number
  followAllRedirects?: boolean
  challengesToSolve?: number
  decodeEmails?: boolean
}
