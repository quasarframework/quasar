
let arg = process.argv[2];
if(!arg){
  console.warn("Defaulting to ios. Use jest [ios|mat] to specify");
  arg = "ios.vue";
  global.__THEME__ = 'ios';
}else{
  global.__THEME__ = arg;
  arg += ".vue";
}

module.exports = {
    "moduleFileExtensions": [
      "js",
      "json",
      "vue",
      arg
    ],
    "transform": {
      "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
      ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
    },
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    "snapshotSerializers": [
      "<rootDir>/node_modules/jest-serializer-vue"
    ]
  }