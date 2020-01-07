import tools, { Fs, Execa } from '@z1/preset-tools'
import { task } from '@z1/preset-task'

// with babel
const babelCommand = task(t => (output = 'build') => {
  const libDir = tools.fs.cwd(__dirname, '..')
  const base = [
    `--presets ${libDir.path('node_modules', 'babel-preset-react')}`,
    `--plugins ${libDir.path(
      'node_modules',
      'babel-plugin-transform-object-rest-spread'
    )}`,
    '--no-babelrc',
    `-d ${output}`,
    `--ignore '*.test.js'`,
    `${tools.fs.path('src')}`,
  ]

  return t.tags.inlineLists`babel ${base}`
})

const bundleCommand = task(
  t => (entry, file, watch, external, target = 'web') => {
    const base = [
      '--entry',
      `${entry}/${file}`,
      '--output',
      `lib/${file}`,
      '--format',
      'cjs',
      `--target ${target}`,
    ]
    const flags = watch ? ['watch', ...base] : [...base]
    if (external) {
      flags.push('--external all')
    }
    return t.tags.inlineLists`microbundle ${flags}`
  }
)

async function compile(build = false, watch = false, external = false) {
  try {
    const entry = build ? 'build' : 'src'
    if (build) {
      const buildCmd = babelCommand('build')
      const build = await tools.execa.shell(buildCmd, { cwd: tools.fs.cwd() })
      process.stdout.write(`\nComplete building -> ${build.stdout}`)
    }
    const cmd = bundleCommand(entry, 'index.js', watch, external)
    const result = await tools.execa.shell(cmd, { cwd: tools.fs.cwd() })
    process.stdout.write(`\nComplete bundling -> ${result.stdout}`)
  } catch (e) {
    process.stdout.write(`\nError in quick compile -> ${e}`)
  }
}

export async function bundle() {
  await compile(false, false, false)
}

export async function bundleExternal() {
  await compile(false, false, true)
}

export async function bundleExternalNode() {
  await compile(false, false, true, 'node')
}

export async function bundleWatch() {
  await compile(false, true, true)
}

export async function buildBundle() {
  await compile(true, false, false)
}

export async function buildBundleExternal() {
  await compile(true, false, true)
}

export async function buildBundleWatch() {
  await compile(true, true, true)
}

const compileList = task(
  (t, a) => async (
    build = false,
    watch = false,
    external = false,
    target = 'web'
  ) => {
    const entry = build ? 'build' : 'src'
    const list = await tools.fs.listAsync(entry)
    if (build) {
      const buildCmd = babelCommand('build')
      const build = await tools.execa.shell(buildCmd, { cwd: tools.fs.cwd() })
      process.stdout.write(`\nComplete building -> ${build.stdout}`)
    }
    await a.map(list, 1, async file => {
      try {
        const result = await tools.execa.shell(
          bundleCommand(entry, file, watch, external, target),
          { cwd: tools.fs.cwd() }
        )
        process.stdout.write(`\nComplete bundling -> ${result.stdout}`)
      } catch (e) {
        process.stdout.write(`\nError in bundling -> ${e}`)
      }
    })
  }
)

export async function bundleMulti() {
  await compileList(false, false, false)
}

export async function bundleMultiExternal() {
  await compileList(false, false, true)
}

export async function bundleMultiExternalNode() {
  await compileList(false, false, true, 'node')
}

export async function bundleMultiWatch() {
  await compileList(false, true, true)
}

export async function buildBundleMulti() {
  await compileList(true, false, false)
}

export async function buildBundleMultiExternal() {
  await compileList(true, false, true)
}

export async function buildBundleMultiWatch() {
  await compileList(true, true, true)
}

export async function buildLib() {
  try {
    const buildCmd = babelCommand('lib')
    const build = await tools.execa.shell(buildCmd, { cwd: tools.fs.cwd() })
    process.stdout.write(`\nComplete building -> ${build.stdout}`)
  } catch (e) {
    process.stdout.write(`\nError in quick compile -> ${e}`)
  }
}
