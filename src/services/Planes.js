
import React from 'react'
const API_URL = "http://localhost:8080/api/usuarios";

export const Planes = async () => {
  
  const response = await fetch(API_URL,{
    headers: new Headers({
      'Authorization': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMjFmNjNiOC05YmVjLTRiZjQtODNmMC05YmZjMDMyYTYwMWYiLCJpYXQiOjE2Njg2MTI2NTYsImV4cCI6MTY3NjM4ODY1Nn0.hyiVvBKrohAhe0Jvi9a8kGA5u-DVseSZEw7-41FoQ8w", 
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  })


  .then((response) => response.json())
  .then((data) => console.log(data));

    return (
    <div>Login</div>
  )
}

