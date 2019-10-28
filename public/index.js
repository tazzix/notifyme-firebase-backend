//========================================================================================
// == Service Worker registration for PWA
//========================================================================================

const registerSw = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js', {
          scope: '/' // <--- THIS BIT IS REQUIRED
      }).then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
      });
    }
  };
  
//========================================================================================
// == Code for soft keys
//========================================================================================

const getCurrentElement = () => document.querySelector("[nav-selected=true]");

const Enter = event => {
};

const SoftRight = event => {
  // TODO: implement refresh 1. clear list, 2. get data from db / cache, 3. populate new data
  console.log("Todo Refresh!");
};

const SoftLeft = event => {
};

const setLabels = ({ left, center, right }) => {
  document.getElementById("left").innerHTML = left ? left : "";
  document.getElementById("center").innerHTML = center ? center : "";
  document.getElementById("right").innerHTML = right ? right : "";
};


//========================================================================================
// == Code for navigation using D-pad
//========================================================================================

(() => {
  const firstElement = document.querySelectorAll("[nav-selectable]")[0];
  firstElement.setAttribute("nav-selected", "true");
  firstElement.setAttribute("nav-index", "0");
  firstElement.focus();
})();

const getAllElements = () => document.querySelectorAll("[nav-selectable]");

const getTheIndexOfTheSelectedElement = () => {
  const element = document.querySelector("[nav-selected=true]");
  return element ? parseInt(element.getAttribute("nav-index"), 10) : 0;
};

const selectElement = selectElement =>
  [].forEach.call(getAllElements(), (element, index) => {
    const selectThisElement = element === selectElement;
    element.setAttribute("nav-selected", selectThisElement);
    element.setAttribute("nav-index", index);
    if (element.nodeName === 'INPUT') {
      if (selectThisElement) element.focus(); else element.blur();
    }
  });

const Navigate = (direction, event) => {
  const allElements = getAllElements();
  const currentIndex = getTheIndexOfTheSelectedElement();
  var setIndex;

  switch(direction) {
    case "DOWN":
      const goToFirstElement = currentIndex + 1 > allElements.length - 1;
      setIndex = goToFirstElement ? 0 : currentIndex + 1;
      break;
    case "UP":
      const goToLastElement = currentIndex === 0;
      setIndex = goToLastElement ? allElements.length - 1 : currentIndex - 1;
      break;
    default:
      break;
  }

  selectElement(allElements[setIndex] || allElements[0]);
  setSoftkey(setIndex);

  const element = document.querySelector("[nav-selected=true]");
  //element.scrollIntoView(false);
  scrollToElement(element);
};

function scrollToElement(element) {
  // skip for header (or other non-scrolling elements in future)
  if (parseInt(element.getAttribute("nav-index"), 10) == 0) return;

  var rect = element.getBoundingClientRect();

  if (rect.top < 50) { // header is 50px height at this time
    let moveUp = rect.top - 54; // header + padding at this time
    document.querySelector("#main-content").scrollBy({
      top: moveUp
    });
  }

  if (rect.bottom > (window.innerHeight-30)) { // 30px is the height of softkey bar (footer) at this time
    let moveDown = rect.bottom - window.innerHeight + 36;
    document.querySelector("#main-content").scrollBy({
      top: moveDown
    });
  }
}

const setSoftkey = setIndex => {}
  /*setLabels({
    center: setIndex === 0 ? "" : "",
    right: setIndex === 0 ? "Refresh" : "Refresh"
  });*/


//========================================================================================
// == Code for application logo
//========================================================================================

  // Adds a new item to the todo list
function addItemToDOM(text) {
    var list = document.getElementById('notifications');
    var item = document.createElement('li');
    item.innerHTML = text;
    item.setAttribute("nav-selectable", "true");  
    list.insertBefore(item, list.childNodes[0]);
  }

//========================================================================================
// == Key handling on keyboard
//========================================================================================

document.addEventListener("keydown", event => {
    switch (event.key) {
      case "Enter":
      case "NumpadEnter":
        return Enter(event);
      case "ArrowDown":
        return Navigate("DOWN", event);
      case "ArrowUp":
        return Navigate("UP", event);
      //case "ArrowRight": // TODO: for use on buggy emulator, could be a good idea to remove after testing
      case "SoftRight":
        return SoftRight(event);
      default:
        return;
    }
  });
  
//========================================================================================
// == Code from sample / push notification
//========================================================================================

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
      //document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
 
 
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
      //document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
    }

    addItemToDOM('A list item');
    addItemToDOM('A list item');
    addItemToDOM('A list item');
    addItemToDOM('A list item');
    addItemToDOM('A list item');
    addItemToDOM('A list item');
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
