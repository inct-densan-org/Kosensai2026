import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline'
import { createPlaceholderEmail } from '@kosensai/shared'
import { db } from '../db/client'
import { user } from '../db/schema'
import { auth } from '../lib/auth'

const ask = async (message: string) => {
  const rl = createInterface({ input, output })

  try {
    return await rl.question(message)
  } finally {
    rl.close()
  }
}

const askRequired = async (message: string) => {
  while (true) {
    const value = (await ask(message)).trim()

    if (value.length > 0) {
      return value
    }

    console.log('入力は必須です。')
  }
}

const askHidden = async (message: string) => {
  if (!input.isTTY || !output.isTTY) {
    return ask(message)
  }

  readline.emitKeypressEvents(input)

  return await new Promise<string>(resolve => {
    const previousRawMode = input.isRaw ?? false
    let value = ''

    output.write(message)
    input.setRawMode(true)
    input.resume()

    const finish = () => {
      input.removeListener('keypress', handleKeypress)
      input.setRawMode(previousRawMode)
      output.write('\n')
      resolve(value)
    }

    const abort = () => {
      input.removeListener('keypress', handleKeypress)
      input.setRawMode(previousRawMode)
      output.write('\n')
      process.kill(process.pid, 'SIGINT')
    }

    const handleKeypress = (char: string, key: readline.Key) => {
      if (key.ctrl && key.name === 'c') {
        abort()
        return
      }

      if (key.name === 'return' || key.name === 'enter') {
        finish()
        return
      }

      if (key.name === 'backspace') {
        value = value.slice(0, -1)
        return
      }

      if (char) {
        value += char
      }
    }

    input.on('keypress', handleKeypress)
  })
}

const askPasswordWithConfirmation = async () => {
  while (true) {
    const password = await askHidden('初期パスワード: ')
    const confirmation = await askHidden('初期パスワード(確認): ')

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

const askConfirmation = async (loginId: string, name: string) => {
  while (true) {
    const answer = (await ask(
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

  console.log('初期管理者を作成します。')

  const loginId = await askRequired('ログインID: ')
  const name = await askRequired('表示名: ')
  const password = await askPasswordWithConfirmation()
  const shouldCreate = await askConfirmation(loginId, name)

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
}

void main().catch(error => {
  console.error('初期管理者の作成に失敗しました。')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
