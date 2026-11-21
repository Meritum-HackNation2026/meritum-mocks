/**
 * Loaded before every test file (`pnpm test`): a happy-dom DOM in the globals for
 * component tests, cleared after each test.
 *
 * @feature none (infrastructure)
 */
import { after, afterEach } from 'node:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

// Testing Library cleans up by itself only under a global afterEach (Jest, Vitest); without
// cleanup the mounted roots keep the process alive. Imported here, after register(), because
// @testing-library/dom binds `screen` to the document when it loads.
afterEach(async () => {
  const { cleanup } = await import('@testing-library/react')
  cleanup()
  document.body.replaceChildren()
})

after(async () => {
  await GlobalRegistrator.unregister()
})
