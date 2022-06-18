function MyDayGeneralPane() {
this.superFormPreferencePane("Notifications", "My Day notifications help keep you up-to-date on your account activity (meeting invitations, updated meeting details, shared files, etc.)");
this.i_sections={};
this.i_inputs={};
this.i_rows={};
EventHandler.register(this, "onload", this.handleLoad, this);
}
MyDayGeneralPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 200);
this.i_sections.general=this.i_form.addSection(new UniversalFormSection("Notifications Display Settings"));
this.i_inputs.auto_delete_notifications=new UniversalOptionBoxInput("Automatically delete notifications that are", "", [new UniversalOptionBoxOption("More than a day old", 1),
new UniversalOptionBoxOption("More than a week old", 7),
new UniversalOptionBoxOption("More than a month old", 30),
new UniversalOptionBoxOption("Never, I will clear them manually", 36500)]);			
this.i_sections.general.addRow(new UniversalFormRow(this.i_inputs.auto_delete_notifications));
this.i_inputs.max_notification_display=new UniversalOptionBoxInput("Number of notifications to display", "", [new UniversalOptionBoxOption("Display all notifications", -1),
new UniversalOptionBoxOption("5", 5),
new UniversalOptionBoxOption("10", 10),
new UniversalOptionBoxOption("15", 15),
new UniversalOptionBoxOption("25", 25),
new UniversalOptionBoxOption("50", 50),
new UniversalOptionBoxOption("100", 100)]);
this.i_sections.general.addRow(new UniversalFormRow(this.i_inputs.max_notification_display));
this.i_sections.special_event=this.i_form.addSection(new UniversalFormSection("Special Event Notifications", ""));
this.i_inputs.display_range_special=new UniversalOptionBoxInput("Only display birthday, anniversary and holiday notifications", "", [new UniversalOptionBoxOption("A day after the event", 1),
new UniversalOptionBoxOption("A week after the event", 7),
new UniversalOptionBoxOption("Two weeks after the event", 14),
new UniversalOptionBoxOption("A month after the event", 30)]);
this.i_sections.special_event.addRow(new UniversalFormRow(this.i_inputs.display_range_special));	
this.i_form.clearModified();
}
return this.i_form;
}
MyDayGeneralPane.prototype.handleLoad=function(e) {
this.myDay=Application.getApplicationById(1020);
this.i_auto_delete_notifications=this.myDay.param("auto_delete_notifications");
this.i_max_notification_display=this.myDay.param("max_notification_display");
this.i_display_range_special=this.myDay.param("display_range_special");
if (this.i_auto_delete_notifications==undefined) {
this.i_auto_delete_notifications=this.myDay.default_auto_delete_notifications;
}
if (this.i_max_notification_display==undefined) {
this.i_max_notification_display=this.myDay.default_max_notification_display;
}
if (this.i_display_range_special==undefined) {
this.i_display_range_special=this.myDay.default_display_range_special;
}
this.i_inputs.auto_delete_notifications.value(this.i_auto_delete_notifications);
this.i_inputs.max_notification_display.value(this.i_max_notification_display);
this.i_inputs.display_range_special.value(this.i_display_range_special);
this.updateDefault();
this.loaded(true); 
this.getForm();
}
MyDayGeneralPane.prototype.save=function() {
this.myDay.param("auto_delete_notifications", parseInt(this.i_inputs.auto_delete_notifications.value()), true);
this.myDay.param("max_notification_display", this.i_inputs.max_notification_display.value(), true); 
this.myDay.param("display_range_special", parseInt(this.i_inputs.display_range_special.value()), true);
this.updateDefault();
if (this.myDay.onpreferencesupdate!=undefined) {
var o=new Object();
o.type="preferencesupdate";
o.auto_delete_notifications=this.myDay.param("auto_delete_notifications");
o.max_notification_display=this.myDay.param("max_notification_display");
o.display_range_special=this.myDay.param("display_range_special");
this.myDay.onpreferencesupdate(o);
}
}
MyDayGeneralPane.inherit(FormPreferencePane);
Application.getApplicationById(1020).registerPreferencePane(new MyDayGeneralPane());
JavaScriptResource.notifyComplete("./src/Applications/MyDay/Preference.MyDay.js");
JavaScriptResource.notifyComplete("./btAppMyDayPreferences.js");
