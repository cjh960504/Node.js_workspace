/*
    웹서버를 구축하여, 클라이언트가 전송한 파라마터 값들을
    mysql에 넣어보자
*/ 
var http = require("http"); //http 모듈 가져오기
var fs = require("fs"); //file system module 

let port = 7979;

// http 모듈로부터 서버 객체 생성하기
var server = http.createServer(function(req, res){
    // 아래의 코드들이 동작하기 전에, 서버는 클라이언트가 원하는게 무엇인지 구분을 먼저 해야된다.
    // 요청분석!
    // 요청분석을 들어가려면, 요청 정보를 담고 있는 request 객체를 이용해야한다!!
    console.log(req.url);
    // 1)클라이언트가 회원가입 양식을 보길 원하면 아래의 코드가 수행...
    // 서버에 존재하는 회원가입양식 폼파일을 읽어서, 클라이언트에 보내주자
    fs.readFile("./회원가입양식.html", "utf-8", function(error, data){ 
        if(error){
            console.log("에러 발생 : ", error);
        }else{
            console.log("파일 읽기 성공!");
            // http 프로토콜의 약속 상 형식을 지켜서 보내야함
            // 상태코드에 대한 응답헤더를 지정 
            res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
            res.end(data);
        }
    });

    //2) 가입을 원할 경우엔, db에 넣어줘야하고

    //3) 이미지를 원하면 이미지 보여줘야하고

    //4) 오디오파일을 원하면 오디오파일을 전송.....
});

//서버가동하기
server.listen(port, function(){
    console.log("Server is running at "+port+"..");
});


