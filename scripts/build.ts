import { join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { renderFile } from 'ejs'
import { load } from 'js-yaml'

const dist = join(__dirname, '../dist')
const emojis = load(readFileSync(join(__dirname, '../src/emoji.yaml')))
const behaviors = await renderFile(join(__dirname, '../src/behaviors.dsti.ejs'), { emojis })
const deviceTree = await renderFile(join(__dirname, '../src/device-tree.dsti.ejs'))

writeFileSync(join(dist, 'behaviors.dsti'), behaviors)
writeFileSync(join(dist, 'device-tree.dsti'), deviceTree)
