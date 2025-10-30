export function getEnv(){
  // Safely get Vite env in app, and process.env in Jest/Node
  try {
    // Use eval to avoid static parse of import.meta in Jest
    // eslint-disable-next-line no-eval
    const viteEnv = eval('import.meta.env') || {}
    return viteEnv
  } catch {
    if (typeof process !== 'undefined') return process.env || {}
    return {}
  }
}
