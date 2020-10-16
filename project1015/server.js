var http = require("http");
var url = require("url");
var fs = require("fs");
var ejs = require("ejs");
var mysql = require("mysql");
var qs = require("querystring");
const { uptime } = require("process");
let con; //mysql connection객체
var urlJson;

var server =http.createServer(function(req, res){
    // 요청 구분
    urlJson=url.parse(req.url, true);    
    console.log(urlJson);
    if(urlJson.pathname=="/"){//"메인을 요청하면"
        fs.readFile("./index.html","utf-8", function(error, data){
            if(error){
                console.log("index 파일 읽기 실패");
            }else{
                res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                res.end(data);
            }
        });
    }else if(urlJson.pathname=="/member/registForm"){//가입폼을 요청하면
        registForm(req ,res);
    }else if(urlJson.pathname=="/member/regist"){ // 가입을 요청하면..
        regist(req ,res);
    }else if(urlJson.pathname=="/member/loginForm"){ // 로그인 폼을 요청하면..

    }else if(urlJson.pathname=="/member/list"){ //회원 목록을 요청하면
        getList(req ,res);
    }else if(urlJson.pathname=="/member/detail"){//회원정보 보기를 요청하면..
        getDetail(req ,res);
    }else if(urlJson.pathname=="/member/del"){ //회원정보 삭제를 요청
        del(req, res);
    }else if(urlJson.pathname=="/member/edit"){//회원정보 수정를 요청
        update(req, res);
    }else if(urlJson.pathname=="/category"){ //동물구분을 요청하면
        getCategory(req, res);
    }else if(urlJson.pathname="/animal"){
        getAnimal(req, res);
    }   
});

// 데이터베이스 연동인 경우엔 함수에 별도로 정의
function registForm(req ,res){
    // 회원가입폼은 디자인을 표한하기 위한 파일이므로, 기존에는 html로 충분했으나..
    // 보유기술은 DB의 데이터를 가져와서 반영해야하므로, ejs로 처리해야함..
    var sql = "select * from skill";
    con.query(sql, function(error, record, fields){
        if(error){
            console.log("skill 조회 실패:", error);
        }else{
            // console.log("skill record : ", record);
            
            // registForm.ejs에게 json배열을 전달하자
            fs.readFile("./registForm.ejs", "utf-8", function(error, data){
                if(error){
                    console.log("registForm 파일 읽기 실패 : ", error);
                }else{
                    res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                    res.end(ejs.render(data, {
                        skillArray:record
                    }));
                }
            });
        }
    });
}

// 회원등록 처리
function regist(req, res){
    // post방식으로 전송된, 파라미터받기!!
    // body에 있는 파라미터받기
    // url모듈에게 파싱을 처리하게 하지말고, querystring 모듈로 처리한다.
        req.on("data", function(param){
        // console.log(new String(param).toString()); //알아볼수 없는 인코딩 데이터로 넘어옴 -> 문자열화
        // 디코드는 성공했지만 파싱이 안되었음 -> querystring 쓰는 이유
        var postParam = qs.parse(new String(param).toString());
        
        var sql = "insert into member2(uid, password, uname, phone, email, receive, addr, memo)";
        sql += " values(?, ?, ?, ?, ?, ?, ?, ?)";

        con.query(sql, 
            [postParam.uid
            , postParam.password
            , postParam.uname
            , postParam.phone
            , postParam.email
            , postParam.receive
            , postParam.addr
            , postParam.memo], function(error, fields){
                if(error){
                    console.log("등록실패", error);
                }else{
                    // 목록페이지 보여주기
                    // 등록되었음을 alert()으로 알려주고, /member/list로 재접속
                    res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
                    var tag = "<script>";
                    tag += "alert('등록성공');";
                    tag += "location.href='/member/list'";
                    tag += "</script>";
                    res.end(tag);
                }
            });

    });
}

function getList(req, res){
    // 회원목록 가져오기
    var sql = "select  * from member2";
    con.query(sql, function(error, record, fields){
        fs.readFile("./list.ejs", "utf8", function(error, data){
            if(error){
                console.log("list 파일읽기실패 : ", error);
            }else{
                res.writeHead(200,{"Content-Type":"text/html; charset=utf8"});
                res.end(ejs.render(data,{
                    memberArray:record
                }));
            }
        })
    })
}

