require('dotenv').config()

const { PG_USERNAME, PG_PASSWORD, JWT_KEY } = process.env

module.exports = {
  "development": {
    "username": PG_USERNAME,
    "password": PG_PASSWORD,
    "database": "thus_c_api_dev",
    "host": "localhost",
    "dialect": "postgres"
  }, 
  jwtSecret: JWT_KEY,
  jwtSession: {
    session: false
  }
}

