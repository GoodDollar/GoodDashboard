const env = process.env;

export default {
  env: env.REACT_APP_ENV || "development",
  walletUrl: env.REACT_APP_WALLET_URL || "https://ewallet.gooddollar.org",
  gunUrl: env.REACT_APP_GUN_URL || "https://etorogun-prod.herokuapp.com/gun",
  apiUrl: env.REACT_APP_API_URL,
};
