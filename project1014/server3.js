/*
    ejs를 이해해보자
    ejs란? 
        - 오직, Node.js 서버측에서 해석 및 실행될 수 있는 파일 
        - js의 문법 사용이 가능 (if, for, 변수선언....)
        - 다른 서버 측 스크립트 언어인 PHP, ASP, JSP와 같은 목적
*/ 
var http = require("http");
var fs = require("fs");
var ejs = require("ejs");

var server = http.createServer(function(req, res){
    fs.readFile("./list.ejs", "utf-8", function(error, data){
        if(error){
            console.log("list 파일 읽기 에러 : ", error);
        }else{
            res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
            res.end(ejs.render(data));
        }
    });
});

server.listen(7979, function(){
    console.log("Node Server is running port at 7979...");
});



