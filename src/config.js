module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://postgres:password@localhost/noteful',
  API_TOKEN: process.env.API_TOKEN || 'e483162e-8224-4626-8777-1e574d35eede'
}