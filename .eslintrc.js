module.exports = {
  root: true,
  globals: {
    "DEBUG": true
  },
  parser: "babel-eslint",
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'airbnb/base',
  env: {
      "browser": true,
      "node": true,
      "es6": true
  },
  // plugins: [
  //   "react"
  // ],
  // add your custom rules here
  rules: {
    "no-multiple-empty-lines": [2, {"max": 4}],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // http://eslint.org/docs/rules/
    "no-dupe-keys": 2,
    //react配置: https://www.npmjs.com/package/eslint-plugin-react
    "react/jsx-no-duplicate-props": 2,  //Prevent duplicate props in JSX
  }
}
