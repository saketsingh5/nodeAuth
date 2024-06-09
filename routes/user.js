const express = require('express');
const User = require('../models/user');
const { handleNewUsers, loginUser, refreshToken, getUsers } = require('../controller/user')

const router = express.Router();

// router.get('/', (req, res)=>{
//     res.json(users)
// })

router.post('/register', handleNewUsers);
router.post('/login', loginUser);
router.post('/refreshtoken', refreshToken);
router.get('/getusers', getUsers)

// router.get('/:id', (req, res)=>{
//     console.log(req.params.id)
//     let id = Number(req.params.id);
//     const user = users.find(user => user.id==id)
//     res.json(user)
// })

module.exports = router;