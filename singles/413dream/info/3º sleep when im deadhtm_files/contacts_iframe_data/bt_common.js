
var framePath;
var topBTFrame;
var openerTopBTFrame;
var guiPrefs;
var guiAppRef;
var is_ie;
function init_common() {
framePath=getFramePath();
topBTFrame=getTopBTFrame();
if(topBTFrame.isTopBTFrame) {
openerTopBTFrame=null;
} else {
openerTopBTFrame=getOpenerTopBTFrame();
}
is_ie=(document.all) ? true:false;
}
function initTDButtons()
{
if (document.getElementsByTagName)
{
var tds=document.getElementsByTagName("td");
for (var i=0;i<tds.length;i++)
{
if (tds[i].className=='btnav')
{
tds[i].onmousedown=function(){
this.className='btnavactive';
return false
}
if (tds[i].onclick==undefined) {
tds[i].onclick=function() {eval(this.getAttribute("action")); }
}
tds[i].onmouseup=function(){this.className='btnav';return false}
tds[i].onmouseover=function(){this.className='btnavhover';return false}
tds[i].onmouseout=function(){this.className='btnav';return false}
}
}
}
}
function findFrame(cur_frame, name) {
var ret=null;
for(var x=0; x < cur_frame.window.frames.length && ret==null; x++) {
try {
if(cur_frame.window.frames[x].name==name) {
ret=cur_frame.window.frames[x];
} else {
ret=findFrame(cur_frame.window.frames[x], name);
}
} catch(e) {
}
}
return ret;
}
function findFrameByName(name) {
if(openerTopBTFrame) {
try {
return findFrame(openerTopBTFrame, name);
} catch(e) {
return findFrame(openerTopBTFrame, name);
}
} else {
return findFrame(topBTFrame, name);
}
}
function getFramePath() {
var ret=new Array();
var cur_frame;
var top_frame;
try {
if(openerTopBTFrame) {
cur_frame=top.opener;
top_frame=openerTopBTFrame;
} else {
cur_frame=self;
top_frame=top;
}
} catch(e) {
cur_frame=self;
top_frame=top;
}
for(var x=0; x < cur_frame.parent.window.frames.length; x++) {
if(cur_frame.parent.window.frames[x]==cur_frame) {
ret.push("window.frames["+x+"]");
break;
}
}
while(cur_frame.parent!=top_frame) {
cur_frame=cur_frame.parent;
for(var x=0; x < cur_frame.parent.window.frames.length; x++) {
if(cur_frame.parent.window.frames[x]==cur_frame) {
ret.push("window.frames["+x+"]");
break;
}
}
}
ret.push("top");
ret.reverse();
return ret.join(".");
}
function getOpenerTopBTFrame(){
if(top.opener){
var curWindow=top.opener;
while(curWindow!=top.opener.top){
if(curWindow.isTopBTFrame){
return curWindow;
} else {
curWindow=curWindow.parent;
}
}
return top.opener.top;
}
return null;
}
function getTopBTFrame(){
var curWindow=window;
while(curWindow!=top){
if(curWindow.isTopBTFrame){
return curWindow;
} else {
curWindow=curWindow.parent;
}
}
return top;
}
function getParam(paramVar)
{
var qs=document.location.search.substr(1); 
var params=qs.split("&");                   
var i;                                       
var paramVal;                                
for (i=0; i<params.length; i++)
{
var nv=params[i].split("=");
if (nv[0].toLowerCase()==paramVar.toLowerCase())
{
paramVal=nv[1];
break;  
}
}
return paramVal;   
}
function updateGUISkin(flag) {
if(flag) 
{
if(!guiPrefs) {
guiPrefs=guiAppRef.getData();
}
if (arguments.length > 1)
{
for (var i=1;i<arguments.length;i++)
{
if (arguments[i].indexOf(".css") > 0)
{
loadCSS(guiPrefs.gui+"/css/"+arguments[i]);
}
}
}
else 
{
loadCSS(guiPrefs.gui+"/css/skin.css");
}            
} else 
{
var strCSSParams="";  
if (arguments.length > 1)
{
for (var i=1;i<arguments.length;i++)
{
strCSSParams+=",\""+arguments[i]+"\""; 
}
}
if(self.user_prefs) {
guiPrefs=user_prefs;
eval("updateGUISkin( true"+strCSSParams+")");
} else {  
guiAppRef=findFrameByName('userApp');
if(guiAppRef) 
{
if(guiAppRef.getUserPreferences) {
guiAppRef.getUserPreferences(framePath+".updateGUISkin(true"+strCSSParams+");");
} else {
setTimeout("updateGUISkin(false"+strCSSParams+");", 100);
}
}
}
}
}
function loadCSS(css_file) {
var head=document.getElementsByTagName("head")[0];
linkTag=document.createElement('link');
linkTag.rel='stylesheet';
linkTag.rev='stylesheet';
linkTag.type='text/css';
linkTag.href=css_file;
head.appendChild(linkTag)
}
function htmlEncode(string) {
var ret="";
if (string!=null) {
ret=string.replace(/&/g, "&amp;");
ret=ret.replace(/</g, "&lt;");
ret=ret.replace(/>/g, "&gt;");
ret=ret.replace(/"/g, "&quot;" );
    ret = ret.replace( /'/g, "&#39;" );
  }
  return ret;
}

/**
 *	UnSanitize a string with HTML characters in it such as
 *	&, <, >, and "
*
*	@param string String to UnSanitize
*
*	@return {String} UnSanitized string
*/
function htmlUnencode(string) {
if (string!=null) {
var ret=string.replace(/&lt;/g, "<");
ret=ret.replace(/&gt;/g, ">");
ret=ret.replace(/&amp;/g, "&");
ret=ret.replace(/&quot;/g, "\"");
ret=ret.replace(/&#39;/g, "'");
return ret;
}
}
function htmlUnencodeExtended(string) {
if(string!=null && string.length > 0) {
var ret="";
var chars=string.split("&#");
var start=1;
if(string.indexOf("&#") >=0) {
ret+=chars[0];
} else {
start=0;
}
for(var x=start; x < chars.length; x++) {
if(chars[x].match(/^\d+;/)) {
var index=chars[x].indexOf(";");
var code=parseInt(chars[x].substr(0, index));
if(code > 100) {
ret+=String.fromCharCode(code);
}
ret+=chars[x].substr(index+1);
} else {
ret+=chars[x];
}
}
return htmlUnencode(ret);
}
}
function get_value(element) {
if(element==null)
return(null);
if (element.text) {
return element.text;
}else if (element.textContent) {
return element.textContent;
}
}
function formatSize(rawNumber){
if (isNaN(rawNumber)){
return "0&nbsp;B";
}else if(rawNumber>=1073741824){
return(" "+(Math.round(10 * rawNumber / 1073741824)/10)+"&nbsp;GB");
}else if (rawNumber>512000){
return (" "+(Math.round(10 * rawNumber / 1048576)/10)+"&nbsp;MB");
}else if(rawNumber>512){
return (" "+(Math.round(rawNumber / 1024))+"&nbsp;KB");
}else{
return (" "+rawNumber+"&nbsp;B");
}
}
function formatSizePlainText(rawNumber){
if (isNaN(rawNumber)){
return "0 B";
}else if(rawNumber>=1073741824){
return((Math.round(10 * rawNumber / 1073741824)/10)+" GB");
}else if (rawNumber>512000){
return ((Math.round(10 * rawNumber / 1048576)/10)+" MB");
}else if(rawNumber>512){
return ((Math.round(rawNumber / 1024))+" KB");
}else{
return (rawNumber+" B");
}
}
function updateTitleBar(txtDefault, txtSource)
{
if (txtSource=="") {
document.title=txtDefault;
} else { 
document.title=txtSource;
}
}
function selectListMenuOption(idList,optValue)
{
var found=false;
var slctList=document.getElementById(idList);
for(var idx=0; idx < slctList.options.length && !found; idx++) {
if (slctList.options[idx].value==""+optValue) {
slctList.selectedIndex=idx;
found=true;
}
}
return found;
}
function hiliteTableHeader(tableID)
{
if (document.getElementById && document.createTextNode)
{
var dataTable=document.getElementById(tableID);
var ths=dataTable.getElementsByTagName('th');
for (var i=0;i<ths.length;i++)
{
if (ths[i].className=='')
{
ths[i].onmouseover=function(){this.className='hover';return false}
ths[i].onmouseout=function(){this.className='';return false}
ths[i].onclick=function(){sortColumn(this.id);hiliteTableHeader(tableID);}
}
else if (ths[i].className=='sortedUp')
{
ths[i].onmouseover=function(){this.className='sortedUpHover';}
ths[i].onmouseout=function(){this.className='sortedUp';}
ths[i].onclick=function(){sortColumn(this.id);hiliteTableHeader(tableID);}
}
else if (ths[i].className=='sortedDown')
{
ths[i].onmouseover=function(){this.className='sortedDownHover';}
ths[i].onmouseout=function(){this.className='sortedDown';}
ths[i].onclick=function(){sortColumn(this.id);hiliteTableHeader(tableID);}
}
}
}
}
function getCookie(name) {
var values=document.cookie.split(";");
var ret=null;
for(var x=0; x < values.length && ret==null; x++) {
var pair=values[x].split("=");
if(pair[0]==" "+name || pair[0]==name) {
ret=unescape(pair[1]);
}
}
return ret;
}
function setCookie(name, val, exp, path) {
document.cookie=name+"="+escape(val)+"; expires="+exp.toGMTString()+"; path="+path;
}
function createContainer(pid,  x, y, w, h, pclass, pdisplay) {
var element=null;
if (typeof pid=="string") {
var element=document.createElement("DIV");
if (element) {
element.id=pid;
}
}else {  
element=pid;
}
if (element) {
if (pclass!=undefined) {
if (is_ie) {
element.className=pclass;
}else {
element.setAttribute("class",pclass);
}
}
element.style.width=w+"px";
element.style.height=h+"px";
element.style.display="block";
element.style.left=x+"px";
element.style.top=y+"px";
document.body.appendChild(element);
if (pdisplay!=undefined) {
element.style.display=pdisplay;   
}
return element;
}
}
function getRealLeft(p_el) {
try {
var _xPos=p_el.offsetLeft , _tempEl=p_el.offsetParent;
while (_tempEl!=null){
_xPos+=_tempEl.offsetLeft;
_tempEl=_tempEl.offsetParent;
}
return _xPos;
} catch(e) {
return 0;
}
}
function getRealTop(p_el) {
try {
var _yPos=p_el.offsetTop , _tempEl=p_el.offsetParent;
while (_tempEl!=null) {
_yPos+=_tempEl.offsetTop;
_tempEl=_tempEl.offsetParent;
}
return _yPos;
} catch(e) {
return 0;
}
}
var _getBoundingClientRect=function (p_domElem) {
var cR=new Object;
cR.left=getRealLeft (p_domElem);
cR.top=getRealTop  (p_domElem);
cR.right=cR.left+p_domElem.offsetWidth;
cR.bottom=cR.top+p_domElem.offsetHeight;
return cR;
};
function _getPageWidth() {
return document.body.clientWidth;
}
function _getPageHeight() {
return document.body.clientHeight;
}
function getMouseX(event) {
if(document.all) {
return event.clientX+document.body.scrollLeft;
} else {
return event.pageX;
}
}
function getMouseY(event) {
if(document.all) {
return event.clientY+document.body.scrollTop;
} else {
return event.pageY;
}
}
function clearSelection() {
if (document.selection) {
document.selection.empty();
} else if(window.getSelection) {
if(window.getSelection().removeAllRanges){
window.getSelection().removeAllRanges();
}
}
}
function insideBounds(x, y, bounds) {
return x >=bounds.left && x < bounds.right && y >=bounds.top && y < bounds.bottom;
}
function stopEventPropagation(event) {
if(event) {
if(event.stopPropagation) {
event.stopPropagation();
} else {
event.cancelBubble=true;
}
}
}
function getValue(element) {
if(element) {
if(element.textContent) {
return element.textContent;
} else if(element.text) {
return element.text;
} else if(element.innerHTML){
return element.innerHTML;
}
}
return "";
}
var drag_source_x;
var drag_source_y;
var drag_classes=new Array();
var drag_current_class;
var drag_source;
var drag_target;
var drag_moved=false;
var drag_tolerance=3;
var drag_offset_x=0;
var drag_offset_y=0;
var drag_button;
var drag_start_button;
function handleDragDefault(x) {}
function DragClass(name) {
this.class_name=name;
this.drag_sources=new Array();
this.drag_targets=new Array();
this.drag_target_hilite=new Array();
this.drag_scrollable_areas=new Array();
this.drag_scrollable_bounds=new Array();
this.drag_div;
this.drag_div_width=0;
this.drag_div_height=0;
this.drag_area;
this.drag_area_bounds;
this.drag_disabled=false;
this.clientDropHandler=handleDragDefault;
this.clientDropFailHandler=handleDragDefault;
this.clientDrawingHandler=handleDragDefault;
this.clientTargetOverHandler=handleDragDefault;
this.clientTargetOutHandler=handleDragDefault;
this.clientClickHandler=handleDragDefault;
}
DragClass.prototype.setDragComponent=function(div_element) {
if(div_element) {
this.drag_div=div_element;
}
}
DragClass.prototype.setDragArea=function(element) {
if(element) {
this.drag_area=element;
this.drag_area_bounds=_getBoundingClientRect(this.drag_area);
}
}
DragClass.prototype.setDragDropHandler=function(handler) {
this.clientDropHandler=handler;
}
DragClass.prototype.setDragDropFailHandler=function(handler) {
this.clientDropFailHandler=handler;
}
DragClass.prototype.setDragDrawingHandler=function(handler) {
this.clientDrawingHandler=handler;
}
DragClass.prototype.setDragTargetOverHandler=function(handler) {
this.clientTargetOverHandler=handler;
}
DragClass.prototype.setDragTargetOutHandler=function(handler) {
this.clientTargetOutHandler=handler;
}
DragClass.prototype.setDragClickHandler=function(handler) {
this.clientClickHandler=handler;
}
DragClass.prototype.clientValidateHandler=function(element) {
return true;
}
DragClass.prototype.setDragValidateHandler=function(handler) {
this.clientValidateHandler=handler;
}
DragClass.prototype.addDragTargetElement=function(element) {
if(element) {
this.addDragTarget(new DragElement(element));
}
}
DragClass.prototype.addDragTarget=function(object) {
if(object.bounds==null) {
object.refreshBounds();
}
this.drag_targets.push(object);
this.drag_target_hilite.push(false);
}
DragClass.prototype.deleteDragTarget=function(id) {
for(var x=0; x < this.drag_targets.length; x++) {
if(this.drag_targets[x].id==id) {
this.drag_targets.splice(x, 1);
this.drag_target_hilite.splice(x, 1);
x=this.drag_targets.length;
}
}
}
DragClass.prototype.addDragSourceElement=function(element) {
if(element) {
this.addDragSource(new DragElement(element));
}
}
DragClass.prototype.addDragSource=function(object) {
if(object.bounds==null) {
object.refreshBounds();
}
var me=this;
object.element.lstId=EventListener.listen(object.element, "onmousedown", function(event) {
event.cancelBubble=true;
handleDragComponentDrag(event, me.class_name);
});
this.drag_sources.push(object);
}
DragClass.prototype.deleteDragSource=function(id) {
for(var x=0; x < this.drag_sources.length; x++) {
if(this.drag_sources[x].id==id) {
EventListener.silence(this.drag_sources[x].element, "onmousedown", this.drag_sources[x].element.lstId);
this.drag_sources.splice(x, 1);
x=this.drag_sources.length;
}
}
}
DragClass.prototype.addDragScrollableArea=function(element) {
this.drag_scrollable_areas.push(element);
this.drag_scrollable_bounds.push(_getBoundingClientRect(element));
}
DragClass.prototype.clearDragTargets=function() {
this.drag_targets=new Array();
this.drag_target_hilite=new Array();
}
DragClass.prototype.clearDragSources=function() {
this.drag_sources=new Array();
}
DragClass.prototype.clearDragAreaHandlers=function() {
if(this.drag_area) {
EventListener.silence(this.drag_area, "onmouseup", this.drag_area.mouseupID);
EventListener.silence(this.drag_area, "onmousemove", this.drag_area.mousemoveID);
}
}
DragClass.prototype.setupDragAreaHandlers=function() {
if(this.drag_area) {
this.drag_area.mouseupID=EventListener.listen(this.drag_area, "onmouseup", handleDragComponentDrop);
this.drag_area.mousemoveID=EventListener.listen(this.drag_area, "onmousemove", handleDragComponentMove);
}
}
DragClass.prototype.refreshDragScrollableAreaBounds=function() {
this.drag_scrollable_bounds=new Array();
for(var x=0; x < this.drag_scrollable_areas.length; x++) {
var bounds=_getBoundingClientRect(this.drag_scrollable_areas[x]);
this.drag_scrollable_bounds.push(bounds);
}
}
DragClass.prototype.refreshDragSourceBounds=function() {
for(var x=0; x < this.drag_sources.length; x++) {
this.drag_sources[x].refreshBounds();
}
}
DragClass.prototype.refreshDragTargetBounds=function() {
for(var x=0; x < this.drag_targets.length; x++) {
this.drag_targets[x].refreshBounds();
}
}
DragClass.prototype.clearHilighting=function() {
for(var x=0; x < this.drag_targets.length; x++) {
if(this.drag_target_hilite[x]) {
this.drag_target_hilite[x]=false;
this.clientTargetOutHandler(this.drag_targets[x].element);
}
}
}
DragClass.prototype.checkHighlighting=function(pos_x, pos_y) {
var scroll_left=0;
var scroll_top=0;
var inside=true;
if(this.drag_scrollable_areas.length > 0) {
inside=false;
for(var x=0; x < this.drag_scrollable_areas.length; x++) {
var bounds=this.drag_scrollable_bounds[x];
if(insideBounds(pos_x, pos_y, bounds)) {
scroll_left=this.drag_scrollable_areas[x].scrollLeft;
scroll_top=this.drag_scrollable_areas[x].scrollTop;
inside=true;
}
}
}
for(var x=0; x < this.drag_targets.length; x++) {
var bounds=this.drag_targets[x].bounds;
if(insideBounds(pos_x+scroll_left, pos_y+scroll_top, bounds) && inside) {
if(!this.drag_target_hilite[x]) {
this.clientTargetOverHandler(this.drag_targets[x].element);
this.drag_target_hilite[x]=true;
}
} else if(this.drag_target_hilite[x]) {
this.clientTargetOutHandler(this.drag_targets[x].element);
this.drag_target_hilite[x]=false;
}
}
}
DragClass.prototype.hideDragComponent=function() {
this.drag_div.style.display="none";
}
DragClass.prototype.showDragComponent=function() {
this.clientDrawingHandler(this.drag_div);
this.drag_div.style.display="";
this.drag_div.style.position="absolute";
this.drag_div.style.zIndex=500;
var bounds=_getBoundingClientRect(this.drag_div);
this.drag_div_width=bounds.right - bounds.left;
this.drag_div_height=bounds.bottom - bounds.top;
}
DragClass.prototype.findDragSource=function(pos_x, pos_y) {
var ret;
var scroll_left=0;
var scroll_top=0;
var inside=true;
if(this.drag_scrollable_areas.length > 0) {
inside=false;
for(var x=0; x < this.drag_scrollable_areas.length; x++) {
var bounds=this.drag_scrollable_bounds[x];
if(insideBounds(pos_x, pos_y, bounds)) {
scroll_left=this.drag_scrollable_areas[x].scrollLeft;
scroll_top=this.drag_scrollable_areas[x].scrollTop;
inside=true;
}
}
}
for(var x=0; x < this.drag_sources.length && !ret && inside; x++) {
if(insideBounds(pos_x+scroll_left, pos_y+scroll_top, this.drag_sources[x].bounds)) {
ret=this.drag_sources[x].element;
}
}
return ret;
}
DragClass.prototype.findDragTarget=function(pos_x, pos_y) {
var ret;
var scroll_left=0;
var scroll_top=0;
var inside=true;
if(this.drag_scrollable_areas.length > 0) {
inside=false;
for(var x=0; x < this.drag_scrollable_areas.length; x++) {
var bounds=this.drag_scrollable_bounds[x];
if(insideBounds(pos_x, pos_y, bounds)) {
scroll_left=this.drag_scrollable_areas[x].scrollLeft;
scroll_top=this.drag_scrollable_areas[x].scrollTop;
inside=true;
}
}
}
for(var x=0; x < this.drag_targets.length && !ret && inside; x++) {
if(insideBounds(pos_x+scroll_left, pos_y+scroll_top, this.drag_targets[x].bounds)) {
ret=this.drag_targets[x].element;
}
}
return ret;
}
function DragElement(element, id) {
this.element=element;
this.id=id;
this.bounds=null;
}
DragElement.prototype.refreshBounds=function() {
this.bounds=_getBoundingClientRect(this.element);
}
function setDragTolerance(tolerance) {
drag_tolerance=tolerance;
}
function setDragOffsetX(distance) {
drag_offset_x=distance;
}
function setDragOffsetY(distance) {
drag_offset_y=distance;
}
function getDragSource() {
return drag_source;
}
function getDragTarget() {
return drag_target;
}
function getDragSourceX() {
return drag_source_x;
}
function getDragSourceY() {
return drag_source_y;
}
function addDragClass(new_class) {
drag_classes[new_class.class_name]=new_class;
}
function getDragClass(class_name) {
return drag_classes[class_name];
}
function setDragStartButton(button) {
drag_start_button=button;
}
function resetDragVariables() {
drag_source_x=null;
drag_source_y=null;
drag_source=null;
drag_target=null;
drag_moved=false;
drag_current_class=null;
drag_button=null;
}
function handleDragComponentDrag(event, class_name) {
if(drag_classes[class_name]) {
drag_current_class=drag_classes[class_name];
if(drag_current_class.drag_area && !drag_current_class.drag_disabled) {
var pos_x=drag_source_x=getMouseX(event);
var pos_y=drag_source_y=getMouseY(event);
drag_current_class.setupDragAreaHandlers();
drag_source=drag_current_class.findDragSource(pos_x, pos_y);
if((drag_start_button!=null && event.button!=drag_start_button) ||
!drag_current_class.clientValidateHandler(drag_source)) {
drag_current_class.clearDragAreaHandlers();
drag_current_class.clientClickHandler(event);
handleDragComponentAbort();
}
}
}
}
function handleDragComponentMove(event) {
if(drag_current_class && drag_current_class.drag_div) {
var pos_x=getMouseX(event);
var pos_y=getMouseY(event);
if(drag_button==null || drag_button==event.button) {
var layer_x=Math.max(pos_x+drag_offset_x, 0);
layer_x=Math.min(layer_x, document.body.scrollWidth - 
drag_current_class.drag_div_width);
var layer_y=Math.max(pos_y+drag_offset_y, 0);
layer_y=Math.min(layer_y, document.body.scrollHeight - 
drag_current_class.drag_div_height);
drag_current_class.drag_div.style.left=layer_x;
drag_current_class.drag_div.style.top=layer_y;
if(!drag_moved && 
(Math.abs(pos_x - drag_source_x) > drag_tolerance ||
Math.abs(pos_y - drag_source_y) > drag_tolerance)) {
drag_current_class.showDragComponent();
drag_moved=true;
drag_button=event.button;
}
drag_current_class.checkHighlighting(pos_x, pos_y);
} else {
handleDragComponentAbort();
}
}
clearSelection();
}
function handleDragComponentDrop(event) {
var pos_x=getMouseX(event);
var pos_y=getMouseY(event);
if(drag_current_class) {
drag_current_class.clearDragAreaHandlers();
drag_current_class.hideDragComponent();
drag_current_class.clearHilighting();
drag_target=drag_current_class.findDragTarget(pos_x, pos_y);
if(drag_moved && drag_target && drag_source) {
drag_current_class.clientDropHandler();
} else {
if(!drag_moved && drag_source) {
drag_current_class.clientClickHandler(event);
}
drag_current_class.clientDropFailHandler();
}
}
resetDragVariables();
}
function handleDragComponentAbort() {
if(drag_current_class) {
drag_current_class.clearDragAreaHandlers();
drag_current_class.hideDragComponent();
drag_current_class.clearHilighting();
drag_current_class.clientDropFailHandler();
}
resetDragVariables();
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
function formatDateElement(element, dayElement, monthElement, yearElement, y2kBreak, dateFormat) { 
var indate=element.value;
var finished=false; 
var state="start"; 
var currentPosition=0; 
var currentCharacter=""; 
var month="";
var day="";
var year="";
var error=false;
var final_date;
var todays_date=new Date();
var this_year=(todays_date.getYear()<1000)?
(todays_date.getYear()+1900):todays_date.getYear(); 
if (y2kBreak==null) {
y2kBreak=100;
}
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
year=(jscript_date.getYear()<1000)?
(jscript_date.getYear()+1900):jscript_date.getYear();
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
if (dateFormat=="%d/%m/%Y") {
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
if (dateFormat=="%d/%m/%Y")
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
if (dateFormat=="%d/%m/%Y") {
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
if (dateFormat=="%d/%m/%Y")
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
if (dateFormat=="%d/%m/%Y") {
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
if (error) {
element.value="";
if(dayElement!=null)dayElement.value="";
if(monthElement!=null)monthElement.value="";
if(yearElement!=null)yearElement.value="";
return false;
}
if ((month > 12) || (month.length > 2)) {
element.value="";
if(dayElement!=null)dayElement.value="";
if(monthElement!=null)monthElement.value="";
if(yearElement!=null)yearElement.value="";
return false;
} else if ((day > 31) || (day.length > 2)) {
element.value="";
if(dayElement!=null)dayElement.value="";
if(monthElement!=null)monthElement.value="";
if(yearElement!=null)yearElement.value="";
return false;
} else if (year.length > 4) {
element.value="";
if(dayElement!=null)dayElement.value="";
if(monthElement!=null)monthElement.value="";
if(yearElement!=null)yearElement.value="";
return false;
}
if (year.length==1)
{ 
if(year < y2kBreak)
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
if(year < y2kBreak)
{
year="20"+year;
}
else
{
year="19"+year;
}
}
if(year<1904)
{
element.value="";
if(dayElement!=null)dayElement.value="";
if(monthElement!=null)monthElement.value="";
if(yearElement!=null)yearElement.value="";
}
else
{
final_date=new Date(fillZeros(month)+"/"+fillZeros(day)+"/"+fillZeros(year));
if(!isNaN(final_date))
{
day=final_date.getDate();
month=final_date.getMonth()+1;
year=(final_date.getYear()<1000)?(final_date.getYear()+1900):final_date.getYear();
if (dateFormat=="%d/%m/%Y")
element.value=fillZeros(day)+"/"+fillZeros(month)+"/"+fillZeros(year);
else
element.value=fillZeros(month)+"/"+fillZeros(day)+"/"+fillZeros(year);
if(dayElement!=null)dayElement.value=fillZeros(day);
if(monthElement!=null)monthElement.value=fillZeros(month);
if(yearElement!=null)yearElement.value=fillZeros(year);
}
else
{
element.value="";
if(dayElement!=null)dayElement.value="";
if(monthElement!=null)monthElement.value="";
if(yearElement!=null)yearElement.value="";
}
}
}
function registerWindowWithTracker(theWindowName) {
if(openerTopBTFrame) {
if(openerTopBTFrame.openWindowTracker) {
openerTopBTFrame.openWindowTracker.addItem(theWindowName,window);
}
}
}
function unregisterWindowWithTracker(theWindowName) {
if(openerTopBTFrame) {
if(openerTopBTFrame.openWindowTracker) {
openerTopBTFrame.openWindowTracker.removeItem(theWindowName);
}
}
}
function isWindowInTracker(theWindowName) {
var temp_windowFound;
temp_windowFound=getOpenWindowFromTracker(theWindowName);
if(temp_windowFound==null) {
return false;
} else {
if(typeof(temp_windowFound)=="undefined") {
return false;
} else {
if(temp_windowFound.closed==true) {
if(openerTopBTFrame) {
if(openerTopBTFrame.openWindowTracker) {
openerTopBTFrame.openWindowTracker.removeItem(theWindowName);
}
}
return false;     
}
}
}
return true;
}
function getOpenWindowFromTracker(theWindowName) {
if(topBTFrame) {
if(topBTFrame.openWindowTracker) {
return topBTFrame.openWindowTracker.getItem(theWindowName);
}
}
return null;
}
function UserPreferences() {
this.user_id=null;
this.user_name=null;
this.enterprise_id=null;
this.enterprise_name=null;
this.enterprise_website=null;
this.enterprise_logout=null;
this.enterprise_show_signout=null;
this.gui=null;
this.timezone=null;
this.timezone_diff=null;
this.user_type=null;
this.user_status=null;
this.color_primary=null;
this.color_secondary=null;
this.color_tertiary=null;
this.date_prefs=null;
this.time_prefs=null;
this.access_securesend=null;
this.access_email=null;
this.access_tasks=null;
this.access_calendar=null;
this.session_id=null;
this.root_dir=null;
}
function splitPane(container, height, width, minWidth) {
this.paneWidth=(width!=undefined ? width : 220);
this.minWidth=(minWidth!=undefined ? minWidth : 0);
this.container=container;
this.height=(height!=undefined ? height : parseInt(container.offsetHeight));
this.startX=0;
this.isOpen=true;
var fullWidth=parseInt(container.offsetWidth);
this.main=document.createElement('TABLE');
this.main.border=0;
this.main.cellPadding=0;
this.main.cellSpacing=0;
this.main.id='paneMain';
this.tbody=document.createElement('tbody');
this.main.appendChild(this.tbody);
this.row=document.createElement('TR');
this.tbody.appendChild(this.row);
this.control_bar=document.createElement('TD');
this.control_bar.style.width=this.paneWidth+"px";
this.control_bar.vAlign="top";
this.row.appendChild(this.control_bar);
this.resize_bar=document.createElement('TD');
this.resize_bar.pElement=this;
this.resize_bar.className="vert-splitter";
this.resize_bar.vAlign="top";
this.resize_bar.innerHTML="&nbsp;";
this.row.appendChild(this.resize_bar);
this.display_bar=document.createElement('TD');
this.display_bar.vAlign="top";
this.display_bar.style.width=((fullWidth - this.displayWidth()) - 2)+"px";
this.row.appendChild(this.display_bar);
this.resize_bar_phantom=document.createElement('DIV');
this.resize_bar_phantom.pElement=this;
this.resize_bar_phantom.style.left=this.paneWidth+"px";
this.resize_bar_phantom.className="dl_resize_phantom";
this.resize_bar_phantom.zIndex=100;
this.container.appendChild(this.main);
this.updateHeight(this.height);
}
splitPane.prototype.updateWidth=function() {
var fullWidth=parseInt(this.container.offsetWidth);
this.control_bar.style.width=this.paneWidth+"px";
this.display_bar.style.width=((fullWidth - this.displayWidth()) - 2)+"px";
}
splitPane.prototype.displayWidth=function() {
if (this.isOpen) {
return this.paneWidth;
}
else {
return 0;
}
}
splitPane.prototype.onresize=function() {}
splitPane.prototype.togglePane=function(state) {
if (this.isOpen==true) {
if (state==false) {
this.row.removeChild(this.control_bar);
this.row.removeChild(this.resize_bar);
this.isOpen=false;
}
}
else {
if (state==true) {
this.row.insertBefore(this.resize_bar, this.display_bar);
this.row.insertBefore(this.control_bar, this.resize_bar);
this.isOpen=true;
}
}
this.updateWidth();
}
splitPane.prototype.updateHeight=function(newHeight) {
this.height=newHeight;
this.control_bar.style.height=newHeight+"px";
this.resize_bar.style.height=newHeight+"px";
this.display_bar.style.height=newHeight+"px";
this.resize_bar_phantom.style.height=newHeight+"px";
}
splitPane.moveSubject=null;
splitPane.prototype.startResize=function(e) {
var useEvent=e;
if (useEvent==undefined) {
useEvent=event;
}
splitPane.moveSubject=this.pElement;
splitPane.moveSubject.startX=getMouseX(useEvent);
splitPane.moveSubject.resize_bar_phantom.style.left=splitPane.moveSubject.startX;
splitPane.moveSubject.container.insertBefore(splitPane.moveSubject.resize_bar_phantom, splitPane.moveSubject.main);
if (splitPane.moveSubject.container.onmousemove!=splitPane.moveSubject.moveResize) {
splitPane.moveSubject.container.emousemovebackup=splitPane.moveSubject.container.onmousemove;
}
if (splitPane.moveSubject.container.onmouseup!=splitPane.moveSubject.endResize) {
splitPane.moveSubject.container.emouseupbackup=splitPane.moveSubject.container.onmouseup;
}
splitPane.moveSubject.container.onmousemove=splitPane.moveSubject.moveResize;
splitPane.moveSubject.container.onmouseup=splitPane.moveSubject.endResize;
splitPane.moveSubject.container.onmouseout=splitPane.moveSubject.moveMouseoutHandler;
}
splitPane.prototype.moveMouseoutHandler=function(e) {
var useEvent=e;
if(useEvent==undefined) useEvent=event;
if((getMouseY(useEvent) <=0) || (getMouseX(useEvent) <=0) ||
(getMouseY(useEvent) >=_getPageHeight()) ||
(getMouseX(useEvent) >=_getPageWidth()))
splitPane.moveSubject.endResize();
}
splitPane.prototype.moveResize=function(e) {
var useEvent=e;
if (useEvent==undefined) {
useEvent=event;
}
var x=getMouseX(useEvent);
if (x >=splitPane.moveSubject.minWidth) {
var diff=x - splitPane.moveSubject.startX;
splitPane.moveSubject.startX+=diff;
var newLeft=(parseInt(splitPane.moveSubject.resize_bar_phantom.style.left)+diff);
splitPane.moveSubject.resize_bar_phantom.style.left=newLeft+"px";
}
if (splitPane.moveSubject.container.emousemovebackup) {
splitPane.moveSubject.container.emousemovebackup(useEvent);
}
}
splitPane.prototype.endResize=function(e) {
var diff=(splitPane.moveSubject.startX - parseInt(splitPane.moveSubject.resize_bar.offsetLeft));
splitPane.moveSubject.paneWidth+=diff;
if (splitPane.moveSubject.paneWidth < splitPane.moveSubject.minWidth) {
splitPane.moveSubject.paneWidth=splitPane.moveSubject.minWidth;
}
splitPane.moveSubject.control_bar.style.width=splitPane.moveSubject.paneWidth+"px";
splitPane.moveSubject.container.removeChild(splitPane.moveSubject.resize_bar_phantom);
if (splitPane.moveSubject.container.emouseupbackup) {
splitPane.moveSubject.container.emouseupbackup(useEvent);
}
if (splitPane.moveSubject.onresize) {
splitPane.moveSubject.onresize();
}
splitPane.moveSubject.container.onmousemove=splitPane.moveSubject.container.emousemovebackup;
splitPane.moveSubject.container.onmouseup=splitPane.moveSubject.container.emouseupbackup;
splitPane.moveSubject.container.emousemovebackup=undefined;
splitPane.moveSubject.container.emouseupbackup=undefined;
splitPane.moveSubject.container.onmouseout=null;
splitPane.moveSubject.updateWidth();
splitPane.moveSubject=undefined;
}
splitPane.prototype.redisplay=function() {
this.main.style.display='none';
this.main.style.display='';
this.display_bar.style.display='none';
this.display_bar.style.display='';
}
function titleBar(title, height, css_class) {
this.title=title;
this.css_class=(css_class!=undefined ? css_class : "appnav");
this.buttons=new Array();
this.height=(height!=undefined ? height : 25);
this.bar=document.createElement('DIV');
this.bar.className=this.css_class;
this.bar.style.height=this.height+"px";
this.bar.style.lineHeight=this.height- 2+"px";
this.bar.style.padding="0px 0px 0px 5px";
this.bar.style.overflow="hidden";
this.bar.style.whiteSpace="nowrap";
this.barName=document.createElement('DIV');
this.barName.innerHTML=title;
this.barName.style.height=this.height+"px";
this.barName.className="dl_headerBarTitle";
this.barName.style.overflow="hidden";
this.barName.style.whiteSpace="nowrap";
this.bar.appendChild(this.barName);
}
titleBar.prototype.width=function(width) {
if(width) {
this.bar.style.width=width+'px';
}else{
this.bar.style.width='';
}
}
titleBar.prototype.addButton=function(titleBarButtonObj) {
this.buttons[this.buttons.length]=titleBarButtonObj;
this.bar.appendChild(titleBarButtonObj.buttonDiv);
}
titleBar.prototype.setTitle=function(newTitle) {
this.title=newTitle;
this.barName.innerHTML=newTitle;
this.barName.className="dl_headerBarTitle";
this.barName.style.overflow="hidden";
this.barName.style.whiteSpace="nowrap";
this.barName.style.height=this.height+"px";
}
function titleBarButton(class_name, callback) {
this.class_name=class_name;
this.callback=callback;
this.buttonDiv=document.createElement('DIV');
this.buttonDiv.className="dl_titleBarButton";
this.buttonDiv.pElement=this;
this.buttonDiv.onclick=this.execute;
var tBox=document.createElement('TABLE');
tBox.border=0;
tBox.cellPadding=0;
tBox.cellSpacing=0;
tBox.style.width="21px";
tBox.style.height="21px";
this.buttonDiv.appendChild(tBox);
var tBody=document.createElement('TBODY');
tBox.appendChild(tBody);
var tRow=document.createElement('TR');
tBody.appendChild(tRow);
var tCell=document.createElement('TD');
tCell.className="btnav";
tCell.style.width=this.buttonDiv.style.width;
tCell.style.height=this.buttonDiv.style.height;
tCell.vAlign="center";
tCell.align="center";
tRow.appendChild(tCell);
this.tImg=document.createElement('IMG');
this.tImg.src="/gui/img/spacer.gif";
this.tImg.className=this.class_name;
tCell.appendChild(this.tImg);
}
titleBarButton.prototype.updateClass=function(newClass) {
this.class_name=newClass;
this.tImg.className=this.class_name;
}
titleBarButton.prototype.execute=function() {
this.pElement.callback();
}
function ButtonBar(height) {
this.height=height;
this.bar=document.createElement('DIV');
this.bar.className="menubar";
this.bar.style.overflow="hidden";
this.bar.style.whiteSpace="nowrap";
this.bar.style.height=this.height+"px";
this.barTable=document.createElement('TABLE');
this.barTable.className="xButtonBarTable";
this.bar.appendChild(this.barTable);
this.barTable.border=0;
this.barTable.cellPadding=0;
this.barTable.cellSpacing=0;
var barBody=document.createElement('TBODY');
this.barTable.appendChild(barBody);
this.buttonRow=document.createElement('TR');
barBody.appendChild(this.buttonRow);
}
ButtonBar.prototype.removeItem=function(buttonObj) {
try {
this.buttonRow.removeChild(buttonObj.button_object);
}catch(e) {}
}
ButtonBar.prototype.addItemBefore=function(buttonObj, other) {
buttonObj.updateHeight(this.height);
this.buttonRow.insertBefore(buttonObj.button_object, (other.button_object ? other.button_object : other));  
}
ButtonBar.prototype.addItem=function(buttonObj) {
buttonObj.updateHeight(this.height);
this.buttonRow.appendChild(buttonObj.button_object);  
}
function ButtonBarButton(button_id, callback, toolTip, text_label) {
this.button_id=button_id;   
this.callback=callback;  
this.text_label=text_label; 
this.toolTip=toolTip;
this.button_object=document.createElement('TD');
this.button_object.className="btnav";
this.button_object.style.overflow="hidden";
this.button_object.style.whiteSpace="nowrap";
this.button_div=document.createElement('IMG');
if(button_id.match(/\.gif$/i)) {
this.button_div.src="/gui/img/"+button_id;
} else {
this.button_div.src="/gui/img/spacer.gif";
this.button_div.className=this.button_id;
}
this.button_div.style.cssText="float:left;margin-right:4px;";
this.button_object.appendChild(this.button_div);
this.button_object.title=this.toolTip;
this.button_object.alt=this.toolTip;
if (this.text_label) {
this.button_object.innerHTML+=text_label;
}
if (callback!=undefined) {
this.button_object.onclick=callback;
}
}
ButtonBarButton.prototype.updateHeight=function(newHeight) {
this.button_object.style.height=newHeight+"px";
}  
function ButtonBarDiv() {
this.button_object=document.createElement('TD');
this.button_object.vAlign="center";
this.divLine=document.createElement('DIV');
this.divLine.className="vrule";
this.button_object.appendChild(this.divLine);
}
ButtonBarDiv.prototype.updateHeight=function(newHeight) {
this.button_object.style.height=newHeight+"px";
this.divLine.style.height=(newHeight - 10)+"px";
}
function contextMenu() {
this.items=new Array();
this.menu=document.createElement('DIV');
this.menu.className="dl_contextMenu";
contextMenu.openContext[contextMenu.openContext.length]=this;
}
contextMenu.openContext=new Array();
contextMenu.clickBackup=null;
contextMenu.prototype.addItem=function(newItem) {
this.items[this.items.length]=newItem;
try {
this.menu.appendChild(newItem.bar);
}
catch(e) {}
}
contextMenu.prototype.close=function() {
try {
document.body.removeChild(this.menu);
}
catch(e) {}
}
contextMenu.prototype.open=function(x, y) {
for (var xz=0; xz < this.items.length; xz++) {
this.items[xz].init();
}
document.body.appendChild(this.menu);
this.menu.style.left=x+"px";
this.menu.style.top=y+"px";
if (contextMenu.clickBackup==undefined) {
contextMenu.clickBackup=document.onclick;
document.onclick=contextMenu.closeContext;
}
}
contextMenu.closeContext=function(e) {
useEvent=e;
if (useEvent==undefined) {
useEvent=event;
}
for (var x=0; x < contextMenu.openContext.length; x++) {
contextMenu.openContext[x].close();
}
if (contextMenu.clickBackup!=undefined) {
document.onclick=contextMenu.clickBackup;
contextMenu.clickBackup=undefined;
}
}
function contextMenuItem(text, callback) {
this.text=text;
this.callback=callback;
this.bar=document.createElement('DIV');
this.bar.pElement=this;
this.bar.className="dl_contextMenuItem";
this.bar.innerHTML=this.bar.innerHTML+this.text;
this.bar.onmouseover=this.hover;
this.bar.onmouseout=this.hover_out;
this.bar.onclick=this.execute;
}
contextMenuItem.prototype.hover=function() {
this.className="dl_contextMenuItem_hover";
}
contextMenuItem.prototype.hover_out=function() {
this.className="dl_contextMenuItem";
}
contextMenuItem.prototype.init=function() {
this.bar.className="dl_contextMenuItem";
}
contextMenuItem.prototype.execute=function() {
if (this.pElement.callback!=undefined) {
this.pElement.callback();
}
}
function contextMenuOption(text, groupId, selected, callback) {
this.text=text;
this.group=groupId;
this.selected=(selected==true ? true : false);
this.callback=callback;
this.bar=document.createElement('DIV');
this.bar.pElement=this;
this.bar.className="dl_contextMenuOption"+(this.selected==true ? "Selected" : "");
this.bar.innerHTML=this.bar.innerHTML+this.text;
this.bar.onmouseover=this.hover;
this.bar.onmouseout=this.hover_out;
this.bar.onclick=this.execute;
if (contextMenuOption.groups[this.group]==undefined) {
contextMenuOption.groups[this.group]=new Array();
}
contextMenuOption.groups[this.group][contextMenuOption.groups[this.group].length]=this;
}
contextMenuOption.groups=new Array();
contextMenuOption.getValue=function(groupId) {
if (contextMenuOption.groups[groupId]!=undefined) {
for (var x=0; x < contextMenuOption.groups[groupId].length; x++) {
if (contextMenuOption.groups[groupId][x].selected==true) {
return contextMenuOption.groups[groupId][x].text;
}
}
}
return undefined;
}
contextMenuOption.prototype.select=function(isSelected) {
if (isSelected!=this.selected) {
this.selected=isSelected;
this.bar.className="dl_contextMenuOption"+(this.selected==true ? "Selected" : "");
}
}
contextMenuOption.prototype.hover=function() {
this.className="dl_contextMenuOption"+(this.pElement.selected==true ? "Selected" : "")+"_hover";
}
contextMenuOption.prototype.hover_out=function() {
this.className="dl_contextMenuOption"+(this.pElement.selected==true ? "Selected" : "");
}
contextMenuOption.prototype.init=function() {
this.className="dl_contextMenuOption"+(this.selected==true ? "Selected" : "");
}
contextMenuOption.prototype.execute=function() {
if (this.pElement.selected!=true) {
var groupSet=contextMenuOption.groups[this.pElement.group];
for (var x=0; x < groupSet.length; x++) {
groupSet[x].select(false);
}
this.pElement.select(true);
}
if (this.pElement.callback!=undefined) {
this.pElement.callback();
}
}
function contextMenuDiv() {
this.bar=document.createElement('DIV');
this.bar.className="dl_contextMenuDiv";
}
contextMenuDiv.prototype.init=function() {};
function searchBox(contextMenuObj, width, callback) {
this.context=contextMenuObj;
this.width=(width!=undefined ? width : 100);
this.callback=callback;
this.button_object=document.createElement('TD');
this.bar=document.createElement('DIV');
this.bar.className="dl_searchBox";
this.button_object.appendChild(this.bar);
this.search_icon=document.createElement('DIV');
this.search_icon.className="dl_searchIcon";
this.search_icon.pElement=this;
this.search_icon.onclick=this.openContext;
this.bar.appendChild(this.search_icon);
this.search_input=document.createElement('INPUT');
this.search_input.type="text";
this.search_input.pElement=this;
this.search_input.className="dl_searchBoxInput";
this.search_input.onkeypress=this.monitorEnter;
this.bar.appendChild(this.search_input);
}
searchBox.prototype.openContext=function(e) {
useEvent=e;
if (useEvent==undefined) {
useEvent=event;
}
if (this.pElement.context!=undefined) {
var contextObj=this.pElement.context;
var atX=getMouseX(useEvent);
var atY=getMouseY(useEvent);
setTimeout(function() {
contextObj.open(atX, atY);
}, 100);
}
}
searchBox.prototype.updateHeight=function(newHeight) {
this.bar.style.height=newHeight+"px";
this.search_input.style.height=(newHeight - 8)+"px";
}
searchBox.prototype.updateWidth=function(newWidth) {
this.bar.style.width=newWidth+"px";
}
searchBox.prototype.monitorEnter=function(e) {
useEvent=e;
if (useEvent==undefined) {
useEvent=event;
}
if (e.keyCode==13) {
if (this.pElement.callback!=undefined) {
this.pElement.callback(this.value);
}
}
}
function foldingList(text, defaultState) {
this.items=new Array();
this.text=text;
this.state=(defaultState!=undefined ? defaultState : false);
this.bar=document.createElement('DIV');
this.bar.className="dl_foldingList";
this.header=document.createElement('DIV');
this.header.className="dl_foldingListHeader"+(this.state==false ? "Closed" : "");
this.header.innerHTML=this.header.innerHTML+this.text;
this.header.pElement=this;
this.header.onclick=this.selected;
this.bar.appendChild(this.header);
}
foldingList.prototype.addItem=function(newItem) {
this.items[this.items.length]=newItem;
if (this.state==true) {
this.bar.appendChild(newItem.bar);
}
}
foldingList.prototype.selected=function() {
if (this.pElement.state==true) {
this.pElement.changeState(false);
}
else {
this.pElement.changeState(true);
}
}
foldingList.prototype.changeState=function(state) {
if (this.state!=state) {
this.state=state;
try {
if (state==true) {
for (var x=0; x < this.items.length; x++) {
this.bar.appendChild(this.items[x].bar);
}
}
else {
for (var x=0; x < this.items.length; x++) {
this.bar.removeChild(this.items[x].bar);
}
}
}
catch (e) {}
this.header.className="dl_foldingListHeader"+(this.state==false ? "Closed" : "");
}
}
function foldingListItem(text, callback, css_class) {
this.text=text;
this.css_class=css_class;
this.callback=callback;
this.bar=document.createElement('DIV');
this.bar.className="dl_foldingListItem"+(this.css_class!=undefined ? " "+this.css_class : "");
this.bar.innerHTML=this.bar.innerHTML+this.text;
if (callback!=undefined) {
this.bar.onclick=callback;
}
}
function timelineNavBar(title, height, leftCallback, rightCallback) {
this.title=title;
this.height=height;
this.left=leftCallback;
this.right=rightCallback;
this.bar=document.createElement('DIV');
this.bar.className="appnav dl_timelineNavBar";
this.bar.style.padding="0px";
this.bar.style.height=this.height+"px";
this.bar.style.lineHeight=this.height+"px";
if (this.left!=undefined) {
this.leftButton=new timelineNavBarButton("b-prev", "dl_timelineLeft", this.left);
this.bar.appendChild(this.leftButton.buttonDiv);
}
if (this.right!=undefined) {
this.rightButton=new timelineNavBarButton("b-next", "dl_timelineRight",this.right);
this.bar.appendChild(this.rightButton.buttonDiv);
}
this.titleDiv=document.createElement('DIV');
this.titleDiv.innerHTML=this.titleDiv.innerHTML+this.title;
this.bar.appendChild(this.titleDiv);
}
timelineNavBar.prototype.setTitle=function(newTitle) {
this.title=newTitle;
this.titleDiv.innerHTML=newTitle;
}
function timelineNavBarButton(class_name, floatClass, callback) {
this.class_name=class_name;
this.callback=callback;
this.buttonDiv=document.createElement('DIV');
this.buttonDiv.className="dl_timelineNavBarButton "+floatClass;
this.buttonDiv.style.height="19px";
this.buttonDiv.style.width="19px";
this.buttonDiv.pElement=this;
this.buttonDiv.onclick=this.execute;
var tBox=document.createElement('TABLE');
tBox.border=0;
tBox.cellPadding=0;
tBox.cellSpacing=0;
tBox.style.width="19px";
tBox.style.height="19px";
this.buttonDiv.appendChild(tBox);
var tBody=document.createElement('TBODY');
tBox.appendChild(tBody);
var tRow=document.createElement('TR');
tBody.appendChild(tRow);
var tCell=document.createElement('TD');
tCell.className="btnav";
tCell.vAlign="center";
tCell.align="center";
tRow.appendChild(tCell);
this.tImg=document.createElement('IMG');
this.tImg.src="/gui/img/spacer.gif";
this.tImg.className=this.class_name;
tCell.appendChild(this.tImg);
}
timelineNavBarButton.prototype.updateClass=function(newClass) {
this.class_name=newClass;
this.tImg.className=(this.class_name!=undefined ? " "+this.class_name : "");
}
timelineNavBarButton.prototype.execute=function() {
this.pElement.callback();
}
function dataList(id, width) {
this.id=id;
this.width=width;
this.columns=Array();
this.values=Array();
this.val_ids=Array();
this.lastInserted=-1;
var styles;
var lastStyle=0;
if (document.styleSheets) {
styles=document.styleSheets[0];
lastStyle=(document.all ? styles.rules.length : styles.cssRules.length);
}
this.styles=styles;
this.lastStyle=lastStyle;
}
dataList.prototype.addColumn=function (column) {
this.columns[this.columns.length]=column;
}
dataList.prototype.insert=function() {
var idInfo=0; 
if (arguments.length!=this.columns.length+1) {
if(arguments.length==this.columns.length+2) { 
idInfo=arguments[arguments.length-1]; 
}else{
alert('You are tring to insert a row of '+arguments.length+' values, into a list which requires '+this.columns.length+'.');
return false;
}
}
var rowArray=Array();
if(idInfo > 0) {
var goToMinus=2;
}else{
var goToMinus=1;
}
for(var x=0; x < arguments.length - goToMinus; x++) {
if(this.columns[x]) {
rowArray[this.columns[x].name]=arguments[x+1];
}
}
rowArray['val_id']=idInfo; 
this.insertAssociative(arguments[0], rowArray);
}
dataList.prototype.insertAssociative=function(callback, rowArray) {
rowArray['callback']=callback;
this.values[this.values.length]=rowArray;
if (this.lastInserted >=0) {
var tb=document.getElementById(this.id);
var tbody=tb.getElementsByTagName('TBODY')[0];
tbody.innerHTML+=this.genListRow(rowArray);
}
}
dataList.prototype.table=function() {
var tb="<div id='div_"+this.id+"'\"><table id='"+this.id+"' border=0 cellpadding=2 cellspacing=0 class=\"sortable\" width=\""+this.width+"\">";
tb+="<tbody>";
tb+="<tr>";
for (var x=0; x < this.columns.length; x++) {
tb+="<th id='"+this.columns[x].id+"'><div class=\"header_"+this.id+"_"+this.columns[x].id+"\">"+((this.columns[x].name=="" || this.columns[x].name==undefined || this.columns[x].name==null) ? "&nbsp;" : this.columns[x].name)+"</div></th>";
if (!document.all) {
this.styles.insertRule("."+this.id+"_"+this.columns[x].id+" { white-space: nowrap; overflow:hidden; width: "+(this.columns[x].width > 0 ? this.columns[x].width+"px" : "auto")+"; }", this.lastStyle++);
this.styles.insertRule(".header_"+this.id+"_"+this.columns[x].id+" { white-space: nowrap; overflow:hidden; width: "+(this.columns[x].width > 0 ? (this.columns[x].width - 10)+"px" : "auto")+"; }", this.lastStyle++);
}
else {
this.styles.addRule("."+this.id+"_"+this.columns[x].id, "white-space: nowrap; overflow:hidden; width: "+(this.columns[x].width > 0 ? this.columns[x].width+"px" : "auto")+";", this.lastStyle++);
this.styles.addRule(".header_"+this.id+"_"+this.columns[x].id, "white-space: nowrap; overflow:hidden; width: "+(this.columns[x].width > 0 ? (this.columns[x].width - 10)+"px" : "auto")+";", this.lastStyle++);
}
}
tb+="</tr>";
for (var x=0; x < this.values.length; x++) {
tb+=this.genListRow(this.values[x]);
this.lastInserted++;
}
tb+="</tbody>";
tb+="</table></div>";
return tb;
}
dataList.prototype.genListRow=function(rowArray) {
var rowData="<tr id=\""+rowArray['val_id']+"\" onmouseover=\"this.className='hilite';\" onmouseout=\"this.className='';\">";
for (var y=0; y < this.columns.length; y++) {
rowData+="<td>";
rowData+="<div class=\""+this.id+"_"+this.columns[y].id+"\""+((!this.columns[y].ignoreCallback && rowArray['callback']!=undefined) ? " onclick=\""+rowArray['callback']+"\"" : "")+">";
rowData+=((rowArray[this.columns[y].name]=="" ||
rowArray[this.columns[y].name]==undefined ||
rowArray[this.columns[y].name]==null)
? "&nbsp;" : rowArray[this.columns[y].name]);
rowData+="</div>";
rowData+="</td>"; 
}
rowData+="</tr>";
return rowData;
}
dataList.prototype.setWidth=function(newWidth) {
var rWidth=(newWidth!=undefined ? newWidth : document.getElementById(this.id).offsetWidth);
var sWidth=0;
var aWidth=0;
var useWidth=0;
var allRules=(document.all ? this.styles.rules : this.styles.cssRules);
var springCells=0;
for (var y=0; y < this.columns.length; y++) {
if (this.columns[y].width==undefined) {
springCells++;
}
else {
sWidth+=this.columns[y].width;
}
}
if (sWidth <=rWidth) {
useWidth=parseInt((rWidth - sWidth) / springCells);
}
else {
useWidth=0;
}
aWidth=sWidth;
for (var y=0; y < this.columns.length; y++) {
if (this.columns[y].width==undefined) {
for (var x=0; x < allRules.length; x++) {  
if (allRules[x].selectorText=="."+this.id+"_"+this.columns[y].id) {
allRules[x].style.width=useWidth+"px";
}
if (allRules[x].selectorText==".header_"+this.id+"_"+this.columns[y].id) {
allRules[x].style.width=((useWidth > 10 ? useWidth : 10) - 10)+"px";
}
}
aWidth+=(useWidth > 0 ? useWidth : 10);
}
}
this.width=aWidth;
document.getElementById(this.id).style.width=this.width+"px";
}
function dataListColumn(id, name, width, ignoreCallback) {
this.id=id;
this.name=name;
this.width=width;
this.ignoreCallback=ignoreCallback;
}
function Pair(first, second) {
this.first=first;
this.second=second;
}
function CGIParams(method) {
this.values=new Array();
this.xml_data=new Array();
this.values.push(new Pair("method", method));
}
CGIParams.prototype.toString=cgiParamToString;
CGIParams.prototype.addParam=cgiParamAddParam;
CGIParams.prototype.addXML=cgiParamAddXML;
function cgiParamAddParam(key, value) {
var found=false;
for(var x=0; x < this.values.length && !found; x++) {
if(this.values[x].first==key) {
found=true;
this.values[x].second=value;
}
}
if(!found) {
this.values.push(new Pair(key, value));
}
}
function cgiParamAddXML(data) {
this.xml_data.push(data);
}
function cgiParamToString() {
var ret="<params>";
for(var x=0; x < this.values.length; x++) {
var pair=this.values[x];
ret+="<"+pair.first+">"+pair.second+"</"+pair.first+">";
}
for(var x=0; x < this.xml_data.length; x++) {
ret+=this.xml_data[x];
}
ret+="</params>";
return ret;
}
function CGIAuth() {
this.user_name=null;
this.session_id=null;
this.nonmember_id=null;
}
var mAjaxHandler="ajaxNullHandler()";	
var mAjaxData="";			
var mAjaxFirstLoad=true;		
var mAjaxRequest;
function ajaxServerRequest(target, handler, xml_data, auth) {
var data="xml="+escape(xml_data);
if(auth.user_name!=null) {
data+="&unm="+auth.user_name;
}
if(auth.session_id!=null) {
data+="&sid="+auth.session_id;
}
if(auth.nonmember_id!=null) {
data+="&nmid="+auth.nonmember_id;
}
if(document.all) {
mAjaxRequest=new ActiveXObject("Microsoft.XMLHTTP");
} else {
if(mAjaxRequest!=null) { 
mAjaxRequest.abort();
}
mAjaxRequest=new XMLHttpRequest();
}
mAjaxHandler=handler;
mAjaxRequest.open("POST", target, true);
mAjaxRequest.onreadystatechange=ajaxCompleteRequest
mAjaxRequest.send(data);
}
function ajaxCompleteRequest() {
if(mAjaxFirstLoad && !document.getElementById("transport_result")) {
mAjaxFirstLoad=false;
}
if(!mAjaxFirstLoad) {
if(mAjaxRequest.readyState==4) {
var handler=mAjaxHandler;
mAjaxHandler="ajaxNullHandler()";
mAjaxData=null;
mAjaxData=mAjaxRequest.responseXML;
setTimeout(handler, 0);
}
} else {
mAjaxFirstLoad=false;
}
}
function ajaxGetData() {
return mAjaxData;
}
function ajaxNullHandler() {
}
function Mutex() {
this.mReqQueue=new Array();
this.mAvailable=true;
}
Mutex.prototype.lock=mutex_lock;
Mutex.prototype.unlock=mutex_unlock;
Mutex.prototype.wait=mutex_wait;
function mutex_lock(handler) {
var ret=false;
if(this.mAvailable) {
this.mAvailable=false;
ret=true;
} else {
this.mReqQueue.push(handler);
}
return ret;
}
function mutex_unlock() {
this.mAvailable=true;
for(var x=this.mReqQueue.length; x > 0 && this.mAvailable; x--) {
eval(this.mReqQueue.pop());
}
}
function mutex_wait(handler) {
this.mReqQueue.push(handler);
this.mAvailable=true;
for(var x=this.mReqQueue.length - 1; x > 0 && this.mAvailable; x--) {
eval(this.mReqQueue.pop());
}
}
function parameterize(func, args) {
var ret=func+"(";
for(var x=0; x < args.length; x++) {
if(x > 0) {
ret+=",";
}
ret+="\""+args[x]+"\"";
}
ret+=");";
return ret;
}
function hideMe() {
var visCount;
notifyShortcutCollapser(1);
topBTFrame.document.app.shortcutVisible.value="0";
visCount=topBTFrame.getVisibleCount();
if(visCount==0) { 
topBTFrame.resizeSidebar("0","0","0");
} else if(visCount==1) { 
if(topBTFrame.document.app.onlineVisible.value=="1") { 
topBTFrame.resizeSidebar("*","0", "0");
} else { 
topBTFrame.resizeSidebar("0","*","0");
}
} else { 
topBTFrame.resizeSidebar(topBTFrame.document.app.view2.value, "*", "0");
}
}
function init_shortcuts() {
var sc_table=document.getElementById('scTable');
var userApp=findFrameByName('userApp');
if(userApp && userApp.getData) {
user_prefs=userApp.getData();
} else if(userApp && userApp.getUserPreferences) {
userApp.getUserPreferences(framePath+".init_shortcuts()");
return;
} else {
setTimeout("init_shortcuts()", 100);
return;
}
updateGUISkin(false,"skin.css");
initTDButtons();
if(user_prefs.access_email!='True')
sc_table.deleteRow(document.getElementById('emailShortcut').rowIndex);
if(user_prefs.access_calendar!='True') {
try {
sc_table.deleteRow(document.getElementById('calenShortcut').rowIndex);
sc_table.deleteRow(document.getElementById('taskShortcut').rowIndex);
} catch (e) { }
}
}
function notifyShortcutCollapser(action) {  
if((action==1) || (topBTFrame.document.app.shortcutVisible.value=="0")) { 
topBTFrame.setShortcutButton(1);
} else { 
topBTFrame.setShortcutButton(action);
}
}
function popupScheduleAppt(username, sessionID, additionalParams)
{
if (user_prefs.access_calendar!='True') {
if(isWindowInTracker('CalendarSchedulePopup'))
{
alert("You are already editing an appointment.\n\n Please click 'OK' to continue.");
var emailWindow;
emailWindow=getOpenWindowFromTracker("CalendarSchedulePopup");
if(emailWindow)
{
emailWindow.focus();
}
}
else
{
window.open("/Ioffice/Calendar/CalenPopupScheduleFrameset.asp?unm="+username+"&sid="+sessionID+"&"+additionalParams, "",'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=0,width=790,height=480');
}
}
else {
initScheduleAppt();
}
}
function initScheduleAppt() {
init_common();
init_calendar();
initScheduleAppt2();
}
function initScheduleAppt2() {
if(!calendarApp || !calendarApp.mLoadDone) {
setTimeout(initScheduleAppt2, 100);
} else {
calendarApp.getListOfCalendars(initScheduleAppt3);
}
}
function initScheduleAppt3(args, orig_args, wrapper) {
calendars=args[0];
for(var x=0; x < calendars.length; x++) {
if(calendars[x].is_default) {
var time=new Date();
time=addMinutes(floorHour(time), 60);
calendarApp.popNewEvent(calendars[x].calendar_id, dateToICal(time), dateToICal(addHour(time)));
}
}
}
function popupAddContact(username, sessionID, additionalParams)
{
var contactWin=null;
if(isWindowInTracker('ContactAdd')) {
alert("You are already editing a contact.\n\n Please click 'OK' to continue.");
contactWin=getOpenWindowFromTracker("ContactAdd");
if(contactWin)
contactWin.focus();
} else {
contactWin=window.open("/Ioffice/ContactMan/AddContactPopupFrameset.asp?unm="+username+"&sid="+sessionID+"&"+additionalParams, "",
'toolbar=0,location=0,directories=0,status=0,menubar=0,'+'scrollbars=1,resizable=1,width=790,height=480');
contactWin.name="ContactAdd";
}
}
function resizeToFitWindow(id, hOffset, vOffset, winWidth, winHeight){
if (document.body.clientWidth){ 
winWidth=(winWidth) ? winWidth : document.body.clientWidth; 
winHeight=(winHeight) ? winHeight : document.body.clientHeight;             
}else if (window.innerWidth){ 
winWidth=(winWidth) ? winWidth : window.innerWidth;
winHeight=(winHeight) ? winHeight : window.innerHeight;             
}
if((winWidth==0) || (winHeight==0)) {
return;
}
var el=document.getElementById(id);        
if(el && !isNaN(winWidth+hOffset) && !isNaN(winHeight+vOffset)){
if((winWidth+hOffset) >=0)
el.style.width=(winWidth+hOffset)+"px";
if((winHeight+vOffset) >=0)
el.style.height=(winHeight+vOffset)+"px";
}        
return;
}
function EventListener(obj, handleName) {
this.i_listeners=Array();	
this.i_obj=obj;
this.i_handleName=handleName;
MemoryManager.register(this);
}
EventListener.prototype.destroy=function() {
this.i_obj["hasHandle_"+this.i_handleName+"_me"]=null;
this.i_obj=null;
}
EventListener.listen=function(monitorObject, handleName, callback) {
var oldEvent=monitorObject[handleName];
var useListener;
if (oldEvent!=undefined) {
if (monitorObject["hasHandle_"+handleName]!=undefined) {
useListener=monitorObject.eventListeners[handleName];
}
}
if (useListener==undefined) {
useListener=new EventListener(monitorObject);
if (oldEvent!=undefined) {
useListener.addListener(oldEvent);
}
}
if (monitorObject.eventListeners==undefined) {
monitorObject.eventListeners=Array();
}
monitorObject.eventListeners[handleName]=useListener;
monitorObject["hasHandle_"+handleName]=true;
monitorObject["hasHandle_"+handleName+"_me"]=useListener;
monitorObject[handleName]=useListener.notify;
return useListener.addListener(callback);
}
EventListener.silence=function(monitorObject, handleName, listenerID) {
var listener=monitorObject.eventListeners[handleName];
var ret=false;
if (listener!=undefined) {
ret=listener.removeListener(listenerID, handleName);
if(listener.i_listeners.length < 1) {
monitorObject.eventListeners[handleName]=null;
MemoryManager.free(listener);
}
}
return ret;
}
EventListener.silenceAll=function(monitorObject, handleName) {
if(monitorObject.eventListeners) {
var listener=monitorObject.eventListeners[handleName];
if(listener!=undefined) {
listener.clearListeners(handleName);
monitorObject.eventListeners[handleName]=null;
monitorObject[handleName]=null;
MemoryManager.free(listener);
}
}
}
EventListener.prototype.isListener=function() {
return true;	
}
EventListener.prototype.addListener=function(callback) {
this.i_listeners[this.i_listeners.length]=callback;
return this.i_listeners.length - 1;
}
EventListener.prototype.removeListener=function(listenerID) {
if (this.i_listeners[listenerID]!=undefined) {
this.i_listeners[listenerID]=undefined;
return true;
}
return false;
}
EventListener.prototype.clearListeners=function() {
this.i_listeners=Array();	
}
EventListener.prototype.notify=function(e) {
var useEvent=(e ? e : event);
var me=this["hasHandle_on"+useEvent.type+"_me"];
for (var x=0; x < me.i_listeners.length; x++) {
var cb=me.i_listeners[x];
if (cb!=undefined) {
cb.call(this, useEvent, me);
}
}
return true;
}
function Console() {
}
Console.i_messages=Array();
Console.i_rotate=50;
Console.i_depth=6;
Console.i_last_id=0;
Console.i_levels=Array("DEBUG", "WARN", "ERROR", "INFO", "REQUEST", "ACCESS", "EXCEPTION", "BENCHMARK", "CHECKPOINT", "GROUP");
Console.DEBUG=0;		
Console.WARN=1;
Console.ERROR=2;
Console.INFO=3;
Console.REQUEST=4;
Console.ACCESS=5;
Console.EXCEPTION=6;
Console.BENCHMARK=7;
Console.CHECKPOINT=8;
Console.GROUP=9;
Console.i_icons=Array("console_message_debug",
"console_message_warn",
"console_message_error",
"console_message_info",
"console_message_request",
"console_message_access",
"console_message_exception",
"console_message_benchmark",
"console_message_checkpoint",
"console_message_group");
Console.i_default=Console.DEBUG;
Console.i_strict=true;
Console.clear=function() {
Console.i_messages=Array();
}
Console.toString=function(formatted, tabCharacter) {
if (tabCharacter==undefined) {
tabCharacter="";
}
var formatChar="\n";
if (formatted==undefined) {
formatChar="";
}
var xml="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>"+formatChar;
xml+="<console>"+formatChar;
var tabPattern=Array();
for (var x=0; x < Console.depth()+3; x++) {
tabPattern[x]="";
for (y=0; y < x; y++) {
tabPattern[x]+=tabCharacter;
}
}
var cDepth=0;
for (var x=0; x < Console.messages().length; x++) {
var ins=Array();
ins[ins.length]=Console.message(x);
while (ins.length > 0) {
if (cDepth > ins[0].depth) {
while (cDepth > ins[0].depth) {
xml+=tabPattern[cDepth]+"</message>"+formatChar;
cDepth--;
}
}
cDepth=ins[0].depth+1;
xml+=tabPattern[ins[0].depth+1]+"<message>"+formatChar;
xml+=tabPattern[ins[0].depth+2]+"<level>"+Console.i_levels[ins[0].level]+"</level>"+formatChar;
xml+=tabPattern[ins[0].depth+2]+"<text>"+ins[0].message+"</text>"+formatChar;
if (ins[0].messages!=undefined) {
for (var z=0; z < ins[0].messages.length; z++) {
ins.splice(1, 0, ins[0].messages[z]);
}
}
ins.splice(0, 1);
}	
while (cDepth > 0) {
xml+=tabPattern[cDepth]+"</message>"+formatChar;
cDepth--;
}
}
xml+="</console>";
return xml;
}
Console.icon=function(levelIndex, newIcon) {
if (Console.levelUsed(levelIndex)) {
if (newIcon!=undefined) {
Console.i_icons[levelIndex]=newIcon;
}
return Console.i_icons[levelIndex];
}
}
Console.strict=function(state) {
if (state!=undefined && state!=Console.i_strict) {
Console.i_strict=state;
if (state==true) {
Console.rotation(Console.rotation());
Console.depth(Console.depth());
}
}
return Console.i_strict;
}
Console.defaultLevel=function(newDefault) {
if (newDefault!=undefined) {
Console.i_default=newDefault;
}
return Console.i_default;
}
Console.levelUsed=function(levelIndex) {
if (levelIndex!=undefined) {
if (Console.i_levels[levelIndex]!=undefined) {
return true;
}
}
return false;
}
Console.level=function(levelName, state, icon, isDefault) {
state=(state==undefined ? true : state);
levelName=levelName.toUpperCase();
if (state==true) {
Console.i_levels[Console.i_levels.length]=levelName;
Console.i_icons[Console.i_levels.length]=icon;
Console[levelName]=Console.i_levels.length - 1;
if (isDefault==true) {
Console.i_default=Console.i_levels.length - 1;
}
}
else {
var levelIndex=Console[levelName];
if (levelIndex!=undefined) {
Console.i_levels[levelIndex]=undefined;
Console.i_icons[levelIndex]=undefined;
var ins=Array();
var start=new Object();
start.messages=Array();
for (var y=0; y < Console.messages().length; y++) {
start.messages[start.messages.length]=Console.message(y);
}
ins[ins.length]=start;
while (ins.length > 0) {
for (var z=0; z < ins[0].messages.length; z++) {
if (ins[0].messages[z].level==levelIndex) {
ins[0].messages.splice(z, 1);
}
else {
ins[ins.length]=ins[0].messages[z];
}
ins.splice(0, 1);
}	
}
}
}
return true;
}
Console.rotation=function(newLimit) {
if (newLimit!=undefined) {
Console.i_rotate=newLimit;
if (Console.strict() && newLimit!=0) {
for (var x=0; x < Console.messages().length; x++) {
var ins=Array();
ins[ins.length]=Console.message(x);
while (ins.length > 0) {
if (ins[0].messages!=undefined) {
if (ins[0].messages.length > Console.i_rotate) {
for (var z=Console.i_rotate - 1; z < ins[0].messages.length; z++) { 
try {
ConsoleGUI.removeNode(ins[0].messages[z]);
} catch (e) { };
}
ins[0].messages.splice(Console.i_rotate - 1, ins[0].messages.length - Console.i_rotate);
}
for (var z=0; z < ins[0].messages; z++) {
ins[ins.length]=ins[0].messages[z];
}
}
ins.splice(0, 1);
}	
}
}
}
return Console.i_rotate;
}
Console.depth=function(newDepth) {
if (newDepth!=undefined) {
Console.i_depth=newDepth;
if (Console.strict()) {
for (var x=0; x < Console.messages().length; x++) {
var ins=Array();
ins[ins.length]=Console.message(x);
while (ins.length > 0) {
if (ins[0].messages!=undefined) {
if (ins[0].depth==Console.depth()) {
for (var z=0; z < ins[0].messages.length; z++) { 
try {
ConsoleGUI.removeNode(ins[0].messages[z]);
} catch (e) { };
}
ins[0].clear();
ins[0].opened=false;
}
else {
for (var z=0; z < ins[0].messages.length; z++) {
ins[ins.length]=ins[0].messages[z];
}
}
}
ins.splice(0, 1);
}	
}
}
}
return Console.i_depth;
}
Console.messages=function() {
if (Console.i_messages==undefined) {
Console.i_message=new Array();
}
return Console.i_messages;
}
Console.message=function(messageIndex) {
if (Console.i_messages!=undefined) {
return Console.i_messages[messageIndex];
}
return undefined;
}
Console.log=function(messageText, level) {
if (level==undefined) {
level=Console.defaultLevel();
}
var m=new ConsoleMessage(0, 0, messageText, level);
if (Console.levelUsed(level)) {
if (Console.messages()) {
if (Console.strict() && Console.rotation()!=0 && Console.messages().length >=Console.rotation()) {
try {
ConsoleGUI.removeNode(this.message(0));
} catch (e) { }
Console.messages().splice(0, 1);
}
Console.i_messages[Console.i_messages.length]=m;
try {
ConsoleGUI.addNode(Console.message(Console.messages().length - 1));
} catch (e) { }
}
}
return m;
}
Console.benchmark=function(messageText) {
var ret=Console.log(messageText, Console.BENCHMARK);
ret.start=new Date();
ret.checks=0;
return ret;
}
function ConsoleMessage(p, depth, message, level) {
this.parent=p;
this.depth=depth;		
this.message=message;		
this.level=level;		
this.count=Console.i_last_id;	
Console.i_last_id++;
}
ConsoleMessage.prototype.checkpoint=function(messageText) {
if (this.start!=undefined) {
this.checks++;
var thisTime=new Date();
var diff=(thisTime.getTime() - this.start.getTime());
var lDiff=(this.lastCheck!=undefined ? (thisTime.getTime() - this.lastCheck.getTime()) : 0);
var ret=this.log((messageText!=undefined ? messageText : "Checkpoint "+this.checks+": ")+"[last: "+lDiff+"ms, total: "+diff+"ms]", Console.CHECKPOINT);
ret.start=new Date();
this.lastCheck=thisTime;
return ret;
}
return false;
}
ConsoleMessage.prototype.log=function(messageText, level) {
if (level==undefined) {
level=Console.defaultLevel();
}
if (Console.levelUsed(level)) {
if (this.messages==undefined) {
if (Console.strict() && this.depth >=Console.depth()) {
this.silenced=true;
return false;
}
this.messages=Array();
}
if (Console.strict() && Console.rotation()!=0 && this.messages.length >=Console.rotation()) {
try {
ConsoleGUI.removeNode(this.messages[0]);
} catch (e) { }
this.messages.splice(0, 1);
}
this.messages[this.messages.length]=new ConsoleMessage(this, this.depth+1, messageText, level);
try {
ConsoleGUI.addNode(this.messages[this.messages.length - 1]);
} catch (e) { }
return this.messages[this.messages.length - 1];
}
return false;
}
ConsoleMessage.prototype.clear=function() {
this.messages=undefined;
}
ConsoleMessage.prototype.benchmark=function(messageText) {
var ret=this.log(messageText, Console.BENCHMARK);
ret.start=new Date();
ret.checks=0;
return ret;
}
function CursorMonitor() { 
}
CursorMonitor.listeners=Array();
CursorMonitor.hooked=false;
CursorMonitor.listenerID;
CursorMonitor.hook=function() {
if (!CursorMonitor.hooked) {
CursorMonitor.listenerID=EventListener.listen(document.body, "onmousemove", CursorMonitor.update);
CursorMonitor.hooked=true;
return true;
}
return false;
}
CursorMonitor.clear=function() {
CursorMonitor.listeners=Array();
}
CursorMonitor.unhook=function() {
if (CursorMonitor.hooked) {
EventListener.silence(document.body, "onmousemove", CursorMonitor.listenerID);
CursorMonitor.listenerID=undefined;
CursorMonitor.hooked=false;
return true;
}
return false;
}
CursorMonitor.addListener=function(callback) {
CursorMonitor.listeners[CursorMonitor.listeners.length]=callback;
return CursorMonitor.listeners.length - 1;
}
CursorMonitor.removeListener=function(index) {
if (CursorMonitor.listeners[index]!=undefined) {
CursorMonitor.listeners[index]=0;
return true;
}
return false;
}
CursorMonitor.update=function(e) {
CursorMonitor.setXY(e);
for (var x=0; x < CursorMonitor.listeners.length; x++) {
var cb=CursorMonitor.listeners[x];
if (cb!=0) {
try {
cb(CursorMonitor.mouseX, CursorMonitor.mouseY);
} catch (e) { alert('Cursor Monitor Callback Exception: '+e); }
}
}
if (this.backupHandler!=undefined) {
return this.backupHandler(e);
}
return true;
}
CursorMonitor.getX=function() {
return CursorMonitor.mouseX;
}
CursorMonitor.getY=function() {
return CursorMonitor.mouseY;
}
CursorMonitor.setXY=function(e) {
if (document.all) {
CursorMonitor.mouseX=event.clientX+document.body.scrollLeft;
CursorMonitor.mouseY=event.clientY+document.body.scrollTop;
}
else {
CursorMonitor.mouseX=e.pageX;
CursorMonitor.mouseY=e.pageY;
}
return true;
}
CursorMonitor.browserWidth=function() {
return (document.all ? document.body.offsetWidth : window.innerWidth);
}
CursorMonitor.browserHeight=function() {
return (document.all ? document.body.offsetHeight : window.innerHeight);
}
function MemoryManager() {
}
MemoryManager.resources=Array();
MemoryManager.register=function(object) {
MemoryManager.resources[MemoryManager.resources.length]=object;
object.mmloc=MemoryManager.resources.length - 1;
return object;
}
MemoryManager.destructResource=function(object) {
for (var x in object) {
try {
if (document.all) {
object[x]=null;
}
else {
delete object[x];
}
} catch (e) { }
}
if (document.all) {
object=null;
}
else {
delete object;
}
}
MemoryManager.freeAll=function() {
var dest=MemoryManager.resources.length;
for (var x=0; x < MemoryManager.resources.length; x++) {
if (MemoryManager.resources[x]!=null && MemoryManager.resources[x].destroy!=undefined) {
MemoryManager.resources[x].destroy();
}
else {
MemoryManager.destructResource(MemoryManager.resources[x]);
}
}
MemoryManager.resources=Array();
return dest;
}
MemoryManager.free=function(object) {
if(object.mmloc!=undefined) {
if(object==MemoryManager.resources[object.mmloc]) {
MemoryManager.resources[object.mmloc]=null;
}
if (object.destroy!=undefined) {
object.destroy();
}
else {
MemoryManager.destructResource(object);
}
}
}
function GlobalDragAndDrop() {
}
GlobalDragAndDrop.i_sources=Array();
GlobalDragAndDrop.i_targets=Array();
GlobalDragAndDrop.i_active_target;
GlobalDragAndDrop.i_active_soruce;
GlobalDragAndDrop.enableSelect=function(state) {
if (state==true) {
if (document.all) {
document.body.onselectstart=function() {
return true;
}
}
}
else {
if (document.all) {
document.body.onselectstart=function() {
return false;
}
}
}
}
GlobalDragAndDrop.addSource=function(source) {
GlobalDragAndDrop.i_sources[GlobalDragAndDrop.i_sources.length]=source;
source.enabled(true);
return source;
}
GlobalDragAndDrop.addTarget=function(target) {
target.enabled(true);
return target;
}
GlobalDragAndDrop.removeSource=function(source) {
for (var x=0; x < GlobalDragAndDrop.i_sources.length; x++) {
if (GlobalDragAndDrop.i_sources[x]==source) {
GlobalDragAndDrop.i_sources.splice(x, 1);
source.enabled(false);
return true;
}
}
return false;
}
GlobalDragAndDrop.removeTarget=function(target) {
target.enabled(false);
return true;
}
GlobalDragAndDrop.activeTarget=function(target) {
GlobalDragAndDrop.i_active_target=target;
return GlobalDragAndDrop.i_active_target;
}
GlobalDragAndDrop.activeSource=function(source) {
GlobalDragAndDrop.i_active_source=source;
return GlobalDragAndDrop.i_active_source;
}
GlobalDragAndDrop.executeDrop=function() {
var s=GlobalDragAndDrop.i_active_source;
var t=GlobalDragAndDrop.i_active_target;
if(t!=undefined) {
for (var x=0; x < t.types().length; x++) {
if (t.types()[x]==s.GlobalDragType()) {
var cb=s.GlobalDragType().callback();
if (cb!=undefined) {
cb(s, t);
GlobalDragAndDrop.i_active_source=null;
GlobalDragAndDrop.i_active_target=null;
return true;
}
}
}
return false;
}
}
function GlobalDragType(name, callback) {
this.i_name=name;
this.i_callback=callback;
this.i_enabled=true;
MemoryManager.register(this);
}
GlobalDragType.prototype.destroy=function() {
this.i_src_div=null;
this.i_last_src_div=null;
}
GlobalDragType.prototype.clear=function() {
for (var x=GlobalDragAndDrop.i_sources.length - 1; x >=0; x--) {
if (GlobalDragAndDrop.i_sources[x].GlobalDragType()==this) {
GlobalDragAndDrop.i_sources[x].enabled(false);
GlobalDragAndDrop.i_sources.splice(x, 1);
}
}
return true;
}
GlobalDragType.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
GlobalDragType.prototype.callback=function(callback) {
if (callback!=undefined) {
this.i_callback=callback;
}
return this.i_callback;
}
GlobalDragType.prototype.drawSource=function(source) {
if (this.i_src_div==undefined || this.i_last_src_div!=source) {
this.i_src_div=document.createElement('DIV');
this.i_src_div.style.position="absolute";
this.i_src_div.style.width=parseInt(source.element().offsetWidth);
this.i_src_div.style.height=parseInt(source.element().offsetHeight);
this.i_src_div.className='drag-opacity '+source.element().className;
this.i_src_div.innerHTML=source.element().innerHTML;
this.i_last_src_div=source;
}
return this.i_src_div;
}
GlobalDragType.prototype.enabled=function(state) {
if (state!=undefined) {
this.i_state=state;
}
return this.i_state;
}
function GlobalDragSource(element, type) {
this.i_element=element;
this.i_type=type;
this.i_enabled=false;
MemoryManager.register(this);
}
GlobalDragSource.prototype.destroy=function() {
if(this.i_element!=undefined) {
this.i_element.dd_source==null;
}
this.i_element=null;
this.i_active_source=null;
this.i_active_target=null;
}
GlobalDragSource.handleMouseUp=function(e) {
var s=GlobalDragAndDrop.i_active_source;
if(s) {
EventListener.silence(this, "onmouseup", s.evL);
s.evL=null;
CursorMonitor.removeListener(s.cmL);
try {
document.body.removeChild(s.rep);
} catch (e) { }
}
GlobalDragAndDrop.enableSelect(true);
if(GlobalDragSource.originalX==-1 && GlobalDragSource.originalY==-1) {
GlobalDragAndDrop.executeDrop();
}	
GlobalDragSource.originalX=undefined;
GlobalDragSource.originalY=undefined;
GlobalDragAndDrop.i_active_source=null;
GlobalDragAndDrop.i_active_target=null;
}
GlobalDragSource.handleMouseMove=function(x, y) {
var s=GlobalDragAndDrop.i_active_source;
if(s!=undefined) {
if(GlobalDragSource.originalX==-1 || ((GlobalDragSource.originalX+5 < x || GlobalDragSource.originalX - 5 > x) 
|| (GlobalDragSource.originalY+5 < y || GlobalDragSource.originalY - 5 > y))) {
if (s.rep==undefined) {
s.rep=s.GlobalDragType().drawSource(s);
}
document.body.appendChild(s.rep);
s.rep.style.left=(x+18)+"px";
s.rep.style.top=(y+15)+"px";
GlobalDragSource.originalX=-1;
GlobalDragSource.originalY=-1;
}
if(s.drag_handler!=undefined) {
s.drag_handler(s);
}
}
}
GlobalDragSource.handleMouseDown=function(e) {
if(e.button < 2) {
GlobalDragSource.originalX=CursorMonitor.getX();
GlobalDragSource.originalY=CursorMonitor.getY();
GlobalDragAndDrop.activeSource(this.dd_source);
GlobalDragAndDrop.enableSelect(false);
this.dd_source.evL=EventListener.listen(document.body, "onmouseup", GlobalDragSource.handleMouseUp);
this.dd_source.cmL=CursorMonitor.addListener(GlobalDragSource.handleMouseMove);
}
return true;
}
GlobalDragSource.prototype.enabled=function(enabled) {
if (enabled!=undefined) {
if (enabled!=this.i_enabled) {
this.i_enabled=enabled;
if (enabled==true) {
this.i_element.dd_source=this;
this.lcode=EventListener.listen(this.element(), "onmousedown", GlobalDragSource.handleMouseDown);
if (!document.all) {
this.element().style.MozUserSelect="none";
}
}
else {
this.i_element.dd_source=null;
EventListener.silence(this.element(), "onmousedown", this.lcode);
if (!document.all) {
this.element().style.MozUserSelect="";
}
}
}
}
return this.i_enabled;
}
GlobalDragSource.prototype.element=function(element) {
if (element!=undefined) {
this.i_element=element;
}
return this.i_element;
}
GlobalDragSource.prototype.GlobalDragType=function(GlobalDragType) {
if (GlobalDragType!=undefined) {
this.i_type=GlobalDragType;
}
return this.i_type;
}
function GlobalDragTarget(element, acceptedTypes) {
this.i_enabled=false;
this.i_element=element;
this.i_acceptedTypes=acceptedTypes;
if (acceptedTypes==undefined) {
this.i_acceptedTypes=Array();
}
else {
if (acceptedTypes.splice==undefined) {
this.i_acceptedTypes=Array(acceptedTypes);
}
}
MemoryManager.register(this);
}
GlobalDragTarget.handleMouseOver=function() {
GlobalDragAndDrop.activeTarget(this.dd_target);
}
GlobalDragTarget.handleMouseOut=function() {
GlobalDragAndDrop.activeTarget(undefined);
}
GlobalDragTarget.prototype.enabled=function(enabled) {
if (enabled!=undefined) {
this.i_enabled=enabled;
this.i_element.dd_target=this;
EventListener.listen(this.i_element, "onmouseover", GlobalDragTarget.handleMouseOver);
EventListener.listen(this.i_element, "onmouseout", GlobalDragTarget.handleMouseOut);
}
return this.i_enabled;
}
GlobalDragTarget.prototype.element=function(element) {
if (element!=undefined) {
this.i_element=element;
}
return this.i_element;
}	
GlobalDragTarget.prototype.types=function() {
return this.i_acceptedTypes;
}
GlobalDragTarget.prototype.addType=function(type) {
this.i_acceptedTypes[this.i_acceptedTypes.length]=type;
return type;
}
GlobalDragTarget.prototype.removeType=function(type) {
for (var x=0; x < this.i_acceptedTypes.length; x++) {
if (this.i_acceptedTypes[x]==type) {
this.i_acceptedTypes.splice(x, 1);
return true;
}
}
return false;
}
GlobalDragTarget.prototype.destroy=function() {
if (this.i_element!=undefined) {
this.i_element.dd_target=null;
}
return true;
}
function Transport() {
}
Transport.i_user_name=null;
Transport.i_session_id=null;
Transport.i_nonmember_id=null;
Transport.requestQueue=Array();
Transport.connections=500;
Transport.executeQueue=function() {
while (Transport.connections > 0 && Transport.requestQueue.length > 0) {
var nx=Transport.requestQueue[0];
if (!nx.complete() && !nx.working()) {
Transport.requestQueue.splice(0, 1);
Transport.connections--;
nx.execute();
}
}
return true;
}
Transport.username=function(username) {
if (username!=undefined) {
this.i_user_name=username;
}
return this.i_user_name;
}
Transport.sessionId=function(session_id) {
if (session_id!=undefined) {
this.i_session_id=session_id;
}
return this.i_session_id;
}
Transport.nonMemberId=function(nonMemberId) {
if (nonMemberId!=undefined) {
this.i_nonmember_id=nonMemberId;
}
return this.i_nonmember_id;
}
Transport.request=function(url, post_data, handler, args) {
var http_request;
if (window.XMLHttpRequest) {
http_request=new XMLHttpRequest();
} else if (window.ActiveXObject) {
try {
http_request=new ActiveXObject("Msxml2.XMLHTTP");
} catch (e) {
try {
http_request=new ActiveXObject("Microsoft.XMLHTTP");
} catch (e) {}
}
}		
var rq=new TransportRequest(http_request, url, post_data, handler, args);
Transport.requestQueue[Transport.requestQueue.length]=rq;
Transport.executeQueue();
return rq;
}
function TransportRequest(xmlhttp, url, post_data, handler, args) {
this.i_xml_http=xmlhttp;
this.i_url=url;
this.i_post_data=post_data;
this.i_handler=handler;
this.i_args=args;
this.i_complete=false;
this.i_working=false;
}
TransportRequest.prototype.complete=function(setComplete) {
if (setComplete==true) {
this.i_complete=true;
this.i_working=false;
}
return this.i_complete;
}
TransportRequest.prototype.working=function(setWorking) {
if (setWorking==true) {
this.i_working=true;
}
return this.i_working;
}
TransportRequest.prototype.getRequestObject=function() {
return this.i_xml_http;
}
TransportRequest.prototype.url=function() {
return this.i_url;
}
TransportRequest.prototype.postData=function() {
return this.i_post_data;
}
TransportRequest.prototype.args=function(args) {
if (args!=undefined) {
this.i_args=args;
}
return this.i_args;
}
TransportRequest.prototype.executeArguments=function(args) {
if (args==undefined) {
args=Array();	
}
var t=this.i_args[0];
try {
if(t.splice==undefined) {
t(args, Array(), this);
}else{
for (var x=0; x < t.length; x++) {
if (t[x].splice==undefined) {
t[x](args, Array(), this);
}
else {
t[x][0](args, t[1], this);
}
}
}
}catch(e) {
if(!document.all && console!=undefined) {
console.log('AJAX Handler Error: '+e.message);
}
}
}
TransportRequest.prototype.handler=function(handler) {
if (handler!=undefined) {
this.i_handler=handler;
}
return this.i_handler;
}
TransportRequest.prototype.finish=function() {
if (!this.complete()) {
if(this.getRequestObject().readyState==4) { 		
this.complete(true);
Transport.connections++;
Transport.executeQueue();
if(window.parent._GDS_) {
window.parent.XML.checkResponse(this.getRequestObject().responseXML);
}
var cb=this.handler();
if (cb!=undefined) {
cb(this.getRequestObject().responseXML, this, this.args(), this.getRequestObject().responseText);
}
return true;
}
}
}
TransportRequest.prototype.execute=function() {
if (!this.complete() && !this.working()) {
this.working(true);
var useData="xml="+escape(this.postData());
if(Transport.username()!=null) {
useData+="&unm="+Transport.username();
}
if(Transport.sessionId()!=null) {
useData+="&sid="+Transport.sessionId();
}
if(Transport.nonMemberId()!=null) {
useData+="&nmid="+Transport.nonMemberId();
}
if (this.postData()!=undefined) {
this.getRequestObject().open('POST', this.url(), true);
this.getRequestObject().setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
}
else {
this.getRequestObject().open('GET', this.url(), true);
}
if (this.getRequestObject().overrideMimeType) {
this.getRequestObject().overrideMimeType('text/xml');
}
var me=this;
this.getRequestObject().onreadystatechange=function() {
me.finish();
}
this.getRequestObject().send(useData);
}
}
TransportRequest.prototype.status=function() {
if(this.getRequestObject().responseXML) {
var xml_temp=this.getRequestObject().responseXML.getElementsByTagName("result");
if(xml_temp.length > 0) {
var code=xml_temp[0].getElementsByTagName("code");
var description=xml_temp[0].getElementsByTagName("desc");
if(code.length > 0) {
if(getValue(code[0])=="20000000") {
return true;
}
}
}
}
return false;
}
function Utf8() {
}
Utf8.encode=function(str) {
str=str.replace(/\r\n/g, "\n");
var res="";
for (var x=0; x < str.length; x++) {
var ch=str.charCodeAt(x);
if (ch < 128) {
res+=str.charAt(x);
}
else if (ch < 2048) {
res+=String.fromCharCode((ch >> 6) | 192)+String.fromCharCode((ch & 63) | 128);
}
else {
res+=String.fromCharCode((ch >> 12) | 224)+String.fromCharCode(((ch >> 6) & 63) | 128)+String.fromCharCode((ch & 63) | 128);
}
}
return res;
}
function parseName(name) {
var nameObject=new Object();
var prefixes="(prof\\.?[ ]+|professor[ ]+|mister[ ]+|misses[ ]+|Mr\\.?[ ]+|Mrs\\.?[ ]+|Ms\\.?[ ]+|Dr\\.?[ ]+|Miss[ ]+|Sir[ ]+|Madam[ ]+)"
var suffixes="((Jr\\.?\\s*|Sr\\.?\\s*|III\\s*|IV\\s*|V\\s*|VI\\s*|VII\\s*|VIII\\s*|IX\\s*|X\\s*|XI\\s*|XII\\s*|XII\\s*|Phd\\s*|MD\\s*|esq\\s*)*)"
var fml=new RegExp("^\\s*"+prefixes+"?([A-z'\\-\\.]+\\s+)?([^,]*?)([A-z'\-]+\\s*?)"+suffixes+"\\s*$", "i")
var fml2=new RegExp("^\\s*(\\w+), *(\\w+)( .*?)?"+suffixes+"\\s*$", "i")
fmlResult=fml.exec(name);
fmlResult2=fml2.exec(name);
nameObject["prefix"]=(fmlResult)? fmlResult[1] : "";
nameObject["given"]=(fmlResult)? fmlResult[2] : (fmlResult2)? fmlResult2[2] : name;
nameObject["middle"]=(fmlResult)? fmlResult[3] : (fmlResult2)? fmlResult2[3] : "";
nameObject["family"]=(fmlResult)? fmlResult[4] : (fmlResult2)? fmlResult2[1] : "";
nameObject["suffix"]=(fmlResult)? fmlResult[5] : (fmlResult2)? fmlResult2[4] : "";
nameObject["prefix"]=trim(nameObject["prefix"]);
nameObject["given"]=trim(nameObject["given"]);
nameObject["middle"]=trim(nameObject["middle"]);
nameObject["family"]=trim(nameObject["family"]);
nameObject["suffix"]=trim(nameObject["suffix"]);
return nameObject;
}
function parseAddress(address) {
var addressObject=new Object();
var streets="(st(\.?|reet)|r(d\.?|oad)|cir(\.?|cle)|dr(\.?|ive)|av(e?\.?|nue)|b(lvd\.?|oulevard)|la(\.?|ne)|c(t\.?|ourt)|loop|tr(\.?|ail)|way|p(kwy|arkway)|highway ?[0-9]*|interstate ?[0-9]*)(\\s*(ext\.?)*[nwes]*)?"
var postalCode="((\\d{5}(?:-\\d{4})?)|([A-z]\\d[A-z]\\s*\\d[A-z]\\d)|\\d{4}|[A-z][A-z]?[0-9][A-z0-9]?\\s*[0-9][A-z][A-z])"
var postalRe=new RegExp("^\\s*"+postalCode+"\\s*$","i")
var ad2re=new RegExp("^\\s*(.*)(apt\\.? |suite |ste\\.? |p\\.?o\\.? |p\\.?o\\.?b\\.? |post office box |p\\.?o\\.? box |floor |box )([0-9\\-A-z]+)?\\s*$","i")
var ad1NumRe=new RegExp("^\\s*(\\d+)\\s+(.*)"+streets+"?\\s*$","i")
var ad1StOnlyRe=new RegExp("^\\s*(.*)"+streets+"\\s*$","i")
var sczre=new RegExp("^\\s*([^,]+),?\\s+([A-z]{2,3})\\s*"+postalCode+"?\\s*$","i")
var ctryre=new RegExp("^\\s*(((U)(nited |\. )?(S)(tates|\.)?\\s*(A|of america)?)|can|canada|aus|australia|u\.?\\s+k\?.|great britain)?\\s*$","i")
var adLines=address.split(/\n/)
for (i=0;i<adLines.length;i++) {
var matchesCountry=ctryre.exec(adLines[i])
var matchesScz=sczre.exec(adLines[i]) 
var matchesAd2=ad2re.exec(adLines[i])
var matchesAd1Num=ad1NumRe.exec(adLines[i])
var matchesAd1St=ad1StOnlyRe.exec(adLines[i])
var matchesPostal=postalRe.exec(adLines[i])
var percentDone=i/(adLines.length-1)
if (matchesCountry) {
addressObject["ctry"]=adLines[i];
} else if (matchesAd2) {
addressObject["pobox"]=adLines[i];
} else if (matchesAd1Num) {
setNextAddressField(adLines[i],addressObject);
} else if (matchesAd1St) {
setNextAddressField(adLines[i],addressObject);
} else if (matchesScz) {
addressObject["locality"]=matchesScz[1];
addressObject["region"]=matchesScz[2];
addressObject["pcode"]=matchesScz[3];
} else if (percentDone>=.5 && matchesPostal) {
addressObject["pcode"]=adLines[1];
} else {
if (percentDone<.8) addTo(addressObject,"pobox", adLines[i]);
else addTo(addressObject,"ctry", adLines[i]); 
}
}
return addressObject;	
}
function addTo(addressObject,name,value) {
if (addressObject[name]==undefined)
addressObject[name]=value;
else
addressObject[name]+="\n"+value;
}
function setNextAddressField(val,addressObject) {
if (!addressObject["street"]) addressObject["street"]=val
else if (!addressObject["pobox"]) addressObject["pobox"]=val
else if (!addressObject["locality"]) addressObject["locality"]=val
else if (!addressObject["region"]) addressObject["region"]=val
}
function validAlphabetChar(ch) {
var res;
var code=ch.charCodeAt(0); 
res=(code >="a".charCodeAt(0) && code <="z".charCodeAt(0)) ||
(code >="A".charCodeAt(0) && code <="Z".charCodeAt(0)) ||
(code >="0".charCodeAt(0) && code <="9".charCodeAt(0)) ||
(code >="'".charCodeAt(0)) ||
(code=="_".charCodeAt(0)) || (code=="-".charCodeAt(0)) ||
(code=="&".charCodeAt(0));
return res;
}
function validEmailStr(str_email) {
var curState=0;
var pos=0; 
var str=trim(str_email);
var c;
if (str_email.indexOf("@")!=str_email.lastIndexOf("@")) return null;
if (str.length==0) return true;
while (pos < str.length) { 
c=str.charAt(pos);
switch(curState) {
case 0:   
if (!validAlphabetChar(c)) return false;
curState=1;
break;
case 1:   
if (!validAlphabetChar(c) && c!='@' && c!='.') return false;
if (c=='.') curState=5;
else if (c=='@') curState=2;
break;
case 2:   
if (!validAlphabetChar(c)) return false;
curState=3;
break;
case 3:   
if (!validAlphabetChar(c) && c!='.') return false;
if (c=='.') curState=4;
break;
case 4:   
if (!validAlphabetChar(c)) return false;
curState=6;
break;
case 5:   
if (!validAlphabetChar(c)) return false;
curState=1;
break;
case 6:   
if (!validAlphabetChar(c) && c!='.') return false;
if (c=='.') curState=7;
break;
case 7:
if (!validAlphabetChar(c)) return false;
curState=6;
break;
}
pos++;
}
if (curState!=6) return false;
return true;
}
function trim(str) {
if(typeof str!="undefined") {
return str.replace(/^\s*(.*?)\s*$/, "$1")
}
return "";
}
