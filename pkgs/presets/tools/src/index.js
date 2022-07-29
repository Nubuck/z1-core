import execa from 'execa'
import fs from 'fs-jetpack'

export const Execa = execa
export const Fs = fs

const tools = { fs: Fs, execa }
export default tools
