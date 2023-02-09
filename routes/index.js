var express = require('express');
var router = express.Router();
var controler=require('../controler/usercontroler')
const multer  = require('multer')


/* GET home page. */



// img
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/images')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix+file.originalname)
      }
    })

    const upload = multer({ storage: storage })

// 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// router.post('/signup', upload.single('profile'),controler.signup);
router.post('/signup', upload.fields([{ name: 'profile', maxCount: 2 }, { name: 'cover', maxCount: 2 }]),controler.signup);

router.post('/login',controler.login);

router.get('/finddata',controler.secure,controler.finddata);


module.exports = router;
