'use client'

import { useState } from 'react'
import { createUser, deleteUser, updateUser } from './client-api'
import type { CmsAdminUser, ShopOption, UserMutationPayload, UserRole, UsersPageData } from './types'
import { userRoles } from './types'

type UserFormState = {
  loginId: string
  name: string
  password: string
  role: UserRole
  shopId: string
}

const emptyCreateForm: UserFormState = {
  loginId: '',
  name: '',
  password: '',
  role: 'shop_staff',
  shopId: ''
}

const roleLabels: Record<UserRole, string> = {
  shop_staff: '屋台担当',
  committee: '実行委員',
  admin: '管理者'
}

const toCreatePayload = (form: UserFormState): UserMutationPayload => ({
  loginId: form.loginId.trim(),
  name: form.name.trim(),
  password: form.password,
  role: form.role,
  shopId: form.role === 'shop_staff' && form.shopId ? form.shopId : null
})

const toUpdatePayload = (form: UserFormState) => ({
  loginId: form.loginId.trim(),
  name: form.name.trim(),
  password: form.password || undefined,
  role: form.role,
  shopId: form.role === 'shop_staff' && form.shopId ? form.shopId : null
})

const toEditForm = (targetUser: CmsAdminUser): UserFormState => ({
  loginId: targetUser.loginId,
  name: targetUser.name,
  password: '',
  role: targetUser.role,
  shopId: targetUser.shopId ?? ''
})

const formatDateTime = (value: string) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

