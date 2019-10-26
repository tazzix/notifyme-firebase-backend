document.addEventListener('DOMContentLoaded', function() {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
      let app = firebase.app();
      let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
      document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
 
 
      var db = firebase.firestore();

      // getting messaging Object from firebase
      const messaging = firebase.messaging();
      messaging.usePublicVapidKey("BBqn97xkyNQPbINEBlJdKRdW1wFNYC79Ny3qUUiyEIKuCRg9A4feN3ZKUNL7BuHXSed0o6wDI2FtN6IfpsKps6A");
      
      messaging.requestPermission().then(function () {
          console.log('Notification permission granted.');
          return messaging.getToken();
      }).then(function (token) {
          // Displaying user token
          console.log('token >>>> ', token);
      }).catch(function (err) { // Happen if user deney permission
          console.log('Unable to get permission to notify.', err);
      });
      
      // do whatever you want on getting push notification in your front application
      messaging.onMessage(function (payload) {
          console.log('onMessage', payload);
      });

      // checking is Browser supports the Service Worker..
        if ('serviceWorker' in navigator) {

            console.log('Service Worker is supported');

            // if service worker supported then register my service worker
            navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (reg) {
                console.log('Successfully Register :^)', reg);
                const convertedVapidKey = urlBase64ToUint8Array('BBqn97xkyNQPbINEBlJdKRdW1wFNYC79Ny3qUUiyEIKuCRg9A4feN3ZKUNL7BuHXSed0o6wDI2FtN6IfpsKps6A');
                reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                }).then(function (subscription) {
                    console.log('subscription:', subscription.toJSON());
                    // GCM were used this endpoint
                    console.log('endpoint:', subscription.endpoint);
                }).catch(function (err) { // 
                    console.log('Error:', err.code + err.message + err.name);
                });

            }).catch(function (error) {
                console.log('SW Registration Failed: :^(', error);
            });

        }

        var getOptions = {
            source: 'default'
        };

        db.collection("users")
        .where("UserID", "==", 1571988895153)
        .get(getOptions)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
            });
        }).catch(function (err) { // Data not found
            console.log('No Data:', err);
        });

    } catch (e) {
      console.error(e);
      document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }
  });




  //////=================================================

/*
  // Initialize Firebase
var config = {
    apiKey: "AIzaSyDpyGf4UQRrWr74OFnb4cVx-3eZFj7bePg",
    authDomain: "tazzixcom.firebaseapp.com",
    databaseURL: "https://tazzixcom.firebaseio.com",
    projectId: "tazzixcom",
    storageBucket: "tazzixcom.appspot.com",
    messagingSenderId: "1006001632724",
    appId: "1:1006001632724:web:12dda0edb55b34826dd241"
};
firebase.initializeApp(config);
var db = firebase.firestore();

// getting messaging Object from firebase
const messaging = firebase.messaging();
messaging.usePublicVapidKey("BBqn97xkyNQPbINEBlJdKRdW1wFNYC79Ny3qUUiyEIKuCRg9A4feN3ZKUNL7BuHXSed0o6wDI2FtN6IfpsKps6A");

messaging.requestPermission().then(function () {
    console.log('Notification permission granted.');
    return messaging.getToken();
}).then(function (token) {
    // Displaying user token
    console.log('token >>>> ', token);
}).catch(function (err) { // Happen if user deney permission
    console.log('Unable to get permission to notify.', err);
});

// do whatever you want on getting push notification in your front application
messaging.onMessage(function (payload) {
    console.log('onMessage', payload);
});

fetch("https://us-central1-pwapushnotification-633e2.cloudfunctions.net/helloWorld", {
    method: 'POST',
    body: {
        token: "ewD5MHBousU:APA91bEuIz1bS4E1U9bgZdgO3YBe2Uk9LLhvbzQC_YMtfKNoBHW6lpbXFM-_kqc6PGOXDs63s_5ujhArq32Aq7Q6kQ0ZIirLZxIt630fB5rIc-MZ2rjeiGKfiw1MWS1f2C83zDsViZb075P6lh4tJOqMPcI_y-dgNA",
        title: "my title",
        message: "my body message"
    },
    headers: {
        'Content-Type': 'application/json'
    }
}).then((res) =>res)
*/

/*
// checking is Browser supports the Service Worker..
if ('serviceWorker' in navigator) {

    console.log('Service Worker is supported');

    // if service worker supported then register my service worker
    navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (reg) {
        console.log('Successfully Register :^)', reg);
        const convertedVapidKey = urlBase64ToUint8Array('BBqn97xkyNQPbINEBlJdKRdW1wFNYC79Ny3qUUiyEIKuCRg9A4feN3ZKUNL7BuHXSed0o6wDI2FtN6IfpsKps6A');
        reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        }).then(function (subscription) {
            console.log('subscription:', subscription.toJSON());
            // GCM were used this endpoint
            console.log('endpoint:', subscription.endpoint);
        }).catch(function (err) { // 
            console.log('Error:', err.code + err.message + err.name);
        });

    }).catch(function (error) {
        console.log('SW Registration Failed: :^(', error);
    });

}

var getOptions = {
    source: 'default'
};

db.collection("users")
.where("UserID", "==", 1571988895153)
.get(getOptions)
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
}).catch(function (err) { // Data not found
    console.log('No Data:', err);
});
*/
/**
 * urlBase64ToUint8Array
 * 
 * @param {string} base64String a public vavid key
 */
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
