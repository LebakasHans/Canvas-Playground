import antfu from '@antfu/eslint-config';

export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
}, {
  rules: {
    'no-undef': 0,
    'vue/multi-word-component-names': 0,
    'unused-imports/no-unused-vars': 1,
  },
});
