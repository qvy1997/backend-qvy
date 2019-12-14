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
  databaseURL: 'https://backend-qvy.firebaseio.com'
});
const dbRealtime = admin.database()
const db = admin.firestore()

const hello = async (req,res) => {
  res.send({
    success: 1,
    message: 'server is running',
  })
}

const getSubject = async (req, res) => {
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

const getSomeSubject = async (req, res) => {
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
      teacher: body.teacher
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
  await db.collection(body.student).doc(body.codeSubject).delete()
}


app.get('/', hello)
app.post('/getSubject', getSubject)
app.post('/getSomeSubject', getSomeSubject)
app.post('/createSubject', createSubject)
app.delete('/deleteSubject', deleteSubject)
exports.backendAPI = functions.https.onRequest(app)