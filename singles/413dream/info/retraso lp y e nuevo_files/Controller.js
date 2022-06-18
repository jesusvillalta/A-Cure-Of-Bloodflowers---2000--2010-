Object.prototype.inherit=function() {
for (var x=0; x < arguments.length; x++) {
for (var meth in arguments[x].prototype) {
if (this.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
this.prototype[meth]=arguments[x].prototype[meth];
}
}
}
}
function ResourceManager() {
}
ResourceManager.max_connections=2;
ResourceManager.top_priority=-1000;
ResourceManager.resource_timeout=240000; 
ResourceManager.cache=true;
ResourceManager.strict_javascript=true;
ResourceManager.requests=Array();
ResourceManager.active_requests=Array();
ResourceManager.connections=0;
ResourceManager.resources_remaining=0;
ResourceManager.i_enabled=false;
ResourceManager.listeners=Array();
ResourceManager.i_noticeTimeout=true;
ResourceManager.randomString=function(len) {
var str="";
len=(len==undefined ? 10 : len);
var selection="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for (var x=0; x < len; x++) {
str+=selection.substr(Math.random() * selection.length, 1);
}
return str;
}
ResourceManager.push_request=function(request) {
ResourceManager.requests[ResourceManager.requests.length]=request;
ResourceManager.updateCounter(1);
ResourceManager.pollConnections();
return request;
}
ResourceManager.noticeTimeout=function(state) {
if (state!=undefined) {
ResourceManager.i_noticeTimeout=state;
}
return ResourceManager.i_noticeTimeout;
}
ResourceManager.enabled=function(state) {
if (state!=undefined){
ResourceManager.i_enabled=state;
ResourceManager.pollConnections();
}
return ResourceManager.i_enabled;
}
ResourceManager.postMessage=function(resource, message) {
for (var x=0; x < ResourceManager.listeners.length; x++) {
if (!ResourceManager.listeners[x].done()) {
ResourceManager.listeners[x].resource_post(resource, message);
}
}
}
ResourceManager.updateCounter=function(val, resource) {
ResourceManager.resources_remaining+=val;
if (val < 0) {
for (var x=0; x < ResourceManager.listeners.length; x++) {
if (!ResourceManager.listeners[x].done()) {
ResourceManager.listeners[x].resource_completed(resource);
}
}
}
return ResourceManager.resources_remaining;
}
ResourceManager.nextResource=function(removeNext) {
var topPriority=-1000;
var nextReq;
for (var x=0; x < ResourceManager.requests.length; x++) {
if (ResourceManager.requests[x].priority() > topPriority) {
nextReq=x;
topPriority=ResourceManager.requests[x].priority();
}
}
if (topPriority < ResourceManager.top_priority)
return undefined;
if (nextReq!=undefined) {
ResourceManager.top_priority=topPriority;
var req=ResourceManager.requests[nextReq];
if (removeNext==true) {
ResourceManager.requests.splice(nextReq, 1);
}
return req;
}
else {
return undefined;
}
}
ResourceManager.pollConnections=function() {
if (ResourceManager.enabled()==true) {
var free=(ResourceManager.max_connections - ResourceManager.connections);
var nextReq=Array();
while (ResourceManager.requests.length > 0 && free > 0) {
var nextR=ResourceManager.nextResource(true);
if (nextR!=undefined) {
nextReq[nextReq.length]=nextR;
free--;
}
else {
break;
}
}
for (var x=0; x < nextReq.length; x++) {
nextReq[x].initiate();
}
return true;
}
return false;
}
ResourceManager.getResourceListener=function() {
var rl=new ResourceListener();
ResourceManager.listeners[ResourceManager.listeners.length]=rl;
return rl;
}
ResourceManager.getResourceRequest=function(p, url, callback, post, args, priority, description, extension) {
var resource;
var ext="";
var query=false;
var hasQuery=(url.indexOf('?') > 0 ? true : false);
for (var x=url.length - 1; x >=0; x--) {
if (query==hasQuery) {
if (url.charAt(x)=='.') {
break;
}
ext=url.charAt(x)+ext;
}
if (url.charAt(x)=='?') {
query=true;
}
}
ext=ext.toLowerCase();
if (extension!=undefined) {
ext=extension;
}
switch (ext) {
case 'gif': case 'jpg': case 'jpeg': case 'png': case 'bmp': case 'tiff': case 'psd':
resource=new ImageResource(p, url, callback, post, args, priority, description);
break;
case 'xml': case 'fcg':	case 'php': case 'html': case 'txt': case 'cgi': case 'pl':
case 'asp': case 'log':	case 'shtml': case 'htm':
resource=new AsciiResource(p, url, callback, post, args, priority, description);
break;
case 'css':
resource=new CSSResource(p, url, callback, post, args, priority, description);
break;
case 'js': case 'javascript':
resource=new JavaScriptResource(p, url, callback, post, args, priority, description);
break;
default:
alert('An unknown file type was requested in the ResourceManager.  Please define'+' a download method for files of type '+ext+'.');
return false;
}
return resource;
}
ResourceManager.request=function(url, priority, callback, post, args, description, extension) {
var resource=ResourceManager.getResourceRequest(undefined, url, callback, post, args, priority, description, extension);
ResourceManager.push_request(resource);
return resource;
}
ResourceManager.requestRemote=function(url, priority, callback, post, args, description, extension) {
var dx=new Image();
dx.onload=function() {
alert("Onload");
ResourceManager.request(url, priority, callback, post, args, description, extension);
}
dx.src="./img/ico_myday.gif";
}
ResourceManager.requestObject=function(className,urls,priority,ctorArgs,callback,cbArgs) {
if (!urls) {
return;
}
var handlerArgs=new Array();
handlerArgs.push(className);
handlerArgs.push(ctorArgs);
handlerArgs.push(callback);
handlerArgs.push(cbArgs);
if (!urls.splice) {
return ResourceManager.request(urls,priority,
ResourceManager.handleRequestObject,
null,handlerArgs);
}
if (urls.length==1) {
return ResourceManager.request(urls[0],priority,
ResourceManager.handleRequestObject,
null,handlerArgs);
} 
for (var i=0;i<(urls.length-1);i++) {
ResourceManager.request(urls[i],priority);
}
return ResourceManager.request(urls[urls.length-1],priority,
ResourceManager.handleRequestObject,null,handlerArgs);
}
ResourceManager.handleRequestObject=function(data,xml,request,args) {
if (!args) {
return;
}
var className=args[0];
if (!className) {
return;
}
var classNames=Array();
if(className instanceof Array) {
classNames=className;
} else {
classNames.push(className);
}
var ctorArgs=args[1];
for(var i=0; i < classNames.length; i++) {
if (ctorArgs) {
var obj=eval("new "+classNames[i]+"(ctorArgs)");
} else {
var obj=eval("new "+classNames[i]+"()");
}
if (!obj) {
return;
}
var callback=args[2];
if (!callback) {
return;
}
var cbArgs=args[3];
callback(obj,cbArgs);
}
}
function ResourceRequest(p, url, callback, post, args, priority, description, cached) {
this.superConstructor(p, url, callback, post, args, priority, description, cached);
}
ResourceRequest.prototype.superConstructor=function(parent, url, callback, post, args, priority, description, cache) {
this.i_url=url;			
this.i_parent=parent;			
this.i_priority=priority;		
this.i_callback=callback;		
this.i_dependents=Array();		
this.i_args=args;			
this.i_post=post;			
this.i_description=description;
this.i_complete=false;		
this.i_active=false;			
this.i_enabled=true;			
this.i_cache=(cache==undefined ? true : false); 
}
ResourceRequest.prototype.post=function(post) {
if (post!=undefined) {
this.i_post=post;
}
return this.i_post;
}
ResourceRequest.prototype.args=function(args) {
if (args!=undefined) {
this.i_args=args;
}
return this.i_args;
}
ResourceRequest.prototype.complete=function() {
return this.i_complete;
}
ResourceRequest.prototype.cache=function(state) {
if (state!=undefined) {
this.i_cache=state;
}
return this.i_cache;
}
ResourceRequest.prototype.parent=function() {
return this.i_parent;
}
ResourceRequest.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
}
return (this.i_description!=undefined ? this.i_description : "Loading: "+this.url());
}
ResourceRequest.prototype.url=function() {
var rURL=this.i_url;
if (ResourceManager.cache==false || this.cache()==false) {
rURL=rURL+(rURL.indexOf('?') > -1 ? "&" : "?")+"anti-cache="+ResourceManager.randomString();
}
return rURL;
}
ResourceRequest.prototype.enabled=function() {
return this.i_enabled;
}
ResourceRequest.prototype.cancel=function() {
if (this.parnet()!=undefined) {
for (var x=0; x < this.parent().dependents().length; x++) {
if (this.parent().dependents()[x]==this) {
this.parent().dependents().splice(x, 1);
ResourceManager.updateCounter(this.dependentCount() * -1, this);
this.i_enabled=false;
return true;
}
}
}
else {
for (var x=0; x < ResourceManager.requests.length; x++) {
if (ResourceManager.requests[x]==this) {
ResourceManager.requests.splice(x, 1);
ResourceManager.updateCounter(this.dependentCount() * -1, this);
this.i_enabled=false;
return true;
}
}
}
return false;
}
ResourceRequest.prototype.priority=function(priority) {
if (priority!=undefined) {
this.i_priority=priority;
}
return this.i_priority;
}
ResourceRequest.prototype.callback=function(callback) {
if (callback!=undefined) {
this.i_callback=callback;
}
return this.i_callback;
}
ResourceRequest.prototype.dependents=function() {
return this.i_dependents; 
}
ResourceRequest.prototype.request_complete=function(successful, data, xml) {
if (this.i_timeout!=undefined) { 
clearTimeout(this.i_timeout);
this.i_timeout=undefined;
}
if (this.i_complete==false) {
this.i_complete=true;
this.i_active=false;
for (var x=0; x < ResourceManager.active_requests.length; x++) {
if (ResourceManager.active_requests[x]==this) {
ResourceManager.active_requests.splice(x, 1);
break;
}
}
ResourceManager.connections--;
ResourceManager.updateCounter(-1, this);
if (successful==true) {
for (var x=0; x < this.i_dependents.length; x++) {
this.i_dependents[x].i_parent=undefined;
ResourceManager.push_request(this.i_dependents[x]);
}
}
if (ResourceManager.active_requests.length==0) {
ResourceManager.top_priority=-1000;
}
setTimeout(ResourceManager.pollConnections, 1);
if (successful==true) {	
if(this.resource_session_check(data, xml)) { 
if (this.i_callback!=undefined) {
var cb=this.callback();
var me=this;
setTimeout(function() {
if(cb.splice!=undefined) {
cb[0][cb[1]](data, xml, me, me.args());
} else if(typeof(cb)=="object") {
cb.execute(data, xml, me, me.args());
} else {
cb(data, xml, me, me.args());
}
}, 1);
}
}else{
sessionTimeout(true, true);
}
}
}
}
ResourceRequest.prototype.resource_session_check=function(data, xml) {
if(xml) {
return XML.checkResponseSession(xml);
}
return true;
}
ResourceRequest.prototype.initiate=function() {
this.i_active=true;
ResourceManager.connections++;
ResourceManager.active_requests[ResourceManager.active_requests.length]=this;
ResourceManager.postMessage(this, this.description());
var me=this;
this.i_timeout=setTimeout(function() {
me.validateComplete();
}, ResourceManager.resource_timeout);
if (this.start_import!=undefined) {
this.start_import();
}
else {
alert('A resource was requested which does not have a download procedure defined.  Please make sure that all objects added to the ResourceManager include start_import methods.'+"\n This resource will not be imported \n\n"+this.url());
this.request_complete(false);
}
return true;
}
ResourceRequest.prototype.validateComplete=function() {
if (!this.i_complete && ResourceManager.enabled()) {
if (ResourceManager.noticeTimeout()) {
if (confirm(this.url()+"\n\n"+"A required resource could not be loaded, would you like to try again?")) {
window.location.reload(false);
}
}
}
}
ResourceRequest.prototype.depdentCount=function() {
var c=1;
for (var x=0; x < this.i_dependents.length; x++) {
c+=this.i_dependents[x].dependentCount();
}
return c;
}
ResourceRequest.prototype.request=function(url, priority, callback) {
var requestIndex=this.i_dependents.length;
this.i_dependents[requestIndex]=ResourceManager.getResourceRequest(this, url, callback, priority, description);
ResourceManager.updateCount(1);
return this.i_dependents[requestIndex];
}
function ImageResource(p, url, callback, post, args, priority, description) {
this.superConstructor(p, url, callback, post, args, priority, description);
}
ImageResource.prototype.url=function(url) {
if (url!=undefined) {
this.i_url=url;
}
return this.i_url;
}
ImageResource.prototype.completeDownload=function() {
var me=this.rreq;
me.request_complete(true);
}
ImageResource.prototype.failDownload=function() {
var me=this.rreq;
alert('Unable to download image resource: '+me.url());
me.request_complete(false);
}
ImageResource.prototype.start_import=function() {
this.i_image=new Image();
this.i_image.rreq=this;
this.i_image.onload=this.completeDownload;
this.i_image.onerror=this.failDownload;
this.i_image.onabort=this.failDownload;
this.i_image.src=this.url();
}
ImageResource.inherit(ResourceRequest);
function AsciiResource(p, url, callback, post, args, priority, description) {
this.superConstructor(p, url, callback, post, args, priority, description);
}
AsciiResource.prototype.completeDownload=function(data, xml) {
var tm;
try {
tm=this.i_server.getResponseHeader("Session-timeout");
if (tm==1) {
sessionTimeout(true);
this.request_complete(false);
return true;
}
}
catch (e) { }
this.request_complete(true, data, xml);
}
AsciiResource.prototype.failDownload=function() {
alert('Unable to download ascii resource: '+this.url());
this.request_complete(false);
}
AsciiResource.prototype.start_import=function() {
this.i_server=(document.all ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest());
var server=this.i_server;
var me=this;
this.i_server.onreadystatechange=function() {
if (server.readyState==4) {
me.completeDownload(server.responseText, server.responseXML);
me.onreadystatechange=null;
me=null;
}
};
try {
this.i_server.open((this.post()!=undefined ? "post" : "get"), this.url(), true);
this.i_server.send((this.post()!=undefined ? this.post().toString() : null));
}
catch (e) { 
alert(e.message);
this.failDownload();
}
}
AsciiResource.inherit(ResourceRequest);
function CSSResource(p, url, callback, post, args, priority, description) {
this.superConstructor(p, url, callback, post, args, priority, description);
}
CSSResource.compile_results=true;
CSSResource.prototype.completeDownload=function(data) {
if (CSSResource.compile_results==true) {
if (CSSResource.activeStylesheet==undefined) {
CSSResource.activeStylesheet=document.createElement('STYLE');
CSSResource.activeStylesheet.type="text/css";
CSSResource.activeStylesheet.id="GDSStyleID";
document.getElementsByTagName('head')[0].appendChild(CSSResource.activeStylesheet);
}	
CSSResource.activeStylesheet.innerHTML+=data;
}
else {
var s=document.createElement('STYLE');
s.type="text/css";
s.innerHTML=data;
document.getElementsByTagName('head')[0].appendChild(s);
}
this.request_complete(true);
}
CSSResource.prototype.failDownload=function() {
alert('Unable to download stylesheet resource: '+me.url());
this.request_complete(false);
}
CSSResource.prototype.completeIEDownload=function() {
var me=this.rreq;
me.request_complete(true);
}
CSSResource.prototype.failIEDownload=function() {
var me=this.rreq;
alert('Unable to download stylesheet resource: '+me.url());
me.request_complete(false);
}
CSSResource.prototype.start_import=function() {
var safari=(navigator.userAgent.toLowerCase().indexOf("safari") > -1);
if (document.all || safari) {
var sheet=document.createElement('link');
sheet.rel='stylesheet';
sheet.type='text/css';
sheet.rreq=this;
sheet.onload=this.completeIEDownload;
sheet.onerror=this.failIEDownload;
sheet.onabort=this.failIEDownload;
sheet.onreadystatechange=this.completeIEDownload;
sheet.href=this.url();	
document.getElementsByTagName('head')[0].appendChild(sheet);
if(safari) {
this.request_complete(true);
}
}
else {
this.i_server=(document.all ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest());
var server=this.i_server;
var me=this;
this.i_server.onreadystatechange=function() {
if (server.readyState==4) {
me.completeDownload(server.responseText);
me.onreadystatechange=null;
me=null;
}
};
try {
this.i_server.open("get", this.url(), true);
this.i_server.send(null);
}
catch (e) { 
this.failDownload();
}
}
}
CSSResource.inherit(ResourceRequest);
function JavaScriptResource(p, url, callback, post, args, priority, description) {
this.superConstructor(p, url, callback, post, args, priority, description);
}
JavaScriptResource.resources=Array();
JavaScriptResource.prototype.completeDownload=function() {
var me=this.rreq;
me.request_complete(true);
}
JavaScriptResource.prototype.failDownload=function() {
var me=this.rreq;
alert('Unable to download script resource: '+me.url());
me.request_complete(false);
}
JavaScriptResource.notifyComplete=function(file_path) {
for (var x=0; x < JavaScriptResource.resources.length; x++) {
var u=JavaScriptResource.resources[x].url();
if (u.indexOf('?') >=0) {
u=u.substr(0, u.indexOf('?'));
}
if(u.substr(0,4)=="http") {
for(var q=0; q < 3; q++) {
try {
u=u.substring(u.indexOf("/")+1);
}catch(e) {
console.log('Error removing hostname');
}
}
u="/"+u;
}
if (u==file_path) {
JavaScriptResource.resources[x].request_complete(true);
JavaScriptResource.resources.splice(x, 1);
return true;
}
}
return false;
}
JavaScriptResource.prototype.start_import=function() {
var script=document.createElement('script');
script.type='text/javascript';
script.rreq=this;
script.onerror=this.failDownload;
script.onabort=this.failDownload;
if (ResourceManager.strict_javascript) {
JavaScriptResource.resources[JavaScriptResource.resources.length]=this;
}
else {
script.onload=this.completeDownload;
script.onreadystatechange=this.completeDownload;
}
script.src=this.url();		
document.getElementsByTagName('head')[0].appendChild(script);
}
JavaScriptResource.inherit(ResourceRequest);
function ResourceListener() {
this.reset();
}
ResourceListener.prototype.reset=function() {
this.i_resources=Array();
this.i_completed=0;
this.i_done=false;
var recQ=Array();
for (var x=0; x < ResourceManager.requests.length; x++) {
recQ[x]=ResourceManager.requests[x];
}
for (var x=0; x < ResourceManager.active_requests.length; x++) {
recQ[recQ.length]=ResourceManager.active_requests[x];
}
while (recQ.length > 0) {
var sub=recQ[0];
recQ.splice(0, 1);
if (sub.dependents()!=undefined) {
for (var x=0; x < sub.dependents().length; x++) {
recQ[recQ.length]=sub.dependents()[x];
}
}
if (sub.complete()) {
this.i_completed++;
}
this.i_resources[this.i_resources.length]=sub;
}
if (this.onchange!=undefined) {
this.onchange(this.percent());
}
}
ResourceListener.prototype.done=function() {
if (this.i_done==false) {
if (this.i_resources.length==this.i_completed) {
this.i_done=true;
for (var x=0; x < this.i_resources.length; x++) {
this.i_resources[x]=null;
}
this.onchange=null;
this.onstatusmessage=null;
}
}
return this.i_done;
}
ResourceListener.prototype.percent=function() {
if (this.i_resources.length <=0) {
return 100;
}
if (this.i_resources.length==this.i_completed) {
return 100;
}
return Math.floor((this.i_completed / this.i_resources.length) * 100);
}
ResourceListener.prototype.resource_completed=function(resource) {
for (var x=0; x < this.i_resources.length; x++) {
if (resource==this.i_resources[x]) {
this.i_completed++;
if (this.onchange!=undefined) {
this.onchange(this.percent());
}
if (this.i_completed==this.i_resources.length) {
if (this.oncomplete!=undefined) {
this.oncomplete();
}
}
return true;
}
}
return false;
}
ResourceListener.prototype.resource_post=function(resource, message) {
for (var x=0; x < this.i_resources.length; x++) {
if (resource==this.i_resources[x]) {
if (this.onstatusmessage!=undefined) {
this.onstatusmessage(message, resource);
}
return true;
}
}
return false;
}
ResourceListener.prototype.onchange=function(percent) {}
ResourceListener.prototype.onstatusmessage=function(message, resource) {}
ResourceListener.prototype.oncomplete=function() {} 
function ResourceXMLBlock(block_text) {
this.i_block_text=block_text;
}
ResourceXMLBlock.prototype.text=function(text) {
if (text!=undefined) {
this.i_block_text=text;
}
return this.i_block_text;
}
ResourceXMLBlock.prototype.toString=function() {
return this.i_block_text;
}
function ResourceXMLNode(nodeName, value, cdata) {
this.i_name=nodeName;			
this.i_value=value;			
this.i_forceCDATA=(cdata!=undefined ? cdata : false);
this.i_children=Array();
}
ResourceXMLNode.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
ResourceXMLNode.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
}
return this.i_value;
}
ResourceXMLNode.prototype.forceCDATA=function(state) {
if (state!=undefined) {
this.i_forceCDATA=state;
}
return this.i_forceCDATA;
}
ResourceXMLNode.prototype.children=function(index) {
if (index!=undefined) {
return this.i_children[index];
}
return this.i_children;
}
ResourceXMLNode.prototype.addNode=function(node) {
this.i_children[this.i_children.length]=node;
return node;
}
ResourceXMLNode.prototype.addLeafNode=function(nodeName,value, cdata) {
return this.addNode(new ResourceXMLNode(nodeName,value, cdata));
}
ResourceXMLNode.prototype.removeNode=function(node) {
for (var x=0; x < this.i_children.length; x++) {
if (this.i_children[x]==node) {
this.i_children.splice(x, 1);
return true;
}
}
return false;
}	
ResourceXMLNode.prototype.toString=function() {
var str="<"+this.name()+">"+(this.forceCDATA() ? "<![CDATA[" : "");
if (this.i_children.length==0) {
str+=this.value();
}
else {
for (var x=0; x < this.i_children.length; x++) {
str+=this.i_children[x].toString();
}
}
str+=(this.forceCDATA() ? "]]>" : "")+"</"+this.name()+">";
return str;
}	
function ResourcePost() {
this.params=Array();
}
ResourcePost.prototype.param=function(name, value) {
if (value!=undefined) {
this.params['cx_'+name]=value;
}
return this.params['cx_'+name];
}
ResourcePost.prototype.toString=function() {
var str="";
for (var i in this.params) {
if (i.substr(0, 3)=='cx_') {
var ui=i.substr(3);
if (str!="") {
str+="&";
}
str+=escape(ui)+"="+escape(this.params[i]);
str=str.replace(/\+/g, "%2B"); 
}
}
return str;
}
