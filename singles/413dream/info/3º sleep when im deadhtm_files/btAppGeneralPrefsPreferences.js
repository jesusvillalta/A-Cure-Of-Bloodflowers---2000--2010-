function PasswordValidationRule(new_password, new_password_confirm) {
this.i_new_password=new_password;
this.i_new_password_confirm=new_password_confirm;
this.superConstructor();
}
PasswordValidationRule.prototype.validate=function(input) {
var old_password=input.value();
var new_password=this.i_new_password.value();
var new_password_confirm=this.i_new_password_confirm.value();
if(old_password || new_password || new_password_confirm) {
if(!old_password) {
this.message("You must enter your password to update your security settings.");
return false;
}
if(!new_password) {
this.message("You must enter a new password to update your security settings.");
return false;
}
if(!new_password_confirm) {
this.message("You must re-enter the new password to update your security settings.");
return false;
}
if(new_password!=new_password_confirm) {
this.message("Passwords do not match.");
return false;
}
if(new_password==old_password) {
this.message("The new password is the same as current password.");
return false;
}
}
return true;
}
PasswordValidationRule.inherit(ValidationRule);
function GeneralSecurityPane() {
this.superFormPreferencePane("Security Settings", "Change your password and other security settings.");
this.i_inputs={};
this.i_wizard_path="/Ioffice/Common/wizard.asp";
this.i_wizard_url="https://"+window.location.hostname+this.i_wizard_path;
GeneralSecurityPane.obj=this;
EventHandler.register(this, "onload", this.handleLoad, this);
}
GeneralSecurityPane.prototype.handleLoad=function(e) {
var params=new DataNode("request");
params.addNode(new DataNode("req_id", "sq"));
var url_params="?xml="+params.toXML(false, true);
ResourceManager.request(this.i_wizard_path+url_params, 1, GeneralSecurityPane.handleLoadQuestions);
}
GeneralSecurityPane.handleLoadQuestions=function(data, xml, req, params) {
var questions=xml.getElementsByTagName("question");
for(var i=0; i < questions.length; i++){
var id=getXMLValue(questions[i], "qid");
var question=getXMLValue(questions[i], "txt");
GeneralSecurityPane.obj.i_inputs.secret_question.addOption(new UniversalOptionBoxOption(question, id));
}
var params=new DataNode("request");
params.addNode(new DataNode("req_id", "usrsec"));
params.addNode(new DataNode("userid", user_prefs["user_id"]));
var url_params="?xml="+params.toXML(false, true);
ResourceManager.request(GeneralSecurityPane.obj.i_wizard_path+url_params, 1, GeneralSecurityPane.handleLoadPreferences);
}
GeneralSecurityPane.handleLoadPreferences=function(data, xml, req, params) {
GeneralSecurityPane.obj.i_inputs.timeout.value(getXMLValue(xml, "idle_time"));
GeneralSecurityPane.obj.i_inputs.secret_question.value(getXMLValue(xml, "question_id"));
GeneralSecurityPane.obj.i_inputs.secret_answer.value(getXMLValue(xml, "answer"));
if(getXMLValue(xml, "idle_time_lock")=="1") {
GeneralSecurityPane.obj.i_inputs.timeout.name("Locked by manager (in minutes)");
GeneralSecurityPane.obj.i_inputs.timeout.enabled(false);
}
GeneralSecurityPane.obj.updateDefault();
GeneralSecurityPane.obj.loaded(true);
}
GeneralSecurityPane.prototype.getForm=function() {
if (this.i_form==undefined) {
this.i_form=new UniversalForm(450, 200);
if (user_prefs["password_lock"]=="0") {
var section=this.i_form.addSection(new UniversalFormSection("Change Password"));
this.i_inputs.old_password=new UniversalTextInput("Old password", "");
this.i_inputs.old_password.masked(true);
section.addRow(new UniversalFormRow(this.i_inputs.old_password));
this.i_inputs.new_password=new UniversalTextInput("New password", "");
this.i_inputs.new_password.masked(true);
section.addRow(new UniversalFormRow(this.i_inputs.new_password));
this.i_inputs.new_password_confirm=new UniversalTextInput("Confirm new password", "Your password must be at least 6 characters long.  Make sure it is difficult for others to guess.");
this.i_inputs.new_password_confirm.masked(true);
section.addRow(new UniversalFormRow(this.i_inputs.new_password_confirm));
}
section=this.i_form.addSection(new UniversalFormSection("Session Timeout"));
this.i_inputs.timeout=new UniversalTextInput("Idle session timeout (in minutes)", "You will be automatically logged off if your account is inactive for the amount of time specified here.");
section.addRow(new UniversalFormRow(this.i_inputs.timeout));
section=this.i_form.addSection(new UniversalFormSection("Secret Question/Answer"));
this.i_inputs.secret_question=new UniversalOptionBoxInput("Secret question", "", []);
section.addRow(new UniversalFormRow(this.i_inputs.secret_question));
this.i_inputs.secret_answer=new UniversalTextInput("Secret answer", "");
section.addRow(new UniversalFormRow(this.i_inputs.secret_answer));
this.i_form.clearModified();
if (user_prefs["password_lock"]=="0") {
this.i_inputs.old_password.addValidationRule(new PasswordValidationRule(this.i_inputs.new_password, this.i_inputs.new_password_confirm));
}
this.i_inputs.timeout.addValidationRule(new NumericRangeValidationRule(1, 999, "Idle time value must be a number between 1 and 999."));
this.i_inputs.secret_answer.required(true, "You must provide an answer to the secret question.");
}
return this.i_form;
}
GeneralSecurityPane.prototype.save=function() {
var old_password="";
var new_password="";
if (user_prefs["password_lock"]=="0") {
old_password=(this.i_inputs.old_password) ? this.i_inputs.old_password.value() : "";
new_password=(this.i_inputs.new_password) ? this.i_inputs.new_password.value() : "";
}
var params=new DataNode("xml");
params.addNode(new DataNode("code", "pchangegds"));
params.addNode(new DataNode("userid", user_prefs["user_id"]));
params.addNode(new DataNode("username", user_prefs["user_name"]));
params.addNode(new DataNode("oldpass", old_password));
params.addNode(new DataNode("newpass", new_password));
params.addNode(new DataNode("idle_time", this.i_inputs.timeout.value()));
params.addNode(new DataNode("question_id", this.i_inputs.secret_question.value()));
params.addNode(new DataNode("answer", this.i_inputs.secret_answer.value()));
var url_params="?xml="+params.toXML(false, true);
ResourceManager.request(this.i_wizard_url+url_params, 1, undefined, null, this, undefined, "js");
}
SecuritySettings={};
SecuritySettings.saveHandlerFrame=function(o) {
JavaScriptResource.notifyComplete(GeneralSecurityPane.obj.i_wizard_path);
if (!o) {
DialogManager.alert("Error getting information from server.");
return;
}
if (o.code==1) {
DialogManager.alert(o.err);
return;
}
if (o.code!=0) {
DialogManager.alert("An error occurred while attempting to change your security settings.  Please try again.");
return;
}
user_prefs["idle_time"]=GeneralSecurityPane.obj.i_inputs.timeout.value();
var cookie=new BlueTieCookie();
cookie.setValue("Access_idle_time", GeneralSecurityPane.obj.i_inputs.timeout.value());
if (user_prefs["password_lock"]=="0"){	
GeneralSecurityPane.obj.i_inputs.old_password.value("");
GeneralSecurityPane.obj.i_inputs.new_password.value("");
GeneralSecurityPane.obj.i_inputs.new_password_confirm.value("");
}
}
GeneralSecurityPane.inherit(FormPreferencePane);
Application.getApplicationById("GP").registerPreferencePane(new GeneralSecurityPane());
function GeneralRegionalPane() {
this.superFormPreferencePane("Regional Settings", "Set up your time zone and preferred date/time formats.");
this.i_inputs={};
this.i_wizard_path="/Ioffice/Common/wizard.asp";
GeneralRegionalPane.obj=this;
EventHandler.register(this, "onload", this.handleLoad, this);
}
GeneralRegionalPane.prototype.handleLoad=function(e) {
var params=new DataNode("request");
params.addNode(new DataNode("req_id", "timezones"));
var url_params="?xml="+params.toXML(false, true);
ResourceManager.request(this.i_wizard_path+url_params, 1, GeneralRegionalPane.handleLoadTimeZones);
}
GeneralRegionalPane.handleLoadTimeZones=function(data, xml, req, params) {
var questions=xml.getElementsByTagName("timezone");
for(var i=0; i < questions.length; i++){
var id=getXMLValue(questions[i], "id");
var time_zone=getXMLValue(questions[i], "desc");
GeneralRegionalPane.obj.i_inputs.time_zone.addOption(new UniversalOptionBoxOption(time_zone, id));
}
var params=new DataNode("request");
params.addNode(new DataNode("req_id", "usrregnl"));
params.addNode(new DataNode("userid", user_prefs["user_id"]));
var url_params="?xml="+params.toXML(false, true);
ResourceManager.request(GeneralRegionalPane.obj.i_wizard_path+url_params, 1, GeneralRegionalPane.handleLoadPreferences);
}
GeneralRegionalPane.handleLoadPreferences=function(data, xml, req, params) {
GeneralRegionalPane.obj.i_inputs.time_zone.value(getXMLValue(xml, "timezoneID"));
GeneralRegionalPane.obj.i_inputs.time.value(getXMLValue(xml, "timeFormat"));
GeneralRegionalPane.obj.i_inputs.date.value(getXMLValue(xml, "dateFormat"));
GeneralRegionalPane.obj.updateDefault();
GeneralRegionalPane.obj.loaded(true);
}
GeneralRegionalPane.prototype.getForm=function() {
if (this.i_form==undefined) {
this.i_form=new UniversalForm(450, 100);
var section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.time_zone=new UniversalOptionBoxInput("Time zone", "", []);
section.addRow(new UniversalFormRow(this.i_inputs.time_zone));
this.i_inputs.date=new UniversalOptionBoxInput("Date format", "", [new UniversalOptionBoxOption("MM/DD/YYYY", "%m/%d/%Y"),
new UniversalOptionBoxOption("DD/MM/YYYY", "%d/%m/%Y")]);
section.addRow(new UniversalFormRow(this.i_inputs.date));
this.i_inputs.time=new UniversalOptionBoxInput("Time format", "", [new UniversalOptionBoxOption("12 hour", "%I:%M %p"),
new UniversalOptionBoxOption("24 hour", "%H:%M")]);
section.addRow(new UniversalFormRow(this.i_inputs.time));
this.i_form.clearModified();
}
return this.i_form;
}
GeneralRegionalPane.prototype.save=function() {
var time_zone=this.i_inputs.time_zone.value();
var date=this.i_inputs.date.value();
var time=this.i_inputs.time.value();
user_prefs["timezone"]=time_zone;
user_prefs["date_prefs"]=date;
user_prefs["time_prefs"]=time;
var cookie=new BlueTieCookie();
cookie.setValue("Access_timezone", time_zone);
cookie.setValue("Access_date_prefs", date);
cookie.setValue("Access_time_prefs", time);
var params=new DataNode("xml");
params.addNode(new DataNode("code", "tchange"));
params.addNode(new DataNode("userid", user_prefs["user_id"]));
params.addNode(new DataNode("username", user_prefs["user_name"]));
params.addNode(new DataNode("timeZoneID", time_zone));
params.addNode(new DataNode("dateFormat", escape(date)));
params.addNode(new DataNode("timeFormat", escape(time)));
var url_params="?xml="+params.toXML(false, true);
ResourceManager.request(this.i_wizard_path+url_params, 1, GeneralRegionalPane.handleSave);
}
GeneralRegionalPane.handleSave=function(data, xml, req, params) {
if(!xml) {
DialogManager.alert("Error getting information from server.");
return;
}
var gen_prefs=Application.getApplicationById("GP");
if (gen_prefs.onregionalsave!=undefined) {
var o=new Object();
o.type="regionalsave";
gen_prefs.onregionalsave(o);
}
}
GeneralRegionalPane.inherit(FormPreferencePane);
Application.getApplicationById("GP").registerPreferencePane(new GeneralRegionalPane());
function GeneralLayoutPane() {
this.superFormPreferencePane("Layout Settings", "Layout management and persistence settings");
this.i_inputs={};
GeneralLayoutPane.obj=this;
EventHandler.register(this, "onshow", this.handleLoad, this);
}
GeneralLayoutPane.prototype.handleLoad=function(e) {
var auto_save=SystemCore.layoutManager().autoSave();
this.i_inputs.auto_save.value(auto_save);
this.loaded(true);
this.getForm().clearModified();
}
GeneralLayoutPane.prototype.getForm=function() {
if (this.i_form==undefined) {
this.i_form=new UniversalForm(450, 20);
var section=this.i_form.addSection(new UniversalFormSection("Autosave Settings", "When I make changes to the application layout"));
this.i_inputs.auto_save=new UniversalRadioInput("", "", "100%", [new UniversalRadioOption("Save changes automatically (do not prompt me).", "2"),
new UniversalRadioOption("Always prompt me before saving changes", "0"),
new UniversalRadioOption("Never save my layout changes", "1")]);
section.addRow(new UniversalFormRow(this.i_inputs.auto_save));
this.i_form.clearModified();
}
return this.i_form;
}
GeneralLayoutPane.prototype.save=function() {
var auto_save=this.i_inputs.auto_save.value();
var gen_prefs=Application.getApplicationById('GP');
SystemCore.layoutManager().autoSave(auto_save);
if (gen_prefs!=undefined) {
gen_prefs.param("layout_autosave", auto_save);
}
}
GeneralLayoutPane.inherit(FormPreferencePane);
if(GDSConfiguration.layout_on && !_LITE_ && !SystemCore.hasApp(3006)) {
Application.getApplicationById("GP").registerPreferencePane(new GeneralLayoutPane());
}
function GeneralSupportPane() {
this.superFormPreferencePane("Support Information", "Information on obtaining customer support.");
}
GeneralSupportPane.prototype.getForm=function() {
if(this.i_form==undefined) {
this.i_form=new UniversalForm(450,200);
var section=this.i_form.addSection(new UniversalFormSection());
var online_help_string="<b>Application help:</b><br>";
online_help_string+="<a href='http://support.bluetie.com/' target='_blank'>Online Help Section</a>";
section.description(online_help_string);
section=this.i_form.addSection(new UniversalFormSection());
var email_help_string="<b>Customer Service &amp; Technical Support:</b>";
email_help_string+="<br>By Email: ";
email_help_string+="<a href=\"JavaScript:"+"var message=new EmailMessage();message.to('support@bluetie.com');"+"message.subject('Support Request - Contract "+user_prefs["support_id"]+"');ApplicationEmail.newEmail(message);\">"+"Support</a><br>";
section.description(email_help_string);
section=this.i_form.addSection(new UniversalFormSection());
var phone_help_string="By Phone (Toll Free): 1-800-BLUE-TIE<br><br>"+"Support ID: "+user_prefs["support_id"]+"<br>"+"Please have this number ready when you call.<br><br>"+"<b>Hours of Operation</b><br>"+"7 a.m. to 8 p.m. EST, Monday - Friday";
section.description(phone_help_string);
}
return this.i_form;
}
GeneralSupportPane.prototype.save=function() {
}
GeneralSupportPane.inherit(FormPreferencePane);
if(user_prefs["support_id"]) {
Application.getApplicationById("GP").registerPreferencePane(new GeneralSupportPane());
}
JavaScriptResource.notifyComplete("./src/Applications/GeneralPrefs/Preference.GeneralPrefs.js");
JavaScriptResource.notifyComplete("./btAppGeneralPrefsPreferences.js");
