// services
import mail from './mail'
import mailDelivery from './mail-delivery'
// main
export const parts = (ctx) => [mail(ctx), mailDelivery(ctx)]
export default parts
