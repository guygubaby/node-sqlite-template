import type { Response } from 'express'
import type { Logger } from 'log4js'

export function respSuccess<T extends object>(
  res: Response,
  logger: Logger,
  { msg = '', data }: { msg?: string, data?: T },
  { silent = false }: { silent?: boolean } = {},
) {
  const requestId = res.get('X-Request-Id')

  if (!silent && msg)
    logger.info(`${requestId ? `[${requestId}] ` : ''}${msg}`)

  res.status(200).json({
    message: msg,
    data,
  })
}

export function respFailed(
  res: Response,
  logger: Logger,
  { msg = '', statusCode = 500, err = {} }: { msg?: string, statusCode?: number, err?: any },
) {
  const requestId = res.get('X-Request-Id')

  const errMsg = `${requestId ? `[${requestId}] ` : ''}${msg}`
  logger.error(errMsg)

  res.status(statusCode).json({ message: msg, err })
}
