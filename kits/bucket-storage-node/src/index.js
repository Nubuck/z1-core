import FormData from 'form-data'
import { DownloaderHelper } from 'node-downloader-helper'
import { withRest } from './main'
export const ma = {
  withRest,
  FormData,
  Downloader: DownloaderHelper,
}
export default ma
