const database = require("../model/signup");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { Error } = require("mongoose");
const nodemailer = require("nodemailer");
// mail
async function main(email) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'russsavaliya@gmail.com', // generated ethereal user
      pass: 'naxqllsspiyhjyrs', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'russsavaliya@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    // text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
// 
exports.signup = async function (req, res, next) {
    try {
        // console.log(req.body);
        // console.log(req.files);
        // 
        // console.log(req.files);
        let imgarray = []
        req.files.profile.map((el) => {
            imgarray.push(el.filename);
        })
         let imgarraycover = []
        req.files.cover.map((el) => {
            imgarraycover.push(el.filename);
        })
    // 
        let check = await database.findOne({ email: req.body.email })
        if (check) {
            throw new Error('enter another email')
        }
        req.body.password = await bcrypt.hash(req.body.password, 8)

        req.body.profile = imgarray
        req.body.cover = imgarraycover
    console.log(req.body);
        let userdata = await database.create(req.body)
        var token = await jwt.sign({ id: req.body._id }, 'signup');
      await main(req.body.email)
    // 
        res.status(201).json({
            status: 'success',
            message: 'data create',
            data: userdata,
            token
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message,

        })
    }


}

// login

exports.login = async function (req, res, next) {
    try {
        console.log(req.body);
        let check = await database.findOne({ email: req.body.email })
        console.log(check);
        if (!check) {
            throw new Error('email  not valid')
        }
        let checkps = await bcrypt.compare(req.body.password, check.password)
        if (!checkps) {
            throw new Error('password not valid')
        }
        var token = await jwt.sign({ id: check._id }, 'signup');

        res.status(201).json({
            status: "login successfull",
            message: "login successfull",
            data: check,
            token



        })
    } catch (error) {
        res.status(404).json({
            status: "login fail",
            message: error.message
        })
    }

}

// find

exports.finddata = async function (req, res, next) {
    try {
        let finddata = await database.find()

        res.status(201).json({
            status: "success",
            message: "finddata",
            data: finddata
        })

    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message

        })
    }
}

exports.secure = async function (req, res, next) {
    try {
        console.log(req.headers.token);
        let token = req.headers.token
        if (!token) {
            throw new Error('token not valid')
        }

        let tokenverify = await jwt.verify(token, 'signup')
        console.log(tokenverify);
        let chekeuser = await database.findById(tokenverify.id)
        if (!chekeuser) {
            throw new Error('user  not valid ')
        }

        next()
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
};