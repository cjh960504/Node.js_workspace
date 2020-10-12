/*
node.js 자체적으로 지원하는 전역변수를 알아본다.
1) __dirname : 현재 실행중인 js파일의 풀 경로 반환
2) __filename : 파일명 반환


// console.log("지금 실행 중인 파일명은 : ", __filename);
// console.log("지금 실행 중인 파일의 디렉토리는 : ", __dirname);

node.js 자체적으로 지원하는 전역객체를 알아본다.
1) console
2) exports
3) module
4) process
5) global
*/ 

//console 객체
// 실행 시 시작 시간을 출력
// console.time("myCPU"); //원하는 제목을 넣어줄 수 있다.
// var sum=0;
// for(var i=1;i<=1000000;i++){
// }
// console.log("수행완료");
// console.timeEnd("myCPU");

//process 객체
console.log(process.arch); //cpu에 대한 정보
// console.log(process.env); //환경변수 정보
console.log(process.platform); //환경변수 정보