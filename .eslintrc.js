module.exports = {
    root: true,
    env: {
      node: true
    },
    'extends': [
      'plugin:vue/strongly-recommended',
      'eslint:recommended'
    ],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'vue/no-use-v-if-with-v-for':'off',
      'no-empty':'off'
    },
    parserOptions: {
      parser: 'babel-eslint'
    }
  };