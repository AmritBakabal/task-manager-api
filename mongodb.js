//CRUD create, read, upadate, delete

// const mongodb= require('mongodb')
// const MongoClient = mongodb.MongoClient  //this allows us to use the function necessary to the database.
// const ObjectID = monogodb.ObjectID

//for the above using destructing and shorthand.
const{MongoClient,ObjectID} =require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017' //using ip instead of localhost won't cause problem later on.
const databaseName='task-manager'  //mongodb automatically creates database using this name

//creating own id .mostly it is not necessary to generate ourself. 
// const id =new ObjectID() //the above objectid is a construction function so we use new(it is optional too, mongo module adds itself so optional)
// console.log(id.id.length)
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())

//we connect using connect method to the specific connection :
MongoClient.connect(connectionURL,{useUnifiedTopology:true},(error,client)=>{ //we connect once but there are many connections which makes us more fast to connect to database
    if(error){
        // console.log(error)
        return console.log('Unable to connect!!')
    }
    //using db on the client to get the connection to the specific database:  
    const db= client.db(databaseName)  //it references to the database and we can manipulate the database with the name provided

    //inserting the documents:
    // db.collection('users').insertOne({   //collection followed by string and .method followed by object
    //     _id:id,
    //     name: 'Prakash',
    //     age: 24
    // },(error,result)=>{
    //     if(error){
    //         return console.log('Unable to insert data')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([{
    //     name:'samina',
    //     age:25
    
    // },{
    //     name:'sinjal',
    //     age: 22
    // }],(error,result)=>{
    //     if(error){
    //         console.log(error)
    //         return console.log('Unable to insert')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([{
    //     discription:'clean the house ',
    //     completed: true

    // },{
    //     discription:'play cricket',
    //     completed:false
    // },{
    //     discription:'pot plant',
    //     completed: false
        
    // }],(error,result)=>{
    //     if(error){
    //         return console.log('unable to insert')
    // }
    //     console.log(result.ops)
    // })

    //finding the documents. READ

    //by name: 
    // db.collection('users').findOne({name:'samina',age :1},(error,user)=>{
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }

    //     console.log(user)
    // })
    
    //by id : copying id from robo3t. The given id is in binary form so we must notify it so use objectid: 
    // db.collection('users').findOne({_id:new ObjectID('60c061132fd8f34c19676de6')},(error,user)=>{
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //     console.log(user)
    // })

    //by age:
    // db.collection('users').find({age:22}).toArray((error,users)=>{ //find returns crusor so we cannot use callback but we can use cruser callback
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //     console.log(users)
    // })
    // db.collection('users').find({age:22}).count((error,count)=>{
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //     console.log(count)
    // })

    //challange to find in task database.
    // db.collection('tasks').findOne({_id: new ObjectID('60bf55a148fc7831bb849c92')},(error,result)=>{
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //     console.log(result)
    // })

    // db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
    //     if(error){
    //         return console.log('unable to fetch')
    //     }
    //     console.log(tasks)
    // })

    // db.collection('tasks').find({completed:false}).count((error,count)=>{
    //     if(error){
    //         return console.log('Unable to count')
    //     }
    //     console.log(count)
    // })

    //update using promises

    // const updatePromises= db.collection('users').updateOne({
    //     _id:new ObjectID ('60c061132fd8f34c19676de6')
    // },{
    //     $set:{
    //         name:'Ashish'
    //     }
    // })

    // //promises
    // updatePromises.then((result)=>{
    //     console.log('Update success!',result)
    // }).catch((error)=>{
    //     console.log('Unable to update!!')
    // })

    //or: 
    // db.collection('users').updateOne({
    //     _id:new ObjectID ('60c061132fd8f34c19676de6')
    // },{
    //     // $set:{
    //     //     name:'Ashish'
    //     // }
    //     $inc:{
    //         age:1
    //     }
    // }).then((result)=>{
    //     console.log('Update success!',result)
    // }).catch((error)=>{
    //     console.log('Unable to update!!')
    // })

    //using updatemany

    // db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //     $set:{
    //         completed: true
    //     }
    // }).then((result)=>{
    //     console.log(result.modifiedCount)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // DELETE using deletemany
    // db.collection('users').deleteMany({
    //     age:22
    // }).then((result)=>{
    //     console.log(result.deletedCount)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    //using deleteOne

    db.collection('tasks').deleteOne({
        discription: 'pot plant'
    }).then((result)=>{
        console.log(result.deletedCount)
    }).catch((error)=>{
        console.log(error)
    })
})

