function ExtensionFTD() {
this.superApplication();
this.id(3009);
this.name("FTD");
this.i_holidays=Object();
this.i_holidays_new=Object();
this.i_calendar_interface=Object();
this.i_files={
"initialize" : ["./Extension.AmazonFTD.css"]
}
if (window.XMLHttpRequest) {
this.i_iesix_and_lower=false;
} else {
this.i_iesix_and_lower=true;
}
EventHandler.register(this, "oninitialize", this.handleInitialize, this);
EventHandler.register(this, "onintegrate", this.handleIntegrate, this);
}
ExtensionFTD.BT_FTD_URL="http://www.ftd.com/remindme";
ExtensionFTD.prototype.handleInitialize=function() {
this.loadFiles("initialize", new SmartHandler(this, this.handleInitialize));
if(this.i_has_calendar==undefined) {
this.i_has_calendar=SystemCore.hasApp(1004);
this.i_has_feature=SystemCore.hasApp(3009);
}
if(this.i_has_calendar && this.i_has_feature) {
this.i_calendar_interface=new FTDCalendarInterface(this);
this.i_calendar_interface.initialize();
}
this.getHolidays();
}
ExtensionFTD.prototype.handleIntegrate=function(e) {
var myday=Application.getApplicationById(1020);
if (myday!=undefined) {
var se_notification_list=myday.getSpecialEventNotifications();
EventHandler.register(se_notification_list, "ongetitem", this.addFTDLinks, this);
}
}
ExtensionFTD.prototype.handleContactsLinkClick=function(e) {
this.log(601, "<linkURL>"+ExtensionFTD.BT_FTD_URL+"</linkURL><sourceApp>Contacts</sourceApp>");
if (this.i_iesix_and_lower) {
var newWindow=window.open(ExtensionFTD.BT_FTD_URL, '_blank');
newWindow.focus();
} else {
if(this.i_f_store_window==undefined) {
this.i_f_store_window=new FStoreWindow();
}
this.i_f_store_window.open();
}
}
ExtensionFTD.prototype.handleCalendarLinkClick=function(e) {
this.log(601, "<linkURL>"+ExtensionFTD.BT_FTD_URL+"</linkURL><sourceApp>Calendar</sourceApp>");
if (this.i_iesix_and_lower) {
var newWindow=window.open(ExtensionFTD.BT_FTD_URL, '_blank');
newWindow.focus();
} else {
if(this.i_f_store_window==undefined) {
this.i_f_store_window=new FStoreWindow();
}
this.i_f_store_window.open();
}
}
ExtensionFTD.prototype.handleMyDayLinkClick=function(e) {
this.log(601, "<linkURL>"+ExtensionFTD.BT_FTD_URL+"</linkURL><sourceApp>MyDay</sourceApp>");
if (this.i_iesix_and_lower) {
var newWindow=window.open(ExtensionFTD.BT_FTD_URL, '_blank');
newWindow.focus();
} else {
if(this.i_f_store_window==undefined) {
this.i_f_store_window=new FStoreWindow();
}
this.i_f_store_window.open();
}
}
ExtensionFTD.prototype.addFTDLinks=function(e) {
if (!((e.dataItem.eventType()==5) && (this.i_holidays[e.dataItem.eventId()]==undefined))) {
if (e.domItem.childNodes.length < 5) { 
var ftdDiv=document.createElement('div');
ftdDiv.className='AmazonFTD_link_area';
e.domItem.insertBefore(ftdDiv, e.domItem.childNodes[3]);
} else {
var ftdDiv=e.domItem.childNodes[3];
}
var ftdLink=document.createElement('a');
ftdLink.className='AmazonFTD_link';
ftdLink.href='#';
ftdLink.innerHTML='Send Flowers';
EventHandler.register(ftdLink, "onclick", this.handleMyDayLinkClick, this);
ftdDiv.appendChild(ftdLink);
}
}
ExtensionFTD.prototype.getHolidays=function() {
var dn=new DataNode("params");
var today=new Date();
dn.addNode(new DataNode("startDate", dateToICal(addYears(today, -1))));
dn.addNode(new DataNode("endDate", dateToICal(addYears(today, 1))));
var r=new RequestObject("FtAmazonFTD", "GetFlowerHolidays", dn);
EventHandler.register(r, "oncomplete", this.handleHolidayList, this);
APIManager.addQueue(r);
}
ExtensionFTD.prototype.handleHolidayList=function(e) {
var data=e.response.data();
var holiday_ids=data.xPath("holidays");
var l=holiday_ids.length;
for (var i=0; i < l;++i) {
this.i_holidays[holiday_ids[i].value()]=true;
}
}
ExtensionFTD.prototype.getHolidayList=function() {
return this.i_holidays
}
ExtensionFTD.prototype.log=function(code, data) {
var post=new ResourcePost();
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request><method>checksession</method><opcode>"+code+"</opcode><userId>"+user_prefs['user_id']+"</userId><details>"+htmlEncode(data)+"</details></request>");
ResourceManager.request("/cgi-bin/phoenix/OpLogCGI.fcg", 1, undefined, post);
}
function FTDCalendarInterface(app) {
this.i_app=app;
}
FTDCalendarInterface.prototype.initialize=function() {
this.i_calendar=Application.getApplicationById(1004);
EventHandler.register(MonthViewEvent, "onsettip", this.handleSetTip, this);
EventHandler.register(MonthViewEvent, "onextcontext", this.handleExtContext, this);
this.i_initialized=true;
}
FTDCalendarInterface.prototype.handleSetTip=function(e) {
if (e.rightClickForMoreOptions){
return e;
}
var rightClickForMore="<br>(Right-click for options)";
switch (e.event.eventType()) {
case '2': 
e.text+=rightClickForMore;
e.rightClickForMoreOptions=1;
break;
case '3': 
e.text+=rightClickForMore;
e.rightClickForMoreOptions=1;
break;
case '5': 
if (!(this.i_app.getHolidayList()[e.event.id()]==undefined)) {
e.text+=rightClickForMore;
e.rightClickForMoreOptions=1;
}
break;
default:
break;
}
return e;
}
FTDCalendarInterface.prototype.handleExtContext=function(e) {
if (e!=undefined) {
var iEvContext=e.event.iExtContextMenu;
if (e.event.sendFlowersAdded==undefined) {
if (!((e.event.eventType()==5) && (this.i_app.getHolidayList()[e.event.id()]==undefined))){
iEvContext_send=iEvContext.addItem(new ContextMenuIconItem("Send Flowers"));
e.event.sendFlowersAdded=true;
if (iEvContext_send!=undefined) {
EventHandler.register(iEvContext_send, "onclick", this.i_app.handleCalendarLinkClick, this.i_app);
}
} else {
return;
}
}
iEvContext.title(e.event.title());
iEvContext.show();
}
}
ExtensionFTD.inherit(Application);
SystemCore.registerApplication(new ExtensionFTD());
JavaScriptResource.notifyComplete("./src/Extensions/FTD/Extension.FTD.js");
function FStoreWindow() {
this.i_width=850;
this.i_height=580;
this.superConstructor("store_window", "FTD Store",
this.i_width, this.i_height, Application.titleBarFactory());
this.titleBar().removeButton(Application.i_title_dock);
}
FStoreWindow.prototype.open=function() {
if(this.visible()) {
this.bringToFront();
} else {
this.popWindow(this.i_width, this.i_height, true);
}
this.global(true);
}
FStoreWindow.prototype.onshow=function() {
this.url(ExtensionFTD.BT_FTD_URL, true);
}
inherit(WindowObject, FStoreWindow);
JavaScriptResource.notifyComplete("./src/Extensions/FTD/components/Component.FStoreWindow.js");JavaScriptResource.notifyComplete("./btExtFTDCore.js");
