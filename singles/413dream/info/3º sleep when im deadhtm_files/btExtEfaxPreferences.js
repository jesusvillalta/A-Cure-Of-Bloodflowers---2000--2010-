function EfaxPane() {
this.superFormPreferencePane("eFax Settings", "Manage your eFax settings.");
this.i_sections={};
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
EventHandler.register(this, "onshow", this.handleLoad, this);
}
EfaxPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 100);
this.i_sections.signup=this.i_form.addSection(new UniversalFormSection("Sign Up", "If you are new to using eFax, it's easy to get started. Simply click the \"Learn More / Sign Up\" button below."));
this.i_form.removeSection(this.i_sections.signup);
var signup_button=new UniversalButton("Learn More / Sign Up", undefined, undefined, undefined, 
true, 22);
EventHandler.register(signup_button, "onclick", this.handleSignupClick, this);
this.i_sections.signup.addRow(new UniversalFormRow(new UniversalButtonInput(signup_button, "left")));
this.i_sections.account=this.i_form.addSection(new UniversalFormSection("eFax Account", "If you are an existing eFax subscriber, fill out your login credentials below."));
this.i_inputs.username=new UniversalTextInput("eFax number", "");
this.i_sections.account.addRow(new UniversalFormRow(this.i_inputs.username));
this.i_inputs.password=new UniversalTextInput("eFax pin", "");
this.i_inputs.password.masked(true);
this.i_sections.account.addRow(new UniversalFormRow(this.i_inputs.password));
if(SystemCore.hasApp(2005)) {
this.i_inputs.add_to_contacts=new UniversalCheckBoxOption("Add my eFax # to my Contacts profile", "Email");
var add=new UniversalCheckBoxInput("", "", "100%", [this.i_inputs.add_to_contacts]);
this.i_sections.account.addRow(new UniversalFormRow(add));
}
this.i_form.clearModified();
}
return this.i_form;
}
EfaxPane.prototype.handleLoad=function(e) {
ExtensionEfax.store.getSettings(new SmartHandler(this, this.handleLoadPreferences));
ExtensionEfax.store.getEmailAddress();
ExtensionBilling.store.getContact();
}
EfaxPane.prototype.handleLoadPreferences=function(settings) {
this.i_settings=settings;
this.i_inputs.username.value(settings.getUsername());
this.i_inputs.password.value(settings.getPassword());
this.updateDefault();
this.loaded(true);
if(this.i_settings && this.i_settings.getUsername()) {
this.i_form.removeSection(this.i_sections.signup);
} else {
this.i_form.addSection(this.i_sections.signup, this.i_sections.account);
}
}
EfaxPane.prototype.save=function() {
if(this.i_inputs.username.value()) {
ExtensionEfax.store.validateUser(this.i_inputs.username.value(), this.i_inputs.password.value(), new SmartHandler(this, this.handleValidateUser));
} else {
this.i_inputs.password.value("");
this.handleValidateUser(true);
}
}
EfaxPane.prototype.handleValidateUser=function(result) {
if(result) {
this.i_settings.setUsername(this.i_inputs.username.value());
this.i_settings.setPassword(this.i_inputs.password.value());
ExtensionEfax.store.setSettings(this.i_settings, new SmartHandler(this, this.handleSave));
} else {
DialogManager.alert("Could not validate your eFax credentials. "+"Please check them and try again.");
}
this.i_inputs.username.value(this.i_settings.getUsername());
this.i_inputs.password.value(this.i_settings.getPassword());
}
EfaxPane.prototype.handleSave=function(result) {
if(result) {
if(this.i_settings.getUsername()!=undefined &&
this.i_settings.getUsername().length > 0 &&
this.i_inputs.add_to_contacts &&
this.i_inputs.add_to_contacts.checked()) {
ExtensionEfax.obj.addNumberToMyContact(this.i_settings.getUsername());
}
} else {
DialogManager.alert("An error occurred while saving your eFax "+"settings. Please try again later.");
}
if(this.i_inputs.add_to_contacts) {
this.i_inputs.add_to_contacts.checked(false);
}
}
EfaxPane.prototype.handleSignupClick=function() {
ExtensionEfax.obj.showSignupWindow();
}
EfaxPane.inherit(FormPreferencePane);
Application.getApplicationById(1007).registerPreferencePane(new EfaxPane());
JavaScriptResource.notifyComplete("./src/Extensions/Efax/Preference.Efax.js");
JavaScriptResource.notifyComplete("./btExtEfaxPreferences.js");
