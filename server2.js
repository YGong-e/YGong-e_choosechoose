var http = require('http');
var fs = require('fs');
var express = require('express');
var qs = require('querystring');
var ejs = require('ejs');
var app = express();
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var comment;
var pic1, pic2, pic3;

app.set('port', 3001);
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

app.use(express.static(__dirname + '/secure_web'));

app.get('/', function(req,res){
    res.render('../secure_web/code/main2.html');
});

app.post('/', function(req,res){
    res.render('../secure_web/code/main2.html');
});

app.get('/arr', function(req, res){
    var fashion = new Array();
    var coat = req.query.coat;
    var top = req.query.top;
    var bottom = req.query.bottom;
    var shoes = req.query.shoes;
    var accessory = req.query.accessory;
    
    for(var i=0;i<7;i++){
        if(coat-1==i){
            fashion.push(7);
        }
        else{
            fashion.push(0);
        }
    }
    
    for(var i=0;i<10;i++){
        if(top-1==i){
            fashion.push(7);
        }
        else{
            fashion.push(0);
        }
    }
    
    for(var i=0;i<10;i++){
        if(bottom-1==i){
            fashion.push(7);
        }
        else{
            fashion.push(0);
        }
    }
    
    for(var i=0;i<10;i++){
        if(shoes-1==i){
            fashion.push(7);
        }
        else{
            fashion.push(0);
        }
    }
    
    for(var i=0;i<10;i++){
        if(accessory-1==i){
            fashion.push(7);
        }
        else{
            fashion.push(0);
        }
    }
    
    
    fs.writeFile('output.csv', fashion, 'utf8', function(err){
        
       
            let {PythonShell} = require('python-shell');

            var mysql = require('mysql');

            var connection = mysql.createConnection({
                //connectionLimit: 10,
                host: 'localhost',
                port: '3306',
                user: 'root',
                password: '1909',
                database: 'clothes',
                debug: false
            });

            var options={
                mode:'text',
                pythonPathL:'',
                pythonOptions:['-u'],
                scriptPath:'',
            };

            PythonShell.run('machinelearning2.py', options, function(err, results){
                if(err) throw err;
                else{
                    result=results[0][2]
                    connection.query('SELECT * from kind_clothes2', function(err, rows, fields) {
                        comment=rows[result].comment;
                        pic1=rows[result].pic1;
                        pic2=rows[result].pic2;
                        pic3=rows[result].pic3;
                        res.render('../secure_web/code/result2.html', {comment:comment, pic1:pic1, pic2:pic2, pic3:pic3});
                         
                    });
                }
            });
        
    });
    fashion=[];
});

app.post('/arr1', function(req, res){
    res.render('../secure_web/code/fashion2.html');
});

var server = app.listen(3001, function(){
    console.log("Start");
});