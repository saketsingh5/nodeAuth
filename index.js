const express = require('express')
const cors = require('cors')
const app = express();
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const {connectMongoDB} = require('./connection')

app.use(cors());
app.use(express.json())

dotenv.config({
    path: './.env'
})

connectMongoDB(`${process.env.MONGODB_URI}/node-ex`)
    .then(()=> console.log('Mongo Connected'))
    .catch((err)=> console.log('Mongo Error', err))



app.use('/api/user/v1', userRouter)


app.listen(process.env.PORT || 6000);