function getDetail(req ,res){
    // var urlJson = url.parse(req.url, true);
    // console.log(urlJson.query.member2_id);
    var sql = "select * from member2 where member2_id="+urlJson.query.member2_id;
    con.query(sql, function(error, record, fields){
        if(error){
            console.log("member2 조회 실패 : ", error);
        }else{
            console.log("record : ",record);
            fs.readFile("./detail.ejs", "utf-8", function(error, data){
                if(error){
                    console.log("detail 파일열기 실패 : ", error);
                }else{
                    res.writeHead(200,{"Content-Type":"text/html; charset=utf8"});
                    res.end(ejs.render(data, {                                                                                                                                                                                            
                        member:record[0]
                    }));
                }
            });
        }
    });
}

//회원 1명 삭제
function del(req, res){
    // get 방식으로 전달된 파라미터 받기
    var member2_id = urlJson.query.member2_id;
    var sql = "delete from member2 where member2_id="+member2_id;

    //error, fields : DML (insert, update, delete)
    //error, record, fields : select
    con.query(sql, function(error, fields){
        if(error){
            console.log("삭제 실패 : ", error);
        }else{
            // alert 띄우고, 회원 목록 보여주기
            res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
            var tag = "<script>";
            tag += "alert('회원탈퇴 완료!');";
            tag += "location.href='/member/list'";
            tag += "</script>"
            res.end(tag);
        }
    });
}

// 회원정보 수정처리 
function update(req, res){  
    // post로 전송된 파라미터들을 받자!!
    req.on("data", function(param){
        // console.log(param); 인코딩된 상태의 파라미터들
        //스트링으로 디코딩하고 querystring으로 파싱
        var postParam = qs.parse(new String(param).toString()); 
        var sql = "update member2 set phone=?, email=?, addr=?, memo=?";
        sql += ", password=?, receive=? where member2_id=?";
        
        con.query(sql, [
            postParam.phone,
            postParam.email,
            postParam.addr,
            postParam.memo,
            postParam.password,
            postParam.receive,
            postParam.member2_id
        ], function(error, fields){
            if(error){
                console.log("수정 실패 : ", error);
            }else{
                res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                var tag = "<script>";
                tag += "alert('회원정보 수정완료!');";
                tag += "location.href='/member/detail?member2_id="+postParam.member2_id+"';";
                tag += "</script>"
                res.end(tag);
            }
        });
        // console.log(postParam);
        // 검증용
        // var sql = "update member2 set phone='"+postParam.phone+"', email='"+postParam.email+"', memo='"+postParam.memo+"'";
        // sql += ", password='"+postParam.password+"', receive='"+postParam.receive+"' where member2_id=?";
    });
    
}

// 카테고리의 종류 가져오기
function getCategory(req, res){
    var sql = "select * from category";

    con.query(sql, function(error, record, fields){
        if(error){
            console.log("동물구분 목록 조회실패", error );
        }else{
            fs.readFile("./animal.ejs", "utf-8", function(err, data){
                if(err){
                    console.log("animal.ejs 파일 읽기 실패", err);
                }else{
                    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                    res.end(ejs.render(data, {
                        categoryArray:record
                    }));
                }
            });
        }
    });
}

// 동물의 목록 가져오기
function getAnimal(req, res){
    var sql = "select * from category";

    con.query(sql, function(error, record, fields){
        if(error){
            console.log("동물구분 목록 조회실패 ", error);
        }else{
            var categoryRecord=record; //카테고리 목록 배열
            var category_id = urlJson.query.category_id; // get방식의 category_id 파라미터 받기
            sql = "select * from animal where category_id="+category_id;
        
            // mysql 연동
            con.query(sql, function(error, record, fields){
                if(error){
                    console.log("동물목록 가져오기 실패 ", error);
                }else{
                    console.log("record : ", record);
                    fs.readFile("./animal.ejs", "utf-8", function(err, data){
                        if(err){
                            console.log("animal.ejs 가져오기 실패", err);
                        }else{
                            res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
                            res.end(ejs.render(data, {
                                animalArray:record,
                                categoryArray:categoryRecord,
                                category_id:category_id
                            }));
                        }
                    });
                }
            });
        }
    });
}

// mysql 접속
function connect(){
    con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}

server.listen(7788, function(){
    console.log("My Server is running at 7788...");
    connect();
});