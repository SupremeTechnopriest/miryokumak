import { join } from 'node:path'
import { writeFileSync } from 'node:fs'
import { renderFile } from 'ejs'
import { characters } from '../src/emoji.toml'

const keycodeFromHexByte = (hexbyte: string) => /\d/.test(hexbyte) 
  ? `N${hexbyte}`
  : hexbyte.toUpperCase()

const keystrokeFromKeycode = (keycode: string) => `&kp ${keycode}`

function keystrokesFromUnicode (char: string) {
  const codePoint = char.codePointAt(0)?.toString(16) ?? ''
  return codePoint?.split('').map(hexByte => {
    const keycode = keycodeFromHexByte(hexByte)
    return keystrokeFromKeycode(keycode)
  }).join(' ')
}

const emojis: Record<string, string | string[]> = {}
const unicode = [
  ...Object.entries(characters)
]

for (const [key, value] of unicode) {
  const keystrokes = Array.isArray(value)
    ? value.map(keystrokesFromUnicode)
    : keystrokesFromUnicode(value as string)

  if (keystrokes) emojis[key] = keystrokes
}

const dist = join(import.meta.dir, '../dist')
const deviceTree = await renderFile(join(import.meta.dir, '../src/device-tree.dtsi.ejs'), { emojis })

writeFileSync(join(dist, 'device-tree.dtsi'), deviceTree)
