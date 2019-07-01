import firebase from 'firebase/app'
import 'firebase/firestore'
require('firebase/auth')
require('firebase/functions')

const getConfig = () => {
  return {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: ''
  }
}

// "async" is optional
export default async ({ Vue }) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(getConfig())
  }
  Vue.prototype.$firebase = {
    db: firebase.firestore(),
    functions: () => {
      return firebase.app().functions('europe-west2')
    }
  }
}
