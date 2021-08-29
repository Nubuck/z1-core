//parts
import './tree.scss'
import { nodeRules as nr } from './node-rules'
import { proTreeTheme, treeProps } from './treeProps'

// main
export const proTree = {
  theme: proTreeTheme,
  treeProps,
  rules: nr,
}
