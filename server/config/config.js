require('dotenv').config()

const { PG_USERNAME, PG_PASSWORD, JWT_KEY } = process.env

module.exports = {
  "development": {
    "username": PG_USERNAME,
    "password": PG_PASSWORD,
    // "database": "thus_c_api_dev",
    "database": "jml-thus-api",
    "host": "localhost",
    "dialect": "postgres",
    "use_env_variable": "DATABASE_URL"
  }, 
  jwtSecret: JWT_KEY,
  jwtSession: {
    session: false
  }
}

