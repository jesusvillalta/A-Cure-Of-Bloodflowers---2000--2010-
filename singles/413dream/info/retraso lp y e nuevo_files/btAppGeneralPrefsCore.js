function ApplicationGeneralPrefs() {
this.superApplication();
this.id("GP");	
this.name("General");
this.smallIcon("GeneralPrefs_small");	
this.loadingOrder(1);
this.registerPreference("./btAppGeneralPrefsPreferences.js");
EventHandler.register(this, "oninitialize", this.handleInitialize, this);
}
ApplicationGeneralPrefs.prototype.handleInitialize=function(e) {
var layout_enabled=this.param("layout_autosave");
if (layout_enabled==undefined) {
layout_enabled=2;
}
SystemCore.layoutManager().autoSave(layout_enabled);
var last_layout=this.param("layout_default");
var confs=SystemCore.layoutManager().configurations();
for (var x=0; x < confs.length; x++){ 
if (confs[x].name()==last_layout) {
SystemCore.layoutManager().activeConfiguration(confs[x]);
}
}
var popWindows=Array({name: "TaskDisplay", value: "0"},
{name: "EventDisplay", value: "0"},
{name: "ReminderDisplay", value: "1"});
var popout;
var popClassName;
for (var p=0;p < popWindows.length;++p) {
if (typeof(popWindows[p]["name"])=="string" && typeof(popWindows[p]["value"])=="string") {
popClassName="popout_"+popWindows[p]["name"];
popout=this.param(popClassName);
if(popout==undefined) {
this.param(popClassName, popWindows[p]["value"]);
}
}
}
}
ApplicationGeneralPrefs.inherit(Application);
SystemCore.registerApplication(new ApplicationGeneralPrefs());
JavaScriptResource.notifyComplete("./src/Applications/GeneralPrefs/Application.GeneralPrefs.js");
JavaScriptResource.notifyComplete("./btAppGeneralPrefsCore.js");
