PopoutWindow.registerGroup("ApplicationCalendar",["ApplicationCalendar",
"EventDisplay",
"CalendarEvent",
"CalendarMonth",
"CalendarDataModel",
"CalendarColorClass",
"CalendarDisplay",
"Recurrence"]);
PopoutWindow.registerFiles("ApplicationCalendar", ["./btAppCalendarCore.js",
"./btAppOContactsCore.js"]);
function ApplicationCalendar() {
this.superApplication();
this.id(1004);	
this.name("Calendar");
this.smallIcon("ApplicationCalendar_small");	
this.largeIcon("ApplicationCalendar");		
this.loadingOrder(5);
this.registerPreference("./btAppCalendarPreferences.js");
EventHandler.register(this, "oninitialize", this.handleInitialize, this);
EventHandler.register(this, "onintegrate", this.handleIntegration, this);
EventHandler.register(this, "onload", this.handleLoad, this);
EventHandler.register(this, "onpoll", this.handlePoll, this);
this.i_use_tabs=true;
}
ApplicationCalendar.prototype.handleInitialize=function(e) {
this.i_win_scheduler=new WindowObject('cal-sch', "Scheduler", 100, 100, Application.titleBarFactory());
this.i_win_scheduler.titleBar().removeButton(Application.i_title_close);
this.i_win_quick=new WindowObject('cal-quick', "Quick Add", 100, 100, Application.titleBarFactory());
this.i_win_quick.titleBar().removeButton(Application.i_title_close);
this.i_win_calendar=new WindowObject('cal-view', "Calendar", 100, 100, Application.titleBarFactory());
this.i_win_calendar.titleBar().removeButton(Application.i_title_close);
this.i_nav_button=SystemCore.navigationBar().addButton(new NavigationButton(this.id(), this.name(), this.largeIcon(), this.smallIcon()));
EventHandler.register(this.i_nav_button, "onclick", this.launchApplication, this);
CalendarColorClass.addColor(new CalendarColorClass(0, "#888888", "#FFFFFF", "#FFFFFF", "#222222"));
CalendarColorClass.addColor(new CalendarColorClass(1, "#dc143c", "#df617a", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(2, "#fa8072", "#f6a9a0", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(3, "#ffd700", "#f6dc54", "#996633", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(4, "#9cdc12", "#b7df60", "#6a6a6a", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(5, "#007fff", "#54a4f6", "#FFFFFF", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(6, "#464646", "#7d7d7d", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(7, "#800000", "#a15050", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(8, "#cc6633", "#d69675", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(9, "#daa520", "#debc68", "#FFFFFF", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(10, "#228b22", "#67aa67", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(11, "#d2b48c", "#dcc9b0", "#FFFFFF", "#996600"));
CalendarColorClass.addColor(new CalendarColorClass(12, "#4b0082", "#8050a2", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(13, "#ff7f50", "#f9a78a", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(14, "#666600", "#90904f", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(15, "#339966", "#73b393", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(16, "#6b89a7", "#99acbf", "#FFFFFF", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(17, "#f5deb3", "#f6e7cc", "#996600", "#996600"));
CalendarColorClass.addColor(new CalendarColorClass(18, "#843179", "#a6719f", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(19, "#996699", "#b595b5", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(20, "#008080", "#50a1a1", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(21, "#66cc99", "#97d7b6", "#006666", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(22, "#333366", "#727292", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(23, "#f5f5dc", "#f7f7e7", "#999966", "#333300"));
CalendarColorClass.addColor(new CalendarColorClass(24, "#990066", "#b25192", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(25, "#c72163", "#d26891", "#FFFFFF", "#FFFFFF"));
CalendarColorClass.addColor(new CalendarColorClass(26, "#ffcc99", "#fbdaba", "#cc6633", "#cc6633"));
CalendarColorClass.addColor(new CalendarColorClass(27, "#66cccc", "#97d7d7", "#006666", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(28, "#9999cc", "#b9b9d9", "#FFFFFF", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(29, "#cccc99", "#d9d9b9", "#333300", "#333333"));
CalendarColorClass.addColor(new CalendarColorClass(30, "#9ecde0", "#bddbe7", "#003366", "#003366"));
CalendarColorClass.addColor(new CalendarColorClass(31, "#8e6e0d", "#ab9659", "#FFFFFF", "#FFFFFF"));
this.i_shortcut_new_event=SystemCore.shortcutPane().addShortcut(new ShortcutLink("New Event", "CalendarView_icon_new_event"));
EventHandler.register(this.i_shortcut_new_event, "onclick", this.handleShortcutEvent, this);
this.i_shortcut_quick_event=SystemCore.shortcutPane().addShortcut(new ShortcutLink("Quick Event", "CalendarShare_add_icon"));
EventHandler.register(this.i_shortcut_quick_event, "onclick", this.handleShortcutQuickAdd, this);
EventHandler.register(this.getMeetingRequestDataModel(), "onrefresh", this.handleMeetingRequestRefresh, this);
this.getReminderDataModel().refreshList();
this.getMeetingRequestDataModel().refresh();
this.getCalendarListDataModel().getItems(0, 0);
this.getReminderDataModel().forceRefresh();
this.checkReminders();
}
ApplicationCalendar.prototype.handleIntegration=function(e) {
if(SystemCore.hasApp(1020)) {
var my_day=Application.getApplicationById(1020);
my_day.getUniversalInbox().addItem(this.getUniversalInboxItem());
}
}
ApplicationCalendar.prototype.handleLoad=function(e) {
this.i_nav_button.selectedState(true);
if (e.first==true) {
this.i_win_quick.loadContent(this.getQuickAdd().getQuickAdd());
this.i_win_quick.minimumHeight(60);
EventHandler.register(this.i_win_quick, "oncontentresize", this.handleQuickAddResize, this);
this.i_win_scheduler.loadContent(this.getScheduler().getScheduler());
this.i_win_scheduler.minimumWidth(170);
this.i_win_scheduler.minimumHeight(300);
this.i_win_scheduler.contentPane().style.backgroundColor="#AAAAAA";
EventHandler.register(this.i_win_scheduler, "oncontentresize", this.handleSchedulerResize, this);
this.i_win_calendar.loadContent(this.getCalendarView().getCalendar());
this.i_win_calendar.contentPane().style.backgroundColor="#AAAAAA";
EventHandler.register(this.i_win_calendar, "oncontentresize", this.handleCalendarResize, this);
EventHandler.register(this.i_calendar.i_monthly, 'ondisplayview', this.i_scheduler.updateMiniCalendar, this.i_scheduler);
EventHandler.register(this.i_calendar.i_weekly, 'ondisplayview', this.i_scheduler.updateMiniCalendar, this.i_scheduler);
EventHandler.register(this.i_calendar.i_daily, 'ondisplayview', this.i_scheduler.updateMiniCalendar, this.i_scheduler);
EventHandler.register(this.i_scheduler, 'onminicalclick', this.i_calendar.handleMiniCalendarClick, this.i_calendar);
if (this.i_calendar.getCalendarView().activeView()!=undefined) {
this.i_calendar.getCalendarView().activeView().throwDisplayViewEvent();
}
}
this.handleQuickAddResize();
if (this.i_scheduler.i_shares!=undefined) {
var cal_list=this.i_scheduler.i_shares;
if (CalendarDataModel.getDefaultCalendar()==cal_list.i_calendars[0].calendar()) {
if (cal_list.i_calendars[0].handleClick!=undefined) {
cal_list.i_calendars[0].handleClick({});
}
}
}
}
ApplicationCalendar.prototype.handleCalendarResize=function(e) {
if (this.i_calendar!=undefined) {
if (this.i_win_calendar.effectiveWidth()!=undefined) {
this.i_calendar.width(this.i_win_calendar.effectiveWidth() - 3);
}
if (this.i_win_calendar.effectiveHeight()!=undefined) {
this.i_calendar.height(this.i_win_calendar.effectiveHeight() - this.i_win_calendar.titleBar().height() - 5);
}
}
}
ApplicationCalendar.prototype.handlePoll=function(e) {
if(e.minute % MeetingRequestDataModel.refreshRate==0) {
var request=this.getMeetingRequestDataModel().refresh();
if(request) {
APIManager.addQueue(request);
}
}
if(e.minute % CalendarReminderDataModel.refreshRate==0) {
if (this.getReminderDataModel()) {
var request=this.getReminderDataModel().refreshRequest();
if(request) {
APIManager.addQueue(request);
}
}
}
}
ApplicationCalendar.prototype.getCalendarView=function() {
if (this.i_calendar==undefined) {
this.i_calendar=new CalendarDisplay(this, 100, 100, this.i_use_tabs);
}
return this.i_calendar;
}
ApplicationCalendar.prototype.launchMeetingRequests=function() {
this.launchApplication();
this.getCalendarView().loadMeetingRequests();
}
ApplicationCalendar.prototype.handleQuickAddResize=function(e) {
if (this.i_quick_add!=undefined) {
if (this.i_win_quick.effectiveWidth()!=undefined) {
this.i_quick_add.width(this.i_win_quick.effectiveWidth() - (document.all ? 2:4));
}
if (this.i_win_quick.effectiveHeight()!=undefined) {
this.i_quick_add.height(this.i_win_quick.effectiveHeight() - this.i_win_quick.titleBar().height() - 5);
}
}
}
ApplicationCalendar.prototype.handleShortcutQuickAdd=function(e) {
QuickAdd.popWindow();
}
ApplicationCalendar.prototype.handleReminderResize=function(e) {
if (this.i_reminder!=undefined) {
if (this.i_win_reminder.effectiveWidth()!=undefined) {
this.i_reminder.width(this.i_win_reminder.effectiveWidth() - 2);
}
if (this.i_win_reminder.effectiveHeight()!=undefined) {
this.i_reminder.height(this.i_win_reminder.effectiveHeight() - this.i_win_reminder.titleBar().height() - 5);
}
}
}
ApplicationCalendar.prototype.checkReminders=function() {
if (CalendarDataModel.getDefaultCalendar()) {
if ((CalendarDataModel.getDefaultCalendar().defaultReminderType() & 4)==4
&& this.getReminderDataModel().getScheduledReminders(60).length > 0) {
if (!this.i_reminderDisplay || !this.i_reminderDisplay.focus()) {
this.i_reminderDisplay=new PopoutWindow("ReminderDisplay", "reminders");
var popoutSetting=(Application.getApplicationById("GP").param("popout_"+this.i_reminderDisplay.getClassName())=="1");
this.i_reminderDisplay.pop(350, 300, popoutSetting);
}
var popout_object=this.i_reminderDisplay.getPopupObject();
if (popout_object!=undefined) {
popout_object.refreshData();
}
}
}
if (!this.i_reminderCheck_t) {
var selfIvar=this;
this.i_reminderCheck_t=setInterval(function(){ selfIvar.checkReminders(); }, ApplicationCalendar.reminderCheckInterval*1000);
}
}
ApplicationCalendar.reminderCheckInterval=60;
ApplicationCalendar.prototype.getReminderDataModel=function() {
if (this.i_reminder_data_model==undefined) {
this.i_reminder_data_model=CalendarReminderDataModel.getDefaultDataModel();
ApplicationCalendar.i_cur_rem_dm=this.i_reminder_data_model;
EventHandler.register(this.getCalendarListDataModel(), "onadd", this.i_reminder_data_model.handleCalendarAdd, this.i_reminder_data_model);
EventHandler.register(this.getCalendarListDataModel(), "onremove", this.i_reminder_data_model.handleCalendarRemove, this.i_reminder_data_model);
}	
return this.i_reminder_data_model;
}
ApplicationCalendar.prototype.getQuickAdd=function() {
if (this.i_quick_add==undefined) {
this.i_quick_add=new QuickAdd(this, 100, 30, "Dinner with Lisa at 7pm today");
}
return this.i_quick_add;
}
ApplicationCalendar.prototype.handleSchedulerResize=function(e) {
if (this.i_scheduler!=undefined) {
if (this.i_win_scheduler.effectiveWidth()!=undefined) {
this.i_scheduler.width(this.i_win_scheduler.effectiveWidth() - 2);
}
if (this.i_win_scheduler.effectiveHeight()!=undefined) {
this.i_scheduler.height(this.i_win_scheduler.effectiveHeight() - this.i_win_scheduler.titleBar().height() - 3);
}
}
}
ApplicationCalendar.prototype.getScheduler=function() {
if (this.i_scheduler==undefined) {
this.i_scheduler=new CalendarScheduler(this, 100, 100);
}
return this.i_scheduler;
}
ApplicationCalendar.prototype.handleShortcutEvent=function(e) {
this.popEvent(undefined, CalendarDataModel.getDefaultCalendar(), 
undefined, undefined, undefined, true);
}
ApplicationCalendar.prototype.handlePopEventAttendees=function(e) {
e.event.i_pop_progress=false;
this.popEvent(e.event, undefined, undefined, e.event.i_pop_edit);
e.event.i_pop_edit=undefined;
}
ApplicationCalendar.prototype.popSharedEvent=function(attendee_name, attendee_email) {
var ev=new CalendarEvent();
ev.isNew(true);
var d=new Date();
d.setTime(d.getTime()+((60 - d.getMinutes()) * (60000)));
var d2=d.copy();
d2.setTime(d2.getTime()+3600000);
ev.startTime(d);
ev.endTime(d2);
if(attendee_email!=undefined) {
ev.attendees(attendee_email);
}
this.popEvent(ev, CalendarDataModel.getDefaultCalendar());
}
ApplicationCalendar.prototype.popEvent=function(event, dm, default_date, edit_mode, instance, new_ev_shortcut) {
if (event!=undefined && (event.access()==CalendarEvent.Permission.freebusy || event.i_pop_progress==true)) {
return false;
}
if (new_ev_shortcut==undefined) {
new_ev_shortcut=false;
}
if (instance==undefined) {
instance=false;
}
if(event==undefined) {
event=new CalendarEvent();
event.isNew(true);
var d=(default_date!=undefined ? default_date : new Date());
if (default_date==undefined) { 
d.setTime(d.getTime()+((60 - d.getMinutes()) * (60000)));
}
d.setSeconds(0);
d.setMilliseconds(0);
var ed=d.copy();
ed.setTime(ed.getTime()+3600000);
event.startTime(d);
event.endTime(ed);
event.title("New Event");
edit_mode=true;
}else if(event.recurrence()!=undefined && event.recurrence()!=false && !instance) {
var oldevent=event;
event=new CalendarEvent();
event.id(oldevent.id());
event.title(oldevent.title());
event.startTime(oldevent.startTime());
event.endTime(oldevent.endTime());
event.recurrence(oldevent.recurrence());
event.i_parent_dm=oldevent.parentDataModel();
event.i_parent_month=oldevent.parentMonth(); 
event.i_dm_index=oldevent.i_dm_index; 
}
if (event.isNew()==true) {
edit_mode=true;
}
if (edit_mode==undefined) {
edit_mode=false;
}
var p=new PopoutWindow("EventDisplay", "event");
var o={event: event, dm:dm, 'edit_mode':edit_mode,'instance':instance,'new_ev_shortcut':new_ev_shortcut};
var e=EventHandler.register(p, "onready", ApplicationCalendar.handleOnReadyEventPopout, o);
o.onready_event=e;
var popoutSetting=(Application.getApplicationById("GP").param("popout_"+p.getClassName())=="1" ? true : false);
p.pop(507, 480, popoutSetting);
return true;
}
ApplicationCalendar.handleOnReadyEventPopout=function(o) {
var p=o.popoutWindow;
if(this.onready_event) {
this.onready_event.unregister();
this.onready_event=null;
}
p.getPopupObject().instance(this.instance);
p.getPopupObject().loadEvent(this.event);
p.getPopupObject().dataModel(this.dm);
if(this.new_ev_shortcut!=undefined) 
p.getPopupObject().edit(this.edit_mode, this.new_ev_shortcut);
else
p.getPopupObject().edit(this.edit_mode);
p.setUnloadingData();
}
ApplicationCalendar.prototype.getMeetingRequestDataModel=function() {
if (this.i_meeting_requests==undefined) {
this.i_meeting_requests=new MeetingRequestDataModel(999);
}
return this.i_meeting_requests;
}
ApplicationCalendar.prototype.handleMeetingRequestRefresh=function() {
if(SystemCore.hasApp(1020)) {
this.getUniversalInboxItem().value(this.getMeetingRequestDataModel().entries());
}
}
ApplicationCalendar.prototype.getCalendarListDataModel=function() {
if(this.i_calendar_list_dm==undefined) {
this.i_calendar_list_dm=new CalendarListDataModel("root");
var lm=this.i_calendar_list_dm;
setInterval(function() {
lm.checkExpiration();
}, (60000 * CalendarListDataModel.expirationCheckRate));
}
return this.i_calendar_list_dm;
}
ApplicationCalendar.prototype.getCalendarDataModel=function(index) {
if (this.i_dataModel==undefined) {
this.i_dataModel=Array();
}
var ids=Array(35094, 34874, 34875, 35092, 2695, 37372);
if (this.i_dataModel[index]==undefined) {
var nameArray=Array("Smithers' Calendar", "Jcrosier's Calendar", "Bob's Calendar", "lenny.cros's Calendar", "RadioactiveMan.cros's Calendar", "Rufus' Calendar");
var cdm=new CalendarDataModel(ids[index], nameArray[index], index);
if (index==3) {
cdm.fakeData(true);
}
var months=Array();
this.i_dataModel[index]=cdm;
}
return this.i_dataModel[index];
}
ApplicationCalendar.prototype.getUniversalInboxItem=function() {
if(!this.i_universal_inbox_item && SystemCore.hasApp(1020)) {
this.i_universal_inbox_item=new UniversalInboxItem("Meeting requests", undefined, true);
EventHandler.register(this.i_universal_inbox_item, "onclick", this.launchMeetingRequests, this);
}
return this.i_universal_inbox_item;
}
ApplicationCalendar.prototype.readyToUse=function() {
if (this.i_calendar_list_dm==undefined) return false;
if (this.i_calendar_list_dm.entries()==0) return false;
return true;
}
ApplicationCalendar.inherit(Application);
SystemCore.registerApplication(new ApplicationCalendar());
JavaScriptResource.notifyComplete("./src/Applications/Calendar/Application.Calendar.js");
function CalendarListDataModel() {
this.superDataModelNode("root");
CalendarListDataModel.isInitialLoad(true);
EventHandler.register(this, "ongetitems", this.handleGetItems, this);
}
CalendarListDataModel.expirationCheckRate=5;
CalendarListDataModel.isInitialLoad=function(is_initial_load) {
if(is_initial_load!=undefined) {
CalendarListDataModel.i_is_initial_load=is_initial_load;
}
return CalendarListDataModel.i_is_initial_load;
}
CalendarListDataModel.prototype.handleGetItems=function(e) {
if(this.i_init!=true) {
e.cancel=true;
if(this.i_req!=true) {
this.i_req=true;
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "list"));
dn.addNode(new DataNode("aid", ""));
dn.addNode(new DataNode("userId", user_prefs['user_id']));
var r=new RequestObject("Calendar", "list", dn);
EventHandler.register(r, "oncomplete", this.handleCalendarList, this);
EventHandler.register(r, "onerror", this.handleCalendarListError, this);
APIManager.execute(r);
}
}
}
CalendarListDataModel.prototype.handleCalendarDelete=function(e) {
this.removeItem(e.request.i_cal);
}
CalendarListDataModel.prototype.handleCalendarDeleteError=function(e) {
console.log("CalendarListDataModel.prototype.handleCalendarDeleteError:"+e.response.data());
DialogManager.alert("Deletion of "+e.request.i_cal.calendar().name()+" shared calendar failed.");
}
CalendarListDataModel.prototype.deleteCalendar=function(cal) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "deleteUserShare"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("calendarId", cal.calendar().id()));
var r=new RequestObject("Calendar", "deleteusershare", dn);
r.i_cal=cal;
EventHandler.register(r, "oncomplete", this.handleCalendarDelete, this);
EventHandler.register(r, "onerror", this.handleCalendarDeleteError, this);
APIManager.execute(r);
}
CalendarListDataModel.prototype.handleCalendarList=function(e) {
this.ignoreRefresh(true);
var data=e.response.data();
var calendars=data.xPath("calendar");
if (calendars==null) {
calendars=[];
}
var first=CalendarListDataModel.isInitialLoad();
var loadCal=[];
var cals=(""+Application.getApplicationById(1004).param("calendar_list")).split(',');
for (var i=0; i < cals.length;++i) {
var data=cals[i].split(':');
if (data.length > 1) loadCal["_"+data[0]]=data[1];
}
for(var x=0; x < calendars.length; x++) {
var ca_id=calendars[x].children("calendarId", 0, true);
var ca_name=undefined;
var ca_default=calendars[x].children("default", 0, true);
var ca_access=calendars[x].children("privilege", 0, true);
var ca_owner=calendars[x].children("ownerId", 0, true);
var ca_owner_name=calendars[x].children("ownerDisplayName", 0, true);
var ca_user_address=calendars[x].children("userAddress", 0, true);
if(ca_owner==user_prefs["user_id"]) {
ca_name=calendars[x].children("name", 0, true);;
} else {
ca_name=ca_owner_name;
}
var ca_week_start_day=calendars[x].children("weekStartDay", 0, true);
var ca_default_reminder_type=calendars[x].children("defaultReminderType", 0, true);
var ca_default_reminder_interval=calendars[x].children("defaultReminderInterval", 0, true);
var ca_default_view=parseInt(calendars[x].children("defaultView", 0, true));
var ca_start_time=iCaltoDate(calendars[x].children("workdayStartTime", 0, true));
var ca_end_time=iCaltoDate(calendars[x].children("workdayEndTime", 0, true));
var cdm=new CalendarDataModel(ca_id, ca_name, x);
cdm.ignoreConfigChange(true);
cdm.isDefault(ca_default=="1" ? true : false);
cdm.access(ca_access);
cdm.ownerId(ca_owner);
cdm.weekStartDay(ca_week_start_day);
cdm.defaultReminderType(ca_default_reminder_type);
cdm.defaultReminderInterval(ca_default_reminder_interval);
cdm.defaultCalendarView(ca_default_view);
cdm.startTime(ca_start_time);
cdm.endTime(ca_end_time);
cdm.ignoreConfigChange(false);
cdm.ownerName(ca_user_address); 
if (loadCal["_"+ca_id]=="1" || ca_owner==user_prefs.user_id) {
var start=new Date(), visibleEnd, end, overlap;
start=new Date((start.getMonth()+1)+"/01/"+start.getFullYear());
overlap=start.getDay() - (cdm.weekStartDay() - 1);
if (overlap < 0) overlap+=7;
start=addDays(start,-1*overlap);
visibleEnd=addDays(start, 42);
start=floorMonth(start);
while (start.getMonth() <=visibleEnd.getMonth()) {
end=addDays(addMonth(start),-1);
if (first) {
if (ca_owner==user_prefs.user_id && start.getMonth()==new Date().getMonth()) {
cdm.refreshMonthRange(false, start.getMonth(), start.getFullYear(), end.getMonth(), end.getFullYear());
} else {
if (!CalendarListDataModel.deferred) CalendarListDataModel.deferred=[];
CalendarListDataModel.deferred.push([new Date(start), new Date(end), cdm]);
}
} else {
cdm.refreshMonthRange(false, start.getMonth(), start.getFullYear(), end.getMonth(), end.getFullYear());
}
start=addMonth(start);
}
}
this.addItem(new CalendarListEntry(cdm));
}
if (CalendarDataModel.getDefaultCalendar()==undefined) {
this.createCalendar();
}
this.i_req=false;
this.i_init=true;
this.ignoreRefresh(false, true);
APIManager.executeQueue();
if (CalendarListDataModel.deferred) setTimeout(CalendarListDataModel.loadDeferred, 5000);
}
CalendarListDataModel.loadDeferred=function() {
for (var i=0; i < CalendarListDataModel.deferred.length;++i) {
var data=CalendarListDataModel.deferred[i];
data[2].refreshMonthRange(false, data[0].getMonth(), data[0].getFullYear(), data[1].getMonth(), data[1].getFullYear());
}
if (!delete CalendarListDataModel.deferred) CalendarListDataModel.deferred=undefined;
APIManager.executeQueue();
}
CalendarListDataModel.prototype.handleCalendarListError=function(e) {
console.log("CalendarListDataModel.prototype.handleCalendarListError:"+e.response.data());
}
CalendarListDataModel.prototype.handleCalendarCreate=function(e) {
this.clear();
this.i_req=false;
this.i_init=false;
this.forceRefresh();
}
CalendarListDataModel.prototype.handleCalendarCreateError=function(e) {
console.log("CalendarListDataModel.prototype.handleCalendarCreateError:"+e.response.data());
}
CalendarListDataModel.prototype.createCalendar=function() {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "create"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
var cal_node=dn.addNode(new DataNode("calendar"));
cal_node.addNode(new DataNode("ownerId", user_prefs['user_id']));
cal_node.addNode(new DataNode("name", user_prefs['user_name']+"'s Calendar"));
cal_node.addNode(new DataNode("default", "true"));
cal_node.addNode(new DataNode("defaultReminderInterval", "15"));
cal_node.addNode(new DataNode("defaultReminderType", "4"));
cal_node.addNode(new DataNode("defaultView", "3"));
cal_node.addNode(new DataNode("workdayStartTime", "00000000T090000Z"));
cal_node.addNode(new DataNode("workdayEndTime", "00000000T170000Z"));
cal_node.addNode(new DataNode("weekStartDay", "1"));
cal_node.addNode(new DataNode("workdays", "1111100"));
var r=new RequestObject("Calendar", "create", dn);
EventHandler.register(r, "oncomplete", this.handleCalendarCreate, this);
EventHandler.register(r, "onerror", this.handleCalendarCreateError, this);
r.execute();
}
CalendarListDataModel.saveCalendar=function(cals) {
if (cals.splice==undefined) {
cals=[cals];
}
var req=Array();
for (var x=0; x < cals.length; x++) {
var calendar=cals[x];
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "update"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
var cal_node=dn.addNode(new DataNode("calendar"));
cal_node.addNode(new DataNode("ownerId", user_prefs['user_id']));
cal_node.addNode(new DataNode("calendarId", calendar.id()));
cal_node.addNode(new DataNode("defaultReminderType", calendar.defaultReminderType()));
cal_node.addNode(new DataNode("defaultReminderInterval", calendar.defaultReminderInterval()));
cal_node.addNode(new DataNode("defaultView", calendar.defaultCalendarView()));
cal_node.addNode(new DataNode("workdayStartTime", dateToICal(calendar.startTime())));
cal_node.addNode(new DataNode("workdayEndTime", dateToICal(calendar.endTime())));
cal_node.addNode(new DataNode("weekStartDay", calendar.weekStartDay()));
cal_node.addNode(new DataNode("timeGridUnit", calendar.timeInterval()));
var r=new RequestObject("Calendar", "update", dn);
EventHandler.register(r, "oncomplete", calendar.handleCalendarSave, calendar);
EventHandler.register(r, "onerror", calendar.handleCalendarSaveError, calendar);
req[req.length]=r;			
}
APIManager.execute(req);
}
CalendarListDataModel.prototype.checkExpiration=function() {
var items=this.items();
for(var x=0; x < items.length;++x) {
items[x].checkExpiration();
}
}
CalendarListDataModel.inherit(DataModelNode);
function CalendarListEntry(cdm) {
this.superDataModelNode(cdm.id());
this.i_calendar=cdm;
}
CalendarListEntry.prototype.calendar=function(cal) {
if(cal!=undefined) {
this.i_calendar=cal;
}
return this.i_calendar;
}
CalendarListEntry.prototype.checkExpiration=function() {
this.i_calendar.checkExpiration();
}
CalendarListEntry.inherit(DataModelNode);
function CalendarDataModel(id, name, color_id) {
this.i_name=name;
this.i_color=color_id;
this.superDataModelNode(id);
this.i_fake=false;
this.i_disable_load=false;
this.i_ignoreConfChange=0;
this.i_init=false;
EventHandler.register(this, "onadd", this.handleAdd, this);
CalendarDataModel.i_dataModels[id]=this;
}
CalendarDataModel.i_dataModels=Array();
CalendarDataModel.prototype.handlechangeconfig=null;
CalendarDataModel.getDefaultCalendar=function() {
return CalendarDataModel.i_default_calendar;
}
CalendarDataModel.getCalendarById=function(id) {
return CalendarDataModel.i_dataModels[id];
}
CalendarDataModel.prototype.localData=function(state) {
if (state!=undefined) {
this.i_local=state;
}
return this.i_local;
}
CalendarDataModel.prototype.disableLoad=function(state) {
if(state!=undefined) {
this.i_disable_load=state;
}
return this.i_disable_load;
}
CalendarDataModel.prototype.isDefault=function(state) {
if (state!=undefined) {
this.i_default=state;
if (state==true) {
CalendarDataModel.i_default_calendar=this;
}
}
return this.i_default;
}
CalendarDataModel.prototype.ownerId=function(id) {
if (id!=undefined) {
this.i_owner_id=id;
}
return this.i_owner_id;
}
CalendarDataModel.prototype.ownerName=function(name) {
if (name!=undefined) {
this.i_owner_name=name;
}
return this.i_owner_name;
}
CalendarDataModel.prototype.fireConfigChange=function() {
if (this.ignoreConfigChange()) {
this.i_has_confChange=true;
} else {
if (this.onchangeconfig!=undefined) {
var o=new Object();
o.type="changeconfig";
o.dataModel=this;
this.onchangeconfig(o);
}
}
}
CalendarDataModel.prototype.ignoreConfigChange=function(state) {
if (state!=undefined) {
if (state)++this.i_ignoreConfChange;
else if (this.i_ignoreConfChange > 0) --this.i_ignoreConfChange;
if (this.i_ignoreConfChange==0 && this.i_has_confChange==true) {
this.fireConfigChange();
this.i_has_confChange=undefined;
}
}
return this.i_ignoreConfChange > 0;
}
CalendarDataModel.prototype.weekStartDay=function(day) {
if (day!=undefined && this.i_start_day!=day) {
this.i_start_day=day;
this.fireConfigChange();
}
return this.i_start_day;
}
CalendarDataModel.prototype.defaultReminderType=function(reminder) {
if (reminder!=undefined && this.i_reminder_type!=reminder) {
this.i_reminder_type=reminder;
this.fireConfigChange();
}
return this.i_reminder_type;
}
CalendarDataModel.prototype.defaultReminderInterval=function(interval) {
if (interval!=undefined && this.i_reminder_interval!=interval) {
this.i_reminder_interval=interval;
this.fireConfigChange();
}
return this.i_reminder_interval;
}
CalendarDataModel.prototype.defaultCalendarView=function(view) {
if (view!=undefined && this.i_calendar_view!=view) {
this.i_calendar_view=view;
this.fireConfigChange();
}
return this.i_calendar_view;
}
CalendarDataModel.prototype.timeInterval=function(interval) {
if (interval!=undefined && CalendarDataModel.time_interval!=interval) {
CalendarDataModel.time_interval=interval;
setCookie("Office", "CalendarDailyIncrement="+(60 / interval),
addYear(new Date()), "/");
this.fireConfigChange();
} else if(CalendarDataModel.time_interval==undefined) {
var cookie=getCookie("Office", "CalendarDailyIncrement");
if(cookie!=undefined) {
CalendarDataModel.time_interval=60 / parseInt(cookie.split("=")[1]);
}
if(CalendarDataModel.time_interval==undefined) {
CalendarDataModel.time_interval=4;
}
}
return CalendarDataModel.time_interval;
}
CalendarDataModel.prototype.startTime=function(start) {
if (start!=undefined && this.i_start_time!=start) {
this.i_start_time=start;
this.fireConfigChange();
}
return this.i_start_time;
}
CalendarDataModel.prototype.endTime=function(end) {
if (end!=undefined && this.i_end_time!=end) {
this.i_end_time=end;
this.fireConfigChange();
}
return this.i_end_time;
}
CalendarDataModel.prototype.access=function(access) {
if (access!=undefined) {
this.i_access=access;
}
return this.i_access;
}
CalendarDataModel.prototype.handleAdd=function(e) {
e.item.i_parent_dm=this;
}
CalendarDataModel.prototype.fakeData=function(state) {
if (state!=undefined) {
this.i_fake=state;
this.clear();
}
return this.i_fake;
}
CalendarDataModel.prototype.color=function(color) {
if (color!=undefined) {
this.i_color=color;
if (this.onchangecolor!=undefined) {
var o=new Object();
o.type="changecolor";
o.calendar=this;
this.onchangecolor(o);
}
if (this.onrefresh!=undefined) {
var o=new Object();
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}
}
return this.i_color;
}
CalendarDataModel.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
CalendarDataModel.prototype.addEvent=function(ev) {
var month_srt=this.getItems(0, 1000, "sort", "asc", 1);
var l=month_srt.length();
var target_month=ev.startTime().getMonth();
var target_year=ev.startTime().getFullYear();
var create_month=this.localData();
var added=false;
for (var x=0; x < l; x++) {
var m=month_srt.getItem(x);
if (create_month==true && m.month() > target_month && m.year() > target_year) {
var cm=new CalendarMonth(target_month, target_year);
cm.i_init=true;
this.addItem(cm, m);
cm.addItem(ev);
added=true;
break;
}
if (m.month()==target_month && m.year()==target_year) {
m.addItem(ev);
added=true;
break;
}
}
if (!added && create_month==true) {
var cm=new CalendarMonth(target_month, target_year);
this.addItem(cm);
cm.addItem(ev);
}
return ev;
}
CalendarDataModel.prototype.handleCalendarSaveError=function(e) {
console.log("CalendarDataModel.prototype.handleCalendarSaveError:"+e.response.data());
}
CalendarDataModel.prototype.handleCalendarSave=function(e) {
}
CalendarDataModel.prototype.handleRecurringEventCompleteError=function(e) {
console.log("CalendarDataModel.prototype.handleRecurringEventCompleteError:"+e.response.data());
}
CalendarDataModel.prototype.handleRecurringEventComplete=function(e) {
this.ignoreRefresh(true);
var data=e.response.data();
var events=data.xPath("event");
var event_list=Array();
for (var x=0; x < events.length; x++){ 
var ev_id=parseInt(events[x].children("id", 0, true));
var ev_allday=events[x].children("allDay", 0, true);
var ev_type=events[x].children("type", 0, true);
var ev_start;
var ev_end;
if (ev_type==2 || ev_type==3 || ev_type==5) {
ev_start=iCaltoDate(events[x].children("startDate", 0, true));
ev_end=iCaltoDate(events[x].children("endDate", 0, true));
} else if(ev_allday==1) {
ev_start=floorDay(iCaltoDate(events[x].children("startDate", 0, true)));
ev_end=floorDay(iCaltoDate(events[x].children("endDate", 0, true)));
} else {
ev_start=iCaltoUTCDate(events[x].children("startDate", 0, true));
ev_end=iCaltoUTCDate(events[x].children("endDate", 0, true));
}
var ev_title=events[x].children("eventTitle", 0, true);
var ev_duration=parseInt(events[x].children("duration", 0, true));
var ev_priority=events[x].children("priority", 0, true);
var ev_personal=events[x].children("personal", 0, true);
var ev_timezone=events[x].children("timeZone", 0, true);
var ev_timezoneOffset=events[x].children("timeDiff", 0, true);
var ev_parent=events[x].children("parentId", 0, true);
var ev_recurrence=events[x].children("recurrence", 0, true);
if (ev_recurrence==undefined) {
ev_recurrence="";
}
var ev_emailHost=(events[x].children("emailme", 0, true)=="1" ? true : false);
var ev_conflict=(events[x].children("conflict", 0, true)=="1" ? true : false);
var old_events=this.getItemById(ev_id, true, true);
for(var y=0; y < old_events.length;++y) {
var old_event=old_events[y];
if(old_event.startTime().valueOf()==ev_start.valueOf() &&
old_event.endTime().valueOf()==ev_end.valueOf()) {
old_event.parentMonth().removeItem(old_event);
}
}
var ev=this.addEvent(new CalendarEvent(ev_id, ev_title, ev_start, ev_end, (ev_allday==1 ? true : false), ev_recurrence));
if (ev_type==2) {
ev.colorClass(CalendarColorClass.birthdayColorClass());
}
else if (ev_type==3) {
ev.colorClass(CalendarColorClass.anniversaryColorClass());
}
else if (ev_type==5) {
ev.colorClass(CalendarColorClass.holidayColorClass());
}
if (ev_parent!="" && ev_parent!=undefined) {
ev.parentId(ev_parent);
}
ev.occurrenceDate(ev_start);
ev.calendarId(this.parentDataModel().id());
ev.meetingRequestState(events[x].children("meetingRequestState", 0, true));
ev.duration(ev_duration);
ev.priority(ev_priority);
ev.eventType(ev_type);
ev.personal(ev_personal);
ev.timezone(ev_timezone);
ev.timezoneOffset(ev_timezoneOffset);
ev.emailHost(ev_emailHost);
ev.conflict(ev_conflict);
event_list.push(ev);
}
if(this.onrecurrencesave!=undefined) {
var o=new Object();
o.type="recurrencesave";
o.events=event_list;
this.onrecurrencesave(o);
}
this.ignoreRefresh(false, true);
}
CalendarDataModel.prototype.addRecurringEvent=function(ev) {
if (ev.splice==undefined) {
ev=[ev];
}
var st=ev[0].startTime();
for (var x=1; x < ev.length; x++) {
if (ev[x].startTime().getTime() < st.getTime()) {
st=ev[x].startTime();
}
}
var mnts=this.items();
var lm=0;
var ly=0;
var mm=11;
var my=2999;
for (var x=0; x < mnts.length; x++) {
if (mnts[x]!=null) {
if (ly < mnts[x].year() || (ly==mnts[x].year() && lm < mnts[x].month())) {
ly=mnts[x].year();
lm=mnts[x].month();
}
if (my > mnts[x].year() || (my==mnts[x].year() && mm > mnts[x].month())) {
my=mnts[x].year();
mm=mnts[x].month();
}
}
}
var start_date=st.copy(true);
if (my > start_date.getFullYear() || (my==start_date.getFullYear() && mm > start_date.getMonth())) {
start_date.setFullYear(my);
start_date.setMonth(mm, 1);
}
else {
start_date.setMonth(start_date.getMonth(), 1);
}
var end_date=start_date.copy(true);
var d=MiniCalendar.monthDayCount(lm, ly);
end_date.setFullYear(ly);
end_date.setMonth(lm, d);
var q=Array();
for (var x=0; x < ev.length; x++) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "list"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("ownerId", user_prefs['user_id']));
dn.addNode(new DataNode("calendarId", this.parentDataModel().id()));
dn.addNode(new DataNode("startDate", dateToUTCICal(start_date)));
dn.addNode(new DataNode("endDate", dateToUTCICal(end_date)));
dn.addNode(new DataNode("id", ev[x].id()));
var r=new RequestObject("Event", "list", dn);
EventHandler.register(r, "oncomplete", this.handleRecurringEventComplete, this);
EventHandler.register(r, "onerror", this.handleRecurringEventCompleteError, this);
q[q.length]=r;
}
APIManager.execute(q);
}
CalendarDataModel.prototype.removeEvent=function(ev, instance) {
if (ev.splice==undefined) {
ev=[ev];
}
if (instance==true) {
for (var x=0; x < ev.length; x++) {
ev[x].parentMonth().removeItem(ev[x]);
}
}
else {
this.ignoreRefresh(true);
for (var x=0; x < ev.length; x++) {
var e=this.getItemById(ev[x].id(), true, true);
for(var i=0; i < this.items().length; i++) {
var months=this.items()[i];
for(var j=0; j < months.items().length; j++) {
var event=months.items()[j];
if(event!=undefined && event.parentId()==ev[x].id()) {
e.push(event);
}
}
}
for (var z=0; z < e.length; z++) {
e[z].parentMonth().removeItem(e[z]);
}
}
this.ignoreRefresh(false);
}
}
CalendarDataModel.declineEventInstances=function(events) {
if (events.splice==undefined) {
events=[events];
}
var queue=[];
for(var x=0; x < events.length; x++) {
var event=events[x];
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "declineInstance"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("id", event.id()));
dn.addNode(new DataNode("calendarId", event.parentDataModel().id()));
dn.addNode(new DataNode("ownerId", user_prefs['user_id']));
var occ=new Date(event.occurrenceDate());
occ.setSeconds(0);
dn.addNode(new DataNode("occurrenceDate", dateToUTCICal(occ)));
var r=new RequestObject("Event", "declineInstance", dn);
EventHandler.register(r, "oncomplete", event.handleInstanceDecline, event);
EventHandler.register(r, "onerror", event.handleInstanceDeclineError, event);
queue.push(r);
}
APIManager.execute(queue);
}
CalendarDataModel.saveMeetingRequestState=function(events) {
if (events.splice==undefined) {
events=[events];
}
var req=Array();
for (var x=0; x < events.length; x++) {
var event=events[x];
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "updateMeetingRequest"));
dn.addNode(new DataNode("aId", (event.getSelfAttendee().userId()!=undefined ? event.getSelfAttendee().userId() : user_prefs['user_id'])));
dn.addNode(new DataNode("id", event.id()));
dn.addNode(new DataNode("meetingRequestState", event.meetingRequestState()));
dn.addNode(new DataNode("calendarId", (event.parentDataModel().i_type=="meeting_requests" ? event.calendarId() : event.parentDataModel().id())));
var r=new RequestObject("Calendar", "updatemeetingrequest", dn);
EventHandler.register(r, "oncomplete", event.handleSaveMeetingRequest, event);
EventHandler.register(r, "onerror", event.handleSaveMeetingRequestError, event);
req[req.length]=r;			
}
APIManager.execute(req);
}
CalendarDataModel.removeAttendees=function(event, attendees) {
if(attendees.splice==undefined) {
attendees=[attendees];
}
var reqs=[];
for(var x=0; x < attendees.length; x++) {
var att=attendees[x];
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "deleteEventReference"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("userId", att.userId()));
dn.addNode(new DataNode("id", event.id()));
var r=new RequestObject("Event", "deleteEventReference", dn);
reqs.push(r);
}
APIManager.execute(reqs);
}
CalendarDataModel.saveEvents=function(events, instance) {
if(events.splice==undefined) {
events=[events];
}
var queue=[];
for(var x=0; x < events.length; x++) {
var event=events[x];
var u_instance=(instance==undefined ? false : instance);
if (event.recurrence()=="" || event.recurrence()==undefined) {
u_instance=false;
}
var dn=new DataNode("params");
dn.addNode(new DataNode("method", ((event.isNew() || u_instance==true) ? "create" : "update")));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
var e=dn.addNode(new DataNode("event"));
if(!event.isNew() && !u_instance) {
e.addNode(new DataNode("id", event.id()));
}
if (u_instance==true) {
e.addNode(new DataNode("parentId", event.id()));
dn.addNode(new DataNode("occurrenceDate", dateToUTCICal(event.occurrenceDate())));
}
var ownerId=event.ownerId();
if (ownerId==undefined) ownerId=user_prefs['user_id'];
e.addNode(new DataNode("ownerId", ownerId));
e.addNode(new DataNode("userId", user_prefs['user_id']));
if (event.parentDataModel().i_type=="meeting_requests") {
e.addNode(new DataNode("calendarId", event.calendarId()));
}
else {
if (event.parentDataModel()==event) {
if (event.calendarId()==undefined) {
if(typeof CalendarDataModel.getDefaultCalendar().id!='undefined') {
e.addNode(new DataNode("calendarId", CalendarDataModel.getDefaultCalendar().id()));
} else {
e.addNode(new DataNode("calendarId", event.parentDataModel().id()));
}
}
else {
e.addNode(new DataNode("calendarId", event.calendarId()));
}
}
else {
e.addNode(new DataNode("calendarId", event.parentDataModel().id()));
}
}
e.addNode(new DataNode("description", event.description()));
if (event.i_attendees!=undefined) {
e.addNode(new DataNode("attendees", event.attendeeString()));
}
if (event.priority()!=="" && event.priority()!==undefined) {
e.addNode(new DataNode("priority", ""+event.priority()));
}
if (event.location()!="" && event.location()!=undefined) {
e.addNode(new DataNode("location", ""+event.location()));
}
e.addNode(new DataNode("eventTitle", event.title()));
if(event.allDay()) {
e.addNode(new DataNode("startDate", dateToICal(event.startTime())));
e.addNode(new DataNode("endDate", dateToICal(event.endTime())));
} else {
e.addNode(new DataNode("startDate", dateToUTCICal(event.startTime())));
e.addNode(new DataNode("endDate", dateToUTCICal(event.endTime())));
}
e.addNode(new DataNode("duration", ""+event.duration()));
if (event.recurrence()!="" && event.recurrence()!=undefined && u_instance!=true) {
e.addNode(new DataNode("recurrence", ""+event.recurrence()));
}
else {
e.addNode(new DataNode("recurrence", ""));
}
e.addNode(new DataNode("type", ""+event.eventType()));
e.addNode(new DataNode("timeZone", ""+event.timezone()));
e.addNode(new DataNode("allDay", ""+event.allDay()));
e.addNode(new DataNode("personal", ""+event.personal()));
e.addNode(new DataNode("timeDiff", ""+event.timezoneOffset()));
e.addNode(new DataNode("meetingRequestState", event.meetingRequestState()));
e.addNode(new DataNode("emailowner", (event.emailHost() ? "1" : "0")));
var r=new RequestObject("Event", ((event.isNew() || u_instance==true) ? "create" : "update"), dn);
r.i_instance=instance;
r.i_wasNewEvent=event.isNew();
EventHandler.register(r, "oncomplete", event.handleSave, event);
EventHandler.register(r, "onerror", event.handleSaveError, event);
APIManager.addQueue(r);
if(!(event.isNew() || u_instance==true)) {
event.queueRequests(true);
event.loadAttendees(true);
event.loadFiles(true);
event.queueRequests(false);
}
event.isNew(false);
}
APIManager.executeQueue();
}
CalendarDataModel.deleteEvents=function(events, instance) {
if(events.splice==undefined) {
events=[events];
}
var queue=[];
var removed=[];
if (events.length > 0) {
for(var x=0; x < events.length; x++) {
var event=events[x];
var dm="i"+event.parentDataModel().i_id;
if (removed[dm]==undefined) removed[dm]=[];
removed[dm].push(event);
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "delete"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("id", event.id()));
dn.addNode(new DataNode("calendarId", event.parentDataModel().id()));
var ownerId=event.ownerId();
if(ownerId==undefined) ownerId=user_prefs['user_id'];
dn.addNode(new DataNode("ownerId", ownerId));
if (instance==true && event.recurrence()!="" && event.recurrence()!=undefined) {
dn.addNode(new DataNode("occurrenceDate", dateToUTCICal(event.occurrenceDate())));
}
var r=new RequestObject("Event", "delete", dn);
EventHandler.register(r, "oncomplete", event.handleDelete, event);
EventHandler.register(r, "onerror", event.handleDeleteError, event);
queue.push(r);
}
APIManager.execute(queue);
for (var x in removed) {
if (x.match(/i[0-9]+/)) {
var o=new Object();
o.type="delete";
o.events=removed[x];
o.instance=instance;
var target=removed[x][0].parentDataModel();
while (target.ondelete==undefined && target.i_parent_dm!=target) {
target=target.i_parent_dm;
}
if (target.ondelete!=undefined) target.ondelete(o);
}
}
}
}
CalendarDataModel.prototype.dateRange=function(start, end, includeAll) {
var tmp;
if (typeof start=="string") {
tmp=start.split(" ");
start=createDateFromStrings(tmp[0], tmp[1]);
}
if (typeof end=="string") {
tmp.split(" ");
end=createDateFromStrings(tmp[0], tmp[1]);
}
var result=[], startStamp, endStamp;
if (start!=undefined) startStamp=start.valueOf();
if (end!=undefined) endStamp=end.valueOf();
var ptr=0, hit=[];
var entries=this.getItems(0, this.entries());
for (var i=0; i < entries.length();++i) {
var item=entries.getItem(i);
var itemStart=item.param("start");
var itemEnd=item.param("end");
var currentStart, currentEnd;
if (itemStart==undefined && !includeAll) continue;
if (itemStart==undefined && itemEnd==undefined) continue;
if (endStamp!=undefined && itemEnd!=undefined) {
if (itemStart!=undefined && itemStart.valueOf() > endStamp.valueOf()) continue;
if (typeof itemEnd.valueOf!="function") {
if (!item.param("duration")) continue;
itemEnd=new Date(itemStart.valueOf()+(parseInt(item.param("duration")) * 60000));
}
}
var dates=itemStart.inclusiveDays(itemEnd);
var hasStart=false;
for (var j=0; j < dates.length;++j) {
var iStartStamp=dates[j][0].valueOf();
var iEndStamp=dates[j][1].valueOf();
if (iStartStamp <=endStamp && iEndStamp >=startStamp) {
hasStart=true;
break;
}
}
if (!hasStart) continue;
var type=parseInt(item.i_dm_params['pm_type']);
if (type==0) {
var hitId="i"+item.id()+"-"+itemStart.valueOf()+"-"+itemEnd.valueOf();
if (hit[hitId]) continue;
hit[hitId]=true;
}
if (result.length==0) {
result.push(item);
} else {
while (ptr > -1 && result[ptr].param("start").valueOf() > itemStart.valueOf()) {
--ptr;
}
while (ptr > -1 && ptr < result.length) {
currentStart=result[ptr].param("start");
currentEnd=result[ptr].param("end");
if (currentStart.valueOf() > itemStart.valueOf()) {
break;
}
else if (currentStart.valueOf()==itemStart.valueOf()) {
if (itemEnd!=undefined && currentEnd.valueOf() < itemEnd.valueOf()) {++ptr;
} else {
break;
}
} else {++ptr;
}
}
if (ptr < 0) {
result.splice(0,0,item);
ptr=0;
} else if (ptr >=result.length) {
result.push(item);
} else {
result.splice(ptr,0,item);
}
}
}
var result=new EntrySet(result, undefined, 0, result.length);
result.isComplete(this.i_init);
return result;
}
CalendarDataModel.prototype.refreshMonthRange=function(force, startMonth, startYear, endMonth, endYear, dontAdd) {
if (this.disableLoad()) return;
if (typeof startMonth!="number" || startMonth < 0 || startMonth > 11) return;
if (typeof startYear!="number" || startYear < 0) return;
if (typeof endMonth!="number" || endMonth < 0 || endMonth > 11) endMonth=startMonth;
if (typeof endYear!="number" || endYear < 0) endYear=startYear;
this.ignoreRefresh(true);
var months=this.getItems(0, 1000, "sort", "asc", 1);
var hit=[];
var start=new Date((startMonth+1)+"/01/"+startYear+" 0:00:00"),
end=new Date((endMonth+1)+"/01/"+endYear+" 00:00:00");
for (var i=0; i < months.length();++i) {
var item=months.getItem(i);
var year=item.year();
var month=item.month();
var itemDate=new Date((month+1)+"/01/"+year+" 0:00:00");
if (itemDate.valueOf() >=start && itemDate.valueOf() <=end) {
if (hit[year]==undefined) hit[year]=[];
if (hit[year][month]==undefined) hit[year][month]=true;
if (force || item.expired()) {
var o={
"force": force
};
item.handleGetItems(o);
}
}
}
if (dontAdd!=true) {
for (var y=startYear; y <=endYear;++y) {
var sm=(y==startYear ? startMonth : 0);
var em=(y==endYear ? endMonth : 11);
for (var m=sm; m <=em;++m) {
if (hit[y]==undefined || hit[y][m]==undefined) {
var item=new CalendarMonth(m,y);
this.addItem(item);
var o={
"force": force
};
item.handleGetItems(o);
}
}
}
}
this.ignoreRefresh(false);
}
CalendarDataModel.prototype.expireAllMonths=function() {
var months=this.getItems(0, 1000, "sort", "asc", 1);
for(var i=0; i < months.length(); i++) {
months.getItem(i).expire();
}
}
CalendarDataModel.prototype.save=function() {
CalendarListDataModel.saveCalendar(this);
}
CalendarDataModel.prototype.checkExpiration=function() {
var items=this.items();
for(var x=0; x < items.length;++x) {
var item=items[x];
if(item!=undefined && item.expired()) {
this.refreshMonthRange(false, item.month(), item.year());
}
}
}
CalendarDataModel.inherit(DataModelNode);
function CalendarColorClass(id, border, background, title, description, iconClass, allday) {
this.i_id=id;
this.i_background=background;
this.i_border=border;
this.i_title=title;
this.i_description=description;
this.i_iconClass=iconClass;
this.i_allday=allday;
}
CalendarColorClass.onchangecolors=null;
CalendarColorClass.i_colors=Array();
CalendarColorClass.prototype.onchangecolor=null;
CalendarColorClass.prototype.onchange=null;
CalendarColorClass.prototype.id=function() {
return this.i_id;
}
CalendarColorClass.birthdayColorClass=function() {
if (this.i_birthday_class==undefined) {
this.i_birthday_class=new CalendarColorClass(97, "#000000", "#DDDDDD", "#000000", "#333333", "BirthdayCalendarEvent", true);
}
return this.i_birthday_class;
}
CalendarColorClass.holidayColorClass=function() {
if (this.i_holiday_class==undefined) {
this.i_holiday_class=new CalendarColorClass(96, "#000000", "#DDDDDD", "#000000", "#333333", "HolidayCalendarEvent", true);
}
return this.i_holiday_class;
}
CalendarColorClass.anniversaryColorClass=function() {
if (this.i_anniversary_class==undefined) {
this.i_anniversary_class=new CalendarColorClass(95, "#000000", "#DDDDDD", "#000000", "#333333", "AnniversaryCalendarEvent", true);
}
return this.i_anniversary_class;
}
CalendarColorClass.handleColorChange=function(e) {
if (CalendarColorClass.onchangecolors!=undefined) {
var o=new Object();
o.type="changecolors";
CalendarColorClass.onchangecolors(o);
}
}
CalendarColorClass.addColor=function(colorClass) {
if (CalendarColorClass.i_colors[colorClass.id()]!=colorClass) {
CalendarColorClass.i_colors[colorClass.id()]=colorClass;
colorClass.i_cl_l=EventHandler.register(colorClass, "onchange", CalendarColorClass.handleColorChange);
CalendarColorClass.handleColorChange();
}
return colorClass;
}
CalendarColorClass.removeColor=function(colorClass) {
if (CalendarColorClass.i_colors[colorClass.id()]!=undefined) {
CalendarColorClass.i_colors[colorClass.id()]=null;
if (colorClass.i_cl_l!=null) {
colorClass.i_cl_l.unregister();
colorClass.i_cl_l=null;
}
CalendarColorClass.handleColorChange();
return true;
}
return false;
}
CalendarColorClass.getColorById=function(id) {
if(id < CalendarColorClass.i_colors.length) {
return CalendarColorClass.i_colors[id];
} else {
var newId=(id % (CalendarColorClass.i_colors.length-1))+1;
return CalendarColorClass.i_colors[newId];
}
}
CalendarColorClass.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined) {
if (iconClass===false) {
iconClass=undefined;
}
if (this.i_iconClass!=iconClass) {
this.i_iconClass=iconClass;
this.handleChange();
}
}
return this.i_iconClass;
}
CalendarColorClass.prototype.allDay=function(state) {
if (state!=undefined && this.i_allday!=state) {
this.i_allday=state;
this.handleChange();
}
return this.i_allday;
}
CalendarColorClass.prototype.background=function(color) {
if (color!=undefined && this.i_background!=color) {
this.i_background=color;
this.handleChange();
}
return this.i_background;
}
CalendarColorClass.prototype.border=function(color) {
if (color!=undefined && this.i_border!=color) {
this.i_border=color;
this.handleChange();
}
return this.i_border;
}
CalendarColorClass.prototype.title=function(color) {
if (color!=undefined && this.i_title!=color) {
this.i_title=color;
this.handleChange();
}
return this.i_title;
}
CalendarColorClass.prototype.description=function(description) {
if (description!=undefined && this.i_description!=description) {
this.i_description=description;
this.handleChange();
}
return this.i_description;
}
CalendarColorClass.prototype.getColorPreview=function() {
return this.background();
}
CalendarColorClass.prototype.handleChange=function() {
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.color=this;
this.onchange(o);
}
}
function CalendarMonth(month, year) {
this.superDataModelNode(month+"."+year);
this.i_dm_params['pm_sort']=year+(month < 10 ? "0" : "")+month;
this.i_dm_params['pm_month']=month;
this.i_dm_params['pm_year']=year;
this.i_mtime=new Date(0); 
this.open(true, 0);
this.open(false, 1);
EventHandler.register(this, "onadd", this.handleAdd, this);
EventHandler.register(this, "ongetitems", this.handleGetItems, this);
}
CalendarMonth.openRequests=0;
CalendarMonth.expirationRate=30;
CalendarMonth.prototype.expired=function() {
var range=(CalendarMonth.expirationRate * 60000);
var countdown=range - (new Date().valueOf() - this.i_mtime.valueOf());
return countdown < 0;
}
CalendarMonth.prototype.expire=function() {
this.i_mtime=new Date(0);
}
CalendarMonth.prototype.handleAdd=function(e) {
e.item.i_parent_dm=this.i_parent_dm;
e.item.i_parent_month=this;
}
CalendarMonth.prototype.month=function(month) {
if (month!=undefined && this.i_dm_params['pm_month']!=month) {
this.i_dm_params['pm_month']=month;
this.i_dm_params['pm_sort']=this.i_dm_params['pm_year']+(month < 10 ? "0" : "")+month;
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.entry=this;
this.onchange(o);
}
}
return this.i_dm_params['pm_month'];
}
CalendarMonth.prototype.year=function(year) {
if (year!=undefined && this.i_dm_params['pm_year']!=year) {
this.i_dm_params['pm_year']=year;
this.i_dm_params['pm_sort']=year+(this.i_dm_params['pm_month'] < 10 ? "0" : "")+this.i_dm_params['pm_month'];
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.entry=this;
this.onchange(o);
}
}
return this.i_dm_params['pm_year'];
}
CalendarMonth.prototype.handleEventListError=function(e) {
console.log("CalendarMonth.prototype.handleEventListError:"+e.response.data());
this.i_req=false;
this.parentDataModel().i_init=false;
this.i_mtime=new Date(0);
--CalendarMonth.openRequests;
if (CalendarMonth.openRequests==0) {
var cal_view=Application.getApplicationById(1004).getCalendarView().getCalendarView();   
cal_view.headerText(cal_view.headerText());
}
}
CalendarMonth.prototype.handleEventList=function(e) {
var data=e.response.data();
if (data==undefined || data==null) {
this.handleEventListError(e);
return;
}
this.ignoreRefresh(true);
var events=data.xPath("calendarlist/calendar/event");
var hit=[];
for (var x=0; x < events.length; x++){ 
var ev_start, ev_end, ev=undefined;
var ev_allday=(events[x].children("allDay", 0, true)=="1" ? true : false);
var ev_conflict=(events[x].children("conflict", 0, true)=="1" ? true : false);
var ev_duration=parseInt(events[x].children("duration", 0, true));
var ev_emailHost=(events[x].children("emailowner", 0, true)=="1" ? true : false);
var ev_id=parseInt(events[x].children("id", 0, true));
var ev_location=events[x].children("location", 0, true);
var ev_mRequestState=events[x].children("meetingRequestState", 0, true);
var ev_parent=events[x].children("parentId", 0, true);
var ev_personal=events[x].children("personal", 0, true);
var ev_priority=events[x].children("priority", 0, true);
var ev_recurrence=events[x].children("recurrence", 0, true);
var ev_timezoneOffset=events[x].children("timeDiff", 0, true);
var ev_timezone=events[x].children("timeZone", 0, true);
var ev_title=events[x].children("eventTitle", 0, true);
var ev_type=events[x].children("type", 0, true);
var hitId=ev_id;
if (ev_type==CalendarEvent.Subtype.birthday || ev_type==CalendarEvent.Subtype.anniversary || ev_type==CalendarEvent.Subtype.holiday) {
ev_start=iCaltoDate(events[x].children("startDate", 0, true));
ev_end=iCaltoDate(events[x].children("endDate", 0, true));
} else if(ev_allday) {
ev_start=floorDay(iCaltoDate(events[x].children("startDate", 0, true)));
ev_end=floorDay(iCaltoDate(events[x].children("endDate", 0, true)));
} else {
ev_start=iCaltoUTCDate(events[x].children("startDate", 0, true));
ev_end=iCaltoUTCDate(events[x].children("endDate", 0, true));
}
if (ev_recurrence==undefined) ev_recurrence="";
if (ev_recurrence!="" || ev_type==CalendarEvent.Subtype.birthday || ev_type==CalendarEvent.Subtype.anniversary || ev_type==CalendarEvent.Subtype.holiday) {
hitId+="-"+(ev ? ev.occurrenceDate().valueOf() : ev_start.valueOf());
if (ev_type==CalendarEvent.Subtype.birthday || ev_type==CalendarEvent.Subtype.anniversary || ev_type==CalendarEvent.Subtype.holiday) {
hitId+="-"+ev_title;
}
}
var evs=this.getItemById(ev_id,undefined,true);
if (ev_recurrence!="" 
|| ev_type==CalendarEvent.Subtype.birthday
|| ev_type==CalendarEvent.Subtype.anniversary
|| ev_type==CalendarEvent.Subtype.holiday)
{
if (evs.length > 0) {
for (var i=0; i < evs.length;++i) {
if (ev_start.valueOf()==evs[i].occurrenceDate().valueOf()) {
if (ev_type==CalendarEvent.Subtype.birthday
|| ev_type==CalendarEvent.Subtype.anniversary
|| ev_type==CalendarEvent.Subtype.holiday)
{
if (evs[i].title()==ev_title) {
ev=evs[i];
break;
}
} else {
ev=evs[i];
break;
}
}
}
}
} else
ev=evs[0];
if (ev==undefined) {
ev=this.addItem(new CalendarEvent(ev_id, ev_title, ev_start, ev_end, (ev_allday==1 ? true : false), ev_recurrence));
}
hit[hitId]=true;
if (ev_type==CalendarEvent.Subtype.birthday)
ev.colorClass(CalendarColorClass.birthdayColorClass());
else if (ev_type==CalendarEvent.Subtype.anniversary)
ev.colorClass(CalendarColorClass.anniversaryColorClass());
else if (ev_type==CalendarEvent.Subtype.holiday)
ev.colorClass(CalendarColorClass.holidayColorClass());
if (ev_parent!="" && ev_parent!=undefined) ev.parentId(ev_parent);
ev.calendarId(this.parentDataModel().id());
ev.conflict(ev_conflict);
ev.duration(ev_duration);
ev.emailHost(ev_emailHost);
ev.eventType(ev_type);
ev.location(ev.access()==CalendarEvent.Permission.freebusy ? "" : ev_location);
ev.meetingRequestState(ev_mRequestState);
ev.occurrenceDate(ev_start);
ev.personal(ev_personal);
ev.priority(ev_priority);
ev.timezone(ev_timezone);
ev.timezoneOffset(ev_timezoneOffset);
}
var items=this.items();
for (var i=0; i < items.length;++i) {
if (items[i]==undefined || items[i]==null) continue;
var hitId=items[i].id(),
iType=items[i].eventType();
if (items[i].recurrence()!=""
|| iType==CalendarEvent.Subtype.birthday
|| iType==CalendarEvent.Subtype.anniversary
|| iType==CalendarEvent.Subtype.holiday) { 
hitId+="-"+items[i].occurrenceDate().valueOf();
if (iType==CalendarEvent.Subtype.birthday
|| iType==CalendarEvent.Subtype.anniversary
|| iType==CalendarEvent.Subtype.holiday) { 
hitId+="-"+items[i].title();
}
}
if (!hit[hitId]) {
this.removeItem(items[i]);
}
}
this.i_req=undefined;
this.parentDataModel().i_init=true;
this.ignoreChange(false);
this.ignoreRefresh(false, true);
--CalendarMonth.openRequests;
if (CalendarMonth.openRequests==0) {
var cal_view=Application.getApplicationById(1004).getCalendarView().getCalendarView();   
cal_view.headerText(cal_view.headerText());
}
}
CalendarMonth.prototype.addFakeEvents=function(count) {
this.ignoreRefresh(true);
var phs=Array("each lunch with", "meeting with", "dinner with", "doctors appointment with");
var nms=Array("joe", "tom", "bob", "roy", "jeff", "john", "bill");
var m=this.month();
var y=this.year();
var max_day=MiniCalendar.monthDayCount(this.month(), this.year());
for (var x=0; x < count; x++) {
var ev1_start=new Date();
ev1_start.setFullYear(y);
ev1_start.setMonth(m, Math.floor(Math.random() * max_day));
ev1_start.setHours(Math.floor(Math.random() * 8)+8);
ev1_start.setMinutes(Math.floor(Math.random() * 59));
ev1_start.setSeconds(0);
var dspan=Math.floor(Math.random() * 5);
var d=dspan+ev1_start.getDate();
if (d > 28) {
m++;
if (m==12) {
m=0;
y++;
}
d=d % 28;				
}
var ev1_end=new Date();
ev1_end.setFullYear(y);
ev1_end.setMonth(m, d);
ev1_end.setHours(ev1_start.getHours()+1);
ev1_end.setMinutes(Math.floor(Math.random() * 59));
ev1_end.setSeconds(0);
this.addItem(new CalendarEvent(1, phs[Math.floor(Math.random() * phs.length)]+" "+nms[Math.floor(Math.random() * nms.length)], ev1_start, ev1_end, (Math.floor(Math.random() * 1000) % 2==0 ? true : false)));
}
this.ignoreRefresh(false);	
}
CalendarMonth.prototype.handleGetItems=function(e) {
if (this.expired() || e.force) {
if (this.parentDataModel().id()!=undefined) {
e.cancel=true;
if (this.i_req!=true) {
this.i_req=true;
this.i_mtime=new Date();
this.parentDataModel().i_init=false;
if (this.parentDataModel().fakeData()==false) {
var st=new Date();
st.setFullYear(this.year());
st.setMonth(this.month(), 1);
st.setMinutes(0);
st.setHours(0);
st.setSeconds(0);
var en=st.copy(true);
en.setDate(MiniCalendar.monthDayCount(this.month(), this.year())+1);
en.setHours(0);
en.setMinutes(0);
en.setSeconds(0);
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "listEvents"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("ownerId", this.parentDataModel().ownerId()));
dn.addNode(new DataNode("calendarId", this.parentDataModel().id()));
dn.addNode(new DataNode("startDate", dateToUTCICal(st)));
dn.addNode(new DataNode("endDate", dateToUTCICal(en)));
var r=new RequestObject("Calendar", "listevents", dn);
EventHandler.register(r, "oncomplete", this.handleEventList, this);
EventHandler.register(r, "onerror", this.handleEventListError, this);++CalendarMonth.openRequests;
var today=new Date();
if(CalendarListDataModel.isInitialLoad() && this.parentDataModel().isDefault() && this.year()==today.getFullYear() && this.month()==today.getMonth()) {
CalendarListDataModel.isInitialLoad(false);
r.execute();
} else {
APIManager.addQueue(r);
}
if (CalendarMonth.openRequests==1) { 
var cal_view=Application.getApplicationById(1004).getCalendarView().getCalendarView();   
cal_view.headerText(cal_view.headerText());
}
}
else {
var me=this;
setTimeout(function() {
me.addFakeEvents(2);
}, 200);			
}
}
}
else {
}
}
}
CalendarMonth.inherit(DataModelNode);
function CalendarEvent(id, title, start_time, end_time, allday, recurrence) {
this.i_ev_type="event";
this.i_sort_order=99999;	
this.superDataModelNode(id)
this.i_dm_params['pm_start']=start_time;
this.i_dm_param_types['pm_start']="date";
this.i_dm_params['pm_start_raw']=(start_time==undefined ? "" : ""+start_time.valueOf());
this.i_dm_params['pm_start_disp']=getNumericDateString(start_time)+" "+getTimeString(start_time);
this.i_dm_params['pm_end']=end_time;
this.i_dm_param_types['pm_end']="date";
this.i_dm_params['pm_title']=title;
this.i_dm_params['pm_allday']=(allday==true);
this.i_dm_params['pm_sort']=id;
this.i_dm_params['pm_recurrence']=(recurrence==undefined ? "" : recurrence);
this.i_dm_params['pm_recurrence_change']=false;
this.i_new=false;
this.i_dm_params['pm_description']="";
this.i_dm_params['pm_location']="";
this.i_dm_params['pm_type']="0";
this.i_dm_params['pm_status']="0";
this.i_dm_params['pm_priority']="2"; 
this.i_dm_params['pm_personal']="0";
this.i_dm_params['pm_timezone']=28;
this.i_dm_params['pm_timezone_offset']=(-1 * ((new Date()).getTimezoneOffset() / 60));
this.i_dm_params['pm_conflict']=false;
this.i_dm_params['pm_conflict_icon']="";
this.i_dm_params['pm_last_modifier_id']="0";
this.i_dm_params['pm_last_modifier_name']="";
this.i_dm_params['pm_last_modified_date']="";
this.i_staged_files=[];
if (id==undefined) {
this.i_attendees=Array();
}
this.updateDuration();
this.i_details_loaded=false;
}
CalendarEvent.factory=function(id, title, start_time, end_time, allday, recurrence) {
return (new CalendarEvent(id, title, start_time, end_time, allday, recurrence));
}
CalendarEvent.prototype.copy=function() {
var ret=CalendarEvent.factory(this.id(), this.title(), this.startTime(), this.endTime(), this.allDay(), this.recurrence());
ret.meetingRequestState(this.meetingRequestState());
return ret;
}
CalendarEvent.Permission={
freebusy:"Read",		
readonly:"FullRead",	
full:"All"				
};
CalendarEvent.State={
none:0,
pending:1,
accepted:2,
tentative:3,
declined:4,
expired:5,
removed:6
};
CalendarEvent.Subtype={
appointment:0,
meeting:1,
birthday:2,
anniversary:3,
canceled:4,
holiday:5
};
CalendarEvent.prototype.onloaddetails=null;
CalendarEvent.prototype.onsave=null;
CalendarEvent.prototype.onsavemreq=null;
CalendarEvent.prototype.onattendees=null;
CalendarEvent.meetingRequestStates=Array("Host", "Pending", "Accepted", "Tentative", "Declined", "Never Responded", "Removed");
CalendarEvent.prototype.type=function(t) {
if (t!=undefined) {
this.i_ev_type=t;
}
return this.i_ev_type;
}
CalendarEvent.prototype.parentDataModel=function() {
return this.i_parent_dm;
}
CalendarEvent.prototype.parentMonth=function() {
return this.i_parent_month;
}
CalendarEvent.prototype.sortOrder=function(order) {
if (order!=undefined) {
this.i_sort_order=order;
}
return this.i_sort_order;
}
CalendarEvent.prototype.displayBody=function(data) {
if (data!=undefined) {
this.i_display_body=data;
}
return this.i_display_body;
}
CalendarEvent.prototype.access=function(state, local) {
var perms=CalendarEvent.Permission;
if (local || this.i_dm_params['pm_access']!=undefined) {
if (state!=undefined) {
if (state==null) {
this.i_dm_params['pm_access']=undefined;
} else if (state==perms.freebusy || state==perms.readonly || state==perms.full) {
this.i_dm_params['pm_access']=state;
}
}
return this.i_dm_params['pm_access'];
}
if (this.parentDataModel()!=this && typeof this.parentDataModel().access=="function") {
if (state==perms.freebusy || state==perms.readonly || state==perms.full) {
this.parentDataModel().access(state);
}
return this.parentDataModel().access();
}
return perms.full;
}
CalendarEvent.prototype.updateDuration=function() {
var start_time=this.i_dm_params['pm_start'];
var end_time=this.i_dm_params['pm_end'];
if (this.allDay()) {
if(this.endTime()!=undefined) {
this.i_dm_params['pm_duration']=1440 * Math.floor((this.endTime().valueOf() - this.startTime().valueOf()) / 86400000);
}
}
else if (start_time!=undefined && end_time!=undefined) {
var st=start_time.copy();
var et=end_time.copy();
st.setSeconds(0,0);
et.setSeconds(0,0); 
this.i_dm_params['pm_duration']=Math.floor(((et.getTime() - st.getTime()) / 1000) / 60);
}
else {
this.i_dm_params['pm_duration']="0";
}
}
CalendarEvent.prototype.colorClass=function(color_class) {
if (color_class!=undefined) {
if (color_class===false) {
color_class=null;
}
this.i_color=color_class;
}
return this.i_color;
}
CalendarEvent.prototype.occurrenceDate=function(d) {
if (d!=undefined) {
this.i_occurrenceDate=d;
}
return this.i_occurrenceDate;
}
CalendarEvent.prototype.startTime=function(startTime, endTime) {
if (startTime!=undefined) {
var change=false;
if (startTime && !startTime.inclusiveDays) startTime=new Date(startTime);
if (endTime && !endTime.inclusiveDays) endTime=new Date(endTime);
if (endTime!=undefined && this.i_dm_params['pm_end']!=endTime) {
change=true;
this.i_dm_params['pm_end']=endTime;
}
if (this.i_dm_params['pm_start']!=startTime) {
this.i_dm_params['pm_start']=startTime;
this.i_dm_params['pm_start_raw']=""+startTime.valueOf();
this.i_dm_params['pm_start_disp']=getNumericDateString(startTime)+" "+getTimeString(startTime);
change=true;
var pMonth=this.parentMonth();
var startYear=startTime.getFullYear(), startMonth=startTime.getMonth();
var moved=(pMonth!=undefined && (pMonth.month()!=startTime.getMonth() || pMonth.year()!=startTime.getFullYear()));
if (moved && this.recurrence()=="") {
pMonth.removeItem(this);
var otherMonths=this.parentDataModel().getItems(0, 1000, "sort", "asc", 1);
for (var i=0; i < otherMonths.length();++i) {
var dm=otherMonths.getItem(i);
if (dm.month()==startMonth && dm.year()==startYear) {
dm.addItem(this);
}
}
}
}
if (change) {
this.updateDuration();
this.fireRefresh();
}
}
return this.i_dm_params['pm_start'];
}
CalendarEvent.prototype.endTime=function(end_time) {
if (end_time!=undefined) {
if (end_time && !end_time.inclusiveDays) end_time=new Date(end_time);
if (end_time!=this.i_dm_params['pm_end']) {
this.i_dm_params['pm_end']=end_time;
this.updateDuration();
this.fireRefresh();
}
}
return this.i_dm_params['pm_end'];
}
CalendarEvent.prototype.allDay=function(state) {
if (state!=undefined && this.i_dm_params['pm_allday']!=state) {
this.i_dm_params['pm_allday']=(state==true);
this.updateDuration();
this.fireRefresh();
}
return this.i_dm_params['pm_allday'];
}
CalendarEvent.prototype.recurrence=function(recurrence) {
if (recurrence!=undefined) {
if (this.i_dm_params['pm_recurrence']!=recurrence) {
this.i_dm_params['pm_recurrence']=recurrence;
this.i_dm_params['pm_recurrence_change']=true;
}
}
return this.i_dm_params['pm_recurrence'];
}
CalendarEvent.prototype.title=function(title) {
if (title!=undefined && this.i_dm_params['pm_title']!=title) {
this.i_dm_params['pm_title']=title;
this.fireRefresh();
}
return this.i_dm_params['pm_title'];
}
CalendarEvent.prototype.meetingRequestState=function(state) {
if (state!=undefined) {
if (this.i_dm_params['pm_status']!=state) {
this.i_dm_params['pm_status']=state;
this.i_dm_params['pm_status_name']=CalendarEvent.meetingRequestStates[state];
this.fireRefresh();
var calDM=Application.getApplicationById(1004).getCalendarListDataModel();
var cal=calDM.getItemById(this.calendarId());
if (this.i_request==true) {
if (cal!=undefined) {
var ev=cal.calendar().getItemById(this.id(), true, true); 
if (ev!=undefined) {
for(var x=ev.length - 1; x >=0; x--) {
ev[x].meetingRequestState(state);
}
}
}
if (state==2 || state==0 || state==4) {
if(this.parentDataModel().removeItem) {
this.parentDataModel().removeItem(this);
}
}
}
else {
if (cal!=undefined && cal.calendar().isDefault()) {
var mrd=Application.getApplicationById(1004).getMeetingRequestDataModel();
if (mrd!=undefined) {
var ev=mrd.getItemById(this.id(), true);
if (ev!=undefined) {
if (ev.calendarId()==this.i_dm_params['pm_calendar_id']) {
ev.meetingRequestState(state);
}
}
}
if (state==4) {
if(this.parentDataModel().removeEvent) {
this.parentDataModel().removeEvent(this);
}
}
} else { 
if (cal!=undefined) {
var ev=cal.calendar().getItemById(this.id(), true, true); 
if (ev!=undefined) {
for(var x=ev.length - 1; x >=0; x--) {
ev[x].meetingRequestState(state);
}
}
}
}
}
this.fireChange();
}
}
return this.i_dm_params['pm_status'];
}
CalendarEvent.prototype.saveMeetingRequestState=function() {
CalendarDataModel.saveMeetingRequestState(this);
}
CalendarEvent.prototype.handleSaveMeetingRequest=function() {
if(this.meetingRequestState()==2) { 
this.createDefaultReminder();
}
if(this.onsavemreq!=null) {
var o={
type: "savemreq",
event: this
};
this.onsavemreq(o);
}	
}
CalendarEvent.prototype.createDefaultReminder=function() {
if(this.reminder()==undefined) { 
if(this.parentDataModel()!=undefined) { 
var calDM=Application.getApplicationById(1004).getCalendarListDataModel();
var cal=calDM.getItemById(this.calendarId());
if (cal==undefined) {
var event=this; 
var timer=null;
timer=setInterval(function() {
var calDM=Application.getApplicationById(1004).getCalendarListDataModel();
var cal=calDM.getItemById(event.calendarId());
if (cal!=undefined && event!=undefined) {
var interval=cal.calendar().defaultReminderInterval();
var type=cal.calendar().defaultReminderType();
var due=addMinutes(event.startTime(), -1*interval);
var rem=new CalendarReminder(event.id(), 1, due, type, undefined, interval, cal.calendar().ownerId());
rem.eventObject(event);
event.reminder(rem);
CalendarReminderDataModel.createReminder(rem, cal.calendar().ownerId());
clearInterval(timer);
timer=undefined;
event=undefined;
}
}, 1000);
} else {
var interval=cal.calendar().defaultReminderInterval();
var type=cal.calendar().defaultReminderType();
var due=addMinutes(this.startTime(), -1*interval);
var rem=new CalendarReminder(this.id(), 1, due, type, undefined, interval, cal.calendar().ownerId());
rem.eventObject(this);
this.reminder(rem);
CalendarReminderDataModel.createReminder(rem, cal.calendar().ownerId());
}
}
}
}
CalendarEvent.prototype.ownerDisplayName=function(name) {
if (name!=undefined && this.i_dm_params['pm_owner_name']!=name) {
this.i_dm_params['pm_owner_name']=name;
this.fireChange();
}
return this.i_dm_params['pm_owner_name'];
}
CalendarEvent.prototype.ownerId=function(id, local) {
if (local || this.i_dm_params['pm_owner_id']!=undefined) {
if (id!=undefined) {
if (id==null) {
this.i_dm_params['pm_owner_id']=undefined;
} else {
this.i_dm_params['pm_owner_id']=id;
}
}
return this.i_dm_params['pm_owner_id'];
} else if (this.parentDataModel()!=this && typeof this.parentDataModel().ownerId=="function") {
return this.parentDataModel().ownerId(id);
}
}
CalendarEvent.prototype.parentId=function(id) {
if (id!=undefined && this.i_dm_params['pm_parent']!=id) {
this.i_dm_params['pm_parent']=id;
this.fireChange();
}
return this.i_dm_params['pm_parent'];
}
CalendarEvent.prototype.calendarId=function(id) {
if (id!=undefined && this.i_dm_params['pm_calendar_id']!=id) {
this.i_dm_params['pm_calendar_id']=id;
this.fireChange();
}	
return this.i_dm_params['pm_calendar_id'];
}
CalendarEvent.prototype.transparency=function(transparency) {
if (transparency!=undefined && this.i_dm_params['pm_transparency']!=transparency) {
this.i_dm_params['pm_transparency']=transparency;
this.fireChange();
}
return this.i_dm_params['pm_transparency'];
}
CalendarEvent.prototype.timezone=function(timezone) {
if (timezone!=undefined && this.i_dm_params['pm_timezone']!=timezone) {
this.i_dm_params['pm_timezone']=timezone;
this.fireChange();
}
return this.i_dm_params['pm_timezone'];
}
CalendarEvent.prototype.timezoneOffset=function(offset) {
if (offset!=undefined && this.i_dm_params['pm_timezone_offset']!=offset) {
this.i_dm_params['pm_timezone_offset']=offset;
this.fireChange();
}
return this.i_dm_params['pm_timezone_offset'];
}
CalendarEvent.prototype.handleEventListAttendeesError=function(e) {
console.log("CalendarEvent.prototype.handleEventListAttendeesError:"+e.response.data());
}
CalendarEvent.prototype.handleEventListAttendees=function(e) {
var data=e.response.data();
var attendees=Array();
var events=data.children("attendee");
this.getAttendeesDM().clear();
for (var x=0; x < events.length; x++){ 
var att_displayName=events[x].children("displayName", 0, true);
var att_alias=events[x].children("defaultAlias", 0, true);
var att_user=events[x].children("userId", 0, true);
var att_status=events[x].children("status", 0, true);
var now=new Date();
if(att_status=="1" && this.endTime() < now) {
att_status="5";
}
var i=attendees[attendees.length]=new EventAttendee(att_user, att_displayName, att_alias, att_status);
this.getAttendeesDM().addItem(i);
}
this.i_attendees=attendees;
if (this.onattendees!=undefined) {
var o=new Object();
o.type="attendees";
o.event=this;
this.onattendees(o);
}
}
CalendarEvent.prototype.attendees=function(attendees) {
if (attendees!=undefined && this.i_attendees!=attendees) {
this.i_attendees=attendees;
this.fireChange();
}
return this.i_attendees;
}
CalendarEvent.prototype.getMeetingHost=function() {
var host=null;
for(var x=this.i_attendees.length - 1; x >=0; x--) {
if(this.i_attendees[x].status()==0) {
host=this.i_attendees[x];
}
}
return host;
}
CalendarEvent.prototype.getSelfAttendee=function() {
var me=null;
for(var x=this.i_attendees.length - 1; x >=0; x--) {
if(parseInt(this.i_attendees[x].userId())==parseInt(user_prefs['user_id'])) {
me=this.i_attendees[x];
}
}
return me;
}
CalendarEvent.prototype.removeAttendees=function(sel, instance) {
if(sel.splice==undefined) {
sel=[sel];
}
if (instance==undefined) {
instance=false;
}
var atts=this.attendees();
for(var x=0; x < sel.length; x++) {
for(var a=atts.length - 1; a >=0; a--) {
if(atts[a]==sel[x]) {
atts.splice(a, 1);
}
}
this.getAttendeesDM().removeItem(sel[x]);
}
this.fireChange();
if (!instance) {
CalendarDataModel.removeAttendees(this, sel);
}
}
CalendarEvent.prototype.getAttendeesDM=function() {
if(this.i_attendees_dm==undefined) {
this.i_attendees_dm=new EventAttendeesDataModel();
}
return this.i_attendees_dm;
}
CalendarEvent.prototype.loadAttendees=function(force, instance) {
if(force==undefined) {
force=false;
}
if(instance==undefined) {
instance=false;
}
if (this.i_attendees==undefined || force) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "list_attendees"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("id", this.id()));
if (instance==true && this.recurrence()!="" && this.recurrence()!=undefined) {
dn.addNode(new DataNode("occurrenceDate", dateToICal(this.occurrenceDate())));
}
var r=new RequestObject("Event", "list_attendees", dn);
EventHandler.register(r, "oncomplete", this.handleEventListAttendees, this);
EventHandler.register(r, "onerror", this.handleEventListAttendeesError, this);
if(this.i_queue_reqs==true) {
APIManager.addQueue(r);
}else{
APIManager.execute(r);
}
}else{
if (this.onattendees!=undefined) {
var o=new Object();
o.type="attendees";
o.event=this;
this.onattendees(o);
}
}
}
CalendarEvent.prototype.attendeeString=function() {
if (this.i_attendees!=undefined) {
var att_str="";
for (var z=0; z < this.i_attendees.length; z++) {
if(this.i_attendees[z].defaultAlias) {
att_str+=(att_str!="" ? "," : "")+this.i_attendees[z].defaultAlias();
}
}
return att_str;
}
return att_str;
}
CalendarEvent.prototype.loadReminder=function(force) {
if(force==undefined) {
force=false;
}
if (this.i_reminder==undefined || force) {
var ownerId;
if (this.parentDataModel()!=undefined) {
ownerId=this.parentDataModel().ownerId();
} else {
ownerId=this.ownerId();
}
if (ownerId==undefined) ownerId=user_prefs['user_id'];
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "read"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("objectId", this.id()));
dn.addNode(new DataNode("objectType", "1"));
dn.addNode(new DataNode("userId", ownerId));
var r=new RequestObject("Reminder", "read", dn);
EventHandler.register(r, "oncomplete", this.handleEventReminderLoad, this);
EventHandler.register(r, "onerror", this.handleEventReminderLoadError, this);
if(this.i_queue_reqs==true) {
APIManager.addQueue(r);
}else{
APIManager.execute(r);
}
}else{
if (this.onreminderload!=undefined) {
var o=new Object();
o.type="reminderload";
o.event=this;
this.onreminderload(o);
}
}
}
CalendarEvent.prototype.handleEventReminderLoadError=function(e) {
console.log("CalendarEvent.prototype.handleEventReminderLoadError:"+e.response.data());
}
CalendarEvent.prototype.handleEventReminderLoad=function(e) {
var data=e.response.data();
var reminder=data.children("reminder");
var creminder=null;
if(reminder.length > 0) {
var rems=[];
var typeSum=0;
for(var x=0; x < reminder.length; x++) {
var r=new CalendarReminder();
r.dataNode(reminder[x]);
typeSum+=parseInt(r.type());
rems.push(r);
}
creminder=rems[0];
creminder.type(typeSum);
}else{
}
this.i_reminder=creminder;
if (this.onreminderload!=undefined) {
var o=new Object();
o.type="reminderload";
o.event=this;
this.onreminderload(o);
}
}
CalendarEvent.prototype.reminder=function(rem, silent) {
if (rem!=undefined && this.i_reminder!=rem) {
this.i_reminder=rem;
if(this.onreminderload!=undefined && !silent) {
var o={
type: "reminderload",
event: this
};
this.onreminderload(o);
}
}
return this.i_reminder===false ? undefined : this.i_reminder;
}
CalendarEvent.prototype.loadFiles=function(force) {
if(force==undefined) {
force=false;
}
if(this.i_files_loaded==undefined || force==true) {
var dn=new DataNode("params");
var att=dn.addNode(new DataNode("attachment"));
att.addNode(new DataNode("objectId", this.id()));
att.addNode(new DataNode("objectType", "0"));
var r=new RequestObject("CalendarAttachment", "list", dn);
EventHandler.register(r, "oncomplete", this.handleEventFilesLoad, this);
EventHandler.register(r, "onerror", this.handleEventFilesLoadError, this);
if(this.i_queue_reqs==true) {
APIManager.addQueue(r);
}else{
APIManager.execute(r);
}
}else{
if (this.onfilesload!=undefined) {
var o=new Object();
o.type="filesload";
o.event=this;
this.onfilesload(o);
}
}
}
CalendarEvent.prototype.handleEventFilesLoadError=function(e) {
console.log("CalendarEvent.prototype.handleEventFilesLoadError:"+e.response.data());
}
CalendarEvent.prototype.handleEventFilesLoad=function(e) {
var data=e.response.data();
this.i_files=[];
var attachments=data.xPath("attachment");
for(var x=0; x < attachments.length; x++) {
var name=attachments[x].children("attachmentname", 0, true);
var aid=parseInt(attachments[x].children("attachmentid", 0, true));
var size=parseInt(attachments[x].children("attachmentsize", 0, true));
var a=new UniversalFileAttachment(name, size, 0, aid);
this.i_files.push(a);
}
if (this.onfilesload!=undefined) {
var o=new Object();
o.type="filesload";
o.event=this;
this.onfilesload(o);
}
}
CalendarEvent.prototype.removeAttachment=function(id) {
var dn=new DataNode("params");
var att=dn.addNode(new DataNode("attachment"));
att.addNode(new DataNode("attachmentid", id));
att.addNode(new DataNode("objectId", this.id()));
att.addNode(new DataNode("objectType", "0"));
var r=new RequestObject("CalendarAttachment", "destroy", dn);
r.execute();
}
CalendarEvent.prototype.files=function(rem) {
if(rem!==undefined) {
if(rem===false) {
this.i_files=[];
}else{
this.i_files=rem;
}
if (this.onfilesload!=undefined) {
var o=new Object();
o.type="filesload";
o.event=this;
this.onfilesload(o);
}
}
return this.i_files;
}
CalendarEvent.prototype.isNew=function(n) {
if(n!=undefined) {
this.i_new=n;
}
return this.i_new;
}
CalendarEvent.prototype.description=function(desc) {
if(desc!=undefined && this.i_dm_params["pm_description"]!=desc) {
this.i_dm_params["pm_description"]=desc;
this.fireChange();
}
return this.i_dm_params['pm_description'];
}
CalendarEvent.prototype.location=function(loc) {
if(loc!=undefined && this.i_dm_params["pm_location"]!=loc) {
this.i_dm_params["pm_location"]=loc;
this.fireChange();
}
return this.i_dm_params["pm_location"];
}
CalendarEvent.prototype.duration=function(duration) {
if (duration!=undefined && this.i_dm_params['pm_duration']!=duration) {
this.i_dm_params['pm_duration']=duration;
if (!this.allDay()) {
this.endTime(addMinutes(this.startTime(), duration));
}
this.fireChange();
}
return this.i_dm_params['pm_duration'];
}
CalendarEvent.prototype.priority=function(priority) {
if (priority!=undefined && this.i_dm_params['pm_priority']!=priority) {
this.i_dm_params['pm_priority']=priority;
this.fireChange();
}
return this.i_dm_params['pm_priority'];
}
CalendarEvent.prototype.eventType=function(event_type) {
if (event_type!=undefined && this.i_dm_params['pm_type']!=event_type) {
this.i_dm_params['pm_type']=event_type;
this.fireChange();
}
return this.i_dm_params['pm_type'];
}
CalendarEvent.prototype.personal=function(personal) {
if (personal!=undefined && this.i_dm_params['pm_personal']!=personal) {
this.i_dm_params['pm_personal']=personal;
this.fireChange();
}
return this.i_dm_params['pm_personal'];
}
CalendarEvent.prototype.conflict=function(conflict) {
if(conflict!=undefined &&  this.i_dm_params['pm_conflict']!=conflict) {
this.i_dm_params['pm_conflict']=conflict;
this.i_dm_params['pm_conflict_icon']=(conflict ? "<div class='DataGrid_icon CalendarView_icon_conflict' style='margin-left:-1px;'></div>" : "");
this.fireChange();
}
return this.i_dm_params['pm_conflict'];
}
CalendarEvent.prototype.numberConflicts=function(number_conflicts) {
if (number_conflicts!=undefined && this.i_dm_params['pm_number_conflicts']!=number_conflicts) {
this.i_dm_params['pm_number_conflicts']=number_conflicts;
this.fireChange();
}
return this.i_dm_params['pm_number_conflicts'];
}
CalendarEvent.prototype.firstConflictTitle=function(first_conflict_title) {
if (first_conflict_title!=undefined && this.i_dm_params['pm_first_conflict_title']!=first_conflict_title) {
this.i_dm_params['pm_first_conflict_title']=first_conflict_title;
this.fireChange();
}
return this.i_dm_params['pm_first_conflict_title'];
}
CalendarEvent.prototype.firstConflictStartDate=function(first_conflict_start_date) {
if (first_conflict_start_date!=undefined && this.i_dm_params['pm_first_conflict_start_date']!=first_conflict_start_date) {
this.i_dm_params['pm_first_conflict_start_date']=first_conflict_start_date;
this.fireChange();
}
return this.i_dm_params['pm_first_conflict_start_date'];
}
CalendarEvent.prototype.firstConflictDuration=function(first_conflict_duration) {
if (first_conflict_duration!=undefined && this.i_dm_params['pm_first_conflict_duration']!=first_conflict_duration) {
this.i_dm_params['pm_first_conflict_duration']=first_conflict_duration;
this.fireChange();
}
return this.i_dm_params['pm_first_conflict_duration'];
}
CalendarEvent.prototype.conflictIconTip=function(tip) {
if (tip!=undefined && this.i_dm_params['pm_conflict_icon_tip']!=tip) {
this.i_dm_params['pm_conflict_icon_tip']=tip;
}
return this.i_dm_params['pm_conflict_icon_tip'];
}
CalendarEvent.prototype.updateConflictIconTip=function() {
if (this.i_dm_params['pm_number_conflicts']!=undefined && this.i_dm_params['pm_number_conflicts'] > 0) {
if (this.i_dm_params['pm_first_conflict_title']!=undefined &&
this.i_dm_params['pm_first_conflict_start_date']!=undefined &&
this.i_dm_params['pm_first_conflict_duration']!=undefined) {
var tip='<div class="MeetingConflictAlert">';
if (this.i_dm_params['pm_recurrence']!=undefined && this.i_dm_params['pm_recurrence']!='') {
tip+='Conflicts with at least one event on your calendar. The first conflict:'
} else if (this.i_dm_params['pm_number_conflicts']==1) {
tip+='Conflicts with an event already on your calendar:';
} else {
tip+='Conflicts with (';
tip+=this.i_dm_params['pm_number_conflicts'];
tip+=') events already on your calendar. The first conflict:';
}
tip+='</div>';
tip+='<div class="MeetingConflictTitle">';
tip+=this.i_dm_params['pm_first_conflict_title'];
tip+='</div>';
tip+='<div class="MeetingConflictText">is currently scheduled from ';
tip+=getTimeString(this.i_dm_params['pm_first_conflict_start_date']);
tip+=' - ';
tip+=getTimeString(addMinutes(this.i_dm_params['pm_first_conflict_start_date'], this.i_dm_params['pm_first_conflict_duration']));
tip+=' on ';
tip+=getFullDateString(this.i_dm_params['pm_first_conflict_start_date']);
tip+='</div>';
this.conflictIconTip(tip);
} else {
this.conflictIconTip('Conflicts with an event already on your calendar.');
}
} else {
this.conflictIconTip('No conflicts');
}
}
CalendarEvent.prototype.emailHost=function(emailHost) {
if (emailHost!=undefined && this.i_dm_params['pm_emailHost']!=emailHost) {
this.i_dm_params['pm_emailHost']=emailHost;
this.fireChange();
}
return this.i_dm_params['pm_emailHost'];
}
CalendarEvent.prototype.lastModifierId=function(lastModifierId) {
if (lastModifierId!=undefined && this.i_dm_params['pm_last_modifier_id']!=lastModifierId) {
this.i_dm_params['pm_last_modifier_id']=lastModifierId;
this.fireChange();
}
return this.i_dm_params['pm_last_modifier_id'];
}
CalendarEvent.prototype.lastModifierDisplayName=function(lastModifierDisplayName) {
if (lastModifierDisplayName!=undefined && this.i_dm_params['pm_last_modifier_name']!=lastModifierDisplayName) {
this.i_dm_params['pm_last_modifier_name']=lastModifierDisplayName;
this.fireChange();
}
return this.i_dm_params['pm_last_modifier_name'];
}		
CalendarEvent.prototype.lastModifiedDate=function(lastModifiedDate) {
if (lastModifiedDate!=undefined && this.i_dm_params['pm_last_modified_date']!=lastModifiedDate) {
this.i_dm_params['pm_last_modified_date']=lastModifiedDate;
this.fireChange();
}
return this.i_dm_params['pm_last_modified_date'];
}		
CalendarEvent.prototype.loadDetails=function(load_attendees, load_reminder, queue, load_files, instance, ignore_errors) {
if (this.access()==CalendarEvent.Permission.freebusy) return;
this.queueRequests(true);
if(load_attendees!=undefined && load_attendees==true) {
this.loadAttendees(true, instance);
}
if(load_reminder!=undefined && load_reminder==true) {
this.loadReminder(true);
}
if(load_files!=undefined && load_files==true) {
this.loadFiles(true);
}
if(instance===undefined) {
instance=false;
}
if(queue==undefined) {
queue=false;
}
if(this.i_details_loaded==false) {
var ownerId=this.ownerId();
if (ownerId==undefined) ownerId=user_prefs['user_id'];
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "read"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("userId", ownerId));
dn.addNode(new DataNode("id", this.id()));
var r=new RequestObject("Event", "read", dn);
r.i_instance=instance;
EventHandler.register(r, "oncomplete", this.handleDetails, this);
if(ignore_errors) { 
EventHandler.register(r, "onerror", this.handleDetails, this);
} else {
EventHandler.register(r, "onerror", this.handleDetailsError, this);
}
if(queue==true || this.i_queue_reqs==true) {
APIManager.addQueue(r);
}else{
APIManager.execute(r);
}
}else{ 
if(this.onloaddetails!=null) {
var o={
type: "loaddetails",
event: this
};
this.onloaddetails(o);
}
}
this.queueRequests(false);
if (queue!=true) {
APIManager.executeQueue();
}
}
CalendarEvent.prototype.handleDetailsError=function(o) {
console.log("CalendarEvent.prototype.handleDetailsError:"+o.response.data());
}
CalendarEvent.prototype.handleDetails=function(o) {
var data=o.response.data();
var instance=o.request.i_instance;
this.i_details_loaded=true;
this.ignoreChange(true);
this.ignoreRefresh(true);
var events=data.xPath("event");
if(events.length > 0) {
var event=events[0];
if (this.id() && parseInt(event.children("id", 0, true))!=this.id()) {
this.i_previousInfo=[this.id(), this.startTime(), this.endTime()];
}
this.id(parseInt(event.children("id", 0, true)));
this.parentId(parseInt(event.children("parentId", 0, true)));
this.ownerId(event.children("ownerId", 0, true), true);
this.calendarId(event.children("calendarId", 0, true));
this.priority(event.children("priority", 0, true));
var duration=(parseInt(event.children("duration", 0, true)));
this.recurrence(event.children("recurrence", 0, true));
this.eventType(event.children("type", 0, true));
this.meetingRequestState(event.children("meetingRequestState", 0, true));
this.timezone(event.children("timeZone", 0, true));
this.allDay(event.children("allDay", 0, true)=="1");
this.personal(event.children("personal", 0, true)=="1");
this.timezoneOffset(event.children("timeDiff", 0, true));
this.ownerDisplayName(event.children("ownerDisplayName", 0, true));
this.lastModifierId(event.children("lastModifierId", 0, true));
this.lastModifiedDate(event.children("lastModifiedDate", 0, true));			
this.lastModifierDisplayName(event.children("lastModifierDisplayName", 0, true));
this.title(event.children("eventTitle", 0, true));
this.description(event.children("description", 0, true));
this.location(event.children("location", 0, true));
if(!instance) {
if(this.allDay()) {
this.startTime(floorDay(iCaltoDate(event.children("startDate", 0, true))));
} else {
this.startTime(iCaltoUTCDate(event.children("startDate", 0, true)));
}
if(this.recurrence()!=undefined && this.recurrence()!=false) {
this.endTime(addMinutes(this.startTime(), duration));
}else{
if(this.allDay()) {
this.endTime(floorDay(iCaltoDate(event.children("endDate", 0, true))));
} else {
this.endTime(iCaltoUTCDate(event.children("endDate", 0, true)));
}
}
}
var ev_conflict=(parseInt(event.children("conflict", 0, true))==1 ? true : false);
this.conflict(ev_conflict);
if (ev_conflict) {
this.numberConflicts(parseInt(event.children("numberConflicts", 0, true)));
this.firstConflictTitle(event.children("firstConflictTitle", 0, true));
this.firstConflictStartDate(iCaltoUTCDate(event.children("firstConflictStartDate", 0, true)));
this.firstConflictDuration(parseInt(event.children("firstConflictDuration", 0, true)));
this.updateConflictIconTip();
}
this.emailHost((event.children("emailowner", 0, true)=="1" ? true : false));
}
this.ignoreChange(false, true);
this.ignoreRefresh(false);
if(this.onloaddetails!=null) {
var o={
type: "loaddetails",
event: this
};
this.onloaddetails(o);
}
}
CalendarEvent.prototype.validateTime=function(attendees, ownerId, startDate, endDate) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "validate_time"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("ownerId", ownerId));
dn.addNode(new DataNode("attendees", attendees));
dn.addNode(new DataNode("startDate", dateToUTCICal(startDate)));
dn.addNode(new DataNode("endDate", dateToUTCICal(endDate)));
if (!this.isNew()) dn.addNode(new DataNode("eventId", this.id()));
var r=new RequestObject("Event", "validate_time", dn);
EventHandler.register(r, "oncomplete", this.handleValidateTime, this);
EventHandler.register(r, "onerror", this.handleValidateTimeError, this);
r.execute();
}
CalendarEvent.prototype.handleValidateTimeError=function(e) {
console.log("CalendarEvent.prototype.handleValidateTimeError:"+e.response.data());
}
CalendarEvent.prototype.handleValidateTime=function(e) {
var data=e.response.data();
var users=data.xPath("user");
var user_strings=[];
for(var x=0; x < users.length; x++) {
user_strings.push(users[x].value());
}
if(this.onvalidatetime!=null) {
var o={
type: "validatetime",
users: user_strings
};
this.onvalidatetime(o);
}
}
CalendarEvent.prototype.findFirstAvailable=function(attendees, startDate, duration) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "findfirstavailable"));
dn.addNode(new DataNode("aId", user_prefs['user_id'])) ;
dn.addNode(new DataNode("userId", user_prefs['user_id']));
dn.addNode(new DataNode("attendees", attendees));
dn.addNode(new DataNode("startDate", dateToUTCICal(startDate)));
dn.addNode(new DataNode("duration", duration));
var r=new RequestObject("Calendar", "findfirstavailable", dn);
EventHandler.register(r, "oncomplete", this.handleFirstAvailable, this);
EventHandler.register(r, "onerror", this.handleFirstAvailableError, this);
r.execute();
}
CalendarEvent.prototype.handleFirstAvailableError=function(e) {
console.log("CalendarEvent.prototype.handleFirstAvailableError:"+e.response.data());
}
CalendarEvent.prototype.handleFirstAvailable=function(e) {
var data=e.response.data();
var start=data.xPath("startDate");
if(this.onfindfirstavailable!=null) {
var o={
type: "findfirstavailable",
times: start
};
this.onfindfirstavailable(o);
}
}
CalendarEvent.prototype.fireRefresh=function() {
if (this.onrefresh!=undefined) {
var o=new Object();
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}
}
CalendarEvent.prototype.fireChange=function() {
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.entry=this;
this.onchange(o);
}
}
CalendarEvent.prototype.save=function(instance) {
CalendarDataModel.saveEvents(this, instance);
}
CalendarEvent.prototype.handleSaveError=function(e) {
console.log("CalendarEvent.prototype.handleSaveError:"+e.response.data());
if (this.onsaveerror!=undefined) {
var o={
type: "saveerror"
}
this.onsaveerror(o);
}
}
CalendarEvent.prototype.handleSave=function(e) {
if (e.request.i_instance==true) {
this.i_dm_params['pm_recurrence']="";
}
this.handleDetails(e);
if(this.i_dm_params['pm_recurrence_change']==true) {
var pdm=this.parentDataModel();
pdm.removeEvent(this);
pdm.addRecurringEvent(this);
}
this.i_dm_params['pm_recurrence_change']=false;
if(e.request.i_wasNewEvent || e.request.i_instance==true) {
if(e.request.i_wasNewEvent==true) {
var files=this.stagedFiles();
var q=[];
for(var x=0; x < files.length; x++) {
var f=files[x];
var dn=new DataNode("params");
var att=dn.addNode(new DataNode("attachment"));
att.addNode(new DataNode("attachmentid", f.id()));
att.addNode(new DataNode("userId", user_prefs['user_id']));
att.addNode(new DataNode("objectType", "0"));
att.addNode(new DataNode("objectId", this.id()));
var r=new RequestObject("CalendarAttachment", "attachstaged", dn);
q.push(r);
}
if(q.length > 0) {
APIManager.addQueue(q); 
}
}
if(this.reminder()) {
var rem=this.reminder();
rem.date(addMinutes(this.startTime(), -1 * parseInt(rem.interval())));
var reminderDM=CalendarReminderDataModel.getDefaultDataModel();
var dm_reminder=reminderDM.getItemById(rem.objectId());
if(dm_reminder!=undefined) {
CalendarReminderDataModel.saveReminders(this.reminder());
} else {
CalendarReminderDataModel.createReminder(this.reminder());
}
}
APIManager.executeQueue();
}
if(this.onsave!=null) {
var o={
type: "save",
event: this,
wasNew: e.request.i_wasNewEvent
};
this.onsave(o);
}
}
CalendarEvent.prototype.stagedFiles=function(files) {
if(files!=undefined) {
this.i_staged_files=files;
}
return this.i_staged_files;
}
CalendarEvent.prototype.destroy=function(instance) {
CalendarDataModel.deleteEvents(this, instance);
}
CalendarEvent.prototype.handleDelete=function(e) {
}
CalendarEvent.prototype.handleDeleteError=function(e) {
console.log("CalendarEvent.prototype.handleDeleteError:"+e.response.data());
}
CalendarEvent.prototype.queueRequests=function(q) {
if(q!=undefined) {
if(q) {
this.i_queue_reqs=true;
}else{
this.i_queue_reqs=false;
}
}
return this.i_queue_reqs;
}
CalendarEvent.fromICS=function(ics_file) {
var ev=new CalendarEvent();
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "createFromICal"));
dn.addNode(new DataNode("iCal", ics_file));
dn.addNode(new DataNode("calid", CalendarDataModel.getDefaultCalendar().id()));
dn.addNode(new DataNode("userid", user_prefs['user_id']));
dn.addNode(new DataNode("tz", user_prefs['timezone']));
var r=new RequestObject("Event", "createFromICal", dn);
EventHandler.register(r, "oncomplete", ev.handleDetails, ev);
EventHandler.register(r, "onerror", ev.handleFromICSError, ev);
r.execute();
return ev;
}
CalendarEvent.prototype.handleFromICSError=function(e) {
console.log("CalendarEvent.prototype.handleFromICSError:"+e.response.data());
}
CalendarEvent.inherit(DataModelNode);
function EventAttendee(userId, displayName, alias, status) {
this.superDataModelNode(userId);
this.i_dm_params['pm_user_id']=userId;
this.i_dm_params['pm_displayName']=displayName;
this.i_dm_params['pm_alias']=alias;
this.status(status); 
this.selectedStyleClass(1);
}
EventAttendee.prototype.userId=function(user_id) {
if (user_id!=undefined && this.i_dm_params['pm_user_id']!=user_id) {
this.i_dm_params['pm_user_id']=user_id;
this.fireChange();
}
return this.i_dm_params['pm_user_id'];
}
EventAttendee.prototype.displayName=function(displayName) {
if (displayName!=undefined && this.i_dm_params['pm_displayName']!=displayName) {
this.i_dm_params['pm_displayName']=displayName;
this.fireChange();
}
return this.i_dm_params['pm_displayName'];
}
EventAttendee.prototype.defaultAlias=function(alias) {
if (alias!=undefined && this.i_dm_params['pm_alias']!=alias) {
this.i_dm_params['pm_alias']=alias;
this.fireChange();
}
return this.i_dm_params['pm_alias'];
}
EventAttendee.prototype.status=function(status) {
if (status!=undefined && this.i_dm_params['pm_status']!=status) {
this.i_dm_params['pm_status']=status;
this.i_dm_params['pm_status_text']=CalendarEvent.meetingRequestStates[parseInt(status)];
this.fireChange();
}
return this.i_dm_params['pm_status'];
}
EventAttendee.inherit(DataModelNode);
function EventAttendeesDataModel() {
this.superDataModelNode("root");
}
EventAttendeesDataModel.inherit(DataModelNode);
function MeetingRequestDataModel(id) {
this.superDataModelNode(id);
this.i_loaded=false;
this.i_type="meeting_requests";
this.i_ev_cache=Array();
this.i_owner_id=user_prefs['user_id'];
EventHandler.register(this, "ongetitems", this.handleGetItems, this);
}
MeetingRequestDataModel.refreshRate=5;
MeetingRequestDataModel.prototype.ownerId=function(id) {
if (id!=undefined) {
this.i_owner_id=id;
}
return this.i_owner_id;
}
MeetingRequestDataModel.prototype.handleGetItems=function(e) {
var d=new Date();
if (this.i_loaded===false || this.i_loaded <=(d.getTime() - (MeetingRequestDataModel.refreshRate * 60000))) {
if (this.i_req!=true) {
e.cancel=true;
this.refresh();
}
}
}
MeetingRequestDataModel.prototype.handleEventListError=function(e) {
console.log("MeetingRequestDataModel.prototype.handleEventListError:"+e.response.data());
this.i_req=false;
}
MeetingRequestDataModel.prototype.handleEventList=function(e) {
this.ignoreRefresh(true);
var def_dm=CalendarDataModel.getDefaultCalendar();
var uid=(Math.random() * 9999999);
var data=e.response.data();
var events=data.xPath("meetingRequestList/event");
for (var x=0; x < events.length; x++){ 
var ev_id=parseInt(events[x].children("id", 0, true));
var evx_start=events[x].children("startDate", 0, true);
var evx_end=events[x].children("endDate", 0, true);
var addItem=true;
for (var z=0; z < this.i_ev_cache.length; z++) {
if (this.i_ev_cache[z].id==ev_id) {
addItem=false;
this.i_ev_cache[z].uid=uid;
if (this.i_ev_cache[z].start!=evx_start || this.i_ev_cache[z].end!=evx_end) {
def_dm.removeEvent(this.i_ev_cache[z].event);
this.removeItem(this.i_ev_cache[z].event);
this.i_ev_cache.splice(z, 1);
addItem=true;
break;
}
}
}
if (addItem) {
var ev_start=iCaltoUTCDate(evx_start);
var ev_end=iCaltoUTCDate(evx_end);
var ev_title=events[x].children("eventTitle", 0, true);
var ev_allday=parseInt(events[x].children("allday", 0, true));
var ev_cal_id=parseInt(events[x].children("calendarId", 0, true));
var ev_conflict=(parseInt(events[x].children("conflict", 0, true))==1 ? true : false);
var ev=this.addItem(new CalendarEvent(ev_id, ev_title, ev_start, ev_end, (ev_allday==1 ? true : false)));
ev.meetingRequestState(events[x].children("meetingRequestState", 0, true));
ev.ownerDisplayName(events[x].children("ownerDisplayName", 0, true));
ev.calendarId(ev_cal_id);
ev.recurrence(events[x].children("recurrence", 0, true));
ev.parentId(parseInt(events[x].children("parentId", 0, true)));
ev.i_request=true;
ev.selectedStyleClass(1);
ev.conflict(ev_conflict);
if (ev_conflict) {
ev.numberConflicts(parseInt(events[x].children("numberConflicts", 0, true)));
ev.firstConflictTitle(events[x].children("firstConflictTitle", 0, true));
ev.firstConflictStartDate(iCaltoUTCDate(events[x].children("firstConflictStartDate", 0, true)));
ev.firstConflictDuration(parseInt(events[x].children("firstConflictDuration", 0, true)));
ev.updateConflictIconTip();
}
this.i_ev_cache[this.i_ev_cache.length]={'event':ev, 'id':ev_id, 'start':evx_start, 'end':evx_end, 'uid':uid};
if (this.i_first_load==true) {
def_dm.addRecurringEvent(ev);
}
}
}
for (var x=this.i_ev_cache.length - 1; x >=0; x--) {
if (this.i_ev_cache[x].uid!=uid) {
if (def_dm!=undefined) {
var ev_old=def_dm.getItemById(this.i_ev_cache[x].id, true, false);
if (ev_old!=undefined) {
if (ev_old.meetingRequestState()!=2) {
def_dm.removeEvent(ev_old);
}
}
}
this.removeItem(this.i_ev_cache[x].event);
this.i_ev_cache.splice(x, 1);
}
}
this.i_first_load=true;
this.i_req=false;
this.i_loaded=(new Date()).getTime();
this.ignoreRefresh(false);
}
MeetingRequestDataModel.prototype.removeEventById=function(ev_id) {
for (var z=0; z < this.i_ev_cache.length; z++) {
if (this.i_ev_cache[z].id==ev_id) {
this.removeItem(this.i_ev_cache[z].event);
this.i_ev_cache.splice(z, 1);
break;
}
}
}
MeetingRequestDataModel.prototype.addEvent=function(event) {
this.addItem(event);
this.i_ev_cache.push({
'event':event,
'id':event.id(),
'start':event.startTime(),
'end':event.endTime(),
'uid':(Math.random() * 9999999)
});
}
MeetingRequestDataModel.prototype.refreshRequest=function(force) {
var request;
if(!this.i_req || force) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "listMeetingRequests"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("meetingRequestState", "1"));
request=new RequestObject("Calendar", "listmeetingrequests", dn);
EventHandler.register(request, "oncomplete", this.handleEventList, this);
EventHandler.register(request, "onerror", this.handleEventListError, this);
this.i_req=true;
}
return request;
}
MeetingRequestDataModel.prototype.refresh=function(force) {
var request=this.refreshRequest(force);
if(request) {
request.execute();
}
return request;
}
MeetingRequestDataModel.inherit(DataModelNode);
function CalendarReminderDataModel() {
this.superDataModelNode(9978);
this.i_last_scheduled=0;
this.i_calevents=[];
this.i_calendars=[];
this.i_notassociated=0;
}
CalendarReminderDataModel.refreshRate=60;
CalendarReminderDataModel.scheduledViewOffset=60000;
CalendarReminderDataModel.getDefaultDataModel=function() {
if(CalendarReminderDataModel.DEFAULTDM==undefined) {
CalendarReminderDataModel.DEFAULTDM=new CalendarReminderDataModel();
}
return CalendarReminderDataModel.DEFAULTDM;
}
CalendarReminderDataModel.prototype.refreshRequest=function(force) {
var request;
if (this.i_loading==undefined || force) {
this.i_loading=[];
if (force) this.i_forcedrefresh=true;
var d=new Date();
d.setTime(d.getTime()+7200000);
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "list"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("userId", user_prefs['user_id']));
dn.addNode(new DataNode("endDate", dateToUTCICal(d)));
var request=new RequestObject("Reminder", "list", dn);
EventHandler.register(request, "oncomplete", this.handleListRefresh, this);
EventHandler.register(request, "onerror", this.handleListRefreshError, this);
}
return request;
}
CalendarReminderDataModel.prototype.refreshList=function(force) {
var request=this.refreshRequest(force);
if(request) {
request.execute();
}
}
CalendarReminderDataModel.prototype.handleEventDelete=function(e) {
for (var i=0; i < e.events.length;++i) {
var event=e.events[i];
var reminder=this.getItemById(event.id());
if (reminder!=undefined) {
if (reminder.eventObject()!=undefined) {
reminder.eventObject().reminder(false);
reminder.eventObject(null);
}
this.removeItem(reminder);
}
}
}
CalendarReminderDataModel.prototype.handleEventRefresh=function(e, force) {
if (e.collection.i_ev_type=="event") {
var rem=this.getItemById(e.collection.id());
if (rem) rem.updateFromEvent();
} else {
var dm=e.collection;
if (this.i_notassociated > 0 || force) {
this.i_notassociated=0;
var items=this.items();
for (var idx in items) {
var item=items[idx];
if (typeof item!="object" || item==null) continue;
if (!force && item.i_eventFromCal) continue;
var event=this.getEventFromCalendars(item.id(), item.interval(), dm);
var itemEvent=item.eventObject();
if (event!=undefined) {
item.i_eventFromCal=true;
item.eventObject(event);
event.reminder(item);
item.updateFromEvent();
} else if (itemEvent && itemEvent.parentDataModel()==itemEvent) {
item.i_eventFromCal=false;++this.i_notassociated;
}
}
}
}
}
CalendarReminderDataModel.prototype.handleCalendarAdd=function(e) {
this.i_calevents["i1-"+e.item.id()]=EventHandler.register(e.item.calendar(), "ondelete", this.handleEventDelete, this);
this.i_calevents["i2-"+e.item.id()]=EventHandler.register(e.item.calendar(), "onrefresh", this.handleEventRefresh, this);
this.i_calendars.push(e.item.calendar());
}
CalendarReminderDataModel.prototype.handleCalendarRemove=function(e) {
this.i_calevents["i1-"+e.item.id()]=this.i_calevents["i1-"+e.item.id()].unregister();
this.i_calevents["i2-"+e.item.id()]=this.i_calevents["i2-"+e.item.id()].unregister();
for (var i=0; i < this.i_calendars.length;++i) {
if (this.i_calendars[i]==e.item.calendar()) this.i_calendars.splice(i--,1);
}
}
CalendarReminderDataModel.prototype.handleListRefreshError=function(e) {
console.log("CalendarReminderDataModel.prototype.handleListRefreshError:"+e.response.data());
this.i_loading=undefined;
}
CalendarReminderDataModel.prototype.handleListRefresh=function(e) {
this.ignoreRefresh(true);
if (this.i_forcedrefresh) {
this.clear();
this.i_notassociated=0;
this.i_loading=[];
this.i_forcedrefresh=undefined;
}
var reminders=e.response.data().xPath("reminder");
for (var i=0; i < reminders.length;++i) {
var objId=reminders[i].children("objectId", 0, true),
objType=reminders[i].children("objectType", 0, true),
evOwnerId=reminders[i].children("userId", 0, true),
date=iCaltoUTCDate(reminders[i].children("reminderDate", 0, true)),
type=parseInt(reminders[i].children("reminderType", 0, true)),
status=reminders[i].children("reminderStatus", 0, true),
interval=reminders[i].children("reminderInterval", 0, true),
event=undefined,
reminder=this.getItemById(objId);
if (type==4 || type==6) {
if (reminder!=undefined) {
reminder.ignoreChange(true);
reminder.type(type);
reminder.objectType(objType);
reminder.date(date);
reminder.status(status);
reminder.interval(interval);
reminder.ignoreChange(false);
if (reminder.eventObject().id()==objId
&& reminder.eventObject().parentDataModel()!=reminder.eventObject()) {
event=reminder.eventObject();
}
} else {
reminder=new CalendarReminder(objId, objType, date, type, status, interval);
}
if (event==undefined) {
event=this.getEventFromCalendars(reminder.id(), reminder.interval());
if (event) {
reminder.i_eventFromCal=true;
if (this.i_notassociated > 0) --this.i_notassociated;
}
}
if (event==undefined) {
event=new CalendarEvent(objId);
event.ignoreChange(true);
event.ownerId(evOwnerId);
event.loadDetails(false, false, true);
event.ignoreChange(false);
EventHandler.register(event, "onloaddetails", this.handleLoadDetails, this);
if (this.i_loading==undefined) this.i_loading=[];
this.i_loading[this.i_loading.length]=reminder;
}
event.reminder(reminder, true);
reminder.eventObject(event);
reminder.updateFromEvent();
}
}
if (this.i_loading==undefined || this.i_loading.length==0) {
this.i_loading=undefined;
this.ignoreRefresh(false);
} else if (reminders.length > 0 && this.i_loading.length > 0) {
APIManager.executeQueue();
}
}
CalendarReminderDataModel.prototype.handleLoadDetails=function(e) {
if (this.i_loading==undefined) return; 
var maxReminderDue=new Date().valueOf()+CalendarReminderDataModel.scheduledViewOffset;
for (var ri=this.i_loading.length-1; ri > -1 ; --ri) {
var reminder=this.i_loading[ri];
if (reminder.i_id==e.event.i_id) {
reminder.i_visible=(reminder.date().valueOf() <=maxReminderDue);
reminder.i_eventFromCal=false;
reminder.updateFromEvent(e.event);
this.i_loading.splice(ri, 1);++this.i_notassociated;
}
}
if (this.i_loading.length==0) {
this.i_loading=undefined;
this.ignoreRefresh(false);
}
}
CalendarReminderDataModel.prototype.getEntries=function(start, count, sortBy){
return this.getScheduledReminders(60,sortBy).slice(start, start+count);
}
CalendarReminderDataModel.prototype.getScheduledReminders=function(seconds, sortBy) {
var offset=(seconds!=undefined ? seconds * 1000 : CalendarReminderDataModel.scheduledViewOffset);
var maxReminderDue=new Date().valueOf()+offset;
var ret=Array();
var changed=false;
var items=this.items();
for (var i=0; i < items.length;++i) {
if (items[i]==undefined || items[i]==null) continue;
var state=(items[i].date().valueOf() <=maxReminderDue);
if (items[i].i_visible!=state) {
items[i].i_visible=state;
changed=true;
}
if (items[i].i_visible) ret.push(items[i]);
}
if (changed || this.i_last_scheduled!=ret.length) {
this.handleClearCache({'type':'clearcache'});
this.i_last_scheduled=ret.length;
}
if (sortBy!=undefined) {
ret.sort();
if (sortBy=="desc") ret.reverse();
}
return ret;
}
CalendarReminderDataModel.prototype.getEventFromCalendars=function(id, interval, calendars) {
var lastOffset=Infinity,
event=null,
interval=(parseInt(interval) || 0),
id=(parseInt(id) || 0),
today=new Date().valueOf();
if (calendars==undefined) calendars=this.i_calendars;
else if (!calendars.splice) calendars=[calendars];
for (var cal=0; cal < calendars.length;++cal) {
var items=calendars[cal].getItemById(id, true, true);
for (var i=0; i < items.length;++i) {
var myTime=items[i].param("start").valueOf();
if (items[i].i_occurrenceDate && items[i].i_occurrenceDate.valueOf()!=myTime) {
myTime=items[i].i_occurrenceDate.valueOf();
}
var reminderTime=addMinutes(new Date(myTime), -1 * interval).valueOf();
if (today >=reminderTime && Math.abs(myTime - today) < lastOffset) {
lastOffset=Math.abs(myTime - today);
event=items[i];
}
}
}
return event;
}
CalendarReminderDataModel.dismissReminders=function(reminders, user_id) {
var uid;
if (user_id==undefined)
uid=user_prefs['user_id'];
else
uid=user_id;
if (reminders.splice==undefined) {
reminders=[reminders];
}
var reminderDM=CalendarReminderDataModel.getDefaultDataModel();
var resumeEvents=!reminderDM.ignoreRefresh() ? reminderDM.ignoreRefresh(true) : false;
var q=[];
for (var x=0; x < reminders.length; x++) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "dismiss"));
dn.addNode(new DataNode("aId", uid));
dn.addNode(reminders[x].dataNode());
var r=new RequestObject("Reminder", "dismiss", dn);
var oldr=reminderDM.getItemById(reminders[x].id());
if (typeof reminders[x].eventObject()=="object" && reminders[x].eventObject().reminder()==oldr) {
reminders[x].eventObject().reminder(false);
}
reminders[x].eventObject(null);
if (oldr==reminders[x]) {
reminderDM.removeItem(oldr);
}
q.push(r);
}
if (!resumeEvents) {
reminderDM.ignoreRefresh(false);
}
reminderDM.forceRefresh();
if (q.length > 0) {
APIManager.execute(q);
}
}
CalendarReminderDataModel.saveReminders=function(reminders, user_id) {
var uid;
if (user_id==undefined)
uid=user_prefs['user_id'];
else
uid=user_id;
if(reminders.splice==undefined) { 
reminders=[reminders];
}
var q=[]; 
var reminderDM=CalendarReminderDataModel.getDefaultDataModel();
reminderDM.ignoreRefresh(true);
for(var x=0; x < reminders.length; x++) {
var type=parseInt(reminders[x].type());
var reminder=null, dn=null;
reminder=new CalendarReminder();
reminder.dataNode(reminders[x].dataNode());
reminder.isEmail(true);
dn=new DataNode("params");
dn.addNode(new DataNode("method", "update"));
dn.addNode(new DataNode("aId", uid));
dn.addNode(reminder.dataNode());
q.push(new RequestObject("Reminder", "update", dn));
reminder=new CalendarReminder();
reminder.dataNode(reminders[x].dataNode());
reminder.isPopup(true);
dn=new DataNode("params");
dn.addNode(new DataNode("method", "update"));
dn.addNode(new DataNode("aId", uid));
dn.addNode(reminder.dataNode());
var request=new RequestObject("Reminder", "update", dn);
EventHandler.register(request, "oncomplete", reminderDM.handleListRefresh, reminderDM);
EventHandler.register(request, "onerror", reminderDM.handleListRefreshError, reminderDM);
q.push(request);
}
reminderDM.ignoreRefresh(false,true);
if (q.length > 0) {
APIManager.execute(q); 
}
}
CalendarReminderDataModel.createReminder=function(reminder, user_id) {
var reminderDM=CalendarReminderDataModel.getDefaultDataModel();
var type=parseInt(reminder.type());
var outbound, dn, q=[];
var uid;
if (user_id==undefined)
uid=user_prefs['user_id'];
else
uid=user_id;
outbound=new CalendarReminder();
outbound.dataNode(reminder.dataNode());
outbound.eventObject(reminder.eventObject());
outbound.type(2);
dn=new DataNode("params");
dn.addNode(new DataNode("method", "create"));
dn.addNode(new DataNode("aId", uid));
dn.addNode(outbound.dataNode());
q.push(new RequestObject("Reminder", "create", dn));
outbound=new CalendarReminder();
outbound.dataNode(reminder.dataNode());
outbound.eventObject(reminder.eventObject());
outbound.isPopup(true);
dn=new DataNode("params");
dn.addNode(new DataNode("method", "create"));
dn.addNode(new DataNode("aId", uid));
dn.addNode(outbound.dataNode());
var rObj=new RequestObject("Reminder", "create", dn);
EventHandler.register(rObj, "oncomplete", reminderDM.handleListRefresh, reminderDM);
EventHandler.register(rObj, "onerror", reminderDM.handleListRefreshError, reminderDM);
q.push(rObj);
if (q.length > 0) {
APIManager.execute(q); 
}
}
CalendarReminderDataModel.deleteReminders=function(reminders, user_id) {
var uid;
if (user_id==undefined)
uid=user_prefs['user_id'];
else
uid=user_id;
if(reminders.splice==undefined) {
reminders=[reminders];
}
var q=[];
var reminderDM=CalendarReminderDataModel.getDefaultDataModel();
var resumeEvents=!reminderDM.ignoreRefresh() ? reminderDM.ignoreRefresh(true) : false;
for(var x=0; x < reminders.length; x++) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "delete"));
dn.addNode(new DataNode("aId", uid));
dn.addNode(reminders[x].dataNode());
var r=new RequestObject("Reminder", "delete", dn);
var oldr=reminderDM.getItemById(reminders[x].id());
if (typeof reminders[x].eventObject()=="object" && reminders[x].eventObject().reminder()==oldr) {
reminders[x].eventObject().reminder(false);
}
reminders[x].eventObject(null);
if (oldr==reminders[x]) {
reminderDM.removeItem(oldr);
}
q.push(r);
}
if (resumeEvents) {
reminderDM.ignoreRefresh(false);
}
if (q.length > 0) {
APIManager.execute(q); 
}
}
CalendarReminderDataModel.inherit(DataModelNode);
function CalendarReminder(object_id, object_type, reminder_date, type, status, interval, user_id) {
if (object_id!=undefined && typeof object_id!="number") object_id=parseInt(object_id);
if (object_id!=undefined && object_id!=0 && (type==4 || type==6)) {
var reminder=CalendarReminderDataModel.getDefaultDataModel().getItemById(object_id);
if (reminder!=undefined) return reminder;
}
this.superDataModelNode((object_id==undefined ? 0 : object_id));
this.i_objectId=(object_id!=undefined ? object_id : 0);
this.i_id=this.i_objectId;
this.i_objectType=(object_type!=undefined ? object_type : 0);
if (reminder_date!=undefined) {
var maxReminderDue=new Date().valueOf()+CalendarReminderDataModel.scheduledViewOffset;
this.i_visible=(reminder_date.valueOf() <=maxReminderDue);
this.i_date=reminder_date;
} else {
this.i_date=null;
this.i_visible=false;
}
this.i_type=(type!=undefined ? type : 0);
this.i_status=(status!=undefined ? ((status=="1" || status===true) ? true : false) : false);		
this.i_interval=(interval!=undefined ? interval : 5);
this.i_userid=(user_id!=undefined ?	user_id : user_prefs['user_id']);
this.selectedStyleClass(1);
if (object_id!=undefined && object_id!=0 && (this.i_type==4 || this.i_type==6)) {
return CalendarReminderDataModel.getDefaultDataModel().addItem(this);
}
}
CalendarReminder.prototype.objectId=function(o) {
if(o!=undefined && this.i_objectId!=o) {
if (typeof o!="number") o=parseInt(o);
this.i_objectId=o;
this.id(o);
this.fireChange();
}
return this.i_objectId;
}
CalendarReminder.prototype.userId=function(o) {
if(o!=undefined && this.i_userid!=o) {
this.i_userid=o;
this.fireChange();
}
return this.i_userid;
}
CalendarReminder.prototype.objectType=function(o) {
if(o!=undefined && this.i_objectType!=o) {
this.i_objectType=o;
this.fireChange();
}
return this.i_objectType;
}
CalendarReminder.prototype.date=function(o) {
if(o!=undefined && this.i_date!=o) {
this.i_date=o;
var maxReminderDue=new Date().valueOf()+CalendarReminderDataModel.scheduledViewOffset;
this.i_visible=(o && o.valueOf() <=maxReminderDue);
this.fireChange();
this.fireRefresh();
}
return this.i_date;
}
CalendarReminder.prototype.type=function(o) {
if(o!=undefined && this.i_type!=o) {
this.i_type=o;
this.fireChange();
}
return this.i_type;
}
CalendarReminder.prototype.isEmail=function(email) {
if(email) {
this.type(2);
}
return ((this.type() & 2)==2) ? true : false;
}
CalendarReminder.prototype.isPopup=function(popup) {
if(popup) {
this.type(4);
}
return ((this.type() & 1)==1 || (this.type() & 4)==4) ? true : false;
}
CalendarReminder.prototype.status=function(o) {
if(o!=undefined && this.i_status!=o) {
this.i_status=o;
this.fireChange();
}
return this.i_status;
}
CalendarReminder.prototype.interval=function(o) {
if(o!=undefined && this.i_interval!=o) {
this.i_interval=o;
this.fireChange();
}
return this.i_interval;
}
CalendarReminder.prototype.eventObject=function(ev) {
if (ev!=undefined && this.i_event_object!=ev) {
this.i_event_object=ev;
this.updateFromEvent(ev);
}
return this.i_event_object;
}
CalendarReminder.prototype.updateFromEvent=function(event) {
if (event==undefined) event=this.eventObject();
if (typeof event=="object" && event!=null) {
this.param("location", htmlEncode(event.location()));
this.param("start", event.startTime());
if (event.startTime()!=undefined) {
this.param("startstring", getFullDateTimeString(event.startTime(), true, true).replace(/,|\./g, ""));
} else {
this.param("startstring", "");
}
this.param("end", event.endTime());
this.param("description", htmlEncode(event.description()));
this.param("title", htmlEncode(event.title()));
}
}
CalendarReminder.prototype.dataNode=function(node) {
if(node!=undefined) {
this.i_objectId=parseInt(node.children("objectId", 0, true));
this.i_id=this.i_objectId;
this.i_objectType=parseInt(node.children("objectType", 0, true));
this.i_type=parseInt(node.children("reminderType", 0, true));
this.i_date=iCaltoUTCDate(node.children("reminderDate", 0, true));
this.i_status=(parseInt(node.children("reminderStatus", 0, true))==1 ? true : false);
this.i_interval=parseInt(node.children("reminderInterval", 0, true));
this.i_userid=node.children("userId", 0, true);
}
var dn=new DataNode("reminder");
dn.addNode(new DataNode("objectId", ""+this.i_objectId));
dn.addNode(new DataNode("objectType", ""+this.i_objectType));
dn.addNode(new DataNode("reminderDate", dateToUTCICal(this.i_date)));
dn.addNode(new DataNode("reminderType", ""+this.i_type));
dn.addNode(new DataNode("reminderStatus", (this.i_staus==true ? "1" : "0")));
dn.addNode(new DataNode("reminderInterval", ""+this.i_interval));
dn.addNode(new DataNode("userId", this.i_userid));
return dn;
}
CalendarReminder.prototype.save=function() {
CalendarReminderDataModel.saveReminders(this);
}
CalendarReminder.prototype.dismiss=function() {
CalendarReminderDataModel.dismissReminders(this);
}
CalendarReminder.inherit(DataModelNode);
JavaScriptResource.notifyComplete("./src/Applications/Calendar/DataModels/DataModel.Calendar.js");	
function CalendarDisplay(app, width, height, useTabs) {
this.i_application=app;
this.i_width=width;
this.i_height=height;
EventHandler.register(this.i_application, "onload", this.handleAppLoad, this);
}
CalendarDisplay.prototype.ondragcreate=null;
CalendarDisplay.prototype.application=function(app) {
if (app!=undefined) {
this.i_application=app;
}
return this.i_application;
}
CalendarDisplay.prototype.width=function(width) {
if (width!=undefined) {
if (width < 200) {
width=200;
}
this.i_width=width;
if (this.i_view!=undefined) {
this.i_tabs.width(width);
width=this.i_tabs.contentWidth() - 2;
this.i_calendar_tools.width(width);
this.i_calendar.width(width);
if (this.i_request_list!=undefined) {
this.i_request_list.width(width);
}
}
}
return this.i_width;
}
CalendarDisplay.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (height < 200) {
height=200;
}
if (this.i_view!=undefined) {
this.i_tabs.height(height);
height=this.i_tabs.contentHeight() - 2;
this.i_calendar.height(height - this.i_calendar_tools.height());
if (this.i_request_list!=undefined) {
this.i_request_list.height(height);
}
}
}
return this.i_height;
}
CalendarDisplay.prototype.handleMonthlyLoad=function(e) {
if (this.i_t_monthly!=undefined && !this.i_t_monthly.active()) {
this.i_t_monthly.active(true);
}
}
CalendarDisplay.prototype.handleWeeklyLoad=function(e) {
if (this.i_t_weekly!=undefined && !this.i_t_weekly.active()) {
this.i_t_weekly.active(true);
}
}
CalendarDisplay.prototype.handleDailyLoad=function(e) {
if (this.i_t_daily!=undefined && !this.i_t_daily.active()) {
this.i_t_daily.active(true);
}
}
CalendarDisplay.prototype.handleActiveDataModel=function(e) {
var dm=this.i_calendar.activeDataModel();
this.i_newevent_btn.enabled(dm.access()=="All" ? true : false);
}
CalendarDisplay.prototype.handleCalendarConfig=function(e) {
var dm=e.dataModel;
var s=dm.startTime().copy();
var e=dm.endTime().copy();
var types=this.i_calendar.viewTypes();
for (var x=0; x < types.length; x++){ 
if (types[x].startDate!=undefined) {
types[x].startDate(s);
types[x].endDate(e);
}
}
this.i_calendar.increment(parseInt(60 / dm.timeInterval()));
this.i_calendar.startingDay(dm.weekStartDay() - 1);
this.i_calendar.military(user_prefs['time_prefs']=="%I:%M %p"  ? false : true);
if (this.i_set_default!=true) {
var dm=CalendarDataModel.getDefaultCalendar();
if (dm!=undefined) {
var view_id=dm.defaultCalendarView();
if (view_id==2) {
this.loadMonthly();
}
if (view_id==3) {
this.loadWeekly();
}
if (view_id==4) {
this.loadDaily();
}
}
}
}
CalendarDisplay.prototype.handleDeleteEvent=function(e) {
var ev=e.item.parent().i_event;
var d=DialogManager.confirm("Are you sure you want to delete this "+(ev.type()=="event" ? "event" : "task")+"?", "Delete "+(ev.type()=="event" ? "Event" : "Task"), undefined, Array("Yes", "No"), true, false, 1);
d.i_event=ev;
EventHandler.register(d, "onclose", this.handleDeleteEventConfirm, this);
}
CalendarDisplay.prototype.handleDeleteEventConfirm=function(e) {
if (e.button=="Yes") {
var ev=e.dialog.i_event;
ev.parentDataModel().removeEvent(ev);
ev.destroy();
}
}
CalendarDisplay.prototype.handleContextMeetingRequest=function(e) {
var mdm=Application.getApplicationById(1004).getMeetingRequestDataModel();
var myEvent=e.item.parent().i_event;
var requestEvent=mdm.getItemById(myEvent.id());
if (requestEvent && requestEvent.i_attendees) { 
requestEvent.meetingRequestState(e.item.i_status_code);
requestEvent.saveMeetingRequestState();
} else { 
if (!this.i_mreq_attenlist) this.i_mreq_attenlist=[];
var handler=EventHandler.register(myEvent, "onattendees", this.handleContextMRAttendeeLoad, this);
this.i_mreq_attenlist.push([e.item, handler]);
myEvent.loadAttendees();
}
var meet_reqs=this.meetingRequests();
if (meet_reqs!=undefined) {
meet_reqs.displayEventPreview(false);
if (meet_reqs.meetingList()!=undefined) meet_reqs.meetingList().clearSelected();
}
}
CalendarDisplay.prototype.handleContextMRAttendeeLoad=function(e) {
for (var i=0; i < this.i_mreq_attenlist.length;++i) {
var data=this.i_mreq_attenlist[i];
if (data[0].parent().i_event==e.event) {
e.event.meetingRequestState(data[0].i_status_code);
e.event.saveMeetingRequestState();
data[1].unregister();
this.i_mreq_attenlist.splice(i,1);
break;
}
}
}
CalendarDisplay.prototype.handleContextEditInstance=function(e) {
var ev=e.item.parent().i_event;
this.application().popEvent(ev, undefined, undefined, true, true);
}
CalendarDisplay.prototype.handleContextDeleteInstance=function(e) {
var ev=e.item.parent().i_event;
var d=DialogManager.confirm("Are you sure you want to delete this instance?", "Delete Event Instance", undefined, Array("Yes", "No"), true, false, 1);
d.i_event=ev;
EventHandler.register(d, "onclose", this.handleContextDeleteInstanceConfirm, this);
}
CalendarDisplay.prototype.handleContextDeleteInstanceConfirm=function(e) {
if (e.button=="Yes") {
var ev=e.dialog.i_event;
ev.parentDataModel().removeEvent(ev, true);
ev.destroy(true);
}
}
CalendarDisplay.prototype.handleContextDeclineInstance=function(e) {
var ev=e.item.parent().i_event;
var d=DialogManager.confirm("Are you sure you want to decline this instance?", "Decline Event Instance", undefined, Array("Yes", "No"), true, false, 1);
d.i_event=ev;
EventHandler.register(d, "onclose", this.handleContextDeclineInstanceConfirm, this);
}
CalendarDisplay.prototype.handleContextDeclineInstanceConfirm=function(e) {
if (e.button=="Yes") {
var ev=e.dialog.i_event;
CalendarDataModel.declineEventInstances(ev);
ev.parentDataModel().removeEvent(ev, true);
}
}
CalendarDisplay.prototype.handleViewEvent=function(e) {
var ev=e.item.parent().i_event;
this.application().popEvent(ev);
}
CalendarDisplay.prototype.handleViewEventInstance=function(e) {
var ev=e.item.parent().i_event;
this.application().popEvent(ev, undefined, undefined, false, true);
}
CalendarDisplay.prototype.handleEditEvent=function(e) {
var ev=e.item.parent().i_event;
this.application().popEvent(ev, undefined, undefined, true);
}
CalendarDisplay.prototype.eventContextMenu=function() {
if (this.i_ev_context==undefined) {
this.i_ev_context=new ContextMenu(150, "");
this.i_ev_context_view=this.i_ev_context.addItem(new ContextMenuIconItem("View Event"));
EventHandler.register(this.i_ev_context_view, "onclick", this.handleViewEvent, this);
this.i_ev_context_view_series=this.i_ev_context.addItem(new ContextMenuIconItem("View Series"));
EventHandler.register(this.i_ev_context_view_series, "onclick", this.handleViewEvent, this);
this.i_ev_context_edit=this.i_ev_context.addItem(new ContextMenuIconItem("Edit Event"));
EventHandler.register(this.i_ev_context_edit, "onclick", this.handleEditEvent, this);
this.i_ev_context_edit_series=this.i_ev_context.addItem(new ContextMenuIconItem("Edit Series"));
EventHandler.register(this.i_ev_context_edit_series, "onclick", this.handleEditEvent, this);
this.i_ev_context_delete=this.i_ev_context.addItem(new ContextMenuIconItem("Delete Event"));
EventHandler.register(this.i_ev_context_delete, "onclick", this.handleDeleteEvent, this);
this.i_ev_context_delete_series=this.i_ev_context.addItem(new ContextMenuIconItem("Delete Series"));
EventHandler.register(this.i_ev_context_delete_series, "onclick", this.handleDeleteEvent, this);
this.i_ev_context_rec=this.i_ev_context.addItem(new ContextMenuDivider());
this.i_ev_context_view_i=this.i_ev_context.addItem(new ContextMenuIconItem("View Instance"));
EventHandler.register(this.i_ev_context_view_i, "onclick", this.handleViewEventInstance, this);
this.i_ev_context_edit_i=this.i_ev_context.addItem(new ContextMenuIconItem("Edit Instance"));
EventHandler.register(this.i_ev_context_edit_i, "onclick", this.handleContextEditInstance, this);
this.i_ev_context_delete_i=this.i_ev_context.addItem(new ContextMenuIconItem("Delete Instance"));
EventHandler.register(this.i_ev_context_delete_i, "onclick", this.handleContextDeleteInstance, this);
this.i_ev_context_decline_i=this.i_ev_context.addItem(new ContextMenuIconItem("Decline Instance"));
EventHandler.register(this.i_ev_context_decline_i, "onclick", this.handleContextDeclineInstance, this);
this.i_ev_context_rec2=this.i_ev_context.addItem(new ContextMenuDivider());
this.i_ev_context_decline_e=this.i_ev_context.addItem(new ContextMenuIconItem("Decline Event"));
this.i_ev_context_decline_e.i_status_code=4;
EventHandler.register(this.i_ev_context_decline_e, "onclick", this.handleContextMeetingRequest, this);
this.i_ev_context_decline_s=this.i_ev_context.addItem(new ContextMenuIconItem("Decline Series"));
this.i_ev_context_decline_s.i_status_code=4;
EventHandler.register(this.i_ev_context_decline_s, "onclick", this.handleContextMeetingRequest, this);
this.i_ev_context_inv=this.i_ev_context.addItem(new ContextMenuDivider());
this.i_ev_context_accept=this.i_ev_context.addItem(new ContextMenuIconItem("Accept Request"));
this.i_ev_context_accept.i_status_code=2;
EventHandler.register(this.i_ev_context_accept, "onclick", this.handleContextMeetingRequest, this);
this.i_ev_context_tentative=this.i_ev_context.addItem(new ContextMenuIconItem("Mark as Tentative"));
this.i_ev_context_tentative.i_status_code=3;
EventHandler.register(this.i_ev_context_tentative, "onclick", this.handleContextMeetingRequest, this);
this.i_ev_context_decline=this.i_ev_context.addItem(new ContextMenuIconItem("Decline Request"));
this.i_ev_context_decline.i_status_code=4;
EventHandler.register(this.i_ev_context_decline, "onclick", this.handleContextMeetingRequest, this);
}
return this.i_ev_context;
}
CalendarDisplay.prototype.handleViewContext=function(e) {
if (e.event.type()=="event") {
var obj=e.event;
cx=this.eventContextMenu();
var mrs=obj.meetingRequestState();
var pdmAccess=obj.parentDataModel().access();
if (obj.recurrence()!="") {
this.i_ev_context_view.visible(false);
this.i_ev_context_edit.visible(false);
this.i_ev_context_delete.visible(false);
this.i_ev_context_view_series.visible(true);
this.i_ev_context_edit_series.visible(true);
this.i_ev_context_delete_series.visible(true);
this.i_ev_context_edit_series.enabled((mrs > 0 || pdmAccess!="All") ? false : true);
this.i_ev_context_delete_series.enabled((mrs > 0 || pdmAccess!="All") ? false : true);
this.i_ev_context_rec.visible(true);
this.i_ev_context_view_i.visible((mrs==0 || mrs==2));
this.i_ev_context_edit_i.visible(mrs==0);
this.i_ev_context_delete_i.visible(mrs==0);
this.i_ev_context_decline_i.visible(mrs==2);
this.i_ev_context_rec2.visible(mrs==2);
this.i_ev_context_decline_e.visible(false);
this.i_ev_context_decline_s.visible(mrs==2);
this.i_ev_context_edit_i.enabled(mrs==0 && pdmAccess=="All");
this.i_ev_context_delete_i.enabled(mrs==0 && pdmAccess=="All");
this.i_ev_context_decline_i.enabled(pdmAccess=="All");
this.i_ev_context_decline_s.enabled(pdmAccess=="All");
} else {
this.i_ev_context_view_series.visible(false);
this.i_ev_context_edit_series.visible(false);
this.i_ev_context_delete_series.visible(false);
this.i_ev_context_view.visible(true);
this.i_ev_context_edit.visible(true);
this.i_ev_context_delete.visible(true);
this.i_ev_context_edit.enabled((mrs > 0 || pdmAccess!="All") ? false : true);
this.i_ev_context_delete.enabled((mrs > 0 || pdmAccess!="All") ? false : true);
this.i_ev_context_rec.visible(mrs==2);
this.i_ev_context_view_i.visible(false);
this.i_ev_context_edit_i.visible(false);
this.i_ev_context_delete_i.visible(false);
this.i_ev_context_decline_i.visible(false);
this.i_ev_context_rec2.visible(mrs==2);
this.i_ev_context_decline_e.visible(mrs==2);
this.i_ev_context_decline_s.visible(false);
this.i_ev_context_decline_e.enabled(pdmAccess=="All");
}
this.i_ev_context_inv.visible(mrs!=2 && mrs!=0);
this.i_ev_context_accept.visible(mrs!=2 && mrs!=0);
this.i_ev_context_tentative.visible(mrs!=2 && mrs!=3 && mrs!=0);
this.i_ev_context_decline.visible(mrs!=0 && mrs!=2);
this.i_ev_context_accept.enabled(pdmAccess=="All");
this.i_ev_context_tentative.enabled(pdmAccess=="All");
this.i_ev_context_decline.enabled(pdmAccess=="All");
cx.title(htmlEncode(obj.title()));
cx.i_event=obj;
cx.show();
}
}
CalendarDisplay.prototype.handleDoubleClickEvent=function(e) {
if (e.event.type()=="event") {
if (e.event.recurrence().length > 0 && (e.event.meetingRequestState()==0 || e.event.meetingRequestState()==2)) {
var text='"'+e.event.title()+'" is a recurring event.<BR>Do you want to open only this instance or the series?';
this.i_recurringDialog=DialogManager.confirm(text, 'Recurring Event', undefined,
['View This Instance', 'View the Series', 'Cancel'], true, true, 0);
this.i_handle_double_click_listener=EventHandler.register(this.i_recurringDialog, "onclose", this.handleDoubleClickConfirm, this);
this.i_recurringDialog.event=e.event;
} else {
this.application().popEvent(e.event);
}
}
}
CalendarDisplay.prototype.handleDoubleClickConfirm=function(e) {
this.i_handle_double_click_listener.unregister();
if(e.button==undefined) { 
return;
} else if(e.button=="View the Series") {
this.application().popEvent(e.dialog.event);
} else if (e.button=="View This Instance") {
this.application().popEvent(e.dialog.event, undefined, undefined, false, true);
}
}
CalendarDisplay.prototype.handleDragCreate=function(e) {
if (e.event.type()=="event") {
var o=new Object();
o.event=e.event;
o.type="dragcreate";
o.cancel=false;
if (this.ondragcreate!=undefined) {
this.ondragcreate(o);	
}
if (o.cancel==false) {
this.getCalendarView().activeDataModel().addEvent(e.event);
this.i_drag_save_listener=EventHandler.register(e.event, "onsave", this.handleDragCreateSave, this);
e.event.save();
}
}
}
CalendarDisplay.prototype.handleDragCreateSave=function(e) {
if(this.i_drag_save_listener!=undefined) {
this.i_drag_save_listener.unregister();
this.i_drag_save_listener=undefined;
}
e.event.createDefaultReminder();
}
CalendarDisplay.prototype.handleCalendarSelect=function(e) {
var v_start=floorDay(this.i_calendar.viewStart().copy(true));
var v_end=addDay(floorDay(this.i_calendar.viewEnd().copy(true)));
var v_now=this.i_calendar.selectedDate().copy(true);
if (v_start.getTime() > v_now.getTime() || v_end.getTime() < v_now.getTime()) {
this.i_calendar.focusDate(v_now);
}
}
CalendarDisplay.prototype.getCalendarView=function() {
if (this.i_calendar==undefined) {
this.i_calendar=new CalendarView(400, 400, new Date(), new Date());
EventHandler.register(this.i_calendar, "onactivedatamodel", this.handleActiveDataModel, this);
EventHandler.register(this.i_calendar, "oncontext", this.handleViewContext, this);
EventHandler.register(this.i_calendar, "ondblclick", this.handleDoubleClickEvent, this);
EventHandler.register(this.i_calendar, "ondragcreate", this.handleDragCreate, this);
EventHandler.register(this.i_calendar, "onchangeselected", this.handleCalendarSelect, this);
var s=new Date();
s.setHours(8);
var e=new Date();
e.setHours(17);
this.i_monthly=new CalendarMonthView();
EventHandler.register(this.i_monthly, "onload", this.handleMonthlyLoad, this);
this.i_calendar.registerType(this.i_monthly);
this.i_weekly=new CalendarBlockView(s, e, 15, false, 7);
EventHandler.register(this.i_weekly, "onload", this.handleWeeklyLoad, this);
this.i_weekly.allDayHeight(50);
this.i_calendar.registerType(this.i_weekly);
this.i_daily=new CalendarBlockView(s, e, 15, false, 1);
EventHandler.register(this.i_daily, "onload", this.handleDailyLoad, this);
this.i_calendar.registerType(this.i_daily);
}
return this.i_calendar;
}
CalendarDisplay.prototype.loadToday=function() {
var dateToday=new Date();
this.i_calendar.focusDate(dateToday);
this.i_calendar.selectedDate(dateToday);
this.i_calendar.activeView().throwDisplayViewEvent();
}
CalendarDisplay.prototype.loadMonthly=function() {
this.i_set_default=true;
this.i_monthly.active(true);
}
CalendarDisplay.prototype.loadWeekly=function() {
this.i_set_default=true;
this.i_weekly.active(true);
}
CalendarDisplay.prototype.loadDaily=function() {
this.i_set_default=true;
this.i_daily.active(true);
}
CalendarDisplay.prototype.loadMeetingRequests=function() {
this.i_set_default=true;
if (this.i_t_requests!=undefined) {
this.i_t_requests.active(true);
}
}
CalendarDisplay.prototype.handlePrint=function() {
this.getCalendarView().printView();
}
CalendarDisplay.prototype.getCalendarTools=function() {
if (this.i_calendar_tools==undefined) {
this.i_calendar_tools=new ToolBar(100);
this.i_newevent_btn=new IconLabelButton("New Event", "CalendarView_icon_new_event", 16, 16, 80, 17, "Create new event");
EventHandler.register(this.i_newevent_btn, "onclick", this.handleNewEventClick, this);
this.i_calendar_tools.addItem(new ToolBarButton(this.i_newevent_btn));
this.i_calendar_tools_new_div=this.i_calendar_tools.addItem(new ToolBarDivider());
var today=new IconButton("CalendarView_icon_myday", 20, 16, 24, 18, "Today");
this.i_calendar_tools.addItem(new ToolBarButton(today));
EventHandler.register(today, "onclick", this.loadToday, this);
var pri=new IconButton("ToolBar_icon_print", 16, 16, 20, 18, "Print")
EventHandler.register(pri, "onclick", this.handlePrint, this);
this.i_calendar_tools.addItem(new ToolBarButton(pri));
}
return this.i_calendar_tools;
}
CalendarDisplay.prototype.handleViewChange=function(e) {
if (e.tab.i_view!=undefined) {
e.tab.i_view.active(true);
} else {
var view=Application.getApplicationById(1004).getCalendarView().getCalendarView().activeView();
if (view!=undefined && view.i_active!=undefined && view.handleViewUnload!=undefined) {
view.i_active=false;
view.handleViewUnload();
}
}
}
CalendarDisplay.prototype.handleSetDefaultView=function(e) {
var view_id=2;
if (e.item==this.i_view_context_week) {
view_id=3;
}
else if (e.item==this.i_view_context_day) {
view_id=4;
}
if (CalendarDataModel.getDefaultCalendar()!=undefined) {
CalendarDataModel.getDefaultCalendar().defaultCalendarView(view_id);
CalendarDataModel.getDefaultCalendar().save();
}
}
CalendarDisplay.prototype.getViewContext=function() {
if (this.i_view_context==undefined) {
this.i_view_context=new ContextMenu(140, "Default View");
var dm=CalendarDataModel.getDefaultCalendar();
this.i_view_context_month=this.i_view_context.addItem(new ContextMenuBoolean("Monthly", (dm.defaultCalendarView()==2 ? true : false), true));
this.i_view_context_week=this.i_view_context.addItem(new ContextMenuBoolean("Weekly", (dm.defaultCalendarView()==3 ? true : false), true));
this.i_view_context_day=this.i_view_context.addItem(new ContextMenuBoolean("Daily", (dm.defaultCalendarView()==4 ? true : false), true));
EventHandler.register(this.i_view_context_month, "onclick", this.handleSetDefaultView, this);
EventHandler.register(this.i_view_context_week, "onclick", this.handleSetDefaultView, this);
EventHandler.register(this.i_view_context_day, "onclick", this.handleSetDefaultView, this);
}
return this.i_view_context;
}
CalendarDisplay.prototype.handleTabContext=function(e) {
var c=this.getViewContext();
var dm=CalendarDataModel.getDefaultCalendar();
this.i_view_context_month.state(dm.defaultCalendarView()==2 ? true : false);
this.i_view_context_week.state(dm.defaultCalendarView()==3 ? true : false);
this.i_view_context_day.state(dm.defaultCalendarView()==4 ? true : false);
c.show();
e.cancelBubble=true;
e.returnValue=false;
}
CalendarDisplay.prototype.getTabbedPane=function() {
if (this.i_tabs==undefined) {
this.i_tabs=new TabbedPane(400,300, 0, "Downloading calendar data...");
EventHandler.register(this.i_tabs, "oncontextmenu", this.handleTabContext, this);
this.i_mc=document.createElement('DIV');
this.i_mc.style.border="1px solid #a3a3a3";
this.i_mc.style.backgroundColor="#FFFFFF";
this.i_mc.appendChild(this.getCalendarTools().getBar());
this.i_mc.appendChild(this.getCalendarView().getCalendar());
EventHandler.register(this.i_tabs, "onfocus", this.handleViewChange);
this.i_t_daily=this.i_tabs.addTab(new TabbedPaneTab("Daily", "CalendarView_icon_daily", "", false, true, 120));
this.i_t_daily.i_view=this.i_daily;
this.i_t_weekly=this.i_tabs.addTab(new TabbedPaneTab("Weekly", "CalendarView_icon_weekly", "", false, true, 120));
this.i_t_weekly.i_view=this.i_weekly;
this.i_t_monthly=this.i_tabs.addTab(new TabbedPaneTab("Monthly", "CalendarView_icon_monthly", "", false, true, 120));
this.i_t_monthly.i_view=this.i_monthly;
this.i_t_requests=this.i_tabs.addTab(new TabbedPaneTab("Meeting Requests ("+this.application().getMeetingRequestDataModel().entries()+")", "CalendarView_icon_tentative", "", false, true, 165));
EventHandler.register(this.i_t_requests, "onfocus", this.MeetingRequestTabFocus, this); 
EventHandler.register(this.application().getMeetingRequestDataModel(), "onrefresh", this.handleMeetingRequestRefresh, this);
EventHandler.register(Application.getApplicationById("GP"), "onregionalsave", this.handleRegionalPrefsSaved, this);
this.i_t_monthly.contentPane(this.i_mc);
this.i_t_weekly.contentPane(this.i_mc);
this.i_t_daily.contentPane(this.i_mc);
this.i_t_requests.contentPane(this.meetingRequests().getList());
if (this.i_monthly.active()) {
this.i_t_monthly.active(true);
}
if (this.i_weekly.active()) {
this.i_t_weekly.active(true);
}
if (this.i_daily.active()) {
this.i_t_daily.active(true);
}
}
return this.i_tabs;
}
CalendarDisplay.prototype.MeetingRequestTabFocus=function(e) {
var dm=this.application().getMeetingRequestDataModel();
var d=new Date();
if((dm.i_loaded===false) || (dm.i_loaded <=d.getTime() - 60000)) {
dm.refresh();
}
}
CalendarDisplay.prototype.handleMeetingRequestRefresh=function(e) {
this.i_t_requests.name("Meeting Requests ("+this.application().getMeetingRequestDataModel().entries()+")");
}
CalendarDisplay.prototype.handleRegionalPrefsSaved=function(e) {
dm=this.application().getMeetingRequestDataModel();
dm.clear();
dm.i_ev_cache=Array();
dm.refresh();
this.i_set_default=true;	
this.handleCalendarConfig({'type':'changeconfig','dataModel':this.i_calendar.activeDataModel()});
if (this.i_monthly.active()) {
this.i_monthly.refreshData(true);
}
if (this.i_weekly.active()) {
this.loadWeekly();
}
if (this.i_daily.active()) {
this.loadDaily();
}
}
CalendarDisplay.prototype.meetingRequests=function() {
if (this.i_request_list==undefined) {
this.i_request_list=new MeetingRequestList(this, 400, 400);
}
return this.i_request_list;
}
CalendarDisplay.prototype.getCalendar=function() {
if (this.i_view==undefined) {
this.i_view=document.createElement('DIV');
this.i_view.className="CalendarDisplay";
this.i_view.style.width=this.width()+"px";
this.i_view.style.height=this.height()+"px";
this.i_view.appendChild(this.getTabbedPane().getPane());
}
return this.i_view;
}
CalendarDisplay.prototype.handleNewEventClick=function() {
var d=new Date();
if (this.i_calendar.selectedDate()!=undefined) {
d2=this.i_calendar.selectedDate().copy();
d2.setHours(d.getHours());
d2.setMinutes(d.getMinutes());
d2.setSeconds(d.getSeconds());
d2.setMilliseconds(0);
d=d2;
d.setTime(d.getTime()+((60 - d.getMinutes()) * (60000)));
}
this.application().popEvent(undefined, this.getCalendarView().activeDataModel(), d);
}
CalendarDisplay.prototype.handleMiniCalendarClick=function(e) {
this.i_calendar.focusDate(e.date_clicked);
this.i_calendar.selectedDate(e.date_clicked);
if (e.switch_to_day_view) {
this.i_calendar.activeView(this.i_daily);
}
this.i_calendar.activeView().throwDisplayViewEvent();
}
CalendarDisplay.prototype.handleAppLoad=function() {
this.handleCalendarConfig({'type':'changeconfig','dataModel':this.i_calendar.activeDataModel()});
EventHandler.register(this.i_calendar.activeDataModel(), "onchangeconfig", this.handleCalendarConfig, this);
var object=new Object();
object.type="appload";
if(this.i_monthly.onappload!=undefined) {
this.i_monthly.onappload(object);
}
if(this.i_weekly.onappload!=undefined) {
this.i_weekly.onappload(object);
}
if(this.i_daily.onappload!=undefined) {
this.i_daily.onappload(object);
}
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.CalendarDisplay.js");
function CalendarView(width, height, focusDate, selectedDate) {
this.i_sorting_mode=0;
this.i_width=width;
this.i_height=height;
this.i_text="";
this.i_view_types=Array();
this.i_week_start=0;
this.i_increment=15;
this.i_military=false;
this.i_models=Array();
this.i_model_listeners=Array();
this.i_model_delListeners=Array();
this.focusDate(new Date());
this.i_selected_date=(this.focusDate());
}
CalendarView.navigationHeight=25;
CalendarView.navigationWidth=25;
CalendarView.arrowIconWidth=16;
CalendarView.arrowIconHeight=16;
CalendarView.prototype.onresize=null;
CalendarView.prototype.onprevious=null;
CalendarView.prototype.onnext=null;
CalendarView.prototype.onchangefocus=null
CalendarView.prototype.onchangeselected=null;
CalendarView.prototype.ondatachange=null;
CalendarView.prototype.onchangeactive=null;
CalendarView.prototype.onchangestart=null;
CalendarView.prototype.onactivedatamodel=null;
CalendarView.prototype.ondragcreate=null;
CalendarView.prototype.oncontext=null;
CalendarView.prototype.ondblclick=null;
CalendarView.prototype.onappload=null;
CalendarView.prototype.printView=function() {
if (this.activeView().printView!=undefined) {
this.activeView().printView();
}
else {
alert('The current view does not support printing.');
}
}
CalendarView.prototype.sortingMode=function(mode) {
if (mode!=undefined) {
this.i_sorting_mode=mode;
}
return this.i_sorting_mode;
}
CalendarView.prototype.startingDay=function(day) {
if (day!=undefined) {
this.i_week_start=day;
for (var x=0; x < this.i_view_types.length; x++) {
this.i_view_types[x].startingDay(day);
}
if (this.onchangestart!=undefined) {
var o=new Object();
o.type="changestart";
o.calendar=this;
this.onchangestart(o);
}
}
return this.i_week_start;
}
CalendarView.prototype.increment=function(increment) {
if (increment) {
this.i_increment=increment;
for (var x=0; x < this.i_view_types.length; x++) {
if (this.i_view_types[x].increment!=undefined) {
this.i_view_types[x].increment(increment);
}
}
}
return this.i_increment;
}
CalendarView.prototype.military=function(state) {
if (state!=undefined) {
this.i_military=state;
for (var x=0; x < this.i_view_types.length; x++) {
if (this.i_view_types[x].military!=undefined) {
this.i_view_types[x].military(state);
}
}
}
return this.i_military;
}
CalendarView.prototype.focusDate=function(focusDate, forcerefresh) {
if (focusDate!=undefined) {
focusDate.setMilliseconds(0);
var date_range=this.focusDateRange(focusDate);
var baseDate=date_range.start;
var baseDateEnd=date_range.end;
var oldFocusMonth=this.i_focus_date==undefined ? undefined : floorMonth(this.i_focus_date);
var focusMonth=floorMonth(focusDate);
if (forcerefresh || (oldFocusMonth==undefined || oldFocusMonth.valueOf()!=focusMonth.valueOf())) {
var dms=this.dataModels();
for (var i=0; i < this.dataModels().length;++i) {
if (typeof dms[i].refreshMonthRange=="function") {
dms[i].refreshMonthRange(forcerefresh, baseDate.getMonth(), baseDate.getFullYear(), baseDateEnd.getMonth(), baseDateEnd.getFullYear());
} else {
dms[i].dateRange(baseDate, baseDateEnd);
}
}
APIManager.executeQueue();
}
if (this.i_focus_date==undefined || this.i_focus_date.valueOf()!=focusDate.valueOf()) {
var focusDate2=focusDate.copy(true);
var oldtime=this.i_focus_date;
this.i_focus_date=focusDate2;
for (var x=0; x < this.i_view_types.length; x++) {
var ot=this.i_view_types[x].focusDate();
if (ot!=undefined && oldtime.valueOf() > ot.valueOf()) oldtime=ot;
this.i_view_types[x].focusDate(focusDate2);
}
if (this.onchangefocus!=undefined) {
var o=new Object();
o.type="changefocus";
o.calendar=this;
o.oldtime=oldtime;
this.onchangefocus(o);
}
}
}
return this.i_focus_date;
}
CalendarView.prototype.focusDateRange=function(focus_date) {
if(!this.i_focus_date_range) {
this.i_focus_date_range={};
}
if(focus_date!=undefined) {
var start_date=floorMonth(focus_date);
var overlap=start_date.getDay() - this.startingDay();
if (overlap < 0) overlap+=7;
this.i_focus_date_range.start=addDays(start_date, -1 * overlap);
this.i_focus_date_range.end=addDays(this.i_focus_date_range.start, 42);
}
return this.i_focus_date_range;
}
CalendarView.prototype.selectedDate=function(selectedDate) {
if (selectedDate!=undefined) {
if (this.i_selected_date==undefined || (this.i_selected_date.getMonth()!=selectedDate.getMonth() || this.i_selected_date.getFullYear()!=selectedDate.getFullYear() || this.i_selected_date.getDate()!=selectedDate.getDate())) {
var selectedDate2=selectedDate.copy(true);
this.i_selected_date=selectedDate2;
for (var x=0; x < this.i_view_types.length; x++) {
this.i_view_types[x].selectedDate(selectedDate2);
}
if (this.onchangeselected!=undefined) {
var o=new Object();
o.type="changeselected";
o.calendar=this;
this.onchangeselected(o);
}
}
}
return this.i_selected_date;
}
CalendarView.prototype.headerText=function(text) {
if (text!=undefined) {
this.i_text=text;
if (this.i_view_text!=undefined) {
if (CalendarMonth.openRequests==0) {
this.i_view_text.innerHTML=text;
this.i_view_throbber.style.display="none";
} else {
this.i_view_text.innerHTML=text+' (Loading ...)';
this.i_view_throbber.style.display="";
}
}
}
return this.i_text;
}
CalendarView.prototype.activeDataModel=function(dataModel) {
if (dataModel!=undefined) {
this.i_active_dataModel=dataModel;
if (this.onactivedatamodel!=undefined) {
var o=new Object();
o.type="activedatamodel";
o.view=this;
this.onactivedatamodel(o);
}
}
return this.i_active_dataModel;
}
CalendarView.prototype.dataModels=function(index) {
if (index!=undefined) {
return this.i_models[index];
}
return this.i_models;
}
CalendarView.prototype.addDataModel=function(model, beforeModel) {
var location=this.i_models.length;
if (beforeModel) {
for (var x=0; x < this.i_models.length;++x) {
if (this.i_models[x]==beforeModel) {
location=x;
break;
}
}
}
for (var i=0; i < this.i_models.length;++i) {
if (this.i_models[i]==model) {
this.i_model_listeners.splice(i,1);
this.i_model_delListeners.splice(i,1);
this.i_models.splice(i--,1);
}
}
this.i_models.splice(location, 0, model);
this.i_model_listeners.splice(location, 0, EventHandler.register(model, "onrefresh", this.handleDataModelRefresh, this));
this.i_model_delListeners.splice(location, 0, EventHandler.register(model, "ondelete", this.handleDeleteEvent, this));
if (this.ondatachange!=undefined) {
var o=new Object();
o.type="datachange";
o.dataModel=model;
o.view=this;
this.ondatachange(o);
}
if (this.activeView()!=undefined) {
this.activeView().refreshData(true);
}
if(typeof model.refreshMonthRange=="function") {
model.refreshMonthRange(false, this.focusDateRange().start.getMonth(), this.focusDateRange().start.getFullYear(), this.focusDateRange().end.getMonth(), this.focusDateRange().end.getFullYear());
} else {
model.dateRange(this.focusDateRange().start, this.focusDateRange().end);
}
return model;
}
CalendarView.prototype.addDataModels=function(models) {
for(var i=0; i < models.length; i++) {
this.addDataModel(models[i]);
}
APIManager.executeQueue();
}
CalendarView.prototype.removeDataModel=function(model) {
for (var x=0; x < this.i_models.length; x++) {
if (this.i_models[x]==model) {
this.i_model_listeners[x].unregister();
this.i_model_delListeners[x].unregister();
this.i_models.splice(x, 1);
this.i_model_listeners.splice(x, 1);
this.i_model_delListeners.splice(x,1);
if (this.ondatachange!=undefined) {
var o=new Object();
o.type="datachange";
o.dataModel=model;
o.view=this;
this.ondatachange(o);
}
if (this.activeView()!=undefined) {
this.activeView().refreshData(true);
}
return true;
}	
}
return false;
}
CalendarView.prototype.handleDeleteEvent=function(e) {
for (var x=0; x < this.i_view_types.length; x++) {
if (this.i_view_types[x].ondelete!=undefined) {
e.view=this.i_view_types[x];
this.i_view_types[x].ondelete(e);
}
}
}
CalendarView.prototype.handleDataModelRefresh=function(e) {
var p=e.collection.parentDataModel();
var o=new Object();
o.type="datachange";
o.dataModel=p;
for (var x=0; x < this.i_view_types.length; x++) {
if (this.i_view_types[x].ondatachange!=undefined) {
o.view=this.i_view_types[x];
this.i_view_types[x].ondatachange(o);
}
}
}
CalendarView.prototype.viewTypes=function(index) {
if (index!=undefined) {
return this.i_view_types[index];
}
return this.i_view_types;
}
CalendarView.prototype.registerType=function(viewType) {
this.i_view_types[this.i_view_types.length]=viewType;
viewType.i_parent=this;
viewType.startingDay(this.startingDay());
viewType.selectedDate(this.selectedDate());
if (viewType.increment!=undefined) {
viewType.increment(this.increment());
}
if (viewType.military!=undefined) {
viewType.military(this.military());
}
viewType.focusDate(this.focusDate());
if (viewType.onregister!=undefined) {
var o=new Object();
o.type="register";
o.calendar=this;
viewType.onregister(o);
}
return viewType;
}
CalendarView.prototype.unregisterType=function(viewType) {
for (var x=0; x < this.i_view_types.length; x++) {
if (this.i_view_types[x]==viewType) {
this.i_view_types.splice(x, 1);
if (viewType==this.activeView()) {
this.activeView(false);
}
if (viewType.onunregister!=undefined) {
var o=new Object();
o.type="unregister";
o.calendar=this;
viewType.onunregister(o);
}
return true;
}
}
return false;
}
CalendarView.prototype.activeView=function(viewType) {
if (viewType!=undefined) {
if (viewType==false) {
viewType=undefined;
}
if (this.i_active!=undefined && this.i_view!=undefined) {
this.i_view.removeChild(this.i_active.getView());
}
this.i_active=viewType;
if (this.i_active!=undefined && this.i_view!=undefined) {
this.i_view.appendChild(this.i_active.getView());
}
for (var x=0; x < this.i_view_types.length; x++) {
if (this.i_view_types[x]==viewType) {
this.i_view_types[x].active(true);
this.i_view_types[x].width(this.width());
this.i_view_types[x].height(this.height() - CalendarView.navigationHeight);
this.i_view_types[x].focusDate(this.focusDate());
}
else {
this.i_view_types[x].active(false);
}
}
if (this.i_message_pane!=undefined) {
this.i_message_pane.style.display=(this.activeView()==undefined ? "" : "none");
}
if (this.onchangeactive!=undefined) {
var o=new Object();
o.type="changeactive";
o.view=viewType;
o.calendar=this;
this.onchangeactive(o);
}
this.i_active.throwDisplayViewEvent(); 
}
return this.i_active;
}
CalendarView.prototype.viewStart=function() {
if (this.activeView()!=undefined) {
return this.activeView().viewStart().copy();
}
}
CalendarView.prototype.viewEnd=function() {
if (this.activeView()!=undefined) {
return this.activeView().viewEnd().copy();
}
}
CalendarView.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_calendar!=undefined) {
this.i_calendar.style.width=width+"px";
this.i_nav.style.width=width+"px";
this.i_view.style.width=this.width()+"px";
this.i_view_throbber.style.width=this.width()+"px";
var throbber_margin_left=Math.floor((this.width() - 160) / 2);
if(throbber_margin_left < 0) {
throbber_margin_left=0;
}
this.i_view_throbber_content.style.marginLeft=throbber_margin_left+"px";
this.i_view_text.style.width=(this.width() - (CalendarView.navigationWidth * 2) - 2)+"px";
}
for (var x=0; x < this.i_view_types.length; x++) {
this.i_view_types[x].width(this.width());
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.calendar=this;
this.onresize(o);
}
}
return this.i_width;
}
CalendarView.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_calendar!=undefined) {
this.i_calendar.style.height=height+"px";
this.i_view.style.height=(this.height() - CalendarView.navigationHeight)+"px";
this.i_view_throbber.style.height=(this.height() - CalendarView.navigationHeight)+"px";
var throbber_margin_top=Math.floor((this.height() - CalendarView.navigationHeight - 32) / 2);
if(throbber_margin_top < 0) {
throbber_margin_top=0;
}
this.i_view_throbber_content.style.marginTop=throbber_margin_top+"px";
}
for (var x=0; x < this.i_view_types.length; x++) {
this.i_view_types[x].height(this.height() - CalendarView.navigationHeight);
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.calendar=this;
this.onresize(o);
}
}
return this.i_height;
}
CalendarView.prototype.handleLeftArrow=function(e) {
if (this.onprevious!=undefined) {
var o=new Object();
o.type="previous";
o.calendar=this;
this.onprevious(o);
}
}
CalendarView.prototype.handleRightArrow=function(e) {
if (this.onnext!=undefined) {
var o=new Object();
o.type="next";
o.calendar=this;
this.onnext(o);
}
}
CalendarView.prototype.leftArrow=function() {
if (this.i_left_arrow==undefined) {
this.i_left_arrow=new IconLabelButton("&nbsp;", "CalendarView_icon_left", CalendarView.arrowIconWidth, CalendarView.arrowIconHeight, CalendarView.navigationWidth, CalendarView.navigationHeight - 2, "Previous");
this.i_left_arrow.buttonCSS("CalendarView_button");
this.i_left_arrow.hoverCSS("CalendarView_button_hover");
EventHandler.register(this.i_left_arrow, "onmousedown", this.handleLeftArrow, this);
}
return this.i_left_arrow;
}
CalendarView.prototype.rightArrow=function() {
if (this.i_right_arrow==undefined) {
this.i_right_arrow=new IconLabelButton("&nbsp;", "CalendarView_icon_right", CalendarView.arrowIconWidth, CalendarView.arrowIconHeight, CalendarView.navigationWidth, CalendarView.navigationHeight - 2, "Next");
this.i_right_arrow.buttonCSS("CalendarView_button");
this.i_right_arrow.hoverCSS("CalendarView_button_hover");
EventHandler.register(this.i_right_arrow, "onmousedown", this.handleRightArrow, this);
}
return this.i_right_arrow;
}
CalendarView.prototype.genericContextMenu=function() {
if (this.i_generic_context==undefined) {
this.i_generic_context=new ContextMenu(150);
this.i_generic_new_ald_event=this.i_generic_context.addItem(new ContextMenuIconItem("New All Day Event"));
EventHandler.register(this.i_generic_new_ald_event, "onclick", this.handleNewEventClick, this);
this.i_generic_new_event=this.i_generic_context.addItem(new ContextMenuIconItem("New Event"));
EventHandler.register(this.i_generic_new_event, "onclick", this.handleNewEventClick, this);
}
if (this.activeDataModel()!=undefined) {
this.i_generic_new_event.enabled(this.activeDataModel().access()=="All");
}
this.i_generic_new_ald_event.visible(false);
this.i_generic_new_event.visible(true);
return this.i_generic_context;
}
CalendarView.prototype.handleNewEventClick=function(e) {
var ev;
if (e.item.i_name.indexOf("All Day") >=0) {
ev=new CalendarEvent();
ev.isNew(true);
ev.allDay(true);
ev.title("New Event");
ev.startTime(e.item.parent().i_target_date);
}
Application.getApplicationById(1004).popEvent(ev, this.activeDataModel(), e.item.parent().i_target_date);
}
CalendarView.prototype.dragCreateEvent=function(ev) {
if (ev!=undefined) {
if (this.ondragcreate!=undefined) {
var o=new Object();
o.type="dragcreate";
o.event=ev;
this.ondragcreate(o);
}
}
}
CalendarView.prototype.contextMenu=function(obj) {
if (obj!=undefined) {
if (this.oncontext!=undefined) {
var o=new Object();
o.type="context";
o.event=obj;
this.oncontext(o);
}
}
}
CalendarView.prototype.doubleClickEvent=function(obj) {
if (obj!=undefined) {
if (this.ondblclick!=undefined) {
var o=new Object();
o.type="dblclick";
o.event=obj;
this.ondblclick(o);
}
}
}
CalendarView.prototype.stopIESelection=function(e) {
if(document.all) {
if(!e.srcElement || e.srcElement.tagName.toLowerCase()!="textarea") {
document.body.onselectstart=function() { return false; } 
if(!this.i_restore_ie_select_event) {
this.i_restore_ie_select_event=EventHandler.register(document.body, "onmouseup", this.restoreIESelection, this);
}
}
}
}
CalendarView.prototype.restoreIESelection=function(e) {
this.i_restore_ie_select_event.unregister();
this.i_restore_ie_select_event=undefined;
if(document.all) {
document.body.onselectstart=null;
}
}
CalendarView.prototype.getCalendar=function() {
if (this.i_calendar==undefined) {
this.i_calendar=document.createElement('DIV');
this.i_calendar.className="CalendarView";
this.i_calendar.style.width=this.width()+"px";
this.i_calendar.style.height=this.height()+"px";
this.i_nav=document.createElement('DIV');
this.i_nav.className="CalendarView_navigation";
this.i_nav.style.width=this.width()+"px";
this.i_nav.style.height=CalendarView.navigationHeight+"px";
this.i_calendar.appendChild(this.i_nav);
this.i_nav.appendChild(this.leftArrow().getButton());
this.i_view_text=document.createElement('DIV');
this.i_view_text.className="CalendarView_view_text";
this.i_view_text.style.width=(this.width() - (CalendarView.navigationWidth * 2) - 2)+"px";
this.i_view_text.style.height=(CalendarView.navigationHeight - 2)+"px";
this.i_view_text.style.lineHeight=(CalendarView.navigationHeight - 2)+"px";
this.i_view_text.innerHTML=this.headerText();
this.i_nav.appendChild(this.i_view_text);
this.i_nav.appendChild(this.rightArrow().getButton());
this.i_view_throbber=document.createElement("DIV");
this.i_view_throbber.className="CalendarView_throbber_area";
this.i_view_throbber.style.display="none";
this.i_view_throbber.style.width=this.width()+"px";
this.i_view_throbber.style.height=(this.height() - CalendarView.navigationHeight)+"px";
this.i_throbber_cover_holder=document.createElement("DIV");
this.i_throbber_cover_holder.className="CalendarView_throbber_cover_holder";
this.i_view_throbber.appendChild(this.i_throbber_cover_holder);
this.i_throbber_cover=document.createElement("DIV");
this.i_throbber_cover.className="WindowObject_modal_cover";
this.i_throbber_cover_holder.appendChild(this.i_throbber_cover);
this.i_view_throbber_content_holder=document.createElement("DIV");
this.i_view_throbber_content_holder.className="CalendarView_throbber_content_holder";
this.i_view_throbber.appendChild(this.i_view_throbber_content_holder);
this.i_view_throbber_content=document.createElement("DIV");
this.i_view_throbber_content.className="CalendarView_throbber_content";
this.i_view_throbber_content.innerHTML="Loading your events...";
this.i_view_throbber_content_holder.appendChild(this.i_view_throbber_content);
this.i_calendar.appendChild(this.i_view_throbber);
this.i_view=document.createElement('DIV');
this.i_view.className="CalendarView_view";
this.i_view.style.width=this.width()+"px";
this.i_view_throbber.style.width=this.width()+"px";
var throbber_margin_left=Math.floor((this.width() - 160) / 2);
if(throbber_margin_left < 0) {
throbber_margin_left=0;
}
this.i_view_throbber_content.style.marginLeft=throbber_margin_left+"px";
this.i_view.style.height=(this.height() - CalendarView.navigationHeight)+"px";
this.i_view_throbber.style.height=(this.height() - CalendarView.navigationHeight)+"px";
var throbber_margin_top=Math.floor((this.height() - CalendarView.navigationHeight - 32) / 2);
if(throbber_margin_top < 0) {
throbber_margin_top=0;
}
this.i_view_throbber_content.style.marginTop=throbber_margin_top+"px";
EventHandler.register(this.i_view, "onmousedown", this.stopIESelection, this);
this.i_calendar.appendChild(this.i_view);
this.i_message_pane=document.createElement('DIV');
this.i_message_pane.className="CalendarView_no_view_message";
this.i_message_pane.style.width=this.width()+"px";
this.i_message_pane.style.height=(this.height() - CalendarView.navigationHeight)+"px";
this.i_message_pane.style.lineHeight=(this.height() - CalendarView.navigationHeight)+"px";
this.i_message_pane.style.display=(this.activeView()==undefined ? "" : "none");
this.i_message_pane.innerHTML="Please select a calendar view.";
this.i_view.appendChild(this.i_message_pane);
if (this.activeView()!=undefined) {
this.i_view.appendChild(this.activeView().getView());
}
}
return this.i_calendar;
}
function CalendarViewType() {
this.superCalendarViewType();
}
CalendarViewType.prototype.superCalendarViewType=function() {
this.i_active=false;
this.i_width=100;
this.i_height=100;
this.i_week_start=0;
}
CalendarViewType.prototype.onload=null;
CalendarViewType.prototype.onunload=null;
CalendarViewType.prototype.onregister=null;
CalendarViewType.prototype.onunregister=null;
CalendarViewType.prototype.onresize=null;
CalendarViewType.prototype.onchangestart=null;
CalendarViewType.prototype.onchangefocus=null
CalendarViewType.prototype.onchangeselected=null;
CalendarViewType.prototype.ondatachange=null;
CalendarViewType.prototype.parent=function() {
return this.i_parent;
}
CalendarViewType.prototype.startingDay=function(day) {
if (day!=undefined) {
this.i_week_start=day;
if (this.onchangestart!=undefined) {
var o=new Object();
o.type="changestart";
o.view=this;
this.onchangestart(o);
}
}
return this.i_week_start;
}
CalendarViewType.prototype.focusDate=function(focusDate) {
if (focusDate!=undefined) {
var focusDate2=focusDate.copy(true);
if (this.i_focus_date==undefined || this.i_focus_date.getMonth()!=focusDate2.getMonth() || this.i_focus_date.getFullYear()!=focusDate2.getFullYear() || this.i_focus_date.getDate()!=focusDate2.getDate()) {
var oldtime=this.i_focus_date;
this.i_focus_date=focusDate2;
if (this.onchangefocus!=undefined) {
var o=new Object();
o.type="changefocus";
o.oldtime=oldtime;
o.view=this;
this.onchangefocus(o);
}
}
}
return this.i_focus_date;
}
CalendarViewType.prototype.selectedDate=function(selectedDate) {
if (selectedDate!=undefined) {
var selectedDate2=selectedDate.copy(true);
this.i_selected_date=selectedDate2;
if (this.onchangeselected!=undefined) {
var o=new Object();
o.type="changeselected";
o.view=this;
this.onchangeselected(o);
}
}
var s=this.i_selected_date.copy(true);
return s;
}
CalendarViewType.prototype.viewStart=function() {
return this.i_start_view;
}
CalendarViewType.prototype.viewEnd=function() {
return this.i_end_view;
}
CalendarViewType.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.view=this;
this.onresize(o);
}
}
return this.i_width;
}
CalendarViewType.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.view=this;
this.onresize(o);
}
}
return this.i_height;
}
CalendarViewType.prototype.active=function(state) {
if (state!=undefined) {
if (state!=this.active()) {
this.i_active=state;
if (state==true) {
if (this.parent().activeView()!=this) {
this.parent().activeView(this);
}
if (this.onload!=undefined) {
var o=new Object();
o.type="load";
o.view=this;
this.onload(o);
}
}
else {
if (this.parent().activeView()==this) {
this.parent().activeView(false);
}
if (this.onunload!=undefined) {
var o=new Object();
o.type="unload";
o.view=this;
this.onunload(o);
}
}
}
}
return this.i_active;
}
CalendarViewType.prototype.getView=null;
function CalendarViewHeaderType() {
this.superCalendarViewHeaderType();
}
CalendarViewHeaderType.allDayBorderBottom=0;
CalendarViewHeaderType.prototype.onbuild=null;
CalendarViewHeaderType.prototype.superCalendarViewHeaderType=function() {
this.superCalendarViewType();
EventHandler.register(this, "onresize", this.handleHeaderResize, this);
this.i_header_height=25;
this.i_left_width=20;
this.i_headers=Array();
this.i_left_headers=Array();
this.i_all_day_height=0;
this.i_all_day_minimized=false;
this.i_width=400;
this.i_height=400;
this.i_ignoringUpdate=0;
this.i_content_height=0;
this.i_no_scroll=true;
}
CalendarViewHeaderType.prototype.ignoreUpdate=function(state) {
if (state!=undefined) {
if (state)++this.i_ignoringUpdate;
else if (this.i_ignoringUpdate > 0) --this.i_ignoringUpdate;
if (this.i_ignoringUpdate <=0 && this.i_has_updates==true) {
this.i_ignoringUpdate=0;
this.i_has_updates=undefined;
this.updateAllDayCells();
}
}
return this.i_ignoringUpdate > 0;
}
CalendarViewHeaderType.prototype.handleHeaderContext=function(e) {
var c=this.weekdayContext();
if (this.i_wday_select!=undefined) {
for (var x=0; x < this.i_wday_select.length; x++) {
this.i_wday_select[x].state(x==this.startingDay() ? true : false);
}
}
this.i_time_context_month.state(user_prefs['date_prefs']=='%m/%d/%Y');
this.i_time_context_day.state(user_prefs['date_prefs']!='%m/%d/%Y');
c.show();
e.cancelBubble=true;
e.returnValue=false;
}
CalendarViewHeaderType.prototype.handleSwitchStart=function(e) {
for (var x=0; x < this.i_wday_select.length; x++) {
if (this.i_wday_select[x]==e.item) {
if (CalendarDataModel.getDefaultCalendar()!=undefined) {
CalendarDataModel.getDefaultCalendar().weekStartDay(x+1);
CalendarDataModel.getDefaultCalendar().save();
}
break;
}
}
}
CalendarViewHeaderType.prototype.weekdayContext=function() {
if (this.i_week_context==undefined) {
this.i_week_context=new ContextMenu(140, "Starting Day");
this.i_wday_select=Array();
for (var x=0; x < 7; x++) {
this.i_wday_select[x]=this.i_week_context.addItem(new ContextMenuBoolean(CalendarMonthView.weekDays[x], (x==this.startingDay() ? true : false), true));
EventHandler.register(this.i_wday_select[x], "onclick", this.handleSwitchStart, this);
}
this.i_week_context.addItem(new ContextMenuDivider());
this.i_time_context_month=this.i_week_context.addItem(new ContextMenuBoolean("MM/DD/YYYY", (user_prefs['date_prefs']=='%m/%d/%Y' ? true : false), true));
this.i_time_context_day=this.i_week_context.addItem(new ContextMenuBoolean("DD/MM/YYYY", (user_prefs['date_prefs']=='%d/%m/%Y' ? true : false), true));
EventHandler.register(this.i_time_context_month, "onclick", this.handleSetDateFormat, this);
EventHandler.register(this.i_time_context_day, "onclick", this.handleSetDateFormat, this);
}
return this.i_week_context;
}
CalendarViewHeaderType.prototype.handleSetDateFormat=function(e) {
if (e.item==this.i_time_context_month) {
this.i_time_context_month.state(true);
this.i_time_context_day.state(false);
user_prefs['date_prefs']="%m/%d/%Y";
}
else {
this.i_time_context_month.state(false);
this.i_time_context_day.state(true);
user_prefs['date_prefs']="%d/%m/%Y";
}
ResourceManager.request("/Ioffice/Common/wizard.asp?xml="+escape("<xml><code>tchange</code><userid>"+user_prefs['user_id']+"</userid><username>"+user_prefs['user_name']+"</username><timeZoneID>"+user_prefs['time_zone']+"</timeZoneID><timeFormat>"+user_prefs['time_prefs']+"</timeFormat><dateFormat>"+user_prefs['date_prefs']+"</dateFormat></xml>"), 1);
this.updateFocus();
}
CalendarViewHeaderType.prototype.handleHeaderResize=function(e) {
var contentHeight=this.contentHeight();
var contentWidth=this.contentWidth();
if (contentWidth < 1 || contentHeight < 1) return;
var myWidth=this.width();
var myHeight=this.height();
var headWidth=this.headerWidth();
var headHeight=this.headerHeight();
var leftWidth=this.leftHeaderWidth();
if (this.i_ref_contentHeight==contentHeight
&& this.i_ref_contentWidth==contentWidth
&& this.i_ref_myWidth==myWidth
&& this.i_ref_myHeight==myHeight
&& this.i_ref_headWidth==headWidth
&& this.i_ref_headHeight==headHeight) {
return;
}
this.i_ref_contentWidth=contentWidth;
this.i_ref_contentHeight=contentHeight;
this.i_ref_myWidth=myWidth;
this.i_ref_myHeight=myHeight;
this.i_ref_headWidth=headWidth;
this.i_ref_headHeight=headHeight;
this.i_ref_leftHeadWidth=leftWidth;
if (this.i_header_bar!=undefined) {
this.i_header_bar.style.width=myWidth+"px";
this.i_display_grid.style.width=contentWidth+"px";
this.i_display_grid.style.height=contentHeight+"px";
this.i_header_ald_corner_left.style.width=(leftWidth * 0.5)+"px";
this.i_header_ald_corner_right.style.width=(leftWidth * 0.5)+"px";
this.i_header_corner.style.width=leftWidth+"px";
this.i_all_day_bar.style.width=myWidth+"px";
for (var x=0; x < this.i_headers.length - 1; x++) {
this.i_headers[x].getAllDayHeader().style.borderRightWidth="0px";
}
this.i_headers[this.i_headers.length - 1].getAllDayHeader().style.borderRightWidth="1px";
}
if (this.i_display_view!=undefined) {
this.i_display_view.style.width=myWidth+"px";
this.i_display_view.style.height=myHeight+"px";
this.i_display_content.style.width=myWidth+"px";
if (this.i_headers!=undefined && this.i_headers.length==1 && (myHeight - this.allDayHeight()) > 0) {
this.i_display_content.style.height=(myHeight - this.allDayHeight())+"px";
this.i_display_content.style.display="";
}
else if ((myHeight - headHeight - this.allDayHeight()) > 0) {
this.i_display_content.style.height=(myHeight - headHeight - this.allDayHeight())+"px";
this.i_display_content.style.display="";
}
else {
this.i_display_content.style.display="none";
}
this.i_display_content.style.overflow=(contentHeight > this.viewportHeight() ? "auto" : "hidden");
this.i_display_left.style.height=contentHeight+"px";
}
for (var x=0; x < this.i_headers.length; x++) {
this.i_headers[x].width(headWidth);
}
if (this.i_header_ald_scroll!=undefined) {
this.i_header_ald_scroll.style.display=(contentHeight > this.viewportHeight() ? "" : "none");
if (contentHeight > this.viewportHeight()) {
this.i_header_ald_scroll.style.width=((myWidth - leftWidth) - (headWidth * this.i_headers.length))+"px";
}
}
if (this.i_header_scroll_date!=undefined) {
this.i_header_scroll_date.style.display=(contentHeight > this.viewportHeight() ? "" : "none");
if (contentHeight > this.viewportHeight()) {
this.i_header_scroll_date.style.width=((myWidth - leftWidth) - (headWidth * this.i_headers.length))+"px";
}
}
if (this.i_header_scroll!=undefined) {
this.i_header_scroll.style.display=(contentHeight > this.viewportHeight() ? "" : "none");
if (contentHeight > this.viewportHeight()) {
this.i_header_scroll.style.width=((myWidth - leftWidth) - (headWidth * this.i_headers.length))+"px";
}
}
if (this.i_display_columns!=undefined) {
this.i_display_columns.style.width=contentWidth+"px";
this.i_display_columns.style.height=contentHeight+"px";
for (var x=0; x < this.i_headers.length; x++) { 
var c=this.i_headers[x].getColumn();
c.style.width=(headWidth)+"px";
c.style.height=contentHeight+"px";
}
}
if (this.i_display_rows!=undefined) {
this.i_display_rows.style.width=contentWidth+"px";
this.i_display_rows.style.height=contentHeight+"px";
var cw=(headWidth * this.i_headers.length);
for (var x=0; x < this.i_left_headers.length; x++) { 
var c=this.i_left_headers[x].getRow();
for (var z=0; z < c.length; z++) {
c[z].style.width=(cw)+"px";
}
}
}
if (this.i_display_data!=undefined) {
this.i_display_data.style.width=(headWidth * this.i_headers.length)+"px";
}
this.updateAllDayDropTarget();
}
CalendarViewHeaderType.prototype.leftHeaderWidth=function(width) {
if (width!=undefined && this.i_left_width!=width) {
this.i_left_width=width;
for (var x=0; x < this.i_left_headers.length; x++) {
this.i_left_headers[x].width(this.leftHeaderWidth());
}
this.handleHeaderResize();
}
return this.i_left_width;
}
CalendarViewHeaderType.prototype.headerHeight=function(height) {
if (height!=undefined && this.i_header_height!=height) {
this.i_header_height=height;
for (var x=0; x < this.i_headers.length; x++) {
this.i_headers[x].height(height);
}
this.handleHeaderResize();
}
return this.i_header_height;
}
CalendarViewHeaderType.prototype.contentHeight=function(height) {
if (height!=undefined && this.i_content_height!=height) {
this.i_content_height=height;
this.handleHeaderResize();
}
return this.i_content_height;
}
CalendarViewHeaderType.prototype.contentWidth=function() {
return (this.width() - this.leftHeaderWidth() - (this.contentHeight() > this.viewportHeight() ? scrollBarWidth() : 0));
}
CalendarViewHeaderType.prototype.viewportHeight=function() {
return (this.height() - this.headerHeight());
}
CalendarViewHeaderType.prototype.headerWidth=function() {
return Math.floor((this.width() - this.leftHeaderWidth() - (this.contentHeight() > this.viewportHeight() ? scrollBarWidth() : 0)) / this.i_headers.length);
}
CalendarViewHeaderType.prototype.handleContentResize=function() {
var s=0;
for (var x=0; x < this.i_left_headers.length; x++){ 
s+=this.i_left_headers[x].height();
}
this.contentHeight(s);
}
CalendarViewHeaderType.prototype.handleChangeRows=function(e) {
if (this.i_row_cache!=undefined) {
for (var x=0; x < this.i_left_headers.length; x++) {
if (this.i_left_headers[x]==e.header) {
for (var z=0; z < this.i_row_cache[x].length; z++) {
this.i_display_rows.removeChild(this.i_row_cache[x][z]);
}
this.i_row_cache[x]=e.header.getRow();
for (var z=0; z < this.i_row_cache[x].length; z++) {
if (x==this.i_left_headers.length - 1) {
this.i_display_rows.appendChild(this.i_row_cache[x][z]);
}
else {
this.i_display_rows.insertBefore(this.i_row_cache[x][z], this.i_row_cache[x+1][0]);
}
}
}
}
}
}
CalendarViewHeaderType.prototype.leftHeaders=function(index) {
if (index!=undefined) {
return this.i_left_headers[index];
}
return this.i_left_headers;
}
CalendarViewHeaderType.prototype.addLeftHeaders=function(headers, beforeHeader) {
var contentWidth=(this.headerWidth() * this.i_headers.length);
var index=this.i_left_headers.length;
var heightChange=0;
var append=true;
if (!headers.splice) headers=[headers];
if (beforeHeader!=undefined) {
for (var i=0; i < this.i_left_headers.length;++i) {
if (this.i_left_headers[i]==beforeHeader) {
index=i;
append=false;
break;
}
}
}
for (var i=0; i < headers.length; i++) {
headers[i].width(this.leftHeaderWidth());
var myIndex=index++;
this.i_left_headers.splice(myIndex, 0, headers[i]);
if (this.i_display_left!=undefined) {
var row=headers[i].getRow();
if (append) {
this.i_display_left.appendChild(headers[i].getHeader());
for (var z=0; z < row.length; z++) {
row[z].style.width=contentWidth+"px";
this.i_display_rows.appendChild(row[z]);
}
} else {
this.i_display_left.insertBefore(headers[i].getHeader(), beforeHeader.getHeader());
for (var z=0; z < row.length; z++) {
row[z].style.width=contentWidth+"px";
this.i_display_rows.insertBefore(row[z], this.i_row_cache[index][0]);
}
}
this.i_row_cache.splice(myIndex, 0, headers[i].getRow());
}
heightChange+=headers[i].height();
headers[i].i_parent=this;
headers[i].i_r_l=EventHandler.register(headers[i], "onchangeheight", this.handleContentResize, this);
headers[i].i_rx_l=EventHandler.register(headers[i], "onchangerows", this.handleChangeRows, this);
}
if (heightChange > 0) {
this.contentHeight(this.contentHeight()+heightChange);
}
return headers;
}
CalendarViewHeaderType.prototype.removeLeftHeaders=function(headers) {
var heightChange=0;
if (!headers.splice) headers=[headers];
for (var i=0; i < headers.length;++i) {
for (var x=0; x < this.i_left_headers.length; x++) {
if (this.i_left_headers[x]==headers[i]) {
var old=this.i_left_headers.length;
var loc=x;
if (this.i_row_cache!=undefined) {
if (this.i_display_rows!=undefined) {
for (var z=0; z < this.i_row_cache[loc].length; z++) {
this.i_display_rows.removeChild(this.i_row_cache[loc][z]);	
}
}
this.i_row_cache.splice(loc, 1);
}
if (this.i_display_left!=undefined) {
this.i_display_left.removeChild(headers[i].getHeader());
}
heightChange+=headers[i].height();
if (headers[i].i_r_l) {
headers[i].i_r_l.unregister();
headers[i].i_rx_l.unregister();
headers[i].i_r_l=null;
headers[i].i_rx_l=null;
}
this.i_left_headers.splice(x--,1);
}
}
}
if (heightChange > 0) {
this.contentHeight(this.contentHeight() - heightChange);
return true;
} else {
return false;
}
}
CalendarViewHeaderType.prototype.headers=function(index) {
if (index!=undefined) {
return this.i_headers[index];
}
return this.i_headers;
}
CalendarViewHeaderType.prototype.addHeader=function(header, beforeHeader) {
var append=true;
if (beforeHeader!=undefined) {
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x]==beforeHeader) {
this.i_headers.splice(x, 0, header);
append=false;
if (this.i_header_bar!=undefined) {
this.i_header_bar.insertBefore(header.getHeader(), beforeHeader.getHeader());
}
if (this.i_display_columns!=undefined) {
var c=header.getColumn();
c.style.width=this.headerWidth()+"px";
c.style.height=this.contentHeight()+"px";
this.i_display_columns.insertBefore(c, beforeHeader.getColumn());
}
break;
}
}
}
if (append==true) {
this.i_headers[this.i_headers.length]=header;
if (this.i_header_bar!=undefined) {
this.i_header_bar.insertBefore(header.getHeader(), this.i_header_scroll);
}
if (this.i_display_columns!=undefined) {
var c=header.getColumn();
c.style.width=this.headerWidth()+"px";
c.style.height=this.contentHeight()+"px";
this.i_display_columns.appendChild(c);
}
}
header.i_parent=this;
header.allDayHeight(this.allDayHeight());
header.width(this.headerWidth());
header.height(this.headerHeight());
this.handleHeaderResize();
return header;
}
CalendarViewHeaderType.prototype.removeHeader=function(header) {
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x]==header) {
this.i_headers.splice(x, 1);
header.i_parent=undefined;
if (this.i_header_bar!=undefined) {
this.i_header_bar.removeChild(header.getHeader());
}
if (this.i_display_columns!=undefined) {
var c=header.getColumn();
this.i_display_columns.removeChild(c);
}
this.handleHeaderResize();
return true;
}
}
return false;
}
CalendarViewHeaderType.prototype.allDayHeight=function(height) {
if (height!=undefined && this.i_all_day_height!=height) {
this.i_all_day_height=height;
if (this.i_display_view!=undefined) {
this.i_all_day_bar.style.height=(this.allDayHeight() <=0 ? 1 : this.allDayHeight())+"px";
this.i_all_day_bar.style.display=(this.allDayHeight() > 0 ? "" : "none");
this.i_display_content.style.height=(this.height() - (this.i_headers!=undefined && this.i_headers.length==1 ? 0 : this.headerHeight()) - this.allDayHeight())+"px";
this.i_header_ald_corner_left.style.height=this.allDayHeight()+"px";
this.i_header_ald_corner_right.style.height=this.allDayHeight()+"px";
this.i_header_scroll.style.height=this.allDayHeight()+"px";
}
for (var x=0; x < this.i_headers.length; x++) {
this.i_headers[x].allDayHeight(this.allDayHeight());
}
this.updateAllDayDropTarget();
}
return this.i_all_day_height;
}
CalendarViewHeaderType.prototype.updateAllDayDropTarget=function() {
if (!this.i_is_month_view && this.i_display_view!=undefined) {
var target=Application.getApplicationById(1004).getCalendarView().getCalendarView().i_nav, 
top=0,						
left=this.leftHeaderWidth(),	
bottom=target.offsetHeight,	
width=this.headerWidth();		
while (target.offsetParent!=undefined) {
left+=target.offsetLeft;
top+=target.offsetTop;
target=target.offsetParent;
}
bottom+=top+this.i_all_day_bar.offsetHeight+this.i_header_bar.offsetHeight;
var initialWidth=width;
if (this.i_headers.length==1) {
initialWidth -=this.i_header_scroll.offsetWidth;
}
this.i_headers[0].i_rectDimension={left:left, right:left+initialWidth, top:top, bottom:bottom};
for (var i=1; i < this.i_headers.length;++i) {
var lastRect=this.i_headers[i-1].i_rectDimension;
this.i_headers[i].i_rectDimension={left:lastRect.right+1, right:lastRect.right+width, top:top, bottom:bottom};
}
}
}
CalendarViewHeaderType.prototype.contentLeft=function() {
var lf=0;
var me=this.i_display_grid;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
return lf;
}
CalendarViewHeaderType.prototype.contentTop=function() {
var tp=0;
var me=this.i_display_grid;
while (me!=null) {
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
return tp;
}
CalendarViewHeaderType.prototype.getHeaderBar=function() {
return this.i_header_bar;
}
CalendarViewHeaderType.prototype.noScroll=function(state) {
if (state!=undefined) {
this.i_no_scroll=state;
if (this.i_display_grid!=undefined) {
this.i_display_grid.className="CalendarViewHeaderType_grid"+(state ? "_no_scroll" : "");
}
}
return this.i_no_scroll;
}
CalendarViewHeaderType.prototype.updateAllDayCells=function() {
if (this.i_display_view==undefined) return; 
if (this.ignoreUpdate()) {
this.i_has_updates=true;
return;
}
var max_e=0;
var more_link_h=CalendarMonthView.eventHeight+3;
var chevron_display="none";
var all_day_minimized=this.allDayMinimized();
for (var x=0; x < this.i_headers.length; x++){ 
var ald_more_link=this.i_headers[x].i_ald_more_link;
if (all_day_minimized) {
if (this.i_headers[x].events().length > 1) {
ald_more_link.style.display="";
ald_more_link.style.top=CalendarMonthView.eventHeight+2;
ald_more_link.innerHTML="("+(this.i_headers[x].events().length - 1)+" more)";
}
else {
ald_more_link.style.display="none";
}
}
else {
ald_more_link.style.display="none";
}
if (this.i_headers[x].events().length > max_e) {
max_e=this.i_headers[x].events().length;
chevron_display=(max_e > 1 ? "" : "none");
}
}
if (this.allDayMinimized() && max_e > 0) {
max_e=1;
}
if (this.height() < ((max_e * (CalendarMonthView.eventHeight+2))*2)) {
this.i_all_day_bar.style.overflow="auto";
this.allDayHeight(Math.floor(this.height()/2));
} else {
this.i_all_day_bar.style.overflow="hidden";
this.allDayHeight((max_e <=0 ? 0 : (max_e * (CalendarMonthView.eventHeight+2))+more_link_h));
}
this.i_header_ald_corner_chevron.style.display=chevron_display;
}
CalendarViewHeaderType.prototype.allDayMinimized=function(state) {
if (state!=undefined) {
this.i_all_day_minimized=state;
this.updateAllDayCells();
}
return this.i_all_day_minimized;
}
CalendarViewHeaderType.prototype.handleToggleAllDay=function(e) {
if (this.i_header_ald_corner_chevron.style.display=="none") {
return;
}
this.allDayMinimized(!this.allDayMinimized());
this.i_header_ald_corner_chevron.style.backgroundPosition=(this.allDayMinimized() ? "0px -446px" : "0px -470px");
}
CalendarViewHeaderType.prototype.getView=function() {
this.ignoreUpdate(true);
if (this.i_display_view==undefined) {
this.i_display_view=document.createElement('DIV');
this.i_display_view.className="CalendarViewHeaderType";
this.i_display_view.style.width=this.width()+"px";
this.i_display_view.style.height=this.height()+"px";
this.i_header_bar=document.createElement('DIV');
this.i_header_bar.className="CalendarViewHeaderType_bar";
this.i_header_bar.style.width=this.width()+"px";
this.i_header_bar.style.height=this.headerHeight()+"px";
this.i_display_view.appendChild(this.i_header_bar);
this.i_header_corner=document.createElement('DIV');
this.i_header_corner.className="CalendarViewHeader";
this.i_header_corner.style.width=this.leftHeaderWidth()+"px";
this.i_header_corner.style.height=this.headerHeight()+"px";
this.i_header_corner.innerHTML="&nbsp;";
this.i_header_corner.style.fontSize="1px";
this.i_header_bar.appendChild(this.i_header_corner);
for (var x=0; x < this.i_headers.length; x++) {
this.i_header_bar.appendChild(this.i_headers[x].getHeader());
}
this.i_header_scroll_date=document.createElement('DIV');
this.i_header_scroll_date.className="CalendarViewHeader";
var h_scroll=((this.width() - this.leftHeaderWidth()) - (this.headerWidth() * this.i_headers.length));
this.i_header_scroll_date.style.width=(h_scroll > 0 ? h_scroll : "0")+"px";
this.i_header_scroll_date.style.height=this.headerHeight()+"px";
this.i_header_scroll_date.innerHTML="&nbsp;";
this.i_header_scroll_date.style.fontSize="1px";
this.i_header_scroll_date.style.display=(this.contentHeight() > this.viewportHeight() ? "" : "none");
this.i_header_scroll_date.style.borderBottomWidth="0px";
this.i_header_bar.appendChild(this.i_header_scroll_date);
this.i_all_day_bar=document.createElement('DIV');
this.i_all_day_bar.className="CalendarViewHeaderType_allday";
this.i_all_day_bar.style.width=this.width()+"px";
this.i_all_day_bar.style.height=(this.allDayHeight() <=0 ? 1 : this.allDayHeight())+"px";
this.i_all_day_bar.style.display=(this.allDayHeight() > 0 ? "" : "none");
this.i_all_day_bar.style.overflow="hidden";
this.i_display_view.appendChild(this.i_all_day_bar);
this.i_header_ald_corner_left=document.createElement('DIV');
this.i_header_ald_corner_left.className="CalendarViewHeader";
this.i_header_ald_corner_left.style.width=(this.leftHeaderWidth() * 0.5)+"px";
this.i_header_ald_corner_left.style.height=this.allDayHeight()+"px";
this.i_header_ald_corner_right=document.createElement('DIV');
this.i_header_ald_corner_right.className="CalendarViewHeader";
this.i_header_ald_corner_right.style.width=(this.leftHeaderWidth() * 0.5)+"px";
this.i_header_ald_corner_right.style.height=this.allDayHeight()+"px";
this.i_header_ald_corner_chevron=document.createElement('DIV');
this.i_header_ald_corner_chevron.className="CalendarViewHeader_chevron";
this.i_header_ald_corner_chevron.style.display="none";
this.i_header_ald_corner_chevron.style.width=(this.leftHeaderWidth() * 0.5)+"px";
this.i_header_ald_corner_right.appendChild(this.i_header_ald_corner_chevron);
EventHandler.register(this.i_header_ald_corner_chevron, "onclick", this.handleToggleAllDay, this);
this.i_all_day_bar.appendChild(this.i_header_ald_corner_left);
this.i_all_day_bar.appendChild(this.i_header_ald_corner_right);
for (var x=0; x < this.i_headers.length; x++) {
this.i_all_day_bar.appendChild(this.i_headers[x].getAllDayHeader());
}
for (var x=0; x < this.i_headers.length - 1; x++) {
this.i_headers[x].getAllDayHeader().style.borderRightWidth="0px";
}
if (this.i_headers.length > 0) {
this.i_headers[this.i_headers.length - 1].getAllDayHeader().style.borderRightWidth="1px";
}
this.i_header_scroll=document.createElement('DIV');
this.i_header_scroll.className="CalendarViewHeader";
this.i_header_scroll.style.width=((this.width() - this.leftHeaderWidth()) - (this.headerWidth() * this.i_headers.length))+"px";
this.i_header_scroll.style.height=this.allDayHeight()+"px";
this.i_header_scroll.innerHTML="&nbsp;";
this.i_header_scroll.style.fontSize="1px";
this.i_header_scroll.style.display=(this.contentHeight() > this.viewportHeight() ? "" : "none");
this.i_header_scroll.style.borderTopWidth="0px";
this.i_all_day_bar.appendChild(this.i_header_scroll);
this.i_display_content=document.createElement('DIV');
this.i_display_content.className="CalendarViewHeaderType_content";
this.i_display_content.style.width=this.width()+"px";
this.i_display_content.style.height=(this.height() - this.headerHeight() - this.allDayHeight())+"px";
this.i_display_view.appendChild(this.i_display_content);
this.i_display_left=document.createElement('DIV');
this.i_display_left.className="CalendarViewHeaderType_left";
this.i_display_left.style.width=this.leftHeaderWidth()+"px";
this.i_display_left.style.height=this.contentHeight()+"px";
this.i_display_content.appendChild(this.i_display_left);
for (var x=0; x < this.i_left_headers.length; x++){ 
this.i_display_left.appendChild(this.i_left_headers[x].getHeader());
}
this.i_display_grid=document.createElement('DIV');
this.i_display_grid.className="CalendarViewHeaderType_grid"+(this.noScroll() ? "_no_scroll" : "");
this.i_display_grid.style.width=this.contentWidth()+"px";
this.i_display_grid.style.height=this.contentHeight()+"px";
this.i_display_grid.offsetParentReal=true;
this.i_display_content.appendChild(this.i_display_grid);
this.i_display_data=document.createElement('DIV');
this.i_display_data.className="CalendarViewHeaderType_data";
this.i_display_data.style.width=(this.headerWidth() * this.i_headers.length)+"px";
this.i_display_grid.appendChild(this.i_display_data);
this.i_display_rows=document.createElement('DIV');
this.i_display_rows.className="CalendarViewHeaderType_rows";
this.i_display_rows.style.width=this.contentWidth()+"px";
this.i_display_rows.style.height=this.contentHeight()+"px";
this.i_display_grid.appendChild(this.i_display_rows);
this.i_row_cache=Array();
var cw=(this.headerWidth() * this.i_headers.length);
for (var x=0; x < this.i_left_headers.length; x++) { 
var c=this.i_left_headers[x].getRow();
for (var z=0; z < c.length; z++) {
c[z].style.width=cw+"px";
this.i_display_rows.appendChild(c[z]);
}
this.i_row_cache[x]=c;
}
this.i_display_columns=document.createElement('DIV');
this.i_display_columns.className="CalendarViewHeaderType_columns";
this.i_display_columns.style.width=this.contentWidth()+"px";
this.i_display_columns.style.height=this.contentHeight()+"px";
this.i_display_grid.appendChild(this.i_display_columns);
for (var x=0; x < this.i_headers.length; x++) { 
var c=this.i_headers[x].getColumn();
c.style.width=this.headerWidth()+"px";
c.style.height=this.contentHeight()+"px";
this.i_display_columns.appendChild(c);
}
this.i_event_holder=document.createElement('DIV');
this.i_event_holder.className="CalendarViewHeaderType_event_holder";
this.i_display_grid.appendChild(this.i_event_holder);
this.handleHeaderResize();
if (this.onbuild!=undefined) {
var o=new Object();
o.type="build";
o.view=this;
this.onbuild(o);
}
}
if (!this.allDayMinimized()) {
this.allDayMinimized(true);
this.i_header_ald_corner_chevron.style.backgroundPosition="0px -446px";
}
this.ignoreUpdate(false);
return this.i_display_view;
}
CalendarViewHeaderType.inherit(CalendarViewType);
function CalendarViewHeader(text, selected) {
this.i_text=text;
this.i_selected=selected;
this.i_width=100;
this.i_height=20;
this.i_all_day_height=0;
this.i_events=Array();
this.i_event_cache=Array();
this.i_ald_event_cache=Array();
}
CalendarViewHeader.prototype.parent=function() {
return this.i_parent;
}
CalendarViewHeader.prototype.text=function(text) {
if (text!=undefined) {
this.i_text=text;
if (this.i_header!=undefined) {
this.i_header.innerHTML=this.text();
}	
}
return this.i_text;
}
CalendarViewHeader.prototype.getArea=function() {
return this.i_rectDimension;
}
CalendarViewHeader.prototype.selected=function(state) {
if (state!=undefined) {
this.i_selected=state;
if (this.i_header!=undefined) {
this.i_header.className="CalendarViewHeader"+(this.selected() ? "_selected" : "");
}
}
return this.i_selected;
}
CalendarViewHeader.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_header!=undefined) {
this.i_header.style.width=this.width()+"px";
}
if (this.i_ald_header!=undefined) {
this.i_ald_header.style.width=this.width()+"px";
this.i_ald_inner.style.width=(this.width() - 3)+"px";
this.i_ald_more_link.style.width=(this.width() - 3)+"px";
}
if (this.i_column!=undefined) {
this.i_column.style.width=this.width()+"px";
this.i_column_text.style.width=(this.width() - 1)+"px";
}
if (this.i_event_cache!=undefined) {
for (var x=0; x < this.i_event_cache.length; x++){ 
this.i_event_cache[x].width(this.width() - 9);
}
}
}
return this.i_width;
}
CalendarViewHeader.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_header!=undefined) {
this.i_header.style.height=this.height()+"px";
this.i_header.style.lineHeight=(this.height() - 2)+"px";
}
}
return this.i_height;
}
CalendarViewHeader.prototype.allDayHeight=function(height) {
if (height!=undefined && this.i_all_day_height!=height) {
this.i_all_day_height=height;
if (this.i_ald_header!=undefined) {
this.i_ald_header.style.height=this.allDayHeight()+"px";
var iheight=(this.allDayHeight() - (6+CalendarViewHeaderType.allDayBorderBottom));
if (iheight <=0) {
iheight=1;
}
this.i_ald_inner.style.height=iheight+"px";
}
this.refreshEvents();
}
return this.i_all_day_height;
}
CalendarViewHeader.prototype.hideExpanded=function() {
if (this.i_ald_expanded!=undefined) {
this.getExpandedAllDay().style.display="none";
}
if (this.i_expanded_l!=undefined) {
this.i_expanded_l.unregister();
this.i_expanded_l=null;
}
}
CalendarViewHeader.prototype.cellHeight=function(height) {
if (height!=undefined) {
if (height==false) {
height=undefined;
}
this.i_cell_height=height;
if (this.i_column_text!=undefined) {
if (this.i_cell_height==undefined) {
this.i_column_text.style.lineHeight="";	
this.i_column_text.style.top="0px";
}
else {
if (height > 0) {
this.i_column_text.style.lineHeight=height+"px";
}
var tp=Math.floor((height - 15) / 2);
if (tp < 1) {
tp=1;
}
this.i_column_text.style.top="-"+tp+"px";
}
}
}
return this.i_cell_height;
}
CalendarViewHeader.prototype.getColumn=function() {
if (this.i_column==undefined) {
this.i_column=document.createElement('DIV');
this.i_column.className="CalendarViewHeader_column";
this.i_column_text=document.createElement('DIV');
this.i_column_text.className="CalendarViewHeader_column_text";
this.i_column.appendChild(this.i_column_text);
if (this.cellHeight()!=undefined) {
this.i_column_text.style.lineHeight=this.cellHeight()+"px";
}
}
return this.i_column;
}
CalendarViewHeader.prototype.getAllDayHeader=function() {
if (this.i_ald_header==undefined) {
this.i_ald_header=document.createElement('DIV');
this.i_ald_header.className="CalendarViewHeader_allday";
this.i_ald_header.style.width=this.width()+"px";
this.i_ald_header.style.paddingTop="1px";
this.i_ald_header.style.paddingLeft="1px";
this.i_ald_header.style.height=this.allDayHeight()+"px";
this.i_ald_inner=document.createElement('DIV');
this.i_ald_inner.className="CalendarViewHeader_allday_inner";
this.i_ald_inner.style.width=(this.width() - 3)+"px";
var iheight=(this.allDayHeight() - (6+CalendarViewHeaderType.allDayBorderBottom));
if (iheight <=0) {
iheight=1;
}
this.i_ald_inner.style.height=iheight+"px";
this.i_ald_header.appendChild(this.i_ald_inner);
EventHandler.register(this.i_ald_inner, "oncontextmenu", this.handleContextMenu, this);
this.i_ald_expanded=document.createElement('DIV');
this.i_ald_expanded.style.position="relative";
this.parent().i_display_view.appendChild(this.i_ald_expanded);
this.i_ald_more_link=document.createElement('DIV');
this.i_ald_more_link.className="CalendarViewHeader_allday_more";
this.i_ald_more_link.style.height=(CalendarMonthView.eventHeight - 4)+"px";
this.i_ald_more_link.style.width=(this.width() - 3)+"px";
this.i_ald_inner.appendChild(this.i_ald_more_link);
EventHandler.register(this.i_ald_more_link, "onclick", this.handleMoreLinkClick, this);		
this.i_context_menu=this.parent().parent().genericContextMenu();
}
return this.i_ald_header;
}
CalendarViewHeader.prototype.refreshEvents=function() {
while (this.i_event_cache.length < this.i_events.length) {
this.i_event_cache[this.i_event_cache.length]=new MonthViewEvent(this.width() - 5, CalendarMonthView.eventHeight, 2, 2, undefined);
this.i_event_cache[this.i_event_cache.length - 1].i_parent=this;
this.i_ald_inner.appendChild(this.i_event_cache[this.i_event_cache.length - 1].getEvent());
}
var x;
var tp=2;
for (x=0; x < this.i_events.length; x++) {
var start_time=this.i_events[x].param("start");
if (start_time==undefined) {
this.i_event_cache[x].visible(false);
} else {
this.i_event_cache[x].top(tp+1);
this.i_event_cache[x].left(2);
this.i_event_cache[x].width(this.width() - 9);
this.i_event_cache[x].eventObject(this.i_events[x]);
this.i_event_cache[x].extended(this.i_display_date.m!=start_time.getMonth() || this.i_display_date.d!=start_time.getDate());
this.i_event_cache[x].visible(true);
tp+=(CalendarMonthView.eventHeight+2);
if (this.parent().allDayMinimized()) {
x++;
break;
}
}
}
for (x; x < this.i_event_cache.length; x++){ 
this.i_event_cache[x].visible(false);
}
}
CalendarViewHeader.prototype.events=function(index) {
if (index!=undefined) {
return this.i_events[index];
}
return this.i_events;
}
CalendarViewHeader.prototype.addEvent=function(ev, beforeEvent, dontRefresh) {
if (typeof ev.eventType=="function" && (ev.eventType()==2 || ev.eventType()==3 || ev.eventType()==5)) {
for (var i=0; i < this.i_events.length;++i) {
var known=this.i_events[i];
if (typeof known.eventType!="function") continue; 
if(known.eventType()==ev.eventType()) {
var itemId=ev.id();
var knownId=known.id();
if(ev.type()=="event" && ev.eventType()==CalendarEvent.Subtype.holiday) {
itemId+=ev.title();
knownId+=known.title();
}
if(itemId==knownId) {
return ev;
}
}
}
}
this.parent().ignoreUpdate(true);
var append=true;
if (beforeEvent!=undefined) {
for (var x=0; x < this.i_events.length; x++) {
if (this.i_events[x]==beforeEvent) {
this.i_events.splice(x, 0, ev);
append=false;
break;
}
}
}
if (append) {
this.i_events[this.i_events.length]=ev;
}
if (!dontRefresh) this.refreshEvents();
this.parent().updateAllDayCells();
this.parent().ignoreUpdate(false);
return ev;
}
CalendarViewHeader.prototype.removeEvent=function(ev, dontRefresh) {
for (var x=0; x < this.i_events.length; x++) {
if (this.i_events[x]==ev) {
this.parent().ignoreUpdate(true);
this.i_events.splice(x, 1);
if (!dontRefresh) this.refreshEvents();
this.parent().updateAllDayCells();
this.parent().ignoreUpdate(false);
return true;
}
}
return false;
}
CalendarViewHeader.prototype.clearEvents=function(dontRefresh) {
this.parent().ignoreUpdate(true);
this.i_events=Array();
if (!dontRefresh) this.refreshEvents();
this.parent().updateAllDayCells();
this.parent().ignoreUpdate(false);
}
CalendarViewHeader.prototype.handleClick=function(e) {
if (this.onclick!=undefined) {
var bt=(e.button > 0 ? e.button : e.which);
if (bt!=2) {
e.header=this;
this.onclick(e);
}
}
}
CalendarViewHeader.prototype.handleCellClick=function(e) {
e.cancelBubble=true;
e.returnValue=false;
}
CalendarViewHeader.prototype.handleExpandedClick=function(e) {
var xPos=CursorMonitor.getX();
var yPos=CursorMonitor.getY();
var ds=this.parent().i_display_content;
var lf=0;
var tp=0;
while (ds!=null) {
lf+=parseInt(ds.offsetLeft);
tp+=parseInt(ds.offsetTop);
ds=ds.offsetParent;
}
xPos -=lf;
yPos -=(tp - this.allDayHeight());
if (xPos < this.i_cache_pos.left || xPos > this.i_cache_pos.left+this.i_cache_pos.width || 
yPos < this.i_cache_pos.top || yPos > this.i_cache_pos.top+this.i_cache_pos.height) {
this.hideExpanded();
}
}
CalendarViewHeader.prototype.handleMoreLinkClick=function(e) {
var exp=this.getExpandedAllDay();
exp.style.display="";
var h=((this.events().length) * (CalendarMonthView.eventHeight+2))+17;
var w=this.width()+CalendarMonthMore.extraWidth;
var startday=this.i_display_date.wd - Application.getApplicationById(1004).getCalendarView().getCalendarView().startingDay();
if (startday < 0) startday+=7;
var slf=(this.width() * startday)+this.parent().leftHeaderWidth();
var stp=(-1 * this.allDayHeight());
if ((slf+w) > this.parent().width()) {
slf=(this.parent().width() - w) - CalendarMonthMore.offset;
}
this.i_expanded_shadow.style.left=(slf+CalendarMonthMore.shadowDepth)+"px";
this.i_expanded_shadow.style.top=(stp+CalendarMonthMore.shadowDepth)+"px";
this.i_expanded_shadow.style.width=(w+CalendarMonthMore.offset)+"px";
this.i_expanded_shadow.style.height=(h+CalendarMonthMore.offset)+"px";
this.i_expanded_cell.style.left=slf+"px";
this.i_expanded_cell.style.top=stp+"px";
this.i_expanded_cell.style.width=(w+(document.all ? 4 : 0))+"px";
this.i_expanded_cell.style.height=h+"px";
EventHandler.register(this.i_expanded_cell, "onclick", this.handleCellClick, this);
this.i_cache_pos={'top':0,'left':slf,'width':(w+(document.all ? 4 : 0)),'height':h};
this.i_expanded_l=EventHandler.register(document.body, "onmouseup", this.handleExpandedClick, this);
var x=0;
for (x; x < this.i_events.length; x++) {
var ev_left=2;
var ev_top=(x * (CalendarMonthView.eventHeight+2));
if (this.i_ald_event_cache[x]==undefined) {
this.i_ald_event_cache[x]=new MonthViewEvent(w - 4,CalendarMonthView.eventHeight,ev_left,ev_top,this.i_events[x]);
this.i_ald_event_cache[x].i_parent=this;
this.i_expanded_cell.appendChild(this.i_ald_event_cache[x].getEvent());
}
else {
this.i_ald_event_cache[x].eventObject(this.i_events[x]);
this.i_ald_event_cache[x].left(ev_left);
this.i_ald_event_cache[x].top(ev_top);
this.i_ald_event_cache[x].width(w - 4);
}
this.i_ald_event_cache[x].visible(true);
}
for (x; x < this.i_ald_event_cache.length;x++) {
this.i_ald_event_cache[x].visible(false);
}
this.i_expanded_close.style.top=(this.i_events.length) * (CalendarMonthView.eventHeight+2) - 2;
this.i_expanded_close.style.width=w - 4;
}
CalendarViewHeader.prototype.handleContextMenu=function(e) {
e.cancelBubble=true;
e.returnValue=false;
this.parent().parent().i_generic_new_ald_event.visible(true);
this.parent().parent().i_generic_new_event.visible(false);
this.i_context_menu.i_target_date=new Date();
this.i_context_menu.i_target_date.setMonth(this.i_display_date.m);
this.i_context_menu.i_target_date.setFullYear(this.i_display_date.y);
this.i_context_menu.i_target_date.setDate(this.i_display_date.d);
var cdate=new Date();
this.i_context_menu.i_target_date.setMinutes(0);
this.i_context_menu.i_target_date.setHours(cdate.getHours()+1);
this.i_context_menu.i_target_date.setSeconds(0);
this.i_context_menu.show();
}
CalendarViewHeader.prototype.getHeader=function() {
if (this.i_header==undefined) {
this.i_header=document.createElement('DIV');
this.i_header.className="CalendarViewHeader"+(this.selected() ? "_selected" : "");
this.i_header.style.width=this.width()+"px";
this.i_header.style.height=this.height()+"px";
this.i_header.style.lineHeight=(this.height() - 2)+"px";
EventHandler.register(this.i_header, "onclick", this.handleClick, this);
this.i_header.innerHTML=this.text();
}
return this.i_header;
}
CalendarViewHeader.prototype.getExpandedAllDay=function() {
if (this.i_shadow_holder==undefined) {
this.i_shadow_holder=document.createElement('DIV');
this.i_shadow_holder.className="CalendarMonthMore_shadow_holder";
this.i_ald_expanded.appendChild(this.i_shadow_holder);
this.i_expanded_shadow=document.createElement('DIV');
this.i_expanded_shadow.className="CalendarMonthMore_shadow";
this.i_shadow_holder.appendChild(this.i_expanded_shadow);
this.i_cell_holder=document.createElement('DIV');
this.i_cell_holder.className="CalendarMonthMore_cell_holder";
this.i_ald_expanded.appendChild(this.i_cell_holder);
this.i_expanded_cell=document.createElement('DIV');
this.i_expanded_cell.className="CalendarMonthMore_cell";
this.i_expanded_cell.style.paddingTop="2px";
this.i_cell_holder.appendChild(this.i_expanded_cell);
this.i_expanded_close=document.createElement('DIV');
this.i_expanded_close.className="CalendarMonthMore CalendarMonthMore_close";
this.i_expanded_close.innerHTML="Close";
EventHandler.register(this.i_expanded_close, "onclick", this.hideExpanded, this);
this.i_expanded_cell.appendChild(this.i_expanded_close);
}
return this.i_ald_expanded;
}
function CalendarViewLeftHeader(height) {
this.i_height=height;	
}
CalendarViewLeftHeader.prototype.onclick=null;
CalendarViewLeftHeader.prototype.onchangeheight=null;
CalendarViewLeftHeader.prototype.parent=function() {
return this.i_parent;
}
CalendarViewLeftHeader.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_header!=undefined) {
this.i_header.style.width=this.width()+"px";
}
}
return this.i_width;
}
CalendarViewLeftHeader.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_header!=undefined && height > 0) {
this.i_header.style.height=this.height()+"px";
}
if (this.i_row!=undefined && height > 0) {
this.i_row[0].style.height=this.height()+"px";
}
if (this.onchangeheight!=undefined) {
var o=new Object();
o.type="changeheight";
o.header=this;
this.onchangeheight(o);
}
}
return this.i_height;
}
CalendarViewLeftHeader.prototype.getRow=function() {
if (this.i_row==undefined) {
this.i_row=Array();
this.i_row[0]=document.createElement('DIV');
this.i_row[0].className="CalendarViewHeader_row";
this.i_row[0].style.height=this.height()+"px";
this.i_row[0].innerHTML="&nbsp;";
}
return this.i_row;
}
CalendarViewLeftHeader.prototype.handleClick=function(e) {
if (this.onclick!=undefined) {
e.header=this;
this.onclick(e);
}
}
CalendarViewLeftHeader.prototype.getHeader=function() {
if (this.i_header==undefined) {
this.i_header=document.createElement('DIV');
this.i_header.className="CalendarViewLeftHeader";
this.i_header.style.width=this.width()+"px";
this.i_header.style.height=this.height()+"px";
EventHandler.register(this.i_header, "onclick", this.handleClick, this);
this.i_header.innerHTML="&nbsp;";
}
return this.i_header;
}
function CalendarMonthView() {
this.superCalendarViewHeaderType();
EventHandler.register(this, "onchangestart", this.handleChangeStart, this);
EventHandler.register(this, "onload", this.handleViewLoad, this);
EventHandler.register(this, "onunload", this.handleViewUnload, this);
EventHandler.register(this, "onbuild", this.handleBuild, this);
EventHandler.register(this, "onresize", this.handleResize, this);
EventHandler.register(this, "ondatachange", this.handleDataChange, this);
EventHandler.register(this, "ondelete", this.handleDeleteEvent, this);
this.i_today=new Date();
this.i_gray_zones=Array();
this.i_gray_bars=Array();
this.i_shade=Array();
this.i_is_month_view=true;
this.i_event_cache=Array();
this.i_more_cache=Array();
this.headerHeight(20);
this.leftHeaderWidth(10);
this.i_wdays=Array();
this.i_wdays[0]=new CalendarViewHeader(CalendarMonthView.weekDays[0]);
this.i_wdays[1]=new CalendarViewHeader(CalendarMonthView.weekDays[1]);
this.i_wdays[2]=new CalendarViewHeader(CalendarMonthView.weekDays[2]);
this.i_wdays[3]=new CalendarViewHeader(CalendarMonthView.weekDays[3]);
this.i_wdays[4]=new CalendarViewHeader(CalendarMonthView.weekDays[4]);
this.i_wdays[5]=new CalendarViewHeader(CalendarMonthView.weekDays[5]);
this.i_wdays[6]=new CalendarViewHeader(CalendarMonthView.weekDays[6]);
for (var x=0; x < 7; x++) {
EventHandler.register(this.i_wdays[x].getHeader(), "oncontextmenu", this.handleHeaderContext, this);
this.addHeader(this.i_wdays[x]);
}
this.i_weeks=Array();
var rows=CalendarMonthView.viewRows;
var h=Math.floor(this.viewportHeight() / rows);
for (var x=0; x < rows; x++) {
this.i_weeks[x]=new CalendarViewLeftHeader(h);
EventHandler.register(this.i_weeks[x], "onclick", this.handleWeekClick, this);
}
this.addLeftHeaders(this.i_weeks);
this.shadeCalendar(3, -3, 7);
}
CalendarMonthView.viewRows=6;
CalendarMonthView.eventHeight=18;
CalendarMonthView.moreHeight=14;
CalendarMonthView.monthLength=Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
CalendarMonthView.isLeap=function(y_) {
if ((y_ % 4==0 && y_ % 100!=0) ||
(y_ % 4==0 && y_ % 100==0 && y_ % 400==0)) {
return 1;
} else {
return 0;
}
}
CalendarMonthView.monthNames=Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
CalendarMonthView.monthNamesAbbr=Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
CalendarMonthView.weekDays=Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
CalendarMonthView.weekDaysAbbr=Array("Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat");
CalendarMonthView.positionOffset=(document.all ? 4 : 0);
CalendarMonthView.prototype.handleChangeStart=function(e) {
this.updateFocus();
this.refreshData();
}
CalendarMonthView.prototype.handleViewLoad=function(e) {
this.i_ld_n=EventHandler.register(this.i_parent, "onnext", this.handleNext, this);
this.i_ld_p=EventHandler.register(this.i_parent, "onprevious", this.handlePrevious, this);
this.i_ld_fc=EventHandler.register(this, "onchangefocus", this.handleFocusChange, this);
this.i_ld_sc=EventHandler.register(this, "onchangeselected", this.handleSelectedChange, this);
this.updateFocus();
this.refreshData(true);
this.throwDisplayViewEvent(); 
}
CalendarMonthView.prototype.handleViewUnload=function(e) {
if (this.i_ld_n!=undefined) {
this.i_ld_n.unregister();
this.i_ld_p.unregister();
this.i_ld_fc.unregister();
this.i_ld_sc.unregister();
this.i_ld_n=null;
this.i_ld_p=null;
this.i_ld_fc=null;
this.i_ld_sc=null;
}
}
CalendarMonthView.prototype.handleWeekClick=function(e) {
var pos=this.cursorPosition();
var dt=new Date();
dt.setFullYear(this.i_layout_cache[0][pos.row].y);
dt.setMonth(this.i_layout_cache[0][pos.row].m, this.i_layout_cache[0][pos.row].d);
dt.setHours(0);
dt.setMinutes(0);
dt.setSeconds(0);
this.parent().focusDate(dt);
this.parent().viewTypes(1).active(true);
}
CalendarMonthView.prototype.handleNext=function(e) {
var f=this.focusDate();
var f2=f.copy(true);
var month=f.getMonth();
var year=f.getFullYear();
if (month < 11) {
month++;
}
else {
month=0;
year++;
}
f2.setFullYear(year);
f2.setMonth(month, 1);
this.parent().focusDate(f2);
this.throwDisplayViewEvent(); 
}
CalendarMonthView.prototype.handlePrevious=function(e) {
var f=this.focusDate();
var f2=f.copy(true);
var month=f.getMonth();
var year=f.getFullYear();
if (month > 0) {
month--;
}
else {
month=11;
year--;
}
f2.setFullYear(year);
f2.setMonth(month, 1);
this.parent().focusDate(f2);
this.throwDisplayViewEvent(); 
}
CalendarMonthView.cacheObjectToString=function() {
return this.d;
}
CalendarMonthView.cacheObjectToMonthString=function() {
return this.d+"&nbsp;&nbsp;<span class='CalendarMonthView_cell_month'>"+CalendarMonthView.monthNames[this.m].toUpperCase()+"</span>";
}
CalendarMonthView.cacheObjectToMonthStringAbbr=function() {
return this.d+"&nbsp;&nbsp;<span class='CalendarMonthView_cell_month'>"+CalendarMonthView.monthNamesAbbr[this.m].toUpperCase()+"</span>";
}
CalendarMonthView.prototype.updateFocus=function() {
if (this.parent().activeView()!=this) {
return true;
}
var fdate=this.focusDate();
if (fdate==undefined) {
fdate=this.focusDate(new Date(), true);
}
for (var x=0; x < this.i_wdays.length; x++) {
var z=(x+this.startingDay()) % 7;
if (this.i_wdays[x].width() < 70) {
this.i_wdays[x].text(CalendarMonthView.weekDaysAbbr[z]);
}
else {
this.i_wdays[x].text(CalendarMonthView.weekDays[z]);
}
}
var month=fdate.getMonth();
var year=fdate.getFullYear();
var day=fdate.getDate();
var first_day=new Date();
first_day.setFullYear(year);
first_day.setMonth(month, 1);
var first_weekday=first_day.getDay();
var month_length=CalendarMonthView.monthLength[month];
if (month==1) {
month_length+=CalendarMonthView.isLeap(year);
}
var pre_month=month - 1;
var pre_year=year;
if (month==0) {
pre_month=11;
pre_year--;
}
var next_month=month+1;
var next_year=year;
if (month==11) {
next_month=0;
next_year++;
}
var pre_month_length=CalendarMonthView.monthLength[pre_month];
if (pre_month==1) {
pre_month_length+=CalendarMonthView.isLeap(pre_year);
}
var wk_row=Array();
for (var x=0; x < 7; x++) {
wk_row[x]=Array();
}
this.i_block_cache=Array();
first_weekday=(first_weekday - this.startingDay());
if (first_weekday < 0) {
first_weekday=7+first_weekday;
}
this.i_start_view=null;
this.i_end_view=null;
var m=0;
for (var x=0; x < first_weekday; x++) {
if (this.i_start_view==undefined) {
this.i_start_view=new Date();
this.i_start_view.setFullYear(pre_year);
this.i_start_view.setMonth(pre_month, ((pre_month_length - first_weekday)+x)+1);
this.i_start_view.setHours(0);
this.i_start_view.setMinutes(0);
this.i_start_view.setSeconds(0);
}
wk_row[m++][0]={'d':((pre_month_length - first_weekday)+x)+1, 'm':pre_month, 'y':pre_year, 'toString':(x!=0 ? CalendarMonthView.cacheObjectToString : (this.i_headers[0].width() < 100 ? CalendarMonthView.cacheObjectToMonthStringAbbr : CalendarMonthView.cacheObjectToMonthString))};
var o=new Object();
o.col=m - 1;
o.row=0;
this.i_block_cache[pre_year+":"+pre_month+":"+(((pre_month_length - first_weekday)+x)+1)]=o;
}
var last_day_ref;
var g=1;
var q;
var r=1;
var first=true;
while (g <=month_length) {
for (var y=m; y < 7; y++) {
if (this.i_start_view==undefined) {
this.i_start_view=new Date();
this.i_start_view.setFullYear(year);
this.i_start_view.setMonth(month, g);
this.i_start_view.setMinutes(0);
this.i_start_view.setHours(0);
this.i_start_view.setSeconds(0);
}
var o=new Object();
o.col=y;
o.row=wk_row[y].length;
this.i_block_cache[year+":"+month+":"+g]=o;
wk_row[y][o.row]={'d':g++,'m':month,'y':year, 'toString':(first==true ? (this.i_headers[0].width() < 100 ? CalendarMonthView.cacheObjectToMonthStringAbbr : CalendarMonthView.cacheObjectToMonthString) : CalendarMonthView.cacheObjectToString)};
last_day_ref=wk_row[y][o.row];
if (g > month_length) {
q=y+1;
r--;
break;
}
first=false;
}
m=0;
r++;
}
first=true;
var g=1;
while (r <=6) {
for (var x=q; x < 7; x++) {
var o=new Object();
o.col=x;
o.row=wk_row[x].length;
this.i_block_cache[next_year+":"+next_month+":"+g]=o;
wk_row[x][o.row]={'d':g++, 'm':next_month, 'y':next_year, 'toString':(first==true ? (this.i_headers[0].width() < 100 ? CalendarMonthView.cacheObjectToMonthStringAbbr : CalendarMonthView.cacheObjectToMonthString) : CalendarMonthView.cacheObjectToString)};
last_day_ref=wk_row[x][o.row];
first=false;
}
r++;
q=0;
}
this.i_end_view=new Date();
this.i_end_view.setFullYear(last_day_ref.y);
this.i_end_view.setMonth(last_day_ref.m, last_day_ref.d+1);
this.i_end_view.setHours(0);
this.i_end_view.setMinutes(0);
this.i_end_view.setSeconds(0);
this.i_end_view.setMilliseconds(0);
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].i_column_text!=undefined) {
if (wk_row[x]!=undefined) {
this.i_headers[x].i_column_text.innerHTML=wk_row[x].join('<br>');
}
}
}
g--;
this.shadeCalendar(first_weekday, (g > 7 ? -1 * (g - 7) : 0), (g > 7 ? 7 : -1 * g));
this.parent().headerText(CalendarMonthView.monthNames[month]+" "+year);
this.i_layout_cache=wk_row;
this.updateSelections();
}
CalendarMonthView.prototype.updateSelections=function() {
if (this.i_today_box!=undefined) {
var p=this.datePosition(this.i_today);
if (p!=undefined) {
this.i_today_box.style.display="";
this.i_today_box.style.width=(p.width - 1)+"px";
this.i_today_box.style.height=(p.height - 1)+"px";
this.i_today_box.style.top=p.top+"px";
this.i_today_box.style.left=p.left+"px";
}
else {
this.i_today_box.style.display="none";
}
var p=this.datePosition(this.selectedDate());
if (p!=undefined) {
this.i_selection_box.style.display="";
this.i_selection_box.style.width=(p.width - 1)+"px";
this.i_selection_box.style.height=(p.height - 1)+"px";
this.i_selection_box.style.top=p.top+"px";
this.i_selection_box.style.left=p.left+"px";
}
else {
this.i_selection_box.style.display="none";
}
}
}
CalendarMonthView.prototype.positionDate=function(x, y) {
var col=Math.floor(x / this.headerWidth());
var row=Math.floor(y / this.leftHeaders(0).height());
if(col >=0 && row >=0) {
var wk=this.i_layout_cache[col][row];
if(wk!=undefined) {
if (wk.fd!=undefined) {
return wk.fd;
}
var d=new Date();
d.setYear(wk.y);
d.setMonth(wk.m,wk.d);
d.setMinutes(0);
d.setHours(0);
d.setSeconds(0);
wk.fd=d;
return d;
}
}
}
CalendarMonthView.prototype.datePosition=function(date) {
var month=date.getMonth();
var day=date.getDate();
var year=date.getFullYear();
var cache=this.i_block_cache[year+":"+month+":"+day];
if (cache!=undefined) {
var p=new Object();
p.width=this.headerWidth();
p.height=this.leftHeaders(0).height();
p.left=(cache.col * p.width);
p.top=(cache.row * p.height);
p.row=cache.row;
p.col=cache.col;
return p;
}
return undefined;
}
CalendarMonthView.prototype.handleDayDoubleClick=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var allow=this.checkPosition(x, y);
if (allow==undefined) {
var me=this.i_display_grid;
var lf=0;
var tp=0;
while (me!=undefined) {
lf+=parseInt(me.offsetLeft)+parseInt(me.scrollLeft);
tp+=parseInt(me.offsetTop)+parseInt(me.scrollTop);
me=me.offsetParent;
}
var diffx=x - lf;
var diffy=y - tp;
if (diffx > 0 && diffy > 0) {
var d=this.positionDate(diffx, diffy);
this.parent().focusDate(d);
this.parent().viewTypes(2).active(true);
}
}
}
CalendarMonthView.prototype.handleDayClick=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var allow=this.checkPosition(x, y);
if (allow==undefined) {
var me=this.i_display_grid;
var lf=0;
var tp=0;
while (me!=undefined) {
lf+=parseInt(me.offsetLeft)+parseInt(me.scrollLeft);
tp+=parseInt(me.offsetTop)+parseInt(me.scrollTop);
me=me.offsetParent;
}
var diffx=x - lf;
var diffy=y - tp;
if (diffx > 0 && diffy > 0) {
var d=this.positionDate(diffx, diffy);
this.parent().selectedDate(d);
this.parent().focusDate(d);
}
}
}
CalendarMonthView.prototype.handleContextMenu=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var allow=this.checkPosition(x, y);
if (allow==undefined) {
var me=this.i_display_grid;
var lf=0;
var tp=0;
while (me!=undefined) {
lf+=parseInt(me.offsetLeft)+parseInt(me.scrollLeft);
tp+=parseInt(me.offsetTop)+parseInt(me.scrollTop);
me=me.offsetParent;
}
var diffx=x - lf;
var diffy=y - tp;
if (diffx > 0 && diffy > 0) {
var cx=this.parent().genericContextMenu();
cx.i_target_date=this.positionDate(diffx, diffy);
var cdate=new Date();
cx.i_target_date.setMinutes(0);
cx.i_target_date.setHours(cdate.getHours()+1);
cx.i_target_date.setSeconds(0);
cx.show();
e.cancelBubble=true;
e.returnValue=false;
}
}
}
CalendarMonthView.prototype.handleBuild=function(e) {
EventHandler.register(this.i_display_content, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_display_content, "onmousemove", this.handleMouseMove, this);
EventHandler.register(this.i_display_content, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_display_grid, "onclick", this.handleDayClick, this);
EventHandler.register(this.i_display_grid, "ondblclick", this.handleDayDoubleClick, this);
EventHandler.register(this.i_display_grid, "oncontextmenu", this.handleContextMenu, this);
for (var x=0; x < 3; x++) {
this.i_gray_zones[x]=document.createElement('DIV');
this.i_gray_zones[x].className="CalendarMonthView_gray_zone_holder";
this.i_display_data.appendChild(this.i_gray_zones[x]);
this.i_gray_bars[x]=document.createElement('DIV');
this.i_gray_bars[x].className="CalendarMonthView_gray_zone CalendarMonthView_gray_zone_left";
this.i_gray_bars[x].style.display="none";
this.i_gray_bars[x].style.top=(x==0 ? 0 : (x==1 ? (this.leftHeaders(0).height() * 4) : (this.leftHeaders(0).height() * 5)));
this.i_gray_bars[x].style.height=this.leftHeaders(0).height()+"px";
this.i_gray_bars[x].innerHTML="&nbsp;";
this.i_gray_zones[x].appendChild(this.i_gray_bars[x]);
}
this.i_highlight_holder=document.createElement('DIV');
this.i_highlight_holder.className="CalendarMonthView_highlight_holder";
this.i_display_data.appendChild(this.i_highlight_holder);
this.i_highlight_box=document.createElement('DIV');
this.i_highlight_box.className="CalendarMonthView_highlight";
this.i_highlight_box.style.width=this.headerWidth()+"px";
this.i_highlight_box.style.height=this.leftHeaders(0).height()+"px";
this.i_highlight_box.style.display="none";
this.i_highlight_holder.appendChild(this.i_highlight_box);
this.i_today_holder=document.createElement('DIV');
this.i_today_holder.className="CalendarMonthView_highlight_holder";
this.i_display_data.appendChild(this.i_today_holder);
this.i_today_box=document.createElement('DIV');
this.i_today_box.className="CalendarMonthView_today";
this.i_today_box.style.width=this.headerWidth()+"px";
this.i_today_box.style.height=this.leftHeaders(0).height()+"px";
this.i_today_box.style.display="none";
this.i_today_holder.appendChild(this.i_today_box);
this.i_selection_holder=document.createElement('DIV');
this.i_selection_holder.className="CalendarMonthView_highlight_holder";
this.i_display_data.appendChild(this.i_selection_holder);
this.i_selection_box=document.createElement('DIV');
this.i_selection_box.className="CalendarMonthView_selected";
this.i_selection_box.style.width=this.headerWidth()+"px";
this.i_selection_box.style.height=this.leftHeaders(0).height()+"px";
this.i_selection_box.style.display="none";
this.i_selection_holder.appendChild(this.i_selection_box);
if (this.i_shade.length > 0) {
this.shadeCalendar(this.i_shade[0], this.i_shade[1], this.i_shade[2]);
}
this.updateFocus();
this.refreshData();
}
CalendarMonthView.prototype.shadeCalendar=function(row1, row2, row3) {
this.i_shade[0]=row1;
this.i_shade[1]=row2;
this.i_shade[2]=row3;
if (this.i_gray_zones.length!=0) {
for (var x=0; x < 3; x++) {
if (this.i_shade[x]==0) {
this.i_gray_bars[x].style.display="none";
}
else {
this.i_gray_bars[x].style.display="";
this.i_gray_bars[x].className="CalendarMonthView_gray_zone CalendarMonthView_gray_zone_"+(this.i_shade[x] >=0 ? "left" : "right");
this.i_gray_bars[x].style.width=(this.headerWidth() * Math.abs(this.i_shade[x]))+"px";
}
}
}
}
CalendarMonthView.prototype.cursorPosition=function() {
var o=new Object();
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var me=this.i_display_content;
var lf=0;
var tp=0;
while (me!=null) {
tp+=parseInt(me.offsetTop)+parseInt(me.scrollTop);
lf+=parseInt(me.offsetLeft)+parseInt(me.scrollLeft);
me=me.offsetParent;
}
var diffx=x - (lf+this.leftHeaderWidth()+CalendarMonthView.positionOffset);
var diffy=y - (tp+CalendarMonthView.positionOffset);
if (diffx < 0) {
o.col=-1;
o.width=(7 * this.headerWidth());
}
else {
o.col=Math.floor(diffx / this.headerWidth());
o.width=this.headerWidth();
}
o.row=Math.floor(diffy / this.leftHeaders(0).height());
o.height=this.leftHeaders(0).height();
return o;
}
CalendarMonthView.prototype.checkPosition=function(x, y) {
if (this.i_display_content!=undefined) {
var me=this.i_display_content;
var lf=0;
var tp=0;
while (me!=null) {
tp+=parseInt(me.offsetTop)+parseInt(me.scrollTop);
lf+=parseInt(me.offsetLeft)+parseInt(me.scrollLeft);
me=me.offsetParent;
}
x-=lf;
y-=tp;
for (var itx in this.i_event_cache) {
var ev=this.i_event_cache[itx];
if (!itx.match(/^i.*-.*$/) || ev==undefined) continue;
if (ev.visible()) {
var ev_left=ev.left();
var ev_top=ev.top();
var ev_width=ev.width();
var ev_height=ev.height();
if (ev_left < x && ev_left+ev_width > x && ev_top < y && ev_top+ev_height > y) {
return (ev.eventObject().access()==CalendarEvent.Permission.freebusy ? undefined : ev.eventObject());
}
}
}
}
return undefined;
}
CalendarMonthView.prototype.handleMouseOver=function(e) {
this.i_highlight_box.style.display="";
}
CalendarMonthView.prototype.handleMouseOut=function(e) {
this.i_highlight_box.style.display="none";
}
CalendarMonthView.prototype.handleMouseMove=function() {
var p=this.cursorPosition();
if (p.col >=-1 && p.row >=0 && p.col < 7 && p.row < CalendarMonthView.viewRows) {
if (p.col==-1) {
p.col=0;
}
if (this.i_highlight_box!=undefined) {
this.i_highlight_box.style.display="";
this.i_highlight_box.style.left=(p.col * this.headerWidth())+"px";
this.i_highlight_box.style.top=(p.row * this.leftHeaders(0).height())+"px";
this.i_highlight_box.style.height=p.height+"px";
this.i_highlight_box.style.width=p.width+"px";
}
}	
else {
if (this.i_highlight_box!=undefined) {
this.i_highlight_box.style.display="none";
}
}
}
CalendarMonthView.prototype.handleResize=function(e) {
var h=Math.floor(this.viewportHeight() / this.i_weeks.length);
for (var x=0; x < this.i_weeks.length; x++) {
this.i_weeks[x].height(h);
}
for (var x=0; x < this.i_headers.length; x++) {
this.i_headers[x].cellHeight(h);
}
var over=(this.viewportHeight() - (h * this.i_weeks.length));
this.i_weeks[this.i_weeks.length - 1].height(h+over);
var lh=this.leftHeaders(0).height();
if (lh < 0) {
lh=0;
}
if (this.i_selection_box!=undefined) {
this.i_selection_box.style.width=this.headerWidth()+"px";
this.i_selection_box.style.height=lh+"px";
}
if(this.i_today_box!=undefined) {
this.i_today_box.style.width=this.headerWidth()+"px";
this.i_today_box.style.height=lh+"px";
}
for (var x=0; x < this.i_gray_bars.length; x++) {
this.i_gray_bars[x].style.top=(x==0 ? 0 : (x==1 ? (this.leftHeaders(0).height() * 4) : (this.leftHeaders(0).height() * 5)));
this.i_gray_bars[x].style.height=lh+"px";
if (this.i_shade.length!=0) {
this.i_gray_bars[x].style.width=(Math.abs(this.i_shade[x]) * this.headerWidth())+"px";
}
}
if (this.i_event_cache!=undefined) {
for (var itx in this.i_event_cache) {
var e=this.i_event_cache[itx];
if (!itx.match(/^i.*-.*$/) || e==undefined) continue;
e.width(this.headerWidth() - 5);
}
}
this.updateSelections();
this.repositionData();
this.updateFocus();
}
CalendarMonthView.prototype.handleDeleteEvent=function(e) {
}
CalendarMonthView.prototype.refreshData=function(force) {
if (this.i_display_grid!=undefined && this.parent().activeView()==this) {
if (force) {
var me=this;
if (this.i_forcedRefresh) {
clearTimeout(this.i_forcedRefresh);
}
this.i_forcedRefresh=setTimeout(function() {
this.i_forcedRefresh=true;
me.refreshData();
me=null;
}, 5);
return;
}
var sDate=this.i_start_view;
var eDate=this.i_end_view;
var cache_start=Math.floor(sDate.getTime() / 1000);
var cache_end=Math.floor(eDate.getTime() / 1000);
if (this.i_forcedRefresh || (this.i_cache_start!=cache_start && this.i_cache_end!=cache_end)) {
this.i_cache_end=cache_end;
this.i_cache_start=cache_start;
this.i_forcedRefresh=undefined;
var hit=new Object();
var evs;
var eventTypes=CalendarEvent.Subtype;
var dms=this.parent().dataModels();
for (var dm=0; dm < dms.length;++dm) {
if (dms[dm]==undefined) continue; 
else evs=dms[dm].dateRange(sDate, eDate); 
var dmId=dms[dm].id();
for (var i=0; i < evs.length();++i) {
var item=evs.getItem(i);
var itemId=item.i_id;
var itemStart=item.param("start");
var itemEnd=item.param("end");
var itemEType=(item.type()=="event" ? item.eventType() : null);
var myDmId="", specId="";
if(itemEType==eventTypes.holiday) {
itemId+=item.title();
}
if (itemEType==eventTypes.holiday || itemEType==eventTypes.birthday || itemEType==eventTypes.anniversary) {
specId="e"+itemStart.valueOf()+"-"+item.title();
if (!hit[specId]) hit[specId]=true;
else continue;
} else {
myDmId=dmId;
}
if (item.type()=="task") itemEnd=itemStart;
if (itemStart==undefined || itemEnd==undefined) {
continue; 
}
if (item.param("start") && !itemStart.inclusiveDays) itemStart=item.param("start", new Date(itemStart));
if (item.param("end") && !itemEnd.inclusiveDays) itemEnd=item.param("end", new Date(itemEnd));
var hits_days=itemStart.inclusiveDays(itemEnd);
for (var q=0; q < hits_days.length; q++) {
var key="i"+(hits_days[q][0] ? hits_days[q][0].valueOf() : "e"+hits_days[q][1].valueOf())+"-"+myDmId+itemId;
if (!hit[key]) {
hit[key]=true;
if (this.i_event_cache[key]==undefined) {
this.i_event_cache[key]=new MonthViewEvent(this.headerWidth() - 5, CalendarMonthView.eventHeight, 10, 10, undefined);
this.i_event_cache[key].visible(false);
this.i_event_cache[key].i_parent=this;
this.i_display_grid.appendChild(this.i_event_cache[key].getEvent());
}
this.i_event_cache[key].startDate(hits_days[q][0]);
if (item.type()=="event") {
this.i_event_cache[key].extended(hits_days[q][0].valueOf() > item.startTime().valueOf());
}
this.i_event_cache[key].i_junk=false;
this.i_event_cache[key].eventObject(item);
}
}
}
}
for (var key in this.i_event_cache) {
if (!key.match(/^i.*-/) || this.i_event_cache[key]==undefined || hit[key]) continue;
this.i_display_grid.removeChild(this.i_event_cache[key].getEvent());
this.i_event_cache[key].destroyEvents();
if (!delete this.i_event_cache[key]) this.i_event_cache[key]=undefined;
}
this.repositionData();
}
}
}
CalendarMonthView.prototype.repositionData=function() {
var cellSpace=Array();
for (var x in this.i_more_cache) {
if (this.i_more_cache[x]!=undefined && this.i_more_cache[x].visible!=undefined) {
this.i_more_cache[x].visible(false);
this.i_more_cache[x].clearEvents();
this.i_more_cache[x].i_hit=false;
}
}
for (var itx in this.i_event_cache) {
var eventObj=this.i_event_cache[itx];
if (!itx.match(/^i.*-.*$/) || eventObj==undefined) continue;
if (eventObj.i_junk!=true) {
var startD=eventObj.startDate();
var startDate=startD.getDate();
var startMonth=startD.getMonth();
if (cellSpace[startMonth+":"+startDate]==undefined) {
cellSpace[startMonth+":"+startDate]=16;
}
var p=this.datePosition(startD);
if (p!=undefined) {
if (this.i_more_cache[p.row+"."+p.col]==undefined) {
this.i_more_cache[p.row+"."+p.col]=new CalendarMonthMore(p.width - 5, CalendarMonthView.moreHeight, p.left+2, p.top+cellSpace[startMonth+":"+startDate], 0);
this.i_display_grid.appendChild(this.i_more_cache[p.row+"."+p.col].getLink());
}
var more_cache=this.i_more_cache[p.row+"."+p.col];
more_cache.hide();
more_cache.parent(this);
if (more_cache.i_hit!=true && cellSpace[startMonth+":"+startDate]+eventObj.height()+2 < p.height) {
eventObj.visible(true);
eventObj.width(p.width - 5);
eventObj.top(p.top+cellSpace[startMonth+":"+startDate]);
eventObj.left(p.left+2);
cellSpace[startMonth+":"+startDate]+=eventObj.height()+2;	
more_cache.visible(false);
more_cache.addEvent(eventObj);
}
else {
if (more_cache.count()==0) {
var e=more_cache.events();
if (e.length!=0) {
var r=e[e.length - 1];
more_cache.removeEvent(r);
more_cache.addOverflowEvent(r);
more_cache.i_hit=true;
r.visible(false);
cellSpace[startMonth+":"+startDate]-=eventObj.height()+2;
}
}
more_cache.addOverflowEvent(eventObj);
more_cache.width(p.width - 5);
more_cache.left(p.left+2);
more_cache.top(p.top+cellSpace[startMonth+":"+startDate]);
more_cache.visible(true);
eventObj.visible(false);
}
}
else {
eventObj.visible(false);
eventObj.i_junk=true;
}
}
else {
eventObj.visible(false);
}
}
}
CalendarMonthView.prototype.handleDataChange=function(e) {
this.updateFocus();
this.refreshData(true);
}
CalendarMonthView.prototype.handleFocusChange=function(e) {
this.updateFocus();
var time=this.focusDate();
if (e.oldtime.getMonth()!=time.getMonth() || e.oldtime.getFullYear()!=time.getFullYear()) this.refreshData();
}
CalendarMonthView.prototype.handleSelectedChange=function(e) {
this.updateFocus();
}
CalendarMonthView.prototype.printView=function() {
var ev_ref=Array();
var ev_data=Array();
for (var x=0; x < 6; x++) {
for (var y=0; y < 7; y++) { 
if (ev_data[y]==undefined) {
ev_data[y]=Array();
}
var d=this.i_layout_cache[y][x];
ev_ref[d.m+"."+d.d]={'col':y,'row':x};
ev_data[y][x]="";
}
}
for (var itx in this.i_event_cache) {
var ev=this.i_event_cache[itx];
if (!itx.match(/^i.*-.*$/) || ev==undefined) continue;
var ev_obj=ev.eventObject();
var loc=ev_ref[ev.startDate().getMonth()+"."+ev.startDate().getDate()];
if (loc!=undefined) {
if (ev_obj.type()=="task") {
ev_data[loc.col][loc.row]+="<div class='CalendarMonthView_print_task'>"+ev_obj.title()+"</div>";
}
else {
var timeTitle="All Day";
if (ev_obj.allDay()!="1") {
var startTime_hours=ev_obj.startTime().getHours();
var startTime_minutes=ev_obj.startTime().getMinutes();
var startTime_ampm="am";
if (startTime_hours==12) {
startTime_ampm="pm";
}
else if (startTime_hours > 12) {
startTime_hours-=12;
startTime_ampm="pm";
}
var endTime_hours=ev_obj.endTime().getHours();
var endTime_minutes=ev_obj.endTime().getMinutes();
var endTime_ampm="am";
if (endTime_hours==12) {
endTime_ampm="pm";
}
else if (endTime_hours > 12) {
endTime_hours-=12;
endTime_ampm="pm";
}
timeTitle=startTime_hours+":"+(startTime_minutes < 10 ? "0" : "")+startTime_minutes+startTime_ampm+"-"+endTime_hours+":"+(endTime_minutes < 10 ? "0" : "")+endTime_minutes+endTime_ampm;
}
ev_data[loc.col][loc.row]+="<div class='CalendarMonthView_print_event_time'>"+timeTitle+"</div><div class='CalendarMonthView_print_event_title'>"+BreakString(ev_obj.title(), 10)+"</div>";
}
}
}
var htmlData="<table cellspacing='0' cellpadding='0' border='0' class=\"CalendarBlockView_print_printMonth\">";
htmlData+="<tr><td align='center' colspan=7 style='border-left: 1px solid #000000; border-top: 1px solid #000000;'>"+this.parent().activeDataModel().name()+"</td></tr>";
htmlData+="<tr><td align='center' colspan=7 style='border-left: 1px solid #000000; border-top: 1px solid #000000;'>"+this.parent().headerText()+"</td></tr>";
htmlData+="<tr>";
for (var x=0; x < 7; x++) {
htmlData+="<td class='CalendarMonthView_dayheader'>"+this.headers(x).text()+"</td>";
}
htmlData+="</tr>";
var myMonth=this.focusDate().getMonth();
var d=new Date();
var myDay={'d':d.getDate(), 'm':d.getMonth()};
for (var x=0; x < 6; x++) {
var s_normalClass="";
var s_hoverClass="CalendarMonthView_hilite";
htmlData+="<tr>";
for (var y=0; y < 7; y++) {
var cell=this.i_layout_cache[y][x];
var dayNumber=cell.d;
s_normalClass="CalendarMonthView_monthDay";
if(myMonth!=cell.m) {
s_normalClass="CalendarMonthView_monthDayNot";
}
else if(myDay.m==cell.m && myDay.d==cell.d) {
s_normalClass="CalendarMonthView_monthDayToday";
}
htmlData+="<td class=\""+s_normalClass+"\"><div class=\"CalendarMonthView_day_number\">"+dayNumber+"</div>"+ev_data[y][x]+"</td>";
}
htmlData+="</tr>";
}
htmlData+="</tbody></table>";
var d=document.createElement('DIV');
d.innerHTML=htmlData;
SystemCore.loadPrintContent(d, true);
}
CalendarMonthView.prototype.throwDisplayViewEvent=function() {
if (this.ondisplayview!=undefined) {
var o=new Object();
o.type='displayview';
o.view=this;
o.view_type='m';   
this.ondisplayview(o);
}
}
CalendarMonthView.inherit(CalendarViewHeaderType);
function CalendarMonthMore(width, height, left, top) {
this.i_width=width;
this.i_height=height;
this.i_left=left;
this.i_top=top;
this.i_visible=true;
this.i_events=Array();
this.i_ov_events=Array();
this.i_event_cache=Array();
}
CalendarMonthMore.shadowDepth=3;
CalendarMonthMore.expandedWidth=200;
CalendarMonthMore.extraWidth=30;
CalendarMonthMore.offset=6;
CalendarMonthMore.prototype.parent=function(p) {
if (p!=undefined) {
this.i_parent=p;
}
return this.i_parent;
}
CalendarMonthMore.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_link!=undefined) {
this.i_link.style.display=(state==true ? "" : "none");
}
}
return this.i_visible;
}
CalendarMonthMore.prototype.hide=function() {
if (this.i_expanded!=undefined) {
this.getExpanded().style.display="none";
}
if (this.i_expanded_l!=undefined) {
this.i_expanded_l.unregister();
this.i_expanded_l=null;
}
}
CalendarMonthMore.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_link!=undefined) {
this.i_link.style.width=this.width()+"px";	
}	
}
return this.i_width;
}
CalendarMonthMore.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_link!=undefined) {
this.i_link.style.height=this.height()+"px";	
}	
}
return this.i_height;
}
CalendarMonthMore.prototype.left=function(left) {
if (left!=undefined) {
this.i_left=left;
if (this.i_link!=undefined) {
this.i_link.style.left=this.left()+"px";	
}	
}
return this.i_left;
}
CalendarMonthMore.prototype.top=function(top) {
if (top!=undefined) {
this.i_top=top;
if (this.i_link!=undefined) {
this.i_link.style.top=this.top()+"px";	
}	
}
return this.i_top;
}
CalendarMonthMore.prototype.events=function(index) {
if (index!=undefined) {
return this.i_events[index];
}
return this.i_events;
}
CalendarMonthMore.prototype.addEvent=function(ev) {
this.i_events[this.i_events.length]=ev;
return ev;
}
CalendarMonthMore.prototype.removeEvent=function(ev) {
for (var x=0; x < this.i_events.length; x++){ 
if (this.i_events[x]==ev) {
this.i_events.splice(x, 1);
return true;
}
}
return false;
}
CalendarMonthMore.prototype.overflowEvents=function(index) {
if (index!=undefined) {
return this.i_ov_events[index];
}
return this.i_ov_events;
}
CalendarMonthMore.prototype.addOverflowEvent=function(ev) {
this.i_ov_events[this.i_ov_events.length]=ev;
if (this.i_link!=undefined) {
this.i_link.innerHTML="+ "+this.i_ov_events.length+" More";
}
return ev;
}
CalendarMonthMore.prototype.removeOverflowEvent=function(ev) {
for (var x=0; x < this.i_ov_events.length; x++){ 
if (this.i_ov_events[x]==ev) {
this.i_ov_events.splice(x, 1);
if (this.i_link!=undefined) {
this.i_link.innerHTML="+ "+this.i_ov_events.length+" More";
}
return true;
}
}
return false;
}
CalendarMonthMore.prototype.clearEvents=function() {
this.i_ov_events=Array();
this.i_events=Array();
}
CalendarMonthMore.prototype.count=function() {
return this.i_ov_events.length;
}
CalendarMonthMore.prototype.handleExpandedClick=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var ds=this.parent().i_display_grid;
var lf=0;
var tp=0;
while (ds!=null) {
lf+=parseInt(ds.offsetLeft);
tp+=parseInt(ds.offsetTop);
ds=ds.offsetParent;
}
x-=lf;
y-=tp;
if (x < this.i_cache_pos.left || x > this.i_cache_pos.left+this.i_cache_pos.width ||
y < this.i_cache_pos.top || y > this.i_cache_pos.top+this.i_cache_pos.height) {
this.hide();
}
}
CalendarMonthMore.prototype.handleCellClick=function(e) {
e.cancelBubble=true;
e.returnValue=false;
}
CalendarMonthMore.prototype.handleClick=function(e) {
var ev=this.i_ov_events[0];
if (ev!=undefined) {
var start=ev.eventObject().param("start");
var pos=this.parent().datePosition(start);
if (pos!=undefined) {
var ex=this.getExpanded();
ex.style.display="";
var stp=(pos.top - CalendarMonthMore.offset);
var slf=(pos.left - CalendarMonthMore.offset);
var h=((this.i_events.length+this.i_ov_events.length) * (CalendarMonthView.eventHeight+2))+38;
var w=pos.width+CalendarMonthMore.extraWidth;
if (w < CalendarMonthMore.minimumWidth) {
w=CalendarMonthMore.minimumWidth;
}
var pHeight=this.parent().height() - this.parent().headers(0).height();
var pWidth=this.parent().width() - this.parent().leftHeaders(0).width();
if (stp < 0) {
stp=0;
}
if (slf < 0) {
slf=0;
}
if (stp+h > pHeight) {
stp=pHeight - h;
}
if (slf+w > pWidth) {
slf=pWidth - w;
}
this.i_expanded_shadow.style.left=(slf+CalendarMonthMore.shadowDepth)+"px";
this.i_expanded_shadow.style.top=(stp+CalendarMonthMore.shadowDepth)+"px";
this.i_expanded_shadow.style.width=(w+CalendarMonthMore.offset)+"px";
this.i_expanded_shadow.style.height=(h+CalendarMonthMore.offset)+"px";
this.i_expanded_cell.style.left=slf+"px";
this.i_expanded_cell.style.top=stp+"px";
this.i_expanded_cell.style.width=(w+(document.all ? 4 : 0))+"px";
this.i_expanded_cell.style.height=h+"px";
this.i_expanded_date.innerHTML=start.getDate();
EventHandler.register(this.i_expanded_cell, "onclick", this.handleCellClick, this);
this.i_cache_pos={'top':stp,'left':slf,'width':(w+(document.all ? 4 : 0)),'height':h};
this.i_expanded_l=EventHandler.register(document.body, "onmousedown", this.handleExpandedClick, this);
var total_events=Array();
for (var x=0; x < this.i_events.length; x++) {
total_events[x]=this.i_events[x].eventObject();
}
for (var x=0; x < this.i_ov_events.length; x++){ 
total_events[total_events.length]=this.i_ov_events[x].eventObject();
}
var x=0;
for (x; x < total_events.length; x++) {
var ev_left=2;
var ev_top=(x * (CalendarMonthView.eventHeight+2));
if (this.i_event_cache[x]==undefined) {
this.i_event_cache[x]=new MonthViewEvent(w - 4,CalendarMonthView.eventHeight,ev_left,ev_top,total_events[x]);
this.i_event_cache[x].i_parent=this;
this.i_expanded_cell.appendChild(this.i_event_cache[x].getEvent());
}
else {
this.i_event_cache[x].eventObject(total_events[x]);
this.i_event_cache[x].left(ev_left);
this.i_event_cache[x].top(ev_top);
this.i_event_cache[x].width(w - 4);
}
this.i_event_cache[x].visible(true);
this.i_expanded_close.style.top=(total_events.length+1) * (CalendarMonthView.eventHeight+2) - 2;
this.i_expanded_close.style.width=w - 4;
}
for (x; x < this.i_event_cache.length;x++) {
this.i_event_cache[x].visible(false);
}
}
}
}
CalendarMonthMore.prototype.getExpanded=function() {
if (this.i_expanded==undefined) {
this.i_expanded=document.createElement('DIV');
this.parent().i_display_grid.appendChild(this.i_expanded);
this.i_shadow_holder=document.createElement('DIV');
this.i_shadow_holder.className="CalendarMonthMore_shadow_holder";
this.i_expanded.appendChild(this.i_shadow_holder);
this.i_expanded_shadow=document.createElement('DIV');
this.i_expanded_shadow.className="CalendarMonthMore_shadow";
this.i_shadow_holder.appendChild(this.i_expanded_shadow);
this.i_cell_holder=document.createElement('DIV');
this.i_cell_holder.className="CalendarMonthMore_cell_holder";
this.i_expanded.appendChild(this.i_cell_holder);
this.i_expanded_cell=document.createElement('DIV');
this.i_expanded_cell.className="CalendarMonthMore_cell";
this.i_cell_holder.appendChild(this.i_expanded_cell);
this.i_expanded_date=document.createElement('DIV');
this.i_expanded_date.className="CalendarMonthMore_date";
this.i_expanded_date.style.height="16px";
this.i_expanded_cell.appendChild(this.i_expanded_date);
this.i_expanded_close=document.createElement('DIV');
this.i_expanded_close.className="CalendarMonthMore CalendarMonthMore_close";
this.i_expanded_close.innerHTML="Close";
EventHandler.register(this.i_expanded_close, "onclick", this.hide, this);
this.i_expanded_cell.appendChild(this.i_expanded_close);
}
return this.i_expanded;
}
CalendarMonthMore.prototype.getLink=function() {
if (this.i_link==undefined) {
this.i_link_holder=document.createElement('DIV');
this.i_link_holder.className="CalendarMonthMore_holder";
this.i_link=document.createElement('DIV');
this.i_link.className="CalendarMonthMore";
this.i_link.style.width=this.width()+"px";
this.i_link.style.height=this.height()+"px";
this.i_link.style.display=(this.visible() ? "" : "none");
this.i_link.style.top=this.top()+"px";
this.i_link.style.left=this.left()+"px";
this.i_link.style.lineHeight=CalendarMonthView.moreHeight+"px";
this.i_link.innerHTML="+ "+this.i_ov_events.length+" More";
this.i_link_holder.appendChild(this.i_link);
EventHandler.register(this.i_link, "onclick", this.handleClick, this);
}
return this.i_link_holder;
}
function CalendarViewHourHeader(increment, hour, rowHeight, military, index) {
this.i_hour=(hour!=undefined ? hour : 0);
this.i_row_height=(rowHeight!=undefined ? rowHeight : 20);
this.i_military=(military!=undefined ? military : false);
this.i_index=index;
this.increment(increment ? increment : 30);
this.i_hover_state=Array();
}
CalendarViewHourHeader.hourWidth=25;
CalendarViewHourHeader.increments=Array(5, 10, 15, 20, 30, 60);
CalendarViewHourHeader.prototype.onchangeheight=null;
CalendarViewHourHeader.prototype.onchangerows;
CalendarViewHourHeader.prototype.parent=function() {
return this.i_parent;
}
CalendarViewHourHeader.prototype.increment=function(increment) {
if (increment && this.i_increment!=increment) {
this.i_increment=increment;
this.height((60 / this.i_increment) * this.rowHeight());
if (this.i_inc_blocks!=undefined) {
var rs=(60 / this.i_increment);
while (this.i_inc_blocks.length < rs) {
var x=this.i_inc_blocks.length;
this.i_inc_blocks[x]=document.createElement('DIV');
this.i_inc_blocks[x].className="CalendarViewHourHeader_increment_block";
this.i_inc_blocks[x].style.width=(this.width() - CalendarViewHourHeader.hourWidth)+"px";
this.i_inc_blocks[x].style.height=this.rowHeight()+"px";
this.i_inc_blocks[x].innerHTML="&nbsp;";
this.i_increment_sets.appendChild(this.i_inc_blocks[x]);
}
for (var x=0; x < this.i_inc_blocks.length; x++) {
this.i_inc_blocks[x].style.display=(x < rs ? "" : "none");
}
}
if (this.onchangerows!=undefined) {
var o=new Object();
o.type="changerows";
o.header=this;
this.onchangerows(o);
}
}
return this.i_increment;
}
CalendarViewHourHeader.prototype.rangeOverflow=function(state) {
if (state!=undefined) {
this.i_range_overflow=state;
}
return this.i_range_overflow;
}
CalendarViewHourHeader.prototype.index=function(index) {
if (index!=undefined && this.i_index!=index) {
this.i_index=index;
if (this.i_row!=undefined) {
for (var x=0; x < this.i_row.length; x++) {
this.i_row[x].className="CalendarViewHourHeader_row"+(this.index() % 2==1 ? "_shade" : "")+(this.rangeOverflow()==true ? "_overflow" : "");
}
}
}
return this.i_index;
}
CalendarViewHourHeader.prototype.military=function(state) {
if (state!=undefined && this.i_military!=state) {
this.i_military=state;
this.updateTime();
}
return this.i_military;
}
CalendarViewHourHeader.prototype.hour=function(hour) {
if (hour!=undefined && this.i_hour!=hour) {
this.i_hour=hour;
this.updateTime();
}
return this.i_hour;
}
CalendarViewHourHeader.prototype.rowHeight=function(height) {
if (height!=undefined && this.i_row_height!=height) {
this.i_row_height=height;
this.height((60 / this.i_increment) * this.rowHeight());
if (this.i_row!=undefined) {
for (var x=0; x < this.i_row.length; x++) {
this.i_row[x].style.height=this.rowHeight()+"px";
}
if (this.i_inc_block!=undefined) {
for (var x=0; x < this.i_inc_block.length; x++) {
this.i_inc_block[x].style.height=this.rowHeight()+"px";
}
}
}
}
return this.i_row_height;
}
CalendarViewHourHeader.prototype.width=function(width) {
if (width!=undefined && this.i_width!=width) {
this.i_width=width;
if (this.i_header!=undefined) {
this.i_header.style.width=this.width()+"px";
this.i_increment_sets.style.width=(this.width() - CalendarViewHourHeader.hourWidth)+"px";
for (var x=0; x < this.i_inc_blocks.length; x++) {
this.i_inc_blocks[x].style.width=(this.width() - CalendarViewHourHeader.hourWidth)+"px";
}
}
}
return this.i_width;
}
CalendarViewHourHeader.prototype.height=function(height) {
if (height!=undefined && this.i_height!=height) {
this.i_height=height;
if (this.i_header!=undefined) {
this.i_header.style.height=this.height()+"px";
this.i_hour_text.style.height=this.height()+"px";
this.i_increment_sets.style.height=this.height()+"px";
}
if (this.onchangeheight!=undefined) {
var o=new Object();
o.type="changeheight";
o.header=this;
this.onchangeheight(o);
}
}
return this.i_height;
}
CalendarViewHourHeader.prototype.getHourText=function() {
if (this.i_hour_text!=undefined) {
var h=this.hour();
if (this.military()==true) {
return {'hours':h, 'extra':"00"};
}
else {
var ampm="am";
if (h==0) {
h=12;
}
else if (h==12) {
ampm="pm";
}
else if (h > 12) {
h-=12;
ampm="pm";
}
return {'hours':h, 'extra':ampm};
}
}
}
CalendarViewHourHeader.prototype.updateTime=function() {
if (this.i_hour_text!=undefined) {
var t=this.getHourText();
this.i_hour_text.innerHTML=t.hours;
this.i_inc_blocks[0].innerHTML=t.extra;
}
}
CalendarViewHourHeader.prototype.getRow=function() {
if (this.i_row==undefined) {
this.i_row=Array();
}
var r=Array();
var rowCount=(60 / this.increment());
for (var x=0; x < rowCount; x++) {
if (this.i_row[x]==undefined) {
this.i_row[x]=document.createElement('DIV');
this.i_row[x].className="CalendarViewHourHeader_row"+(this.index() % 2==1 ? "_shade" : "")+(this.rowHoverState(x) ? "_hover" : "")+(this.rangeOverflow()==true ? "_overflow" : "");
this.i_row[x].style.height=this.rowHeight()+"px";
this.i_row[x].innerHTML="&nbsp;";
}
r[x]=this.i_row[x];
}
return r;
}
CalendarViewHourHeader.prototype.resetHover=function() {
for (var x=0; x < this.i_hover_state.length; x++) {
if (this.i_hover_state[x]==true) {
this.i_hover_state[x]=false;
if (this.i_row!=undefined && this.i_row[x]!=undefined) {
this.i_row[x].className="CalendarViewHourHeader_row"+(this.index() % 2==1 ? "_shade" : "")+(this.rangeOverflow()==true ? "_overflow" : "");
}
}
}
}
CalendarViewHourHeader.prototype.rowHoverState=function(row, state) {
if (state!=undefined) {
this.i_hover_state[row]=state;
if (this.i_row!=undefined && this.i_row[row]!=undefined){
this.i_row[row].className="CalendarViewHourHeader_row"+(this.index() % 2==1 ? "_shade" : "")+(this.i_hover_state[row]==true ? "_hover" : "")+(this.rangeOverflow()==true ? "_overflow" : "");
}
}
return (this.i_hover_state[row]==undefined ? false : this.i_hover_state[row]);
}
CalendarViewHourHeader.prototype.handleHourContext=function(e) {
var c=this.hourContext();
for (var x=0; x < this.i_increment_items.length; x++){ 
if (this.increment()==CalendarViewHourHeader.increments[x]) {
this.i_increment_items[x].state(true);
}
else {
this.i_increment_items[x].state(false);
}
}
this.i_12hour.state(!this.military());
this.i_24hour.state(this.military());
this.i_set_start.enabled(true);
this.i_set_end.enabled(true);		
if (this.hour() <=this.parent().startDate().getHours()) {
this.i_set_end.enabled(false);
}
if (this.hour() >=this.parent().endDate().getHours()) {
this.i_set_start.enabled(false);
}
var h=this.hour();
if (!this.military()) {
if (h > 12) {
h=h - 12;
h+="pm";
}
else if (h==12) {
h+="pm";
}
else {
if ((h==undefined) || (h==null) || (h==0)) {
h=12;
}
h+="am";
}
}
this.i_set_start.name("Set "+h+" as start hour");
this.i_set_end.name("Set "+h+" as end hour");
c.show();
e.cancelBubble=true;
e.returnValue=false;
}
CalendarViewHourHeader.prototype.handleIncrementChange=function(e) {
for (var x=0; x < this.i_increment_items.length; x++){ 
if (this.i_increment_items[x]==e.item) {
if (CalendarDataModel.getDefaultCalendar()!=undefined) {
CalendarDataModel.getDefaultCalendar().timeInterval(parseInt(60 / CalendarViewHourHeader.increments[x]));
CalendarDataModel.getDefaultCalendar().save();
}
break;
}
}
var calview_base=this.parent().parent();
if (calview_base.onincrementchange!=undefined) {
var o=new Object();
o.type="incrementchange";
calview_base.onincrementchange(o);
}
}
CalendarViewHourHeader.prototype.handleFormatChange=function(e) {
this.i_12hour.state(e.item==this.i_12hour);
this.i_24hour.state(e.item!=this.i_12hour);
user_prefs['time_prefs']=(e.item==this.i_12hour ? "%I:%M %p" : "%H:%M");
ResourceManager.request("/Ioffice/Common/wizard.asp?xml="+escape("<xml><code>tchange</code><userid>"+user_prefs['user_id']+"</userid><username>"+user_prefs['user_name']+"</username><timeZoneID>"+user_prefs['time_zone']+"</timeZoneID><timeFormat>"+user_prefs['time_prefs']+"</timeFormat><dateFormat>"+user_prefs['date_prefs']+"</dateFormat></xml>"), 1);
var calview_base=this.parent().parent();
calview_base.military(e.item==this.i_24hour ? true : false);
if (calview_base.onchange!=undefined) {
calview_base.onchange({type:"change",value:(e.item==this.i_12hour)});
}
calview_base.activeDataModel().forceRefresh();
}
CalendarViewHourHeader.prototype.handleWorkdaySet=function(e) {
if (e.item==this.i_set_start) {
var start=this.parent().startDate().copy();
start.setHours(this.hour());
if (CalendarDataModel.getDefaultCalendar()!=undefined) {
CalendarDataModel.getDefaultCalendar().startTime(start);
CalendarDataModel.getDefaultCalendar().save();
}
}
else {
var end=this.parent().endDate().copy();
end.setHours(this.hour());
if (CalendarDataModel.getDefaultCalendar()!=undefined) {
CalendarDataModel.getDefaultCalendar().endTime(end);
CalendarDataModel.getDefaultCalendar().save();
}
}
}
CalendarViewHourHeader.prototype.hourContext=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu(160, "Display Options");
this.i_increment_items=Array();
for (var x=0; x < CalendarViewHourHeader.increments.length; x++) {
this.i_increment_items[x]=this.i_context.addItem(new ContextMenuBoolean(CalendarViewHourHeader.increments[x]+" Minutes", (this.increment()==CalendarViewHourHeader.increments[x] ? true : false), true));
EventHandler.register(this.i_increment_items[x], "onclick", this.handleIncrementChange, this);
}
this.i_context.addItem(new ContextMenuDivider());
this.i_12hour=this.i_context.addItem(new ContextMenuBoolean("12 Hour Format", !this.military(), true));
this.i_24hour=this.i_context.addItem(new ContextMenuBoolean("24 Hour Format", this.military(), true));
EventHandler.register(this.i_12hour, "onclick", this.handleFormatChange, this);
EventHandler.register(this.i_24hour, "onclick", this.handleFormatChange, this);
this.i_context.addItem(new ContextMenuDivider());
this.i_set_start=this.i_context.addItem(new ContextMenuIconItem("Set start hour"));
this.i_set_end=this.i_context.addItem(new ContextMenuIconItem("Set end hour"));
EventHandler.register(this.i_set_start, "onclick", this.handleWorkdaySet, this);
EventHandler.register(this.i_set_end, "onclick", this.handleWorkdaySet, this);
}
return this.i_context;
}
CalendarViewHourHeader.prototype.getHeader=function() {
if (this.i_header==undefined) {
this.i_header=document.createElement('DIV');
this.i_header.className="CalendarViewHourHeader";
this.i_header.style.width=this.width()+"px";
this.i_header.style.height=this.height()+"px";
EventHandler.register(this.i_header, "oncontextmenu", this.handleHourContext, this);
this.i_hour_text=document.createElement('DIV');
this.i_hour_text.className="CalendarViewHourHeader_hour";
this.i_hour_text.style.width=CalendarViewHourHeader.hourWidth+"px";
this.i_hour_text.style.height=this.height()+"px";
this.i_hour_text.innerHTML="&nbsp;";
this.i_header.appendChild(this.i_hour_text);
this.i_increment_sets=document.createElement('DIV');
this.i_increment_sets.className="CalendarViewHourHeader_increment_set";
this.i_increment_sets.style.width=(this.width() - CalendarViewHourHeader.hourWidth)+"px";
this.i_increment_sets.style.height=this.height()+"px";
this.i_header.appendChild(this.i_increment_sets);
this.i_inc_blocks=Array();
var incCount=(60 / this.i_increment);
for (var x=0; x < incCount; x++) {
this.i_inc_blocks[x]=document.createElement('DIV');
this.i_inc_blocks[x].className="CalendarViewHourHeader_increment_block";
this.i_inc_blocks[x].style.width=(this.width() - CalendarViewHourHeader.hourWidth)+"px";
this.i_inc_blocks[x].style.height=this.rowHeight()+"px";
this.i_inc_blocks[x].innerHTML="&nbsp;";
this.i_increment_sets.appendChild(this.i_inc_blocks[x]);
}
this.updateTime();
}
return this.i_header;
}
function CalendarBlockView(startTime, endTime, minute_increment, military, days) {
this.i_is_month_view=false;
this.i_ds=true;
this.i_extra_cache=Array();
this.i_today=new Date();
this.i_start=startTime;
if (this.i_start==undefined) {
var s=new Date();
s.setHours(0);
s.setMinutes(0);
this.i_start=s;
}
this.i_end=endTime;
if (this.i_end==undefined) {
var e=floorDay(addDay(new Date()));
this.i_end=e;
}
this.i_increment=(minute_increment ? minute_increment : 30);
this.i_days=(days!=undefined ? days : 1);
this.i_row_height=20;
this.i_military=(military!=undefined ? military : false);
this.i_event_cache=Array();
if (60 % this.i_increment!=0) {
var newInc=(60 / Math.ceil(60 / this.i_increment));
this.i_increment=newInc;
}
this.superCalendarViewHeaderType();
EventHandler.register(this, "onchangestart", this.handleStartChange, this);
EventHandler.register(this, "onload", this.handleViewLoad, this);
EventHandler.register(this, "onunload", this.handleViewUnload, this);
EventHandler.register(this, "onbuild", this.handleBuild, this);
EventHandler.register(this, "onresize", this.handleResize, this);
EventHandler.register(this, "ondatachange", this.handleDataChange, this);
EventHandler.register(this, "onappload", this.handleAppLoad, this);
EventHandler.register(SystemCore.layoutManager(), "onconfigurationchange", this.handleLayoutChange, this);
this.headerHeight(20);
this.leftHeaderWidth(50);
this.noScroll(false);
this.i_day_headers=Array();
for (var x=0; x < this.i_days; x++) {
this.i_day_headers[x]=this.addHeader(new CalendarViewHeader("Day "+x));
EventHandler.register(this.i_day_headers[x].getHeader(), "oncontextmenu", this.handleHeaderContext, this);
EventHandler.register(this.i_day_headers[x], "onclick", this.handleHeaderClick, this);
}
this.i_hours=Array();
var r_startHour=this.i_start.getHours();
var r_endHour=this.i_end.getHours();
var startHour=0;
var endHour=23;
for (var x=startHour; x <=endHour; x++) {
this.i_hours[x]=new CalendarViewHourHeader(this.i_increment, x, this.rowHeight(), this.military(), x);
this.i_hours[x].rangeOverflow((x < r_startHour || x+1 > r_endHour));
}
this.addLeftHeaders(this.i_hours);
this.i_event_being_dragged=undefined;   
}
CalendarBlockView.dragCreateThreshold=8;
CalendarBlockView.autoScrollAmount=10;
CalendarBlockView.prototype.addTemporaryEvent=function(ev) {
this.i_extra_cache[this.i_extra_cache.length]=ev;
this.refreshData(true);
return ev;
}
CalendarBlockView.prototype.removeTemporaryEvent=function(ev) {
for (var x=0; x < this.i_extra_cache.length; x++) {
if (this.i_extra_cache[x]==ev) {
this.i_extra_cache.splice(x, 1);
this.refreshData(true);
return true;
}
}
return false;
}
CalendarBlockView.prototype.clearTemporaryEvents=function() {
this.i_extra_cache=Array();
this.refreshData(true);
return true;
}
CalendarBlockView.prototype.handleStartChange=function(e) {
this.updateFocus();
this.refreshData(true);
}
CalendarBlockView.prototype.handleViewLoad=function(e) {
this.i_ld_n=EventHandler.register(this.i_parent, "onnext", this.handleNext, this);
this.i_ld_p=EventHandler.register(this.i_parent, "onprevious", this.handlePrevious, this);
this.i_ld_fc=EventHandler.register(this, "onchangefocus", this.handleFocusChange, this);
this.i_ld_sc=EventHandler.register(this, "onchangeselected", this.handleSelectedChange, this);
this.updateFocus();
this.refreshData(true);
this.throwDisplayViewEvent(); 
this.updateAllDayDropTarget();
var startHour=this.startDate().getHours();
var me=this;
setTimeout(function() {
me.scrollHour(startHour);
me=null; 
startHour=null;	
}, 10);
}
CalendarBlockView.prototype.scrollHour=function(hour) {
if(this.i_display_content!=undefined) {
this.i_display_content.scrollTop=""+(hour * this.leftHeaders(0).height());
}
}
CalendarBlockView.prototype.handleViewUnload=function(e) {
if (this.i_ld_n!=undefined) {
this.i_ld_n.unregister();
this.i_ld_p.unregister();
this.i_ld_fc.unregister();
this.i_ld_sc.unregister();
this.i_ld_n=null;
this.i_ld_p=null;
this.i_ld_fc=null;
this.i_ld_sc=null;
}
}
CalendarBlockView.prototype.handleHeaderClick=function(e) {
if (e.header.i_display_date!=undefined) {
var tm=new Date();
tm.setFullYear(e.header.i_display_date.y);
tm.setMonth(e.header.i_display_date.m, e.header.i_display_date.d);
tm.setHours(0);
tm.setMinutes(0);
tm.setSeconds(0);
this.parent().focusDate(tm);
this.parent().selectedDate(tm);
this.parent().viewTypes(2).active(true);
}
}
CalendarBlockView.prototype.handleNext=function(e) {
var f=this.focusDate().copy(true);
var month=f.getMonth();
var year=f.getFullYear();
var day=f.getDate();
var start_day=day+this.i_headers.length;
var month_length=CalendarMonthView.monthLength[month];
if (month==1) {
month_length+=CalendarMonthView.isLeap(year);
}
if (start_day > month_length) {
month++;
if (month > 11) {
month=0;
year++;
}
start_day-=month_length;
}
f.setFullYear(year);
f.setMonth(month, start_day);
this.parent().focusDate(f);
this.refreshData();
this.throwDisplayViewEvent(); 
}
CalendarBlockView.prototype.handlePrevious=function(e) {
var f=this.focusDate().copy(true);
var month=f.getMonth();
var year=f.getFullYear();
var day=f.getDate();
var start_day=day - this.i_headers.length;
var prev_month_length=CalendarMonthView.monthLength[(month==0 ? 11 : month - 1)];
if ((month-1)==1) {
prev_month_length+=CalendarMonthView.isLeap(year);
}
if (start_day < 0) {
month--;
if (month < 0) {
month=11;
year--;
}
start_day=(prev_month_length+start_day);
}
f.setFullYear(year);
f.setMonth(month, start_day);
this.parent().focusDate(f);
this.refreshData();
this.throwDisplayViewEvent(); 
}
CalendarBlockView.prototype.updateFocus=function() {
if (this.parent().activeView()!=this) {
return true;
}
if (this.focusDate()==undefined) {
this.focusDate(new Date(), true);
}
var month=this.focusDate().getMonth();
var year=this.focusDate().getFullYear();
var date=this.focusDate().getDate();
var weekday=this.focusDate().getDay();
var today_col=-1;
var postRefresh=false;
if (this.i_day_cache==undefined) {
postRefresh=true;
}
if (this.i_headers.length==7) {
var start_month=month;
var start_date=date;
var start_year=year;
var pre_days=weekday - this.startingDay();
if (pre_days < 0) {
pre_days=pre_days+7;
}
var start_length=pre_days;
if (date - pre_days <=0) {
if (start_month==0) {
start_month=11;
start_year--;
}
else {
start_month--;
}
start_date=CalendarMonthView.monthLength[start_month] - (pre_days - date);
if (start_month==1) {
start_date+=CalendarMonthView.isLeap(start_year);
}
}
else {
start_date-=pre_days;
}
var init_month=start_month;
var init_date=start_date;
var init_year=start_year;
var last_date;
this.i_day_cache=Array();
var monLen=CalendarMonthView.monthLength[start_month];
if (start_month==1) {
monLen+=CalendarMonthView.isLeap(year);
}
for (var x=0; x < 7; x++) { 
var d=start_date+x;
if (d > monLen) {
start_month++;
if (start_month==12) {
start_month=0;
start_year++;
}
start_date=(-1 * (x - 1));
d=1;
}
last_date=d;
var date_text=(user_prefs['date_prefs']=="%d/%m/%Y" ? d+"/"+(start_month+1) : (start_month+1)+"/"+d);
var header_width=this.i_headers[x].width();
if (header_width >=55 && header_width < 90) {
this.i_headers[x].text(CalendarMonthView.weekDaysAbbr[(this.startingDay()+x) % 7]+" "+date_text);
}
else if (header_width < 55) {
this.i_headers[x].text(CalendarMonthView.weekDaysAbbr[(this.startingDay()+x) % 7]);
}
else {
this.i_headers[x].text(CalendarMonthView.weekDays[(this.startingDay()+x) % 7]+" "+date_text);
}					
this.i_headers[x].i_display_date={'m':start_month,'d':d,'y':start_year,'wd':(this.startingDay()+x) % 7};
this.i_day_cache[x]={'m':start_month,'d':d,'y':start_year};
if (this.i_today.getMonth()==start_month && this.i_today.getDate()==d && this.i_today.getFullYear()==start_year) {
today_col=x;
}
var sel=this.selectedDate();
if (sel.getMonth()==start_month && sel.getDate()==d && sel.getFullYear()==start_year) {
this.i_headers[x].selected(true);
}
else {
this.i_headers[x].selected(false);
}
}
this.i_start_view=new Date();
this.i_start_view.setFullYear(init_year);
this.i_start_view.setMonth(init_month, init_date);
this.i_start_view.setMinutes(0);
this.i_start_view.setHours(0);
this.i_start_view.setSeconds(0);
this.i_start_view.setMilliseconds(0);
this.i_end_view=new Date();
this.i_end_view.setFullYear(start_year);
this.i_end_view.setMonth(start_month, last_date+1);
this.i_end_view.setMinutes(0);
this.i_end_view.setSeconds(0);
this.i_end_view.setMilliseconds(0);
this.i_end_view.setHours(0);
if (this.parent().width() >=310 && this.parent().width() < 365) {
this.parent().headerText(CalendarMonthView.weekDaysAbbr[this.startingDay()]+", "+CalendarMonthView.monthNames[init_month]+" "+init_date+", "+init_year+" - "+CalendarMonthView.weekDaysAbbr[(this.startingDay()+6) % 7]+", "+CalendarMonthView.monthNames[start_month]+" "+last_date+", "+start_year);
}
else if (this.parent().width() < 310) {
this.parent().headerText(CalendarMonthView.weekDaysAbbr[this.startingDay()]+", "+CalendarMonthView.monthNamesAbbr[init_month]+" "+init_date+", "+init_year+" - "+CalendarMonthView.weekDaysAbbr[(this.startingDay()+6) % 7]+", "+CalendarMonthView.monthNamesAbbr[start_month]+" "+last_date+", "+start_year);
}
else {
this.parent().headerText(CalendarMonthView.weekDays[this.startingDay()]+", "+CalendarMonthView.monthNames[init_month]+" "+init_date+", "+init_year+" - "+CalendarMonthView.weekDays[(this.startingDay()+6) % 7]+", "+CalendarMonthView.monthNames[start_month]+" "+last_date+", "+start_year);
}
}
else if (this.i_headers.length==1) {
this.i_day_cache=Array();
this.i_start_view=this.i_end_view=this.focusDate().copy(true);
this.i_day_cache[0]={'m':month,'d':date,'y':year};
this.i_headers[0].i_display_date={'m':month,'d':date,'y':year,'wd':this.startingDay()};
if (this.i_today_box!=undefined) {
if (this.i_today.getMonth()==month && this.i_today.getDate()==date && this.i_today.getFullYear()==year) {
today_col=0;
}
}
this.parent().headerText(CalendarMonthView.weekDays[weekday]+", "+CalendarMonthView.monthNames[month]+" "+date+", "+year);
}
if(this.i_header_bar!=undefined) {
this.i_header_bar.style.display=(this.i_headers.length==1 ? "none" : "");
}
if (this.i_today_box!=undefined) {
if (today_col >=0) {
this.i_today_box.style.display="";
this.i_today_box.style.left=(this.headerWidth() * today_col)+"px";
this.i_today_box.style.top="0px";
this.i_today_box.style.width=(this.headerWidth() - 1)+"px";
this.i_today_box.style.height=this.contentHeight()+"px";
}
else {
this.i_today_box.style.display="none";
}
this.i_today_col=today_col;
}
}
CalendarBlockView.prototype.refreshData=function(force) {
if (this.parent().activeView()!=this) return;
if (this.i_display_grid!=undefined && this.i_day_cache!=undefined && this.parent().activeView()==this) {
if (force) {
var me=this;
if (this.i_forcedRefresh) {
clearTimeout(this.i_forcedRefresh);
}
this.i_forcedRefresh=setTimeout(function() {
this.i_forcedRefresh=true;
me.refreshData();
me=null;
}, 5);
return;
}
var sDate=new Date();
sDate.setFullYear(this.i_day_cache[0].y);
sDate.setMonth(this.i_day_cache[0].m, this.i_day_cache[0].d);
sDate.setHours(0);
sDate.setMinutes(0);
sDate.setSeconds(0);
sDate.setMilliseconds(0);
var eDate=new Date();
eDate.setFullYear(this.i_day_cache[this.i_headers.length - 1].y);
eDate.setMonth(this.i_day_cache[this.i_headers.length - 1].m, this.i_day_cache[this.i_headers.length - 1].d+1);
eDate.setHours(0);
eDate.setMinutes(0);
eDate.setSeconds(0);
eDate.setMilliseconds(0);
var cache_start=Math.floor(sDate.getTime() / 1000);
var cache_end=Math.floor(eDate.getTime() / 1000);
if (this.i_forcedRefresh || (this.i_cache_start!=cache_start && this.i_cache_end!=cache_end)) {
this.i_cache_end=cache_end;
this.i_cache_start=cache_start;
this.i_forcedRefresh=undefined;
for (var x=0; x < this.i_headers.length; x++){
this.i_headers[x].parent().ignoreUpdate(true);
this.i_headers[x].clearEvents(true);
}
var hit=new Object();
var evs;
var dms=this.parent().dataModels();
var dmId='';
var eventTypes=CalendarEvent.Subtype;
for (var dm=0; dm <=dms.length;++dm) {
if (dm==dms.length) {
var useArray=[];
for (var z=0; z < this.i_extra_cache.length; z++) {
if (this.i_extra_cache[z].startTime().getTime() >=sDate.getTime() && this.i_extra_cache[z].endTime().getTime() <=eDate.getTime()) {
useArray[useArray.length]=this.i_extra_cache[z];
}
}
evs=new EntrySet(useArray, undefined, 0, useArray.length);
dmId='';
}
else if (dms[dm]==undefined) continue;
else {
evs=dms[dm].dateRange(sDate, eDate);
dmId=dms[dm].id();
}
for (var i=0; i < evs.length();++i) {
var item=evs.getItem(i);
var itemId=item.i_id;
var itemStart=item.param("start");
var itemEnd=item.param("end");
var itemEType=(item.type()=="event" ? item.eventType() : null);
var myDmId="", specId="";
if(itemEType==eventTypes.holiday) {
itemId+=item.title();
}
if (itemEType==eventTypes.holiday || itemEType==eventTypes.birthday || itemEType==eventTypes.anniversary) {
specId="e"+itemStart.valueOf()+"-"+item.title();
if (!hit[specId]) hit[specId]=true;
else continue;
} else {
myDmId=dmId;
}
if (item.param("start") && !itemStart.inclusiveDays) itemStart=item.param("start", new Date(itemStart));
if (item.param("end") && !itemEnd.inclusiveDays) itemEnd=item.param("end", new Date(itemEnd));
if (item.type()=="task" || item.param("allday")==true) {
var range=itemStart.inclusiveDays(itemEnd, sDate, eDate);
for (var q=0; q < this.i_headers.length; q++) {
for (var g=0; g < range.length; g++) {
if (this.i_headers[q].i_display_date.m==range[g][0].getMonth() && this.i_headers[q].i_display_date.d==range[g][0].getDate()) {
this.i_headers[q].addEvent(item, undefined, true);
}
}
}
continue; 
} else if (itemStart==undefined || itemEnd==undefined) {
continue; 
}
var hits_days=itemStart.inclusiveDays(itemEnd, sDate, eDate);
for (var q=0; q < hits_days.length; q++) {
var key="i"+(hits_days[q][0] ? hits_days[q][0].valueOf() : "e"+hits_days[q][1].valueOf())+"-"+myDmId+itemId;
hit[key]=true;
if (this.i_event_cache[key]==undefined) {
this.i_event_cache[key]=new BlockViewEvent(this.headerWidth() - 5, 50, 10, 10, undefined);
this.i_event_cache[key].i_parent=this;
this.i_display_grid.appendChild(this.i_event_cache[key].getEvent());
}
this.i_event_cache[key].editMode(item.i_in_edit==true ? true : false);
this.i_event_cache[key].startDate(hits_days[q][0]);
this.i_event_cache[key].endDate(hits_days[q][1]);
this.i_event_cache[key].description(item.access()==CalendarEvent.Permission.freebusy ? "" : item.title());
if (item.type()=="event") {
this.i_event_cache[key].extended(hits_days[q][0].valueOf() > item.startTime().valueOf());
}
this.i_event_cache[key].allowResize(hits_days.i_possible > 1 || item.access()!=CalendarEvent.Permission.full ? false : true);
this.i_event_cache[key].visible(true);
this.i_event_cache[key].eventObject(item);
}
}
}
for (var key in this.i_event_cache) {
if (!key.match(/^i.*-/) || this.i_event_cache[key]==undefined || hit[key]) continue;
this.i_display_grid.removeChild(this.i_event_cache[key].getEvent());
this.i_event_cache[key].destroyEvents();
if (!delete this.i_event_cache[key]) this.i_event_cache[key]=undefined;
}
for (var i=0; i < this.i_headers.length;++i) {
this.i_headers[i].refreshEvents();
this.i_headers[i].parent().ignoreUpdate(false);
}
this.repositionData();
}
}
}
CalendarBlockView.prototype.handleDataChange=function(e) {
this.refreshData(true);
}
CalendarBlockView.prototype.repositionData=function() {
var wdays=Array();
var wprocessors=Array();
if (this.i_day_cache!=undefined) {
var startDate=this.startDate();
var endDate=this.endDate();
var startHour=0;
var endHour=23;
var increment=this.increment();
for (var x=0; x < this.i_day_cache.length; x++){ 
wdays[this.i_day_cache[x].m+":"+this.i_day_cache[x].d+":"+this.i_day_cache[x].y]=x;
wprocessors[x]=new BlockPositionProcessor(this.headerWidth(), this.contentHeight(), this.parent().sortingMode());
}
for (var itx in this.i_event_cache) {
var item=this.i_event_cache[itx];
if (!itx.match(/^i.*-.*$/) || item==undefined) continue;
if (item.visible()) {
var s=item.startDate();
var m=s.getMonth();
var y=s.getFullYear();
var d=s.getDate();
var key=m+":"+d+":"+y;
if (wdays[key]!=undefined) {
var tp=0;
var ev=item.eventObject();
var hourDiff=(s.getHours() - startHour);
var incDiff=Math.floor(s.getMinutes() / increment);
var minDiff=Math.floor(s.getMinutes() % increment);
tp=hourDiff * this.leftHeaders(0).height();
tp+=incDiff * this.leftHeaders(0).rowHeight();
tp+=Math.floor((this.leftHeaders(0).rowHeight() / increment) * minDiff);
var e=item.endDate();
var se_diff=Math.floor(((e.getTime() - s.getTime()) / (1000 * 60)) * (this.leftHeaders(0).rowHeight() / increment)); 
if (se_diff < this.leftHeaders(0).rowHeight()) se_diff=this.leftHeaders(0).rowHeight();
item.height(se_diff - 1);
item.top(tp);
var m=new BlockPositionBlock(tp, se_diff, ev.sortOrder());
m.i_event=item;
m.i_key=key;
wprocessors[wdays[key]].addBlock(m);
}
}
}
for (var z=0; z < this.i_day_cache.length; z++) {
wprocessors[z].calculate();
var blocks=wprocessors[z].blocks();
for (var x=0; x < blocks.length; x++) {
if (!isNaN(blocks[x].left())) {		
blocks[x].i_event.left((this.headerWidth() * wdays[blocks[x].i_key])+2+(blocks[x].left()));
blocks[x].i_event.width(blocks[x].width());
blocks[x].i_event.updateTitle();
} else {   
blocks[x].i_event.left(20000);
}
}
}
}
}
CalendarBlockView.prototype.handleDoubleClick=function(e) {
var allow=this.checkPosition(CursorMonitor.getX(), CursorMonitor.getY());
if (allow==undefined) {
var pos=this.cursorPosition(true, CursorMonitor.getX(), CursorMonitor.getY());
if ((pos.hour+pos.row) > 0) { 
var rpos=pos.date.copy(false);
Application.getApplicationById(1004).popEvent(undefined, this.parent().activeDataModel(), rpos);
}
}
}
CalendarBlockView.prototype.handleClick=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var allow=this.checkPosition(x, y);
if (allow==undefined) {
var lf=0;
var tp=0;
var me=this.i_display_grid;
while (me!=null) {
lf+=parseInt(me.offsetLeft)+parseInt(me.scrollLeft);
tp+=parseInt(me.offsetTop)+parseInt(me.scrollTop);
me=me.offsetParent;
}
var diffx=x - lf;
var diffy=y - tp;
var col=Math.floor(diffx / this.headerWidth());
var row=Math.floor(diffy / this.leftHeaders(0).height());
var d=this.i_day_cache[col];
if (d!=undefined) {
var newSel=new Date();
newSel.setFullYear(d.y);
newSel.setMonth(d.m,d.d);
newSel.setMinutes(0);
newSel.setHours(0);
newSel.setSeconds(0);
this.parent().selectedDate(newSel);
this.parent().focusDate(newSel);
}
}
return true;
}
CalendarBlockView.prototype.checkPosition=function(x, y) {
this.i_view_left=0;
this.i_view_top=0;
var i_view=this.i_display_grid;
while (i_view!=null) {
this.i_view_left+=parseInt(i_view.offsetLeft);
this.i_view_top+=parseInt(i_view.offsetTop);
i_view=i_view.offsetParent;
}
var rel_x=(x - this.i_view_left);
var rel_y=(y - this.i_view_top)+parseInt(this.i_display_content.scrollTop);
for (var itx in this.i_event_cache) {
var e=this.i_event_cache[itx];
if (!itx.match(/^i.*-.*$/) || e==undefined) continue;
if (e.visible()) {
var lf=e.left();
var tp=e.top();
var inc=true;
if (rel_x < lf || rel_x > lf+e.width() ||
rel_y < tp || rel_y > tp+e.height()) {
inc=false;
}
if (inc) {
return (e.eventObject().access()==CalendarEvent.Permission.freebusy ? undefined : e);
}
}
}
}
CalendarBlockView.prototype.handleMouseDown=function(e) {
if (this.parent().activeDataModel()==undefined) return; 
var bt=(e.button > 0 ? e.button : e.which);
if (bt!=2) {
if (this.i_drag_ml==undefined && this.i_event_being_dragged==undefined) {
var allow=this.checkPosition(CursorMonitor.getX(), CursorMonitor.getY());
this.i_last_used_y=undefined;
if (allow==undefined) {
if (this.i_drag_event!=undefined && this.i_drag_event.i_in_edit==true) {
this.i_drag_event.i_in_edit=false;
this.removeTemporaryEvent(this.i_drag_event);	
this.parent().dragCreateEvent(this.i_drag_event);
this.i_drag_event=null;
}
else {
this.i_drag_pos=this.cursorPosition(true);
if (this.i_drag_pos.date!=undefined) {
if (this.parent().activeDataModel().access()=="All") {
this.i_drag_start_x=CursorMonitor.getX();
this.i_drag_start_y=CursorMonitor.getY();
this.i_drag_start_date=this.i_drag_pos.date.copy();	
this.i_drag_row_height=this.leftHeaders(0).rowHeight();
this.i_drag_init=false;
this.i_drag_ml=EventHandler.register(document.body, "onmousemove", this.handleDragMove, this);
this.i_drag_ul=EventHandler.register(document.body, "onmouseup", this.handleDragStop, this);
}
}
}
}
}
}
}
CalendarBlockView.prototype.handleContextMenu=function(e) {
var allow=this.checkPosition(CursorMonitor.getX(), CursorMonitor.getY());
if (allow==undefined) {
var pos=this.cursorPosition(true, CursorMonitor.getX(), CursorMonitor.getY(), false);
var cx=this.parent().genericContextMenu();
cx.i_target_date=pos.date;
cx.show(true);
e.cancelBubble=true;
e.returnValue=false;
}
}
CalendarBlockView.prototype.handleDragMove=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
if (this.i_drag_init==true ||
this.i_drag_start_x+CalendarBlockView.dragCreateThreshold < x || this.i_drag_start_x - CalendarBlockView.dragCreateThreshold > x ||
this.i_drag_start_y+CalendarBlockView.dragCreateThreshold < y || this.i_drag_start_y - CalendarBlockView.dragCreateThreshold > y) {
if (this.i_drag_init!=true) {
this.i_drag_init=true;
var end_date=this.i_drag_start_date.copy();
end_date.setTime(this.i_drag_start_date.getTime()+(60000 * this.increment()));
this.i_drag_event=new CalendarEvent(0, "New Event", this.i_drag_start_date, end_date, false);
this.i_drag_event.isNew(true);
this.i_drag_event.i_parent_dm=this.parent().activeDataModel();
this.i_drag_event.i_in_edit=true;
this.addTemporaryEvent(this.i_drag_event);
this.i_drag_view=null;
this.i_drag_event.i_drag_row_height=this.leftHeaders(0).rowHeight();
}
if (this.i_drag_view==undefined) {
for (var itx in this.i_event_cache) {
if (!itx.match(/^i.*-.*$/) || this.i_event_cache[itx]==undefined) continue;
if (this.i_event_cache[itx].eventObject()==this.i_drag_event) {
this.i_drag_view=this.i_event_cache[itx];
}
}
}
var diffy=(y - this.i_drag_start_y);
var over=diffy % this.i_drag_event.i_drag_row_height;
diffy-=over;
if (over > Math.floor(this.i_drag_event.i_drag_row_height / 2)) {
diffy+=this.i_drag_event.i_drag_row_height;	
}
if (this.i_last_used_y!=diffy) {
this.i_last_used_y=diffy;
var duration=((diffy / this.i_drag_row_height) * this.increment());
if (duration < 1) {
duration=1;
}
var endDate=this.i_drag_start_date.copy();
endDate.setTime(this.i_drag_start_date.getTime()+Math.floor(60000 * duration));
this.i_drag_event.endTime(endDate);
if (this.i_drag_view!=undefined) {
this.i_drag_view.endDate(endDate);
}
this.repositionData();
}
}
}
CalendarBlockView.prototype.handleDragStop=function(e) {
if (this.i_drag_ml!=undefined) {
this.i_drag_ml.unregister();
this.i_drag_ul.unregister();
this.i_drag_ml=null;
this.i_drag_ul=null;
if (this.i_drag_init==true && this.i_drag_event!=undefined) {
var ev;
for (var itx in this.i_event_cache) {
if (!itx.match(/^i.*-.*$/) || this.i_event_cache[itx]==undefined) continue;
if (this.i_event_cache[itx].eventObject()==this.i_drag_event) {
ev=this.i_event_cache[itx];
break;
}					
}
setTimeout(function() {
ev.selectAll();
}, 100);
this.i_drag_off=EventHandler.register(document.body, "onmousedown", this.handleDragCancel, this);
}
}
}
CalendarBlockView.prototype.handleBuild=function(e) {
EventHandler.register(this.i_display_content, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_display_content, "onmousemove", this.handleMouseMove, this);
EventHandler.register(this.i_display_content, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_display_content, "onmousedown", this.handleMouseDown, this);
EventHandler.register(this.i_display_grid, "onclick", this.handleClick, this);
EventHandler.register(this.i_display_grid, "ondblclick", this.handleDoubleClick, this);
EventHandler.register(this.i_display_grid, "oncontextmenu", this.handleContextMenu, this);
this.i_today_holder=document.createElement('DIV');
this.i_today_holder.className="CalendarBlockView_highlight_holder";
this.i_display_grid.insertBefore(this.i_today_holder, this.i_event_holder);
this.i_today_box=document.createElement('DIV');
this.i_today_box.className="CalendarBlockView_today";
this.i_today_box.style.width=this.headerWidth()+"px";
this.i_today_box.style.height=this.contentHeight()+"px";
this.i_today_box.style.display="none";
this.i_today_holder.appendChild(this.i_today_box);
this.updateFocus();
this.refreshData();
}
CalendarBlockView.prototype.updateHeaders=function() {
var startHour=this.i_start.getHours();
var endHour=this.i_end.getHours();
var p=0;
this.removeLeftHeaders(this.i_hours);
this.i_hours=[];
for (var i=0; i <=23;++i) {
this.i_hours[i]=new CalendarViewHourHeader(this.i_increment, i, this.rowHeight(), this.military(), i);
this.i_hours[i].rangeOverflow((i < startHour || i+1 > endHour));
}
this.addLeftHeaders(this.i_hours);
}
CalendarBlockView.prototype.startDate=function(startDate) {
if (startDate!=undefined && this.i_start!=startDate) {
this.i_start=startDate;
this.updateHeaders();
this.refreshData();
}
return this.i_start;
}
CalendarBlockView.prototype.endDate=function(endDate) {
if (endDate!=undefined && this.i_end!=endDate) {
this.i_end=endDate;
this.updateHeaders();
this.refreshData();
}
return this.i_end;
}
CalendarBlockView.prototype.days=function(days) {
if (days!=undefined && this.i_days!=days) {
for (var x=days; x <=this.i_days; x++) {
this.removeHeader(this.i_day_headers[x]);
}
for (var x=this.i_days; x < days; x++) {
if (this.i_day_headers[x]==undefined) {
this.i_day_headers[this.i_day_headers.length]=this.addHeader(new CalendarViewHeader("Day "+(this.i_day_headers.length - 1)));
}
else {
this.addHeader(this.i_day_headers[x]);
}
}
this.i_days=days;
}
return this.i_days;
}
CalendarBlockView.prototype.rowHeight=function(height) {
if (height!=undefined && this.i_row_height!=height) {
this.i_row_height=height;
for (var x=0; x < this.i_hours.length; x++) {
if (this.i_hours[x]!=undefined) {
this.i_hours[x].rowHeight(height);
}
}
}
return this.i_row_height;
}
CalendarBlockView.prototype.increment=function(increment) {
if (increment && this.i_increment!=increment) {
this.i_increment=increment;
for (var x=0; x < this.i_hours.length; x++) {
if (this.i_hours[x]!=undefined) {
this.i_hours[x].increment(increment);
}
}
this.refreshData();
}
return this.i_increment;
}
CalendarBlockView.prototype.military=function(state) {
if (state!=undefined && this.i_military!=state) {
this.i_military=state;
for (var x=0; x < this.i_hours.length; x++) {
if (this.i_hours[x]!=undefined) {
this.i_hours[x].military(state);
}
}
}
return this.i_military;
}
CalendarBlockView.prototype.handleMouseOver=function(e) {
}
CalendarBlockView.prototype.handleMouseOut=function(e) {
this.i_lastScrollPos=this.i_display_content.scrollTop; 
for (var x=0; x < this.i_left_headers.length; x++) {
this.i_left_headers[x].resetHover();
}
}
CalendarBlockView.prototype.handleLayoutChange=function(e) {
if (this.parent().activeView()==this) {
if (this.i_lastScrollPos!=undefined) {
this.i_display_content.scrollTop=this.i_lastScrollPos;
} else {
this.scrollHour(this.startDate().getHours());
}
}
}
CalendarBlockView.prototype.cursorPosition=function(date, x, y, approx) {
var lf=0;
var tp=0;
var me=this.i_display_grid;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
var x=(x!=undefined ? x : CursorMonitor.getX());
var y=(y!=undefined ? y : CursorMonitor.getY());
var o=new Object();
var diffx=x - lf;
var diffy=(y - tp)+parseInt(this.i_display_content.scrollTop);
if (diffy >=0) {
o.rowOverflow=diffy % this.leftHeaders(0).rowHeight();
o.row=Math.floor(diffy / this.leftHeaders(0).rowHeight());	
if (approx==true && o.rowOverflow > (this.leftHeaders(0).rowHeight() / 2)) {
o.row++;
}
o.hour=Math.floor(o.row / Math.floor(60 / this.increment()));
o.hour_row=o.row - (o.hour * Math.floor(60 / this.increment()));
}
if (diffx > 0) {
o.col=Math.floor(diffx / this.i_headers[0].width());
}
if (date==true) {
var d;
if (o.col!=undefined && this.i_headers[o.col]!=undefined) {	
d=new Date();
d.setFullYear(this.i_headers[o.col].i_display_date.y);
d.setMonth(this.i_headers[o.col].i_display_date.m, this.i_headers[o.col].i_display_date.d);
d.setMinutes(0);
d.setSeconds(0);
d.setHours(0);
}
if (d!=undefined && o.row!=undefined) {
d.setHours(o.hour);
d.setMinutes(o.hour_row * this.increment());
d.setSeconds(0);
}
o.date=d;
}
return o;
}
CalendarBlockView.prototype.handleMouseMove=function() {
var p=this.cursorPosition();
if (this.i_last_h!=undefined) {
this.i_last_h.rowHoverState(this.i_last_hr, false);
this.i_last_h=undefined;
this.i_last_hr=undefined;
}
if (p.row!=undefined) {
if (this.i_left_headers[p.hour]!=undefined) {
this.i_left_headers[p.hour].rowHoverState(p.hour_row, true);
this.i_last_h=this.i_left_headers[p.hour];
this.i_last_hr=p.hour_row;
}
}
}
CalendarBlockView.prototype.handleResize=function(e) {
if (this.i_today_box!=undefined) {
if (this.i_today_col!=undefined) {
this.i_today_box.style.left=(this.headerWidth() * this.i_today_col)+"px";
}
this.i_today_box.style.width=(this.headerWidth() - 1)+"px";
}
this.repositionData();
this.updateFocus();
this.handleLayoutChange(e);
}
CalendarBlockView.prototype.handleFocusChange=function(e) {
this.updateFocus();
var visibleMs=this.headers().length * 86400000;
if (Math.abs(e.oldtime.valueOf() - this.focusDate().valueOf()) >=visibleMs) this.refreshData();
}
CalendarBlockView.prototype.handleSelectedChange=function(e) {
this.updateFocus();
}
CalendarBlockView.prototype.printView=function() {
var days=this.headers().length;
var hour_rows=(60 / this.increment());
var left_headers=this.leftHeaders().length;
var header_height=Math.floor((650 - 25) / days);
var first_event=23;
var last_event=0;
var ev_array=Array();
var ev_allday=Array();
var header_stamps=Array();
for (var x=0; x < days; x++) {
var h_display=this.headers(x).i_display_date;
var h_stamp=h_display.m+"."+h_display.d+"."+h_display.y;
header_stamps[x]=h_stamp;
ev_allday[h_stamp]="&nbsp;";
ev_array[h_stamp]=Array();
for (var z=0; z < left_headers; z++) {
ev_array[h_stamp][z]=Array();
for (var m=0; m < hour_rows; m++) {
ev_array[h_stamp][z][m]="";
}
}
}
for (var itx in this.i_event_cache) {
var ev_itx=this.i_event_cache[itx];
if (!itx.match(/^i.*-.*$/) || ev_itx==undefined) continue;
var ev_obj=ev_itx.eventObject();
if (ev_itx.visible()) {
if (ev_obj!=undefined) {
var eventDate=ev_obj.startTime();
var eventMonth=eventDate.getMonth();
var eventDay=eventDate.getDate();
var eventYear=eventDate.getFullYear();
var eventStamp=eventMonth+"."+eventDay+"."+eventYear;
if (ev_array[eventStamp]!=undefined) {
var eventHour=eventDate.getHours();
var eventMinutes=Math.floor(eventDate.getMinutes() / this.increment());
if (eventHour < first_event) {
first_event=eventHour;
}
if (eventHour > last_event) {
last_event=eventHour;
}
var timeTitle="All Day";
if (ev_obj.allDay()!="1" && ev_obj.type()=="event") {
var startTime_hours=ev_obj.startTime().getHours();
var startTime_minutes=ev_obj.startTime().getMinutes();
var startTime_ampm="am";
if (startTime_hours==12) {
startTime_ampm="pm";
}
else if (startTime_hours > 12) {
startTime_hours-=12;
startTime_ampm="pm";
}
var endTime_hours=ev_obj.endTime().getHours();
var endTime_minutes=ev_obj.endTime().getMinutes();
var endTime_ampm="am";
if (endTime_hours==12) {
endTime_ampm="pm";
}
else if (endTime_hours > 12) {
endTime_hours-=12;
endTime_ampm="pm";
}
timeTitle=startTime_hours+":"+(startTime_minutes < 10 ? "0" : "")+startTime_minutes+startTime_ampm+"-"+endTime_hours+":"+(endTime_minutes < 10 ? "0" : "")+endTime_minutes+endTime_ampm;
}
ev_array[eventStamp][eventHour][eventMinutes]+="<div class='CalendarMonthView_print_event_time' style='overflow:hidden;width:"+(header_height - 2)+"px;'>"+timeTitle+"</div><div class='CalendarMonthView_print_event_title' style='overflow:hidden;width:"+(header_height - 2)+"px;'>"+BreakString(ev_obj.title(), 10)+"</div>";
}
}
}
}
var startHour=this.startDate().getHours();
var endHour=this.endDate().getHours();
if (first_event > startHour) {
first_event=startHour;
}
if (last_event < endHour) {
last_event=endHour;
}
for (var x=0; x < days; x++) {
var headEvents=this.i_headers[x].events();
var stamp=header_stamps[x];
for (var z=0; z < headEvents.length; z++){ 
var ev_obj=headEvents[z];
if (ev_allday[stamp]=="&nbsp;") {
ev_allday[stamp]="";
}
if (ev_obj.type()=="task") {
ev_allday[stamp]+="<div class='CalendarMonthView_print_task'>"+ev_obj.title()+"</div>";
}
else {
ev_allday[stamp]+="<div class='CalendarMonthView_print_event_time' style='overflow:hidden;width:"+(header_height - 2)+"px;'>All Day</div><div class='CalendarMonthView_print_event_title'>"+BreakString(ev_obj.title(), 10)+"</div>";
}
}
}
var tbody_text="<table cellspacing='0' cellpadding='0' border='0' class=\"CalendarBlockView_print_printMonth\">";
tbody_text+="<tr><td align='center' colspan="+(days+2)+" style='border-top: 1px solid #000000; border-left: 1px solid #000000;'>"+this.parent().activeDataModel().name()+"</td></tr>";
tbody_text+="<tr><td align='center' colspan="+(days+2)+" style='border-top: 1px solid #000000; border-left: 1px solid #000000;'>"+this.parent().headerText()+"</td></tr>";
if (days > 1) {
tbody_text+="<tr><td colSpan='2' class=\"CalendarBlockView_print_emptyTopBox CalendarBlockView_print_emptyBottomBox\">&nbsp;</td>";
for(var x=0; x < days; x++) {
var dd=this.headers(x).i_display_date;
tbody_text+="<th name='dayColumn' class=\"CalendarBlockView_print_dayheader\" style=\"width: "+header_height+"px;\">"+CalendarMonthView.weekDaysAbbr[dd.wd]+" "+(dd.m+1)+"/"+dd.d+"</th>";
}
}
tbody_text+="</tr>";
tbody_text+="<tr><td colSpan='2' class=\"CalendarBlockView_print_emptyBottomBox\">&nbsp;</td>";
for(var x=0; x < days; x++) {
tbody_text+="<td id='allday"+x+"' class=\"CalendarBlockView_print_timeSlotBoxHour\" width="+header_height+">"+ev_allday[header_stamps[x]]+"</td>";
}
tbody_text+="</tr>";
for(var x=first_event; x <=last_event; x++) {
var real_hour=this.leftHeaders(x).hour();
var hour_text=this.leftHeaders(x).getHourText();
tbody_text+="<tr>";
tbody_text+="<td valign=\"top\" class=\"CalendarBlockView_print_timeBoxHour\" rowSpan='"+hour_rows+"'>"+hour_text.hours+"</td>";
tbody_text+="<td class=\"CalendarBlockView_print_timeBoxHour\">"+hour_text.extra+"</td>";
for (var z=0; z < hour_rows; z++) {
if (z!=0) {
tbody_text+="<td class=\"CalendarBlockView_print_timeBox\">&nbsp;</td>";
}
for(var y=0; y < days; y++) {
var evs=ev_array[header_stamps[y]][real_hour][z];
if (evs=="") {
evs="&nbsp;";
}
tbody_text+="<td width="+header_height+" class=\"CalendarBlockView_print_timeSlotBox"+(z==0 ? "Hour"+(z==0 ? "First" : "") : "")+"\">"+evs+"</td>";
}
tbody_text+="</tr>";
}
}
tbody_text+="</table>";
var d=document.createElement('DIV');
d.innerHTML=tbody_text;
SystemCore.loadPrintContent(d, true);
}
CalendarBlockView.prototype.handleAppLoad=function() {
var startHour=this.startDate().getHours();
var me=this;
setTimeout(function() {
me.scrollHour(startHour);
me=null; 
startHour=null;	
}, 10);
}
CalendarBlockView.prototype.throwDisplayViewEvent=function() {
if (this.ondisplayview!=undefined) {
var o=new Object();
o.type='displayview';
o.view=this;
if (this.i_days==7) {
o.view_type='w';   
} else {
o.view_type='d';   
}
this.ondisplayview(o);
}
}
CalendarBlockView.inherit(CalendarViewHeaderType);
function BlockPositionProcessor(width, height, mode) {
this.i_width=width;
this.i_mode=(mode==undefined ? 0 : mode);
this.i_height=height;
this.i_blocks=Array();
}
BlockPositionProcessor.minimumEventWidth=4;
BlockPositionProcessor.padding=2;
BlockPositionProcessor.bucketCount=10;
BlockPositionProcessor.prototype.mode=function(mode) {
if (mode!=undefined) {
this.i_mode=mode;
}
return this.i_mode;
}
BlockPositionProcessor.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
}
return this.i_width;
}
BlockPositionProcessor.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
}
return this.i_height;
}
BlockPositionProcessor.prototype.blocks=function(index) {
if (index!=undefined) {
return this.i_blocks[index];
}
return this.i_blocks;
}
BlockPositionProcessor.prototype.addBlock=function(block) {
this.i_blocks[this.i_blocks.length]=block;
return block;
}
BlockPositionProcessor.prototype.removeBlock=function(block) {
for (var x=0; x < this.i_blocks.length; x++) {
if (this.i_blocks[x]==block) {
this.i_blocks.splice(x, 1);
return true;
}
}
return false;
}
BlockPositionProcessor.prototype.calculate=function() {
if (this.mode()==0) {
return this.calculateMode0();
}
else {
return this.calculateMode1();
}
}
BlockPositionProcessor.prototype.calculateMode1=function() {
var block_count=this.i_blocks.length;
for (var x=0; x < block_count; x++) {
var lowI=x;
for (var y=x; y < block_count; y++){ 
if (this.i_blocks[lowI].order() > this.i_blocks[y].order()) {
lowI=y;
}
}
if (lowI!=x) {
var bck=this.i_blocks[lowI];
this.i_blocks[lowI]=this.i_blocks[x];
this.i_blocks[x]=bck;
}
}
var lf_off=Math.floor((this.width() - ((block_count - 1) * 2)) / block_count);
var lf_run=0;
for (var x=0; x < block_count; x++) {
this.i_blocks[x].left(lf_run);
this.i_blocks[x].width(lf_off);
lf_run+=lf_off+2;
}
}
BlockPositionProcessor.prototype.calculateMode0=function() {
this.i_buckets=Array();
this.i_max_bucket=0;
var block_count=this.i_blocks.length;
for (var x=0; x < block_count; x++) {
var b=this.i_blocks[x];
b.i_startBucketId=Math.floor(b.i_top / BlockPositionProcessor.bucketCount);
b.i_endBucketId=Math.ceil((b.i_top+b.i_height) / BlockPositionProcessor.bucketCount);
b.i_pos=undefined;
for (var z=b.i_startBucketId; z < b.i_endBucketId; z++) {
if (this.i_buckets[z]==undefined) {
this.i_buckets[z]=Array();
if (z > this.i_max_bucket) {
this.i_max_bucket=z;
}
}
this.i_buckets[z][this.i_buckets[z].length]=b;
}
}
for (var x=0; x < this.i_max_bucket; x++) {
if (this.i_buckets[x]!=undefined) {
var c=this.i_buckets[x].length;
var m=c;
var pos=Array();
var pos_len=c;
for (var z=0; z < c; z++) { 
var b=this.i_buckets[x][z];
if (b.i_pos!=undefined && pos[b.i_pos]==undefined) {
pos[b.i_pos]=b;
if (b.i_cols > c) {
pos_len=b.i_cols;
m=b.i_cols;
}
}
if (b.i_cols==undefined || b.i_cols < m) {
b.i_cols=m;
}
if (b.i_pos==undefined || pos[b.i_pos]!=b) {
for (var q=0; q < pos_len; q++) {
if (pos[q]==undefined) {
b.i_pos=q;
pos[q]=b;
break;
}
}
}
}
}
}
var effWidth=this.i_width - (BlockPositionProcessor.padding * 2);
var max_cols=Math.floor(effWidth/(BlockPositionProcessor.padding+BlockPositionProcessor.minimumEventWidth));
for (var x=0; x < block_count; x++) {
var b=this.i_blocks[x];
if (b.i_cols > max_cols) {
b.i_cols=max_cols;
}
b.width(Math.floor((effWidth - ((b.i_cols - 1) * BlockPositionProcessor.padding)) / b.i_cols));
if (b.i_pos > max_cols - 1) {
b.left(20000);   
} else {
b.left((b.i_pos * (b.i_width+BlockPositionProcessor.padding)));
}
}
}
function BlockPositionBlock(top, height, order) {
this.i_top=top;
this.i_height=height;
this.i_order=order;
}
BlockPositionBlock.prototype.top=function(top) {
if (top!=undefined) {
this.i_top=top;
}
return this.i_top;
}
BlockPositionBlock.prototype.order=function(order) {
if (order!=undefined) {
this.i_order=order;
}
return this.i_order;
}
BlockPositionBlock.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
}
return this.i_height;
}
BlockPositionBlock.prototype.left=function(left) {
if (left!=undefined) {
if (left==NaN) {
left=0;
}
this.i_left=left;
}
return this.i_left;
}
BlockPositionBlock.prototype.width=function(width) {
if (width!=undefined) {
if (width==NaN) {
width=1;
}
this.i_width=width;
}
return this.i_width;
}
function MonthViewEvent(width, height, left, top, ev) {
this.i_width=width;
this.i_height=height;
this.i_left=left;
this.i_top=top;
this.i_visible=true;
this.i_event=ev;
this.i_extension=false;
}
MonthViewEvent.onextcontext=null;
MonthViewEvent.onsettip=null;
MonthViewEvent.dragThreshold=5;
MonthViewEvent.prototype.parent=function() {
return this.i_parent;
}
MonthViewEvent.prototype.extended=function(state) {
if (state!=undefined) {
this.i_extension=state;
if (this.i_event_obj2!=undefined) {
this.i_event_obj2.innerHTML=this.timeTitle();
}
if (this.i_drag_event!=undefined) {
this.i_drag_event_obj2.innerHTML=this.timeTitle();
}	
}
return this.i_extension;
}
MonthViewEvent.prototype.startDate=function(date) {
if (date!=undefined) {
this.i_start_date=date;
}
return this.i_start_date;
}
MonthViewEvent.prototype.eventObject=function(ev) {
if (ev!=undefined) {
this.i_event=ev;
if (this.i_event_obj2!=undefined) {
this.i_event_obj2.innerHTML=this.timeTitle();
this.toolTip().tip(this.tipText());
}
if (this.i_drag_event!=undefined) {
this.i_drag_event_obj2.innerHTML=this.timeTitle();
}	
this.styleEvent();
}
return this.i_event;
}
MonthViewEvent.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_event_holder!=undefined) {
this.i_event_holder.style.display=(state ? "" : "none");
}
}
return this.i_visible;
} 
MonthViewEvent.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_event_holder!=undefined) {
this.i_event_obj.style.width=(this.width() - 2)+"px";
this.i_event_obj2.style.width=this.width()+"px";
this.i_tip.elementWidth(width);
}
if (this.i_drag_event!=undefined) {
this.i_drag_event.style.width=this.width()+"px";
this.i_drag_event_obj1.style.width=(this.width() - 2)+"px";
this.i_drag_event_obj2.style.width=this.width()+"px";
}
}
return this.i_width;
}
MonthViewEvent.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_event_holder!=undefined) {
this.i_event_obj.style.height=this.height()+"px";
this.i_event_obj2.style.height=(this.height() - 2)+"px";
this.i_tip.elementHeight(height);
}
if (this.i_drag_event!=undefined) {
this.i_drag_event_obj1.style.height=this.height()+"px";
this.i_drag_event_obj2.style.height=(this.height() - 2)+"px";
this.i_drag_event.style.height=this.height()+"px";
}
}
return this.i_height;
}
MonthViewEvent.prototype.top=function(top) {
if (top!=undefined) {
this.i_top=top;
if (this.i_event_holder!=undefined) {
this.i_event_obj.style.top=top+"px";
}
}
return this.i_top;
}
MonthViewEvent.prototype.left=function(left) {
if (left!=undefined) {
this.i_left=left;
if (this.i_event_holder!=undefined) {
this.i_event_obj.style.left=(left+1)+"px";
}
}
return this.i_left;
}
MonthViewEvent.prototype.tipText=function() {
var ev=this.eventObject();
if (ev==undefined) {
return "";
}
else {
if (ev.type()=="task") {
return htmlEncode(ev.param("title"));
}
else {
var s_time=ev.startTime();
var e_time=ev.endTime();
var tText=(ev.allDay()==true ? htmlEncode (ev.param("title")) : getTimeString(s_time)+" - "+getTimeString(e_time)+"<br>"+htmlEncode(ev.param("title"))+(ev.param("location") ? "<br>("+htmlEncode(ev.param("location"))+")" : ""));
if (MonthViewEvent.onsettip!=undefined){
var e=new Object();
e.event=ev;
e.text=tText;
e.type="settip";
MonthViewEvent.onsettip(e);
tText=e.text;
}
return tText;
}	
}
}
MonthViewEvent.prototype.timeTitle=function() {
var ev=this.eventObject();
if (ev!=undefined) {
if (ev.type()=="task") {
return htmlEncode(ev.param("title"));
}
else {
var s_time=ev.param("start")
var mrs_prefix="";
var mrs_suffix="";
if (ev.meetingRequestState!=undefined) {
var mrs=ev.meetingRequestState();
if (mrs!=2 && mrs!=0) {
mrs_prefix="<b>";
mrs_suffix="</b>";
}
}
if (this.eventObject().access()==CalendarEvent.Permission.freebusy) {
return (ev.allDay()==true ? "All day" : getTimeString(s_time));
} else {
return mrs_prefix+(this.extended() ? "(Cont'd) " : "")+(ev.allDay()==true ? "" : getTimeString(s_time)+" - ")+htmlEncode(ev.param("title"))+mrs_suffix;
}
}
}
return "No Event";
}
MonthViewEvent.prototype.styleEvent=function() {
if (this.i_event_obj!=undefined) {
var ev=this.eventObject();
var color;
if (ev!=undefined) {
var border_color;
var header_color;
var text_color;
var icon_class;
color=ev.colorClass();
if (color==undefined) {
color=CalendarColorClass.getColorById(ev.parentDataModel().color());	
}
if (color.allDay()!=true) {
border_color=color.border();
text_color=color.title();
header_color=color.border();
icon_class=color.iconClass();
}
else {
border_color=color.border();
text_color=color.title();
header_color=color.background();
icon_class=color.iconClass();
}
this.i_event_obj.style.borderColor=border_color;
this.i_event_obj2.style.borderColor=border_color;
this.i_event_obj2.style.backgroundColor=header_color;
this.i_event_obj2.style.color=text_color;
this.i_event_obj2.className="MonthViewEvent_corner"+(icon_class!=undefined ? " "+icon_class : "");
this.i_event_obj2.style.paddingLeft=(icon_class!=undefined ? "18px" : "0px");
if (this.i_drag_event!=undefined) {
this.i_drag_event_obj1.style.borderColor=border_color;
this.i_drag_event_obj2.style.borderColor=border_color;
this.i_drag_event_obj2.style.backgroundColor=header_color;
this.i_drag_event_obj2.style.color=text_color;
this.i_drag_event_obj2.className="MonthViewEvent_corner"+(icon_class!=undefined ? " "+icon_class : "");
this.i_drag_event_obj2.style.paddingLeft=(icon_class!=undefined ? "18px" : "0px");
}
var ev_type=(this.eventObject().eventType!=undefined ? this.eventObject().eventType() : 1);
if (ev_type==2 || ev_type==3 || ev_type==5) {
this.i_event_obj.style.cursor="default";
}
}
}
}
MonthViewEvent.prototype.getDragEvent=function() {
if (this.i_drag_event==undefined) {
this.i_drag_event=document.createElement('DIV');
this.i_drag_event.className="MonthViewEvent_event_drag";
this.i_drag_event.style.width=this.width()+"px";
this.i_drag_event.style.height=this.height()+"px";
this.i_event_holder.appendChild(this.i_drag_event);
this.i_drag_event_obj1=document.createElement('DIV');
this.i_drag_event_obj1.className="MonthViewEvent_event";
this.i_drag_event_obj1.style.width=(this.width() - 2)+"px";
this.i_drag_event_obj1.style.height=this.height()+"px";
this.i_drag_event.appendChild(this.i_drag_event_obj1);
this.i_drag_event_obj2=document.createElement('DIV');
this.i_drag_event_obj2.className="MonthViewEvent_corner";
this.i_drag_event_obj2.style.width=this.width()+"px";
this.i_drag_event_obj2.style.height=(this.height() - 2)+"px";
this.i_drag_event_obj2.style.lineHeight=(this.height() - 2)+"px";
this.i_drag_event_obj2.innerHTML=this.timeTitle();
this.i_drag_event_obj1.appendChild(this.i_drag_event_obj2);
this.styleEvent();
}
return this.i_drag_event;
}
MonthViewEvent.prototype.handleMouseDown=function(e) {
if (this.eventObject().parentDataModel().access!=undefined && 
this.eventObject().meetingRequestState!=undefined && 
(this.eventObject().meetingRequestState()!=0 || this.eventObject().parentDataModel().access()!="All")) {
return true;
}
var ev_type=(this.eventObject().eventType!=undefined ? this.eventObject().eventType() : 1);
if (ev_type==2 || ev_type==3 || ev_type==5) {
return true;
}
this.i_l_m=EventHandler.register(document.body, "onmousemove", this.handleMouseMove, this);
this.i_l_u=EventHandler.register(document.body, "onmouseup", this.handleMouseUp, this);
this.i_start_x=CursorMonitor.getX();
this.i_start_y=CursorMonitor.getY();
this.i_in_drag=false;
this.i_ev_left=0;
this.i_ev_top=0;
var me=this.i_event_obj;
while (me!=null) {
this.i_ev_left+=parseInt(me.offsetLeft);
this.i_ev_top+=parseInt(me.offsetTop);
me=me.offsetParent;
}
this.i_ev_offset_left=(this.i_start_x - this.i_ev_left);
this.i_ev_offset_top=(this.i_start_y - this.i_ev_top);
}
MonthViewEvent.prototype.handleMouseMove=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
if (this.i_in_drag==true || 
this.i_start_x < x - MonthViewEvent.dragThreshold || this.i_start_x > x+MonthViewEvent.dragThreshold ||
this.i_start_y < y - MonthViewEvent.dragThreshold || this.i_start_y > y+MonthViewEvent.dragThreshold) {
if (this.i_in_drag==false) {
document.body.appendChild(this.getDragEvent());
this.i_in_drag=true;
}
this.getDragEvent().style.left=(x - this.i_ev_offset_left)+"px";
this.getDragEvent().style.top=(y - this.i_ev_offset_top)+"px";
}
}
MonthViewEvent.prototype.handleMouseUp=function(e) {
this.i_l_m.unregister();
this.i_l_u.unregister();
this.i_l_m=undefined;
this.i_l_u=undefined;
if (this.i_in_drag==true) {
var ap;
var ev=this.eventObject();
if (this.parent().positionDate!=undefined) {
ap=this.parent();
}
else if (this.parent().parent!=undefined && this.parent().parent().positionDate!=undefined) {
ap=this.parent().parent();
}
else if (this.parent().parent!=undefined && this.parent().parent().cursorPosition!=undefined) {
var pos_x=CursorMonitor.getX();
var pos_y=CursorMonitor.getY();
var allDayDrag=false;
var minicaldrop=false;
var pos=undefined;
var headers=this.parent().parent().i_headers;
if (headers!=undefined && headers.length > 0) {
for (var i=0; i < headers.length;++i) {
var area=headers[i].getArea();
if (area!=undefined) {
if (pos_x >=area.left && pos_x <=area.right && pos_y >=area.top && pos_y <=area.bottom) {
var target=headers[i].i_display_date;
pos=new Object();
pos.date=new Date(target.y, target.m, target.d, 0, 0, 0, 0);
allDayDrag=true;
break;
}
}
}
}
if (pos==undefined) pos=this.parent().parent().cursorPosition(true,pos_x,pos_y);
if(pos.date==undefined) {
pos.date=Application.getApplicationById(1004).getScheduler().positionDate(pos_x, pos_y);
if (pos.date!=undefined) minicaldrop=true;
}
if (pos.date!=undefined) {
if (ev.type()=="event") {
var start_time=this.eventObject().startTime().copy();
var end_time=this.eventObject().endTime().copy();
if (minicaldrop) { 
var diff=(end_time.getTime() - start_time.getTime());
start_time.setFullYear(pos.date.getFullYear());
start_time.setMonth(pos.date.getMonth(), pos.date.getDate());
end_time.setTime(start_time.getTime()+diff);
} else if (allDayDrag) { 
start_time.setTime(pos.date);
end_time.setTime(addDay(start_time));
} else { 
start_time.setTime(pos.date);
end_time.setTime(addHour(start_time));
}
if (ev.startTime().valueOf()!=start_time.valueOf() || ev.endTime().valueOf()!=end_time.valueOf()) {
ev.parentDataModel().ignoreChange(true);
if (!minicaldrop && !allDayDrag) ev.allDay(false);
ev.startTime(start_time, end_time);
ev.parentDataModel().ignoreChange(false);
ev.save(true);
}
}
else if (ev.type()=="task") {
var start_time=this.eventObject().dueDate().copy();
start_time.setFullYear(pos.date.getFullYear());
start_time.setMonth(pos.date.getMonth(), pos.date.getDate());
if (ev.dueDate()==undefined || ev.dueDate().valueOf()!=start_time.valueOf()) {
ev.parentDataModel().ignoreChange(true);
ev.dueDate(start_time);
ev.parentDataModel().ignoreChange(false);
ev.save();
}
}
}
}
if (ap!=undefined) {
var pos_x=CursorMonitor.getX();
var pos_y=CursorMonitor.getY();
var pos=ap.positionDate(pos_x - ap.contentLeft(), pos_y - ap.contentTop());
if(pos==undefined) {
var scheduler=Application.getApplicationById(1004).getScheduler();
if(scheduler!=undefined) {
pos=scheduler.positionDate(pos_x, pos_y);
}
}
if (pos!=undefined) {
if (ev.type()=="event") {
var start_time=this.eventObject().startTime().copy();
var end_time=this.eventObject().endTime().copy();
var diff=(end_time.getTime() - start_time.getTime());
start_time.setFullYear(pos.getFullYear());
start_time.setMonth(pos.getMonth(), pos.getDate());
end_time.setTime(start_time.getTime()+diff);
ev.startTime(start_time, end_time);
ev.parentDataModel().ignoreChange(false);
ev.save(true);
}
else if (ev.type()=="task") {
var start_time=this.eventObject().dueDate().copy();
start_time.setFullYear(pos.getFullYear());
start_time.setMonth(pos.getMonth(), pos.getDate());
ev.dueDate(start_time);
ev.parentDataModel().ignoreChange(false);
ev.save();
}
}
}
document.body.removeChild(this.getDragEvent());
}
}
MonthViewEvent.prototype.handleContextMenu=function(e) {
var cx;
if (this.eventObject().access()!=CalendarEvent.Permission.freebusy) {
if (this.eventObject().type()=="event" && this.eventObject().eventType()!=0) {
var specialEvent=false;
switch (this.eventObject().eventType()) {
case '2':
specialEvent=true;
case '3':
specialEvent=true;
case '5':
specialEvent=true;
default:
break;
}
if (specialEvent) {
if (this.eventObject().iExtContextMenu==undefined) {
this.eventObject().iExtContextMenu=new ContextMenu(150);
}
if (MonthViewEvent.onextcontext!=undefined) {
var o=new Object();
o.type="extcontext";
o.event=this.eventObject();
MonthViewEvent.onextcontext(o);
}
} else {			
var inHeader=false;
if (this.parent().parent().contextMenu==undefined) {
inHeader=true;
}
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var me=(inHeader ? this.parent().parent().i_display_grid : this.parent().i_display_grid);
var lf=0;
var tp=0;
while (me!=undefined) {
lf+=parseInt(me.offsetLeft)+parseInt(me.scrollLeft);
tp+=parseInt(me.offsetTop)+parseInt(me.scrollTop);
me=me.offsetParent;
}
var diffx=x - lf;
var diffy=y - tp;
if (diffx > 0 && (diffy > 0 || inHeader)) {
cx=(inHeader ? this.parent().parent().parent().genericContextMenu() : this.parent().parent().genericContextMenu());
if (inHeader) {
var d_data=this.parent().i_display_date;
var d_obj=new Date();
d_obj.setFullYear(d_data.y);
d_obj.setMonth(d_data.m, d_data.d);
cx.i_target_date=d_obj;
}
else {
cx.i_target_date=this.parent().positionDate(diffx, diffy);
}
var cdate=new Date();
cx.i_target_date.setMinutes(cdate.getMinutes());
cx.i_target_date.setHours(cdate.getHours());
cx.i_target_date.setSeconds(cdate.getSeconds());
cx.show();
}
}
}
else {
if (this.parent().parent().contextMenu==undefined) {
this.parent().parent().parent().contextMenu(this.eventObject());	
}
else {
this.parent().parent().contextMenu(this.eventObject());
}
}
}
e.cancelBubble=true;
e.returnValue=false;
}
MonthViewEvent.prototype.handleDoubleClick=function(e) {
var ev_type=(this.eventObject().eventType!=undefined ? this.eventObject().eventType() : 1);
if (ev_type==2 || ev_type==3 || ev_type==5) {
return;
}
if (this.parent().parent().doubleClickEvent==undefined) {
this.parent().parent().parent().doubleClickEvent(this.eventObject());
}
else {
this.parent().parent().doubleClickEvent(this.eventObject());
}
}
MonthViewEvent.prototype.toolTip=function() {
if (this.i_tip==undefined) {
if (this.i_event_obj!=undefined) {
this.i_tip=new ToolTip(this.i_event_obj, 200, "");
this.i_tip.elementWidth(this.width());
this.i_tip.elementHeight(this.height());
}
}
return this.i_tip;
}
MonthViewEvent.prototype.destroyEvents=function() {
if (this.i_eo_omd!=undefined) {
this.i_eo_omd.unregister();
this.i_eo_ocm.unregister();
this.i_eo_oc.unregister();
this.i_eo_odc.unregister();
this.i_eo_omd=undefined;
this.i_eo_ocm=undefined;
this.i_eo_oc=undefined;
this.i_eo_odc=undefined;
}
if (this.i_l_m!=undefined) {
this.i_l_m.unregister();
this.i_l_u.unregister();
this.i_l_m=undefined;
this.i_l_u=undefined;
}
}
MonthViewEvent.prototype.getEvent=function() {
if (this.i_event_obj==undefined) {
this.i_event_holder=document.createElement('DIV');
this.i_event_holder.className="MonthViewEvent_holder";
this.i_event_holder.style.display=(this.visible() ? "" : "none");
this.i_event_obj=document.createElement('DIV');
this.i_event_obj.className="MonthViewEvent_event";
this.i_event_obj.style.width=(this.width() - 2)+"px";
this.i_event_obj.style.height=this.height()+"px";
this.i_event_obj.style.top=this.top()+"px";
this.i_event_obj.style.left=(this.left()+1)+"px";
this.i_eo_omd=EventHandler.register(this.i_event_obj, "onmousedown", this.handleMouseDown, this);
this.i_eo_ocm=EventHandler.register(this.i_event_obj, "oncontextmenu", this.handleContextMenu, this);
this.i_eo_oc=EventHandler.register(this.i_event_obj, "onclick", this.handleMouseClick, this);
this.i_eo_odc=EventHandler.register(this.i_event_obj, "ondblclick", this.handleDoubleClick, this);
this.i_event_holder.appendChild(this.i_event_obj);
this.toolTip().tip(this.tipText());
this.i_event_obj2=document.createElement('DIV');
this.i_event_obj2.className="MonthViewEvent_corner";
this.i_event_obj2.style.width=this.width()+"px";
this.i_event_obj2.style.height=(this.height() - 2)+"px";
this.i_event_obj2.style.lineHeight=(this.height() - 2)+"px";
this.i_event_obj.appendChild(this.i_event_obj2);
this.i_event_obj2.innerHTML=this.timeTitle();
this.styleEvent();
}
return this.i_event_holder;
}
function BlockViewEvent(width, height, left, top, ev) {
this.i_width=width;
this.i_height=height;
this.i_left=left;
this.i_top=top;
this.i_event=ev;
this.i_visible=true;
this.i_edit=false;
this.i_extension=false;
this.i_allow_resize=true;
}
BlockViewEvent.titleHeight=14;
BlockViewEvent.resizeHeight=10;
BlockViewEvent.prototype.parent=function() {
return this.i_parent;
}
BlockViewEvent.prototype.editMode=function(state) {
if (state!=undefined) {
if (this.i_edit!=state) {
this.i_edit=state;
if (this.i_event_obj!=undefined) {
if (state==true && this.i_event_data_edit==undefined) {
this.i_event_obj2.insertBefore(this.editArea(), this.i_event_data);
}
this.i_event_data_edit.style.display=(this.editMode() ? "" : "none");
this.i_event_data.style.display=(this.editMode() ? "none" : "");
}
this.styleEvent();
}
}
return this.i_edit;
}
BlockViewEvent.prototype.extended=function(state) {
if (state!=undefined) {
this.i_extension=state;
this.updateTitle();
}
return this.i_extension;
}
BlockViewEvent.prototype.allowResize=function(state) {
if (state!=undefined) {
this.i_allow_resize=state;
if (this.i_event_resize!=undefined) {
this.i_event_resize.style.display=(state ? "" : "none");
}
}
return this.i_allow_resize;
}
BlockViewEvent.prototype.startDate=function(start) {
if (start!=undefined) {
this.i_start_date=start;
}
return this.i_start_date;
}
BlockViewEvent.prototype.endDate=function(end) {
if (end!=undefined) {
this.i_end_date=end;
}
return this.i_end_date;
}
BlockViewEvent.prototype.description=function(data) {
if (data!=undefined && this.i_event_data!=undefined) {
var ev;
var mrs=0;
if (this.eventObject()!=undefined) {
ev=this.eventObject();
mrs=ev.meetingRequestState();
}
var prefix=((mrs!=2 && mrs!=0) ? "<b>" : "");
var suffix=((mrs!=2 && mrs!=0) ? "</b>" : "");
if(this.eventObject()!=undefined && this.eventObject().displayBody()!=undefined) {
this.i_event_data.innerHTML=prefix+this.eventObject().displayBody()+suffix;
} else {
this.i_event_data.innerHTML=prefix+htmlEncode(data)+suffix;
}
if (this.toolTip().tip().indexOf(data) < 0) {
this.toolTip().tip(this.tipText());
}
}
return (this.i_event_data ? this.i_event_data.innerHTML : undefined);
}
BlockViewEvent.prototype.selectAll=function() {
if (this.i_event_data_edit!=undefined) {
try {
if (this.i_event_data_edit.focus && this.i_event_data_edit.focus) {
this.i_event_data_edit.focus();
this.i_event_data_edit.select();
}
} catch(e) { }
}		
}
BlockViewEvent.prototype.width=function(width) {
if (width!=undefined && this.i_width!=width) {
this.i_width=width;
var event_width_minus_2=Math.max(this.i_width - 2, 0);
if (this.i_event_obj!=undefined) {
this.i_event_obj.style.width=event_width_minus_2+"px";
this.i_event_title.style.width=event_width_minus_2+"px";
this.i_event_data.style.width=event_width_minus_2+"px";
this.i_event_obj2.style.width=Math.max(this.i_width, 0)+"px";
this.i_event_resize.style.width=event_width_minus_2+"px";
this.i_tip.elementWidth(width);
}
if (this.i_event_data_edit!=undefined) {
this.i_event_data_edit.style.width=Math.max(this.i_width - 6, 0)+"px";
}
if (this.i_drag_event!=undefined) {
this.i_drag_event.style.width=this.i_width+"px";
var hw=(this.parent().headerWidth() - 4);
this.i_drag_event_obj1.style.width=(this.i_width - 2)+"px";
this.i_drag_event_obj2.style.width=hw+"px";
this.i_drag_event_title.style.width=(hw - 2)+"px";
this.i_drag_event_data.style.width=(hw - 2)+"px";	
}
}
return this.i_width;
}
BlockViewEvent.prototype.height=function(height) {
if (height!=undefined && this.i_height!=height) {
if (height < 16) {
height=16;
}
this.i_height=height;
if (this.i_event_obj!=undefined) {
if ((this.height() - BlockViewEvent.titleHeight - BlockViewEvent.resizeHeight - 5) <=0) {
this.i_event_data.style.display="none";
if (this.i_event_data_edit!=undefined) {
this.i_event_data_edit.style.display="none";
}
}
else {
if (this.i_event_data_edit!=undefined) {
this.i_event_data_edit.style.display=(this.editMode() ? "" : "none");
var iheight=(this.height() - BlockViewEvent.titleHeight - BlockViewEvent.resizeHeight);
if (iheight < 0) {
iheight=1;
}
this.i_event_data_edit.style.height=iheight+"px";
}
this.i_event_data.style.display=(this.editMode() ? "none" : "");
this.i_event_data.style.height=(this.height() - BlockViewEvent.titleHeight - BlockViewEvent.resizeHeight)+"px";
}
this.i_event_obj.style.height=height+"px";
this.i_event_obj2.style.height=(this.height() - 2)+"px";
this.i_event_resize.style.marginTop=(this.height() - BlockViewEvent.resizeHeight)+"px";
this.i_tip.elementHeight(height);
}
if (this.i_drag_event!=undefined) {
this.i_drag_event.style.height=this.height()+"px";
this.i_drag_event_obj1.style.height=this.height()+"px";
this.i_drag_event_obj2.style.height=(this.height() - 2)+"px";
var iheight=(this.height() - BlockViewEvent.titleHeight);
if (iheight <=0) {
iheight=1;
}
this.i_drag_event_data.style.height=iheight+"px";
}
}
return this.i_height;
}
BlockViewEvent.prototype.top=function(top) {
if (top!=undefined && this.i_top!=top) {
this.i_top=top;
if (this.i_event_obj!=undefined) {
if(document.all) {
this.i_event_holder.style.top=top+"px";
} else {
this.i_event_obj.style.top=top+"px";
}
}
}
return this.i_top;
}
BlockViewEvent.prototype.left=function(left) {
if (left!=undefined && this.i_left!=left) {
this.i_left=left;
if (this.i_event_obj!=undefined) {
this.i_event_obj.style.left=(left+1)+"px";
}
}
return this.i_left;
}
BlockViewEvent.prototype.eventObject=function(ev) {
if (ev!=undefined) {
this.i_event=ev;
var mrs=ev.meetingRequestState();
var prefix=((mrs!=2 && mrs!=0) ? "<b>" : "");
var suffix=((mrs!=2 && mrs!=0) ? "</b>" : "");
if (this.i_event_obj!=undefined) {
var resize_class="BlockViewEvent_resize";
if (this.eventObject().parentDataModel().access!=undefined && 
this.eventObject().meetingRequestState!=undefined && 
(this.eventObject().meetingRequestState()!=0 || this.eventObject().parentDataModel().access()!="All")) {
resize_class="BlockViewEvent_resize_remote";
}
this.i_event_resize.className=resize_class;
this.i_event_data.innerHTML=prefix+(ev.displayBody()!=undefined ? ev.displayBody() : htmlEncode(ev.param("title")))+suffix;
this.i_event_title.innerHTML=this.timeTitle();
if (this.i_event_data_edit!=undefined) {
this.i_event_data_edit.value=ev.param("title");
}
this.toolTip().tip(this.tipText());
}
if (this.i_drag_event!=undefined) {
this.i_drag_event_title.innerHTML=this.timeTitle();
this.i_drag_event_data.innerHTML=prefix+(ev.displayBody()!=undefined ? ev.displayBody() : htmlEncode(this.eventObject().param("title")))+suffix;
}
this.styleEvent();
}
return this.i_event;
}
BlockViewEvent.prototype.timeTitle=function(temp_duration) {
if (this.eventObject()!=undefined) {
return (this.extended() ? "(Cont'd) " : "")+getTimeString(this.startDate())+"-"+getTimeString(this.endDate());
}
return "No Event";
}
BlockViewEvent.prototype.tipText=function() {
var ev=this.eventObject();
if (ev==undefined) {
return "";
}
else {
var s_time=ev.startTime();
var e_time=ev.endTime();
return (ev.allDay()==true ? htmlEncode(ev.param("title")) : getTimeString(s_time)+" - "+getTimeString(e_time)+"<br>"+htmlEncode(ev.param("title"))+(ev.param("location") ? "<br>("+htmlEncode(ev.param("location"))+")" : ""));	
}
}
BlockViewEvent.prototype.updateTitle=function(title) {
if (this.i_event_title!=undefined) {
var prefix="";
var suffix="";
if (this.eventObject()!=undefined) {
var mrs=this.eventObject().meetingRequestState();
prefix=((mrs!=2 && mrs!=0) ? "<b>" : "");
suffix=((mrs!=2 && mrs!=0) ? "</b>" : "");
}
this.i_event_title.innerHTML=prefix+this.timeTitle()+suffix;	
}
}	
BlockViewEvent.prototype.handleResizeStart=function(e) {
if (this.editMode() || this.eventObject().meetingRequestState()!=0) {
return true;
}
var y=CursorMonitor.getY();
this.i_start_y=y;
this.i_start_height=this.height();
this.i_start_row_height=this.parent().leftHeaders(0).rowHeight();
if (this.i_ml!=undefined) {
this.i_ml.unregister();
this.i_mu.unregister();
}
if (this.i_l_m!=undefined) {
this.i_l_m.unregister();
this.i_l_u.unregister();
this.i_l_m=undefined;
this.i_l_u=undefined;
}
this.i_ml=EventHandler.register(document.body, "onmousemove", this.handleResizeMove, this);
this.i_mu=EventHandler.register(document.body, "onmouseup", this.handleResizeStop, this);
this.i_parent.i_event_being_dragged=this;
}
BlockViewEvent.prototype.handleResizeMove=function(e) {
var y=CursorMonitor.getY();
var diffy=(y - this.i_start_y);
if (this.i_start_height+diffy > BlockViewEvent.titleHeight+5) {
var new_start=this.i_start_height+diffy;
var over=(new_start % this.i_start_row_height);
new_start=new_start - over;
if (over > Math.floor(this.i_start_row_height / 2)) {
new_start+=this.i_start_row_height;
}
this.height(new_start);	
}
else {
this.height(BlockViewEvent.titleHeight+5);
}
this.i_drag_duration=Math.floor((diffy / this.parent().leftHeaders(0).rowHeight()) * this.parent().increment());
var en=new Date();
en.setTime(this.eventObject().endTime().getTime()+(this.i_drag_duration * 60000));
if (en.valueOf() < this.eventObject().startTime().valueOf()) en=this.eventObject().startTime().copy();
this.endDate(en);
this.parent().repositionData();
this.i_event_title.innerHTML=this.timeTitle(this.i_drag_duration);
}
BlockViewEvent.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_event_data_edit!=undefined) {
this.i_event_data_edit.style.display="none";
}
if (this.i_event_obj!=undefined) {
this.i_event_obj.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
BlockViewEvent.prototype.handleResizeStop=function(e) {
this.i_ml.unregister();
this.i_mu.unregister();
this.i_ml=undefined;
this.i_mu=undefined;
this.i_parent.i_event_being_dragged=undefined;
if (this.i_drag_duration!=undefined) {
var drag_offset=0;
var max_intervals=0;
var is_allway=undefined;
var increment=this.parent().increment();
var init_duration=(this.eventObject().endTime().getTime() - this.eventObject().startTime().getTime()) / 60000;
var time_offset=init_duration / increment;
if((init_duration % increment)==0) {
is_allway=true;
} else {
is_allway=false;
}
if(this.i_drag_duration >=0) {
max_intervals=Math.ceil(this.i_drag_duration / increment);
drag_offset=(increment * max_intervals) - this.i_drag_duration;
if(drag_offset <=(increment / 2) && is_allway) {
this.i_drag_duration=max_intervals * increment;
} else if (drag_offset > (increment / 2)  && is_allway) {
this.i_drag_duration=(max_intervals - 1) * increment;
}
} else {
max_intervals=Math.floor(this.i_drag_duration / increment);
drag_offset=(increment * max_intervals) - this.i_drag_duration;
drag_offset=-1 * drag_offset;
if(drag_offset <=(increment / 2)  && is_allway) {
this.i_drag_duration=max_intervals * increment;
} else if(drag_offset > (increment/2) && is_allway) {
this.i_drag_duration=(max_intervals+1) * increment;
}
}
var st=this.eventObject().endTime();
var ed=st.copy();
ed.setTime(st.getTime()+(this.i_drag_duration * 60000));
if (ed.valueOf() < this.eventObject().startTime().valueOf()) {
ed=this.eventObject().startTime().copy();
}
if(!is_allway) {
var duration=(ed.getTime() - this.eventObject().startTime().getTime()) / 60000;
var time_change=Math.ceil(time_offset) * increment - duration;
if(time_change <=(increment / 2)) {
ed.setTime(ed.getTime()+(time_change * 60000));
} else {
time_change=Math.floor(time_offset) * increment - duration;
ed.setTime(ed.getTime()+(time_change * 60000));
}
}
if (this.eventObject().endTime().valueOf()!=ed.valueOf() || this.i_drag_duration==0) {
this.eventObject().endTime(ed);
this.eventObject().save(true);
this.toolTip().tip(this.tipText());
}
}
}
BlockViewEvent.prototype.styleEvent=function() {
if (this.i_event_obj!=undefined) {
var ev=this.eventObject();
if (ev!=undefined) {
var color=ev.colorClass();
if (color==undefined) {
color=CalendarColorClass.getColorById(ev.parentDataModel().color());	
}
this.i_event_title.style.backgroundColor=color.border();
this.i_event_data.style.color=color.description();
this.i_event_title.style.color=color.title();
this.i_event_obj2.style.borderColor=color.border();
this.i_event_obj2.style.backgroundColor=color.background();
this.i_event_obj.style.borderColor=color.border();
this.i_event_resize.style.color=color.border();
if (this.i_event_data_edit!=undefined) {
this.i_event_data_edit.style.border="1px solid "+color.border();
}
if (this.i_drag_event!=undefined) {
this.i_drag_event_title.style.backgroundColor=color.border();
this.i_drag_event_data.style.color=color.description();
this.i_drag_event_title.style.color=color.title();
this.i_drag_event_obj1.style.borderColor=color.border();
this.i_drag_event_obj2.style.borderColor=color.border();
this.i_drag_event_obj2.style.backgroundColor=color.background();
this.i_drag_event.style.borderColor=color.border();
}
}
}
}
BlockViewEvent.prototype.getDragEvent=function(width) {
if (this.i_drag_event==undefined) {
this.i_drag_event=document.createElement('DIV');
this.i_drag_event.className="BlockViewEvent_event_drag";
this.i_drag_event.style.height=this.height()+"px";
this.i_drag_event_obj1=document.createElement("DIV");
this.i_drag_event_obj1.className="BlockViewEvent_event";
this.i_drag_event_obj1.style.height=this.height()+"px";
this.i_drag_event.appendChild(this.i_drag_event_obj1);
this.i_drag_event_obj2=document.createElement('DIV');
this.i_drag_event_obj2.className="BlockViewEvent_corner";
this.i_drag_event_obj2.style.height=(this.height() - 2)+"px";
this.i_drag_event_obj1.appendChild(this.i_drag_event_obj2);
this.i_drag_event_title=document.createElement('DIV');
this.i_drag_event_title.className="BlockViewEvent_title";
this.i_drag_event_title.style.height=BlockViewEvent.titleHeight+"px";
this.i_drag_event_title.style.lineHeight=BlockViewEvent.titleHeight+"px";
this.i_drag_event_title.innerHTML=this.timeTitle();
this.i_drag_event_obj2.appendChild(this.i_drag_event_title);
this.i_drag_event_data=document.createElement('DIV');
this.i_drag_event_data.className="BlockViewEvent_data";
var iheight=(this.height() - BlockViewEvent.titleHeight);
if (iheight <=0) {
iheight=1;
}
this.i_drag_event_data.style.height=iheight+"px";
if (this.eventObject()!=undefined) {
this.i_drag_event_data.innerHTML=htmlEncode(this.eventObject().param("title"));
}
this.i_drag_event_obj2.appendChild(this.i_drag_event_data);
this.styleEvent();
}
if(width!=undefined) {
this.i_drag_event.style.width=width+"px";
this.i_drag_event_obj1.style.width=(width - 2)+"px";
this.i_drag_event_obj2.style.width=width+"px";
this.i_drag_event_title.style.width=(width - 2)+"px";
this.i_drag_event_data.style.width=(width - 2)+"px";
}
return this.i_drag_event;
}
BlockViewEvent.prototype.handleMouseDown=function(e) {
if (this.eventObject().parentDataModel().access!=undefined && 
this.eventObject().meetingRequestState!=undefined && 
(this.eventObject().meetingRequestState()!=0 || this.eventObject().parentDataModel().access()!="All")) {
return true;
}
if (this.i_ml!=undefined) {
return true;
}
if (this.editMode()) {
return true;
}
this.i_l_m=EventHandler.register(document.body, "onmousemove", this.handleMouseMove, this);
this.i_l_u=EventHandler.register(document.body, "onmouseup", this.handleMouseUp, this);
this.i_start_x=CursorMonitor.getX();
this.i_start_y=CursorMonitor.getY();
this.i_in_drag=false;
this.i_parent.i_event_being_dragged=this;
this.i_ev_left=0;
this.i_ev_top=0;
var me=this.i_event_obj;
while (me!=null) {
this.i_ev_left+=parseInt(me.offsetLeft);
this.i_ev_top+=parseInt(me.offsetTop)
me=me.offsetParent;
}
this.i_ev_top-=parseInt(this.parent().i_display_content.scrollTop);
this.i_view_left=0;
this.i_view_top=0;
var i_view=this.parent().i_display_grid;
while (i_view!=null) {
this.i_view_left+=parseInt(i_view.offsetLeft);
this.i_view_top+=parseInt(i_view.offsetTop);
i_view=i_view.offsetParent;
}
this.i_ev_offset_left=(this.i_start_x - this.i_ev_left);
this.i_ev_offset_top=(this.i_start_y - this.i_ev_top);
this.i_ev_row_height=this.parent().leftHeaders(0).rowHeight();
}
BlockViewEvent.prototype.autoScrollUp=function() {
var new_top=parseInt(BlockViewEvent.activeAutoScroll.parent().i_display_content.scrollTop);
new_top-=CalendarBlockView.autoScrollAmount;
if (new_top < 0) {
new_top=0;
}
BlockViewEvent.activeAutoScroll.parent().i_display_content.scrollTop=new_top;
}
BlockViewEvent.prototype.autoScrollDown=function() {
var new_top=parseInt(BlockViewEvent.activeAutoScroll.parent().i_display_content.scrollTop);
new_top+=CalendarBlockView.autoScrollAmount;
if (new_top > BlockViewEvent.activeAutoScroll.parent().contentHeight()) {
new_top=BlockViewEvent.activeAutoScroll.contentHeight() - (BlockViewEvent.activeAutoScroll.parent().height() - BlockViewEvent.activeAutoScroll.parent().headerHeight() - BlockViewEvent.activeAutoScroll.parent().allDayHeight());
}
BlockViewEvent.activeAutoScroll.parent().i_display_content.scrollTop=new_top;
}
BlockViewEvent.prototype.handleMouseMove=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
if (this.i_in_drag==true || this.i_start_x < x - MonthViewEvent.dragThreshold || this.i_start_x > x+MonthViewEvent.dragThreshold || this.i_start_y < y - MonthViewEvent.dragThreshold || this.i_start_y > y+MonthViewEvent.dragThreshold) {
var header_width=this.parent().headerWidth();
if (this.i_in_drag==false) {
document.body.appendChild(this.getDragEvent(this.width()));
this.i_in_drag=true;
}
this.i_drop_lf=x;
this.i_drop_tp=y;
if(this.i_drop_lf >=this.i_view_left && this.i_drop_tp >=this.i_view_top) {
var offset=this.left() - (header_width * Math.floor(this.left()/ header_width))+2;
this.i_drop_lf=(this.i_view_left+(header_width * Math.floor((x - this.i_view_left) / header_width)))+offset;
this.i_drop_tp=(this.i_view_top+(this.i_ev_row_height * Math.floor(((y - this.i_ev_offset_top) - this.i_view_top) / this.i_ev_row_height))) - (parseInt(this.parent().i_display_content.scrollTop) % this.i_ev_row_height);
if (this.i_drop_lf < this.i_view_left+offset) {
this.i_drop_lf=this.i_view_left+offset;
}
if (this.i_drop_lf > (this.i_view_left+(header_width * (this.parent().i_headers.length - 1)))) {
this.i_drop_lf=(this.i_view_left+(header_width * (this.parent().i_headers.length - 1)))+offset;
}
}
this.getDragEvent().style.left=(this.i_drop_lf)+"px"; 
this.getDragEvent().style.top=this.i_drop_tp+"px";
var headers=this.parent().i_headers;
var doScroll=true;
if (headers!=undefined && headers.length > 0) {
for (var i=0; i < headers.length;++i) {
var area=headers[i].getArea();
if (area!=undefined) {
if (this.i_drop_lf >=area.left && this.i_drop_lf <=area.right && this.i_drop_tp >=area.top && this.i_drop_tp <=area.bottom) {
doScroll=false;
break;
}
}
}
}
if (doScroll && y < this.parent().contentTop()) {
if (this.i_auto_scroller==undefined) {
BlockViewEvent.activeAutoScroll=this;
this.i_auto_scroller=setInterval(this.autoScrollUp, 100);
}
}
else if (doScroll && y > this.parent().contentTop()+(this.parent().height() - this.parent().headerHeight() - this.parent().allDayHeight())) {
if (this.i_auto_scroller==undefined) {
BlockViewEvent.activeAutoScroll=this;
this.i_auto_scroller=setInterval(this.autoScrollDown, 100);
}
}
else {
clearInterval(this.i_auto_scroller);
this.i_auto_scroller=undefined;
}
}
}
BlockViewEvent.prototype.handleMouseUp=function(e) {
this.i_l_m.unregister();
this.i_l_u.unregister();
this.i_l_m=undefined;
this.i_l_u=undefined;
this.i_parent.i_event_being_dragged=undefined;
if (this.i_auto_scroller!=undefined) {	
clearTimeout(this.i_auto_scroller);
this.i_auto_scroller=null;
}
if (this.i_in_drag==true) {
var headers=this.parent().i_headers;
var pos=undefined;
var allDayDate=undefined;
var x=CursorMonitor.getX(), y=CursorMonitor.getY();
var minDropHeight=this.i_view_top - this.parent().headerHeight();
if (headers!=undefined && headers.length > 0) {
minDropHeight=headers[0].getArea().top;
for (var i=0; i < headers.length;++i) {
var area=headers[i].getArea();
if (area!=undefined) {
if (x >=area.left && x <=area.right && y >=area.top && y <=area.bottom) {
var target=headers[i].i_display_date;
allDayDate=new Date(target.y, target.m, target.d, 0, 0, 0, 0);
break;
}
}
}
}
var startTime, endTime;
var ev=this.eventObject();
if (pos==undefined) {
pos=this.parent().cursorPosition(true, this.i_drop_lf, this.i_drop_tp, true);
}
if(pos.date==undefined) {
pos.row=-1;
pos.date=Application.getApplicationById(1004).getScheduler().positionDate(this.i_drop_lf, this.i_drop_tp);
}
if (allDayDate) {
startTime=allDayDate;
endTime=addDay(allDayDate);
if (ev.startTime().valueOf()!=startTime.valueOf() || ev.endTime().valueOf()!=endTime.valueOf()) {
ev.parentDataModel().ignoreChange(true);
ev.startTime(startTime, endTime);
ev.allDay(true);
ev.parentDataModel().ignoreChange(false);
ev.save(true);
}
} else if (pos.date!=undefined && (pos.row==-1 || this.i_drop_tp >=minDropHeight)) {
var duration=(ev.endTime().getTime() - ev.startTime().getTime());
startTime=ev.startTime().copy();
startTime.setFullYear(pos.date.getFullYear());
startTime.setMonth(pos.date.getMonth(), pos.date.getDate());
if (pos.row >=0) {
startTime.setHours(pos.date.getHours());
startTime.setMinutes(pos.date.getMinutes());
startTime.setSeconds(pos.date.getSeconds());
}
endTime=new Date();
endTime.setTime(startTime.getTime()+duration);
if (ev.startTime().valueOf()!=startTime.valueOf() || ev.endTime().valueOf()!=endTime.valueOf()) {
ev.parentDataModel().ignoreChange(true);
ev.startTime(startTime, endTime);
ev.parentDataModel().ignoreChange(false);
ev.save(true);
}
}
document.body.removeChild(this.getDragEvent());
}
}
BlockViewEvent.prototype.handleKeyUp=function(e) {
var k=(e.keyCode <=0	? e.which : e.keyCode);
var text=this.i_event_data_edit.value;
if (text.length > 255) this.i_event_data_edit.value=text.substring(0, 255);
if (k==13) { 
var ev=this.eventObject();
if(ev.title().length > 255) {
alert("The event title cannot be longer than 255 characters long.");
} else {
ev.i_in_edit=false;
this.parent().removeTemporaryEvent(this.eventObject());
this.parent().parent().dragCreateEvent(ev);
if (this.i_ede_oku!=undefined) {
this.i_ede_oku.unregister();
this.i_ede_oku=undefined;
}
}
e.cancelBubble=true;
e.returnValue=false;
}
else if (k==27) { 
var ev=this.eventObject();
ev.i_in_edit=false;
this.parent().removeTemporaryEvent(this.eventObject());	
e.cancelBubble=true;
e.returnValue=false;
if (this.i_ede_oku!=undefined) {
this.i_ede_oku.unregister();
this.i_ede_oku=undefined;
}
}
else { 
this.eventObject().title(this.i_event_data_edit.value);
}
return true;
}
BlockViewEvent.prototype.editArea=function() {
if (this.i_event_data_edit==undefined) {
this.i_event_data_edit=document.createElement('TEXTAREA');
this.i_event_data_edit.className="BlockViewEvent_data_edit";
this.i_event_data_edit.style.width=(this.width() - 6)+"px";
var iheight=(this.height() - BlockViewEvent.titleHeight - BlockViewEvent.resizeHeight - 5);
if (iheight < 0) {
iheight=1;
}
this.i_event_data_edit.style.height=iheight+"px";
this.i_event_data_edit.style.display=(this.editMode() ? "" : "none");
this.i_ede_oku=EventHandler.register(this.i_event_data_edit, "onkeyup", this.handleKeyUp, this);
if (this.eventObject()!=undefined) {
this.i_event_data_edit.value=this.eventObject().param("title");
}
}
return this.i_event_data_edit;
}
BlockViewEvent.prototype.handleContextMenu=function(e) {
if (this.eventObject().access()==CalendarEvent.Permission.freebusy) {
e.cancelBubble=true;
e.returnValue=false;
} else if (this.editMode()!=true) {
this.parent().parent().contextMenu(this.eventObject());
e.cancelBubble=true;
e.returnValue=false;
}
}
BlockViewEvent.prototype.handleDblClick=function(e) {
if (this.editMode()!=true) {
this.parent().parent().doubleClickEvent(this.eventObject());
}
}
BlockViewEvent.prototype.toolTip=function() {
if (this.i_tip==undefined) {
if (this.i_event_obj!=undefined) {
this.i_tip=new ToolTip(this.i_event_obj, 200, "");
this.i_tip.elementWidth(this.width());
this.i_tip.elementHeight(this.height());
}
}
return this.i_tip;
}
BlockViewEvent.prototype.handleMouseOver=function(e) {
if (this.i_tip!=undefined) {
this.i_ev_left=0;
this.i_ev_top=0;
var me=this.i_event_obj;
while (me!=null) {
this.i_ev_left+=parseInt(me.offsetLeft);
this.i_ev_top+=parseInt(me.offsetTop)
me=me.offsetParent;
}
this.i_ev_top-=parseInt(this.parent().i_display_content.scrollTop);
this.i_tip.elementLeft(this.i_ev_left);
this.i_tip.elementTop(this.i_ev_top);
}
}
BlockViewEvent.prototype.destroyEvents=function() {
if (this.i_eo_omd!=undefined) {
this.i_eo_omd.unregister();
this.i_eo_omo.unregister();
this.i_eo_ocm.unregister();
this.i_eo_odc.unregister();
this.i_er_omd.unregister();
this.i_eo2_omd.unregister();
this.i_eo_omd=undefined;
this.i_eo_omo=undefined;
this.i_eo_ocm=undefined;
this.i_eo_odc=undefined;
this.i_er_omd=undefined;
this.i_eo2_omd=undefined;
}
if (this.i_ede_oku!=undefined) {
this.i_ede_oku.unregister();
this.i_ede_oku=undefined;
}
if (this.i_l_m!=undefined) {
this.i_l_m.unregister();
this.i_l_u.unregister();
this.i_l_m=undefined;
this.i_l_u=undefined;
}
}
BlockViewEvent.prototype.getEvent=function() {
if (this.i_event_obj==undefined) {
this.i_event_holder=document.createElement('DIV');
this.i_event_holder.className="BlockViewEvent_holder";
this.i_event_obj=document.createElement('DIV');
this.i_event_obj.className="BlockViewEvent_event";
this.i_event_obj.style.width=(this.width() - 2)+"px";
this.i_event_obj.style.height=this.height()+"px";
if(document.all) {
this.i_event_holder.style.top=this.top()+"px";
} else {
this.i_event_obj.style.top=this.top()+"px";
}
this.i_event_obj.style.display=(this.visible() ? "" : "none");
this.i_event_obj.style.left=(this.left()+1)+"px";
this.i_eo_omd=EventHandler.register(this.i_event_obj, "onmousedown", this.handleMouseDown, this);
this.i_eo_omo=EventHandler.register(this.i_event_obj, "onmouseover", this.handleMouseOver, this);
this.i_eo_ocm=EventHandler.register(this.i_event_obj, "oncontextmenu", this.handleContextMenu, this);
this.i_eo_odc=EventHandler.register(this.i_event_obj, "ondblclick", this.handleDblClick, this);
this.i_event_holder.appendChild(this.i_event_obj);
this.toolTip().tip(this.tipText());
this.i_event_obj2=document.createElement('DIV');
this.i_event_obj2.className="BlockViewEvent_corner";
this.i_event_obj2.style.overflow="hidden";
this.i_event_obj2.style.width=this.width()+"px";
this.i_event_obj2.style.height=(this.height() - 2)+"px";
this.i_eo2_omd=EventHandler.register(this.i_event_obj2, "onmouseover", this.handleMouseOver, this);
this.i_event_obj.appendChild(this.i_event_obj2);
this.i_event_resize=document.createElement('DIV');
this.i_event_resize.className="BlockViewEvent_resize";
this.i_event_resize.style.width=(this.width() - 2)+"px";
this.i_event_resize.style.height=BlockViewEvent.resizeHeight+"px";
this.i_event_resize.style.display=(this.allowResize() ? "" : "none");
this.i_event_resize.style.lineHeight=(document.all ? 3 : 2)+"px";
this.i_event_resize.style.marginTop=((this.height() - BlockViewEvent.resizeHeight) - 2)+"px";
this.i_event_resize.innerHTML=". . .";
this.i_er_omd=EventHandler.register(this.i_event_resize, "onmousedown", this.handleResizeStart, this);
this.i_event_obj2.appendChild(this.i_event_resize);
this.i_event_title=document.createElement('DIV');
this.i_event_title.className="BlockViewEvent_title";
this.i_event_title.style.width=(this.width() - 2)+"px";
this.i_event_title.style.height=BlockViewEvent.titleHeight+"px";
this.i_event_title.style.lineHeight=BlockViewEvent.titleHeight+"px";
this.i_event_title.innerHTML=this.timeTitle();
this.i_event_obj2.appendChild(this.i_event_title);
if (this.editMode()) {
this.i_event_obj2.appendChild(this.editArea());
}
this.i_event_data=document.createElement('DIV');
this.i_event_data.className="BlockViewEvent_data";
this.i_event_data.style.width=(this.width() - 2)+"px";
this.i_event_data.style.height=(this.height() - BlockViewEvent.titleHeight - BlockViewEvent.resizeHeight)+"px";
this.i_event_data.style.display=(this.editMode() ? "none" : "");
if (this.eventObject()!=undefined) {
var ev=this.eventObject();
var mrs=ev.meetingRequestState();
var prefix=((mrs!=2 && mrs!=0) ? "<b>" : "");
var suffix=((mrs!=2 && mrs!=0) ? "</b>" : "");
this.i_event_data.innerHTML=prefix+(ev.displayBody()!=undefined ? ev.displayBody() : htmlEncode(ev.param("title")))+suffix;
}
this.i_event_obj2.appendChild(this.i_event_data);
this.styleEvent();
}
return this.i_event_holder;
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.CalendarView.js");
function CalendarScheduler(app, width, height) {
this.i_application=app;
this.i_width=width;
this.i_height=height;
}
CalendarScheduler.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_tab_schedule!=undefined) {
this.i_tab_schedule.width(width);
this.i_dc.style.width=(width - 12)+"px";
this.i_sc.style.width=(width - 12)+"px";
this.i_cal1.width(this.i_tab_schedule.contentWidth() - 3);
this.i_cal2.width(this.i_tab_schedule.contentWidth() - 3);
this.i_shares.width(width - 12)+"px";
}
}
return this.i_width;
}	
CalendarScheduler.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_tab_schedule!=undefined) {
this.i_tab_schedule.height(height);
this.i_dc.style.height=height - 33+"px";
this.i_sc.style.height=height - 33+"px";
var dheight=Math.floor((this.i_tab_schedule.contentHeight() - 3) / 2);
if (dheight > this.width()) {
dheight=this.width();
}
this.i_cal1.height(dheight); 
this.i_cal2.height(dheight); 
this.i_shares.height(height - 33);
}
}
return this.i_height;
}
CalendarScheduler.prototype.application=function(app) {
if (app!=undefined) {
this.i_application=app;
}
return this.i_application;
}
CalendarScheduler.prototype.handleSelectChange=function(e) {
var src=e.calendar;
var c=(src==this.i_cal1 ? this.i_cal2 : this.i_cal1);
var nd=src.date().copy(true);
c.date(nd);
var nd3=src.date().copy(true);
if (e.userAction==true) {
this.application().getCalendarView().getCalendarView().focusDate(nd3);
this.application().getCalendarView().getCalendarView().viewTypes(2).active(true);
}
var nd2=src.date().copy(true);
this.application().getCalendarView().getCalendarView().selectedDate(nd2);
this.markerVisibiltySync();
}
CalendarScheduler.prototype.handleCal1LastMonth=function(e) {
this.i_cal2.showLastMonth();
this.handleMonthChange();
}
CalendarScheduler.prototype.handleCal1NextMonth=function(e) {
this.i_cal2.showNextMonth();
this.handleMonthChange();
}
CalendarScheduler.prototype.handleCal2LastMonth=function(e) {
this.i_cal1.showLastMonth();
this.handleMonthChange();
}
CalendarScheduler.prototype.handleCal2NextMonth=function(e) {
this.i_cal1.showNextMonth();
this.handleMonthChange();
}
CalendarScheduler.prototype.handleMonthChange=function(e) {
var cal1Year=this.i_cal1.activeYear();
var cal1Month=this.i_cal1.activeMonth();
var cal2Year=this.i_cal2.activeYear();
var cal2Month=this.i_cal2.activeMonth();
if (this.i_highlight_month==cal1Month && this.i_highlight_year==cal1Year) {
this.i_cal1.highlightPeriod(this.i_highlight_period, this.i_highlight_y, this.i_highlight_x);
this.i_highlighted_minical=this.i_cal1;
} else if (this.i_highlight_month==cal2Month && this.i_highlight_year==cal2Year) {
this.i_cal2.highlightPeriod(this.i_highlight_period, this.i_highlight_y, this.i_highlight_x);
this.i_highlighted_minical=this.i_cal2;
}
this.markerVisibiltySync();
}
CalendarScheduler.prototype.markerVisibiltySync=function() {
var c1=this.i_cal1, c2=this.i_cal2;
if (c1.date()==undefined && c2.date()!=undefined) c1.date(c2.date());
if (c2.date()==undefined && c1.date()!=undefined) c2.date(c1.date());
var date_today=c1.date();
date_today.setHours(0, 0, 0, 0);
var c1_first=new Date(c1.i_days[0][0].i_year, c1.i_days[0][0].i_month, c1.i_days[0][0].i_date);
var c1_last=new Date(c1.i_days[5][6].i_year, c1.i_days[5][6].i_month, c1.i_days[5][6].i_date);
var c2_first=new Date(c2.i_days[0][0].i_year, c2.i_days[0][0].i_month, c2.i_days[0][0].i_date);
var c2_last=new Date(c2.i_days[5][6].i_year, c2.i_days[5][6].i_month, c2.i_days[5][6].i_date);
if ((c1_first <=date_today && date_today <=c1_last) && (c2_first <=date_today && date_today <=c2_last)) {
if (c1.activeMonth()==date_today.getMonth()) {
c1.markerVisible(true);
c2.markerVisible(false);
} else {
c1.markerVisible(false);
c2.markerVisible(true);
}
} else {   
c1.markerVisible(true);
c2.markerVisible(true);
}
}
CalendarScheduler.prototype.handleCalendarSelect=function(e) {
var sl=new Date();
var nd1=sl.copy(true);
var nd2=sl.copy(true);
if(! ((this.i_cal1.activeDate().getMonth()==nd2.getMonth() && 
this.i_cal1.activeDate().getFullYear()==nd2.getFullYear()) || 
(this.i_cal2.activeDate().getMonth()==nd2.getMonth() && 
this.i_cal2.activeDate().getFullYear()==nd2.getFullYear()))) {
this.i_cal1.activeDate(nd2);
}
this.i_cal1.date(nd1);
}
CalendarScheduler.prototype.handleStartChange=function(e) {
this.i_cal1.startingDay(e.calendar.startingDay());
this.i_cal2.startingDay(e.calendar.startingDay());
}
CalendarScheduler.prototype.handleClickMonth=function(e) {
var goToDate=new Date(e.calendar.activeYear(), e.calendar.activeMonth(), 1);
var display=this.application().getCalendarView();
display.getCalendarView().focusDate(goToDate);
display.getCalendarView().activeView(display.i_monthly);
}
CalendarScheduler.prototype.quickCalendars=function() {
if (this.i_cals==undefined) {
this.i_cals=document.createElement('DIV');
this.i_cal1=new MiniCalendar(this.i_tab_schedule.contentWidth(), 100);
EventHandler.register(this.i_cal1, "onclicklastmonth", this.handleCal1LastMonth, this);
EventHandler.register(this.i_cal1, "onclicknextmonth", this.handleCal1NextMonth, this);
EventHandler.register(this.i_cal1, "onclickmonth", this.handleClickMonth, this);
EventHandler.register(this.i_cal1, "onclickday", this.handleClickDay, this);
this.i_cals.appendChild(this.i_cal1.getSelector());
this.i_cal2=new MiniCalendar(this.i_tab_schedule.contentWidth(), 100);
this.i_cal2.showNextMonth();
EventHandler.register(this.i_cal2, "onclicklastmonth", this.handleCal2LastMonth, this);
EventHandler.register(this.i_cal2, "onclicknextmonth", this.handleCal2NextMonth, this);
EventHandler.register(this.i_cal2, "onclickmonth", this.handleClickMonth, this);
EventHandler.register(this.i_cal2, "onclickday", this.handleClickDay, this);
this.i_cals.appendChild(this.i_cal2.getSelector());
this.markerVisibiltySync();
}
return this.i_cals;
}
CalendarScheduler.prototype.handleChangeActive=function(e) {
this.application().getCalendarView().getCalendarView().activeDataModel(e.calendar);
this.application().i_win_calendar.titleBar().name(e.calendar.name());
}
CalendarScheduler.prototype.handleShareLoad=function(e) {
var s=this.application().param("calendar_list");
if (s!=undefined && s.splice!=undefined) {
s=s[0];
}
this.i_shares.stateString(s);
EventHandler.register(this.i_shares, "onchange", this.handleShareChange, this);
}
CalendarScheduler.prototype.handleShareChange=function(e) {
var s=this.i_shares.stateString();
this.application().param("calendar_list", s);
}
CalendarScheduler.prototype.sharedCalendars=function() {
if (this.i_share_list==undefined) {
this.i_share_list=document.createElement('DIV');
this.i_shares=new CalendarList(100, 100);
EventHandler.register(this.i_shares, "onchangeactive", this.handleChangeActive, this);
EventHandler.register(this.i_shares, "onload", this.handleShareLoad, this);
this.i_shares.i_parent=this;
var cldm=this.application().getCalendarListDataModel();
this.i_shares.dataModel(cldm);
this.i_share_list.appendChild(this.i_shares.getList());
}
return this.i_share_list;
}
CalendarScheduler.prototype.updateMiniCalendar=function(e) {
this.i_cal1.clearHighlight();
this.i_cal2.clearHighlight();
var thisDate;
thisDate=e.view.focusDate();
var thisMonth=thisDate.getMonth();
var thisYear=thisDate.getFullYear();
if (this.i_cal1.activeMonth()==thisMonth && this.i_cal1.activeYear()==thisYear) {
this.i_highlighted_minical=this.i_cal1;
} else if (this.i_cal2.activeMonth()==thisMonth && this.i_cal2.activeYear()==thisYear) {
this.i_highlighted_minical=this.i_cal2;
} else {
this.i_highlighted_minical=this.i_cal1;
var cal2Month;
var cal2Year;
if (thisMonth==11) {
cal2Month=0;
cal2Year=thisYear+1;
} else {
cal2Month=thisMonth+1;
cal2Year=thisYear;
}
this.i_cal1.setMonthYear(thisMonth, thisYear);
this.i_cal2.setMonthYear(cal2Month, cal2Year);
}
this.markerVisibiltySync();
switch(e.view_type)
{
case 'm':   
this.i_highlighted_minical.setMonthHighlight(true);
break;
case 'w':   
this.i_highlighted_minical.highlightWeekStarting(e.view.viewStart());
break;
case 'd':   
this.i_highlighted_minical.highlightThisDay(e.view.viewStart());
break;
}   
this.i_highlight_month=thisMonth;
this.i_highlight_year=thisYear;
this.i_highlight_period=e.view_type;
this.i_highlight_y=this.i_highlighted_minical.i_highlight_y;
this.i_highlight_x=this.i_highlighted_minical.i_highlight_x;
}
CalendarScheduler.prototype.handleClickDay=function(e) {
var switch_to_day_view=false;
if (e.minical==this.i_highlighted_minical) {
switch(this.i_highlighted_minical.i_highlight_period)
{
case 'm':
var highlighted_rows=this.i_highlighted_minical.i_highlight_y;   
if (highlighted_rows[0] <=e.clicked_pos_y &&
e.clicked_pos_y <=highlighted_rows[highlighted_rows.length - 1]) {
switch_to_day_view=true;
}
break;
case 'w':
if (e.clicked_pos_y==this.i_highlighted_minical.i_highlight_y) {
switch_to_day_view=true;
}
break;
default:
switch_to_day_view=true;
}
}
if (this.onminicalclick!=undefined) {
var o=new Object();
o.type='minicalclick';
o.date_clicked=e.date_clicked;
o.switch_to_day_view=switch_to_day_view;
this.onminicalclick(o);
}
}
CalendarScheduler.prototype.getScheduler=function() {
if (this.i_tab_schedule==undefined) {
this.i_tab_schedule=new TabbedPane(this.width(),this.height(), 0, "No Item Selected");
this.i_quick=this.i_tab_schedule.addTab(new TabbedPaneTab("Schedule", undefined, "", false));
this.i_shared=this.i_tab_schedule.addTab(new TabbedPaneTab("Shared", undefined, "", false));
this.i_dc=document.createElement('DIV');
this.i_dc.style.border="1px solid #a3a3a3";
this.i_dc.style.backgroundColor="#FFFFFF";
this.i_dc.appendChild(this.quickCalendars());
this.i_sc=document.createElement('DIV');
this.i_sc.style.border="1px solid #a3a3a3";
this.i_sc.style.backgroundColor="#FFFFFF";
this.i_sc.appendChild(this.sharedCalendars());
this.i_quick.contentPane(this.i_dc);
this.i_shared.contentPane(this.i_sc);
this.i_quick.active(true);
}
return this.i_tab_schedule.getPane();
}
CalendarScheduler.prototype.positionDate=function(x, y) {
var ret=undefined;
if(this.i_cal1!=undefined) {
ret=this.i_cal1.positionDate(x, y);
}
if(ret==undefined && this.i_cal2!=undefined) {
ret=this.i_cal2.positionDate(x, y);
}
return ret;
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.Scheduler.js");
function CalendarList(width, height) {
this.i_width=width;
this.i_height=height;
this.i_active=null;
this.i_calendars=Array();
this.i_dms=Array();
}
CalendarList.prototype.onchangeactive=null;
CalendarList.prototype.onchange=null;
CalendarList.prototype.onload=null;
CalendarList.prototype.parent=function() {
return this.i_parent;
}
CalendarList.prototype.calendarView=function() {
if (this.parent()==undefined || this.parent().application()==undefined) {
return undefined;
}
return this.parent().application().getCalendarView().getCalendarView();
}
CalendarList.prototype.calendars=function(index) {
if (index!=undefined) {
return this.i_dm.items(index);
}
return this.i_dm.items();
}
CalendarList.prototype.addCalendar=function(calendar, beforeCalendar) {
var append=true;
if (beforeCalendar!=undefined) {
for (var x=0; x < this.i_calendars.length; x++) {
if (this.i_calendars[x]==beforeCalendar) {
this.i_calendars.splice(x, 0, calendar);
if (this.i_list!=undefined) {
this.i_list.insertBefore(calendar.getItem(), beforeCalendar.getItem());
}
append=false;
break;
}
}
}
var item=null;
if (append) {
this.i_calendars[this.i_calendars.length]=calendar;
if (this.i_list!=undefined) {
this.i_list.appendChild(calendar.getItem());
}
}
calendar.i_parent=this;
this.updateWidth();
return calendar;
}
CalendarList.prototype.active=function(cal) {
if (cal!=undefined) {
this.i_active=cal;
for (var x=0; x < this.i_calendars.length; x++) {
if (this.i_calendars[x]!=cal) {
this.i_calendars[x].active(false);
}
}
if (this.onchangeactive!=undefined) {
var o=new Object();
o.type="changeactive";
o.list=this;
o.calendar=cal.calendar();
this.onchangeactive(o);
}
}
return this.i_active;
}
CalendarList.prototype.removeCalendar=function(calendar) {
for (var x=0; x < this.i_calendars.length; x++) {
if (this.i_calendars[x]==calendar) {
this.i_calendars.splice(x, 1);
if (this.i_list!=undefined) {
this.i_list.removeChild(calendar.getItem());
}
this.updateWidth();
return true;
}
}
return false;
}
CalendarList.prototype.showSelectedCalendars=function() {
var found_it=false;
var need_refresh=false;
var calendar_dms=this.calendarView().dataModels();
var i=0;
var j=0;
var add_models=[];
var tasks_app=Application.getApplicationById(1015);
if (tasks_app!=undefined) {
var tasks_dm=tasks_app.getTaskDataModel();
while (i < calendar_dms.length && !found_it) {
if (calendar_dms[i]==tasks_dm) {
found_it=true;
}++i;
}
if (!found_it) {
add_models.push(tasks_dm);
}
}
var calendar_list_items=this.i_calendars;
for (var i=0; i < calendar_list_items.length;++i) {
found_it=false;
j=0;
while (j < calendar_dms.length && !found_it) {
if (calendar_dms[j]==calendar_list_items[i].calendar()) {
found_it=true;
}++j;
}
if (calendar_list_items[i].isSelected() && !found_it) {   
add_models.push(calendar_list_items[i].calendar());
need_refresh=true;
} else if (!calendar_list_items[i].isSelected() && found_it) {   
this.calendarView().removeDataModel(calendar_list_items[i].calendar());
}
}
this.calendarView().addDataModels(add_models);
}
CalendarList.prototype.showOneCalendar=function(calendar_dm) {
var needs_to_be_added=true;
var calendar_dms=this.calendarView().dataModels();
for (var i=0; i < calendar_dms.length;++i) {
if (calendar_dms[i]==calendar_dm) {
needs_to_be_added=false;   
} else {
this.calendarView().removeDataModel(calendar_dms[i]);
--i;
}
}
if (needs_to_be_added) {
this.calendarView().addDataModel(calendar_dm);
this.calendarView().focusDate(this.calendarView().focusDate(), true);
}
}
CalendarList.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_list!=undefined) {
this.i_list.style.width=width+"px";
}	
this.updateWidth();
}
return this.i_width;
}
CalendarList.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_list!=undefined) {
this.i_list.style.height=height+"px";
}
this.updateWidth();
}
return this.i_height;
}
CalendarList.prototype.updateWidth=function() {
var w=this.width();
var content_height=(CalendarListItem.defaultHeight * this.i_calendars.length);
if (content_height > this.height()) {
w-=scrollBarWidth();
}
for (var x=0; x < this.i_calendars.length; x++) {
this.i_calendars[x].width(w);
}
}
CalendarList.prototype.refreshCalendarColors=function(e) {
if (this.i_picker!=undefined && CalendarColorClass.i_colors!=undefined) {
this.i_picker_pallet.clearColors();
for (var x=0; x < CalendarColorClass.i_colors.length; x++) {
if (CalendarColorClass.i_colors[x].background!=undefined) {
this.i_picker_pallet.addColor(CalendarColorClass.i_colors[x]);
}
}
}
}
CalendarList.prototype.handleColorResize=function(e) {
if (this.i_picker.effectiveWidth()!=undefined) {
this.i_picker_pallet.width(this.i_picker.effectiveWidth() - 2);
}
if (this.i_picker.effectiveHeight()!=undefined) {
this.i_picker_pallet.height(this.i_picker.effectiveHeight() - this.i_picker.titleBar().height() - 3);
}
}
CalendarList.prototype.getColorPallet=function() {
if (this.i_picker_pallet==undefined) {
this.i_picker_pallet=new ColorPallet(100, 100, 32);
}
return this.i_picker_pallet;
}
CalendarList.prototype.getColorPicker=function() {
if (this.i_picker==undefined) {
this.i_picker=new WindowObject('cal-color', "Calendar Color Picker", 200, 200, Application.titleBarFactory());
this.i_picker.temporary(true);
this.i_picker.titleBar().removeButton(Application.i_title_dock);
this.i_picker.loadContent(this.getColorPallet().getPallet());
this.refreshCalendarColors({'type':'changecolors'});
EventHandler.register(CalendarColorClass, "onchangecolors", this.refreshCalendarColors, this);
EventHandler.register(this.i_picker, "oncontentresize", this.handleColorResize, this);
}
return this.i_picker;
}
CalendarList.prototype.getList=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.className="CalendarList";
this.i_list.style.width=this.width()+"px";
this.i_list.style.height=this.height()+"px";
this.refreshList();
this.updateWidth();
}
return this.i_list;
}
CalendarList.prototype.dataModel=function(dm) {
if(dm!=undefined) {
this.i_dm=dm;
EventHandler.register(this.i_dm, "onrefresh", this.handleDataRefresh, this);
}
return this.i_dm;
}
CalendarList.prototype.handleDataRefresh=function(e) {		
this.refreshList();
}
CalendarList.prototype.stateString=function(str) {
if (str!=undefined) {
var cals=str.split(",");
for (var x=0; x < cals.length; x++) {
var cal_data=cals[x].split(":");
for (var z=0; z <this.i_calendars.length; z++) {
if (parseInt(this.i_calendars[z].calendar().id())==parseInt(cal_data[0])) {
this.i_calendars[z].isSelected((cal_data[1]=="1" ? true : false));
this.i_calendars[z].calendar().color(cal_data[2]);
}
}
}
}
var r_str="";
for (var x=0; x < this.i_calendars.length; x++) {
r_str+=(r_str=="" ? "" : ",")+this.i_calendars[x].calendar().id()+":"+(this.i_calendars[x].isSelected() ? "1" : "0")+":"+this.i_calendars[x].calendar().color();
}
return r_str;
}
CalendarList.prototype.refreshList=function() {
if(this.calendars().length > 2) {
this.sortCalendars(this.calendars());
}
var cals=this.i_dm.getItems(0, this.i_dm.entries(), "ownerDisplayName");
var lastActive=0;
var sels=Array();
for (var x=this.i_calendars.length - 1; x>=0; x--) {
if (this.i_calendars[x].active()) {
lastActive=this.i_calendars[x].calendar().id();
}
if (this.i_calendars[x].isSelected()) {
sels[sels.length]=this.i_calendars[x].calendar();
}
this.removeCalendar(this.i_calendars[x]);
}
for(var x=0; x < cals.length(); x++) {
var cal=cals.getItem(x);
var i=new CalendarListItem(cal.calendar());
if (cal.calendar().isDefault()) {
i.locked(true);
}
i.i_orig_cal=cal;
this.addCalendar(i);
if (cal.calendar().id()==lastActive) {
i.active(true);
this.active(i);
}
for (var z=0; z < sels.length; z++) {
if (sels[z].id()==cal.calendar().id()) {
sels.splice(z, 1);
i.isSelected(true, true);
break;
}
}
}		
for (var x=0; x < sels.length; x++) {
this.parent().calendarView().removeDataModel(sels[x]);
}
if (this.i_calendars[0]!=undefined) {
var def=this.i_calendars[0];
for (var x=0; x < this.i_calendars.length; x++) {
if (this.i_calendars[x].calendar().isDefault()==true) {
def=this.i_calendars[x];
break;
}
}
def.active(true);
if (this.i_init!=true) {
this.i_init=true;
this.calendarView().addDataModel(def.calendar());
}
}
if (this.i_dm.i_init==true) {
if (this.i_init_list!=true) {
this.i_init_list=true;
if (this.onload!=undefined) {
var o=new Object();
o.type="load";
o.list=this;
this.onload(o);
}
}
}
this.showSelectedCalendars();
}
CalendarList.prototype.sortCalendars=function(list) {
var copy_array=Array();
for(var j=1; j < list.length; j++) {
if(list[j] && list[j].calendar) {
copy_array[copy_array.length]=list[j];
}
}
var sort_array=Array();
for(var j=0; j < copy_array.length; j++) {
sort_array[sort_array.length]=copy_array[j].calendar().name();
}
sort_array.sort();
for(var j=0; j < sort_array.length; j++) {
var found=false;
var sorter_offset=j+1;
var copy_index=0;
while (!found) {
if (sort_array[j]==copy_array[copy_index].calendar().name()) {
list[sorter_offset]=copy_array[copy_index];
found=true;
} else {
copy_index++;
}
}
}
}
function CalendarListItem(calendar, sel, locked, active) {
this.superDataModelNode("CLI"+calendar.id());
this.i_selected=(sel!=undefined ? sel : false);
this.i_locked=(locked!=undefined ? locked : false);
this.i_active=(active!=undefined ? active : false);
this.i_height=CalendarListItem.defaultHeight;
this.i_width=100;
this.i_hover=false;
this.calendar(calendar);
}
CalendarListItem.defaultHeight=20;
CalendarListItem.checkboxWidth=20;
CalendarListItem.colorPadding=1;
CalendarListItem.deleteWidth=20;
CalendarListItem.prototype.parent=function() {
return this.i_parent;
}
CalendarListItem.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_item!=undefined) {
this.i_item.style.width=this.width()+"px";
this.i_item_title.style.width=(this.width() - (CalendarListItem.checkboxWidth+CalendarListItem.deleteWidth+this.height()))+"px";
}
}
return this.i_width;
}
CalendarListItem.accessname=Array();
CalendarListItem.accessname["All"]="Full";
CalendarListItem.accessname["FullRead"]="Read";
CalendarListItem.accessname["Read"]="Free Busy";
CalendarListItem.prototype.toolTip=function() {
if (this.i_tip==undefined) {
if (this.calendar().ownerId()==user_prefs['user_id']) {
this.i_tip=new ToolTip(this.i_item_title, 200, "My Calendar");
} else if (this.calendar()!=undefined && this.calendar().name()!=undefined) {
this.i_tip=new ToolTip(this.i_item_title, 200, 
htmlEncode(this.calendar().ownerName())+"'s Calendar"+" ("+CalendarListItem.accessname[this.calendar().access()]+" Access)");
}
}
return this.i_tip;
}
CalendarListItem.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_item!=undefined) {
this.i_item.style.height=this.height()+"px";
this.i_item_check.style.height=this.height()+"px";
this.i_item_title.style.height=this.height()+"px";
this.i_item_color.style.width=this.height()+"px";
this.i_item_color.style.height=this.height()+"px";
this.i_color_box.style.width=(this.height() - (CalendarListItem.colorPadding * 2))+"px";
this.i_color_box.style.height=(this.height() - (CalendarListItem.colorPadding * 2))+"px";
this.i_item_delete.style.height=this.height()+"px";
this.i_item_title.style.width=(this.width() - (CalendarListItem.checkboxWidth+CalendarListItem.deleteWidth+this.height()))+"px";
this.i_item_title.style.lineHeight=this.height()+"px";
}
}
return this.i_height;
}
CalendarListItem.prototype.handleCalendarColorChange=function(e) {
if (this.i_item!=undefined) {
var color=CalendarColorClass.getColorById(this.calendar().color());
this.i_color_box.style.backgroundColor=color.background();
this.i_color_box.style.borderColor=color.border();
}
}
CalendarListItem.prototype.calendar=function(calendar) {
if (calendar!=undefined) {
if (this.i_calendar!=undefined && this.i_calendar.i_ls_c!=undefined) {
this.i_calendar.i_ls_c.unregister();
this.i_calendar.i_ls_c=null;
}
this.i_calendar=calendar;
calendar.i_ls_c=EventHandler.register(this.i_calendar, "onchangecolor", this.handleCalendarColorChange, this);
if (this.i_item!=undefined) {
this.i_item_title.innerHTML=htmlEncode(this.calendar().name());
var color=CalendarColorClass.getColorById(this.calendar().color());
this.i_color_box.style.backgroundColor=color.background();
this.i_color_box.style.borderColor=color.border();
this.i_item_delete.style.display=(this.calendar().ownerId()==user_prefs['user_id'] ? "none" : "");
}
}
return this.i_calendar;
}
CalendarListItem.prototype.active=function(state) {
if (state!=undefined) {
this.i_active=state;
if (state) {
this.parent().active(this);
}
if (this.i_item!=undefined) {
this.i_item.className="CalendarListItem"+(this.active() ? "_active" : "")+(this.hoverState() ? "_hover" : "");
}
}
return this.i_active;
}
CalendarListItem.prototype.handleClick=function(e) {
var handle_tasks=false;
var tasks_app=Application.getApplicationById(1015);
if (tasks_app!=undefined) {
handle_tasks=true;
}
if (this.calendar().isDefault()) {
this.parent().showSelectedCalendars();
if (handle_tasks) {
if (tasks_app.i_generic_new_task!=undefined) {
tasks_app.i_generic_new_task.enabled(true);
}
if (tasks_app.i_newtask_btn!=undefined) {
tasks_app.i_newtask_btn.enabled(true);
}
}
} else {
this.parent().showOneCalendar(this.calendar());
if (handle_tasks) {
if (tasks_app.i_generic_new_task!=undefined) {
tasks_app.i_generic_new_task.enabled(false);
}
if (tasks_app.i_newtask_btn!=undefined) {
tasks_app.i_newtask_btn.enabled(false);
}
}
}
this.active(true);
}
CalendarListItem.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover=state;
if (this.i_item!=undefined) {
this.i_item.className="CalendarListItem"+(this.active() ? "_active" : "")+(this.hoverState() ? "_hover" : "");
}
}
return this.i_hover;
}
CalendarListItem.prototype.isSelected=function(state) {
if (state!=undefined) {
if (this.locked()==false || state==true) { 
if (this.i_selected!=state) {
this.i_selected=state;
if (this.i_item_input!=undefined) {
this.i_item_input.defaultChecked=state;
this.i_item_input.checked=state;
if (this.parent().onchange!=undefined) {
var o=new Object();
o.type="change";
o.item=this;
o.list=this.parent();
this.parent().onchange(o);
}
}
}
}
}
return this.i_selected;
}
CalendarListItem.prototype.locked=function(locked) {
if (locked!=undefined) {
this.i_locked=locked;
if (locked==true) 
this.isSelected(true);
}
return this.i_locked;
}
CalendarListItem.prototype.handleToggleCalendar=function(e) {
if (this.i_item_input.checked==true) {
if (this.isSelected()==false) {
this.isSelected(true);
}
}
else {
if (this.isSelected()==true) {
this.isSelected(false);
}
}
if (this.parent().active().calendar().isDefault()) {
this.parent().showSelectedCalendars();
}
}
CalendarListItem.prototype.handleMouseOver=function(e) {
this.hoverState(true);
}
CalendarListItem.prototype.handleMouseOut=function(e) {
this.hoverState(false);
}
CalendarListItem.prototype.handleColorSelect=function(e) {
this.parent().getColorPicker().close();
if (e.color!=undefined) {
this.calendar().color(e.color.id());
}
if (this.parent().onchange!=undefined) {
var o=new Object();
o.type="change";
o.item=this;
o.list=this.parent();
this.parent().onchange(o);
}
}
CalendarListItem.prototype.handleColorPicker=function(e) {
if (this.parent().i_pl_s!=undefined) {
this.parent().i_pl_s.unregister();
this.parent().i_pl_s=null;
}
var p=this.parent().getColorPicker();
this.parent().i_pl_s=EventHandler.register(this.parent().getColorPallet(), "onselect", this.handleColorSelect, this);
p.popWindow(200, 200);
if(CursorMonitor.getX()+200 >  CursorMonitor.browserWidth()) {
p.left(CursorMonitor.getX() - 210);
} else {
p.left(CursorMonitor.getX()+10);
}
if(CursorMonitor.getY()+200 > CursorMonitor.browserHeight()) {
p.top(CursorMonitor.getY() - 210);
} else {
p.top(CursorMonitor.getY()+10);
}
}
CalendarListItem.prototype.handleCalendarDeleteConfirm=function(e) {
if (e.button=="Yes") {
this.i_parent.dataModel().deleteCalendar(this.i_orig_cal);
}
}
CalendarListItem.prototype.handleCalendarDelete=function(e) {
var d=DialogManager.confirm("Are you sure you want to remove this shared calendar?", "Remove Shared Calendar", undefined, Array("Yes", "No"), true, false, 1);
EventHandler.register(d, "onclose", this.handleCalendarDeleteConfirm, this);
}
CalendarListItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="CalendarListItem"+(this.active() ? "_active" : "")+(this.hoverState() ? "_hover" : "");
this.i_item.style.width=this.width()+"px";
this.i_item.style.height=this.height()+"px";
this.i_item_check=document.createElement('DIV');
this.i_item_check.className="CalendarListItem_check";
this.i_item_check.style.width=CalendarListItem.checkboxWidth+"px";
this.i_item_check.style.height=this.height()+"px";
this.i_item.appendChild(this.i_item_check);
this.i_item_input=document.createElement('INPUT');
this.i_item_input.type="checkbox";
this.i_item_input.className="CalendarListItem_checkbox";
this.i_item_input.defaultChecked=this.isSelected();
this.i_item_input.checked=this.isSelected();
if (this.i_locked) {
this.i_item_input.disabled='disabled';
} else {
EventHandler.register(this.i_item_input, "onclick", this.handleToggleCalendar, this);
}
this.i_item_check.appendChild(this.i_item_input);
this.i_item_title=document.createElement('DIV');
this.i_item_title.className="CalendarListItem_title";
this.i_item_title.innerHTML=htmlEncode(this.calendar().name());
this.i_item_title.style.width=(this.width() - (CalendarListItem.checkboxWidth+CalendarListItem.deleteWidth+this.height()))+"px";
this.i_item_title.style.height=this.height()+"px";
this.i_item_title.style.lineHeight=this.height()+"px";
EventHandler.register(this.i_item_title, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_item_title, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_item_title, "onclick", this.handleClick, this);
this.i_item.appendChild(this.i_item_title);
this.i_item_color=document.createElement('DIV');
this.i_item_color.className="CalendarListItem_color";
this.i_item_color.style.paddingTop=CalendarListItem.colorPadding+"px";
this.i_item_color.style.paddingLeft=CalendarListItem.colorPadding+"px";
this.i_item_color.style.width=this.height()+"px";
this.i_item_color.style.height=this.height()+"px";
this.i_item.appendChild(this.i_item_color);
this.i_color_box=document.createElement('DIV');
this.i_color_box.className="CalendarListItem_color_box";
this.i_color_box.style.width=(this.height() - (CalendarListItem.colorPadding * 2))+"px";
this.i_color_box.style.height=(this.height() - (CalendarListItem.colorPadding * 2))+"px";
EventHandler.register(this.i_color_box, "onclick", this.handleColorPicker, this);
this.i_color_box.innerHTML="&nbsp;";
var color=CalendarColorClass.getColorById(this.calendar().color());
this.i_color_box.style.backgroundColor=color.background();
this.i_color_box.style.borderColor=color.border();
this.i_item_color.appendChild(this.i_color_box);
this.i_item_delete=document.createElement('DIV');
this.i_item_delete.className="CalendarListItem_delete";
this.i_item_delete.style.width=CalendarListItem.deleteWidth+"px";
this.i_item_delete.style.height=this.height()+"px";
this.i_item_delete.style.display=(this.calendar().ownerId()==user_prefs['user_id'] ? "none" : "");
this.i_item_delete.innerHTML="&nbsp;";
EventHandler.register(this.i_item_delete, "onclick", this.handleCalendarDelete, this);
this.i_item.appendChild(this.i_item_delete);
this.toolTip();
}
return this.i_item;
}
CalendarListItem.inherit(DataModelNode);
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.CalendarList.js");
function LiteEventList(width, height, date) {
this.i_width=width;
this.i_height=height;
this.i_date=date;
this.i_item_cache=Array();
}
LiteEventList.messageHeight=50;
LiteEventList.prototype.calendarsDataModel=function(model) {
if (model!=undefined) {
this.i_cal_model=model;
this.i_cal_l=EventHandler.register(this.i_cal_model, "onrefresh", this.handleCalendarList, this);
var cals=model.getItems(0, 1000);
if (cals.length()!=0) {
this.handleCalendarList();
}
}
return this.i_cal_model;
}
LiteEventList.prototype.handleCalendarList=function(e) {
var cals=this.calendarsDataModel().getItems(0, 1000);
var cal_length=cals.length();
for (var x=0; x < cal_length; x++) {
var c=cals.getItem(x);
if (c.calendar().isDefault()) {
this.i_cal_l.unregister();				
this.dataModel(c.calendar());
this.i_no_calendar=false;
return true;
}
}
if (this.dataModel()==undefined) {
if (this.i_list_message!=undefined) {
this.i_list_message.innerHTML="No Events";
}
else {
this.i_no_calendar=true;
}
}
return false;
}
LiteEventList.prototype.dataModel=function(model) {
if (model!=undefined) {
if (model==false) {
model=undefined;
}
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
LiteEventList.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=(newWidth < 0 ? 0 : newWidth);
if (this.i_list!=undefined && this.i_list_data!=undefined) {
this.i_list.style.width=this.i_width+"px";
this.i_list_message.style.width=this.i_width+"px";
this.i_list_data.style.width=this.i_width+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(this.i_width);
}
var winHeight=(this.i_list.parentNode ? (this.i_list.parentNode.offsetHeight) : (this.i_list.offsetHeight));
if (this.i_list_data.offsetHeight > winHeight) {
var scrollWidth=(this.i_width - (scrollBarWidth()+1));
this.i_list.style.width=scrollWidth+"px";
this.i_list_message.style.width=scrollWidth+"px";
this.i_list_data.style.width=scrollWidth+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(scrollWidth);
}
}
}
}
return this.i_width;
}
LiteEventList.prototype.height=function(newHeight) {
if (newHeight!=undefined) {
this.i_height=newHeight;
if (this.i_list!=undefined) {
this.i_list.style.height=newHeight+'px';
}
}
return this.i_height;
}
LiteEventList.prototype.focusDate=function(d) {
if (d!=undefined) {
this.i_date=d;
this.refreshData();
}
return this.i_date;
}
LiteEventList.prototype.refreshData=function() {
if (this.i_list!=undefined && this.i_model!=undefined) {
var s_date=floorDay(new Date());
var e_date=new Date();
e_date.setTime(s_date.getTime());
e_date.setTime(e_date.getTime()+86340000);
var items=this.i_model.dateRange(s_date, e_date);
var entries=items.length();
var n=0;
for (var x=0; x < entries; x++) {
var i=items.getItem(x);
var event_type=i.eventType();
if (event_type!=2 && event_type!=3 && event_type!=5)
{
if (this.i_item_cache[n]==undefined) {
this.i_item_cache[n]=new EventListItem();
this.i_list_data.appendChild(this.i_item_cache[n].getItem());
}
if(i.endTime().valueOf() > s_date.valueOf()) {
this.i_item_cache[n].visible(true);
}
this.i_item_cache[n].eventObject(i);
n++;
}
}
for (var x=entries; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
if(n==0) {
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
this.i_list_message.style.display="";
this.i_list_message.innerHTML=(items.isComplete() ? "No events" : "Loading...");
} else {
this.i_list_message.style.display="none";
}
this.width(this.i_width);
}
else {
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
}
}
LiteEventList.prototype.getList=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.className="LiteEventList";
this.i_list.style.width=this.width()+"px";
this.i_list.style.height=this.height()+"px";
this.i_list_message=document.createElement('DIV');
this.i_list_message.className="LiteEventList_message";
this.i_list_message.style.height=LiteEventList.messageHeight+"px";
this.i_list_message.style.lineHeight=LiteEventList.messageHeight+"px";
this.i_list_message.innerHTML=(this.i_no_calendar==true ? "No events" :  "Loading...");
this.i_list.appendChild(this.i_list_message);
this.i_list_data=document.createElement('DIV');
this.i_list_data.className="LiteEventList_data";
this.i_list.appendChild(this.i_list_data);
this.refreshData();
}
return this.i_list;
}
function EventListItem() {
}
EventListItem.itemHeight=20;
EventListItem.timeWidth=130;
EventListItem.timePaddingLR=6;
EventListItem.itemPaddingTB=3;
EventListItem.prototype.eventObject=function(ev) {
if (ev!=undefined) {
this.i_event=ev;
if (this.i_item!=undefined) {
this.i_item_time.style.width=EventListItem.timeWidth+"px";
this.i_item_time.style.height=EventListItem.itemHeight+"px";
this.i_item_time.innerHTML=this.timeTitle();
this.i_item_title.innerHTML=((this.eventObject()!=undefined && this.eventObject().title()!=undefined) ? this.eventObject().title().filterHTML() : "No Title");
}
}
return this.i_event;
}
EventListItem.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_item!=undefined) {
this.i_item.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
EventListItem.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=newWidth;
if (this.i_item!=undefined) {
this.i_item.style.width=this.i_width+"px";
this.i_item_time.style.width=EventListItem.timeWidth+"px";
var titleWidth=this.i_width -
EventListItem.timeWidth -
(2 * EventListItem.timePaddingLR) - 10;
this.i_item_title.style.width=(titleWidth > 0 ? titleWidth : 0)+"px";
}
}
return this.i_width;
}
EventListItem.prototype.timeTitle=function() {
if (this.eventObject()!=undefined) {
var start_date=this.eventObject().param("start");
var end_date=this.eventObject().param("end");
if(this.eventObject().allDay()===true || this.eventObject().allDay()==1) {
return "All day event";
} else {
return parent.getTimeString(start_date)+" - "+parent.getTimeString(end_date);
}
}
else {
return "Invalid";
}
}
EventListItem.prototype.handleMouseOver=function(e) {
this.i_item.className="EventListItem_hover";
}
EventListItem.prototype.handleMouseOut=function(e) {
this.i_item.className="EventListItem";
}
EventListItem.prototype.handleClick=function(e) {
var app_cal=parent.Application.getApplicationById(1004);
if (app_cal!=undefined) {
app_cal.popEvent(this.eventObject());
}
}
EventListItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="EventListItem";
this.i_item.style.width=(this.i_width > 0 ? this.i_width : 0)+"px";
this.i_item.style.paddingTop=EventListItem.itemPaddingTB+"px";
this.i_item.style.paddingBottom=EventListItem.itemPaddingTB+"px";						
this.i_item.style.display=(this.visible() ? "" : "none");
EventHandler.register(this.i_item, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_item, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_item, "onclick", this.handleClick, this);
this.i_item_time=document.createElement('DIV');
this.i_item_time.className="EventListItem_time";
this.i_item_time.style.width=EventListItem.timeWidth+"px";
this.i_item_time.style.height=EventListItem.itemHeight+"px";
this.i_item_time.style.paddingLeft=EventListItem.timePaddingLR+"px";
this.i_item_time.style.paddingRight=EventListItem.timePaddingLR+"px";
this.i_item_time.innerHTML=this.timeTitle();
this.i_item.appendChild(this.i_item_time);
this.i_item_title=document.createElement('DIV');
this.i_item_title.className="EventListItem_title";
var title_width=this.width() - EventListItem.timeWidth;
this.i_item_title.style.width=((title_width > 0) ? title_width : 0)+"px";
this.i_item_title.innerHTML=((this.eventObject()!=undefined && this.eventObject().title()!=undefined) ? this.eventObject().title().filterHTML() : "No Title");
this.i_item.appendChild(this.i_item_title);
var newWidth=(this.i_width==undefined ? 1 : this.i_width - EventListItem.timeWidth - 9);
this.i_item_title.style.width=(newWidth > 0 ? newWidth : 0)+"px";
this.i_item_float_clear=document.createElement('DIV');
this.i_item_float_clear.style.clear='both';
if(!document.all) {
this.i_item.style.height="auto";
}
this.i_item.appendChild(this.i_item_float_clear);
}
return this.i_item;
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.LiteEventList.js");
function QuickAdd(application, width, height, phrase) {
this.i_application=application;
this.i_width=width;
this.i_height=height;
this.i_phrase=phrase;
this.i_has_button=false;
}
QuickAdd.inputHeight=20;
QuickAdd.padding=10;
QuickAdd.buttonWidth=60;
QuickAdd.buttonPadding=7;
QuickAdd.i_window_counter=0;
QuickAdd.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_add!=undefined) {
this.i_add.style.width=this.width()+"px";
this.i_input.width(this.width() - (QuickAdd.padding * 2) - (this.includeButton() ? (QuickAdd.buttonWidth+QuickAdd.buttonPadding) : 0));
this.i_pad_top.style.width=this.width()+"px";
}
}
return this.i_width;
}
QuickAdd.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_add!=undefined) {
this.i_add.style.height=this.height()+"px";	
this.i_pad_top.style.height=Math.floor((this.height() - QuickAdd.inputHeight) / 2)+"px";
this.i_pad_left.style.height=(this.height() - Math.floor((this.height() - QuickAdd.inputHeight) / 2))+"px";
}
}
return this.i_height;
}
QuickAdd.prototype.includeButton=function(state) {
if (state!=undefined) {
this.i_has_button=state;
if (this.i_button_right!=undefined) {
this.i_button_right.style.display=(this.includeButton() ? "" : "none");
}
}
return this.i_has_button;
}
QuickAdd.prototype.application=function() {
return this.i_application;
}
QuickAdd.prototype.phrase=function(phrase) {
if (phrase!=undefined) {
this.i_phrase=phrase;
if (this.i_input!=undefined) {
this.i_input.defaultValue(phrase);
}
}
return this.i_phrase;
}
QuickAdd.prototype.handleSubmit=function(e) {
var is_window=(this.i_window!=undefined);
if (this.i_input.value()!=this.i_input.defaultValue()) {
var ev=this.parseString(this.i_input.value());
if (ev!=undefined && ev!=false) {
this.i_event=ev;
this.i_validate_time_handler=EventHandler.register(ev, "onvalidatetime", this.handleSaveValidateTime, this);
ev.validateTime(user_prefs["user_name"], CalendarDataModel.getDefaultCalendar().ownerId(), ev.startTime(), ev.endTime());
}
this.i_input.value(this.i_input.defaultValue());
if (is_window) {
this.i_window.close();
}
}
if (!is_window) this.i_input.handleFocus();
}
QuickAdd.prototype.handleSaveValidateTime=function(e) {
if(this.i_validate_time_handler!=undefined) {
this.i_validate_time_handler.unregister();
this.i_validate_time_handler=undefined;
}
var users=e.users;
if(users.length > 0) {
var us="";
for(var x=0; x < users.length; x++) {
us+="<br>"+users[x];
}
var d=DialogManager.confirm("The following attendees have conflicts with this time: "+us+"<br>Would you still like to schedule this event?", "Conflicts", undefined, ["Yes", "No"], undefined, true);
this.i_validate_time_confirm_handler=EventHandler.register(d, "onclose", this.handleSaveValidateTimeConfirm, this);
} else {
CalendarDataModel.getDefaultCalendar().addEvent(this.i_event);
this.i_save_reminder_handler=EventHandler.register(this.i_event, "onsave", this.handleEventSave, this);
this.i_event.save();
}
}
QuickAdd.prototype.handleSaveValidateTimeConfirm=function(e) {
if(this.i_validate_time_confirm_handler!=undefined) {
this.i_validate_time_confirm_handler.unregister();
this.i_validate_time_confirm_handler=undefined;
}
if(e.button=="Yes") {
CalendarDataModel.getDefaultCalendar().addEvent(this.i_event);
this.i_save_reminder_handler=EventHandler.register(this.i_event, "onsave", this.handleEventSave, this);
this.i_event.save();
}
}
QuickAdd.prototype.handleEventSave=function(e) {
this.i_save_reminder_handler=!this.i_save_reminder_handler.unregister();
if (e.wasNew) {
e.event.createDefaultReminder();
}
}
QuickAdd.prototype.parseString=function(str) {
var o=new Object();
o.type="quickadd";
o.string=str;
o.cancel=false;
if (QuickAdd.onquickadd!=undefined) {
QuickAdd.onquickadd(o);
}
if (o.cancel==false) {
var tokens=Array("");
var cToken=0;
for (var x=0; x < str.length; x++) {
if (str.charAt(x)==" " || str.charAt(x)==',') {
if (tokens[cToken]!="") {
cToken++;	
tokens[cToken]="";
}
}
else {
tokens[cToken]+=str.charAt(x);
}
}
var duration=60;
var dayTokens=Array();
var timeTokens=Array();
var acceptedDayTokens={ 'tomorrow': 'tomorrow',
'today': 'today',
'monday':'1',
'mon': '1',
'tuesday': '2',
'tue': '2',
'wednesday': '3',
'wed': '3',
'thursday': '4',
'thr': '4',
'thur': '4',
'thu': '4',
'th': '4',
'friday': '5',
'fri': '5',
'saturday': '6',
'sat': '6',
'sunday': '0',
'sun': '0' };
var acceptedTimeTokens=Array();
acceptedTimeTokens['breakfast']=Array('', '8', '0', 'am');
acceptedTimeTokens['lunch']=Array('', '12', '0', 'pm');
acceptedTimeTokens['dinner']=Array('', '6', '0', 'pm');
acceptedTimeTokens['noon']=Array('', '12', '0', 'pm', 1);
acceptedTimeTokens['midnight']=Array('', '12', '0', 'am', 1);
var deniedTokens=Array('am', 'pm', 'at', 'on');
var rPrefixToken="";
var newString="";
for (var x=0; x < tokens.length; x++) {
var tokenUsed=false;
var ignore_array_lookup=false;
if((deniedTokens[tokens[x]]!=undefined) || (tokens[x].toLowerCase()=='watch')) {
if((typeof deniedTokens[tokens[x]]=='function') || (tokens[x].toLowerCase()=='watch')) 
ignore_array_lookup=true;
}
if (!ignore_array_lookup && (acceptedDayTokens[tokens[x].toLowerCase()]!=undefined)) {
dayTokens[dayTokens.length]=acceptedDayTokens[tokens[x].toLowerCase()];
tokenUsed=true;
}
if (!ignore_array_lookup && (acceptedTimeTokens[tokens[x].toLowerCase()]!=undefined)) {
if (tokens[x].toLowerCase()=="dinner") {
duration=120;
}
if (tokens[x].toLowerCase()=="lunch" || tokens[x].toLowerCase()=="breakfast") {
duration=60;
}
timeTokens[timeTokens.length]=acceptedTimeTokens[tokens[x].toLowerCase()];
if (acceptedTimeTokens[tokens[x].toLowerCase()].length==5) {
tokenUsed=true;
}
}
else {
var rg=/^([0-9]{1,2})([:]([0-9]{2}))?((am)|(pm))?$/;
var tkResults;
if (tkResults=rg.exec(tokens[x])) {
if (tkResults[3]!=undefined) {
if (tkResults[3] < 0 || tkResults[3] > 59) {
tkResults[3]=99;
}
}
if (tkResults[1] >=0 && tkResults[1] < 24 && tkResults[3]!=99) {
if (tkResults[1]==0) {
tokens.splice(x+1, 0, "am");
tkResults[1]=12;
}
if (tkResults[1] > 12) {
tokens.splice(x+1, 0, (tkResults[1] > 12 ? "pm" : "am"));
tkResults[1]-=12;
}
var useAmPm=(tkResults[4]!=undefined ? tkResults[4] : ((tkResults[1]==12 | tkResults[1] <=5) ? "pm" : "am"));
if (tokens[x+1]!=undefined && (tokens[x+1].toLowerCase()=="am" || tokens[x+1].toLowerCase()=="pm")) {
useAmPm=tokens[x+1].toLowerCase();
}
if((useAmPm!='pm') && (str.toLowerCase().indexOf('dinner')!=-1))
useAmPm='pm'; 
timeTokens[timeTokens.length]=Array(tkResults[0], tkResults[1], (tkResults[3]!=undefined ? tkResults[3] : 0), useAmPm);
var tx=timeTokens[timeTokens.length - 1];
tokenUsed=true;
}
}
}
if (tokenUsed!=true) {
var found=false;
var preToken="";
for (var z=0; z < deniedTokens.length; z++) {
if (tokens[x]==deniedTokens[z]) {
found=true;
preToken=tokens[x];
break;
}
}
if (found==false) {
newString+=((rPrefixToken!="" && rPrefixToken!=undefined) ? (rPrefixToken+" ") : "")+tokens[x]+" ";
}
rPrefixToken=preToken;
}
}
var useDay="today";
var useTime=Array('allday', '0', '0', 'am');
if (dayTokens.length!=0) {
useDay=dayTokens[dayTokens.length - 1];
}
if (timeTokens.length!=0) {
var lastActual;
for (var x=0; x < timeTokens.length; x++) {
if (timeTokens[x][0]!='') {
lastActual=x;
}
useTime=timeTokens[x];
}
if (lastActual!=undefined) {
useTime=timeTokens[lastActual];
}
}
if (useTime[3]=="pm") {
if (useTime[1]!="12") {
useTime[1]=parseInt(useTime[1])+12;
}
}
if (useTime[1]==12 && useTime[3]=="am") {
useTime[1]=0;
}
var now=new Date();
if (useDay=="tomorrow") {
now=addDays(now, 1);
}
else if (useDay=="today") {
}
else {
if (useDay==now.getDay()) {
now=addDays(now, 1);
}
var failSafe=0;
while (failSafe < 7 && now.getDay()!=useDay) {
now=addDays(now, 1);
failSafe++;
}
if (failSafe==7) {
alert('unable to locate week day: '+useDay);
}
}
if (newString=="") {
newString=str;
}
var all_day=false;
var end_date;
if (useTime[0]=="allday") {
now=now.copy(true);
end_date=now.copy(true);
end_date.setMinutes(59);
end_date.setSeconds(59);
end_date.setHours(23);
all_day=true;
}
else {
now.setHours(useTime[1]);
now.setMinutes(useTime[2]);
now.setSeconds(0);
end_date=new Date(now);
end_date.setTime(end_date.getTime()+(duration * 60000));
}
var useCal=CalendarDataModel.getDefaultCalendar();
if (useCal!=undefined) {
var new_e=new CalendarEvent(0, newString, now, end_date, all_day);
new_e.duration((all_day==true ? (60 * 24) : duration));
new_e.priority(2);
new_e.eventType(0);
new_e.personal(0);
new_e.meetingRequestState(0);
new_e.timezone(28);
new_e.timezoneOffset(-1 * (now.getTimezoneOffset() / 60));
new_e.transparency(0);
new_e.calendarId(useCal.id());
new_e.isNew(true);
return new_e;
}
}
}
QuickAdd.prototype.getInput=function() {
if (this.i_input==undefined) {
this.i_input=new IconField("CalendarShare_add_icon", 18, 16, (this.width() - (QuickAdd.padding * 2) - (this.includeButton() ? (QuickAdd.buttonWidth+QuickAdd.buttonPadding) : 0)), QuickAdd.inputHeight,  this.phrase());
EventHandler.register(this.i_input, "onenter", this.handleSubmit, this);
}
return this.i_input;
}
QuickAdd.prototype.getQuickAdd=function() {
if (this.i_add==undefined) {
this.i_add=document.createElement('DIV');
this.i_add.className="QuickAdd";
this.i_add.style.width=this.width()+"px";
this.i_add.style.height=this.height()+"px";
this.i_pad_top=document.createElement('DIV');
this.i_pad_top.className="QuickAdd_padding_top";
this.i_pad_top.style.width=this.width()+"px";
this.i_pad_top.style.height=Math.floor((this.height() - QuickAdd.inputHeight) / 2)+"px";
this.i_pad_top.innerHTML="&nbsp;";
this.i_add.appendChild(this.i_pad_top);
this.i_pad_left=document.createElement('DIV');
this.i_pad_left.className="QuickAdd_padding_left";
this.i_pad_left.style.width=QuickAdd.padding+"px";
this.i_pad_left.style.height=(this.height() - QuickAdd.padding)+"px";
this.i_pad_left.innerHTML="&nbsp;";
this.i_add.appendChild(this.i_pad_left);
this.i_add.appendChild(this.getInput().getField());
this.i_button_right=document.createElement('DIV');
this.i_button_right.className="QuickAdd_button_right";
this.i_button_right.style.display=(this.includeButton() ? "" : "none");
this.i_button_right.style.width=(QuickAdd.buttonWidth+QuickAdd.buttonPadding-2)+"px";
this.i_add.appendChild(this.i_button_right);
this.i_button=document.createElement('BUTTON');
this.i_button.className="QuickAdd_button";
this.i_button.innerHTML="Save";
this.i_button.value="Save";
this.i_button.style.width=QuickAdd.buttonWidth+"px";
this.i_button.style.height=QuickAdd.inputHeight+2+"px";
this.i_button.style.lineHeight=QuickAdd.inputHeight+(document.all ? -5 : 2)+"px";
this.i_button.style.paddingBottom="2px";
EventHandler.register(this.i_button, "onclick", this.handleSubmit, this);
this.i_button_right.appendChild(this.i_button);
}
return this.i_add;
}
QuickAdd.prototype.handleWindowResize=function(e) {
if (this.i_window.effectiveWidth()!=undefined) {
this.width(this.i_window.effectiveWidth() - 3);
}
if (this.i_window.effectiveHeight()!=undefined) {
this.height(this.i_window.effectiveHeight() - this.i_window.titleBar().height() - 3);
}
}
QuickAdd.popWindow=function() {
var interface=new WindowObject('cal-quick-'+QuickAdd.i_window_counter++, "Quick Add", 100, 100, Application.titleBarFactory());
interface.titleBar().removeButton(Application.i_title_dock);
interface.temporary(true);
interface.global(true);
interface.popWindow(300, 80, true);
var qa=new QuickAdd(Application.getApplicationById(1004), interface.effectiveWidth() - 2, interface.effectiveHeight() - interface.titleBar().height() - 3, "e.g. Dinner with Lisa at 7pm today");
qa.i_window=interface;
qa.includeButton(true);
interface.loadContent(qa.getQuickAdd());
EventHandler.register(interface, "oncontentresize", qa.handleWindowResize, qa);
qa.getInput().fieldData().focus();
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.QuickAdd.js");
function EventDisplay(config) {
this.superPopoutDisplay(config);
if(this.i_popoutWindow!==undefined) {
this.i_event_popInternal=EventHandler.register(this.i_popoutWindow, "onpopinternal", this.handleInternalPop, this);
this.i_event_popExternal=EventHandler.register(this.i_popoutWindow, "onpopexternal", this.handleExternalPop, this);
this.i_event_terminate=EventHandler.register(this.i_popoutWindow, "onterminate",   this.handleTermination, this);
this.i_event_ready=EventHandler.register(this.i_popoutWindow, "onready",       this.handleReady,       this);
}
this.i_saving=false;
this.i_handlers=[]; 
this.i_content=null;
this.i_event=null;
this.i_edit_mode=false;
this.i_tab_content=new Object();
this.i_inputs=new Object();
this.i_load_details_event=null;
this.i_meetingOwner=true;
this.i_csid="";
this.i_ofiles=Array(); 
this.i_last_modified=null;
this.i_dialog=undefined;
this.i_attach_button=undefined;
this.i_start_instance_date_set=false;
this.i_include_simple_click=true; 
this.i_simple_click_width=198;
this.i_simple_click_showing=false;
this.i_simple_click=undefined;
this.i_simple_click_div=undefined;
this.i_all_day_duration=undefined;
this.i_notif=null;
this.i_notif_id=null;
if(this.i_windowObject) {
this.i_handlers.push(EventHandler.register(this.i_windowObject, "oncontentresize", this.oldresize, this));
this.i_windowObject.loadContent(this.getContent());
}
this.windowTitle('Event');
EventDisplay.obj=this;
this.i_windowObject.closeOnImport(false);
}
EventDisplay.prototype.onclose=undefined;
EventDisplay.prototype.onrequestchange=undefined;
EventDisplay.prototype.onscmodechange=undefined;
EventDisplay.dateCopy=function(d) {
return d.copy();
}
EventDisplay.fileAttachmentCopy=function(f) {
var n=new UniversalFileAttachment();
n.copy(f);
return n;
}
EventDisplay.prototype.csid=function(csid) {
if (csid!=undefined) {
this.i_csid=csid;
}
return this.i_csid;
}
EventDisplay.newEventAttendee=function(a, b, c, d) {
return new EventAttendee(a, b, c, d);
}
EventDisplay.DEFAULT_MEETING_REPLY_MSG="Include a message to the meeting host (optional)";
EventDisplay.prototype.handlePrint=function() {
var pdata=document.createElement('DIV');
var statMode=this.i_tab_content.appointment.lform.staticMode();
if (statMode==false) {
this.i_tab_content.appointment.lform.staticMode(true);
}
pdata.innerHTML=this.i_tab_content.appointment.lform.getForm().innerHTML;
if (statMode==false) {
this.i_tab_content.appointment.lform.staticMode(false);
}
pdata.innerHTML+="<HR size=\"5\" width=\"100%\">";
pdata.innerHTML+=this.i_tab_content.attendees.grid.printHTML();
if (SystemCore.loadPrintContent!=undefined) {
SystemCore.loadPrintContent(pdata, true);
}
else {
alert('This window does not support printing.');
}
}
EventDisplay.prototype.getContent=function() {
if(this.i_content===null) {
this.i_content=document.createElement("div");
this.i_toolbar=new ToolBar(100);
if(this.i_showToolbar!=undefined && this.i_showToolbar!=false){
this.i_content.appendChild(this.i_toolbar.getBar());
}
this.i_edit_button=this.i_toolbar.addItem(new UniversalButton("Edit", "ToolBar_icon_edit", 16, undefined, true, undefined, "left", "Edit Event"));
this.i_handlers.push(EventHandler.register(this.i_edit_button, "onclick", this.handleEditClick, this));
this.i_save_button=this.i_toolbar.addItem(new UniversalButton("Save and Close", "ToolBar_icon_save", 16, undefined, true, undefined, "left", "Save Event"));
this.i_handlers.push(EventHandler.register(this.i_save_button, "onclick", this.handleSaveClick, this));
this.i_cancel_button=this.i_toolbar.addItem(new UniversalButton("Cancel", "ToolBar_icon_cancel", 16, undefined, true, undefined, "left", "Cancel Edit"));
this.i_handlers.push(EventHandler.register(this.i_cancel_button, "onclick", this.handleCancelClick, this));
this.i_close_button=this.i_toolbar.addItem(new UniversalButton("Close", "Toolbar_icon_close", 16, undefined, true, undefined, "left", "Close Event"));
this.i_handlers.push(EventHandler.register(this.i_close_button, "onclick", this.handleCloseClick, this));
this.i_toolbar.addItem(new ToolBarDivider(false));
this.i_print_button=this.i_toolbar.addItem(new UniversalButton("Print", "ToolBar_icon_print", 16, undefined, true, undefined, "left", "Print Details"));
this.i_handlers.push(EventHandler.register(this.i_print_button, "onclick", this.handlePrint, this));
this.i_delete_button=this.i_toolbar.addItem(new UniversalButton("Delete", "ToolBar_icon_delete", 16, undefined, true, undefined, "left", "Delete Event"));
this.i_handlers.push(EventHandler.register(this.i_delete_button, "onclick", this.handleDeleteClick, this));
this.i_toolbar.addItem(new ToolBarDivider(false));
this.i_remind_button=this.i_toolbar.addItem(new UniversalButton("Remind", "ToolBar_icon_reminder", 16, undefined, true, undefined, "left", "Reminder Options"));
this.i_remind_button.context(this.getReminderContext());
this.i_handlers.push(EventHandler.register(this.i_remind_button, "onclick", this.handleReminderButtonClick, this));
if(this.i_popoutWindow!=undefined) {
var popout_button=this.getPopoutButton();
popout_button.float("right");
this.i_toolbar.addItem(popout_button);
}
this.i_notification_bar=new NotificationBar(100);
this.i_notification_bar.text("");
this.i_notification_bar.level(NotificationBar.INFO);
this.i_notification_bar.visible(false);
this.i_content.appendChild(this.i_notification_bar.getContent());
if(this.i_popoutWindow!=undefined) {
this.i_simple_click=new SimpleClick2(this.i_simple_click_width, 198);  
this.i_simple_click_div=document.createElement("DIV");
this.i_simple_click_div.style.display="none";
this.i_simple_click_div.style.styleFloat="left";
this.i_simple_click_div.style.cssFloat="left";
this.i_simple_click_div.appendChild(this.i_simple_click.getSimpleClick(true));
this.i_content.appendChild(this.i_simple_click_div);
}
this.i_tabs=new TabbedPane(100);
this.i_tabs.maximumTabWidth(120);
var app=new TabbedPaneTab("Appointment");
this.i_handlers.push(EventHandler.register(app, "onfocus", this.handleAppointmentTabFocus, this)); 
this.i_tab_app=app;
app.contentPane(this.getAppointmentTabContent());
this.i_tabs.addTab(app);
var attendees=new TabbedPaneTab("Attendees (loading)");
this.i_handlers.push(EventHandler.register(attendees, "onfocus", this.handleAttendeesTabFocus, this));
this.i_tab_attendees=attendees;
attendees.contentPane(this.getAttendeesTabContent());
this.i_tabs.addTab(attendees);
var recurrence=new TabbedPaneTab("Recurrence");
this.i_handlers.push(EventHandler.register(recurrence, "onfocus", this.handleRecurrenceTabFocus, this));
this.i_tab_recurrence=recurrence;
recurrence.contentPane(this.getRecurrenceTabContent());
this.i_tabs.addTab(recurrence);
var attachments=new TabbedPaneTab("Attachments (0)");
this.i_handlers.push(EventHandler.register(attachments, "onfocus", this.handleAttachmentTabFocus, this));
this.i_tab_attachments=attachments;
attachments.contentPane(this.getAttachmentTabContent());
this.i_tabs.addTab(attachments);
this.i_tabs.activeTab(app);
var tab_content=document.createElement("DIV");
tab_content.style.styleFloat="right";		
tab_content.style.cssFloat="right";
this.updateMode();
this.i_tabs.height(200);
this.i_tabs.width(200);
tab_content.appendChild(this.i_tabs.getPane());
this.i_content.appendChild(tab_content);
}
return this.i_content;
}
EventDisplay.prototype.getReminderContext=function() {
if (this.i_remind_context==undefined) {
this.i_reminder_values=EventDisplay.generateReminderOptions();
this.i_context_reminders=new Array();
this.i_remind_context=new ContextMenu(150);
for (var i=0; i < this.i_reminder_values.length; i++) {
this.i_context_reminders[i]=this.i_remind_context.addItem(new ContextMenuBoolean(this.i_reminder_values[i].text, false));
this.i_handlers.push(EventHandler.register(this.i_context_reminders[i], "onclick", this.handleReminderChangeClick, this));
}
}	
return this.i_remind_context;
}
EventDisplay.prototype.setReminderContext=function(value) {
if (this.i_reminder_value!=value) {
this.i_reminder_value=value;
this.setReminder(value, true);
}
for (var i=0; i<this.i_reminder_values.length; i++) {
this.i_context_reminders[i].state(this.i_reminder_values[i].value==value);
}
return this.i_reminder_value;
}
EventDisplay.prototype.handleRecurrenceTabFocus=function (e) {
if(this.i_notification_bar.buttons()[0]!=undefined) {
this.i_notification_bar.buttons()[0].visible(true);
}
}
EventDisplay.prototype.handleAttachmentTabFocus=function (e) {
if(this.i_notification_bar.buttons()[0]!=undefined) {
this.i_notification_bar.buttons()[0].visible(true);
}
}
EventDisplay.prototype.handleReminderChangeClick=function(e) {
for (var i=0; i<this.i_reminder_values.length; i++) {
if (e.item.i_name==this.i_context_reminders[i].text()) {
this.setReminderContext(this.i_reminder_values[i].value);
break;
}
}
}
EventDisplay.prototype.saving=function(state) {
if (state!=undefined) {
this.i_saving=state;
this.getShadeDiv().style.display=(state ? "" : "none");
this.i_save_button.enabled(!state);
this.i_cancel_button.enabled(!state);
this.i_remind_button.enabled(!state);
this.i_print_button.enabled(!state);
this.getPopoutButton().enabled(!state);
}
return this.i_saving;
}
EventDisplay.prototype.getShadeDiv=function() {
if(this.i_shadeDiv==undefined) {
var div=document.createElement('div');
var contentPane=this.i_windowObject.contentPane();
var winManagerDiv=this.i_windowObject.getWindow();
var titleBar;
if (this.i_windowObject.titleBar()!=undefined) {
titleBar=this.i_windowObject.titleBar().getTitleBar();
div.style.top=titleBar.style.height;
} else {
div.style.top=0;
}
div.style.width=contentPane.style.width;
div.style.height=contentPane.style.height;
div.style.left="0px";
div.style.position="absolute";
div.style.cursor="wait";
div.style.display="none";
div.style.backgroundColor="#000000";
if (document.all) {
div.style.filter="alpha(opacity=0)";
} else {
div.style.MozOpacity="0";
div.style.opacity="0";
div.style.KhtmlOpacity="0";
}
this.i_shadeDiv=div;
winManagerDiv.insertBefore(this.i_shadeDiv, contentPane);
}
return this.i_shadeDiv;
} 
EventDisplay.prototype.setReminder=function(time, norefresh, first_start) {
var saved=false;
if (!this.i_event.isNew() && this.i_savedReminderTime!=time) {
var mrState=this.i_event.meetingRequestState();
if (mrState!=undefined) {
var state=CalendarEvent.State;
if (state!=undefined && (mrState!=state.none && mrState!=state.accepted && !this.saving())) {
return;
}
}
var reminder=this.i_event.reminder();
var startTime=undefined;
if(first_start!=undefined) {
startTime=first_start;
} else {
startTime=this.i_event.occurrenceDate();
if (startTime==undefined) startTime=this.i_event.startTime();
}
var reminderTime=undefined;
if(time!=-1 && startTime!=undefined) {
reminderTime=addMinutes(startTime, -1 * time);
}
var created=false;
if (reminder==undefined) {
reminder=this.mainWindow().CalendarReminderDataModel.getDefaultDataModel().getItemById(this.i_event.id());
}
if (time==-1 || isNaN(parseInt(time)) || startTime==undefined || 
(reminder==undefined && startTime.valueOf() < new Date().valueOf()) || (reminder==undefined && reminderTime!=undefined && reminderTime.valueOf() < new Date().valueOf())) {
if (reminder!=undefined) {
this.mainWindow().CalendarReminderDataModel.deleteReminders(reminder,this.i_event.ownerId());
}
this.i_event.reminder(false);
} else { 
if (reminder==undefined) {
created=true;
reminder=PopoutWindow.createObject('CalendarReminder');
}
if (reminder.eventObject()!=this.i_event) {
reminder.eventObject(this.i_event);
}
var reminderDate=addMinutes(startTime, -1*parseInt(time));
if((reminderDate.valueOf() < new Date().valueOf()) && (startTime.valueOf() > new Date().valueOf())) {
reminderDate=addMinutes(new Date(), 5); 
}
if ((reminder.objectId()!=this.i_event.id()) || 
(reminder.interval()!=parseInt(time)) || 
(reminder.date().valueOf()!=reminderDate.valueOf()))
{
this.i_savedReminderTime=time;
reminder.objectId(this.i_event.id());
reminder.objectType(1);
reminder.interval(parseInt(time));
reminder.date(reminderDate);
var ownerId;
if (this.i_event.parentDataModel()!=undefined) {
ownerId=this.i_event.parentDataModel().ownerId();
} else {
ownerId=this.i_event.ownerId();
}
reminder.userId(ownerId);
if (typeof this.i_dm.defaultReminderType=="function" && this.i_dm.defaultReminderType()!=undefined) {
reminder.type(this.i_dm.defaultReminderType());
}
if (created) {
this.mainWindow().CalendarReminderDataModel.createReminder(reminder, ownerId);
} else {
this.mainWindow().CalendarReminderDataModel.saveReminders(reminder, ownerId);
}
if (this.i_event.reminder()!=reminder) {
this.i_event.reminder(reminder);
}
saved=true;
}
}
if (!norefresh) {
this.refreshReminder();
}
}
return saved;
}
EventDisplay.prototype.daily_recurrence_number_check=function(e) { 
if(isNaN(this.i_inputs.RTYPE_DAILY_EVERYXDAYS_INPUT.value()) ||
this.i_inputs.RTYPE_DAILY_EVERYXDAYS_INPUT.value() < 1) {
this.i_inputs.RTYPE_DAILY_EVERYXDAYS_INPUT.value('1');
} else if(this.i_inputs.RTYPE_DAILY_EVERYXDAYS_INPUT.value().length > 3) {
this.i_inputs.RTYPE_DAILY_EVERYXDAYS_INPUT.value(this.i_inputs.RTYPE_DAILY_EVERYXDAYS_INPUT.value().substring(this.i_inputs.RTYPE_DAILY_EVERYXDAYS_INPUT.value().length-3));
}
}
EventDisplay.prototype.weekly_recurrence_number_check=function(e) { 
if(isNaN(this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value()) ||
this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value() < 1) {
this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value('1');
} else if(this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value().length > 2) {
this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value(this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value().substring(this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value().length-2));
}
}
EventDisplay.prototype.monthly_recurrence_day_number_check=function(e) { 
if(isNaN(this.i_inputs.RTYPE_MONTHLY_DAYX_DAY_INPUT.value()) || 
this.i_inputs.RTYPE_MONTHLY_DAYX_DAY_INPUT.value() < 1 ||
this.i_inputs.RTYPE_MONTHLY_DAYX_DAY_INPUT.value() > 31) {
var dt=new Date();
this.i_inputs.RTYPE_MONTHLY_DAYX_DAY_INPUT.value(dt.getDate());
}
}
EventDisplay.prototype.monthly_recurrence_month_number_check=function(e) { 
if(isNaN(this.i_inputs.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value()) ||
this.i_inputs.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value() < 1) {
this.i_inputs.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value('1');
} else if(this.i_inputs.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value().length > 2) {
this.i_inputs.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value(this.i_inputs.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value().substring(this.i_inputs.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value().length-2));
}
}
EventDisplay.prototype.monthly_recurrence_monthly_number_check=function(e) { 
if(isNaN(this.i_inputs.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value()) ||
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value() < 1) {
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value('1');
} else if(this.i_inputs.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value().length > 2) {
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value(this.i_inputs.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value().substring(this.i_inputs.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value().length-2));
}
}
EventDisplay.prototype.yearly_recurrence_day_number_check=function(e) { 
if(isNaN(this.i_inputs.RTYPE_YEARLY_EVERYX_INPUT.value()) ||
this.i_inputs.RTYPE_YEARLY_EVERYX_INPUT.value() < 1 ||
this.i_inputs.RTYPE_YEARLY_EVERYX_INPUT.value() > 31) {
var dt=new Date();
this.i_inputs.RTYPE_YEARLY_EVERYX_INPUT.value(dt.getDate());
}
}
EventDisplay.prototype.handleRecurrenceEndAfterChange=function(e) {
if(isNaN(this.i_inputs.RENDAFTER_INPUT.value()) || 
this.i_inputs.RENDAFTER_INPUT.value() < 1) {
this.i_inputs.RENDAFTER_INPUT.value('1');
} else if(this.i_inputs.RENDAFTER_INPUT.value().length > 3) {
this.i_inputs.RENDAFTER_INPUT.value(this.i_inputs.RENDAFTER_INPUT.value().substring(this.i_inputs.RENDAFTER_INPUT.value().length-3));
}
}
EventDisplay.prototype.handleRecurrenceDateChange=function(e) { 
if(floorDay(new Date(this.i_inputs.RENDDATE.value())) < floorDay(new Date())) {
DialogManager.alert("Recurrence end date is invalid.");
this.i_inputs.RENDDATE.value(floorDay(new Date()));
}
}
EventDisplay.prototype.getRecurrenceTabContent=function() {
if(this.i_tab_content.recurrence==undefined) {
this.i_tab_content.recurrence=new Object();
var div=document.createElement("div");
var ins=this.i_inputs;
var form=new UniversalForm(500);
this.i_tab_content.recurrence.form=form;
var sec=form.addSection(new UniversalFormSection("Recurrence Pattern"));
this.i_tab_content.recurrence.rsec=sec;
var random_num=Math.floor(Math.random() * 99999);
ins.RTYPE_OPTION=new UniversalOptionBoxInput("Occurs", "", [new UniversalOptionBoxOption("Only Once", -1),
new UniversalOptionBoxOption("Daily", 0),
new UniversalOptionBoxOption("Weekly", 1),
new UniversalOptionBoxOption("Monthly", 2),
new UniversalOptionBoxOption("Yearly", 3)], false, "100%", 1);
sec.addRow(new UniversalFormRow(ins.RTYPE_OPTION));
this.i_handlers.push(EventHandler.register(ins.RTYPE_OPTION, "onchange", this.handleRecurrenceTypeChange, this));
ins.RTYPE_DAILY_EVERYXDAYS_RADIO=new UniversalRadioInput("", "", 5, [new UniversalRadioOption("", "t")], "daily_weekday"+random_num);
ins.RTYPE_DAILY_EVERYXDAYS_LABEL1=new UniversalLabelInput("", "", 15, "Every", "Every");
ins.RTYPE_DAILY_EVERYXDAYS_INPUT=new UniversalTextInput("", "", 50, undefined, "1");
ins.RTYPE_DAILY_EVERYXDAYS_LABEL2=new UniversalLabelInput("", "", "100%", "day(s)", "day(s)");
ins.RTYPE_DAILY_EVERYXDAYS_ROW=new UniversalFormRow(ins.RTYPE_DAILY_EVERYXDAYS_RADIO, ins.RTYPE_DAILY_EVERYXDAYS_LABEL1, 
ins.RTYPE_DAILY_EVERYXDAYS_INPUT, ins.RTYPE_DAILY_EVERYXDAYS_LABEL2);
this.i_handlers.push(EventHandler.register(ins.RTYPE_DAILY_EVERYXDAYS_INPUT, "onchange", this.daily_recurrence_number_check, this)); 
ins.RTYPE_DAILY_EVERYWEEKDAY_RADIO=new UniversalRadioInput("", "", 10, [new UniversalRadioOption("", "t")],"daily_weekday"+random_num);
ins.RTYPE_DAILY_EVERYWEEKDAY_LABEL=new UniversalLabelInput("", "", "100%", "Every weekday", "Every weekday");
ins.RTYPE_DAILY_EVERYWEEKDAY_ROW=new UniversalFormRow(ins.RTYPE_DAILY_EVERYWEEKDAY_RADIO, ins.RTYPE_DAILY_EVERYWEEKDAY_LABEL);
ins.RTYPE_DAILY_ROWS=[ins.RTYPE_DAILY_EVERYXDAYS_ROW, ins.RTYPE_DAILY_EVERYWEEKDAY_ROW];
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL1=new UniversalLabelInput("", "", 170, "Recur every", "Recur every");
ins.RTYPE_WEEKLY_EVERYXWEEKS_INPUT=new UniversalTextInput("", "", 50, undefined, "1");
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL2=new UniversalLabelInput("", "", "100%", "week(s) on:", undefined);
ins.RTYPE_WEEKLY_EVERYXWEEKS_ROW=new UniversalFormRow(ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL1, ins.RTYPE_WEEKLY_EVERYXWEEKS_INPUT, ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL2);
this.i_handlers.push(EventHandler.register(ins.RTYPE_WEEKLY_EVERYXWEEKS_INPUT, "onchange", this.weekly_recurrence_number_check, this)); 
ins.RTYPE_WEEKLY_EVERYXWEEKS_CHECKS=new UniversalCheckBoxInput("", "", "100%", [new UniversalCheckBoxOption("Sunday", 0),
new UniversalCheckBoxOption("Monday", 1),
new UniversalCheckBoxOption("Tuesday", 2),
new UniversalCheckBoxOption("Wednesday", 3),
new UniversalCheckBoxOption("Thursday", 4),
new UniversalCheckBoxOption("Friday", 5),
new UniversalCheckBoxOption("Saturday", 6)]);
ins.RTYPE_WEEKLY_EVERYXWEEKS_CHECKS_ROW=new UniversalFormRow(ins.RTYPE_WEEKLY_EVERYXWEEKS_CHECKS);
ins.RTYPE_WEEKLY_ROWS=[ins.RTYPE_WEEKLY_EVERYXWEEKS_ROW, ins.RTYPE_WEEKLY_EVERYXWEEKS_CHECKS_ROW];
ins.RTYPE_MONTHLY_DAYX_RADIO=new UniversalRadioInput("", "", 10, [new UniversalRadioOption("","t")], "monthly_pattern"+random_num);
ins.RTYPE_MONTHLY_DAYX_LABEL1=new UniversalLabelInput("", "", 15, "Day", "Day");
ins.RTYPE_MONTHLY_DAYX_DAY_INPUT=new UniversalTextInput("", "", 20, undefined, "1");
ins.RTYPE_MONTHLY_DAYX_LABEL2=new UniversalLabelInput("", "", 20, "of every", "of every");
ins.RTYPE_MONTHLY_DAYX_MONTHS_INPUT=new UniversalTextInput("", "", 20, undefined, "1");
ins.RTYPE_MONTHLY_DAYX_LABEL3=new UniversalLabelInput("", "", "100%", "month(s)", "month(s)");
ins.RTYPE_MONTHLY_DAYX_ROW=new UniversalFormRow(ins.RTYPE_MONTHLY_DAYX_RADIO,
ins.RTYPE_MONTHLY_DAYX_LABEL1,
ins.RTYPE_MONTHLY_DAYX_DAY_INPUT,
ins.RTYPE_MONTHLY_DAYX_LABEL2,
ins.RTYPE_MONTHLY_DAYX_MONTHS_INPUT,
ins.RTYPE_MONTHLY_DAYX_LABEL3);
this.i_handlers.push(EventHandler.register(ins.RTYPE_MONTHLY_DAYX_DAY_INPUT, "onchange", this.monthly_recurrence_day_number_check, this)); 
this.i_handlers.push(EventHandler.register(ins.RTYPE_MONTHLY_DAYX_MONTHS_INPUT, "onchange", this.monthly_recurrence_month_number_check, this)); 
ins.RTYPE_MONTHLY_DAYEVERY_RADIO=new UniversalRadioInput("", "", 10, [new UniversalRadioOption("","t")], "monthly_pattern"+random_num);
ins.RTYPE_MONTHLY_DAYEVERY_LABEL1=new UniversalLabelInput("", "", 5, "The", "The");
ins.RTYPE_MONTHLY_DAYEVERY_TH_INPUT=new UniversalOptionBoxInput("", "", this.getRecurrenceTHOptions(), false, 70, 1);
ins.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT=new UniversalOptionBoxInput("", "", this.getRecurrenceDayOptions(), false, 70, 1);
ins.RTYPE_MONTHLY_DAYEVERY_LABEL2=new UniversalLabelInput("", "", 30, "of every", "of every");
ins.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT=new UniversalTextInput("", "", 20, undefined, "1");
ins.RTYPE_MONTHLY_DAYEVERY_LABEL3=new UniversalLabelInput("", "", "100%", "month(s)", "month(s)");
ins.RTYPE_MONTHLY_DAYEVERY_ROW=new UniversalFormRow(ins.RTYPE_MONTHLY_DAYEVERY_RADIO,
ins.RTYPE_MONTHLY_DAYEVERY_LABEL1,
ins.RTYPE_MONTHLY_DAYEVERY_TH_INPUT,
ins.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT,
ins.RTYPE_MONTHLY_DAYEVERY_LABEL2,
ins.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT,
ins.RTYPE_MONTHLY_DAYEVERY_LABEL3);
ins.RTYPE_MONTHLY_ROWS=[ins.RTYPE_MONTHLY_DAYX_ROW, ins.RTYPE_MONTHLY_DAYEVERY_ROW];
this.i_handlers.push(EventHandler.register(ins.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT, "onchange", this.monthly_recurrence_monthly_number_check, this)); 
ins.RTYPE_YEARLY_EVERYX_RADIO=new UniversalRadioInput("", "", 10, [new UniversalRadioOption("","t")], "yearly_pattern"+random_num);
ins.RTYPE_YEARLY_EVERYX_LABEL1=new UniversalLabelInput("", "", 10, "Every", "Every");
ins.RTYPE_YEARLY_EVERYX_MONTH=new UniversalLabelInput("", "", 25, "", "");
ins.RTYPE_YEARLY_EVERYX_INPUT=new UniversalTextInput("", "", 20, undefined, "1");
ins.RTYPE_YEARLY_EVERYX_ROW=new UniversalFormRow(ins.RTYPE_YEARLY_EVERYX_RADIO,
ins.RTYPE_YEARLY_EVERYX_LABEL1,
ins.RTYPE_YEARLY_EVERYX_MONTH,
ins.RTYPE_YEARLY_EVERYX_INPUT);
this.i_handlers.push(EventHandler.register(ins.RTYPE_YEARLY_EVERYX_INPUT, "onchange", this.yearly_recurrence_day_number_check, this)); 
ins.RTYPE_YEARLY_EVERYTH_RADIO=new UniversalRadioInput("", "", 10, [new UniversalRadioOption("", "t")], "yearly_pattern"+random_num);
ins.RTYPE_YEARLY_EVERYTH_LABEL1=new UniversalLabelInput("", "", 5, "The", "The");
ins.RTYPE_YEARLY_EVERYTH_TH_INPUT=new UniversalOptionBoxInput("", "", this.getRecurrenceTHOptions(), false, 70, 1);
ins.RTYPE_YEARLY_EVERYTH_DAY_INPUT=new UniversalOptionBoxInput("", "", this.getRecurrenceDayOptions(), false, 100, 1)
ins.RTYPE_YEARLY_EVERYTH_MONTH=new UniversalLabelInput("", "", 25, "", "");
ins.RTYPE_YEARLY_EVERYTH_ROW=new UniversalFormRow(ins.RTYPE_YEARLY_EVERYTH_RADIO,
ins.RTYPE_YEARLY_EVERYTH_LABEL1,
ins.RTYPE_YEARLY_EVERYTH_TH_INPUT,
ins.RTYPE_YEARLY_EVERYTH_DAY_INPUT,
ins.RTYPE_YEARLY_EVERYTH_MONTH);
ins.RTYPE_YEARLY_ROWS=[ins.RTYPE_YEARLY_EVERYX_ROW, ins.RTYPE_YEARLY_EVERYTH_ROW];
ins.REND_OPTIONS=new UniversalOptionBoxInput("Range", "", [new UniversalOptionBoxOption("No End Date", 0),
new UniversalOptionBoxOption("End After", 1),
new UniversalOptionBoxOption("On Date", 2)], false, 70, 1);
ins.REND_OPTIONS_ROW=new UniversalFormRow(ins.REND_OPTIONS);
this.i_handlers.push(EventHandler.register(ins.REND_OPTIONS, "onchange", this.handleRecurrenceEndChange, this));
ins.RENDDATE=new UniversalDateInput("", "", "100%", 20, undefined, false);
ins.RENDDATE_ROW=new UniversalFormRow(ins.RENDDATE);
this.i_handlers.push(EventHandler.register(ins.RENDDATE, "onchange", this.handleRecurrenceDateChange, this));
ins.RENDAFTER_INPUT=new UniversalTextInput("", "", 20, undefined, "10");
ins.RENDAFTER_LABEL=new UniversalLabelInput("", "", "100%", "occurrences", "occurrences");
ins.RENDAFTER_ROW=new UniversalFormRow(ins.RENDAFTER_INPUT, ins.RENDAFTER_LABEL);
this.i_handlers.push(EventHandler.register(ins.RENDAFTER_INPUT, "onchange", this.handleRecurrenceEndAfterChange, this));
sec=form.addSection(new UniversalFormSection("Recurrence"));
this.i_tab_content.recurrence.display_section=sec;
ins.OCCURS=new UniversalLabelInput("Occurs", "", "100%", "");
sec.addRow(new UniversalFormRow(ins.OCCURS));
ins.ENDS=new UniversalLabelInput("Ends", "", "100%", "");
sec.addRow(new UniversalFormRow(ins.ENDS));
form.removeSection(this.i_tab_content.recurrence.display_section);
div.appendChild(form.getForm());
this.i_tab_content.recurrence.div=div;
}
return this.i_tab_content.recurrence.div;
}
EventDisplay.prototype.getRecurrenceTHOptions=function() {
return [new UniversalOptionBoxOption("first", 1),
new UniversalOptionBoxOption("second", 2),
new UniversalOptionBoxOption("third", 3),
new UniversalOptionBoxOption("fourth", 4),
new UniversalOptionBoxOption("last", -1)];
}
EventDisplay.prototype.getRecurrenceDayOptions=function() {
return [new UniversalOptionBoxOption("day", 0),
new UniversalOptionBoxOption("weekday", 8),
new UniversalOptionBoxOption("weekend day", 9),
new UniversalOptionBoxOption("Sunday", 1),
new UniversalOptionBoxOption("Monday", 2),
new UniversalOptionBoxOption("Tuesday", 3),
new UniversalOptionBoxOption("Wednesday", 4),
new UniversalOptionBoxOption("Thursday", 5),
new UniversalOptionBoxOption("Friday", 6),
new UniversalOptionBoxOption("Saturday", 7)];
}
EventDisplay.prototype.getAppointmentTabContent=function() {
if(this.i_tab_content.appointment==undefined) {
this.i_tab_content.appointment=new Object();
var div=document.createElement('div');
var ins=this.i_inputs;
var lform=new UniversalForm(500);
lform.lineUpAllColumns(true);
this.i_tab_content.appointment.lform=lform;
var sec=new UniversalFormSection("");
lform.addSection(sec);
ins.APPTATTENDEES=new UniversalEmailAddressField("Attendees", "", (this.i_popoutWindow!=undefined), false, "100%");
ins.APPTATTENDEES.maxFieldRows(4);
this.i_simpleClickField=ins.APPTATTENDEES;
this.i_tab_content.appointment.attendeesRow=new UniversalFormRow(ins.APPTATTENDEES);
sec.addRow(this.i_tab_content.appointment.attendeesRow);
this.i_handlers.push(EventHandler.register(ins.APPTATTENDEES, "onfieldfocus", this.handleFocusAddApptAttendees, this));
this.i_handlers.push(EventHandler.register(ins.APPTATTENDEES, "onhtchange", this.handleAttendeeHeightChange, this));
this.i_handlers.push(EventHandler.register(ins.APPTATTENDEES, "onbuttonclick", this.handleAttendeeButtonClick, this));
ins.SUBJECT=new UniversalTextInput("Subject", "", "100%", undefined);
this.i_tab_content.appointment.subjectRow=sec.addRow(new UniversalFormRow(ins.SUBJECT));
ins.SUBJECT.addValidationRule(new StringLengthValidationRule(255, "The event subject must be less than 255 characters long."));
this.i_handlers.push(EventHandler.register(ins.SUBJECT, "onchange", this.handleSubjectChange, this));
ins.SUBJECT.required(true);
ins.LOCATION=new UniversalTextInput("Location", "", "100%", undefined);
sec.addRow(new UniversalFormRow(ins.LOCATION));
ins.ATTENDEESRESPONDEMAIL=new UniversalCheckBoxInput("", "", "100%",
new UniversalCheckBoxOption("Email me when attendees respond", "email"));
sec.addRow(new UniversalFormRow(ins.ATTENDEESRESPONDEMAIL));
this.i_handlers.push(EventHandler.register(ins.ATTENDEESRESPONDEMAIL, "ontranslate", this.handleStaticFormEmailOnAttendTranslate, this));
sec=new UniversalFormSection();
lform.addSection(sec);
ins.STARTTIME=new UniversalDateInput("Start", "", "60%", undefined, undefined, true);
ins.DURATION=new UniversalOptionBoxInput("Duration", "", EventDisplay.generateDurationOptions(), false, "40%", 1);
sec.addRow(new UniversalFormRow(ins.STARTTIME, ins.DURATION));
this.i_handlers.push(EventHandler.register(ins.STARTTIME, "onchange", this.handleStartDateChange, this));
this.i_handlers.push(EventHandler.register(ins.DURATION, "onchange", this.handleDurationChange, this));
ins.ENDTIME=new UniversalDateInput("End", "", "60%", undefined, undefined, true);
ins.PRIVATE=new UniversalCheckBoxInput("Private Event", "", "40%", 
new UniversalCheckBoxOption("", "private"));
sec.addRow(new UniversalFormRow(ins.ENDTIME, ins.PRIVATE));
this.i_handlers.push(EventHandler.register(ins.ENDTIME, "onchange", this.handleEndDateChange, this));
var ET_VAL=new EventDatesValidator(ins.STARTTIME, true, "Event end should be after event start.");
ins.ENDTIME.addValidationRule(ET_VAL);
var ffbtn=new UniversalButton('First Available');
ins.FINDFIRSTBUTTON=new UniversalButtonInput(ffbtn, 'left', "60%", "Schedule");
sec.addRow(new UniversalFormRow(ins.FINDFIRSTBUTTON));
this.i_handlers.push(EventHandler.register(ffbtn, "onclick", this.handleFindFirstAvailableClick , this));
this.i_handlers.push(EventHandler.register(ins.PRIVATE, "ontranslate", this.handleStaticFormPrivateEventTranslate, this));
sec=new UniversalFormSection();
lform.addSection(sec);
ins.RECURRENCE=new UniversalLabelInput("Recurrence", "", "100%", "");
sec.addRow(new UniversalFormRow(ins.RECURRENCE));
sec=new UniversalFormSection();
lform.addSection(sec);
ins.DESCRIPTION=new UniversalTextAreaInput("Description", "", "100%", 70);
sec.addRow(new UniversalFormRow(ins.DESCRIPTION));
ins.LASTMOD=new UniversalLabelInput("", "", "100%", "");
sec.addRow(new UniversalFormRow(ins.LASTMOD));
lform.getForm().style.cssFloat="left";
lform.getForm().style.styleFloat="left";
div.appendChild(lform.getForm());
this.i_tab_content.appointment.div=div;
}
return this.i_tab_content.appointment.div;
}
EventDisplay.prototype.handleAttendeeHeightChange=function(e) {
this.resizeDescription();
}
EventDisplay.prototype.handleAttendeeButtonClick=function(e) {
if (e!=undefined && e.show!=undefined) {
this.i_simple_click_showing=e.show;
} else {
this.i_simple_click_showing=!this.i_simple_click_showing;
}
if(this.i_simple_click_showing) {
this.i_simple_click_div.style.display="";
this.i_windowObject.left(this.i_windowObject.left() - (this.i_simple_click_width/2));
this.i_windowObject.effectiveWidth(this.i_windowObject.effectiveWidth()+this.i_simple_click_width);
} else {
this.i_simple_click_div.style.display="none";
this.i_windowObject.left(this.i_windowObject.left()+(this.i_simple_click_width/2));
this.i_windowObject.effectiveWidth(this.i_windowObject.effectiveWidth() - this.i_simple_click_width);
}
if (this.i_popoutWindow!=undefined && this.i_popoutWindow.isExternal()) {
if (this.onscmodechange!=undefined) {
var o=new Object();
o.type="scmodechange";
o.mode=this.i_simple_click_showing;
this.onscmodechange(o);
}
}
}
EventDisplay.prototype.handleDurationChange=function(e) {
var dur=parseInt(this.i_inputs.DURATION.value());
var old_allday=this.allday();
if(this.i_inputs.DURATION.value()=="allday") {
var in_dur=this.i_inputs.DURATION; 
dur=-1;
this.i_duration=parseInt(in_dur.options(in_dur.options().length - 1).value())
var start_date=floorDay(this.i_inputs.STARTTIME.value().copy());
this.i_inputs.STARTTIME.value(start_date, true);
if (!(this.allDayDuration() > 1)) {
this.i_inputs.ENDTIME.value(start_date.copy(), true);
} else {
this.i_inputs.ENDTIME.value(floorDay(this.i_inputs.ENDTIME.value().copy()), true);
}
}
this.allday(this.i_inputs.DURATION.value()=="allday");
if(dur > -1) {
this.i_duration=dur;
if(old_allday) {
var now=new Date();
var start_date=this.i_inputs.STARTTIME.value().copy();
start_date.setHours(now.getHours()+1);
start_date.setMinutes(0);
this.i_inputs.STARTTIME.value(start_date, true);
}
var end_date=this.i_inputs.STARTTIME.value().copy();
end_date.setTime(end_date.getTime()+(dur * 60000));
this.i_inputs.ENDTIME.value(end_date, true);
}	
}
EventDisplay.prototype.handleSubjectChange=function(e) {
if (this.i_popoutWindow!=undefined && this.i_popoutWindow.i_last_external) {
}
else {
this.windowTitle(this.i_inputs.SUBJECT.value());
}
}
EventDisplay.prototype.allday=function(i) {
if(i!=undefined) {
if(this.i_allday!=i) {
this.i_allday=i;
this.i_inputs.STARTTIME.time(!i , true);
this.i_inputs.ENDTIME.time(!i, true);			
}
}
return this.i_allday;
}
EventDisplay.prototype.handleReminderButtonClick=function(e) {
this.i_remind_button.handleButtonContext();
}
EventDisplay.prototype.handleStartDateChange=function(e) {
var ins=this.i_inputs;
var end_date=ins.ENDTIME.value().copy(); 
end_date.setSeconds(0,0);
var start_date=ins.STARTTIME.value().copy();
start_date.setSeconds(0,0);
var duration=this.i_inputs.DURATION.value();
var actual_duration=Math.floor((end_date.getTime() - start_date.getTime()) / 1000 / 60);
if (duration=="allday") {
if (actual_duration <=0) {
end_date=start_date.copy(true);
this.i_inputs.ENDTIME.value(end_date, true);
this.i_duration=1440;
} else {
this.i_duration=actual_duration;
}
}
else {
end_date.setTime(start_date.getTime()+(this.i_duration * 60000));
this.i_inputs.ENDTIME.value(end_date, true);
}
this.handleRecurrenceTypeChange();
}
EventDisplay.prototype.handleEndDateChange=function(e) {
var ins=this.i_inputs;
var end_date=ins.ENDTIME.value().copy(); 
end_date.setSeconds(0,0);
var start_date=ins.STARTTIME.value().copy();
start_date.setSeconds(0,0);
var duration=this.i_inputs.DURATION.value();
var actual_duration=Math.floor((end_date.getTime() - start_date.getTime()) / 1000 / 60);
if (duration=="allday") {
if (actual_duration < 0) {
end_date=start_date.copy(true);
this.i_inputs.ENDTIME.value(end_date, true);
actual_duration=0;
}
this.i_duration=actual_duration+1440;
}
else {
if (actual_duration < 0) {
end_date.setTime(start_date.getTime()+(this.i_duration * 60000));
this.i_inputs.ENDTIME.value(end_date, true);
}
else {
var dur=parseInt(this.i_inputs.DURATION.value(actual_duration));
if (isNaN(dur)) {
ins.DURATION.value("-1");
}
this.i_duration=actual_duration;
if(this.i_inputs.DURATION.value()!=actual_duration) {
this.i_inputs.DURATION.value(-1);
}
}
}
this.handleRecurrenceTypeChange();
}
EventDisplay.prototype.updateDurationFromDates=function(e) {
if(this.i_allday) {
if(this.i_inputs.DURATION.value()!="allday") {
this.i_inputs.DURATION.value("allday");
}
}else{
var end=this.i_inputs.ENDTIME.value().copy();
var start=this.i_inputs.STARTTIME.value().copy();
end.setSeconds(0);
start.setSeconds(0);
var diff=Math.floor(((end.getTime() - start.getTime()) / 1000) / 60);
var newdur=""+diff;
if(this.i_inputs.DURATION.value()!=newdur) {
this.i_inputs.DURATION.value(""+diff);
}
this.i_duration=diff;
}
}
EventDisplay.prototype.handleFindFirstAvailableClick=function(e) {
var att=this.getAttendeesFromFields();
var att2=this.i_event.attendeeString();
if(att.length > 0 && att2.length > 0) {
att=att+","+att2;
}else{
att=att+att2;
}
var sdate;
if(this.i_firstAvailable_lastReturn==undefined) {
sdate=EventDisplay.dateCopy(this.i_inputs.STARTTIME.value());
}else{
sdate=addHour(this.i_firstAvailable_lastReturn);
}
if(!this.i_find_first_handler) {
this.i_find_first_handler=EventHandler.register(this.i_event, "onfindfirstavailable", this.handleFindFirstAvailableData, this);
this.i_find_first_notification=Notifications.getInstance().add("Searching Schedules");
}
this.i_event.findFirstAvailable(att, sdate, this.i_duration);
}
EventDisplay.prototype.handleFindFirstAvailableData=function(e) {
if(this.i_find_first_handler) {
this.i_find_first_handler=!this.i_find_first_handler.unregister();
}
if(this.i_find_first_notification) {
this.i_find_first_notification.end();
this.i_find_first_notification=null;
}
var times=e.times;
if (times.length > 0) {
this.i_first_available_times=times;
} else {
this.i_first_available_times=null;
}
this.i_first_available_times_idx=0;
this.showNextFirstAvailDialog();
}
EventDisplay.prototype.showNextFirstAvailDialog=function() {
if(!this.i_first_available_times) {
DialogManager.alert("No available time slots were found.", "Find First Available", undefined, true, true);
return;
}
if(this.i_first_available_times[this.i_first_available_times_idx]==undefined) {
this.i_firstAvailable_lastReturn=this.i_first_available_times[this.i_first_available_times_idx - 1];
this.handleFindFirstAvailableClick();
this.i_firstAvailable_lastReturn=null;
return;
}
var time=iCaltoUTCDate(this.i_first_available_times[this.i_first_available_times_idx++].value());
var text="";
if(getMinuteDiff(time, this.i_inputs.STARTTIME.value())!=0) {
text='The next available time slot is at: <br>'+getNumericDateString(time)+"<br>"+getTimeString(time)+"<br> Would you like to schedule the event for this time?";
}else{
text='The current start time is available.';
}
if (this.i_dialog==undefined) {
this.i_dialog=DialogManager.confirm(text, 'First Available', undefined, ['OK', 'Next', 'Cancel'], true, true, 0);
this.i_handlers.push(EventHandler.register(this.i_dialog, "onclose", this.handleCloseFirstAvailDiag, this));
} else {
this.i_dialog.text(text);
this.i_dialog.recalcSize();
}
if (this.i_dialog.i_window.visible()==false) this.i_dialog.show();
this.i_dialog.availTime=time;
}
EventDisplay.prototype.handleCloseFirstAvailDiag=function(e) {
if(e.button==undefined) { return; }
if(e.button=="OK") {
var time=e.dialog.availTime;
this.i_inputs.STARTTIME.value(time);
}else if (e.button=="Next") {
if (e.dialog!==this.i_dialog) {
this.i_dialog=undefined;
this.i_dialog=e.dialog;
}
e.cancel=true;
this.showNextFirstAvailDialog();
}else{
this.i_first_available_times=null;
this.i_first_available_times_idx=0;
}
}
EventDisplay.prototype.destructor=function(closeWin) {
if (!this.__destroyed) {
this.__destroyed=true;
if (this.i_find_first_handler)		this.i_find_first_handler=!this.i_find_first_handler.unregister();
if (this.i_load_details_event)		this.i_load_details_event=!this.i_load_details_event.unregister();
if (this.i_load_attendees_event)	this.i_load_attendees_event=!this.i_load_attendees_event.unregister();
if (this.i_event_att_l)				this.i_event_att_l=!this.i_event_att_l.unregister();
if (this.i_load_reminder_event)		this.i_load_reminder_event=!this.i_load_reminder_event.unregister()
if (this.i_load_files_event)		this.i_load_files_event=!this.i_load_files_event.unregister();
if (this.i_event_change_handler)	this.i_event_change_handler=!this.i_event_change_handler.unregister();
if (this.i_save_event_listener)		this.i_save_event_listener=!this.i_save_event_listener.unregister();
if (this.i_save_event_error_listener)		this.i_save_event_error_listener=!this.i_save_event_error_listener.unregister();
if (this.i_validate_time_handler)	this.i_validate_time_handler=!this.i_validate_time_handler.unregister();
if (this.i_event_terminate)			this.i_event_terminate=!this.i_event_terminate.unregister();
if (this.i_event_popExternal)		this.i_event_popExternal=!this.i_event_popExternal.unregister();
if (this.i_event_popInternal)		this.i_event_popInternal=!this.i_event_popInternal.unregister();
this.i_tab_content.attendees.grid.dataModel(false);
var items=this.i_toolbar.items();
for (var i=0; i < items.length;++i) {
if (items[i].destructor) items[i].destructor();
}
}
for (var i=0; i < this.i_handlers.length;++i) {
if (this.i_handlers[i]!=undefined && typeof this.i_handlers[i].unregister=="function") {
this.i_handlers[i].unregister();
}
}
this.i_handlers=[];
if (closeWin) this.closeWindow();
}
EventDisplay.prototype.getAttendeesTabContent=function() {
if(this.i_tab_content.attendees==undefined) {
this.i_tab_content.attendees={};
var div=document.createElement('div');
this.i_tab_content.attendees.div=div;		
var ownerContent=document.createElement('div');
this.i_tab_content.attendees.ownerContent=ownerContent;
var recipientContent=document.createElement("div");
this.i_tab_content.attendees.recipientContent=recipientContent;
var ins=this.i_inputs;
var form=new UniversalForm(500);
this.i_tab_content.attendees.addForm=form;
var sec=new UniversalFormSection("");
form.addSection(sec);
ownerContent.appendChild(form.getForm());
var tools=new ToolBar(200, 25);
this.i_tab_content.attendees.toolbar=tools;
var email_all_btn=new UniversalButton("Email all attendees", "ApplicationEmail_small", 16, undefined, true, undefined, "left", "Email all attendees");
this.i_handlers.push(EventHandler.register(email_all_btn, "onclick", this.handleEmailAllClick, this));
tools.addItem(email_all_btn);
tools.addItem(new ToolBarDivider());
var remove_selected=new UniversalButton("Remove Attendees", "ToolBar_icon_delete", 16, undefined, true, undefined, "left", "Remove selected attendees");
this.i_handlers.push(EventHandler.register(remove_selected, "onclick", this.handleRemoveAttendees, this));
tools.addItem(remove_selected);
ownerContent.appendChild(tools.getBar());
var tools_attendee=new ToolBar(200, 25);
this.i_tab_content.attendees.toolbar_attendee=tools_attendee;
var email_all_btn_attendee=new UniversalButton("Email all attendees", "ApplicationEmail_small", 16, undefined, true, undefined, "left", "Email all attendees");
this.i_handlers.push(EventHandler.register(email_all_btn_attendee, "onclick", this.handleEmailAllClick, this));
tools_attendee.addItem(email_all_btn_attendee);
var containerDiv=document.createElement('div');
this.i_tab_content.attendees.containerDiv=containerDiv;
var mform=new UniversalForm(700);
this.i_tab_content.attendees.mForm=mform;
var sec=new UniversalFormSection();
mform.addSection(sec);
ins.MEETINGREQUESTSTATUS2=new UniversalRadioOption("Accept", 2);
ins.MEETINGREQUESTSTATUS4=new UniversalRadioOption("Decline", 4);
ins.MEETINGREQUESTSTATUS98=new UniversalRadioOption("Decline&nbsp;Instance", 98);
ins.MEETINGREQUESTSTATUS99=new UniversalRadioOption("Decline&nbsp;Series", 99);
ins.MEETINGREQUESTSTATUS3=new UniversalRadioOption("Tentative", 3);
ins.MEETINGREQUESTSTATUSRADIO=new UniversalRadioInput("Your response", "", "75%", [ins.MEETINGREQUESTSTATUS2,
ins.MEETINGREQUESTSTATUS3], "MEETINGREQUESTSTATUS");
ins.MEETINGREQUESTSTATUSRADIO.columns(2);
btnReqReply=new UniversalButton("Submit Response", undefined, undefined, undefined, true, 22, undefined, "Submit Response");
this.i_handlers.push(EventHandler.register(btnReqReply, "onclick", this.handleRequestReplyClick, this));
ins.MEETINGREQUESTREPLYBUTTON=new UniversalButtonInput(btnReqReply, "right", "25%");
sec.addRow(new UniversalFormRow(ins.MEETINGREQUESTSTATUSRADIO, ins.MEETINGREQUESTREPLYBUTTON));
ins.MEETINGREQUESTREPLY=new UniversalTextAreaInput("", "", "100%", 50, EventDisplay.DEFAULT_MEETING_REPLY_MSG);
sec.addRow(new UniversalFormRow(ins.MEETINGREQUESTREPLY));
this.i_handlers.push(EventHandler.register(ins.MEETINGREQUESTREPLY, "onfocus", this.handleMeetingReplyFocus, this));
mform.getForm().style.cssFloat="left";
mform.getForm().style.styleFloat="left";
containerDiv.appendChild(mform.getForm());
recipientContent.appendChild(containerDiv);
recipientContent.appendChild(tools_attendee.getBar());
div.appendChild(ownerContent);
div.appendChild(recipientContent);
ownerContent.style.display="none";
recipientContent.style.display="none";
this.i_tab_content.attendees.grid=new DataGrid(500, 200, undefined, undefined, Array("DataGrid_column_selected"));
var grid=this.i_tab_content.attendees.grid;
grid.addHeader(new DataGridHeader("displayName", "displayName", 30, "Name"));
grid.addHeader(new DataGridHeader("status_text", "status", 30, "Status"));
div.appendChild(this.i_tab_content.attendees.grid.getGrid());
}
return this.i_tab_content.attendees.div;
}
EventDisplay.prototype.handleAttendeesTabFocus=function(e) {
if(this.i_notification_bar.buttons()[0]!=undefined) {
this.i_notification_bar.buttons()[0].visible(false);
}
}
EventDisplay.prototype.handleAppointmentTabFocus=function(e) {
this.refreshRecurrence(this.buildRecurrenceObjectFromForm());
this.handleReady();	
if(this.i_notification_bar.buttons()[0]!=undefined) {
this.i_notification_bar.buttons()[0].visible(true);
}
}
EventDisplay.prototype.handleReady=function(e) {
var input=this.i_inputs.SUBJECT.inputObject();
this.mainWindow().setTimeout(function(){
try {
if (input.createTextRange) {
var range=input.createTextRange();
range.moveStart("character", 0);
range.moveEnd("character", input.value.length);
range.select();
} else if (input.setSelectionRange) {
input.setSelectionRange(0, input.value.length);
} else {
}
input.focus();
} catch(e) {
}
input=null;
},100); 
}
EventDisplay.prototype.handleRequestReplyClick=function(e) {
var declining_instance=false;
this.saving(false);
if(this.i_in_refresh==undefined || this.i_in_refresh==false) {
var mrs=this.i_inputs.MEETINGREQUESTSTATUSRADIO.value();
if (mrs==99)
mrs=4;
else if (mrs==98) {
declining_instance=true;
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "declineInstance"));
dn.addNode(new DataNode("aId", (this.i_event.parentDataModel().ownerId()!=undefined ? this.i_event.parentDataModel().ownerId() : user_prefs['user_id'])));
dn.addNode(new DataNode("id", this.i_event.id()));
var occ=new Date(this.i_inputs.STARTTIME.value());
occ.setSeconds(0);
dn.addNode(new DataNode("occurrenceDate", dateToUTCICal(occ)));
dn.addNode(new DataNode("calendarId", this.i_event.parentDataModel().id()));
dn.addNode(new DataNode("ownerId", (this.i_event.parentDataModel().ownerId()!=undefined ? this.i_event.parentDataModel().ownerId() : user_prefs['user_id'])));
var r=PopoutWindow.createObject("RequestObject");
r.application("Event");
r.method("declineInstance");
r.data(dn);	
r.execute();
this.i_event.parentDataModel().removeEvent(this.i_event, true);
}
if((mrs!=undefined) && (declining_instance==false)) {
if(parseInt(this.i_event.meetingRequestState())!=parseInt(mrs)) {
this.i_event.meetingRequestState(mrs);
this.i_event.saveMeetingRequestState();
}
}
if (mrs!=undefined && (mrs==0 || mrs==2)) {
this.saving(true);
this.setReminder(this.i_reminder_value, true);
}
}
var msg=this.i_inputs.MEETINGREQUESTREPLY.value();
if(msg.length > 0 && msg!=EventDisplay.DEFAULT_MEETING_REPLY_MSG) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "emailEventHost"));
dn.addNode(new DataNode("aid", user_prefs['user_id']));
dn.addNode(new DataNode("from", this.i_event.getSelfAttendee().defaultAlias()));
dn.addNode(new DataNode("fromname", this.i_event.getSelfAttendee().displayName()));
dn.addNode(new DataNode("to", this.i_event.getMeetingHost().defaultAlias()));
dn.addNode(new DataNode("subject", this.i_event.getSelfAttendee().displayName()+" has responded to your invitation to \""+this.i_event.title()+"\""));
if(declining_instance) {
dn.addNode(new DataNode("message", this.i_event.getSelfAttendee().displayName()+" has declined the "+this.i_inputs.STARTTIME.value()+" instance of recurring event \""+this.i_event.title()+"\" \n\nAttached Message:\n"+msg));
} else {
dn.addNode(new DataNode("message", this.i_event.getSelfAttendee().displayName()+" has replied to your meeting request. \n\nAttached Message:\n"+msg));
}
var r=PopoutWindow.createObject("RequestObject");
r.application("Event");
r.method("emailEventHost");
r.data(dn);
r.execute();
this.i_inputs.MEETINGREQUESTREPLY.value("");
}
if(this.onrequestchange!=undefined) {
var event=new Object();
event.type="requestchange";
event.event=this.i_event;
this.onrequestchange(event);
}
this.closeEvent();
}
EventDisplay.prototype.setMeetingRequestOptionValue=function(val) {
if ((parseInt(this.i_event.meetingRequestState())==2) && 
(parseInt(val)!=0)) { 
if(this.i_event.recurrence()!='') {
this.i_inputs.MEETINGREQUESTSTATUSRADIO.columns(4);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.removeOption(this.i_inputs.MEETINGREQUESTSTATUS4);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.addOption(this.i_inputs.MEETINGREQUESTSTATUS99, this.i_inputs.MEETINGREQUESTSTATUS3);
if(this.instance()) {
this.i_inputs.MEETINGREQUESTSTATUSRADIO.addOption(this.i_inputs.MEETINGREQUESTSTATUS98, this.i_inputs.MEETINGREQUESTSTATUS99);
} else {
this.i_inputs.MEETINGREQUESTSTATUSRADIO.removeOption(this.i_inputs.MEETINGREQUESTSTATUS98);
}
} else {
this.i_inputs.MEETINGREQUESTSTATUSRADIO.columns(3);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.removeOption(this.i_inputs.MEETINGREQUESTSTATUS98);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.removeOption(this.i_inputs.MEETINGREQUESTSTATUS99);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.addOption(this.i_inputs.MEETINGREQUESTSTATUS4, this.i_inputs.MEETINGREQUESTSTATUS3);
}
} else {
this.i_inputs.MEETINGREQUESTSTATUSRADIO.columns(3);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.removeOption(this.i_inputs.MEETINGREQUESTSTATUS98);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.removeOption(this.i_inputs.MEETINGREQUESTSTATUS99);
this.i_inputs.MEETINGREQUESTSTATUSRADIO.addOption(this.i_inputs.MEETINGREQUESTSTATUS4, this.i_inputs.MEETINGREQUESTSTATUS3);
}
this.i_inputs.MEETINGREQUESTSTATUSRADIO.value(val);
}
EventDisplay.prototype.handleMeetingReplyFocus=function(e) {
if(this.i_inputs.MEETINGREQUESTREPLY.value()=="Include a message to the meeting host (optional)")
{
this.i_inputs.MEETINGREQUESTREPLY.value("");
}
}
EventDisplay.prototype.handleRequestReplyRequestComplete=function(e) {
}
EventDisplay.prototype.handleDeclineInstanceRequestComplete=function(e) {
}
EventDisplay.prototype.handleFocusAddApptAttendees=function(e) {
this.i_simpleClickField=this.i_inputs.APPTATTENDEES;
this.setupSimpleClick();
}
EventDisplay.prototype.setupSimpleClick=function() {
if(this.i_simpleClickListener!=undefined){
this.getSimpleClick().cancelRequest(this.i_simpleClickListener);
this.i_simpleClickListener=undefined;
}
if(this.getSimpleClick()!=undefined) {
this.i_simpleClickListener=this.getSimpleClick().requestOnBoth(this.handleClickSCContact,this);
}
if(this.i_simple_click!=undefined) {
this.i_simple_click.requestOnBoth(this.handleClickSCContact, this);
}
}
EventDisplay.prototype.handleBlurAddAttendees=function(e) {
if(this.i_simpleClickListener!=undefined){
if(ApplicationOldContacts!=undefined && ApplicationOldContacts.getSimpleClick!=undefined && ApplicationOldContacts.getSimpleClick()!=undefined){
ApplicationOldContacts.getSimpleClick().cancelRequest(this.i_simpleClickListener);
this.i_simpleClickListener=undefined;
} else if (this.getSimpleClick()!=undefined) {
this.getSimpleClick().cancelRequest(this.i_simpleClickListener);
this.i_simpleClickListener=undefined;
}
}
}
EventDisplay.prototype.handleClickSCContact=function(type,group,contact) {
if(this.edit()==false) { return true; } 
if(this.i_simpleClickField==undefined) { return true; } 
var attendeeField=this.i_simpleClickField.fieldObject();
if (attendeeField==undefined) { return true; } 
if(contact!=undefined) {
var oval=this.i_simpleClickField.value();
if (oval==undefined) oval="";
if(oval.length > 0) {
oval+=", ";
}
if (contact.username==undefined) {
if (contact.email!=undefined && contact.email!="") {
oval+=contact.email;
}
else {
DialogManager.alert("The contact you selected does not have a valid email address.", "Invalid Attendee");
return true;
}
}
else {
oval+=contact.username;
}
attendeeField.simpleClickChange(true);
this.i_simpleClickField.value(oval);
attendeeField.simpleClickChange(false);
} else if(group!=undefined) {
var oval=this.i_simpleClickField.value();
if (oval==undefined) oval="";
if(oval.length > 0) {
oval+=", ";
}
oval+=group.name;
attendeeField.simpleClickChange(true);
this.i_simpleClickField.value(oval);
attendeeField.simpleClickChange(false);
}
attendeeField=null;
}
EventDisplay.prototype.handleEmailAllClick=function(e) {
var to_addrs=[];
var att=this.i_event.attendees();
for(var x=0; x < att.length; x++) {
to_addrs.push(att[x].defaultAlias());
}
var to_str=to_addrs.join(", ");
ApplicationEmail.newEmail(undefined, undefined, to_str, undefined);
};
EventDisplay.prototype.handleRemoveAttendees=function(e) {
var grid=this.i_tab_content.attendees.grid;
var sel=grid.getSelected();
if(sel.length > 0) {
var host_found=false;
for(var x=0; x < sel.length;++x) {
if(sel[x].status()==0) {
host_found=true;
break;
}
}
if(host_found) {
DialogManager.alert("The host of this meeting cannot be removed.");
} else {
this.i_event.removeAttendees(sel, this.instance());
}
} else {
DialogManager.alert("Please select an attendee to remove.");
}
}
EventDisplay.prototype.getAttachmentTabContent=function() {
if(this.i_tab_content.attachment==undefined) {
this.i_tab_content.attachment={};
var div=document.createElement('div');
this.i_tab_content.attachment.div=div;
var cm=new ContextMenu(150);
var cmfi=cm.addItem(new ContextMenuFileItem("File on this computer..."));
this.i_attach_button=new UniversalButton("Attach", "list_attachment", 16, cm, true, 25, undefined, "Attach information to this event");
div.appendChild(this.i_attach_button.getButton());
this.i_attach_button.i_invisibleButton=new InvisibleUploadButton(this.i_attach_button.i_button);
this.i_attach_button.i_invisibleButton.badRegions([[58, 0, 30, 30]]); 
this.i_handlers.push(EventHandler.register(this.i_attach_button.i_invisibleButton, "onupload", this.handleAttachLocalFile, this));
this.i_handlers.push(EventHandler.register(cmfi, "onupload", this.handleAttachLocalFile, this));
var upload=new UniversalAttachmentManager(undefined, undefined, false);
this.i_tab_content.attachment.attachment_manager=upload;
if(!_LITE_) {
if (SystemCore.hasApp(1015) && SystemCore.hasApp(1009)) {
cm.addItem(new ContextMenuItem("Online file...", true, this.handleAttachOnline));
}
}
this.i_handlers.push(EventHandler.register(upload, "onremove", this.handleAttachedFileRemove, this));
this.i_handlers.push(EventHandler.register(upload, "onupdate", this.handleAttachmentManagerUpdate, this));
this.i_handlers.push(EventHandler.register(upload, "onuploadcomplete", this.handleAttachedFileUploadComplete, this));
upload.objectType("0");
upload.uploadURI("/cgi-bin/phoenix/AttachmentDispatchCGI.fcg");
upload.width(500);
upload.maximumDisplay(10);
div.appendChild(upload.getManager());
}
return this.i_tab_content.attachment.div;
};
EventDisplay.prototype.handleAttachedFileUploadComplete=function(e) {
var attach=this.i_tab_content.attachment.attachment_manager;
if (attach) {
if (attach.overflow() && e && e.file) {
attach.removeFile(e.file);
alert("Unable to upload "+(e.file.name!=undefined ? e.file.name() : "file")+":\n"+"You are over your allowed attachment quota.\nPlease remove some files before attempting to add this one again.")			
}
}
}
EventDisplay.prototype.handleAttachLocalFile=function(e) {
fname="";
for (var z=e.input.value.length - 1; z >=0; z--) {
if (e.input.value.charAt(z)=="\\" || e.input.value.charAt(z)=="/") {
break;
}
fname=e.input.value.charAt(z)+fname;
}
if (this.i_tab_content.attachment.attachment_manager.overflow()) {
alert("Unable to upload "+fname+":\n"+"You are over your allowed attachment quota.\nPlease remove some files before attempting to add this one again.")
} else if (this.i_tab_content.attachment.attachment_manager.readOnly()==true) {
alert("Unable to upload "+fname+":\n"+"You do not have permission to attach files to this event.");
} else {
var f=this.i_tab_content.attachment.attachment_manager.addFile(new UniversalFileAttachment(fname, 0, 1));
f.uploadFile(e.input);
}
};
EventDisplay.prototype.handleAttachOnline=function(e) {
if (EventDisplay.obj.i_tab_content.attachment.attachment_manager.overflow()) {
alert("Unable to add more files\n"+"You are over your allowed attachment quota.\nPlease remove some files before attempting to add again.")
} else if (EventDisplay.obj.i_tab_content.attachment.attachment_manager.readOnly()==true) {
alert("Unable to upload "+fname+":\n"+"You do not have permission to attach files to this event.");
} else {
window.open("/Ioffice/FilingCabinet/attach_items_event_nav.asp?unm="+user_prefs['user_name']+"&sid="+user_prefs['session_id']+"&cf="+''+"&root_id="+''+"&emAttIDList="+escape(EventDisplay.obj.i_tab_content.attachment.attachment_manager.attachmentList()), "",
'toolbar=0,location=0,directories=0,status=0,menubar=0,'+'scrollbars=0,resizable=0,width=490,height=270');
}
}
EventDisplay.prototype.addOnlineAttachment=function(attid, size, name) {
var event=EventDisplay.obj.i_event;
var tmpid=EventDisplay.obj.csid()+attid;
EventDisplay.obj.i_ofiles[tmpid]=EventDisplay.obj.i_tab_content.attachment.attachment_manager.addFile(new UniversalFileAttachment(name, parseInt(size), 1, tmpid));
var dn=new DataNode("params");
if (event!=undefined && event.isNew()!=undefined && event.id()!=undefined) {
dn.addNode(new DataNode("csid", EventDisplay.obj.csid()));
dn.addNode(new DataNode("attid", attid));
dn.addNode(new DataNode("objectId", (event.isNew() ? 0 : event.id())));
dn.addNode(new DataNode("attachmentname", name));
dn.addNode(new DataNode("staged", (event.isNew() ? 1 : 0)));		
dn.addNode(new DataNode("objectType", event.eventType())); 
if (!window.opener) {
var request=new RequestObject("CalendarAttachment", "finishAttachment", dn);
}
else {
var request=PopoutWindow.createObject("RequestObject");
request.application("CalendarAttachment");
request.method("finishAttachment");
request.data(dn);
}
this.i_handlers.push(EventHandler.register(request, "oncomplete", EventDisplay.obj.handleAttachOnlineComplete, EventDisplay.obj));
this.i_handlers.push(EventHandler.register(request, "onerror", EventDisplay.obj.handleAttachOnlineError, EventDisplay.obj));
request.execute();
}
return true;	
}
EventDisplay.prototype.handleAttachOnlineComplete=function(e) {
var data=e.response.data();
var eventattachments=data.xPath("eventAttachment");
var eventattach=eventattachments[0];
var at_eventid=eventattach.children("objectId", 0, true);
var at_csid=eventattach.children("csid", 0, true);
var at_attid=eventattach.children("attid", 0, true);
var at_newid=eventattach.children("attachmentid", 0, true);
if (at_csid!=undefined && at_attid!=undefined) {
var tmpid=at_csid+at_attid;
var file=EventDisplay.obj.i_ofiles[tmpid];
file.id(at_newid);
}
if (file!=undefined) {
EventDisplay.obj.i_tab_content.attachment.attachment_manager.completeAttachment(file.fid(), e.newid, file.size());
EventDisplay.obj.i_ofiles[tmpid]=undefined;
}
}
EventDisplay.prototype.handleAttachOnlineError=function(e) {
var data=e.request.data();
var at_eventid=data.children("objectId", 0, true);
var at_csid=data.children("csid", 0, true);
var at_attid=data.children("attid", 0, true);
if (at_csid!=undefined && at_attid!=undefined) {
var tmpid=at_csid+at_attid;
var file=EventDisplay.obj.i_ofiles[tmpid];	
}
if (file!=undefined) {
var errorDialog=new Dialog("There was an error attaching your file to this event.  The file could not be attached.  <br><br>Please try again later.", "Attach Online File Error", null, true);
errorDialog.show();
file.cancel();
EventDisplay.obj.i_ofiles[tmpid]=undefined;
}
}
EventDisplay.prototype.handleAttachedFileRemove=function(e) {
this.i_event.removeAttachment(e.file.id());
};
EventDisplay.prototype.handleAttachmentManagerUpdate=function(e) {
this.i_tab_attachments.name("Attachments ("+e.count+")");
};
EventDisplay.prototype.oldresize=function(o) {
var width=parseInt(o.originalScope.effectiveWidth() - WindowManager.window_border_width - 0);
var height=parseInt(o.originalScope.effectiveHeight() - (o.originalScope.titleBar()!==undefined ? o.originalScope.titleBar().height() : 0) - WindowManager.window_border_width - 0);
this.resize({width: width, height: height});
}
EventDisplay.prototype.resize=function(o) {
var width=o.width;
var height=o.height;
if(typeof width!="undefined") {
this.width(width);
this.getShadeDiv().style.width=width;
}
if(typeof height!="undefined") {
this.height(height);
this.getShadeDiv().style.height=height;
o.height=o.height - (this.i_showToolbar ? this.i_toolbar.height() : 0);
}
};
EventDisplay.prototype.width=function(width) {
if(width!=undefined) {
this.i_width=width;
if(this.i_showToolbar) {
this.i_toolbar.width(width);
}
if(this.i_content!=null) {
this.i_content.style.width=width+"px";
var tab_content_width=width;
if(this.i_simple_click_showing) {
tab_content_width -=this.i_simple_click_width;
}
if(this.i_tabs!=undefined) {
this.i_tabs.width(tab_content_width);
}
if (this.i_notification_bar!=undefined) {
this.i_notification_bar.width(width);
}
if(this.i_tab_content.attendees!=undefined) {
this.i_tab_content.attendees.addForm.width(this.i_tabs.contentWidth());
this.i_tab_content.attendees.mForm.width(this.i_tabs.contentWidth());
this.i_tab_content.attendees.toolbar.width(this.i_tabs.contentWidth());
this.i_tab_content.attendees.toolbar_attendee.width(this.i_tabs.contentWidth());
this.i_tab_content.attendees.grid.width(this.i_tabs.contentWidth());
}
if(this.i_tab_content.appointment!=undefined && this.i_tab_content.appointment.lform!=undefined) {
this.i_tab_content.appointment.lform.width(this.i_tabs.contentWidth());
}
if(this.i_tab_content.attachment!=undefined) {
this.i_tab_content.attachment.attachment_manager.width(this.i_tabs.contentWidth());
}
}
}
return this.i_width;
};
EventDisplay.prototype.resizeDescription=function() {
if(this.i_inputs!=undefined && this.i_inputs.DESCRIPTION!=undefined) {
var height=this.i_height;
if(height!=undefined) {
height -=this.i_tab_content.appointment.lform.height() - this.i_inputs.DESCRIPTION.height();
if(this.i_popoutWindow!=undefined && this.i_popoutWindow.isExternal()) {
height -=(document.all ? 36 : 32);
} else {
height -=(document.all ? 45 : 41);
}
if(this.i_windowObject!=undefined && this.i_windowObject.titleBar()!=undefined) {
height -=this.i_windowObject.titleBar().height();
}
if(this.i_notification_bar.visible()) {
height -=this.i_notification_bar.height();
}
if(height < 22) {
height=22;
}
this.i_inputs.DESCRIPTION.height(height);
}
}
}
EventDisplay.prototype.height=function(height) {
if(height!=undefined) {
this.i_height=height;
var h=height - (this.i_showToolbar ? this.i_toolbar.height() : 0);
if(this.i_content!=null && this.i_tab_content.attendees!=undefined) {
this.i_content.style.height=h+"px";
if(this.i_tabs!=undefined) {
if(this.i_simple_click!=undefined) {
this.i_simple_click.height(h - (this.i_notification_bar.visible() ? this.i_notification_bar.height() : 0) - (document.all ? 6 : 0));
}
this.i_tabs.height(h - (this.i_notification_bar.visible() ? (this.i_notification_bar.height() - 1) : 1) - 0);
var grid_height=this.i_tabs.contentHeight() - (this.i_meetingOwner ? this.i_tab_content.attendees.addForm.height()+this.i_tab_content.attendees.toolbar.height() :
this.i_tab_content.attendees.mForm.height()+this.i_tab_content.attendees.toolbar_attendee.height());
if (grid_height < 30) {
grid_height=30;
}
this.i_tab_content.attendees.grid.height(grid_height);
this.i_tab_content.attendees.containerDiv.style.height=this.i_tab_content.attendees.mForm.height()+"px";
this.resizeDescription();
}
}
}
return this.i_height;
};
EventDisplay.prototype.loadEvent=function(event, clear_state) {
if(clear_state==undefined) {
clear_state=true;
}
this.i_event=event;
if (typeof event.reminder()=="object" && event.reminder()!=null) {
this.i_savedReminderTime=event.reminder().interval();
}
if(clear_state==true) {
this.i_last_state.set=false;
this.i_last_state_meta.set=false;
if(this.i_tabs) {
if(this.i_tabs.activeTab()!=this.i_tab_app) {
this.i_tabs.activeTab(this.i_tab_app);
}
}
}
if(event.parentDataModel()!=undefined) {
this.i_dm=event.parentDataModel();
}
if(this.i_load_details_event) {
this.i_load_details_event=!this.i_load_details_event.unregister();
}
if(this.i_event_change_handler) {
this.i_event_change_handler=!this.i_event_change_handler.unregister();
}
this.i_load_details_event=EventHandler.register(this.i_event, "onloaddetails", this.handleLoadEventDetails, this);
if (!this.i_event.isNew()) {
this.i_load_attendees_event=EventHandler.register(this.i_event, "onattendees", this.handleLoadAttendees, this);
this.i_tab_content.attendees.grid.dataModel(this.i_event.getAttendeesDM());
this.i_event_att_l=EventHandler.register(this.i_event.getAttendeesDM(), "onrefresh", this.handleAttendeeChange, this);
} else {
this.i_tabs.removeTab(this.i_tab_attendees);
}
this.i_load_reminder_event=EventHandler.register(this.i_event, "onreminderload", this.handleLoadReminder, this);
this.i_load_files_event=EventHandler.register(this.i_event, "onfilesload", this.handleLoadFiles, this);
if (!this.i_event.isNew()) {
this.i_remind_button.enabled(false); 
this.i_event.loadDetails(true, true, false, true, this.instance()); 
} else if(this.i_dm && this.i_dm.defaultReminderInterval) {
this.setReminderContext(parseInt(this.i_dm.defaultReminderInterval()));
}
this.refreshData();	
this.i_event.getAttendeesDM().fireRefresh(); 
}
EventDisplay.prototype.handleAttendeeChange=function(e) {
this.refreshAttendeeTabName();
}
EventDisplay.prototype.refreshAttendeeTabName=function() {
var att=(!this.i_event ? 0 : this.i_event.getAttendeesDM().entries());
var label="Attendees (";
if (!this.i_event || (att==0 && this.i_event.isNew())) label+="loading)";
else label+=att+")";
this.i_tab_attendees.name(label);
}
EventDisplay.prototype.handleLoadEventDetails=function(e) {
if(this.i_load_details_event) {
this.i_load_details_event=!this.i_load_details_event.unregister();
}
if (this.instance()==true) {
this.i_tab_recurrence.enabled(false);
}
this.refreshData(); 
this.i_event_change_handler=EventHandler.register(this.i_event, "onchange", this.handleEventChange, this);
}
EventDisplay.prototype.handleLoadAttendees=function(e) {
if(this.i_load_attendees_event) {
this.i_load_attendees_event=!this.i_load_attendees_event.unregister();
}
this.refreshData();
}
EventDisplay.prototype.handleLoadReminder=function(e) {
if (this.saving()) {
this.closeEvent();
} else {
var reminder=this.i_event.reminder();
if (typeof reminder=="object" && reminder!=null) {
this.i_savedReminderTime=reminder.interval();
}
if (this.i_event.isNew() || this.i_event.access()=="All") {
this.i_remind_button.enabled(true);
this.refreshReminder();
}
}
}
EventDisplay.prototype.handleLoadFiles=function(e) {
if(this.i_load_files_event) {
this.i_load_files_event=!this.i_load_files_event.unregister();
}
this.refreshFiles();
}
EventDisplay.prototype.handleEventChange=function(e) {
if(!this.edit()) {
this.refreshData();
}
}
EventDisplay.prototype.refreshData=function() {
this.i_in_refresh=true;
var ins=this.i_inputs;
if(this.i_last_state.set!=false) {
ins.APPTATTENDEES.value(this.i_last_state.APPTATTENDEES);
ins.SUBJECT.value(this.i_last_state.SUBJECT);
var s=(this.i_last_state.SUBJECT.length > 0 ? this.i_last_state.SUBJECT : "Event");
if (this.i_popoutWindow!=undefined && this.i_popoutWindow.i_last_external && 
this.i_popoutWindow.i_external_popup_object!=null) {
this.i_popoutWindow.i_external_popup_object.windowTitle(s);
}
else {
this.windowTitle(s);
}
ins.STARTTIME.value(this.i_last_state.STARTTIME);
ins.ENDTIME.value(this.i_last_state.ENDTIME);
ins.LOCATION.value(this.i_last_state.LOCATION);
ins.DESCRIPTION.value(this.i_last_state.DESCRIPTION);
ins.PRIVATE.value([(this.i_last_state.PRIVATE=="private" ? "private" : "")]);
ins.ATTENDEESRESPONDEMAIL.value([(this.i_last_state.ATTENDEESRESPONDEMAIL=="email" ? "email" : "")]);
this.refreshRecurrence(new Recurrence(this.i_last_state.RECURRENCE));
this.allday(this.i_last_state.allday);
if(this.i_last_state.STAGEDFILES) {
this.refreshFiles();
}
}else if(this.i_event!=undefined) {
if(this.i_event.isNew()) {
ins.APPTATTENDEES.value(this.i_event.attendees());
}
ins.SUBJECT.value(this.i_event.title());
if (this.i_popoutWindow!=undefined && this.i_popoutWindow.i_last_external) {
}
else {
this.windowTitle(this.i_event.title()!=undefined ? this.i_event.title() : "Event");
}
if (this.i_start_instance_date_set==false) {
ins.STARTTIME.value(this.i_event.startTime().copy());
ins.STARTTIME.time(!this.i_event.allDay());
if(this.i_event.endTime()) {	
ins.ENDTIME.value(this.i_event.endTime().copy());
}
this.i_start_instance_date_set=this.instance(); 
}
if(this.i_event.allDay()) {
ins.STARTTIME.value(floorDay(this.i_event.startTime().copy()));
if (!(this.allDayDuration() > 1)) {
ins.ENDTIME.value(floorDay(this.i_event.startTime().copy()));
} else {
ins.ENDTIME.value(addDays(floorDay(this.i_event.endTime().copy()), -1));
}
ins.ENDTIME.time(false);
this.i_duration -=1440;
}
ins.LOCATION.value(this.i_event.location());
ins.DESCRIPTION.value(this.i_event.description());
ins.PRIVATE.value([(this.i_event.personal()==true ? "private" : "")]);
ins.ATTENDEESRESPONDEMAIL.value([(this.i_event.emailHost()==true ? "email" : "")]);
if (!this.i_event.isNew()) {
var modName=this.i_event.lastModifierDisplayName();
var modTimeStamp=iCaltoUTCDate(this.i_event.lastModifiedDate());
if (modTimeStamp) {
var modDate=getTimeString(modTimeStamp)+", "+getFullDateString(modTimeStamp)+" ("+getUTCString(modTimeStamp)+")";
ins.LASTMOD.value("Last modified "+(modName ? "by "+modName : "")+" at "+modDate);
ins.LASTMOD.text("Last modified "+(modName ? "by "+modName : "")+" at "+modDate);
}
}
var recurrence=new Recurrence(this.i_event.recurrence());
recurrence.setDefaultsFromEvent(this.i_event);
this.refreshRecurrence(recurrence);
this.allday(this.i_event.allDay());
} 
this.refreshAttendeeTabName();
this.updateDurationFromDates();
if(this.i_event!=undefined) {
var isShared=(this.i_event.parentDataModel!=undefined && this.i_event.parentDataModel().ownerId()!=user_prefs['user_id']); 
var isReadOnly=(this.i_event.access!=undefined && this.i_event.access()!=CalendarEvent.Permission.full ? true : false);  
var showMeetingReply=(isShared && isReadOnly ? false : true);
if(showMeetingReply==true) {
this.refreshNotificationBar({
meetingRequestState: this.i_event.meetingRequestState(), 
conflict: this.i_event.conflict()
});
}
this.setMeetingRequestOptionValue(parseInt(this.i_event.meetingRequestState()));
if(showMeetingReply==false) {
this.i_meetingOwner=false;
this.i_tab_content.attendees.ownerContent.style.display="none";
this.i_tab_content.attendees.recipientContent.style.display="none";
}else if(this.i_event.meetingRequestState() > 0) {
this.i_meetingOwner=false;
this.i_tab_content.attendees.ownerContent.style.display="none";
this.i_tab_content.attendees.recipientContent.style.display="";
}else{
this.i_meetingOwner=true;
this.i_tab_content.attendees.ownerContent.style.display="";
this.i_tab_content.attendees.recipientContent.style.display="none";
}
this.refreshReminder();
this.i_tab_content.attachment.attachment_manager.objectId(this.i_event.id());
this.i_tab_content.attachment.attachment_manager.stage(this.i_event.isNew());
}
this.clearAllForms();
if(this.i_last_state_meta.set!=false) {
this.i_dm=this.i_last_state_meta.dm;
this.edit(this.i_last_state_meta.edit);
this.instance(this.i_last_state_meta.instance);
}else if(this.i_event!=undefined) {
if(this.i_event.isNew()) {
this.edit(true);
}
}
if(this.allowEdit()) {
this.i_edit_button.enabled(true);
this.i_delete_button.enabled(true);
}else{
this.i_edit_button.enabled(false);
this.i_delete_button.enabled(false);
}
this.updateAttachState();
this.width(this.width());
this.height(this.height());
this.i_in_refresh=false;
this.handleReady();
}
EventDisplay.prototype.resetAllForms=function() {
this.i_tab_content.appointment.lform.reset();
this.i_tab_content.attendees.addForm.reset();
this.i_tab_content.attendees.mForm.reset();
this.i_tab_content.recurrence.form.reset();
}
EventDisplay.prototype.clearAllForms=function() {
this.i_tab_content.appointment.lform.clearModified();
this.i_tab_content.attendees.addForm.clearModified();
this.i_tab_content.attendees.mForm.clearModified();
this.i_tab_content.recurrence.form.clearModified();	
}
EventDisplay.prototype.isModifiedAllForms=function() {
return (this.i_tab_content.appointment.lform.isModified() || 
this.i_tab_content.attendees.addForm.isModified() || 
this.i_tab_content.attendees.mForm.isModified() || 
this.i_tab_content.recurrence.form.isModified());
}
EventDisplay.prototype.refreshRecurrence=function(r) {
var i=this.i_inputs;
i.RTYPE_OPTION.value(r.type);
i.RTYPE_DAILY_EVERYWEEKDAY_RADIO.value((r.daily_every_weekday ? "t" : ""));
i.RTYPE_DAILY_EVERYXDAYS_RADIO.value((!r.daily_every_weekday ? "t" : ""))
i.RTYPE_DAILY_EVERYXDAYS_INPUT.value(r.daily_number_of_days);
i.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value(r.weekly_number_of_weeks);
var days=[];
for(var x=0; x < r.weekly_days.length; x++) {
if(r.weekly_days[x]) {
days.push(x);
}
}
i.RTYPE_WEEKLY_EVERYXWEEKS_CHECKS.value(days);
i.RTYPE_MONTHLY_DAYX_DAY_INPUT.value(r.monthly_number_of_days);
i.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value(r.monthly_number_of_months);
i.RTYPE_MONTHLY_DAYX_RADIO.value((!r.monthly_pattern ? "t" : ""));
i.RTYPE_MONTHLY_DAYEVERY_RADIO.value((r.monthly_pattern ? "t" : ""));
i.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.value(r.monthly_pattern_order);
i.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT.value(r.monthly_pattern_type);
i.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value(r.monthly_pattern_number_of_months);
i.RTYPE_YEARLY_EVERYTH_RADIO.value((r.yearly_pattern ? "t" : ""));
i.RTYPE_YEARLY_EVERYX_RADIO.value((!r.yearly_pattern ? "t" : ""));
i.RTYPE_YEARLY_EVERYTH_TH_INPUT.value(r.yearly_pattern_order);
i.RTYPE_YEARLY_EVERYTH_DAY_INPUT.value(r.yearly_pattern_type);
i.RTYPE_YEARLY_EVERYX_INPUT.value(r.yearly_day);
if(r.occurrence_ends) {
if(r.occurrence_has_end_date) {
i.REND_OPTIONS.value(2); 
}else{
i.REND_OPTIONS.value(1); 
}
}else{
i.REND_OPTIONS.value(0); 
}
i.RENDAFTER_INPUT.value(r.occurrence_count);
i.RENDDATE.value(r.occurrence_end_date);
var desc=r.getDescription(this.i_inputs.STARTTIME.value());
i.OCCURS.value((r.type > -1) ? desc.occurs : "Once");
i.ENDS.value((r.type > -1) ? desc.ends : getNumericDateString(this.i_inputs.ENDTIME.value()));
this.setRecurrenceDisplay(null);
}
EventDisplay.prototype.refreshNotificationBar=function(options) {
var level=NotificationBar.INFO;
var text="";
var display=false;
var buttons=[];
if(options==undefined) {
options={
meetingRequestStatus: null, 
conflict: false,
reminder: false
};
}else{
if(options.meetingRequestState==undefined) {
options.meetingRequestState=this.i_last_notification_bar_options.meetingRequestState;
}
if(options.conflict==undefined) {
options.conflict=this.i_last_notification_bar_options.conflict;
}
}
this.i_last_notification_bar_options=options;
var meetingRequestStatus=parseInt(options.meetingRequestState);
var conflict=options.conflict;
if(conflict) {
level=NotificationBar.WARNING;
text="This meeting conflicts with your schedule."
display=true;
}else if(meetingRequestStatus==1 || meetingRequestStatus==3) {
level=NotificationBar.INFO;
text="This meeting is pending your response.";
display=true;
if(this.i_notification_reply_buttons==undefined) {
var reply=new UniversalButton("Reply", "", 1, undefined, true, 22, "left", "Jump to attendees tab to reply");
this.i_notification_reply_buttons=[reply];
this.i_handlers.push(EventHandler.register(reply, "onclick", this.handleNotifcationReplyClick, this));
}
buttons=this.i_notification_reply_buttons;
}
if(display) {
this.i_notification_bar.level(level);
this.i_notification_bar.text(text);
this.i_notification_bar.visible(true);
this.i_notification_bar.buttons(buttons);
}else{
this.i_notification_bar.visible(false);
this.i_notification_bar.buttons([]);
}
this.height(this.height());
}
EventDisplay.prototype.refreshReminder=function() {
if (!this.saving()) {
var defaultValue=this.i_reminder_value;
if (defaultValue==undefined) {
if (typeof this.i_dm.defaultReminderInterval=="function" && this.i_dm.defaultReminderInterval()!=undefined) {
defaultValue=this.i_dm.defaultReminderInterval();
} else {
defaultValue=-1;
}
}
var reminder=this.i_event.reminder();
if (reminder==undefined || reminder==null) {
this.setReminderContext(defaultValue);
} else {
this.setReminderContext(reminder.interval());
}
}
}	
EventDisplay.prototype.refreshFiles=function() {
if(this.i_last_state.set==true && this.i_last_state.STAGEDFILES) {
var files=this.i_last_state.STAGEDFILES;
}else{
var files=this.i_event.files();
}
this.i_tab_content.attachment.attachment_manager.clearFiles();
for(var x=0; x < files.length; x++) {
var f=new UniversalFileAttachment();
f.copy(files[x]);
this.i_tab_content.attachment.attachment_manager.addFile(f);
}
this.updateAttachState();
}
EventDisplay.prototype.updateAttachState=function() {
if(this.allowEdit() || this.i_event.isNew()) {
this.i_attach_button.visible(true);
this.i_tab_content.attachment.attachment_manager.readOnly(false);
} else {
this.i_attach_button.visible(false);
this.i_tab_content.attachment.attachment_manager.readOnly(true);
}
}
EventDisplay.prototype.handleNotifcationReplyClick=function(e) {
this.i_tabs.activeTab(this.i_tab_attendees);
}
EventDisplay.prototype.saveEvent=function() {
var e=this.i_event;
var i=this.i_inputs;
e.title(i.SUBJECT.value());
if(i.DURATION.value()=="allday") {
e.startTime(EventDisplay.dateCopy(i.STARTTIME.value()), EventDisplay.dateCopy(addDay(i.ENDTIME.value())));
} else {
e.startTime(EventDisplay.dateCopy(i.STARTTIME.value()), EventDisplay.dateCopy(i.ENDTIME.value()));
}
e.location(i.LOCATION.value());
e.description(i.DESCRIPTION.value());
e.allDay(i.DURATION.value()=="allday");
var att=this.getAttendeesFromFields();
var useAtten=PopoutWindow.createObject('Array');
for (var x=0; x < att.length; x++) {
var att_str=att[x];
att_str=trim(att_str);
if(att_str.length > 0) {
useAtten[useAtten.length]=EventDisplay.newEventAttendee(Math.random(), undefined, att_str, 1);
}
}
if (useAtten.length > 0) {
e.attendees(useAtten.concat(e.attendees()));
}
if(i.RTYPE_OPTION.value() > -1) {
var r=this.buildRecurrenceObjectFromForm();
if(r.type==1) {	
var days_selected=false;
for(var x=0; x < r.weekly_days.length; x++) {
if(r.weekly_days[x]==true) days_selected=true;
}
if(!days_selected) {
DialogManager.alert('For weekly recurrence, please select at least one weekday.',
'Invalid Recurrence', undefined, true, true);
this.i_tabs.activeTab(this.i_tab_recurrence);
return false;
}
}
e.recurrence(r.toRecurrenceString());
}else{
e.recurrence(false);
}
e.personal(i.PRIVATE.value()[0]=="private");
e.emailHost(i.ATTENDEESRESPONDEMAIL.value()[0]=="email");
if(e.isNew()) {
var pfiles=this.i_tab_content.attachment.attachment_manager.files();
var nfiles=PopoutWindow.createObject('Array');
for(var x=0; x < pfiles.length; x++) {
nfiles.push(EventDisplay.fileAttachmentCopy(pfiles[x]));
}
e.stagedFiles(nfiles);
}else{
e.stagedFiles(PopoutWindow.createObject('Array'));
}
if(e.parentDataModel()!=this.i_dm) {
this.i_dm.addEvent(e);
}
this.i_last_state.set=false;
if (this.i_save_event_listener)	 this.i_save_event_listener=!this.i_save_event_listener.unregister();
if (this.i_save_event_error_listener)	 this.i_save_event_error_listener=!this.i_save_event_error_listener.unregister();
if (this.i_load_attendees_event) this.i_load_attendees_event=!this.i_load_attendees_event.unregister();
if (this.i_load_files_event)	 this.i_load_files_event=!this.i_load_files_event.unregister();
if (this.i_event_att_l)			 this.i_event_att_l=!this.i_event_att_l.unregister();
if(e.recurrence() && !this.instance()) {
this.i_save_event_listener=EventHandler.register(this.i_dm, "onrecurrencesave", this.handleEventRecurrenceSave, this);
} else {
this.i_save_event_listener=EventHandler.register(e, "onsave", this.handleEventSave, this);
}
this.i_load_reminder_event=EventHandler.register(e, "onreminderload", this.handleLoadReminder, this);
if (this.i_windowObject && (this.i_popoutWindow!=undefined && !this.i_popoutWindow.isExternal())) {
this.i_save_event_error_listener=EventHandler.register(e, "onsaveerror", this.handleEventSaveError, this);
this.i_notif_id=Notifications.add("Saving Event...");
this.i_windowObject.getFloatingWindow().style.display="none";
this.i_windowObject.visible(false);
}
e.save(this.instance());
return true;
}
EventDisplay.prototype.getAttendeesFromFields=function() {
var att=[];
if(typeof(SimpleClickDataCache)!="undefined") {
att=SimpleClickDataCache.validate_recipients(this.i_inputs.APPTATTENDEES.value());
}else{
att=this.i_inputs.APPTATTENDEES.value();
}
if (att!=undefined) {
att=att.replace(/[\n\r]/g, ",").split(',');
} else {
att=[];
}
return att;
}
EventDisplay.prototype.buildRecurrenceObjectFromForm=function() {
var r=new Recurrence();
var i=this.i_inputs;
r.type=i.RTYPE_OPTION.value();
if(r.type==0) { 
r.daily_every_weekday=(i.RTYPE_DAILY_EVERYWEEKDAY_RADIO.value()=="t" ? true : false);
r.daily_number_of_days=i.RTYPE_DAILY_EVERYXDAYS_INPUT.value();
}else if(r.type==1) { 
r.weekly_number_of_weeks=i.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.value();
var days=i.RTYPE_WEEKLY_EVERYXWEEKS_CHECKS.options();
r.weekly_days=[];
for(var x=0; x < days.length; x++) {
if(days[x].checked()) {
r.weekly_days.push(true);
}else{
r.weekly_days.push(false);
}
}
}else if(r.type==2) { 
r.monthly_number_of_days=i.RTYPE_MONTHLY_DAYX_DAY_INPUT.value();
r.monthly_number_of_months=i.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.value();
r.monthly_pattern=(i.RTYPE_MONTHLY_DAYEVERY_RADIO.value()=="t" ? true : false);
r.monthly_pattern_order=i.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.value();
r.monthly_pattern_type=i.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT.value();
r.monthly_pattern_number_of_months=i.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.value();
}else if(r.type==3) { 
r.yearly_pattern=(i.RTYPE_YEARLY_EVERYTH_RADIO.value()=="t" ? true : false);
r.yearly_pattern_order=i.RTYPE_YEARLY_EVERYTH_TH_INPUT.value();
r.yearly_pattern_type=i.RTYPE_YEARLY_EVERYTH_DAY_INPUT.value();
r.yearly_day=i.RTYPE_YEARLY_EVERYX_INPUT.value();
}
r.occurrence_ends=(i.REND_OPTIONS.value()==0 ? false : true);
r.occurrence_has_end_date=(i.REND_OPTIONS.value()==2 ? true : false);		
r.occurrence_count=i.RENDAFTER_INPUT.value();
r.occurrence_end_date=i.RENDDATE.value();
return r;
}
EventDisplay.prototype.handleEventSave=function(e) {
this.saving(true);
var saved=this.setReminder(this.i_reminder_value, true);
if (this.i_save_event_listener) this.i_save_event_listener=!this.i_save_event_listener.unregister();
if (this.i_save_event_error_listener) this.i_save_event_error_listener=!this.i_save_event_error_listener.unregister();
if (this.i_popoutWindow!=undefined && !this.i_popoutWindow.isExternal()) {
Notifications.end(this.i_notif_id);
}
if (!saved) this.closeEvent();
}
EventDisplay.prototype.handleEventSaveError=function(e) {
if (this.i_windowObject && (this.i_popoutWindow!=undefined && !this.i_popoutWindow.isExternal())) {
this.saving(false);
Notifications.end(this.i_notif_id, undefined, true);
DialogManager.alert("Saving event failed.");
this.i_windowObject.getWindow().removeChild(this.i_shadeDiv);
this.i_shadeDiv=undefined;
this.i_windowObject.getFloatingWindow().style.display="";
this.i_windowObject.visible(true);
}
if (this.i_save_event_listener) this.i_save_event_listener=!this.i_save_event_listener.unregister();
if (this.i_save_event_error_listener) this.i_save_event_error_listener=!this.i_save_event_error_listener.unregister();
}
EventDisplay.prototype.handleEventRecurrenceSave=function(e) {
var events=e.events;
var now=new Date();
var start_time=undefined;
for(var x=0; x < events.length;++x) {
if(events[x].startTime().valueOf() > now.valueOf()) {
start_time=events[x].startTime().copy();
break;
}
}
this.saving(true);
var saved=this.setReminder(this.i_reminder_value, true, start_time);
if (this.i_save_event_listener) this.i_save_event_listener=!this.i_save_event_listener.unregister();
if (this.i_save_event_error_listener) this.i_save_event_error_listener=!this.i_save_event_error_listener.unregister();
if (this.i_popoutWindow!=undefined && !this.i_popoutWindow.isExternal()) {
Notifications.end(this.i_notif_id);
}
if (!saved) this.closeEvent();
}
EventDisplay.prototype.dataModel=function(dm) {
if(dm!==undefined) {
this.i_dm=dm;
if(this.i_event) {
if(this.i_event.isNew()) {
if(this.i_dm && this.i_dm.defaultReminderInterval) {
this.setReminderContext(parseInt(this.i_dm.defaultReminderInterval()));
}
}
}
}
return this.i_dm;
}
EventDisplay.prototype.allDayDuration=function() {
if (this.i_all_day_duration==undefined && this.i_event && this.i_event.endTime()) {
var duration=Math.floor((this.i_event.endTime().valueOf() - this.i_event.startTime().valueOf()) / 86400000); 
this.i_all_day_duration=duration;
}
return this.i_all_day_duration;
}
EventDisplay.prototype.allowEdit=function() {
return ((this.i_event.isNew() &&
this.i_dm!=undefined &&
this.i_dm.access!=undefined && 
this.i_dm.access()=="All") ||
(this.i_event!=undefined &&
this.i_event.parentDataModel().access!=undefined &&
this.i_event.parentDataModel().access()=="All" &&
this.i_event.meetingRequestState()==0));
};
EventDisplay.prototype.edit=function(edit, new_ev_shortcut) {
if(edit!=undefined) {
if((new_ev_shortcut==false) || (new_ev_shortcut==undefined)) {
if(!this.allowEdit()) {
edit=false;
}
}
if (this.i_edit_mode!=edit) {
this.i_edit_mode=edit;
}
this.updateMode();
}
return this.i_edit_mode;
}
EventDisplay.prototype.instance=function(state) {
if (state!=undefined) {
this.i_ev_instance=state;
}
return this.i_ev_instance;
}
EventDisplay.prototype.updateMode=function() {
if(this.i_edit_mode==true) {
this.i_edit_button.visible(false);
this.i_save_button.visible(true);
this.i_cancel_button.visible(true);
this.i_close_button.visible(false);
}else{
this.i_edit_button.visible(true);
this.i_save_button.visible(false);
this.i_cancel_button.visible(false);
this.i_close_button.visible(true);
if(this.i_simple_click_showing) {
this.handleAttendeeButtonClick();
}
}
if(this.i_tab_content.appointment!=undefined) {
this.i_tab_content.appointment.lform.staticMode(!this.i_edit_mode);
this.i_tab_content.attendees.addForm.staticMode(!this.i_edit_mode);
this.i_tab_content.recurrence.form.staticMode(!this.i_edit_mode);
if(this.i_edit_mode) {
this.i_tab_content.recurrence.form.removeSection(this.i_tab_content.recurrence.display_section);
this.i_tab_content.recurrence.form.addSection(this.i_tab_content.recurrence.rsec);
this.setRecurrenceDisplay(null);			
} else {
this.i_tab_content.recurrence.form.removeSection(this.i_tab_content.recurrence.rsec);
this.i_tab_content.recurrence.form.addSection(this.i_tab_content.recurrence.display_section);
}
this.i_tab_content.appointment.attendeesRow.getRow().style.display=(this.i_edit_mode ? "" : "none");
this.width(this.width());
this.height(this.height());
}
}
EventDisplay.prototype.setRecurrenceDisplay=function(event)
{
this.i_inputs.RECURRENCE.value(this.getRecurrenceDisplay(event));
this.i_inputs.RECURRENCE.text(this.getRecurrenceDisplay(event));
}
EventDisplay.prototype.getRecurrenceDisplay=function(event)
{
var occ="only once";
var ends="No End Date";
if ((event!=null) && (event!=undefined)) {
var d1=this.buildRecurrenceObjectFromForm().getDescription(event.startTime());
var d2=this.buildRecurrenceObjectFromForm().getDescription(event.endTime());
occ=d1.occurs;
ends=d2.ends;
} else {
if(this.i_inputs.OCCURS.value()=="Once") {
return "This event occurs only once.";
}
occ=this.i_inputs.OCCURS.value();
ends=this.i_inputs.ENDS.value();
}
var desc="";
if ((occ!=undefined) && (occ!=null) && (occ!="")) {
desc="Occurs "+occ;
}
if ((ends!=undefined) && (ends!=null) && (ends!="")) {
if (ends.substr(0, 7)=="Repeats") {
desc+=" and ";
} else if ((ends=="No End Date") || (ends=="No End Time")) {
desc+=" and has no ending point.";
return desc;
}
desc+=ends;
} else {
desc+=" and has no ending point.";
}
return desc;
}
EventDisplay.prototype.handleEditClick=function(o) {
this.edit(true);
}
EventDisplay.prototype.handleSaveClick=function(o) {
if (this.saving()) return;
this.saving(true);
if ((this.i_inputs.SUBJECT.value==undefined) || (this.i_inputs.SUBJECT.value()=="")) {
if (this.i_tabs.activeTab()!=this.i_tab_app) {
DialogManager.alert('Please provide a subject for this event.', 'No Subject', true, undefined, true, true);
this.i_tabs.activeTab(this.i_tab_app);
}
}
if(this.i_tab_content.appointment.lform.validate().length > 0) { 
this.i_tab_content.appointment.lform.displayErrorBox(); 
this.i_tab_app.textClass("TabbedPaneTab_alert");
this.saving(false);
return; 
}
this.i_tab_content.appointment.lform.displayErrorBox(); 
this.i_tab_app.textClass(false);
if(this.i_inputs.RTYPE_OPTION.value() > -1) {
var r=this.buildRecurrenceObjectFromForm();
if(r.validate(this.i_duration)==false) {
DialogManager.alert('Invalid Recurrence: Event duration is too long for this recurrence pattern.', 
'Invalid Recurrence', undefined, true, true);
this.saving(false);
return;
}
}
this.i_validate_time_handler=EventHandler.register(this.i_event, "onvalidatetime", this.handleSaveValidateTime, this);
var att=this.getAttendeesFromFields();
if(att.length > 0) {
att+=",";
}
var gridData=this.i_event.getAttendeesDM();
var gridObjs=gridData.getItems(0,gridData.entries());
for (var i=0; i < gridObjs.length();++i) {
var item=gridObjs.getItem(i);
if (item.status()!=4) {
var usrName=item.defaultAlias();
att+=(usrName.indexOf('@') > -1 ? usrName.substr(0,usrName.indexOf('@')) : usrName)+",";
}
}
this.i_event.validateTime(att, this.i_dm.ownerId(), this.i_inputs.STARTTIME.value(), this.i_inputs.ENDTIME.value());
}
EventDisplay.prototype.handleSaveValidateTime=function(e) {
if(this.i_validate_time_handler) {
this.i_validate_time_handler=!this.i_validate_time_handler.unregister();
}
var users=e.users;
if(users.length > 0) {
var us="";
for(var x=0; x < users.length; x++) {
us+="<br>"+users[x];
}
var d=DialogManager.confirm("The following attendees have conflicts with this time: "+us+"<br>Would you still like to schedule this event?", "Conflicts", undefined, ["Yes", "No"], undefined, true);
this.i_handlers.push(EventHandler.register(d, "onclose", this.handleSaveValidateTimeConfirm, this));
}else{
this.saveEvent(); 
}
}
EventDisplay.prototype.handleSaveValidateTimeConfirm=function(e) {
if(e.button=="Yes") {
this.saveEvent(); 
}else{
this.edit(true);
this.saving(false);
}
}
EventDisplay.prototype.handleDeleteClick=function(e) {
if (!this.i_event || this.i_event.isNew()) { 
this.handleCancelClick(e);
} else {
var d=DialogManager.confirm("Are you sure you want to delete this event"+(this.instance() ? " instance" : "")+"?", "Delete Event"+(this.instance() ? " Instance" : ""), undefined, Array("Yes", "No"), true, false, 1);
EventHandler.register(d, "onclose", this.handleDeleteClickConfirm, this);
}
}
EventDisplay.prototype.handleDeleteClickConfirm=function(e) {
if (e.button=="Yes") {
this.setReminder(-1);
this.i_event.parentDataModel().removeEvent(this.i_event, this.instance());
this.i_event.destroy(this.instance());
this.closeEvent();
}
}
EventDisplay.prototype.handleCancelClick=function(e) {
if (this.isModifiedAllForms()) {
var d=DialogManager.confirm("You have made changes to this event, are you sure you want to cancel?", "Edit Event", undefined, ["Yes", "No"], undefined, true);
this.i_handlers.push(EventHandler.register(d, "onclose", this.handleConfirmCancel, this));
}
else {
this.edit(false);
if (this.i_event.isNew()) {
this.closeEvent();
}		
}
}
EventDisplay.prototype.handleConfirmCancel=function(e) {
if (e.button=="Yes") {
if (this.i_event.isNew()) {
this.closeEvent();
}
else {
this.resetAllForms();
this.edit(false);
}
}
}
EventDisplay.prototype.handleCloseClick=function(e) {
if(this.edit()) {
var d=DialogManager.confirm("You are currently editing this Event. Are you sure you want to close it?", "Close Task?", undefined, ["Yes", "No"]);
this.i_handlers.push(EventHandler.register(d, "onclose", this.handleConfirmClose, this));
}else{
this.closeEvent();
}
}
EventDisplay.prototype.handleConfirmClose=function(e) {
if(e.button=="Yes") {
this.closeEvent();
}
}
EventDisplay.prototype.closeEvent=function() {
if(this.onclose!=undefined) {
this.onclose({type:"close"});
}
this.destructor(true);
}
EventDisplay.prototype.handleRecurrenceTypeChange=function(e) {
if(this.i_inputs.RTYPE_OPTION) {
this.updateRecurrenceTabForm(this.i_inputs.RTYPE_OPTION.value());
}
}
EventDisplay.prototype.handleRecurrenceEndChange=function(e) {
var end_type=this.i_inputs.REND_OPTIONS.value();
var section=this.i_tab_content.recurrence.rsec;
var last_row=section.rows().length-1;
if(section.rows(last_row)==this.i_inputs.RENDAFTER_ROW) {
section.removeRow(this.i_inputs.RENDAFTER_ROW);
} else if(section.rows(last_row)==this.i_inputs.RENDDATE_ROW){
section.removeRow(this.i_inputs.RENDDATE_ROW);
}
if(end_type==1) {			
section.addRow(this.i_inputs.RENDAFTER_ROW);
if(this.i_last_recurrence_section_rows) {
this.i_last_recurrence_section_rows.push(this.i_inputs.RENDAFTER_ROW);
}
} else if(end_type==2) {	
section.addRow(this.i_inputs.RENDDATE_ROW);
if(this.i_last_recurrence_section_rows) {
this.i_last_recurrence_section_rows.push(this.i_inputs.RENDDATE_ROW);
}
} else {						
;
}
}
EventDisplay.prototype.updateRecurrenceTabForm=function(type) {
if (document!=undefined) {
type=parseInt(type);
var section=this.i_tab_content.recurrence.rsec;
if(this.i_last_recurrence_section_rows) {
for(var x=0; x < this.i_last_recurrence_section_rows.length; x++) {
section.removeRow(this.i_last_recurrence_section_rows[x]);
}
this.i_last_recurrence_section_rows=null;
}
var addRows=[];
if(type==-1) { 
;		
}else if(type==0) { 
addRows=this.i_inputs.RTYPE_DAILY_ROWS.concat([]);
}else if(type==1) { 
addRows=this.i_inputs.RTYPE_WEEKLY_ROWS.concat([]);
}else if(type==2) { 
addRows=this.i_inputs.RTYPE_MONTHLY_ROWS.concat([]);
}else if(type==3) { 
addRows=this.i_inputs.RTYPE_YEARLY_ROWS.concat([]);
}
if(type > -1) {
addRows.push(this.i_inputs.REND_OPTIONS_ROW);
var rend=this.i_inputs.REND_OPTIONS.value();
if(rend==1) {
addRows.push(this.i_inputs.RENDAFTER_ROW);
}else if (rend==2){
addRows.push(this.i_inputs.RENDDATE_ROW);
}
}
var start_date=floorDay(this.i_inputs.STARTTIME.value().copy());
if (type==2) { 
this.i_inputs.RTYPE_MONTHLY_DAYX_DAY_INPUT.value(start_date.getDate());
if(start_date.getDate() < 8) {
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.value(1);
} else if(start_date.getDate() < 15) {
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.value(2);
} else if(start_date.getDate() < 22) {
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.value(3);
} else if(start_date.getDate() < 29) {
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.value(4);
} else {
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.value(-1);
}
this.i_inputs.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT.value(start_date.getDay()+1);
} else if (type==3) { 
this.i_inputs.RTYPE_YEARLY_EVERYX_MONTH.text(getMonthName(start_date));
this.i_inputs.RTYPE_YEARLY_EVERYX_INPUT.value(start_date.getDate());
if(start_date.getDate() < 8) {
this.i_inputs.RTYPE_YEARLY_EVERYTH_TH_INPUT.value(1);
} else if(start_date.getDate() < 15) {
this.i_inputs.RTYPE_YEARLY_EVERYTH_TH_INPUT.value(2);
} else if(start_date.getDate() < 22) {
this.i_inputs.RTYPE_YEARLY_EVERYTH_TH_INPUT.value(3);
} else if(start_date.getDate() < 29) {
this.i_inputs.RTYPE_YEARLY_EVERYTH_TH_INPUT.value(4);
} else {
this.i_inputs.RTYPE_YEARLY_EVERYTH_TH_INPUT.value(-1);
}
this.i_inputs.RTYPE_YEARLY_EVERYTH_DAY_INPUT.value(start_date.getDay()+1);
this.i_inputs.RTYPE_YEARLY_EVERYTH_MONTH.text("of "+getMonthName(start_date));		
}
for(var x=0; x < addRows.length; x++) {
section.addRow(addRows[x]);
}
if (type==1) {
var days=[];
days.push(start_date.getDay());
this.i_inputs.RTYPE_WEEKLY_EVERYXWEEKS_CHECKS.value(days);
}
this.i_last_recurrence_section_rows=addRows;
var ins=this.i_inputs;
var text_input_w=25;
var radio_w=18;
var new_row_h=31;
var left_label_width=100;
var label_every_width=38;
var input_padding=8;
var input_ordinal_width=70;
var input_day_width=100;
if(type==0) {
var label_days_width=50;
var label_every_weekday_width=100;
ins.RTYPE_DAILY_EVERYXDAYS_RADIO.i_options[0].i_option_desc.style.display="none";
ins.RTYPE_DAILY_EVERYXDAYS_RADIO.i_options[0].getOption().style.width=radio_w+"px";
ins.RTYPE_DAILY_EVERYXDAYS_RADIO.i_object.style.width=radio_w+"px";
ins.RTYPE_DAILY_EVERYXDAYS_RADIO.i_input_object.style.width=radio_w+"px";
ins.RTYPE_DAILY_EVERYXDAYS_RADIO.getInput().style.width=(left_label_width+radio_w)+"px";
ins.RTYPE_DAILY_EVERYXDAYS_LABEL1.inputObject().style.width=label_every_width+"px";
ins.RTYPE_DAILY_EVERYXDAYS_LABEL1.i_input_object.style.width=label_every_width+"px";
ins.RTYPE_DAILY_EVERYXDAYS_LABEL1.getInput().style.width=label_every_width+"px";
ins.RTYPE_DAILY_EVERYXDAYS_INPUT.inputObject().style.width=(text_input_w)+"px";
ins.RTYPE_DAILY_EVERYXDAYS_INPUT.i_input_object.style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_DAILY_EVERYXDAYS_INPUT.getInput().style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_DAILY_EVERYXDAYS_LABEL2.inputObject().style.width=label_days_width+"px";
ins.RTYPE_DAILY_EVERYXDAYS_LABEL2.i_input_object.style.width=label_days_width+"px";
ins.RTYPE_DAILY_EVERYXDAYS_LABEL2.getInput().style.width=label_days_width+"px";
ins.RTYPE_DAILY_EVERYWEEKDAY_RADIO.i_options[0].i_option_desc.style.display="none";
ins.RTYPE_DAILY_EVERYWEEKDAY_RADIO.i_options[0].getOption().style.width=radio_w+"px";
ins.RTYPE_DAILY_EVERYWEEKDAY_RADIO.i_object.style.width=radio_w+"px";
ins.RTYPE_DAILY_EVERYWEEKDAY_RADIO.i_input_object.style.width=radio_w+"px";
ins.RTYPE_DAILY_EVERYWEEKDAY_RADIO.getInput().style.width=(left_label_width+radio_w)+"px";
ins.RTYPE_DAILY_EVERYWEEKDAY_LABEL.inputObject().style.width=label_every_weekday_width+"px";
ins.RTYPE_DAILY_EVERYWEEKDAY_LABEL.i_input_object.style.width=label_every_weekday_width+"px";
ins.RTYPE_DAILY_EVERYWEEKDAY_LABEL.getInput().style.width=label_every_weekday_width+"px";
} else if(type==1) {
var label_recur_every_width=75;
var label_weeks_on_width=75;
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL1.inputObject().style.width=label_recur_every_width+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL1.i_input_object.style.width=label_recur_every_width+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL1.getInput().style.width=(left_label_width+label_recur_every_width)+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.inputObject().style.width=(text_input_w)+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.i_input_object.style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_INPUT.getInput().style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL2.inputObject().style.width=label_weeks_on_width+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL2.i_input_object.style.width=label_weeks_on_width+"px";
ins.RTYPE_WEEKLY_EVERYXWEEKS_LABEL2.getInput().style.width=label_weeks_on_width+"px";
} else if (type==2) {
var label_months_width=60;
section.rows()[0].getRow().style.height=new_row_h+"px";
section.rows()[1].getRow().style.height=new_row_h+"px";
section.rows()[2].getRow().style.height=new_row_h+"px";	
ins.RTYPE_MONTHLY_DAYX_RADIO.i_options[0].i_option_desc.style.display="none";
ins.RTYPE_MONTHLY_DAYX_RADIO.i_options[0].getOption().style.width=radio_w+"px";
ins.RTYPE_MONTHLY_DAYX_RADIO.i_object.style.width=radio_w+"px";
ins.RTYPE_MONTHLY_DAYX_RADIO.i_input_object.style.width=radio_w+"px";
ins.RTYPE_MONTHLY_DAYX_RADIO.getInput().style.width=(left_label_width+radio_w)+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL1.inputObject().style.width=text_input_w+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL1.i_input_object.style.width=text_input_w+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL1.getInput().style.width=text_input_w+"px";
ins.RTYPE_MONTHLY_DAYX_DAY_INPUT.inputObject().style.width=(text_input_w)+"px";
ins.RTYPE_MONTHLY_DAYX_DAY_INPUT.i_input_object.style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYX_DAY_INPUT.getInput().style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL2.inputObject().style.width=((text_input_w * 2) - 1)+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL2.i_input_object.style.width=((text_input_w * 2) - 1)+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL2.getInput().style.width=(text_input_w  * 2)+"px";
ins.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.inputObject().style.width=(text_input_w)+"px";
ins.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.i_input_object.style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYX_MONTHS_INPUT.getInput().style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL3.inputObject().style.width=label_months_width+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL3.i_input_object.style.width=label_months_width+"px";
ins.RTYPE_MONTHLY_DAYX_LABEL3.getInput().style.width=label_months_width+"px";
ins.RTYPE_MONTHLY_DAYEVERY_RADIO.i_options[0].i_option_desc.style.display="none";
ins.RTYPE_MONTHLY_DAYEVERY_RADIO.i_options[0].getOption().style.width=radio_w+"px";
ins.RTYPE_MONTHLY_DAYEVERY_RADIO.i_object.style.width=radio_w+"px";
ins.RTYPE_MONTHLY_DAYEVERY_RADIO.i_input_object.style.width=radio_w+"px";
ins.RTYPE_MONTHLY_DAYEVERY_RADIO.getInput().style.width=(left_label_width+radio_w)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL1.inputObject().style.width=text_input_w+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL1.i_input_object.style.width=text_input_w+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL1.getInput().style.width=text_input_w+"px";
ins.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.i_object.width(input_ordinal_width);
ins.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.i_input_object.style.width=(input_ordinal_width+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_TH_INPUT.getInput().style.width=(input_ordinal_width+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT.i_object.width(input_day_width);
ins.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT.i_input_object.style.width=(input_day_width+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_WHEN_INPUT.getInput().style.width=(input_day_width+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL2.inputObject().style.width=((text_input_w * 2) - 1)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL2.i_input_object.style.width=((text_input_w * 2) - 1)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL2.getInput().style.width=(text_input_w  * 2)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.inputObject().style.width=(text_input_w)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.i_input_object.style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_MONTHS_INPUT.getInput().style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL3.inputObject().style.width=label_months_width+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL3.i_input_object.style.width=label_months_width+"px";
ins.RTYPE_MONTHLY_DAYEVERY_LABEL3.getInput().style.width=label_months_width+"px";
} else if(type==3) {
var label_month_width=68;
var label_of_month_width=90;
var label_the_width=28;
ins.RTYPE_YEARLY_EVERYX_RADIO.i_options[0].i_option_desc.style.display="none";
ins.RTYPE_YEARLY_EVERYX_RADIO.i_options[0].getOption().style.width=radio_w+"px";
ins.RTYPE_YEARLY_EVERYX_RADIO.i_object.style.width=radio_w+"px";
ins.RTYPE_YEARLY_EVERYX_RADIO.i_input_object.style.width=radio_w+"px";
ins.RTYPE_YEARLY_EVERYX_RADIO.getInput().style.width=(left_label_width+radio_w)+"px";
ins.RTYPE_YEARLY_EVERYX_LABEL1.inputObject().style.width=label_every_width+"px";
ins.RTYPE_YEARLY_EVERYX_LABEL1.i_input_object.style.width=label_every_width+"px";
ins.RTYPE_YEARLY_EVERYX_LABEL1.getInput().style.width=label_every_width+"px";
ins.RTYPE_YEARLY_EVERYX_MONTH.inputObject().style.width=label_month_width+"px";
ins.RTYPE_YEARLY_EVERYX_MONTH.i_input_object.style.width=label_month_width+"px";
ins.RTYPE_YEARLY_EVERYX_MONTH.getInput().style.width=label_month_width+"px";
ins.RTYPE_YEARLY_EVERYX_INPUT.inputObject().style.width=(text_input_w)+"px";
ins.RTYPE_YEARLY_EVERYX_INPUT.i_input_object.style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_YEARLY_EVERYX_INPUT.getInput().style.width=(text_input_w+input_padding)+"px";
ins.RTYPE_YEARLY_EVERYTH_RADIO.i_options[0].i_option_desc.style.display="none";
ins.RTYPE_YEARLY_EVERYTH_RADIO.i_options[0].getOption().style.width=radio_w+"px";
ins.RTYPE_YEARLY_EVERYTH_RADIO.i_object.style.width=radio_w+"px";
ins.RTYPE_YEARLY_EVERYTH_RADIO.i_input_object.style.width=radio_w+"px";
ins.RTYPE_YEARLY_EVERYTH_RADIO.getInput().style.width=(left_label_width+radio_w)+"px";
ins.RTYPE_YEARLY_EVERYTH_LABEL1.inputObject().style.width=label_the_width+"px";
ins.RTYPE_YEARLY_EVERYTH_LABEL1.i_input_object.style.width=label_the_width+"px";
ins.RTYPE_YEARLY_EVERYTH_LABEL1.getInput().style.width=label_the_width+"px";
ins.RTYPE_YEARLY_EVERYTH_TH_INPUT.i_object.width(input_ordinal_width);
ins.RTYPE_YEARLY_EVERYTH_TH_INPUT.i_input_object.style.width=(input_ordinal_width+input_padding)+"px";
ins.RTYPE_YEARLY_EVERYTH_TH_INPUT.getInput().style.width=(input_ordinal_width+input_padding)+"px";
ins.RTYPE_YEARLY_EVERYTH_DAY_INPUT.i_object.width(input_day_width);
ins.RTYPE_YEARLY_EVERYTH_DAY_INPUT.i_input_object.style.width=(input_day_width+input_padding)+"px";
ins.RTYPE_YEARLY_EVERYTH_DAY_INPUT.getInput().style.width=(input_day_width+input_padding)+"px";
ins.RTYPE_YEARLY_EVERYTH_MONTH.inputObject().style.width=label_of_month_width+"px";
ins.RTYPE_YEARLY_EVERYTH_MONTH.i_input_object.style.width=label_of_month_width+"px";
ins.RTYPE_YEARLY_EVERYTH_MONTH.getInput().style.width=label_of_month_width+"px";
}
}
}
EventDisplay.prototype.resetReminderContext=function(meta) {
var contextValue;
if (meta!=undefined && meta.set==true) {
contextValue=meta.reminder;
}
if (contextValue==undefined && this.i_event!=undefined && typeof this.i_event.reminder()=="object") {
contextValue=(this.i_event.reminder()!=null ? this.i_event.reminder().interval() : -1);
}
if (contextValue==undefined) {
if (this.i_dm && this.i_dm.defaultReminderInterval) {
contextValue=parseInt(this.i_dm.defaultReminderInterval());
} else {
contextValue=-1;
}
}
this.i_reminder_value=contextValue;
this.setReminderContext(contextValue, true);
}
EventDisplay.prototype.handleExternalPop=function(e) {
this.i_last_state=e.stateData.fields;
this.i_last_state_meta=e.stateData.meta;
if(this.i_last_state_meta.set==true) {
this.loadEvent(this.i_last_state_meta.event, false);
this.i_tabs.activeTab(this.i_tabs.tabs(this.i_last_state_meta.lastActiveTabIndex));
if (this.i_last_state_meta.simpleclick) this.handleAttendeeButtonClick({show:true});
}
this.resetReminderContext(this.i_last_state_meta);
}
EventDisplay.prototype.handleInternalPop=function(e) {
this.i_last_state=e.stateData.fields;
this.i_last_state_meta=e.stateData.meta;
if(this.i_last_state_meta.set==true) {
this.loadEvent(this.i_last_state_meta.event, false);
this.i_tabs.activeTab(this.i_tabs.tabs(this.i_last_state_meta.lastActiveTabIndex));
if (this.i_last_state_meta.simpleclick) this.handleAttendeeButtonClick({show:true});
}
this.resetReminderContext(this.i_last_state_meta);
}
EventDisplay.prototype.handleTermination=function(e) {
this.handleBlurAddAttendees();
if(!e.final && this.edit()) {
var f=e.stateData.fields;
f.APPTATTENDEES=this.i_inputs.APPTATTENDEES.value();
f.SUBJECT=this.i_inputs.SUBJECT.value();
f.STARTTIME=EventDisplay.dateCopy(this.i_inputs.STARTTIME.value());
f.ENDTIME=EventDisplay.dateCopy(this.i_inputs.ENDTIME.value());
f.LOCATION=this.i_inputs.LOCATION.value();
f.DESCRIPTION=this.i_inputs.DESCRIPTION.value();
f.PRIVATE=this.i_inputs.PRIVATE.value()[0];
f.ATTENDEESRESPONDEMAIL=this.i_inputs.ATTENDEESRESPONDEMAIL.value()[0];
f.RECURRENCE=this.buildRecurrenceObjectFromForm().toRecurrenceString();
f.allday=this.i_allday;
var pfiles=this.i_tab_content.attachment.attachment_manager.files();
if(this.i_event && this.i_event.isNew() && pfiles.length > 0) {
var nfiles=PopoutWindow.createObject('Array');
for(var x=0; x < pfiles.length; x++) {
nfiles.push(EventDisplay.fileAttachmentCopy(pfiles[x]));
}
f.STAGEDFILES=nfiles;
}else{
f.STAGEDFILES=undefined;
}
f.set=true;
}else{
e.stateData.fields.set=false;
}
if(!e.final) {
var m=e.stateData.meta; 
m.edit=this.edit();
m.reminder=this.i_reminder_value;
m.event=this.i_event;
m.instance=this.instance();
m.dm=this.i_dm;
m.set=true;
m.simpleclick=this.i_simple_click_showing;
var tabs=this.i_tabs.tabs();
for(var x=0; x < tabs.length; x++) {
if(tabs[x]==this.i_tabs.activeTab()) {
m.lastActiveTabIndex=x;
break;
}
}
m.show_attendees_field=this.i_show_attendees_field;
}else{
e.stateData.meta.set=false;
}
if (!this.saving()) this.closeEvent();
}
EventDisplay.prototype.handleStaticFormPrivateEventTranslate=function(e) {
if(e.actualValue[0]=="private") {
e.value="Yes";
}else{
e.value="No";
}
}
EventDisplay.prototype.handleStaticFormEmailOnAttendTranslate=function(e) {
if(e.actualValue[0]=="email") {
e.value="Email me when attendees respond"
}else{
e.value="Do not email me when attendees respond";
}
}
EventDisplay.prototype.handleStaticFormTranslateToBlank=function(e) {
e.value="";
}
EventDisplay.generateDurationOptions=function() {
return [new UniversalOptionBoxOption("", "-1"),
new UniversalOptionBoxOption("All Day Event", "allday"),
new UniversalOptionBoxOption("-------------", "-2"),
new UniversalOptionBoxOption("0 minutes", "0"),
new UniversalOptionBoxOption("5 minutes", "5"),
new UniversalOptionBoxOption("15 minutes", "15"),
new UniversalOptionBoxOption("30 minutes", "30"),
new UniversalOptionBoxOption("45 minutes", "45"),
new UniversalOptionBoxOption("1 hour", "60", true),
new UniversalOptionBoxOption("1 1/2 hour", "90"),
new UniversalOptionBoxOption("2 hours", "120"),
new UniversalOptionBoxOption("4 hours", "240"),
new UniversalOptionBoxOption("8 hours", "480"),
new UniversalOptionBoxOption("12 hours", "720")];
}
EventDisplay.generateReminderOptions=function() {
var rem_vals=new Array();
rem_vals.push({text:"No Reminder", value: "-1"});
rem_vals.push({text:"0 Minutes Prior", value: "0"});
rem_vals.push({text:"5 Minutes Prior", value: "5"});
rem_vals.push({text:"10 Minutes Prior", value: "10"});
rem_vals.push({text:"15 Minutes Prior", value: "15"});
rem_vals.push({text:"30 Minutes Prior", value: "30"});
rem_vals.push({text:"1 Hour Prior", value: "60"});
rem_vals.push({text:"2 Hours Prior", value: "120"});
rem_vals.push({text:"4 Hours Prior", value: "240"});
rem_vals.push({text:"8 Hours Prior", value: "480"});
rem_vals.push({text:"12 Hours Prior", value: "720"});
rem_vals.push({text:"1 Day Prior", value: "1440"});
rem_vals.push({text:"2 Days Prior", value: "2880"});
return rem_vals;
}
EventDisplay.getDependencies=function() {
return ["@ApplicationCalendar",
"+ApplicationEmail",
"@UniversalFileAttachment",
"ContextMenuFileItem",
"EventAttendee",
"=EventDisplay.dateCopy",
"=EventDisplay.fileAttachmentCopy",
"=EventDisplay.newEventAttendee",
"EventDatesValidator",
"addDays",
"getMinuteDiff",
"CalendarReminder"];
}
EventDisplay.inherit(PopoutDisplay);
function EventDatesValidator(other, otherless, message) {
this.superConstructor(message);
this.i_other_date=other;
this.i_other_less=otherless;
}
EventDatesValidator.prototype.validate=function(input) {
if(this.i_other_less) {
if(getMinuteDiff(this.i_other_date.value(), input.value()) <=0) {
return true;
}
return false;
}else{
if(getMinuteDiff(this.i_other_date.value(), input.value()) >=0) {
return true;
}
return false;
}
}
EventDatesValidator.inherit(ValidationRule);
function Recurrence(pattern) {
this.type=-1; 
this.occurrence_ends=false;
this.occurrence_count=10;
this.occurrence_has_end_date=false;
this.occurrence_end_date=floorDay(new Date());
this.parsed=false;
this.daily_number_of_days=1;
this.daily_every_weekday=false;
this.weekly_number_of_weeks=1;
this.weekly_days=[false, false, false, false, false, false, false];
this.monthly_number_of_days=1;
this.monthly_number_of_months=1;
this.monthly_pattern=false;
this.monthly_pattern_order=1;
this.monthly_pattern_type=0;
this.monthly_pattern_number_of_months=1;
this.yearly_month=1;
this.yearly_day=1;
this.yearly_pattern=false;
this.yearly_pattern_order=1;
this.yearly_pattern_type=0;
this.yearly_pattern_month=1;
var temp=new Array();
var today=new Date();
if(pattern!=null && pattern.length > 0) {
temp=pattern.split(",");
}
if(temp.length > 0) {
switch(temp[0]) {
case "D":
this.type=0;
this.daily_number_of_days=parseInt(temp[1]);
this.parsed=true;
break;
case "DW":
this.type=0;
this.daily_every_weekday=true;
this.parsed=true;
break;
case "W":
this.type=1;
this.weekly_number_of_weeks=parseInt(temp[1]);
for(var x=3; x < temp.length - 1; x++) {
this.weekly_days[parseInt(temp[x]) - 1]=true;
}
this.parsed=true;
break;
case "MD":
this.type=2;
this.monthly_number_of_months=parseInt(temp[1]);
this.monthly_number_of_days=parseInt(temp[2]);
this.parsed=true;
break;
case "MP":
this.type=2;
this.monthly_pattern=true;
this.monthly_pattern_number_of_months=parseInt(temp[1]);
this.monthly_pattern_order=parseInt(temp[2]);
this.monthly_pattern_type=parseInt(temp[3]);
this.parsed=true;
break;
case "YD":
this.type=3;
this.yearly_day=parseInt(temp[1]);
this.parsed=true;
break;
case "YP":
this.type=3;
this.yearly_pattern=true;
this.yearly_pattern_order=parseInt(temp[2]);
this.yearly_pattern_type=parseInt(temp[3]);
this.parsed=true;
break;
}
var temp_occurrence=temp[temp.length - 1];
if(temp_occurrence.charAt(0)=='#') {
var num=parseInt(temp_occurrence.substr(1, temp_occurrence.length - 1));
if(num > 0) {
this.occurrence_ends=true;
this.occurrence_count=num;
}
} else {
var temp_date=temp_occurrence.substr(0, 8)+"T"+temp_occurrence.substr(8, 6)+"Z";
this.occurrence_ends=true;
this.occurrence_has_end_date=true;
this.occurrence_end_date=iCaltoDate(temp_date);
}
}
if(this.type!=1) {
this.weekly_days[today.getDay()]=true;
}
if(this.type!=2) {
this.monthly_number_of_days=today.getDate();
this.monthly_pattern_type=today.getDay()+1;
if(today.getDate() < 8) {
this.monthly_pattern_order=1;
} else if(today.getDate() < 15) {
this.monthly_pattern_order=2;
} else if(today.getDate() < 22) {
this.monthly_pattern_order=3;
} else if(today.getDate() < 29) {
this.monthly_pattern_order=4;
} else {
this.monthly_pattern_order=-1;
}
}
if(this.type!=3) {
this.yearly_month=today.getMonth()+1;
this.yearly_day=today.getDate();
this.yearly_pattern_type=today.getDay()+1;
this.yearly_pattern_month=today.getMonth();
if(today.getDate() < 8) {
this.yearly_pattern_order=1;
} else if(today.getDate() < 15) {
this.yearly_pattern_order=2;
} else if(today.getDate() < 22) {
this.yearly_pattern_order=3;
} else if(today.getDate() < 29) {
this.yearly_pattern_order=4;
} else {
this.yearly_pattern_order=-1;
}
}
}
Recurrence.prototype.toRecurrenceString=function() {
ret=new Array();
if(this.type==0) {
if(this.daily_every_weekday) {
ret.push("DW");
ret.push(1);
} else {
ret.push("D");
ret.push(this.daily_number_of_days);
}
} else if(this.type==1) {
ret.push("W");
ret.push(this.weekly_number_of_weeks);
ret.push(1);
for(var x=0; x < 7; x++) {
if(this.weekly_days[x]) {
ret.push(x+1);
}
}
} else if(this.type==2) {
if(this.monthly_pattern) {
ret.push("MP");
ret.push(this.monthly_pattern_number_of_months);
ret.push(this.monthly_pattern_order);
ret.push(this.monthly_pattern_type);
} else {
ret.push("MD");
ret.push(this.monthly_number_of_months);
ret.push(this.monthly_number_of_days);
}
} else if(this.type==3) {
if(this.yearly_pattern) {
ret.push("YP");
ret.push(1);
ret.push(this.yearly_pattern_order);
ret.push(this.yearly_pattern_type);
} else {
ret.push("YD");
ret.push(this.yearly_day);
}
}
if(this.occurrence_ends) {
if(this.occurrence_has_end_date) {
var useDate=addDay(floorDay(this.occurrence_end_date.copy(true)));
var temp_date=dateToICal(useDate);
temp_date=temp_date.substr(0, 8)+temp_date.substr(9, 6);
ret.push(temp_date);
} else {
ret.push("#"+this.occurrence_count);
}
} else {
ret.push("#0");
}
return ret.join(",");
}
Recurrence.prototype.setDefaultsFromEvent=function (event) {
var real_date=event.startTime();
if(event.allDay()) {
real_date=addMinutes(real_date, real_date.getTimezoneOffset());
}
if(!this.parsed || !this.type==1) {
for(var x=0; x < 7; x++) {
this.weekly_days[x]=false;
}
this.weekly_days[real_date.getDay()]=true;
}
if(!this.parsed || !this.type==2 || (this.type==2 && 
this.monthly_pattern)) {
this.monthly_number_of_days=real_date.getDate();
}
if(!this.parsed || !this.type==2 || (this.type==2 && 
!this.monthly_pattern)) {
this.monthly_pattern_type=real_date.getDay()+1;
if(real_date.getDate() < 8) {
this.monthly_pattern_order=1;
} else if(real_date.getDate() < 15) {
this.monthly_pattern_order=2;
} else if(real_date.getDate() < 22) {
this.monthly_pattern_order=3;
} else if(real_date.getDate() < 29) {
this.monthly_pattern_order=4;
} else {
this.monthly_pattern_order=-1;
}
}
if(!this.parsed || !this.type==3 || (this.type==3 && 
this.yearly_pattern)) {
this.yearly_month=real_date.getMonth()+1;
this.yearly_day=real_date.getDate();
}
if(!this.parsed || !this.type==3 || (this.type==3 && 
!this.yearly_pattern)) {
this.yearly_pattern_type=real_date.getDay()+1;
this.yearly_pattern_month=real_date.getMonth();
if(real_date.getDate() < 8) {
this.yearly_pattern_order=1;
} else if(real_date.getDate() < 15) {
this.yearly_pattern_order=2;
} else if(real_date.getDate() < 22) {
this.yearly_pattern_order=3;
} else if(real_date.getDate() < 29) {
this.yearly_pattern_order=4;
} else {
this.yearly_pattern_order=-1;
}
}
if(!this.occurrence_has_end_date || !this.parsed) {
this.occurrence_end_date=addMonths(real_date, 1);
}
}
Recurrence.prototype.getDescription=function(date) {
var start_date=new Date(date);
var endDateRet="";
var ret="";
var months=["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November",
"December"];
var weekdays=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
"Friday", "Saturday"];
var ordinals=["last", "", "first", "second", "third", "fourth"];
var patterns=["day", "Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday", "weekday", "weekend day"];
if(this.type==0) {
if(this.daily_every_weekday) {
ret+="Every weekday ";
} else {
if(this.daily_number_of_days==1) {
ret+="Every day ";
} else if(this.daily_number_of_days==2) {
ret+="Every other day ";
} else {
ret+="Every "+this.daily_number_of_days+" days ";
}
}
} else if(this.type==1) {
var first=true;
var num=0;
var count=0;
if(this.weekly_number_of_weeks==1) {
ret+="Every week on ";
} else if(this.weekly_number_of_weeks==2) {
ret+="Every other week on ";
} else {
ret+="Every "+this.weekly_number_of_weeks+" weeks on ";
}
for(var x=0; x < 7; x++) {
if(this.weekly_days[x]) {
num++;
}
}
count=num;
for(var x=0; x < 7; x++) {
if(this.weekly_days[x]) {
num--;
if(first) {
first=false;
} else {
if(num==0) {
if(count==2) {
ret+=" and ";
} else {
ret+=", and ";
}
} else {
ret+=", ";
}
}
ret+=weekdays[x];
}
}
ret+=" ";
} else if(this.type==2) {
var months;
ret+="On the ";
if(this.monthly_pattern) {
months=this.monthly_pattern_number_of_months;
ret+=ordinals[parseInt(this.monthly_pattern_order)+1]+" "+patterns[this.monthly_pattern_type]+" ";
} else {
months=this.monthly_number_of_months;
ret+=getNumberName(this.monthly_number_of_days)+" ";
}
if(months==1) {
ret+="of every month ";
} else if(months==2) {
ret+="of every other month ";
} else {
ret+="of every "+getNumberName(months)+" month ";
}
} else if(this.type==3) {
if(this.yearly_pattern) {
ret+="On the "+ordinals[parseInt(this.yearly_pattern_order)+1]+" "+patterns[this.yearly_pattern_type]+" of "+months[start_date.getMonth()]+" ";
} else {
ret+="Every "+months[start_date.getMonth()]+" "+getNumberName(this.yearly_day)+" ";
}
}
if(this.occurrence_ends) {
endDateRet+="Repeats ";
if(this.occurrence_has_end_date) {
endDateRet+="until "+this.occurrence_end_date.formatDate(user_prefs['date_prefs'].replace(/\%/g, "")+"");
} else {
if(this.occurrence_count==1) {
endDateRet+="once";
} else if(this.occurrence_count==2) {
endDateRet+="twice";
} else {
endDateRet+=this.occurrence_count+" times";
}
}
}else{
endDateRet+="No End Date";
}
return {occurs: ret, ends: endDateRet };
}
Recurrence.prototype.validate=function(dur) {
var event_object={
duration: dur
};
var comp_recurrence=this;
var ret=true;
if(comp_recurrence!=null) {
if((comp_recurrence.type==0 && event_object.duration >
(comp_recurrence.daily_number_of_days * 1440)) ||
(comp_recurrence.type==1 && event_object.duration >
(comp_recurrence.weekly_number_of_weeks * 10080)) ||
(comp_recurrence.type==2 && event_object.duration > 40320) ||
(comp_recurrence.type==3 && event_object.duration > 525600)) {
ret=false;
}
if(comp_recurrence.type==1 && ret) {
var days=0;
var min_days=7;
var num_days=0;
for(var x=0; x < 14; x++) {
if(comp_recurrence.weekly_days[x % 7]) {
if(days!=0 && days < min_days) {
min_days=days;
}
days=1;
num_days++;
} else if(days!=0) {
days++;
}
}
if(event_object.duration > (1440 * min_days)) {
ret=false;
}
}
}
return ret;
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.EventDisplay.js");
function MeetingRequestList(parent, width, height) {
this.i_parent=parent;
this.i_width=width;
this.i_height=height;
this.i_preview_displayed=false;
}
MeetingRequestList.prototype.parent=function() {
return this.i_parent;
}
MeetingRequestList.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_resize!=undefined) {
this.i_resize.width(width);
}
}
return this.i_width;
}
MeetingRequestList.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_resize!=undefined) {
this.i_resize.height(height);
}
}
return this.i_height;
}
MeetingRequestList.prototype.meetingList=function() {
if (this.i_meeting_list==undefined) {
this.i_meeting_list=new DataGrid(this.width(), this.height(), this.parent().application().getMeetingRequestDataModel(), undefined, Array("DataGrid_column_selected"));
this.i_meeting_list.contextMenu().removeAllItems();
this.i_conflict_header=this.i_meeting_list.addHeader(new DataGridHeader('conflict_icon', 'conflict_icon', 20, "", "Conflicts", "DataList_header_icon_importance", true));
this.i_conflict_header.protected(false);
this.i_meeting_list.addHeader(new DataGridHeader('owner_name', 'owner_name', 150, "From", "From", undefined, true));
this.i_meeting_list.addHeader(new DataGridHeader('start_disp', 'start_raw', 150, "Date", "Date", undefined, true));
this.i_meeting_list.addHeader(new DataGridHeader('title', 'title', "100%", "Title", "Title", undefined, true));
this.i_meeting_list.addHeader(new DataGridHeader('status_name', 'status', 150, "Status", "Status", undefined, true));
EventHandler.register(this.i_meeting_list, "oncontextmenu", this.handleListContext, this);
EventHandler.register(this.i_meeting_list, "onmousedown", this.handleListClick, this);
EventHandler.register(this.i_meeting_list.dataModel(), "onrefresh", this.handleDataModelChange, this);
}
return this.i_meeting_list;
}
MeetingRequestList.prototype.handleDataModelChange=function(e) {
if (this.i_event && this.meetingList()!=undefined) {
if (this.meetingList().entries() > 0 &&
this.meetingList().getSelected()[0]!=undefined && 
this.meetingList().getSelected()[0].id()!=this.i_event.id()) {		 
this.handleListClick();
} else if (this.meetingList().entries() > 0 && this.meetingList().getSelected()[0]==undefined) {
this.handleListClick();
} else if (this.meetingList().entries()==0) {
this.handleListClick();
}
}
}
MeetingRequestList.prototype.handleListContext=function(e) {
if (e.item!=undefined) {
var cx=this.contextMenu();
cx.title(e.item.title());
this.i_active_context=e.item;
this.i_context_tentative.visible(e.item.meetingRequestState()==1);
cx.show();
e.cancelBubble=true;
e.returnValue=false;
}
}
MeetingRequestList.prototype.handleContextView=function(e) {
Application.getApplicationById(1004).popEvent(this.i_active_context);
}
MeetingRequestList.prototype.handleContextAccept=function(e) {
this.i_active_context.meetingRequestState(2);
this.i_active_context.saveMeetingRequestState();
}
MeetingRequestList.prototype.handleContextDecline=function(e) {
this.i_active_context.meetingRequestState(4);
this.i_active_context.saveMeetingRequestState();
}
MeetingRequestList.prototype.handleContextTentative=function(e) {
this.i_active_context.meetingRequestState(3);
this.i_active_context.saveMeetingRequestState();
}
MeetingRequestList.prototype.contextMenu=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu(180, "Meeting Request");
this.i_context_delete=this.i_context.addItem(new ContextMenuIconItem("View Event"));
EventHandler.register(this.i_context_delete, "onclick", this.handleContextView, this);
this.i_context.addItem(new ContextMenuDivider());
this.i_context_accept=this.i_context.addItem(new ContextMenuIconItem("Accept"));
EventHandler.register(this.i_context_accept, "onclick", this.handleContextAccept, this);
this.i_context_decline=this.i_context.addItem(new ContextMenuIconItem("Decline"));
EventHandler.register(this.i_context_decline, "onclick", this.handleContextDecline, this);
this.i_context_tentative=this.i_context.addItem(new ContextMenuIconItem("Tentative"));
EventHandler.register(this.i_context_tentative, "onclick", this.handleContextTentative, this);
}
return this.i_context;
}
MeetingRequestList.prototype.getListDiv=function() {
if (this.i_list_div==undefined) {
this.i_list_div=document.createElement('DIV');
this.i_list_div.style.border="1px solid #a3a3a3";
this.i_list_div.style.backgroundColor="#FFFFFF";
this.i_list_div.appendChild(this.meetingList().getGrid());
}
return this.i_list_div;
}
MeetingRequestList.prototype.getPreviewDiv=function() {
if (this.i_preview_div==undefined) {
this.i_preview_div=document.createElement('DIV');
this.i_preview_div.style.border="1px solid #a3a3a3";
this.i_preview_div.style.backgroundColor="#FFFFFF";
}
return this.i_preview_div;
}
MeetingRequestList.prototype.handlePaneResize=function(e) {
if (this.i_preview_div!=undefined) {
this.i_preview_div.style.width=this.i_resize.contentWidth(1)+"px";
this.i_preview_div.style.height=this.i_resize.contentHeight(1)+"px";
}
if (this.i_request_display!=undefined) {
this.i_request_display.width(this.i_resize.contentWidth(1));
this.i_request_display.height(this.i_resize.contentHeight(1));
}
if (this.i_list_div!=undefined) {
this.i_list_div.style.width=this.i_resize.contentWidth(0)+"px";
this.i_list_div.style.height=this.i_resize.contentHeight(0)+"px";
}
if (this.i_meeting_list!=undefined) {
this.i_meeting_list.width(this.i_resize.contentWidth(0));
this.i_meeting_list.height(this.i_resize.contentHeight(0));
}
if(this.i_preview_filler!=undefined) {
this.i_preview_filler.style.height=this.i_resize.contentHeight(1)+"px";
this.i_preview_filler.style.lineHeight=this.i_resize.contentHeight(1)+"px";
}
if (this.i_tools!=undefined) {
this.i_tools.width(this.i_resize.contentWidth(0));
}
}
MeetingRequestList.prototype.getResizePane=function() {
if (this.i_resize==undefined) {
this.i_resize=new ResizePane(this.width(), this.height(), 2);
this.i_resize.contentPane(0, this.getListDiv());
this.i_resize.contentPane(1, this.getPreviewDiv());
this.i_resize.size(0,'33%');
this.i_resize.size(1,'67%');
EventHandler.register(this.i_resize, "onresize", this.handlePaneResize, this);
this.handleListClick();
}
return this.i_resize;
}
MeetingRequestList.prototype.getList=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.appendChild(this.getResizePane().getPane());
this.getPreviewEventDisplay().getContent();
}
return this.i_list;
}
MeetingRequestList.prototype.getPreviewEventDisplay=function() {
if (this.i_request_display==undefined) {
this.i_request_display=new MeetingRequestDisplay(this, this.i_resize.contentWidth(0), this.i_resize.contentHeight(1));
}
return this.i_request_display;
}
MeetingRequestList.prototype.getPreviewFiller=function() {
if(this.i_preview_filler==undefined) {
this.i_preview_filler=document.createElement('div');
this.i_preview_filler.className="TaskPreview_message";
this.i_preview_filler.innerHTML="<b>Select any meeting request to view the details.</b>";
}
return this.i_preview_filler;
}
MeetingRequestList.prototype.displayEventPreview=function(event, force) {
this.i_event=event;
if(event==false) {
try {
this.getPreviewDiv().removeChild(this.getPreviewEventDisplay().getContent());
}
catch (e) {
}
if (this.getPreviewEventDisplay().getContent()!=undefined) {
this.getPreviewEventDisplay().toolBarEnabled(false);
}
this.getPreviewDiv().appendChild(this.getPreviewFiller());
this.i_preview_displayed=false;
} else {
if(this.i_preview_displayed==false) {
try {
this.getPreviewDiv().removeChild(this.getPreviewFiller());
}
catch (e) {}
this.getPreviewDiv().appendChild(this.getPreviewEventDisplay().getContent());
this.i_request_display.width(this.i_resize.contentWidth(1));
this.i_request_display.height(this.i_resize.contentHeight(1));
this.i_preview_displayed=true;
}
this.i_request_display.loadRequest(event);
}
}
MeetingRequestList.prototype.handleEventPreviewClose=function(e) {
this.displayEventPreview(false);
}
MeetingRequestList.prototype.handleListClick=function(e) {
var num_selected=this.meetingList().getSelected().length;
if (num_selected > 1) {
if (!this.getPreviewEventDisplay().showBatchDiv()) {
this.getPreviewEventDisplay().showBatchDiv(true);
}
this.getPreviewEventDisplay().batchDivText(num_selected+" Requests Selected.");
}
else {
if (this.getPreviewEventDisplay().showBatchDiv()) {
this.getPreviewEventDisplay().showBatchDiv(false);
}
if(e!=undefined) {
if (e.item) {
this.getPreviewEventDisplay().showBatchDiv(false);
this.displayEventPreview(e.item);
}
}
else {
var mtg_req=this.meetingList().dataModel().items();
var top_event;
for (var x=0;x<mtg_req.length;x++) {
if (mtg_req[x]!=null && mtg_req[x]!=undefined && top_event==undefined) {
top_event=mtg_req[x];
break;
}
}
if (top_event!=undefined) {
this.meetingList().entrySelected(top_event, true);
this.displayEventPreview(top_event);
}
else {
this.displayEventPreview(false);
}
}
}	
}
MeetingRequestList.prototype.handleEventPreviewRequestChange=function(e) {
if(e.event.meetingRequestState()!=1 && e.event.meetingRequestState()!=3) {
this.displayEventPreview(false);
}
}
function MeetingRequestDisplay(parent, width, height) {
this.i_parent=parent;
this.i_width=width;
this.i_height=height;
this.i_padding_rows=new Array();
this.i_event=null;
this.i_inputs=new Object();
this.i_padding_row_height=5;
this.i_padding_col_left_w=10;
this.i_padding_col_right_w=25;
this.i_display_row_h=15;
this.i_input_label_w=85;
this.i_min_message_w=240;
this.i_display_cell_w=width - (this.i_padding_col_left_w+this.i_padding_col_right_w);
this.i_is_email_preview=false;
}
MeetingRequestDisplay.DEFAULT_MEETING_REPLY_MSG="Include a message to the meeting host (optional)";
MeetingRequestDisplay.prototype.parent=function() {
return this.i_parent;
}
MeetingRequestDisplay.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_request_display!=undefined) {
if (!this.i_is_email_preview) {
this.i_request_display.style.height=(height - (this.toolBar()!=undefined ? this.toolBar().height() : 25))+"px";
} else {
this.i_request_display.style.height=height+"px";
}
this.i_batch_div.style.height=(height - this.toolBar().height())+"px";
this.i_batch_div.style.lineHeight=(height - this.toolBar().height())+"px";
if (this.i_inputs.description.field.innerHTML!="") {
var td=TextDimension(this.i_inputs.description.field.innerHTML, undefined, this.i_display_cell_w - this.i_input_label_w, true);
if (td.height >=this.i_display_row_h) {
this.i_inputs.description.row.style.height=td.height+"px";
}
else {
this.i_inputs.description.row.style.height=this.i_display_row_h+"px";
}
}
}
}
return this.i_height;
}
MeetingRequestDisplay.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
this.i_display_cell_w=width - (this.i_padding_col_left_w+this.i_padding_col_right_w);
if (this.i_request_display!=undefined) {
this.i_tools.width(width);
this.i_request_display.style.width=width+"px";
this.i_batch_div.style.width=width+"px";
this.i_display_holder.style.width=(this.i_display_cell_w+this.i_padding_col_left_w)+"px";
this.i_display_cell.style.width=this.i_display_cell_w+"px";
this.i_inputs.message.row.style.width=this.i_display_cell.style.width;
var temp_w=((this.i_display_cell_w * 0.5) - this.i_input_label_w);
this.i_inputs.message.field.style.width=(temp_w < this.i_min_message_w ? this.i_min_message_w : temp_w)+"px";
if (!this.i_is_email_preview) {
this.i_message_reply.style.width=this.i_inputs.message.field.style.width;
} else {
this.i_message_reply.style.width=parseInt(this.i_width - 150);
}
this.i_inputs.subject.row.style.width=this.i_display_cell.style.width;
this.i_inputs.subject.field.style.width=((this.i_display_cell_w * 0.7) - this.i_input_label_w)+"px";
this.i_inputs.location.row.style.width=this.i_display_cell.style.width;
this.i_inputs.location.field.style.width=((this.i_display_cell_w * 0.7) - this.i_input_label_w)+"px";
this.i_inputs.description.row.style.width=this.i_display_cell.style.width;
this.i_inputs.description.field.style.width=((this.i_display_cell_w) - this.i_input_label_w)+"px";
this.i_inputs.recurrence.row.style.width=this.i_display_cell.style.width;
this.i_inputs.recurrence.field.style.width=((this.i_display_cell_w) - this.i_input_label_w)+"px";
this.i_inputs.attachments.row.style.width=this.i_display_cell.style.width;
this.i_inputs.attachments.field.style.width=((this.i_display_cell_w) - this.i_input_label_w)+"px";
if(this.i_attendees_grid) {
this.i_attendees_grid.width(this.i_display_cell_w);
}
for (var i=0; i < this.i_padding_rows.length; i++) {
this.i_padding_rows[i].style.width=this.i_display_cell_w;
}
}
}
return this.i_width;
}
MeetingRequestDisplay.prototype.messageReplyValue=function(value) {
if (value!=undefined) {
this.i_message_reply.value=value
}
return this.i_message_reply.value;
}
MeetingRequestDisplay.prototype.handleMeetingReplyFocus=function(e) {
if(this.i_message_reply.value==MeetingRequestDisplay.DEFAULT_MEETING_REPLY_MSG)
{
this.i_message_reply.value="";
}
}
MeetingRequestDisplay.prototype.handleLoadRequestDetailsForEmail=function(e) { 
if(this.i_load_details_event!=null) {
this.i_load_details_event.unregister();
this.i_load_details_event=null;
}
if((this.i_event.title()==undefined) && 
(this.i_event.location()=='') &&
(this.i_event.description()=='')) {
this.loadEventNotFoundForEmail();
} else {	
this.loadRequestDetailsForEmail();
if(this.i_event.meetingRequestState()==1) {
var req_dm=Application.getApplicationById(1004).getMeetingRequestDataModel();
var cal_dm=CalendarDataModel.getDefaultCalendar();
req_dm.removeEventById(this.i_event.id());
req_dm.addEvent(this.i_event);
var existing_events=cal_dm.getItemById(this.i_event.id(), true, true);
if(existing_events.length > 0) {
for(var x=0; x < existing_events.length;++x) {
cal_dm.removeEvent(existing_events[x]);
}
}
if(this.i_event.recurrence()) {
cal_dm.addRecurringEvent(this.i_event.copy());
} else {
if(this.i_event.parentId()) {
var parent_events=cal_dm.getItemById(this.i_event.parentId(), true, true);
if(parent_events.length > 0) {
var parent_copy=parent_events[0].copy();
for(var x=0; x < parent_events.length;++x) {
cal_dm.removeEvent(parent_events[x]);
}
cal_dm.addRecurringEvent(parent_copy);							
}
}
cal_dm.addEvent(this.i_event.copy());
}
}
}
}
MeetingRequestDisplay.prototype.handleLoadRequestDetails=function(e) { 
if(this.i_load_details_event!=null) {
this.i_load_details_event.unregister();
this.i_load_details_event=null;
}
this.loadRequestDetails();
}
MeetingRequestDisplay.prototype.handleLoadRequestAttendees=function(e) { 
if(this.i_load_attendees_event!=null) {
this.i_load_attendees_event.unregister();
this.i_load_attendees_event=null;
}
}
MeetingRequestDisplay.prototype.handleLoadRequestReminder=function(e) { 
if(this.i_load_reminder_event!=null) {
this.i_load_reminder_event.unregister();
this.i_load_reminder_event=null;
}
}
MeetingRequestDisplay.prototype.handleLoadRequestFiles=function(e) { 
if(this.i_load_files_event!=null) {
this.i_load_files_event.unregister();
this.i_load_files_event=null;
}
var files=this.i_event.files();
if (files!=undefined) {
if (files.length > 0) {
this.i_inputs.attachments.field.innerHTML="";
if (this.i_attach_mgr==undefined) {
this.i_attach_mgr=new UniversalAttachmentManager(undefined, undefined, false);
this.i_attach_mgr.uploadURI("/cgi-bin/phoenix/AttachmentDispatchCGI.fcg");
this.i_attach_mgr.objectType("0");
}
this.i_attach_mgr.objectId(this.i_event.id());
for (var i=0; i<files.length; i++) {
var att=new UniversalFileAttachment(files[i]);
att.copy(files[i]);
this.i_attach_mgr.addFile(att);
this.i_inputs.attachments.field.innerHTML+=att.getFormattedDisplayName()+"&nbsp;&nbsp;&nbsp;&nbsp;";
}
this.i_inputs.attachments.row.style.display="";
}
}
}
MeetingRequestDisplay.prototype.handleAcceptSelected=function(e) {
var sels=this.parent().meetingList().getSelected();
if (sels.length==0) {
DialogManager.alert("There are no meeting requests selected.", "Accept Requests");
}
else if(sels.length==1){
this.acceptSelected(sels);
}
else {
var d=DialogManager.confirm("Are you sure you want to accept all selected meeting requests?", "Accept Requests", undefined, Array("Yes", "No"), true, false, 0);
d.i_selection=sels;
EventHandler.register(d, "onclose", this.handleAcceptSelectedConfirm, this);
}
}
MeetingRequestDisplay.prototype.handleAcceptSelectedConfirm=function(e) {
if (e.button=="Yes") {
var sels=e.dialog.i_selection;
this.acceptSelected(sels);
}
}
MeetingRequestDisplay.prototype.acceptSelected=function(selections) {
this.parent().meetingList().dataModel().ignoreRefresh(true);
for (var x=0; x < selections.length; x++){ 
selections[x].meetingRequestState(2);
}
this.parent().meetingList().dataModel().ignoreRefresh(false);
this.saveEvents(selections);
if (selections.length==1) {
this.sendReply();
}
}
MeetingRequestDisplay.prototype.handleEmailAccept=function(e) {
this.i_event.meetingRequestState(2);
this.handleEmailStatusButtonPressed();
}
MeetingRequestDisplay.prototype.handleEmailDecline=function(e) {
this.i_event.meetingRequestState(4);
this.handleEmailStatusButtonPressed();
}
MeetingRequestDisplay.prototype.handleEmailTentative=function(e) {
this.i_event.meetingRequestState(3);
this.handleEmailStatusButtonPressed();
}
MeetingRequestDisplay.prototype.saveMeetingRequestStateForEmail=function(event) {
var req=Array();
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "updateMeetingRequest"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("id", event.id()));
dn.addNode(new DataNode("meetingRequestState", event.meetingRequestState()));
dn.addNode(new DataNode("calendarId", event.calendarId()));
var r=new RequestObject("Calendar", "updatemeetingrequest", dn);
EventHandler.register(r, "oncomplete", event.handleSaveMeetingRequest, event);
EventHandler.register(r, "onerror", event.handleSaveMeetingRequestError, event);
req[req.length]=r;			
APIManager.execute(req);
}
MeetingRequestDisplay.prototype.handleEmailStatusButtonPressed=function() {
this.saveMeetingRequestStateForEmail(this.i_event);
this.sendReply();
this.updateToolBarForEmail();
this.updateConflictMessageForEmail();
ApplicationEmail.handleMarkReply();
}
MeetingRequestDisplay.prototype.saveEvents=function(events) {
CalendarDataModel.saveMeetingRequestState(events);
}
MeetingRequestDisplay.prototype.handleDeclineSelected=function(e) {
var sels=this.parent().meetingList().getSelected();
if (sels.length==0) {
DialogManager.alert("There are no meeting requests selected.", "Decline Requests");
}
else if(sels.length==1){
this.declineSelected(sels);
}
else {
var d=DialogManager.confirm("Are you sure you want to decline all selected meeting requests?", "Decline Requests", undefined, Array("Yes", "No"), true, false, 1);
d.i_selection=sels;
EventHandler.register(d, "onclose", this.handleDeclineSelectedConfirm, this);
}
}
MeetingRequestDisplay.prototype.handleDeclineSelectedConfirm=function(e) {
if (e.button=="Yes") {
var sels=e.dialog.i_selection;
this.declineSelected(sels);
}
}
MeetingRequestDisplay.prototype.declineSelected=function(selections) {
this.parent().meetingList().dataModel().ignoreRefresh(true);
for (var x=0; x < selections.length; x++){ 
selections[x].meetingRequestState(4);
}
this.parent().meetingList().dataModel().ignoreRefresh(false);
this.saveEvents(selections);
if (selections.length==1) {
this.sendReply();
}
}
MeetingRequestDisplay.prototype.handleTentativeSelected=function(e) {
var sels=this.parent().meetingList().getSelected();
if (sels.length==0) {
DialogManager.alert("There are no meeting requests selected.", "Tentative Requests");
}
else if(sels.length==1){
this.tentativeSelected(sels);
}
else {
var d=DialogManager.confirm("Are you sure you want to make all selected meeting requests tentative?", "Tentative Requests", undefined, Array("Yes", "No"), true, false, 0);
d.i_selection=sels;
EventHandler.register(d, "onclose", this.handleTentativeSelectedConfirm, this);
}
}
MeetingRequestDisplay.prototype.handleTentativeSelectedConfirm=function(e) {
if (e.button=="Yes") {
var sels=e.dialog.i_selection;
this.tentativeSelected(sels);
}
}
MeetingRequestDisplay.prototype.tentativeSelected=function(selections) {
this.parent().meetingList().dataModel().ignoreRefresh(true);
for (var x=0; x < selections.length; x++){ 
selections[x].meetingRequestState(3);
}
this.parent().meetingList().dataModel().ignoreRefresh(false);
this.saveEvents(selections);
if (selections.length==1) {
this.sendReply();
}
this.parent().meetingList().clearSelected();
this.parent().handleListClick();
}
MeetingRequestDisplay.prototype.handleEmailAllClicked=function(e) {
var to_addrs=[];
var att=this.i_event.attendees();
for(var x=0; x < att.length; x++) {
to_addrs.push(att[x].defaultAlias());
}
var to_str=to_addrs.join(", ");
ApplicationEmail.newEmail(undefined, undefined, to_str, undefined);
}
MeetingRequestDisplay.prototype.handleCheckCalendarClicked=function(e) {
if (this.i_event.conflict()) {
this.parent().parent().getCalendarView().focusDate(this.i_event.firstConflictStartDate());
this.parent().parent().getCalendarView().viewTypes(2).active(true);
}
else {
this.parent().parent().getCalendarView().focusDate(this.i_event.startTime());
this.parent().parent().getCalendarView().viewTypes(2).active(true);
}
}
MeetingRequestDisplay.prototype.handleCheckCalendarClickedForEmail=function(e) {
SystemCore.loadApplicationByName('Calendar');
Application.getApplicationById(1004).getCalendarView().getCalendarView().focusDate(this.i_event.startTime());
}
MeetingRequestDisplay.prototype.sendReply=function() {
var msg=this.messageReplyValue();
if(msg.length > 0 && msg!=MeetingRequestDisplay.DEFAULT_MEETING_REPLY_MSG) {
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "emailEventHost"));
dn.addNode(new DataNode("aid", user_prefs['user_id']));
dn.addNode(new DataNode("from", this.i_event.getSelfAttendee().defaultAlias()));
dn.addNode(new DataNode("fromname", this.i_event.getSelfAttendee().displayName()));
dn.addNode(new DataNode("to", this.i_event.getMeetingHost().defaultAlias()));
dn.addNode(new DataNode("subject", this.i_event.getSelfAttendee().displayName()+" has responded to your invitation to \""+this.i_event.title()+"\""));
dn.addNode(new DataNode("message", this.i_event.getSelfAttendee().displayName()+" has replied to your meeting request. \n\nAttached Message:\n"+msg));
var r=PopoutWindow.createObject("RequestObject");
r.application("Event");
r.method("emailEventHost");
r.data(dn);
var notif=Notifications.add("Sending meeting reply");
r.i_notification=notif;
EventHandler.register(r, "oncomplete", this.handleRequestReplyRequestComplete, this);
r.execute();
this.messageReplyValue("");
}
}
MeetingRequestList.prototype.handleRequestReplyRequestComplete=function(e) {
e.request.i_notification.end();
}
MeetingRequestDisplay.prototype.createDisplayRow=function(field_name, width, height) {
var new_row=new Object();
var new_h=(height==undefined ? this.i_display_row_h : height);
var new_w=(width==undefined ? this.i_display_cell_w : width)
var row=document.createElement('DIV');
row.className="MeetingRequestDisplay_input_row";
row.style.width=new_w+"px";
row.style.height=new_h+"px";
new_row.row=row;
var label=document.createElement('DIV');
label.className="MeetingRequestDisplay_input_label";
label.style.height=new_h+"px";
label.style.width=this.i_input_label_w+"px";
label.innerHTML=field_name+":&nbsp;&nbsp;";
row.appendChild(label);
new_row.label=label;
var field=document.createElement('DIV');
field.className="MeetingRequestDisplay_input_field";
field.style.height=new_h+"px";
field.style.width=(new_w - this.i_input_label_w)+"px";
row.appendChild(field);
new_row.field=field;
return new_row;
}
MeetingRequestDisplay.prototype.getPaddingRow=function(width, border) {
var padded_row=document.createElement('DIV');
padded_row.className=(border==true ? "MeetingRequestDisplay_padding_row_border" : "MeetingRequestDisplay_padding_row");
padded_row.style.width=width+"px";
padded_row.style.height=this.i_padding_row_height+"px";
padded_row.innerHTML="&nbsp;";
return padded_row;
}	
MeetingRequestDisplay.prototype.getRecurrenceDisplay=function(event) {
var occ="only once";
var ends="No End Date";
if (event!=undefined) {
var recur=new Recurrence(event.recurrence());
var desc=recur.getDescription(event.startTime());
occ=(recur.type > -1 ? desc.occurs : "Once");
ends=(recur.type > -1 ? desc.ends : getNumericDateString(event.endTime()));
if (occ=="Once") {
return "This event occurs only once.";
} else {
if ((occ!=undefined) && (occ!=null) && (occ!="")) {
desc="Occurs "+occ;
}
if ((ends!=undefined) && (ends!=null) && (ends!="")) {
if (ends.substr(0, 7)=="Repeats") {
desc+=" and ";
} else if ((ends=="No End Date") || (ends=="No End Time")) {
desc+=" and has no ending point.";
return desc;
}
desc+=ends;
} else {
desc+=" and has no ending point.";
}
return desc;
}
}
}
MeetingRequestDisplay.prototype.showBatchDiv=function(state) {
if (state!=undefined) {
if (state) {
this.i_batch_div.style.display="";
this.i_display_holder.style.display="none";
}
else {
this.i_batch_div.style.display="none";
this.i_display_holder.style.display="";
}
this.i_batch_div_vis=state;
}
return this.i_batch_div_vis;
}
MeetingRequestDisplay.prototype.getBatchRequestDiv=function() {
if (this.i_batch_div==undefined) {
this.i_batch_div=document.createElement('DIV');
this.i_batch_div.className="TaskPreview_message";
this.i_batch_div.style.width=this.width()+"px";
this.i_batch_div.style.height=this.height()+"px";
this.i_batch_div.style.lineHeight=this.height()+"px";
this.showBatchDiv(false);
this.i_batch_div.innerHTML="Test!";
}
return this.i_batch_div;
}
MeetingRequestDisplay.prototype.batchDivText=function(text) {
if (text!=undefined) {
this.i_batch_div.innerHTML=text;
}
return this.i_batch_div.innerHTML;
}
MeetingRequestDisplay.prototype.toolBar=function() {
if (this.i_tools==undefined) {
this.i_tools=new ToolBar(this.width());
this.i_tools_accept=new IconLabelButton("Accept", "CalendarView_icon_accept", 16, 16, 63, 17, "Accept Requests");
EventHandler.register(this.i_tools_accept, "onclick", this.handleAcceptSelected, this);
this.i_tools_decline=new IconLabelButton("Decline", "CalendarView_icon_decline", 16, 16, 60, 17, "Decline Requests");
EventHandler.register(this.i_tools_decline, "onclick", this.handleDeclineSelected, this);
this.i_tools_tentative=new IconLabelButton("Mark as Tentative", "CalendarView_icon_tentative", 16, 16, 110, 17, "Mark Requests as Tentative");
EventHandler.register(this.i_tools_tentative, "onclick", this.handleTentativeSelected, this);
this.i_tools_check_calendar=new IconLabelButton("Check Calendar", "CalendarView_icon_daily", 16, 16, 110, 17, "Check Calendar");
EventHandler.register(this.i_tools_check_calendar, "onclick", this.handleCheckCalendarClicked, this);
this.i_tools_email_all=new IconLabelButton("Email all attendees", "ApplicationEmail_small", 16, 16, 112, 17, "Email all attendees");
EventHandler.register(this.i_tools_email_all, "onclick", this.handleEmailAllClicked, this);
this.i_tools.addItem(new ToolBarButton(this.i_tools_accept));
this.i_tools.addItem(new ToolBarButton(this.i_tools_decline));
this.i_tools.addItem(new ToolBarButton(this.i_tools_tentative));
this.i_tools.addItem(new ToolBarDivider());
this.i_tools.addItem(new ToolBarButton(this.i_tools_check_calendar));
this.i_tools.addItem(new ToolBarButton(this.i_tools_email_all));
}
return this.i_tools;
}
MeetingRequestDisplay.prototype.toolBarForEmail=function() {
if (this.i_tools==undefined) {
this.i_tools=new ToolBar(parseInt(this.width()));
this.i_tools_accept=new IconLabelButton("Accept", 
"CalendarView_icon_accept", 16, 16, 63, 17, "Accept Requests");
EventHandler.register(this.i_tools_accept, "onclick", 
this.handleEmailAccept, this);
this.i_tools_decline=new IconLabelButton("Decline", 
"CalendarView_icon_decline", 16, 16, 60, 17, "Decline Requests");
EventHandler.register(this.i_tools_decline, "onclick", 
this.handleEmailDecline, this);
this.i_tools_tentative=new IconLabelButton("Mark as Tentative", 
"CalendarView_icon_tentative", 16, 16, 110, 17, "Mark Requests as Tentative");
EventHandler.register(this.i_tools_tentative, "onclick", 
this.handleEmailTentative, this);
this.i_tools_check_calendar=new IconLabelButton("Check Calendar", 
"CalendarView_icon_daily", 16, 16, 110, 17, "Check Calendar");
EventHandler.register(this.i_tools_check_calendar, "onclick", 
this.handleCheckCalendarClickedForEmail, this);
this.i_tools_email_all=new IconLabelButton("Email all attendees", 
"ApplicationEmail_small", 16, 16, 110, 17, "Email all attendees");
EventHandler.register(this.i_tools_email_all, "onclick", 
this.handleEmailAllClicked, this);
this.i_tools.addItem(new ToolBarButton(this.i_tools_accept));
this.i_tools.addItem(new ToolBarButton(this.i_tools_decline));
this.i_tools.addItem(new ToolBarButton(this.i_tools_tentative));
this.i_tools.addItem(new ToolBarDivider());
this.i_tools.addItem(new ToolBarButton(this.i_tools_check_calendar));
this.i_tools.addItem(new ToolBarButton(this.i_tools_email_all));
}
return this.i_tools;
}
MeetingRequestDisplay.prototype.updateToolBarForEmail=function() {
this.toolBarEnabled(true);
if(this.i_event.startTime() < new Date()) {
this.i_tools_accept.enabled(false);
this.i_tools_decline.enabled(false);
this.i_tools_tentative.enabled(false);
} else {
if(this.i_event.meetingRequestState()==2) { 
this.i_tools_accept.enabled(false);
this.i_tools_decline.enabled(true);
this.i_tools_tentative.enabled(true);
} else if(this.i_event.meetingRequestState()==4) { 
this.i_tools_accept.enabled(true);
this.i_tools_decline.enabled(false);
this.i_tools_tentative.enabled(true);
} else { 
this.i_tools_accept.enabled(true);
this.i_tools_decline.enabled(true);
this.i_tools_tentative.enabled(true);
}
}
}
MeetingRequestDisplay.prototype.updateConflictMessageForEmail=function() {
this.i_conflict_holder.style.display="";
if(this.i_event.startTime() < new Date()) { 
this.i_conflict_text.innerHTML="This event has already occurred.";
} else if(this.i_event.meetingRequestState()==2) { 
this.i_conflict_text.innerHTML="The meeting request has been accepted.";
} else if(this.i_event.meetingRequestState()==3) { 
this.i_conflict_text.innerHTML="The meeting request has been marked as tentative."
} else if(this.i_event.meetingRequestState()==4) { 
this.i_conflict_text.innerHTML="The meeting request has been declined.";
} else {
if(this.i_event.conflictIconTip) {
var conflict_text=this.i_event.conflictIconTip();
if((conflict_text!=undefined) && (conflict_text!="")) {
this.i_conflict_text.innerHTML=conflict_text;
} else {
this.i_conflict_holder.style.display="none";
}
} else {
this.i_conflict_holder.style.display="none";
}
}
}
MeetingRequestDisplay.prototype.getContent=function() {
if (this.i_request_display==undefined) {
this.parent().getPreviewDiv().appendChild(this.toolBar().getBar());
this.toolBarEnabled(false);
this.i_request_display=document.createElement('DIV');
this.i_request_display.className="MeetingRequestDisplay";
this.i_request_display.style.width=this.width()+"px";
this.i_request_display.style.height=this.height()+"px";
this.i_display_holder=document.createElement('DIV');
this.i_display_holder.className="MeetingRequestDisplay_display_holder";
this.i_display_holder.style.width=this.width()+"px";
this.i_conflict_holder=document.createElement('DIV');
this.i_conflict_holder.className="MeetingRequestDisplay_conflict_holder";
this.i_conflict_cell=document.createElement('DIV');
this.i_conflict_cell.className="MeetingRequestDisplay_conflict_cell";
this.i_conflict_text=document.createElement('DIV');
this.i_conflict_text.className="MeetingRequestDisplay_conflict_text";
this.i_conflict_cell.appendChild(this.i_conflict_text);
this.i_conflict_holder.appendChild(this.i_conflict_cell);
this.i_display_holder.appendChild(this.i_conflict_holder);
this.i_padding_col_left=document.createElement('DIV');
this.i_padding_col_left.className="MeetingRequestDisplay_padding_col_left";
this.i_padding_col_left.style.width=this.i_padding_col_left_w+"px";
this.i_padding_col_left.style.height=this.height()+"px";
this.i_display_holder.appendChild(this.i_padding_col_left);
this.i_display_cell=document.createElement('DIV');
this.i_display_cell.className="MeetingRequestDisplay_display_cell";
this.i_display_cell.style.width=this.i_display_cell_w+"px";
this.i_display_holder.appendChild(this.i_display_cell);
var padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.message=new Object();
var new_row=this.createDisplayRow("Message", undefined, (this.i_display_row_h * 3));
this.i_inputs.message=new_row;
this.i_message_reply=document.createElement('TEXTAREA');
this.i_message_reply.value=MeetingRequestDisplay.DEFAULT_MEETING_REPLY_MSG;
EventHandler.register(this.i_message_reply, "onfocus", this.handleMeetingReplyFocus, this);
this.i_message_reply.style.height=(this.i_display_row_h * 3)+"px";
this.i_inputs.message.field.appendChild(this.i_message_reply);
this.i_display_cell.appendChild(this.i_inputs.message.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.subject=new Object();
new_row=this.createDisplayRow("Subject");
this.i_inputs.subject=new_row;
this.i_display_cell.appendChild(this.i_inputs.subject.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.location=new Object();
new_row=this.createDisplayRow("Location");
this.i_inputs.location=new_row;
this.i_display_cell.appendChild(this.i_inputs.location.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.starttime=new Object();
new_row=this.createDisplayRow("Start");
this.i_inputs.starttime=new_row;
this.i_inputs.starttime.row.style.width=(this.i_input_label_w * 2.5)+"px";
this.i_inputs.starttime.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.starttime.field.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.endtime=new Object();
new_row=this.createDisplayRow("End");
this.i_inputs.endtime=new_row;
this.i_inputs.endtime.row.style.width=((this.i_input_label_w * 1.9)+1)+"px";
this.i_inputs.endtime.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.endtime.field.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.endtime.label.style.width=(this.i_input_label_w * .4)+"px";
this.i_start_end_holder=document.createElement('DIV');
this.i_start_end_holder.style.height=this.i_display_row_h+"px";
this.i_start_end_holder.style.width=((this.i_input_label_w * 4.4)+3)+"px";
this.i_start_end_holder.appendChild(this.i_inputs.starttime.row);
this.i_start_end_holder.appendChild(this.i_inputs.endtime.row);
this.i_display_cell.appendChild(this.i_start_end_holder);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.duration=new Object();
new_row=this.createDisplayRow("Duration");
this.i_inputs.duration=new_row;
this.i_inputs.duration.row.style.width=(this.i_input_label_w * 2.5)+"px";
this.i_inputs.duration.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.duration.field.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.privateind=new Object();
new_row=this.createDisplayRow("Private Event");
this.i_inputs.privateind=new_row;
this.i_inputs.privateind.row.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.privateind.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.privateind.field.style.width=(this.i_input_label_w * .5)+"px";
this.i_dur_priv_holder=document.createElement('DIV');
this.i_dur_priv_holder.style.height=this.i_display_row_h+"px";
this.i_dur_priv_holder.style.width=((this.i_input_label_w * 4)+3)+"px";
this.i_dur_priv_holder.appendChild(this.i_inputs.duration.row);
this.i_dur_priv_holder.appendChild(this.i_inputs.privateind.row);
this.i_display_cell.appendChild(this.i_dur_priv_holder);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.description=new Object();
new_row=this.createDisplayRow("Description");
this.i_inputs.description=new_row;
this.i_display_cell.appendChild(this.i_inputs.description.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.recurrence=new Object();
new_row=this.createDisplayRow("Recurrence");
this.i_inputs.recurrence=new_row;
this.i_display_cell.appendChild(this.i_inputs.recurrence.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.attachments=new Object();
new_row=this.createDisplayRow("Attachments");
this.i_inputs.attachments=new_row;
this.i_display_cell.appendChild(this.i_inputs.attachments.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_padding_col_right=document.createElement('DIV');
this.i_padding_col_right.className="MeetingRequestDisplay_padding_col_right";
this.i_padding_col_right.style.width=this.i_padding_col_right_w+"px";
this.i_padding_col_right.style.height=this.height()+"px";
this.i_display_holder.appendChild(this.i_padding_col_right);
this.i_attendees_holder=document.createElement('DIV');
this.i_attendees_holder.className="MeetingRequestDisplay_attendess_holder";
this.i_attendees_grid=new DataGrid(this.width(), 100, undefined, undefined, Array("DataGrid_column_selected"));
this.i_attendees_grid.addHeader(new DataGridHeader("displayName", "displayName", 30, "Name"));
this.i_attendees_grid.addHeader(new DataGridHeader("status_text", "status", 30, "Status"));
this.i_attendees_holder.appendChild(this.i_attendees_grid.getGrid());
this.i_display_holder.appendChild(this.i_attendees_holder);
this.i_request_display.appendChild(this.i_display_holder);
this.i_request_display.appendChild(this.getBatchRequestDiv());
}
return this.i_request_display;
}
MeetingRequestDisplay.prototype.getContentForEmail=function() {
if (this.i_request_display==undefined) {
this.i_is_email_preview=true;
this.i_request_display=document.createElement('DIV');
this.i_request_display.className="MeetingRequestDisplay";
this.i_request_display.style.width=this.width()+"px";
this.i_request_display.style.height="auto";
this.i_request_display.style[!document.all ? "cssFloat" : "styleFloat"]="left";
this.i_request_display.style.paddingBottom=(this.i_padding_row_height ? this.i_padding_row_height * 2 : 10)+"px";
this.i_request_display.style.overflow="visible";
this.i_request_display.appendChild(this.toolBarForEmail().getBar());
this.i_display_holder=document.createElement('DIV');
this.i_display_holder.className="MeetingRequestDisplay_display_holder";
this.i_display_holder.style.width=(parseInt(this.width()))+"px";
this.i_conflict_holder=document.createElement('DIV');
this.i_conflict_holder.className="MeetingRequestDisplay_conflict_holder";
this.i_conflict_holder.style.display="none";
this.i_conflict_cell=document.createElement('DIV');
this.i_conflict_cell.className="MeetingRequestDisplay_conflict_cell";
this.i_conflict_text=document.createElement('DIV');
this.i_conflict_text.className="MeetingRequestDisplay_conflict_text";
this.i_conflict_cell.appendChild(this.i_conflict_text);
this.i_conflict_holder.appendChild(this.i_conflict_cell);
this.i_display_holder.appendChild(this.i_conflict_holder);
this.i_display_cell=document.createElement('DIV');
this.i_display_cell.className="MeetingRequestDisplay_display_cell";
this.i_display_cell.style.width=this.i_display_cell_w+"px";
this.i_display_holder.appendChild(this.i_display_cell);
this.i_display_cell.style.paddingLeft=(this.i_padding_col_left_w ? this.i_padding_col_left_w : 10)+"px";
this.i_display_cell.style.height="auto";
this.i_display_cell.style[!document.all ? "cssFloat" : "styleFloat"]="left";
var padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.subject=new Object();
new_row=this.createDisplayRow("Subject");
this.i_inputs.subject=new_row;
this.i_display_cell.appendChild(this.i_inputs.subject.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.location=new Object();
new_row=this.createDisplayRow("Location");
this.i_inputs.location=new_row;
this.i_display_cell.appendChild(this.i_inputs.location.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.starttime=new Object();
new_row=this.createDisplayRow("Start");
this.i_inputs.starttime=new_row;
this.i_inputs.starttime.row.style.width=(this.i_input_label_w * 2.5)+"px";
this.i_inputs.starttime.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.starttime.field.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.endtime=new Object();
new_row=this.createDisplayRow("End");
this.i_inputs.endtime=new_row;
this.i_inputs.endtime.row.style.width=((this.i_input_label_w * 1.9)+1)+"px";
this.i_inputs.endtime.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.endtime.field.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.endtime.label.style.width=(this.i_input_label_w * .4)+"px";
this.i_start_end_holder=document.createElement('DIV');
this.i_start_end_holder.style.height=this.i_display_row_h+"px";
this.i_start_end_holder.style.width=((this.i_input_label_w * 4.4)+3)+"px";
this.i_start_end_holder.appendChild(this.i_inputs.starttime.row);
this.i_start_end_holder.appendChild(this.i_inputs.endtime.row);
this.i_display_cell.appendChild(this.i_start_end_holder);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.duration=new Object();
new_row=this.createDisplayRow("Duration");
this.i_inputs.duration=new_row;
this.i_inputs.duration.row.style.width=(this.i_input_label_w * 2.5)+"px";
this.i_inputs.duration.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.duration.field.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.privateind=new Object();
new_row=this.createDisplayRow("Private Event");
this.i_inputs.privateind=new_row;
this.i_inputs.privateind.row.style.width=(this.i_input_label_w * 1.5)+"px";
this.i_inputs.privateind.row.className="MeetingRequestDisplay_input_row_float";
this.i_inputs.privateind.field.style.width=(this.i_input_label_w * .5)+"px";
this.i_dur_priv_holder=document.createElement('DIV');
this.i_dur_priv_holder.style.height=this.i_display_row_h+"px";
this.i_dur_priv_holder.style.width=((this.i_input_label_w * 4)+3)+"px";
this.i_dur_priv_holder.appendChild(this.i_inputs.duration.row);
this.i_dur_priv_holder.appendChild(this.i_inputs.privateind.row);
this.i_display_cell.appendChild(this.i_dur_priv_holder);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.description=new Object();
new_row=this.createDisplayRow("Description");
this.i_inputs.description=new_row;
this.i_display_cell.appendChild(this.i_inputs.description.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.recurrence=new Object();
new_row=this.createDisplayRow("Recurrence");
this.i_inputs.recurrence=new_row;
this.i_display_cell.appendChild(this.i_inputs.recurrence.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,true);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.attachments=new Object();
new_row=this.createDisplayRow("Attachments");
this.i_inputs.attachments=new_row;
this.i_display_cell.appendChild(this.i_inputs.attachments.row);
padding_row=this.getPaddingRow(this.i_display_cell_w,false);
this.i_padding_rows.push(padding_row);
this.i_display_cell.appendChild(padding_row);
this.i_inputs.message=new Object();
var new_row=this.createDisplayRow("Message", undefined, (this.i_display_row_h * 3));
this.i_inputs.message=new_row;
this.i_message_reply=document.createElement('TEXTAREA');
this.i_message_reply.value=MeetingRequestDisplay.DEFAULT_MEETING_REPLY_MSG;
EventHandler.register(this.i_message_reply, "onfocus", this.handleMeetingReplyFocus, this);
this.i_message_reply.style.height=(this.i_display_row_h * 3)+"px";
this.i_message_reply.style.width=(parseInt(this.width())-150);
this.i_inputs.message.field.appendChild(this.i_message_reply);
this.i_display_cell.appendChild(this.i_inputs.message.row);
this.i_request_display.appendChild(this.i_display_holder);
this.i_request_display.appendChild(this.getBatchRequestDiv());
}
return this.i_request_display;
}
MeetingRequestDisplay.prototype.clearRequest=function() { 
var ins=this.i_inputs;
ins.subject.field.innerHTML="";
ins.location.field.innerHTML="";
ins.starttime.field.innerHTML="";
ins.endtime.field.innerHTML=""
ins.duration.field.innerHTML="";
ins.privateind.field.innerHTML="";
ins.description.field.innerHTML="";
ins.recurrence.field.innerHTML="";
}
MeetingRequestDisplay.prototype.toolBarEnabled=function(state) { 
if (state!=undefined) {
this.i_tools_state=state;
if (state) {
this.i_tools.getBar().style.display="";
}
else {
this.i_tools.getBar().style.display="none";
}
}
return this.i_tools_state;
}
MeetingRequestDisplay.prototype.loadRequestForEmail=function(event) { 
this.i_event=event;
this.i_load_details_event=EventHandler.register(this.i_event,
"onloaddetails", this.handleLoadRequestDetailsForEmail, this);
this.i_load_files_event=EventHandler.register(this.i_event, 
"onfilesload", this.handleLoadRequestFiles, this);
this.i_event.loadDetails(true, false, false, true, false, true);
}
MeetingRequestDisplay.prototype.loadRequest=function(event) { 
this.i_event=event;
this.i_load_details_event=EventHandler.register(this.i_event, "onloaddetails", this.handleLoadRequestDetails, this);
this.i_load_attendees_event=EventHandler.register(this.i_event, "onattendees", this.handleLoadRequestAttendees, this);
this.i_load_reminder_event=EventHandler.register(this.i_event, "onreminderload", this.handleLoadRequestReminder, this);
this.i_load_files_event=EventHandler.register(this.i_event, "onfilesload", this.handleLoadRequestFiles, this);
this.clearRequest();
this.toolBarEnabled(false);
this.i_conflict_holder.style.display="none";
this.i_inputs.attachments.row.style.display="none";
this.i_message_reply.value=MeetingRequestDisplay.DEFAULT_MEETING_REPLY_MSG;
if (!this.i_event.isNew()) {
this.i_event.loadDetails(true, true, false, true); 
}
this.i_attendees_grid.dataModel(this.i_event.getAttendeesDM());
this.i_event.getAttendeesDM().fireRefresh(); 
}
MeetingRequestDisplay.prototype.loadRequestDetails=function() {
var ins=this.i_inputs;
if (this.i_event.conflict()) {
this.i_conflict_holder.style.display="";
this.i_conflict_text.innerHTML=this.i_event.conflictIconTip();
}
else {
this.i_conflict_holder.style.display="none";
}
ins.subject.field.innerHTML=this.i_event.title();
ins.location.field.innerHTML=this.i_event.location();
if (this.i_event.allDay()==true) {
ins.starttime.field.innerHTML=getNumericDateString(this.i_event.startTime());
ins.endtime.field.innerHTML=getNumericDateString(this.i_event.endTime());
}
else {
ins.starttime.field.innerHTML=getNumericDateString(this.i_event.startTime())+" "+getTimeString(this.i_event.startTime());
ins.endtime.field.innerHTML=getNumericDateString(this.i_event.endTime())+" "+getTimeString(this.i_event.endTime());
}
var options=EventDisplay.generateDurationOptions();
var cur_dur=(this.i_event.allDay()==true ? "allday" : this.i_event.duration()+"");
for (var oi=0; oi < options.length; oi++) { 	 
if (options[oi].i_value==cur_dur) {
ins.duration.field.innerHTML=options[oi].i_name;
}
}
ins.privateind.field.innerHTML=(this.i_event.personal()=="0" ? "No" : "Yes");
ins.description.field.innerHTML=this.i_event.description();
var td=TextDimension(this.i_inputs.description.field.innerHTML, undefined, this.i_display_cell_w - this.i_input_label_w, true);
if (td.height >=this.i_display_row_h) {
this.i_inputs.description.row.style.height=td.height+"px";
}
else {
this.i_inputs.description.row.style.height=this.i_display_row_h+"px";
}
ins.recurrence.field.innerHTML=this.getRecurrenceDisplay(this.i_event);
this.toolBarEnabled(true);
}
MeetingRequestDisplay.prototype.loadEventNotFoundForEmail=function() {
this.clearRequest();
this.toolBarEnabled(false);
this.i_conflict_holder.style.display="";
this.i_conflict_text.innerHTML="<b>Event not found.</b><br>"+"The event referenced by this meeting request no longer exists.";
this.i_display_cell.style.display="";
}
MeetingRequestDisplay.prototype.loadRequestDetailsForEmail=function() {
var ins=this.i_inputs;
if(this.i_event.conflict) {
if (this.i_event.conflict()) {
this.i_conflict_holder.style.display="";
this.i_conflict_text.innerHTML=this.i_event.conflictIconTip();
}
else {
this.i_conflict_holder.style.display="none";
}
} else {
this.i_conflict_holder.style.display="none";
}
ins.subject.field.innerHTML=this.i_event.title();
ins.location.field.innerHTML=this.i_event.location();
if (this.i_event.allDay()==true) {
ins.starttime.field.innerHTML=getNumericDateString(this.i_event.startTime());
ins.endtime.field.innerHTML=getNumericDateString(this.i_event.endTime());
}
else {
ins.starttime.field.innerHTML=getNumericDateString(this.i_event.startTime())+" "+getTimeString(this.i_event.startTime());
ins.endtime.field.innerHTML=getNumericDateString(this.i_event.endTime())+" "+getTimeString(this.i_event.endTime());
}
var options=EventDisplay.generateDurationOptions();
var cur_dur=(this.i_event.allDay()==true ? "allday" : this.i_event.duration()+"");
for (var oi=0; oi < options.length; oi++) { 	 
if (options[oi].i_value==cur_dur) {
ins.duration.field.innerHTML=options[oi].i_name;
}
}
ins.privateind.field.innerHTML=(this.i_event.personal()=="0" ? "No" : "Yes");
ins.description.field.innerHTML=this.i_event.description();
var td=TextDimension(this.i_inputs.description.field.innerHTML, undefined, this.i_display_cell_w - this.i_input_label_w, true);
if (td.height >=this.i_display_row_h) {
this.i_inputs.description.row.style.height=td.height+"px";
}
else {
this.i_inputs.description.row.style.height=this.i_display_row_h+"px";
}
ins.recurrence.field.innerHTML=this.getRecurrenceDisplay(this.i_event);
this.updateConflictMessageForEmail();
this.updateToolBarForEmail();
}
MeetingRequestDisplay.prototype.resizeMeetingRequestForEmail=function(width, height) {
var scrollWidth=scrollBarWidth();
var meetingWidth=parseInt(width) - (scrollWidth ? scrollWidth : 0) - 12;
this.width(meetingWidth);
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.CalendarMeetingRequests.js");
function ReminderDisplay(config){
this.superPopoutDisplay(config);
this.i_showToolbar=false;
if(this.i_popoutWindow!==undefined) {
this.i_reminder_popInternal=EventHandler.register(this.i_popoutWindow, "onpopinternal", this.handleInternalPop, this);
this.i_reminder_popExternal=EventHandler.register(this.i_popoutWindow, "onpopexternal", this.handleExternalPop, this);
this.i_reminder_terminate=EventHandler.register(this.i_popoutWindow, "onterminate",   this.handleTermination, this);
}
this.i_reminder_resize=EventHandler.register(this.i_windowObject, "oncontentresize", this.handleResize, this);
var width=500;
var height=350;
var dataModel=this.mainWindow().ApplicationCalendar.i_cur_rem_dm;
this.i_width=width;
this.i_height=height;
this.i_item_cache=Array();
this.i_scroll=false;
this.dataModel(dataModel);
this.windowTitle("Reminders");
this.i_description_text="";
this.i_description_width=426;
this.i_handlers=[];
this.i_windowObject.loadContent(this.getReminder());
this.i_windowObject.closeOnImport(false); 	
}
ReminderDisplay.prototype.destructor=function(closeWin) {
this.i_reminder_list.dataModel(false); 
if (this.i_reminder_popInternal) this.i_reminder_popInternal=!this.i_reminder_popInternal.unregister();
if (this.i_reminder_popExternal) this.i_reminder_popExternal=!this.i_reminder_popExternal.unregister();
if (this.i_reminder_terminate)	 this.i_reminder_terminate=!this.i_reminder_terminate.unregister();
if (this.i_reminder_resize)		 this.i_reminder_resize=!this.i_reminder_resize.unregister();
if (this.i_dm_l) 				 this.i_dm_l=!this.i_dm_l.unregister();
for (var i=0; i < this.i_handlers.length;++i) {
if (this.i_handlers[i]!=undefined && typeof this.i_handlers[i].unregister=="function") {
this.i_handlers[i].unregister();
}
}
this.i_handlers=[];
if (closeWin) this.closeWindow();
}
ReminderDisplay.getDependencies=function() {
return ["@ApplicationCalendar",
"@DataList",
"ReminderDisplay",
"ReminderDisplayItem",
"CalendarReminder",
"=ReminderDisplay.intervals",
"=ReminderDisplay.clearDisplayState"];
}
ReminderDisplay.inherit(PopoutDisplay);
ReminderDisplay.intervals=[['2 days prior to start', '-2880'], ['1 day prior to start', '-1440'], ['12 hours prior to start', '-720'], 
['8 hours prior to start', '-480'], ['4 hours prior to start', '-240'], ['2 hours prior to start', '-120'], 
['1 hour prior to start', '-60'], ['30 minutes prior to start', '-30'], ['15 minutes prior to start', '-15'], 
['10 minutes prior to start', '-10'], ['5 minutes prior to start', '-5'], ['0 minutes prior to start', '0'], 
['5 minutes', '5'], ['10 minutes', '10'], ['15 minutes', '15'], 
['30 minutes', '30'], ['1 hour', '60'], ['2 hours', '120'], 
['4 hours', '240'], ['8 hours', '480'], ['12 hours', '720'], 
['1 day', '1440'], ['2 days', '2880']];
ReminderDisplay.padding=5;
ReminderDisplay.buttonHeight=20;
ReminderDisplay.labelHeight=20;
ReminderDisplay.generalMargin=10;
ReminderDisplay.prototype.handleTermination=function(o){
if(o.final) {
if(this.i_reminder_list.pageEntries() > 0 && !this.i_hasNoReminders) {
this.handleDismissAll();
}
}
this.destructor(true);
}
ReminderDisplay.prototype.dataModel=function(dataModel) {
if (dataModel!=undefined) {
if (this.i_dm_l) this.i_dm_l=!this.i_dm_l.unregister();
this.i_dataModel=dataModel;
this.i_dm_l=EventHandler.register(this.i_dataModel, "onrefresh", this.refreshData, this);
this.refreshData();
}
return this.i_dataModel;
}
ReminderDisplay.prototype.handleResize=function(o){
var width=parseInt(o.originalScope.effectiveWidth() - WindowManager.window_border_width - 2);
var height=parseInt(o.originalScope.effectiveHeight() - (o.originalScope.titleBar()!==undefined ? o.originalScope.titleBar().height() : 0) - WindowManager.window_border_width - 2);
this.resize({width: width, height: height});
}
ReminderDisplay.prototype.resize=function(o) {
var width=o.width;
var height=o.height;
if(typeof width!="undefined") {
this.width(width);
}
if(typeof height!="undefined") {
this.height(height);
o.height=o.height - (this.i_showToolbar ? this.i_toolbar.height() : 0);
}
};
ReminderDisplay.prototype.getWindowObject=function(){
if(this.i_windowObject==undefined){
this.i_windowObject=new WindowObject('cal-rem', "", 100, 100, Application.titleBarFactory());
this.i_windowObject.temporary(true);
this.i_windowObject.global(true);
this.i_windowObject.titleBar().removeButton(Application.i_title_dock);
}
return this.i_windowObject;
}
ReminderDisplay.prototype.width=function(width) {
if (width!=undefined) {
if(width < 300) width=300;
this.i_width=width;
if (this.i_reminder!=undefined) {
width -=((2*ReminderDisplay.generalMargin) - 2+(document.all ? 2 : 0));
this.i_reminder.style.width=width+"px";
this.i_reminder_top_wrapper.style.width=width+"px";
this.i_reminder_title.style.width=(width - parseInt(this.getPopoutButton().getButton().style.width) - 16 - (2*ReminderDisplay.generalMargin))+"px";
this.i_reminder_list_box.style.width=width+"px";
this.i_reminder_list.width(width);
this.i_reminder_top_button_wrapper.style.width=width+"px";
this.i_reminder_top_button_wrapper_spacer.style.width=(width - parseInt(this.i_reminder_open_item_button.getButton().style.width) - parseInt(this.i_reminder_dismiss_one_button.getButton().style.width) - parseInt(this.i_reminder_dismiss_all_button.getButton().style.width) - ReminderDisplay.generalMargin)+"px";
this.i_reminder_snooze_label.style.width=width+"px";
this.i_reminder_bottom_wrapper.style.width=width+'px';
this.i_reminder_snooze_box.width(width - parseInt(this.i_reminder_snooze_all_button.getButton().style.width) - parseInt(this.i_reminder_snooze_one_button.getButton().style.width) - (2*ReminderDisplay.generalMargin) - 2);
this.i_description_width=width - 52;
if(this.i_description_width < 0) {
this.i_description_width=0;
}
}
}
return this.i_width;
}
ReminderDisplay.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_reminder!=undefined) {
height -=((2*ReminderDisplay.generalMargin) - 2+(document.all ? 4 : 0));
this.i_reminder.style.height=(height-1)+"px";
var listHeight=height;
for(var x=0; x < this.i_reminder.childNodes.length; x++){
if(this.i_reminder.childNodes[x]!=this.i_reminder_list.getGrid().parentNode){
listHeight -=parseInt(this.i_reminder.childNodes[x].style.height);	
}
listHeight -=parseInt(this.i_reminder.childNodes[x].style.marginBottom);	
}
if(listHeight < 60){
this.i_reminder.style.height=(height+(60 - listHeight))+"px";
listHeight=60;
}
this.i_reminder_list_box.style.height=listHeight;
this.i_reminder_list.height(listHeight);
}
}
return this.i_height;
}
ReminderDisplay.prototype.reminderCount=function() {
return this.i_rems;
}
ReminderDisplay.prototype.refreshData=function() {
if (this.dataModel()!=undefined && this.i_reminder_list!=undefined) {
var rems=this.dataModel().getScheduledReminders(60);
this.i_rems=rems.length;
if (rems.length==0) {
this.i_hasNoReminders=true;
this.destructor(true);
} else {
this.i_hasNoReminders=undefined;
this.windowTitle(""+this.i_rems+" Reminder"+(this.i_rems==1 ? "" : "s"));
this.handleSelectionChange();
this.i_reminder_list.updateColumns();
}
}
}
ReminderDisplay.prototype.handleDismissAll=function(e) {
this.i_reminder_list.selectAll();
this.handleSelectionChange();
this.handleDismiss();	
}
ReminderDisplay.prototype.handleSnoozeAll=function(e) {
this.i_reminder_list.selectAll();
this.handleSelectionChange();
this.handleSnooze();
}
ReminderDisplay.prototype.handleDismiss=function(e){
this.mainWindow().CalendarReminderDataModel.dismissReminders(this.i_selectedReminders);
this.refreshData();
};
ReminderDisplay.prototype.handleSnooze=function(e){
this.dataModel().ignoreRefresh(true); 
var sv=[];
var r=this.i_selectedReminders;
var sel=(e && e.i_id ? e.i_id : this.getSelectedSnoozeInterval());
for (var x=0; x < r.length; x++) {
var d;
if (sel > 0) {
d=new Date();
d.setTime(d.getTime()+(sel * 60000));
}
else {
d=r[x].eventObject().startTime().copy();
d.setTime(d.getTime()+(sel * 60000));
}
r[x].date(d);
sv[sv.length]=r[x];
}
this.i_reminder_list.clearSelected();
this.mainWindow().CalendarReminderDataModel.saveReminders(sv);
this.refreshData();
}
ReminderDisplay.prototype.getSelectedSnoozeInterval=function(){
var options=this.i_reminder_snooze_box.options();
for(var x=0;x < options.length; x++){
if(options[x].selected()){
return parseInt(options[x].value());
}
}
return 0;
}
ReminderDisplay.prototype.getReminder=function() {
if (this.i_reminder==undefined) {
this.i_reminder=document.createElement('DIV');
this.i_reminder.className="ReminderDisplay";
this.i_reminder.style.width=this.width()+"px";
this.i_reminder.style.height=this.height()+"px";
this.i_reminder.style.padding=ReminderDisplay.generalMargin+"px";
var width=this.width();
var pop_out_button=this.getPopoutButton();
pop_out_button.height(22);
this.i_reminder_top_wrapper=document.createElement("div");
this.i_reminder_top_wrapper.style.width=width+"px";
this.i_reminder_top_wrapper.style.height=pop_out_button.getButton().style.height;
this.i_reminder_top_wrapper.style.marginBottom=ReminderDisplay.generalMargin+"px";
this.i_reminder_icon=document.createElement("div");
this.i_reminder_icon.className="ReminderDisplay_icon";
this.i_reminder_icon.style.width="16px";
this.i_reminder_icon.style.height="16px";
this.i_reminder_icon.style.marginRight=ReminderDisplay.generalMargin+"px";
this.i_reminder_icon.style[document.all ? "styleFloat" : "cssFloat"]="left";
this.i_reminder_icon.style.backgroundImage="url(/gui/img/_icomap.gif)";
this.i_reminder_icon.style.backgroundPosition="0px -2208px";
this.i_reminder_icon.style.marginTop="1px";
this.i_reminder_top_wrapper.appendChild(this.i_reminder_icon);
this.i_reminder_title=document.createElement('DIV');
this.i_reminder_title.className="ReminderDisplay_title";
this.i_reminder_title.style.width=(width - parseInt(pop_out_button.getButton().style.width) - 16 - (2*ReminderDisplay.generalMargin))+"px";
this.i_reminder_title.style.marginRight=ReminderDisplay.generalMargin+"px";
this.i_reminder_title.style.height=this.i_reminder_title.style.lineHeight="18px";
this.i_reminder_title.style.overflow="hidden";
this.i_reminder_title.style[document.all ? "styleFloat" : "cssFloat"]="left";
this.i_reminder_title.innerHTML="";
this.i_reminder_top_wrapper.appendChild(this.i_reminder_title);
this.i_reminder_top_wrapper.appendChild(pop_out_button.getButton());
this.i_reminder.appendChild(this.i_reminder_top_wrapper);
var dm=this.mainWindow().CalendarReminderDataModel.getDefaultDataModel();
this.i_reminder_list=new DataGrid(width, 150, dm, undefined, Array("DataGrid_column_selected"));
var dlh1=new DataGridHeader("title","title","45%","Title");
var dlh2=new DataGridHeader("location","location","25%","Location");
var dlh3=new DataGridHeader("startstring","startstring","30%","Starts At",undefined,undefined,undefined,"asc");
this.i_reminder_list.addHeader(dlh1);
this.i_reminder_list.addHeader(dlh2);
this.i_reminder_list.addHeader(dlh3);
this.i_reminder_list.rangeSelect(0,1,true);
this.i_reminder_list.rangeSelect(1,this.dataModel().entries(),false);
this.i_reminder_list_box=document.createElement("div");
this.i_reminder_list_box.className="ReminderDisplay_listBox";
this.i_reminder_list_box.style.width=width+"px";
this.i_reminder_list_box.style.height="152px";
this.i_reminder_list_box.style.marginBottom=ReminderDisplay.generalMargin+"px";
this.i_reminder_list_box.style.border="1px solid #888";
this.i_reminder_list_box.style.backgroundColor="white";
this.i_reminder_list_box.style.position="relative";
this.i_reminder_list_box.appendChild(this.i_reminder_list.getGrid());
this.i_reminder.appendChild(this.i_reminder_list_box);
this.i_handlers.push(EventHandler.register(this.i_reminder_list,"oncontextmenu",this.handleDataListContextMenu,this));
this.i_handlers.push(EventHandler.register(this.i_reminder_list,"onclick",this.handleSelectionChange,this));
this.i_reminder_top_button_wrapper=document.createElement("div");
var bw=this.i_reminder_top_button_wrapper; 
bw.style.width=width+"px";
bw.style.marginBottom=(2*ReminderDisplay.generalMargin)+"px";
this.i_reminder_open_item_button=new UniversalButton("Open Item", undefined, undefined, undefined, undefined, 22);
this.i_reminder_dismiss_one_button=new UniversalButton("Dismiss", undefined, undefined, undefined, undefined, 22);
this.i_reminder_dismiss_all_button=new UniversalButton("Dismiss All", undefined, undefined, undefined, undefined, 22);
var b1=this.i_reminder_open_item_button.getButton();
var b2=this.i_reminder_dismiss_one_button.getButton();
var b3=this.i_reminder_dismiss_all_button.getButton();
bw.style.height=b1.style.height;
var whitespace=width - parseInt(b1.style.width) - parseInt(b2.style.width) - ReminderDisplay.generalMargin - parseInt(b3.style.width);
var blankDiv=document.createElement("div");
this.i_reminder_top_button_wrapper_spacer=blankDiv;
blankDiv.style.width=whitespace+"px";
blankDiv.innerHTML="&nbsp;";
b1.style[document.all ? "styleFloat" : "cssFloat"]="left";
b2.style[document.all ? "styleFloat" : "cssFloat"]="left";
b3.style[document.all ? "styleFloat" : "cssFloat"]="left";
blankDiv.style[document.all ? "styleFloat" : "cssFloat"]="left";
b2.style.marginRight=ReminderDisplay.generalMargin+"px";
bw.appendChild(b1);
bw.appendChild(blankDiv);
bw.appendChild(b2);
bw.appendChild(b3);
this.i_reminder.appendChild(bw);
this.i_handlers.push(EventHandler.register(this.i_reminder_open_item_button,"onclick",this.handleOpenItem,this));
this.i_handlers.push(EventHandler.register(this.i_reminder_dismiss_one_button,"onclick",this.handleDismiss,this));
this.i_handlers.push(EventHandler.register(this.i_reminder_dismiss_all_button,"onclick",this.handleDismissAll,this));
this.i_reminder_snooze_label=document.createElement("div");
this.i_reminder_snooze_label.style.width=width+"px";
this.i_reminder_snooze_label.style.height=ReminderDisplay.labelHeight+"px";
this.i_reminder_snooze_label.innerHTML="Click Snooze to be reminded again:";
this.i_reminder_snooze_label.style.marginBottom="0px";
this.i_reminder.appendChild(this.i_reminder_snooze_label);
this.i_reminder_bottom_wrapper=document.createElement("div");
this.i_reminder_bottom_wrapper.style.width=width+"px";
this.i_reminder_bottom_wrapper.style.height=this.getPopoutButton().getButton().style.height;
this.i_reminder_bottom_wrapper.style.marginBottom=ReminderDisplay.generalMargin+"px";
this.i_reminder_snooze_box=new OptionBox((whitespace+parseInt(b1.style.width) - ReminderDisplay.generalMargin - 2),1) 
for (var i=0; i < ReminderDisplay.intervals.length; i++) {
if (ReminderDisplay.intervals[i][1]=='5') {
this.i_reminder_snooze_box.addOption(new OptionBoxOption("in "+ReminderDisplay.intervals[i][0], ReminderDisplay.intervals[i][1], true));
}
else {
if (parseInt(ReminderDisplay.intervals[i][1]) > 0) {
this.i_reminder_snooze_box.addOption(new OptionBoxOption("in "+ReminderDisplay.intervals[i][0], ReminderDisplay.intervals[i][1]));
}
else {
this.i_reminder_snooze_box.addOption(new OptionBoxOption(ReminderDisplay.intervals[i][0], ReminderDisplay.intervals[i][1]));
}
}
}
this.i_reminder_snooze_one_button=new UniversalButton("Snooze", undefined, undefined, undefined, undefined, 22);
this.i_reminder_snooze_all_button=new UniversalButton("Snooze All", undefined, undefined, undefined, undefined, 22);
b1=this.i_reminder_snooze_box.getInput();
b2=this.i_reminder_snooze_one_button.getButton();
b3=this.i_reminder_snooze_all_button.getButton();
b1.style.marginRight=b2.style.marginRight=ReminderDisplay.generalMargin+"px";
b1.style[document.all ? "styleFloat" : "cssFloat"]="left";
b2.style[document.all ? "styleFloat" : "cssFloat"]="left";
b3.style[document.all ? "styleFloat" : "cssFloat"]="left";
this.i_reminder_bottom_wrapper.appendChild(b1);
this.i_reminder_bottom_wrapper.appendChild(b2);
this.i_reminder_bottom_wrapper.appendChild(b3);
this.i_handlers.push(EventHandler.register(this.i_reminder_snooze_one_button,"onclick",this.handleSnooze,this));
this.i_handlers.push(EventHandler.register(this.i_reminder_snooze_all_button,"onclick",this.handleSnoozeAll,this));
this.i_reminder.appendChild(this.i_reminder_bottom_wrapper);
this.refreshData();
this.handleSelectionChange();
}
return this.i_reminder;
}
ReminderDisplay.prototype.handleDataListContextMenu=function(o){
this.handleSelectionChange();
if(this.i_dataGridContextMenu==undefined){
var selfIvar=this;
var snoozeSubmenu=new ContextMenu(150);
this.i_dataGridContextMenu=new ContextMenu(100);
this.i_dataGridContextMenu.addItem(new ContextMenuItem("Open Item",true,function(o){
selfIvar.handleOpenItem(o);
},"a"));
this.i_dataGridContextMenu.addItem(new ContextMenuDivider());
var snoozeFunction=function(o){
selfIvar.handleSnooze(o);
}
for (var i=0; i < ReminderDisplay.intervals.length; i++) {
if (parseInt(ReminderDisplay.intervals[i][1]) > 0) {
snoozeSubmenu.addItem(new ContextMenuItem("for "+ReminderDisplay.intervals[i][0], true, snoozeFunction, ReminderDisplay.intervals[i][1]));
}
else{
snoozeSubmenu.addItem(new ContextMenuItem(ReminderDisplay.intervals[i][0], true, snoozeFunction, ReminderDisplay.intervals[i][1]));
}
}
var snoozeItem=new ContextMenuIconItem("Snooze","",0,true,function(){});
snoozeItem.child(snoozeSubmenu);
this.i_dataGridContextMenu.addItem(snoozeItem);
snoozeSubmenu.width(170);
this.i_dataGridContextMenu.addItem(new ContextMenuItem("Dismiss",true,function(){
selfIvar.handleDismiss(o);
},"c"));
}
this.i_dataGridContextMenu.i_event=o.event;
this.i_dataGridContextMenu.show();
o.preventDefault();
}
ReminderDisplay.prototype.wrapDescriptionText=function(text, width, height, klass) {  
var ret="";
if(text!=undefined) {
var width_wrapped_text=wrapLongWords(text, width, klass);
var dimensions=TextDimension(width_wrapped_text, klass, width);
if(dimensions.height > height) {
width_wrapped_text=width_wrapped_text.replace(/<span style='font-size:1px;color:#FFFFFF;'> <\/span>/g, " ");
var words=width_wrapped_text.split(" ");
for(var x=0; x < words.length;++x) {
if(x > 0) {
ret+=" ";
}
ret+=words[x];
dimensions=TextDimension(ret, klass, width);
if(dimensions.height > height) {
ret=ret.substr(0, ret.length - words[x].length - 1);
break;
}
}
ret+="...";
} else {
ret=width_wrapped_text;
}
}
return ret;
}
ReminderDisplay.prototype.handleSelectionChange=function(){
this.i_selectedReminders=this.i_reminder_list.getSelected();
if (this.i_selectedReminders.length==0) {
this.i_reminder_list.rangeSelect(0, 0, true);
this.i_selectedReminders=this.i_reminder_list.getSelected();
}
if(this.i_selectedReminders.length==0){
this.i_reminder_title.innerHTML=this.numberOfEntriesToString(this.i_rems!=undefined ? this.i_rems : this.dataModel().entries());
this.i_description_text="";
}else{
if(this.i_selectedReminders.length==1){
var title=this.i_selectedReminders[0].param("title");
if (title==undefined || title=="") title="Selected event";
this.i_reminder_title.innerHTML=title;
this.i_description_text=this.i_selectedReminders[0].param("description");
}else{
this.i_reminder_title.innerHTML=this.numberOfEntriesToString(this.i_selectedReminders.length)+" selected";
this.i_description_text="";
}	
}
this.toggleButtons();
}
ReminderDisplay.prototype.handleOpenItem=function(o){
this.dataModel().handleEventRefresh({collection: this.mainWindow().CalendarDataModel.getDefaultCalendar()}, true);
for(var x=0; x<this.i_selectedReminders.length; x++){
this.mainWindow().Application.getApplicationById(1004).popEvent(this.i_selectedReminders[x].eventObject(),this.i_selectedReminders[x].eventObject().parentDataModel(),undefined,false,true);
}
}
ReminderDisplay.prototype.numberOfEntriesToString=function(numEntries){
return ""+numEntries+" reminder"+(numEntries==1 ? "" : "s");
}
ReminderDisplay.prototype.toggleButtons=function() {
var any=(this.i_reminder_list.entries() > 0);
var selected=(this.i_reminder_list.getSelected().length > 0);
this.i_reminder_open_item_button.enabled(selected);
this.i_reminder_dismiss_one_button.enabled(selected);
this.i_reminder_dismiss_all_button.enabled(any);
this.i_reminder_snooze_one_button.enabled(selected);
this.i_reminder_snooze_all_button.enabled(any);
}
JavaScriptResource.notifyComplete("./src/Applications/Calendar/components/Component.ReminderDisplay.js");
JavaScriptResource.notifyComplete("./btAppCalendarCore.js");
