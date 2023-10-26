const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const axios=require('axios');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
if(req.session.authenticated){
    token=req.session.authenticated['accessToken'];
    jwt.verify(token,"accessToken",(err,user)=>{
        if(!err){
         
            req.user=req.session.authenticated['userName'];
            next();
        }else{
            console.log(err);
            return res.status(403).json({message:`user not authenticated`});
        }
        })

}else{
    return res.status(403).json({message:`session not authenticated`});
}

});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
