function AdvancedSearchDiag() {
this.window=null;
this.isBuilt=false;
this.isClosed=true;
this.advFieldSearch=Array();
this.advFieldModifier=Array();
this.advField=Array();
this.advDateModifier;
this.advDate;
this.advSizeModifier;
this.advSize;
this.advSizeUnit;
this.allSelected=true;
this.searchRows=Array();
this.locations=Array();
this.icons=Array("LiteTreeIcon_folder", 
"EmailFolder_inbox", 
"EmailFolder_sent", 
"EmailFolder_draft", 
"EmailFolder_trash", 
"EmailFolder_junk",
"Folder_Checked",
"Folder_UnChecked",
"Folder_PartialChecked");
this.folder_tree_root;
}
AdvancedSearchDiag.lastDiag=undefined;
AdvancedSearchDiag.launch=function() {
if(!AdvancedSearchDiag.lastDiag) {
var asd=new AdvancedSearchDiag();
AdvancedSearchDiag.lastDiag=asd;
}
AdvancedSearchDiag.lastDiag.show();
}
AdvancedSearchDiag.prototype.build=function() {
this.window=new WindowObject('advsearch', "Advanced Search", 200, 200, Application.titleBarFactory());
this.window.i_redock_manager=SystemCore.windowManager();
var masterDiv=document.createElement('div');
var findTextLabel=document.createElement('label');
findTextLabel.innerHTML='Find messages containing the text:';
var fieldSearchTable=document.createElement('table');
var fstb=document.createElement('tbody');
fieldSearchTable.appendChild(fstb);
for(var x=0; x < 2; x++) {
var row=new AdvancedSearchRow(this);
this.searchRows.push(row);
fstb.appendChild(row.getRow());
}
var refineSearchLabel=document.createElement('label');
refineSearchLabel.innerHTML="Refine your search:";
var refineTable=document.createElement('table');
var rtb=document.createElement('tbody');
refineTable.appendChild(rtb);
var rtr=document.createElement('tr');
rtb.appendChild(rtr);
var rtd=document.createElement('td');	
this.advDateModifier=AdvancedSearchDiag.getDateModifierOptionBox();
rtd.appendChild(this.advDateModifier.getInput());
rtr.appendChild(rtd);
rtd=document.createElement('td');
this.advDate=document.createElement('input');
this.advDate.size=15;
rtd.appendChild(this.advDate);
rtr.appendChild(rtd);
EventListener.listen(this.advDate, "onchange", this, "dateChange");
var button=document.createElement('IMG');
button.width=16;
button.height=16;
button.style.cursor="pointer";
button.src="/gui/img/ico_calendar.gif";
rtd.appendChild(button);
DateSelection.setup({
inputField	: this.advDate,
ifFormat	: user_prefs['date_prefs'],
button		: button
});
rtr=document.createElement('tr');
rtb.appendChild(rtr);
rtd=document.createElement('td');
this.advSizeModifier=AdvancedSearchDiag.getLargerSmallerOptionBox();
rtd.appendChild(this.advSizeModifier.getInput());
rtr.appendChild(rtd);
rtd=document.createElement('td');
this.advSize=document.createElement('input');
rtd.appendChild(this.advSize);
rtr.appendChild(rtd);
rtd=document.createElement('td');
this.advSizeUnit=AdvancedSearchDiag.getSizeUnitOptionBox();
rtd.appendChild(this.advSizeUnit.getInput());
rtr.appendChild(rtd);
this.folder_fs=new Fieldset("Search Folders");
var submit=document.createElement('button');
submit.innerHTML='Search';
EventListener.listen(submit, "onclick", this, "doSearch");
var topDiv=document.createElement('div');
var toolbar=new ToolBar(100);
this.toolbar=toolbar;
var t=new IconLabelButton("Search", "IconField_icon_search_no_arrow", 20, 16, 64, 18, "Search", AdvancedSearchDiag.doSearch, this);
t.pObj=this;
toolbar.addItem(new ToolBarButton(t));
var c=new IconLabelButton("Close", "ToolBar_icon_close", 16, 16, 52, 18, "Close", AdvancedSearchDiag.close, this);
c.pObj=this;
toolbar.addItem(new ToolBarButton(c));
topDiv.appendChild(toolbar.getBar());
masterDiv.appendChild(topDiv);
var innerDiv=document.createElement('div');
innerDiv.style.padding="2px";
innerDiv.style.overflow='auto';
masterDiv.appendChild(innerDiv);
innerDiv.appendChild(findTextLabel);
innerDiv.appendChild(fieldSearchTable);
innerDiv.appendChild(refineSearchLabel);
innerDiv.appendChild(refineTable);
innerDiv.appendChild(this.folder_fs.getContent());
this.topDiv=topDiv;
this.innerDiv=innerDiv;	
this.window.loadContent(masterDiv);
this.window.onresize=AdvancedSearchDiag.resize;
this.window.ondock=AdvancedSearchDiag.ondock;
this.window.onclose=AdvancedSearchDiag.onclose;
this.window.pObj=this;
this.isBuilt=true;
ApplicationEmail.store.requestFolders(AdvancedSearchDiag.getFoldersHandler);
}
AdvancedSearchDiag.ondock=function(state) {
if(!this.pObj.isClosing) {
if(!state) {
var me=this;
setTimeout(function() {
me.pObj.show();
}, 0);
}
}
return true;
}
AdvancedSearchDiag.onclose=function() {
return this.pObj.onclose();
}
AdvancedSearchDiag.prototype.onclose=function() {
if(this.window.docked()) {
this.isClosing=true;
this.window.docked(false);
}
this.isClosing=false;
this.isClosed=true;
return true;
}
AdvancedSearchDiag.resize=function(width, height) {
this.pObj.innerDiv.style.height=(height - this.pObj.topDiv.offsetHeight - (scrollBarWidth()+2)  - 4)+"px";
this.pObj.innerDiv.style.width=(width - 2 - 4)+"px";
this.pObj.toolbar.width(width - 2);
this.pObj.i_folderActionTreePane.width(width - 32);
if (height - 230 > 80) {
this.pObj.i_folderActionTreePane.height(height - 230);
}
else {
this.pObj.i_folderActionTreePane.height(80);
}
return true;
}
AdvancedSearchDiag.prototype.show=function() {
if(!this.isBuilt) {
this.build();
}
if(this.window) {
this.window.i_redock_manager=SystemCore.windowManager();
this.window.popWindow(420, 400, true);
}
this.isClosed=false;
}
AdvancedSearchDiag.getSearchByOptionBox=function() {
var box=new OptionBox(100);
box.addOption(new OptionBoxOption('From', '1', true));
box.addOption(new OptionBoxOption('To, CC', '2', false));
box.addOption(new OptionBoxOption('Subject', '3', false));
box.addOption(new OptionBoxOption('Message Body', '4', false));
return box;
}
AdvancedSearchDiag.getSearchContainsOptionBox=function() {
var box=new OptionBox(125);
box.addOption(new OptionBoxOption('contains', '1', true));
box.addOption(new OptionBoxOption('does not contain', '0', false));
return box;
}
AdvancedSearchDiag.getSearchField=function() {
var input=document.createElement('input');
return input;
}
AdvancedSearchDiag.getDateModifierOptionBox=function() {
var box=new OptionBox(100);
box.addOption(new OptionBoxOption('Dated after', "1", true));
box.addOption(new OptionBoxOption('Dated before', "-1", false));
box.addOption(new OptionBoxOption('Dated on', "0", false));
return box;
}
AdvancedSearchDiag.getLargerSmallerOptionBox=function() {
var box=new OptionBox(100);
box.addOption(new OptionBoxOption('Larger than', "1", true));
box.addOption(new OptionBoxOption('Smaller than', "0", false));
return box;
}
AdvancedSearchDiag.getSizeUnitOptionBox=function() {
var box=new OptionBox(125);
box.addOption(new OptionBoxOption('bytes', "1", false));
box.addOption(new OptionBoxOption('kilobytes (KB)', "1024", true));
box.addOption(new OptionBoxOption('megabytes (MB)', "1048576", false));
return box;
}
AdvancedSearchDiag.getFoldersHandler=function() {
AdvancedSearchDiag.lastDiag.copyFolderTreeDataModel(ApplicationEmail.getFolderTreeDataModel());
}
AdvancedSearchDiag.prototype.copyFolderTreeDataModel=function(model) {
this.folder_fs.clearContent();
var root=model.rootNode().deepCopy(function(node) { 
node.onclick=AdvancedSearchDiag.folderTreeSelectHandler; 
if(ApplicationEmail.i_folder_tree_ids[node.id()]!=0) {
node.iconId(7);
}
});
this.i_folderActionTreeModel=new LiteTreeDataModel(root);
this.i_folderActionTreePane=new LiteTree(this.i_folderActionTreeModel,this.icons,this.icons,"200","150");
var tree=this.i_folderActionTreePane.getTree();
this.folder_fs.addContent(tree);
root.open(true);
root.name(root.name()+" (click to toggle all)");
this.folder_tree_root=root;
}
AdvancedSearchDiag.prototype.selectSubfolders=function(node, checked)
{
var children=node.children();
if(children && children.length > 0) {
var i;
for (i=0; i < children.length; i++) {
this.selectFolder(children[i], checked);
}
}
}
AdvancedSearchDiag.prototype.partialSelectFolder=function(node, checked) {
var cur_id=ApplicationEmail.i_folder_tree_ids[node.id()];
if(cur_id!=0) {
if (6==node.iconId() || 8==node.iconId()) {
node.iconId(8);
this.partialSelectFolder(node.parent());
}
}
}
AdvancedSearchDiag.prototype.isAnySubSelected=function(node){
var children=node.children();
if(children && children.length) {
var i;
for (i=0; i < children.length; i++) {
if (6==(children[i]).iconId() || 8==(children[i]).iconId()) {
return true;
} else {
if(this.isAnySubSelected(children[i])) {
return true;
}
}
}
}
return false;
}
AdvancedSearchDiag.prototype.addLocation=function (node) {
var cur_id=ApplicationEmail.i_folder_tree_ids[node.id()];
if(cur_id==0){
return;
}
var foundFolder=false;
for(var i=0; i < this.locations.length; i++) {
if(this.locations[i]==cur_id) {
foundFolder=true;
}
}
if(!foundFolder) {
this.locations.push(cur_id);
}
}
AdvancedSearchDiag.prototype.removeLocation=function (node) {
var cur_id=ApplicationEmail.i_folder_tree_ids[node.id()];
if(cur_id==0){
return;
}
for(var i=this.locations.length - 1; i >=0; i--) {
if(this.locations[i]==cur_id) {
this.locations.splice(i,1);
}
}	
}
AdvancedSearchDiag.prototype.selectFolder=function(node, checked, applyToAll) {
if(checked==undefined) {
checked=5; 
}
if(applyToAll==undefined) {
applyToAll=false;
}
var cur_id=ApplicationEmail.i_folder_tree_ids[node.id()];
if(cur_id==0) { 
if(checked==5) {
this.toggleAllFolders();
}
return;
}
var doadd=true;
for(var x=this.locations.length - 1; x >=0; x--) {
if(this.locations[x]==cur_id) {
this.locations.splice(x,1);
doadd=false;
}
}
checked=(checked!=5 ? checked : doadd);
if(8==node.iconId()) {
checked=false;
}
if((doadd && checked) || checked) {
this.locations.push(cur_id);
node.iconId(6);
this.selectSubfolders(node, checked);
this.selectParent(node);
}else{
if(applyToAll)
{
node.iconId(7);
this.removeLocation(node);
} else {
if(this.isAnySubSelected (node)) {
node.iconId(8);
this.addLocation(node);
this.unselectSubs(node);
} else {
node.iconId(7);
this.removeLocation(node);
}
this.partialSelectFolder(node.parent());
}
}
}
AdvancedSearchDiag.prototype.unselectSubs=function(node) {
var children=node.children();
if(children && children.length) {
var i;
for (i=0; i < children.length; i++) {
(children[i]).iconId(7);
this.removeLocation(children[i]);
this.unselectSubs(children[i]);
}
}
}
AdvancedSearchDiag.prototype.selectParent=function(node) {
var parent=node.parent();
if(parent && 8==parent.iconId()) {
var siblings=parent.children();
if(siblings && siblings.length) {
var allSiblingsAreChecked=true;
var i;
for (i=0; i < siblings.length; i++) {
if ((siblings[i]).iconId()!=6) {
allSiblingsAreChecked=false;
}
}
if(allSiblingsAreChecked) {
parent.iconId(6);
this.addLocation(parent);
this.selectParent(parent);
}
}
}
}
AdvancedSearchDiag.prototype.toggleAllFolders=function() {
var root=this.folder_tree_root;
var finder=Array();
finder.push(root);
while(finder.length > 0) {
var cur=finder.pop();
this.selectFolder(cur, this.allSelected, true);
var children=cur.children();
if(children && children.length > 0) {
finder=finder.concat(children);
}
}
this.allSelected=!this.allSelected;
}
AdvancedSearchDiag.folderTreeSelectHandler=function() {
AdvancedSearchDiag.lastDiag.selectFolder(this);
}
AdvancedSearchDiag.doSearch=function(something, goto) {
goto.doSearch();
}
AdvancedSearchDiag.close=function(something, goto) {
goto.close();
}
AdvancedSearchDiag.prototype.close=function() {
if(this.window) {
this.window.close();
}
return true;
}
AdvancedSearchDiag.prototype.doSearch=function() {
var rp=new AdvancedSearchResourcePost();
for(var x=0; x < this.searchRows.length; x++) {
rp.param('advFieldChoice', this.searchRows[x].advFieldSearch.value());
rp.param('advFieldModifier', this.searchRows[x].advFieldModifier.value());
rp.param('advField', this.searchRows[x].advField.value);	
}
var len=this.locations.length;
for(var x=0; x < len; x++) {
rp.param('advLocation', this.locations[x]);
}
rp.param('advDateModifier', this.advDateModifier.value());
rp.param('advDate', this.advDate.value);
rp.param('advSizeModifier', this.advSizeModifier.value());
rp.param('advSize', this.advSize.value);
rp.param('advSizeUnit', this.advSizeUnit.value());
rp.param('cType', 'advanced');
rp.param('unm', user_prefs['user_name']);
rp.param('sid', user_prefs['session_id']);
rp.param('sm', '1');
rp.param('act', '19');
ResourceManager.request('/cgi-bin/emailSearchProgress.cgi', 10, Array(this, "searchHandler"), rp);
}
AdvancedSearchDiag.prototype.searchHandler=function(data, response) {
ApplicationEmail.i_header_folder.visible(true);
ApplicationEmail.getDataModel().activeSearch(undefined, undefined, undefined, true);
var efWin=WindowObject.getWindowById('eml-messages');
efWin.name('Advanced Search...');
}
AdvancedSearchDiag.prototype.continueSearch=function(args) {
var rp=new AdvancedSearchResourcePost();
rp.param('unm', user_prefs['user_name']);
rp.param('sid', user_prefs['session_id']);
rp.param('sm', '1');
rp.param('act', '18');
for(var x=0; x < this.searchRows.length; x++) { 
var s="";
if(this.searchRows[x].advField.value!="") {
s=this.searchRows[x].advFieldSearch.value()+":"+this.searchRows[x].advFieldModifier.value()+":"+this.searchRows[x].advField.value;
}
rp.param('sfield'+(x+1), s);
}
var sloc="";
var len=this.locations.length;
for(var x=0; x < len; x++) {
if(sloc!="") {
sloc+="|";
}
sloc+=this.locations[x];
}
rp.param('sloc', sloc);
rp.param('ssize', this.advSizeModifier.value()+":"+(parseFloat((this.advSize.value!=""? this.advSize.value : 0)) * parseFloat(this.advSizeUnit.value()))+".00000");
rp.param('sdate', this.advDateModifier.value()+":"+this.advDate.value);
rp.param('gds', '1');
ResourceManager.request('/cgi-bin/emailAdvancedSearch.cgi', 10, ApplicationEmail.store.handleSearchResults, rp, [Notifications.add('Searching...'), DataListMessageModel.processSearchEntries, args[0]]);
}
AdvancedSearchDiag.prototype.continueSearchHandler=function(data, response) {
;
}
AdvancedSearchDiag.prototype.dateChange=function() {
if(this.advDate.value!="") {
this.advDate.value=getNumericDateString(createDateFromStrings(this.advDate.value, "00:00:00"));
}
}
function AdvancedSearchRow(parent) {
this.parent=parent;
this.advFieldSearch;
this.advFieldModifier;
this.advField;
}
AdvancedSearchRow.prototype.getRow=function() {
var fstr;
var fstd;
fstr=document.createElement('tr');
fstd=document.createElement('td');
var box=AdvancedSearchDiag.getSearchByOptionBox();
this.advFieldSearch=box;
fstd.appendChild(box.getInput());
fstr.appendChild(fstd);
fstd=document.createElement('td');
box=AdvancedSearchDiag.getSearchContainsOptionBox();
this.advFieldModifier=box;
fstd.appendChild(box.getInput());
fstr.appendChild(fstd);
fstd=document.createElement('td');
input=AdvancedSearchDiag.getSearchField();
this.advField=input;
fstd.appendChild(input);
fstr.appendChild(fstd);
return fstr;
}
function AdvancedSearchResourcePost() {
this.params=Array();
}
AdvancedSearchResourcePost.prototype.param=function(name, value) {
if(name && value) {
this.params.push([name, value]);
}
}
AdvancedSearchResourcePost.prototype.toString=function() {
var str="";
for(var x=0; x < this.params.length; x++) {
if(str!="") {
str+="&";
}
str+=escape(this.params[x][0])+"="+this.params[x][1];
}
return str;
}
JavaScriptResource.notifyComplete("./src/Applications/Email/dialogs/Dialog.AdvancedSearch.js");	
function SearchMenu(parent, window) {
this.i_parent=parent;
this.i_window=window;
this.i_menu=undefined;
this.i_divider=undefined;
SearchMenu.obj=this;
EventHandler.register(this.i_parent, "onmousedown", this.handleMouseDown, this);
EventHandler.register(this.i_parent, "ondblclick", this.handleMouseUp, this);
this.loadSettings();
}
SearchMenu.prototype.loadSettings=function() {
if(this.i_window!=undefined) {
if(this.i_window.SearchMenu!=undefined && this.i_window.SearchMenu.settings!=undefined) {
SearchMenu.settings=this.i_window.SearchMenu.settings
}
}
if(SearchMenu.settings==undefined) {
SearchMenu.settings=SearchSettings.store.getSettings();
}
}
SearchMenu.prototype.createMenu=function() {
if(this.i_menu==undefined) {
this.i_menu=new ContextMenu(280);
this.i_divider=this.i_menu.addItem(new ContextMenuDivider());
var menu_item=this.i_menu.addItem(new ContextMenuItem("Disable highlight and search", true));
EventHandler.register(menu_item, "onclick", this.disableHighlightSearch, this);
this.populateMenu();
}
}
SearchMenu.prototype.populateMenu=function() {
for(var i=0; i < SearchBox.engines.length; i++) {
this.addEngineOption(SearchBox.engines[i]);
}
}
SearchMenu.prototype.addEngineOption=function(engine) {
var handler=function() {
SearchMenu.obj.handleSearch(engine);
}
var menu_item=this.i_menu.addItem(new ContextMenuItem(engine.blankSearchText(), true), this.i_divider);
EventHandler.register(menu_item, "onclick", handler);
}
SearchMenu.prototype.getSelection=function() {
if (window.getSelection) {
selection=window.getSelection();
} else if (document.getSelection) {
selection=document.getSelection();
} else if (document.selection) {
selection=document.selection.createRange().text;
}
return selection;
}
SearchMenu.prototype.handleMouseDown=function(event) {
this.createMenu();
this.loadSettings();
this.i_right_clicked=false;
if (event.which) this.i_right_clicked=(event.which==3);
else if (event.button) this.i_right_clicked=(event.button==2);
if (!this.i_right_clicked) {
if(SearchMenu.settings.isHighlightSearchEnabled()) {
this.i_cursor_x=CursorMonitor.getX();
this.i_cursor_y=CursorMonitor.getY();
this.i_mouse_up_listener=EventHandler.register(document.body, "onmouseup", this.handleMouseUp, this);
}
}
return true;
}
SearchMenu.prototype.handleMouseUp=function(event) {
if(this.i_mouse_up_listener!=undefined) {
this.i_mouse_up_listener.unregister();
this.i_mouse_up_listener=undefined;
}
if (!this.i_right_clicked) {
this.createMenu();
this.loadSettings();
if(SearchMenu.settings.isHighlightSearchEnabled() && !this.i_menu.visible()) {
this.i_selection=trim(this.getSelection().toString());
if(this.i_selection.length > 50) {
var next_char=this.i_selection.substring(50, 51);
this.i_selection=this.i_selection.substring(0, 50);
if(next_char.match(/\s/)==null) {
this.i_selection=this.i_selection.replace(/\s+[^\s]*?$/, "");
}
}
if(this.i_selection!="") {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
setTimeout(function() { SearchMenu.obj.displaySearchMenu(x, y) }, 1000);
}
}
}
}
SearchMenu.prototype.displaySearchMenu=function(x, y) {
if(this.getSelection().toString()!="" && SearchBox.engines.length > 0) {
var shortened_text=this.i_selection;
if(shortened_text.length > 15) {
shortened_text=shortened_text.substring(0, 15)+"...";
}
var items=this.i_menu.items();
for(var i=0; i < items.length - 2; i++) {
items[i].name(SearchBox.engines[i].blankSearchText()+' for "'+shortened_text+'"');
}
this.i_menu.show(x, y);
}
}
SearchMenu.prototype.handleSearch=function(engine) {
if(this.i_window!=undefined) {
this.i_window.focus();
}
engine.search(this.i_selection);
if(this.getSelection().collapseToStart) {
this.getSelection().collapseToStart();
} else if(document.selection) {
document.selection.empty();
}
}
SearchMenu.prototype.disableHighlightSearch=function() {
var confirm=window.confirm("Are you sure you want to disable the highlight and search feature?\n\nIt can be re-enabled at any time by visiting the General Settings page of your Email preferences.");
if(confirm) {
SearchMenu.settings.setHighlightSearchEnabled(false);
SearchMenu.settings.save();
}
}
JavaScriptResource.notifyComplete("./src/Applications/Email/components/Component.SearchMenu.js");	
JavaScriptResource.notifyComplete("./btAppEmailExtras.js");
