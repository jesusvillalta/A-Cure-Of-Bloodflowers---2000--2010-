function ContactsGeneralPane() {
this.superFormPreferencePane("General Settings", "Edit general contact settings.");
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
ContactsGeneralPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 200);
var section=this.i_form.addSection(new UniversalFormSection("Viewing Contacts"));
this.i_inputs.display=new UniversalOptionBoxInput("Number of contacts per page", "", [new UniversalOptionBoxOption("20", "20"),
new UniversalOptionBoxOption("50", "50"),
new UniversalOptionBoxOption("100", "100")]);
section.addRow(new UniversalFormRow(this.i_inputs.display));
this.i_inputs.preview=new UniversalRadioInput("Preview pane", "", "100%", [new UniversalRadioOption("Off", "off"),
new UniversalRadioOption("On", "on")]);
this.i_inputs.preview.columns(2);
section.addRow(new UniversalFormRow(this.i_inputs.preview));
this.i_form.clearModified();
this.i_inputs.display.addValidationRule(new NumericRangeValidationRule(10, 100, "The number of contacts to display must a number between 10 and 100."));
}
return this.i_form;
}
ContactsGeneralPane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
params.addNode(new DataNode("caller", user_prefs["user_name"]));
params.addNode(new DataNode("owner", user_prefs["user_name"]));
params.addNode(new DataNode("method", "GetPreferences"));
var request=new RequestObject("contacts", "GetPreferences", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
request.execute();
}
ContactsGeneralPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
this.i_all_enterprise_online=data.xPath("prefs/AllEnterpriseOnline", true);
this.i_inputs.display.value(data.xPath("prefs/displayNum", true));
this.i_inputs.preview.value(data.xPath("prefs/previewStatus", true));
this.updateDefault();
this.loaded(true);
}
ContactsGeneralPane.prototype.save=function() {
var params=new DataNode("params");
params.addNode(new DataNode("caller", user_prefs["user_name"]));
params.addNode(new DataNode("owner", user_prefs["user_name"]));
params.addNode(new DataNode("method", "ReplacePreferences"));
var prefs=new DataNode("prefs");
prefs.addNode(new DataNode("displayNum", this.i_inputs.display.value()));
prefs.addNode(new DataNode("previewStatus", this.i_inputs.preview.value()));
prefs.addNode(new DataNode("AllEnterpriseOnline", this.i_all_enterprise_online));
params.addNode(prefs);
var request=new RequestObject("contacts", "ReplacePreferences", params);
return request;
}
ContactsGeneralPane.inherit(FormPreferencePane);
Application.getApplicationById(2005).registerPreferencePane(new ContactsGeneralPane());
function EmailAddressingOptionsPane() {
this.superFormPreferencePane("Save New Addresses", "Edit these options.");
this.i_sections={};
this.i_rows={};
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
EventHandler.register(this, "onshow", this.handleLoad, this);
}
EmailAddressingOptionsPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 200);
this.i_sections.general=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.autopopulate_enable=new UniversalRadioInput("Check sent mail for new addresses", "", "100%", [new UniversalRadioOption("Yes", "true"),
new UniversalRadioOption("No", "false")]);
this.i_inputs.autopopulate_enable.columns(2);
EventHandler.register(this.i_inputs.autopopulate_enable, "onchange", this.handleAutopopulateEnableChange, this);
this.i_sections.general.addRow(new UniversalFormRow(this.i_inputs.autopopulate_enable));
this.i_inputs.autopopulate_group=new UniversalOptionBoxInput("Save new addresses in", "", [new UniversalOptionBoxOption("Ask me each time", ""),
new UniversalOptionBoxOption("My Contacts", "My Contacts")]);
this.i_rows.autopopulate_group=new UniversalFormRow(this.i_inputs.autopopulate_group);
this.i_form.clearModified();
}
return this.i_form;
}
EmailAddressingOptionsPane.prototype.handleAutopopulateEnableChange=function(e) {
if(this.i_inputs.autopopulate_enable.value()=="true") {
this.i_sections.general.addRow(this.i_rows.autopopulate_group);
} else {
this.i_sections.general.removeRow(this.i_rows.autopopulate_group);
}
}
EmailAddressingOptionsPane.prototype.handleLoad=function(e) {
ApplicationOldContacts.getAutoCompleteSettings(this.handleLoadPreferences, this);
}
EmailAddressingOptionsPane.prototype.handleLoadPreferences=function(settings) {
var groups=SimpleClickDataCache.getSortedGroupList("personal");
for(var i=0; i < groups.length; i++) {
this.i_inputs.autopopulate_group.addOption(new UniversalOptionBoxOption(groups[i].name, groups[i].uuid));
}
this.i_inputs.autopopulate_enable.value(settings.autopopulate_enabled);
if(settings.autopopulate_auto=="true") {
this.i_inputs.autopopulate_group.value(settings.autopopulate_group);
} else {
this.i_inputs.autopopulate_group.value("");
}
this.updateDefault();
this.loaded(true);
}
EmailAddressingOptionsPane.prototype.save=function() {
var settings={
"autopopulate_enabled": this.i_inputs.autopopulate_enable.value(),
"autopopulate_auto": (this.i_inputs.autopopulate_group.value()=="") ? "false" : "true",
"autopopulate_group":(this.i_inputs.autopopulate_group.value())
};
if(settings.autopopulate_enabled=="false") {
settings.autopopulate_auto="false";
settings.autopopulate_group="";
}
ApplicationOldContacts.saveAutoCompleteSettings(settings);
this.updateDefault();
}
EmailAddressingOptionsPane.inherit(FormPreferencePane);
Application.getApplicationById(2005).registerPreferencePane(new EmailAddressingOptionsPane());
JavaScriptResource.notifyComplete("./src/Applications/OldContacts/Preference.OldContacts.js");
JavaScriptResource.notifyComplete("./btAppOContactsPreferences.js");
