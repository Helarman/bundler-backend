export const JITO_CONFIG = {
  endpoint: process.env.JITO_ENDPOINT || 'https://mainnet.block-engine.jito.wtf/api/v1/block-engine',
  tipAccount: process.env.JITO_TIP_ACCOUNT || '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
    maxBundleSize: 5,
  maxRetries: 3,
  retryDelay: 1000,
}