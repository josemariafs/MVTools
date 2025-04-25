// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- This is a Vite alias
// @ts-nocheck
// eslint-disable-next-line import/no-absolute-path -- This is a Vite alias
import RefreshRuntime from '/@react-refresh'

if (import.meta.hot) {
  RefreshRuntime.injectIntoGlobalHook(window)

  // eslint-disable-next-line @typescript-eslint/no-empty-function -- This is a placeholder for the refresh runtime
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => type => type
  window.__vite_plugin_react_preamble_installed__ = true
}
