// Setup functions
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// General consts
const functionRegion = 'europe-west2'
const emailSubscriberCollection = 'subscriber_emails'

exports.addEmailSubscriber = functions.region(functionRegion).https.onCall((data, context) => {
  const validateEmail = (email) => {
    let re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
    return re.test(String(email).toLowerCase())
  }

  const result = {
    status: 'failed',
    message: ``,
    data: {
      email: data.email
    }
  }

  if (!validateEmail(data.email)) {
    return { ...result, message: 'Email address not valid.' }
  }

  let docRef = admin.firestore().collection(emailSubscriberCollection).doc(data.email)
  return docRef.get().then(function (doc) {
    if (doc.exists) {
      return { ...result,
        status: 'info',
        message: `You're keen, this email address is already subscribed.`
      }
    }

    return admin.firestore().collection(emailSubscriberCollection).doc(data.email).set({
      time: Date.now(),
      email: data.email
    }).then(() => {
      return {
        ...result,
        status: 'success',
        message: `Successfully subscribed ${data.email}`
      }
    })
  }).catch(function (error) {
    return { ...result, message: error.message }
  })
})
