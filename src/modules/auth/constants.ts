export const jwtConstants = (() => {
  if (process.env['NODE_ENV'] === 'test') {
    process.env.SECRET_KEY = '000000';
  }
  return {
    secret: process.env.SECRET_KEY,
    getSecret: () => process.env.SECRET_KEY,
  };
})();
