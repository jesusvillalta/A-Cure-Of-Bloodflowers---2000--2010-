function MessageFilter(element) {
this.i_ID="new";
this.i_type=3;
this.i_name="";
this.i_priority=0;
this.i_matchType="exact";
this.i_matchValue="";
this.i_actionType=3;
this.i_actionDisplay="";
if (element) {
this.readElement(element);
}
}
MessageFilter.prototype.readElement=function(element) {
this.i_ID=element.attribute("id");
this.i_type=element.attribute("filterType");
this.i_name=element.attribute("name");
this.i_priority=element.attribute("priority");
var filterData=element.xPath("filterData")[0];
this.i_matchType=filterData.attribute("matchType");
this.i_matchValue=filterData.value();
var filterAction=element.xPath("filterAction")[0];
this.i_actionType=filterAction.attribute("type");
this.i_folderActionType=this.i_actionType;
this.i_actionID=filterAction.attribute("id");
this.i_folderID=this.i_actionID;
this.i_actionDisplay=filterAction.xPath("display", true);
}
MessageFilter.prototype.id=function() {
return this.i_ID;
}
MessageFilter.prototype.setId=function(id) {
this.i_ID=id;
}
MessageFilter.prototype.name=function() {
return this.i_name;
}
MessageFilter.prototype.setName=function(value) {
this.i_name=value;
}
MessageFilter.prototype.type=function() {
return this.i_type;
}
MessageFilter.prototype.setType=function(value) {
this.i_type=value;
}
MessageFilter.prototype.priority=function() {
return this.i_priority;
}
MessageFilter.prototype.setPriority=function(value) {
this.i_priority=value;
}
MessageFilter.prototype.matchType=function() {
return this.i_matchType;
}
MessageFilter.prototype.setMatchType=function(value) {
this.i_matchType=value;
}
MessageFilter.prototype.matchValue=function() {
return this.i_matchValue;
}
MessageFilter.prototype.setMatchValue=function(value) {
this.i_matchValue=value;
}
MessageFilter.prototype.actionType=function() {
return this.i_actionType;
}
MessageFilter.prototype.setActionType=function(value) {
this.i_actionType=value;
}
MessageFilter.prototype.folderActionType=function() {
return this.i_folderActionType;
}
MessageFilter.prototype.setFolderActionType=function(value) {
this.i_folderActionType=value;
}
MessageFilter.prototype.actionDisplay=function() {
return this.i_actionDisplay;
}
MessageFilter.prototype.setActionDisplay=function(value) {
this.i_actionDisplay=value;
}
MessageFilter.prototype.setFolderID=function(value) {
this.i_folderID=value;
}
MessageFilter.prototype.folderID=function() {
return this.i_folderID;
}
MessageFilter.prototype.save=function(handler) {
var p=new ResourcePost();
p.param("gds","1");
p.param("unm",user_prefs["user_name"]);
p.param("sid",user_prefs["session_id"]);
p.param("act","14");
p.param("opts","5");
p.param("id",this.i_ID);
p.param("filterName",this.i_name);
p.param("filterType",this.i_type);
p.param("select1",this.i_matchType);
p.param("select2",this.i_matchType);
p.param("select3",this.i_matchType);
p.param("select4",this.i_matchType);
p.param("select6",this.i_matchType);
p.param("filterDataSubject",this.i_matchValue);
p.param("filterDataBody",this.i_matchValue);
p.param("filterDataSenderName",this.i_matchValue);
p.param("filterDataFromAddr",this.i_matchValue);
p.param("filterDataToAddr",this.i_matchValue);
p.param("filterActionType",this.i_actionType);
p.param("actionTypeFolder",this.i_folderActionType);
p.param("targetFid",this.i_folderID);
p.param("forwardAddress",this.i_actionDisplay);
p.param("reloadurl","");
p.param("prevUri","");
var nId=Notifications.add("Updating message filter settings");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
handler, p, Array(params, nId), undefined); 
}
MessageFilter.priorityOrderFunc=function(filter1,filter2) {
if (filter1.priority() < filter2.priority()) {
return -1;
}
if (filter1.priority() > filter2.priority()) {
return 1;
}
return 0;
}
JavaScriptResource.notifyComplete("./src/Applications/Email/objects/Object.MessageFilter.js");	
function MessageFilterDialog(parent) {
MessageFilterDialog.obj=this;
this.i_parent=parent;
this.superConstructor("email_filter_pref","",650,550,
Application.titleBarFactory());
this.alwaysOnTop(true);
this.modal(true);
this.icons=Array("LiteTreeIcon_folder", 
"EmailFolder_inbox", 
"EmailFolder_sent", 
"EmailFolder_draft", 
"EmailFolder_trash", 
"EmailFolder_junk",
"EmailFolder_trash_empty");
}
MessageFilterDialog.prototype.open=function(filter) {
this.i_filter=filter;
if (this.i_filter) {
this.i_newFilter=false;
this.name("Edit Filter");
} else {
this.i_newFilter=true;
this.name("Add Filter");
this.i_filter=new MessageFilter();
}
this.popWindow(562,530,true);
}
MessageFilterDialog.prototype.onshow=function() {
if (!this.i_content) {
this.i_content=new BasicTable(4,1);
this.i_content.setCellSpacing("5px");
this.i_content.setWidth("560px");
var adjustedWidth="526";
var col1Width=130;
var filterNameFS=new Fieldset("Filter name");
this.i_filterNameTextEdit=new TextEdit("Filter name",undefined,parseInt(adjustedWidth) - 3);
filterNameFS.addContent(this.i_filterNameTextEdit.getContent());
this.i_content.getCell(0,0).appendChild(filterNameFS.getContent());
var filterConditionFS=new Fieldset("Condition");
this.i_filterConditionTable=new BasicTable(7,4);
this.i_filterConditionTable.mergeCells(0,0,0,3);
this.i_filterConditionTable.mergeCells(6,1,6,3);
this.i_filterConditionTable.setWidth(adjustedWidth);
this.i_matchConditionButton=SimpleRadioButton("match","filter_condition",MessageFilterDialog.conditionSelectHandler,this);
this.i_filterConditionTable.getCell(1,0).appendChild(this.i_matchConditionButton);
this.i_filterConditionTable.getCell(1,0).style.width="28px";
this.i_filterConditionTable.getCell(1,0).style.height="28px";
this.i_matchAttributeOptionBox=new OptionBox(col1Width);
this.i_matchAttributeOptionBox.appendOption("Subject","3",true);
this.i_matchAttributeOptionBox.appendOption("Message body","4");
this.i_matchAttributeOptionBox.appendOption("Sender name","2");
this.i_matchAttributeOptionBox.appendOption("From address","1");
this.i_matchAttributeOptionBox.appendOption("To address","6");
this.i_filterConditionTable.getCell(1,1).appendChild(this.i_matchAttributeOptionBox.getContent());
this.i_matchTypeOptionBox=new OptionBox(200);
this.i_matchTypeOptionBox.dropDownHeight(44);
this.i_matchTypeOptionBox.appendOption("contains the exact word/phrase","exact",true);
this.i_matchTypeOptionBox.appendOption("contains a string matching","substring");
this.i_filterConditionTable.getCell(1,2).appendChild(this.i_matchTypeOptionBox.getContent());
this.i_matchValueTextEdit=new TextEdit("","","155px");
this.i_filterConditionTable.getCell(1,3).appendChild(this.i_matchValueTextEdit.getContent());
this.i_virusConditionButton=SimpleRadioButton("virus","filter_condition",
MessageFilterDialog.conditionSelectHandler,this);
this.i_filterConditionTable.getCell(6,0).appendChild(this.i_virusConditionButton);
this.i_filterConditionTable.getCell(6,0).style.height="28px";
this.i_filterConditionTable.getCell(6,1).appendChild(this.createLabel("Virus-infected attachment(s) removed."));
this.i_filterConditionTable.getCell(6,1).className="txtnormal";
filterConditionFS.addContent(this.i_filterConditionTable.getContent());
this.i_content.getCell(1,0).appendChild(filterConditionFS.getContent());
this.i_folderActionButton=SimpleRadioButton("folder","filter_action");
var filterActionTable=new BasicTable(2,2);
filterActionTable.setWidth(adjustedWidth);
filterActionTable.getCell(0,0).appendChild(this.i_folderActionButton);
filterActionTable.getCell(0,0).vAlign="top";
filterActionTable.getCell(0,0).style.width="28px";
this.i_folderActionOptionBox=new OptionBox(col1Width);
this.i_folderActionOptionBox.dropDownHeight(44);
this.i_folderActionOptionBox.appendOption("Move to this folder","3");
this.i_folderActionOptionBox.appendOption("Copy to this folder","1");
this.i_folderActionTable=new BasicTable(1,2);
this.i_folderActionTable.setWidth("100%");
this.i_folderActionTable.getCell(0,0).appendChild(this.i_folderActionOptionBox.getContent());
this.i_folderActionTable.getCell(0,0).style.width="135px";
this.i_folderActionTable.getCell(0,1).className="txtnormal UniversalFormInput_description";
this.i_folderActionTable.getCell(0,1).style.padding="3px 0px 0px 3px";
this.i_folderActionTable.getCell(0,1).style.marginRight="auto";
if (!document.all) this.i_folderActionTable.getCell(0,1).style.display="table-cell";
filterActionTable.getCell(0,1).appendChild(this.i_folderActionTable.getContent());
this.i_folderActionFS=new Fieldset("Folders");
filterActionTable.getCell(0,1).appendChild(this.i_folderActionFS.getContent());
this.i_forwardActionButton=SimpleRadioButton("forward","filter_action");
filterActionTable.getCell(1,0).appendChild(this.i_forwardActionButton);
filterActionTable.getCell(1,0).vAlign="top";
filterActionTable.getCell(1,1).appendChild(this.createLabel("Forward to this email address:"));
filterActionTable.getCell(1,1).className="txtnormal";
this.i_forwardActionTextEdit=new TextEdit();
var faTextEdit=this.i_forwardActionTextEdit.getContent();
faTextEdit.style.paddingLeft="3px";
faTextEdit.style.width="324px";
filterActionTable.getCell(1,1).appendChild(faTextEdit);
var filterActionFS=new Fieldset("Action");
filterActionFS.addContent(filterActionTable.getContent());
this.i_content.getCell(2,0).appendChild(filterActionFS.getContent());
var buttonTable=new BasicTable(1,2);
buttonTable.setCellSpacing("5px");
var saveButton=SimpleButton("Save","50px",MessageFilterDialog.saveButtonHandler,this);
buttonTable.getCell(0,0).appendChild(saveButton);
var cancelButton=SimpleButton("Cancel","50px",MessageFilterDialog.cancelButtonHandler,this);
buttonTable.getCell(0,1).appendChild(cancelButton);
this.i_content.getCell(3,0).appendChild(buttonTable.getContent());
this.i_currentCondition=3;
}
ApplicationEmail.store.requestFolders(MessageFilterDialog.getFoldersHandler);
this.loadContent(this.i_content.getContent());
this.i_filterNameTextEdit.setValue(this.i_filter.name());
if (this.i_filter.type()!="5") {
this.i_virusConditionButton.checked=false;
this.i_virusConditionButton.defaultChecked=false; 
this.i_matchConditionButton.checked=true;
this.i_matchConditionButton.defaultChecked=true; 
this.i_matchAttributeOptionBox.setValue(this.i_filter.type());
this.i_matchTypeOptionBox.setValue(this.i_filter.matchType());
this.i_matchValueTextEdit.setValue(this.i_filter.matchValue());
} else {
this.i_matchConditionButton.checked=false;
this.i_matchConditionButton.defaultChecked=false; 
this.i_virusConditionButton.checked=true;
this.i_virusConditionButton.defaultChecked=true; 
this.i_matchAttributeOptionBox.setValue("3");
this.i_matchTypeOptionBox.setValue("exact");
this.i_matchValueTextEdit.setValue("");
}
if (this.i_filter.actionType()!="2") {
this.i_forwardActionButton.checked=false;
this.i_forwardActionButton.defaultChecked=false; 
this.i_folderActionButton.checked=true;
this.i_folderActionButton.defaultChecked=true; 
this.i_folderActionOptionBox.setValue(this.i_filter.actionType());
if (this.i_filter.actionDisplay()) {
this.i_folderPath=this.i_filter.actionDisplay();
this.i_folderID=this.i_filter.i_actionID;
this.i_folderActionTable.getCell(0,1).innerHTML="&nbsp;"+this.i_folderPath;
} else {
this.i_folderPath="";
this.i_folderID=0;
this.i_folderActionTable.getCell(0,1).innerHTML="<span>&nbsp;<em>Select a folder...</em></span>"
}
this.i_forwardActionTextEdit.setValue("");
} else {
this.i_folderActionButton.checked=false;
this.i_folderActionButton.defaultChecked=false; 
this.i_forwardActionButton.checked=true;
this.i_forwardActionButton.defaultChecked=true; 
this.i_folderActionOptionBox.setValue("3");
this.i_folderActionTable.getCell(0,1).innerHTML="<span>&nbsp;<em>Select a folder...</em></span>"
this.i_folderPath="";
this.i_forwardActionTextEdit.setValue(this.i_filter.actionDisplay());
}
}
MessageFilterDialog.prototype.createLabel=function(text) {
var label=document.createElement("SPAN");
label.className="UniversalRadioOption_label";
label.innerHTML=text;
return label;
}
MessageFilterDialog.prototype.copyFolderTreeDataModel=function(model) {
this.i_folderActionFS.clearContent();
var root=model.rootNode().deepCopy(function(node) { node.onclick=MessageFilterDialog.folderTreeSelectHandler; });
this.i_folderActionTreeModel=new LiteTreeDataModel(root);
this.i_folderActionTreePane=new LiteTree(this.i_folderActionTreeModel,this.icons,this.icons,"472","150");
var tree=this.i_folderActionTreePane.getTree();
this.i_folderActionFS.addContent(tree);
root.open(true);
}
MessageFilterDialog.prototype.selectFolder=function(node) {
var fullNodePath=new Array();
for (var p=node;p.depth() > 0;p=p.parent()) {
fullNodePath.push(p.name());
}
this.i_folderPath="/"+fullNodePath.reverse().join("/");
this.i_folderID=ApplicationEmail.i_folder_tree_ids[node.id()];
this.i_folderActionTable.getCell(0,1).innerHTML=" "+this.i_folderPath;
}
MessageFilterDialog.prototype.validate=function() {
if (!this.i_filterNameTextEdit.value()) {
alert("Please provide a name for this filter.");
this.i_filterNameTextEdit.focus();
return false;
}
if (this.i_filterNameTextEdit.value().indexOf("\n")!=-1) {
alert("Filter name may not contain a line break.");
this.i_filterNameTextEdit.focus();
return false;
}
if (this.i_matchConditionButton.checked) {
if (!this.i_matchValueTextEdit.value()) {
alert("Please provide a value to filter on.");
this.i_matchValueTextEdit.focus();
return false;
}
if (this.i_matchValueTextEdit.value().indexOf("\n")!=-1) {
alert("Filter value may not contain a line break.");
this.i_matchValueTextEdit.focus();
return false;
}
}
if (this.i_folderActionButton.checked && !this.i_folderPath) {
alert("Please select a folder to filter messages to.");
return false;
}
if (this.i_forwardActionButton.checked) {
if (!this.i_forwardActionTextEdit.value()) {
alert("Please an address to forward to.");
this.i_forwardActionTextEdit.focus();
return false;
}
if (this.i_forwardActionTextEdit.value().search(/^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/)==-1) {
alert("The email address entered is not valid.");
this.i_forwardActionTextEdit.focus();
return false;
}
}
return true;
}
MessageFilterDialog.prototype.saveFilter=function() {
this.i_filter.setName(this.i_filterNameTextEdit.value());
if (this.i_matchConditionButton.checked) {
this.i_filter.setType(this.i_matchAttributeOptionBox.value());
this.i_filter.setMatchType(this.i_matchTypeOptionBox.value());
this.i_filter.setMatchValue(this.i_matchValueTextEdit.value());
} else {
this.i_filter.setType("5");
this.i_filter.setMatchType("exact");
this.i_filter.setMatchValue(null);
}
if (this.i_folderActionButton.checked) {
this.i_filter.setActionType("folder");
this.i_filter.setFolderActionType(this.i_folderActionOptionBox.value());
this.i_filter.setActionDisplay(this.i_folderPath);
this.i_filter.setFolderID(this.i_folderID);
} else {
this.i_filter.setActionType("2");
this.i_filter.setFolderActionType("2");
this.i_filter.setActionDisplay(this.i_forwardActionTextEdit.value());
}
this.i_parent.storeFilter(this.i_filter);
}
MessageFilterDialog.getFoldersHandler=function() {
MessageFilterDialog.obj.copyFolderTreeDataModel(ApplicationEmail.getFolderTreeDataModel());
}
MessageFilterDialog.folderTreeSelectHandler=function() {
MessageFilterDialog.obj.selectFolder(this);
}
MessageFilterDialog.saveButtonHandler=function(event) {
if (event.charCode && event.charCode!=32) {
return;
}
var target;
if (event.target) target=event.target;
else if (event.srcElement) target=event.srcElement;
if (this.obj.validate()) {
MessageFilterDialog.obj.saveFilter();
MessageFilterDialog.obj.close();
}
target.blur();
}
MessageFilterDialog.cancelButtonHandler=function(event) {
if (event.charCode && event.charCode!=32) {
return;
}
var target;
if (event.target) target=event.target;
else if (event.srcElement) target=event.srcElement;
MessageFilterDialog.obj.close();
target.blur();
}
MessageFilterDialog.conditionSelectHandler=function() {
}
MessageFilterDialog.saveHandler=function(data, xml, req, params) {
if (params!=undefined) {
if (params.length > 1) {
Notifications.end(params[1]);
}
}	
MessageFilterDialog.obj.i_parent.notifyFilterSaved();
}
inherit(WindowObject,MessageFilterDialog);
JavaScriptResource.notifyComplete("./src/Applications/Email/dialogs/Dialog.MessageFilter.js");
function EmailGeneralPane() {
this.superFormPreferencePane("General Settings", "Edit general email settings.");
this.i_inputs={};
this.i_search_settings=undefined;
EventHandler.register(this, "onload", this.handleLoad, this);
}
EmailGeneralPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 200);
var section=this.i_form.addSection(new UniversalFormSection("Viewing Emails"));
this.i_inputs.per_page=new UniversalOptionBoxInput("Number of messages per page", "", [new UniversalOptionBoxOption("10", "10"),
new UniversalOptionBoxOption("20", "20"),
new UniversalOptionBoxOption("50", "50")]);
section.addRow(new UniversalFormRow(this.i_inputs.per_page));
if (_LITE_) {
this.i_inputs.preview_pane=new UniversalRadioInput("Preview pane", "", "100%", [new UniversalRadioOption("On", "1"),
new UniversalRadioOption("Off", "0")]);
this.i_inputs.preview_pane.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.preview_pane));
}
if(!_LITE_ && SearchBox.engines.length > 0) {
this.i_inputs.highlight_search=new UniversalRadioInput("Highlight and search", "", "100%", [new UniversalRadioOption("On", "1"),
new UniversalRadioOption("Off", "0")]);
this.i_inputs.highlight_search.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.highlight_search));
}
section=this.i_form.addSection(new UniversalFormSection("New Message Notifications"));
this.i_inputs.notify_time=new UniversalOptionBoxInput("Automatically check for new emails", "", [new UniversalOptionBoxOption("Never", "0"),
new UniversalOptionBoxOption("Every 5 minutes", "5"),
new UniversalOptionBoxOption("Every 10 minutes", "10"),
new UniversalOptionBoxOption("Every 15 minutes", "15"),
new UniversalOptionBoxOption("Every 30 minutes", "30")]);
section.addRow(new UniversalFormRow(this.i_inputs.notify_time));
this.i_inputs.notify_enabled=new UniversalRadioInput("Notify me when I have a new message", "", "100%", [new UniversalRadioOption("Yes", "1"),
new UniversalRadioOption("No", "0")]);
this.i_inputs.notify_enabled.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.notify_enabled));
section=this.i_form.addSection(new UniversalFormSection("Composing Emails"));
this.i_inputs.save_sent=new UniversalRadioInput("Automatically save outgoing messages", "", "100%", [new UniversalRadioOption("Yes", "1"),
new UniversalRadioOption("No", "0")]);
this.i_inputs.save_sent.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.save_sent));
this.i_inputs.rich_compose=new UniversalRadioInput("Default email composer", "", "100%", [new UniversalRadioOption("Rich composer", "1"),
new UniversalRadioOption("Plain text composer", "0")]);
this.i_inputs.rich_compose.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.rich_compose));
this.i_inputs.forward_attachment=new UniversalRadioInput("Reply and forward format for HTML messages", "", "100%", [new UniversalRadioOption("As attachment", "1"),
new UniversalRadioOption("Inline", "0")]);
this.i_inputs.forward_attachment.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.forward_attachment));
section.rows()[section.rows().length-1].getRow().style.marginTop="-6px" ;
this.i_inputs.auto_save=new UniversalOptionBoxInput("Auto-save emails while composing", "", [new UniversalOptionBoxOption("Never", "0"),
new UniversalOptionBoxOption("Every Minute", "1"),
new UniversalOptionBoxOption("Every 2 minutes", "2"),
new UniversalOptionBoxOption("Every 5 minutes", "5"),
new UniversalOptionBoxOption("Every 15 minutes", "15")]);
section.addRow(new UniversalFormRow(this.i_inputs.auto_save));
this.i_inputs.attach_vcard=new UniversalOptionBoxInput("Automatically attach contact info", "", [new UniversalOptionBoxOption("None", "0"),
new UniversalOptionBoxOption("Work Information", "1"),
new UniversalOptionBoxOption("Personal Information", "2"),
new UniversalOptionBoxOption("All Information", "3")]);
section.addRow(new UniversalFormRow(this.i_inputs.attach_vcard));
section=this.i_form.addSection(new UniversalFormSection("Cleanup"));
this.i_inputs.auto_delete=new UniversalOptionBoxInput("Automatically delete messages in my Trash folder", "", [new UniversalOptionBoxOption("Never", "0"),
new UniversalOptionBoxOption("After logout", "-1"),
new UniversalOptionBoxOption("That are one week old", "7"),
new UniversalOptionBoxOption("That are two weeks old", "14"),
new UniversalOptionBoxOption("That are one month old", "30")]);
section.addRow(new UniversalFormRow(this.i_inputs.auto_delete));
this.i_form.clearModified();
}
return this.i_form;
}
EmailGeneralPane.prototype.handleLoad=function(e) {
if(SearchBox.engines.length > 0) {
this.i_search_settings=SearchSettings.store.getSettings();
EventHandler.register(SearchSettings.store, "onchange", this.handleSearchSettingsChange, this);
}
var params=new DataNode("params");
var request=new RequestObject("email", "getEmailPrefGeneral", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
EventHandler.register(request, "onerror", this.handleLoadError, this);
request.execute();
}
EmailGeneralPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var compose_data=data.xPath("optCompose")[0];
var display_data=data.xPath("optDisplay")[0];
this.i_inputs.per_page.value(display_data.attribute("msgPerPage"));
if (_LITE_) this.i_inputs.preview_pane.value(display_data.attribute("preview"));
if(this.i_inputs.highlight_search!=undefined)	 {
if(this.i_search_settings.isHighlightSearchEnabled()) {
this.i_inputs.highlight_search.value(1);
} else {
this.i_inputs.highlight_search.value(0);
}
}
this.i_inputs.notify_time.value(display_data.attribute("notifyNewTime"));
this.i_inputs.notify_enabled.value(display_data.attribute("notifyNewEnabled"));
this.i_inputs.save_sent.value(compose_data.attribute("saveOutgoing"));
this.i_inputs.rich_compose.value(compose_data.attribute("richComposer"));
this.i_inputs.forward_attachment.value(compose_data.attribute("replyFormat"));
var auto_save_value=compose_data.attribute("autoSave");
if(auto_save_value==undefined || auto_save_value=="") {
auto_save_value="0";
}
this.i_inputs.auto_save.value(auto_save_value);
var attach_vcard_value=compose_data.attribute("attachVCard");
if(attach_vcard_value==undefined || attach_vcard_value=="") {
attach_vcard_value="0";
}
this.i_inputs.attach_vcard.value(attach_vcard_value);
var delete_after_value=display_data.attribute("deleteAfter");
if (delete_after_value==undefined || delete_after_value=="") {
delete_after_value="0" ;
}
this.i_inputs.auto_delete.value(delete_after_value);
this.updateDefault();
this.loaded(true);
}
EmailGeneralPane.prototype.handleSearchSettingsChange=function(e) {
if (e!=undefined && e.value!=undefined) {
var new_value=(e.value==true ? "1" : "0");
if (this.i_inputs.highlight_search.value()!=new_value) {
this.i_inputs.highlight_search.value(new_value);
this.parent().parent().save();
}
}
}
EmailGeneralPane.prototype.save=function() {
var params=new DataNode("params");
params.addNode(new DataNode("msgPerPage", this.i_inputs.per_page.value()));
if (_LITE_) params.addNode(new DataNode("preview", this.i_inputs.preview_pane.value()));
params.addNode(new DataNode("notifyNewTime", this.i_inputs.notify_time.value()));
params.addNode(new DataNode("notifyNewEnabled", this.i_inputs.notify_enabled.value()));
params.addNode(new DataNode("saveOutgoing", this.i_inputs.save_sent.value()));
params.addNode(new DataNode("richComposer", this.i_inputs.rich_compose.value()));
params.addNode(new DataNode("replyFormat", this.i_inputs.forward_attachment.value()));
params.addNode(new DataNode("autoSave", this.i_inputs.auto_save.value()));
params.addNode(new DataNode("attachVCard", this.i_inputs.attach_vcard.value()));
params.addNode(new DataNode("deleteAfter", this.i_inputs.auto_delete.value()));
if(ApplicationEmail) {
var prefs=ApplicationEmail.i_preferences;
prefs.notify_new_time(this.i_inputs.notify_time.value());
prefs.notify_new_enabled(this.i_inputs.notify_enabled.value());
ApplicationEmail.setup_new_message_check();
if(prefs.messages_per_page()!=this.i_inputs.per_page.value()) {
prefs.messages_per_page(this.i_inputs.per_page.value());
ApplicationEmail.i_messageList.pageLength(parseInt(prefs.messages_per_page()));
ApplicationEmail.i_data_model.block_size=parseInt(prefs.messages_per_page());
if(SystemCore.activeApplication().name()=='Email') {
ApplicationEmail.view_new_messages();
}
if (ApplicationEmail.getMessageList!=undefined && 
ApplicationEmail.getMessageList().updatePageList!=undefined)
ApplicationEmail.getMessageList().updatePageList();
}
if (_LITE_) prefs.preview_enabled(this.i_inputs.preview_pane.value()=="1" ? true:false);
prefs.save_outgoing(this.i_inputs.save_sent.value()=="1" ? true:false);
prefs.rich_compose(this.i_inputs.rich_compose.value()=="1" ? true:false);
prefs.reply_format(this.i_inputs.forward_attachment.value()=="1" ? true:false);
prefs.auto_save(this.i_inputs.auto_save.value());
prefs.vcard_attach(this.i_inputs.attach_vcard.value());
prefs.trash_cleanup(this.i_inputs.auto_delete.value());
WindowObject.getWindowById('eml-preview').minimized(prefs.preview_enabled() ? false : true);
}
if(this.i_search_settings!=undefined) {
var search_bool=this.i_inputs.highlight_search.value()=="1" ? true:false;
if(search_bool!=this.i_search_settings.isHighlightSearchEnabled()) {
this.i_search_settings.setHighlightSearchEnabled(search_bool);	
this.i_search_settings.save();										
SearchMenu.settings=this.i_search_settings;
}
}
var request=new RequestObject("email","setEmailPrefGeneral",params);
return request;
}
EmailGeneralPane.inherit(FormPreferencePane);
Application.getApplicationById(1007).registerPreferencePane(new EmailGeneralPane());
function EmailNameSignaturePane() {
this.superFormPreferencePane("Name and Signature", "Personalize your outgoing email messages.");
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
EmailNameSignaturePane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 150);
var section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.name=new UniversalTextInput("Name", "Enter your name as you would like it to appear on your outgoing emails");
section.addRow(new UniversalFormRow(this.i_inputs.name));
this.i_inputs.signature=new UniversalTextAreaInput("Signature", "", "100%", 100);
section.addRow(new UniversalFormRow(this.i_inputs.signature));
this.i_inputs.append_signature=new UniversalCheckBoxOption("Append signature to all messages", "1")
section.addRow(new UniversalFormRow(new UniversalCheckBoxInput("", "", "100%",
this.i_inputs.append_signature)));
this.i_inputs.address=new UniversalOptionBoxInput("Default sender address", "", []);
section.addRow(new UniversalFormRow(this.i_inputs.address));
this.i_inputs.address_reply=new UniversalCheckBoxOption("Always reply with this address", "1");
section.addRow(new UniversalFormRow(new UniversalCheckBoxInput("", "", "100%",
this.i_inputs.address_reply)));
this.i_form.clearModified();
}
return this.i_form;
}
EmailNameSignaturePane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
var request=new RequestObject("email", "getEmailPrefName", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
EventHandler.register(request, "onerror", this.handleLoadError, this);
request.execute();
}
EmailNameSignaturePane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var signature=data.xPath("optCompose/signature")[0];
this.i_inputs.name.value(data.xPath("optCompose/fromName", true));
this.i_inputs.signature.value(signature.value());
this.i_inputs.append_signature.checked(signature.attribute("append"));
this.i_inputs.address.value(data.xPath("optCompose/senderAddress", true));
var alias_data=data.xPath("optCompose/aliasList/aliasListEnt/aliasListDom/alias");
for(var i=0; i < alias_data.length; i++) {
var address=alias_data[i].xPath("alias", true);
this.i_inputs.address.addOption(new UniversalOptionBoxOption(address, address));
if(alias_data[i].attribute("isDefault")=="1") {
this.i_inputs.address.value(address);
this.i_inputs.address_reply.checked(alias_data[i].attribute("useForReplies")=="1");
}
}
this.updateDefault();
this.loaded(true);
}
EmailNameSignaturePane.prototype.save=function() {
if(ApplicationEmail) {
var prefs=ApplicationEmail.i_preferences;
if (this.i_inputs.name.value().length > 0)
prefs.display_name(this.i_inputs.name.value());
else
this.i_inputs.name.value(prefs.display_name());
prefs.signature(this.i_inputs.signature.value());
prefs.append_sig((this.i_inputs.append_signature.checked()) ? true:false);
var aliases=prefs.aliases();
var new_default=this.i_inputs.address.value();			
if(aliases!=undefined) {
for(var i=0; i < aliases.length; i++) {
if(aliases[i].use_for_replies) {
aliases[i].use_for_replies=false;
break;
}
}
for(var i=0; i < aliases.length; i++) {
if(aliases[i].is_default) {
aliases[i].is_default=false;
break;
}
}
}				
if(this.i_inputs.address_reply.checked() && aliases!=undefined) {				
for(var i=0; i < aliases.length; i++) {
if(aliases[i].address==new_default) {
aliases[i].use_for_replies=true;
break;
}
}
}
if(this.i_inputs.address.isModified() && aliases!=undefined) {
for(var i=0; i < aliases.length; i++) {
if(aliases[i].address==new_default) {
aliases[i].is_default=true;
break;
}
}
}
}	
var params=new DataNode("params");
params.addNode(new DataNode("fromName", this.i_inputs.name.value()));
params.addNode(new DataNode("signature", this.i_inputs.signature.value()));
params.addNode(new DataNode("append", (this.i_inputs.append_signature.checked()) ? "1" : "0"));
params.addNode(new DataNode("senderAddress", this.i_inputs.address.value()));
params.addNode(new DataNode("senderUseForReply", (this.i_inputs.address_reply.checked()) ? "1" : "0"));
var request=new RequestObject("email","setEmailPrefName",params);
return request;
}
EmailNameSignaturePane.inherit(FormPreferencePane);
Application.getApplicationById(1007).registerPreferencePane(new EmailNameSignaturePane());
function EmailPOPPane() {
this.superFormPreferencePane("POP3 Accounts", "Edit your settings to retrieve messages from your POP3 email accounts.");
this.i_inputs={};
this.i_sections={
"accounts": []
};
EmailPOPPane.obj=this;
this.i_modified=false;
this.i_accounts=[];
EventHandler.register(this, "onload", this.handleLoad, this);
}
EmailPOPPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 175);
this.i_sections.edit=this.i_form.addSection(new UniversalFormSection("Account Details", ""));
this.i_inputs.name=new UniversalTextInput("Account", "");
this.i_sections.edit.addRow(new UniversalFormRow(this.i_inputs.name));
this.i_inputs.server=new UniversalTextInput("Mail server", "");
this.i_sections.edit.addRow(new UniversalFormRow(this.i_inputs.server));
this.i_inputs.username=new UniversalTextInput("Username", "");
this.i_sections.edit.addRow(new UniversalFormRow(this.i_inputs.username));
this.i_inputs.password=new UniversalTextInput("Password", "");
this.i_inputs.password.masked(true);
this.i_sections.edit.addRow(new UniversalFormRow(this.i_inputs.password));
this.i_inputs.timeout=new UniversalTextInput("Timeout (in seconds)", "", 50);
this.i_sections.edit.addRow(new UniversalFormRow(this.i_inputs.timeout));
this.i_inputs.port=new UniversalTextInput("Port", "110 is standard", 50);
this.i_sections.edit.addRow(new UniversalFormRow(this.i_inputs.port));
this.i_inputs.leave_on_server=new UniversalRadioInput("Leave messages on server", "", "100%", [new UniversalRadioOption("Yes", "1"),
new UniversalRadioOption("No", "0")]);
this.i_inputs.leave_on_server.columns(2);
this.i_sections.edit.addRow(new UniversalFormRow(this.i_inputs.leave_on_server));
var save_button=new UniversalButton("Save", undefined, undefined, undefined, true, 22);
EventHandler.register(save_button, "onclick", this.handleSaveClick, this);
var cancel_button=new UniversalButton("Cancel", undefined, undefined, undefined, true, 22);
EventHandler.register(cancel_button, "onclick", this.handleCancelClick, this);
this.i_sections.edit.addRow(new UniversalFormRow(new UniversalButtonInput(save_button, "right", "100%"),
new UniversalButtonInput(cancel_button, "left", 90)));
this.i_sections.account_list=this.i_form.addSection(new UniversalFormSection("POP3 Accounts", ""));
var new_button=new UniversalButton("New POP Account", undefined, undefined, undefined, 
true, 22, undefined, "Create a new POP Account");
EventHandler.register(new_button, "onclick", this.handleNewClick, this);
this.i_sections.account_list.addRow(new UniversalFormRow(new UniversalButtonInput(new_button)));
this.i_form.clearModified();
this.i_form.removeSection(this.i_sections.edit);
}
return this.i_form;
}
EmailPOPPane.prototype.isModified=function(){
for(var i=0; i < this.i_accounts.length; i++) {
var account=this.i_accounts[i];
if(account.create || account.update || account.remove) {
return true;
}
}
return false;
}
EmailPOPPane.prototype.handleNewClick=function(e){
this.i_account=undefined;
this.displayAccountEditor();
}
EmailPOPPane.prototype.handleEditClick=function(e){
this.i_account=e.originalScope.account;
this.displayAccountEditor();
}
EmailPOPPane.prototype.handleRemoveClick=function(e){
var account=e.originalScope.account;
if(account.id) {
account.remove=true;
} else {
for(var i=0; i < this.i_accounts.length; i++) {
if(this.i_accounts[i]==account) {
this.i_accounts.splice(i, 1);
}
}
}
for(var i=0; i < this.i_sections.accounts.length; i++) {
if(this.i_sections.accounts[i].account==account) {
this.i_form.removeSection(this.i_sections.accounts[i]);
this.i_sections.accounts.splice(i, 1);
}
}
}
EmailPOPPane.prototype.handleSaveClick=function(e){
var account=(this.i_account) ? this.i_account : {};
account.name=this.i_inputs.name.value();
account.server=this.i_inputs.server.value();
account.username=this.i_inputs.username.value();
account.password=this.i_inputs.password.value();
account.timeout=this.i_inputs.timeout.value();
account.port=this.i_inputs.port.value();
account.leave_on_server=this.i_inputs.leave_on_server.value();
account.create=(account.id) ? false : true;
account.update=(account.id) ? true : false;
if(!account.id) {
this.i_accounts.push(account);
}
this.updateAccountList(account);
this.displayAccountList();
}
EmailPOPPane.prototype.handleCancelClick=function(e){
this.displayAccountList();
}
EmailPOPPane.prototype.updateAccountList=function(account){
for(var i=0; i < this.i_sections.accounts.length; i++) {
if(this.i_sections.accounts[i].account==account) {
this.i_form.removeSection(this.i_sections.accounts[i]);
this.i_sections.accounts.splice(i, 1);
}
}
var section=this.i_form.addSection(new UniversalFormSection(account.name));
section.account=account;
section.addRow(new UniversalFormRow(new UniversalLabelInput("Mail Server", "", 450, account.server)));
section.addRow(new UniversalFormRow(new UniversalLabelInput("Username", "", 450, account.username)));
section.addRow(new UniversalFormRow(new UniversalLabelInput("Timeout", "", 450, account.timeout)));
section.addRow(new UniversalFormRow(new UniversalLabelInput("Port", "", 450, account.port)));
section.addRow(new UniversalFormRow(new UniversalLabelInput("Leave messages on server", "", 450, (account.leave_on_server=="1") ? "Yes" : "No")));
var edit_button=new UniversalButton("Edit", undefined, undefined, undefined, true, 22);
edit_button.account=account;
EventHandler.register(edit_button, "onclick", this.handleEditClick, this);
var remove_button=new UniversalButton("Remove", undefined, undefined, undefined, true, 22);
remove_button.account=account;
EventHandler.register(remove_button, "onclick", this.handleRemoveClick, this);
section.addRow(new UniversalFormRow(new UniversalButtonInput(edit_button, "right", "100%"),
new UniversalButtonInput(remove_button, "left", 90)));
this.i_sections.accounts.push(section);
}
EmailPOPPane.prototype.displayAccountList=function(){
this.getForm();
this.i_form.removeSection(this.i_sections.edit);
this.i_sections.edit.reset();
this.i_form.addSection(this.i_sections.account_list);
for(var i=0; i < this.i_sections.accounts.length; i++) {
this.i_form.removeSection(this.i_sections.accounts[i]);
if(!this.i_sections.accounts[i].account.remove) {
this.i_form.addSection(this.i_sections.accounts[i]);
}
}
}
EmailPOPPane.prototype.displayAccountEditor=function(){
this.getForm();
this.i_form.removeSection(this.i_sections.account_list);
for(var i=0; i < this.i_sections.accounts.length; i++) {
this.i_form.removeSection(this.i_sections.accounts[i]);
}
this.i_form.addSection(this.i_sections.edit);
if(this.i_account) {
this.i_inputs.name.value(this.i_account.name);
this.i_inputs.server.value(this.i_account.server);
this.i_inputs.username.value(this.i_account.username);
this.i_inputs.password.value(this.i_account.password);
this.i_inputs.timeout.value(this.i_account.timeout);
this.i_inputs.port.value(this.i_account.port);
this.i_inputs.leave_on_server.value(this.i_account.leave_on_server);
} else {
this.i_inputs.timeout.value("90");
this.i_inputs.port.value("110");
this.i_inputs.leave_on_server.value("1");
}
}
EmailPOPPane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
var request=new RequestObject("email", "getEmailPrefPop", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
EventHandler.register(request, "onerror", this.handleLoadError, this);
request.execute();
}
EmailPOPPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var accounts_data=data.xPath("optPop/popAccount");
for(var i=0; i < accounts_data.length; i++) {
var account_data=accounts_data[i];
var account={
"id": account_data.attribute("id"),
"name": account_data.xPath("dname", true),
"server": account_data.xPath("server", true),
"username": account_data.xPath("login", true),
"password": account_data.xPath("password", true),
"timeout": account_data.attribute("timeout"),
"port": account_data.attribute("port"),
"leave_on_server": account_data.attribute("leaveOnServer")
}
this.i_accounts.push(account);
this.updateAccountList(account);
}
this.updateDefault();
this.loaded(true);
}
EmailPOPPane.prototype.save=function() {
var requests=[];
for(var i=0; i < this.i_accounts.length; i++) {
var account=this.i_accounts[i];
if(account.create || account.update || account.remove) {
var params=new DataNode("params");
if(account.remove) {
params.addNode(new DataNode("id", account.id));
params.addNode(new DataNode("delete", "1"));
} else {
params.addNode(new DataNode("dname", account.name));
params.addNode(new DataNode("server", account.server));
params.addNode(new DataNode("login", account.username));
params.addNode(new DataNode("password", account.password));
params.addNode(new DataNode("timeout", account.timeout));
params.addNode(new DataNode("port", account.port));
params.addNode(new DataNode("leaveOnServer", account.leave_on_server));
if(account.update) {
params.addNode(new DataNode("id", account.id));
} else {
params.addNode(new DataNode("id", "new"));
}
}
var request=new RequestObject("email", "setEmailPrefPop", params);
requests.push(request);
}
}
return requests;
}
EmailPOPPane.inherit(FormPreferencePane);
Application.getApplicationById(1007).registerPreferencePane(new EmailPOPPane());
function EmailJunkPane() {
this.superFormPreferencePane("Junk Mail Controls", "Restrict unwanted emails from being delivered to your inbox.");
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
EmailJunkPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 175);
var section=this.i_form.addSection(new UniversalFormSection("Junk Mail Restriction"));
this.i_inputs.threshold=new UniversalOptionBoxInput("Set the level of junk mail stringency", "", [new UniversalOptionBoxOption("0 - Least restrictive", "5"),
new UniversalOptionBoxOption("1", "4.5"),
new UniversalOptionBoxOption("2", "4"),
new UniversalOptionBoxOption("3", "3.5"),
new UniversalOptionBoxOption("4", "3"),
new UniversalOptionBoxOption("5 - Moderately restrictive", "2.5"),
new UniversalOptionBoxOption("6", "2"),
new UniversalOptionBoxOption("7", "1.5"),
new UniversalOptionBoxOption("8", "1"),
new UniversalOptionBoxOption("9", "0.5"),
new UniversalOptionBoxOption("10 - Most restrictive", "0.0")]);
section.addRow(new UniversalFormRow(this.i_inputs.threshold));
this.i_inputs.show_images=new UniversalRadioInput("Would you like to hide embedded images when viewing email?", "", "100%", [new UniversalRadioOption("Yes", "0"),
new UniversalRadioOption("No", "1")]);
this.i_inputs.show_images.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.show_images));
section=this.i_form.addSection(new UniversalFormSection("Cleanup"));
this.i_inputs.junk_action=new UniversalRadioInput("When I flag messages as Junk", "", "100%", [new UniversalRadioOption("Move the messages to the Junk-Mail folder", "0"),
new UniversalRadioOption("Delete the messages permanently", "1")]);
section.addRow(new UniversalFormRow(this.i_inputs.junk_action));
this.i_inputs.auto_delete=new UniversalOptionBoxInput("Automatically delete messages in my Junk-Mail folder", "", [new UniversalOptionBoxOption("Never", "0"),
new UniversalOptionBoxOption("After logout", "-1"),
new UniversalOptionBoxOption("That are one week old", "7"),
new UniversalOptionBoxOption("That are two weeks old", "14"),
new UniversalOptionBoxOption("That are one month old", "30")]);
section.addRow(new UniversalFormRow(this.i_inputs.auto_delete));
section=this.i_form.addSection(new UniversalFormSection("Safe List and Block List"));
this.i_inputs.safe_list=new UniversalAddRemoveListInput("Safe list",
"Messages from these addresses and domains will never be sent to your Junk-Mail folder.", []);
EventHandler.register(this.i_inputs.safe_list, "onadd", this.handleAdd, this);
section.addRow(new UniversalFormRow(this.i_inputs.safe_list));
this.i_inputs.block_list=new UniversalAddRemoveListInput("Block list",
"Messages from these addresses and domains will never be delivered to your Inbox.", []);
EventHandler.register(this.i_inputs.block_list, "onadd", this.handleAdd, this);
section.addRow(new UniversalFormRow(this.i_inputs.block_list));
section=this.i_form.addSection(new UniversalFormSection("Sender Trending"));
var reset_button=new UniversalButton("Reset", undefined, undefined, undefined, true, 22);
EventHandler.register(reset_button, "onclick", this.handleResetClick, this);
this.i_inputs.sender_trending=new UniversalRadioInput("Sender trending", "Sender trending tracks the SPAM scores for your regular correspondents, keeping a historical average of the sender and pushes the SPAM score on subsequent email messages towards this average. This feature assists in reducing false-positives (messages delivered to your Junk-Mail folder that should have been delivered to your Inbox and messages delivered to your Inbox that should have been delivered to your Junk-Mail folder). Pressing the \"Reset\" button will reset your sender trending averages and should only be used if you feel that your regular correspondant SPAM score averages are inaccurate.", "100%", [new UniversalRadioOption("On", "1"),
new UniversalRadioOption("Off", "0")]);
this.i_inputs.sender_trending.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.sender_trending));
section.addRow(new UniversalFormRow(new UniversalButtonInput(reset_button)));
section=this.i_form.addSection(new UniversalFormSection("Handling Inbound Junk"));
this.i_inputs.junk_handling=new UniversalRadioInput("When a message is Junk", "", "100%", [new UniversalRadioOption("Deliver it to the Junk-Mail folder", "1"),
new UniversalRadioOption("Add text prefix to the subject line and deliver to the Inbox. (Recommended for POP3 users)", "0")]);
section.addRow(new UniversalFormRow(this.i_inputs.junk_handling));
this.i_inputs.junk_prefix=new UniversalTextInput("Use this text as a prefix (second option only)", "");
section.addRow(new UniversalFormRow(this.i_inputs.junk_prefix));
this.i_form.clearModified();
}
return this.i_form;
}
EmailJunkPane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
var request=new RequestObject("email", "getEmailPrefSpam", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
EventHandler.register(request, "onerror", this.handleLoadError, this);
request.execute();
}
EmailJunkPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var spam_data=data.xPath("optSpam")[0];
this.i_inputs.threshold.value(spam_data.attribute("threshold"));
if (this.i_inputs.threshold.value()==undefined  || this.i_inputs.threshold.value().length==0) {
this.i_inputs.threshold.value(5);
}
this.i_inputs.show_images.value(spam_data.attribute("embeddedImages"));
if (this.i_inputs.show_images.value()==undefined) {
this.i_inputs.show_images.value(1);
}
this.i_inputs.junk_action.value(spam_data.attribute("junkAction"));
if (this.i_inputs.junk_action.value()==undefined) {
this.i_inputs.junk_action.value(0);
}
this.i_inputs.auto_delete.value(spam_data.attribute("deleteAfter"));
if (this.i_inputs.auto_delete.value()==undefined || this.i_inputs.auto_delete.value().length==0) {
this.i_inputs.auto_delete.value(0);
}
var safe_list_data=data.xPath("optSpam/whitelist_entry");
var block_list_data=data.xPath("optSpam/blacklist_entry");
var safe_list=[];
for(var i=0; i < safe_list_data.length; i++) {
var option=new UniversalOptionBoxOption(safe_list_data[i].value(), safe_list_data[i].attribute("id"));
var entwide=safe_list_data[i].attribute("entwide");
option.enabled(!(entwide && entwide=="true"));
safe_list.push(option);
}
var block_list=[];
for(var i=0; i < block_list_data.length; i++) {
var option=new UniversalOptionBoxOption(block_list_data[i].value(), block_list_data[i].attribute("id"));
var entwide=block_list_data[i].attribute("entwide");
option.enabled(!(entwide && entwide=="true"));
block_list.push(option);
}
block_list.sort(this.sort_spam_list_options);
safe_list.sort(this.sort_spam_list_options);
this.i_inputs.safe_list.value(safe_list);
this.i_inputs.block_list.value(block_list);
this.i_inputs.sender_trending.value(spam_data.attribute("autoWhitelist"));
this.i_inputs.junk_handling.value(spam_data.attribute("filterType"));
if (this.i_inputs.junk_handling.value()==undefined || this.i_inputs.junk_handling.value().length==0) {
this.i_inputs.junk_handling.value(0);
}
this.i_inputs.junk_prefix.value(spam_data.attribute("filterTypeSubjectText"));
if (this.i_inputs.junk_prefix.value()==undefined || this.i_inputs.junk_prefix.value().length==0) {
this.i_inputs.junk_prefix.value("SPAM:");
}
this.updateDefault();
this.loaded(true);
}
EmailJunkPane.prototype.sort_spam_list_options=function(op1, op2) {
if(op1.name().toLowerCase() > op2.name().toLowerCase()) return 1;
else if(op1.name().toLowerCase() < op2.name().toLowerCase()) return -1;
return 0;
}
EmailJunkPane.prototype.invalidate_spam_prefs_page=function() {
this.loaded(false);
}
EmailJunkPane.prototype.save=function() {
var safe_list_actions="";
var block_list_actions="";
var safe_list_added=this.i_inputs.safe_list.addedOptionValues();
for(var i=0; i < safe_list_added.length; i++) {
safe_list_actions+="add,"+safe_list_added[i]+";";
}
var safe_list_removed=this.i_inputs.safe_list.removedOptionValues();
for(var i=0; i < safe_list_removed.length; i++) {
safe_list_actions+="del,"+safe_list_removed[i]+";";
}
var block_list_added=this.i_inputs.block_list.addedOptionValues();
for(var i=0; i < block_list_added.length; i++) {
block_list_actions+="add,"+block_list_added[i]+";";
}
var block_list_removed=this.i_inputs.block_list.removedOptionValues();
for(var i=0; i < block_list_removed.length; i++) {
block_list_actions+="del,"+block_list_removed[i]+";";
}
var params=new DataNode("params");
params.addNode(new DataNode("whiteListActions",safe_list_actions));
params.addNode(new DataNode("blackListActions",block_list_actions));
params.addNode(new DataNode("threshold",this.i_inputs.threshold.value()));
params.addNode(new DataNode("embeddedImageDisplay",this.i_inputs.show_images.value()));
params.addNode(new DataNode("junkAction",this.i_inputs.junk_action.value()));
params.addNode(new DataNode("deleteAfter",this.i_inputs.auto_delete.value()));
params.addNode(new DataNode("autoWhitelist",this.i_inputs.sender_trending.value()));
params.addNode(new DataNode("filterType",this.i_inputs.junk_handling.value()));
params.addNode(new DataNode("filterTypeSubjectText",this.i_inputs.junk_prefix.value()));
if(ApplicationEmail) {
var prefs=ApplicationEmail.i_preferences;
prefs.show_images(this.i_inputs.show_images.value()=="0"?false:true);
prefs.spam_action(this.i_inputs.junk_action.value());
prefs.spam_cleanup(this.i_inputs.auto_delete.value());
prefs.auto_whitelist(this.i_inputs.sender_trending.value()=="1"?true:false);
prefs.filter_type(this.i_inputs.junk_handling.value());
prefs.filter_type_subject_text(this.i_inputs.junk_prefix.value());
}
var request=new RequestObject("email","setEmailPrefSpam",params);
if((safe_list_actions.length > 0) || (block_list_actions.length > 0)) {
this.invalidate_spam_prefs_page();
}
return request;
}
EmailJunkPane.prototype.handleAdd=function(e) {
var hitSafe=false, hitBlock=false;
var safe_opts=this.i_inputs.safe_list.options();
var block_opts=this.i_inputs.block_list.options();
for (var i=0; i < safe_opts.length;++i) {
if (safe_opts[i].name!=undefined && safe_opts[i].name().toLowerCase()==e.value.toLowerCase()) {
hitSafe=true;
break;
}
}
for (var i=0; i < block_opts.length;++i) {
if (block_opts[i].name!=undefined && block_opts[i].name().toLowerCase()==e.value.toLowerCase()) {
hitBlock=true;
break;
}
}
if (hitSafe || hitBlock) {
if (hitSafe) {
DialogManager.alert("The address you specified is already in the safe list.");
} else if (hitBlock) {
DialogManager.alert("The address you specified is already in the block list.");
} else { 
DialogManager.alert("How did you manage to get the address into both lists?");
}
e.cancelAdd=true;
} else if (!this.validateAddress(e.value)) {
DialogManager.alert("Please enter an email address or domain name.");
e.cancelAdd=true;
}
}
EmailJunkPane.prototype.validateAddress=function(address) {
var ret=false;
if(address.length > 0) {
if(address.indexOf("@") >=0) {
if(address.match(/^([a-zA-Z0-9\!\#\$\%\'\*\+\-\/\=\?\^\_\`\{\|\}\~]+\.)*[a-zA-Z0-9\!\#\$\%\'\*\+\-\/\=\?\^\_\`\{\|\}\~]+@((([a-zA-Z0-9]+)|([a-zA-Z0-9]+[\-]+[a-zA-Z0-9]+))\.)+[a-zA-Z]+$/ ) && address.length < 321 ) {
					ret = true;
				}
			} else {
				if( address.match( /^((([a-zA-Z0-9]+)|([a-zA-Z0-9]+[\-]+[a-zA-Z0-9]+))\.)+[a-zA-Z]+$/ ) && address.length < 65 ) {
					ret = true;
				}
			}

		}

		return ret;
	}

	//Reset Sender trending action - for bug #139986
	EmailJunkPane.prototype.handleResetClick = function(e){
		var p=new ResourcePost();
		p.param("gds","1");
		p.param("unm",user_prefs["user_name"]);
		p.param("sid",user_prefs["session_id"]);
		p.param("opts","11");
		ResourceManager.request("/cgi-bin/emailSetOptions.cgi?"+p.toString(), 1, undefined);
	}

	// Inherit the preference pane class
	EmailJunkPane.inherit(FormPreferencePane);

	// Register this pane with the application
	Application.getApplicationById(1007).registerPreferencePane(new EmailJunkPane());

/*
	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% EmailSpellCheckPane %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
	/**
	 *	EmailSpellCheckPane
	 *	This class provides a demo of how to construct a preference pane
	 *
	 *	@constructor
	 */
	function EmailSpellCheckPane() {
		this.superFormPreferencePane("Spell Check Options", "Set up your settings for email spell check, and edit your custom user dictionary.");

		this.i_inputs = {};

		// Handle initialization		
		EventHandler.register(this, "onload", this.handleLoad, this);
	}

	/**
	 *	Get the form object used in this pane
	 *
	 *	@return the form object used by this pane
	 */
	EmailSpellCheckPane.prototype.getForm = function() {
		if(!this.i_form) {
			this.i_form = new UniversalForm(450, 175);

				var section = this.i_form.addSection(new UniversalFormSection());

					this.i_inputs.dictionary = new UniversalOptionBoxInput("Dictionary", "", [
						new UniversalOptionBoxOption("American English", "1"),
						new UniversalOptionBoxOption("Canadian English", "2"),
						new UniversalOptionBoxOption("UK English", "3"),
						new UniversalOptionBoxOption("Australian English", "4")
					]);
					section.addRow(new UniversalFormRow(this.i_inputs.dictionary));

					this.i_inputs.user_dictionary = new UniversalAddRemoveListInput("User dictionary", "", []);
					section.addRow(new UniversalFormRow(this.i_inputs.user_dictionary));

					this.i_inputs.ignore_capitalized = new UniversalCheckBoxOption("Ignore capitalized words (e.g., Canada)", "ignore_capitalized");
					this.i_inputs.ignore_all_caps = new UniversalCheckBoxOption("Ignore all-caps words (e.g., ASAP)", "ignore_all_caps");
					this.i_inputs.ignore_numbers = new UniversalCheckBoxOption("Ignore words with numbers (e.g., Win98)", "ignore_numbers");
					this.i_inputs.ignore_mixed_case = new UniversalCheckBoxOption("Ignore words with mixed case (e.g., SuperBase)", "ignore_mixed_case");
					this.i_inputs.ignore_domains = new UniversalCheckBoxOption("Ignore domain names (e.g., xyz.com)", "ignore_domains");
					this.i_inputs.ignore_html = new UniversalCheckBoxOption("Ignore HTML", "ignore_html");
					this.i_inputs.check_double = new UniversalCheckBoxOption("Report doubled words (e.g., the the)", "check_double");
					this.i_inputs.case_sensitive = new UniversalCheckBoxOption("Case sensitive", "case_sensitive");
					this.i_inputs.suggest_split = new UniversalCheckBoxOption("Suggest split words", "suggest_split");

					var options = new UniversalCheckBoxInput("Options", "", "100%", [
						this.i_inputs.ignore_capitalized,
						this.i_inputs.ignore_all_caps,
						this.i_inputs.ignore_numbers,
						this.i_inputs.ignore_mixed_case,
						this.i_inputs.ignore_domains,
						this.i_inputs.ignore_html,
						this.i_inputs.check_double,
						this.i_inputs.case_sensitive,
						this.i_inputs.suggest_split
					]);
					section.addRow(new UniversalFormRow(options));

			this.i_form.clearModified();
		}

		return this.i_form;
	}

	/**
	 *	Handle when this settings pane is loaded for the first time.
	 *
	 *	@private
	 *
	 *	@param e The event that triggered this
	 */
	EmailSpellCheckPane.prototype.handleLoad = function(e) {
		var params = new DataNode("params");

		var request = new RequestObject("email", "getEmailPrefSpell", params);
		EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
		EventHandler.register(request, "onerror", this.handleLoadError, this);

		request.execute();
	}

	/**
	 *	Handle the preferences being loaded from the server.
	 *
	 *	@private
	 *
	 *	@param e The event that triggered this
	 */
	EmailSpellCheckPane.prototype.handleLoadPreferences = function(e) {
		var data = e.response.data();
		//TODO
		//<optSpell dict="10000" ignCap="0" ignAllCap="1" ignNum="1" ignMixed="0" ignDomain="1" ignHtml="1"
		//checkDouble="1" caseSens="1" suggestSplit="1"><customDict><![CDATA[]]></customDict></optSpell>

		var spell_data = data.xPath("optSpell")[0];
	
		this.i_inputs.dictionary.value(spell_data.attribute("dict") / 10000);
		this.i_inputs.ignore_capitalized.checked(spell_data.attribute("ignCap"));
		this.i_inputs.ignore_all_caps.checked(spell_data.attribute("ignAllCap"));
		this.i_inputs.ignore_numbers.checked(spell_data.attribute("ignNum"));
		this.i_inputs.ignore_mixed_case.checked(spell_data.attribute("ignMixed"));
		this.i_inputs.ignore_domains.checked(spell_data.attribute("ignDomain"));
		this.i_inputs.ignore_html.checked(spell_data.attribute("ignHtml"));
		this.i_inputs.check_double.checked(spell_data.attribute("checkDouble"));
		this.i_inputs.case_sensitive.checked(spell_data.attribute("caseSens"));
		this.i_inputs.suggest_split.checked(spell_data.attribute("suggestSplit"));

		var dictEntries = data.xPath("optSpell/customDict",true);
		if(dictEntries) {
			var dictArray = dictEntries.split(",");
			for(var i = 0; i < dictArray.length; i++){
				this.i_inputs.user_dictionary.addOption(new UniversalOptionBoxOption(dictArray[i],dictArray[i]));
			}
		}
	
		this.updateDefault();
		this.loaded(true);
	}
	
	/**
	 *	Save the values in this form to a request object and return it
	 *
	 *	@return a request object which can be issued to save the results of this pane
	 */
	EmailSpellCheckPane.prototype.save = function() {
		//TODO
		var params = new DataNode("params");
		params.addNode(new DataNode("dict", this.i_inputs.dictionary.value() * 10000));
		params.addNode(new DataNode("customDictAdd", this.i_inputs.user_dictionary.addedOptionValues().join(",")));
		params.addNode(new DataNode("customDictDel", this.i_inputs.user_dictionary.removedOptionValues().join(",")));
		params.addNode(new DataNode("ignCap", (this.i_inputs.ignore_capitalized.checked()) ? "1" : "0"));
		params.addNode(new DataNode("ignAllCap", (this.i_inputs.ignore_all_caps.checked()) ? "1" : "0"));
		params.addNode(new DataNode("ignNum", (this.i_inputs.ignore_numbers.checked()) ? "1" : "0"));
		params.addNode(new DataNode("ignMixed", (this.i_inputs.ignore_mixed_case.checked()) ? "1" : "0"));
		params.addNode(new DataNode("ignDomain", (this.i_inputs.ignore_domains.checked()) ? "1" : "0"));
		params.addNode(new DataNode("ignHtml", (this.i_inputs.ignore_html.checked()) ? "1" : "0"));
		params.addNode(new DataNode("checkDouble", (this.i_inputs.check_double.checked()) ? "1" : "0"));
		params.addNode(new DataNode("caseSens", (this.i_inputs.case_sensitive.checked()) ? "1" : "0"));
		params.addNode(new DataNode("suggestSplit", (this.i_inputs.suggest_split.checked()) ? "1" : "0"));

		var request = new RequestObject("email","setEmailPrefSpell",params);
		return request;
	}

	// Inherit the preference pane class
	EmailSpellCheckPane.inherit(FormPreferencePane);

	// Register this pane with the application
	Application.getApplicationById(1007).registerPreferencePane(new EmailSpellCheckPane());

/*
	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% EmailFiltersPane %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
	/**
	 *	EmailFiltersPane
	 *	This class provides a demo of how to construct a preference pane
	 *
	 *	@constructor
	 */
	function EmailFiltersPane() {
		this.superFormPreferencePane("Message Filters", "Filter your incoming email messages.");

		this.i_inputs = {};

		this.i_dialog = new MessageFilterDialog(this);
		this.i_filters = [];

		// Handle initialization		
		EventHandler.register(this, "onload", this.handleLoad, this);
	}

	/**
	 *	Get the form object used in this pane
	 *
	 *	@return the form object used by this pane
	 */
	EmailFiltersPane.prototype.getForm = function() {
		if(!this.i_form) {
			this.i_form = new UniversalForm(450, 110);

				var section = this.i_form.addSection(new UniversalFormSection());

					this.i_inputs.filters = new UniversalSortedEditListInput("Message filters", "");
					EventHandler.register(this.i_inputs.filters, "onadd", this.handleAdd, this);
					EventHandler.register(this.i_inputs.filters, "onedit", this.handleEdit, this);
					EventHandler.register(this.i_inputs.filters, "onselect", this.handleSelect, this);
					section.addRow(new UniversalFormRow(this.i_inputs.filters));

			this.i_form.clearModified();
		}

		return this.i_form;
	}

	/**
	 *	Handle when this settings pane is loaded for the first time.
	 *
	 *	@private
	 *
	 *	@param e The event that triggered this
	 */
	EmailFiltersPane.prototype.handleLoad = function(e) {
		var params = new DataNode("params");

		var request = new RequestObject("email", "getEmailPrefFilter", params);
		EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
		EventHandler.register(request, "onerror", this.handleLoadError, this);

		request.execute();
	}

	/**
	 *	Handle the preferences being loaded from the server.
	 *
	 *	@private
	 *
	 *	@param e The event that triggered this
	 */
	EmailFiltersPane.prototype.handleLoadPreferences = function(e) {
		var data = e.response.data();

		// Read the filters into an array of objects.
		var filters = [];
		var filters_data = data.xPath("optContent/contentFilter");
		for(var i = 0; i < filters_data.length; i++) {
			filters.push(new MessageFilter(filters_data[i]));
		}

		// Sort the filters by priority.
		filters.sort(MessageFilter.priorityOrderFunc);

		// Create options for each filter.
		for(var i = 0; i < filters.length; i++) {
			this.i_inputs.filters.addOption(new UniversalOptionBoxOption(filters[i].name(), filters[i]));
		}

		this.updateDefault();
		this.loaded(true);
	}

	/**
	 *	Save the values in this form to a request object and return it
	 *
	 *	@return a request object which can be issued to save the results of this pane
	 */
	EmailFiltersPane.prototype.save = function() {
		this.i_save_requests = [];

		var filters = this.i_inputs.filters.optionValues();
		for(var i = 0; i < filters.length; i++) {
			var filter = filters[i];

			var params = new DataNode("params");
			params.addNode(new DataNode("id", filter.id()));
			params.addNode(new DataNode("filterName", filter.name()));
			params.addNode(new DataNode("filterType", filter.type()));
			params.addNode(new DataNode("select1", filter.matchType()));
			params.addNode(new DataNode("select2", filter.matchType()));
			params.addNode(new DataNode("select3", filter.matchType()));
			params.addNode(new DataNode("select4", filter.matchType()));
			params.addNode(new DataNode("select6", filter.matchType()));
			params.addNode(new DataNode("reloadurl", ""));
			params.addNode(new DataNode("prevUri", ""));
			params.addNode(new DataNode("delete", "0"));

			var filter_data = new DataNode("filterData", filter.matchValue());
			if(parseInt(filter.type()) != 5 && filter_data.value()) {
				filter_data.value("\\<" + filter_data.value() + "\\>");
			}

			params.addNode(filter_data);

			var filter_action_type = new DataNode("filterActionType");
			var filter_action = new DataNode("filterAction");
			// Fix for #142967:  Instead of relying only on "folder" we need to take into account the possibility of the 
			// action type being a string numeric value as well.  Values of 1 or 3 still indicate a folder-related action.
			if(filter.actionType() == "folder" || filter.actionType() == "1" || filter.actionType() == "3") {
				// Sometimes the folderActionType can come through as undefined.  In those instances, the actionType is carrying
				// a string numeric value of 1 or 3, so we can use that in place of the folderActionType.
				if( filter.folderActionType() == undefined ) {
					filter_action_type.value(filter.actionType());
				} else {
					filter_action_type.value(filter.folderActionType());
				}
				filter_action.value(filter.folderID());
			} else {
				filter_action_type.value(filter.actionType());
				filter_action.value(filter.actionDisplay());
			}

			params.addNode(filter_action_type);
			params.addNode(filter_action);

			var request = new RequestObject("email", "setEmailPrefFilter", params);
			request.filter = filter;
			EventHandler.register(request, "oncomplete", this.handleSaveRequest, this);

			this.i_save_requests.push(request);
		}

		// Normally, we wait to save the priorities until all of the individual
		// filters have saved and we've received their IDs back. However, if
if(filters.length==0) {
this.savePriorities();
}
return this.i_save_requests;
}
EmailFiltersPane.prototype.handleSaveRequest=function(e) {
var data=e.response.data();
for(var i=this.i_save_requests.length; i >=0; i--) {
var request=e.request;
if(this.i_save_requests[i]==request) {
var filter=request.filter;
var id=data.xPath("id", true);
if(id) {
filter.setId(id);
}
this.i_save_requests.splice(i, 1);
if(this.i_save_requests.length==0) {
this.savePriorities();
}
break;
}
}
}
EmailFiltersPane.prototype.savePriorities=function() {
var priority_list=[];
var filters=this.i_inputs.filters.optionValues();
var send_request=true;
for(var j=0; j < filters.length; j++) {
var id=filters[j].id();
if(id=="new") {
send_request=false;
break;
}
priority_list.push(filters[j].id());
}
if(send_request) {
var params=new DataNode("params");
params.addNode(new DataNode("priorityList", (priority_list.length==0) ? "empty" : priority_list.join(";")));
var request=new RequestObject("email", "setEmailPrefFilter", params);
EventHandler.register(request, "oncomplete", this.handleSavePriorities, this);
request.execute();
}
}
EmailFiltersPane.prototype.handleSavePriorities=function(e) {
}
EmailFiltersPane.prototype.storeFilter=function(filter) {
if(filter.id()=="new") {
var add=true;
for(var i=0; i < this.i_filters.length; i++) {
if(filter==this.i_filters[i]) {
add=false;
}
}
if(add) {
this.i_filters.push(filter);
this.i_inputs.filters.addOption(new UniversalOptionBoxOption(filter.name(), filter));
}
}
var options=this.i_inputs.filters.options();
for(i=0; i < options.length; i++) {
if(options[i].value()==filter) {
options[i].name(filter.name());
}
}
var selected_option=this.i_inputs.filters.selectedOption();
if(selected_option && filter==selected_option.value()) {
this.updateInfo(filter);
}
}
EmailFiltersPane.prototype.handleAdd=function(e) {
this.i_dialog.open();
}
EmailFiltersPane.prototype.handleEdit=function(e) {
if(e.option) {
this.i_dialog.open(e.option.value());
}
}
EmailFiltersPane.prototype.handleSelect=function(e) {
if(e.option) {
this.updateInfo(e.option.value());
}
}
EmailFiltersPane.prototype.updateInfo=function(filter) {
var info=this.i_inputs.filters.infoContainer();
var description="<b>If:<br>";
switch (filter.type()) {
case "1":
description+="From address";
break;
case "2":
description+="Sender name";
break;
case "3":
description+="Subject";
break;
case "4":
description+="Message body";
break;
case "5":
description+="Virus-infected attachment(s) removed";
break;
case "6":
description+="To address";
break;
default:
return;
}
if (filter.type()!="5") {
description+=" contains ";
switch (filter.matchType()) {
case "exact":
description+="the exact word/phrase";
break;
case "substr":
case "substring":
description+="a string matching";
break;
default:
return;
}
description+=":</b> \'"+filter.matchValue()+"\'<b>";
}
description+="<br><br>Then:<br>";
switch(filter.actionType()) {
case "folder":
case "1":
case "3":
if(filter.folderActionType()=="1") {
description+="Copy to the folder";
} else {
description+="Move to the folder";
}
break;
case "2":
description+="Forward to the address";
break;
default:
return;
}
description+=":</b> "+filter.actionDisplay();
info.innerHTML=description;
}
EmailFiltersPane.inherit(FormPreferencePane);
Application.getApplicationById(1007).registerPreferencePane(new EmailFiltersPane());
function EmailOutOfOfficePane() {
this.superFormPreferencePane("Out of Office Message", "Edit and schedule your out of office message.");
this.i_inputs={};
this.i_sections={};
this.i_rules={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
EmailOutOfOfficePane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 175);
var section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.enable=new UniversalRadioInput("Enable out of office message", "", "100%", [new UniversalRadioOption("Yes", "1"),
new UniversalRadioOption("No", "0")]);
this.i_inputs.enable.columns(2);
EventHandler.register(this.i_inputs.enable, "onchange", this.handleEnableChange, this);
section.addRow(new UniversalFormRow(this.i_inputs.enable));
this.i_sections.schedule=this.i_form.addSection(new UniversalFormSection("Schedule"));
this.i_inputs.start=new UniversalRadioInput("Start", "", "100%", [new UniversalRadioOption("Start on:", "1"),
new UniversalRadioOption("Start now", "0")]);
EventHandler.register(this.i_inputs.start, "onchange", this.handleStartChange, this);
this.i_inputs.start_date=new UniversalDateInput("", "", 140);
this.i_sections.schedule.addRow(new UniversalFormRow(this.i_inputs.start, this.i_inputs.start_date));
this.i_inputs.end=new UniversalRadioInput("End", "", "100%", [new UniversalRadioOption("End on:", "1"),
new UniversalRadioOption("Continue indefinitely", "0")]);
EventHandler.register(this.i_inputs.end, "onchange", this.handleEndChange, this);
this.i_inputs.end_date=new UniversalDateInput("", "", 140);
this.i_sections.schedule.addRow(new UniversalFormRow(this.i_inputs.end, this.i_inputs.end_date));
this.i_sections.message=this.i_form.addSection(new UniversalFormSection("Message"));
this.i_inputs.subject=new UniversalTextInput("Subject", "");
this.i_sections.message.addRow(new UniversalFormRow(this.i_inputs.subject));
var reset_subj_button=new UniversalButton("Reset Subject", undefined, undefined, undefined, 
true, 22, undefined, "Reset the message subject back to the default.");
EventHandler.register(reset_subj_button, "onclick", 
this.handleResetSubjectClick, this);
this.i_sections.message.addRow(new UniversalFormRow(new UniversalButtonInput(reset_subj_button)));
this.i_inputs.body=new UniversalTextAreaInput("Body", "", "100%", 87);
this.i_sections.message.addRow(new UniversalFormRow(this.i_inputs.body));
var reset_body_button=new UniversalButton("Reset Body", undefined, undefined, undefined, 
true, 22, undefined, "Reset the message body back to the default.");
EventHandler.register(reset_body_button, "onclick",
this.handleResetBodyClick, this);
this.i_sections.message.addRow(new UniversalFormRow(new UniversalButtonInput(reset_body_button)));
this.i_form.clearModified();
this.i_form.removeSection(this.i_sections.schedule);
this.i_form.removeSection(this.i_sections.message);
}
return this.i_form;
}
EmailOutOfOfficePane.prototype.handleResetSubjectClick=function(e) {
this.i_inputs.subject.value('Out of Office Reply: $SUBJECT');
}
EmailOutOfOfficePane.prototype.handleResetBodyClick=function(e) {
this.i_inputs.body.value('I am currently out of the office and will not be '+'checking e-mail.\n\nI will reply to your message as soon as I return.');
}
EmailOutOfOfficePane.prototype.handleEnableChange=function(e) {
if(this.i_inputs.enable.value()=="1") {
this.i_form.addSection(this.i_sections.schedule);
this.i_form.addSection(this.i_sections.message);
this.i_inputs.subject.required(true, "Please specify the out of office message subject.");
this.i_inputs.body.required(true, "Please specify the out of office message body.");
} else {
this.i_form.removeSection(this.i_sections.schedule);
this.i_form.removeSection(this.i_sections.message);
this.i_inputs.subject.required(false);
this.i_inputs.body.required(false);
}
}
EmailOutOfOfficePane.prototype.handleStartChange=function(e) {
if(this.i_inputs.start.value()=="1") {
this.i_rules.start_date=this.i_inputs.start_date.addValidationRule(new FutureDateValidationRule("Invalid start date. Please set the start date for the out of offices messages in the future."));
if(this.i_inputs.end.value()=="1" && !this.i_rules.date_logic) {
this.i_rules.date_logic=this.i_inputs.start_date.addValidationRule(new BeforeDateValidationRule(this.i_inputs.end_date, "Please specify an end date for the out of office message that is after the start date."));
}
} else {
this.i_inputs.start_date.removeValidationRule(this.i_rules.start_date);
this.i_rules.start_date=undefined;
if(this.i_rules.date_logic) {
this.i_inputs.start_date.removeValidationRule(this.i_rules.date_logic);
this.i_rules.date_logic=undefined;
}
}
}
EmailOutOfOfficePane.prototype.handleEndChange=function(e) {
if(this.i_inputs.end.value()=="1") {
this.i_rules.end_date=this.i_inputs.end_date.addValidationRule(new FutureDateValidationRule("Invalid end date. Please set the end date for the out of offices messages in the future."));
if(this.i_inputs.start.value()=="1" && !this.i_rules.date_logic) {
this.i_rules.date_logic=this.i_inputs.start_date.addValidationRule(new BeforeDateValidationRule(this.i_inputs.end_date, "Please specify an end date for the out of office message that is after the start date."));
}
} else {
this.i_inputs.end_date.removeValidationRule(this.i_rules.end_date);
this.i_rules.end_date=undefined;
if(this.i_rules.date_logic) {
this.i_inputs.start_date.removeValidationRule(this.i_rules.date_logic);
this.i_rules.date_logic=undefined;
}
}
}
EmailOutOfOfficePane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
var request=new RequestObject("email", "getEmailPrefVacation", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
EventHandler.register(request, "onerror", this.handleLoadError, this);
request.execute();
}
EmailOutOfOfficePane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var vacation_data=data.xPath("optVac")[0];
this.i_inputs.enable.value(vacation_data.attribute("isOn"));
this.i_inputs.subject.value(vacation_data.xPath("recSubject",true));
this.i_inputs.body.value(vacation_data.xPath("recBody",true));
var start=vacation_data.xPath("recStart", true);
if(start=="" || start=="//") {
this.i_inputs.start.value("0");
var tomorrow=new Date();
tomorrow.setTime(tomorrow.getTime()+(60 * 60 * 24 * 1000));
this.i_inputs.start_date.value(tomorrow);
} else {
this.i_inputs.start.value("1");
this.i_inputs.start_date.value(start);
}
var end=vacation_data.xPath("recEnd", true);
if(end=="" || end=="//") {
this.i_inputs.end.value("0");
var next_week=new Date();
next_week.setTime(next_week.getTime()+(60 * 60 * 24 * 7 * 1000));
this.i_inputs.end_date.value(next_week);
} else {
this.i_inputs.end.value("1");
this.i_inputs.end_date.value(end);
}
this.updateDefault();
this.loaded(true);
}
EmailOutOfOfficePane.prototype.save=function() {
var params=new DataNode("params");
params.addNode(new DataNode("isOn",this.i_inputs.enable.value()));
params.addNode(new DataNode("recSubject",this.i_inputs.subject.value()));
params.addNode(new DataNode("recBody",this.i_inputs.body.value()));
if(this.i_inputs.start.value()=="1"){
var startDate=this.i_inputs.start_date.value();
params.addNode(new DataNode("startDateMonth",startDate.formatDate('m')));
params.addNode(new DataNode("startDateDay",startDate.formatDate("d")));
params.addNode(new DataNode("startDateYear",startDate.formatDate('Y')));
}
if(this.i_inputs.end.value()=="1"){
var endDate=this.i_inputs.end_date.value();
params.addNode(new DataNode("endDateMonth",endDate.formatDate('m')));
params.addNode(new DataNode("endDateDay",endDate.formatDate('d')));
params.addNode(new DataNode("endDateYear", endDate.formatDate('Y')));
}
if(ApplicationEmail) {
var prefs=ApplicationEmail.i_preferences;
prefs.oom_enabled(this.i_inputs.enable.value());
prefs.oom_subject(this.i_inputs.subject.value());
prefs.oom_body(this.i_inputs.body.value());
if(this.i_inputs.start.value()=="1") {
prefs.oom_start_date(this.i_inputs.start_date.value());
} else {
prefs.oom_start_date('');
}
if(this.i_inputs.end.value()=="1") {
prefs.oom_end_date(this.i_inputs.end_date.value());
} else {
prefs.oom_end_date('');
}
}
var request=new RequestObject("email","setEmailPrefVacation",params);
return request;
}
EmailOutOfOfficePane.inherit(FormPreferencePane);
Application.getApplicationById(1007).registerPreferencePane(new EmailOutOfOfficePane());
function EmailForwardingPane() {
this.superFormPreferencePane("Forwarding", "Forward all of your incoming messages to another email address.");
this.i_inputs={};
this.i_sections={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
EmailForwardingPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 175);
var section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.enable=new UniversalRadioInput("Forward emails to another address", "", "100%", [new UniversalRadioOption("Yes", "1"),
new UniversalRadioOption("No", "0")]);
this.i_inputs.enable.columns(2);
EventHandler.register(this.i_inputs.enable, "onchange", this.handleEnableChange, this);
section.addRow(new UniversalFormRow(this.i_inputs.enable));
this.i_sections.delivery=this.i_form.addSection(new UniversalFormSection("Delivery"));
this.i_inputs.address=new UniversalTextInput("Forward emails to this address", "");
this.i_sections.delivery.addRow(new UniversalFormRow(this.i_inputs.address));
this.i_inputs.save_local=new UniversalCheckBoxOption("Save local copy", "1");
this.i_sections.delivery.addRow(new UniversalFormRow(new UniversalCheckBoxInput("", "NOTE: Your out of office message can only be sent if \"Save local copy\" is turned on.", "100%",
this.i_inputs.save_local)));
this.i_form.clearModified();
this.i_form.removeSection(this.i_sections.delivery);
}
return this.i_form;
}
EmailForwardingPane.prototype.handleEnableChange=function(e) {
if(this.i_inputs.enable.value()=="1") {
this.i_form.addSection(this.i_sections.delivery);
this.i_inputs.address.required(true, "Please specify the out of office message subject.");
} else {
this.i_form.removeSection(this.i_sections.delivery);
this.i_inputs.address.required(false);
}
}
EmailForwardingPane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
var request=new RequestObject("email", "getEmailPrefForward", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
EventHandler.register(request, "onerror", this.handleLoadError, this);
request.execute();
}
EmailForwardingPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var forwarding_data=data.xPath("optForwarding")[0];
this.i_inputs.enable.value(forwarding_data.attribute("isEnabled"));
this.i_inputs.address.value(forwarding_data.xPath("forwardAddress", true));
this.i_inputs.save_local.checked(forwarding_data.attribute("deliverBlueTieCopy"));
this.updateDefault();
this.loaded(true);
}
EmailForwardingPane.prototype.save=function() {
var params=new DataNode("params");
params.addNode(new DataNode("isEnabled", this.i_inputs.enable.value()));
params.addNode(new DataNode("forwardAddress", this.i_inputs.address.value()));
params.addNode(new DataNode("deliverBlueTieCopy", (this.i_inputs.save_local.checked()) ? "1" : "0"));
if(ApplicationEmail) {
var prefs=ApplicationEmail.i_preferences;
prefs.forward_enabled(this.i_inputs.enable.value());
prefs.forward_address(this.i_inputs.address.value());
prefs.forward_save_copy(this.i_inputs.save_local.checked() ? "1" : "0");
}
var request=new RequestObject("email","setEmailPrefForward",params);
if(this.i_inputs.enable.value()=="0") {
this.i_inputs.address.value("");
}
return request;
}
EmailForwardingPane.inherit(FormPreferencePane);
if(user_prefs["access_email_forward"]=="True") {
Application.getApplicationById(1007).registerPreferencePane(new EmailForwardingPane());
}
JavaScriptResource.notifyComplete("./src/Applications/Email/Preference.Email.js");
JavaScriptResource.notifyComplete("./btAppEmailPreferences.js");
