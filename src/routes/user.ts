import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createLogger } from 'src/utils/logger'
import { respFailed, respSuccess } from 'src/utils/resp'
import { JWT_SECRET } from 'src/config'
import { UserModel } from 'src/models/user'
import { authMiddleware } from 'src/middlewares/auth'

export const userRouter = Router()

const logger = createLogger('user route')

userRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await UserModel.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
      },
    })
    respSuccess(res, logger, { data: users })
  }
  catch (error) {
    respFailed(res, logger, { err: error })
  }
})

userRouter.post('/check-token', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return respFailed(res, logger, {
      msg: 'Token not found',
      statusCode: 404,
    })
  }

  try {
    jwt.verify(token, JWT_SECRET)
    respSuccess(res, logger, { msg: 'Token valid' })
  }
  catch (error) {
    respFailed(res, logger, { err: error, statusCode: 403 })
  }
})

userRouter.post('/register', async (req, res) => {
  const { phone, name, password } = req.body

  const existUser = await UserModel.findUnique({
    where: {
      phone,
    },
  })

  if (existUser) {
    return respFailed(res, logger, {
      msg: 'User already exists',
      statusCode: 403,
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await UserModel.create({
      data: {
        phone,
        name,
        password: hashedPassword,
      },
    })

    respSuccess(res, logger, { msg: 'Register success', data: user })
  }
  catch (error) {
    respFailed(res, logger, { err: error })
  }
})
