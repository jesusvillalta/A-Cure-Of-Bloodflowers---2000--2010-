var EFAX_CGI="/cgi-bin/phoenix/FaxCGI.fcg";
var EFAX_CREDENTIALS_NONE=0;
var EFAX_CREDENTIALS_INVALID=1;
var EFAX_CREDENTIALS_VALID=2;
var EFAX_ON_DEMAND_COUNTRY_CODES=Array("1", "30", "31", "32", "33", "34", "39", "41", "43", "44", "45", "46", "47", "49", "54", "55", "56", "61", "63", "64", "65", "81", "82", "237", "260", "297", "351", "352", "353", "358", "386", "423", "852", "886", "970", "973", "974", "995", "966/22");
function ExtensionEfax() {
this.superApplication();
this.name("Efax");
this.i_contacts_interface=undefined;
this.i_email_interface=undefined;
this.i_files_interface=undefined;
this.i_compose_controller=undefined;
this.i_marketing_controller=undefined;
this.i_signup_window=undefined;
this.i_files={
"initialize" : ["./btExtEfaxInitialize.js"],
"settings" : ["./btExtEfaxSettings.js",
"./Extension.Efax.css"],
"new_number" : ["./btExtEfaxNewNumber.js",
"./Extension.Efax.css"],
"marketing" : ["./btExtEfaxMarketing.js",
"./Extension.Efax.css"],
"compose" : ["./btExtEfaxCompose.js"],
"terms" : ["./btExtEfaxTerms.js"]
};
ExtensionEfax.has_contacts=undefined;
ExtensionEfax.has_email=undefined;
ExtensionEfax.has_files=undefined;
ExtensionEfax.obj=this;
EventHandler.register(this, "onintegrate", this.initialize, this);
}
ExtensionEfax.prototype.initialize=function() {
if(ExtensionEfax.has_contacts==undefined) {
ExtensionEfax.has_contacts=false;
ExtensionEfax.has_email=false;
ExtensionEfax.has_files=false;
for(var i=0; i < app_ids.length; i++) {
switch(app_ids[i]) {
case "2005":
ExtensionEfax.has_contacts=true;
break;
case "1007":
ExtensionEfax.has_email=true;
break;
case "1009":
ExtensionEfax.has_files=true;
break;
}
}
}
if(ExtensionEfax.has_contacts || ExtensionEfax.has_email ||
ExtensionEfax.has_files) {
if(this.loadFiles("initialize", new SmartHandler(this,
this.initialize))) {
if(ExtensionEfax.has_contacts) {
this.i_contacts_interface=new EfaxContactsInterface(this);
this.i_contacts_interface.initialize();
}
if(ExtensionEfax.has_email) {
this.i_email_interface=new EfaxEmailInterface(this);
this.i_email_interface.initialize();
}
if(ExtensionEfax.has_files) {
this.i_files_interface=new EfaxFilesInterface(this);
this.i_files_interface.initialize();
}
}
}
ExtensionEfax.store.hasCredentials();
}
ExtensionEfax.prototype.composeFax=function(message, opener_win, win) {
if(!message) {
message=new EfaxMessage();
}
if(message.isOnDemand()) {
this.showComposeWindow(message, opener_win, win);
} else {
ExtensionEfax.store.hasCredentials(new SmartHandler(this,
this.handleHasCredentials, [message, opener_win, win],
true));
}
}
ExtensionEfax.prototype.handleHasCredentials=function(credentials, message,
opener_win, win) {
switch(credentials) {
case EFAX_CREDENTIALS_NONE:
this.showMarketingWindow(message);
break;
case EFAX_CREDENTIALS_INVALID:
this.showAuthFailure(message);
break;
case EFAX_CREDENTIALS_VALID:
this.showComposeWindow(message, opener_win, win);
break;
}
}
ExtensionEfax.prototype.showAuthFailure=function(message) {
if(this.loadFiles("marketing", new SmartHandler(this,
this.showAuthFailure, message, false, true))) {
if(this.i_marketing_controller==undefined) {
this.i_marketing_controller=new EfaxMarketingController(this);
}
this.i_marketing_controller.showAuthFailure(message);
}
}
ExtensionEfax.prototype.showComposeWindow=function(message, opener_win,
win) {
if(!message.getWindowName() && !win) {
win=this.preopenComposeWindow(opener_win);
if(!win) {
return false;
}
}
if(this.loadFiles("compose", new SmartHandler(this,
this.showComposeWindow, [message, opener_win, win], true))) {
if(!this.i_compose_controller) {
this.i_compose_controller=new EfaxComposeController(this);
}
this.i_compose_controller.showComposeWindow(message, win);
}
}
ExtensionEfax.prototype.preopenComposeWindow=function(opener_win) {
if(opener_win==undefined) {
opener_win=window;
}
var win=opener_win.open(user_prefs["root_dir"]+"/gds/blank.html",
"_blank", "width=780, height=424, resizable=yes, scrollbars=yes");
if(!win) {
opener_win.alert("There was a problem opening the fax compose "+"window, please make sure popup blocking is disabled in "+"your browser and try again.");
}
return win;
}
ExtensionEfax.prototype.showMarketingWindow=function(message) {
if(this.loadFiles("marketing", new SmartHandler(this,
this.showMarketingWindow, message, false, true))) {
var new_message=message;
if(new_message==undefined) {
new_message=new EfaxMessage();
}
if(this.i_marketing_controller==undefined) {
this.i_marketing_controller=new EfaxMarketingController(this);
}
this.i_marketing_controller.showMarketing(new_message);
}
}
ExtensionEfax.prototype.showSignupWindow=function() {
if(this.i_signup_window==undefined) {
this.i_signup_window=new EfaxSignupWindow();
}
this.i_signup_window.open();
}
ExtensionEfax.prototype.addNumberToMyContact=function(number, handler) {
if(this.loadFiles("new_number", new SmartHandler(this,
this.addNumberToMyContact, Array(number, handler), true,
true))) {
this.i_contacts_interface.addToMyContact(number, handler);
}
}
ExtensionEfax.cache={};
ExtensionEfax.cache.has_credentials=undefined;
ExtensionEfax.cache.email_address=undefined;
ExtensionEfax.cache.signup_url=undefined;
ExtensionEfax.store={};
ExtensionEfax.store.email_address_pending=false;
ExtensionEfax.store.email_address_handlers=[];
ExtensionEfax.store.has_accepted_terms=undefined;
ExtensionEfax.store.sendFax=function(message, handler) {
var note=Notifications.add("Sending fax");
var post=new ResourcePost();
var card_xml=(message.isOnDemand() ? "<cardid>"+message.getCard().getId()+"</cardid>" : "");
post.param("unm", user_prefs.user_name);
post.param("sid", user_prefs.session_id);
post.param("xml", "<request><method>sendfax</method><userid>"+user_prefs.user_id+"</userid>"+card_xml+message.toXML()+"</request>");
ResourceManager.request(EFAX_CGI, 1, ExtensionEfax.store.handleSendFax,
post, [handler, note]);
}
ExtensionEfax.store.checkAttachments=function(attachments, message_id,
on_demand, handler) {
var post=new ResourcePost();
var attachments_hash={};
var attachments_xml="";
for(var i=0; i < attachments.length; i++) {
var attachment=attachments[i];
attachment.setValid(false);
attachments_hash[attachment.getId()]=attachment;
attachments_xml+=attachment.toXML();
}
post.param("unm", user_prefs.user_name);
post.param("sid", user_prefs.session_id);
post.param("xml", "<request><method>checkattachments</method><userid>"+user_prefs.user_id+"</userid><ondemand>"+on_demand+"</ondemand><attachments><messageid>"+message_id+"</messageid>"+attachments_xml+"</attachments></request>");
ResourceManager.request(EFAX_CGI, 1,
ExtensionEfax.store.handleCheckAttachments, post,
[handler, attachments_hash]);
}
ExtensionEfax.store.getSettings=function(handler) {
if(ExtensionEfax.obj.loadFiles("settings", new SmartHandler(undefined, ExtensionEfax.store.getSettings, handler))) {
var post=new ResourcePost();
var note=Notifications.add("Retrieving fax settings");
post.param("unm", user_prefs["user_name"]);
post.param("sid", user_prefs["session_id"]);
post.param("xml", "<request><method>getsettings</method><userid>"+user_prefs["user_id"]+"</userid></request>");
ResourceManager.request(EFAX_CGI, 1,
ExtensionEfax.store.handleGetSettings, post,
Array(handler, note), undefined);
}
}
ExtensionEfax.store.setSettings=function(settings, handler) {
if(ExtensionEfax.obj.loadFiles("settings", new SmartHandler(undefined, ExtensionEfax.store.setSettings, Array(settings,
handler), true))) {
ExtensionEfax.cache.has_credentials=undefined;
var post=new ResourcePost();
var note=Notifications.add("Saving fax settings");
post.param("unm", user_prefs["user_name"]);
post.param("sid", user_prefs["session_id"]);
post.param("xml", "<request><method>setsettings</method><userid>"+user_prefs["user_id"]+"</userid>"+settings.toXML()+"</request>");
ResourceManager.request(EFAX_CGI, 1,
ExtensionEfax.store.handleSetSettings, post,
Array(handler, note), undefined);
}
}
ExtensionEfax.store.validateUser=function(username, password, handler) {
var post=new ResourcePost();
var note=Notifications.add("Validating eFax user");
post.param("unm", user_prefs["user_name"]);
post.param("sid", user_prefs["session_id"]);
post.param("xml", "<request><method>validateuser</method><username>"+htmlEncode(username)+"</username><password>"+htmlEncode(password)+"</password></request>");
ResourceManager.request(EFAX_CGI, 1,
ExtensionEfax.store.handleValidateUser, post, Array(handler,
note), undefined);
}
ExtensionEfax.store.hasCredentials=function(handler) {
if(ExtensionEfax.cache.has_credentials!=undefined) {
if(handler!=undefined) {
handler.execute(ExtensionEfax.cache.has_credentials);
}
} else {
var post=new ResourcePost();
if(handler!=undefined) {
var note=Notifications.add("Checking eFax credentials");
}
post.param("unm", user_prefs["user_name"]);
post.param("sid", user_prefs["session_id"]);
post.param("xml", "<request><method>hascredentials</method><userid>"+user_prefs["user_id"]+"</userid></request>");
ResourceManager.request(EFAX_CGI, 1,
ExtensionEfax.store.handleHasCredentials, post, Array(handler,
note), undefined);
}
}
ExtensionEfax.store.hasAcceptedTerms=function(handler) {
var accepted_terms=ExtensionEfax.store.has_accepted_terms;
if(accepted_terms==undefined) {
var reg_data=ExtensionEfax.obj.param("fax");
if(reg_data!=undefined) {
try {
var json_data=eval("("+reg_data+")");
if(json_data["at"]!=undefined) {
accepted_terms=json_data["at"];
}
} catch(e) {
accepted_terms=false;
}
} else {
accepted_terms=false;
}
ExtensionEfax.store.has_accepted_terms=accepted_terms;
}
if(handler!=undefined) {
handler.execute(accepted_terms);
}
}
ExtensionEfax.store.acceptTerms=function(handler) {
ExtensionEfax.store.has_accepted_terms=true;
ExtensionEfax.obj.param("fax", "{\"at\":true}");
if(handler!=undefined) {
handler.execute();
}
}
ExtensionEfax.store.getEmailAddress=function(handler) {
if(ExtensionEfax.cache.email_address!=undefined) {
if(handler!=undefined) {
handler.execute(ExtensionEfax.cache.email_address);
}
} else if(ExtensionEfax.store.email_address_pending) {
if(handler!=undefined) {
ExtensionEfax.store.email_address_handlers.push(handler);
}
} else {
if(ExtensionEfax.has_email) {
ExtensionEfax.store.email_address_pending=true;
if(handler!=undefined) {
ExtensionEfax.store.email_address_handlers.push(handler);
}
ApplicationEmail.store.getPreferences(new SmartHandler(this,
this.handleEmailAddress));
} else if(handler!=undefined) {
handler.execute(undefined);
}
}
}
ExtensionEfax.store.getSignupURL=function(handler) {
if(ExtensionEfax.cache.signup_url!=undefined) {
if(handler!=undefined) {
handler.execute(ExtensionEfax.cache.signup_url);
}
} else {
var post=new ResourcePost();
post.param("unm", user_prefs["user_name"]);
post.param("sid", user_prefs["session_id"]);
post.param("xml", "<request><method>getsignupurl</method><userid>"+user_prefs["user_id"]+"</userid></request>");
ResourceManager.request(EFAX_CGI, 1,
ExtensionEfax.store.handleSignupURL, post, Array(handler),
undefined);
}
}
ExtensionEfax.store.sendNewUserEmail=function(handler) {
var post=new ResourcePost();
post.param("unm", user_prefs["user_name"]);
post.param("sid", user_prefs["session_id"]);
post.param("xml", "<request><method>sendnewuseremail</method><userid>"+user_prefs["user_id"]+"</userid></request>");
ResourceManager.request(EFAX_CGI, 1,
ExtensionEfax.store.handleSendNewUserEmail, post, Array(handler),
undefined);
}
ExtensionEfax.store.log=function(code, data) {
var post=new ResourcePost();
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request><method>checksession</method><opcode>"+code+"</opcode><userId>"+user_prefs['user_id']+"</userId><details>"+htmlEncode(data)+"</details></request>");
ResourceManager.request("/cgi-bin/phoenix/OpLogCGI.fcg", 1, undefined,
post);
}
ExtensionEfax.store.handleSendFax=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var success=false;
var timeout=false;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result.code=="20000000" && result.desc=="Success") {
success=true;
} else if(result.code=="0" &&
result.desc=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, 3, true);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute([success, result], true);
}
}
ExtensionEfax.store.handleCheckAttachments=function(data, xml, req,
params) {
var handler=params[0];
var attachments_hash=params[1];
var success=false;
var timeout=false;
var attachments=[];
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result.code=="20000000" && result.desc=="Success") {
for(var i=0; i < result.al.length; i++) {
var attachment_result=result.al[i];
var attachment=attachments_hash[attachment_result.ai];
attachment.setValid(attachment_result.av);
attachments.push(attachment);
}
success=true;
} else if(result.code=="0" &&
result.desc=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute([success, attachments], true);
}
}
ExtensionEfax.store.handleGetSettings=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var success=false;
var timeout=false;
var ret=undefined;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result["code"]=="20000000") {
var settings=result["fs"];
if(settings!=undefined) {
ret=new EfaxSettings();
ret.readFromJSON(settings);
} else {
ret=EfaxSettings.getDefaults();
}
success=true;
} else if(result["code"]=="0" &&
result["desc"]=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, "Failed to get fax settings",
false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(ret);
}
}
ExtensionEfax.store.handleSetSettings=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var success=false;
var timeout=false;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result["code"]=="20000000") {
success=true;
ExtensionEfax.cache.has_credentials=result["ha"];
} else if(result["code"]=="0" &&
result["desc"]=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, "Failed to save fax settings",
false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(success);
}
}
ExtensionEfax.store.handleValidateUser=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var timeout=false;
var success=false;
var ret=false;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result["code"]=="20000000") {
if(result["va"]==1) {
ret=true;
}
success=true;
} else if(result["code"]=="0" &&
result["desc"]=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true,
"Failure occurred while validating eFax user", false);
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(ret);
}
}
ExtensionEfax.store.handleHasCredentials=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var timeout=false;
var success=false;
var ret=false;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result["code"]=="20000000") {
ret=result["ha"];
ExtensionEfax.cache.has_credentials=ret;
success=true;
} else if(result["code"]=="0" &&
result["desc"]=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(note) {
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true,
"Failure occurred while checking eFax credentials", false);
}
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(ret);
}
}
ExtensionEfax.store.handleEmailAddress=function() {
var aliases=ApplicationEmail.i_preferences.aliases();
if(aliases!=undefined) {
for(var i=0; i < aliases.length; i++) {
if(aliases[i].is_default || i==0) {
ExtensionEfax.cache.email_address=aliases[i].address;
if(aliases[i].is_default) {
break;
}
}
}
}
ExtensionEfax.store.email_address_pending=false;
for(var i=0; i < ExtensionEfax.store.email_address_handlers.length;
i++) {
ExtensionEfax.store.email_address_handlers[i].execute(ExtensionEfax.cache.email_address);
}
}
ExtensionEfax.store.handleSignupURL=function(data, xml, req, params) {
var handler=params[0];
var timeout=false;
var ret=undefined;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result["code"]=="20000000") {
ret=result["su"];
ExtensionEfax.cache.signup_url=ret;
} else if(result["code"]=="0" &&
result["desc"]=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(ret);
}
}
ExtensionEfax.store.handleSendNewUserEmail=function(data, xml, req,
params) {
var handler=params[0];
var timeout=false;
var ret=false;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result["code"]=="20000000") {
ret=true;
} else if(result["code"]=="0" &&
result["desc"]=="Invalid session") {
timeout=true;
}
} catch(e) { }
}
if(timeout) {
sessionTimeout(true, true);
} else if(handler!=undefined) {
handler.execute(ret);
}
}
ExtensionEfax.inherit(Application);
SystemCore.registerApplication(new ExtensionEfax());
JavaScriptResource.notifyComplete("./src/Extensions/Efax/Extension.Efax.js");
JavaScriptResource.notifyComplete("./btExtEfaxCore.js");
