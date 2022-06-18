function SearchBox() {
this.i_engines=Array();
this.i_selected_engine=undefined;
this.i_search_box=undefined;
this.i_menu=undefined;
this.i_input=undefined;
this.i_submit=undefined;
this.i_dummy_text=false;
this.i_visible=false;
SearchBox.obj=this;
}
SearchBox.engines=Array();
SearchBox.addEngine=function(engine) {
SearchBox.engines.push(engine);
if(SearchBox.engines.length==1) {
SearchBox.obj.selectEngine(engine);
SearchBox.obj.show();
}
SearchBox.obj.addEngineOption(engine);
}
SearchBox.prototype.selectEngine=function(engine) {
if(this.i_search_box!=undefined) {
this.i_menu.style.backgroundImage="url("+engine.iconURL()+")";
}
this.i_selected_engine=engine;
this.blurInput();
}
SearchBox.prototype.addEngineOption=function(engine) {
}
SearchBox.prototype.getContent=function() {
if(this.i_search_box==undefined) {
this.i_search_box=document.createElement("div");
this.i_search_box.className="SearchBox";
this.i_menu=document.createElement("div");
this.i_menu.className="SearchBox_menu";
this.i_input=document.createElement("input");
this.i_input.type="text";
this.i_input.size=30;
this.i_input.maxLength=50;
EventListener.listen(this.i_input, "onfocus", new SmartHandler(this, this.focusInput));
EventListener.listen(this.i_input, "onblur", new SmartHandler(this, this.blurInput));
this.i_submit=document.createElement("div");
this.i_submit.className="SearchBox_submit";
EventListener.listen(this.i_submit, "onclick", new SmartHandler(this, this.search));
EventListener.listen(this.i_input, "onkeypress", new SmartHandler(this, this.keyPress));
EventListener.listen(this.i_search_box, "ondblclick", function(e) { e.cancelBubble=true; return false; });
this.i_search_box.appendChild(this.i_menu);
this.i_search_box.appendChild(this.i_input);
this.i_search_box.appendChild(this.i_submit);
}
return this.i_search_box;
}
SearchBox.prototype.getLargeContent=function() {
var search_box=this.getContent();
if(!this.i_visible && SearchBox.engines.length > 0) {
this.show();
}
search_box.className="SearchBox SearchBox_large";
return search_box;
}
SearchBox.prototype.getSmallContent=function() {
var search_box=this.getContent();
if(!this.i_visible && SearchBox.engines.length > 0) {
this.show();
}
search_box.className="SearchBox SearchBox_small";
return search_box;
}
SearchBox.prototype.show=function() {
if(this.i_search_box!=undefined) {
this.i_menu.style.backgroundImage="url("+this.i_selected_engine.iconURL()+")";
this.i_search_box.style.display="block";
this.i_visible=true;
}
}
SearchBox.prototype.blurInput=function() {
if(this.i_input.value=="") {
this.i_input.style.color="#aaa";
this.i_input.value=this.i_selected_engine.blankSearchText();
this.i_dummy_text=true;
}
}
SearchBox.prototype.focusInput=function() {
if(this.i_dummy_text) {
this.i_input.style.color="#000";
this.i_input.value="";
this.i_dummy_text=false;
}
}
SearchBox.prototype.keyPress=function(e) {
var k=(e.keyCode <=0) ? e.which : e.keyCode;
if(k==13) {
this.search();
}
return true;
}
SearchBox.prototype.search=function() {
if(!this.i_dummy_text) {
var input_value=trim(this.i_input.value);
if(input_value.length > 0) {
this.i_selected_engine.search(input_value);
} else {
DialogManager.alert("Please enter a search term.", "Search");
}
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.SearchBox.js");
