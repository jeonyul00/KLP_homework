module.exports = {
  root: true,
  extends: ['@react-native', 'eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
