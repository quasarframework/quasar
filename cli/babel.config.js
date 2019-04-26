module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": "commonjs",
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "plugins": ["@babel/plugin-syntax-dynamic-import"],
  "env": {
    "test": {
      "plugins": ["dynamic-import-node"]
    }
  }
}
