//  ______________________
// |                      |
// |  DISPLAY THE USER    |
// |  CURRENT TIMESTAMP   |
// |      HUZZAH!         |
// |______________________|
// (\__/) ||
// (•ㅅ•) ||
// / 　 づ
var local=new Date();
if((local.getHours())<10){
	document.getElementById("zero-hour").innerHTML='0';
}
document.getElementById("hour").innerHTML=local.getHours();
if((local.getMinutes())<10){
	document.getElementById("zero-minute").innerHTML='0';
}
document.getElementById("minute").innerHTML=local.getMinutes();
document.getElementById("day").innerHTML=local.getDate();
//getMonth runs 0-11, add+1 to correct month, if less than 10 add 0 before it
if((local.getMonth()+1)<10){
	document.getElementById("double-months").innerHTML='0';
}
document.getElementById("month").innerHTML=local.getMonth()+1;
document.getElementById("year").innerHTML=local.getFullYear();
//  ______________________
// |                      |
// |   DISPLAY THE USER   |
// |   TIMESTAMP IN ZULU  |
// |      TEHE!           |
// |______________________|
// (\__/) ||
// (•ㅅ•) ||
// / 　 づ
var zulu=new Date();
if((zulu.getUTCHours())<10){
	document.getElementById("zero-hour-z").innerHTML='0';
}
document.getElementById("hour-z").innerHTML=zulu.getUTCHours();
if((zulu.getUTCMinutes())<10){
	document.getElementById("zero-minute-z").innerHTML='0';
}
document.getElementById("minute-z").innerHTML=zulu.getUTCMinutes();
document.getElementById("day-z").innerHTML=zulu.getUTCDate();
//getUTCMonth runs 0-11, add+1 to correct month, if less than 10 add 0 before it
if((zulu.getUTCMonth()+1)<10){
	document.getElementById("double-months-z").innerHTML='0';
}
document.getElementById("month-z").innerHTML=zulu.getUTCMonth()+1;
document.getElementById("year-z").innerHTML=zulu.getUTCFullYear();