/*웹서버 구축하기*/ 
// 모듈이란? 기능을 모아놓은 자바스크립트 파일
var http = require("http"); // http 내부 모듈 
var url = require("url"); //url 분석모듈
var fs = require("fs"); //file system
var mysql = require("mysql");
var ejs = require("ejs"); //node 서버에서만 실행가능한 문서
                                    // html로 채워졌다고 하여, html문서로 보면 안됨.

var port = 7878;

// mysql 접속 문자열
let conStr = {
    url:"localhost",
    user:"root",
    password:"1234",
    database:"node"
};
var con; //mysql 접속 정보를 가진 객체, 이 객체로 sql문 수행가능


// 서버 객체 생성
var server = http.createServer(function(req, res){
    
    // 클라이언트가 원하는 요청을 처리하려면, URL을 분석하여 URI추출해서 조건을 따져보자
    var urlJson = url.parse(req.url, true); //분석결과를 json으로 반환해줌
    console.log("URL 분석 결과는 ", urlJson);
    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
    
    if(urlJson.pathname=="/"){
        fs.readFile("./index.html", "utf-8", function(error, data){
            if(error){
                console.log("index 파일 읽기 에러 :" ,error);
            }else{
                res.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/registForm"){
        fs.readFile("./registForm.html", "utf-8", function(error, data){
            if(error){
                console.log("registForm 읽기 에러 :" ,error);
            }else{
                res.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/loginForm"){
        fs.readFile("./loginForm.html", "utf-8", function(error, data){
            if(error){
                console.log("loginForm 읽기 에러 :" ,error);
            }else{
                res.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/regist"){
        // 브라우저에서 전송된 파라미터를 먼저 받아야 된다.
        // get방식의 파라미터 받기
        // 회원정보는 member2 테이블에 넣고
        var params = urlJson.query;
        var sql = "insert into member2(uid, password, uname, phone, email, receive, addr, memo)";
        sql += " values(?, ?, ?, ?, ?, ?, ? ,?)"; //물음표는 바인드 변수를 의미
        

        con.query(sql,
            [params.uid, 
            params.password, 
            params.uname, 
            params.phone, 
            params.email, 
            params.receive, 
            params.addr,
            params.memo], function(error, result, fields){
                if(error){
                    console.log("회원정보 insert 실패 : ", error);
                }else{
                    // mysql에서 지원하는 last_insert_id()를 조회해서 
                    // 방금 insert된 회원의 pk를 조회해보자
                    sql = "select last_insert_id() as member2_id";

                    con.query(sql, function(error, record, fields){
                        if(error){
                            console.log("pk가져오기 실패 : ", error);
                        }else{
                            // member2 정보가 insert 성공 시 
                            // 스킬정보는 member_skill에 넣자(배열 길이만큼)
                            // console.log("record : ", record);
                            var member2_id = record[0].member2_id;
                            for(var i=0;i<params.skill_id.length;i++){
                                sql = "insert into member_skill(member2_id, skill_id) values("+member2_id+","+params.skill_id[i]+")";
                                // console.log("스킬 등록 쿼리 : ", sql);
                                // 쿼리 실행
                                con.query(sql, function(err){
                                    if(err){
                                        console.log("회원정보 등록 실패");
                                    }else{
                                        res.end("회원정보 등록 완료")
                                    }
                                });
                            }
                        }
                    }); //select 쿼리문 수행

                    
                    
                }
            });
    }else if(urlJson.pathname=="/member/list"){
        // 회원목록보여주기
        var sql = "select * from member2";
        con.query(sql, function(error, record, fields){
            if(error){

            }else{
                 // console.log("회원목록 : ", record);
                // 테이블로 구성하여 출력
                var tag = "<table width='100%' border='1px'>";
                tag +="<tr>";
                tag +="<th>member2_id</th>";
                tag +="<th>uid</th>";
                tag +="<th>password</th>";
                tag +="<th>uname</th>";
                tag +="<th>phone</th>";
                tag +="<th>email</th>";
                tag +="<th>receive</th>";
                tag +="<th>addr</th>";
                tag +="<th>memo</th>";
                tag +="</tr>";

                for(var i=0;i<record.length;i++){
                    tag +="<tr>";
                    tag +="<td><a href='/member/detail?member2_id="+record[i].member2_id+"'>"+record[i].member2_id+"</a></td>"
                    tag +="<td>"+record[i].uid+"</td>"
                    tag +="<td>"+record[i].password+"</td>"
                    tag +="<td>"+record[i].uname+"</td>"
                    tag +="<td>"+record[i].phone+"</td>"
                    tag +="<td>"+record[i].email+"</td>"
                    tag +="<td>"+record[i].receive+"</td>"
                    tag +="<td>"+record[i].addr+"</td>"
                    tag +="<td>"+record[i].memo+"</td>"
                    tag +="</tr>";
                }
                tag += "<tr>";
                tag += "<td colspan='9'><a href='/'>메인으로</a></td>";
                tag += "</tr>";
                tag += "</table>";
                
                res.end(tag);
            }
        });
    }else if(urlJson.pathname=="/member/detail"){ //회원의 상세정보
        var member2_id = urlJson.query.member2_id;
        var sql = "select * from member2 where member2_id="+member2_id;
        con.query(sql ,function(error, record, fields){
            if(error){
                console.log("회원 상세조회 실패 : ", error);
            }else{
                var member = record[0];
                fs.readFile("./detail.ejs", "utf-8", function(error, data){
                    if(error){
                        console.log("detail.html 읽기 실패 : ", error);
                    }else{
                        res.end(ejs.render(data, { //detail.ejs에게 json형태의 데이터(변수에 담긴)를 보낸다 
                            uid:member.uid,
                            uname:member.uname,
                            phone:member.phone,
                            addr:member.addr,
                            memo:member.memo
                        }));
                    }
                });
            }
        });
        
    }else if(urlJson.pathname=="/fruit"){
        var f1 = "apple";
        var f2 = "banana";
        fs.readFile("./test.ejs", "utf-8", function(error, data){
            // ejs를 그냥 파일로 문자취급해서 보내면 원본 코드까지 가버리기
            // 때문에, 서버에서 실행은 한 후, 그 결과를 보내야한다..(jsp, php, asp의 원리)

            res.end(ejs.render(data,{
                "fruit":f1
            }));
        });
    }

    // 200이란?? HTTP 상태코드
    // 404 - file not found
    // 500 - critical error
    
});

function getConnection(){
    con = mysql.createConnection(conStr); //DBMS정보인 json 매개변수
}
// 서버가동
server.listen(port, function(){
    console.log("Server is running at "+port+"...");
    getConnection();
});