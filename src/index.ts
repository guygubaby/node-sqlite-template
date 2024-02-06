import process from 'node:process'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createLogger } from './utils/logger'
import { userRouter } from './routes/user'
import { pingRouter } from './routes/ping'

dotenv.config({
  path: ['.env', '.env.local'],
})

const morganLog4js = createLogger('morgan')

const logger = morgan('tiny', {
  stream: {
    write: (str: string) => {
      morganLog4js.debug(str.replace(/\r?\n/g, ''))
    },
  },
})

const app = express()

app.use(logger)
app.use(express.json())
app.use(cors())

app.use('', pingRouter)
app.use('/user', userRouter)

const sysLogger = createLogger('system')

const PORT = process.env.PORT || 3334

async function bootstrap() {
  app.listen(PORT, () => sysLogger.info(`Server is running on port ${PORT}`))
}

bootstrap()
