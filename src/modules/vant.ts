import { Dialog } from 'vant'
import { UserModule } from '@/types'

export const install: UserModule = ({ app }) => {
  app.use(Dialog)
}
