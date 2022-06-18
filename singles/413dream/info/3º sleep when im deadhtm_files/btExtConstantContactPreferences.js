function ConstantContactPane() {
this.superFormPreferencePane("Marketing Campaign", "Manage your Constant Contact marketing campaign settings.");
this.i_sections={};
this.i_inputs={}
this.i_constant_contact=ExtensionConstantContact.app
ConstantContactPane.obj=this;
EventHandler.register(this, "onload", this.handleLoad, this);
}
ConstantContactPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 200);
this.i_sections.account=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.username=new UniversalTextInput("Constant Contact Username", "");
this.i_sections.account.addRow(new UniversalFormRow(this.i_inputs.username));
this.i_inputs.password=new UniversalTextInput("Constant Contact Password", "");
this.i_inputs.password.masked(true);
this.i_sections.account.addRow(new UniversalFormRow(this.i_inputs.password));
this.i_form.clearModified();
}
return this.i_form;
}
ConstantContactPane.prototype.handleLoad=function(e) {
var username=this.i_constant_contact.secureParam("username");
var password=this.i_constant_contact.secureParam("password");
if(username!=undefined) {
this.i_inputs.username.value(username);
this.i_inputs.password.value(password);
} else {
this.i_inputs.username.value("");
this.i_inputs.password.value("");
}
this.loaded(true);
}
ConstantContactPane.prototype.save=function() {
var username=this.i_inputs.username.value();
var password=this.i_inputs.password.value();
if(password.length > 0 || (username.length > 0 && username!=this.i_constant_contact.secureParam("username"))) {
ExtensionConstantContact.store.validateAccount(username, password, ConstantContactPane.handleSaveConstantContactSettings);
} else if(username.length==0 && password.length==0) {
ExtensionConstantContact.clearLoginDetails();
}
}
ConstantContactPane.handleSaveConstantContactSettings=function(username, password, state) {
ConstantContactPane.obj.handleSaveConstantContactSettings(username, password, state);
}
ConstantContactPane.prototype.handleSaveConstantContactSettings=function(username, password, state) {
this.i_inputs.password.value("");
if(state) {
ExtensionConstantContact.app.secureParam("username", username);
ExtensionConstantContact.app.secureParam("password", password);
ExtensionConstantContact.app.i_cc.i_data_init=false;
} else {
if(ExtensionConstantContact.app.secureParam("username")) {
this.i_inputs.username.value(ExtensionConstantContact.app.secureParam("username"));
} else {
this.i_inputs.username.value("");
}
DialogManager.alert('The Constant Contact account you provided is not valid.');
}
}
ConstantContactPane.prototype.handleValidateUser=function(result) {
if(result) {
this.i_settings.setUsername(this.i_inputs.username.value());
this.i_settings.setPassword(this.i_inputs.password.value());
ExtensionConstantContact.store.setSettings(this.i_settings, new SmartHandler(this, this.handleSave));
} else {
DialogManager.alert("Could not validate your eFax credentials. "+"Please check them and try again.");
}
this.i_inputs.username.value(this.i_settings.getUsername());
this.i_inputs.password.value(this.i_settings.getPassword());
}
ConstantContactPane.prototype.handleSave=function(result) {
if(result) {
if(this.i_settings.getUsername()!=undefined &&
this.i_settings.getUsername().length > 0 &&
this.i_inputs.add_to_contacts &&
this.i_inputs.add_to_contacts.checked()) {
ExtensionConstantContact.obj.addNumberToMyContact(this.i_settings.getUsername());
}
} else {
DialogManager.alert("An error occurred while saving your eFax "+"settings. Please try again later.");
}
if(this.i_inputs.add_to_contacts) {
this.i_inputs.add_to_contacts.checked(false);
}
}
ConstantContactPane.prototype.handleSignupClick=function() {
ExtensionConstantContact.obj.showSignupWindow();
}
ConstantContactPane.inherit(FormPreferencePane);
Application.getApplicationById(1007).registerPreferencePane(new ConstantContactPane());
JavaScriptResource.notifyComplete("./src/Extensions/ConstantContact/Preference.ConstantContact.js");
JavaScriptResource.notifyComplete("./btExtConstantContactPreferences.js");
