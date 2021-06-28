const express= require('express')
const sharp = require('sharp')
const auth= require('../middleware/auth')
const User= require('../models/user')
const router= new express.Router()
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account.js')



//testing: 
// router.get('/test', (req, res)=>{
//     res.send('This is from new file')
// })

router.post('/users',async (req, res)=>{
    // console.log(req.body)
    // res.send('Testing!!')
    const user= new User(req.body)
    //using async and await with try and catch: 
    try{
        //asynchronous method: 
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token= await user.generateAuthToken()
        res.status(201).send({ user, token })

    }catch(e){
        res.status(400).send(e)
    }



    //old method: 
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((e)=>{
    //     res.status(400)  //This sends the status code. it should be written above res.send or else the status code won't show. 
    //     res.send(e)
    // })

})

//logging in users: 
router.post('/users/login', async(req, res)=>{
    try{
        const user= await User.findByCredentials(req.body.email, req.body.password)
        const token= await user.generateAuthToken()
        
        //res.send({ user, token})  //we don't want user to show the token so:
        // res.send({user: user.getPublicProfile(), token})
        res.send({user, token})  //using shorthand, when we pass an object they are getting stringify behind the scene

    } catch(e){
        res.status(400).send()
    }
})

//logout of the current device using that current token:
router.post('/users/logout', auth, async(req, res)=>{

    try{

        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token

        })
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})
//logout all users: 
router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

//reading endpoints:
//for user
router.get('/users/me', auth, async(req, res)=>{  //auth is a middleware. after middlware is called then it calls next()
    
    res.send(req.user)   //personal user not to show others data
    //now:
    // try{
    //     const users= await User.find({})
    //     res.status(201).send(users)

    // }catch(e){
    //     res.status(500).send()

    // }
    //previous:
    // User.find({}).then((users)=>{   //documentation of mongoose (find   )
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })

})
//reading by id:
router.get('/users/:id',async (req, res)=>{
    const _id=  req.params.id

    try{
        const user= await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }

        res.status(201).send(user)

    } catch(e){
        res.status(500).send()
    }
    //pervious:
    // User.findById(_id).then((user)=>{
    //     //in mongodb if no user is found then it is not considered as error 
    //     if (!user){
            
    //        return res.status(404).send()
    //     }
        
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
    
})

//Updating (users): 
router.patch('/users/me', auth, async (req, res)=>{
//if keys were not matched: additional error handeling:  
    const updates= Object.keys(req.body)
    const allowedUpdates= ['name', 'email', 'age', 'password' ]
    const isValidOperation= updates.every((update)=>{  //every is going to run every item in the array
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        res.status(400).send({error: 'Invalid update!!'})
    }

    try{
        //small adjustment for using middleware(new):
        // const user= await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update]= req.body[update]
        })
        
        await req.user.save()

        //pervious:
        // const user= await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})
        //validator not working
    // if(!user){
    //     return res.status(404).send() //not working
    // }

    res.send(req.user)
    } catch(e){
        res.status(500).send()
        console.log(e)
    }
})

//delete user:
router.delete('/users/me', auth, async(req, res)=>{
    try{
        // const user= await User.findByIdAndDelete(req.user._id)

        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e){
        res.status(500).send()
    }
})

//route for upload avatar pic: 
const upload = multer({
    
    limits:{
        //accepting only less then 1 mb
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        //accepting only jpg,jped and png file :
        if(!file.originalname.match(/\.(jpg| jpeg| png)$/)) {
            return cb(new Error('please upload jpg, jpeg or png file'))
        }
        cb(undefined, true)

    }
})

//uploading and saving pictures:
router.post('/users/me/avatar', auth,  upload.single('avatar') , async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()  //.png() converts to png format, .resize() -> resize the image 
    req.user.avatar = buffer
    // req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error, req, res, next)=>{   //handeling uncaught errors
    res.status(400).send({error: error.message})
})

//deleting the avatar:
router.delete('/users/me/avatar', auth, async( req, res )=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//browser for users by id :
router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch(e){
        res.status(400).send()
    }
})


module.exports= router