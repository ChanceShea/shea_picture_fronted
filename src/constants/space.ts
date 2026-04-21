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
