const express = require('express');
const { connectToDB, getDB } = require('./db');
const { ObjectId } = require('mongodb');
///init app & middleware 

const app = express();
app.use(express.json())
// db connection 

let db 
connectToDB((err)=>{
        if(!err){
            app.listen(3000,()=>{
                console.log("successfully connected to db \n app listing on port 3000 .....")
            })
            db = getDB()
        }
})

///routs
app.get('/books',(request,response)=>{

    let books =[]
     db.collection('books').find() //return cursor we need to use toArray forEach 
                           .sort({author:1})
                         .forEach(book=>books.push(book))
                     .then(()=>{
                             response.status(200).json(books)
                             })
                            .catch(()=>{
                       response.status(500).json({error:"could not fetch the document :( "})

                         })

})

app.get('/books/:bookID',(request,response)=>{


        bookID = request.params.bookID;

        if (ObjectId.isValid(bookID)) {
            
            db.collection('books').findOne({_id:new ObjectId(bookID)}) //return cursor we need to use toArray forEach 
                                 .then(doc=>{
                                    if (doc) {
                                        response.status(200).json(doc)    
                                    }else{
                                        response.status(404).json({message:"Not Found :( "})
                                    }
                                })
                                   .catch(err=>{
                              response.status(500).json({error:"could not fetch the document :( "})
        
                                })
        }else{
            console.log("Id invalid ")
            response.status(500).json({error:"Id not valid :( ..."})

        }

})

app.post('/books/new',(request,response)=>{
    const book = request.body 
    db.collection('books').insertOne(book)
                            .then(result=>{

                                response.status(201).json(result)
                            })
                            .catch(err=>{
                        response.status(500).json({error:"could not creat the Book :( ..."})

                            })
})

app.get('/',(request,response)=>{

    response.json({mssg:"welcome to MongoDB test with node ...."})

})

app.all('*',(request,response)=>{

    response.json({mssg:"Page Not found :( ............"})

})
