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
    const users = await UserModel.findMany()
    respSuccess(res, logger, { data: users })
  }
  catch (error) {
    respFailed(res, logger, { err: error })
  }
})

userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await UserModel.findUnique({
    where: {
      phone: username,
      name: username,
    },
  })

  if (!user) {
    return respFailed(res, logger, {
      msg: 'User not found',
      statusCode: 404,
    })
  }

  // bcrypt.compare(password, user.password, (err, result) => {
  //   if (err) {
  //     return respFailed(res, logger, {
  //       err,
  //       msg: 'Internal server error',
  //       statusCode: 500,
  //     })
  //   }

  //   if (!result) {
  //     return respFailed(res, logger, {
  //       msg: 'Invalid password',
  //       statusCode: 403,
  //     })
  //   }

  //   const token = jwt.sign(
  //     {
  //       user,
  //     },
  //     JWT_SECRET,
  //     { expiresIn: '7d', algorithm: 'HS256' },
  //   )

  //   respSuccess(res, logger, { msg: 'Login success', data: { token, user } })
  // })
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
  const { username, password, nickname } = req.body
  const user = await UserModel.findUnique({
    where: {
      phone: username,
      name: username,
    },
  })

  if (user) {
    return respFailed(res, logger, {
      msg: 'User already exist',
      statusCode: 409,
    })
  }

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return respFailed(res, logger, {
        err,
        msg: 'Internal server error',
        statusCode: 500,
      })
    }

    const user = new UserModel({
      username,
      password: hash,
      nickname,
    })

    await user.save()

    respSuccess(res, logger, { msg: 'Register success' })
  })
})
