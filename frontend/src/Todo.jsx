import React, { useState,useEffect } from 'react'
import './App.css'

export default function Todo() {
       const [title,settitle]=useState("");
       const [description,setdescription]=useState("");
       const [todos,settodos]=useState([])
       const [error,seterror]=useState("")
       const [message,setmessage]=useState("")
       const [editid,seteditid]=useState(-1)

       const [edittitle,setedittitle]=useState("");
       const [editdescription,seteditdescription]=useState("");
        const apiUrl="http://localhost:8000" 
    
    const handleSubmit=()=>{
      seterror('')

       if(title.trim()!=='' && description.trim()!==""){
        fetch(apiUrl+"/todos",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({title,description}),
        }).then((res)=>{
            if(res.ok){
                settodos([...todos,{title,description}])
                settitle('')
                setdescription('');
                setmessage('item added successfully')
                setTimeout(() => {
                    setmessage("")
                }, 3000);
            }else{
                seterror("unable to create todo operaton")
            }
        }).catch(()=>{
            seterror('unable to create todod app')
        })
       }
    }
    useEffect(() => {
        getItems()
    }, [])
    
    const getItems=()=>{
        fetch(apiUrl+"/todos").then(res=>res.json()).then((res)=>settodos(res))
    }

    const handleedit=(item)=>{
        seteditid(item._id);
        setedittitle(item.title);
        seteditdescription(item.description);

    }

    const handleupdate=()=>{
        seterror('')

        if(edittitle.trim()!=='' && editdescription.trim()!==""){
         fetch(apiUrl+"/todos/"+editid,{
             method:"PUT",
             headers:{
                 'Content-Type':'application/json'
             },
             body:JSON.stringify({title:edittitle,description:editdescription}),
         }).then((res)=>{
             if(res.ok){
              const updatedtodos= todos.map((item)=>{
                   if(item._id==editid){
                    item.title=edittitle;
                    item.description=editdescription;
                   }
                   return item;
                })
                 settodos(updatedtodos)
                 setedittitle('')
                 seteditdescription('');
                 setmessage('item updated successfully')

                 setTimeout(() => {
                     setmessage("")
                 }, 3000);

                 seteditid(-1)
             }else{
                 seterror("unable to create todo operaton")
             }
         }).catch(()=>{
             seterror('unable to create todo app')
         })
        }
    }

    const handleeditcancel=()=>{
        seteditid(-1);
    }
  
    const handledelete=(id)=>{
        if(window.confirm('are you sure want to delete')){
            fetch(apiUrl+"/todos/"+id,{
                method:'DELETE',
            }).then(()=>{
              const updatedtodos=todos.filter((item)=>item._id!==id)
                settodos(updatedtodos)
            })
        }

    }



  return (
    <>
    <div className='container '>
    <div className='row p-3 bg-primary text-light'> 
    <h1>Todo Project- mern stack</h1>
    </div>
    <div className="row ">
        <h3>Add Item</h3>
        {message&&<p className="text-success" >{message}</p>}
        <div className="form-group d-flex gap-2">
           <input type="text" value={title} onChange={(e)=>settitle(e.target.value)} className='form-control border-primary' placeholder='Title'/>
           <input type="text" value={description} onChange={(e)=>setdescription(e.target.value)} className='form-control border-primary' placeholder='Description'/>
           <button className='btn btn-dark' onClick={handleSubmit}>Add</button>

        </div>
        {error&& <p className="text-danger">{error}</p>}

        <div className="row alter">
             <br />
             <br />
             <h3>Tasks</h3>
            <ul className="list-group ">
               {
                todos.map((item)=><li  className='list-group-item d-flex bg-info justify-content-between  my-3'>
                    <div className="d-flex flex-column me-2">
                  {
                    editid==-1 || editid!==item._id? <>
                    <span className='px-0 '><b>title:</b>    {item.title} </span>
                    <span className='px-0 '><b>Des: </b>     {item.description}</span>
                    </>:<>
                    <div className="form-group d-flex gap-2 ">
                    <input type="text" value={edittitle} onChange={(e)=>setedittitle(e.target.value)} className='form-control p-0 ' placeholder='Title'/>
                    <input type="text" value={editdescription} onChange={(e)=>seteditdescription(e.target.value)} className='form-control p-0 ' placeholder='Description'/>
                    </div>
                    </>
                  }
            </div>


            <div className="d-flex gap-2">
                {editid== -1 || editid!==item._id ? <button onClick={()=>handleedit(item)} className="btn btn-warning">Edit</button>: <button  className="btn btn-warning" onClick={handleupdate}>Update</button>}
                {editid== -1 ? <button  onClick={()=>handledelete(item._id)}  className="btn btn-danger">Delete</button>:<button className='btn btn-danger' onClick={handleeditcancel}>cancel</button>}
            </div>
                </li>)
               }
      </ul>

        </div>
    </div>
    
    </div>
   
    </>
  )
}
