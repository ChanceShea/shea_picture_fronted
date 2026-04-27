export const SPACE_LEVEL_ENUM = {
  NORMAL: 0,
  PROFESSION: 1,
  ULTIMATE: 2,
} as const

export const SPACE_LEVEL_MAP: Record<number, string> = {
  0: '普通版',
  1: '专业版',
  2: '旗舰版',
}

export const SPACE_LEVEL_OPTIONS = Object.keys(SPACE_LEVEL_MAP).map((key) => {
  const value = Number(key)
  return {
    label: SPACE_LEVEL_MAP[value],
    value: value,
  }
})

export const SPACE_TYPE_ENUM = {
  PRIVATE: 0,
  TEAM: 1,
}

export const SPACE_TYPE_MAP: Record<number, string> = {
  0: '私有空间',
  1: '团队空间',
}

export const SPACE_TYPE_OPTIONS = Object.keys(SPACE_TYPE_MAP).map((key) => {
  const value = Number(key)
  return {
    label: SPACE_TYPE_MAP[value],
    value: value,
  }
})

export const SPACE_ROLE_ENUM = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
}

export const SPACE_ROLE_MAP: Record<string, string> = {
  viewer: '浏览者',
  editor: '编辑者',
  admin: '管理员',
}

export const SPACE_ROLE_OPTIONS = Object.keys(SPACE_ROLE_MAP).map((key) => {
  const value = key
  return {
    label: SPACE_ROLE_MAP[value],
    value: value,
  }
})

export const SPACE_PERMISSION_ENUM = {
  SPACE_USER_MANAGER: 'spaceUser:manage',
  PICTURE_VIEW: 'picture:view',
  PICTURE_EDIT: 'picture:edit',
  PICTURE_UPLOAD: 'picture:upload',
  PICTURE_DELETE: 'picture:delete',
}
