const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

var MongoClient = require('mongodb').MongoClient;  
var url = "mongodb://localhost:27017/smart-brain";

app.post('/signin', (req, res) => {
    const {email,password} = req.body;
    MongoClient.connect(url, (err, client) => {  
        if (err){
            res.send(401);
            client.close();
        }else{
            var db = client.db('smart-brain');
            db.collection("users").findOne({email: email}, (err, result) => {  
            if (err){
                client.close();
                res.send(401); 
            }else{
                console.log(result);
                bcrypt.compare(password, result.password, function(err, hashComparingResult) {
                    if(hashComparingResult){
                        client.close();
                        res.json(result);
                    }else{
                        client.close();
                        res.status(401).send("Error")
                    }
                });
            }
            });
        }   
    });
})

app.post('/register', (req,res) => {
    const {email,name,password} = req.body;
    bcrypt.hash(password, null, null, (err, hash) => {
        
        let user = {
            name: name,
            email: email,
            password: hash,
            entries: 0,
            joined: new Date()
        }
        MongoClient.connect(url, (err, client) => {  
            if (err){
                res.send(401); 
            }else{
                var db = client.db('smart-brain');
                db.collection("users").insertOne(user, (err, result) => {  
                if (err){
                    client.close();
                    res.send(401); 
                }else{
                    console.log("1 record inserted");  
                    client.close();
                    res.json(result);
                }
                });
            }   
            });
    });
})

app.listen(3000, () => {
    console.log('app is running on port 3000')
});
