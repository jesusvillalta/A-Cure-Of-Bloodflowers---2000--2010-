PopoutWindow.registerGroup("ApplicationMyDay",["ApplicationMyDay"]);
function ApplicationMyDay() {
this.superApplication();
this.id(1020);
this.name("MyDay");
this.displayName("My Day");
this.smallIcon("ApplicationMyday_small");	
this.largeIcon("ApplicationMyday");		
this.loadingOrder(2);
this.default_auto_delete_notifications=36500;
this.default_max_notification_display=-1; 
this.default_display_range_special=14;
this.registerPreference("./btAppMyDayPreferences.js");
EventHandler.register(this, "oninitialize", this.handleInitialize, this);
EventHandler.register(this, "onintegrate", this.handleIntegration, this);
EventHandler.register(this, "onload", this.handleLoad, this);
EventHandler.register(this, "onpoll", this.handlePoll, this);
EventHandler.register(this, "onpreferencesupdate", this.handlePreferencesUpdate, this);
}
ApplicationMyDay.prototype.handleInitialize=function(e) {
if (SystemCore.hasApp(1004)) {
var date_today=new Date();
var str_today=getFullDateString(date_today);
this.i_win_events=new WindowObject('my-events', 'Today - '+str_today.substring(0, str_today.length - 6),
100, 100, Application.titleBarFactory());
this.i_win_events.titleBar().removeButton(Application.i_title_close);
this.i_win_events.minimumWidth(250);
this.i_win_se_notifications=new WindowObject('my-se-notifications', "Special Events", 100, 100,
Application.titleBarFactory());
this.i_win_se_notifications.titleBar().removeButton(Application.i_title_close);
this.i_win_se_notifications.minimumWidth(250);
}
if (SystemCore.hasApp(1015)) {
this.i_win_tasks=new WindowObject('my-tasks', "Tasks", 100, 100, Application.titleBarFactory());
this.i_win_tasks.titleBar().removeButton(Application.i_title_close);
this.i_win_tasks.minimumWidth(250);
}
this.i_win_simple_notifications=new WindowObject('my-notifications', "Notifications", 100, 100, Application.titleBarFactory());
this.i_win_simple_notifications.titleBar().removeButton(Application.i_title_close);
this.i_win_simple_notifications.minimumWidth(250);
this.i_win_inbox=new WindowObject('my-inbox', "Universal Inbox", 100, 100, Application.titleBarFactory());
this.i_win_inbox.titleBar().removeButton(Application.i_title_close);
this.i_win_inbox.minimumWidth(250);
if(SystemCore.hasApp(3000)) {
this.i_win_invitations=new WindowObject('my-invitations', "Invitations", 100, 100, Application.titleBarFactory());
this.i_win_invitations.titleBar().removeButton(Application.i_title_close);
this.i_win_invitations.minimumWidth(250);
}
if (SystemCore.hasApp(3006)) {   
if (ExtensionBannerAds.hasMyDayTall()) {
if (ExtensionBannerAds.adExists(ExtensionBannerAds.constants.MYDAYTALL)) {
this.i_myday_window3=new WindowObject('md3-wide', "300x600 Ad", 300+scrollBarWidth(), 600, undefined);
this.i_myday_window3.minimumWidth(302+scrollBarWidth());
} else if (ExtensionBannerAds.adExists(ExtensionBannerAds.constants.MYDAYTALLSKINNY)) {
this.i_myday_window3=new WindowObject('md3-skinny', "160x600 Ad", 160+scrollBarWidth(), 600, undefined);
this.i_myday_window3.minimumWidth(162+scrollBarWidth());
}
this.i_myday_window3.transparent(true);
var adFrame=ExtensionBannerAds.getAd(ExtensionBannerAds.adExists(ExtensionBannerAds.constants.MYDAYTALL) ? ExtensionBannerAds.constants.MYDAYTALL : ExtensionBannerAds.constants.MYDAYTALLSKINNY).getIframe();
var adDiv=document.createElement('div');
adDiv.appendChild(adFrame);
adDiv.style.overflow="hidden";
this.i_myday_window3.loadContent(adDiv);
}
}
this.getFakeNotifications();
this.i_nav_button=SystemCore.navigationBar().addButton(new NavigationButton(this.id(), this.i_userVisibleName, this.largeIcon(), this.smallIcon()));
EventHandler.register(this.i_nav_button, "onclick", this.launchApplication, this);
}
ApplicationMyDay.prototype.handleIntegration=function(e) {
var cal=Application.getApplicationById(1004);
if (cal!=undefined) {
this.getEventList().calendarsDataModel(cal.getCalendarListDataModel());
}
var tasks=Application.getApplicationById(1015);
if (tasks!=undefined) {
this.getTaskList().dataModel(tasks.getTaskDataModel());
}
var email=Application.getApplicationById(1007);
if (email!=undefined) {
EventHandler.register(email, "onpreferencesupdate", this.handleEmailPreferencesUpdate, this);
}
}
ApplicationMyDay.prototype.handleLoad=function(e) {
this.i_nav_button.selectedState(true);
if (e.first==true) {
if (SystemCore.hasApp(1004)) {
this.i_win_events.loadContent(this.getEventList().getList());
EventHandler.register(this.i_win_events, "oncontentresize", this.handleEventListResize, this);
this.i_win_se_notifications.loadContent(this.getSpecialEventNotifications().getList());
EventHandler.register(this.i_win_se_notifications, "oncontentresize", this.handleSENotificationResize, this);
}
if (SystemCore.hasApp(1015)) { 
this.i_win_tasks.loadContent(this.getTaskList().getList());
EventHandler.register(this.i_win_tasks, "oncontentresize", this.handleTaskListResize, this);
}
this.i_win_inbox.loadContent(this.getUniversalInbox().getInbox());
EventHandler.register(this.i_win_inbox, "oncontentresize", this.handleInboxResize, this);
if(SystemCore.hasApp(3000)) { 
this.i_win_invitations.loadContent(this.getInvitations().getInbox());
EventHandler.register(this.i_win_invitations, "oncontentresize", this.handleInvitationsResize, this);
}
if (SystemCore.hasApp(3006)) {   
ExtensionBannerAds.refreshAll();
}
this.i_win_simple_notifications.loadContent(this.getSimpleNotifications().getList());
EventHandler.register(this.i_win_simple_notifications, "oncontentresize", this.handleSimpleNotificationResize, this);
}
}
ApplicationMyDay.prototype.handlePoll=function(e) {
if(e.minute % SimpleNotificationDataModel.refreshRate==0) {
var request=this.getSimpleNotificationDataModel().refreshRequest();
if(request) {
APIManager.addQueue(request);
}
}
if(e.minute==0 || (e.time.getHours()==0 && e.time.getMinutes()==0)) {
var request=this.getSpecialEventNotificationDataModel().refreshRequest();
if(request) {
APIManager.addQueue(request);
}
}
}
ApplicationMyDay.prototype.handlePreferencesUpdate=function(e) {
if(e.auto_delete_notifications < this.getSimpleNotificationDataModel().i_auto_delete_notifications) {
this.getSimpleNotificationDataModel().dismissOld();
} else if(e.max_notification_display!=this.getSimpleNotifications().i_max_notification_display) {
this.getSimpleNotifications().refreshData();
}
if(e.display_range_special!=this.getSpecialEventNotificationDataModel().i_start_days) {
this.getSpecialEventNotificationDataModel().refresh();
}
}
ApplicationMyDay.prototype.handleEmailPreferencesUpdate=function(e) {
if(e.method=="setEmailPrefForward") {
var enabled=(e.data.xPath("params/isEnabled", true)=="1") ? true : false;
if(enabled) {
var email=e.data.xPath("params/forwardAddress", true);
this.getSimpleNotifications().forwardingFakeNotificationEmail(email);
}
this.getSimpleNotifications().enableForwardingFakeNotification(enabled);
} else if(e.method=="setEmailPrefVacation") {
var enabled=(e.data.xPath("params/isOn", true)=="1") ? true : false;
this.getSimpleNotifications().enableOutOfOfficeFakeNotification(enabled);
}
}
ApplicationMyDay.prototype.getFakeNotifications=function() {
var forwarding_params=new DataNode("params");
var forwarding_request=new RequestObject("email", "getEmailPrefForward", forwarding_params);
EventHandler.register(forwarding_request, "oncomplete", this.handleFakeNotificationsForwarding, this);
var out_of_office_params=new DataNode("params");
var out_of_office_request=new RequestObject("email", "getEmailPrefVacation", out_of_office_params);
EventHandler.register(out_of_office_request, "oncomplete", this.handleFakeNotificationsOutOfOffice, this);
var fake_params=new DataNode("params");
fake_params.addNode(new DataNode("user_id", user_prefs["user_id"]));
fake_params.addNode(new DataNode("enterprise_id", user_prefs["enterprise_id"]));
var fake_request=new RequestObject("MyDay", "getFakeNotifications", fake_params);
EventHandler.register(fake_request, "oncomplete", this.handleFakeNotifications, this);
APIManager.execute(forwarding_request, out_of_office_request, fake_request);
}
ApplicationMyDay.prototype.handleFakeNotificationsForwarding=function(e) {
var data=e.response.data();
var forwarding_data=data.xPath("optForwarding")[0];
var enabled;
if (forwarding_data!=undefined) {
enabled=(forwarding_data.attribute("isEnabled")=="1") ? true : false;
if(enabled) {
var email=forwarding_data.xPath("forwardAddress", true)
this.getSimpleNotifications().forwardingFakeNotificationEmail(email);
}
} else {
enabled=false;
}
this.getSimpleNotifications().enableForwardingFakeNotification(enabled);
}
ApplicationMyDay.prototype.handleFakeNotificationsOutOfOffice=function(e) {
var data=e.response.data();
var vacation_data=data.xPath("optVac")[0];
var enabled;
if (vacation_data!=undefined) {
enabled=(vacation_data.attribute("isOn")=="1") ? true : false;
} else {
enabled=false;
}
this.getSimpleNotifications().enableOutOfOfficeFakeNotification(enabled);
}
ApplicationMyDay.prototype.handleFakeNotifications=function(e) {
var data=e.response.data();
var audit_enabled=(data.xPath("audit", true)=="1") ? true : false;
this.getSimpleNotifications().enableAuditFakeNotification(audit_enabled);
}
ApplicationMyDay.prototype.handleEventListResize=function(e) {
if (this.i_event_list!=undefined) {
if (this.i_win_events.effectiveWidth()!=undefined) {
this.i_event_list.width(this.i_win_events.effectiveWidth() - 3);
}
if (this.i_win_events.effectiveHeight()!=undefined) {
this.i_event_list.height(this.i_win_events.effectiveHeight() - this.i_win_events.titleBar().height() - 5);
}
}
}
ApplicationMyDay.prototype.getEventList=function() {
if (this.i_event_list==undefined) {
this.i_event_list=new LiteEventList(100, 100, new Date());
}
return this.i_event_list;
}
ApplicationMyDay.prototype.handleTaskListResize=function(e) {
if (this.i_task_list!=undefined) {
if (this.i_win_tasks.effectiveWidth()!=undefined) {
this.i_task_list.width(this.i_win_tasks.effectiveWidth() - 3);
}
if (this.i_win_tasks.effectiveHeight()!=undefined) {
this.i_task_list.height(this.i_win_tasks.effectiveHeight() - this.i_win_tasks.titleBar().height() - 5);
}
}
}
ApplicationMyDay.prototype.getTaskList=function() {
if (this.i_task_list==undefined) {
this.i_task_list=new LiteTaskList(100, 14);
}
return this.i_task_list;
}
ApplicationMyDay.prototype.handleInboxResize=function(e) {
if (this.i_inbox!=undefined) {
if (this.i_win_inbox.effectiveWidth()!=undefined) {
this.i_inbox.width(this.i_win_inbox.effectiveWidth() - 3);
}
if (this.i_win_inbox.effectiveHeight()!=undefined) {
this.i_inbox.height(this.i_win_inbox.effectiveHeight() - this.i_win_inbox.titleBar().height() - 5);
}
}
}
ApplicationMyDay.prototype.getUniversalInbox=function() {
if (this.i_inbox==undefined) {
this.i_inbox=new UniversalInbox(100, 100);
}
return this.i_inbox;
}
ApplicationMyDay.prototype.handleInvitationsResize=function(e) {
if (this.i_invitations!=undefined) {
if (this.i_win_invitations.effectiveWidth()!=undefined) {
this.i_invitations.width(this.i_win_invitations.effectiveWidth() - 3);
}
if (this.i_win_invitations.effectiveHeight()!=undefined) {
this.i_invitations.height(this.i_win_invitations.effectiveHeight() - this.i_win_invitations.titleBar().height() - 5);
}
}
}
ApplicationMyDay.prototype.getInvitations=function() {
if(!this.i_invitations) {
this.i_invitations=new UniversalInbox(100, 100);
}
return this.i_invitations;
}
ApplicationMyDay.prototype.handleSENotificationResize=function(e) {
if (this.i_specialeventnotifications!=undefined) {
if (this.i_win_se_notifications.effectiveWidth()!=undefined) {
this.i_specialeventnotifications.width(this.i_win_se_notifications.effectiveWidth() - 3);
}
if (this.i_win_se_notifications.effectiveHeight()!=undefined) {
this.i_specialeventnotifications.height(this.i_win_se_notifications.effectiveHeight() -
this.i_win_se_notifications.titleBar().height() - 5);
}
}
}
ApplicationMyDay.prototype.getSpecialEventNotifications=function() {
if (this.i_specialeventnotifications==undefined) {
this.i_specialeventnotifications=new SpecialEventNotificationList(100, 100, this.getSpecialEventNotificationDataModel());
}
return this.i_specialeventnotifications;
}
ApplicationMyDay.prototype.getSpecialEventNotificationDataModel=function() {
if (this.i_specialEventNotificationDataModel==undefined) {
this.i_specialEventNotificationDataModel=new SpecialEventNotificationDataModel(this);
}
return this.i_specialEventNotificationDataModel;
}
ApplicationMyDay.prototype.handleSimpleNotificationResize=function(e) {
if (this.i_simple_notifications!=undefined) {
if (this.i_win_simple_notifications.effectiveWidth()!=undefined) {
this.i_simple_notifications.width(this.i_win_simple_notifications.effectiveWidth() - 3);
}
if (this.i_win_simple_notifications.effectiveHeight()!=undefined) {
this.i_simple_notifications.height(this.i_win_simple_notifications.effectiveHeight() -
this.i_win_simple_notifications.titleBar().height() - 5);
}
}
}
ApplicationMyDay.prototype.getSimpleNotifications=function() {
if (this.i_simple_notifications==undefined) {
this.i_simple_notifications=new SimpleNotificationList(100, 100, this.getSimpleNotificationDataModel(), this);
}
return this.i_simple_notifications;
}
ApplicationMyDay.prototype.getSimpleNotificationDataModel=function() {
if (this.i_simple_notification_data_model==undefined) {
this.i_simple_notification_data_model=new SimpleNotificationDataModel(this);
}
return this.i_simple_notification_data_model;
}
ApplicationMyDay.inherit(Application);
SystemCore.registerApplication(new ApplicationMyDay());
JavaScriptResource.notifyComplete("./src/Applications/MyDay/Application.MyDay.js");
function SimpleNotificationList(width, height, dataModel, myDayApp) {
this.myDay=myDayApp;
this.i_showall_pressed=false;
this.i_width=width;
this.i_height=height;
this.i_item_cache=Array();
this.i_date_headers=Array();
this.i_fake_notifications={};
this.dataModel(dataModel);
}
SimpleNotificationList.buttonHeight=22;
SimpleNotificationList.messageHeight=22;
SimpleNotificationList.padding=2;
SimpleNotificationList.prototype.updateParams=function() {
this.i_max_notification_display=this.myDay.param("max_notification_display");
if(this.i_max_notification_display==undefined) {
this.i_max_notification_display=this.myDay.default_max_notification_display;
}
}
SimpleNotificationList.prototype.dataModel=function(model) {
if (model!=undefined) {
if (this.i_dm_r!=undefined) {
this.i_dm_r.unregister();
this.i_dm_r=null;
}
this.i_model=model;
if (model!=undefined) {
this.i_dm_r=EventHandler.register(this.i_model, "onrefresh", this.refreshData, this);
}
this.refreshData();
}
return this.i_model;
}
SimpleNotificationList.prototype.addNotification=function(notification, visible) {
if(visible==undefined) {
visible=true;
}
if(this.i_list_data) {
notification.visible(visible);
this.i_list_data.appendChild(notification.getItem());
}
this.i_item_cache.push(notification);
}
SimpleNotificationList.prototype.addDataModelItem=function(item) {
var notification=new SimpleNotificationItem();
notification.eventObject(item);
this.addNotification(notification);
}
SimpleNotificationList.prototype.getForwardingFakeNotification=function() {
if(!this.i_fake_notifications.forwarding) {
this.i_fake_notifications.forwarding=new SimpleNotificationItem("", 0);
}
return this.i_fake_notifications.forwarding;
}
SimpleNotificationList.prototype.enableForwardingFakeNotification=function(value) {
if(value!=undefined) {
this.i_enable_forwarding_fake_notification=value;
if(this.i_list_data) {
this.refreshData();
}
}
return this.i_enable_forwarding_fake_notification;
}
SimpleNotificationList.prototype.forwardingFakeNotificationEmail=function(email) {
if(email!=undefined) {
this.i_forwarding_fake_notification_email=email;
this.getForwardingFakeNotification().message("Your email is being forwarded to "+email+".");
}
return this.i_forwarding_fake_notification_email;
}
SimpleNotificationList.prototype.getAuditFakeNotification=function() {
if(!this.i_fake_notifications.audit) {
this.i_fake_notifications.audit=new SimpleNotificationItem("Incoming/outgoing email messages may be audited by your administrator.", 0);
}
return this.i_fake_notifications.audit;
}
SimpleNotificationList.prototype.enableAuditFakeNotification=function(value) {
if(value!=undefined) {
this.i_enable_audit_fake_notification=value;
if(this.i_list_data) {
this.refreshData();
}
}
return this.i_enable_audit_fake_notification;
}
SimpleNotificationList.prototype.getOutOfOfficeFakeNotification=function() {
if(!this.i_fake_notifications.out_of_office) {
this.i_fake_notifications.out_of_office=new SimpleNotificationItem("Your email out of office message is on.", 0);
}
return this.i_fake_notifications.out_of_office;
}
SimpleNotificationList.prototype.enableOutOfOfficeFakeNotification=function(value) {
if(value!=undefined) {
this.i_enable_out_of_office_fake_notification=value;
if(this.i_list_data) {
this.refreshData();
}
}
return this.i_enable_out_of_office_fake_notification;
}
SimpleNotificationList.prototype.refreshData=function() {
if (this.i_list!=undefined && this.i_model!=undefined) {
this.updateParams();
var system_items=this.i_model.getSystemItems(0, 1000);
var user_items=this.i_model.getUserItems(0, 1000);
this.i_total_num_user_notifications=user_items.length();
var max_num_user_notifications=this.i_total_num_user_notifications;
if(this.i_max_notification_display > 0 && !this.i_showall_pressed) {
if(this.i_max_notification_display < max_num_user_notifications) {
max_num_user_notifications=this.i_max_notification_display;
}
}
if(this.i_max_notification_display > 0) {
if(this.i_showall_pressed && this.i_total_num_user_notifications <=this.i_max_notification_display) {
this.i_showall_pressed=false;
}
if(this.i_total_num_user_notifications <=max_num_user_notifications && !this.i_showall_pressed) {
this.i_list_button_showall.visible(false);
} else {
this.i_list_button_showall.visible(true);
}
} else {
this.i_list_button_showall.visible(false);
}
this.setButtonLabel();
this.i_item_cache=[];
if (this.i_list_data!=undefined) {
while(this.i_list_data.hasChildNodes()) { 
this.i_list_data.removeChild(this.i_list_data.lastChild);
}	
}
if(system_items.length()==0 && user_items.length()==0 && !this.enableForwardingFakeNotification() && !this.enableAuditFakeNotification() && !this.enableOutOfOfficeFakeNotification()) {
this.i_list_message.style.display="";
this.i_list_message.innerHTML=(this.i_model.i_init==true ? "No notifications" : "Loading...");
} else {
this.i_list_message.style.display="none";
this.addNotification(this.getForwardingFakeNotification(), this.enableForwardingFakeNotification());
this.addNotification(this.getAuditFakeNotification(), this.enableAuditFakeNotification());
this.addNotification(this.getOutOfOfficeFakeNotification(), this.enableOutOfOfficeFakeNotification());
for(var i=0; i < system_items.length(); i++) {
this.addDataModelItem(system_items.getItem(i));
}
var lastDate;
for(var i=0; i < max_num_user_notifications; i++) {
var item=user_items.getItem(i);
var strItemDate=getDateString(iCaltoDate(item.date()));
var strTodaysDate=getDateString(new Date());
if (strItemDate!=lastDate) {
var dateHeaderText;
if (strItemDate!=strTodaysDate) {
dateHeaderText=strItemDate;
} else {
dateHeaderText="Today";
}
var dateHeaderDiv=document.createElement('DIV');
dateHeaderDiv.className="MyDay_SimpleNotificationList_date_header";
dateHeaderDiv.innerHTML=dateHeaderText;
this.i_list_data.appendChild(dateHeaderDiv);
this.i_date_headers.push(dateHeaderDiv);
lastDate=strItemDate;
}
this.addDataModelItem(item);
}
}
if(user_items.length()==0) {
this.i_list_button_clearall.visible(false);
} else {
this.i_list_button_clearall.visible(true);
}
this.width(this.i_width);
}
else {
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
}
}
SimpleNotificationList.prototype.handleRemoveAllUserNotifications=function(e){
if (e!=undefined) {
this.dataModel().DismissAll();
}
}
SimpleNotificationList.prototype.setButtonLabel=function() {
if(this.i_max_notification_display > 0) {
if(this.i_showall_pressed==true) {
this.i_list_button_showall.label("Show fewer notifications");
} else {
this.i_list_button_showall.label("Show all "+this.i_total_num_user_notifications+" notifications");
}
if (document.all) {
this.i_list_button_showall.getButton().style.width=(this.i_list_button_showall.width()+2)+"px";
}
}
}
SimpleNotificationList.prototype.handleShowAllUserNotifications=function(e){
if (e!=undefined) {
if (this.i_showall_pressed==true) {
this.i_showall_pressed=false;
}
else if (this.i_showall_pressed==false) {
this.i_showall_pressed=true;
}
this.setButtonLabel();
this.refreshData();
this.width(this.i_width);
}
}
SimpleNotificationList.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=(newWidth < 0 ? 0 : newWidth);
if (this.i_list!=undefined && this.i_list_data!=undefined) {
this.i_list.style.width=this.i_width+"px";
this.i_list_message.style.width=this.i_width+"px";
this.i_list_buttons.style.width=this.i_width+"px";
this.i_list_data.style.width=this.i_width+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(this.i_width);
}
for (var x=0; x < this.i_date_headers.length; x++) {
this.i_date_headers[x].width=this.i_width+"px";
}
var newDataHeight=this.i_list_buttons.offsetHeight+this.i_list_data.offsetHeight;
var winHeight=(this.i_list.parentNode ? (this.i_list.parentNode.offsetHeight) : (this.i_list.offsetHeight));
if (newDataHeight > winHeight) {
var scrollWidth=(this.i_width - (scrollBarWidth()+1));
this.i_list.style.width=scrollWidth+"px";
this.i_list_message.style.width=scrollWidth+"px";
this.i_list_buttons.style.width=scrollWidth+"px";
this.i_list_data.style.width=scrollWidth+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(scrollWidth);
}
for (var x=0; x < this.i_date_headers.length; x++) {
this.i_date_headers[x].width=scrollWidth+"px";
}
}
}
}
return this.i_width;
}
SimpleNotificationList.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_list!=undefined) {
this.i_list.style.height=height+"px";
}
}
return this.i_height;
}
SimpleNotificationList.prototype.getList=function() {
if (this.i_list==undefined) {
this.updateParams();
this.i_list=document.createElement('DIV');
this.i_list.className="SimpleNotificationList";
this.i_list.style.width=this.width()+"px";
this.i_list.style.height=this.height()+"px";
this.i_list_message=document.createElement('DIV');
this.i_list_message.className="MyDay_SimpleNotificationList_message";
this.i_list_message.style.height=SimpleNotificationList.messageHeight+"px";
this.i_list_message.style.lineHeight=SimpleNotificationList.messageHeight+"px";
this.i_list_message.innerHTML="Loading...";
this.i_list.appendChild(this.i_list_message);
this.i_list_data=document.createElement('DIV');
this.i_list_data.className="MyDay_SimpleNotificationList_data";
this.i_list.appendChild(this.i_list_data);
this.i_list_buttons=document.createElement('DIV');
this.i_list_buttons.className="MyDay_SimpleNotificationList_buttons";
this.i_list_buttons.style.height=SimpleNotificationList.buttonHeight+"px";
this.i_list_buttons.style.padding=SimpleNotificationList.padding+"px";
this.i_list.appendChild(this.i_list_buttons);
this.i_list_button_showall=new UniversalButton("Show all XX notifications", undefined, undefined, undefined, undefined, 22);
this.i_list_button_showall.float("left");
EventHandler.register(this.i_list_button_showall, "onclick", this.handleShowAllUserNotifications, this);
this.i_list_buttons.appendChild(this.i_list_button_showall.getButton());
this.i_list_button_clearall=new UniversalButton("Clear All", undefined, undefined, undefined, undefined, 22);
this.i_list_button_clearall.float("right");
EventHandler.register(this.i_list_button_clearall, "onclick", this.handleRemoveAllUserNotifications, this);
this.i_list_buttons.appendChild(this.i_list_button_clearall.getButton());
this.refreshData();
}
return this.i_list;
}
function SimpleNotificationItem(message, type) {
this.i_message=message;
this.i_type=type;
}
SimpleNotificationItem.padding=2;
SimpleNotificationItem.itemHeight=18;
SimpleNotificationItem.iconWidth=18;
SimpleNotificationItem.iconHeight=16;
SimpleNotificationItem.dismissWidth=14;
SimpleNotificationItem.dismissHeight=14;
SimpleNotificationItem.prototype.message=function(message) {
if(message!=undefined) {
this.i_message=message;
if(this.i_item_content) {
this.i_item_content.innerHTML=message.filterHTML();
}
}
return this.i_message;
}
SimpleNotificationItem.prototype.type=function(type) {
if(type!=undefined) {
this.i_type=parseInt(type);
}
return this.i_type;
}
SimpleNotificationItem.prototype.iconType=function() {
var icon_classname=SimpleNotificationItem.iconClass;
switch(this.i_type) {
case 1:
icon_classname="MyDay_SimpleNotificationItem_iconUser";
break;
case 0:
icon_classname="MyDay_SimpleNotificationItem_iconSystem";
break;
}
return icon_classname;
}
SimpleNotificationItem.prototype.eventObject=function(event) {
if(event!=undefined) {
this.i_event=event;
this.message(event.content());
this.type(event.type());
if(this.i_item_content!=undefined) {
this.i_item_content.innerHTML=this.message();
}
}
return this.i_event;
}
SimpleNotificationItem.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_item!=undefined) {
this.i_item.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
SimpleNotificationItem.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=newWidth;
if (this.i_item!=undefined) {
this.i_item.style.width=this.i_width+"px";
var newWidth=(this.i_width - SimpleNotificationItem.iconWidth - 
SimpleNotificationItem.dismissWidth - (2 * SimpleNotificationItem.padding));
this.i_item_content.style.width=(newWidth > 0 ? newWidth+"px" : "0px");
}
}
return this.i_width;
}
SimpleNotificationItem.prototype.handleDismissMouseOver=function(e) {
this.i_item_dismiss_button.className="MyDay_SimpleNotificationItem_dismiss_button_hover";
}
SimpleNotificationItem.prototype.handleDismissMouseOut=function(e) {
this.i_item_dismiss_button.className="MyDay_SimpleNotificationItem_dismiss_button";
}
SimpleNotificationItem.prototype.handleItemDismiss=function(e) {
this.eventObject().Dismiss();
}
SimpleNotificationItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="MyDay_SimpleNotificationItem";
this.i_item.style.width=(this.width() > 1 ? this.width()+"px" : "1px");
this.i_item.style.padding=SimpleNotificationItem.padding+"px";
this.i_item.style.display=(this.visible() ? "" : "none");
EventHandler.register(this.i_item, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_item, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_item, "onclick", this.handleClick, this);
this.i_item_icon=document.createElement('DIV');
this.i_item_icon.className=this.iconType();
this.i_item_icon.style.width=SimpleNotificationItem.iconWidth+"px";
this.i_item_icon.style.height=SimpleNotificationItem.iconHeight+"px";
this.i_item.appendChild(this.i_item_icon);
this.i_item_content=document.createElement('DIV');
this.i_item_content.className="MyDay_SimpleNotificationItem_content";
this.i_item_content.innerHTML=this.i_message.filterHTML();
this.i_item.appendChild(this.i_item_content);
if (this.i_type==1) {
this.i_item_dismiss=document.createElement('DIV');
this.i_item_dismiss.className="MyDay_SimpleNotificationItem_dismiss";
this.i_item_dismiss.style.width=SimpleNotificationItem.dismissWidth+"px";
this.i_item_dismiss.style.height=SimpleNotificationItem.dismissHeight+"px";
this.i_item.appendChild(this.i_item_dismiss);
this.i_item_dismiss_button=document.createElement('DIV');
this.i_item_dismiss_button.className="MyDay_SimpleNotificationItem_dismiss_button";
this.i_item_dismiss_button.style.width=SimpleNotificationItem.dismissWidth+"px";
this.i_item_dismiss_button.style.height=SimpleNotificationItem.dismissHeight+"px";
EventHandler.register(this.i_item_dismiss_button, "onclick", this.handleItemDismiss, this);
EventHandler.register(this.i_item_dismiss_button, "onmouseover", this.handleDismissMouseOver, this);
EventHandler.register(this.i_item_dismiss_button, "onmouseout", this.handleDismissMouseOut, this);
this.i_item_dismiss.appendChild(this.i_item_dismiss_button);
}
var newWidth=(this.i_width ? (this.i_width - SimpleNotificationItem.iconWidth - 
SimpleNotificationItem.dismissWidth - (2 * SimpleNotificationItem.padding)) : 1);
this.i_item_content.style.width=(newWidth ? newWidth+"px" : "0px");
this.i_item_float_clear=document.createElement('DIV');
this.i_item_float_clear.style.clear="both";
this.i_item.appendChild(this.i_item_float_clear);
}
return this.i_item;
}
JavaScriptResource.notifyComplete("./src/Applications/MyDay/components/Component.NotificationList.js");
function SpecialEventNotificationList(width, height, dataModel) {
this.i_width=width;
this.i_height=height;
this.i_item_cache=Array();
this.dataModel(dataModel);
}
SpecialEventNotificationList.buttonHeight=22;
SpecialEventNotificationList.messageHeight=22;
SpecialEventNotificationList.padding=2;
SpecialEventNotificationList.prototype.dataModel=function(model) {
if (model!=undefined) {
if (model==false) {
model=undefined;
}			
if (this.i_m_r!=undefined) {
this.i_m_r.unregister();
this.i_m_r=null;
}
this.i_model=model;
if (model!=undefined) {			
this.i_m_r=EventHandler.register(this.i_model, "onrefresh", this.refreshData, this);
}
this.refreshData();
}
return this.i_model;
}
SpecialEventNotificationList.prototype.refreshData=function() {
if (this.i_list!=undefined && this.i_model!=undefined) {
var items=this.i_model.getItems(0, 1000, 'startdate', 'asc');
if (items.length()==0) {
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
this.i_list_message.style.display="";
this.i_list_message.innerHTML=(this.dataModel().i_init==true ? "No special events" : "Loading...");
if (this.dataModel().i_init==true) {
this.i_list_buttons.style.display="none";
}
}
else {
this.i_list_message.style.display="none";
this.i_list_buttons.style.display="";
if (this.i_list_data!=undefined) {
while(this.i_list_data.hasChildNodes()) { 
this.i_list_data.removeChild(this.i_list_data.lastChild);
}	
}
var entries=items.length();
for (var x=0; x < entries; x++) {
var i=items.getItem(x);
this.i_item_cache[x]=new SpecialEventNotificationListItem();
this.i_item_cache[x].eventObject(i);
var domItem=this.i_item_cache[x].getItem();
if (this.ongetitem!=undefined) {
var o=new Object();
o.type="getitem";
o.dataItem=this.i_item_cache[x].eventObject();
o.domItem=domItem;
this.ongetitem(o);
}
this.i_list_data.appendChild(domItem);
this.i_item_cache[x].visible(true);
}
for (var x=entries; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
}
this.width(this.i_width);
}
else {
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
}
}
SpecialEventNotificationList.prototype.handlePrefSave=function(e) {
if (e!=undefined) {
if (this.i_model.i_start_days!=e.display_range_special) {
if (this.i_model.onrefresh!=undefined) {
this.i_model.i_init=false;
this.i_model.clear();
var o=new Object();
o.type="refresh";
this.i_model.onrefresh(o);
}
}
}
}
SpecialEventNotificationList.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=(newWidth < 0 ? 0 : newWidth);
if (this.i_list!=undefined && this.i_list_data!=undefined) {
this.i_list.style.width=this.i_width+"px";
this.i_list_message.style.width=this.i_width+"px";
this.i_list_buttons.style.width=this.i_width+"px";
this.i_list_data.style.width=this.i_width+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(this.i_width);
}
var winHeight=(this.i_list.parentNode ? (this.i_list.parentNode.offsetHeight) : (this.i_list.offsetHeight));
var listHeight=this.i_list_data.offsetHeight+this.i_list_buttons.offsetHeight;
if (listHeight > winHeight) {
var scrollWidth=(this.i_width - (scrollBarWidth()+1));
this.i_list.style.width=scrollWidth+"px";
this.i_list_message.style.width=scrollWidth+"px";
this.i_list_buttons.style.width=scrollWidth+"px";
this.i_list_data.style.width=scrollWidth+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(scrollWidth);
}
}
}
}
return this.i_width;
}
SpecialEventNotificationList.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_list!=undefined) {
this.i_list.style.height=height+"px";
}
}
return this.i_height;
}
SpecialEventNotificationList.prototype.handleRemoveAllSpecialEventNotifications=function(e){
if (e!=undefined) {
this.dataModel().DismissAll();
}
}	
SpecialEventNotificationList.prototype.getList=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.className="MyDay_SpecialEventNotificationList";
this.i_list.style.width=this.width()+"px";
this.i_list.style.height=this.height()+"px";
this.i_list_message=document.createElement('DIV');
this.i_list_message.className="MyDay_SpecialEventNotificationList_message";
this.i_list_message.style.height=SpecialEventNotificationList.messageHeight+"px";
this.i_list_message.style.lineHeight=SpecialEventNotificationList.messageHeight+"px";
this.i_list_message.innerHTML="Loading...";
this.i_list.appendChild(this.i_list_message);
this.i_list_data=document.createElement('DIV');
this.i_list_data.className="MyDay_SpecialEventNotificationList_data";
this.i_list.appendChild(this.i_list_data);
this.i_list_buttons=document.createElement('DIV');
this.i_list_buttons.style.display="none";
this.i_list_buttons.className="MyDay_SpecialEventNotificationList_buttons";
this.i_list_buttons.style.width=this.width()+"px";
this.i_list_buttons.style.padding=SpecialEventNotificationList.padding+"px";
this.i_list_buttons.style.height=SpecialEventNotificationList.buttonHeight+(SpecialEventNotificationList.padding * 2)+"px";
this.i_list.appendChild(this.i_list_buttons);
this.i_list_button_clearall=new UniversalButton("Clear All", undefined, undefined, undefined, undefined, 22);
this.i_list_button_clearall.float("right");
EventHandler.register(this.i_list_button_clearall, "onclick", this.handleRemoveAllSpecialEventNotifications, this);
this.i_list_buttons.appendChild(this.i_list_button_clearall.getButton());
this.refreshData();
}
return this.i_list;
}
function SpecialEventNotificationListItem() {
}
SpecialEventNotificationListItem.paddingLR=2;
SpecialEventNotificationListItem.paddingTB=2;
SpecialEventNotificationListItem.itemHeight=18;
SpecialEventNotificationListItem.iconWidth=18;
SpecialEventNotificationListItem.iconHeight=16;
SpecialEventNotificationListItem.dismissWidth=14;
SpecialEventNotificationListItem.dismissHeight=14;
SpecialEventNotificationListItem.iconClass="MyDay_SpecialEventNotificationListItem_iconDefault";	
SpecialEventNotificationListItem.prototype.linkRemindMeLater=function(rd) {
var remind_text="";
if (rd!=undefined) {
switch(rd) {
case 0:
break;
case 3:
remind_text="Remind me 3 days before";
break;
case 7:
remind_text="Remind me 1 week before";
break;
} 
}
return remind_text;
}
SpecialEventNotificationListItem.prototype.iconType=function(et) {
var icon_classname=SpecialEventNotificationListItem.iconClass;
if (et!=undefined) {
switch(et) {
case "2":
icon_classname="MyDay_SpecialEventNotificationListItem_iconBirthday";
break;				
case "3":
icon_classname="MyDay_SpecialEventNotificationListItem_iconAnniversary";
break;
case "5":
icon_classname="MyDay_SpecialEventNotificationListItem_iconHoliday";
break;
}
}
return icon_classname;
}
SpecialEventNotificationListItem.prototype.eventObject=function(ev) {
if (ev!=undefined) {
this.i_event=ev;
if (this.i_item!=undefined) {
this.i_item_content_text=document.createElement("SPAN");
this.i_item_content_text.innerHTML=((this.eventObject()!=undefined && this.eventObject().content()!=undefined) ? this.eventObject().content().filterHTML() : "No Title");
this.i_item_content.appendChild(this.i_item_content_text);
}
}
return this.i_event;
}
SpecialEventNotificationListItem.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_item!=undefined) {
this.i_item.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}	
SpecialEventNotificationListItem.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_item!=undefined) {
this.i_item.style.width=this.i_width+"px";
var newWidth=this.i_width -
SpecialEventNotificationListItem.iconWidth -
SpecialEventNotificationListItem.dismissWidth -
(2 * SpecialEventNotificationListItem.paddingLR);
this.i_item_content.style.width=(newWidth > 0 ? newWidth : 0)+"px";
}
}
return this.i_width;
}	
SpecialEventNotificationListItem.prototype.handleItemMouseOver=function(e) {
this.i_item.className="MyDay_SpecialEventNotificationListItem_hover";
}
SpecialEventNotificationListItem.prototype.handleItemMouseOut=function(e) {
this.i_item.className="MyDay_SpecialEventNotificationListItem";
}
SpecialEventNotificationListItem.prototype.handleRemindMeLaterMouseOver=function(e) {
this.i_item_content_link.className="MyDay_SpecialEventNotificationListItem_RemindMeLater_hover";
}
SpecialEventNotificationListItem.prototype.handleRemindMeLaterMouseOut=function(e) {
this.i_item_content_link.className="MyDay_SpecialEventNotificationListItem_RemindMeLater";
}
SpecialEventNotificationListItem.prototype.handleDismissMouseOver=function(e) {
this.i_item_dismiss_button.className="MyDay_SpecialEventNotificationListItem_dismiss_button_hover";
}
SpecialEventNotificationListItem.prototype.handleDismissMouseOut=function(e) {
this.i_item_dismiss_button.className="MyDay_SpecialEventNotificationListItem_dismiss_button";
}
SpecialEventNotificationListItem.prototype.handleItemDismiss=function(e) {
this.eventObject().dismiss();
}
SpecialEventNotificationListItem.prototype.handleRemindMeLater=function(e) {
this.eventObject().remindMeLater();
}	
SpecialEventNotificationListItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="MyDay_SpecialEventNotificationListItem";
this.i_item.style.width=(this.width() > 1 ? this.width()+"px" : "1px");
this.i_item.style.paddingLeft=SpecialEventNotificationListItem.paddingLR+"px";
this.i_item.style.paddingRight=SpecialEventNotificationListItem.paddingLR+"px";
this.i_item.style.paddingTop=SpecialEventNotificationListItem.paddingTB+"px";
this.i_item.style.paddingBottom=SpecialEventNotificationListItem.paddingTB+"px";						
this.i_item.style.display=(this.visible() ? "" : "none");
this.i_item_icon=document.createElement('DIV');
this.i_item_icon.className=((this.eventObject()!=undefined && this.eventObject().eventType()!=undefined) ? this.iconType(this.eventObject().eventType()) : "");
this.i_item_icon.style.width=SpecialEventNotificationListItem.iconWidth+"px";
this.i_item_icon.style.height=SpecialEventNotificationListItem.iconHeight+"px";
this.i_item.appendChild(this.i_item_icon);
this.i_item_content=document.createElement('DIV');
this.i_item_content.className="MyDay_SpecialEventNotificationListItem_content";
this.i_item_content_text=document.createElement("SPAN");
this.i_item_content_text.innerHTML=((this.eventObject()!=undefined && this.eventObject().content()!=undefined) ? this.eventObject().content().filterHTML() : "No Title");
this.i_item_content.appendChild(this.i_item_content_text);
this.i_item.appendChild(this.i_item_content);
var show_remind_link=((this.eventObject()!=undefined && this.eventObject().remindMeDays()!=undefined) ? this.linkRemindMeLater(this.eventObject().remindMeDays()) : "");
if (show_remind_link) {
this.i_item_content_paren_open=document.createElement("SPAN");
this.i_item_content_paren_open.innerHTML=" (";
this.i_item_content.appendChild(this.i_item_content_paren_open);
this.i_item_content_link=document.createElement("DIV");
this.i_item_content_link.style.display="inline";
this.i_item_content_link.className="MyDay_SpecialEventNotificationListItem_RemindMeLater";
this.i_item_content_link.innerHTML=show_remind_link;
EventHandler.register(this.i_item_content_link, "onclick", this.handleRemindMeLater, this);
EventHandler.register(this.i_item_content_link, "onmouseover", this.handleRemindMeLaterMouseOver, this);
EventHandler.register(this.i_item_content_link, "onmouseout", this.handleRemindMeLaterMouseOut, this);					
this.i_item_content.appendChild(this.i_item_content_link);
this.i_item_content_paren_close=document.createElement("SPAN");
this.i_item_content_paren_close.innerHTML=")";
this.i_item_content.appendChild(this.i_item_content_paren_close);					
}
this.i_item_dismiss=document.createElement('DIV');
this.i_item_dismiss.className="MyDay_SpecialEventNotificationListItem_dismiss";
this.i_item_dismiss.style.width=SpecialEventNotificationListItem.dismissWidth+"px";
this.i_item_dismiss.style.height=SpecialEventNotificationListItem.dismissHeight+"px";
this.i_item.appendChild(this.i_item_dismiss);
this.i_item_dismiss_button=document.createElement('DIV');
this.i_item_dismiss_button.className="MyDay_SpecialEventNotificationListItem_dismiss_button";
this.i_item_dismiss_button.style.width=SpecialEventNotificationListItem.dismissWidth+"px";
this.i_item_dismiss_button.style.height=SpecialEventNotificationListItem.dismissHeight+"px";
EventHandler.register(this.i_item_dismiss_button, "onclick", this.handleItemDismiss, this);
EventHandler.register(this.i_item_dismiss_button, "onmouseover", this.handleDismissMouseOver, this);
EventHandler.register(this.i_item_dismiss_button, "onmouseout", this.handleDismissMouseOut, this);
this.i_item_dismiss.appendChild(this.i_item_dismiss_button);
var newWidth;
if (this.i_width==undefined) {
newWidth=1;
} else {
newWidth=this.i_width -
SpecialEventNotificationListItem.iconWidth -
SpecialEventNotificationListItem.dismissWidth -
(2 * SpecialEventNotificationListItem.paddingLR);
}
this.i_item_content.style.width=(newWidth > 0 ? newWidth : 0)+"px";
this.i_item_float_clear=document.createElement('DIV');
this.i_item_float_clear.style.clear='both';
this.i_item.appendChild(this.i_item_float_clear);
}
return this.i_item;
}
JavaScriptResource.notifyComplete("./src/Applications/MyDay/components/Component.SpecialEventNotificationList.js");
function UniversalInbox(width, height) {
this.i_width=width;
this.i_height=height;
this.i_items=Array();
}
UniversalInbox.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_list!=undefined) {
this.i_list.style.width=width+"px";
}
this.updateWidth();
}
return this.i_width;
}
UniversalInbox.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_list!=undefined) {
this.i_list.style.height=height+"px";
}
}
return this.i_height;
}
UniversalInbox.prototype.updateWidth=function() {
var h=(this.i_items.length * UniversalInboxItem.rowHeight);
var w=this.width();
if (h > this.height()) {
w -=scrollBarWidth();
}
for (var x=0; x < this.i_items.length; x++) {
this.i_items[x].width(w);
}
}
UniversalInbox.prototype.items=function(index) {
if (index!=undefined) {
return this.i_items[index];
}
return this.i_items;
}
UniversalInbox.prototype.addItem=function(item, beforeItem) {
var append=true;
if (beforeItem!=undefined) {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x]==beforeItem) {
this.i_items.splice(x, 0, item);
append=false;
if (this.i_list!=undefined) {
this.i_list.insertBefore(item.getItem(), item.beforeItem());
}
break;
}
}
}
if (append) {
this.i_items[this.i_items.length]=item;
if (this.i_list!=undefined) {
this.i_list.appendChild(this.getItem());
}
}
this.updateWidth();
return item;
}
UniversalInbox.prototype.removeItem=function(item) {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x]==item) {
this.i_items.splice(x, 1);
if (this.i_list!=undefined) {
this.i_list.removeChild(item.getItem());
}
this.updateWidth();
return true;
}
}
return false;
}
UniversalInbox.prototype.getInbox=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.className="UniversalInbox";
this.i_list.style.width=this.width()+"px";
this.i_list.style.height=this.height()+"px";
for (var x=0; x < this.i_items.length; x++) {
this.i_list.appendChild(this.i_items[x].getItem());
}
}
return this.i_list;
}
function UniversalInboxItem(name, value, loading) {
this.i_name=name;
this.i_value=value;
this.i_loading=(loading!=undefined ? loading : false);
this.i_hover_state=false;
}
UniversalInboxItem.valueWidth=100;
UniversalInboxItem.rowHeight=22;
UniversalInboxItem.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_item!=undefined) {
this.i_item_name.innerHTML=name;
}
}
return this.i_name;
}
UniversalInboxItem.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
this.loading(false);
if (this.i_item!=undefined) {
this.i_item_value.innerHTML=value;
this.updateStyles();
}
}
return this.i_value;
}
UniversalInboxItem.prototype.loading=function(state) {
if (state!=undefined) {
this.i_loading=state;
if(this.i_item) {
if(state==true) {
this.i_item_value.innerHTML="-";
}
this.updateStyles();
}
}
return this.i_loading;
}
UniversalInboxItem.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover_state=state;
this.updateStyles();
}
return this.i_hover_state;
}
UniversalInboxItem.prototype.width=function(width) {
if (width!=undefined) {
if (width < UniversalInboxItem.valueWidth) width=UniversalInboxItem.valueWidth;
this.i_width=width;
if (this.i_item!=undefined) {
this.i_item_name.style.width=(this.width() - UniversalInboxItem.valueWidth)+"px";
}
}
return this.i_width;
}
UniversalInboxItem.prototype.handleMouseOver=function(e) {
this.hoverState(true);
}
UniversalInboxItem.prototype.handleMouseOut=function(e) {
this.hoverState(false);
}
UniversalInboxItem.prototype.handleMouseClick=function(e) {
this.hoverState(false);
if(this.onclick) {
var o=new Object();
o.type="click";
o.event=this;
this.onclick(o);
}
}
UniversalInboxItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement("DIV");
EventHandler.register(this.i_item, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_item, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_item, "onclick", this.handleMouseClick, this);
this.i_item_name=document.createElement('DIV');
this.i_item_name.className="UniversalInboxItem_name";
this.i_item_name.style.width=(this.width() - UniversalInboxItem.valueWidth)+"px";
this.i_item_name.style.height=(UniversalInboxItem.rowHeight - 1)+"px";
this.i_item_name.style.lineHeight=(UniversalInboxItem.rowHeight - 1)+"px";
this.i_item_name.innerHTML=this.name();
this.i_item.appendChild(this.i_item_name);
this.i_item_value=document.createElement('DIV');
this.i_item_value.className="UniversalInboxItem_value";
this.i_item_value.style.width=UniversalInboxItem.valueWidth+"px";
this.i_item_value.style.height=(UniversalInboxItem.rowHeight - 1)+"px";
this.i_item_value.style.lineHeight=(UniversalInboxItem.rowHeight - 1)+"px";
if(this.value()!=undefined) {
this.value(this.value());
}
this.i_item.appendChild(this.i_item_value);
this.loading(this.loading());
this.updateStyles();
}
return this.i_item;
}
UniversalInboxItem.prototype.updateStyles=function() {
if(this.i_item) {
var strClassName="UniversalInboxItem";
if(parseInt(this.value()) > 0) {
strClassName+=" UniversalInboxItem_highlight";
}
if(this.hoverState() && this.onclick) {
strClassName+=" UniversalInboxItem_hover";
}
if(this.loading()) {
strClassName+=" UniversalInboxItem_loading";
}
this.i_item.className=strClassName;
}
}
JavaScriptResource.notifyComplete("./src/Applications/MyDay/components/Component.UniversalInbox.js");
function SimpleNotificationDataModel(myDayApp) {
this.superDataModelNode("root");
this.myDay=myDayApp;
EventHandler.register(this, "ongetitems", this.handleGetItems, this);
EventHandler.register(this, "onrefresh", this.handleDataRefresh, this);
}
SimpleNotificationDataModel.refreshRate=5;
SimpleNotificationDataModel.prototype.refreshRequest=function() {
var request;
if(!this.i_req) {
this.ignoreRefresh(true);
this.clear();
var dn=new DataNode("params");
dn.addNode(new DataNode("userId", user_prefs['user_id']));
request=new RequestObject("MyDay", "getSimpleNotifications", dn);
EventHandler.register(request, "oncomplete", this.handleSimpleNotificationList, this);
this.i_req=true;
}
return request;
}
SimpleNotificationDataModel.prototype.refresh=function() {
var request=this.refreshRequest();
if(request) {
request.execute();
}
}
SimpleNotificationDataModel.prototype.getUserItems=function(start, length, sortParam, sortOrder, viewId) {
var set=this.getItems(start, length, sortParam, sortOrder, viewId);
var old_source=set.source();
var new_source=[];
for(var i=0; i < old_source.length; i++) {
if(old_source[i].type()==1) {
new_source.push(old_source[i]);
}
}
return new EntrySet(new_source, undefined, set.start(), set.length());
}
SimpleNotificationDataModel.prototype.getSystemItems=function(start, length, sortParam, sortOrder, viewId) {
var set=this.getItems(start, length, sortParam, sortOrder, viewId);
var old_source=set.source();
var new_source=[];
for(var i=0; i < old_source.length; i++) {
if(old_source[i].type()==0) {
new_source.push(old_source[i]);
}
}
return new EntrySet(new_source, undefined, set.start(), set.length());
}
SimpleNotificationDataModel.prototype.handleGetItems=function(e) {
if(!this.i_init) {
e.cancel=true;
this.refresh();
}
}
SimpleNotificationDataModel.prototype.handleSimpleNotificationList=function(e) {
this.ignoreRefresh(true);
var data=e.response.data();
var notifications=data.xPath("SimpleEventNotification");
var dismiss_old=false;
for(var x=0; x < notifications.length; x++) {
var nt_id=notifications[x].children("NotificationId", 0, true);
var nt_content=notifications[x].children("Content", 0, true);
var nt_type=notifications[x].children("NotificationType", 0, true);
var nt_date=notifications[x].children("InsertDate", 0, true);
var myItem;
var i_note_date=iCaltoDate(nt_date);
if(nt_type==0 || i_note_date >=this.getCutoffDate()) {
myItem=this.addItem(new SimpleNotificationEntry(nt_id, nt_content, nt_type, nt_date));
} else if(nt_type==1) {
dismiss_old=true;
}
}
this.i_req=false;
this.i_init=true;
this.ignoreRefresh(false, true);
if(dismiss_old) {
this.dismissOld();
}
}
SimpleNotificationDataModel.prototype.DismissAll=function () {
var params=new DataNode("params");
params.addNode(new DataNode("userId", user_prefs['user_id']));
var request=new RequestObject("MyDay", "clearAllUserNotifications", params);
EventHandler.register(request, "oncomplete", this.handleDismissAllComplete, this);
request.execute();
}
SimpleNotificationDataModel.prototype.handleDismissAllComplete=function(e) {
var data=e.response.data();
this.ignoreRefresh(true);
var items=this.getItems(0, 1000);
var entries=items.length();
for (var x=0; x < entries; x++) {
var i=items.getItem(x);
if (i.type()==1){
this.removeItem(i);
}
}
this.ignoreRefresh(false);
}
SimpleNotificationDataModel.prototype.getCutoffDate=function () {
this.i_auto_delete_notifications=this.myDay.param("auto_delete_notifications");
if (this.i_auto_delete_notifications==undefined) {
this.i_auto_delete_notifications=this.myDay.default_auto_delete_notifications;
}
var cutoff_date=new Date();
cutoff_date.setDate(cutoff_date.getDate() - this.i_auto_delete_notifications);
cutoff_date=floorDay(cutoff_date);
return cutoff_date;
}
SimpleNotificationDataModel.prototype.dismissOld=function () {
var params=new DataNode("params");
params.addNode(new DataNode("userId", user_prefs['user_id']));
params.addNode(new DataNode("beforeDate", dateToUTCICal(this.getCutoffDate())));
var request=new RequestObject("MyDay", "clearUserNotificationsBeforeDate", params);
EventHandler.register(request, "oncomplete", this.handleDismissOldComplete, this);
request.execute();
}
SimpleNotificationDataModel.prototype.handleDismissOldComplete=function(e) {
this.ignoreRefresh(true);
var items=this.getItems(0, 1000);
for(var i=0; i < items.length(); i++) {
var item=items.getItem(i);
date=iCaltoDate(item.date());
if(item.type()!=0 && date.valueOf() < this.getCutoffDate().valueOf()) {
this.removeItem(item);
}
}
this.ignoreRefresh(false);
}
SimpleNotificationDataModel.inherit(DataModelNode);
function SimpleNotificationEntry(id, content, type, date) {
this.superDataModelNode(id);
this.i_ev_type="simple_notification";
this.i_dm_params['pm_id']=id;
this.i_dm_params['pm_content']=content;
this.i_dm_params['pm_type']=type;
this.i_dm_params['pm_date']=date;
}
SimpleNotificationEntry.prototype.content=function(content) {
if (content!=undefined) {
this.i_dm_params['pm_content']=content;
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.item=this;
this.onchange(o);
}
}
return this.i_dm_params['pm_content'];
}
SimpleNotificationEntry.prototype.type=function(type) {
if (type!=undefined) {
this.i_dm_params['pm_type']=type;
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.item=this;
this.onchange(o);
}
}
return this.i_dm_params['pm_type'];
}
SimpleNotificationEntry.prototype.date=function(date) {
if (date!=undefined) {
this.i_dm_params['pm_date']=date;
if (this.onchange!=undefined) {
var o=new Object();
o.date="change";
o.item=this;
this.onchange(o);
}
}
return this.i_dm_params['pm_date'];
}
SimpleNotificationEntry.prototype.Dismiss=function () {
var params=new DataNode("params");
params.addNode(new DataNode("userId", user_prefs['user_id']));
params.addNode(new DataNode("notificationId", this.i_dm_params['pm_id']));
var request=new RequestObject("MyDay", "clearUserNotification", params);
EventHandler.register(request, "oncomplete", this.handleDismissComplete, this);
request.execute();
}
SimpleNotificationEntry.prototype.handleDismissComplete=function(e) {
var data=e.response.data();
this.parentDataModel().removeItem(this);
}
SimpleNotificationEntry.inherit(DataModelNode);
JavaScriptResource.notifyComplete("./src/Applications/MyDay/DataModels/DataModel.Notifications.js");	
function SpecialEventNotificationDataModel(myDayApp) {
this.myDay=myDayApp;
this.superDataModelNode("root");
this.i_cache_extra_sort=new Object();
this.i_start_date=undefined;
this.i_end_date=undefined;
this.i_start_days=undefined;
EventHandler.register(this, "onadd", this.handleAdd, this);
EventHandler.register(this, "ongetitems", this.handleGetItems, this);
EventHandler.register(this, "onrefresh", this.handleDataRefresh, this);
}
SpecialEventNotificationDataModel.refreshRate=5;
SpecialEventNotificationDataModel.prototype.refreshRequest=function() {
var request;
if(!this.i_req) {
this.ignoreRefresh(true);
this.clear();
var dn=new DataNode("params");
var today=new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
this.i_start_days=parseInt((this.myDay.param("display_range_special")!=undefined ? this.myDay.param("display_range_special"): this.myDay.default_display_range_special));
this.i_start_date=addDays(today, - (this.i_start_days));
this.i_end_date=addDays(today, 14);
var startDate=dateToUTCICal(this.i_start_date);
var endDate=dateToUTCICal(this.i_end_date);
dn.addNode(new DataNode("method", "getSpecialNotifications"));
dn.addNode(new DataNode("userId", user_prefs['user_id']));
dn.addNode(new DataNode("ownerId", user_prefs['user_id']));
dn.addNode(new DataNode("startDate",  startDate));
dn.addNode(new DataNode("endDate",  endDate));
request=new RequestObject("MyDay", "getSpecialNotifications", dn);
EventHandler.register(request, "oncomplete", this.handleSpecialEventNotificationList, this);
this.i_req=true;
}
return request;
}
SpecialEventNotificationDataModel.prototype.refresh=function() {
var request=this.refreshRequest();
if(request) {
request.execute();
}
}
SpecialEventNotificationDataModel.prototype.handleGetItems=function(e) {
if(!this.i_init) {
e.cancel=true;
this.refresh();
}
}
SpecialEventNotificationDataModel.prototype.handleAdd=function(e) {
e.item.i_parent_dm=this;
}
SpecialEventNotificationDataModel.prototype.handleDataRefresh=function(e) {
this.i_cache_extra_sort=Array();
}
SpecialEventNotificationDataModel.prototype.DismissAll=function () {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "getSpecialNotifications"));
dn.addNode(new DataNode("userId", user_prefs['user_id']));
dn.addNode(new DataNode("ownerId", user_prefs['user_id']));
var today=floorDay(new Date());
dn.addNode(new DataNode("startDate", dateToUTCICal(this.i_start_date)));
dn.addNode(new DataNode("endDate", dateToUTCICal(this.i_end_date)));
var request=new RequestObject("MyDay", "dismissAllSpecialNotifications", dn);
EventHandler.register(request, "oncomplete", this.handleDismissAllComplete, this);
request.execute();
}
SpecialEventNotificationDataModel.prototype.handleDismissAllComplete=function(e) {
var data=e.response.data();
if (true){
this.clear();
}	
}
SpecialEventNotificationDataModel.prototype.handleSpecialEventNotificationList=function(e) {
this.ignoreRefresh(true);
var data=e.response.data();
var notifications=data.xPath("SpecialEventNotification");
for(var x=0; x < notifications.length; x++) {
var nt_eventid=notifications[x].children("EventId", 0, true);
var nt_eventtype=notifications[x].children("EventType", 0, true);
var nt_startdate=notifications[x].children("startDate", 0, true);
var nt_remindmeondate=notifications[x].children("RemindMeOnDate", 0, true);
var nt_remindmedays=parseInt(notifications[x].children("RemindMeDays", 0, true));
var nt_content=notifications[x].children("Content", 0, true);
var checkStartDate=iCaltoDate(nt_startdate);
if (checkStartDate >=this.i_start_date && checkStartDate <=this.i_end_date) {
this.addItem(new SpecialEventNotificationEntry(nt_eventid, nt_eventtype, nt_startdate, nt_remindmeondate, nt_remindmedays, nt_content));
}
}
this.i_req=false;
this.i_init=true;
this.ignoreRefresh(false, true);	
}
SpecialEventNotificationDataModel.prototype.getItems_real=DataModelNode.prototype.getItems;
SpecialEventNotificationDataModel.prototype.getItems=function(start, length, sortParam, sortOrder, viewId) {
if (sortParam==undefined || sortOrder==undefined) {
var dat=this.getItems_real(start, length, undefined, undefined, viewId);
return dat;
}
if (this.i_cache_extra_sort[sortParam+":"+sortOrder+":"+viewId]!=undefined) {
var e=this.i_cache_extra_sort[sortParam+":"+sortOrder+":"+viewId];
return new EntrySet(e, undefined, start, (e.length > length ? length : e.length));
}
var dat=this.getItems_real(0, this.entries(), undefined, undefined, viewId);
var rarray=Array();
var datl=dat.length();
for (var x=0; x < datl; x++) {
rarray[x]=dat.getItem(x);
}
var lowI=0;
var lowV;
var sortTag='pm_'+sortParam;
for (var x=0; x < datl; x++) {
lowI=x;
lowV=rarray[x].i_dm_params[sortTag];
if (lowV!=undefined && lowV.toLowerCase!=undefined) {
lowV=lowV.toLowerCase();
}
for (var q=x; q < datl; q++) {
var curV=rarray[q].i_dm_params[sortTag];
if (curV!=undefined && curV.toLowerCase!=undefined) {
curV=curV.toLowerCase();
}
if (curV < lowV) {
lowI=q;
lowV=curV;
}
}
if (lowI!=x) {
var v=rarray[x];
rarray[x]=rarray[lowI];
rarray[lowI]=v;
}
}
if (sortOrder=="desc") {
rarray=rarray.reverse();
}
this.i_cache_extra_sort[sortParam+":"+sortOrder+":"+viewId]=rarray;
return this.getItems(start, length, sortParam, sortOrder, viewId);
}
SpecialEventNotificationDataModel.prototype.addItemIfInRange=function(entry) {
var date_today=floorDay(new Date());
var start_date=addDays(date_today, -this.i_start_days);
var end_date=addDays(date_today, 14);
var years_to_check=[start_date.getFullYear()];
if (end_date.getFullYear()!=start_date.getFullYear()) {
years_to_check.push(end_date.getFullYear());
}
var i=0;
var added=false;
var entry_date=entry.startDate();
while (i < years_to_check.length && !added) {
entry_date.setFullYear(years_to_check[i]);
if (start_date <=entry_date && entry_date <=end_date) {
entry.startDate(entry_date);
this.addItem(entry);
added=true;
}++i;
}
return added;
}
SpecialEventNotificationDataModel.prototype.removeItemById=function(id) {
var removed=false;
var found_item=this.getItemById(id);
if (found_item!=undefined) {
this.ignoreRefresh(true);
this.removeItem(found_item);
removed=true;
this.ignoreRefresh(false);
}
return removed;
}
SpecialEventNotificationDataModel.prototype.findByContent=function(content, eventtype, dateStart, dateEnd) {
var results=[],
items=this.getItems().source();
for (var i=0; i < items.length;++i) {
if (items[i].param('content')==content) {
if (eventtype!=undefined && items[i].param('eventtype')!=eventtype) continue;
if (dateStart!=undefined || dateEnd!=undefined) {
var start=(dateStart ? dateStart.valueOf() : -Infinity),
end=(dateEnd ? dateEnd.valueOf() : Infinity),
date=items[i].param('startdate');
if (date==undefined || date.valueOf() < start || date.valueOf() > end) continue;
}
results[results.length]=items[i];
}
}
return results;
}
SpecialEventNotificationDataModel.inherit(DataModelNode);
function SpecialEventNotificationEntry(eventid, eventtype, startdate, remindmeondate, remindmedays, content) {
this.superDataModelNode(eventid);
this.i_dm_params['pm_id']=eventid;
this.i_dm_params['pm_eventid']=eventid;
this.i_dm_params['pm_eventtype']=eventtype;
this.i_dm_params['pm_startdate']=(startdate!=undefined ? startdate : "");
this.i_dm_params['pm_remindmeondate']=(remindmeondate!=undefined ? remindmeondate : "");
this.i_dm_params['pm_remindmedays']=(remindmedays!=undefined ? remindmedays : "");
this.i_dm_params['pm_content']=(content!=undefined ? content : "");
}
SpecialEventNotificationEntry.factory=function(eventid, eventtype, startdate, remindmeondate, remindmedays, content) {
return (new SpecialEventNotificationEntry(eventid, eventtype, startdate, remindmeondate, remindmedays, content));
}
SpecialEventNotificationEntry.prototype.eventId=function(eid) {
if (eid!=undefined) {
this.i_dm_params['pm_eventid']=eid;
}
return this.i_dm_params['pm_eventid'];
}
SpecialEventNotificationEntry.prototype.eventType=function(type) {
if (type!=undefined) {
this.i_dm_params['pm_eventtype']=type;
}
return this.i_dm_params['pm_eventtype'];
}
SpecialEventNotificationEntry.prototype.iCalstartDate=function(icsd) {
if (icsd!=undefined) {
this.i_dm_params['pm_startdate']=icsd;
}
return this.i_dm_params['pm_startdate'];
}
SpecialEventNotificationEntry.prototype.startDate=function(sd) {
if (sd!=undefined) {
this.i_dm_params['pm_startdate']=dateToUTCICal(sd);
return sd;
} else {
return iCaltoUTCDate(this.i_dm_params['pm_startdate']);
}
}
SpecialEventNotificationEntry.prototype.remindMeOnDate=function(rmod) {
if (rmod!=undefined) {
this.i_dm_params['pm_remindmeondate']=rmod;
}
return this.i_dm_params['pm_remindmeondate'];
}
SpecialEventNotificationEntry.prototype.remindMeDays=function(rmd) {
if (rmd!=undefined) {
this.i_dm_params['pm_remindmedays']=rmd;
}
return this.i_dm_params['pm_remindmedays'];
}
SpecialEventNotificationEntry.prototype.content=function(c) {
if (c!=undefined) {
this.i_dm_params['pm_content']=c;
}
return this.i_dm_params['pm_content'];
}
SpecialEventNotificationEntry.prototype.calculateReminder=function() {
if (this.i_dm_params['pm_startdate']==undefined) {
return false;
} else {
var date_today=floorDay(new Date());
var daysUntil=getDayDiff(this.startDate(), date_today)
if (daysUntil > 7) {
this.i_dm_params['pm_remindmedays']=7;
} else if (daysUntil > 3) {
this.i_dm_params['pm_remindmedays']=3;
} else {
this.i_dm_params['pm_remindmedays']=0;
}
this.i_dm_params['pm_remindmeondate']=addDays(this.startDate(), -this.i_dm_params['pm_remindmedays']);
return true;
}
}
SpecialEventNotificationEntry.prototype.generateContent=function(event_name) {
this.i_dm_params['pm_content']=event_name;
var date_today=floorDay(new Date());
var days_until=getDayDiff(floorDay(this.startDate()), date_today);
switch (days_until) {
case 0:
this.i_dm_params['pm_content']+=' is today.';
break;
case 1:
this.i_dm_params['pm_content']+=' is tomorrow, on '+getNumericDateString(this.startDate())+'.';
break;
case -1:
this.i_dm_params['pm_content']+=' was yesterday, on '+getNumericDateString(this.startDate())+'.';
break;
default:
if (days_until > 0) {
this.i_dm_params['pm_content']+=' is in '+days_until+' days, on '+getNumericDateString(this.startDate())+'.';
} else {
this.i_dm_params['pm_content']+=' was on '+getNumericDateString(this.startDate())+'.';
}
}
}
SpecialEventNotificationEntry.prototype.dismiss=function () {
var params=new DataNode("params");
params.addNode(new DataNode("objectId", this.eventId()));
params.addNode(new DataNode("userId", user_prefs['user_id']));
params.addNode(new DataNode("occurrenceDate", dateToUTCICal(this.startDate())));
params.addNode(new DataNode("type", this.eventType()));
var request=new RequestObject("MyDay", "dismissSpecialNotification", params);
EventHandler.register(request, "oncomplete", this.handleDismissComplete, this);
request.execute();
}
SpecialEventNotificationEntry.prototype.handleDismissComplete=function(e) {
var data=e.response.data();
if (true) {
this.parentDataModel().removeItem(this);			
}		
}
SpecialEventNotificationEntry.prototype.remindMeLater=function () {
if (this.remindMeDays()!=undefined) {
var event_date=new Date(this.startDate());
var remindOnDate=dateToUTCICal(addDays(event_date, (0 - this.remindMeDays())));
var params=new DataNode("params");
params.addNode(new DataNode("objectId", this.eventId()));
params.addNode(new DataNode("userId", user_prefs['user_id']));
params.addNode(new DataNode("ownerId", user_prefs['user_id']));
params.addNode(new DataNode("RemindOnDate", remindOnDate));
params.addNode(new DataNode("type", this.eventType()));
var request=new RequestObject("MyDay", "remindMeLater", params);
EventHandler.register(request, "oncomplete", this.handleRemindMeLater, this);
request.execute();
}
}
SpecialEventNotificationEntry.prototype.handleRemindMeLater=function(e) {
var data=e.response.data();
if (true) {
this.parentDataModel().removeItem(this);
}		
}
SpecialEventNotificationEntry.inherit(DataModelNode);
JavaScriptResource.notifyComplete("./src/Applications/MyDay/DataModels/DataModel.SpecialEventNotifications.js");	
JavaScriptResource.notifyComplete("./btAppMyDayCore.js");
