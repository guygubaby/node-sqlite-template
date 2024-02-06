import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { respFailed } from 'src/utils/resp'
import { createLogger } from 'src/utils/logger'
import { JWT_SECRET } from 'src/config'

const logger = createLogger('auth')

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token)
    return respFailed(res, logger, { err: new Error('Unauthorized'), msg: 'Unauthorized', statusCode: 401 })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    // @ts-expect-error ignore
    req.user = decoded.user
    next()
  }
  catch (err) {
    return respFailed(res, logger, { err, msg: 'Invalid token', statusCode: 403 })
  }
}
