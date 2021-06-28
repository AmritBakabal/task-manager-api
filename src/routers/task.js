const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const router = new express.Router()

// route task, creating tasks: 
router.post('/tasks',auth , async(req, res)=>{

    // const tasks= new Task(req.body)
    const task = new Task({
        ...req.body,   //copy all the data inside body(es6 spread operator)
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send()
        console.log(e)
    }

    //previous: 
    // tasks.save().then(()=>{
    //     res.status(201).send(req.body)
    // }).catch((e)=>{
    //     res.status(400)
    //     res.send(e)
    // })

})

//(tasks)
router.patch('/tasks/:id', auth, async(req, res)=>{
    
    const updates= Object.keys(req.body)
    const allowedUpdates= ['description', 'completed']
    const isValidOperation= updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){

        res.status(400).send({error:'Invalid Update!!'})
    }
    try{
        //middleware:
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        // const task= await Task.findById(req.params.id)
        
        //previous:
        // const task= await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true })
        if(!task){
             return res.status(404).send()
        }

        updates.forEach((update)=>{
            task[update]= req.body[update]
        })
        await task.save()

        res.send(task)
    } catch(e){
        res.status(500).send()

    }

})

//deleting(users): 
router.delete('/users/:id', async (req, res)=>{
    try{
        const user= await User.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(404).send({error:' Unable to find that user  '}) //not working
        }
        res.send(user)
    } catch(e){
        res.status(500).send()
    }
    
})

//(tasks)
router.delete('/tasks/:id', auth,  async(req, res)=>{
    try{
        // const task= await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id:req.params.id, owner:req.user._id })
        if(!task){
            res.status(404).send()
        }
        res.send(task) 
    } catch(e){
        res.status(500).send()
    }
})

//reading tasks: 
//all tasks: 
// GET /tasks?completed=true 
//limit, skip 
//url structure for limit and skip:
//GET /tasks?limit=10&skip=0    -> limit means what we show on the first page, and skip means which page we gonna show.
//NOTE: The provide numbers are always strings in javascript
//GET /tasks?sortBy=createdAt_asc or createdAt_dec
router.get('/tasks', auth, async (req, res)=>{
    const match = {}
    const sort = {}
    
    if(req.query.completed){
        // match.completed = req.query.completed  //this won't work because it's going to return string and we haven't set the completed to the boolean.
        match.completed = req.query.completed === 'true' //if this string true is requested we send true tasks else when other req are requested we send false data.
    }

    //if sort is provided:
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        
    }

    try{
        // const tasks= await Task.find({})
        // const tasks = await Task.findOne({ owner: req.user._id })
        // using populate:
        await req.user.populate({
            path: 'tasks',
            match,
            options:{                //this can be used for paginating and sorting
                limit: parseInt(req.query.limit) ,  //if limit is not provided then mongoose gonna reject this 
                skip: parseInt(req.query.skip),
                //sorting:
                sort
                // :{
                    // createdAt: 1
                    //completed: 1
                // }
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
        // res.send(tasks)
    } catch(e){
        res.status(500).send()
        console.log(e)
    }
    //previous:
    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

//by id :
router.get('/tasks/:id', auth, async (req, res)=>{
    const _id= req.params.id
    
    try{
        // const task= await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task){
            res.status(401).send()
        }
        res.status(201).send(task)

    } catch(e){
        res.status(500).send()
    }

    //previous:
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()  //not working?? 
    //     }

    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
    
})


module.exports= router