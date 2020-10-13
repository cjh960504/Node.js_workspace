// 웹 서버 구축
var http = require("http");
var mysql = require("mysql");
const { parse } = require("path");
var url = require("url");
var fs = require("fs");

var con; //mysql 접속 성공 시 그 정보를 보유한 객체. 해당 객체가 있어야 접속된 상태에서
// 쿼리문을 수행할 수 있다.
var port = 9999;

var server = http.createServer(function(req, res){
    
    res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});

    // 클라이언트가 원하는 것이 무엇인지를 구분하기 위한 url분석
    console.log("URL : ", req.url); //한줄로 되어 있어서, 구분을 못함

    // 섞여있는 url을 parsing하기 위해서 전담 모듈을 이용해서 uri와 parameter를 분리
    // 분석(파싱) 시 true를 매개변수로 전달하면, 파라미터들을 {Json}으로 묶어준다.
    // 장점? 다루기 쉬워짐 (객체 표기법), 배열보다 낫다
    var parseObj = url.parse(req.url, true);
    console.log(parseObj);

    // console.log("URL분석결과 =>", parseObj);
    if(parseObj.pathname=="/member/registForm"){
        fs.readFile("./registForm.html","utf-8", function(error, data){
            if(error){
                console.log("파일 읽기 에러 : ", error);
            }else{
                res.end(data);
            }
        });
    }else if(parseObj.pathname=="/member/regist"){ //회원가입을 원하면
        // mysql에 insert할 예정
        // 클라이언트의 브라우저에서 전송되어온 파라미터(변수)들을 받아보자!
        var params = parseObj.query;
        
        var sql="insert into member2(uid,password,uname,phone,email,receive,addr,memo)";
        sql+=" values(?,?,?,?,?,?,?,?)"; //바인드 변수를 이용

        con.query(sql,[params.uid, params.password, params.uname, 
            params.phone, params.email, params.receive, params.addr, 
            params.memo]
            , function(error, result, fields){
                if(error){
                    console.log("등록 실패 : ", error);
                }else{
                    var msg="<script>";
                    msg += "location.href='/member/list';";
                    // /member/list 로 재접속 (클라이언트가 지정한 주소로 재접속함)
                    msg +="</script>";
                    res.end(msg);
                }
            });

    }else if(parseObj.pathname=="/member/list"){ //회원목록을 원하면
        // mysql에 select할 예정
        var sql = "select * from member2";
        var tag;
        con.query(sql, function(error, record, fields){
            if(error){
                console.log("가져오기 실패 : ", error);
            }else{
                tag="<table border='1px' width='80%'>";
                tag+="<tr>";
                tag+="<th>member2_id</th>";
                tag+="<th>uid</th>";
                tag+="<th>password</th>";
                tag+="<th>uname</th>";
                tag+="<th>phone</th>";
                tag+="<th>email</th>";
                tag+="<th>receive</th>";
                tag+="<th>addr</th>";
                tag+="<th>memo</th>";
                tag+="</tr>";
                for(var i=0;i<record.length;i++){
                    tag+="<tr>";
                    tag+="<td>"+record[i].member2_id+"</td>";
                    tag+="<td>"+record[i].uid+"</td>";
                    tag+="<td>"+record[i].password+"</td>";
                    tag+="<td>"+record[i].uname+"</td>";
                    tag+="<td>"+record[i].phone+"</td>";
                    tag+="<td>"+record[i].email+"</td>";
                    tag+="<td>"+record[i].receive+"</td>";
                    tag+="<td>"+record[i].addr+"</td>";
                    tag+="<td>"+record[i].memo+"</td>";
                    tag+="</tr>";
                }
                tag+="</table>";
                res.end(tag);
            }
        });
    }else if(parseObj.pathname=="/member/del"){ //회원탈퇴
        res.end("회원삭제");
    }else if(parseObj.pathname=="/member/edit"){ //회원수정
        res.end("회원수정");
    }
    
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

server.listen(port, function(){
    console.log("Web Server is running at port "+port);
    connectDB();
});
