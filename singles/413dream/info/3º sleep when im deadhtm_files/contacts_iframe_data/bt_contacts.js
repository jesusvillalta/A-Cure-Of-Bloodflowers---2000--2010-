
function getParam(paramVar)
{
var qs=document.location.search.substr(1); 
var params=qs.split("&");                   
var i;                                       
var paramVal;                                
for (i=0; i<params.length; i++)
{
var nv=params[i].split("=");
if (nv[0].toLowerCase()==paramVar.toLowerCase())
{
paramVal=nv[1];
break;  
}
}
return paramVal;   
}
var contact_new_menu,contact_view_menu,contact_action_menu,user_prefs,userName,xml,simpleClick,dataCache,openWindows,
groups_groupId,groupName,printObject,contextMenu,mywindow,dragObject,dnd,currentWindow,shareGroupUuid,newContact,sameContact,
currentSelection,currentUuid;
var userApp, contactsApp;
var simple_click_loaded=false;
var commands=new Commands();
var handlers=new Handlers();
var contactView=new ContactView();
var contactPreview=new ContactPreview();
var groupList=new GroupList();
var resources=new Resources();
var verb="Import";
var submitUrl="/cgi-bin/contacts/core-Import.fcg";
var appName="contacts";
var viewType="gridView";
var contactsOpenWindows={}
var printFunction;
var uuidList=new Array();
var addUuidList=new Array();
var deleteUuidList=new Array();
var copyUuidList=new Array();
var currentUDFs=new Array();
var groupOwner=getParam('owner');
var groupUuid=getParam("gid");
var permShortHand=new Array("r","w","f");
var groupName="";
var preview_contactId=getParam("cid");
var modeType=getParam("mode");
var contactType=getParam("type");
var newcontact_groupId=getParam("gid");
var prefsObject=new Object();
var contactsXMLCachePers;
var contactsXMLCacheEnt;
var GUI_ROOT="/gui/img/";
var ENTERPRISE_NAME="enterprise";
var READING=0;
var COMPLETED=1;
var INPROGRESS=2;
var EMAIL_ACCESS=1007;
var CALENDAR_ACCESS=2004;
var TASKS_ACCESS=1015;
var IM_ACCESS=1010;
var SECURE_SEND_ACCESS=1024;
var FILE_CABINET_ACCESS=1009;
var MY_DAY_ACCESS=1020;
var CALENDAR_SHARING_ACCESS=1019;
var CONTACTS_SHARING_ACCESS=1018;
var FILE_CABINET_SHARING_ACCESS=1026;
var root=top;
var __handleResponseTimeout=undefined;
var xmlHttpObjects=undefined;
if (document.all || window.console==undefined) {
console={log:function(){},warn:function(){},error:function(){},dir:function(){},trace:function(){}};
}
var blackberry=(window==window.parent && typeof window.opener.parent.extensionBlackberry!="undefined") ? 
window.opener.parent.extensionBlackberry :
window.parent.extensionBlackberry;
var hasBlackberryEnabled=(typeof blackberry!="undefined" && blackberry.isEnabled());
function initAppRefs() {
init_common();
var found=false;
if (window.opener!=null) 
root=window.opener.top;
else 
root=window.top;
if(!root.ApplicationOldContacts) {
if (root.opener!=undefined) {
root=root.opener.top;
}
}
user_prefs=root.user_prefs
userApp=root.userApp;
if (root.ApplicationOldContacts!=undefined) {
simpleClick=root.ApplicationOldContacts.getSimpleClick();
contactsApp=simpleClick.contactsApp;
dataCache=root.SimpleClickDataCache;
openWindows=root.ApplicationOldContacts.openWindows;
}
CalendarEvent=root.CalendarEvent;
CalendarColorClass=root.CalendarColorClass;
CalendarDataModel=root.CalendarDataModel;
Date.prototype.copy=root.Date.prototype.copy;
DataNode=root.DataNode;
Application=root.Application;
CalendarTask=root.CalendarTask;
EventAttendee=root.EventAttendee;
SpecialEventNotificationEntry=root.SpecialEventNotificationEntry;
}
function Contact(fieldList) {
this.xmlData=null;
this.udfLength=0;
this.udfNames=new Array();
this.values={};
}
Contact.prototype.populate=function (data, elementNum, fieldList) {
xmlData=data.getElementsByTagName("result");
var detailedView=resources.contactFields[1];
var fieldName;
for (var i=0;i<detailedView.length; i++)
for (var j=0;j<detailedView[i][1].length;j++) {
fieldName=detailedView[i][1][j].split("_")[1];
this.values[fieldName]=getXMLValue(xmlData, elementNum, fieldName);
}
var additionalParams=new Array("UUID","CREATIONDATE","GROUPMEMBERSHIP","LASTMODDATE","PRIVATE","HIDEPERSONAL","ACCESS","photo","bdayid","annid","attendbday","attendanni");
for (var i=0; i<additionalParams.length; i++)
this.values[additionalParams[i]]=(additionalParams[i]=="GROUPMEMBERSHIP")? dataCache.findUserGroupMembership(this.values["UUID"]) : getXMLValue(xmlData, elementNum, additionalParams[i]);	
var byFields=new Array("LASTMODBY","CREATEDBY");
var dateFields=new Array("LASTMODDATE","CREATIONDATE");
for (var i=0; i<byFields.length; i++) {
var myUser=dataCache.findUserByUserName(this.values[byFields[i]]);
var newDate=new Date();
newDate.setTime(this.values[dateFields[i]] * 1000);
this.values[byFields[i]+"_orig"]=this.values[byFields[i]];
this.values[dateFields[i]+"_orig"]=this.values[dateFields[i]];
if (myUser)
this.values[byFields[i]]=myUser.name+" on "+newDate.formatDate("F d, Y h:i A");
else
this.values[byFields[i]]=this.values[byFields[i]]+" on "+newDate.formatDate("F d, Y h:i A");
}			
var counter=0;
while (getXMLValue(xmlData, elementNum, "udf_"+counter+"-name")!="") {
this.udfNames.push(getXMLValue(xmlData, elementNum, "udf_"+counter+"-name"));
this.values["udf_"+counter]=getXMLValue(xmlData, elementNum, "udf_"+counter+"-value");		
counter++;
}
}
Contact.prototype.get=function(field) { return this.values[field]; }
Contact.prototype.contactToString=function () {
var retVal="<vCard>";
var detailedView=resources.contactFields[1];
for (var i=0;i<detailedView.length; i++) {
for (var j=0;j<detailedView[i][1].length;j++) {
var currentVal=detailedView[i][1][j].split("_")[1];
if (detailedView[i][1][j].split("_")[1]=="LASTMODBY" || detailedView[i][1][j].split("_")[1]=="CREATEDBY") continue;
if (detailedView[i][1][j].split("_")[1]=="HEADER") continue;
var namePiece=currentVal.split("-");
for (var k=0;k<namePiece.length;k++) {
var prevVal=(i==0)? "end" : (j==0)? detailedView[i-1][1][detailedView[i-1][1].length-1].split("_")[1] : detailedView[i][1][j-1].split("_")[1];
if (prevVal.split("-")[0]!="LABEL" && namePiece[k]==prevVal.split("-")[k]) continue;
retVal+="<"+namePiece[k]+">";
}
retVal+=escape(htmlEncode(this.values[currentVal]));
for (var k=namePiece.length-1;k>=0;k--) {
var nextVal=(i==detailedView.length-1)? "end" : (j==detailedView[i][1].length-1)? detailedView[i+1][1][0].split("_")[1] : detailedView[i][1][j+1].split("_")[1];
if (namePiece[0]!="LABEL" && namePiece[k]==nextVal.split("-")[k]) continue;
retVal+="</"+namePiece[k]+">";
}
}
}
retVal+="<UUID>"+this.values["UUID"]+"</UUID>";
var extraFields=new Array("LASTMODBY","CREATEDBY","LASTMODDATE","CREATIONDATE");
for (var i=0;i<extraFields.length;i++) {
retVal+="<"+extraFields[i]+">"+escape(this.values[extraFields[i]+"_orig"])+"</"+extraFields[i]+">";
}
for (var i=0; i < this.udfNames.length; i++)
if (this.values["udf_"+i]) retVal+="<udf_"+i+"><value>"+this.values["udf_"+i]+"</value></udf_"+i+">";
retVal+="<bdayid>"+this.values["bdayid"]+"</bdayid><annid>"+this.values["annid"]+"</annid>";
retVal+="<addbday>"+this.values["addbday"]+"</addbday><addanni>"+this.values["addanni"]+"</addanni></vCard>";
return retVal;
}
function ContactPreview () {
this.isNewContact=false;
this.DIV_CONTAINER_ID="contactPreview";
this.contactPreviewDiv,this.currentContact,this.contactXML;
this.userNotes=new Array(); 
this.oldNoteText="";
this.currentUDFFields=new Array();
this.isSnapShotLoaded=false;
this.currentSnapShot=new Array();
this.isLoading=false;
}
ContactPreview.prototype.resize=function () {
var rightWidth=cb.getBrowserWidth()-this.leftWidth-70;
if (rightWidth<650)
rightWidth=650;
}
ContactPreview.prototype.load=function (divItem, actionType) {
if (divItem) this.DIV_CONTAINER_ID=divItem;
contactPreviewDiv=document.getElementById(this.DIV_CONTAINER_ID);
var cpDOM=new Array();
var myWidth=(cb.getBrowserWidth() * .75);
var leftWidth=(actionType!='Add')? '1%' : '1%';
var fullWidth=(actionType!='Add')? '83%' : '98%';
cpDOM.push("<div style='float:left;width:15%' id='sidePane'></div>");
cpDOM.push("<table id=table_tabMenu class=tabMenu style='margin-left:"+leftWidth+";width:"+fullWidth+"' cellSpacing=0 cellPadding=0>");
cpDOM.push("<tbody><tr>");
var tabArrayLength=(actionType=="Add") ? resources.tabNames.length-1 : resources.tabNames.length;
for (var i=0; i < tabArrayLength; i++) {
var myDivClass=(i==0) ? "tabMenuTab_active" : "tabMenuTab_inactive"
cpDOM.push("<td class=tabMenu_blank style='width:2px;'>&nbsp;</td><td style='width:50px;' vAlign=top>");
cpDOM.push("<div onclick=contactPreview.onClickTab(event) id='"+resources.tabNames[i]+"_tab' class="+myDivClass+">"+resources.tabNames[i].replace("_"," ")+"</div></td>");
}
if (actionType!='Add') {
var tabMenuButtons=new Array("Edit", "Download", "Print");
var tabMenuImages=new Array("ico-pencil", "ico-small-save", "ico-small-prin");
var tabMenuIds=new Array("tabMenuAction_editContact", "tabMenuAction_saveContact", "tabMenuAction_printContact");
if(hasBlackberryEnabled){
tabMenuButtons.splice(2,0,"Send to my BlackBerry");
tabMenuImages.splice(2,0,"ico-small-save");
tabMenuIds.splice(2,0,"tabMenuAction_sendContactToBlackBerry");
}
for (var i=0; i < tabMenuIds.length; i++) {
var tabMenuWidth=(i==1) ? "82px" : (i==2) ? "130px" : "50px";
cpDOM.push("<td onclick='contactPreview.onClickTabMenuAction(event)' id='"+tabMenuIds[i]+"' class='tabMenuElement hoverText' style='width:"+tabMenuWidth+"'>");
cpDOM.push("<img src="+GUI_ROOT+"spacer.gif class="+tabMenuImages[i]+"><span class=hoverText style='margin-left:5px;'>"+tabMenuButtons[i]+"</span></td>");
if (i!=tabMenuIds.length - 1)
cpDOM.push("<td class=tabMenu_blank style='width:10px'><div class=vrule style='height:13px'> </div></td>");
}
}else if(hasBlackberryEnabled){
cpDOM.push("<input type='checkbox' id='blackberry' style='margin-left:10px;' /><label style='padding-top: 2px;'>Add to my BlackBerry</label>");
}
cpDOM.push("<td class=tabMenu_blank vAlign=top><button onclick=contactPreview.onClickUpdate(event) id=updateButton style='margin-left:20px;display:none;'>");
cpDOM.push("Save</button><button onclick=contactPreview.onClickCancel(event) id=cancelButton style='margin-left:10px;display:none;'>");
cpDOM.push("Cancel</button></td>");
cpDOM.push("<td class='tabMenu_blank' align=right style=''>");
if (!actionType || !actionType=="Add" && !actionType=="Card")
cpDOM.push("<img onclick=contactPreview.onClickClose(event) src="+GUI_ROOT+"spacer.gif class='ico-close-x' style='cursor:hand;cursor:pointer;margin:0 3px;'>");
else
cpDOM.push(" ");
this.isNewContact=(actionType=='Add')? true : false;
cpDOM.push("</td></tr></tbody></table>");
var extraCSS=(cb.isIE())? "0px" : "-2px";
cpDOM.push("<table id='tabOutlineTable' style='width:"+fullWidth+";margin-bottom:10px;margin-left:"+leftWidth+";' cellSpacing=0 cellPadding=0><tr><td id=tabOutline class=tabOutline style='width:84%' vAlign=top></td></tr></table>");
contactPreviewDiv.innerHTML=cpDOM.join('');
contactPreview.createInfoTable(false, actionType);
contactPreview.loadNotesDOM();
document.getElementById("Overview_div_1").style.display="block";
document.getElementById("Overview_div_2").style.display="block";
}
ContactPreview.prototype.contactPreviewHandler=function (data) {
this.contactXML=new Contact();
this.contactXML.populate(data);
contactPreview.i_reserve_xml=this.contactXML;
contactPreview.loadNotesData(data);
contactPreview.loadContactInformation("text");
contactPreview.setContactCheckBoxes();
}
ContactPreview.prototype.validateDate=function (myDate) {
if (!myDate || myDate=="") return false;
var sepChar=(myDate.indexOf("/")!=-1) ? "/" : (myDate.indexOf("-")!=-1) ? "-" : (myDate.indexOf(".")!=-1) ? "." : "~";
if (myDate.substring(1, 2)!=sepChar && myDate.substring(2, 3)!=sepChar) return false;
if (myDate.length > 5 && myDate.substring(3, 4)!=sepChar && myDate.substring(4, 5)!=sepChar && myDate.substring(5, 6)!=sepChar) return false;
if (myDate.length < 3 || myDate.length > 10) return false;
return true;
}
ContactPreview.prototype.setContactCheckBoxes=function () {
var hasAccess=(this.contactXML.get("ACCESS")=="w" || this.contactXML.get("ACCESS")=="f");
var simpleClickEntry=dataCache.findUser(this.contactXML.get("UUID"))
var contactType=simpleClickEntry.type;
document.getElementById("markAsPrivateSpan").style.display=(contactType=="contact") ? "block" : "none";
document.getElementById("markAsPrivateCheckbox").checked=(this.contactXML.get("PRIVATE")=="true") ? true : false;
document.getElementById("hidePersonalSpan").style.display=(contactType=="econtact" && hasAccess) ? "block" : "none";
document.getElementById("hidePersonalCheckbox").checked=(this.contactXML.get("HIDEPERSONAL")=="true") ? true : false;
document.getElementById("bdaydiv").style.display=(contactPreview.validateDate(this.contactXML.get("BDAY"))) ? "block" : "none";
document.getElementById("anniversarydiv").style.display=(contactPreview.validateDate(this.contactXML.get("ANNIVERSARY"))) ? "block" : "none";
document.getElementById("calendarHeader").style.display=(contactPreview.validateDate(this.contactXML.get("ANNIVERSARY"))|| (contactPreview.validateDate(this.contactXML.get("BDAY")))) ? "block" : "none";
document.getElementById("cb_bday").checked=(this.contactXML.get("attendbday")=="true") ? true : null;
document.getElementById("cb_anniversary").checked=(this.contactXML.get("attendanni")=="true") ? true : null;
document.getElementById("cbFollowUp").checked=false;
this.resetTaskData();
}
ContactPreview.prototype.DDControl=function(uuid, type) {
var selectVal;
if (type=="TZ")
selectVal=cb.createElement("select",uuid,"","width:180px");
else
selectVal=cb.createElement("select",uuid);
if (type=="IMTYPE" || type=="IMTYPE2") {
var valTypes=new Array("","AIM","BlueTie","Google_Talk","MSN","Skype","Yahoo","Other");
} else if (type=="N-PREFIX")
var valTypes=new Array("","Dr.","Miss","Mr.","Mrs.","Ms.","Prof.","Sir");
else if (type=="N-SUFFIX")
var valTypes=new Array("","I","II","III","IV","V","Jr.","PhD","MD","esq.","Sr.");
else if (type=="TZ")
var valTypes=resources.timeZones;
for (var i=0; i<valTypes.length; i++) {
var myOption=selectVal.appendChild(cb.createElement("option",valTypes[i]));
myOption.innerHTML=valTypes[i].replace("_"," ");
myOption.title=valTypes[i].replace("_"," ");
}
cb.addEventListener(selectVal,"change",contactPreview.onKeyDownUpdateFields);
return selectVal;
}
ContactPreview.prototype.getDNVal=function(val,refresh) {
return (refresh)? unescape(htmlEncode(document.getElementById("DETAILED_"+val).value)) : unescape(htmlEncode(this.contactXML.get(val)));
}
ContactPreview.prototype.DNControl=function(uuid,refresh) {
var selectDN=cb.createElement("select","DNControl","","width:180px;");
var DNTypes=new Array();
var prevVal=(!document.getElementById(uuid+"_DISPLAYNAME").options)? htmlEncode(document.getElementById(uuid+"_DISPLAYNAME").value) : null;
if (prevVal) DNTypes.push(prevVal);
var prevIndex=(document.getElementById(uuid+"_DISPLAYNAME"))? document.getElementById(uuid+"_DISPLAYNAME").selectedIndex : 0;
var lastname=(contactPreview.getDNVal("N-FAMILY",refresh) && contactPreview.getDNVal("N-FAMILY",refresh)!="")? contactPreview.getDNVal("N-FAMILY",refresh) : "";
var firstname=(contactPreview.getDNVal("N-GIVEN",refresh) && contactPreview.getDNVal("N-GIVEN",refresh)!="")? contactPreview.getDNVal("N-GIVEN",refresh) : "";
if (lastname!="" || firstname!="") {
DNTypes.push(lastname+((firstname!="")? ", " : "")+firstname);
DNTypes.push(firstname+" "+lastname);
} else
DNTypes.push("");
if (contactPreview.getDNVal("ORG-COMPANY",refresh) && contactPreview.getDNVal("ORG-COMPANY",refresh)!="") {
DNTypes.push(contactPreview.getDNVal("ORG-COMPANY",refresh)+" ("+contactPreview.getDNVal("N-FAMILY",refresh)+", "+contactPreview.getDNVal("N-GIVEN",refresh)+")");
DNTypes.push(contactPreview.getDNVal("N-FAMILY",refresh)+", "+contactPreview.getDNVal("N-GIVEN",refresh)+" ("+contactPreview.getDNVal("ORG-COMPANY",refresh)+")");
}
DNTypes.push("Custom");
for (var i=0; i<DNTypes.length; i++) {
var myOption=selectDN.appendChild(cb.createElement("option",DNTypes[i]));
myOption.innerHTML=DNTypes[i];
}
cb.addEventListener(selectDN,"click",contactPreview.changeDisplayName);
selectDN.selectedIndex=prevIndex;
return selectDN;
}
ContactPreview.prototype.populateDDControl=function(uuid,val) {
var control=document.getElementById(uuid);
control.selectedIndex=-1;
if(control.options) {
for (var i=0; i<control.options.length; i++) {
if (htmlEncode(control.options[i].innerHTML)==val || control.options[i].value==val) control.selectedIndex=i;
}
if (control.selectedIndex==-1) {
var myOption=control.appendChild(cb.createElement("option",val));
myOption.innerHTML=htmlEncode(val);
control.selectedIndex=control.options.length-1;
}
}
}
ContactPreview.prototype.refreshDNControl=function() {
var selectDN=contactPreview.DNControl("OVERVIEW",true);
selectDN.id="OVERVIEW_DISPLAYNAME";
document.getElementById("OVERVIEW_DISPLAYNAME").parentNode.replaceChild(selectDN,document.getElementById("OVERVIEW_DISPLAYNAME"));
selectDN=contactPreview.DNControl("DETAILED",true);
selectDN.id="DETAILED_DISPLAYNAME";
document.getElementById("DETAILED_DISPLAYNAME").parentNode.replaceChild(selectDN,document.getElementById("DETAILED_DISPLAYNAME"));
}
ContactPreview.prototype.loadCustomField=function() {
var inputElement=cb.createElement("input", "", "", "height:20px;", "type:text,size:30,maxlength:100");
inputElement.id="OVERVIEW_DISPLAYNAME";
cb.addEventListener(inputElement,"blur",contactPreview.refreshDNControl);
cb.addEventListener(inputElement,"keyup",contactPreview.changeDisplayName);
cb.addEventListener(inputElement,"keyup",contactPreview.onKeyDownUpdateFields);
document.getElementById("OVERVIEW_DISPLAYNAME").parentNode.replaceChild(inputElement,document.getElementById("OVERVIEW_DISPLAYNAME"));
inputElement=inputElement.cloneNode(false);
inputElement.id="DETAILED_DISPLAYNAME";
document.getElementById("DETAILED_DISPLAYNAME").parentNode.replaceChild(inputElement,document.getElementById("DETAILED_DISPLAYNAME"));
}
ContactPreview.prototype.changeDisplayName=function(event) {
if (!event) event=window.event;
var val=(cb.currentTarget(event).options)? cb.currentTarget(event).options[cb.currentTarget(event).selectedIndex].innerHTML : htmlEncode(cb.currentTarget(event).value);
if (val=="Custom")
contactPreview.loadCustomField();
else if (!contactPreview.isNewContact && document.getElementById("topDisplayName")) {
document.getElementById("topDisplayName").innerHTML=val;
document.getElementById("topDisplayName").setAttribute("title",val);
document.getElementById(((cb.currentTarget(event).id.split("_")[0]=="OVERVIEW")? "DETAILED" : "OVERVIEW")+"_DISPLAYNAME").selectedIndex=cb.currentTarget(event).selectedIndex;
}
}
ContactPreview.prototype.loadContactInformation=function (fieldType, newContact) {
if(typeof window.parent.ExtensionBannerAds!="undefined") {
window.parent.ExtensionBannerAds.refreshAll();
}else{
if(window.opener!=null && 
window.opener.parent!=null &&
typeof window.opener.parent.ExtensionBannerAds!="undefined") 
{
window.opener.parent.ExtensionBannerAds.refreshAll();
}
}
var isDisplayed=false
var headerElement=null;
for (var i=0; i < resources.contactFields.length; i++) {
for (var j=0; j < resources.contactFields[i].length; j++) {
var elementDiv=resources.contactFields[i][j][1];
for (var k=0; k<elementDiv.length; k++) {
if (elementDiv[k].split("_")[1]=='HEADER') {
headerElement=elementDiv[k];
document.getElementById(headerElement).style.display=(fieldType=="text")? "none" : "";
isDisplayed=false;
continue;
}
var currentVal=this.contactXML.get(elementDiv[k].split("_")[1]);
var uCurrentVal=unescape(currentVal);
var hCurrentVal=htmlEncode(uCurrentVal);
if (fieldType=="text") {
document.getElementById(elementDiv[k]).parentNode.parentNode.style.display=(!currentVal || currentVal=="" || resources.contactFields[i][j][3]==1)? "none" : "";
if (currentVal) {
if (!isDisplayed) {
isDisplayed=true;
document.getElementById(headerElement).style.display="";
}
if (elementDiv[k].split("_")[1]=="LABEL-HOME" || elementDiv[k].split("_")[1]=="LABEL-WORK" || elementDiv[k].split("_")[1]=="ADR-WORK-STREET" || elementDiv[k].split("_")[1]=="ADR-HOME-STREET")	
var myVal="<a id='MQ_"+elementDiv[k].split("_")[1]+"' style='line-height:20px;' oncontextmenu='return contactPreview.onContextMenuAddress(event)' title='Right-click for Mapquest options' href='"+contactPreview.createMapQuestURL(elementDiv[k].split("-")[1])+"' target=_blank>"+hCurrentVal+"</a>";	
else if (elementDiv[k].split("_")[1]=="URL")
var myVal="<a href="+((uCurrentVal.search('http://')==-1)? 'http://' : '')+uCurrentVal+" target='_blank'>"+hCurrentVal+"</a>";
else if (elementDiv[k].split("_")[1]=="EMAIL1" || elementDiv[k].split("_")[1]=="EMAIL2")
var myVal="<a style='cursor:hand;cursor:pointer' id='Email' onclick=\"root.openSendEmail('"+hCurrentVal+"');\">"+hCurrentVal+"</a>";
else if (elementDiv[k].split("_")[1]=="IMTYPE" || elementDiv[k].split("_")[1]=="IMTYPE2")
var myVal=" ("+unescape(currentVal)+")";
else
var myVal=hCurrentVal;
document.getElementById(elementDiv[k]).innerHTML=myVal.replace(/\n/g,"<br>");
} else
document.getElementById(elementDiv[k]).innerHTML=" ";
} else {
if (fieldType=="editable") {
if (currentVal) {
if (elementDiv[k].search("N-PREFIX")!=-1 || elementDiv[k].search("N-SUFFIX")!=-1 || elementDiv[k].search("TZ")!=-1 || elementDiv[k].search("IMTYPE")!=-1 || elementDiv[k].search("DISPLAYNAME")!=-1) contactPreview.populateDDControl(elementDiv[k], htmlUnencode(unescape(currentVal)));
else document.getElementById(elementDiv[k]).value=htmlUnencode(unescape(currentVal));
}
document.getElementById(elementDiv[k]).parentNode.parentNode.style.display=(resources.contactFields[i][j][3]==1)? "none" : "";
}
}
}
}
}
if (document.getElementById("topDisplayName")) {
if (fieldType=='text') {
document.getElementById("topDisplayName").innerHTML=htmlEncode(unescape(this.contactXML.get("DISPLAYNAME")));
document.getElementById("topDisplayName").setAttribute("title", htmlUnencode(unescape(this.contactXML.get("DISPLAYNAME"))));
}
else document.getElementById("topDisplayName").value=htmlUnencode(unescape(this.contactXML.get("DISPLAYNAME")));
}
var hasAccess=(this.contactXML.get("ACCESS")=="w" || this.contactXML.get("ACCESS")=="f");
(hasAccess && fieldType!="editable") ? contactPreview.toggleEditMenu(false) : contactPreview.toggleEditMenu(true);
document.getElementById("addNotesDiv").style.display=(hasAccess) ? "block" : "none";
document.getElementById("notes_addButton").disabled=(hasAccess) ? false : true;
contactPreview.setNoteTableCols();
if (document.getElementById("personImage")) setTimeout("contactPreview.loadPersonImage("+this.contactXML.get("photo")+")", 1);
if (!newContact) {
document.title=htmlUnencode(unescape(this.contactXML.get("DISPLAYNAME")));
var self=dataCache.findUser("self");
if (!self)
var isCurrentUser=false;
else
var isCurrentUser=(self.uuid==this.contactXML.get("UUID"));
var contactType=dataCache.findUser(this.contactXML.get("UUID")).type;
var q;
if (q=document.getElementById("qldiv_Email")) {
q.style.display=(isCurrentUser || this.contactXML.get("EMAIL1")=="") ? "none" : "block";
}
if (q=document.getElementById("qldiv_Efax")) {
q.style.display=(isCurrentUser || (!this.contactXML.get("TEL-FAX-NUMBER1") && !this.contactXML.get("HOMEFAX"))) ? "none" : "block";
}
if (q=document.getElementById("qldiv_Appointment")) {
q.style.display=((isCurrentUser || this.contactXML.get("EMAIL1")=="") ? "none" : "block");
}
if (q=document.getElementById("qldiv_IM"))
q.style.display=(!isCurrentUser && dataCache.findUser(this.contactXML.get("UUID")).username) ? "block" : "none";
if (q=document.getElementById("qldiv_Gift")) { 
q.style.display=(!isCurrentUser) ? "block" : "none";
}
if (q=document.getElementById("qldiv_Flowers")) { 
q.style.display=(!isCurrentUser) ? "block" : "none";
}					
document.getElementById("History_tab").style.display=(isCurrentUser)? "none" : "";
document.getElementById("History_tab").parentNode.style.width=(isCurrentUser)? "0px" : "50px";
}
this.loadUserDefinedFields(fieldType);
contactPreview.isSnapShotLoaded=false;
contactPreview.reloadSnapshotWaitingDOM();
contactPreview.isLoading=false;
}
ContactPreview.prototype.setNoteTableCols=function() {
if (!this.contactXML || !contactPreview.contactXML.get("ACCESS") || !this.i_notesViewTable) return;
var hasAccess=(this.contactXML.get("ACCESS")=="w" || this.contactXML.get("ACCESS")=="f");
this.i_notesViewTable.className=(hasAccess) ? "genericTable" : "genericTable hideCol";
this.i_notesAdminCol.style.display=(hasAccess) ? "" : "none";
}
ContactPreview.prototype.loadPersonImage=function (hasPhoto) {
var personImage=document.getElementById("personImage");
personImage.className=(hasPhoto) ? "" : "generic-person";
personImage.src=(!hasPhoto)? GUI_ROOT+"spacer.gif" : commands.contacts_GetMedia(this.contactXML.get("UUID"));
if (this.contactXML.get("ACCESS")=="w" || this.contactXML.get("ACCESS")=="f") {
personImage.style.cursor="hand";
personImage.style.cursor="pointer";
personImage.setAttribute("title", "Click to change picture");
} else {
personImage.style.cursor="default";
personImage.setAttribute("title", "");
}
}
ContactPreview.prototype.getInputControl=function(uuid,tabName) {
if (uuid.split("_")[1]=="DISPLAYNAME")
return contactPreview.DNControl(uuid.split("_")[0]);
else if (uuid.split("_")[1]=="N-PREFIX" || uuid.split("_")[1]=="N-SUFFIX" || uuid.split("_")[1]=="IMTYPE" || uuid.split("_")[1]=="IMTYPE2" || uuid.split("_")[1]=="TZ")
return contactPreview.DDControl(uuid,uuid.split("_")[1]);
else if (uuid.split("_")[1]=="LABEL-WORK" || uuid.split("_")[1]=="LABEL-HOME" || uuid.split("_")[1]=="NOTE") {
var t=cb.createElement("textarea","","","width:180px;overflow:auto;","wrap:off,rows:5");
return t;
} else {
var t=cb.createElement("input", "", "", "height:20px;width:180px;", "type:text,maxlength:100");
return t;
}
}
ContactPreview.prototype.businessInfoViewEdit=function (type, newContact) {
var inputElement=cb.createElement("input", "", "", "height:20px;", "type:text,size:30,maxlength:100");
if (!cb.isIE()) inputElement.style.marginBottom="2px";
var divElement=cb.createElement("span", "", "", "line-height:20px;");
for (var i=0; i < resources.contactFields.length; i++) {
for (var j=0;j<resources.contactFields[i].length;j++) {
for (var k=0;k<resources.contactFields[i][j][1].length;k++) {
if (resources.contactFields[i][j][1][k].split("_")[1]=='HEADER') continue;
if (resources.contactFields[i][j][2]=="1") {
document.getElementById(resources.contactFields[i][j][1][k]).parentNode.firstChild.style.display="block";
var element1=(type=="editable") ? contactPreview.getInputControl(resources.contactFields[i][j][1][k]) : divElement.cloneNode(false);
if (type=="editable" && resources.contactFields[i][j][1][1]) element1.style.width="100px";
var element2=(type=="text") ? document.getElementById(resources.contactFields[i][j][1][k]) : document.getElementById(resources.contactFields[i][j][1][k]);
element1.id=resources.contactFields[i][j][1][k];
cb.addEventListener(element1, "keyup", contactPreview.onKeyDownUpdateFields);
if ((element1.id.split("_")[1]=="BDAY" || element1.id.split("_")[1]=="ANNIVERSARY"))
cb.addEventListener(element1, "keyup", contactPreview.onClickDate);   
cb.addEventListener(element1, "input", contactPreview.onClickDate);   
cb.addEventListener(element1, "paste", contactPreview.onClickDate);   
document.getElementById(resources.contactFields[i][j][1][k]).parentNode.replaceChild(element1, element2);
}
}
}
}
if (!newContact) {
var i=0;
while (document.getElementById("col-udf_"+i)) {
var parentElement=document.getElementById("col-udf_"+i);
var element1=(type=="editable") ? inputElement.cloneNode(false) : divElement.cloneNode(false);
var element2=(type=="text") ? document.getElementById("udf_"+i) : document.getElementById("udf_"+i);
element1.id="udf_"+i;
parentElement.replaceChild(element1, element2);
i++;
}
}
var styleDisplay=(type=="editable") ? "inline" : "none";
var elementType=(type=="editable") ? "editable" : "text";
if (!newContact) {
document.getElementById("updateButton").style.display=styleDisplay;
document.getElementById("cancelButton").style.display=styleDisplay;
}
document.getElementById('DETAILED_HEADER_NAME_ARROW').className='b-arrow-right';
document.getElementById('DETAILED_HEADER_ADDRESS_ARROW').className='b-arrow-right';
contactPreview.loadContactInformation(elementType,newContact);
}
ContactPreview.prototype.createInfoTable=function (editable, actionType) {
var contactPreviewDiv=document.getElementById(this.DIV_CONTAINER_ID);
var cpDOM=new Array();
cpDOM.push("<table style='width:100%;font-size:11px;'><tbody><tr>");
var tableCut=new Array(8, 30, 0, 0, 0, 0);
var tabNames=new Array("Overview", "Detailed", "Custom_Fields");
for (var j=1; j<3; j++) {
cpDOM.push("<td id=contactInfoCol_"+j+" style='overflow:hidden;width:"+cb.getBrowserWidth() * .5+"px;' vAlign=top>");
for (var i=0; i < resources.contactFields.length; i++) {
if (j==2 && (tabNames[i]=='Properties' || tabNames[i]=='Custom_Fields' || tabNames[i]=='Snapshot')) continue;
cpDOM.push("<div id='"+tabNames[i]+"_div_"+j+"' style='display:none;'>");
cpDOM.push("<table style='font-size:11px' width=100%><tbody id=divTBody"+j+">");
var startIndex=(j==1)? 0 : tableCut[i];
var endIndex=(j==1 && tableCut[i]!=0)? tableCut[i] : resources.contactFields[i].length;
for (var k=startIndex; k<endIndex; k++) {
if (resources.contactFields[i][k][1][0].split("_")[1]=='HEADER') {
cpDOM.push("<tr><td colspan=3 class=drag-opacity style='padding-left:0px;color:#000;padding-top:12px;' id='"+resources.contactFields[i][k][1][0]+"'><div id='headerdiv_"+resources.contactFields[i][k][1][0]+"' style='border-bottom:1px solid #999;padding-bottom:5px;width:75%;'>"+((resources.contactFields[i][k][1][0]=="DETAILED_HEADER_NAME" || resources.contactFields[i][k][1][0]=="DETAILED_HEADER_ADDRESS")? "<span><img src='"+GUI_ROOT+"spacer.gif' class='b-arrow-right' id='"+resources.contactFields[i][k][1][0]+"_ARROW' style='float:left;cursor:pointer;crusor:hand;' title='Click to show/hide extra fields' onclick='contactPreview.onClickToggleFields(event)'></span>" : "")+"<b>"+resources.contactFields[i][k][0]+"</b></div></td></tr>");
} else {
var paddingTop=(resources.contactFields[i][k][1][0].split("_")[1]=="ADR-HOME-STREET")? "12px" : "0px";
cpDOM.push("<tr><td width=33% valign=top id='col1-"+resources.contactFields[i][k][1][0]+"' style='padding-top:"+paddingTop+";padding-bottom:0'>");
var myVal=(resources.contactFields[i][k][0]!="")? resources.contactFields[i][k][0]+": " : " ";
cpDOM.push("<span class=contactLabel style='line-height:22px;margin-right:10px;'>"+myVal+"</span></td>");
var elementDiv=resources.contactFields[i][k][1];
for (var l=0;l<elementDiv.length;l++) {
var colspan=(resources.contactFields[i][k][1][l].search("IM")!=-1)? 1 : 2;
cpDOM.push("<td colspan="+colspan+" id='col-"+resources.contactFields[i][k][1][0]+"' style='padding-top:"+paddingTop+";padding-bottom:0'>");
var elementDiv=resources.contactFields[i][k][1];
if (editable) cpDOM.push("<input id='"+elementDiv[l]+"' style='line-height:22px;' type=textbox>");
else cpDOM.push("<span id='"+elementDiv[l]+"' style='line-height:22px;'> </span>");
cpDOM.push("</td>");
if (resources.contactFields[i][k][1][l].split("_")[1]!="IM" && resources.contactFields[i][k][1][l].split("_")[1]!="IM2")
cpDOM.push("</tr>");
}
}
}
cpDOM.push("</tbody></table></div>");
}
cpDOM.push("</td>");
}
cpDOM.push("</tr></tbody></table>");
document.getElementById("tabOutline").innerHTML=cpDOM.join('');
cpDOM=new Array();
if (actionType!="Add" && actionType!="Print") {
var quickLink_images=new Array("ico-new-email", "ico-new-efax", "ico-new-event", "ico-im", "ico-send-gift", "ico-send-flowers");
var quickLink_ids=new Array("Email", "Efax", "Appointment", "IM", "Gift", "Flowers");		
cpDOM.push("<center><div style='overflow:hidden;font-size:16px;font-weight:bold;padding:5px 0px;line-height:24px;width:100%' id='topDisplayName'></div>");
cpDOM.push("<div onclick='contactPreview.onClickUploadPicture(event)' style='margin-top:20px;margin-bottom:20px;'><img id=personImage class='generic-person' title='Click to upload a picture' src='"+GUI_ROOT+"spacer.gif' height=120 width=100 style='cursor:hand;cursor:pointer;'></div>");
cpDOM.push("<div style='text-align:left;width:120px;'>");
for (var i=0; i < quickLink_ids.length; i++) {
if (i==1 && !root.ApplicationOldContacts.efaxEnabled) continue;
if (i==2 && user_prefs.access_calendar!='True') continue;
if (i==3 && user_prefs.access_im!='True') continue;
if (i==4 && Application.getApplicationById(3008)==undefined) continue; 
if (i==5 && Application.getApplicationById(3009)==undefined) continue; 
cpDOM.push("<div id='qldiv_"+quickLink_ids[i]+"' style='height:24px;line-height:24px;'>");
cpDOM.push("<img src='"+GUI_ROOT+"spacer.gif' class="+quickLink_images[i]+">");
cpDOM.push("<span onclick=contactPreview.onClickQuickLink(event) id="+quickLink_ids[i]+" class=hoverText style='cursor:hand;cursor:pointer;margin-left:5px;line-height:24px;height:24px'>");
cpDOM.push(resources.quickLink_text[i]+"</span></div>");
}
var extraCSS=(!cb.isIE)? "margin-right:3px;margin-top:3px;" : "";
cpDOM.push("<div id=markAsPrivateSpan style='margin-top:25px;height:20px;line-height:20px;' title='Hide this contact when it is being shared'>");
cpDOM.push("<input onclick=contactPreview.onClickMarkAsPrivate(event) id=markAsPrivateCheckbox style='float:left;"+extraCSS+"' type=checkbox>Mark As Private</div>");
cpDOM.push("<div id=hidePersonalSpan style='margin-top:25px;display:none;height:20px;line-height:20px;' title='Display/Hide Personal Information to others'>");
cpDOM.push("<input onclick=contactPreview.onClickHidePersonal(event) id=hidePersonalCheckbox style='float:left;"+extraCSS+"' type=checkbox>Hide Personal</div>");
var specialDateText=new Array("Add Birthday", "Add Anniversary");
var specialDateId=new Array("bday", "anniversary");
cpDOM.push("<div class='contactHeaders' id='calendarHeader' style='display:none;align:center;border-bottom:thin solid grey'>Calendar</div>");
for (var i=0; i < 2; i++) {
cpDOM.push("<div title='"+specialDateText[i]+" to Calendar' id='"+specialDateId[i]+"div' style='height:20px;display:none;line-height:20px;'>");
cpDOM.push("<input onclick='contactPreview.onClickSetState(event, this);' id='cb_"+specialDateId[i]+"' style='float:left;"+extraCSS+"' type=checkbox>");
cpDOM.push("<span style='line-height:20px'>"+specialDateText[i]+"</span></div>");
}
cpDOM.push("</div></center>");
document.getElementById("sidePane").innerHTML=cpDOM.join('');
}
}
ContactPreview.prototype.loadUserDefinedFields=function (type) {
var udfDOM=new Array();
udfDOM.push("<table width=100% style='font-size:11px'><tbody id=divTBody1>");
udfDOM.push("<tr><td width=100% colspan=2 class=drag-opacity style='padding-left:10px;color:#000;padding-top:12px;' id='udf_header'><span><img src='"+GUI_ROOT+"spacer.gif' style='float:left;cursor:pointer;crusor:hand;' title='Click to show/hide extra fields' onclick='contactPreview.onClickToggleFields(event)'></span><b>Custom Fields</b><hr class='drag-opacity' size=1 width='75%' align=left style='color:#666'></td></tr>");	
for (var i=0; i < this.contactXML.udfNames.length; i++) {
udfDOM.push("<tr><td width='30%' id=col1-udf_"+i+">");
udfDOM.push("<span class=contactLabel style='line-height:22px;'>"+htmlEncode(unescape(this.contactXML.udfNames[i]))+": </span></td><td width='70%' id=col-udf_"+i+">");
if (type=="editable") udfDOM.push("<input type=text id=udf_"+i+" style='height:20px;' size=30 maxlength=100 value='"+unescape(htmlEncode(this.contactXML.values["udf_"+i]))+"'>");
else udfDOM.push("<span id=udf_"+i+" line-height:22px;>"+unescape(htmlEncode(this.contactXML.values["udf_"+i]))+"</span>");		
udfDOM.push("</td></tr>");
}
if (this.contactXML.udfNames.length==0) udfDOM.push("<tr><td colspan=2 class=contactLabel>There are no custom fields defined. Custom fields can be added by using the Contacts \"Action\" Menu, and choosing \"Manage Custom Fields\".</td></tr>");
udfDOM.push("</tbody></table>");
document.getElementById("Custom_Fields_div_1").innerHTML=udfDOM.join('');
}
ContactPreview.prototype.loadNotesDOM=function () {
var firstCol=document.getElementById("contactInfoCol_1");
var notesViewDiv=cb.createElement("div", "History_div_1", "", "display:none;");
var noteDOM=new Array();
var notesOptionsArray=new Array("(none)", "Sent Email", "Sent Fax", "Left Voice Mail", "Meeting", "Phone Call");
noteDOM.push("<div class=drag-opacity style='margin-bottom:10px;padding-left:20px;color:#000;padding-top:12px;' id='note_header'><span><img src='"+GUI_ROOT+"spacer.gif' style='float:left;cursor:pointer;crusor:hand;' title='Click to show/hide extra fields' onclick='contactPreview.onClickToggleFields(event)'></span><b>Notes</b><hr class='drag-opacity' size=1 width='33%' align=left style='color:#666'></div>");	
noteDOM.push("<table id='addNotesDiv'><tr><td valign=top><textarea id=tbNewNote style='margin-left:20px;' cols=60 rows=3></textarea>");
noteDOM.push("</td><td valign=top style='font-size:11px;'><span><select id=notesCategories style='margin-left:20px;'>");
for (var i=0; i < notesOptionsArray.length; i++) noteDOM.push("<option>"+notesOptionsArray[i]+"</option>");
noteDOM.push("</select><button id=notes_addButton style='margin-left:20px;' onclick=contactPreview.onClickNewNote(event)>Add</button><br><br><br><input style='margin:0;margin-left:20px;vertical-align:middle;' id='cbFollowUp' type=checkbox onclick='contactPreview.toggleTask(event)'> Requires Follow-up</span></td></tr></table>");
noteDOM.push("<div id='taskDiv' style='display:none;margin:20px;width:50%'>"+findFrameByName("taskFrame").document.getElementById("taskContentDiv").innerHTML+"</div>");
noteDOM.push("<div id='noteTableHolder'></div><div class=drag-opacity style='padding-left:20px;color:#000;padding-top:12px;' id='note_header'><span><img src='"+GUI_ROOT+"spacer.gif' style='float:left;cursor:pointer;crusor:hand;' title='Click to show/hide extra fields' onclick='contactPreview.onClickToggleFields(event)'></span></div><div id=snapshotDiv style='display:none;cursor:hand;cursor:pointer;margin:10px 20px;'></div>");
var noteText=noteDOM.join('');
noteText=noteText.replace('toggleDueDate()','');
notesViewDiv.innerHTML=noteText;
firstCol.appendChild(notesViewDiv);
updateGUISkin(false,"skin.css","datePicker.css");
document.getElementById("cboxNoDueDate").checked=null;
DATE_FORMAT=(user_prefs.date_prefs=="%m/%d/%Y") ? "m/d/Y" : "d/m/Y";
var taskDate=new Date();
taskDate=addDays(taskDate,7);
document.getElementById("txtDueDate").setAttribute("value",new Date(taskDate).formatDate(DATE_FORMAT));
}
ContactPreview.prototype.loadNotesData=function (data) {
var notesxml=undefined;
var allNotes=new Array();
if(data.getElementsByTagName("notes")[0].textContent) { 
if(data.getElementsByTagName("notes")[0].textContent.length > 0) {
var dParse=new DOMParser();
notesxml=dParse.parseFromString('<rootnode>'+data.getElementsByTagName("notes")[0].textContent+'</rootnode>',
'application/xml');
}
} else { 
if(getValue(data.getElementsByTagName("notes")[0])!='') {
notesxml=new ActiveXObject("MSXML2.DOMDocument");
notesxml.loadXML('<rootnode>'+getValue(data.getElementsByTagName("notes")[0])+'</rootnode>');
}
}
if(notesxml) { allNotes=notesxml.getElementsByTagName("ANOTE"); }
userNotes=new Array();
for (var i=0; i < allNotes.length; i++) {
var userNote=new Object();
userNote.note=(allNotes[i].getElementsByTagName("TEXT")[0].childNodes[0]) ? 
htmlEncode(allNotes[i].getElementsByTagName("TEXT")[0].childNodes[0].nodeValue) : "";
userNote.noteDate=(allNotes[i].getElementsByTagName("DATE")[0].childNodes[0]) ? 
htmlEncode(allNotes[i].getElementsByTagName("DATE")[0].childNodes[0].nodeValue) : "";
userNote.category=(allNotes[i].getElementsByTagName("CATEGORY")[0].childNodes[0]) ? 
htmlEncode(allNotes[i].getElementsByTagName("CATEGORY")[0].childNodes[0].nodeValue) : "";
userNotes.push(userNote);
}
ContactPreview.loadNotesDataDOM();
}
ContactPreview.loadNotesDataDOM=function () {
var holder=document.getElementById('noteTableHolder')
while (holder.lastChild) holder.removeChild(holder.lastChild);
var text;
var textNode;
var notesHeaderNames=new Array('Category', 'Description', 'Date', '\u00a0');
var notesHeaderIds=new Array('noteDate', 'noteNote', 'noteCategory', 'noteAdmin');
var notesHeaderWidths=new Array('150px', '300px', '150px', '100px');
var notesTable=document.createElement('table');
notesTable.className='genericTable';
notesTable.style.display=(userNotes.length==0)? 'none' : 'block';
notesTable.style.margin='20px';
notesTable.style.cellSpacing=0;
notesTable.style.cellPadding=0;
contactPreview.i_notesViewTable=notesTable;
var colGroup=document.createElement('colgroup');
colGroup.span=4;
var col=document.createElement('col');
col.span=3;
colGroup.appendChild(col);
var col=document.createElement('col');
col.span=1;
contactPreview.i_notesAdminCol=col;
colGroup.appendChild(col);
notesTable.appendChild(colGroup);
var notesTbody=document.createElement('tbody');
var headerRow=document.createElement('tr');
var header
for (var i=0; i < notesHeaderNames.length; i++) {
header=document.createElement('th');
header.className='appnav';
header.style.width=notesHeaderWidths[i];
header.style.textAlign='left';
if (i==0) header.style.borderLeft=0;
text=notesHeaderNames[i];
textNode=document.createTextNode(notesHeaderNames[i]);
header.appendChild(textNode);
headerRow.appendChild(header);
}
notesTbody.appendChild(headerRow);
var textArray;
var noteFields;
var noteRow;
var noteCol;
var noteDiv;
var noteInput;
var buttonImg;
var noteOpts;
for (var i=0; i < userNotes.length; i++) {
noteRow=document.createElement('tr');
noteFields=new Array(userNotes[i].category, userNotes[i].note, 
userNotes[i].noteDate);
for (var j=0; j < 3; j++) {
noteCol=document.createElement('td');
noteCol.style.paddingLeft='10px';
noteCol.style.width=notesHeaderWidths[j];
noteCol.style.valign='top';
noteDiv=document.createElement('div');
noteDiv.style.display='inline';
text=noteFields[j];
if (!text) text=' ';
text=text.replace(/\n/g,"<br>");
noteDiv.innerHTML=text;
noteCol.appendChild(noteDiv);
if (j==1) {
noteOpts=new Object();
noteOpts.noteDiv=noteDiv;
noteOpts.rowNum=i;	
}
noteRow.appendChild(noteCol);
}
noteCol=document.createElement('td');
noteCol.valign='top';
noteCol.align='center';
buttonImg=document.createElement('img');
buttonImg.className='ico-delete';
buttonImg.title='Delete this note';
buttonImg.src=GUI_ROOT+'spacer.gif';
buttonImg.style.cursor='hand';
buttonImg.style.cursor='pointer';
buttonImg.onclick=ContactPreview.onClickDeleteNote;
buttonImg.noteOpts=noteOpts;
noteCol.appendChild(buttonImg);
buttonImg=document.createElement('img');
buttonImg.className='ico-pencil';
buttonImg.title='Edit this note';
buttonImg.src=GUI_ROOT+'spacer.gif';
buttonImg.style.cursor='hand';
buttonImg.style.cursor='pointer';
buttonImg.style.marginLeft='10px';
buttonImg.onclick=ContactPreview.onClickUpdateNote;
buttonImg.noteOpts=noteOpts;
noteCol.appendChild(buttonImg);
noteRow.appendChild(noteCol);
notesTbody.appendChild(noteRow);
}
notesTable.appendChild(notesTbody);
holder.appendChild(notesTable);
contactPreview.setNoteTableCols();
}
ContactPreview.prototype.replaceNotes=function () {
var noteText="";
for (var i=0; i < userNotes.length; i++) {
noteText+="<ANOTE><TEXT>"+htmlEncode(escape(userNotes[i].note))+"</TEXT>";
noteText+="<DATE>"+htmlEncode(escape(userNotes[i].noteDate))+"</DATE>";
noteText+="<CATEGORY>"+htmlEncode(escape(userNotes[i].category))+"</CATEGORY></ANOTE>";
}
ContactPreview.loadNotesDataDOM();
if (this.contactXML.get("UUID"))
commands.contactNotes_ReplaceNotes(this.contactXML.get("UUID"), noteText, "handlers.contactNotes_ReplaceNotes('"+this.contactXML.get("UUID")+"')");
if (document.getElementById("cbFollowUp").checked) {
var due=(document.getElementById("cboxNoDueDate").checked==false ? createDateFromStrings(document.getElementById("txtDueDate").value, "00:00", user_prefs.date_prefs) : undefined);
var ct=new CalendarTask(undefined, document.getElementById('txtTitle').value, due, document.getElementById("optPriority")[document.getElementById("optPriority").selectedIndex].value, document.getElementById("optStatus")[document.getElementById("optStatus").selectedIndex].value, document.getElementById("txtDesc").value);
ct.isNew(true);
var task_app=Application.getApplicationById(1015);
if (task_app!=undefined) {
task_app.getTaskDataModel().addTask(ct);
}
ct.save();
document.getElementById("cbFollowUp").checked=null;
document.getElementById("taskDiv").style.display="none";
}
}
ContactPreview.onClickDeleteNote=function (event) {
if (!event) event=window.event;
var noteOpts=cb.currentTarget(event).noteOpts;
userNotes.splice(noteOpts.rowNum, 1);
contactPreview.replaceNotes();
if(typeof window.parent.ExtensionBannerAds!="undefined") {
window.parent.ExtensionBannerAds.refreshAll();
}else{
if(window.opener!=null && 
window.opener.parent!=null &&
typeof window.opener.parent.ExtensionBannerAds!="undefined") 
{
window.opener.parent.ExtensionBannerAds.refreshAll();
}
}
}
ContactPreview.onClickUpdateNote=function (event) {
if (!event) event=window.event;
var noteOpts=cb.currentTarget(event).noteOpts;
var originalNoteSpan=noteOpts.noteDiv;
var textNode;
var editTable=document.createElement('table');
var editTableBody=document.createElement('tbody');
var editTableRow=document.createElement('tr');
var editTableCell=document.createElement('td');
var editItem=document.createElement('textarea');
editItem.style.cols=60;
editItem.style.rows=3;
noteOpts.textArea=editItem;
editTableCell.appendChild(editItem);
editTableRow.appendChild(editTableCell);
editTableCell=document.createElement('td');
var saveButton=document.createElement('button');
saveButton.onclick=ContactPreview.onClickSaveNote;
saveButton.noteOpts=noteOpts;
textNode=document.createTextNode('Save');
saveButton.appendChild(textNode);
editTableCell.appendChild(saveButton);
editTableCell.appendChild(document.createElement('br'));
var cancelButton=document.createElement('button');
cancelButton.onclick=ContactPreview.onClickCancelNote;
cancelButton.noteOpts=noteOpts;
textNode=document.createTextNode('Cancel');
cancelButton.appendChild(textNode);
editTableCell.appendChild(cancelButton);
editTableRow.appendChild(editTableCell);
editTableBody.appendChild(editTableRow);
editTable.appendChild(editTableBody);
var originalText=originalNoteSpan.innerHTML;
originalText=originalText.replace(/<[Bb][Rr]>/g,"\n");
originalText=htmlUnencode(originalText);
editItem.value=originalText;
var col=originalNoteSpan.parentNode;
col.removeChild(originalNoteSpan);
col.appendChild(editTable);
}
ContactPreview.cleanUpNoteEdit=function (noteOpts,save) {
if (save) {
var text=htmlEncode(noteOpts.textArea.value);
userNotes[noteOpts.rowNum].note=text;
}
contactPreview.replaceNotes();
}
ContactPreview.onClickSaveNote=function (event) {
if (!event) event=window.event;
var noteOpts=cb.currentTarget(event).noteOpts;
ContactPreview.cleanUpNoteEdit(noteOpts, true);
}
ContactPreview.onClickCancelNote=function (event) {
if (!event) event=window.event;
var noteOpts=cb.currentTarget(event).noteOpts;
ContactPreview.cleanUpNoteEdit(noteOpts, false);
}
ContactPreview.prototype.toggleTask=function(event) {
if (!event) event=window.event;
document.getElementById("taskDiv").style.display=(cb.currentTarget(event).checked)? "block" : "none";
this.resetTaskData();
}
ContactPreview.prototype.resetTaskData=function() {
document.getElementById("txtDesc").value=document.getElementById("tbNewNote").value;
document.getElementById("txtTitle").value="";
document.getElementById("optPriority").value=2;
document.getElementById("optStatus").value=0;
document.getElementById("cboxNoDueDate").checked=false;
}
ContactPreview.prototype.onClickToggleFields=function(event) {
if (!event) event=window.event;
var parentNode=cb.currentTarget(event).parentNode.parentNode.parentNode.parentNode;
while (parentNode.nextSibling && parentNode.nextSibling.firstChild.id.split("_")[1]!='HEADER') {
parentNode=parentNode.nextSibling;
if (cb.currentTarget(event).className=='b-arrow-right') {
if (parentNode.firstChild.id.split("_")[1].split("-")[0]=="N" || parentNode.firstChild.id.split("_")[1].split("-")[0]=="ADR") {
parentNode.style.display="";
} else if (parentNode.firstChild.id.split("_")[1]=="FN" || parentNode.firstChild.id.split("_")[1].split("-")[0]=="LABEL") {
parentNode.style.display="none";
}
} else {
for (var i=0; i < resources.contactFields.length; i++) {
for (var j=0; j < resources.contactFields[i].length; j++) {
if ("col1-"+resources.contactFields[i][j][1]==parentNode.firstChild.id && resources.contactFields[i][j][3]=='1')
parentNode.style.display="none";
else if (parentNode.firstChild.id.split("_")[1]=="FN" || parentNode.firstChild.id.split("_")[1].split("-")[0]=="LABEL")
parentNode.style.display="";
}
}
}
}
cb.currentTarget(event).className=(cb.currentTarget(event).className=='b-arrow-right')? 'b-arrow-down' : 'b-arrow-right';
}
ContactPreview.prototype.onClickNewNote=function (event) {
if (!event) event=window.event;
var userNote=new Object();
var notesCategory=document.getElementById("notesCategories");
userNote.note=htmlEncode(document.getElementById("tbNewNote").value);
userNote.noteDate=htmlEncode(new Date().formatDate("m-d-Y h:i A"));
userNote.category=htmlEncode(notesCategory.childNodes[notesCategory.selectedIndex].innerHTML);
if (userNote.category=="(none)") userNote.category="";
userNotes.push(userNote);
contactPreview.replaceNotes();
document.getElementById("tbNewNote").value="";
}
ContactPreview.prototype.reloadSnapshotWaitingDOM=function () {
document.getElementById("snapshotDiv").innerHTML="<a onclick='commands.contacts_GetRelationshipData(\"handlers.contacts_GetRelationshipData()\")'>Search for recent communication with this contact.</a>";
}
ContactPreview.prototype.loadSnapshotDataDOM=function (ssData) {
if (ssData.length==0) {
document.getElementById("snapshotDiv").innerHTML="No recent communication.";
} else {
var ssDOM=new Array();
ssDOM.push("<table id=snapshotTable width=100% class=genericTable style='display:block;margin-top:10px;' cellSpacing=0 cellPadding=0>");
ssDOM.push("<tbody id=snapshotTBody><tr>");
var snapshotNames=new Array("Category", "Description", "Date");
var snapshotIds=new Array("sstype", "ssdesc", "ssdate");
var ssWidths=new Array("150px", "350px", "150px");
for (var i=0; i < snapshotNames.length; i++) {
ssDOM.push("<th width="+ssWidths[i]+" id="+snapshotIds[i]+" class=appnav style='text-align:left'>"+snapshotNames[i]+"</th>");
}
ssDOM.push("</tr>");
for (var i=0; i < ssData.length; i++) {
ssDOM.push("<tr onclick='contactPreview.onClickEmailMessage(event)' id='"+ssData[i].id+"-"+ssData[i].loc+"' style='cursor:hand;cursor:pointer;'>");
var catName=(ssData[i].type=="emailto")? "Email - Sent" : (ssData[i].type=="emailfrom")? "Email - Received" : (ssData[i].type=="calendar")? "Calendar Event" : "";
ssDOM.push("<td style='padding-left:10px;'>"+catName+"</td><td style='padding-left:10px;'>"+ssData[i].desc+"</td><td style='padding-left:10px;'>"+ssData[i].date+"</td></tr>");
}
ssDOM.push("</tbody></table>");
document.getElementById("snapshotDiv").innerHTML=ssDOM.join('');
}
contactPreview.isSnapShotLoaded=true;
}
ContactPreview.prototype.getCurrentTab=function () {
for (var i=0; i < resources.tabNames.length; i++) {
if (document.getElementById(resources.tabNames[i]+"_tab").className=="tabMenuTab_active") {
return resources.tabNames[i];
}
}
}
ContactPreview.prototype.grayContactViewArea=function (activity) {
if (activity=="active") {
if (document.getElementById("listView")) {
var listView=document.getElementById("listView");
contactView.shadowBox();
}
var tabMenuIds=new Array("tabMenuAction_editContact", "tabMenuAction_saveContact", "tabMenuAction_printContact");
for (var i=0; i<tabMenuIds.length; i++) {
document.getElementById(tabMenuIds[i]).style.display="none";
var vrule=document.getElementById(tabMenuIds[i]+"_vrule")
if (vrule)
vrule.style.display="none";
}
} else {
if (activity=="inactive") {
contactView.unShadowBox();
}
}
}
ContactPreview.prototype.toggleEditMenu=function (grayed) {
if (document.getElementById("tabMenuAction_editContact")) {
document.getElementById("tabMenuAction_editContact").style.display=(grayed)? "none" : "";
document.getElementById("tabMenuAction_editContact").nextSibling.style.display=(grayed)? "none" : "";
}
}
ContactPreview.prototype.createMapQuestURL=function (myType, type, mapContact) {
var street=(myType=="WORK") ? "ADR-WORK-STREET" : "ADR-HOME-STREET";
var city=(myType=="WORK") ? "ADR-WORK-LOCALITY" : "ADR-HOME-LOCALITY";
var state=(myType=="WORK") ? "ADR-WORK-REGION" : "ADR-HOME-REGION";
var zipCode=(myType=="WORK") ? "ADR-WORK-PCODE" : "ADR-HOME-PCODE";
if (mapContact) {
var myStreet=(type=="WORK") ? mapContact.get("ADR-WORK-STREET") : mapContact.get("ADR-HOME-STREET");
var myCity=(type=="WORK") ? mapContact.get("ADR-WORK-LOCALITY") : mapContact.get("ADR-HOME-LOCALITY");
var myState=(type=="WORK") ? mapContact.get("ADR-WORK-REGION") : mapContact.get("ADR-HOME-REGION");
var myZipCode=(type=="WORK") ? mapContact.get("ADR-WORK-PCODE") : mapContact.get("ADR-HOME-PCODE");
window.open("http://www.mapquest.com/directions/main.adp?go=1&1a="+myStreet+"&2a="+this.contactXML.get(street)+"&1c="+myCity+"&2c="+this.contactXML.get(city)+"&1s="+myState+"&2s="+this.contactXML.get(state)+"&1z="+myZipCode+"&2z="+this.contactXML.get(zipCode)+"&dir=Get Directions","mapQuestWin");
} else {
return "http://www.mapquest.com/maps/map.adp?address="+this.contactXML.get(street)+"&city="+this.contactXML.get(city)+"&state="+this.contactXML.get(state)+"&zipcode="+this.contactXML.get(zipCode)+"&cid=lfmaplink";
}
}
ContactPreview.prototype.onClickCancel=function () {
if (modeType=="edit")
closeWindow();
contactPreview.businessInfoViewEdit("text");
contactView.unShadowBox();
var tabMenu=document.getElementById("table_tabMenu").getElementsByTagName("tr")[0];
var tabMenuIds=new Array("tabMenuAction_editContact", "tabMenuAction_saveContact", "tabMenuAction_printContact");
for (var i=0; i<tabMenuIds.length; i++) {
document.getElementById(tabMenuIds[i]).style.display="";
var vrule=document.getElementById(tabMenuIds[i]+"_vrule")
if (vrule)
vrule.style.display="";
}
}
ContactPreview.prototype.onClickClose=function () {
if (!contactView.isShadowBoxed()) contactView.togglePreviewPane("hidden");	
}
ContactPreview.prototype.onClickDate=function(event) {
if (!event) event=window.event;
var currentTarget=cb.currentTarget(event);
var uuid=currentTarget.id.split("_")[1];
var checkId="cb_"+uuid.toLowerCase();
if (contactPreview.isNewContact) {
if (contactPreview.validateDate(currentTarget.value)) {
if (document.getElementById(checkId)) return;
var specialDateCheckbox=cb.createElement("input", checkId, "", "", "type:checkbox");
if (!cb.isIE()) {
specialDateCheckbox.style.marginRight="3px;";
specialDateCheckbox.style.marginTop="3px;"
}
document.getElementById("col-DETAILED_"+uuid).appendChild(specialDateCheckbox);
document.getElementById(checkId).checked="true";
var mySpan=cb.createElement("span","span_"+uuid,"","line-height:20px;","","Add to Calendar");
document.getElementById("col-DETAILED_"+uuid).appendChild(mySpan);
} else {
if (document.getElementById(checkId)) {
document.getElementById("col-DETAILED_"+uuid).removeChild(document.getElementById(checkId));
document.getElementById("col-DETAILED_"+uuid).removeChild(document.getElementById("span_"+uuid));
}
}
} else {
if (contactPreview.validateDate(currentTarget.value)) {
document.getElementById(uuid.toLowerCase()+"div").style.display="block";
var badKeys={9:false, 27:false, 33:false, 34:false, 37:false, 38:false, 39:false, 40:false}
if ((!document.all && event.type=="input") || (document.all && event.type=="keyup" && badKeys[event.keyCode]!=false)) {
if(uuid=="BDAY" && contactPreview.contactXML.values[uuid]!=currentTarget.value) {
currentTarget.checked=true;
} else if (uuid=="ANNIVERSARY" && contactPreview.contactXML.values[uuid]!=currentTarget.value) {
currentTarget.checked=true;
} else if(uuid=="BDAY" && contactPreview.contactXML.values[uuid]==currentTarget.value && contactPreview.contactXML.values["attendbday"]=="false") {
currentTarget.checked=false;
} else if (uuid=="ANNIVERSARY" && contactPreview.contactXML.values[uuid]==currentTarget.value && contactPreview.contactXML.values["attendanni"]=="false") {
currentTarget.checked=false;
}
}
if (currentTarget.checked) document.getElementById(checkId).checked="true";
else document.getElementById(checkId).checked="";
}
}
}
ContactPreview.prototype.onClickEmailMessage=function (event) {
var selectedEmail=(cb.currentTarget(event).id=="") ? cb.currentTarget(event).parentNode : cb.currentTarget(event);
var email_id=selectedEmail.id.split("-")[0];
var folder_id=selectedEmail.id.split("-")[1];
if (this.currentSnapShot.length!=0 && document.getElementById(this.currentSnapShot[0]))
document.getElementById(this.currentSnapShot[0]).className=this.currentSnapShot[1];
this.currentSnapShot=new Array();
this.currentSnapShot.push(selectedEmail.id);
this.currentSnapShot.push(selectedEmail.className);
selectedEmail.className="hilite";
var message=new EmailMessage();
message.id(email_id);
message.folder_id(folder_id);
top.ApplicationEmail.getMessage(message,ContactPreview.displayEmail);
}
ContactPreview.displayEmail=function (message) {
top.ApplicationEmail.newMessage(message,4);
}
ContactPreview.prototype.onClickMarkAsPrivate=function (event) {
if (!event) event=window.event;
commands.contacts_MarkAsPrivate(this.contactXML.get("UUID"), cb.currentTarget(event).checked, "handlers.genericHandler()");
var titleDesc=(cb.currentTarget(event).checked) ? "Contact will be not be displayed in shared groups" : "Contact will be displayed in shared groups";
document.getElementById("markAsPrivateCheckbox").setAttribute("title", titleDesc);
}
ContactPreview.prototype.onClickHidePersonal=function (event) {
if (!event) event=window.event;
commands.contacts_HidePersonal(this.contactXML.get("UUID"), cb.currentTarget(event).checked, "handlers.genericHandler()");
}
ContactPreview.prototype.onClickSetState=function (event, sc) {
if (!event) event=window.event;
var xmlTagId=(cb.currentTarget(event).id.split("_")[1]=="bday") ? "bdayid" : (cb.currentTarget(event).id.split("_")[1]=="anniversary") ? "annid" : "";
var date=this.contactXML.get((xmlTagId=="bdayid" ? "BDAY" : "ANNIVERSARY"));
var state=sc.checked;
commands.contacts_SetEventState(this.contactXML.get(xmlTagId), cb.currentTarget(event).checked, "handlers.contacts_SetEventState('"+this.contactXML.get(xmlTagId)+"', '"+xmlTagId+"', '"+escape(this.contactXML.get("DISPLAYNAME"))+"', '"+date+"', '"+state+"')");
}
ContactPreview.prototype.onClickSaveContact=function () {
commands.contacts_ExportContacts("VCF", this.contactXML.get("UUID"));
}
ContactPreview.prototype.onClickTab=function (event, val) {
if (!event) event=window.event;
var currentTabId=(val) ? val : cb.currentTarget(event).id;
for (var i=0; i < resources.tabNames.length; i++) {
if (document.getElementById(resources.tabNames[i]+"_tab")) {
var tabCopy=document.getElementById(resources.tabNames[i]+"_tab");
if (document.getElementById(resources.tabNames[i]+"_div_1")) {
document.getElementById(resources.tabNames[i]+"_div_1").style.display=(currentTabId==tabCopy.id) ? "block" : "none";
}
if (document.getElementById(resources.tabNames[i]+"_div_2")) {
document.getElementById(resources.tabNames[i]+"_div_2").style.display=(currentTabId==tabCopy.id) ? "block" : "none";
}
tabCopy.className=(currentTabId==tabCopy.id) ? "tabMenuTab_active" : "tabMenuTab_inactive";
}
}
document.getElementById("contactInfoCol_1").style.width=(currentTabId=="Properties_tab" || currentTabId=="History_tab" || currentTabId=="Snapshot_tab") ? cb.getBrowserWidth() * 1 : cb.getBrowserWidth() * 0.5;
document.getElementById("contactInfoCol_2").style.display=(currentTabId=="Properties_tab" || currentTabId=="History_tab" || currentTabId=="Snapshot_tab") ? "none" : "";
}
ContactPreview.prototype.onClickTabMenuAction=function (event) {
if (!event) event=window.event;
if (contactPreview.isLoading) return;
var myAction=cb.getElement(cb.currentTarget(event)).id;
if (myAction=="tabMenuAction_editContact") {
var currentTab=contactPreview.getCurrentTab();
if (currentTab=="History") contactPreview.onClickTab("", "Overview_tab");
contactPreview.grayContactViewArea("active");
contactPreview.businessInfoViewEdit("editable");
} else {
if (myAction=="tabMenuAction_saveContact") {
contactPreview.onClickSaveContact();
} else if(myAction=="tabMenuAction_sendContactToBlackBerry"){
blackberry.saveContactToBlackberry((typeof contactView.currentSelection[0]!="undefined" ? contactView.currentSelection[0].id : preview_contactId),"preview");
}else {
if (myAction=="tabMenuAction_printContact") {
appName="contacts";
printFunction="contactPreview.getPreviewPrintData";
printWin=window.open("contactsPrintPreview.html", "PrintPreview", "resizable=yes,height=800,width=700,status=no,scrollbars=1");
}
}
}
}
ContactPreview.prototype.onClickUploadPicture=function (event) {
if (!event) event=window.event;
if (this.contactXML.get("ACCESS")=="w" || this.contactXML.get("ACCESS")=="f") {
window.open("contactsMedia.html?unm="+user_prefs.user_name+"&sid="+user_prefs.session_id+"&uuid="+this.contactXML.get("UUID")+"&type=PHOTO&source=preview", "mediaWindow", "resizable=yes,height=300,width=400,left=150,top=300,status=no");
}
}
sendIM=function(contactId) { root.document.getElementById("IM_Alert").currentlyOnlineClicked(dataCache.findUser(contactId).username); }
ContactPreview.prototype.onClickQuickLink=function (event) {
if (!event) event=window.event;
var eventId=cb.currentTarget(event).id;
if (eventId=="Email") root.openSendEmail(this.contactXML.get("EMAIL1"), "");
else if (eventId=="Efax") root.EfaxContactsInterface.obj.newFax(this.contactXML.get("UUID"));
else if (eventId=="Appointment") {
if (this.contactXML!=undefined) {
Application.getApplicationById(1004).popSharedEvent(this.contactXML.get("DISPLAYNAME"), this.contactXML.get("EMAIL1"));
}
else {
alert('Please wait until contact details have finished loading and try again.');
}
}
else if (eventId=="IM") sendIM(this.contactXML.get("UUID"));
else if (eventId=="Gift") {
var amazon=Application.getApplicationById(3008);
if (amazon!=undefined) amazon.handleContactsLinkClick(this.contactXML.get("UUID"));
}
else if (eventId=="Flowers") {
var ftd=Application.getApplicationById(3009);
if (ftd!=undefined) ftd.handleContactsLinkClick(this.contactXML.get("UUID"));
}
}
ContactPreview.prototype.onClickUpdate=function () {
var detailedView=resources.contactFields[1];
var birthday_id=this.contactXML.values["bdayid"];
var anniversary_id=this.contactXML.values["annid"];
this.contactXML.values["addanni"]=document.getElementById("cb_anniversary") && document.getElementById("cb_anniversary").checked;
this.contactXML.values["addbday"]=document.getElementById("cb_bday") && document.getElementById("cb_bday").checked;
for (var i=0;i<detailedView.length; i++) {
for (var j=0;j<detailedView[i][1].length;j++) {
var currentVal=detailedView[i][1][j];
if (currentVal.split("_")[1]=='HEADER') {
continue;
}
if (document.getElementById(currentVal).options && 
document.getElementById(currentVal).selectedIndex==-1) {
document.getElementById(currentVal).selectedIndex=0;
}
var tmp_val=document.getElementById(currentVal).value.replace(/<.*?>/g, "");
this.contactXML.values[currentVal.split("_")[1]]=(document.getElementById(currentVal).options)? htmlUnencode(document.getElementById(currentVal).options[document.getElementById(currentVal).selectedIndex].innerHTML) : tmp_val;
}
}
var tagId="";
var date="";
var state=false;
if(this.contactXML.values["addbday"]==true && !document.all)  {
tagId="bdayid";
date=this.contactXML.values["BDAY"];
state=this.contactXML.values["addbday"];
commands.contacts_SetEventState(this.contactXML.get(tagId), state, "handlers.contacts_SetEventState('"+this.contactXML.get(tagId)+"', '"+tagId+"', '"+escape(this.contactXML.get("DISPLAYNAME"))+"', '"+date+"', '"+state+"')");
}
if(this.contactXML.values["addanni"]==true && !document.all)  {
tagId="annid";
date=this.contactXML.values["ANNIVERSARY"];
state=this.contactXML.values["addanni"];
commands.contacts_SetEventState(this.contactXML.get(tagId), state, "handlers.contacts_SetEventState('"+this.contactXML.get(tagId)+"', '"+tagId+"', '"+escape(this.contactXML.get("DISPLAYNAME"))+"', '"+date+"', '"+state+"')");
}
var cal_app=Application.getApplicationById(1004);
if (cal_app!=undefined) {
var def=CalendarDataModel.getDefaultCalendar();
}
if (def!=undefined) {
if (birthday_id!=undefined && birthday_id!="undefined" && birthday_id!="") {
var ev=def.getItemById(birthday_id, true);
if (ev!=undefined) {
def.removeEvent(ev);
}
removeMyDaySpecialEvent(birthday_id);
}
if (anniversary_id!=undefined && anniversary_id!="undefined" && anniversary_id!="") {
var ev=def.getItemById(anniversary_id, true);
if (ev!=undefined) {
def.removeEvent(ev);
}
removeMyDaySpecialEvent(anniversary_id);
}
}
if (this.contactXML.values["bdayid"]==null) {
this.contactXML.values["bdayid"]='';
}
if (this.contactXML.values["annid"]==null) {
this.contactXML.values["annid"]='';
}
for (var i=0; i < this.contactXML.udfNames.length; i++) {
this.contactXML.values["udf_"+i]=escape(htmlEncode(document.getElementById("udf_"+i).value));
}
commands.contacts_UpdateContact(this.contactXML.get("UUID"), this.contactXML.contactToString(), "handlers.contacts_UpdateContact('"+this.contactXML.get("UUID")+"')");
contactView.unShadowBox();
document.getElementById("bdaydiv").style.display=(contactPreview.validateDate(this.contactXML.values["BDAY"])) ? "block" : "none";
document.getElementById("anniversarydiv").style.display=(contactPreview.validateDate(this.contactXML.values["ANNIVERSARY"])) ? "block" : "none";
document.getElementById("calendarHeader").style.display=(contactPreview.validateDate(this.contactXML.values["ANNIVERSARY"])||(contactPreview.validateDate(this.contactXML.values["BDAY"]))) ? "block" : "none";
}
ContactPreview.prototype.onContextMenuAddress=function(event) {
if (!event) { event=window.event; }
event.returnValue=false;
var addressType=(cb.currentTarget(event).id.search("WORK")!=-1)? "WORK" : "HOME";
var contextMenu=new jsDOMenu(180, "", "cursor",  false , "contactContextMenu");
contextMenu.addMenuItem(new menuItem("MapQuest Options", "headerElement", "","false","jsdomenufoldermenu",""));
contextMenu.addMenuItem(new menuItem("Directions from my Work", "", "Javascript:commands.contacts_GetContact('"+dataCache.findUser('self').uuid+"','handlers.contacts_GetContactForMap(\\'"+addressType+"\\',\\'WORK\\')')", "true", "", ""));
contextMenu.addMenuItem(new menuItem("Directions from my Home", "", "Javascript:commands.contacts_GetContact('"+dataCache.findUser('self').uuid+"','handlers.contacts_GetContactForMap(\\'"+addressType+"\\',\\'HOME\\')')", "true", "", ""));
contextMenu.items["headerElement"].setClassNameOver("jsdomenufoldermenu");
contextMenu.show();
contextMenu.setX(event.clientX-(contextMenu.menuObj.offsetWidth/2));
contextMenu.setY(event.clientY-(contextMenu.menuObj.offsetHeight/2));
if(event) if(event.stopPropagation) event.stopPropagation(); else event.cancelBubble=true;
return false;
}
ContactPreview.prototype.onKeyDownUpdateFields=function (event) {
if (!event) { event=window.event; }
var rootId=cb.currentTarget(event).id.split("_")[1];
var unchangedField=((cb.currentTarget(event).id.search("OVERVIEW")!=-1)? "DETAILED_" : "OVERVIEW_")+rootId;
var unchanged=document.getElementById(unchangedField);
if (unchanged) {
if (cb.currentTarget(event).options) unchanged.selectedIndex=cb.currentTarget(event).selectedIndex;
else unchanged.value=cb.currentTarget(event).value;
}
if (rootId=='FN') {
var name=parseName(document.getElementById(cb.currentTarget(event).id).value);
var nameFields=new Array("PREFIX","GIVEN","MIDDLE","FAMILY","SUFFIX");
for (var i=0;i<nameFields.length;i++) {
document.getElementById("DETAILED_N-"+nameFields[i]).value=(!name[nameFields[i].toLowerCase()])? "" : name[nameFields[i].toLowerCase()];	
}
} else if (rootId=="LABEL-HOME" || rootId=="LABEL-WORK") {
var address=parseAddress(document.getElementById(cb.currentTarget(event).id).value);
var addressFields=new Array("STREET","POBOX","LOCALITY","REGION","PCODE","CTRY");
for (var i=0;i<addressFields.length;i++)
document.getElementById("DETAILED_ADR-"+rootId.split("-")[1]+"-"+addressFields[i]).value=(!address[addressFields[i].toLowerCase()])? "" : address[addressFields[i].toLowerCase()];
}
if (rootId=='FN' || rootId=='ORG-COMPANY') setTimeout("contactPreview.refreshDNControl()",500);
}
ContactPreview.prototype.getPreviewPrintData=function (div) {
var detailedView=resources.contactFields[1];
var ppDOM=new Array();
ppDOM.push("<center><span style='border-bottom: 1px solid #000; font-size: 24px;'>"+unescape(this.contactXML.values['DISPLAYNAME'])+"</span></center>");
myImageSrc=(this.contactXML.values['photo']=='true')? commands.contacts_GetMedia(this.contactXML.values['UUID']) : GUI_ROOT+'spacer.gif';
ppDOM.push("<div style='float:right;display:inline;'>");
ppDOM.push("<div style='float:none;'><img src='"+myImageSrc+"' width=200px height=240px></img></div>");
ppDOM.push("</div>");
ppDOM.push("<table style='margin-left:30px'><tbody>");
for (var i=0;i<detailedView.length; i++) {
for (var j=0;j<detailedView[i][1].length;j++) {
var currentVal=detailedView[i][1][j];
if (currentVal.split("_")[1]=='HEADER')
ppDOM.push("<tr><td colspan=2 class=drag-opacity style='padding-left:10px;color:#000;padding-top:12px;'><span></span><b>"+detailedView[i][0]+"</b><hr class='drag-opacity' size=1 width='75%' align=left style='color:#666'></td></tr>");
else
if (this.contactXML.values[currentVal.split("_")[1]] && this.contactXML.values[currentVal.split("_")[1]]!="") {
var myVal=unescape(this.contactXML.values[currentVal.split("_")[1]]);
ppDOM.push("<tr style='line-height:20px'><td width=40% class='contactLabel'>"+detailedView[i][0]+"</td><td>"+myVal.replace(/\n/g,"<br>")+"</td></tr>");
}
}
}
ppDOM.push("</tbody></table>");
div.innerHTML=ppDOM.join('');
}
function Commands() {
this.rootURL="/cgi-bin/contacts/";
this.usermodelRootURL="/internal-cgi-bin/phoenix/";
var commandAttr=new Array("ACCEPT_SHARE","ADD_CONTACT","ADD_CONTACT_TO_GROUP","ATTACH_MY_VCARD","COPY_CONTACT_TO_GROUP","CREATE_CONTACT","CREATE_GROUP","CREATE_UDF","DELETE_CONTACT",
"DELETE_GROUP","DELETE_UDF","EXPORT_CSV","EXPORT_VCF","FIELD_ATTACHMENT","GET_ALL_CONTACTS","GET_CONTACT","GET_CURRENTLY_ONLINE","GET_CURRENT_SHARES","GET_MEDIA","GET_NOTES",
"GET_ORDERED_CONTACTS_FOR_GRID","GET_UDF_LIST","LOG_SENT_INFO","PREPARE_ATTACHMENT","PROPOSE_SHARE","REMOVE_CONTACT_FROM_GROUP","REPLACE_NOTES","REVOKE_SHARE","REVOKED_SHARE",
"REPLACE_FREEBUSY","RENAME_GROUP","SENT_CONTACT_INFO_TO","SET_MEDIA","SET_PRIVACY","SHARE_PERMISSIONS","UPDATE_CONTACT","SET_EVENT_STATE","SET_HIDE_PERSONAL","GET_RELATIONSHIP_DATA",
"GET_PREFERENCES","REPLACE_PREFERENCES","GET_BUDDYLIST","SET_BUDDYLIST","RENAME_UDF","IMPORT_MAPPED_CSV");
var fcgAttr=new Array("AcceptShare","CreateContact","AddContactToGroup","AttachMyVcard","CopyContact","CreateContact","CreateGroup","CreateUserDefinedField","DeleteContact",
"DeleteGroup","DeleteUserDefinedField","ExportCSV","ExportVCF","FieldAttachment","GetAllContacts","GetContact","GetCurrentlyOnline","GetCurrentShares","GetMedia","GetNotes",
"GetOrderedContactsForGrid","GetUDFList","ISentMyInfoTo","PrepareAttachment","ProposeShare","RemoveContactFromGroup","ReplaceNotes","OwnerRevokeShare","OwnerRevokedShare","ReplaceFreeBusy",
"RenameGroup","WhoHaveISentMyInfoTo","SetMedia","SetPrivacy","SharePermissions","UpdateContact","SetEventState","SetHidePersonal","GetRelationshipData","GetPreferences","ReplacePreferences",
"GetBuddyList","SetBuddyList","RenameUserDefinedField","ImportMappedCSV");
for (var i=0;i<commandAttr.length;i++)
this[commandAttr[i]+"_CGI"]=this.rootURL+"core-"+fcgAttr[i]+".fcg";
this.USER_MODEL_CGI=this.usermodelRootURL+"uUserFactoryCgi.fcg";
}
Commands.prototype.generalCGIParams=function(paramName, contactUserName) {
var params=new CGIParams(paramName);
var myAdjUserName=contactUserName;
if (!myAdjUserName || (myAdjUserName==undefined)) {
myAdjUserName=user_prefs.user_name;
}
params.addParam('caller', user_prefs.user_name);
params.addParam('owner', myAdjUserName);	
return params;
}
Commands.prototype.addAuthentication=function() {
return "&unm="+user_prefs.user_name+"&sid="+user_prefs.session_id;
}
Commands.prototype.attachments_AttachVCard=function(type,handler) {
var params=this.generalCGIParams("AttachMyVcard");
params.addParam('which', type);
ajaxServerRequest_mul(this.ATTACH_MY_VCARD_CGI, handler, params.toString());
}
Commands.prototype.attachments_FieldAttachment=function(folderId, messageID, attemId, attachmentId, handler) {
var params=this.generalCGIParams("FieldAttachment");
params.addParam('folderId', folderId);
params.addParam('messageID', messageID);
params.addParam('attemId', attemId);
params.addParam('attachmentId', attachmentId);
ajaxServerRequest_mul(this.FIELD_ATTACHMENT_CGI, handler, params.toString());
}
Commands.prototype.attachments_PrepareAttachment=function(contactIdString,handler) {
var params=this.generalCGIParams("PrepareAttachment");
params.addParam('contacts', contactIdString);
ajaxServerRequest_mul(this.PREPARE_ATTACHMENT_CGI, handler, params.toString());
}
Commands.prototype.contacts_AddContactsToGroup=function(groupId,contactIdString,handler) {
var ownerName=dataCache.findOwner(groupId);
var params=this.generalCGIParams("AddContactToGroup", ownerName);
params.addParam('groupid', groupId);
params.addParam('contactid', contactIdString);
ajaxServerRequest_mul(this.ADD_CONTACT_TO_GROUP_CGI, handler, params.toString(), true);
}
Commands.prototype.contacts_CopyContactsToGroup=function(groupId,copyUuidList,handler) {
var params=this.generalCGIParams("CopyContact", dataCache.findOwner(groupId));
var finalOutput="";
for (var i=0; i<copyUuidList.length; i+=2) {
finalOutput+="<owner"+((i/2)+1)+">"+copyUuidList[i]+"</owner"+((i/2)+1)+">";
finalOutput+="<contact"+((i/2)+1)+">"+copyUuidList[i+1]+"</contact"+((i/2)+1)+">";
}
params.addParam('destGroup', groupId);
params.addXML(finalOutput);
ajaxServerRequest_mul(this.COPY_CONTACT_TO_GROUP_CGI, handler, params.toString(), true);
}
Commands.prototype.contacts_CopyContactsNoGroup=function(recipient, donor,contactString,handler) {
var params=this.generalCGIParams("CopyContact", recipient);
var finalOutput="";
var contacts=contactString.toString().split(",");
for (var i=0; i<contacts.length; i++) {
finalOutput+="<owner"+(i+1)+">"+donor+"</owner"+(i+1)+">";
finalOutput+="<contact"+(i+1)+">"+contacts[i]+"</contact"+(i+1)+">";
}
params.addParam('destGroup', '');
params.addXML(finalOutput);
ajaxServerRequest_mul(this.COPY_CONTACT_TO_GROUP_CGI, handler, params.toString(), true);
}
Commands.prototype.contacts_CreateContact=function(contactName, currentContact, contactUserName, groupId, handler) {
var params=this.generalCGIParams("CreateContact", contactUserName);
params.addParam('contactname', escape(htmlEncode(contactName)));
if (groupId) {
params.addParam('groupId', groupId);
var ownerName=dataCache.findOwner(groupId);
if(ownerName) {
params.addParam("owner", ownerName);
if(groupId=="All_"+ownerName) {
params.addParam("groupId", "AllPers");
}
}
}
params.addXML(currentContact);
ajaxServerRequest_mul(this.CREATE_CONTACT_CGI, handler, params.toString());
}
Commands.prototype.contacts_DeleteContact=function(contactUuid,handler) {
var ownerName=dataCache.findOwner(contactUuid);
var params=this.generalCGIParams("DeleteContact",ownerName);
params.addParam('contactid', contactUuid);
ajaxServerRequest_mul(this.DELETE_CONTACT_CGI, handler, params.toString());
}
Commands.prototype.contacts_ExportContacts=function(type, contactIds) {
var exportCGIName=(type=="CC" || type=="CSV")? "ExportCSV" : (type=="VCF")? "ExportVCF":"";
var exportCGI=(type=="CSV"|| type=="CC")? this.EXPORT_CSV_CGI : (type=="VCF")? this.EXPORT_VCF_CGI : "";
var params=this.generalCGIParams(exportCGIName);
params.addParam('contacts', contactIds);
if (type=="CC")
params.addParam('format', 'ConstantContact');
document.getElementById("exportFrame").src=exportCGI+"?xml="+params.toString()+this.addAuthentication();
}
Commands.prototype.contacts_GetAllContacts=function(contactUserName, handler) {
var script=document.getElementById('getAllContacts');
if (!script) {
script=document.createElement('script');
script.type='text/javascript';
script.id='getAllContacts';
document.getElementsByTagName('head')[0].appendChild(script);
}
script.src='/cgi-bin/contacts/core-GetAllContactsJSON.fcg?'+"xml="+this.generalCGIParams("GetAllContactsJSON").toString()+commands.addAuthentication();
}
Commands.prototype.contacts_GetContact=function(contactUuid, handler) {
var ownerName=dataCache.findOwner(contactUuid);
var params=this.generalCGIParams("GetContact", ownerName);
params.addParam('contactid', contactUuid);
ajaxServerRequest_mul(this.GET_CONTACT_CGI, handler, params.toString());
}
Commands.prototype.contacts_GetMedia=function(contactUuid) {
var ownerName=dataCache.findOwner(contactUuid);
var params=this.generalCGIParams("GetMedia", ownerName);
params.addParam('contactid', contactUuid);
params.addParam('mediatype', "PHOTO");
var curdate=new Date();
var dstring=curdate.toGMTString();
return (this.GET_MEDIA_CGI+"?xml="+params.toString()+this.addAuthentication()+"&str="+dstring);
}
Commands.prototype.contacts_GetCurrentlyOnline=function(handler) {
var params=this.generalCGIParams("GetCurrentlyOnline");
params.addParam('allEnt', 'true');
ajaxServerRequest_mul(this.GET_CURRENTLY_ONLINE_CGI, handler, params.toString());
}
Commands.prototype.contacts_GetOrderedContactsForGrid=function(contactUserName, fields, group, sortField, min, max, displayChars, search, handler) {
var cacheObj=root.GridCache.find(contactUserName, fields, group, sortField, min, max, displayChars, search);
if (cacheObj.min!=undefined) { 
if (cacheObj.data==undefined) 
setTimeout("commands.contacts_GetOrderedContactsForGrid('"+contactUserName+"','"+fields+"','"+group+"','"+sortField+"','"+min+"','"+max+"','"+displayChars+"','"+search+"')",500);
else
handlers.contacts_GetOrderedContactsForGrid2(cacheObj.data);
return;
}
var params=this.generalCGIParams("GetOrderedContactsForGrid", contactUserName);
params.addParam('fields', fields);
params.addParam('group', group);
params.addParam('sortField', sortField);
params.addParam('min', min);
params.addParam('max', max);
params.addParam('displayChars', displayChars);
params.addParam('search', search);
ajaxServerRequest_mul(this.GET_ORDERED_CONTACTS_FOR_GRID_CGI, "handlers.contacts_GetOrderedContactsForGrid("+cacheObj+")", params.toString());
}
Commands.prototype.contacts_GetRelationshipData=function(handler,email1,email2,username) {
var params=this.generalCGIParams("GetRelationshipData");
params.addParam('email1', (email1)? email1 : contactPreview.contactXML.get('EMAIL1'));
params.addParam('email2', (email2)? email2 : contactPreview.contactXML.get('EMAIL2'));
params.addParam('username', (username)? username : dataCache.findUser(contactPreview.contactXML.get('UUID')).username);
ajaxServerRequest_mul(this.GET_RELATIONSHIP_DATA_CGI, handler, params.toString());
}
Commands.prototype.contacts_HidePersonal=function(contactUuid,myStatus,handler) {
var params=this.generalCGIParams("SetHidePersonal", "enterprise");
params.addParam('entityid', contactUuid);
params.addParam('status', myStatus);
ajaxServerRequest_mul(this.SET_HIDE_PERSONAL_CGI, handler, params.toString());
}
Commands.prototype.contacts_MarkAsPrivate=function(contactId,status,handler) {
var params=this.generalCGIParams("SetPrivacy");
params.addParam('contactid', contactId);
params.addParam('status', status);
ajaxServerRequest_mul(this.SET_PRIVACY_CGI, handler, params.toString());
}
Commands.prototype.contacts_RemoveContactsFromGroup=function(groupUuid,contactIdString,handler) {
var ownerName=dataCache.findOwner(groupUuid);
var params=this.generalCGIParams("RemoveContactFromGroup", ownerName);
params.addParam('contactid', contactIdString);
params.addParam('groupid', groupUuid);
ajaxServerRequest_mul(this.REMOVE_CONTACT_FROM_GROUP_CGI, handler, params.toString(), true);
}
Commands.prototype.contacts_ReplaceFreeBusy=function(userName,freeBusy,handler) {
var contactId=dataCache.findUserByUserName(userName).uuid;
var params=this.generalCGIParams("ReplaceFreeBusy", "enterprise");
params.addParam('entityid', contactId);
params.addParam('freeBusy', freeBusy);
ajaxServerRequest_mul(this.REPLACE_FREEBUSY_CGI, handler, params.toString());
}
Commands.prototype.contacts_SetEventState=function(eventId,state,handler) {
if (eventId=="" || eventId==undefined) return false;
var params=this.generalCGIParams("SetEventState");
params.addParam('eventId', eventId);
params.addParam('state', state)
ajaxServerRequest_mul(this.SET_EVENT_STATE_CGI, handler, params.toString());
}
Commands.prototype.contacts_SetMedia=function(contactUuid, handler) {
var ownerName=dataCache.findOwner(contactUuid);
var params=this.generalCGIParams("SetMedia", ownerName);
params.addParam('contactid', contactUuid);
params.addParam('mediatype', "PHOTO");
params.addParam('datatype', "");
params.addParam('data', "");
document.getElementById("upload_form").setAttribute("action", this.SET_MEDIA_CGI);
document.getElementById("upload_form_unm").setAttribute("value", user_prefs.user_name);
document.getElementById("upload_form_sid").setAttribute("value", user_prefs.session_id);
document.getElementById("upload_contactid").setAttribute("value", contactUuid);
document.getElementById("upload_form_input").setAttribute("value", params.toString());
document.getElementById("upload_form").submit();
}
Commands.prototype.contacts_RemoveMedia=function(contactUuid, handler) {
var ownerName=dataCache.findOwner(contactUuid);
var params=this.generalCGIParams("DeleteMedia");
params.addParam('owner', ownerName);
params.addParam('caller', user_prefs['user_name']);
params.addParam('method', "DeleteMedia");
params.addParam('contactid', contactUuid);
params.addParam('mediatype', "PHOTO");
ajaxServerRequest_mul('/cgi-bin/contacts/core-DeleteMedia.fcg', handler, params.toString());
}
Commands.prototype.contacts_UpdateContact=function(contactUuid,currentContact,handler) {
var ownerName=dataCache.findOwner(contactUuid);
var params=this.generalCGIParams("UpdateContact", ownerName);
params.addParam('contactId', contactUuid);
params.addXML(currentContact);
ajaxServerRequest_mul(this.UPDATE_CONTACT_CGI, handler, params.toString());
}
Commands.prototype.contactNotes_GetNotes=function(entityId, handler) {
var ownerName=dataCache.findOwner(entityId);
var params=this.generalCGIParams("GetNotes", ownerName);
params.addParam('entityid', entityId);
ajaxServerRequest_mul(this.GET_NOTES_CGI, handler, params.toString());
}
Commands.prototype.contactNotes_ReplaceNotes=function(entityId, notesText, handler) {
var ownerName=dataCache.findOwner(entityId);
var params=this.generalCGIParams("ReplaceNotes", ownerName);
params.addParam('entityid', entityId);
params.addParam('notes', notesText);
ajaxServerRequest_mul(this.REPLACE_NOTES_CGI, handler, params.toString());
}
Commands.prototype.groups_CreateGroup=function(groupName,contactUserName,handler) {
groupName=groupName.replace(/(^\s+|\s+$)/g, '');
if (groupName.length <=0) {
alert ("Please enter a name for the group");
return;
}
var params=this.generalCGIParams("CreateGroup", contactUserName);
params.addParam('groupname', escape(htmlEncode(groupName)));
ajaxServerRequest_mul(this.CREATE_GROUP_CGI, handler, params.toString(), true);
}
Commands.prototype.groups_DeleteGroup=function(groupUuid,handler) {
var ownerName=dataCache.findOwner(groupUuid);
var params=this.generalCGIParams("DeleteGroup", ownerName);
params.addParam('groupid', groupUuid);
ajaxServerRequest_mul(this.DELETE_GROUP_CGI, handler, params.toString());
}
Commands.prototype.groups_RenameGroup=function(groupUuid, groupName, handler) {
var ownerName=dataCache.findOwner(groupUuid);
var params=this.generalCGIParams("RenameGroup", ownerName);
params.addParam('groupid', groupUuid);
params.addParam('newgroupname', escape(htmlEncode(groupName)));
ajaxServerRequest_mul(this.RENAME_GROUP_CGI, handler, params.toString(), true);
}
Commands.prototype.im_GetBuddyList=function(handler) {
var params=this.generalCGIParams("GetBuddyList");
ajaxServerRequest_mul(this.GET_BUDDYLIST_CGI, handler, params.toString());
}
Commands.prototype.im_SetBuddyList=function(buddies, allEntContacts, handler) {
var params=this.generalCGIParams("SetBuddyList");
params.addXML("<buddies>"+buddies+"</buddies><AllEnterpriseOnline>"+allEntContacts+"</AllEnterpriseOnline>");
ajaxServerRequest_mul(this.SET_BUDDYLIST_CGI, handler, params.toString());
}
Commands.prototype.prefs_GetPreferences=function(handler) {
var params=this.generalCGIParams("GetPreferences");
ajaxServerRequest_mul(this.GET_PREFERENCES_CGI, handler, params.toString());
}
Commands.prototype.prefs_ReplacePreferences=function(aeo,displayNum,previewStatus, handler) {
var params=this.generalCGIParams("ReplacePreferences");
params.addXML("<prefs><displayNum>"+displayNum+"</displayNum><previewStatus>"+previewStatus+"</previewStatus><AllEnterpriseOnline>"+aeo+"</AllEnterpriseOnline></prefs>");
ajaxServerRequest_mul(this.REPLACE_PREFERENCES_CGI, handler, params.toString());
}
Commands.prototype.shares_GetCurrentShares=function(ownerName, handler) {
var params=this.generalCGIParams("GetCurrentShares", ownerName);
ajaxServerRequest_mul(this.GET_CURRENT_SHARES_CGI, handler, params.toString());
}
Commands.prototype.shares_ProposeShare=function(recipientList,groupUuid,permissionList,handler) {
var params=new CGIParams("ProposeShare");
params.addParam('caller', user_prefs.user_name);
params.addParam('owner', dataCache.findOwner(groupUuid)); 
params.addParam('recipient', recipientList);
params.addParam('uuid', groupUuid);
params.addParam('permission', permissionList);
ajaxServerRequest_mul(this.PROPOSE_SHARE_CGI, handler, params.toString());
}
Commands.prototype.shares_RevokeShare=function(recipientList,groupUuid,handler) { 
var params=this.generalCGIParams("OwnerRevokeShare");
params.addParam('owner', dataCache.findOwner(groupUuid));
params.addParam('recipient', recipientList);
params.addParam('entityId', groupUuid);
ajaxServerRequest_mul(this.REVOKE_SHARE_CGI, handler, params.toString());
}
Commands.prototype.shares_RevokedShare=function(handler,groupUuid) { 
var ownerName=dataCache.findOwner(groupUuid);
var params=this.generalCGIParams("OwnerRevokedShare");
params.addParam('sharer', ownerName);
params.addParam('entityId', groupUuid);
ajaxServerRequest_mul(this.REVOKED_SHARE_CGI, handler, params.toString());
}
Commands.prototype.shares_SharePermissions=function(recipientList,groupUuid,permissions,handler) {
var params=this.generalCGIParams("SharePermissions");
params.addParam('owner', dataCache.findOwner(groupUuid));
params.addParam('contactid', groupUuid);
params.addParam('recipientId', recipientList);
params.addParam('permissions', permissions);
ajaxServerRequest_mul(this.SHARE_PERMISSIONS_CGI, handler, params.toString());
}
Commands.prototype.udfs_CreateUDFs=function(fieldName, owner,handler) {
var params=this.generalCGIParams("CreateUserDefinedField",owner);
params.addParam('fieldname', htmlEncode(escape(fieldName)));
ajaxServerRequest_mul(this.CREATE_UDF_CGI, handler, params.toString());
}
Commands.prototype.udfs_DeleteUDFs=function(fieldName,owner, handler) {
var params=this.generalCGIParams("DeleteUserDefinedField", owner);
params.addParam('fieldname', htmlEncode(escape(fieldName)));
ajaxServerRequest_mul(this.DELETE_UDF_CGI, handler, params.toString());
}
Commands.prototype.udfs_GetUDFs=function(contactUserName, handler) {
var params=this.generalCGIParams("GetUDFList", contactUserName);
ajaxServerRequest_mul(this.GET_UDF_LIST_CGI, handler, params.toString());
}
Commands.prototype.udfs_RenameUDFs=function(oldField, newField,owner, handler) {
var params=this.generalCGIParams("RenameUserDefinedField",owner);
params.addParam('oldField', htmlEncode(escape(oldField)));
params.addParam('newField', htmlEncode(escape(newField)));
ajaxServerRequest_mul(this.RENAME_UDF_CGI, handler, params.toString());
}
Commands.prototype.contacts_ImportMappedCSV=function(owner,columns,filename,groups,handler) {
var params=this.generalCGIParams("ImportMappedCSV",owner);
params.addXML("<columns>"+columns+"</columns>");
params.addParam('filename', htmlEncode(escape(filename)));
params.addParam('groups', htmlEncode(escape(groups)));
ajaxServerRequest_mul(this.IMPORT_MAPPED_CSV_CGI, handler, params.toString());
}
function Handlers() {}
Handlers.prototype.attachments_PrepareMyAttachment=function(sendToString,vcard_type,index) {
handlers.attachments_PrepareAttachment(sendToString, index, vcard_type);
}
Handlers.prototype.attachments_PrepareAttachment=function(sendToString,index,vcard_type) {
var data=this.readValidateData("PrepareAttachment", index);
if (data) {
var emailString="";
if (sendToString!="") {
var uuidArray=sendToString.split(",");
for (var i=0; i<uuidArray.length; i++) {
var mailParam=(dataCache.findUser(uuidArray[i]))? dataCache.findUser(uuidArray[i]).email : sendToString;
if (emailString=="") emailString+=mailParam;
else emailString+=","+mailParam;
}
}
var resultset=cleanXMLValue(data,"attachment");
var atts=resultset.split("/");
var att_list=Array();
for(var x=0; x < atts.length; x++) {
if(atts[x].length > 0) {
var att=new Object();
var att_data=atts[x].split(";");
att.id=att_data[0];
att.size=parseInt(att_data[1]);
att.type=att_data[2];
att.name=att_data[3];
if(vcard_type!=undefined) {
switch(vcard_type) {
case "work":
att.vcard_type=1;
break;
case "personal":
att.vcard_type=2;
break;
case "all":
att.vcard_type=3;
break;
}
}
att_list.push(att);
}
}
var csid=cleanXMLValue(data, "csid");
if(parent.parent.openSendEmail) 
parent.parent.openSendEmail(emailString, '', '', '', '', '', att_list, csid);
else
top.openSendEmail(emailString, '', '', '', '', '', att_list, csid);
}
}
Handlers.prototype.attachments_FieldAttachment=function(index) {
var data=this.readValidateData("FieldAttachment", index);
if (data) {
var currentContact=new Contact();
currentContact.populate(data);
dataCache.selectedContact=currentContact;
var contactWindow;
if (contactWindows.length > 0) {
contactWindow=contactWindows[0];
contactWindows.splice(0, 1);
if(contactWindow==null) {
if(top.DialogManager!=undefined) {
top.DialogManager.alert('It appears a popup blocker has stopped us from showing this window. Please update your settings to allow popups from our website.');
}
}else{
contactWindow.location="../contacts/contactsNewContact.html?type="+user_prefs.user_name+"&aid=val&unm="+user_prefs.user_name+"&sid="+user_prefs.session_id;
}
}
else {
contactWindow=window.open("../contacts/contactsNewContact.html?type="+user_prefs.user_name+"&aid=val&unm="+user_prefs.user_name+"&sid="+user_prefs.session_id, "newContact", 
"resizable=yes,status=no,screenX=100,left=100,screenY=300,"+"top=300,height=550,width=850");
}
if (contactWindow)
contactWindow.focus();
}
}
Handlers.prototype.contacts_AddContactsToGroup=function(groupUuid,newGroup,index) {
var data=this.readValidateData("AddContactsToGroup", index);
if (data) {
var contactType=new Array("contact","econtact","scontact");
for (var i=0; i<contactType.length; i++) {
var contactArray=data.getElementsByTagName(contactType[i]);
for (var j=0; j<contactArray.length; j++) {
var uuid=contactArray[j].getAttribute("uuid");
dataCache.handleAddToGroup(undefined,undefined,undefined,[uuid,groupUuid]);
}
}
}
if (contactsApp)  
contactsApp.contactView.refreshList();
root.GridCache.clear();
if (newGroup) GroupSuccess();
}
Handlers.prototype.contacts_CopyContactsToGroup=function(groupUuid,index) {
var data=this.readValidateData("AddContactsToGroup",index);
if (data) {
var contactType=new Array("contact","econtact","scontact");
var contactName=new Array("personal","enterprise","shared");
for (var i=0; i<contactType.length; i++) {
var contactArray=data.getElementsByTagName(contactType[i]);
for (var j=0; j<contactArray.length; j++) {
var uuid=contactArray[j].getAttribute("uuid");
var name=contactArray[j].getAttribute("name");
var email=contactArray[j].getAttribute("email");
var username=contactArray[j].getAttribute("username");
var fax=contactArray[j].getAttribute("fax");
dataCache.addContact(uuid,htmlEncode(name),email,username,groupUuid,contactName[i],fax);
}
}
root.GridCache.clear();
}
}
Handlers.prototype.contacts_CreateContact=function(noteText, index) {
var data=this.readValidateData("CreateContact", index);
var uuid;
var type;
var group;
if (data) {
var contactType=new Array("contact","econtact","scontact");
var contactName=new Array("personal","enterprise","shared");
for (var i=0; i<contactType.length; i++) {
var contactItem=data.getElementsByTagName(contactType[i]);
if (contactItem[0]) {
uuid=contactItem[0].getAttribute("uuid");
var name=contactItem[0].getAttribute("name");
var email=contactItem[0].getAttribute("email");
var fax=contactItem[0].getAttribute("fax");
group=contactItem[0].getAttribute("groups");
var owner=dataCache.findOwner(groupUuid);
if(owner && owner!=user_prefs.user_name && group=="AllPers") {
group="All_"+owner;
}
type=contactName[i];
dataCache.addContact(uuid,htmlEncode(name),email,null,group,type,owner,fax);
if (contactPreview.contactXML.values['addbday']) {
var bdayid=contactItem[0].getAttribute("bdayid");	
if (bdayid!=undefined && bdayid!="undefined" && bdayid!="") {
var sdate=new Date(Date.parse(dataCache.selectedContact.get("BDAY"))); 
var edate=new Date(); 
edate.setDate(sdate.getDate()+1);
var ca=CalendarEvent.factory(bdayid, name+"'s Birthday", sdate, edate, true, "YD,"+sdate.getDate()+",#0");
ca.eventType(2);
ca.colorClass(CalendarColorClass.birthdayColorClass());
ca.loadDetails();
var def_dm=CalendarDataModel.getDefaultCalendar();
if (def_dm!=undefined) { 
def_dm.addRecurringEvent(ca);
}
createMyDaySpecialEvent(bdayid, 'bdayid', sdate, name);
}
}
if (contactPreview.contactXML.values['addanni']) {
var annid=contactItem[0].getAttribute("annid");
if (annid!=undefined && annid!="undefined" && annid!="") {
var sdate=new Date(Date.parse(dataCache.selectedContact.get("ANNIVERSARY"))); 
var edate=new Date();
edate.setDate(sdate.getDate()+1);
var ca=CalendarEvent.factory(annid, name+"'s Anniversary", sdate, edate, true, "YD,"+sdate.getDate()+",#0");
ca.eventType(3);
ca.colorClass(CalendarColorClass.anniversaryColorClass());
ca.loadDetails();
var def_dm=CalendarDataModel.getDefaultCalendar();
if (def_dm!=undefined) { 
def_dm.addRecurringEvent(ca);
}
createMyDaySpecialEvent(annid, 'annid', sdate, name);
}
}
}
}
}
var hasView=false;
try { if (contactView!=undefined) { hasView=true; } } catch (e) { }
if (contactsApp && contactsApp.contactView && hasView==true) {
contactsApp.contactView.refreshDD=true;
root.GridCache.clear();
contactsApp.contactView.load();
}
toggleEnableSaveCancel(true);
contactAddSuccessScreen(uuid, type, group);
}
Handlers.prototype.contacts_DeleteContact=function(index) {
var data=this.readValidateData("DeleteContact", index);
if (data) {
var uuid=cleanXMLValue(data,"uuid");
var uuidElements=(uuid!="")? uuid.split(",") : new Array();
dataCache.handleContactDelete(undefined,data);
contactView.currentSelection=new Array();
contactView.refreshDD=true;
contactView.firstLoad=true;
root.GridCache.clear();
contactView.load();
contactView.togglePreviewPane("hidden");
dataCache.regenerateArrays();
var contacts=data.getElementsByTagName("contact");
for (var i=0; i<contacts.length;i++) {
var annid=contacts[i].getAttribute("annid");  
var bdayid=contacts[i].getAttribute("bdayid"); 
if (annid!=undefined && annid!="") {
var cal_app=Application.getApplicationById(1004);
if (cal_app!=undefined) {
var def=CalendarDataModel.getDefaultCalendar();
var ev=def.getItemById(parseInt(annid), true);
if (ev!=undefined) {
def.removeEvent(ev);
}
}
removeMyDaySpecialEvent(annid);
}
if (bdayid!=undefined && bdayid!="") {
var cal_app=Application.getApplicationById(1004);
if (cal_app!=undefined) {
var def=CalendarDataModel.getDefaultCalendar();
var ev=def.getItemById(parseInt(bdayid), true);
if (ev!=undefined) {
def.removeEvent(ev);
}
}
removeMyDaySpecialEvent(bdayid);
}
}
}
}
Handlers.prototype.contacts_GetContact=function(index) {
var data=this.readValidateData("GetContact", index);
if (data) contactPreview.contactPreviewHandler(data);
else contactPreview.isLoading=false;
if (modeType=="edit") contactPreview.businessInfoViewEdit("editable");
}
Handlers.prototype.contacts_GetContactForMap=function(myAdrType,adrType,index) {
var data=this.readValidateData("GetContact", index);
if (data) {
var mapContact=new Contact();
mapContact.populate(data);
contactPreview.createMapQuestURL(myAdrType,adrType,mapContact);
}
}
Handlers.prototype.contacts_GetContactPop=function(contactId, index) {
var data=this.readValidateData("GetContact", index);
if (data) {
dataCache.selectedContact.populate(data);
openWindows[contactId].focus();
}
else {
openWindows[contactId].close();
}
}
Handlers.prototype.contacts_GetOrderedContactsForGrid=function(cacheInd,index) {
var data=this.readValidateData("GetOrderedContactsForGrid", index);
root.GridCache.set(cacheInd,data);	
handlers.contacts_GetOrderedContactsForGrid2(data);
}
Handlers.prototype.contacts_GetOrderedContactsForGrid2=function(cache) {
contactView.unShadowBox();
if (document.getElementById("listView")) 
contactView.loadDataHandler(cache);
}
Handlers.prototype.contacts_GetRelationshipData=function(index) {
var data=this.readValidateData("GenericAction", index);
if (data) {	
var myItems=new Array();
var items=data.getElementsByTagName("relation");
for (var i=0;i<items.length;i++) {
var ss=new Object();
ss.id=cleanXMLValue(items[i],"id");
ss.type=cleanXMLValue(items[i],"type");
var newDate=new Date();
newDate.setTime(cleanXMLValue(items[i],"date") * 1000);
ss.date=newDate.formatDate("m-d-Y h:i A");
ss.loc=cleanXMLValue(items[i],"loc");
ss.desc=cleanXMLValue(items[i],"desc");
myItems.push(ss);
}
contactPreview.loadSnapshotDataDOM(myItems);
}
}
Handlers.prototype.contacts_RemoveContactsFromGroup=function(groupUuid,index) {
var data=this.readValidateData("RemoveContactsFromGroup", index);
var uuidList=data.getElementsByTagName("uuid");
for (var i=0; i<uuidList.length; i++) {
var uuid=uuidList[i].childNodes[0].nodeValue;
dataCache.removeContactFromGroup(groupUuid, uuid);
}
if (contactsApp)
contactsApp.contactView.refreshList();
}
Handlers.prototype.contacts_SetEventState=function(id, type, name, date, state) {
if (id=="" || type=="" || name=="" || date=="") return;
var dcode=Date.parse(date);
var sdate=new Date();
sdate.setTime(dcode);
sdate.setMinutes(0);
sdate.setSeconds(0);
sdate.setMilliseconds(0);
sdate.setHours(0);
var edate=new Date();
edate.setTime(dcode);
edate.setMinutes(0);
edate.setSeconds(0);
edate.setMilliseconds(0);
edate.setHours(0);
edate.setTime(edate.getTime()+((60000 * 60) * 24));
var ca=CalendarDataModel.getDefaultCalendar().getItemById(id, true, false);
if (ca==undefined) {
if (type=="bdayid") {
ca=CalendarEvent.factory(id, name+"'s Birthday", sdate, edate, true, "YD,"+sdate.getDate()+",#0");
ca.eventType(2);
ca.colorClass(CalendarColorClass.birthdayColorClass());
}
else {
ca=CalendarEvent.factory(id, name+"'s Anniversary", sdate, edate, true, "YD,"+sdate.getDate()+",#0");
ca.eventType(3);
ca.colorClass(CalendarColorClass.anniversaryColorClass());
}
ca.loadDetails();
}
if (state=="true") {
CalendarDataModel.getDefaultCalendar().addRecurringEvent(ca);
createMyDaySpecialEvent(id, type, sdate, name);
}
else {
CalendarDataModel.getDefaultCalendar().removeEvent(ca);
removeMyDaySpecialEvent(id);
}
}
Handlers.prototype.contacts_SetMedia=function() {
if (document.getElementById("upload_contactid").value=="") return;
if (cleanXMLValue(document.getElementById("upload_media").contentWindow.document,"code")==0) {
var viewType=getParam('source');
if (viewType=='preview') {
var contactId=document.getElementById("upload_contactid").value;
if (window.opener.document.getElementById("personImage")) {
window.opener.document.getElementById("personImage").className="";
window.opener.document.getElementById("personImage").src=window.opener.commands.contacts_GetMedia(contactId);
}
if (window.opener.opener && window.opener.opener.document.getElementById("personImage")) {
window.opener.opener.document.getElementById("personImage").className="";
window.opener.opener.document.getElementById("personImage").src=window.opener.opener.commands.contacts_GetMedia(contactId);
}
var currentContactWindow=openWindows[contactId];
if (currentContactWindow) {
currentContactWindow.document.getElementById("personImage").className="";
currentContactWindow.document.getElementById("personImage").src=window.opener.commands.contacts_GetMedia(contactId);
}
} else if (viewType=='card') {
window.opener.viewMenu_view('cardView');
}
root.GridCache.clear();
successScreen("Image upload successful.","small");
window.close();
} else {
successScreen("Image upload failed.","small");
}
}
Handlers.prototype.contacts_RemoveMedia=function(index) {
if (cleanXMLValue(document.getElementById("upload_media").contentWindow.document,"code")==0) {
var viewType=getParam('source');
if (viewType=='preview') {
if (window.opener.document.getElementById("personImage")) {
window.opener.document.getElementById("personImage").className="generic-person";
window.opener.document.getElementById("personImage").src="/gui/img/spacer.gif";
}
if (window.opener.opener && window.opener.opener.document.getElementById("personImage")) {
window.opener.opener.document.getElementById("personImage").className="generic-person";
window.opener.opener.document.getElementById("personImage").src="/gui/img/spacer.gif";
}
} else if (viewType=='card') {
window.opener.viewMenu_view('cardView');
}
window.close();
} else {
successScreen("Image removal failed.","small");
}
}
Handlers.prototype.contacts_UpdateContact=function(contactUuid,index) {
var data=this.readValidateData("UpdateContact", index);
if (data) {
var contactType=new Array("contact","econtact","scontact");
for (var i=0; i<contactType.length; i++) {
var contactItem=data.getElementsByTagName(contactType[i]);
if (contactItem[0]) {
var name=contactItem[0].getAttribute("name");
firstLastName=name;
var email=contactItem[0].getAttribute("email");
var fax=contactItem[0].getAttribute("fax");
dataCache.renameContact(contactUuid,htmlEncode(name),email,fax);
contactPreview.contactXML.values["bdayid"]=contactItem[0].getAttribute("bdayid");
contactPreview.contactXML.values["annid"]=contactItem[0].getAttribute("annid");
}
}
var cal_app=Application.getApplicationById(1004);
if (cal_app!=undefined) {
var def=CalendarDataModel.getDefaultCalendar();
}
if (def!=undefined) {
var name=contactPreview.contactXML.values['DISPLAYNAME'];
var birthday_id=contactPreview.contactXML.values['bdayid'];
var birthday_date=contactPreview.contactXML.values['BDAY'];
var birthday_checked=contactPreview.contactXML.values['addbday'];
var anniversary_id=contactPreview.contactXML.values['annid'];
var anniversary_date=contactPreview.contactXML.values['ANNIVERSARY'];
var anniversary_checked=contactPreview.contactXML.values['addanni'];
var add_birthday=false;
if (birthday_checked) {
var dcode=Date.parse(birthday_date);
if (!isNaN(dcode)) {
add_birthday=true;
var sdate=new Date(dcode);
sdate.setTime(dcode);
sdate.setHours(0, 0, 0, 0);
var edate=new Date();
edate.setDate(sdate.getDate()+1);
edate.setHours(0, 0, 0, 0);
}
}
if (birthday_id!=undefined && birthday_id!="undefined" && birthday_id!="null" && birthday_id!="") {
if (add_birthday) {
ev=CalendarEvent.factory(birthday_id, name+"'s Birthday", sdate, edate, true, "YD,"+sdate.getDate()+",#0");
ev.eventType(2);
ev.colorClass(CalendarColorClass.birthdayColorClass());
ev.loadDetails();
def.addRecurringEvent(ev);
createMyDaySpecialEvent(birthday_id, 'bdayid', sdate, name);
}
}
var add_anniversary=false;
if (anniversary_checked) {
var dcode=Date.parse(anniversary_date);
if (!isNaN(dcode)) {
add_anniversary=true;
var sdate=new Date(dcode);
sdate.setHours(0, 0, 0, 0);
var edate=new Date();
edate.setDate(sdate.getDate()+1);
edate.setHours(0, 0, 0, 0);
}
}
if (anniversary_id!=undefined && anniversary_id!="undefined" && anniversary_id!="null" && anniversary_id!="") {
if (add_anniversary) {
var ev=CalendarEvent.factory(anniversary_id, name+"'s Anniversary", sdate, edate, true, "YD,"+sdate.getDate()+",#0");
ev.eventType(3);
ev.colorClass(CalendarColorClass.anniversaryColorClass());
ev.loadDetails();
def.addRecurringEvent(ev);
createMyDaySpecialEvent(anniversary_id, 'annid', sdate, name);
}
}
}
contactPreview.businessInfoViewEdit('text');
var tabMenuIds=new Array("tabMenuAction_editContact", "tabMenuAction_saveContact", "tabMenuAction_printContact");
for (var i=0; i<tabMenuIds.length; i++) {
document.getElementById(tabMenuIds[i]).style.display="";
var vrule=document.getElementById(tabMenuIds[i]+"_vrule")
if (vrule)
vrule.style.display="";
}
var me=dataCache.findUser('self');
if (me && contactsApp && (contactUuid!=me.uuid))
contactsApp.commands.contacts_GetContact(contactUuid,"handlers.contacts_GetContact()");		
var currentContactWindow=openWindows[contactUuid];
root.GridCache.clear();
if (contactsApp) contactsApp.contactView.load();
}
}
Handlers.prototype.contactNotes_GetNotes=function(index) {
var data=this.readValidateData("GetNotes", index);
if (data) contactPreview.loadNotesData(data);
}
Handlers.prototype.contactNotes_ReplaceNotes=function(contactUuid,index) {
var data=this.readValidateData("ReplaceNotes", index);
if (data) { }
}
Handlers.prototype.groups_CreateGroup=function(groupOwner,uuidList,copyUuidList,index) {
var data=this.readValidateData("CreateGroup", index);
var groupId=data.getElementsByTagName("groupId")[0].childNodes[0].nodeValue;
var groupName=data.getElementsByTagName("groupName")[0].childNodes[0].nodeValue;
var which=(groupOwner=="enterprise")?"enterprise":(groupOwner==user_prefs.user_name)?"personal":"shared";
SimpleClickDataCache.addGroup(groupId,groupName,'',which);
if (uuidList && uuidList.length > 0) commands.contacts_AddContactsToGroup(groupId,uuidList,"handlers.contacts_AddContactsToGroup('"+groupId+"','true')");
if (copyUuidList && copyUuidList.length > 0) commands.contacts_CopyContactsToGroup(groupId,copyUuidList,"handlers.contacts_CopyContactsToGroup('"+groupId+"')");
if (uuidList.length==0) GroupSuccess();
if (contactsApp)  
contactsApp.setViewSubMenus();
}
Handlers.prototype.groups_DeleteGroup=function(index) {
var data=this.readValidateData("DeleteGroup", index);
var groupId=data.getElementsByTagName("groupId")[0].childNodes[0].nodeValue;
dataCache.deleteGroup(groupId);
contactsApp.setViewSubMenus();
}
Handlers.prototype.im_GetBuddyList=function(index) {
var data=this.readValidateData("GetBuddyList", index);
if (data) {
var buddyList=cleanXMLValue(data,"buddies");
var allEnt=cleanXMLValue(data,"AllEnterpriseOnline");
populateBuddyList(buddyList,allEnt);
}
}
Handlers.prototype.im_SetBuddyList=function(index) {
var data=this.readValidateData("SetBuddyList",index);
if (data) {
contactsApp.commands.contacts_GetCurrentlyOnline("handlers.contacts_GetCurrentlyOnline()");
successScreen("Currently Online list has been modified successfully.","large");
}
}
Handlers.prototype.groups_RenameGroup=function(groupUuid, groupName, index) {
var data=this.readValidateData("RenameGroup", index);
dataCache.renameGroup(groupUuid,unescape(groupName));
if (contactsApp)  
contactsApp.setViewSubMenus();
}
Handlers.prototype.prefs_GetPreferences=function(action,index) {
var data=this.readValidateData("GetPreferences", index);
if (data) {
var displayPrefs=(cleanXMLValue(data,"displayNum")!="")? cleanXMLValue(data,"displayNum") : "100";
var previewStatus=(cleanXMLValue(data,"previewStatus")!="")? cleanXMLValue(data,"previewStatus") : "on";
var allEntOnline=cleanXMLValue(data,"AllEntOnline");
root.UDFCache.set(user_prefs.user_name, cleanXMLValue(data,"udfs"));
if (action==0) {
top.ContactGeneralSettings.handleSettings(allEntOnline,displayPrefs,previewStatus);
} else if (action==1) {
prefsObject.displayPrefs=displayPrefs;
prefsObject.previewStatus=previewStatus;
prefsObject.allEntOnline=allEntOnline;
contactView.init();
}
}
}
Handlers.prototype.prefs_ReplacePreferences=function(displayPrefs,previewStatus,index) {
var data=this.readValidateData("ReplacePreferences", index);
prefsObject.displayPrefs=displayPrefs;
prefsObject.previewStatus=previewStatus;
}
Handlers.prototype.shares_GetCurrentShares=function(index) {
var data=this.readValidateData("GetShares", index);
if (data) contactView.populateManageSharingGroups(data);
}
Handlers.prototype.shares_GetCurrentSharesPop=function(groupUuid,index) {
var data=this.readValidateData("GetShares",index);
if (data) {
dataCache.setSharingData(data);
window.open ("../contacts/contactsShares.html?unm="+user_prefs.user_name+"&sid="+user_prefs.session_id+"&gid="+groupUuid,"newShare","resizable=yes,height=500,width=700,screenX=150,left=150,screenY=300,top=300,status=no");
}
}
Handlers.prototype.shares_ProposeShare=function(index) {
var data=this.readValidateData("ProposeShare", index);
shareCommands--;
if (shareCommands==0) contactView.createManageSharing();
}
Handlers.prototype.shares_RevokeShare=function(index) { 
var data=this.readValidateData("RevokeShare", index);
shareCommands--;
if (shareCommands==0) contactView.createManageSharing();
}
Handlers.prototype.shares_RevokedShare=function(groupUuid,index) { 
var data=this.readValidateData("RevokedShare", index);
if (data) {
var sharewithTbody=document.getElementById("groupsShared").firstChild;
for (var i=0; i<sharewithTbody.childNodes.length; i++) {
if (sharewithTbody.childNodes[i].id.split("-")[0]==groupUuid)
sharewithTbody.removeChild(sharewithTbody.childNodes[i]);
}
dataCache.handleDeleteGroup2(groupUuid.split(","));
if (sharewithTbody.childNodes.length==1) 
contactView.createManageSharing();
contactsApp.setViewSubMenus();
}
}
Handlers.prototype.shares_SharePermissions=function(index) {
var data=this.readValidateData("SharePermissions", index);
shareCommands--;
if (shareCommands==0) contactView.createManageSharing();
}
Handlers.prototype.udfs_CreateUDFs=function(owner,index) {
var data=this.readValidateData("CreateUDF", index);
if (data) contactView.createUserDefinedFields(); 
root.UDFCache.clear(owner);
}
Handlers.prototype.udfs_DeleteUDFs=function(owner,index) {
var data=this.readValidateData("DeleteUDF", index);
if (data) contactView.deleteUDFs(data);
root.UDFCache.clear(owner);
}
Handlers.prototype.udfs_RenameUDFs=function(owner,index) {
var data=this.readValidateData("RenameUDF", index);
if (data) contactView.createUserDefinedFields();
root.UDFCache.clear(owner);
}
Handlers.prototype.udfs_GetUDFs=function(user, index) {
var data=this.readValidateData("GetUDFList", index);
if (data) contactView.UDFLoadData(user,data);
var items=data.getElementsByTagName("udfs")[0];
if (items!=undefined && items.childNodes.length > 0) {
root.UDFCache.set(user,items.childNodes[0].nodeValue);
}
}
Handlers.prototype.udfs_GetForEditDisplayCols=function(index) {
var data=this.readValidateData("GetUDFList", index);
if (data) {
currentUDFs=new Array();
if (data.getElementsByTagName("udfs")[0].childNodes[0]) {
var udfFields=data.getElementsByTagName("udfs")[0].childNodes[0].nodeValue.split(",");
for (var i=0; i<udfFields.length; i++) {
currentUDFs.push(htmlEncode(unescape(udfFields[i])));
}
}
}
var currentOpenWindow=window.open ("../contacts/contactsDisplayCols.html","editFieldList","resizable=yes,height=620,width=600,screenX=150,left=150,screenY=250,top=250,status=no");
}
Handlers.prototype.udfs_GetForNewContact=function(params,owner, index) {
var data=this.readValidateData("GetUDFList", index);
if (data) {
var newContact=new Contact();
if (data.getElementsByTagName("udfs")[0].childNodes[0]) {
root.UDFCache.set(owner,data.getElementsByTagName("udfs")[0].childNodes[0].nodeValue);
var udfFields=root.UDFCache.find(owner).split(",");
for (var i=0; i<udfFields.length; i++) {
newContact.udfNames.push(htmlEncode(unescape(udfFields[i])));
newContact.values["udf_"+i]="";
}
}
dataCache.selectedContact=newContact;
}
if (newContactWindow!=undefined) {
newContactWindow.location="../contacts/contactsNewContact.html?"+params;
}
}
Handlers.prototype.contacts_ImportMappedCSV=function(index) {
var data=this.readValidateData("NOVALIDATE", index);
if (data) contactView.displayMappedContacts(data);
}
Handlers.prototype.genericHandler=function(index) {
var data=this.readValidateData("GenericAction", index);
}
Handlers.prototype.readValidateData=function(fcnName,index) {
var data=null;
try {
data=ajaxGetData_mul(index);
if (fcnName!="NOVALIDATE") this.checkErrorCode(data,fcnName);
} catch (e) {
data=null;
} finally {
ajaxReadDone(index);
}
return data;
}
Handlers.prototype.checkErrorCode=function(data,functionName) {
if (data.getElementsByTagName("code")[0] && data.getElementsByTagName("code")[0].childNodes[0]) {
var errorCode=data.getElementsByTagName("code")[0].childNodes[0].nodeValue;
switch (errorCode) {
case ('0'):
break;
case ('20000000'): 
break;
case ('20777'): 
if(window.parent._GDS_) {
window.parent.sessionTimeout(true, true);
}
window.location="/Ioffice/Common/showDialog.asp?errDesc=Please%20login%20and%20try%20again.";
break;
default:
if (resources.errorMessages[functionName]) alert(resources.errorMessages[functionName]);
throw 'CGIException';
break;
}
}
}
function getXMLValue(doc,elementNum,name) {
doc=doc[0].getElementsByTagName("vCard");
var namePiece=name.split("-");
try {
for (var i=0;i<namePiece.length;i++) doc=doc[0].getElementsByTagName(namePiece[i]);
return getValue(doc[0]);
} catch (e) { return ""; }
}
function cleanXMLValue(doc,val,elementNum) {
elementNum=(!elementNum)? 0 : elementNum;
if (!doc || ! doc.getElementsByTagName(val)[elementNum]) return "";
var myVal=doc.getElementsByTagName(val)[elementNum].childNodes[0];
return (myVal)? myVal.nodeValue : "";
}
function popContact(contactUuid, modeType) {
if (contactUuid=='self') {
var myContact=dataCache.findUser('self');
if (myContact) contactUuid=myContact.uuid;
}
var currentContact=new Contact();
dataCache.selectedContact=currentContact;
var popWidth=(cb.getBrowserWidth() - 1100) / 2;
var popHeight=(cb.getBrowserHeight() - 500) / 2;
var contactMode;
if(!modeType) {
contactMode=(dataCache.findUser('self') && contactUuid==dataCache.findUser('self').uuid)? "edit" : "text";
}else{
contactMode=modeType;
}
if (openWindows[contactUuid]==null) {
var mywindow=window.open ("../contacts/contactsPreviewCard.html?mode="+contactMode+"&cid="+contactUuid+"&unm="+user_prefs.user_name+"&sid="+user_prefs.session_id,"","resizable=yes,height=500,width=1000,screenX="+popWidth+",left="+popWidth+",screenY="+popHeight+",top="+popHeight+",status=no,scrollbars=yes");
openWindows[contactUuid]=mywindow;
}
commands.contacts_GetContact(contactUuid,"handlers.contacts_GetContactPop('"+contactUuid+"')");
}
var newContactWindow;
var contactWindows=Array();
function popNewContact(groupUuid, contactOwner, contactName, contactEmail, folderId, messageId, attemId, attachmentId) {
initAppRefs();
var groupParam=(!groupUuid)? '&gid=' : '&gid='+groupUuid;
var contactParamString="";
contactName=contactName;
if (contactName==undefined || contactName=="undefined") { contactName="New Contact"; }
if (contactName!=undefined) contactParamString+="FN:"+contactName+",";
if (contactEmail && contactEmail!="") {
contactParamString+="EMAIL1:"+contactEmail;
}
newContactWindow=window.open("/Ioffice/Common/blank.html", "", "resizable=yes,status=no,screenX=150,left=150,screenY=300,top=300,height=550,width=800");
if (folderId && messageId && attachmentId) {
var actualContactUuid=dataCache.findUser("self").uuid;
contactWindows[contactWindows.length]=newContactWindow;
commands.attachments_FieldAttachment(folderId, messageId, attemId, attachmentId, "handlers.attachments_FieldAttachment()");
} else {
contactParamString=(contactName && contactEmail)? "&params="+contactParamString : "";
contactOwner=(!contactOwner)? user_prefs.user_name : contactOwner;
var myParams="sid="+user_prefs.session_id+"&unm="+user_prefs.user_name+"&type="+contactOwner+groupParam+contactParamString;
if (root.UDFCache.find(contactOwner)) {
var newContact=new Contact();
var udfFields=root.UDFCache.find(contactOwner).split(",");
for (var i=0; i<udfFields.length; i++) {
newContact.udfNames.push(htmlEncode(unescape(udfFields[i])));
newContact.values["udf_"+i]="";
}
dataCache.selectedContact=newContact;
newContactWindow.location="../contacts/contactsNewContact.html?"+myParams; 
}
else {
commands.udfs_GetUDFs(contactOwner,"handlers.udfs_GetForNewContact('"+myParams+"','"+contactOwner+"')");
}
}
}
function popGroup(groupUuid, groupOwner) {
var groupOwnerParam=(!groupOwner && (!groupUuid || groupUuid!=''))? "&owner="+user_prefs.user_name : (groupOwner && (!groupUuid || groupUuid!=''))? "&owner="+groupOwner : "&owner=";
var groupParam=(groupUuid && groupUuid!='')? "&gid="+groupUuid : "";
var win=window.open ("../contacts/contactsGroups.html?unm="+user_prefs.user_name+"&sid="+user_prefs.session_id+groupOwnerParam+groupParam,"newGroup","resizable=yes,height=600,width=800,status=no,screenX=150,left=150,screenY=300,top=300");
if (win) win.focus();
}
function popShare(groupUuid) {
var ownerName=dataCache.findGroupOwner(groupUuid);
if (groupUuid) commands.shares_GetCurrentShares(ownerName,"handlers.shares_GetCurrentSharesPop('"+groupUuid+"')");
}
function normalizeName(name) {
name=decodeURIComponent(name);
var normalized='';
if (!name.match(/,/)) {   
normalized=name.replace(/^\s+/,'').replace(/\s+$/,'');
} else if (name.match(/^\s*([^,]*[^\s])\s*,\s*(.*[^\s])\s*$/)) {   
normalized=RegExp.$2+' '+RegExp.$1;
}
return normalized;
}
function createMyDaySpecialEvent(eventId, eventType, eventDate, contactName) {
var myDay=Application.getApplicationById(1020);
var successful=false;
if (myDay) {
var dm=myDay.getSpecialEventNotificationDataModel();
if (dm) {
eventDate=new Date(eventDate.setYear(new Date().getFullYear())); 
var obj=SpecialEventNotificationEntry.factory(eventId, (eventType=='bdayid' ? '2' : '3'), dateToUTCICal(eventDate));
obj.generateContent(normalizeName(contactName)+"'s "+(eventType=='bdayid' ? 'Birthday' : 'Anniversary'));
obj.calculateReminder();
var matches=dm.findByContent(obj.content(), obj.eventType());
for (var i=0; i < matches.length;++i) {
if (matches[i].eventId()==eventId) {
successful=true;
break;
}
}
if (!successful) successful=dm.addItemIfInRange(obj);
}
}
return successful;
}
function removeMyDaySpecialEvent(eventId) {
var myDay=Application.getApplicationById(1020);
var successful=false;
if (myDay) {
var dm=myDay.getSpecialEventNotificationDataModel();
successful=dm.removeItemById(eventId);
}
return successful;
}
var cb=new function() {
var spacerImage;
this.isIE=function() { return (navigator.appName=="Microsoft Internet Explorer"); }
this.createElement=function(type, elementId, elementClass, elementStyle, elementAttributes, htmlVal) {
var element=document.createElement(type);
element.id=elementId;
element.className=elementClass;
if (elementStyle) (cb.isIE())? element.style.setAttribute('cssText', elementStyle, 0) : element.setAttribute("style",elementStyle);
if (elementAttributes) {
var attributeArray=elementAttributes.split(",");
for (var i=0; i<attributeArray.length; i++) {
var attributePair=attributeArray[i].split(":");
element.setAttribute(attributePair[0],attributePair[1]);
}			
}
if (htmlVal) element.innerHTML=htmlVal;
return element;
}
this.createImage=function(imageClass, imgWidth, imgHeight, elementStyle) {
if (!spacerImage) {
spacerImage=new Image();
spacerImage.src=GUI_ROOT+"spacer.gif";
}
var spacerImageCopy=spacerImage.cloneNode(false);
spacerImageCopy.className=imageClass;
if (elementStyle) (cb.isIE())? spacerImageCopy.style.setAttribute('cssText', elementStyle, 0) : spacerImageCopy.setAttribute("style",elementStyle);
spacerImageCopy.style.width=imgWidth;
spacerImageCopy.style.height=imgHeight;
return spacerImageCopy;
}
this.text=function (event) { return (event.text)? event.text : (event.innerText)? event.innerText : ""; }
this.which=function(event) { return (event.which)? event.which : event.button; }
this.clientX=function(event) { return (event.clientX)? event.clientX : event.pageX; }
this.clientY=function(event) { return (event.clientY)? event.clientY : event.pageY; }
this.isLMB=function(event) { return (cb.isIE())? event.button & 1 : (event.button==0); }
this.currentStyle=function(x, style) {
return (x.currentStyle)? x.currentStyle[style] : document.defaultView.getComputedStyle(x,null).getPropertyValue(style);
}
this.currentTarget=function(event) {
return (event.currentTarget)? event.currentTarget : event.srcElement;
}
this.getElement=function(element) {
if (cb.isIE()) return element.parentNode;
else return element;
}
this.getBrowserHeight=function() {
return (typeof(window.innerHeight)=='number')? window.innerHeight : (document.documentElement.clientHeight)? document.documentElement.clientHeight : (document.body.clientHeight)? document.body.clientHeight : "";
}
this.getBrowserWidth=function() {
return (typeof(window.innerWidth)=='number')? window.innerWidth : (document.documentElement.clientWidth)? document.documentElement.clientWidth : (document.body.clientWidth)? document.body.clientWidth : "";
}
this.addEventListener=function(obj, type, fn) {
return (obj.attachEvent)? obj.attachEvent('on'+type, fn) : obj.addEventListener(type, fn, false);
}
this.removeEventListener=function(obj, type, fn) {
return (obj.detachEvent)? obj.detachEvent('on'+type, fn) : obj.removeEventListener(type, fn, false);
}	
this.getStyle=function (elemID, IEStyleProp, CSSStyleProp) {
var elem=top.document.getElementById(elemID);
if (elem && elem.currentStyle) {
return elem.currentStyle[IEStyleProp];
} else if (top.window.getComputedStyle) {
var compStyle=top.window.getComputedStyle(elem, "");
return compStyle.getPropertyValue(CSSStyleProp);
}
return "";
}
}
function onLoad_editFieldList() {
initAppRefs();
var cdDOM=new Array();
resizeContentWindow(true);
cdDOM.push("<div style='margin-top:10px;padding-left:15px;margin-bottom:20px;font-size:11px;'>");
cdDOM.push("<b>Choose Display Columns</b><br><br>Please specify the fields that you would like displayed in your contact listing.");
cdDOM.push("<table class=editFieldTable width=95%><tbody><tr>");
for (var i=0; i<resources.contactFields.length-1; i++) {
cdDOM.push("<td vAlign=top width=33% style='padding:0 15px'>");
var detailedView=resources.contactFields[1];
for (var i=0;i<detailedView.length; i++) {
for (var j=0;j<detailedView[i][1].length;j++) {
var currentVal=detailedView[i][1][j];
var splitCV=currentVal.split("_")[1];
if (splitCV=='HEADER') {
if (currentVal=="DETAILED_HEADER_EMAIL") 
cdDOM.push("</td><td width=33% vAlign=top style='padding:0 15px'>");
cdDOM.push("<div class=drag-opacity style='width:100%;padding-left:0px;color:#000;padding-top:12px;'><b>"+detailedView[i][0]+"</b><hr class='drag-opacity' size=1 width='75%' align=left style='color:#666'></div>");
}
else if (splitCV!="IMTYPE" && splitCV!="IMTYPE2")  {
var disabledCheck=(splitCV=="DISPLAYNAME")? " DISABLED " : " ";
var checked=(fieldExists(currentVal))? " CHECKED " : " ";
cdDOM.push("<div><input"+disabledCheck+checked+"type=checkbox id='"+currentVal+"'>");
cdDOM.push(detailedView[i][0]+"</div>");
}
}
}
cdDOM.push("</td>");
}
cdDOM.push("<td width=33% vAlign=top style='padding:0 15px'>");
cdDOM.push("<div class=drag-opacity style='width:100%;padding-left:0px;color:#000;padding-top:12px;'><b>Custom Fields</b><hr class='drag-opacity' size=1 width='75%' align=left style='color:#666'></div>");
var udfs=root.UDFCache.find((window.opener.contactView.currentContactType=="enterprise" ? "enterprise" : user_prefs.user_name)).split(",");
for (var i=0;i<udfs.length;i++) {
cdDOM.push("<div><input "+((fieldExists(udfs[i]))? "CHECKED " : "")+"type=checkbox id='"+udfs[i]+"'>"+htmlEncode(unescape(udfs[i]))+"</div>");
}
cdDOM.push("</td>");
cdDOM.push("</tr></tbody></table>");
document.getElementById("contentDiv").innerHTML=cdDOM.join('');	
cb.addEventListener(document.getElementById("saveButton"),'click',onClickUpdateFields);
cb.addEventListener(document.getElementById("cancelButton"),'click',closeWindow);
updateGUISkin();
initTDButtons();
}
function fieldExists(fieldName) {
var currentFieldList=contactsApp.contactView.currentFields;
var xmlFieldName=fieldName.split("_")[1];
for (var i=0; i < currentFieldList.length; i++)
if (currentFieldList[i]==xmlFieldName || (fieldName==currentFieldList[i])) return true;
return false;
}
function onClickUpdateFields() {
var newFieldList=new Array("UUID","ACCESS","DISPLAYNAME");
var detailedView=resources.contactFields[1];
for (var i=0; i<detailedView.length; i++) {
for (var j=0; j<detailedView[i][1].length; j++) {
var currentVal=detailedView[i][1][j];
var checkbox=document.getElementById(currentVal);
if (checkbox && checkbox.checked==true && currentVal.split("_")[1]!="DISPLAYNAME") newFieldList.push(currentVal.split("_")[1]);
}
}
var udfs=root.UDFCache.find(window.opener.contactView.currentContactType=="enterprise" ? "enterprise" : user_prefs.user_name).split(",");
for (var i=0;i<udfs.length;i++) {
var checkbox=document.getElementById(udfs[i]);
if (checkbox && checkbox.checked==true) newFieldList.push(udfs[i]);
}
window.opener.setTimeout("actualUpdateFields(['"+newFieldList.join("','")+"']);", 1);
successScreen("Columns have been modified successfully.","large");
}
function actualUpdateFields(flds) {
if(contactView.currentContactType=="enterprise") {
contactView.colOrderEnt=flds;
} else {
contactView.colOrder=flds;
}
contactView.currentFields=flds;
var expDate=new Date();
expDate.setYear(expDate.getFullYear()+1);
setCookie("displayFields"+(contactView.currentContactType=="enterprise" ? "1" : "0"),flds.join(","),expDate,"");	
top.GridCache.clear();
contactView.load();
}
function checkExistingGroup() {
if (getParam("gid")) {
groups_groupId=getParam("gid");
var groupItem=dataCache.findGroup(groups_groupId);
groupName=groupItem.name;
document.getElementById("groupName").value=groupItem.name;
document.getElementById("headerText").innerHTML="Modify the "+groupItem.name+" Group";
var contactNames=groupItem.contacts;
var contactListDiv=document.getElementById("newGroupContacts");
for (var i=0;i<contactNames.length;i++) {
var newContactDiv=cb.createElement("div","addcontact-"+contactNames[i],"","cursor:hand;cursor:pointer;");
newContactDiv.innerHTML="&nbsp;"+unescape(htmlEncode(dataCache.findUser(contactNames[i]).name));
cb.addEventListener(newContactDiv,'click',onClickContact);
uuidList.push(contactNames[i]);
contactListDiv.appendChild(newContactDiv);
}
} else document.getElementById("headerText").innerHTML="Create a New Group";
}
function populateBuddyList(userList, allEntContacts) {
document.getElementById("headerText").innerHTML="Modify your Currently Online List";
document.title="Modify your Currently Online List";
document.getElementById("cbAllEnt").checked=(allEntContacts=="true")? "true" : null;
var contactListDiv=document.getElementById("newGroupContacts");
var newUserList=userList.split(",");
for (var i=0;i<newUserList.length;i++) {
var entUser=dataCache.findUserByUserName(newUserList[i],'econtact');
var newContactDiv=cb.createElement("div","addcontact-"+((entUser)? entUser.uuid : newUserList[i]),"","cursor:hand;cursor:pointer;");
newContactDiv.innerHTML=(entUser)? unescape(htmlEncode(entUser.name)) : newUserList[i];
cb.addEventListener(newContactDiv,'click',onClickContact);
contactListDiv.appendChild(newContactDiv);
}
}
function groupClick() {}
var groupWindowSimpleClick;
function onLoad_groupWindow() {
CursorMonitor.hook();
initAppRefs();
app_ids=root.app_ids;
uuidList=new Array();
var groupMembers='';
group=dataCache.findUser(getParam("gid"));
groupName=(group && group.name)?group.name:'';
if (group && group.contacts)
for (var i=0;i<group.contacts.length;i++) {
name=dataCache.findUser(group.contacts[i]).name;
uuidList.push(group.contacts[i]);
groupMembers+='<div id="addcontact-'+group.contacts[i]+'" syle="pointer" onclick="onClickContact(event)">'+unescape(name)+"</div>";
}
var winDOM=new Array();
winDOM.push("<div style='position:absolute;top:30px;left:25%;'>");
winDOM.push("<div id='headerText' class=contactHeaders style='padding-top:2px;'></div>");
var contactText=(getParam("gid")=='currentlyonline')? 'Add contacts to your currently online list by selecting the checkbox below<br> or clicking contacts from the list on the left.' : 'Add contacts to this group by clicking contacts from the list on the left.';
winDOM.push("<div class=contactLabel>"+contactText+"</div>");
if (getParam("gid")=='currentlyonline') {
winDOM.push("<div class=contactLabel style='margin-top:20px;'><input id='cbAllEnt' type=checkbox> Show all enterprise contacts in my currently online list</div>");
} else {
winDOM.push("<div class=contactHeaders style='padding-top:15px;'>Group Name: </div>");
winDOM.push("<input id=groupName text=text size='30' maxlength='30' style='width:420;margin-left:10px;border:#999999 solid 1px;' value='"+groupName+"'>");
}
winDOM.push("<div class=contactHeaders style='padding-top:10px;'>Contacts: </div>");
winDOM.push("<div id=newGroupContacts style='font-size:11px;width:420;height:300;margin-left:10px;border:#999999 solid 1px;overflow:auto;'>"+groupMembers+"</div>");
winDOM.push("<button onclick=removeSelectedItem(event) disabled id=deleteButton style='margin-left:10px;margin-top:10px;'>Remove</button></div>");
document.getElementById("contentWindow").innerHTML=winDOM.join('');
cb.addEventListener(document.getElementById("saveButton"),'click',onClickModifyGroup);
cb.addEventListener(document.getElementById("cancelButton"),'click',closeWindow);
document.getElementById("groupName").value=groupName;
window.
groupWindowSimpleClick=new PopupSimpleClick(200, 100);
groupWindowSimpleClick.requestOnContact(onSimpleClickAddGroup);
document.getElementById('simpleClick_groups').appendChild(groupWindowSimpleClick.getContent());
groupWindow_simpleClickResize();
window.onunload=onUnload_groupWindow;
updateGUISkin();
initTDButtons();
}
function onUnload_groupWindow() {
groupWindowSimpleClick.cleanup();
return defaultUnloader();
}
window.onunload=defaultUnloader;
function defaultUnloader() {
if (__handleResponseTimeout) clearTimeout(__handleResponseTimeout);
return true;
}
function groupWindow_simpleClickResize() {
if (groupWindowSimpleClick!=undefined) {
groupWindowSimpleClick.height(CursorMonitor.browserHeight() - 30 - (document.all ? 10 : 0));
}
}
function simpleClick_loadDataGroupWin() {
if (getParam("gid")=='currentlyonline')
commands.im_GetBuddyList('handlers.im_GetBuddyList()')
else  {
checkExistingGroup();
}
}
function onClickModifyGroup() {
var groupTextBox=document.getElementById("groupName");
groupTextBox.value=groupTextBox.value.replace(/(^\s+|\s+$)/g, '');
if (!groupTextBox || groupTextBox.value.length <=0) {
alert("You must enter a group name");
return;
}
var buttonbar=document.getElementById('window_controls');
buttonbar.style.filter="alpha(opacity="+30+")";
if(!document.all) {
buttonbar.style.MozOpacity=.3;
buttonbar.style.opacity=.3;
buttonbar.KhtmlOpacity=.3;
}	
if(cb) {
cb.removeEventListener(document.getElementById("saveButton"), 'click', onClickModifyGroup);
cb.removeEventListener(document.getElementById("cancelButton"), 'click', closeWindow);
}
groups_groupId=getParam("gid");
var groupObj=dataCache.findGroup(groups_groupId);
var finalAddList=new Array();
var finalCopyList=new Array();
for (var i=0; i<addUuidList.length; i++) {
if (groupOwner==dataCache.findOwner(addUuidList[i])) {
finalAddList.push(addUuidList[i])
}
else {
finalCopyList.push(dataCache.findOwner(addUuidList[i]));
finalCopyList.push(addUuidList[i]);
}
}
if (groups_groupId) {
if (groupName!=groupTextBox.value) commands.groups_RenameGroup(groups_groupId,groupTextBox.value,"handlers.groups_RenameGroup('"+groups_groupId+"','"+escape(groupTextBox.value)+"')");
if (finalCopyList.length > 0) commands.contacts_CopyContactsToGroup(groups_groupId,finalCopyList,"handlers.contacts_CopyContactsToGroup('"+groups_groupId+"')");
if (deleteUuidList.length > 0) commands.contacts_RemoveContactsFromGroup(groups_groupId,deleteUuidList,"handlers.contacts_RemoveContactsFromGroup('"+groups_groupId+"')");
if (finalAddList.length > 0) commands.contacts_AddContactsToGroup(groups_groupId,finalAddList,"handlers.contacts_AddContactsToGroup('"+groups_groupId+"',false)");
root.GridCache.clear();
GroupSuccess();
} else {
commands.groups_CreateGroup(groupTextBox.value,groupOwner,"handlers.groups_CreateGroup('"+groupOwner+"',"+toJSON(finalAddList)+","+toJSON(finalCopyList)+")");
}
}
function toJSON(array_vals) {
if (!array_vals) {
return "''";
}
var json;
if (array_vals.length > 0) {
json="[";
for (var i=0; i<array_vals.length-1; i++) 
json+="'"+array_vals[i]+"',";
json+="'"+array_vals[array_vals.length-1]+"']";
} else {
json="''";
}
return json;
}
function GroupSuccess() {
successScreen("Group has been "+((groups_groupId)? "modified" : "added")+" successfully","large");
}
function AddGroup(name, uuid) {	
var textAreaDiv=document.getElementById("newGroupContacts");
var newContactDiv=document.createElement("div");
newContactDiv.id="addcontact-"+uuid;
newContactDiv.innerHTML=unescape(name);;
newContactDiv.style.cursor="hand";
newContactDiv.style.cursor="pointer";
cb.addEventListener(newContactDiv,'click',onClickContact);
textAreaDiv.appendChild(newContactDiv);
addRemoveContact('Add',uuid);
}
function onSimpleClickAddGroup(type, group, contact) {
uuid=contact.uuid;
if (((type.toLowerCase()=='enterprise') || (groupOwner=='enterprise')) && (!((type.toLowerCase()=='enterprise') && (groupOwner=='enterprise')))) 
if (!confirm("Adding this contact will create a copy in your "+((groupOwner=="enterprise")?"enterprise":"personal")+" contacts. Are you sure you want to continue?")) return;
var found=false;
for (var i in uuidList) if (uuid==uuidList[i]) found=true;
for (var i in addUuidList) if (uuid==addUuidList[i]) found=true;
for (var i in deleteUuidList) if (uuid==deleteUuidList[i]) found=false;
if (!found) AddGroup(dataCache.findUser(uuid).name,uuid);
}
function onLoad_Contacts() {
top.ApplicationOldContacts.getSimpleClick().contactsApp=this;
window.parent.ExtensionBannerAds.refreshAll();	
initAppRefs();
if (!dataCache.isLoaded) { 
setTimeout("onLoad_Contacts()",2000);
return;
}
commands.prefs_GetPreferences("handlers.prefs_GetPreferences(1)");
updateGUISkin();
contactPreview.load();
initjsDOMenu();
initTDButtons();	
contactView.loadSearchWaiting();
contactView.togglePreviewPane("hidden");
simpleClick.requestOnContact(ContactView.setContact);
simpleClick.requestOnGroup(ContactView.setGroup);
simpleClick.handleViewChange=ContactView.setGroup;
contactView.refreshContactView();
}
var media_contactId=getParam("uuid");
var mediaType=getParam("type");
function onload_upload() {
initAppRefs();
var printType=(mediaType=="PHOTO")? "Picture" : "Other Media";
updateGUISkin();
document.getElementById("uploadHeader").innerHTML="Upload "+printType;
}
function validateFileType() {
var fileName=document.getElementById("myFileThing").value.toLowerCase();
return ((fileName.search(".jpg")!=-1) || (fileName.search(".jpeg")!=-1) || (fileName.search(".gif")!=-1) || (fileName.search(".png")!=-1));
}
function onClickRemoveMedia() {
commands.contacts_RemoveMedia(media_contactId,"handlers.contacts_RemoveMedia()");
}
function onClickSetMedia() {
if (!validateFileType()) alert("valid file types are .jpg, .jpeg, .gif, and .png");	
else commands.contacts_SetMedia(media_contactId,handlers.contacts_SetMedia);
}
var listViewClass, currentWindow;
var previewPanelDisplay=true;
var contactType="";
function addSharedMenu(mySharedUser) {
contact_new_menu.addMenuItem(new menuItem("Contact in Shared Group","","Javascript:newMenu_contact('shared')"));
}
function setViewSubMenus() {
var sharers=dataCache.getSharers();
if (user_prefs.access_contact_sharing=='True' && sharers.length>0) {
var sharedItems=new Array;
var sharedNewItems=new Array;
for (var i=0; i<sharers.length; i++) {
var groupList=dataCache.getSortedGroupList(sharers[i]);
for (var j=0; j<groupList.length; j++) {	
var text=(groupList[j].name=="All")?dataCache.findUserByUserName(sharers[i]).name+"'s Contacts":groupList[j].name;
var sharedItem=new Object;
sharedItem.text=text;
sharedItem.action="Javascript:viewMenu_contacts('shared','"+groupList[j].uuid+"','"+sharers[i]+"')";
sharedItems.push(sharedItem);
if(dataCache.hasAccess(groupList[j].uuid, "f")) {
var sharedNewItem=new Object;
sharedNewItem.text=text;
sharedNewItem.action="Javascript:newMenu_contact('shared','"+groupList[j].uuid+"')";
sharedNewItems.push(sharedNewItem);
}
}
}
contact_view_menu.items.sharedMainMenu.setSubMenu(createGroupSubMenus(sharedItems));
if(sharedNewItems.length > 0) {
contact_new_menu.items.sharedNewMenu.setSubMenu(createGroupSubMenus(sharedNewItems));
} else if(contact_new_menu.items.sharedNewMenu) {
contact_new_menu.items.sharedNewMenu.style.display="none";
}
}
var groupTypes=new Array("personal");
if((top.ApplicationOldContacts!=undefined && top.ApplicationOldContacts.hasEnterprise) || (root.ApplicationOldContacts!=undefined && root.ApplicationOldContacts.hasEnterprise)) {
groupTypes.push("enterprise");
}
for (var i=0; i<groupTypes.length; i++) {
var groupItems=new Array;
var currentGroups=dataCache.getSortedGroupList(groupTypes[i]);
for (var j=0; j<currentGroups.length; j++) {
var groupItem=new Object;
groupItem.text=currentGroups[j].name;
groupItem.action="Javascript:viewMenu_contacts('"+groupTypes[i]+"','"+currentGroups[j].uuid+"')";
groupItems.push(groupItem);	
}
if ((groupItems.length>0) && contact_view_menu && contact_view_menu.items) 
contact_view_menu.items[groupTypes[i]+"MainMenu"].setSubMenu(createGroupSubMenus(groupItems,'All '+groupTypes[i].charAt(0).toUpperCase()+groupTypes[i].substr(1).toLowerCase()+' Contacts',"Javascript:viewMenu_contacts('"+groupTypes[i]+"')"));
}
}
function createGroupSubMenus(items,allName, allJS) {
var menu=new jsDOMenu(200);
if (allName!=undefined) {
menu.addMenuItem(new menuItem(allName,"",allJS));
menu.addMenuItem(new menuItem('-',"",""));
}
if (items.length<15) { 
for (var i=0; i<items.length; i++)  {
menu.addMenuItem(new menuItem(htmlUnencode(unescape(items[i].text)),"",items[i].action));
}
return menu;
}
var subMenu;
var previousString="A";
for (var i=0; i<items.length; i++) {
if (!(i%15)) {
if (subMenu!=undefined) {
menu.addMenuItem(new menuItem(htmlUnencode(unescape(previousString+" - "+items[i-1].text)),"",""));
menu.items[menu.items.length-1].setSubMenu(subMenu);
previousString=items[i].text;
}
subMenu=new jsDOMenu(200);
}
subMenu.addMenuItem(new menuItem(htmlUnencode(unescape(items[i].text)),"",items[i].action));
}
menu.addMenuItem(new menuItem(htmlUnencode(unescape(previousString+" - "+items[items.length-1].text)), "", ""));
menu.items[menu.items.length-1].setSubMenu(subMenu);
return menu;
}
function removeSharedMenu() {create_message_menus();}
function create_message_menus() {
contact_new_menu=new jsDOMenu(150);
contact_new_menu.addMenuItem(new menuItem("Personal Contact","","Javascript:newMenu_contact('personal')"));
if (dataCache.canAddEnterpriseContacts()) contact_new_menu.addMenuItem(new menuItem("Enterprise Contact","","Javascript:newMenu_contact('enterprise')"))
if (user_prefs.access_contact_sharing=='True' && dataCache.getSharers().length > 0) contact_new_menu.addMenuItem(new menuItem("Shared Contact","sharedNewMenu",""));
contact_new_menu.addMenuItem(new menuItem("Personal Group","","Javascript:newMenu_group('personal')"));
if (dataCache.canAddEnterpriseGroups()) contact_new_menu.addMenuItem(new menuItem("Enterprise Group","","Javascript:newMenu_group('enterprise')"));
var groups=new Array();
contact_view_menu=new jsDOMenu(180);
contact_view_menu.addMenuItem(new menuItem("Personal Contacts","personalMainMenu","Javascript:viewMenu_contacts('personal')"));
groups.push({
"text": "Personal Groups",
"action": "Javascript:viewMenu_groups('personal')"
});
if((top.ApplicationOldContacts!=undefined && top.ApplicationOldContacts.hasEnterprise) || (root.ApplicationOldContacts!=undefined && root.ApplicationOldContacts.hasEnterprise)) {
contact_view_menu.addMenuItem(new menuItem("Enterprise Contacts","enterpriseMainMenu","Javascript:viewMenu_contacts('enterprise')"));
groups.push({
"text": "Enterprise Groups",
"action": "Javascript:viewMenu_groups('enterprise')"
});
}
if (user_prefs.access_contact_sharing=='True' && dataCache.getSharers().length > 0) {
contact_view_menu.addMenuItem(new menuItem("Shared Contacts","sharedMainMenu",""));
groups.push({
"text": "Shared Groups",
"action": "Javascript:viewMenu_groups('shared')"
});
}
contact_view_menu.addMenuItem(new menuItem("-",		 "", ""));
contact_view_menu.addMenuItem(new menuItem("Groups", "groupsMainMenu", "Javascript:viewMenu_groups('personal')"));
contact_view_menu.items.groupsMainMenu.setSubMenu(createGroupSubMenus(groups));
contact_view_menu.addMenuItem(new menuItem("-",		 "", ""));
contact_view_menu.addMenuItem(new menuItem("Choose Display Columns","displayColumns","Javascript:viewMenu_editDisplayCols()"));	
contact_view_menu.addMenuItem(new menuItem("-",		 "", ""));
contact_view_menu.addMenuItem(new menuItem("List View","gridView","Javascript:viewMenu_view('gridView')","",""));
contact_view_menu.addMenuItem(new menuItem("Card View","cardView","Javascript:viewMenu_view('cardView')","",""));
contact_action_menu=new jsDOMenu(180);
contact_action_menu.addMenuItem(new menuItem("Email my Information","emailInformation",""));
contact_action_menu.addMenuItem(new menuItem("Email Selected Contacts To","selectContactsMenu","Javascript:actionMenu_sendContactsTo()"));
if (dataCache.canAddEnterpriseContacts() && contactView.currentContactType=="personal")
contact_action_menu.addMenuItem(new menuItem("Copy Selected Contacts To Enterprise","selectContactsMenu","Javascript:actionMenu_copyContactsTo(true)"));
if (contactView.currentContactType=="enterprise")
contact_action_menu.addMenuItem(new menuItem("Copy Selected Contacts To Personal","selectContactsMenu","Javascript:actionMenu_copyContactsTo(false)"));
if(root.ApplicationOldContacts.efaxEnabled) {
contact_action_menu.addMenuItem(new menuItem("-", "", ""));
contact_action_menu.addMenuItem(new menuItem("Send Fax", "", "Javascript:actionMenu_newEfax()"));
}
contact_action_menu.addMenuItem(new menuItem("-",		 "", ""));
contact_action_menu.addMenuItem(new menuItem("Edit My Information","","Javascript:actionMenu_editMyContactInformation()"));
contact_action_menu.addMenuItem(new menuItem("Import/Export Contacts","","Javascript:actionMenu_changeView('importexport')"));
if (user_prefs.access_contact_sharing=='True') contact_action_menu.addMenuItem(new menuItem("Manage Sharing","","Javascript:actionMenu_changeView('sharing')"));
contact_action_menu.addMenuItem(new menuItem("Manage Custom Fields","","Javascript:actionMenu_changeView('custom')"));
contact_action_menu.addMenuItem(new menuItem("-",		 "", ""));
contact_action_menu.addMenuItem(new menuItem("Modify Group","addToGroup","Javascript:actionMenu_modifyGroup()"));
var emailInformationSubmenu=new jsDOMenu(140);
emailInformationSubmenu.addMenuItem(new menuItem("All Information","","Javascript:actionMenu_sendMyContactInformation('all')"));
emailInformationSubmenu.addMenuItem(new menuItem("Work Information","","Javascript:actionMenu_sendMyContactInformation('work')"));
emailInformationSubmenu.addMenuItem(new menuItem("Personal Information","","Javascript:actionMenu_sendMyContactInformation('personal')"));
contact_action_menu.items.emailInformation.setSubMenu(emailInformationSubmenu);
setViewSubMenus();
contact_action_menu.items["selectContactsMenu"].setClassName("jsdomenuitemdisabled");
contact_action_menu.items["selectContactsMenu"].setClassNameOver("jsdomenuitemdisabled");
contactType=contactView.currentContactType+"MainMenu";
toggleCheckMarks('contact',contactType);
toggleCheckMarks('view', (getCookie("contactView"))? getCookie("contactView") : "gridView");
}
function toggleGrayedItem(itemName,status) {
var myClassName=(status=='active')? 'jsdomenuitem' : 'jsdomenuitemdisabled';
var myClassNameOver=(status=='active')? 'jsdomenuitemover' : 'jsdomenuitemdisabled';
if(contact_action_menu.items[itemName]) {
contact_action_menu.items[itemName].setClassName(myClassName);
contact_action_menu.items[itemName].setClassNameOver(myClassNameOver);
} else if(contact_view_menu.items[itemName]) {
contact_view_menu.items[itemName].setClassName(myClassName);
contact_view_menu.items[itemName].setClassNameOver(myClassNameOver);
}
}
function onclick_New(event) {
var ddHeight=document.getElementById("contactViewHeader1").offsetHeight+document.getElementById("menubar-container").offsetHeight;
var isMenuShown=contact_new_menu.is_shown();
hideAllMenus();
if (!isMenuShown) {
contact_new_menu.setX(getRealLeft(document.getElementById('btnNew')));
contact_new_menu.setY(ddHeight-1);
contact_new_menu.show();
if(event) if(event.stopPropagation) event.stopPropagation(); else event.cancelBubble=true;
}
}
function onclick_View(event) {
if (contact_view_menu!=undefined) {
var ddHeight=document.getElementById("contactViewHeader1").offsetHeight+document.getElementById("menubar-container").offsetHeight;
var isMenuShown=contact_view_menu.is_shown();
hideAllMenus();
if (!isMenuShown) {
contact_view_menu.setX(getRealLeft(document.getElementById('btnView')));
contact_view_menu.setY(ddHeight-1);
contact_view_menu.show()
if(event) if(event.stopPropagation) event.stopPropagation(); else event.cancelBubble=true;	
}
}
}
function onclick_Action(event) {
if (contact_action_menu!=undefined) {
var ddHeight=document.getElementById("contactViewHeader1").offsetHeight+document.getElementById("menubar-container").offsetHeight;
var isMenuShown=contact_action_menu.is_shown();
hideAllMenus();
if (!isMenuShown) {
contact_action_menu.setX(getRealLeft(document.getElementById('btnActions')));
contact_action_menu.setY(ddHeight-1);
contact_action_menu.show();
if(event) if(event.stopPropagation) event.stopPropagation(); else event.cancelBubble=true;	
}
}
}
function newMenu_contact(contactType, groupUuid) {
var contactName=(contactType=='enterprise')? 'enterprise' : (contactType=='personal')? user_prefs.user_name : contactView.getCurrentUserName();
popNewContact(groupUuid,contactName);
}
function newMenu_group(groupType) {
var groupOwner=(groupType=="enterprise")? "enterprise" : (groupType=="personal")? user_prefs.user_name : (groupType=="shared")? contactView.getCurrentUserName() : "";
popGroup('',groupOwner);
}
function viewMenu_contacts(contactTypeNew, currentDir, shareName) {
simpleClick.setSimpleClickState(contactTypeNew+";");
contactType=contactTypeNew+"MainMenu";
var newDir=(currentDir)? currentDir : "";
contactView.currentDir=newDir;
contactView.currentContactType=contactTypeNew;
contactView.currentSearch="";
contactView.currentMin=1;
contactView.currentMax=prefsObject.displayPrefs;
contactView.selectedIndex=0;
editPageDropDown(0);
if (shareName) contactView.currentContactUserName=shareName;
contactView.refreshDD=true;
contactView.firstLoad=true;
contactView.load();
var secondParam=(shareName)? shareName : "contactbar";
window.parent.ExtensionBannerAds.refreshAll();
if (contactType=="shared" && dataCache.findGroup(currentDir).access=='f') addSharedMenu();
else create_message_menus();
}
function viewMenu_view(viewType) {
toggleCheckMarks('view',viewType);
if (viewType=="gridView") contactView.loadDisplayFieldsFromCookie();
else if (viewType=="cardView") currentContactFields=new Array("UUID","PHOTO","ACCESS","DISPLAYNAME","TEL-WORK-NUMBER1","TEL-CELL-NUMBER1","ADR-WORK-STREET","ADR-WORK-LOCALITY","ADR-WORK-REGION","ADR-WORK-PCODE","JOBTITLE","ORG-COMPANY","EMAIL1");
contactView.refreshDD=true;
setCookie("contactView",viewType,new Date(2222,12,31),"");
contactView.currentView=viewType;
contactView.load();
}
function viewMenu_editDisplayCols() {
commands.udfs_GetUDFs(contactView.getCurrentUserName(),"handlers.udfs_GetForEditDisplayCols()");
}
function viewMenu_groups(type) {
groupList.show(type);
simpleClick.setSimpleClickState(type+";");
}
function actionMenu_sendMyContactInformation(infoType) {
commands.attachments_AttachVCard(infoType,"handlers.attachments_PrepareMyAttachment('"+contactView.getCurrentSelection()+"','"+infoType+"')");
}
function actionMenu_sendContactsTo() {
if (contactView.getCurrentSelection().length==0) alert("No contacts selected");
else commands.attachments_PrepareAttachment(contactView.getCurrentSelection(),"handlers.attachments_PrepareAttachment('')");
}
function actionMenu_copyContactsTo(toEnterprise) {
var donor='enterprise';
var recipient=user_prefs.user_name;
if (toEnterprise) {
recipient='enterprise';
donor=user_prefs.user_name;
}
if (contactView.getCurrentSelection().length==0) alert("No contacts selected");
else commands.contacts_CopyContactsNoGroup(recipient,donor,contactView.getCurrentSelection(),"handlers.contacts_CopyContactsToGroup('')");
}
function actionMenu_editMyContactInformation() { popContact('self'); }
function actionMenu_changeView(action) {
toggleCheckMarks('view','removeall');
contactView.setHeaderText((action=="importexport")? "Import/Export Contacts" : (action=="sharing")? "Manage Sharing" : (action=="custom")? "Manage Custom Fields" : "");
if (action=='importexport') contactView.createImportExportPane();
else if (action=='sharing') contactView.createManageSharing();
else if (action=='custom') contactView.createUserDefinedFields();
}
function actionMenu_modifyGroup() {
if (contactView.currentDir=="") alert("You must be viewing a group to modify.")
else popGroup(contactView.currentDir,contactView.getCurrentUserName());
}
function actionMenu_newEfax() {
if(contactView.getCurrentSelection().length==0) {
alert("No contacts selected");
} else {
root.EfaxContactsInterface.obj.newFax(contactView.getCurrentSelection());
}
}
function toggleCheckMarks(type, itemName) {
if (type=='contact') contactType=itemName;
var itemArray=new Array();
if(type=="contact" || type=="group") {
itemArray=new Array("personalMainMenu","sharedMainMenu","enterpriseMainMenu");
if(type=="group") {
itemArray.push("groupsMainMenu");
}
} else if(type=="view") {
itemArray=new Array("gridView","cardView");
}
for (var i=0; i<itemArray.length; i++) {
var itemClass=(itemArray[i]==itemName)? "jsdomenuitemmarked" : "jsdomenuitem";
var itemOverClass=(itemArray[i]==itemName)? "jsdomenuitemover jsdomenuitemmarked" : "jsdomenuitemover";
if (contact_view_menu.items[itemArray[i]]) contact_view_menu.items[itemArray[i]].setClassName(itemClass);
if (contact_view_menu.items[itemArray[i]]) contact_view_menu.items[itemArray[i]].setClassNameOver(itemOverClass);
}
}
var companyFields=new Array("DETAILED_ORG-COMPANY","DETAILED_LABEL-WORK","DETAILED_ADR-WORK-POBOX","DETAILED_ADR-WORK-STREET","DETAILED_ADR-WORK-LOCALITY","DETAILED_ADR-WORK-REGION","DETAILED_ADR-WORK-PCODE","DETAILED_ADR-WORK-CTRY","DETAILED_URL");
function addAnotherContact(sameCompany) {
document.getElementById("newContact").style.display="block";	
contactPreview.contactXML.xmlData=null;
for (a in contactPreview.contactXML.values) {
var ok=true;
if (sameCompany) 
for (var i=0; i<companyFields.length; i++) 
if (a==companyFields[i].split("_")[1])
ok=false;
if (ok)
contactPreview.contactXML.values[a]='';
}
onLoad_addContact(true);
}
function processParams() {
var paramString=getParam("params").split(",");
for (var i=0; i<paramString.length; i++) {
for (var j=0; j<resources.contactFields.length; j++) {
for (var k=0; k<resources.contactFields[j].length; k++) {
if (unescape(paramString[i].split(":")[0])==resources.contactFields[j][k][1][0].split("_")[1]) {
document.getElementById(resources.contactFields[j][k][1][0]).value=(unescape(paramString[i].split(":")[1]).replace(/^\W+/,'')).replace(/\W+$/,'');
}
}
}
}
var name=parseName(unescape(paramString[0].split(":")[1]));
var nameFields=new Array("PREFIX","GIVEN","MIDDLE","FAMILY","SUFFIX");
for (var i=0;i<nameFields.length;i++)
document.getElementById("DETAILED_N-"+nameFields[i]).value=(!name[nameFields[i].toLowerCase()])? "" : name[nameFields[i].toLowerCase()];	
contactPreview.refreshDNControl();
}
function toggleEnableSaveCancel(on) {
if (on) {
var shadowbox=document.getElementById("shadowBox");
if (shadowbox && shadowbox!=undefined)
self.document.body.removeChild(shadowbox);
} else {
var shadowbox=cb.createElement("div","shadowBox","shadowBox","position:absolute;top:0;left:0;z-index:1000;height:0px;width:0px;");
shadowbox.style.height=cb.getBrowserHeight()+"px";
shadowbox.style.width=cb.getBrowserWidth()+"px";
self.document.body.appendChild(shadowbox);
}
}
function onLoad_addContact(anotherContact) {
initAppRefs();
contactType=getParam("type");
document.getElementById("contentDiv").style.height=cb.getBrowserHeight()-30;
contactPreview.load("contentDiv","Add");
contactPreview.contactXML=dataCache.selectedContact;
if (getParam("aid")!="val" && (anotherContact!=true)) {
contactPreview.businessInfoViewEdit("editable","newcontact");
contactPreview.loadUserDefinedFields('editable');
if (getParam("params")) processParams();
} else {
contactPreview.loadContactInformation("editable",true);
contactPreview.businessInfoViewEdit("editable","newVcard");
var name=parseName(dataCache.selectedContact.get("FN"));
var nameFields=new Array("PREFIX","GIVEN","MIDDLE","FAMILY","SUFFIX");
for (var i=0;i<nameFields.length;i++) 
document.getElementById("DETAILED_N-"+nameFields[i]).value=(!name[nameFields[i].toLowerCase()])? "" : name[nameFields[i].toLowerCase()];	
var addressFields=new Array("STREET","POBOX","LOCALITY","REGION","PCODE","CTRY");
var address=parseAddress(dataCache.selectedContact.get("LABEL-WORK"));
for (var i=0;i<addressFields.length;i++)
document.getElementById("DETAILED_ADR-WORK-"+addressFields[i]).value=(!address[addressFields[i].toLowerCase()])? "" : address[addressFields[i].toLowerCase()];
address=parseAddress(dataCache.selectedContact.get("LABEL-HOME"));
for (var i=0;i<addressFields.length;i++)
document.getElementById("DETAILED_ADR-HOME-"+addressFields[i]).value=(!address[addressFields[i].toLowerCase()])? "" : address[addressFields[i].toLowerCase()];
contactPreview.refreshDNControl();
}
if (!anotherContact) {
cb.addEventListener(document.getElementById("saveButton"),"click",onClickAddContact);
cb.addEventListener(document.getElementById("cancelButton"),"click",closeWindow);
}
updateGUISkin();
initTDButtons();
}
function validateName(name) {
var contactList=dataCache.getSortedContactList(contactType);
for (var i=0; i<contactList.length; i++) if (contactList[i].name==name) return false;
return true;
}
function onClickAddContact(event) {
if(!event) { event=window.event; }
toggleEnableSaveCancel(false);
newContact=dataCache.selectedContact;
sameContact=new Contact();
for (var i=0; i<companyFields.length; i++) {
sameContact.values[companyFields[i].split("_")[1]]=document.getElementById(companyFields[i]).value;
}
var detailedView=resources.contactFields[1];
for (var i=0;i<detailedView.length; i++) {
for (var j=0;j<detailedView[i][1].length;j++) {
var currentVal=detailedView[i][1][j];
if (currentVal.split("_")[1]=='HEADER') continue;
if (document.getElementById(currentVal).options && document.getElementById(currentVal).selectedIndex==-1) document.getElementById(currentVal).selectedIndex=0;
newContact.values[currentVal.split("_")[1]]=(document.getElementById(currentVal).options)? htmlUnencode(document.getElementById(currentVal).options[document.getElementById(currentVal).selectedIndex].innerHTML) : document.getElementById(currentVal).value;
}
}
var i=0;
while (document.getElementById("udf_"+i)) {
newContact.values["udf_"+i]=htmlEncode(escape(document.getElementById("udf_"+i).value));
i++;
}
newContact.values["addbday"]=(document.getElementById("cb_bday") && document.getElementById("cb_bday").checked);
newContact.values["addanni"]=(document.getElementById("cb_anniversary") && document.getElementById("cb_anniversary").checked); 
if (newContact.values["DISPLAYNAME"]=="") {
alert("You must enter a name");
toggleEnableSaveCancel(true);
} else {
if (!validateName(newContact.values["DISPLAYNAME"]) && !confirm("You already have a contact with this name. Are you sure you want to create another contact with the same name?")) {
toggleEnableSaveCancel(true);
return;
}
var noteText="";
var userNotes=contactPreview.userNotes;
for (var i=0; i < userNotes.length; i++) {
noteText+="<ANOTE><TEXT>"+htmlEncode(escape(userNotes[i].note))+"</TEXT>";
noteText+="<DATE>"+htmlEncode(escape(userNotes[i].noteDate))+"</DATE>";
noteText+="<CATEGORY>"+htmlEncode(escape(userNotes[i].category))+"</CATEGORY></ANOTE>";
}
if (!newcontact_groupId) commands.contacts_CreateContact(newContact.values["DISPLAYNAME"],newContact.contactToString(),contactType,'',"handlers.contacts_CreateContact('"+noteText+"')");
else commands.contacts_CreateContact(newContact.values["DISPLAYNAME"],newContact.contactToString(),contactType,newcontact_groupId,"handlers.contacts_CreateContact('"+noteText+"')");
}
}
function contactAddSuccessScreen(uuid, type, group_uuid) {
document.getElementById("newContact").style.display="none";
var caDOM=new Array();
caDOM.push("<center><div id=successDiv align=left style='text-align:left;width:600px;background-color:#F0F0F0;margin:auto auto;margin-top:50px;border:1px solid #bbb;'>");
caDOM.push("<img src="+GUI_ROOT+"spacer.gif class='icon-sys-notify' style='margin-top:20px;float:left;margin-left:20px;vertical-align:top'>");
caDOM.push("<div style='margin-left:160px;margin-top:30px'>Contact has been added successfully.</div>");
if(hasBlackberryEnabled && document.getElementById("blackberry").checked){
caDOM.push("<div style='margin-left:160px;'>A copy of this contact has been sent to your BlackBerry.</div>");
}
var groups=root.SimpleClickDataCache.getSortedGroupList(type);
if (groups.length) {
caDOM.push("<hr style='margin-top:30px;'><center><div style='margin-bottom:10px;'><b>Group this contact:</b></div><table style='font-size:11px;'>");
for (var i=0;i<Math.floor((groups.length+2)/3);i++) {
caDOM.push("<tr>");
for(var j=0; j < 3; j++) {
if(3 * i+j >=groups.length) {
break;
}
var group=groups[3 * i+j];
var checked=(group.uuid==group_uuid) ? ' checked="checked"' : "";
caDOM.push("<td style='padding-right:19px'><input type='checkbox' value='"+group.uuid+"' onchange='toggleContactGroup(this, \""+uuid+"\")'"+checked+">"+group.name+"</input></td>");
}
}	
caDOM.push("</table></center>");
}
caDOM.push("<hr style='margin-bottom:10px'>");
caDOM.push("<center><div style='cursor:hand;cursor:pointer;line-height:16px;'><button style='margin:auto 10px 30px;width:140px;' onclick='addAnotherContact(false)'>Add another contact</button>");
if (sameContact.values["ORG-COMPANY"] && sameContact.values["ORG-COMPANY"]!="")
caDOM.push("<button style='width:"+(150+12*sameContact.values["ORG-COMPANY"].length)+"px;margin:auto 10px 30px 10px;' onclick='addAnotherContact(true)'>Add another contact from "+sameContact.values["ORG-COMPANY"]+"</button>");
caDOM.push("<button onclick=closeWindow(event) style='margin:auto auto 30px 10px;width:40px;'>Close</button></div></center></div></center>");
document.getElementById("contentDiv").innerHTML=caDOM.join('');
}
function toggleContactGroup(input, contact_uuid) {
var group_uuid=input.value;
if(input.checked) {
commands.contacts_AddContactsToGroup(group_uuid, contact_uuid, "handlers.contacts_AddContactsToGroup('"+group_uuid+"', false)");
} else {
commands.contacts_RemoveContactsFromGroup(group_uuid, contact_uuid, "handlers.contacts_RemoveContactsFromGroup('"+group_uuid+"')");
}
}
function onLoad_contactCard() {
initAppRefs();
resources=new Resources();
updateGUISkin();
contactPreview.contactXML=dataCache.selectedContact;
if(contactPreview.contactXML.get("UUID")==undefined) {
setTimeout(function() { onLoad_contactCard(); }, 500);
return;
}
self.document.body.appendChild(cb.createElement("div","contactPreviewCard","","overflow-y:auto;height:"+cb.getBrowserHeight()));
contactPreview.load("contactPreviewCard","Card");
if (contactPreview.contactXML==undefined) {
commands.contacts_GetContact(preview_contactId, "handlers.contacts_GetContact()");
}
else {
commands.contactNotes_GetNotes(preview_contactId,"handlers.contactNotes_GetNotes()");
contactPreview.loadContactInformation("text");
if (modeType=="edit") contactPreview.businessInfoViewEdit("editable");
contactPreview.setContactCheckBoxes();
}
}
function unloadWindow() {
openWindows[preview_contactId]=null;
}
var print_timer;
function fillPrintable() {
var printableArea=document.getElementById('printableArea');
eval ("window.opener."+window.opener.printFunction+"(printableArea)");
}
function print_window_contents() {
try { if(!window.closed) window.print(); window.close();
} catch(er) { return; }
}
function set_print_timer() {
print_timer=setTimeout('if(!window.closed)print_window_contents();', 300);
}
function clear_print_timer() {
clearTimeout(print_timer);
}
function handle_print_preview_open() {
if(window.opener && !window.opener.closed) {
if(window.opener.print_prev_open)
window.opener.print_prev_open();
}
}
function handle_print_preview_close() {
clear_print_timer();
if(window.opener && !window.opener.closed) {
if(window.opener.print_prev_close)
window.opener.print_prev_close();
}
}
function init() {
initAppRefs();
updateGUISkin();
handle_print_preview_open();
set_print_timer();
initTDButtons();
fillPrintable();
}
function checkExistingShare() {
var currentShares=dataCache.getSharingData(shareGroupUuid);
for (var i=0; i<currentShares.length; i++) {
var myUser=dataCache.findUserByUserName(currentShares[i].uuid);
if (myUser) {
uuidList.push(myUser.uuid);
AddShare(htmlUnencode(myUser.name), myUser.uuid, currentShares[i].permission);
}
}
}
function AddShare(name, uuid, perm) {
var textAreaTable=document.getElementById("textAreaTable").firstChild;
var textAreaRow=textAreaTable.appendChild(cb.createElement("tr","share-"+uuid,"","cursor:hand;cursor:pointer;"));
cb.addEventListener(textAreaRow,'click',onClickContact);
var textAreaCol=cb.createElement("td","","","","width:40%",unescape(htmlEncode(name)));
textAreaRow.appendChild(textAreaCol);
var permOptions=new Array("Read Only","Modify","Full Access");
for (var i=0; i<permOptions.length; i++) {
var optionCol=document.createElement("td");
var optionRadio=cb.createElement("input",uuid+"-"+permShortHand[i],"","","type:radio,name:radio-"+uuid);
if (cb.isIE()) cb.addEventListener(optionRadio,"click",checkRadio);
optionCol.appendChild(optionRadio);
optionCol.appendChild(document.createTextNode(permOptions[i]));
textAreaRow.appendChild(optionCol);
if (perm==permShortHand[i]) document.getElementById(uuid+"-"+permShortHand[i]).checked=true;
}
}
function onNewShareCreate() {
var permList=new Array();
for (var i=0; i<uuidList.length; i++) {
var curRow=document.getElementById("share-"+uuidList[i]);
if (!curRow) 
uuidList.splice(i,1);
else {
for (var j=0; j<permShortHand.length; j++) {
if (document.getElementById(uuidList[i]+"-"+permShortHand[j]).checked==true) {
permList.push(permShortHand[j]);
}
}
}
}
var ownerName=dataCache.findOwner(groupUuid);
var userNameList=new Array();
for (var i=0; i<uuidList.length; i++) {
var username=dataCache.findUser(uuidList[i]).username;
if(username==ownerName) {
deleteUuidList.push(uuidList[i]);
}
userNameList.push(username);
}
var addPermList=new Array();
for (var i=0; i<addUuidList.length; i++) {
var curRow=document.getElementById("share-"+addUuidList[i]);
for (var j=0; j<permShortHand.length; j++) {
if (document.getElementById(addUuidList[i]+"-"+permShortHand[j]).checked==true) {
addPermList.push(permShortHand[j]);
}
}
}
var addUserNameList=new Array();
for (var i=0; i<addUuidList.length; i++) addUserNameList.push(dataCache.findUser(addUuidList[i]).username);
var deleteUserNameList=new Array();
for (var i=0; i<deleteUuidList.length; i++) deleteUserNameList.push(dataCache.findUser(deleteUuidList[i]).username);
var groupOwner=dataCache.findGroupOwner(groupUuid);
if (uuidList.length > 0) {
shareCommands++;
contactsApp.commands.shares_SharePermissions(userNameList,shareGroupUuid,permList,"handlers.shares_SharePermissions()");
}
if (addUuidList.length > 0) {
shareCommands++;
contactsApp.commands.shares_ProposeShare(addUserNameList,shareGroupUuid,addPermList,"handlers.shares_ProposeShare()");
}
if (deleteUuidList.length > 0) {
shareCommands++;
contactsApp.commands.shares_RevokeShare(deleteUserNameList,shareGroupUuid,"handlers.shares_RevokeShare()");
}
if (window.opener.contactView!=undefined) {
window.opener.contactView.createManageSharing(4000);
}
else if (window.opener.top.contactView!=undefined) {
window.opener.top.contactView.createManageSharing(4000);
}
successScreen("Group sharing has been modified successfully.","large");
}
var shareCommands=0;
function onLoad_shareWindow() {
initAppRefs();
CursorMonitor.hook();
shareGroupUuid=((groupUuid=='AllPersContacts') || (groupUuid=='AllEntContacts') || (groupUuid=="AllPers") || (groupUuid=="AllEnt") || (groupUuid==undefined) || (groupUuid==null))? 'All' : groupUuid;
groupName=(shareGroupUuid=="All") ? "My Contacts" : dataCache.findGroup(groupUuid).name;
var winDOM=new Array();
winDOM.push("<div style=''>");
winDOM.push("<div id='headerText' class=contactHeaders style='padding-top:2px;'>Share the "+htmlEncode(groupName)+" Group</div>");
winDOM.push("<div class=contactLabel>Share this group by clicking contacts from the list on the left</div>");
winDOM.push("<div class=contactHeaders>Contacts: </div>");
winDOM.push("<div id=newShares style='font-size:11px;width:420;height:300;margin-left:10px;border:#999999 solid 1px;overflow:auto;'>");
winDOM.push("<table id=textAreaTable style='font-size:11px' width=100% cellSpacing=0 cellPadding=0><tbody></tbody></table></div>");
winDOM.push("<button onclick=removeSelectedItem(event) disabled id=deleteButton style='margin-left:10px;margin-top:10px;'>Remove</button></div>");
document.getElementById("contentWindow").innerHTML=winDOM.join('');
cb.addEventListener(document.getElementById("saveButton"),'click',onNewShareCreate);
cb.addEventListener(document.getElementById("cancelButton"),'click',closeWindow);
checkExistingShare();
initTDButtons();
}
function ShareWindowProcessOneClick(type, group, contact) {
var contactList=new Array();
if (!contact)   
if (group.name=="All")
contactList=dataCache.findListByKey("contact",group.type);
else
for (var i=0;i<group.contacts.length;i++)
contactList.push(dataCache.findUser(group.contacts[i]));
else  
contactList.push(dataCache.findUser(contact.uuid));
var badContactList=new Array();
for (i=0;i<contactList.length;i++) {
currentUser=contactList[i];
currentUser.name=htmlUnencode(currentUser.name);
var found=false;
if (!currentUser || !currentUser.username || currentUser.username=="" || currentUser.username==user_prefs.user_name) {
if (currentUser && currentUser.name) {
badContactList.push(currentUser.name);
}
} else {
for (var j in uuidList) if (contactList[i].uuid==uuidList[j]) found=true;
for (var j in addUuidList) if (contactList[i].uuid==addUuidList[j]) found=true;
for (var j in deleteUuidList) if (contactList[i].uuid==deleteUuidList[j]) found=false;
if (!found) {
AddShare(currentUser.name,currentUser.uuid,"r");
addRemoveContact("Add", currentUser.uuid);
}
}
}
if (badContactList.length)
alert ("Was not able to share with these contacts: "+badContactList.toString());
}
function checkRadio(event) {
if(!event) { event=window.event; }
var uuid=cb.currentTarget(event).id.split("-")[0];
for (var i=0; i<permShortHand.length; i++) {
document.getElementById(uuid+"-"+permShortHand[i]).checked=(cb.currentTarget(event).id==(uuid+"-"+permShortHand[i]))? true : false;
}
}
function onClickSavePrefs() {
var displayPrefs=document.getElementById("displayNum").options[document.getElementById("displayNum").selectedIndex].id;
var previewStatus=(document.getElementById("on").checked)? "on" : "off";
commands.prefs_ReplacePreferences("",displayPrefs,previewStatus,"handlers.prefs_ReplacePreferences('"+displayPrefs+"','"+previewStatus+"')");
}
function onClickCancelPrefs() {
parent.app_main.location.href="/Ioffice/prefs/prefs_index.asp?unm="+user_prefs.user_name+"&sid="+user_prefs.session_id;
}
function importResults_load() {	
initAppRefs();
if (getParam("result").match(/<import>/)) {
parent.createImportMappingPane(getParam("result"));
window.close();
}
root.GridCache.clear();
contactsApp.contactView.load();
updateGUISkin();
dataCache.loadSimpleClickCache();
document.getElementById("contentDiv").style.height=(cb.getBrowserHeight()-30)+"px";
var contactNameArray=getParam("result").split("~");
var contactDiv=document.getElementById("importedContacts");
for (var i=0; i<contactNameArray.length; i++) {
var contactRow=contactDiv.appendChild(document.createElement("tr"));
var contactCol=contactRow.appendChild(cb.createElement("td","","","padding-left:10px"));
var node=contactCol.appendChild(document.createTextNode(unescape(contactNameArray[i])));
}
}
function ContactView() {
this.DIV_CONTAINER_ID="listView";
this.contactViewDiv,this.currentView,this.currentContactType,this.currentDir,this.currentSortString,
this.currentMax,this.currentMin,this.currentSearch,this.currentDisplayCount,this.sharedUserName,this.sortOrderClass,this.currentOpenWindow,
this.currentFilter,this.currentSelectedCol,this.currentContactUserName,this.currentContactArray,this.refreshDD,this.cvDOM,this.selectedValue;
this.currentFields=new Array();
this.currentSelection=new Array();
this.currentColor=new Array();
this.currentPermissions=new Array();
this.currentlySearching=false;
this.labelRowCounter=1;
this.firstLoad=true;
ContactView.obj=this;
}
ContactView.prototype.init=function() {
ContactView.obj=contactView;
contactViewDiv=document.getElementById(this.DIV_CONTAINER_ID);
var selTab=simpleClick.i_accord.activeBar().name();
this.currentContactType=(selTab=="Enterprise" ? "enterprise" : (selTab=="Personal" ? "personal" : (getCookie("bt_simpleclick_tab"))? getCookie("bt_simpleclick_tab") : "personal"));
this.defaultView();
this.currentView=(getCookie("contactView"))? getCookie("contactView") : "gridView";
this.refreshDD=true;
this.sortOrderClass="sortedDown";
this.dataCache=dataCache;
this.colOrder=new Array("UUID","PHOTO","DISPLAYNAME","EMAIL1","TEL-WORK-NUMBER1");
this.colOrderEnt=new Array("UUID","PHOTO","DISPLAYNAME","EMAIL1","TEL-WORK-NUMBER1");
this.colOrderShared=new Array("UUID","PHOTO","DISPLAYNAME","EMAIL1","TEL-WORK-NUMBER1");
var c=getCookie("displayFields"+(this.currentContactType=="enterprise" ? "1" : "0"));
if (c!=undefined && c.length > 0) {
if(contactView.currentContactType=="enterprise") {
this.colOrderEnt=c.split(",");
} else {
this.colOrder=c.split(",");
}
}
contactView.load();
}
ContactView.prototype.defaultView=function() {
this.currentSortString="DISPLAYNAME";
if (this.currentFilter) document.getElementById(this.currentFilter).className="alphaButtons";
this.currentFilter="All";
document.getElementById(this.currentFilter).className="alphaButtons hilite"
this.currentDir="";
this.currentMin=1;
this.currentMax=prefsObject.displayPrefs;
this.currentDisplayCount=prefsObject.displayPrefs;;
this.currentSearch="";
}
ContactView.setGroup=function(user,group) {
user=user.toLowerCase();
group=(group=="undefined")?"":group;
if (user=="currently online" || (user=="shared" && (!group || group==""))) return;
var uuid=(group)?group.uuid:"";
var cv=ContactView.obj;
cv.currentDir=uuid;
cv.refreshDD=true;
cv.currentMin=0;
cv.currentMax=contactView.currentDisplayCount-1;
cv.currentContactType=user;
cv.refreshList();
}
ContactView.setContact=function(user,groupUuid,uuid) {
var cv=ContactView.obj;
cv.currentDir=(groupUuid=="AllEntContacts" || groupUuid=="AllPersContacts")? "" : groupUuid;
cv.currentContactType=user;
cv.firstLoad=false;
cv.refreshDD=true;
var minMax=dataCache.findGridViewMinMax(uuid, cv.currentDir);
cv.currentMin=minMax[0];
cv.currentMax=minMax[1];
cv.load();
if (uuid.length) {
contactsApp.commands.contactNotes_GetNotes(uuid, "handlers.contactNotes_GetNotes()");
contactsApp.commands.contacts_GetContact(uuid, "handlers.contacts_GetContact()");
}
}
ContactView.prototype.load=function() {
if (this.currentDir!=undefined) {
ContactView.obj=this;
contactView.loadDisplayFieldsFromCookie();
var currentGroup=dataCache.findGroup(contactView.currentDir);
this.currentContactUserName=dataCache.findOwner(contactView.currentDir);
var directName=(currentGroup.name)? " > "+((currentGroup.name=="All")?dataCache.findUserByUserName(currentGroup.owner).name+"'s Contacts" : currentGroup.name) : "";
contactView.setHeaderText(this.currentContactType.charAt(0).toUpperCase()+this.currentContactType.substr(1).toLowerCase()+" Contacts "+directName); 
var modFilter=(this.currentFilter=="All")? "" : this.currentFilter;
contactView.loadSearchWaiting();
if (this.currentFields!=undefined) {
commands.contacts_GetOrderedContactsForGrid(contactView.getCurrentUserName(), escape(this.currentFields.join(",")), (this.currentDir.match(/All/)?"":this.currentDir), this.currentSortString, this.currentMin, this.currentMax, modFilter, this.currentSearch, "");
}
create_message_menus();
}
}
ContactView.prototype.refreshList=function() {
if(groupList.isVisible() && this.currentContactType==groupList.getType()) {
groupList.show(this.currentContactType);
} else {
this.load();
}
}
ContactView.prototype.loadDataHandler=function(cache) {
if (!contact_new_menu) create_message_menus();
var totalRows=contactView.getContactTotalRows(cache);
editPageDropDown(totalRows);
toggleGrayedItem("displayColumns", "active");
toggleGrayedItem("gridView", "active");
toggleGrayedItem("cardView", "active");
toggleGrayedItem("addToGroup",((this.currentDir!="" && dataCache.hasAccess(this.currentDir,'f')) ?"active":"inactive"));
contactView.toggleDropDown("enabled");
if (this.currentView=="gridView") contactView.createGridView(cache);
else if (this.currentView=="cardView") contactView.createCardView(cache);
}
ContactView.prototype.loadDisplayFieldsFromCookie=function() {
var c=getCookie("displayFields"+(this.currentContactType=="enterprise" ? "1" : "0"));
if (c!=undefined && c.length > 0) { 
if(contactView.currentContactType=="enterprise") {
this.colOrderEnt=c.split(",");
} else {
this.colOrder=c.split(",");
}
}
switch(this.currentContactType) {
case "enterprise":
contactView.currentFields=this.colOrderEnt;
break;
case "shared":
contactView.currentFields=this.colOrderShared;
break;
default:
contactView.currentFields=this.colOrder;
break;
}
return contactView.currentFields;
}
ContactView.prototype.removeDisplayFieldFromCookie=function(myUnm,fieldname) {
var cols=(this.currentContactType=="enterprise") ? this.colOrderEnt : this.colOrder;
for (var x=0; x < cols.length; x++) {
if (cols[x]==fieldname) {
cols.splice(x, 1);
}
}
var expDate=new Date();
expDate.setYear(expDate.getFullYear()+1);
setCookie("displayFields"+(this.currentContactType=="enterprise" ? "1" : "0"),cols.join(','),expDate,"");
}
ContactView.prototype.setHeaderText=function(headerText) { document.getElementById("contactViewHeader1").innerHTML=htmlEncode(headerText); }
ContactView.prototype.contactsXML_get=function(i,field,cache) {
var vCardContact=cache.getElementsByTagName("vCard")[i];
var udfFields=root.UDFCache.find((this.currentContactType=="enterprise" ? "enterprise" : this.getCurrentUserName())).split(",");
for (var j=0; j<udfFields.length; j++)  
if (udfFields[j]==field)
field="udf_"+j+"-value";
var splitContact=field.split("-");
if (vCardContact && vCardContact!=undefined) {
for (var j=0; j<splitContact.length; j++) {
for (var k=0;k<vCardContact.childNodes.length;k++) {
if (vCardContact.childNodes[k].nodeName==splitContact[j]) {
vCardContact=vCardContact.childNodes[k];
break;
}
}
}
}
if (vCardContact && vCardContact.childNodes && vCardContact.childNodes[0] && vCardContact.childNodes[0].nodeValue)
return vCardContact.childNodes[0].nodeValue;
else
return "";
}
ContactView.prototype.createGridView=function(cache) {
var cvDOM=new Array();
var totalRows=contactView.getContactTotalRows(cache);
var status=(this.firstLoad)? "hidden" : (prefsObject.previewStatus.toLowerCase()=="on")? "display" : "hidden";
contactView.togglePreviewPane(status);
document.getElementById("hsplitter").style.backgroundColor=cb.getStyle("ApplicationWorkspace","background-color","background-color");
var elementHeight=cb.getBrowserHeight()-document.getElementById("hsplitter").offsetHeight-document.getElementById("contactPreview").offsetHeight-document.getElementById("contactViewHeader1").offsetHeight-document.getElementById("contactFilter").offsetHeight-document.getElementById("menubar-container").offsetHeight;
cvDOM.push("<div id=listViewScrollTable style='overflow:auto;height:"+elementHeight+"px;'>");
if (this.refreshDD) editPageDropDown(totalRows);
var contactViewWidth=contactView.getListViewTableWidth();
this.refreshDD=false;
cvDOM.push("<table onselectstart='event.cancelBubble=true; return false;' width=100% border=0 cellSpacing=0 cellPadding=0 class=sortable id=listViewTable style='width:100%,cellSpacing:0px,cellPadding:0px;-moz-user-select:none;'><tbody id=listViewTableTBody>");
cvDOM.push("<tr><th><img src='"+GUI_ROOT+"spacer.gif' width=16px height=16px class='ico-vcard' onclick=contactView.selectAll(event)></th>");
for (var i=2; i<this.currentFields.length; i++) {
var found=false;
var myClassName=(this.currentSortString==this.currentFields[i])? this.sortOrderClass : "noclass";
for (var j=0; j<resources.contactFields.length && !found; j++) {
for (var k=0; k<resources.contactFields[j].length && !found; k++) {
if (resources.contactFields[j][k][1][0]!=null && resources.contactFields[j][k][1][0].split("_")[1]==this.currentFields[i]) {
found=true;
cvDOM.push("<th id="+this.currentFields[i]+" class="+myClassName+" onmouseover='contactView.onMouseOverHeader(event)' onmouseout='contactView.onMouseOutHeader(event)' onclick='contactView.onClickHeader(event)' width="+contactView.getListViewTableWidth()+">"+resources.contactFields[j][k][0]+"</th>");
}
}
}
var udfFields=root.UDFCache.find(this.currentContactType=="enterprise" ? "enterprise" : this.getCurrentUserName()).split(",");
for (var j=0; j<udfFields.length; j++) {
if (this.currentFields[i]==udfFields[j])
cvDOM.push("<th id="+this.currentFields[i]+" class="+myClassName+" onmouseover='contactView.onMouseOverHeader(event)' onmouseout='contactView.onMouseOutHeader(event)' onclick='contactView.onClickHeader(event)' width="+contactView.getListViewTableWidth()+">"+htmlEncode(unescape(udfFields[j]))+"</th>");
}
}
cvDOM.push("</tr>");
var localLabelRowCounter=0;
if (totalRows==0) {
cvDOM.push("<tr><td style='height:75px;text-align:center;' vAlign=middle colSpan="+this.currentFields.length+">No contacts available.</td></tr>");
} else {
var rowCount=Math.min(Math.abs(this.currentMax - this.currentMin)+1,totalRows);
for (var i=0; i < rowCount; i++) {
var rowClass=(localLabelRowCounter % 2==0)? "row" : "altrow";
cvDOM.push("<tr id="+this.contactsXML_get(i,'UUID',cache)+" class='"+rowClass+"' onclick=contactView.onClickContact(event) onmousedown=contactView.onMouseDownContact(event) ondblclick=contactView.onDblClickContact(event)>");
cvDOM.push("<td style='padding-left:3px;' width=30><img src='"+GUI_ROOT+"spacer.gif' id='vcardicon' class='ico-vcard' height=16px width=16px></td>");
for (var j=2; j<this.currentFields.length; j++) {
cvDOM.push("<td style='padding-left:3px;' width="+contactViewWidth+">"+unescape(this.contactsXML_get(i,this.currentFields[j],cache))+"</td>");
}
cvDOM.push("</tr>");
localLabelRowCounter++;
}
}
cvDOM.push("</tbody></table></div>");
dataCache.DOMString=cvDOM.join('');
document.getElementById("contentDiv").innerHTML=cvDOM.join('');
this.currentSelectedCol=document.getElementById(this.currentSortString);
contactView.hilitePreviewPaneContact();
}
ContactView.prototype.createCardView=function(cache) {
contactView.togglePreviewPane("hidden");
var cardViewFields=new Array("DISPLAYNAME","JOBTITLE","ORG-COMPANY","ADR-WORK-STREET","ADR-WORK-LOCALITY","ADR-WORK-REGION","ADR-WORK-PCODE","TEL-WORK-NUMBER1","TEL-CELL-NUMBER1","TEL-FAX-NUMBER1");
var bottomPadding=new Array("3px","10px","3px","3px","3px","3px","10px","3px","3px","10px");
var cardViewHeight=cb.getBrowserHeight()-document.getElementById("contactViewHeader1").offsetHeight-document.getElementById("contactFilter").offsetHeight-document.getElementById("menubar-container").offsetHeight;
cvDOM=new Array();
cvDOM.push("<div id=cardViewDiv style='overflow:auto;overflow-x:hidden;height:"+cardViewHeight+";'>");
cvDOM.push("<table width=100% id=cardViewTable style='border-top:#bbb solid 1px;'>");
cvDOM.push("<tbody id=cardViewTableTBody>");
var totalRows=contactView.getContactTotalRows(cache);
var rowCount=Math.min((this.currentMax - this.currentMin),totalRows);
if (this.refreshDD) editPageDropDown(totalRows);
this.refreshDD=false;
if (totalRows==0) {
cvDOM.push("<tr><td style='border-bottom:#bbb solid 1px;font-size:11px;height:75px;text-align:center;' vAlign=middle colSpan="+this.currentFields.length+">No contacts available.</td></tr>");
} else {
for (var i=0; i < rowCount; i++) {
var uuid=this.contactsXML_get(i,"UUID",cache);
var email=this.contactsXML_get(i,"EMAIL1",cache);
var hasPhoto=(this.contactsXML_get(i,"photo",cache)=='true');
if (i % 2==0) cvDOM.push("<tr>");
cvDOM.push("<td width=33% style='padding-right:10px;padding-bottom:10px;'>");
cvDOM.push("<div id='"+uuid+"' ondblclick=contactView.onDblClickContactCard(event) class=cardView style='cursor:pointer;cursor:hand;padding-left:10px;'>");
cvDOM.push("<span style='display:inline;width:75%;'>");
myImageSrc=(hasPhoto)? commands.contacts_GetMedia(uuid) : GUI_ROOT+'spacer.gif';
myClassSrc=(hasPhoto)? '' : 'generic-small';
cvDOM.push("<div style='float:right;margin-top:15px;margin-right:15px;'>");
if (dataCache.hasAccess(uuid,"w")) {
var pictureText=(hasPhoto)? "Click to change picture" : "Click to add a new picture";
cvDOM.push("<img onclick='contactView.onClickUploadPicture(event)' id='picture-"+uuid+"' src='"+myImageSrc+"' class='"+myClassSrc+"' style='cursor:pointer;cursor:hand;' title='"+pictureText+"'></div>");
} else {
cvDOM.push("<img src='"+myImageSrc+"' class='"+myClassSrc+"'></div>");
}
for (var j=0; j<cardViewFields.length; j++) {
var extraCSS=(j==0)? "font-weight:bold;padding-top:10px;" : "";
cvDOM.push("<div class=contactLabel style='padding-button:"+bottomPadding[j]+"padding-left:10px;padding-bottom:10px;margin-right:10px;cursor:hand;cursor:pointer;overflow:hidden;"+extraCSS+"'>");
if (this.contactsXML_get(i,cardViewFields[j],cache)) {
cvDOM.push(unescape(this.contactsXML_get(i,cardViewFields[j],cache)));
if (j==8) cvDOM.push(" (cell)");
}
cvDOM.push("</div>");
}
cvDOM.push("<div class=contactLabel style='padding-left:10px;padding-bottom:10px;margin-right:10px;cursor:hand;cursor:pointer'>");
if (email) cvDOM.push("<a href='#' id=email-"+uuid+" onclick=contactView.onClickSendEmail(event)>"+email+"</a>");
cvDOM.push("</div></span></div></td>");
if (i % 2==1) cvDOM.push("</tr>");
}
}
cvDOM.push("</tbody></table></div>");
document.getElementById("contentDiv").innerHTML=cvDOM.join('');
}
ContactView.prototype.getContactTotalRows=function(cache) {
return (!cache)? 0 : cache.getElementsByTagName("totalrowcount")[0].childNodes[0].nodeValue;
}
ContactView.prototype.deleteContact=function(contactUuid) {
document.getElementById("listViewTableTBody").removeChild(document.getElementById(contactUuid));
for (var i=0; i<currentSelection.length; i++) {
if (currentSelection[i].id==contactUuid) currentSelection.splice(i,1);
}
}
ContactView.prototype.resetListViewColors=function() {
var listViewTBody=document.getElementById("listViewTableTBody");
if (!listViewTBody) return;
for (var i=0; i<listViewTBody.childNodes.length; i++) {
listViewTBody.childNodes[i].className=(i % 2==0)? "row" : "altrow";
}
}
ContactView.prototype.loadSearchWaiting=function() {
document.getElementById("contentDiv").innerHTML='<div style="margin:100px 0px 0px '+(cb.getBrowserWidth()-80)/2+'px;"><img src="'+GUI_ROOT+'spacer.gif" class="ico-throbber" style="height:20px;width:20px;margin-right:10px;"></img>Loading...</div>';
}
ContactView.prototype.hilitePreviewPaneContact=function() {
if (!contactPreview.contactXML) return;
for (var i=0; i<this.currentSelection.length; i++) this.currentSelection[i].className=this.currentColor[i];
var contactUuid=contactPreview.contactXML.values["UUID"];
if (document.getElementById(contactUuid)) {
document.getElementById("listViewScrollTable").scrollTop=getRealTop(document.getElementById(contactUuid)) - 80;
this.currentSelection=new Array(document.getElementById(contactUuid));
this.currentColor=new Array(document.getElementById(contactUuid).className);
document.getElementById(contactUuid).className="hilite hiliteRow";
}
}
ContactView.prototype.createManageSharing=function(sleeptime) {
contactView.toggleDropDown("disabled");
cvDOM=new Array();
cvDOM.push("<div id='manageSharingDiv' style='border-top:1px solid #CCC;'>");
cvDOM.push("<div class=contactHeaders style='margin-bottom:10px;'>Groups that I am sharing</div>");
if (sleeptime==undefined) sleeptime=0;
setTimeout('commands.shares_GetCurrentShares(user_prefs.user_name,"handlers.shares_GetCurrentShares()")', sleeptime);
}
ContactView.prototype.populateManageSharingGroups=function(data) {
ContactView.shareRecipients=new Array();
var shareItems=data.getElementsByTagName("share");
if (shareItems.length!=0) {
cvDOM.push("<table id=groupsSharing class='genericTable' style='margin-left:5px;' cellSpacing=0 cellPadding=0><tbody><tr>");
var arrayHeaders=new Array("Group","Shared With"," ");
var arrayHeights=new Array("250px","150px","75px");
for (var i=0; i<arrayHeaders.length; i++) {
var borderLeft=(i!=0)? ";border-left:none;" : ";";
cvDOM.push("<th class=appnav style='width:"+arrayHeights[i]+borderLeft+"'>"+arrayHeaders[i]+"</th>");
}
cvDOM.push("</tr>");		
for (var i=0; i<shareItems.length; i++) {
var groupUuid=shareItems[i].getElementsByTagName("uid")[0].childNodes[0].nodeValue;
var shareRecipients=shareItems[i].getElementsByTagName("recipient");
var name=dataCache.findGroup(groupUuid).name;
if (groupUuid=='All') name='My Contacts';
cvDOM.push("<tr><td vAlign=top>"+name+"</td>");
cvDOM.push("<td><img src='"+GUI_ROOT+"spacer.gif' onclick=contactView.onClickSeeRecipients(event,\'"+groupUuid+"\') id='"+groupUuid+"-recipientsArrow' class='b-arrow-right' style='margin-right:3px;cursor:hand;cursor:pointer;'>");
cvDOM.push("<a onclick=contactView.onClickSeeRecipients(event,\'"+groupUuid+"\') id="+groupUuid+"-recipients style='cursor:pointer;cursor:hand;'>");
cvDOM.push("<b>"+shareRecipients.length+" contacts</b></a>");
cvDOM.push("<span id='"+groupUuid+"-recipientsList' style='line-height:16px;margin-left:13px;display:none;'>");
ContactView.shareRecipients[groupUuid]="";
for (var j=0; j<shareRecipients.length; j++) {
if (shareRecipients[j].getElementsByTagName("name")[0].childNodes[0]) {
var currentRecipient=unescape(htmlEncode(shareRecipients[j].getElementsByTagName("name")[0].childNodes[0].nodeValue));
var currentUser=dataCache.findUserByUserName(currentRecipient);
if (currentUser) cvDOM.push(unescape(htmlEncode(currentUser.name))+"<br>");
ContactView.shareRecipients[groupUuid]+=currentRecipient+",";
}
}
cvDOM.push("</span><td vAlign=top><button onclick=contactView.onClickModify(event) id=modify-"+groupUuid+">Modify</button><button onclick=contactView.onClickUnshare(this) id=unshare-"+groupUuid+">Unshare</button></td>");
}
cvDOM.push("</tr></tbody></table><br>");
} else {
cvDOM.push("<div class='contactLabel' style='margin-left:5px;padding:0px'>You are not sharing any groups.</div>");
}
cvDOM.push("<div class='contactHeaders' style='margin-top:20px;margin-bottom:10px;'>Groups that are being shared with me</div>");
var contactShares=dataCache.findListByKey("group","shared");
if (contactShares.length!=0) {
cvDOM.push("<table class=genericTable cellSpacing=0 cellPadding=0 id='groupsShared' style='margin-left:5px;'><tbody><tr>");
arrayHeaders=new Array("Group","Shared By"," ");
var arrayHeights=new Array("250px","150px","75px");
for (var i=0; i<arrayHeaders.length; i++) {
var borderLeft=(i!=0)? ";border-left:none;" : ";";
cvDOM.push("<th class=appnav style='width:"+arrayHeights[i]+borderLeft+"'>"+arrayHeaders[i]+"</th>");
}
cvDOM.push("</tr>");
for (var i=0; i<contactShares.length; i++) {
if (contactShares[i].inherited!="true" || contactShares[i].uuid=="All_"+contactShares[i].owner) {
cvDOM.push("<tr id="+contactShares[i].uuid+"-sharewithrow>");
cvDOM.push("<td style='padding-left:5px;'>"+unescape(contactShares[i].name)+"</td>");
if (contactShares[i].owner!='enterprise'){
cvDOM.push("<td style='padding-left:5px;'>"+unescape(dataCache.findUserByUserName(contactShares[i].owner).name)+"</td>");
cvDOM.push("<td style='padding-left:5px;'><button onclick='contactView.onClickRemoveShareWith(event)' id="+contactShares[i].uuid+"-removesharewith>Remove</button></td></tr>");
}else {
cvDOM.push("<td style='padding-left:5px;'>Enterprise</td>");
cvDOM.push("<td style='padding-left:5px;'>&nbsp;</td></tr>");
}
}
}
cvDOM.push("</tbody></table>");
} else {
cvDOM.push("<div class='contactLabel' style='margin-left:5px;margin-top:15px'>There are no groups being shared with you.</div>");
}
cvDOM.push("<div class=contactHeaders style='vertical-align:middle;margin-top:20px;'>Manage group sharing for <select id='groupSharingSelect'>");
var groupList=dataCache.getSortedGroupList('personal');
cvDOM.push("<option id='AllPersContacts'>My Contacts</option>");
for (var i=0;i<groupList.length;i++) cvDOM.push("<option id='"+groupList[i].uuid+"'>"+groupList[i].name+"</option>");
cvDOM.push("</select> <button style='margin-bottom:2px;' onclick='contactView.onClickManageSharing()'>Modify</button></div>");	
cvDOM.push("</div>");
contactView.togglePreviewPane("hidden");
var cdiv=document.getElementById("contentDiv");
cdiv.innerHTML=cvDOM.join('');
}
ContactView.prototype.refreshContactView=function() {
if (checkForAdminLogin())
return;
contactPreview.resize();
var contactPreviewPane=document.getElementById("contactPreview");
var contactViewPane=document.getElementById("listView");
var hsplitter=document.getElementById("hsplitter");
var contactPreviewDisplayProp=cb.currentStyle(contactPreviewPane,'display');
var scrollTableDiv=document.getElementById("listViewScrollTable");
contactViewPane.style.height=(contactPreviewDisplayProp=='none')? "100%" : cb.getBrowserHeight()*.35;
var height=cb.getBrowserHeight()-contactViewPane.offsetHeight-hsplitter.offsetHeight;
if(height >=0) {
contactPreviewPane.style.height=height;
}
if (scrollTableDiv) {
var previewPaneHeight=(contactPreviewDisplayProp=='none')? 0 : hsplitter.offsetHeight+contactPreviewPane.offsetHeight;
scrollTableDiv.style.height=cb.getBrowserHeight()-document.getElementById("contactViewHeader1").offsetHeight-document.getElementById("contactFilter").offsetHeight-document.getElementById("menubar-container").offsetHeight-previewPaneHeight;
}
var sb=document.getElementById("shadowBox");
if (sb) {
sb.style.width=cb.getBrowserWidth();
sb.style.height=cb.getBrowserHeight() - document.getElementById("contactPreview").offsetHeight
}
var menu_bar=document.getElementById("menubar-container");
var contact_filter=document.getElementById("contactFilter");
var contact_header=document.getElementById("contactViewHeader1");
var contentDiv=document.getElementById('contentDiv');
menu_bar.style.width=cb.getBrowserWidth();
contact_filter.style.width=cb.getBrowserWidth();
if (contentDiv!=undefined) {
contentDiv.style.overflow="auto";
contentDiv.style.height=(cb.getBrowserHeight() - (parseInt(menu_bar.offsetHeight)+parseInt(contact_filter.offsetHeight)+parseInt(contact_header.offsetHeight)))+"px";
}
}
ContactView.prototype.createImportExportPane=function() {
contactView.togglePreviewPane("hidden");
contactView.toggleDropDown("disabled");
cvDOM=new Array();
cvDOM.push("<div id=importExportPane style='margin-top:10px;'>");
cvDOM.push("<fieldset style='margin-left:40px;margin-right:40px;width:800px'><legend>Import</legend>");
cvDOM.push("<div style='line-height:22px;'>You may import contacts in CSV (Comma-Separated Value) or vCard format. <br>You may also upload a Zip file that contains these files.</div>");
cvDOM.push("<div><a href='sample.csv' target=_blank>Sample CSV File</a></div>");
cvDOM.push("<button style='margin:5px 10px;' onclick=contactView.onClickImport(event)>Import</button></fieldset>");
cvDOM.push("<fieldset style='margin-left:40px;margin-right:40px;width:800px'><legend>Export</legend>");
cvDOM.push("<div>Export all of your contacts in the CSV (Comma-Separated Value) or vCard file format.</div>");
for (var i=0; i<resources.contactTypes.length; i++) {
if (resources.contactTypes[i]!='personal' && !user_prefs.access_contact_sharing=='True') continue;
var disabled=(resources.contactTypes[i]=='shared' && dataCache.getSharers().length==0)? "DISABLED" : "";
cvDOM.push("<input onclick=contactView.onClickExportType(event) type=checkbox "+disabled+" id='"+resources.contactTypes[i]+"_checkbox' style='margin-left:10px;margin-right:5px;'>");
cvDOM.push(resources.contactTypes[i].charAt(0).toUpperCase()+resources.contactTypes[i].substr(1).toLowerCase()+" Contacts<br>");
}
cvDOM.push("<div><div style='margin:0px;padding:4px 0px;'><input onclick=contactView.checkRadio(event) checked='on' name=exportBtn type=radio id=exportCSVRadio style='margin:0px 0px;'> CSV</div>");
cvDOM.push("<div style='margin:0px;padding:4px 0px;'><input onclick=contactView.checkRadio(event) name=exportBtn type=radio id=exportVCFRadio style='margin:0px 0px;'><span id=vcardTextElement> vCard(s) (single vcard or zip file)</span></div>");
var hasCC=false;
var app_ids=root.app_ids;
for (var cc=0; cc < app_ids.length; cc++) {
if (app_ids[cc]=="3002")
hasCC=true;
}
if (hasCC) {
cvDOM.push("<div style='margin:0px;padding:4px 0px;'><input onclick=contactView.checkRadio(event) name=exportBtn type=radio id=exportCCRadio style='margin:0px 0px;'> Constant Contact</div>");
}
cvDOM.push("</div>");
cvDOM.push("<button onclick=contactView.onClickExport(event) style='margin:5px 10px;'>Export</button></fieldset></div>");
document.getElementById("contentDiv").innerHTML=cvDOM.join('');
}
ContactView.prototype.createImportMappingPane=function(text, owner, groups) {
if (window.ActiveXObject) {
var xml=new ActiveXObject("Microsoft.XMLDOM");
xml.async="false";
xml.loadXML(text);
}
else {
var parser=new DOMParser();
var xml=parser.parseFromString(text,"text/xml");
}
var fcArray=new Array();
for (var i=0;i<resources.fields.length;i++)
if (resources.fields[i].editable==1 && resources.fields[i].header==0)
fcArray.push("<option value='"+resources.fields[i].id+"'>"+resources.fields[i].fullLabel+"</option>");
else if (resources.fields[i].header==1)
fcArray.push(((i==0)?"":"</optgroup>")+"<optgroup label='"+resources.fields[i].fullLabel+"'>");
var udfs=root.UDFCache.find(owner).split(",");
if (udfs.length) {
fcArray.push("</optgroup><optgroup label='Custom Fields'>");
for (var i=0;i<udfs.length;i++) 
fcArray.push("<option value='udf_"+i+"-value'>"+udfs[i]+"</option>");
}	
fieldChoices="<option value='noimport'>Don't Import</option>"+fcArray.join(" ");
contactView.togglePreviewPane("hidden");
contactView.toggleDropDown("disabled");
cvDOM=new Array();
cvDOM.push("<div id=listViewScrollTable  style='margin-top:10px;'>");
cvDOM.push("<table padding=1 class='sortable' id='listViewTable'><tbody id='listViewTableTBody'><tr>");
cvDOM.push("<th>Uploaded Field Name</th><th>Maps To</th>");
for (var i=1;i<6;i++) 
cvDOM.push("<th>Example "+i+"</th>");
cvDOM.push("</tr>");
var cols=xml.getElementsByTagName("column");
for (var i=0;i<cols.length;i++) {
cvDOM.push("<tr class='"+((i%2)?"":"alt")+"row'><td style='text-align: center;'>");
for (var j=0;j<cols[i].childNodes.length;j++) 
if (cols[i].childNodes[j].nodeName=="header" && cols[i].childNodes[j].childNodes.length) 
cvDOM.push(cols[i].childNodes[j].childNodes[0].nodeValue);
cvDOM.push("</td><td style='border-width:1px;'>");
cvDOM.push("<select id='field_"+i+"'>"+fieldChoices+"</select>");
cvDOM.push("</td>");
for (var e=1;e<6;e++)  {
cvDOM.push("<td>");
for (var j=0;j<cols[i].childNodes.length;j++) 
if (cols[i].childNodes[j].nodeName==("example"+e) && cols[i].childNodes[j].childNodes.length)
cvDOM.push(cols[i].childNodes[j].childNodes[0].nodeValue);
cvDOM.push("</td>");
}
cvDOM.push("</tr>");
}
cvDOM.push("</tbody></table></div>");
cvDOM.push("<button onclick=contactView.onClickImportMapping("+cols.length+",'"+owner+"','"+xml.getElementsByTagName("filename")[0].childNodes[0].nodeValue+"','"+groups+"') style='margin:5px 10px;'>Accept</button>");
cvDOM.push("<button onclick=contactView.load(false) style='margin:5px 10px;'>Cancel</button>");
document.getElementById("contentDiv").innerHTML=cvDOM.join('');
}
ContactView.prototype.onClickImportMapping=function(cols,owner,filename,groups) {
var used=new Array();
var xmlOutput=new Array();
for (var i=0;i<cols;i++) {
curField=document.getElementById("field_"+i);
selected=curField.selectedIndex;
if (used[selected]!=undefined && selected!=0) { 
for (var j=0;j<cols;j++)  
document.getElementById("field_"+j).parentNode.className="";
curField.parentNode.className="redOutline";
document.getElementById("field_"+used[selected]).parentNode.className="redOutline";
alert ("You can not import two values into the same field.");
return;
}
else {
used[selected]=i;
xmlOutput.push("<column>"+((selected>0)?curField.options[selected].value:"")+"</column>");
}
}
commands.contacts_ImportMappedCSV(owner, xmlOutput.join(" "),filename,groups,"handlers.contacts_ImportMappedCSV()");
}
ContactView.prototype.displayMappedContacts=function(data) {
root.GridCache.clear();
dataCache.loadSimpleClickCache();
cvDOM=new Array();
cvDOM.push("<div id=listViewScrollTable  style='margin-top:10px;'>");
cvDOM.push("<table padding=1 class='sortable' id='listViewTable'><tbody id='listViewTableTBody'><tr><th>Imported Contacts</th></tr>");
var cols=data.getElementsByTagName("name");
for (var i=0;i<cols.length;i++) 
if (cols[i].firstChild)
cvDOM.push("<tr><td>"+cols[i].firstChild.nodeValue+"</td></tr>");
cvDOM.push("</table>");
cvDOM.push("<button onclick=contactView.load(false) style='margin:5px 10px;'>OK</button>");
document.getElementById("contentDiv").innerHTML=cvDOM.join('');
}
ContactView.prototype.createUserDefinedFields=function() {
var user=user_prefs.user_name;
var udfUser=document.getElementById('udfUser');
if (udfUser && udfUser!=undefined && udfUser.selectedIndex==1) {
user="enterprise";
}
contactView.toggleDropDown("disabled");
cvDOM=new Array();
cvDOM.push("<div id=userDefinedDiv><div style='margin-top:20px;margin-left:40px;margin-bottom:20px;'>");
if (top.ApplicationOldContacts.hasEnterprise && top.SimpleClickDataCache.canAddEnterpriseGroups()) {
cvDOM.push("<div style='margin-top:20px;margin-left:40px;margin-bottom:20px;'>");
cvDOM.push("<select id='udfUser' onchange='contactView.createUserDefinedFields()'>");
cvDOM.push("<option>My Fields</option>");
cvDOM.push("<option "+((user=="enterprise")?"selected":"")+">Enterprise Fields</option>");
cvDOM.push("</select></div>");
}
cvDOM.push("<span style='margin-right:5px;'>New Field:</span>");
cvDOM.push("<input type=text id=udfText style='width:200px;margin-right:5px;'>");
cvDOM.push("<button id='addUDF' onclick=contactView.onClickAddUDF(event,'"+user+"')>Add</button></div>");
cvDOM.push("<fieldset style='margin:10px 40px;padding-top:15px;width:40%'><legend>Custom Fields</legend>");
cvDOM.push("<table id=UDFViewTable style='width:100%;font-size:11px;margin:5px;'><tbody id=UDFViewTbody>");
commands.udfs_GetUDFs(user, "handlers.udfs_GetUDFs('"+user+"')");
}
ContactView.prototype.UDFLoadData=function(user,data) {
if (data.getElementsByTagName("udfs")[0].childNodes[0]) {
var udfFields=data.getElementsByTagName("udfs")[0].childNodes[0].nodeValue.split(",");
for (var i=0; i<udfFields.length; i++) {
cvDOM.push("<tr><td>"+htmlEncode(unescape(udfFields[i]))+"</td>");
cvDOM.push("<td><span><img src='"+GUI_ROOT+"spacer.gif' class='ico-edit' title='Rename' style='cursor:hand;cursor:pointer;' onclick=contactView.onClickRenameUDFs(event) id='editbutton_"+htmlEncode(udfFields[i])+"'> <img src='"+GUI_ROOT+"spacer.gif' class='ico-delete' title='Delete' style='cursor:hand;cursor:pointer;' onclick=contactView.onClickDeleteUDF(event,'"+user+"') id='"+htmlEncode(udfFields[i])+"'></span>");
cvDOM.push("<span style='display:none'><button id='oldfield_"+htmlEncode(udfFields[i])+"' onclick='this.disabled=false;contactView.onClickRenameUDF(event,\""+user+"\")'>Save</button> <button id='cancel_"+htmlEncode(udfFields[i])+"' onclick='contactView.onClickCancelUDF(event)'>Cancel</button></span></td></tr>");
}
} else {
cvDOM.push("<tr><td colspan=2>There are no custom fields defined.</td></tr>");
}
cvDOM.push("</tbody></table>");
contactView.togglePreviewPane("hidden");
document.getElementById("contentDiv").innerHTML=cvDOM.join('');
}
ContactView.prototype.onClickRenameUDFs=function(event) {
if (!event) { event=window.event; }
cb.currentTarget(event).parentNode.parentNode.parentNode.firstChild.innerHTML="<input type=text id='newfield_"+cb.currentTarget(event).id.split("_")[1]+"' value='"+unescape(cb.currentTarget(event).id.split("_")[1])+"'>";
cb.currentTarget(event).parentNode.style.display="none";
cb.currentTarget(event).parentNode.parentNode.childNodes[1].style.display="";
}
ContactView.prototype.onClickCancelUDF=function(event) {
if (!event) { event=window.event; }
contactView.createUserDefinedFields();
}
ContactView.prototype.deleteUDFs=function(data) {
var viewUDFTBody=document.getElementById("UDFViewTbody");
var udfField=htmlEncode(unescape(data.getElementsByTagName("udfs")[0].childNodes[0].nodeValue));
for (var i=0; i<viewUDFTBody.childNodes.length; i++) {
if (udfField==viewUDFTBody.childNodes[i].childNodes[0].innerHTML)
viewUDFTBody.removeChild(viewUDFTBody.childNodes[i]);
}
if (viewUDFTBody.childNodes.length==0) {
var trow=viewUDFTBody.appendChild(document.createElement("tr"));
var tcol=trow.appendChild(document.createElement("td"));
tcol.innerHTML="There are no custom fields defined.";
}
contactView.removeDisplayFieldFromCookie(user_prefs.user_name, udfField);
}
ContactView.prototype.onClickAddUDF=function(event, owner) {
if (!event) { event=window.event; }
var udfVal=document.getElementById("udfText").value;
var viewUDFTBody=document.getElementById("UDFViewTbody");
for (var i=0; i<viewUDFTBody.childNodes.length; i++) {
if (viewUDFTBody.childNodes[i].firstChild.innerHTML==udfVal) {
alert("Field name already exists");
return true;
}
}
document.getElementById("addUDF").disabled=true;
commands.udfs_CreateUDFs(htmlEncode(escape(document.getElementById("udfText").value)),owner,"handlers.udfs_CreateUDFs('"+owner+"')");
}
ContactView.prototype.onClickDeleteUDF=function(event,owner) {
if (!event) { event=window.event; }
var fieldName=cb.currentTarget(event).id;
commands.udfs_DeleteUDFs(fieldName,owner,"handlers.udfs_DeleteUDFs('"+owner+"')");
}
ContactView.prototype.onClickRenameUDF=function(event,user) {
if (!event) { event=window.event; }
var oldFieldName=unescape(cb.currentTarget(event).id.split("_")[1]);
var newFieldName=document.getElementById("newfield_"+cb.currentTarget(event).id.split("_")[1]).value;
var viewUDFTBody=document.getElementById("UDFViewTbody");
for (var i=0; i<viewUDFTBody.childNodes.length; i++) {
if (viewUDFTBody.childNodes[i].firstChild.innerHTML==newFieldName) {
alert("Field name already exists");
return true;
}
}
commands.udfs_RenameUDFs(htmlEncode(escape(oldFieldName)),htmlEncode(escape(newFieldName)),user,"handlers.udfs_RenameUDFs('"+user+"')");
}
ContactView.prototype.togglePreviewPane=function(displayProp) {
var contactView1=document.getElementById("listView");
if (contactView1!=undefined) {
var hsplitter=document.getElementById("hsplitter");
var contactPreview=document.getElementById("contactPreview");
var scrollTableDiv=document.getElementById("listViewScrollTable");
if (displayProp=='display' && cb.currentStyle(contactPreview,'display')=='block') return;
var height=cb.getBrowserHeight();
contactView1.style.height=(displayProp=='display')? ((height>800) ? (height*.35) : (height * .5)) : "100%";
hsplitter.style.display=(displayProp=='display')? "block" : "none";
contactPreview.style.display=(displayProp=='display')? "block" : "none";
contactPreview.style.height=cb.getBrowserHeight()-contactView1.offsetHeight-hsplitter.offsetHeight;
if (scrollTableDiv) {
var previewPaneHeight=(displayProp=='display')? hsplitter.offsetHeight+contactPreview.offsetHeight : 0;
scrollTableDiv.style.height=cb.getBrowserHeight()-document.getElementById("contactViewHeader1").offsetHeight-document.getElementById("contactFilter").offsetHeight-document.getElementById("menubar-container").offsetHeight-previewPaneHeight;
}
}
else {
;
}
}
ContactView.prototype.toggleDropDown=function(displayVal) {
var dropDown=document.getElementById("menubar_pageSelector")
if (dropDown!=undefined) {
if (displayVal=="disabled") {
while (dropDown.firstChild) dropDown.removeChild(dropDown.firstChild);
var selectItem=cb.createElement("option","","","width:60px",""," ");
dropDown.appendChild(selectItem);
}
if (document.getElementById("page_forward")) {
document.getElementById("page_forward").style.display=(displayVal=="disabled")? "none" : "block";
document.getElementById("page_back").style.display=(displayVal=="disabled")? "none" : "block";
}
}
}
ContactView.prototype.getCurrentSelection=function() {
var contactIds=new Array();
for (var i=0; i<this.currentSelection.length; i++) contactIds.push(this.currentSelection[i].id);
return contactIds;
}
ContactView.prototype.getCurrentUserName=function() { return (this.currentContactType=="enterprise")? ENTERPRISE_NAME : (this.currentContactType=="personal")? user_prefs.user_name : this.currentContactUserName; }
ContactView.prototype.getListViewTableWidth=function() {
var listViewDiv=document.getElementById("listView");
return (listViewDiv.offsetWidth-30)/(this.currentFields.length-2)
}
ContactView.prototype.onClickContact=function(event) {
if(!event) { event=window.event; }
if (contactPreview.isLoading) return;
contactPreview.isLoading=(!event.ctrlKey && !event.shiftKey); 
event.cancelBubble=true;
this.firstLoad=false;
if (contactView.currentSelection.length!=0 && !event.ctrlKey && !event.shiftKey) {
for (var i=0; i<this.currentSelection.length; i++) {
if (this.currentSelection[i]) this.currentSelection[i].className=this.currentColor[i];
}
this.currentSelection=new Array();
this.currentColor=new Array();
}
var element=(cb.currentTarget(event).id=='vcardicon' && cb.isIE())? cb.getElement(cb.getElement(cb.currentTarget(event)))  : cb.getElement(cb.currentTarget(event));
if (event.ctrlKey || (event.shiftKey && this.currentSelection.length==0)) {
var done=false;
for (var i=0; !done && i<this.currentSelection.length; i++) {
if (this.currentSelection[i]==element)  {
element.className=this.currentColor[i];
this.currentSelection.splice(i,1);
this.currentColor.splice(i,1);
done=true;
}
}
if (!done) {
this.currentSelection.push(element);
this.currentColor.push(element.className);
element.className="hilite hiliteRow";
}
} else if (event.shiftKey) {
var startElement=this.currentSelection[this.currentSelection.length-1].id;
var endElement=element.id;
var listViewTBody=document.getElementById("listViewTableTBody");
var foundFirst=false;
var foundLast=false;
for (var i=0; !foundLast && i<listViewTBody.childNodes.length; i++) {
var cur=listViewTBody.childNodes[i];
foundLast=(foundFirst && (cur.id==startElement || cur.id==endElement))
foundFirst=(foundFirst || (cur.id==startElement || cur.id==endElement))
if (foundFirst && cur.className!="hilite hiliteRow") {
this.currentSelection.push(cur);
this.currentColor.push(cur.className);
cur.className="hilite hiliteRow";
}
}
} else {
this.currentSelection.push(element);
this.currentColor.push(element.className);
this.currentSelection[this.currentSelection.length-1].className="hilite hiliteRow";
}
if (!event.ctrlKey && !event.shiftKey) {
commands.contacts_GetContact(this.currentSelection[0].id, "handlers.contacts_GetContact()");
contactView.togglePreviewPane((prefsObject.previewStatus.toLowerCase()=="on")? "display" : "hidden");
}
toggleGrayedItem("selectContactsMenu","active");
}
ContactView.prototype.checkDeletePermissions=function() {
if (this.currentContactType=="personal") return true;
if (this.currentContactType=='enterprise'  && this.currentDir=='') return (dataCache.enterpriseAllAccess=="f");
return dataCache.hasAccess(this.currentDir,'f');
}
ContactView.prototype.onClickDelete=function() {
var confirmMessage=(this.currentSelection.length==1)? "Are you sure you want to permanently delete this contact?" : "Are you sure you want to permanently delete these contacts?";
if (this.currentSelection) {
if (this.currentSelection.length==0) {
alert("No contact selected");
} else if (!contactView.checkDeletePermissions()) {
(this.currentSelection.length==1)? alert("You do not have access to delete this contact.") : alert("You do not have access to delete one or more of these contacts.");
} else if (confirm(confirmMessage)) {
var contactUuids=new Array();
for (var i=0; i<this.currentSelection.length; i++) contactUuids.push(this.currentSelection[i].id);
contactView.currentSelection=new Array();
contactView.togglePreviewPane("hidden");
contactView.loadSearchWaiting();
commands.contacts_DeleteContact(contactUuids, "handlers.contacts_DeleteContact()");
}
}
window.parent.ExtensionBannerAds.refreshAll();
}
ContactView.prototype.onClickExport=function(event) {
if (!document.getElementById("exportCSVRadio").checked  &&
!document.getElementById("exportVCFRadio").checked &&
!document.getElementById("exportCCRadio").checked) {
alert("Please choose an export format");
return;
}
var uuidList=new Array();
var contactItems=new Array("contact","econtact","scontact");
var contactNames=new Array("personal","enterprise","shared");
var selected=false;
for (var i=0; i<resources.contactTypes.length; i++) {
if (resources.contactTypes[i]!='personal' && !user_prefs.access_contact_sharing=='True') continue;
if (document.getElementById(resources.contactTypes[i]+"_checkbox").checked==true) {
uuidList.push(contactNames[i]);
selected=true;
}
}
if (!selected) {
alert("Please select which contacts you would like to export");
return;
}
if (document.getElementById("exportCSVRadio").checked==true) commands.contacts_ExportContacts('CSV',uuidList);
else if (document.getElementById("exportVCFRadio").checked==true) commands.contacts_ExportContacts('VCF',uuidList);
else if (document.getElementById("exportCCRadio").checked==true) commands.contacts_ExportContacts('CC',uuidList);
}
ContactView.prototype.onClickExportType=function(event) {
var vcardTextElement=document.getElementById("vcardTextElement");
var numElements=0;
var contactItems=new Array("contact","econtact","scontact");
for (var i=0; i<resources.contactTypes.length; i++) {
if (resources.contactTypes[i]!='personal' && !user_prefs.access_contact_sharing=='True') continue;
if (document.getElementById(resources.contactTypes[i]+"_checkbox").checked==true) numElements+=dataCache.getContactsByType(contactItems[i]).length;
}
vcardTextElement.innerHTML=(numElements==0)? " vCard(s) (zipped)" : (numElements==1)? " 1 vCard" : " "+numElements+" vCards (zipped)";
}
ContactView.prototype.onClickManageSharing=function() {
popShare(document.getElementById("groupSharingSelect").options[document.getElementById("groupSharingSelect").selectedIndex].id);
}
ContactView.prototype.onClickModify=function(event) {
var groupId=cb.currentTarget(event).id.split("-")[1];
popShare(groupId);
}
ContactView.prototype.onClickUnshare=function(obj) {
var groupId=obj.id.split("-")[1];
if (confirm('Are you sure you want to stop sharing this group?')) {
shareCommands++;
commands.shares_RevokeShare(ContactView.shareRecipients[groupId],groupId,"handlers.shares_RevokeShare(true)");
this.createManageSharing();
}
}
ContactView.prototype.onClickSeeRecipients=function(event, groupUuid) {
if(!event) { event=window.event; }
var recipientElement=document.getElementById(groupUuid+"-recipientsList");
recipientElement.style.display=(cb.currentStyle(recipientElement,"display")=="none")? "block" : "none";
document.getElementById(groupUuid+"-recipientsArrow").className=(cb.currentStyle(recipientElement,"display")=="none")? "b-arrow-right" : "b-arrow-down";
}
ContactView.prototype.onDblClickContact=function(event) {
if(!event) { event=window.event; }
var element=(cb.currentTarget(event).id=='vcardicon' && cb.isIE())? cb.getElement(cb.getElement(cb.currentTarget(event)))  : cb.getElement(cb.currentTarget(event));
popContact(element.id);
}
ContactView.prototype.onDblClickContactCard=function(event) {
if(!event) { event=window.event; }
var myEvent=cb.currentTarget(event);
while (myEvent.className!="cardView") myEvent=myEvent.parentNode;
popContact(myEvent.id);
}
ContactView.prototype.onClickContactFilter=function(event) {
window.parent.ExtensionBannerAds.refreshAll();
if(!event) { event=window.event; }
if (document.getElementById(cb.currentTarget(event).id).className!="alphaButtons hilite") {
labelRowCounter=0;
var currentSort=this.currentSortString;
contactView.defaultView();
this.currentSortString=currentSort;
document.getElementById(this.currentFilter).className="alphaButtons";
this.refreshDD=true;
this.currentFilter=cb.currentTarget(event).id;
cb.currentTarget(event).className="alphaButtons hilite";
contactView.load(false);
}
}
ContactView.prototype.onClickPageChange=function(event) {
if(!event) { event=window.event; }
var startEndArray=cb.currentTarget(event).options[cb.currentTarget(event).selectedIndex].id.split("_");
contactView.currentMin=(contactView.sortOrderClass=="sortedDown")? startEndArray[0] : startEndArray[1];
contactView.currentMax=(contactView.sortOrderClass=="sortedDown")? startEndArray[1] : startEndArray[0];
contactView.load(false);
}
ContactView.prototype.onClickPageChangeArrowForward=function(event) {
if(!event) { event=window.event; }
var dropDown=document.getElementById("menubar_pageSelector");
if (dropDown.selectedIndex!=dropDown.childNodes.length-1) {
dropDown.selectedIndex=dropDown.selectedIndex+1;
var startEndArray=dropDown.options[dropDown.selectedIndex].id.split("_");
this.currentMin=(this.sortOrderClass=="sortedDown")? startEndArray[0] : startEndArray[1];
this.currentMax=(this.sortOrderClass=="sortedDown")? startEndArray[1] : startEndArray[0];
document.getElementById("page_forward").style.display="block";
document.getElementById("page_back").style.display="block";
contactView.load(false);
}
}
ContactView.prototype.onClickPageChangeArrowBack=function(event) {
if(!event) { event=window.event; }
var dropDown=document.getElementById("menubar_pageSelector");
if (dropDown.selectedIndex!=0) {
dropDown.selectedIndex=dropDown.selectedIndex-1;
var startEndArray=dropDown.options[dropDown.selectedIndex].id.split("_");
this.currentMin=(this.sortOrderClass=="sortedDown")? startEndArray[0] : startEndArray[1];
this.currentMax=(this.sortOrderClass=="sortedDown")? startEndArray[1] : startEndArray[0];
document.getElementById("page_forward").style.display="block";
document.getElementById("page_back").style.display="block";
contactView.load(false);
}
}
ContactView.prototype.onClickRemoveShareWith=function(event) {
if(!event) { event=window.event; }
if (confirm("Are you sure you want to remove this shared group from your contacts?")) {
var groupUuid=cb.currentTarget(event).id.split("-")[0];
commands.shares_RevokedShare("handlers.shares_RevokedShare('"+groupUuid+"')",groupUuid);
}
}
ContactView.prototype.onClickHeader=function(event) {
if(!event) { event=window.event; }
var sortedDown=(cb.currentTarget(event).className=="sortedDownHover" || cb.currentTarget(event).className=="sortedDown");
this.sortOrderClass=(sortedDown && this.currentSortString==cb.currentTarget(event).id)? "sortedUp" : "sortedDown";
cb.currentTarget(event).className=(sortedDown)? "sortedUp" : "sortedDown";
var tempMax=this.currentMax;
this.currentMax=(sortedDown)? Math.min(tempMax,this.currentMin) : Math.max(tempMax,this.currentMin);
this.currentMin=(sortedDown)? Math.max(tempMax,this.currentMin) : Math.min(tempMax,this.currentMin);
this.currentSortString=cb.currentTarget(event).id;
if (this.currentSelectedCol && this.currentSelectedCol!=cb.currentTarget(event)) this.currentSelectedCol.className="noclass";
this.currentSelectedCol=cb.currentTarget(event);
contactView.load(false);
window.parent.ExtensionBannerAds.refreshAll();
}
ContactView.prototype.onClickImport=function(event) {
currentWindow=window.open ("../common/upload.html?unm="+user_prefs.user_name+"&sid="+user_prefs.session_id,"Upload","resizable=yes,status=no,height=500,width=700,screenX=150,left=150,screenY=300,left=300");
}
ContactView.prototype.onClickSendEmail=function(event) {
if(!event) { event=window.event; }
var email=dataCache.findUser(cb.currentTarget(event).id.split("-")[1]).email;
root.openSendEmail(email,"");
}
ContactView.prototype.onClickUploadPicture=function(event) {
if (!event) { event=window.event; }
var uuid=cb.currentTarget(event).id.split("-")[1];
mywindow=window.open("contactsMedia.html?unm="+user_prefs.user_name+"&sid="+user_prefs.session_id+"&uuid="+uuid+"&type=PHOTO&source=card" ,"mediaWindow","resizable=yes,height=300,width=400,left=150,top=300,status=no");
}
ContactView.prototype.onKeyDownSearch=function(event) {
if(!event) { event=window.event; }
if (event.keyCode==13 && cb.currentTarget(event).value!="") {
if (!document.getElementById("listViewTable") && !document.getElementById("cardViewTable")) alert("You must be viewing contacts to search");
else {
cb.currentTarget(event).blur();
contactView.defaultView();
this.currentSearch=cb.currentTarget(event).value;
this.refreshDD=true;
document.getElementById(this.currentFilter).className="alphaButtons";
contactView.load(false);
window.parent.ExtensionBannerAds.refreshAll();
}
}
}
ContactView.prototype.shadowBox=function() {
var myDiv=cb.createElement("div","shadowBox","shadowBox","position:absolute;top:0;left:0;z-index:1000;height:0px;width:0px;");
myDiv.style.height=cb.getBrowserHeight() - document.getElementById("contactPreview").offsetHeight+"px";
myDiv.style.width=cb.getBrowserWidth()+"px";
self.document.body.appendChild(myDiv);
}
ContactView.prototype.unShadowBox=function() {
var sb=document.getElementById("shadowBox");
if (sb)
self.document.body.removeChild(sb);
}
ContactView.prototype.isShadowBoxed=function() {
return document.getElementById("shadowBox");
}
ContactView.prototype.onKeyDownSelectAll=function(event) {
if(!event) { event=window.event; }
if (event.ctrlKey && event.keyCode==65) {
if(event.preventDefault) event.preventDefault();
event.cancelBubble=true;
contactView.selectAll();
return false;
} else if (event.keyCode==40 || event.keyCode==38) {
if (this.currentSelection.length==0) return;
var lastCol=document.getElementById(this.currentSelection[this.currentSelection.length-1].id);
if (!lastCol || (event.keyCode==40 && !lastCol.nextSibling) || (event.keyCode==38 && lastCol.previousSibling.id=="")) return;
contactPreview.isLoading=true;
var nextCol=(event.keyCode==40)? lastCol.nextSibling : lastCol.previousSibling;
for (var i=0; i<this.currentSelection.length; i++) {
if (this.currentSelection[i]) this.currentSelection[i].className=this.currentColor[i];
}
this.currentSelection=new Array();
this.currentColor=new Array();
this.currentSelection.push(nextCol);
this.currentColor.push(nextCol.className);
this.currentSelection[this.currentSelection.length-1].className="hilite hiliteRow";
commands.contacts_GetContact(this.currentSelection[0].id, "handlers.contacts_GetContact()");
if (event.keyCode==40) document.getElementById("listViewScrollTable").scrollTop=document.getElementById("listViewScrollTable").scrollTop+((cb.isIE())? 1 : 22);
else document.getElementById("listViewScrollTable").scrollTop=document.getElementById("listViewScrollTable").scrollTop - ((cb.isIE())? 1 : 22);
}
return true;
}
ContactView.prototype.onClickSaveContacts=function() {
if (this.currentSelection.length!=0) {
var uuidList=new Array();
for (var i=0; i<this.currentSelection.length; i++) uuidList.push(this.currentSelection[i].id);
commands.contacts_ExportContacts("VCF",uuidList);
} else alert("No contacts selected");
}
ContactView.prototype.selectAll=function() {
var listViewTBody=document.getElementById("listViewTableTBody");
for (var i=0; i<this.currentSelection.length; i++) {
this.currentSelection[i].className=this.currentColor[i];
}
this.currentSelection=new Array();
this.currentColor=new Array();
for (var i=1; i<listViewTBody.childNodes.length; i++) {
this.currentSelection.push(listViewTBody.childNodes[i]);
this.currentColor.push(listViewTBody.childNodes[i].className);
this.currentSelection[this.currentSelection.length-1].className="hilite hiliteRow";
}
}
ContactView.prototype.onMouseDownContact=function(event) {
if(!event) { event=window.event; }
if (!cb.isIE()) event.preventDefault();
return false;
}
ContactView.prototype.onMouseOverContactFilter=function(event) {
if(!event) { event=window.event; }
cb.currentTarget(event).className="alphaButtons hilite";
}
ContactView.prototype.onMouseOverHeader=function(event) {
if(!event) { event=window.event; }
if (cb.currentTarget(event).className=="sortedUp") cb.currentTarget(event).className="sortedUpHover";
else if (cb.currentTarget(event).className=="sortedDown") cb.currentTarget(event).className="sortedDownHover";
else cb.currentTarget(event).className="hover";	
}
ContactView.prototype.onMouseOutContactFilter=function(event) {
if(!event) { event=window.event; }
if (cb.currentTarget(event).id!=currentFilter) cb.currentTarget(event).className="alphaButtons";
}
ContactView.prototype.onMouseOutHeader=function(event) {
if(!event) { event=window.event; }
if (cb.currentTarget(event).className=="sortedUp" || cb.currentTarget(event).className=="sortedUpHover") cb.currentTarget(event).className="sortedUp";
else if (cb.currentTarget(event).className=="sortedDown" || cb.currentTarget(event).className=="sortedDownHover") cb.currentTarget(event).className="sortedDown";
else cb.currentTarget(event).className="noclass";
}
ContactView.prototype.onClickPrint=function() {
if (!document.getElementById("listViewTable") && !document.getElementById("cardViewTable")) alert("You must be viewing contacts to print");
else {
appName="contacts"
printFunction="GetListViewData" ;
window.open("contactsPrintPreview.html?data=window.opener.GetListViewData()","PrintPreview","resizable=yes,height=800,width=700,scrollbars=1");
}
}
ContactView.prototype.checkRadio=function(event) {
}
function GetListViewData(div) {
if (contactView.currentView=='gridView') {
var listViewCopy=document.getElementById("listViewTable").cloneNode(true);
for (var i=0; i<listViewCopy.firstChild.firstChild.childNodes.length; i++)
listViewCopy.firstChild.firstChild.childNodes[i].className="";
var listViewTBody=listViewCopy.firstChild;
for (var i=1; i<listViewTBody.childNodes.length; i++)
listViewTBody.childNodes[i].className=((i-1) % 2==0)? "row" : "altrow";
div.innerHTML="<table class=sortable width=100% cellspacing=0 cellpadding=0>"+listViewCopy.innerHTML+"</table>";
} else if (contactView.currentView=='cardView') {
var cvCopy=document.getElementById("cardViewTable").cloneNode(true);
var allDivs=cvCopy.getElementsByTagName("div");
for (var i=0; i< allDivs.length; i++) {
if (allDivs[i].className=="cardView") allDivs[i].className="cardView_print";
}
div.innerHTML="<table width=100% id=cardViewTable style='border-top:#bbb solid 1px;'>"+cvCopy.innerHTML+"</table>";
}
}
function resizeHorizontal(event) {resizeElement("horizontal",event);}
function resizeElement(direction, event) {
if (!event) event=window.event;
draggingObject=cb.currentTarget(event);
if (draggingObject) {
cb.addEventListener(document,"mousemove",onMouseMoveHorizontal);
cb.addEventListener(document,"mouseup",onMouseUpHorizontal);
}
}
function onMouseMoveHorizontal(event) {
xPos=cb.clientX(event);
yPos=cb.clientY(event);
document.body.onselectstart=function () { return false }
var listViewDiv=document.getElementById("listView");
var scrollTableDiv=document.getElementById("listViewScrollTable");
if (yPos > 108 && yPos < (cb.getBrowserHeight()-10)) {
var hsplitter=document.getElementById("hsplitter");
var previewPaneDiv=document.getElementById("contactPreview");
listViewDiv.style.height=yPos;
hsplitter.style.top=yPos+1;
previewPaneDiv.style.top=yPos+hsplitter.offsetHeight;
previewPaneDiv.style.height=cb.getBrowserHeight()-listViewDiv.offsetHeight-hsplitter.offsetHeight;
scrollTableDiv.style.height=cb.getBrowserHeight()-hsplitter.offsetHeight-previewPaneDiv.offsetHeight-document.getElementById("contactViewHeader1").offsetHeight-document.getElementById("contactFilter").offsetHeight-document.getElementById("menubar-container").offsetHeight;
}
}
function onMouseUpHorizontal(event) {onMouseMoveUp("horizontal",event);}
function onMouseMoveUp(direction, event) { 
if (!event) event=window.event;
document.body.onselectstart=function () { return true }
draggingObject.style.visibility="visible";
cb.removeEventListener(document,"mousemove",onMouseMoveHorizontal)
cb.removeEventListener(document,"mouseup",onMouseUpHorizontal)
}
function Group(type) {
var groupAttr=new Array('name','uuid','sharer','access','type','inherited','contacts');
for (var i=0; i<groupAttr.length; i++)
this[groupAttr[i]]=(groupAttr[i]=='type')? type : (groupAttr[i]=='contacts')? new Array() : null;
}
function SCContact(type) {
var contactAttr=new Array('name','uuid','username','email','type','groups','sharer');
for (var i=0; i<contactAttr.length; i++)
this[contactAttr[i]]=(contactAttr[i]=='type')? type : null;	
}
function Share() {
var shareAttr=new Array('sharer','shareUuids','shareDisplayNames');
for (var i=0;i<shareAttr.length;i++)
this[shareAttr[i]]=(shareAttr[i]=='sharer')? null : new Array();
}
function AppAccess() {
var accessAttr=new Array('email','calendar','im','fileCabinet','myDay','secureSend','calendarSharing','contactsSharing','fileCabinetSharing');
for (var i=0;i<accessAttr.length;i++) this[accessAttr[i]]=true;
}
function SnapShot() { this.type,this.date,this.description,this.people; }
function XMLHttpObject() { this.index,this.status,this.xmlhttp,this.handler,this.data; }
function editPageDropDown(numOfRecords) {
var dropDown=document.getElementById("menubar_pageSelector");
var numberOfPages=numOfRecords / contactView.currentDisplayCount;
if (numberOfPages==0) {
while (dropDown.firstChild) dropDown.removeChild(dropDown.firstChild);
var selectedValue=0;
var selectItem=cb.createElement("option", "0_0" ,"","","","0 - 0");
dropDown.appendChild(selectItem);
} else {
contactView.selectedValue=dropDown.options.selectedIndex;
while (dropDown.firstChild) dropDown.removeChild(dropDown.firstChild);
for (var i=0; i<numberOfPages; i++) {
var startIndex=i*contactView.currentDisplayCount+1;
var endIndex=(startIndex+(contactView.currentDisplayCount-1) < numOfRecords)? startIndex+(contactView.currentDisplayCount-1) : numOfRecords;
var selectItem=cb.createElement("option",startIndex+"_"+endIndex,"","","",startIndex+" - "+endIndex);
dropDown.appendChild(selectItem);
}
if (contactView.selectedValue <=numberOfPages)
dropDown.selectedIndex=contactView.selectedValue;
else
dropDown.selectedIndex=0;
}
if (dropDown.i_watch==undefined) {
cb.addEventListener(dropDown,'change',contactView.onClickPageChange);
dropDown.i_watch=true;
}
}
function onMouseDownButton(event) {
if(!event) { event=window.event; }
(event.preventDefault)? event.preventDefault() : event.returnValue=false;
var currentEvent=cb.currentTarget(event);
while (currentEvent.id!="topLevelMenuItem" && currentEvent.nodeName!='BODY') currentEvent=currentEvent.parentNode;
currentEvent.className="btnavactive";
}
function onMouseUpButton(event) {
if(!event) { event=window.event; }
var currentEvent=cb.currentTarget(event);
while (currentEvent.id!="topLevelMenuItem" && currentEvent.nodeName!='BODY') currentEvent=currentEvent.parentNode;
currentEvent.className="btnav";
}
function onMouseOverButton(event) {
if(!event) event=window.event;
var currentEvent=cb.currentTarget(event);
while (currentEvent.id!="topLevelMenuItem" && currentEvent.nodeName!='BODY') currentEvent=currentEvent.parentNode;
currentEvent.className="btnavhover";
currentEvent.style.cursor="hand";
currentEvent.style.cursor="pointer";
}
function onMouseOutButton(event) {
if(!event) { event=window.event; }
var currentEvent=cb.currentTarget(event);
while (currentEvent.id!="topLevelMenuItem" && currentEvent.nodeName!='BODY') currentEvent=currentEvent.parentNode;
currentEvent.className="btnav";
}
function handle_new_button(event) {
if(getMouseX(event) < _getBoundingClientRect(document.getElementById("new_drop_cell")).left)
newMenu_contact('personal');
else onclick_New(event);
}
function handle_view_button(event) {
if(getMouseX(event) < _getBoundingClientRect(document.getElementById("view_drop_cell")).left)
onclick_View(event);
else onclick_View(event);
}
function handle_actions_button(event) {
if(getMouseX(event) < _getBoundingClientRect(document.getElementById("actions_drop_cell")).left) {
onclick_Action(event);
} else {
onclick_Action(event);
}
}
function Resources() {
this.contactFields=new Array();					
var tags=new Array("OVERVIEW","DETAILED");
var fullNames=new Array("General","Full Name","Name Prefix","First Name","Middle Name","Last Name","Name Suffix","Company","Division","Subdivision","Job Title","Display Name",
"Address","Work Address Label","Work Address 1","Work Address 2","Work City","Work State / Province","Work Postal Code","Work Country","Home Address Label","Home Address 1","Home Address 2","Home City","Home State / Province","Home Postal Code",
"Home Country","Internet","Website","Free/Busy URL","Email / IM","Work Email","Home Email","Work IM","Home IM","Phone","Work Phone","Work Phone 2","Home Phone","Home Phone 2","Mobile Phone",
"Mobile 2","Work Fax","Home Fax","Other","Birthday","Anniversary","Spouse","Gender","Nickname","Time Zone","Assistant's Name","Assistant's Email","Assistant's Phone",
"Notes","Created","Last Modified");
var names=new Array("General","Name","Prefix","First Name","Middle Name","Last Name","Suffix","Company","Division","Subdivision","Title","Display Name",
"Address","Work","Work Address 1","Work Address 2","Work City","Work State / Province","Work Postal Code","Work Country","Home","Home Address 1","Home Address 2","Home City","Home State / Province","Home Postal Code",
"Home Country","Internet","Website","Free/Busy URL","Email / IM","Work Email","Home Email","Work IM","Home IM","Phone","Work","Work 2","Home","Home 2","Mobile",
"Mobile 2","Work Fax","Home Fax","Other","Birthday","Anniversary","Spouse","Gender","Nickname","Time Zone","Assistant's Name","Assistant's Email","Assistant's Phone",
"Notes","Created","Last Modified");
var ids=new Array("HEADER_NAME","FN","N-PREFIX","N-GIVEN","N-MIDDLE","N-FAMILY","N-SUFFIX","ORG-COMPANY","ORG-DIVISION","ORG-SUBDIVISION","JOBTITLE","DISPLAYNAME","HEADER_ADDRESS",
"LABEL-WORK","ADR-WORK-STREET","ADR-WORK-POBOX","ADR-WORK-LOCALITY","ADR-WORK-REGION","ADR-WORK-PCODE","ADR-WORK-CTRY","LABEL-HOME","ADR-HOME-STREET","ADR-HOME-POBOX",
"ADR-HOME-LOCALITY","ADR-HOME-REGION","ADR-HOME-PCODE","ADR-HOME-CTRY","HEADER_INTERNET","URL","FBURL1","HEADER_EMAIL","EMAIL1","EMAIL2","IM","IM2",
"HEADER_PHONE","TEL-WORK-NUMBER1","TEL-WORK-NUMBER2","TEL-HOME-NUMBER1","TEL-HOME-NUMBER2","TEL-CELL-NUMBER1","TEL-CELL-NUMBER2","TEL-FAX-NUMBER1","HOMEFAX","HEADER_OTHER",
"BDAY","ANNIVERSARY","SPOUSE","GENDER","NICKNAME","TZ","AGENT-vCard-FN","AGENT-vCard-EMAIL1","AGENT-vCard-TEL-WORK-NUMBER1","NOTE","CREATEDBY","LASTMODBY");
var editable=new Array(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0);
var expandedViewOnly=new Array(0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
var tabs=new Array(0,0,1,1,1,1,1,0,1,1,0,0,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
this.fields=new Array();
for (var i=0;i<names.length;i++) {
var field=new Object;
field.label=names[i];
field.fullLabel=fullNames[i];
field.id=ids[i];
field.tab=tabs[i];
field.editable=editable[i];
field.header=(field.id.match(/HEADER_.*/)==null)?0:1;
this.fields.push(field);
}
for (var i=0;i<2;i++) {
var tabArray=new Array();
for (var j=0;j<tabs.length;j++) {
if (i==0 && tabs[j]==1) continue;
var idList=(ids[j]=="IM")? new Array(tags[i]+"_IM", tags[i]+"_IMTYPE") : (ids[j]=="IM2")? new Array(tags[i]+"_IM2", tags[i]+"_IMTYPE2") : new Array(tags[i]+"_"+ids[j]);
tabArray.push(new Array(names[j],idList,editable[j],expandedViewOnly[j]));
}
this.contactFields.push(tabArray);
}
this.contactFields.push(new Array());
this.contactFields.push(new Array());
this.quickLink_text=new Array("Send Email","Send Fax","Schedule Appt.","Send an IM", "Send a Gift", "Send Flowers");
this.tabNames=new Array("Overview","Detailed","Custom_Fields","History");
if (top.ApplicationOldContacts && top.ApplicationOldContacts.hasEnterprise) {
this.contactTypes=new Array("personal","enterprise","shared");
} else {
this.contactTypes=new Array("personal","shared");
}
this.errorMessages={}
var errorArray=new Array("GenericAction","GetAllContacts","GetContact","GetOrderedContactsForGrid","CreateContact","DeleteContact","UpdateContact", "AddContactsToGroup","RemoveContactsFromGroup","CreateGroup","DeleteGroup","RenameGroup","GetUDFList","CreateUDF","DeleteUDF","GetNotes","ReplaceNotes", "GetShares","ProposeShare","RevokeShare","RevokedShare","SharePermissions","CurrentlyOnline","PrepareAttachment","MarkAsPrivate","Search","SetEventState", "FieldAttachment","GetPreferences","ReplacePreferences","GetBuddyList","SetBuddyList","RenameUDF"); 
var errorMessageArray=new Array("in the application","retrieving your contacts","retrieving this contact","retrieving your contacts"," creating contact","removing contact","updating contact", "adding contact(s) to group","removing contact(s) from group","creating group","removing group","renaming group","retrieving custom fields","creating custom field","removing custom field", "retrieving notes","modifying notes","retrieving sharing information","creating share","removing share","removing share","modifying share permissions","retrieving currently online users", "attaching contacts","setting user privacy","searching your contacts","adding calendar event","opening attachment","retrieving preferences","setting preferences","retrieving currently online list","modifying currently online list", "renaming custom field");
for (var i=0;i<errorArray.length;i++)
this.errorMessages[errorArray[i]]="An error occurred"+((errorArray[i]=="GenericAction")? " " : " while ")+errorMessageArray[i]+". Please try again at another time.";
this.timeZones=new Array("","(GMT-12:00) Eniwetok, Kwajalein", "(GMT-11:00) Midway Island, Samoa, Apia", "(GMT-10:00) Hawaii", "(GMT-09:00) Alaska Time - Anchorage", "(GMT-08:00) Pacific Time (Los Angeles, Seattle, Vancouver, Tijuana)", "(GMT-07:00) Mountain Time (Denver, Salt Lake City)", "(GMT-07:00) Mountain Standard Time (Phoenix)", "(GMT-06:00) Central Time (Houston, Kansas City, Chicago)", "(GMT-06:00) Saskatchewan", "(GMT-06:00) Mexico City", "(GMT-06:00) Central America", "(GMT-05:00) Eastern Time (New York, Toronto)", "(GMT-05:00) Bogota, Lima, Quito", "(GMT-05:00) Eastern Standard Time (Indianapolis)", "(GMT-04:00) Atlantic Time (Canada)", "(GMT-04:00)Caracas, La Paz", "(GMT-04:00) Santiago", "(GMT-03:30) Newfoundland", "(GMT-03:00) Brasilia", "(GMT-03:00) Greenland", "(GMT-03:00) Buenos Aires, Georgetown", "(GMT-02:00) Mid-Atlantic", "(GMT-01:00) Azores", "(GMT-01:00) Cape Verde Is.", "(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", "(GMT) Casablanca, Monrovia", "(GMT+01:00) Sarajevo, Skopje, Sofija, Vilnius, Warsaw, Zagreb", "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", "(GMT+01:00) West Central Africa", "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", "(GMT+02:00) Jerusalem", "(GMT+02:00) Helsinki, Riga, Tallinn, Kiev", "(GMT+02:00) Athens, Istanbul, Minsk", "(GMT+02:00) Harare, Pretoria", "(GMT+02:00) Bucharest", "(GMT+02:00) Cairo, Alexandria", "(GMT+03:00) Nairobi", "(GMT+03:00) Moscow, St. Petersburg, Volgograd", "(GMT+03:00) Baghdad", "(GMT+03:00) Kuwait, Riyadh","(GMT+03:30) Tehran", "(GMT+04:00) Baku, Tbilisi, Yerevan", "(GMT+04:00) Abu Dhabi, Muscat", "(GMT+04:30) Kabul", "(GMT+05:00) Islamabad, Karachi, Tashkent", "(GMT+05:00) Ekaterinburg", "(GMT+05:30) Calcutta, Chennai, Mumbai, New Delhi", "(GMT+05:45) Kathmandu", "(GMT+06:00) Astana, Dhaka", "(GMT+06:00) Almaty, Novosibirsk", "(GMT+06:00) Sri Jayawardenepura", "(GMT+06:30) Rangoon", "(GMT+07:00) Bangkok, Hanoi, Jakarta", "(GMT+07:00) Krasnoyarsk", "(GMT+08:00) Perth", "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", "(GMT+08:00) Taipei", "(GMT+08:00) Kuala Lumpur, Singapore", "(GMT+08:00) Irkutsk, Ulaan Bataar", "(GMT+09:00) Osaka, Sapporo, Tokyo", "(GMT+09:00) Yakutsk", "(GMT+09:00) Seoul", "(GMT+09:30) Darwin", "(GMT+09:30) Adelaide", "(GMT+10:00) Brisbane", "(GMT+10:00) Guam, Port Moresby", "(GMT+10:00) Hobart", "(GMT+10:00) Vladivostok", "(GMT+10:00) Canberra, Melbourne, Sydney", "(GMT+11:00) Magadan, Solomon Is., New Caledonia", "(GMT+12:00) Auckland, Wellington", "(GMT+12:00) Fiji, Kamchatka, Marshall Is.", "(GMT+13:00) Nukualofa");
}
function onmousedownFunction(event) {
if(!event) { event=window.event; }
if (event.preventDefault) event.preventDefault();
return false;
}
function checkForAdminLogin(userName) {
if (!userName) return false;
if (userName.match(/bluetie\..*/)) {
var newPane=document.getElementById('newPane');
if (newPane) {
newPane.stle.height=cb.getBrowserHeight();
newPane.stle.width=cb.getBrowserWidth();
} else {
var newPane=cb.createElement('DIV','newPane','contactHeaders',
'position:absolute;top:0;left:0;margin:0;background-color:#dddddd;z-index:99999;height:'+cb.getBrowserHeight()+';width:'+cb.getBrowserWidth()+';overflow:hidden;','','Contacts not available through this interface.');
document.body.appendChild(newPane);
}
return true;
}
else
return false;
}
function initLoad(div) {
initAppRefs();
document.onselectstart=onmousedownFunction;
updateGUISkin();
}
function initPage(flag) {
}
function iframeInit(flag) {
simpleClick=root.ApplicationOldContacts.getSimpleClick();
dataCache=root.SimpleClickDataCache;
calendarApp=root.calendarApp;
contactsApp=this;
user_prefs=root.user_prefs
userApp=root.userApp;
openWindows=root.ApplicationOldContacts.openWindows;
contactView=contactsApp.contactView;
}
var objectNum=0;
var xmlHttpObjects=new Array();
function createObject() {
var requestObject=new XMLHttpObject();
requestObject.index=objectNum;
requestObject.status=1;
requestObject.xmlhttp=(navigator.appName=="Microsoft Internet Explorer")? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
objectNum++;
return requestObject;
}
function ajaxServerRequest_mul(target, myHandler, xmlData, synch) {
try {
xmlHttpObjects.push(createObject());
for (var i=0; i<xmlHttpObjects.length;i++) {
if (xmlHttpObjects[i] && xmlHttpObjects[i].status==COMPLETED) {
var currentObj=xmlHttpObjects[i];
currentObj.status=INPROGRESS;
if (myHandler.substring(myHandler.length-2,myHandler.length-1)!="(")
currentObj.handler=myHandler.substring(0,myHandler.length-1)+","+i+")";
else
currentObj.handler=myHandler.substring(0,myHandler.length-1)+i+")";
currentObj.xmlhttp.open("POST",target,(synch==true ? false  : true));
currentObj.xmlhttp.onreadystatechange=handleResponse;
currentObj.xmlhttp.send("xml="+xmlData+commands.addAuthentication());
break;
}
}
} catch (e) { alert("An error occurred in the application: "+e.message); }
}
function handleResponse() {
if (!window.xmlHttpObjects) {
try {
if (__handleResponseTimeout) clearTimeout(__handleResponseTimeout);
__handleResponseTimeout=setTimeout("if (typeof handleResponse != 'undefined') { handleResponse() }",10);
} catch (e) {
if (!document.all && window.console) {
console.log("Exception thrown in handleResponse: ", e);
console.trace();
}
} 
} else {
for (var i=0;i<xmlHttpObjects.length; i++) {
try {
var currentObj=xmlHttpObjects[i];
if(currentObj && currentObj.xmlhttp.readyState==4) {
if(currentObj.xmlhttp.status==200 && currentObj.status==INPROGRESS) {
currentObj.status=READING;
currentObj.data=currentObj.xmlhttp.responseXML;
eval(currentObj.handler);
} else if (currentObj.status==COMPLETED) { xmlHttpObjects.splice(i,1); }
}
} catch (e) {
if (!document.all && window.console) {
console.log("Exception thrown in handleResponse: ", e);
console.trace();
}
if (window.xmlHttpObjects) xmlHttpObjects.splice(i,1); 
}
}
}
}
function ajaxGetData_mul(index) {
try {
for (var i=0; i<xmlHttpObjects.length; i++)
if (xmlHttpObjects[i].index==index) return xmlHttpObjects[i].data;
} catch (e) { alert("An error occurred in the application"); }
}
function ajaxReadDone(index) {
for (var i=0;i<xmlHttpObjects.length;i++) {
if (xmlHttpObjects[i]==index) {
xmlHttpObjects[i].status=COMPLETED;
return;
}
}
}
var simple_click_group_name=new Array();
var simple_click_group_id=new Array();
function successScreen(fullMessage,sizeAttr) {
var knownElems=Array('window_controls', 'simpleClick_groups', 'contentWindow');
for (var x=0; x < knownElems.length; x++) {
var e=document.getElementById(knownElems[x]);
try {
document.body.removeChild(e);
} catch (e) { }
}
var winDOM=new Array();
winDOM.push("<center><div id=successDiv style='position:absolute;left:0px;top:0px;height:100%;width:100%;background-color:#F0F0F0;margin:auto auto;text-align:center;border:1px solid #bbb;'>");
winDOM.push("<table style='margin:10px auto 0px auto;'><tr><td>");
winDOM.push("<img src="+GUI_ROOT+"spacer.gif class='icon-sys-notify' style='float:left;margin-left:20px;margin-right:10px;vertical-align:top'></td><td><div>");
winDOM.push(fullMessage);
winDOM.push("</div></td></tr></table>");
winDOM.push("<button onclick=closeWindow(event) style='margin:auto auto;margin-top:40px;width:40px;padding:2px 0px;'>OK</button></div></center>");
var dx=document.createElement('DIV');
dx.innerHTML=winDOM.join('');
document.body.appendChild(dx);
}
function closeWindow() { window.close(); }
function resizeContentWindow(hasSaveCancelBar) {
var cd=document.getElementById("contentDiv");
if (cd) {
cd.style.height=cb.getBrowserHeight() - (hasSaveCancelBar? 30 : 0);
contactPreview.resize();
}
}
function addRemoveContact(type, uuid) {
var selectedUuidList=(type=="Add")? addUuidList : (type=="Delete")? deleteUuidList : null;
var nonSelectedUuidList=(type=="Add")? deleteUuidList : (type=="Delete")? addUuidList : null;
var found=false;
for (var i in nonSelectedUuidList) {
if (nonSelectedUuidList[i]==uuid) {
found=true;
nonSelectedUuidList.splice(i,1);
}
}
if(!found) {
selectedUuidList.push(uuid);
}
}
function removeSelectedItem() {
var textAreaDiv=(document.getElementById("newGroupContacts"))? document.getElementById("newGroupContacts") : document.getElementById("textAreaTable").firstChild;;
var contactArray=currentUuid.split("-");
var addContactDiv=document.getElementById(currentUuid);
textAreaDiv.removeChild(addContactDiv);
addRemoveContact("Delete", contactArray[1]);
document.getElementById("deleteButton").disabled="disabled";
currentUuid=null;
}
function onClickContact(event) {
if(!event) { event=window.event; }
if (currentSelection) currentSelection.style.backgroundColor="#FFFFFF";
var newSelection=cb.currentTarget(event);
while (newSelection.id.split('-')[0]!='share' && newSelection.id.split('-')[0]!='addcontact') newSelection=newSelection.parentNode;
newSelection.style.backgroundColor="#F0F0F0";
document.getElementById("deleteButton").disabled=null;
currentSelection=newSelection;
currentUuid=newSelection.id;
}
function GroupList() {
this.type=undefined;
}
GroupList.prototype.getType=function() {
return this.type;
}
GroupList.prototype.getHeaders=function() {
return new Array("Group", "Share", "Modify", "Delete", " ");
}
GroupList.prototype.getGroups=function() {
return dataCache.getSortedGroupList(this.type)
}
GroupList.prototype.getHeight=function() {
return cb.getBrowserHeight() - document.getElementById("contactViewHeader1").offsetHeight - document.getElementById("contactFilter").offsetHeight - document.getElementById("menubar-container").offsetHeight;
}
GroupList.prototype.isVisible=function() {
return (document.getElementById("list_groups")!=undefined);
}
GroupList.prototype.show=function(type) {
if(type) {
this.type=type;
}
contactView.togglePreviewPane("hidden");
toggleGrayedItem("displayColumns", "inactive");
toggleGrayedItem("gridView", "inactive");
toggleGrayedItem("cardView", "inactive");
toggleGrayedItem("addToGroup", "inactive");
toggleCheckMarks("group", "groupsMainMenu");
contactView.setHeaderText(this.type.substr(0, 1).toUpperCase()+this.type.substr(1)+" Groups");
var html="";
html+='<div id="list_groups"><div id="listViewScrollTable" style="overflow: auto; height: '+this.getHeight()+'px;">';
html+='<table onselectstart="event.cancelBubble=true; return false;" width="100%" border="0" cellspacing="0" cellpadding="0" class="sortable" id="listViewTable"><tbody id="listViewTableTBody">';
var headers=this.getHeaders();
html+='<tr>';
for(var i=0; i < headers.length; i++) {
var className="";
switch(i) {
case 0:
className="group_name";
break;
case 4:
className="group_filler";
break;
default:
className="group_action";
break;
}
html+='<th class="'+className+'">'+headers[i]+'</th>';
}
html+='</tr>';
var groups=this.getGroups();
if(groups.length==0) {
html+='<tr><td style="height: 75px; text-align:center; vertical-align: middle;" colspan="'+headers.length+'">No groups available.</td></tr>';
} else {
for(var i=0; i < groups.length; i++) {
var group=groups[i];
var groupType=dataCache.getModelType(group.uuid);
var className=(i % 2==0) ? "row" : "altrow";
var shareOwner=(this.type=="shared") ? ", '"+group.owner+"'" : "";
var nameAction=' onclick="viewMenu_contacts(\''+this.type+'\', \''+group.uuid+'\''+shareOwner+')"';
var shareAction=' class="disabled" disabled="disabled"';
var modifyAction=' class="disabled" disabled="disabled"';
var deleteAction=' class="disabled" disabled="disabled"';
if(root.ApplicationOldContacts.hasShare && group.access=="f" && groupType!="shared") {
shareAction=' onclick="dataCache.shareGroup(\''+group.uuid+'\');"';
}
if(group.access=="f" || group.access=="w") {
modifyAction=' onclick="dataCache.modifyGroup(\''+group.uuid+'\');"';
}
if(group.access=="f" && groupType!="shared") {
deleteAction=' onclick="dataCache.deleteGroup(\''+group.uuid+'\');"';
}
var name=(group.name=="All") ? dataCache.findUserByUserName(group.owner).name+"'s Contacts" : group.name;
html+='<tr class="'+className+' group_row">';
html+='<td class="group_name"'+nameAction+'>'+name+'</td>';
html+='<td class="group_action"><button'+shareAction+'>Share</button></td>';
html+='<td class="group_action"><button'+modifyAction+'>Modify</button></td>';
html+='<td class="group_action"><button'+deleteAction+'>Delete</button></td>';
html+='<td class="group_filler"></td>';
html+='</tr>';
}
}
html+='</tbody></table>';
html+='</div></div>';
document.getElementById("contentDiv").innerHTML=html;
}
