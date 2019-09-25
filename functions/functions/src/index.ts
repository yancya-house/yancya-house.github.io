import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

type Counter = {
  latest_visitor_ip: String
  latest_visitor_ua: String
  count: number
}

const COLLECTION_ID = 'counters'
const DOCUMENT_ID = 'HIvUbNChlDxi0oeXEySb';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore()

export const accessCounter = functions.https.onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', "*");
  const ip = request.ip;
  const ua = request.headers['user-agent'];
  const doc = db.collection(COLLECTION_ID).doc(DOCUMENT_ID);
  const docRef = await doc.get();
  const { latest_visitor_ip, latest_visitor_ua, count } = docRef.data() as Counter;
  console.log(`Visitor ip: ${ip}, ua: ${ua}, count: ${count}, latest_ip: ${latest_visitor_ip}, latest_ua: ${latest_visitor_ua}`);
  let current_count = 0;
  if (latest_visitor_ip !== ip || latest_visitor_ua !== ua) {
    await doc.update({
      latest_visitor_ip: ip,
      latest_visitor_ua: ua,
      count: count+1
    }).then(res => {
      console.log(`updated: ${JSON.stringify(res.writeTime)}`);
    }).catch(err => {
      console.error(`Error: ${JSON.stringify(err)}`);
    });
    current_count = count + 1;
  } else {
    console.log('Latest visitor visited again.')
    current_count = count;
  }
  response.send(JSON.stringify({count: current_count}));
});