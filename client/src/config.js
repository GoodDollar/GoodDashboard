const env = process.env;

export default {
  env: env.REACT_APP_ENV || "development",
  walletUrl: env.REACT_APP_WALLET_URL,
  gunUrl: env.REACT_APP_GUN_URL,
  apiUrl: env.REACT_APP_API_URL,
};
