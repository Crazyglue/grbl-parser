import { defineConfig } from 'vitest/config'
import { BaseSequencer } from 'vitest/node'

// mocha loaded `test/*` in shell-glob order and shared one module cache
// across files; the suite relies on both (the gcodeSystem extractor mutates
// the shared gcodeMap). Keep vitest faithful to that order and sharing.
const fileOrder = [
  'test/checker_spec.js',
  'test/event_dispatcher_spec.js',
  'test/extractor_specs/extractor_spec.js',
  'test/extractor_specs/status_extractor_spec.js',
  'test/parser_spec.js',
]

class OrderedSequencer extends BaseSequencer {
  sort(files) {
    return files.sort((a, b) => rank(a) - rank(b))
  }
}

function rank(spec) {
  const path = String(spec.moduleId)
  const index = fileOrder.findIndex((rel) => path.endsWith('/' + rel))
  return index === -1 ? fileOrder.length : index
}

export default defineConfig({
  test: {
    include: ['./test/**/*_spec.js'],
    isolate: false,
    pool: 'forks',
    maxWorkers: 1,
    sequence: {
      sequencer: OrderedSequencer,
    },
  },
})
