var http = require("http");
var url = require("url");
// var body = require("body");
var querystring = require("querystring"); //get뿐만아니라 post까지 파싱가능 

var server = http.createServer(function(req, res){
    // console.log("클라이언트 요청 방식 : ", req.method);
    var method = req.method;    
    
    if(method=="GET"){
        
        var urlJson = url.parse(req.url, true);
        var paramJson = urlJson.query;
        
        res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
        res.end("클라이언트가 GET방식으로 요청했네요.<br> ID :  "+paramJson.id+"<br> Pass : "+paramJson.pass);

        // console.log("GET URL 분석 : ", urlJson);
        // console.log("ID : ", paramJson.id);
        // console.log("Pass : ", paramJson.pass);        

    }else if(method=="POST"){

        // Post방식으로 전달된 데이터를 받기 위한 이벤트를 감지해보자!!
        res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
        res.end("클라이언트가 POST방식으로 요청했네요");

        // body로 전송된 데이터는 url 분석(parse)만으로는 해결이 안된다!
        // var urlJson = querystring.parse(req.url);

        req.on("data", function(param){
            // var postParam = url.parse(new String(param).toString(), true);
            var postParam = querystring.parse(new String(param).toString());
            console.log("POST 전송된 파라미터는 : ", postParam);
            console.log("ID : "+postParam.id+" PW : " +postParam.pass);
        });
        
    }    
});

server.listen(9999, function(){
    console.log("My Server is running at 9999....");
});
