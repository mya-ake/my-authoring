module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html',
  ],
  // add your custom rules here
  rules: {
    'arrow-parens': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'curly': 'error',
    'default-case': 'error',
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'no-console': 'warn',
    'no-implicit-coercion': 'error',
    'no-mixed-operators': 'error',
    'no-var': 'error',
  },
  globals: {},
}
