const env = process.env;
console.log({env})
export default {
  env: env.REACT_APP_ENV || "development",
  walletUrl: env.REACT_APP_WALLET_URL,
  gunUrl: env.REACT_APP_GUN_URL,
  apiUrl: env.REACT_APP_API_URL,
  embedDataStudioUrl: env.REACT_APP_EMBED_DATA_STUDIO_URL,
};
