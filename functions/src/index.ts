import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import firebaseAccountCredentials from './serviceaccount.json'
const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tazzixcom.firebaseio.com"
});

const fcm = admin.messaging();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const sendNotification = functions.firestore.document('/users/{infoId}')
.onWrite(async (change, context) => {
    const infoId = context.params.infoId; console.info('Info:'+infoId);
    const payload = {
        notification: {
            title: 'New Message from',
            body: 'New Message Body',
            status: 'Wohoo its work',
            click_action: 'http://127.0.0.1:5000/'
        }
    }

    console.info(payload);

    //const data = await admin.firestore.document(`/users/${change.after}`).once('value');
    //if (!data.val()) return;
    //console.info(JSON.stringify(data.val()));
    //return;
    
    //const snapshot = data.val();
    const token = 'chMYKkbxngBn0BrHSO7zxN:APA91bFayPomT7TMquJ0DuoWZiNcKa9d7AgqArgplZXhH4McwIjOWbI8IwrG_jiuLkD9Cfrbj8NN7pf58mKqnd8f3rxWL3gj7rDD__p8vQgRFQUmGNBxc2qfecTDy4dpijB1TAvmQ7Ex';//snapshot.token;
    return fcm.sendToDevice(token, payload);
});



/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
    if (request.body && request.body.token) {
        const payload = {
            notification: {
                title: request.body.title,
                body: request.body.message,
                status: 'Wohoo its work',
                click_action: request.body.url || 'https://example.com'
            }
        }
        admin.messaging().sendToDevice(request.body.token, payload);
    }
    response.send("Hello from Firebase");
});

exports.sendNotification = functions.database.ref('/users/{chatId}')
.onWrite((event) => {
    const payload = {
        notification: {
            title: 'New Message from',
            body: 'New Message Body',
            status: 'Wohoo its work',
            click_action: 'https://testing-project-development.firebaseapp.com'
        }
    }

    console.info(payload)

    return admin.database().ref(`/users/${event.userId}`).once('value').then((data) => {

        if (!data.val()) return;

        const snapshot = data.val();
        const token = snapshot.token;

        return admin.messaging().sendToDevice(event.token, payload);
    });
})


exports.users = functions.https.onRequest((request, response) => {
    if(request.method == 'GET') {

        response.json({err: null, data: [{id: 1, name: 'John'}, 
        {id: 2, name: 'Amenda'},
         {id: 3, name: 'foo'}, 
        {id: 4, name: 'bar'}]});
    } 

    // if( 'POST')
});

exports.test = functions.https.onRequest((request, response) => {
    const method = request.method;
    response.send('Requested Method ' + method);
});
exports.test2 = functions.https.onRequest((request, response) => {
    const method = request.method;
    response.send('Requested Method test 2 ' + method);
});
*/