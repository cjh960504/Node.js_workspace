/*
Node.js에서 오라클과 연동해보자!!
*/ 

// 오라클을 접속하려면, 접속을 담당하는 모듈을 사용해야한다.
// 우리가 node.js를 설치하면 아주 기본적인 모듈만 내장되어 있기 때문에
// 개발에 필요한 모듈은 그때 그때 다운으로 받아 설치해야한다!! (인기비결)

var oracledb = require("oracledb");

// 변경할 목적의 데이터가 아니라면, 상수로 선언하자!
let conStr = {
    user:"user0907",
    password:"1234",
    connectionString:"localhost/XE"    
}; //오라클에 접속할 때 필요한 정보!!

// 오라클에 접속을 시도해본다!!
// 콜백함수
oracledb.getConnection(conStr, function(error, con){
    if(error){ //실패 시
        console.log("접속 실패 : ", error);
    }else{
        // 테이블에 데이터를 넣어보자!
        // 접속객체를 이용하여 insert쿼리를 날려보자!
        console.log("접속 성공");
        insert(con);
    }
});

function insert(con){
    var sql = "insert into member2(member2_id, firstname, lastname, local, msg)";
    sql += "values(seq_member2.nextval, 'JunHyuk', 'Choi', 'America', 'Hello ORACLE!')";
    
    // 쿼리 실행
    con.execute(sql, function(error, result, fields){
        if(error){
            console.log("삽입 실패 : ", error);
        }else{
            console.log("삽입 성공");
        }
    });
}