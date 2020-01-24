import z from '@z1/lib-feature-box'
import el from '@z1/lib-ui-box-elements'

// elements
import { Form } from './Form'
import { IconLabel } from './IconLabel'
import { ListItem } from './ListItem'
import { Logo } from './Logo'
import { Modal } from './Modal'
import { Page } from './Page'
import { VList } from './VList'

// main
export const ui = {
  ...el,
  Link: z.ui.Link,
  NavLink: z.ui.NavLink,
  Form,
  IconLabel,
  ListItem,
  Logo,
  Modal,
  Page,
  VList,
}
