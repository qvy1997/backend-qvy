const functions = require("firebase-functions")
const admin = require("firebase-admin")
const serviceAccount = require("./backend-qvy-firebase-adminsdk-79ai3-a5d02612a4.json")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const moment = require('moment')

app.use(cors({ origin: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  apiKey: 'AIzaSyBZ9EGAX2tbRP6iehgE10k1KrlTiJ9FNqg',
  authDomain: 'backend-qvy.firebaseapp.com',
  databaseURL: 'https://backend-qvy.firebaseio.com',
  storageBucket: 'backend-qvy.appspot.com'
});

const dbRealtime = admin.database()
const db = admin.firestore()

const hello = async (req,res) => {
  res.send({
    success: 1,
    message: 'server is running',
  })
}

const getSubject = async (req, res) => { // function get รายวิชาแบบทั้งหมด
  const body = req.body
  let dataAll = []
  let dataID = []
  let studentRef = await db.collection(body.student).get()
  studentRef.forEach( snapshot => {
    dataAll.push(snapshot.data())
    dataID.push(snapshot.id)
  })
  res.send({
    success: 1,
    message: 'server is runningn!!',
    dataAll: dataAll,
    dataID: dataID
  })
}

const getSomeSubject = async (req, res) => { // function get รายวิชาแบบเลือก
  const body = req.body
  let subjectRef = await db.collection(body.student).doc(body.codeSubject).get()
  let dataSubject = subjectRef.data()
  res.send({
    success: 1,
    message: 'server is running!!',
    data: dataSubject
  })
}

const createSubject = async (req, res) => {
  const body = req.body
  let dataRef = await db.collection(body.student).doc(body.codeSubject).get()
  if (!dataRef.exists) {
    let data = {
      classYear: body.class,
      bookRecom: body.bookRecom,
      codeSubject: body.codeSubject,
      credit: body.credit,
      detailSubject: body.detailSubject,
      imageTeacher: body.imageTeacher,
      nameSubject: body.nameSubject,
      note: body.note,
      teacher: body.teacher,
      nameImgTeacher: body.nameImgTeacher 
    }
    await db.collection(body.student).doc(body.codeSubject).set(data)
    res.send({
      success: 1978,
      message: 'creation success!!'
    })
  } else {
    res.send({
      success: 9999,
      message: 'exists data'
    })
  }
}

const deleteSubject = async (req, res) => {
  const body = req.body
  pushArry = []
  await db.collection(body.student).doc(body.codeSubject).delete()
  let dataRef = await db.collection(body.student).get()
  dataRef.forEach(snapshot => {
    pushArry.push(snapshot.data())
  })
  res.send({
    success: 19287,
    message: 'delete subject success!!',
    dataAll: pushArry
  })
}

const getAllCollection = async (req, res) => {
  mapArry1 = []
  let dataStudent1 = await db.collection(`student1`).get()
  dataStudent1.forEach(snapshot=> {
    mapArry1.push(snapshot.data())
  })
  mapArry2 = []
  let dataStudent2 = await db.collection(`student2`).get()
  dataStudent2.forEach(snapshot=> {
    mapArry2.push(snapshot.data())
  })
  mapArry3 = []
  let dataStudent3 = await db.collection(`student3`).get()
  dataStudent3.forEach(snapshot=> {
    mapArry3.push(snapshot.data())
  })
  mapArry4 = []
  let dataStudent4 = await db.collection(`student4`).get()
  dataStudent4.forEach(snapshot=> {
    mapArry4.push(snapshot.data())
  })
  let dataArry = mapArry1.concat(mapArry2)
  dataArry = dataArry.concat(mapArry3)
  dataArry = dataArry.concat(mapArry4)
  res.send({
    success: 1987,
    message: 'get success!!',
    data: dataArry
  })
}

app.get('/', hello)
app.post('/getSubject', getSubject)
app.post('/getSomeSubject', getSomeSubject)
app.post('/createSubject', createSubject)
app.delete('/deleteSubject', deleteSubject)
app.get('/getAllCollection', getAllCollection)
exports.backendAPI = functions.https.onRequest(app)