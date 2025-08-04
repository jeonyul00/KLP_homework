/* eslint-disable no-undef */
module.exports = {
  root: true,
  extends: ['@react-native', 'eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 'error', // Prettier 룰을 ESLint 오류로 처리
    'react/react-in-jsx-scope': 'off', // React 17+에서 불필요한 import 방지
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 미사용 변수 경고 (일부 제외)
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
