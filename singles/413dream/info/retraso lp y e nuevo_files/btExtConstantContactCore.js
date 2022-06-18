var EXTENSION_ENABLED=true;
var CONSTANT_CONTACT_LOGIN_URL="https://ui.constantcontact.com/wdk/API_LoginSiteOwner.jsp";
var CONSTANT_CONTACT_USE_EXISTING="Already a User";	
var CONSTANT_CONTACT_LEARN_MORE="Learn More";
var CONSTANT_CONTACT_CREATE_ACCOUNT="Sign Up";
var CONSTANT_CONTACT_LEARN_MORE_URL="http://www.constantcontact.com/features/tours.jsp?pn=BlueTie&cc=BTLearnMore";
var SECURITY_QUESTION_LIST=Array("Mother`s Maiden Name",
"First Pet`s Name",
"First School Attended",
"Town You Grew Up",
"Favorite Food",
"City of Birth",
"Father`s Middle Name",
"Best Friend`s Last Name",
"Favorite Ice Cream Flavor");
function ExtensionConstantContact() {
this.superApplication();
this.name("ConstantContact");
this.i_enabled=EXTENSION_ENABLED;
ExtensionConstantContact.app=this;
EventHandler.register(this, "onintegrate", this.initialize, this);
}
ExtensionConstantContact.prototype.initialize=function() {
var has_email=false;
for(var x=0; x < app_ids.length; x++) {
if(app_ids[x]=="1007") {
has_email=true;
break;
}
}
if(has_email) {
ApplicationEmail.getMessageTools();		
ApplicationEmail.i_new_message_button.contextMenu().addItem(new ContextMenuDivider());
ApplicationEmail.i_new_message_button.contextMenu().addItem(new ContextMenuItem("Marketing Campaign", true, ExtensionConstantContact.handleNewCampaign));
this.i_cc=new WindowObject('ecc', 'Constant Contact', 800, 400, Application.titleBarFactory());
this.i_cc.temporary(true);
this.i_cc.global(true);
this.i_cc.titleBar().removeButton(Application.i_title_dock);	
this.i_mcc=new WindowObject('mcc', 'Constant Contact', 300, 200, Application.titleBarFactory());
this.i_mcc.temporary(true);
this.i_mcc.global(true);
this.i_mcc.titleBar().removeButton(Application.i_title_dock);	
this.i_mcc.loadContent(ExtensionConstantContact.getNoAccountDialog());
if (ExtensionConstantContact.app.secureParam("username")!="" && ExtensionConstantContact.app.secureParam("username")!=undefined) {
ExtensionConstantContact.store.validateAccount(ExtensionConstantContact.app.secureParam("username"), ExtensionConstantContact.app.secureParam("password"), ExtensionConstantContact.handleInitialValidate);
}
var simpleClick=ApplicationOldContacts.getSimpleClick();
if (simpleClick) {
var groupContext=simpleClick.getGroupContextMenu();
groupContext.addItem(new ContextMenuDivider());
simpleClick.i_group_context_cc=groupContext.addItem(new ContextMenuItem("Export for Constant Contact", true, ExtensionConstantContact.store.handleExportGroup));
}
var email_app=Application.getApplicationById(1007);
email_app.registerPreference("./btExtConstantContactPreferences.js");
}
}
ExtensionConstantContact.getNoAccountDialog=function() {
if (ExtensionConstantContact.i_nad==undefined) {
var a=ExtensionConstantContact.i_nad=document.createElement('DIV');
a.className="ExtensionConstantContact_noAccount";
var tx=document.createElement('DIV');
var mk="We are proud to have partnered with Constant Contact, the leading web-based email marketing service used by more than 80,000 small businesses and associations.  With Constant Contact's easy-to-use software and templates you can create email newsletters and announcements that get immediate and measurable results.  Pricing starts as low as $15 per month!<p>";
mk+="Sign up Now for a FREE 60-day trial of Constant Contact's email marketing service.  There's no risk, no obligation, and no credit card required.";
tx.innerHTML=mk;
a.appendChild(tx);
var bx=document.createElement('DIV');
bx.className="ExtensionConstantContact_noAccount_buttons";
var bt_1=document.createElement('BUTTON');
var bt_2=document.createElement('BUTTON');
var bt_3=document.createElement('BUTTON');
bt_1.innerHTML=CONSTANT_CONTACT_CREATE_ACCOUNT;
bt_2.innerHTML=CONSTANT_CONTACT_LEARN_MORE;
bt_3.innerHTML=CONSTANT_CONTACT_USE_EXISTING;
EventListener.listen(bt_1, "onclick", ExtensionConstantContact.handleNewAccount);
EventListener.listen(bt_2, "onclick", ExtensionConstantContact.handleNewAccount);
EventListener.listen(bt_3, "onclick", ExtensionConstantContact.handleNewAccount);
bx.appendChild(bt_1);
bx.appendChild(bt_2);
bx.appendChild(bt_3);
a.appendChild(bx);
}
return ExtensionConstantContact.i_nad;
}
ExtensionConstantContact.handleInitialValidate=function(username, password, state) {
if (state) {
ExtensionConstantContact.loadApplication();
}
else {
DialogManager.alert('Your Constant Contact login details have expired.');
}
}
ExtensionConstantContact.loadApplication=function() {
if (ExtensionConstantContact.i_app_loaded!=true) {
ResourceManager.request("./src/Applications/ConstantContact/Application.ConstantContact.js", 1, ExtensionConstantContact.handleLoadApplication);
ExtensionConstantContact.i_app_loaded=true;
}
return true;
}
ExtensionConstantContact.handleLoadApplication=function() {
Application.getApplicationById(3002).initialize();
}
ExtensionConstantContact.clearLoginDetails=function() {
ExtensionConstantContact.app.secureParam("username", "");
ExtensionConstantContact.app.secureParam("password", "");
}
ExtensionConstantContact.handleNewCampaign=function() {
var unm=ExtensionConstantContact.app.secureParam("username");
var pwd=ExtensionConstantContact.app.secureParam("password");
if(ApplicationEmail.i_preferences && (!ApplicationEmail.i_preferences_loaded || ApplicationEmail.i_preferences.aliases()==undefined)) {
ApplicationEmail.i_preferences_loaded=true;
ApplicationEmail.store.getPreferences(ExtensionConstantContact.handleNewCampaign);
}
else {
if (unm==undefined || unm=="" || pwd==undefined || pwd=="") {
ExtensionConstantContact.app.i_mcc.popWindow(500, 280, true);
}
else {
if (ExtensionConstantContact.i_validated==true) {
ExtensionConstantContact.handleLaunchExisting(unm, pwd, true, true);
}
else {
ExtensionConstantContact.store.validateAccount(unm, pwd, ExtensionConstantContact.handleLaunchExisting);
}
}
}
return true;
}
ExtensionConstantContact.handleLaunchExisting=function(username, password, state, manual) {
if (state==true || manual==true) {
var c=WindowObject.getWindowById('ecc');
c.temporary(true);
c.global(true);
if (c.i_data_init!=true) {
c.i_data_init=true;
var p=new ResourcePost();
p.param("loginName", username);
p.param("loginPassword", password);
p.param("ForwardError", "http:\/\/www.bluetie.com/error");
c.url(CONSTANT_CONTACT_LOGIN_URL+"?"+p.toString(), true);
var dataStr="<logData>"+"<caller>"+user_prefs["user_name"]+"</caller>"+"<loginName>"+ExtensionConstantContact.app.secureParam("username")+"</loginName>"+"</logData>";
ExtensionConstantContact.store.log(302, dataStr);
}
c.popWindow(800, 550, true);
}
else {
ExtensionConstantContact.clearLoginDetails();
ExtensionConstantContact.handleNewCampaign();
}
}
ExtensionConstantContact.getLoginPromptForm=function() {
var ecc=ExtensionConstantContact;
if (ecc.login_prompt==undefined) {
ecc.login_prompt=new BasicForm(500);
ecc.login_prompt.labelPadding(85);
ecc.login_prompt.formPadding(10);
var sec=ecc.login_prompt.addSection(new BasicFormSection("Login Information", "If you already have a Constant Contact account, please enter the login details here, and select 'Save and continue'.  If you do not have an account with Constant Contact, select the 'Create new account' option."));
ecc.i_login_user_input=sec.addInput(new BasicInputText("Username", "", "Enter your current Constant Contact username", false));
ecc.i_login_pass_input=sec.addInput(new BasicInputText("Password", "", "Enter your current Constant Contact password", true));
ecc.login_prompt.addAction(new BasicFormAction("Cancel", ExtensionConstantContact.cancelLoginPrompt));
ecc.login_prompt.addAction(new BasicFormAction("Save and continue", ExtensionConstantContact.handleExistingAccount));
ecc.login_prompt.addAction(new BasicFormAction("<< Create new account", ExtensionConstantContact.switchToNewAccount));
}
return ecc.login_prompt;
}
ExtensionConstantContact.cancelNewAccountPrompt=function() {
if (ExtensionConstantContact.newAccountWindow!=undefined) {
if (ExtensionConstantContact.newAccountWindow.visible()) {
ExtensionConstantContact.newAccountWindow.close();
}
}
}
ExtensionConstantContact.cancelLoginPrompt=function() {
if (ExtensionConstantContact.loginWindow!=undefined) {
if (ExtensionConstantContact.loginWindow.visible()) {
ExtensionConstantContact.loginWindow.close();
}
}
}
ExtensionConstantContact.switchToNewAccount=function() {
if (ExtensionConstantContact.loginWindow!=undefined) {
ExtensionConstantContact.loginWindow.close();
}
ExtensionConstantContact.promptNewAccount();
}
ExtensionConstantContact.switchToLoginPrompt=function() {
if (ExtensionConstantContact.newAccountWindow!=undefined) {
ExtensionConstantContact.newAccountWindow.close();
}
ExtensionConstantContact.promptLogin();
}
ExtensionConstantContact.promptLogin=function(username) {
if (ExtensionConstantContact.loginWindow==undefined) {
var ecc=ExtensionConstantContact;
ecc.loginWindow=new WindowObject('eccl', 'Constant Contact Login', 504, 220, Application.titleBarFactory());
ecc.loginWindow.temporary(true);
ecc.loginWindow.global(true);
ecc.loginWindow.titleBar().removeButton(Application.i_title_dock); 
ecc.loginWindow.loadContent(ecc.getLoginPromptForm().getForm());														
}
ExtensionConstantContact.login_prompt.reset();
ExtensionConstantContact.loginWindow.popWindow(504, 220, true);
return true;
}
ExtensionConstantContact.getNewAccountPromptForm=function() {
var ecc=ExtensionConstantContact;
if (ecc.new_account_prompt==undefined) {
ecc.new_account_prompt=new BasicForm(500);
ecc.new_account_prompt.labelPadding(85);
ecc.new_account_prompt.formPadding(10);
var sec=ecc.new_account_prompt.addSection(new BasicFormSection("Login Information", "Please create a username and password.  You will not be prompted for this information again, however if you need to login to Constant Contact directly, you can do so with these details."));
ecc.i_new_user_input=sec.addInput(new BasicInputText("Username", "", "", false));
ecc.i_new_pass_input=sec.addInput(new BasicInputText("Password", "", "", true));
ecc.i_new_pass2_input=sec.addInput(new BasicInputText("", "", "Enter your password again", true));
var sec2=ecc.new_account_prompt.addSection(new BasicFormSection("Contact Information", "Please enter the following required contact information."));
var dn=ApplicationEmail.i_preferences.display_name();
var fn=dn.substr(0, dn.indexOf(' '));
var ln=dn.substr(dn.indexOf(' ')+1);
ecc.i_new_fname_input=sec2.addInput(new BasicInputText("First Name", fn, "", false));
ecc.i_new_lname_input=sec2.addInput(new BasicInputText("Last Name", ln, "", false));
var al=ApplicationEmail.i_preferences.aliases();
var addr=user_prefs['user_name'];
if (al!=undefined) {
for (var x=0; x < al.length; x++) {
if (al[x].is_default==true || x==0) {
addr=al[x].address;
}
}
}
ecc.i_new_email_input=sec2.addInput(new BasicInputText("Email", addr, "", false));
ecc.i_new_phone_input=sec2.addInput(new BasicInputText("Phone", "", "", false));
ecc.i_new_url_input=sec2.addInput(new BasicInputText("Website", "", "Your website URL, for example: www.your-domain.com", false));
var d=ecc.new_account_prompt.addAction(new BasicFormAction("Cancel", ExtensionConstantContact.cancelNewAccountPrompt));
ecc.new_account_prompt.addAction(new BasicFormAction("Create account", ExtensionConstantContact.handleCreateAccount));
ecc.new_account_prompt.addAction(new BasicFormAction("<< Use existing account", ExtensionConstantContact.switchToLoginPrompt));
}
return ecc.new_account_prompt;
}
ExtensionConstantContact.promptNewAccount=function() {
if (ApplicationEmail.i_preferences==undefined) {
ApplicationEmail.i_preferences_loaded=true;
ApplicationEmail.store.getPreferences(ExtensionConstantContact.promptNewAccount);
}
else {
if (ExtensionConstantContact.newAccountWindow==undefined) {
var ecc=ExtensionConstantContact;
ecc.newAccountWindow=new WindowObject('eccn', 'Constant Contact: New Account', 504, 300, Application.titleBarFactory());
ecc.newAccountWindow.temporary(true);
ecc.newAccountWindow.global(true);
ecc.newAccountWindow.titleBar().removeButton(Application.i_title_dock); 
ecc.newAccountWindow.loadContent(ecc.getNewAccountPromptForm().getForm());														
}
ExtensionConstantContact.new_account_prompt.reset();
ExtensionConstantContact.newAccountWindow.popWindow(504, 430, true);
}
return true;
}
ExtensionConstantContact.handleNewAccount=function(e) {
ExtensionConstantContact.app.i_mcc.close();
if (this.innerHTML==CONSTANT_CONTACT_CREATE_ACCOUNT) {
ExtensionConstantContact.promptNewAccount();
}
else if (this.innerHTML==CONSTANT_CONTACT_USE_EXISTING) {
ExtensionConstantContact.promptLogin();
}
else if (this.innerHTML==CONSTANT_CONTACT_LEARN_MORE) {
if (ExtensionConstantContact.i_learn_window==undefined) {
ExtensionConstantContact.i_learn_window=new ExternalWindow(800, 400, CONSTANT_CONTACT_LEARN_MORE_URL, true);
ExtensionConstantContact.i_learn_window.name("Constant Contact");
}
ExtensionConstantContact.i_learn_window.show();
}
return true;
}
ExtensionConstantContact.handleExistingAccount=function() {
var ecc=ExtensionConstantContact;
var username=ecc.i_login_user_input.value();
var password=ecc.i_login_pass_input.value();
if (username=="" || password=="") {
DialogManager.alert('You did not enter both a username and password');
}
else {
ExtensionConstantContact.loginWindow.close();
ExtensionConstantContact.store.validateAccount(username, password, ExtensionConstantContact.accountValidated);
}
}
ExtensionConstantContact.accountValidated=function(username, password, state) {
if (state==true) {
ExtensionConstantContact.app.secureParam("username", username);
ExtensionConstantContact.app.secureParam("password", password);
ExtensionConstantContact.loadApplication();
ExtensionConstantContact.handleNewCampaign();
}
else {
DialogManager.alert('The Constant Contact account you provided is not valid.');
}
}
ExtensionConstantContact.handleCreateAccount=function() {
var ecc=ExtensionConstantContact;
var username=ecc.i_new_user_input.value();
var password=ecc.i_new_pass_input.value();
var passConfirm=ecc.i_new_pass2_input.value();
var firstname=ecc.i_new_fname_input.value();
var lastname=ecc.i_new_lname_input.value();
var email=ecc.i_new_email_input.value();
var phone=ecc.i_new_phone_input.value();
var url=ecc.i_new_url_input.value();
if (username=="" || password=="") {
DialogManager.alert('You did not enter both a username and password');
}
else if (firstname=="") {
DialogManager.alert('You must include a first name');		
}
else if (lastname=="") {
DialogManager.alert('You must include a last name');
}
else if (email=="") {
DialogManager.alert('You must include your EMail address');
}
else if (phone=="") {
DialogManager.alert('You must include your phone number');
}
else if (url=="") {
DialogManager.alert('You must include the address (URL) of your website');
}
else if (password!=passConfirm) {
DialogManager.alert('Your passwords do not match');
}
else {
if (ExtensionConstantContact.newAccountLocked!=true) {
ExtensionConstantContact.store.createAccount(username, password, firstname, lastname, email, phone, url, ExtensionConstantContact.finishCreateAccount);
ExtensionConstantContact.newAccountLocked=true;
}
else {
DialogManager.alert("There is currently an account creation in progress, please wait for it to finish before attempting to create another account");
}
}
}
ExtensionConstantContact.finishCreateAccount=function(username, password) {
ExtensionConstantContact.app.secureParam("username", username);
ExtensionConstantContact.app.secureParam("password", password);
ExtensionConstantContact.newAccountLocked=false;
ExtensionConstantContact.newAccountWindow.close();
ExtensionConstantContact.loadApplication();
ExtensionConstantContact.handleNewCampaign();
}
ExtensionConstantContact.store=Array();
ExtensionConstantContact.store.createAccount=function(username, password, firstname, lastname, email, phone, url, callback, params) {
if (params==undefined) {
params=Array();
}
params.splice(0, 0, username);
params.splice(0, 0, password);
params.splice(0, 0, firstname);
params.splice(0, 0, lastname);
params.splice(0, 0, email);
params.splice(0, 0, phone);
params.splice(0, 0, url);
params.splice(0, 0, callback);
params.splice(0, 0, Notifications.add("Creating Constant Contact account '"+username+"'."));
var p=new ResourcePost();
var request=new ResourceXMLNode("request");
request.addLeafNode("method", "create");
request.addLeafNode("username", htmlEncode(username));
request.addLeafNode("password", htmlEncode(password));
request.addLeafNode("fname", htmlEncode(firstname));
request.addLeafNode("lname", htmlEncode(lastname));
request.addLeafNode("url", htmlEncode(url));
request.addLeafNode("phone", htmlEncode(phone));
request.addLeafNode("email", htmlEncode(email));
p.param("xml", request.toString());
p.param("sid", user_prefs['session_id']);
p.param("unm", user_prefs['user_name']);
ResourceManager.request("/cgi-bin/ConstantContactCGI.fcg?"+p.toString(), 1, ExtensionConstantContact.store.handleCreateAccount, undefined, params, undefined);
}
ExtensionConstantContact.store.handleCreateAccount=function(data, xml, req, params) {
var nId=params[0];
var cb=params[1];
var url=params[2];
var phone=params[3];
var email=params[4];
var lastname=params[5];
var firstname=params[6];
var password=params[7];
var username=params[8];
params.splice(0, 9);
if (data.substr(0, data.indexOf('\n'))=="0") {
Notifications.end(nId);
if (cb!=undefined) {
cb(username, password, params);
}
}
else {
Notifications.end(nId, undefined, true, data.substr(data.indexOf('\n')+1), true);
}
ExtensionConstantContact.newAccountLocked=false;
}
ExtensionConstantContact.store.validateAccount=function(username, password, callback, params) {
if (params==undefined) {
params=Array();
}
params.splice(0, 0, password);
params.splice(0, 0, username);
params.splice(0, 0, callback);
params.splice(0, 0, Notifications.add("Validating Constant Contact account '"+username+"'."));
var p=new ResourcePost();
var request=new ResourceXMLNode("request");
request.addLeafNode("method", "validate");
request.addLeafNode("username", username);
request.addLeafNode("password", password);
p.param("xml", request.toString());
p.param("sid", user_prefs['session_id']);
p.param("unm", user_prefs['user_name']);
ResourceManager.request("/cgi-bin/ConstantContactCGI.fcg?"+p.toString(), 1, ExtensionConstantContact.store.handleValidateAccount, undefined, params, undefined);
}
ExtensionConstantContact.store.handleValidateAccount=function(data, xml, req, params) {
var nId=params[0];
var cb=params[1];
var username=params[2];
var password=params[3];
params.splice(0, 4);
var state=false;
if (data.substr(0, data.indexOf('\n'))=="0") {
Notifications.end(nId);
state=true;
ExtensionConstantContact.i_validated=true;
}
else {
Notifications.end(nId, undefined, false, "Your existing account is no longer valid.");
}
if (cb!=undefined) {
cb(username, password, state, params);
}
ExtensionConstantContact.newAccountLocked=false;
}
ExtensionConstantContact.store.handleExportGroup=function(but, foc, e) {
var dataStr="<caller>"+user_prefs["user_name"]+"</caller>"+"<owner>"+SimpleClickDataCache.findOwner(foc.uuid)+"</owner>"+"<contacts>"+SimpleClickDataCache.getContactUUIDsForGroup(foc.uuid)+"</contacts>" ;
ExtensionConstantContact.store.log(303, "<logData>"+dataStr+"</logData>");
ExtensionConstantContact.getExportFrame().src="/cgi-bin/contacts/core-ExportCSV.fcg?xml=<params>"+dataStr+"<format>ConstantContact</format><method>ExportCSV</method></params>&unm="+user_prefs["user_name"]+"&sid="+user_prefs["session_id"];
}
ExtensionConstantContact.store.log=function(opcode, data) {
var post=new ResourcePost();
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request>"+"<method>checksession</method>"+"<opcode>"+opcode.toString()+"</opcode>"+"<userId>"+user_prefs['user_id']+"</userId>"+"<details>"+htmlEncode(data)+"</details>"+"</request>");
ResourceManager.request("/cgi-bin/phoenix/OpLogCGI.fcg", 1, undefined, post);
return true;
}
ExtensionConstantContact.getExportFrame=function() {
if (ExtensionConstantContact.i_exportFrame==undefined) {
ExtensionConstantContact.i_exportFrame=document.createElement('iframe');
document.body.appendChild(ExtensionConstantContact.i_exportFrame);
}
return ExtensionConstantContact.i_exportFrame;
}
ExtensionConstantContact.inherit(Application);
SystemCore.registerApplication(new ExtensionConstantContact());
JavaScriptResource.notifyComplete("./src/Extensions/ConstantContact/Extension.ConstantContact.js");
JavaScriptResource.notifyComplete("./btExtConstantContactCore.js");
