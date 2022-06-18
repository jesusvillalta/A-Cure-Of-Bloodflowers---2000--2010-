
function dateToICal(inDate)
{
var icaldate="";
icaldate=icaldate+inDate.getFullYear();
if (inDate.getMonth() < 9) icaldate=icaldate+"0";
icaldate=icaldate+(inDate.getMonth()+1);
if (inDate.getDate() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getDate()+"T";
if (inDate.getHours() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getHours();
if (inDate.getMinutes() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getMinutes();
if (inDate.getSeconds() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getSeconds()+"Z";
return icaldate;
}
function dateToUTCICal(inDate)
{
var icaldate="";
icaldate=icaldate+inDate.getUTCFullYear();
if (inDate.getUTCMonth() < 9) icaldate=icaldate+"0";
icaldate=icaldate+(inDate.getUTCMonth()+1);
if (inDate.getUTCDate() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCDate()+"T";
if (inDate.getUTCHours() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCHours();
if (inDate.getUTCMinutes() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCMinutes();
if (inDate.getUTCSeconds() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCSeconds()+"Z";
return icaldate;
}
function iCaltoDate(icalDate)
{
if (icalDate) {
if (icalDate.length==16) {
if (icalDate.substring(15)=="Z")
{
return new Date(icalDate.substring(0,4),
icalDate.substring(4,6)-1,
icalDate.substring(6,8),
icalDate.substring(9,11),
icalDate.substring(11,13),
icalDate.substring(13,15), 0);
}
}
}
return null;
}
function iCaltoUTCDate(icalDate)
{
if (icalDate) {
if (icalDate.length==16) {
if (icalDate.substring(15)=="Z")
{
return new Date(Date.UTC(icalDate.substring(0,4),
icalDate.substring(4,6)-1,
icalDate.substring(6,8),
icalDate.substring(9,11),
icalDate.substring(11,13),
icalDate.substring(13,15), 0));
}
}
}
return null;
}
function floorHour(date) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
date.getHours(), 0, 0, 0);
}
function floorDay(date) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
0, 0, 0, 0);
}
function floorHybridDay(date) {
return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 
date.getDate(), 0, 0, 0, 0));
}
function floorMonth(date) {
return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}
function addDay(date) {
return addDays(date, 1);
}
function addDays(date, num) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate()+num,
date.getHours(), date.getMinutes(), date.getSeconds(), 
date.getMilliseconds());
}
function addHour(date) {
return addHours(date, 1);
}
function addHours(date, num) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
date.getHours()+num, date.getMinutes(), date.getSeconds(), 
date.getMilliseconds());
}
function addRealHours(date, num) {
return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
date.getUTCDate(), date.getUTCHours()+num, date.getUTCMinutes(), 
date.getUTCSeconds(), date.getUTCMilliseconds()));
}
function addMinutes(date, num) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
date.getHours(), date.getMinutes()+num, date.getSeconds(),
date.getMilliseconds());
}
function addRealMinutes(date, num) {
return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()+num, 
date.getUTCSeconds(), date.getUTCMilliseconds()));
}
function addMonth(currentDate) {
return addMonths(currentDate, 1);
}
function addMonths(date, num) {
return new Date(date.getFullYear(), date.getMonth()+num, date.getDate(),
date.getHours(), date.getMinutes(), date.getSeconds(), 
date.getMilliseconds());
}
function addYear(date) {
return new Date(date.getFullYear()+1, date.getMonth(), date.getDate(),
date.getHours(), date.getMinutes(), date.getSeconds(),
date.getMilliseconds());
}
function ceilHour(date) {
var ret=date;
if(date.getMinutes() > 0) {
ret=addMinutes(date, 60);
}
return floorHour(ret);
}
function getWeekStartDate(start_day, date) {
var adjustedStartDay=new Date(date);
var adjStartDay=date.getDay()+1;
var dateDiff=Math.abs(adjStartDay - start_day);
if(adjStartDay!=start_day) {
if(start_day < adjStartDay) {
adjustedStartDay=addDays(date, -dateDiff);
} else {
adjustedStartDay=addDays(date, dateDiff - 7);
}
}
return adjustedStartDay;
}
function getDayDiff(first, second) {
return Math.floor(getMinuteDiff(first, second) / 1440);
}
function getHourDiff(first, second) {
return Math.floor(getMinuteDiff(first, second) / 60);
}
function getMinuteDiff(first, second) {
return Math.floor((first.valueOf() - second.valueOf()) / 60000)+second.getTimezoneOffset() - first.getTimezoneOffset();
}
function getUnadjustedHourDiff(first, second) {
return Math.floor(getUnadjustedMinuteDiff(first, second) / 60);
}
function getUnadjustedMinuteDiff(first, second) {
return Math.floor((first.valueOf() - second.valueOf()) / 60000);
}
Array.prototype.exists=function (x) {
for (var i=0; i < this.length; i++) {
if (this[i]==x) return true;
}
return false;
}
Date.prototype.formatDate=function (input,time) {
var switches=["a", "A", "B", "d", "D", "F", "g", "G", "h", "H",
"i", "j", "l", "L", "m", "M", "n", "O", "r", "s",
"S", "t", "U", "w", "W", "y", "Y", "z"];
var daysLong=["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"];
var daysShort=["Sun", "Mon", "Tue", "Wed",
"Thu", "Fri", "Sat"];
var monthsShort=["Jan", "Feb", "Mar", "Apr",
"May", "Jun", "Jul", "Aug", "Sep",
"Oct", "Nov", "Dec"];
var monthsLong=["January", "February", "March", "April",
"May", "June", "July", "August", "September",
"October", "November", "December"];
var daysSuffix=["st", "nd", "rd", "th", "th", "th", "th", 
"th", "th", "th", "th", "th", "th", "th", 
"th", "th", "th", "th", "th", "th", "st", 
"nd", "rd", "th", "th", "th", "th", "th", 
"th", "th", "st"];                        
function a() {
return self.getHours() > 11? "pm" : "am";
}
function A() {
return self.getHours() > 11? "PM" : "AM";
}
function B(){
var off=(self.getTimezoneOffset()+60)*60;
var theSeconds=(self.getHours() * 3600)+(self.getMinutes() * 60)+self.getSeconds()+off;
var beat=Math.floor(theSeconds/86.4);
if (beat > 1000) beat -=1000;
if (beat < 0) beat+=1000;
if ((""+beat).length==1) beat="00"+beat;
if ((""+beat).length==2) beat="0"+beat;
return beat;
}
function d() {
return new String(self.getDate()).length==1?
"0"+self.getDate() : self.getDate();
}
function D() {
return daysShort[self.getDay()];
}
function F() {
return monthsLong[self.getMonth()];
}
function g() {
return self.getHours() > 12? self.getHours()-12 : (self.getHours()==0? self.getHours()+12 : self.getHours());
}
function G() {
return self.getHours();
}
function h() {
if (self.getHours() > 12) {
var s=new String(self.getHours()-12);
return s.length==1?
"0"+(self.getHours()-12) : self.getHours()-12;
} else {
var s=new String(self.getHours());
return s.length==1?
"0"+self.getHours() : self.getHours();
}
}
function H() {
return new String(self.getHours()).length==1?
"0"+self.getHours() : self.getHours();
}
function i() {
return new String(self.getMinutes()).length==1?
"0"+self.getMinutes() : self.getMinutes();
}
function j() {
return self.getDate();
}
function l() {
return daysLong[self.getDay()];
}
function L() {
var y_=Y();
if ((y_ % 4==0 && y_ % 100!=0) ||
(y_ % 4==0 && y_ % 100==0 && y_ % 400==0)) {
return 1;
} else {
return 0;
}
}
function m() {
return self.getMonth() < 9?
"0"+(self.getMonth()+1) :
self.getMonth()+1;
}
function M() {
return monthsShort[self.getMonth()];
}
function n() {
return self.getMonth()+1;
}
function O() {
var os=Math.abs(self.getTimezoneOffset());
var h=""+Math.floor(os/60);
var m=""+(os%60);
h.length==1? h="0"+h:1;
m.length==1? m="0"+m:1;
return self.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
}
function r() {
var r; 
r=D()+", "+j()+" "+M()+" "+Y()+" "+H()+":"+i()+":"+s()+" "+O();
return r;
}
function S() {
return daysSuffix[self.getDate()-1];
}
function s() {
return new String(self.getSeconds()).length==1?
"0"+self.getSeconds() : self.getSeconds();
}
function t() {
if (n()-1==1) return 28+L(); 
switch ((n()-1) % 2) { 
case 0 : return 31; break;
default : return 30;
}
}
function U() {
return Math.round(self.getTime()/1000);
}
function W() {
var beforeNY=364+L() - z();
var afterNY=z();
var weekday=w()!=0?w()-1:6; 
if (beforeNY <=2 && weekday <=2-beforeNY) {
return 1;
}
var ny=new Date("January 1 "+Y()+" 00:00:00");
var nyDay=ny.getDay()!=0?ny.getDay()-1:6;
if ((afterNY <=2) &&
(nyDay >=4)  &&
(afterNY >=(6-nyDay))) {
var prevNY=new Date("December 31 "+(Y()-1)+" 00:00:00");
return prevNY.formatDate("W");
}
if (nyDay <=3) {
return 1+Math.floor((z()+nyDay) / 7);
} else {
return 1+Math.floor((z() - (7 - nyDay)) / 7);
}
}
function w() {
return self.getDay();
}
function Y() {
if (self.getFullYear) {
var newDate=new Date("January 1 2001 00:00:00 +0000");
var x=newDate .getFullYear();
return self.getFullYear();
}
var x=self.getYear();
var y=x % 100;
y+=(y < 38) ? 2000 : 1900;
return y;
}
function y() {
var y=Y()+"";
return y.substring(y.length-2,y.length);
}
function z() {
var t=new Date("January 1 "+Y()+" 00:00:00");
var diff=self.getTime() - t.getTime();
return Math.floor(diff/1000/60/60/24);
}
var self=this;
if (time) {
var prevTime=self.getTime();
self.setTime(time);
}
var ia=input.split("");
var ij=0;
while (ia[ij]) {
if (ia[ij]=="\\") {
ia.splice(ij,1);
} else {
if (switches.exists(ia[ij])) {
ia[ij]=eval(ia[ij]+"()");
}
}
ij++;
}
if (prevTime) {
self.setTime(prevTime);
}
return ia.join("");
}
function containsLetters(string) {
string=string.toUpperCase();
for(var i=0; i<string.length; i++) {
var c=string.charCodeAt(i);
if ((c >=65) && (c <=90)) {
return true;
}
}
return false;
}
function fillZeros(instring) {
var returnVal;
if (instring < 10 || instring.length < 2) {
returnVal="0"+instring;
} else {
returnVal=instring;
}
return returnVal;
}
function getCharType(thechar) {
if ((thechar==null) || (thechar=="")) {
return "eol"; 
}
var charCode=thechar.charCodeAt(0);
if ((charCode >=48) && (charCode <=57)) {
return "n"; 
} else if (charCode==32) {
return "s"; 
} else if (charCode==58) {
return "c"; 
} else if ((charCode==65) || (charCode==97)) {
return "a"; 
} else if ((charCode==80) || (charCode==112)) {
return "p"; 
} else if (charCode==47) {
return "fs"; 
} else {
return "e"; 
}
}
function createDateFromStrings(date, time, date_format) {
var ret=null;
var indate=date;
var intime=time.toUpperCase();
var finished=false; 
var state="start"; 
var currentPosition=0; 
var currentCharacter=""; 
var month="";
var day="";
var year="";
var error=false;
var y2k_break=100;
var todays_date=new Date();
var this_year=(todays_date.getYear()<1000)?(todays_date.getYear()+1900):todays_date.getYear(); 
while (indate.indexOf('.') > -1) {
indate=indate.replace('.', '/');
}
while (indate.indexOf('-') > -1) {
indate=indate.replace('-', '/');
}
if (containsLetters(indate)) {
if (indate.indexOf(",")==-1) {
indate=indate+", "+this_year;
}
var jscript_date=new Date(indate);
if (!(isNaN(jscript_date))) {
month=parseInt(jscript_date.getMonth()+1);
day=jscript_date.getDate();
year=(jscript_date.getYear()<1000)?(jscript_date.getYear()+1900):jscript_date.getYear();
finished=true;
}
}
while (!(finished)) {
switch (state) {
case 'start':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
if (date_format=="%d/%m/%Y") {
day=day+currentCharacter;
state="day";
} else {
month=month+currentCharacter;
state="month";
}
break;
case 'fs':
error=true;
finished=true;
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
error=true;
finished=true;
break;
}
break;
case 'month':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
month=month+currentCharacter;
break;
case 'fs':
if (date_format=="%d/%m/%Y")
state="year";
else
state="day";
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
if (date_format=="%d/%m/%Y") {
year=this_year;
finished=true;
} else {
error=true;
finished=true;
}
break;
}
break;
case 'day':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
day=day+currentCharacter;
break;
case 'fs':
if (date_format=="%d/%m/%Y")
state="month";
else
state="year";
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
if (date_format=="%d/%m/%Y") {
error=true;
finished=true;
} else {
year=this_year;
finished=true;
}
break;
}
break;
case 'year':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
year=year+currentCharacter;
break;
case 'fs':
error=true;
finished=true;
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
}
}
if(((month > 12) || (month.length > 2)) ||
((day > 31) || (day.length > 2)) ||
(year.length > 4)) {
error=true;
}
if (!error) {
if (year.length==1)
{
if(year < y2k_break)
{
year="200"+year;
}
else
{
year="190"+year;
}
}
else if (year.length==2)
{
if(year < y2k_break)
{
year="20"+year;
}
else
{
year="19"+year;
}
}
var final_date=new Date(fillZeros(month)+"/"+fillZeros(day)+"/"+fillZeros(year));
if(!isNaN(final_date))
{
ret=final_date;
}
}
if(!error) {
finished=false; 
state="start"; 
currentPosition=0; 
currentCharacter=""; 
var hour="";
var minute="";
var afternoon=null;
while (!(finished)) {
switch (state) {
case 'start':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
hour=hour+currentCharacter;
state="hour";
break;
case 's':
break;
case 'c':
hour="0";
state="minute";
break;
case 'a':
error=true;
finished=true;
break;
case 'p':
error=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
error=true;
finished=true;
break;
}
break;
case 'hour':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
hour=hour+currentCharacter;
break;
case 's':
break;
case 'c':
state="minute";
break;
case 'a':
afternoon=false;
finished=true;
break;
case 'p':
afternoon=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
case 'minute':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
minute=minute+currentCharacter;
break;
case 's':
break;
case 'c':
state="second";
break;
case 'a':
afternoon=false;
finished=true;
break;
case 'p':
afternoon=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
case 'second':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
break;
case 's':
break;
case 'c':
error=true;
finished=true;
break;
case 'a':
afternoon=false;
finished=true;
break;
case 'p':
afternoon=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
}
}
if ((hour > 24) || (minute > 59)) { 
error=true;
}
if(parseInt(hour) < 12 && afternoon!=null && afternoon) {
hour=""+(parseInt(hour)+12);
}
if(parseInt(hour)==12 && afternoon!=null && !afternoon) {
hour="0";
}
if (!error) {
if (minute=="") { minute="0"; } 
ret.setHours(hour);
ret.setMinutes(minute);
} else {
ret=null;
}
}
return ret;
}
function checkTimezone() {
var tzid=parseInt(user_prefs.timezone);
if(tzid > 26 && tzid < 35 && tzid!=29 && tzid!=32) {
var st_off=new Date("02/01/2007 12:00").getTimezoneOffset();
var old_dst_off=new Date("04/30/2007 12:00").getTimezoneOffset();
var new_dst_off=new Date("03/31/2007 12:00").getTimezoneOffset();
var st=undefined;
var dst=undefined;
switch(tzid) {
case 27:		
st=240;
dst=180;
break;
case 28:		
st=300;
dst=240;
break;
case 30:		
st=360;
dst=300;
break;
case 31:		
st=420;
dst=360;
break;
case 33:		
st=480;
dst=420;
break;
case 34:		
st=540;
dst=480;
break;
}
if(st!=undefined && dst!=undefined) {
if(st_off==st && old_dst_off==dst && new_dst_off!=dst) {
}
}
}
}
