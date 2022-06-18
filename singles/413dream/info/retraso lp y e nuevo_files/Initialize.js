function initPage() {
APIManager.username(user_prefs['user_name']);
APIManager.sessionId(user_prefs['session_id']);
CursorMonitor.hook();
HotKey.hook();
APIManager.lock(true);
APIManager.urlHash="1w648fk3";
var registry_loaded=false;
try {
if (REGISTRY_DATA!=undefined) {
ApplicationRegistry.sensitivityKey(REGISTRY_INDEX);
ApplicationRegistry.loadRegistry(REGISTRY_DATA);
registry_loaded=true;
}
} catch (e) { }
if (!registry_loaded) {
timedOut=true;
alert('Registry Error: Unable to obtain registry information from the server.  This is a fatal error, you will be logged out automatically.');
return false;
}
var hashIndex=app_title.search(APIManager.urlHash);
if (hashIndex > 0) {
var urlIndex=hashIndex+8;
SystemCore.companyURL(app_title.substring(urlIndex,app_title.length));
app_title=app_title.substring(0,hashIndex);
}
SystemCore.title(app_title);
SystemCore.documentTitle(app_title);
SystemCore.logo(logo_loc);
SystemCore.shortcutPane();
SystemCore.widgetManager(new WidgetManager());
var confs=DataNode.fromString(GDSConfiguration.layouts);
var def_layouts=confs.children("configuration");
var layout_objs=Array();
for (var x=0; x < def_layouts.length; x++) { 
var c=LayoutConfiguration.fromDataNode(def_layouts[x]);
layout_objs[c.name()]=c;
}
var dn=DataNode.fromString(GDSConfiguration.layoutList);
var conf_names=dn.children("configuration");
for (var x=0; x < conf_names.length; x++) {
var c;
if (layout_objs[conf_names[x].attribute("name")]!=undefined) {
c=layout_objs[conf_names[x].attribute("name")];
}
else {
c=new LayoutConfiguration(conf_names[x].attribute("name"));
c.initialized(false);
}
SystemCore.layoutManager().addConfiguration(c);
}
if ((SystemCore.layoutManager().configurations().length==1) &&
(SystemCore.layoutManager().configurations(0).isDefault())) {
var myLayout=LayoutConfiguration.fromDataNode(SystemCore.layoutManager().configurations(0).toDataNode());
myLayout.name('My Layout');
myLayout.locked(false);
myLayout.isDefault(false);
myLayout.saveToServer();
SystemCore.layoutManager().addConfiguration(myLayout);
SystemCore.layoutManager().activeConfiguration(myLayout);
SystemCore.layoutManager().autoSave(2);
var gen_prefs=Application.getApplicationById('GP');
if (gen_prefs!=undefined)
gen_prefs.param("layout_autosave", 2);
}
document.getElementById('ApplicationHeader').appendChild(SystemCore.navigationBar().getBar());
SystemCore.windowManager(new WindowManager(100, 100));
document.getElementById('ApplicationWorkspace').appendChild(SystemCore.windowManager().getManager());
EventHandler.register(window, "onresize", fixSize);
EventHandler.register(SystemCore.navigationBar(), "onresize", fixSize);
fixSize();
SystemCore.initialize();
APIManager.lock(false);
ExtensionBannerAds.initialize();
ExtensionBannerAds.reconfigureSidebar();
ExtensionBannerAds.embedSimpleClick();
fixSize();
}
function fixSize() {
var windowWidth=CursorMonitor.browserWidth() - 9;
var windowHeight=(CursorMonitor.browserHeight() - 9) - SystemCore.navigationBar().height();
var extraWidthPadding=ExtensionBannerAds.getWindowManagerWidthPadding();
var extraHeightPadding=ExtensionBannerAds.getWindowManagerHeightPadding();
SystemCore.windowManager().getManager().parentNode.parentNode.style.width=CursorMonitor.browserWidth() - (document.all ? 4 : 0) - extraWidthPadding;
SystemCore.windowManager().width(windowWidth - (document.all ? 4 : 0) - extraWidthPadding);
SystemCore.windowManager().height(windowHeight - 4 - extraHeightPadding);
ExtensionBannerAds.adjustSizes();
SystemCore.windowManager().update();
SystemCore.navigationBar().width(CursorMonitor.browserWidth() - (document.all ? 4 : 0) - extraWidthPadding);
SystemCore.navigationBar().getBar().parentNode.style.width=CursorMonitor.browserWidth() - (document.all ? 4 : 0) - extraWidthPadding;
}
initPage();
initApp();
JavaScriptResource.notifyComplete("./src/Initialize.js");	
ResourceManager.noticeTimeout(false);
