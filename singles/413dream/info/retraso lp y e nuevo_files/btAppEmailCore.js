var REFRESH_FOLDER_TREE_ON_INBOX=true;		
function ApplicationEmail() {
this.superApplication();
this.id(1007);	
this.name("Email");
this.smallIcon("ApplicationEmail_small");	
this.largeIcon("ApplicationEmail");		
this.loadingOrder(3);
this.registerPreference("./btAppEmailPreferences.js");
EventHandler.register(this, "oninitialize", this.handleInitialize, this);
EventHandler.register(this, "onintegrate", this.handleIntegration, this);
EventHandler.register(this, "onload", this.handleLoad, this);
EventHandler.register(SystemCore.layoutManager(), "onlayoutsave", this.handleLayoutChange, this);
EventHandler.register(SystemCore.layoutManager(), "onconfigurationchange", this.handleLayoutChange, this);
EventHandler.register(SystemCore, "onchangeapplication", this.handleAppChange, this);
ApplicationEmail.i_can_haz_draft=Array();
ApplicationEmail.email_windows=Array();
ApplicationEmail.email_window_params=Array();
ApplicationEmail.compose_window=undefined;
ApplicationEmail.print_window=undefined;
ApplicationEmail.new_message_timer=undefined;
ApplicationEmail.quota_display_refresh=false;
ApplicationEmail.travelEnabled=false;
}
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
ApplicationEmail.MoveSaveTarget=undefined;
ApplicationEmail.MoveSaveDestination=undefined;
ApplicationEmail.MoveSaveDestFolderObj=undefined;
ApplicationEmail.MoveSaveFolderSelected=false;
ApplicationEmail.MoveSaveType=undefined;
ApplicationEmail.MoveSaveSelection=undefined;
ApplicationEmail.prototype.handleInitialize=function(e) {
var request=new RequestObject("email", "getInboxCount", new DataNode("params"));
EventHandler.register(request, "oncomplete", this.handleInboxCount, this);
request.execute();
this.i_el=new WindowObject('eml-messages', "Emails", 100, 100, Application.titleBarFactory());
this.i_fl=new WindowObject('eml-folders', Language.load(lang.email.folders), 100, 100, Application.titleBarFactory());
this.i_eq=new WindowObject('eml-quota', Language.load(lang.email.quota), 100, 100, Application.titleBarFactory());
this.i_eq.minimumHeight(57);
this.i_ep=new WindowObject('eml-preview', Language.load(lang.email.messages), 100, 100, Application.titleBarFactory());
this.i_ep.minimumHeight(200);
this.i_el.titleBar().removeButton(Application.i_title_close);
this.i_fl.titleBar().removeButton(Application.i_title_close);
this.i_eq.titleBar().removeButton(Application.i_title_close);
this.i_ep.titleBar().removeButton(Application.i_title_close);
this.i_ep.titleBar().removeButton(Application.i_title_minimize);
this.i_ep.titleBar().addButton(new IconButton("IconButton_Minimize", 9, 9, 16, 16, "Minimize Window", ApplicationEmail.handlePreviewMinimize));
this.i_nav_button=SystemCore.navigationBar().addButton(new NavigationButton(this.id(), this.name(), this.largeIcon(), this.smallIcon()));
EventHandler.register(this.i_nav_button, "onclick", this.launchApplication, this);
EventHandler.register(this.i_nav_button, "onclick", this.refreshInbox, this);
if(ApplicationEmail.i_preferences==undefined) {
ApplicationEmail.i_preferences_loaded=true;
ApplicationEmail.store.getGeneralSettings(ApplicationEmail.handle_initial_preferences_load, undefined);
}
this.i_shortcut_new_email=SystemCore.shortcutPane().addShortcut(new ShortcutLink("New Email", this.smallIcon()));
EventHandler.register(this.i_shortcut_new_email, "onclick", ApplicationEmail.handleNewEmailShortcut);
ApplicationEmail.finish_initializing();
this.i_list_all_hotkey=new HotKey('A'.charCodeAt(0), HotKey.ctrlKey, ApplicationEmail.handleHotKeySelectAll);
this.i_scroll_up_hotkey=new HotKey(38, 0, ApplicationEmail.handleHotKeyScrollUp);
this.i_scroll_down_hotkey=new HotKey(40, 0, ApplicationEmail.handleHotKeyScrollDown);
this.i_close_preview_hotkey=new HotKey(27, 0, ApplicationEmail.handleHotKeyClosePreview);
this.i_open_enter_hotkey=new HotKey(13, 0, ApplicationEmail.handleHotKeyOpen);
this.i_open_hotkey=new HotKey('O'.charCodeAt(0), HotKey.ctrlKey, ApplicationEmail.handleHotKeyOpen);
this.i_print_hotkey=new HotKey('P'.charCodeAt(0), HotKey.ctrlKey, ApplicationEmail.handleHotKeyPrint);
this.i_delete_hotkey=new HotKey(46, 0, ApplicationEmail.handleHotKeyDelete);
this.i_forward_hotkey=new HotKey('F'.charCodeAt(0), HotKey.ctrlKey, ApplicationEmail.handleHotKeyForward);
this.i_reply_hotkey=new HotKey('R'.charCodeAt(0), HotKey.ctrlKey, ApplicationEmail.handleHotKeyReply);
this.i_reply_all_hotkey=new HotKey('R'.charCodeAt(0), HotKey.ctrlKey+HotKey.shiftKey, ApplicationEmail.handleHotKeyReplyAll);
}
ApplicationEmail.finish_initializing=function() {
var email_list=WindowObject.getWindowById('eml-messages');
email_list.loadContent(ApplicationEmail.getMessageListContents());
email_list.onresize=ApplicationEmail.updateListDimensions;
ApplicationEmail.updateListDimensions(email_list.effectiveWidth(), email_list.effectiveHeight());
var preview_pane=WindowObject.getWindowById('eml-preview');
preview_pane.loadContent(ApplicationEmail.getPreviewPane().getPreviewPane());
preview_pane.onresize=ApplicationEmail.updatePreviewDimensions;
ApplicationEmail.updatePreviewDimensions(preview_pane.effectiveWidth(), preview_pane.effectiveHeight());
var folder_tree=WindowObject.getWindowById('eml-folders');
ApplicationEmail.i_folder_wrapper=document.createElement('DIV');
ApplicationEmail.i_folder_wrapper.className="email_tree";
ApplicationEmail.i_folder_wrapper.appendChild(ApplicationEmail.getFolderTree().getTree());	
folder_tree.onresize=ApplicationEmail.updateFolderTreeDimensions;
folder_tree.loadContent(ApplicationEmail.i_folder_wrapper);	
ApplicationEmail.updateFolderTreeDimensions(folder_tree.effectiveWidth(), folder_tree.effectiveHeight());
var quota_bar=WindowObject.getWindowById('eml-quota');
ApplicationEmail.i_quota=new EmailQuota();
quota_bar.loadContent(ApplicationEmail.i_quota.getContent());
var constant_contact=WindowObject.getWindowById('ecc');
ApplicationEmail.i_folder_ref=Array();
}
ApplicationEmail.prototype.handleIntegration=function(e) {
if(SystemCore.hasApp(1020)) {
var my_day=Application.getApplicationById(1020);
my_day.getUniversalInbox().addItem(this.getUniversalInboxItem());
}
}
ApplicationEmail.prototype.handleLoad=function(e) {
this.i_nav_button.selectedState(true);
if (ApplicationEmail.i_first_folder!=true) {
ApplicationEmail.store.getFolders();
ApplicationEmail.i_first_folder=true;
}
else {
ApplicationEmail.view_new_messages();
}
if(ApplicationEmail.i_preferences) {
WindowObject.getWindowById('eml-preview').minimized(!ApplicationEmail.i_preferences.preview_enabled());
}
this.i_list_all_hotkey.register();
this.i_scroll_up_hotkey.register();
this.i_scroll_down_hotkey.register();
this.i_close_preview_hotkey.register();
this.i_open_enter_hotkey.register();
this.i_open_hotkey.register();
this.i_print_hotkey.register();
this.i_forward_hotkey.register();
this.i_reply_hotkey.register();
this.i_reply_all_hotkey.register();
this.i_delete_hotkey.register();
}
ApplicationEmail.prototype.refreshInbox=function() {
if (ApplicationEmail.i_inbox_folder!=undefined) {
ApplicationEmail.getDataModel().forceNext();
var efWin=WindowObject.getWindowById('eml-messages');
efWin.name('Emails: INBOX');
ApplicationEmail.getDataModel().activeFolder(ApplicationEmail.i_inbox_folder);
ApplicationEmail.getPreviewPane().activePreview(false);
}
}
ApplicationEmail.handle_initial_preferences_load=function(prefs_obj) {
ApplicationEmail.i_preferences=new EmailPreferences();
ApplicationEmail.i_preferences=prefs_obj;
ApplicationEmail.setup_new_message_check();
if(ApplicationEmail.i_preferences.messages_per_page()!=50) {
ApplicationEmail.i_messageList.pageLength(parseInt(ApplicationEmail.i_preferences.messages_per_page()));
ApplicationEmail.i_data_model.block_size=parseInt(ApplicationEmail.i_preferences.messages_per_page());
if (SystemCore.activeApplication()!=undefined) {
if((SystemCore.activeApplication().name()=='Email') &&
(ApplicationEmail.i_inbox_folder!=undefined)) {
ApplicationEmail.view_new_messages();
}
}
}
WindowObject.getWindowById('eml-preview').minimized(!ApplicationEmail.i_preferences.preview_enabled());
}
ApplicationEmail.handlePreviewMinimize=function() {
var hadTimer=SystemCore.layoutManager().i_timer;
var app=Application.getApplicationById(1007);
Application.handleMinimize.apply(app, arguments);
app.handleLayoutChange(null);
var msg=ApplicationEmail.current_message;
if (msg && !WindowObject.getWindowById('eml-preview').minimized()) {
if (!msg.i_has_details) ApplicationEmail.store.getMessage(msg, ApplicationEmail.loadMessage);
else ApplicationEmail.loadMessage(msg);
if (msg.is_new()) ApplicationEmail.getDataModel().markSelectedRead();
}
if (!hadTimer) SystemCore.layoutManager().clearChangeTimer();
}
ApplicationEmail.prototype.handleAppChange=function(e) {
if (e.newApplication==this && ApplicationEmail.i_preferences && this.i_ep) {
var appState=ApplicationEmail.i_preferences.preview_enabled();
if (appState==this.i_ep.minimized()) {
var hadTimer=SystemCore.layoutManager().i_timer;
this.i_ep.minimized(!appState);
if (!hadTimer) SystemCore.layoutManager().clearChangeTimer();
}
}
}
ApplicationEmail.prototype.handleLayoutChange=function(e) {
var enabled=null, appState=null;
if (this.i_ep) { 
enabled=!this.i_ep.minimized();
} else if (e.configuration) { 
var apps=e.configuration.i_applications;
for (var o in apps) {
if (apps[o].i_id==this.id()) {
var pods=apps[o].dataNode().xPath("column/pod");
for (var i=0; i < pods.length;++i) {
if (pods[i].attribute("id")=="eml-preview") {
enabled=(pods[i].attribute("minimized")=="false");
break;
}
}
break;
}
}
}
if (ApplicationEmail.i_preferences) { 
appState=ApplicationEmail.i_preferences.preview_enabled();
}
if (this.i_ep && this.i_ep.minimized()==enabled && enabled!=null) {
var hadTimer=SystemCore.layoutManager().i_timer;
this.i_ep.minimized(!enabled);
if (!hadTimer) SystemCore.layoutManager().clearChangeTimer();
}
if (appState!=enabled && enabled!=null && appState!=null) {
var params=new DataNode("params");
params.addNode(new DataNode("preview", enabled ? "1" : "0"));
var request=new RequestObject("email","setEmailPrefGeneral",params);
request.execute();
if (ApplicationEmail.i_preferences) ApplicationEmail.i_preferences.i_preview_enabled=enabled;
}
}
ApplicationEmail.handleHotKeySelectAll=function() {
ExtensionBannerAds.refreshAll();
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList();
m.selectPage();
}
return true;
}
ApplicationEmail.handleHotKeyForward=function() {
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList().dataModel().getSelectedMessages();
if (m.length > 0) {
ApplicationEmail.handleForward(undefined, m[0]);
}
}
return true;
}
ApplicationEmail.handleHotKeyReply=function() {
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList().dataModel().getSelectedMessages();
if (m.length > 0) {
ApplicationEmail.handleReply(undefined, m[0]);
}
return true; 
}
return false;
}
ApplicationEmail.handleHotKeyReplyAll=function() {
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList().dataModel().getSelectedMessages();
if (m.length > 0) {
ApplicationEmail.handleReplyAll(undefined, m[0]);
}
return true; 
}
return false;
}
ApplicationEmail.handleHotKeyOpen=function() {
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList().dataModel().getSelectedMessages();
if (m.length > 0) {
var message=m[0];
if(message.folder_id()==ApplicationEmail.i_draft_folder) {
ApplicationEmail.newEmail(message, 4);
} else {
ApplicationEmail.printMessage(message, true);
}
}
return true; 
}
return false;
}
ApplicationEmail.handleHotKeyPrint=function() {
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList().dataModel().getSelectedMessages();
if (m.length > 0) {
var message=m[0];
ApplicationEmail.printMessage(message);
}
return true; 
}
return false;
}
ApplicationEmail.handleHotKeyDelete=function() {
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList().selectedIndexes();;
if (m.length > 0) {
DialogManager.confirm("Are you sure you want to delete the selected message?", "Delete Message", ApplicationEmail.handleHotKeyDelete2, Array("Yes", "No"));
}
}
return true;
}
ApplicationEmail.handleHotKeyClosePreview=function() {
if (SystemCore.activeApplication().id()==1007) {
WindowObject.getWindowById('eml-preview').minimized(true);
}
return true;
}
ApplicationEmail.handleHotKeyDelete2=function(button_text, dialog) {
if (SystemCore.activeApplication().id()==1007) {
if (button_text=="Yes") {
ApplicationEmail.handleDelete();
}
}
return true;
}
ApplicationEmail.handleHotKeyScrollUp=function() {
return ApplicationEmail.handleHotKeyScroll(true);
}
ApplicationEmail.handleHotKeyScrollDown=function() {
return ApplicationEmail.handleHotKeyScroll(false);
}
ApplicationEmail.handleHotKeyScroll=function(isScrollUp) {
if (SystemCore.activeApplication().id()==1007) {
var m=ApplicationEmail.getMessageList();
var selInx=m.selectedIndexes();
var pageStart=(m.page() - 1) * m.pageLength();
var pageEnd=pageStart+m.pageLength();
pageEnd=parseInt(pageEnd > m.entries() ? m.entries() : pageEnd);
var i=parseInt(selInx[0]);
if (i!=undefined) {
if (i < pageEnd) {
var newIndex=parseInt(i)+(isScrollUp ? -1 : 1);
if (newIndex < pageEnd && newIndex > -1) {
m.clearSelected();
m.rowSelected(newIndex, true);
m.refresh();
var ent=m.dataModel().getEntries(newIndex, 1);
ApplicationEmail.handleLoadMessage(ent[0]);
if (isScrollUp && m.scrollPosition() > 0) {
m.scrollPosition(m.scrollPosition() - 1);
} else if (!isScrollUp && m.scrollPosition() < m.actualPageLength()  - m.possibleEntries()) {
m.scrollPosition(m.scrollPosition()+1);
}
}
}
}
}
return true;
}
ApplicationEmail.loadSecureSend=function() {
var app_email=Application.getApplicationById(1007);
var ss_window=app_email.i_ss;
if(ss_window==undefined) {
ss_window=new WindowObject('ss', Language.load(lang.email.secure_send), 600, 400, Application.titleBarFactory());
ss_window.titleBar().removeButton(Application.i_title_dock);	
app_email.i_ss=ss_window;
}
ss_window.popWindow(600, 400, true);
var menubar_url="/Ioffice/SecureSend/ssend_nav.asp";
var mainwin_url="/Ioffice/SecureSend/SDInbox.asp";
var url_args="?gds=1&unm="+user_prefs["user_name"]+"&sid="+user_prefs["session_id"]+"&enm="+user_prefs['enterprise_name'];
var frame_holder=document.createElement('DIV');
frame_holder.style.width="100%";
frame_holder.style.overflow="hidden";
var nav_frame=document.createElement("IFRAME");
nav_frame.name="app_nav";
nav_frame.frameBorder=0;
nav_frame.scrolling="NO";
nav_frame.style.width="100%";
nav_frame.style.height="25px";
nav_frame.src=menubar_url+url_args;
frame_holder.appendChild(nav_frame);
var main_frame=document.createElement("IFRAME");
main_frame.name="app_main";
main_frame.frameBorder=0;
main_frame.style.width="100%";
main_frame.src=mainwin_url+url_args;
ss_window.i_main_frame=main_frame;
frame_holder.appendChild(main_frame);
ss_window.loadContent(frame_holder);
ss_window.onresize=ApplicationEmail.resizeSecureSend;
ApplicationEmail.resizeSecureSend(ss_window.effectiveWidth(),
ss_window.effectiveHeight());
}
ApplicationEmail.resizeSecureSend=function(width, height) {
var ss_window=WindowObject.getWindowById("ss");
if(ss_window.visible() && ss_window.i_main_frame!=undefined) {
var height=height - 43;
if(height <=0) {
height=25;
}
ss_window.i_main_frame.style.height=height+"px";
}
}
ApplicationEmail.setup_new_message_check=function() {
if(ApplicationEmail.new_message_timer) 
clearTimeout(ApplicationEmail.new_message_timer);
if(ApplicationEmail.i_preferences.notify_new_time() > 0) {
ApplicationEmail.new_message_timer=setTimeout("ApplicationEmail.check_for_new_messages();",
60000 * ApplicationEmail.i_preferences.notify_new_time());
}
}
ApplicationEmail.check_for_new_messages=function() {
var p=new ResourcePost();
p.param("gds", "1");
p.param("act", "21");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
ResourceManager.request('/cgi-bin/emailCheckForNew.cgi', 1,
ApplicationEmail.handle_new_message_check, p,
undefined, undefined);
}
ApplicationEmail.handle_new_message_check=function(data, xml, req, params) {
if(xml!=undefined) {
if(xml.documentElement.getElementsByTagName('newMsg')[0].firstChild.data!='0') {
if(ApplicationEmail.i_preferences.notify_new_enabled()==1) {
ApplicationEmail.show_message_notification();
} else {
if(SystemCore.activeApplication().name()=='Email') {
var dm=ApplicationEmail.getDataModel();
if((dm.activeFolder()==ApplicationEmail.i_inbox_folder) && 
(dm.sortHeader().id()==1) &&
(dm.activeSearch()==undefined) &&
(ApplicationEmail.getMessageList().page()==1)) {
ApplicationEmail.getDataModel().forceNext(); 
ApplicationEmail.handleFolderRelease(ApplicationEmail.getFolderTree(), 
undefined, ApplicationEmail.i_inbox_folder_node);
} else {
ApplicationEmail.store.getFolders();
}
}
}
}
var email=Application.getApplicationById(1007);
if(SystemCore.hasApp(1020) && email.i_universal_inbox_item && 
(xml.documentElement.getElementsByTagName('msgCount').length > 0)) {
var mc=xml.documentElement.getElementsByTagName('msgCount')[0];
if(mc.getElementsByTagName('fmc')[0].getAttribute('n')) {
email.i_universal_inbox_item.value(mc.getElementsByTagName('fmc')[0].getAttribute('n'));
}
}
ApplicationEmail.setup_new_message_check();
}
}
ApplicationEmail.show_message_notification=function() {
var notif;
var window_name="NewEmailNotification";
if(ApplicationEmail.email_windows[window_name]!=null &&
typeof(ApplicationEmail.email_windows[window_name])!="undefined" &&
ApplicationEmail.email_windows[window_name].closed!=true) {
notif=ApplicationEmail.email_windows[window_name];
notif.focus();
} else {
ApplicationEmail.email_windows[window_name]=window.open("./Email.NewMessage.html?id="+user_prefs['user_name'], "", "toolbar=0,"+"location=0,directories=0,status=0,menubar=0,"+"scrollbars=1,resizable=1,width=430,height=200");
}
}
ApplicationEmail.view_new_messages=function() {
if(SystemCore.activeApplication().name()=='Email') {
if (ApplicationEmail.i_inbox_folder_node!=undefined) {
ApplicationEmail.handleFolderRelease(ApplicationEmail.getFolderTree(), undefined, ApplicationEmail.i_inbox_folder_node);
}
} else {
SystemCore.loadApplicationByName('Email');
}
}
ApplicationEmail.force_quota_refresh=function() {
ApplicationEmail.quota_display_refresh=true;
}
ApplicationEmail.getPreviewPane=function() {
if (this.i_preview==undefined) {
this.i_preview=new EmailPreview(400, 100);
var d=Array();
}
return this.i_preview;
}
ApplicationEmail.updatePreviewDimensions=function(width, height) {
var w=WindowObject.getWindowById('eml-preview');
var p=ApplicationEmail.getPreviewPane();
if (width!=undefined) {
p.width(width - 2);
}
if (height!=undefined) {
p.height(height - (w.titleBar().height()+2));
}
if(w.minimized()==false){
ApplicationEmail.getDataModel().markSelectedRead();
}
if((p.activePreview()==true) && (p.isMessageMeetingRequest()==true) && 
(width!=undefined) && (height!=undefined)) {
p.getRequestDisplay().resizeMeetingRequestForEmail(width, height);
}
}
ApplicationEmail.loadMessage=function(message) {
var pp=WindowObject.getWindowById('eml-preview');
if (!pp.minimized()) {
var preview_pane=ApplicationEmail.getPreviewPane();
ApplicationEmail.current_message=message;
preview_pane.setMessage(message);
preview_pane.activePreview(true);
}
}
ApplicationEmail.newEmail=function(message, mode, address, win) {
var newWindow=true;
if(win && win=='last') {
if(ApplicationEmail.compose_window) {
win=ApplicationEmail.compose_window;
newWindow=false;
}
}
if (mode==4 && message!=undefined && message.internal_id()) {
ApplicationEmail.i_can_haz_draft[message.internal_id()]=true;
}
if(newWindow) {
var app="def", size={ie6:[776,447], ie7:[776,402], ff2:[780,428], ff3:[780,401], def:[788,440]};
if (document.all) {
/MSIE (\d+)/.test(navigator.userAgent);
app="ie"+RegExp.$1;
} else {
/Firefox\/(\d+)/.test(navigator.userAgent);
app="ff"+RegExp.$1;
}
if (size[app]==undefined) app="def";
if (ApplicationEmail.compose_window==undefined) {
if (win==undefined || win.location==undefined) {
win=window.open("/Ioffice/Common/blank.html","","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width="+size[app][0]+",height="+size[app][1]);
}
}else {	
ApplicationEmail.compose_window=undefined;
if (win==undefined || win.location==undefined) {
win=window.open("/Ioffice/Common/blank.html","","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width="+size[app][0]+",height="+size[app][1]);
}
}
}
ApplicationEmail.compose_window=win;
if(ApplicationEmail.i_preferences && 
(!ApplicationEmail.i_preferences_loaded || 
(ApplicationEmail.i_preferences.aliases()==undefined))) {
ApplicationEmail.i_preferences_loaded=true;
ApplicationEmail.store.getPreferences(ApplicationEmail.newEmail2,
Array(message, mode, address));
} else {
if(ApplicationEmail.i_preferences==undefined) {
setTimeout("ApplicationEmail.newEmail('"+message+"',"+mode+",'"+address+"', 'last');");
} else {
ApplicationEmail.compose_window=win;
ApplicationEmail.newEmail2(Array(message, mode, address));
}
}
}
ApplicationEmail.newEmail2=function(in_params) {
var message=in_params[0];
var mode=in_params[1];
var address=in_params[2];
var window_name="SendEmail/"+Math.floor(Math.random() * 
100000);
var params=Array();
while(ApplicationEmail.email_windows[window_name]!=undefined) {
window_name="SendEmail/"+Math.floor(Math.random() *
100000);
}
if(message!=undefined) {
if(mode!=undefined && mode!=0) {
params['message']=message;
params['mode']=mode;
} else {
params['mode']=0;
params['message']=message;
}
} else {
params['mode']=0;
params['address']=address;
params['message']=undefined;
}
ApplicationEmail.email_window_params[window_name]=params;
var email_window=ApplicationEmail.compose_window;
var email_window_location=user_prefs['root_dir']+"/gds/Email.ClassicLiteCompose.html";
for (var c=0; c < app_ids.length; c++) {
if (app_ids[c]==2005) {
email_window_location=user_prefs['root_dir']+"/gds/Email.Compose.html";
}
}
if(email_window==null) {
DialogManager.alert('There was a problem opening a new compose, please make sure popup blocking is disabled in your browser and try again.');
}else{
email_window.name=window_name;
email_window.document.location=email_window_location;
ApplicationEmail.email_windows[window_name]=window;
}
}
ApplicationEmail.printMessage=function(message, no_print) {
if (!message.i_has_details) {
ApplicationEmail.store.getMessage(message, ApplicationEmail.printMessage, no_print);
if (message.is_new()) ApplicationEmail.getDataModel().markSelectedRead();
} else {
var params=Array(), email_window, window_name;
params['message']=message;
params['no_print']=no_print;
do {
window_name="Print/"+Math.floor(Math.random() * 100000);
} while(ApplicationEmail.email_windows[window_name]!=undefined);
ApplicationEmail.email_window_params[window_name]=params;
email_window=ApplicationEmail.print_window;
if (!email_window || email_window.closed || !email_window.document) {
ApplicationEmail.print_window=window.open("/Ioffice/Common/blank.html", "",
"toolbar=0,location=0,directories=0,status=0,menubar=0,"+"scrollbars=1,resizable=1,width=640,height=480");
email_window=ApplicationEmail.print_window;
}
if (email_window==null) {
DialogManager.alert('There was a problem opening a new print preview window, please make sure popup blocking is disabled in your browser and try again.');
} else {
email_window.document.location="./Email.Print.html";
email_window.name=window_name;
ApplicationEmail.email_windows[window_name]=email_window;
}
}
}
ApplicationEmail.downloadAttachment=function(folder_id, message_id, 
attachment_id, message_attachment_id) {
document.getElementById('download_frame').src="/cgi-bin/emailGetAttachment.cgi?act=11&unm="+user_prefs['user_name']+"&sid="+user_prefs['session_id']+"&msgid="+message_id+"&fid="+folder_id+"&attemid="+message_attachment_id+"&attid="+attachment_id
}
ApplicationEmail.openTopMessage=function(message_id, folder_id) {
var msg=new EmailMessage();
msg.id(message_id);
msg.folder_id(folder_id);
ApplicationEmail.store.getMessage(msg, ApplicationEmail.loadMessage);
}
ApplicationEmail.openAttachmentMessage=function(folder_id, 
message_id, attachment_id, parent_id) {
ApplicationEmail.store.getAttachmentMessage(folder_id,
message_id, attachment_id, 
ApplicationEmail.handleAttachmentMessage, attachment_id); 
}
ApplicationEmail.openAttachmentMessagePopup=function(folder_id, message_id, attachment_id, parent_id, window_name) {
ApplicationEmail.store.getAttachmentMessage(folder_id, message_id, attachment_id, ApplicationEmail.handleAttachmentMessagePopup, Array(attachment_id, window_name));
}
ApplicationEmail.openVcardAttachment=function(folder_id,
message_id, attachment_id, parent_id) {
var element=document.getElementById(folder_id+"/"+message_id+"/"+attachment_id);
if(element!=undefined) {
var left=element.offsetLeft;
var top=element.offsetTop+element.offsetHeight;
var temp=element.offsetParent;
while(temp!=null) {
left+=temp.offsetLeft;
top+=temp.offsetTop;
temp=temp.offsetParent;
}
vcard=ApplicationEmail.current_vcard=new Object();
vcard.folder_id=folder_id;
vcard.message_id=message_id;
vcard.attachment_id=attachment_id;
vcard.parent_id=parent_id;
var m=ApplicationEmail.vcard_menu;
if(m==undefined) {
var m=new ContextMenu(140);
if(typeof ApplicationOldContacts!='undefined' ||
(typeof ApplicationContacts!='undefined' && ApplicationContacts.loadAllForContactFieldsFromAttachment)) {
m.addItem(new ContextMenuItem("Add to My Contacts", true, 
ApplicationEmail.handleVcardAdd));
}
m.addItem(new ContextMenuItem("Download File", true, ApplicationEmail.handleVcardDownload));	
ApplicationEmail.vcard_menu=m;
}
m.show(left, top);
}
}
ApplicationEmail.handleVcardAdd=function() {
var vcard=ApplicationEmail.current_vcard;
if(typeof ApplicationOldContacts!='undefined') {	
var attemid='';
if(vcard.parent_id!=undefined) attemid=vcard.parent_id;
ApplicationOldContacts.handleNewContactShortcutFromAttachment('',
user_prefs['user_name'], '', '', vcard.folder_id, 
vcard.message_id, attemid, vcard.attachment_id);
} else if (ApplicationContacts && ApplicationContacts.loadAllForContactFieldsFromAttachment)  {	
ApplicationContacts.loadAllForContactFieldsFromAttachment(vcard.folder_id,
vcard.message_id, vcard.parent_id, vcard.attachment_id);
}
}
ApplicationEmail.handleVcardAdd2=function(vcard) {
ApplicationContacts.getContactFieldsFromAttachment(vcard.folder_id,
vcard.message_id, vcard.parent_id, vcard.attachment_id);
}
ApplicationEmail.handleVcardDownload=function() {
var vcard=ApplicationEmail.current_vcard;
ApplicationEmail.downloadAttachment(vcard.folder_id,
vcard.message_id, vcard.attachment_id, vcard.parent_id);
}
ApplicationEmail.openIcalAttachment=function(folder_id,
message_id, attachment_id, parent_id) {
var element=document.getElementById(folder_id+"/"+message_id+"/"+attachment_id);
if(element!=undefined) {
var left=element.offsetLeft;
var top=element.offsetTop+element.offsetHeight;
var temp=element.offsetParent;
while(temp!=null) {
left+=temp.offsetLeft;
top+=temp.offsetTop;
temp=temp.offsetParent;
}
ical=ApplicationEmail.current_ical=new Object();
ical.folder_id=folder_id;
ical.message_id=message_id;
ical.attachment_id=attachment_id;
ical.parent_id=parent_id;
var m=ApplicationEmail.ical_menu;
if(m==undefined) {
var m=new ContextMenu(140);
if (! _LITE_) {
if(ApplicationEmail.getPreviewPane().getMeetingRequestId()!=0)
{						
m.addItem(new ContextMenuItem("Accept", true, ApplicationEmail.handleIcalAccept));
m.addItem(new ContextMenuItem("Decline", true, ApplicationEmail.handleIcalDecline));
m.addItem(new ContextMenuItem("Mark as Tentative", true, ApplicationEmail.handleIcalMarkTentative));						
m.addItem(new ContextMenuDivider());
}
m.addItem(new ContextMenuItem("Add to My Calendar", true, ApplicationEmail.handleIcalAddClick));
m.addItem(new ContextMenuItem("View Event", true, ApplicationEmail.handleIcalViewClick));
}
m.addItem(new ContextMenuItem("Download File", true, ApplicationEmail.handleIcalDownload));
ApplicationEmail.ical_menu=m;
}
m.show(left, top);
}
}
ApplicationEmail.readIcalAttachment=function() {
var p=new ResourcePost();
p.param("act", "11");
p.param("unm", user_prefs["user_name"]);
p.param("sid", user_prefs["session_id"]);
p.param("msgid", ApplicationEmail.current_ical.message_id);
p.param("fid", ApplicationEmail.current_ical.folder_id);
p.param("attid", ApplicationEmail.current_ical.attachment_id);
p.param("attemid", ApplicationEmail.current_ical.parent_id);
ResourceManager.request("/cgi-bin/emailGetAttachment.cgi?"+p.toString(), 1, ApplicationEmail.convertIcalAttachmentToXML);
}
ApplicationEmail.convertIcalAttachmentToXML=function(data) {
var cal=Application.getApplicationById(1004);
if (cal!=undefined) {
var ev=CalendarEvent.fromICS(data);
ev.i_detail_l=EventHandler.register(ev, "onloaddetails", ApplicationEmail.handleIcalAttachmentLoaded, ev);
}
}
ApplicationEmail.handleIcalAttachmentLoaded=function(e) {
this.i_detail_l.unregister();
if (ApplicationEmail.i_ics_action=="view") {
var cal=Application.getApplicationById(1004);
cal.popEvent(this);
}
else {
this.isNew(true);
CalendarDataModel.getDefaultCalendar().addEvent(this);
this.save();	
DialogManager.alert('The selected event was successfully added to your calendar', 'Event Attachment');
}
}
ApplicationEmail.handleSaveMeetingRequest=function(e) 
{
var notification=Notifications.getInstance();
notification.addSuccess("Meeting response sent", 1, true);
}
ApplicationEmail.handleMeetingRequestLoadDetails=function(e) 
{
var ev=e.event;
if(ev.onloaddetailsHandler)
{
ev.onloaddetailsHandler.unregister();
}
if(ev.meetingRequestNewStatus!=undefined)
{
ev.meetingRequestState(ev.meetingRequestNewStatus);
ev.onsaveHandler=EventHandler.register(ev, "onsavemreq", this.handleSaveMeetingRequest, this);
ev.saveMeetingRequestState();
if(ev.meetingRequestNote!=undefined && ev.meetingRequestNote.length > 0)
{
ApplicationEmail.sendMeetingRequestReply(ev, ev.meetingRequestNote);
}
if (ev.meetingRequestNewStatus==4) 
{
var calDM=Application.getApplicationById(1004).getCalendarListDataModel();
if(calDM.removeEvent) 
{
calDM.removeEvent(ev);
}
}
}
}
ApplicationEmail.updateMeetingRequest=function(eventId, newStatus, noteEl)
{
var evReq=new CalendarEvent(eventId);
evReq.onloaddetailsHandler=EventHandler.register(evReq, "onloaddetails", this.handleMeetingRequestLoadDetails, this);
if(noteEl!=undefined)
{
ApplicationEmail.clearMeetingRequestNote(noteEl);
evReq.meetingRequestNote=noteEl.value;
}
evReq.meetingRequestNewStatus=newStatus;
evReq.loadDetails(true, false, false);
if(2==newStatus)
{
nI=Notifications.add("Accepting meeting reqeust...", 2);
}
else if(4==newStatus)
{
nI=Notifications.add("Declining meeting reqeust...", 2);
}
else if(3==newStatus)
{
nI=Notifications.add("Setting meeting as tentative...", 2);
}
}
ApplicationEmail.sendMeetingRequestReply=function(ev, msg)
{
if(msg.length > 0 && msg!=EventDisplay.DEFAULT_MEETING_REPLY_MSG) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "emailEventHost"));
dn.addNode(new DataNode("aid", user_prefs['user_id']));
dn.addNode(new DataNode("from", ev.getSelfAttendee().defaultAlias()));
dn.addNode(new DataNode("fromname", ev.getSelfAttendee().displayName()));
dn.addNode(new DataNode("to", ev.getMeetingHost().defaultAlias()));
dn.addNode(new DataNode("subject", ev.getSelfAttendee().displayName()+" has responded to your invitation to \""+ev.title()+"\""));
dn.addNode(new DataNode("message", ev.getSelfAttendee().displayName()+" has replied to your meeting request. \n\nAttached Message:\n"+msg));
var r=PopoutWindow.createObject("RequestObject");
r.application("Event");
r.method("emailEventHost");
r.data(dn);
var notif=Notifications.add("Sending meeting reply", 2);
r.i_notification=notif;
r.execute();
}
}
ApplicationEmail.clearMeetingRequestNote=function(noteEl) 
{
if(noteEl)
{
if(noteEl.value==EventDisplay.DEFAULT_MEETING_REPLY_MSG)
{
noteEl.className="IconField_input_focus";
noteEl.value="";
}
}
}
ApplicationEmail.handleIcalViewClick=function()
{
var mreqId=ApplicationEmail.getPreviewPane().getMeetingRequestId();
if(mreqId!=0)
{
ApplicationEmail.openCalendarEvent(mreqId);
}
else
{
ApplicationEmail.i_ics_action="view";
ApplicationEmail.readIcalAttachment();
}
}
ApplicationEmail.handleEventLoadDetails=function(e)
{
var ev=e.event;
ev.i_detailsloaded=true;
if(ev.onloaddetailsHandler!=undefined)
{
ev.onloaddetailsHandler.unregister();
}
var cal=Application.getApplicationById(1004);
if (cal!=undefined)
{
cal.popEvent(ev, undefined, undefined, true, true);
}
}
ApplicationEmail.openCalendarEvent=function (eventId)
{
var ev=new CalendarEvent(eventId);
ev.onloaddetailsHandler=EventHandler.register(ev, "onloaddetails", this.handleEventLoadDetails, this);
ev.loadDetails(false, false, false);
}
ApplicationEmail.handleIcalAccept=function()
{
var mreqId=ApplicationEmail.getPreviewPane().getMeetingRequestId();
if(mreqId!=0)
{
ApplicationEmail.updateMeetingRequest(mreqId, 2);
}
}
ApplicationEmail.handleIcalDecline=function()
{
var mreqId=ApplicationEmail.getPreviewPane().getMeetingRequestId();
if(mreqId!=0)
{
ApplicationEmail.updateMeetingRequest(mreqId, 4);
}
}
ApplicationEmail.handleIcalMarkTentative=function()
{
var mreqId=ApplicationEmail.getPreviewPane().getMeetingRequestId();
if(mreqId!=0)
{
ApplicationEmail.updateMeetingRequest(mreqId, 3);
}
}		
ApplicationEmail.handleIcalAddClick=function() {
ApplicationEmail.i_ics_action="add";
ApplicationEmail.readIcalAttachment();
}
ApplicationEmail.handleIcalAdd=function() {
if(ApplicationEmail.ics_event_xml.getElementsByTagName('startDate').length==0) {
alert('Invalid iCalendar file.');
} else {
var new_e=new calendarApp.CalendarEvent();
new_e.readFromElement(ApplicationEmail.ics_event_xml);
calendarApp.createEvent(ApplicationEmail.handleIcalAddFinish, new_e.toString(), new_e.start);
}
}
ApplicationEmail.handleIcalAddFinish=function(args, orig_args, wrapper) {
if(wrapper.status()) {
alert('This event was added to your calendar.');
} else {
alert('This event was NOT added to your calendar.');
}
}
ApplicationEmail.handleIcalDownload=function() {
var ical=ApplicationEmail.current_ical;
ApplicationEmail.downloadAttachment(ical.folder_id, ical.message_id, ical.attachment_id, ical.parent_id);
}
ApplicationEmail.handleAttachmentMessage=function(message, 
attachment_id) {
var preview_pane=ApplicationEmail.getPreviewPane();
ApplicationEmail.current_message=message;
message.attachment_id(attachment_id);
preview_pane.setMessage(message);
var pp=WindowObject.getWindowById('eml-preview');
preview_pane.updateDimensions();
preview_pane.activePreview(true);
this.i_preview=preview_pane;
}
ApplicationEmail.handleAttachmentMessagePopup=function(message, params) {
var win=ApplicationEmail.email_windows[params[1]];
message.attachment_id(params[0]);
if(win) {
win.handleAttachmentMessage(message);
}
}
ApplicationEmail.handleNewEmailShortcut=function() {
ApplicationEmail.newEmail();
}
ApplicationEmail.updateFolderTreeDimensions=function(width, height) {
var w=WindowObject.getWindowById('eml-folders');
var p=ApplicationEmail.getFolderTree();
if (width!=undefined) {
p.width(width - 2);
}
if (height!=undefined) {
p.height(height - (w.titleBar().height()+(document.all ? 4 : 2)));
}
}
ApplicationEmail.handleFolderCreate=function(menu_item) {
var node=menu_item.parent().i_tree_node;
var folder;
if (node.i_folder!=undefined) {
folder=node.i_folder;
}
var d=DialogManager.prompt("Please enter a name for the new folder.", "New Folder", "New Folder", ApplicationEmail.handleFolderCreate2, Array("Create", "Cancel"));
d.selectAll();
d.i_folder_id=(folder!=undefined ? folder.id() : ApplicationEmail.i_main_folder);
d.onenter=ApplicationEmail.handleFolderCreateEnter;
d.i_folder=folder;
}
ApplicationEmail.handleFolderCreateEnter=function(dialog) {
if (ApplicationEmail.handleFolderCreate2("Create", dialog.value(), dialog)==true)
dialog.close();
}
ApplicationEmail.handleFolderCreate2=function(button_text, value, dialog) {
if (button_text=="Create") {
if (value=="") {
dialog.text("Please Enter a Name");
return false;
}else if(value.indexOf("'") > -1 ||
value.indexOf("\"") > -1 ||
value.indexOf("<") > -1 ||
value.indexOf(">") > -1 ||
value.indexOf("\\") > -1 ||
value.indexOf("/") > -1 ||
value.indexOf("%") > -1 ||
value.indexOf(".") > -1) {
dialog.text("Folder names cannot contain: ' \" < > \\ / % .");
return false;
} else if(value.length > 32) {
dialog.text("Name cannot be longer than 32 characters.");
return false;
}
ApplicationEmail.store.createFolder(dialog.i_folder_id, dialog.i_folder, value);
}
return true;
}
ApplicationEmail.handleFolderRename=function(menu_item) {
var node=menu_item.parent().i_tree_node;
var dis=menu_item.parent().i_display;
node.i_old_name=node.name();
dis.editMode(true, node.i_folder.name());
}
ApplicationEmail.handleFolderRename2=function(tree, display, node, e) {
if (e.newname!=undefined) {
node.name(e.newname);
}
var value=node.name();
var good_to_go=true;
if (value=="") {
DialogManager.alert("Please enter a name");
good_to_go=false;
}else if(value.indexOf("'") > -1 ||
value.indexOf("\"") > -1 ||
value.indexOf("<") > -1 ||
value.indexOf(">") > -1 ||
value.indexOf("\\") > -1 ||
value.indexOf("/") > -1 ||
value.indexOf("%") > -1 ||
value.indexOf(".") > -1) {
DialogManager.alert("Folder names cannot contain: ' \" < > \\ / % .");
good_to_go=false;
} else if(value.length > 32) {
DialogManager.alert("Name cannot be longer than 32 characters.");
good_to_go=false;
}
if(good_to_go) {
ApplicationEmail.store.renameFolder(node.i_folder, node.name());
} else {
node.name(node.i_old_name);
ApplicationEmail.i_folderTree.refresh();
}
}
ApplicationEmail.handleFolderDelete=function(menu_item) {
var node=menu_item.parent().i_tree_node;
var d=DialogManager.confirm("Are you sure you want to delete folder '"+node.i_folder.name()+"'?", "Delete", ApplicationEmail.handleFolderDelete2, Array("Delete", "Cancel"));
d.i_folder=node.i_folder; 
}
ApplicationEmail.handleFolderDelete2=function(button_text, dialog) {
ExtensionBannerAds.refreshAll();
if (button_text=="Delete") {
if (dialog.i_folder.id()==ApplicationEmail.getDataModel().activeFolder()) {
var efWin=WindowObject.getWindowById('eml-messages');
efWin.name('Emails: INBOX');
ApplicationEmail.getDataModel().activeFolder(ApplicationEmail.i_inbox_folder);
}
ApplicationEmail.store.deleteFolder(dialog.i_folder);
}
return true;
}
ApplicationEmail.handleFolderView=function(menu_item, node_info, e) {
ApplicationEmail.handleFolderRelease(node_info[0], node_info[1], node_info[2]);
return true;
}
ApplicationEmail.handleFolderEmpty=function(menu_item) {
var node=menu_item.parent().i_tree_node;
var d=DialogManager.confirm("Are you sure you want to empty the folder '"+node.i_folder.name()+"'?", "Empty Folder", ApplicationEmail.handleFolderEmpty2, Array("Yes", "No"), true, false, 0);
d.i_folder=node.i_folder; 
}
ApplicationEmail.handleFolderEmpty2=function(button_text, dialog) {
if (button_text=="Yes") {
if (dialog.i_folder!=ApplicationEmail.i_trash_folder_node.i_folder && dialog.i_folder!=ApplicationEmail.i_junk_folder_node.i_folder) {
ApplicationEmail.i_trash_folder_node.i_folder.totalMessages(parseInt(ApplicationEmail.i_trash_folder_node.i_folder.totalMessages())+parseInt(dialog.i_folder.totalMessages()));
}
ApplicationEmail.store.emptyFolder(dialog.i_folder.id());
if (ApplicationEmail.getDataModel().activeFolder()==dialog.i_folder.id()) {
ApplicationEmail.getDataModel().forceNext();
ApplicationEmail.getDataModel().refresh();
}
}
ExtensionBannerAds.refreshAll();
return true;
}
ApplicationEmail.handleMoveSaveFolderClick=function(tree, display, node, e)
{
if ((ApplicationEmail.MoveSaveWindow==undefined) || (ApplicationEmail.MoveSaveWindow==null) ||
(ApplicationEmail.MoveSaveElements==undefined) || (ApplicationEmail.MoveSaveElements==null))
{
return true;
}
var fullNodePath=new Array();
for (var p=node; p.depth() > 0; p=p.parent()) {
fullNodePath.push(p.name());
}
var folderPath="/"+fullNodePath.reverse().join("/");
var folderID=ApplicationEmail.i_folder_tree_ids[node.id()];
ApplicationEmail.MoveSaveFolderSelected=true;
if ((node.i_folder_id==undefined) || (node.i_folder_id==null)) {
ApplicationEmail.MoveSaveDestination=ApplicationEmail.i_main_folder;
} else {
ApplicationEmail.MoveSaveDestination=node.i_folder_id;
}
ApplicationEmail.MoveSaveDestFolderObj=node;
ApplicationEmail.MoveSaveElements["pathdiv"].innerHTML=folderPath;
ApplicationEmail.MoveSaveElements["folderid"]=folderID;
}
ApplicationEmail.handleMoveSaveOK=function()
{
if (ApplicationEmail.MoveSaveFolderSelected==false) {
DialogManager.alert('You must select a folder before proceeding.', undefined, undefined, true, true);
return true;
}
if (ApplicationEmail.MoveSaveType==1) {
ApplicationEmail.handleMoveSaveTypeFolder();
} else if (ApplicationEmail.MoveSaveType==2) {
ApplicationEmail.handleMoveSaveTypeEmail();
}
return true;
}
ApplicationEmail.handleMoveSaveTypeFolder=function()
{
if ((ApplicationEmail.MoveSaveTarget==undefined) || (ApplicationEmail.MoveSaveTarget==null))
{
DialogManager.alert("An unexpected error was encountered.  Target was undefined.", undefined, undefined, true, true);
ApplicationEmail.MoveSaveWindow.close();
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
return true;
}
if ((ApplicationEmail.MoveSaveDestination==undefined) || (ApplicationEmail.MoveSaveDestination==null))
{
DialogManager.alert("An unexpected error was encountered.  Destination was undefined.", undefined, undefined, true, true);
ApplicationEmail.MoveSaveWindow.close();
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
return true;
}
if ((ApplicationEmail.MoveSaveDestFolderObj.depth()==1) && 
((ApplicationEmail.MoveSaveDestFolderObj.name()=="Drafts") ||
(ApplicationEmail.MoveSaveDestFolderObj.name()=="Trash") ||
(ApplicationEmail.MoveSaveDestFolderObj.name()=="Junk-Mail")))
{
DialogManager.alert("Destination can not be 'Drafts', 'Trash', or 'Junk-Email' folder.", undefined, undefined, true, true);
return true;
}
ApplicationEmail.store.moveFolder(ApplicationEmail.MoveSaveTarget, ApplicationEmail.MoveSaveDestination);
ApplicationEmail.MoveSaveWindow.close();
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
ApplicationEmail.MoveSaveFolderSelected=false;
return true;
}
ApplicationEmail.handleMoveSaveTypeEmail=function()
{
if ((ApplicationEmail.MoveSaveDestination==undefined) || (ApplicationEmail.MoveSaveDestination==null))
{
DialogManager.alert("An unexpected error was encountered.  Destination was undefined.", undefined, undefined, true, true);
ApplicationEmail.MoveSaveWindow.close();
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
return true;
}
if (ApplicationEmail.MoveSaveDestination==ApplicationEmail.i_main_folder) {
DialogManager.alert("You can not move Email messages to the root folder.", undefined, undefined, true, true);
return true;
}
var params=Array();
params[0]="mvbutton";
params[1]=ApplicationEmail.MoveSaveDestination;
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleMoveValidate, params);
ApplicationEmail.MoveSaveWindow.close();
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
ApplicationEmail.MoveSaveFolderSelected=false;
return true;
}
ApplicationEmail.handleMoveSaveCancel=function()
{
ApplicationEmail.MoveSaveWindow.close();
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
ApplicationEmail.MoveSaveFolderSelected=false;
return true;
}
ApplicationEmail.createMoveSaveDialog=function(selectionType, selection)
{
if(selection==undefined) {
selection=ApplicationEmail.getDataModel().getSelectedMessages();
}
ApplicationEmail.MoveSaveSelection=selection;
var dialogTitle="Unknown Selection Type";
if (selectionType==1) {
dialogTitle="Move selected Folder to...";
} else if (selectionType==2) {
dialogTitle="Move selected Emails to...";
} else if (selectionType==3) {
dialogTitle="Save selected Folder to...";
} else if (selectionType==4) {
dialogTitle="Save selected Emails to...";
}
var folderIcons=Array("LiteTreeIcon_folder",
"EmailFolder_inbox",
"EmailFolder_sent",
"EmailFolder_draft",
"EmailFolder_trash",
"EmailFolder_junk",
"EmailFolder_trash_empty");
if ((ApplicationEmail.MoveSaveWindow!=undefined) && (ApplicationEmail.MoveSaveWindow!=null)) {
ApplicationEmail.MoveSaveWindow=null;
ApplicationEmail.MoveSaveElements=null;
}
var moveSave=new Array();
var win=new WindowObject('folderMoveSave', 
dialogTitle, 
400, 300, 
Application.titleBarFactory());
win.titleBar().removeButton(Application.i_title_dock);
win.modal(true);
if(selectionType==3) {
var outParams=new ResourcePost();
outParams.param("emailfid", ApplicationEmail.MoveSaveTarget.id());
outParams.param("emailfdname", ApplicationEmail.MoveSaveTarget.name());
outParams.param("dl", "FOLDER");
var p=new ResourcePost();
p.param("unm", user_prefs["user_name"]);
p.param("sid", user_prefs["session_id"]);
p.param("outParams", outParams.toString());
p.param("outPage", "/Ioffice/Email/EmailFileMultConfirm.asp");
p.param("needsRefresh", 0);
p.param("gds", 1);
win.url("/Ioffice/FilingCabinet/move_items_nav.asp?"+p.toString(), true);
}else if (selectionType==4) {
var p=new ResourcePost();
var msgs="";
for(var i=0; i< selection.length; i++) {
msgs+="&dl="+selection[i].id();
}
p.param('unm', user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('outParams', '&emailfid='+ApplicationEmail.MoveSaveTarget.id()+msgs);
p.param('outPage', '/Ioffice/Email/EmailFileMultConfirm.asp');
p.param('needsRefresh', '0');
p.param('maxDepth', '9');
p.param('gds', 1);
win.url('/Ioffice/FilingCabinet/move_items_nav.asp?'+p.toString(), true);
} else {
moveSave["treeCopy"]=ApplicationEmail.getRootFolder().deepCopy(function(node, orig) 
{ 
node.onclick=ApplicationEmail.handleMoveSaveFolderClick; 
node.i_folder=orig.i_folder; 
node.i_folder_id=orig.i_folder_id;
});
moveSave["folderTreeModel"]=new LiteTreeDataModel(moveSave["treeCopy"]);
moveSave["folderTreePane"]=new LiteTree(moveSave["folderTreeModel"], folderIcons, folderIcons);
moveSave["treeCopy"].open(true);
moveSave["folderTree"]=moveSave["folderTreePane"].getTree();
moveSave["table"]=document.createElement("table");
moveSave["tbody"]=document.createElement("tbody");
moveSave["form"]=document.createElement("div");
moveSave["tr"]=document.createElement("tr");
moveSave["td1"]=document.createElement("td");
moveSave["td2"]=document.createElement("td");
moveSave["div"]=document.createElement("div");
moveSave["btnSave"]=document.createElement("button");
moveSave["btnCancel"]=document.createElement("button");
moveSave["br"]=document.createElement("br");
moveSave["strong"]=document.createElement("strong");
moveSave["msgdiv"]=document.createElement("div");
moveSave["pathdiv"]=document.createElement("div");
moveSave["ttstrong"]=document.createElement("b");
moveSave["toolTip"]=document.createElement("div");
moveSave["fieldSet"]=new Fieldset("Folder Selection", 300, 200);
var blankLine=document.createElement("hr");
blankLine.width="98%";
if (selectionType==1) {
moveSave["msgdiv"].innerHTML="Move selected Files/Folders to...";
} else if (selectionType==2) {
moveSave["msgdiv"].innerHTML="Move selected Emails to...";
} else if (selectionType==3) {
moveSave["msgdiv"].innerHTML="Save selected Files/Folders to...";
} else {
moveSave["msgdiv"].innerHTML="Unknown Selection Type";
}
moveSave["msgdiv"].style.cssText="padding:5px;";
moveSave["strong"].appendChild(moveSave["msgdiv"]);
moveSave["fieldSet"].addContent(moveSave["folderTree"]);
moveSave["div"].appendChild(moveSave["fieldSet"].getContent());
moveSave["td1"].appendChild(moveSave["div"]);
moveSave["btnSave"].innerHTML="OK";
moveSave["btnCancel"].innerHTML="Cancel";
EventListener.listen(moveSave["btnSave"],   "onclick", ApplicationEmail.handleMoveSaveOK);
EventListener.listen(moveSave["btnCancel"], "onclick", ApplicationEmail.handleMoveSaveCancel);
moveSave["btnSave"].style.cssText="margin:2px; width:65px;";
moveSave["btnCancel"].style.cssText="margin:2px; width:65px;";
moveSave["td2"].style.cssText="padding:6px; vertical-align:top; text-align:center; width:80px;";
moveSave["td2"].appendChild(moveSave["btnSave"]);
moveSave["td2"].appendChild(moveSave["br"]);
moveSave["td2"].appendChild(moveSave["btnCancel"]);
moveSave["tr"].appendChild(moveSave["td1"]);
moveSave["tr"].appendChild(moveSave["td2"]);
moveSave["toolTip"].innerHTML="Did You Know: That you can drag-and-drop folders into other folders and Email messages into other folders?";
moveSave["toolTip"].style.cssText="padding:5px; font-weight:bold;";
moveSave["ttstrong"].appendChild(moveSave["toolTip"]);
moveSave["tbody"].appendChild(moveSave["tr"]);
moveSave["table"].appendChild(moveSave["tbody"]);
moveSave["form"].appendChild(moveSave["table"]);
moveSave["pathdiv"]=document.createElement('div');
moveSave["pathdiv"].style.cssText="padding:5px;";
moveSave["pathdiv"].innerHTML="[Target folder not selected]";
moveSave["form"].appendChild(moveSave["strong"]);
moveSave["form"].appendChild(moveSave["pathdiv"]);
moveSave["form"].appendChild(blankLine);
moveSave["form"].appendChild(moveSave["ttstrong"]);
win.loadContent(moveSave["form"]);
}
ApplicationEmail.MoveSaveWindow=win;
ApplicationEmail.MoveSaveElements=moveSave;
win.onresize=ApplicationEmail.updateMoveSaveDimensions;
win.popWindow(440, 350, true);
return ApplicationEmail.MoveSaveWindow;
}
ApplicationEmail.updateMoveSaveDimensions=function(width, height) {
var fieldset=ApplicationEmail.MoveSaveElements["fieldSet"];
if(fieldset) {
fieldset.width(width - 110);
fieldset.height(height - 150);
}
}
ApplicationEmail.handleFolderMove=function(menu_item)
{
var node=menu_item.parent().i_tree_node;
var win=ApplicationEmail.createMoveSaveDialog(1);
ApplicationEmail.MoveSaveTarget=node.i_folder;
ApplicationEmail.MoveSaveType=1;
return true;
}
ApplicationEmail.handleEmailMoveTo=function()
{
if (ApplicationEmail.getDataModel().getSelectedMessages().length < 1) {
DialogManager.alert('You must select at least one message before proceeding.', undefined, undefined, true, true);
return true;
}
var win=ApplicationEmail.createMoveSaveDialog(2);
ApplicationEmail.MoveSaveType=2;
return true;
}
ApplicationEmail.handleFolderSaveToFile=function(menu_item)
{
var node=menu_item.parent().i_tree_node;
ApplicationEmail.MoveSaveTarget=node.i_folder;
var win=ApplicationEmail.createMoveSaveDialog(3);
ApplicationEmail.MoveSaveType=3;
return true;
}
ApplicationEmail.handleEmailSaveToFile=function()
{
if(ApplicationEmail.getDataModel().getSelectedMessages().length < 1) {
DialogManager.alert('Please select at least one message first.');
return;
}
ApplicationEmail.MoveSaveTarget=ApplicationEmail.i_last_loaded.i_folder;
var win=ApplicationEmail.createMoveSaveDialog(4);
ApplicationEmail.MoveSaveType=4;
return true;
}
ApplicationEmail.handleTreeContext=function(tree, display, node, e) {
if (ApplicationEmail.i_tree_context==undefined) {
ApplicationEmail.i_tree_context=new ContextMenu(200);
ApplicationEmail.i_tree_context_view=ApplicationEmail.i_tree_context.addItem(new ContextMenuItem("View", true, ApplicationEmail.handleFolderView, node));
ApplicationEmail.i_tree_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_tree_context_create=ApplicationEmail.i_tree_context.addItem(new ContextMenuItem("Create Folder", true, ApplicationEmail.handleFolderCreate));
ApplicationEmail.i_tree_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_tree_context_rename=ApplicationEmail.i_tree_context.addItem(new ContextMenuItem("Rename", true, ApplicationEmail.handleFolderRename));
ApplicationEmail.i_tree_context_delete=ApplicationEmail.i_tree_context.addItem(new ContextMenuItem("Delete", true, ApplicationEmail.handleFolderDelete));
ApplicationEmail.i_tree_context_empty=ApplicationEmail.i_tree_context.addItem(new ContextMenuItem("Empty", true, ApplicationEmail.handleFolderEmpty));
ApplicationEmail.i_tree_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_tree_context_move=ApplicationEmail.i_tree_context.addItem(new ContextMenuItem("Move to...", true, ApplicationEmail.handleFolderMove));				
if (_LITE_!=true) {
for (var c=0; c < app_ids.length; c++) {
if (app_ids[c]=='1009') {
ApplicationEmail.i_tree_context_save=ApplicationEmail.i_tree_context.addItem(new ContextMenuItem("Save to file...", true, ApplicationEmail.handleFolderSaveToFile));
}
}
}
}
var ax=Array(tree, display, node, e);
ApplicationEmail.i_tree_context.contextFocus(ax);
ApplicationEmail.i_tree_context_create.enabled(true);
ApplicationEmail.i_tree_context_view.enabled((node.i_folder!=undefined));
ApplicationEmail.i_tree_context_rename.enabled((node.i_folder!=undefined));
ApplicationEmail.i_tree_context_delete.enabled((node.i_folder!=undefined));
if (node.i_locked_create==true) {
ApplicationEmail.i_tree_context_create.enabled(false);
}
if (node.i_locked==true) {
ApplicationEmail.i_tree_context_rename.enabled(false);
ApplicationEmail.i_tree_context_delete.enabled(false);
}
ApplicationEmail.i_tree_context_empty.enabled(true);
ApplicationEmail.i_tree_context.title(node.name());
ApplicationEmail.i_tree_context.i_display=display;
ApplicationEmail.i_tree_context.i_tree_node=node;
ApplicationEmail.i_tree_context.show(CursorMonitor.getX(), CursorMonitor.getY());
if (node.depth()==0) {
ApplicationEmail.i_tree_context_move.enabled(false);
if (! _LITE_ && ApplicationEmail.i_tree_context_save!=undefined) {
ApplicationEmail.i_tree_context_save.enabled(false);
}
}
else {
if (node.depth()==1) {
if ((node.i_folder_id==ApplicationEmail.i_main_folder) ||
(node.i_folder_id==ApplicationEmail.i_inbox_folder) ||
(node.i_folder_id==ApplicationEmail.i_trash_folder) ||
(node.i_folder_id==ApplicationEmail.i_junk_folder) ||
(node.i_folder_id==ApplicationEmail.i_draft_folder) ||
(node.i_folder_id==ApplicationEmail.i_sent_folder))
{
ApplicationEmail.i_tree_context_move.enabled(false);
} else {
ApplicationEmail.i_tree_context_move.enabled(true);
}
}
else {
ApplicationEmail.i_tree_context_move.enabled(true);
}
}
if ((node.i_folder==undefined) || (node.i_folder_id==ApplicationEmail.i_main_folder)) {
ApplicationEmail.i_tree_context_empty.enabled(false);
} else {
ApplicationEmail.i_tree_context_empty.enabled(true);
}
e.cancelBubble=true;
return false;
}
ApplicationEmail.setRootFolderActiveDrop=function() {
if (ApplicationEmail.activeFolderDrag!=undefined) {
ApplicationEmail.activeFolderDrag.dropFolder=-1;
}
}
ApplicationEmail.clearRootFolderActiveDrop=function() {
if (ApplicationEmail.activeFolderDrag!=undefined) {
if (ApplicationEmail.activeFolderDrag.dropFolder==-1) {
ApplicationEmail.activeFolderDrag.dropFolder=undefined;
}
}
}
ApplicationEmail.getRootFolder=function() {
if (ApplicationEmail.folder_root==undefined) {
ApplicationEmail.folder_root=new LiteDataNode("0", "My Folders", "My Folders", 0 , true);
ApplicationEmail.folder_root.onmouseover=ApplicationEmail.setRootFolderActiveDrop;
ApplicationEmail.folder_root.onmouseout=ApplicationEmail.clearRootFolderActiveDrop;
}
return ApplicationEmail.folder_root;
}
ApplicationEmail.getFolderTreeDataModel=function() {
if (ApplicationEmail.i_folder_data_model==undefined) {
ApplicationEmail.i_folder_data_model=new LiteTreeDataModel(ApplicationEmail.getRootFolder());
}
return ApplicationEmail.i_folder_data_model;
}
ApplicationEmail.getFolderTree=function() {
if(ApplicationEmail.i_folderTree==undefined) {
ApplicationEmail.i_folderTree=new LiteTree(ApplicationEmail.getFolderTreeDataModel(), Array("LiteTreeIcon_folder", "EmailFolder_inbox", "EmailFolder_sent", "EmailFolder_draft", "EmailFolder_trash", "EmailFolder_junk", "EmailFolder_trash_empty"), Array("LiteTreeIcon_folder", "EmailFolder_inbox", "EmailFolder_sent", "EmailFolder_draft", "EmailFolder_trash", "EmailFolder_junk", "EmailFolder_trash"), 200, 200);
ApplicationEmail.i_folderTree.oncontextmenu=ApplicationEmail.handleTreeContext;
ApplicationEmail.i_folderTree.onchange=ApplicationEmail.handleFolderRename2;
}
return ApplicationEmail.i_folderTree;
}
ApplicationEmail.handleFolderDoubleClick=function(tree, display, node, e) {
if (!node.i_locked && e.ontext==true) {
var d=DialogManager.prompt("Please enter a new name for the selected folder.", "Folder Rename", node.i_folder.name(), ApplicationEmail.handleFolderPopupRename2, Array("Save", "Cancel"));
d.selectAll();
d.i_folder=node.i_folder;
d.onenter=ApplicationEmail.handleFolderPopupRenameEnter;
}
}
ApplicationEmail.handleFolderPopupRenameEnter=function(dialog) {
if (ApplicationEmail.handleFolderPopupRename2("Save", dialog.value(), dialog)==true)
dialog.close();
}
ApplicationEmail.handleFolderPopupRename2=function(button_text, value, dialog) {
if (button_text=="Save") {
if (value=="") {
dialog.text("Please Enter a Name");
return false;
}else if(value.indexOf("'") > -1 ||
value.indexOf("\"") > -1 ||
value.indexOf("<") > -1 ||
value.indexOf(">") > -1 ||
value.indexOf("\\") > -1 ||
value.indexOf("/") > -1 ||
value.indexOf("%") > -1 ||
value.indexOf(".") > -1) {
dialog.text("Folder names cannot contain: ' \" < > \\ / % .");
return false;
} else if(value.length > 32) {
dialog.text("Name cannot be longer than 32 characters.");
return false;
}
ApplicationEmail.store.renameFolder(dialog.i_folder, value);
}
return true;
}
ApplicationEmail.handleFolderClick=function(tree, display, node, e) {
if (node.i_locked!=true && e!=undefined) {
if (ApplicationEmail.activeFolderDrag!=undefined) {
ApplicationEmail.handleFolderDragFinish();
}
ApplicationEmail.activeFolderDrag=Object();
ApplicationEmail.activeFolderDrag.startX=CursorMonitor.getX();
ApplicationEmail.activeFolderDrag.startY=CursorMonitor.getY();
ApplicationEmail.activeFolderDrag.folder=node.i_folder;
ApplicationEmail.activeFolderDrag.monitor_up_id=EventListener.listen(document.body, "onmouseup", ApplicationEmail.handleFolderDragFinish);
ApplicationEmail.activeFolderDrag.monitor_id=CursorMonitor.addListener(ApplicationEmail.handleFolderDrag);
}
return false;
}
ApplicationEmail.handleFolderRelease=function(tree, display, node, e) {
ApplicationEmail.getDataModel().forceNext();
ApplicationEmail.getDataModel().activeFolder(node.i_folder_id);
var efWin=WindowObject.getWindowById('eml-messages');
efWin.name('Emails: '+node.i_folder.name());
ApplicationEmail.i_last_loaded=node;
ApplicationEmail.last_get_message=undefined;
ApplicationEmail.current_message=undefined;
ApplicationEmail.i_search_box.value(ApplicationEmail.i_search_box.defaultValue());
ApplicationEmail.i_header_folder.visible(false);
if(node.i_folder.name()=="Drafts" || 
node.i_folder.name()=="Sent-Mail") {
ApplicationEmail.i_header_from.visible(false);
ApplicationEmail.i_header_to.visible(true);
} else {
ApplicationEmail.i_header_from.visible(true);
ApplicationEmail.i_header_to.visible(false);
}
ApplicationEmail.i_header_date.sort("desc");
ApplicationEmail.getDataModel().sortHeader(ApplicationEmail.i_header_date);
if (node.i_folder.name()=="Junk-Mail") {
ApplicationEmail.i_junk_dropdown.text("Not Junk");
ApplicationEmail.i_njunk_dropdown.visible(true);
}
else {
ApplicationEmail.i_junk_dropdown.text("Junk");
ApplicationEmail.i_njunk_dropdown.visible(false);
}
if (node.i_folder.name()=="INBOX" && REFRESH_FOLDER_TREE_ON_INBOX==true) {		
ApplicationEmail.store.getFolders();
}	
var pp=WindowObject.getWindowById('eml-preview');
ApplicationEmail.getPreviewPane().activePreview(false);
}
ApplicationEmail.handleFolderDrag=function(x, y) {
var ad=ApplicationEmail.activeFolderDrag;
if ((ad.startX - 5 > x || ad.startX+5 < x) ||
(ad.startY - 5 > y || ad.startY+5 < y)) {
if (ad.dragObj==undefined) {
ad.dragObj=document.createElement('DIV');
ad.dragObj.className="ApplicationEmail_folder_drag_impossible";
ad.dragObj.innerHTML=ad.folder.name();
document.body.appendChild(ad.dragObj);
}
ad.dragObj.style.left=(x+5)+"px";
ad.dragObj.style.top=(y - 5)+"px";
ad.dragObj.className="ApplicationEmail_folder_drag"+(ad.dropFolder==undefined ? "_impossible" : "");
if (document.all) {
if (document.selection) {
document.selection.empty();
} else if (window.getSelection()) {
window.getSelection().removeAllRanges();
}
}
}
return true;
}
ApplicationEmail.handleFolderDragFinish=function() {
CursorMonitor.removeListener(ApplicationEmail.activeFolderDrag.monitor_id);
EventListener.silence(document.body, "onmouseup", ApplicationEmail.activeFolderDrag.monitor_up_id);
if (ApplicationEmail.activeFolderDrag.dragObj!=undefined) {
document.body.removeChild(ApplicationEmail.activeFolderDrag.dragObj);
}
if (ApplicationEmail.activeFolderDrag.dropFolder!=undefined) {
var fid=ApplicationEmail.activeFolderDrag.dropFolder;
var tn;
if (fid==-1) {
fid=ApplicationEmail.i_main_folder;
tn=ApplicationEmail.getRootFolder();
}
else {
tn=ApplicationEmail.i_folder_ref[fid].i_tree_item;
}
var allow=true;
if (tn.children()!=undefined) {
for (var x=0; x < tn.children().length; x++) {
if (tn.children(x).i_folder.name()==ApplicationEmail.activeFolderDrag.folder.name()) {
DialogManager.alert('A folder with the name "'+ApplicationEmail.activeFolderDrag.folder.name()+'" already exists in the destination.');
allow=false;
}
}
}
if (allow) {
ApplicationEmail.store.moveFolder(ApplicationEmail.activeFolderDrag.folder, fid);
}
}
ApplicationEmail.activeFolderDrag=null;
return true;
}
ApplicationEmail.setActiveDropFolder=function(tree, display, node, e) {
if (ApplicationEmail.activeDrag!=undefined) {
ApplicationEmail.activeDrag.dropFolder=node.i_folder_id;
}
if (ApplicationEmail.activeFolderDrag!=undefined) {
if (node.i_folder.i_no_drop!=true && node.i_folder_id!=ApplicationEmail.activeFolderDrag.folder.id()) {
if (ApplicationEmail.folderHasChildArr(ApplicationEmail.activeFolderDrag.folder, node)) {
ApplicationEmail.activeFolderDrag.dropFolder=undefined;
} else {
ApplicationEmail.activeFolderDrag.dropFolder=node.i_folder_id;
}
}
else {
ApplicationEmail.activeFolderDrag.dropFolder=undefined;
}
}
return true;
}
ApplicationEmail.clearActiveDropFolder=function(tree, display, node, e) {
if (ApplicationEmail.activeDrag!=undefined) {
if (ApplicationEmail.activeDrag.dropFolder==node.i_folder_id) {
ApplicationEmail.activeDrag.dropFolder=undefined;
}
}
if (ApplicationEmail.activeFolderDrag!=undefined) {
if (ApplicationEmail.activeFolderDrag.dropFolder==node.i_folder_id) {
ApplicationEmail.activeFolderDrag.dropFolder=undefined;
}
}
return true;
}
ApplicationEmail.folderHasChild=function(folder, child)
{
var node;
if ((folder.children==undefined) || (folder.children()==undefined) || (folder.children().length==undefined)) {
return false;
}
for (var x=0; x < folder.children().length; x++) {
node=folder.children(x);
if (node.i_folder_id==child.i_folder_id) {
return true;
}
}
return false;
}
ApplicationEmail.folderHasChildArr=function(folder, child)
{
var node;
if ((folder.children==undefined) || (folder.children.length==undefined) || (folder.children.length < 1)) {
return false;
}
for (var x=0; x < folder.children.length; x++) {
node=folder.children[x];
if (node.id()==child.i_folder_id) {
return true;
} else {
if (node.children!=undefined) {
var hasChild=ApplicationEmail.folderHasChildArr(node, child);
if (hasChild) {
return true;
}
}
}
}
return false;
}
ApplicationEmail.folderHasChildren=function(folder, children)
{
var node, child_node;
if ((folder.children==undefined) || (folder.children()==undefined) || (folder.children().length==undefined)) {
return false;
}
for (var x=0; x < folder.children().length; x++) {
node=folder.children(x);
for (var y=0; y < children.length; y++) {
child_node=children[y];
if (node.i_folder_id==child_node.i_folder_id) {	
return true;
}
}
}
return false;
}
ApplicationEmail.buildFolderTree=function(children, node) {
children.sort(ApplicationEmail.sortFolders);
for(var x=0; x < children.length; x++) {
var child_folder=children[x];
var child_label=child_folder.totalMessages()+" message(s) in this folder";
var child_node;
if (ApplicationEmail.i_folder_ref[child_folder.id()].i_tree_item!=undefined) {
child_node=ApplicationEmail.i_folder_ref[child_folder.id()].i_tree_item;
child_node.name(child_label);
child_node.tipText(child_folder.name());
}
else {
var next_existing_child;
for (var z=x+1; z < children.length; z++) {
if (ApplicationEmail.i_folder_ref[children[z].id()].i_tree_item!=undefined) {
next_existing_child=children[z];
}
}
child_node=new LiteDataNode(this.i_folder_tree_hash[child_folder.id()], child_label, child_folder.name(), 0);
child_node.onmouseover=ApplicationEmail.setActiveDropFolder;
child_node.onmouseout=ApplicationEmail.clearActiveDropFolder;
child_node.onmousedown=ApplicationEmail.handleFolderClick;
child_node.onclick=ApplicationEmail.handleFolderRelease;
child_node.ondblclick=ApplicationEmail.handleFolderDoubleClick;
child_node.i_folder_id=child_folder.id();
child_node.i_folder=child_folder;
child_folder.i_tree_item=child_node;
if (child_folder.name()=="INBOX") {
child_node.iconId(1);
child_node.i_locked=true;
ApplicationEmail.i_last_loaded=child_node;
ApplicationEmail.i_inbox_folder=child_node.i_folder_id;
ApplicationEmail.i_inbox_folder_node=child_node;
}
else if (child_folder.name()=="Sent-Mail") {
child_node.iconId(2);
child_node.i_locked=true;
}
else if (child_folder.name()=="Drafts") {
child_node.iconId(3);
child_node.i_locked_create=true;
child_node.i_locked=true;
child_folder.i_no_drop=true;
}
else if (child_folder.name()=="Trash") {
child_node.iconId(4);
child_node.i_locked_create=true;
child_node.i_locked=true;
child_folder.i_no_drop=true;
ApplicationEmail.i_trash_folder_node=child_node;
}
else if (child_folder.name()=="Junk-Mail") {
child_node.iconId(5);
child_node.i_locked_create=true;
child_node.i_locked=true;
child_folder.i_no_drop=true;
ApplicationEmail.i_junk_folder_node=child_node;
}
node.addNode(child_node, next_existing_child);
}
child_folder.updateFolderStyle();
if(child_folder.children!=undefined) {
ApplicationEmail.buildFolderTree(child_folder.children, child_node);
}
}
}
ApplicationEmail.updateListDimensions=function(width, height) {
var w=WindowObject.getWindowById('eml-messages');
var l=ApplicationEmail.getMessageList();
var t=ApplicationEmail.getMessageTools();
if (width!=undefined) { 
l.width(width - 2);
t.width(width - 2);
}
if (height!=undefined) {
l.height((height - (w.titleBar().height()+(!document.all ? 2 : 4))) - t.height());
}
}
ApplicationEmail.handleSearch=function(value) {
var allFolders=(ApplicationEmail.i_search_context_all!=undefined ? ApplicationEmail.i_search_context_all.state() : false);
var allAreas=(ApplicationEmail.i_search_context_entire!=undefined ? ApplicationEmail.i_search_context_entire.state() : false);
var email=Application.getApplicationById(1007);
ApplicationEmail.i_header_folder.visible(true);
ApplicationEmail.getDataModel().activeSearch(value, allFolders, allAreas);
email.param("allFolders", allFolders);
email.param("allAreas", allAreas);
var efWin=WindowObject.getWindowById('eml-messages');
efWin.name('Search ['+value+']');
ExtensionBannerAds.refreshAll();
}
ApplicationEmail.toggleSearchFolderScope=function(menu_item) {
ApplicationEmail.i_search_context_folder.state((menu_item==ApplicationEmail.i_search_context_folder ? true : false));
ApplicationEmail.i_search_context_all.state((menu_item==ApplicationEmail.i_search_context_folder ? false : true));
var email=Application.getApplicationById(1007);
var allFolders=(ApplicationEmail.i_search_context_all!=undefined ? ApplicationEmail.i_search_context_all.state() : false);
email.param("allFolders", allFolders);
}
ApplicationEmail.toggleSearchArea=function(menu_item) {
ApplicationEmail.i_search_context_entire.state((menu_item==ApplicationEmail.i_search_context_entire ? true : false));
ApplicationEmail.i_search_context_subject.state((menu_item==ApplicationEmail.i_search_context_entire ? false : true));
var email=Application.getApplicationById(1007);
var allAreas=(ApplicationEmail.i_search_context_entire!=undefined ? ApplicationEmail.i_search_context_entire.state() : false);
email.param("allAreas", allAreas); 
}
ApplicationEmail.handleSearchContext=function(x, y) {
var email=Application.getApplicationById(1007);
var allFolders=email.param("allFolders");
var allAreas=email.param("allAreas");
if (allFolders==undefined) {
allFolders="false";
}
if (allAreas==undefined) {
allAreas="false";
}
if (ApplicationEmail.i_search_context==undefined) {
ApplicationEmail.i_search_context=new ContextMenu(200);
ApplicationEmail.i_search_context_folder=ApplicationEmail.i_search_context.addItem(new ContextMenuBoolean("This Folder", allFolders=="false", true, ApplicationEmail.toggleSearchFolderScope));
ApplicationEmail.i_search_context_all=ApplicationEmail.i_search_context.addItem(new ContextMenuBoolean("All Folders", allFolders=="true", true, ApplicationEmail.toggleSearchFolderScope));
ApplicationEmail.i_search_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_search_context_subject=ApplicationEmail.i_search_context.addItem(new ContextMenuBoolean("Subject and Sender Only", allAreas=="false", true, ApplicationEmail.toggleSearchArea));
ApplicationEmail.i_search_context_entire=ApplicationEmail.i_search_context.addItem(new ContextMenuBoolean("Entire Message", allAreas=="true", true, ApplicationEmail.toggleSearchArea));
if(!_LITE_) {	
ApplicationEmail.i_search_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_search_context.addItem(new ContextMenuItem("Advanced Search...", true, AdvancedSearchDiag.launch));
}
}
ApplicationEmail.i_search_context.show(x, y);
}
ApplicationEmail.getMessageTools=function() {
if (ApplicationEmail.i_tool_bar==undefined) {
ApplicationEmail.i_tool_bar=new ToolBar(200);
var new_button=new LabelButton("New", 50, 17, "New Message", ApplicationEmail.newEmail);
var new_context=new_button.contextMenu(new ContextMenu(150));
new_context.addItem(new ContextMenuItem("Email", true, ApplicationEmail.handleNewEmail));
if (!_LITE_) {
ApplicationEmail.i_efax_menu_item=new_context.addItem(new ContextMenuItem("Fax", true, ApplicationEmail.handleNewFax));
ApplicationEmail.i_efax_menu_item.visible(false);
for (var c=0; c < app_ids.length; c++) {
if (app_ids[c]=='1014') {
new_context.addItem(new ContextMenuItem("SecureSend", true, ApplicationEmail.loadSecureSend));
}
}
}
new_context.addItem(new ContextMenuDivider());
new_context.addItem(new ContextMenuItem("Folder", true, ApplicationEmail.createLocalFolder));
ApplicationEmail.i_new_message_button=new_button;					
var new_button=ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(new_button));
ApplicationEmail.i_tool_bar.addItem(new ToolBarDivider());
new_button.allowOverflow(false);
var reply_button=new LabelButton("Reply", 40, 17, "Reply", ApplicationEmail.handleReply);
reply_button.getButton().style.marginLeft="-1px";
var reply_all_button=new LabelButton("Reply All", 53,17,"Reply All", ApplicationEmail.handleReplyAll);
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(reply_button));
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(reply_all_button));					
var forward_button=new LabelButton("Forward", 53, 17, "Forward", ApplicationEmail.handleForward)
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(forward_button));
ApplicationEmail.i_tool_bar.addItem(new ToolBarDivider());
if(!_LITE_) {
for (var c=0; c < app_ids.length; c++) {
if (app_ids[c]=='1009') {
var save_button=new IconButton("ToolBar_icon_save", 16, 16, 20, 18, "Save To File", ApplicationEmail.handleEmailSaveToFile);
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(save_button));
}
}
}
var print_button=new IconButton("ToolBar_icon_print", 16, 16, 20, 18, "Print", ApplicationEmail.handlePrint);
print_button.getButton().style.marginLeft="1px";
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(print_button));
var delete_button=new IconButton("ToolBar_icon_delete", 16, 16, 20, 18, "Delete", ApplicationEmail.handleDelete);
delete_button.getButton().style.marginLeft="-1px";
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(delete_button));
ApplicationEmail.i_tool_bar.addItem(new ToolBarDivider());
var flag_button=new LabelButton("Flag As", 60, 17, "Flag As", ApplicationEmail.handleForceContext);
var flag_context=flag_button.contextMenu(new ContextMenu(100));
flag_context.addItem(new ContextMenuItem("Read", true, ApplicationEmail.handleMarkRead));
flag_context.addItem(new ContextMenuItem("Unread", true, ApplicationEmail.handleMarkUnread));
flag_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_junk_dropdown=flag_context.addItem(new ContextMenuItem("Junk", true, ApplicationEmail.handleJunk));
ApplicationEmail.i_njunk_dropdown=flag_context.addItem(new ContextMenuItem("Junk", true, ApplicationEmail.handleJunkInJunk));
if (ApplicationEmail.getDataModel().activeFolder()!=undefined && ApplicationEmail.getDataModel().activeFolder()==ApplicationEmail.i_junk_folder) {
ApplicationEmail.i_junk_dropdown.text("Not Junk");
ApplicationEmail.i_njunk_dropdown.visible(true);
}
else {
ApplicationEmail.i_junk_dropdown.text("Junk");
ApplicationEmail.i_njunk_dropdown.visible(false);
}
var flag_button_obj=ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(flag_button));
flag_button_obj.allowOverflow(false);
var move_button=new LabelButton("Move To", 60, 17, "Move To", ApplicationEmail.handleEmailMoveTo);
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(move_button));
ApplicationEmail.i_tool_bar.addItem(new ToolBarDivider());
ApplicationEmail.i_page_box=ApplicationEmail.getMessageList().getPageOptions();
ApplicationEmail.i_page_box.width(90);
ApplicationEmail.i_tool_bar.addItem(new ToolBarOptionBox(ApplicationEmail.i_page_box));
ApplicationEmail.i_tool_bar.addItem(new ToolBarDivider());
ApplicationEmail.i_search_box=new IconField("IconField_icon_search", 32, 16, 130, 18, "Search Email...");
ApplicationEmail.i_search_box.onsubmit=ApplicationEmail.handleSearch;
ApplicationEmail.i_search_box.oncontextmenu=ApplicationEmail.handleSearchContext;
ApplicationEmail.i_search_box.getField().style.marginTop="1px";
ApplicationEmail.i_tool_bar.addItem(new ToolBarIconField(ApplicationEmail.i_search_box));
ApplicationEmail.i_tool_bar.addItem(new ToolBarDivider());
var pop_button=new LabelButton("POP Mail", 50, 17, "POP Mail", ApplicationEmail.handlePop);
ApplicationEmail.i_tool_bar.addItem(new ToolBarButton(pop_button));		
}
return ApplicationEmail.i_tool_bar;
}
ApplicationEmail.createLocalFolder=function() {
var parent_folder=ApplicationEmail.i_folder_ref[ApplicationEmail.getDataModel().activeFolder()];
var d=DialogManager.prompt("Please enter a name for the new folder.", "New Folder", "New Folder", ApplicationEmail.handleFolderCreate2, Array("Create", "Cancel"));
d.selectAll();
d.i_folder_id=ApplicationEmail.getDataModel().activeFolder();
d.onenter=ApplicationEmail.handleFolderCreateEnter;
d.i_folder=parent_folder;
}
ApplicationEmail.handleLoadMessage=function(entry, header, e) {
var selI=ApplicationEmail.getMessageList().selectedIndexes();
if (selI.length==1) { 
var msg=entry.i_message, oldmsg=ApplicationEmail.current_message;
ApplicationEmail.current_message=msg;
var getMessage=true;
if (!WindowObject.getWindowById('eml-preview').minimized()) { 
if (oldmsg==msg) getMessage=false; 
} else {
if (oldmsg!=msg) getMessage=false;
}
if (getMessage) {
if (msg.i_has_details || msg==ApplicationEmail.last_get_message) { 
ApplicationEmail.loadMessage(msg); 
} else {
ApplicationEmail.store.getMessage(msg, ApplicationEmail.loadMessage);
}
if (msg.is_new()) ApplicationEmail.getDataModel().markSelectedRead();
}
}
if (e!=undefined) {
if (ApplicationEmail.activeDrag) ApplicationEmail.handleMessageDragOutOfWindow({type:"blur"});
ApplicationEmail.activeDrag=Object();
ApplicationEmail.activeDrag.startX=CursorMonitor.getX();
ApplicationEmail.activeDrag.startY=CursorMonitor.getY();
ApplicationEmail.activeDrag.message=entry.i_message;
ApplicationEmail.activeDrag.allSelected=selI;
ApplicationEmail.activeDrag.monitor_drag=EventListener.listen(document.body, "ondragstart", function() {
if (document.selection) document.selection.empty();
e.cancelBubble=true;
return false;
});
ApplicationEmail.activeDrag.monitor_out=EventListener.listen(document, "onmouseout", ApplicationEmail.handleMessageDragOutOfWindow);
ApplicationEmail.activeDrag.monitor_blur=EventListener.listen(window, "onblur", ApplicationEmail.handleMessageDragOutOfWindow);
ApplicationEmail.activeDrag.monitor_id=CursorMonitor.addListener(ApplicationEmail.handleMessageDrag);
ApplicationEmail.activeDrag.monitor_up_id=EventListener.listen(document.body, "onmouseup", ApplicationEmail.handleMessageDragFinish);
}
return false;
}
ApplicationEmail.handleMessageDragOutOfWindow=function(e) {
if (!e) e=window.event; 
if (e.type=="blur" || e.relatedTarget==document.documentElement
|| (e.fromElement!=null && e.toElement==null)) {
if (ApplicationEmail.activeDrag) {
if (ApplicationEmail.activeDrag.dragObj!=undefined) {
document.body.removeChild(ApplicationEmail.activeDrag.dragObj);
}
CursorMonitor.removeListener(ApplicationEmail.activeDrag.monitor_id);
EventListener.silence(document.body, "ondragstart", ApplicationEmail.activeDrag.monitor_drag);
EventListener.silence(document, "onmouseout", ApplicationEmail.activeDrag.monitor_out);
EventListener.silence(window, "onblur", ApplicationEmail.activeDrag.monitor_blur);
EventListener.silence(document.body, "onmouseup", ApplicationEmail.activeDrag.monitor_up_id);
ApplicationEmail.activeDrag=null;
}
}
}
ApplicationEmail.handleAutoMarkUnread=function() {
ApplicationEmail.handleMarkUnread(true); 
}
ApplicationEmail.handleAutoMarkRead=function() {
ApplicationEmail.handleMarkRead(true); 
}
ApplicationEmail.handleMessageDrag=function(x, y) {
var ad=ApplicationEmail.activeDrag;
if (x < 0 || y < 0 || x > CursorMonitor.browserWidth() || y > CursorMonitor.browserHeight()) {
SimpleClick2.handleDragOutOfWindow({type:"blur"});
} else if (ad) {
if ((ad.startX - 5 > x || ad.startX+5 < x) ||
(ad.startY - 5 > y || ad.startY+5 < y)) {
if (ad.dragObj==undefined) {
ad.dragObj=document.createElement('DIV');
ad.dragObj.className="ApplicationEmail_message_drag_wrapper";
var allSel=ApplicationEmail.getDataModel().getSelectedMessages();
ad.msgElems=Array();
for (var z=0; z < allSel.length && z < 5; z++) {
var nxt=document.createElement('DIV');
nxt.className="ApplicationEmail_message_drag_impossible";
nxt.innerHTML=allSel[z].subject();
var op=(.7 - (.10 * z));
nxt.style.filter="alpha(opacity="+(op * 100)+")";
if (!document.all) {
nxt.style.MozOpacity=op;
nxt.style.opacity=op;
nxt.style.KhtmlOpacity=op;
}
ad.dragObj.appendChild(nxt);
ad.msgElems[ad.msgElems.length]=nxt;
}
document.body.appendChild(ad.dragObj);
}
ad.dragObj.style.left=(x+5)+"px";
ad.dragObj.style.top=(y - 5)+"px";
if (ad.msgElems!=undefined) {
if (ad.lastState!=(ad.dropFolder!=undefined ? true : false)) {
for (var z=0; z < ad.msgElems.length; z++) {
ad.msgElems[z].className="ApplicationEmail_message_drag"+(ad.dropFolder!=undefined ? "" : "_impossible");
}
}
ad.lastState=(ad.dropFolder!=undefined ? true : false);
}
}
}
return true;
}
ApplicationEmail.handleMessageDragFinish=function() {
if (ApplicationEmail.activeDrag.dragObj!=undefined) {
document.body.removeChild(ApplicationEmail.activeDrag.dragObj);
}
if (ApplicationEmail.activeDrag.dropFolder!=undefined) {
var pm=Array();
pm[0]=ApplicationEmail.activeDrag;
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleMessageDragDrop, pm);
}
CursorMonitor.removeListener(ApplicationEmail.activeDrag.monitor_id);
EventListener.silence(document, "onmouseout", ApplicationEmail.activeDrag.monitor_out);
EventListener.silence(window, "onblur", ApplicationEmail.activeDrag.monitor_blur);
EventListener.silence(document.body, "onmouseup", ApplicationEmail.activeDrag.monitor_up_id);
ApplicationEmail.activeDrag=null;
return true;
}
ApplicationEmail.handleMessageDragDrop=function(messages, params) {
var dragObj=params[0];
ApplicationEmail.store.moveMessages(messages, dragObj.dropFolder, ApplicationEmail.handleMoveDeleteFinish);
return true;
}
ApplicationEmail.handleDoubleClickMessage=function(entry, header) {
if(entry.i_message.has_details()) {
if(entry.i_message!=undefined) {
if(entry.i_message.folder_id()==ApplicationEmail.i_draft_folder) {
ApplicationEmail.newEmail(entry.i_message, 4);
} else {
ApplicationEmail.printMessage(entry.i_message, true);
}
ApplicationEmail.getDataModel().markSelectedRead();
setTimeout(ApplicationEmail.handleAutoMarkRead, 500);
}
} else {
setTimeout(function(){ApplicationEmail.handleDoubleClickMessage(entry, header);} , 1000);
}
}
ApplicationEmail.handleNewEmail=function() {
ApplicationEmail.newEmail(undefined, 0);
}
ApplicationEmail.handleNewFax=function() {
EfaxEmailInterface.obj.newFax(undefined, 0);
}
ApplicationEmail.handleDelete=function() {
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleDeleteValidate);
return true;
}
ApplicationEmail.handleDeleteValidate=function(sel) {
if(sel.length < 1) {
DialogManager.alert('You must select at least one message', 'Email Delete');
} else {
var trash_msgs=Array();
var reg_msgs=Array();
for(var x=0; x < sel.length; x++) {
if(sel[x].folder_id()==ApplicationEmail.i_trash_folder) {
trash_msgs.push(sel[x]);
} else {
reg_msgs.push(sel[x]);
}
}
if(trash_msgs.length > 0) {
ApplicationEmail.store.deleteMessages(trash_msgs, 
ApplicationEmail.handleMoveDeleteFinish);
}
if(reg_msgs.length > 0) {
ApplicationEmail.store.moveMessages(reg_msgs, 
ApplicationEmail.i_trash_folder,
ApplicationEmail.handleMoveDeleteFinish);
}
var pp=WindowObject.getWindowById('eml-preview');
ApplicationEmail.getPreviewPane().activePreview(false);
}
}
ApplicationEmail.handleJunkInJunk=function() {
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleJunkInJunkValidate);
return true;
}
ApplicationEmail.handleJunk=function() {
ExtensionBannerAds.refreshAll();
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleJunkValidate);
return true;
}
ApplicationEmail.handleJunkInJunkValidate=function(sel) {
if(sel.length < 1) {
DialogManager.alert('You must select at least one message', 'Flag As Junk');
} else {
ApplicationEmail.store.junkMessages(sel, ApplicationEmail.handleJunkFinish);
}	
return true;
}
ApplicationEmail.handleJunkValidate=function(sel) {
if(sel.length < 1) {
DialogManager.alert('You must select at least one message', 'Flag As Junk');
} else {
if (ApplicationEmail.getDataModel().activeFolder()==ApplicationEmail.i_junk_folder) {
ApplicationEmail.store.unjunkMessages(sel, ApplicationEmail.handleJunkFinish);
}
else {
ApplicationEmail.store.junkMessages(sel, 
ApplicationEmail.handleJunkFinish);
}
}	
return true;
}
ApplicationEmail.handleJunkFinish=function() {
ApplicationEmail.getDataModel().parent().clearSelected();
ApplicationEmail.getDataModel().forceNext();
ApplicationEmail.getDataModel().refresh();
}
ApplicationEmail.handleReply=function(win, EmailSelection) {
var sel=undefined;
var selList=undefined;
var wasNew=false;
if ((EmailSelection==undefined) || (EmailSelection==null)) {
selList=ApplicationEmail.getDataModel().getSelectedMessages();
wasNew=true;
} else {
sel=EmailSelection;
}
if (wasNew) {
if (selList.length < 1) {
DialogManager.alert('You must select a message first', 'Email Reply');
} else {
sel=selList[0];
}
}
if (sel!=undefined) {
if(sel.has_details()) {
ApplicationEmail.newEmail(sel, 1, undefined, win);
} else {
ApplicationEmail.store.getMessage(sel, ApplicationEmail.handleMsgLoad, [ApplicationEmail.handleReply, win, EmailSelection]);
}
}
return true;
}
ApplicationEmail.handleMsgLoad=function(message, args) {
var func=args[0]; 
var win=args[1]; 
var sel=args[2]; 
func(win, sel);
}
ApplicationEmail.handleRead=function(context_item, msg) {
if (WindowObject.getWindowById('eml-preview').minimized()==false) {
ApplicationEmail.store.getMessage(msg, ApplicationEmail.loadMessage);
ApplicationEmail.getDataModel().markSelectedRead();
}
else {
if(msg!=undefined) {
ApplicationEmail.store.getMessage(msg, ApplicationEmail.loadMessage);
ApplicationEmail.getDataModel().markSelectedRead();
if(msg.folder_id()==ApplicationEmail.i_draft_folder) {
ApplicationEmail.newEmail(msg, 4);
} else {
ApplicationEmail.printMessage(msg, true);
}
}
}
return true;
}
ApplicationEmail.handlePrint=function() {
var sel=ApplicationEmail.getDataModel().getSelectedMessages();
if (sel.length < 1) {
DialogManager.alert('You must select a message first', 'Email Print');
}
else {
ApplicationEmail.printMessage(sel[0]);
}
return true;
}
ApplicationEmail.handleReplyAll=function(win, EmailSelection) {
var sel=undefined;
var selList=undefined;
var wasNew=false;
if ((EmailSelection==undefined) || (EmailSelection==null)) {
selList=ApplicationEmail.getDataModel().getSelectedMessages();
wasNew=true;
} else {
sel=EmailSelection;
}
if (wasNew) {
if (selList.length < 1) {
DialogManager.alert('You must select a message first', 'Email Reply All');
} else {
sel=selList[0];
}
}
if (sel!=undefined) {
if(sel.has_details()) {
ApplicationEmail.newEmail(sel, 2, undefined, win);
} else {
ApplicationEmail.store.getMessage(sel, ApplicationEmail.handleMsgLoad, [ApplicationEmail.handleReplyAll, win, EmailSelection]);
}
}
return true;
}
ApplicationEmail.handleForward=function(win, EmailSelection) {
var sel=undefined;
var selList=undefined;
var wasNew=false;
if ((EmailSelection==undefined) || (EmailSelection==null)) {
selList=ApplicationEmail.getDataModel().getSelectedMessages();
wasNew=true;
} else {
sel=EmailSelection;
}
if (wasNew) {
if (selList.length < 1) {
DialogManager.alert('You must select a message first', 'Email Forward');
} else {
sel=selList[0];
}
}
if (sel!=undefined) {
if(sel.has_details()) {
ApplicationEmail.newEmail(sel, 3, undefined, win);
} else {
ApplicationEmail.store.getMessage(sel, ApplicationEmail.handleMsgLoad, [ApplicationEmail.handleForward, win, EmailSelection]);
}
}
return true;
}
ApplicationEmail.handlePop=function() {
var window_name="Pop3Email";
var pop_window=ApplicationEmail.email_windows[window_name];
if(pop_window!=undefined && typeof(pop_window)!=undefined &&
pop_window.closed!=true) {
alert("You are currently retrieving POP3 messages.");
pop_window.focus();
} else {
pop_window=window.open("/Ioffice/Common/blank.html", "",
"toolbar=0,location=0,directories=0,status=0,"+"menubar=0,scrollbars=0,resizable=0,width=450,"+"height=200");
if(pop_window==null) {
DialogManager.alert('There was a problem opening a new pop3 window, please make sure popup blocking is disabled in your browser and try again.');
} else {
pop_window.document.location="./Email.Pop3.html";
pop_window.name=window_name;
ApplicationEmail.email_windows[window_name]=pop_window;
}
}
}
ApplicationEmail.handleMarkReply=function() {
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleMarkReplyValidate, true);
return true;
}
ApplicationEmail.handleMarkReplyValidate=function(sel, quiet) {
ApplicationEmail.getDataModel().markSelectedReply();
ApplicationEmail.store.markMessages(sel, 1, undefined, undefined, quiet, 1);
}
ApplicationEmail.handleMarkUnread=function(quiet) {
var sel=ApplicationEmail.getDataModel().getSelectedMessages();
if (sel.length < 1) {
DialogManager.alert('You must select a message first', 'Mark Email As Unread');
} else {
ExtensionBannerAds.refreshAll();
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleMarkUnreadValidate, quiet);
}
return true;
}
ApplicationEmail.handleMarkUnreadValidate=function(sel, quiet) {
ApplicationEmail.getDataModel().markSelectedUnread();
ApplicationEmail.store.markMessages(sel, 2, undefined, undefined, quiet);
}
ApplicationEmail.handleMarkRead=function() {
var sel=ApplicationEmail.getDataModel().getSelectedMessages();
if (sel.length < 1) {
DialogManager.alert('You must select a message first', 'Mark Email As Read');
} else {
ExtensionBannerAds.refreshAll();
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleMarkReadValidate);
}
return true;
}
ApplicationEmail.handleMarkReadValidate=function(sel, selected_indexes) {
ApplicationEmail.getDataModel().markSelectedRead(selected_indexes);
ApplicationEmail.store.markMessages(sel, 1);
}
ApplicationEmail.handleForceContext=function(button, fc, e) {
LabelButton.triggerContext.call(button, e);
return true;
}
ApplicationEmail.handleMove=function(menu_item) {
var pm=Array();
pm[0]=menu_item;
ApplicationEmail.getDataModel().validateSelected(ApplicationEmail.handleMoveValidate, pm);
return true;
}
ApplicationEmail.handleMoveValidate=function(sel, params) {
sel=ApplicationEmail.MoveSaveSelection;
if (sel.length < 1) {
DialogManager.alert('You must select at least one message', 'Move To');
} else {
var folder_id=undefined;
if (params[0]!="mvbutton") {
var menu_item=params[0];
folder_id=menu_item.i_folder_id;
} else {
folder_id=params[1];
}
ApplicationEmail.store.moveMessages(sel, folder_id,
ApplicationEmail.handleMoveDeleteFinish);
}
return true;
}
ApplicationEmail.handleMoveDeleteFinish=function() {
var message_list=ApplicationEmail.getMessageList();
var data_model=ApplicationEmail.getDataModel();
ApplicationEmail.move_delete_selected=message_list.selectedIndexes();
message_list.clearSelected();
ApplicationEmail.move_delete_refresh_listener=EventHandler.register(data_model, "onrefreshcomplete", ApplicationEmail.handleMoveDeleteRefreshComplete);
data_model.forceNext();
data_model.refresh();
}
ApplicationEmail.handleMoveDeleteRefreshComplete=function(e) {
ApplicationEmail.move_delete_refresh_listener.unregister();
var message_list=ApplicationEmail.getMessageList();
var prev_selected=ApplicationEmail.move_delete_selected
if(prev_selected && prev_selected[0]!=undefined) {
var last_index=message_list.entries() - 1;
if(last_index >=0) {
var select=(last_index >=prev_selected[0]) ? prev_selected[0] : last_index;
message_list.rowSelected(select, true);
var messages=message_list.dataModel().getEntries(select, 1);
if(messages && messages[0]) {
ApplicationEmail.handleLoadMessage(messages[0]);
}
}
}
}
ApplicationEmail.getMessageList=function() {
if (ApplicationEmail.i_messageList==undefined) {
ApplicationEmail.i_messageList=new DataList(ApplicationEmail.getDataModel(), 100, 100);
ApplicationEmail.i_messageList.i_empty_message="There are no messages in this folder.";
ApplicationEmail.i_messageList.multiSelect(true);
ApplicationEmail.i_messageList.pageLength(50);
ApplicationEmail.i_header_attachment=ApplicationEmail.i_messageList.addHeader(new DataListHeader(7,  "", 30, true, "Attachments", "DataList_header_icon_attach"));
var rfHeader=new DataListHeader(10,  "", 18, true, "Reply/forward", "DataList_header_icon_replyfwd");
rfHeader.defaultSort("desc");
ApplicationEmail.i_header_replyforward=ApplicationEmail.i_messageList.addHeader(rfHeader);
ApplicationEmail.i_header_importance=ApplicationEmail.i_messageList.addHeader(new DataListHeader(9,  "", 18, true, "Importance", "DataList_header_icon_importance"));
ApplicationEmail.i_header_from=ApplicationEmail.i_messageList.addHeader(new DataListHeader(2,  "From", 150, true));
ApplicationEmail.i_header_to=ApplicationEmail.i_messageList.addHeader(new DataListHeader(5,  "To", 150, false));
ApplicationEmail.i_header_subject=ApplicationEmail.i_messageList.addHeader(new DataListHeader(4, "Subject", "100%", true));
ApplicationEmail.i_header_date=ApplicationEmail.i_messageList.addHeader(new DataListHeader(1, "Date", 150, true));
ApplicationEmail.i_header_date.isNumeric(true);
ApplicationEmail.i_header_date.filter=ApplicationEmail.filter_date;
ApplicationEmail.i_header_size=ApplicationEmail.i_messageList.addHeader(new DataListHeader(3, "Size", 60, true));	
ApplicationEmail.i_header_size.isNumeric(true);
ApplicationEmail.i_header_size.filter=ApplicationEmail.filter_size;
ApplicationEmail.i_header_folder=ApplicationEmail.i_messageList.addHeader(new DataListHeader(8, "Folder", 100, false));	
ApplicationEmail.i_header_date.sort("desc");
ApplicationEmail.getDataModel().sortHeader(ApplicationEmail.i_header_date);
ApplicationEmail.i_messageList.loading(true);
ApplicationEmail.i_messageList.emptyListText("There are no messages in this folder.");
}
return ApplicationEmail.i_messageList;
}
ApplicationEmail.triggerContextMenu=function(entry, header, e) {
var c=ApplicationEmail.getContextMenu();
c.title(entry.i_message.subject());
c.show(CursorMonitor.getX(), CursorMonitor.getY());
c.contextFocus(entry.i_message);
if (!ApplicationEmail.getMessageList().rowSelected(entry.activeRow().rowIndex())) {
if (!e.ctrlKey) {
if (WindowObject.getWindowById('eml-preview').minimized()==false) {
ApplicationEmail.handleRead(undefined, entry.i_message);
}
ApplicationEmail.getMessageList().clearSelected();
ApplicationEmail.getMessageList().rowSelected(entry.activeRow().rowIndex(), true);
ApplicationEmail.getMessageList().refresh();
}
}
return false;
}
ApplicationEmail.getContextMenu=function() {
if (ApplicationEmail.i_context==undefined) {
ApplicationEmail.i_context=new ContextMenu(200);
ApplicationEmail.i_context.addItem(new ContextMenuItem("Read", true, ApplicationEmail.handleRead));
ApplicationEmail.i_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_message_context_reply=ApplicationEmail.i_context.addItem(new ContextMenuItem("Reply", true, ApplicationEmail.handleReply));
ApplicationEmail.i_message_context_replyall=ApplicationEmail.i_context.addItem(new ContextMenuItem("Reply All", true, ApplicationEmail.handleReplyAll));
ApplicationEmail.i_message_context_forward=ApplicationEmail.i_context.addItem(new ContextMenuItem("Forward", true, ApplicationEmail.handleForward));
ApplicationEmail.i_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_message_context_delete=ApplicationEmail.i_context.addItem(new ContextMenuItem("Delete", true, ApplicationEmail.handleDelete));
ApplicationEmail.i_context.addItem(new ContextMenuDivider());
ApplicationEmail.i_message_context_read=ApplicationEmail.i_context.addItem(new ContextMenuItem("Flag As Read", true, ApplicationEmail.handleMarkRead));
ApplicationEmail.i_message_context_unread=ApplicationEmail.i_context.addItem(new ContextMenuItem("Flag As Unread", true, ApplicationEmail.handleMarkUnread));
ApplicationEmail.i_message_context_junk=ApplicationEmail.i_context.addItem(new ContextMenuItem("Flag As Junk", true, ApplicationEmail.handleJunk));
ApplicationEmail.i_message_context_njunk=ApplicationEmail.i_context.addItem(new ContextMenuItem("Flag As Junk", true, ApplicationEmail.handleJunkInJunk));
}
if(ApplicationEmail.getDataModel().activeFolder()) {
if(ApplicationEmail.getDataModel().activeFolder()==ApplicationEmail.i_junk_folder) {
ApplicationEmail.i_message_context_junk.text("Flag as Not Junk");
ApplicationEmail.i_message_context_njunk.visible(true);
} else {
ApplicationEmail.i_message_context_junk.text("Flag as Junk");
ApplicationEmail.i_message_context_njunk.visible(false);
}
if(ApplicationEmail.getDataModel().activeFolder()==ApplicationEmail.i_draft_folder) {
ApplicationEmail.i_message_context_junk.enabled(false);
} else {
ApplicationEmail.i_message_context_junk.enabled(true);
}
}
return ApplicationEmail.i_context;
}
ApplicationEmail.filter_date=function(date) {
if(date==" " || date==" ") {
return date;
} else {
var ret;
var d=new Date(date);
var dd=fillZeros(d.getDate());
var dm=fillZeros(d.getMonth()+1);
var dy=d.getFullYear();
var th=d.getHours();
var tm=fillZeros(d.getMinutes());
var ampm="";
if(user_prefs['date_prefs']=="%d/%m/%Y") {
ret=dd+"/"+dm+"/"+dy;
} else {
ret=dm+"/"+dd+"/"+dy;
}
if(user_prefs['time_prefs']!="%H:%M") {
if(th > 12) {
ampm=" PM";
th -=12;
} else if (th==12) {
ampm=" PM";
} else {
ampm=" AM";
}
if(th==0) {
th=12;
}
}
ret+=" "+fillZeros(th)+":"+tm+ampm;
return ret;
}
}
ApplicationEmail.filter_size=function(size) {
if (parseInt(size)!=size) {
return size;
}
var ext=" B";
if (size < 1024) {
size=size+"";
ext="B";
}
else if (size < 1024 * 1024) {
size=(Math.round(10 * size / 1024)/10)+"";
ext="KB";
}
else if (size < 1024 * 1024 * 1024) {
size=(Math.round(10 * size / 1048576)/10)+"";
ext="MB";
}
else {
size=(Math.round(10 * size / 1073741824)/10)+"";
ext="GB";
}
size=Math.floor(size * 100);
size=(size / 100);
return size+" "+ext;
}
ApplicationEmail.getDataModel=function() {
if (ApplicationEmail.i_data_model==undefined) {
ApplicationEmail.i_data_model=new DataListMessageModel();
}
return ApplicationEmail.i_data_model;
}
ApplicationEmail.getMessageListContents=function() {
if (ApplicationEmail.i_email_list==undefined) {
ApplicationEmail.i_email_list=document.createElement('DIV');
ApplicationEmail.i_email_list.appendChild(ApplicationEmail.getMessageTools().getBar());
ApplicationEmail.i_email_list.appendChild(ApplicationEmail.getMessageList().getList());
}
return ApplicationEmail.i_email_list;
}
ApplicationEmail.sortFolders=function(a, b) {
if(a.type()==b.type()) {
var an=a.name().toLowerCase();
var bn=b.name().toLowerCase();
if(an < bn) {
return -1;
} else if(an > bn) {
return 1;
} else {
return 0;
}
} else if(a.type() < b.type()) {
return -1;
} else {
return 1;
}
}
ApplicationEmail.refreshCurrentFolder=function(only_fname) {
if(ApplicationEmail.i_last_loaded) {
if(only_fname==undefined || ApplicationEmail.i_last_loaded.i_folder.name()==only_fname) {
ApplicationEmail.getDataModel().forceNext();
ApplicationEmail.getDataModel().refresh();
}
}
}
ApplicationEmail.prototype.getUniversalInboxItem=function() {
if(!this.i_universal_inbox_item && SystemCore.hasApp(1020)) {
this.i_universal_inbox_item=new UniversalInboxItem("New emails", undefined, true);
EventHandler.register(this.i_universal_inbox_item, "onclick", this.launchApplication, this);
if(this.i_inbox_unread_count!=undefined) {
this.i_universal_inbox_item.value(this.i_inbox_unread_count);
}
}
return this.i_universal_inbox_item;
}
ApplicationEmail.prototype.handleInboxCount=function(e) {
var data=e.response.data();
var inbox=data.xPath("fmc")[0];
if (inbox!=undefined) {
this.i_inbox_unread_count=inbox.attribute("n");
} else {
this.i_inbox_unread_count=0;
}
if(SystemCore.hasApp(1020)) {
if(this.i_universal_inbox_item) {
this.i_universal_inbox_item.value(this.i_inbox_unread_count);
}
}
}
ApplicationEmail.prototype.handleInboxUnreadChange=function(e) {
this.i_inbox_unread_count=e.count;
if(SystemCore.hasApp(1020)) {
this.getUniversalInboxItem().value(this.i_inbox_unread_count);
}
}
ApplicationEmail.store=Array();
ApplicationEmail.store.handleSearchResults=function(data, xml, req, params) {
var cb=undefined;
var ni;
if (params!=undefined) {
if (params.length > 0) {
cb=params[1];
ni=params[0];
params.splice(0, 2);
}
}
var d=xml.documentElement;
var msgs=Array();
var total=getXMLValue(d, "total");			
if (total!=undefined) {
var emm=d.getElementsByTagName('msg');
for (var x=0; x < emm.length; x++) {
var m=new EmailMessage();
m.readElement(emm[x]);
msgs[msgs.length]=m;
}
}
Notifications.end(ni);
if (cb!=undefined) {
cb(msgs, total, params);
}		
}
ApplicationEmail.store.searchMessages=function(term, folder_id, searchAllFields, callback, params) {
var p=new ResourcePost();
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('gds', 1);
p.param('act', 19);
p.param('simLoc', folder_id);
p.param("searchAllFields", (searchAllFields==true ? 1 : 0));
p.param('sm', 0);
p.param('simField', term);
if (callback!=undefined) {
if (params==undefined) {
params=Array();
}
params.splice(0, 0, callback);
}
else {
params=undefined;
}
params.splice(0, 0, Notifications.add("Searching messages"));
ResourceManager.request('/cgi-bin/emailSearch.cgi', 1, 
ApplicationEmail.store.handleSearchResults, p, 
params, undefined); 
}
ApplicationEmail.store.handleMessageList=function(data, xml, req, params) {
var cb=undefined;
if (params!=undefined) {
if (params.length > 0) {
cb=params[0];
params.splice(0, 1);
}
}
var d=undefined;
if(xml!=undefined) {
var d=xml.documentElement;
}
if (d!=undefined) {
var total=getXMLValue(d, "total");
var totalNew=getXMLValue(d, 'totalNew');
var mt=getXMLValue(d, "mt");
var id_tag=d.getElementsByTagName('id');
var fid;
if (id_tag!=undefined && id_tag.length > 0) {
fid=[0];
ApplicationEmail.i_folder_ref[ApplicationEmail.getDataModel().activeFolder()].newMessages(totalNew);
ApplicationEmail.i_folder_ref[ApplicationEmail.getDataModel().activeFolder()].totalMessages(total);
if (fid!=undefined) {
var emm=d.getElementsByTagName('msg');
var msgs=Array();
for (var x=0; x < emm.length; x++) {
var m=new EmailMessage();
m.readElement(emm[x]);
msgs[msgs.length]=m;
}
}
}
else {
console.log('missing ID tag in message list response [ignoring]');
}
}
else {
console.log('invalid response from server [ignoring]');
DialogManager.alert("Your e-mail cannot be retrieved from the server. Check your internet connection and try again.");
}
if (cb!=undefined) {
cb(msgs, total, mt, params);
}
}
ApplicationEmail.store.getMessages=function(folder_id, start_index, 
length, sort_header, callback, params) {
var p=new ResourcePost();
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('gds', 1);
p.param('act', 2);
p.param('fid', folder_id);
p.param('index', start_index);
p.param('count', length);
p.param('srtc', sort_header.id());
p.param('srto', (sort_header.sort()=="asc" ? 0 : 1));
if (callback!=undefined) {
if (params==undefined) {
params=Array();
}
params.splice(0, 0, callback);
}
else {
params=undefined;
}
ExtensionBannerAds.refreshAll();
ResourceManager.request('/cgi-bin/emailGetMsgList.cgi', 1, 
ApplicationEmail.store.handleMessageList, p, 
params, undefined); 
}
ApplicationEmail.store.getMessage=function(message, callback, 
params) {
ApplicationEmail.last_get_message=message;
var p=new ResourcePost();
p.param("act", "3");
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("emid", message.id());
p.param("msgid", message.id());
p.param("fid", message.folder_id());
if(message.folder_id()==ApplicationEmail.i_draft_folder)
p.param("ft", "3");
ResourceManager.request('/cgi-bin/emailGetMsg.cgi', 1, 
ApplicationEmail.store.handleMessage, p, 
Array(message, callback, params), undefined); 
}
ApplicationEmail.store.getAttachmentMessage=function(folder_id,
message_id, attachment_id, callback, params) {
var p=new ResourcePost();
p.param("act", "3");
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("attemid", attachment_id);
p.param("msgid", message_id);
p.param("fid", folder_id);
ResourceManager.request('/cgi-bin/emailGetMsg.cgi', 1, 
ApplicationEmail.store.handleMessage, p, 
Array(undefined, callback, params), undefined); 
}
ApplicationEmail.store.getPreferences=function(handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("act", "99");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
ResourceManager.request('/cgi-bin/emailCompose.cgi', 1, 
ApplicationEmail.store.handlePreferences, p, 
Array(handler, params), undefined); 
}
ApplicationEmail.store.getGeneralSettings=function(handler, params) {
ApplicationEmail.store.getSettings(1, handler, params);
}
ApplicationEmail.store.getNameAndSigSettings=function(handler, params) {
ApplicationEmail.store.getSettings(2, handler, params);
}
ApplicationEmail.store.getPopSettings=function(handler, params) {
ApplicationEmail.store.getSettings(3, handler, params);
}
ApplicationEmail.store.getSpellcheckSettings=function(handler, params) {
ApplicationEmail.store.getSettings(4, handler, params);
}
ApplicationEmail.store.getFilterSettings=function(handler, params) {
ApplicationEmail.store.getSettings(5, handler, params);
}
ApplicationEmail.store.getJunkSettings=function(handler, params) {
ApplicationEmail.store.getSettings(10, handler, params);
}
ApplicationEmail.store.getJunkSettings2=function(handler, params) {
var url="/IOffice/Common/wizard.asp?xml=<request><req_id>usrHasThreshold</req_id><userid>"+user_prefs["user_id"]+"</userid></request>";
ResourceManager.request(url, 1000, ApplicationEmail.store.handleSettings, undefined, Array(handler, params), undefined);
}
ApplicationEmail.store.getOutOfOfficeSettings=function(handler, params) {
ApplicationEmail.store.getSettings(6, handler, params);
}
ApplicationEmail.store.getForwardingSettings=function(handler, params) {
ApplicationEmail.store.getSettings(9, handler, params);
}
ApplicationEmail.store.getSettings=function(opts, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("act", "13");
p.param("opts", opts);
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
ResourceManager.request('/cgi-bin/emailGetOptions.cgi', 1, 
ApplicationEmail.store.handleSettings, p, 
Array(handler, params), undefined); 
}
ApplicationEmail.store.createPopAccount=function(account, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("prevUri", "");
p.param("reloadurl", "");
p.param("act", "14");
p.param("opts", "3");
p.param("id", "new");
p.param("dname", account.name);
p.param("server", account.server);
p.param("login", account.login);
p.param("password", account.password);
p.param("timeout", account.timeout);
p.param("port", account.port);
p.param("leaveOnServer", (account.leave_on_server ? "1" : "0"));
var nId=Notifications.add("Creating POP account");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.updatePopAccount=function(account, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("prevUri", "");
p.param("reloadurl", "");
p.param("act", "14");
p.param("opts", "3");
p.param("id", account.id);
p.param("dname", account.name);
p.param("server", account.server);
p.param("login", account.login);
p.param("password", account.password);
p.param("timeout", account.timeout);
p.param("port", account.port);
p.param("leaveOnServer", (account.leave_on_server ? "1" : "0"));
var nId=Notifications.add("Updating POP account");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.deletePopAccount=function(account, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("act", "14");
p.param("opts", "3");
p.param("id", account.id);
p.param("prevUri", "");
p.param("reloadurl", "");
p.param("delete", "1");
var nId=Notifications.add("Deleting POP account");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.saveSpellcheckSettings=function(settings,handler,params) {
var p=new ResourcePost();
p.param("gds","1");
p.param("unm",user_prefs["user_name"]);
p.param("sid",user_prefs["session_id"]);
p.param("act","14");
p.param("opts","4");
p.param("OptLangMain",settings.spell_dict());
p.param("customDictAdd",settings.spell_customDictAdd());
p.param("customDictDel",settings.spell_customDictDel());
p.param("ignCap",((settings.spell_opts().indexOf("ignCap")!=-1) ? "1" : "0"));
p.param("ignAllCap",((settings.spell_opts().indexOf("ignAllCap")!=-1) ? "1" : "0"));
p.param("ignNum",((settings.spell_opts().indexOf("ignNum")!=-1) ? "1" : "0"));
p.param("ignMixed",((settings.spell_opts().indexOf("ignMixed")!=-1) ? "1" : "0"));
p.param("ignDomain",((settings.spell_opts().indexOf("ignDomain")!=-1) ? "1" : "0"));
p.param("ignHtml",((settings.spell_opts().indexOf("ignHtml")!=-1) ? "1" : "0"));
p.param("checkDouble",((settings.spell_opts().indexOf("checkDouble")!=-1) ? "1" : "0"));
p.param("caseSens",((settings.spell_opts().indexOf("caseSens")!=-1) ? "1" : "0"));
p.param("suggestSplit",((settings.spell_opts().indexOf("suggestSplit")!=-1) ? "1" : "0"));
var nId=Notifications.add("Updating spellcheck settings");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.saveFilterSettings=function(settings,handler,params) {
var p=new ResourcePost();
p.param("gds","1");
p.param("unm",user_prefs["user_name"]);
p.param("sid",user_prefs["session_id"]);
p.param("act","14");
p.param("opts","5");
p.param("priorityList",settings.getFilterPriorityList());
var nId=Notifications.add("Updating message filter settings");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.saveJunkSettings=function(settings, handler, params) {
var p=new ResourcePost();
var white_list=settings.spam_whitelist();
var black_list=settings.spam_blacklist();
var white_list_text="";
var black_list_text="";
for(var x=0; x < white_list.length; x++) {
if(white_list[x].remove) {
white_list_text+="del,"+white_list[x].id+";";
} else if(!white_list[x].id) {
white_list_text+="add,"+white_list[x].value+";";
}
}
for(var x=0; x < black_list.length; x++) {
if(black_list[x].remove) {
black_list_text+="del,"+black_list[x].id+";";
} else if(!black_list[x].id) {
black_list_text+="add,"+black_list[x].value+";";
}
}
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("act", "14");
p.param("opts", "10");
p.param("whiteListActions", white_list_text);
p.param("blackListActions", black_list_text);
p.param("threshold", settings.spam_threshold());
p.param("embeddedImageDisplay", (settings.show_images() ? "1" : "0"));
p.param("junkAction", settings.spam_action());
p.param("deleteAfter", settings.spam_cleanup());
p.param("autoWhitelist", settings.auto_whitelist());
p.param("filterType", settings.filter_type());
p.param("filterTypeSubjectText", settings.filter_type_subject_text());
var nId=Notifications.add("Saving junk settings");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.saveOutOfOfficeSettings=function(settings, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("act", "14");
p.param("opts", "6");
p.param("isOn", settings.oom_enabled());
p.param("recSubject", settings.oom_subject());
p.param("recBody", settings.oom_body());
var startDate=settings.oom_start_date().split("/");
var endDate=settings.oom_end_date().split("/");
if (startDate.length==3) {
p.param("startDateMonth", startDate[0]);
p.param("startDateDay", startDate[1]);
p.param("startDateYear", startDate[2]);
}
if (endDate.length==3) {
p.param("endDateMonth", endDate[0]);
p.param("endDateDay", endDate[1]);
p.param("endDateYear", endDate[2]);
}
var nId=Notifications.add("Saving email out of office message settings");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.saveForwardingSettings=function(settings, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("act", "14");
p.param("opts", "9");
p.param("isEnabled", settings.forward_enabled());
p.param("forwardAddress", settings.forward_address());
p.param("deliverBlueTieCopy", settings.forward_save_copy());
var nId=Notifications.add("Saving email forwarding settings");
ResourceManager.request('/cgi-bin/emailSetOptions.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.getAttachments=function(message, mode, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("att", "1");
if(mode==2) p.param("htm", "1");
else			p.param("htm", "0");
p.param("emid", message.id());
p.param("fid", message.folder_id());
if(mode==0) {
p.param("act", "DRF");
} else {
p.param("act", "FWD");
}
ResourceManager.request('/cgi-bin/emailCompose.cgi', 1, 
ApplicationEmail.store.handleAttachments, p, 
Array(handler, params), undefined); 
}
ApplicationEmail.store.markMessages=function(msgs, mode, handler, 
params, quiet, flag) {
var p=new ResourcePost();
var srdata="";
p.param("gds", "1");
p.param("act", "7");
if (flag==undefined)
p.param("fvalue", "16");
else
p.param("fvalue", flag);
p.param("fmode", mode);
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
for(var x=0; x < msgs.length; x++) {
if(x > 0) {
srdata+="|";
}
srdata+=msgs[x].folder_id()+":"+msgs[x].id();
}
p.param("srdata", srdata);
var modeName=Array("", "read", "unread");
var cmA;
if (quiet!=true) {
nId=Notifications.add("Marking messages as "+modeName[mode]);
cmA=Array(handler, params, nId);
}
else {
cmA=Array(handler, params);
}
ResourceManager.request('/cgi-bin/emailSetMsgStatus.cgi', 2, 
ApplicationEmail.store.genericHandler, p, 
cmA, undefined); 
}
ApplicationEmail.store.emptyFolder=function(folder_id, handler, params) {
var p=new ResourcePost();
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("act", "5");
p.param("deleteall", "1");
p.param("reloadurl", "");
p.param("fid", folder_id);
var nId=Notifications.add("Emptying folder");
ResourceManager.request('/cgi-bin/emailDeleteMsg.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
ApplicationEmail.changeFolderTotal(folder_id, undefined, Array('', -1, 0));
}
ApplicationEmail.store.deleteMessages=function(msgs, handler, 
params) {
ExtensionBannerAds.refreshAll();
var p=new ResourcePost();
var msg_ids="";
var folder_id="";
p.param("gds", "1");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("act", "5");
p.param("deleteall", "5");
p.param("reloadurl", "");
for(var x=0; x < msgs.length; x++) {
if(x > 0) {
msg_ids+=",";
}
msg_ids+=msgs[x].id();
folder_id=msgs[x].folder_id();
}
p.param("msgid", msg_ids);
p.param("fid", folder_id);
var nId=Notifications.add("Deleting messages");
ResourceManager.request('/cgi-bin/emailDeleteMsg.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.junkMessages=function(msgs, handler, 
params) {
var p=new ResourcePost();
var srdata="";
p.param("gds", "1");
p.param("act", "6");
p.param("reloadurl", "");
p.param("cb", "");
p.param("cbtarget", "");
p.param("tf", ApplicationEmail.i_junk_folder);
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
var newcount=0;
for(var x=0; x < msgs.length; x++) {
if(x > 0) {
srdata+="|";
}
srdata+=msgs[x].folder_id()+":"+msgs[x].id();
if(msgs[x].is_new()) newcount++;
}
p.param("srdata", srdata);
var nId=Notifications.add("Sending messages to junk folder");
ResourceManager.request('/cgi-bin/emailMarkJunk.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
ApplicationEmail.changeFolderTotal(ApplicationEmail.i_junk_folder, 
undefined, Array('', 1, msgs.length, newcount));
this.reset_safe_block_list();
}
ApplicationEmail.store.unjunkMessages=function(msgs, handler, 
params) {
var p=new ResourcePost();
var srdata="";
p.param("gds", "1");
p.param("act", "6");
p.param("reloadurl", "");
p.param("cb", "");
p.param("cbtarget", "");
p.param("tf", ApplicationEmail.i_junk_folder);
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
var newcount=0;
for(var x=0; x < msgs.length; x++) {
if(x > 0) {
srdata+="|";
}
srdata+=ApplicationEmail.i_junk_folder+":"+msgs[x].id();
if(msgs[x].is_new()) newcount++;
}
p.param("srdata", srdata);
var nId=Notifications.add("Removing messages from junk folder");
ResourceManager.request('/cgi-bin/emailMarkNotJunk.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
ApplicationEmail.changeFolderTotal(ApplicationEmail.i_inbox_folder,
undefined, Array('', 1, msgs.length, newcount));
this.reset_safe_block_list();
}
ApplicationEmail.store.reset_safe_block_list=function() {
var prefs_list=Application.getApplicationById(1007).i_preference_panes;
for(var i=0; i<prefs_list.length; i++) {
if(prefs_list[i].name()=="Junk Mail Controls") {
prefs_list[i].invalidate_spam_prefs_page();
break;
}
}
}
ApplicationEmail.store.moveMessages=function(msgs, folder_id,
handler, params) {
ExtensionBannerAds.refreshAll();
if(folder_id==ApplicationEmail.i_junk_folder) {
ApplicationEmail.store.junkMessages(msgs, handler, params);
return;
}
var p=new ResourcePost();
var srdata="";
p.param("gds", "1");
p.param("act", "6");
p.param("reloadurl", "");
p.param("cb", "");
p.param("cbtarget", "");
p.param("tf", folder_id);
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
var newcount=0;
for(var x=0; x < msgs.length; x++) {
if(x > 0) {
srdata+="|";
}
srdata+=msgs[x].folder_id()+":"+msgs[x].id();
if(msgs[x].is_new()) newcount++;
}
ApplicationEmail.changeFolderTotal(folder_id, undefined, Array("", 1, msgs.length, newcount), undefined);
p.param("srdata", srdata);
var nId=Notifications.add("Moving messages");
ResourceManager.request('/cgi-bin/emailMoveMsg.cgi', 1, 
ApplicationEmail.store.genericHandler, p, 
Array(handler, params, nId), undefined); 
}
ApplicationEmail.store.getVcardAttachment=function(type, csid, handler, params) {
var p=new ResourcePost();
var xml="<params><method>AttachMyVcard</method><caller>"+user_prefs['user_name']+"</caller><owner>"+user_prefs['user_name']+"</owner><csid>"+csid+"</csid><which>";
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
switch(type) {
case 1:
xml+="work";
break;
case 2:
xml+="personal";
break;
case 3:
xml+="all";
break;
}
xml+="</which></params>";
p.param("xml", xml);
ResourceManager.request("/cgi-bin/contacts/core-AttachMyVcard.fcg",
1, ApplicationEmail.store.handleVcardAttachment, p,
Array(type, handler, params), undefined);
}
ApplicationEmail.store.getContactsAttachment=function(contactid, csid, handler, params) {
var p=new ResourcePost();
var xml="<params><method>PrepareAttachment</method><caller>"+user_prefs['user_name']+"</caller><owner>"+user_prefs['user_name']+"</owner><csid>"+csid+"</csid><contacts>"+contactid;
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
xml+="</contacts></params>";
p.param("xml", xml);
ResourceManager.request("/cgi-bin/contacts/core-PrepareAttachment.fcg",
1, ApplicationEmail.store.handleVcardAttachment, p,
Array(contactid, handler, params), undefined);
}
ApplicationEmail.store.sendMessage=function(message, save_copy, handler, draft, autosave, contact_array) {
var p=new ResourcePost();
var domain=message.from();
var att_list="";
var att_names="";
var att_size=0;
if(autosave==undefined) autosave=false;
domain=domain.replace(/^.*@/, "");
p.param("unm", user_prefs['user_name']);
p.param("sid", user_prefs['session_id']);
p.param("gds", "1");
p.param("act", "20");
p.param("sendIt", "1");
p.param("opts", "");
p.param("previewFromMsgView", "1");
p.param("hideBT", "0");
p.param("msgID", "");
p.param("msgAction", (autosave ? "DRF" : "SUBMIT"));
p.param("emSigned", "False");
p.param("remAttID", "");
p.param("EmailIdPass", "");
p.param("EmailFolderPass", "");
p.param("srtc", "");
p.param("srto", "");
p.param("removeAllAttachments", "");
p.param("saveAs", "draft");
p.param("senderName", "");
p.param("simpleClickShown", "");
p.param("signature", "");
p.param("attach_html", "1");
p.param("attachmentSelection", "0");
p.param("isAttOnline", "");
if(message.attachments()!=undefined) {
var attachments=message.attachments();
for(var x=0; x < attachments.length; x++) {
if(x > 0) {
att_names+=", ";
}
att_size+=parseInt(attachments[x].size);
att_names+=attachments[x].name;
att_list+="/"+attachments[x].id+";"+attachments[x].size+(draft? ";17;" : ";10;")+attachments[x].name;
}
}
if(message.internal_id()!=undefined && 
message.id()!=undefined) {
p.param("internalId", message.internal_id());
p.param("emid", message.id());
p.param("msgIDType", "DRF2");
} else {
p.param("msgIDType", "");
}
if(message.session_id()!=undefined) {
p.param("csid", message.session_id());
} else {
p.param("csid", "");
}
if(autosave)		p.param('SaveDraft', '2');
else if(draft)	p.param('SaveDraft', '1');
else				p.param('SaveDraft', '');
p.param("emAttIDList", att_list);
p.param("attNameList", att_names);
p.param("totalSize", att_size);
p.param("domain", domain);
p.param("senderAddress", message.from());
var msg_to=message.to();
if (msg_to.charAt(msg_to.length - 1)==",") {
msg_to=msg_to.substr(0, msg_to.length - 1);
}
p.param("to", msg_to);
p.param("cc", message.cc());
p.param("bcc", message.bcc());
p.param("subject", message.subject());
p.param("emSaveCopy", (!draft && save_copy ? "1" : "0"));
p.param("emSaveCopy2", (!draft && save_copy ? "1" : "0"));
p.param("targetFormat", (message.html() ? "1" : "0"));
p.param("bodyFormat", (message.html() ? "1" : "0"));
p.param("editor", message.body());
p.param("imp", message.importance());
p.param("omsgid", message.omsgid());
p.param("ofid", message.ofid());
p.param("omsgmark", message.omsgmark());
if(message.html()) {
p.param("textMessage", message.body_text());
p.param("htmlMessage", message.body());
} else {
p.param("textMessage", message.body());
p.param("htmlMessage", "");
}
if((draft || autosave) && (contact_array!=undefined) &&
(contact_array.length > 0)) {
var group_id_string='';
for(var i=0; i<contact_array.length; i++) {
if(i>0) group_id_string+=',';
group_id_string+=contact_array[i].uuid;
}
p.param("groupids", group_id_string);
} else {
p.param("groupids", "");
}
var nId;
if(autosave || draft) {
nId=Notifications.add("Saving draft");
var draftvalues=['Drafts', 1, 0, 0];
if (message==undefined || message.internal_id()==undefined || !ApplicationEmail.i_can_haz_draft[message.internal_id()]) {
draftvalues=['Drafts', 1, 1, 1];
ApplicationEmail.i_can_haz_draft[message.internal_id()]=true;
}
ApplicationEmail.changeFolderTotal(ApplicationEmail.i_draft_folder, "Drafts", draftvalues, undefined);
} else if(save_copy) {
nId=Notifications.add("Sending message");
ApplicationEmail.changeFolderTotal(ApplicationEmail.i_sent_folder, 
"Sent-Mail", Array('Sent-Mail', 1, 1, 0), undefined);
} else {
nId=Notifications.add("Sending message");
}
if (!draft && !autosave && message!=undefined && message.internal_id()!=undefined) {
if(ApplicationEmail.i_can_haz_draft[message.internal_id()]) {
ApplicationEmail.changeFolderTotal(ApplicationEmail.i_draft_folder, 
"Drafts", Array('Drafts', 1, -1, -1), undefined);
}
if (!delete ApplicationEmail.i_can_haz_draft[message.internal_id()]) {
ApplicationEmail.i_can_haz_draft[message.internal_id()]=undefined;
}
}
ResourceManager.request('/cgi-bin/emailSendMsg.cgi', 1, 
ApplicationEmail.store.handleSend, p, 
Array(handler, params, nId), undefined);
}
ApplicationEmail.store.saveDraft=function(message, handler, contact_array) {
ApplicationEmail.store.sendMessage(message, false, handler, true, false, contact_array);
}
ApplicationEmail.store.autoSaveMessage=function(message, handler, contact_array) {
ApplicationEmail.store.sendMessage(message, false, handler, true, true, contact_array);
}
ApplicationEmail.store.genericHandler=function(data, xml, req, params) {
if (params!=undefined) {
var cb;
var pm;
var ni;
var mi;
switch (params.length) {
case 4:
mi=params[3];
case 3:
ni=params[2];
case 2:
pm=params[1];
case 1:
cb=params[0];
}
if (ni!=undefined) {
if (mi!=undefined) {
Notifications.end(ni, undefined, false, mi);
}
else {
Notifications.end(ni);
}
}
if (cb!=undefined) {
try { 
cb(pm);
}catch(e) {}
}
}
}
ApplicationEmail.store.handleVcardAttachment=function(data, xml, req, params) {
var d=xml.documentElement;
var code=getXMLValue(d, "code");
if(code==0) {
var attachment=getXMLValue(d, "attachment");
var csid=getXMLValue(xml.documentElement, "csid");
var atts=attachment.split("/");
var att_list=Array();
var type=params[0];
for(var x=0; x < atts.length; x++) {
if(atts[x].length > 0) {
var att_data=atts[x].split(";");
var att=new Object();
att.id=att_data[0];
att.name=att_data[3];
att.size=parseInt(att_data[1]);
att.type=att_data[2];
if(type >=1 && type <=3) {
att.vcard_type=type;
} else {
att.contact_uuid=type;
}
att_list.push(att);
}
}
var handler=params[1];
var handler_params=params[2];
if(handler!=undefined) {
handler(att_list, csid, handler_params);
}
}
}
ApplicationEmail.store.handleAttachments=function(data, xml, req, params) {
var attachments=Array();
var att_list=getXMLValue(xml.documentElement, 'emAttIDList');
var csid=getXMLValue(xml.documentElement, 'csid');
if(att_list!=undefined && att_list.length > 0) {
var att_list_split=att_list.split("/");
for(var x=1; x < att_list_split.length; x++) {
var att_details=att_list_split[x].split(";");
var attachment=new Object();
attachment.id=att_details[0];
attachment.size=parseInt(att_details[1]);
attachment.name=att_details[3];
attachments.push(attachment);
}
}
if(params.length > 0) {
var handler=params[0];
if(params.length > 1) {
var handler_params=params[1];
if(handler!=undefined) {
handler(attachments, csid, handler_params);
}
} else {
if(handler!=undefined) {
handler(attachments, csid);
}
}
}
}
ApplicationEmail.store.handlePreferences=function(data, xml, req, params) {
ApplicationEmail.i_preferences.readElement(xml.documentElement);
if(params.length > 0) {
var handler=params[0];
if(handler!=undefined) {
if(params.length > 1) {
var handler_params=params[1];
if(typeof(handler)=="object") {
handler.execute(handler_params);
} else {
handler(handler_params);
}
} else {
if(typeof(handler)=="object") {
handler.execute();
} else {
handler();
}
}
}
}
}
ApplicationEmail.store.handleSettings=function(data, xml, req, params) {
var ret=new EmailPreferences();
ret.readElement(xml.documentElement);
if(params.length > 0) {
var handler=params[0];
if(params.length > 1) {
var handler_params=params[1];
if(handler!=undefined) {
handler(ret, handler_params);
}
} else {
if(handler!=undefined) {
handler(ret);
}
}
}
}
ApplicationEmail.store.handleMessage=function(data, xml, req, params) {
var message=params[0];
var callback=params[1];
var callback_params=params[2];
if(message==undefined) {
message=new EmailMessage();
}
var message_xml=xml.documentElement;
message.readViewElement(message_xml);
if(callback!=undefined) {
callback(message, callback_params);
}
}
ApplicationEmail.store.formatSize=function(rawNumber){
if (isNaN(rawNumber)){
return "0 B";
}else if(rawNumber>=1073741824){
return(" "+(Math.round(10 * rawNumber / 1073741824)/10)+" GB");
}else if (rawNumber>512000){
return (" "+(Math.round(10 * rawNumber / 1048576)/10)+" MB");
}else if(rawNumber>512){
return (" "+(Math.round(rawNumber / 1024))+" KB");
}else{
return (" "+rawNumber+" B");
}
}
ApplicationEmail.store.handleFolders=function(data, xml, req, params) {
var cb=undefined;
if (params!=undefined) {
if (params.length > 0) {
cb=params[0];
params.splice(0, 1);
}
}
if(xml) {
var d=xml.documentElement;
} else {
ApplicationEmail.store.requestFolders();
return;
}
if(d!=undefined) {
var quota=d.getElementsByTagName('quota')[0];
var quota_used=quota.getAttribute('used');
var quota_free=quota.getAttribute('free');
var quota_total=parseInt(quota_used)+parseInt(quota_free);
ApplicationEmail.i_quota.updateQuota(quota_used, quota_total);
ApplicationEmail.quota_display_refresh=false;
var mail_id=d.getElementsByTagName('maildir')[0].getAttribute('id');
ApplicationEmail.i_main_folder=mail_id;
if (quota!=undefined) {
if (ApplicationEmail.i_folder_tree_hash==undefined) {
ApplicationEmail.i_folder_cache=Array();
ApplicationEmail.i_folder_tree_ids=Array();
ApplicationEmail.i_folder_tree_hash=Array();
ApplicationEmail.i_folder_tree_ids.push("0");
ApplicationEmail.i_folder_tree_hash["0"]=0;
ApplicationEmail.i_last_system=0;
}
var emf=d.getElementsByTagName("mbox");
for (var x=0; x < emf.length; x++) {
var newFolder=false;
var nFolder=new EmailFolder();
nFolder.readElement(emf[x]);
if (ApplicationEmail.i_folder_ref[nFolder.id()]==undefined) {
ApplicationEmail.i_folder_ref[nFolder.id()]=nFolder;
newFolder=true;
if(nFolder.name()=="INBOX") {
var email=Application.getApplicationById(1007);
EventHandler.register(nFolder, "onunreadchange", email.handleInboxUnreadChange, email);
}
}
else {
tFolder=ApplicationEmail.i_folder_ref[nFolder.id()];
tFolder.name(nFolder.name());
tFolder.newMessages(nFolder.newMessages());
tFolder.totalMessages(nFolder.totalMessages());
nFolder=tFolder;
}
if (nFolder.name()=="INBOX" && ApplicationEmail.getDataModel().activeFolder()==undefined) {
ApplicationEmail.getDataModel().activeFolder(nFolder.id());
var efWin=WindowObject.getWindowById('eml-messages');
efWin.name('Emails: '+nFolder.name());
ApplicationEmail.i_search_box.value(ApplicationEmail.i_search_box.defaultValue());
ApplicationEmail.i_inbox_folder=nFolder.id();
}
if (newFolder==true) {
nFolder.i_system=true;
if(nFolder.parentId()=='') { 
if (nFolder.name()=="INBOX") {
ApplicationEmail.i_inbox_folder=nFolder.id();
} 
else if (nFolder.name()=="Trash") {
ApplicationEmail.i_trash_folder=nFolder.id();
}
else if(nFolder.name()=="Junk-Mail") {
ApplicationEmail.i_junk_folder=nFolder.id();
}
else if(nFolder.name()=="Drafts") {
ApplicationEmail.i_draft_folder=nFolder.id();
}
else if(nFolder.name()=="Sent-Mail") {
ApplicationEmail.i_sent_folder=nFolder.id();
}
else {
nFolder.i_system=false;
}
} else {
nFolder.i_system=false;
}							
if (nFolder.parentId()!="") {
if (ApplicationEmail.i_folder_ref[nFolder.parentId()]!=undefined) {
if (ApplicationEmail.i_folder_ref[nFolder.parentId()].children==undefined) {
ApplicationEmail.i_folder_ref[nFolder.parentId()].children=Array();
}
ApplicationEmail.i_folder_ref[nFolder.parentId()].children.push(nFolder);
}
} 
else {
if (nFolder.i_system==true) {
ApplicationEmail.i_folder_cache.splice(ApplicationEmail.i_last_system+1, 0, nFolder);
ApplicationEmail.i_last_system++;
}
else {
ApplicationEmail.i_folder_cache.push(nFolder);
}
}
var xid=ApplicationEmail.i_folder_tree_ids.length;
ApplicationEmail.i_folder_tree_ids[xid]=nFolder.id();
ApplicationEmail.i_folder_tree_hash[nFolder.id()]=xid;
}
}
var folder_tree=ApplicationEmail.getRootFolder();
ApplicationEmail.getFolderTree().building(true);
ApplicationEmail.buildFolderTree(ApplicationEmail.i_folder_cache, ApplicationEmail.getRootFolder(), ApplicationEmail.i_move_menu);
ApplicationEmail.getFolderTree().building(false);
}
if (cb!=undefined) {
cb();
}
}
}
ApplicationEmail.getFolderNameById=function(folder_id) {
if (ApplicationEmail.i_folder_tree_hash==undefined) {
return "";
}
return ApplicationEmail.i_folder_ref[folder_id];
}
ApplicationEmail.changeFolderTotal=function(folder_id, folder_name, values) {
ApplicationEmail.traverseFolderTree(folder_id, folder_name, ApplicationEmail.handleFolderTotalChange, values);
}
ApplicationEmail.traverseFolderTree=function(folder_id, folder_name, callback, values) {
var rootFolder=ApplicationEmail.getRootFolder();
var folder;
if ((rootFolder==undefined) || (rootFolder==null) || (rootFolder.children()==undefined)) {
return;
}
for (var x=0; x < rootFolder.children().length; x++) {
folder=rootFolder.children(x);
if (callback(folder.i_folder, folder_id, folder_name, values)) {
return;
} else {
if ((folder.children!=undefined) && (folder.children()!=undefined)) {
if (ApplicationEmail.traverseFolderChildren(folder.children(), folder_id, folder_name, callback, values)) {
return;
}
}
}
}
}
ApplicationEmail.traverseFolderChildren=function(children, folder_id, folder_name, callback, values) {
var folder;
for (var x=0; x < children.length; x++) {
folder=children[x].i_folder;
if (callback(folder, folder_id, folder_name, values)) {
return true;
} else {
if ((children[x].children!=undefined) && (children[x].children()!=undefined)) {
if (ApplicationEmail.traverseFolderChildren(children[x].children(), folder_id, folder_name, callback, values)) {
return true;
}
}
}
}
return false;
}
ApplicationEmail.handleFolderTotalChange=function(folder, folder_id, folder_name, values) {
if (folder_id!=undefined) {
if ((folder.id==undefined) || (folder.id()==undefined) || (folder.id()!=folder_id)) {
return false;
}
} else {
if (folder_name==undefined) {
return false;
}
if ((folder.name==undefined) || (folder.name()==undefined) || (folder.name!=folder_name)) {
return false;
}
}
if(values[1]==-1) {			
folder.totalMessages(0);
folder.newMessages(0);
} else if (values[1]==0) {	
folder.totalMessages(parseInt(folder.totalMessages()) - parseInt(values[2]));
} else {						
folder.totalMessages(parseInt(folder.totalMessages())+parseInt(values[2]));
if(values[3]!=undefined) {
folder.newMessages(parseInt(folder.newMessages())+parseInt(values[3]));
}
}
return true;
}
ApplicationEmail.store.getFolders=function(callback, params) {
var p=new ResourcePost();
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('gds', 1);
if (callback!=undefined) {
if (params==undefined) {
params=Array();
}
params.splice(0, 0, callback);
}
else {
params=undefined;
}
ResourceManager.request('/cgi-bin/emailGetFolderTree.cgi?'+p.toString(), 1, ApplicationEmail.store.handleFolders, undefined, params);
}
ApplicationEmail.store.requestFolders=function(callback, params) {
if (ApplicationEmail.i_folder_tree_hash==undefined || ApplicationEmail.quota_display_refresh==true) {
ApplicationEmail.store.getFolders(callback,params);
return;
}
if (callback!=undefined) {
callback();
}
}
ApplicationEmail.store.handleRename=function(data, xml, req, params) {
var d=xml.documentElement;
var code=getXMLValue(d, "code");
var nId=params[0];
var cb=params[1];
var folder=params[2];
var name=params[3];
params.splice(0, 4);
if (code==1) {
folder.name(name);
var node=folder.i_tree_item;
var nodeParent=node.parent();
nodeParent.removeNode(node);
var beforeNode;
if (nodeParent.children()!=undefined) {
for (var x=0; x < nodeParent.children().length; x++) {
if (nodeParent.children(x).name().toLowerCase() > node.name().toLowerCase() && !nodeParent.children(x).i_folder.i_system) {
beforeNode=nodeParent.children(x);
break;
}
}
}
nodeParent.addNode(node, beforeNode);
ApplicationEmail.i_folderTree.refresh();
ApplicationEmail.folder_root.open(false);
ApplicationEmail.folder_root.open(true);
Notifications.end(nId);
if (cb!=undefined) {
cb(folder, name, params);
}
}
else if (code=="-3"){
Notifications.end(nId, undefined, true, "Folder name '"+name+"' is already in use.", true);
folder.i_tree_item.name(folder.name());
}
else if (code=="-14") {
Notifications.end(nId, undefined, true, "Folder name '"+name+"' contains invalid characters: [\"], ['], [<], [>], [\\], [/], [.]", true);
folder.i_tree_item.name(folder.name());
}
else {
var elems=d.getElementsByTagName("ufdesc");
var mesg="Folder '"+folder.name()+"' could not be renamed.";
if (elems[1]!=undefined) {
mesg=elems[1].firstChild.data;
} else if (elems[0]!=undefined) {
mesg=elems[0].firstChild.data;
}
Notifications.end(nId, undefined, true, mesg, true);
folder.i_tree_item.name(folder.name());
}
}
ApplicationEmail.store.handleSend=function(data, xml, req, params) {
var handler=params[0];
var handler_params=params[1];
var nId=params[2];
if (xml!=undefined && xml.documentElement!=undefined) {
var d=xml.documentElement;
if(d.getElementsByTagName('emid').length > 0) {
Notifications.end(nId);
handler(getXMLValue(d, "emid"), getXMLValue(d, "internalId"));
ApplicationEmail.refreshCurrentFolder("Drafts");
return;
}
var code=getXMLValue(d, "code");
if(code==1) {
ApplicationEmail.store.genericHandler(data, xml, req, params);
try { 
handler(true, handler_params);
}catch(e) {}
} else {
Notifications.end(nId, undefined, true, "Error occurred while sending email message.", false);
handler(false, handler_params);
}
ApplicationEmail.refreshCurrentFolder("Drafts");
}
else {
handler(false, handler_params, true);
}
}
ApplicationEmail.store.renameFolder=function(folder, name, callback, params) {
if (params==undefined) {
params=Array();
}
var p=new ResourcePost();
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('gds', 1);
p.param('fid', folder.id());
p.param('nn', name);
params.splice(0, 0, name);
params.splice(0, 0, folder);
params.splice(0, 0, callback);
params.splice(0, 0, Notifications.add("Renaming folder '"+folder.name()+"' to '"+name+"'"));
ResourceManager.request('/cgi-bin/emailRenameFolder.cgi?'+p.toString(), 1, ApplicationEmail.store.handleRename, undefined, params);
}
ApplicationEmail.store.handleFolderMove=function(data, xml, req, params) {
var d=xml.documentElement;
var code=getXMLValue(d, "code");
var nId=params[0];
var cb=params[1];
var folder=params[2];
var destination=params[3];
params.splice(0, 4);
var dst=(destination!=ApplicationEmail.i_main_folder ? ApplicationEmail.i_folder_ref[destination].i_tree_item : ApplicationEmail.getRootFolder());
if (code==1) {
if(folder.i_tree_item.parent().i_folder && folder.i_tree_item.parent().i_folder.children) {
var children=folder.i_tree_item.parent().i_folder.children;
for(var i=0; i < children.length; i++) {
if(children[i]==folder) {
children.splice(i, 1);
break;
}
}
}
folder.i_tree_item.parent().removeNode(folder.i_tree_item);
var before;
if (dst.children()!=undefined) {
for (var x=0; x < dst.children().length; x++) {
if (dst.children(x).name().toLowerCase() > folder.name().toLowerCase() && !dst.children(x).i_folder.i_system) {
before=dst.children(x);
break;
}
}
}
if (destination==ApplicationEmail.i_main_folder) {
ApplicationEmail.getRootFolder().addNode(folder.i_tree_item, before);
}
else {
dst.addNode(folder.i_tree_item, before);
}
ApplicationEmail.i_folderTree.unselectAll();
ApplicationEmail.i_folderTree.refresh();
ApplicationEmail.folder_root.open(false);
ApplicationEmail.folder_root.open(true);
Notifications.end(nId);
if (cb!=undefined) {
cb(folder, name, params);
}
}
else if (code=="-3"){
Notifications.end(nId, undefined, true, "A folder already exists in '"+dst.name()+"' with the name '"+folder.name()+"'", true);
folder.i_tree_item.name(folder.name());
}
else {
var elems=d.getElementsByTagName("ufdesc");
var mesg="Folder '"+folder.name()+"' could not be moved.";
if (elems[1]!=undefined) {
mesg=elems[1].firstChild.data;
} else if (elems[0]!=undefined) {
mesg=elems[0].firstChild.data;
}
Notifications.end(nId, undefined, true, mesg, true);
}
}
ApplicationEmail.store.moveFolder=function(folder, destination, callback, params) {
if (params==undefined) {
params=Array();
}
var p=new ResourcePost();
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('gds', 1);
p.param("act", 17);
p.param('fid', folder.id());
p.param('tf', destination);
params.splice(0, 0, destination);
params.splice(0, 0, folder);
params.splice(0, 0, callback);
var dsn;
if (destination==ApplicationEmail.i_main_folder) {
dsn="My Folders";
}
else {
dsn=ApplicationEmail.i_folder_ref[destination].name();
}
params.splice(0, 0, Notifications.add("Moving folder '"+folder.name()+"' to '"+dsn+"'"));
ResourceManager.request('/cgi-bin/emailMoveFolder.cgi?'+p.toString(), 1, ApplicationEmail.store.handleFolderMove, undefined, params);
}
ApplicationEmail.store.handleFolderCreate=function(data, xml, req, params) {
var d=xml.documentElement;
var code=getXMLValue(d, "code");
var id=getXMLValue(d, "retval");
var nId=params[0];
var cb=params[1];
var folder=params[2];
var folder_id=params[3];
var name=params[4];
params.splice(0, 5);
if (code==1) {
var f=new EmailFolder();
f.name(name);
f.i_id=id;
f.parentId(folder_id);
f.depth((folder!=undefined ? folder.depth()+1 : 1));
f.newMessages(0);
f.totalMessages(0);
f.type(6);
ApplicationEmail.i_folder_ref[f.id()]=f;
var xid=ApplicationEmail.i_folder_tree_ids.length;
ApplicationEmail.i_folder_tree_ids[xid]=f.id();
ApplicationEmail.i_folder_tree_hash[f.id()]=(xid);
var fNode=(folder!=undefined ? folder.i_tree_item : ApplicationEmail.folder_root);
var before;
if (fNode.children()!=undefined) {
for (var x=0; x < fNode.children().length; x++) {
if (fNode.children(x).name().toLowerCase() > name.toLowerCase() && !fNode.children(x).i_folder.i_system) {
before=fNode.children(x);
break;
}
}
}
var count=f.totalMessages()+" message(s) in this folder";
var n=fNode.addNode(new LiteDataNode(xid, count, name, 0), before);
n.onmouseover=ApplicationEmail.setActiveDropFolder;
n.onmouseout=ApplicationEmail.clearActiveDropFolder;
n.onmousedown=ApplicationEmail.handleFolderClick;
n.onclick=ApplicationEmail.handleFolderRelease;
n.ondblclick=ApplicationEmail.handleFolderDoubleClick;
n.i_folder=f;
n.i_folder_id=f.id();
f.i_tree_item=n;
f.updateFolderStyle();
ApplicationEmail.i_folderTree.refresh();
Notifications.end(nId);
if (cb!=undefined) {
cb(f, params);
}
} else if (code=="-3") {
Notifications.end(nId, undefined, true, "Folder name '"+name+"' is already in use.", true);
} else if(code=="-14") {
Notifications.end(nId, undefined, true, "Folder '"+name+"' contains invalid characters: [\"], ['], [<], [>], [\\], [/], [.]", true);
} else {
var elems=d.getElementsByTagName("ufdesc");
var mesg="Folder '"+name+"' could not be created.";
if (elems[1]!=undefined) {
mesg=elems[1].firstChild.data;
} else if (elems[0]!=undefined) {
mesg=elems[0].firstChild.data;
}
Notifications.end(nId, undefined, true, mesg, true);
}
}
ApplicationEmail.store.createFolder=function(folder_id, parent_folder, name, callback, params) {
if (params==undefined) {
params=Array();
}
var p=new ResourcePost();
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('gds', 1);
p.param('tf', folder_id);
p.param('nn', name);
p.param("act", 8);
params.splice(0, 0, name);
params.splice(0, 0, folder_id);
params.splice(0, 0, parent_folder);
params.splice(0, 0, callback);
params.splice(0, 0, Notifications.add("Creating folder '"+name+"'."));
ResourceManager.request('/cgi-bin/emailCreateFolder.cgi?'+p.toString(), 1, ApplicationEmail.store.handleFolderCreate, undefined, params);
}
ApplicationEmail.store.handleFolderDelete=function(data, xml, req, params) {
var d=xml.documentElement;
var code=getXMLValue(d, "code");			
var nId=params[0];
var cb=params[1];
var folder=params[2];
params.splice(0, 3);
var fi=folder.i_tree_item;
if (code==1) {
fi.parent().removeNode(fi);
if (cb!=undefined) {
cb(f, params);
}
Notifications.end(nId);
} else if(code=="-8") {
Notifications.end(nId, undefined, true, "Folder '"+fi.name()+"' contains messages.", true);
} else if(code=="-9") {
Notifications.end(nId, undefined, true, "Folder '"+fi.name()+"' contains sub folders.", true);
}
else {
Notifications.end(nId, undefined, true, "Folder '"+fi.name()+"' could not be deleted.", true);
}
}
ApplicationEmail.store.deleteFolder=function(folder, callback, params) {
if (params==undefined) {
params=Array();
}
var p=new ResourcePost();
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('gds', 1);
p.param('fid', folder.id());
p.param("act", 9);
params.splice(0, 0, folder);
params.splice(0, 0, callback);
params.splice(0, 0, Notifications.add("Deleting folder '"+folder.name()+"'"));
ResourceManager.request('/cgi-bin/emailDeleteFolder.cgi?'+p.toString(), 1, ApplicationEmail.store.handleFolderDelete, undefined, params);
}
ApplicationEmail.enableEfax=function() {
ApplicationEmail.efaxEnabled=true;
ApplicationEmail.i_efax_menu_item.visible(true);
}
ApplicationEmail.inherit(Application);
SystemCore.registerApplication(new ApplicationEmail());
JavaScriptResource.notifyComplete("./src/Applications/Email/Application.Email.js");
function EmailFolder() {
}
EmailFolder.prototype.readElement=function(elem) {
this.i_id=elem.getAttribute('id');
this.i_pid=elem.getAttribute('pid');
this.i_depth=elem.getAttribute('lvl');
this.i_new=elem.getAttribute('n');
this.i_total=elem.getAttribute('t');
this.i_type=elem.getAttribute('y');
this.i_name=getXMLValue(elem, 'dname');
}
EmailFolder.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_menu_item!=undefined) {
this.i_menu_item.text(name);
}
this.updateFolderStyle();
}
return this.i_name;
}
EmailFolder.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
EmailFolder.prototype.parentId=function(parent_id) {
if (parent_id!=undefined) {
this.i_pid=parent_id;
}
return this.i_pid;
}
EmailFolder.prototype.depth=function(depth) {
if (depth!=undefined) {
this.i_depth=depth;
}
return this.i_depth;
}
EmailFolder.prototype.newMessages=function(messages) {
if (messages!=undefined) {
this.i_new=messages;
this.updateFolderStyle();
if(this.onunreadchange!=undefined) {
var o=new Object();
o.type="unreadchange";
o.event=this;
o.count=messages;
this.onunreadchange(o);
}
}
return this.i_new;
}
EmailFolder.prototype.updateFolderStyle=function() {
if (this.i_tree_item!=undefined) {
if (this.i_tree_item==ApplicationEmail.i_trash_folder_node && ApplicationEmail.i_trash_folder_node!=undefined) {
if (this.i_total > 0) {
ApplicationEmail.i_trash_folder_node.iconId(4);
}
else {
ApplicationEmail.i_trash_folder_node.iconId(6);
}
}
this.i_tree_item.name((this.newMessages() > 0 ? '<b>' : '')+this.name()+(this.newMessages() > 0 ? ' ('+this.newMessages()+')' : '')+(this.newMessages() > 0 ? '</b>' : ''));
this.i_tree_item.tipText(this.i_total+" message(s) in this folder");
}
return true;
}
EmailFolder.prototype.totalMessages=function(messages) {
if (messages!=undefined) {
this.i_total=messages;
this.updateFolderStyle();
}
return this.i_total;
}
EmailFolder.prototype.type=function(type) {
if (type!=undefined) {
this.i_type=type;
}
return this.i_type;
}
JavaScriptResource.notifyComplete("./src/Applications/Email/objects/Object.Folder.js");	
function EmailMessage() {
this.i_attachment_id="";
this.i_has_details=false;
this.i_body_text="";	
this.i_mreqid=0;
this.i_is_meeting_request=false;
}
EmailMessage.prototype.readElement=function(elem) {
this.i_id=getXMLValue(elem, 'id');
this.i_from=getXMLValue(elem, 'f');
this.i_subject=getXMLValue(elem, 's');
this.i_to=getXMLValue(elem, 't');
this.i_date=getXMLValue(elem, 'd');
this.i_date_stamp=getXMLValue(elem, 'ds');
this.i_size=getXMLValue(elem, 'z');
this.i_new=(getXMLValue(elem, 'n')=="1" ? true : false);
this.i_fid=getXMLValue(elem, 'loc');
this.i_importance=getXMLValue(elem, 'imp');		
if(this.i_importance==undefined) {
this.i_importance=1;
}
if (parseInt(this.i_importance)==NaN) {
this.i_importance=1;
}
this.i_omsgid="";
this.i_ofid="";
this.i_omsgmark=0;
this.i_has_attach=getXMLValue(elem, 'a');
this.i_replyforward=getXMLValue(elem, 'rf');	
if(this.i_replyforward==undefined) {
this.i_replyforward=0;			
}
if(parseInt(this.i_replyforward)==NaN) {
this.i_replyforward=0;			
}
if(this.i_has_attach!=undefined && 
parseInt(this.i_has_attach) > 0) {
this.i_has_attach=true;
} else {
this.i_has_attach=false;
}
if(this.i_date_stamp!=undefined) {
this.i_date_stamp=new Date(this.i_date_stamp * 1000);
var utc_date=getXMLValue(elem, 'du');
var zone_date=getXMLValue(elem, 'dz');
if (utc_date!=undefined && zone_date!=undefined) {
var offset=this.i_date_stamp.getTimezoneOffset() -
((parseInt(utc_date) - 
parseInt(zone_date)) / 60);
if(offset!=0) {
this.i_date_stamp=addMinutes(this.i_date_stamp, offset);
}
}
}
}
EmailMessage.prototype.readViewElement=function(elem) {
this.i_id=getXMLValue(elem, 'id');
this.i_from=getXMLValue(elem, 'f');
this.i_subject=getXMLValue(elem, 's');
this.i_to=getXMLValue(elem, 't');
this.i_date=getXMLValue(elem, 'd');
this.i_date_stamp=getXMLValue(elem, 'ds');
this.i_size=getXMLValue(elem, 'z');
this.i_new=(getXMLValue(elem, 'n')=="1" ? true : false);
this.i_fid=getXMLValue(elem, 'loc');
this.i_is_meeting_request=(getXMLValue(elem, 'ismr')=="1" ? true : false);
if(this.i_is_meeting_request) {
var mrtag=elem.getElementsByTagName('ismr')[0];
this.i_mreqid=mrtag.getAttribute('ev');
} else {
this.i_mreqid=0;
}
this.i_has_attach=getXMLValue(elem, 'a');
this.i_importance=getXMLValue(elem, 'imp');		
if(this.i_importance==undefined) {
this.i_importance=1;
}
if (parseInt(this.i_importance)==NaN) {
this.i_importance=1;
}		
if(this.i_has_attach!=undefined && 
parseInt(this.i_has_attach) > 0) {
this.i_has_attach=true;
} else {
this.i_has_attach=false;
}
if(this.i_date_stamp!=undefined) {
this.i_date_stamp=new Date(this.i_date_stamp * 1000);
var utc_date=getXMLValue(elem, 'du');
var zone_date=getXMLValue(elem, 'dz');
if (utc_date!=undefined && zone_date!=undefined) {
var offset=this.i_date_stamp.getTimezoneOffset() -
((parseInt(utc_date) - 
parseInt(zone_date)) / 60);
if(offset!=0) {
this.i_date_stamp=addMinutes(this.i_date_stamp, offset);
}
}
}
var from_data=elem.getElementsByTagName('df');
var to_data=elem.getElementsByTagName('rec');
var header_data=elem.getElementsByTagName('rh');
var attach_data=elem.getElementsByTagName('da');
this.i_body=getXMLValue(elem, 'messagebody');
this.i_body=this.i_body.replace(/\x91/g, "'");
this.i_body=this.i_body.replace(/\x92/g, "'");
this.i_body=this.i_body.replace(/\x93/g, '"');
this.i_body=this.i_body.replace(/\x94/g, '"');
this.i_internal_id=getXMLValue(elem, 'internalId');
if(this.i_body==undefined) {
this.i_body="";
}
this.i_html=getXMLValue(elem, 'ishtml');
this.i_from_display;
this.i_from_address;
if(from_data.length > 0) {
this.i_from_display=htmlUnencodeExtended(getXMLValue(from_data[0], 'dname'));
this.i_from_address=htmlUnencode(getXMLValue(from_data[0], 'addr'));
}
this.i_recipients=Array();
this.i_cc_recipients=Array();
this.i_bcc=Array();
for(var x=0; x < to_data.length; x++) {
var to=new Object();
var type=getXMLValue(to_data[x], 'y');
to.display=getXMLValue(to_data[x], 'dname');
to.address=getXMLValue(to_data[x], 'addr');
if(type=="1") {
this.i_recipients.push(to);
} else if(type=="2") {
this.i_cc_recipients.push(to);
} else if(type=="3") { 
this.i_bcc.push(to);
}
}
this.i_header=Array();
for(var x=0; x < header_data.length; x++) {
var header=new Object();
header.name=getXMLValue(header_data[x], 'name');
header.value=getXMLValue(header_data[x], 'value');
this.i_header.push(header);
}
this.i_attach=Array();
for(var x=0; x < attach_data.length; x++) {
var attach=new Object();
attach.id=getXMLValue(attach_data[x], 'id');
attach.name=getXMLValue(attach_data[x], 'dname');
attach.size=getXMLValue(attach_data[x], 'z');
attach.type=getXMLValue(attach_data[x], 'y');
this.i_attach.push(attach);
}
this.i_has_details=true;
}
EmailMessage.prototype.subject=function(subject) {
if (subject!=undefined) {
this.i_subject=subject;
}
return this.i_subject;
}
EmailMessage.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
EmailMessage.prototype.from=function(from) {
if (from!=undefined) {
this.i_from=from;
}
return this.i_from;
}
EmailMessage.prototype.to=function(to) {
if (to!=undefined) {
this.i_to=to;
}
return this.i_to;
}
EmailMessage.prototype.date=function(date) {
if (date!=undefined) {
this.i_date=date;
}
return this.i_date;
}
EmailMessage.prototype.date_stamp=function(date_stamp) {
if (date_stamp!=undefined) {
this.i_date_stamp=date_stamp;
}
return this.i_date_stamp;
}
EmailMessage.prototype.size=function(size) {
if (size!=undefined) {
this.i_size=size;
}
return this.i_size;
}
EmailMessage.prototype.folder_id=function(folder_id) {
if(folder_id!=undefined) {
this.i_fid=folder_id;
}
return this.i_fid;
}
EmailMessage.prototype.meetingRequestId=function(meetingRequestId) {
if(meetingRequestId!=undefined) {
this.i_mreqid=meetingRequestId;
}
return this.i_mreqid;
}
EmailMessage.prototype.isMeetingRequest=function(isrequest) {
if(isrequest!=undefined) {
this.i_is_meeting_request=isrequest;
}
return this.i_is_meeting_request;
}
EmailMessage.prototype.body_text=function(body) {
if (body!=undefined) {
this.i_body_text=body;
}		
return this.i_body_text;
}
EmailMessage.prototype.body=function(body) {
if(body!=undefined) {
this.i_body=body;
}
return this.i_body;
}
EmailMessage.prototype.html=function(html) {
if(html!=undefined) {
this.i_html=html;
}
return this.i_html;
}
EmailMessage.prototype.from_address=function(address) {
if(address!=undefined) {
this.i_from_address=address;
}
return this.i_from_address;
}
EmailMessage.prototype.from_display=function(display) {
if(display!=undefined) {
this.i_from_display=display;
}
return this.i_from_display;
}
EmailMessage.prototype.recipients=function(recipients) {
if(recipients!=undefined) {
this.i_recipients=recipients;
}
return this.i_recipients;
}
EmailMessage.prototype.cc=function(cc) {
if(cc!=undefined) {
this.i_cc_recipients=cc;
}
return this.i_cc_recipients;
}
EmailMessage.prototype.header=function(header) {
if(header!=undefined) {
this.i_header=header;
}
return this.i_header;
}
EmailMessage.prototype.bcc=function(bcc) {
if(bcc!=undefined) {
this.i_bcc=bcc;
}
return this.i_bcc;
}
EmailMessage.prototype.is_new=function(is_new) {
if(is_new!=undefined) {
if (this.i_new!=is_new) {
this.i_new=is_new;
var totalNew=ApplicationEmail.i_folder_ref[ApplicationEmail.getDataModel().activeFolder()].newMessages();
totalNew=Math.floor(totalNew)+(is_new ? 1 : -1);
ApplicationEmail.i_folder_ref[ApplicationEmail.getDataModel().activeFolder()].newMessages(totalNew);
}
}
return this.i_new;
}
EmailMessage.prototype.has_attachments=function(has_attach) {
if(has_attach!=undefined) {
this.i_has_attach=has_attach;
}
return this.i_has_attach;
}
EmailMessage.prototype.omsgid=function (omsgid) {
if(omsgid!=undefined) {
this.i_omsgid=omsgid;
}
return this.i_omsgid;
}
EmailMessage.prototype.ofid=function (ofid) {
if(ofid!=undefined) {
this.i_ofid=ofid;
}
return this.i_ofid;
}
EmailMessage.prototype.omsgmark=function (omsgmark) {
if(omsgmark!=undefined) {
this.i_omsgmark=omsgmark;
}
return this.i_omsgmark;
}
EmailMessage.prototype.importance=function (importance) {
if(importance!=undefined) {
this.i_importance=importance;
}
return this.i_importance;
}
EmailMessage.prototype.replyfwd=function (replyforward) {
if(replyforward!=undefined) {
this.i_replyforward=replyforward;
}
return this.i_replyforward;
}
EmailMessage.prototype.attachments=function(attachments) {
if(attachments!=undefined) {
this.i_attach=attachments;
}
return this.i_attach;
}
EmailMessage.prototype.internal_id=function(internal_id) {
if(internal_id!=undefined) {
this.i_internal_id=internal_id;
}
return this.i_internal_id;
}
EmailMessage.prototype.session_id=function(session_id) {
if(session_id!=undefined) {
this.i_session_id=session_id;
}
return this.i_session_id;
}
EmailMessage.prototype.attachment_id=function(attachment_id) {
if(attachment_id!=undefined) {
this.i_attachment_id=attachment_id;
}
return this.i_attachment_id;
}
EmailMessage.prototype.has_details=function(has_details) {
if(has_details!=undefined) {
this.i_has_details=has_details;
}
return this.i_has_details;
}
JavaScriptResource.notifyComplete("./src/Applications/Email/objects/Object.Message.js");	
function EmailPreferences() {
this.i_save_outgoing;
this.i_rich_compose;
this.i_reply_format;
this.i_auto_save;
this.i_signature;
this.i_append_sig;
this.i_display_name;
this.i_aliases;
this.i_messages_per_page;
this.i_search_limit;
this.i_notify_new_time;
this.i_notify_new_enabled;
this.i_preview_enabled;
this.i_pop_accounts;
this.i_spam_enabled;
this.i_spam_threshold;
this.i_show_threshold;
this.i_show_images;
this.i_spam_cleanup;
this.i_spam_action;
this.i_spam_blacklist;
this.i_spam_whitelist;
this.i_auto_whitelist;
this.i_filter_type;
this.i_filter_type_subject_text;
this.i_trash_cleanup;
this.i_vcard_attach;
this.i_forward_enabled;
this.i_forward_address;
this.i_forward_save_copy;
this.i_oom_enabled;
this.i_oom_start_date;
this.i_oom_end_date;
this.i_oom_subject;
this.i_oom_body;
}
EmailPreferences.prototype.readElement=function(element) {
var temp=element.getElementsByTagName('optCompose');
if(temp.length > 0) {
this.i_save_outgoing=(temp[0].getAttribute('saveOutgoing')=="1" ? true : false);
this.i_rich_compose=(temp[0].getAttribute('richComposer')=="1" ? true : false);
this.i_reply_format=(temp[0].getAttribute('replyFormat')=="1" ? true : false);
this.i_auto_save=temp[0].getAttribute('autoSave');
this.i_vcard_attach=temp[0].getAttribute('attachVCard');
}
temp=element.getElementsByTagName('optDisplay');
if(temp.length > 0) {
this.i_messages_per_page=temp[0].getAttribute('msgPerPage');
this.i_search_limit=temp[0].getAttribute('searchLimit');
this.i_notify_new_time=temp[0].getAttribute('notifyNewTime');
this.i_notify_new_enabled=temp[0].getAttribute('notifyNewEnabled');
this.i_trash_cleanup=temp[0].getAttribute('deleteAfter');
this.i_preview_enabled=(temp[0].getAttribute('preview')=="1" ? true : false);
}
temp=element.getElementsByTagName('signature');
if(temp.length > 0) {
this.i_signature=getXMLValue(temp);
this.i_append_sig=(temp[0].getAttribute('append')=="1" ? true : false);
}
this.i_display_name=getXMLValue(element, 'fromName');
temp=element.getElementsByTagName('aliasListDom');
if(temp.length > 0) {
this.i_aliases=Array();
for(var x=0; x < temp.length; x++) {
var aliases=temp[x].getElementsByTagName('alias');
for(var y=0; y < aliases.length; y++) {
var addr=aliases[y].getElementsByTagName('alias');
if(addr.length > 0) {
var current_domain_arr=addr[0].firstChild.data.split('@');
if (temp.length==1 || user_prefs['hide_bt_address']!=1 || current_domain_arr[1]!=user_prefs['domain_suffix']) {
var alias=new Object();
alias.address=addr[0].firstChild.data;
alias.mailing_list=(aliases[y].getAttribute('isMailingList')=="1" ? true : false);
alias.is_default=(aliases[y].getAttribute('isDefault')=="1" ? true : false);
alias.use_for_replies=(aliases[y].getAttribute('useForReplies')=="1" ? true : false);
this.i_aliases.push(alias);
}
}
}
}
}
temp=element.getElementsByTagName('popAccount');
if(temp.length > 0) {
this.i_pop_accounts=Array();
for(var x=0; x < temp.length; x++) {
var pop_account=new Object();
pop_account.id=temp[x].getAttribute('id');
pop_account.leave_on_server=(temp[x].getAttribute('leaveOnServer')=="1" ? true : false);
pop_account.timeout=temp[x].getAttribute('timeout');
pop_account.port=temp[x].getAttribute('port');
pop_account.name=getXMLValue(temp[x], 'dname');
pop_account.server=getXMLValue(temp[x], 'server');
pop_account.login=getXMLValue(temp[x], 'login');
pop_account.password=getXMLValue(temp[x], 'password');
this.i_pop_accounts.push(pop_account);
}
}
temp=element.getElementsByTagName('optSpam');
if(temp.length > 0) {
this.i_spam_enabled=(temp[0].getAttribute('isTurnedOn')=="1" ? true : false);
this.i_spam_threshold=temp[0].getAttribute('threshold');
this.i_show_images=(temp[0].getAttribute('embeddedImages')=="0" ? false : true);
this.i_spam_cleanup=temp[0].getAttribute('deleteAfter');
this.i_spam_action=temp[0].getAttribute('junkAction');
this.i_spam_blacklist=Array();
this.i_spam_whitelist=Array();
if(this.i_spam_action=="") {
this.i_spam_action="0";
}
if(this.i_spam_cleanup=="") {
this.i_spam_cleanup="0";
}
var blacklist_entries=temp[0].getElementsByTagName('blacklist_entry');
var whitelist_entries=temp[0].getElementsByTagName('whitelist_entry');
for(var x=0; x < blacklist_entries.length; x++) {
var blacklist_entry=new Object();
blacklist_entry.id=blacklist_entries[x].getAttribute('id');
blacklist_entry.value=blacklist_entries[x].firstChild.data;
this.i_spam_blacklist.push(blacklist_entry);
}
for(var x=0; x < whitelist_entries.length; x++) {
var whitelist_entry=new Object();
whitelist_entry.id=whitelist_entries[x].getAttribute('id');
whitelist_entry.value=whitelist_entries[x].firstChild.data;
this.i_spam_whitelist.push(whitelist_entry);
}
this.i_auto_whitelist=(temp[0].getAttribute('autoWhitelist')=="1" ? true : false);
if(temp[0].getAttribute('filterType')=='')
this.i_filter_type='0';
else 
this.i_filter_type=temp[0].getAttribute('filterType');
if(temp[0].getAttribute('filterTypeSubjectText')=='')
this.i_filter_type_subject_text='SPAM:';
else
this.i_filter_type_subject_text=temp[0].getAttribute('filterTypeSubjectText');
}
temp=element.getElementsByTagName('optShowSpamThreshold');
if(temp.length > 0) {
this.i_show_threshold=(XML.getTagData(temp[0], "hasThreshold")=="1" ? true : false);
}
temp=element.getElementsByTagName("optSpell");
if (temp.length > 0) {
this.i_spell_dict=temp[0].getAttribute("dict") / 10000;
this.i_spell_customDict=getXMLValue(temp[0],"customDict");
this.i_spell_customDictAdd="";
this.i_spell_customDictDel="";
var spell_opts=new Array();
if (temp[0].getAttribute("ignCap")==1) { spell_opts.push("ignCap"); }
if (temp[0].getAttribute("ignAllCap")==1) { spell_opts.push("ignAllCap"); }
if (temp[0].getAttribute("ignNum")==1) { spell_opts.push("ignNum"); }
if (temp[0].getAttribute("ignMixed")==1) { spell_opts.push("ignMixed"); }
if (temp[0].getAttribute("ignDomain")==1) { spell_opts.push("ignDomain"); }
if (temp[0].getAttribute("ignHtml")==1) { spell_opts.push("ignHtml"); }
if (temp[0].getAttribute("checkDouble")==1) { spell_opts.push("checkDouble"); }
if (temp[0].getAttribute("caseSens")==1) { spell_opts.push("caseSens"); }
if (temp[0].getAttribute("suggestSplit")==1) { spell_opts.push("suggestSplit"); }
this.i_spell_opts=spell_opts.join("+");
}
temp=element.getElementsByTagName("optContent");
if (temp.length > 0) {
this.i_msg_filters=new Array();
var filters=temp[0].getElementsByTagName("contentFilter");
for (var i=0;i<filters.length;i++) {
this.i_msg_filters.push(new MessageFilter(filters[i]));
}
}
temp=element.getElementsByTagName('optForwarding');
if(temp.length > 0) {
this.i_forward_enabled=temp[0].getAttribute('isEnabled');
this.i_forward_address=getXMLValue(element, 'forwardAddress');
this.i_forward_save_copy=temp[0].getAttribute('deliverBlueTieCopy');
}
temp=element.getElementsByTagName('optVac');
if(temp.length > 0) {
this.i_oom_enabled=temp[0].getAttribute('isOn');
this.i_oom_start_date=getXMLValue(element, 'recStart');
this.i_oom_end_date=getXMLValue(element, 'recEnd');
this.i_oom_subject=getXMLValue(element, 'recSubject');
this.i_oom_body=getXMLValue(element, 'recBody');
}
}
EmailPreferences.prototype.save_outgoing=function(save_outgoing) {
if (save_outgoing!=undefined) {
this.i_save_outgoing=save_outgoing;
}
return this.i_save_outgoing;
}
EmailPreferences.prototype.rich_compose=function(rich_compose) {
if (rich_compose!=undefined) {
this.i_rich_compose=rich_compose;
}
return this.i_rich_compose;
}
EmailPreferences.prototype.reply_format=function(reply_format) {
if (reply_format!=undefined) {
this.i_reply_format=reply_format;
}
return this.i_reply_format;
}
EmailPreferences.prototype.auto_save=function(auto_save) {
if (auto_save!=undefined) {
this.i_auto_save=auto_save;
}
return this.i_auto_save;
}
EmailPreferences.prototype.signature=function(signature) {
if (signature!=undefined) {
this.i_signature=signature;
}
return this.i_signature;
}
EmailPreferences.prototype.append_sig=function(append_sig) {
if (append_sig!=undefined) {
this.i_append_sig=append_sig;
}
return this.i_append_sig;
}
EmailPreferences.prototype.display_name=function(display_name) {
if (display_name!=undefined) {
this.i_display_name=display_name;
}
return this.i_display_name;
}
EmailPreferences.prototype.aliases=function(aliases) {
if (aliases!=undefined) {
this.i_aliases=aliases;
}
return this.i_aliases;
}
EmailPreferences.prototype.messages_per_page=function(messages_per_page) {
if (messages_per_page!=undefined) {
this.i_messages_per_page=messages_per_page;
}
return this.i_messages_per_page;
}
EmailPreferences.prototype.search_limit=function(search_limit) {
if (search_limit!=undefined) {
this.i_search_limit=search_limit;
}
return this.i_search_limit;
}
EmailPreferences.prototype.notify_new_time=function(notify_new_time) {
if (notify_new_time!=undefined) {
this.i_notify_new_time=notify_new_time;
}
return this.i_notify_new_time;
}
EmailPreferences.prototype.notify_new_enabled=function(notify_new_enabled) {
if (notify_new_enabled!=undefined) {
this.i_notify_new_enabled=notify_new_enabled;
}
return this.i_notify_new_enabled;
}
EmailPreferences.prototype.preview_enabled=function(preview_enabled) {
if (preview_enabled!=undefined) {
this.i_preview_enabled=preview_enabled;
}
return this.i_preview_enabled;
}
EmailPreferences.prototype.pop_accounts=function(pop_accounts) {
if (pop_accounts!=undefined) {
this.i_pop_accounts=pop_accounts;
}
return this.i_pop_accounts;
}
EmailPreferences.prototype.spam_enabled=function(spam_enabled) {
if (spam_enabled!=undefined) {
this.i_spam_enabled=spam_enabled;
}
return this.i_spam_enabled;
}
EmailPreferences.prototype.spam_threshold=function(spam_threshold) {
if (spam_threshold!=undefined) {
this.i_spam_threshold=spam_threshold;
}
return this.i_spam_threshold;
}
EmailPreferences.prototype.show_threshold=function() {
return this.i_show_threshold;
}
EmailPreferences.prototype.show_images=function(show_images) {
if (show_images!=undefined) {
this.i_show_images=show_images;
}
return this.i_show_images;
}
EmailPreferences.prototype.spam_cleanup=function(spam_cleanup) {
if (spam_cleanup!=undefined) {
this.i_spam_cleanup=spam_cleanup;
}
return this.i_spam_cleanup;
}
EmailPreferences.prototype.spam_action=function(spam_action) {
if (spam_action!=undefined) {
this.i_spam_action=spam_action;
}
return this.i_spam_action;
}
EmailPreferences.prototype.spam_blacklist=function(spam_blacklist) {
if (spam_blacklist!=undefined) {
this.i_spam_blacklist=spam_blacklist;
}
return this.i_spam_blacklist;
}
EmailPreferences.prototype.spam_whitelist=function(spam_whitelist) {
if (spam_whitelist!=undefined) {
this.i_spam_whitelist=spam_whitelist;
}
return this.i_spam_whitelist;
}
EmailPreferences.prototype.auto_whitelist=function(auto_whitelist) {
if(auto_whitelist!=undefined) {
this.i_auto_whitelist=auto_whitelist;
}
return this.i_auto_whitelist;
}
EmailPreferences.prototype.filter_type=function(filter_type) {
if(filter_type!=undefined) {
this.i_filter_type=filter_type;
}
return this.i_filter_type;
}
EmailPreferences.prototype.filter_type_subject_text=function(filter_type_subject_text) {
if(filter_type_subject_text!=undefined) {
this.i_filter_type_subject_text=filter_type_subject_text;
}
return this.i_filter_type_subject_text;
}
EmailPreferences.prototype.trash_cleanup=function(trash_cleanup) {
if (trash_cleanup!=undefined) {
this.i_trash_cleanup=trash_cleanup;
}
return this.i_trash_cleanup;
}
EmailPreferences.prototype.vcard_attach=function(vcard_attach) {
if (vcard_attach!=undefined) {
this.i_vcard_attach=vcard_attach;
}
return this.i_vcard_attach;
}
EmailPreferences.prototype.spell_dict=function(value) {
if (value!=undefined) {
this.i_spell_dict=value;
}
return this.i_spell_dict;
}
EmailPreferences.prototype.spell_customDict=function(value) {
if (value!=undefined) {
this.i_spell_customDict=value;
}
return this.i_spell_customDict;
}
EmailPreferences.prototype.spell_customDictAdd=function(value) {
if (value!=undefined) {
this.i_spell_customDictAdd=value;
}
return this.i_spell_customDictAdd;
}
EmailPreferences.prototype.spell_customDictDel=function(value) {
if (value!=undefined) {
this.i_spell_customDictDel=value;
}
return this.i_spell_customDictDel;
}
EmailPreferences.prototype.spell_opts=function(value) {
if (value!=undefined) {
this.i_spell_opts=value;
}
return this.i_spell_opts;
}
EmailPreferences.prototype.msg_filters=function(value) {
if (value!=undefined) {
this.i_msg_filters=value;
}
return this.i_msg_filters;
}
EmailPreferences.prototype.forward_enabled=function(forward_enabled) {
if(forward_enabled!=undefined) {
this.i_forward_enabled=forward_enabled;
}
return this.i_forward_enabled;
}
EmailPreferences.prototype.forward_address=function(forward_address) {
if(forward_address!=undefined) {
this.i_forward_address=forward_address;
}
return this.i_forward_address;
}
EmailPreferences.prototype.forward_save_copy=function(forward_save_copy) {
if(forward_save_copy!=undefined) {
this.i_forward_save_copy=forward_save_copy;
}
return this.i_forward_save_copy;
}
EmailPreferences.prototype.oom_enabled=function(oom_enabled) {
if(oom_enabled!=undefined) {
this.i_oom_enabled=oom_enabled;
}
return this.i_oom_enabled;
}
EmailPreferences.prototype.oom_start_date=function(oom_start_date) {
if(oom_start_date!=undefined) {
this.i_oom_start_date=oom_start_date;
}
return this.i_oom_start_date;
}
EmailPreferences.prototype.oom_end_date=function(oom_end_date) {
if(oom_end_date!=undefined) {
this.i_oom_end_date=oom_end_date;
}
return this.i_oom_end_date;
}
EmailPreferences.prototype.oom_subject=function(oom_subject) {
if(oom_subject!=undefined) {
this.i_oom_subject=oom_subject;
}
return this.i_oom_subject;
}
EmailPreferences.prototype.oom_body=function(oom_body) {
if(oom_body!=undefined) {
this.i_oom_body=oom_body;
}
return this.i_oom_body;
}
EmailPreferences.prototype.getFilterPriorityList=function() {
return this.i_filter_priority_list;
}
EmailPreferences.prototype.setFilterPriorityList=function(value) {
this.i_filter_priority_list=value;
}
JavaScriptResource.notifyComplete("./src/Applications/Email/objects/Object.Preferences.js");	
function DataListMessageModel() {
this.i_items=Array();		
this.i_entries=0;
this.i_folder_cache=Array();
this.i_sizes=Array();
this.block_size=50;	
this.i_init=false;	
}
DataListMessageModel.processEntriesMutex=false;
DataListMessageModel.prototype.activeFolder=function(folder_id) {
if (folder_id!=undefined) {
this.i_folder_id=folder_id;
this.parent().scrollPosition(0);
this.parent().page(1);
if (this.i_sizes[folder_id]!=undefined) {
this.entries(this.i_sizes[folder_id]);
}
else {
this.entries(0);
}
this.i_term=undefined;
this.i_advanced_search=undefined;
this.parent().clearSelected();
this.refresh();
}
return this.i_folder_id;
}
DataListMessageModel.prototype.activeSearch=function(term, allFolders, allAreas, advanced) {
if (term!=undefined) {
this.i_advanced_search=false;
this.i_term=term;
this.i_term_folders=(allFolders==true ? true : false);
this.i_term_areas=(allAreas==true ? true : false);
this.i_search_cache=Array();
this.parent().page(1);
this.entries(0);
this.parent().clearSelected();
this.refresh();
}else{
if(advanced) {
this.i_term="advanced";
this.i_advanced_search=true;
this.i_search_cache=Array();
this.parent().page(1);
this.entries(0);
this.parent().clearSelected();
this.refresh();
}
}
return this.i_term;
}
DataListMessageModel.prototype.sortHeader=function(header) {
if (header!=undefined) {
if (this.i_sort_header!=header) {
this.i_sort_header=header;
this.parent().clearSelected();
}
}
return this.i_sort_header;
}
DataListMessageModel.processEntries=function(msgs, total, cache_stamp, args) {
if(msgs!=undefined) {
var me=args[0];
var actualStart=args[1];
var actualCount=args[2];
var r_type=args[3];
var r_id=args[4];
var r_cb=args[5];
var r_pm=args[6];
var cacheKey=args[7];
if(cacheKey==undefined){ 
cacheKey=me.sortHeader().id()+"_"+me.sortHeader().sort();	
}
var cur_stamp=me.i_folder_cache[cacheKey]['csh_'+me.activeFolder()];
if (cur_stamp!=cache_stamp && cur_stamp!=undefined) {
var newCache=Array();
for (var x=actualStart; x < (actualStart+actualCount) && z < msgs.length; x++) {
newCache[x]=me.i_folder_cache[cacheKey][me.activeFolder()][x];
}
me.i_folder_cache[cacheKey][me.activeFolder()]=newCache;	
}
me.i_folder_cache[cacheKey]['csh_'+me.activeFolder()]=cache_stamp;
me.entries(total);
me.i_sizes[me.activeFolder()]=total;
me.parent().loading(false);
var z=0;
for (var x=actualStart; x < (actualStart+actualCount) && z < msgs.length; x++) {
t=me.i_folder_cache[cacheKey][me.activeFolder()][x];
if (t==undefined) {
t=me.i_folder_cache[cacheKey][me.activeFolder()][x]=new DataListEntry();
}
t.id(msgs[z].id());	
t.i_message=msgs[z];
if(msgs[z].is_new()) {
t.entryStyle("email_new_msg");
}
t.param(ApplicationEmail.i_header_attachment, ' ', (msgs[z].has_attachments()==true ? "Attachments" : "No Attachments")).iconClass(msgs[z].has_attachments() ? 'list_attachment' : '');
if(1==msgs[z].replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Replied").iconClass('list_reply');
} else if(2==msgs[z].replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Forwarded").iconClass('list_forward');
} else if(3==msgs[z].replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Replied and Forwarded").iconClass('list_replyforward');
} else {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Click to view").iconClass('');
}
t.param(ApplicationEmail.i_header_subject, msgs[z].subject());
if(0==msgs[z].importance()) {
t.param(ApplicationEmail.i_header_importance, ' ', 'Low Inportance').iconClass('list_importance_low');
} else if(2==msgs[z].importance()) {
t.param(ApplicationEmail.i_header_importance, ' ', 'High Importance').iconClass('list_importance_high');
} else {
t.param(ApplicationEmail.i_header_importance, ' ', 'Normal Importance').iconClass('');
}
t.param(ApplicationEmail.i_header_from, msgs[z].from());
t.param(ApplicationEmail.i_header_to, msgs[z].to());
t.param(ApplicationEmail.i_header_date, msgs[z].date_stamp().valueOf());
t.param(ApplicationEmail.i_header_size, msgs[z].size());
t.param(ApplicationEmail.i_header_folder, ApplicationEmail.i_folder_ref[msgs[z].folder_id()].name());
t.onmousedown=ApplicationEmail.handleLoadMessage;
t.ondblclick=ApplicationEmail.handleDoubleClickMessage;
t.oncontextmenu=ApplicationEmail.triggerContextMenu;
z++;
if (me.i_init==false) {
me.i_init=true;
}
}
if (r_type=="sel_validate") {
r_cb(me.getSelectedMessages(), r_pm);
Notifications.end(r_id, undefined, false, "Selected messages successfully loaded.");
}
if(me.onrefreshcomplete) {
var o={
"type": "refreshcomplete"
};
me.onrefreshcomplete(o);
}
me.i_cache_filler=undefined;
if(cacheKey==me.sortHeader().id()+"_"+me.sortHeader().sort()){ 
me.refresh();
}
}
}
DataListMessageModel.prototype.fillCache=function(start, count) {
if (this.activeFolder()!=undefined && this.activeFolder()!="") {
var cacheKey=this.sortHeader().id()+"_"+this.sortHeader().sort();	
if (this.i_sizes[this.activeFolder()]!=undefined) {
for (var x=start; x < start+count; x++) {
this.i_folder_cache[cacheKey][this.activeFolder()][x]=new DataListEntry();
}
}
var args=Array();
args[0]=this;
args[1]=start;
args[2]=count;
for(var x=3;x<7;x++){
args[x]=undefined;
}
args[7]=cacheKey;
if (this.i_cache_filler!=undefined) {
clearTimeout(this.i_cache_filler);
this.i_cache_filler=undefined;
}
var me=this;
this.i_cache_filler=setTimeout(function() {
ApplicationEmail.store.getMessages(me.activeFolder(), start+1, count, me.sortHeader(), DataListMessageModel.processEntries, args);	
}, 700);
}
}
DataListMessageModel.processSearchEntries=function(msgs, total, args) {
var me=args[0];
for (var x=0; x < msgs.length; x++) {
var t=me.i_search_cache['original'][x]=new DataListEntry();
t.id(msgs[x].id());	
t.i_message=msgs[x];
if(msgs[x].is_new()) {
t.entryStyle("email_new_msg");
}
t.param(ApplicationEmail.i_header_attachment, ' ').iconClass(msgs[x].has_attachments()!=0 ? 'list_attachment' : '');
if(1==msgs[x].replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Replied").iconClass('list_reply');
} else if(2==msgs[x].replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Forwarded").iconClass('list_forward');
} else if(3==msgs[x].replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Replied and Forwarded").iconClass('list_replyforward');
} else {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Click to view").iconClass('');
}
var subject=msgs[x].subject();
subject=subject.replace(/</g, "&lt;");
subject=subject.replace(/>/g, ">");
t.param(ApplicationEmail.i_header_subject, subject);
if(0==msgs[x].importance()) {
t.param(ApplicationEmail.i_header_importance, ' ', 'Low Importance').iconClass('list_importance_low');
} else if(2==msgs[x].importance()) {
t.param(ApplicationEmail.i_header_importance, ' ', 'High Importance').iconClass('list_importance_high');
} else {
t.param(ApplicationEmail.i_header_importance, ' ', 'Normal Importance').iconClass('');
}
t.param(ApplicationEmail.i_header_from, msgs[x].from());
t.param(ApplicationEmail.i_header_to, msgs[x].to());
t.param(ApplicationEmail.i_header_date, msgs[x].date_stamp().valueOf());
t.param(ApplicationEmail.i_header_size, msgs[x].size());
t.param(ApplicationEmail.i_header_folder, ApplicationEmail.i_folder_ref[msgs[x].folder_id()].name());
t.onmousedown=ApplicationEmail.handleLoadMessage;
t.ondblclick=ApplicationEmail.handleDoubleClickMessage;
t.oncontextmenu=ApplicationEmail.triggerContextMenu;
}
me.i_cache_filler=undefined;
me.entries(me.i_search_cache['original'].length);
me.refresh();
}
DataListMessageModel.prototype.fillSearchCache=function() {
this.i_search_cache['original']=Array();
if (this.i_cache_filler!=undefined) {
clearTimeout(this.i_cache_filler);
this.i_cache_filler=undefined;
}
var args=Array();
args[0]=this;
var me=this;
if(this.i_advanced_search) {
setTimeout(function() { AdvancedSearchDiag.lastDiag.continueSearch(args); }, 700);
}else{
this.i_cache_filler=setTimeout(function() {
ApplicationEmail.store.searchMessages(me.activeSearch(), (me.i_term_folders==true ? -1 : me.activeFolder()), me.i_term_areas, DataListMessageModel.processSearchEntries, args);	
}, 700);
}
}
DataListMessageModel.prototype.getSelectedMessages=function(quiet) {
var sel=this.parent().selectedIndexes();
var ret=Array();
for (var x=0; x < sel.length; x++) {
var m;
if (this.activeSearch()!=undefined) {
m=this.i_search_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][sel[x]];
}
else {
m=this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()][sel[x]];
}
if (m!=undefined && m.id()!=undefined && m.i_message!=undefined) {
ret[ret.length]=m.i_message;
}
else {
;
}
}
return ret;
}
DataListMessageModel.prototype.validateSelected=function(callback, params) {
var sel=this.parent().selectedIndexes();
var startInx;
var endInx;
if (this.activeSearch()!=undefined) {
if (callback!=undefined) {
callback(this.getSelectedMessages(), params);
}
return true;
}
else {
var srtid=this.sortHeader().id()+"_"+this.sortHeader().sort();
var actid=this.activeFolder();
for (var x=0; x < sel.length; x++) {
var m=this.i_folder_cache[srtid][actid][sel[x]];
if (m==undefined || m.id()==undefined || m.i_message==undefined) {
if (callback==undefined) {
return false;
}
this.i_folder_cache[srtid][actid][sel[x]]=new DataListEntry();
if (startInx==undefined) {
startInx=sel[x];
}
endInx=sel[x];
}
}
if (startInx==undefined) {
if (callback!=undefined) {
callback(this.getSelectedMessages(), params);
}
return true;
}
var args=Array();
args[0]=this;
args[1]=startInx;
args[2]=(endInx - startInx);
args[3]="sel_validate";
args[4]=Notifications.add("Downloading selected messages");
args[5]=callback;
args[6]=params;
var me=this;
setTimeout(function() {
ApplicationEmail.store.getMessages(me.activeFolder(), startInx+1, (endInx - startInx), me.sortHeader(), DataListMessageModel.processEntries, args);	
}, 100);
}
return false;
}
DataListMessageModel.prototype.markSelectedUnread=function(sel) {
if(sel==undefined) {
sel=this.parent().selectedIndexes();
}
for(var x=0; x < sel.length; x++) {
var cache_id=this.sortHeader().id()+"_"+this.sortHeader().sort();
var t;
if (this.activeSearch()!=undefined) {
var cache=this.i_search_cache[cache_id];
t=cache[sel[x]];
}
else {
var cache=this.i_folder_cache[cache_id][this.activeFolder()];
t=cache[sel[x]];
this.i_folder_cache=Array();
this.i_folder_cache[cache_id]=Array();
this.i_folder_cache[cache_id][this.activeFolder()]=cache;
}
t.entryStyle("email_new_msg");
t.i_message.is_new(true);
}
}
DataListMessageModel.prototype.markSelectedRead=function(sel) {
if(sel==undefined) {
sel=this.parent().selectedIndexes();
}
for(var x=0; x < sel.length; x++) {
var cache_id=this.sortHeader().id()+"_"+this.sortHeader().sort();
var t;
if (this.activeSearch()!=undefined) {
var cache=this.i_search_cache[cache_id];
t=cache[sel[x]];
}
else {
var cache=this.i_folder_cache[cache_id][this.activeFolder()];
t=cache[sel[x]];
this.i_folder_cache=Array();
this.i_folder_cache[cache_id]=Array();
this.i_folder_cache[cache_id][this.activeFolder()]=cache;
}
t.entryStyle("");
t.i_message.is_new(false);
}
}
DataListMessageModel.prototype.markSelectedReply=function(sel) {
if(sel==undefined) {
sel=this.parent().selectedIndexes();
}
for(var x=0; x < sel.length; x++) {
var cache_id=this.sortHeader().id()+"_"+this.sortHeader().sort();
var t;
if (this.activeSearch()!=undefined) {
var cache=this.i_search_cache[cache_id];
t=cache[sel[x]];
}
else {
var cache=this.i_folder_cache[cache_id][this.activeFolder()];
t=cache[sel[x]];
this.i_folder_cache=Array();
this.i_folder_cache[cache_id]=Array();
this.i_folder_cache[cache_id][this.activeFolder()]=cache;
}
t.i_message.replyfwd(t.i_message.replyfwd() | 1); 
if(1==t.i_message.replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Replied").iconClass('list_reply');
} else if(3==t.i_message.replyfwd()) {
t.param(ApplicationEmail.i_header_replyforward, ' ', "Replied and Forwarded").iconClass('list_replyforward');
}
this.refresh();
}
}
DataListMessageModel.prototype.forceNext=function() {
this.i_force=true;
return true;
}
DataListMessageModel.prototype.getEntries=function(start, count, sortHeader) {
var ret=Array();
var force=this.i_force;
this.i_force=false;
if (this.activeSearch()!=undefined) {
if (force) {
this.i_search_cache=Array();
this.entries(0);
this.parent().clearSelected();
}
if (this.i_search_cache==undefined || this.i_search_cache['original']==undefined ||
(this.i_cache_filler!=undefined && this.i_search_cache["original"]!=undefined && this.i_search_cache["original"].length==0)) {
this.parent().loading(true, (force ? "Loading..." : "Searching..."));
this.entries(0);
this.fillSearchCache();
}
else {
if (this.i_search_cache[sortHeader.id()+"_"+sortHeader.sort()]==undefined) {
this.i_search_cache[sortHeader.id()+"_"+sortHeader.sort()]=Array();
for (var x=0; x < this.i_search_cache['original'].length; x++) {
this.i_search_cache[sortHeader.id()+"_"+sortHeader.sort()][x]=this.i_search_cache['original'][x];
}
var itemList=this.i_search_cache[sortHeader.id()+"_"+sortHeader.sort()];
if (sortHeader!=undefined) {
this.sortHeader(sortHeader);
}
this.i_sorted_by=sortHeader;
this.i_sort_dir=sortHeader.sort();
var lowI=0;
for (var x=0; x < itemList.length; x++) {
lowI=x;
for (var y=x; y < itemList.length; y++) {
var a1=itemList[lowI].param(this.i_sorted_by);
var a2=itemList[y].param(this.i_sorted_by);
var v1;
var v2;
if (this.i_sorted_by.sort()=="desc") {
if(sortHeader.id()!=7) {
v1=(a1==undefined ? undefined : a1.value());
v2=(a2==undefined ? undefined : a2.value());
} else {
v1=(a1==undefined ? undefined : a1.i_icon_class);
v2=(a2==undefined ? undefined : a2.i_icon_class);
}
}
else {
if(sortHeader.id()!=7) {
v1=(a2==undefined ? undefined : a2.value());
v2=(a1==undefined ? undefined : a1.value());
} else {
v1=(a2==undefined ? undefined : a2.i_icon_class);
v2=(a1==undefined ? Undefined : a1.i_icon_class);
}
}
if (v1!=undefined && v1.toLowerCase!=undefined) {
v1=v1.toLowerCase();
}
if (v2!=undefined && v2.toLowerCase!=undefined) {
v2=v2.toLowerCase();
}
if (this.i_sorted_by.compare(v1, v2) >=0) {
lowI=y;
}
}
if (lowI!=x) {
var b=itemList[lowI];
itemList[lowI]=itemList[x];
itemList[x]=b;
}
}
}
for (var x=start; x < this.i_search_cache[sortHeader.id()+"_"+sortHeader.sort()].length && x < start+count; x++) {
ret[ret.length]=this.i_search_cache[sortHeader.id()+"_"+sortHeader.sort()][x];
}
this.parent().loading(false);
}
}
else {
if (this.i_sizes[this.activeFolder()]!=0 || force) {
start++;
if (this.activeFolder()!=undefined) {
this.sortHeader(sortHeader);
var rStart=(Math.floor((start > 1 ? start - 1 : 1) / this.block_size) * this.block_size);
var tStart=(Math.floor(((start+count) - 1) / this.block_size) * this.block_size);
if (this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()]==undefined) {
this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()]=Array();
}
if (this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()]==undefined) {
this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()]=Array();			
}
if (this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()][rStart]==undefined || this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()][rStart].id()==undefined || force==true) {
if (tStart!=rStart && (this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()][tStart]==undefined || force==true)) {
this.fillCache(rStart, this.block_size * 2);
}
else {
this.fillCache(rStart, this.block_size);
}
}
else {
if (tStart < this.entries()) {
if (tStart!=rStart && (this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()][tStart]==undefined || this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()][tStart].id()==undefined)) {
}
}
}
if (this.i_sizes[this.activeFolder()]==undefined) {
this.parent().loading(true);
}
else {
for (var x=start - 1; x < ((start+count) - 1) && x < this.i_sizes[this.activeFolder()]; x++) {
ret[ret.length]=this.i_folder_cache[this.sortHeader().id()+"_"+this.sortHeader().sort()][this.activeFolder()][x];
}
}
}
}
}
return ret;
}
DataListMessageModel.prototype.getEmptyListText=function() {
return "There are no messages in this folder.";
}
for (var meth in DataListModel.prototype) {
if (DataListMessageModel.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
DataListMessageModel.prototype[meth]=DataListModel.prototype[meth];
}
}
JavaScriptResource.notifyComplete("./src/Applications/Email/dataModels/DataModel.MessageList.js");	
function EmailPreview(width, height, compact) {
this.i_width=width;
this.i_height=height;
this.i_headers=Array();
this.i_active=Array();
this.i_header_from=new EmailHeader(this.width(), "From:", "");
this.i_header_subject=new EmailHeader(this.width(), "Subject:", "");
this.i_header_date=new EmailHeader(this.width(), "Date:", "");
this.i_header_to=new EmailHeader(this.width(), "To:", "", false);
this.i_header_cc=new EmailHeader(this.width(), "Cc:", "", false);
this.i_header_attach=new EmailHeader(this.width(), "Attachments:", "", false);
this.i_compact=(compact==undefined ? true : compact);
this.i_active_preview=false;
this.i_search_menu=undefined;
this.i_request_disp=undefined;
EmailPreview.obj=this;
}
EmailPreview.actionWidth=73;
EmailPreview.openHeaders=function() {
var d=EmailPreview.getHeaderDiv();
var w=WindowObject.getWindowById('emHead');
if (w==undefined) {
w=new WindowObject('emHead', "Message Headers", 400, 300, Application.titleBarFactory());
}
w.onresize=EmailPreview.updateHeaderListDimensions;
w.i_redock_manager=SystemCore.windowManager();
w.popWindow(400, 300, true);
w.loadContent(d);
}
EmailPreview.prototype.compact=function(state) {
if (state!=undefined) {
this.i_compact=state;
this.i_header_to.visible(state);
this.i_header_cc.visible(state);
this.updateDimensions();
this.i_action_expand_b.iconCSS(state ? "EmailPreview_action_expand" : "EmailPreview_action_contract");
}
return this.i_compact;
}
EmailPreview.getDataModel=function() {
if (EmailPreview.i_data_model==undefined) {
EmailPreview.i_data_model=new DataListModelSimple(0);
EmailPreview.getHeaderList();
}
return EmailPreview.i_data_model;
}
EmailPreview.prototype.updateDimensions=function() {
if (this.i_pane!=undefined) {
var headHeight=0;
headHeight+=this.i_header_from.height(); 
headHeight+=this.i_header_subject.height(); 
headHeight+=this.i_header_date.height(); 
headHeight+=this.i_header_to.height(); 
headHeight+=this.i_header_cc.height(); 
headHeight+=this.i_header_attach.height(); 
headHeight+=12;
if (this.i_top_button_div.style.display!="none") {
if(document.all) {
headHeight+=this.i_top_button_div.offsetHeight;
}
}
if (headHeight < 35) {
headHeight=35;
}
if((ApplicationEmail.travelEnabled &&
this.i_travel_button_div.style.display=="") ||
(ApplicationEmail.efaxEnabled &&
this.i_efax_button_div.style.display=="")) {
headHeight+=20;
}
var lf=(this.height() - headHeight);
if (lf < 1) {
lf=1;
}
this.i_pane_headers.style.height=headHeight+"px";
this.i_pane_content.style.height=lf+"px";
this.i_pane_notice.style.width=this.width()+"px";
this.i_pane_notice.style.height=this.height()+"px";
this.i_pane_preview.style.width=this.width()+"px";
this.i_pane_preview.style.height=this.height()+"px";
}
}
EmailPreview.updateHeaderListDimensions=function(width, height) {
var w=WindowObject.getWindowById('emHead');
var t=w.titleBar();
if (width!=undefined) {
EmailPreview.i_header_list.width(width - 2);
}
if (height!=undefined) {
EmailPreview.i_header_list.height(height - (t.height()+2));
}
}
EmailPreview.getHeaderDiv=function() {
if (EmailPreview.i_header_div==undefined) {
EmailPreview.i_header_div=document.createElement('DIV');
EmailPreview.i_header_div.appendChild(EmailPreview.getHeaderList().getList());
}
return EmailPreview.i_header_div;
}
EmailPreview.getHeaderList=function() {
if (EmailPreview.i_header_list==undefined) {
EmailPreview.i_header_list=new DataList(EmailPreview.getDataModel(), 100, 100);
EmailPreview.i_header_name=EmailPreview.i_header_list.addHeader(new DataListHeader(1, 'Name', 100, true));
EmailPreview.i_header_value=EmailPreview.i_header_list.addHeader(new DataListHeader(2, 'Value', "100%", true));
}
return EmailPreview.i_header_list;
}
EmailPreview.prototype.loadHeaders=function() {
var message=this.i_message;
EmailPreview.getDataModel().clear();
this.i_headers=Array();
EmailPreview.getHeaderList();
var dle_index_offset=0; 
var f=new DataListEntry(dle_index_offset);
f.param(EmailPreview.i_header_name, 'From:');
if(message.from_display()) 
f.param(EmailPreview.i_header_value, message.from_display()+' <'+message.from_address()+'>');
else
f.param(EmailPreview.i_header_value, message.from_address());
EmailPreview.getDataModel().addEntry(f);
dle_index_offset++;
if(message.recipients().length > 0) {
for(var i=0; i<message.recipients().length; i++) {
var r=new DataListEntry(dle_index_offset);
r.param(EmailPreview.i_header_name, 'To:');
r.param(EmailPreview.i_header_value, message.recipients()[i].address);
EmailPreview.getDataModel().addEntry(r);
dle_index_offset++;
}
}
if(message.cc().length > 0) {
for(var i=0; i<message.cc().length; i++) {
var c=new DataListEntry(dle_index_offset);
c.param(EmailPreview.i_header_name, 'Cc:');
c.param(EmailPreview.i_header_value, message.cc()[i].address);
EmailPreview.getDataModel().addEntry(c);
dle_index_offset++;
}
}
for (var x=0; x < message.header().length; x++) {
var e=new DataListEntry(x+dle_index_offset);
e.param(EmailPreview.i_header_name, message.header()[x].name);
e.param(EmailPreview.i_header_value, message.header()[x].value);
EmailPreview.getDataModel().addEntry(e);
}
EmailPreview.getDataModel().entries(message.header().length+dle_index_offset);
var fromArray=Array();
var o=new Object();
o.address=message.from_address();
o.display=htmlUnencode(message.from_display());
fromArray[0]=o;
if (message.i_from_address==undefined || message.i_from_address.length < 1) {
this.i_action_contact.button().hide();
this.i_header_from.value(" ");
}else {
if (isEmailAddress(message.i_from_address))
this.i_action_contact.button().show();
else
this.i_action_contact.button().hide();
this.i_header_from.appendChildren(this.convertAddresses(fromArray)); 
}
this.i_header_subject.value(message.subject()+" ");
this.i_header_date.value(message.date()+" ");
this.i_header_to.appendChildren(this.convertAddresses(message.recipients()));
this.i_header_cc.appendChildren(this.convertAddresses(message.cc()));
if(message.recipients().length > 8) {
this.i_header_to.i_header_value.style.height='40px';
this.i_header_to.i_header_value.style.scrollTop='0';
if(document.all) {
this.i_header_to.i_header_value.style.overflowY='auto';
} else {
this.i_header_to.i_header_value.style.marginLeft="";
this.i_header_to.i_header_value.style.overflow='auto';
}
} else {
this.i_header_to.i_header_value.style.height='';
if(!document.all) this.i_header_to.i_header_value.style.overflowY='';
}
if(message.cc().length > 8) {
this.i_header_cc.i_header_value.style.height='40px';
this.i_header_cc.i_header_value.style.scrollTop='0';
if(document.all) {
this.i_header_cc.i_header_value.style.overflowY='auto';
} else {
this.i_header_cc.i_header_value.style.marginLeft="";
this.i_header_cc.i_header_value.style.overflow='auto';
}
} else {
this.i_header_cc.i_header_value.style.height='';
if(!document.all)this.i_header_cc.i_header_value.style.overflowY='';
}
if(message.attachment_id()!="") {
this.i_top_button_div.style.display="";
} else {
this.i_top_button_div.style.display="none";
}
if(ApplicationEmail.travelEnabled) {
if(TravelEmailInterface.obj.isOrbitzEmail(message)) {
this.i_travel_button_div.style.display="";
} else {
this.i_travel_button_div.style.display="none";
}
}
if(ApplicationEmail.efaxEnabled) {
if(EfaxEmailInterface.obj.isEfaxEmail(message)) {
this.i_efax_button_div.style.display="";
} else {
this.i_efax_button_div.style.display="none";
}
}
if((message.attachments()!=undefined) && (!message.isMeetingRequest())) {
var attachments=message.attachments();
var attach_string="";
var attach_prefix=message.attachment_id();
if(attach_prefix!="") {
attach_prefix+=",";
}
for(var x=0; x < attachments.length; x++) {
var icon="";
var func="";
if(attachments[x].name.match(/\.vcf$/i)) {
icon="<img src=/"/gui/img/spacer.gif/" "+"class=\"ico-vcard\">";
func="ApplicationEmail.openVcardAttachment(\""+message.folder_id()+"\",\""+message.id()+"\",\""+attach_prefix+attachments[x].id+"\");";
} else if(attachments[x].name.match(/\.ics$/i)) {
icon="<img src=/"/gui/img/spacer.gif/" "+"class=\"ico-new-event\">";
func="ApplicationEmail.openIcalAttachment(\""+message.folder_id()+"\",\""+message.id()+"\",\""+attach_prefix+attachments[x].id+"\");";
} else if(attachments[x].type.indexOf('message')!=-1) {
icon="<img src='img/email_attachment.gif'>";
func="ApplicationEmail.openAttachmentMessage(\""+message.folder_id()+"\",\""+message.id()+"\",\""+attach_prefix+attachments[x].id+"\");";
} else {
icon="<img src='img/email_attachment.gif'>";
func="ApplicationEmail.downloadAttachment(\""+message.folder_id()+"\",\""+message.id()+"\",\""+attachments[x].id+"\",\""+message.attachment_id()+"\");";
}
attach_string+="<div style='white-space: nowrap;display:inline;'>"+icon+" "+"<a border=0 href='javascript:"+func+"' id='"+message.folder_id()+"/"+message.id()+"/"+attachments[x].id+"'>"+attachments[x].name+"</a>"+" ("+ApplicationEmail.filter_size(attachments[x].size)+")";
if(x+1 < attachments.length) {
attach_string+=", ";
}
attach_string+="</div>";
}
attach_string=attach_string.replace(/\r/, "");
attach_string=attach_string.replace(/\n/, "");
if(attachments.length > 6) {
this.i_header_attach.i_header_value.style.height='40px';
this.i_header_attach.i_header_value.style.scrollTop='0';
if(document.all) {
this.i_header_attach.i_header_value.style.overflowY='auto';
} else {
this.i_header_attach.i_header_value.style.marginLeft='';
this.i_header_attach.i_header_value.style.overflow='auto';
}
} else {
this.i_header_attach.i_header_value.style.height='';
if(!document.all) this.i_header_attach.i_header_value.style.overflowY='';
}
this.i_header_attach.value(attach_string);
this.i_header_attach.visible(true);
} else {
this.i_header_attach.value("");
this.i_header_attach.visible(false);
}
this.updateDimensions();
EmailPreview.getHeaderList().refresh();
}
EmailPreview.handleEmailClick=function(address, att_list, win, csid) {
var message=undefined;
if(att_list!=undefined) {
message=new EmailMessage();
message.attachments(att_list);
message.session_id(csid);
}
ApplicationEmail.newEmail(message, 0, address, win);
}
EmailPreview.prototype.convertAddresses=function(addresses) {
var str="";
var display_count;
var n;
if(addresses.length < 100) {
display_count=addresses.length;
}else{
display_count=100;
}
var myitems=Array();
for(var x=0; x<display_count; x++) {
var ds=addresses[x].display;
n=document.createElement('label');
n.innerHTML=(x > 0 ? ", " : "");
myitems.push(n);
if (ds!=undefined && ds!="") {
n=document.createElement('div');
n.innerHTML=htmlEncode(ds);
n.className="EmailPreview_address";
n.pObj={ address:addresses[x].address, name:addresses[x].display, parent:this };
EventListener.listen(n, "onclick", EmailPreview.handleEmailClickEvent);
EventListener.listen(n, "onmouseover", EmailPreview.handleEmailHoverOverEvent);
EventListener.listen(n, "onmouseout", EmailPreview.handleEmailHoverOutEvent);
EventListener.listen(n, "oncontextmenu", EmailPreview.handleEmailContextMenu);
myitems.push(n);
n=document.createElement('label');
n.innerHTML=' <';
myitems.push(n);				
}
n=document.createElement('div');
n.innerHTML=addresses[x].address;
n.className="EmailPreview_address";
n.pObj={ address:addresses[x].address, name:addresses[x].display, parent:this };
EventListener.listen(n, "onclick", EmailPreview.handleEmailClickEvent);
EventListener.listen(n, "onmouseover", EmailPreview.handleEmailHoverOverEvent);
EventListener.listen(n, "onmouseout", EmailPreview.handleEmailHoverOutEvent);
EventListener.listen(n, "oncontextmenu", EmailPreview.handleEmailContextMenu);
myitems.push(n);
if (ds!=undefined && ds!="") {
n=document.createElement('label');
n.innerHTML='>';
myitems.push(n);
}
}
if(display_count==100) {
n=document.createElement('label');
n.innerHTML="<br><a href='JavaScript:EmailPreview.openHeaders();'>View All "+addresses.length+" Recipients</a>";
myitems.push(n);
}
return myitems;
}
EmailPreview.handleEmailClickEvent=function() {
EmailPreview.handleEmailClick(this.pObj.address);
}
EmailPreview.handleEmailHoverOverEvent=function() {
this.className="EmailPreview_address_hover";
}
EmailPreview.handleEmailHoverOutEvent=function() {
this.className="EmailPreview_address";
}
EmailPreview.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_pane!=undefined) {
this.i_pane.style.width=width+"px";
this.i_pane_headers.style.width=width+"px";
this.i_pane_content.style.width=width+"px";
}
var n=(width - 35);
var an=(width - (35+EmailPreview.actionWidth));
var f=true;
if (n <  EmailHeader.labelWidth) {
n=EmailHeader.labelWidth;
}
if (an < EmailHeader.labelWidth) {
an=EmailHeader.labelWidth;
}
this.i_header_from.width((f ? an : n));
f=(f!=true ? (this.i_header_from.visible() && !this.i_header_from.empty()) : true);
this.i_header_subject.width((f ? an : n));
f=(f!=true ? (this.i_header_subject.visible() && !this.i_header_subject.empty()) : true);
this.i_header_date.width((f ? an : n));
f=(f!=true ? (this.i_header_date.visible() && !this.i_header_date.empty()) : true);
this.i_header_to.width((f ? an : n));
f=(f!=true ? (this.i_header_to.visible() && !this.i_header_to.empty()) : true);
this.i_header_cc.width((f ? an : n));
this.i_header_attach.width((f ? an : n));
}
return this.i_width;
}
EmailPreview.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_pane!=undefined) {
this.i_pane.style.height=height+"px";
this.updateDimensions();
}
}
return this.i_height;
}
EmailPreview.prototype.bodyContent=function(bodyContent) {
if (bodyContent!=undefined) {
if (this.i_body!=undefined) {
if (this.i_pane_content!=undefined) {
try {
this.i_pane_content.removeChild(this.i_body);
this.getImportanceDiv().style.display="none";
} catch (e) { }
}
}
this.i_body=bodyContent;
if (this.i_pane_content!=undefined) {
if(this.i_message.importance()!="1") {		
this.getImportanceDiv().style.display="";
this.setImportanceIcon();
this.setImportanceText();
} else {
this.getImportanceDiv().style.display="none";
}
this.i_pane_content.appendChild(this.i_body);	
}
this.i_pane_content.scrollTop=0;
}
return this.i_body;
}
EmailPreview.prototype.setImportanceIcon=function () {
if(this.i_message.importance()=="0") {
this.i_importance_icon.className="list_importance_low";
} else {
this.i_importance_icon.className="list_importance_high";
}
}
EmailPreview.prototype.setImportanceText=function () {
var text="This message was sent with ";
if(this.i_message.importance()=="0") {
text+="<b>Low</b> importance.";
} else { 
text+="<b>High</b> importance.";
}
this.i_importance_text.innerHTML=text;
}
EmailPreview.handleCompact=function(menu_item, pv) {
pv.compact(!pv.compact());
return true;
}	
EmailPreview.openContact=function(button, foc) {
EmailPreview.openContactWithData(foc.i_message.from_display().replace(new RegExp("'", 'g'), "\\'"), foc.i_message.from_address());
}
EmailPreview.openContactWithData=function(display, address) {
if (_LITE_) {
if (ApplicationContacts.popNewContactFromEmail) {
ApplicationContacts.popNewContactFromEmail(htmlUnencode(display),
htmlUnencode(address));
}
else {
var url="/Ioffice/ContactMan/AddContactPopupFrameset.asp";
url+="?unm="+user_prefs['user_name'];
url+="&sid="+user_prefs['session_id'];
if(!display) 
url+="&full_from="+escape(htmlUnencode(address));
else
url+="&full_from="+escape(htmlUnencode(display));
url+="&email="+escape(htmlUnencode(address));
var params="toolbar=0,location=0,directories=0,status=0"
params+=",menubar=0,scrollbars=1,resizable=1,width=788"
params+=",height=480";
window.open(url, "", params);
}
}
else {
var display_name=escape(htmlUnencode(display));
var address=escape(htmlUnencode(address));
top.contactsApp.popNewContact("", user_prefs['user_name'],
display_name, address, "", "", "", "");	
}
}
EmailPreview.topMessage=function(button, foc) {
ApplicationEmail.openTopMessage(foc.i_message.id(), foc.i_message.folder_id());
}
EmailPreview.prototype.createEvent=function() {
TravelEmailInterface.obj.createEvent(this.i_message);
}
EmailPreview.prototype.saveToEfax=function() {
EfaxEmailInterface.obj.saveToSettings(this.i_message);
}
EmailPreview.showImages=function(button, foc) {
if(foc.i_message.html()=="1") {
var body_div=document.createElement('DIV');
var body_data=foc.i_message.body();
body_data=body_data.replace(/btfimg/gi, "img");
body_data=body_data.replace(/btfbackground/gi, "background");
body_div.innerHTML=body_data;
foc.bodyContent(body_div);
foc.i_action_images_div.style.display="none";
}
}
EmailPreview.prototype.getActionDiv=function() {
if (this.i_actions==undefined) {
this.i_actions=document.createElement('DIV');
this.i_actions.className="EmailPreview_actions";
this.i_actions.style.width=EmailPreview.actionWidth+"px";
this.i_action_headers=new ToolBarButton(new IconButton("EmailPreview_action_headers", 9, 11, 16, 16, "View Full headers", EmailPreview.openHeaders), "right");
this.i_actions.appendChild(this.i_action_headers.getItem());
this.i_action_contact=new ToolBarButton(new IconButton("EmailPreview_action_contact", 9, 11, 16, 16, "Add Sender to my Contacts", EmailPreview.openContact, this), "right");
this.i_actions.appendChild(this.i_action_contact.getItem());
this.i_action_images=new ToolBarButton(new IconButton("EmailPreview_action_showimgs", 9, 11, 16, 16, "Show Images", EmailPreview.showImages, this), "right");
this.i_action_images_div=this.i_action_images.getItem();
this.i_action_images_div.style.display="none";
this.i_actions.appendChild(this.i_action_images_div);
this.i_action_expand_b=new IconButton("EmailPreview_action_expand", 9, 11, 16, 16, "Expand Headers", EmailPreview.handleCompact, this);
this.i_action_expand=new ToolBarButton(this.i_action_expand_b, "right");
this.i_actions.appendChild(this.i_action_expand.getItem());
}
return this.i_actions;
}
EmailPreview.prototype.activePreview=function(state) {
if (state!=undefined) {
if (this.i_active_preview!=state) {
this.i_active_preview=state;
if (state) {
try {
this.i_pane.removeChild(this.i_pane_notice);
} catch (e) { }
this.i_pane.appendChild(this.i_pane_preview);
}
else {
try {
this.i_pane.removeChild(this.i_pane_preview);
} catch (e) { }
this.i_pane.appendChild(this.i_pane_notice);
this.i_pane_notice_tip.innerHTML="Did You Know: "+TipOfTheDay.randomTip().text();
}
this.updateDimensions();
}
}
return this.i_active_preview;
}
EmailPreview.prototype.getPreviewPane=function() {
if (this.i_pane==undefined) {
this.i_pane=document.createElement('DIV');
this.i_pane.className="EmailPreview";
this.i_pane.style.width=this.width()+"px";
this.i_pane.style.height=this.height()+"px";
this.i_pane_notice=document.createElement('DIV');
this.i_pane_notice.className="EmailPreview_notice";
this.i_pane_notice_static=document.createElement('DIV');
this.i_pane_notice_static.innerHTML="Select any message to begin reading your email.";
this.i_pane_notice_static.className="EmailPreview_notice_title";
this.i_pane_notice.appendChild(this.i_pane_notice_static);
this.i_pane_notice_tip=document.createElement('DIV');
this.i_pane_notice_tip.className="EmailPreview_tip";
this.i_pane_notice_tip.innerHTML="Did You Know: "+TipOfTheDay.randomTip().text();
this.i_pane_notice.appendChild(this.i_pane_notice_tip);
this.i_pane_notice.style.width=this.width()+"px";
this.i_pane_notice.style.height=this.height()+"px";
if (!this.activePreview()) {
this.i_pane.appendChild(this.i_pane_notice);
}
this.i_pane_preview=document.createElement('DIV');
this.i_pane_preview.style.width=this.width()+"px";
this.i_pane_preview.style.height=this.height()+"px";
if (this.activePreview()) {
this.i_pane.appendChild(this.i_pane_preview);
}
var top_button=new LabelButton("Back to top message",
"100%", 17, "Back to top message", 
EmailPreview.topMessage, this);
this.i_top_button_div=new ToolBarButton(top_button).getItem();
this.i_top_button_div.style.width="100%";
this.i_top_button_div.style.display="none";
this.i_pane_headers=document.createElement('DIV');
this.i_pane_headers.className="EmailPreview_headers";
this.i_pane_headers.style.width=this.width()+"px";
this.i_pane_headers.style.height="50px";
this.i_pane_preview.appendChild(this.i_pane_headers);
this.i_pane_headers.appendChild(this.i_top_button_div);
this.i_pane_headers.appendChild(this.getActionDiv());
this.i_pane_headers.appendChild(this.i_header_from.getHeader());
this.i_pane_headers.appendChild(this.i_header_subject.getHeader());
this.i_pane_headers.appendChild(this.i_header_date.getHeader());
this.i_pane_headers.appendChild(this.i_header_to.getHeader());
this.i_pane_headers.appendChild(this.i_header_cc.getHeader());
this.i_pane_headers.appendChild(this.i_header_attach.getHeader());
this.i_travel_button_div=document.createElement("DIV");
this.i_travel_button_div.className="EmailPreview_travel_button";
this.i_travel_button_div.innerHTML="Add Travel Events to Calendar";
EventListener.listen(this.i_travel_button_div, "onclick", 
new SmartHandler(this, this.createEvent));
this.i_pane_headers.appendChild(this.i_travel_button_div);
this.i_travel_button_div.style.display="none";
this.i_efax_button_div=document.createElement("DIV");
this.i_efax_button_div.className="EmailPreview_travel_button";
this.i_efax_button_div.style.width="250px";
this.i_efax_button_div.innerHTML="Update eFax Username/PIN in my preferences";
EventListener.listen(this.i_efax_button_div, "onclick", 
new SmartHandler(this, this.saveToEfax));
this.i_pane_headers.appendChild(this.i_efax_button_div);
this.i_efax_button_div.style.display="none";
this.i_pane_fixer=document.createElement('DIV');
this.i_pane_fixer.innerHTML=" ";
this.i_pane_fixer.className="EmailPreview_fix_headers";
this.i_pane_headers.appendChild(this.i_pane_fixer);
var temp=this.getImportanceDiv();
this.i_pane_content=document.createElement('DIV');
this.i_pane_content.className="EmailPreview_content";
this.i_pane_content.style.position="relative";
this.i_pane_content.style.width=this.width()+"px";
this.i_pane_content.style.height=(this.height() - 50)+"px";
this.i_pane_preview.appendChild(this.i_pane_content);
if (this.bodyContent()!=undefined) {
this.i_pane_content.appendChild(this.bodyContent());
}
if(!_LITE_) {
this.i_search_menu=new SearchMenu(this.i_pane_content);
}
this.compact(this.compact());
this.updateDimensions();
}
return this.i_pane;
}
EmailPreview.prototype.getImportanceDiv=function () {
if(this.i_pane_importance==undefined) {
this.i_pane_importance=document.createElement('DIV');
this.i_importance_text=document.createElement('DIV');
this.i_importance_icon=document.createElement('DIV');
this.i_pane_importance.className="NotificationBar NotificationBar_info";
this.i_pane_importance.style.display="none";
this.i_pane_importance.style.height="auto";
this.i_pane_importance.style.width="100%";
if(!document.all) {
this.i_pane_importance.style.cssFloat="left";
this.i_importance_text.style.cssFloat="left";
this.i_importance_icon.style.cssFloat="left";
} else {
this.i_pane_importance.style.styleFloat="left";
this.i_importance_text.style.styleFloat="left";
this.i_importance_icon.style.styleFloat="left";
}
this.i_pane_importance.style.padding="5px";
this.i_importance_icon.style.height="16px";
this.i_importance_icon.style.width="16px";
this.i_pane_importance.appendChild(this.i_importance_icon);
this.i_pane_importance.appendChild(this.i_importance_text);
this.i_pane_preview.appendChild(this.i_pane_importance);
var temp=document.createElement('DIV');
temp.style.clear="both";
this.i_pane_preview.appendChild(temp);
}	
return this.i_pane_importance;
}
EmailPreview.prototype.getMeetingRequestId=function()
{
if(this.i_message!=undefined) {
return this.i_message.meetingRequestId();
}
return 0;	
}
EmailPreview.prototype.isMessageMeetingRequest=function() {
if(this.i_message!=undefined) {
return this.i_message.isMeetingRequest();
}
return false;
}
EmailPreview.prototype.show_meeting_request=function(event_id) { 
this.loadHeaders();
var scrollWidth=scrollBarWidth();
var meetingWidth=parseInt(this.width() - (scrollWidth ? scrollWidth : 0) - 10);
this.i_request_disp=new MeetingRequestDisplay(undefined, meetingWidth, this.height());
var reqs=Application.getApplicationById(1004).getMeetingRequestDataModel().items();
var ev=undefined;
if(ev==undefined) {
ev=new CalendarEvent(event_id);
ev.i_request=true;
}
this.bodyContent(this.i_request_disp.getContentForEmail());
this.i_request_disp.loadRequestForEmail(ev);
}
EmailPreview.prototype.getRequestDisplay=function() {
return this.i_request_disp;
}
EmailPreview.prototype.setMessage=function(message) {
this.i_message=message;
if(message.isMeetingRequest()) {
this.show_meeting_request(message.meetingRequestId());
return;
}
var docBody=document.createElement('DIV');
docBody.style.padding="15px";
var body_data=message.body();
if(message.html()=="1") {
body_data=body_data.replace(/<style.*?>.*?<\/style.*?>/gi, "");
docBody.innerHTML=body_data;
if(body_data.toLowerCase().indexOf("btfimg")!=-1 ||
body_data.toLowerCase().indexOf("btfbackground")!=-1) {
this.i_action_images_div.style.display="";
} else {
this.i_action_images_div.style.display="none";
}
} else {
var pre_tag=document.createElement('DIV');
body_data=body_data.replace(/<br>\n/gi, "\n");
body_data=body_data.replace(/\n/g, "<br>");
pre_tag.innerHTML=body_data;
docBody.appendChild(pre_tag);
this.i_action_images_div.style.display="none";
}
this.loadHeaders();
this.bodyContent(docBody);
}
EmailPreview.handleEmailContextMenu=function(e) {
if(!EmailPreview.i_context_menu) {
EmailPreview.i_context_menu=new ContextMenu(150);
EmailPreview.i_context_menu_send=EmailPreview.i_context_menu.addItem(new ContextMenuItem("Send Email", true, EmailPreview.handleSendEmailContext));
EmailPreview.i_context_menu_add=EmailPreview.i_context_menu.addItem(new ContextMenuItem("Add to Contacts", true, EmailPreview.handleAddToContactsContext));
}
if(ApplicationEmail.getDataModel().activeFolder()==ApplicationEmail.i_draft_folder) {
EmailPreview.i_context_menu_add.enabled(false);
} else {
EmailPreview.i_context_menu_add.enabled(true);
}
EmailPreview.i_context_menu.pObj=this.pObj;
EmailPreview.i_context_menu.show(CursorMonitor.getX(), CursorMonitor.getY());
return false;
}
EmailPreview.handleSendEmailContext=function(menu_item) {
EmailPreview.handleEmailClick(menu_item.parent().pObj.address);
}
EmailPreview.handleAddToContactsContext=function(menu_item) {
var name=menu_item.parent().pObj.name;
if(name) {
name=name.replace(new RegExp("'", 'g'), "\\'");
}
EmailPreview.openContactWithData(name, menu_item.parent().pObj.address);
}
function EmailHeader(width, name, value, visible) {
this.i_name=name;
this.i_value=value;
this.i_width=width;
this.i_visible=(visible!=undefined ? visible : true);
this.i_empty=((value==undefined || value=="") ? true : false);
}
EmailHeader.labelWidth=100;
EmailHeader.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_header!=undefined) {
this.i_header_name.style.width=EmailHeader.labelWidth+"px";
this.i_header_value.style.width=(this.width() - EmailHeader.labelWidth)+"px";
}
}
return this.i_width;
}
EmailHeader.prototype.visible=function(state) {
if (state!=undefined) {
if (this.i_visible!=state) {
this.i_visible=state;
if (this.i_header!=undefined) {
this.i_header.style.display=((this.visible() && !this.empty()) ? "" : "none");
}
}
}
return this.i_visible;
}
EmailHeader.prototype.empty=function(state) {
if (state!=undefined) {
if (this.i_empty!=state) {
this.i_empty=state;
if (state==true) {
this.i_value="";
if (this.i_header!=undefined) {
this.i_header_value.innerHTML=" ";
this.i_header_value.className="EmailHeader_value";
this.i_header_value.style.width=(this.width() - EmailHeader.labelWidth)+"px";
}
}
if (this.i_header!=undefined) {
this.i_header.style.display=((this.visible() && !this.empty()) ? "" : "none");
}
}
}
return this.i_empty;
}
EmailHeader.prototype.height=function() {
if (this.i_header!=undefined && this.visible() && !this.empty()) {
if (this.i_header_name && this.i_header_value)
return parseInt(Math.max(this.i_header_name.offsetHeight,this.i_header_value.offsetHeight));
else
return parseInt(this.i_header.offsetHeight);
}
return 0;
}
EmailHeader.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_header_name!=undefined) {
this.i_header_name.innerHTML=name;
this.i_header_name.className="EmailHeader_name";
this.i_header_name.style.width=EmailHeader.labelWidth+"px";
}
}
return this.i_name;
}
EmailHeader.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
if (this.i_header_value!=undefined) {
this.i_header_value.innerHTML=value;
this.i_header_value.className="EmailHeader_value";
this.i_header_value.style.width=(this.width() - EmailHeader.labelWidth)+"px";
}
this.empty(value=="" ? true : false);
}
return this.i_value;
}
EmailHeader.prototype.appendChildren=function(value) {
if(value) {
if (this.i_header_value!=undefined) {
this.i_header_value.innerHTML="";
if(value.splice) {
for(var x=0; x < value.length; x++) {
this.i_header_value.appendChild(value[x]);
}
}else{
this.i_header_value.innerHTML=value;
}
this.i_header_value.className="EmailHeader_value";
this.i_header_value.style.width=(this.width() - EmailHeader.labelWidth)+"px";
}
this.i_value=this.i_header_value.innerHTML;
this.empty(this.i_value=="" ? true : false);
}
return this.i_value;
}
EmailHeader.prototype.getHeader=function() {
if (this.i_header==undefined) {
this.i_header=document.createElement('DIV');
this.i_header.className="EmailHeader";
this.i_header.style.display=(this.visible() ? "" : "none");
this.i_header_name=document.createElement('DIV');
this.i_header_name.innerHTML=this.name();
this.i_header_name.className="EmailHeader_name";
this.i_header_name.style.width=EmailHeader.labelWidth+"px";
this.i_header.appendChild(this.i_header_name);
this.i_header_value=document.createElement('DIV');
this.i_header_value.innerHTML=this.value();
this.i_header_value.style.width=(this.width() - EmailHeader.labelWidth)+"px";
this.i_header_value.className="EmailHeader_value";
this.i_header_value.style.marginLeft=EmailHeader.labelWidth+"px";
this.i_header.appendChild(this.i_header_value);	
if (this.i_header!=undefined) {
this.i_header.style.display=((this.visible() && !this.empty()) ? "" : "none");
}
}
return this.i_header;
}
function openSendEmail(address, subject, emid, fid, emidtype, ishtml,
att_list, csid) {
EmailPreview.handleEmailClick(address, att_list, undefined, csid);
}
JavaScriptResource.notifyComplete("./src/Applications/Email/components/Component.EmailPreview.js");	
function EmailQuota() {
this.i_usage=0;
this.i_total=0;
this.i_content=undefined;
this.i_bar=undefined;
this.i_label=undefined;
}
EmailQuota.prototype.getContent=function() {
if(this.i_content==undefined) {
this.i_content=document.createElement('DIV');
this.i_content.className="EmailQuota";
var bar_border=document.createElement('DIV');
bar_border.className="EmailQuota_BarBorder";
this.i_bar=document.createElement('DIV');
this.i_bar.className="EmailQuota_Bar";
this.i_label=document.createElement('DIV');
this.i_label.className="EmailQuota_Label";
bar_border.appendChild(this.i_bar);
this.i_content.appendChild(bar_border);
this.i_content.appendChild(this.i_label);
this.updateQuota();
}
return this.i_content;
}
EmailQuota.prototype.updateQuota=function(usage, total) {
if(usage!=undefined) {
this.i_usage=usage;
}
if(total!=undefined) {
this.i_total=total;
}
var percent=0;
if(this.i_total!=0) {
percent=(100 * this.i_usage  / this.i_total);
}
if(percent >=100) {
this.i_bar.className="EmailQuota_BarWarn";
percent=100;
} else {
this.i_bar.className="EmailQuota_Bar";
}
if(!document.all) {
percent=(percent * 96) / 100;
}
this.i_bar.style.width=Math.round(percent)+"%";
this.i_label.innerHTML="<b>Usage:</b> "+ApplicationEmail.filter_size(this.i_usage)+" / "+ApplicationEmail.filter_size(this.i_total);
}
JavaScriptResource.notifyComplete("./src/Applications/Email/components/Component.EmailQuota.js");	
JavaScriptResource.notifyComplete("./btAppEmailCore.js");
