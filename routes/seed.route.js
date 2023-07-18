const express = require("express");
const router = express.Router();
const Car = require("../models/Car.model");
const UserModel = require("../models/User.model");
const bcrypt = require('bcryptjs');


router.get("/", (req, res) => {
    res.json("DB seeding is available!");
});

router.post("/new-car", async (req, res, next) => {
    req.body.cars.forEach(car => {
        let result = Car.create(car).then(() => {
        }).catch(e => {
            console.log(e);
        })


    })
    res.send('success')
})

router.post("/new-user", async (req, res, next) => {


    req.body.users.forEach(user => {
        // encrypt password
        const payload = { ...user }

        // delete and encrypt password
        delete payload.passwordHash

        const salt = bcrypt.genSaltSync(13)
        payload.passwordHash = bcrypt.hashSync(user.passwordHash, salt)

        let result = UserModel.create(payload).then(() => {
        }).catch(e => {
            console.log(e);
        })


    })
    res.send('success')
})

module.exports = router