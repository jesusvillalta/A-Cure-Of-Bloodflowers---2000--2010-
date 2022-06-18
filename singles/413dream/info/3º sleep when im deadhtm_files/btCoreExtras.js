function Extension() {
return false;	
}
Extension.prototype.superConstructor=function(name) {
if (name==undefined || name=="") {
alert('An extension was created without a name');
this.i_init=true;		
return false;
}
this.i_init=false;	
this.i_enabled=true;	
this.i_name=name;	
this.i_load_count=Array();	
this.i_loaded_files=Array();	
this.i_loading_files=false;
this.i_load_queue=Array();
}
Extension.prototype.name=function() {
return this.i_name;
}
Extension.prototype.isInitialized=function() {
return this.i_init;
}
Extension.prototype.enabled=function(state) {
if (state!=undefined) {
this.i_enabled=state;
}
return this.i_enabled;
}
Extension.prototype.changeInit=function(state) {
if (state!=undefined && this.i_init!=state) {
this.i_init=state;
if (state) {
this.initialize();
}
else {
this.uninitialize();
}
}
return this.i_init;
}
Extension.prototype.getRegistryNode=function() {
if (this.i_reg_node==undefined) {
this.i_reg_node=ApplicationRegistry.getNode(this.name());
if (this.i_reg_node==undefined) {
this.i_reg_node=ApplicationRegistry.addNode(new RegistryNode(this.name()));
}
}
return this.i_reg_node;
}
Extension.prototype.param=function(name, value, noAutoSave, sensitive) {
var n=this.getRegistryNode().getNode(name);
if (n==undefined && value==undefined) {
return undefined;
}
else if (n==undefined && value!=undefined) {
n=this.getRegistryNode().addNode(new RegistryNode(name, value, ApplicationRegistry.REGISTRY_SERVER, (sensitive==true ? ApplicationRegistry.REGISTRY_PRIVATE : undefined)));
}
if (value!=undefined) {
n.singleValue(value);
ApplicationRegistry.save();
}
return n.singleValue();
}
Extension.prototype.secureParam=function(name, value, noAutoSave) {
return this.param(name, value, noAutoSave, false);
}
Extension.prototype.initialize=function() {
alert('Extension does not implement the initialize method.');
}
Extension.prototype.uninitialize=function() {
alert('Extension does not implement the uninitialize method, but attmepted to unregister anyway');
}
Extension.prototype.loadFiles=function(list_name, handler, file_num) {
var ret=false;
var file_list=this.i_files[list_name];
if(this.i_load_count[list_name]==undefined) {
if(this.i_loading_files) {
this.i_load_queue.push(new SmartHandler(this, this.loadFiles,
Array(list_name, handler, undefined), true));
} else {
this.i_loading_files=true;
this.i_load_count[list_name]=file_list.length;
}
} else if(file_num!=undefined) {
this.i_loaded_files[file_list[file_num]]=true;
if(this.i_load_count[list_name] > 0) {
this.i_load_count[list_name]--;
}
}
if(this.i_load_count[list_name] > 0) {
var next_file_num=0;
for(next_file_num=file_list.length - this.i_load_count[list_name]; next_file_num < file_list.length; 
next_file_num++) {
if(this.i_loaded_files[file_list[next_file_num]]) {
this.i_load_count[list_name]--;
} else {
break;
}
}
if(this.i_load_count[list_name] > 0) {
ResourceManager.request(file_list[next_file_num], 1,
new SmartHandler(this, this.loadFiles, 
Array(list_name, handler, next_file_num), true, 
true), undefined);
}
}
if(this.i_load_count[list_name]==0) {
if(file_num!=undefined) {
if(handler!=undefined) {
handler.execute();
}
} else {
ret=true;
}
this.i_loading_files=false;
if(this.i_load_queue.length > 0) {
var next_load=this.i_load_queue[0];
this.i_load_queue.splice(0, 1);
next_load.execute();
}
}
return ret;
}
JavaScriptResource.notifyComplete("./lib/components/Component.Extension.js");
function BasicForm(width) {
this.i_sections=Array();	
this.i_actions=Array();	
this.i_width=width;
this.i_label_padding=100;	
this.i_form_padding=0;	
}
BasicForm.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].width(width - (this.formPadding() * 2));
}
}
return this.i_width;
}
BasicForm.prototype.reset=function() {
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].reset();
}
return true;
}
BasicForm.prototype.formPadding=function(padding) {
if (padding!=undefined) {
this.i_form_padding=padding;
this.width(this.width());
if (this.i_form!=undefined) {
this.i_form.style.padding=this.formPadding()+"px";
}
}
return this.i_form_padding;
}
BasicForm.prototype.labelPadding=function(padding) {
if (padding!=undefined) {
this.i_label_padding=padding;
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].labelPadding(padding);
}
}
return this.i_label_padding;
}
BasicForm.prototype.sections=function(index) {
if (index!=undefined) {
return this.i_sections[index];
}
return this.i_sections;
}
BasicForm.prototype.addSection=function(section) {
this.i_sections[this.i_sections.length]=section;
section.labelPadding(this.labelPadding());
section.width(this.width() - (this.formPadding() * 2));
if (this.i_form!=undefined) {
this.i_form.appendChild(section.getSection());
}
return section;
}
BasicForm.prototype.removeSection=function(section) {
for (var x=0; x < this.i_sections.length; x++) {
if (this.i_sections[x]==section) {
this.i_sections.splice(x, 1);
if (this.i_form!=undefined) {
this.i_form.removeChild(section.getSection());
}
return true;
}
}
return false;
}
BasicForm.prototype.actions=function(index) {
if (index!=undefined) {
return this.i_actions[index];
}
return this.i_actions;
}
BasicForm.prototype.addAction=function(action) {
this.i_actions[this.i_actions.length]=action;
if (this.i_form_actions!=undefined) {
this.i_form_actions.appendChild(action.getAction());
}
return action;
}
BasicForm.prototype.removeAction=function(action) {
for (var x=0; x < this.i_actions.length; x++) {
if (this.i_actions[x]==action) {
this.i_actions.splice(x, 1);
if (this.i_form_actions!=undefined) {
this.i_form_actions.removeChild(action.getAction());
}
return true;
}
}
return false;
}
BasicForm.prototype.getForm=function() {
if (this.i_form==undefined) {
this.i_form=document.createElement('DIV');
this.i_form.className="BasicForm";
this.i_form.style.padding=this.formPadding()+"px";
for (var x=0; x < this.i_sections.length; x++) {
this.i_form.appendChild(this.i_sections[x].getSection());
}
this.i_form_actions=document.createElement('DIV');
this.i_form_actions.className="BasicForm_actions";
for (var x=0; x < this.i_actions.length; x++) {
this.i_form_actions.appendChild(this.i_actions[x].getAction());
}
this.i_form.appendChild(this.i_form_actions);
}
return this.i_form;
}
function BasicFormAction(name, callback, enabled) {
this.i_name=name;
this.i_callback=callback;
this.i_enabled=(enabled!=undefined ? enabled : true);
}
BasicFormAction.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
BasicFormAction.prototype.enabled=function(state) {
if (state!=undefiend) {
this.i_enabled=state;
}
return this.i_enabled;
}
BasicFormAction.prototype.callback=function(callback) {
if (callback!=undefined) {
this.i_callback=callback;
}
return this.i_callback;
}
BasicFormAction.handleExecute=function() {
var me=this.pObj;
if (me.callback()!=undefined) {
var g=me.callback();
g(me);
}
}
BasicFormAction.prototype.getAction=function() {
if (this.i_action==undefined) {
this.i_action=document.createElement('BUTTON');
this.i_action.className="BasicFormAction";
this.i_action.innerHTML=this.name();
this.i_action.pObj=this;
this.i_action.onclick=BasicFormAction.handleExecute;
}
return this.i_action;
}	
function BasicFormSection(name, description) {
this.i_name=name;
this.i_description=description;
this.i_width=100;		
this.i_label_padding=50;	
this.i_inputs=Array();
}
BasicFormSection.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_section_name!=undefined) {
this.i_section_name.innerHTML=name;
}
}
return this.i_name;
}
BasicFormSection.prototype.reset=function() {
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].reset();
}
return true;
}
BasicFormSection.prototype.labelPadding=function(padding) {
if (padding!=undefined) {
this.i_label_padding=padding;
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].labelPadding(labelPadding);
}
}
return this.i_label_padding;
}
BasicFormSection.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].width(width);
}
}
return this.i_width;
}
BasicFormSection.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
if (this.i_section_description!=undefined) {
this.i_section_description.innerHTML=description;
this.i_section_description.style.display=(description=="" ? "none" : "");
}
}
return this.i_description;
}
BasicFormSection.prototype.inputs=function(index) {
if (index!=undefined) {
return this.i_inputs[index];
}
return this.i_inputs;
}
BasicFormSection.prototype.addInput=function(input) {
this.i_inputs[this.i_inputs.length]=input;
input.labelPadding(this.labelPadding());
input.width(this.width());
if (this.i_section_inputs!=undefined) {
this.i_section_inputs.appendChild(input.getInput());
}
return input;
}
BasicFormSection.prototype.removeInput=function(input) {
for (var x=0; x < this.i_inputs.length; x++) {
if (this.i_inputs[x]==input) {
this.i_inputs.splice(x, 1);
if (this.i_section_inputs!=undefined) {
this.i_section_inputs.removeChild(input.getInput());
}
return true;
}
}
return false;
}
BasicFormSection.prototype.getSection=function() {
if (this.i_section==undefined) {
this.i_section=document.createElement('DIV');
this.i_section.className="BasicFormSection";
this.i_section_name=document.createElement('DIV');
this.i_section_name.className="BasicFormSection_name";
this.i_section_name.innerHTML=this.name();
this.i_section.appendChild(this.i_section_name);
this.i_section_description=document.createElement('DIV');
this.i_section_description.className="BasicFormSection_description";
this.i_section_description.innerHTML=this.description();
this.i_section_description.style.display=((this.description()=="" || this.description()==undefined) ? "none" : "");
this.i_section.appendChild(this.i_section_description);
this.i_section_inputs=document.createElement('DIV');
this.i_section_inputs.className="BasicFormSection_inputs";
for (var x=0; x < this.i_inputs.length; x++) {
this.i_section_inputs.appendChild(this.i_inputs[x].getInput());
}
this.i_section.appendChild(this.i_section_inputs);
}
return this.i_section;
}
function BasicFormInput() {
}
BasicFormInput.prototype.superConstructor=function(name, description) {
this.i_name=name;
this.i_label_padding=100;	
}
BasicFormInput.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_input_name!=undefined) {
this.i_input_name.innerHTML=name;
}
}
return this.i_name;
}
BasicFormInput.prototype.labelPadding=function(padding) {
if (padding!=undefined) {
this.i_label_padding=padding;
this.width(this.width());
}
return this.i_label_padding;
}
BasicFormInput.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
if (this.i_input_description!=undefined) {
this.i_input_description.innerHTML=this.description();
this.i_input_description.style.display=(description=="" ? "none" : "");
}
}
return this.i_description;
}
BasicFormInput.prototype.reset=function() {
}
function BasicInputSelect(name, description, optionBox) {
this.superConstructor(name, description);
this.i_options=optionBox;
this.i_defaults=Array();
for (var x=0; x < this.i_options.options().length; x++) {
if (this.i_options.options()[x].selected()) {
this.i_defaults[this.i_options.options()[x].name()]=true;	
}
}
}
BasicInputSelect.prototype.reset=function() {
for (var x=0; x < this.i_options.options().length; x++) {
var op=this.i_options.options()[x];
if (op.selected()!=(this.i_defaults[op.name()] ? true : false)) {
op.selected((this.i_defaults[op.name()] ? true : false));
}
}
return true;
}
BasicInputSelect.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
this.i_options.width((this.width() - this.labelPadding()) - 3);
if (this.i_input!=undefined) {
this.i_input_description.style.width=(this.width() - this.labelPadding())+"px";
this.i_input_box.style.width=(this.width() - this.labelPadding())+"px";
this.i_input.style.width=this.width()+"px";
}
}
return this.i_width;
}
BasicInputSelect.prototype.value=function(value) {
if (value!=undefined) {
this.i_options.setValue(t);
}
return this.i_options.value();
}
BasicInputSelect.prototype.getInput=function() {
if (this.i_input==undefined) {
this.i_input=document.createElement('DIV');
this.i_input.style.clasName="BasicInputSelect";
this.i_input.style.width=this.width()+"px";
this.i_input_box=document.createElement('DIV');
this.i_input_box.className="BasicInputSelect_box";
this.i_input_box.style.width=(this.width() - this.labelPadding())+"px";
this.i_input.appendChild(this.i_input_box);
this.i_input_box.appendChild(this.i_options.getInput());
this.i_input_description=document.createElement('DIV');
this.i_input_description.className="BasicInputSelect_description";
this.i_input_description.style.width=(this.width() - this.labelPadding())+"px";
this.i_input_description.innerHTML=this.description();
this.i_input_description.style.display=((this.description()=="" || this.description()==undefined) ? "none" : "");
this.i_input_box.appendChild(this.i_input_description);
this.i_input_name=document.createElement('SPAN');
this.i_input_name.className="BasicInputSelect_name";
this.i_input_name.innerHTML=this.name();
this.i_input.appendChild(this.i_input_name);
this.i_input_clear=document.createElement('DIV');
this.i_input_clear.className="BasicInputSelect_clear";
this.i_input.appendChild(this.i_input_clear);
}
return this.i_input;
}
inherit(BasicFormInput, BasicInputSelect);
function BasicInputText(name, value, description, masked) {
this.superConstructor(name);
this.i_default=value;
this.i_description=description;
this.i_masked=(masked!=undefined ? masked : false);
this.i_width=100;	
}
BasicInputText.labelPadding=150;
BasicInputText.prototype.defaultValue=function(value) {
if (value!=undefined) {
this.i_default=value;
}
return this.i_default;
}	
BasicInputText.prototype.value=function(value) {
if (value!=undefined) {
this.getInput();
this.i_input_field.value=value;
}
return (this.i_input_field!=undefined ? this.i_input_field.value : this.defaultValue());
}
BasicInputText.prototype.masked=function(state) {
if (state!=undefined) {
this.i_masked=state;
if (this.i_input_field!=undefined) {
this.i_input_field.type=(this.masked() ? "password" : "text");
}
}
return this.i_masked;
}
BasicInputText.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_input!=undefined) {
this.i_input_description.style.width=(this.width() - this.labelPadding())+"px";
this.i_input_field.style.width=(this.width() - this.labelPadding())+"px";
this.i_input_box.style.width=(this.width() - this.labelPadding())+"px";
this.i_input.style.width=this.width()+"px";
}
}
return this.i_width;
}
BasicInputText.prototype.reset=function() {
if (this.i_input_field!=undefined) {
this.i_input_field.value=this.defaultValue();
}
return true;
}
BasicInputText.prototype.getInput=function() {
if (this.i_input==undefined) {
this.i_input=document.createElement('DIV');
this.i_input.style.clasName="BasicInputText";
this.i_input.style.width=this.width()+"px";
this.i_input_box=document.createElement('DIV');
this.i_input_box.className="BasicInputText_box";
this.i_input_box.style.width=(this.width() - this.labelPadding())+"px";
this.i_input.appendChild(this.i_input_box);
this.i_input_field=document.createElement('INPUT');
this.i_input_field.type=(this.masked() ? "password" : "text");
this.i_input_field.className="BasicInputText_input";
this.i_input_field.value=this.defaultValue();
this.i_input_field.style.width=(this.width() - this.labelPadding())+"px";
this.i_input_box.appendChild(this.i_input_field);
this.i_input_description=document.createElement('DIV');
this.i_input_description.className="BasicInputText_description";
this.i_input_description.style.width=(this.width() - this.labelPadding())+"px";
this.i_input_description.innerHTML=this.description();
this.i_input_description.style.display=((this.description()=="" || this.description()==undefined) ? "none" : "");
this.i_input_box.appendChild(this.i_input_description);
this.i_input_name=document.createElement('SPAN');
this.i_input_name.className="BasicInputText_name";
this.i_input_name.innerHTML=this.name();
this.i_input.appendChild(this.i_input_name);
this.i_input_clear=document.createElement('DIV');
this.i_input_clear.className="BasicInputText_clear";
this.i_input.appendChild(this.i_input_clear);
}
return this.i_input;
}
inherit(BasicFormInput, BasicInputText);
JavaScriptResource.notifyComplete("./lib/components/Component.BasicForm.js");
function TabBar() {
this.i_content=undefined;
this.i_list=undefined;
this.i_tabs=Array();
}
TabBar.prototype.getDiv=function() {
if(this.i_content==undefined) {
this.i_content=document.createElement("DIV");
this.i_content.className="TabBarTop";
this.i_list=document.createElement("UL");
for(var x=0; x < this.i_tabs.length; x++) {
this.i_list.appendChild(this.i_tabs[x].getContent());
}
this.i_content.appendChild(this.i_list);
}
return this.i_content;
}
TabBar.prototype.addTab=function(text, handler, name, selected) {
var real_handler=undefined;
if(handler!=undefined) {
if(typeof(handler)=="function") {
real_handler=new SmartHandler(undefined, handler);
} else if(handler.length==2) {
real_handler=new SmartHandler(handler[0], 
handler[0][handler[1]]);
} else {
real_handler=handler;
}
}
this.i_tabs.push(new TabBarTab(this, name, text, real_handler, 
selected));
if(this.i_content!=undefined) {
this.i_list.appendChild(this.i_tabs[this.i_tabs.length - 1].getContent());
}
}
TabBar.prototype.getTab=function(name) {
var ret=undefined;
for(var x=0; x < this.i_tabs.length; x++) {
var tab=this.i_tabs[x];
if(tab.getName()==name) {
ret=tab;
break;
}
}
return ret;
}
TabBar.prototype.activate=function(name) {
this.selectTab(name);
}
TabBar.prototype.selectTab=function(name) {
for(var x=0; x < this.i_tabs.length; x++) {
var tab=this.i_tabs[x];
if(tab.getName()==name) {
tab.select();
} else {
tab.unselect();
}
}
}
TabBar.prototype.unselectTab=function(name) {
var tab=this.getTab(name);
if(tab!=undefined) {
tab.unselect();
}
}
TabBar.prototype.disableTab=function(name) {
var tab=this.getTab(name);
if(tab!=undefined) {
tab.disable();
}
}
TabBar.prototype.enableTab=function(name) {
var tab=this.getTab(name);
if(tab!=undefined) {
tab.enable();
}
}
TabBar.prototype.showTab=function(name) {
var tab=this.getTab(name);
if(tab!=undefined) {
tab.show();
}
}
TabBar.prototype.hideTab=function(name) {
var tab=this.getTab(name);
if(tab!=undefined) {
tab.hide();
}
}
function TabBarTab(parent, name, text, handler, selected) {
this.i_parent=parent;
this.i_name=name;
this.i_text=text;
this.i_selected=(selected!=undefined ? selected : false);
this.i_disabled=false;
this.i_hidden=false;
this.i_handler=handler;
this.i_handler_id=undefined;
this.i_content=undefined;
this.i_link=undefined;
}
TabBarTab.prototype.getContent=function() {
if(this.i_content==undefined) {
this.i_content=document.createElement("LI");
this.i_link=document.createElement("LABEL");
this.i_link.innerHTML=this.i_text;
this.i_content.appendChild(this.i_link);
this.resetContent();
}
return this.i_content;
}
TabBarTab.prototype.resetContent=function() {
if(this.i_content!=undefined) {
var classes=Array();
if(this.i_selected && !this.i_disabled) {
classes.push("current");
}
if(this.i_disabled) {
classes.push("disabled");
}
if(this.i_hidden) {
classes.push("hidden");
}
this.i_content.className=classes.join(" ");
if(!this.i_disabled && !this.i_hidden) {
if(this.i_handler_id==undefined) {
this.i_handler_id=EventListener.listen(this.i_link, 
"onclick", new SmartHandler(this.i_parent, 
this.i_parent.selectTab, this.i_name, false, true));
}
} else {
EventListener.silence(this.i_link, "onclick", this.i_handler_id);
this.i_handler_id=undefined;
}
}
}
TabBarTab.prototype.getName=function() {
return this.i_name;
}
TabBarTab.prototype.select=function() {
this.i_selected=true;
this.resetContent();
if(this.i_handler!=undefined) {
this.i_handler.execute(this.i_name);
}
}
TabBarTab.prototype.unselect=function() {
this.i_selected=false;
this.resetContent();
}
TabBarTab.prototype.enable=function() {
this.i_disabled=false;
this.resetContent();
}
TabBarTab.prototype.disable=function() {
this.i_disabled=true;
this.resetContent();
}
TabBarTab.prototype.show=function() {
this.i_hidden=false;
this.resetContent();
}
TabBarTab.prototype.hide=function() {
this.i_hidden=true;
this.resetContent();
}
JavaScriptResource.notifyComplete("./lib/components/Component.TabBar.js");
PopoutWindow.registerGroup("AccordionPane", ["AccordionPane",
"AccordionBar"]);
function AccordionPane(width, height) {
this.i_width=width;
this.i_height=height;
this.i_contentHeight=0;
this.i_bars=Array();
}
AccordionPane.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.activeBar()!=undefined) {
for (var x=0; x < this.i_bars.length; x++) {
this.i_bars[x].width(width);
}
if (this.activeBar().onresize!=undefined) {
var o=new Object();
o.type="resize";
this.activeBar().onresize(o);
}
if (this.i_pane!=undefined) {
this.i_pane.style.width=width+"px";
}
if (this.i_default_content!=undefined) {
this.i_default_content.style.width=this.width()+"px";
}
}
}
return this.i_width;
}	
AccordionPane.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_pane!=undefined) {
this.i_pane.style.height=height+"px";
}
this.updateContentHeight();
}
return this.i_height;
}
AccordionPane.prototype.bars=function(index) {
if (index!=undefined) {
return this.i_bars[index];
}
return this.i_bars;
}
AccordionPane.prototype.addBar=function(bar, beforeBar) {
var append=true;
bar.i_parent=this;
if (beforeBar!=undefined) {
for (var x=0; x < this.i_bars.length; x++) {
if (this.i_bars[x]==beforeBar) {
this.i_bars.splice(x, 0, bar);
if (this.i_pane!=undefined) {
this.i_pane.insertBefore(bar.getBar(), beforeBar.getBar());
}
append=false;
break;
}
}
}
if (append) {
this.i_bars[this.i_bars.length]=bar;
if (this.i_pane!=undefined) {
this.i_pane.appendChild(bar.getBar());
}
}
if (this.i_pane!=undefined && bar.active()) {
for (var x=0; x < this.i_bars.length; x++) {
if (this.i_bars[x].active() && this.i_bars[x]!=bar) {
try {
this.i_pane.removeChild(this.i_bars[x].contentPane());
} catch (e) { }
this.i_bars[x].active(false);
}
}
this.i_pane.insertBefore(bar.contentPane(), this.i_bars[0].getBar());
}
if (bar.active()) {
this.i_active=bar;
}
bar.width(this.width());
this.updateContentHeight();
return bar;
}
AccordionPane.prototype.removeBar=function(bar) {
for (var x=0; x < this.i_bars.length; x++) {
if (this.i_bars[x]==bar) {
this.i_bars.splice(x, 1);
if (this.i_pane!=undefined) {
this.i_pane.removeChild(bar.getBar());
if (bar.active()) {
this.i_pane.removeChild(bar.contentPane());
if (this.i_bars.length > 0) {
this.i_pane.insertBefore(this.defaultContentPane(), this.i_bars[0].getBar());
}
else {
this.i_pane.appendChild(this.defaultContentPane());
}
this.i_active=undefined;
}
}
bar.i_parent=undefined;
this.updateContentHeight();
return true;
}
}
return false;
}
AccordionPane.prototype.activateBar=function(bar) {
if (this.i_pane!=undefined && bar.active()) {
for (var x=0; x < this.i_bars.length; x++) {
if (this.i_bars[x].active() && this.i_bars[x]!=bar) {
try {
this.i_pane.removeChild(this.i_bars[x].contentPane());
} catch (e) { }
this.i_bars[x].active(false);
if (this.i_bars[x].onblur!=undefined) {
var o=new Object();
o.type="blur";
this.i_bars[x].onblur(o);
}
}
}
this.i_pane.insertBefore(bar.contentPane(), this.i_bars[0].getBar());
if (bar.onfocus!=undefined) {
var o=new Object();
o.type="focus";
o.bar=bar;
bar.onfocus(o);
}
bar.updateHeight();
}
this.i_active=bar;
}
AccordionPane.prototype.defaultContentPane=function() {
if (this.i_default_content==undefined) {
this.i_default_content=document.createElement('DIV');
this.i_default_content.style.width=this.width()+"px";
this.i_default_content.style.height=this.contentHeight()+"px";
}
return this.i_default_content;
}
AccordionPane.prototype.contentHeight=function(height) {
if (height!=undefined) {
this.i_contentHeight=height;
if (this.activeBar()!=undefined) {
if (this.activeBar().onresize!=undefined) {
var o=new Object();
o.type="resize";
this.activeBar().onresize(o);
}
this.activeBar().updateHeight();
if (this.i_default_content!=undefined) {
this.i_default_content.style.height=this.contentHeight()+"px";
}
}
}
return this.i_contentHeight;
}
AccordionPane.prototype.activeBar=function() {
return this.i_active;
}
AccordionPane.prototype.updateContentHeight=function() {
var h=this.height();
for (var x=0; x < this.i_bars.length; x++) {
h-=this.i_bars[x].height();
}
this.contentHeight(h);
}
AccordionPane.prototype.getPane=function() {
if (this.i_pane==undefined) {
this.i_pane=document.createElement('DIV');
this.i_pane.className="AccordionPane";
this.i_pane.style.width=this.width()+"px";
this.i_pane.style.height=this.height()+"px";
var act;
for (var x=0; x < this.i_bars.length; x++) {
this.i_pane.appendChild(this.i_bars[x].getBar());
if (this.i_bars[x].active()) {
act=this.i_bars[x];
}
}
if (act!=undefined) {
this.i_pane.insertBefore(act.contentPane(), this.i_bars[0].getBar());
}
else {
if (this.i_bars.length > 0) {
this.i_pane.insertBefore(this.defaultContentPane(), this.i_bars[0].getBar());
}
else {
this.i_pane.appendChild(this.defaultContentPane());
}
}
if (this.activeBar()!=undefined) {
if (this.activeBar().onfocus!=undefined) {
var o=new Object();
o.type="focus";
this.activeBar().onfocus(o);
}
}
this.updateContentHeight();
}
return this.i_pane;
}
function AccordionBar(name, active) {
this.i_name=name;
this.i_active=(active!=undefined ? active : false);
this.i_width=10;
}
AccordionBar.prototype.onfocus=null;
AccordionBar.prototype.onblur=null;
AccordionBar.prototype.onresize=null;
AccordionBar.barHeight=20;
AccordionBar.prototype.parent=function() {
return this.i_parent;
}
AccordionBar.prototype.height=function() {
return AccordionBar.barHeight;
}
AccordionBar.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_bar!=undefined) {
this.i_bar.style.width=width+"px";
}
}
return this.i_width;
}
AccordionBar.prototype.active=function(state) {
if (state!=undefined) {
this.i_active=state;
if (this.parent()!=undefined) {
this.parent().activateBar(this);
}
if (this.i_bar!=undefined) {
this.i_bar.className="AccordionBar "+(this.active() ? " AccordionBar_active" : "");
}
}
return this.i_active;
}
AccordionBar.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_bar!=undefined) {
this.i_bar.innerHTML=name;
}
}
return this.i_name;
}
AccordionBar.prototype.contentPane=function() {
if (this.i_content==undefined) {
this.i_content=document.createElement('DIV');
}
return this.i_content;
}
AccordionBar.prototype.updateHeight=function() {
if (this.i_content!=undefined && this.parent().contentHeight() > 0) {
this.i_content.style.width=this.width()+"px";
this.i_content.style.height=this.parent().contentHeight()+"px";
}
}	
AccordionBar.handleMouseDown=function(e) {
this.active(true);
this.parent().activeBar(this);
}
AccordionBar.prototype.getBar=function() {
if (this.i_bar==undefined) {
this.i_bar=document.createElement('DIV');
this.i_bar.className="AccordionBar "+(this.active() ? " AccordionBar_active" : "");
this.i_bar.style.height=this.height()+"px";
this.i_bar.style.width=this.width()+"px";
this.i_bar.style.lineHeight=this.height()+"px";
EventHandler.register(this.i_bar, "onmousedown", AccordionBar.handleMouseDown, this);
this.i_bar.innerHTML=this.name();
}
return this.i_bar;
}
JavaScriptResource.notifyComplete("./lib/components/Component.AccordionPane.js");	
function ExternalWindow(width, height, url, initLocked) {
this.i_name="External Window";
this.i_url=url;
this.i_locked=initLocked;
this.i_id=ExternalWindow.idCounter++;
this.i_width=(width!=undefined ? width : 600);
this.i_height=(height!=undefined ? height : 400);
}
ExternalWindow.idCounter=0;
ExternalWindow.prototype.getToolbar=function() {
if (this.i_tool_bar==undefined) {
this.i_tool_bar=new ToolBar(200);
this.i_address_box=new IconField("IconField_icon_url", 3, 16, 177, 18, (this.i_url!=undefined ? this.i_url : "http://"));
this.i_address_box.i_parent_ew=this;
this.i_tool_bar.addItem(new ToolBarIconField(this.i_address_box));
var a=new LabelButton("Preview", 65, 18, "Preview", ExternalWindow.handlePreview, this);
this.i_tool_bar.addItem(new ToolBarButton(a));
var b=new LabelButton("Done", 45, 18, "Done", ExternalWindow.handleFinish, this);
this.i_tool_bar.addItem(new ToolBarButton(b));
}
return this.i_tool_bar; 
}
ExternalWindow.handleFinish=function(button, foc) {
foc.i_tool_bar.getBar().style.display="none";
foc.i_tool_bar_visible=false;
foc.i_content.style.height=(foc.i_window.effectiveHeight() - (foc.i_tool_bar_visible==false ? 0 :  foc.getToolbar().height()) - foc.i_window.titleBar().height() - 2)+"px";
}
ExternalWindow.handlePreview=function(button, foc) {
foc.i_content.src=foc.i_address_box.value();
}
ExternalWindow.handleResize=function(e) {
this.i_parent_ew.getToolbar().width(this.i_parent_ew.i_window.effectiveWidth() - 2);
this.i_parent_ew.i_content.style.width=(this.i_parent_ew.i_window.effectiveWidth() - 2)+"px";
var h=(this.i_parent_ew.i_window.effectiveHeight() - (this.i_parent_ew.i_tool_bar_visible==false ? 0 : this.i_parent_ew.getToolbar().height()) - this.i_parent_ew.i_window.titleBar().height() - 2);
this.i_parent_ew.i_content.style.height=(h > 0 ? h : 1)+"px";
}
ExternalWindow.handleDock=function(docked) {
if(!docked && document.all) {
var iframe=this.i_parent_ew.i_content;
iframe.src=iframe.src;
}
}
ExternalWindow.prototype.getWindow=function() {
if (this.i_window==undefined) {
this.i_window=new WindowObject("external_"+this.i_id, this.i_name, this.i_width, this.i_height, Application.titleBarFactory());
this.i_window.i_parent_ew=this;
this.i_window.i_redock_manager=SystemCore.windowManager();
this.i_window.onresize=ExternalWindow.handleResize;
this.i_window.ondock=ExternalWindow.handleDock;
var windowContent=document.createElement('DIV');
windowContent.appendChild(this.getToolbar().getBar());
if (this.i_locked==true) {
this.i_tool_bar.getBar().style.display="none";
this.i_tool_bar_visible=false;				
}
this.i_content=document.createElement('IFRAME');
this.i_content.frameBorder=0;
this.i_content.border=0;
this.i_content.src=this.i_url;
windowContent.appendChild(this.i_content);
this.i_window.loadContent(windowContent);
}
return this.i_window;
}
ExternalWindow.prototype.show=function() {
this.getWindow().popWindow(this.i_width, this.i_height, true);
}
ExternalWindow.prototype.name=function(name){
if(name!=undefined){
this.i_name=name;
if(this.i_window!=undefined){
this.getWindow().name(name);
}
}
return this.i_name;
}
JavaScriptResource.notifyComplete("./lib/components/Component.ExternalWindow.js");
function SearchSettings() {
this.i_highlight_search_enabled=undefined;
this.i_default_engine=undefined;
}
SearchSettings.prototype.isHighlightSearchEnabled=function() {
return this.i_highlight_search_enabled;
}
SearchSettings.prototype.setHighlightSearchEnabled=function(highlight_search_enabled) {
this.i_highlight_search_enabled=highlight_search_enabled;
}
SearchSettings.prototype.readFromJSON=function(data) {
this.i_highlight_search_enabled=data["hs"];
}
SearchSettings.prototype.toJSON=function() {
var json="{"+'"hs":'+this.i_highlight_search_enabled+"}";
return json;
}
SearchSettings.prototype.save=function(handler) {
SearchSettings.store.saveSettings(this, handler);
}
SearchSettings.getDefaults=function() {
var settings=new SearchSettings();
settings.setHighlightSearchEnabled(true);
return settings;
}
SearchSettings.store=Array();
SearchSettings.store.settings=undefined;
SearchSettings.store.getSettings=function() {
var settings=SearchSettings.store.settings;
if(settings==undefined) {
var reg_data=SearchSettings.store.getRegistryNode().singleValue();
if(reg_data!=undefined) {
try {
settings=new SearchSettings();
var data=eval("("+reg_data+")");
settings.readFromJSON(data);
} catch(e) {
settings=SearchSettings.getDefaults();
}
} else {
settings=SearchSettings.getDefaults();
}
}
return settings;
}
SearchSettings.store.saveSettings=function(settings, handler) {
if(settings!=undefined) {
SearchSettings.store.getRegistryNode().singleValue(settings.toJSON());
ApplicationRegistry.save();
SearchSettings.store.settings=settings;
if (SearchSettings.store.onchange!=undefined) {
var search_value=(settings.isHighlightSearchEnabled()==true ? "1" : "0");
SearchSettings.store.onchange({type:"change",value:search_value});
}
}
if(handler!=undefined) {
handler.execute();
}
}
SearchSettings.store.getRegistryNode=function() {
var node_name="Search";
var node=ApplicationRegistry.getNode(node_name);
if(node==undefined) {
node=ApplicationRegistry.addNode(new RegistryNode(node_name));
}
return node;
}
JavaScriptResource.notifyComplete("./lib/components/Component.SearchSettings.js");
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
function SearchEngine() {
this.i_name=undefined;
this.i_icon_url=undefined;
}
SearchEngine.prototype.search=function(query) {
}
SearchEngine.prototype.iconURL=function() {
return this.i_icon_url;
}
SearchEngine.prototype.blankSearchText=function() {
return "Search "+this.i_name;
}
JavaScriptResource.notifyComplete("./lib/components/Component.SearchEngine.js");
function TypeaheadInput(width) {
this.superConstructor(width);
}
TypeaheadInput.prototype.superConstructor=function(width) {
this.i_width=width;
this.i_enabled=true;
this.i_listener_id=undefined;
this.i_input_value="";
this.i_options_visible=false;
this.i_listeners=Array();
this.i_input_length=undefined;
this.i_content=undefined;
this.i_input=undefined;
this.i_options=undefined;
this.i_dropdown=undefined;
this.i_error_div=undefined;
}
TypeaheadInput.prototype.getContent=function() {
if(this.i_content==undefined) {
this.i_content=document.createElement("DIV");
this.i_content.className="TypeaheadInput";
this.i_input=document.createElement("INPUT");
this.i_input.value=this.i_input_value;
if(this.i_enabled) {
this.enable();
} else {
this.disable();
}
if(this.i_input_length!=undefined) {
this.i_input.maxLength=this.i_input_length;
}
this.i_options=new OptionBox(100);
var options_div=this.i_options.getOptionDiv();
options_div.className+=" TypeaheadInput_options";
EventListener.listen(options_div, "onclick", new SmartHandler(this, this.handleClick));
this.i_dropdown=document.createElement("DIV");
this.i_dropdown.className="TypeaheadInput_dropdown";
this.i_dropdown.style.display="none";
this.i_dropdown.appendChild(options_div);
this.i_error_div=document.createElement("DIV");
this.i_error_div.className="TypeaheadInput_error";
this.i_error_div.style.display="none";
options_div.appendChild(this.i_error_div);
this.i_content.appendChild(this.i_input);
this.i_content.appendChild(this.i_dropdown);
this.setWidth(this.i_width);
this.setHeight(this.i_height);
}
return this.i_content;
}
TypeaheadInput.prototype.getInputValue=function() {
return this.i_input_value;
}
TypeaheadInput.prototype.setInputValue=function(value) {
this.i_input_value=value;
if(this.i_content!=undefined) {
this.i_input.value=value;
}
}
TypeaheadInput.prototype.setInputLength=function(max_length) {
this.i_input_length=max_length;
if(this.i_content!=undefined) {
this.i_input.maxLength=max_length;
}
}
TypeaheadInput.prototype.setWidth=function(width) {
this.i_width=width;
if(this.i_content!=undefined) {
if(this.i_width!=undefined) {
if(isNaN(this.i_width)) {
this.i_content.style.width=this.i_width;
} else {
this.i_content.style.width=this.i_width+"px";
}
this.fixDropdownSize();
}
}
}
TypeaheadInput.prototype.setHeight=function(height) {
this.i_height=height;
if(this.i_content!=undefined) {
if(this.i_height!=undefined) {
if(isNaN(this.i_height)) {
this.i_content.style.height=this.i_height;
this.i_input.style.height=this.i_height;
} else {
this.i_content.style.height=this.i_height+"px";
this.i_input.style.height=this.i_height+"px";
}
}
}
}
TypeaheadInput.prototype.getWidth=function() {
return this.i_width;
}
TypeaheadInput.prototype.enable=function() {
this.i_enabled=true;
if(this.i_content!=undefined) {
this.i_listener_id=EventListener.listen(this.i_input, "onkeyup",
new SmartHandler(this, this.handleKeypress));
this.i_input.className="TypeaheadInput_input_enabled";
this.i_input.readOnly=false;
}
}
TypeaheadInput.prototype.disable=function() {
this.i_enabled=false;
if(this.i_content!=undefined) {
EventListener.silence(this.i_input, "onkeyup", this.i_listener_id);
this.i_input.className="TypeaheadInput_input_disabled";
this.i_input.readOnly=true;
}
}
TypeaheadInput.prototype.addListener=function(handler) {
this.i_listeners.push(handler);
return this.i_listeners.length - 1;
}
TypeaheadInput.prototype.removeListener=function(id) {
this.i_listeners[id]=undefined;
}
TypeaheadInput.prototype.clear=function() {
this.i_input_value="";
this.i_input.value="";
this.hideDropdown();
}
TypeaheadInput.prototype.clearOptions=function() {
this.i_options.removeOptions();
}
TypeaheadInput.prototype.addOption=function(option) {
this.i_options.addOption(option);
}
TypeaheadInput.prototype.showError=function(message) {
this.clearOptions();
this.i_error_div.innerHTML=message;
this.i_error_div.style.display="";
this.showDropdown();
}
TypeaheadInput.prototype.hideError=function() {
this.i_error_div.style.display="none";
}
TypeaheadInput.prototype.showDropdown=function() {
this.fixDropdownSize();
this.i_dropdown.style.display="";
this.i_options.getOptionDiv().scrollTop=0;
this.i_options_visible=true;
}
TypeaheadInput.prototype.fixDropdownSize=function() {
var width=(isFinite(this.i_width)) ? this.i_width : this.i_content.offsetWidth;
var dropdown_width=width;
if(!document.all) {
dropdown_width -=2;
if(dropdown_width < 0) {
dropdown_width=0;
}
}
this.i_input.style.width=width+"px";
this.i_options.width(dropdown_width);
this.i_dropdown.style.width=dropdown_width+"px";
}
TypeaheadInput.prototype.hideDropdown=function() {
this.fixDropdownSize();
this.i_dropdown.style.display="none";
this.i_error_div.style.display="none";
this.i_options_visible=false;
}
TypeaheadInput.prototype.handleKeypress=function(event) {
var key=event.keyCode;
var value_changed=false;
if(key==27) {
this.i_input.value=this.i_input_value;
} else if(this.i_input_value!=this.i_input.value) {
value_changed=true;
this.i_input_value=this.i_input.value;
}
if(key==27) { 
this.hideDropdown();
} else if(this.i_options_visible && (key==40 || key==38 ||
key==34 || key==33)) {
this.i_options.keySelect(event);
} else if(key==13) {
if(this.i_options_visible) {
this.hideDropdown();
this.select(this.i_options.value());
this.fireListeners();
} else {
this.resolve();
this.fireListeners();
}
} else if(value_changed) {
this.resolve();
this.fireListeners();
}
return true;
}
TypeaheadInput.prototype.handleClick=function() {
this.hideDropdown();
this.select(this.i_options.value());
this.fireListeners();
}
TypeaheadInput.prototype.fireListeners=function() {
for(var x=0; x < this.i_listeners.length; x++) {
if(this.i_listeners[x]!=undefined) {
this.i_listeners[x].execute();
}
}
}
TypeaheadInput.prototype.select=function(value) {
}
TypeaheadInput.prototype.resolve=function() {
}
JavaScriptResource.notifyComplete("./lib/components/Component.TypeaheadInput.js");
JavaScriptResource.notifyComplete("./btCoreExtras.js");
