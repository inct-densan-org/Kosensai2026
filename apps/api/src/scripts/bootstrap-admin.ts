import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { createPlaceholderEmail } from '@kosensai/shared'
import { db } from '../db/client'
import { user } from '../db/schema'
import { auth } from '../lib/auth'

const promptNonEmpty = async (
  readline: ReturnType<typeof createInterface>,
  message: string
) => {
  while (true) {
    const value = (await readline.question(message)).trim()

    if (value.length > 0) {
      return value
    }

    console.log('入力は必須です。')
  }
}

const promptPassword = async (readline: ReturnType<typeof createInterface>) => {
  while (true) {
    const password = await readline.question('初期パスワード: ')
    const confirmation = await readline.question('初期パスワード(確認): ')

    if (password.length === 0) {
      console.log('パスワードは必須です。')
      continue
    }

    if (password !== confirmation) {
      console.log('パスワードが一致しません。')
      continue
    }

    return password
  }
}

const promptConfirmation = async (
  readline: ReturnType<typeof createInterface>,
  loginId: string,
  name: string
) => {
  while (true) {
    const answer = (await readline.question(
      `管理者 ${name} (${loginId}) を作成しますか？ [y/N]: `
    )).trim().toLowerCase()

    if (answer === 'y' || answer === 'yes') {
      return true
    }

    if (answer === '' || answer === 'n' || answer === 'no') {
      return false
    }

    console.log('y もしくは n で入力してください。')
  }
}

const main = async () => {
  const existingUser = db.select({ id: user.id }).from(user).limit(1).get()

  if (existingUser) {
    console.error('既存ユーザーが存在するため、初期管理者の投入は実行できません。')
    process.exitCode = 1
    return
  }

  const readline = createInterface({ input, output })

  try {
    console.log('初期管理者を作成します。')

    const loginId = await promptNonEmpty(readline, 'ログインID: ')
    const name = await promptNonEmpty(readline, '表示名: ')
    const password = await promptPassword(readline)
    const shouldCreate = await promptConfirmation(readline, loginId, name)

    if (!shouldCreate) {
      console.log('作成を中止しました。')
      return
    }

    const result = await auth.api.signUpEmail({
      headers: new Headers(),
      body: {
        name,
        email: createPlaceholderEmail(loginId),
        password,
        username: loginId,
        displayUsername: name,
        role: 'admin'
      }
    } as Parameters<typeof auth.api.signUpEmail>[0])

    console.log('初期管理者を作成しました。')
    console.log(`userId: ${result.user.id}`)
    console.log(`loginId: ${loginId}`)
    console.log('role: admin')
  } finally {
    readline.close()
  }
}

void main().catch(error => {
  console.error('初期管理者の作成に失敗しました。')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
