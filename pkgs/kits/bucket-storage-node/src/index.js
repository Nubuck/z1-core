import Fd from 'form-data'
import { DownloaderHelper as Dl } from 'node-downloader-helper'
import got from 'got'
import { withRest as wr } from './main'
// output
export const withRest = wr
export const DownloaderHelper = Dl
export const FormData = Fd
const bsn = {
  withRest,
  FormData,
  Downloader: DownloaderHelper,
  got,
}
export default bsn
