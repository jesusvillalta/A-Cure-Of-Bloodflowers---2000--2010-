function Wizard(){}
Wizard.checkLaunchWizard=function() {
if(WizardConfig) {
if(WizardConfig.launch==true) {
Wizard.Window=new WindowObject('wizard', '', 765, 532, new TitleBarFactory(200, 16));
Wizard.Window.popWindow(766, 532, true, false);
Wizard.Window.modal(true);
ResourceManager.request("/wizard/js/btWizAll.js", 400, Wizard.loadDone);
ResourceManager.request("/wizard/wizard.css", 400);
}
}
}
Wizard.loadDone=function() {
ResourceManager.request("/gds/wizard.html", 400, Wizard.contentDone);
}
Wizard.contentDone=function(data) {
var c=document.createElement('div');
c.innerHTML=data;
Wizard.Window.loadContent(c);
init_wiz();
}
JavaScriptResource.notifyComplete("./src/Applications/Wizard/components/wizard.js");	
JavaScriptResource.notifyComplete("./btAppWizard.js");
