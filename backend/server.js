const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors')

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/mern-app').then(()=>{
    console.log("data passed succesfully")
}).catch((err)=>{
    console.log(err)
    res.status(500).json({message:err.message})
})

const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String,
    },
    description:{
        required:true,
        type:String,
    }})
    
const todoModel=mongoose.model('todo',todoSchema)
    
    
    app.post('/todos',async (req,res)=>{
        const {title,description}=req.body
        // const newtodo={
            //     id:todos.length+1,
            //     title,
            //     description
            // };
            // todos.push(newtodo);
            // console.log(todos);
            try{
                const newtodo=new todoModel({title,description});
                await newtodo.save();
                res.status(201).json(newtodo);
                
            }catch(error){
                console.log(error)
                res.status(500).json({message:error.message})
            }
            
        })
        
        
        app.get('/todos',async (req,res)=>{
            try{
          const todos= await todoModel.find();
           res.json(todos)
            }catch (error){
                res.status(500).json({message:error.message})
            }}
            )
        

        app.put('/todos/:id',async (req,res)=>{
    try{  
    const {title,description}=req.body;
    const id=req.params.id;
    const updatedtodo=await todoModel.findByIdAndUpdate(id,{title,description})
    if(!updatedtodo){
    return res.status(404).json({message:"todo not found"})
    }
    res.json(updatedtodo)
    }
   catch(error){
    console.log(error)
    res.status(500).json({message:error.message})
    } })  



 app.delete('/todos/:id',async (req,res)=>{
        try{
            const id=req.params.id;
            await todoModel.findByIdAndDelete(id);
            res.status(204).end();
        }
        catch (error){
            console.log(error);
            res.status(500).json({message:error.message});
        }
        })
    

app.listen(8000,()=>{
    console.log("backend in port 8000");
})