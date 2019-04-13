/* eslint-disable no-template-curly-in-string */
import test from 'ava'
import path from 'path'
import Variables from '../../lib'

const dirname = path.dirname(__dirname)

process.env.envReference = 'env var'

const args = {
  stage: 'dev',
}

test('throw if self not found', async (t) => {
  const object = {
    value: '${opt:stage}-${foo}',
  }

  const vars = new Variables(object, {
    configDir: dirname
  })

  const error = await t.throws(vars.init(args))
  t.is(error.message, 'Invalid variable reference syntax for variable "foo" ${opt:stage}-${foo}')
})

test('throw if opt not found', async (t) => {
  const object = {
    value: '${opt:what}',
  }

  const vars = new Variables(object, {
    configDir: dirname
  })

  const error = await t.throws(vars.init(args))
  t.regex(error.message, /Variable not found/)
})

// Nested fallbacks ACCESS_TOKEN = "${file(asyncValue.js, ${env:MY_SECxRET, 'hi'}, ${self:sharedValue})}"
