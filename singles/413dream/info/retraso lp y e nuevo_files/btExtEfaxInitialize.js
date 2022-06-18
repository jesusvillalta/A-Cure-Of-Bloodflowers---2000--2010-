function EfaxMessage() {
this.i_subject=undefined;
this.i_body=undefined;
this.i_recipients=undefined;
this.i_message_id=undefined;
this.i_attachments=undefined;
this.i_card=undefined;
this.i_cover_page=true;
this.i_window_name;
}
EfaxMessage.prototype.getSubject=function() {
return this.i_subject;
}
EfaxMessage.prototype.getBody=function() {
return this.i_body;
}
EfaxMessage.prototype.getRecipients=function() {
return this.i_recipients;
}
EfaxMessage.prototype.getMessageId=function() {
return this.i_message_id;
}
EfaxMessage.prototype.getAttachments=function() {
return this.i_attachments;
}
EfaxMessage.prototype.getCard=function() {
return this.i_card;
}
EfaxMessage.prototype.getWindowName=function() {
return this.i_window_name;
}
EfaxMessage.prototype.hasCoverPage=function() {
return this.i_cover_page;
}
EfaxMessage.prototype.setSubject=function(subject) {
this.i_subject=subject;
}
EfaxMessage.prototype.setBody=function(body) {
this.i_body=body;
}
EfaxMessage.prototype.setRecipients=function(recipients) {
this.i_recipients=recipients;
}
EfaxMessage.prototype.setMessageId=function(id) {
this.i_message_id=id;
}
EfaxMessage.prototype.setAttachments=function(attachments) {
this.i_attachments=attachments;
}
EfaxMessage.prototype.setCard=function(card) {
this.i_card=card;
}
EfaxMessage.prototype.setWindowName=function(window_name) {
this.i_window_name=window_name;
}
EfaxMessage.prototype.setHasCoverPage=function(has_cover_page) {
this.i_cover_page=has_cover_page;
}
EfaxMessage.prototype.isOnDemand=function() {
return (this.i_card ? true : false);
}
EfaxMessage.prototype.validate=function(on_demand) {
var ret=true;
var error_msg=undefined;
if(this.i_recipients==undefined || this.i_recipients.length==0) {
error_msg="You must enter at least one recipient.";
}
if(this.i_recipients!=undefined && this.i_recipients.length > 10) {
error_msg="A maximum of 10 recipients is supported. Please "+"remove one or more recipient and try again.";
}
if((this.i_message_id==undefined || this.i_message_id.length==0) &&
this.i_attachments!=undefined && this.i_attachments.length > 0) {
error_msg="Internal error: No message id is defined, but "+"attachments exist.";
}
if(this.i_attachments!=undefined && this.i_attachments.length > 5) {
error_msg="A maximum of 5 attachments is supported. Please remove "+"one or more attachments and try again.";
}
if(this.i_recipients!=undefined) {
try {
for(var x=0; x < this.i_recipients.length;++x) {
this.i_recipients[x].validate(on_demand);
}
} catch(e) {
error_msg=e;
}
}
if(error_msg!=undefined) {
ret=false;
throw(error_msg);
}
return ret;
}
EfaxMessage.prototype.toXML=function() {
var xml="<message>";
if(this.i_subject!=undefined) {
xml+="<subject>"+htmlEncode(this.i_subject)+"</subject>";
}
if(this.i_body!=undefined) {
xml+="<body>"+htmlEncode(this.i_body)+"</body>";
}
xml+="<coversheet>"+(this.i_cover_page ? "1" : "0")+"</coversheet><recipients>";
for(var x=0; x < this.i_recipients.length;++x) {
xml+=this.i_recipients[x].toXML();
}
xml+="</recipients>";
if(this.i_message_id!=undefined && this.i_attachments.length > 0) {
xml+="<attachments><messageid>"+htmlEncode(this.i_message_id)+"</messageid>";
for(var x=0; x < this.i_attachments.length;++x) {
xml+=this.i_attachments[x].toXML();
}
xml+="</attachments>";
}
xml+="</message>";
return xml;
}
JavaScriptResource.notifyComplete("./src/Extensions/Efax/objects/Object.EfaxMessage.js");
function EfaxMessageAttachment(name, size, id) {
this.i_name=name;
this.i_size=size;
this.i_id=String(id);
this.i_valid=true;
}
EfaxMessageAttachment.prototype.getName=function() {
return this.i_name;
}
EfaxMessageAttachment.prototype.getSize=function() {
return this.i_size;
}
EfaxMessageAttachment.prototype.getId=function() {
return this.i_id;
}
EfaxMessageAttachment.prototype.isValid=function() {
return this.i_valid;
}
EfaxMessageAttachment.prototype.setName=function(name) {
this.i_name=name;
}
EfaxMessageAttachment.prototype.setSize=function(size) {
this.i_size=parseInt(size);
}
EfaxMessageAttachment.prototype.setId=function(id) {
this.i_id=String(id);
}
EfaxMessageAttachment.prototype.setValid=function(valid) {
this.i_valid=(valid ? true : false);
}
EfaxMessageAttachment.prototype.toXML=function() {
return "<attachment><filename>"+htmlEncode(this.i_name)+"</filename><attachmentid>"+htmlEncode(this.i_id)+"</attachmentid></attachment>";
}
JavaScriptResource.notifyComplete("./src/Extensions/Efax/objects/Object.EfaxMessageAttachment.js");
function EfaxMessageRecipient(name, number, company) {
this.i_name=name;
this.i_number=number;
this.i_company=company;
}
EfaxMessageRecipient.prototype.getName=function() {
return this.i_name;
}
EfaxMessageRecipient.prototype.getNumber=function() {
return this.i_number;
}
EfaxMessageRecipient.prototype.getCompanyName=function() {
return this.i_company;
}
EfaxMessageRecipient.prototype.setName=function(name) {
this.i_name=name;
}
EfaxMessageRecipient.prototype.setNumber=function(number) {
this.i_number=number;
}
EfaxMessageRecipient.prototype.setCompanyName=function(name) {
this.i_company=name;
}
EfaxMessageRecipient.prototype.validate=function(on_demand) {
var ret=false;
var error_msg=undefined;
if(this.i_number==undefined || this.i_number.length==0) {
error_msg="Internal error: Recipient has no number defined.";
}
if(error_msg!=undefined) {
ret=false;
throw(error_msg);
}
return ret;
}
EfaxMessageRecipient.prototype.toXML=function() {
var ret="<recipient><faxnumber>"+htmlEncode(this.i_number)+"</faxnumber>";
if(this.i_name!=undefined) {
ret+="<name>"+htmlEncode(this.i_name)+"</name>";
}
if(this.i_company!=undefined) {
ret+="<company>"+htmlEncode(this.i_company)+"</company>";
}
ret+="</recipient>";
return ret;
}
JavaScriptResource.notifyComplete("./src/Extensions/Efax/objects/Object.EfaxMessageRecipient.js");
function EfaxContactsInterface() {
this.i_new_contacts=false;
this.i_add_number_window=undefined;
EfaxContactsInterface.obj=this;
}
EfaxContactsInterface.prototype.initialize=function() {
if(typeof(ApplicationContacts)!="undefined") {
this.i_new_contacts=true;
} else if(typeof(ApplicationOldContacts)!="undefined") {
this.i_new_contacts=false;
ApplicationOldContacts.enableEfax();
}
}
EfaxContactsInterface.prototype.newFax=function(uuids) {
ExtensionEfax.store.log(404, "contacts");
if(uuids!=undefined) {
if(this.i_new_contacts) {
} else {
if(typeof(uuids)=="string") {
uuids=[uuids];
}
var recipients=Array();
for(var i=0; i < uuids.length; i++) {
var contact=SimpleClickDataCache.uuidHash[uuids[i]].value;
if(contact.fax!=undefined) {
recipients.push(new EfaxMessageRecipient(contact.name,
contact.fax));
}
}
var message=new EfaxMessage();
message.setRecipients(recipients);
ExtensionEfax.obj.composeFax(message);
}
}
}
EfaxContactsInterface.prototype.addToMyContact=function(number, handler) {
if(this.i_add_number_window==undefined) {
this.i_add_number_window=new EfaxNewNumberWindow(this);
this.i_add_number_window.titleBar().removeButton(Application.i_title_dock);
}
this.i_add_number_window.open(number, handler);
}
EfaxContactsInterface.prototype.refreshContacts=function() {
if(this.i_new_contacts) {
} else {
var contacts_app=SystemCore.activeApplication();
if(contacts_app.id()=="2005") {
var contacts_window=contacts_app.i_contacts_window;
if(contacts_window!=undefined) {
var contacts_frame=contacts_window.getFrame();
if(contacts_frame!=undefined) {
var contacts_content=contacts_frame.contentWindow;
if(contacts_content!=undefined) {
var contacts_view=contacts_content.contactView;
var contacts_preview=contacts_content.document.getElementById("contactPreview");
if(contacts_view!=undefined &&
contacts_view.currentSelection.length > 0 &&
contacts_preview!=undefined &&
contacts_preview.style.display!="none") {
var fake_event=new Object();
if(document.all) {
fake_event.currentTarget=new Object();
fake_event.currentTarget.parentNode=contacts_view.currentSelection[0];
} else {
fake_event.srcElement=contacts_view.currentSelection[0];
}
fake_event.shiftKey=false;
fake_event.ctrlKey=false;
contacts_view.onClickContact(fake_event);
}
}
}
}
}
}
}
EfaxContactsInterface.store={};
EfaxContactsInterface.store.get_handler=undefined;
EfaxContactsInterface.store.update_handler=undefined;
EfaxContactsInterface.store.update_note=undefined;
EfaxContactsInterface.store.getContact=function(contact_id, handler) {
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
EfaxContactsInterface.store.get_handler=handler;
contactsApp.commands.contacts_GetContact(contact_id,
"root.EfaxContactsInterface.store.handleGetContact()");
}
}
EfaxContactsInterface.store.updateContact=function(contact, handler) {
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
EfaxContactsInterface.store.update_handler=handler;
EfaxContactsInterface.store.update_note=Notifications.add("Updating contact information");
contactsApp.commands.contacts_UpdateContact(contact.get("UUID"),
contact.contactToString(),
"root.EfaxContactsInterface.store.handleUpdateContact()");
}
}
EfaxContactsInterface.store.getFaxNumbers=function(contact_id, handler) {
EfaxContactsInterface.store.getContact(contact_id, new SmartHandler(undefined, EfaxContactsInterface.store.handleGetFaxNumbers,
handler));
}
EfaxContactsInterface.store.setWorkNumber=function(contact_id, number,
handler, callback, contact) {
if(callback) {
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
if(contact!=undefined) {
contact.values["TEL-FAX-NUMBER1"]=number;
EfaxContactsInterface.store.updateContact(contact, handler);
} else if(handler!=undefined) {
handler.execute(false);
}
}
} else {
EfaxContactsInterface.store.getContact(contact_id,
new SmartHandler(undefined,
EfaxContactsInterface.store.setWorkNumber,
Array(contact_id, number, handler, true), true, true));
}
}
EfaxContactsInterface.store.setHomeNumber=function(contact_id, number,
handler, callback, contact) {
if(callback) {
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
if(contact!=undefined) {
contact.values["HOMEFAX"]=number;
EfaxContactsInterface.store.updateContact(contact, handler);
} else if(handler!=undefined) {
handler.execute(false);
}
}
} else {
EfaxContactsInterface.store.getContact(contact_id,
new SmartHandler(undefined,
EfaxContactsInterface.store.setHomeNumber,
Array(contact_id, number, handler, true), true, true));
}
}
EfaxContactsInterface.store.getMyContactId=function() {
var ret=undefined;
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
var user=SimpleClickDataCache.findUser("self");
if(user!=undefined) {
ret=user.uuid;
}
}
return ret;
}
EfaxContactsInterface.store.getMyFaxNumbers=function(handler) {
var contact_id=EfaxContactsInterface.store.getMyContactId();
if(contact_id!=undefined) {
EfaxContactsInterface.store.getFaxNumbers(contact_id, handler);
} else if(handler!=undefined) {
handler.execute(false);
}
}
EfaxContactsInterface.store.setMyWorkNumber=function(number, handler) {
var contact_id=EfaxContactsInterface.store.getMyContactId();
if(contact_id!=undefined) {
EfaxContactsInterface.store.setWorkNumber(contact_id, number,
handler);
} else if(handler!=undefined) {
handler.execute(false);
}
}
EfaxContactsInterface.store.setMyHomeNumber=function(number, handler) {
var contact_id=EfaxContactsInterface.store.getMyContactId();
if(contact_id!=undefined) {
EfaxContactsInterface.store.setHomeNumber(contact_id, number,
handler);
} else if(handler!=undefined) {
handler.execute(false);
}
}
EfaxContactsInterface.store.handleGetContact=function(index) {
var contact=undefined;
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
var data=contactsApp.handlers.readValidateData("GetContact", index);
if(data!=undefined) {
contact=new contactsApp.Contact();
contact.populate(data);
}
}
if(EfaxContactsInterface.store.get_handler!=undefined) {
EfaxContactsInterface.store.get_handler.execute(contact);
}
}
EfaxContactsInterface.store.handleGetFaxNumbers=function(contact, handler) {
var ret=false;
var work_number=undefined;
var home_number=undefined;
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
if(contact!=undefined) {
work_number=contact.get("TEL-FAX-NUMBER1");
home_number=contact.get("HOMEFAX");
ret=true;
}
}
if(handler!=undefined) {
handler.execute(Array(ret, work_number, home_number), true);
}
}
EfaxContactsInterface.store.handleUpdateContact=function(index) {
var ret=false;
if(EfaxContactsInterface.obj.i_new_contacts) {
} else {
var data=contactsApp.handlers.readValidateData("GetContact", index);
if(data!=undefined) {
var types=["contact", "econtact", "scontact"];
for(var i=0; i < types.length;++i) {
var contact_data=data.getElementsByTagName(types[i]);
if(contact_data[0]!=undefined) {
var uuid=contact_data[0].getAttribute("uuid");
var name=contact_data[0].getAttribute("name");
var email=contact_data[0].getAttribute("email");
var fax=contact_data[0].getAttribute("fax");
GridCache.clear();
SimpleClickDataCache.renameContact(uuid,
htmlEncode(name), email, fax);
ret=true;
break;
}
}
}
}
if(ret) {
Notifications.end(EfaxContactsInterface.store.update_note);
EfaxContactsInterface.obj.refreshContacts();
} else {
Notifications.end(EfaxContactsInterface.store.update_note, 3, true);
}
if(EfaxContactsInterface.store.update_handler!=undefined) {
EfaxContactsInterface.store.update_handler.execute(ret);
}
}
JavaScriptResource.notifyComplete("./src/Extensions/Efax/components/Component.EfaxContactsInterface.js");
function EfaxEmailInterface(app) {
this.i_app=app;
this.i_new_settings=undefined;
EfaxEmailInterface.obj=this;
}
EfaxEmailInterface.prototype.initialize=function() {
if(typeof(ApplicationEmail)!="undefined") {
ApplicationEmail.enableEfax();
var email=Application.getApplicationById(1007);
email.registerPreference("./btExtEfaxPreferences.js");
}
}
EfaxEmailInterface.prototype.newFax=function() {
ExtensionEfax.store.log(404, "email");
this.i_app.composeFax();
}
EfaxEmailInterface.prototype.isEfaxEmail=function(message) {
var ret=false;
if(message!=undefined) {
var from=message.from_display();
var subject=message.subject();
if(from!=undefined && from=="eFax Customer Service" &&
subject!=undefined && subject.match(/^Welcome to eFax/)) {
ret=true;
}
}
return ret;
}
EfaxEmailInterface.prototype.saveToSettings=function(message) {
if(message!=undefined) {
ExtensionEfax.store.getSettings(new SmartHandler(this,
this.handleSettings, message, false, true));
}
}
EfaxEmailInterface.prototype.handleSettings=function(message,
settings) {
var has_settings=false;
var body=message.body();
this.i_new_settings=new EfaxSettings(settings);
if(settings!=undefined) {
var username=settings.getUsername();
if(username!=undefined && username!="") {
has_settings=true;
}
}
body=body.replace(/<.*?>/g, "");
body=body.replace(/[\r\n]/g, " ");
body=body.replace(/\s+/g, " ");
var username=body.replace(/^.*eFax Number: ([\d-]+) .*$$/i, "$1");
var password=body.replace(/^.*PIN: (\d+) .*$/i, "$1");
if(username.match(/^[\d-]+$/) && password.match(/^\d+$/)) {
this.i_new_settings.setUsername(username);
this.i_new_settings.setPassword(password);
if(settings==undefined || (settings!=undefined &&
!settings.compare(this.i_new_settings))) {
if(settings!=undefined && settings.getUsername()!=undefined &&
settings.getUsername()!="") {
DialogManager.confirm("This will overwrite your existing "+"eFax settings. Is this okay?",
"Overwrite eFax Settings",
EfaxEmailInterface.handleOverwrite);
} else {
ExtensionEfax.store.validateUser(username, password,
new SmartHandler(this, this.handleValidate));
}
} else {
this.showSuccessDialog();
}
} else {
DialogManager.alert("An error occurred while reading the email "+"message. Please try again later.");
}
}
EfaxEmailInterface.prototype.handleValidate=function(result) {
if(result) {
ExtensionEfax.store.setSettings(this.i_new_settings, new SmartHandler(this, this.handleSave));
} else {
DialogManager.alert("The eFax username and password contained in "+"the email message are invalid or have expired. Please check "+"the credentials and try again.");
}
}
EfaxEmailInterface.prototype.handleSave=function(result) {
if(result) {
this.showSuccessDialog();
ExtensionEfax.store.sendNewUserEmail();
} else {
DialogManager.alert("An error occurred while saving your eFax "+"settings. Please try again later.");
}
}
EfaxEmailInterface.prototype.showSuccessDialog=function() {
if(ExtensionEfax.has_contacts) {
this.i_app.addNumberToMyContact(this.i_new_settings.getUsername());
}
}
EfaxEmailInterface.handleOverwrite=function(button_text) {
if(button_text=="OK") {
ExtensionEfax.store.validateUser(EfaxEmailInterface.obj.i_new_settings.getUsername(),
EfaxEmailInterface.obj.i_new_settings.getPassword(),
new SmartHandler(EfaxEmailInterface.obj,
EfaxEmailInterface.obj.handleValidate));
}
}
JavaScriptResource.notifyComplete("./src/Extensions/Efax/components/Component.EfaxEmailInterface.js");
function EfaxFilesInterface(app) {
this.i_app=app;
this.i_initialized=false;
this.i_new_files=false;
EfaxFilesInterface.obj=this;
}
EfaxFilesInterface.prototype.initialize=function() {
if(typeof(ApplicationOldFiles)!="undefined") {
this.i_initialized=true;
this.i_new_files=false;
ApplicationOldFiles.enableEfax();
}
}
EfaxFilesInterface.prototype.newFax=function(root_id, folder_id, file_ids) {
ExtensionEfax.store.log(404, "files");
ExtensionEfax.store.hasCredentials(new SmartHandler(this,
this.handleCredentials, Array(root_id, folder_id, file_ids),
true));
}
EfaxFilesInterface.prototype.handleCredentials=function(result, root_id,
folder_id, file_ids) {
var window=undefined;
if(result==EFAX_CREDENTIALS_VALID) {
window=this.i_app.preopenComposeWindow();
}
EfaxFilesInterface.store.attachMultipleFiles(undefined, root_id, folder_id,
file_ids, new SmartHandler(this, this.handleAttachments,
window, false));
}
EfaxFilesInterface.prototype.handleAttachments=function(message, success,
window) {
if(success) {
this.i_app.composeFax(message, undefined, window);
} else {
if(window!=undefined) {
window.close();
}
DialogManager.alert("An error occurred while attaching files. "+"Please try again later.");
}
}
EfaxFilesInterface.store=Array();
EfaxFilesInterface.store.attachMultipleFiles=function(message, root_id,
folder_id, file_ids, handler) {
if(file_ids!=undefined && file_ids.length > 0) {
var next_file_ids=Array();
for(var x=1; x < file_ids.length;++x) {
next_file_ids.push(file_ids[x]);
}
EfaxFilesInterface.store.attachFile(message, root_id, folder_id,
file_ids[0], new SmartHandler(this,
EfaxFilesInterface.store.handleAttachMultipleFiles,
Array(root_id, folder_id, next_file_ids, handler),
true, true));
} else if(handler!=undefined) {
handler.execute(Array(message, true), true);
}
}
EfaxFilesInterface.store.attachFile=function(message, root_id, folder_id,
file_id, handler) {
var post=new ResourcePost();
var note=Notifications.add("Attaching file");
post.param("unm", user_prefs["user_name"]);
post.param("sid", user_prefs["session_id"]);
post.param("cf", folder_id);
post.param("root_id", root_id);
post.param("file_id", file_id);
if(message!=undefined) {
post.param("csid", message.getMessageId());
}
ResourceManager.request("/Ioffice/FilingCabinet/attach_item_json.asp?"+post.toString(), 1, EfaxFilesInterface.store.handleAttachFile,
undefined, Array(handler, note, message), undefined);
}
EfaxFilesInterface.store.handleAttachMultipleFiles=function(root_id,
folder_id, file_ids, handler, message, success) {
if(success) {
if(file_ids.length > 0) {
EfaxFilesInterface.store.attachMultipleFiles(message, root_id,
folder_id, file_ids, handler);
} else if(handler!=undefined) {
handler.execute(Array(message, true), true);
}
} else if(handler!=undefined) {
handler.execute(Array(message, false), true);
}
}
EfaxFilesInterface.store.handleAttachFile=function(data, xml, req, params) {
var handler=params[0];
var note=params[1];
var message=params[2];
var success=false;
if(data.length > 0) {
try {
var result=eval("( "+data+" )");
if(result["code"]=="20000000") {
if(message==undefined) {
message=new EfaxMessage();
message.setMessageId(result["ci"]);
}
var attachments=message.getAttachments();
if(attachments==undefined) {
attachments=Array();
}
attachments.push(new EfaxMessageAttachment(result["fn"],
result["fs"], result["fi"]));
message.setAttachments(attachments);
success=true;
}
} catch(e) { }
}
if(success) {
Notifications.end(note);
} else {
Notifications.end(note, undefined, true, "Failed to attach file",
false);
}
if(handler!=undefined) {
handler.execute(Array(message, success), true);
}
}
JavaScriptResource.notifyComplete("./src/Extensions/Efax/components/Component.EfaxFilesInterface.js");
function EfaxSignupWindow() {
this.i_window=undefined;
this.i_email_address=undefined;
this.i_contact=undefined;
this.i_signup_url=undefined;
this.i_have_email_address=false;
this.i_have_contact=false;
this.i_have_signup_url=false;
}
EfaxSignupWindow.prototype.open=function() {
if(this.preopenWindow()) {
if(this.i_have_email_address && this.i_have_contact &&
this.i_have_signup_url) {
this.openWindow();
} else {
var note=Notifications.add("Retrieving user information");
ExtensionEfax.store.getEmailAddress(new SmartHandler(this,
this.handleGetEmailAddress, note));
}
}
}
EfaxSignupWindow.prototype.preopenWindow=function() {
var ret=true;
if(this.i_window==undefined || this.i_window.closed) {
this.i_window=window.open(user_prefs["root_dir"]+"/gds/blank.html", "", "width=800, height=600, "+"toolbar=yes, location=yes, resizable=yes, scrollbars=yes");
if(this.i_window==undefined) {
ret=false;
DialogManager.alert("There was a problem opening the eFax "+"sign up window. Please make sure that popup blocking is "+"disabled in your browser and try again.");
}
} else {
this.i_window.focus();
ret=true;
}
return ret;
}
EfaxSignupWindow.prototype.openWindow=function() {
var params="";
if(this.i_window!=undefined) {
if(this.i_contact!=undefined) {
params+="&firstname="+encodeURIComponent(this.i_contact.get("N-GIVEN"));
params+="&lastname="+encodeURIComponent(this.i_contact.get("N-FAMILY"));
}
if(this.i_email_address!=undefined) {
params+="&email="+encodeURIComponent(this.i_email_address);
params+="&confirmemail="+encodeURIComponent(this.i_email_address);
}
if(this.i_signup_url!=undefined) {
ExtensionEfax.store.log(403, "");
this.i_window.location=this.i_signup_url+params;
this.i_window.focus();
} else {
this.i_window.close();
}
}
}
EfaxSignupWindow.prototype.handleGetEmailAddress=function(email_address,
note) {
this.i_have_email_address=true;
this.i_email_address=email_address;
ExtensionBilling.store.getContact(new SmartHandler(this,
this.handleGetContact, note));
}
EfaxSignupWindow.prototype.handleGetContact=function(contact, note) {
this.i_have_contact=true;
this.i_contact=contact;
ExtensionEfax.store.getSignupURL(new SmartHandler(this,
this.handleSignupURL, note));
}
EfaxSignupWindow.prototype.handleSignupURL=function(url, note) {
this.i_have_signup_url=true;
this.i_signup_url=url;
Notifications.end(note);
this.open();
}
JavaScriptResource.notifyComplete("./src/Extensions/Efax/components/Component.EfaxSignupWindow.js");
JavaScriptResource.notifyComplete("./btExtEfaxInitialize.js");
