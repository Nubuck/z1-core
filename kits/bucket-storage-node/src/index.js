import Fd from 'form-data'
import { DownloaderHelper as Dl } from 'node-downloader-helper'
import { withRest as wr } from './main'
export const withRest = wr
export const DownloaderHelper = Dl
export const FormData = Fd
const bsn = {
  withRest,
  FormData,
  Downloader: DownloaderHelper,
}
export default bsn
