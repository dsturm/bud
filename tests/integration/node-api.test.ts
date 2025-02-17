import {paths} from '@repo/constants'
import {execa} from 'execa'
import fs from 'fs-extra'
import {join} from 'path'
import {beforeAll, describe, expect, it} from 'vitest'

const exampleProjectDir = `${paths.root}/examples/node-api`
const tmpProjectDir = `${paths.root}/storage/mocks/yarn/@examples/node-api`

describe.skip(`node-api`, () => {
  beforeAll(async () => {
    try {
      await fs.remove(tmpProjectDir)
      await fs.copy(exampleProjectDir, tmpProjectDir)
      await execa(
        `yarn`,
        [`install`, `--registry=http://localhost:4873`],
        {
          cwd: tmpProjectDir,
        },
      )
      await execa(`node`, [`node_modules/.bin/webpack`], {
        cwd: tmpProjectDir,
      })
    } catch (error) {
      throw error
    }
  })

  it(`package.json`, async () => {
    const artifact = (
      await fs.readFile(join(tmpProjectDir, `package.json`), `utf8`)
    ).toString()

    expect(artifact).toMatchSnapshot()
  })

  it(`dist/manifest.json`, async () => {
    const artifact = await fs.readFile(
      join(tmpProjectDir, `dist/manifest.json`),
    )
    expect(artifact.toString()).toMatchSnapshot()
  })

  it(`dist/app.js`, async () => {
    const artifact = await fs.readFile(
      join(tmpProjectDir, `dist/js/app.js`),
    )
    expect(artifact.toString()).toMatchSnapshot()
  })
}, 240000)