const UserFormFields = ({
  form,
  shops,
  disabled,
  onChange
}: {
  form: UserFormState
  shops: ShopOption[]
  disabled: boolean
  onChange: (nextForm: UserFormState) => void
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#374151]">ログインID</span>
        <input
          className="rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-[#111827] outline-none transition focus:border-[#9ca3af] focus:ring-2 focus:ring-[#e5e7eb]"
          value={form.loginId}
          disabled={disabled}
          onChange={event => onChange({ ...form, loginId: event.target.value })}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#374151]">表示名</span>
        <input
          className="rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-[#111827] outline-none transition focus:border-[#9ca3af] focus:ring-2 focus:ring-[#e5e7eb]"
          value={form.name}
          disabled={disabled}
          onChange={event => onChange({ ...form, name: event.target.value })}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#374151]">権限</span>
        <select
          className="rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-[#111827] outline-none transition focus:border-[#9ca3af] focus:ring-2 focus:ring-[#e5e7eb]"
          value={form.role}
          disabled={disabled}
          onChange={event => onChange({
            ...form,
            role: event.target.value as UserRole,
            shopId: event.target.value === 'shop_staff' ? form.shopId : ''
          })}
        >
          {userRoles.map(role => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-[#374151]">担当屋台</span>
        <select
          className="rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-[#111827] outline-none transition focus:border-[#9ca3af] focus:ring-2 focus:ring-[#e5e7eb] disabled:bg-[#f3f4f6]"
          value={form.shopId}
          disabled={disabled || form.role !== 'shop_staff'}
          onChange={event => onChange({ ...form, shopId: event.target.value })}
        >
          <option value="">未設定</option>
          {shops.map(shop => (
            <option key={shop.code} value={shop.code}>
              {shop.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 md:col-span-2">
        <span className="text-sm font-medium text-[#374151]">パスワード</span>
        <input
          type="password"
          className="rounded-md border border-[#d1d5db] bg-white px-3 py-2.5 text-[#111827] outline-none transition focus:border-[#9ca3af] focus:ring-2 focus:ring-[#e5e7eb]"
          value={form.password}
          disabled={disabled}
          onChange={event => onChange({ ...form, password: event.target.value })}
        />
      </label>
    </div>
  )
}

export const UserManagementPage = ({
  initialData,
  currentUserId
}: {
  initialData: UsersPageData
  currentUserId: string
}) => {
  const [users, setUsers] = useState(initialData.users)
  const [createForm, setCreateForm] = useState<UserFormState>(emptyCreateForm)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<UserFormState | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [pageMessage, setPageMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [busyUserId, setBusyUserId] = useState<string | null>(null)

  const handleCreate = async () => {
    setCreateError(null)
    setPageMessage(null)
    setSubmitting(true)

    try {
      const createdUser = await createUser(toCreatePayload(createForm))
      setUsers(currentUsers => [...currentUsers, createdUser].sort((left, right) => left.loginId.localeCompare(right.loginId, 'ja')))
      setCreateForm(emptyCreateForm)
      setPageMessage('ユーザーを作成しました')
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'ユーザーの作成に失敗しました')
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (targetUser: CmsAdminUser) => {
    setEditingUserId(targetUser.id)
    setEditForm(toEditForm(targetUser))
    setPageMessage(null)
  }

  const handleUpdate = async (userId: string) => {
    if (!editForm) {
      return
    }

    setPageMessage(null)
    setBusyUserId(userId)

    try {
      const updatedUser = await updateUser(userId, toUpdatePayload(editForm))
      setUsers(currentUsers => currentUsers.map(currentUser => currentUser.id === userId ? updatedUser : currentUser))
      setEditingUserId(null)
      setEditForm(null)
      setPageMessage('ユーザー情報を更新しました')
    } catch (error) {
      setPageMessage(error instanceof Error ? error.message : 'ユーザーの更新に失敗しました')
    } finally {
      setBusyUserId(null)
    }
  }

  const handleDelete = async (targetUser: CmsAdminUser) => {
    const confirmed = window.confirm(`「${targetUser.name}」を削除します。元に戻せません。`)

    if (!confirmed) {
      return
    }

    setPageMessage(null)
    setBusyUserId(targetUser.id)

    try {
      await deleteUser(targetUser.id)
      setUsers(currentUsers => currentUsers.filter(currentUser => currentUser.id !== targetUser.id))
      if (editingUserId === targetUser.id) {
        setEditingUserId(null)
        setEditForm(null)
      }
      setPageMessage('ユーザーを削除しました')
    } catch (error) {
      setPageMessage(error instanceof Error ? error.message : 'ユーザーの削除に失敗しました')
    } finally {
      setBusyUserId(null)
    }
  }

  return (
    <main className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-col gap-4 py-5 max-sm:w-[min(100%-20px,1180px)] max-sm:py-4">
      <section className="grid gap-2 rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <p className="m-0 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[#6b7280]">Admin CMS</p>
        <h1 className="m-0 text-[clamp(1rem,1.8vw,1.35rem)] leading-[1.25] tracking-[-0.01em] text-[#111827]">
          ユーザー管理
        </h1>
        <p className="m-0 max-w-[48rem] text-[0.88rem] leading-6 text-[#4b5563]">
          管理者、実行委員、屋台担当のユーザーをここで追加・編集・削除できます。CMS画面は常に最新状態を優先して更新します。
        </p>
      </section>

      <section className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
          <div>
            <h2 className="m-0 text-[1rem] font-semibold text-[#111827]">新規ユーザー作成</h2>
            <p className="mt-1 mb-0 text-sm text-[#6b7280]">パスワードは8文字以上で設定してください。</p>
          </div>
          <button
            type="button"
            className="rounded-md bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            onClick={() => void handleCreate()}
          >
            {submitting ? '作成中...' : 'ユーザーを追加'}
          </button>
        </div>

        <UserFormFields
          form={createForm}
          shops={initialData.shops}
          disabled={submitting}
          onChange={setCreateForm}
        />

        {createError ? <p className="mt-4 mb-0 text-sm text-[#b91c1c]">{createError}</p> : null}
        {pageMessage ? <p className="mt-4 mb-0 text-sm text-[#374151]">{pageMessage}</p> : null}
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-3 max-sm:flex-col max-sm:items-start">
          <div>
            <h2 className="m-0 text-[1rem] font-semibold text-[#111827]">登録ユーザー</h2>
            <p className="mt-1 mb-0 text-sm text-[#6b7280]">{users.length} 件</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white px-6 py-10 text-center text-[#6b7280]">
            まだユーザーが登録されていません。
          </div>
        ) : null}

        {users.map(targetUser => {
          const isEditing = editingUserId === targetUser.id && editForm
          const isBusy = busyUserId === targetUser.id

          return (
            <article
              key={targetUser.id}
              className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 max-md:flex-col">
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-[1rem] font-medium text-[#111827]">{targetUser.name}</h3>
                    <span className="rounded-md border border-[#d1d5db] bg-[#f9fafb] px-2.5 py-1 text-xs font-medium text-[#4b5563]">
                      {roleLabels[targetUser.role]}
                    </span>
                    {targetUser.id === currentUserId ? (
                      <span className="rounded-md border border-[#d1d5db] bg-[#f9fafb] px-2.5 py-1 text-xs font-medium text-[#4b5563]">
                        ログイン中
                      </span>
                    ) : null}
                  </div>
                  <p className="m-0 text-sm text-[#4b5563]">
                    ログインID: <span className="font-medium text-[#111827]">{targetUser.loginId}</span>
                  </p>
                  <p className="m-0 text-sm text-[#4b5563]">
                    担当屋台: <span className="font-medium text-[#111827]">{targetUser.shopId ?? '未設定'}</span>
                  </p>
                  <p className="m-0 text-sm text-[#6b7280]">更新: {formatDateTime(targetUser.updatedAt)}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition hover:bg-[#f9fafb]"
                    disabled={isBusy}
                    onClick={() => {
                      if (isEditing) {
                        setEditingUserId(null)
                        setEditForm(null)
                        return
                      }

                      startEdit(targetUser)
                    }}
                  >
                    {isEditing ? '閉じる' : '編集'}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isBusy || targetUser.id === currentUserId}
                    onClick={() => void handleDelete(targetUser)}
                  >
                    削除
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="mt-5 grid gap-4 border-t border-[#e5e7eb] pt-5">
                  <UserFormFields
                    form={editForm}
                    shops={initialData.shops}
                    disabled={isBusy}
                    onChange={nextForm => setEditForm(nextForm)}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="rounded-md bg-[#111827] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isBusy}
                      onClick={() => void handleUpdate(targetUser.id)}
                    >
                      {isBusy ? '保存中...' : '変更を保存'}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          )
        })}
      </section>
    </main>
  )
}
