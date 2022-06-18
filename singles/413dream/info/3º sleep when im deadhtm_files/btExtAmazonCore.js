function ExtensionAmazon() {
this.superApplication();
this.id(3008);
this.name("Amazon");
this.i_holidays=Object();
this.i_holidays_new=Object();
this.i_calendar_interface=Object();
this.i_a_store_window=undefined;
this.i_files={
"initialize" : ["./Extension.AmazonFTD.css"]
}
EventHandler.register(this, "oninitialize", this.handleInitialize, this);
EventHandler.register(this, "onintegrate", this.handleIntegrate, this);
}
ExtensionAmazon.BT_AMAZON_URL="http://astore.amazon.com/bluetie-20";
ExtensionAmazon.prototype.handleInitialize=function() {
if(!SystemCore.hasApp(3009)) {
this.loadFiles("initialize", new SmartHandler(this, this.handleInitialize));
}
if(this.i_has_calendar==undefined) {
this.i_has_calendar=SystemCore.hasApp(1004);
this.i_has_feature=SystemCore.hasApp(3008);
}
if(this.i_has_calendar && this.i_has_feature) {
this.i_calendar_interface=new AmazonCalendarInterface(this);
this.i_calendar_interface.initialize();
}
this.getHolidays();
}
ExtensionAmazon.prototype.handleIntegrate=function(e) {
var myday=Application.getApplicationById(1020);
if (myday!=undefined) {
var se_notification_list=myday.getSpecialEventNotifications();
EventHandler.register(se_notification_list, "ongetitem", this.addAmazonLinks, this);
}
}
ExtensionAmazon.prototype.handleContactsLinkClick=function(e) {
this.log(501, "<linkURL>"+ExtensionAmazon.BT_AMAZON_URL+"</linkURL><sourceApp>Contacts</sourceApp>");
if(this.i_a_store_window==undefined) {
this.i_a_store_window=new AStoreWindow();
}
this.i_a_store_window.open();
}
ExtensionAmazon.prototype.handleCalendarLinkClick=function(e) {
this.log(501, "<linkURL>"+ExtensionAmazon.BT_AMAZON_URL+"</linkURL><sourceApp>Calendar</sourceApp>");
if(this.i_a_store_window==undefined) {
this.i_a_store_window=new AStoreWindow();
}
this.i_a_store_window.open();
}
ExtensionAmazon.prototype.handleMyDayLinkClick=function(e) {
this.log(501, "<linkURL>"+ExtensionAmazon.BT_AMAZON_URL+"</linkURL><sourceApp>MyDay</sourceApp>");
if(this.i_a_store_window==undefined) {
this.i_a_store_window=new AStoreWindow();
}
this.i_a_store_window.open();
}
ExtensionAmazon.prototype.addAmazonLinks=function(e) {
if (!((e.dataItem.eventType()==5) && (this.i_holidays[e.dataItem.eventId()]==undefined))) {
if (e.domItem.childNodes.length < 5) { 
var amazonDiv=document.createElement('div');
amazonDiv.className='AmazonFTD_link_area';
e.domItem.insertBefore(amazonDiv, e.domItem.childNodes[3]);
} else {
var amazonDiv=e.domItem.childNodes[3];
}
var amazonLink=document.createElement('a');
amazonLink.className='AmazonFTD_link';
amazonLink.href='#';
amazonLink.innerHTML='Order a Gift';
EventHandler.register(amazonLink, "onclick", this.handleMyDayLinkClick, this);
amazonDiv.appendChild(amazonLink);
}
}
ExtensionAmazon.prototype.getHolidays=function() {
var dn=new DataNode("params");
var today=new Date();
dn.addNode(new DataNode("startDate", dateToICal(addYears(today, -1))));
dn.addNode(new DataNode("endDate", dateToICal(addYears(today, 1))));
var r=new RequestObject("FtAmazonFTD", "GetGiftHolidays", dn);
EventHandler.register(r, "oncomplete", this.handleHolidayList, this);
APIManager.addQueue(r);
}
ExtensionAmazon.prototype.handleHolidayList=function(e) {
var data=e.response.data();
var holiday_ids=data.xPath("holidays");
var l=holiday_ids.length;
for (var i=0; i < l;++i) {
this.i_holidays[holiday_ids[i].value()]=true;
}
}
ExtensionAmazon.prototype.getHolidayList=function() {
return this.i_holidays
}
ExtensionAmazon.prototype.log=function(code, data) {
var post=new ResourcePost();
post.param("unm", user_prefs['user_name']);
post.param("sid", user_prefs['session_id']);
post.param("xml", "<request><method>checksession</method><opcode>"+code+"</opcode><userId>"+user_prefs['user_id']+"</userId><details>"+htmlEncode(data)+"</details></request>");
ResourceManager.request("/cgi-bin/phoenix/OpLogCGI.fcg", 1, undefined, post);
}
function AmazonCalendarInterface(app) {
this.i_app=app;
}
AmazonCalendarInterface.prototype.initialize=function() {
this.i_calendar=Application.getApplicationById(1004);
EventHandler.register(MonthViewEvent, "onsettip", this.handleSetTip, this);
EventHandler.register(MonthViewEvent, "onextcontext", this.handleExtContext, this);
this.i_initialized=true;
}
AmazonCalendarInterface.prototype.handleSetTip=function(e) {
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
AmazonCalendarInterface.prototype.handleExtContext=function(e) {
if (e!=undefined) {
var iEvContext=e.event.iExtContextMenu;
if (e.event.sendGiftAdded==undefined) {
if (!((e.event.eventType()==5) && (this.i_app.getHolidayList()[e.event.id()]==undefined))){
iEvContext_send=iEvContext.addItem(new ContextMenuIconItem("Send Gift"));
e.event.sendGiftAdded=true;
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
ExtensionAmazon.inherit(Application);
SystemCore.registerApplication(new ExtensionAmazon());
JavaScriptResource.notifyComplete("./src/Extensions/Amazon/Extension.Amazon.js");
function AStoreWindow() {
this.i_width=850;
this.i_height=580;
this.superConstructor("store_window", "Amazon Store",
this.i_width, this.i_height, Application.titleBarFactory());
this.titleBar().removeButton(Application.i_title_dock);
}
AStoreWindow.prototype.open=function() {
if(this.visible()) {
this.bringToFront();
} else {
this.popWindow(this.i_width, this.i_height, true);
}
this.global(true);
}
AStoreWindow.prototype.onshow=function() {
this.url(ExtensionAmazon.BT_AMAZON_URL, true);
}
inherit(WindowObject, AStoreWindow);
JavaScriptResource.notifyComplete("./src/Extensions/Amazon/components/Component.AStoreWindow.js");JavaScriptResource.notifyComplete("./btExtAmazonCore.js");
