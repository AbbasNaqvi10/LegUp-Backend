const AWS = require('aws-sdk');
const express = require('express')
const {S3}=require('aws-sdk') 
const app = express()

var arr=[]
 
const fileUploaderForS3=async(files)=>{
    const s3= new S3( {
        region:process.env.region,
        accessKeyId:process.env.accessKeyId,
        secretAccessKey:process.env.secretAccessKey
    } )

    const params = files.map((file)=>{
      return {
        Bucket:process.env.AWS_BUCKET,
        Key:file.originalname,
        Body:file.buffer
      }
    })
    return await Promise.all(params.map(param=> 
      s3.upload(param).promise()))
}

const forFileLocationAndName=async(myResults,files)=>{
    var i = 0
    console.log(files.length)
    var nameAndLocation=  files.map((file)=>{
      const f= file.originalname
      const l=myResults[i].Location
      
      arr.push({f,l})
      i++
      return arr
    }) 
    return nameAndLocation
    //console.log(nameAndLocation[0][0].f) 
  }

module.exports={
    fileUploaderForS3,
    forFileLocationAndName
};