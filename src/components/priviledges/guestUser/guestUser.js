import React, { useState, useContext, useEffect } from "react"
import axios from 'axios';

export default function GuestUser(){
    const [data, setData]= useState()

    useEffect(()=>{
        axios.get("https://4xhs80hti5.execute-api.us-east-1.amazonaws.com/credit-card-details/get").then((resp)=>{
            console.log("resp", resp.data)
            setData(resp.data.items)
        })
    },[])

    return(
        <div>
            {
                data?.map((item)=>{
                    console.log(item)
                })
            }
            
        </div>
    );
}