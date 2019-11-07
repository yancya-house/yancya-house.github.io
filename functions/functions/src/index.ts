import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const cookie = require('cookie');

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
  const visitorAtToday = request.headers.cookie ?
    cookie.parse(request.headers.cookie).__session : false;
  const doc = db.collection(COLLECTION_ID).doc(DOCUMENT_ID);
  const docRef = await doc.get();
  const counter = docRef.data() as Counter;
  const { latest_visitor_ip, latest_visitor_ua, count } = counter;
  console.log(`Visitor ip: ${ip}, ua: ${ua}, count: ${count}, latest_ip: ${latest_visitor_ip}, latest_ua: ${latest_visitor_ua}, cookie: ${visitorAtToday}`);
  if (visitorAtToday) {
    console.log('The visitor has a flesh cookie.')
  } else if(latest_visitor_ip === ip && latest_visitor_ua === ua) {
    console.log('Latest visitor visited again.')
  } else {
    console.log('Werlcome to yancya.house. new visitor.');
    await doc.update({
      latest_visitor_ip: ip,
      latest_visitor_ua: ua,
      count: count+1
    }).then(res => {
      console.log(`updated: ${JSON.stringify(res.writeTime)}`);
    }).catch(err => {
      console.error(`Error: ${JSON.stringify(err)}`);
    });
    counter.count += 1;
  }
  const aDayLater = new Date(Date.now() + 24 * 3600000);
  response.setHeader('Cache-Control', 'private');
  response.cookie('__session', true, { expires: aDayLater });
  response.send(JSON.stringify({count: counter.count}));
});