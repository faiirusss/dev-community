import { createStartHandler, defaultRenderHandler } from '@tanstack/react-start/server'
import { getRouter } from './router'

// This MUST be a default export
export default createStartHandler({
  getRouter,
  renderHandler: defaultRenderHandler,
})