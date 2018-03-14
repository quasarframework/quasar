/* run tests with 'jest' in the command line*/


let arg = process.argv[2];
let __THEME__;
if(!arg){
  console.warn("Defaulting to ios. Use jest [ios|mat] to specify");
  arg = "ios.vue";
  __THEME__ = "ios";
}else{
  __THEME__ = arg;
  arg += ".vue";
}

module.exports = {
    "moduleFileExtensions": [
      "js",
      "json",
      "vue",
      arg
    ],
    "globals":{
      __THEME__
    },
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