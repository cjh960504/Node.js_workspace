/*http 모듈로 웹 서버 구축하기*/ 
var http  = require("http");
var fs = require("fs");

// 서버는 클라이언트의 요청이 들어오면, 반드시 응답을 해야한다..
// HTTP 메커니즘 .. 만일 응답을 안하면? 클라이언트는 요청에 대한 응답을 무한 대기
// 서버 객체 생성
// 서버 객체 생성 시, 요청정보와 응답정보를 구성할 수 있는 request, response객체가 매개변수로
// 전달될 수 있다.
var server = http.createServer(function(request, response){
    // request 객체로는 클라이언트의 요청 정보를 처리할 수 있고,
    // response 객체로는 클라이언트에게 전송할 응답 정보를 구성할 수 있다.
    console.log("클라이언트의 요청을 받았습니다.");

    // 컨텐츠 전송 (Client가 받게 될 내용)
    // HTTP 상태코드 
    // 200 : 정상작동/500 : 심각한 서버의 에러/ 404:요청한 자원을 찾을 수 없음
    // var tag = "<input type=\"text\" value=\"잘갔니?\"/>";
    // tag = tag + "<button>가입</button>";
    
    response.writeHead(200, {"Content-Type":"text/html;charset=\"UTF-8\""}); // 편지 봉투 구성하기(응답 메시지 틀)
    // 서버에 있는 파일을 읽어들여, 클라이언트에게 전송한다!!
    fs.readFile("./회원가입양식.html", "utf-8", function(error, data){
            response.end(data);
    });

    // 이미지 경우 content-type:image/png  이미지이기 때문에 charset 필요 X
    // response.writeHead(200, {"Content-Type":"image/png;"}); 
    // fs.readFile("../../images/nation/1.png", function(error, data){
    //     response.end(data);//클라이언트에게 응답 정보 발송
    // });
});

// 접속자 감지
// server.on("connection", function(error, data){
//     console.log("접속 발생");
// });


// 서버가동
/*
모든 네트워크 프로그램은 포트번호가 있어야 한다
왜 why? 하나의 os 내에서 수많은 네트워크 프로그램들간 엉키지 않기 위해
*/ 
server.listen(8989, function(){
    console.log("My server is running at 8989!");
});