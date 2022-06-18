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
