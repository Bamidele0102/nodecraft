{
  "env": {
    "commonjs": true,
    "es2021": true,
    "node": true,
    "mocha": true
  },
  "extends": "airbnb-base",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    "no-console": "off",
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "no-unused-vars": ["warn"],
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
