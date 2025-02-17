import {Bud, factory} from '@repo/test-kit/bud'
import {beforeEach, describe, expect, it, vi} from 'vitest'

import Project from './index.js'

describe(`@roots/bud/services/project`, () => {
  let bud: Bud
  let project: Project

  beforeEach(async () => {
    vi.clearAllMocks()
    bud = await factory()
    project = new Project(() => bud)
  })

  it(`returns early if debug not set`, async () => {
    bud.context.args.debug = false
    const infoSpy = vi.spyOn(bud, `info`)
    const pathSpy = vi.spyOn(bud, `path`)

    await project.buildAfter(bud)

    expect(pathSpy).not.toHaveBeenCalled()
    expect(infoSpy).toHaveBeenCalledWith(
      `--debug not \`true\`. skipping fs write.`,
    )
  })
})
