function CalendarGeneralPane() {
this.superFormPreferencePane("General Settings", "Set up your default calendar view and meeting notifications/reminders.");
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
CalendarGeneralPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 175);
var section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.name=new UniversalTextInput("Calendar name", "");
section.addRow(new UniversalFormRow(this.i_inputs.name));
this.i_inputs.view=new UniversalOptionBoxInput("Default view", "", [new UniversalOptionBoxOption("Monthly", "2"),
new UniversalOptionBoxOption("Weekly", "3"),
new UniversalOptionBoxOption("Daily", "4")]);
section.addRow(new UniversalFormRow(this.i_inputs.view));
section=this.i_form.addSection(new UniversalFormSection("Reminders"));
this.i_inputs.reminder_interval=new UniversalOptionBoxInput("Default reminder interval", "", [new UniversalOptionBoxOption("No reminder", "-1"),
new UniversalOptionBoxOption("0 minutes prior to event", "0"),
new UniversalOptionBoxOption("5 minutes prior to event", "5"),
new UniversalOptionBoxOption("10 minutes prior to event", "10"),
new UniversalOptionBoxOption("15 minutes prior to event", "15"),
new UniversalOptionBoxOption("30 minutes prior to event", "30"),
new UniversalOptionBoxOption("1 hour prior to event", "60"),
new UniversalOptionBoxOption("2 hours prior to event", "120"),
new UniversalOptionBoxOption("4 hours prior to event", "240"),
new UniversalOptionBoxOption("8 hours prior to event", "480"),
new UniversalOptionBoxOption("12 hours prior to event", "720"),
new UniversalOptionBoxOption("1 day prior to event", "1440"),
new UniversalOptionBoxOption("2 days prior to event", "2880")]);
section.addRow(new UniversalFormRow(this.i_inputs.reminder_interval));
this.i_inputs.reminder_email=new UniversalCheckBoxOption("Email", "Email");
this.i_inputs.reminder_popup=new UniversalCheckBoxOption("Popup", "Popup");
var reminder_method=new UniversalCheckBoxInput("By", "", "100%", [this.i_inputs.reminder_email,
this.i_inputs.reminder_popup]);
section.addRow(new UniversalFormRow(reminder_method));
section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.work_week={
"monday": new UniversalCheckBoxOption("Monday", "Monday"),
"tuesday": new UniversalCheckBoxOption("Tuesday", "Tuesday"),
"wednesday": new UniversalCheckBoxOption("Wednesday", "Wednesday"),
"thursday": new UniversalCheckBoxOption("Thursday", "Thursday"),
"friday": new UniversalCheckBoxOption("Friday", "Friday"),
"saturday": new UniversalCheckBoxOption("Saturday", "Saturday"),
"sunday": new UniversalCheckBoxOption("Sunday", "Sunday")
};
var work_week=new UniversalCheckBoxInput("Work week", "", "100%", [this.i_inputs.work_week.sunday,
this.i_inputs.work_week.monday,
this.i_inputs.work_week.tuesday,
this.i_inputs.work_week.wednesday,
this.i_inputs.work_week.thursday,
this.i_inputs.work_week.friday,
this.i_inputs.work_week.saturday]);
work_week.columns(2);
section.addRow(new UniversalFormRow(work_week));
section=this.i_form.addSection(new UniversalFormSection("Work Day"));
var work_day_start_options=[];
var work_day_end_options=[];
for(var i=0; i < 24; i++) {
var hour=new Date("0", "0", "0", i);
work_day_start_options.push(new UniversalOptionBoxOption(hour.toLocaleTimeString(), i));
work_day_end_options.push(new UniversalOptionBoxOption(hour.toLocaleTimeString(), i));
}
this.i_inputs.work_day_start=new UniversalOptionBoxInput("Start hour", "", work_day_start_options);
section.addRow(new UniversalFormRow(this.i_inputs.work_day_start));
this.i_inputs.work_day_end=new UniversalOptionBoxInput("End hour", "", work_day_end_options);
section.addRow(new UniversalFormRow(this.i_inputs.work_day_end));
section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.week_start=new UniversalOptionBoxInput("First day of the week", "", [new UniversalOptionBoxOption("Sunday", "1"),
new UniversalOptionBoxOption("Monday", "2"),
new UniversalOptionBoxOption("Tuesday", "3"),
new UniversalOptionBoxOption("Wednesday", "4"),
new UniversalOptionBoxOption("Thursday", "5"),
new UniversalOptionBoxOption("Friday", "6"),
new UniversalOptionBoxOption("Saturday", "7")]);
section.addRow(new UniversalFormRow(this.i_inputs.week_start));
this.i_inputs.time_increment=new UniversalOptionBoxInput("Time block increments", "", [new UniversalOptionBoxOption("60 minutes", "1"),
new UniversalOptionBoxOption("30 minutes", "2"),
new UniversalOptionBoxOption("20 minutes", "3"),
new UniversalOptionBoxOption("15 minutes", "4"),
new UniversalOptionBoxOption("10 minutes", "6"),
new UniversalOptionBoxOption("5 minutes", "12")]);
section.addRow(new UniversalFormRow(this.i_inputs.time_increment));
this.i_inputs.free_busy=new UniversalOptionBoxInput("Free/busy access", "", [new UniversalOptionBoxOption("Enabled", "1"),
new UniversalOptionBoxOption("Disabled", "0")]);
section.addRow(new UniversalFormRow(this.i_inputs.free_busy));
this.i_form.clearModified();
this.i_inputs.name.required(true, "You must enter a calendar name.");
}
return this.i_form;
}
CalendarGeneralPane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
params.addNode(new DataNode("method", "list"));
params.addNode(new DataNode("aId", ""));
params.addNode(new DataNode("userId", user_prefs["user_id"]));
var request=new RequestObject("Calendar", "list", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
request.execute();
}
CalendarGeneralPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var default_calendar=CalendarDataModel.getDefaultCalendar();
this.i_calendar_id=data.xPath("calendar/calendarId", true);
this.i_inputs.name.value(data.xPath("calendar/name", true));
this.i_inputs.view.value(data.xPath("calendar/defaultView", true));
this.i_inputs.reminder_interval.value(data.xPath("calendar/defaultReminderInterval", true));
this.setReminderMethod(data.xPath("calendar/defaultReminderType", true));
this.setWorkWeek(data.xPath("calendar/workdays", true));
this.i_inputs.work_day_start.value(data.xPath("calendar/workdayStartTime", true).substring(9, 11));
this.i_inputs.work_day_end.value(data.xPath("calendar/workdayEndTime", true).substring(9, 11));
this.i_inputs.week_start.value(data.xPath("calendar/weekStartDay", true));
this.i_inputs.time_increment.value(default_calendar.timeInterval());
this.i_inputs.free_busy.value(data.xPath("calendar/freeBusyAccess", true));
this.updateDefault();
this.loaded(true);
}
CalendarGeneralPane.prototype.save=function() {
var calendar=new DataNode("calendar");
calendar.addNode(new DataNode("calendarId", this.i_calendar_id));
calendar.addNode(new DataNode("ownerId", user_prefs.user_id));
calendar.addNode(new DataNode("default", 1));
calendar.addNode(new DataNode("name", this.i_inputs.name.value()));
calendar.addNode(new DataNode("defaultView", this.i_inputs.view.value()));
calendar.addNode(new DataNode("defaultReminderInterval", this.i_inputs.reminder_interval.value()));
calendar.addNode(new DataNode("defaultReminderType", this.getReminderMethod()));
calendar.addNode(new DataNode("workdays", this.getWorkWeek()));
calendar.addNode(new DataNode("workdayStartTime", this.timestamp(this.i_inputs.work_day_start.value())));
calendar.addNode(new DataNode("workdayEndTime", this.timestamp(this.i_inputs.work_day_end.value())));
calendar.addNode(new DataNode("weekStartDay", this.i_inputs.week_start.value()));
calendar.addNode(new DataNode("timeGridUnit", this.i_inputs.time_increment.value()));
calendar.addNode(new DataNode("freeBusyAccess", this.i_inputs.free_busy.value()));
var params=new DataNode("params");
params.addNode(new DataNode("method", "update"));
params.addNode(new DataNode("aId", user_prefs.user_id));
params.addNode(calendar);
var request=new RequestObject("Calendar", "update", params);
EventHandler.register(request, "oncomplete", this.handleSave, this);
return request;
}
CalendarGeneralPane.prototype.handleSave=function() {
var default_calendar=CalendarDataModel.getDefaultCalendar();
if(default_calendar!=undefined && default_calendar.id()==this.i_calendar_id) {
default_calendar.ignoreConfigChange(true);
default_calendar.defaultReminderType(this.getReminderMethod());
default_calendar.defaultReminderInterval(this.i_inputs.reminder_interval.value());
default_calendar.defaultCalendarView(this.i_inputs.view.value());
default_calendar.startTime(iCaltoDate(this.timestamp(this.i_inputs.work_day_start.value())));
default_calendar.endTime(iCaltoDate(this.timestamp(this.i_inputs.work_day_end.value())));
default_calendar.weekStartDay(this.i_inputs.week_start.value());
default_calendar.timeInterval(this.i_inputs.time_increment.value());
default_calendar.ignoreConfigChange(false);
}
this.loaded(false);
}
CalendarGeneralPane.prototype.getReminderMethod=function() {
var value=0;
value |=(this.i_inputs.reminder_email.checked()) ? 2 : 0;
value |=(this.i_inputs.reminder_popup.checked()) ? 4 : 0;
return value;
}
CalendarGeneralPane.prototype.setReminderMethod=function(value) {
this.i_inputs.reminder_popup.checked(false);
this.i_inputs.reminder_email.checked(false);
if ((value & 1)==1) {
this.i_inputs.reminder_popup.checked(true);
}
if ((value & 2)==2) {
this.i_inputs.reminder_email.checked(true);
}
if ((value & 4)==4) {
this.i_inputs.reminder_popup.checked(true);
}
}
CalendarGeneralPane.prototype.getWorkWeek=function() {
var days=this.i_inputs.work_week;
var work_week_str="";
work_week_str+=(days.monday.checked()) ? "1" : "0";
work_week_str+=(days.tuesday.checked()) ? "1" : "0";
work_week_str+=(days.wednesday.checked()) ? "1" : "0";
work_week_str+=(days.thursday.checked()) ? "1" : "0";
work_week_str+=(days.friday.checked()) ? "1" : "0";
work_week_str+=(days.saturday.checked()) ? "1" : "0";
work_week_str+=(days.sunday.checked()) ? "1" : "0";
return work_week_str;
}
CalendarGeneralPane.prototype.setWorkWeek=function(work_week_str) {
var days=this.i_inputs.work_week;
work_week_bool=work_week_str.split(/.{0}/);
for(var i=0; i < work_week_bool.length; i++) {
work_week_bool[i]=(work_week_bool[i]=="1") ? true : false;
}
days.monday.checked(work_week_bool[0]);
days.tuesday.checked(work_week_bool[1]);
days.wednesday.checked(work_week_bool[2]);
days.thursday.checked(work_week_bool[3]);
days.friday.checked(work_week_bool[4]);
days.saturday.checked(work_week_bool[5]);
days.sunday.checked(work_week_bool[6]);
}
CalendarGeneralPane.prototype.timestamp=function(hour) {
hour=parseInt(hour, 10);
timestamp="00000000T";
if(hour < 10) {
timestamp+="0";
}
timestamp+=hour;
timestamp+="0000Z";
return timestamp;
}
CalendarGeneralPane.inherit(FormPreferencePane);
Application.getApplicationById(1004).registerPreferencePane(new CalendarGeneralPane());
function CalendarSharingPane() {
this.superFormPreferencePane("Calendar Sharing", "Share your calendar and customize access permission levels.");
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
EventHandler.register(this, "onshow", this.handleShow, this);
EventHandler.register(this, "onhide", this.handleHide, this);
}
CalendarSharingPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 175);
var section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.free_busy=new UniversalAddRemoveListInput("Free/busy access (time blocks only)", "", []);
EventHandler.register(this.i_inputs.free_busy, "onfocus", this.handleFocus, this);
EventHandler.register(this.i_inputs.free_busy, "onadd", this.handleAdd, this);
section.addRow(new UniversalFormRow(this.i_inputs.free_busy));
this.i_inputs.read=new UniversalAddRemoveListInput("Read-only access (time blocks and details)", "", []);
EventHandler.register(this.i_inputs.read, "onfocus", this.handleFocus, this);
EventHandler.register(this.i_inputs.read, "onadd", this.handleAdd, this);
section.addRow(new UniversalFormRow(this.i_inputs.read));
this.i_inputs.full=new UniversalAddRemoveListInput("Full access (administrative rights)", "", []);
EventHandler.register(this.i_inputs.full, "onfocus", this.handleFocus, this);
EventHandler.register(this.i_inputs.full, "onadd", this.handleAddAdmin, this);
section.addRow(new UniversalFormRow(this.i_inputs.full));
this.i_form.clearModified();
}
return this.i_form;
}
CalendarSharingPane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
params.addNode(new DataNode("method", "list"));
params.addNode(new DataNode("aId", ""));
params.addNode(new DataNode("userId", user_prefs["user_id"]));
var request=new RequestObject("Calendar", "list", params);
EventHandler.register(request, "oncomplete", this.handleLoadGeneralPreferences, this);
request.execute();
}
CalendarSharingPane.prototype.handleLoadGeneralPreferences=function(e) {
var data=e.response.data();
this.i_calendar_id=data.xPath("calendar/calendarId", true);
var params=new DataNode("params");
params.addNode(new DataNode("method", "listShares"));
params.addNode(new DataNode("aId", user_prefs.user_id));
params.addNode(new DataNode("shareType", ""));
params.addNode(new DataNode("calendarId", this.i_calendar_id));
var request=new RequestObject("Calendar", "listshares", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
request.execute();
}
CalendarSharingPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var shares=data.xPath("shareList/calendarShare");
for(var i=0; i < shares.length; i++) {
var share={
"user_id": shares[i].xPath("userId", true),
"group_id": shares[i].xPath("groupId", true),
"name": shares[i].xPath("displayName", true),
"is_member": (shares[i].xPath("isMember", true)=="1")   
};
share.is_user=(share.user_id) ? true : false;
share.is_group=!share.is_user;
switch(shares[i].xPath("privilege", true).toLowerCase()) {
case "read":
this.i_inputs.free_busy.addOption(this.getShareOption(share));
break;
case "fullread":
this.i_inputs.read.addOption(this.getShareOption(share));
break;
case "all":
this.i_inputs.full.addOption(this.getShareOption(share));
break;
}
}
this.updateDefault();
this.loaded(true);
}
CalendarSharingPane.prototype.handleShow=function(e) {
this.i_simple_click_listener=ApplicationOldContacts.getSimpleClick().requestOnBoth(this.handleSimpleClick, this);
}
CalendarSharingPane.prototype.handleHide=function(e) {
ApplicationOldContacts.getSimpleClick().cancelRequest(this.i_simple_click_listener);
}
CalendarSharingPane.prototype.save=function() {
var shares=[];
shares=shares.concat(this.shareList(this.i_inputs.free_busy.optionValues(), "Read"));
shares=shares.concat(this.shareList(this.i_inputs.read.optionValues(), "FullRead"));
shares=shares.concat(this.shareList(this.i_inputs.full.optionValues(), "All"));
var params=new DataNode("params");
params.addNode(new DataNode("method", "setAllShares"));
params.addNode(new DataNode("aId", user_prefs.user_id));
params.addNode(new DataNode("calendarId", this.i_calendar_id));
params.addNode(new DataNode("shareIn", shares.join(",")));
var request=new RequestObject("Calendar", "setallshares", params);
return request;
}
CalendarSharingPane.prototype.shareList=function(values, privilege) {
var shares=[];
for(var i=0; i < values.length; i++) {
var share=values[i];
var type=(share.is_user) ? "card" : "group";
var id=(share.user_id) ? share.user_id : share.group_id;
shares.push(":"+type+":"+share.name+":"+id+":"+privilege);
}
return shares;
}
CalendarSharingPane.prototype.getShareOption=function(share) {
var display_name;
if(share.is_group) {
display_name="Group "+share.name;
} else {
var strUser=share.name;
if (strUser.substr(strUser.indexOf('@')+1)==user_prefs['domain_suffix']) {
share.name=strUser.substr(0,strUser.indexOf('@'));
share.is_member=true;
}
display_name=share.is_member ? "Member " : "Non-Member ";
display_name+=share.name;
}
return new UniversalOptionBoxOption(display_name, share);
}
CalendarSharingPane.prototype.handleAdd=function(e) {
var share={
"name": e.value,
"is_user": true
};
if(this.isEmailAddress(e.value)) {
share.is_member=false;
} else if (this.isUsername(e.value)) {
share.is_member=true;
} else {
DialogManager.alert("The value '"+e.value+"' does not appear"+" to be a user name or an email address.  Please enter a"+" valid user name or a valid email address.",
"No such user '"+e.value+"'", undefined, true, true);
e.cancelAdd=true;
return false;
}
e.option=this.getShareOption(share);
}
CalendarSharingPane.prototype.handleAddAdmin=function(e) {
if(this.isEmailAddress(e.value)) {
DialogManager.alert("Non-members may not be given administrative access.", "", undefined, true, true);
e.add.value="";
e.cancelAdd=true;
return false;
}
return this.handleAdd(e);
}
CalendarSharingPane.prototype.handleFocus=function(e) {
this.i_current_focus=e.input;
}
CalendarSharingPane.prototype.handleSimpleClick=function(type, group, user) {
var share={};
if(user && user.username) {
share.is_member=true;
share.is_user=true;
share.name=user.username;
} else if(group && group.name) {
share.is_member=true;
share.is_group=true;
share.name=group.name;
share.group_id=group.uuid;
} else if(this.isEmailAddress(user.email)) {
share.is_member=false;
share.is_user=true;
share.name=user.email;
} else {
DialogManager.alert("User "+user.name+" does not appear"+" to have an account, and this shares email address"+" is not available.", "Unable to find account for "+user.name, undefined, true, true);
return;
}
var input=this.i_current_focus || this.i_inputs.free_busy;
if(input==this.i_inputs.full) {
if(!share.is_member) {
DialogManager.alert("Non-members may not be given administrative access.", "", undefined, true, true);
return;
}
}
input.addOption(this.getShareOption(share));
}
CalendarSharingPane.prototype.isUsername=function(value) {
var splitUsername=value.split('.');
if (splitUsername.length!=2) {
return false;
}
user=splitUsername[0];
enterprise=splitUsername[1];
if (!user.match(/^[A-Za-z0-9_-]{2,43}$/)) {
return false;
}
if (!enterprise.match(/^[A-Za-z0-9_-]{3,20}$/)) {
return false;
}
return true;
}
CalendarSharingPane.prototype.isEmailAddress=function(value) {
if (value.length <=320) {
if (value.match(/^[A-Za-z0-9.+_%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)){
return true;
}
}
return false;
}
CalendarSharingPane.inherit(FormPreferencePane);
Application.getApplicationById(1004).registerPreferencePane(new CalendarSharingPane());
function CalendarHolidayPane() {
this.superFormPreferencePane("Holidays", "Customize the holidays you would like to display in your calendar.");
this.i_inputs={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
CalendarHolidayPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 0);
var section=this.i_form.addSection(new UniversalFormSection("Holidays by country"));
this.i_inputs.countries=new UniversalCheckBoxInput("", "", "100%", [new UniversalCheckBoxOption("Argentina", "2"),
new UniversalCheckBoxOption("Australia", "3"),
new UniversalCheckBoxOption("Austria", "4"),
new UniversalCheckBoxOption("Belgium", "6"),
new UniversalCheckBoxOption("Brazil", "8"),
new UniversalCheckBoxOption("Canada", "9"),
new UniversalCheckBoxOption("Chile", "10"),
new UniversalCheckBoxOption("China", "1"),
new UniversalCheckBoxOption("Columbia", "12"),
new UniversalCheckBoxOption("Czech Republic", "15"),
new UniversalCheckBoxOption("Denmark", "16"),
new UniversalCheckBoxOption("Ecuador", "17"),
new UniversalCheckBoxOption("Egypt", "18"),
new UniversalCheckBoxOption("Finland", "19"),
new UniversalCheckBoxOption("France", "20"),
new UniversalCheckBoxOption("Germany", "21"),
new UniversalCheckBoxOption("Greece", "22"),
new UniversalCheckBoxOption("Hong Kong", "23"),
new UniversalCheckBoxOption("Hungary", "24"),
new UniversalCheckBoxOption("Indonesia", "25"),
new UniversalCheckBoxOption("Ireland", "27"),
new UniversalCheckBoxOption("Israel", "29"),
new UniversalCheckBoxOption("Italy", "30"),
new UniversalCheckBoxOption("Japan", "31"),
new UniversalCheckBoxOption("Jordan", "33"),
new UniversalCheckBoxOption("Korea", "34"),
new UniversalCheckBoxOption("Luxembourg", "38"),
new UniversalCheckBoxOption("Malaysia", "39"),
new UniversalCheckBoxOption("Mexico", "40"),
new UniversalCheckBoxOption("Netherlands", "42"),
new UniversalCheckBoxOption("New Zealand", "43"),
new UniversalCheckBoxOption("Norway", "44"),
new UniversalCheckBoxOption("Peru", "47"),
new UniversalCheckBoxOption("Philippines", "48"),
new UniversalCheckBoxOption("Poland", "49"),
new UniversalCheckBoxOption("Portugal", "50"),
new UniversalCheckBoxOption("Russia", "54"),
new UniversalCheckBoxOption("Saudi Arabia", "55"),
new UniversalCheckBoxOption("Singapore", "56"),
new UniversalCheckBoxOption("Slovak Republic", "57"),
new UniversalCheckBoxOption("Slovenia", "58"),
new UniversalCheckBoxOption("South Africa", "59"),
new UniversalCheckBoxOption("Spain", "60"),
new UniversalCheckBoxOption("Sweden", "61"),
new UniversalCheckBoxOption("Switzerland", "62"),
new UniversalCheckBoxOption("Taiwan", "5"),
new UniversalCheckBoxOption("Thailand", "64"),
new UniversalCheckBoxOption("Turkey", "66"),
new UniversalCheckBoxOption("United Arab Emirates", "67"),
new UniversalCheckBoxOption("United Kingdom", "68"),
new UniversalCheckBoxOption("United States", "69"),
new UniversalCheckBoxOption("Uruguay", "70"),
new UniversalCheckBoxOption("Venezuela", "71")]);
this.i_inputs.countries.columns(3);
section.addRow(new UniversalFormRow(this.i_inputs.countries));
section=this.i_form.addSection(new UniversalFormSection("Holidays by religion"));
this.i_inputs.religions=new UniversalCheckBoxInput("", "", "100%", [new UniversalCheckBoxOption("Christian holidays", "11"),
new UniversalCheckBoxOption("Islamic holidays", "28"),
new UniversalCheckBoxOption("Jewish holidays", "32")]);
this.i_inputs.religions.columns(3);
section.addRow(new UniversalFormRow(this.i_inputs.religions));
this.i_form.clearModified();
}
return this.i_form;
}
CalendarHolidayPane.prototype.handleLoad=function(e) {
var params=new DataNode("params");
params.addNode(new DataNode("method", "getHolidays"));
params.addNode(new DataNode("userId", user_prefs["user_id"]));
var request=new RequestObject("Calendar", "getholidays", params);
EventHandler.register(request, "oncomplete", this.handleLoadPreferences, this);
request.execute();
}
CalendarHolidayPane.prototype.handleLoadPreferences=function(e) {
var data=e.response.data();
var holidays_data=data.xPath("holidays", true);
var holidays=(holidays_data) ? holidays_data.split(",") : [];
this.i_inputs.countries.value(holidays);
this.i_inputs.religions.value(holidays);
this.updateDefault();
this.loaded(true);
}
CalendarHolidayPane.prototype.save=function() {
var holidays=this.i_inputs.countries.value().concat(this.i_inputs.religions.value());
var params=new DataNode("params");
params.addNode(new DataNode("method", "setHolidays"));
params.addNode(new DataNode("userId", user_prefs.user_id));
params.addNode(new DataNode("holidays", holidays.join(",")));
var request=new RequestObject("Calendar", "setholidays", params);
EventHandler.register(request, "oncomplete", this.handleSave, this);
return request;
}
CalendarHolidayPane.prototype.handleSave=function(e) {
var calendar=Application.getApplicationById(1004);
var view=calendar.getCalendarView().getCalendarView();
var default_calendar=CalendarDataModel.getDefaultCalendar();
default_calendar.expireAllMonths();
view.focusDate(view.focusDate(), true);
}
CalendarHolidayPane.inherit(FormPreferencePane);
Application.getApplicationById(1004).registerPreferencePane(new CalendarHolidayPane());
JavaScriptResource.notifyComplete("./src/Applications/Calendar/Preference.Calendar.js");
JavaScriptResource.notifyComplete("./btAppCalendarPreferences.js");
