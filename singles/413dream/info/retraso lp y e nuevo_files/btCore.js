if (!Object.prototype.toJSONString) {
Array.prototype.toJSONString=function (flat) {
var a=[],     
i,          
l=this.length,
v;          
for (i=0; i < l; i+=1) {
v=this[i];
switch (typeof v) {
case 'object':
if (v) {
if (typeof v.toJSONString==='function' && flat==undefined) {
a.push(v.toJSONString());
}
} else {
a.push('null');
}
break;
case 'string':
case 'number':
case 'boolean':
a.push(v.toJSONString());
}
}
return '['+a.join(',')+']';
};
Boolean.prototype.toJSONString=function () {
return String(this);
};
Date.prototype.toJSONString=function () {
function f(n) {
return n < 10 ? '0'+n : n;
}
return '"'+this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z"';
};
Number.prototype.toJSONString=function () {
return isFinite(this) ? String(this) : 'null';
};
Object.prototype.toJSONString=function () {
var a=[],     
k,          
v;          
for (k in this) {
if (typeof k==='string' && this.hasOwnProperty(k)) {
v=this[k];
switch (typeof v) {
case 'object':
if (v) {
if (typeof v.toJSONString==='function') {
a.push(k.toJSONString()+':'+v.toJSONString());
}
} else {
a.push(k.toJSONString()+':null');
}
break;
case 'string':
case 'number':
case 'boolean':
a.push(k.toJSONString()+':'+v.toJSONString());
}
}
}
return '{'+a.join(',')+'}';
};
(function (s) {
var m={
'\b': '\\b',
'\t': '\\t',
'\n': '\\n',
'\f': '\\f',
'\r': '\\r',
'"' : '\\"',
'\\': '\\\\'
};
s.parseJSON=function (filter) {
var j;
function walk(k, v) {
var i;
if (v && typeof v==='object') {
for (i in v) {
if (v.hasOwnProperty(i)) {
v[i]=walk(i, v[i]);
}
}
}
return filter(k, v);
}
if (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(this.
replace(/\\./g, '@').
replace(/"[^"\\\n\r]*"/g, ''))) {

// In the second stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + this + ')');

// In the optional third stage, we recursively walk the new structure, passing
// each name/value pair to a filter function for possible transformation.

                return typeof filter === 'function' ? walk('', j) : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('parseJSON');
        };


        s.toJSONString = function () {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can simply slap some quotes around it.
// Otherwise we must also replace the offending characters with safe
// sequences.

            if (/["\\\x00-\x1f]/.test(this)) {
return '"'+this.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                    var c = m[b];
                    if (c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return '\\u00' +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + this + '"';
        };
    })(String.prototype);
}

/**
 *  Resource Manager Notification
 */
JavaScriptResource.notifyComplete("./lib/json.js");

/*
	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Common System Functions %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
	/**
	 *	This file contains functions which do not belong to a class.  They are utilities which can be called from any portion of the code, and any 
	 *	child document.
	 */
	 
	 
	 
	 
	 
	 
	/**
	 *	Get the default system scroll bar width
	 *
	 *	@return the default system scroll bar width
	 */
	function scrollBarWidth() {
		if (scrollBarWidth.scwidth == undefined) {
			var a = document.createElement('DIV');
			a.style.position = "absolute";
			a.style.visibility = "hidden";
			a.style.overflow = "scroll";
			a.style.width = "100px";
			a.style.height = "100px";
			
			var b = document.createElement('DIV');
			b.style.height = "200px";
			b.innerHTML = "&nbsp;";
			
			a.appendChild(b);
			try {
				document.body.appendChild(a);
			
				scrollBarWidth.scwidth = parseInt(a.offsetWidth) - parseInt(b.offsetWidth);
			
				document.body.removeChild(a);
			} catch( e ) {
				console.log('Failed to aquire the scroll bar width.!');
				return 0;
			}
		}
		
		
		
		
		
		// If things start breaking, uncomment the following lines
			//if (scrollBarWidth.scwidth < 16) {
			//	scrollBarWidth.scwidth = 16;
			//}	
		
		
		
		
		return scrollBarWidth.scwidth;
	}
	
	_textDimCache = undefined;
	function TextDimension(text, cssClass, width, noCache, parentElement) {
		// By default, push the text dimension processor onto document.body.
		// But there may be instances where the styling is dependant on the
		// ancestor of the class, so we need to give it a specific parent.
		
		if (_textDimCache == undefined) {
			_textDimText = document.createElement('div');
			_textDimText.style.display = "inline";
			
			_textDim = document.createElement('div');
			_textDim.style.position = "absolute";
			_textDim.style.top = "-5000px";
			_textDim.style.left = "-5000px";
			
			_textDim.appendChild(_textDimText);
			document.body.appendChild(_textDim);
			_textDimCache = {};
		}
		
		if (text == "" || text == "undefined") return {width:0,height:0};
		
		var id = text + ":" + cssClass + ":" + (width != undefined ? width : 0), res;
		if (_textDimCache[id] != undefined) {
			return _textDimCache[id];
		}
		
		if (!parentElement) {
			_textDim.style.width = (width != undefined ? width + "px" : "auto");
			_textDimText.className = (cssClass ? cssClass : "");
			_textDimText.innerHTML = text;
			res = {width:_textDimText.offsetWidth, height:_textDimText.offsetHeight};
		} else {
			var text = document.createElement('div');
			text.style.display = "inline";
			text.className = (cssClass ? cssClass : "");
			text.innerHTML = text;
			
			var holder = document.createElement('div');
			holder.style.width = (width != undefined ? width + "px" : "auto");
			holder.style.position = "absolute";
			holder.appendChild(text);
			
			parentElement.appendChild(holder);
			res = {width:text.offsetWidth, height:text.offsetHeight};
			parentElement.removeChild(holder);
		}
		
		if (!noCache) _textDimCache[id] = res;
		
		return res;
	}
	
	/**
	 *	Parse a string, so there are no runs of non-whitespace longer then a given value
	 *
	 *	@param str The string to parse
	 *	@param len The longest run of non whitespace allowed
	 *
	 *	@return the new string with special HTML markup in the necessary locations
	 */
	function BreakString(str, len) {
		var new_str = "";
		var r = 0;
		for (var x = 0; x < str.length; x++) {
			var c = str.charAt(x);
			if (c == "." || c == " " || c == "	" || c == "\n" || c == "-" || c == "!") {
				r = 0;
			}
			new_str+=c;
			r++;
			if (r >= len) {
				new_str+="<span style='font-size:1px;color:#FFFFFF;'> </span>";	
				r = 0;
			}
		}
		return new_str;
	}
	

/**
 *	Resource Manager Notification
 */
JavaScriptResource.notifyComplete("./lib/processors/Processor.Common.js");	
function PopoutWindow( popupClassName, popupLoadingText ) {
	this.i_popup_class_name = popupClassName;
	//Fix for #142111 - new text for "Loading..." screen
	this.i_popup_loading_text = popupLoadingText;
	this.i_external_window = null;
	this.i_internal_window = null;
	this.i_last_external = false;
	this.i_height = 400;
	this.i_width = 750;
	this.i_internal_popup_object = null;
	this.i_external_popup_object = null;
	this.i_main_window = window;
	this.i_include_simpleclick = false;
	this.i_stateData = new Object();
	this.i_stateData.meta = {set:false};
	this.i_stateData.fields = {set:false};
	this.i_external_window_unloader_handler = null;
	this.i_swapping = false;
	this.i_blocked_showing = false;
}

/**
 * Keep track of the registered Meta Groups here.
 */
PopoutWindow.files = [];
PopoutWindow.i_externalWindows = [];
PopoutWindow.cache = [];
PopoutWindow.popout_ids = 0;

/**
 * Event fired when this PopoutWindow opens Internally
 * Event Object:
 * 	e.initial {bool} Is this the first pop to this location
 * 	e.popoutWindow {PopoutWindow} The PopoutWindow firing this event.
 */
PopoutWindow.prototype.onpopinternal = null;

/**
 * Event fired when this PopoutWindow opens Externally
 * Event Object:
 * 	e.initial {bool} Is this the first pop to this location
 * 	e.popoutWindow {PopoutWindow} The PopoutWindow firing this event.
 */
PopoutWindow.prototype.onpopexternal = null;

/**
 * Event for when this PopoutWindow resizes.
 * Event Object:
 * 	o.width {integer} Width of the available content area
 * 	o.height {integer} Height of the available content area
 */
PopoutWindow.prototype.onresize = null;

/**
 * Event for when the Popup window (internal or external) is ready for use.
 * Event Object:
 * 	o.popoutWindow {PopoutWindow} The PopoutWindow firing the event
 */
PopoutWindow.prototype.onready = null;

PopoutWindow.prototype.onbeforepop = null;

/**
 * Register a Meta Group for use in popup window dependencies
 * @param {String} name Name for this meta group.
 * @param {Array} classes Array of class names that should be loaded for this meta group.
 */
PopoutWindow.registerGroup = function( name, classes ) {
	if( PopoutWindow.metaGroups == undefined ) {
		PopoutWindow.metaGroups = new Array();
	}
	PopoutWindow.metaGroups["@"+name] = classes;
}

/**
 * Attach files to a specific Popout class that will be loaded when the popout opens.
 * Meta groups will affect what files are attached.
 *
 * @param {string} name The meta group/name to attach files to.
 * @param {array} files Files required to load for the specified meta group.
 */
PopoutWindow.registerFiles = function(name, files) {
	if (PopoutWindow.files[name] == undefined) PopoutWindow.files[name] = [];
	PopoutWindow.files[name] = PopoutWindow.files[name].concat(files);
}

/**
 * Generate list of required classes, pointers, and native files for the popout class.
 * @param {string} Popout class name that needs to have dependencies determined.
 *
 * @return Caching information for this class.
*/
PopoutWindow.generateCacheForClassName = function(className) {
	if( PopoutWindow.cache == null) {
		PopoutWindow.cache = Array();
	}

	if( PopoutWindow.cache[className] == undefined) {
		var classes = PopoutWindow.getBaseClasses().concat(window[className].getDependencies());
		var processed = PopoutWindow.processGroups(classes);
		var pointers = processed.pointers;
		var natives = processed.natives;
		var files = processed.files;
		var expanded = processed.expanded;
		PopoutWindow.cache[className] = {
			files: files,
			pointers: pointers,
			expanded: expanded,
			natives: natives
		};
	}
	return PopoutWindow.cache[className];
}

/**
 * Create meta data for a popout based on the classes provided.
 * These will be used during the various popoutExternal stages to load necessary
 * components into the popout, and if necessary overwrite their default values.
 *
 * @param {array} classes The classes that need to be processed.
 * @param processed (Optional) An object containing the already processed
 * groups. Used for recursively processing the groups.
 * @return {array} The meta data that will be used by the processExternal stages.
*/
PopoutWindow.processGroups = function( classes, processed ) {

	// This is a recursive function so on the first iteration, we have to
	// generate the result object which will be appended to during each
	// recursion.
	if(processed == undefined) {
		processed = {
			"files": [],
			"expanded": [],
			"pointers": [],
			"natives": []
		};
	}

	for (var x = classes.length - 1; x >= 0; x--) {
		if (classes[x] != undefined) {
			var metaFiles = PopoutWindow.files[classes[x].replace(/[^a-zA-Z0-9._]/,'')];
			if(metaFiles) {
				processed.files = processed.files.concat(metaFiles);
			}
		}
		if (classes[x].charAt(0) == '@') {
			if (PopoutWindow.metaGroups != undefined) {
				var mg = PopoutWindow.metaGroups[classes[x]];

				// The meta group might contain other pointers or natives, so
				// we have to recursively build our result.
				processed = PopoutWindow.processGroups(mg, processed)
			}
		} else if(classes[x].charAt(0) == "+") {
			processed.pointers.push( classes[x].substring(1));
		} else if(classes[x].charAt(0) == "=") {
			processed.natives.push(classes[x].substring(1));
		} else {
			processed.expanded.push(classes[x]);
		}
	}

	return processed;
}

/**
 * Pop this window as either internal or external popup
 * @param {Boolean} external Is this an external browser window?
 */
PopoutWindow.prototype.pop = function( height, width, external ) {
	this.i_height = height;
	if( height == undefined ) {
		this.i_height = 400;
	}
	this.i_width = width;
	if( width == undefined ) {
		this.i_width = 750;
	}
	if( external ) {
		this.i_last_external = true;
		this.popExternal();
	}else{
		this.i_last_external = false;
		this.popInternal();
	}
}

/**
 * Focus the external/internal window.
 *
 * @return true if we focused on something.
 */

PopoutWindow.prototype.focus = function() {

	if( this.i_last_external ) {

		if( this.i_external_window != undefined ) {

			// Note:
			//
			// IE7 - This only seems to cause the window to blink in the
			//       task bar.
			// FF2 - This will only work if the option for allowing scripts to
			//       raise and lower windows is enabled. (See Tools > Options >
			//       Content > Advanced... (next to Enable Javascript)).

			this.i_external_window.focus();
			return true;
		} else if( this.i_blocked_showing ) {
			return true;
		}

	} else {

		if( this.i_internal_window != undefined && ( this.i_internal_window.minimized() || this.i_internal_window.visible() ) ) {
			this.i_internal_window.minimized( false );
			this.i_internal_window.bringToFront();
			return true;
		}

	}
	return false;
}

/**
 * Gets the ClassName for the PopoutWindow
 *
 * @return {String} ClassName
 */
PopoutWindow.prototype.getClassName = function() {
	return this.i_popup_class_name;
}
 
/**
 * Generate a String which contains all of the CSS Styles of the current document
 *
 * @return {String} CSS
 */
PopoutWindow.generateCSSString = function() {
	var strs = Array();

	if( document.all ) { //IE HERE
		var num = document.styleSheets.length;
		for( var x = 0; x < num; x++ ) {
			strs.push( document.styleSheets(x).cssText );
		}
	}else{ //assume all else for now
		var styles = document.getElementsByTagName('head')[0].getElementsByTagName('style');
		for( var x = 0; x < styles.length; x++ ) {
			strs.push( styles[x].innerHTML );
		}
	}
	return strs.join("");
}

/**
 * Return the base class dependency list that all popouts must contain.
 * Most of these requirements are already filled by the default file load for popouts.
*/
PopoutWindow.getBaseClasses = function() {
		SystemCoreHasAppFunc = SystemCore.hasApp;
		var GDSBase = [
		//pointers
//		"+EventHandler",
		"EventHandler",
		"=EventHandler.i_handlers",
		"=EventHandler.i_popout_handlers",
		"=EventHandler.i_idCounter",
		"EventListener",
		"=EventListener.i_handlers",
		"=EventListener.i_popout_handlers",
		"=EventListener.i_idCounter",
		"+user_prefs",
		"+mapPositionIndex",
		"+SimpleClickDataCache",
		"+_LITE_",
		"+_GDS_",
		"+ApplicationOldContacts",
		"+app_ids",
		"+SystemCoreHasAppFunc",
		
		//native object additions
		"=Date.prototype.inclusiveDays",
		"=Date.prototype.copy",
		"=Date.prototype.formatDate",
		"=String.prototype.filterHTML",
		"=PopoutWindow.createObject",
		"=PopoutWindow.i_externalWindows",
		
		//meta groups
		"@DisplayManager",
		"@UniversalForm",
		"@UniversalButton",
		"@LiteTree",
		"@AccordionPane",
		"@Button",
		"@TitleBar",
		"@ContextMenu",
		"@TabbedPane",
		"@DimensionProcessor",
		"@ToolBar",
		"@DataList",
		"@DialogManager",
		"@Notifications",
		"@DataGrid",
		"@DataModel",
		"@OptionBox"
	];	
	
	return GDSBase;
}

PopoutWindow.prototype.handleCloseBlockPrompt = function(e) {

	this.i_blocked_showing = false;
	this.i_blocked_handler1.unregister();
	this.i_blocked_handler1 = null;
	this.i_blocked_handler2.unregister();
	this.i_blocked_handler2 = null;

	if(e.button != undefined) {
		if (e.button == "Try again") {
			this.pop(this.i_height, this.i_width, true);
		} else if (e.button == "Display Inline") {
			this.pop(this.i_height, this.i_width, false);
		}
	}

}

/**
 * This is the 'default' handler used in this object.  That is,
 * in the event no other specializations are made, the
 * setUnloadingData and/or setExternalUnloaderHandler methods
 * are used to specify the handler explicitly.
 *
 * @param obj - The object that was given to the external
 *              window's setBeforeUnload method.
*
* @param sc - The SimpleClick2 object, if any, used by
*             the PopupCore object.
*
* Note: The primary purpose of this method is to clean up
*       the popup window, such as disassociating the
*       SimpleClick2 object from the SimpleClick2 that
*       was used in the popup (If any).
*/
PopoutWindow.prototype.handleExternalPopoutUnload=function(obj, sc) {
if (sc!=undefined) {
sc.cleanup();
} else {
if ((obj!=undefined) && (obj.i_external_popout_window_object!=undefined)) {
if ((obj.i_external_popout_window_object.getSimpleClick!=undefined) && (obj.i_external_popout_window_object.getSimpleClick()!=undefined)) {
obj.i_external_popout_window_object.getSimpleClick().cleanup();
}
}
}
}
PopoutWindow.prototype.setExternalUnloaderHandler=function(handlerName) {
if (this.i_external_window!==null && this.i_external_window.PopupCore) {
this.i_external_window_unloader_handler=handlerName;
this.i_external_window.PopupCore.setBeforeUnload(handlerName, this);
}
}
PopoutWindow.prototype.setUnloadingData=function(unloaderHandler) {
if ((unloaderHandler!=undefined) && (unloaderHandler!=null)) {
this.setExternalUnloaderHandler(unloaderHandler, this);
} else {
this.setExternalUnloaderHandler(this.handleExternalPopoutUnload, this);
}
}
PopoutWindow.prototype.popExternal=function() {
PopoutWindow.generateCacheForClassName(this.i_popup_class_name);
if(PopoutWindow.cacheCSS==undefined) {
PopoutWindow.cacheCSS=PopoutWindow.generateCSSString();
}
this.i_external_window=window.open(user_prefs["root_dir"]+"/gds/popout.html", "", "resizable=yes,width="+(this.i_width+10+200)+",height="+(this.i_height+30));
var thisPtr=this;
setTimeout(function(){
thisPtr.processPopExternal();
thisPtr=undefined;
},50);
}
PopoutWindow.closeExternalWindows=function() {
for (var i=PopoutWindow.i_externalWindows.length-1; i >=0; --i) {
if (PopoutWindow.i_externalWindows[i]!=undefined) PopoutWindow.i_externalWindows[i].close();
}
PopoutWindow.i_externalWindows=[];
}
PopoutWindow.prototype.processPopExternal=function(){
if(!this.i_external_window) {
if(!this.i_blocked_showing) {
this.i_blocked_showing=true;
var d=DialogManager.confirm("<strong>The dialog was blocked from being displayed<strong><br>Your web browser appears to have pop-up blocking enabled. Please turn off pop-up blocking and try again or display the window inside this browser.", "Blocked Window", undefined, ["Try again", "Display Inline", "Cancel"]);
this.i_blocked_handler1=EventHandler.register(d, "onclose", this.handleCloseBlockPrompt, this);
this.i_blocked_handler2=EventHandler.register(d, "onwindowclose", this.handleCloseBlockPrompt, this);
}
return;
}
PopoutWindow.i_externalWindows.push(this.i_external_window);
var winTarget=(document.all ? this.i_external_window.document : this.i_external_window);
var files=PopoutWindow.cache[this.i_popup_class_name].files;
winTarget.app_ids=app_ids;
winTarget.user_prefs=user_prefs;
winTarget.jsfiles=files;
winTarget.cssStyle=PopoutWindow.cacheCSS;
winTarget.popup_class_name=this.i_popup_class_name;
winTarget.popup_loading_text=this.i_popup_loading_text;
winTarget.popup_window_ref=this;
winTarget.popout_id=PopoutWindow.popout_ids++;
}
PopoutWindow.prototype.processPopExternalStage2=function() {
function encodeItem(stack, name, data) {
if (data==undefined || name.match(/\.prototype$/)) return;
if (typeof data!="function" && typeof data!="number") {
if (data.splice!=undefined) {
stack.push(name+"="+data.toJSONString(true)+";");
} else {
stack.push(name+"=PopupCore.mainWindow()."+name+";"); 
}
return;
}
if (data==null) {
stack.push(name+"=null;");
} else if (typeof data!="function") {
stack.push(name+"="+data.toString()+";");
}
}
var blacklist={"PopoutWindow.cacheCSS":1,
"PopoutWindow.cache":1,
"PopoutWindow.files":1,
"PopoutWindow.metaGroups":1,
"WindowObject.i_window_ref":1,
"WindowObject.i_window_list":1
};
var win=this.i_external_window;
var items=PopoutWindow.cache[this.i_popup_class_name].expanded;
var target=(document.all ? "document" : "window");
var objects=[];
for (var i=0; i < items.length;++i) {
var child=items[i]; 
if (typeof window[child]==undefined || window[child]==null) continue;
try {
encodeItem(objects, child, window[child]);
if (window[child].prototype!=undefined) {
for (var proto in window[child]) {
encodeItem(objects, child+"."+proto, window[child][proto]);
}
for (var proto in window[child].prototype) {
encodeItem(objects, child+".prototype."+proto, window[child].prototype[proto]);
}
}
} catch (e) { 
}
}
objects.push("PopupCore._objectsReady_=true;");
var str=objects.join('');
return str;
}
PopoutWindow.prototype.processPopExternalStage3=function() {
var objectStr="";
var pointers=PopoutWindow.cache[this.i_popup_class_name].pointers;
var natives=PopoutWindow.cache[this.i_popup_class_name].natives;
if (document.all) { 
for (var x=pointers.length - 1; x >=0; x--) {
this.i_external_window.document[pointers[x]+"Ptr"]=window[pointers[x]];
objectStr+="window."+pointers[x]+" = document."+pointers[x]+"Ptr;";
}
for(var x=natives.length - 1; x >=0; x--) {
var s=natives[x].replace(/\./g,"__");
var obj=s.split("__");
if(obj.length==2) {
this.i_external_window.document[s]=window[obj[0]][obj[1]];
objectStr+=obj[0]+"."+obj[1]+" = document."+s+";";
} else {
this.i_external_window.document[s]=window[obj[0]][obj[1]][obj[2]];
objectStr+=obj[0]+"."+obj[1]+"."+obj[2]+" = document."+s+";";			
}
}
} else { 
for(var x=pointers.length - 1; x >=0; x--) {
this.i_external_window[pointers[x]]=window[pointers[x]];
}
for(var x=natives.length - 1; x >=0; x--) {
var obj=natives[x].split(".");
if(obj.length==2) {
this.i_external_window[obj[0]][obj[1]]=window[obj[0]][obj[1]];
} else {
this.i_external_window[obj[0]][obj[1]][obj[2]]=window[obj[0]][obj[1]][obj[2]];
}
}
}
objectStr+="PopupCore._ptrsReady_=true;";
return objectStr;
}
PopoutWindow.prototype.popInternal=function() {
var initial=false;
this.i_internal_window=new WindowObject(undefined, "Internal Window", 100, 100, Application.titleBarFactory());
this.i_internal_window.titleBar().removeButton(Application.i_title_dock);
this.i_internal_window.temporary(true);
this.i_internal_window.global(true);
this.i_popup_window_onclose=EventHandler.register(this.i_internal_window, "onclose", this.handleInternalWindowClose, this);
this.i_internal_popup_object=new window[this.i_popup_class_name]({
popoutWindow: this, 
windowObject: this.i_internal_window, 
showToolbar: true
});
this.i_internal_window.popWindow(this.i_width+(this.i_include_simpleclick ? 0 : 200), this.i_height, true);
if(this.onpopinternal!==null) {
var o=new Object();
o.initial=initial;
o.popoutWindow=this;
o.type="popinternal";
o.stateData=this.i_stateData;
this.onpopinternal(o);
}
window.focus();
if(this.onready!==null) {
var o=new Object();
o.type="ready";
o.popoutWindow=this;
this.onready(o);
}
};
PopoutWindow.prototype.getMainWindow=function() {
return this.i_main_window;
};
PopoutWindow.prototype.handleContentResize=function(o) {
var width=parseInt(o.originalScope.effectiveWidth() - WindowManager.window_border_width - 2);
var height=parseInt(o.originalScope.effectiveHeight() - o.originalScope.titleBar().height() - WindowManager.window_border_width - 2);
var op=new Object();
op.type="resize";
op.width=width;
op.height=height;
if(this.onresize!==null) {
this.onresize(op);
}
}
PopoutWindow.prototype.handleBrowserPopupResize=function(o) {
var height=parseInt(o.originalScope.effectiveHeight() - WindowManager.window_border_width - 2);
var width=parseInt(o.originalScope.effectiveWidth() - WindowManager.window_border_width - 2);
if(this.onresize!==null) {
var o=new Object();
o.type="resize";
o.width=width;
o.height=height;
this.onresize(o);
}
}
PopoutWindow.prototype.getPopupObject=function() {
if(this.i_last_external==true) {
return this.i_external_popup_object;
}else{
return this.i_internal_popup_object;
}
};
PopoutWindow.prototype.loadContent=function(content) {
if(this.i_last_external==true) {
if(this.i_external_window.PopupCore.popoutWindowObject) {
this.i_external_window.PopupCore.popoutWindowObject.loadContent(content);
}else{
this.i_external_window.PopupCore.initialContent=content;
}
}else{
this.i_internal_window.loadContent(content);
}
};
PopoutWindow.prototype.displaySimpleClick=function() {
this.i_external_popout_window_object.displaySimpleClick();
}
PopoutWindow.prototype.processPopExternalStage4=function(obj, popoutWindowObj) {
this.i_external_popup_object=obj;
this.i_external_popout_window_object=popoutWindowObj;
if(this.onpopexternal!==null) {
var o=new Object();
o.initial=true;
o.popoutWindow=this;
o.type="popexternal";
o.stateData=this.i_stateData;
this.onpopexternal(o);
}
this.i_external_window.focus();
if(this.onready!==null) {
var o=new Object();
o.type="ready";
o.popoutWindow=this;
this.onready(o);
}
}
PopoutWindow.prototype.handleExternalWindowClose=function(e) {
this.terminateWindow(true);
this.i_external_popup_object=null;
this.i_external_window=null;
if(this.i_popup_window_onclose!=null) {
this.i_popup_window_onclose.unregister();
this.i_popup_window_onclose=null;
}
if (this.isSwapping()) {
this.i_swapping=false;
this.pop(this.i_height, this.i_width, !this.i_last_external);
}
}
PopoutWindow.prototype.handleInternalWindowClose=function(e) {
this.terminateWindow(true);
WindowObject.deleteRef(this.i_internal_window);
this.i_internal_window=null;
this.i_internal_popup_object=null;
if(this.i_popup_window_onclose!=null) {
this.i_popup_window_onclose.unregister();
this.i_popup_window_onclose=null;
}
if (this.isSwapping()) {
this.i_swapping=false;
this.pop(this.i_height, this.i_width, !this.i_last_external);
}
}
PopoutWindow.prototype.swapPop=function() {
this.i_swapping=true;
if (this.isExternal()) {
if ((this.i_external_popup_object.getSimpleClick!=undefined) && (this.i_external_popup_object.getSimpleClick()!=undefined)) {
this.i_external_popup_object.getSimpleClick().cleanup();
}
}
var target=(this.i_last_external ? this.i_external_window : this.i_internal_window);
if(this.onbeforepop!==null) {
var o={
type: "beforepop",
popoutWindow: this,
window: target,
oldState: (this.i_last_external ? "out" : "in"),
width: this.i_width,
height: this.i_height
};
this.onbeforepop(o);
if(o.width!=this.i_width){
this.i_width=o.width;
}
if(o.height!=this.i_height){
this.i_height=o.height;
}
}
this.terminateWindow(false, {swap: true});
target.close();
}
PopoutWindow.prototype.terminateWindow=function(final, additional) {
if(final===undefined) {
final=false;
}
if(this.onterminate!==null) {
var o={
cancelTerminate: false,
stateData: this.i_stateData,
type: "terminate",
final: final
};
for (var i in additional) { o[i]=additional[i]; }
this.onterminate(o);
}
if (this.isExternal()) {
for (var i=PopoutWindow.i_externalWindows.length - 1; i >=0; --i) {
if (PopoutWindow.i_externalWindows[i]==this.i_external_window) {
PopoutWindow.i_externalWindows.splice(i,1);
}
}
}
};
PopoutWindow.prototype.isExternal=function() {
return this.i_last_external;
}
PopoutWindow.prototype.isSwapping=function() {
return this.i_swapping;
}
PopoutWindow.createObject=function(name) {
return new window[name]();
}
function PopoutWindowObject() {
}
PopoutWindowObject.prototype.loadContent=function(content) {
this.i_window=new WindowObject("main-window", "Window", 100, 100);
EventHandler.register(this.i_window, "oncontentresize", PopupCore.popup_window_ref.handleBrowserPopupResize, PopupCore.popup_window_ref);
this.i_window.loadContent(content);
PopupCore.fixSize();
};
PopoutWindowObject.prototype.displaySimpleClick=function() {
this.i_sc=new SimpleClick();
this.i_sc_window=new WindowObject("con-sc", "SimpleClick", 100, 100);
EventHandler.register(this.i_sc_window, "oncontentresize", this.i_sc.windowResize, this.i_sc);
this.i_sc_window.loadContent(this.i_sc.getContent());
};
function PopoutDisplay(config) {
this.superPopoutDisplay(config);
}
PopoutDisplay.prototype.superPopoutDisplay=function(config) {
this.i_popoutWindow=config.popoutWindow;
this.i_showToolbar=config.showToolbar;
this.i_windowObject=config.windowObject;
this.i_toolbar=null;
this.i_include_simple_click=false;
this.i_last_state={'set':false};
this.i_last_state_meta={'set':false};
};
PopoutDisplay.prototype.mainWindow=function() {
if(this.i_popoutWindow!==undefined) {
return this.i_popoutWindow.getMainWindow();
}else{
return window;
}
};
PopoutDisplay.prototype.toolbar=function() {
return this.i_toolbar;
};
PopoutDisplay.prototype.handleInternalPop=function(e) {};
PopoutDisplay.prototype.handleExternalPop=function(e) {};
PopoutDisplay.prototype.includeSimpleClick=function(incl) {
if(incl!==undefined) {
this.i_include_simple_click=incl;
}
return this.i_include_simple_click;
}
PopoutDisplay.prototype.getSimpleClick=function() {
if(this.i_popoutWindow.isExternal()) {
if(typeof(PopupCore)!="undefined") {
return PopupCore.simpleClick;
}
}else{
if(ApplicationOldContacts!=undefined && ApplicationOldContacts.getSimpleClick!=undefined && ApplicationOldContacts.getSimpleClick()!=undefined){
return ApplicationOldContacts.getSimpleClick();
}
}
}
PopoutDisplay.prototype.getPopoutButton=function() {
if(this.i_popoutWindow.isExternal()) {
if(this.i_popout_button_external==undefined) {
this.i_popout_button_external=new UniversalButton("Pop In", "ico-popin", 16, undefined, true, undefined, "left", "Pop In");
EventHandler.register(this.i_popout_button_external, "onclick", this.handlePopButtonClick, this);
}
return this.i_popout_button_external;
}else{
if(this.i_popout_button_internal==undefined) {
this.i_popout_button_internal=new UniversalButton("Pop Out", "ico-popout", 16, undefined, true, undefined, "left", "Pop Out");
EventHandler.register(this.i_popout_button_internal, "onclick", this.handlePopButtonClick, this);
}
return this.i_popout_button_internal;
}
};
PopoutDisplay.prototype.handlePopButtonClick=function(e) {
var GP=this.mainWindow().Application.getApplicationById("GP");
GP.param("popout_"+this.i_popoutWindow.getClassName(), (!this.i_popoutWindow.isExternal()==true ? "1" : "0")); 
e.buttonObject.enabled(false);
this.i_popoutWindow.swapPop();
};
PopoutDisplay.prototype.closeWindow=function() {
if(this.i_popoutWindow) {
if(this.i_popoutWindow.isExternal()) {
if ((this.getSimpleClick!=undefined) && (this.getSimpleClick()!=undefined)) {
this.getSimpleClick().cleanup();
}
this.i_popoutWindow.terminateWindow();
window.close();
}else{
if(this.i_windowObject) {
this.i_popoutWindow.terminateWindow();
this.i_windowObject.close();
}	
}
}
}
PopoutDisplay.prototype.windowTitle=function(title) {
if(this.i_popoutWindow && this.i_popoutWindow.isExternal() && window.opener) {
document.title=title;
}else if(this.i_windowObject) {
this.i_windowObject.name(title);
}
}
PopoutDisplay.getDependencies=function() {
return [];
}
JavaScriptResource.notifyComplete("./lib/components/Component.PopOutWindow.js");
function getCookie(name) {
var values=document.cookie.split(";");
var ret=null;
for(var x=0; x < values.length && ret==null; x++) {
var pair=values[x].split("=");
if(decodeCookieValue(pair[0])==" "+name || decodeCookieValue(pair[0])==name) {
ret=decodeCookieValue(pair[1]);
}
}
return ret;
}
function setCookie(name,val,exp,path) {
if (exp) {
document.cookie=encodeCookieValue(name)+"="+encodeCookieValue(val)+"; expires="+exp.toGMTString()+"; path="+path;
} else {
document.cookie=encodeCookieValue(name)+"="+encodeCookieValue(val)+"; path="+path;
}
}
function encodeCookieValue(value) {
return encodeURIComponent(value).replace(".","%2E");
}
function decodeCookieValue(value) {
return decodeURIComponent(value);
}
function BlueTieCookie() {
var cookie=getCookie(user_prefs["user_name"]);
if (cookie) {
this.i_values=cookie.split("&");
} else {
this.i_values=null;
}
}
BlueTieCookie.prototype.getValue=function(key) {
if (!this.i_values) {
return null;
}
var index=this.getIndex(key);
if (index==-1) {
return null;
}
return this.i_values[index].split("=")[1];
}
BlueTieCookie.prototype.setValue=function(key,value) {
if (!this.i_values) {
return;
}
var index=this.getIndex(key);
var pair=key+"="+value;
if (index==-1) {
this.i_values.push(pair);
} else {
this.i_values[index]=pair;
}
setCookie(user_prefs["user_name"],this.i_values.join("&"),null,"/");
}
BlueTieCookie.prototype.getIndex=function(key) {
if (!this.i_values) {
return -1;
}
for (var i=0;i<this.i_values.length;i++) {
var pair=this.i_values[i].split("=");
if (pair[0]==key) {
return i;
}
}
return -1;
}
JavaScriptResource.notifyComplete("./lib/processors/Processor.Cookie.js");
function dateToICal(inDate)
{
var icaldate="";
icaldate=icaldate+inDate.getFullYear();
if (inDate.getMonth() < 9) icaldate=icaldate+"0";
icaldate=icaldate+(inDate.getMonth()+1);
if (inDate.getDate() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getDate()+"T";
if (inDate.getHours() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getHours();
if (inDate.getMinutes() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getMinutes();
if (inDate.getSeconds() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getSeconds()+"Z";
return icaldate;
}
function dateToUTCICal(inDate)
{
var icaldate="";
icaldate=icaldate+inDate.getUTCFullYear();
if (inDate.getUTCMonth() < 9) icaldate=icaldate+"0";
icaldate=icaldate+(inDate.getUTCMonth()+1);
if (inDate.getUTCDate() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCDate()+"T";
if (inDate.getUTCHours() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCHours();
if (inDate.getUTCMinutes() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCMinutes();
if (inDate.getUTCSeconds() < 10) icaldate=icaldate+"0";
icaldate=icaldate+inDate.getUTCSeconds()+"Z";
return icaldate;
}
function iCaltoDate(icalDate)
{
if (icalDate) {
if (icalDate.length==16) {
if (icalDate.substring(15)=="Z")
{
var d=new Date(icalDate.substring(0,4),
icalDate.substring(4,6)-1,
icalDate.substring(6,8),
icalDate.substring(9,11),
icalDate.substring(11,13),
icalDate.substring(13,15), 0);
if (d==null) {
d=new Date();
d.setTime(0);
}
return d;
}
}
}
return null;
}
function iCaltoUTCDate(icalDate)
{
if (icalDate) {
if (icalDate.length==16) {
if (icalDate.substring(15)=="Z")
{
var d=new Date(Date.UTC(icalDate.substring(0,4),
icalDate.substring(4,6)-1,
icalDate.substring(6,8),
icalDate.substring(9,11),
icalDate.substring(11,13),
icalDate.substring(13,15), 0));
if (d==null) {
d=new Date();
d.setTime(0);
}
return d;
}
}
}
return null;
}
function floorHour(date) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
date.getHours(), 0, 0, 0);
}
function floorDay(date) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
0, 0, 0, 0);
}
function floorHybridDay(date) {
return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 
date.getDate(), 0, 0, 0, 0));
}
function floorMonth(date) {
return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}
function addDay(date) {
return addDays(date, 1);
}
function addDays(date, num) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate()+num,
date.getHours(), date.getMinutes(), date.getSeconds(), 
date.getMilliseconds());
}
function addHour(date) {
return addHours(date, 1);
}
function addHours(date, num) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
date.getHours()+num, date.getMinutes(), date.getSeconds(), 
date.getMilliseconds());
}
function addRealHours(date, num) {
return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
date.getUTCDate(), date.getUTCHours()+num, date.getUTCMinutes(), 
date.getUTCSeconds(), date.getUTCMilliseconds()));
}
function addMinutes(date, num) {
return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
date.getHours(), date.getMinutes()+num, date.getSeconds(),
date.getMilliseconds());
}
function addRealMinutes(date, num) {
return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()+num, 
date.getUTCSeconds(), date.getUTCMilliseconds()));
}
function addMonth(currentDate) {
return addMonths(currentDate, 1);
}
function addMonths(date, num) {
return new Date(date.getFullYear(), date.getMonth()+num, date.getDate(),
date.getHours(), date.getMinutes(), date.getSeconds(), 
date.getMilliseconds());
}
function addYear(date) {
return addYears(date, 1);
}
function addYears(date, years) {
return new Date(date.getFullYear()+years, date.getMonth(), date.getDate(),
date.getHours(), date.getMinutes(), date.getSeconds(),
date.getMilliseconds());
}
function ceilHour(date) {
var ret=date;
if(date.getMinutes() > 0) {
ret=addMinutes(date, 60);
}
return floorHour(ret);
}
function getWeekStartDate(start_day, date) {
var adjustedStartDay=new Date(date);
var adjStartDay=date.getDay()+1;
var dateDiff=Math.abs(adjStartDay - start_day);
if(adjStartDay!=start_day) {
if(start_day < adjStartDay) {
adjustedStartDay=addDays(date, -dateDiff);
} else {
adjustedStartDay=addDays(date, dateDiff - 7);
}
}
return adjustedStartDay;
}
function getDayDiff(first, second) {
return Math.floor(getMinuteDiff(first, second) / 1440);
}
function getHourDiff(first, second) {
return Math.floor(getMinuteDiff(first, second) / 60);
}
function getMinuteDiff(first, second) {
return Math.floor((first.valueOf() - second.valueOf()) / 60000)+second.getTimezoneOffset() - first.getTimezoneOffset();
}
function getUnadjustedHourDiff(first, second) {
return Math.floor(getUnadjustedMinuteDiff(first, second) / 60);
}
function getUnadjustedMinuteDiff(first, second) {
return Math.floor((first.valueOf() - second.valueOf()) / 60000);
}
function getDayName(date, short) {
var ret;
var short_days=Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
var long_days=Array("Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday");
if(short) {
ret=short_days[date.getDay()];
} else {
ret=long_days[date.getDay()];
}
return ret;
}
function getMonthName(date, short) {
var ret;
var short_months=Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
"Aug", "Sep", "Oct", "Nov", "Dec");
var long_months=Array("January", "February", "March", "April", "May",
"June", "July", "August", "September", "October", "November",
"December");
if(short) {
ret=short_months[date.getMonth()];
} else {
ret=long_months[date.getMonth()];
}
return ret;
}
function getUTCString(date) {
var os=Math.abs(date.getTimezoneOffset());
var h=""+Math.floor(os/60);
var m=""+(os%60);
h.length==1? h="0"+h:1;
m.length==1? m="0"+m:1;
return date.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
}
function getTimeString(date) {
if (date==undefined) {
return "";
}
var hours=date.getHours();
var ampm="";
var mins=fillZeros(date.getMinutes());
if(user_prefs['time_prefs']!="%H:%M") {
ampm=(hours < 12 ? " AM" : " PM");
hours=hours % 12;
if(hours==0) {
hours=12;
}
}
return hours+":"+mins+ampm;
}
function getFullDateString(date, short_month, short_day) {
var ret=getDayName(date, short_day);
if(short_day) {
ret+=".";
}
ret+=", "+getDateString(date, short_month);
return ret;
}
function getDateString(date, short_month) {
var ret="";
if(user_prefs['date_prefs']=="%m/%d/%Y") {
ret+=getMonthName(date, short_month);
if(short_month) {
ret+=".";
}
ret+=" "+date.getDate();
} else {
ret+=date.getDate()+" "+getMonthName(date, short_month);
if(short_month) {
ret+=".";
}
}
ret+=", "+date.getFullYear();
return ret;
}
function getNumericDateString(date) {
if (date==undefined) {
return "";
}
var month=fillZeros(date.getMonth()+1);
var day=fillZeros(date.getDate());
var ret;
if(user_prefs['date_prefs']=="%m/%d/%Y") {
ret=month+"/"+day+"/"+date.getFullYear();
} else {
ret=day+"/"+month+"/"+date.getFullYear();
}
return ret;
}
function getDateTimeString(date, short_month) {
return getTimeString(date)+", "+getDateString(date, short_month);
}
function getFullDateTimeString(date, short_month, short_day) {
return getTimeString(date)+", "+getFullDateString(date, short_month,
short_day);
}
function getMonthString(date, short_month) {
var ret=getMonthName(date, short_month);
if(short_month) {
ret+=".";
}
ret+=" "+date.getFullYear();
return ret;
}
function createDateFromStrings(date, time) {
function containsLetters(string) {
string=string.toUpperCase();
for(var i=0; i<string.length; i++) {
var c=string.charCodeAt(i);
if ((c >=65) && (c <=90)) {
return true;
}
}
return false;
}
function getCharType(thechar) {
if ((thechar==null) || (thechar=="")) {
return "eol"; 
}
var charCode=thechar.charCodeAt(0);
if ((charCode >=48) && (charCode <=57)) {
return "n"; 
} else if (charCode==32) {
return "s"; 
} else if (charCode==58) {
return "c"; 
} else if ((charCode==65) || (charCode==97)) {
return "a"; 
} else if ((charCode==80) || (charCode==112)) {
return "p"; 
} else if (charCode==47) {
return "fs"; 
} else {
return "e"; 
}
}
var ret=null;
var indate=date;
var intime=time.toUpperCase();
var date_format=user_prefs['date_prefs'];
var finished=false; 
var state="start"; 
var currentPosition=0; 
var currentCharacter=""; 
var month="";
var day="";
var year="";
var error=false;
var y2k_break=100;
var todays_date=new Date();
var this_year=(todays_date.getYear()<1000)?(todays_date.getYear()+1900):todays_date.getYear(); 
while (indate.indexOf('.') > -1) {
indate=indate.replace('.', '/');
}
while (indate.indexOf('-') > -1) {
indate=indate.replace('-', '/');
}
if (containsLetters(indate)) {
if (indate.indexOf(",")==-1) {
indate=indate+", "+this_year;
}
var jscript_date=new Date(indate);
if (!(isNaN(jscript_date))) {
month=parseInt(jscript_date.getMonth()+1);
day=jscript_date.getDate();
year=(jscript_date.getYear()<1000)?(jscript_date.getYear()+1900):jscript_date.getYear();
finished=true;
}
}
while (!(finished)) {
switch (state) {
case 'start':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
if (date_format=="%d/%m/%Y") {
day=day+currentCharacter;
state="day";
} else {
month=month+currentCharacter;
state="month";
}
break;
case 'fs':
error=true;
finished=true;
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
error=true;
finished=true;
break;
}
break;
case 'month':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
month=month+currentCharacter;
break;
case 'fs':
if (date_format=="%d/%m/%Y")
state="year";
else
state="day";
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
if (date_format=="%d/%m/%Y") {
year=this_year;
finished=true;
} else {
error=true;
finished=true;
}
break;
}
break;
case 'day':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
day=day+currentCharacter;
break;
case 'fs':
if (date_format=="%d/%m/%Y")
state="month";
else
state="year";
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
if (date_format=="%d/%m/%Y") {
error=true;
finished=true;
} else {
year=this_year;
finished=true;
}
break;
}
break;
case 'year':
currentCharacter=indate.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
year=year+currentCharacter;
break;
case 'fs':
error=true;
finished=true;
break;
case 's':
break;
case 'e' || 'c' || 'a' || 'p':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
}
}
if(((month > 12) || (month.length > 2)) ||
((day > 31) || (day.length > 2)) ||
(year.length > 4)) {
error=true;
}
if (!error) {
if (year.length==1)
{
if(year < y2k_break)
{
year="200"+year;
}
else
{
year="190"+year;
}
}
else if (year.length==2)
{
if(year < y2k_break)
{
year="20"+year;
}
else
{
year="19"+year;
}
}
month=""+month;
day=""+day;
month=month.replace(/^0/g, "");
day=day.replace(/^0/g, "");
var final_date=new Date(fillZeros(month)+"/"+fillZeros(day)+"/"+fillZeros(year));
if(!isNaN(final_date) && (final_date.getMonth()+1==parseInt(month)))
{
ret=final_date;
}
else {
error=true;
}
}
if(!error) {
finished=false; 
state="start"; 
currentPosition=0; 
currentCharacter=""; 
var hour="";
var minute="";
var afternoon=null;
while (!(finished)) {
switch (state) {
case 'start':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
hour=hour+currentCharacter;
state="hour";
break;
case 's':
break;
case 'c':
hour="0";
state="minute";
break;
case 'a':
error=true;
finished=true;
break;
case 'p':
error=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
error=true;
finished=true;
break;
}
break;
case 'hour':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
hour=hour+currentCharacter;
break;
case 's':
break;
case 'c':
state="minute";
break;
case 'a':
afternoon=false;
finished=true;
break;
case 'p':
afternoon=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
case 'minute':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
minute=minute+currentCharacter;
break;
case 's':
break;
case 'c':
state="second";
break;
case 'a':
afternoon=false;
finished=true;
break;
case 'p':
afternoon=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
case 'second':
currentCharacter=intime.charAt(currentPosition); 
currentPosition+=1;
switch (getCharType(currentCharacter)) {
case 'n':
break;
case 's':
break;
case 'c':
error=true;
finished=true;
break;
case 'a':
afternoon=false;
finished=true;
break;
case 'p':
afternoon=true;
finished=true;
break;
case 'e' || 'fs':
error=true;
finished=true;
break;
case 'eol':
finished=true;
break;
}
break;
}
}
if ((hour > 24) || (minute > 59)) { 
error=true;
}
if(parseInt(hour) < 12 && afternoon!=null && afternoon) {
hour=""+(parseInt(hour)+12);
}
if(parseInt(hour)==12 && afternoon!=null && !afternoon) {
hour="0";
}
if (!error) {
if (minute=="") { minute="0"; } 
ret.setHours(hour);
ret.setMinutes(minute);
} else {
ret=null;
}
}
return ret;
}
function getNumberName(num) {
var ret=num;
if(num % 10==1 && num % 100!=11) {
ret+="st";
} else if(num % 10==2 && num % 100!=12) {
ret+="nd";
} else if(num % 10==3 && num % 100!=13) {
ret+="rd";
} else {
ret+="th";
}
return ret;
}
Array.prototype.exists=function (x) {
for (var i=0; i < this.length; i++) {
if (this[i]==x) return true;
}
return false;
}
Date.prototype.inclusiveDays=function(endDate, rangeBegin, rangeEnd) {
if (endDate==undefined || typeof endDate!="object") {
return [[this, this]];
}
var results=[];
var start=(rangeBegin && this.valueOf() < rangeBegin.valueOf() ? rangeBegin : new Date(this));
var end=(rangeEnd && endDate.valueOf() > rangeEnd.valueOf() ? rangeEnd : new Date(endDate));
if (start.valueOf() > end.valueOf() || 
(rangeEnd && start.valueOf()==rangeEnd.valueOf()) ||
(rangeBegin && end.valueOf()==rangeBegin.valueOf()
&& this.valueOf()!=rangeBegin.valueOf())) {
return results;
}
var dayEnd=new Date(start.getFullYear(), start.getMonth(), start.getDate()+1, 0, 0, 0, 0);
if (dayEnd.valueOf() > end.valueOf()) dayEnd=end;
while (start.valueOf() <=dayEnd.valueOf()) {
results.push([new Date(start), new Date(dayEnd)]);
if (dayEnd.valueOf()==end.valueOf()) break;
start.setDate(start.getDate()+1);
start.setHours(0);
start.setMinutes(0);
start.setSeconds(0);
start.setMilliseconds(0);
dayEnd.setDate(dayEnd.getDate()+1);
dayEnd.setHours(0);
dayEnd.setMinutes(0);
dayEnd.setSeconds(0);
dayEnd.setMilliseconds(0);
if (dayEnd.valueOf() > end.valueOf()) dayEnd=end;
}
return results;
}
Date.prototype.copy=function(date_only) {
var d=new Date(this.valueOf());
if (date_only==true) {
d.setMinutes(0);
d.setHours(0);
d.setSeconds(0);
d.setMilliseconds(0); 
}
return d;
}
Date.prototype.formatDate=function (input,time) {
var switches=["a", "A", "B", "d", "D", "F", "g", "G", "h", "H",
"i", "j", "l", "L", "m", "M", "n", "O", "r", "s",
"S", "t", "U", "w", "W", "y", "Y", "z"];
var daysLong=["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"];
var daysShort=["Sun", "Mon", "Tue", "Wed",
"Thu", "Fri", "Sat"];
var monthsShort=["Jan", "Feb", "Mar", "Apr",
"May", "Jun", "Jul", "Aug", "Sep",
"Oct", "Nov", "Dec"];
var monthsLong=["January", "February", "March", "April",
"May", "June", "July", "August", "September",
"October", "November", "December"];
var daysSuffix=["st", "nd", "rd", "th", "th", "th", "th", 
"th", "th", "th", "th", "th", "th", "th", 
"th", "th", "th", "th", "th", "th", "st", 
"nd", "rd", "th", "th", "th", "th", "th", 
"th", "th", "st"];												
function a() {
return self.getHours() > 11? "pm" : "am";
}
function A() {
return self.getHours() > 11? "PM" : "AM";
}
function B(){
var off=(self.getTimezoneOffset()+60)*60;
var theSeconds=(self.getHours() * 3600)+(self.getMinutes() * 60)+self.getSeconds()+off;
var beat=Math.floor(theSeconds/86.4);
if (beat > 1000) beat -=1000;
if (beat < 0) beat+=1000;
if ((""+beat).length==1) beat="00"+beat;
if ((""+beat).length==2) beat="0"+beat;
return beat;
}
function d() {
return new String(self.getDate()).length==1?
"0"+self.getDate() : self.getDate();
}
function D() {
return daysShort[self.getDay()];
}
function F() {
return monthsLong[self.getMonth()];
}
function g() {
return self.getHours() > 12? self.getHours()-12 : (self.getHours()==0? self.getHours()+12 : self.getHours());
}
function G() {
return self.getHours();
}
function h() {
if (self.getHours() > 12) {
var s=new String(self.getHours()-12);
return s.length==1?
"0"+(self.getHours()-12) : self.getHours()-12;
} else {
var s=new String(self.getHours());
return s.length==1?
"0"+self.getHours() : self.getHours();
}
}
function H() {
return new String(self.getHours()).length==1?
"0"+self.getHours() : self.getHours();
}
function i() {
return new String(self.getMinutes()).length==1?
"0"+self.getMinutes() : self.getMinutes();
}
function j() {
return self.getDate();
}
function l() {
return daysLong[self.getDay()];
}
function L() {
var y_=Y();
if ((y_ % 4==0 && y_ % 100!=0) ||
(y_ % 4==0 && y_ % 100==0 && y_ % 400==0)) {
return 1;
} else {
return 0;
}
}
function m() {
return self.getMonth() < 9?
"0"+(self.getMonth()+1) :
self.getMonth()+1;
}
function M() {
return monthsShort[self.getMonth()];
}
function n() {
return self.getMonth()+1;
}
function O() {
var os=Math.abs(self.getTimezoneOffset());
var h=""+Math.floor(os/60);
var m=""+(os%60);
h.length==1? h="0"+h:1;
m.length==1? m="0"+m:1;
return self.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
}
function r() {
var r; 
r=D()+", "+j()+" "+M()+" "+Y()+" "+H()+":"+i()+":"+s()+" "+O();
return r;
}
function S() {
return daysSuffix[self.getDate()-1];
}
function s() {
return new String(self.getSeconds()).length==1?
"0"+self.getSeconds() : self.getSeconds();
}
function t() {
if (n()-1==1) return 28+L(); 
switch ((n()-1) % 2) { 
case 0 : return 31; break;
default : return 30;
}
}
function U() {
return Math.round(self.getTime()/1000);
}
function W() {
var beforeNY=364+L() - z();
var afterNY=z();
var weekday=w()!=0?w()-1:6; 
if (beforeNY <=2 && weekday <=2-beforeNY) {
return 1;
}
var ny=new Date("January 1 "+Y()+" 00:00:00");
var nyDay=ny.getDay()!=0?ny.getDay()-1:6;
if ((afterNY <=2) &&
(nyDay >=4)	&&
(afterNY >=(6-nyDay))) {
var prevNY=new Date("December 31 "+(Y()-1)+" 00:00:00");
return prevNY.formatDate("W");
}
if (nyDay <=3) {
return 1+Math.floor((z()+nyDay) / 7);
} else {
return 1+Math.floor((z() - (7 - nyDay)) / 7);
}
}
function w() {
return self.getDay();
}
function Y() {
if (self.getFullYear) {
var newDate=new Date("January 1 2001 00:00:00 +0000");
var x=newDate .getFullYear();
return self.getFullYear();
}
var x=self.getYear();
var y=x % 100;
y+=(y < 38) ? 2000 : 1900;
return y;
}
function y() {
var y=Y()+"";
return y.substring(y.length-2,y.length);
}
function z() {
var t=new Date("January 1 "+Y()+" 00:00:00");
var diff=self.getTime() - t.getTime();
return Math.floor(diff/1000/60/60/24);
}
var self=this;
if (time) {
var prevTime=self.getTime();
self.setTime(time);
}
var ia=input.split("");
var ij=0;
while (ia[ij]) {
if (ia[ij]=="\\") {
ia.splice(ij,1);
} else {
if (switches.exists(ia[ij])) {
ia[ij]=eval(ia[ij]+"()");
}
}
ij++;
}
if (prevTime) {
self.setTime(prevTime);
}
return ia.join("");
}
JavaScriptResource.notifyComplete("./lib/processors/Processor.Date.js");
PopoutWindow.registerGroup("DimensionProcessor",["DimensionProcessor",
"DimensionResponse",
"DimensionResponseNode",
"DimensionProcessorNode"]);
function DimensionProcessor(maximum) {
this.i_maximum=maximum;
this.i_nodes=Array();
this.i_calculated=false;
this.i_return;
}
DimensionProcessor.prototype.maximum=function(newMax) {
if (newMax!=undefined) {
this.i_maximum=newMax;
this.i_calculated=false;
}
return this.i_maximum;
}
DimensionProcessor.prototype.addNode=function(minimum, actual, ratio, desired) {
if (desired==undefined) {
desired=0;
}
this.i_nodes[this.i_nodes.length]=new DimensionProcessorNode(minimum, actual, ratio, desired);
this.i_calculated=false;
return this.i_nodes[this.i_nodes.length - 1];
}
DimensionProcessor.prototype.removeNode=function(node) {
for (var x=0; x < this.nodes().length; x++) {
if (this.node(x)==node) {
this.i_nodes.splice(x, 1);
this.i_calculated=false;
return true;
}
}
return false;
}
DimensionProcessor.prototype.nodes=function() {
return this.i_nodes;
}
DimensionProcessor.prototype.node=function(index) {
return this.i_nodes[index];
}
DimensionProcessor.prototype.normalize=function() {
var totalRatio=0;
for (var x=0; x < this.nodes().length; x++) {
totalRatio+=this.node(x).ratio;
}
if (totalRatio > 0 && totalRatio!=1) {
for (var x=0; x < this.nodes().length; x++) { 
this.node(x).ratio=(this.node(x).ratio / totalRatio);
}
this.i_calculated=false;
return true;	
}
return false;
}
DimensionProcessor.prototype.validate=function(verbose) {
var passed=true;
var ret=this.calculate();
var nodeTotal=0;
var ratTotal=0;
for (var x=0; x < ret.nodes.length; x++) {
nodeTotal+=ret.nodes[x].value;
ratTotal+=ret.nodes[x].ratio;
}
if (nodeTotal!=ret.maximum) {
if (verbose) {
alert('There was an error loading the application. Please referesh your browser window to continue.');
}
passed=false;
}
if (ratTotal!=0 && ratTotal!=1) {
if (verbose) {
alert('There was an error loading the application. Please referesh your browser window to continue.');
}
passed=false;
}
}
DimensionProcessor.prototype.reserved=function() {
var ret=0;
for (var x=0; x < this.nodes().length; x++) {
ret+=this.node(x).minimum;		
}	
return ret;
}
DimensionProcessor.prototype.toString=function() {
var str="Maximum: "+this.maximum()+"\n\n";
for (var x=0; x < this.nodes().length; x++) {
str+="Node: min["+this.node(x).minimum+"], cur["+this.node(x).actual+"], rat["+this.node(x).ratio+"], des["+this.node(x).desired+"]\n";
}
return str;
}
DimensionProcessor.prototype.calculate=function() {
if (!this.i_calculated) {
var reserved=this.reserved();
var total=(reserved > this.maximum() ? reserved : this.maximum());
var working=total - reserved;
this.i_return=new DimensionResponse(total);
var nodeExcess=Array();
var values=Array();
var ratioNodeCount=0;
for (var x=0; x < this.nodes().length; x++) {
if (this.node(x).ratio==0) {
if (this.node(x).actual < this.node(x).minimum) {
this.node(x).actual=this.node(x).minimum;
}
if (this.node(x).actual - this.node(x).minimum > working) {
values[x]=(this.node(x).minimum+working);
nodeExcess[x]=working;
working=0;
}
else {
values[x]=this.node(x).actual;
nodeExcess[x]=(this.node(x).actual - this.node(x).minimum);
working-=nodeExcess[x];
}
reserved-=this.node(x).minimum;
}
else {
ratioNodeCount++;
}	
}
working+=reserved;
var allocated=0;
var freeSpace=working;
if (ratioNodeCount > 0) {
var finished=false;	
var skip=Array();	
var value_overflow=0;	
while (!finished) {
if(value_overflow > 0) {
ratioNodeCount=0;
for(var x=this.nodes().length - 1; x >=0; x--) {
if(!skip[x] && this.node(x).ratio > 0) {
ratioNodeCount++;
}
}
var additional_node_ratio=value_overflow / ratioNodeCount;
for(var x=this.nodes().length - 1; x >=0; x--) {
if(!skip[x] && this.node(x).ratio > 0) {
this.node(x).ratio+=additional_node_ratio;
}
}
value_overflow=0;
}
allocated=0;
for (var x=this.nodes().length - 1; x >=0; x--) {
if (x==this.nodes().length - 1) {
finished=true;
}
if (!skip[x]) {
if (this.node(x).ratio > 0) {
if (this.node(x).ratio * working >=this.node(x).minimum) {
values[x]=(this.node(x).ratio * working);
allocated+=Math.floor(values[x]);
}
else {
values[x]=this.node(x).minimum;
value_overflow=this.node(x).ratio;
working-=values[x];
skip[x]=true;
finished=false;
break;
}
}
else {
skip[x]=true;
}
}
}
}
}
else {
var dist=(working / this.nodes().length);
for (var x=0; x < this.nodes().length; x++) { 
values[x]+=dist;
allocated+=dist;
}
}
var extra_space=working - allocated;
if(extra_space > 0) {
for(var x=this.nodes().length - 1; x >=0; x--) {
if(!skip[x] && this.node(x).ratio > 0) {
values[x]=Math.floor(values[x])+extra_space;
break;
}
}
}
for (var x=0; x < this.nodes().length; x++) { 
if (this.node(x).desired!=0) {
if (this.node(x).desired <=this.node(x).minimum) {
this.node(x).desired=this.node(x).minimum;
}
var wanted=this.node(x).desired - values[x];	
var found=0;
for (var z=x+1; z < this.nodes().length; z++) {
if (values[z] - wanted >=this.node(z).minimum) {
if ((this.node(z).ratio==0 && this.node(x).ratio!=0) ||
(this.node(z).ratio!=0 && this.node(x).ratio==0)) {
freeSpace+=(this.node(z).ratio==0 ? wanted : (wanted * -1));
}
values[z]-=wanted;
found+=wanted;
wanted=0;
break;
}
else {
var adjDiff=values[z] - this.node(z).minimum;
if ((this.node(z).ratio==0 && this.node(x).ratio!=0) ||
(this.node(z).ratio!=0 && this.node(x).ratio==0)) {
freeSpace+=(this.node(z).ratio==0 ? adjDiff : (adjDiff * -1));
}
found+=adjDiff;
values[z]=this.node(z).minimum;
wanted-=adjDiff;
}
}
values[x]+=found;					
break;
}
}
for (var x=0; x < this.nodes().length; x++) {
var ratio=0;
if (this.node(x).isRatio) {
ratio=(values[x] / freeSpace);
}
this.i_return.nodes[this.i_return.nodes.length]=new DimensionResponseNode(Math.floor(values[x]), ratio);
}
}
return this.i_return;
}
function DimensionResponse(maximum) {
this.maximum=maximum;
this.nodes=Array();
}
DimensionResponse.prototype.toString=function() {
var str="Maximum: "+this.maximum+"\n\n";
for (var x=0; x < this.nodes.length; x++) {
str+="Node: "+this.nodes[x].value+" ("+this.nodes[x].ratio+")\n";
}
return str;
}
function DimensionResponseNode(value, ratio) {
this.value=value;
this.ratio=ratio;
}
function DimensionProcessorNode(min, act, rat, des) {
this.minimum=min;
this.actual=act;
this.ratio=rat;
this.desired=des;
this.isRatio=((rat!=undefined && rat > 0) ? true : false);
}
JavaScriptResource.notifyComplete("./lib/processors/Processor.DimensionProcessor.js");
function htmlEncode(string) {
var ret="";
if (string!=null) {
ret=string.replace(/&/g, "&amp;");
ret=ret.replace(/</g, "&lt;");
ret=ret.replace(/>/g, "&gt;");
ret=ret.replace(/\"/g, "&quot;" );
	  }
	  return ret;
	}

	/**
	 *	UnSanitize a string with HTML characters in it such as
	 *	&, <, >, and "
*
*	@param string String to UnSanitize
*
*	@return {String} UnSanitized string
*/
function htmlUnencode(string) {
if (string!=null) {
var ret=string.replace(/&lt;/g, "<");
ret=ret.replace(/&gt;/g, ">");
ret=ret.replace(/&quot;/g, "\"");
ret=ret.replace(/&nbsp;/g, " ");
ret=ret.replace(/&amp;/g, "&");
return ret;
}
}
function htmlUnencodeExtended(string) {
if(string!=null && string.length > 0) {
var ret="";
var chars=string.split("&#");
var start=1;
if(string.indexOf("&#") >=0) {
ret+=chars[0];
} else {
start=0;
}
for(var x=start; x < chars.length; x++) {
if(chars[x].match(/^\d+;/)) {
var index=chars[x].indexOf(";");
var code=parseInt(chars[x].substr(0, index));
if(code > 100) {
ret+=String.fromCharCode(code);
}
ret+=chars[x].substr(index+1);
} else {
ret+=chars[x];
}
}
return htmlUnencode(ret);
}
}
JavaScriptResource.notifyComplete("./lib/processors/Processor.HTMLEncode.js");
function inherit(parent, child) {
for(var m in parent.prototype) {
if(child.prototype[m]==undefined && m.substr(0, 2)!="i_") {
child.prototype[m]=parent.prototype[m];
}
}
}
JavaScriptResource.notifyComplete("./lib/processors/Processor.Inheritance.js");
function trim(value) {
return value.replace(/^\s*(.*?)\s*$/, "$1");
}
function fillZeros(value) {
var ret=value;
if(value < 10) {
ret="0"+ret;
}
return ret;
}
function wrapLongLine(value,width) {
if (value.length < width) {
return value;
}
var result=new String;
for (var i=0;i<value.length;i+=width) {
var substr=null;
if (i+width < value.length) {
substr=value.substring(i,i+width);
} else {
substr=value.substring(i);
}
result=result.concat("\n",substr);
}
return result;
}
function wrapLongWords(text, width, containerClass) {
var strings=[];
var newStrings=[];
var lastWord=[];
for(var i=0; i < text.length; i++) {
if(text.charAt(i)==" ") {
if(lastWord.length > 0) { strings.push(lastWord.join("")); }
lastWord=[];
}
lastWord.push(text.charAt(i));
}
if(lastWord.length > 0) { strings.push(lastWord.join("")); }
var log=[];
for(var x=0; x < strings.length; x++) {
var curString=strings[x];
var newString="";
var t=TextDimension(curString, containerClass, width);
if(parseInt(t.width) > parseInt(width)) {
var end=curString.length;
var start=0;
var pos=end / 2;
var lastPos=0;
newString=BreakString(curString, pos);
var tmp=TextDimension(newString, containerClass, width);
while(parseInt(tmp.width)!=parseInt(width)) {
if(parseInt(tmp.width) > parseInt(width)) {
end=pos - 1;
}else{
start=pos+1;
}
lastPos=pos;
pos=Math.floor((start+end) / 2);
if(lastPos==pos) {
break;
}
newString=BreakString(curString, pos);
tmp=TextDimension(newString, containerClass, width); 
}
newStrings.push(newString);
}else{
newStrings.push(curString);
}
}
return newStrings.join("");
}
function isNumber(value, length) {
var ret=false;
if(value.match(/^[0-9]+$/)) {
if(length!=undefined) {
if(value.length <=length) {
ret=true;
}
} else {
ret=true;
}
}
return ret;
}
function isEmailAddress(address) {
var ret=false;
if(address.match(/^([a-zA-Z0-9\!\#\$\%\'\*\+\-\/\=\?\^\_\`\{\|\}\~]+\.)*[a-zA-Z0-9\!\#\$\%\'\*\+\-\/\=\?\^\_\`\{\|\}\~]+@((([a-zA-Z0-9]+)|([a-zA-Z0-9]+[\-]+[a-zA-Z0-9]+))\.)+[a-zA-Z]+$/ ) ) {
		ret = true;
	}

	return ret;

}

/**
 *	Convert < to &lt;  and  > to &gt;
 *
 *	@return the converted string, which is now safe to set as the innerHTML of an element
 */
String.prototype.filterHTML = function() {
	var str = this.toString();
	str = str.replace(RegExp("<", "g"), "&lt;");
	str = str.replace(RegExp(">", "g"), "&gt;");
	return str;
}

/**
 *  Resource Manager Notification
 */
JavaScriptResource.notifyComplete("./lib/processors/Processor.String.js");


/*

	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% TipOfTheDay %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

*/
	/**
	 *	TipOfTheDay
	 *	This class provides access to a database of application tips.  You can use this to register new tips, as well as 
	 *	query for existing tips
	 *
	 *	@constructor
	 */
	function TipOfTheDay() {
	
	}
	
	/**
	 *	An array of tips
	 */
	TipOfTheDay.tips = Array();
	
	/**
	 *	Register a new tip of the day
	 *
	 *	@param tip A tip object to add to the tip of the day database
	 *
	 *	@return the tip which was just added
	 */
	TipOfTheDay.registerTip = function(tip) {
		TipOfTheDay.tips[TipOfTheDay.tips.length] = tip;
		return tip;
	}
	
	/**
	 *	Unregister a tip of the day
	 *
	 *	@param tip The tip to unregister 
	 *
	 *	@return true if the tip was unregistered, false otherwise
	 */
	TipOfTheDay.unregisterTip = function(tip) {
		for (var x = 0; x < TipOfTheDay.tips.length; x++) {
			if (TipOfTheDay.tips[x] == tip) {
				TipOfTheDay.tips.splice(x,1);
				return true;
			}
		}
		return false;
	}
	
	/**
	 *	Get a tip with the given index, or all tips if no index is provided
	 *
	 *	@param index (Optional) The index of the tip you want
	 *
	 *	@return the tip at the given index, or all tips if you have not provided an index
	 */
	TipOfTheDay.tip = function(index) {
		if (index != undefined) {
			return TipOfTheDay.i_tips[index];
		}
		return TipOfTheDay.i_tips;
	}
	
	/**
	 *	Get a random tip of the day.  If possible one which has not been used this session
	 *
	 *	@return a random tip object
	 */
	TipOfTheDay.randomTip = function() {

		var t;

		// choose a random tip
		while( !t || t.used() ) {
			t = TipOfTheDay.tips[ Math.floor( Math.random() * 
					TipOfTheDay.tips.length ) ];
		}

		// increment the total number of tips used
		if( TipOfTheDay.tipsUsed == undefined ) {
			TipOfTheDay.tipsUsed = 1;
		} else {
			TipOfTheDay.tipsUsed++;
		}

		// check to see if all tips are used
		if( TipOfTheDay.tipsUsed == TipOfTheDay.tips.length ) {
			if( TipOfTheDay.tips.length == 1 ) {
				// there is only one tip, allow it to be used next time
				t.used( false )
				TipOfTheDay.tipsUsed = 0;
			} else {
				// more than 1 tip, mark all tips but the chosen one as unused
				for( var x = 0; x < TipOfTheDay.tips.length; x++ ) {
					TipOfTheDay.tips[ x ].used( false );
				}
				t.used( true );
				TipOfTheDay.tipsUsed = 1;
			}
		} else {
			// otherwise mark the current tip as used
			t.used( true );
		}

		return t;

	}


/*

	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% TipOfTheDayTip %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

*/
	/**
	 *	TipOfTheDayTip
	 *	This class contains a single tip of the day
	 *
	 *	@constructor
	 *
	 *	@param text The text of the tip
	 */
	function TipOfTheDayTip(text) {
		this.i_text = text;
		this.i_used = false;
	}
	
	/**
	 *	Get/Set whether this tip has been used already
	 *
	 *	@param state (Optional) True if the tip has been used already, false otherwise
	 *
	 *	@return the current used state of this tip.
	 */
	TipOfTheDayTip.prototype.used = function(state) {
		if (state != undefined) {
			this.i_used = state;
		}
		return this.i_used;
	}
	
	/**
	 *	Get/Set the text associated with this tip
	 *
	 *	@param text (Optional) The new text to assign to this tip
	 *
	 *	@return the current tip text of this tip
	 */
	TipOfTheDayTip.prototype.text = function(text) {
		if (text != undefined) {
			this.i_text = text;
		}
		return this.i_text;
	}
	
	
/*

	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Register Tips Of The Day %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

*/
	
	TipOfTheDay.registerTip(new TipOfTheDayTip("You can adjust the size of each window by clicking and dragging on the borders between them.")); 
	TipOfTheDay.registerTip(new TipOfTheDayTip("You can minimize windows by clicking on the minimize icon in the windows upper right corner.")); 
	TipOfTheDay.registerTip(new TipOfTheDayTip("You can resize the columns in any list by clicking on the left side border of the column header, and dragging.")); 
	TipOfTheDay.registerTip(new TipOfTheDayTip("You can reorder columns in any list by dragging the header to the desired location.")); 
	TipOfTheDay.registerTip(new TipOfTheDayTip("You can hide and show additional columns in any list by right-clicking on any list header.")); 
//	TipOfTheDay.registerTip(new TipOfTheDayTip("You can undock windows and drag them around freely by clicking on the 'undock' icon in the upper right corner of every window.  This same button can be used to redock the windows when you are done.")); 




/**
 *	Resource Manager Notification
 */
JavaScriptResource.notifyComplete("./lib/processors/Processor.TipOfTheDay.js");

/**
 * Retrieve the specified tag value from the element.
 *
 * @param element A document element.
 * @param name The name of the tag to retrieve the value for.
 *
 * @return The value of the tag if found, or undefined if not.
 */
function getXMLValue( element, name ) {

	var ret = undefined;

	if( element != undefined ) {

		var elem_list;

		if( name != undefined ) {
			elem_list = element.getElementsByTagName( name );
		} else {
			elem_list = element;
		}

		if( elem_list != undefined && elem_list.length > 0 ) {
			if( elem_list[ 0 ].firstChild != undefined ) {
				if( document.all ) {
					ret = elem_list[ 0 ].firstChild.data;
				}else{
					//mozilla's xml parser splits long strings (over 4096 chars) into multiple text nodes -- lets just grab them all
ret=elem_list[0].textContent;
}
} else {
ret="";
}
}
}
return ret;
}
function getXMLValueOrDefault(element,name,defaultVal)
{
var value=getXMLValue(element,name);
return value ? value : defaultVal;
}
function getXMLTagData(xml, tag) {
if(xml) {
var q=xml.getElementsByTagName(tag);
if(q.length > 0) {
return getValue(q[0]);
}
}
return "";
}
function getXMLTagDataArray(xml, tag) {
var q=xml.getElementsByTagName(tag);
var arr=Array();
for(var x=0; x < q.length; x++) {
arr.push(getValue(q[x]));
}
return arr;
}
function getValue(element) {
if(element) {
if(element.textContent) {
return element.textContent;
} else if(element.text) {
return element.text;
} else if(element.innerHTML){
return element.innerHTML;
}
}
return "";
}function XML() {
}
XML.checkResponse=function(response) {
var code=XML.getXMLTagData(response, 'code');
if(code=='20000000') { 
return true;
}else if(code=='20001008'){
sessionTimeout(true, true);
return false;
}else if(code=='20001001') { 
var desc=XML.getXMLTagData(response, 'description');
if(desc) {
if(desc.indexOf('Invalid Session') > -1) {
sessionTimeout(true, true);
}
}
return false;
}else{ 
return false;
}
}
XML.checkResponseSession=function(response) {
var code=XML.getXMLTagData(response, 'code');
if(code=='20001008') {
return false;
}else if(code=='20001001') {
var desc=XML.getXMLTagData(response, 'description');
if(desc) {
if(desc.indexOf('Invalid Session') > -1) {
return false;
}
}
}
return true;
}
XML.getDesc=function(response) {
var code=XML.getXMLTagData(response, 'code');
if(code) {
if(ERROR_CODES[code]) {
return ERROR_CODES[code];
}else{
return "Unknown Error";
}
}
return "Unknown Error";
}
XML.getXMLTagData=getXMLTagData;
XML.getTagData=getXMLTagData;
XML.getXMLTagDataArray=getXMLTagDataArray;
XML.getValue=getValue;
XML.makeTag=function(tagName, val) {
return '<'+tagName+'>'+val+'</'+tagName+'>';
}
JavaScriptResource.notifyComplete("./lib/processors/Processor.XML.js");
function Language() {
for (var x=0; x < Language.i_groups.length; x++) {
this[Language.i_groups[x]]=Array();
}
if (Language.onload!=undefined) {
var o=new Object();
o.type="load";
Language.onload(o);
}
}
Language.onload=null;
Language.i_groups=Array();
Language.addGroup=function(group) {
Language.i_groups[Language.i_groups.length]=group;
return true;
}
Language.load=function(phrase_const) {
if (phrase_const==undefined) {
console.log('Translation attempt on undefined phrase.  Arguments: ', arguments);
}
else {
var cpy=phrase_const;
for (var x=1; x < arguments.length; x++) {
cpy=cpy.replace('{'+x+"}", arguments[x]);
}
return cpy;	
}
}
Language.addGroup("myday");
Language.addGroup("email");
Language.addGroup("contacts");
Language.addGroup("calendar");
Language.addGroup("files");
Language.addGroup("tasks");
Language.addGroup("securesend");
Language.addGroup("enterprisemanager");
Language.addGroup("common");
var lang=new Language();
JavaScriptResource.notifyComplete("./lib/processors/Processor.Language.js"); 
function Application() {
this.superApplication();
}
Application.prototype.superApplication=function() {
this.i_preferences=Array();
this.i_preference_panes=Array();
this.i_init_prefs=false;
this.i_load_count=Array();	
this.i_loaded_files=Array();	
this.i_loading_files=false;
this.i_load_queue=Array();
this.i_displayNameSet=false;
Application.i_applications[Application.i_applications.length]=this;
}
Application.i_applications=Array();
Application.i_poll_minute=0;
Application.getApplicationById=function(id) {
for (var x=0; x < Application.i_applications.length; x++) {
if (Application.i_applications[x].id()==id) {
return Application.i_applications[x];
}
}
return undefined;
}
Application.prototype.oninitialize=null;
Application.prototype.onintegrate=null;
Application.prototype.onload=null;
Application.prototype.onunload=null;
Application.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
Application.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
Application.prototype.displayName=function(displayName) {
if (displayName!=undefined) {
this.i_displayName=displayName;
this.i_displayNameSet=true;
}
if (this.i_displayNameSet){
return this.i_displayName;
} else {
return this.i_name;
}
}
Application.prototype.loadingOrder=function(order) {
if (order!=undefined) {
this.i_order=order;
}
return this.i_order;
}
Application.prototype.smallIcon=function(iconClass) {
if (iconClass!=undefined) {
this.i_small_icon=iconClass;
}
return this.i_small_icon;
}
Application.prototype.largeIcon=function(iconClass) {
if (iconClass!=undefined) {
this.i_large_icon=iconClass;
}
return this.i_large_icon;
}
Application.prototype.registerPreference=function(file_path) {
this.i_preferences[this.i_preferences.length]=file_path;
if (this.i_init_prefs==true) {
ResourceManager.request(file_path, 1);
}
return file_path;
}
Application.prototype.registerPreferencePane=function(pane, beforePane) {
pane.application(this);
var append=true;
if (beforePane!=undefined) {
for (var x=0; x < this.i_preference_panes.length; x++) {
if (this.i_preference_panes[x]==beforePane) {
this.i_preference_panes.splice(x, 0, pane);
if (this.i_preference_section!=undefined) {
this.i_preference_section.addPane(pane, beforePane);
}
append=false;
break;
}
}
}
if (append) {
this.i_preference_panes[this.i_preference_panes.length]=pane;
if (this.i_preference_section!=undefined) {
this.i_preference_section.addPane(pane);
}
}
return pane;
}
Application.prototype.preferenceSection=function() {
if (this.i_preference_section==undefined && this.i_preferences.length > 0) {
this.i_preference_section=new PreferenceSection(this.displayName(), this.name(), this.smallIcon());
for (var x=0; x < this.i_preference_panes.length; x++) {
this.i_preference_section.addPane(this.i_preference_panes[x]);
}
}
return this.i_preference_section;
}
Application.prototype.loadPreferenceFiles=function(index) {
if(!this.i_init_prefs) {
var real_index=index;
if(real_index==undefined) {
real_index=0;
} else {++real_index;
}
while(this.i_preferences[real_index]==undefined  &&
real_index < this.i_preferences.length) {++real_index;
}
if(real_index < this.i_preferences.length) {
ResourceManager.request(this.i_preferences[real_index], 1,
new SmartHandler(this, this.loadPreferenceFiles,
real_index, false, true));
} else {
this.i_init_prefs=true;
if(this.onloadpreferencefiles) {
var o={
"type": "loadpreferencefiles"
};
this.onloadpreferencefiles(o);
}
}
}
}
Application.prototype.getRegistryNode=function() {
if (this.i_reg_node==undefined) {
this.i_reg_node=ApplicationRegistry.getNode(this.name());
if (this.i_reg_node==undefined) {
this.i_reg_node=ApplicationRegistry.addNode(new RegistryNode(this.name()));
}
}
return this.i_reg_node;
}
Application.prototype.param=function(name, value, noAutoSave, sensitive) {
var n=this.getRegistryNode().getNode(name);
if (n==undefined && value==undefined) {
return undefined;
}
else if (n==undefined && value!=undefined) {
n=this.getRegistryNode().addNode(new RegistryNode(name, value, ApplicationRegistry.REGISTRY_SERVER, (sensitive==true ? ApplicationRegistry.REGISTRY_PRIVATE : undefined)));
}
if (value!=undefined) {
n.singleValue(value);
ApplicationRegistry.save();
}
return n.singleValue();
}
Application.prototype.secureParam=function(name, value, noAutoSave) {
return this.param(name, value, noAutoSave, false);
}
Application.prototype.loadFiles=function(list_name, handler, file_num) {
var ret=false;
var file_list=this.i_files[list_name];
if(this.i_load_count[list_name]==undefined) {
if(this.i_loading_files) {
this.i_load_queue.push(new SmartHandler(this, this.loadFiles,
Array(list_name, handler, undefined), true));
} else {
this.i_loading_files=true;
this.i_load_count[list_name]=file_list.length;
}
} else if(file_num!=undefined) {
this.i_loaded_files[file_list[file_num]]=true;
if(this.i_load_count[list_name] > 0) {
this.i_load_count[list_name]--;
}
}
if(this.i_load_count[list_name] > 0) {
var next_file_num=0;
var collision=false;
for(next_file_num=file_list.length - this.i_load_count[list_name]; next_file_num < file_list.length; 
next_file_num++) {
if(this.i_loaded_files[file_list[next_file_num]]) {
this.i_load_count[list_name]--;
} else if(this.i_loaded_files[file_list[next_file_num]]==false) {
collision=true;
this.i_load_queue.push(new SmartHandler(this,
this.loadFiles, Array(list_name, handler,
file_num), true));
} else {
break;
}
}
if(!collision && this.i_load_count[list_name] > 0) {
this.i_loaded_files[file_list[next_file_num]]=false;
ResourceManager.request(file_list[next_file_num], 1,
new SmartHandler(this, this.loadFiles, 
Array(list_name, handler, next_file_num), true, 
true), undefined);
}
}
if(this.i_load_count[list_name]==0) {
if(file_num!=undefined) {
if(handler!=undefined) {
handler.execute();
}
} else {
ret=true;
}
this.i_loading_files=false;
if(this.i_load_queue.length > 0) {
var next_load=this.i_load_queue[0];
this.i_load_queue.splice(0, 1);
next_load.execute();
}
}
return ret;
}
Application.poll=function() {
for(var i=0; i < Application.i_applications.length; i++) {
var application=Application.i_applications[i];
if(application.onpoll) {
var o=new Object();
o.type="poll";
o.minute=Application.i_poll_minute;
o.time=new Date();
application.onpoll(o);
}
}
APIManager.executeQueue();
Application.i_poll_minute++;
}
Application.handleMinimize=function(o_button, o_window, o_event) {
o_window.minimized(!o_window.minimized());
if (o_window.temporary()!=true) {
SystemCore.layoutManager().notifyChange();
}
}
Application.handleDoubleClick=function() {
this.i_window.minimized(!this.i_window.minimized());
if (this.i_window.temporary()!=true) {
SystemCore.layoutManager().notifyChange();
}
}
Application.titleBarFactory=function() {
if (Application.i_titleBarFactory==undefined) {
Application.i_titleBarFactory=new TitleBarFactory(200, 16);
Application.i_title_close=Application.i_titleBarFactory.addButton(new IconButton("IconButton_Close", 9, 9, 16, 16, "Close", function(o_button, o_window, o_event) { 
o_window.close(); 
if (o_window.temporary()!=true) {
SystemCore.layoutManager().notifyChange();
}
}));
Application.i_title_dock=new IconButton("IconButton_Dock", 9, 9, 16, 16, "Dock/Undock Window", function(o_button, o_window, o_event) {
SystemCore.layoutManager().notifyChange();
o_window.docked(!o_window.docked());
});			
Application.i_title_minimize=Application.i_titleBarFactory.addButton(new IconButton("IconButton_Minimize", 9, 9, 16, 16, "Minimize Window", Application.handleMinimize));
Application.i_titleBarFactory.ondblclick=Application.handleDoubleClick;
}
return Application.i_titleBarFactory;
}
Application.prototype.readyToUse=function() {
return true;
}
Application.prototype.launchApplication=function() {
if (this.readyToUse()) {
SystemCore.activeApplication(this);
}
}
JavaScriptResource.notifyComplete("./lib/controllers/Controller.Application.js");
function BasicTable(rows, cols) {
this.i_num_cols=cols;
this.i_num_rows=0;
this.i_table=document.createElement('TABLE');
this.i_tbody=document.createElement('TBODY');
this.i_rows=Array();
this.i_cells=Array();
this.i_cellpadding=0;
this.i_cellspacing=0;
this.i_border=0;
this.i_width=undefined;
this.i_background=undefined;
if(cols!=undefined) {
for(var x=0; x < rows; x++) {
this.addRow();
}
} else {
this.i_num_cols=1;
}
this.setCellPadding(this.i_cellpadding);
this.setCellSpacing(this.i_cellspacing);
this.setBorder(this.i_border);
this.setWidth(this.i_width);
this.setBackground(this.i_background);
this.i_table.appendChild(this.i_tbody);
}
BasicTable.prototype.setCellPadding=function(cellpadding) {
this.i_cellpadding=cellpadding;
this.i_table.cellPadding=cellpadding;
}
BasicTable.prototype.setCellSpacing=function(cellspacing) {
this.i_cellspacing=cellspacing;
this.i_table.cellSpacing=cellspacing;
}
BasicTable.prototype.setWidth=function(width) {
if(width!=undefined) {
this.i_width=width;
this.i_table.width=width;
}
}
BasicTable.prototype.setBorder=function(border) {
this.i_border=border;
this.i_table.border=border;
}
BasicTable.prototype.setBackground=function(background) {
if(background!=undefined) {
this.i_background=background;
this.i_table.style.backgroundColor=background;
}
}
BasicTable.prototype.getContent=function() {
return this.i_table;
}
BasicTable.prototype.getNumRows=function() {
return this.i_num_rows;
}
BasicTable.prototype.getNumCols=function() {
return this.i_num_cols;
}
BasicTable.prototype.mergeCells=function(start_row, start_col, end_row,
end_col) {
if(start_row < this.i_num_rows && end_row < this.i_num_rows &&
start_col < this.i_num_cols && end_col < this.i_num_cols) {
var main_cell=this.i_cells[start_row][start_col];
main_cell.colSpan=(end_col - start_col)+1;
main_cell.rowSpan=(end_row - start_row)+1;
for(var r=start_row; r <=end_row; r++) {
for(var c=start_col; c <=end_col; c++) {
if(r!=start_row || c!=start_col) {
this.i_rows[r].removeChild(this.i_cells[r][c]);
this.i_cells[r][c]=undefined;
this.i_cells[r][c]=main_cell;
}
}
}
}
}
BasicTable.prototype.clear=function() {
if(this.i_num_rows > 0) {
for(var row=0; row < this.i_num_rows; row++) {
for(var col=0; col < this.i_num_cols; col++) {
this.i_cells[row][col]=undefined;
}
this.i_tbody.removeChild(this.i_rows[row]);
this.i_rows[row]=undefined;
}
this.i_cells=Array();
this.i_rows=Array();
this.i_num_rows=0;
}
}
BasicTable.prototype.addRow=function() {
var row=document.createElement('TR');
var cells=Array();
for(var x=0; x < this.i_num_cols; x++) {
var cell=document.createElement('TD');
row.appendChild(cell);
cells.push(cell);
}
this.i_cells.push(cells);
this.i_tbody.appendChild(row);
this.i_num_rows++;
this.i_rows.push(row);
return this.i_num_rows - 1;
}
BasicTable.prototype.getRow=function(row) {
var ret=undefined;
if(row < this.i_num_rows) {
ret=this.i_rows[row];
}
return ret;
}
BasicTable.prototype.getCells=function(row) {
var ret=undefined;
if(row < this.i_num_rows) {
ret=this.i_cells[row];
}
return ret;
}
BasicTable.prototype.getCell=function(row, col) {
var ret=undefined;
if(row < this.i_num_rows && col < this.i_num_cols) {
ret=this.i_cells[row][col];
}
return ret;
}
JavaScriptResource.notifyComplete("./lib/components/Component.BasicTable.js");
PopoutWindow.registerGroup("Button", ["GenericButton",
"LabelButton",
"IconButton",
"IconLabelButton",
"SimpleButton",
"SimpleRadioButton"]);
function GenericButton(width, height, tip_text, callback, buttonFocus) {
this.GenericButtonSuper(width, height, tip_text, callback, buttonFocus);
}
GenericButton.prototype.GenericButtonSuper=function(width, height, tip_text, callback, buttonFocus) {
this.i_id=Math.random();
this.i_width=width;
this.i_height=height;
if (tip_text!=undefined)
this.i_tip=tip_text;
this.i_callback=(callback!="" ? callback : undefined);
this.i_focus=(buttonFocus!="" ? buttonFocus : undefined);
this.i_main_css="GenericButton";
this.i_hover_css;
this.i_enabled=true;
}
GenericButton.prototype.onmousedown=function(e) { }
GenericButton.prototype.hoverBackgroundCSS=function(newClass) {
if (newClass!=undefined) {
this.i_hover_background_css=newClass;
}	
return this.i_hover_background_css;
}
GenericButton.prototype.hoverCSS=function(newClass) {
if (newClass!=undefined) {
this.i_hover_css=newClass;
}	
return this.i_hover_css;
}
GenericButton.prototype.enabled=function(state) {
if (state!=undefined) {
this.i_enabled=state;
if (this.i_button!=undefined) {
if (state) {
this.i_button.style.filter=""; 
if (!document.all) {
this.i_button.style.MozOpacity=""; 
this.i_button.style.opacity=""; 
this.i_button.style.KhtmlOpacity=""; 
}
}
else {
this.i_button.style.filter="alpha(opacity="+30+")";
if (!document.all) {
this.i_button.style.MozOpacity=.3;
this.i_button.style.opacity=.3;
this.i_button.style.KhtmlOpacity=.3;
}
}
}
}
return this.i_enabled;
}
GenericButton.prototype.hide=function() {
this.i_enabled=false;
if(this.i_button!=undefined) {
this.i_button.style.display="none";
}
}
GenericButton.prototype.show=function() {
this.i_enabled=true;
if(this.i_button!=undefined) {
this.i_button.style.display="";
}
}
GenericButton.prototype.copy=function() {
var cpy=new GenericButton(this.width(), this.height(), this.tipText(), this.callback(), this.buttonFocus());
cpy.i_id=this.id();
return cpy;
}
GenericButton.prototype.id=function() {
return this.i_id;
}
GenericButton.prototype.buttonCSS=function(newClass) {
if (newClass!=undefined) {
this.i_main_css=newClass;
if (this.i_button!=undefined) {
this.i_button.className=this.buttonCSS();
}
}
return this.i_main_css;
}
GenericButton.prototype.tipText=function(newText) {
if (newText!=undefined) {
this.i_tip=newText;
if (this.i_button!=undefined) {
if (this.i_tipObj!=undefined) {
this.i_tipObj.tip(newText);
}
else {
this.i_button.alt=this.tipText();
this.i_button.title=this.tipText();
}
}
}
return this.i_tip;
}
GenericButton.prototype.buttonFocus=function(newFocus) {
if (newFocus!=undefined) {
this.i_focus=(newFocus!="" ? newFocus : undefined);
}
return this.i_focus;
}
GenericButton.prototype.left=function() {
var x_pos=0;
if (this.i_button!=undefined) {
chainUp=this.i_button;
while(chainUp!=null) {
x_pos+=parseInt(chainUp.offsetLeft);
chainUp=chainUp.offsetParent;
}
}
return x_pos;
}
GenericButton.prototype.top=function() {
var y_pos=0;
if (this.i_button!=undefined && this.i_button.offsetParent!=null) {
chainUp=this.getButton();
while(chainUp!=null)
{
y_pos+=parseInt(chainUp.offsetTop);
chainUp=chainUp.offsetParent;
}
}
return y_pos;
}
GenericButton.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=newWidth;
if (this.i_button!=undefined) {
this.i_button.style.width=this.width()+"px";
}
}
return this.i_width;
}
GenericButton.prototype.height=function(newHeight) {
if (newHeight!=undefined) {
this.i_height=newHeight;
if (this.i_button!=undefined) {
this.i_button.style.height=this.height()+"px";	
}
}
return this.i_height;
}
GenericButton.prototype.callback=function(newCallback) {
if (newCallback!=undefined) {
this.i_callback=(newCallback!="" ? newCallback : undefined);
}
return this.i_callback;
}
GenericButton.prototype.execute=function(e) {
if (this.enabled()) {
if (this.callback()!=undefined) {
var cb=this.callback();
if(typeof(cb)=="object") {
cb.execute(this, this.buttonFocus(), e);
} else {
cb(this, this.buttonFocus(), e);
}
}
if (this.onmousedown!=undefined) {
if(typeof(this.onmousedown)=="object") {
this.onmousedown.execute(e);
} else {
var o=new Object();
o.type="mousedown";
o.button=this;
this.onmousedown(o);
}
}
if (this.onclick!=undefined) {
var o=new Object();
o.type="click";
o.button=this;
this.onclick(o);
}
}
e.cancelBubble=true;
e.returnValue=false;
return false;
}
GenericButton.handleSelect=function() {
return false;
}
GenericButton.prototype.getButton=function() {
if (this.i_button==undefined) {
this.i_button=document.createElement('DIV');
this.i_button.className=this.buttonCSS();
this.i_button.style.height=this.height()+"px";
this.i_button.style.width=this.width()+"px";
EventHandler.register(this.i_button, "onmousedown", this.execute, this);
this.i_button.alt=this.tipText();
this.i_button.title=this.tipText();
this.i_button.innerHTML+="&nbsp;";
this.i_button.onselectstart=GenericButton.handleSelect;
EventHandler.register(this.i_button, "onmouseover", function() {
this.i_button.className=this.hoverCSS();
}, this);
EventHandler.register(this.i_button, "onmouseout", function() {
this.i_button.className=this.buttonCSS();
}, this);
EventHandler.register(this.i_button, "onmouseup", function() {
this.i_button.className=this.buttonCSS();
}, this);
if (this.i_tipObj==undefined) {
this.i_tipObj=new ToolTip(this.i_button);
}
this.enabled(this.enabled());
}
return this.i_button;
}
GenericButton.prototype.getContent=function() {
return this.getButton();
}
function LabelButton(name, width, height, tip_text, callback, buttonFocus) {
this.LabelButtonSuper(name, width, height, tip_text, callback, buttonFocus);
}
LabelButton.prototype.LabelButtonSuper=function(name, width, height, tip_text, callback, buttonFocus) {
this.GenericButtonSuper(width, height, tip_text, callback, buttonFocus);	
this.i_name=name;
this.i_label_css="LabelButton_Label";
}
LabelButton.prototype.copy=function() {
var cpy=new LabelButton(this.name(), this.width(), this.height(), this.tipText(), this.callback(), this.buttonFocus());
cpy.i_context=this.contextMenu();
cpy.i_id=this.id();
return cpy;
}
LabelButton.prototype.contextMenu=function(menu) {
if (menu!=undefined) {
this.i_context=menu;
if (this.i_button!=undefined) {
this.i_button.appendChild(this.i_label_context);
}
}
return this.i_context;
}
LabelButton.prototype.contextIconHeight=function() {
return 14;
}
LabelButton.prototype.contextIconCenteringMargin=function() {
var margin=Math.floor((this.height() - this.contextIconHeight()) / 2);
if(margin < 0) {
margin=0;
}
return margin;
}
LabelButton.prototype.labelCSS=function(newClass) {
if (newClass!=undefined) {
this.i_label_css=newClass;
if (this.i_label_button!=undefined) {
this.i_label_button.className=this.labelCSS();
}
}
return this.i_label_css;
}
LabelButton.prototype.name=function(newName) {
if (newName!=undefined) {
this.i_name=newName;
if (this.i_label_button_text!=undefined) {
this.i_label_button_text.innerHTML=this.name();
}
}
return this.i_name;
}
LabelButton.prototype.height=function(newHeight) {
if (newHeight!=undefined) {
this.i_height=newHeight;
if (this.i_button!=undefined) {
this.i_button.style.height=this.height()+"px";	
this.i_label_button.lineHeight=this.height()+"px";
this.i_label_context.style.marginTop=this.contextIconCenteringMargin()+"px";
this.i_label_button_text.style.lineHeight=(this.height())+"px";
this.i_label_button_text.style.height=this.height()+"px";
}
}
return this.i_height;
}
LabelButton.prototype.openContext=function() {
if (this.enabled()) {
this.contextMenu().show(this.left(), (this.top()+this.height()));
}
}
LabelButton.triggerContext=function(e) {
this.openContext();
e.returnValue=false;
return false;
}
LabelButton.prototype.getButton=function() {
if (this.i_button==undefined) {
this.i_button=document.createElement('DIV');
this.i_button.className=this.buttonCSS();
this.i_button.style.height=this.height()+"px";
this.i_button.style.width=this.width();
this.i_button.alt=this.tipText();
this.i_button.title=this.tipText();
this.i_button.onselectstart=GenericButton.handleSelect;
EventHandler.register(this.i_button, "onmouseover", function() {
this.i_button.className=this.hoverCSS();
}, this);
EventHandler.register(this.i_button, "onmouseout", function() {
this.i_button.className=this.buttonCSS();
}, this);
EventHandler.register(this.i_button, "onmouseup", function() {
this.i_button.className=this.buttonCSS();
}, this);
this.i_label_context=document.createElement('DIV');
this.i_label_context.innerHTML="&nbsp;";
this.i_label_context.className="Button_context_trigger";
this.i_label_context.style.height=this.contextIconHeight()+"px";
this.i_label_context.style.marginTop=this.contextIconCenteringMargin()+"px";
EventHandler.register(this.i_label_context, "onclick", LabelButton.triggerContext, this);
if (this.contextMenu()!=undefined) {
this.i_button.appendChild(this.i_label_context);
}
this.i_label_button=document.createElement('DIV');
this.i_label_button.className=this.labelCSS();
this.i_label_button.lineHeight=this.height()+"px";
this.i_label_button.style.height=this.height()+"px";
EventHandler.register(this.i_label_button, "onclick", this.execute, this);
this.i_button.appendChild(this.i_label_button);
this.i_label_button_text=document.createElement('DIV');
this.i_label_button_text.innerHTML+=this.name();
this.i_label_button_text.style.lineHeight=(this.height())+"px";
this.i_label_button_text.style.height=this.height()+"px";
this.i_label_button.appendChild(this.i_label_button_text);
if (this.i_tipObj==undefined) {
this.i_tipObj=new ToolTip(this.i_button);
}
this.enabled(this.enabled());
}
return this.i_button;
}
for (var meth in GenericButton.prototype) {
if (LabelButton.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
LabelButton.prototype[meth]=GenericButton.prototype[meth];
}
}
function IconButton(icon_class, icon_width, icon_height, width, height, tip_text, callback, buttonFocus, background_padding) {
this.IconButtonSuper(icon_class, icon_width, icon_height, width, height, tip_text, callback, buttonFocus, background_padding);
}
IconButton.prototype.IconButtonSuper=function(icon_class, icon_width, icon_height, width, height, tip_text, callback, buttonFocus, background_padding) {
this.GenericButtonSuper(width, height, tip_text, callback, buttonFocus);	
this.i_icon_class=icon_class;
this.i_icon_width=icon_width;
this.i_icon_height=icon_height;
this.i_icon_padding=(background_padding==undefined ? 0 : background_padding);
this.i_icon_default_css="IconButton_Image";
}
IconButton.prototype.copy=function() {
var cpy=new IconButton(this.iconCSS(), this.iconWidth(), this.iconHeight(), this.width(), this.height(), this.tipText(), this.callback(), this.buttonFocus());
cpy.i_id=this.id();
return cpy;
}
IconButton.prototype.iconPadding=function(pad) {
if (pad!=undefined) {
this.i_icon_padding=pad;
if (this.i_spacer!=undefined) {
var lMarg=Math.floor((this.width() - this.iconWidth()) / 2);
var tMarg=Math.floor((this.height() - this.iconHeight()) / 2);
this.i_spacer.style.marginLeft=(lMarg - pad)+"px";
this.i_spacer.style.marginTop=(tMarg - pad)+"px";
this.i_spacer.style.marginBottom=(tMarg - pad)+"px";
this.i_spacer.style.marginRight=(lMarg - pad)+"px";
this.i_spacer.style.width=this.iconWidth()+(pad * 2);
this.i_spacer.style.height=this.iconHeight()+(pad * 2);
this.i_spacer.style.padding=pad;
}
}
return this.i_icon_padding;
}
IconButton.prototype.iconDefaultCSS=function(newClass) {
if (newClass!=undefined) {
this.i_icon_default_css=newClass;
if (this.i_icon_button!=undefined) {
this.i_icon_button.className=this.iconDefaultCSS()+" "+this.iconCSS();
}
}
return this.i_icon_default_css;
}
IconButton.prototype.iconCSS=function(newClass) {
if (newClass!=undefined) {
this.i_icon_class=newClass;
if (this.i_icon_button!=undefined) {
this.i_icon_button.className=this.iconDefaultCSS()+" "+this.iconCSS();
}
}
return this.i_icon_class;
}
IconButton.prototype.iconWidth=function(newWidth) {
if (newWidth!=undefined) {
this.i_icon_width=newWidth;
if (this.i_icon_button!=undefined) {
this.i_icon_button.style.width=this.iconWidth();
}
}
return this.i_icon_width;
}
IconButton.prototype.iconHeight=function(newHeight) {
if (newHeight!=undefined) {
this.i_icon_height=newHeight;
if (this.i_icon_button!=undefined) {
this.i_icon_button.style.height=this.iconHeight();
var tMarg=Math.floor((this.height() - this.iconHeight()) / 2);
this.i_spacer.style.marginTop=tMarg+"px";
this.i_spacer.style.marginBottom=tMarg+"px";
}
}
return this.i_icon_height;
}
IconButton.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=newWidth;
if (this.i_button!=undefined) {
this.i_button.style.width=this.width()+"px";
var lMarg=Math.floor((this.width() - this.iconWidth()) / 2);
var tMarg=Math.floor((this.height() - this.iconHeight()) / 2);
this.i_spacer.style.marginLeft=lMarg+"px";
this.i_spacer.style.marginTop=tMarg+"px";
this.i_spacer.style.marginBottom=tMarg+"px";
}
}
return this.i_width;
}
IconButton.prototype.height=function(newHeight) {
if (newHeight!=undefined) {
this.i_height=newHeight;
if (this.i_button!=undefined) {
this.i_button.style.height=this.height()+"px";
var lMarg=Math.floor((this.width() - this.iconWidth()) / 2);
var tMarg=Math.floor((this.height() - this.iconHeight()) / 2);
this.i_spacer.style.marginLeft=lMarg+"px";
this.i_spacer.style.marginTop=tMarg+"px";
this.i_spacer.style.marginBottom=tMarg+"px";
}
}
return this.i_height;
}
IconButton.prototype.getButton=function() {
if (this.i_button==undefined) {
this.i_button=document.createElement('DIV');
this.i_button.className=this.buttonCSS();
this.i_button.style.height=this.height()+"px";
this.i_button.style.width=this.width()+"px";
EventHandler.register(this.i_button, "onclick", this.execute, this);
this.i_button.alt=this.tipText();
this.i_button.title=this.tipText();
this.i_button.paddingLeft=lMarg;
this.i_button.paddingTop=tMarg;
this.i_button.onselectstart=GenericButton.handleSelect;
EventHandler.register(this.i_button, "onmouseover", function() {
if (this.hoverBackgroundCSS()!=undefined) {
this.i_spacer.className=this.hoverBackgroundCSS();
}
}, this);
EventHandler.register(this.i_button, "onmouseout", function() {
this.i_spacer.className=this.buttonCSS();
}, this);
EventHandler.register(this.i_button, "onmouseup", function() {
this.i_button.className=this.buttonCSS();
}, this);
var pdd=this.iconPadding();
var lMarg=Math.floor((this.width() - this.iconWidth()) / 2);
var tMarg=Math.floor((this.height() - this.iconHeight()) / 2);
this.i_spacer=document.createElement('DIV');
this.i_spacer.style.marginLeft=(lMarg - pdd)+"px";
this.i_spacer.style.marginTop=(tMarg - pdd)+"px";
this.i_spacer.style.marginBottom=(tMarg - pdd)+"px";
this.i_spacer.style.marginRight=(lMarg - pdd)+"px";
this.i_spacer.style.width=this.iconWidth()+(pdd * 2);
this.i_spacer.style.height=this.iconHeight()+(pdd * 2);
this.i_spacer.style.padding=pdd;
this.i_button.appendChild(this.i_spacer);
this.i_icon_button=document.createElement('DIV');
this.i_icon_button.className=this.iconCSS();
EventHandler.register(this.i_icon_button, "onmouseover", function() {
if (this.hoverCSS()!=undefined) {
this.i_icon_button.className=this.hoverCSS();
}
}, this);
EventHandler.register(this.i_icon_button, "onmouseout", function() {
this.i_icon_button.className=this.iconCSS();
}, this);
this.i_icon_button.style.width=this.iconWidth();
this.i_icon_button.style.height=this.iconHeight();
this.i_icon_button.innerHTML+="&nbsp;";
this.i_spacer.appendChild(this.i_icon_button);
if (this.i_tipObj==undefined) {
this.i_tipObj=new ToolTip(this.i_button);
}
this.enabled(this.enabled());
}
return this.i_button;
}
for (var meth in GenericButton.prototype) {
if (IconButton.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
IconButton.prototype[meth]=GenericButton.prototype[meth];
}
}
function IconLabelButton(name, icon_class, icon_width, icon_height, width, height, tip_text, callback, buttonFocus) {
this.IconLabelButtonSuper(name, icon_class, icon_width, icon_height, width, height, tip_text, callback, buttonFocus);
}
IconLabelButton.prototype.IconLabelButtonSuper=function(name, icon_class, icon_width, icon_height, width, height, tip_text, callback, buttonFocus) {
this.IconButtonSuper(icon_class, icon_width, icon_height, width, height, tip_text, callback, buttonFocus);	
this.i_name=name;
this.i_label_css="IconLabelButton_Label";
}
IconLabelButton.prototype.copy=function() {
var cpy=new IconLabelButton(this.name(), this.iconCSS(), this.iconWidth(), this.iconHeight(), this.width(), this.height(), this.tipText(), this.callback(), this.buttonFocus());
cpy.i_id=this.id();
return cpy;
}
IconLabelButton.prototype.iconWidth=function(newWidth) {
if (newWidth!=undefined) {
this.i_icon_width=newWidth;
if (this.i_icon_button!=undefined) {
this.i_icon_button.style.width=this.iconWidth();
this.i_icon_button.style.marginLeft=2;
this.i_label_button.style.width=this.width() - (this.iconWidth()+6);
}
}
return this.i_icon_width;
}
IconLabelButton.prototype.labelCSS=function(newClass) {
if (newClass!=undefined) {
this.i_label_css=newClass;
if (this.i_label_button!=undefined) {
this.i_label_button.className=this.labelCSS();
}
}
return this.i_label_css;
}
IconLabelButton.prototype.name=function(newName) {
if (newName!=undefined) {
this.i_name=newName;
if (this.i_label_button_text!=undefined) {
this.i_label_button_text.innerHTML=this.name();
this.i_label_button_text.lineHeight=this.height()+"px";
this.i_label_button_text.style.height=this.height()+"px";
}
}
return this.i_name;
}
IconLabelButton.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=newWidth;
if (this.i_button!=undefined) {
this.i_button.style.width=this.width()+"px";
this.i_label_button.style.width=this.width() - (this.iconWidth()+6);
}
}
return this.i_width;
}
IconLabelButton.prototype.height=function(newHeight) {
if (newHeight!=undefined) {
this.i_height=newHeight;
if (this.i_button!=undefined) {
this.i_button.style.height=this.height()+"px";
this.i_label_button.style.height=this.height()+"px";
this.i_label_button_text.style.height=this.height()+"px";
this.i_label_button_text.style.lineHeight=this.height()+"px";
var tMarg=Math.floor((this.height() - this.iconHeight()) / 2)+"px";
this.i_icon_button.style.marginTop=tMarg;
}
}
return this.i_height;
}
IconLabelButton.prototype.getButton=function() {
if (this.i_button==undefined) {
this.i_button=document.createElement('DIV');
this.i_button.className=this.buttonCSS();
this.i_button.style.height=this.height()+"px";
this.i_button.style.width=this.width()+"px";
EventHandler.register(this.i_button, "onclick", this.execute, this);
this.i_button.alt=this.tipText();
this.i_button.title=this.tipText();
this.i_button.onselectstart=GenericButton.handleSelect;
EventHandler.register(this.i_button, "onmouseover", function() {
this.i_button.className=this.hoverCSS();
}, this);
EventHandler.register(this.i_button, "onmouseout", function() {
this.i_button.className=this.buttonCSS();
}, this);
EventHandler.register(this.i_button, "onmouseup", function() {
this.i_button.className=this.buttonCSS();
}, this);
this.i_label_button=document.createElement('DIV');
this.i_label_button.className=this.labelCSS();
this.i_label_button.style.width=this.width() - (this.iconWidth()+6);
this.i_button.appendChild(this.i_label_button);
this.i_label_button_text=document.createElement('DIV');
this.i_label_button_text.innerHTML=this.name();
this.i_label_button_text.style.lineHeight=this.height()+"px";
this.i_label_button_text.style.height=this.height()+"px";
this.i_label_button.appendChild(this.i_label_button_text);
this.i_icon_button=document.createElement('DIV');
this.i_icon_button.className=this.iconCSS();
var tMarg=Math.floor((this.height() - this.iconHeight()) / 2)+"px";
this.i_icon_button.style.width=this.iconWidth();
this.i_icon_button.style.height=this.iconHeight();
this.i_icon_button.style.marginLeft=2;
this.i_icon_button.style.marginTop=tMarg;
if(document.all) {
this.i_icon_button.style.styleFloat="left";
} else {
this.i_icon_button.style.cssFloat="left";
}
this.i_icon_button.innerHTML+="&nbsp;";
this.i_button.appendChild(this.i_icon_button);
if (this.i_tipObj==undefined) {
this.i_tipObj=new ToolTip(this.i_button);
}
this.enabled(this.enabled());
}
return this.i_button;
}
for (var meth in IconButton.prototype) {
if (IconLabelButton.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
IconLabelButton.prototype[meth]=IconButton.prototype[meth];
}
}
function SimpleButton(value,width,handler,object) {
var button=document.createElement("INPUT");
button.type="BUTTON";
button.className="styled_button";
button.value=value;
button.style.width=width;
EventHandler.register(button,"onmousedown",handler);
EventHandler.register(button,"onkeypress",handler);
button.obj=object;
return button;
}
function SimpleRadioButton(value,group,handler,object) {
var button;
if (document.all)  {
button=document.createElement("<INPUT type=\'RADIO' value=\'"+value+"\' name=\'"+group+"\'>");
} else  {
button=document.createElement("INPUT");
button.type="RADIO";
button.value=value;
button.name=group;
}
if (handler) {
EventHandler.register(button,"onmousedown",handler);
button.obj=object;
}
return button;
}
JavaScriptResource.notifyComplete("./lib/components/Component.Button.js");
function CheckBoxGroup(name,columns) {
this.i_name=name;
this.i_columns=columns;
this.i_labels=new Array();
this.i_values=new Array();
}
CheckBoxGroup.prototype.addBox=function(label,value) {
this.i_labels.push(label);
this.i_values.push(value);
}
CheckBoxGroup.prototype.findBoxIndex=function(value) {
for (var i=0;i<this.i_values.length;i++) {
if (this.i_values[i]==value) {
return i;
}
}
return -1;
}
CheckBoxGroup.prototype.values=function() 
{
var result=new Array();
for (var i=0;i<this.i_boxes.length;i++) {
if (this.i_boxes[i].checked) {
result.push(this.i_boxes[i].value);
}
}
return result;
}
CheckBoxGroup.prototype.setValues=function(values) {
for (var i=0;i<this.i_boxes.length;i++) {
this.i_boxes[i].checked=false;
this.i_boxes[i].defaultChecked=false; 
}
if(values!=undefined) {
for (var i=0;i<values.length;i++) {
var index=this.findBoxIndex(values[i]);
if (index!=-1) {
this.i_boxes[index].checked=true;
this.i_boxes[index].defaultChecked=true;  
}
}
}
}
CheckBoxGroup.prototype.getContent=function() {
if (this.i_content) {
return this.i_content;
}
this.i_boxes=new Array();
this.i_content=document.createElement("DIV");
if (this.i_labels.length==0) {
return this.i_content;
}
if (this.i_columns > 0) {
var rows=Math.ceil(this.i_labels.length / this.i_columns);
var table=new BasicTable(rows,this.i_columns); 
table.setWidth("100%");
table.setCellSpacing("5px");
for (var i=0;i<this.i_labels.length;i++) {
this.appendBox(this.i_labels[i],this.i_values[i],
table.getCell(i % rows,Math.floor(i/rows)));
}
this.i_content.appendChild(table.getContent());
return this.i_content;
} 
for (var i=0;i<this.i_labels.length;i++) {
this.appendBox(this.i_labels[i],this.i_values[i],this.i_content);
}
return this.i_content;
}
CheckBoxGroup.prototype.appendBox=function(label,value,element) {
var box=document.createElement("INPUT");
box.type="CHECKBOX";
box.name=this.i_name;
box.value=value;
element.appendChild(box);
this.i_boxes.push(box);
var span=document.createElement("SPAN");
span.className="txtnormal";
span.innerHTML=label;
element.appendChild(span);
}
JavaScriptResource.notifyComplete("./lib/components/Component.CheckBoxGroup.js");
PopoutWindow.registerGroup("ContextMenu", ["ContextMenu",
"ContextMenuLabel",
"ContextMenuDivider",
"ContextMenuTree",
"ContextMenuIconItem",
"ContextMenuBoolean",
"ContextMenuItem",
"ContextMennuRadio"]);
function ContextMenu(width, title, menu_parent) {
this.i_width=(width==undefined ? 200 : width);
this.i_title=title;
this.i_menu_parent=(menu_parent==undefined) ? document.body : menu_parent;
this.i_left=0;
this.i_top=0;
this.i_visible=false;
this.i_orientation=2;
this.i_items=Array();
ContextMenu.i_all[ContextMenu.i_all.length]=this;
}
ContextMenu.i_all=Array();
ContextMenu.itemHeight=18;
ContextMenu.widthOverflow=2;
ContextMenu.prototype.parent=function() {
return this.i_parent;
}
ContextMenu.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_menu!=undefined) {
this.i_menu.style.width=this.width()+"px";
}
for (var x=0; x < this.i_items.length; x++) {
this.i_items[x].width(width - ContextMenu.widthOverflow);
}
if (this.i_menu_title!=undefined) {
this.i_menu_title.width(width);
this.i_menu_title_div.width(width);
}
}
return this.i_width;
}
ContextMenu.prototype.height=function() {
var ct=6;
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x].visible==undefined || this.i_items[x].visible()) {
ct+=this.i_items[x].height();
}
}
if (this.title()!=undefined && this.title()!="") {
ct+=this.i_menu_title.height();
ct+=this.i_menu_title_div.height();
}
return ct;
}
ContextMenu.prototype.contextFocus=function(newFocus) {
if (newFocus!=undefined) {
this.i_focus=newFocus;
}
return this.i_focus;
}
ContextMenu.prototype.title=function(title) {
if (title!=undefined) {
if (this.i_title!=title) {
if (this.i_menu!=undefined) {
if (title!="" && (this.i_title==undefined || this.i_title=="")) {
if (this.i_items.length==0) {
this.i_menu.appendChild(this.i_menu_title.getItem());
this.i_menu.appendChild(this.i_menu_title_div.getItem());
}
else {
this.i_menu.insertBefore(this.i_menu_title.getItem(), this.items(0).getItem());
this.i_menu.insertBefore(this.i_menu_title_div.getItem(), this.items(0).getItem());
}
}
if (this.i_title!="" && this.i_title!=undefined && title=="") {
this.i_menu.removeChild(this.i_menu_title.getItem());
this.i_menu.removeChild(this.i_menu_title_div.getItem());
}
this.i_menu_title.name(title);
}
this.i_title=title;
}
}
return this.i_title;
}
ContextMenu.prototype.left=function(x) {
if (x!=undefined) {
this.i_left=x;
if (this.i_menu!=undefined) {
this.i_menu.style.left=this.left()+"px";
}
}
return this.i_left;
}
ContextMenu.prototype.top=function(y) {
if (y!=undefined) {
this.i_top=y;
if (this.i_menu!=undefined) {
this.i_menu.style.top=this.top()+"px";
}
}
return this.i_top;
}
ContextMenu.prototype.orientation=function(side) {
if (side!=undefined) {
this.i_orientation=side;
}
return this.i_orientation;
}
ContextMenu.prototype.show=function(x, y) {
if (this.i_init==undefined) {
this.i_menu_parent.appendChild(this.getMenu());
this.i_init=true;
}
if (x==undefined || y==undefined) {
x=CursorMonitor.getX() - parseInt(this.i_menu_parent.scrollLeft);
y=CursorMonitor.getY() - parseInt(this.i_menu_parent.scrollTop);
}
var max_width=0, max_height=0;
if(this.i_menu_parent==document.body) {
max_width=CursorMonitor.browserWidth();
max_height=CursorMonitor.browserHeight();
} else {
max_width=this.i_menu_parent.scrollWidth - this.i_menu_parent.scrollLeft;
max_height=this.i_menu_parent.scrollHeight - this.i_menu_parent.scrollTop;
}
if (x+this.width() > max_width) {
this.orientation(1);
x-=this.width();
if(x < 0) {
x=0;
}
}
else {
this.orientation(2);
}
if (y+this.height() > max_height && y - this.height() > 0) {
y-=this.height();
}
if(y < 0){
y=0;
}
this.closeChildren();
this.top(y+parseInt(this.i_menu_parent.scrollTop));
this.left(x+parseInt(this.i_menu_parent.scrollLeft));
this.visible(true);
return true;
}
ContextMenu.hideAll=function() {
for (var x=0; x < ContextMenu.i_all.length; x++) {
ContextMenu.i_all[x].visible(false);
}
return true;
}
ContextMenu.prototype.hasCursorFocus=function() {
var el=this.i_menu_parent;
var left=0
var top=0;
do {
left+=el.offsetLeft || 0;
top+=el.offsetTop || 0;
el=el.offsetParent;
} while (el);
var cx=CursorMonitor.getX() - left+this.i_menu_parent.scrollLeft;
var cy=CursorMonitor.getY() - top+this.i_menu_parent.scrollTop;
if ((cx > this.left() && cx < this.left()+this.width()) &&
(cy > this.top() && cy < this.top()+this.height())) {
return true;		
}
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x].openChild!=undefined) {
if (this.i_items[x].openChild()==true) {
return this.i_items[x].child().hasCursorFocus();
}
}
}
return false;
}
ContextMenu.prototype.handleGlobalUp=function(e) {
if (!this.hasCursorFocus()) {
this.visible(false);
}
this.i_up_listener.unregister();
e.returnValue=true;
return true;
}
ContextMenu.prototype.handleGlobalDown=function(e) {
this.i_down_listener.unregister();
this.teardownIframeListeners()
if (this.hasCursorFocus()) {
this.i_up_listener=EventHandler.register(document.body, "onmouseup", this.handleGlobalUp, this);
}
else {
this.visible(false);
}
e.returnValue=true;
return true;
}
ContextMenu.prototype.getContentDoc=function(iframe) {
var iframeDocument=undefined;
try {
if (iframe!=undefined) {
if (iframe.contentDocument) { 
iframeDocument=iframe.contentDocument; 
} else if (iframe.contentWindow) { 
iframeDocument=iframe.contentWindow.document;
} else if (iframe.document) { 
iframeDocument=iframe.document;
}
}
} catch(e) {
iframeDocument=undefined;
}
return iframeDocument;
}
ContextMenu.prototype.setupIframeListeners=function() {
var iframes=Array();
var app=Application.getApplicationById(2005);
if(app!=undefined) {
if(app.i_contacts_window!=undefined) {
iframes.push(app.i_contacts_window.i_frame);
}
}
app=Application.getApplicationById(1009);
if(app!=undefined) {
iframes.push(ApplicationOldFiles.i_nav_frame);
var main_frame=ApplicationOldFiles.i_main_frame;
if(main_frame!=undefined) {
var main_frame_doc=this.getContentDoc(main_frame);
if(main_frame_doc!=undefined) {
iframes.push(main_frame_doc.getElementById("filesFrame"));
iframes.push(main_frame_doc.getElementById("file_folders"));
}
}
}
app=Application.getApplicationById(1020);
if(app!=undefined) {
iframes.push(app.i_nav_frame);
iframes.push(app.i_main_frame);
}
app=Application.getApplicationById("EM");
if(app!=undefined) {
iframes.push(app.i_nav_frame);
iframes.push(app.i_main_frame);
}
this.i_frame_listeners=Array();
for(var x=0; x < iframes.length;++x) {
if(iframes[x]!=undefined) {
var iframe_doc=this.getContentDoc(iframes[x]);
if(iframe_doc!=undefined && iframe_doc.body!=undefined) {
this.i_frame_listeners.push(EventHandler.register(iframe_doc.body, "onmousedown", this.handleGlobalDown, this));
}
}
}
}
ContextMenu.prototype.teardownIframeListeners=function() {
if(this.i_frame_listeners!=undefined) {
for(var x=0; x < this.i_frame_listeners.length;++x) {
this.i_frame_listeners[x].unregister();
}
this.i_frame_listeners=undefined;
}
}
ContextMenu.prototype.visible=function(state) {
if (state!=undefined) {
if (this.i_visible!=state) {
this.i_visible=state;
if (this.i_menu!=undefined) {
this.i_menu.style.display=(this.visible() ? "" : "none");
if (this.visible()) {
if (ToolTip.i_active_tip!=undefined) {
ToolTip.i_active_tip.hide();
}
ToolTip.tipsDisabled(true);
document.body.appendChild(this.i_menu);
} else {
ToolTip.tipsDisabled(false);
}
}
this.closeChildren();
if (state) {
if (this.parent()==undefined) {
this.i_down_listener=EventHandler.register(document.body, "onmousedown", this.handleGlobalDown, this);
this.setupIframeListeners();
}
}
}
}
return this.i_visible;
}
ContextMenu.prototype.closeChildren=function() {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x].openChild!=undefined) {
this.i_items[x].openChild(false);
}
}
return true;
}
ContextMenu.prototype.items=function(index) {
if (index!=undefined) {
return this.i_items[index];
}
return this.i_items;
}
ContextMenu.prototype.addItem=function(item, beforeItem) {
if (item!=undefined) {
item.i_parent=this;
var beforeIndex=this.i_items.length;
if (beforeItem!=undefined) {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x]==beforeItem) {
beforeIndex=x;
break;
}
}
}
if (beforeItem!=undefined) {
if (this.i_menu!=undefined) {
this.i_menu.insertBefore(item.getItem(), beforeItem.getItem());
}
this.i_items.splice(beforeIndex, 0, item);
}
else {
if (this.i_menu!=undefined) {
this.i_menu.appendChild(item.getItem());
}
this.i_items[this.i_items.length]=item;
}
item.width(this.width() - ContextMenu.widthOverflow);
}
return item;
}
ContextMenu.prototype.removeItem=function(item) {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x]==item) {
item.i_parent=undefined;
this.i_items.splice(x, 1);
if(this.i_menu!=undefined) {
this.i_menu.removeChild(item.getItem());
}
return true;
}
}
return false;
}
ContextMenu.prototype.removeAllItems=function(item) {
var item;
while (this.i_items.length > 0) {
item=this.i_items.shift();
item.i_parent=undefined;
if (this.i_menu!=undefined) {
try {
this.i_menu.removeChild(item.getItem());
} catch (e) { }
}
}
}
ContextMenu.prototype.getMenu=function() {
if (this.i_menu==undefined) {
this.i_menu=document.createElement('DIV');
this.i_menu.className="ContextMenu";
this.i_menu.style.display=(this.visible() ? "" : "none");
this.i_menu.style.left=this.left()+"px";
this.i_menu.style.top=this.top()+"px";
this.i_menu.style.width=this.width()+"px";
this.i_menu.onselectstart=function(e) {
var ev=(document.all ? event : e);
ev.cancelBubble=true;
return false;
}
this.i_menu_title=new ContextMenuLabel(this.title());
this.i_menu_title.i_parent=this;
this.i_menu_title_div=new ContextMenuDivider();
this.i_menu_title_div.i_parent=this;
this.i_menu_title.width(this.width());
this.i_menu_title_div.width(this.width());
if (this.title()!=undefined && this.title()!="") {
this.i_menu.appendChild(this.i_menu_title.getItem());
this.i_menu.appendChild(this.i_menu_title_div.getItem());
}
for (var x=0; x < this.i_items.length; x++) {
this.i_menu.appendChild(this.i_items[x].getItem());
}
}
return this.i_menu;
}
function ContextMenuDivider() {
this.i_width=100;
this.i_visible=true;
}
ContextMenuDivider.prototype.redraw=function() { }
ContextMenuDivider.prototype.height=function() {
return 3;
}
ContextMenuDivider.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_item!=undefined) {
this.i_item.style.width=this.width()+"px";
}
}
return this.i_width;
}
ContextMenuDivider.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_item!=undefined) {
this.i_item.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
ContextMenuDivider.prototype.parent=function() {
return this.i_parent;
}
ContextMenuDivider.handleClick=function(e) {
var pt=this;
while (pt.parent()!=undefined) {
if(pt.parent().visible) {
pt=pt.parent();
}else{
break;
}
}
if(pt.visible) {
pt.visible(false);
}
}
ContextMenuDivider.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="ContextMenuDivider";
this.i_item.style.width=this.width()+"px";
this.i_item.style.display=(this.visible() ? "" : "none");
EventHandler.register(this.i_item, "onclick", ContextMenuDivider.handleClick, this);
this.i_item_div=document.createElement('DIV');
this.i_item_div.className="ContextMenuDivider_bar";
this.i_item_div.innerHTML="&nbsp;";
this.i_item.appendChild(this.i_item_div);
}
return this.i_item;
}
function ContextMenuTree(tree, enabled) {
this.i_tree=tree;
this.i_enabled=enabled;
this.i_init=false;
this.i_width=100;
}
ContextMenuTree.prototype.redraw=function() { }
ContextMenuTree.prototype.height=function() {
return this.i_tree.height();
}
ContextMenuTree.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_item!=undefined) {
this.i_item.style.width=this.width()+"px";
}
}
return this.i_width;
}
ContextMenuTree.prototype.parent=function() {
return this.i_parent;
}
ContextMenuTree.prototype.tree=function(tree) {
if (tree!=undefined) {
this.i_tree=tree;
}
return this.i_tree;
}
ContextMenuTree.handleMouseDown=function(e) {
e.cancelBubble=true;
e.returnValue=false;
return false;
}
ContextMenuTree.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.style.width=this.width()+"px";
if (this.width()!=undefined) {
this.i_item.style.width=this.width()+"px";
}
this.i_item.appendChild(this.tree().getTree());
EventHandler.register(this.i_item, "onmousedown", ContextMenuTree.handleMouseDown);
}
return this.i_item;
}
function ContextMenuLabel(name, alignment) {
this.i_name=name;
this.i_width=100;
this.i_alignment=(alignment!=undefined ? alignment : "center");
}
ContextMenuLabel.prototype.redraw=function() { }
ContextMenuLabel.prototype.parent=function() {
return this.i_parent;
}
ContextMenuLabel.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_item!=undefined) {
this.i_item.style.width=this.width()+"px";
}
}
return this.i_width;
}
ContextMenuLabel.prototype.height=function() {
return ContextMenu.itemHeight;
}
ContextMenuLabel.prototype.alignment=function(alignment) {
if (alignment!=undefined) {
this.i_alignment=alignment;
if (this.i_item!=undefined) {
this.i_item.style.textAlign=this.alignment();
}
}
return this.i_alignment;
}
ContextMenuLabel.prototype.name=ContextMenuLabel.prototype.text=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_item!=undefined) {
this.i_item.innerHTML=this.name();
}
}
return this.i_name;
}
ContextMenuLabel.handleClick=function(e) {
var pt=this;
while (pt.parent()!=undefined) {
if(pt.parent().visible) {
pt=pt.parent();
}else{
break;
}
}
if(pt.visible) {
pt.visible(false);
}
}
ContextMenuLabel.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="ContextMenuLabel";
this.i_item.style.height=ContextMenu.itemHeight+"px";
this.i_item.innerHTML=this.name();
this.i_item.style.textAlign=this.alignment();
this.i_item.style.width=this.width()+"px";
EventHandler.register(this.i_item, "onclick", ContextMenuLabel.handleClick, this);
}
return this.i_item;
}
function ContextMenuIconItem(name, icon_class, width, enabled, callback, hotkey) {
this.superConstructor(name, callback, icon_class, hotkey, enabled);
}
ContextMenuIconItem.prototype.onclick=null;
ContextMenuIconItem.prototype.superConstructor=function(name, callback, icon_class, hotkey, enabled) {
this.i_name=name;
this.i_icon_class=(icon_class!=undefined ? icon_class : "");
this.i_hotkey=(hotkey==undefined ? "" : hotkey);
this.i_enabled=(enabled!=undefined ? enabled : true);
this.i_callback=callback;
this.i_width=100;
this.i_visible=true;
}
ContextMenuIconItem.prototype.redraw=function() { }
ContextMenuIconItem.prototype.height=function() {
return ContextMenu.itemHeight;
}
ContextMenuIconItem.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_item!=undefined) {
this.i_item.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
ContextMenuIconItem.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_item!=undefined) {
var hkw=8;
if (this.hotkey()!="") {
hkw=30;
}
this.i_item.style.width=this.width()+"px";
this.i_div_icon.style.width="16px";
this.i_div_hotkey.style.width=hkw+"px";				
this.i_div_text.style.width=(this.width() - (hkw+36))+"px";
}
if (this.child()!=undefined) {
this.child().width(this.width());
}
}
return this.i_width;
}
ContextMenuIconItem.prototype.parent=function() {
return this.i_parent;
}
ContextMenuIconItem.prototype.child=function(child) {
if (child!=undefined) {
if (this.i_child!=undefined) {
this.i_child.i_parent=undefined;
}
if (child==false) {
this.i_child=undefined;	
}
else {
this.i_child=child;	
child.i_parent=this;
}
if (this.i_item!=undefined) {
this.i_item.className="ContextMenuIconItem"+(this.child()!=undefined ? " ContextMenuIconItem_hasChildren" : "")+(this.enabled() ? "" : " ContextMenuIconItem_disabled")+(this.selected() ? " ContextMenuIconItem_selected" : "")+(this.open() ? " ContextMenuIconItem_open" : "");			
}
child.width(this.width());
}
return this.i_child;
}
ContextMenuIconItem.prototype.callback=function(callback) {
if (callback!=undefined) {
this.i_callback=callback;
}
return this.i_callback;
}
ContextMenuIconItem.prototype.top=function() {
var tp=0;
var nx=this.i_item;
while (nx!=null) {
tp+=parseInt(nx.offsetTop);
nx=nx.offsetParent;
}
return tp;
}
ContextMenuIconItem.prototype.openChild=function(state) {
if (this.i_child!=undefined) {
if (state!=undefined) {
if (state!=this.i_child.visible()) {
if (state) {
if (this.i_child.i_init!=true) {
document.body.appendChild(this.i_child.getMenu());
this.i_child.i_init=true;
}
var lft=(this.parent().left()+this.parent().width());
if (this.parent().orientation()==1) {
lft=this.parent().left() - this.child().width();						
this.i_child.orientation(1);
if (lft < 0) {
this.child().orientation(2);
lft=(this.parent().left()+this.parent().width());
}
}
else {
if (lft+this.child().width() > CursorMonitor.browserWidth()) {
this.i_child.orientation(1);
lft=this.parent().left() - this.child().width();
lft+=5;
}
else {
this.i_child.orientation(2);
}
}
var tp=this.top();
if (this.top()+this.child().height() > CursorMonitor.browserHeight()) {
tp=this.top() - this.child().height();
}
if(tp < 0){
tp=0;
}
this.i_child.left(lft);
this.i_child.top(tp);
this.i_child.visible(true);
}
else {
this.i_child.visible(false);
}
}
}
return this.i_child.visible();
}
return false;
}
ContextMenuIconItem.prototype.name=ContextMenuIconItem.prototype.text=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_div_text!=undefined) {
this.i_div_text.innerHTML=name;
}
}
return this.i_name;
}
ContextMenuIconItem.prototype.iconCSS=function(iconCSS) {
if (iconCSS!=undefined) {
this.i_icon_class=iconCSS;
if (this.i_div_icon!=undefined) {
this.i_div_icon.className="ContextMenuIconItem_icon"+(this.iconCSS()!=undefined ? " "+this.iconCSS() : "");
}
}
return this.i_icon_class;
}
ContextMenuIconItem.prototype.hotkey=function(hotkey) {
if (hotkey!=undefined) {
this.i_hotkey=hotkey;
if (this.i_div_hotkey!=undefined) {
this.i_div_hotkey.innerHTML=this.hotkey();
this.width(this.width());	
}
}
return this.i_hotkey;
}
ContextMenuIconItem.prototype.enabled=function(state) {
if (state!=undefined) {
this.i_enabled=state;
if (this.i_item!=undefined) {
this.i_item.className="ContextMenuIconItem"+(this.child()!=undefined ? " ContextMenuIconItem_hasChildren" : "")+(this.enabled() ? "" : " ContextMenuIconItem_disabled")+(this.selected() ? " ContextMenuIconItem_selected" : "")+(this.open() ? " ContextMenuIconItem_open" : "");			}
}
return this.i_enabled;
}
ContextMenuIconItem.prototype.selected=function(state) {
if (state!=undefined) {
this.i_selected=state;
if (this.i_item!=undefined) {
this.i_item.className="ContextMenuIconItem"+(this.child()!=undefined ? " ContextMenuIconItem_hasChildren" : "")+(this.enabled() ? "" : " ContextMenuIconItem_disabled")+(this.selected() ? " ContextMenuIconItem_selected" : "")+(this.open() ? " ContextMenuIconItem_open" : "");			}
}
return this.i_selected;
}
ContextMenuIconItem.prototype.open=function(state) {
if (state!=undefined) {
this.i_open=state;
if (this.i_item!=undefined) {
this.i_item.className="ContextMenuIconItem"+(this.child()!=undefined ? " ContextMenuIconItem_hasChildren" : "")+(this.enabled() ? "" : " ContextMenuIconItem_disabled")+(this.selected() ? " ContextMenuIconItem_selected" : "")+(this.open() ? " ContextMenuIconItem_open" : "");
}
}
return this.i_open;
}
ContextMenuIconItem.handleMouseOver=function(e) {
if (this.enabled()) {
this.selected(true);
this.parent().closeChildren();
if (this.child()!=undefined) {
this.openChild(true);
this.open(true);
}
}
}
ContextMenuIconItem.handleMouseOut=function(e) {
this.selected(false);
}
ContextMenuIconItem.handleClick=function(e) {
var pt=this;
while (pt.parent()!=undefined) {
pt=pt.parent();
}
if (this.enabled()) {
var o=new Object();
o.type="click";
o.cancelClose=false;
o.item=this;			
if (this.onclick!=undefined) {
this.onclick(o);
}
if (o.cancelClose!=true) {
var cb=this.callback();
if (cb!=undefined) {
var rt=cb(this, this.parent().contextFocus(), e);
if (rt==false) {
e.returnValue=true;
return true;
}
}
}
}
pt.visible(false);
e.returnValue=true;
return true;
}
ContextMenuIconItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="ContextMenuIconItem"+(this.child()!=undefined ? " ContextMenuIconItem_hasChildren" : "")+(this.enabled() ? "" : " ContextMenuIconItem_disabled")+(this.selected() ? " ContextMenuIconItem_selected" : "")+(this.open() ? " ContextMenuIconItem_open" : "");
this.i_item.style.height=ContextMenu.itemHeight+"px";
this.i_item.style.display=(this.visible() ? "" : "none");
this.i_item.style.width=this.width()+"px";
EventHandler.register(this.i_item, "onmouseover", ContextMenuIconItem.handleMouseOver, this);
EventHandler.register(this.i_item, "onmouseout", ContextMenuIconItem.handleMouseOut, this);
EventHandler.register(this.i_item, "onclick", ContextMenuIconItem.handleClick, this);
this.i_div_icon=document.createElement('DIV');
this.i_div_icon.className="ContextMenuIconItem_icon"+(this.iconCSS()!=undefined ? " "+this.iconCSS() : "");
this.i_div_icon.style.height=ContextMenu.itemHeight+"px";
this.i_div_icon.style.width="16px";
this.i_item.appendChild(this.i_div_icon);
this.i_div_icon.innerHTML="&nbsp;";
this.i_div_hotkey=document.createElement('DIV');
this.i_div_hotkey.className="ContextMenuIconItem_hotkey";
this.i_div_hotkey.style.height=ContextMenu.itemHeight+"px";
this.i_div_hotkey.style.lineHeight=ContextMenu.itemHeight+"px";
var hkw=8;
if (this.hotkey()!="") {
hkw=30;
}
this.i_div_hotkey.style.width=hkw+"px";
this.i_item.appendChild(this.i_div_hotkey);
this.i_div_hotkey.innerHTML=this.hotkey();
this.i_div_text=document.createElement('DIV');
this.i_div_text.className="ContextMenuIconItem_text";
this.i_div_text.style.height=ContextMenu.itemHeight+"px";
this.i_div_text.style.lineHeight=ContextMenu.itemHeight+"px";
this.i_div_text.style.width=(this.width() - (hkw+36))+"px";
this.i_item.appendChild(this.i_div_text);
this.i_div_text.innerHTML=this.name();
}
return this.i_item;
}
function ContextMenuItem(name, enabled, callback, id, hotkey) {
this.i_id=id;
this.superConstructor(name, callback, "", hotkey, enabled);
}
ContextMenuItem.prototype.id=function() {
return this.i_id;
}
for (var meth in ContextMenuIconItem.prototype) {
if (ContextMenuItem.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ContextMenuItem.prototype[meth]=ContextMenuIconItem.prototype[meth];
}
}
function ContextMenuBoolean(name, state, enabled, callback, hotkey) {
this.superConstructor(name, callback, "ContextMenuBoolean", hotkey, enabled);
this.state(state);
}
ContextMenuBoolean.prototype.state=function(state) {
if (state!=undefined) {
this.i_state=state;
this.iconCSS("ContextMenuBoolean ContextMenuBoolean_"+(state==true ? "set" : "unset"));
}
return this.i_state;
}
for (var meth in ContextMenuIconItem.prototype) {
if (ContextMenuBoolean.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ContextMenuBoolean.prototype[meth]=ContextMenuIconItem.prototype[meth];
}
}
function ContextMenuRadio(name, state, groupId, callback, hotkey, enabled) {
this.superConstructor(name, callback, "ContextMenuRadio", hotkey, enabled);
if (groupId==undefined) {
groupId=++ContextMenuRadio.lastUsedGroup;
while (ContextMenuRadio.buttonArray[groupId]!=undefined) {
groupId=++ContextMenuRadio.lastUsedGroup;
}
}
if (ContextMenuRadio.buttonArray[groupId]==undefined) {
ContextMenuRadio.buttonArray[groupId]=Array();
}
ContextMenuRadio.buttonArray[groupId][ContextMenuRadio.buttonArray[groupId].length]=this;
this.i_groupId=groupId;
this.state(state);
}
ContextMenuRadio.lastUsedGroup=0;
ContextMenuRadio.buttonArray=Array();
ContextMenuRadio.prototype.groupId=function(groupId) {
if (groupId!=undefined) {
this.i_groupId=groupId;
}
return this.i_groupId;
}
ContextMenuRadio.prototype.state=function(state) {
if (state!=undefined) {
if (this.i_state!=state) {
this.i_state=state;
if (state==true) {
for (var x=0; x < ContextMenuRadio.buttonArray[this.groupId()].length; x++) {
ContextMenuRadio.buttonArray[this.groupId()][x].state(false);
}
}
this.iconCSS("ContextMenuRadio ContextMenuRadio_"+(state==true ? "set" : "unset"));
}
}
return this.i_state;
}
for (var meth in ContextMenuIconItem.prototype) {
if (ContextMenuRadio.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ContextMenuRadio.prototype[meth]=ContextMenuIconItem.prototype[meth];
}
}
function ContextMenuFileItem(name, enabled, callback, id, hotkey) {
this.i_id=id;
this.superConstructor(name, callback, "", hotkey, enabled);
}
ContextMenuFileItem.prototype.id=function() {
return this.i_id;
}
ContextMenuFileItem.handleChange=function(e) {
var o=new Object();
o.type="click";
if (this.i_file_input.value!="") {
this.i_file_button.removeChild(this.i_file_input);
this.i_file_input_i_l1.unregister();
this.i_file_input_i_l2.unregister();
o.input=this.i_file_input;
this.i_file_input=document.createElement('INPUT');
this.i_file_input.type="file";
this.i_file_input.className="ContextMenuFileItem_button";
this.i_file_input_i_l1=EventHandler.register(this.i_file_input, "onmousemove", ContextMenuFileItem.handleMouseMove, this);
this.i_file_input_i_l2=EventHandler.register(this.i_file_input, "onchange", ContextMenuFileItem.handleChange, this);
this.i_file_button.appendChild(this.i_file_input);
ContextMenuIconItem.handleClick.call(this, o);
if (this.onupload!=undefined) {		
o.type="upload";
this.onupload(o);
}
}
}
ContextMenuFileItem.handleFileClick=function(e) {
var pt=this;
while (pt.parent()!=undefined) {
pt=pt.parent();
}
setTimeout(function() {
ContextMenuFileItem.handleFileClickAgain(pt);
pt=undefined;
}, 100);
e.returnValue=true;
return true;
}
ContextMenuFileItem.handleFileClickAgain=function(pt) {
pt.visible(false);
}
ContextMenuFileItem.handleMouseMove=function(e) {
var me=this;
var lf=0;
var subject=me.i_item;
while (subject!=null) {
lf+=parseInt(subject.offsetLeft);
subject=subject.offsetParent;
}
var curX=CursorMonitor.getX();
me.i_file_button.style.left=((curX - lf) - 30)+"px";
}
ContextMenuFileItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="ContextMenuIconItem"+(this.child()!=undefined ? " ContextMenuIconItem_hasChildren" : "")+(this.enabled() ? "" : " ContextMenuIconItem_disabled")+(this.selected() ? " ContextMenuIconItem_selected" : "")+(this.open() ? " ContextMenuIconItem_open" : "");
this.i_item.style.height=ContextMenu.itemHeight+"px";
this.i_item.style.display=(this.visible() ? "" : "none");
this.i_item.style.width=this.width()+"px";
EventHandler.register(this.i_item, "onmouseover", ContextMenuIconItem.handleMouseOver, this);
EventHandler.register(this.i_item, "onmousemove", ContextMenuFileItem.handleMouseMove, this);
EventHandler.register(this.i_item, "onmouseout", ContextMenuIconItem.handleMouseOut, this);
EventHandler.register(this.i_item, "onclick", ContextMenuFileItem.handleFileClick, this);
this.i_rem=document.createElement('DIV');
this.i_rem.className="ContextMenuFileItem_main";
this.i_item.appendChild(this.i_rem);
this.i_div_icon=document.createElement('DIV');
this.i_div_icon.className="ContextMenuIconItem_icon"+(this.iconCSS()!=undefined ? " "+this.iconCSS() : "");
this.i_div_icon.style.height=ContextMenu.itemHeight+"px";
this.i_div_icon.style.width="16px";
this.i_rem.appendChild(this.i_div_icon);
this.i_div_icon.innerHTML="&nbsp;";
this.i_div_hotkey=document.createElement('DIV');
this.i_div_hotkey.className="ContextMenuIconItem_hotkey";
this.i_div_hotkey.style.height=ContextMenu.itemHeight+"px";
this.i_div_hotkey.style.lineHeight=ContextMenu.itemHeight+"px";
var hkw=8;
if (this.hotkey()!="") {
hkw=30;
}
this.i_div_hotkey.style.width=hkw+"px";
this.i_rem.appendChild(this.i_div_hotkey);
this.i_div_hotkey.innerHTML=this.hotkey();
this.i_div_text=document.createElement('DIV');
this.i_div_text.className="ContextMenuIconItem_text";
this.i_div_text.style.height=ContextMenu.itemHeight+"px";
this.i_div_text.style.lineHeight=ContextMenu.itemHeight+"px";
this.i_div_text.style.width=(this.width() - (hkw+36))+"px";
this.i_rem.appendChild(this.i_div_text);
this.i_div_text.innerHTML=this.name();
this.i_file_button=document.createElement('DIV');
this.i_file_button.className="ContextMenuFileItem_holder";
this.i_file_button.style.height=ContextMenu.itemHeight+"px";
this.i_item.appendChild(this.i_file_button);
this.i_file_input=document.createElement('INPUT');
this.i_file_input.type="file";
this.i_file_input.className="ContextMenuFileItem_button";
this.i_file_input_i_l1=EventHandler.register(this.i_file_input, "onmousemove", ContextMenuFileItem.handleMouseMove, this);
this.i_file_input_i_l2=EventHandler.register(this.i_file_input, "onchange", ContextMenuFileItem.handleChange, this);
this.i_file_button.appendChild(this.i_file_input);
}
return this.i_item;
}
for (var meth in ContextMenuIconItem.prototype) {
if (ContextMenuFileItem.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ContextMenuFileItem.prototype[meth]=ContextMenuIconItem.prototype[meth];
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.ContextMenu.js");
PopoutWindow.registerGroup("DataList",["DataList",
"DataListHeader",
"DataListRow",
"DataListEntry",
"DataListEntryParameter"]);
function DataListModel(entries) {
this.i_entries=entries;		
}
DataListModel.prototype.parent=function() {
return this.i_parent;
}
DataListModel.prototype.generateRandom=function(count) {
if (this.parent()==undefined) {
}
else {
for (var x=0; x < count; x++) {
var z=new DataListEntry(x);
for (var h=0; h < this.parent().i_headers.length; h++) {
var d=z.param(this.parent().i_headers[h], x+"."+h+": "+ResourceManager.randomString(10));
}
this.addEntry(z);
}
}
return true;
}
DataListModel.prototype.refresh=function() {
this.parent().refresh();
}
DataListModel.prototype.entries=function(entries) {
if (entries!=undefined) {
this.i_entries=entries;
if (this.parent()!=undefined) {
this.parent().entries(entries);
}
}
return this.i_entries;
}
DataListModel.prototype.getEntries=function(start, count, sortHeader) {
}
function DataListModelSimple() {
this.i_items=Array();		
this.i_entries=0;
}
DataListModelSimple.prototype.addEntry=function(entry, beforeEntry) {
if (beforeEntry!=undefined) {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x]==beforeEntry) {
this.i_items.splice(x, 0, entry);
return entry;
}
}
}
this.i_items[this.i_items.length]=entry;
this.entries(this.i_items.length);
this.parent().clearSelected();
return entry;
}
DataListModelSimple.prototype.removeEntry=function(entry) {
for (var x=0; x < this.i_items.length; x++) { 
if (this.i_items[x]==entry) {
this.i_items.splice(x, 1);
this.entries(this.i_items.length);
this.parent().clearSelected();
return true;
}
}
return false;
}
DataListModelSimple.prototype.clear=function() {
this.i_items=Array();
this.i_entries=0;
this.refresh();
}
DataListModelSimple.prototype.refresh=function() {
this.i_sorted_by=undefined;
this.i_sort_dir=undefined;
this.parent().refresh();
}
DataListModelSimple.prototype.getEntries=function(start, count, sortHeader) {
if (sortHeader!=undefined) {
if (sortHeader!=this.i_sorted_by || sortHeader.sort()!=this.i_sort_dir) {
this.parent().clearSelected();
}
}
if (sortHeader!=undefined) {
if (sortHeader!=this.i_sorted_by || this.i_sort_dir!=sortHeader.sort()) {
this.i_sorted_by=sortHeader;
this.i_sort_dir=sortHeader.sort();
var lowI=0;
for (var x=0; x < this.i_items.length; x++) {
lowI=x;
for (var y=x; y < this.i_items.length; y++) {
var a1=this.i_items[lowI].param(this.i_sorted_by);
var a2=this.i_items[y].param(this.i_sorted_by);
var v1;
var v2;
if (this.i_sorted_by.sort()=="desc") {
v1=(a1==undefined ? undefined : a1.value());
v2=(a2==undefined ? undefined : a2.value());
}
else {
v1=(a2==undefined ? undefined : a2.value());
v2=(a1==undefined ? undefined : a1.value());
}
if (v1!=undefined && v1.toLowerCase!=undefined) {
v1=v1.toLowerCase();
}
if (v2!=undefined && v2.toLowerCase!=undefined) {
v2=v2.toLowerCase();
}
if (this.i_sorted_by.compare(v1, v2) >=0) {
lowI=y;
}
}
if (lowI!=x) {
var b=this.i_items[lowI];
this.i_items[lowI]=this.i_items[x];
this.i_items[x]=b;
}
}
}
}
var ret=Array();
var retC=0;
for (var x=start; x < start+count && x < this.i_items.length; x++) {
ret[retC++]=this.i_items[x];		
}
return ret;
}
for (var meth in DataListModel.prototype) {
if (DataListModelSimple.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
DataListModelSimple.prototype[meth]=DataListModel.prototype[meth];
}
}
function DataList(dataModel, width, height, rowHeight) {
this.i_model=dataModel;	
this.i_width=width;		
this.i_height=height;		
this.i_empty_message="No data to display";
this.i_row_height=(rowHeight!=undefined ? rowHeight : DataList.defaultRowHeight);
this.i_loading=false;
this.i_page=1;
this.i_pages=1;
this.i_multi_select=false;
this.i_selection=Array();
this.i_stripe_pattern=new Array('DataList_entry_stripe_1', 'DataList_entry_stripe_2');
this.i_headers=Array();
if (dataModel!=undefined) {
this.dataModel(dataModel);
}
else{
this.entries(0);
}
}
DataList.headerHeight=16;
DataList.defaultRowHeight=18;
DataList.borderWidth=2;
DataList.rowPadding=10;
DataList.headerResizeWidth=4;
DataList.sortBoxWidth=18;
DataList.minimumHeaderWidth=28;
DataList.prototype.oncontextmenu=null;
DataList.prototype.ondblclick=null;
DataList.prototype.emptyListText=function(message) {
if (message!=undefined) {
this.i_empty_message=message;
}
return this.i_empty_message;
}
DataList.prototype.multiSelect=function(state) {
if (state!=undefined && this.i_multi_select!=state) {
this.i_multi_select=state;
this.clearSelected();
}
return this.i_multi_select;
}
DataList.prototype.rowSelected=function(index, state) {
if (state!=undefined) {
this.i_selection['se_'+index]=state;
this.i_last_selected=index;
}
if (this.i_selection['se_'+index]==undefined) {
return false;
}
return this.i_selection['se_'+index];
}
DataList.prototype.selectRange=function(index, clearFirst) {
if (clearFirst) {
this.clearSelected();
}
var last=this.lastSelected();
if (last!=undefined && last < this.entries()) {
if (last==index) {
this.rowSelected(index, true);
}
else if (last < index) {
for (var x=last; x <=index; x++) {
this.rowSelected(x, true);
}
}
else {
for (var x=index; x <=last; x++) {
this.rowSelected(x, true);
}
}
}
this.i_last_selected=last;
}
DataList.prototype.selectPage=function() {
var start=(this.page() - 1) * this.pageLength();
var end=start+this.pageLength();
this.clearSelected();
for (var x=start; x < end && x < this.entries(); x++) {
this.rowSelected(x, true);
}
this.refresh();
}
DataList.prototype.lastSelected=function() {
return this.i_last_selected;
}
DataList.prototype.clearSelected=function() {
this.i_selection=Array();
}
DataList.prototype.selectedIndexes=function() {
var ret=Array();
for (var i in this.i_selection) {
if (i.substr(0, 3)=="se_" && this.i_selection[i]==true) {
ret[ret.length]=i.substr(3);	
}
}
return ret;
}
DataList.prototype.top=function() {
var ch=0;
var tp=this.i_list;
while (tp!=null) {
ch+=parseInt(tp.offsetTop);
tp=tp.offsetParent;
}
return ch;
}
DataList.prototype.left=function() {
var ch=0;
var tp=this.i_list;
while (tp!=null) {
ch+=parseInt(tp.offsetLeft);
tp=tp.offsetParent;
}
return ch;
}
DataList.prototype.stripePattern=function(pattern) {
if (pattern!=undefined && this.i_stripe_pattern!=pattern) {
this.i_stripe_pattern=pattern;
this.refresh();
}
return this.i_stripe_pattern;
}
DataList.prototype.entries=function(count) {
if (count!=undefined && this.i_entries!=count) {
this.i_entries=count;
if (this.i_scroller!=undefined) {
this.i_scroller.items(count);
}
this.updatePageList();
}
return this.i_entries;
}
DataList.prototype.updatePageList=function() {
if (this.i_option!=undefined) {
if (this.i_option_sub==undefined) {
this.i_option_sub=Array();
}
var lastX=0;
var foundSel=false;
var options=this.i_option.options();
var oplen=this.i_option.options().length;
for(var x=0; x < oplen; x++) {
this.i_option.removeOption(options[0]);
}
for (var x=0; x < this.pages(); x++) {
var pstart=x * this.i_page_length;
var pend=((x+1) * this.i_page_length);
if (pend > this.entries()) {
pend=this.entries();
}
pstart++;
if (pend==0) {
pstart=0;
}
if (this.i_option_sub[x]==undefined) {
this.i_option_sub[x]=new OptionBoxOption(pstart+" - "+pend,
x+1, false);
this.i_option.addOption(this.i_option_sub[x]);
}
else {
this.i_option_sub[x].name(pstart+" - "+pend);
this.i_option.addOption(this.i_option_sub[x]);
}
if (x+1==this.page()) {
this.i_option.setSelected(this.i_option_sub[x]);
foundSel=true;
}
lastX=x;
}
while (this.i_option.options().length > lastX+1) {
}
if (this.page()==0 || this.page()==1 || this.page()==undefined) {
this.i_option_sub[0].selected(true);
}
}
}
DataList.prototype.loading=function(state, message) {
if (state!=undefined) {
if (this.i_loading!=state) {
this.i_loading=state;
if (this.i_list!=undefined) {
try {
if (state==true) {
this.i_list_loading.style.display="";
this.i_list_content.style.display="none";
this.i_list_loading_box.innerHTML=(message!=undefined ? message : "Loading...");
}
else {
this.i_list_loading.style.display="none";
this.i_list_content.style.display="";
}
}catch(e) {
console.log("DataList.prototype.loading(): No list loaded yet");
}
}
}
}
return this.i_loading;
}
DataList.prototype.rowHeight=function(height) {
if (height!=undefined && this.i_row_height!=height) {
this.i_row_height=height;
if (this.i_scroller!=undefined) {
this.i_scroller.itemHeight(this.rowHeight());
}
}
return this.i_row_height;
}
DataList.prototype.updateHeader=function(header) {
if (header.visible()) {
var nextVisible;
var foundMe=false;
for (var x=0; x < this.i_headers.length; x++) {
if (foundMe && this.i_headers[x].visible()) {
nextVisible=this.i_headers[x];
break;
}
if (this.i_headers[x]==header) {
foundMe=true;
}
}
if (nextVisible!=undefined) {
this.i_list_headers.insertBefore(header.getHeader(), nextVisible.getHeader());
}
else {
this.i_list_headers.appendChild(header.getHeader());
}
}
else {
try {
this.i_list_headers.removeChild(header.getHeader());
} catch (e) { }
}
this.updateDimensions();
this.refresh();	
}
DataList.prototype.getHeaderContext=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu(200, "Columns");
for (var x=0; x < this.i_headers.length; x++) {
this.i_context.addItem(this.i_headers[x].getContextBoolean());
}
}
return this.i_context;
}
DataList.prototype.addHeader=function(header) {
this.i_headers[this.i_headers.length]=header;
header.i_parent=this;
if (this.i_list!=undefined) {
if (header.visible()) {
this.i_list_headers.appendChild(header.getHeader());
this.updateDimensions();
this.refresh();	
if (this.i_context!=undefined) {
this.i_context.addItem(header.getContextBoolean());
}
}
}
return header;
}
DataList.prototype.removeHeader=function(header) {
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x]==header) {
this.i_headers.splice(x, 1);
if (header.visible()) {
if (this.i_list!=undefined) {
this.i_list_headers.removeChild(header.getHeader());
}
}
this.updateDimensions();
this.refresh();	
if (this.i_context!=undefined) {
this.i_context.removeItem(header.getContextBoolean());
}
return true;
}
}
return false;
}
DataList.prototype.handleDataModelChange=function(e) {
this.entries(this.i_model.entries());
this.refresh();
}
DataList.prototype.dataModel=function(model) {
if (model!=undefined) {
if (this.i_model_l!=undefined) {
this.i_model_l.unregister();
this.i_model_l=undefined;
}
this.i_model=model;
model.i_parent=this;
this.i_model_l=EventHandler.register(this.i_model, "onrefresh", this.handleDataModelChange, this);
this.entries(this.i_model.entries());
this.refresh();
}
return this.i_model;
}
DataList.prototype.width=function(width) {
if (width!=undefined && this.i_width!=width) {
this.i_width=width;
if (this.i_list!=undefined) {
this.i_list.style.width=width+"px";
this.i_list_headers.style.width=this.width()+"px";
this.i_list_content.style.width=this.width()+"px";
this.i_list_loading.style.width=this.width()+"px";
this.i_list_loading_box.style.marginTop=Math.floor(((this.height() - DataList.headerHeight) - 30) / 2)+"px";
this.i_list_empty.style.width=this.width()+"px";
if (this.i_scroller!=undefined) {
this.i_scroller.width(this.width());
}
if (!document.all) {
this.i_list_loading_box.style.marginLeft=Math.floor((this.width() - 85) / 2)+"px";
}
this.updateDimensions();
}
}
return this.i_width;
}
DataList.prototype.height=function(height) {
if (height!=undefined && this.i_height!=height) {
this.i_height=height;
if (this.i_list!=undefined) {
this.i_list.style.height=height+"px";
this.i_list_content.style.height=(this.height() - DataList.headerHeight)+"px";
this.i_list_loading.style.height=(this.height() - DataList.headerHeight)+"px";
this.i_list_loading_box.style.marginTop=Math.floor(((this.height() - DataList.headerHeight) - 30) / 2)+"px";
this.i_list_empty.style.top="-"+(this.height() - DataList.headerHeight)+"px";
this.i_list_empty.style.marginTop=(((this.height() - DataList.headerHeight) - 11) / 2)+"px";
if (this.i_scroller!=undefined) {
this.i_scroller.height(this.height() - DataList.headerHeight);
}
if (!document.all) {
this.i_list_loading_box.style.marginLeft=Math.floor((this.width() - 85) / 2)+"px";
}
var sel=this.selectedIndexes();
var startingPoint=this.scrollPosition()+(this.i_scroller.pageLength()!=undefined ? this.i_scroller.pageLength() * (this.i_scroller.page() - 1) : 0);
var nDown=sel - startingPoint;
if (this.possibleEntries() < nDown) {
var s=sel[0] - (this.possibleEntries() - 2);
if (s <=0) {
s=0;
}
s-=(this.pageLength() * (this.page() - 1));
this.scrollPosition(s);
}
}
this.refresh();
}
return this.i_height;
}
DataList.prototype.pageLength=function(length) {
if (length!=undefined && this.i_page_length!=length) {
this.i_page_length=length;
if (this.i_scroller!=undefined) {
this.i_scroller.pageLength(length);
}
}
return this.i_page_length;
}
DataList.prototype.page=function(page) {
if (page!=undefined) {
if (this.getPageOptions().i_options.length >=page && page!=this.i_page) {
var curPage=this.getPageOptions().i_options[page - 1];
curPage.selected(true);
}
if (this.i_page!=page) {
this.i_page=page;
if (this.i_scroller!=undefined) {
this.i_scroller.page(page);
}
this.refresh();
}
}
return this.i_page;
}
DataList.prototype.pages=function() {
if (this.i_scroller!=undefined) {
return this.i_scroller.pages();
}
return 1;
}
DataList.prototype.actualPageLength=function() {
if (this.i_scroller!=undefined) {
return this.i_scroller.actualPageLength();
}
return 0;
}	
DataList.prototype.scrollPosition=function(top) {
return this.i_scroller.verticalPosition(top);
}
DataList.prototype.possibleEntries=function() {
if (this.i_scroller!=undefined) {
return this.i_scroller.possibleItems();
}
return 0;
}
DataList.prototype.refresh=function(selection_only) {
if (selection_only!=undefined) {
this.refresh_r(selection_only);
}
else {
if (this.i_scroller!=undefined) {
this.i_scroller.refreshContent();
}
}
}
DataList.prototype.refresh_r=function(selection_only) {
if (this.i_list!=undefined) {
var startingPoint=this.scrollPosition()+(this.i_scroller.pageLength()!=undefined ? this.i_scroller.pageLength() * (this.i_scroller.page() - 1) : 0);
if (startingPoint==NaN || startingPoint==undefined) {
startingPoint=(this.i_scroller.pageLength()!=undefined ? this.i_scroller.pageLength() * (this.i_scroller.page() - 1) : 0);
}
var hasStripes=(this.stripePattern()!=undefined ? true : false);
var count=this.i_scroller.possibleItems();
if (!selection_only) {
var sortBy=undefined;
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].sort()!=undefined) {
sortBy=this.i_headers[x];				
}
}
var dr=count+2;
if (startingPoint+dr > this.entries()) {
dr=this.entries() - startingPoint;
}
var entries;
if (this.dataModel()!=undefined) {
entries=this.dataModel().getEntries(startingPoint, dr, sortBy, this);
}
else {
entries=Array();
}
if (entries.length < count) {
count=entries.length;
}
}
var inx=startingPoint;
for (var x=0; x < count && x < this.i_scroller.i_item_array.length; x++) {
if (selection_only) {
this.i_scroller.i_item_array[x].rowSelected(this.rowSelected(inx++));
}
else {
this.i_scroller.i_item_array[x].entry(entries[x]);
if (hasStripes) {
this.i_scroller.i_item_array[x].stripe(this.stripePattern()[(startingPoint+x) % this.stripePattern().length]);
this.i_scroller.i_item_array[x].rowSelected(this.rowSelected(inx));
this.i_scroller.i_item_array[x].rowIndex(inx++);
}
}
}
if(this.i_list_empty!=undefined) {
if(!this.loading() && (this.dataModel()==undefined || this.dataModel().entries()==0)) {
this.i_list_empty.style.display="";
} else {
this.i_list_empty.style.display="none";
}
}
}
}
DataList.rowFactory=function(p) {
var n=new DataListRow(p);
return n;
}
DataList.handleContentResize=function(width, height) {
this.pObj.updateDimensions();
}
DataList.handleContentReload=function(start, items) {
this.pObj.refresh_r();
}
DataList.handleKeyDown=function(e) {
}
DataList.prototype.getList=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.className="DataList";
this.i_list.style.width=this.width()+"px";
this.i_list.style.height=this.height()+"px";
this.i_list.tabindex=33;
EventHandler.register(this.i_list, "onkeydown", DataList.handleKeyDown);
this.i_list_headers=document.createElement('DIV');
this.i_list_headers.className="DataList_headers";
this.i_list_headers.style.width=this.width()+"px";
this.i_list_headers.style.height=DataList.headerHeight+"px";
this.i_list.appendChild(this.i_list_headers);
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].visible()) {
this.i_list_headers.appendChild(this.i_headers[x].getHeader());
}
}
this.i_list_content=document.createElement('DIV');
this.i_list_content.className="DataList_content";
this.i_list_content.style.width=this.width()+"px";
this.i_list_content.style.height=(this.height() - DataList.headerHeight)+"px";
this.i_list_content.style.display=(this.loading() ? "none" : "");
this.i_list.appendChild(this.i_list_content);
this.i_scroller=new ScrollPane(this, this.width(), (this.height() - DataList.headerHeight), DataList.rowFactory, this.entries(), 10, this.pageLength(), this.page());
this.i_scroller.itemHeight(this.rowHeight());
this.i_scroller.pObj=this;
this.i_scroller.onresize=DataList.handleContentResize;
this.i_scroller.onreload=DataList.handleContentReload;
this.i_list_content.appendChild(this.i_scroller.getPane());
this.i_list_loading=document.createElement('DIV');
this.i_list_loading.innerHTML="&nbsp;";
this.i_list_loading.className="DataList_loading";
this.i_list_loading.style.width=(this.width() - (this.scrollable() ? ScrollPane.verticalScrollWidth  : 0))+"px";
this.i_list_loading.style.height=(this.height() - DataList.headerHeight)+"px";
this.i_list_loading.style.display=(this.loading() ? "" : "none");
this.i_list_loading_box=document.createElement('DIV');
this.i_list_loading_box.innerHTML="Loading...";
this.i_list_loading_box.className="DataList_loading_box";
this.i_list_loading_box.style.marginTop=Math.floor(((this.height() - DataList.headerHeight) - 30) / 2)+"px";
if (!document.all) {
this.i_list_loading_box.style.marginLeft=Math.floor((this.width() - 85) / 2)+"px";
}
this.i_list_loading.appendChild(this.i_list_loading_box);
this.i_list.appendChild(this.i_list_loading);
this.i_list_empty=document.createElement("DIV");
this.i_list_empty.innerHTML=(this.dataModel()!=undefined ? this.emptyListText() : "No Data Model");
this.i_list_empty.className="DataList_empty";
this.i_list_empty.style.display="none";
this.i_list_content.appendChild(this.i_list_empty);
this.updateDimensions();
this.refresh();	
}
return this.i_list;
}
DataList.updatePage=function(option_box) {
var me=this;
setTimeout(function() {
me.page(option_box.value());
me=undefined;
}, 100);
return true;
}
DataList.prototype.getPageOptions=function() {
if (this.i_option==undefined) {
this.i_option=new OptionBox(100, 1, false);
EventHandler.register(this.i_option, "onchange", DataList.updatePage, this);
if (this.i_option_sub==undefined) {
this.i_option_sub=Array();
}
this.updatePageList();
}
return this.i_option;
}
DataList.prototype.scrollable=function() {
if (this.i_scroller!=undefined) {
return this.i_scroller.verticalScroll();
}
return false;
}
DataList.prototype.resizeHeader=function(header, diff) {
var useHeaders=Array();
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].visible()) {
useHeaders[useHeaders.length]=this.i_headers[x];			
}
}
var dm=new DimensionProcessor(this.width() - (this.scrollable() ? ScrollPane.verticalScrollWidth  : 0));
var reqWidth=header.effectiveWidth()+diff;
for (var x=0; x < useHeaders.length; x++) {
var rat=0;
var wid=useHeaders[x].width();
if (useHeaders[x].width().indexOf!=undefined) {
if (useHeaders[x].width().indexOf('%') > -1) {
rat=(parseInt(wid) / 100);
wid=0;
}
}
dm.addNode(DataList.minimumHeaderWidth, wid, rat, (useHeaders[x]==header ? reqWidth : 0));
}
dm.normalize();
var dr=dm.calculate();
var z=0;
for (var x=0; x < useHeaders.length; x++) {
if (useHeaders[x].width().indexOf!=undefined && useHeaders[x].width().indexOf('%') > -1) {
useHeaders[x].width((dr.nodes[x].ratio * 100)+"%");
}
else {
useHeaders[x].width(dr.nodes[x].value);
}
useHeaders[x].effectiveWidth(dr.nodes[x].value);
}
this.updateDimensions();
}
DataList.prototype.updateDimensions=function() {
var useHeaders=Array();
var borderComp=0;
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].visible()) {
useHeaders[useHeaders.length]=this.i_headers[x];			
borderComp+=DataList.borderWidth;		
}
}
var dm=new DimensionProcessor(this.width() - (this.scrollable() ? ScrollPane.verticalScrollWidth  : 0));
for (var x=0; x < useHeaders.length; x++) {
var rat=0;
var wid=useHeaders[x].width();
if (useHeaders[x].width().indexOf!=undefined) {
if (useHeaders[x].width().indexOf('%') > -1) {
rat=(parseInt(wid) / 100);
wid=0;
}
}
dm.addNode(DataList.minimumHeaderWidth, wid, rat, 0);
}
dm.normalize();
var dr=dm.calculate();
for (var x=0; x < useHeaders.length; x++) {
useHeaders[x].effectiveWidth(dr.nodes[x].value, (x==useHeaders.length - 1 ? true : false));
}
for (var x=0; x < this.i_scroller.i_item_array.length; x++) {
this.i_scroller.i_item_array[x].updateDimensions();
}
}
function DataListHeader(id, name, width, visible, displayName, iconClass) {
this.i_name=name;			
this.i_width=width;			
this.i_icon=iconClass;
this.i_displayName=displayName;
this.i_id=id;
this.i_visible=(visible==undefined ? true : visible);
this.i_parent=undefined;
this.i_comp=0;
this.i_type="DataListHeader";
}
DataListHeader.prototype.onsort;
DataListHeader.prototype.ontoggle;
DataListHeader.prototype.id=function() {
return this.i_id;
}
DataListHeader.prototype.parent=function() {
return this.i_parent;
}
DataListHeader.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined && this.i_icon!=iconClass) {
this.i_icon=iconClass;
if (this.i_header_text!=undefined) {
this.i_header_text.innerHTML=(this.iconClass()!=undefined ? "&nbsp;" : name);
this.i_header_text.className="DataList_header_text"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
}
}
return this.i_icon;
}
DataListHeader.prototype.displayName=function(name) {
if (name!=undefined && this.i_displayName!=name) {
this.i_displayName=name;
if (this.i_context!=undefined) {
this.getContextBoolean().name(name);
}
}
return this.i_displayName;
}
DataListHeader.prototype.top=function() {
return this.parent().top();
}
DataListHeader.prototype.compare=function(value1, value2) {
var ret=0;
if (value1==undefined && value2==undefined) {
ret=0;
}
else if (value1==undefined && value2!=undefined) {
ret=1;
}
else if (value1!=undefined && value2==undefined) {
ret=-1;
}
else if (value1 > value2) {
ret=-1;
}
else if (value1 < value2) {
ret=1;
}
return ret;
}
DataListHeader.prototype.isNumeric=function(state) {
if (state!=undefined) {
this.i_numeric=state;
}
return this.i_numeric;
}
DataListHeader.prototype.filter=function(value) {
return value;
}
DataListHeader.prototype.defaultSort=function(direction)
{
if(direction!=undefined)
{
this.i_defaultSort=direction;
}
return this.i_defaultSort;
}
DataListHeader.prototype.sort=function(direction) {
if (direction!=undefined) {
if (direction==false) {
this.i_sort_dir=undefined;
try {
this.i_header.removeChild(this.i_header_sort);
this.i_header.className="DataList_header";
} catch (e) { }
}
else {
if (this.i_sort_dir!=direction) {
this.i_sort_dir=direction;
if (this.i_header!=undefined) {
for (var x=0; x < this.parent().i_headers.length; x++) {
if (this.parent().i_headers[x]!=this && this.parent().i_headers[x].sort()!=undefined) {
this.parent().i_headers[x].sort(false);
}
}
this.i_header_sort.className="DataList_header_sort_"+direction;
this.i_header.appendChild(this.i_header_sort);
this.i_header.className="DataList_header_sorted";
}
}
}
if (this.i_header!=undefined) {
this.parent().updateDimensions();
}
if (this.onsort!=undefined) {
this.onsort(direction);
}
this.parent().refresh();
}
return this.i_sort_dir;
}
DataListHeader.prototype.left=function() {
var l=0;
for (var x=0; x < this.parent().i_headers.length; x++) {
if (this.parent().i_headers[x]==this) {
break;
}
if (this.parent().i_headers[x].visible()) {
l+=this.parent().i_headers[x].effectiveWidth();
}
}	
return this.parent().left()+l;
}
DataListHeader.handleContextSelect=function(m) {
m.parentObj.visible(!m.parentObj.visible());
}
DataListHeader.prototype.getContextBoolean=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenuBoolean((this.displayName()==undefined ? this.name() : this.displayName()), this.visible(), true, DataListHeader.handleContextSelect);
this.i_context.parentObj=this;
}
return this.i_context;
}
DataListHeader.prototype.visible=function(state) {
if (state!=undefined) {
var vis=0;
for (var x=0; x < this.parent().i_headers.length; x++) {
if (this.parent().i_headers[x].visible()) {
vis++;		
}
}
if (vis > 1 || state==true) {
this.i_visible=state;
this.parent().updateHeader(this);
this.getContextBoolean().state(state);
if (this.ontoggle!=undefined) {
this.ontoggle(state);
}
}
}
return this.i_visible;
}
DataListHeader.prototype.name=function(name) {
if (name!=undefined && this.i_name!=name) {
this.i_name=name;
if (this.i_header!=undefined) {
this.i_header_text.innerHTML=(this.iconClass()!=undefined ? "&nbsp;" : name);
this.i_header_text.className="DataList_header_text"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
this.i_header_text.style.height=DataList.headerHeight+"px";
this.i_header_text.style.lineHeight=DataList.headerHeight+"px";
}
if (this.i_context!=undefined) {
this.i_context.text(name);
}
}
return this.i_name;
}
DataListHeader.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
}
return this.i_width;
}
DataListHeader.prototype.effectiveWidth=function(width, addExtra) {
if (width!=undefined && this.i_effective_width!=width) {
this.i_effective_width=width;
if (this.i_header!=undefined) {
var comp=((addExtra==true && this.parent().scrollable()) ? ScrollPane.verticalScrollWidth  : 0);
this.i_header.style.width=(width+comp)+"px";
this.i_header_text.style.width=((((width+comp) - DataList.headerResizeWidth) - (this.sort()!=undefined ? DataList.sortBoxWidth : 0)) - 2) - (this.name()=="" ? 4 : 0)+"px";
}
}
return this.i_effective_width;
}
DataListHeader.handleDragFinish=function(e) {
var dh=DataListHeader.getDragHeader();
var me=this;
CursorMonitor.removeListener(dh.monitor_id);
dh.monitor_up_id.unregister();
if (dh.init==true) {
try {
document.body.removeChild(dh);
} catch (e) { }
if (dh.selecHeader!=undefined && dh.selecHeader!=me) {
for (var z=0; z < me.parent().i_headers.length; z++) {
if (me.parent().i_headers[z]==me) {
me.parent().i_headers.splice(z, 1);
break;
}
}
if (dh.selecHeader==-1) {
me.parent().i_headers[me.parent().i_headers.length]=me;
me.parent().i_list_headers.appendChild(me.getHeader());
}
else {
for (var z=0; z < me.parent().i_headers.length; z++) {
if (me.parent().i_headers[z]==dh.selecHeader) {
me.parent().i_headers.splice(z, 0, me);
break;
}
}
me.parent().i_list_headers.insertBefore(me.getHeader(), dh.selecHeader.getHeader());
}
me.parent().updateDimensions();
me.parent().refresh();
}
}
else {
if (me.sort()==undefined || me.sort()=="desc") {
if(me.sort()==undefined && me.defaultSort()!=undefined)
{
me.sort(me.defaultSort());
}
else
{
me.sort("asc");
}
}
else {
me.sort("desc");
}
}
dh.selecHeader=null;
}
DataListHeader.handleDragMove=function(x, y) {
var dh=DataListHeader.getDragHeader();
var me=this;
if (dh.init==false) {
if (dh.startX > x+5 || dh.startX < x - 5 || dh.startY > y+5 || dh.startY < y - 5) {
dh.style.left=CursorMonitor.getX();
dh.style.top=CursorMonitor.getY();
dh.style.height=DataList.headerHeight;
document.body.appendChild(dh);
dh.init=true;
}
}
dh.selecHeader=-1;
for (var z=0; z < me.parent().i_headers.length; z++) {
if (me.parent().i_headers[z].visible()) {
if (x < me.parent().i_headers[z].left()+me.parent().i_headers[z].effectiveWidth()) {
dh.style.left=me.parent().i_headers[z].left();
dh.selecHeader=me.parent().i_headers[z];
break;
}
}
}
if (dh.selecHeader==-1) {
dh.style.left=me.parent().left()+me.parent().width() - 4;
}
dh.style.top=me.top();
}
DataListHeader.handleDragStart=function(e) {
var bt=(e.button > 0 ? e.button : e.which);
if (bt!=2) {
var dh=DataListHeader.getDragHeader();
dh.init=false;
dh.startX=CursorMonitor.getX();
dh.startY=CursorMonitor.getY();
dh.monitor_id=CursorMonitor.addListener(DataListHeader.handleDragMove, this);
dh.monitor_up_id=EventHandler.register(document.body, "onmouseup", DataListHeader.handleDragFinish, this);
}
else {
e.returnValue=false;
return false;
}
}
DataListHeader.handleContext=function(e) {
var c=this.parent().getHeaderContext();
c.show(CursorMonitor.getX(), CursorMonitor.getY());
e.cancelBubble=true;
e.returnValue=false;
return false;
}
DataListHeader.getDragHeader=function() {
if (DataListHeader.i_drag_header==undefined) {
DataListHeader.i_drag_header=document.createElement('DIV');
DataListHeader.i_drag_header.innerHTML="&nbsp;";
DataListHeader.i_drag_header.className="DataListHeader_drag";
}
return DataListHeader.i_drag_header;
}
DataListHeader.handleResizeFinish=function(e) {
var rb=DataListHeader.getResizeBar();
var me=this;
CursorMonitor.removeListener(rb.monitor_id);
rb.monitor_up_id.unregister();
try {
document.body.removeChild(rb);
} catch (e) { }
var diff=(rb.lastX - rb.startX);
var foundMe=false;
var resHead=undefined;
for (var x=me.parent().i_headers.length - 1; x >=0; x--) {
if (me.parent().i_headers[x].visible()) {
if (foundMe==true) {
resHead=me.parent().i_headers[x];
break;
}
if (me.parent().i_headers[x]==me) {
foundMe=true;
}
}
}
rb.startX=null;
me.parent().resizeHeader(resHead, diff);
}
DataListHeader.handleResizeMove=function(x, y) {
var rb=DataListHeader.getResizeBar();
var useX=x;
if (useX < rb.maxLeft) {
useX=rb.maxLeft;
}
if (useX > rb.maxRight) {
useX=rb.maxRight;
}
rb.style.left=useX+"px";
rb.lastX=useX;
}
DataListHeader.handleResizeStart=function(e) {
var me=this;
var rb=DataListHeader.getResizeBar();
for (var x=0; x < me.parent().i_headers.length; x++) {
if (me.parent().i_headers[x].visible()) {
if (me.parent().i_headers[x]==me) {
e.returnValue=true;
return true;
}
break;
}
}
rb.startX=CursorMonitor.getX();
rb.maxLeft=me.parent().left();
rb.maxRight=rb.maxLeft+me.parent().width();
rb.monitor_id=CursorMonitor.addListener(DataListHeader.handleResizeMove);
rb.monitor_up_id=EventHandler.register(document.body, "onmouseup", DataListHeader.handleResizeFinish, this);
rb.style.height=(me.parent().height() - DataList.headerHeight)+"px";
rb.style.top=(me.parent().top()+DataList.headerHeight)+"px";
rb.style.left=CursorMonitor.getX()+"px";
document.body.appendChild(rb);
}
DataListHeader.getResizeBar=function() {
if (DataListHeader.i_resize_bar==undefined) {
DataListHeader.i_resize_bar=document.createElement('DIV');
DataListHeader.i_resize_bar.innerHTML="&nbsp;";
DataListHeader.i_resize_bar.className="DataListHeader_resize";	
}
return DataListHeader.i_resize_bar;
}
DataListHeader.handleMouseOver=function(e) {
if (this.sort()==undefined) {
this.i_header.className="DataList_header_selected";
}
}
DataListHeader.handleMouseOut=function(e) {
if (this.sort()==undefined) {
this.i_header.className="DataList_header";
}
}
DataListHeader.handleSelectStart=function(e) {
var ev=(document.all ? event : e);
ev.cancelBubble=true;
e.returnValue=true;
return false;
}
DataListHeader.prototype.getHeader=function() {
if (this.i_header==undefined) {
this.i_header=document.createElement('DIV');
this.i_header.className="DataList_header"+(this.sort() ? "_sorted" : "");
EventHandler.register(this.i_header, "onmouseover", DataListHeader.handleMouseOver, this);
EventHandler.register(this.i_header, "onmouseout", DataListHeader.handleMouseOut, this);
EventHandler.register(this.i_header, "onselectstart", DataListHeader.handleSelectStart);
this.i_header.style.height=DataList.headerHeight+"px";
this.i_header_grab=document.createElement('DIV');
this.i_header_grab.innerHTML="&nbsp;";
this.i_header_grab.className="DataList_header_resize";
this.i_header_grab.style.height=DataList.headerHeight;
this.i_header_grab.style.width=DataList.headerResizeWidth+"px";
EventHandler.register(this.i_header_grab, "onmousedown", DataListHeader.handleResizeStart, this);
this.i_header.appendChild(this.i_header_grab);
this.i_header_text=document.createElement('DIV');
this.i_header_text.innerHTML=(this.iconClass()!=undefined ? "&nbsp;" : this.name());
this.i_header_text.className="DataList_header_text"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
this.i_header_text.style.height=DataList.headerHeight+"px";
this.i_header.appendChild(this.i_header_text);
this.i_header_sort=document.createElement('DIV');
this.i_header_sort.innerHTML="&nbsp;";
if (this.sort()!=undefined) {
this.i_header_sort.className="DataList_header_sort_"+this.sort();
}
this.i_header_sort.style.height=DataList.headerHeight+"px";
this.i_header_sort.style.width=DataList.sortBoxWidth+"px";
if (this.sort()!=undefined) {
this.i_header.appendChild(this.i_header_sort);
}
EventHandler.register(this.i_header_text, "onmousedown", DataListHeader.handleDragStart, this);
EventHandler.register(this.i_header_text, "oncontextmenu", DataListHeader.handleContext, this);
EventHandler.register(this.i_header_sort, "onmousedown", DataListHeader.handleDragStart, this);
EventHandler.register(this.i_header_sort, "oncontextmenu", DataListHeader.handleContext, this);
if (this.effectiveWidth()!=undefined) {
this.i_header.style.width=this.effectiveWidth()+"px";
this.i_header_text.style.width=(((this.effectiveWidth() - DataList.headerResizeWidth) - (this.sort()!=undefined ? DataList.sortBoxWidth : 0)) - 2)+"px";
}
}
return this.i_header;
}
function DataListRow(p) {
this.i_cells=Array();
this.i_tips=Array();
this.i_parent=p;
this.i_selected=false;
this.i_visible=true;
}
DataListRow.prototype.rowIndex=function(rowIndex) {
if (rowIndex!=undefined) {
this.i_row_index=rowIndex;	
}
return this.i_row_index;
}
DataListRow.prototype.parent=function() {
return this.i_parent;
}
DataListRow.prototype.rowSelected=function(state) {
if (state!=undefined) {
if (this.i_selected!=state) {
this.i_selected=state;
if(this.i_row!=undefined) {
this.i_row.className="DataList_entry"+(this.rowSelected()==true ? "_selected" : "")+((!this.rowSelected() && this.stripe()!=undefined) ? " "+this.stripe() : "")+(this.rowStyle()!=undefined ? " "+this.rowStyle() : "");
}
}
}
return this.i_selected;
}
DataListRow.prototype.rowStyle=function(css_name) {
if (css_name!=undefined) {
this.i_style=css_name;
if (this.i_row!=undefined) {
this.i_row.className="DataList_entry"+(this.rowSelected()==true ? "_selected" : "")+((!this.rowSelected() && this.stripe()!=undefined) ? " "+this.stripe() : "")+(this.rowStyle()!=undefined ? " "+this.rowStyle() : "");
}
}
return this.i_style;
}
DataListRow.prototype.stripe=function(class_name) {
if (class_name!=undefined) {
this.i_stripe=class_name;
if (this.i_row!=undefined) {
this.i_row.className="DataList_entry"+(this.rowSelected()==true ? "_selected" : "")+((!this.rowSelected() && this.stripe()!=undefined) ? " "+this.stripe() : "")+(this.rowStyle()!=undefined ? " "+this.rowStyle() : "");
}
}
return this.i_stripe;
}
DataListRow.prototype.entry=function(entry) {
if (entry!=undefined) {
if (this.i_row!=undefined) {
var cells=this.i_row.getElementsByTagName('DIV');
for (var x=cells.length - 1; x >=0; x--) {
try { 
this.i_row.removeChild(cells[x]);
} catch (e) { }
}
if(this.i_entry_change_handler!==undefined) {
this.i_entry_change_handler.unregister();
}
var usedParams=Array();
for (var x=0; x < this.parent().i_headers.length; x++) {
if (this.parent().i_headers[x].visible()) {
usedParams[usedParams.length]=this.parent().i_headers[x];
}
}
for (var x=0; x < usedParams.length; x++) {
var v=entry.param(usedParams[x]);
var dVal="&nbsp;";
if (v!=undefined && v.value!=undefined) {
dVal=v.value();
}
this.getCell(usedParams[x].id()).innerHTML=usedParams[x].filter(dVal);
if ((v!=undefined) && (v!=null) && (v.i_tip_text!=undefined)) {
this.getToolTip(usedParams[x].id()).tip(v.i_tip_text);
} else {
this.getToolTip(usedParams[x].id()).tip(usedParams[x].filter(dVal));
}
var cssC="";
if (v!=undefined && v.iconClass!=undefined) {
cssC=v.iconClass();
}
this.getCell(usedParams[x].id()).className="DataList_entry_value"+((cssC!=undefined && cssC!="") ? " "+cssC : "");
if(this.getCell(usedParams[x].id()).className=="DataList_entry_value list_importance_high"){
this.getCell(usedParams[x].id()).style.marginLeft="1px";
this.getCell(usedParams[x].id()).style.marginRight="-1px";
}
this.i_row.appendChild(this.getCell(usedParams[x].id()));
}
EventHandler.register(entry, "onchange", this.handleOnChangeEntry, this);
this.updateDimensions();
}
this.i_entry=entry;
this.rowStyle(entry.entryStyle());
this.i_entry.activeRow(this);
}
return this.i_entry;
}
DataListRow.prototype.handleOnChangeEntry=function(o) {
var entry=this.i_entry;
var usedParams=Array();
for (var x=0; x < this.parent().i_headers.length; x++) {
if (this.parent().i_headers[x].visible()) {
usedParams[usedParams.length]=this.parent().i_headers[x];
}
}
for (var x=0; x < usedParams.length; x++) {
var v=entry.param(usedParams[x]);
var dVal=" ";
if (v!=undefined) {
dVal=v.value();
}
this.getCell(usedParams[x].id()).innerHTML=usedParams[x].filter(dVal);
this.getToolTip(usedParams[x].id()).tip(usedParams[x].filter(dVal));
var cssC="";
if (v!=undefined) {
cssC=v.iconClass();
}
this.getCell(usedParams[x].id()).className="DataList_entry_value"+((cssC!=undefined && cssC!="") ? " "+cssC : "");
}
}
DataListRow.handleSelectStart=function(e) {
var ev=(document.all ? event : e);
ev.cancelBubble=true;
e.returnValue=false;
return false;
}
DataListRow.prototype.getCell=function(index, toolTip) {
if (this.i_cells[index]==undefined) {
this.i_cells[index]=document.createElement('DIV');
EventHandler.register(this.i_cells[index], "onselectstart", DataListRow.handleSelectStart);
this.i_cells[index].className="DataList_entry_value";
this.i_cells[index].style.height=this.parent().rowHeight()+"px";
this.i_cells[index].pHead=index;
EventHandler.register(this.i_cells[index], "onmousedown", DataListRow.handleMouseDown, this);
EventHandler.register(this.i_cells[index], "onmouseup", DataListRow.handleMouseUp, this);
EventHandler.register(this.i_cells[index], "onmouseover", DataListRow.handleMouseOver, this);
EventHandler.register(this.i_cells[index], "onmouseout", DataListRow.handleMouseOut, this);
EventHandler.register(this.i_cells[index], "onclick", DataListRow.handleClick, this);
EventHandler.register(this.i_cells[index], "oncontextmenu", DataListRow.handleContextMenu, this);
EventHandler.register(this.i_cells[index], "ondblclick", DataListRow.handleDblClick, this);
this.i_tips[index]=new ToolTip(this.i_cells[index]);
if (toolTip!=undefined) {
this.i_tips[index].tip(toolTip);
}
}
return this.i_cells[index];
}
DataListRow.prototype.getToolTip=function(index) {
return this.i_tips[index];
}
DataListRow.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_row!=undefined) {
this.i_row.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
DataListRow.handleMouseDown=function(e) {
ContextMenu.hideAll();
var bt=(e.which!=undefined ? e.which : e.button);
if (bt < 2) {
DataListRow.setupSelect=this.rowIndex();
DataListRow.ctrl=e.ctrlKey;
DataListRow.shft=e.shiftKey;
if(e.metaKey) {
DataListRow.ctrl=true;
}
if (!this.parent().rowSelected(this.rowIndex())) {
if (!this.parent().multiSelect()) {
this.parent().clearSelected();
this.parent().rowSelected(DataListRow.setupSelect, !this.parent().rowSelected(DataListRow.setupSelect));
}
else {
if (DataListRow.shft) {
this.parent().selectRange(DataListRow.setupSelect, (DataListRow.ctrl==true ? false : true));
}
else {
if (DataListRow.ctrl!=true) {
this.parent().clearSelected();
}
this.parent().rowSelected(DataListRow.setupSelect, !this.parent().rowSelected(DataListRow.setupSelect));
}
}
this.parent().refresh(true);
DataListRow.setupSelect=undefined;
}
if (DataListRow.ctrl!=true && DataListRow.shft!=true) {
e.returnValue=DataListRow.handleCustomEvent.call(e.originalScope, this, e, "onmousedown");
return e.returnValue;
}
}
}
DataListRow.handleMouseUp=function(e) {
var bt=(e.which!=undefined ? e.which : e.button);
if (bt < 2) {
if (DataListRow.setupSelect!=undefined) {
if (!this.parent().multiSelect()) {
this.parent().clearSelected();
this.parent().rowSelected(DataListRow.setupSelect, !this.parent().rowSelected(DataListRow.setupSelect));
}
else {
if (DataListRow.shft) {
this.parent().selectRange(DataListRow.setupSelect, (DataListRow.ctrl==true ? false : true));
}
else {
if (DataListRow.ctrl!=true) {
this.parent().clearSelected();
}
this.parent().rowSelected(DataListRow.setupSelect, !this.parent().rowSelected(DataListRow.setupSelect));
}
}
this.parent().refresh(true);
DataListRow.setupSelect=undefined;
}
if (DataListRow.ctrl!=true && e.shiftKey!=true) {
e.returnValue=DataListRow.handleCustomEvent.call(e.originalScope, this, e, "onmouseup");
return e.returnValue;
}
}
}
DataListRow.handleMouseOver=function(e) {
e.returnValue=DataListRow.handleCustomEvent.call(e.originalScope, this, e, "onmouseover");
return e.returnValue;
}
DataListRow.handleMouseOut=function(e) {
e.returnValue=DataListRow.handleCustomEvent.call(e.originalScope, this, e, "onmouseout");
return e.returnValue;
}
DataListRow.handleClick=function(e) {
e.returnValue=DataListRow.handleCustomEvent.call(e.originalScope, this, e, "onclick");
return e.returnValue;
}
DataListRow.handleDblClick=function(e) {
e.returnValue=DataListRow.handleCustomEvent.call(e.originalScope, this, e, "ondblclick");
return e.returnValue;
}
DataListRow.handleContextMenu=function(e) {
e.returnValue=DataListRow.handleCustomEvent.call(e.originalScope, this, e, "oncontextmenu", true);
return e.returnValue;
}
DataListRow.handleCustomEvent=function(parent, e, eventName, cancel) {
var me=parent;
var head=this.pHead;
var actualHeader;
var cx;
if (head!=undefined) {
for (var x=0; x < me.parent().i_headers.length; x++) {
if (me.parent().i_headers[x].id()==head) {
actualHeader=me.parent().i_headers[x];			
}
}
cx=me.entry().param(actualHeader);
}
var ret;
if (cancel==true) {
}
if (cx!=undefined) {
if (cx[eventName]!=undefined) {
return cx[eventName](me.entry(), actualHeader, e);
}
else if (me.entry()[eventName]!=undefined) {
return me.entry()[eventName](me.entry(), actualHeader, e);
}
else if (actualHeader[eventName]!=undefined) {
return actualHeader[eventName](me.entry(), actualHeader, e);
}
else if (me.parent()[eventName]!=undefined) {
return me.parent()[eventName](me.entry(), actualHeader, e);
}
}
else {
if (me.entry()[eventName]!=undefined) {
return me.entry()[eventName](me.entry(), actualHeader, e);
}
else if (me.parent()[eventName]!=undefined) {
return me.parent()[eventName](me.entry(), actualHeader, e);
}
}
e.cancelBubble=false;
return true;
}
DataListRow.prototype.getRow=DataListRow.prototype.getItem=function() {
if (this.i_row==undefined) {
this.i_row=document.createElement('DIV');
this.i_row.className="DataList_entry"+(this.rowSelected()==true ? "_selected" : "")+((!this.rowSelected() && this.stripe()!=undefined) ? " "+this.stripe() : "")+(this.rowStyle()!=undefined ? " "+this.rowStyle() : "");
this.i_row.style.height=this.parent().rowHeight()+"px";
if (this.i_entry!=undefined) {
this.entry(this.i_entry);
}
}
return this.i_row;
}
DataListRow.prototype.updateDimensions=function() {
var z=0;
for (var x=0; x < this.parent().i_headers.length; x++) {
if (this.parent().i_headers[x].visible()) {
var headerWidth=this.parent().i_headers[x].effectiveWidth();
if(headerWidth==undefined) {
headerWidth=0;
}
var styleWidth=(headerWidth - (x==this.parent().i_headers.length - 1 ? DataList.rowPadding : 0));
this.getCell(this.parent().i_headers[x].id()).style.width=(styleWidth > 0 ? styleWidth : 0)+"px";
}
}
}
function DataListEntry(id) {
this.i_id=id;			
this.i_params=Array();	
this.i_style="";
}
DataListEntry.prototype.onclick;
DataListEntry.prototype.onmousedown;
DataListEntry.prototype.onmouseup;
DataListEntry.prototype.onmouseover;
DataListEntry.prototype.onmouseout;
DataListEntry.prototype.entryStyle=function(css_name) {
if (css_name!=undefined) {
this.i_style=css_name;
var r=this.activeRow();
if (r!=undefined) {
r.rowStyle(css_name);
}
}
return this.i_style;
}
DataListEntry.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
DataListEntry.prototype.activeRow=function(row) {
if (row!=undefined) {
this.i_active_row=row;
}
if (this.i_active_row!=undefined && this.i_active_row.entry()==this) {
return this.i_active_row;
}
else {
this.i_active_row=undefined;
return undefined;
}
}
DataListEntry.prototype.param=function(header, value, tipText) {
if (value!=undefined) {
if (this.i_params[header.id()]==undefined) {
this.i_params[header.id()]=new DataListEntryParameter(this, header, (header.isNumeric() ? parseInt(value) : value), tipText);
}
else {
this.i_params[header.id()].value((header.isNumeric() ? parseInt(value) : value), tipText);
}
}
if (tipText!=undefined) {
if ((this.i_active_row!=undefined) && (header.id()!=undefined) && (this.i_active_row.getToolTip(header.id())!=undefined)) {
this.i_active_row.getToolTip(header.id()).tip(tipText);
}
}
return this.i_params[header.id()];
}
function DataListEntryParameter(p, header, value, tipText) {
this.i_header=header;			
this.i_value=value;			
this.i_parent=p;
this.i_tip_text=(tipText==undefined ? undefined : tipText);
}
DataListEntryParameter.prototype.onclick;
DataListEntryParameter.prototype.onmousedown;
DataListEntryParameter.prototype.onmouseover;
DataListEntryParameter.prototype.onmouseout;
DataListEntryParameter.prototype.iconClass=function(cssName) {
if (cssName!=undefined) {
this.i_icon_class=cssName;	
var cell=this.activeCell();
if (cell!=undefined) {
cell.className="DataList_entry_value "+cssName;
}
}
return this.i_icon_class;
}
DataListEntryParameter.prototype.activeCell=function() {
if (this.parent().activeRow()!=undefined) {
return this.parent().activeRow().getCell(this.header().id(), this.i_tip_text);
}
return undefined;
}
DataListEntryParameter.prototype.header=function() {
return this.i_header;
}
DataListEntryParameter.prototype.parent=function() {
return this.i_parent;
}
DataListEntryParameter.prototype.value=function(value, tipText) {
var cell=this.activeCell();
if ((cell==undefined) || (cell==null)) {
if (value!=undefined) {
this.i_value=value;
}
}
if (value!=undefined) {
this.i_value=value;
cell.innerHTML=this.header().filter(value);
}
if (tipText!=undefined) {
this.i_tip_text=tipText;
this.parent().activeRow().getToolTip(cell.pHead).tip(tipText);
} else {
if (this.parent().activeRow()!=undefined) {
if ((value==undefined) && (this.i_tip_text!=undefined)) {
this.parent().activeRow().getToolTip(cell.pHead).tip(this.i_tip_text);
} else {
this.parent().activeRow().getToolTip(cell.pHead).tip(this.header().filter(value));
}
}
}
return this.i_value;
}
JavaScriptResource.notifyComplete("./lib/components/Component.DataList.js");	
DateSelection=function (firstDayOfWeek, dateStr, onSelected, onClose) {
this.activeDiv=null;
this.currentDateEl=null;
this.getDateStatus=null;
this.timeout=null;
this.onSelected=onSelected || null;
this.onClose=onClose || null;
this.dragging=false;
this.hidden=false;
this.minYear=1970;
this.maxYear=2050;
this.dateFormat=DateSelection._TT["DEF_DATE_FORMAT"];
this.ttDateFormat=DateSelection._TT["TT_DATE_FORMAT"];
this.isPopup=true;
this.weekNumbers=true;
this.firstDayOfWeek=firstDayOfWeek; 
this.showsOtherMonths=false;
this.dateStr=dateStr;
this.ar_days=null;
this.showsTime=false;
this.time24=true;
this.yearStep=1;
this.table=null;
this.element=null;
this.tbody=null;
this.firstdayname=null;
this.monthsCombo=null;
this.yearsCombo=null;
this.hilitedMonth=null;
this.activeMonth=null;
this.hilitedYear=null;
this.activeYear=null;
this.dateClicked=false;
if (typeof DateSelection._SDN=="undefined") {
if (typeof DateSelection._SDN_len=="undefined")
DateSelection._SDN_len=3;
var ar=new Array();
for (var i=8; i > 0;) {
ar[--i]=DateSelection._DN[i].substr(0, DateSelection._SDN_len);
}
DateSelection._SDN=ar;
if (typeof DateSelection._SMN_len=="undefined")
DateSelection._SMN_len=3;
ar=new Array();
for (var i=12; i > 0;) {
ar[--i]=DateSelection._MN[i].substr(0, DateSelection._SMN_len);
}
DateSelection._SMN=ar;
}
};
DateSelection._C=null;
DateSelection.is_ie=(/msie/i.test(navigator.userAgent) &&
!/opera/i.test(navigator.userAgent));
DateSelection.is_ie5=(DateSelection.is_ie && /msie 5\.0/i.test(navigator.userAgent));
DateSelection.is_opera=/opera/i.test(navigator.userAgent);
DateSelection.is_khtml=/Konqueror|Safari|KHTML/i.test(navigator.userAgent);
DateSelection.getAbsolutePos=function(el) {
var SL=0, ST=0;
var is_div=/^div$/i.test(el.tagName);
if (is_div && el.scrollLeft)
SL=el.scrollLeft;
if (is_div && el.scrollTop)
ST=el.scrollTop;
var r={ x: el.offsetLeft - SL, y: el.offsetTop - ST };
if (el.offsetParent) {
var tmp=this.getAbsolutePos(el.offsetParent);
r.x+=tmp.x;
r.y+=tmp.y;
}
return r;
};
DateSelection.isRelated=function (el, evt) {
var related=evt.relatedTarget;
if (!related) {
var type=evt.type;
if (type=="mouseover") {
related=evt.fromElement;
} else if (type=="mouseout") {
related=evt.toElement;
}
}
while (related) {
if (related==el) {
return true;
}
related=related.parentNode;
}
return false;
};
DateSelection.removeClass=function(el, className) {
if (!(el && el.className)) {
return;
}
var cls=el.className.split(" ");
var ar=new Array();
for (var i=cls.length; i > 0;) {
if (cls[--i]!=className) {
ar[ar.length]=cls[i];
}
}
el.className=ar.join(" ");
};
DateSelection.addClass=function(el, className) {
DateSelection.removeClass(el, className);
el.className+=" "+className;
};
DateSelection.getElement=function(ev) {
if (DateSelection.is_ie) {
return window.event.srcElement;
} else {
return ev.currentTarget;
}
};
DateSelection.getTargetElement=function(ev) {
if (DateSelection.is_ie) {
return window.event.srcElement;
} else {
return ev.target;
}
};
DateSelection.stopEvent=function(ev) {
ev || (ev=window.event);
if (DateSelection.is_ie) {
ev.cancelBubble=true;
ev.returnValue=false;
} else {
ev.preventDefault();
ev.stopPropagation();
}
return false;
};
DateSelection.addEvent=function(el, evname, func) {
if (el.attachEvent) { 
el.attachEvent("on"+evname, func);
} else if (el.addEventListener) { 
el.addEventListener(evname, func, true);
} else {
el["on"+evname]=func;
}
};
DateSelection.removeEvent=function(el, evname, func) {
if (el.detachEvent) { 
el.detachEvent("on"+evname, func);
} else if (el.removeEventListener) { 
el.removeEventListener(evname, func, true);
} else {
el["on"+evname]=null;
}
};
DateSelection.createElement=function(type, parent) {
var el=null;
if (document.createElementNS) {
el=document.createElementNS("http://www.w3.org/1999/xhtml", type);
} else {
el=document.createElement(type);
}
if (typeof parent!="undefined") {
parent.appendChild(el);
}
return el;
};
DateSelection._add_evs=function(el) {
with (DateSelection) {
addEvent(el, "mouseover", dayMouseOver);
addEvent(el, "mousedown", dayMouseDown);
addEvent(el, "mouseout", dayMouseOut);
if (is_ie) {
addEvent(el, "dblclick", dayMouseDblClick);
el.setAttribute("unselectable", true);
}
}
};
DateSelection.findMonth=function(el) {
if (typeof el.month!="undefined") {
return el;
} else if (typeof el.parentNode.month!="undefined") {
return el.parentNode;
}
return null;
};
DateSelection.findYear=function(el) {
if (typeof el.year!="undefined") {
return el;
} else if (typeof el.parentNode.year!="undefined") {
return el.parentNode;
}
return null;
};
DateSelection.showMonthsCombo=function () {
var cal=DateSelection._C;
if (!cal) {
return false;
}
var cal=cal;
var cd=cal.activeDiv;
var mc=cal.monthsCombo;
if (cal.hilitedMonth) {
DateSelection.removeClass(cal.hilitedMonth, "hilite");
}
if (cal.activeMonth) {
DateSelection.removeClass(cal.activeMonth, "active");
}
var mon=cal.monthsCombo.getElementsByTagName("div")[cal.date.getMonth()];
DateSelection.addClass(mon, "active");
cal.activeMonth=mon;
var s=mc.style;
s.display="block";
if (cd.navtype < 0)
s.left=cd.offsetLeft+"px";
else {
var mcw=mc.offsetWidth;
if (typeof mcw=="undefined")
mcw=50;
s.left=(cd.offsetLeft+cd.offsetWidth - mcw)+"px";
}
s.top=(cd.offsetTop+cd.offsetHeight)+"px";
};
DateSelection.showYearsCombo=function (fwd) {
var cal=DateSelection._C;
if (!cal) {
return false;
}
var cal=cal;
var cd=cal.activeDiv;
var yc=cal.yearsCombo;
if (cal.hilitedYear) {
DateSelection.removeClass(cal.hilitedYear, "hilite");
}
if (cal.activeYear) {
DateSelection.removeClass(cal.activeYear, "active");
}
cal.activeYear=null;
var Y=cal.date.getFullYear()+(fwd ? 1 : -1);
var yr=yc.firstChild;
var show=false;
for (var i=12; i > 0; --i) {
if (Y >=cal.minYear && Y <=cal.maxYear) {
yr.firstChild.data=Y;
yr.year=Y;
yr.style.display="block";
show=true;
} else {
yr.style.display="none";
}
yr=yr.nextSibling;
Y+=fwd ? cal.yearStep : -cal.yearStep;
}
if (show) {
var s=yc.style;
s.display="block";
if (cd.navtype < 0)
s.left=cd.offsetLeft+"px";
else {
var ycw=yc.offsetWidth;
if (typeof ycw=="undefined")
ycw=50;
s.left=(cd.offsetLeft+cd.offsetWidth - ycw)+"px";
}
s.top=(cd.offsetTop+cd.offsetHeight)+"px";
}
};
DateSelection.tableMouseUp=function(ev) {
var cal=DateSelection._C;
if (!cal) {
return false;
}
if (cal.timeout) {
clearTimeout(cal.timeout);
}
var el=cal.activeDiv;
if (!el) {
return false;
}
var target=DateSelection.getTargetElement(ev);
ev || (ev=window.event);
DateSelection.removeClass(el, "active");
if (target==el || target.parentNode==el) {
DateSelection.cellClick(el, ev);
}
var mon=DateSelection.findMonth(target);
var date=null;
if (mon) {
date=new Date(cal.date);
if (mon.month!=date.getMonth()) {
date.setMonth(mon.month);
cal.setDate(date);
cal.dateClicked=false;
cal.callHandler();
}
} else {
var year=DateSelection.findYear(target);
if (year) {
date=new Date(cal.date);
if (year.year!=date.getFullYear()) {
date.setFullYear(year.year);
cal.setDate(date);
cal.dateClicked=false;
cal.callHandler();
}
}
}
with (DateSelection) {
removeEvent(document, "mouseup", tableMouseUp);
removeEvent(document, "mouseover", tableMouseOver);
removeEvent(document, "mousemove", tableMouseOver);
cal._hideCombos();
_C=null;
return stopEvent(ev);
}
};
DateSelection.tableMouseOver=function (ev) {
var cal=DateSelection._C;
if (!cal) {
return;
}
var el=cal.activeDiv;
var target=DateSelection.getTargetElement(ev);
if (target==el || target.parentNode==el) {
DateSelection.addClass(el, "hilite active");
DateSelection.addClass(el.parentNode, "rowhilite");
} else {
if (typeof el.navtype=="undefined" || (el.navtype!=50 && (el.navtype==0 || Math.abs(el.navtype) > 2)))
DateSelection.removeClass(el, "active");
DateSelection.removeClass(el, "hilite");
DateSelection.removeClass(el.parentNode, "rowhilite");
}
ev || (ev=window.event);
if (el.navtype==50 && target!=el) {
var pos=DateSelection.getAbsolutePos(el);
var w=el.offsetWidth;
var x=ev.clientX;
var dx;
var decrease=true;
if (x > pos.x+w) {
dx=x - pos.x - w;
decrease=false;
} else
dx=pos.x - x;
if (dx < 0) dx=0;
var range=el._range;
var current=el._current;
var count=Math.floor(dx / 10) % range.length;
for (var i=range.length; --i >=0;)
if (range[i]==current)
break;
while (count-- > 0)
if (decrease) {
if (--i < 0)
i=range.length - 1;
} else if (++i >=range.length)
i=0;
var newval=range[i];
el.firstChild.data=newval;
cal.onUpdateTime();
}
var mon=DateSelection.findMonth(target);
if (mon) {
if (mon.month!=cal.date.getMonth()) {
if (cal.hilitedMonth) {
DateSelection.removeClass(cal.hilitedMonth, "hilite");
}
DateSelection.addClass(mon, "hilite");
cal.hilitedMonth=mon;
} else if (cal.hilitedMonth) {
DateSelection.removeClass(cal.hilitedMonth, "hilite");
}
} else {
if (cal.hilitedMonth) {
DateSelection.removeClass(cal.hilitedMonth, "hilite");
}
var year=DateSelection.findYear(target);
if (year) {
if (year.year!=cal.date.getFullYear()) {
if (cal.hilitedYear) {
DateSelection.removeClass(cal.hilitedYear, "hilite");
}
DateSelection.addClass(year, "hilite");
cal.hilitedYear=year;
} else if (cal.hilitedYear) {
DateSelection.removeClass(cal.hilitedYear, "hilite");
}
} else if (cal.hilitedYear) {
DateSelection.removeClass(cal.hilitedYear, "hilite");
}
}
return DateSelection.stopEvent(ev);
};
DateSelection.tableMouseDown=function (ev) {
if (DateSelection.getTargetElement(ev)==DateSelection.getElement(ev)) {
return DateSelection.stopEvent(ev);
}
};
DateSelection.calDragIt=function (ev) {
var cal=DateSelection._C;
if (!(cal && cal.dragging)) {
return false;
}
var posX;
var posY;
if (DateSelection.is_ie) {
posY=window.event.clientY+document.body.scrollTop;
posX=window.event.clientX+document.body.scrollLeft;
} else {
posX=ev.pageX;
posY=ev.pageY;
}
cal.hideShowCovered();
var st=cal.element.style;
st.left=(posX - cal.xOffs)+"px";
st.top=(posY - cal.yOffs)+"px";
return DateSelection.stopEvent(ev);
};
DateSelection.calDragEnd=function (ev) {
var cal=DateSelection._C;
if (!cal) {
return false;
}
cal.dragging=false;
with (DateSelection) {
removeEvent(document, "mousemove", calDragIt);
removeEvent(document, "mouseup", calDragEnd);
tableMouseUp(ev);
}
cal.hideShowCovered();
};
DateSelection.dayMouseDown=function(ev) {
var el=DateSelection.getElement(ev);
if (el.disabled) {
return false;
}
var cal=el.calendar;
cal.activeDiv=el;
DateSelection._C=cal;
if (el.navtype!=300) with (DateSelection) {
if (el.navtype==50) {
el._current=el.firstChild.data;
addEvent(document, "mousemove", tableMouseOver);
} else
addEvent(document, DateSelection.is_ie5 ? "mousemove" : "mouseover", tableMouseOver);
addClass(el, "hilite active");
addEvent(document, "mouseup", tableMouseUp);
} else if (cal.isPopup) {
cal._dragStart(ev);
}
if (el.navtype==-1 || el.navtype==1) {
if (cal.timeout) clearTimeout(cal.timeout);
cal.timeout=setTimeout("DateSelection.showMonthsCombo()", 250);
} else if (el.navtype==-2 || el.navtype==2) {
if (cal.timeout) clearTimeout(cal.timeout);
cal.timeout=setTimeout((el.navtype > 0) ? "DateSelection.showYearsCombo(true)" : "DateSelection.showYearsCombo(false)", 250);
} else {
cal.timeout=null;
}
return DateSelection.stopEvent(ev);
};
DateSelection.dayMouseDblClick=function(ev) {
DateSelection.cellClick(DateSelection.getElement(ev), ev || window.event);
if (DateSelection.is_ie) {
document.selection.empty();
}
};
DateSelection.dayMouseOver=function(ev) {
var el=DateSelection.getElement(ev);
if (DateSelection.isRelated(el, ev) || DateSelection._C || el.disabled) {
return false;
}
if (el.ttip) {
if (el.ttip.substr(0, 1)=="_") {
el.ttip=el.caldate.print(el.calendar.ttDateFormat)+el.ttip.substr(1);
}
el.calendar.tooltips.firstChild.data=el.ttip;
}
if (el.navtype!=300) {
DateSelection.addClass(el, "hilite");
if (el.caldate) {
DateSelection.addClass(el.parentNode, "rowhilite");
}
}
return DateSelection.stopEvent(ev);
};
DateSelection.dayMouseOut=function(ev) {
with (DateSelection) {
var el=getElement(ev);
if (isRelated(el, ev) || _C || el.disabled) {
return false;
}
removeClass(el, "hilite");
if (el.caldate) {
removeClass(el.parentNode, "rowhilite");
}
el.calendar.tooltips.firstChild.data=_TT["SEL_DATE"];
return stopEvent(ev);
}
};
DateSelection.cellClick=function(el, ev) {
var cal=el.calendar;
var closing=false;
var newdate=false;
var date=null;
if (typeof el.navtype=="undefined") {
DateSelection.removeClass(cal.currentDateEl, "selected");
DateSelection.addClass(el, "selected");
closing=(cal.currentDateEl==el);
if (!closing) {
cal.currentDateEl=el;
}
cal.date=new Date(el.caldate);
date=cal.date;
newdate=true;
if (!(cal.dateClicked=!el.otherMonth))
cal._init(cal.firstDayOfWeek, date);
} else {
if (el.navtype==200) {
DateSelection.removeClass(el, "hilite");
cal.callCloseHandler();
return;
}
date=(el.navtype==0) ? new Date() : new Date(cal.date);
cal.dateClicked=false;
var year=date.getFullYear();
var mon=date.getMonth();
function setMonth(m) {
var day=date.getDate();
var max=date.getMonthDays(m);
if (day > max) {
date.setDate(max);
}
date.setMonth(m);
};
switch (el.navtype) {
case 400:
DateSelection.removeClass(el, "hilite");
var text=DateSelection._TT["ABOUT"];
if (typeof text!="undefined") {
text+=cal.showsTime ? DateSelection._TT["ABOUT_TIME"] : "";
} else {
text="Help and about box text is not translated into this language.\n"+"If you know this language and you feel generous please update\n"+"the corresponding file in \"lang\" subdir to match calendar-en.js\n"+"and send it back to <mishoo@infoiasi.ro> to get it into the distribution  ;-)\n\n"+"Thank you!\n"+"http://dynarch.com/mishoo/calendar.epl\n";
}
return;
case -2:
if (year > cal.minYear) {
date.setFullYear(year - 1);
}
break;
case -1:
if (mon > 0) {
setMonth(mon - 1);
} else if (year-- > cal.minYear) {
date.setFullYear(year);
setMonth(11);
}
break;
case 1:
if (mon < 11) {
setMonth(mon+1);
} else if (year < cal.maxYear) {
date.setFullYear(year+1);
setMonth(0);
}
break;
case 2:
if (year < cal.maxYear) {
date.setFullYear(year+1);
}
break;
case 100:
cal.setFirstDayOfWeek(el.fdow);
return;
case 50:
var range=el._range;
var current=el.firstChild.data;
for (var i=range.length; --i >=0;)
if (range[i]==current)
break;
if (ev && ev.shiftKey) {
if (--i < 0)
i=range.length - 1;
} else if (++i >=range.length)
i=0;
var newval=range[i];
el.firstChild.data=newval;
cal.onUpdateTime();
return;
case 0:
if ((typeof cal.getDateStatus=="function") && cal.getDateStatus(date, date.getFullYear(), date.getMonth(), date.getDate())) {
return false;
}
break;
}
if (!date.equalsTo(cal.date)) {
cal.setDate(date);
newdate=true;
}
}
if (newdate) {
cal.callHandler();
}
if (closing) {
DateSelection.removeClass(el, "hilite");
cal.callCloseHandler();
}
};
DateSelection.prototype.create=function (_par) {
var parent=null;
if (! _par) {
parent=document.getElementsByTagName("body")[0];
this.isPopup=true;
} else {
parent=_par;
this.isPopup=false;
}
this.date=this.dateStr ? new Date(this.dateStr) : new Date();
var table=DateSelection.createElement("table");
this.table=table;
table.cellSpacing=0;
table.cellPadding=0;
table.calendar=this;
DateSelection.addEvent(table, "mousedown", DateSelection.tableMouseDown);
var div=DateSelection.createElement("div");
this.element=div;
div.className="jscal";
if (this.isPopup) {
div.style.position="absolute";
div.style.display="none";
}
div.appendChild(table);
var thead=DateSelection.createElement("thead", table);
var cell=null;
var row=null;
var cal=this;
var hh=function (text, cs, navtype) {
cell=DateSelection.createElement("td", row);
cell.colSpan=cs;
cell.className="button";
if (navtype!=0 && Math.abs(navtype) <=2)
cell.className+=" nav";
DateSelection._add_evs(cell);
cell.calendar=cal;
cell.navtype=navtype;
if (text.substr(0, 1)!="&") {
cell.appendChild(document.createTextNode(text));
}
else {
cell.innerHTML=text;
}
return cell;
};
row=DateSelection.createElement("tr", thead);
var title_length=6;
(this.isPopup) && --title_length;
(this.weekNumbers) &&++title_length;
hh("?", 1, 400).ttip=DateSelection._TT["INFO"];
this.title=hh("", title_length, 300);
this.title.className="title";
if (this.isPopup) {
this.title.ttip=DateSelection._TT["DRAG_TO_MOVE"];
this.title.style.cursor="move";
hh("&#x00d7;", 1, 200).ttip=DateSelection._TT["CLOSE"];
}
row=DateSelection.createElement("tr", thead);
row.className="headrow";
this._nav_py=hh("&#x00ab;", 1, -2);
this._nav_py.ttip=DateSelection._TT["PREV_YEAR"];
this._nav_pm=hh("&#x2039;", 1, -1);
this._nav_pm.ttip=DateSelection._TT["PREV_MONTH"];
this._nav_now=hh(DateSelection._TT["TODAY"], this.weekNumbers ? 4 : 3, 0);
this._nav_now.ttip=DateSelection._TT["GO_TODAY"];
this._nav_nm=hh("&#x203a;", 1, 1);
this._nav_nm.ttip=DateSelection._TT["NEXT_MONTH"];
this._nav_ny=hh("&#x00bb;", 1, 2);
this._nav_ny.ttip=DateSelection._TT["NEXT_YEAR"];
row=DateSelection.createElement("tr", thead);
row.className="daynames";
if (this.weekNumbers) {
cell=DateSelection.createElement("td", row);
cell.className="name wn";
cell.appendChild(document.createTextNode(DateSelection._TT["WK"]));
}
for (var i=7; i > 0; --i) {
cell=DateSelection.createElement("td", row);
cell.appendChild(document.createTextNode(""));
if (!i) {
cell.navtype=100;
cell.calendar=this;
DateSelection._add_evs(cell);
}
}
this.firstdayname=(this.weekNumbers) ? row.firstChild.nextSibling : row.firstChild;
this._displayWeekdays();
var tbody=DateSelection.createElement("tbody", table);
this.tbody=tbody;
for (var i=6; i > 0; --i) {
row=DateSelection.createElement("tr", tbody);
if (this.weekNumbers) {
cell=DateSelection.createElement("td", row);
cell.appendChild(document.createTextNode(""));
}
for (var j=7; j > 0; --j) {
cell=DateSelection.createElement("td", row);
cell.appendChild(document.createTextNode(""));
cell.calendar=this;
DateSelection._add_evs(cell);
}
}
if (this.showsTime) {
row=DateSelection.createElement("tr", tbody);
row.className="time";
cell=DateSelection.createElement("td", row);
cell.className="time";
cell.colSpan=2;
cell.innerHTML=DateSelection._TT["TIME"] || "&nbsp;";
cell=DateSelection.createElement("td", row);
cell.className="time";
cell.colSpan=this.weekNumbers ? 4 : 3;
(function(){
function makeTimePart(className, init, range_start, range_end) {
var part=DateSelection.createElement("span", cell);
part.className=className;
part.appendChild(document.createTextNode(init));
part.calendar=cal;
part.ttip=DateSelection._TT["TIME_PART"];
part.navtype=50;
part._range=[];
if (typeof range_start!="number")
part._range=range_start;
else {
for (var i=range_start; i <=range_end;++i) {
var txt;
if (i < 10 && range_end >=10) txt='0'+i;
else txt=''+i;
part._range[part._range.length]=txt;
}
}
DateSelection._add_evs(part);
return part;
};
var hrs=cal.date.getHours();
var mins=cal.date.getMinutes();
var t12=!cal.time24;
var pm=(hrs > 12);
if (t12 && pm) hrs -=12;
var H=makeTimePart("hour", hrs, t12 ? 1 : 0, t12 ? 12 : 23);
var span=DateSelection.createElement("span", cell);
span.appendChild(document.createTextNode(":"));
span.className="colon";
var M=makeTimePart("minute", mins, 0, 59);
var AP=null;
cell=DateSelection.createElement("td", row);
cell.className="time";
cell.colSpan=2;
if (t12)
AP=makeTimePart("ampm", pm ? "pm" : "am", ["am", "pm"]);
else
cell.innerHTML="&nbsp;";
cal.onSetTime=function() {
var hrs=this.date.getHours();
var mins=this.date.getMinutes();
var pm=(hrs > 12);
if (pm && t12) hrs -=12;
H.firstChild.data=(hrs < 10) ? ("0"+hrs) : hrs;
M.firstChild.data=(mins < 10) ? ("0"+mins) : mins;
if (t12)
AP.firstChild.data=pm ? "pm" : "am";
};
cal.onUpdateTime=function() {
var date=this.date;
var h=parseInt(H.firstChild.data, 10);
if (t12) {
if (/pm/i.test(AP.firstChild.data) && h < 12)
h+=12;
else if (/am/i.test(AP.firstChild.data) && h==12)
h=0;
}
var d=date.getDate();
var m=date.getMonth();
var y=date.getFullYear();
date.setHours(h);
date.setMinutes(parseInt(M.firstChild.data, 10));
date.setFullYear(y);
date.setMonth(m);
date.setDate(d);
this.dateClicked=false;
this.callHandler();
};
})();
} else {
this.onSetTime=this.onUpdateTime=function() {};
}
var tfoot=DateSelection.createElement("tfoot", table);
row=DateSelection.createElement("tr", tfoot);
row.className="footrow";
cell=hh(DateSelection._TT["SEL_DATE"], this.weekNumbers ? 8 : 7, 300);
cell.className="ttip";
if (this.isPopup) {
cell.ttip=DateSelection._TT["DRAG_TO_MOVE"];
cell.style.cursor="move";
}
this.tooltips=cell;
div=DateSelection.createElement("div", this.element);
this.monthsCombo=div;
div.className="combo";
for (var i=0; i < DateSelection._MN.length;++i) {
var mn=DateSelection.createElement("div");
mn.className=DateSelection.is_ie ? "label-IEfix" : "label";
mn.month=i;
mn.appendChild(document.createTextNode(DateSelection._SMN[i]));
div.appendChild(mn);
}
div=DateSelection.createElement("div", this.element);
this.yearsCombo=div;
div.className="combo";
for (var i=12; i > 0; --i) {
var yr=DateSelection.createElement("div");
yr.className=DateSelection.is_ie ? "label-IEfix" : "label";
yr.appendChild(document.createTextNode(""));
div.appendChild(yr);
}
this._init(this.firstDayOfWeek, this.date);
parent.appendChild(this.element);
};
DateSelection._keyEvent=function(ev) {
if (!window.calendar) {
return false;
}
(DateSelection.is_ie) && (ev=window.event);
var cal=window.calendar;
var act=(DateSelection.is_ie || ev.type=="keypress");
if (ev.ctrlKey) {
switch (ev.keyCode) {
case 37: 
act && DateSelection.cellClick(cal._nav_pm);
break;
case 38: 
act && DateSelection.cellClick(cal._nav_py);
break;
case 39: 
act && DateSelection.cellClick(cal._nav_nm);
break;
case 40: 
act && DateSelection.cellClick(cal._nav_ny);
break;
default:
return false;
}
} else switch (ev.keyCode) {
case 32: 
DateSelection.cellClick(cal._nav_now);
break;
case 27: 
act && cal.callCloseHandler();
break;
case 37: 
case 38: 
case 39: 
case 40: 
if (act) {
var date=cal.date.getDate() - 1;
var el=cal.currentDateEl;
var ne=null;
var prev=(ev.keyCode==37) || (ev.keyCode==38);
switch (ev.keyCode) {
case 37: 
(--date >=0) && (ne=cal.ar_days[date]);
break;
case 38: 
date -=7;
(date >=0) && (ne=cal.ar_days[date]);
break;
case 39: 
(++date < cal.ar_days.length) && (ne=cal.ar_days[date]);
break;
case 40: 
date+=7;
(date < cal.ar_days.length) && (ne=cal.ar_days[date]);
break;
}
if (!ne) {
if (prev) {
DateSelection.cellClick(cal._nav_pm);
} else {
DateSelection.cellClick(cal._nav_nm);
}
date=(prev) ? cal.date.getMonthDays() : 1;
el=cal.currentDateEl;
ne=cal.ar_days[date - 1];
}
DateSelection.removeClass(el, "selected");
DateSelection.addClass(ne, "selected");
cal.date=new Date(ne.caldate);
cal.callHandler();
cal.currentDateEl=ne;
}
break;
case 13: 
if (act) {
cal.callHandler();
cal.hide();
}
break;
default:
return false;
}
return DateSelection.stopEvent(ev);
};
DateSelection.prototype._init=function (firstDayOfWeek, date) {
var today=new Date();
this.table.style.visibility="hidden";
var year=date.getFullYear();
if (year < this.minYear) {
year=this.minYear;
date.setFullYear(year);
} else if (year > this.maxYear) {
year=this.maxYear;
date.setFullYear(year);
}
this.firstDayOfWeek=firstDayOfWeek;
this.date=new Date(date);
var month=date.getMonth();
var mday=date.getDate();
var no_days=date.getMonthDays();
date.setDate(1);
var day1=(date.getDay() - this.firstDayOfWeek) % 7;
if (day1 < 0)
day1+=7;
date.setDate(-day1);
date.setDate(date.getDate()+1);
var row=this.tbody.firstChild;
var MN=DateSelection._SMN[month];
var ar_days=new Array();
var weekend=DateSelection._TT["WEEKEND"];
for (var i=0; i < 6;++i, row=row.nextSibling) {
var cell=row.firstChild;
if (this.weekNumbers) {
cell.className="day wn";
cell.firstChild.data=date.getWeekNumber();
cell=cell.nextSibling;
}
row.className="daysrow";
var hasdays=false;
for (var j=0; j < 7;++j, cell=cell.nextSibling, date.setDate(date.getDate()+1)) {
var iday=date.getDate();
var wday=date.getDay();
cell.className="day";
var current_month=(date.getMonth()==month);
if (!current_month) {
if (this.showsOtherMonths) {
cell.className+=" othermonth";
cell.otherMonth=true;
} else {
cell.className="emptycell";
cell.innerHTML="&nbsp;";
cell.disabled=true;
continue;
}
} else {
cell.otherMonth=false;
hasdays=true;
}
cell.disabled=false;
cell.firstChild.data=iday;
if (typeof this.getDateStatus=="function") {
var status=this.getDateStatus(date, year, month, iday);
if (status===true) {
cell.className+=" disabled";
cell.disabled=true;
} else {
if (/disabled/i.test(status))
cell.disabled=true;
cell.className+=" "+status;
}
}
if (!cell.disabled) {
ar_days[ar_days.length]=cell;
cell.caldate=new Date(date);
cell.ttip="_";
if (current_month && iday==mday) {
cell.className+=" selected";
this.currentDateEl=cell;
}
if (date.getFullYear()==today.getFullYear() &&
date.getMonth()==today.getMonth() &&
iday==today.getDate()) {
cell.className+=" today";
cell.ttip+=DateSelection._TT["PART_TODAY"];
}
if (weekend.indexOf(wday.toString())!=-1) {
cell.className+=cell.otherMonth ? " oweekend" : " weekend";
}
}
}
if (!(hasdays || this.showsOtherMonths))
row.className="emptyrow";
}
this.ar_days=ar_days;
this.title.firstChild.data=DateSelection._MN[month]+", "+year;
this.onSetTime();
this.table.style.visibility="visible";
};
DateSelection.prototype.setDate=function (date) {
if (!date.equalsTo(this.date)) {
this._init(this.firstDayOfWeek, date);
}
};
DateSelection.prototype.refresh=function () {
this._init(this.firstDayOfWeek, this.date);
};
DateSelection.prototype.setFirstDayOfWeek=function (firstDayOfWeek) {
this._init(firstDayOfWeek, this.date);
this._displayWeekdays();
};
DateSelection.prototype.setDateStatusHandler=DateSelection.prototype.setDisabledHandler=function (unaryFunction) {
this.getDateStatus=unaryFunction;
};
DateSelection.prototype.setRange=function (a, z) {
this.minYear=a;
this.maxYear=z;
};
DateSelection.prototype.callHandler=function () {
if (this.onSelected) {
this.onSelected(this, this.date.print(this.dateFormat));
}
};
DateSelection.prototype.callCloseHandler=function () {
if (this.onClose) {
this.onClose(this);
}
this.hideShowCovered();
};
DateSelection.prototype.destroy=function () {
var el=this.element.parentNode;
el.removeChild(this.element);
DateSelection._C=null;
window.calendar=null;
};
DateSelection.prototype.reparent=function (new_parent) {
var el=this.element;
el.parentNode.removeChild(el);
new_parent.appendChild(el);
};
DateSelection._checkCalendar=function(ev) {
if (!window.calendar) {
return false;
}
var el=DateSelection.is_ie ? DateSelection.getElement(ev) : DateSelection.getTargetElement(ev);
for (; el!=null && el!=calendar.element; el=el.parentNode);
if (el==null) {
window.calendar.callCloseHandler();
return DateSelection.stopEvent(ev);
}
};
DateSelection.prototype.show=function () {
var rows=this.table.getElementsByTagName("tr");
for (var i=rows.length; i > 0;) {
var row=rows[--i];
DateSelection.removeClass(row, "rowhilite");
var cells=row.getElementsByTagName("td");
for (var j=cells.length; j > 0;) {
var cell=cells[--j];
DateSelection.removeClass(cell, "hilite");
DateSelection.removeClass(cell, "active");
}
}
this.element.style.display="block";
this.hidden=false;
if (this.isPopup) {
window.calendar=this;
DateSelection.addEvent(document, "keydown", DateSelection._keyEvent);
DateSelection.addEvent(document, "keypress", DateSelection._keyEvent);
DateSelection.addEvent(document, "mousedown", DateSelection._checkCalendar);
}
this.hideShowCovered();
};
DateSelection.prototype.hide=function () {
if (this.isPopup) {
DateSelection.removeEvent(document, "keydown", DateSelection._keyEvent);
DateSelection.removeEvent(document, "keypress", DateSelection._keyEvent);
DateSelection.removeEvent(document, "mousedown", DateSelection._checkCalendar);
}
this.element.style.display="none";
this.hidden=true;
this.hideShowCovered();
};
DateSelection.prototype.showAt=function (x, y) {
var s=this.element.style;
s.left=x+"px";
s.top=y+"px";
this.show();
};
DateSelection.prototype.showAtElement=function (el, opts) {
var self=this;
var p=DateSelection.getAbsolutePos(el);
if (!opts || typeof opts!="string") {
this.showAt(p.x, p.y+el.offsetHeight);
return true;
}
function fixPosition(box) {
if (box.x < 0)
box.x=0;
if (box.y < 0)
box.y=0;
var cp=document.createElement("div");
var s=cp.style;
s.position="absolute";
s.right=s.bottom=s.width=s.height="0px";
document.body.appendChild(cp);
var br=DateSelection.getAbsolutePos(cp);
document.body.removeChild(cp);
if (DateSelection.is_ie) {
br.y+=document.body.scrollTop;
br.x+=document.body.scrollLeft;
} else {
br.y+=window.scrollY;
br.x+=window.scrollX;
}
var tmp=box.x+box.width - br.x;
if (tmp > 0) box.x -=tmp;
tmp=box.y+box.height - br.y;
if (tmp > 0) box.y -=tmp;
};
this.element.style.display="block";
DateSelection.continuation_for_khtml_browser=function() {
var w=self.element.offsetWidth;
var h=self.element.offsetHeight;
self.element.style.display="none";
var valign=opts.substr(0, 1);
var halign="l";
if (opts.length > 1) {
halign=opts.substr(1, 1);
}
switch (valign) {
case "T": p.y -=h; break;
case "B": p.y+=el.offsetHeight; break;
case "C": p.y+=(el.offsetHeight - h) / 2; break;
case "t": p.y+=el.offsetHeight - h; break;
case "b": break; 
}
switch (halign) {
case "L": p.x -=w; break;
case "R": p.x+=el.offsetWidth; break;
case "C": p.x+=(el.offsetWidth - w) / 2; break;
case "r": p.x+=el.offsetWidth - w; break;
case "l": break; 
}
p.width=w;
p.height=h+40;
self.monthsCombo.style.display="none";
fixPosition(p);
self.showAt(p.x, p.y);
};
if (DateSelection.is_khtml)
setTimeout("DateSelection.continuation_for_khtml_browser()", 10);
else
DateSelection.continuation_for_khtml_browser();
};
DateSelection.prototype.setDateFormat=function (str) {
this.dateFormat=str;
};
DateSelection.prototype.setTtDateFormat=function (str) {
this.ttDateFormat=str;
};
DateSelection.prototype.parseDate=function (str, fmt) {
var y=0;
var m=-1;
var d=0;
var a=str.split(/\W+/);
if (!fmt) {
fmt=this.dateFormat;
}
var b=fmt.match(/%./g);
var i=0, j=0;
var hr=0;
var min=0;
for (i=0; i < a.length;++i) {
if (!a[i])
continue;
switch (b[i]) {
case "%d":
case "%e":
d=parseInt(a[i], 10);
break;
case "%m":
m=parseInt(a[i], 10) - 1;
break;
case "%Y":
case "%y":
y=parseInt(a[i], 10);
(y < 100) && (y+=(y > 29) ? 1900 : 2000);
break;
case "%b":
case "%B":
for (j=0; j < 12;++j) {
if (DateSelection._MN[j].substr(0, a[i].length).toLowerCase()==a[i].toLowerCase()) { m=j; break; }
}
break;
case "%H":
case "%I":
case "%k":
case "%l":
hr=parseInt(a[i], 10);
break;
case "%P":
case "%p":
if (/pm/i.test(a[i]) && hr < 12)
hr+=12;
break;
case "%M":
min=parseInt(a[i], 10);
break;
}
}
if (y!=0 && m!=-1 && d!=0) {
this.setDate(new Date(y, m, d, hr, min, 0));
return;
}
y=0; m=-1; d=0;
for (i=0; i < a.length;++i) {
if (a[i].search(/[a-zA-Z]+/)!=-1) {
var t=-1;
for (j=0; j < 12;++j) {
if (DateSelection._MN[j].substr(0, a[i].length).toLowerCase()==a[i].toLowerCase()) { t=j; break; }
}
if (t!=-1) {
if (m!=-1) {
d=m+1;
}
m=t;
}
} else if (parseInt(a[i], 10) <=12 && m==-1) {
m=a[i]-1;
} else if (parseInt(a[i], 10) > 31 && y==0) {
y=parseInt(a[i], 10);
(y < 100) && (y+=(y > 29) ? 1900 : 2000);
} else if (d==0) {
d=a[i];
}
}
if (y==0) {
var today=new Date();
y=today.getFullYear();
}
if (m!=-1 && d!=0) {
this.setDate(new Date(y, m, d, hr, min, 0));
}
};
DateSelection.prototype.hideShowCovered=function () {
var self=this;
DateSelection.continuation_for_khtml_browser=function() {
function getVisib(obj){
var value=obj.style.visibility;
if (!value) {
if (document.defaultView && typeof (document.defaultView.getComputedStyle)=="function") { 
if (!DateSelection.is_khtml)
value=document.defaultView.
getComputedStyle(obj, "").getPropertyValue("visibility");
else
value='';
} else if (obj.currentStyle) { 
value=obj.currentStyle.visibility;
} else
value='';
}
return value;
};
var tags=new Array("applet", "select");
var el=self.element;
var p=DateSelection.getAbsolutePos(el);
var EX1=p.x;
var EX2=el.offsetWidth+EX1;
var EY1=p.y;
var EY2=el.offsetHeight+EY1;
for (var k=tags.length; k > 0;) {
var ar=document.getElementsByTagName(tags[--k]);
var cc=null;
for (var i=ar.length; i > 0;) {
cc=ar[--i];
p=DateSelection.getAbsolutePos(cc);
var CX1=p.x;
var CX2=cc.offsetWidth+CX1;
var CY1=p.y;
var CY2=cc.offsetHeight+CY1;
if (self.hidden || (CX1 > EX2) || (CX2 < EX1) || (CY1 > EY2) || (CY2 < EY1)) {
if (!cc.__msh_save_visibility) {
cc.__msh_save_visibility=getVisib(cc);
}
cc.style.visibility=cc.__msh_save_visibility;
} else {
if (!cc.__msh_save_visibility) {
cc.__msh_save_visibility=getVisib(cc);
}
cc.style.visibility="hidden";
}
}
}
};
if (DateSelection.is_khtml)
setTimeout("DateSelection.continuation_for_khtml_browser()", 10);
else
DateSelection.continuation_for_khtml_browser();
};
DateSelection.prototype._displayWeekdays=function () {
var fdow=this.firstDayOfWeek;
var cell=this.firstdayname;
var weekend=DateSelection._TT["WEEKEND"];
for (var i=0; i < 7;++i) {
cell.className="day name";
var realday=(i+fdow) % 7;
if (i) {
cell.ttip=DateSelection._TT["DAY_FIRST"].replace("%s", DateSelection._DN[realday]);
cell.navtype=100;
cell.calendar=this;
cell.fdow=realday;
DateSelection._add_evs(cell);
}
if (weekend.indexOf(realday.toString())!=-1) {
DateSelection.addClass(cell, "weekend");
}
cell.firstChild.data=DateSelection._SDN[(i+fdow) % 7];
cell=cell.nextSibling;
}
};
DateSelection.prototype._hideCombos=function () {
this.monthsCombo.style.display="none";
this.yearsCombo.style.display="none";
};
DateSelection.prototype._dragStart=function (ev) {
if (this.dragging) {
return;
}
this.dragging=true;
var posX;
var posY;
if (DateSelection.is_ie) {
posY=window.event.clientY+document.body.scrollTop;
posX=window.event.clientX+document.body.scrollLeft;
} else {
posY=ev.clientY+window.scrollY;
posX=ev.clientX+window.scrollX;
}
var st=this.element.style;
this.xOffs=posX - parseInt(st.left);
this.yOffs=posY - parseInt(st.top);
with (DateSelection) {
addEvent(document, "mousemove", calDragIt);
addEvent(document, "mouseup", calDragEnd);
}
};
Date._MD=new Array(31,28,31,30,31,30,31,31,30,31,30,31);
Date.SECOND=1000 ;
Date.MINUTE=60 * Date.SECOND;
Date.HOUR=60 * Date.MINUTE;
Date.DAY=24 * Date.HOUR;
Date.WEEK=7 * Date.DAY;
Date.prototype.getMonthDays=function(month) {
var year=this.getFullYear();
if (typeof month=="undefined") {
month=this.getMonth();
}
if (((0==(year%4)) && ((0!=(year%100)) || (0==(year%400)))) && month==1) {
return 29;
} else {
return Date._MD[month];
}
};
Date.prototype.getDayOfYear=function() {
var now=new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
var then=new Date(this.getFullYear(), 0, 0, 0, 0, 0);
var time=now - then;
return Math.floor(time / Date.DAY);
};
Date.prototype.getWeekNumber=function() {
var d=new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
var DoW=d.getDay();
d.setDate(d.getDate() - (DoW+6) % 7+3); 
var ms=d.valueOf(); 
d.setMonth(0);
d.setDate(4); 
return Math.round((ms - d.valueOf()) / (7 * 864e5))+1;
};
Date.prototype.equalsTo=function(date) {
return ((this.getFullYear()==date.getFullYear()) &&
(this.getMonth()==date.getMonth()) &&
(this.getDate()==date.getDate()) &&
(this.getHours()==date.getHours()) &&
(this.getMinutes()==date.getMinutes()));
};
Date.prototype.print=function (str) {
var m=this.getMonth();
var d=this.getDate();
var y=this.getFullYear();
var wn=this.getWeekNumber();
var w=this.getDay();
var s={};
var hr=this.getHours();
var pm=(hr >=12);
var ir=(pm) ? (hr - 12) : hr;
var dy=this.getDayOfYear();
if (ir==0)
ir=12;
var min=this.getMinutes();
var sec=this.getSeconds();
s["%a"]=DateSelection._SDN[w]; 
s["%A"]=DateSelection._DN[w]; 
s["%b"]=DateSelection._SMN[m]; 
s["%B"]=DateSelection._MN[m]; 
s["%C"]=1+Math.floor(y / 100); 
s["%d"]=(d < 10) ? ("0"+d) : d; 
s["%e"]=d; 
s["%H"]=(hr < 10) ? ("0"+hr) : hr; 
s["%I"]=(ir < 10) ? ("0"+ir) : ir; 
s["%j"]=(dy < 100) ? ((dy < 10) ? ("00"+dy) : ("0"+dy)) : dy; 
s["%k"]=hr;		
s["%l"]=ir;		
s["%m"]=(m < 9) ? ("0"+(1+m)) : (1+m); 
s["%M"]=(min < 10) ? ("0"+min) : min; 
s["%n"]="\n";		
s["%p"]=pm ? "PM" : "AM";
s["%P"]=pm ? "pm" : "am";
s["%s"]=Math.floor(this.getTime() / 1000);
s["%S"]=(sec < 10) ? ("0"+sec) : sec; 
s["%t"]="\t";		
s["%U"]=s["%W"]=s["%V"]=(wn < 10) ? ("0"+wn) : wn;
s["%u"]=w+1;	
s["%w"]=w;		
s["%y"]=(''+y).substr(2, 2); 
s["%Y"]=y;		
s["%%"]="%";		
var re=/%./g;
if (!DateSelection.is_ie5)
return str.replace(re, function (par) { return s[par] || par; });
var a=str.match(re);
for (var i=0; i < a.length; i++) {
var tmp=s[a[i]];
if (tmp) {
re=new RegExp(a[i], 'g');
str=str.replace(re, tmp);
}
}
return str;
};
Date.prototype.__msh_oldSetFullYear=Date.prototype.setFullYear;
Date.prototype.setFullYear=function(y) {
var d=new Date(this);
d.__msh_oldSetFullYear(y);
if (d.getMonth()!=this.getMonth())
this.setDate(28);
this.__msh_oldSetFullYear(y);
};
window.calendar=null;
DateSelection._DN=new Array
("Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday",
"Sunday");
DateSelection._SDN=new Array
("Sun",
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun");
DateSelection._MN=new Array
("January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December");
DateSelection._SMN=new Array
("Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec");
DateSelection._TT={};
DateSelection._TT["INFO"]="About the calendar";
DateSelection._TT["ABOUT"]="Date selection:\n"+"- Use the \xab, \xbb buttons to select year\n"+"- Use the "+String.fromCharCode(0x2039)+", "+String.fromCharCode(0x203a)+" buttons to select month\n"+"- Hold mouse button on any of the above buttons for faster selection.";
DateSelection._TT["ABOUT_TIME"]="\n\n"+"Time selection:\n"+"- Click on any of the time parts to increase it\n"+"- or Shift-click to decrease it\n"+"- or click and drag for faster selection.";
DateSelection._TT["PREV_YEAR"]="Prev. year (hold for menu)";
DateSelection._TT["PREV_MONTH"]="Prev. month (hold for menu)";
DateSelection._TT["GO_TODAY"]="Go Today";
DateSelection._TT["NEXT_MONTH"]="Next month (hold for menu)";
DateSelection._TT["NEXT_YEAR"]="Next year (hold for menu)";
DateSelection._TT["SEL_DATE"]="Select date";
DateSelection._TT["DRAG_TO_MOVE"]="Drag to move";
DateSelection._TT["PART_TODAY"]=" (today)";
DateSelection._TT["DAY_FIRST"]="Display %s first";
DateSelection._TT["WEEKEND"]="0,6";
DateSelection._TT["CLOSE"]="Close";
DateSelection._TT["TODAY"]="Today";
DateSelection._TT["TIME_PART"]="(Shift-)Click or drag to change value";
DateSelection._TT["DEF_DATE_FORMAT"]="%Y-%m-%d";
DateSelection._TT["TT_DATE_FORMAT"]="%a, %b %e";
DateSelection._TT["WK"]="wk";
DateSelection._TT["TIME"]="Time:";
DateSelection.setup=function (params) {
function param_default(pname, def) { if (typeof params[pname]=="undefined") { params[pname]=def; } };
param_default("inputField",     null);
param_default("displayArea",    null);
param_default("button",         null);
param_default("eventName",      "click");
param_default("ifFormat",       "%Y/%m/%d");
param_default("daFormat",       "%Y/%m/%d");
param_default("singleClick",    true);
param_default("disableFunc",    null);
param_default("dateStatusFunc", params["disableFunc"]);	
param_default("firstDay",       0); 
param_default("align",          "Br");
param_default("range",          [1900, 2999]);
param_default("weekNumbers",    false);
param_default("flat",           null);
param_default("flatCallback",   null);
param_default("onSelect",       null);
param_default("onClose",        null);
param_default("onUpdate",       null);
param_default("date",           null);
param_default("showsTime",      false);
param_default("timeFormat",     "24");
param_default("electric",       true);
param_default("step",           1);
param_default("position",       null);
param_default("cache",          false);
param_default("showOthers",     false);
var tmp=["inputField", "displayArea", "button"];
for (var i in tmp) {
if (typeof params[tmp[i]]=="string") {
params[tmp[i]]=document.getElementById(params[tmp[i]]);
}
}
if (!(params.flat || params.inputField || params.displayArea || params.button)) {
return false;
}
function onSelect(cal) {
var p=cal.params;
var update=(cal.dateClicked || p.electric);
if (update && p.flat) {
if (typeof p.flatCallback=="function")
p.flatCallback(cal);
return false;
}
if (update && p.inputField) {
p.inputField.value=cal.date.print(p.ifFormat);
if (typeof p.inputField.onchange=="function")
p.inputField.onchange();
}
if (update && p.displayArea)
p.displayArea.innerHTML=cal.date.print(p.daFormat);
if (update && p.singleClick && cal.dateClicked)
cal.callCloseHandler();
if (update && typeof p.onUpdate=="function")
p.onUpdate(cal);
};
if (params.flat!=null) {
if (typeof params.flat=="string")
params.flat=document.getElementById(params.flat);
if (!params.flat) {
return false;
}
var cal=new DateSelection(params.firstDay, params.date, params.onSelect || onSelect);
cal.showsTime=params.showsTime;
cal.time24=(params.timeFormat=="24");
cal.params=params;
cal.weekNumbers=params.weekNumbers;
cal.setRange(params.range[0], params.range[1]);
cal.setDateStatusHandler(params.dateStatusFunc);
cal.create(params.flat);
cal.show();
return false;
}
var triggerEl=params.button || params.displayArea || params.inputField;
triggerEl["on"+params.eventName]=function() {
var dateEl=params.inputField || params.displayArea;
var dateFmt=params.inputField ? params.ifFormat : params.daFormat;
var mustCreate=false;
var cal=window.calendar;
if (!(cal && params.cache)) {
window.calendar=cal=new DateSelection(params.firstDay,
params.date,
params.onSelect || onSelect,
params.onClose || function(cal) { cal.hide(); });
cal.showsTime=params.showsTime;
cal.time24=(params.timeFormat=="24");
cal.weekNumbers=params.weekNumbers;
mustCreate=true;
} else {
if (params.date)
cal.setDate(params.date);
cal.hide();
}
cal.showsOtherMonths=params.showOthers;
cal.yearStep=params.step;
cal.setRange(params.range[0], params.range[1]);
cal.params=params;
cal.setDateStatusHandler(params.dateStatusFunc);
cal.setDateFormat(dateFmt);
if (mustCreate)
cal.create();
cal.parseDate(dateEl.value || dateEl.innerHTML);
cal.refresh();
if (!params.position)
cal.showAtElement(params.button || params.displayArea || params.inputField, params.align);
else
cal.showAt(params.position[0], params.position[1]);
return false;
};
};
JavaScriptResource.notifyComplete("./lib/components/Component.DateSelection.js");
PopoutWindow.registerGroup("DialogManager", ["DialogManager",
"Dialog",
"DialogConfirm",
"DialogPrompt"]);
function DialogManager() {
}
DialogManager.nextID=0;
DialogManager.alert=function(message, title, callback, show, modal) {
DialogManager.active[DialogManager.active.length]=new Dialog(message, title, callback, modal);
if (show==true || show==undefined) {
DialogManager.active[DialogManager.active.length - 1].show();
}
return DialogManager.active[DialogManager.active.length -1];
}
DialogManager.confirm=function(message, title, callback, buttons, show, modal, defaultButtonIndex) {
DialogManager.active[DialogManager.active.length]=new DialogConfirm(message, title, callback, buttons, modal, defaultButtonIndex);
var win=DialogManager.active[DialogManager.active.length - 1];
if (show==true || show==undefined) {
DialogManager.active[DialogManager.active.length - 1].show();
}
return DialogManager.active[DialogManager.active.length - 1];
}
DialogManager.prompt=function(message, title, value, callback, buttons, show, modal, enterEqualsButton) {
DialogManager.active[DialogManager.active.length]=new DialogPrompt(message, title, value, callback, buttons, modal, enterEqualsButton);
var win=DialogManager.active[DialogManager.active.length - 1];
if (show==true || show==undefined) {
DialogManager.active[DialogManager.active.length - 1].show();
}
return DialogManager.active[DialogManager.active.length - 1];
}
DialogManager.recycled=Array();
DialogManager.active=Array();
DialogManager.closeWindow=function(o_button, o_window, o_event) {
o_window.close();
DialogManager.dispose(o_window);	
}
DialogManager.dispose=function(window) {
DialogManager.recycled[DialogManager.recycled.length]=window;
return true;
}
DialogManager.resizeWindow=function(window, width, height) {
if (window!=undefined) {
window.effectiveWidth(width);
window.effectiveHeight(height);
window.width(width);
window.height(height);
window.center();
}
return true;
}
DialogManager.getWindow=function(width, height, title) {
var ret;
if (DialogManager.recycled.length > 0) {
ret=DialogManager.recycled[0];
DialogManager.recycled.splice(0, 1);
if (title==undefined) {
title=" ";
}
ret.name(title);
ret.loadContent();
ret.effectiveWidth(width);
ret.effectiveHeight(height);
ret.width(width);
ret.height(height);
ret.contentPane().style.overflow="hidden";
}
else {
if (this.i_tbf==undefined) {
this.i_tbf=new TitleBarFactory(200, 16);
var b=new IconButton("IconButton_Close", 9, 9, 16, 16, "Close", DialogManager.closeWindow);
b.buttonFocus(this);
var b_close=this.i_tbf.addButton(b);
}
ret=new WindowObject('dialog_'+DialogManager.nextID++, title, width, height, this.i_tbf);
ret.effectiveWidth(width);
ret.effectiveHeight(height);
ret.contentPane().style.overflow="hidden";
}
return ret;
}
DialogManager.getTextDimensions=function(text, css_class, maxWidth) {
var ret=Array();
if (this.i_mesure==undefined) {
this.i_mesure=document.createElement('DIV');
this.i_mesure.style.visibility="hidden";
this.i_mesure.style.position="absolute";
document.body.appendChild(this.i_mesure);
}
document.body.appendChild(this.i_mesure);
this.i_mesure.innerHTML=text;
this.i_mesure.style.width="auto";
this.i_mesure.className=css_class;
ret[0]=parseInt(this.i_mesure.offsetWidth)+5;
if (ret[0] > maxWidth) {
this.i_mesure.style.width=maxWidth+"px";
ret[0]=maxWidth;
}
ret[1]=parseInt(this.i_mesure.offsetHeight)+5;
document.body.removeChild(this.i_mesure);
return ret;
}
function Dialog(text, title, callback, modal) {
this.dialogSuperConstructor(text, title, callback, modal);
}
Dialog.prototype.dialogSuperConstructor=function(text, title, callback, modal) {
this.i_title=title;
this.i_text=text;
this.i_modal=(modal==undefined ? false : modal);
this.i_callback=callback;
this.i_height_reserve=45;
this.i_button_align="center";
this.i_timeout=0;
}
Dialog.prototype.delayClose=function(ms) {
if (ms!=undefined) {
this.i_timeout=ms;
}
return ms;
}
Dialog.prototype.alignButtons=function(align) {
if (align!=undefined) {
this.i_button_align=align;
this.i_buttons.style.textAlign=align;
}
return this.i_button_align;
}
Dialog.prototype.button=function() {
return this.i_last_button;
}
Dialog.prototype.reservedHeight=function(newHeight) {
return this.i_height_reserve;
}
Dialog.prototype.callback=function(callback) {
if (callback!=undefined) {
this.i_callback=callback;
}
return this.i_callback;
}
Dialog.prototype.title=function(title) {
if (title!=undefined) {
this.i_title=title;
if (this.i_window!=undefined) {
this.i_window.name(title);
}
}
return this.i_title;
}
Dialog.prototype.text=function(text) {
if (text!=undefined) {
this.i_text=text;
if (this.i_dialog_text!=undefined) {
this.i_dialog_text.innerHTML=text;
}
}
return this.i_text;
}
Dialog.prototype.modal=function(modal) {
if (modal!=undefined) {
this.i_modal=modal;
if (this.i_window!=undefined) {
this.i_window.modal(true);
}
}
return this.i_modal;
}
Dialog.prototype.recalcSize=function() {
if (this.i_window!=undefined) {
var d=DialogManager.getTextDimensions(this.text(), "Dialog_simple", 400);
DialogManager.resizeWindow(this.i_window, d[0]+40, d[1]+this.reservedHeight());
}
return true;
}
Dialog.prototype.show=function() {
var d=DialogManager.getTextDimensions(this.text(), "Dialog_simple", 400);
if (this.i_window==undefined) {
this.i_window=DialogManager.getWindow(d[0]+40, d[1]+this.reservedHeight(), this.title());
EventHandler.register(this.i_window, "onclose", this.handleWindowClose, this);
this.i_window.loadContent(this.display());
}
this.i_window.visible(true);
this.i_window.modal(this.modal());
this.i_window.i_docked=true;
this.i_window.center();
this.i_window.docked(false);
this.i_window.center();
if (this.setFocus!=undefined) {
var me=this;
setTimeout(function() {
me.setFocus();
}, 100);
}
this.i_window.temporary(true);
this.i_window.global(true);
this.i_window.bringToFront();
return this.i_window;
}
Dialog.prototype.close=function() {
if (this.i_window!=undefined) {
var e=new Object();
e.type="close";
e.dialog=this;
e.button=this.button();
e.cancel==false;
if (this.onclose!=undefined) {
this.onclose(e);
}
if (e.cancel!=true) {
this.i_window.close();
DialogManager.dispose(this.i_window);			
}
}
}
Dialog.prototype.handleWindowClose=function(e) {
if(this.onwindowclose!=undefined) {
var o=new Object();
o.type="windowclose";
o.dialog=this;
this.onwindowclose(o);
}
}
Dialog.prototype.handleClose=function(e) {
var me=this.pObj;
me.i_last_button=this.value;
me.close(true);
if (me.callback()!=undefined) {
var cb=me.callback();
if (cb!=undefined) {
cb();
}
}
if (this.onuserclose!=undefined) {
var o=new Object();
o.type="userclose";
o.dialog=this;
this.onuserclose(o);
}
return true;
}
Dialog.prototype.display=function() {
if (this.i_dialog==undefined) {
this.i_dialog=document.createElement('DIV');
this.i_dialog.className="Dialog_simple";
this.i_dialog_text=document.createElement('DIV');
this.i_dialog_text.innerHTML=this.text();
this.i_dialog.appendChild(this.i_dialog_text);
this.i_buttons=document.createElement('DIV');
this.i_buttons.style.textAlign=this.alignButtons();
this.i_buttons.style.marginTop="5px";
this.i_ok=document.createElement('BUTTON');
this.i_ok.innerHTML="OK";
this.i_ok.pObj=this;
this.i_ok.onclick=this.handleClose;
this.i_ok.value="OK";
this.i_buttons.appendChild(this.i_ok);
this.i_dialog.appendChild(this.i_buttons);
}
return this.i_dialog;
}
function DialogConfirm(message, title, callback, buttons, modal, defaultButtonIndex) {
this.dialogSuperConstructor(message, title, callback, modal);
this.i_button_default=defaultButtonIndex;
this.i_button_choice=(buttons!=undefined ? buttons : Array('OK', 'Cancel'));
this.i_button_align="center";
}
DialogConfirm.handleClose=function(e) {
var me=this.pObj;
me.i_last_button=this.value;
me.close(true);
if (me.callback()!=undefined) {
var cb=me.callback();
if (cb!=undefined) {
cb(this.value, me);
}
}
return true;
}
DialogConfirm.prototype.display=function() {
if (this.i_dialog==undefined) {
this.i_dialog=document.createElement('DIV');
this.i_dialog.className="Dialog_simple";
this.i_dialog_text=document.createElement('DIV');
this.i_dialog_text.innerHTML=this.text();
this.i_dialog.appendChild(this.i_dialog_text);
this.i_buttons=document.createElement('DIV');
this.i_buttons.style.textAlign=this.alignButtons();
this.i_buttons.style.marginTop="5px";
this.i_bt=Array();
for (var x=0; x < this.i_button_choice.length; x++) {
this.i_bt[x]=document.createElement('BUTTON');
this.i_bt[x].className="Dialog_button";
this.i_bt[x].innerHTML=this.i_button_choice[x];
this.i_bt[x].value=this.i_button_choice[x];
this.i_bt[x].pObj=this;
this.i_bt[x].onclick=DialogConfirm.handleClose;
this.i_buttons.appendChild(this.i_bt[x]);
}
this.i_dialog.appendChild(this.i_buttons);
}
return this.i_dialog;
}
DialogConfirm.prototype.setFocus=function() {
if (this.i_button_default!=undefined && this.i_bt[this.i_button_default]!=undefined) {
this.i_bt[this.i_button_default].focus();
}
}
for (var meth in Dialog.prototype) {
if (DialogConfirm.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
DialogConfirm.prototype[meth]=Dialog.prototype[meth];
}
}
function DialogPrompt(message, title, value, callback, buttons, modal, enterEqualsButton) {
this.dialogSuperConstructor(message, title, callback, modal);
this.i_height_reserve=65;
this.i_button_choice=(buttons!=undefined ? buttons : Array('OK', 'Cancel'));
this.i_button_align="right";
this.i_value=value;
this.enterButton=enterEqualsButton;
}
DialogPrompt.prototype.selectAll=function() {
var me=this;
setTimeout(function() {
if (me.i_input_box.createTextRange) {
var r=me.i_input_box.createTextRange();
r.moveStart("character", 0);
r.moveEnd("character", me.i_input_box.value.length);
r.select();
}
else if (me.i_input_box.setSelectionRange) {
me.i_input_box.setSelectionRange(0, me.i_input_box.value.length);
}
me.i_input_box.focus();
}, 100);
}
DialogPrompt.prototype.handleClose=function(e) {
var me=this.pObj;
me.i_last_button=this.value;
var doClose=true;
if (me.callback()!=undefined) {
var cb=me.callback();
if (cb!=undefined) {
doClose=cb(this.innerHTML, me.value(), me);
if (doClose==undefined) {
doClose=true;
}
}
}
if (doClose) {
me.close(true);
}
return true;
}
DialogPrompt.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
if (this.i_dialog!=undefined) {
this.i_input_box.value=value;
}
}
return (this.i_dialog!=undefined ? this.i_input_box.value : this.i_value);
}
DialogPrompt.focusFix=function() {
this.focus();
}
DialogPrompt.handleEnter=function(e) {
var k=(e.keyCode <=0	? e.which : e.keyCode);
if (k==13) {
if (this.pObj.enterButton!=undefined) {
DialogPrompt.prototype.handleClose.call(this.pObj.i_buttons.childNodes[this.pObj.enterButton]);
} else if (this.pObj.onenter!=undefined) {
this.pObj.onenter(this.pObj);
}
}
return true;
}
DialogPrompt.prototype.setFocus=function() {
this.i_input_box.focus();
}
DialogPrompt.prototype.display=function() {
if (this.i_dialog==undefined) {
this.i_dialog=document.createElement('DIV');
this.i_dialog.className="Dialog_simple";
this.i_dialog_text=document.createElement('DIV');
this.i_dialog_text.innerHTML=this.text();
this.i_dialog.appendChild(this.i_dialog_text);
this.i_input=document.createElement('DIV');
this.i_input.style.overflow="auto";
this.i_input_box=document.createElement('INPUT');
this.i_input_box.className="DialogPrompt_input";
this.i_input_box.type="text";
this.i_input_box.style.width="100%";
this.i_input_box.pObj=this;
EventListener.listen(this.i_input_box, "onkeypress", DialogPrompt.handleEnter);
this.i_input_box.value=(this.i_value!=undefined ? this.i_value : "");
this.i_input_box.onmousedown=DialogPrompt.focusFix;
this.i_input.appendChild(this.i_input_box);
this.i_dialog.appendChild(this.i_input);
this.i_buttons=document.createElement('DIV');
this.i_buttons.style.textAlign=this.alignButtons();				
this.i_buttons.style.marginTop="5px";
this.i_bt=Array();
for (var x=0; x < this.i_button_choice.length; x++) {
this.i_bt[x]=document.createElement('BUTTON');
this.i_bt[x].className="Dialog_button";
this.i_bt[x].innerHTML=this.i_button_choice[x];
this.i_bt[x].pObj=this;
this.i_bt[x].value=this.i_button_choice[x];
this.i_bt[x].onclick=this.handleClose;
this.i_buttons.appendChild(this.i_bt[x]);
}
this.i_dialog.appendChild(this.i_buttons);
}
return this.i_dialog;
}
for (var meth in Dialog.prototype) {
if (DialogPrompt.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
DialogPrompt.prototype[meth]=Dialog.prototype[meth];
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.Dialog.js");
function Fieldset(title, width, height) {
this.i_title=title;
this.i_width=width;
this.i_height=height;
this.i_content=undefined;
this.i_body=document.createElement('DIV');
this.i_body.className="FieldSetBody";
}
Fieldset.prototype.getContent=function() {
if(this.i_content==undefined) {
this.i_content=document.createElement('DIV');
this.i_content.className="Fieldset";
var fs=document.createElement('FIELDSET');
var legend=document.createElement('LEGEND');
legend.className="UniversalFormInput_label";
legend.innerHTML=this.i_title;
fs.appendChild(legend);
fs.appendChild(this.i_body);
this.i_body.style.overflow="auto";
if(this.i_width!=undefined) {
this.width(this.i_width);
}
if(this.i_height!=undefined) {
this.height(this.i_height);
}
this.i_content.appendChild(fs);
}
return this.i_content;
}
Fieldset.prototype.addContent=function(element) {
this.i_body.appendChild(element);
}
Fieldset.prototype.clearContent=function() {
while (this.i_body.hasChildNodes()) {
this.i_body.removeChild(this.i_body.firstChild);	
}
}
Fieldset.prototype.width=function(width) {
if(width) {
this.i_width=width;
if(this.i_content!=undefined) {
this.i_content.style.width=this.i_width+"px";
this.i_body.style.width=(this.i_width - 25)+"px";
}
}
return this.i_width;
}
Fieldset.prototype.height=function(height) {
if(height) {
this.i_height=height;
if(this.i_content!=undefined) {
this.i_content.style.height=this.i_height+"px";
this.i_body.style.height=(this.i_height - 25)+"px";
}
}
return this.i_height;
}
JavaScriptResource.notifyComplete("./lib/components/Component.Fieldset.js");
function IconField(iconClass, iconWidth, iconHeight, width, height,  defaultValue) {
this.i_icon_width=iconWidth;
this.i_icon_height=iconHeight;
this.i_width=width;
this.i_height=height;
this.i_icon=iconClass;
this.i_default=defaultValue;
}
IconField.fieldHeight=18;
IconField.prototype.onenter=null;
IconField.prototype.oncontextmenu=null;
IconField.prototype.iconCSS=function(newClass) {
if (newClass!=undefined) {
this.i_icon=newClass;
if (this.i_field_icon!=undefined) {
this.i_field_icon.className="IconField_icon "+newClass;
}
}
return this.i_icon;
}
IconField.prototype.iconWidth=function(width) {
if (width!=undefined) {
this.i_icon_width=width;
if (this.i_field_data!=undefined) {
this.i_field_data.style.width=((this.width() - this.iconWidth()) - 4)+"px";
}
}
return this.i_icon_width;
}
IconField.prototype.iconHeight=function(height) {
if (height!=undefined) {
this.i_icon_height=height;
if (this.i_field_icon!=undefined) {
this.i_field_icon.style.marginTop=(Math.floor(((this.height() - 2) - this.iconHeight()) / 2))+"px";
}
}
return this.i_icon_height;
}
IconField.prototype.top=function() {
var ch=this.i_field;
var tp=0;
while (ch!=null) {
tp+=parseInt(ch.offsetTop);
ch=ch.offsetParent;
}
return tp;
}
IconField.prototype.left=function() {
var ch=this.i_field;
var lf=0;
while (ch!=null) {
lf+=parseInt(ch.offsetLeft);
ch=ch.offsetParent;
}
return lf;
}
IconField.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_field!=undefined) {
if (this.i_field!=undefined) {
this.i_field.style.width=width+"px";
this.i_field_data.style.width=((this.width() - this.iconWidth()) - 4)+"px";
}
}
}
return this.i_width;
}
IconField.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_field!=undefined) {
this.i_field.style.height=height+"px";
this.i_field_icon.style.marginTop=(Math.floor(((this.height() - 2) - this.iconHeight()) / 2))+"px";
this.i_field_input.style.marginTop=(this.height() - (document.all ? 4 : 2) - IconField.fieldHeight)+"px";
}
}
return this.i_height;
}
IconField.prototype.value=function(value) {
if (value!=undefined) {
if (this.i_field_data!=undefined) {
this.i_field_data.value=value;
}
}
return (this.i_field_data!=undefined ? this.i_field_data.value : this.defaultValue());
}
IconField.prototype.defaultValue=function(newDefault) {
if (newDefault!=undefined) {
if (this.i_field_data!=undefined) {
if (this.i_field_data.value==this.i_default) {
this.i_field_data.value=newDefault;
}
}
this.i_default=newDefault;
}
return this.i_default;
}
IconField.prototype.handleKeyPress=function(e) {
var key=(e.keyCode > 0 ? e.keyCode : e.which);
if (key==13) {
if (this.onsubmit!=undefined) {
this.onsubmit(this.value());
}
if (this.onenter!=undefined) {
var o=new Object();
o.type="enter";
o.input=this;
this.onenter(o);
}
}
return true;
}
IconField.prototype.handleFocus=function(e) {
if (this.i_field_data.createTextRange) {
var r=this.i_field_data.createTextRange();
r.moveStart("character", 0);
r.moveEnd("character", this.value().length);
r.select();
}
else if (this.i_field_data.setSelectionRange) {
this.i_field_data.setSelectionRange(0, this.value().length);
}
this.i_field_data.className="IconField_input_focus";
return true;
}
IconField.prototype.handleBlur=function(e) {
this.i_field_data.className="IconField_input";
}
IconField.handleContext=function(e) {
if (this.oncontextmenu!=undefined) {
this.oncontextmenu(this.left(), this.top()+this.height());
}
e.cancelBubble=true;
e.returnValue=false;
return false;
}
IconField.prototype.fieldData=function () {
return this.i_field_data;
}
IconField.prototype.getField=function() {
if (this.i_field==undefined) {
var useHeight=this.height()+(document.all ? 2 : 0);
var useWidth=this.width()+(document.all ? 2 : 0);
this.i_field=document.createElement('DIV');
this.i_field.style.width=useWidth+"px";
this.i_field.style.height=useHeight+"px";
this.i_field.className="IconField";
this.i_field_icon=document.createElement('DIV');
this.i_field_icon.className="IconField_icon "+this.iconCSS();
if (this.i_icon=="CalendarShare_add_icon") {
this.i_field_icon.style.marginTop="2px";
this.i_field_icon.style.marginLeft="3px";
}
else {
this.i_field_icon.style.marginTop=(Math.floor(((useHeight - 2) - this.iconHeight()) / 2) - (document.all ? 1 : 0))+"px";
this.i_field_icon.style.marginLeft="1px";
}
this.i_field_icon.style.width=this.iconWidth()+"px";
this.i_field_icon.style.height=this.iconHeight()+"px";
EventHandler.register(this.i_field_icon, "onmousedown", IconField.handleContext, this);
EventHandler.register(this.i_field_icon, "oncontextmenu", IconField.handleContext, this);
this.i_field.appendChild(this.i_field_icon);
this.i_field_input=document.createElement('DIV');
this.i_field_input.className="IconField_input_div";
this.i_field_input.style.height=IconField.fieldHeight+"px";
if (this.i_icon=="CalendarShare_add_icon") {
this.i_field_input.style.marginTop=2 - (document.all ? 3 : 0)+"px";
this.i_field_input.style.marginLeft=1 - (document.all ? 2 : 0)+"px";
}
else {
this.i_field_input.style.marginTop=(useHeight - (document.all ? 4 : -1) - IconField.fieldHeight)+"px";
if (!document.all && parseInt(this.i_field_input.style.marginTop) < 0) {
this.i_field_input.style.marginTop="0px";
}
this.i_field_input.style.marginLeft=-4+(document.all ? 2 : 0)+"px";
}
this.i_field_input.style.overflow="hidden";
this.i_field.appendChild(this.i_field_input);
this.i_field_data=document.createElement('INPUT');
this.i_field_data.className="IconField_input";
this.i_field_data.type="text";
this.i_field_data.value=this.defaultValue();
this.i_field_data.style.height=IconField.fieldHeight+"px";
this.i_field_data.style.width=((useWidth - this.iconWidth()) - 6)+"px";
if (!document.all) {
this.i_field_data.style.lineHeight=IconField.fieldHeight+"px";
}
EventHandler.register(this.i_field_data, "onclick", this.handleFocus, this);
EventHandler.register(this.i_field_data, "onfocus", this.handleFocus, this);
EventHandler.register(this.i_field_data, "onblur", this.handleBlur, this);
EventHandler.register(this.i_field_data, "onkeypress", this.handleKeyPress, this);
this.i_field_input.appendChild(this.i_field_data);
}
return this.i_field;
}
JavaScriptResource.notifyComplete("./lib/components/Component.IconField.js");	
PopoutWindow.registerGroup("LiteTree", ["LiteTree",
"LiteDataNode",
"LiteTreeNode",
"LiteTreeDataModel"]);
function LiteTree(dataModel, iconClasses, iconOpenClasses, width, height) {
this.i_width=((width!=undefined && height!=undefined) ? width : undefined);
this.i_height=((width!=undefined && height!=undefined) ? height : undefined);
this.i_listeners=Array();
this.i_icons=iconClasses;
this.i_icons_open=iconOpenClasses;
this.i_action_open="LiteTreeNode_open";
this.i_action_closed="LiteTreeNode_closed";
this.i_root_visible=true;
this.i_scrollable=false;
this.i_scroll_position=0;
this.i_visible_nodes=0;
this.i_node_objects=Array();
this.i_showButtons=true;
this.i_building=false;
this.i_nodes=0;
this.dataModel(dataModel);		
}
LiteTree.scrollBarWidth=scrollBarWidth()+1;
LiteTree.scrollBarOverflow=0;
LiteTree.extraScrollNodes=2;
LiteTree.forcePreScroll=2;
LiteTree.nodeHeight=16;
LiteTree.maximum_node_display=50000;
LiteTree.scroll_delay=(document.all ? 0 : 0);
LiteTree.iconPadding=5;
LiteTree.prototype.onchange=null;
LiteTree.prototype.onexpand=null;
LiteTree.prototype.oncollapse=null;
LiteTree.prototype.onmouseover=null;
LiteTree.prototype.onmouseout=null;
LiteTree.prototype.onmousedown=null;
LiteTree.prototype.ondblclick=null;
LiteTree.prototype.oncontextmenu=null;
LiteTree.prototype.building=function(state) {
if (state!=undefined) {
this.i_building=state;
if (state==false) {
if (this.dataModel()!=undefined) {
this.nodes(this.dataModel().nodes());
}
this.refresh();
}
}
return this.i_building;
}
LiteTree.prototype.left=function() {
var ch=this.getTree();
var lf=0;
while (ch!=undefined) {
lf+=parseInt(ch.offsetLeft);
ch=ch.offsetParent;
}
return lf;
}
LiteTree.prototype.top=function() {
var ch=this.getTree();
var tp=0;
while (ch!=undefined) {
tp+=(parseInt(ch.offsetTop) - parseInt(ch.scrollTop));
ch=ch.offsetParent;
}
return tp;
}
LiteTree.prototype.dataModel=function(dataModel) {
if (dataModel!=undefined) {
if (dataModel==false) {
if (this.i_dataModel!=undefined) {
this.i_dataModel.unregisterListener(this);
}
this.i_dataModel=undefined;
this.nodes(0);
}
else {
var oldModel=this.i_dataModel;
this.i_dataModel=dataModel;
this.nodes(this.dataModel().nodes());
if (oldModel!=undefined) {
oldModel.unregisterListener(this);
}
dataModel.registerListener(this);
}
}
return this.i_dataModel;
}
LiteTree.prototype.actionOpenCSS=function(css) {
if (css!=undefined) {
this.i_action_open=css;
}
return this.i_action_open;
}
LiteTree.prototype.actionClosedCSS=function(css) {
if (css!=undefined) {
this.i_action_closed=css;
}
return this.i_action_closed;
}
LiteTree.prototype.showButtons=function(state) {
if (state!=undefined) {
this.i_showButtons=state;
for (var x=0; x < this.i_node_objects.length; x++) {
this.i_node_objects[x].showButtons(state);
}
}
return this.i_showButtons;
}
LiteTree.prototype.unselectAll=function() {
for (var x=0; x < this.i_node_objects.length; x++) {
this.i_node_objects[x].selected(false);
}
return true;
}
LiteTree.prototype.possibleNodes=function() {
if (this.height()!=undefined) {
return Math.ceil(this.height() / LiteTree.nodeHeight);
}
else {
return LiteTree.maximum_node_display;
}
}
LiteTree.prototype.iconClassFromId=function(iconId, openState) {
if (this.i_icons==undefined && this.i_icons_open==undefined) {
return "";
}
if ((openState==true || this.i_icons==undefined) && this.i_icons_open!=undefined) {
return this.i_icons_open[iconId];
}
if (this.i_icons!=undefined) {
return this.i_icons[iconId];
}
return "";
}
LiteTree.prototype.addIcon=function(icon,icon_open) {
var id=this.i_icons.length;
this.i_icons[id]=icon;
if (icon_open) {
this.i_icons_open[id]=icon_open;
} else {
this.i_icons_open[id]=icon;
}
return id;
}
LiteTree.prototype.nodes=function(nodes) {
if (nodes!=undefined) {
if (this.i_nodes!=nodes) {
this.i_nodes=nodes+0;
if (this.i_tree_force_scroll!=undefined) {
this.i_tree_force_scroll.style.height=(LiteTree.nodeHeight * (nodes+LiteTree.extraScrollNodes))+"px";
}
this.scrollable((this.nodes()+LiteTree.forcePreScroll) > this.possibleNodes() ? true : false);
}
}
return this.i_nodes;
}
LiteTree.prototype.visibleNodes=function(nodes) {
if (nodes!=undefined) {
if (this.i_tree_inner_content!=undefined) {
if (this.i_visible_nodes!=nodes) {
var old_count=this.i_visible_nodes;
this.i_visible_nodes=nodes;
if (this.i_visible_nodes > this.i_node_objects.length) {
for (var x=this.i_node_objects.length; x <=this.i_visible_nodes; x++) {
this.i_node_objects[x]=new LiteTreeNode(this);
}
}
if (old_count < this.i_visible_nodes) {
for (var x=old_count; x < this.i_visible_nodes; x++) {
this.i_tree_inner_content.appendChild(this.i_node_objects[x].getNode());
}
}
else {
for (var x=old_count - 1; x >=this.i_visible_nodes; x--) {
this.i_tree_inner_content.removeChild(this.i_node_objects[x].getNode());
}
}
}
}
}
return this.i_visible_nodes;
}
LiteTree.prototype.rootVisible=function(state) {
if (state!=undefined) {
this.i_root_visible=state;
}
return this.i_root_visible;
}
LiteTree.prototype.refresh=function() {
if (LiteTree.refreshRate==undefined) {
LiteTree.refreshRate=0;
}
LiteTree.refreshRate++;
if (this.i_tree_div!=undefined && this.dataModel()!=undefined && !this.building()) {
if (parseInt(this.i_tree_scroller.scrollTop)!=this.scrollPosition() * LiteTree.nodeHeight) {
this.i_tree_scroller.scrollTop=this.scrollPosition() * LiteTree.nodeHeight;
}
var nodes=this.dataModel().getNodes(this.scrollPosition()+(this.rootVisible() ? 0 : 1), this.possibleNodes());
if (nodes.source!=undefined) {
var l=nodes.length();
this.visibleNodes(l);
for (var x=0; x < l; x++) {
this.i_node_objects[x].node(nodes.getItem(x));
}
}
else {
var l=nodes.length;
this.visibleNodes(l);
for (var x=0; x < l; x++) {
this.i_node_objects[x].node(nodes[x]);
}
}
}
}
LiteTree.prototype.scrollPosition=function(position, no_update) {
if (position!=undefined) {
var do_refresh=false;
if (this.i_scroll_position!=position) {
do_refresh=true;
}
this.i_scroll_position=position;
if (this.i_tree_force_scroll!=undefined) {
if (this.scrollable()) {
if (no_update!=true) {
this.i_tree_scroller.scrollTop=position * LiteTree.nodeHeight;
}
}
}
if (do_refresh==true) {
this.refresh();
}
}
return this.i_scroll_position;
}
LiteTree.prototype.scrollable=function(state) {
if (state!=undefined) {
if (this.i_scrollable!=state) {
this.i_scrollable=state;
if (this.i_tree_scroller!=undefined) {
this.i_tree_content.style.width=(this.width() - (state ? LiteTree.scrollBarWidth  : 0))+"px";
this.i_tree_scroller.style.display=(state==true ? "" : "none");
}
}
if (!state) {
this.scrollPosition(0);
}
}
return this.i_scrollable;
return (this.width()!=undefined ? this.i_scrollable : false);
}
LiteTree.prototype.width=function(width) {
if (width!=undefined && this.width()!=undefined) {
this.i_width=width;
if (this.i_tree_div!=undefined) {
this.i_tree_div.style.width=width+"px";
this.i_tree_content.style.width=(this.width() - (this.scrollable() ? LiteTree.scrollBarWidth: 0))+"px";
this.i_tree_inner_content.style.width=(width - LiteTree.scrollBarOverflow)+"px";
}
}
return this.i_width;
}
LiteTree.prototype.height=function(height) {
if (height!=undefined && this.height()!=undefined && height > 0) {
this.i_height=height;
if (this.i_tree_div!=undefined) {
this.i_tree_div.style.height=height+"px";
this.i_tree_inner_content.style.height=height+"px";
this.i_tree_scroller.style.height=this.height()+"px";
this.i_tree_content.style.height=this.height()+"px";
}
this.scrollable((this.nodes()+LiteTree.forcePreScroll) > this.possibleNodes() ? true : false);
this.refresh();
}
return this.i_height;
}
LiteTree.handleScroll=function(e) {
var me=this;
var new_top=parseInt(this.i_tree_scroller.scrollTop);
var new_pos=Math.floor(new_top / LiteTree.nodeHeight);
if (me.i_ctime!=undefined) {
clearTimeout(me.i_ctime);
if (me.i_ctime_counter > 10) {
me.i_ctime_counter=0;
me.i_ctime_fa();
}	
}
if (me.i_ctime_counter==undefined) {
me.i_ctime_counter=0;
}
var fa=function() {
me.scrollPosition(new_pos, true);
me.i_ctime=undefined;
me.i_ctime_fa=undefined;
me.i_ctime_counter=0;
me=undefined;
};
if (LiteTree.scroll_delay==0) {
fa();
}
else {
me.i_ctime=setTimeout(fa, LiteTree.scroll_delay);
me.i_ctime_counter++;
me.i_ctime_fa=fa;
}
e.returnValue=true;
return true;
}
LiteTree.handleDOMWheelScroll=function(e) {
return LiteTree.handleWheelScroll.call(this.pObj, e);
}
LiteTree.handleWheelScroll=function(e) {
var delta=0;
var useEvent=(document.all ? event : e);
if (this.scrollable()) {
if (useEvent.wheelDelta) {
delta=useEvent.wheelDelta/120;
if (window.opera) {
delta=-delta;
}
}
else if (useEvent.detail) {
delta=-useEvent.detail/3;
}
if (delta) {
var n=this.scrollPosition() - delta;
if (n < 0) {
n=0;
}
if (n > ((this.nodes() - this.possibleNodes())+LiteTree.extraScrollNodes)) {
n=(this.nodes() - this.possibleNodes())+LiteTree.extraScrollNodes;
}
this.scrollPosition(n);	
}
this.i_tree_content.scrollTop=0+"px";
}
useEvent.cancelBubble=true;
e.returnValue=false;
return false;
}
LiteTree.correctScroll=function(e) {
this.scrollLeft=0;
this.scrollTop=0;
}
LiteTree.prototype.getTree=function() {
if (this.i_tree_div==undefined) {
this.i_tree_div=document.createElement('DIV');
this.i_tree_div.className="LiteTree";
this.i_tree_content=document.createElement('DIV');
if (this.i_tree_content.addEventListener) {
this.i_tree_content.pObj=this;
this.i_tree_content.addEventListener('DOMMouseScroll', LiteTree.handleDOMWheelScroll, false);
}
EventHandler.register(this.i_tree_content, "onmousewheel", LiteTree.handleWheelScroll, this);
EventHandler.register(this.i_tree_content, "onscroll", LiteTree.correctScroll);
this.i_tree_content.className="LiteTree_content";
this.i_tree_inner_content=document.createElement('DIV');
this.i_tree_inner_content.className="LiteTree_inner_content";
this.i_tree_content.appendChild(this.i_tree_inner_content);
if (this.width()) {
this.i_tree_div.style.width=""+this.width()+"px";
}
if (this.height()) {
this.i_tree_div.style.height=""+this.height()+"px";
}
this.i_tree_scroller=document.createElement('DIV');
this.i_tree_scroller.className="LiteTree_scroller";
this.i_tree_scroller.style.width=""+LiteTree.scrollBarWidth+"px";
if (this.height()) {
this.i_tree_scroller.style.height=""+this.height()+"px";
}
this.i_tree_scroller.style.display=(this.scrollable() ? "" : "none");
EventHandler.register(this.i_tree_scroller, "onscroll", LiteTree.handleScroll, this);
this.i_tree_div.appendChild(this.i_tree_scroller);
this.i_tree_force_scroll=document.createElement('DIV');
this.i_tree_force_scroll.className="LiteTree_force_scroll";
this.i_tree_force_scroll.style.height=""+(LiteTree.nodeHeight * (this.nodes()+2))+"px";
this.i_tree_scroller.appendChild(this.i_tree_force_scroll);
if (this.width()) {
this.i_tree_content.style.width=""+(this.width() - (this.scrollable() ? LiteTree.scrollBarWidth: 0))+"px";
this.i_tree_inner_content.style.width=""+(this.width() - LiteTree.scrollBarOverflow)+"px";
}
if (this.height()) {
this.i_tree_content.style.height=""+this.height()+"px";
this.i_tree_inner_content.style.height=""+this.height()+"px";
}
this.i_tree_div.appendChild(this.i_tree_content);
this.refresh();
this.scrollable((this.nodes()+LiteTree.forcePreScroll) > this.possibleNodes() ? true : false);
}
return this.i_tree_div;
}
LiteTree.prototype.getSelectedNode=function() {
var nodes=this.i_node_objects;
for (var c=0; c < nodes.length; c++) {
if (nodes[c].i_selected) return nodes[c].i_node;
}
return undefined;
}
function LiteTreeNode(parent) {
this.i_parent=parent;
this.i_depth=0;
this.i_icon=-1;
this.i_css_classes=[];
this.i_children=false;
this.i_tool_tip="";
this.i_edit_mode=false;
this.i_selected=false;
this.i_showButtons=this.parent().showButtons();
}
LiteTreeNode.prototype.parent=function() {
return this.i_parent;
}
LiteTreeNode.prototype.left=function() {
var ch=this.getNode();
var lf=0;
while (ch!=undefined) {
lf+=parseInt(ch.offsetLeft);
ch=ch.offsetParent;
}
return lf - parseInt(this.parent().i_tree_inner_content.scrollLeft);
}
LiteTreeNode.prototype.top=function() {
var ch=this.getNode();
var tp=0;
while (ch!=undefined) {
tp+=(parseInt(ch.offsetTop) - parseInt(ch.scrollTop));
ch=ch.offsetParent;
}
return tp;
}
LiteTreeNode.prototype.node=function(node) {
if (node!=undefined) {
var adj_depth=node.i_depth - (this.parent().rootVisible() ? 0 : 1);
this.depth(adj_depth);
if (this.i_node!=node) {
var oldNode=this.i_node;
this.i_node=node;
this.i_working=true;
this.hasChildren(node.i_nodes!=undefined);
this.name(node.name()+"&nbsp;&nbsp;");
this.open(node.open());
this.toolTip(node.tipText());
this.i_working=false;
this.iconId(node.i_icon!=undefined ? node.i_icon : -1);
node.registerNode(this);
if (oldNode!=undefined) {
oldNode.unregisterNode(this);
}
}
}
return this.i_node;
}
LiteTreeNode.prototype.depth=function(depth) {
if (depth!=undefined) {
if (this.i_depth!=depth) {
this.i_depth=depth;
this.i_vis_set=null;
}
this.updateIcons();
}
return this.i_depth;
}
LiteTreeNode.prototype.toolTip=function(text) {
if (text!=undefined) {
this.i_tool_tip=text;
if (this.i_node_div!=undefined) {
this.i_node_div_tipObj.tip(text);
}
}
return this.i_tool_tip;
}
LiteTreeNode.handleEditMouseDown=function(e) {
e.cancelBubble=true;
e.returnValue=true;
return true;
}
LiteTreeNode.handleDocumentMouseDown=function(e) {
var me=LiteTreeNode.activeEdit;
if (me!=undefined) {
if (me.editMode()) {
if (me.i_edit!=undefined && me.i_edit.value!=undefined) {
e.newname=me.i_edit.value;
me.handleCustomEvent("onchange", e);
}
}
me.editMode(false);
}
e.returnValue=true;
return true;
}
LiteTreeNode.handleKeyPress=function(e) {
var key=(e.which >=0 ? e.which : e.keyCode);
if (key==13) {
this.node().name(this.value);
e.newname=this.i_edit.value;
this.handleCustomEvent("onchange", e);
this.editMode(false);
this.i_edit.value="";
}
e.returnValue=true;
return true;
}
LiteTreeNode.prototype.getEditInput=function() {
if (this.i_edit==undefined) {
this.i_edit=document.createElement('INPUT');
this.i_edit.type="text";
this.i_edit.className="LiteTreeNode_edit";
this.i_edit.style.height=(LiteTree.nodeHeight - 2)+"px";
EventHandler.register(this.i_edit, "onkeypress", LiteTreeNode.handleKeyPress, this);
EventHandler.register(this.i_edit, "onmousedown", LiteTreeNode.handleEditMouseDown, this);
}
return this.i_edit;
}
LiteTreeNode.prototype.editMode=function(state, value) {
if (state!=undefined) {
if (state!=this.i_edit_mode) {
this.i_edit_mode=state;
if (state) {
if (LiteTreeNode.activeEdit!=undefined) {
LiteTreeNode.activeEdit.editMode(false);
LiteTreeNode.activeEdit=undefined;
}
this.name("");
this.i_node_icon.appendChild(this.getEditInput());
this.getEditInput().value=(value!=undefined ? value : this.name());
LiteTreeNode.activeEdit=this;
var me=this;
setTimeout(function() {
me.getEditInput().focus();
me.i_ev=EventHandler.register(document.body, "onmousedown", LiteTreeNode.handleDocumentMouseDown);
me=undefined;
}, 100);
this.updateIcons();
}
else {
try {
this.i_node_icon.removeChild(this.getEditInput());
} catch (e) { }
this.name(this.node().name()+"&nbsp;&nbsp;");
this.i_ev.unregister();
LiteTreeNode.activeEdit=undefined;
this.updateIcons();
}
}
}
return this.i_edit_mode;
}
LiteTreeNode.prototype.iconId=function(id) {
if (id!=undefined) {
if (this.i_icon!=id) {
this.i_icon=id;
this.i_vis_set=null;
}
this.updateIcons();
}
return this.i_icon;
}
LiteTreeNode.prototype.cssClasses=function(css_classes) {
if(css_classes!=undefined) {
this.i_css_classes=css_classes;
this.refreshCssClasses();
}
return this.i_css_classes;
}
LiteTreeNode.prototype.refreshCssClasses=function() {
if(this.i_node_div) {
var classes="LiteTreeNode";
if(this.selected()) {
classes="LiteTreeNode_hover";
}
if(this.showButtons() && this.hasChildren()) {
if(this.open()) {
classes+=" "+this.parent().actionOpenCSS();
} else {
classes+=" "+this.parent().actionClosedCSS();
}
}
classes+=" "+this.i_css_classes.join(" ");
this.i_node_div.className=classes;
}
}
LiteTreeNode.prototype.hasChildren=function(state) {
if (state!=undefined) {
if (this.i_children!=state) {
this.i_children=state;
this.i_vis_set=null;
}
this.updateIcons();
}
return this.i_children;
}
LiteTreeNode.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_node_icon!=undefined) {
this.i_node_icon.innerHTML=name;
}
}
return this.i_name;
}
LiteTreeNode.prototype.showButtons=function(state) {
if (state!=undefined) {
this.i_showButtons=state;
this.updateIcons();
}
return this.i_showButtons;
}
LiteTreeNode.prototype.open=function(state) {
if (state!=undefined) {
if (state!=this.i_open) {
this.i_open=state;
this.i_vis_set=null;
}
this.updateIcons();
}
return this.i_open;
}
LiteTreeNode.handleMouseOver=function(e) {
this.selected(true);
e.returnValue=this.handleCustomEvent("onmouseover", e);
return e.returnValue;
}
LiteTreeNode.handleMouseOut=function(e) {
this.selected(false);
e.returnValue=this.handleCustomEvent("onmouseout", e);
return e.returnValue;
}
LiteTreeNode.prototype.selected=function(state) {
if (state!=undefined) {
if (this.i_selected!=state) {
this.i_selected=state;
this.i_vis_set=null;
}
this.updateIcons();
}
return this.i_selected;
}
LiteTreeNode.handleMouseDown=function(e) {
var b=(e.which!=undefined ? e.which : e.button);
if (b < 2) {
if (this.showButtons()) {
var lf=this.left();
var diff=(CursorMonitor.getX() - lf);
if ((diff > (this.depth() * LiteTree.nodeHeight) && (diff < ((this.depth()+1) * LiteTree.nodeHeight)))) {
if (this.hasChildren()) {
this.node().open(!this.node().open());
if (this.node().open()) {
this.handleCustomEvent("onexpand", e);
}
else {
this.handleCustomEvent("oncollapse", e);
}
this.parent().refresh();
e.cancelBubble=true;
e.returnValue=false;
return false;
}			
}
}
e.returnValue=this.handleCustomEvent("onmousedown", e);
return e.returnValue;
}
e.returnValue=true;
return true;
}
LiteTreeNode.handleContextMenu=function(e) {
e.cancelBubble=true;
e.returnValue=this.handleCustomEvent("oncontextmenu", e, true);
return e.returnValue;
}
LiteTreeNode.handleClick=function(e) {
if (this.showButtons()) {
var lf=this.left();
var diff=(CursorMonitor.getX() - lf);
if (diff > this.depth() * LiteTree.nodeHeight && diff < (this.depth()+1) * LiteTree.nodeHeight) {
if (this.hasChildren()) {
e.returnValue=true;
return true;
}			
}
}
e.returnValue=this.handleCustomEvent("onclick", e);
return e.returnValue;
}
LiteTreeNode.handleDoubleClick=function(e) {
var lf=this.left();
var diff=(CursorMonitor.getX() - lf);
e.ontext=false;
if (diff > ((this.depth()+2) * LiteTree.nodeHeight)) {
e.ontext=true;
}
e.returnValue=this.handleCustomEvent("ondblclick", e);
return e;
}
LiteTreeNode.prototype.handleCustomEvent=function(eventName, e, cancel) {
if (this.node()[eventName]!=undefined) {
return this.node()[eventName](this.parent(), this, this.node(), e);
}
if (this.parent()[eventName]!=undefined) {
return this.parent()[eventName](this.parent(), this, this.node(), e);
}
return true;
}
LiteTreeNode.prototype.updateIcons=function() {
if (this.i_node_div!=undefined && !this.i_working) {
if (this.i_vis_set!=true) {
var cn=(this.showButtons() ? (this.hasChildren() ? (this.open() ? this.parent().actionOpenCSS() : this.parent().actionClosedCSS()) : "") : "");
var tp=mapPositionIndex[cn];
if (tp==undefined) {
tp=0;
}
this.refreshCssClasses();
this.i_node_div.style.backgroundPosition=(this.depth() * LiteTree.nodeHeight)+"px "+tp+"px";
var ico=(this.iconId() >=0 ? " "+this.parent().iconClassFromId(this.iconId(), (this.hasChildren() ? this.open() : false)) : "");
this.i_node_icon.className="LiteTreeNode_icon"+ico;
var cn=this.i_node_icon.className.substr(this.i_node_icon.className.indexOf(' ')+1);
var tp=mapPositionIndex[cn];
if (tp==undefined) {
tp=0;
}
this.i_node_icon.style.backgroundPosition=((this.depth()+(this.showButtons() ? 1 : 0)) * LiteTree.nodeHeight)+"px "+tp+"px";
this.i_node_icon.style.paddingLeft=((((ico!="" ? this.depth() : this.depth() - 1)+(this.showButtons() ? 2 : 1)) * LiteTree.nodeHeight)+LiteTree.iconPadding)+"px";
this.i_vis_set=true;
}
}
}
LiteTreeNode.cancelNodeSelect=function(e) {
var ev=(document.all ? event : e);
ev.cancelBubble=true;
e.returnValue=true;
return true;
}
LiteTreeNode.prototype.getNode=function() {
if (this.i_node_div==undefined) {
this.i_node_div=document.createElement('DIV');
this.i_node_div_tipObj=new ToolTip(this.i_node_div);
EventHandler.register(this.i_node_div, "onmouseover", LiteTreeNode.handleMouseOver, this);
EventHandler.register(this.i_node_div, "onmouseout", LiteTreeNode.handleMouseOut, this);
EventHandler.register(this.i_node_div, "onmousedown", LiteTreeNode.handleMouseDown, this);
EventHandler.register(this.i_node_div, "ondblclick", LiteTreeNode.handleDoubleClick, this);
EventHandler.register(this.i_node_div, "onclick", LiteTreeNode.handleClick, this);
EventHandler.register(this.i_node_div, "oncontextmenu", LiteTreeNode.handleContextMenu, this);
this.i_node_div.style.height=LiteTree.nodeHeight+"px";
this.i_node_icon=document.createElement('DIV');
this.i_node_icon.innerHTML=this.name();
this.i_node_icon.style.height=LiteTree.nodeHeight+"px";
this.i_node_icon.style.lineHeight=LiteTree.nodeHeight+"px";
EventHandler.register(this.i_node_icon, "onselectstart", LiteTreeNode.cancelNodeSelect);
this.i_node_div.appendChild(this.i_node_icon);
this.updateIcons();
}
return this.i_node_div;
}
function LiteTreeDataModel(root) {
this.i_listeners=Array();
this.rootNode(root);
this.i_cache_code=0;
}
LiteTreeDataModel.prototype.onchange=null;
LiteTreeDataModel.prototype.triggerChange=function() {
this.i_cache_code++;
for (var x=0; x < this.i_listeners.length; x++) {
if (this.i_listeners[x].building()!=true) {
this.i_listeners[x].nodes(this.nodes());
this.i_listeners[x].refresh();
}
}
if (this.onchange!=undefined) {
this.onchange();
}
return true;
}
LiteTreeDataModel.prototype.openNodes=function() {
var nodes=Array();
this.i_get_nodes=Array();
this.i_get_p=0;
this.i_get_nodes[this.i_get_p]=this.rootNode();
if (this.rootNode()!=undefined) {
while (this.i_get_p >=0) {
var node=this.i_get_nodes[this.i_get_p--];
if (node.i_open) {
var nc=node.i_nodes;
if (nc!=undefined) {
nodes[nodes.length]=node;
for (var x=nc.length - 1; x >=0; x--) {
this.i_get_nodes[++this.i_get_p]=nc[x];
}
}
}
}
}
return nodes;
}
LiteTreeDataModel.prototype.getNodes=function(start, count) {
this.i_get_collection=Array();
this.i_get_start=start;
this.i_get_count=count;
this.i_get_cur=0;
this.i_get_nodes=Array();
var added=0;
this.i_get_p=0;
this.i_get_nodes[this.i_get_p]=this.rootNode();
if (this.rootNode()!=undefined) {
while (this.i_get_p >=0) {
var node=this.i_get_nodes[this.i_get_p];
this.i_get_p--;
if (node.i_vis_dec_cache_id!=this.i_cache_code) {
node.i_vis_dec_cache=node.visibleDescendants();
node.i_vis_dec_cache_id=this.i_cache_code;
}
if (this.i_get_cur+node.i_vis_dec_cache >=start) {
if (this.i_get_cur >=start) {
this.i_get_collection[added++]=node;
if (added >=count) {
break;
}
}
if (node.i_open) {
var nc=node.i_nodes;
if (nc!=undefined) {
for (var x=nc.length - 1; x >=0; x--) {
this.i_get_nodes[++this.i_get_p]=nc[x];
}
}
}
}
else {
this.i_get_cur+=node.i_vis_dec_cache;
}
this.i_get_cur+=1;
}
}
return this.i_get_collection;
}
LiteTreeDataModel.prototype.registerListener=function(listener) {
this.i_listeners[this.i_listeners.length]=listener;
}
LiteTreeDataModel.prototype.unregisterListener=function(listener) {
for (var x=0; x <=this.i_listeners.length; x++) {
if (this.i_listeners[x]==listener) {
this.i_listeners.splice(x, 1);
return true;
}
}
return false;
}
LiteTreeDataModel.prototype.nodes=function() {
if (this.i_root!=undefined){
return this.i_root.visibleDescendants()+1;
}
return 0;
}
LiteTreeDataModel.prototype.flatTree=function() {
alert('Call to LiteTreeDataModel.flatTree() depreciated');
}
LiteTreeDataModel.prototype.rootNode=function(root) {
if (root!=undefined) {
this.i_root=root;
root.tree(this);
root.visible(true);
this.triggerChange();
}
return this.i_root;
}
function LiteDataNode(id, name, tipText, iconId, open) {
this.i_id=id;
this.i_name=name;
this.i_tip=tipText;
this.i_icon=iconId;
this.i_open=(open==true ? true : false);
this.i_depth=0;
this.i_nodes;	
this.i_listeners=Array();
this.i_css_classes=[];
}
LiteDataNode.prototype.onchange=null;
LiteDataNode.prototype.onexpand=null;
LiteDataNode.prototype.oncollapse=null;
LiteDataNode.prototype.onmouseover=null;
LiteDataNode.prototype.onmouseout=null;
LiteDataNode.prototype.onmousedown=null;
LiteDataNode.prototype.ondblclick=null;
LiteDataNode.prototype.oncontextmenu=null;
LiteDataNode.prototype.parent=function() {
return this.i_parent;
}
LiteDataNode.prototype.isRoot=function() {
return (this.depth()==0);
}
LiteDataNode.prototype.registerNode=function(node) {
this.i_listeners[this.i_listeners.length]=node;
this.refreshCssClasses();
}
LiteDataNode.prototype.unregisterNode=function(node) {
for (var x=0; x < this.i_listeners.length; x++) {
if (this.i_listeners[x]==node) {
this.i_listeners.splice(x, 1);
return true;
}
}
return false;
}
LiteDataNode.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
LiteDataNode.prototype.tree=function(tree) {
if (tree!=undefined) {
this.i_tree=tree;
if (this.children()!=undefined) {
for (var x=0; x < this.children().length; x++) {
this.children(x).tree(tree);
}
}
}
return this.i_tree;
}
LiteDataNode.prototype.visibleDescendants=function() {
if (!this.i_visible || !this.i_open || this.i_nodes==undefined || this.i_nodes.length==0) {
return 0;
}
this.i_cache_vis=0;
for (var x=0; x < this.i_nodes.length; x++) {
this.i_cache_vis+=1+this.i_nodes[x].visibleDescendants();
}
return this.i_cache_vis;
}
LiteDataNode.prototype.index=function(index) {
alert('Call to LiteDataNode.index() depreciated');
}
LiteDataNode.prototype.visible=function(state) {
if (state!=undefined) {
if (this.i_visible!=state) {
this.i_visible=state;
this.i_cache_vis=null;
if (this.i_nodes!=undefined) {
for (var x=0; x < this.i_nodes.length; x++) {
this.i_nodes[x].visible(state);
}
}
}
}
return this.i_visible;
}
LiteDataNode.prototype.open=function(state) {
if (state!=undefined) {
if (this.i_open!=state) {
this.i_open=state;
if (this.visible()) {
if (this.i_nodes!=undefined) {
for (var x=0; x < this.i_nodes.length; x++) {
this.i_nodes[x].visible(state);
}
}
for (var x=0; x < this.i_listeners.length; x++) {
try {
this.i_listeners[x].open(state);
} catch (e) { }
}		
if (this.tree()!=undefined) {
this.tree().triggerChange();
}
}
}
}
return this.i_open;
}
LiteDataNode.prototype.children=function(index) {
if (index!=undefined) {
if (this.i_nodes==undefined) {
return undefined;
}
return this.i_nodes[index];
}
return this.i_nodes;
}
LiteDataNode.prototype.addNode=function(node, beforeNode) {
var nodes=node;
if (node.slice==undefined) {
nodes=Array();
nodes[0]=node;
}
if (this.i_nodes==undefined) {
this.i_nodes=Array();
for (var x=0; x < this.i_listeners.length; x++) {
try {
this.i_listeners[x].hasChildren(true);
} catch (e) { }
}
}
var beforeIndex=-1;
if (beforeNode!=undefined) {
for (var x=0; x < this.i_nodes.length; x++) {
if (this.i_nodes[x]==beforeNode) {
beforeIndex=x;
break;
}
}
}
var nDepth=this.depth()+1;
if (beforeIndex >=0) {
for (var x=nodes.length - 1; x >=0; x--) {
this.i_nodes.splice(beforeIndex, 0, nodes[x]);
nodes[x].depth(nDepth);
nodes[x].i_parent=this;
nodes[x].tree(this.tree());
nodes[x].visible(this.open() && this.visible());
}
}
else {
var s=this.i_nodes.length;
for (var x=0; x < nodes.length; x++) {
this.i_nodes[s+x]=nodes[x];
nodes[x].depth(nDepth);
nodes[x].i_parent=this;
nodes[x].tree(this.tree());
nodes[x].visible(this.open() && this.visible());
}
}
if (this.tree()!=undefined) {
this.tree().triggerChange();
}
return node;
}
LiteDataNode.prototype.removeNode=function(node) {
var rNodes=(node.slice!=undefined ? node : Array(node));
var found=0;
for (var x=0; x < rNodes.length; x++) {
for (var z=0; z < this.i_nodes.length; z++) {
if (this.i_nodes[z]==rNodes[x]) {
this.i_nodes[z].i_parent=null;
this.i_nodes[z].visible(false);
this.i_nodes.splice(z, 1);
found++;
break;
}
}
}
if (found > 0) {
if (this.tree()!=undefined) {
this.tree().triggerChange();
}
}
if (this.children().length==0) {
this.i_nodes=undefined;
for (var x=0; x < this.i_listeners.length; x++) {
try {
this.i_listeners[x].hasChildren(false);
} catch (e) { }
}
}
return (found==rNodes.length);
}
LiteDataNode.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
for (var x=0; x < this.i_listeners.length; x++) {
try {
this.i_listeners[x].name(name);
} catch(e) { }
}
}
return this.i_name;
}
LiteDataNode.prototype.tipText=function(text) {
if (text!=undefined) {
this.i_tip=text;
for (var x=0; x < this.i_listeners.length; x++) {
try { 
this.i_listeners[x].toolTip(text);
} catch (e) { }
}
}
return this.i_tip;
}
LiteDataNode.prototype.iconId=function(id) {
if (id!=undefined) {
this.i_icon=id;
for (var x=0; x < this.i_listeners.length; x++) {
try {
this.i_listeners[x].iconId(id);
} catch (e) { }
}
}
return this.i_icon;
}
LiteDataNode.prototype.addCssClass=function(class_name) {
this.i_css_classes.push(class_name);
this.refreshCssClasses();
}
LiteDataNode.prototype.removeCssClass=function(class_name) {
for(var i=this.i_css_classes.length; i >=0; i--) {
if(this.i_css_classes[i]==class_name) {
this.i_css_classes.splice(i, 1);
}
}
this.refreshCssClasses();
}
LiteDataNode.prototype.refreshCssClasses=function() {
for(var i=0; i < this.i_listeners.length; i++) {
try {
this.i_listeners[i].cssClasses(this.i_css_classes);
} catch(e) { }
}
}
LiteDataNode.prototype.depth=function(depth) {
if (depth!=undefined) {
if (this.i_depth!=depth) {
this.i_depth=depth;
if (this.children()!=undefined) {
for (var x=0; x < this.children().length; x++) {
try {
this.children(x).depth(depth+1);
} catch (e) { }
}
}
for (var x=0; x < this.i_listeners.length; x++) {
try {
this.i_listeners[x].depth(depth);
} catch (e) { }
}
}
}
return this.i_depth;
}
LiteDataNode.prototype.deepCopy=function(fun) {
var result=new LiteDataNode(this.i_id,this.i_name,this.i_tip,this.i_icon);
if (this.i_nodes) {
for (var i=0;i<this.i_nodes.length;i++) {
result.addNode(this.i_nodes[i].deepCopy(fun));
}
}
if (fun) { fun(result, this); }
return result;
}
JavaScriptResource.notifyComplete("./lib/components/Component.LiteTree.js");
function NavigationBar(width, minimized) {
this.i_minimized=minimized;
this.i_width=width;
this.i_buttons=Array();
this.i_links=Array();
this.i_search_width=10;
this.i_logo_text_width=0;
this.i_link_width=0;
this.i_logo_width=1;
this.i_locked=false;
}
NavigationBar.normalHeight=65;
NavigationBar.minimizedHeight=30;
NavigationBar.leftPadding=5;
NavigationBar.rightLogoPadding=10;
NavigationBar.prototype.onresize=null;
NavigationBar.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_bar!=undefined) {
this.i_bar.style.width=this.width()+"px";
this.updateBarWidth();
}
}
return this.i_width;
}
NavigationBar.prototype.locked=function(state) {
if (state!=undefined) {
this.i_locked=state;
}
return this.i_locked;
}
NavigationBar.prototype.ordering=function(order) {
if (order!=undefined && order.length > 0) {
this.i_ordering=order;
var all_buttons=Array();
var button_ref=Array();
for (var x=0; x < this.i_buttons.length; x++) {
var found=false;
for (var z=0; z < order.length; z++) {
if (order[z]==this.i_buttons[x].id()) {
found=true;		
}
}
if (!found) {
all_buttons[x]=this.i_buttons[x].id();
}
button_ref[this.i_buttons[x].id()]=this.i_buttons[x];
}
for (var x=this.i_buttons.length - 1; x >=0; x--) {
this.removeButton(this.i_buttons[x]);
}
for (var x=0; x < order.length; x++) {
if (button_ref[order[x]]!=undefined) {
this.addButton(button_ref[order[x]]);
}
}
for (var x=0; x < all_buttons.length; x++) {
if (button_ref[all_buttons[x]]!=undefined) {
this.addButton(button_ref[all_buttons[x]]);
}
}
}
var ret=Array();
for (var x=0; x < this.i_buttons.length; x++) {
ret[ret.length]=this.i_buttons[x].id();
}
return ret;
}	
NavigationBar.prototype.searchWidth=function(width) {
if (width!=undefined) {
this.i_search_width=width;
if (this.i_bar!=undefined) {
this.i_bar_search.style.width=this.searchWidth()+"px";
this.updateBarWidth();
}
}
return this.i_search_width;
}
NavigationBar.prototype.searchContent=function(content) {
if (content!=undefined) {
if (this.i_search_content!=undefined && this.i_bar_search!=undefined) {
this.i_bar_search.removeChild(this.i_search_content);
}
this.i_search_content=content;
this.i_search_content.style.marginTop=(this.minimized() ? 4 : 10)+"px";
this.i_search_content.style.marginRight=(this.minimized() ? 10 : 5)+"px";
if (this.i_bar_search!=undefined) {
this.i_bar_search.appendChild(content);
}
}
return this.i_search_content;
}
NavigationBar.prototype.height=function() {
return (this.minimized() ? NavigationBar.minimizedHeight : NavigationBar.normalHeight);
}
NavigationBar.prototype.handleLogoLoad=function(e) {
this.logoWidth(parseInt(this.i_preload_logo_div.offsetWidth)+NavigationBar.rightLogoPadding+(document.all ? 30 : 0));
document.body.removeChild(this.i_preload_logo_div);
}
NavigationBar.prototype.logoPath=function(logo) {
if (logo!=undefined) {
this.i_logo=logo;
if (this.i_bar!=undefined) {
this.i_bar_logo.style.backgroundImage=(this.minimized()==true ? "none" : "url("+logo+")");
}
this.i_preload_logo_div=document.createElement('DIV');
this.i_preload_logo_div.style.position="absolute";
this.i_preload_logo_div.style.visibility="hidden";
this.i_preload_logo=new Image();
this.i_preload_logo_div.appendChild(this.i_preload_logo);
EventHandler.register(this.i_preload_logo, "onload", this.handleLogoLoad, this);
document.body.appendChild(this.i_preload_logo_div);
this.i_preload_logo.src=logo;
}
return this.i_logo;
}
NavigationBar.prototype.handleLogoClick=function() {
window.location.assign(SystemCore.companyURL());
}
NavigationBar.prototype.logoWidth=function(width) {
if (width!=undefined) {
this.i_logo_width=width;
if (this.i_bar!=undefined) {
this.i_bar_logo.style.width=(this.minimized() ? this.i_logo_text_width : this.logoWidth());
this.updateBarWidth();
}
}
return this.i_logo_width;
}
NavigationBar.prototype.logoText=function(text) {
if (text!=undefined) {
this.i_logo_text=text;
var t=TextDimension(text, "NavigationBar_minimized_logo_adjust");
this.i_logo_text_width=t.width+NavigationBar.rightLogoPadding;
if (this.i_bar!=undefined) {
this.i_bar_logo.innerHTML=(this.minimized() ? this.logoText() : "&nbsp;");	
this.i_bar_logo.style.width=(this.minimized() ? this.i_logo_text_width : this.logoWidth());
this.updateBarWidth();
}
}
return this.i_logo_text;
}
NavigationBar.prototype.minimized=function(minimized) {
if (minimized!=undefined) {
if (this.i_minimized!=minimized) {
this.i_minimized=minimized;
if (this.i_bar!=undefined) {
for (var x=0; x < this.i_buttons.length; x++){ 
this.i_bar_buttons.removeChild(this.minimized() ? this.i_buttons[x].getButton() : this.i_buttons[x].getMinimizedButton());
this.i_bar_buttons.appendChild(this.minimized() ? this.i_buttons[x].getMinimizedButton() : this.i_buttons[x].getButton());
}
this.i_bar_logo.style.width=(this.minimized() ? this.i_logo_text_width : this.logoWidth());
this.i_bar.style.height=this.height()+"px";
this.i_bar_logo.style.height=this.height()+"px";
this.i_bar_buttons.style.height=this.height()+"px";
this.i_bar.className="NavigationBar"+(this.minimized() ? "_minimized" : "");
this.i_bar_logo.style.backgroundImage=(this.minimized()==true ? "none" : "url("+this.logoPath()+")");
this.i_bar_logo.style.lineHeight=this.height()+"px";
this.i_bar_logo.innerHTML=(this.minimized() ? this.logoText() : "&nbsp;");
this.i_bar_padding.style.height=this.height()+"px";
this.i_extra.style.height=this.height()+"px";					
this.updateBarWidth();
this.i_bar_search.style.height=(this.minimized() ? this.height() : this.height() - NavigationLink.linkHeight)+"px";
if (this.i_search_content!=undefined) {
this.i_search_content.style.marginTop=(this.minimized() ? 4 : 10)+"px";
this.i_search_content.style.marginRight=(this.minimized() ? 10 : 5)+"px";
}
this.i_bar_links.style.top=(this.minimized() ? (this.height() - NavigationLink.linkHeight) : 0)+"px";
if (this.minimized()) {
this.i_extra.appendChild(this.i_bar_search);
}
else {
this.i_extra.appendChild(this.i_bar_links);
}
}
SystemCore.layoutManager().activeConfiguration().minimizedNavigation(minimized);
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.bar=this;
this.onresize(o);
}
}
}
return this.i_minimized;
}
NavigationBar.prototype.unselectAll=function() {
for (var x=0; x < this.i_buttons.length; x++) {
if (this.i_buttons[x].selectedState()==true) {
this.i_buttons[x].selectedState(false);
}
}
}
NavigationBar.prototype.buttons=function(index) {
if (index!=undefined) {
return this.i_buttons[index];
}
return this.i_buttons;
}
NavigationBar.prototype.addButton=function(button, beforeButton) {
var append=true;
button.i_parent=this;
if (beforeButton!=undefined) {
for (var x=0; x < this.i_buttons.length; x++) {
if (this.i_buttons[x]==beforeButton) {
this.i_buttons.splice(x, 0, button);
append=false;
if (this.i_bar!=undefined) {
this.i_bar_buttons.insertBefore((this.minimized() ? button.getMinimizedButton() : button.getButton()), (this.minimized() ? beforeButton.getMinimizedButton() : beforeButton.getButton()));
}
break;
}
}
}
if (append) {
this.i_buttons[this.i_buttons.length]=button;
if (this.i_bar!=undefined) {
this.i_bar_buttons.appendChild(this.minimized() ? button.getMinimizedButton() : button.getButton());
}
}
if (button.i_seen==undefined) {
button.i_seen=true;
this.ordering(this.i_ordering);
}
return button;
}
NavigationBar.prototype.removeButton=function(button) {
for (var x=0; x < this.i_buttons.length; x++) {
if (this.i_buttons[x]==button) {
this.i_buttons.splice(x, 1);
if (this.i_bar!=undefined) {
this.i_bar_buttons.removeChild(this.minimized() ? button.getMinimizedButton() : button.getButton());
}
return true;
}
}
return false;
}
NavigationBar.prototype.links=function(index) {
if (index!=undefined) {
return this.i_links[index];
}
return this.i_links;
}
NavigationBar.prototype.addLink=function(link, beforeLink) {
var append=true;
if (beforeLink!=undefined) {
for (var x=0; x < this.i_links.length; x++) { 
if (this.i_links[x]==beforeLink) {
this.i_links.splice(x, 0, link);
append=false;
if (this.i_bar!=undefined) {
this.i_bar_links.insertBefore(link.getLink(), beforeLink.getLink());
}
break;
}
}
}
if (append) {
this.i_links[this.i_links.length]=link;
if (this.i_bar!=undefined) {
this.i_bar_links.appendChild(link.getLink());
}
}
link.i_rl=EventHandler.register(link, "onresize", this.updateLinkWidth, this);
this.updateLinkWidth();
return link;
}
NavigationBar.prototype.removeLink=function(link) {
for (var x=0; x < this.i_links.length; x++) {
if (this.i_links[x]==link) {
this.i_links.splice(x, 1);
this.updateLinkWidth();
link.i_rl.unregister();
if (this.i_bar!=undefined) {
this.i_bar_links.removeChild(link.getLink());
}
return true;
}
}
return false;
}
NavigationBar.prototype.updateLinkWidth=function() {
var w=0;
for (var x=0; x < this.i_links.length; x++) {
w+=this.i_links[x].width();	
}
this.i_link_width=w;
this.updateBarWidth();
}
NavigationBar.prototype.updateBarWidth=function() {
if (this.i_extra!=undefined) {
var temp_width=(this.minimized()==true ? this.searchWidth()+this.i_link_width : (this.searchWidth() > this.i_link_width ? this.searchWidth() : this.i_link_width));
this.i_extra.style.width=(temp_width > 0 ? temp_width : 0)+"px";
}
if (this.i_bar_buttons!=undefined) {
var temp_width=this.width() - ((this.minimized() ? this.i_logo_text_width : this.logoWidth())+(this.minimized() ? this.searchWidth()+this.i_link_width : (this.searchWidth() > this.i_link_width ? this.searchWidth() : this.i_link_width))+NavigationBar.leftPadding+10);
this.i_bar_buttons.style.width=(temp_width > 0 ? temp_width : 0)+"px";
this.i_bar_links.style.width=(this.i_link_width > 0 ? this.i_link_width : 0)+"px";
}
}
NavigationBar.prototype.handleDoubleClick=function(e) {
this.minimized(!this.minimized());
SystemCore.layoutManager().notifyChange();
}
NavigationBar.prototype.contextMenu=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu(100, "Navigation Style");
this.i_context_small=this.i_context.addItem(new ContextMenuBoolean("Small", this.minimized(), true));
EventHandler.register(this.i_context_small, "onclick", this.handleContextSelect, this);
this.i_context_large=this.i_context.addItem(new ContextMenuBoolean("Large", !this.minimized(), true));
EventHandler.register(this.i_context_large, "onclick", this.handleContextSelect, this);
}
return this.i_context;
}
NavigationBar.prototype.handleContextSelect=function(e) {
if (e.item==this.i_context_small) {
this.minimized(true);
this.i_context_small.state(true);
this.i_context_large.state(false);
}
else {
this.minimized(false);
this.i_context_small.state(false);
this.i_context_large.state(true);
}
}
NavigationBar.prototype.handleContext=function(e) {
var c=this.contextMenu();
c.show();
e.cancelBubble=true;
e.returnValue=false;
}
NavigationBar.prototype.getBar=function() {
if (this.i_bar==undefined) {
this.i_bar=document.createElement('DIV');
this.i_bar.className="NavigationBar"+(this.minimized() ? "_minimized" : "");
this.i_bar.style.width=this.width()+"px";
this.i_bar.style.height=this.height()+"px";
EventHandler.register(this.i_bar, "ondblclick", this.handleDoubleClick, this);
EventHandler.register(this.i_bar, "oncontextmenu", this.handleContext, this);
this.i_bar_padding=document.createElement('DIV');
this.i_bar_padding.className="NavigationBar_padding";
this.i_bar_padding.style.width=NavigationBar.leftPadding+"px";
this.i_bar_padding.style.height=this.height()+"px";
this.i_bar_padding.innerHTML="&nbsp;";
this.i_bar.appendChild(this.i_bar_padding);
this.i_bar_logo=document.createElement('DIV');
this.i_bar_logo.className="NavigationBar_logo";
this.i_bar_logo.style.backgroundImage=(this.minimized() ? "" : "url("+this.logoPath()+")");
this.i_bar_logo.style.width=(this.minimized() ? this.i_logo_text_width : this.logoWidth());
this.i_bar_logo.style.height=this.height()+"px";
this.i_bar_logo.style.lineHeight=this.height()+"px";
this.i_bar_logo.innerHTML=(this.minimized() ? this.logoText() : "&nbsp;");
if (SystemCore.companyURL()!=undefined){
EventHandler.register(this.i_bar_logo, "onmousedown", this.handleLogoClick, this);
this.i_bar_logo.style.cursor='pointer';
}
this.i_bar.appendChild(this.i_bar_logo);
this.i_bar_buttons=document.createElement('DIV');
this.i_bar_buttons.className="NavigationBar_buttons";
this.i_bar_buttons.style.height=this.height()+"px";
var bwidth=(this.width() - ((this.minimized() ? this.i_logo_text_width : this.logoWidth())+(this.minimized() ? this.searchWidth()+this.i_link_width : (this.searchWidth() > this.i_link_width ? this.searchWidth() : this.i_link_width))+NavigationBar.leftPadding+10));
if (bwidth <=0) {
bwidth=1;
}
this.i_bar_buttons.style.width=bwidth+"px";
this.i_bar.appendChild(this.i_bar_buttons);
for (var x=0; x < this.i_buttons.length; x++) { 
this.i_bar_buttons.appendChild((this.minimized() ? this.i_buttons[x].getMinimizedButton() : this.i_buttons[x].getButton()));
}
this.i_extra=document.createElement('DIV');
this.i_extra.className="NavigationBar_extra";
this.i_extra.style.width=(this.minimized()==true ? this.searchWidth()+this.i_link_width+20 : (this.searchWidth() > this.i_link_width ? this.searchWidth() : this.i_link_width))+"px";
this.i_extra.style.height=this.height()+"px";
this.i_bar.appendChild(this.i_extra);
this.i_bar_search=document.createElement('DIV');
this.i_bar_search.className="NavigationBar_search";
this.i_bar_search.style.height=(this.minimized() ? this.height() : this.height() - NavigationLink.linkHeight)+"px";
this.i_bar_search.style.width=this.searchWidth()+"px";
if (this.i_search_content!=undefined) {
this.i_bar_search.appendChild(this.searchContent());
}
this.i_bar_links=document.createElement('DIV');
this.i_bar_links.className="NavigationBar_links";
this.i_bar_links.style.height=NavigationLink.linkHeight+"px";
this.i_bar_links.style.width=this.i_link_width+"px";
this.i_bar_links.style.lineHeight=NavigationLink.linkHeight+"px";
this.i_bar_links.style.top=(this.minimized() ? (this.height() - NavigationLink.linkHeight) : 0)+"px";
for (var x=0; x < this.i_links.length; x++){ 
this.i_bar_links.appendChild(this.i_links[x].getLink());
}
if (this.minimized()) {
this.i_extra.appendChild(this.i_bar_links);
this.i_extra.appendChild(this.i_bar_search);	
}
else {
this.i_extra.appendChild(this.i_bar_search);	
this.i_extra.appendChild(this.i_bar_links);
}
}
return this.i_bar;
}
function NavigationButton(id, label, normalIcon, minimizedIcon) {
this.i_id=id;
this.i_label=label;
this.i_normalIcon=normalIcon;
this.i_minimizedIcon=minimizedIcon;
this.i_selected_state=false;
this.i_hover_state=false;
}
NavigationButton.normalWidth=60;
NavigationButton.normalHeight=50;
NavigationButton.minimizedWidth=28;
NavigationButton.minimizedHeight=28;
NavigationButton.normalIconWidth=40;
NavigationButton.normalIconHeight=40;
NavigationButton.minimizedIconWidth=16;
NavigationButton.minimizedIconHeight=16;
NavigationButton.normalTextTop=43;
NavigationButton.prototype.onselect=null;
NavigationButton.prototype.ondeselect=null;
NavigationButton.prototype.parent=function() {
return this.i_parent;
}
NavigationButton.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
NavigationButton.prototype.label=function(label) {
if (label!=undefined) {
this.i_label=label;
if (this.i_button!=undefined) {
this.i_button_text.innerHTML=this.label();
this.i_normal_tip.tip(label);
}
if (this.i_minimized_button!=undefined) {
this.i_minimized_tip.tip(label);
}
}
return this.i_label;
}
NavigationButton.prototype.normalIcon=function(icon) {
if (icon!=undefined) {
this.i_normalIcon=icon;
if (this.i_button!=undefined) {
this.i_button_icon.className="NavigationButton_normal_icon "+this.normalIcon();
}
}
return this.i_normalIcon;
}
NavigationButton.prototype.minimizedIcon=function(icon) {
if (icon!=undefined) {
this.i_minimizedIcon=icon;
if (this.i_minimized_button!=undefined) {
this.i_minimized_icon.className="NavigationButton_minimized_icon "+this.minimizedIcon();
}
}
return this.i_minimizedIcon;
}
NavigationButton.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover_state=state;
if (this.i_button!=undefined) {
this.i_button.className="NavigationButton_normal"+(this.selectedState()==true ? "_selected" : "")+(this.hoverState()==true ? "_hover" : ""); 
}
if (this.i_minimized_button!=undefined) {
this.i_minimized_button.className="NavigationButton_minimized"+(this.selectedState()==true ? "_selected" : "")+(this.hoverState()==true ? "_hover" : ""); ;
}
}
return this.i_hover_state;
}
NavigationButton.prototype.selectedState=function(state) {
if (state!=undefined) {
if (state!=this.i_selected_state) {
this.i_selected_state=state;
if (this.i_button!=undefined) {
this.i_button.className="NavigationButton_normal"+(this.selectedState()==true ? "_selected" : "")+(this.hoverState()==true ? "_hover" : ""); 
}
if (this.i_minimized_button!=undefined) {
this.i_minimized_button.className="NavigationButton_minimized"+(this.selectedState()==true ? "_selected" : "")+(this.hoverState()==true ? "_hover" : ""); ;
}
if (state==true && this.onselect!=undefined) {
var o=new Object();
o.type="select";
o.button=this;
this.onselect(o);
}
if (state==false && this.ondeselect!=undefined) {
var o=new Object();
o.type="deselect";
o.button=this;
this.ondeselect(o);
}
}
}
return this.i_selected_state;
}
NavigationButton.prototype.handleMouseOver=function(e) {
this.hoverState(true);
}
NavigationButton.prototype.handleMouseOut=function(e) {
this.hoverState(false);
}
NavigationButton.prototype.handleClick=function(e) {
if (this.selectedState()!=true) {
var lastSelected;
for (var x=0; x < this.parent().i_buttons.length; x++) {
if (this.parent().i_buttons[x].selectedState()==true) {
lastSelected=this.parent().i_buttons[x];			
this.parent().i_buttons[x].selectedState(false);
}
}
this.selectedState(true);
}
if (this.onclick!=undefined) {
var o=new Object();
o.type="click";
o.lastNav=lastSelected;
o.nav=this;
this.onclick(o);
}
}
NavigationButton.prototype.handleMouseDown=function(e) {
if (this.parent().locked()!=true) {
if (this.i_mul!=undefined) {
this.i_mul.unregister();
this.i_mum.unregister();
}
this.i_mul=EventHandler.register(document.body, "onmouseup", this.handleMouseUp, this);
this.i_mum=EventHandler.register(document.body, "onmousemove", this.handleMouseMove, this);
var me=this.parent().i_bar_buttons;
var lf=0;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
this.i_start_left=lf;
this.i_start_width=(this.parent().minimized() ? NavigationButton.minimizedWidth : NavigationButton.normalWidth);
var diff_x=CursorMonitor.getX() - this.i_start_left;
this.i_start_pos=Math.floor(diff_x / this.i_start_width);
this.i_original_pos=this.i_start_pos;
}
}
NavigationButton.prototype.handleMouseMove=function(e) {
var x=CursorMonitor.getX();
var diff_x=x - this.i_start_left;
var bts=Math.floor(diff_x / this.i_start_width);
if (bts < 0) {
bts=0;
}
if (bts!=this.i_start_pos) {
this.parent().removeButton(this);
this.parent().addButton(this, this.parent().i_buttons[bts]);
this.i_start_pos=bts;
}
}
NavigationButton.prototype.handleMouseUp=function(e) {
this.i_mul.unregister();
this.i_mum.unregister();
this.i_mul=null;
this.i_mum=null;
if (this.i_start_pos!=this.i_original_pos) {
SystemCore.layoutManager().activeConfiguration().buttonOrdering(this.parent().ordering());
SystemCore.layoutManager().notifyChange();
}
}
NavigationButton.prototype.getButton=function() {
if (this.i_button==undefined) {
this.i_button=document.createElement('DIV');
this.i_button.className="NavigationButton_normal"+(this.selectedState()==true ? "_selected" : "")+(this.hoverState()==true ? "_hover" : ""); 
this.i_button.style.width=NavigationButton.normalWidth+"px";
this.i_button.style.height=NavigationButton.normalHeight+"px";
this.i_button.style.top=Math.floor((NavigationBar.normalHeight - NavigationButton.normalHeight) / 2)+"px";
this.i_button.onselectstart=EventHandler.cancelEvent;
EventHandler.register(this.i_button, "onmousedown", this.handleMouseDown, this);
EventHandler.register(this.i_button, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_button, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_button, "onclick", this.handleClick, this);
this.i_normal_tip=new ToolTip(this.i_button);
this.i_normal_tip.tip(this.label());
this.i_button_icon=document.createElement('DIV');
this.i_button_icon.className="NavigationButton_normal_icon "+this.normalIcon();
this.i_button_icon.style.width=NavigationButton.normalWidth+"px";
this.i_button_icon.style.height=NavigationButton.normalHeight+"px";
this.i_button.appendChild(this.i_button_icon);
this.i_button_text=document.createElement('DIV');
this.i_button_text.className="NavigationButton_normal_label";
this.i_button_text.style.width=NavigationButton.normalWidth+"px";
this.i_button_text.style.height="16px";
this.i_button_text.style.top=NavigationButton.normalTextTop+"px";
this.i_button_text.innerHTML=this.label();
}
return this.i_button;
}
NavigationButton.prototype.getMinimizedButton=function() {
if (this.i_minimized_button==undefined) {
this.i_minimized_button=document.createElement('DIV');
this.i_minimized_button.className="NavigationButton_minimized"+(this.selectedState()==true ? "_selected" : "")+(this.hoverState()==true ? "_hover" : ""); ;
this.i_minimized_button.style.width=NavigationButton.minimizedWidth+"px";
this.i_minimized_button.style.height=NavigationButton.minimizedHeight+"px";
this.i_minimized_button.style.top=Math.floor((NavigationBar.minimizedHeight - NavigationButton.minimizedHeight) / 2)+"px";
this.i_minimized_button.onselectstart=EventHandler.cancelEvent;
EventHandler.register(this.i_minimized_button, "onmousedown", this.handleMouseDown, this);
EventHandler.register(this.i_minimized_button, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_minimized_button, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_minimized_button, "onclick", this.handleClick, this);
this.i_minimized_tip=new ToolTip(this.i_minimized_button);
this.i_minimized_tip.tip(this.label());
this.i_minimized_icon=document.createElement('DIV');
this.i_minimized_icon.className="NavigationButton_minimized_icon "+this.minimizedIcon();
this.i_minimized_icon.style.width=NavigationButton.minimizedIconWidth+"px";
this.i_minimized_icon.style.height=NavigationButton.minimizedIconHeight+"px";
this.i_minimized_icon.style.left=Math.floor((NavigationButton.minimizedWidth - NavigationButton.minimizedIconWidth) / 2)+"px";
this.i_minimized_icon.style.top=Math.floor((NavigationButton.minimizedHeight - NavigationButton.minimizedIconHeight) / 2)+"px";
this.i_minimized_button.appendChild(this.i_minimized_icon);
this.i_minimized_icon.innerHTML="&nbsp;";
}
return this.i_minimized_button;
}
function NavigationLink(label, iconClass, context) {
this.i_iconClass=iconClass;
this.i_context=context;
this.label(label);
}
NavigationLink.linkHeight=16;
NavigationLink.iconWidth=10;
NavigationLink.iconHeight=10;
NavigationLink.iconPadding=4;
NavigationLink.rightPadding=10;
NavigationLink.prototype.onresize=null;
NavigationLink.prototype.onclick=null;
NavigationLink.prototype.width=function() {
return this.i_labelWidth+NavigationLink.iconPadding+NavigationLink.iconWidth+NavigationLink.rightPadding;
}
NavigationLink.prototype.left=function() {
var lf=0;
var me=this.i_link;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
return lf;
}
NavigationLink.prototype.top=function() {
var tp=0;
var me=this.i_link;
while (me!=null) {
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
return tp;
}
NavigationLink.prototype.label=function(label) {
if (label!=undefined) {
this.i_label=label;
var dm=new TextDimension(label, "NavigationLink_text_adjust");
this.i_labelWidth=dm.width;
if (this.i_link!=undefined) {
this.i_text.innerHTML=this.label();
this.i_text.style.width=(this.i_labelWidth+NavigationLink.rightPadding)+"px";
this.i_link.style.width=(NavigationLink.iconWidth+NavigationLink.iconPadding+this.i_labelWidth+NavigationLink.rightPadding)+"px";
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.link=this;
this.onresize(o);
}
}
return this.i_label;
}
NavigationLink.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined) {
this.i_iconClass=iconClass;
if (this.i_link!=undefined) {
this.i_div_icon.className="NavigationLink_icon_image "+this.iconClass();
}
}
return this.i_iconClass;
}
NavigationLink.prototype.context=function(context) {
if (context!=undefined) {
this.i_context=context;
}
return this.i_context;
}
NavigationLink.prototype.handleClick=function(e) {
if (this.context()!=undefined) {
this.i_context.show(this.left(), this.top()+NavigationLink.linkHeight);
}
if (this.onclick!=undefined) {
e.link=this;
this.onclick(e);
}
}
NavigationLink.prototype.getLink=function() {
if (this.i_link==undefined) {
this.i_link=document.createElement('DIV');
this.i_link.className="NavigationLink";
this.i_link.style.height=NavigationLink.linkHeight+"px";
this.i_link.style.width=(NavigationLink.iconWidth+NavigationLink.iconPadding+this.i_labelWidth+NavigationLink.rightPadding)+"px";
this.i_link.onselectstart=EventHandler.cancelEvent;
EventHandler.register(this.i_link, "onclick", this.handleClick, this);
this.i_icon=document.createElement('DIV');
this.i_icon.className="NavigationLink_icon";
this.i_icon.style.height=NavigationLink.linkHeight+"px";
this.i_icon.style.width=(NavigationLink.iconWidth+NavigationLink.iconPadding)+"px";
this.i_link.appendChild(this.i_icon);
this.i_div_icon=document.createElement('DIV');
this.i_div_icon.className="NavigationLink_icon_image "+this.iconClass();
this.i_div_icon.style.width=NavigationLink.iconWidth+"px";
this.i_div_icon.style.height=NavigationLink.iconHeight+"px";
this.i_div_icon.style.left=Math.floor(NavigationLink.iconPadding / 2)+"px";
this.i_div_icon.style.top=Math.floor((NavigationLink.linkHeight - NavigationLink.iconHeight) / 2)+"px";
this.i_div_icon.innerHTML="&nbsp;";
this.i_icon.appendChild(this.i_div_icon);
this.i_text=document.createElement('DIV');
this.i_text.className="NavigationLink_text";
this.i_text.style.height=NavigationLink.linkHeight+"px";
this.i_text.style.width=(this.i_labelWidth+NavigationLink.rightPadding)+"px";
this.i_text.innerHTML=this.label();
this.i_link.appendChild(this.i_text);
}
return this.i_link;
}
JavaScriptResource.notifyComplete("./lib/components/Component.NavigationBar.js");
PopoutWindow.registerGroup("Notifications", ["Notifications",
"NotificationPointer"]);
function Notifications() {
this.queue=Array();
this.queueLink=Array();
this.queueLink.push(Array());
this.running=false;
this.interval=null;
this.div=document.createElement('div');
this.init=false;
this.curShow=false;
}
Notifications.INSTANCE=null;
Notifications.getInstance=function() {
if(Notifications.INSTANCE==null) {
Notifications.INSTANCE=new Notifications();
}
return Notifications.INSTANCE;
}
Notifications.lineHeight=19;
Notifications.maxUptime=60;
Notifications.add=function(text, uptime) {
return Notifications.getInstance().add(text, uptime);
}
Notifications.end=function(arr, uptime, errorState, msg, popMsg) {
if(arr.end) {
arr.end(uptime, errorState, msg, popMsg);
}else{
Notifications.getInstance().end(arr, uptime, errorState, msg, popMsg);
}
}
Notifications.prototype.add=function(text, uptime) {
if(this.init==false) {
this.init=true;
this.doInit();
}
this.clean(); 
var onetime=true; 
if(uptime==undefined || uptime==null || uptime==0 || uptime > Notifications.maxUptime) {
onetime=false;
uptime=Notifications.maxUptime;
}
var d=document.createElement('div');
d.innerHTML=(onetime ? text : text+'...'); 
d.className='Notifications_status';
onetime=true;
var t=Array(d, onetime, uptime, null); 
this.queue.push(t);
var id=this.queueLink.length;
this.queueLink[id]=t;
if(this.curShow==false) {
this.div.style.display='';
}
this.display(true); 
this.start(); 
return new NotificationPointer(this, id);
}
Notifications.prototype.addSuccess=function(text, uptime, popMsg) {
var id=this.add(text, uptime);
id.end(uptime, false, text, popMsg);
}
Notifications.prototype.addFailure=function(text, uptime, popMsg) {
var id=this.add(text, uptime);
this.end(id, uptime, true, text, popMsg);
}
Notifications.prototype.doInit=function() {
this.div.id='NotificationBox';
if(SystemCore.windowManager()!=undefined) {
EventHandler.register(SystemCore.windowManager(), "onwmresize", this.moveMe, this);
}
this.calcHeight();
this.moveMe();
this.div.style.display="none";
document.body.appendChild(this.div);
}
Notifications.prototype.moveMe=function() {
if(document.all) { 
this.div.style.top=CursorMonitor.browserHeight() - parseInt(this.div.style.height) - 10;
}else{
this.div.style.top=CursorMonitor.browserHeight() - parseInt(this.div.style.height) - 6;
}
this.div.style.left=CursorMonitor.browserWidth() - parseInt(this.div.offsetWidth) - 3;
}
Notifications.prototype.calcHeight=function() {
this.div.style.height=(this.queue.length * Notifications.lineHeight)+'px';
}
Notifications.prototype.start=function() {
if(this.running==false) {
this.running=true;
this.interval=setInterval(Notifications.intervalFire, 1000);
}
}
Notifications.intervalFire=function() {
Notifications.getInstance().show();
}
Notifications.prototype.display=function(noCount) {
for(var x=0; x < this.queue.length; x++) {
var q=this.queue[x];
if(q[1]==true && q[2]==0) {
try {
this.finishRemove(q[0]);
}catch(e) {
}
}else{
this.div.appendChild(q[0]);
if(!noCount) {
q[2]--;
}
}
}
this.calcHeight();
this.moveMe();
}
Notifications.prototype.finishRemove=function(elem) {
try {
this.div.removeChild(elem);
}catch(e) { }
this.queueRemove(elem);
this.calcHeight();
this.moveMe();
this.checkShow();
}
Notifications.prototype.queueRemove=function(elem) {
for(var x=0; x < this.queue.length; x++) {
if(this.queue[x][0]==elem) {
this.queue.splice(x, 1);
x=this.queue.length;
}
}
}
Notifications.prototype.show=function() {
this.display();
this.checkShow();
}
Notifications.prototype.checkShow=function() {
if(this.queue.length==0) {
this.running=false;
clearInterval(this.interval);
this.div.style.display='none';
}
}
Notifications.prototype.end=function(arr, uptime, errorState, msg, popMsg) {
for(var x=0; x < this.queue.length; x++) {
if(this.queue[x]==this.queueLink[arr]) {
if(msg!=undefined) {
this.queue[x][0].innerHTML=msg;
if(popMsg) {
var extra="";
if(document.all) { 
extra+=" width: 1px; white-space: nowrap;";
}
DialogManager.alert('<div class="'+(errorState ? 'Notifications_fail' : 'Notifications_done')+'" style="height: 16px;'+extra+'">&nbsp;'+msg+'</div>', (errorState ? 'Error': 'Success'), undefined, true, true);
}
}else{
}
if(errorState) {
this.queue[x][0].className='Notifications_fail';
}else{
this.queue[x][0].className='Notifications_done';
}
this.queue[x][1]=true;
if(uptime!=undefined) {
this.queue[x][2]=uptime;
}else{
this.queue[x][2]=0;
}
this.queueLink[arr]=null;
}
}
this.moveMe();
}
Notifications.prototype.clean=function() {
if(this.running==false) {
this.queue=Array();
}
}
Notifications.prototype.showHide=function() {
if(this.curShow==true) {
this.div.style.display='none';
this.curShow=false;
}else{
this.curShow=true;
}
}
function NotificationPointer(notifications, id) {
this.i_notifications=notifications;
this.i_id=id;
}
NotificationPointer.prototype.end=function(uptime, errorState, msg, popMsg) {
if(this.i_notifications) {
this.i_notifications.end(this.i_id, uptime, errorState, msg, popMsg);
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.Notification.js"); 
PopoutWindow.registerGroup("OptionBox", ["OptionBox",
"OptionBoxOption"]);
function OptionBox(width, rows, multiSelect, locked, rowHeight) {
this.i_rowHeight=(rowHeight==undefined ? 20 : rowHeight);
this.i_rows=(rows==undefined ? 1 : rows);
this.i_multi=(multiSelect==undefined ? false : multiSelect);
this.i_locked=(locked==undefined ? true : false);
this.width(width);
this.i_options=Array();
}
OptionBox.dropDownTriggerWidth=22;
OptionBox.dropDownHeight=90;
OptionBox.prototype.onchange=function(box) { }
OptionBox.prototype.onselect=null;
OptionBox.prototype.dropDownHeight=function(height) {
if (height!=undefined) {
this.i_drop_height=height;
if (this.i_option_div!=undefined) {
this.i_option_div.style.height=""+(this.rows() > 1 ? this.height()+2: this.dropDownHeight())+"px";
}
}
return (this.i_drop_height!=undefined ? this.i_drop_height : OptionBox.dropDownHeight);
}
OptionBox.prototype.value=function(value) {
if (value) {
var newvalue=this.setValue(value);
if (newvalue) {
return newvalue;
}
}
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].selected()) {
return this.i_options[x].value();
}
}
return undefined;
}
OptionBox.prototype.setValue=function(value) {
for (var i=0;i<this.i_options.length;i++) {
if (this.i_options[i].value()==value) {
this.i_options[i].selected(true,true);
return value;
}
}
return undefined;
}
OptionBox.prototype.indexOf=function(value) {
for (var i in this.i_options) {
if (this.i_options[i].value()==value) {
return i;
}
}
return -1;
}
OptionBox.prototype.top=function() {
var ch=this.getInput();
var t=0;
while (ch!=null) {
t+=parseInt(ch.offsetTop);
ch=ch.offsetParent;
}
return t;
}
OptionBox.prototype.left=function() {
var ch=this.getInput();
var l=0;
while (ch!=null) {
l+=parseInt(ch.offsetLeft);
ch=ch.offsetParent;
}
return l;
}
OptionBox.prototype.multiSelect=function(state) {
if (state!=undefined){
this.i_multi=state;
}
return this.i_multi;
}
OptionBox.prototype.locked=function(state) {
if (state!=undefined) {
this.i_locked=state;
}
return this.i_locked;
}
OptionBox.prototype.width=function(width) {
if (width) {
this.i_width=((width - OptionBox.dropDownTriggerWidth) - 4 < 1 ? OptionBox.dropDownTriggerWidth+4+1 : width);
if (this.i_single_div) {
this.i_single_div.style.width=""+this.width()+"px";
this.i_single_text.style.width=""+((this.width() - OptionBox.dropDownTriggerWidth) - 4)+"px";
}
if (this.i_box) {
this.i_box.style.width=""+this.width()+"px";
}
if (this.i_option_div) {
this.i_option_div.style.width=""+this.width()+"px";
}
}
return this.i_width;
}
OptionBox.prototype.height=function() {
return this.i_rowHeight * this.rows();
}
OptionBox.prototype.options=function() {
return this.i_options;
}
OptionBox.prototype.addOption=function(option, beforeOption) {
option.i_parent=this;
if (option.selected()) {
for (var x=0; x < this.i_options.length; x++) {
this.i_options[x].selected(false);
}
this.setSelected(option);
}
if (beforeOption!=undefined) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==beforeOption) {
this.i_options.splice(x, 0, option);
if (this.i_option_div!=undefined) {
this.i_option_div.insertBefore(option.getOption(), beforeOption.getOption());
}
return option;
}
}
}
else {
this.i_options[this.i_options.length]=option;
if (this.i_option_div!=undefined) {
this.i_option_div.appendChild(option.getOption());
}
}
return option;
}
OptionBox.prototype.addOptions=function(options) {
if (!options) {
return;
}
for (var i=0;i<options.length;i++) {
this.addOption(options[i]);
}
}
OptionBox.prototype.appendOption=function(name,value,selected) {
return this.addOption(new OptionBoxOption(name,value,selected));
}
OptionBox.prototype.removeOption=function(option) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==option) {
this.i_options.splice(x, 1);
option.i_parent=null;
if (option.selected()) {
this.setSelected(option);
}
if (this.i_option_div!=undefined) {
try {
this.i_option_div.removeChild(option.getOption());
} catch (e) { }
}
return true;
}
}
return false;
}
OptionBox.prototype.removeOptions=function() {
var start=this.i_options.length;
for (var i=start-1;i>=0;i--) {
var option=this.i_options[i];
option.i_parent=null;
if (this.i_option_div!=undefined) {
try {
this.i_option_div.removeChild(option.getOption());
} catch (e) { }
}
}
this.i_options=new Array();
}
OptionBox.prototype.setSelected=function(option, noclose) {
if(option.selected()) {
if (this.i_single_text!=undefined) {
try {
this.i_single_text.innerHTML=(option.selected() ? option.name() : "");
} catch(e) {
this.i_single_text.innerText=(option.selected() ? option.name() : "");
}
this.i_single_text.className="OptionBox_single_text";
this.i_single_text.style.width=""+((this.width() - OptionBox.dropDownTriggerWidth) - 4)+"px";
this.i_single_text.style.height=""+this.height()+"px";
this.i_single_text.style.lineHeight=""+(this.height()+1)+"px";
if(!noclose) {
if (document!=undefined && document.body!=undefined) {
if(this.i_ev_list!=null) {
this.i_ev_list.unregister();
this.i_ev_list=null;
}
this.toggleDropDown(false);
if((OptionBox.i_active_box!=undefined) && 
(typeof OptionBox.i_active_box.toggleDropDown!='undefined')) {
if(OptionBox.i_active_box.toggleDropDown()) {
OptionBox.i_active_box.toggleDropDown(false);
}
if(OptionBox.i_active_box.i_ev_list!=null) {
OptionBox.i_active_box.i_ev_list.unregister();
OptionBox.i_active_box.i_ev_list=null;
}
}
OptionBox.i_active_box=undefined;			
}
}
}
}
if (this.onchange!=undefined) {
if(!noclose) {
this.type="change";
this.onchange(this);	
}
}
if (this.onselect!=undefined) {
var o=new Object();
o.type="select";
o.options=this;
this.onselect(o);
}
}
OptionBox.prototype.removeSelected=function() {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].selected()) {
var option=this.i_options[x];
this.i_options.splice(x, 1);
option.i_parent=null;
this.setSelected(option);
if (this.i_option_div!=undefined) {
try {
this.i_option_div.removeChild(option.getOption());
} catch (e) { }
}
return true;
}
}
return false;
}
OptionBox.prototype.moveSelected=function(index) {
var selected=undefined;
for (var x=0;x<this.i_options.length;x++) {
if (this.i_options[x].selected()) {
selected=this.i_options[x];
}
}
if (!selected) {
return;
}
var before=this.i_options[index];
this.removeSelected();
this.addOption(selected,before);
}
OptionBox.prototype.rowHeight=function(rowHeight) {
if (rowHeight!=undefined) {
this.i_rowHeight=rowHeight;
if (this.i_box!=undefined) {
this.i_box.style.height=""+this.height()+"px";
}
if (this.i_single_div!=undefined) {
this.i_single_arrow.style.height=""+this.height()+"px";
this.i_single_text.style.lineHeight=""+(this.height()+1)+"px";
this.i_single_div.style.height=""+this.height()+"px";
}
}
return this.i_rowHeight;
}
OptionBox.prototype.getOptionDiv=function() {
if (this.i_option_div==undefined) {
this.i_option_div=document.createElement('DIV');
this.i_option_div.className="OptionBox_options";
if (this.width()) {
var width=this.width();
if(document.all) {
width+=2;
}
this.i_option_div.style.width=width+"px";
}
if (this.height()) {
this.i_option_div.style.height=""+(this.rows() > 1 ? this.height()+2: this.dropDownHeight())+"px";
}
for (var x=0; x < this.i_options.length; x++) {
this.i_option_div.appendChild(this.i_options[x].getOption());
}
}
return this.i_option_div;
}
OptionBox.prototype.getDropDownDiv=function() {
if (this.i_drop_down==undefined) {
this.i_drop_down=document.createElement('DIV');
this.i_drop_down.className="OptionBox_dropdown";
EventHandler.register(this.i_drop_down, "onmousedown", function(e) { e.cancelBubble=true; e.returnValue=false; return false; });
}
return this.i_drop_down;
}
OptionBox.handleMouseUp=function(e) {
if(this==undefined || this==null) {
return;
}
var tt=new Date();
if (this.i_set_t.getTime() < tt.getTime() - 100) {
if (this.i_ev_list) {
this.i_ev_list.unregister();
this.i_ev_list=null;
}
this.toggleDropDown(false);
OptionBox.i_active_box=undefined;
}
e.returnValue=true;
return true;
}
OptionBox.handleDropDown=function(e) {
if (OptionBox.i_active_box!=undefined) {
OptionBox.i_active_box.toggleDropDown(false);
if (OptionBox.i_active_box.i_ev_list) {
OptionBox.i_active_box.i_ev_list.unregister();
OptionBox.i_active_box.i_ev_list=null;
}
OptionBox.i_active_box=undefined;
}
else {
this.toggleDropDown(true);
OptionBox.i_active_box=this;	
this.i_set_t=new Date();
this.i_ev_list=EventHandler.register(document.body, "onmousedown", OptionBox.handleMouseUp, OptionBox.i_active_box);
}
return true;
}
OptionBox.prototype.toggleDropDown=function(state) {
if (state!=undefined) {
if (this.i_drop_visible!=state) {
this.i_drop_visible=state;
if (state) {
var d=this.getDropDownDiv();
d.appendChild(this.getOptionDiv());
var p=this.getSingleDiv();
var s=0;
var w=0;
while(p) {
s+=(p.scrollTop ? p.scrollTop : 0);
w+=(p.scrollLeft ? p.scrollLeft : 0);
p=p.parentNode;
}
if(document.all) {
w -=1;
}
var topValue=this.top();
var height=this.height();
var positionY=topValue+height - s;
if(positionY+this.dropDownHeight() > CursorMonitor.browserHeight()){
positionY=topValue - this.dropDownHeight() - s;
}
d.style.left=""+(this.left() - w)+"px";
d.style.top=""+positionY+"px";
var selidx=0;
for (var x=0; x < this.i_options.length; x++) { 
this.i_options[x].hoverState(false);
if(this.i_options[x].selected()==true) {
selidx=x;
}
}
document.body.appendChild(d);
this.getOptionDiv().scrollTop=this.rowHeight() * selidx; 
if(document.all) {
var me=this;
setTimeout(function() {
me.getOptionDiv().scrollTop=me.rowHeight() * selidx;		
}, 100);
}
if(this.docListener==undefined) {
this.docListener=EventHandler.register(document, "onkeydown", this.keySelect, this);
}
}
else {
try {
document.body.removeChild(this.getDropDownDiv());
if(this.docListener!=undefined) {
this.docListener.unregister();
this.docListener=undefined;
}
if(this.i_usedKeys) {
if(this.onchange!=undefined) {
this.onchange(this);
}
this.i_usedKeys=undefined;
}
} catch (e) { }
}
}
}
return this.i_drop_visible;
}
OptionBox.prototype.keySelect=function(e) {
var key=(e.keyCode!=0 ? e.keyCode : e.which);
var ret=true;
if(key >=33 && key <=40) {
var cont=true;
for(var x=0; x < this.i_options.length && cont; x++) {
if(this.i_options[x].selected()==true) {
var to=0;
switch(key) {
case 38: 
to=-1;
break;
case 40: 
to=1;
break;
case 34: 
to=5;
break;
case 33: 
to=-5;
break;
}
if(this.i_options[x+to]) {
this.i_usedKeys=true;
this.i_options[x+to].selected(true, true);
this.getOptionDiv().scrollTop=this.rowHeight() * (x+to);
}
cont=false;
}
}
if(cont && this.i_options[0]) {
this.i_options[0].selected(true, true);
}
ret=false;
}else if(key==13) { 
this.toggleDropDown(false);
ret=false;
}else if(key==27) { 
this.toggleDropDown(false);
ret=false;
}else{
var cur_option=-1;
var options=Array();
for(var x=0; x < this.i_options.length; x++) {
if(this.i_options[x].name().toLowerCase().charAt(0)==String.fromCharCode(key).toLowerCase()) {
if(this.i_options[x].selected()) {
cur_option=options.length;
}
options.push(x);
}
}
if(options.length > 0) {
var new_option=options[(cur_option+1) % options.length];
this.i_options[new_option].selected(true, true);
this.getOptionDiv().scrollTop=this.rowHeight() * new_option;
ret=false;
}
}
this.i_usedKeys=true;
e.returnValue=ret;
return ret;
}
OptionBox.prototype.getSingleDiv=function() {
if (this.i_single_div==undefined) {
this.i_single_div=document.createElement('DIV');
this.i_single_div.className="OptionBox_single";
this.i_single_div.style.width=""+this.width()+"px";
this.i_single_div.style.height=""+this.height()+"px";
EventHandler.register(this.i_single_div, "onmousedown", OptionBox.handleDropDown, this);
this.i_single_arrow=document.createElement('DIV');
this.i_single_arrow.innerHTML="&nbsp;";
this.i_single_arrow.className="OptionBox_single_arrow";
this.i_single_arrow.style.width=""+OptionBox.dropDownTriggerWidth+"px";
this.i_single_arrow.style.height=""+this.height()+"px";
this.i_single_div.appendChild(this.i_single_arrow);
var str="Please select a value";
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].selected()) {
str=this.i_options[x].name();
break;
}
}
this.i_single_text=document.createElement('DIV');
this.i_single_text.innerHTML=str;
this.i_single_text.className="OptionBox_single_text";
this.i_single_text.style.width=((this.width() - OptionBox.dropDownTriggerWidth) - 4)+"px";
this.i_single_text.style.height=""+this.height()+"px";
this.i_single_text.style.lineHeight=""+(this.height()+1)+"px";
this.i_single_div.appendChild(this.i_single_text);
}
return this.i_single_div;
}
OptionBox.prototype.rows=function(rows) {
if (rows!=undefined) {
if (this.i_box!=undefined) {
if (this.i_rows > 1 && rows==1) {
this.i_box.appendChild(this.getSingleDiv());
try {
this.i_box.removeChild(this.getOptionDiv());
} catch (e) { }
}
else if (this.i_rows==1 && rows > 1) {
this.i_box.appendChild(this.getOptionDiv());
try {
this.i_box.removeChild(this.getSingleDiv());
} catch (e) { }
}
if (this.i_box!=undefined) {
this.i_box.style.height=""+this.height()+"px";
}
if (this.i_single_div!=undefined) {
this.i_single_arrow.style.height=""+this.height()+"px";
this.i_single_text.style.lineHeight=""+(this.height()+1)+"px";
this.i_single_div.style.height=""+this.height()+"px";
}
if (this.i_option_div!=undefined) {
this.i_option_div.style.height=""+(this.rows() > 1 ? this.height()+2 : this.dropDownHeight())+"px";
}
}
this.i_rows=rows;
}
return this.i_rows;
}
OptionBox.prototype.getInput=function() {
if (this.i_box==undefined) {
this.i_box=document.createElement('DIV');
this.i_box.className="OptionBox";
if (this.width()) {
this.i_box.style.width=""+this.width()+"px";
}
if (this.height()) {
this.i_box.style.height=""+this.height()+"px";
}
this.i_box.tabIndex=0;
EventHandler.register(this.i_box, "onfocus", this.gotFocus, this);
EventHandler.register(this.i_box, "onblur", this.gotBlur, this);
if (this.rows() > 1) {
this.i_box.appendChild(this.getOptionDiv());
}
else {
this.i_box.appendChild(this.getSingleDiv());
}
}
return this.i_box;
}
OptionBox.prototype.getContent=function() {
return this.getInput();
}
OptionBox.prototype.gotFocus=function() {
if(this.docListener==undefined) {
this.docListener=EventHandler.register(document, "onkeydown", this.keySelect, this);
}
}
OptionBox.prototype.gotBlur=function() {
if(this.i_usedKeys) {
for(var x=0; x < this.i_options.length; x++) {
if(this.i_options[x].selected()==true) {
this.setSelected(this.i_options[x]); 
break;
}
}
}
if(this.docListener!=undefined) {
this.docListener.unregister();
this.docListener=undefined;
}
this.i_usedKeys=false;
}
function OptionBoxOption(name, value, selected, toolTip) {
this.i_name=name;		
this.i_value=value;		
this.i_selected=selected;	
if (toolTip==undefined){
i_tooltip=true;
} else {
this.i_toolTip=toolTip;
}
}
OptionBoxOption.prototype.parent=function() {
return this.i_parent;
}
OptionBoxOption.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_option!=undefined) {
this.i_option.innerHTML=name;
this.i_option.className="OptionBoxOption"+(this.selected() ? "_selected" : "");
}
}
return this.i_name;
}
OptionBoxOption.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
}
return this.i_value;
}
OptionBoxOption.prototype.selected=function(state, noclose) {
if (state!=undefined) {
if (this.i_selected!=state) {
if (state==true) {
if (this.parent()!=undefined) {
if (this.parent().multiSelect()==false) {
for (var x=0; x < this.parent().options().length; x++) {
if (this.parent().options()[x].selected()) {
this.parent().options()[x].selected(false, noclose);
}
}
}
}
}
this.i_selected=state;	
if (this.i_option!=undefined) {
this.i_option.className="OptionBoxOption"+(this.selected() ? "_selected" : "")+(this.hoverState() ? "_hover" : "");
}
if(this.parent()!=undefined) {
this.parent().setSelected(this, noclose);
}
}
}
return this.i_selected;
}
OptionBoxOption.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover=state;
this.i_option.className="OptionBoxOption"+(this.selected() ? "_selected" : "")+(this.hoverState() ? "_hover" : "");
}
return this.i_hover;
}
OptionBoxOption.handleMouseOver=function(e) {
this.hoverState(true);
}
OptionBoxOption.handleMouseOut=function(e) {
this.hoverState(false);
}
OptionBoxOption.handleClick=function(e) {
if (this.parent().multiSelect()==true) {
this.selected(!this.selected());	
}
else {
this.selected(true);
}
}
OptionBoxOption.prototype.getOption=function() {
if (this.i_option==undefined) {
this.i_option=document.createElement('DIV');
this.i_option.innerHTML=this.name();
this.i_option.className="OptionBoxOption"+(this.selected() ? "_selected" : "")+(this.hoverState() ? "_hover" : "");
var height=this.parent().rowHeight();
this.i_option.style.height=""+height+"px";
this.i_option.style.lineHeight=""+(height+1)+"px";
if(document.all) {
this.i_option.style.width="100%";
}
if (this.i_toolTip) {
var tt=new ToolTip(this.i_option);
tt.tip(this.name());
}
EventHandler.register(this.i_option, "onmouseover", OptionBoxOption.handleMouseOver, this);
EventHandler.register(this.i_option, "onmouseout", OptionBoxOption.handleMouseOut, this);
EventHandler.register(this.i_option, "onmousedown", OptionBoxOption.handleClick, this);
}
return this.i_option;
}
JavaScriptResource.notifyComplete("./lib/components/Component.OptionBox.js"); 
function ScrollPane(itemParent, width, height, itemFactory, items, innerWidth, pageLength, defaultPage) {
this.i_factory=itemFactory;
this.i_pageLength=pageLength;
this.i_page=(defaultPage!=undefined ? defaultPage : 1);
this.i_item_array=Array();
this.i_item_parent=itemParent;
this.i_item_height=16;
this.i_vertical_position=0;
this.i_vertical_state=false;
this.scrollFactor=19;
this.i_actual_items=0;
this.width(width);		
this.height(height);
this.innerWidth(innerWidth);
this.items(items);
}
ScrollPane.verticalScrollWidth=scrollBarWidth()+1;
ScrollPane.horizontalScrollHeight=scrollBarWidth()+1;
ScrollPane.scroll_delay=(document.all ? 100 : 0);
ScrollPane.prototype.onresize=null;
ScrollPane.prototype.onreload=null;
ScrollPane.prototype.pageLength=function(items) {
if (items!=undefined) {
this.i_pageLength=items;
}
return this.i_pageLength;
}
ScrollPane.prototype.pages=function() {
if (this.pageLength()==undefined || this.items()==0) {
return 1;	
}
return Math.ceil(this.items() / this.pageLength());
}
ScrollPane.prototype.page=function(page) {
if (page!=undefined) {
if (this.pages() >=page) {
this.i_page=page;
}
else {
this.i_page=(this.pages() > 0 ? this.pages() : 1);
}
this.verticalPosition(0);
this.refreshContent();
}
return this.i_page;
}
ScrollPane.prototype.top=function() {
var tp=this;
var tpv=0;
while (tp!=null) {
tpv+=parseInt(tp.offestTop);
tp=tp.offsetParent;
}
return tpv;
}
ScrollPane.prototype.left=function() {
var lf=this;
var lfv=0;
while (lf!=null) {
lfv+=parseInt(lf.offestLeft)+parseInt(lf.scrollLeft);
lf=lf.offsetParent;
}
return lfv;
}
ScrollPane.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
this.contentWidth(this.width() - (this.verticalScroll() ? ScrollPane.verticalScrollWidth : 0));
if (this.i_content!=undefined) {
this.i_pane.style.width=this.width()+"px";
this.i_bottom_scroll.style.width=(this.width() - (this.verticalScroll() ? ScrollPane.verticalScrollWidth : 0))+"px";
}
}
return this.i_width;
}
ScrollPane.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
this.contentHeight(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0));
if (this.i_content!=undefined) {
this.i_pane.style.height=this.height()+"px";
this.i_right_scroll.style.height=(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0))+"px";
this.i_right_force.style.marginTop=(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0))+"px";
}
}
return this.i_height;
}
ScrollPane.prototype.itemFactory=function(factory) {
if (factory!=undefined) {
this.i_factory=factory;
}
return this.i_factory;
}
ScrollPane.prototype.items=function(items) {
if (items!=undefined) {
this.i_items=items;
this.updateActualDisplay();
this.updateVerticalScroll();
}
return this.i_items;
}
ScrollPane.prototype.itemHeight=function(height) {
if (height!=undefined) {
this.i_item_height=height;
var its=height / this.itemHeight();
this.possibleItems(Math.ceil(its));
this.updateVerticalScroll();
}
return this.i_item_height;
}
ScrollPane.prototype.possibleItems=function(count) {
if (count!=undefined) {
try {
while (this.i_item_array.length < count) {
this.i_item_array[this.i_item_array.length]=this.i_factory(this.i_item_parent);	
if (this.scrollFactor_i==undefined) {
this.scrollFactor_i=true;
this.updateVerticalScroll();
}
}
this.i_possibleItems=count;
}
catch (e) { 
alert('There was an error loading the application. Please refresh your browser window to continue.');
this.i_possibleItems=this.i_item_array.length;
}
for (var x=0; x < this.i_item_array.length; x++) {
if (x < count) {
this.i_item_array[x].visible(x < count ? true : false);
}
}
this.updateVerticalScroll();
this.updateActualDisplay();
}
return this.i_possibleItems;
} 
ScrollPane.prototype.actualItems=function(count) {
if (count!=undefined) {
var old=this.i_actual_items;
this.i_actual_items=count;
if (this.i_content!=undefined) {
if (this.i_actual_items > old) {
while (this.i_actual_items > old) {
this.i_content.appendChild(this.i_item_array[old++].getItem());	
}
}
else {
while (this.i_actual_items < old) {
this.i_content.removeChild(this.i_item_array[--old].getItem());
}
}
}
}
return this.i_actual_items;
}
ScrollPane.prototype.updateActualDisplay=function() {
var ct=this.actualPageLength();
var ai=((ct - this.verticalPosition()) > this.possibleItems() ? this.possibleItems() : (ct - this.verticalPosition()));
try {
this.actualItems(ai);
} catch(e) {
console.log('invalid page scroll position');
}
}
ScrollPane.prototype.updateVerticalScroll=function() {
if (this.i_right_force!=undefined) {
var ct=this.actualPageLength();
if (ct > this.possibleItems()) {
ct-=(this.possibleItems() - 2);
this.verticalScroll(true);
this.i_right_scroll.style.display='';
}
else {
this.verticalScroll(false);
this.verticalPosition(0);
}
this.i_right_force.style.height=(ct * this.scrollFactor)+"px";
}
return true;
}
ScrollPane.prototype.verticalPosition=function(items) {
if (items!=undefined) {
this.i_vertical_position=items;
this.updateActualDisplay();
if (this.i_right_scroll!=undefined) {
this.i_right_scroll.scrollTop=items * this.scrollFactor;
}
}
return this.i_vertical_position;
}
ScrollPane.prototype.horizontalPosition=function(width) {
if (width!=undefined) {
this.i_horizontal_position=width;
if (this.i_bottom_scroll!=undefined) {
this.i_bottom_scroll.scrollLeft=width;
}
}
return this.i_horizontal_position;
}
ScrollPane.prototype.innerWidth=function(width) {
if (width!=undefined) {
this.i_innerWidth=width;
if (this.i_bottom_force!=undefined) {
this.i_bottom_force=width+"px";
}
this.horizontalScroll(this.contentWidth() < width);
}
return this.i_innerWidth;
}
ScrollPane.prototype.verticalScroll=function(state) {
if (state!=undefined) {
if (this.i_vertical_state!=state) {
this.i_vertical_state=state;
this.contentWidth(this.width() - (state ? ScrollPane.verticalScrollWidth : 0));
if (this.i_content!=undefined) {
this.i_right_scroll.style.display=(state ? "" : "none");
this.i_right_scroll.style.height=(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0))+"px";
this.i_bottom_scroll.style.width=(this.width() - (this.verticalScroll() ? ScrollPane.verticalScrollWidth : 0))+"px";
this.i_bottom_cap.style.display=(this.verticalScroll() && this.horizontalScroll() ? "" : "none");
}
}
}
return this.i_vertical_state;
}
ScrollPane.prototype.horizontalScroll=function(state) {
if (state!=undefined) {
this.i_horizontal_state=state;
this.contentHeight(this.height() - (state ? ScrollPane.horizontalScrollHeight : 0));
if (this.i_content!=undefined) {
this.i_bottom_scroll.style.display=(state ? "" : "none");
this.i_right_scroll.style.height=(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0))+"px";
this.i_bottom_scroll.style.width=(this.width() - (this.verticalScroll() ? ScrollPane.verticalScrollWidth : 0))+"px";
this.i_bottom_cap.style.display=(this.verticalScroll() && this.horizontalScroll() ? "" : "none");
this.i_right_force.style.marginTop=(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0))+"px";
}
}
return this.i_horizontal_state;
}
ScrollPane.prototype.contentWidth=function(width) {
if (width!=undefined) {
this.i_content_width=width;
this.horizontalScroll(this.contentWidth() < this.innerWidth());
if (this.i_content!=undefined) {
this.i_content.style.width=width+"px";
}
if (this.onresize!=undefined) {
this.onresize(this.contentWidth(), undefined);
}
}
return this.i_content_width;
}
ScrollPane.prototype.contentHeight=function(height) {
if (height!=undefined) {
this.i_content_height=height;
var its=height / this.itemHeight();
this.possibleItems(Math.ceil(its));
this.updateVerticalScroll();
if (this.i_content!=undefined) {
this.i_content.style.height=height+"px";
}
if (this.onresize!=undefined) {
this.onresize(undefined, this.contentHeight());
}
}
return this.i_content_height;
}
ScrollPane.prototype.refreshContent=function() {
if (this.onreload!=undefined) {
this.updateVerticalScroll();
var vp=this.verticalPosition();
var tp=vp+(this.pageLength()!=undefined ? ((this.page() - 1) * this.pageLength()) : 0);
var newP1=vp * this.scrollFactor;
var newP2=(vp+1) * this.scrollFactor;
var curP=parseInt(this.i_right_scroll.scrollTop);
if (curP < newP1 || curP > newP2) {
this.i_right_scroll.scrollTop=newP1;
}
var pItems=this.items();
if (this.pageLength()!=undefined) {
if (this.items() <=this.pageLength()) {
pItems=this.items();
}
else {
if (this.page()==this.pages() && this.items() % this.pageLength()!=0) {
pItems=(this.items() % this.pageLength());
}
else {
pItems=this.pageLength();
}
}
}
pItems=(pItems > this.possibleItems() ? this.possibleItems() : pItems);
var mt=Array();
for (var x=0; x < pItems; x++) {
this.i_item_array[x].visible(true);
}
for (var x=pItems; x < this.possibleItems(); x++) {
this.i_item_array[x].visible(false);
}
this.onreload(tp, this.i_item_array);
}
}
ScrollPane.handleVerticalScroll=function(e) {
var me=this;
if (this.chkSc!=undefined) {
clearTimeout(me.chkSc);
}
ScrollPane.curSc=me;
me.curSc=Math.floor(parseInt(this.i_right_scroll.scrollTop) / this.scrollFactor);
if (ScrollPane.scroll_delay!=0) {
me.chkSc=setTimeout(ScrollPane.handleVerticalUpdate, ScrollPane.scroll_delay);
}
else {
ScrollPane.handleVerticalUpdate();
}
e.returnValue=true;
return true;
}
ScrollPane.handleVerticalUpdate=function(e) {
var me=ScrollPane.curSc;
me.i_vertical_position=me.curSc;
me.updateActualDisplay();
me.refreshContent();
ScrollPane.curSc=undefined;
}
ScrollPane.handleHorizontalScroll=function(e) {
this.i_horizontal_position=parseInt(this.i_bottom_scroll.scrollLeft);
this.refreshContent();
e.returnValue=true;
return true;
}
ScrollPane.prototype.actualPageLength=function() {
var ct=this.items();
if (this.pageLength()!=undefined) {
if (this.items() <=this.pageLength()) {
ct=this.items();
}
else {
if (this.page()==this.pages() && this.items() % this.pageLength()!=0) {
ct=(this.items() % this.pageLength());
}
else {
ct=this.pageLength();
}
}
}
return ct;
}
ScrollPane.handleDOMWheelScroll=function(e) {
ScrollPane.handleWheelScroll.call(this.pObj, e);
}
ScrollPane.handleWheelScroll=function(e) {
var me=this;
var delta=0;
var useEvent=(document.all ? event : e);
if (me.verticalScroll()) {
if (useEvent.wheelDelta) {
delta=useEvent.wheelDelta/120;
if (window.opera) {
delta=-delta;
}
}
else if (useEvent.detail) {
delta=-useEvent.detail/3;
}
if (delta) {
if (delta < 0) {
delta=Math.ceil(Math.abs(delta)) * -1;
}
else {
delta=Math.ceil(delta);
}
var n=me.verticalPosition() - delta;
if (n < 0) {
n=0;
}
var ct=me.actualPageLength();
if (n > ct - (me.possibleItems() - 1)) {
n=ct - (me.possibleItems() - 1);
}
me.verticalPosition(n);	
}
me.i_content.scrollTop=0+"px";
}
useEvent.cancelBubble=true;
e.returnValue=false;
return false;
}
ScrollPane.prototype.getPane=function() {
if (this.i_pane==undefined) {
this.i_pane=document.createElement('DIV');
this.i_pane.className="ScrollPane";
this.i_pane.style.width=this.width()+"px";
this.i_pane.style.height=this.height()+"px";
this.i_right_scroll=document.createElement('DIV');
this.i_right_scroll.className="ScrollPane_right";
this.i_right_scroll.style.width=ScrollPane.verticalScrollWidth+"px";
this.i_right_scroll.style.height=(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0))+"px";
this.i_right_scroll.style.display=(this.verticalScroll() ? "" : "none");
EventHandler.register(this.i_right_scroll, "onscroll", ScrollPane.handleVerticalScroll, this);
this.i_pane.appendChild(this.i_right_scroll);
this.i_right_force=document.createElement('DIV');
this.i_right_force.className="ScrollPane_right_force";
this.i_right_force.innerHTML="&nbsp;";
this.updateVerticalScroll();
this.i_right_force.style.marginTop=(this.height() - (this.horizontalScroll() ? ScrollPane.horizontalScrollHeight : 0))+"px";
this.i_right_scroll.appendChild(this.i_right_force);
this.i_content=document.createElement('DIV');
this.i_content.className="ScrollPane_content";
this.i_content.style.width=this.contentWidth()+"px";
this.i_content.style.height=this.contentHeight()+"px";
if (this.i_content.addEventListener) {
this.i_content.pObj=this;
this.i_content.addEventListener('DOMMouseScroll', ScrollPane.handleDOMWheelScroll, false);
}
EventHandler.register(this.i_content, "onmousewheel", ScrollPane.handleWheelScroll, this);
for (var x=0; x < this.i_actual_items; x++) {
this.i_content.appendChild(this.i_item_array[x].getItem());
}
this.i_pane.appendChild(this.i_content);
this.i_bottom_scroll=document.createElement('DIV');
this.i_bottom_scroll.className="ScrollPane_bottom";
this.i_bottom_scroll.style.height=ScrollPane.horizontalScrollHeight+"px";
this.i_bottom_scroll.style.width=(this.width() - (this.verticalScroll() ? ScrollPane.verticalScrollWidth : 0))+"px";
this.i_bottom_scroll.style.display=(this.horizontalScroll() ? "" : "none");
EventHandler.register(this.i_bottom_scroll, "onmouseup", ScrollPane.handleHorizontalScroll, this);
this.i_pane.appendChild(this.i_bottom_scroll);
this.i_bottom_force=document.createElement('DIV');
this.i_bottom_force.className="ScrollPane_bottom_force";
this.i_bottom_force.style.width=this.innerWidth()+"px";
this.i_bottom_force.innerHTML="&nbsp;";
this.i_bottom_scroll.appendChild(this.i_bottom_force);
this.i_bottom_cap=document.createElement('DIV');
this.i_bottom_cap.className="ScrollPane_corner";
this.i_bottom_cap.style.display=(this.verticalScroll() && this.horizontalScroll() ? "" : "none");
this.i_bottom_cap.style.width=ScrollPane.verticalScrollWidth+"px";
this.i_bottom_cap.style.height=ScrollPane.horizontalScrollHeight+"px";
this.i_pane.appendChild(this.i_bottom_cap);
this.i_bottom_ex=document.createElement('DIV');
this.i_bottom_ex.className="ScrollPane_corner_ex";
this.i_bottom_ex.innerHTML="&nbsp;";
this.i_bottom_ex.style.width=(ScrollPane.verticalScrollWidth - 1)+"px";
this.i_bottom_ex.style.height=(ScrollPane.horizontalScrollHeight - 1)+"px";
this.i_bottom_cap.appendChild(this.i_bottom_ex);
this.refreshContent();
this.updateVerticalScroll();
}
return this.i_pane;
}
function ScrollPaneItem() {
}
ScrollPaneItem.defaultItemHeight=16;
ScrollPaneItem.factory=function() {
return new ScrollPaneItem();
}
ScrollPaneItem.prototype.height=function() {
return ScrollPaneItem.defaultItemHeight;
}
ScrollPaneItem.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
if (this.i_item!=undefined) {
this.i_item.innerHTML=value;
}
}
return this.i_value;
}
ScrollPaneItem.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_item!=undefined) {
this.i_item.display=(state ? "" : "none");
}
}
return this.i_visible;
}
ScrollPaneItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.i_item.className="ScrollPaneItem";
this.i_item.innerHTML=this.value();
this.i_item.style.height=ScrollPaneItem.defaultItemHeight;
this.i_item.display=(this.i_visible ? "" : "none");
}
return this.i_item;
}
JavaScriptResource.notifyComplete("./lib/components/Component.ScrollPane.js");
function ShortcutPane(width, height) {
this.i_width=width;
this.i_height=height;
this.i_shortcuts=Array();
}
ShortcutPane.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
var sc=(this.scrollBarVisible() ? scrollBarWidth() : 0);
for (var x=0; x < this.i_shortcuts.length; x++) {
this.i_shortcuts[x].width(width - sc);
}
if (this.i_pane!=undefined) {
this.i_pane.style.width=width+"px";
this.i_pane_spacer.style.width=(this.width() - sc)+"px";
}
}
return this.i_width;
}
ShortcutPane.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_pane!=undefined) {
this.i_pane.style.height=height+"px";
}
this.updateSpacer();
}
return this.i_height;
}
ShortcutPane.prototype.shortcuts=function(index) {
if (index!=undefined) {
return this.i_shortcuts[index];
}
return this.i_shortcuts;
}
ShortcutPane.prototype.addShortcut=function(shortcut, beforeShortcut) {
var append=true;
shortcut.i_parent=this;
shortcut.width(this.width());
shortcut.i_vi_l=EventHandler.register(shortcut, "onvisible", this.updateSpacer, this);
if (beforeShortcut!=undefined) {
for (var x=0; x < this.i_shortcuts.length; x++) {
if (this.i_shortcuts[x]==beforeShortcut) {
this.i_shortcuts.splice(x, 0, shortcut);
if (this.i_pane!=undefined) {
this.i_pane_holder.insertBefore(shortcut.getLink(), beforeShortcut.getLink());
}
append=false;
break;
}
}
}
if (append) {
this.i_shortcuts[this.i_shortcuts.length]=shortcut;
if (this.i_pane!=undefined) {
this.i_pane_holder.appendChild(shortcut.getLink());
}
}
this.updateSpacer();
return shortcut;
}
ShortcutPane.prototype.removeShortcut=function(shortcut) {
for (var x=0; x < this.i_shortcuts.length; x++) {
if (this.i_shortcuts[x]==shortcut) {
this.i_shortcuts.splice(x, 1);
if (shortcut.i_vi_l!=undefined) {
shortcut.i_vi_l.unregister();
}
if (this.i_pane!=undefined) {
this.i_pane_holder.removeChild(this.i_shortcuts[x].getLink());
}
this.updateSpacer();
return true;
}
}
return false;
}
ShortcutPane.prototype.updateScroll=function() {
var h=0;
for (var x=0; x < this.i_shortcuts.length; x++) {
h+=(this.i_shortcuts[x].visible() ? ShortcutLink.linkHeight : 0);
}
this.scrollBarVisible(h > this.height());
}
ShortcutPane.prototype.scrollBarVisible=function(state) {
if (state!=undefined) {
this.i_scroll_bar_visible=state;
var sc=(state ? scrollBarWidth() : 0);
for (var x=0; x < this.i_shortcuts.length; x++) {
this.i_shortcuts[x].width(this.width() - sc);
}
if (this.i_pane!=undefined) {
this.i_pane_spacer.style.width=(this.width() - sc)+"px";
}
}
return this.i_scroll_bar_visible;
}
ShortcutPane.prototype.updateSpacer=function() {
if (this.i_pane_spacer!=undefined) {
var v=0;
for (var x=0; x < this.i_shortcuts.length; x++) {
v+=(this.i_shortcuts[x].visible() ? 1 : 0);
}
this.i_pane_spacer.style.height=3+"px"; 
this.i_pane_holder.style.height=(v * ShortcutLink.linkHeight)+"px";
this.updateScroll();
}
}
ShortcutPane.prototype.getPane=function() {
if (this.i_pane==undefined) {
this.i_pane=document.createElement('DIV');
this.i_pane.className="ShortcutPane";
this.i_pane.style.width=this.width()+"px";
this.i_pane.style.height=this.height()+"px"
this.i_pane_spacer=document.createElement('DIV');
this.i_pane_spacer.className="ShortcutPane_spacer";
this.i_pane_spacer.style.width=this.width()+"px";
this.i_pane_spacer.innerHTML="&nbsp;";
this.i_pane.appendChild(this.i_pane_spacer);
this.i_pane_holder=document.createElement('DIV');
this.i_pane.appendChild(this.i_pane_holder);
for (var x=0; x < this.i_shortcuts.length; x++) {
this.i_pane_holder.appendChild(this.i_shortcuts[x].getLink());
}
this.updateSpacer();
}
return this.i_pane;
}
function ShortcutLink(name, iconClass) {
this.i_name=name;
this.i_iconClass=iconClass;
this.i_width=20;
this.i_hover=false;
this.i_visible=true;
}
ShortcutLink.linkHeight=18;
ShortcutLink.iconHeight=16;
ShortcutLink.iconWidth=16;
ShortcutLink.iconPadding=5;
ShortcutLink.prototype.onclick=null;
ShortcutLink.prototype.onvisible=null;
ShortcutLink.prototype.parent=function() {
return this.i_parent;
}
ShortcutLink.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_link!=undefined) {
this.i_link.style.width=width+"px";
this.i_link_text.style.width=(width - ShortcutLink.iconWidth - ShortcutLink.iconPadding - 5)+"px";
}
}
return this.i_width;
}
ShortcutLink.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_link!=undefined) {
this.i_link_text.innerHTML=this.name();
this.i_tools.tip(this.name());
}
}
return this.i_name;
}
ShortcutLink.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_link!=undefined) {
this.i_link.style.display=(this.visible() ? "" : "none");
}
if (this.onvisible!=undefined) {
var o=new Object();
o.type="visible";
o.shortcut=this;
this.onvisible(o);
}
}
return this.i_visible;
}
ShortcutLink.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined) {
this.i_iconClass=iconClass;
if (this.i_link!=undefined) {
this.i_link_icon.className="ShortcutLink_icon "+this.iconClass();
}
}
return this.i_iconClass;
}
ShortcutLink.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover=state;
if (this.i_link!=undefined) {
this.i_link.className="ShortcutLink"+(this.hoverState() ? "_hover" : "");
}
}
return this.i_hover;
}
ShortcutLink.prototype.handleMouseOver=function(e) {
this.hoverState(true);
}
ShortcutLink.prototype.handleMouseOut=function(e) {
this.hoverState(false);
}
ShortcutLink.prototype.handleClick=function(e) {
if (this.onclick!=undefined) {
e.shortcut=this;
this.onclick(e);
}
}
ShortcutLink.prototype.getLink=function() {
if (this.i_link==undefined) {
this.i_link=document.createElement('DIV');
this.i_link.className="ShortcutLink"+(this.hoverState() ? "_hover" : "");
this.i_link.style.height=ShortcutLink.linkHeight+"px";
this.i_link.style.width=this.width()+"px";
this.i_link.style.display=(this.visible() ? "" : "none");
this.i_link.onselectstart=EventHandler.cancelEvent;
EventHandler.register(this.i_link, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_link, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_link, "onclick", this.handleClick, this);
this.i_tools=new ToolTip(this.i_link, 200, this.name());
this.i_link_spacer=document.createElement('DIV');
this.i_link_spacer.className="ShortcutLink_spacer";
this.i_link_spacer.style.width=ShortcutLink.iconPadding+"px";
this.i_link_spacer.style.height=ShortcutLink.linkHeight+"px";
this.i_link_spacer.innerHTML="&nbsp;";
this.i_link.appendChild(this.i_link_spacer);
this.i_link_icon=document.createElement('DIV');
this.i_link_icon.className="ShortcutLink_icon "+this.iconClass();
this.i_link_icon.style.width=ShortcutLink.iconWidth+"px";
this.i_link_icon.style.height=ShortcutLink.iconHeight+"px";
this.i_link_icon.style.marginTop=Math.floor((ShortcutLink.linkHeight - ShortcutLink.iconHeight) / 2)+"px";
this.i_link_icon.innerHTML="&nbsp;";
this.i_link.appendChild(this.i_link_icon);
this.i_link_text=document.createElement('DIV');
this.i_link_text.className="ShortcutLink_text";
this.i_link_text.style.width=(this.width() - ShortcutLink.iconWidth - ShortcutLink.iconPadding - 5)+"px";
this.i_link_text.style.height=ShortcutLink.linkHeight+"px";
this.i_link_text.style.lineHeight=ShortcutLink.linkHeight+"px";
this.i_link_text.innerHTML=this.name();
this.i_link.appendChild(this.i_link_text);
}
return this.i_link;
}
JavaScriptResource.notifyComplete("./lib/components/Component.ShortcutPane.js");
function SmartHandler(scope, handler, params, unwrap, append) {
this.i_scope=scope;
this.i_handler=handler;
this.i_params=params;
this.i_unwrap=(unwrap ? true : false);
this.i_append=(append ? true : false);
this.i_eval_pre=undefined;
this.i_eval_post=undefined;
this.i_comma_pre=false;
this.i_comma_post=false;
if(this.i_handler!=undefined) {
this.i_eval_pre="this.i_handler";
this.i_eval_post="";
if(this.i_scope!=undefined) {
this.i_eval_pre+=".call(this.i_scope";
this.i_comma_pre=true;
} else {
this.i_eval_pre+="(";
}
if(this.i_params!=undefined) {
var param_str="";
if(this.i_unwrap) {
for(var x=0; x < this.i_params.length; x++) {
if(x > 0) {
param_str+=",";
}
param_str+="this.i_params["+x+"]";
}
} else {
param_str+="this.i_params";
}
if(this.i_comma_pre) {
this.i_eval_pre+=",";
}
if(this.i_append) {
this.i_eval_pre+=param_str;
this.i_comma_pre=true;
} else {
this.i_eval_post+=param_str;
this.i_comma_pre=false;
this.i_comma_post=true;
}
}
this.i_eval_post+=");";
}
}
SmartHandler.prototype.execute=function(params, unwrap) {
if(this.i_handler!=undefined) {
if(unwrap) {
return this.executeUnwrap(params);
} else {
var eval_str=this.i_eval_pre;
if(arguments.length > 0) {
if(this.i_comma_pre) {
eval_str+=",";
}
eval_str+="params";
if(this.i_comma_post) {
eval_str+=",";
}
}
eval_str+=this.i_eval_post;
return eval(eval_str);
}
}
}
SmartHandler.prototype.executeUnwrap=function(params) {
if(this.i_handler!=undefined) {
var eval_str=this.i_eval_pre;
if(params!=undefined && params.length > 0) {
if(this.i_comma_pre) {
eval_str+=",";
}
for(var x=0; x < params.length; x++) {
if(x > 0) {
eval_str+=",";
}
eval_str+="params["+x+"]";
}
if(this.i_comma_post) {
eval_str+=",";
}
}
eval_str+=this.i_eval_post;
return eval(eval_str);
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.SmartHandler.js");
PopoutWindow.registerGroup("TitleBar", ["TitleBar",
"TitleBarFactory"]);
function TitleBarFactory(width, height, name, synch) {
this.i_height=height;			
this.i_width=width;			
this.i_name=(name!=undefined ? name : "");	
this.i_synch=(synch!=undefined ? synch : true);	
this.i_buttons=Array();		
this.i_product=Array();		
}
TitleBarFactory.prototype.ondblclick=null;
TitleBarFactory.prototype.name=function(newName) {
if (newName!=undefined) {
this.i_name=newName;
if (this.synch()) {
for (var x=0; x < this.products().length; x++) { 
if (this.product(x).i_name_synch==true) {
this.product(x).name(newName);
}
}
}
}
return this.i_name;
}
TitleBarFactory.prototype.height=function(newHeight) {
if (newHeight!=undefined) {
this.i_height=newHeight;
if (this.synch()) {
for (var x=0; x < this.products().length; x++) { 
if (this.product(x).i_height_synch==true) {
this.product(x).height(newHeight);
}
}
}
}
return this.i_height;
}
TitleBarFactory.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=newWidth;
if (this.synch()) {
for (var x=0; x < this.products().length; x++) { 
if (this.product(x).i_width_synch==true) {
this.product(x).name(newWidth);
}
}
}
}
return this.i_width;
}
TitleBarFactory.prototype.synch=function(state) {
if (state!=undefined) {
this.i_synch=state;
}
return this.i_state;
}
TitleBarFactory.prototype.products=function() {
return this.i_product;
}
TitleBarFactory.prototype.product=function(index) {
return this.i_product[index];
}
TitleBarFactory.prototype.buttons=function() {
return this.i_buttons;
}
TitleBarFactory.prototype.button=function(index) {
return this.i_buttons[index];
}
TitleBarFactory.prototype.addButton=function(newButton) {
this.i_buttons[this.buttons().length]=newButton;
if (this.synch()) {
for (var x=0; x < this.products().length; x++) { 
if (this.product(x).i_buttons_synch==true) {
this.product(x).addButton(newButton.copy());
}
}
}
return newButton;
}
TitleBarFactory.prototype.removeButton=function(button) {
for (var x=0; x < this.buttons().length; x++) {
if (this.button(x)==button) {
this.buttons().splice(x, 1);
if (this.synch()) {
for (var x=0; x < this.products().length; x++) { 
if (this.product(x).i_buttons_synch==true) {
this.product(x).removeButton(button);
}
}
}
return true;
}
}
return false;
}
TitleBarFactory.prototype.produce=function(buttonFocus) {
var newTitleBar=new TitleBar(this.width(), this.height(), this.name(), buttonFocus);
for (var x=0; x < this.buttons().length; x++) {
newTitleBar.addButton(this.button(x).copy(), true);
}
if (this.synch()) {
this.i_products[this.products().length]=newTitleBar;
}
if (this.ondblclick!=undefined) {
newTitleBar.ondblclick=this.ondblclick;
}
return newTitleBar;
}
function TitleBar(width, height, name, buttonFocus) {
this.i_height=height;			
this.i_width=width;			
this.i_name=name;			
this.i_buttons=Array();		
this.i_button_focus=buttonFocus;	
this.i_visible=false;			
this.i_height_synch=true;		
this.i_width_synch=true;		
this.i_name_synch=true;
this.i_button_synch=true;		
this.i_button_fader=new ElementFader();
this.i_button_fader.stage(false);
this.i_fade_state=false;
}
TitleBar.fadeIcons=false;
TitleBar.prototype.ondblclick=null;
TitleBar.prototype.buttonFocus=function(newFocus) {
if (newFocus!=undefined) {
this.i_button_focus=newFocus;
for (var x=0; x < this.buttons().length; x++) {
this.button(x).buttonFocus(newFocus);
}
}
return this.i_button_focus;
}
TitleBar.prototype.buttonsVisible=function(state) {
if (state!=undefined) {
if (state!=this.i_visible) {
this.i_visible=state;
if (this.i_title!=undefined) {
if (state==true) {
var used=10;
for (var x=0; x < this.buttons().length; x++) {
this.i_title.insertBefore(this.button(x).getButton(), this.i_drag_div);
this.i_button_fader.add_element(this.button(x).getButton());
if (!document.all) {
this.button(x).getButton().style.cssFloat="right";
}
else {
this.button(x).getButton().style.styleFloat="right";
}
used+=this.button(x).width();
}
this.i_title_text.style.width=(this.width() - used)+"px";				
if (this.i_fade_state==false) {
this.i_button_fader.stage(this.i_button_fader.maximum());
this.i_fade_state=true;
}
}
else {
for (var x=0; x < this.buttons().length; x++) {
try {
this.i_title.removeChild(this.button(x).getButton());
this.i_button_fader.remove_element(this.button(x).getButton());
} catch (e)  { }
this.i_title_text.style.width=(this.width() - 10)+"px";
}
if (this.i_fade_state==true) {
this.i_button_fader.stage(this.i_button_fader.minimum());
this.i_fade_state=false;
}
}
}
}
}
return this.i_visible;
}
TitleBar.prototype.buttonsVisibleFade=function(state) {
if (this.i_fade_state!=state) {
this.i_fade_state=state;
var me=this;
if (state==true) {
this.i_button_fader.oncomplete=undefined;
this.buttonsVisible(true);
this.i_button_fader.visible(true);
}
else {
this.i_button_fader.oncomplete=function() {
me.buttonsVisible(false);
}
this.i_button_fader.visible(false);
}
}
}
TitleBar.prototype.height=function(newHeight) {
if (newHeight!=undefined) {
this.i_height=newHeight;
this.i_height_synch=false;
if (this.i_title!=undefined) {
this.i_title.style.height=newHeight+"px";
this.i_title_text.style.height=newHeight+"px";
}
for (var x=0; x < this.buttons().length; x++) { 
this.button(x).height(newHeight);
}
}
return this.i_height;
}
TitleBar.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=newWidth;
this.i_width_synch=false;
if (this.i_title!=undefined) {
this.i_title.style.width=newWidth+"px";
var used=10;
if (this.buttonsVisible()) {
for (var x=0; x < this.buttons().length; x++) {
used+=this.button(x).width();
}
}
this.i_title_text.style.width=(newWidth - used)+"px";
}
}
return this.i_width;
}
TitleBar.prototype.name=function(newName) {
if (newName!=undefined) {
this.i_name=newName;
this.i_name_synch=false;
if (this.i_title_text!=undefined) {
this.i_title_text.innerHTML="&nbsp;"+(newName!=undefined ? newName.filterHTML() : "");
this.i_title_text.style.whiteSpace="nowrap";
this.i_title_text.style.overflow="hidden";
}
}
return this.i_name;
}
TitleBar.prototype.buttons=function() {
return this.i_buttons;
}
TitleBar.prototype.button=function(index) {
return this.i_buttons[index];
}
TitleBar.prototype.addButton=function(newButton, maintainSynchState) {
this.i_buttons[this.buttons().length]=newButton;
if (this.i_button_focus!=undefined) {
newButton.buttonFocus(this.i_button_focus);
}
if (maintainSynchState!=true) {
this.i_button_synch=false;
}
if (this.buttonsVisible()) {
if (this.i_title!=undefined) {		
alert(1);if (!document.all) {
newButton.getButton().style.cssFloat="right";
}
else {
newButton.getButton().style.styleFloat="right";
}
this.i_title.insertBefore(newButton.getButton(), this.i_drag_div);
this.i_button_fader.add_element(newButton.getButton());
}
}
}
TitleBar.prototype.getDragDIV=function() {
if (this.i_drag_div==undefined) {
this.i_drag_div=document.createElement('DIV');
}
return this.i_drag_div;
}
TitleBar.prototype.removeButton=function(button, maintainSynchState) {
for (var x=0; x < this.buttons().length; x++) {
if (this.button(x).id()==button.id()) {
if (maintainSynchState!=true) {
this.i_button_synch=false;
}
if (this.buttonsVisible()) {
if (this.i_title!=undefined) {
try {
this.i_title.removeChild(this.button(x).getButton());
this.i_button_fader.remove_element(this.button(x).getButton());
} catch (e) { }
}
}
this.buttons().splice(x, 1);
return true;
}
}
return false;
}
TitleBar.ignoreDoubleClick=function(e) {
e.returnValue=false;
return false;
}
TitleBar.handleDoubleClick=function(e) {
if (this.ondblclick!=undefined) {
this.ondblclick();
}
e.returnValue=false;
return false;
}
TitleBar.handleMouseOver=function(e) {
if (this.i_title.i_timer!=undefined) {
clearTimeout(this.i_title.i_timer);
this.i_title.i_timer=undefined;
}
this.buttonsVisibleFade(true);
}
TitleBar.handleMouseOut=function(e) {
var me=this;
this.i_title.i_timer=setTimeout(function() {
me.buttonsVisibleFade(false);
me.i_timer=undefined;
me=undefined;
}, 100);
}
TitleBar.prototype.getTitleBar=function() {
if (this.i_title==undefined) {
this.i_title=document.createElement('DIV');
this.i_title.style.width=this.width()+"px";
this.i_title.style.height=this.height()+"px";
this.i_title.className="TitleBar";
if (TitleBar.fadeIcons) {
EventHandler.register(this.i_title, "onmouseover", TitleBar.handleMouseOver, this);
EventHandler.register(this.i_title, "onmouseout", TitleBar.handleMouseOut, this);
}
EventHandler.register(this.i_title, "ondblclick", TitleBar.handleDoubleClick, this);
var used=10;
if (this.buttonsVisible()) {
for (var x=0; x < this.buttons().length; x++) { 
if (!document.all) {
this.button(x).getButton().style.cssFloat="right";
}
else {
this.button(x).getButton().style.styleFloat="right";
}
this.i_title.appendChild(this.button(x).getButton());
EventHandler.register(this.buttons(x).getButton(), "ondblclick", TitleBar.ignoreDoubleClick);
used+=this.button(x).width();
this.i_button_fader.add_element(this.button(x).getButton());
}
}
this.i_title.appendChild(this.getDragDIV());
this.i_title_text=document.createElement('DIV');
this.i_title_text.innerHTML="&nbsp;"+(this.name()!=undefined ? this.name().filterHTML() : "");
this.i_title_text.style.width=(this.width() - used)+"px";
this.i_title_text.style.height=this.height()+"px";
this.i_title_text.style.whiteSpace="nowrap";
this.i_title_text.style.overflow="hidden";
this.getDragDIV().appendChild(this.i_title_text);
if (!TitleBar.fadeIcons) {
this.buttonsVisible(true);
}
}
return this.i_title;
}
JavaScriptResource.notifyComplete("./lib/components/Component.TitleBar.js");
function TreePane(name, width, height, iconClasses, openIconClasses) {
this.i_width=width;		
this.i_height=height;		
this.i_icons=iconClasses;
this.i_open_icons=openIconClasses;
this.i_tree_width=200;
this.i_tool_bar=undefined;
}
TreePane.prototype.iconClasses=function(iconClasses) {
if (iconClasses!=undefined) {
this.i_icons=iconClasses;
if (this.i_tree!=undefined) {
this.i_tree.i_icons=iconClasses;
}
}
return this.i_icons;
}
TreePane.prototype.iconOpenClasses=function(iconClasses) {
if (iconClasses!=undefined) {
this.i_open_icons=iconClasses;
if (this.i_tree!=undefined) {
this.i_tree.i_icons_open=iconClasses;
}
}
return this.i_open_icons;
}
TreePane.prototype.toolBar=function(toolBar) {
if (toolBar!=undefined) {
this.i_tool_bar=toolBar;
this.updateDimensions();
}
return this.i_tool_bar;
}
TreePane.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
this.updateDimensions();
}
return this.i_width;
}
TreePane.prototype.treeWidth=function(width) {
if (width!=undefined) {
this.i_tree_width=width;
this.updateDimensions();
}
return this.i_tree_width;
}
TreePane.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
this.updateDimensions();
}
return this.i_height;
}
TreePane.handleNodeSelect=function(tree, display, node, e) {
this.pObj.setActiveNode(node);
}
TreePane.prototype.setActiveNode=function(node) {
if (node!=undefined) {
if (this.i_active!=undefined) {
if (this.i_content!=undefined) {
try {
this.i_content.removeChild(this.i_active.contentPane.getContent());
} catch (e) { }
}
}
this.i_active=node;
if (node.contentPane!=undefined) {
if (this.i_content!=undefined) {
this.i_content.appendChild(node.contentPane.getContent());
}
}
}
}
TreePane.prototype.getActiveNode=function() {
return this.i_active;
}
TreePane.prototype.getTree=function() {
if (this.i_tree==undefined) {
this.i_tree=new LiteTree(this.dataModel(), this.iconClasses(), this.iconOpenClasses(), this.treeWidth(), this.height());
this.i_tree.rootVisible(false);
this.i_tree.pObj=this;
this.i_tree.onmousedown=TreePane.handleNodeSelect;
}
return this.i_tree;
}
TreePane.prototype.dataModel=function(dataModel) {
if (dataModel!=undefined) {
this.i_dataModel=dataModel;
if (this.i_tree!=undefined) {
this.i_tree.dataModel(dataModel);
}
}
return this.i_dataModel;
}
TreePane.prototype.updateDimensions=function() {
var comp=0;
if (this.toolBar()!=undefined) {
comp+=this.toolBar().height();
this.toolBar().width(this.width());
}
if (this.i_pane!=undefined) {
this.i_pane.style.width=this.width()+"px";
this.i_pane.style.height=(this.height() - comp)+"px";
this.i_pane_tree.style.width=this.treeWidth()+"px";
this.i_pane_tree.style.height=(this.height() - comp)+"px";
var newWidth=((this.width() - this.treeWidth()) - 7);
if (newWidth > 0)
this.i_content.style.width=((this.width() - this.treeWidth()) - 7)+"px";
this.i_content.style.height=(this.height() - comp)+"px";
this.i_divider.style.height=((this.height() - comp))+"px";
}
if (this.i_tree!=undefined) {
this.i_tree.height(this.height() - comp);
}
}
TreePane.prototype.getTreePane=function() {
if (this.i_pane==undefined) {
this.i_pane=document.createElement('DIV');	
this.i_pane.className="TreePane";
this.i_pane_tools=document.createElement('DIV');
if (this.toolBar()!=undefined) {
this.i_pane_tools.appendChild(this.toolBar().getBar());
}
this.i_pane.appendChild(this.i_pane_tools);
this.i_pane_tree=document.createElement('DIV');
this.i_pane_tree.className="TreePane_tree";
this.i_pane.appendChild(this.i_pane_tree);
this.getTree().height(this.height());
this.i_pane_tree.appendChild(this.getTree().getTree());
this.i_divider=document.createElement('DIV');
this.i_divider.innerHTML="&nbsp;";
this.i_divider.className="TreePane_divider";
this.i_pane.appendChild(this.i_divider);
this.i_content=document.createElement('DIV');
this.i_content.className="TreePane_content";
this.i_pane.appendChild(this.i_content);
if (this.getActiveNode()!=undefined) {
if (this.getActiveNode().contentPane!=undefined) {
this.i_content.appendChild(this.getActiveNode().contentPane);
}
}
this.updateDimensions();
}
return this.i_pane;
}
TreePane.prototype.getContent=function() {
return this.getTreePane();
}
JavaScriptResource.notifyComplete("./lib/components/Component.TreePane.js");
PopoutWindow.registerGroup("ToolBar",["ToolBar",
"ToolBarItem",
"ToolBarButton",
"ToolBarIconField",
"ToolBarOptionBox",
"ToolBarDivider",
"ToolBarArea"]);
function ToolBar(width, height) {
this.i_width=width;					
this.i_height=(height!=undefined ? height : 25);	
this.i_items=Array();					
}
ToolBar.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_bar!=undefined) {
this.i_bar.style.width=width+"px";
}
this.resolveOverflow();
}
return this.i_width;
}
ToolBar.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_bar!=undefined) {
this.i_bar.style.height=height+"px";
}
for (var x=0; x < this.i_items.length; x++) {
this.i_items[x].height(this.height() - 2);
}
}
return this.i_height;
}
ToolBar.prototype.clear=function() {
for (var x=this.i_items.length - 1; x >=0; x--) {
this.removeItem(this.i_items[x]);
}	
return true;
}
ToolBar.prototype.items=function() {
return this.i_items;
}
ToolBar.prototype.addItem=function(item, beforeItem) {
if(item.isToolbar) {
item.isToolbar(true);
}
item.height(this.height() - 3);
if (beforeItem!=undefined) {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x]==beforeItem) {
this.i_items.splice(x, 0, item);
if (this.i_bar!=undefined) {
this.i_bar.insertBefore(item.getItem(), beforeItem.getItem());
}
break;
}
}
}
else {
this.i_items[this.i_items.length]=item;
if (this.i_bar!=undefined) {
this.i_bar.insertBefore(item.getItem(), this.i_bar_context);
}
}
this.resolveOverflow();
return item;
}
ToolBar.prototype.removeItem=function(item) {
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x]==item) {
this.i_items.splice(x, 1);
if (this.i_bar!=undefined) {
try {
this.i_bar.removeChild(item.getItem());
} catch (e) { }
}
this.resolveOverflow();
return true;
}
}
return false;
}
ToolBar.prototype.resolveOverflow=function() {
var rt=40;
var rem=Array();
var good=Array();
for (var x=0; x < this.i_items.length; x++) {
if (this.i_items[x].allowOverflow()) {
rem[x]=this.i_items[x];
}
else {
good[x]=this.i_items[x];
rt+=this.i_items[x].width();
}
}
while (rt < this.width()) {
var found=false;
for (var x=0; x < this.i_items.length; x++) {
if (rem[x]!=undefined && rem[x].width()+rt <=this.width()) {
good[x]=rem[x];
rt+=rem[x].width();
rem[x]=undefined;
found=true;
}
if (rem[x]!=undefined && rem[x].width()+rt > this.width()) {
break;
}
}
if (!found) {
break;
}
}
if (this.i_bar!=undefined) {
var showCon=false;
var lastDiv=true;
for (var x=0; x < this.i_items.length; x++) {
if (this.i_context!=undefined && this.i_items[x].i_init_context==true) {
this.i_context.removeItem(this.i_items[x].contextMenuItem());
this.i_items[x].i_init_context=false;
}
if (good[x]!=undefined) {
this.i_bar.insertBefore(this.i_items[x].getItem(), this.i_bar_context);
}
else if (rem[x]!=undefined) {
try {
this.i_bar.removeChild(this.i_items[x].getItem());
} catch (e) { }
showCon=true;		
if (this.i_context!=undefined) {
var skipMe=false;
if (this.i_items[x].i_divider==true) {
if (lastDiv==true) {
skipMe=true;
}
lastDiv=true;
}
else {
lastDiv=false;
}
if (!skipMe) {
this.i_context.addItem(this.i_items[x].contextMenuItem())
this.i_items[x].i_init_context=true;
}
}
}
}
this.i_bar_context.style.display=(showCon==true ? "" : "none");
}
}
ToolBar.prototype.contextButton=function() {
return this.i_context_button;
}
ToolBar.prototype.contextMenu=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu();
this.resolveOverflow();	
}
return this.i_context;
}
ToolBar.prototype.handleGetContext=function(e) {
this.contextMenu().show();
e.cancelBubble=true;
return false;
}
ToolBar.prototype.getBar=function() {
if (this.i_bar==undefined) {
this.i_bar=document.createElement('DIV');
this.i_bar.className="ToolBar";
this.i_bar.style.height=this.height()+"px";
this.i_bar.style.width=this.width()+"px";
this.i_bar_context=document.createElement("div");
this.i_bar_context.className="ToolBar_context";
this.i_bar_context.style.display="none";
this.i_context_button=new ToolBarButton(new IconButton("ToolBar_context_button", 11, 17, 11, 17, undefined, new SmartHandler(this, this.handleGetContext)));
this.i_context_button.height(this.height() - 3);
this.i_bar_context.appendChild(this.i_context_button.getItem());
this.i_bar.appendChild(this.i_bar_context);
this.resolveOverflow();
}
return this.i_bar;
}
function ToolBarItem() {
this.superConstructor();
}
ToolBarItem.prototype.superConstructor=function(floatDirection, allowOverflow) {
this.i_height=1;
this.i_direction=(floatDirection!=undefined ? floatDirection : "left");
this.i_allow_overflow=(allowOverflow==undefined ? false : allowOverflow);
}
ToolBarItem.prototype.width=null;
ToolBarItem.prototype.contextMenuItem=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenuIconItem(this.name(), this.iconClass(), undefined, undefined, ToolBarItem.handleItemSelect);
this.i_context.i_toolItem=this;
}
return this.i_context;
}
ToolBarItem.handleItemSelect=function(menu_item) {
if (menu_item.i_toolItem.button!=undefined) {
menu_item.i_toolItem.button().execute.call(menu_item.i_toolItem.button(), new Object());
}
return true;
}
ToolBarItem.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_context!=undefined) {
this.i_context.name(name);
}
}
return this.i_name;
}
ToolBarItem.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined) {
this.i_iconClass=iconClass;
if (this.i_context!=undefined) {
this.i_context.iconCSS(iconClass);
}
}
return this.i_iconClass;
}
ToolBarItem.prototype.superHeight=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_wrapper_div!=undefined) {
this.i_wrapper_div.style.height=height+"px";
}
}
return this.i_height;
}
ToolBarItem.prototype.height=function(height) {
return this.superHeight(height);
}
ToolBarItem.prototype.allowOverflow=function(state) {
if (state!=undefined) {
this.i_allow_overflow=state;
}
return this.i_allow_overflow;
}
ToolBarItem.prototype.floatDirection=function(floatDirection) {
if (floatDirection!=undefined) {
this.i_direction=floatDirection;
if (this.i_wrapper_div!=undefined) {
this.i_wrapper_div.style[!document.all ? 'cssFloat' : 'styleFloat']=floatDirection;
}
}
return this.i_direction;
}
ToolBarItem.prototype.getItem=null;
function ToolBarButton(button, floatDirection, allowOverflow) {
this.i_button=button;
if (button.name==undefined || button.name()=="" || button.name()==undefined) {
this.name(button.tipText());
}
else {
this.name(button.name());
}
if (button.iconCSS!=undefined) {
this.iconClass(button.iconCSS());
}
this.superConstructor(floatDirection, (allowOverflow==undefined ? true : allowOverflow));
}
ToolBarButton.prototype.width=function() {
if (this.i_button!=undefined) {
return this.i_button.width()+2;
}
return 0;
}
ToolBarButton.prototype.height=function(height) {
if(height!=undefined) {
if(this.i_button) {
this.i_button.height(height - 2);
}
}
return this.superHeight(height);
}
ToolBarButton.prototype.button=function() {
return this.i_button;
}
ToolBarButton.handleMouseOut=function(e) {
this.i_wrapper_div.className="ToolBarButton_normal";
e.returnValue=true;
return true;
}
ToolBarButton.handleMouseOver=function(e) {
this.i_wrapper_div.className="ToolBarButton_hover";
e.returnValue=true;
return true;
}
ToolBarButton.prototype.getItem=function() {
if (this.i_wrapper_div==undefined) {
this.i_wrapper_div=document.createElement('DIV');
this.i_wrapper_div.className="ToolBarButton_normal";
this.i_wrapper_div.style.height=this.height()+"px";
this.i_wrapper_div.style[!document.all ? 'cssFloat' : 'styleFloat']=this.floatDirection();
EventHandler.register(this.i_wrapper_div, "onmouseover", ToolBarButton.handleMouseOver, this);
EventHandler.register(this.i_wrapper_div, "onmouseout", ToolBarButton.handleMouseOut, this);
var b=this.i_button.getButton();
this.i_wrapper_div.appendChild(b);
}
return this.i_wrapper_div;
}
for (var meth in ToolBarItem.prototype) {
if (ToolBarButton.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ToolBarButton.prototype[meth]=ToolBarItem.prototype[meth];
}
}
function ToolBarIconField(iconField, floatDirection, allowOverflow) {
this.i_icon_field=iconField;
this.superConstructor(floatDirection, allowOverflow);
}
ToolBarIconField.prototype.width=function() {
if (this.i_icon_field!=undefined) {
return this.i_icon_field.width();
}
return 0;
}
ToolBarIconField.prototype.getItem=function() {
if (this.i_wrapper_div==undefined) {
this.i_wrapper_div=document.createElement('DIV');
this.i_wrapper_div.className="ToolBarIconField";
this.i_wrapper_div.style[!document.all ? 'cssFloat' : 'styleFloat']=this.floatDirection();
var b=this.i_icon_field.getField();
this.i_wrapper_div.appendChild(b);
}
return this.i_wrapper_div;
}
for (var meth in ToolBarItem.prototype) {
if (ToolBarIconField.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ToolBarIconField.prototype[meth]=ToolBarItem.prototype[meth];
}
}
function ToolBarOptionBox(optionBox, floatDirection, allowOverflow) {
this.i_option_box=optionBox;
this.superConstructor(floatDirection, allowOverflow);
}
ToolBarOptionBox.prototype.width=function() {
if (this.i_option_box!=undefined) {
return this.i_option_box.width();
}
return 0;
}
ToolBarOptionBox.prototype.getItem=function() {
if (this.i_wrapper_div==undefined) {
this.i_wrapper_div=document.createElement('DIV');
this.i_wrapper_div.className="ToolBarOptionBox";
this.i_wrapper_div.style[!document.all ? 'cssFloat' : 'styleFloat']=this.floatDirection();
var b=this.i_option_box.getInput();
this.i_wrapper_div.appendChild(b);
}
return this.i_wrapper_div;
}
for (var meth in ToolBarItem.prototype) {
if (ToolBarOptionBox.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ToolBarOptionBox.prototype[meth]=ToolBarItem.prototype[meth];
}
}
function ToolBarDivider(allowOverflow) {
this.i_divider=true;
this.superConstructor("left", (allowOverflow==undefined ? true : allowOverflow));
}
ToolBarDivider.prototype.width=function() {
return 10;
}
ToolBarDivider.prototype.contextMenuItem=function() {
if (this.i_context_item==undefined) {
this.i_context_item=new ContextMenuDivider();
}
return this.i_context_item;
}
ToolBarDivider.prototype.hide=function() {
if(this.i_div!=undefined) {
this.i_wrapper_div.style.display="none";
}
}
ToolBarDivider.prototype.show=function() {
if(this.i_div!=undefined) {
this.i_wrapper_div.style.display="";
}
}
ToolBarDivider.prototype.getItem=function() {
if (this.i_wrapper_div==undefined) {
this.i_wrapper_div=document.createElement('DIV');
this.i_wrapper_div.className="ToolBarDivider";
this.i_wrapper_div.style.height=(this.height() - 4)+"px";
this.i_wrapper_div.style.marginTop="1px";
this.i_wrapper_div.innerHTML="&nbsp";
this.i_wrapper_div.style[!document.all ? 'cssFloat' : 'styleFloat']=this.floatDirection();
}
return this.i_wrapper_div;
}
for (var meth in ToolBarItem.prototype) {
if (ToolBarDivider.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ToolBarDivider.prototype[meth]=ToolBarItem.prototype[meth];
}
}
function ToolBarArea(floatDirection, allowOverflow) {
this.i_area;
this.superConstructor(floatDirection, allowOverflow);
}
ToolBarArea.prototype.getArea=function() {
if(!this.i_area) {
this.i_area=document.createElement("div");
}
return this.i_area;
}
ToolBarArea.prototype.width=function() {
if(this.i_area) {
return this.i_area.offsetWidth;
}
return 0;
}
ToolBarArea.prototype.getItem=function() {
if (this.i_wrapper_div==undefined) {
this.i_wrapper_div=document.createElement('DIV');
this.i_wrapper_div.className="ToolBarArea";
this.i_wrapper_div.style[!document.all ? 'cssFloat' : 'styleFloat']=this.floatDirection();
if(this.i_area) {
this.i_wrapper_div.appendChild(this.i_area);
}
}
return this.i_wrapper_div;
}
for (var meth in ToolBarItem.prototype) {
if (ToolBarArea.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
ToolBarArea.prototype[meth]=ToolBarItem.prototype[meth];
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.ToolBar.js");
function ToolTip(element, width, message) {
this.element(element, message);					
this.i_width=(width!=undefined ? width : 200);		
if (element!=undefined) {
this.i_element_l=EventHandler.register(this.element(), "onmouseover", this.show, this);
}
}
ToolTip.i_active_tip;
ToolTip.i_disabled=false;
ToolTip.prototype.elementWidth=function(width) {
if (width!=undefined) {
this.i_element_width=width;
}
return this.i_element_width;
}
ToolTip.prototype.elementHeight=function(height) {
if (height!=undefined) {
this.i_element_height=height;
}
return this.i_element_height;
}
ToolTip.prototype.elementTop=function(top) {
if (top!=undefined) {
this.i_element_top=top;
}
return this.i_element_top;
}
ToolTip.prototype.elementLeft=function(left) {
if (left!=undefined) {
this.i_element_left=left;
}
return this.i_element_left;
}
ToolTip.prototype.show=function(e) {
if (ToolTip.i_disabled) {
return;
}
if (ToolTip.i_mv_l!=undefined) {
ToolTip.i_mv_l.unregister();
ToolTip.i_mv_l=null;
if (ToolTip.i_active_tip!=undefined) {
ToolTip.i_active_tip.hide();
}
}
if (this.i_timer!=undefined) {
clearTimeout(this.i_timer);
this.i_timer=null;
}
var me=this;
ToolTip.i_active_tip=this;
if (me.tip()!=undefined && me.tip().toString()!="") {
this.i_timer=setTimeout(function() {
me.i_div=ToolTip.getTipDIV(me.tip().toString().replace("\n", "<br>"));
var d=ToolTip.getTextDimensions(me.tip().toString().replace("\n", "<br>"), "ToolTip_text", me.width());
me.i_div.style.width=(d[0]+10)+"px";
me.i_div.i_width=(d[0]+10);
var atX=CursorMonitor.getX();
var atY=CursorMonitor.getY();
if (atX+(d[0]+10) > (CursorMonitor.browserWidth() - 40)) {
atX=(CursorMonitor.browserWidth() - d[0]) - 40;
}
if(atY+(d[1]+10) > (CursorMonitor.browserHeight() - 60)) {
atY=(CursorMonitor.browserHeight()-d[1])-60;
}
me.i_div.style.left=atX+10;
me.i_div.style.top=atY+15;		
if (ToolTip.i_md_l!=null) {
ToolTip.i_md_l.unregister();
ToolTip.i_md_l=null;
}
ToolTip.i_md_l=EventHandler.register(document.body, "onmousedown", this.hide, this);
if (me.checkPosition()) {
me.i_div.style.display="";
document.body.appendChild(me.i_div);
ToolTip.i_fader.visible(true);
if (ToolTip.i_fader_ls!=undefined) {
ToolTip.i_fader_ls.unregister();
ToolTip.i_fader_ls=null;
}
}
}, 500);
}
ToolTip.i_mv_l=EventHandler.register(document.body, "onmousemove", this.checkPosition, this);
ToolTip.i_active_tip=this;
}
ToolTip.prototype.checkPosition=function(e) {
var x=CursorMonitor.getX();
var y=CursorMonitor.getY();
var lf=0;
var tp=0;
if (this.elementLeft()==undefined) {
var me=this.element();
while (me!=null) {
lf+=parseInt(me.offsetLeft);
lf-=parseInt(me.scrollLeft);
tp+=parseInt(me.offsetTop);
tp-=parseInt(me.scrollTop);
me=me.offsetParent;
}
}
else {
lf=this.elementLeft();
tp=this.elementTop();
}
var wd=(this.elementWidth()!=undefined ? this.elementWidth() : parseInt(this.element().offsetWidth));
var ht=(this.elementHeight()!=undefined ? this.elementHeight() : parseInt(this.element().offsetHeight));
if (x < lf || x > lf+wd || y < tp || y > tp+ht) {
this.hide();
if(e!=undefined) {
e.returnValue=false;
}
return false;
}
if(e!=undefined) {
e.returnValue=true;
}
return true;
}
ToolTip.prototype.handleFaderComplete=function(e) {
ToolTip.i_div.style.display="none";
}
ToolTip.prototype.hide=function() {
if (ToolTip.i_fader!=undefined) {
if (ToolTip.i_mv_l!=undefined) {
ToolTip.i_mv_l.unregister();
ToolTip.i_mv_l=null;
}
if (this.i_timer!=undefined) {
clearTimeout(this.i_timer);
this.i_timer=null;
}
if (ToolTip.i_fader_ls!=undefined) {
ToolTip.i_fader_ls.unregister();
ToolTip.i_fader_ls=null;
}
if (ToolTip.i_md_l!=null) {
ToolTip.i_md_l.unregister();
ToolTip.i_md_l=null;
}
ToolTip.i_fader_ls=EventHandler.register(ToolTip.i_fader, "oncomplete", this.handleFaderComplete, this);
ToolTip.i_fader.visible(false);
}
}
ToolTip.getTipDIV=function(tipText) {
if (ToolTip.i_div==undefined) {
ToolTip.i_fader=new ElementFader();
ToolTip.i_fader.maximum(.90);
ToolTip.i_div=document.createElement('DIV');
ToolTip.i_div.className="ToolTipText";
ToolTip.i_div_text=document.createElement('DIV');
ToolTip.i_div.appendChild(ToolTip.i_div_text);
ToolTip.i_fader.add_element(ToolTip.i_div);
ToolTip.i_fader.stage(0);
ToolTip.i_div.style.display="none";
}
ToolTip.i_div_text.innerHTML=tipText;
return ToolTip.i_div;
}
ToolTip.prototype.element=function(element, tip) {
if (element!=undefined) {
if (this.i_element_l!=undefined) {
this.i_element_l.unregister();
}
this.i_element_l=EventHandler.register(element, "onmouseover", this.show, this);
this.i_element_m=EventHandler.register(element, "onmouseout", this.hide, this);
this.i_element=element;
this.i_tip=(tip!=undefined ? tip : undefined);
this.tip();
element.alt="";
element.title="";
}
return this.i_element;
}
ToolTip.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
}
return this.i_width;
}
ToolTip.prototype.tip=function(tip) {
if (tip!=undefined) {
this.i_tip=tip;
if (ToolTip.i_active_tip==this && ToolTip.i_div!=undefined) {
ToolTip.i_div_text.innerHTML=tip;
}
}
if (this.i_tip==undefined && this.element()!=undefined) {
if (this.element().alt!=undefined && this.element().alt!="") {
this.i_tip=this.element().alt;
}
else if (this.element().title!=undefined && this.element().title!="") {
this.i_tip=this.element().title;
}
else {
this.i_tip="";
}
}
return this.i_tip;
}
ToolTip.getTextDimensions=function(text, css_class, maxWidth) {
var ret=Array();
if (ToolTip.i_mesure==undefined) {
ToolTip.i_mesure=document.createElement('DIV');
ToolTip.i_mesure.style.visibility="hidden";
ToolTip.i_mesure.style.position="absolute";
document.body.appendChild(ToolTip.i_mesure);
}
document.body.appendChild(ToolTip.i_mesure);
ToolTip.i_mesure.innerHTML=text;
ToolTip.i_mesure.style.width="auto";
ToolTip.i_mesure.className=css_class;
ret[0]=parseInt(ToolTip.i_mesure.offsetWidth);
if (ret[0] > maxWidth) {
ToolTip.i_mesure.style.width=maxWidth+"px";
ret[0]=maxWidth;
}
ret[1]=parseInt(ToolTip.i_mesure.offsetHeight);
document.body.removeChild(ToolTip.i_mesure);
return ret;
}
ToolTip.tipsDisabled=function(state) {
if (state!=undefined) {
ToolTip.i_disabled=state;
}
return ToolTip.i_disabled;
}
JavaScriptResource.notifyComplete("./lib/components/Component.ToolTip.js");
function TextEdit(name,value,width,maxlength,password,rows) {
this.i_name=name;
this.i_value=value;
this.i_width=width;
this.i_maxlength=maxlength;
this.i_password=password;
this.i_rows=rows;
this.i_content=null;
}
TextEdit.prototype.getContent=function() {
if (this.i_content) {
return this.i_content.getContent();
}
this.i_content=new BasicTable(2,1);
this.i_content.setCellSpacing("0px");
var inputCell=this.i_content.getCell(1,0);
this.i_input=document.createElement("INPUT");
if (this.i_password) {
this.i_input.type="PASSWORD";
} else {
this.i_input.type="TEXT";
}
if (this.i_name) {
this.i_input.name=this.i_name;
}
if (this.i_value) {
this.i_input.value=this.i_value;
}
if (this.i_width) {
this.i_content.setWidth(this.i_width);
this.i_input.style.width=this.i_width;
} else {
this.i_content.setWidth("100%");
this.i_input.style.width="100%";
}
if (this.i_maxlength) {
this.i_input.maxlength=this.i_maxlength;
}
if (this.i_rows) {
this.i_input.rows=this.i_rows;
}
inputCell.appendChild(this.i_input);
this.updateLabel();
return this.i_content.getContent();
}
TextEdit.prototype.value=function() {
if (this.i_input) {
return this.i_input.value;
}
return this.value;
}
TextEdit.prototype.focus=function() {
if (this.i_input) {
this.i_input.focus();
}
return true;
}
TextEdit.prototype.setValue=function(newvalue) {
this.i_value=newvalue;
if (this.i_input) {
this.i_input.value=newvalue;
}
}
TextEdit.prototype.addLabel=function(labelText) {
this.i_labelText=labelText;
this.updateLabel();
}
TextEdit.prototype.updateLabel=function() {
if (!this.i_content || !this.i_labelText) {
return;
}
if (!this.i_label) {
this.i_label=document.createElement("DIV");
this.i_label.className="txtnormal";
var labelCell=this.i_content.getCell(0,0);
labelCell.appendChild(this.i_label);
}
this.i_label.innerHTML=this.i_labelText;
}
function Text(name,value,width,maxlength,password,rows) {
this.i_name=name;
this.i_value=value;
this.i_width=width;
this.i_maxlength=maxlength;
this.i_password=password;
this.i_rows=rows;
this.i_content=null;
}
Text.prototype.getContent=function() {
if (this.i_content) {
return this.i_content.getContent();
}
this.i_content=new BasicTable(2,1);
this.i_content.setCellSpacing("0px");
var inputCell=this.i_content.getCell(1,0);
this.i_input=document.createElement("DIV");
if (this.i_name) {
this.i_input.name=this.i_name;
}
if (this.i_value) {
this.i_input.value=this.i_value;
}
if (this.i_width) {
this.i_content.setWidth(this.i_width);
this.i_input.style.width=this.i_width;
} else {
this.i_content.setWidth("100%");
this.i_input.style.width="100%";
}
if (this.i_maxlength) {
this.i_input.maxlength=this.i_maxlength;
}
if (this.i_rows) {
this.i_input.rows=this.i_rows;
}
inputCell.appendChild(this.i_input);
this.updateLabel();
return this.i_content.getContent();
}
Text.prototype.value=function() {
if (this.i_input) {
return this.i_input.innerHTML;
}
return this.value;
}
Text.prototype.focus=function() {
if (this.i_input) {
this.i_input.focus();
}
return true;
}
Text.prototype.setValue=function(newvalue) {
this.i_value=newvalue;
if (this.i_input) {
this.i_input.innerHTML=newvalue;
}
}
Text.prototype.addLabel=function(labelText) {
this.i_labelText=labelText;
this.updateLabel();
}
Text.prototype.updateLabel=function() {
if (!this.i_content || !this.i_labelText) {
return;
}
if (!this.i_label) {
this.i_label=document.createElement("DIV");
this.i_label.className="txtnormal";
var labelCell=this.i_content.getCell(0,0);
labelCell.appendChild(this.i_label);
}
this.i_label.innerHTML=this.i_labelText;
}
JavaScriptResource.notifyComplete("./lib/components/Component.TextEdit.js");
function WindowColumn() {
this.i_windows=Array();		
}
WindowColumn.prototype.parentManager=function() {
return this.i_parent_manager;
}
WindowColumn.prototype.windows=function(index) {
if (index!=undefined) {
return this.i_windows[index];
}
return this.i_windows;
}
WindowColumn.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
for (var x=0; x < this.windows().length; x++) {
this.windows(x).width(newWidth);
}
}
if (this.windows().length > 0) {
return this.windows(0).width();
}
else {
return 0;
}
}
WindowColumn.prototype.minimumWidth=function() {
var largeMin=0;
for (var x=0; x < this.windows().length; x++) {
if (this.windows(x).minimumWidth() > largeMin) {
largeMin=this.windows(x).minimumWidth();
}
}
return largeMin;
}
WindowColumn.prototype.effectiveWidth=function() {
if (this.windows().length > 0) {
return this.windows(0).effectiveWidth();
}
else {
return 0;
}
}
WindowColumn.prototype.height=function() {
return this.parentManager().height();
}
WindowColumn.prototype.insertWindow=function(window, insertBefore) {
WindowManager.message("Inserting window "+window.name()+(insertBefore!=undefined ? " before "+insertBefore.name() : " as append"));
var curWidth=this.width();
if (insertBefore!=undefined) {
for (var x=0; x < this.windows().length; x++) {
if (this.windows(x)==insertBefore) {
this.i_windows.splice(x, 0, window);
window.i_parent_column=this;
window.i_parent_manager=this.parentManager();
if (curWidth!=0) {
window.width(curWidth);
}
if (this.i_column!=undefined) {
this.i_column.insertBefore(window.getWindow(), insertBefore.getWindow());
this.i_column.insertBefore(window.getWindowResize(), insertBefore.getWindow());
}
return window;
}
}
}
if(!window.minimized()) {
window.visible(true);
}
if (this.i_column!=undefined) {
if (this.windows().length >=1) {
this.i_column.appendChild(this.windows(this.windows().length - 1).getWindowResize());
}
this.i_column.appendChild(window.getWindow());
}
this.i_windows[this.i_windows.length]=window;
window.i_parent_column=this;
window.i_parent_manager=this.parentManager();
if (curWidth!=0) {
window.width(curWidth);
}
if (this.i_column!=undefined) {
this.i_column.appendChild(window.getWindow());
}
return window;
}
WindowColumn.prototype.removeWindow=function(window) {
WindowManager.message("Removing window "+window.name());
window.visible(false);
for (var x=0; x < this.windows().length; x++) {
if (this.windows(x)==window) {
if (this.i_column!=undefined) {
this.i_column.removeChild(window.getWindow());
if (x!=this.windows().length - 1) {
this.i_column.removeChild(window.getWindowResize());
}
}
this.i_windows.splice(x, 1);
if (window.i_parent_column==this) {
window.i_parent_column=null;
window.i_parent_manager=null;
}
if (this.windows().length==1) {
try {
this.i_column.removeChild(this.windows(0).getWindowResize());
} catch (e) { }
}
if (this.windows().length==0) {
this.parentManager().removeColumn(this);
}
return true;
}
}
return false;
}
WindowColumn.finishResize=function(e) {
var rep=WindowManager.getResizeBar();
CursorMonitor.removeListener(rep.cur_id);
rep.ev_id.unregister();
var diff=(CursorMonitor.getX() - rep.startX);
WindowManager.message("finish column resize at "+diff);
try {
document.body.removeChild(rep);
} catch (e) { }
this.parentManager().resizeColumn(this, diff);
this.parentManager().captureAll(false);
rep.ev_id=null;
rep.cur_id=null;	
SystemCore.layoutManager().notifyChange();
}
WindowColumn.updateResize=function(x, y) {
var rep=WindowManager.getResizeBar();
rep.style.left=x+"px";	
}
WindowColumn.startResize=function(e) {
WindowManager.message("Start column resize");
var rep=WindowManager.getResizeBar();
rep.cur_id=CursorMonitor.addListener(WindowColumn.updateResize);
rep.ev_id=EventHandler.register(document.body, "onmouseup", WindowColumn.finishResize, this);
rep.style.width=WindowManager.vertical_resize_bar_width+"px";
rep.style.height=this.parentManager().height() - WindowManager.window_border_width;
rep.style.top=this.parentManager().top();
rep.style.left=CursorMonitor.getX()+"px";
rep.startX=CursorMonitor.getX();
this.parentManager().captureAll(true);
document.body.appendChild(rep);
e.returnValue=false;
}
WindowColumn.prototype.getColumnResize=function() {
if (this.i_column_resize==undefined) {
this.i_column_resize=document.createElement('TD');
this.i_column_resize.innerHTML+="&nbsp;";
this.i_column_resize.className="WindowColumn_resize";
this.i_column_resize.style.width=WindowManager.vertical_resize_bar_width+"px";
EventHandler.register(this.i_column_resize, "onmousedown", WindowColumn.startResize, this);
}
return this.i_column_resize;
}
WindowColumn.prototype.getColumn=function() {
if (this.i_column==undefined) {
this.i_column=document.createElement('TD');
this.i_column.vAlign="top";
this.i_column.align="left";
this.i_column.className="WindowColumn";
for (var x=0; x < this.windows().length; x++) {
this.i_column.appendChild(this.windows(x).getWindow());
if (x < this.windows().length - 1) {
this.i_column.appendChild(this.windows(x).getWindowResize());		
}
}
}
return this.i_column;
}
WindowColumn.prototype.resizeWindow=function(obj, diff) {
var adjustWin=Array();
var availH=this.height() - ((this.windows().length - 1) * WindowManager.vertical_resize_bar_width);
var useObj;
var lastFound;
for (var x=0; x < this.windows().length; x++) {
if (this.windows(x)==obj) {
if (this.windows(x).minimized() || this.windows(x).static_height()) {
useObj=lastFound;
}
else {
useObj=obj;
}
}
if (!this.windows(x).minimized() && !this.windows(x).static_height()) {
adjustWin[adjustWin.length]=this.windows(x);
lastFound=this.windows(x);
}
else {
availH-=(typeof this.windows(x).titleBar()!="undefined" ? this.windows(x).titleBar().height() : 0)+2+this.windows(x).static_height_size();
}
}
var dm=new DimensionProcessor(availH);
for (var x=0; x < adjustWin.length; x++) {
var reqHeight=(adjustWin[x]==useObj ? (adjustWin[x].effectiveHeight()+diff) : 0);
if (adjustWin[x].lockHeight()) {
dm.addNode(adjustWin[x].minimumHeight(), adjustWin[x].height(), 0, reqHeight);
}
else {
dm.addNode(adjustWin[x].minimumHeight(), 0, (parseInt(adjustWin[x].height()) / 100), reqHeight);
}
}
dm.normalize();
var response=dm.calculate();
for (var x=0; x < adjustWin.length; x++) {
if (adjustWin[x].lockHeight()) {
adjustWin[x].height(response.nodes[x].value);
}
else {
adjustWin[x].height(Math.floor(response.nodes[x].ratio * 100)+"%");
}
}
this.update();
}
WindowColumn.prototype.update=function(nestedCall) {
var adjustWin=Array();
var availH=this.height() - ((this.windows().length - 1) * WindowManager.vertical_resize_bar_width);
for (var x=0; x < this.windows().length; x++) {
if (!this.windows(x).minimized() && !this.windows(x).static_height()) {
adjustWin[adjustWin.length]=this.windows(x);
}
else {
availH-=(typeof this.windows(x).titleBar()!="undefined" ? this.windows(x).titleBar().height() : 0)+2+this.windows(x).static_height_size();
}
}
var dm=new DimensionProcessor(availH);
for (var x=0; x < adjustWin.length; x++) {
if (adjustWin[x].lockHeight()) {
dm.addNode(adjustWin[x].minimumHeight(), adjustWin[x].height(), 0, 0);			
}
else {
dm.addNode(adjustWin[x].minimumHeight(), 0, (parseInt(adjustWin[x].height()) / 100), 0);
}
}
dm.normalize();
var response=dm.calculate();
for (var x=0; x < adjustWin.length; x++) {
adjustWin[x].effectiveHeight(response.nodes[x].value);
}
if (nestedCall!=true) {
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.WindowColumn.js");
var ENABLE_MESSAGE_LOGGING=false;
var ENABLE_MESSAGE_DATESTAMP=true;
var ENABLE_MESSAGE_TIMESTAMP=true;
function WindowManager(width, height) {
this.i_width=width;			
this.i_height=height;			
this.i_allow_resize=true;		
this.i_allow_move=true;		
this.i_allow_undock=true;		
this.i_allow_static=true;		
this.i_columns=Array();		
}
WindowManager.vertical_resize_bar_width=5;
WindowManager.horizontal_resize_bar_height=5;
WindowManager.window_border_width=2;
WindowManager.message=function(message) {
if (ENABLE_MESSAGE_LOGGING) {
var timeStamp="";
if (ENABLE_MESSAGE_TIMESTAMP || ENABLE_MESSAGE_DATESTAMP) {
var ts=new Date();
if (ENABLE_MESSAGE_DATESTAMP) {
timeStamp+=(ts.getMonth()+1)+"/"+ts.getDate()+"/"+(ts.getYear()+1900);
}
if (ENABLE_MESSAGE_DATESTAMP && ENABLE_MESSAGE_TIMESTAMP) {
timeStamp+=" ";
}
if (ENABLE_MESSAGE_TIMESTAMP) {
timeStamp+=(ts.getHours() < 10 ? '0' : "")+ts.getHours()+":"+(ts.getMinutes() < 10 ? '0' : "")+ts.getMinutes()+":"+(ts.getSeconds() < 10 ? '0' : "")+ts.getSeconds()+"."+(ts.getMilliseconds() < 1000 ? '0' : "")+(ts.getMilliseconds() < 100 ? '0' : "")+(ts.getMilliseconds() < 10 ? '0' : "")+ts.getMilliseconds();
}
}
console.log("WindowManager"+(timeStamp!="" ? '['+timeStamp+']' : "")+": "+message);
return true;
}
return false;
}
WindowManager.prototype.onresize=null;
WindowManager.prototype.onwmresize=null;
WindowManager.prototype.captureAll=function(state, exception) {
if (state!=undefined) {
if (state!=this.i_capture) {
this.i_capture=state;
if (state==true) {
this.i_cap_ex=null;
if (exception!=undefined) {
if (this.i_capture_divs==undefined) {
this.i_capture_divs=Array();
for (var x=0; x < 4; x++) {
this.i_capture_divs[x]=document.createElement('DIV');
this.i_capture_divs[x].className="WindowManager_capture_div";
this.i_capture_divs[x].onselectstart=function() { return false; }
this.i_capture_divs[x].innerHTML="&nbsp;";
document.body.appendChild(this.i_capture_divs[x]);
}
}
this.i_capture_divs[0].style.left=0+"px";
this.i_capture_divs[0].style.top=0+"px";
this.i_capture_divs[0].style.width=CursorMonitor.browserWidth()+"px";
this.i_capture_divs[0].style.height=exception.top()+"px";
this.i_capture_divs[1].style.left=0+"px";
this.i_capture_divs[1].style.top=exception.top()+"px";
this.i_capture_divs[1].style.width=exception.left()+"px";
this.i_capture_divs[1].style.height=exception.effectiveHeight()+"px";
this.i_capture_divs[2].style.left=(exception.left()+exception.effectiveWidth())+"px";
this.i_capture_divs[2].style.top=exception.top()+"px";
this.i_capture_divs[2].style.width=(CursorMonitor.browserWidth() - exception.effectiveWidth() - exception.left())+"px";
this.i_capture_divs[2].style.height=exception.effectiveHeight()+"px";
this.i_capture_divs[3].style.left=0+"px";
this.i_capture_divs[3].style.top=(exception.top()+exception.effectiveHeight())+"px";
this.i_capture_divs[3].style.width=CursorMonitor.browserHeight()+"px";
this.i_capture_divs[3].style.height=(CursorMonitor.browserHeight() - exception.top() - exception.effectiveHeight())+"px";
this.i_cap_ex=exception;
}
else {
if (this.i_capture_div==undefined) {
this.i_capture_div=document.createElement('DIV');
this.i_capture_div.innerHTML="&nbsp;";
this.i_capture_div.className="WindowManager_capture_div";
this.i_capture_div.onselectstart=function() {
return false;
}
}
document.body.appendChild(this.i_capture_div);
}
}
else {
if (this.i_cap_ex!=undefined) {
for (var x=0; x < 4; x++) {
try { 
document.body.removeChild(this.i_capture_divs[x]);
} catch (e) { }
}
}
else {
if (this.i_capture_div!=undefined) {
try {
document.body.removeChild(this.i_capture_div);
} catch (e) { }
}
}
}
}
}
return this.i_capture;
}
WindowManager.prototype.columns=function(index) {
if (index!=undefined) {
return this.i_columns[index];
}
return this.i_columns;
}
WindowManager.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_manager!=undefined) {
this.i_manager.style.width=width;
}
if (this.onresize!=undefined) {
this.onresize(this.width(), this.height());
}
if(this.onwmresize!=null) {
var o={
type: "wmresize",
width: this.width(),
height: this.height()
};
this.onwmresize(o);
}
}
return this.i_width;
}
WindowManager.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_manager!=undefined) {
this.i_manager.style.height=(height > 0 ? height : 0)+"px";
}
if (this.onresize!=undefined) {
this.onresize(this.width(), this.height());
}
if(this.onwmresize!=null) {
var o={
type: "wmresize",
width: this.width(),
height: this.height()
};
this.onwmresize(o);
}
}
return this.i_height;
}
WindowManager.prototype.left=function() {
var x_pos=0;
chainUp=this.getManager();
while(chainUp!=null)
{
x_pos+=parseInt(chainUp.offsetLeft);
chainUp=chainUp.offsetParent;
}
return x_pos;
}
WindowManager.prototype.top=function() {
var y_pos=0;
chainUp=this.getManager();
while(chainUp!=null)
{
y_pos+=parseInt(chainUp.offsetTop);
chainUp=chainUp.offsetParent;
}
return y_pos;
}
WindowManager.prototype.allowStatic=function(state) {
if (state!=undefined) {
this.i_allow_static=state;
}
return this.i_allow_static;
}
WindowManager.prototype.allowResize=function(state) {
if (state!=undefined) {
this.i_allow_resize=state;
}
return this.i_allow_resize;
}
WindowManager.prototype.allowMove=function(state) {
if (state!=undefined) {
this.i_allow_move=state;
}
return this.i_allow_move;
}	
WindowManager.prototype.allowUndock=function(state) {
if (state!=undefined) {
this.i_allow_undock=state;
}
return this.i_allow_undock;
}
WindowManager.prototype.insertColumn=function(column, insertBefore) {
WindowManager.message("Inserting column"+(insertBefore!=undefined ? " before column" : " as append"));
if (insertBefore!=undefined) {
for (var x=0; x < this.columns().length; x++) {
if (this.columns(x)==insertBefore) {
this.i_columns.splice(x, 0, column);
column.i_parent_manager=this;
for (var z=0; z < column.windows().length; z++) {
column.windows(z).i_parent_manager=this;
}
if (this.i_manager!=undefined) {
this.i_manager_row.insertBefore(column.getColumn(), insertBefore.getColumn());
this.i_manager_row.insertBefore(column.getColumnResize(), insertBefore.getColumn());
}
return column;
}
}
}
this.i_columns[this.i_columns.length]=column;
column.i_parent_manager=this;
for (var z=0; z < column.windows().length; z++) {
column.windows(z).i_parent_manager=this;
}
if (this.i_manager!=undefined) {
if (this.i_columns.length > 1) {
this.i_manager_row.appendChild(this.i_columns[this.i_columns.length - 2].getColumnResize());
}
this.i_manager_row.appendChild(column.getColumn());
}
return column;
}
WindowManager.prototype.removeColumn=function(column) {
WindowManager.message("Removing column");
for (var x=0; x < this.columns().length; x++) {
if (this.columns(x)==column) {
if (this.i_manager!=undefined) {
try {
this.i_manager_row.removeChild(column.getColumn());
if (x!=this.columns().length - 1) {
this.i_manager_row.removeChild(column.getColumnResize());
}
else {
if (this.columns().length > 1) {
this.i_manager_row.removeChild(this.columns(x - 1).getColumnResize());
}
}
} catch (e) { }
}
this.i_columns.splice(x, 1);
column.i_parent_manager=null;
for (var z=0; z < column.windows().length; z++) {
column.windows(z).i_parent_manager=null;
}
if (this.columns().length==1) {
try {
this.i_manager_row.removeChild(this.columns(0).getColumnResize());
} catch (e) { }
}
}
}
}
WindowManager.getResizeBar=function() {
if (WindowManager.i_resize_phantom==undefined) {
WindowManager.i_resize_phantom=document.createElement('DIV');
WindowManager.i_resize_phantom.innerHTML+="&nbsp;";
WindowManager.i_resize_phantom.className="WindowManager_phantom";
}
return WindowManager.i_resize_phantom;
}
WindowManager.prototype.getManager=function() {
if (this.i_manager==undefined) {
this.i_manager=document.createElement('TABLE');
this.i_manager.border=0;
this.i_manager.cellPadding=0;
this.i_manager.cellSpacing=0;
this.i_manager.className="WindowManager";
this.i_manager.style.width=this.width();
this.i_manager.style.height=this.height();
this.i_manager_body=document.createElement('TBODY');
this.i_manager.appendChild(this.i_manager_body);
this.i_manager_row=document.createElement('TR');
this.i_manager_body.appendChild(this.i_manager_row);
for (var x=0; x < this.columns().length; x++) {
this.i_manager_row.appendChild(this.columns(x).getColumn());
if (x < this.columns().length - 1) {
this.i_manager_row.appendChild(this.columns(x).getColumnResize());		
}
}
}
return this.i_manager;
}
WindowManager.prototype.moveWindow=function(win, column_index, window_index, window_position, window_before) {
if (win.parentManager()==this) {
for (var x=0; x < this.columns().length; x++) {
for (var z=0; z < this.columns(x).windows().length; z++) {
if (this.columns(x).windows(z)==win) {
if (column_index >=0) {
if (column_index==x && ((window_index==z))) {
return false;
}
}
var orig_col=this.columns(x);
var dest_col;
if (column_index >=0 && window_before!=true) {
dest_col=this.columns(column_index);
}
else {
dest_col=new WindowColumn();
}
var dest_wins=Array();
for (var m=0; m < dest_col.windows().length; m++) {
dest_wins[m]=dest_col.windows(m);
}
var prefix_column=this.columns(column_index);
orig_col.removeWindow(win);
WindowManager.message('dropping '+win.name()+' '+(window_before==true ? 'before:' : 'in:')+' '+column_index+" out of "+this.columns().length);
if (column_index >=0 && window_before!=true) {
if (window_position < 0) {
dest_col.insertWindow(win, dest_wins[window_index]);
}
else {
if (dest_col.windows().length > window_index+1) {
dest_col.insertWindow(win, dest_wins[window_index+1]);
}
else {
dest_col.insertWindow(win);
}
}
}
else {
dest_col.insertWindow(win);
if (window_before==true) { 
this.insertColumn(dest_col, prefix_column);
}
else if (column_index==-1) {
this.insertColumn(dest_col, this.columns(0));
}
else {
this.insertColumn(dest_col);
}
}
if (orig_col.windows().length==0 && column_index!=x) {
this.removeColumn(orig_col);
}
this.update();
return true;
}
}
}
}
else if (win.parentManager()==undefined) {
}
else {
alert('The window cannot be moved to the new location.');
}
return true;
}
WindowManager.prototype.resizeColumn=function(column, diff) {
var dm=new DimensionProcessor(this.width() - ((this.columns().length - 1) * WindowManager.vertical_resize_bar_width));
for (var x=0; x < this.columns().length; x++) {
var lowMinimum=this.columns(x).minimumWidth();
var reqWidth=(this.columns(x)==column ? (this.columns(x).effectiveWidth()+diff) : 0);
if (this.columns(x).windows(0).lockWidth()) {
dm.addNode(lowMinimum, this.columns(x).windows(0).width(), 0, reqWidth);
}
else {
dm.addNode(lowMinimum, 0, (parseInt(this.columns(x).windows(0).width()) / 100), reqWidth);
}
}
dm.normalize();
var response=dm.calculate();
for (var x=0; x < this.columns().length; x++) {
if (this.columns(x).width().indexOf!=undefined && this.columns(x).width().indexOf('%') > -1) {
this.columns(x).width(Math.floor(response.nodes[x].ratio * 100)+"%");
}
else {
this.columns(x).width(response.nodes[x].value);
}
}
this.update();
}
WindowManager.prototype.exportTemporaryDataNodes=function(globals) {
var ret=Array();
for (var x=WindowObject.i_undock_order.length - 1; x>=0; x--) {
var w=WindowObject.i_undock_order[x];
if (globals==w.global() && w.temporary()) {
var win=new DataNode("pod");
win.attribute("id", w.id());
win.attribute("width", w.width());
win.attribute("height", w.height());
win.attribute("ewidth", w.effectiveWidth());
win.attribute("eheight", w.effectiveHeight());
win.attribute("minimized", w.minimized());
win.attribute("order", x);
win.attribute("left", w.left());
win.attribute("top", w.top());
win.attribute("type", "application");
ret[ret.length]=win;
}
}
return ret;
}	
WindowManager.prototype.importTemporaryDataNodes=function(nodes) {
for (var x=WindowObject.i_undock_order.length - 1; x>=0; x--) {
if(WindowObject.i_undock_order[x].temporary() &&
WindowObject.i_undock_order[x].closeOnImport()) {
WindowObject.i_undock_order[x].close(true);  
}
}
for (var x=0; x < nodes.length; x++) {
var w=nodes[x];
var wo=WindowObject.getWindowById(w.attribute("id"));
if (wo!=undefined) {
wo.i_redock_manager=this;
wo.i_redock_parent=undefined;
var useW=parseInt(w.attribute("ewidth"));
var useH=parseInt(w.attribute("eheight"));
wo.minimized(w.attribute("minimized")=="true" ? true : false, true);
var nW=w.attribute("width");
var nH=w.attribute("height");
if (nW==undefined) {
nW=wo.defaultWidth();
}
if (nH==undefined) {
nH=wo.defaultHeight();
}
if (nW.indexOf==undefined || nW.indexOf('%') < 0) {
nW=parseInt(nW);
}
if (nH.indexOf==undefined || nH.indexOf('%') < 0) {
nH=parseInt(nH);
}
wo.width(nW);
wo.height(nH);
wo.popWindow(useW, useH, false, true);
wo.left(parseInt(w.attribute("left")));
wo.top(parseInt(w.attribute("top")));
}
else {
console.log('Unable to reload undocked pod with ID: '+w.attribute("id")+'.  It does not exist');
}
}
this.update();
}
WindowManager.prototype.exportGlobalDataNodes=function() {
var ret=Array();
for (var x=WindowObject.i_undock_order.length - 1; x>=0; x--) {
var w=WindowObject.i_undock_order[x];
if (w.global() && !w.temporary()) {
var win=new DataNode("pod");
win.attribute("id", w.id());
win.attribute("width", w.width());
win.attribute("height", w.height());
win.attribute("ewidth", w.effectiveWidth());
win.attribute("eheight", w.effectiveHeight());
win.attribute("minimized", w.minimized());
win.attribute("order", x);
win.attribute("left", w.left());
win.attribute("top", w.top());
win.attribute("type", "application");
ret[ret.length]=win;
}
}
return ret;
}	
WindowManager.prototype.importGlobalDataNodes=function(nodes) {
for (var x=WindowObject.i_undock_order.length - 1; x>=0; x--) {
if (WindowObject.i_undock_order[x].global() && !WindowObject.i_undock_order[x].temporary()) {
WindowObject.i_undock_order[x].close(true);  
}
}
for (var x=0; x < nodes.length; x++) {
var w=nodes[x];
var wo=WindowObject.getWindowById(w.attribute("id"));
if (wo!=undefined) {
wo.i_redock_manager=this;
wo.i_redock_parent=undefined;
var useW=parseInt(w.attribute("ewidth"));
var useH=parseInt(w.attribute("eheight"));
wo.minimized(w.attribute("minimized")=="true" ? true : false, true);
var nW=w.attribute("width");
var nH=w.attribute("height");
if (nW==undefined) {
nW=wo.defaultWidth();
}
if (nH==undefined) {
nH=wo.defaultHeight();
}
if (nW.indexOf==undefined || nW.indexOf('%') < 0) {
nW=parseInt(nW);
}
if (nH.indexOf==undefined || nH.indexOf('%') < 0) {
nH=parseInt(nH);
}
wo.width(nW);
wo.height(nH);
wo.popWindow(useW, useH, false, true);
wo.left(parseInt(w.attribute("left")));
wo.top(parseInt(w.attribute("top")));
}
else {
console.log('Unable to reload undocked pod with ID: '+w.attribute("id")+'.  It does not exist');
}
}
this.update();
}
WindowManager.prototype.exportDataNode=function() {
var conf=new DataNode("application");
for (var x=WindowObject.i_undock_order.length - 1; x>=0; x--) {
var w=WindowObject.i_undock_order[x];
if (!w.global() && !w.temporary()) {
var win=conf.addNode(new DataNode("pod"));
win.attribute("id", w.id());
win.attribute("width", w.width());
win.attribute("height", w.height());
win.attribute("ewidth", w.effectiveWidth());
win.attribute("eheight", w.effectiveHeight());
win.attribute("minimized", (w.minimized()==true ? "true" : "false"));
win.attribute("order", x);
win.attribute("left", w.left());
win.attribute("top", w.top());
win.attribute("type", "application");
}
}
for (var x=0; x < this.columns().length; x++) {
var c=this.columns(x);
var col=conf.addNode(new DataNode("column"));
col.attribute("id", c.i_id);
for (var z=0; z < c.windows().length; z++) { 
var w=c.windows(z);
var win=col.addNode(new DataNode("pod"));
win.attribute("id", w.id());
win.attribute("width", w.width());
win.attribute("height", w.height());
win.attribute("minimized", (w.minimized()==true ? "true" : "false"));
win.attribute("type", "application");
}
}
return conf;
}
WindowManager.prototype.importDataNode=function(node, clear_globals) {
if (typeof node=="string") {
node=DataNode.fromString(node);
if (node==undefined) {
console.log('Unable to import layout, invalid string representation of a data node');
return false;
}
}
for (var x=this.columns().length - 1; x >=0; x--) {
for (var z=this.columns(x).windows().length - 1; z >=0; z--) {
this.columns(x).removeWindow(this.columns(x).windows(z));
}
}
for (var x=WindowObject.i_undock_order.length - 1; x>=0; x--) {
if ((!WindowObject.i_undock_order[x].global() || clear_globals==true) && !WindowObject.i_undock_order[x].temporary()) {
WindowObject.i_undock_order[x].close(true);  
}
}
var cols=node.children("column");
var col_ref=Array();
for (var x=0; x < cols.length; x++) { 
var added=0;
var col=new WindowColumn();
col_ref[cols[x].attribute("id")]=col;
var wins=cols[x].children("pod");
for (var z=0; z < wins.length; z++) {
var w=wins[z];
var wo=WindowObject.getWindowById(w.attribute("id"));
if (wo!=undefined) {
wo.i_docked=true;
var useW=w.attribute("width");
var useH=w.attribute("height");
if (useW.indexOf==undefined || useW.indexOf('%') < 0) {
useW=parseInt(useW);
}
if (useH.indexOf==undefined || useH.indexOf('%') < 0) {
useH=parseInt(useH);
}
wo.width(useW);
wo.height(useH);
wo.minimized(w.attribute("minimized")=="true" ? true : false);
col.insertWindow(wo);
added++;
}
else {
console.log('Unable to reload docked pod with ID: '+w.attribute("id")+'.  It does not exist');
}
}
if (added > 0) {
this.insertColumn(col);
}
}
var wins=node.children("pod");
for (var x=0; x < wins.length; x++) { 
var w=wins[x];
var wo=WindowObject.getWindowById(w.attribute("id"));
if (wo!=undefined) {
wo.i_redock_manager=this;
if (wo.i_redock_parent!=undefined) {
wo.i_redock_parent=col_ref[wo.i_redock_parent.i_id];
}
var useW=parseInt(w.attribute("ewidth"));
var useH=parseInt(w.attribute("eheight"));
wo.minimized(w.attribute("minimized")=="true" ? true : false, true);
var nW=w.attribute("width");
var nH=w.attribute("height");
if (nW==undefined) {
nW=wo.defaultWidth();
}
if (nH==undefined) {
nH=wo.defaultHeight();
}
if (nW.indexOf==undefined || nW.indexOf('%') < 0) {
nW=parseInt(nW);
}
if (nH.indexOf==undefined || nH.indexOf('%') < 0) {
nH=parseInt(nH);
}
wo.width(nW);
wo.height(nH);
wo.popWindow(useW, useH, false, true);
wo.left(parseInt(w.attribute("left")));
wo.top(parseInt(w.attribute("top")));
}
else {
console.log('Unable to reload undocked pod with ID: '+w.attribute("id")+'.  It does not exist');
}
}
this.update();
}
WindowManager.prototype.update=function() {
var dm=new DimensionProcessor(this.width() - ((this.columns().length - 1) * WindowManager.vertical_resize_bar_width));
for (var x=0; x < this.columns().length; x++) {
var lowMinimum=this.columns(x).minimumWidth();
if (this.columns(x).windows().length > 0) {
if (this.columns(x).windows(0).lockWidth()) {
dm.addNode(lowMinimum, this.columns(x).windows(0).width(), 0, 0);
}
else {
dm.addNode(lowMinimum, 0, (parseInt(this.columns(x).windows(0).width()) / 100), 0);
}
}
}
dm.normalize();
var response=dm.calculate();
for (var x=0; x < this.columns().length; x++) {
for (var z=0; z < this.columns(x).windows().length; z++) {
this.columns(x).windows(z).effectiveWidth(response.nodes[x].value);
}
this.columns(x).update(true);
}
var screen_width=CursorMonitor.browserWidth() - WindowObject.minimum_showing;
var screen_height=CursorMonitor.browserHeight() - WindowObject.minimum_showing;
if(screen_width < 0) {
screen_width=0;
}
if(screen_height < 0) {
screen_height=0;
}
for(var x=0; x < WindowObject.i_window_list.length;++x) {
var window_obj=WindowObject.i_window_list[x];
if(!window_obj.docked()) {
if(window_obj.top() > screen_height) {
window_obj.top(screen_height);
}
if(window_obj.left() > screen_width) {
window_obj.left(screen_width);
}
}
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.WindowManager.js");
function WindowObject(id, name, width, height, titleBarFactory) {
this.superConstructor(id, name, width, height, titleBarFactory);
}
WindowObject.prototype.superConstructor=function(id, name, width, height, titleBarFactory) {
if (WindowObject.i_window_ref[id]!=undefined) {
}
this.i_id=id;			
this.i_name=name;		
this.i_width=width;		
this.i_height=height;		
this.i_effective_width=width;		
this.i_effective_height=height;	
if (width.indexOf==undefined && height.indexOf==undefined) {
this.i_default_width=width;
this.i_default_height=height;
}
this.i_minimized=false;
this.i_static_height=false;
this.i_static_height_val=0;
this.i_lock_width=true;	
this.i_lock_height=true;	
this.i_modal=false;		
if (this.i_width.indexOf && this.i_width.indexOf('%') > -1) {
this.i_lock_width=false;
}
if (this.i_height.indexOf && this.i_height.indexOf('%') > -1) {
this.i_lock_height=false;
}
this.i_docked=true;		
this.i_undock_resize=true;	
this.i_enabled=true;		
this.i_always_on_top=false;	
this.i_visible=false;		
this.i_minimum_width=100;	
this.i_minimum_height=100;	
this.i_transparent=false;	
this.i_global=false;		
this.i_temp=false;		
this.i_close_on_import=true;	
this.i_onshow_listeners=Array();
this.i_onhide_listeners=Array();
this.i_onresize_listeners=Array();
if (titleBarFactory!=undefined) {
var tb=titleBarFactory.produce(this);
tb.name(name);
tb.width(width - WindowManager.window_border_width);
tb.i_window=this;
this.titleBar(tb);
}
if (id!=undefined) WindowObject.i_window_ref[id]=this;
WindowObject.i_window_list.push(this);
this.i_tree_node=new LiteDataNode(this.id(), this.name(), this.name(), 1);
this.i_tree_node.i_window=this;
this.i_frame=undefined;
}
WindowObject.modal_window_brand="&nbsp;";
WindowObject.minimum_showing=50;
WindowObject.undock_resize_bar_height=5;
WindowObject.undock_resize_bar_width=5;
WindowObject.default_width=300;
WindowObject.default_height=200;
WindowObject.i_window_ref=Array();
WindowObject.i_window_list=Array();
WindowObject.i_undock_order=Array();
WindowObject.prototype.onclose=function() { return true; }
WindowObject.prototype.onresize=function(width, height) { }
WindowObject.prototype.oncontentresize=null;
WindowObject.prototype.ondock=function(state) { }
WindowObject.prototype.onshow=function() { }
WindowObject.prototype.onhide=function() { }
WindowObject.getWindowById=function(id) {
return WindowObject.i_window_ref[id];
}
WindowObject.deleteRef=function(win) {
for (var i=WindowObject.i_window_list.length - 1; i > -1; --i) {
if (WindowObject.i_window_list[i]==win) {
WindowObject.i_window_list.splice(i,1);
}
}
for (var w in WindowObject.i_window_ref) {
if (WindowObject.i_window_ref[w]==win) {
if (!delete WindowObject.i_window_ref[w]) {
WindowObject.i_window_ref[w]=undefined;
}
}
}
}
WindowObject.movable=function(state) {
if (state!=undefined) {
WindowObject.i_movable=state;
}
return (WindowObject.i_movable==undefined ? true : WindowObject.i_movable);
}
WindowObject.getMoveWindow=function(win) {
if (WindowObject.drag_window==undefined) {
WindowObject.drag_window=document.createElement('DIV');
WindowObject.drag_window.className="WindowObject_move";
}
if (win!=undefined) {
WindowObject.drag_window.innerHTML=win.name();
}
return WindowObject.drag_window;
}
WindowObject.prototype.id=function(id) {
if (id!=undefined) {
WindowObject.i_window_ref[this.i_id]=null;
this.i_id=id;
WindowObject.i_window_ref[id]=this;
}
return this.i_id;
}
WindowObject.prototype.global=function(state) {
if (state!=undefined) {
this.i_global=state;
}
return this.i_global;
}
WindowObject.prototype.temporary=function(state) {
if (state!=undefined) {
this.i_temp=state;
}
return this.i_temp;
}
WindowObject.prototype.closeOnImport=function(state) {
if(state!=undefined) {
this.i_close_on_import=state;
}
return this.i_close_on_import;
}
WindowObject.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.titleBar()!=undefined) {
this.titleBar().name(name);
}
this.getTreeNode().name(name);
this.getTreeNode().tipText(name);
}
return this.i_name;
}
WindowObject.prototype.parentColumn=function() {
return this.i_parent_column;
}
WindowObject.prototype.parentManager=function() {
return this.i_parent_manager;
}
WindowObject.prototype.transparent=function(state) {
if (state!=undefined) {
this.i_transparent=state;
if (this.i_window!=undefined) {
this.i_window.className="window_manager_window"+(this.transparent() ? "_transparent" : "");
}
if (this.i_content_pane!=undefined) {
this.i_content_pane.style.overflow=(this.transparent() ? "hidden" : "auto");	
}
}
return this.i_transparent;
}
WindowObject.prototype.left=function(left) {
if (left!=undefined) {
if (this.i_float_window!=undefined) {
this.i_float_window.style.left=left+"px";
this.i_float_left=left;
}
}	
if (!this.docked() && this.i_float_left!=undefined) {
return this.i_float_left;
}
var x_pos=0;
chainUp=this.getWindow();
while(chainUp!=null)
{
x_pos+=parseInt(chainUp.offsetLeft);
chainUp=chainUp.offsetParent;
}
return x_pos;
}
WindowObject.prototype.top=function(top) {
if (top!=undefined) {
if (this.i_float_window!=undefined) {
this.i_float_window.style.top=top+"px";
this.i_float_top=top;
}
}
if (!this.docked() && this.i_float_top!=undefined) {
return this.i_float_top;
}
var y_pos=0;
chainUp=this.getWindow();
while(chainUp!=null)
{
y_pos+=parseInt(chainUp.offsetTop);
chainUp=chainUp.offsetParent;
}
return y_pos;
}
WindowObject.prototype.enabled=function(state) {
if (state!=undefined) {
this.i_enabled=state;
}
return this.i_enabled;
}
WindowObject.prototype.alwaysOnTop=function(state) {
if (state!=undefined) {
this.i_always_on_top=state;
}
return this.i_always_on_top;
}
WindowObject.prototype.allowFloatingResize=function(state) {
if (state!=undefined) {
this.i_undock_resize=state;
}
return state;
}
WindowObject.prototype.minimized=function(state, no_update) {
if (state!=undefined) {
if (state!=this.i_minimized) {
this.i_minimized=state;
this.visible(!state);
if (this.titleBar()!=undefined) {
var btns=this.titleBar().buttons();
for (var x=0; x < btns.length; x++) {
if (btns[x].iconCSS()=="IconButton_Minimize" || 
btns[x].iconCSS()=="IconButton_Maximize") {
btns[x].iconCSS(state ? "IconButton_Maximize" : "IconButton_Minimize");
btns[x].tipText(state ? "Maximize Window" : "Minimize Window");
break;
}
}
}
if (this.i_content_pane!=undefined) {
if (state) {
try {
this.i_window.removeChild(this.i_content_pane);
} catch (e) { }
this.i_window.style.height=this.titleBar().height()+"px";
}
else {
this.i_window.appendChild(this.i_content_pane);
}
}
this.effectiveHeight(this.effectiveHeight());
if (this.parentColumn()!=undefined) {
this.parentColumn().update();
}
if (!this.docked()) {				
if (this.i_float_content!=undefined) {
var float=this.getFloatingWindow();
if (this.minimized()) {
float.style.height=(this.titleBar().height()+WindowObject.undock_resize_bar_height)+"px";
this.i_resize_right.style.height=(this.titleBar().height() - WindowObject.undock_resize_bar_height)+"px";
this.i_float_content.style.height=this.titleBar().height()+"px";
this.i_float_holder.style.height=this.titleBar().height()+"px";
}
else {
if(!this.effectiveHeight()) {
this.effectiveHeight(this.minimumHeight());
}
float.style.height=(this.effectiveHeight()+WindowObject.undock_resize_bar_height)+"px";
this.i_resize_right.style.height=(this.effectiveHeight() - WindowObject.undock_resize_bar_height)+"px";
this.i_float_content.style.height=this.effectiveHeight()+"px";
this.i_float_holder.style.height=this.effectiveHeight()+"px";
if(this.top() > CursorMonitor.browserHeight() - WindowObject.minimum_showing) {
this.top(CursorMonitor.browserHeight() - WindowObject.minimum_showing);
}
}
}
if (no_update!=true) {
}
}
else {
if (no_update!=true) {
}
}
}
}
return this.i_minimized;
}
WindowObject.prototype.static_height=function(lock, height) {
if(lock!=undefined && height!=undefined) {
this.i_static_height=lock;
this.i_static_height_val=height;
if (this.i_content_pane!=undefined) {
if (lock) {
this.i_window.style.height=(this.titleBar().height()+this.i_static_height_val)+"px";
}
}
this.effectiveHeight(this.effectiveHeight());
if (this.parentColumn()!=undefined) {
this.parentColumn().update();
}
this.effectiveHeight(height);
}
return this.i_static_height;
}
WindowObject.prototype.static_height_size=function() {
if(this.i_static_height && !this.minimized()) {
return this.i_static_height_val;
}else{
return 0;
}
}
WindowObject.prototype.center=function() {
if (!this.docked() || this.parentManager()==undefined) {
var l=(CursorMonitor.browserWidth() - this.effectiveWidth()) / 2;
var t=(CursorMonitor.browserHeight() - this.effectiveHeight()) / 2;
this.left((l>4)?l:5);
this.top((t>4)?t:5);
}
return true;
}
WindowObject.prototype.modal=function(state) {
if (state!=undefined) {
if (state!=this.i_modal) {
this.i_modal=state;
if (state==true) {
if (this.i_modal_cover==undefined) {
this.i_modal_cover=document.createElement('DIV');
this.i_modal_cover.className="WindowObject_modal_cover";
this.i_modal_cover.style.top=0;
this.i_modal_cover.style.left=0;
var l=document.createElement('DIV');
if(WindowObject.modal_window_brand!=undefined) {
l.innerHTML="<i>"+WindowObject.modal_window_brand+"</i>";
} else {
l.innerHTML="&nbsp;";
}
this.i_modal_cover.appendChild(l);
this.i_modal_active=false;
}
if (!this.docked()) {
this.i_modal_active=true;
document.body.appendChild(this.i_modal_cover);
document.body.appendChild(this.getFloatingWindow());
}
}
else {
try {
if (this.i_modal_cover!=undefined) {
document.body.removeChild(this.i_modal_cover);
this.i_modal_active=false;
}
} catch (e) { }
}
}
}
return this.i_modal;
}
WindowObject.prototype.popWindow=function(width, height, centered, no_update) {
this.visible(true);
this.effectiveWidth(width);
this.effectiveHeight(height);
this.docked(false, no_update);
if (centered) {
this.center();
}
if (this.onresize!=undefined) {
this.onresize(this.effectiveWidth(), this.effectiveHeight());
for(var x=0; x < this.i_onresize_listeners.length; x++) {
var listener=this.i_onresize_listeners[x];
listener();
}
if (this.oncontentresize!=undefined) {
var o=new Object();
o.type="contentresize";
this.oncontentresize(o);
}
}
}
WindowObject.prototype.defaultWidth=function(width) {
if (width!=undefined) {
this.i_default_width=width;
}
return (this.i_default_width!=undefined ? this.i_default_width : WindowObject.default_width);
}
WindowObject.prototype.defaultHeight=function(height) {
if (height!=undefined) {
this.i_default_height=height;
}
return (this.i_default_height!=undefined ? this.i_default_height : WindowObject.default_height);
}
WindowObject.prototype.docked=function(state, no_update) {
if (state!=undefined) {
if (state!=this.i_docked) {
if (state==true) {
if (this.i_redock_parent!=undefined || this.i_redock_manager!=undefined) {
this.i_docked=state;
if (this.i_redock_parent!=undefined && this.i_redock_parent.parentManager()!=undefined) {
this.i_redock_parent.insertWindow(this);
}
else {
var c=new WindowColumn();
c.insertWindow(this);
if (this.i_redock_manager.columns().length > 0) {
this.i_redock_manager.insertColumn(c, this.i_redock_manager.columns(0));
}
else {
this.i_redock_manager.insertColumn(c);
}
}
this.parentManager().update();
this.i_redock_parent=undefined;
this.i_redock_manager=undefined;
document.body.removeChild(this.getFloatingWindow());
if (this.ondock) {
this.ondock(state);
}
if (this.i_modal_active==true) {
try {
document.body.removeChild(this.i_modal_cover);
this.i_modal_active=false;
} catch (e) { }
}
for (var x=0; x < WindowObject.i_undock_order.length; x++) {
if (WindowObject.i_undock_order[x]==this) {
WindowObject.i_undock_order.splice(x, 1);
break;
}
}
}
else {
alert('This window has been orphaned and may not be redocked.');
}
}
else {
this.i_docked=state;
var oldTop=this.top();
var oldLeft=this.left();
if (this.parentColumn()!=undefined) {
this.i_redock_parent=this.parentColumn();
this.i_redock_manager=this.parentManager();
this.parentColumn().removeWindow(this);
this.i_redock_manager.update();
}
var float=this.getFloatingWindow();
this.i_float_content.appendChild(this.getWindow());
float.style.width=(this.effectiveWidth()+WindowObject.undock_resize_bar_width)+"px";
if (this.minimized()) {
float.style.height=(this.titleBar().height()+WindowObject.undock_resize_bar_height)+"px";
this.i_resize_right.style.height=(this.titleBar().height() - WindowObject.undock_resize_bar_height)+"px";
this.i_float_content.style.height=this.titleBar().height()+"px";
this.i_float_holder.style.height=this.titleBar().height()+"px";
}
else {
float.style.height=(this.effectiveHeight()+WindowObject.undock_resize_bar_height)+"px";
this.i_resize_right.style.height=(this.effectiveHeight() - WindowObject.undock_resize_bar_height)+"px";
this.i_float_content.style.height=this.effectiveHeight()+"px";
this.i_float_holder.style.height=this.effectiveHeight()+"px";
}
this.i_resize_right.style.width=WindowObject.undock_resize_bar_width+"px";
this.i_resize_right.style.marginTop=WindowObject.undock_resize_bar_height+"px";
this.i_resize_bottom.style.height=WindowObject.undock_resize_bar_height+"px";
this.i_resize_bottom.style.marginLeft=WindowObject.undock_resize_bar_width+"px";
if (this.i_redock_parent!=undefined) {
float.style.top=(oldTop - 5)+"px";
float.style.left=(oldLeft - 5)+"px";
}
if (this.ondock) {
this.ondock(state);
}
if (this.modal() && this.i_modal_active!=true) {
this.i_modal_cover.style.left=0;
this.i_modal_cover.style.top=0;
this.i_modal_active=true;
document.body.appendChild(this.i_modal_cover);
}
if (this.alwaysOnTop()) {
WindowManager.message("Adding undocked window "+this.name()+" to the top of the window order (always on top)");
WindowObject.i_undock_order[WindowObject.i_undock_order.length]=this;
document.body.appendChild(float);
}
else {
var added=false;
for (var x=WindowObject.i_undock_order.length - 1; x >=0; x--) {
if (!WindowObject.i_undock_order[x].alwaysOnTop()) {
if (x!=WindowObject.i_undock_order.length - 1) {
WindowManager.message('Adding undocked window '+this.name()+' before '+WindowObject.i_undock_order[x+1].name()+' in window order');
document.body.insertBefore(float, WindowObject.i_undock_order[x+1].getFloatingWindow());
WindowObject.i_undock_order.splice(x+1, 0, this);
}
else {
WindowManager.message('Adding undocked window '+this.name()+' to top of window order');
document.body.appendChild(float);
WindowObject.i_undock_order[WindowObject.i_undock_order.length]=this;
}
added=true;
break;
}
}
if (!added) {
if (WindowObject.i_undock_order.length > 0) {
WindowManager.message('Adding undocked window '+this.name()+' before '+WindowObject.i_undock_order[0].name()+' in window order');
document.body.insertBefore(float, WindowObject.i_undock_order[0].getFloatingWindow());
WindowObject.i_undock_order.splice(0, 0, this);
}
else {
WindowManager.message('Adding undocked window '+this.name()+' to top of window order');
WindowObject.i_undock_order[WindowObject.i_undock_order.length]=this;
document.body.appendChild(float);	
}
}
}
}
if (no_update!=true) {
}
}
}
return this.i_docked;
}
WindowObject.prototype.lockWidth=function() {
return this.i_lock_width;
}
WindowObject.prototype.lockHeight=function() {
return this.i_lock_height;
}
WindowObject.prototype.minimumWidth=function(width) {
if (width!=undefined) {
this.i_minimum_width=width;
}
return this.i_minimum_width;
}
WindowObject.prototype.minimumHeight=function(height) {
if (height!=undefined) {
this.i_minimum_height=height;
}
return this.i_minimum_height;
}
WindowObject.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
WindowManager.message("set width for "+this.name()+" to "+width);
if (this.i_width.indexOf && this.i_width.indexOf('%') > -1) {
this.i_lock_width=false;
}
else {
this.i_lock_width=true;
}
}
return this.i_width;
}
WindowObject.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
WindowManager.message("set height for "+this.name()+" to "+height);
if (this.i_height.indexOf && this.i_height.indexOf('%') > -1) {
this.i_lock_height=false;
}
else {
this.i_lock_height=true;
}
}
return this.i_height;
}
WindowObject.prototype.isOpen=function() {
if (!this.docked() && this.parentManager()==undefined) {
return true;
}
return false;
}
WindowObject.prototype.close=function(no_update, override) {
var allow=true;
if (override!=true && this.onclose!=undefined) {
var o=new Object();
o.type="close";
o.window=this;
allow=this.onclose(o);		
if (o.cancelClose==true) {
allow=false;
}
}
if (allow!=false) {	
this.visible(false);
if (this.docked()) {
var pm=this.parentManager();
if (this.parentColumn()!=undefined) {
this.parentColumn().removeWindow(this);
}
if (pm!=undefined) {
pm.update();
}
}
else {
document.body.removeChild(this.getFloatingWindow());
}
for (var x=0; x < WindowObject.i_undock_order.length; x++) {
if (WindowObject.i_undock_order[x]==this) {
WindowObject.i_undock_order.splice(x, 1);
break;
}
}
if (this.i_docked==false) {
this.i_docked=true;
if (this.ondock) {
this.ondock(true);
}
}
try {
if (this.i_modal_cover!=undefined) {
document.body.removeChild(this.i_modal_cover);
this.i_modal_active=false;
}
} catch (e) { }
if (no_update!=true) {
}
}
return true;
}
WindowObject.prototype.effectiveWidth=function(width) {
if (width!=undefined) {
if (this.i_effective_width!=width) {
WindowManager.message("set effective width for "+this.name()+" to "+width);
this.i_effective_width=width;
if (this.i_window!=undefined) {
this.i_content_pane.style.width=this.effectiveWidth() - WindowManager.window_border_width;
this.i_window.style.width=width;
if (!this.docked()) {
var float=this.getFloatingWindow();
float.style.width=(this.effectiveWidth()+WindowObject.undock_resize_bar_width)+"px";
}
}
if (this.titleBar()!=undefined) {
this.titleBar().width(width - WindowManager.window_border_width);
}
if (this.onresize!=undefined) {
this.onresize(this.effectiveWidth(), this.effectiveHeight());
for(var x=0; x < this.i_onresize_listeners.length; x++) {
var listener=this.i_onresize_listeners[x];
listener();
}
}
if (this.oncontentresize!=undefined) {
var o=new Object();
o.type="contentresize";
this.oncontentresize(o);
}
}
}
return this.i_effective_width;
}
WindowObject.prototype.effectiveHeight=function(height) {
if (height!=undefined) {
var old=this.i_effective_height;
WindowManager.message("set effective height for "+this.name()+" to "+height);
if(this.static_height()) {
this.i_effective_height=this.i_static_height_val+(this.titleBar()!=undefined ? this.titleBar().height() : 0);
}else{
this.i_effective_height=height;
}
if (!this.minimized() && this.i_window!=undefined) {
this.i_content_pane.style.height=this.effectiveHeight() - (this.titleBar()!=undefined ? this.titleBar().height() : 0) - WindowManager.window_border_width;
if(this.static_height()) {
this.i_window.style.height=this.i_static_height_val+(this.titleBar()!=undefined ? this.titleBar().height() : 0);
}else{
this.i_window.style.height=height;
}
if (!this.docked()) {
var float=this.getFloatingWindow();
float.style.height=(this.effectiveHeight()+WindowObject.undock_resize_bar_height)+"px";
this.i_float_holder.style.height=this.effectiveHeight()+"px";
this.i_resize_right.style.height=(this.effectiveHeight() - WindowObject.undock_resize_bar_height)+"px";
this.i_float_content.style.height=this.effectiveHeight()+"px";
}
}
if (this.onresize!=undefined) {
this.onresize(this.effectiveWidth(), this.effectiveHeight());
for(var x=0; x < this.i_onresize_listeners.length; x++) {
var listener=this.i_onresize_listeners[x];
listener();
}
}
if (this.oncontentresize!=undefined) {
var o=new Object();
o.type="contentresize";
this.oncontentresize(o);
}
}
return this.i_effective_height;
}
WindowObject.prototype.titleBar=function(titleBar) {
if (titleBar!=undefined) {
this.i_title_bar=titleBar;
this.i_title_bar.i_window=this;
if (this.i_window_title_holder!=undefined) {
this.i_window_title_holder.style.height=this.i_title_bar().height()+"px";
this.i_window_title_holder.appendChild(this.i_title_bar.getTitleBar());
}
}
return this.i_title_bar;
}
WindowObject.finishResize=function(e) {
var rep=WindowManager.getResizeBar();
CursorMonitor.removeListener(rep.cur_id);
rep.ev_id.unregister();
var diff=(CursorMonitor.getY() - rep.startY);
WindowManager.message("finish resize on "+this.name());
try {
document.body.removeChild(rep);
} catch (e) { }
this.parentColumn().resizeWindow(this, diff);
this.parentManager().captureAll(false);
SystemCore.layoutManager().notifyChange();
rep.ev_id=null;
rep.cur_id=null;	
}
WindowObject.updateResize=function(x, y) {
var rep=WindowManager.getResizeBar();
rep.style.top=y+"px";	
}
WindowObject.startResize=function(e) {
if (this.docked()==false && this.allowFloatingResize()==false) {
e.returnValue=true;
return true;
}
var rep=WindowManager.getResizeBar();
rep.cur_id=CursorMonitor.addListener(WindowObject.updateResize);
rep.ev_id=EventHandler.register(document.body, "onmouseup", WindowObject.finishResize, this);
WindowManager.message("start resize on "+this.name());
rep.style.width=this.effectiveWidth();
rep.style.height=WindowManager.horizontal_resize_bar_height+"px"; 
rep.style.top=CursorMonitor.getY()+"px";
rep.style.left=this.left()+"px";
rep.startY=CursorMonitor.getY();
this.parentManager().captureAll(true);
document.body.appendChild(rep);
e.returnValue=false;
if(document.all) {
document.selection.empty();
}
}
WindowObject.prototype.getWindowResize=function() {
if (this.i_resize_bar==undefined) {
this.i_resize_bar=document.createElement('DIV');	
this.i_resize_bar.innerHTML="&nbsp;";
this.i_resize_bar.className="WindowObject_resize";
this.i_resize_bar.style.height=WindowManager.horizontal_resize_bar_height;
EventHandler.register(this.i_resize_bar, "onmousedown", WindowObject.startResize, this);
}
return this.i_resize_bar;
}
WindowObject.prototype.contentPane=function() {
if (this.i_content_pane==undefined) {
this.i_content_pane=document.createElement('DIV');
this.i_content_pane.className="WindowObject_content";
this.i_content_pane.style.overflow=(this.transparent() ? "hidden" : "auto");
if (this.i_content_data==undefined) {
this.i_content_data=document.createElement('DIV');
this.i_content_data.innerHTML="&nbsp;";
}
this.i_content_pane.appendChild(this.i_content_data);
}
return this.i_content_pane;
}
WindowObject.prototype.loadContent=function(content_div) {
if (content_div!=undefined) {
if (this.i_content_pane!=undefined) {
if (this.i_content_data!=undefined) {
try {
this.i_content_pane.removeChild(this.i_content_data);
} catch (e) {}
}
if (content_div!=undefined) {
this.i_content_pane.appendChild(content_div);
if (this.onresize!=undefined) {
this.onresize(this.effectiveWidth(), this.effectiveHeight());
for(var x=0; x < this.i_onhide_listeners.length; x++) {
var listener=this.i_onhide_listeners[x];
listener();
}
}
if (this.oncontentresize!=undefined) {
var o=new Object();
o.type="contentresize";
this.oncontentresize(o);
}
}
}
this.i_content_data=content_div;
}
return this.i_content_data;
}
WindowObject.finishMove=function(e) {
var rep=WindowObject.getMoveWindow();
CursorMonitor.removeListener(rep.cur_id);
rep.ev_id.unregister();
var changedPosition=false;
if (this.parentManager()!=undefined) {
this.parentManager().captureAll(false);
}
try {
document.body.removeChild(rep);
} catch (e) { }
if (this.docked()) {
if (rep.i_active) {
changedPosition=this.parentManager().moveWindow(this, rep.i_column_index, rep.i_window_index, rep.i_window_section, rep.i_window_before);
}
} else { 
changedPosition=(rep.startLeft!=this.left() || rep.startTop!=this.top());
}
SystemCore.windowManager().captureAll(false);
if (this.temporary()!=true && changedPosition) {
SystemCore.layoutManager().notifyChange();
}
rep.ev_id=null;
rep.cur_id=null;
rep.i_column_index=null;
rep.i_window_index=null;
rep.i_window_section=null;
rep.i_window_before=null;
rep.i_active=null;
rep.startX=null;
rep.startY=null;
rep.startLeft=null;
rep.startTop=null;
}
WindowObject.updateMove=function(x, y) {
var rep=WindowObject.getMoveWindow();
var thresh=(this.i_thresh==undefined ? 5 : this.i_thresh);
if (!(x > rep.startX+thresh || x < rep.startX - thresh || y > rep.startY+thresh || y < rep.startY - thresh)) {
return;
}
rep.i_active=true;
if (!this.docked()) {
if (rep.init==false) {
rep.init=true;
SystemCore.windowManager().captureAll(true);
}
var diffX=(x - rep.startX);
var diffY=(y - rep.startY);
var newX=(rep.startLeft+diffX);
var newY=(rep.startTop+diffY);
if(newX+this.effectiveWidth() < WindowObject.minimum_showing) {
newX=0 - this.effectiveWidth()+WindowObject.minimum_showing;
} else if(newX > CursorMonitor.browserWidth() - WindowObject.minimum_showing) {
newX=CursorMonitor.browserWidth() - WindowObject.minimum_showing;
}
if(newY < 0) {
newY=0;
} else if(this.minimized() && newY > CursorMonitor.browserHeight() - this.titleBar().height()) {
newY=CursorMonitor.browserHeight() - this.titleBar().height();
} else if(!this.minimized() && newY > CursorMonitor.browserHeight() - WindowObject.minimum_showing) {
newY=CursorMonitor.browserHeight() - WindowObject.minimum_showing;
}
if(document.all) {
document.selection.empty();
}
this.left(newX);
this.top(newY);
}
else {
if (rep.init==false) {
document.body.appendChild(rep);
SystemCore.windowManager().captureAll(true);
rep.init=true;
}
var parentManager=this.parentManager();
var running_left=parentManager.left();
var column_index=-2;
var column_left=0;
var col_before=false;
if (x < running_left) {
column_index=-1;
}
else {
for (var z=0; z < parentManager.columns().length; z++) {
if (z > 0) {
running_left+=WindowManager.vertical_resize_bar_width;
if (x < running_left) {
column_index=z;
col_before=true;
column_left=running_left - WindowManager.vertical_resize_bar_width;
break;
}
}
running_left+=parentManager.columns(z).effectiveWidth();
if (x < running_left) {
column_index=z;
column_left=running_left - parentManager.columns(z).effectiveWidth();
break;
}
}
}
var window_index=-2;
var window_top=0;
var window_section;
if (column_index >=0 && col_before==false) {
rep.style.left=column_left+"px";
rep.style.width=parentManager.columns(column_index).effectiveWidth() - WindowManager.window_border_width;
var running_top=parentManager.top();
if (y < running_top) {
window_index=-1;
}
else {
for (var z=0; z < parentManager.columns(column_index).windows().length; z++) {
var winX=parentManager.columns(column_index).windows(z);
var win_height=(winX.minimized() ? winX.titleBar().height() : winX.effectiveHeight());
window_top=running_top;
running_top+=parseInt(win_height / 2);
if (y < running_top) {
window_section=-1;			
window_index=z;
break;
}
running_top+=parseInt(win_height / 2);
running_top+=WindowManager.vertical_resize_bar_width+(document.all ? 2 : 0);
if (y < running_top) {
window_section=1;			
window_index=z;
break;
}
}
}
if (window_index==-2) {
window_index=parentManager.columns(column_index).windows().length - 1;
window_section=1;
}
if (window_index==-1) {
window_index=0;
window_section=-1;
window_top=parentManager.top();
}
if (window_index >=0) {
var winY=parentManager.columns(column_index).windows(window_index);
var useHeight=parseInt((winY.minimized() ? winY.titleBar().height() : winY.effectiveHeight()) / 2) - WindowManager.window_border_width;
if (window_section > 0) {
rep.style.top=((window_top+((winY.minimized() ? winY.titleBar().height() : winY.effectiveHeight()) - useHeight)) - WindowManager.window_border_width)+"px";
}
else {
rep.style.top=window_top+"px";
}
rep.style.height=useHeight+"px";
rep.style.lineHeight=useHeight+"px";
}
}
else if (col_before==true) {
rep.style.top=parentManager.top();
rep.style.height=(parentManager.height() - WindowManager.window_border_width);
rep.style.width=(WindowManager.window_border_width+40)+"px";
rep.style.lineHeight=(parentManager.height() - WindowManager.window_border_width)+"px";
rep.style.left=(column_left - 20)+"px";
}
else {
rep.style.top=parentManager.top();
rep.style.height=(parentManager.height() - WindowManager.window_border_width);
rep.style.width="70px";
rep.style.lineHeight=(parentManager.height() - WindowManager.window_border_width)+"px";
if (column_index==-2) {
rep.style.left=(((parentManager.left()+parentManager.width()) - 70) - WindowManager.window_border_width)+"px";
}
else {
rep.style.left=parentManager.left()+"px";
}
}
rep.i_column_index=column_index;
rep.i_window_index=window_index;
rep.i_window_section=window_section;
rep.i_window_before=col_before;
if(document.all) {
document.selection.empty();
}
}
}
WindowObject.prototype.dragThreshold=function(thresh) {
if (thresh!=undefined) {
this.i_thresh=thresh;
}
return this.i_thresh;
}
WindowObject.startMove=function(e) {
if (WindowObject.movable()) {
var rep=WindowObject.getMoveWindow(this);
rep.cur_id=CursorMonitor.addListener(WindowObject.updateMove, this);
rep.ev_id=EventHandler.register(document.body, "onmouseup", WindowObject.finishMove, this);
rep.style.top=CursorMonitor.getY()+"px";
rep.style.left=CursorMonitor.getX()+"px";
rep.startX=CursorMonitor.getX();
rep.startY=CursorMonitor.getY();
rep.startLeft=this.left();
rep.startTop=this.top();
rep.init=false;
}
e.returnValue=true;		
return true;
}
WindowObject.finishUndockResize=function(e) {
var rep=WindowObject.i_resize_current_resize;
var diffX=(rep.i_resize_startX - CursorMonitor.getX());
var diffY=(rep.minimized() ? 0 : (rep.i_resize_startY - CursorMonitor.getY()));
var newW=(rep.i_resize_startWidth - diffX);
var newH=(rep.i_resize_startHeight - diffY);
if (newW < rep.minimumWidth()) {
newW=rep.minimumWidth();
}
if (newH < rep.minimumHeight()) {
newH=rep.minimumHeight();
}
rep.effectiveWidth(newW);
if (!rep.minimized()) {
rep.effectiveHeight(newH);
}
CursorMonitor.removeListener(rep.i_resize_cur_id);
rep.i_resize_ev_id.unregister();
var rbox=WindowObject.getResizeDiv();
try {
document.body.removeChild(rbox);
} catch (e) { }
SystemCore.windowManager().captureAll(false);
rep.i_resize_cur_id=null;
rep.i_resize_ev_id=null;
rep.i_resize_startX=null;
rep.i_resize_startY=null;
rep.i_resize_startWidth=null;
rep.i_resize_startHeight=null;
if (rep.temporary()!=true) {
SystemCore.layoutManager().notifyChange();
}
if (!document.all) {
window.getSelection().removeAllRanges();
}
}
WindowObject.updateUndockResize=function(x, y) {
var rep=WindowObject.i_resize_current_resize;
var rbox=WindowObject.getResizeDiv();
var diffX=(rep.i_resize_startX - x);
var diffY=(rep.minimized() ? 0 : (rep.i_resize_startY - y));
var newW=(rep.i_resize_startWidth - diffX);
var newH=(rep.minimized() ? rep.titleBar().height() : (rep.i_resize_startHeight - diffY));
if (newW < rep.minimumWidth()) {
newW=rep.minimumWidth();
}
if (newH < rep.minimumHeight() && !rep.minimized()) {
newH=rep.minimumHeight();
}
rbox.style.height=newH+"px";
rbox.style.width=newW+"px";
rbox.style.display="";
}
WindowObject.getResizeDiv=function() {
if (WindowObject.i_resize_div==undefined) {
WindowObject.i_resize_div=document.createElement('DIV');
WindowObject.i_resize_div.className="WindowObject_resize_div";
}
return WindowObject.i_resize_div;
}
WindowObject.startUndockResize=function(e) {
if (this.i_undock_resize!=false) { 
WindowObject.i_resize_current_resize=this;
var rbox=WindowObject.getResizeDiv();
rbox.style.left=this.left()+"px";
rbox.style.top=this.top()+"px";
rbox.style.width=this.effectiveWidth()+"px";
rbox.style.height=this.effectiveHeight()+"px";
rbox.style.display="none";
document.body.appendChild(rbox);
this.i_resize_cur_id=CursorMonitor.addListener(WindowObject.updateUndockResize);
this.i_resize_ev_id=EventHandler.register(document.body, "onmouseup", WindowObject.finishUndockResize, this);
this.i_resize_startX=CursorMonitor.getX();
this.i_resize_startY=CursorMonitor.getY();
this.i_resize_startWidth=this.effectiveWidth();
this.i_resize_startHeight=this.effectiveHeight();
SystemCore.windowManager().captureAll(true);
}
}
WindowObject.prototype.bringToFront=function() {
if (this.i_float_window!=undefined && !this.docked()) {
var me=this;
setTimeout(function() {
WindowObject.handleWindowOrder.call(me, undefined);
me=undefined;
}, 100);
}
}
WindowObject.handleWindowOrder=function(e) {
var me=this;
for (var x=WindowObject.i_undock_order.length - 1; x >=0; x--) {
if (!WindowObject.i_undock_order[x].alwaysOnTop()) {
if (WindowObject.i_undock_order[x]==me) {
if(e!=undefined) {
e.returnValue=true;
}
return true;
}
break;	
}
}
for (var x=0; x < WindowObject.i_undock_order.length; x++) {
if (WindowObject.i_undock_order[x]==me) {
WindowObject.i_undock_order.splice(x, 1);
break;
}
}
if (me.alwaysOnTop()) {
WindowManager.message("Updating undocked window "+me.name()+" to the top of the window order (always on top)");
WindowObject.i_undock_order[WindowObject.i_undock_order.length]=me;
}
else {
var added=false;
for (var x=WindowObject.i_undock_order.length - 1; x >=0; x--) {
if (!WindowObject.i_undock_order[x].alwaysOnTop()) {
if (x!=WindowObject.i_undock_order.length - 1) {
WindowManager.message('Updating undocked window '+me.name()+' before '+WindowObject.i_undock_order[x+1].name()+' in window order');
WindowObject.i_undock_order.splice(x+1, 0, me);
}
else {
WindowManager.message('Updating undocked window '+me.name()+' to top of window order');
WindowObject.i_undock_order[WindowObject.i_undock_order.length]=me;
}
added=true;
break;
}
}
if (!added) {
if (WindowObject.i_undock_order.length > 0) {
WindowManager.message('Updating undocked window '+me.name()+' before '+WindowObject.i_undock_order[0].name()+' in window order');
WindowObject.i_undock_order.splice(0, 0, me);
}
else {
WindowManager.message('Updating undocked window '+me.name()+' to top of window order');
WindowObject.i_undock_order[WindowObject.i_undock_order.length]=me;
}
}
}
var foundMe=false;
var bfPane=(me.modal() ? me.i_modal_cover : me.getFloatingWindow());
for (var x=0; x < WindowObject.i_undock_order.length; x++) {
if (WindowObject.i_undock_order[x]==me) {
foundMe=true;
}
else if (!foundMe) {
if (WindowObject.i_undock_order[x].modal()) {
document.body.insertBefore(WindowObject.i_undock_order[x].i_modal_cover, bfPane);
}
document.body.insertBefore(WindowObject.i_undock_order[x].getFloatingWindow(), bfPane);
}
else { 
if (WindowObject.i_undock_order[x].modal()) {
document.body.appendChild(WindowObject.i_undock_order[x].i_modal_cover);
}
document.body.appendChild(WindowObject.i_undock_order[x].getFloatingWindow());
}
}
return true;
}
WindowObject.prototype.getFloatingWindow=function() {
if (this.i_float_window==undefined) {
this.i_float_window=document.createElement('DIV');
this.i_float_window.className="WindowObject_float_div";
this.i_float_window.style.width=(this.effectiveWidth()+WindowObject.undock_resize_bar_width)+"px";
EventHandler.register(this.i_float_window, "onmousedown", WindowObject.handleWindowOrder, this);
this.i_float_holder=document.createElement('DIV');
this.i_float_window.appendChild(this.i_float_holder);
this.i_float_content=document.createElement('DIV');
this.i_float_content.className="WindowObject_float_content";
this.i_float_holder.appendChild(this.i_float_content);
this.i_resize_right=document.createElement('DIV');
this.i_resize_right.className="WindowObject_float_right";
this.i_resize_right.innerHTML="&nbsp;";
this.i_float_holder.appendChild(this.i_resize_right);
EventHandler.register(this.i_resize_right, "onmousedown", WindowObject.startUndockResize, this);
this.i_resize_bottom=document.createElement('DIV');
this.i_resize_bottom.className="WindowObject_float_bottom";
this.i_resize_bottom.innerHTML="&nbsp;";
this.i_float_window.appendChild(this.i_resize_bottom);
EventHandler.register(this.i_resize_bottom, "onmousedown", WindowObject.startUndockResize, this);
this.i_holder_open=document.createElement('DIV');
this.i_holder_open.style.fontSize="1px";
this.i_holder_open.innerHTML="&nbsp;";
this.i_float_holder.appendChild(this.i_holder_open);
}
return this.i_float_window;
}
WindowObject.prototype.getWindow=function() {
if (this.i_window==undefined) {
this.i_window=document.createElement('DIV');
this.i_window.className="window_manager_window"+(this.transparent() ? "_transparent" : "");
if (this.effectiveWidth()!=undefined) {
this.i_window.style.width=this.effectiveWidth();
this.i_window.style.height=(this.minimized() ? this.titleBar().height() : this.effectiveHeight());
}
this.i_window_title_holder=document.createElement('DIV');
EventHandler.register(this.i_window_title_holder, "onmousedown", WindowObject.startMove, this);
this.i_window.appendChild(this.i_window_title_holder);
if (this.titleBar()!=undefined) {
this.i_window_title_holder.style.height=this.titleBar().height()+"px";
this.i_window_title_holder.appendChild(this.titleBar().getTitleBar());
}
var cp=this.contentPane();
if (!this.minimized()) {
this.i_window.appendChild(cp);
}
if (this.effectiveWidth()!=undefined) {
this.i_content_pane.style.width=this.effectiveWidth() - WindowManager.window_border_width;
}
if (this.effectiveHeight()!=undefined) {
try {
this.i_content_pane.style.height=this.effectiveHeight() - (this.titleBar()!=undefined ? this.titleBar().height() : 0) - WindowManager.window_border_width;
} catch (e) { 
}
}
}
return this.i_window;
}
WindowObject.prototype.url=function(url, iFrame, name) {
if (url!=undefined) {
if (iFrame==undefined || iFrame==false) {
this.i_frame=undefined;
var me=this;
ResourceManager.request(url, 1, function(d) {
var cDiv=document.createElement('DIV');
cDiv.innerHTML=d;
me.loadContent(cDiv);		
me=null;
url=null;
iFrame=null;
});
}
else {
this.i_frame=document.createElement('IFRAME');
this.i_frame.className="WindowObject_content_iframe";
if(name!=undefined) {
this.i_frame.name=name;
}
this.i_frame.src=url;
this.i_frame.border=0;
this.i_frame.frameBorder=0;
this.loadContent(this.i_frame);
}
}
}
WindowObject.prototype.getTreeNode=function() {
return this.i_tree_node;
}
WindowObject.prototype.visible=function(state) {
if(state!=undefined) {
if(this.i_visible!=state) {
this.i_visible=state;
if(this.i_visible) {
this.onshow();
for(var x=0; x < this.i_onshow_listeners.length; x++) {
var listener=this.i_onshow_listeners[x];
listener();
}
} else {
this.onhide();
for(var x=0; x < this.i_onhide_listeners.length; x++) {
var listener=this.i_onhide_listeners[x];
listener();
}
}
}
}
return this.i_visible;
}
WindowObject.prototype.getFrame=function() {
return this.i_frame;
}
WindowObject.prototype.addOnshowListener=function(listener) {
this.i_onshow_listeners.push(listener);
}
WindowObject.prototype.removeOnshowListener=function(listener) {
for(var x=0; x < this.i_onshow_listeners.length; x++) {
if(this.i_onshow_listeners[x]==listener) {
this.i_onshow_listeners.splice(x, 1);
x--;
}
}
}
WindowObject.prototype.addOnhideListener=function(listener) {
this.i_onhide_listeners.push(listener);
}
WindowObject.prototype.removeOnhideListener=function(listener) {
for(var x=0; x < this.i_onhide_listeners.length; x++) {
if(this.i_onhide_listeners[x]==listener) {
this.i_onhide_listeners.splice(x, 1);
x--;
}
}
}
WindowObject.prototype.addOnresizeListener=function(listener) {
this.i_onresize_listeners.push(listener);
}
WindowObject.prototype.removeOnresizeListener=function(listener) {
for(var x=0; x < this.i_onresize_listeners.length; x++) {
if(this.i_onresize_listeners[x]==listener) {
this.i_onresize_listeners.splice(x, 1);
x--;
}
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.WindowObject.js");
function AttachmentManager(width, username, session_id, quota) {
this.i_width=width;
this.i_quota=(quota!=undefined ? quota : 20971520);
this.i_unm=username;
this.i_sid=session_id;
this.i_custom_error;
this.i_files=Array();
this.i_used=0;
this.i_overflow=false;
this.i_active=true;
AttachmentManager.i_managers[AttachmentManager.i_managers.length]=this;
}
AttachmentManager.i_managers=Array();
AttachmentManager.quotaBoxWidth=150;
AttachmentManager.quotaBoxHeight=25;
AttachmentManager.iconWidth=26;
AttachmentManager.iconHeight=16;
AttachmentManager.stateWidth=16;
AttachmentManager.stateHeight=16;
AttachmentManager.minimumHeight=30;
AttachmentManager.rowHeight=18;
AttachmentManager.maximumDisplay=3;
AttachmentManager.actionWidth=80;
AttachmentManager.cssStateNames=Array('FileAttachment_state_complete', 'FileAttachment_state_uploading');
AttachmentManager.prototype.onresize=null;
AttachmentManager.prototype.username=function(unm) {
if (unm!=undefined) {
this.i_unm=unm;
}
return this.i_unm;
}
AttachmentManager.prototype.sessionId=function(sid) {
if (sid!=undefined) {
this.i_sid=sid;
}
return this.i_sid;
}
AttachmentManager.prototype.uploadError=function(message) {
if (message!=undefined) {
if (message===false) {
message=undefined;
}
this.i_custom_error=message;
}
return this.i_custom_error;
}
AttachmentManager.prototype.quota=function(quota) {
if (quota!=undefined) {
this.i_quota=quota;
}
return this.i_quota;
}
AttachmentManager.prototype.attachmentList=function() {
var str="";
for (var x=0; x < this.i_files.length; x++) { 
str+="/"+this.i_files[x].id()+";"+this.i_files[x].size()+";10;"+this.i_files[x].name();
}
return str;
}
AttachmentManager.prototype.width=function(width) {
if (width!=undefined) {
if (this.i_width!=width) {
this.i_width=width;
if (this.i_manager!=undefined) {
this.i_manager.style.width=this.width()+"px";
this.i_list.style.width=(this.width() - AttachmentManager.iconWidth)+"px";
this.i_quota_box.style.left=(this.width() - (AttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
}
for (var x=0; x < this.i_files.length; x++){ 
this.i_files[x].width(width - AttachmentManager.iconWidth - (this.scrollVisible() ? scrollBarWidth()+5 : 5));
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.manager=this;
this.onresize(o);
}
}
}
return this.i_width;
}
AttachmentManager.prototype.active=function(state) {
if (state!=undefined) {
this.i_active=state;
if (state==true) {
for (var x=0; x < this.i_files.length; x++) {
if (this.i_files[x].waiting()) {
this.i_files[x].submitUpload();
}
if (this.composeId()==undefined) {
this.active(false);
break;
}
}
}
}
return this.i_active;
}
AttachmentManager.prototype.composeId=function(id) {
if (id!=undefined) {
this.i_compose_id=id;
this.active(true);
}
return this.i_compose_id;
}
AttachmentManager.prototype.scrollVisible=function(state) {
if (state!=undefined) {
this.i_scroll=state;
for (var x=0; x < this.i_files.length; x++){ 
this.i_files[x].width(this.width() - AttachmentManager.iconWidth - (this.scrollVisible() ? scrollBarWidth()+5 : 5));
}
if (this.i_manager!=undefined) {
this.i_quota_box.style.left=(this.width() - (AttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
}
}
return this.i_scroll;
}
AttachmentManager.prototype.height=function() {
var r=AttachmentManager.maximumDisplay;
if (this.i_files.length < r) {
r=this.i_files.length; 
if (r==0) {
r=1;
}
}
var h=(r * (AttachmentManager.rowHeight+1));
if (h < AttachmentManager.minimumHeight) {
h=AttachmentManager.minimumHeight;
}
return h;
}
AttachmentManager.prototype.overflow=function(state) {
if (state!=undefined) {
if (this.i_overflow!=state) {
this.i_overflow=state;
if (this.i_manager!=undefined) {
this.i_manager.className="AttachmentManager "+(this.overflow() ? "AttachmentManager_overflow" : "AttachmentManager_inrange");
}
}
}
return this.i_overflow;
}
AttachmentManager.prototype.usedQuota=function(space) {
if (space!=undefined) {
this.i_used=space;	
if (this.i_manager!=undefined) {
this.i_quota_text.innerHTML="Total Size: "+FileAttachment.filterSize(this.usedQuota())+" of "+FileAttachment.filterSize(this.quota());
}
this.progressBar().current(space);
this.overflow(space > this.quota());
}
return this.i_used;
}
AttachmentManager.prototype.updateQuota=function() {
var m=0;
for (var x=0; x < this.i_files.length; x++) {
m+=this.i_files[x].size();
}
this.usedQuota(m);
}
AttachmentManager.prototype.attachments=function() {
var r=Array();
for (var x=0; x < this.i_files.length; x++){ 
r[x]=this.i_files[x].attachmentObject();
}
return r;
}
AttachmentManager.prototype.files=function(index) {
if (index!=undefined) {
return this.i_files[index];
}
return this.i_files;
}
AttachmentManager.prototype.addFile=function(file, beforeFile) {
var append=true;
if (beforeFile!=undefined) {
for (var x=0; x < this.i_files.length; x++) {
if (this.i_files[x]==beforeFile) {
this.i_files.splice(x, 0, file);
append=false;
if (this.i_manager!=undefined) {
this.i_list.insertBefore(file.getFile(), beforeFile.getFile());
}
break;
}
}
}
if (append==true) {
this.i_files[this.i_files.length]=file;
if (this.i_manager!=undefined) {
this.i_list.appendChild(file.getFile());
}
}
file.i_parent=this;
file.width(this.width() - AttachmentManager.iconWidth - (this.scrollVisible() ? scrollBarWidth()+5 : 5));
this.usedQuota(this.usedQuota()+file.size());
file.i_sz_l=EventHandler.register(file, "onchangesize", this.updateQuota, this);
if (this.i_manager!=undefined) {
this.i_manager.style.height=this.height()+"px";
this.i_list.style.height=(this.height())+"px";
}
if (this.i_files.length > AttachmentManager.maximumDisplay) {
this.scrollVisible(true);
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.manager=this;
this.onresize(o);
}
if (this.i_manager!=undefined) {
this.i_quota_box.style.left=(this.width() - (AttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
if (this.i_files.length > 3) {
this.i_list.scrollTop=((this.i_files.length - 3) * AttachmentManager.rowHeight);
}
else {
this.i_list.scrollTop="0";
}
}
return file;
}
AttachmentManager.prototype.removeFile=function(file) {
for (var x=0; x < this.i_files.length; x++) {
if (this.i_files[x]==file) {
this.i_files.splice(x, 1);
if (file.i_sz_l!=undefined) {
file.i_sz_l.unregister();
}
if (this.i_manager!=undefined) {
this.i_list.removeChild(file.getFile());
}
this.usedQuota(this.usedQuota() - file.size());
if (this.i_manager!=undefined) {
this.i_manager.style.height=this.height()+"px";
this.i_list.style.height=this.height()+"px";
}
if (this.i_files.length <=AttachmentManager.maximumDisplay) {
this.scrollVisible(false);
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.manager=this;
this.onresize(o);
}
return true;
}
}	
return false;
}
AttachmentManager.prototype.left=function() {
var me=this.getManager();
var lf=0;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
try {
me=me.offsetParent;
} catch(e) {
me=null;
}
}
return lf;
}
AttachmentManager.prototype.top=function() {
var me=this.getManager();
var tp=0;
while (me!=null) {
tp+=parseInt(me.offsetTop);
try {
me=me.offsetParent;
} catch(e) {
me=null;
}
}
return tp;
}
AttachmentManager.prototype.progressBar=function() {
if (this.i_progress==undefined) {
this.i_progress=new ProgressBar(AttachmentManager.quotaBoxWidth - 5, AttachmentManager.quotaBoxHeight - 14, 0, this.quota(), this.usedQuota());
}
return this.i_progress;
}
AttachmentManager.prototype.completeAttachment=function(id, size, name) {
size=parseInt(size);
for (var y=0; y < this.i_files.length; y++) {
if (this.i_files[y].name()==name && this.i_files[y].state()==1) {
this.i_files[y].state(0);
this.i_files[y].size(size);
this.i_files[y].id(id);
return true;
}
}
this.addFile(new FileAttachment(name, size, 0, id));
}
AttachmentManager.prototype.getManager=function() {
if (this.i_manager==undefined) {
this.i_manager=document.createElement('DIV');
this.i_manager.className="AttachmentManager "+(this.overflow() ? "AttachmentManager_overflow" : "AttachmentManager_inrange");
this.i_manager.style.width=this.width()+"px";
this.i_manager.style.height=this.height()+"px";
this.i_quota_box=document.createElement('DIV');
this.i_quota_box.className="AttachmentManager_quota_box";
this.i_quota_box.style.width=AttachmentManager.quotaBoxWidth+"px";
this.i_quota_box.style.height=AttachmentManager.quotaBoxHeight+"px";
this.i_quota_box.style.left=(this.width() - (AttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
this.i_manager.appendChild(this.i_quota_box);
this.i_quota_text=document.createElement('DIV');
this.i_quota_text.className="AttachmentManager_quota_text";
this.i_quota_text.style.width=(AttachmentManager.quotaBoxWidth - 5)+"px";
this.i_quota_text.style.height="14px";
this.i_quota_text.innerHTML="Total Size: "+FileAttachment.filterSize(this.usedQuota())+" of "+FileAttachment.filterSize(this.quota());
this.i_quota_box.appendChild(this.i_quota_text);
this.i_quota_box.appendChild(this.progressBar().getProgressBar());
this.i_icon=document.createElement('DIV');
this.i_icon.className="AttachmentManager_icon";
this.i_icon.style.width=AttachmentManager.iconWidth+"px";
this.i_icon.style.height=AttachmentManager.iconHeight+"px";
this.i_manager.appendChild(this.i_icon);
this.i_list=document.createElement('DIV');
this.i_list.className="AttachmentManager_list";
this.i_list.style.width=(this.width() - AttachmentManager.iconWidth)+"px";
this.i_list.style.height=(this.height())+"px";
this.i_manager.appendChild(this.i_list);
for (var x=0; x < this.i_files.length; x++) {
this.i_list.appendChild(this.i_files[x].getFile());
}
}
return this.i_manager;
}
function FileAttachment(name, size, state, id) {
this.i_name=name;
this.i_display=name;
this.i_size=(size!=undefined ? size : 0);
this.i_state=(state!=undefined ? state : 1);
this.i_id=id;
this.i_width=100;
this.i_waiting=false;
}
FileAttachment.prototype.onchangesize=null;
FileAttachment.prototype.parent=function() {
return this.i_parent;
}
FileAttachment.prototype.displayName=function(name) {
if (name!=undefined) {
this.i_display=name;
if (this.i_file!=undefined) {
nameWidth=FileAttachment.getNameWidth(this);
this.i_file_text.style.width=nameWidth+"px";
this.i_file_text.innerHTML="&nbsp;"+this.displayName()+" ("+FileAttachment.filterSize(this.size())+")";
}
}
return this.i_display;
}
FileAttachment.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
if (this.i_obj!=undefined) {
this.i_obj.id=this.id();
}
}
return this.i_id;
}
FileAttachment.filterSize=function(size) {
if (parseInt(size)!=size) {
return size;
}
var ext=" B";
if (size < 1024) {
size=size+"";
ext="B";
}
else if (size < 1024 * 1024) {
size=(Math.round(10 * size / 1024)/10)+"";
ext="KB";
}
else if (size < 1024 * 1024 * 1024) {
size=(Math.round(10 * size / 1048576)/10)+"";
ext="MB";
}
else {
size=(Math.round(10 * size / 1073741824)/10)+"";
ext="GB";
}
size=Math.floor(size * 100);
size=(size / 100);
return size+""+ext;
}
FileAttachment.getNameWidth=function(obj) {
var t=TextDimension("&nbsp;"+obj.displayName()+" ("+FileAttachment.filterSize(obj.size())+")", "FileAttachment_name_adjust");
var nameWidth=t.width;
var attachWidth=nameWidth+AttachmentManager.iconWidth+AttachmentManager.actionWidth;
if (attachWidth+AttachmentManager.quotaBoxWidth > obj.width()) {
nameWidth=obj.width() - AttachmentManager.iconWidth - AttachmentManager.actionWidth - AttachmentManager.quotaBoxWidth;
if (nameWidth < 0) nameWidth=0;
}
return nameWidth;
}
FileAttachment.prototype.handleIframeError=function(e) {
var me=this;
if(document.all && this.i_u_frame.readyState!="complete") {
setTimeout(function() {
me.handleIframeError();
}, 2000);
} else if (this.i_u_frame.i_started==true) {
setTimeout(function() {
if (me.state()==1) {
me.i_u_frame.i_started=false;
me.retry();
}
}, 2000);
}
}
FileAttachment.prototype.retry=function() {
if (this.parent().uploadError()!=undefined) {
alert("Unable to upload "+this.name()+":\n"+this.parent().uploadError())
this.cancel();
this.parent().uploadError(false);
}
else {
var remaining=(this.parent().quota() - this.parent().usedQuota());
if (remaining < 0) {
alert("Unable to upload "+this.name()+":\n"+"You are significantly over your allowed attachment size.  Please remove some files before attempting to add this one again.");
this.cancel();
}
else {
if (confirm("Unable to upload "+this.name()+":\n"+"This file is corrupt or could not be accessed.  Please make sure you have permission to open the file, it is not in use, and does not exceed "+FileAttachment.filterSize(remaining)+".\n\nWould you like to try again?")) {
this.submitUpload();
}
else {
this.cancel();
}
}
}
}
FileAttachment.prototype.uploadFile=function(inp) {
this.i_file_input=inp;
this.state(1);
this.i_u_holder=document.createElement('DIV');
this.i_u_holder.style.display="none";
var frameName="upload_frame_"+Math.floor(Math.random() * 100000);
if(document.all) {
this.i_u_frame=document.createElement('<IFRAME name="'+frameName+'">');
}else{
this.i_u_frame=document.createElement('IFRAME');
this.i_u_frame.name=frameName;
}
this.i_u_frame.id=frameName;
this.i_u_frame.style.display="none";
this.i_u_frame.style.width="10px";
this.i_u_frame.style.height="10px";
this.i_u_frame.i_started=false;
this.i_u_frame.pObj=this;
this.i_u_holder.appendChild(this.i_u_frame);
this.i_u_form=document.createElement('FORM');
this.i_u_form.method="post";
this.i_u_form.action="/cgi-bin/uploadAttachment.cgi";
this.i_u_form.enctype="multipart/form-data";
this.i_u_form.setAttribute('encoding', 'multipart/form-data');
this.i_u_form.target=frameName;
var inp_unm=document.createElement('INPUT');
inp_unm.type="hidden";
inp_unm.name="unm";
inp_unm.value=this.parent().username();
this.i_u_form.appendChild(inp_unm);
var inp_sid=document.createElement('INPUT');
inp_sid.type="hidden";
inp_sid.name="sid";
inp_sid.value=this.parent().sessionId();
this.i_u_form.appendChild(inp_sid);
this.i_inp_csid=document.createElement('INPUT');
this.i_inp_csid.type="hidden";
this.i_inp_csid.name="csid";
this.i_inp_csid.value=(this.parent().composeId()!=undefined ? this.parent().composeId() : "");
this.i_u_form.appendChild(this.i_inp_csid);
var inp_total=document.createElement('INPUT');
inp_total.type="hidden";
inp_total.name="totalSize";
inp_total.value=this.parent().usedQuota();
this.i_u_form.appendChild(inp_total);
var inp_gds=document.createElement('INPUT');
inp_gds.type="hidden";
inp_gds.name="gds";
inp_gds.value="2";
this.i_u_form.appendChild(inp_gds);
var inp_button=document.createElement('INPUT');
inp_button.type="submit";
inp_button.name="uploadButton";
inp_button.value="";
this.i_u_form.appendChild(inp_button);
if(this.i_file_input.value.indexOf('%')!=-1) {
var inp_fn=document.createElement("INPUT");
inp_fn.type="hidden";
inp_fn.name="fileNameEnc1";
inp_fn.id="fileNameEnc1";
inp_fn.value=this.i_file_input.value;
this.i_u_form.appendChild(inp_fn);
}
this.i_file_input.name="userfile1";
this.i_u_form.appendChild(this.i_file_input);
this.i_u_holder.appendChild(this.i_u_form);
document.body.appendChild(this.i_u_holder);
if(document.all) {
this.handleIframeError();
} else {
EventHandler.register(this.i_u_frame, "onload", this.handleIframeError, this);
}
if (this.parent().active()==true) {
this.submitUpload();
if (this.parent().composeId()==undefined) {
this.parent().active(false);
}
}
else {
this.waiting(true);
}
}
FileAttachment.prototype.waiting=function(state) {
if (state!=undefined) {
this.i_waiting=state;
}
return this.i_waiting;
}
FileAttachment.prototype.submitUpload=function() {
if (this.i_u_form!=undefined) {
this.i_u_frame.i_started=true;
this.i_inp_csid.value=(this.parent().composeId()!=undefined ? this.parent().composeId() : "");
if (this.parent().composeId()==undefined) {
console.log('submitting '+this.name()+' without a csid');
}
this.i_u_form.submit();	
}
}
FileAttachment.prototype.cancel=function() {
if (this.i_u_frame!=undefined && this.state()==1) {
this.i_u_frame.location="/Ioffice/Common/blank.html";	
document.body.removeChild(this.i_u_holder);	
}
this.parent().removeFile(this);
if (this.waiting()!=true && this.parent().active()==false) {
this.parent().active(true);
}
}
FileAttachment.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_display==name) {
this.displayName(name);
}
if (this.i_obj!=undefined) {
this.i_obj.name=this.name();
}
}
return this.i_name;
}
FileAttachment.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_file!=undefined) {
nameWidth=FileAttachment.getNameWidth(this);
this.i_file_text.style.width=nameWidth+"px";
this.i_file.style.width=this.width()+"px";
}
}
return this.i_width;
}
FileAttachment.prototype.size=function(size) {
if (size!=undefined) {
this.i_size=size;
if (this.i_file!=undefined) {
nameWidth=FileAttachment.getNameWidth(this);
this.i_file_text.style.width=nameWidth+"px";
this.i_file_text.innerHTML="&nbsp;"+this.displayName()+" ("+FileAttachment.filterSize(this.size())+")";
}
if (this.i_obj!=undefined) {
this.i_obj.size=this.size();
}
if (this.onchangesize!=undefined) {
var o=new Object();
o.type="changesize";
o.file=this;
this.onchangesize(o);
}
}
return this.i_size;
}
FileAttachment.prototype.state=function(state) {
if (state!=undefined) {
this.i_state=state;
if (state==0) {
this.waiting(false);
}
if (this.i_file!=undefined) {
this.i_file_state.className="FileAttachment_state "+AttachmentManager.cssStateNames[this.state()];
this.i_file_action.innerHTML=(this.state()==0 ? "Remove" : "Cancel");
}
if (this.onchangestate!=undefined) {
var o=new Object();
o.type="changestate";
o.file=this;
this.onchangestate(o);
}
}
return this.i_state;
}
FileAttachment.prototype.attachmentObject=function() {
if (this.i_obj==undefined) {
this.i_obj=new Object();
this.i_obj.name=this.name();
this.i_obj.size=this.size();
this.i_obj.id=this.id();
}
return this.i_obj;
}
FileAttachment.prototype.getFile=function() {
if (this.i_file==undefined) {
this.i_file=document.createElement('DIV');
this.i_file.className="FileAttachment";
this.i_file.style.height=AttachmentManager.rowHeight+"px";
this.i_file.style.width=this.width()+"px";
this.i_file_state=document.createElement('DIV');
this.i_file_state.className="FileAttachment_state "+AttachmentManager.cssStateNames[this.state()];
this.i_file_state.style.width=AttachmentManager.stateWidth+"px";
this.i_file_state.style.height=AttachmentManager.stateHeight+"px";
this.i_file_state.style.marginTop=Math.floor((AttachmentManager.rowHeight - AttachmentManager.iconHeight) / 2)+"px";
this.i_file_state.innerHTML="&nbsp;";
this.i_file.appendChild(this.i_file_state);
nameWidth=FileAttachment.getNameWidth(this);
this.i_file_text=document.createElement('DIV');
this.i_file_text.className="FileAttachment_name";
this.i_file_text.style.width=nameWidth+"px";
this.i_file_text.style.height=AttachmentManager.rowHeight+"px";
this.i_file_text.style.lineHeight=AttachmentManager.rowHeight+"px";
this.i_file_text.innerHTML="&nbsp;"+this.displayName()+" ("+FileAttachment.filterSize(this.size())+")";
this.i_file.appendChild(this.i_file_text);
this.i_file_action=document.createElement('DIV');
this.i_file_action.className="FileAttachment_action";
this.i_file_action.style.width=AttachmentManager.actionWidth+"px";
this.i_file_action.style.height=AttachmentManager.rowHeight+"px";
this.i_file_action.style.lineHeight=AttachmentManager.rowHeight+"px";
this.i_file_action.innerHTML=(this.state()==0 ? "Remove" : "Cancel");
EventHandler.register(this.i_file_action, "onclick", this.cancel, this);
this.i_file.appendChild(this.i_file_action);
}
return this.i_file;
}
JavaScriptResource.notifyComplete("./lib/components/Component.FileAttachment.js");
PopoutWindow.registerGroup("UniversalFileAttachment", ["UniversalAttachmentManager",
"UniversalFileAttachment",
"InvisibleUploadButton",
"=UniversalFileAttachment.prototype.copy"]);
function UniversalAttachmentManager(width, quota, showIcon) {
this.i_width=width;
this.i_quota=(quota!=undefined ? quota : 20971520);
this.i_custom_error;
this.i_object_id=0;
this.i_object_type="none";
this.i_stage=false;
this.i_max_display=UniversalAttachmentManager.maximumDisplay;
this.i_show_icon=(showIcon==undefined ? true : showIcon);
this.i_files=Array();
this.i_used=0;
this.i_overflow=false;
this.i_active=true;
this.i_manager_id=UniversalAttachmentManager.i_managers.length;
UniversalAttachmentManager.i_managers[this.i_manager_id]=this;
this.i_files_meta=[];
this.i_read_only=false;
}
UniversalAttachmentManager.i_managers=Array();
UniversalAttachmentManager.quotaBoxWidth=150;
UniversalAttachmentManager.quotaBoxHeight=25;
UniversalAttachmentManager.iconWidth=26;
UniversalAttachmentManager.iconHeight=16;
UniversalAttachmentManager.stateWidth=16;
UniversalAttachmentManager.stateHeight=16;
UniversalAttachmentManager.minimumHeight=30;
UniversalAttachmentManager.rowHeight=18;
UniversalAttachmentManager.maximumDisplay=3;
UniversalAttachmentManager.actionWidth=80;
UniversalAttachmentManager.cssStateNames=Array('FileAttachment_state_complete', 'FileAttachment_state_uploading');
UniversalAttachmentManager.success=function(manager_id, file_id, attachment_id, size) {
UniversalAttachmentManager.i_managers[manager_id].completeAttachment(file_id, attachment_id, size);
}
UniversalAttachmentManager.prototype.readOnly=function(readOnly) {
if (readOnly!=undefined) {
this.i_read_only=readOnly;
if (readOnly==true) {
this.i_quota_box_wrapper.style.display="none";
} else {
this.i_quota_box_wrapper.style.display="";
}
for (var x=0; x < this.i_files.length; x++) {
this.i_files[x].readOnly(readOnly);
}			
}
return this.i_read_only;
}
UniversalAttachmentManager.prototype.onresize=null;
UniversalAttachmentManager.prototype.onupdate=null;
UniversalAttachmentManager.prototype.uploadError=function(message) {
if (message!=undefined) {
if (message===false) {
message=undefined;
}
this.i_custom_error=message;
}
return this.i_custom_error;
}
UniversalAttachmentManager.prototype.maximumDisplay=function(max) {
if(max!=undefined) {
this.i_max_display=max;
}
return this.i_max_display;
}
UniversalAttachmentManager.prototype.quota=function(quota) {
if (quota!=undefined) {
this.i_quota=quota;
}
return this.i_quota;
}
UniversalAttachmentManager.prototype.attachmentList=function() {
var str="";
for (var x=0; x < this.i_files.length; x++) { 
str+="/"+this.i_files[x].id()+";"+this.i_files[x].size()+";10;"+this.i_files[x].name();
}
return str;
}
UniversalAttachmentManager.prototype.width=function(width) {
if (width!=undefined) {
if (this.i_width!=width) {
this.i_width=width;
if (this.i_manager!=undefined) {
this.i_manager.style.width=this.width()+"px";
this.i_list.style.width=(this.width() - (this.i_show_icon ? UniversalAttachmentManager.iconWidth : 0))+"px";
this.i_quota_box_wrapper.style.left=(this.width() - (UniversalAttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
}
for (var x=0; x < this.i_files.length; x++){ 
this.i_files[x].width(width - (this.i_show_icon ? UniversalAttachmentManager.iconWidth : 0) - (this.scrollVisible() ? scrollBarWidth()+5 : 5));
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.manager=this;
this.onresize(o);
}
}
}
return this.i_width;
}
UniversalAttachmentManager.prototype.active=function(state) {
if (state!=undefined) {
this.i_active=state;
if (state==true) {
for (var x=0; x < this.i_files.length; x++) {
if (this.i_files[x].waiting()) {
this.i_files[x].submitUpload();
}
}
}
}
return this.i_active;
}
UniversalAttachmentManager.prototype.objectId=function(id) {
if (id!=undefined) {
this.i_object_id=id;
}
return this.i_object_id;
}
UniversalAttachmentManager.prototype.objectType=function(type) {
if(type!=undefined) {
this.i_object_type=type;
}
return this.i_object_type;
}
UniversalAttachmentManager.prototype.uploadURI=function(uri) {
if(uri!=undefined) {
this.i_uri=uri;
}
return this.i_uri;
}
UniversalAttachmentManager.prototype.stage=function(stage) {
if(stage!==undefined) {
this.i_stage=stage;
for(var x=this.i_files.length - 1; x >=0; x--) {
this.i_files[x].displayName(this.i_files[x].displayName());
}
}
return this.i_stage;
}
UniversalAttachmentManager.prototype.scrollVisible=function(state) {
if (state!=undefined) {
this.i_scroll=state;
for (var x=0; x < this.i_files.length; x++){ 
this.i_files[x].width(this.width() - (this.i_show_icon ? UniversalAttachmentManager.iconWidth : 0) - (this.scrollVisible() ? scrollBarWidth()+5 : 5));
}
if (this.i_manager!=undefined) {
this.i_quota_box_wrapper.style.left=(this.width() - (UniversalAttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
}
}
return this.i_scroll;
}
UniversalAttachmentManager.prototype.height=function() {
var r=this.i_max_display;
if (this.i_files.length < r) {
r=this.i_files.length; 
if (r==0) {
r=1;
}
}
var h=(r * (UniversalAttachmentManager.rowHeight+1));
if (h < UniversalAttachmentManager.minimumHeight) {
h=UniversalAttachmentManager.minimumHeight;
}
return h;
}
UniversalAttachmentManager.prototype.overflow=function(state) {
if (state!=undefined) {
if (this.i_overflow!=state) {
this.i_overflow=state;
if (this.i_manager!=undefined) {
this.i_manager.className="AttachmentManager "+(this.overflow() ? "AttachmentManager_overflow" : "AttachmentManager_inrange");
}
}
}
return this.i_overflow;
}
UniversalAttachmentManager.prototype.usedQuota=function(space) {
if (space!=undefined) {
this.i_used=space;	
if (this.i_manager!=undefined) {
this.i_quota_text.innerHTML="Total Size: "+UniversalFileAttachment.filterSize(this.usedQuota())+" of "+UniversalFileAttachment.filterSize(this.quota());
}
this.progressBar().current(space);
this.overflow(space > this.quota());
}
return this.i_used;
}
UniversalAttachmentManager.prototype.updateQuota=function() {
var m=0;
for (var x=0; x < this.i_files.length; x++) {
m+=this.i_files[x].size();
}
this.usedQuota(m);
}
UniversalAttachmentManager.prototype.attachments=function() {
var r=Array();
for (var x=0; x < this.i_files.length; x++){ 
r[x]=this.i_files[x].attachmentObject();
}
return r;
}
UniversalAttachmentManager.prototype.files=function(index) {
if (index!=undefined) {
return this.i_files[index];
}
return this.i_files;
}
UniversalAttachmentManager.prototype.addFile=function(file, beforeFile) {
var append=true;
file.i_parent=this;
if (beforeFile!=undefined) {
for (var x=0; x < this.i_files.length; x++) {
if (this.i_files[x]==beforeFile) {
this.i_files.splice(x, 0, file);
append=false;
if (this.i_manager!=undefined) {
this.i_list.insertBefore(file.getFile(), beforeFile.getFile());
}
break;
}
}
}
if (append==true) {
this.i_files[this.i_files.length]=file;
if (this.i_manager!=undefined) {
this.i_list.appendChild(file.getFile());
}
}
var fid=this.i_files_meta.push(file);
file.fid(fid - 1);
file.width(this.width() - (this.i_show_icon ? UniversalAttachmentManager.iconWidth : 0) - (this.scrollVisible() ? scrollBarWidth()+5 : 5));
this.usedQuota(this.usedQuota()+file.size());
file.i_sz_l=EventHandler.register(file, "onchangesize", this.updateQuota, this);
if (this.i_manager!=undefined) {
this.i_manager.style.height=this.height()+"px";
this.i_list.style.height=(this.height())+"px";
}
if (this.i_files.length > this.i_max_display) {
this.scrollVisible(true);
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.manager=this;
this.onresize(o);
}
if(this.onupdate!=undefined) {
var o={
type: "update",
manager: this,
count: this.i_files.length
};
this.onupdate(o);
}
if (this.i_manager!=undefined) {
this.i_quota_box_wrapper.style.left=(this.width() - (UniversalAttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
if (this.i_files.length > 3) {
this.i_list.scrollTop=((this.i_files.length - 3) * UniversalAttachmentManager.rowHeight);
}
else {
this.i_list.scrollTop="0";
}
}
return file;
}
UniversalAttachmentManager.prototype.clearFiles=function() {
for (var x=0; x < this.i_files.length; x++) {
this.removeFile(this.i_files[x], false);
}
}
UniversalAttachmentManager.prototype.removeFile=function(file, destroy) {
if(destroy===undefined) {
destroy=true;
}
for (var x=0; x < this.i_files.length; x++) {
if (this.i_files[x]==file) {
this.i_files_meta[file.fid()]=null;
this.i_files.splice(x, 1);
if (file.i_sz_l!=undefined) {
file.i_sz_l.unregister();
}
if (this.i_manager!=undefined) {
this.i_list.removeChild(file.getFile());
}
this.usedQuota(this.usedQuota() - file.size());
if (this.i_manager!=undefined) {
this.i_manager.style.height=this.height()+"px";
this.i_list.style.height=this.height()+"px";
}
if (this.i_files.length <=this.i_max_display) {
this.scrollVisible(false);
}
if(destroy==true) {
if(this.onremove!=null) {
var o={
type: "remove",
file: file
};
this.onremove(o);
}
}
if(this.onupdate!=undefined) {
var o={
type: "update",
manager: this,
count: this.i_files.length	
};
this.onupdate(o);
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.manager=this;
this.onresize(o);
}
return true;
}
}	
return false;
}
UniversalAttachmentManager.prototype.left=function() {
var me=this.getManager();
var lf=0;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
return lf;
}
UniversalAttachmentManager.prototype.top=function() {
var me=this.getManager();
var tp=0;
while (me!=null) {
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
return tp;
}
UniversalAttachmentManager.prototype.progressBar=function() {
if (this.i_progress==undefined) {
this.i_progress=new ProgressBar(UniversalAttachmentManager.quotaBoxWidth - 5, UniversalAttachmentManager.quotaBoxHeight - 14, 0, this.quota(), this.usedQuota());
}
return this.i_progress;
}
UniversalAttachmentManager.prototype.completeAttachment=function(fid, attachment_id, size) {
if(this.i_files_meta[fid]) {
this.i_files_meta[fid].state(0);
this.i_files_meta[fid].id(attachment_id);
this.i_files_meta[fid].size(size);
if (this.onuploadcomplete!=undefined) {
var o={
type: "uploadcomplete",
file: this.i_files_meta[fid]
}
this.onuploadcomplete(o);
}
}
}
UniversalAttachmentManager.prototype.getManager=function() {
if (this.i_manager==undefined) {
this.i_manager=document.createElement('DIV');
this.i_manager.className="AttachmentManager "+(this.overflow() ? "AttachmentManager_overflow" : "AttachmentManager_inrange");
this.i_manager.style.width=this.width()+"px";
this.i_manager.style.height=this.height()+"px";
this.i_quota_box_wrapper=document.createElement('div');
this.i_quota_box_wrapper.className="UniversalAttachmentManager_quota_box_wrapper";
this.i_quota_box_wrapper.style.left=(this.width() - (UniversalAttachmentManager.quotaBoxWidth+2) - (this.scrollVisible() ? scrollBarWidth() : 0))+"px";
this.i_manager.appendChild(this.i_quota_box_wrapper);
this.i_quota_box=document.createElement('DIV');
this.i_quota_box.className="UniversalAttachmentManager_quota_box";
this.i_quota_box.style.width=UniversalAttachmentManager.quotaBoxWidth+"px";
this.i_quota_box.style.height=UniversalAttachmentManager.quotaBoxHeight+"px";
this.i_quota_box_wrapper.appendChild(this.i_quota_box);
this.i_quota_text=document.createElement('DIV');
this.i_quota_text.className="AttachmentManager_quota_text";
this.i_quota_text.style.width=(UniversalAttachmentManager.quotaBoxWidth - 5)+"px";
this.i_quota_text.style.height="14px";
this.i_quota_text.innerHTML="Total Size: "+UniversalFileAttachment.filterSize(this.usedQuota())+" of "+UniversalFileAttachment.filterSize(this.quota());
this.i_quota_box.appendChild(this.i_quota_text);
this.i_quota_box.appendChild(this.progressBar().getProgressBar());
if(this.i_show_icon) {
this.i_icon=document.createElement('DIV');
this.i_icon.className="AttachmentManager_icon";
this.i_icon.style.width=UniversalAttachmentManager.iconWidth+"px";
this.i_icon.style.height=UniversalAttachmentManager.iconHeight+"px";
this.i_manager.appendChild(this.i_icon);
}
this.i_list=document.createElement('DIV');
this.i_list.className="AttachmentManager_list";
this.i_list.style.width=(this.width() - UniversalAttachmentManager.iconWidth)+"px";
this.i_list.style.height=(this.height())+"px";
this.i_manager.appendChild(this.i_list);
for (var x=0; x < this.i_files.length; x++) {
this.i_list.appendChild(this.i_files[x].getFile());
}
}
return this.i_manager;
}
function UniversalFileAttachment(name, size, state, id) {
this.i_name=name;
this.i_display=name;
this.i_size=(size!=undefined ? size : 0);
this.i_state=(state!=undefined ? state : 1);
this.i_id=id;
this.i_fid=0;
this.i_width=100;
this.i_waiting=false;
this.i_read_only=false;
}
UniversalFileAttachment.prototype.copy=function(ofile) {
this.i_name=ofile.i_name;
this.i_display=ofile.i_display;
this.i_size=ofile.i_size;
this.i_state=ofile.i_state;
this.i_id=ofile.i_id;
this.i_fid=ofile.i_fid;
}
UniversalFileAttachment.prototype.readOnly=function(readOnly) {
if (readOnly!=undefined) {
this.i_read_only=readOnly;
if (readOnly==true) {
this.i_file_action.style.display="none";
} else {
this.i_file_action.style.display="";
}
}
return this.i_read_only;
}
UniversalFileAttachment.prototype.onchangesize=null;
UniversalFileAttachment.prototype.parent=function() {
return this.i_parent;
}
UniversalFileAttachment.prototype.displayName=function(name) {
if (name!=undefined) {
this.i_display=name;
if (this.i_file!=undefined) {
var t=TextDimension("&nbsp;"+this.displayName()+" ("+UniversalFileAttachment.filterSize(this.size())+")", "UniversalFileAttachment_name_adjust");
var nameWidth=t.width;
if (nameWidth+UniversalAttachmentManager.iconWidth+UniversalAttachmentManager.actionWidth > this.width()) {
nameWidth=this.width() - UniversalAttachmentManager.iconWidth - UniversalAttachmentManager.actionWidth;
}
this.i_file_text.style.width=nameWidth+"px";
this.i_file_text.innerHTML="&nbsp;"+this.getFormattedDisplayName()+" ("+UniversalFileAttachment.filterSize(this.size())+")";
}
}
return this.i_display;
}
UniversalFileAttachment.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
if (this.i_obj!=undefined) {
this.i_obj.id=this.id();
}
this.displayName(this.displayName());
}
return this.i_id;
}
UniversalFileAttachment.prototype.fid=function(fid) {
if(fid!=undefined) {
this.i_fid=fid;
}
return this.i_fid;
}
UniversalFileAttachment.filterSize=function(size) {
if (parseInt(size)!=size) {
return size;
}
var ext=" B";
if (size < 1024) {
size=size+"";
ext="B";
}
else if (size < 1024 * 1024) {
size=(Math.round(10 * size / 1024)/10)+"";
ext="KB";
}
else if (size < 1024 * 1024 * 1024) {
size=(Math.round(10 * size / 1048576)/10)+"";
ext="MB";
}
else {
size=(Math.round(10 * size / 1073741824)/10)+"";
ext="GB";
}
size=Math.floor(size * 100);
size=(size / 100);
return size+""+ext;
}
UniversalFileAttachment.prototype.handleIframeError=function(e) {
var me=this;
if(document.all && this.i_u_frame.readyState!="complete") {
setTimeout(function() {
me.handleIframeError();
}, 2000);
} else if (this.i_u_frame.i_started==true) {
setTimeout(function() {
if (me.state()==1) {
me.i_u_frame.i_started=false;
me.retry();
}
}, 2000);
}
}
UniversalFileAttachment.prototype.retry=function() {
if (this.parent().uploadError()!=undefined) {
alert("Unable to upload "+this.name()+":\n"+this.parent().uploadError())
this.cancel();
this.parent().uploadError(false);
}
else {
var remaining=(this.parent().quota() - this.parent().usedQuota());
if (remaining < 0) {
alert("Unable to upload "+this.name()+":\n"+"You are significantly over your allowed attachment size.  Please remove some files before attempting to add this one again.");
this.cancel();
}
else {
var mesg;
mesg=undefined;
try {
var doc;
if (this.i_u_frame.contentDocument) {
doc=this.i_u_frame.contentDocument
var x=doc.getElementsByTagName('description');
if (x.length > 0) mesg=x[0].childNodes[0].nodeValue;
} else {
doc=document.frames[this.i_u_frame.id].document.body.innerText;
var start=doc.indexOf("<description>")+13;
var end=doc.indexOf("</description>");
mesg=doc.substring(start,end);
}
} catch (err) {
mesg=undefined;
}
if (mesg!=undefined){
alert("Unable to upload "+this.name()+":\n"+mesg);
this.cancel();
} else {
if (confirm("Unable to upload "+this.name()+":\n"+"This file is corrupt or could not be accessed.  Please make sure you have permission to open the file, it is not in use, and does not exceed "+UniversalFileAttachment.filterSize(remaining)+".\n\nWould you like to try again?")) {
this.submitUpload();
}
else {
this.cancel();
}
}
}
}
}
UniversalFileAttachment.prototype.uploadFile=function(inp) {
this.i_file_input=inp;
this.state(1);
this.i_u_holder=document.createElement('DIV');
this.i_u_holder.style.display="none";
var frameName="upload_frame_"+Math.floor(Math.random() * 100000);
if(document.all) {
this.i_u_frame=document.createElement('<IFRAME name="'+frameName+'">');
}else{
this.i_u_frame=document.createElement('IFRAME');
this.i_u_frame.name=frameName;
}
this.i_u_frame.id=frameName;
this.i_u_frame.style.display="none";
this.i_u_frame.style.width="10px";
this.i_u_frame.style.height="10px";
this.i_u_frame.i_started=false;
this.i_u_frame.pObj=this;
this.i_u_holder.appendChild(this.i_u_frame);
this.i_u_form=document.createElement('FORM');
this.i_u_form.enctype="multipart/form-data";
this.i_u_form.setAttribute('encoding', 'multipart/form-data');
this.i_u_form.method="post";
this.i_u_form.action=this.parent().uploadURI();
this.i_u_form.target=frameName;
var inp_unm=document.createElement('INPUT');
inp_unm.type="hidden";
inp_unm.name="unm";
inp_unm.value=user_prefs['user_name'];
this.i_u_form.appendChild(inp_unm);
var inp_uid=document.createElement('INPUT');
inp_uid.type="hidden";
inp_uid.name="userid";
inp_uid.value=user_prefs['user_id'];
this.i_u_form.appendChild(inp_uid);
var inp_sid=document.createElement('INPUT');
inp_sid.type="hidden";
inp_sid.name="sid";
inp_sid.value=user_prefs['session_id'];
this.i_u_form.appendChild(inp_sid);
this.i_inp_csid=document.createElement('INPUT');
this.i_inp_csid.type="hidden";
this.i_inp_csid.name="objectId";
this.i_inp_csid.value=this.parent().objectId();
this.i_u_form.appendChild(this.i_inp_csid);
this.i_inp_type=document.createElement('INPUT');
this.i_inp_type.type="hidden";
this.i_inp_type.name="objectType";
this.i_inp_type.value=this.parent().objectType();
this.i_u_form.appendChild(this.i_inp_type);
this.i_inp_meth=document.createElement('INPUT');
this.i_inp_meth.type="hidden";
this.i_inp_meth.name="method";
this.i_inp_meth.value=(this.parent().stage() ? "stage" : "attach");
this.i_u_form.appendChild(this.i_inp_meth);
this.i_inp_success=document.createElement('INPUT');
this.i_inp_success.type="hidden";
this.i_inp_success.name="success";
this.i_inp_success.value="<script>top.UniversalAttachmentManager.success("+this.parent().i_manager_id+", "+this.i_fid+", %lld, %lld );</script>";
this.i_u_form.appendChild(this.i_inp_success);
var inp_button=document.createElement('INPUT');
inp_button.type="submit";
inp_button.name="uploadButton";
inp_button.value="";
this.i_u_form.appendChild(inp_button);
this.i_file_input.name="attachment";
this.i_u_form.appendChild(this.i_file_input);
this.i_u_holder.appendChild(this.i_u_form);
document.body.appendChild(this.i_u_holder);
if(document.all) {
this.handleIframeError();
} else {
EventHandler.register(this.i_u_frame, "onload", this.handleIframeError, this);
}
if (this.parent().active()==true) {
this.submitUpload();
}
else {
this.waiting(true);
}
}
UniversalFileAttachment.prototype.waiting=function(state) {
if (state!=undefined) {
this.i_waiting=state;
}
return this.i_waiting;
}
UniversalFileAttachment.prototype.submitUpload=function() {
if (this.i_u_form!=undefined) {
this.i_u_frame.i_started=true;
this.i_inp_csid.value=this.parent().objectId();
this.i_u_form.setAttribute('encoding', 'multipart/form-data');
this.i_u_form.submit();	
}
}
UniversalFileAttachment.prototype.cancel=function() {
if (this.i_u_frame!=undefined && this.state()==1) {
this.i_u_frame.location="/Ioffice/Common/blank.html";	
document.body.removeChild(this.i_u_holder);	
}
this.parent().removeFile(this);
if (this.waiting()!=true && this.parent().active()==false) {
this.parent().active(true);
}
}
UniversalFileAttachment.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_display==name) {
this.displayName(name);
}
if (this.i_obj!=undefined) {
this.i_obj.name=this.name();
}
}
return this.i_name;
}
UniversalFileAttachment.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_file!=undefined) {
var t=TextDimension("&nbsp;"+this.getFormattedDisplayName()+" ("+UniversalFileAttachment.filterSize(this.size())+")", "FileAttachment_name_adjust");
var nameWidth=t.width;
if (nameWidth+UniversalAttachmentManager.iconWidth+UniversalAttachmentManager.actionWidth > this.width()) {
nameWidth=this.width() - UniversalAttachmentManager.iconWidth - UniversalAttachmentManager.actionWidth;
}
this.i_file_text.style.width=nameWidth+"px";
this.i_file.style.width=this.width()+"px";
}
}
return this.i_width;
}
UniversalFileAttachment.prototype.size=function(size) {
if (size!=undefined) {
this.i_size=size;
if (this.i_file!=undefined) {
var t=TextDimension("&nbsp;"+this.displayName()+" ("+UniversalFileAttachment.filterSize(this.size())+")", "FileAttachment_name_adjust");
var nameWidth=t.width;
if (nameWidth+UniversalAttachmentManager.iconWidth+UniversalAttachmentManager.actionWidth > this.width()) {
nameWidth=this.width() - UniversalAttachmentManager.iconWidth - UniversalAttachmentManager.actionWidth;
}
this.i_file_text.style.width=nameWidth+"px";
this.i_file_text.innerHTML="&nbsp;"+this.getFormattedDisplayName()+" ("+UniversalFileAttachment.filterSize(this.size())+")";
}
if (this.i_obj!=undefined) {
this.i_obj.size=this.size();
}
if (this.onchangesize!=undefined) {
var o=new Object();
o.type="changesize";
o.file=this;
this.onchangesize(o);
}
}
return this.i_size;
}
UniversalFileAttachment.prototype.state=function(state) {
if (state!=undefined) {
this.i_state=state;
if (state==0) {
this.waiting(false);
}
if (this.i_file!=undefined) {
this.i_file_state.className="FileAttachment_state "+UniversalAttachmentManager.cssStateNames[this.state()];
this.i_file_action_img.className=(this.state()==0 ? "FileAttachment_remove" : "FileAttachment_cancel");
}
if (this.onchangestate!=undefined) {
var o=new Object();
o.type="changestate";
o.file=this;
this.onchangestate(o);
}
}
return this.i_state;
}
UniversalFileAttachment.prototype.attachmentObject=function() {
if (this.i_obj==undefined) {
this.i_obj=new Object();
this.i_obj.name=this.name();
this.i_obj.size=this.size();
this.i_obj.id=this.id();
}
return this.i_obj;
}
UniversalFileAttachment.prototype.getFile=function() {
if (this.i_file==undefined) {
this.i_file=document.createElement('DIV');
this.i_file.className="FileAttachment";
this.i_file.style.height=UniversalAttachmentManager.rowHeight+"px";
this.i_file.style.width=this.width()+"px";
this.i_file_state=document.createElement('DIV');
this.i_file_state.className="FileAttachment_state "+UniversalAttachmentManager.cssStateNames[this.state()];
this.i_file_state.style.width=UniversalAttachmentManager.stateWidth+"px";
this.i_file_state.style.height=UniversalAttachmentManager.stateHeight+"px";
this.i_file_state.style.marginTop=Math.floor((UniversalAttachmentManager.rowHeight - UniversalAttachmentManager.iconHeight) / 2)+"px";
this.i_file_state.innerHTML="&nbsp;";
this.i_file.appendChild(this.i_file_state);
var t=TextDimension(this.getFormattedDisplayName()+" ("+UniversalFileAttachment.filterSize(this.size())+")", "FileAttachment_name_adjust");
var nameWidth=t.width;
if (nameWidth+UniversalAttachmentManager.iconWidth+UniversalAttachmentManager.actionWidth+2 > this.width()) {
nameWidth=this.width() - ((UniversalAttachmentManager.iconWidth - UniversalAttachmentManager.actionWidth)+2);
}
this.i_file_text=document.createElement('DIV');
this.i_file_text.className="FileAttachment_name";
this.i_file_text.style.width=nameWidth+"px";
this.i_file_text.style.height=UniversalAttachmentManager.rowHeight+"px";
this.i_file_text.style.lineHeight=UniversalAttachmentManager.rowHeight+"px";
var stage=this.parent().stage();
this.i_file_text.innerHTML="&nbsp;"+this.getFormattedDisplayName()+" ("+UniversalFileAttachment.filterSize(this.size())+")";
this.i_file.appendChild(this.i_file_text);
this.i_file_action=document.createElement('DIV');
this.i_file_action.className="FileAttachment_action";
this.i_file_action.style.width=UniversalAttachmentManager.actionWidth+"px";
this.i_file_action.style.height=UniversalAttachmentManager.rowHeight+"px";
this.i_file_action.style.lineHeight=UniversalAttachmentManager.rowHeight+"px";
this.i_file_action_img=document.createElement('div');
this.i_file_action_img.className=(this.state()==0 ? "FileAttachment_remove" : "FileAttachment_cancel");
this.i_file_action_img.style.width="16px";
this.i_file_action_img.style.height="16px";
this.i_file_action_img_tip=new ToolTip(this.i_file_action_img, undefined, "Delete this attachment");
this.i_file_action.appendChild(this.i_file_action_img);
EventHandler.register(this.i_file_action_img, "onclick", this.cancel, this);
this.i_file.appendChild(this.i_file_action);
}
return this.i_file;
}
UniversalFileAttachment.prototype.getFormattedDisplayName=function() {
var stage=this.parent().stage();
return (stage ? "" : "<a target='_blank' href='"+this.parent().uploadURI()+"?unm="+user_prefs['user_name']+"&sid="+user_prefs['session_id']+"&objectId="+this.parent().objectId()+"&objectType="+this.parent().objectType()+"&attachmentid="+this.id()+"&method=fetch&attachmentname="+escape(escape(this.displayName()))+"'>")+this.displayName()+(stage ? "" : "</a>");
}
function InvisibleUploadButton(container, attachTarget) {
this.i_container=container;
if (attachTarget) this.i_attachTarget=attachTarget;
this.i_e_mouseover=EventHandler.register(this.i_container, "onmouseover", this.reposition, this);
this.i_e_mousemove=EventHandler.register(this.i_container, "onmousemove", this.reposition, this);
this.i_e_mouseout=EventHandler.register(this.i_container, "onmouseout", this.reposition, this);
this.i_badRegions=[];
this.i_enabled=true;
this.build();
}
InvisibleUploadButton.prototype.badRegions=function(regions) {
if (regions!=undefined && regions.splice!=undefined) {
this.i_badRegions=regions;
this.reposition();
}
return this.i_badRegions;
}
InvisibleUploadButton.prototype.hidden=function(hide) {
if (hide!=undefined && this.i_obj!=undefined) {
this.i_obj.style.display=(hide ? "none" : "");
}
return this.i_obj==undefined || this.i_obj.style.display=="none";
}
InvisibleUploadButton.prototype.enabled=function(enabled) {
if (enabled!=undefined) {
this.i_enabled=(enabled ? true : false);
this.hidden((enabled ? false : true));
}
return this.i_enabled;
}
InvisibleUploadButton.prototype.handleUploadChange=function(e) {
if (this.onupload!=undefined) {
document.body.removeChild(this.i_obj);
if (this.i_e_objMouseMove) {
this.i_e_objMouseMove.unregister();
delete this.i_e_objMouseMove;
}
if (this.i_attachTarget) {
document.body.removeChild(this.i_obj);
if (this.i_attachTarget!=null) this.i_attachTarget.appendChild(this.i_obj);
}
var o=new Object();
o.type="upload";
o.input=this.i_obj;
this.onupload(o);
}
this.build();
}
InvisibleUploadButton.prototype.parent=function() {
return this.i_container;
}
InvisibleUploadButton.prototype.attachTarget=function() {
return this.i_attachTarget==undefined ? document.body : this.i_attachTarget;
}
InvisibleUploadButton.prototype.reposition=function() {
if (!this.enabled()) return;
if (this.i_obj!=undefined) {
var x=0, y=0;
var target=this.i_container;
var hide=false;
while (target.offsetParent) {
x+=target.offsetLeft;
y+=target.offsetTop;
target=target.offsetParent;
}
var cursorx=CursorMonitor.getX(),
cursory=CursorMonitor.getY(),
containerwidth=parseInt(this.i_container.style.width.replace(/[^0-9.]+/,''));
containerheight=parseInt(this.i_container.style.height.replace(/[^0-9.]+/,''));
if (cursorx==undefined || cursory==undefined) return;
var hide=(cursorx < x || cursorx > (x+containerwidth) ||
cursory < y || cursory > (y+containerheight));
if (!hide) {
for (var i=0; i < this.i_badRegions.length;++i) {
var obj=this.i_badRegions[i];
if (cursorx - x >=obj[0] && cursorx - x <=(obj[0]+obj[2]) &&
cursory - y >=obj[1] && cursory - y <=(obj[1]+obj[3])) {
hide=true;
break;
}
}
}
if (this.hidden()!=hide) this.hidden(hide);
this.i_obj.style.left=(cursorx - (!document.all ? containerwidth*2 : 20))+"px";
this.i_obj.style.top=(cursory - 10)+"px";
}
}
InvisibleUploadButton.prototype.build=function() {
if (this.i_e_uploadChange!=undefined) {
this.i_e_uploadChange.unregister();
this.i_e_uploadChange=undefined;
if (this.i_obj!=undefined) {
if (this.i_e_objMouseMove) {
this.i_e_objMouseMove.unregister();
delete this.i_e_objMouseMove;
}
this.i_obj.style.width="0px";
this.i_obj.style.height="0px";
this.i_obj.style.top="-600px";
this.i_obj.style.left="-600px";
this.hidden(true);
}
}
this.i_obj=document.createElement("input");
this.i_obj.type="file";
this.i_e_objMouseMove=EventHandler.register(this.i_obj, "onmousemove", this.reposition, this);
this.i_e_uploadChange=EventHandler.register(this.i_obj, "onchange", this.handleUploadChange, this);
this.i_obj.style.opacity="0.00";
this.i_obj.style.KhtmlOpacity="0.00";
this.i_obj.style.MozOpacity="0.00";
this.i_obj.style.filter="alpha(opacity=00)";
this.i_obj.style.position="absolute";
this.i_obj.style.width="0px";
this.i_obj.style.zIndex="99999";
this.hidden(true);
document.body.appendChild(this.i_obj);
this.reposition();
}
JavaScriptResource.notifyComplete("./lib/components/Component.UniversalFileAttachment.js");
PopoutWindow.registerGroup("TabbedPane", ["TabbedPane",
"TabbedPaneTab"]);
function TabbedPane(width, height, orientation, message) {
this.i_width=width;
this.i_height=height;
this.i_message=message;
this.i_orientation=(orientation!=undefined ? orientation : 0);
this.i_tabs=Array();
this.i_scrollVisible=false;
this.i_min_tab_width=TabbedPane.minimumWidth;
this.i_max_tab_width=TabbedPane.maximumWidth;
this.i_scrollPosition=0;
this.i_tab_visible=true;
this.i_active_stack=Array();
}
TabbedPane.maximumWidth=170;
TabbedPane.minimumWidth=60;
TabbedPane.tabHeight=22;
TabbedPane.tabSpacing=3;
TabbedPane.scrollWidth=26;
TabbedPane.contentPadding=4;
TabbedPane.closeWidth=16;
TabbedPane.tabLeftWidth=4;
TabbedPane.tabRightWidth=4;
TabbedPane.prototype.onfocus=null;
TabbedPane.prototype.onadd=null;
TabbedPane.prototype.onremove=null;
TabbedPane.prototype.onblur=null;
TabbedPane.prototype.onresize=null;
TabbedPane.prototype.oncontextmenu=null;
TabbedPane.prototype.controlWindow=function(windowObject) {
if (windowObject!=undefined) {
this.i_window=windowObject;
if (this.i_window_l==undefined) {
this.i_window_l=EventHandler.register(this.i_tab_row, "onmousedown", WindowObject.startMove, windowObject);
}
}
return this.i_window;
}
TabbedPane.prototype.message=function(message) {
if (message!=undefined) {
this.i_message=message;
if (this.i_message_pane!=undefined) {
this.i_message_pane.innerHTML=(message!=undefined ? message : "");
}
}
return this.i_message;
}
TabbedPane.prototype.scrollPosition=function(position) {
if (position!=undefined) {
if (this.tabs().length <=this.possibleTabs()) {
position=0;
}
else {
if (position > this.tabs().length - this.possibleTabs()) {
position=this.tabs().length - this.possibleTabs();
}
}
if (position < 0) {
position=0;
}
this.i_scrollPosition=position;	
for (var x=0; x < this.i_tabs.length; x++) {
this.i_tabs[x].tabVisible(x >=this.scrollPosition() && x < this.scrollPosition()+this.possibleTabs());
}
this.updateBorderBreak();
}
return this.i_scrollPosition;
}
TabbedPane.prototype.tabsVisible=function(state) {
if (state!=undefined) {
this.i_tab_visible=state;
if (this.i_tab_row!=undefined) {
this.i_tab_row.style.display=(this.tabsVisible() ? "" : "none");
}
this.height(this.height());
}
return this.i_tab_visible;
}
TabbedPane.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
this.calculateWidth();
if (this.i_pane!=undefined) {
this.i_pane.style.width=this.width()+"px";
this.i_tab_row.style.width=this.width()+"px";
this.i_tab_items.style.width=(this.width() - (this.scrollVisible() ? 2 * TabbedPane.scrollWidth : 0))+"px";
this.i_tab_content.style.width=this.width()+"px";
this.i_tab_border.style.width=(this.width() - 1)+"px";
this.scrollPosition(this.scrollPosition());
}
if (this.i_message_pane!=undefined) {
this.i_message_pane.style.width=this.contentWidth()+"px";
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.pane=this;
this.onresize(o);
}
}
return this.i_width;
}
TabbedPane.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_pane!=undefined) {
this.i_pane.style.height=this.height()+"px";
this.i_tab_content.style.height=(this.height() - (this.tabsVisible() ? TabbedPane.tabHeight : 0))+"px";
}
if (this.i_message_pane!=undefined) {
this.i_message_pane.style.height=this.contentHeight()+"px";
this.i_message_pane.style.lineHeight=this.contentHeight()+"px";
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.pane=this;
this.onresize(o);
}
}
return this.i_height;
}
TabbedPane.prototype.orientation=function(orientation) {
if (orientation!=undefined) {
this.i_orientation=orientation;
for (var x=0; x < this.i_tabs.length; x++) {
this.i_tabs[x].orientation(orientation);
}
if (this.i_pane!=undefined) {
this.i_pane.removeChild(this.i_tab_row);
this.i_pane.removeChild(this.i_tab_border);
this.i_pane.removeChild(this.i_tab_content);
if (this.orientation()==0) {
this.i_pane.appendChild(this.i_tab_row);
this.i_pane.appendChild(this.i_tab_border);
this.i_pane.appendChild(this.i_tab_content);
}
else {
this.i_pane.appendChild(this.i_tab_content);
this.i_pane.appendChild(this.i_tab_border);
this.i_pane.appendChild(this.i_tab_row);
}
this.i_tab_content.style.borderTopWidth=(this.orientation()==0 ? 0 : 1)+"px";
this.i_tab_content.style.borderBottomWidth=(this.orientation()==0 ? 1 : 0)+"px";
this.i_tab_border.className=(this.orientation()==0 ? "TabbedPane_border_top" : "TabbedPane_border_bottom");
}
}
return this.i_orientation;
}
TabbedPane.prototype.tabs=function(index) {
if (index!=undefined) {
return this.i_tabs[index];
}
return this.i_tabs;
}	
TabbedPane.prototype.addTab=function(tab, beforeTab) {
var append=true;
if (beforeTab!=undefined) {
for (var x=0; x < this.i_tabs.length; x++) {
if (this.i_tabs[x]==beforeTab) {
this.i_tabs.splice(x, 0, tab);
if (this.i_tab_row!=undefined) {
this.i_tab_items.insertBefore(tab.getTab(), beforeTab.getTab());
}
append=false;
break;
}
}
}
if (append) {
this.i_tabs[this.i_tabs.length]=tab;
if (this.i_tab_row!=undefined) {
this.i_tab_items.appendChild(tab.getTab());
}
}
tab.i_parent=this;
tab.orientation(this.orientation());
this.calculateWidth();
if (this.onadd!=undefined) {
var o=new Object();
o.type="add";
o.tab=tab;
o.pane=this;
this.onadd(o);
}
return tab;
}
TabbedPane.prototype.removeTab=function(tab) {
for (var x=0; x < this.i_tabs.length; x++) {
if (this.i_tabs[x]==tab) {
this.i_tabs.splice(x, 1);
tab.i_parent=undefined;
if (this.i_tab_row!=undefined) {
this.i_tab_items.removeChild(tab.getTab());
}
if (this.activeTab()==tab) {
this.activeTab(false);
}
for (var x=this.i_active_stack.length - 1; x >=0; x--) {
if (this.i_active_stack[x]==tab) {
this.i_active_stack.splice(x, 1);
}
}
this.calculateWidth();
if (this.onremove!=undefined) {
var o=new Object();
o.type="remove";
o.tab=tab;
o.pane=this;
this.onremove(o);
}
return true;
}
}
return false;
}
TabbedPane.prototype.selectLastActive=function() {
if (this.i_active_stack.length > 0) {
this.activeTab(this.i_active_stack[this.i_active_stack.length - 1]);
}
else {
this.activeTab(false);
}
}
TabbedPane.prototype.activeTab=function(tab) {
if (tab!=undefined) {
var oldActive=this.i_active_tab;
if (tab===false) {
tab=undefined;
}
if(this.i_active_tab!=tab) {
this.i_active_tab=tab;
if (tab!=undefined) {
this.i_active_stack[this.i_active_stack.length]=tab;
tab.active(true);
var o=new Object();
o.type="focus";
o.tab=tab;
if (this.onfocus!=undefined) {
o.pane=this;
this.onfocus(o);
}
}
if (oldActive!=undefined) {
oldActive.active(false);
var o=new Object();
o.type="blur";
o.tab=oldActive;
if (this.onblur!=undefined) {
o.pane=this;
this.onblur(o);
}
}
if (tab!=undefined) {
var r=true;
for (var x=0; x < this.i_tabs.length; x++) {
if (this.i_tabs[x]==tab) {
if (x < this.scrollPosition() || x > this.scrollPosition()+this.possibleTabs()) {
this.scrollPosition(x);
r=false;
}
break;
}
}
if (r) {
this.scrollPosition(this.scrollPosition());
}
}
this.contentPane((tab!=undefined && tab.contentPane()!=undefined) ? tab.contentPane() : false);
this.updateBorderBreak();
}
}
return this.i_active_tab;
}
TabbedPane.prototype.scrollVisible=function(state) {
if (state!=undefined) {
this.i_scrollVisible=state;
if (this.i_pane!=undefined) {
this.i_tab_arrow_left.style.display=(state ? "" : "none");
this.i_tab_arrow_right.style.display=(state ? "" : "none");
this.i_tab_items.style.width=(this.width() - (this.scrollVisible() ? 2 * TabbedPane.scrollWidth : 0))+"px";
}
}
return this.i_scrollVisible;
}
TabbedPane.prototype.contentPane=function(content) {
if (content!=undefined) {
if (content===false) {
content=undefined;
}
this.i_content=content;
if (this.i_tab_content!=undefined) {
if (this.i_last_content!=undefined) {
this.i_tab_content.removeChild(this.i_last_content);
this.i_last_content=undefined;
}
if (content!=undefined) {
this.i_tab_content.appendChild(content);
this.i_last_content=content;
}
else {
if (this.message()!="" && this.message()!=undefined) {
this.i_tab_content.appendChild(this.messagePane());
this.i_last_content=this.messagePane();
}
}
}
}
return this.i_content;
}
TabbedPane.prototype.possibleTabs=function() {
if (this.i_possible==undefined) {
this.calculateWidth();
}
return this.i_possible;
}
TabbedPane.prototype.updateBorderBreak=function() {
var l=(this.scrollVisible() ? TabbedPane.scrollWidth : 0);
var w=0;
var breakVis=false;
for (var x=0; x < this.i_tabs.length; x++) {
if (this.i_tabs[x].active() && this.i_tabs[x].tabVisible()) {
breakVis=true;
w=this.i_tabs[x].effectiveWidth() - TabbedPane.tabSpacing - 2;
break;
}
if (this.i_tabs[x].tabVisible()) {
l+=this.i_tabs[x].effectiveWidth();
}
}
if (this.i_tab_border_break!=undefined) {
this.i_tab_border_break.style.left=l+"px";
this.i_tab_border_break.style.width=w+"px";
this.i_tab_border_break.style.display=((this.tabsVisible() && breakVis) ? "" : "none");
}
}
TabbedPane.prototype.calculateWidth=function() {
var w=this.width();
var tabWidth=this.maximumTabWidth();
var useScroll=false;
var totalTabWidth=tabWidth * this.i_tabs.length;
var totalSetWidth=0;
var curSetWidth=0;
var setWidthCnt=0;
var setWidthArray=Array();
var setWidthPcnt
for (var x=0; x < this.i_tabs.length;++x) {
if (this.i_tabs[x].i_set_width > 0) {
curSetWidth=this.i_tabs[x].i_set_width;
setWidthArray.push(curSetWidth);++setWidthCnt;
}
totalSetWidth+=curSetWidth;
}
if (setWidthCnt > 0) {
var tabCnt=this.i_tabs.length - setWidthCnt;
var overWidth=0;
var minusTabWidth=0;
var changeSetWidth=false;
totalTabWidth=(tabWidth * (tabCnt))+totalSetWidth;
if (totalTabWidth > w) {
overWidth=totalTabWidth - w;
if (this.i_tabs.length==setWidthCnt) {
minusTabWidth=Math.ceil(overWidth / this.i_tabs.length);
changeSetWidth=true;
} else {
minusTabWidth=Math.ceil(overWidth / (this.i_tabs.length - setWidthCnt)); 
}
}
var availPaneWidth=(w > totalSetWidth ? w - totalSetWidth : 0);
tabWidth=(tabCnt > 0 ? Math.floor((availPaneWidth) / tabCnt) : 0);
if (tabWidth > this.maximumTabWidth) {
tabWidth=this.maximumTabWidth;
}
var possible=0;
if (tabWidth > 0) {
possible=Math.floor(((availPaneWidth) - (useScroll ? TabbedPane.scrollWidth * 2 : 0)) / tabWidth);
} else {
possible=setWidthCnt;
}
possible+=setWidthCnt;
var useWidth=Math.floor((w - (useScroll ? TabbedPane.scrollWidth * 2 : 0)) / possible);							
} else {
if (totalTabWidth > w) {
tabWidth=Math.floor(w / this.i_tabs.length);
if (tabWidth < this.minimumTabWidth()) {
tabWidth=this.minimumTabWidth();
useScroll=true;
}
}
var possible=Math.floor((w - (useScroll ? TabbedPane.scrollWidth * 2 : 0)) / tabWidth);
var useWidth=Math.floor((w - (useScroll ? TabbedPane.scrollWidth * 2 : 0)) / possible);			
}
if (useWidth <=0) {
useWidth=1;
}
else if (useWidth > this.maximumTabWidth()) {
useWidth=this.maximumTabWidth();
}
this.i_possible=possible;
this.scrollVisible(useScroll);
var newWidth=0;
for (var x=0; x < this.i_tabs.length;++x) {
if (setWidthCnt > 0) {
if (this.i_tabs[x].i_set_width > 0) {
newWidth=this.i_tabs[x].i_set_width;
if (changeSetWidth==true) newWidth -=minusTabWidth;
} else {
newWidth=tabWidth - minusTabWidth;
}
} else {
newWidth=useWidth;
}
this.i_tabs[x].effectiveWidth(newWidth);
this.i_tabs[x].tabVisible(x >=this.scrollPosition() && x < this.scrollPosition()+possible);
}
if (this.i_tab_border_break!=undefined) {
this.i_tab_border_break.style.width=(useWidth - 2 - TabbedPane.tabSpacing)+"px";
}
this.updateBorderBreak();
}
TabbedPane.prototype.messagePane=function() {
if (this.i_message_pane==undefined) {
this.i_message_pane=document.createElement('DIV');
this.i_message_pane.className="TabbedPane_message";
this.i_message_pane.innerHTML=(this.message()!=undefined ? this.message() : "");
this.i_message_pane.style.width=this.contentWidth()+"px";
this.i_message_pane.style.lineHeight=this.contentHeight()+"px";
}
return this.i_message_pane;
}
TabbedPane.prototype.contentWidth=function() {
return this.width() - (2 * TabbedPane.contentPadding) - 2;
}
TabbedPane.prototype.contentHeight=function() {
return this.height() - (2 * TabbedPane.contentPadding) - (this.tabsVisible() ? TabbedPane.tabHeight : 0) - 3;
}
TabbedPane.prototype.handleArrowLeft=function(e) {
this.i_sl=EventHandler.register(document.body, "onmouseup", this.handleArrowRelease, this);
var m=this;
m.scrollPosition(m.scrollPosition() - 1);
this.i_st=setInterval(function() {
m.scrollPosition(m.scrollPosition() - 1);
}, 100);
}
TabbedPane.prototype.handleArrowRight=function(e) {
this.i_sl=EventHandler.register(document.body, "onmouseup", this.handleArrowRelease, this);
var m=this;
m.scrollPosition(m.scrollPosition()+1);
this.i_st=setInterval(function() {
m.scrollPosition(m.scrollPosition()+1);
}, 100);
}
TabbedPane.prototype.handleArrowRelease=function(e) {
clearInterval(this.i_st);
this.i_sl.unregister();	
}
TabbedPane.prototype.maximumTabWidth=function(width) {
if(width!=undefined) {
this.i_max_tab_width=width;
}
return this.i_max_tab_width;
}
TabbedPane.prototype.minimumTabWidth=function(width) {
if(width!=undefined) {
this.i_min_tab_width=width;
}
return this.i_min_tab_width;
}	
TabbedPane.prototype.getPane=function() {
if (this.i_pane==undefined) {
this.i_pane=document.createElement('DIV');
this.i_pane.className="TabbedPane";
this.i_pane.style.width=this.width()+"px";
this.i_pane.style.height=this.height()+"px";
this.i_tab_row=document.createElement('DIV');
this.i_tab_row.className="TabbedPane_tabs";
this.i_tab_row.style.width=this.width()+"px";
this.i_tab_row.style.display=(this.tabsVisible() ? "" : "none");
this.i_tab_row.style.height=(TabbedPane.tabHeight)+"px";
this.i_tab_arrow_left=document.createElement('DIV');
this.i_tab_arrow_left.className="TabbedPane_arrow_left";
this.i_tab_arrow_left.style.width=TabbedPane.scrollWidth+"px";
this.i_tab_arrow_left.style.height=(TabbedPane.tabHeight)+"px";
this.i_tab_arrow_left.innerHTML="&nbsp;";
this.i_tab_arrow_left.style.display=(this.scrollVisible()==true ? "" : "none");
EventHandler.register(this.i_tab_arrow_left, "onmousedown", this.handleArrowLeft, this);
this.i_tab_row.appendChild(this.i_tab_arrow_left);
this.i_tab_items=document.createElement('DIV');
this.i_tab_items.className="TabbedPane_tab_items";
this.i_tab_items.style.width=(this.width() - (this.scrollVisible() ? 2 * TabbedPane.scrollWidth : 0))+"px";
this.i_tab_items.style.height=(TabbedPane.tabHeight)+"px";
this.i_tab_row.appendChild(this.i_tab_items);
for (var x=0; x < this.i_tabs.length; x++) {
this.i_tab_items.appendChild(this.i_tabs[x].getTab());
}
this.i_tab_arrow_right=document.createElement('DIV');
this.i_tab_arrow_right.className="TabbedPane_arrow_right";
this.i_tab_arrow_right.style.width=TabbedPane.scrollWidth+"px";
this.i_tab_arrow_right.style.height=(TabbedPane.tabHeight)+"px";
this.i_tab_arrow_right.innerHTML="&nbsp;";
this.i_tab_arrow_right.style.display=(this.scrollVisible() ? "" : "none");
EventHandler.register(this.i_tab_arrow_right, "onmousedown", this.handleArrowRight, this);
this.i_tab_row.appendChild(this.i_tab_arrow_right);
this.i_tab_border=document.createElement('DIV');
this.i_tab_border.className=(this.orientation()==0 ? "TabbedPane_border_top" : "TabbedPane_border_bottom");
this.i_tab_border.style.width=(this.width() - 1)+"px";
this.i_tab_border_break=document.createElement('DIV');
this.i_tab_border_break.className="TabbedPane_border_break";
this.i_tab_border_break.innerHTML="&nbsp;";
this.i_tab_border_break.style.display=(this.tabsVisible() ? "" : "none");
this.i_tab_border.appendChild(this.i_tab_border_break);
this.i_tab_content=document.createElement('DIV');
this.i_tab_content.className="TabbedPane_content";
this.i_tab_content.style.width=this.width()+"px";
this.i_tab_content.style.height=(this.height() - TabbedPane.tabHeight)+"px";
this.i_tab_content.style.padding=TabbedPane.contentPadding+"px";
this.i_tab_content.style.borderTopWidth=(this.orientation()==0 ? 0 : 1)+"px";
this.i_tab_content.style.borderBottomWidth=(this.orientation()==0 ? 1 : 0)+"px";
if (this.activeTab()==undefined) {
if (this.contentPane()==undefined) {
this.i_tab_content.appendChild(this.messagePane());
this.i_last_content=this.messagePane();
}
else {
this.i_tab_content.appendChild(this.contentPane());
this.i_last_content=this.contentPane();
}
}
else {
if (this.activeTab().contentPane()!=undefined) {
this.i_tab_content.appendChild(this.activeTab().contentPane());
this.i_last_content=this.activeTab().contentPane();
}
else if (this.contentPane()!=undefined) {
this.i_tab_content.appendChild(this.contentPane());
this.i_last_content=this.contentPane();
}
else {
this.i_tab_content.appendChild(this.messagePane());
this.i_last_content=this.messagePane();
}
}
if (this.orientation()==0) {
this.i_pane.appendChild(this.i_tab_row);
this.i_pane.appendChild(this.i_tab_border);
this.i_pane.appendChild(this.i_tab_content);
}
else {
this.i_pane.appendChild(this.i_tab_content);
this.i_pane.appendChild(this.i_tab_border);
this.i_pane.appendChild(this.i_tab_row);
}
this.calculateWidth();
this.scrollPosition(this.scrollPosition());
}
return this.i_pane;
}
function TabbedPaneTab(name, iconClass, description, closable, enabled, width) {
this.i_name=name;
this.i_icon=iconClass;
this.i_enabled=(enabled!=undefined ? enabled : true);
this.i_description=description;
this.i_closable=(closable!=undefined ? closable : false);
this.i_orientation=0;
this.i_hover_state=false;
this.i_width=(width!=undefined && width > 0 ? width : TabbedPane.maximumWidth);
this.i_set_width=(width!=undefined && width > 0 ? width : 0);
this.i_visible=true;
}
TabbedPaneTab.prototype.onfocus=null;
TabbedPane.prototype.onclose=null;
TabbedPane.prototype.onblur=null;
TabbedPaneTab.prototype.height=function() {
return TabbedPane.tabHeight;
}
TabbedPaneTab.prototype.effectiveWidth=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_tab!=undefined) {
this.i_tab.style.width=(width > 0 ? width : 0)+"px";
var temp_width=this.effectiveWidth() - (TabbedPane.tabRightWidth+TabbedPane.tabLeftWidth+TabbedPane.tabSpacing) - (this.iconClass()!=undefined ? TabbedPane.tabHeight : 0) - (this.closable() ? TabbedPane.closeWidth : 0) - 6;
this.i_tab_text.style.width=(temp_width > 0 ? temp_width : 0)+"px";
temp_width=this.effectiveWidth() - (TabbedPane.tabRightWidth+TabbedPane.tabLeftWidth+TabbedPane.tabSpacing);
this.i_tab_center.style.width=(temp_width > 0 ? temp_width : 0)+"px";
}
}
return this.i_width;
}
TabbedPaneTab.prototype.parent=function() {
return this.i_parent;
}
TabbedPaneTab.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_tab_text!=undefined) {
this.i_tab_text.innerHTML=this.name();
}
}
return this.i_name;
}
TabbedPaneTab.prototype.enabled=function(enabled) {
if (enabled!=undefined) {
this.i_enabled=enabled;
this.updateClass();
}
return this.i_enabled;
}
TabbedPaneTab.prototype.orientation=function(orientation) {
if (orientation!=undefined) {
this.i_orientation=orientation;
if (this.i_tab!=undefined) {
this.updateClass();
this.i_tab.style.borderTopWidth=(this.orientation()==1 ? 0 : 1)+"px";
this.i_tab.style.borderBottomWidth=(this.orientation()==1 ? 1 : 0)+"px";
}
}
return this.i_orientation;
}
TabbedPaneTab.prototype.active=function(state) {
if (state!=undefined) {
this.i_active=state;
if (this.parent()!=undefined) {
if (state) {
if (this.parent().activeTab()!=this) {
this.parent().activeTab(this);
}
}
else {
if (this.parent().activeTab()==this) {
this.parent().activeTab(false);
}
}
}
if (state==true && this.onfocus!=undefined) {
var o=new Object();
o.type="focus";
o.tab=this;
this.onfocus(o);
}
if (state==false && this.onblur!=undefined) {
var o=new Object();
o.type="blur";
o.tab=this;
this.onblur(o);
}
this.updateClass();
}
return this.i_active;
}
TabbedPaneTab.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined) {
if (iconClass===false) {
iconClass=undefined;
}
this.i_icon=iconClass;
if (this.i_tab!=undefined) {
this.i_tab_icon.className="TabbedPaneTab_icon"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
this.i_tab_text.style.width=(this.effectiveWidth() - (TabbedPane.tabRightWidth+TabbedPane.tabLeftWidth+TabbedPane.tabSpacing) - (this.iconClass()!=undefined ? TabbedPane.tabHeight : 0) - (this.closable() ? TabbedPane.closeWidth : 0) - 6)+"px";
this.i_tab_icon.style.width=(this.iconClass()!=undefined ? TabbedPane.tabHeight+3 : 3)+"px";
}
}
return this.i_icon;
}
TabbedPaneTab.prototype.textClass=function(txt_class) {
if(txt_class!==undefined) {
if(txt_class===false) {
txt_class="";
}
this.i_text_class=txt_class;
this.updateClass();
}
return this.i_text_class;
}
TabbedPaneTab.prototype.updateClass=function() {
if(this.i_tab!=undefined) {
this.i_tab.className="TabbedPaneTab "+(this.orientation()==0 ? "TabbedPaneTab_orientation_top" : "TabbedPaneTab_orientation_bottom")+" "+(this.hoverState() ? "TabbedPaneTab_hover" : "TabbedPaneTab_normal")+" "+(this.active() ? "TabbedPaneTab_active" : "TabbedPaneTab_inactive")+" "+(this.enabled() ? "TabbedPaneTab_enabled" : "TabbedPaneTab_disabled");
}
if(this.i_tab_text!=undefined) {
this.i_tab_text.className="TabbedPaneTab_text "+(this.enabled() ? "TabbedPaneTab_enabled" : "TabbedPaneTab_disabled");
}
}
TabbedPaneTab.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
}
return this.i_description;
}
TabbedPaneTab.prototype.contentPane=function(content) {
if (content!=undefined) {
if (content==false) {
content=undefined;
}
this.i_content=content;
if (this.parent()!=undefined) {
if (this.parent().activeTab()==this) {
this.parent().activeTab(this);
}
}
}
return this.i_content;
}
TabbedPaneTab.prototype.closable=function(closable) {
if (closable!=undefined) {
this.i_closable=closable;
if (this.i_tab!=undefined) {
this.updateClass();
this.i_tab_text.style.width=(this.effectiveWidth() - (TabbedPane.tabRightWidth+TabbedPane.tabLeftWidth+TabbedPane.tabSpacing) - (this.iconClass()!=undefined ? TabbedPane.tabHeight : 0) - (this.closable() ? TabbedPane.closeWidth : 0) - 6)+"px";
this.i_tab_close.style.display=(this.closable() ? "" : "none");
}
}
return this.i_closable;
}
TabbedPaneTab.prototype.close=function() {
var o=new Object();
o.type="close";
o.cancelClose=false;
o.tab=this;
if (this.onclose!=undefined) {
this.onclose(o);
}
if (o.cancelClose!=true) {
var act=(this.parent().activeTab()==this);
var p=this.parent();
p.removeTab(this);
if (act) {
p.selectLastActive();
}
return true;
}
return false;
}
TabbedPaneTab.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover_state=state;
if (this.i_tab!=undefined) {
this.updateClass();
this.i_tab_text.style.width=(this.effectiveWidth() - (TabbedPane.tabRightWidth+TabbedPane.tabLeftWidth+TabbedPane.tabSpacing) - (this.iconClass()!=undefined ? TabbedPane.tabHeight : 0) - (this.closable() ? TabbedPane.closeWidth : 0) - 6)+"px";
this.i_tab_close.className=(this.hoverState() ? "TabbedPaneTab_close_hover" : "TabbedPaneTab_close");
}
}
return this.i_hover_state;
}
TabbedPaneTab.prototype.tabVisible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_tab!=undefined) {
this.i_tab.style.display=(this.tabVisible() ? "" : "none");
}
}
return this.i_visible;
}
TabbedPaneTab.prototype.handleTabMouseOver=function(e) {
this.hoverState(true);
}
TabbedPaneTab.prototype.handleTabMouseOut=function(e) {
this.hoverState(false);	
}
TabbedPaneTab.prototype.handleTabClick=function(e) {
if (this.enabled()) {
this.active(true);
}
}
TabbedPaneTab.prototype.handleTabClose=function(e) {
if (this.closable()) {
this.close();
}
}
TabbedPaneTab.prototype.handleTabContext=function(e) {
if (this.parent().oncontextmenu!=undefined) {
e.tab=this;
this.parent().oncontextmenu(e);
}
}
TabbedPaneTab.prototype.getTab=function() {
if (this.i_tab==undefined) {
this.i_tab=document.createElement('DIV');
this.updateClass();
this.i_tab.style.width=this.effectiveWidth()+"px";
this.i_tab.style.height=TabbedPane.tabHeight+"px";
this.i_tab.style.borderTopWidth=(this.orientation()==1 ? 0 : 1)+"px";
this.i_tab.style.borderBottomWidth=(this.orientation()==1 ? 1 : 0)+"px";
this.i_tab.style.display=(this.tabVisible() ? "" : "none");
EventHandler.register(this.i_tab, "oncontextmenu", this.handleTabContext, this);
EventHandler.register(this.i_tab, "onselectstart", EventHandler.cancelEvent);
EventHandler.register(this.i_tab, "onmouseover", this.handleTabMouseOver, this);
EventHandler.register(this.i_tab, "onmouseout", this.handleTabMouseOut, this);
this.i_tab_left=document.createElement('DIV');
this.i_tab_left.className="TabbedPaneTab_left";
this.i_tab_left.style.width=TabbedPane.tabLeftWidth+"px";
this.i_tab_left.style.height=TabbedPane.tabHeight+"px";
this.i_tab_left.innerHTML="&nbsp;";
this.i_tab.appendChild(this.i_tab_left);
this.i_tab_center=document.createElement('DIV');
this.i_tab_center.className="TabbedPaneTab_center";
this.i_tab_center.style.width=(this.effectiveWidth() - (TabbedPane.tabRightWidth+TabbedPane.tabLeftWidth+TabbedPane.tabSpacing))+"px";
this.i_tab_center.style.height=TabbedPane.tabHeight+"px";;
this.i_tab.appendChild(this.i_tab_center);
this.i_tab_icon=document.createElement('DIV');
this.i_tab_icon.className="TabbedPaneTab_icon"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
this.i_tab_icon.style.width=(this.iconClass()!=undefined ? TabbedPane.tabHeight+3 : 3)+"px";
this.i_tab_icon.style.height=(TabbedPane.tabHeight - 4)+"px";
this.i_tab_icon.style.marginTop="4px";
EventHandler.register(this.i_tab_icon, "onclick", this.handleTabClick, this);
this.i_tab_icon.innerHTML="&nbsp;";
this.i_tab_center.appendChild(this.i_tab_icon);
this.i_tab_text=document.createElement('DIV');
this.updateClass();
this.i_tab_text.style.width=(this.effectiveWidth() - (TabbedPane.tabRightWidth+TabbedPane.tabLeftWidth+TabbedPane.tabSpacing) - (this.iconClass()!=undefined ? TabbedPane.tabHeight : 0) - (this.closable() ? TabbedPane.closeWidth : 0) - 6)+"px";
this.i_tab_text.style.height=TabbedPane.tabHeight+"px";
EventHandler.register(this.i_tab_text, "onclick", this.handleTabClick, this);
this.i_tab_text.innerHTML=this.name();
this.i_tab_center.appendChild(this.i_tab_text);
this.i_tab_close=document.createElement('DIV');
this.i_tab_close.className="TabbedPaneTab_close";
this.i_tab_close.style.width=TabbedPane.closeWidth+"px";
this.i_tab_close.style.height=TabbedPane.tabHeight+"px";
this.i_tab_close.innerHTML="&nbsp;";
EventHandler.register(this.i_tab_close, "onclick", this.handleTabClose, this);
this.i_tab_center.appendChild(this.i_tab_close);
this.i_tab_right=document.createElement('DIV');
this.i_tab_right.className="TabbedPaneTab_right";
this.i_tab_right.style.width=TabbedPane.tabRightWidth+"px";
this.i_tab_right.style.height=TabbedPane.tabHeight+"px";
this.i_tab_right.innerHTML="&nbsp;";
this.i_tab.appendChild(this.i_tab_right);
}
return this.i_tab;
}
JavaScriptResource.notifyComplete("./lib/components/Component.TabbedPane.js");	
function SplitPane(orientation) {
if(typeof orientation!="undefined" &&
(orientation==SplitPane.HORIZONTAL || 
orientation==SplitPane.VERTICAL)) {
this.i_orientation=orientation;
}else{ 
this.i_orientation=SplitPane.HORIZONTAL;
}
this.i_content=null;
this.i_contentPaneOne=null;
this.i_contentPaneTwo=null;
this.i_sizedPane=SplitPane.PANE_ONE;
this.i_sizedPaneSize="50%";
this.i_hiddenPane=false;
this.i_hiddenPaneNum=0;
this.i_in_drag=false;
}
SplitPane.prototype.onresize=null;
SplitPane.prototype.onresizepaneone=null;
SplitPane.prototype.onresizepanetwo=null;
SplitPane.HORIZONTAL=0;
SplitPane.VERTICAL=1;
SplitPane.PANE_ONE=1;
SplitPane.PANE_TWO=2;
SplitPane.prototype.orientation=function() {
return this.i_orientation;
};
SplitPane.prototype.paneOneContent=function(content) {
if(typeof content!="undefined") {
this.i_contentPaneOne=content;
if(typeof this.i_contentPaneOneContainer!="undefined") {
try {
this.i_contentPaneOneContainer.removeChild(this.i_contentPaneOneContainer.firstChild);
}catch(e) {
}
this.i_contentPaneOneContainer.appendChild(content);
}
}
return this.i_contentPaneOne;
};
SplitPane.prototype.paneTwoContent=function(content) {
if(typeof content!="undefined") {
this.i_contentPaneTwo=content;
if(typeof this.i_contentPaneTwoContainer!="undefined") {
try {
this.i_contentPaneTwoContainer.removeChild(this.i_contentPaneTwoContainer.firstChild);
}catch(e) {
}
this.i_contentPaneTwoContainer.appendChild(content);
}
}
return this.i_contentPaneTwo;
};
SplitPane.prototype.width=function(width) {
if(typeof width!="undefined") {
this.i_width=width;
this.recalculateSplitSizes();
}
return this.i_width;
};
SplitPane.prototype.height=function(height) {
if(typeof height!="undefined") {
this.i_height=height;
this.recalculateSplitSizes();
}
return this.i_height;
};
SplitPane.prototype.resize=function(o) {
var width=o.width;
var height=o.height;
if(typeof width!="undefined") {
this.width(width);
}
if(typeof height!="undefined") {
this.height(height);
}
}
SplitPane.prototype.recalculateSplitSizes=function() {
if(this.i_orientation==SplitPane.HORIZONTAL) {
var calcSize=this.i_sizedPaneSize;
if(this.i_sizedPaneSize.indexOf("%") > -1) {
calcSize=parseFloat("."+this.i_sizedPaneSize) * this.i_height;
}
var remainingSize=this.i_height - calcSize - 5;
if(this.i_sizedPane==SplitPane.PANE_ONE) {
this.i_contentPaneOneContainer.style.height=calcSize+"px";
this.i_contentPaneTwoContainer.style.height=remainingSize+"px";
}else if (this.i_sizedPane==SplitPane.PANE_TWO){
this.i_contentPaneOneContainer.style.height=remainingSize+"px";
this.i_contentPaneTwoContainer.style.height=calcSize+"px";
}
this.i_contentPaneOneContainer.style.width=this.i_width+"px";
this.i_contentPaneTwoContainer.style.width=this.i_width+"px";
this.i_resizeBar.style.width=this.i_width+"px";
}else if(this.i_orientation==SplitPane.VERTICAL) {
var calcSize=this.i_sizedPaneSize;
if(this.i_sizedPaneSize.indexOf("%") > -1) {
calcSize=parseFloat("."+this.i_sizedPaneSize) * this.i_width;
}
var remainingSize=this.i_width - calcSize - 5;
if(this.i_sizedPane==SplitPane.PANE_ONE) {
this.i_contentPaneOneContainer.style.width=calcSize+"px";
this.i_contentPaneTwoContainer.style.width=remainingSize+"px";
}else if (this.i_sizedPane==SplitPane.PANE_TWO){
this.i_contentPaneOneContainer.style.width=remainingSize+"px";
this.i_contentPaneTwoContainer.style.width=calcSize+"px";
}
this.i_contentPaneOneContainer.style.height=this.i_height+"px";
this.i_contentPaneTwoContainer.style.height=this.i_height+"px";
this.i_resizeBar.style.height=this.i_height+"px";
}
if(this.onresize!==null) {
var o=new Object();
o.type="resize";
o.width=this.i_width;
o.height=this.i_height;
this.onresize(o);
}
if(this.onresizepaneone!==null) {
var o=new Object();
o.type="resizepaneone";
o.width=this.i_contentPaneOneContainer.offsetWidth;
o.height=this.i_contentPaneOneContainer.offsetHeight;
if(o.width > 0 && o.height > 0) {
this.onresizepaneone(o);
}
}
if(this.onresizepanetwo!==null) {
var o=new Object();
o.type="resizepanetwo";
o.width=this.i_contentPaneTwoContainer.offsetWidth;
o.height=this.i_contentPaneTwoContainer.offsetHeight;
if(o.width > 0 && o.height > 0) {
this.onresizepanetwo(o);
}
}
};
SplitPane.prototype.setSize=function(paneNumber, size) {
this.i_sizedPane=paneNumber;
this.i_sizedPaneSize=""+size;
if(this.i_content!==null) {
this.recalculateSplitSizes();
}
};
SplitPane.prototype.allowResize=function(lock) {
};
SplitPane.prototype.getContent=function() {
if(this.i_content===null) {
this.i_content=document.createElement('div');
var cp1=this.i_contentPaneOneContainer=document.createElement('div');
if(this.i_contentPaneOne!=null) {
cp1.appendChild(this.i_contentPaneOne);
}
var cp2=this.i_contentPaneTwoContainer=document.createElement('div');
if(this.i_contentPaneTwo!=null) {
cp2.appendChild(this.i_contentPaneTwo);
}
var resize_bar=this.i_resizeBar=document.createElement('div');
EventHandler.register(resize_bar, "onmousedown", this.handleResizeMouseDown, this);
if(this.i_orientation==SplitPane.HORIZONTAL) {
resize_bar.className="WindowObject_resize";
resize_bar.style.height="5px";
}else if (this.i_orientation==SplitPane.VERTICAL) {
resize_bar.className="WindowColumn_resize";
resize_bar.style.width="5px";
cp1.style.cssFloat="left";
resize_bar.style.cssFloat="left";
cp2.style.cssFloat="left";
}
resize_bar.style.backgroundColor="gray";
this.i_content.appendChild(cp1);
this.i_content.appendChild(resize_bar);
this.i_content.appendChild(cp2);
this.i_content.style.width=this.i_width+"px";
this.i_content.style.height=this.i_height+"px";
}
return this.i_content;
};
SplitPane.prototype.handleResizeMouseDown=function() {
if(this.i_in_drag==false) {
this.i_in_drag=true;
if(this.i_orientation==SplitPane.HORIZONTAL) {
this.i_drag_start=CursorMonitor.getY();
}else{
this.i_drag_start=CursorMonitor.getX();
}
this.i_drag_up_handler=EventHandler.register(document, "onmouseup", this.handleResizeMouseUp, this);
this.i_drag_move_handler=EventHandler.register(document, "onmousemove", this.handleResizeMouseMove, this);
}
};
SplitPane.prototype.handleResizeMouseMove=function() {
if(this.i_in_drag==true) {
if(this.i_orientation==SplitPane.HORIZONTAL) {
var y=CursorMonitor.getY();
this.setSize(SplitPane.PANE_ONE, (parseInt(this.i_contentPaneOneContainer.style.height)+(y - this.i_drag_start)));
this.i_drag_start=y;
}else{
var x=CursorMonitor.getX();
this.setSize(SplitPane.PANE_ONE, (parseInt(this.i_contentPaneOneContainer.style.width)+(x - this.i_drag_start)));
this.i_drag_start=x;
}
}
}
SplitPane.prototype.handleResizeMouseUp=function() {
if(this.i_in_drag==true) {
this.i_in_drag=false;
this.i_drag_up_handler.unregister();
this.i_drag_move_handler.unregister();
if(this.i_orientation==SplitPane.HORIZONTAL) {
var y=CursorMonitor.getY();
this.setSize(SplitPane.PANE_ONE, (parseInt(this.i_contentPaneOneContainer.style.height)+(y - this.i_drag_start)));
}else{
var x=CursorMonitor.getX();
this.setSize(SplitPane.PANE_ONE, (parseInt(this.i_contentPaneOneContainer.style.width)+(x - this.i_drag_start)));
}
}
};
SplitPane.prototype.hidePane=function(paneNum, hide) {
this.i_hiddenPane=hide;
this.i_hiddenPaneNum=paneNum;
if(hide) {
this.i_resizeBar.style.display="none";
if(paneNum==SplitPane.PANE_ONE) {
this.i_contentPaneOneContainer.style.display="none";
}else if(paneNum==SplitPane.PANE_TWO) {
this.i_contentPaneTwoContainer.style.display="none";
}
}else{
this.i_resizeBar.style.display="";
if(paneNum==SplitPane.PANE_ONE) {
this.i_contentPaneOneContainer.style.display="";
}else if(paneNum==SplitPane.PANE_TWO) {
this.i_contentPaneTwoContainer.style.display="";
}
}
};
JavaScriptResource.notifyComplete("./lib/components/Component.SplitPane.js");
function SystemCore() {
}
SystemCore.onchangeapplication=null;
SystemCore.i_applications=Array();
SystemCore.title=function(title) {
if (title!=undefined) {
SystemCore.i_title=title;
}
return SystemCore.i_title;
}
SystemCore.documentTitle=function(title) {
if (title!=undefined) {
SystemCore.i_document_title=title;
document.title=title;
}
return SystemCore.i_document_title;
}
SystemCore.companyURL=function(company_URL) {
if (company_URL!=undefined) {
SystemCore.company_URL=company_URL;
}
return SystemCore.company_URL;
}
SystemCore.logo=function(logo_path) {
if (logo_path!=undefined) {
SystemCore.i_logo=logo_path;
}
return SystemCore.i_logo;
}
SystemCore.loadPrintContent=function(content, forcePrint) {
if (content!=undefined) {
if (SystemCore.i_print_holder==undefined) {
SystemCore.i_print_holder=document.getElementById('DocumentPrintDefault');
}
var preview=document.getElementById('DocumentPrintPreview');
if (SystemCore.i_print_preview!=undefined) {
preview.removeChild(SystemCore.i_print_preview);
preview.appendChild(SystemCore.i_print_holder);
}
if (content==false) {
content=null;
}
SystemCore.i_print_preview=content;	
if (content!=undefined) {
preview.removeChild(SystemCore.i_print_holder);
preview.appendChild(SystemCore.i_print_preview);
}
if (forcePrint==true) {
window.print();
}
}
return SystemCore.i_print_preview;
}
SystemCore.locked=function(state, message) {
if (state==true) {
if (SystemCore.i_lock_pane==undefined) {
SystemCore.i_lock_pane=document.createElement('DIV');
SystemCore.i_lock_pane.className="SystemCore_lock_pane";
}
SystemCore.i_lock_pane.style.left="0px";
SystemCore.i_lock_pane.style.top="0px";
SystemCore.i_lock_pane.style.width=CursorMonitor.browserWidth()+"px";
SystemCore.i_lock_pane.style.height=CursorMonitor.browserHeight()+"px";
SystemCore.i_lock_pane.style.lineHeight=CursorMonitor.browserHeight()+"px";
SystemCore.i_lock_pane.innerHTML=((message!=undefined) ? message : "&nbsp;");
document.body.appendChild(SystemCore.i_lock_pane);
}
else {
try {
document.body.removeChild(SystemCore.i_lock_pane);
} catch (e) { }
}
}
SystemCore.shortcutPane=function() {
if (SystemCore.i_shortcut_pane==undefined) {
SystemCore.i_shortcut_window=new WindowObject('gen-shortcuts', "Shortcuts", 100, 200, Application.titleBarFactory());
SystemCore.i_shortcut_window.titleBar().removeButton(Application.i_title_close);
SystemCore.i_shortcut_window.minimumHeight(40);
SystemCore.i_shortcut_pane=new ShortcutPane(100, 100);
SystemCore.i_shortcut_window.loadContent(SystemCore.i_shortcut_pane.getPane());
EventHandler.register(SystemCore.i_shortcut_window, "oncontentresize", SystemCore.handleShortcutResize);
}
return SystemCore.i_shortcut_pane;
}
SystemCore.handleShortcutResize=function(e) {
if (SystemCore.i_shortcut_pane!=undefined) {
if (SystemCore.i_shortcut_window.effectiveWidth()!=undefined) {
SystemCore.i_shortcut_pane.width(SystemCore.i_shortcut_window.effectiveWidth() - 2);
}
if (SystemCore.i_shortcut_window.effectiveHeight()!=undefined) {
SystemCore.i_shortcut_pane.height(SystemCore.i_shortcut_window.effectiveHeight() - SystemCore.i_shortcut_window.titleBar().height() - 2);
}
}
}
SystemCore.navigationBar=function() {
if (SystemCore.i_nav==undefined) {
SystemCore.i_nav=new NavigationBar(500, false);
SystemCore.i_nav.logoPath(SystemCore.logo());
SystemCore.i_nav.logoText(SystemCore.title());
if(GDSConfiguration.layout_on && !_LITE_ && !(SystemCore.hasApp(3006))) { 
SystemCore.i_nav_layout=SystemCore.i_nav.addLink(new NavigationLink("Layout Manager", "NavigationBar_link_layout", SystemCore.layoutManager().getContext()));
}
if(user_prefs['user_name'].indexOf('bluetie.')==-1) {
SystemCore.i_nav_prefs=SystemCore.i_nav.addLink(new NavigationLink("Preferences", "NavigationBar_link_prefs"));
EventHandler.register(SystemCore.i_nav_prefs, "onclick", SystemCore.launchPreferences);
}
SystemCore.i_nav_help=SystemCore.i_nav.addLink(new NavigationLink("Help", "NavigationBar_link_help"));
EventHandler.register(SystemCore.i_nav_help, "onclick", SystemCore.launchHelp);
SystemCore.i_nav_logout=SystemCore.i_nav.addLink(new NavigationLink("Logout", "NavigationBar_link_logout"));
EventHandler.register(SystemCore.i_nav_logout, "onclick", SystemCore.handleLogout);
if (SystemCore.layoutManager().activeConfiguration()!=undefined) {
SystemCore.i_nav.minimized(SystemCore.layoutManager().activeConfiguration().minimizedNavigation()==true ? true : false);
}
SystemCore.i_nav.ordering(SystemCore.layoutManager().getButtonOrdering());
}
return SystemCore.i_nav;
}
SystemCore.hasApp=function(appid) {
if(SystemCore.i_appIdCache==undefined) {
SystemCore.i_appIdCache=[];
}
var appc=SystemCore.i_appIdCache;
if(appc[appid]==undefined) {
for(var x=app_ids.length - 1; x >=0; x--) {
if(app_ids[x]==appid) {
appc[appid]=true;
break;
}
appc[appid]=false;
}
}
return appc[appid];
}
SystemCore.handleLogout=function(e) {
if (SystemCore.layoutManager().modified()) { 
if (SystemCore.layoutManager().autoSave()==2) { 
var o=new Object();
o.type="save";
SystemCore.layoutManager().handleSaveLayout(o);
}
}
sessionTimeout(false);
}
SystemCore.launchHelp=function() {
window.open(user_prefs['help_link'], "", "toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1,width=320,height=300");
}
SystemCore.launchPreferences=function() {
if (SystemCore.i_preference_manager==undefined) {
SystemCore.i_preference_manager=new OldPreferenceManager(650, 500);
SystemCore.i_preference_manager.open();
SystemCore.i_application_preferences_to_load=0;
for(var i=0; i < SystemCore.i_applications.length; i++) {
var section=SystemCore.i_applications[i].preferenceSection();
if(section) {
SystemCore.i_preference_manager.addSection(section);
SystemCore.i_application_preferences_to_load++;
EventHandler.register(SystemCore.i_applications[i], "onloadpreferencefiles", SystemCore.handleLoadPreferenceFiles);
}
}
for(i=0; i < SystemCore.i_applications.length; i++) {
var section=SystemCore.i_applications[i].preferenceSection();
if(section) {
SystemCore.i_applications[i].loadPreferenceFiles();
}
}
} else {
SystemCore.i_preference_manager.open();
SystemCore.preferencesLoadComplete();
}
}
SystemCore.handleLoadPreferenceFiles=function(e) {
SystemCore.i_application_preferences_to_load--;
if(SystemCore.i_application_preferences_to_load==0) {
SystemCore.preferencesLoadComplete();
}
}
SystemCore.preferencesLoadComplete=function() {
if(SystemCore.onpreferencesloadcomplete) {
var o={
"type": "preferencesloadcomplete",
"manager": SystemCore.i_preference_manager
};
SystemCore.onpreferencesloadcomplete(o);
}
SystemCore.i_preference_manager.finishOpen();
}
SystemCore.preferenceManager=function(manager) {
if (SystemCore.i_preference_manager==undefined) {
SystemCore.i_preference_manager=new PreferenceManager
}
OldPreferenceManager.prototype.open
}
SystemCore.widgetManager=function(manager) {
if (manager!=undefined) {
SystemCore.i_widget_manager=manager;
}
return SystemCore.i_widget_manager;
}
SystemCore.windowManager=function(window_manager) {
if (window_manager!=undefined) {
SystemCore.i_window_manager=window_manager;
}
return SystemCore.i_window_manager;
}
SystemCore.layoutManager=function() {
if (SystemCore.i_layout_manager==undefined) {
SystemCore.i_layout_manager=new LayoutManager();
EventHandler.register(SystemCore.i_layout_manager, "onconfigurationchange", SystemCore.updateConfiguration);
}
return SystemCore.i_layout_manager;
}
SystemCore.updateConfiguration=function(e) {
if (SystemCore.activeApplication()!=undefined) {
var app=SystemCore.layoutManager().getLayout(SystemCore.activeApplication().id());
var gt=Array();
if (app!=undefined) {
SystemCore.windowManager().importDataNode(app.dataNode(), true);
if (LayoutManager.i_temporary[SystemCore.activeApplication().id()]!=undefined) {
for (var x=0; x < LayoutManager.i_temporary[SystemCore.activeApplication().id()].length; x++) {
gt[gt.length]=LayoutManager.i_temporary[SystemCore.activeApplication().id()][x];
}
}
}
for (var x=0; x < LayoutManager.i_temporary_globals.length; x++) {
gt[gt.length]=LayoutManager.i_temporary_globals[x];
}
SystemCore.windowManager().importTemporaryDataNodes(gt);
SystemCore.windowManager().importGlobalDataNodes(SystemCore.layoutManager().activeConfiguration().globalPods());
if (SystemCore.navigationBar()!=undefined) {
SystemCore.navigationBar().minimized(SystemCore.layoutManager().activeConfiguration().minimizedNavigation());
}
var bo=SystemCore.layoutManager().getButtonOrdering();
if (SystemCore.navigationBar()!=undefined && bo!=undefined && bo.length > 0) {
SystemCore.navigationBar().ordering(bo);
}
}
}
SystemCore.loadApplicationByName=function(app) {
for (var x=0; x < SystemCore.i_applications.length; x++) {
if (SystemCore.i_applications[x].name().toLowerCase()==app.toLowerCase()) {
return SystemCore.activeApplication(SystemCore.i_applications[x]);
}
}
return false;
}
SystemCore.activeApplication=function(application) {
if (application!=undefined) {
if (application!=SystemCore.i_active_application) {
SystemCore.navigationBar().unselectAll();
var oldApp=SystemCore.i_active_application;
if (oldApp!=undefined) {
if (oldApp.onunload!=undefined) {
var o=new Object();
o.type="unload";
o.newApplication=application;
o.oldApplication=oldApp;
o.cancelUnload=false;
oldApp.onunload(o);
if (o.cancelUnload==true) {
return SystemCore.i_active_application;
}
}
}
SystemCore.i_active_application=application;
var first=false;
if (application.i_first_load==undefined) {
first=true;
application.i_first_load=false;
}
if (application.onload!=undefined) {
var o=new Object();
o.type="load";
o.first=first;
o.newApplication=application;
o.oldApplication=oldApp;
o.cancelLoad=false;
application.onload(o);
if (o.cancelLoad==true) {
SystemCore.i_active_application=null;
application=null;
}
}
if (SystemCore.onchangeapplication!=undefined) {
var o=new Object();
o.type="changeapplication";
o.oldApplication=oldApp;
o.newApplication=application;
SystemCore.onchangeapplication(o);
}
}
if(typeof ExtensionBannerAds!="undefined") {
setTimeout(function(){ExtensionBannerAds.reconfigureSidebar(SystemCore.i_application_active)},50);
}
}
return SystemCore.i_active_application;
}
SystemCore.applications=function() {
return SystemCore.i_applications;
}
SystemCore.registerApplication=function(application) {
var srt=false;
for (var x=0; x < SystemCore.i_applications.length; x++) {
if (SystemCore.i_applications[x].loadingOrder() > application.loadingOrder()) {
SystemCore.i_applications.splice(x, 0, application);
srt=true;
break;
}
}
if (srt==false) {
SystemCore.i_applications[SystemCore.i_applications.length]=application;
}
return application;
}
SystemCore.unregisterApplication=function(application) {
for (var x=0; x < SystemCore.i_applications.length; x++) {
if (SystemCore.i_applications[x]==application) {
SystemCore.i_applications.splice(x, 1);
return true;
}
}
return false;
}
SystemCore.initialize=function() {
var o=new Object();
o.type="initialize";
for (var x=0; x < SystemCore.i_applications.length; x++) {
if (SystemCore.i_applications[x].oninitialize!=undefined) {
SystemCore.i_applications[x].oninitialize(o);
}
}
Application.poll();
setInterval(Application.poll, 60000); 
EventHandler.register(window, "onunload", SystemCore.unload);
var o=new Object();
o.type="integrate";
for (var x=0; x < SystemCore.i_applications.length; x++) {
if (SystemCore.i_applications[x].onintegrate!=undefined) {
SystemCore.i_applications[x].onintegrate(o);
}
}
var defaultApp;
if (SystemCore.layoutManager().getDefaultApplication()=='EM') {
defaultApp='EM';
} else {
defaultApp=(GDSConfiguration.login_screen_id==2 ? 1007 : 1020);
}
for (var x=0; x < SystemCore.i_applications.length; x++) { 
if (SystemCore.i_applications[x].id()==defaultApp) {
SystemCore.activeApplication(SystemCore.i_applications[x]);
break;
}
}
if(typeof(Wizard)!="undefined") {
Wizard.checkLaunchWizard();
}
}	
SystemCore.unload=function() {
PopoutWindow.closeExternalWindows();
EventHandler.unregisterAll();
EventListener.silenceAll();
if(SimpleClickDataCache!=undefined && SimpleClickDataCache.treeModels!=undefined) {
SimpleClickDataCache.treeModels["personal"]=null;
SimpleClickDataCache.treeModels["enterprise"]=null;
SimpleClickDataCache.treeModels["shared"]=null;
SimpleClickDataCache.treeModels["currentlyOnline"]=null;
}
if(typeof ApplicationEmail!="undefined" && ApplicationEmail!=undefined) {
ApplicationEmail.i_messageList=null;
}
}
JavaScriptResource.notifyComplete("./lib/System.Core.js");
function CursorMonitor() { 
}
CursorMonitor.listeners=Array();
CursorMonitor.hooked=false;
CursorMonitor.listenerID;
CursorMonitor.hook=function() {
if (!CursorMonitor.hooked) {
CursorMonitor.listenerID=EventHandler.register(document.body, "onmousemove", CursorMonitor.update,window);
CursorMonitor.hooked=true;
return true;
}
return false;
}
CursorMonitor.unhook=function() {
if (CursorMonitor.hooked) {
CursorMonitor.listenerID.unregister();
CursorMonitor.listenerID=undefined;
CursorMonitor.hooked=false;
return true;
}
return false;
}
CursorMonitor.addListener=function(callback, scope) {
CursorMonitor.listeners[CursorMonitor.listeners.length]={
callback: callback,
scope: scope
};
return CursorMonitor.listeners.length - 1;
}
CursorMonitor.removeListener=function(index) {
if (CursorMonitor.listeners[index]!=undefined) {
CursorMonitor.listeners[index]=0;
return true;
}
return false;
}
CursorMonitor.update=function(e) {
CursorMonitor.setXY(e);
for (var x=0; x < CursorMonitor.listeners.length; x++) {
var cb=CursorMonitor.listeners[x];
if (cb!=0) {
if(cb.scope!=undefined) {
cb.callback.call(cb.scope, CursorMonitor.mouseX, CursorMonitor.mouseY);
} else {
cb.callback(CursorMonitor.mouseX, CursorMonitor.mouseY);
}
}
}
if (this.backupHandler!=undefined) {
e.returnValue=this.backupHandler(e);
return e.returnValue;
}
e.returnValue=true;
return true;
}
CursorMonitor.getX=function() {
return CursorMonitor.mouseX;
}
CursorMonitor.getY=function() {
return CursorMonitor.mouseY;
}
CursorMonitor.setXY=function(e) {
if (document.all) {
var x=(event!=undefined) ? event.clientX : e.clientX;
var y=(event!=undefined) ? event.clientY : e.clientY;
CursorMonitor.mouseX=x+document.body.scrollLeft;
CursorMonitor.mouseY=y+document.body.scrollTop;
}
else {
CursorMonitor.mouseX=e.pageX;
CursorMonitor.mouseY=e.pageY;
}
return true;
}
CursorMonitor.browserWidth=function() {
return (document.all ? document.body.offsetWidth : window.innerWidth);
}
CursorMonitor.clientWidth=function() {
return document.body.clientWidth;
}
CursorMonitor.browserHeight=function() {
return (document.all ? document.body.offsetHeight : window.innerHeight);
}
CursorMonitor.clientHeight=function() {
return document.body.clientHeight;
}
JavaScriptResource.notifyComplete("./lib/listeners/Listener.CursorMonitor.js");
function EventListener() {
}
EventListener.i_handlers=Array();
EventListener.i_popout_handlers=Array();
EventListener.i_idCounter=Object();
EventListener.i_idCounter.value=0;
EventListener.listen=function(element, action, handler, old_function) {
if(element!=undefined) {
var ret=undefined;
var action_name=action.toLowerCase();
if(action_name.indexOf("on")==0) {
action_name=action_name.substr(2);
}
if(element.i_listener_key==undefined) {
element.i_listener_key=EventListener.i_idCounter.value++;
element.i_listener_counter=0;
EventListener.i_handlers[element.i_listener_key]=Array();
}
var handler_list=EventListener.i_handlers[element.i_listener_key][action_name];
if(handler_list==undefined) {
handler_list=Array();
handler_list.i_counter=0;
EventListener.i_handlers[element.i_listener_key][action_name]=handler_list;++element.i_listener_counter;
var old_handler=element[action];
if(typeof(element)=="object" && 
element.childNodes==undefined) {
element[action]=function() { 
EventListener.objectHandler.call(element, 
action_name, arguments);
}
} else {
element[action]=EventListener.handler;
}
if(old_handler!=undefined) {
if(typeof(old_handler)=="function") {
EventListener.listen(element, action, old_handler);
}
}
}
ret=handler_list.length;
var handler_entry=undefined;
if(old_function!=undefined) {
handler_entry=new Object();
handler_entry.object=element;
handler_entry.handler=new SmartHandler(handler, handler[old_function]);
handler_list.push(handler_entry);
handler_list.i_counter++;
} else if(typeof(handler)=="function") {
handler_entry=new Object();
handler_entry.object=element;
handler_entry.handler=new SmartHandler(element, handler);
handler_list.push(handler_entry);
handler_list.i_counter++;
} else if(typeof(handler)=="object") {
handler_entry=new Object();
handler_entry.object=element;
handler_entry.handler=handler;
handler_list.push(handler_entry);
handler_list.i_counter++;
} else {
ret=undefined;
}
var popout_id=undefined;
if(document.all) {
popout_id=document.popout_id;
} else {
popout_id=window.popout_id;
}
if(popout_id!=undefined && handler_entry!=undefined) {
if(EventListener.i_popout_handlers[popout_id]==undefined) {
EventListener.i_popout_handlers[popout_id]=Array();
}
handler_entry.popout_id=popout_id;
handler_entry.popout_key=EventListener.i_popout_handlers[popout_id].length;
EventListener.i_popout_handlers[popout_id].push({
key: element.i_listener_key,
action: action_name,
id: ret
});
}
return ret;
}
}
EventListener.silence=function(element, action, id) {
if(element!=undefined) {
var action_name=action.toLowerCase();
if(action_name.indexOf("on")==0) {
action_name=action_name.substr(2);
}
if(element.i_listener_key!=undefined) {
var handler_list=EventListener.i_handlers[element.i_listener_key][action_name];
if(handler_list!=undefined) {
var handler_entry=handler_list[id];
if(handler_entry!=undefined) {
handler_list[id]=null;
handler_list.i_counter--;
if(handler_list.i_counter <=0) {
EventListener.i_handlers[element.i_listener_key][action_name]=null;
element[action]=null;
--element.i_listener_counter;
if(element.i_listener_counter <=0) {
element.i_listener_counter=null;
EventListener.i_handlers[element.i_listener_key]=null;
element.i_listener_key=null;
}
}
if(handler_entry.popout_id!=undefined) {
EventListener.i_popout_handlers[handler_entry.popout_id][handler_entry.popout_key]=null;
handler_entry.popout_id=null;
handler_entry.popout_key=null;
}
handler_entry.object=null;
handler_entry.handler=null;
}
}
}
}
}
EventListener.handler=function(e) {
var real_event=e;
var ret=true;
if(e==undefined) {
real_event=window.event;
}
if(real_event!=undefined) {
if(this.i_listener_key!=undefined) {
var handler_list=EventListener.i_handlers[this.i_listener_key][real_event.type];
if(handler_list!=undefined) {
for(var x=0; x < handler_list.length; x++) {
var handler_entry=handler_list[x];
if(handler_entry!=undefined) {
if(!handler_entry.handler.execute(Array(real_event, undefined, this), true)) {
ret=false;
}
}
}
}
}
}
return ret;
}
EventListener.objectHandler=function(action_name, args) {
if(action_name!=undefined) {
if(this.i_listener_key!=undefined) {
var handler_list=EventListener.i_handlers[this.i_listener_key][action_name];
if(handler_list!=undefined && handler_list.length > 0) {
for(var x=0; x < handler_list.length; x++) {
var handler_entry=handler_list[x];
if(handler_entry!=undefined) {
handler_entry.handler.executeUnwrap(args);
}
}
}
}
}
}
EventListener.silenceAll=function() {
for(var x=0; x < EventListener.i_idCounter.value;++x) {
var handler_root=EventListener.i_handlers[x];
if(handler_root!=undefined) {
for(var y in handler_root) {
var handler_list=handler_root[y];
if(handler_list!=undefined && typeof handler_list!="function" && handler_list.splice!=undefined) {
for(var z=handler_list.length - 1; z >=0 ; --z) {
var handler_object=handler_list[z];
if(handler_object!=undefined) {
var object=handler_object.object;
if(object!=undefined) {
EventListener.silence(object, "on"+y, z);
}
}
}
}
}
}
}
}
EventListener.silenceAllPopout=function() {
var popout_id=undefined;
if(document.all) {
popout_id=document.popout_id;
} else {
popout_id=window.popout_id;
}
if(popout_id!=undefined) {
var popout_handlers=EventListener.i_popout_handlers[popout_id];
if(popout_handlers!=undefined) {
for(var x=0; x < popout_handlers.length;++x) {
if(popout_handlers[x]!=undefined) {
var key=popout_handlers[x].key;
var action=popout_handlers[x].action;
var id=popout_handlers[x].id;
var element_handler_list=EventListener.i_handlers[key];
if(element_handler_list!=undefined) {
var handler_list=element_handler_list[action];
if(handler_list!=undefined) {
var handler_object=handler_list[id];
if(handler_object!=undefined) {
EventListener.silence(handler_object.object, "on"+action, id);
}
}
}
}
}
EventListener.i_popout_handlers[popout_id]=null;
}
}
}
JavaScriptResource.notifyComplete("./lib/listeners/Listener.EventListener.js");
function EventHandler(obj, type, callback, scope) {
this.i_obj=obj;
this.i_type=type;
this.i_callback=callback;
this.i_scope=scope;
this.i_popout_id=undefined;
this.i_popout_key=undefined;
}
EventHandler.i_handlers=Array();
EventHandler.i_popout_handlers=Array();
EventHandler.i_idCounter=Object();
EventHandler.i_idCounter.value=0;
EventHandler.prototype.obj=function() {
return this.i_obj;
}
EventHandler.prototype.type=function(type) {
return this.i_type;
}
EventHandler.prototype.callback=function(callback) {
if (callback!=undefined) {
this.i_callback=callback;
}
return this.i_callback;
}
EventHandler.prototype.scope=function(scope) {
if (scope!=undefined) {
this.i_scope=scope;
}
return this.i_scope;
}
EventHandler.prototype.execute=function(e) {
if (e==undefined) {
e=new Object();
e.type=this.type();
e.autoGenerated=true;
}
var cb=this.callback();
if (cb!=undefined) {
if (this.scope()!=undefined) {
try {
cb.call
document.body;
}catch(e) {
this.unregister();
return true;
}
return cb.call(this.scope(), e);
}
else {
return cb.call(this.obj(), e);
}
}
}
EventHandler.prototype.unregister=function() {
var ret=false;
if(this.type()!=null) {
var hStack=EventHandler.i_handlers[this.obj().i_handler_key][this.type()];
for (var x=0; x < hStack.length; x++) {
if (hStack[x]==this) {
hStack[x]=null;
hStack.i_counter--;
if(hStack.i_counter <=0){
EventHandler.i_handlers[this.obj().i_handler_key][this.type()]=null;
this.obj()[this.type()]=null;
--this.obj().i_handler_counter;
if(this.obj().i_handler_counter <=0) {
this.obj().i_handler_counter=null;
EventHandler.i_handlers[this.obj().i_handler_key]=null
this.obj().i_handler_key=null;
}
}
if(this.i_popout_id!=undefined) {
EventHandler.i_popout_handlers[this.i_popout_id][this.i_popout_key]=null;
this.i_popout_id=null;
this.i_popout_key=null;
}
ret=true;
}
}
}
this.i_scope=null;
this.i_type=null;
this.i_callback=null;
this.i_obj=null;
return ret;		
}
EventHandler.register=function(obj, handler_name, callback, scope) {
var nh=new EventHandler(obj, handler_name, callback, scope);
if (obj.i_handler_key==undefined) {
obj.i_handler_key=EventHandler.i_idCounter.value++;
obj.i_handler_counter=0;
EventHandler.i_handlers[obj.i_handler_key]=Array();
}
var hStack=EventHandler.i_handlers[obj.i_handler_key];
if (hStack[handler_name]==undefined) {
hStack[handler_name]=Array();
hStack[handler_name].i_counter=0;++obj.i_handler_counter;
if(obj[handler_name]==undefined) {
obj[handler_name]=EventHandler.handleEventTrigger;
} else {
var old=obj[handler_name];
obj[handler_name]=EventHandler.handleEventTrigger;
EventHandler.register(obj, handler_name, old);
}
}
hStack[handler_name][hStack[handler_name].length]=nh;
hStack[handler_name].i_counter++;
var popout_id=undefined;
if(document.all) {
popout_id=document.popout_id;
} else {
popout_id=window.popout_id;
}
if(popout_id!=undefined) {
if(EventHandler.i_popout_handlers[popout_id]==undefined) {
EventHandler.i_popout_handlers[popout_id]=Array();
}
var handler_entry=new Object();
handler_entry.key=obj.i_handler_key;
handler_entry.action=handler_name;
handler_entry.id=hStack[handler_name].length - 1;
nh.i_popout_id=popout_id;
nh.i_popout_key=EventHandler.i_popout_handlers[popout_id].length;
EventHandler.i_popout_handlers[popout_id].push(handler_entry);
}
return nh;
}
EventHandler.handleEventTrigger=function(e) {
var ev=((document.all && e==undefined) ? event : e);
if(ev==undefined) {
var cur=this;
while(cur.offsetParent!=null) {
cur=cur.offsetParent;
}
if(cur.document.getEventObject!=undefined) {
ev=cur.document.getEventObject();
}
}
if (!ev) {
for (var x=0; x < frames.length; x++) {
if (frames[x].event) {
ev=frames[x].event;
break;
} else if (frames[x].frames.length > 0) {
for (var y=0; y < frames[x].frames.length; y++) {
if (frames[x].frames[y].event) {
ev=frames[x].frames[y].event;
break;
}
}
}
}			
}
if (!ev)
return true;
ev.originalScope=this;
var obj=this;
var name="on"+ev.type;
if (typeof EventHandler!="undefined" && obj.i_handler_key!=undefined) {
var hStack=EventHandler.i_handlers[obj.i_handler_key][name];
if (hStack!=undefined) {
for (var x=0; x < hStack.length; x++) {
var h=hStack[x];
if (h!=undefined) {
h.execute(ev);
}
}
}
if (ev.returnValue==false) {
return false;
}
}
return true;
}
EventHandler.cancelEvent=function(e) {
var ev=((document.all && e==undefined) ? event : e);
ev.cancelBubble=true;
ev.returnValue=false;
return false;
}
EventHandler.unregisterAll=function() {
for(var x=0; x < EventHandler.i_idCounter.value;++x) {
var handler_root=EventHandler.i_handlers[x];
if(handler_root!=undefined) {
for(var y in handler_root) {
var handler_list=handler_root[y];
if(handler_list!=undefined && typeof handler_list!="function" && handler_list.splice!=undefined) {
for(var z=handler_list.length - 1; z >=0; --z) {
var handler=handler_list[z];
if(handler!=undefined) {
handler.unregister();
}
}
}
}
}
}
EventHandler.i_popout_handlers=null;
}
EventHandler.unregisterAllPopout=function() {
var popout_id=undefined;
if(document.all) {
popout_id=document.popout_id;
} else {
popout_id=window.popout_id;
}
if(popout_id!=undefined) {
var popout_handlers=EventHandler.i_popout_handlers[popout_id];
if(popout_handlers!=undefined) {
for(var x=0; x < popout_handlers.length;++x) {
if(popout_handlers[x]!=undefined) {
var key=popout_handlers[x].key;
var handler_name=popout_handlers[x].action;
var id=popout_handlers[x].id;
var element_handler_list=EventHandler.i_handlers[key];
if(element_handler_list!=undefined) {
var handler_list=element_handler_list[handler_name];
if(handler_list!=undefined) {
var handler=handler_list[id];
if(handler!=undefined) {
handler.unregister();
}
}
}
}
}
}
EventHandler.i_popout_handlers[popout_id]=null;
}
}
JavaScriptResource.notifyComplete("./lib/listeners/Listener.EventHandler.js");
function HotKey(key, comboKeys, handler) {
this.i_key=key;
this.i_comboKeys=comboKeys;
this.i_handler=handler;	
this.i_registered=false;
}
HotKey.prototype.handler=function(handler) {
if (handler!==undefined) {
this.i_handler=handler;
}
return this.i_handler;
}
HotKey.prototype.register=function() {
this.i_registered=true;
if (!HotKey.i_listeners[this.i_key]) {
HotKey.i_listeners[this.i_key]=new Array();
}
else {
for (var x=0; x < HotKey.i_listeners[this.i_key].length; x++) {
if (HotKey.i_listeners[this.i_key][x]==this) {
HotKey.i_listeners[this.i_key].splice(x, 1);
}
}
}
HotKey.i_listeners[this.i_key].push(this);
HotKey.log('registered', this.i_key, this.i_comboKeys);
}
HotKey.prototype.unregister=function() {
if (this.i_registered) {
this.i_registered=false;
var listeners=HotKey.i_listeners[this.i_key];
for (var c=0; c < listeners.length; c++) {
if (listeners[c]==this) {
listeners.splice(c, 1);
break;
}
}
HotKey.log('unregistered', this.i_key, this.i_comboKeys);
}
}
HotKey.prototype.keyCode=function(key_code) {
if (key_code!==undefined) {
var register=this.i_registered;
if (register) this.unregister();
this.i_key=key_code;
if (register) this.register();
}
return this.i_key;
}
HotKey.prototype.comboKeys=function(comboKeys) {
if (comboKeys!==undefined) {
this.i_comboKeys=comboKeys;
}
return this.i_comboKeys;
}
HotKey.ctrlKey=1;
HotKey.altKey=2;
HotKey.shiftKey=4;
HotKey.i_listeners=new Object();
HotKey.i_devel=false;
HotKey.unregisterAll=function() {
HotKey.i_listeners=new Object();
HotKey.log('unregistered all');
}
HotKey.hook=function() {
if (!HotKey.hooked) {
HotKey.hooked=EventListener.listen(document, "onkeydown",
HotKey.keyDownHandler);
HotKey.hooked2=EventListener.listen(document, "onkeypress",
HotKey.keyPressHandler);
HotKey.log('hooked');
}
}
HotKey.unhook=function() {
if (HotKey.hooked) {
EventListener.silence(document, "onkeydown", HotKey.hooked);
EventListener.silence(document, "onkeypress", HotKey.hooked2);
HotKey.hooked=undefined;
HotKey.hooked2=undefined;
HotKey.log('unhooked');
}
}
HotKey.development=function(state) {
if (state!==undefined) {
if (state!=HotKey.i_devel) {
HotKey.i_devel=state;
console.log('HotKey: Development mode '+(state?'on':'off'));
}
}
return(HotKey.i_devel);
}
HotKey.keyPressHandler=function(keyEvent) {
var targ=(keyEvent.target ? keyEvent.target : keyEvent.srcElement);
if (targ) {
if (targ.type=="textarea" || targ.type=="text") {
return true;
}
}		
var keyPressed=(keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which);
var comboKeys=keyEvent.ctrlKey * HotKey.ctrlKey;
comboKeys+=keyEvent.altKey * HotKey.altKey;
comboKeys+=keyEvent.shiftKey * HotKey.shiftKey;
HotKey.log('pressed', keyPressed, comboKeys);
if (((keyPressed=='r'.charCodeAt(0) && comboKeys && HotKey.ctrlKey) ||
(keyPressed=='R'.charCodeAt(0) && comboKeys - (keyEvent.shiftKey * HotKey.shiftKey) && HotKey.ctrlKey) ||
(keyPressed=='f'.charCodeAt(0) && comboKeys && HotKey.ctrlKey) ||
(keyPressed=='o'.charCodeAt(0) && comboKeys && HotKey.ctrlKey) ||
(keyPressed=='p'.charCodeAt(0) && comboKeys && HotKey.ctrlKey) ||
(keyPressed=='a'.charCodeAt(0) && comboKeys && HotKey.ctrlKey))){
keyEvent.cancelBubble=true;
keyEvent.returnValue=false;
if (keyEvent.stopPropagation!=undefined) {
keyEvent.stopPropagation();
}
if (keyEvent.preventDefault!=undefined) {
keyEvent.preventDefault();
}
try {
keyEvent[keyEvent.keyCode ? "keyCode" : "which"]=0;
} catch (e) {} 
return false;
}
return true;
}
HotKey.keyDownHandler=function(keyEvent) {
var targ=(keyEvent.target ? keyEvent.target : keyEvent.srcElement);
if (targ) {
if (targ.type=="textarea" || targ.type=="text") {
return true;
}
}		
var keyPressed=(keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which);
var comboKeys=keyEvent.ctrlKey * HotKey.ctrlKey;
comboKeys+=keyEvent.altKey * HotKey.altKey;
comboKeys+=keyEvent.shiftKey * HotKey.shiftKey;
var listeners=HotKey.i_listeners[keyPressed];
HotKey.log('down', keyPressed, comboKeys);
if (!listeners) {
return true;
}
for (var c=listeners.length - 1; c >=0; c--) {
var listener=listeners[c];
if (comboKeys==listener.comboKeys()) {
if (listener.i_handler.execute!=undefined) {
if (listener.i_handler.execute(Array(listener, keyEvent), true)==true) {
keyEvent.cancelBubble=true;
keyEvent.returnValue=false;
if (keyEvent.stopPropagation!=undefined) {
keyEvent.stopPropagation();
}
if (keyEvent.preventDefault!=undefined) {
keyEvent.preventDefault();
}
try {
keyEvent[keyEvent.keyCode ? "keyCode" : "which"]=0;
} catch (e) {} 
return false;
}
}
else {
if (listener.i_handler(listener, keyEvent)==true) {
keyEvent.cancelBubble=true;
keyEvent.returnValue=false;
if (keyEvent.stopPropagation!=undefined) {
keyEvent.stopPropagation();
}
if (keyEvent.preventDefault!=undefined) {
keyEvent.preventDefault();
}
try {
keyEvent[keyEvent.keyCode ? "keyCode" : "which"]=0;
} catch (e) {} 
return false;
}
}
HotKey.log('executed', keyPressed, comboKeys);
break;
}
}
return true;
}
HotKey.log=function(action, key, comboKeys) {
if (!HotKey.i_devel) {
return;
}
var logText='HotKey: '+action+' - ';
if (comboKeys) {
logText+=(comboKeys & HotKey.ctrlKey) ? 'Ctrl + ' : '';
logText+=(comboKeys & HotKey.altKey) ? 'Alt + ' : '';
logText+=(comboKeys & HotKey.shiftKey) ? 'Shift + ' : '';
}
if (key) {
logText+="'"+String.fromCharCode(key)+"'";
logText+=' ('+key+')';
}
console.log(logText);
}
JavaScriptResource.notifyComplete("./lib/listeners/Listener.Hotkey.js");
PopoutWindow.registerGroup("DisplayManager", ["DisplayConfiguration",
"DisplayView",
"DisplayViewFloat",
"DisplayViewColumn",
"DisplayViewWindow"]);
function DisplayConfiguration(id, name) {
this.i_name=name;
this.i_id=id;
this.i_views=Array();
this.i_default;
this.i_params=Array();
}
DisplayConfiguration.prototype.id=function() {
return this.i_id;
}
DisplayConfiguration.prototype.parentId=function() {
return this.i_parent_id;
}
DisplayConfiguration.prototype.defaultView=function(view) {
if (view!=undefined) {
this.i_default=view;	
}
return this.i_default;
}
DisplayConfiguration.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_tree_node!=undefined) {
this.i_tree_node.name(name);
}
}
return this.i_name;
}
DisplayConfiguration.prototype.getTreeNode=function() {
if (this.i_tree_node==undefined) {
this.i_tree_node=new LiteDataNode(this.id(), this.name(), this.name(), (SystemCore.activeConfiguration()==this ? 2 : 1));
this.i_tree_node.i_display=this;
}
return this.i_tree_node;
}
DisplayConfiguration.prototype.getViewById=function(id) {
for (var x=0; x < this.i_views.length; x++) {
if (this.i_views[x].id()==id) {
return this.i_views[x];
}
}
return undefined;
}
DisplayConfiguration.prototype.addView=function(view) {
if (SystemCore.activeConfiguration().parentId()==this.id()) {
SystemCore.activeConfiguration().addView(view.copy());
}
view.i_parent=this;
this.i_views[this.i_views.length]=view;
if (this.i_default=undefined) {
this.i_default=view;
}
return view;
}
DisplayConfiguration.prototype.removeView=function(view) {
for (var x=0; x < this.i_views.length; x++) {
if (this.i_views[x].id()==view.id()) {
this.i_views[x].splice(x, 1);
if (SystemCore.activeConfiguration().parentId()==this.id()) {
SystemCore.activeConfiguration().removeView(SystemCore.activeConfiguration().getViewById(this.id()));
}
return true;
}
}
return false;
}
DisplayConfiguration.prototype.param=function(name, value) {
if (value!=undefined) {
this.i_params['zz_'+name]=value;
}
return this.i_params['zz_'+name];
}
DisplayConfiguration.prototype.copy=function(id) {
var nc=new DisplayConfiguration(id, this.name());
nc.i_default=this.i_default;
for (var x in this.i_params) {
if (x.substr(0, 3)=="zz_") { 
nc.i_params[x]=this.i_params[x];
}
}
for (var x=0; x < this.i_views.length; x++) {
nc.addView(this.i_views[x].copy());
}
nc.i_parent_id=this.id();
return nc;		
}
DisplayConfiguration.prototype.toString=function() {
var str="";
var tab_char="";
str+="<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n";
str+="<configuration>\n";
str+=tab_char+"<id>"+this.id()+"</id>\n";
str+=tab_char+"<name>"+this.name()+"</name>\n";
if (this.defaultView()!=undefined) {
str+=tab_char+"<default>"+this.defaultView()+"</default>\n";
}
for (var x in this.i_params) {
if (x.substr(0, 3)=='zz_') {
str+=tab_char+"<param>\n";
str+=tab_char+tab_char+"<name>"+x.substr(3)+"</name>\n";
str+=tab_char+tab_char+"<value>"+this.i_params[x]+"</value>\n";
str+=tab_char+"</param>\n";
}
}
for (var x=0; x < this.i_views.length; x++) { 
str+=this.i_views[x];
}
str+="</configuration>\n";
return str;
}
function DisplayView(application_id) {
this.i_application_id=application_id;			
this.i_columns=Array();				
this.i_floating=Array();				
this.i_params=Array();				
}
DisplayView.prototype.id=function() {
return this.i_application_id;
}
DisplayView.prototype.clear=function() {
for (var x=0; x < this.i_columns.length; x++) {
for (var z=0; z < this.i_columns[x].i_windows.length; z++) {
this.i_columns[x].i_windows[z]=null;
}
this.i_columns[x]=null;
}
this.i_columns=new Array();
return true;
}
DisplayView.prototype.clearOrdering=function() {
for (var x=0; x < this.i_floating.length; x++) {
this.i_floating[x]=null;
}	
this.i_floating=new Array();
}
DisplayView.prototype.floating=function(index) {
if (index!=undefined) {
return this.i_floating[index];
}
return this.i_floating;
}
DisplayView.prototype.addFloatingWindow=function(window) {
if (this.i_parent!=undefined && SystemCore.activeConfiguration().parentId()==this.i_parent.id()) {
SystemCore.activeConfiguration().getViewbyId(this.id()).addFloatingWindow(window.copy());
}
this.i_floating[this.i_floating.length]=window;
return window;
}
DisplayView.prototype.removeFloatingWindow=function(window) {
for (var x=0; x < this.i_floating.length; x++) {
if (this.i_floating[x]==window) {
this.i_floating.splice(x, 1);
if (SystemCore.activeConfiguration().parentId()==this.i_parent.id()) {
for (var z=0; z < SystemCore.activeConfiguration().getViewById(this.id()).floating().length; z++) {
if (SystemCore.activeConfiguration().getViewById(this.id()).floating(z).id()==window.id()) {
SystemCore.activeConfiguration().getViewById(this.id()).removeFloatingWindow(SystemCore.activeConfiguration().getViewById(this.id()).floating(z));
}
}
}
return true;
}
}
return false;
}
DisplayView.prototype.columns=function(index) {
if (index!=undefined) { 
return this.i_columns[index];
}
return this.i_columns;
}
DisplayView.prototype.addColumn=function(column) {
if(typeof column!="undefined"){
this.i_columns[this.i_columns.length]=column;
if (this.i_parent!=undefined && SystemCore.activeConfiguration().parentId()==this.i_parent.id()) {
var n=SystemCore.activeConfiguration().getViewById(this.id()).addColumn(column.copy());
n.i_parent=this;
n.i_original=column;
}
column.i_parent=this;
}
return column;
}
DisplayView.prototype.removeColumn=function(column) {
for (var x=0; x < this.i_columns.length; x++) {
if (this.i_columns[x]==column) {
this.i_columns.splice(x, 1);
if (SystemCore.activeConfiguration().parentId()==this.i_parent.id()) {
for (var z=0; z < SystemCore.activeConfiguration().getViewById(this.id()).columns().length; z++) {
if (SystemCore.activeConfiguration().getViewById(this.id()).columns(z).i_original==column) {
SystemCore.activeConfiguration().getViewById(this.id()).removeColumn(SystemCore.activeConfiguration().getViewById(this.id()).columns(z));
}
}
}
return true;
}
}
return false;
}
DisplayView.prototype.param=function(name, value) {
if (value!=undefined) {
this.i_params['zz_'+name]=value;
}
return this.i_params['zz_'+name];
}
DisplayView.prototype.copy=function() {
var nv=new DisplayView(this.id());
for (var x in this.i_params) {
if (x.substr(0, 3)=='zz_') {
nv.i_params[x]=this.i_params[x];
}
}
for (var x=0; x < this.i_columns.length; x++) {
nv.addColumn(this.i_columns[x].copy());
}
return nv;
}
DisplayView.prototype.toString=function() {
var str="";
var tab_char="";
str+=tab_char+"<application>\n";
str+=tab_char+tab_char+"<id>"+this.id()+"</id>\n";
for (var x in this.i_params) {
if (x.substr(0, 3)=='zz_') {
str+=tab_char+"<param>\n";
str+=tab_char+tab_char+"<name>"+x+"</name>\n";
str+=tab_char+tab_char+"<value>"+this.i_params[x]+"</value>\n";
str+=tab_char+"</param>\n";
}
}
for (var x=0; x < this.i_columns.length; x++) {
str+=this.i_columns[x].toString();
}
str+=tab_char+"</application>\n";
return str;
}
function DisplayViewFloat(window_id, width, height, top, left, minimized) {
this.i_id=window_id;			
this.i_width=width;			
this.i_height=height;			
this.i_top=top;			
this.i_left=left;			
this.i_minimized=(minimized!=undefined ? minimized : false); 
}
DisplayViewFloat.prototype.id=function() {
return this.i_id;
}
DisplayViewFloat.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
}
return this.i_width;
}
DisplayViewFloat.prototype.minimized=function(minimized) {
if (minimized!=undefined) {
this.i_minimized=minimized;
}
return this.i_minimized;
}
DisplayViewFloat.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
}
return this.i_height;
}
DisplayViewFloat.prototype.top=function(top) {
if (top!=undefined) {
this.i_top=top;
}
return this.i_top;
}
DisplayViewFloat.prototype.left=function(left) {
if (left!=undefined) {
this.i_left=left;
}
return this.i_left;
}
DisplayViewFloat.prototype.param=function(name, value) {
if (value!=undefined) {
this.i_params['zz_'+name]=value;
}
return this.i_params['zz_'+name];
}
DisplayViewFloat.prototype.copy=function() {
var dvf=new DisplayViewFloat(this.id(), this.width(), this.height(), this.top(), this.left(), this.minimized());
for (var x in this.i_params) {
if (x.substr(0, 3)=='zz_') {
dvf.i_params[x]=this.i_params[x];
}
}
return dvf;
}
DisplayViewFloat.prototype.toString=function() {
var tabChar="";
var str="<floatingWindow>\n";
str+=tabChar+"<id>"+this.id()+"</id>\n";
str+=tabChar+"<width>"+this.width()+"</width>\n";
str+=tabChar+"<minimized>"+this.minimized()+"</minimized>\n";
str+=tabChar+"<height>"+this.height()+"</height>\n";
str+=tabChar+"<top>"+this.height()+"</top>\n";
str+=tabChar+"<left>"+this.height()+"</left>\n";
for (var x in this.i_params) {
if (x.substr(0, 3)=='zz_') {
str+=tabChar+"<param>\n";
str+=tabChar+tabChar+"<name>"+x+"</name>\n";
str+=tabChar+tabChar+"<value>"+this.i_params[x]+"</value>\n";
str+=tabChar+"</param>\n";
}
}
str+="</floatingWindow>\n";
return str;
}
function DisplayViewColumn(width) {
this.i_width=width;					
this.i_windows=Array();				
this.i_id=++DisplayViewColumn.i_counter;
}
DisplayViewColumn.i_counter=0;
DisplayViewColumn.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
}
return this.i_width;
}
DisplayViewColumn.prototype.windows=function(index) {
if (index!=undefined) { 
return this.i_windows[index];
}
return this.i_windows;
}
DisplayViewColumn.prototype.addWindow=function(win) {
this.i_windows[this.i_windows.length]=win;
if (this.i_parent!=undefined && SystemCore.activeConfiguration().parentId()==this.i_parent.i_parent.id()) {
var c=SystemCore.activeConfiguration().getViewById(this.i_parent.id()).columns();
for (var x=0; x < c.length; x++) {
if (c[x].i_original==this) {
var n=c[x].addWindow(win.copy());
n.i_parent=this;
n.i_original=win;
}
}
}
return win;
}
DisplayViewColumn.prototype.removeWindow=function(win) {
for (var x=0; x < this.i_windows.length; x++) {
if (this.i_windows[x].id()==win.id()) {
this.i_windows.splice(x, 1);
if (SystemCore.activeConfiguration().parentId()==this.i_parent.i_parent.id()) {
var c=SystemCore.activeConfiguration().getViewbyId(this.i_parent.id()).columns();
for (var x=0; x < c.length; x++) {
if (c[x].i_original==this) {
for (var z=0; z < c[x].windows().length; z++) {
if (c[x].windows(z).i_original==win) {
c[x].removeWindow(c[x].windows[z]);
}
}
}
}
}
return true;
}
}
return false;
}
DisplayViewColumn.prototype.copy=function() {
var dvc=new DisplayViewColumn(this.width());
for (var x=0; x < this.windows().length; x++) {
dvc.addWindow(this.windows(x).copy());
}
return dvc;
}
DisplayViewColumn.prototype.toString=function() {
var tabChar="";
var str="<column>\n";
str+=tabChar+"<width>"+this.width()+"</width>\n";
for (var x=0; x < this.windows().length; x++) {
str+=this.windows(x).toString();
}
str+="</column>\n";
return str;
}
function DisplayViewWindow(window_id, height, minimized) {
this.i_window_id=window_id;		
this.i_height=height;			
this.i_params=Array();		
this.i_minimized=(minimized!=undefined ? minimized : false); 
}
DisplayViewWindow.prototype.id=function() {
return this.i_window_id;
}
DisplayViewWindow.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
}
return this.i_height;
}
DisplayViewWindow.prototype.minimized=function(state) {
if (state!=undefined) {
this.i_minimized=state;
}
return this.i_minimized;
}
DisplayViewWindow.prototype.param=function(name, value) {
if (value!=undefined) {
this.i_params['zz_'+name]=value;
}
return this.i_params['zz_'+name];
}
DisplayViewWindow.prototype.copy=function() {
var dvw=new DisplayViewWindow(this.id(), this.height(), this.minimized());
for (var x in this.i_params) {
if (x.substr(0, 3)=='zz_') {
dvw.i_params[x]=this.i_params[x];
}
}
return dvw;
}
DisplayViewWindow.prototype.toString=function() {
var tabChar="";
var str="<window>\n";
str+=tabChar+"<id>"+this.id()+"</id>\n";
str+=tabChar+"<height>"+this.height()+"</height>\n";
str+=tabChar+"<minimized>"+this.minimized()+"</minimized>\n";
for (var x in this.i_params) {
if (x.substr(0, 3)=='zz_') {
str+=tabChar+"<param>\n";
str+=tabChar+tabChar+"<name>"+x+"</name>\n";
str+=tabChar+tabChar+"<value>"+this.i_params[x]+"</value>\n";
str+=tabChar+"</param>\n";
}
}
str+="</window>\n";
return str;
}
JavaScriptResource.notifyComplete("./lib/controllers/Controller.DisplayManager.js");
function ApplicationRegistry() {
}
ApplicationRegistry.i_priority=0;
ApplicationRegistry.REGISTRY_INHERIT=1;
ApplicationRegistry.REGISTRY_CLIENT=2;
ApplicationRegistry.REGISTRY_SERVER=3;
ApplicationRegistry.REGISTRY_NONE=4;
ApplicationRegistry.REGISTRY_NORMAL=2;
ApplicationRegistry.REGISTRY_SENSITIVE=3;
ApplicationRegistry.REGISTRY_PRIVATE=4;
ApplicationRegistry.i_persistance=ApplicationRegistry.REGISTRY_CLIENT;
ApplicationRegistry.i_sensitivity=ApplicationRegistry.REGISTRY_NORMAL;
ApplicationRegistry.session_length=((3600000 * 24) * 30);  
ApplicationRegistry.i_key="hello world";
ApplicationRegistry.i_nodes=Array();	
ApplicationRegistry.i_node_collection=Array();
ApplicationRegistry.save=function() {
ApplicationRegistry.updateRegistry();
var ss=ApplicationRegistry.toString(ApplicationRegistry.REGISTRY_SERVER);
var p=new ResourcePost();
p.param('data', ss);
p.param("unm", user_prefs['user_name']);
p.param('sid', user_prefs['session_id']);
p.param('method', "update");	
ResourceManager.request('/cgi-bin/phoenix/Registry.fcg', ApplicationRegistry.i_priority--, ApplicationRegistry.handleSaveFinish, p);
}
ApplicationRegistry.handleSaveFinish=function() {
}
ApplicationRegistry.nodes=function(id) {
if (id!=undefined) {
return this.i_nodes[id];
}
return this.i_node_collection;
}
ApplicationRegistry.persistance=function(persistance) {
if (persistance!=undefined) {
if (persistance==ApplicationRegistry.REGISTRY_INHERIT) {
alert('There was an error loading the application. Please referesh your browser window to continue.');
return false;
}
ApplicationRegistry.i_persistance=persistance;
}
return ApplicationRegistry.i_persistance;
}
ApplicationRegistry.effectivePersistance=function() {
return this.persistance();
}
ApplicationRegistry.sensitivity=function(sensitivity) {
if (sensitivity!=undefined) {
if (sensitivity==ApplicationRegistry.REGISTRY_INHERIT) {
alert('There was an error loading the application. Please referesh your browser window to continue.');
return false;
}
RegistryNode.i_sensitivity=sensitivity;
}
return RegistryNode.i_sensitivity;
}
ApplicationRegistry.effectiveSensitivity=function() {
return this.sensitivity();
}
ApplicationRegistry.addNode=function(node, replace) {
for (var x=0; x < this.i_node_collection.length; x++) {
if (this.i_node_collection[x].name()==node.name()) {
if (replace==true) {
this.removeNode(this.i_node_collection[x]);
break;
}
else {
console.log('node not added to registry.');
return false;
}
}
}
if (node.splice==undefined) {
node.i_parent=this;
if (node.i_id==undefined) {
while (node.i_id==undefined || this.i_nodes[node.i_id]!=undefined) {
node.i_id=Math.floor(Math.random() * 10000);
}
}
this.i_nodes[node.id()]=node;
this.i_node_collection[this.i_node_collection.length]=node;
node.updateSensitivity();
}
else {
for (var x=0; x < node.length; x++) {
node[x].i_parent=this;
if (node[x].i_id==undefined) {
while (node[x].i_id==undefined || this.i_nodes[node[x].i_id]!=undefined) {
node[x].i_id=Math.floor(Math.random() * 10000);
}
}
this.i_nodes[node[x].id()]=node[x];
this.i_node_collection[this.i_node_collection.length]=node[x];
node[x].updateSensitivity();
}
}
return node;
}
ApplicationRegistry.removeNode=function(node) {
var checkNode=node;
if (node.splice==undefined) {
checkNode=Array();
checkNode[checkNode.length]=node;
}
var removed=0;
for (var x=this.i_node_collection.length - 1; x >=0; x--) {
for (var z=0; z < checkNode.length; z++) {
if (this.i_node_collection[x]==checkNode[z]) {
this.i_node_collection.splice(x, 1);
this.i_nodes[checkNode[z].id()]=null;
removed++;
break;
}
}
}
return (checkNode.length==removed ? true : false);
}
ApplicationRegistry.clearNodes=function() {
for (var x=0; x < this.i_node_collection.length; x++) {
this.i_node_collection[x].i_parent=null;
this.i_nodes[this.i_node_collection[x].id()]=null;
}
this.i_nodes=Array();
this.i_node_collection=Array();
}
ApplicationRegistry.toString=function(persistance) {
var str="";
for (var x=0; x < this.i_node_collection.length; x++) {
if (persistance==undefined || this.i_node_collection[x].checkPersistance(persistance)) {
str+=this.i_node_collection[x].toString(persistance);
}
}
return str;
}
ApplicationRegistry.fromString=function(str) {
var node="";
var node_id="";
var braCount=0;
for (var x=0; x < str.length; x++) {
node=node+str.charAt(x);
if (str.charAt(x)=='[') {
braCount++;
if (braCount==1) {
for (var z=0; z < node.length; z++) {
if (node.charAt(z)==':') {
break;
}
node_id+=node.charAt(z);
}
}
}
if (str.charAt(x)==']') {
braCount--;
if (braCount==0) {
if (this.nodes(node_id)!=undefined) {
RegistryNode.fromString(node, this.nodes(node_id));
}
else {
this.addNode(RegistryNode.fromString(node));
}
node="";
node_id="";
}
}
}
return true;
}
ApplicationRegistry.toStringXML=function(persistance) {
var str="<registry>\n";
for (var x=0; x < this.i_node_collection.length; x++) {
if (persistance==undefined || this.i_node_collection[x].checkPersistance(persistance)) {
str+=this.i_node_collection[x].toStringXML(persistance, 1);
}
}
str+="</registry>";
return str;
}
ApplicationRegistry.sensitivityKey=function(key) {
if (key!=undefined) {
this.i_key=key;
}
return this.i_key;
}
ApplicationRegistry.encodeSensitive=function(str) {
var newStr="";
var encKey=this.sensitivityKey();
var seedLen=2+Math.floor(Math.random() * 3);
var seed="";
for (var x=0; x < seedLen; x++) {
seed+=String.fromCharCode(Math.floor(Math.random() * 255));
}
str=seed+":"+str;
var ls=0;
for (var x=0; x < str.length; x++) {
var ch=str.charCodeAt(x);
var ke=encKey.charCodeAt(x % encKey.length);
ls=ch=(((ch ^ ke) ^ ls) ^ (x % 255));
newStr+=String.fromCharCode(ch);
}
return newStr;
}
ApplicationRegistry.decodeSensitive=function(str) {
var newStr="";
var encKey=this.sensitivityKey();
str+="";
for (var x=str.length - 1; x >=0; x--) {
var ch=str.charCodeAt(x);
var ke=encKey.charCodeAt(x % encKey.length);
var ls=(x > 0 ? str.charCodeAt(x - 1) : 0);
ch=(((ch ^ (x % 255)) ^ ls) ^ ke);
newStr=String.fromCharCode(ch)+newStr;
}
for (var x=0; x < newStr.length; x++) {
if (newStr.charAt(x)==":") {
newStr=newStr.substr(x+1);
break;
}
}
return newStr;
}
ApplicationRegistry.getNode=function(path) {
var parts=Array();
parts[0]="";
for (var x=0; x < path.length; x++) {
if (path.charAt(x)=="/") {
parts[parts.length]="";
}
else {
parts[parts.length - 1]+=path.charAt(x);
}
}
var w=this;
for (var x=0; x < parts.length; x++) {
var nm=parts[x];
var id=0;
if (nm.indexOf('[') >=0) {
id=nm.substr(nm.indexOf('[')+1, nm.indexOf(']') - (nm.indexOf('[')+1));
}
if (id==0) {
var fd=false;
for (var z=0; z < w.i_node_collection.length; z++) {
if (w.i_node_collection[z].name()==parts[x]) {
w=w.i_node_collection[z];
fd=true;
break;
}
}
if (!fd) {
return undefined;
}
}
else {
w=w.i_nodes[id];
}
}
return w;
}
ApplicationRegistry.updateRegistry=function() {
var expires=new Date();
expires.setTime(expires.getTime()+ApplicationRegistry.session_length);
document.cookie="registry="+ApplicationRegistry.toString(ApplicationRegistry.REGISTRY_CLIENT)+(ApplicationRegistry.session_length!=null ? ";expires="+expires : "")
}
ApplicationRegistry.loadRegistry=function(server_registry) {
this.clearNodes();
var cookieData="";
if (document.cookie.length > 0) {
var my_cookie=document.cookie.indexOf("registry=");
if (my_cookie >=0) {
my_cookie+=9; 
var my_end=document.cookie.indexOf(";",my_cookie);
my_end=(my_end >=0 ? my_end : document.cookie.length);
cookieData=document.cookie.substring(my_cookie,my_end);
} 
}
this.fromString(cookieData);
if (server_registry!=undefined) {
this.fromString(server_registry);
}
}
function RegistryNode(name, value, persistance, sensitivity) {
this.i_name=name;
if (value==undefined) {
this.i_value=Array();
}
else if (value.splice!=undefined) {
this.i_value=value;
}
else {
this.i_value=Array();
this.i_value[this.i_value.length]=value;
}
this.i_nodes=Array();
this.i_node_collection=Array();
this.i_encoded=false;
this.i_persistance=(persistance!=undefined ? persistance : ApplicationRegistry.REGISTRY_INHERIT);
this.i_sensitivity=(sensitivity!=undefined ? sensitivity : ApplicationRegistry.REGISTRY_INHERIT);
this.updateSensitivity();
}
RegistryNode.prototype.addNode=ApplicationRegistry.addNode;
RegistryNode.prototype.removeNode=ApplicationRegistry.removeNode;
RegistryNode.prototype.clearNodes=ApplicationRegistry.clearNodes;
RegistryNode.prototype.getNode=ApplicationRegistry.getNode;
RegistryNode.prototype.id=function() {
return this.i_id;
}
RegistryNode.prototype.parent=function() {
return this.i_parent;
}
RegistryNode.prototype.persistance=function(persistance) {
if (persistance!=undefined) {
this.i_persistance=persistance;
}
return this.i_persistance;
}
RegistryNode.prototype.effectivePersistance=function() {
if (this.i_persistance!=ApplicationRegistry.REGISTRY_INHERIT) {
return this.i_persistance;	
}
if (this.parent()!=undefined) {
return this.parent().effectivePersistance();
}
return undefined;
}
RegistryNode.prototype.updateSensitivity=function() {
var enc=((this.i_encoded==false && this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_PRIVATE) ? true : false);
var dec=((this.i_encoded==true && this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_PRIVATE) ? true : false);
if (enc || dec) {
for (var x=0; x < this.i_value.length; x++) {
if (enc) {	
this.i_value[x]=ApplicationRegistry.encodeSensitive(this.i_value[x]);
}
if (dec) {
this.i_value[x]=ApplicationRegistry.decodeSensitive(this.i_value[x]);
}
}
this.i_encoded=enc;
}
for (var x=0; x < this.i_node_collection.length; x++) {
this.i_node_collection[x].updateSensitivity();
}
}
RegistryNode.prototype.sensitivity=function(sensitivity) {
if (sensitivity!=undefined) {
this.i_sensitivity=sensitivity;
this.updateSensitivity();
}
return this.i_sensitivity;
}
RegistryNode.prototype.effectiveSensitivity=function() {
if (this.i_sensitivity!=ApplicationRegistry.REGISTRY_INHERIT) {
return this.i_sensitivity;	
}
if (this.parent()!=undefined) {
return this.parent().effectiveSensitivity();
}
return undefined;
}
RegistryNode.prototype.nodes=function(id) {
if (id!=undefined) {
this.i_nodes[id];
}
return this.i_node_collection;
}
RegistryNode.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
RegistryNode.prototype.singleValue=function(newValue) {
if (newValue!=undefined) {
this.clearValue();
this.addValue(newValue);
}
return this.value(0);
}
RegistryNode.prototype.value=function(index) {
if (index!=undefined) {
if (this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_PRIVATE) {
return ApplicationRegistry.decodeSensitive(this.i_value[index]);
}
else {
return this.i_value[index];
}
}
if (this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_PRIVATE) {
var newA=Array();
for (var x=0; x < this.i_value.length; x++) {
newA[newA.length]=ApplicationRegistry.decodeSensitive(this.i_value[x]);
}
return newA;
}
else {
return this.i_value;
}
}
RegistryNode.prototype.addValue=function(value) {
var sensitive=(this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_PRIVATE ? true : false);
if (value.splce!=undefined) {
for (var x=0; x < value.length; x++) {
if (sensitive) {
this.i_value[this.i_value.length]=ApplicationRegistry.encodeSensitive(value[x]);
}
else {
this.i_value[this.i_value.length]=value[x];
}
}
}
else {
if (sensitive) {
this.i_value[this.i_value.length]=ApplicationRegistry.encodeSensitive(value);
}
else {
this.i_value[this.i_value.length]=value;
}
}
return value;
}
RegistryNode.prototype.clearValue=function() {
this.i_value=Array();
}
RegistryNode.prototype.removeValueByIndex=function(index) {
if (this.i_value.length > index) {
this.i_value.splice(index, 1);
return true;
}
return false;
}
RegistryNode.prototype.removeValue=function(value) {
var checkValues=value;
if (value.splce==undefined) {
checkValues=Array();
checkValues[0]=value;
}
var removed=0;
var sensitive=(this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_PRIVATE ? true : false);
for (var x=this.value().length - 1; x >=0; x--) {
for (var z=0; z < checkValues.length; z++) {
if (sensitive) {
if (ApplicationRegistry.decodeSensitive(this.value(x))==checkValues[z]) {
this.removeValueByIndex(x);
removed++;
break;
}
}
else {
if (this.value(x)==checkValues[z]) {
this.removeValueByIndex(x);
removed++;
break;
}
}
}
}
return (removed==checkValues.length ? true : false);
}
RegistryNode.prototype.checkPersistance=function(persistance) {
if (this.effectivePersistance()==persistance) {
return true;
}	
for (var x=0; x < this.i_node_collection.length; x++) {
if (this.i_node_collection[x].checkPersistance(persistance)) {
return true;
}
}
return false;
}
RegistryNode.prototype.toString=function(persistance) {
var str=this.id()+":"+(this.i_encoded==true ? 1 : 0)+":"+((this.sensitivity()!=ApplicationRegistry.REGISTRY_INHERIT || this.persistance()!=ApplicationRegistry.REGISTRY_INHERIT) ? this.sensitivity()+":" : "")+(this.persistance()!=ApplicationRegistry.REGISTRY_INHERIT ? this.persistance()+":" : "")+escape(this.name())+"[";
if (persistance==undefined || persistance==this.effectivePersistance()) {
for (var m=0; m < this.i_value.length; m++) {
var v=this.i_value[m];
if (this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_SENSITIVE) {
v=ApplicationRegistry.encodeSensitive(v);
}
str+=escape(v)+(m!=this.i_value.length - 1 ? " " : "");
}
}
if (this.i_node_collection.length > 0) {
str+="$";
for (var x=0; x < this.i_node_collection.length; x++) {
if (persistance==undefined || this.i_node_collection[x].checkPersistance(persistance)) {
str+=this.i_node_collection[x].toString(persistance);
}
}
}
return str+"]";
}
RegistryNode.fromString=function(str, r_node) {
var node="";
var braCount=0;
if (r_node==undefined) {
r_node=new RegistryNode("unknown");
}
var parts=Array();
parts[0]="";
var x;
for (x=0; x < str.length; x++) {
if (str.charAt(x)=='[') {
break;
}
if (str.charAt(x)!=":") {
parts[parts.length - 1]+=str.charAt(x);
}
else {
parts[parts.length]="";
}
}
r_node.i_id=parts[0];
if (parts.length > 3) {
r_node.sensitivity(parts[2]);
if (parts.length > 4) {
r_node.persistance(parts[3]);
}
}
r_node.name(parts[parts.length - 1]);
var vals=Array();
vals[0]="";
for (x=x+1; x < str.length; x++) {
if (str.charAt(x)=='$' || str.charAt(x)==']') {
break;
}
if (str.charAt(x)!=':') {
vals[vals.length - 1]+=str.charAt(x);
}
else {
if (vals[vals.length - 1]!="") {
vals[vals.length]="";
}
}
}
if (parts[1]==1) {
for (var z=0; z < vals.length; z++) {
vals[z]=ApplicationRegistry.decodeSensitive(unescape(vals[z]));
}
}
else {
for (var z=0; z < vals.length; z++) {
vals[z]=unescape(vals[z]);
}
}
if (vals[0]!="") {
r_node.addValue(vals);
}
var depth=0;
var node="";
var node_id;
for (x=x+1; x < str.length; x++) {
node+=str.charAt(x);
if (str.charAt(x)=='[') {
depth++;
if (depth==1) {
for (var z=0; z < node.length; z++) {
if (node.charAt(z)==':') {
break;
}
node_id+=node.charAt(z);
}
}
}
if (str.charAt(x)==']') {
depth--;
if (depth==0) {
if (r_node.nodes[node_id]!=undefined) {
RegistryNode.fromString(node, this.nodes(node_id));
}
else {
r_node.addNode(RegistryNode.fromString(node));
}
node="";
node_id="";
}
}
}
return r_node;
}
RegistryNode.prototype.toStringXML=function(persistance, depth) {
var depthStr="";
for (var x=0; x < depth; x++) {
depthStr+="    ";
}
var str=depthStr+"<"+this.name()+">\n";
str+=depthStr+"    <id>"+this.id()+"</id>\n";
if (this.sensitivity()!=ApplicationRegistry.REGISTRY_INHERIT) {
str+=depthStr+"    <sensitivity>"+this.sensitivity()+"</sensitivity>\n";
}
if (this.persistance()!=ApplicationRegistry.REGISTRY_INHERIT) {
str+=depthStr+"    <persistance>"+this.persistance()+"</persistance>\n";
}
if (persistance==undefined || this.effectivePersistance()==persistance) {
for (var x=0; x < this.i_value.length; x++) {
var v=this.i_value[x];
if (this.effectiveSensitivity()==ApplicationRegistry.REGISTRY_SENSITIVE) {
v=ApplicationRegistry.encodeSensitive(v);
}
str+=depthStr+"    <value>"+escape(v)+"</value>\n";
}
}
for (var x=0; x < this.i_node_collection.length; x++) {
if (persistance==undefined || this.i_node_collection[x].checkPersistance(persistance)) {
str+=this.i_node_collection[x].toStringXML(persistance, depth+1);
}
}
str+=depthStr+"</"+this.name()+">\n";
return str;
}
JavaScriptResource.notifyComplete("./lib/controllers/Controller.Registry.js");
function ElementFader(duration, steps, minimum, maximum, stage) {
this.i_element=Array();							
this.i_duration=(duration!=undefined ? duration : 100);			
this.i_steps=(steps!=undefined ? steps : 10);				
this.i_minimum=(minimum!=undefined ? minimum : (document.all ? .01 : .01));				
this.i_maximum=(maximum!=undefined ? maximum : (document.all ? 1 : .99));				
this.i_stage=(stage!=undefined ? stage : 0);				
this.i_timer;									
}
ElementFader.enabled=true;
ElementFader.prototype.oncomplete=function() { };
ElementFader.prototype.elements=function() {
return this.i_element;
}
ElementFader.prototype.element=function(index) {
return this.i_element[index];
}
ElementFader.prototype.add_element=function(element) {
this.i_element[this.elements().length]=element;
var op=((this.maximum() - this.minimum()) * this.stage());
element.style.filter="alpha(opacity="+(op * 100)+")";
element.style.MozOpacity=op;
element.style.opacity=op;
element.style.KhtmlOpacity=op;
return true;
}
ElementFader.prototype.remove_element=function(element) {
for (var z=this.elements().length - 1; z >=0; z--) {
if (this.element(z)==element) {
this.elements().splice(z, 1);
return true;
}
}
return false;
}
ElementFader.prototype.stage=function(stage) {
if (stage!=undefined) {
if (stage==false) {
stage=0;
}
if (stage >=0 && stage <=1) {
if (this.i_stage!=stage) {
this.i_stage=stage;
var op=((this.maximum() - this.minimum()) * stage);
for (var x=0; x < this.elements().length; x++) {
var e=this.element(x);
e.style.filter="alpha(opacity="+(op * 100)+")";
if (!document.all) {
e.style.MozOpacity=op;
e.style.opacity=op;
e.style.KhtmlOpacity=op;
}
}
}
}
}
return this.i_stage;
}
ElementFader.prototype.visible=function(state) {
if (this.i_timer!=undefined) {
clearInterval(this.i_timer);
}
var me=this;
if (!ElementFader.enabled) {
if (state) {
this.i_stage=0;
this.stage(1);
}
else {
this.i_stage=1;
this.stage(0);
}
if (this.oncomplete!=undefined) {
setTimeout(function() {
me.oncomplete({type: "complete"});
}, 1);
}
return true;
}
var win=this.maximum() - this.minimum();
var iter=(1 / this.steps()) * (state==true ? 1 : -1);
var cur=this.stage();
var interval=Math.floor(this.duration() / this.steps());
this.i_timer=setInterval(function() {
cur+=iter;
cur=(Math.floor(cur * 100) / 100);
if (cur <=0 || cur >=1) {
cur=(cur <=0 ? 0 : 1);
}
me.stage(cur);
if (cur==0 || cur==1) {
clearInterval(me.i_timer);
if (me.oncomplete!=undefined) {
var o=new Object();
o.type="complete";
o.fader=me;
me.oncomplete(o);
}
}
}, interval); 
}
ElementFader.prototype.steps=function(steps) {
if (steps!=undefined) {
this.i_steps=steps;
}
return this.i_steps;
}
ElementFader.prototype.duration=function(duration) {
if (duration!=undefined) {
this.i_duration=duration;
}
return this.i_duration;
}
ElementFader.prototype.minimum=function(minimum) {
if (minimum!=undefined) {
this.i_minimum=minimum;
}
return this.i_minimum;
}
ElementFader.prototype.maximum=function(maximum) {
if (maximum!=undefined) {
this.i_maximum=maximum;
}
return this.i_maximum;
}
JavaScriptResource.notifyComplete("./lib/behaviors/Behavior.Fader.js");
PopoutWindow.registerGroup("DataModel", ["DMCollection",
"DataModelNode"]);
Object.prototype.inherit=function() {
for (var x=0; x < arguments.length; x++) {
for (var meth in arguments[x].prototype) {
if (this.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
this.prototype[meth]=arguments[x].prototype[meth];
}
}
}
}
function DMCollection() {
this.superDMCollection();
}
DMCollection.prototype.superDMCollection=function() {
this.i_dm_entries=0;		
this.i_dm_items=Array();		
this.i_dm_gaps=Array();		
this.i_dm_index=Array();		
this.i_dm_ref=Array();		
this.i_dm_map=Array();		
this.i_dm_id=DMCollection.i_idCounter++;
this.i_parent_dm=this;
this.i_ignore_refresh=false;
this.i_value_attribute="i_value";
}
DMCollection.i_idCounter=0;
DMCollection.prototype.onsort=null;
DMCollection.prototype.onrefresh=null;
DMCollection.prototype.onadd=null;
DMCollection.prototype.onremove=null;
DMCollection.prototype.onclear=null;
DMCollection.prototype.dataModelId=function() {
return this.i_dm_id;
}
DMCollection.prototype.entries=function() {
return this.i_dm_entries;
}
DMCollection.prototype.items=function(index) {
if (index!=undefined) {
return this.i_dm_items[index];
}
return this.i_dm_items;
}
DMCollection.prototype.ignoreRefresh=function(state, force) {
if (this!=this.i_parent_dm) {
return this.i_parent_dm.ignoreRefresh(state, force);
}
if (state!=undefined) {
if (this.i_ignore_refresh!=state) {
this.i_ignore_refresh=state;
if ((!state && this.i_has_update==true) || force==true) {
this.i_has_update=false;
if (this.clearCache!=undefined) {
this.clearCache();
}
if (this.onrefresh!=undefined) {
var o=new Object();
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}	
}
}
else if (force==true) {
this.forceRefresh();
}
}
return this.i_ignore_refresh;
}
DMCollection.prototype.forceRefresh=function() {
if (this.onrefresh!=undefined) {
var o=new Object();
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}	
}
DMCollection.prototype.ignoreChange=function(state, force) {
if (state!=undefined) {
this.i_ignore_change=state;
if (state==false && force==true) {
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.entry=this;
this.onchange(o);
}
}
}
return this.i_ignore_change;
}
DMCollection.prototype.getItemById=function(id, recursive, all) {
var res;
if (this.i_dm_ref[id]!=undefined) {
res=this.i_dm_ref[id];
}
else {
res=Array();
if (recursive==true) {
for (var x=0; x < this.i_dm_items.length; x++){ 
if (this.i_dm_items[x]!=undefined) {
var d=this.i_dm_items[x].getItemById(id, recursive, true);
if (d!=undefined && d.length > 0) {
if (all==true) {
for (var q=0; q < d.length; q++) {
res[res.length]=d[q];
}
}
else {
return d[0];
}
}
}
}
}
}
if (res!=undefined && all!=true) {
res=res[0];
}
return res;
}
DMCollection.prototype.sort=function(param_name, order) {
if (param_name==undefined) {
return this.i_dm_map;
}
if (order==undefined) {
order="asc";
}
if (this.i_dm_sort==undefined) {
this.i_dm_sort=Array();
}
var param_type;
if (this.i_dm_sort[param_name+":"+order]==undefined) {
var swap_map=Array();
if (this.i_dm_sort[param_name+":"+(order=="asc" ? "desc" : "asc")]!=undefined) {
var old_map=this.i_dm_sort[param_name+":"+(order=="asc" ? "desc" : "asc")];
var l=old_map.length;
var swap_map=Array();
for (var x=1; x <=l; x++) {
swap_map[l - x]=old_map[x - 1];	
}
}
else {
var map_l=this.i_dm_map.length;
for (var x=0; x < map_l; x++) {
swap_map[x]=this.i_dm_map[x];
}
var dm_items=this.i_dm_items;
var dm_items_l=dm_items.length;
for (var x=0; x < dm_items_l; x++) {
if (dm_items[swap_map[x]]!=undefined) {
var lowI=x;
if (param_type==undefined) {
param_type=dm_items[swap_map[lowI]].i_dm_param_types['pm_'+param_name];
}
try {
var lowP=dm_items[swap_map[lowI]].i_dm_params['pm_'+param_name];
if (lowP!=undefined) {
if (lowP.toLowerCase!=undefined) {
lowP=lowP.toLowerCase();
}
else if (lowP.getTime!=undefined) {
lowP=lowP.getTime();
}
}
} catch (e) { console.log(dm_items[swap_map[lowI]], e.message, param_name); }
for (var y=x; y < dm_items_l; y++) {
if (dm_items[swap_map[y]]!=undefined) {
var curP=dm_items[swap_map[y]].i_dm_params['pm_'+param_name];
if (curP!=undefined) {
if (curP.toLowerCase!=undefined) {
curP=curP.toLowerCase();
}
else if (curP.getTime!=undefined) {
curP=curP.getTime();
}
}
if ((order=="asc" && lowP > curP) || (order=="desc" && lowP < curP)) {
lowP=curP;
lowI=y;
}
}
}
if (lowI!=x) {
var b=swap_map[x];
swap_map[x]=swap_map[lowI];
swap_map[lowI]=b;
}
}
}
}
this.i_dm_sort[param_name+":"+order]=swap_map;
}
if (this.onsort!=undefined) {
var o=new Object();
o.type="sort";
o.collection=this;
o.param=param_name;
o.order=order;
this.onsort(o);
}
return this.i_dm_sort[param_name+":"+order];
}
DMCollection.prototype.addItem=function(item, beforeItem) {
this.i_has_update=true;
item.i_parent=this;
item.i_parent_dm=this.i_parent_dm;
if (item.index(this)!=undefined) {
console.log('Data Model Addition Failed');
return false;
}
if(this.i_dm_ref[item.id()]==undefined) {	
this.i_dm_ref[item.id()]=[];
}	
this.i_dm_ref[item.id()].push(item);
item.i_dm_on_change_id_handler=EventHandler.register(item, "onchangeid", this.handleItemIdChange, this);
var added=false;
if (this.i_dm_gaps.length > 0) {
this.i_dm_items[this.i_dm_gaps[0]]=item;
item.i_dm_index[this.dataModelId()]=this.i_dm_gaps[0];
this.i_dm_gaps.splice(0, 1);
added=true;
}
if (!added) {
var ix=this.i_dm_items.length;
this.i_dm_items[ix]=item;
item.i_dm_index[this.dataModelId()]=ix;
}
var append=true;
var dmMapLength=this.i_dm_map.length;
if (beforeItem!=undefined) {
var other_i=beforeItem.index(this);
for (var x=0; x < dmMapLength; x++) {
if (this.i_dm_map[x]==other_i) {
this.i_dm_map.splice(x, 0, item.index(this));
append=false;
break;
}
}
}
if (append) {
this.i_dm_map[dmMapLength]=item.index(this);
}
if (item.i_visible!=false) {
this.i_dm_entries++;
}
this.i_nodes=Array();
this.i_dm_sort=null;
if (this.onadd!=undefined) {
var o=new Object();
o.type="add";
o.collection=this;
o.item=item;
this.onadd(o);
}
if (this.onrefresh!=undefined) {
if (this.i_parent_dm!=undefined) {
this.i_parent_dm.i_has_update=true;
if (this.parentDataModel().i_ignore_refresh==false) {
this.i_has_update=false;
var o=new Object();	
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}
}
}
return item;
}
DMCollection.prototype.handleItemIdChange=function(e) {
var lastId=e.lastId;
var curId=e.curId;
var item=e.item;
if(this.i_dm_ref[lastId]!=null) {
var ref=this.i_dm_ref[lastId];
for(var x=ref.length - 1; x >=0; x--) {
if(ref[x]==item) {
ref.splice(x, 1);
}
}
if(this.i_dm_ref[lastId].length < 1) {
this.i_dm_ref[lastId]=undefined;
}
}
if(this.i_dm_ref[curId]==null) {
this.i_dm_ref[curId]=[item];
}else{
this.i_dm_ref[curId].push(item);
}
}
DMCollection.prototype.removeItem=function(item) {
var item_found=false;
this.i_has_update=true;
if (this.i_dm_items[item.index(this)]==item) {
this.i_dm_items[item.index(this)]=null;
item_found=true;
}
else {
for (var x=0; x < this.i_dm_items.length; x++) {
if (this.i_dm_items[x]==item) {
this.i_dm_items[x]=null;
item_found=true;
break;
}
}
}
if(item_found) {
if(item.i_dm_on_change_id_handler!=null) {
item.i_dm_on_change_id_handler.unregister();
item.i_dm_on_change_id_handler=null;
}
var a=this.i_dm_ref[item.id()];
for(var x=a.length - 1; x >=0; x--) {
if(a[x]==item) {
a.splice(x, 1);
break;
}
}
var myIndex=item.index(this);
for (var x=0; x < this.i_dm_map.length; x++) {
if (this.i_dm_map[x]==myIndex) {
this.i_dm_map.splice(x, 1);
break;
}
}
this.i_dm_gaps[this.i_dm_gaps.length]=item.index(this);
if (this.i_dm_ref[item.id()].length==0) {
item.i_dm_index[this.dataModelId()]=null;
}
if (item.i_visible!=false) {
this.i_dm_entries--;
}
if(this.i_dm_entries <=0) {
this.i_nodes=undefined;
}
this.i_dm_sort=null;
if (this.onremove!=undefined) {
var o=new Object();
o.type="remove";
o.collection=this;
o.item=item;
o.removed=item_found;
this.onremove(o);
}
this.i_has_update=true;
if (this.onrefresh!=undefined) {
if (this.i_parent_dm!=undefined) {
this.i_parent_dm.i_has_update=true;
if (this.parentDataModel().i_ignore_refresh==false) {
this.i_has_update=false;
var o=new Object();
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}
}
}
}
return item_found;
}
DMCollection.prototype.clear=function() {
for (var x=0; x < this.i_dm_items.length; x++) {
if(this.i_dm_items[x]!=null) {
this.i_dm_items[x].i_dm_index[this.dataModelId()]=null;
if (this.onremove!=undefined) {
var o=new Object();
o.type="remove";
o.collection=this;
o.item=this.i_dm_items[x];
o.clearing=true;
this.onremove(o);
}
}
this.i_dm_items[x]=null;
}
this.i_dm_gaps=Array();
this.i_dm_items=Array();
this.i_dm_ref=Array();
this.i_dm_map=Array();
this.i_dm_entries=0;
if (this.onclear!=undefined) {
var o=new Object();
o.type="clear";
o.collection=this;
this.onclear(o);
}
this.i_has_update=true;
if (this.onrefresh!=undefined) {
if (this.i_parent_dm!=undefined) {
this.i_parent_dm.i_has_update=true;
if (this.parentDataModel().i_ignore_refresh==false) {
this.i_has_update=false;
var o=new Object();
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}
}
}
}
function EntrySet(source, map, start, length) {
this.i_dm_source=source;				
this.i_dm_map=map;					
this.i_dm_start=start;				
this.i_complete=true;
if (this.i_dm_map==undefined) {
if (this.i_dm_source.length - start < length) {
length=this.i_dm_source.length - start;
}
}
else {
if (this.i_dm_map.length - start < length) {
length=this.i_dm_map.length - start;
}
}
this.i_dm_length=length;				
}
EntrySet.prototype.start=function() {
return this.i_dm_start;
}
EntrySet.prototype.length=function() {
return this.i_dm_length;
}
EntrySet.prototype.source=function() {
return this.i_dm_source;
}
EntrySet.prototype.isComplete=function(state) {
if (state!=undefined) {
this.i_complete=state;
}
return this.i_complete;
}
EntrySet.prototype.getItem=function(index) {
if (this.i_dm_map!=undefined) {
return this.i_dm_source[this.i_dm_map[index+this.i_dm_start]];
}
else {
return this.i_dm_source[index+this.i_dm_start];
}
}
EntrySet.prototype.toString=function() {
var str="Set{\n";
for (var x=0; x < this.length(); x++) {
str+=this.getItem(x).toString()+(x!=this.length() - 1 ? "," : "")+"\n";
}
str+="}";
return str;
}
function DataModelNode(id) {
this.superDataModelNode(id);
}
DataModelNode.prototype.superDataModelNode=function(id) {
this.superDMCollection();
this.i_id=(id!=undefined ? id : parseInt(Math.random()*10000));
this.i_entries_cache=Array();	
this.i_open=Array();		
this.i_dm_params=Array();
this.i_depth=0;
this.i_item_cache=Array();
this.i_style=0;
this.i_selected_style=0;
this.i_dm_param_types=Array();
this.i_parent_dm=this;
this.i_entries_modified=false;
this.i_items_modified=false;
EventHandler.register(this, "onadd", this.handleItemAdd, this);
EventHandler.register(this, "onremove", this.handleItemRemove, this);
}
DataModelNode.prototype.onopen=null;
DataModelNode.prototype.onrefresh=null;
DataModelNode.prototype.onchange=null;
DataModelNode.prototype.onstyle=null;
DataModelNode.prototype.ongetitems=null;
DataModelNode.prototype.parentDataModel=function() {
return this.i_parent_dm;
}
DataModelNode.prototype.id=function(id) {
if (id!=undefined) {
var oldId=this.i_id;
this.i_id=id;
if(this.onchangeid!=null) {
var o={
type: "changeid",
lastId: oldId,
curId: this.i_id,
item: this
};
this.onchangeid(o);
}
}
return this.i_id;
}
DataModelNode.prototype.styleClass=function(cssClass) {
if (cssClass!=undefined) {
this.i_style=cssClass;
if (this.onstyle!=undefined) {
var o=new Object();
o.type="style";
o.node=this;
this.onstyle(o);
}
}
return this.i_style;
}
DataModelNode.prototype.selectedStyleClass=function(cssClass) {
if (cssClass!=undefined) {
this.i_selected_style=cssClass;
if (this.onstyle!=undefined) {
var o=new Object();
o.type="style";
o.node=this;
this.onstyle(o);
}
}
return this.i_selected_style;
}
DataModelNode.prototype.handleItemAdd=function(e) {
e.item.depth(this.i_depth+1);
e.item.i_refresh_l=EventHandler.register(e.item, "onrefresh", this.handleItemRefresh, this);
e.item.i_sort_l=EventHandler.register(this, "onsort", e.item.handleParentSort, e.item);
e.item.i_cache_l=EventHandler.register(e.item, "onclearcache", this.handleClearCache, this);
this.handleClearCache({'type':'clearcache'});
}
DataModelNode.prototype.handleItemRefresh=function(e) {
this.handleClearCache({'type':'clearcache', 'viewId':e.viewId});
this.i_has_update=true;
if (this.onrefresh!=undefined) {
if (this.parentDataModel()!=this || this.i_ignore_refresh!=true) {
this.i_has_update=false;
this.onrefresh(e);
}
}
}
DataModelNode.prototype.handleParentSort=function(e) {
this.sort(e.param, e.order);
}
DataModelNode.prototype.handleClearCache=function(e) {
if (this.i_entries_modified==true) {
if (e.viewId!=undefined) {
this.i_entries_cache[e.viewId]=null;
}
else {
this.i_entries_cache=Array();
}
}
if (this.i_items_modified==true) {
if (e.viewId!=undefined) {
this.i_item_cache[e.viewId]=null;
}
else {
this.i_item_cache=Array();
}
}
if (this.onclearcache!=undefined) {
this.onclearcache(e);
}
}
DataModelNode.prototype.handleItemRemove=function(e) {
if(e.item!=undefined && e.removed) {
e.item.i_sort_l.unregister();
e.item.i_refresh_l.unregister();
e.item.i_cache_l.unregister();
e.item.i_sort_l=null;
e.item.i_refresh_l=null;
e.item.i_cache_l=null;
}
this.handleClearCache({'type':'clearcache'});
}
DataModelNode.prototype.index=function(collection) {
return this.i_dm_index[collection.dataModelId()];
}
DataModelNode.prototype.param=function(name, value, dataType) {
if (value!=undefined) {
this.i_dm_params["pm_"+name]=value;
if (dataType==undefined) {
dataType="string";
}
this.i_dm_param_types['pm_'+name]=dataType;
if (this.onchange!=undefined && this.ignoreChange()!=true) {
var o=new Object();
o.type="change";
o.entry=this;
o.paramName=name;
this.onchange(o);
}
}
return this.i_dm_params["pm_"+name];
}
DataModelNode.prototype.fireChange=function() {
if (this.onchange!=undefined && this.ignoreChange()!=true) {
var o=new Object();
o.type="change";
o.entry=this;
this.onchange(o);
}
}
DataModelNode.prototype.fireRefresh=function() {
if (this.onrefresh!=undefined) {
var o=new Object();
o.type="refresh";
o.entry=this;
this.onrefresh(o);
}
}
DataModelNode.prototype.sortParam=DataModelNode.prototype.param;
DataModelNode.prototype.depth=function(depth) {
if (depth!=undefined) {
this.i_depth=depth;
}
return this.i_depth;
}
DataModelNode.prototype.open=function(state, viewId) {
if (viewId==undefined) {
viewId=0;
}
if (state!=undefined) {
if (this.i_open[viewId]!=state) {
this.i_open[viewId]=state;
this.i_entries_cache[viewId]=null;
if (this.onopen!=undefined) {
var o=new Object();
o.type="open";
o.entry=this;
o.viewId=viewId;
o.state=state;
this.onopen(o);
}
this.i_has_update=true;
if (this.onrefresh!=undefined) {
if (this.i_parent_dm!=undefined) {
this.i_parent_dm.i_has_update=true;
if (this.parentDataModel().i_ignore_refresh==false) {
this.i_has_update=false;
var o=new Object();
o.type="refresh";
o.collection=this;
o.viewId=viewId;
this.onrefresh(o);
}
}
}
}
}
return (this.i_open[viewId]==undefined ? false : this.i_open[viewId]);
}
DataModelNode.prototype.entries=function(viewId) {
if (viewId==undefined) {
viewId=0;
}
if (this.i_entries_cache[viewId]!=undefined) {
return this.i_entries_cache[viewId];
}
var e=0;
var z=0;
for (var x=0; x < this.i_dm_items.length; x++) {
z++;
if (this.i_dm_items[x]!=undefined) {
e+=(this.i_dm_items[x].i_visible!=false ? 1 : 0);
if (this.i_dm_items[x].open(undefined, viewId)) {
e+=this.i_dm_items[x].entries(viewId);						
}
}
}
this.i_entries_cache[viewId]=e;
this.i_entries_modified=true;
return e;			
}
DataModelNode.prototype.getItems=function(start, length, sortParam, sortOrder, viewId) {
if (viewId==undefined) {
viewId=0;
}
if (this.ongetitems!=undefined) {
var o=new Object();
o.type="getitems";
o.cancel=false;
o.start=start;
o.length=length;
o.sortParam=sortParam;
o.sortOrder=sortOrder;
o.viewId=viewId;
this.ongetitems(o);
if (o.cancel==true) {
if (this.i_empty_set==undefined) {
this.i_empty_set=new EntrySet(Array(), undefined, 0, 0)
}
return this.i_empty_set;
}
viewId=o.viewId;
sortParam=o.sortParam;
sortOrder=o.sortOrder;
start=o.start;
length=o.length;
}
if (this.i_item_cache[viewId]!=undefined && this.i_item_cache[viewId][sortParam+":"+sortOrder]!=undefined) {
var cache=this.i_item_cache[viewId][sortParam+":"+sortOrder];
return new EntrySet(cache, undefined, start, (start+length > cache.length ? cache.length - start : length));
}
var ret=Array();
var p=0;
var q=0;
var stack=Array();
stack[0]=Object();
stack[0].map=this.sort(sortParam, sortOrder);
stack[0].source=this.i_dm_items;
stack[0].pos=0;
while (stack.length > 0) {
while (stack[0].pos < stack[0].map.length) {
var n=stack[0].source[stack[0].map[stack[0].pos]];
if (n.i_visible!=false) { 
ret[p++]=n;
}
stack[0].pos++;
if (n.open(undefined, viewId)) {
var o=new Object();
o.map=n.sort(sortParam, sortOrder);
o.source=n.i_dm_items;
o.pos=0;
stack.splice(0, 0, o);
}
}
stack.splice(0, 1);
}
if (this.i_item_cache[viewId]==undefined) {
this.i_item_cache[viewId]=Array();
}
this.i_item_cache[viewId][sortParam+":"+sortOrder]=ret;
this.i_items_modified=true;
return this.getItems(start, length, sortParam, sortOrder, viewId);
}
DataModelNode.inherit(DMCollection);
function TreeListDataModel(id, name, tipText) {
this.superTreeListDataModel(id, name, tipText);
}		
TreeListDataModel.prototype.superTreeListDataModel=function(id, name, tipText) {
this.superDataModelNode(id);
this.i_treeListeners=Array();
this.i_treeNodeListeners=Array();
this.i_root_visible=true;
this.name(name);
this.tipText(tipText);
}
TreeListDataModel.prototype.rootVisible=function(val) {
if(val!==undefined) {
this.i_root_visible=val;
}
return this.i_root_visible;
}
TreeListDataModel.prototype.getEntries=function(start, count, sortBy) {
var ret=Array();
var l=this.getItems(start, count, (sortBy==undefined ? undefined : sortBy.id()), (sortBy==undefined ? undefined : sortBy.sort()), undefined);
for (var x=0; x < l.length(); x++) {
ret[ret.length]=l.getItem(x);
}
return ret;
}
TreeListDataModel.prototype.entryStyle=function(css_name) {
if (css_name!=undefined) {
this.i_style=css_name;
var r=this.activeRow();
if (r!=undefined) {
r.rowStyle(css_name);
}
}
return this.i_style;
}
TreeListDataModel.prototype.activeRow=function(row) {
if (row!=undefined) {
this.i_active_row=row;
}
if (this.i_active_row!=undefined && this.i_active_row.entry()==this) {
return this.i_active_row;
}
else {
this.i_active_row=undefined;
return undefined;
}
}
TreeListDataModel.prototype.nodes=function() {
return this.entries();
}
TreeListDataModel.prototype.registerListener=function(listener) {
this.i_treeListeners[this.i_treeListeners.length]=listener;
}
TreeListDataModel.prototype.unregisterListener=function(listener) {
for (var x=0; x <=this.i_treeListeners.length; x++) {
if (this.i_treeListeners[x]==listener) {
this.i_treeListeners.splice(x, 1);
return true;
}
}
return false;
}
TreeListDataModel.prototype.getNodes=function(start, count) {
return this.getItems(start, count);
}
TreeListDataModel.prototype.parent=function() {
return this.i_parent;
}
TreeListDataModel.prototype.name=function(name) {
return this.param("name", name);
}
TreeListDataModel.prototype.tipText=function(text) {
return this.param("tip", text);
}
TreeListDataModel.prototype.registerNode=function(node) {
this.i_treeNodeListeners[this.i_treeNodeListeners.length]=node;
}
TreeListDataModel.prototype.unregisterNode=function(node) {
for (var x=0; x < this.i_treeNodeListeners.length; x++) {
if (this.i_treeNodeListeners[x]==node) {
this.i_treeNodeListeners.splice(x, 1);
return true;
}
}
return false;
}
TreeListDataModel.prototype.handleRefresh=function(e) {
for (var x=0; x < this.i_treeListeners.length; x++) {
if (this.i_treeListeners[x].building()!=true) {
this.i_treeListeners[x].nodes(this.nodes());
this.i_treeListeners[x].refresh();
}
}
if (this.onchange!=undefined && this.ignoreChange()!=true) {
var o=new Object();
o.type="change";
o.model=this;
this.onchange(o);
}
}
TreeListDataModel.prototype.superParam=DataModelNode.prototype.param;
TreeListDataModel.prototype.param=function(header, value) {
var name=header;
if (header.id!=undefined) {
name=header.id();
}
if(value!==undefined) {
this.superParam(name, new DataListEntryParameter(this, header, value));
if (name=="name") {
for (var x=0; x < this.i_treeNodeListeners.length; x++) {
try {
this.i_treeNodeListeners[x].name(value);
} catch(e) { }
}
}
if (name=="tip") {
for (var x=0; x < this.i_treeNodeListeners.length; x++) {
try { 
this.i_treeNodeListeners[x].toolTip(value);
} catch (e) { }
}
}
}
return this.superParam(name);
}
TreeListDataModel.inherit(DataModelNode);
JavaScriptResource.notifyComplete("./lib/controllers/Controller.DataModel.js");	
function APIManager() {
}
APIManager.i_request_priority=1;  
APIManager.i_handler_url="/cgi-bin/universal.fcg";
APIManager.i_format=0;	
APIManager.i_queue=Array();
APIManager.i_status=Array();
APIManager.i_responseQueue=[];
APIManager.registerStatus=function(code) {
APIManager.i_status[code.code()]=code;
return code;
}
APIManager.unregisterStatus=function(code) {
if (APIManager.i_status[code.code()]!=undefined) {
APIManager.i_status[code.code()]=null;
return true;
}
return false;
}
APIManager.getStatusCode=function(code) {
return APIManager.i_status[code];
}
APIManager.sessionId=function(session_id) {
if (session_id!=undefined) {
APIManager.i_session=session_id;
}
return APIManager.i_session;
}
APIManager.username=function(username) {
if (username!=undefined) {
APIManager.i_username=username;
}
return APIManager.i_username;
}
APIManager.format=function(mode) {
if (mode!=undefined) {
APIManager.i_format=mode;
}
return APIManager.i_format;
}
APIManager.handleResponse=function(data, xml, req, params) {
var res=DataNode.fromString(data);
var environment=null;
var responseObjects=Array();
if (res==undefined) {
console.log('Broken response, unable to parse results from CGI: '+data);
if (req.i_post==undefined || req.i_post.params==undefined || req.i_post.params.cx_data==undefined) {
console.log("Cannot determine broken requests.");
return;
}
var postparts=req.i_post.params.cx_data.match(/<request[^>]+id="[^">]+"[^>]*>+/g);
			if (postparts != null) {
			    for (var i = 0; i < postparts.length; ++i) {
					// get the id="" field, parts[1] = whats in the "".
			        var parts = postparts[i].match(/id="([^\"]+)"/);
if (parts!=null && parts.length==2) {
responseObjects[responseObjects.length]=new ResponseObject(parts[1], APIManager.getStatusCode(20001001), undefined);
}
}
}
} else {
var environment=res.children("env");
var responses=res.children("response");
for (var x=0; x < responses.length; x++) {
var id=responses[x].attribute("id");
var status=responses[x].attribute("status");
var statusObject;
if (status!=undefined && status!="") {
var statusObject=APIManager.getStatusCode(status);
if (statusObject==undefined) {
statusObject=new StatusCode(status, "Unknown status", true);
}
}
else {
statusObject=new StatusCode(0, "Missing status code", true);
}
responseObjects[x]=new ResponseObject(id, statusObject, responses[x].children(undefined, 0));
}
}
if (environment!=null) {
for (var x=0; x < environment.length; x++) {
for (var y=0; y < responseObjects.length; y++) {
responseObjects[y].environment(environment[x].attribute("key"), environment[x].value());
}
}
}
for (var x=0; x < responseObjects.length; x++) {
if (responseObjects[x].request().i_aborted!=true) {
var o={request: responseObjects[x].request(),
response: responseObjects[x],
param: responseObjects[x].request().param()
};
if (responseObjects[x].status().success()==true) {
if (responseObjects[x].request().oncomplete!=undefined) {
o.type="complete";
APIManager.i_responseQueue.push(o);
}
}
else {
if (responseObjects[x].request().onerror!=undefined) {
o.type="error";
APIManager.i_responseQueue.push(o);
}
}
}
}
if (APIManager.i_responseQueue.length > 0 && !APIManager.i_responseTimer) {
APIManager.i_responseTimer=setInterval(APIManager.handleResponseQueue, 1);
}
}
APIManager.handleResponseQueue=function() {
var ev=APIManager.i_responseQueue.shift();
ev.response.request()["on"+ev.type](ev);
if (APIManager.i_responseQueue.length==0) {
clearInterval(APIManager.i_responseTimer);
APIManager.i_responseTimer=undefined;
}
}
APIManager.lock=function(state) {
if (state!=undefined) {
this.i_lock=state;
if (state==false) {
this.executeQueue();
}
}
return this.i_lock;
}
APIManager.execute=function() {
var reqs=Array();
for (var x=0; x < arguments.length; x++) {
if (arguments[x].splice!=undefined) {
for (var m=0; m < arguments[x].length; m++) {
reqs[reqs.length]=arguments[x][m];
}
}
else {
reqs[reqs.length]=arguments[x];
}
}
if (this.i_lock==true) {
for (var x=0; x < reqs.length; x++) {
this.addQueue(reqs[x]);
}
return false;
}
var dm=new DataNode("requests");
var auth=dm.addNode(new DataNode("auth"));
auth.attribute("sid", APIManager.sessionId());
auth.attribute("user", APIManager.username());
for (var x=0; x < reqs.length; x++) {
if (reqs[x].i_aborted!=true) {
dm.addNode(reqs[x].getNode());
}
}
for (var x=0; x < APIManager.i_queue.length; x++) {
if (APIManager.i_queue[x].i_aborted!=true) {
dm.addNode(APIManager.i_queue[x].getNode());
}
}
APIManager.i_queue=Array();
var p=new ResourcePost();
p.param("data", (APIManager.format()==0 ? dm.toXML() : dm.toJSON()));
var doc=window;
while (doc['isTopBTFrame']!=true) {
doc=doc.parent;
}
doc.setTimeout(function() {
ResourceManager.request(APIManager.i_handler_url, APIManager.i_request_priority, APIManager.handleResponse, p);
}, 1);
}
APIManager.addQueue=function() {
for (var x=0; x < arguments.length; x++) {
var useArg=arguments[x];
if (useArg.splice==undefined) {
useArg=[useArg];
}
for (var z=0; z < useArg.length; z++) {
if (useArg[z].i_aborted!=true) {
APIManager.i_queue[APIManager.i_queue.length]=useArg[z];
}
}
}
}
APIManager.removeQueue=function() {
for (var x=0; x < arguments.length; x++) {
for (var z=0; z < APIManager.i_queue.length; z++){ 
if (APIManager.i_queue[x]==arguments[x]) {
APIManager.i_queue.splice(x, 1);
break;
}
}
}
}
APIManager.queue=function() {
return APIManager.i_queue;
}
APIManager.executeQueue=function() {
if (this.i_lock==true) {
return false;
}
var ret=false;
if (APIManager.i_queue.length > 0) {
APIManager.execute();
}
APIManager.i_queue=Array();
return ret;
}
function StatusCode(code, description, success) {
this.i_code=code;
this.i_description=description;
this.i_success=(success!=undefined ? success : false);
}
StatusCode.prototype.code=function() {
return this.i_code;
}
StatusCode.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
}
return this.i_description;
}
StatusCode.prototype.success=function(state) {
if (state!=undefined) {
this.i_success=state;
}
return this.i_success;
}
function RequestObject(application, method, data, param) {
this.i_application=application;
this.i_method=method;
this.i_data=data;
this.i_param=param;
this.i_id=RequestObject.i_idCounter++;
RequestObject.i_requests[this.i_id]=this;
this.i_aborted=false;
}
RequestObject.i_idCounter=0;
RequestObject.i_requests=Array();
RequestObject.prototype.oncomplete=null;
RequestObject.prototype.onerror=null;
RequestObject.getRequestById=function(id) {
return RequestObject.i_requests[id];
}
RequestObject.prototype.id=function() {
return this.i_id;
}
RequestObject.prototype.abort=function() {
this.i_aborted=true;
return true;
}
RequestObject.prototype.param=function(param) {
if (param!=undefined) {
this.i_param=param;
}
return this.i_param;
}
RequestObject.prototype.response=function() {
return ResponseObject.getResponseById(this.id());
}
RequestObject.prototype.application=function(application) {
if (application!=undefined) {
this.i_application=application;
}
return this.i_application;
}
RequestObject.prototype.method=function(method) {
if (method!=undefined) {
this.i_method=method;
}
return this.i_method;
}
RequestObject.prototype.data=function(data) {
if (data!=undefined) {
this.i_data=data;
}
return this.i_data;
}
RequestObject.prototype.getNode=function() {
var dn=new DataNode("request");
dn.attribute("id", this.id());
dn.attribute("application", this.application());
dn.attribute("method", this.method());
dn.addNode(this.data());
return dn;
}	
RequestObject.prototype.execute=function() {
return APIManager.execute(this);
}
function ResponseObject(id, status, data) {
this.i_id=id;
this.i_status=status;
this.i_data=data;
this.i_attributes=Array();
ResponseObject.i_response[id]=this;
}
ResponseObject.i_response=Array();
ResponseObject.getResponseById=function(id) {
return ResponseObject.i_responses[id];
}
ResponseObject.prototype.id=function() {
return this.i_id;
}
ResponseObject.prototype.request=function() {
return RequestObject.getRequestById(this.id());
}
ResponseObject.prototype.status=function(status) {
if (status!=undefined) {
this.i_status=status;
}
return this.i_status;
}
ResponseObject.prototype.data=function(data) {
if (data!=undefined) {
this.i_data=data;
}
return this.i_data;
}
ResponseObject.prototype.environment=function(name, value) {
if (value!=undefined) {
this.i_attributes[name]=value;
}
return this.i_attributes[name];
}
function DataNode(name, value) {
this.i_name=name;
this.i_value=value;
this.i_attributes=Array();
this.i_children=Array();
}
DataNode.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
DataNode.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
}
return this.i_value;
}
DataNode.prototype.attribute=function(name, value) {
if (value!=undefined) {
this.i_attributes['p_'+name]=value;
}
return this.i_attributes['p_'+name];
}
DataNode.prototype.children=function(name, index, value_only) {
var d=0;
var ret=Array();
for (var x=0; x < this.i_children.length; x++) {
if (name==undefined || this.i_children[x].name()==name) {
if (index!=undefined && index==d) {
if (value_only==true) {
return this.i_children[x].value();
}
else {
return this.i_children[x];
}
}
if (index==undefined) {
ret[ret.length]=this.i_children[x];			
}
d++;
}
}
if (index==undefined && value_only!=true) {
return ret;
}
}
DataNode.prototype.addNode=function(child, beforeChild) {
var append=true;
if (beforeChild!=undefined) {
for (var x=0; x < this.i_children.length; x++) { 
if (this.i_children[x]==beforeChild) {
this.i_children.splice(x, 0, child);
append=false;
break;
}
}
}
if (append) {
this.i_children[this.i_children.length]=child;
}
return child;
}
DataNode.prototype.removeNode=function(child) {
for (var x=0; x < this.i_children.length; x++) {
if (this.i_children[x]==child) {
this.i_children.splice(x, 1);
return true;
}
}
return false;
}
DataNode.prototype.xPath=function(path, value_only) {
if (path.substr(0, 1)=="/") {
console.log('Absolute paths are not allowed in this implementation of XPath: '+path);
return undefined;
}
var pool=this.i_children;
var dirs=path.split('/');
var mtx;
var dir_anlz=new RegExp("^(([@]?)([a-zA-Z0-9-_]+|[*]))(\\[((([@]?)([a-zA-Z0-9-_]+)\=((\'|\")|(?!(\'|\")))(.*?)(\\9))|([0-9]+|[*]))\\])?$");
for (var x=0; x < dirs.length; x++) {
var select_index=undefined;
var select_name=undefined;
var select_attr=undefined;
var select_filtered=undefined;
var select_filter_attr=undefined;
var select_filter_name=undefined;
var select_filter_value=undefined;
var filter_index=undefined;
if (mtx=dirs[x].match(dir_anlz)) {
var lastNode=(x==dirs.length - 1 ? true : false);
select_index=undefined;
select_name=mtx[3];
select_attr=(mtx[2]=="@" ? true : false);	
select_filtered=(mtx[4]==undefined || mtx[4]=="" ? false : true);
if (select_filtered==true) {
filter_index=((mtx[14]==undefined || mtx[14]=="") ? false : true);
if (filter_index) {
select_index=mtx[14];
}
else {
select_filter_attr=mtx[7];
select_filter_name=mtx[8];
select_filter_value=mtx[12];
}
}
var tpool=Array();
for (var g=0; g < pool.length; g++) {	
if (select_name=="*" || pool[g].name()==select_name) {
tpool[tpool.length]=pool[g];
}
}
if (select_filtered) {
if (filter_index) {
if (select_index=="*") {
pool=tpool;
}
else {
pool=Array();
pool[0]=tpool[select_index];
tpool=pool;
}
}
else {
for (var z=tpool.length - 1; z >=0; z--) {
if (select_filter_attr=="@" && tpool[z].attribute(select_filter_name)!=select_filter_value && select_filter_value!="*") {
tpool.splice(z, 1);
}
else if (select_filter_attr=="@" && tpool[z].attribute(select_filter_name)==undefined && select_filter_value=="*") {
tpool.splice(z, 1);
}
else if (select_filter_attr!="@") {
var hasChild=false;
for (var y=0; y < tpool[z].i_children.length; y++) {
if (tpool[z].i_children[y].name()==select_filter_name && (tpool[z].i_children[y].value()==select_filter_value || select_filter_value=="*")) {
hasChild=true;
}
}
if (!hasChild) {
tpool.splice(z, 1);
}
}
}
}
}
if (!lastNode) {
pool=Array();
for (var z=0; z < tpool.length; z++) {
for (var m=0; m < tpool[z].i_children.length; m++) {
pool[pool.length]=tpool[z].i_children[m];
}
}
}
else {
pool=tpool;
}
}
}
if(value_only) {
if(pool && pool.length > 0) {
return pool[0].value();
} else {
return null;
}
} else {
return pool;
}
}
DataNode.prototype.toJSON=function(not_root) {
var pts=Array();
pts[0]='name:"'+this.name()+'"';
if (this.value()!=undefined && this.value()!="") {
pts[pts.length]='value:"'+escape(this.value())+'"';
}
var attr='attr:[';
var f=0;
for (var x in this.i_attributes) {
if (x.substr(0, 2)=="p_") {
attr+=(f++==0 ? "" : ",")+'["'+x.substr(2)+'","'+escape(this.i_attributes[x])+'"]';
}
}
attr+="]";
if (f > 0) {
pts[pts.length]=attr;
}
if (this.i_children.length > 0) {
var nds='nodes:[';
var f=0;
for (var x=0; x < this.i_children.length; x++) {
nds+=(f++==0 ? "" : ",")+this.i_children[x].toJSON(true);
}
nds+="]";
pts[pts.length]=nds;
}
str=(not_root!=true ? "[" : "")+"{"+pts.join(',')+"}"+(not_root!=true ? "]" : "");
return str;
}
DataNode.encodeXML=function(value) {
if (value!=undefined && value.replace!=undefined) {
value=value.replace(/&/g, '&amp;');
value=value.replace(/>/g, '&gt;');
value=value.replace(/</g, '&lt;');
value=value.replace(/\"/g, '&quot;');
		}
		return value;
	}
	
	/**
	 *	Serialize this object into XML format
	 *
	 *	@param formatted (Optional) True if you want line breaks and tabbing for readability
	 *	@param not_root (Optional) Set if this is not the root node of the document which the XML will
	 *					be used in.
	 *	@param depth (Optional) Used by the formatting operation to keep tabbing
	 *
	 *	@return an XML string that represents this object and its children
	 */
	DataNode.prototype.toXML = function(formatted, not_root, depth) {
		var str = (not_root == true ? "" : "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>")+(formatted==true ? "\n" : "");
var pad="";
if (formatted) {
for (var z=0; z < depth; z++) {
pad+="    ";	
}
}
str+=pad+"<"+this.name();
for (var x in this.i_attributes) {
if (x.substr(0, 2)=="p_") {
str+=" "+x.substr(2)+'="'+DataNode.encodeXML(this.i_attributes[x])+'"';
}
}
if (this.i_children.length==0 && (this.i_value==="" || this.i_value===undefined) && this.i_value!=="0" && this.i_value!==0) {
str+=" />"+(formatted ? "\n" : "");
}
else {
str+=">"+((formatted==true && this.i_children.length > 0) ? "\n" : "");
for (var x=0; x < this.i_children.length; x++) {
str+=this.i_children[x].toXML(formatted, true, (depth==undefined ? 1 : depth+1));
}
if (this.i_children.length==0) {
str+=DataNode.encodeXML(this.value());
}
str+=(this.i_children.length > 0 ? pad : "")+"</"+this.name()+">"+(formatted==true ? "\n" : "");
}
return str;
}
DataNode.prototype.toString=function() {
return this.toXML(true);
}
DataNode.fromString=function(str) {
if (typeof str=="object") {
var u=str;
if (str.splice!=undefined) {
u=str[0];	
}
return DataNode.fromJSON(u);
}
else if (str.substr(0, 2)=="[{") {
var root;
try {
root=eval(str);
root=root[0];
}
catch (e) {
console.log('Improperly formatted JSON code ['+e.message+']: '+str);
return undefined;
}
return DataNode.fromJSON(root);
}
else if (str.substr(0, 2)=="<?") {
var dParse;
var doc;
try {
dParse=new DOMParser();
doc=dParse.parseFromString(str, 'application/xml');
} catch (e) {
doc=new ActiveXObject("MSXML2.DOMDocument");
doc.loadXML(str);			
}
if (doc==undefined || doc.documentElement==undefined) {
console.log('XML document not supported by this browser');
}
else {
return DataNode.fromXML(doc.documentElement);
}
}
else {
console.log('Unkown data node format: '+str);
return undefined;
}
}
DataNode.fromJSON=function(json) {
var dn=new DataNode(json.name);
if (json.attr!=undefined) {
for (var x=0; x < json.attr.length; x++) { 
dn.attribute(json.attr[x][0], unescape(json.attr[x][1]));
}
}
if (json.value!=undefined) {
dn.value(unescape(json.value));
}
if (json.nodes!=undefined) {
for (var x=0; x < json.nodes.length; x++) {
dn.addNode(DataNode.fromJSON(json.nodes[x]));
}
}
return dn;
}
DataNode.fromXML=function(xml) {
var node_name=xml.nodeName;
var node_value=null;
if (xml.firstChild!=undefined && xml.firstChild.nodeName=="#text") {
if (xml.childNodes.length==1) {
node_value=unescape(xml.firstChild.nodeValue);
}
else {
if (!document.all) {
var allChildNodesAreText=true;
for (var i=0; i < xml.childNodes.length; i++) {
if (xml.childNodes[i].nodeName!="#text") {
allChildNodesAreText=false;
}
}
if (allChildNodesAreText) {
node_value=unescape(xml.textContent);
}
}
}
}
var node=new DataNode(node_name, ((node_value!="" && node_value!=undefined) ? node_value : undefined));
for (var x=0; x < xml.attributes.length; x++) { 
node.attribute(xml.attributes[x].nodeName, unescape(xml.attributes[x].nodeValue));
}
var children=xml.childNodes;
var real_children=Array();
for (var x=0; x < children.length; x++) {
if (children[x].nodeName!="#text") {
real_children[real_children.length]=children[x];
}
}
for (var x=0; x < real_children.length; x++) {
node.addNode(DataNode.fromXML(real_children[x]));
}
return node;
}
JavaScriptResource.notifyComplete("./lib/controllers/Controller.Transport.js");
APIManager.registerStatus(new StatusCode("20000000", "Success", true));
APIManager.registerStatus(new StatusCode("20000001", "CODE_SUCCESS_WITH_ERRORS	20000001", true));
APIManager.registerStatus(new StatusCode("20001000", "Unspecified Error", false));
APIManager.registerStatus(new StatusCode("20001001", "Server error", false));
APIManager.registerStatus(new StatusCode("20001002", "API not available", false));
APIManager.registerStatus(new StatusCode("20001003", "Numeric or value error", false));
APIManager.registerStatus(new StatusCode("20001004", "Authentication failed", false));
APIManager.registerStatus(new StatusCode("20001005", "Invalid request format", false));
APIManager.registerStatus(new StatusCode("20001006", "Not certified", false));
APIManager.registerStatus(new StatusCode("20001007", "Request not processed", false));
APIManager.registerStatus(new StatusCode("20001008", "Invalid Session", false));
APIManager.registerStatus(new StatusCode("20001009", "Permission denied", false));
APIManager.registerStatus(new StatusCode("20002001", "Application does not exist", false));
APIManager.registerStatus(new StatusCode("20002002", "Domain does not exist", false));
APIManager.registerStatus(new StatusCode("20002003", "Domain already taken", false));
APIManager.registerStatus(new StatusCode("20002004", "Username already exists", false));
APIManager.registerStatus(new StatusCode("20002005", "Enterprise name already exists", false));
APIManager.registerStatus(new StatusCode("20002006", "Enterprise is locked", false));
APIManager.registerStatus(new StatusCode("20002007", "Enterprise has been cancelled", false));
APIManager.registerStatus(new StatusCode("20002008", "User has been cancelled", false));
APIManager.registerStatus(new StatusCode("20002009", "Account (user) is locked", false));
APIManager.registerStatus(new StatusCode("20002010", "User not found", false));
APIManager.registerStatus(new StatusCode("20002011", "Enterprise not found", false));
APIManager.registerStatus(new StatusCode("20002012", "Invalid account plan", false));
APIManager.registerStatus(new StatusCode("20002013", "Invalid division", false));
APIManager.registerStatus(new StatusCode("20002014", "Invalid access limit", false));
APIManager.registerStatus(new StatusCode("20002015", "Invalid username", false));
APIManager.registerStatus(new StatusCode("20002016", "Quota / usage discrepancy", false));
APIManager.registerStatus(new StatusCode("20002017", "Alias already exists", false));
APIManager.registerStatus(new StatusCode("20002018", "Invalid domain", false));
APIManager.registerStatus(new StatusCode("20002019", "Forward already exists", false));
APIManager.registerStatus(new StatusCode("20002020", "Invalid password", false));
APIManager.registerStatus(new StatusCode("20002021", "Invalid credit card", false));
APIManager.registerStatus(new StatusCode("20002022", "Invalid user for action", false));
APIManager.registerStatus(new StatusCode("20002023", "Forward does not exist", false));
APIManager.registerStatus(new StatusCode("20002024", "SSL could not be enabled", false));
APIManager.registerStatus(new StatusCode("20002025", "Plan must support SSL", false));
APIManager.registerStatus(new StatusCode("20002026", "Invalid Reseller parent ID", false));
APIManager.registerStatus(new StatusCode("20002027", "Reseller contains other Resellers or Enterprises", false));
APIManager.registerStatus(new StatusCode("20002028", "Invalid plan or plan needs SSL", false));
APIManager.registerStatus(new StatusCode("20002029", "Reseller name is too short", false));
APIManager.registerStatus(new StatusCode("20002030", "Reseller name is too long", false));
APIManager.registerStatus(new StatusCode("20002031", "Invalid Reseller name", false));
APIManager.registerStatus(new StatusCode("20002032", "Reseller name already exists", false));
APIManager.registerStatus(new StatusCode("20002033", "Invalid Reseller account type", false));
APIManager.registerStatus(new StatusCode("20002034", "Reseller not found", false));
APIManager.registerStatus(new StatusCode("20002035", "Invalid or missing Enterprise parent", false));
APIManager.registerStatus(new StatusCode("20002036", "Enterprise name too short", false));
APIManager.registerStatus(new StatusCode("20002037", "Enterprise name too long", false));
APIManager.registerStatus(new StatusCode("20002038", "Enterprise name invalid", false));
APIManager.registerStatus(new StatusCode("20002039", "Allocated plan slots exceeded", false));
APIManager.registerStatus(new StatusCode("20002040", "USEDESC", false));
APIManager.registerStatus(new StatusCode("20002041", "Extranet User creation failed", false));
APIManager.registerStatus(new StatusCode("20002042", "Support ID cannot be found", false));
APIManager.registerStatus(new StatusCode("20002043", "UserID or Timeout value given was not a valid numerical value.", false));
APIManager.registerStatus(new StatusCode("20002044", "Unknown behavior", false));
APIManager.registerStatus(new StatusCode("20002045", "Exceeded maximum number of requests in a single transaction.", false, true));
APIManager.registerStatus(new StatusCode("20002046", "Malformed Data (XML) in request.", false, true));
APIManager.registerStatus(new StatusCode("20002047", "File exceeds attachment size limits", false));
JavaScriptResource.notifyComplete("./lib/controllers/Controller.Transport.StatusCodes.js");
PopoutWindow.registerGroup("UniversalForm", ["UniversalForm",
"UniversalFormSection",
"UniversalFormRow",
"UniversalFormInput", 
"UniversalTextInput",
"UniversalBlankInput",
"UniversalLabelInput",
"UniversalDateInput",
"UniversalTextAreaInput",
"UniversalCheckBoxInput",
"UniversalCheckBoxOption",
"UniversalRadioInput",
"UniversalRadioOption",
"UniversalButtonInput",
"UniversalOptionBoxInput",
"UniversalOptionBoxOption",
"MiniCalendar",
"MiniCalendarSelector",
"UniversalAddRemoveListInput",
"UniversalSimpleClickAddRemoveListInput",
"UniversalSortedEditListInput",
"UniversalEmailAddressField",
"StringLengthValidationRule",
"@EmailAddressField"]);
function ValidationRule(message) {
this.superConstructor(message);
}
ValidationRule.prototype.superConstructor=function(message) {
this.i_message=(message!=undefined ? message : "No Message Set");
}
ValidationRule.prototype.message=function(message) {
if (message!=undefined) {
this.i_message=message;
}
return this.i_message;
}
ValidationRule.prototype.validate=null;
function NumericRangeValidationRule(min, max, message) {
this.i_min=min;
this.i_max=max;
this.superConstructor(message);
}
NumericRangeValidationRule.prototype.validate=function(input) {
var valid=false;
var value=input.value();
if(isNumber(String(value))) {
value=parseInt(value, 10);
if(!isNaN(value) && value >=this.i_min && value <=this.i_max) {
valid=true;
}
}
return valid;
}
NumericRangeValidationRule.inherit(ValidationRule);
function FutureDateValidationRule(message) {
this.superConstructor(message);
}
FutureDateValidationRule.prototype.validate=function(input) {
var valid=false;
var value=input.value();
if(!isNaN(value)) {
var now=new Date();
if(value > now) {
valid=true;
}
}
return valid;
}
FutureDateValidationRule.inherit(ValidationRule);
function BeforeDateValidationRule(before_input, message) {
this.i_before_input=before_input;
this.superConstructor(message);
}
BeforeDateValidationRule.prototype.validate=function(input) {
var valid=false;
var value=input.value();
var before_value=this.i_before_input.value();
if(!isNaN(value.getDate()) && !isNaN(before_value.getDate())) {
if(value < before_value) {
valid=true;
}
}
return valid;
}
BeforeDateValidationRule.inherit(ValidationRule);
function ConfirmationValidationRule(other_input, message) {
this.i_other_input=other_input;
this.superConstructor(message);
}
ConfirmationValidationRule.prototype.validate=function(input) {
return (input.value()==this.i_other_input.value()) ? true : false;
}
ConfirmationValidationRule.inherit(ValidationRule);
function StringLengthValidationRule(max_length, message) {
this.i_max_length=max_length;
this.superConstructor(message);
}
StringLengthValidationRule.prototype.validate=function(input) {
var value=input.value();
var ret=true;
if(value!=undefined && value.length > 255) {
ret=false;
}
return ret;
}
StringLengthValidationRule.inherit(ValidationRule);
function UniversalForm(width, labelWidth) {
this.i_width=width;
this.i_height=0;
this.i_sections=Array();
this.i_labelWidth=(labelWidth!=undefined ? labelWidth : 100);
this.i_staticMode=false;
this.i_errors=[];
this.i_line_up_all_columns=true;
this.i_queue_inputs=false;
this.i_queue_complete=true;
}
UniversalForm.minimumInputWidth=50;
UniversalForm.rowSpacing=5;
UniversalForm.columnPadding=12;
UniversalForm.leftPadding=7;
UniversalForm.sectionPadding=4;
UniversalForm.descriptionPadding=7;
UniversalForm.prototype.onresize=null;
UniversalForm.prototype.queueInputs=function(state) {
if (state!=undefined) {
this.i_queue_inputs=state;
this.i_queue_complete=false;
}
return this.i_queue_inputs;
}
UniversalForm.prototype.queueComplete=function(complete) {
if (complete!=undefined) {
if (this.i_queue_complete!=complete && complete==true && this.i_queue_inputs) {
this.updateHeight();
}
this.i_queue_complete=complete;
}
return this.i_queue_complete;
}
UniversalForm.prototype.width=function(width) {
if (width!=undefined) {
var oldWidth=this.i_width;
if (width < 0) {
width=0;
}
if (oldWidth!=width) {
this.i_width=width;
this.i_error_box.style.width=width+"px";
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].width(width);
}
if (this.i_form!=undefined) {
this.i_form.style.width=this.width()+"px";
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.form=this;
this.onresize(o);
}
}
}
return this.i_width;
}
UniversalForm.prototype.height=function() {
return this.i_height;
}
UniversalForm.prototype.staticMode=function(state) {
if (state!=undefined) {
if (this.i_staticMode!=state) {
this.i_staticMode=state;
if (this.i_form!=undefined) {
this.i_form.style.display="none";
}
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].staticMode(state);
}
for (var x=0; x < this.i_sections.length; x++) {
for (var z=0; z < this.i_sections[x].i_rows.length; z++) {
this.i_sections[x].i_rows[z].updateHeight(true);
}
this.i_sections[x].updateHeight(true);
}
this.updateHeight();
if (this.i_form!=undefined) {
this.i_form.style.display="";
}
}
}
return this.i_staticMode;
}
UniversalForm.prototype.refreshStaticView=function() {
for (var x=0; x < this.i_sections.length; x++) {
var sec=this.i_sections[x];
for (var z=0; z < sec.i_rows.length; z++) {
var row=sec.i_rows[z];
for (var q=0; q < row.i_inputs.length; q++) {
var inp=row.i_inputs[q];
inp.handleValueChange({'type':'change'});
}
}
}
}
UniversalForm.prototype.updateHeight=function() {
if (!this.queueComplete()) return;
var oldHeight=this.i_height;
var h=0;
if(this.i_error_box) {
h+=this.i_error_box.offsetHeight;
}
for (var x=0; x < this.i_sections.length; x++) {
h+=this.i_sections[x].height();
}
this.i_height=h;
if (this.i_form!=undefined) {
this.i_form.style.height=h+"px";
}
if (h!=oldHeight) {
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.form=this;
this.onresize(o);
}
}
}
UniversalForm.prototype.clearModified=function() {
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].clearModified();
}
}
UniversalForm.prototype.isModified=function() {
var m=false;
for (var x=0; x < this.i_sections.length; x++) {
m=(this.i_sections[x].isModified() ? true : m);
if (m) {
break;
}
}
return m;
}
UniversalForm.prototype.reset=function() {
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].reset();
}
}
UniversalForm.prototype.validate=function(noMark) {
var res=Array();
noMark=(noMark!=undefined ? noMark : false);
this.clearErrors();
for (var x=0; x < this.i_sections.length; x++) {
for (var z=0; z < this.i_sections[x].i_rows.length; z++) {
for (var y=0; y < this.i_sections[x].i_rows[z].i_inputs.length; y++) {
var i=this.i_sections[x].i_rows[z].i_inputs[y];	
var r=i.value();	
if ((r==undefined || r=="") && i.required()) {
res[res.length]=i;
if (!noMark) {
i.invalidData(true);
i.addErrorMessage(i.requiredMessage());
this.addErrorMessage(i.requiredMessage());
}
}
else {
var v_rules=i.validationRules();
for (var m=0; m < v_rules.length; m++) {
if (!v_rules[m].validate(i)) {
res[res.length]=i;
if (!noMark) {
i.invalidData(true);
i.addErrorMessage(v_rules[m].message());
this.addErrorMessage(v_rules[m].message());
}
}
}
}
}
}
}
return res;
}
UniversalForm.prototype.errors=function() {
return this.i_errors;
}
UniversalForm.prototype.clearErrors=function() {
this.i_errors=[];
for (var x=0; x < this.i_sections.length; x++) {
for (var z=0; z < this.i_sections[x].i_rows.length; z++) {
for (var y=0; y < this.i_sections[x].i_rows[z].i_inputs.length; y++) {
var i=this.i_sections[x].i_rows[z].i_inputs[y];	
i.invalidData(false);
i.clearErrors();
}
}
}
}
UniversalForm.prototype.addErrorMessage=function(message) {
this.i_errors[this.i_errors.length]=message;
return message;
}
UniversalForm.prototype.displayErrorBox=function(message) {
this.i_error_box.innerHTML="";
if(this.i_errors.length > 0) {
if(message) {
var message_container=document.createElement("p");
message_container.innerHTML=message;
this.i_error_box.appendChild(message_container);
}
var list=document.createElement("ul");
for(var i=0; i < this.i_errors.length; i++) {
var item=document.createElement("li");
item.innerHTML=this.i_errors[i];
list.appendChild(item);
}
this.i_error_box.appendChild(list);
this.i_error_box.style.display="block";
} else {
this.i_error_box.style.display="none";
}
}
UniversalForm.prototype.labelWidth=function(width) {
if (width!=undefined) {
this.i_labelWidth=width;
this.width(this.width());
}
return this.i_labelWidth;
}
UniversalForm.prototype.header=function(header) {
if(header!=undefined) {
this.i_header=header;
}
return this.i_header;
}
UniversalForm.prototype.sections=function(index) {
if (index!=undefined) {
return this.i_sections[index];
}
return this.i_sections;
}
UniversalForm.prototype.addSection=function(section, beforeSection) {
if(section.parent()!=this) {
var append=true;
section.first(false);
section.staticMode(this.staticMode());
if (beforeSection!=undefined) {
for (var x=0; x < this.i_sections.length; x++) {  
if (this.i_sections[x]==beforeSection) {
this.i_sections.splice(x, 0, section);
if (x==0) {
beforeSection.first(false);
section.first(true);
}
if (this.i_form!=undefined) {
this.i_form.insertBefore(section.getSection(), beforeSection.getSection());
}
append=false;
break;
}
}
}
if (append) {
if (this.i_sections.length==0) {
section.first(true);
}
this.i_sections[this.i_sections.length]=section;
if (this.i_form!=undefined) {
this.i_form.appendChild(section.getSection());
}
}
section.parentForm(this);
section.i_parent=this;
section.width(this.width());
this.updateHeight();
}
return section;
}
UniversalForm.prototype.removeSection=function(section) {
for (var x=0; x < this.i_sections.length; x++) {
if (this.i_sections[x]==section) {
this.i_sections.splice(x, 1);
if (x==0) {
if (this.i_sections.length > 0) {
this.i_sections[0].first(true);
}
}
if (this.i_form!=undefined) {
this.i_form.removeChild(section.getSection());
}
section.i_parent=null;
this.updateHeight();
return true;
}
}
return false;
}
UniversalForm.prototype.getForm=function() {
if (this.i_form==undefined) {
this.i_form=document.createElement('DIV');
this.i_form.className="UniversalForm";
this.i_form.style.width=this.width()+"px";
if(this.header()) {
this.i_form.appendChild(this.header());
}
this.i_error_box=document.createElement("div");
this.i_error_box.className="UniversalFormErrorBox";
this.i_error_box.style.display="none";
this.i_error_box.style.width=this.width()+"px";
this.i_form.appendChild(this.i_error_box);
for (var x=0; x < this.i_sections.length; x++) {
this.i_form.appendChild(this.i_sections[x].getSection());
}
this.width(this.width());
}
return this.i_form;
}
UniversalForm.prototype.lineUpAllColumns=function(state) {
if(state!=undefined) {
this.i_line_up_all_columns=state;
}
return this.i_line_up_all_columns;
}
UniversalForm.textInputPaddingTop=function() {
return (document.all) ? "2px" : "3px";
}
function UniversalFormSection(name, description) {
this.i_rows=Array();
this.i_width=100;
this.i_height=0;
this.i_name_height=0;
this.i_description_height=0;
this.i_first=false;
this.i_staticMode=false;
this.name(name);
this.description(description);
}
UniversalFormSection.prototype.parent=function() {
return this.i_parent;
}
UniversalFormSection.prototype.parentForm=function(frm) {
if (frm!=undefined) {
if (frm==false) {
frm=undefined;
}
this.i_parent_form=frm;
for (var x=0; x < this.i_rows.length; x++) {
this.i_rows[x].parentForm(frm==undefined ? false : frm);
}
}
return this.i_parent_form;
}
UniversalFormSection.prototype.staticMode=function(state) {
if (state!=undefined) {
if (this.i_staticMode!=state) {
this.i_staticMode=state;
for (var x=0; x < this.i_rows.length; x++) {
this.i_rows[x].staticMode(state);
}
}
}
return this.i_staticMode;
}
UniversalFormSection.prototype.first=function(state) {
if (state!=undefined) {
this.i_first=state;
if (this.i_section!=undefined) {
this.i_section.className="UniversalFormSection"+(this.first() ? "_first" : "");
}
}
return this.i_first;
}
UniversalFormSection.prototype.clearModified=function() {
for (var x=0; x < this.i_rows.length; x++) {
this.i_rows[x].clearModified();
}
}
UniversalFormSection.prototype.isModified=function() {
var m=false;
for (var x=0; x < this.i_rows.length; x++) {
m=(this.i_rows[x].isModified() ? true : m);
if (m) {
break;
}
}
return m;
}
UniversalFormSection.prototype.reset=function() {
for (var x=0; x < this.i_rows.length; x++) {
this.i_rows[x].reset();
}
}
UniversalFormSection.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_section!=undefined) {
this.i_section_name.innerHTML=this.name();
}
this.updateNameHeight();
this.updateHeight();
}
return this.i_name;
}	
UniversalFormSection.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
if (this.i_section!=undefined) {
this.i_section_description.innerHTML=this.description();
}
this.updateDescriptionHeight();
this.updateHeight();
}
return this.i_description;
}
UniversalFormSection.prototype.width=function(width) {
if (width!=undefined) {
if (width < 0) {
width=0;
}
this.i_width=width;
for (var x=0; x < this.i_rows.length; x++) {
this.i_rows[x].width(width);
}
if (this.i_section!=undefined) {
this.i_section.style.width=width+"px";
this.i_section_name.style.width=this.width()+"px";
this.i_section_description.style.width=this.width()+"px";
}
this.updateNameHeight();
this.updateDescriptionHeight();
this.updateHeight();
}
return this.i_width;
}
UniversalFormSection.prototype.height=function() {
return this.i_height;
}
UniversalFormSection.prototype.updateNameHeight=function() {
if(this.i_section_name) {
this.i_section_name.style.display=(this.name()) ? "" : "none";
}
if(this.name()) {
var dn=TextDimension(this.name(), "UniversalFormSection_name_adjust", this.width());
this.i_name_height=dn.height;
} else {
this.i_name_height=0;
}
}
UniversalFormSection.prototype.updateDescriptionHeight=function() {
if(this.i_section_description) {
this.i_section_description.style.display=(this.description()) ? "" : "none";
}
if(this.description()) {
var dn=TextDimension(this.description(), "UniversalFormSection_description_adjust", this.width());
this.i_description_height=dn.height;
} else {
this.i_description_height=0;
}
}
UniversalFormSection.prototype.updateHeight=function(ignore_parent) {
if (this.parentForm()==undefined || (this.parentForm()!=undefined && !this.parentForm().queueComplete())) return;
var old_height=this.height();
var h=UniversalForm.sectionPadding+UniversalForm.descriptionPadding;
h+=this.i_name_height;
h+=this.i_description_height;
for (var x=0; x < this.i_rows.length; x++) {
h+=this.i_rows[x].height();
}
this.i_height=h;
if(this.height()!=old_height) {
if (this.i_section!=undefined) {
this.i_section.style.height=h+"px";
}
if (this.parent()!=undefined && ignore_parent!=true) {
this.parent().updateHeight();
}
}
}
UniversalFormSection.prototype.rows=function(index) {
if (index!=undefined) {
return this.i_rows[index];
}
return this.i_rows;
}
UniversalFormSection.prototype.addRow=function(row, beforeRow) {
if(row.parent()!=this) {
var append=true;
row.i_parent=this;
row.parentForm(this.parentForm());
row.staticMode(this.staticMode());
if (beforeRow!=undefined) {
for (var x=0; x < this.i_rows.length; x++) {
if (this.i_rows[x]==beforeRow) {
this.i_rows.splice(x, 0, row);
if (this.i_section!=undefined) {
this.i_section.insertBefore(row.getRow(), beforeRow.getRow());
}
append=false;
break;
}
}
}
if (append) {
this.i_rows[this.i_rows.length]=row;
if (this.i_section!=undefined && document!=undefined) {
this.i_section.appendChild(row.getRow());
}
}
row.width(this.width());
this.updateHeight();
}
return row;
}
UniversalFormSection.prototype.removeRow=function(row) {
for (var x=0; x < this.i_rows.length; x++) {
if (this.i_rows[x]==row) {
this.i_rows.splice(x, 1);
if (this.i_section!=undefined) {
this.i_section.removeChild(row.getRow());
}
row.i_parent=null;
row.parentForm(false);
this.updateHeight();
return true;
}
}
return false;
}
UniversalFormSection.prototype.getSection=function() {
if (this.i_section==undefined) {
this.i_section=document.createElement('DIV');
this.i_section.className="UniversalFormSection"+(this.first() ? "_first" : "");
this.i_section.style.width=this.width()+"px";
this.i_section_name=document.createElement('DIV');
this.i_section_name.className="UniversalFormSection_name";
this.i_section_name.innerHTML=(this.name()) ? this.name() : "";
this.i_section_name.style.width=this.width()+"px";
if (document.all && this.name()==" ") {
this.i_section_name.style.fontSize="1px";	
this.i_section_name.style.lineHeight="0";
}
this.i_section.appendChild(this.i_section_name);
this.i_section_description=document.createElement('DIV');
this.i_section_description.className="UniversalFormSection_description";
this.i_section_description.innerHTML=(this.description()!=undefined ? this.description() : "");
this.i_section_description.style.width=this.width()+"px";
this.i_section.appendChild(this.i_section_description);
this.i_section_padding=document.createElement('DIV');
this.i_section_padding.className="UniversalFormSection_padding";
this.i_section_padding.innerHTML="&nbsp;";
this.i_section_padding.style.height=UniversalForm.descriptionPadding+"px";
this.i_section.appendChild(this.i_section_padding);
for (var x=0; x < this.i_rows.length; x++) {
this.i_section.appendChild(this.i_rows[x].getRow());
}
this.updateHeight();
}
return this.i_section;
}
function UniversalFormRow() {
this.i_inputs=Array();
this.i_width=100;
this.i_height=0;
this.i_staticMode=false;
for (var x=0; x < arguments.length; x++) {
this.addInput(arguments[x]);
}
}
UniversalFormRow.prototype.parent=function() {
return this.i_parent;
}
UniversalFormRow.prototype.parentForm=function(frm) {
if (frm!=undefined) {
if (frm==false) {
frm=undefined;
}
this.i_parent_form=frm;
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].parentForm(frm==undefined ? false : frm);
}
}	
return this.i_parent_form;
}
UniversalFormRow.prototype.staticMode=function(state) {
if (state!=undefined) {
if (this.i_staticMode!=state) {
this.i_staticMode=state;
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].staticMode(state);
}
}
}
return this.i_staticMode;
}
UniversalFormRow.prototype.clearModified=function() {
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].clearModified();
}
}
UniversalFormRow.prototype.isModified=function() {
var m=false;
for (var x=0; x < this.i_inputs.length; x++) {
m=(this.i_inputs[x].isModified() ? true : m);
if (m) {
break;
}
}
return m;
}
UniversalFormRow.prototype.reset=function() {
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].reset();
}
}
UniversalFormRow.prototype.inputs=function(index) {
if (index!=undefined) {
return this.i_inputs[index];
}
return this.i_inputs;
}
UniversalFormRow.prototype.width=function(width) {
if (width!=undefined) {
if (width < 0) {
width=0;
}
this.i_width=width;
var input_width=width;
for(var i=0; i < this.i_inputs.length; i++) {
if(this.i_inputs[i].isStaticWidthLabel()) {
input_width -=this.parentForm().labelWidth();
}
}
input_width -=(this.i_inputs.length - 1) * UniversalForm.columnPadding;
if(input_width < 0) {
input_width=0;
}
var dm=new DimensionProcessor(input_width);
for (var x=0; x < this.i_inputs.length; x++) {
var rat=0;
var wid=this.i_inputs[x].width();
if (this.i_inputs[x].width().indexOf!=undefined) {
if (this.i_inputs[x].width().indexOf('%') > -1) {
rat=(parseInt(wid) / 100);
wid=0;
}
}
dm.addNode(UniversalForm.minimumInputWidth, wid, rat, 0);
}
dm.normalize();
var dr=dm.calculate();
for (var x=0; x < this.i_inputs.length; x++) {
var label_width=(this.i_inputs[x].isStaticWidthLabel()) ? this.parentForm().labelWidth() : 0;
var padding=(x==this.i_inputs.length - 1) ? 0 : UniversalForm.columnPadding;
this.i_inputs[x].effectiveWidth(label_width+padding+dr.nodes[x].value);
this.i_inputs[x].firstInput(x==0 ? true : false);
}
if (this.i_row!=undefined) {
this.i_row.style.width=width+"px";
}
this.updateHeight();
}
return this.i_width;
}
UniversalFormRow.prototype.height=function() {
return this.i_height;
}
UniversalFormRow.prototype.updateHeight=function(ignore_parent) {
if (this.parentForm()==undefined || (this.parentForm()!=undefined && !this.parentForm().queueComplete())) return;
var h=0; 
for (var x=0; x < this.i_inputs.length; x++) {
if (h < this.i_inputs[x].effectiveHeight()) {
h=this.i_inputs[x].effectiveHeight();
}
}
h+=UniversalForm.rowSpacing;
this.i_height=h;
if (this.i_row!=undefined) {
this.i_row.style.height=h+"px";
}
if (this.parent()!=undefined && ignore_parent!=true) {
this.parent().updateHeight();
}
}
UniversalFormRow.prototype.addInput=function(input, beforeInput) {
var append=true;
input.i_parent=this;
input.parentForm(this.parentForm());
input.staticMode(this.staticMode());
if (beforeInput!=undefined) {
for (var x=0; x < this.i_inputs.length; x++) {
if (this.i_inputs[x]==beforeInput) {
this.i_inputs.splice(x, 0, input);
if (this.i_row!=undefined) {
this.i_row.insertBefore(input.getInput(), beforeInput.getInput());
}
append=false;
}
}
}
if (append) {
this.i_inputs[this.i_inputs.length]=input;
if (this.i_row!=undefined) {
if(input==this.i_inputs[0]) {
input.firstInput(true);
}
this.i_row.appendChild(input.getInput());
}
}
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].firstInput(x==0 ? true : false);	
}
this.updateHeight();
return input;
}
UniversalFormRow.prototype.removeInput=function(input) {
for (var x=0; x < this.i_inputs.length; x++) {
if (this.i_inputs[x]==input) {
this.i_inputs.splice(x, 1);
input.i_parent=null;
input.parentForm(false);
if (this.i_row!==undefined) {
this.i_row.removeChild(input.getInput());
}
for (var x=0; x < this.i_inputs.length; x++) {
this.i_inputs[x].firstInput(x==0 ? true : false);	
}
this.updateHeight();
return true;
}
}
return false;
}
UniversalFormRow.prototype.getRow=function() {
if (this.i_row==undefined && document!=undefined) {
this.i_row=document.createElement('DIV');
this.i_row.className="UniversalFormRow";
this.i_row.style.width=this.width()+"px";
for (var x=0; x < this.i_inputs.length; x++) {
this.i_row.appendChild(this.i_inputs[x].getInput());
}
this.updateHeight();
}
return this.i_row;
}
function UniversalFormInput(name, description, width, height) {
this.superConstructor("none", name, description, width, height);
}
UniversalFormInput.prototype.onresize=null;
UniversalFormInput.prototype.onchange=null;
UniversalFormInput.prototype.ontranslate=null;
UniversalFormInput.prototype.superConstructor=function(type, name, description, width, height) {
this.i_type=type;
this.i_height=height;
if(this.i_height==undefined || isNaN(this.i_height)) {
this.i_height=22;
}
this.i_static_height=this.i_height;
this.i_labelWidth=0;
this.i_width=(width!=undefined ? width : "100%");
this.i_eff_width=100;
this.i_eff_height=22;
this.i_inp_width=100;
this.i_inp_height=22;
this.i_required=false;
this.i_invalid=false;
this.i_rules=Array();
this.i_errors=Array();
this.i_first=false;
this.i_staticMode=false;
this.i_override_visibility=false;
this.name(name);
this.description(description);
EventHandler.register(this, "onchange", this.handleValueChange, this);
}
UniversalFormInput.prototype.parent=function() {
return this.i_parent;
}
UniversalFormInput.prototype.overrideVisibility=function(state) {
if (state!=undefined) {
this.i_override_visibility=state;
}
return this.i_override_visibility;
}
UniversalFormInput.prototype.staticMode=function(state) {
if (state!=undefined) {
if (this.i_staticMode!=state) {
this.i_staticMode=state;
this.i_static_trans=true;
if (this.i_input_object!=undefined) {
if (!state) {
if (this.i_static_label!=undefined) {
this.getStaticInput().style.display="none";
}
this.inputObject().style.display="";
this.staticLabelTextObject().style.display="none";
this.labelTextObject().style.display="";
}
else {
if (this.i_static_appended!=true) {
this.i_input_object.appendChild(this.getStaticInput());
this.i_static_appended=true;
}
this.getStaticInput().style.display="";
this.labelTextObject().style.display="none";
this.staticLabelTextObject().style.display="";
if (this.i_override_visibility==false) {
this.inputObject().style.display="none";
}
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
}
this.effectiveWidth(this.effectiveWidth());
this.i_static_trans=false;
}
if(this.onstatic!=null) {
var o={
type: "static",
static: this.i_staticMode
};
this.onstatic(o);
}
}
return this.i_staticMode;
}
UniversalFormInput.prototype.parentForm=function(frm) {
if (frm!=undefined) {
if (frm==false) {
frm=undefined;
}
this.i_parent_form=frm;
}
return this.i_parent_form;
}
UniversalFormInput.prototype.validationRules=function(index) {
if (index!=undefined) {
return this.i_rules[index];
}
return this.i_rules;
}
UniversalFormInput.prototype.addValidationRule=function(rule) {
this.i_rules[this.i_rules.length]=rule;
return rule;
}
UniversalFormInput.prototype.removeValidationRule=function(rule) {
for (var x=0; x < this.i_rules.length; x++) { 
if (this.i_rules[x]==rule) {
this.i_rules.splice(x, 1);
return true;
}
}
return false;
}
UniversalFormInput.prototype.errors=function(index) {
if (index!=undefined) {
return this.i_errors[index];
}
return this.i_errors;
}
UniversalFormInput.prototype.clearErrors=function() {
this.i_errors=Array();
}
UniversalFormInput.prototype.addErrorMessage=function(message) {
this.i_errors[this.i_errors.length]=message;
return message;
}
UniversalFormInput.prototype.required=function(state, message) {
if (state!=undefined) {
this.i_required=state;
this.requiredMessage(message);
if (this.i_input_asterix!=undefined) {
this.i_input_asterix.className="UniversalFormInput_required"+(this.invalidData() ? "_hover" : "");
}
this.effectiveWidth(this.effectiveWidth());
}
return this.i_required;
}
UniversalFormInput.prototype.requiredMessage=function(message) {
if(message!=undefined) {
this.i_required_message=message;
}
return this.i_required_message || "This field is required";
}
UniversalFormInput.prototype.invalidData=function(state) {
if (state!=undefined) {
this.i_invalid=state;
if (this.i_input_asterix!=undefined) {
this.i_input_asterix.className="UniversalFormInput_required"+(this.invalidData() ? "_hover" : "");
}
this.i_input.className="UniversalFormInput";
this.i_input.className+=(this.invalidData()) ? " UniversalFormInput_invalid" : "";
this.effectiveWidth(this.effectiveWidth());
}
return this.i_invalid;
}
UniversalFormInput.prototype.type=function() {
return this.i_type;
}
UniversalFormInput.prototype.firstInput=function(state) {
if (state!=undefined) {
this.i_first=state;
}
return this.i_first;
}
UniversalFormInput.prototype.isStaticWidthLabel=function() {
var static=false;
if(this.firstInput() || (this.name() && this.parentForm() && this.parentForm().lineUpAllColumns())) {
static=true;
}
return static;
}
UniversalFormInput.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_input_text!=undefined) {
this.i_input_text.innerHTML=this.displayName();
}
this.effectiveWidth(this.effectiveWidth());
}
return this.i_name;
}
UniversalFormInput.prototype.disableColon=function(disable_colon) {
if(disable_colon!=undefined) {
this.i_disable_colon=disable_colon;
}
return this.i_disable_colon;
}
UniversalFormInput.prototype.nameColon=function() {
return (this.disableColon()) ? "" : ":";
}
UniversalFormInput.prototype.displayName=function() {
return (this.name()) ? this.name()+this.nameColon() : "";
}
UniversalFormInput.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
if (this.i_input!=undefined) {
this.i_input_description.innerHTML=this.description();
}
this.effectiveWidth(this.effectiveWidth());
}
return this.i_description;
}
UniversalFormInput.prototype.width=function(width) {
if (width!=undefined) {
if (width < 0) {
width=0;
}
this.i_width=width;
if(this.parent()) {
this.parent().width(this.parent().width());	
}
}
return this.i_width;
}
UniversalFormInput.prototype.height=function(height) {
if (height!=undefined) {
if (this.staticMode()) {
this.i_static_height=height;
}
else {
this.i_height=height;
}
this.effectiveWidth(this.effectiveWidth());
}
return (this.staticMode() ? this.i_static_height : this.i_height);
}
UniversalFormInput.prototype.inputWidth=function() {
return this.i_inp_width;
}
UniversalFormInput.prototype.preferredInputWidth=function(width) {
if(width!=undefined) {
this.i_preferred_input_width=width;
}
return this.i_preferred_input_width;
}
UniversalFormInput.prototype.inputHeight=function() {
return this.height();
}
UniversalFormInput.prototype.effectiveWidth=function(width) {
if (width!=undefined) {
if (width <=0) {
width=1;
}
this.i_eff_width=width;
if (this.i_input!=undefined) {
this.i_input.style.width=width+"px";
var marker_width=(this.required() || this.invalidData()) ? 15 : 0;
var label_width=0;
if(this.isStaticWidthLabel()) {
label_width=this.parentForm().labelWidth();
} else if(this.displayName()) {
var label_dimensions=TextDimension(this.displayName(), "UniversalFormInput_text_adjust");
label_width=label_dimensions.width+marker_width;
} else {
label_width=marker_width;
}
label_width -=UniversalForm.leftPadding;
if(label_width < 0) {
label_width=0;
}
var label_dimensions=TextDimension(this.displayName(), "UniversalFormInput_text_adjust", label_width);
var label_height=label_dimensions.height;
this.i_input_label.style.width=label_width+"px";
this.i_inp_width=width - label_width - UniversalForm.leftPadding;
if (this.i_inp_width < 0) {
this.i_inp_width=0;
}
this.i_input_object.style.width=this.i_inp_width+"px";
this.i_input_object.style.height=this.height()+"px";
var last_input=this.parent().inputs()[this.parent().inputs().length - 1];
if(this!=last_input) {
this.i_inp_width -=UniversalForm.columnPadding;
}
if(this.preferredInputWidth() < this.i_inp_width) {
this.i_inp_width=this.preferredInputWidth();
}
if (this.i_inp_width < 0) {
this.i_inp_width=0;
}
var description_height=0;
if(this.description()) {
if(!this.staticMode() && this.i_input_description) {
var description_dimensions=TextDimension(this.description(), "UniversalFormInput_description_adjust", this.i_inp_width);
description_height=description_dimensions.height;
}
if(this.i_input_description) {
this.i_input_description.style.display="";
this.i_input_description.style.width=this.i_inp_width+"px";
this.i_input_description.style.height=description_height+"px";
}
} else {
if(this.i_input_description) {
this.i_input_description.style.display="none";
}
}
var prev_eff_height=this.i_eff_height;
this.i_eff_height=description_height+this.height();
if(this.i_eff_height < label_height) {
this.i_eff_height=label_height;
}
if(this.i_eff_height!=prev_eff_height && this.parent() && !this.i_static_trans) {
this.parent().updateHeight();
}
this.i_input_label.style.height=this.i_eff_height+"px";
this.i_input.style.height=this.i_eff_height+"px";
this.getStaticInput().style.height=this.i_eff_height+"px";
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.input=this;
this.onresize(o);
}
}
return this.i_eff_width;
}
UniversalFormInput.prototype.effectiveHeight=function() {
return this.i_eff_height;
}
UniversalFormInput.prototype.handleMouseOver=function(e) {
this.i_input_asterix.className="UniversalFormInput_required_hover";
}
UniversalFormInput.prototype.handleMouseOut=function(e) {
if (this.invalidData()!=true) {
this.i_input_asterix.className="UniversalFormInput_required";
}
}
UniversalFormInput.prototype.reset=function() {
this.value(this.i_modified_value);
}
UniversalFormInput.prototype.clearModified=function() {
this.i_modified_value=this.value();
}
UniversalFormInput.prototype.isModified=function() {
var v=this.value();
var m=false;
if (this.i_modified_value==undefined || this.i_modified_value=="") {
if (v!=undefined && v!="") {
m=true;
}
}
else {
if (v==undefined || v=="") {
m=true;
}
else {
if (v.splice!=undefined) {
if (this.i_modified_value.splice==undefined) {
m=true;
}
else {
if (v.length!=this.i_modified_value.length) {
m=true;
}
else {
var m=false;
for (var x=0; x < this.i_modified_value.length; x++) {
if (v[x]!=this.i_modified_value[x]) {
m=true;
}
}
}
}
}
else {
if (this.i_modified_value.splice!=undefined) {
m=true;
}
else {
if (this.i_modified_value==v) {
m=false;
}
else {
m=true;
}
}
}			
}
}
return m;
}
UniversalFormInput.prototype.handleValueChange=function(e) {
if (this.i_static_label!=undefined) {
var v, av;
if (this.translatedValue!=undefined) {
v=this.translatedValue();
}
av=this.value();
if (v==undefined) {
v=av;
}
if (this.ontranslate!=undefined) {
var o=new Object();
o.type="translate";
o.actualValue=av;
o.value=v;
this.ontranslate(o);
if (o.value!=v) {
v=o.value;
}
}
if (v==undefined) {
v="&nbsp;";
}
v=v.replace(RegExp("<", "g"), "&lt;");
v=v.replace(RegExp(">", "g"), "&gt;");
var broken_v=v.replace(RegExp("\n", "g"), "&nbsp;<br>");
this.i_static_label.innerHTML=broken_v;
var t=TextDimension(broken_v, "UniversalFormInput_static_label_adjust", this.inputWidth());
if(t.width > this.inputWidth()) {
broken_v=wrapLongWords(broken_v, this.inputWidth(), "UniversalFormInput_static_label_adjust");
this.i_static_label.innerHTML=broken_v;
}
if (t.height < 18) {
t.height=18;
}
if (this.staticMode()==true) {
this.height(t.height);
}
else {
this.i_static_height=t.height;
}
}
}
UniversalFormInput.prototype.getStaticInput=function() {
if (this.i_static_label==undefined) {
this.i_static_label=document.createElement('DIV');
this.i_static_label.className="UniversalFormInput_static_label";
this.i_static_label.style.height=this.height()+"px";
this.handleValueChange({'type':'change'});
}
return this.i_static_label;
}
UniversalFormInput.prototype.getInput=function() {
if (this.i_input==undefined) {
this.i_input=document.createElement('DIV');
this.i_input.className="UniversalFormInput";
this.i_input.className+=(this.invalidData()) ? " UniversalFormInput_invalid" : "";
this.i_input.style.width=this.effectiveWidth()+"px";
EventHandler.register(this.i_input, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_input, "onmouseout", this.handleMouseOut, this);
this.i_input_label=document.createElement('DIV');
this.i_input_label.className="UniversalFormInput_label";
this.i_input_label.appendChild(this.labelTextObject());
this.i_input_label.appendChild(this.staticLabelTextObject());
if(this.staticMode()==true) {
this.labelTextObject().style.display="none";
} else {
this.staticLabelTextObject().style.display="none";
}
this.i_input_asterix=document.createElement('DIV');
this.i_input_asterix.className="UniversalFormInput_required"+(this.invalidData() ? "_hover" : "");
this.i_input_asterix.innerHTML="&nbsp;*";
this.i_input_asterix.style.display="none";
this.i_input_label.appendChild(this.i_input_asterix);
this.i_input.appendChild(this.i_input_label);
this.i_input_object=document.createElement('DIV');
this.i_input_object.className="UniversalFormInput_object";
this.i_input.appendChild(this.i_input_object);
this.i_input_object.appendChild(this.inputObject());
if (this.staticMode()==true) {
this.i_input_object.appendChild(this.getStaticInput());
this.inputObject().style.display="none";	
}
this.i_input_description=document.createElement('DIV');
this.i_input_description.className="UniversalFormInput_description";
this.i_input_description.innerHTML=this.description();
this.i_input.appendChild(this.i_input_description);
this.effectiveWidth(this.effectiveWidth());
}
return this.i_input;
}
UniversalFormInput.prototype.translatedValue=null;
UniversalFormInput.prototype.value=null;
UniversalFormInput.prototype.inputObject=null;
UniversalFormInput.prototype.labelTextObject=function() {
if(this.i_input_text==undefined) {
this.i_input_text=document.createElement('DIV');
var label_text=this.displayName();
var td_label=TextDimension(label_text, "UniversalLabelInput_adjust", (this.i_eff_width - UniversalForm.leftPadding));
this.i_input_text.className="UniversalFormInput_text";
this.i_input_text.style.display=(label_text=="" ? "none" : "");
this.i_input_text.innerHTML=label_text;
}
return this.i_input_text;
}
UniversalFormInput.prototype.staticLabelTextObject=function() {
if(this.i_input_static_text==undefined) {
this.i_input_static_text=document.createElement('DIV');
this.i_input_static_text.className="UniversalFormInput_no_height";
this.i_input_static_text.innerHTML=this.displayName();
}
return this.i_input_static_text;
}
function UniversalTextInput(name, description, width, height, value, masked) {
this.i_masked=(masked!=undefined ? masked : false);
this.i_value=value;
this.i_enabled=true;
this.superConstructor("text", name, description, width, (height < 22 ? 22 : height));
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalTextInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
}
}
UniversalTextInput.prototype.masked=function(state) {
if (state!=undefined) {
this.i_masked=state;
if (this.i_object!=undefined) {
this.i_object.type=(state ? "password" : "text");
}
}
return this.i_masked;
}
UniversalTextInput.prototype.enabled=function(state) {
if (state!=undefined) {
this.i_enabled=state;
if (this.i_object!=undefined) {
this.i_object.disabled=!this.i_enabled;
}	
}
return this.i_enabled;
}
UniversalTextInput.prototype.handleDataChange=function(e) {
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
UniversalTextInput.prototype.inputObject=function() {
if (this.i_object==undefined) {
this.i_object=document.createElement('INPUT');
this.i_object.type=(this.masked() ? "password" : "text");
this.i_object.className="UniversalTextInput";
this.i_object.style.paddingTop=UniversalForm.textInputPaddingTop();
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
this.i_object.value=(this.i_value!=undefined ? this.i_value : "");
this.i_object.disabled=!this.i_enabled;
EventHandler.register(this.i_object, "onchange", this.handleDataChange, this);
EventHandler.register(this.i_object, "onfocus", this.handleFocus, this);
}	
return this.i_object;
}
UniversalTextInput.prototype.handleFocus=function(e) {
if(this.onfocus!=undefined) {
var o={
type: "focus"
}
this.onfocus(o);
}
}
UniversalTextInput.prototype.value=function(value, no_update) {
if (value!=undefined) {
this.i_value=value;
if (this.i_object!=undefined) {
this.i_object.value=value;
}
if (this.onchange!=undefined && no_update!=true) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
return (this.i_object==undefined ? this.i_value : this.i_object.value) || "";
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalTextInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalTextInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalBlankInput(height) {
this.superConstructor("blank","", "", "100%", height);
}
UniversalBlankInput.prototype.inputObject=function() {
if(this.i_object==undefined) {
this.i_object=document.createElement('div');
}
return this.i_object;
}
UniversalBlankInput.prototype.value=function(val) {
return "";
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalBlankInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalBlankInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalLabelInput(name, description, width, text, value, align) {
this.i_text=text;
this.i_value=value;
this.i_align=align;
this.superConstructor("label", name, description, width, 16);
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalLabelInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
if (this.i_last_width!=this.inputWidth()) {
var td=TextDimension(this.text(), "UniversalLabelInput_adjust", this.inputWidth());
if (td.height < 16) {
td.height=16;
}
if (this.height()!=td.height) {
this.height(td.height);
}
this.i_last_width=this.inputWidth();
}
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
}
}
UniversalLabelInput.prototype.text=function(text) {
if (text!=undefined) {
this.i_text=text;
var td=new TextDimension(text, "UniversalLabelInput_adjust", this.inputWidth());
if (td.height < 16) {
td.height=16;
}
if (this.height()!=td.height) {
this.height(td.height);
}
if (this.i_object!=undefined) {
this.i_object.innerHTML=text;
}
}
return this.i_text;
}
UniversalLabelInput.prototype.inputObject=function() {
if (this.i_object==undefined) {
this.i_object=document.createElement('DIV');
this.i_object.className="UniversalLabelInput";
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
if(this.i_align) {
this.i_object.style.textAlign=this.i_align;
}
this.i_object.innerHTML=this.i_text;
}	
return this.i_object;
}
UniversalLabelInput.prototype.value=function(value, no_update) {
if (value!=undefined) {
this.i_value=value;
if (this.onchange!=undefined && no_update!=true) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
return this.i_value;
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalLabelInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalLabelInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalDateInput(name, description, width, height, date, time) {
this.i_date=(date!=undefined ? date : new Date());
this.i_time=(time!=undefined ? time : false);
this.i_disabled=false;
this.superConstructor("date", name, description, width, height);
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalDateInput.prototype.disabled=function(disable) {
if (disable!=undefined) {
var ieFilter;
var mozOpacity;
if (disable==true) {
this.i_disabled=true;
ieFilter="alpha(opacity=50)";
mozOpacity=0.5;
} else {
this.i_disabled=false;
ieFilter="";
mozOpacity="";
}
this.i_inp_date.disabled=this.i_disabled;
if (document.all) {
this.i_selec.style.filter=ieFilter;
} else {
this.i_selec.style.MozOpacity=mozOpacity;
this.i_selec.style.opacity=mozOpacity;
this.i_selec.style.KhtmlOpacity=mozOpacity;
}			
}
return this.i_disabled;
}
UniversalDateInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
if (this.inputWidth() < 20) {
this.i_inp_date.style.display="none";
if(this.time()) {
this.i_inp_time.style.display="none";
}
} else {
this.i_inp_date.style.display="";
if(this.time()) {
this.i_inp_time.style.display="";
this.i_inp_date.style.width=((this.inputWidth() - 31) / 2)+"px";
this.i_inp_time.style.width=((this.inputWidth() - 31) / 2)+"px";
} else {
this.i_inp_date.style.width=(this.inputWidth() - 21)+"px";
}
}
}
}
UniversalDateInput.prototype.handleMonthChange=function(e) {
if (e.direction!=undefined && (e.direction==-1 || e.direction==1)) {
this.i_mini_cal.clearHighlight();
var cal_month=this.i_mini_cal.activeMonth();
var cal_year=this.i_mini_cal.activeYear();
cal_month+=e.direction
switch(cal_month) {
case -1:
cal_month=11;
--cal_year;
break;
case 12:
cal_month=0;++cal_year;
break;
}   
this.i_mini_cal.setMonthYear(cal_month, cal_year);	
}
}
UniversalDateInput.prototype.handleDateSelectDay=function(e) {
this.i_date.setMonth(e.date_clicked.getMonth(), e.date_clicked.getDate());
this.i_date.setFullYear(e.date_clicked.getFullYear());
this.i_mini_cal.close();
this.handleClose();
this.updateDate();
}
UniversalDateInput.prototype.handleClick=function(e) {
var cal_win=this.i_mini_cal.getWindow();
var x=e.clientX;
var y=e.clientY;
if (x < cal_win.i_float_left || x > cal_win.i_float_left+cal_win.i_effective_width || 
y < cal_win.i_float_top || y > cal_win.i_float_top+cal_win.i_effective_height) {
this.i_mini_cal.close();
this.handleClose();
}
}
UniversalDateInput.prototype.handleClose=function(e) {
this.i_ds_c.unregister();
this.i_ds_l.unregister();
this.i_ds_m.unregister();
this.i_ds_w.unregister();
this.i_min_cal_ev_clear=true;
}
UniversalDateInput.prototype.handleDateSelect=function(e) {
if (this.disabled()!=true) {
if (this.i_mini_cal==undefined) {
this.i_mini_cal=new MiniCalendarSelector(150, 150);
this.i_min_cal_ev_clear=false;
}
else if (!this.i_min_cal_ev_clear) {
this.handleClose();
}
var dx=createDateFromStrings(this.i_inp_date.value, "12:00am");
if (dx!=undefined) {
this.i_mini_cal.setMonthYear(dx.getMonth(), dx.getFullYear());
this.i_mini_cal.date(dx)
}
else {
this.i_mini_cal.date(new Date());
}
this.i_mini_cal.close();
this.i_mini_cal.markerVisible(true);   
this.i_mini_cal.open();
this.i_ds_c=EventHandler.register(this.i_mini_cal.getWindow(), "onclose", this.handleClose, this);
this.i_ds_l=EventHandler.register(this.i_mini_cal, "onclickday", this.handleDateSelectDay, this);
this.i_ds_m=EventHandler.register(this.i_mini_cal, "onmonthchange", this.handleMonthChange, this);
this.i_ds_w=EventHandler.register(document.body, "onmousedown", this.handleClick, this);
if (this.i_min_cal_ev_clear) {
this.i_min_cal_ev_clear=false;
}
}
}
UniversalDateInput.prototype.inputObject=function() {
if (this.i_object==undefined) {
var object_table=new BasicTable(1, 3);
var cells=object_table.getCells(0);
this.i_object=document.createElement('DIV');
this.i_object.className="UniversalDateInput";
this.i_object.style.width=this.inputWidth()+"px";
this.i_object.style.height=this.inputHeight()+"px";
this.i_inp_date=document.createElement('INPUT');
this.i_inp_date.type="text";
this.i_inp_date.className="UniversalTextInput UniversalDateInput_input";
this.i_inp_date.style.paddingTop=UniversalForm.textInputPaddingTop();
this.i_inp_date.style.height=this.inputHeight()+"px";
this.i_inp_date.value=this.value().toString();
cells[0].appendChild(this.i_inp_date);
EventHandler.register(this.i_inp_date, "onchange", this.handleInputOnChange, this);
EventHandler.register(this.i_inp_date, "onblur", this.handleInputOnChange, this);
EventHandler.register(this.i_inp_date, "onfocus", this.handleInputOnFocus, this);
this.i_selec=document.createElement('DIV');
this.i_selec.className="UniversalDateInput_selector";
this.i_selec.innerHTML="&nbsp;";
EventHandler.register(this.i_selec, "onclick", this.handleDateSelect, this);
cells[1].appendChild(this.i_selec);
if(this.time()) {
this.i_inp_time=document.createElement('INPUT');
this.i_inp_time.type="text";
this.i_inp_time.className="UniversalTextInput UniversalDateInput_input";
this.i_inp_time.style.paddingTop=UniversalForm.textInputPaddingTop();
this.i_inp_time.style.height=this.inputHeight()+"px";
this.i_inp_time.value=this.value().toString();
this.i_selec.style.marginRight="10px";
this.i_inp_date.style.width=((this.inputWidth() - 31) / 2)+"px";
this.i_inp_time.style.width=((this.inputWidth() - 31) / 2)+"px";
cells[2].appendChild(this.i_inp_time);
EventHandler.register(this.i_inp_time, "onchange", this.handleInputOnChange, this);
EventHandler.register(this.i_inp_time, "onblur", this.handleInputOnChange, this);
} else {
cells[2].style.display="none";
this.i_inp_date.style.width=(this.inputWidth() - 21)+"px";
}
this.i_object.appendChild(object_table.getContent());
this.updateDate();
}	
return this.i_object;
}
UniversalDateInput.prototype.time=function(state, no_update) {
if (state!=undefined) {
if(this.i_time!=state) {
this.i_inp_time.style.display=(state ? "" : "none");
this.i_time=state;
this.handleInputResize();
}
this.i_time=state;
this.updateDate(no_update);
}
return this.i_time;
}
UniversalDateInput.prototype.updateDate=function(no_update) {
if (this.i_inp_date!=undefined) {
var wday=this.value().getDay();
var day=this.value().getDate();
var month=this.value().getMonth();
var year=this.value().getFullYear();
var weekNames=Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
var monthNames=Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
if(isNaN(year)) {
this.i_inp_date.value="";
this.i_inp_time.value="";
}else{
this.i_inp_date.value=getNumericDateString(this.i_date);
if(this.time()) {
this.i_inp_time.value=getTimeString(this.i_date);
}
}
if (this.onchange!=undefined && no_update!=true) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
}
UniversalDateInput.prototype.clearModified=function() {
this.i_modified_value=new Date(this.value().valueOf());
}
UniversalDateInput.prototype.isModified=function() {
var v=this.value();
var m=false;
if (this.i_modified_value==undefined || this.i_modified_value=="") {
if (v!=undefined && v!="") {
m=true;
}
}
else {
if (v==undefined || v=="") {
m=true;
}
else {
if (this.time()==true) {
if (v.getTime()!=this.i_modified_value.getTime()) {
m=true;
}
else {
m=false;
}
}
else {
if (v.getMonth()==this.i_modified_value.getMonth() && v.getDate()==this.i_modified_value.getDate() && v.getFullYear()==this.i_modified_value.getFullYear()) {
m=false;
}
else {
m=true;
}
}
}
}
return m;
}
UniversalDateInput.prototype.value=function(date, no_update) {
if (date!=undefined) {
var d=date;
if(d.getTime===undefined) {
var d=new Date();
d.setTime(Date.parse(date));
}
this.i_date=d;
this.updateDate(no_update);	
}
return this.i_date;
}
UniversalDateInput.prototype.translatedValue=function() {
var v=this.value();
var v_str=getNumericDateString(this.i_date);
if (this.time()) {
v_str+=" "+getTimeString(this.i_date);
}
return v_str;
}
UniversalDateInput.prototype.handleInputOnFocus=function(e) {
if (this.ondatefocus!=undefined) {
this.ondatefocus({type:'datefocus'});
}
}
UniversalDateInput.prototype.handleInputOnChange=function(e) {
var oldtime=(this.time() ? this.i_inp_time.value : "12:00am");
var d=createDateFromStrings(this.i_inp_date.value, oldtime);
if (d==undefined || d==null) {
DialogManager.alert("The date you entered is not valid, please update this field to include a valid date.", "Invalid Date");
var today=new Date(), todaydateString=(today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
var newDate=createDateFromStrings(this.i_inp_date.value, "12:00am");
if (newDate==undefined || newDate==null) { 
newDate=createDateFromStrings(todaydateString,oldtime);
if (newDate==undefined || newDate==null) {
newDate=createDateFromStrings(todaydateString, "12:00am") 
}
}
this.value(newDate);
}
else {
this.value(d);
}
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalDateInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalDateInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalTextAreaInput(name, description, width, height, value) {
this.i_value=value;
this.superConstructor("textarea", name, description, width, height);
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalTextAreaInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
}
}
UniversalTextAreaInput.prototype.handleDataChange=function(e) {
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
UniversalTextAreaInput.prototype.inputObject=function() {
if (this.i_object==undefined) {
this.i_object=document.createElement('TEXTAREA');
this.i_object.className="UniversalTextAreaInput";
this.i_object.style.paddingTop=UniversalForm.textInputPaddingTop();
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
this.i_object.value=(this.i_value==undefined ? "" : this.i_value);
EventHandler.register(this.i_object, "onchange", this.handleDataChange, this);
EventHandler.register(this.i_object, "onblur", this.handleBlur, this);
EventHandler.register(this.i_object, "onfocus", this.handleFocus, this);
}	
return this.i_object;
}
UniversalTextAreaInput.prototype.handleBlur=function(e) {
if(this.onblur!=undefined) {
var o={
type: "blur"
}
this.onblur(o);
}
}
UniversalTextAreaInput.prototype.handleFocus=function(e) {
if(this.onfocus!=undefined) {
var o={
type: "focus"
}
this.onfocus(o);
}
}
UniversalTextAreaInput.prototype.value=function(value, no_update) {
if (value!=undefined) {
this.i_value=value;
if (this.i_object!=undefined) {
this.i_object.value=value;
}
if (this.onchange!=undefined && no_update!=true) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
return (this.i_object==undefined ? this.i_value : this.i_object.value);
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalTextAreaInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalTextAreaInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalCheckBoxInput(name, description, width, ops) {
this.superConstructorB("checkbox", name, description, width, ops);
}
UniversalCheckBoxInput.prototype.superConstructorB=function(type, name, description, width, ops) {
if (ops!=undefined && ops.splice==undefined) {
var q=ops;
ops=Array();
ops[0]=q;
}
this.i_options=(ops==undefined ? Array() : ops);
for (var x=0; x < this.i_options.length; x++) {
this.i_options[x].i_parent=this;
}
this.i_columns=1;
this.superConstructor(type, name, description, width, 20);
EventHandler.register(this, "onresize", this.handleInputResize, this);
this.updateHeight();
}
UniversalCheckBoxInput.prototype.fireOnChange=function() {
if (this.onchange!=undefined && this.i_no_update!=true) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
UniversalCheckBoxInput.prototype.handleInputResize=function(e) {
if (this.i_old_width!=this.inputWidth()) {
this.updateDimensions();
if (this.i_object!=undefined) {
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
}
this.i_old_width=this.inputWidth();
}
}
UniversalCheckBoxInput.prototype.columns=function(columns) {
if(columns!=undefined) {
this.i_columns=columns;
this.i_rows=undefined;
}
return this.i_columns;
}
UniversalCheckBoxInput.prototype.rows=function() {
if(this.i_rows==undefined) {
this.i_rows=Math.ceil(this.i_options.length / this.columns());
}
return this.i_rows;
}
UniversalCheckBoxInput.prototype.columnWidth=function(column) {
var width=0;
for(var i=0; i < this.rows(); i++) {
var index=i+column * this.rows();
if(this.i_options[index]) {
if(this.i_options[index].contentWidth() > width) {
width=this.i_options[index].contentWidth();
}
} else {
break;
}
}
if(column!=this.columns() - 1) {
width+=10;
}
return width;
}
UniversalCheckBoxInput.prototype.rowHeight=function(row) {
var height=0;
for(var i=0; i < this.columns(); i++) {
var index=i+row * this.columns();
if(this.i_options[index]) {
if(this.i_options[index].height() > height) {
height=this.i_options[index].height();
}
} else {
break;
}
}
return height;
}
UniversalCheckBoxInput.prototype.inputObject=function() {
if (this.i_object==undefined) {
this.i_object=document.createElement('DIV');
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
this.regenerateInputs();
}	
return this.i_object;
}
UniversalCheckBoxInput.prototype.regenerateInputs=function() {
if(this.i_object) {
while(this.i_object.firstChild) {
this.i_object.removeChild(this.i_object.firstChild);
}
for(var i=0; i < this.rows(); i++) {
var row=document.createElement("div");
row.className="UniversalCheckBoxInput_row";
for(var j=0; j < this.columns(); j++) {
var index=i+j * this.rows();
if(this.i_options[index]) {
row.appendChild(this.i_options[index].getOption());
} else {
break;
}
}
this.i_object.appendChild(row);
}
}
return this.i_object;
}
UniversalCheckBoxInput.prototype.options=function(index) {
if (index!=undefined) {
return this.i_options[index];
}
return this.i_options;
}
UniversalCheckBoxInput.prototype.updateDimensions=function() {
for(var i=0; i < this.columns(); i++) {
var column_width=this.columnWidth(i);
for(var j=0; j < this.rows(); j++) {
var index=i * this.rows()+j;
if(this.i_options[index]) {
this.i_options[index].width(column_width);
} else {
break;
}
}
}
this.updateHeight();
}
UniversalCheckBoxInput.prototype.updateHeight=function() {
var overall_height=0;
for(i=0; i < this.rows(); i++) {
overall_height+=this.rowHeight(i);
}
if(this.height()!=overall_height) {
this.height(overall_height);
}
}
UniversalCheckBoxInput.prototype.addOption=function(option, beforeOption) {
for(var i=0; i < this.i_options.length; i++) {
if(this.i_options[i]==option) {
return option;
}
}
var append=true;
option.i_parent=this;
if (beforeOption!=undefined) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==beforeOption) {
this.i_options.splice(x, 0, option);
append=false;
break;
}
}
}
if (append) {
this.i_options[this.i_options.length]=option;
}
this.i_rows=undefined;
this.updateDimensions();
this.regenerateInputs();
return option;
}
UniversalCheckBoxInput.prototype.removeOption=function(option) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==option) {
this.i_options.splice(x, 1);
option.i_parent=null;
this.updateDimensions();
this.regenerateInputs();
return true;
}
}
return false;
}
UniversalCheckBoxInput.prototype.value=function(value, no_update) {
var checked=[];
this.i_no_update=no_update;
for(var i=0; i < this.i_options.length; i++) {
var option=this.i_options[i];
if(value) {
option.checked(false);
for(var j=0; j < value.length; j++) {
if(option.value()==value[j]) {
option.checked(true);
}
}
}
if(option.checked()) {
checked.push(option.value());
}
}
this.i_no_update=false;
if (value!=undefined && no_update!=true) {
this.fireOnChange();
}
return checked;
}
UniversalCheckBoxInput.prototype.translatedValue=function() {
var str="";
for(var i=0; i < this.i_options.length; i++) {
var option=this.i_options[i];
if(option.checked()) {
str+=(str!="" ? "<br>" : "")+option.name();
}
}
return str;
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalCheckBoxInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalCheckBoxInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalCheckBoxOption(name, value, checked, enabled) {
this.superConstructor(name, value, checked, enabled);
}
UniversalCheckBoxOption.prototype.superConstructor=function(name, value, checked, enabled) {
this.i_value=value;
this.i_checked=(checked==undefined ? false : checked);
this.i_enabled=(enabled==undefined ? true : enabled);
this.i_height=UniversalCheckBoxOption.minimumHeight;
this.i_width=100;
this.name(name);
}
UniversalCheckBoxOption.minimumHeight=22;
UniversalCheckBoxOption.prototype.parent=function() {
return this.i_parent;
}
UniversalCheckBoxOption.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
var td=TextDimension(name, "UniversalOption_label_adjust", this.width());
this.i_height=(td.height < UniversalCheckBoxOption.minimumHeight ? UniversalCheckBoxOption.minimumHeight : td.height);
if (this.i_option!=undefined) {
this.i_option_desc.innerHTML=name;
this.i_option.style.height=this.height()+"px";
this.i_option_desc.style.height=(this.height())+"px";
}
if (this.parent()!=undefined) {
this.parent().updateHeight();
}
}	
return this.i_name;
}
UniversalCheckBoxOption.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
}
return this.i_value;
}
UniversalCheckBoxOption.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
var td=TextDimension(this.name(), "UniversalCheckBoxOption_label_adjust", this.width());
this.i_height=(td.height < UniversalCheckBoxOption.minimumHeight ? UniversalCheckBoxOption.minimumHeight : td.height);
if (this.i_option!=undefined) {
this.i_option.style.height=this.height()+"px";
this.i_option_desc.style.height=(this.height())+"px";
this.i_option.style.width=this.width()+"px";
this.i_option_desc.style.width=(this.width() > 25 ? (this.width() - 25) : 0)+"px";
}
if (this.parent()!=undefined) {
this.parent().updateHeight();
}
}
return this.i_width;
}
UniversalCheckBoxOption.prototype.height=function() {
return this.i_height;
}
UniversalCheckBoxOption.prototype.contentWidth=function() {
if(this.i_content_width==undefined) {
var dimensions=TextDimension(this.name(), "UniversalCheckBoxOption_label_adjust");
this.i_content_width=dimensions.width+25;
}
return this.i_content_width;
}
UniversalCheckBoxOption.prototype.checked=function(state) {
if (state!=undefined) {
this.i_checked=(!state || state=="0" || state=="false") ? false : true;
if (this.i_option_check!=undefined) {
this.i_option_check.defaultChecked=this.i_checked;
this.i_option_check.checked=this.i_checked;
}
}
return this.i_checked;
}
UniversalCheckBoxOption.prototype.enabled=function(state) {
if (state!=undefined) {
this.i_enabled=state;
if (this.i_option!=undefined) {
this.i_option_check.enabled=state;
}	
}
return this.i_enabled;
}
UniversalCheckBoxOption.prototype.handleChange=function(e) {
this.checked(this.i_option_check.checked==true ? true : false);
this.parent().fireOnChange();
}
UniversalCheckBoxOption.prototype.getOption=function() {
if (this.i_option==undefined) {
this.i_option=document.createElement('DIV');
this.i_option.className="UniversalCheckBoxOption";
this.i_option.style.width=this.width()+"px";
this.i_option.style.height=this.height()+"px";
this.i_option_check=document.createElement('INPUT');
this.i_option_check.type="checkbox";
this.i_option_check.className="UniversalCheckBoxOption_check";
this.i_option_check.style.marginTop=((document.all) ? 1 : 5)+"px";
this.i_option_check.checked=this.checked();
this.i_option_check.defaultChecked=this.checked();
this.i_option.appendChild(this.i_option_check);
EventHandler.register(this.i_option_check, "onclick", this.handleChange, this);
this.i_option_desc=document.createElement('DIV');
this.i_option_desc.className="UniversalCheckBoxOption_label";
this.i_option_desc.innerHTML=this.name();
this.i_option_desc.style.width=(this.width() - 25)+"px";
this.i_option_desc.style.height=(this.height())+"px";
this.i_option.appendChild(this.i_option_desc);
}
return this.i_option;
}
function UniversalRadioInput(name, description, width, ops, radioGroup) {
this.radioGroup((radioGroup=="" || radioGroup==undefined) ? "rand."+Math.floor(Math.random() * 99999999) : radioGroup);
this.superConstructorB("radio", name, description, width, ops);
}
UniversalRadioInput.prototype.fireOnChange=function() {
if (this.onchange!=undefined && this.i_no_update!=true) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
UniversalRadioInput.prototype.radioGroup=function(name) {
if (name!=undefined) {
this.i_radio_group=name;
if (this.i_options!=undefined) {
for (var x=0; x < this.i_options.length; x++) {
this.i_options[x].updateGroup();
}
}
}
return this.i_radio_group;
}
UniversalRadioInput.prototype.value=function(value, no_update) {
this.i_no_update=no_update;
if (value!=undefined) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].value()==value) {
this.i_options[x].checked(true);
}
else {
this.i_options[x].checked(false);
}
}
this.fireOnChange();
}
this.i_no_update=false;
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].checked()==true) {
return this.i_options[x].value();
}
}
return undefined;
}
UniversalRadioInput.prototype.translatedValue=function() {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].checked()==true) {
return this.i_options[x].name();
}
}
return "";
}
for (var meth in UniversalCheckBoxInput.prototype) {
if (UniversalRadioInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalRadioInput.prototype[meth]=UniversalCheckBoxInput.prototype[meth];
}
}
function UniversalRadioOption(name, value, checked, enabled) {
this.i_radio_created=false;
this.superConstructor(name, value, checked, enabled);
}
UniversalRadioOption.prototype.checked=function(state) {
if (state!=undefined) {
this.i_checked=state;
if (this.i_option_check!=undefined && this.i_option_check!=state) {
this.i_option_check.defaultChecked=state;
this.i_option_check.checked=state;
}
}else{
if(this.i_option_check!=undefined && this.i_radio_created) {
if(this.i_option_check.checked!=this.i_checked) {
this.i_checked=this.i_option_check.checked;
this.parent().fireOnChange();
}
}
}
return this.i_checked;
}
UniversalRadioOption.prototype.updateGroup=function() {
if (this.i_option_check!=undefined) {
this.i_option_check.name=this.parent().radioGroup();
}
}
UniversalRadioOption.prototype.handleChange=function(e) {
for (var x=0; x < this.i_parent.i_options.length; x++) {
if (this!=this.i_parent.i_options[x]) {
this.i_parent.i_options[x].checked(false);
}
}
this.checked(this.i_option_check.checked==true ? true : false);
this.parent().fireOnChange();
}
UniversalRadioOption.prototype.getOption=function() {
if (this.i_option==undefined) {
this.i_option=document.createElement('DIV');
this.i_option.className="UniversalRadioOption";
this.i_option.style.width=this.width()+"px";
this.i_option.style.height=this.height()+"px";
this.i_option_check;
try {
this.i_option_check=document.createElement('<input type="radio" name="'+this.parent().radioGroup()+'" />');
} catch(e) {
this.i_option_check=document.createElement('INPUT');
this.i_option_check.type="radio";
this.i_option_check.name=this.parent().radioGroup();
}
this.i_option_check.className="UniversalRadioOption_check";
this.i_option_check.style.marginTop=((document.all) ? 1 : 5)+"px";
this.i_option_check.checked=this.checked();
this.i_option_check.defaultChecked=this.checked();
EventHandler.register(this.i_option_check, "onclick", this.handleChange, this);
this.i_option.appendChild(this.i_option_check);
this.i_option_desc=document.createElement('DIV');
this.i_option_desc.className="UniversalRadioOption_label";
this.i_option_desc.innerHTML=this.name();
this.i_option_desc.style.width=(this.width() - 20)+"px";
this.i_option_desc.style.height=(this.height())+"px";
this.i_option.appendChild(this.i_option_desc);
this.i_radio_created=true;
}
return this.i_option;
}
for (var meth in UniversalCheckBoxOption.prototype) {
if (UniversalRadioOption.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalRadioOption.prototype[meth]=UniversalCheckBoxOption.prototype[meth];
}
}
function UniversalButtonInput(button, align, width, name) {
this.i_align=align;
this.i_button=button;
if(button.buttonCSS) {
button.buttonCSS("UniversalButtonInput_normal");
button.hoverCSS("UniversalButtonInput_hover");
}
button.height(22);
this.i_original_name=name;
this.superConstructor("button", (name==undefined ? "" : name), "", width);
EventHandler.register(this, "onresize", this.handleInputResize, this);
EventHandler.register(this, "onstatic", this.handleInputStatic, this);
}
UniversalButtonInput.prototype.handleInputStatic=function(e) {
if(e.static==true) {
this.i_original_name=this.name();
this.name("");
}else{
this.name(this.i_original_name);
}
}
UniversalButtonInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
var alignPad=(this.align()=="left" ? 1 : (this.align()=="right" ?  this.inputWidth() - this.button().width() : Math.floor((this.inputWidth() - (this.parentForm().labelWidth() / 2) - this.button().width()) / 2)));	
this.i_object_padding.style.width=(alignPad > 0 ? alignPad : 0)+"px";
}
}
UniversalButtonInput.prototype.button=function() {
return this.i_button;
}
UniversalButtonInput.prototype.align=function(align) {
if (align!=undefined) {
this.i_align=align;
}
return this.i_align;
}
UniversalButtonInput.prototype.inputObject=function() {
if (this.i_object==undefined) {
this.i_object=document.createElement('DIV');
this.i_object.style.height=this.inputHeight()+"px";
this.i_object.style.width=this.inputWidth()+"px";
this.i_object_padding=document.createElement('DIV');
this.i_object_padding.className="UniversalButtonInput_padding";
this.i_object_padding.style.width=(this.align()=="left" ? 0 : (this.align()=="right" ?  Math.max(0,this.inputWidth() - this.button().width()) : Math.floor(((this.inputWidth()+this.parentForm().labelWidth()) - this.button().width()) / 2)))+"px";
this.i_object_padding.style.display=(this.align()=="left" ? "none" : "");
this.i_object_padding.innerHTML="&nbsp;";
this.i_object.appendChild(this.i_object_padding);
this.i_object_holder=document.createElement('DIV');
this.i_object_holder.style.width=this.button().width()+"px";
this.i_object_holder.className="UniversalButtonInput_holder";
this.i_object.appendChild(this.i_object_holder);
this.i_object_holder.appendChild(this.button().getButton());
}	
return this.i_object;
}
UniversalButtonInput.prototype.value=function() {
return undefined;
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalButtonInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalButtonInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalOptionBoxInput(name, description, ops, multiSelect, width, rows) {
this.i_multiSelect=(multiSelect==undefined ? false : multiSelect);
this.i_options=ops;
this.i_rows=(rows==undefined ? 1 : rows);
this.superConstructor("select", name, description, width, ((rows * 16.4)+4));
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalOptionBoxInput.prototype.rows=function(rows) {
if (rows!=undefined) {
this.i_rows=rows;
this.height((rows * 16.4)+4);
if (this.i_object!=undefined) {
this.i_object.rows(rows);
this.height(parseInt(this.i_object.height()));
}
}
return this.i_rows;
}
UniversalOptionBoxInput.prototype.multiSelect=function(state) {
if (state!=undefined) {
this.i_multiSelect=state;
this.i_object.multiSelect(state);
}
return this.i_multiSelect;
}
UniversalOptionBoxInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
this.i_object.width(this.inputWidth() - 2);
}
}
UniversalOptionBoxInput.prototype.handleChange=function(e) {
for (var x=0; x < this.i_options.length; x++) {
this.i_options[x].selected(this.i_options[x].getOption().selected()==true ? true : false);
}
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
UniversalOptionBoxInput.prototype.inputObject=function() {
if (this.i_object==undefined) {
this.i_object=new OptionBox(this.inputWidth() - 2, this.rows(), this.multiSelect());
EventHandler.register(this.i_object, "onchange", this.handleChange, this);
var selected=false;
for (var x=0; x < this.i_options.length; x++) {
this.i_object.addOption(this.i_options[x].getOption());
if(this.i_options[x].selected()==true) {
selected=true;
}
}
}	
return (this.rows() > 1) ? this.i_object.getOptionDiv() : this.i_object.getContent();
}
UniversalOptionBoxInput.prototype.options=function(index) {
if (index!=undefined) {
return this.i_options[index];
}
return this.i_options;
}
UniversalOptionBoxInput.prototype.addOption=function(op, beforeOp) {
var append=true;
if (beforeOp!=undefined) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==beforeOp) {
this.i_options.splice(x, 0, op);
append=false;
if (this.i_object!=undefined) {
this.i_object.addOption(op.getOption(), beforeOp.getOption());
}
break;
}
}
}
if (append) {
this.i_options[this.i_options.length]=op;
if (this.i_object!=undefined) {
this.i_object.addOption(op.getOption());
}
}
op.i_parent=this;
return op;
}
UniversalOptionBoxInput.prototype.removeOption=function(op) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==op) {
this.i_options.splice(x, 1);
this.i_options[x].i_parent=null;
if (this.i_object!=undefined) {
this.i_object.removeOption(op.getOption());
}
return true;
}
}
return false;
}
UniversalOptionBoxInput.prototype.value=function(value, no_update) {
var res=Array();
if (value!=undefined) {
if (value.splice==undefined) {
var v=value;
value=Array();
value[0]=v;
}
for (var x=0; x < this.i_options.length; x++) {
var fnd=false;
for (var z=0; z < value.length; z++) {
if (this.i_options[x].value()==value[z]) {
fnd=true;
}
}
this.i_options[x].selected(fnd);
}
if (this.onchange!=undefined && no_update!=true) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].selected()==true) {
res[res.length]=this.i_options[x].value();
}
}
return res;
}
UniversalOptionBoxInput.prototype.translatedValue=function() {
var str="";
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x].selected()==true) {
str+=(str!="" ? "<br>" : "")+this.i_options[x].name();
}
}
return str;
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalOptionBoxInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalOptionBoxInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalOptionBoxOption(name, value, selected) {
this.i_name=name;
this.i_value=value;
this.i_selected=selected;
this.i_enabled=true;
}
UniversalOptionBoxOption.prototype.parent=function() {
return this.i_parent;
}
UniversalOptionBoxOption.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;	
if (this.i_option!=undefined) {
this.i_option.name(name);
}
}
return this.i_name;
}
UniversalOptionBoxOption.prototype.value=function(value) {
if (value!=undefined) {
this.i_value=value;
if (this.i_option!=undefined) {
this.i_option.value(value);
}
}
return this.i_value;
}
UniversalOptionBoxOption.prototype.selected=function(state) {
if (state!=undefined) {
this.i_selected=state;
if (this.i_option!=undefined && this.i_option.selected()!=state) {
this.i_option.selected(state);
}
}
if(this.i_option) {
this.i_selected=this.i_option.selected();
}
return this.i_selected;
}
UniversalOptionBoxOption.prototype.enabled=function(enabled) {
if(enabled!=undefined) {
this.i_enabled=enabled;
}
return this.i_enabled;
}
UniversalOptionBoxOption.prototype.getOption=function() {
if (this.i_option==undefined) {
this.i_option=new OptionBoxOption(this.name(), this.value(), this.selected());
this.i_option.pObj=this;
}	
return this.i_option;
}
function UniversalAddRemoveListInput(name, description, ops, width, rows) {
this.i_options=ops || [];
this.i_rows=(rows==undefined) ? 5 : rows;
this.i_hasFocus=false;
this.i_added_options=[];
this.i_removed_options=[];
this.i_bindToSimpleClick=false;
this.superConstructor("add_remove_list", name, description, width, (this.i_rows * 16.4)+29);
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalAddRemoveListInput.prototype.rows=function(rows) {
if (rows!=undefined) {
this.i_rows=rows;
this.height((rows * 16.4)+29);
if (this.i_object!=undefined) {
this.i_list.rows(rows);
this.height(parseInt(this.i_list.height())+29+5);
}
}
return this.i_rows;
}
UniversalAddRemoveListInput.prototype.bindToSimpleClick=function(bind){
if(bind!=undefined){
if(bind==true){
this.i_bindToSimpleClick=true;
if(this.i_hasFocus){
this.registerForSimpleClickNotifications();
}
}else{
this.i_bindToSimpleClick=false;
this.unregisterForSimpleClickNotifications();
}
}
return this.i_bindToSimpleClick;
}
UniversalAddRemoveListInput.prototype.registerForSimpleClickNotifications=function(){
if(this.i_simpleClickListener==undefined){
if(ApplicationOldContacts!=undefined && ApplicationOldContacts.getSimpleClick!=undefined && ApplicationOldContacts.getSimpleClick()!=undefined){
this.i_simpleClickListener=ApplicationOldContacts.getSimpleClick().requestOnBoth(this.handleClickContact,this);
}
}
}
UniversalAddRemoveListInput.prototype.unregisterForSimpleClickNotifications=function(){
if(this.i_simpleClickListener!=undefined){
if(ApplicationOldContacts!=undefined && ApplicationOldContacts.getSimpleClick!=undefined && ApplicationOldContacts.getSimpleClick()!=undefined){
ApplicationOldContacts.getSimpleClick().cancelRequest(this.i_simpleClickListener);
this.i_simpleClickListener=undefined;
}
}
}
UniversalAddRemoveListInput.prototype.handleClickContact=function(type,group,contact){
if(contact!=undefined){
if(this.onclickcontact!=undefined){
var o=new Object();
o.type="clickcontact";
o.value=contact;
o.input=this;
this.onclickcontact(o);
if(o.displayValue!=undefined){
this.addOption(new UniversalOptionBoxOption(o.displayValue,contact.username,false));
}
}
}else if(group!=undefined){
if(this.onclickgroup!=undefined){
var o=new Object();
o.type="clickgroup";
o.value=group;
o.input=this;
this.onclickgroup(o);
if(o.displayValue!=undefined){
this.addOption(new UniversalOptionBoxOption(o.displayValue,group.uuid,false));
}
}
}
}
UniversalAddRemoveListInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
this.i_object.style.width=this.inputWidth()+"px";
this.i_list.width(this.fieldWidth() - 5);
this.i_add.style.width=(this.fieldWidth() - 3)+"px";
this.i_remove_button.minWidth(this.buttonWidth());
this.i_add_button.minWidth(this.buttonWidth());
}
}
UniversalAddRemoveListInput.prototype.handleFocus=function(e) {
if(this.onfocus) {
var o=new Object();
o.type="focus";
o.input=this;
this.onfocus(o);
}
this.i_hasFocus=true;
if(this.bindToSimpleClick()){
this.registerForSimpleClickNotifications();
}
}
UniversalAddRemoveListInput.prototype.handleBlur=function(e){
if(this.onblur!=undefined){
var o=new Object();
o.type="blur";
o.input=this;
this.onblur(o);
}
this.i_hasFocus=false;
if(this.bindToSimpleClick()){
this.unregisterForSimpleClickNotifications();
}
}
UniversalAddRemoveListInput.prototype.handleSelect=function(e) {
var any_selected=false;
var selected_options=[];
for (var x=0; x < this.i_options.length; x++) {
var selected=(this.i_options[x].getOption().selected()==true && this.i_options[x].enabled()) ? true : false
if(selected) {
selected_options.push(this.i_options[x]);
}
this.i_options[x].getOption().selected(selected);
this.i_options[x].selected(selected);
}
var o=new Object();
if(this.onselect) {
o.type="select";
o.input=this;
o.options=this.i_options;
o.selected_options=selected_options;
this.onselect(o);
}
if(selected_options.length > 0 && !o.disallowRemove) {
this.i_remove_button.enabled(true);
} else {
this.i_remove_button.enabled(false);
}
}
UniversalAddRemoveListInput.prototype.handleInput=function(e) {
if(this.i_add.value.length > 0) {
this.i_add_button.enabled(true);
var code=(e.keyCode) ? e.keyCode : e.which;
if(code==13) {
this.handleClickAdd(e);
}
} else {
this.i_add_button.enabled(false);
}
}
UniversalAddRemoveListInput.prototype.handleClickAdd=function(e) {
if(this.i_add.value.length > 0) {
var option;
if(this.onadd) {
var o=new Object();
o.type="add";
o.input=this;
o.add=this.i_add;
o.value=this.i_add.value;
this.onadd(o);
option=o.option;
if(o.cancelAdd) {
return false;
}
}
if(!option) {
option=new UniversalOptionBoxOption(this.i_add.value, this.i_add.value);
}
this.addOption(option);
this.i_added_options.push(option);
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
this.i_add.value="";
this.i_add_button.enabled(false);
}
UniversalAddRemoveListInput.prototype.handleClickRemove=function(e) {
var selected_options=this.selectedOptions();
if(this.onremove) {
var o=new Object();
o.type="remove";
o.input=this;
o.selected_options=selected_options;
this.onremove(o);
if(o.cancelRemove) {
return false;
}
}
for(var i=0; i < selected_options.length; i++) {
var option=selected_options[i];
this.removeOption(option);
var append_removed=true;
for(var j=0; j < this.i_added_options.length; j++) {
if(option.value()==this.i_added_options[j].value()) {
this.i_added_options.splice(j, 1);
append_removed=false;
break;
}
}
if(append_removed) {
this.i_removed_options.push(option);
}
}
this.i_remove_button.enabled(false);
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
this.onchange(o);
}
}
UniversalAddRemoveListInput.prototype.fieldWidth=function() {
var width=this.inputWidth() - this.buttonWidth() - 5;
if(width < 0) {
width=0;
}
return width;
}
UniversalAddRemoveListInput.prototype.buttonWidth=function() {
return 75;
}
UniversalAddRemoveListInput.prototype.inputObject=function() {
if(this.i_object==undefined) {
this.i_object=document.createElement("div");
this.i_object.className="UniversalAddRemoveListInput";
this.i_object.style.width=this.inputWidth()+"px";
var list_container=document.createElement("div");
list_container.className="UniversalAddRemoveListInput_list";
this.i_list=new OptionBox(this.fieldWidth());
EventHandler.register(this.i_list, "onchange", this.handleSelect, this);
EventHandler.register(this.i_list, "onfocus",  this.handleFocus,  this);
EventHandler.register(this.i_list, "onblur",   this.handleBlur,   this);
this.i_remove_button=new UniversalButton("Remove", undefined, undefined, undefined, undefined, 22);
this.i_remove_button.minWidth(this.buttonWidth());
this.i_remove_button.enabled(false);
EventHandler.register(this.i_remove_button, "onclick", this.handleClickRemove, this);
list_container.appendChild(this.i_list.getOptionDiv());
list_container.appendChild(this.i_remove_button.getButton());
var input_container=document.createElement("div");
input_container.className="UniversalAddRemoveListInput_add";
var universal_add=new UniversalTextInput("Add", undefined, this.fieldWidth());
this.i_add=universal_add.inputObject();
EventHandler.register(this.i_add, "onkeyup", this.handleInput, this);
EventHandler.register(this.i_add, "onfocus", this.handleFocus, this);
EventHandler.register(this.i_add, "onblur",  this.handleBlur,  this);
this.i_add_button=new UniversalButton("Add", undefined, undefined, undefined, undefined, 22);
this.i_add_button.minWidth(this.buttonWidth());
this.i_add_button.enabled(false);
EventHandler.register(this.i_add_button, "onclick", this.handleClickAdd, this);
input_container.appendChild(this.i_add);
input_container.appendChild(this.i_add_button.getButton());
this.i_object.appendChild(list_container);
this.i_object.appendChild(input_container);
this.i_list.rows(this.rows());
this.i_list.multiSelect(true);
for(var i=0 ; i < this.i_options.length; i++) {
this.i_list.addOption(this.i_options[i].getOption());
}
this.rows(this.rows());
}	
return this.i_object;
}
UniversalAddRemoveListInput.prototype.options=function(index) {
if (index!=undefined) {
return this.i_options[index];
}
return this.i_options;
}
UniversalAddRemoveListInput.prototype.selectedOptions=function() {
var options=[];
for(var i=0; i < this.i_options.length; i++) {
if(this.i_options[i].selected()) {
options.push(this.i_options[i]);
}
}
return options;
}
UniversalAddRemoveListInput.prototype.addOption=function(op, beforeOp) {
var append=true;
if (beforeOp!=undefined) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==beforeOp) {
this.i_options.splice(x, 0, op);
append=false;
if (this.i_list!=undefined) {
this.i_list.addOption(op.getOption(), beforeOp.getOption());
}
break;
}
}
}
if (append) {
this.i_options[this.i_options.length]=op;
if (this.i_list!=undefined) {
this.i_list.addOption(op.getOption());
}
}
op.i_parent=this;
return op;
}
UniversalAddRemoveListInput.prototype.removeOption=function(op) {
for (var x=0; x < this.i_options.length; x++) {
if (this.i_options[x]==op) {
this.i_options.splice(x, 1);
op.i_parent=null;
if (this.i_list!=undefined) {
this.i_list.removeOption(op.getOption());
}
return true;
}
}
return false;
}
UniversalAddRemoveListInput.prototype.value=function(value) {
if(value) {
for(var i=this.i_options.length; i >=0; i--) {
this.removeOption(this.i_options[i]);
}
for(var i=0; i < value.length; i++) {
this.addOption(value[i]);
}
}
var res=[];
for(var i=0; i < this.i_options.length; i++) {
res.push(this.i_options[i]);
}
return res;
}
UniversalAddRemoveListInput.prototype.optionValues=function() {
var res=[];
for(var i=0; i < this.i_options.length; i++) {
res.push(this.i_options[i].value());
}
return res;
}
UniversalAddRemoveListInput.prototype.translatedValue=function() {
var str="";
for(var i=0; i < this.i_options.length; i++) {
str+=(str!="" ? "<br>" : "")+this.i_options[i].name();
}
return str;
}
UniversalAddRemoveListInput.prototype.clearModified=function() {
this.i_modified_value=this.value();
this.i_added_options=[];
this.i_removed_options=[];
}
UniversalAddRemoveListInput.prototype.addedOptions=function() {
return this.i_added_options;
}
UniversalAddRemoveListInput.prototype.addedOptionValues=function() {
var values=[]
for(var i=0; i < this.i_added_options.length; i++) {
values.push(this.i_added_options[i].value());
}
return values;
}
UniversalAddRemoveListInput.prototype.removedOptions=function() {
return this.i_removed_options;
}
UniversalAddRemoveListInput.prototype.removedOptionValues=function() {
var values=[]
for(var i=0; i < this.i_removed_options.length; i++) {
values.push(this.i_removed_options[i].value());
}
return values;
}
for (var meth in UniversalFormInput.prototype) {
if (UniversalAddRemoveListInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalAddRemoveListInput.prototype[meth]=UniversalFormInput.prototype[meth];
}
}
function UniversalSortedEditListInput(name, description, ops, width, rows) {
this.i_options=ops || [];
this.i_rows=(rows==undefined) ? 5 : rows;
this.superConstructor("sorted_edit_list", name, description, width, (this.i_rows * 16.4)+29);
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalSortedEditListInput.prototype.rows=function(rows) {
if (rows!=undefined) {
this.i_rows=rows;
this.height((rows * 16.4)+29);
if (this.i_object!=undefined) {
this.i_list.rows(rows);
this.height(parseInt(this.i_list.height()+29));
}
}
return this.i_rows;
}
UniversalSortedEditListInput.prototype.handleInputResize=function(e) {
if (this.i_object!=undefined) {
this.i_object.style.width=this.inputWidth()+"px";
this.i_list.width(this.listWidth());
this.i_info_container.style.width=this.infoWidth()+"px";
}
}
UniversalSortedEditListInput.prototype.handleSelect=function(e) {
var any_selected=false;
for (var x=0; x < this.i_options.length; x++) {
var selected=(this.i_options[x].getOption().selected()==true) ? true : false
if(selected) {
any_selected=true;
}
this.i_options[x].selected(selected);
}
if(any_selected) {
this.i_edit_button.enabled(true);
this.i_remove_button.enabled(true);
this.i_up_button.enabled(true);
this.i_down_button.enabled(true);
if(this.onselect) {
var o=new Object();
o.type="select";
o.option=this.selectedOption();
this.onselect(o);
}
} else {
this.i_edit_button.enabled(false);
this.i_remove_button.enabled(false);
this.i_up_button.enabled(false);
this.i_down_button.enabled(false);
}
}
UniversalSortedEditListInput.prototype.handleClickUp=function(e) {
var option=this.selectedOption();
if(option) {
var before_option;
for(var i=0; i < this.i_options.length; i++) {
if(this.i_options[i]==option) {
var before_i=i - 1;
before_option=(before_i < 0) ? undefined : this.i_options[before_i];
break;
}
}
if(before_option) {
this.removeOption(option);
this.addOption(option, before_option);
}
}
}
UniversalSortedEditListInput.prototype.handleClickDown=function(e) {
var option=this.selectedOption();
if(option) {
var before_option;
for(var i=0; i < this.i_options.length; i++) {
if(this.i_options[i]==option) {
var before_i=i+2;
before_option=(before_i > this.i_options.length - 1) ? undefined : this.i_options[before_i];
break;
}
}
this.removeOption(option);
this.addOption(option, before_option);
}
}
UniversalSortedEditListInput.prototype.handleClickAdd=function(e) {
if(this.onadd) {
var o=new Object();
o.type="add";
this.onadd(o);
}
}
UniversalSortedEditListInput.prototype.handleClickEdit=function(e) {
this.i_modified_value=undefined;
if(this.onedit) {
var o=new Object();
o.type="edit";
o.option=this.selectedOption();
this.onedit(o);
}
}
UniversalSortedEditListInput.prototype.listWidth=function() {
var width=this.inputWidth() - this.moveWidth() - 5;
if(width < 0) {
width=0;
}
width=width / 2;
return width;
}
UniversalSortedEditListInput.prototype.moveWidth=function() {
return 35;
}
UniversalSortedEditListInput.prototype.formWidth=function() {
var width=this.inputWidth() - this.listWidth();
if(width < 0) {
width=0;
}
if(width < 195) {
width=195;
}
return width;
}
UniversalSortedEditListInput.prototype.infoWidth=function() {
var width=this.inputWidth() - this.formWidth();
if(width < 0) {
width=0;
}
return width;
}
UniversalSortedEditListInput.prototype.inputObject=function() {
if(this.i_object==undefined) {
this.i_object=document.createElement("div");
this.i_object.className="UniversalSortedEditListInput";
this.i_object.style.width=this.inputWidth()+"px";
var form_container=document.createElement("div");
form_container.className="UniversalSortedEditListInput_form";
var container=document.createElement("div");
container.className="UniversalSortedEditListInput_container";
var list_container=document.createElement("div");
list_container.className="UniversalSortedEditListInput_list";
this.i_list=new OptionBox(this.fieldWidth());
EventHandler.register(this.i_list, "onchange", this.handleSelect, this);
EventHandler.register(this.i_list, "onfocus", this.handleFocus, this);
list_container.appendChild(this.i_list.getOptionDiv());
var move_container=document.createElement("div");
move_container.className="UniversalSortedEditListInput_move";
move_container.style.width=this.moveWidth()+"px";
this.i_up_button=new UniversalButton("", "UniversalSortedEditListInput_move_up", 16, undefined, undefined, 22);
this.i_up_button.enabled(false);
EventHandler.register(this.i_up_button, "onclick", this.handleClickUp, this);
this.i_down_button=new UniversalButton("", "UniversalSortedEditListInput_move_down", 16, undefined, undefined, 22);
this.i_down_button.enabled(false);
EventHandler.register(this.i_down_button, "onclick", this.handleClickDown, this);
move_container.appendChild(this.i_up_button.getButton());
move_container.appendChild(this.i_down_button.getButton());
container.appendChild(list_container);
container.appendChild(move_container);
var actions_container=document.createElement("div");
actions_container.className="UniversalSortedEditListInput_actions";
this.i_add_button=new UniversalButton("Add...", undefined, undefined, undefined, undefined, 22);
this.i_add_button.minWidth(60);
EventHandler.register(this.i_add_button, "onclick", this.handleClickAdd, this);
this.i_edit_button=new UniversalButton("Edit...", undefined, undefined, undefined, undefined, 22);
this.i_edit_button.minWidth(60);
this.i_edit_button.enabled(false);
EventHandler.register(this.i_edit_button, "onclick", this.handleClickEdit, this);
this.i_remove_button=new UniversalButton("Remove", undefined, undefined, undefined, undefined, 22);
this.i_remove_button.minWidth(60);
this.i_remove_button.enabled(false);
EventHandler.register(this.i_remove_button, "onclick", this.handleClickRemove, this);
actions_container.appendChild(this.i_add_button.getButton());
actions_container.appendChild(this.i_edit_button.getButton());
actions_container.appendChild(this.i_remove_button.getButton());
form_container.appendChild(container);
form_container.appendChild(actions_container);
this.i_info_container=document.createElement("div");
this.i_info_container.className="UniversalSortedEditListInput_info";
this.i_object.appendChild(form_container);
this.i_object.appendChild(this.i_info_container);
this.i_list.rows(this.rows());
for(var i=0 ; i < this.i_options.length; i++) {
this.i_list.addOption(this.i_options[i].getOption());
}
this.rows(this.rows());
}	
return this.i_object;
}
UniversalSortedEditListInput.prototype.infoContainer=function() {
return this.i_info_container;
}
UniversalSortedEditListInput.prototype.selectedOption=function() {
var options=this.selectedOptions();
return options[0];
}
for (var meth in UniversalAddRemoveListInput.prototype) {
if (UniversalSortedEditListInput.prototype[meth]==undefined && meth.substr(0, 2)!="i_") {
UniversalSortedEditListInput.prototype[meth]=UniversalAddRemoveListInput.prototype[meth];
}
}
function UniversalTextWrappedInputs() {
}
UniversalTextWrappedInputs.inherit(UniversalFormInput);
function UniversalEmailAddressField(name,description,has_button,collapsible,width,height){
this.i_name=name;
this.i_description=description;
this.i_collapsible=collapsible;
this.i_has_button=has_button;
this.i_width=(width ? width : "100%");
this.height(height ? height : 22);
this.i_field_button=undefined;
this.i_max_field_rows=undefined;
this.i_value=undefined;
this.i_input_height=22;
this.superConstructor("input",this.i_name,this.i_description,this.i_width,this.i_height);
EventHandler.register(this, "onresize", this.handleInputResize, this);
EventHandler.register(this, "onstatic", this.handleStaticChange, this);
}
UniversalEmailAddressField.prototype.onhtchange=null;
UniversalEmailAddressField.prototype.onbuttonclick=null;
UniversalEmailAddressField.prototype.onfieldfocus=null;
UniversalEmailAddressField.prototype.fieldObject=function(){
if(this.i_fieldObject==undefined) {
var button_string=(this.i_has_button ? this.i_name+":" : undefined);
this.i_fieldObject=new EmailAddressField(this.i_name, button_string, this.i_collapsible, this.i_has_button, undefined, "UniversalEmailAddressField_text");
if(this.i_max_field_rows!=undefined) {
this.i_fieldObject.maxRows(this.i_max_field_rows);
}
this.i_fieldObject.getContent();
this.i_fieldObject.width(this.i_width);
EventHandler.register(this.i_fieldObject,"onhtchange",this.handleResize,this);
EventHandler.register(this.i_fieldObject,"onbuttonclick",this.handleButtonClick,this);
EventHandler.register(this.i_fieldObject,"onfieldfocus",this.handleFieldFocus,this);
EventHandler.register(this.i_fieldObject,"onchange",this.handleDataChange, this);
}
return this.i_fieldObject;
}
UniversalEmailAddressField.prototype.inputObject=function(){
if(this.i_inputObject==undefined) {
this.i_inputObject=this.fieldObject().getContent();
this.fieldObject().show();
}
return this.i_inputObject;
}
UniversalEmailAddressField.prototype.labelTextObject=function() {
if(this.i_field_button==undefined) {
if(this.i_has_button) {
var field_object=this.fieldObject();
this.i_field_button=field_object.getButton();
if(document.all) {
this.i_field_button.style.styleFloat="right";
} else {
this.i_field_button.style.cssFloat="right";
}
} else {
this.i_field_button=this.staticLabelTextObject();
}
}
return this.i_field_button;
}
UniversalEmailAddressField.prototype.staticLabelTextObject=function() {
if(this.i_input_text==undefined) {
this.i_input_text=document.createElement('DIV');
this.i_input_text.className="UniversalFormInput_text";
this.i_input_text.innerHTML=(this.name()!="" ? this.name()+":" : "");
}
return this.i_input_text;
}
UniversalEmailAddressField.prototype.maxFieldRows=function(max) {
if(max!=undefined) {
this.i_max_field_rows=max;
if(this.i_fieldObject!=undefined) {
this.i_fieldObject.maxRows(max);
}
}
return this.i_max_field_rows;
}
UniversalEmailAddressField.prototype.width=function(width) {
if(width!=undefined) {
if (this.i_width!=width) {
this.i_width=width;
if(this.i_fieldObject!=undefined) {
this.i_fieldObject.width(width);
}
}
}
return this.i_width;
}
UniversalEmailAddressField.prototype.value=function(value) {
if(value!=undefined && this.i_value!=value) {
this.i_value=value;
if(this.i_fieldObject!=undefined) {
this.i_fieldObject.value(value);
}
this.handleDataChange();
}
return this.i_value;
}
UniversalEmailAddressField.prototype.handleResize=function(e) {
if(!this.staticMode()) {
this.height(parseInt(e.height));
}
if(this.onhtchange!=undefined) {
var o=new Object();
o.type="htchange";
o.oldHeight=e.oldHeight;
o.height=e.height;
this.onhtchange(o);
}
}
UniversalEmailAddressField.prototype.handleButtonClick=function(e) {
this.i_fieldObject.focusInput();
if(this.onbuttonclick!=null) {
var o=new Object();
o.type="buttonclick";
o.input=this;
this.onbuttonclick(o);
}
}
UniversalEmailAddressField.prototype.handleFieldFocus=function(e) {
if(this.onfieldfocus!=null) {
var o=new Object();
o.type="fieldfocus";
o.input=this;
this.onfieldfocus(o);
}
}
UniversalEmailAddressField.prototype.handleDataChange=function(e) {
if(this.i_fieldObject!=undefined) {
this.i_value=this.i_fieldObject.value();
if(!this.staticMode()) {
this.height(this.i_fieldObject.fieldHeight());
}
}
if(this.onchange!=null) {
var o=new Object();
o.type="change";
o.input=this;
this.onchange(o);
}
}
UniversalEmailAddressField.prototype.handleInputResize=function(e) {
if(this.i_fieldObject!=undefined) {
this.i_fieldObject.width(this.inputWidth());
}
}
UniversalEmailAddressField.prototype.handleStaticChange=function(e) {
if(!e.static && this.i_fieldObject!=undefined) {
this.height(this.i_fieldObject.fieldHeight());
}
}
UniversalEmailAddressField.inherit(UniversalFormInput);
function UniversalTypeaheadInput(name, description, typeahead, width) {
this.i_typeahead=typeahead;
this.superConstructor("typeahead_input", name, description, width, 22);
EventHandler.register(this, "onresize", this.handleInputResize, this);
}
UniversalTypeaheadInput.prototype.typeahead=function(typeahead) {
if(typeahead!=undefined) {
this.i_typeahead=typeahead;
}
return this.i_typeahead;
}
UniversalTypeaheadInput.prototype.handleInputResize=function(e) {
if (this.i_typeahead!=undefined) {
this.i_typeahead.setWidth(this.inputWidth());
this.i_typeahead.setHeight(this.height());
}
}
UniversalTypeaheadInput.prototype.inputObject=function() {
if(this.i_object==undefined) {
this.i_object=this.i_typeahead.getContent();
}	
return this.i_object;
}
UniversalTypeaheadInput.prototype.value=function(value) {
if (value!=undefined) {
this.i_typeahead.setInputValue(value);
}
return this.i_typeahead.getInputValue();
}
UniversalTypeaheadInput.inherit(UniversalFormInput);
JavaScriptResource.notifyComplete("./lib/components/Component.UniversalForm.js");
function MiniCalendar(width, height, date, starting_day) {
this.superConstructor(width, height, date, starting_day);
}
MiniCalendar.prototype.superConstructor=function(width, height, date, starting_day) {
this.i_width=width;
this.i_height=height;
this.i_selected_date=(date==undefined) ? new Date() : date;
this.i_starting_day=(starting_day==undefined) ? 0 : starting_day;
this.i_marker_visible=true;
if (date!=undefined) {
this.activeMonth(date.getMonth());
this.activeYear(date.getFullYear());
}
else {
var d=new Date();
this.activeMonth(d.getMonth());
this.activeYear(d.getFullYear());
}
}
MiniCalendar.monthHeight=18;
MiniCalendar.weekDayHeight=18;
MiniCalendar.monthButtonWidth=18;
MiniCalendar.months=Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
MiniCalendar.prototype.markerVisible=function(state) {
if (state!=undefined) {
this.i_marker_visible=state;
var date_today=new Date();
if (this.i_active_month==date_today.getMonth() && this.i_active_year==date_today.getFullYear()) {
this.circleThisDay(date_today);
}
}
return this.i_marker_visible;
}
MiniCalendar.prototype.startingDay=function(day) {
if (day!=undefined) {
if (day!=this.i_starting_day) {
this.i_starting_day=day;
if (this.i_wdays!=undefined) {
for (var x=0; x < 7; x++) {
this.i_wdays[x].innerHTML=this.i_wday_n[(x+this.startingDay()) % 7];
}
}
this.updateDays();
}
}
return this.i_starting_day;
}
MiniCalendar.prototype.date=function(date, user_action) {
if (date!=undefined) {
if(this.i_selected_date==undefined || 
(this.i_selected_date.getMonth()!=date.getMonth() || 
this.i_selected_date.getFullYear()!=date.getFullYear() || 
this.i_selected_date.getDate()!=date.getDate())) {
this.i_selected_date=date.copy(true);
this.updateDays();
if (this.onselect!=undefined) {
var o=new Object();
o.type="select";
o.userAction=(user_action==true ? true : false);
o.date=this.i_selected_date;
o.calendar=this;
this.onselect(o);
}
}
}
return this.i_selected_date;
}
MiniCalendar.prototype.activeMonth=function(month) {
if (month!=undefined) {
this.i_active_month=month;
if (this.i_calendar!=undefined) {
this.i_month_name.innerHTML=MiniCalendar.months[this.activeMonth()]+" "+this.activeYear()+"";
}
this.updateDays();
}
return this.i_active_month;
}
MiniCalendar.prototype.activeYear=function(year) {
if (year!=undefined) {
this.i_active_year=year;
if (this.i_calendar!=undefined) {
this.i_month_name.innerHTML=MiniCalendar.months[this.activeMonth()]+" "+this.activeYear()+"";
}
this.updateDays();
}
return this.i_active_year;
}
MiniCalendar.prototype.setMonthYear=function(month, year) {
this.i_active_month=month;
this.i_active_year=year;
if (this.i_calendar!=undefined) {
this.i_month_name.innerHTML=MiniCalendar.months[this.i_active_month]+" "+this.i_active_year+"";
}
this.updateDays();
}
MiniCalendar.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_calendar!=undefined) {
var dayWidth=Math.floor(this.width() / 7);
var dayHeight=Math.floor((this.height() - (MiniCalendar.monthHeight+MiniCalendar.weekDayHeight)) / 6);
this.i_calendar.style.wdith=this.width()+"px";
this.i_month.style.width=this.width()+"px";
this.i_week.style.width=this.width()+"px";
this.i_month_name.style.width=(this.width() - (MiniCalendar.monthButtonWidth * 2))+"px";
if ((dayWidth > dayHeight ? dayHeight : dayWidth) > 0) {
this.i_selected_image.style.width=(dayWidth > dayHeight ? dayHeight : dayWidth)+"px";
this.i_selected_image.style.height=(dayWidth > dayHeight ? dayHeight : dayWidth)+"px";
this.i_selected_image.style.marginLeft=Math.floor((dayWidth - (dayWidth > dayHeight ? dayHeight : dayWidth)) / 2)+"px";
this.i_selected_image.style.marginTop=Math.floor((dayHeight - (dayWidth > dayHeight ? dayHeight : dayWidth)) / 2)+"px";
this.i_selected_image.style.display="";
}
else {
this.i_selected_image.style.display="none";
}
this.i_days_div.style.width=this.width()+"px";
if (dayWidth > 0) {
if (this.i_cur_day!=undefined) {
this.i_cur_day.style.width=dayWidth+"px";
}
for (var x=0; x < 7; x++) {
this.i_wdays[x].style.width=dayWidth+"px";
}
for (var y=0; y < 6; y++) {
this.i_rows[y].style.width=this.width()+"px";
for (var x=0; x < 7; x++) {
this.i_days[y][x].style.width=dayWidth+"px";
}
}
}
}
}
return this.i_width;
}
MiniCalendar.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_calendar!=undefined) {
var dayWidth=Math.floor(this.width() / 7);
var dayHeight=Math.floor((this.height() - (MiniCalendar.monthHeight+MiniCalendar.weekDayHeight)) / 6);
this.i_calendar.style.height=this.height()+"px";
this.i_month.style.height=MiniCalendar.monthHeight+"px";
this.i_week.style.height=MiniCalendar.weekDayHeight+"px";
if ((dayWidth > dayHeight ? dayHeight : dayWidth) > 0) {
this.i_selected_image.style.width=(dayWidth > dayHeight ? dayHeight : dayWidth)+"px";
this.i_selected_image.style.height=(dayWidth > dayHeight ? dayHeight : dayWidth)+"px";
this.i_selected_image.style.marginLeft=Math.floor((dayWidth - (dayWidth > dayHeight ? dayHeight : dayWidth)) / 2)+"px";
this.i_selected_image.style.marginTop=Math.floor((dayHeight - (dayWidth > dayHeight ? dayHeight : dayWidth)) / 2)+"px";
this.i_selected_image.style.display="";
}
else {
this.i_selected_image.style.display="none";
}
this.i_days_div.style.fontSize=Math.floor((dayHeight * .7) - 12 < 11 ? 11 : ((dayHeight * .7) - 12))+"px";
if (this.i_cur_day!=undefined && dayHeight > 0) {
this.i_cur_day.style.height=dayHeight+"px";
}
if (dayHeight > 0) {
for (var y=0; y < 6; y++) {
this.i_rows[y].style.height=dayHeight+"px";
for (var x=0; x < 7; x++) {
this.i_days[y][x].style.height=dayHeight+"px";
this.i_days[y][x].style.lineHeight=dayHeight+"px";
}
}
}
}
}
return this.i_height;
}
MiniCalendar.prototype.dayWidth=function() {
return Math.floor(this.width() / 7);
}
MiniCalendar.prototype.dayHeight=function() {
return Math.floor((this.height() - (MiniCalendar.monthHeight+MiniCalendar.weekDayHeight)) / 6);
}
MiniCalendar.prototype.updateDays=function() {
if (this.i_calendar!=undefined) {
var temp=new Date(this.i_active_year, this.i_active_month, 1);
var startDay=temp.getDay() - this.i_starting_day;
if (startDay < 0) {
startDay=7+startDay;
}
var m=this.i_active_month - 1;
var y=this.i_active_year;
if (m < 0) {
m=11;
y--;
}
var mc=MiniCalendar.monthDayCount(m, y);
if (this.i_cache_selected!=undefined) {
this.i_cache_selected.removeChild(this.i_selected_image);
this.i_cache_selected=undefined;
}
var dayWidth=this.dayWidth();
var dayHeight=this.dayHeight();
var pre_active=mc - (startDay - 1);
var active_d=1;
var p=0;
var post_active=1;
var sel;
for (var y=0; y < 6; y++) {
for (var x=0; x < 7; x++) {
p++;
if (p > startDay && temp.getMonth()==this.i_active_month) {
this.i_days[y][x].innerHTML=active_d++;
this.i_days[y][x].className="MiniCalendar_date_day";
this.i_days[y][x].active=true;
this.i_days[y][x].i_month=this.i_active_month;
this.i_days[y][x].i_year=this.i_active_year;
this.i_days[y][x].i_date=active_d - 1;
temp.setDate(active_d);
}
else {
this.i_days[y][x].i_month=(p > 7 && this.i_active_month!=11 ? this.i_active_month+1 : 
p > 7 && this.i_active_month==11 ? 0 : m);
this.i_days[y][x].i_year=((p > 7 && this.i_active_month==11) ? this.i_active_year+1 : 
(p <=7 && this.i_active_month==0 ? this.i_active_year - 1 : this.i_active_year));
this.i_days[y][x].i_date=(p > 7 ? post_active : pre_active);
this.i_days[y][x].innerHTML=(p > 7 ? post_active++: pre_active++);
this.i_days[y][x].className="MiniCalendar_date_day_inactive";
this.i_days[y][x].active=false;
}
}
}
if (this.i_highlight_period=='d' && this.i_highlight_x!=undefined && this.i_highlight_y!=undefined) {
this.i_days[this.i_highlight_y][this.i_highlight_x].className="MiniCalendar_date_day_hover";
}
}
}
MiniCalendar.monthDayCount=function(month, year) {
if (month!=1) {
var mDays=Array(31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
return mDays[month];
}
else {
if (MiniCalendar.monthCache==undefined) {
MiniCalendar.monthCache=Array();
}
if (MiniCalendar.monthCache[year]!=undefined) {
return MiniCalendar.monthCache[year];
}
var d=new Date();
d.setFullYear(year);
d.setMonth(month, 29);
var m=29;
if (d.getMonth()!=month) {
m=28;
}
MiniCalendar.monthCache[year]=m;
return m;
}
}
MiniCalendar.prototype.showLastMonth=function() {
this.clearHighlight();
var month=this.activeMonth();
var year=this.activeYear();
month--;
if (month < 0) {
month=11;
year--;
}
this.setMonthYear(month, year);
}
MiniCalendar.prototype.showNextMonth=function() {
this.clearHighlight();
var month=this.activeMonth();
var year=this.activeYear();
month++;
if (month==12) {
month=0;
year++;
}
this.setMonthYear(month, year);
}
MiniCalendar.prototype.handleClickLastMonth=function(e) {
this.showLastMonth();
if(this.onclicklastmonth) {
var o=new Object();
o.type="clicklastmonth";
this.onclicklastmonth(o);
}
}
MiniCalendar.prototype.handleClickNextMonth=function(e) {
this.showNextMonth();
if(this.onclicknextmonth) {
var o=new Object();
o.type="clicknextmonth";
this.onclicknextmonth(o);
}
}
MiniCalendar.prototype.throwMonthChangeEvent=function(direction) {
if (direction==-1 || direction==1) {   
if (this.onmonthchange!=undefined) {
var o=new Object();
o.type="monthchange";
o.direction=direction;
this.onmonthchange(o);
}
}
}
MiniCalendar.prototype.setDayHighlight=function(x, y, state) {
if (state) {
this.i_days[y][x].className="MiniCalendar_date_day_hover"+(this.i_days[y][x].active!=true ? "_inactive" : "");
this.i_highlight_period='d';   
this.i_highlight_x=x;   
this.i_highlight_y=y;   
} else {
this.i_days[y][x].className="MiniCalendar_date_day"+(this.i_days[y][x].active!=true ? "_inactive" : "");			
this.i_highlight_period=undefined;
}
}
MiniCalendar.prototype.getDayCoordinates=function(find_date) {
var day=find_date.getDate();
var month=find_date.getMonth();
if (this.i_active_month==month && this.i_active_year==find_date.getFullYear()) {
var known_x=0;
var known_y=2;
var diff=day - this.i_days[known_y][known_x].i_date;
var week_diff=(diff/7) | 0;   
var day_diff=diff % 7;
if (day_diff < 0) {
--week_diff;
day_diff+=7;
}
return [known_x+day_diff, known_y+week_diff];
} else {
return null;
}
}
MiniCalendar.prototype.highlightThisDay=function(highlight_date) {
var day_coordinates=this.getDayCoordinates(highlight_date);
if (day_coordinates!=null) {
this.setDayHighlight(day_coordinates[0], day_coordinates[1], true);
}
}
MiniCalendar.prototype.circleThisDay=function(circle_date) {
var day_coordinates=this.getDayCoordinates(circle_date);
if (day_coordinates!=null) {
var day_x=day_coordinates[0];
var day_y=day_coordinates[1];
this.i_days[day_y][day_x].innerHTML="";
this.i_days[day_y][day_x].appendChild(this.i_selected_image);
this.i_cur_day=document.createElement('DIV');
this.i_cur_day.className="MiniCalendar_selected_text";
this.i_cur_day.innerHTML=circle_date.getDate();
this.i_cur_day.style.width=this.dayWidth()+"px";
this.i_cur_day.style.height=this.dayHeight()+"px";
this.i_days[day_y][day_x].appendChild(this.i_cur_day);
this.i_cache_selected=this.i_days[day_y][day_x];
}
}
MiniCalendar.prototype.setWeekHighlight=function(y, state) {
if (state) {
this.i_rows[y].className="MiniCalendar_date_row_hover";
this.i_highlight_period='w';   
this.i_highlight_y=y;   
} else {
this.i_rows[y].className="MiniCalendar_date_row";
this.i_highlight_period=undefined;
}
}
MiniCalendar.prototype.highlightWeekStarting=function(week_start_date) {
var day=week_start_date.getDate();
var month=week_start_date.getMonth();
var i=0;
var found_it=false;   
while (i < this.i_days.length && !found_it) {
if (this.i_days[i][0].i_date==day & this.i_days[i][0].i_month==month) {
this.setWeekHighlight(i, true);
found_it=true;
}++i;
}
}
MiniCalendar.prototype.setMonthHighlight=function(state) {
var rowClassName;
if (state) {
rowClassName="MiniCalendar_date_row_hover";
this.i_highlight_period='m';   
} else {
rowClassName="MiniCalendar_date_row"
this.i_highlight_period=undefined;
}
this.i_highlight_y=[];
for (var i=0; i < this.i_days.length;++i) {
this.i_rows[i].className=rowClassName;
this.i_highlight_y.push(i);
}
}
MiniCalendar.prototype.clearHighlight=function() {
if (this.i_highlight_period!=undefined) {
switch(this.i_highlight_period) {
case 'm':   
this.setMonthHighlight(false);
break;
case 'w':   
this.setWeekHighlight(this.i_highlight_y, false);
break;
case 'd':   
this.setDayHighlight(this.i_highlight_x, this.i_highlight_y, false);
break;
}   
this.i_highlight_period=undefined;
}
}
MiniCalendar.prototype.highlightPeriod=function(period, y, x) {
if (period!=undefined) {
switch(period) {
case 'm':   
this.setMonthHighlight(true);
break;
case 'w':   
this.setWeekHighlight(y, true);
break;
case 'd':   
this.setDayHighlight(x, y, true);
break;
}   
}
}
MiniCalendar.prototype.handleDayMouseMove=function(e) {
var x=e.originalScope.pos_x;
var y=e.originalScope.pos_y;
this.i_last_day_hover={"x": x, "y": y};
if(this.onhoverday!=undefined) {
var o=new Object();
o.type="hoverday";
o.minical=this;
o.x=x;
o.y=y;
this.onhoverday(o);
}
}
MiniCalendar.prototype.handleDayMouseOut=function(e) {
if (this.onmouseoutday!=undefined) {
var o=new Object();
o.type="mouseoutday";
o.minical=this;
if(this.i_last_day_hover) {
o.x=this.i_last_day_hover.x;
o.y=this.i_last_day_hover.y;
}
this.onmouseoutday(o);
}
}
MiniCalendar.prototype.handleDayClick=function(e) {
var date_clicked=new Date(e.originalScope.i_year, e.originalScope.i_month, e.originalScope.i_date);
if (this.onclickday!=undefined) {
var o=new Object();
o.type="clickday";
o.date_clicked=date_clicked;
o.minical=this;
o.clicked_pos_y=e.originalScope.pos_y;
this.onclickday(o);
}
}
MiniCalendar.prototype.getWindow=function() {
if (this.i_window==undefined) {
this.i_window=new WindowObject('cal', 'Calendar', this.width(), this.height(), Application.titleBarFactory());
this.i_window.effectiveWidth(this.width());
this.i_window.effectiveHeight(this.height());
this.i_window.allowFloatingResize(false);
this.i_window.loadContent(this.getSelector());
}
return this.i_window;
}
MiniCalendar.prototype.open=function() {
this.getWindow().popWindow(this.width()+2, this.height()+this.getWindow().titleBar().height()+4, true);
this.getWindow().titleBar().removeButton(Application.i_title_dock);
}
MiniCalendar.prototype.close=function() {
this.getWindow().close(undefined, true);
}
MiniCalendar.prototype.handleMonthClick=function(e) {
if (this.onclickmonth!=undefined) {
var o=new Object();
o.type="clickmonth";
o.calendar=this;
this.onclickmonth(o);
}
}
MiniCalendar.prototype.getSelector=function() {
if (this.i_calendar==undefined) {
this.i_calendar=document.createElement('DIV');
this.i_calendar.className="MiniCalendar";
this.i_calendar.style.wdith=this.width()+"px";
this.i_calendar.style.height=this.height()+"px";
this.i_month=document.createElement('DIV');
this.i_month.className="MiniCalendar_month";
this.i_month.style.height=MiniCalendar.monthHeight+"px";
this.i_month.style.width=this.width()+"px";
this.i_calendar.appendChild(this.i_month);
this.i_last_month=document.createElement('DIV');
this.i_last_month.className="MiniCalendar_last_month";
this.i_last_month.style.width=MiniCalendar.monthButtonWidth+"px";
this.i_last_month.style.height=MiniCalendar.monthHeight+"px";
EventHandler.register(this.i_last_month, "onclick", this.handleClickLastMonth, this);
this.i_last_month.innerHTML="&nbsp;";
this.i_month.appendChild(this.i_last_month);
this.i_month_name=document.createElement('DIV');
this.i_month_name.className="MiniCalendar_month_name";
this.i_month_name.style.width=(this.width() - (MiniCalendar.monthButtonWidth * 2))+"px";
this.i_month_name.style.height=MiniCalendar.monthHeight+"px";
this.i_month_name.onselectstart=EventHandler.cancelEvent;
EventHandler.register(this.i_month_name, "onclick", this.handleMonthClick, this);
this.i_month_name.innerHTML=MiniCalendar.months[this.activeMonth()]+" "+this.activeYear()+"";
this.i_month.appendChild(this.i_month_name);
this.i_next_month=document.createElement('DIV');
this.i_next_month.className="MiniCalendar_next_month";
this.i_next_month.style.width=MiniCalendar.monthButtonWidth+"px";
this.i_next_month.style.height=MiniCalendar.monthHeight+"px";
EventHandler.register(this.i_next_month, "onclick", this.handleClickNextMonth, this);
this.i_next_month.innerHTML="&nbsp;";
this.i_month.appendChild(this.i_next_month);
this.i_week=document.createElement('DIV');
this.i_week.className="MiniCalendar_week";
this.i_week.style.height=MiniCalendar.weekDayHeight+"px";
this.i_week.style.width=this.width()+"px";
this.i_calendar.appendChild(this.i_week);
this.i_rows=Array();
this.i_days=Array();
var dayWidth=Math.floor(this.width() / 7);
var dayHeight=Math.floor((this.height() - (MiniCalendar.monthHeight+MiniCalendar.weekDayHeight)) / 6);
this.i_selected_image=document.createElement('IMG');
this.i_selected_image.src="./img/date_selected.gif";
this.i_selected_image.className="MiniCalendar_date_selector";
this.i_selected_image.style.width=(dayWidth > dayHeight ? dayHeight : dayWidth)+"px";
this.i_selected_image.style.height=(dayWidth > dayHeight ? dayHeight : dayWidth)+"px";
this.i_selected_image.style.marginLeft=Math.floor((dayWidth - (dayWidth > dayHeight ? dayHeight : dayWidth)) / 2)+"px";
this.i_selected_image.style.marginTop=Math.floor((dayHeight - (dayWidth > dayHeight ? dayHeight : dayWidth)) / 2)+"px";
this.i_wday_n=Array('S', 'M', 'T', 'W', 'T', 'F', 'S');
this.i_wdays=Array();
for (var x=0; x < 7; x++) {
this.i_wdays[x]=document.createElement('DIV');
this.i_wdays[x].className="MiniCalendar_week_day";
this.i_wdays[x].style.width=dayWidth+"px";
this.i_wdays[x].style.height=MiniCalendar.weekDayHeight+"px";
this.i_wdays[x].innerHTML=this.i_wday_n[x+this.startingDay() % 7];
this.i_wdays[x].onselectstart=EventHandler.cancelEvent;
this.i_week.appendChild(this.i_wdays[x]);
}
this.i_days_div=document.createElement('DIV');
this.i_days_div.className="MiniCalendar_days";
this.i_days_div.style.width=this.width()+"px";
this.i_days_div.style.fontSize=Math.floor((dayHeight * .7) - 12 < 11 ? 11 : ((dayHeight * .7) - 12))+"px";
this.i_days_div.style.height=(this.height() - (MiniCalendar.monthHeight+MiniCalendar.weekDayHeight))+"px";
this.i_calendar.appendChild(this.i_days_div);
for (var y=0; y < 6; y++) {
this.i_rows[y]=document.createElement('DIV');
this.i_rows[y].className="MiniCalendar_date_row";
this.i_rows[y].style.width=this.width()+"px";
this.i_rows[y].style.height=dayHeight+"px";
this.i_days_div.appendChild(this.i_rows[y]);
this.i_days[y]=Array();
for (var x=0; x < 7; x++) {
this.i_days[y][x]=document.createElement('DIV');
this.i_days[y][x].className="MiniCalendar_date_day";
this.i_days[y][x].style.width=dayWidth+"px";
this.i_days[y][x].style.height=dayHeight+"px";
this.i_days[y][x].style.lineHeight=dayHeight+"px";
this.i_days[y][x].onselectstart=EventHandler.cancelEvent;
this.i_days[y][x].pos_x=x;
this.i_days[y][x].pos_y=y;
EventHandler.register(this.i_days[y][x], "onmousemove", this.handleDayMouseMove, this);
EventHandler.register(this.i_days[y][x], "onmouseout", this.handleDayMouseOut, this);
EventHandler.register(this.i_days[y][x], "onclick", this.handleDayClick, this);
this.i_rows[y].appendChild(this.i_days[y][x]);
}
}	
this.updateDays();			
}
return this.i_calendar;
}
MiniCalendar.prototype.positionDate=function(pos_x, pos_y) {
var ret=undefined;
var left=0;
var top=0;
var element=this.i_days[0][0];
while(element!=undefined) {
left+=parseInt(element.offsetLeft)+parseInt(element.scrollLeft);
top+=parseInt(element.offsetTop)+parseInt(element.scrollTop);
element=element.offsetParent;
}
if(pos_y >=top && pos_y <=(top+this.height() - MiniCalendar.monthHeight - MiniCalendar.weekDayHeight) && pos_x >=left && pos_x <=left+this.width()) {
var dayWidth=Math.floor(this.width() / 7);
var dayHeight=Math.floor((this.height() - (MiniCalendar.monthHeight+MiniCalendar.weekDayHeight)) / 6);
var x=0;
var y=0;
while(top+dayHeight <=pos_y && x < 6) {++x;
top+=dayHeight;
}
while(left+dayWidth <=pos_x && y < 7) {++y;
left+=dayWidth;
}
if(x < 6 && y < 7) {
var day=this.i_days[x][y];
ret=new Date(day.i_year, day.i_month, day.i_date, 0, 0, 0, 0);
}
}
return ret;
}
JavaScriptResource.notifyComplete("./lib/components/Component.MiniCalendar.js");
function MiniCalendarSelector(width, height, date, starting_day) {
this.superConstructor(width, height, date, starting_day);
EventHandler.register(this, "onhoverday", this.handleSelectorDayHover, this);
EventHandler.register(this, "onmouseoutday", this.handleSelectorDayMouseOut, this);
EventHandler.register(this, "onclickday", this.handleSelectorDayClick, this);
}
MiniCalendarSelector.prototype.handleSelectorDayHover=function(e) {
if(e.x!=undefined && e.y!=undefined) {
this.setDayHighlight(e.x, e.y, true);
}
}
MiniCalendarSelector.prototype.handleSelectorDayMouseOut=function(e) {
if(e.x!=undefined && e.y!=undefined) {
this.setDayHighlight(e.x, e.y, false);
}
}
MiniCalendarSelector.prototype.handleSelectorDayClick=function(e) {
this.date(e.date_clicked);
if (this.onselect!=undefined) {
var o=new Object();
o.type="select";
o.date=this.i_selected_date;
o.calendar=this;
this.onselect(o);
}
}
MiniCalendarSelector.prototype.open=function(){
MiniCalendar.prototype.open.call(this);
this.getWindow().titleBar().removeButton(Application.i_title_minimize);
}
MiniCalendarSelector.inherit(MiniCalendar);
JavaScriptResource.notifyComplete("./lib/components/Component.MiniCalendarSelector.js");
function WidgetManager() {
this.i_types=Array();
this.i_category=Array();
}
WidgetManager.catalogWidth=700;
WidgetManager.catalogHeight=400;
WidgetManager.columnWidth=170;
WidgetManager.dividerWidth=7;
WidgetManager.rowHeight=16;
WidgetManager.prototype.addWidget=function(widget_type) {
var added=false;
for (var x=0; x < this.i_category.length; x++) {
if (this.i_category[x].name().toLowerCase()==widget_type.category().toLowerCase()) {
this.i_category[x].addWidget(widget_type);
added=true;
break;
}
}
if (!added) {
var c=new WidgetCategory(widget_type.category());
c.addWidget(widget_type);
var widget_type_name=widget_type.name().toLowerCase();
var ad=false;
for (var x=0; x < this.i_category.length; x++){ 
if (this.i_category[x].name().toLowerCase() > widget_type_name) {
if (this.i_categories!=undefined) {
this.i_categories.insertBefore(c.getRow(), this.i_category[x+1].getRow());
}
ad=true;
this.i_category.splice(x, 0, c);
break;
}
}
if (ad==false) {
this.i_category[this.i_category.length]=c;
if (this.i_categories!=undefined) {
this.i_categories.appendChild(c.getRow());
}
}
this.updateCategoryWidth();
}
return true;
}
WidgetManager.prototype.removeWidget=function(widget_type) {
for (var x=0; x < this.i_category.length; x++) { 
if (this.i_category[x].removeWidget(widget_type)==true) {
if (this.i_category[x].widgets().length==0) {
if (this.i_categories!=undefined) {
this.i_categories.removeChild(this.i_category[x].getRow());
}
this.i_category.splice(x, 1);
this.updateCategoryWidth();
}
return true;
}
}
return false;
}
WidgetManager.prototype.updateCategoryWidth=function() {
var h=(this.i_window==undefined ? 0 : this.i_window.effectiveHeight() - this.i_window.titleBar().height() - this.i_tools.height());
var rh=(this.i_category.length * WidgetManager.rowHeight);
var w=WidgetManager.columnWidth;
if (rh > h) {
w-=scrollBarWidth();
}
for (var x=0; x < this.i_category.length; x++){ 
this.i_category[x].width(w);
}
}
WidgetManager.prototype.getCatalog=function() {
if (this.i_catalog==undefined) {
this.i_catalog=document.createElement('DIV');
this.i_catalog.className="WidgetManager";
this.i_tools=new ToolBar(100);
this.i_catalog.appendChild(this.i_tools.getBar());
this.i_sections=document.createElement('DIV');
this.i_sections.className="WidgetManager_sections";
this.i_catalog.appendChild(this.i_sections);
this.i_categories=document.createElement('DIV');
this.i_categories.className="WidgetManager_categories";
this.i_categories.style.width=WidgetManager.columnWidth+"px";
for (var x=0; x < this.i_category.length; x++) {
this.i_categories.appendChild(this.i_category[x].getRow());
}
this.i_sections.appendChild(this.i_categories);
this.i_div1=document.createElement('DIV');
this.i_div1.className="WidgetManager_divider";
this.i_div1.innerHTML="&nbsp;";
this.i_div1.style.width=WidgetManager.dividerWidth+"px";
this.i_sections.appendChild(this.i_div1);
this.i_widget_names=document.createElement('DIV');
this.i_widget_names.className="WidgetManager_names";
this.i_widget_names.style.width=WidgetManager.columnWidth+"px";
this.i_sections.appendChild(this.i_widget_names);
this.i_div2=document.createElement('DIV');
this.i_div2.className="WidgetManager_divider";
this.i_div2.innerHTML="&nbsp;";
this.i_div2.style.width=WidgetManager.dividerWidth+"px";
this.i_sections.appendChild(this.i_div2);
this.i_widget_preview=document.createElement('DIV');
this.i_widget_preview.className="WidgetManager_preview";
this.i_sections.appendChild(this.i_widget_preview);
this.updateCategoryWidth();
}
return this.i_catalog;
}
WidgetManager.prototype.handleManagerResize=function(e) {
if (this.i_catalog!=undefined) {
this.i_catalog.style.width=(this.i_window.effectiveWidth() - 2)+"px";
this.i_catalog.style.height=(this.i_window.effectiveHeight() - this.i_window.titleBar().height() - 3)+"px";
this.i_tools.width((this.i_window.effectiveWidth() - 2));
var content_width=(this.i_window.effectiveWidth() - 2);
var content_height=(this.i_window.effectiveHeight() - this.i_window.titleBar().height() - this.i_tools.height() - 3);
this.i_sections.style.width=content_width+"px";
this.i_sections.style.height=content_height+"px";
this.i_categories.style.height=content_height+"px";
this.i_div1.style.height=(content_height+1)+"px";
this.i_widget_names.style.height=content_height+"px";
this.i_div2.style.height=(content_height+1)+"px";
this.i_widget_preview.style.height=content_height+"px";
this.i_widget_preview.style.width=(content_width - ((WidgetManager.columnWidth+WidgetManager.dividerWidth) * 2))+"px";
}
}
WidgetManager.prototype.getWindow=function() {
if (this.i_window==undefined) {
this.i_window=new WindowObject("widget-catalog", "Widget Catalog", WidgetManager.catalogWidth, WidgetManager.catalogHeight, Application.titleBarFactory());
EventHandler.register(this.i_window, "oncontentresize", this.handleManagerResize, this);
this.i_window.loadContent(this.getCatalog());
}
return this.i_window;
}
WidgetManager.prototype.show=function() {
this.getWindow().popWindow(WidgetManager.catalogWidth, WidgetManager.catalogHeight, true);
this.handleManagerResize();
for (var x=0; x < 100; x++){ 
this.addWidget(new WidgetType(43543, "test "+x, "tsagsdfsa", "dsafasdf"));
}
return true;
}
function WidgetCategory(name) {
this.i_name=name;
this.i_width=WidgetManager.columnWidth+"px";
this.i_widgets=Array();
}
WidgetCategory.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_row!=undefined) {
this.i_row.style.width=width+"px";
}
}
return this.i_width;
}
WidgetCategory.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if (this.i_row!=undefined) {
this.i_row.innerHTML=name;
}
}
return this.i_name;
}
WidgetCategory.prototype.widgets=function(index) {
if (index!=undefined) {
return this.i_widgets[index];
}
return this.i_widgets;
}
WidgetCategory.prototype.addWidget=function(widget) {
this.i_widgets[this.i_widgets.length]=widget;
return widget;
}
WidgetCategory.prototype.removeWidget=function(widget) {
for (var x=0; x < this.i_widgets.length; x++){ 
if (this.i_widgets[x]==widget) {
this.i_widgets.splice(x, 1);
return true;
}
}
return false;
}
WidgetCategory.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover_state=state;
}
return this.i_hover_state;
}
WidgetCategory.prototype.getRow=function() {
if (this.i_row==undefined) {
this.i_row=document.createElement('DIV');
this.i_row.className=(this.hoverState()==true ? "WidgetCategory_hover" : "WidgetCategory");
this.i_row.style.width=this.width()+"px";
this.i_row.style.height=WidgetManager.rowHeight+"px";
this.i_row.innerHTML=this.name();
EventHandler.register(this.i_row, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_row, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_row, "onclick", this.handleClick, this);
}
return this.i_row;
}
function WidgetType(id, category, name, description, image_path) {
this.superWidget(id, category, name, description, image_path);
}
WidgetType.prototype.superWidget=function(id, category, name, description, image_path) {
this.i_id=id;
this.i_category=category;
this.i_name=name;
this.i_description=description;
this.i_image=image_path;
}
WidgetType.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
WidgetType.prototype.category=function() {
return this.i_category;
}
WidgetType.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
WidgetType.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
}
return this.i_description;
}
WidgetType.prototype.imagePath=function(path) {
if (path!=undefined) {
this.i_image=path;
}
return this.i_image;
}
JavaScriptResource.notifyComplete("./lib/controllers/Controller.Widget.js");
function LayoutManager() {
this.i_configurations=Array();
this.i_notification_visible=false;
this.i_auto_save=2;
EventHandler.register(SystemCore, "onchangeapplication", this.handleChangeApplication, this);
this.i_modified=false;
}
LayoutManager.notificationWindowPadding=5;
LayoutManager.notificationHeight=100;
LayoutManager.notificationWidth=370;
LayoutManager.notificationPadding=6;
LayoutManager.notificationButtonHeight=20;
LayoutManager.notificationIconWidth=16;
LayoutManager.notificationIconHeight=16;
LayoutManager.iconPadding=5;
LayoutManager.notificationMessage="Would you like to save the changes you made to this layout?";
LayoutManager.notificationOptionText="Automatically do this from now on";
LayoutManager.notificationDelay=5000;
LayoutManager.autoSaveDelay=300000; 
LayoutManager.i_temporary=Array();
LayoutManager.prototype.onconfigurationchange=null;
LayoutManager.resolveChange=function() {
if (LayoutManager.i_manager.autoSave()==0 || 
(LayoutManager.i_manager.activeConfiguration().locked() && LayoutManager.i_manager.autoSave()==2)) {
LayoutManager.i_manager.notificationVisible(true);
}
else if (LayoutManager.i_manager.autoSave()==2) {
var o=new Object();
o.type="click";
LayoutManager.i_manager.handleSaveLayout(o);
}
}
LayoutManager.prototype.notifyChange=function(minor) {
if(this.autoSave()==1) { return; } 
if(!GDSConfiguration.layout_on || _LITE_ || SystemCore.hasApp(3006)) { return; } 
this.clearChangeTimer();
LayoutManager.i_manager=this;
if (this.autoSave()==0 ||
(LayoutManager.i_manager.activeConfiguration().locked() && LayoutManager.i_manager.autoSave()==2)) { 
this.i_timer=setTimeout(LayoutManager.resolveChange, LayoutManager.notificationDelay);
}
else if (this.autoSave()==2) {
this.i_timer=setTimeout(LayoutManager.resolveChange, LayoutManager.autoSaveDelay);
}
this.modified(true);
}
LayoutManager.prototype.clearChangeTimer=function() {
if (this.i_timer!=undefined) {
clearTimeout(this.i_timer);
this.i_timer=null;
}
}
LayoutManager.prototype.modified=function(state) {
if (state!=undefined) {
this.i_modified=state;
if (this.activeConfiguration().locked()!=true) {
if (this.i_context_save!=undefined) {
this.i_context_save.enabled(state);
}
} else { 
if (this.i_context_save!=undefined) {
this.i_context_save.enabled(false);
}
}
}
return this.i_modified;
}
LayoutManager.prototype.autoSave=function(state) {
if (state!=undefined) {
this.i_auto_save=state;
}
return this.i_auto_save;
}
LayoutManager.prototype.configurations=function(index) {
if (index!=undefined) {
return this.i_configurations[index];
}
return this.i_configurations;
}
LayoutManager.prototype.addConfiguration=function(configuration, beforeConfiguration) {
var append=true;
configuration.i_parent=this;
if (beforeConfiguration!=undefined) {
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x]==beforeConfiguration) {
this.i_configurations.splice(x, 0, configuration);
if (this.i_context!=undefined) {
this.i_context.addItem(configuration.getContextItem(), beforeConfiguration.getContextItem());
}
append=false;
break;
}
}
}
if (append) {
this.i_configurations[this.i_configurations.length]=configuration;
if ((this.i_context!=undefined) && (configuration.isDefault()==false)) {
this.i_context.addItem(configuration.getContextItem(), this.i_second_divider);
}
}
if (this.i_active_configuration==undefined) {
this.i_active_configuration=configuration;
}
if (configuration.isDefault()==true) {
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x]!=configuration) {
if (this.i_configurations[x].isDefault()) { 
this.i_configurations[x].isDefault(false); 
if (this.i_context!=undefined) {
this.i_context.addItem(configuration.getContextItem(), this.i_second_divider);
}
}
}
}
}
return configuration;
}
LayoutManager.prototype.removeConfiguration=function(configuration) {
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x]==configuration) {
this.i_configurations.splice(x, 1);
if (this.i_context!=undefined) {
this.i_context.removeItem(configuration.getContextItem());
}
return true;
}
}
return false;
}
LayoutManager.prototype.handleChangeApplication=function(e) {
if (e.oldApplication!=undefined) {
app=this.getLayout(e.oldApplication.id());
if (app!=undefined) {
app.dataNode(SystemCore.windowManager().exportDataNode());
}
LayoutManager.i_temporary[e.oldApplication.id()]=SystemCore.windowManager().exportTemporaryDataNodes(false);
}
LayoutManager.i_temporary_globals=SystemCore.windowManager().exportTemporaryDataNodes(true);
var app=this.getLayout(e.newApplication.id());
if (app!=undefined) {
var gt=Array();
for (var x=0; x < LayoutManager.i_temporary_globals.length; x++) {
gt[gt.length]=LayoutManager.i_temporary_globals[x];
}
if (LayoutManager.i_temporary[e.newApplication.id()]!=undefined) {
for (var x=0; x < LayoutManager.i_temporary[e.newApplication.id()].length; x++) {
gt[gt.length]=LayoutManager.i_temporary[e.newApplication.id()][x];
}
}
SystemCore.windowManager().importTemporaryDataNodes(gt);
SystemCore.windowManager().importDataNode(app.dataNode());
}
}
LayoutManager.prototype.reloadConfiguration=function(e) {
this.activeConfiguration(e.config);
SystemCore.locked(false);
}
LayoutManager.prototype.activeConfiguration=function(configuration) {
if (configuration!=undefined && this.i_active_configuration!=configuration) {
var gen_prefs=Application.getApplicationById('GP');
var oldActive=this.i_active_configuration;
if (configuration.initialized()==false) {
configuration.i_r=EventHandler.register(configuration, "oninitialize", this.reloadConfiguration, this);
configuration.initializeFromServer();
SystemCore.locked(true, "Please wait while your layout is loaded.");
}
else {
if (this.i_active_configuration!=undefined) {
this.i_active_configuration.reset();
}
this.i_active_configuration=configuration;
this.modified(false);
this.clearChangeTimer();
for (var x=0; x < this.i_configurations.length; x++){ 
this.i_configurations[x].getContextItem().state(configuration==this.i_configurations[x] ? true : false);
}
if (this.onconfigurationchange!=undefined) {
var o=new Object();
o.type="configurationchange";
o.manager=this;
o.configuration=configuration;
this.onconfigurationchange(o);
}
if (oldActive!=undefined) {
if (gen_prefs!=undefined) {
if (gen_prefs.param("layout_default")!=configuration.name()) {
gen_prefs.param("layout_default", configuration.name());
}
}
}
}
if (typeof configuration.locked=="function" && configuration.locked()) {
this.i_context_rename.enabled(false);
this.i_context_delete.enabled(false);
} else {
this.getContext();
this.i_context_rename.enabled(true);
this.i_context_delete.enabled(true);
if (this.i_preLockAutoSave!=undefined) {
this.autoSave(this.i_preLockAutoSave);
this.i_preLockAutoSave=undefined;
}
}
}
return this.i_active_configuration;
}
LayoutManager.prototype.handleSaveLayout=function(e) {
if (this.activeConfiguration().locked()) { 
}
else {
if (SystemCore.activeApplication()!=undefined) {
app=this.getLayout(SystemCore.activeApplication().id());
if (app!=undefined) {
app.dataNode(SystemCore.windowManager().exportDataNode());
}
this.activeConfiguration().globalPods(SystemCore.windowManager().exportGlobalDataNodes());
}
this.activeConfiguration().updateReset();
this.modified(false);
this.clearChangeTimer();
this.notificationVisible(false);
this.activeConfiguration().saveToServer();
if (typeof this.onlayoutsave=="function") {
var o={type:"layoutsave",layout:this.activeConfiguration(),manager:this};
this.onlayoutsave(o);
}
}
}
LayoutManager.prototype.handleSaveLayoutAs=function(e) {
this.clearChangeTimer();
this.notificationVisible(false);
if (e.type!="close") {
var isGood=false;
var i=1;
while (!isGood) {
isGood=true;
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x].name()=="New Layout "+i) {
isGood=false;
i++;
break;
}
}
}
layout=this.activeConfiguration();
var d=DialogManager.prompt("Please enter the name you would like to save this layout as", "Layout Manager", (layout.locked() ? "New Layout "+i : layout.name()), undefined, Array('Save', 'Cancel'), undefined, true, 0);
d.step=1;
EventHandler.register(d, "onclose", this.handleSaveLayoutAs, this);
}
else {
var name;
var layout;
if (e.dialog.step==1) {
if (e.dialog.button()=="Cancel") {
return true;
}
else {
name=e.dialog.value();
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x].name()==name) {
if (this.i_configurations[x].locked()) {
var d=DialogManager.prompt("A layout already exists by the selected name, and it cant be overwritten.  Please enter a new name for this layout.", "Layout Manager", name, undefined, Array('Save', 'Cancel'), undefined, true, 0);
d.step=1;
EventHandler.register(d, "onclose", this.handleSaveLayoutAs, this);
return true;	
}
else {
if (this.i_configurations[x]==this.activeConfiguration()) {
layout=this.activeConfiguration();
}
else {
var d=DialogManager.confirm("The name you entered is already in use, would you like to overwrite it?", "Layout Manager", undefined, Array('Yes', 'No', 'Cancel'), undefined, true);
d.step=2;
d.name=name;
d.layout=this.i_configurations[x];
EventHandler.register(d, "onclose", this.handleSaveLayoutAs, this);
return true;
}
}
}
}
}
}
else {
if (e.dialog.button()=="No") {
var d=DialogManager.prompt("Please enter the name you would like to save this layout as", "Layout Manager", e.dialog.name, undefined, Array('Save', 'Cancel'), undefined, true, 0);
d.step=1;
EventHandler.register(d, "onclose", this.handleSaveLayoutAs, this);
return true;
}
else if (e.dialog.button()=="Cancel") {
return true;
}
else {
name=e.dialog.name;
layout=e.dialog.layout;
}
}
if (SystemCore.activeApplication()!=undefined) {
app=this.getLayout(SystemCore.activeApplication().id());
if (app!=undefined) {
app.dataNode(SystemCore.windowManager().exportDataNode());
}
}
if (layout==undefined) {
layout=LayoutConfiguration.fromDataNode(this.activeConfiguration().toDataNode());
layout.name(name);
layout.isDefault(false);
layout.locked(false);
layout.updateReset();
this.addConfiguration(layout);
}
else {
layout.updateFromDataNode(this.activeConfiguration().toDataNode());
layout.name(name);
layout.isDefault(false);
layout.locked(false);
layout.updateReset();
}			
var ac=this.activeConfiguration();
this.activeConfiguration(layout);
ac.reset();
this.modified(false);
this.clearChangeTimer();
this.notificationVisible(false);
if (this.i_wantToAutoSave!=undefined) {
var gen_prefs=Application.getApplicationById('GP');
var autosaveState=(this.i_wantToAutoSave==true ? 2 : 0);
this.i_wantToAutoSave=undefined;
this.autoSave(autosaveState);
if (gen_prefs!=undefined) gen_prefs.param("layout_autosave", autosaveState);
}
layout.saveToServer();
if (typeof this.onlayoutsave=="function") {
var o={type:"layoutsave",layout:layout,manager:this};
this.onlayoutsave(o);
}
}
}
LayoutManager.prototype.handleNotificationRespond=function(e) {
var ans=e.originalScope.value;
this.i_notification_no.blur();
this.i_notification_save_as.blur();
this.i_notification_save.blur();
this.notificationVisible(false);
var gen_prefs=Application.getApplicationById('GP');
if (ans=="Save") {
this.handleSaveLayout(e);
if (this.i_notification_input.checked==true) {
this.autoSave(2);
if (gen_prefs!=undefined) {
gen_prefs.param("layout_autosave", 2);
}
}
}
else if (ans=="Save As..." || ans=="Yes") {
if (!this.activeConfiguration().locked())
this.i_wantToAutoSave=(this.i_notification_input.checked==true);
this.handleSaveLayoutAs(e);
} else if (ans=="No") {
if (this.i_notification_input.checked==true) {
this.autoSave(1);
if (gen_prefs!=undefined) {
gen_prefs.param("layout_autosave", 1);
}
}
}
}
LayoutManager.prototype.getNotification=function() {
if (this.i_notification==undefined) {
this.i_notification=document.createElement('DIV');
this.i_notification.className="LayoutManager_notification";
this.i_notification.style.width=LayoutManager.notificationWidth+"px";
this.i_notification.style.height=LayoutManager.notificationHeight+"px";
this.i_notification_pad_top=document.createElement('DIV');
this.i_notification_pad_top.className="LayoutManager_notification_pad_top";
this.i_notification_pad_top.style.width=LayoutManager.notificationWidth+"px";
this.i_notification_pad_top.style.height=LayoutManager.notificationPadding+"px";
this.i_notification_pad_top.innerHTML="&nbsp;";
this.i_notification.appendChild(this.i_notification_pad_top);
this.i_notification_pad_left=document.createElement('DIV');
this.i_notification_pad_left.className="LayoutManager_notification_pad_left";
this.i_notification_pad_left.style.width=LayoutManager.notificationPadding+"px";
this.i_notification_pad_left.style.height=LayoutManager.notificationHeight+"px";
this.i_notification_pad_left.innerHTML="&nbsp;";
this.i_notification.appendChild(this.i_notification_pad_left);
this.i_notification_top=document.createElement('DIV');
this.i_notification_top.className="LayoutManager_notification_top";
this.i_notification_top.style.width=(LayoutManager.notificationWidth - (LayoutManager.notificationPadding * 2))+"px";
this.i_notification.appendChild(this.i_notification_top);
this.i_notification_icon=document.createElement('DIV');
this.i_notification_icon.className="LayoutManager_notification_icon";
this.i_notification_icon.style.width=LayoutManager.notificationIconWidth+"px";
this.i_notification_icon.style.height=LayoutManager.notificationIconHeight+"px";
this.i_notification_top.appendChild(this.i_notification_icon);
this.i_notification_text=document.createElement('DIV');
this.i_notification_text.className="LayoutManager_notification_message";
var w=(LayoutManager.notificationWidth - LayoutManager.notificationIconWidth - (LayoutManager.notificationPadding * 2) - LayoutManager.iconPadding);
this.i_notification_text.style.width=w+"px";
var txd=TextDimension(LayoutManager.notificationMessage, "LayoutManager_notification_message_adjust", w);
this.i_notification_text.style.height=txd.height+"px";
this.i_notification_text.innerHTML=LayoutManager.notificationMessage;
this.i_notification_top.appendChild(this.i_notification_text);
this.i_notification_top.style.height=txd.height+"px";
this.i_notification_bpad=document.createElement('DIV');
this.i_notification_bpad.className="LayoutManager_notification_button_pad";
this.i_notification_bpad.style.width=(LayoutManager.notificationWidth - (LayoutManager.notificationPadding * 2))-20+"px";
this.i_notification_bpad.style.height=Math.floor((LayoutManager.notificationHeight - txd.height - (LayoutManager.notificationPadding * 2) - LayoutManager.notificationButtonHeight) / 2)+"px";
this.i_notification_bpad.innerHTML="&nbsp;";
this.i_notification.appendChild(this.i_notification_bpad);
this.i_notification_buttons=document.createElement('DIV');
this.i_notification_buttons.className="LayoutManager_notification_buttons";
this.i_notification_buttons.style.width=(LayoutManager.notificationWidth - (LayoutManager.notificationPadding * 2))+"px";
this.i_notification_buttons.style.height=LayoutManager.notificationButtonHeight+"px";
this.i_notification.appendChild(this.i_notification_buttons);
this.i_notification_no_check=document.createElement('DIV');
this.i_notification_no_check.className="LayoutManager_notification_check";
this.i_notification_no_check.style.display="none";
var txd1=TextDimension("Save As...", LayoutManager.notificationOptionText);
var txd2=TextDimension("No", LayoutManager.notificationOptionText);
this.i_notification_no_check.style.width="20px";
this.i_notification_no_check.style.height=LayoutManager.notificationButtonHeight+"px";
this.i_notification_buttons.appendChild(this.i_notification_no_check);
this.i_notification_check=document.createElement('DIV');
this.i_notification_check.className="LayoutManager_notification_check";
var txd=TextDimension(LayoutManager.notificationOptionText, "LayoutManager_notification_option_adjust");
this.i_notification_check.style.width=(txd.width+20)+"px";
this.i_notification_check.style.height=LayoutManager.notificationButtonHeight+"px";
this.i_notification_buttons.appendChild(this.i_notification_check);
this.i_notification_input=document.createElement('INPUT');
this.i_notification_input.className="LayoutManager_notification_input";
this.i_notification_input.type="checkbox";
this.i_notification_input.style.top=Math.floor((LayoutManager.notificationButtonHeight - 20) / 2)+"px";
this.i_notification_check.appendChild(this.i_notification_input);
this.i_notification_option=document.createElement('DIV');
this.i_notification_option.className="LayoutManager_notification_option";
this.i_notification_option.style.width=txd.width+"px";
this.i_notification_option.style.height=LayoutManager.notificationButtonHeight+"px";
this.i_notification_option.style.lineHeight=LayoutManager.notificationButtonHeight+"px";
this.i_notification_option.innerHTML=LayoutManager.notificationOptionText;
this.i_notification_check.appendChild(this.i_notification_option);
this.i_notification_no=document.createElement('BUTTON');
this.i_notification_no.className="LayoutManager_notification_button";
this.i_notification_no.innerHTML="No";
this.i_notification_no.value="No";
EventHandler.register(this.i_notification_no, "onclick", this.handleNotificationRespond, this);
this.i_notification_buttons.appendChild(this.i_notification_no);
this.i_notification_save_as=document.createElement('BUTTON');
this.i_notification_save_as.className="LayoutManager_notification_button";
this.i_notification_save_as.innerHTML="Save As...";
this.i_notification_save_as.value="Save As...";
EventHandler.register(this.i_notification_save_as, "onclick", this.handleNotificationRespond, this);
this.i_notification_buttons.appendChild(this.i_notification_save_as);
this.i_notification_save=document.createElement('BUTTON');
this.i_notification_save.className="LayoutManager_notification_button";
this.i_notification_save.innerHTML="Save";
this.i_notification_save.value="Save";
EventHandler.register(this.i_notification_save, "onclick", this.handleNotificationRespond, this);
this.i_notification_buttons.appendChild(this.i_notification_save);
}
return this.i_notification;
}
LayoutManager.prototype.notificationVisible=function(state) {
if (state!=undefined) {
if (this.i_notification_visible!=state) {
this.i_notification_visible=state;
if (state) {
var n=this.getNotification();
n.style.left=(CursorMonitor.browserWidth() - LayoutManager.notificationWidth - LayoutManager.notificationWindowPadding)+"px";
n.style.top=(CursorMonitor.browserHeight() - LayoutManager.notificationHeight - LayoutManager.notificationWindowPadding)+"px";
document.body.appendChild(n);
var txd=TextDimension(LayoutManager.notificationOptionText, "LayoutManager_notification_option_adjust");
this.i_notification_input.checked=false;
if (this.activeConfiguration().locked()) {
this.i_notification_save.disabled=true;
this.i_notification_save.className="LayoutManager_notification_button_disabled";
this.i_notification_input.style.display="none";
this.i_notification_option.style.display="none";
this.i_notification_save.style.display="none";
this.i_notification_check.style.display="none";
this.i_notification_no_check.style.display="";
this.i_notification_text.innerHTML="You are currently using the default layout.";
this.i_notification_bpad.innerHTML="Changes made to the default layout cannot be saved.<br>&nbsp;Would you like to create a new layout?";
this.i_notification_bpad.style.height=Math.floor((LayoutManager.notificationHeight - txd.height - (LayoutManager.notificationPadding * 2) - LayoutManager.notificationButtonHeight) / 2)+8+"px";
this.i_notification_save_as.innerHTML="Yes";
this.i_notification_save_as.style.width="60px";
this.i_notification_no.style.width="60px";
} else {
this.i_notification_save.disabled=false;
this.i_notification_save.className="LayoutManager_notification_button";
this.i_notification_input.style.display="";
this.i_notification_option.style.display="";
this.i_notification_save.style.display="";
this.i_notification_check.style.display="";
this.i_notification_no_check.style.display="none";
this.i_notification_text.innerHTML=LayoutManager.notificationMessage;
this.i_notification_bpad.innerHTML="&nbsp;"
this.i_notification_bpad.style.height=Math.floor((LayoutManager.notificationHeight - txd.height - (LayoutManager.notificationPadding * 2) - LayoutManager.notificationButtonHeight) / 2)+"px";
this.i_notification_save_as.innerHTML="Save As...";
this.i_notification_save_as.style.width="60px";
this.i_notification_no.style.width="35px";
}
}
else {
document.body.removeChild(this.getNotification());
}
}
}
return this.i_notification_visible;
}
LayoutManager.prototype.handleAddWidget=function(e) {
SystemCore.widgetManager().show();
}
LayoutManager.prototype.handleDeleteLayout=function(e) {
if (e.dialog.button()=="Yes") {
var dn=new DataNode("configuration");
dn.attribute("name", this.activeConfiguration().name());
var r=new RequestObject("GDSLayout", "remove", dn);
r.conf=this.activeConfiguration();
EventHandler.register(r, "oncomplete", this.handleDeleteComplete, this);
r.execute();
}
}
LayoutManager.prototype.handleDeleteLayoutConfirm=function(e) {
if (this.activeConfiguration()!=undefined) {
if (this.activeConfiguration().locked()) {
DialogManager.alert('You do not have permission to delete this layout', 'Layout Manager');
}
else if (this.activeConfiguration().isDefault()) {
DialogManager.alert('You may not delete the default layout', 'Layout Manager');
}
else {
var d=DialogManager.confirm('Are you sure you want to delete the layout "'+this.activeConfiguration().name()+'"?<BR><font size="1">(Your display will revert to the default layout.)</font>',
'Layout Manager', undefined, Array('Yes', 'No'), undefined, true, 1);
EventHandler.register(d, "onclose", this.handleDeleteLayout, this);
}
}
}
LayoutManager.prototype.handleRenameLayout=function(e) {
this.clearChangeTimer();
this.notificationVisible(false);
if (e.type!="close") {
layout=this.activeConfiguration();
var d=DialogManager.prompt("Please enter a new name for this layout", "Layout Manager", layout.name(), undefined, Array('Save', 'Cancel'), undefined, true);
d.step=1;
EventHandler.register(d, "onclose", this.handleRenameLayout, this);
}
else {	
var name;
var layout;
if (e.dialog.step==1) {
if (e.dialog.button()=="Cancel") {
return true;
}
else {
name=e.dialog.value();
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x].name()==name) {
var d=DialogManager.prompt("A layout already exists by the selected name, and it cant be overwritten.  Please enter a new name for this layout.", "Layout Manager", name, undefined, Array('Save', 'Cancel'), undefined, true);
d.step=1;
EventHandler.register(d, "onclose", this.handleRenameLayout, this);
return true;	
}
}
}
}
if (layout==undefined) {
layout=this.activeConfiguration();
}
this.modified(false);
this.clearChangeTimer();
this.notificationVisible(false);
layout.rename(name);
}
}
LayoutManager.prototype.handleLoadDefaults=function(e) {
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x].isDefault()) { 
this.activeConfiguration(this.i_configurations[x]);
break;
}
}
}
LayoutManager.prototype.handleDeleteComplete=function(e) {
this.removeConfiguration(e.request.conf);
for (var x=0; x < this.i_configurations.length; x++){ 
if (this.i_configurations[x].isDefault()) {
this.activeConfiguration(this.i_configurations[x]);
break;
}
}
return true;
}
LayoutManager.prototype.getContext=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu();
this.i_context_save=this.i_context.addItem(new ContextMenuIconItem("Save Layout"));
this.i_context_save.enabled(this.modified());
EventHandler.register(this.i_context_save, "onclick", this.handleSaveLayout, this);
this.i_context_save_as=this.i_context.addItem(new ContextMenuIconItem("Save Layout As..."));
EventHandler.register(this.i_context_save_as, "onclick", this.handleSaveLayoutAs, this);
this.i_context_delete=this.i_context.addItem(new ContextMenuIconItem("Delete Layout"));
EventHandler.register(this.i_context_delete, "onclick", this.handleDeleteLayoutConfirm, this);
this.i_context_rename=this.i_context.addItem(new ContextMenuIconItem("Rename Layout"));
EventHandler.register(this.i_context_rename, "onclick", this.handleRenameLayout, this);
this.i_context_load_defaults=this.i_context.addItem(new ContextMenuIconItem("Load Defaults"));
EventHandler.register(this.i_context_load_defaults, "onclick", this.handleLoadDefaults, this);
this.i_context.addItem(new ContextMenuDivider());
for (var x=0; x < this.i_configurations.length; x++) {
if (this.i_configurations[x].isDefault()==false) { 
this.i_context.addItem(this.i_configurations[x].getContextItem());
}
}
}
return this.i_context;
}
LayoutManager.prototype.getLayout=function(application_id) {
if (this.i_active_configuration!=undefined) {
for (var x=0; x < this.i_active_configuration.applications().length; x++){ 
if (this.i_active_configuration.i_applications[x].id()==application_id) {
return this.i_active_configuration.i_applications[x];
}
}
}
for (var x=0; x < this.i_configurations.length; x++) { 
if (this.i_configurations[x].isDefault()) {
for (var z=0; z < this.i_configurations[x].i_applications.length; z++){ 
if (this.i_configurations[x].i_applications[z].id()==application_id) {
return this.i_configurations[x].i_applications[z];
}
}
}
}
return undefined;
}
LayoutManager.prototype.getDefaultApplication=function() {
if (this.i_active_configuration!=undefined) {
for (var x=0; x < this.i_active_configuration.applications().length; x++){ 
if (this.i_active_configuration.i_applications[x].dataNode().attribute("default")=="true") {
return this.i_active_configuration.i_applications[x].id();
}
}
}
for (var x=0; x < this.i_configurations.length; x++) { 
if (this.i_configurations[x].isDefault()) {
defaultConfigFound=true;
for (var z=0; z < this.i_configurations[x].i_applications.length; z++){ 
if (this.i_configurations[x].i_applications[z].dataNode().attribute("default")=="true") {
return this.i_configurations[x].i_applications[z].id();
}
}
}
}
return undefined;
}
LayoutManager.prototype.getButtonOrdering=function() {
if (this.i_active_configuration!=undefined) {
if (this.i_active_configuration.buttonOrdering().length > 0) {
return this.i_active_configuration.buttonOrdering();
}
}
for (var x=0; x < this.i_configurations.length; x++) { 
if (this.i_configurations[x].isDefault()) {
return this.i_configurations[x].buttonOrdering();
}
}
return undefined;
}
function LayoutConfiguration(name, isDefault, locked) {
this.i_name=name;
this.i_applications=Array();
this.i_minimize_nav=false;
this.i_locked=(locked!=undefined ? locked : false);
this.i_default=(isDefault==undefined ? false : isDefault);
this.i_global_nodes=Array();
this.i_button_order=Array();
this.i_initialized=true;
}
LayoutConfiguration.prototype.oninitialize=null;
LayoutConfiguration.prototype.initialized=function(state) {
if (state!=undefined) {
this.i_initialized=state;
if (state==true && this.oninitialize!=undefined) {
var o=new Object();
o.type="initialize";
o.config=this;
this.oninitialize(o);
}
}
return this.i_initialized;
}
LayoutConfiguration.prototype.initializeFromServer=function() {
var dn=new DataNode("configuration");
dn.attribute("name", this.name());
var r=new RequestObject("GDSLayout", "read", dn);
EventHandler.register(r, "oncomplete", this.handleInitializeComplete, this);
r.execute();
}
LayoutConfiguration.prototype.handleInitializeComplete=function(e) {
var dn=e.response.data();
this.updateFromDataNode(dn);
this.initialized(true);
}
LayoutConfiguration.prototype.saveToServer=function() {
var dn=new DataNode("configurations");
dn.addNode(this.toDataNode());
var r=new RequestObject("GDSLayout", "write", dn);
EventHandler.register(r, "oncomplete", this.handleSaveComplete, this);
r.execute();
}
LayoutConfiguration.prototype.handleSaveComplete=function(e) {
;
}
LayoutConfiguration.prototype.rename=function(newName) {
var oldname=this.name();
var dnName=new DataNode("oldName",oldname);
this.name(newName);
if (this.i_reset_state!=undefined) {
this.i_reset_state=this.toDataNode();
}
var dn=new DataNode("configurations");
dn.addNode(this.toDataNode());
dn.addNode(dnName);
var r=new RequestObject("GDSLayout", "rename", dn);
r.oldname=oldname;
r.conf=this;
EventHandler.register(r, "oncomplete", this.handleRenameComplete, this);
r.execute();
}
LayoutConfiguration.prototype.handleRenameComplete=function(e) {
SystemCore.layoutManager().activeConfiguration().getContextItem().name(e.request.conf.name());
SystemCore.layoutManager().activeConfiguration().name(e.request.conf.name());
for (var x=0; x < SystemCore.layoutManager().configurations().length; x++) {
if (SystemCore.layoutManager().configurations(x).name()==e.request.oldname) {
SystemCore.layoutManager().configurations(x).name(e.request.conf.name());
break;
}
}
var gen_prefs=Application.getApplicationById('GP');
if (gen_prefs!=undefined) {
if (gen_prefs.param("layout_default")!=e.request.conf.name()) {
gen_prefs.param("layout_default", e.request.conf.name());
}
}
}
LayoutConfiguration.prototype.parent=function() {
return this.i_parent;
}
LayoutConfiguration.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
}
return this.i_name;
}
LayoutConfiguration.prototype.buttonOrdering=function(order) {
if (order!=undefined) {
this.i_button_order=order;
}
return this.i_button_order;
}
LayoutConfiguration.prototype.locked=function(locked) {
if (locked!=undefined) {
this.i_locked=locked;
}
return this.i_locked;
}
LayoutConfiguration.prototype.globalPods=function(nodes) {
if (nodes!=undefined) {
this.i_global_nodes=nodes;
}
return this.i_global_nodes;
}
LayoutConfiguration.prototype.isDefault=function(state) {
if (state!=undefined) {
this.i_default=state;
if (state==true) {
if (this.i_parent!=undefined) {
for (var x=0; x < this.i_parent.i_configurations.length; x++) {
if (this.i_parent.i_configurations[x]!=this) {
this.i_parent.i_configurations[x].isDefault(false);
}
}
}
}
}
return this.i_default;
}
LayoutConfiguration.prototype.reset=function() {
if (this.i_reset_state!=undefined) {
this.updateFromDataNode(this.i_reset_state);
}
}
LayoutConfiguration.prototype.updateReset=function() {
this.i_reset_state=this.toDataNode();
}
LayoutConfiguration.prototype.minimizedNavigation=function(state) {
if (state!=undefined) {
this.i_minimized_nav=state;
}
return this.i_minimized_nav;
}
LayoutConfiguration.prototype.applications=function(index) {
if (index!=undefined) {
return this.i_applications[index];
}
return this.i_applications;
}
LayoutConfiguration.prototype.addApplication=function(application, beforeApplication) {
var append=true;
application.i_parent=this;
if (beforeApplication!=undefined) {
for (var x=0; x < this.i_applications.length; x++) {
if (this.i_applications[x]==beforeApplication) {
this.i_applications.splice(x, 0, application);
append=false;
break;
}
}
}
if (append) {
this.i_applications[this.i_applications.length]=application;
}
return application;
}
LayoutConfiguration.prototype.removeApplication=function(application) {
for (var x=0; x < this.i_applications.length; x++) {
if (this.i_applications[x]==application) {
this.i_applications.splice(x, 1);
return true;
}
}
return false;
}
LayoutConfiguration.prototype.handleSelectRespond=function(e) {
if (e.dialog.button()=="Cancel") {
this.parent().notifyChange();
} else {
if (e.dialog.button()=="Yes") {
var o=new Object();
o.type="save";
this.parent().handleSaveLayout(o);
}
this.reset();
this.parent().activeConfiguration(this);
}
}
LayoutConfiguration.prototype.handleSelect=function(e) {
if (this.parent().modified()) {
this.parent().clearChangeTimer();
this.parent().notificationVisible(false);
if (this.parent().autoSave()==2) {
var o=new Object();
o.type="save";
this.parent().handleSaveLayout(o);
} else {
var d=DialogManager.confirm('Some changes to your current layout have not been saved.  Do you want to save them now?', "Layout Manager", undefined, Array('Yes', 'No', 'Cancel'), undefined, true);
EventHandler.register(d, "onclose", this.handleSelectRespond, this);
return true;
}
}
this.reset();
this.parent().activeConfiguration(this);
}
LayoutConfiguration.prototype.getContextItem=function() {
if (this.i_context_item==undefined) {
this.i_context_item=new ContextMenuBoolean(this.name(), (this.parent().activeConfiguration()==this ? true : false));
EventHandler.register(this.i_context_item, "onclick", this.handleSelect, this);
}
return this.i_context_item;
}
LayoutConfiguration.prototype.updateFromDataNode=function(data) {
this.name(data.attribute("name"));
this.minimizedNavigation(data.attribute("nav")=="minimized" ? true : false);
this.isDefault(data.attribute("default")=="true" ? true : false);
this.locked(data.attribute("locked")=="true" ? true : false);
var buttons=data.children("button");
this.i_button_order=Array();
for (var x=0; x < buttons.length; x++){ 
this.i_button_order[x]=buttons[x].attribute("id");
}
var globals=data.children("pod");
this.i_global_nodes=Array();
for (var x=0; x < globals.length; x++){ 
this.i_global_nodes[x]=globals[x];
}
var apps=data.children("application");
for (var x=0; x < apps.length; x++){ 
var foundApp=false;
for (var z=0; z < this.i_applications.length; z++){ 
if (this.i_applications[z].id()==apps[x].attribute("id")) {
foundApp=true;
this.i_applications[z].dataNode(apps[x]);
}
}
if (!foundApp) {
var a=this.addApplication(new LayoutApplication(apps[x].attribute("id")));
if (apps[x].attribute("default")=="true")
a.defaultApp(true);
a.dataNode(apps[x]);
}
}
this.updateReset();
}
LayoutConfiguration.fromDataNode=function(dataNode) {
if (typeof dataNode=="string") {
dataNode=DataNode.fromString(dataNode);
if (dataNode==undefined) {
return false;
}
}
var c=new LayoutConfiguration(dataNode.attribute("name"));
c.updateFromDataNode(dataNode);
return c;
}
LayoutConfiguration.prototype.toDataNode=function() {
var conf=new DataNode("configuration");
conf.attribute("name", this.name());
conf.attribute("nav", (this.minimizedNavigation()==true ? "minimized" : "normal"));
conf.attribute("default", (this.isDefault() ? "true" : "false"));
conf.attribute("locked", (this.locked() ? "true" : "false"));
for (var x=0; x < this.i_button_order.length; x++) {
var dn=new DataNode("button");
dn.attribute("id", this.i_button_order[x]);
conf.addNode(dn);
}
for (var x=0; x < this.i_global_nodes.length; x++) {
conf.addNode(this.i_global_nodes[x]);
}
for (var x=0; x < this.i_applications.length; x++) {
conf.addNode(this.i_applications[x].dataNode());
}
return conf;
}
function LayoutApplication(id) {
this.i_id=id;
this.i_defaultApp=false;
}
LayoutApplication.prototype.parent=function() {
return this.i_parent;
}
LayoutApplication.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
LayoutApplication.prototype.defaultApp=function(defaultApp) {
if (defaultApp!=undefined) {
this.i_defaultApp=defaultApp;
}
return this.i_defaultApp;
}
LayoutApplication.prototype.dataNode=function(dataNode) {
if (dataNode!=undefined) {
this.i_dataNode=dataNode;
dataNode.attribute("id", this.id());
if (this.i_defaultApp==true)
dataNode.attribute("default", "true");
}
return this.i_dataNode;
}
JavaScriptResource.notifyComplete("./lib/controllers/Controller.Layout.js");
function PreferenceNavigation(width, height) {
this.i_width=width;
this.i_height=height;
this.i_sections=[];
}
PreferenceNavigation.prototype.width=function(width) {
if(width!=undefined) {
this.i_width=width;
this.updateElementWidth();
}
return this.i_width;
}
PreferenceNavigation.prototype.height=function(height) {
if(height!=undefined) {
this.i_height=height;
this.updateElementHeight();
}
return this.i_height;
}
PreferenceNavigation.prototype.addSection=function(section, before_section) {
var append=true;
if(before_section) {
for(var i=0; i < this.i_sections.length; i++) {
if(this.i_sections[i]==before_section) {
this.i_sections.splice(i, 0, section);
if(this.i_element) {
this.i_element.insertBefore(section.element(), before_section.element());
}
append=false;
break;
}
}
}
if(append) {
this.i_sections.push(section);
if(this.i_element) {
this.i_element.appendChild(section.element());
}
}
}
PreferenceNavigation.prototype.removeSection=function(section) {
for(var i=0; i < this.i_sections.length; i++) {
if(this.i_sections[i]==section) {
this.i_sections.splice(i, 1);
break;
}
}
if(this.i_element) {
try {
this.i_element.removeChild(section.element());
} catch(e) {
}
}
}
PreferenceNavigation.prototype.element=function() {
if(!this.i_element) {
this.i_element=document.createElement("div");
this.i_element.className="PreferenceNavigation";
for(var i=0; i < this.i_sections; i++) {
this.i_element.appendChild(this.i_sections[i].element());
}
this.updateElementHeight();
this.updateElementWidth();
}
return this.i_element;
}
PreferenceNavigation.prototype.updateElementHeight=function() {
if(this.i_element) {
this.i_element.style.height=this.height()+"px";
}
}
PreferenceNavigation.prototype.updateElementWidth=function() {
if(this.i_element) {
this.i_element.style.width=this.width()+"px";
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.PreferenceNavigation.js");
function PreferenceNavigationNode(name) {
this.i_name=name;
this.i_css_classes=[];
this.i_name_css_classes=[];
}
PreferenceNavigationNode.prototype.name=function(name) {
if(name!=undefined) {
this.i_name=name;
this.updateNameElementName();
}
return this.i_name;
}
PreferenceNavigationNode.prototype.element=function() {
if(!this.i_element) {
this.i_element=document.createElement("div");
this.i_name_element=document.createElement("div");
this.i_element.appendChild(this.i_name_element);
EventHandler.register(this.i_element, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_element, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_element, "onclick", this.handleClick, this);
this.updateElementCssClasses();
this.updateNameElementName();
this.updateNameElementCssClasses();
}
return this.i_element;
}
PreferenceNavigationNode.prototype.handleMouseOver=function(e) {
this.replaceCssClass("LiteTreeNode", "LiteTreeNode_hover");
}
PreferenceNavigationNode.prototype.handleMouseOut=function(e) {
this.replaceCssClass("LiteTreeNode_hover", "LiteTreeNode");
}
PreferenceNavigationNode.prototype.handleClick=function(e) {
if(this.onclick) {
var o={
"type": "click"
};
this.onclick(o);
}
}
PreferenceNavigationNode.prototype.addCssClass=function(class_name, suppress_set_css) {
if(class_name) {
this.i_css_classes.push(class_name);
if(!suppress_set_css) {
this.updateElementCssClasses();
}
}
}
PreferenceNavigationNode.prototype.removeCssClass=function(class_name, suppress_set_css) {
if(class_name) {
for(var i=this.i_css_classes.length; i >=0; i--) {
if(this.i_css_classes[i]==class_name) {
this.i_css_classes.splice(i, 1);
}
}
if(!suppress_set_css) {
this.updateElementCssClasses();
}
}
}
PreferenceNavigationNode.prototype.replaceCssClass=function(old_class_name, new_class_name) {
this.removeCssClass(old_class_name, true);
this.addCssClass(new_class_name);
}
PreferenceNavigationNode.prototype.addNameCssClass=function(class_name, suppress_set_css) {
if(class_name) {
this.i_name_css_classes.push(class_name);
if(!suppress_set_css) {
this.updateNameElementCssClasses();
}
}
}
PreferenceNavigationNode.prototype.removeNameCssClass=function(class_name, suppress_set_css) {
if(class_name) {
for(var i=this.i_name_css_classes.length; i >=0; i--) {
if(this.i_name_css_classes[i]==class_name) {
this.i_name_css_classes.splice(i, 1);
}
}
if(!suppress_set_css) {
this.updateNameElementCssClasses();
}
}
}
PreferenceNavigationNode.prototype.replaceNameCssClass=function(old_class_name, new_class_name) {
this.removeNameCssClass(old_class_name, true);
this.addNameCssClass(new_class_name);
}
PreferenceNavigationNode.prototype.updateElementCssClasses=function() {
if(this.i_element) {
var classes="PreferenceNavigationNode";
classes+=" "+this.i_css_classes.join(" ");
this.i_element.className=classes;
}
}
PreferenceNavigationNode.prototype.updateNameElementCssClasses=function() {
if(this.i_name_element) {
var classes="PreferenceNavigationNode_name";
classes+=" "+this.i_name_css_classes.join(" ");
this.i_name_element.className=classes;
}
}
PreferenceNavigationNode.prototype.updateNameElementName=function() {
if(this.i_name_element) {
this.i_name_element.innerHTML=(this.i_name) ? this.i_name : "";
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.PreferenceNavigationNode.js");
function PreferenceNavigationSection(name, icon_class) {
this.i_name=name;
this.i_icon_class=icon_class;
this.i_panes=[];
}
PreferenceNavigationSection.prototype.name=function(name) {
if(name!=undefined) {
this.i_name=name;
this.updateNodeName();
}
return this.i_name;
}
PreferenceNavigationSection.prototype.iconClass=function(icon_class) {
if(icon_class!=undefined) {
if(this.i_node) {
this.i_node.replaceNameCssClass(this.i_icon_class, icon_class);
}
this.i_icon_class=icon_class;
}
return this.i_icon_class;
}
PreferenceNavigationSection.prototype.addPane=function(pane, before_pane) {
var append=true;
if(before_pane) {
for(var i=0; i < this.i_panes.length; i++) {
if(this.i_panes[i]==before_pane) {
this.i_panes.splice(i, 0, pane);
if(this.i_panes_element) {
this.i_panes_element.insertBefore(pane.node().element(), before_pane.node().element());
}
append=false;
break;
}
}
}
if(append) {
this.i_panes.push(pane);
if(this.i_element) {
this.i_panes_element.appendChild(pane.node().element());
}
}
}
PreferenceNavigationSection.prototype.removePane=function(pane) {
for(var i=0; i < this.i_panes.length; i++) {
if(this.i_panes[i]==pane) {
this.i_panes.splice(i, 1);
break;
}
}
if(this.i_panes_element) {
try {
this.i_panes_element.removeChild(pane.node().element());
} catch(e) {
}
}
}
PreferenceNavigationSection.prototype.element=function() {
if(!this.i_element) {
this.i_element=document.createElement("div");
this.i_element.className="PreferenceNavigationSection";
this.i_element.appendChild(this.node().element());
this.i_element.appendChild(this.panesElement());
}
return this.i_element;
}
PreferenceNavigationSection.prototype.panesElement=function() {
if(!this.i_panes_element) {
this.i_panes_element=document.createElement("div");
this.i_panes_element.className="PreferenceNavigationSection_panes";
for(var i=0; i < this.i_panes.length; i++) {
this.i_panes_element.appendChild(this.i_panes[i].node().element());
}
}
return this.i_panes_element;
}
PreferenceNavigationSection.prototype.node=function() {
if(!this.i_node) {
this.i_node=new PreferenceNavigationNode(this.i_name);
this.i_node.addCssClass("PreferenceNavigationSection_node");
this.i_node.addNameCssClass("PreferenceNavigationSection_name");
EventHandler.register(this.i_node, "onclick", this.handleClick, this);
this.i_node.addNameCssClass(this.i_icon_class);
}
return this.i_node;
}
PreferenceNavigationSection.prototype.handleClick=function() {
if(this.onclick) {
var o={
"type": "click"
};
this.onclick(o);
}
}
PreferenceNavigationSection.prototype.updateNodeName=function() {
if(this.i_node) {
this.i_node.name(this.i_name);
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.PreferenceNavigationSection.js");
function PreferenceNavigationPane(name) {
this.i_name=name;
}
PreferenceNavigationPane.prototype.name=function(name) {
if(name!=undefined) {
this.i_name=name;
this.updateNodeName();
if(this.i_node) {
this.i_node.name(name);
}
}
return this.i_name;
}
PreferenceNavigationPane.prototype.node=function() {
if(!this.i_node) {
this.i_node=new PreferenceNavigationNode(this.i_name);
this.i_node.addCssClass("PreferenceNavigationPane_node");
this.i_node.addNameCssClass("PreferenceNavigationPane_name");
EventHandler.register(this.i_node, "onclick", this.handleClick, this);
}
return this.i_node;
}
PreferenceNavigationPane.prototype.handleClick=function() {
if(this.onclick) {
var o={
"type": "click"
};
this.onclick(o);
}
}
PreferenceNavigationPane.prototype.updateNodeName=function() {
if(this.i_node) {
this.i_node.name(this.i_name);
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.PreferenceNavigationPane.js");
function OldPreferenceManager(width, height) {
this.i_width=width;
this.i_height=height;
this.i_sections=Array();
this.i_down_arrow=false;
this.i_up_arrow=false;
this.i_position=0;
this.i_save_requests=[];
this.i_save_invalid_panes=[];
this.i_content=document.createElement('DIV');
this.i_loading=document.createElement('DIV');
OldPreferenceManager.obj=this;
}
OldPreferenceManager.defaultWidth=710;
OldPreferenceManager.defaultHeight=500;
OldPreferenceManager.minimumWidth=710;
OldPreferenceManager.minimumHeight=250;
OldPreferenceManager.menuWidth=180;
OldPreferenceManager.contentVerticalPadding=7;
OldPreferenceManager.contentHorizontalPadding=14;
OldPreferenceManager.windowMargin=3;
OldPreferenceManager.dividerWidth=7;
OldPreferenceManager.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_manager!=undefined) {
this.i_manager.style.height=height+"px";
this.navigation().height(this.contentHeight());
this.i_divider.style.height=this.contentHeight()+"px";
this.i_content_wrapper.style.height=this.contentHeight()+"px";
}
for (var x=0; x < this.i_sections.length; x++) {
for (var z=0; z < this.i_sections[x].i_panes.length; z++){ 
this.i_sections[x].i_panes[z].height(this.paneHeight());
}
}
}
return this.i_height;
}
OldPreferenceManager.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_manager!=undefined) {
this.i_manager.style.width=width+"px";
this.i_tools.width(width);
this.i_content_wrapper.style.width=this.contentWidth()+"px";
}
if(this.activePane()) {
this.activePane().width(this.paneWidth());
}
}
return this.i_width;
}
OldPreferenceManager.prototype.contentHeight=function(width) {
if(this.i_tools!=undefined) {
return this.height() - this.i_tools.height();
} else {
return this.height();
}
}
OldPreferenceManager.prototype.contentWidth=function(width) {
return this.width() - this.navigation().width() - OldPreferenceManager.dividerWidth;
}
OldPreferenceManager.prototype.paneHeight=function(width) {
return this.contentHeight() - (OldPreferenceManager.contentVerticalPadding * 2);
}
OldPreferenceManager.prototype.paneWidth=function(width) {
return this.contentWidth() - (OldPreferenceManager.contentHorizontalPadding * 2);
}
OldPreferenceManager.prototype.reset=function() {
for (var x=0; x < this.i_sections.length; x++) {
this.i_sections[x].reset();
}
}
OldPreferenceManager.prototype.isModified=function() {
var d=false;
for (var x=0; x < this.i_sections.length; x++) {
if (this.i_sections[x].isModified()) {
d=true;			
}
}
return d;
}	
OldPreferenceManager.prototype.updateDefault=function() {
for (var x=0; x < this.i_sections.length; x++) {
for (var z=0; z < this.i_sections[x].i_panes.length; z++) {
if (this.i_sections[x].i_panes[z].updateDefault!=undefined) {
this.i_sections[x].i_panes[z].updateDefault();
}
}
}
}
OldPreferenceManager.prototype.sections=function(index) {
if (index!=undefined) {
return this.i_sections[index];
}
return this.i_sections;
}
OldPreferenceManager.prototype.addSection=function(section, beforeSection) {
section.i_parent=this;
if(this.i_sections.length==0) {
section.isDefault(true);
}
var append=true;
if (beforeSection!=undefined) {
for (var x=0; x < this.i_sections.length; x++) {
if (this.i_sections[x]==beforeSection) {
this.i_sections.splice(x, 0, section);
this.navigation().addSection(section.navigation(), beforeSection.navigation());
append=false;
break;
}
}
}
if (append) {
this.i_sections[this.i_sections.length]=section;
this.navigation().addSection(section.navigation());
}
for (var z=0; z < section.i_panes.length; z++){ 
section.i_panes[z].height(this.paneHeight());
section.i_panes[z].width(this.paneWidth());
}
if (this.activeSection()==undefined) {
this.activeSection(section);
}
return section;
}
OldPreferenceManager.prototype.removeSection=function(section) {
for (var x=0; x < this.i_sections.length; x++) {
if (this.i_sections[x]==section) {
this.i_sections.splice(x, 1);
this.navigation().removeSection(section.navigation());
return true;
}
}
return false;
}
OldPreferenceManager.prototype.activeSection=function(section) {
if (section!=undefined) {
if (section===false) {
section=undefined;
}
if (this.i_active!=section) {
if (this.i_active!=undefined) {
this.i_active.navigation().node().removeCssClass("PreferenceNavigationSection_active");
var a=this.i_active;
this.i_active=undefined;
a.active(false);
}
this.i_active=section;
if (this.i_active!=undefined) {
this.i_active.navigation().node().addCssClass("PreferenceNavigationSection_active");
this.i_active.active(true);
}
}
}
return this.i_active;
}
OldPreferenceManager.prototype.activePane=function(pane) {
if(pane!=undefined) {
if(pane===false) {
pane=undefined;
}
if(this.i_active_pane!=pane) {
if(this.i_active_pane) {
this.i_active_pane.navigation().node().removeCssClass("PreferenceNavigationPane_active");
}
this.i_active_pane=pane;
if(this.i_active_pane) {
this.i_active_pane.navigation().node().addCssClass("PreferenceNavigationPane_active");
}
}
}
return this.i_active_pane;
}
OldPreferenceManager.prototype.customLoadPane=function(custom_load_pane) {
if(custom_load_pane!=undefined) {
this.i_custom_load_pane=custom_load_pane;
}
return this.i_custom_load_pane;
}
OldPreferenceManager.prototype.handleResize=function(e) {
var h=this.i_window.effectiveHeight() - this.i_window.titleBar().height() - OldPreferenceManager.windowMargin;
var w=this.i_window.effectiveWidth() - OldPreferenceManager.windowMargin;
this.height(h);
this.width(w);
}
OldPreferenceManager.prototype.handleClose=function(e) {
if (this.isModified()) {
var d=DialogManager.confirm("Would you like to save your changes before closing?", "Save Changes", undefined, Array("Yes", "No", "Cancel"), false, true);
EventHandler.register(d, "onclose", this.handleCloseConfirm, this);
d.show();
e.cancelClose=true;
return false;
}
else {
this.reset();
this.hideActivePane();
}
}
OldPreferenceManager.prototype.handleCloseConfirm=function(e) {
if (e.button=="Yes") {
e.cancelSave=false;
this.save(e);
}
else if (e.button=="No") {
this.reset();
this.close();
}
}
OldPreferenceManager.handleSave=function(e) {
e.cancelSave=false;
OldPreferenceManager.obj.save(e);
}
OldPreferenceManager.handleCancel=function(e) {
OldPreferenceManager.obj.getWindow().close();
}
OldPreferenceManager.prototype.open=function() {
this.getWindow().popWindow(OldPreferenceManager.defaultWidth, OldPreferenceManager.defaultHeight, true);
this.loading(true);
}
OldPreferenceManager.prototype.finishOpen=function() {
if(this.customLoadPane()) {
this.customLoadPane().show();
this.customLoadPane(false);
} else if(this.defaultSection() && this.defaultSection().defaultPane()) {
this.defaultSection().defaultPane().show();
}
}
OldPreferenceManager.prototype.close=function() {
this.getWindow().close(undefined, true);
this.hideActivePane();
}
OldPreferenceManager.prototype.hideActivePane=function() {
this.loadContent(false);
if(this.activePane()) {
this.activePane().hide();
}
this.activeSection(false);
this.activePane(false);
}
OldPreferenceManager.prototype.save=function(e) {
this.saving(true);
var invalid_panes=[];
for(var i=0; i < this.i_sections.length; i++) {
for(var j=0; j < this.i_sections[i].i_panes.length; j++){ 
var pane=this.i_sections[i].i_panes[j];
if(pane.isModified()) {
if(pane.validate()) {
if(invalid_panes.length==0 && pane.save) {
var save_requests=pane.save();
if(save_requests) {
if(save_requests.splice==undefined) {
save_requests=[save_requests];
}
for(var k=0; k < save_requests.length; k++) {
var request=save_requests[k];
request.pane=pane;
this.i_save_requests.push(request);
EventHandler.register(request, "oncomplete", this.handleSaveRequestReturn, this);
EventHandler.register(request, "onerror", this.handleSaveRequestReturn, this);
}
}
}
} else {
invalid_panes.push(pane.name());
}
} else {
pane.clearErrors();
}
}
}
if(invalid_panes.length==0) {
if(this.i_save_requests.length > 0) {
APIManager.addQueue(this.i_save_requests);
APIManager.executeQueue();
} else {
this.saving(false);
this.close();
}
} else {
this.saving(false);
if(this.activePane() && this.activePane().getForm && this.activePane().getForm()) {
this.activePane().getForm().updateHeight();
}
e.cancelSave=true;
var message="Some of your input is invalid. Please identify and fix any problems in the highlighted preference panes.";
DialogManager.alert(message, "Preference Manager", undefined, true, true);
}
}
OldPreferenceManager.prototype.handleSaveRequestReturn=function(e) {
for(var i=this.i_save_requests.length; i >=0; i--) {
var request=e.request;
if(this.i_save_requests[i]==request) {
var response=e.response;
var pane=request.pane;
if(response.status().success()) {
if(pane.updateDefault) {
pane.updateDefault();
}
if(pane.application && pane.application()) {
var application=pane.application();
if(application.onpreferencesupdate) {
var data=response.data();
var o={
"type": "preferencesupdate",
"pane": pane,
"response": response,
"data": data,
"application": data.attribute("application"),
"method": data.attribute("method")
}
application.onpreferencesupdate(o);
}
}
} else {
if(pane && pane.getForm) {
this.i_save_invalid_panes.push(pane.name());
pane.addErrorMessage("An error occurred while saving this form. Please try again later.");
pane.displayErrors();
}
}
this.i_save_requests.splice(i, 1);
if(this.i_save_requests.length==0) {
this.saving(false);
if(this.i_save_invalid_panes.length==0) {
this.close();
} else {
var message="An error occurred while saving your preferences. See the highlighted preference panes for more information.";
DialogManager.alert(message, "Preference Manager", undefined, true, true);
}
}
break;
}
}
}
OldPreferenceManager.prototype.getWindow=function() {
if (this.i_window==undefined) {
this.i_window=new WindowObject('prefs', 'Preference Manager', this.width(), this.height(), Application.titleBarFactory());
this.i_window.minimumWidth(OldPreferenceManager.minimumWidth);
this.i_window.minimumHeight(OldPreferenceManager.minimumHeight);
this.i_window.effectiveWidth(this.width());
this.i_window.effectiveHeight(this.height());
this.i_window.temporary(true);
this.i_window.global(true);
this.i_window.titleBar().removeButton(Application.i_title_dock);
EventHandler.register(this.i_window, "oncontentresize", this.handleResize, this);
EventHandler.register(this.i_window, "onclose", this.handleClose, this);
this.i_window.loadContent(this.getManager());
}
return this.i_window;
}
OldPreferenceManager.prototype.navigation=function() {
if(!this.i_navigation) {
this.i_navigation=new PreferenceNavigation(OldPreferenceManager.menuWidth, this.contentHeight());
}
return this.i_navigation;
}
OldPreferenceManager.prototype.toolBar=function() {
if (this.i_tools==undefined) {
this.i_tools=new ToolBar(100);
this.i_tools.addItem(new ToolBarButton(new IconLabelButton("Save", "ToolBar_icon_save", 16, 16, 55, 17, "Save changes to the preferences", OldPreferenceManager.handleSave)));
this.i_tools.addItem(new ToolBarButton(new IconLabelButton("Cancel", "ToolBar_icon_cancel", 16, 16, 60, 17, "Cancel changes", OldPreferenceManager.handleCancel)));
}
return this.i_tools;
}
OldPreferenceManager.prototype.loadContent=function(content) {
if (content!=undefined) {
if (content==false) {
content=undefined;
}
if (this.i_content_obj!=undefined && this.i_content!=undefined) {
this.i_content.removeChild(this.i_content_obj);
}
this.i_content_obj=content;
if (this.i_content_obj!=undefined) {
this.i_content.appendChild(this.i_content_obj);
}
}
return this.i_content_obj;
}
OldPreferenceManager.prototype.getManager=function() {
if (this.i_manager==undefined) {
this.i_manager=document.createElement('DIV');
this.i_manager.className="PreferenceManager";
this.i_manager.style.width=(this.i_window.effectiveWidth() - OldPreferenceManager.windowMargin)+"px";
this.i_manager.style.height=(this.i_window.effectiveHeight() - this.i_window.titleBar().height() - OldPreferenceManager.windowMargin)+"px";
this.i_manager.appendChild(this.toolBar().getBar());
this.i_manager.appendChild(this.navigation().element());
this.i_divider=document.createElement('DIV');
this.i_divider.className="PreferenceManager_divider";
this.i_divider.style.height=this.height()+"px";
this.i_divider.style.width=OldPreferenceManager.dividerWidth+"px";
this.i_divider.innerHTML="&nbsp;";
this.i_manager.appendChild(this.i_divider);
this.i_content_wrapper=document.createElement('DIV');
this.i_content_wrapper.className="PreferenceManager_content";
this.i_content_wrapper.style.height=this.height()+"px";
this.i_content_wrapper.style.paddingTop=OldPreferenceManager.contentVerticalPadding+"px";
this.i_content_wrapper.style.paddingBottom=OldPreferenceManager.contentVerticalPadding+"px";
this.i_content_wrapper.style.paddingLeft=OldPreferenceManager.contentHorizontalPadding+"px";
this.i_content_wrapper.style.paddingRight=OldPreferenceManager.contentHorizontalPadding+"px";
this.i_content_wrapper.appendChild(this.i_content);
this.i_loading.style.display="none";
this.i_loading.innerHTML="Loading...";
this.i_content_wrapper.appendChild(this.i_loading);
this.i_saving=document.createElement('DIV');
this.i_saving.style.display="none";
this.i_saving.innerHTML="Saving...";
this.i_content_wrapper.appendChild(this.i_saving);
this.i_manager.appendChild(this.i_content_wrapper);
this.handleResize();
}
return this.i_manager;
}
OldPreferenceManager.prototype.defaultSection=function() {
if(!this.i_default_section) {
for(var i=0; i < this.i_sections.length; i++) {
if(this.i_sections[i].isDefault()) {
this.i_default_section=this.i_sections[i];
break;
}
}
}
return this.i_default_section;
}
OldPreferenceManager.prototype.loading=function(loading) {
if(loading) {
this.i_content.style.display="none";
this.i_loading.style.display="block";
} else {
this.i_loading.style.display="none";
this.i_content.style.display="block";
if(this.activePane().onresize) {
var o=new Object();
o.type="resize";
o.pane=this.activePane();
this.activePane().onresize(o);
}
}
}
OldPreferenceManager.prototype.saving=function(saving) {
if(saving) {
this.i_content.style.display="none";
this.i_saving.style.display="block";
} else {
this.i_saving.style.display="none";
this.i_content.style.display="block";
}
}
function PreferenceSection(name, description, iconClass) {
this.i_is_default=false;
this.i_name=name;
this.i_description=description;
this.i_icon=iconClass;
this.i_panes=Array();
this.i_hover_state=false;
this.i_visible=true;
}
PreferenceSection.prototype.parent=function() {
return this.i_parent;
}
PreferenceSection.prototype.manager=function() {
return this.parent();
}
PreferenceSection.prototype.isDefault=function(is_default) {
if(is_default!=undefined) {
this.i_is_default=is_default;
if(this.manager()) {
this.manager().i_default_section=undefined;
}
}
return this.i_is_default;
}
PreferenceSection.prototype.defaultPane=function() {
if(!this.i_default_pane) {
for(var i=0; i < this.i_panes.length; i++) {
if(this.i_panes[i].isDefault()) {
this.i_default_pane=this.i_panes[i];
break;
}
}
}
return this.i_default_pane;
}
PreferenceSection.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if(this.i_navigation) {
this.i_navigation.name(name);
}
}
return this.i_name;
}
PreferenceSection.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
}
return this.i_description;
}
PreferenceSection.prototype.isModified=function() {
var d=false;
for (var x=0; x < this.i_panes.length; x++) {
if (this.i_panes[x].isModified!=undefined) {
if (this.i_panes[x].isModified()) {
d=true;
}
}
}
return d;
}
PreferenceSection.prototype.reset=function() {
for (var x=0; x < this.i_panes.length; x++) {
if (this.i_panes[x].reset!=undefined) {
this.i_panes[x].reset();
this.i_panes[x].clearErrors();
}
}
}
PreferenceSection.prototype.active=function(state) {
if (this.parent()!=undefined && state!=undefined) {
if (state) {
if (this.parent().activeSection()!=this) {
this.parent().activeSection(this);
}
}
else {
if (this.parent().activeSection()==this) {
this.parent().activeSection(false);
}
}
}
return (this.parent().activeSection()==this);
}
PreferenceSection.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined) {
this.i_icon=iconClass;
if(this.i_navigation) {
this.i_navigation.iconClass(iconClass);
}
}
return this.i_icon;
}
PreferenceSection.prototype.panes=function(index) {
if (index!=undefined) {
return this.i_panes[index];
}
return this.i_panes;
}
PreferenceSection.prototype.addPane=function(pane, beforePane) {
pane.i_parent=this;
if(this.i_panes.length==0) {
pane.isDefault(true);
}
var append=true;
if (beforePane!=undefined) {
for (var x=0; x < this.i_panes.length; x++) {
if (this.i_panes[x]==beforePane) {
this.i_panes.splice(x, 0, pane);
append=false;
break;
}
}
}
if (append) {
this.i_panes[this.i_panes.length]=pane;
}
if(pane.displayNavigation()) {
if(append) {
this.navigation().addPane(pane.navigation());
} else {
this.navigation().addPane(pane.navigation(), beforePane.navigation());
}
}
return pane;
}
PreferenceSection.prototype.removePane=function(pane) {
for (var x=0; x < this.i_panes.length; x++) {
if (this.i_panes[x]==pane) {
this.i_panes.splice(x, 1);
if(pane.displayNavigation()) {
this.navigation().removePane(pane.navigation());
}
return true;
}
}
return false;
}
PreferenceSection.prototype.handleClick=function(e) {
if(this.defaultPane()) {
this.defaultPane().show();
}
}
PreferenceSection.prototype.navigation=function() {
if(!this.i_navigation) {
this.i_navigation=new PreferenceNavigationSection(this.name(), this.iconClass());
EventHandler.register(this.i_navigation, "onclick", this.handleClick, this);
}
return this.i_navigation;
}
function PreferencePane(name, description) {
this.superPreferencePane(name, description);
}
PreferencePane.prototype.superPreferencePane=function(name, description) {
this.i_is_default=false;
this.i_display_navigation=true;
this.i_name=name;
this.i_description=description;
this.i_width=100;
}
PreferencePane.prototype.onresize=null;
PreferencePane.prototype.parent=function() {
return this.i_parent;
}
PreferencePane.prototype.section=function() {
return this.parent();
}
PreferencePane.prototype.manager=function() {
if(this.parent()) {
return this.parent().parent();
}
}
PreferencePane.prototype.application=function(application) {
if(application) {
this.i_application=application;
}
return this.i_application;
}
PreferencePane.prototype.isDefault=function(is_default) {
if(is_default!=undefined) {
this.i_is_default=is_default;
if(this.section()) {
this.section().i_default_pane=undefined;
}
}
return this.i_is_default;
}
PreferencePane.prototype.displayNavigation=function(display_navigation) {
if(display_navigation!=undefined) {
this.i_display_navigation=display_navigation;
if(this.section()) {
if(display_navigation) {
this.section().navigation().addPane(this.navigation());
} else {
this.section().navigation().removePane(this.navigation());
}
}
}
return this.i_display_navigation;
}
PreferencePane.prototype.name=function(name) {
if (name!=undefined) {
this.i_name=name;
if(this.i_navigation) {
this.i_navigation.name(name);
}
if(this.i_header_pane_name) {
this.i_header_pane_name.innerHTML=name;
}
}
return this.i_name;
}
PreferencePane.prototype.description=function(description) {
if (description!=undefined) {
this.i_description=description;
if(this.i_header_description) {
this.i_header_description.innerHTML=description;
}
}
return this.i_description;
}
PreferencePane.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.pane=this;
this.onresize(o);
}
}
return this.i_width;
}
PreferencePane.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.pane=this;
this.onresize(o);
}
}	
return this.i_height;
}
PreferencePane.prototype.contentHeight=function(width) {
var content_height=0;
if(this.getHeader && this.getHeader()) {
content_height+=this.getHeader().offsetHeight;
}
if(this.getForm && this.getForm()) {
content_height+=this.getForm().height();
}
return content_height;
}
PreferencePane.prototype.handleClick=function(tree, display, node, e) {
node.pObj.parent().parent().loadContent(false);
}
PreferencePane.prototype.navigation=function() {
if(!this.i_navigation) {
this.i_navigation=new PreferenceNavigationPane(this.name());
EventHandler.register(this.i_navigation, "onclick", this.handleClick, this);
}
return this.i_navigation;
}
PreferencePane.prototype.validate=null;
PreferencePane.prototype.isModified=null;
PreferencePane.prototype.reset=null;
PreferencePane.prototype.save=null;
PreferencePane.prototype.updateDefault=null;
function FormPreferencePane(name, description) {
this.superFormPreferencePane(name, description);
}
FormPreferencePane.prototype.superFormPreferencePane=function(name, description) {
this.superPreferencePane(name, description);
EventHandler.register(this, "onresize", this.handleFormResize, this);
}
FormPreferencePane.prototype.handleClick=function(e) {
this.show();
}
FormPreferencePane.prototype.show=function() {
if(this.manager().activePane()!=this) {
this.manager().loading(true);
if(this.manager().activePane()) {
this.manager().activePane().hide();
}
this.manager().loadContent(this.getContent());
if (this.i_frm_rsl==undefined) {
this.i_frm_rsl=EventHandler.register(this.getForm(), "onresize", this.handleFormResize, this);
}
this.width(this.manager().paneWidth());
this.height(this.manager().paneHeight());
this.manager().activeSection(this.parent());
this.manager().activePane(this);
if(!this.loaded() && this.onload) {
var o=new Object();
o.type="load";
o.pane=this;
this.onload(o);
} else {
this.manager().loading(false);
}
if(this.getForm && this.getForm()) {
this.getForm().updateHeight();
}
if(this.onshow) {
var o=new Object();
o.type="show";
o.pane=this;
this.onshow(o);
}
}
}
FormPreferencePane.prototype.getHeader=function() {
if(!this.i_header) {
this.i_header=document.createElement("div");
this.i_header.className="FormPreferencePane_header";
this.i_header_title=document.createElement("h1");
this.i_header_title.innerHTML=this.section().name()+" > ";
this.i_header_pane_name=document.createElement("span");
this.i_header_pane_name.className="FormPreferencePane_header_active";
this.i_header_pane_name.innerHTML=this.name();
this.i_header_title.appendChild(this.i_header_pane_name);
this.i_header_description=document.createElement("p");
this.i_header_description.className="FormPreferencePane_header_description";
this.i_header_description.innerHTML=this.description();
this.i_header.appendChild(this.i_header_title);
this.i_header.appendChild(this.i_header_description);
}
return this.i_header;
}
FormPreferencePane.prototype.getContent=function() {
if(!this.i_content) {
this.i_content=document.createElement("div");
this.i_content.appendChild(this.getHeader());
if(this.getForm && this.getForm()) {
this.i_content.appendChild(this.getForm().getForm());
}
}
return this.i_content;
}
FormPreferencePane.prototype.hide=function() {
if(this.onhide) {
var o=new Object();
o.type="hide";
o.pane=this;
this.onhide(o);
}
}
FormPreferencePane.prototype.loaded=function(loaded) {
if(loaded!=undefined) {
this.i_loaded=loaded;
this.manager().loading(!loaded);
}
return this.i_loaded;
}
FormPreferencePane.prototype.validate=function() {
var form=this.getForm();
form.validate();
this.displayErrors("Please verify the form and fix any errors:");
return (form.errors().length==0) ? true : false;
}
FormPreferencePane.prototype.clearErrors=function() {
if(this.getForm && this.getForm().errors) {
var form=this.getForm();
if(form.errors().length > 0) {
form.clearErrors();
this.displayErrors();
}
}
}
FormPreferencePane.prototype.addErrorMessage=function(message) {
this.getForm().addErrorMessage(message);
}
FormPreferencePane.prototype.displayErrors=function(message) {
var form=this.getForm();
if(form.errors().length > 0) {
this.navigation().node().addCssClass("LiteTreeNode_invalid");
} else {
this.navigation().node().removeCssClass("LiteTreeNode_invalid");
}
form.displayErrorBox(message);
}
FormPreferencePane.prototype.handleFormResize=function(e) {
if(this.loaded()) {
this.getForm().width(this.width() - (this.contentHeight() > this.height() ? scrollBarWidth() : 0));
}
}
FormPreferencePane.prototype.handleLoadError=function() {
DialogManager.alert("An error occurred while retrieving your preferences. Please try again later.");
}
FormPreferencePane.prototype.handleSaveComplete=function() {
this.updateDefault();
}
FormPreferencePane.prototype.handleSaveError=function() {
DialogManager.alert("An error occurred while saving your preferences. Please try again later.");
}
FormPreferencePane.prototype.isModified=function() {
return this.getForm().isModified();
}
FormPreferencePane.prototype.updateDefault=function() {
this.getForm().clearModified();
}
FormPreferencePane.prototype.reset=function() {
this.getForm().reset();
}
FormPreferencePane.prototype.getForm=null;
FormPreferencePane.prototype.save=null;
FormPreferencePane.inherit(PreferencePane);
JavaScriptResource.notifyComplete("./lib/components/Component.PreferenceManager.js");	
PopoutWindow.registerGroup("DataGrid", ["DataGrid",
"DataGridPageSelector",
"DataGridHeader"]);
function DataGridPageSelector(width, grid) {
this.i_width=width;
this.i_grid=grid;
if (this.i_grid!=undefined) {
this.i_ll=EventHandler.register(this.i_grid, "onpagechange", this.handlePageUpdate, this);
this.i_lc=EventHandler.register(this.i_grid, "onpagecount", this.handlePageCount, this);
}
}
DataGridPageSelector.prototype.width=function(width) {
if (width!=undefined && this.i_width!=width) {
this.i_width=width;
if (this.i_options!=undefined) {
this.i_options.width(width);
}
}
return this.i_width;
}
DataGridPageSelector.prototype.grid=function(grid) {
if (grid!=undefined) {
if (grid===false) {
grid=undefined;
}
if (this.i_ll!=undefined) {
this.i_ll.unregister();
this.i_ll=null;
this.i_lc.unregister();
this.i_lc=null;
}
this.i_grid=grid;
if (grid!=undefined) {
this.i_ll=EventHandler.register(this.i_grid, "onpagechange", this.handlePageUpdate, this);
this.i_lc=EventHandler.register(this.i_grid, "onpagecount", this.handlePageCount, this);
}
}
return this.i_grid;
}
DataGridPageSelector.prototype.handlePageUpdate=function(e) {
var ops=this.i_options.options();
for (var x=0; x < ops.length; x++) {
if (ops[x].value()==this.grid().page()) {
ops[x].selected(true);
}
else {
ops[x].selected(false);
}
}
}
DataGridPageSelector.prototype.handlePageCount=function(e) {
var pages=this.grid().pages();
var pLength=this.grid().pageLength();
var s=1;
if (this.i_options!=undefined) {
this.i_options.removeOptions();
if (pLength > 0) {
var ent=this.grid().entries();
var page_start=0;
var g=0;
if(ent==0) {
this.i_options.addOption(new OptionBoxOption("0 - 0", g, (this.grid().page()==g ? true : false)));
} else {
while (ent > 0) {
var page_end=(page_start+pLength);
if (ent < pLength) {
page_end=page_start+ent;	
}
this.i_options.addOption(new OptionBoxOption((page_start+1)+" - "+page_end, g, (this.grid().page()==g ? true : false)));
page_start+=pLength;
ent-=pLength;
g++;
}
}
}
else {
this.i_options.addOption(new OptionBoxOption("All", 0, true));
}
}	
}
DataGridPageSelector.prototype.handleOptionSelect=function(e) {
if (this.grid().pageLength() > 0) {
this.grid().page(this.optionBox().value());
}
}
DataGridPageSelector.prototype.optionBox=function() {
if (this.i_options==undefined) {
this.i_options=new OptionBox(this.width(), 1, false);
EventHandler.register(this.i_options, "onselect", this.handleOptionSelect, this);
}
return this.i_options;
}
function DataGrid(width, height, dataModel, rowHeight, styleClasses) {
var st;
if (styleClasses==undefined) {
styleClasses=Array();
}
styleClasses.splice(0, 0, "");		
var st=Array();
for (var x=0; x < styleClasses.length; x++) {
st[styleClasses[x]]=x;
}
this.i_width=width;
this.i_height=height;
this.i_rowHeight=(rowHeight==undefined ? 18 : rowHeight);
this.i_headers=Array();
this.i_cols=Array();
this.i_entries=0;
this.i_start_index=0;
this.i_over_scroll=0;
this.i_styles=styleClasses.length;
this.i_style_aclass=styleClasses;
this.i_style_classes=st;
this.i_empty_list_div=undefined;
this.i_empty_list_content=undefined;
this.i_selection=Array();
this.i_selected=Array();
this.i_multi=true;
this.i_page=0;
this.dataModel(dataModel);
}
DataGrid.headerHeight=16;
DataGrid.scrollFactor=18;
DataGrid.rowOverflow=1;
DataGrid.prototype.onpagechange=null;
DataGrid.prototype.onpagecount=null;
DataGrid.prototype.onclick=null;
DataGrid.prototype.ondblclick=null;
DataGrid.prototype.onmouseover=null;
DataGrid.prototype.onmouseout=null;
DataGrid.prototype.onmousemove=null;
DataGrid.prototype.onmousedown=null;
DataGrid.prototype.onmouseup=null;
DataGrid.prototype.oncontextmenu=null;
DataGrid.prototype.left=function() {
var lf=0;
var me=this.getGrid();
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
return lf;
}
DataGrid.prototype.top=function() {
var tp=0;
var me=this.getGrid();
while (me!=null) {
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
return tp;
}
DataGrid.prototype.pageLength=function(entries) {
if (entries!=undefined && this.i_page_length!=entries) {
this.i_page_length=entries;
this.i_page_entries=undefined;
if (this.i_grid!=undefined) {
this.i_grid_scroll_force.style.height=((this.height() - DataGrid.headerHeight)+(((this.pageEntries()+(this.pageLength() > 0 ? 0 : 2)) - this.possibleEntries()) * DataGrid.scrollFactor))+"px";
}
if (this.pageLength() > 0) {
this.pages(Math.floor(this.entries() / this.pageLength()));
}
else {
this.pages(0);
}
this.scrollBarVisible(this.rowHeight() * this.pageEntries() > this.height() - DataGrid.headerHeight ? true : false);
this.handleDataRefresh();
}
return this.i_page_length;
}
DataGrid.prototype.page=function(page) {
if (page!=undefined && this.i_page!=page) {
this.i_page=page;
this.i_page_entries=undefined;
this.startingIndex(0, true);
if (this.onpagechange!=undefined) {
var o=new Object();
o.type="pagechange";
o.list=this;
this.onpagechange(o);
}
}
return this.i_page;
}
DataGrid.prototype.pages=function(pages) {
if (pages!=undefined && this.i_pages!=pages) {
this.i_pages=pages;
this.i_page_entries=undefined;
if (this.onpagecount!=undefined) {
var o=new Object();
o.type="pagecount";
o.list=this;
this.onpagecount(o);
}
}
return this.i_pages;
}
DataGrid.prototype.pageEntries=function() {
if (this.i_page_length > 0) {
if (this.i_page_entries!=undefined) {
return this.i_page_entries;
}
var rem=(this.entries() - (this.page() * this.pageLength()));
this.i_page_entries=(rem > this.pageLength() ? this.pageLength() : rem)+1+DataGrid.rowOverflow;
return this.i_page_entries;
}
return this.entries();
}
DataGrid.prototype.getSelected=function() {
var ret=Array();
if (this.dataModel()!=undefined) {
for (var x=0; x < this.i_selected.length; x++) {
var i=this.dataModel().getItemById(this.i_selected[x], true);
if (i!=undefined) {
ret[ret.length]=i;
}
}
}
return ret;
}
DataGrid.prototype.entrySelected=function(entry, state) {
if (state!=undefined) {
if (state!=this.i_selection[entry.id()]) {
if (state) {
this.i_selected[this.i_selected.length]=entry.id();
}
else {
for (var x=0; x < this.i_selected.length; x++) {
if (this.i_selected[x]==entry.id()) {
this.i_selected.splice(x, 1);
}
}
}
this.i_selection[entry.id()]=state;
this.handleDataRefresh();
}
}
return this.i_selection[entry.id()];
}
DataGrid.prototype.rangeSelect=function(start_row, last_row, state) {
var range_start=start_row
var range_end=last_row;
if (range_start > range_end) {
var re=range_end;
range_end=range_start;
range_start=re;
}
else {
range_end++;
}
var gi;
if(this.i_sort_header) {
gi=this.dataModel().getItems(range_start, range_end - range_start, this.i_sort_header.sort_id(), this.i_sort_header.sortDirection());
} else {
gi=this.dataModel().getItems(range_start, range_end - range_start);
}
for (var x=0; x < gi.length(); x++) {
var i=gi.getItem(x);
if (this.i_selection[i.id()]!=state) {
if (state) {
this.i_selected[this.i_selected.length]=i.id();
}
else {
for (var z=0; z < this.i_selected.length; z++) {
if (this.i_selected[z]==i.id()) {
this.i_selected.splice(z, 1);
}
}
}
this.i_selection[gi.getItem(x).id()]=state;
}
}
this.handleDataRefresh();
}
DataGrid.prototype.selectAll=function() {
var gi=this.dataModel().getItems(0, this.pageEntries());
var l=gi.length();
for (var x=0; x < l; x++) {
var i=gi.getItem(x);
if (this.i_selection[i.id()]!=true) {
this.i_selection[i.id()]=true;
this.i_selected[this.i_selected.length]=i.id();
}
}
this.handleDataRefresh();
}
DataGrid.prototype.clearSelected=function() {
this.i_selected=Array();
this.i_selection=Array();
this.handleDataRefresh();
return true;
}
DataGrid.prototype.multiSelect=function(state) {
if (state!=undefined) {
this.i_multi=state;
}
return this.i_multi;
}
DataGrid.prototype.rowHeight=function(height) {
if (height!=undefined && this.i_rowHeight!=height) {
this.i_rowHeight=height;
if (this.i_grid!=undefined) {
this.i_grid_scroll_force.style.height=((this.height() - DataGrid.headerHeight)+(((this.pageEntries()+(this.pageLength() > 0 ? 0 : 2)) - this.possibleEntries()) * DataGrid.scrollFactor))+"px";
}
if (this.i_sel_row!=undefined) {
for (var x=0; x < this.i_sel_row.length; x++) {
this.i_sel_row[x].style.height=this.rowHeight()+"px";
}
}
this.scrollBarVisible(this.rowHeight() * this.pageEntries() > this.height() - DataGrid.headerHeight ? true : false);
this.updateColumns();
}
return this.i_rowHeight;
}
DataGrid.prototype.dataModel=function(model) {
if (model!=undefined) {
if (model===false) {
model=undefined;
}
if (this.i_dm_l!=undefined) {
this.i_dm_l.unregister();
this.i_dm_l=null;
}
this.i_dataModel=model;
if (model!=undefined) {
this.i_dm_l=EventHandler.register(model, "onrefresh", this.handleDataRefresh, this);
}
}
return this.i_dataModel;
}
DataGrid.prototype.width=function(width) {
if (width!=undefined && this.i_width!=width) {
this.i_width=width;
if (this.i_grid!=undefined) {
this.i_grid.style.width=this.width()+"px";
this.i_grid_headers.style.width=this.width()+"px";
this.i_grid_contents.style.width=this.width()+"px";
this.i_grid_background.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_select.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_cover.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_empty_list_div.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
for (var x=0; x < this.i_grid_data.length; x++) {
this.i_grid_data[x].style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
}
if (this.i_sel_row!=undefined) {
for (var x=0; x < this.i_sel_row.length; x++) {
this.i_sel_row[x].style.width=this.width()+"px";
}
}
this.handleHeaderResize();
}
}
return this.i_width;
}
DataGrid.prototype.height=function(height) {
if (height!=undefined && this.i_height!=height) {
this.i_height=height;
if (this.i_grid!=undefined) {
this.i_grid.style.height=this.height()+"px";
this.i_grid_contents.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_grid_background.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_grid_select.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_grid_cover.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_empty_list_div.style.height=(this.height() - DataGrid.headerHeight)+"px";
for (var x=0; x < this.i_grid_data.length; x++) {
this.i_grid_data[x].style.height=(this.height() - DataGrid.headerHeight)+"px";
}
this.updateColumns();
this.handleDataRefresh();
}
this.scrollBarVisible(this.rowHeight() * this.pageEntries() > this.height() - DataGrid.headerHeight ? true : false);
}
return this.i_height;
}
DataGrid.prototype.headers=function(index) {
if (index!=undefined) {
return this.i_headers[index];
}
return this.i_headers;
}
DataGrid.prototype.addHeader=function(header, beforeHeader) {
var append=true;
header.i_parent=this;
if (beforeHeader!=undefined) {
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x]==beforeHeader) {
this.i_headers.splice(x, 0, header);
if (this.i_grid!=undefined) {
this.i_grid_headers.insertBefore(header.getHeader(), beforeHeader.getHeader());
}
if (this.i_context!=undefined) {
this.i_context.addItem(header.contextItem(), beforeHeader.contextItem());
}
append=false;
break;
}
}
}
if (append) {
this.i_headers[this.i_headers.length]=header;
if (this.i_grid!=undefined) {
this.i_grid_headers.appendChild(header.getHeader());
}
if (this.i_context!=undefined) {
this.i_context.addItem(header.contextItem());
}
}
if (this.i_grid!=undefined) {
this.handleHeaderResize();
this.handleDataRefresh();
}
header.i_rs_l=EventHandler.register(header, "onresize", this.handleHeaderResize, this);
header.i_sr_l=EventHandler.register(header, "onsort", this.handleHeaderSort, this);
header.i_vr_l=EventHandler.register(header, "onvisible", this.handleHeaderResize, this);
return header;
}
DataGrid.prototype.removeHeader=function(header) {
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x]==header) {
this.i_headers.splice(x, 1);
header.i_rs_l.unregister();
header.i_sr_l.unregister();
header.i_vr_l.unregister();
if (this.i_grid!=undefined) {
this.i_grid_headers.removeChild(header.getHeader());
this.handleHeaderResize();
this.handleDataRefresh();
}
if (this.i_context!=undefined) {
this.i_context.removeItem(header.contextItem());
}
return true;
}
}
return false;
}
DataGrid.prototype.handleHeaderSort=function(e) {
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x]!=e.header) {
if (this.i_headers[x].sortDirection()!="none") {
this.i_headers[x].sortDirection("none");
}
}
}
this.i_sort_header=e.header;
this.handleDataRefresh();
}
DataGrid.prototype.resizeHeader=function(header, new_size) {
if (this.in_assignment!=true) {
var useHeaders=Array();
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].visible()) {
useHeaders[useHeaders.length]=this.i_headers[x];			
}
}
var dm=new DimensionProcessor(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0));
for (var x=0; x < useHeaders.length; x++) {
var rat=0;
var wid=useHeaders[x].width();
if (useHeaders[x].width().indexOf!=undefined) {
if (useHeaders[x].width().indexOf('%') > -1) {
rat=(parseInt(wid) / 100);
wid=0;
}
}
dm.addNode(DataGridHeader.minimumWidth, wid, rat, (useHeaders[x]==header ? new_size : 0));
}
dm.normalize();
var dr=dm.calculate();
this.in_assignment=true;
var z=0;
for (var x=0; x < useHeaders.length; x++) {
if (useHeaders[x].width().indexOf!=undefined && useHeaders[x].width().indexOf('%') > -1) {
useHeaders[x].width((dr.nodes[x].ratio * 100)+"%");
}
else {
useHeaders[x].width(dr.nodes[x].value);
}
if (x==useHeaders.length - 1 && this.scrollBarVisible()==true) {
useHeaders[x].effectiveWidth(dr.nodes[x].value+scrollBarWidth());
}
else {
useHeaders[x].effectiveWidth(dr.nodes[x].value);
}
useHeaders[x].contentWidth(dr.nodes[x].value);
}
this.in_assignment=false;
this.updateColumns();
}
}
DataGrid.prototype.handleHeaderResize=function(e) {
if (this.in_assignment!=true) {
var useHeaders=Array();
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].visible()) {
useHeaders[useHeaders.length]=this.i_headers[x];			
}
}
var dm=new DimensionProcessor(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0));
for (var x=0; x < useHeaders.length; x++) {
var rat=0;
var wid=useHeaders[x].width();
if (useHeaders[x].width().indexOf!=undefined) {
if (useHeaders[x].width().indexOf('%') > -1) {
rat=(parseInt(wid) / 100);
wid=0;
}
}
dm.addNode(DataGridHeader.minimumWidth, wid, rat, 0);
}
dm.normalize();
var dr=dm.calculate();
this.in_assignment=true;
var z=0;
for (var x=0; x < useHeaders.length; x++) {
if (x==useHeaders.length - 1 && this.scrollBarVisible()) {
useHeaders[x].effectiveWidth(dr.nodes[x].value+scrollBarWidth());
}
else {
useHeaders[x].effectiveWidth(dr.nodes[x].value);
}
useHeaders[x].contentWidth(dr.nodes[x].value);
}
this.in_assignment=false;
this.updateColumns();
}
}
DataGrid.prototype.updateColumns=function() {
if (this.i_grid!=undefined) {
var q=0;
for (var x=0; x < this.i_headers.length; x++) { 
if (this.i_headers[x].visible()) {
if (this.i_cols[q]==undefined) {
this.i_cols[q]=Array();
for (var z=0; z < this.i_grid_data.length; z++) {
this.i_cols[q][z]=document.createElement('DIV');
this.i_cols[q][z].onselectstart=EventHandler.cancelEvent;
this.i_cols[q][z].className="DataGrid_column";
this.i_grid_data[z].appendChild(this.i_cols[q][z]);
}
}
for (var z=0; z < this.i_grid_data.length; z++) {
this.i_cols[q][z].style.width=this.i_headers[x].contentWidth()+"px";
this.i_cols[q][z].style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_cols[q][z].style.lineHeight=this.rowHeight()+"px";
this.i_cols[q][z].style.display="";
}
q++;
}
}
for (q; q < this.i_cols.length; q++) {
for (var z=0; z < this.i_grid_data.length; z++) {
this.i_cols[q][z].style.display="none";
}
}
this.i_cache_useHeaders=undefined;
this.handleDataRefresh();
}
}
DataGrid.prototype.handleSelectPageLength=function(e) {
this.pageLength(e.item.i_page_length);
for (var x=0; x < this.i_context_pages.length; x++) {
if (this.i_context_pages[x]==e.item) {
this.i_context_pages[x].state(true);
}
else {
this.i_context_pages[x].state(false);
}
}
}
DataGrid.prototype.contextMenu=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu();
for (var x=0; x < this.i_headers.length; x++){ 
this.i_context.addItem(this.i_headers[x].contextItem());
}
this.i_context.addItem(new ContextMenuDivider());
var pLengths=Array(10, 20, 50, 100, 250, 500, 0);
this.i_context_pages=Array();
for (var x=0; x < pLengths.length; x++) {
this.i_context_pages[x]=this.i_context.addItem(new ContextMenuBoolean((pLengths[x]==0 ? "All Rows" : pLengths[x]+" Rows"), (this.pageLength()==pLengths[x] ? true : false)));
this.i_context_pages[x].i_page_length=pLengths[x];
EventHandler.register(this.i_context_pages[x], "onclick", this.handleSelectPageLength, this);
}
}
return this.i_context;
}
DataGrid.prototype.handleContextMenu=function(e) {
var c=this.contextMenu();
c.show();
e.returnValue=false;
e.cancelBubble=true;
}
DataGrid.prototype.scrollBarVisible=function(state) {
if (state!=undefined) {
if (this.i_scroll!=state) {
this.i_scroll=state;
if (this.i_grid_data!=undefined) {
for (var x=0; x < this.i_grid_data.length; x++) {
this.i_grid_data[x].style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
}
this.i_grid_background.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_select.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_cover.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_empty_list_div.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
}
if (this.i_grid!=undefined) {
this.handleHeaderResize();
}
}
}
return this.i_scroll;
}
DataGrid.prototype.overScroll=function(offset) {
if (offset!=undefined && this.i_over_scroll!=offset) {
this.i_over_scroll=offset;
if (this.i_grid!=undefined) {
this.i_grid_background.style.backgroundPosition="left -"+(((this.startingIndex() % 2==0 ? 18 : 0)+this.overScroll())+1)+"px";
var ly=this.i_grid_data.length;
for (var x=this.i_headers.length - 1; x>=0; x--) {
for (var z=0; z < ly; z++) {
this.i_cols[x][z].style.marginTop=(this.overScroll() > 0 ? "-"+this.overScroll() : "0")+"px";
this.i_cols[x][z].style.height=((this.height() - DataGrid.headerHeight)+this.overScroll())+"px";
}
}
}
}
return this.i_over_scroll;
}
DataGrid.prototype.entries=function(entries) {
if (entries!=undefined && this.i_entries!=parseInt(entries)) {
this.i_entries=parseInt(entries);
this.i_page_entries=undefined;
if (this.i_grid!=undefined) {
this.i_grid_scroll_force.style.height=((this.height() - DataGrid.headerHeight)+(((this.pageEntries()+(this.pageLength() > 0 ? 0 : 2)) - this.possibleEntries()) * DataGrid.scrollFactor))+"px";
}
this.scrollBarVisible(this.rowHeight() * this.pageEntries() > this.height() - DataGrid.headerHeight ? true : false);
if (this.pageLength() > 0) {
this.pages(Math.floor(this.entries() / this.pageLength()));
}
}
return this.i_entries;
}
DataGrid.prototype.possibleEntries=function() {
return Math.ceil((this.height() - DataGrid.headerHeight) / this.rowHeight());
}
DataGrid.prototype.startingIndex=function(index, autoScroll) {
if (index!=undefined) {
if (this.i_start_index!=index || this.i_start_index_page!=this.page()) {
this.i_start_index=index;
this.i_start_index_page=this.page();
this.i_grid_background.className="DataGrid_grid_data"+(this.startingIndex() % 2==0 ? "_alt" : "");
if (this.i_grid!=undefined && autoScroll==true) {
this.i_grid_contents.scrollTop=((index  * DataGrid.scrollFactor)+this.overScroll());
}
this.handleDataRefresh();
this.i_grid_background.style.backgroundPosition="left -"+(((this.startingIndex() % 2==0 ? 18 : 0)+this.overScroll())+1)+"px";
}
}
return this.i_start_index;
}
DataGrid.prototype.handleDataRefresh=function(e) {
if (this.i_grid!=undefined) {
if (this.dataModel()!=undefined) {
if (this.i_sel_row==undefined) {
this.i_sel_row=Array();
}
var startIndex;
if (this.pageLength() > 0) {
startIndex=(this.page() * this.pageLength())+this.startingIndex();
}
else {
startIndex=this.startingIndex();
}
this.entries(this.dataModel().entries());
var req_count=(this.possibleEntries()+2);
if (this.pageLength() > 0) {
var page_bound=((this.page()+1) * this.pageLength());
if (startIndex+req_count > page_bound) {
req_count=(page_bound - startIndex);
}
}
this.i_cur_data;
if (this.i_sort_header!=undefined) {
this.i_cur_data=this.dataModel().getItems(startIndex, req_count, this.i_sort_header.sort_id(), this.i_sort_header.sortDirection());
}
else {
this.i_cur_data=this.dataModel().getItems(startIndex, req_count);
}
var grid_cols=Array();
if (this.i_cache_useHeaders==undefined) {
this.i_cache_useHeaders=Array();
this.i_protected_cols=Array();
var vhLength=this.i_headers.length;
var r=0;
for (var x=0; x < vhLength; x++) {
if (this.i_headers[x].visible()) {
var hid=this.i_headers[x].id();
this.i_cache_useHeaders[r++]=hid;
this.i_protected_cols[hid]=this.i_headers[x].protected();
}
}
}
grid_cols=Array();
for (var z=0; z < this.i_grid_data.length; z++) {
grid_cols[z]=Array();
for (var x=this.i_cache_useHeaders.length - 1; x >=0; x--) {
grid_cols[z][this.i_cache_useHeaders[x]]=Array();
}
}
for (var x=0; x < this.i_sel_row.length; x++) {
this.i_sel_row[x].style.display="none";
}
var hLength=this.i_cache_useHeaders.length - 1;
var ix=0;
for (var x=this.i_cur_data.length() - 1; x >=0; x--){ 
var i=this.i_cur_data.getItem(x);
for (var z=hLength; z >=0; z--) { 
var h=this.i_cache_useHeaders[z];
var v=i.i_dm_params['pm_'+h];
var styleC=(this.i_selection[i.i_id]==true ? i.selectedStyleClass() : i.styleClass());
if (styleC==undefined) {
styleC=0;
}
if (v!=undefined) {
if (v.length > 300) {
v=v.substr(0, 300); 
}
if (this.i_protected_cols[h]!=false && v.filterHTML) {
v=v.filterHTML();
}
}
grid_cols[styleC][h][x]=v; 
}
if (this.i_selection[i.i_id]==true) {
if (this.i_sel_row[ix]==undefined) {
this.i_sel_row[ix]=document.createElement('DIV');
this.i_sel_row[ix].className="DataGrid_selection_row";
this.i_sel_row[ix].style.width=this.width()+"px";
this.i_sel_row[ix].style.height=this.rowHeight()+"px";
this.i_sel_row[ix].innerHTML="&nbsp;";
this.i_grid_select.appendChild(this.i_sel_row[ix]);
}
if (x==0) {
this.i_sel_row[ix].i_top=(this.overScroll()!=0 ? "-"+this.overScroll()+"px" : "0px");
}
else {
this.i_sel_row[ix].i_top=(this.rowHeight() - this.overScroll())+((x - 1) * this.rowHeight())+"px";
}
ix++;
}
}
for (var x=0; x < ix; x++) {
this.i_sel_row[x].style.top=this.i_sel_row[x].i_top;
this.i_sel_row[x].style.display="";
}
var ly=this.i_grid_data.length;
for (var x=hLength; x>=0; x--) {
for (var z=0; z < ly; z++) {
this.i_cols[x][z].style.marginTop=(this.overScroll() > 0 ? "-"+this.overScroll() : "0")+"px";
this.i_cols[x][z].style.height=((this.height() - DataGrid.headerHeight)+this.overScroll())+"px";
this.i_cols[x][z].innerHTML="<div style='clear:both;margin-bottom:0px;'></div>"+grid_cols[z][this.i_cache_useHeaders[x]].join("<br>");
}
}
if(this.i_cur_data.length()==0 && this.i_empty_list_content!=undefined) {
this.i_empty_list_div.style.display="";
} else {
this.i_empty_list_div.style.display="none";
}
}
}
}
DataGrid.prototype.resolvePosition=function(x, y) {
var me=this.i_grid_contents;
var lf=0;
var tp=0;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
tp+=parseInt(me.offsetTop);
me=me.offsetParent;	
}
var off_x=x - lf;
var off_y=y - tp;
var row=this.startingIndex();
if (this.overScroll() > 0) {
if (off_y > this.rowHeight() - this.overScroll()) {
row++;	
off_y-=this.rowHeight() - this.overScroll();
}
else {
off_y=0;
}
}
if (off_y > 0) {
row+=Math.ceil(off_y / this.rowHeight()) - 1;
if (row < 0) {
row=0;
}
}
var header;
var w=0;
for (var x=0; x < this.i_headers.length; x++) {
if (this.i_headers[x].visible()) {
header=this.i_headers[x];
w+=this.i_headers[x].effectiveWidth();
if (w > off_x) {
break;
}
}
}
var relative_row=row - this.startingIndex();
var o=new Object();
o.row=row;
o.header=header;
o.top=(relative_row * this.rowHeight())+this.overScroll();
if (this.i_cur_data!=undefined) {
o.entry=this.i_cur_data.getItem(row - this.startingIndex());
}
return o;
}
DataGrid.prototype.handleScroll=function(e) {
var pos=Math.floor(parseInt(this.i_grid_contents.scrollTop) / DataGrid.scrollFactor);
var over=(parseInt(this.i_grid_contents.scrollTop) % DataGrid.scrollFactor) * (this.rowHeight() / DataGrid.scrollFactor);
if (document.all) {	
this.overScroll(over);
}
this.startingIndex(pos);
}
DataGrid.prototype.handleRowMouseDown=function(e) {
var pos=this.resolvePosition(CursorMonitor.getX(), CursorMonitor.getY());
if (pos.entry!=undefined) {
if (e.shiftKey && this.multiSelect()==true) {
this.rangeSelect(this.i_last_selected, pos.row, true);
this.i_last_selected=this.startingIndex()+pos.row;
}
else {
if (!e.ctrlKey || !this.multiSelect()) {
this.clearSelected();
}
this.entrySelected(pos.entry, (e.ctrlKey==true ? (this.entrySelected(pos.entry)==true ? false : true) : true));
this.i_last_selected=pos.row;
}
}
}
DataGrid.prototype.handleRowEvent=function(e) {
var tp="on"+e.type;
if (this[tp]!=undefined) {
var pos=this.resolvePosition(CursorMonitor.getX(), CursorMonitor.getY());
e.header=pos.header;
e.item=pos.entry;
if (this.pageLength() > 0) {
e.row=pos.row+(this.page() * this.pageLength());
}
else {
e.row=pos.row;
}
e.list=this;
this[tp](e);
}
}
DataGrid.prototype.handleMouseWheel=function(e) {
if (this.pObj!=undefined) {
var ex=(e==undefined ? event : e);
var r=this.pObj.handleMouseWheel.call(this.pObj, ex);
if (ex.returnValue!=undefined) {
return ex.returnValue;
}
return true;
}
var delta=0;
if (this.scrollBarVisible()) {
if (e.wheelDelta) {
delta=e.wheelDelta/120;
if (window.opera) {
delta=-delta;
}
}
else if (e.detail) {
delta=-e.detail/3;
}
if (delta) {
if (delta < 0) {
delta=Math.ceil(Math.abs(delta)) * -1;
}
else {
delta=Math.ceil(delta);
}
var st=this.startingIndex();
st-=delta;
if (st < 0) {
st=0;
}
if (st > this.pageEntries() - this.possibleEntries()) {
st=this.pageEntries() - this.possibleEntries();
}
this.startingIndex(st, true);
}
}
e.cancelBubble=true;
e.returnValue=false;
}
DataGrid.prototype.printHTML=function(headers, print_selected) {
if (this.pageLength()!=undefined) {
var startIndex=(this.page() * this.pageLength());
} else {
var startIndex=0;
}
var page_count=this.pageEntries();
var items;
if (this.i_sort_header!=undefined) {
items=this.dataModel().getItems(startIndex, page_count, this.i_sort_header.id(), this.i_sort_header.sortDirection());
}
else {
items=this.dataModel().getItems(startIndex, page_count);
}
if (print_selected!=undefined && print_selected==true) {
var item_lookup=new Object();
var selected_items=this.getSelected();
for (var i=0; i < selected_items.length;++i) {
item_lookup[selected_items[i].id()]=true;
}
var item_list=new Array();
for (var i=0; i < items.length();++i) {
var item=items.getItem(i);
if (item_lookup[item.id()]!=undefined) {
item_list[item_list.length]=item;
}
}
var list_length=item_list.length;
var getItemFromList=function(array, index) {
return array[index];
}
} else {
var item_list=items;
var list_length=items.length();
var getItemFromList=function(entrySet, index) {
return entrySet.getItem(index);
}
}
var str="";
var useHeaders=(headers!=undefined ? headers : this.i_headers);
var showHidden=(headers!=undefined ? true : false);
for (var i=0; i < list_length;++i) {
var item=getItemFromList(item_list, i);
str+=(str!="" ? "<hr>" : "");
for (var j=0; j < useHeaders.length;++j) {
if (showHidden==true || useHeaders[j].visible()==true) {
var item_field=item.param(useHeaders[j].id());
var field_name=useHeaders[j].displayName();
if (item_field!=undefined && item_field!="" && field_name!="" && field_name!=undefined) {
str+="<b>"+field_name+":</b>&nbsp;"+htmlEncode(item_field)+"<br>";
}
}
}
}
return str;
}
DataGrid.prototype.toolTip=function() {
if(this.i_tip==undefined) {
this.i_tip=new ToolTip(undefined, 400, "Data Grid");
}
return this.i_tip;
}
DataGrid.prototype.handleMouseMove=function(e) {
var p=this.resolvePosition(CursorMonitor.getX(), CursorMonitor.getY());
if (p.entry!=undefined) {
var cell_width=p.header.effectiveWidth();
var cell_height=this.rowHeight();
var cell_left=p.header.left();
var cell_top=p.top+p.header.top()+DataGrid.headerHeight;
var tip=p.entry.param(p.header.id()+"_tip");
if (tip==undefined) {
tip=p.entry.param(p.header.id());
}
this.toolTip().elementWidth(cell_width);
this.toolTip().elementHeight(cell_height);
this.toolTip().elementTop(cell_top);
this.toolTip().elementLeft(cell_left);
this.toolTip().tip(tip);
if (tip!=undefined && tip!="") {
this.toolTip().show();
}
}
}
DataGrid.prototype.getGrid=function() {
if (this.i_grid==undefined) {
this.i_grid=document.createElement('DIV');
this.i_grid.onselectstart=function() { return false; }
this.i_grid.className="DataGrid";
this.i_grid.style.width=this.width()+"px";
this.i_grid.style.height=this.height()+"px";
this.i_grid_headers=document.createElement('DIV');
this.i_grid_headers.className="DataGrid_headers";
this.i_grid_headers.style.width=this.width()+"px";
this.i_grid_headers.style.height=DataGrid.headerHeight+"px";
this.i_grid.appendChild(this.i_grid_headers);
EventHandler.register(this.i_grid_headers, "oncontextmenu", this.handleContextMenu, this);
for (var x=0; x < this.i_headers.length; x++){ 
this.i_grid_headers.appendChild(this.i_headers[x].getHeader());
}
this.i_grid_background=document.createElement('DIV');
this.i_grid_background.className="DataGrid_grid_data"+(this.startingIndex() % 2==0 ? "_alt" : "");
this.i_grid_background.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_background.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_grid.appendChild(this.i_grid_background);
this.i_grid_select=document.createElement('DIV');
this.i_grid_select.className="DataGrid_grid_data_empty";
this.i_grid_select.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_select.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_grid.appendChild(this.i_grid_select);
this.i_grid_data=Array();
for (var x=0; x < this.i_styles; x++) {
this.i_grid_data[x]=document.createElement('DIV');
this.i_grid_data[x].className="DataGrid_grid_data_empty"+(this.i_style_aclass[x]!="" ? " "+this.i_style_aclass[x] : "");
this.i_grid_data[x].style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_data[x].style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_grid.appendChild(this.i_grid_data[x]);
}
this.i_grid_cover=document.createElement('DIV');
this.i_grid_cover.className="DataGrid_grid_cover";
this.i_grid_cover.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_grid_cover.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_grid_cover.innerHTML="&nbsp;";
EventHandler.register(this.i_grid_cover, "onmousedown", this.handleRowMouseDown, this);
EventHandler.register(this.i_grid_cover, "onclick", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "ondblclick", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "onmouseover", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "onmouseout", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "onmousemove", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "onmousedown", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "onmouseup", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "oncontextmenu", this.handleRowEvent, this);
EventHandler.register(this.i_grid_cover, "onmousemove", this.handleMouseMove, this);
if (this.i_grid_cover.addEventListener) {
this.i_grid_cover.pObj=this;
this.i_grid_cover.addEventListener('DOMMouseScroll', this.handleMouseWheel, false);
}
else {
EventHandler.register(this.i_grid_cover, "onmousewheel", this.handleMouseWheel, this);
}
this.i_grid.appendChild(this.i_grid_cover);
this.i_tool_tip=new ToolTip(this.i_grid_cover, 200, "");
this.i_empty_list_div=document.createElement("DIV");
this.i_empty_list_div.className="DataGrid_empty_list";
this.i_empty_list_div.style.width=(this.width() - (this.scrollBarVisible() ? scrollBarWidth() : 0))+"px";
this.i_empty_list_div.style.height=(this.height() - DataGrid.headerHeight)+"px";
this.i_empty_list_div.style.display="none";
this.i_grid.appendChild(this.i_empty_list_div);
if(this.i_empty_list_content!=undefined) {
this.i_empty_list_div.appendChild(this.i_empty_list_content);
}
this.i_grid_contents=document.createElement('DIV');
this.i_grid_contents.className="DataGrid_contents rand_css_"+Math.floor(Math.random() * 1000);
this.i_grid_contents.style.width=this.width()+"px";
this.i_grid_contents.style.height=(this.height() - DataGrid.headerHeight)+"px";
EventHandler.register(this.i_grid_contents, "onscroll", this.handleScroll, this);
this.i_grid.appendChild(this.i_grid_contents);
this.i_grid_scroll_force=document.createElement('DIV');
this.i_grid_scroll_force.className="DataGrid_scroll_force";
var set_top=((this.pageEntries() - this.possibleEntries()) * DataGrid.scrollFactor);
if (set_top < 5) {
set_top=5;
}
this.i_grid_scroll_force.style.height=set_top+"px";
this.i_grid_scroll_force.style.width="20px";
this.i_grid_scroll_force.innerHTML="a<br>b<br>c<br>d<br>e<br>f";
this.i_grid_contents.appendChild(this.i_grid_scroll_force);					
this.i_grid_contents.scrollTop=(this.startingIndex() * this.rowHeight());
this.handleHeaderResize();
this.handleDataRefresh();
}
return this.i_grid;
}
DataGrid.prototype.setEmptyListContent=function(element) {
if(element!=undefined) {
if(this.i_empty_list_div!=undefined && this.i_empty_list_content!=undefined) {
this.i_empty_list_div.removeChild(this.i_empty_list_content);
}
this.i_empty_list_content=element;
if(this.i_empty_list_div!=undefined) {
this.i_empty_list_div.appendChild(this.i_empty_list_content);
}
}
}
function DataGridHeader(id, sort_id, width, display_name, context_name, iconClass, visible, sort_order) {
this.i_id=id;
this.i_sort_id=sort_id;
this.i_width=width;
this.i_display_name=display_name;
this.i_context_name=(context_name==undefined ? display_name : context_name);
this.i_iconClass=iconClass;
this.i_visible=(visible==undefined ? true : visible);
this.i_sort=(sort_order==undefined ? "none" : sort_order);
this.i_effective_width=DataGridHeader.minimumWidth;
this.i_content_width=DataGridHeader.minimumWidth;
this.i_protected=true;
}
DataGridHeader.prototype.onresize=null;
DataGridHeader.prototype.onsort=null;
DataGridHeader.prototype.onvisible=null;
DataGridHeader.resize_handle=4;
DataGridHeader.sort_width=15;
DataGridHeader.minimumWidth=28;
DataGridHeader.resizeThreshold=5;
DataGridHeader.resizeLineWidth=2;
DataGridHeader.moveThreshold=5;
DataGridHeader.moveArrowHeight=9;
DataGridHeader.moveArrowWidth=7;
DataGridHeader.prototype.parent=function() {
return this.i_parent;
}
DataGridHeader.prototype.id=function(id) {
if (id!=undefined) {
this.i_id=id;
}
return this.i_id;
}
DataGridHeader.prototype.sort_id=function(id) {
if(id!=undefined) {
this.i_sort_id=id;
}
return this.i_sort_id;
}
DataGridHeader.prototype.protected=function(state) {
if (state!=undefined) {
this.i_protected=state;
}
return this.i_protected;
}
DataGridHeader.prototype.left=function() {
var lf=0;
var me=this.getHeader();
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
return lf;
}
DataGridHeader.prototype.top=function() {
var tp=0;
var me=this.getHeader();
while (me!=null) {
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
return tp;
}
DataGridHeader.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.header=this;
this.onresize(o);
}
}
return this.i_width;
}
DataGridHeader.prototype.contentWidth=function(width) {
if (width!=undefined) {
this.i_content_width=width;
}
return this.i_content_width;
}
DataGridHeader.prototype.effectiveWidth=function(width) {
if (width!=undefined && this.i_effective_width!=width) {
this.i_effective_width=width;
if (this.i_header!=undefined) {
this.i_header_name.style.width=(this.effectiveWidth() - DataGridHeader.resize_handle - ((this.sortDirection()!="none" && this.iconClass()==undefined) ? DataGridHeader.sort_width : 0) - 5)+"px";
this.i_header.style.width=this.effectiveWidth()+"px";
}
}
return this.i_effective_width;
}
DataGridHeader.prototype.displayName=function(display_name) {
if (display_name!=undefined && this.i_display_name!=display_name) {
this.i_display_name=display_name;
if (this.i_header_name!=undefined) {
this.i_header_name.innerHTML=(this.iconClass()!=undefined ? "&nbsp;" : this.displayName())+"px";
}
}
return this.i_display_name;
}
DataGridHeader.prototype.contextName=function(context_name) {
if (context_name!=undefined && this.i_context_name!=context_name) {
this.i_context_name=context_name;
if (this.i_context!=undefined) {
this.i_context.name(context_name);
}
}
return this.i_context_name;
}
DataGridHeader.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined && this.i_iconClass!=iconClass) {
this.i_iconClass=iconClass;
if (this.i_header!=undefined) {
this.i_header_name.className="DataGridHeader_name"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
this.i_header_name.innerHTML=(this.iconClass()!=undefined ? "&nbsp;" : this.displayName())+"px";
}
}
return this.i_iconClass;
}
DataGridHeader.prototype.visible=function(state) {
if (state!=undefined) {
if (this.visible!=state) {
if (state==false) {
var good=false;
for (var z=0; z < this.parent().headers().length; z++) {
var h=this.parent().headers(z);
if (h.visible()==true && h!=this) {
good=true;			
}
}
if (!good) {
return true;
}
}
this.i_visible=state;
if (this.i_header!=undefined) {
this.i_header.style.display=(this.visible() ? "" : "none");
}
if (this.i_context!=undefined) {
this.i_context.state(state);
}
if (this.onvisible!=undefined) {
var o=new Object();
o.type="visible";
o.state=state;
o.header=this;
this.onvisible(o);
}
}
}
return this.i_visible;
}
DataGridHeader.prototype.sortDirection=function(dir) {
if(dir!=undefined && this.i_sort!=dir) {
this.i_sort=dir;
if (this.i_header!=undefined) {
this.i_header_sort.className="DataGridHeader_sort"+(this.sortDirection()=="asc" ? " DataGridHeader_sort_asc" : (this.sortDirection()=="desc" ? " DataGridHeader_sort_desc" : ""));
this.i_header_sort.style.display=((this.sortDirection()!="none" && this.iconClass()==undefined) ? "" : "none");
this.i_header_name.style.width=(this.effectiveWidth() - DataGridHeader.resize_handle - ((this.sortDirection()!="none" && this.iconClass()==undefined) ? DataGridHeader.sort_width : 0) - 5)+"px";
this.i_header.className="DataGridHeader"+(this.sortDirection()!="none" ? " DataGridHeader_selected" : "");
}
if (dir!="none") {
if (this.onsort!=undefined) {
var o=new Object();
o.type="sort";
o.header=this;
this.onsort(o);
}
}
}
return this.i_sort;
}
DataGridHeader.prototype.handleResizeDown=function(e) {
this.i_start_x=CursorMonitor.getX();
this.i_x_offset=this.i_start_x - this.left();
this.i_in_resize=false;
this.i_move_ml=EventHandler.register(document.body, "onmousemove", this.handleResizeMove, this);
this.i_move_ul=EventHandler.register(document.body, "onmouseup", this.handleResizeUp, this);
}
DataGridHeader.prototype.handleResizeMove=function(e) {
var x=CursorMonitor.getX();
if (this.i_start_x - x < 1 - DataGridHeader.resizeThreshold || this.i_start_x+x > DataGridHeader.resizeThreshold) {
if (this.i_resize_line==undefined) {
this.i_resize_line=document.createElement('DIV');
this.i_resize_line.className="DataGridHeader_resize_line";
this.i_resize_line.style.width=DataGridHeader.resizeLineWidth+"px";
this.i_resize_line.innerHTML="&nbsp;";
}
if (this.i_in_resize==false) {
this.i_resize_line.style.height=(this.parent().height() - DataGrid.headerHeight)+"px";
this.i_resize_line.style.top=(this.parent().top()+DataGrid.headerHeight)+"px";
this.i_start_left=this.left();
document.body.appendChild(this.i_resize_line);
}
this.i_resize_line.style.left=(x - this.i_x_offset)+"px";
this.i_resize_off=((x - this.i_x_offset) - this.i_start_left);
this.i_in_resize=true;
}
}
DataGridHeader.prototype.handleResizeUp=function(e) {
if (this.i_in_resize==true) {
var me;
for (var x=0; x < this.parent().headers().length; x++){ 
var h=this.parent().headers(x);
if (h==this) {
break;
}
if (h.visible()) {
me=h;
}
}
this.parent().resizeHeader(me, me.effectiveWidth()+this.i_resize_off);
document.body.removeChild(this.i_resize_line);
}
else {
var srt=this.sortDirection();
if (srt=="none") {
this.sortDirection("asc");
}
else if (srt=="asc") {
this.sortDirection("desc");
}
else if (srt=="desc") {
this.sortDirection("asc");
}
}
this.i_move_ml.unregister();
this.i_move_ul.unregister();
}
DataGridHeader.prototype.handleMouseDown=function(e) {
var bt=(e.button > 0 ? e.button : e.which);
if (bt!=2) {
this.i_start_x=CursorMonitor.getX();
this.i_in_move=false;
this.i_move_ml=EventHandler.register(document.body, "onmousemove", this.handleMouseMove, this);
this.i_move_ul=EventHandler.register(document.body, "onmouseup", this.handleMouseUp, this);
}
}
DataGridHeader.prototype.handleMouseMove=function(e) {
var x=CursorMonitor.getX();
if (this.i_start_x - x < 1 - DataGridHeader.moveThreshold || this.i_start_x+x > DataGridHeader.moveThreshold) {
if (this.i_move_box==undefined) {
this.i_move_box=document.createElement('DIV');
this.i_move_box.className="DataGridHeader_move";
this.i_move_box.innerHTML="&nbsp;";
this.i_move_box.style.height=DataGridHeader.moveArrowHeight+"px";
this.i_move_box.style.width=DataGridHeader.moveArrowWidth+"px";
this.i_move_box.style.top=(this.top()+DataGrid.headerHeight - DataGridHeader.moveArrowHeight)+"px";
this.i_move_box.innerHTML="&nbsp;";
}
if (this.i_in_move==false) {
this.i_start_left=this.left();
document.body.appendChild(this.i_move_box);
this.i_grid_left=this.parent().left();
this.i_header_cache=Array();
this.i_header_objs=Array();
var p=0;
for (var z=0; z < this.parent().headers().length; z++) {
if (this.parent().headers(z).visible()) {
this.i_header_objs[p]=this.parent().headers(z);
this.i_header_cache[p++]=this.parent().headers(z).effectiveWidth();
}
}
}
var pos=(x - this.i_grid_left);
var r=0;
for (var z=0; z < this.i_header_cache.length; z++) {
if (z==this.i_header_cache.length - 1) {
if (pos < r+(this.i_header_cache[z] - 10)) {
this.i_move_loc=z;
this.i_move_box.style.left=(this.i_grid_left+r)+"px";
break;
}
else {
this.i_move_loc=-1;
this.i_move_box.style.left=(this.i_header_cache[z]+this.i_grid_left+r)+"px";
break;
}
}
else {
if (pos < r+this.i_header_cache[z]) {
this.i_move_loc=z;
this.i_move_box.style.left=(this.i_grid_left+r)+"px";
break;
}
}
r+=this.i_header_cache[z];
}
this.i_in_move=true;
}
}
DataGridHeader.prototype.handleMouseUp=function(e) {
if (this.i_in_move==true) {
document.body.removeChild(this.i_move_box);
if (this.i_header_objs[this.i_move_loc]!=this) {
this.parent().removeHeader(this);
this.parent().addHeader(this, (this.i_move_loc < 0 ? undefined : this.i_header_objs[this.i_move_loc]));
}
}
else {
var srt=this.sortDirection();
if (srt=="none") {
this.sortDirection("asc");
}
else if (srt=="asc") {
this.sortDirection("desc");
}
else if (srt=="desc") {
this.sortDirection("asc");
}
}
this.i_move_ml.unregister();
this.i_move_ul.unregister();
}
DataGridHeader.prototype.handleContextSelect=function(e) {
this.visible(!this.visible());
}
DataGridHeader.prototype.contextItem=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenuBoolean(this.contextName(), this.visible(), true);
EventHandler.register(this.i_context, "onclick", this.handleContextSelect, this);
}
return this.i_context;
}
DataGridHeader.prototype.getHeader=function() {
if (this.i_header==undefined) {
this.i_header=document.createElement('DIV');
this.i_header.className="DataGridHeader"+(this.sortDirection()!="none" ? " DataGridHeader_selected" : "");
this.i_header.style.width=this.effectiveWidth()+"px";
this.i_header.style.height=DataGrid.headerHeight+"px";
this.i_header.style.display=(this.visible() ? "" : "none");
this.i_header_resize=document.createElement('DIV');
this.i_header_resize.className="DataGridHeader_resize";
this.i_header_resize.style.width=DataGridHeader.resize_handle+"px";
this.i_header_resize.style.height=(DataGrid.headerHeight - 2)+"px";
this.i_header_resize.innerHTML="&nbsp;";
EventHandler.register(this.i_header_resize, "onmousedown", this.handleResizeDown, this);
this.i_header.appendChild(this.i_header_resize);
this.i_header_name=document.createElement('DIV');
this.i_header_name.className="DataGridHeader_name"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
this.i_header_name.style.width=(this.effectiveWidth() - DataGridHeader.resize_handle - ((this.sortDirection()!="none" && this.iconClass()==undefined) ? DataGridHeader.sort_width : 0) - 5)+"px";
this.i_header_name.style.height=(DataGrid.headerHeight - 2)+"px";
this.i_header_name.innerHTML=(this.iconClass()!=undefined ? "&nbsp;" : this.displayName());
EventHandler.register(this.i_header_name, "onmousedown", this.handleMouseDown, this);
this.i_header.appendChild(this.i_header_name);
this.i_header_sort=document.createElement('DIV');
this.i_header_sort.className="DataGridHeader_sort"+(this.sortDirection()=="asc" ? " DataGridHeader_sort_asc" : (this.sortDirection()=="desc" ? " DataGridHeader_sort_desc" : ""));
this.i_header_sort.style.width=DataGridHeader.sort_width+"px";
this.i_header_sort.style.height=(DataGrid.headerHeight - 2)+"px";
this.i_header_sort.style.display=((this.sortDirection()!="none" && this.iconClass()==undefined) ? "" : "none");
this.i_header_sort.innerHTML="&nbsp;";
EventHandler.register(this.i_header_sort, "onmousedown", this.handleMouseDown, this);
this.i_header.appendChild(this.i_header_sort);
}
return this.i_header;
}
JavaScriptResource.notifyComplete("./lib/components/Component.DataGrid.js");
function NotificationBar(width, height) {
this.i_text="";
this.i_level=NotificationBar.INFO;
this.i_visible=true;
this.i_button_width=10;
this.i_button_spacer=Array();
this.i_buttons=Array();
this.i_height=(height==undefined ? 30 : height);
this.i_width=(width==undefined ? 100 : width);
}
NotificationBar.WARNING=1;
NotificationBar.INFO=2;
NotificationBar.buttonHeight=22;
NotificationBar.buttonPadding=4;
NotificationBar.buttonSpacing=4;
NotificationBar.prototype.buttons=function(buttons) {
if(buttons!=undefined) {
if (this.i_bar!=undefined && this.i_buttons.length > 0) {
for (var x=0; x < this.i_buttons.length; x++) {
if (this.i_buttons[x].i_rs_l!=null) {
this.i_buttons[x].i_rs_l.unregister();
this.i_buttons[x].i_rs_l=null;
}
try {
this.i_buttondiv.removeChild(this.i_button_spacer[x]);
this.i_buttondiv.removeChild(this.i_buttons[x].getButton());
} catch (e) { }
}
}
this.i_buttons=buttons;
this.i_button_width=0;
if (this.i_bar!=undefined) {
for (var x=this.i_buttons.length - 1; x>=0; x--) {
this.i_buttons[x].float("right");
this.i_buttons[x].height(NotificationBar.buttonHeight);
this.i_button_width+=this.i_buttons[x].width();
this.i_buttons[x].i_rs_l=EventHandler.register(this.i_buttons[x], "onresize", this.updateButtonWidth, this);					
this.i_buttondiv.appendChild(this.i_buttons[x].getButton());
if (x!=0) {
if (this.i_button_spacer[x]==undefined) {
this.i_button_spacer[x]=document.createElement('DIV');
this.i_button_spacer[x].className="NotificationBar_buttons_spacer";
this.i_button_spacer[x].style.width=NotificationBar.buttonSpacing+"px";
this.i_button_spacer[x].style.height=(this.height() - 2)+"px";
this.i_button_spacer[x].innerHTML="&nbsp;";
}
this.i_buttondiv.appendChild(this.i_button_spacer[x]);
}
}
this.i_buttondiv.style.height=(this.height() - Math.floor((this.height() - NotificationBar.buttonHeight - 2) / 2))+"px";
this.i_buttondiv.style.marginTop=Math.floor((this.height() - NotificationBar.buttonHeight - 2) / 2)+"px";
}
this.updateButtonWidth();
}
return this.i_buttons;
}
NotificationBar.prototype.updateButtonWidth=function(e) {
var w=0;
for (var x=0; x < this.i_buttons.length; x++) {
w+=this.i_buttons[x].width();
if (x!=0) {
w+=NotificationBar.buttonSpacing;
}
}
this.i_button_width=w;
this.updateWidth();
}
NotificationBar.prototype.updateWidth=function() {
if (this.i_bar!=undefined) {
if(this.width() - NotificationBar.buttonPadding - this.buttonWidth() - 5 > 0) {
this.i_textdiv.style.width=(this.width() - NotificationBar.buttonPadding - this.buttonWidth() - 5)+"px";
} else {
this.i_textdiv.style.width="0px";
}
this.i_bar.style.width=(this.width())+"px";
this.i_buttondiv.style.width=(this.buttonWidth()+NotificationBar.buttonPadding)+"px";
}
}
NotificationBar.prototype.buttonWidth=function() {
return this.i_button_width;
}
NotificationBar.prototype.text=function(text) {
if(text!=undefined) {
this.i_text=text;
if(this.i_bar!=undefined) {
this.i_textdiv.innerHTML="&nbsp;"+this.i_text;
}
}
return this.i_text;
}
NotificationBar.prototype.level=function(level) {
if(level!=undefined) {
this.i_level=level;
if (this.i_bar!=undefined) {
this.i_bar.className="NotificationBar "+(level==NotificationBar.WARNING ? "NotificationBar_warning" : "NotificationBar_info");
}
}
return this.i_level;
}
NotificationBar.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
this.updateWidth();
}
return this.i_width;
}
NotificationBar.prototype.height=function(height) {
if(height!=undefined) {
this.i_height=height;
if (this.i_bar!=undefined) {
this.i_bar.style.height=height+"px";
this.i_textdiv.style.lineHeight=(this.height() - 2)+"px";
this.i_textdiv.style.height=this.height()+"px";
this.i_buttondiv.style.height=(this.height() - Math.floor((this.height() - NotificationBar.buttonHeight - 2) / 2))+"px";
}
}
return this.i_height;
}
NotificationBar.prototype.visible=function(vis) {
if (vis!=undefined){
this.i_visible=vis;
if (this.i_bar!=undefined) {
this.i_bar.style.display=(vis ? "" : "none");
}
}
return this.i_visible;
}
NotificationBar.prototype.getContent=function() {
if(this.i_bar==undefined) {
this.i_bar=document.createElement("div");
this.i_bar.className="NotificationBar"+(this.level()==NotificationBar.WARNING ? " NotificationBar_warning" : " NotificationBar_info");
this.i_bar.style.height=(this.i_height - 2)+"px";
this.i_bar.style.width=(this.width())+"px";
this.i_bar.style.display=(this.visible() ? "" : "none");
this.i_textdiv=document.createElement('div');
this.i_textdiv.className="NotificationBar_text";
this.i_textdiv.innerHTML="&nbsp;"+this.i_text;
this.i_textdiv.style.lineHeight=(this.height() - 2)+"px";
this.i_textdiv.style.height=this.height()+"px";
if(this.width() - this.buttonWidth() - NotificationBar.buttonPadding - 5 > 0) {
this.i_textdiv.style.width=(this.width() - NotificationBar.buttonPadding - this.buttonWidth() - 5)+"px";
} else {
this.i_textdiv.style.width="0px";
}
this.i_bar.appendChild(this.i_textdiv);
this.i_buttondiv=document.createElement("div");
this.i_buttondiv.className="NotificationBar_buttons";
this.i_buttondiv.style.height=(this.height() - Math.floor((this.height() - NotificationBar.buttonHeight - 2) / 2))+"px";
this.i_buttondiv.style.marginTop=Math.floor((this.height() - NotificationBar.buttonHeight - 2) / 2)+"px";
this.i_buttondiv.style.width=this.buttonWidth()+"px";
this.i_bar.appendChild(this.i_buttondiv);
this.i_button_pad=document.createElement('DIV');
this.i_button_pad.className="NotificationBar_buttons_pad";
this.i_button_pad.style.width=NotificationBar.buttonPadding+"px";
this.i_button_pad.style.height=(this.height() - 2)+"px";
this.i_button_pad.innerHTML="&nbsp;";
this.i_buttondiv.appendChild(this.i_button_pad);
this.buttons(this.i_buttons);
}
return this.i_bar
}
JavaScriptResource.notifyComplete("./lib/components/Component.NotificationBar.js");
function ResizePane(width, height, orientation) {
this.i_width=width;
this.i_height=height;
this.i_orientation=orientation;
this.i_size=Array('50%','50%');
this.i_min=Array(50, 50);
this.i_content=Array();
this.i_eff_size=Array(100, 100);
}
ResizePane.resizeBarWidth=7;
ResizePane.prototype.onresize=null;
ResizePane.prototype.left=function() {
var lf=0;
var me=this.i_pane;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
return lf;
}
ResizePane.prototype.top=function() {
var tp=0;
var me=this.i_pane;
while (me!=null) {
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
return tp;
}
ResizePane.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_pane!=undefined) {
this.i_pane.style.width=width+"px";
if (this.orientation()==2) {
this.i_pane_divs[0].style.width=this.width()+"px";
this.i_pane_divs[1].style.width=this.width()+"px";
this.i_pane_resize.style.width=this.width()+"px";
}
}
this.calculateSize();
}
return this.i_width;
}
ResizePane.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_pane!=undefined) {
this.i_pane.style.height=height+"px";
if (this.orientation()==1) {
this.i_pane_divs[0].style.height=this.height()+"px";
this.i_pane_divs[1].style.height=this.height()+"px";
this.i_pane_resize.style.height=this.height()+"px";
}
}
this.calculateSize();
}
return this.i_height;
}
ResizePane.prototype.minimumSize=function(pane, minimum) {
if (minimum!=undefined) {
this.i_min[pane]=minimum;
this.calculateSize();
}
return this.i_min[pane];
}
ResizePane.prototype.size=function(pane, size) {
if (size!=undefined) {
this.i_size[pane]=size;
this.calculateSize();
}
return this.i_size[pane];
}
ResizePane.prototype.calculateSize=function(pane, newSize) {
var total=(this.orientation()==1 ? this.width() : this.height());
var dm=new DimensionProcessor(total - ResizePane.resizeBarWidth);
for (var x=0; x < 2; x++) {
var rat=0;
var wid=this.i_size[x];
if (wid.indexOf!=undefined) {
if (wid.indexOf('%') > -1) {
rat=(parseInt(wid) / 100);
wid=0;
}
}
dm.addNode(this.i_min[x], wid, rat, (x==pane && newSize > 0 ? newSize : 0));
}
dm.normalize();
var dr=dm.calculate();
for (var x=0; x < 2; x++) {
this.effectiveSize(x, dr.nodes[x].value);
}
}
ResizePane.prototype.contentPane=function(pane, content) {
if (content!=undefined) {
if (this.i_pane_divs!=undefined && this.i_pane_divs[pane]!=undefined) {
if (this.i_content[pane]!=undefined) {
this.i_pane_divs[pane].removeChild(this.i_content[pane]);
}
this.i_pane_divs[pane].appendChild(content);
}
this.i_content[pane]=content;	
}
return this.i_content[pane];
}
ResizePane.prototype.contentWidth=function(pane) {
var w;
if (this.orientation()==1) {
w=this.effectiveSize(pane);
}
else {
w=this.width();
}
if (w < 1) {
w=1;
}
return w;
}
ResizePane.prototype.contentHeight=function(pane) {
var h;
if (this.orientation()==1) {
h=this.height();
}
else {
h=this.effectiveSize(pane);
}
if (h < 1) {
h=1;
}
return h;
}
ResizePane.prototype.effectiveSize=function(pane, size) {
if (size!=undefined) {
this.i_eff_size[pane]=size;
if (this.i_pane!=undefined) {
if (this.orientation()==1) {
this.i_pane_divs[pane].style.width=size+"px";
}
else {
this.i_pane_divs[pane].style.height=size+"px";
}
}
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.pane=this;
this.onresize(o);
}
}
return this.i_eff_size[pane];
}
ResizePane.prototype.orientation=function(orientation) {
if (orientation!=undefined) {
this.i_orientation=orientation;
if (this.i_pane_divs!=undefined) {
this.i_pane_divs[0].className="ResizePane_pane"+(this.orientation()==1 ? "_vertical" : "_horizontal");
this.i_pane_divs[1].className="ResizePane_pane"+(this.orientation()==1 ? "_vertical" : "_horizontal");
this.i_pane_resize.className="ResizePane_resize"+(this.orientation()==1 ? "_vertical" : "_horizontal");
if (this.orientation()==1) {
this.i_pane_divs[0].style.height=this.height()+"px";
this.i_pane_divs[1].style.height=this.height()+"px";
this.i_pane_resize.style.height=this.height()+"px";
this.i_pane_resize.style.width=ResizePane.resizeBarWidth+"px";
}
else {
this.i_pane_divs[0].style.width=this.width()+"px";
this.i_pane_divs[1].style.width=this.width()+"px";
this.i_pane_resize.style.height=ResizePane.resizeBarWidth+"px";
this.i_pane_resize.style.width=this.width()+"px";
}
}
this.calculateSize();
}
return this.i_orientation;
}
ResizePane.prototype.getResizeLine=function() {
if (this.i_resize_line==undefined) {
this.i_resize_line=document.createElement('DIV');
this.i_resize_line.className="ResizePane_phantom";
this.i_resize_line.style.width=(this.orientation()==1 ? ResizePane.resizeBarWidth : this.width())+"px";
this.i_resize_line.style.height=(this.orientation()==2 ? ResizePane.resizeBarWidth : this.height())+"px";
}
return this.i_resize_line;
}
ResizePane.prototype.handleMouseDown=function(e) {
this.i_mm=EventHandler.register(document.body, "onmousemove", this.handleMouseMove, this);
this.i_mu=EventHandler.register(document.body, "onmouseup", this.handleMouseUp, this);
this.i_start_x=CursorMonitor.getX();
this.i_start_y=CursorMonitor.getY();
var rl=this.getResizeLine();
this.i_start_left=((this.orientation()==1 ? this.contentWidth(0) : 0)+this.left());
this.i_start_top=((this.orientation()==2 ? this.contentHeight(0) : 0)+this.top());
rl.style.left=this.i_start_left+"px";
rl.style.top=this.i_start_top+"px";
this.i_new_size=(this.orientation()==1 ? this.contentWidth(0) : this.contentHeight(0));
document.body.appendChild(rl);
}
ResizePane.prototype.handleMouseMove=function(e) {
var y=CursorMonitor.getY();
var x=CursorMonitor.getX();
var diff_x=x - this.i_start_x;
var diff_y=y - this.i_start_y;
if (this.orientation()==1) {
this.getResizeLine().style.left=(this.i_start_left+diff_x)+"px";
}
else {
this.getResizeLine().style.top=(this.i_start_top+diff_y)+"px";
}
}
ResizePane.prototype.handleMouseUp=function(e) {
if (this.i_mm!=undefined) {
this.i_mm.unregister();
this.i_mu.unregister();
this.i_mm=null;
this.i_mu=null;
var y=CursorMonitor.getY();
var x=CursorMonitor.getX();
var diff_x=x - this.i_start_x;
var diff_y=y - this.i_start_y;
this.calculateSize(0, this.i_new_size+(this.orientation()==1 ? diff_x : diff_y));
document.body.removeChild(this.getResizeLine());
}
}
ResizePane.prototype.getPane=function() {
if (this.i_pane==undefined) {
this.i_pane=document.createElement('DIV');
this.i_pane.className="ResizePane";
this.i_pane.style.width=this.width()+"px";
this.i_pane.style.height=this.height()+"px";
this.i_pane_divs=Array();
this.i_pane_divs[0]=document.createElement('DIV');
this.i_pane_divs[0].className="ResizePane_pane"+(this.orientation()==1 ? "_vertical" : "_horizontal");
if (this.i_content[0]!=undefined) {
this.i_pane_divs[0].appendChild(this.i_content[0]);
}
this.i_pane.appendChild(this.i_pane_divs[0]);
this.i_pane_resize=document.createElement('DIV');
this.i_pane_resize.className="ResizePane_resize"+(this.orientation()==1 ? "_vertical" : "_horizontal");
EventHandler.register(this.i_pane_resize, "onmousedown", this.handleMouseDown, this);
this.i_pane_resize.innerHTML="&nbsp;";
if (this.orientation()==1) {
this.i_pane_resize.style.width=ResizePane.resizeBarWidth+"px";
this.i_pane_resize.style.height=this.height()+"px";
}
else {
this.i_pane_resize.style.height=ResizePane.resizeBarWidth+"px";
this.i_pane_resize.style.width=this.width()+"px";
}
this.i_pane.appendChild(this.i_pane_resize);
this.i_pane_divs[1]=document.createElement('DIV');
this.i_pane_divs[1].className="ResizePane_pane"+(this.orientation()==1 ? "_vertical" : "_horizontal");
this.i_pane.appendChild(this.i_pane_divs[1]);
if (this.i_content[1]!=undefined) {
this.i_pane_divs[1].appendChild(this.i_content[1]);
}
this.calculateSize();
}
return this.i_pane;
}
JavaScriptResource.notifyComplete("./lib/components/Component.ResizePane.js");
var SimpleClickDataCache;
var mapPositionIndex;
function PopupSimpleClick(width) {
var scTree;
this.i_width=width;
this.i_height=200; 
this.i_listen_stack=new Array();
if (!SimpleClickDataCache && window.opener) {
SimpleClickDataCache=window.opener.top.SimpleClickDataCache;
mapPositionIndex=window.opener.top.mapPositionIndex;
}
if (!SimpleClickDataCache || !mapPositionIndex) {
SimpleClickDataCache=window.opener.parent.SimpleClickDataCache;
mapPositionIndex=window.opener.parent.mapPositionIndex;
}
if (!SimpleClickDataCache || !mapPositionIndex) {
alert('Unable to load simple click data.');
return false;
}
for (var method in SimpleClick2.prototype) {
if (!this[method]) {
this[method]=SimpleClick2.prototype[method];
}
}
scTree=this.getTree();
scTree.oncontextmenu=undefined;
scTree.onmousedown=undefined;
scTree.onmouseover=undefined;
scTree.onmouseout=undefined;
}
PopupSimpleClick.prototype.getContent=function () {
return this.getSimpleClick(true);
}
PopupSimpleClick.prototype.resize=function() {
var height=CursorMonitor.browserHeight();
this.height(height);
}
PopupSimpleClick.prototype.cleanup=function() {
this.getTree().dataModel(false);
return true;
}
PopupSimpleClick.mode=undefined;
PopupSimpleClick.preloadFinished=false;
PopupSimpleClick.preload=function(handler, gdspath) {
var mode=PopupSimpleClick.mode;
var jsFiles=new Array();
var cssFiles=new Array();
gdspath=gdspath ? gdspath : ".";
if (mode.toLowerCase()=='rich') {
jsFiles.push(gdspath+'/lib/components/Component.AccordionPane.js');
jsFiles.push(gdspath+'/src/Applications/OldContacts/components/Component.SimpleClick2.js');
}
else if (mode.toLowerCase()=='lite') {
jsFiles.push(gdspath+'/src/Applications/Contacts/components/Component.EmailSimpleClick.js');
}
else {
alert('No such mode "'+mode+'"!'+' Unable to preload PopupSimpleClick.');
return false;
}
var results=new Object();
results.files=jsFiles.concat(cssFiles);
results.status=new Array();
results.handler=handler;
var smartHandler=new SmartHandler(undefined,
PopupSimpleClick.preloadHandler, results);
var request;
for (var c=0; c < jsFiles.length; c++) {
request=new LiteJSRequest(jsFiles[c], smartHandler);
request.start();
results.status.push(false);
}
for (var c=0; c < cssFiles.length; c++) {
request=new LiteCSSRequest(cssFiles[c], smartHandler);
request.start();
results.status.push(false);
}
}
PopupSimpleClick.preloadHandler=function(request, results) {
if (PopupSimpleClick.preloadFinished) return;
var url=request.getUrl();
for (var c=0; c < results.files.length; c++) {
if (results.files[c]==url) {
results.status[c]=true;
break;
}
}
for (var c=0; c < results.status.length; c++) {
if (!results.status[c]) {
return;
}
}
PopupSimpleClick.preloadFinished=true;
results.handler.execute();
}
function LiteRequest() {
this.i_handler=new SmartHandler();
this.i_url="nothing?";
}
LiteRequest.prototype.getUrl=function() {
return this.i_url;
}
LiteRequest.prototype.complete=function() {
this.i_handler.execute(this);
}
LiteRequest.prototype.failed=function() {
alert('There was an error loading the application. Please referesh your browser window to continue.');
}
function LiteJSRequest(url, handler) {
this.i_url=url;
this.i_handler=handler;
this.i_script=undefined;
this.i_started=false;
}
LiteJSRequest.prototype=new LiteRequest();
LiteJSRequest.prototype.start=function() {
if (this.i_started) {
return;
}
this.i_started=true;
var me=this;
var script;
var head;
script=document.createElement('script');
script.type='text/javascript';
script.onerror=function() { me.failed(); };
script.onabort=function() { me.failed(); };
script.onload=function() { me.complete(); };
script.onreadystatechange=function() {
if (script.readyState=="loaded"
|| script.readyState=='complete') {
me.complete();
}
};
script.src=this.i_url;
this.i_script=script;
head=document.getElementsByTagName('head')[0];
head.appendChild(this.i_script);
}
function LiteCSSRequest(url, handler) {
this.i_url=url;
this.i_handler=handler;
this.i_request=undefined;
this.i_started=false;
}
LiteCSSRequest.prototype=new LiteRequest();
LiteCSSRequest.prototype.start=function() {
if (this.i_started) {
return;
}
this.i_started=true;
var me=this;
if (document.all) {
this.complete=LiteRequest.prototype.complete;
var link=document.createElement('link');
link.rel='stylesheet';
link.type='text/css';
link.onreadystatechange=function() {
if (link.readyState=="loaded"
|| link.readyState=='complete') {
me.complete();
}
};
link.href=this.i_url;
var head=document.getElementsByTagName('head')[0];
head.appendChild(link);
}
else {
var request;
request=new XMLHttpRequest();
request.onreadystatechange=function() {
if (request.readyState==4) {
if (request.status==200) {
me.complete(request.responseText);
}
else {
me.failed();
}
}
};
try {
request.open("get", this.i_url, true);
request.send(null);
}
catch (e) {
this.failed();
}
this.i_request=request;
}
}
LiteCSSRequest.prototype.complete=function(data) {
var head;
var style=document.createElement('style');
style.type='text/css';
head=document.getElementsByTagName('head')[0];
head.appendChild(style);
style.innerHTML=data;
this.i_handler.execute(this);
}
JavaScriptResource.notifyComplete("./lib/components/Component.PopupSimpleClick.js");
PopoutWindow.registerGroup("EmailAddressField", ["EmailAddressField",
"OptionBoxWrapper",
"ContactList"]);
function EmailAddressField(name, buttonString, collapsable, separate_button, button_width, text_class, simpleClickReference) {
this.i_separate_button=separate_button;
this.i_button_width=button_width;
this.i_address_box=undefined;
this.i_menu=undefined;
this.i_input=undefined;
this.i_submit=undefined;
this.i_type_ahead=undefined;
this.i_dropdown=undefined;
this.i_text_class=text_class;
this.i_dropDownHidden=true;
this.i_lastPos=undefined;
this.i_dummy_text=true;
this.i_visible=false;
this.i_name=name;
this.i_collapsable=collapsable;
this.i_on_click="";
this.i_blurred=true;
this.i_fieldLineHeight=(document.all ? 18 : 17);
this.i_maxRows=5;
this.i_fieldHeight=0;
this.i_scObject=null;
if (simpleClickReference) this.simpleClick(simpleClickReference);
this.i_autoCompleteChange=false;
this.i_simpleClickChange=false;
this.i_button_string=buttonString;
if(typeof SimpleClickDataCache=="undefined")
SimpleClickDataCache=window.opener.top.SimpleClickDataCache;
}
EmailAddressField.prototype.simpleClickChange=function(state) {
if (state!=undefined) {
this.i_simpleClickChange=state;
}
return this.i_simpleClickChange;
}
EmailAddressField.prototype.autoCompleteChange=function(state) {
if (state!=undefined) {
this.i_autoCompleteChange=state;
}
return this.i_autoCompleteChange;
}
EmailAddressField.prototype.simpleClick=function(sc) {
if (sc!=undefined && sc!=this.i_scObject) {
this.i_scObject=sc;
if (sc==null && this.i_scMouseOver) {
this.i_scMouseOver.unregister();
this.i_scMouseOut.unregister();
this.i_scMouseOver=undefined;
this.i_scMouseOut=undefined;
this.i_simpleClickFocus=undefined;
} else {
this.i_scMouseOver=EventHandler.register(sc.i_simple_click, "onmousedown", this.handleSimpleClickFocus, this);
this.i_scMouseOut=EventHandler.register(sc.i_simple_click, "onmouseup", this.handleSimpleClickBlur, this);
}
}
return this.i_scObject;
}
EmailAddressField.prototype.handleSimpleClickFocus=function(e) {
if (EmailAddressField.obj==this) {
this.i_simpleClickFocus=true;
this.simpleClickChange(true);
this.hideDropDown();
}
}
EmailAddressField.prototype.handleSimpleClickBlur=function(e) {
if (EmailAddressField.obj==this) {
this.i_simpleClickFocus=false;
this.simpleClickChange(false);
this.focusInput();
}
}
EmailAddressField.prototype.getContent=function() {
if(this.i_address_box==undefined) {
this.i_address_box=document.createElement("div");
this.i_address_box.className="EmailAddressField";
if (this.i_button_string!=undefined && !this.i_separate_button) {
this.i_address_box.appendChild(this.getButton());
}
this.i_dropdown=new OptionBoxWrapper(this);
this.i_input=document.createElement("textarea");
this.i_input.className="UniversalTextAreaInput "+(this.i_text_class!=undefined ? this.i_text_class : "EmailAddressField");
this.i_input.style.paddingTop=UniversalForm.textInputPaddingTop();
this.i_input.style.paddingBottom="2px";
this.i_input.style.width="100px";
this.i_input.style.lineHeight=(this.fieldLineHeight() < 1 ? "" : this.fieldLineHeight()+"px");
this.i_input.style.height=this.inputHeight()+"px";
if (document.all) {
this.i_input.style.overflow="hidden";
this.i_dropdown.getContent();
EventHandler.register(this.i_dropdown.i_select, "onblur", this.handleBlur, this);
EventHandler.register(this.i_input, "onkeydown", this.keyDown, this);
}
EventHandler.register(this.i_input, "onfocus", this.focusInput, this);
EventHandler.register(this.i_input, "onblur", this.handleBlur, this);
EventHandler.register(this.i_input, "onkeyup", this.keyUp, this);
EventHandler.register(this.i_input, "onkeypress", this.keyPress, this);
this.i_address_box.appendChild(this.i_input);
this.i_address_box.appendChild(document.createElement('br'));
this.i_address_box.style.display="none";
this.i_visible=false;
this.updateDummyText();
}
return this.i_address_box;
}
EmailAddressField.prototype.updateDummyText=function() {
if (this.i_dummy_text && !this.i_blurred) {
this.i_input.style.color="#000";
this.i_input.value="";
this.i_dummy_text=false;
} else if (this.i_blurred && this.i_input.value=="") {
this.i_input.style.color="#aaa";
this.i_input.value=this.i_name;
this.i_dummy_text=true;
}
}
EmailAddressField.prototype.getButton=function() {
if(this.i_button==undefined) {
var button_width=this.i_button_width;
if(button_width==undefined) {
var dimension=TextDimension(this.i_button_string, "styled_button");
button_width=dimension.width+13;
}
this.i_button=new UniversalButton(this.i_button_string);
this.i_button.minWidth(button_width);
this.i_button.height(this.inputHeight());
if (document.all) this.i_button.getButton().style.marginTop="1px";
EventHandler.register(this.i_button, "onclick", this.buttonClicked, this);
}
return this.i_button.getButton();
}
EmailAddressField.prototype.maxRows=function(newMaxRows){
if(newMaxRows!=undefined && newMaxRows!=this.i_maxRows){
this.i_maxRows=newMaxRows;
this.recalcLines();
}
return this.i_maxRows;
}
EmailAddressField.prototype.fieldLineHeight=function(newFieldLineHeight){
if(newFieldLineHeight!=undefined && this.i_fieldLineHeight!=newFieldLineHeight){
this.i_fieldLineHeight=newFieldLineHeight;
this.i_input.style.lineHeight=(newFieldLineHeight < 1 ? "" : newFieldLineHeight+"px");
this.recalcLines();	
}
return this.i_fieldLineHeight;
}
EmailAddressField.prototype.inputHeight=function(){
return this.i_fieldLineHeight+5;
}
EmailAddressField.prototype.fieldHeight=function(newFieldHeight){
if(newFieldHeight < this.inputHeight()) {
newFieldHeight=this.inputHeight();
}
if(newFieldHeight!=undefined && newFieldHeight!=this.i_fieldHeight) {
var oldHt=this.i_fieldHeight, ht=newFieldHeight;
this.i_fieldHeight=newFieldHeight;
if (this.i_input!=undefined) {
this.i_input.style.height=this.i_fieldHeight+"px";
}
if (this.onhtchange!=undefined) {
var o=new Object();
o.type="htchange";
o.oldHeight=oldHt;
o.height=ht;
this.onhtchange(o);
}
}
return this.i_fieldHeight;
}
EmailAddressField.prototype.value=function(newVal) {
if (newVal!=undefined && this.i_input.value!=newVal) {
if(newVal!="") {
this.focusInput();
this.i_input.value=newVal;
} else {
this.i_input.value=newVal;
this.blurInput();
}
this.recalcLines();
}
return (this.i_dummy_text)?"":this.i_input.value;
}
EmailAddressField.prototype.show=function() {
if(this.i_address_box!=undefined) {
this.i_address_box.style.display="block";
this.i_visible=true;
this.recalcLines();
this.i_address_box.style.left=this.i_input.offsetLeft;
this.i_address_box.style.top=this.i_input.offsetTop+this.i_input.offsetHeight;
}
}
EmailAddressField.prototype.hide=function() {
if(this.i_address_box!=undefined) {
this.i_address_box.style.display="none";
this.i_visible=false;
}
}
EmailAddressField.prototype.deferBlur=function(e) {
var me=this;
if (this.i_blurTimer) clearTimeout(this.i_blurTimer);
this.i_blurTimer=setTimeout(function () {
if (!me.i_simpleClickFocus && !me.i_dropdown.i_mouseSeen) {
me.blurInput();
me.autoCompleteChange(false);
}
this.i_blurTimer=undefined;
me=null;
}, 10);
}
EmailAddressField.prototype.handleBlur=function() {
if (document.all) {
var x=CursorMonitor.getX(),
y=CursorMonitor.getY(),
width=this.i_dropdown.getContent().offsetWidth,
height=this.i_dropdown.getContent().offsetHeight+this.i_input.offsetHeight,
top=-1 * this.i_input.offsetHeight, 
left=0,
target=this.i_dropdown.getContent();
while (target!=undefined) {
top+=target.offsetTop;
left+=target.offsetLeft;
target=target.offsetParent;
}
if (x < left || x > left+width || y < top || y > top+height) {
this.deferBlur();
}
} else {
this.deferBlur();
}
}
EmailAddressField.prototype.blurInput=function(force) {
if (!this.i_blurred || force===true) {
EmailAddressField.obj=null;
this.i_blurred=true;
if (this.i_blurTimer) {
clearTimeout(this.i_blurTimer);
this.i_blurTimer=undefined;
}
this.hideDropDown();
if (this.i_collapsable) this.recalcLines(1);
this.updateDummyText();
this.i_input.scrollTop=this.i_input.scrollHeight;
}
}
EmailAddressField.prototype.focusInput=function(force) {
if (force===true) {
this.i_blurred=true;
this.i_input.focus();
} else if (this.i_blurred) {
EmailAddressField.obj=this;
this.i_blurred=false;
this.updateDummyText();
this.i_input.scrollTop=this.i_input.scrollHeight;
if(this.onfieldfocus!=null) {
var o=new Object();
o.type="fieldfocus";
o.field=this;
this.onfieldfocus(o);
}
this.recalcLines();
}
return true;
}
EmailAddressField.prototype.onbuttonclick=null;
EmailAddressField.prototype.onfieldfocus=null;
EmailAddressField.prototype.onchange=null;
EmailAddressField.prototype.buttonClicked=function() {
this.focusInput(true);
if(this.onbuttonclick!=null) {
var o=new Object();
o.type="buttonclick";
o.field=this;
this.onbuttonclick(o);
}
}
EmailAddressField.prototype.onButtonClick=function(func) {
if (func==undefined)
return this.i_on_click;
else
this.i_on_click=func;
}
EmailAddressField.prototype.onFieldFocus=function(func) {
if (func==undefined)
return this.i_on_focus;
else
this.i_on_focus=func;
}
EmailAddressField.prototype.focus=function() {
this.i_input.focus();
}
EmailAddressField.prototype.keyDown=function(e) {
var k=(e.keyCode <=0) ? e.which : e.keyCode;
if (k==9) {
var cur=this.i_dropdown.value();
if(cur.email!=undefined) {
this.keyPress(e);
return false;
}
}
}
EmailAddressField.prototype.keyPress=function(e) {
if (this.i_simpleClickFocus) return;
var who=(e ? e.target: event.srcElement);
var k=(e.keyCode <=0) ? e.which : e.keyCode;
if (k==13 || k==9) { 
var cur=this.i_dropdown.value();
if (cur.name) {
this.autoCompleteChange(true);
if (cur.groups!=undefined) {
this.addContact('"'+cur.name+'" <'+cur.email+">");		
} else {
this.addGroup(cur.name);
}
}
this.hideDropDown();
} else if (k==27) { 
this.hideDropDown();
} else if (k==38 || k==40) { 
this.showDropDown();
this.i_dropdown.keySelect(e, k);
} else { 
return true;
}
e.cancelBubble=true;
if (k!=9) e.returnValue=false;
return false;
}
EmailAddressField.prototype.keyUp=function(e) {
if (this.i_simpleClickFocus) return;
var who=(e.target!=undefined ? e.target: event.srcElement);
var k=(e.keyCode <=0) ? e.which : e.keyCode;
if (k==9 || k==13 || k==27) { 
this.hideDropDown();
} else if (k!=33 && k!=34 && k!=38 && k!=40) { 
if (document.selection) {
this.i_lastPos=this.getCaretPos();
} else if (typeof who.selectionStart!="undefined") {
this.i_lastPos=who.selectionStart;
}
var me=this;
if (this.i_waitTimer) clearTimeout(this.i_waitTimer);
this.i_waitTimer=setTimeout(function() {
me.delayedAutoComplete();
me=null;
}, 250);
return true;
} else if (document.all && (k==38 || k==40)) {
this.i_dropdown.keySelect(e, k);
}
e.cancelBubble=true;
if (k!=9) e.returnValue=false;
return false;
}
EmailAddressField.prototype.delayedAutoComplete=function() {
var prevSep=this.findPreviousSeperator();
this.autoComplete(trim(this.i_input.value.substring(prevSep, this.i_lastPos)));
this.i_waitSearchString=undefined;
this.i_waitTimer=undefined;
this.simpleClickChange(false);
this.autoCompleteChange(false);
this.recalcLines();
this.handleChange();
}
EmailAddressField.prototype.getCaretPos=function() {
var pObj=this.i_input;
var sOldText=pObj.value;
var objRange=document.selection.createRange();
var sOldRange=objRange.text;
var sWeirdString='#%~';
objRange.text=sOldRange+sWeirdString;
objRange.moveStart('character',(0-sOldRange.length-sWeirdString.length));
var sNewText=pObj.value;
objRange.text=sOldRange;
for (var i=0;i<=sNewText.length;i++)
{
var sTemp=sNewText.substring(i,i+sWeirdString.length);
if (sTemp==sWeirdString)
{
var cursorPos=(i-sOldRange.length);
var txtRange=pObj.createTextRange();
var lfCount=this.intCharCount(txtRange.text.substr(0, cursorPos), "\n");                  
cursorPos-=lfCount;
return cursorPos;
}
}
}
EmailAddressField.prototype.intCharCount=function(pObj, pSearchChar) {
var remainingString=pObj;
var rCharCount=new Number();
rCharCount=0;
while (remainingString.indexOf(pSearchChar)>-1)
{
rCharCount++;
remainingString=remainingString.substr(remainingString.indexOf(pSearchChar)+1);
}
return (rCharCount);
}
EmailAddressField.prototype.findPreviousSeperator=function() {
var cur=this.i_input.value;
if (this.i_lastPos==undefined)
this.i_lastPos=cur.length;
var i=this.i_lastPos-1;
var insideQuotes=false;
for (;i>0;i--) {
if(cur.charAt(i)=='"') {
if (insideQuotes==false)
insideQuotes=true;
else
insideQuotes=false;
} else if (cur.charAt(i)==',') {
if (insideQuotes==false) {
i++;
break;
}
} else if (cur.charAt(i)==';') {
i++;
break;
}
}
return i;
}
EmailAddressField.autoCompleteFilter=/([.*+?|(){}[\]\\])/g;
EmailAddressField.prototype.autoComplete=function(soFar) {
if (soFar=="") {
this.hideDropDown();
} else {
var safer=soFar.replace(EmailAddressField.autoCompleteFilter, '\\$1');
var re=new RegExp("(\\b"+safer+")","i");
this.i_dropdown.removeOptions();
var contacts=ContactList.lookup(soFar);
for (var a in contacts) {
if (typeof contacts[a]=="object" && contacts[a].name!=undefined) {
this.i_dropdown.appendOption((contacts[a].name+" &lt;"+contacts[a].email+"&gt;").replace(re, "<b>$1</b>"), contacts[a]);
}
}
var groups=ContactList.lookupGroup(soFar);
for (var a in groups) {
if (typeof groups[a]=="object" && groups[a].name!=undefined && groups[a].name!="All") {
this.i_dropdown.appendOption(groups[a].name.replace(re, "<b>$1</b>")+" (group)" , groups[a], "group");
}
}
if (this.i_dropdown.getCount()) {
this.i_dropdown.selected(0);
this.showDropDown();
} else {
this.hideDropDown();
}
}
}
EmailAddressField.prototype.addContact=function(c) {
if (!this.autoCompleteChange()) {
this.simpleClickChange(true);
}
this.focusInput();
this.hideDropDown();
var i=this.findPreviousSeperator();
var cur=this.i_input.value;
this.i_input.value=(cur.substring(0,i)+c+";"+cur.substr(this.i_lastPos));
this.i_lastPos+=1+c.length;
this.recalcLines();
this.handleChange();
}
EmailAddressField.prototype.addGroup=function(g) {
if(!this.autoCompleteChange()) {
this.simpleClickChange(true);
}
this.focusInput();
this.hideDropDown();
var i=this.findPreviousSeperator();
var cur=this.i_input.value;
this.i_input.value=(cur.substring(0,i)+g+";"+cur.substr(this.i_lastPos));
this.i_lastPos+=1+g.length;
this.recalcLines();
this.handleChange();
}
EmailAddressField.prototype.getNewAddresses=function() {
}
EmailAddressField.prototype.setCurrentTextAsContact=function() {
}
EmailAddressField.prototype.width=function(width) {
if (width!=undefined && this.i_width!=width){
this.i_width=width;
if(typeof this.i_input=="undefined" ||
typeof this.i_dropdown=="undefined") {
this.getContent();
}
this.i_input.style.width=width;
this.i_dropdown.getContent().style.width=width;
this.i_dropdown.width(width);
this.i_dropdown.resizeHeight();
if (this.i_collapsable && this.i_blurred) {
this.recalcLines(1);
}else{
this.recalcLines();
}
}
return this.i_width;
}
EmailAddressField.prototype.resize=EmailAddressField.prototype.width;
EmailAddressField.prototype.recalcLines=function(lines) {
if (lines==undefined) {
if (this.i_input==undefined) this.getContent();
var textClass=(this.i_text_class!=undefined ? this.i_text_class : "EmailAddressField_text");
var size=TextDimension(htmlEncode(this.i_input.value), textClass, parseInt(this.i_input.offsetWidth));
lines=1+Math.floor(size.height / this.fieldLineHeight());
if (lines > this.maxRows()) lines=this.maxRows();
}
if (document.all) {
this.i_input.style.overflow=(lines==this.maxRows() ? "auto" : "hidden");
}
this.fieldHeight((lines * this.fieldLineHeight())+(document.all ? lines+1 : 7));
if (this.simpleClickChange() || this.autoCompleteChange()) {
this.i_input.scrollTop=this.i_input.scrollHeight;
}
}
EmailAddressField.prototype.showDropDown=function() {
if (this.i_dropDownHidden) {
this.i_dropDownHidden=false;
if (this.i_dropdown.getCount()>0){
this.i_dropdown.resizeHeight();
this.i_dropdown.showForElement(this.i_input);
this.i_dropdown.i_select.scrollTop=0;
}
}
}
EmailAddressField.prototype.hideDropDown=function() {
if (!this.i_dropDownHidden) {
this.i_dropDownHidden=true;
this.i_dropdown.getContent().style.display="none";
this.i_dropdown.removeOptions();
if (this.i_waitTimer) clearTimeout(this.i_waitTimer);
this.i_waitTimer=undefined;
}
}
EmailAddressField.prototype.handleChange=function() {
if (this.onchange!=null) {
var o=new Object();
o.type="change";
o.field=this;
this.onchange(o);
}
}
function ContactList() {
}
ContactList.normalize=function(key) { return key.replace(/[^a-z0-9]/,"."); }
ContactList.create=function() {
var choices='abcdefghijklmnopqrstuvwxyz0123456789.';
ContactList.lookupMaster={};
ContactList.lookupGroupMaster={};
for (var i=choices.length;i>=0;i--) {
ContactList.lookupMaster[choices.charAt(i)]={};
ContactList.lookupGroupMaster[choices.charAt(i)]=[];
for (var j=choices.length;j>=0;j--) 
ContactList.lookupMaster[choices.charAt(i)][choices.charAt(j)]=new Array();
}
var lists=new Array();
var name_hash=new Array();
lists[0]=SimpleClickDataCache.getSortedTypeList("contact","personal");
lists[1]=SimpleClickDataCache.getSortedTypeList("contact","enterprise");
lists[2]=SimpleClickDataCache.getSortedTypeList("contact","shared");
for (var i=0;i<3;i++) {
var curList=lists[i];
for (var j=curList.length-1;j>=0;j--)  {
var current=curList[j];
var name=ContactList.normalize(current.name.toLowerCase());
var email=ContactList.normalize(current.email.toLowerCase());
if(name_hash[name]==undefined || name_hash[name][email]==undefined) {
var splitName=current.name.toLowerCase().split(',');
if (splitName.length>1) {
var firstName=ContactList.normalize(splitName[1].replace(/^ /,""));
var tmpList=ContactList.lookupMaster[firstName.charAt(0)][firstName.charAt(1)];
if(tmpList!=undefined) {
tmpList.push(current);
}
}
else {
var splitName=current.name.toLowerCase().split(' ');
if (splitName.length>1) {
var firstName=ContactList.normalize(splitName[1].replace(/^ /,""));
var tmpList=ContactList.lookupMaster[firstName.charAt(0)][firstName.charAt(1)];
if(tmpList!=undefined) {
tmpList.push(current);
}
}
}
if(ContactList.lookupMaster[name.charAt(0)]!=undefined && 
ContactList.lookupMaster[name.charAt(0)][name.charAt(1)]!=undefined && 
ContactList.lookupMaster[email.charAt(0)]!=undefined && 
ContactList.lookupMaster[email.charAt(0)][email.charAt(1)]!=undefined) 
{
var tmpList=ContactList.lookupMaster[name.charAt(0)][name.charAt(1)];
if(tmpList!=undefined) {
tmpList.push(current);
}
tmpList=ContactList.lookupMaster[email.charAt(0)][email.charAt(1)];
if(tmpList!=undefined) {
tmpList.push(current);
}
if(name_hash[name]==undefined) {
name_hash[name]=new Array();
}
if(name_hash[name][email]==undefined) {
name_hash[name][email]=true;
}
}
}
}
}
lists=new Array();
lists[0]=SimpleClickDataCache.getSortedTypeList("group","personal");
lists[1]=SimpleClickDataCache.getSortedTypeList("group","enterprise");
lists[2]=SimpleClickDataCache.getSortedTypeList("group","shared");
for (var i=0;i<3;i++) {
var curList=lists[i];
for (var j=curList.length-1;j>=0;j--)  {
var current=curList[j];
var name=ContactList.normalize(current.name.toLowerCase());
var tmpList=ContactList.lookupGroupMaster[name.charAt(0)];
if(tmpList!=undefined) {
tmpList.push(current);
}
}
}
}
ContactList.lookup=function(nm) {
if (ContactList.lookupMaster==undefined)
ContactList.create();
var retVal=new Array();
if (nm.length<2)
return retVal;
nm=nm.toLowerCase();
var nmKey=ContactList.normalize(nm);
var list=ContactList.lookupMaster[nmKey.charAt(0)][nmKey.charAt(1)];
if (list==undefined || list.length==0)
return retVal;
for (var i=list.length-1;i>=0;i--) {
var thisOne=list[i];
var splitName=thisOne.name.toLowerCase().split(',');
var splitSpaceName=thisOne.name.toLowerCase().split(' ');
var fullName=thisOne.name.replace(/  /,".").toLowerCase();
fullName=fullName.replace(/, /,".").toLowerCase();
if ((thisOne.name.substr(0,nm.length).toLowerCase()==nm) || 
(thisOne.email.substr(0,nm.length).toLowerCase()==nm) || 
((splitName.length>1) && splitName[1].replace(/^ /,"").substr(0,nm.length).toLowerCase()==nm) ||
((splitSpaceName.length>1) && splitSpaceName[1].replace(/^ /,"").substr(0,nm.length).toLowerCase()==nm)	||
(fullName.substr(0,nmKey.length).toLowerCase()==nmKey)) 
{
var doIt=true;
for (var j=retVal.length-1;doIt && j>=0;j--)
if (retVal[j]==thisOne)
doIt=false;
if (doIt)
retVal.push(list[i]);
}
}
return retVal;
}
ContactList.lookupGroup=function(nm) {
if (ContactList.lookupGroupMaster==undefined)
ContactList.create();
var retVal=new Array();
if (nm.length<2)
return retVal;
var nmKey=ContactList.normalize(nm);
var list=ContactList.lookupGroupMaster[nmKey.charAt(0)];
if(list==undefined) {
return retVal;
}
for (var i=list.length-1;i>=0;i--) {
var thisOne=list[i];
if (thisOne.name.substr(0,nm.length).toLowerCase()==nm) {
var doIt=true;
for (var j=retVal.length-1;doIt && j>=0;j--)
if (retVal[j]==thisOne)
doIt=false;
if (doIt)
retVal.push(list[i]);
}
}
return retVal;
}
ContactList.invalidate=function() {
ContactList.lookupMaster=undefined;
ContactList.lookupGroupMaster=undefined;
}
try {
if (window && window.opener && window.opener.ContactList)
ContactList=window.opener.ContactList;
} catch(e) {
}
function OptionBoxWrapper(p) {
this.i_options=Array();
this.i_selectedOptionIndex=-1;
this.i_parent=p;
this.i_option_height=20;
}
OptionBoxWrapper.prototype.selected=function(val) {
if (val!=undefined) {
if (this.i_selectedOptionIndex>-1) {
this.i_options[this.i_selectedOptionIndex].bt.selected=false;
this.i_options[this.i_selectedOptionIndex].className="OptionBoxOption";
}
this.i_selectedOptionIndex=val;
if (this.i_selectedOptionIndex>-1) {
this.i_options[this.i_selectedOptionIndex].bt.selected=true;
this.i_options[this.i_selectedOptionIndex].className="OptionBoxOption_selected";
}
}
return this.i_selectedOptionIndex;
}
OptionBoxWrapper.prototype.getCount=function() {
return this.i_options.length;
}
OptionBoxWrapper.prototype.getContent=function() {
if(this.i_wrapper==undefined) {
this.i_wrapper=document.createElement("div");
this.i_select=document.createElement('div');
EventHandler.register(this.i_select, "onmouseover", this.handleMouse, this);
EventHandler.register(this.i_select, "onmouseout", this.handleMouse, this);
this.i_select.className="OptionBox_options";
this.i_select.style.height="200px";
this.i_select.style.width="100px";
this.i_select.style.overflow="hidden";
this.i_wrapper.style.display="none";
this.i_wrapper.style.position="absolute";
this.i_wrapper.style.zIndex="10000";
this.i_wrapper.appendChild(this.i_select);
}
return this.i_wrapper;	
}
OptionBoxWrapper.prototype.handleMouse=function(e) {
this.i_mouseSeen=(e.type=="mouseover");
}
OptionBoxWrapper.prototype.value=function() {
return(this.i_selectedOptionIndex > -1 ? this.i_options[this.i_selectedOptionIndex].bt.value : "");
}
OptionBoxWrapper.prototype.removeOptions=function() {
for(var x=this.i_options.length - 1; x >=0; --x) {
if (this.i_options[x].bt) this.i_options[x].bt=undefined;
this.i_select.removeChild(this.i_options[x]);
}
this.i_options=[];
this.i_selectedOptionIndex=-1;
}
OptionBoxWrapper.prototype.handleClick=function(e) {
this.i_parent.autoCompleteChange(true);
if (e.originalScope.bt.type=='group') {
this.i_parent.addGroup(e.originalScope.bt.value.name);
} else {
this.i_parent.addContact(e.originalScope.bt.name);
}
this.i_parent.autoCompleteChange(false);
this.i_parent.focusInput(true);
this.i_mouseSeen=false;
e.cancelBubble=true;
e.returnValue=false;
return false;
}
OptionBoxWrapper.prototype.appendOption=function(name, value, type) {
var option=document.createElement('div');
option.innerHTML=name;
option.className="OptionBoxOption";
option.style.height=this.i_option_height+"px";
option.style.lineHeight=(this.i_option_height+1)+"px";
option.bt=new Object();
option.bt.selected=false;
option.bt.value=value;
option.bt.type=type;
EventHandler.register(option, "onclick",  this.handleClick, this);
option.bt.name=(type=='group' ? name : '"'+value.name+'" <'+value.email+">");
this.i_options.push(option);
this.i_select.appendChild(option);
}
OptionBoxWrapper.prototype.keySelect=function(event, keycode) {
if(keycode==40) {
this.moveSel(+1);
}else if(keycode==38) {
this.moveSel(-1);
}
}
OptionBoxWrapper.prototype.width=function(width) {
this.i_wrapper.style.width=width;
this.i_select.style.width=width;
}
OptionBoxWrapper.prototype.resizeHeight=function() {
var height=this.i_options.length * this.i_option_height;
var max_height=10 * this.i_option_height;
if(document.all) {
height+=2;
max_height+=2;
}
if(height > max_height) {
this.i_select.style.overflow="auto";
height=max_height;
} else {
this.i_select.style.overflow="hidden";
}
this.i_wrapper.style.height=height+"px";
this.i_select.style.height=height+"px";
}
OptionBoxWrapper.prototype.moveSel=function(increment) {
if(this.i_selectedOptionIndex > -1) {
var moveTo=this.i_selectedOptionIndex+increment;
if(typeof this.i_options[moveTo]=="undefined") {
if(increment > 0) {
moveTo=0;
}else{
moveTo=this.i_options.length - 1;
}
}
if(typeof this.i_options[moveTo]!="undefined") {
this.i_options[this.i_selectedOptionIndex].bt.selected=false;
this.i_options[this.i_selectedOptionIndex].className="OptionBoxOption";
this.i_selectedOptionIndex=moveTo;
this.i_options[this.i_selectedOptionIndex].bt.selected=true;
this.i_options[this.i_selectedOptionIndex].className="OptionBoxOption_selected";
}
}else{
var moveTo=0;
if(increment < 0) {
moveTo=this.i_options.length - 1;
}
if(typeof this.i_options[moveTo]!="undefined") {
this.i_options[moveTo].bt.selected=true;
this.i_options[moveTo].className="OptionBoxOption_selected";
this.i_selectedOptionIndex=moveTo;
}
}
this.i_select.scrollTop=(this.i_selectedOptionIndex * 16);
}
OptionBoxWrapper.prototype.showForElement=function(el){
if(el!=undefined){
var originalElement=el;
var size={left: 0, top: 0};
while(el!=document.body && el.offsetParent!=null){
size.left+=el.offsetLeft;
size.top+=el.offsetTop;
el=el.offsetParent;
}
myEl=this.getContent();
if(myEl.parentNode==null){
el.appendChild(myEl); 
}else if(document.all){
myEl.parentNode.removeChild(myEl);
el.appendChild(myEl);
el.style.display="block";
}
myEl.style.left=size.left+"px";
myEl.style.top=(size.top+originalElement.offsetHeight)+"px";
this.width(originalElement.offsetWidth);
myEl.style.display="block";
}
}
JavaScriptResource.notifyComplete("./lib/components/Component.EmailAddressField.js");
function ColorPallet(width, height, max_colors) {
this.i_width=width;
this.i_height=height;
this.i_max_colors=(max_colors==undefined ? 32 : max_colors);
this.i_colors=Array();
this.i_color_box=Array();
}
ColorPallet.prototype.onselect=null;
ColorPallet.padding=4;
ColorPallet.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_pallet!=undefined) {
this.i_pallet.style.width=this.width()+"px";
}
this.buildPallet();
}
return this.i_width;
}
ColorPallet.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_pallet!=undefined) {
this.i_pallet.style.height=this.height()+"px";
}
this.buildPallet();
}
return this.i_height;
}
ColorPallet.prototype.maxColors=function(maxColors) {
if (maxColors!=undefined) {
this.i_max_colors=maxColors;
this.buildPallet();
}
return this.i_max_colors;
}
ColorPallet.prototype.clearColors=function() {
this.i_colors=Array();
this.buildPallet();
}
ColorPallet.prototype.colors=function(index) {
if (index!=undefined) {
return this.i_colors[index];
}
return this.i_colors;
}
ColorPallet.prototype.addColor=function(color, beforeColor) {
var append=true;
if (beforeColor!=undefined) {
for (var x=0; x < this.i_colors.length; x++) {
if (this.i_colors[x]==beforeColor) {
this.i_colors.splice(x, 0, color);
append=false;
break;
}
}
}
if (append) {
this.i_colors[this.i_colors.length]=color;
}
return color;
}
ColorPallet.prototype.removeColor=function(color) {
for (var x=0; x < this.i_colors.length; x++) {
if (this.i_colors[x]==color) {
this.i_colors.splice(x, 1);
return true;
}
}
return false;
}
ColorPallet.prototype.handleColorSelect=function(e) {
if (this.onselect!=undefined) {
var o=new Object();
o.type="select";
o.color=e.originalScope.i_color;
o.pallet=this;
this.onselect(o);
}
}
ColorPallet.prototype.buildPallet=function() {
if (this.i_pallet!=undefined) {
var f=Math.ceil(Math.sqrt(this.maxColors() / (this.width() / this.height())));
var rows=f;
var cols=Math.ceil(this.maxColors() / f);
var sz_h=Math.floor(this.height() / rows);
var sz_w=Math.floor(this.width() / cols);
var box_size=0;
if (sz_w > sz_h) {
box_size=sz_h;
}
else {
box_size=sz_w;
}
var c_width=Math.ceil((box_size * cols)+ColorPallet.padding);
var c_height=Math.ceil((box_size * rows)+ColorPallet.padding);
this.i_pallet_cont.style.width=c_width+"px";
this.i_pallet_cont.style.height=c_height+"px";
this.i_pallet_cont.style.marginLeft=Math.floor((this.width() - c_width) / 2)+"px";
this.i_pallet_cont.style.marginTop=Math.floor((this.height() - c_height) / 2)+"px";
for (var x=0; x < this.i_color_box.length; x++) {
this.i_color_box[x].style.display="none";
}
for (var x=0; x < this.i_max_colors; x++) {
if (this.i_color_box[x]==undefined) {
this.i_color_box[x]=document.createElement('DIV');
this.i_color_box[x].className="ColorPallet_box";
this.i_color_box[x].innerHTML="&nbsp;";
EventHandler.register(this.i_color_box[x], "onclick", this.handleColorSelect, this);
this.i_pallet_cont.appendChild(this.i_color_box[x]);
}
var color_code="#FFFFFF";
var cc=this.i_colors[x];
if (cc!=undefined && cc.getColorPreview!=undefined) {
cc=cc.getColorPreview();
}
if (cc!=undefined) {
if (cc.splice!=undefined) {
color_code="rgb("+cc.join(",")+")";
}
else {
color_code=cc;
}
}
this.i_color_box[x].i_color=this.i_colors[x];
this.i_color_box[x].style.backgroundColor=color_code;
this.i_color_box[x].style.display="";
this.i_color_box[x].style.width=(box_size - ColorPallet.padding)+"px";
this.i_color_box[x].style.height=(box_size - ColorPallet.padding)+"px";
this.i_color_box[x].style.marginLeft=ColorPallet.padding+"px";
this.i_color_box[x].style.marginTop=ColorPallet.padding+"px";
}
}
}
ColorPallet.prototype.getPallet=function() {
if (this.i_pallet==undefined) {
this.i_pallet=document.createElement('DIV')
this.i_pallet.className="ColorPallet";
this.i_pallet.style.width=this.width()+"px";
this.i_pallet.style.height=this.height()+"px";
this.i_pallet_cont=document.createElement('DIV');
this.i_pallet_cont.className="ColorPallet_container";
this.i_pallet.appendChild(this.i_pallet_cont);
this.buildPallet();
}
return this.i_pallet;
}
JavaScriptResource.notifyComplete("./lib/components/Component.ColorPallet.js");
PopoutWindow.registerGroup("UniversalButton", ["UniversalButton"]);
function UniversalButton(label, iconClass, iconWidth, context, enabled, height, float, tipText) {
this.i_iconClass=iconClass;
this.i_iconWidth=(iconWidth==undefined ? 0 : iconWidth);
this.i_context=context;
this.i_enabled=(enabled!=undefined ? enabled : true);
this.i_height=(height!=undefined ? height : 18);
this.i_float=float;
this.i_padding=UniversalButton.i_padding;
this.i_context_width=UniversalButton.i_context_width;
this.i_hover_state=false;
this.i_tip=tipText;
this.i_labelWidth=0;
this.i_visible=true;
this.i_allow_overflow=false;
this.i_min_width=70;
this.label(label);
this.i_handlers=[];
this.updateWidth();
}
UniversalButton.prototype.onclick=null;
UniversalButton.i_padding=2;
UniversalButton.i_context_width=12;
UniversalButton.iconPadding=3;
UniversalButton.labelRightPad=3;
UniversalButton.prototype.left=function() {
var me=this.getButton();
var lf=0;
while (me!=null) {
lf+=parseInt(me.offsetLeft);
me=me.offsetParent;
}
return lf;
}
UniversalButton.prototype.top=function() {
var me=this.getButton();
var tp=0;
while (me!=null) {
tp+=parseInt(me.offsetTop);
me=me.offsetParent;
}
return tp;
}
UniversalButton.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_button!=undefined) {
this.i_button.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
UniversalButton.prototype.hide=function() { this.visible(false); }
UniversalButton.prototype.show=function() { this.visible(true); }
UniversalButton.prototype.isSmall=function(small) {
return (this.height() < 18);
}
UniversalButton.prototype.isToolbar=function(is_toolbar) {
if(is_toolbar!=undefined && is_toolbar!=this.i_is_toolbar) {
this.i_is_toolbar=is_toolbar;
if(this.i_button_label) {
this.i_button_label.className=this.labelClass();
}
this.label(this.label());
}
return this.i_is_toolbar;
}
UniversalButton.prototype.padding=function(padding) {
if (padding!=undefined && this.i_padding!=padding) {
this.i_padding=padding;
this.updateWidth();
if (this.i_button!=undefined) {
this.i_button_padding_top.style.height=this.padding()+"px";
this.i_button_padding_left.style.width=this.padding()+this.i_extra_width_padding+"px";
this.i_button_padding_left.style.height=(this.height() - this.padding() - 2)+"px";
this.i_button_icon.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_button_label.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_context_trigger.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_button_label.style.lineHeight=(this.height() - (this.padding() * 2) - 1)+"px";
}
}
return this.i_padding;
}
UniversalButton.prototype.contextTriggerWidth=function(width) {
if (width!=undefined && this.i_context_width!=width) {
this.i_context_width=width;
this.updateWidth();
if (this.i_button!=undefined){
if (this.contextTriggerWidth()==0 || this.context()==undefined) {
this.i_context_trigger.style.width="1px";
this.i_context_trigger.style.display="none";
}
else {
this.i_context_trigger.style.width=this.contextTriggerWidth()+"px";
this.i_context_trigger.style.display="";
}
}
}
return this.i_context_width;
}
UniversalButton.prototype.tipText=function(text) {
if (text!=undefined) {
this.i_tip=text;
if (this.i_tip_obj!=undefined) {
this.i_tip_obj.tip(text);
}
}
return this.i_tip;
}
UniversalButton.prototype.label=function(label) {
if (label!=undefined) {
this.i_label=label;
var td=TextDimension(label, this.labelClass(true));
this.i_labelWidth=td.width+UniversalButton.labelRightPad+2;
if (this.i_button!=undefined) {
this.i_button_label.style.width=(this.i_labelWidth - 2)+"px";
this.i_button_label.innerHTML=this.label();
}
this.updateWidth();
}
return this.i_label;
}
UniversalButton.prototype.labelClass=function(adjust) {
var class_name="UniversalButton_label";
if(this.isSmall()) {
class_name+="_small";
}
if(adjust) {
class_name+="_adjust";
}
if(this.isToolbar()) {
class_name+=" UniversalButton_label_toolbar";
if(adjust) {
class_name+="_adjust";
}
}
return class_name;
}
UniversalButton.prototype.iconClass=function(iconClass) {
if (iconClass!=undefined) {
this.i_iconClass=iconClass;
if (this.i_button!=undefined) {
this.i_button_icon.className="UniversalButton_icon"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
}
}
return this.i_iconClass;
}
UniversalButton.prototype.iconWidth=function(iconWidth) {
if (iconWidth!=undefined && this.i_iconWidth!=iconWidth) {
this.i_iconWidth=iconWidth;
this.updateWidth();
if (this.i_button!=undefined) {
if (this.iconWidth()==0) {
this.i_button_icon.style.width="1px";
this.i_button_icon.style.display="none";
}
else {
this.i_button_icon.style.width=(this.iconWidth()+(this.i_labelWidth > 6 ?  UniversalButton.iconPadding : 0))+"px";
this.i_button_icon.style.display="";
}
}
}
return this.i_iconWidth;
}
UniversalButton.prototype.context=function(context) {
if (context!=undefined) {
this.i_context=context;
this.updateWidth();
if (this.i_button!=undefined) {
if (this.contextTriggerWidth()==0 || this.context()==undefined) {
this.i_context_trigger.style.width="1px";
this.i_context_trigger.style.display="none";
}
else {
this.i_context_trigger.style.width=this.contextTriggerWidth()+"px";
this.i_context_trigger.style.display="";
}
}
}
return this.i_context;
}
UniversalButton.prototype.enabled=function(enabled) {
if (enabled!=undefined) {
this.i_enabled=enabled;
if (this.i_button!=undefined) {
this.i_button.className="UniversalButton"+((this.hoverState()==true && this.enabled()) ? "_hover" : "");
if (!this.enabled()){
this.i_button.className+=" UniversalButton_disabled";
}
}
}
return this.i_enabled;
}
UniversalButton.prototype.height=function(height) {
if (height!=undefined && this.i_height!=height) {
this.i_height=height;
this.label(this.label());
this.updateWidth();
if (this.i_button!=undefined) {
this.i_button.style.height=(height - 2)+"px";
this.i_button_padding_top.style.height=this.padding()+"px";
this.i_button_padding_left.style.height=(this.height() - this.padding() - 2)+"px";
this.i_button_icon.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_button_label.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_context_trigger.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_button_label.style.lineHeight=(this.height() - (this.padding() * 2) - 1)+"px";
this.i_button_label.className=this.labelClass();
}
}
return this.i_height;
}
UniversalButton.prototype.minWidth=function(min) {
if(min!=undefined && this.i_min_width!=min) {
this.i_min_width=min;
this.updateWidth();
}
return this.i_min_width;
}
UniversalButton.prototype.width=function() {
return (this.i_label.length > 0 ? (this.i_button_width < this.i_min_width ? this.i_min_width : this.i_button_width) : this.i_button_width);
}
UniversalButton.prototype.updateWidth=function() {
var oldWidth=this.i_button_width;
this.i_button_width=(this.padding() * 2)+this.i_labelWidth+this.iconWidth()+((this.iconWidth() > 0 && this.i_labelWidth > 6) ? UniversalButton.iconPadding : 0)+(this.context()!=undefined ? this.contextTriggerWidth() : 0)+2;
this.i_extra_width_padding=3;
var origDiff=this.i_button_width - this.i_labelWidth;
var newDiff=this.width() - this.i_labelWidth;
var diffDiff=newDiff - origDiff;
if(diffDiff > 0) {
if (this.iconClass()==undefined) {
this.i_extra_width_padding+=(diffDiff / 2);
}
else {
this.i_extra_width_padding=(diffDiff / 2);
}
}
if (this.i_button!=undefined) {
this.i_button.style.width=(this.i_label.length > 0 ? (this.i_button_width < this.i_min_width ? this.i_min_width : this.i_button_width) : this.i_button_width)+"px";
this.i_button_padding_top.style.height=this.padding()+"px";
}
if (oldWidth!=this.i_button_width) {
if (this.onresize!=undefined) {
var o=new Object();
o.type="resize";
o.button=this;
this.onresize(o);
}
}
return this.i_button_width;
}
UniversalButton.prototype.float=function(float) {
if (float!=undefined) {
if (float==false) {
float=undefined;
}
this.i_float=float;
if (this.i_button!=undefined) {
if (document.all) {
this.i_button.style.styleFloat=(float==undefined ? "" : float);
}
else {
this.i_button.style.cssFloat=(float==undefined ? "" : float);
}
}
}
return this.i_float;
}
UniversalButton.prototype.hoverState=function(state) {
if (state!=undefined) {
this.i_hover_state=state;
if (this.i_button!=undefined) {
this.i_button.className="UniversalButton"+((this.hoverState()==true && this.enabled()) ? "_hover" : "");
if (!this.enabled()){
this.i_button.className+=" UniversalButton_disabled";
}
}
}
return this.i_hover_state;
}
UniversalButton.prototype.handleMouseOver=function(e) {
this.hoverState(true);
}
UniversalButton.prototype.handleMouseOut=function(e) {
this.hoverState(false);
}
UniversalButton.prototype.handleButtonContext=function(e) {
if (this.context()!=undefined && this.enabled()) {
this.context().show(this.left(), this.top()+this.height());
}
}
UniversalButton.prototype.handleButtonClick=function(e) {
if (this.onclick!=undefined && this.enabled()) {
e.buttonObject=this;
this.onclick(e);
}
}
UniversalButton.prototype.allowOverflow=function(state) {
if (state!=undefined) {
this.i_allow_overflow=state;
}
return this.i_allow_overflow;
}
UniversalButton.prototype.destructor=function() {
for (var i=0; i < this.i_handlers.length;++i) {
this.i_handlers[i].unregister();
}
this.i_handlers=[];
}
UniversalButton.prototype.getButton=UniversalButton.prototype.getItem=function() {
if (this.i_button==undefined) {
this.i_button=document.createElement('DIV');
this.i_button.className="UniversalButton"+((this.hoverState()==true && this.enabled()) ? "_hover" : "");
this.i_button.style.width=this.width()+"px";
this.i_button.style.height=this.height()+"px";
this.i_button.style.display=(this.visible() ? "" : "none");
this.i_handlers.push(EventHandler.register(this.i_button, "onmouseover", this.handleMouseOver, this));
this.i_handlers.push(EventHandler.register(this.i_button, "onmouseout", this.handleMouseOut, this));
this.i_handlers.push(EventHandler.register(this.i_button, "onclick", this.handleButtonClick, this));
this.i_tip_obj=new ToolTip(this.i_button);
this.i_tip_obj.tip(this.tipText());
if (this.float()!=undefined) {
if (document.all) {
this.i_button.style.styleFloat=(this.float()==undefined ? "" : this.float());
}
else {
this.i_button.style.cssFloat=(this.float()==undefined ? "" : this.float());
}
}
this.i_button_padding_top=document.createElement('DIV');
this.i_button_padding_top.className="UniversalButton_top_padding";
this.i_button_padding_top.style.width=(this.width() - 2)+"px";
this.i_button_padding_top.style.height=this.padding()+"px";
this.i_button_padding_top.innerHTML="&nbsp;";
this.i_button.appendChild(this.i_button_padding_top);
this.i_button_padding_left=document.createElement('DIV');
this.i_button_padding_left.className="UniversalButton_left_padding";
this.i_button_padding_left.style.width=this.padding()+this.i_extra_width_padding+"px";
this.i_button_padding_left.style.height=(this.height() - this.padding() - 2)+"px";
this.i_button_padding_left.innerHTML="&nbsp;";
this.i_button.appendChild(this.i_button_padding_left);
this.i_button_icon=document.createElement('DIV');
this.i_button_icon.className="UniversalButton_icon"+(this.iconClass()!=undefined ? " "+this.iconClass() : "");
if (this.iconWidth()==0) {
this.i_button_icon.style.width="1px";
this.i_button_icon.style.display="none";
}
else {
this.i_button_icon.style.width=(this.iconWidth()+(this.i_labelWidth > 6 ? UniversalButton.iconPadding : 0))+"px";
}
this.i_button_icon.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_button_icon.innerHTML="&nbsp;";
this.i_button.appendChild(this.i_button_icon);
this.i_button_label=document.createElement('DIV');
this.i_button_label.className=this.labelClass();
this.i_button_label.style.width=(this.i_labelWidth - 2) - (document.all ? 2 : 0)+"px";
this.i_button_label.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_button_label.style.lineHeight=(this.height() - (this.padding() * 2) - 1)+"px";
this.i_button_label.innerHTML=this.label();
this.i_button.appendChild(this.i_button_label);
this.i_context_trigger=document.createElement('DIV');
this.i_context_trigger.className="UniversalButton_trigger";
if (this.contextTriggerWidth()==0 || this.context()==undefined) {
this.i_context_trigger.style.width="1px";
this.i_context_trigger.style.display="none";
}
else {
this.i_context_trigger.style.width=this.contextTriggerWidth()+"px";
}
this.i_context_trigger.style.height=(this.height() - (this.padding() * 2) - 2)+"px";
this.i_context_trigger.innerHTML="&nbsp;";
this.i_button.appendChild(this.i_context_trigger);
this.i_handlers.push(EventHandler.register(this.i_context_trigger, "onclick", this.handleButtonContext, this));
}
return this.i_button;
}
JavaScriptResource.notifyComplete("./lib/components/Component.UniversalButton.js"); 
JavaScriptResource.notifyComplete("./btCore.js");
