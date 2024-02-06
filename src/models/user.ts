import type { Prisma } from '@prisma/client'
import { prisma } from 'src/db'

export const UserModel = prisma.user

export type IUser = Prisma.UserCreateInput
