/*
http 웹서버 구축하기
*/ 
var http = require("http"); //필요한 모듈 가져오기
var fs = require("fs");
var url = require("url"); //url 정보를 해석해주는 모듈
var mysql = require("mysql"); //외부모듈이기 때문에, npm install 설치 필요
var port = 8888;
var con; //접속 정보를 가진 객체를 받는 전역 변수

// 서버객체 생성
// request, response는 이미 Node.js 자체적으로 존재하는 객체
var server = http.createServer(function(req, res){
    // 클라이언트의 요청에 대한 응답처리... (html 문서를 주고 받고 있음)
    
    // 클라이언트의 요청 내용이 다양하므로, 각 요청을 처리할 조건문이 있어야 한다..
    // 따라서, 클라이언트가 원하는 것이 무엇인지부터 파악!
    console.log("클라이언트의 요청 url : ", req.url);
    
    // url 모듈을 이용하여 전체 주소를 대상으로 해석시작
    
    // 파싱 시, true 옵션을 주면 파라미터들을 JSON형태로 준다.
    var result = url.parse(req.url, true); 
    var params = result.query; //파라미터를 담고 있는 json객체반환
    
    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});

    if(result.pathname=="/login"){
        console.log("mysql 연동하여 회원 존재여부 확인");
        
        

        // mysql 연동
        var sql = "select * from hclass where id='"+params.m_id+"' and pass='"+params.m_pw+"'";
        // console.log(sql);
        con.query(sql, function(error, record, fields){
            if(error){
                console.log("쿼리 실행 실패", error);
            }else{
                // console.log("record : ", record);
                if(record.length==0){
                    // 로그인 실패 시
                    console.log("회원 인증실패");
                    res.end("<script>alert('회원정보가 일치하지 않습니다.'); history.back();</script>");
                }else{
                    // 로그인 성공 시 
                    console.log("회원 인증성공");
                    res.end("<script>alert('로그인을 성공하셨습니다.')</script>");
                }
            }
        });
        // var sql = "select * from hclass where id='파라미터ID값' and pass='파라미터pass값'";
    }else if(result.pathname=="/board"){
        console.log("게시판 화면");
        res.end("미구현..");
    }else if(result.pathname=="/loginForm"){
        // 우리가 제작한 loginForm.html은 로컬 파일로 열면 안되고,
        // 모든 클라이언트가 인터넷 상의 주소로 접근하게 하기 위해서
        // 서버가 html내용을 읽고, 그 내용을 클라이언트로 보내야 한다.
        fs.readFile("./loginForm.html", "utf-8", function(error, data){
            if(error){
                console.log("error 발생!/",error);
            }else{
                // 읽기 성공이므로, 클라이언트의 응답정보로 보내자
                // HTTP 프로토콜로 데이터를 주고 받을때는, 이미 정해진 규약이 있으므로 눈에 보이지않는
                // 수많은 설정 정보값들을 서버와 클라이언트간 교환한다
                res.end(data);
            }
        })
    }

    // 전체 url중에서도 uri만 추출해보자!
    // 따라서, 전체 url을 해석해야한다.. 해석은 parsing한다고 한다.
});

// mysql 접속
function connectDB(){
    con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}

// 서버가동
server.listen(port, function(){
    console.log("Server is running at 8888...");
    connectDB(); //웹서버가 가동되면, mysql을 접속해놓자
});

