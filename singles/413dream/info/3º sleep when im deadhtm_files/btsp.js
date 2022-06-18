function StatusBox(width, height, text) {
this.i_width=width;
this.i_height=height;
this.i_text=(text!=undefined ? Array(text) : Array());
}
StatusBox.lineHeight=13;
StatusBox.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_div!=undefined) {
this.update();			
}
}
return this.i_width;
}
StatusBox.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_div!=undefined) {
this.update();			
}
}
return this.i_height;
}	
StatusBox.prototype.clear=function() {
this.i_text=Array();
this.update(true);
}
StatusBox.prototype.addMessage=function(text) {
this.i_text[this.i_text.length]=text;
if (this.i_text.length > ((this.height() - 8) / StatusBox.lineHeight)) {
this.i_text.splice(0, 1);
}
this.update(true);
}
StatusBox.prototype.update=function(updateMessage) {
if (this.i_div!=undefined) {
var lns=((this.height() - 8) / StatusBox.lineHeight);
while (this.i_text.length < lns - 1) {
this.i_text.splice(0, 0, "&nbsp;");
updateMessage=true;
}
if (updateMessage!=undefined) {
var newText="";
for (var x=this.i_text.length - 1; x >=0; x--) {
newText=this.i_text[x]+"<br>"+newText;
}
this.i_text_div.innerHTML=newText;
}
this.i_div.style.width=this.width()+"px";
this.i_div.style.height=this.height()+"px";
return true;
}
return false;
}	
StatusBox.prototype.getStatusBox=function() {
if (this.i_div==undefined) {
this.i_div=document.createElement('DIV');
this.i_div.className="StatusBox";
this.i_text_div=document.createElement('DIV');
this.i_div.appendChild(this.i_text_div);
this.update(true);
}
return this.i_div;
}
JavaScriptResource.notifyComplete("./lib/components/Component.StatusBox.js");
function ProgressBar(width, height, min, max, current) {
this.i_width=width;
this.i_height=height;
this.i_min=(min!=undefined ? min : 0);
this.i_max=(max!=undefined ? max : 100);
this.i_current=(current!=undefined ? current : 0);
}
ProgressBar.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_div!=undefined) {
this.update(true);			
}
}
return this.i_width;
}
ProgressBar.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_div!=undefined) {
this.update(true);			
}
}
return this.i_height;
}
ProgressBar.prototype.minimum=function(min) {
if (min!=undefined) {
this.i_min=min;
if (this.i_div!=undefined) {
this.update();			
}
}
return this.i_min;
}
ProgressBar.prototype.maximum=function(max) {
if (max!=undefined) {
this.i_max=max;
if (this.i_div!=undefined) {
this.update();			
}
}
return this.i_max;
}
ProgressBar.prototype.current=function(current) {
if (current!=undefined) {
if (current < this.minimum()) {
current=this.minimum();
}
if (current > this.maximum()) {
current=this.maximum();
}
this.i_current=current;
if (this.i_div!=undefined) {
this.update();			
}
}
return this.i_current;
}
ProgressBar.prototype.maximum=function(max) {
if (max!=undefined) {
this.i_max=max;
if (this.i_div!=undefined) {
this.update();			
}
}
return this.i_max;
}
ProgressBar.prototype.update=function(updateDimensions) {
var newWidth=(((this.current() - this.minimum()) / (this.maximum() - this.minimum())) * this.width()) - 2;
if (newWidth < 1) {
this.i_inner_div.style.width="1px";
}
else {
this.i_inner_div.style.width=newWidth;
}
if (updateDimensions==true) {
this.i_inner_div.style.height=(this.height() - 2)+"px";
this.i_text_div.style.width=(this.width() - 4)+"px";
this.i_text_div.style.height=(this.height() - 4)+"px";
this.i_text_div.style.lineHeight=(this.height() - 3)+"px";
this.i_text_div.style.top=(-1 * (this.height() - 3))+"px";
this.i_text_div.style.marginBottom=(-1 * (this.height() - 4))+"px";
}
var per=Math.floor(((this.current() - this.minimum()) / (this.maximum() - this.minimum())) * 100);
this.i_text_value.innerHTML=per+"%";
}
ProgressBar.prototype.getProgressBar=function() {
if (this.i_div==undefined) {
this.i_div=document.createElement('DIV');
this.i_div.style.width=this.width()+"px";
this.i_div.style.height=this.height()+"px";
this.i_div.className="ProgressBar";
this.i_inner_div=document.createElement('DIV');
this.i_inner_div.className="ProgressBar_bar";
this.i_inner_div.innerHTML+="&nbsp;";
this.i_div.appendChild(this.i_inner_div);
this.i_text_div=document.createElement('DIV');
this.i_text_div.className="ProgressBar_text";
this.i_div.appendChild(this.i_text_div);
this.i_text_value=document.createElement('DIV');
this.i_text_div.appendChild(this.i_text_value);
this.update(true);
}
return this.i_div;
}
JavaScriptResource.notifyComplete("./lib/components/Component.ProgressBar.js");
function SplashScreen(width, height, text, mask_workspace, logo_width, progress_height) {
this.i_width=width;
this.i_height=height;
this.i_logo_width=(logo_width!=undefined ? logo_width : 200);
this.i_progress_height=(progress_height!=undefined ? progress_height : 20);
this.i_text=(text==undefined ? "Please Wait..." : text);
this.i_status=new StatusBox((width - 20) - this.logoWidth(), ((height - 30) - this.progressHeight()));
this.i_progress=new ProgressBar((width - 20) - this.logoWidth(), this.progressHeight());
this.i_mask=(mask_workspace!=undefined ? mask_workspace : true);
this.i_visible=false;
this.i_visibleMessages=true;
}
SplashScreen.prototype.visibleMessages=function(state) {
if(state!=undefined) {
this.i_visibleMessages=state;
}
return this.i_visibleMessages;
}
SplashScreen.prototype.visible=function(state) {
if (state!=undefined) {
if (state!=this.i_visible) {
this.i_visible=state;
if (state==true) {
if (this.i_mask) {
document.body.prevOverflow=document.body.style.overflow;
document.body.style.overflow="hidden";
document.body.appendChild(this.getWorkspaceMask());
}
document.body.appendChild(this.getSplashScreen());
}
else {
try {
document.body.removeChild(this.getWorkspaceMask());
} catch (e) { }
document.body.style.overflow=document.body.prevOverflow;
document.body.prevOverflow=undefined;
document.body.removeChild(this.getSplashScreen());
}
this.updatePosition();
}
}
return this.i_visible;
}
SplashScreen.prototype.updatePosition=function() {
if (this.visible()) {
var bWidth=(document.all ? document.body.offsetWidth : window.innerWidth);
var bHeight=(document.all ? document.body.offsetHeight : window.innerHeight);
bWidth-=this.width();
bHeight-=this.height();
this.i_div.style.left=Math.floor(bWidth / 2)+"px";
this.i_div.style.top=Math.floor(bHeight / 2)+"px";
}
}
SplashScreen.prototype.updateProgress=function(progress) {
this.i_progress.current(progress);
}
SplashScreen.prototype.postMessage=function(message) {
this.i_status.addMessage(message);
}
SplashScreen.prototype.workspaceMask=function(state) {
if (state!=undefined) {
this.i_mask=state;
}
return this.i_mask;
}
SplashScreen.prototype.logoWidth=function(width) {
if (width!=undefined) {
this.i_logo_width=width;
if (this.i_div!=undefined) {
this.i_div_logo_inner.style.width=this.logoWidth()+"px";
this.i_div_status.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.i_div_progress.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.i_div_spacer.style.width=((this.width() - 20) - this.logoWidth())+"px";
}
}
return this.i_logo_width;
}
SplashScreen.prototype.progressHeight=function(height) {
if (height!=undefined) {
this.i_progress_height=height;
if (this.i_div!=undefined) {
this.i_div_status.style.height=((this.height() - 30) - this.progressHeight())+"px";
this.i_div_progress.style.height=this.progressHeight()+"px";
}
}
return this.i_progress_height;
}
SplashScreen.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_div!=undefined) {
this.i_div.style.width=this.width()+"px";
this.i_div_pad_top.style.width=this.width()+"px";
this.i_div_status.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.i_div_progress.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.i_div_spacer.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.updatePosition();
}
}
return this.i_width;
}
SplashScreen.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_div!=undefined) {
this.i_div.style.height=this.height()+"px";
this.i_div_logo_inner.style.height=(this.height() - 20)+"px";
this.i_div_status.style.height=((this.height() - 30) - this.progressHeight())+"px";
this.updatePosition();
}
}
return this.i_height;
}
SplashScreen.prototype.text=function(text) {
if (text!=undefined) {
this.i_text=text;
if (this.i_div!=undefined) {
this.i_div_logo_text.innerHTML=this.text();
}
}
return this.i_text;
}
SplashScreen.prototype.getWorkspaceMask=function() {
if (this.i_mask_div==undefined) {
this.i_mask_div=document.createElement('DIV');
this.i_mask_div.innerHTML+="&nbsp;";
this.i_mask_div.className="SplashScreen_mask";
}
return this.i_mask_div;
}
SplashScreen.prototype.getSplashScreen=function() {
if (this.i_div==undefined) {
this.i_div=document.createElement('DIV');
this.i_div.style.width=this.width()+"px";
this.i_div.style.height=this.height()+"px";
this.i_div.className="SplashScreen";
this.i_div_pad_top=document.createElement('DIV');
this.i_div_pad_top.innerHTML+="&nbsp;";
this.i_div_pad_top.style.width=this.width()+"px";
this.i_div_pad_top.className="SplashScreen_pad_top";
this.i_div.appendChild(this.i_div_pad_top);
this.i_div_pad_left=document.createElement('DIV');
this.i_div_pad_left.innerHTML+="&nbsp;";
this.i_div_pad_left.className="SplashScreen_pad_left";
this.i_div.appendChild(this.i_div_pad_left);
this.i_div_logo=document.createElement('DIV');
this.i_div_logo.className="SplashScreen_logo";
this.i_div.appendChild(this.i_div_logo);
this.i_div_logo_inner=document.createElement('DIV');
this.i_div_logo_inner.className="SplashScreen_logo_inner";
this.i_div_logo_inner.style.width=this.logoWidth()+"px";
this.i_div_logo_inner.style.height=(this.height() - 20)+"px";
this.i_div_logo.appendChild(this.i_div_logo_inner);
this.i_div_logo_text=document.createElement('DIV');
this.i_div_logo_text.innerHTML=this.text();
this.i_div_logo_inner.appendChild(this.i_div_logo_text);
this.i_div_status=document.createElement('DIV');
this.i_div_status.className="SplashScreen_status";
this.i_div_status.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.i_div_status.style.height=((this.height() - 30) - this.progressHeight())+"px";
if(this.i_visibleMessages==true) {
this.i_div.appendChild(this.i_div_status);
}
this.i_div_status.appendChild(this.i_status.getStatusBox());
if(this.i_visibleMessages==false) {
this.i_div_logo_inner.style.padding="0";
}
this.i_div_spacer=document.createElement('DIV');
this.i_div_spacer.innerHTML+="&nbsp;";
this.i_div_spacer.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.i_div_spacer.className="SplashScreen_spacer";
this.i_div.appendChild(this.i_div_spacer);
this.i_div_progress=document.createElement('DIV');
this.i_div_progress.className="SplashScreen_progress";
this.i_div_progress.style.width=((this.width() - 20) - this.logoWidth())+"px";
this.i_div_progress.style.height=this.progressHeight()+"px";
this.i_div.appendChild(this.i_div_progress);
this.i_div_progress.appendChild(this.i_progress.getProgressBar());
}
return this.i_div;
}
JavaScriptResource.notifyComplete("./lib/components/Component.SplashScreen.js");
JavaScriptResource.notifyComplete("./btsp.js");
