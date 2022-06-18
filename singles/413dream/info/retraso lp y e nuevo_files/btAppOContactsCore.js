LoadCache=function(data) {
SimpleClickDataCache.cache=data;
SimpleClickDataCache.enterpriseAllAccess=enterpriseAllAccess;
SimpleClickDataCache.regenerateArrays();
SimpleClickDataCache.setOwner(SimpleClickDataCache.cache.contact,user_prefs.user_name);
SimpleClickDataCache.setOwner(SimpleClickDataCache.cache.group,user_prefs.user_name);
SimpleClickDataCache.setOwner(SimpleClickDataCache.cache.econtact,"enterprise");
SimpleClickDataCache.setOwner(SimpleClickDataCache.cache.egroup,"enterprise");
SimpleClickDataCache.loadComplete();
if(SimpleClickDataCache.hasEnterprise!=undefined) {
ApplicationOldContacts.hasEnterprise=SimpleClickDataCache.hasEnterprise;
}
if (!ApplicationOldContacts.hasEnterprise)  {
ApplicationOldContacts.getSimpleClick().removeEnterprise();
ApplicationOldContacts.resizeSimpleClick();
}
var groupNames=new Array ("personal","enterprise","shared");
for (var groupId=0;groupId<groupNames.length;groupId++) {
SimpleClickDataCache.getLiteTreeDataModel(groupNames[groupId]);
}
}
function SimpleClickDataCache() {
SimpleClickDataCache.name="SimpleClickDataCache";
SimpleClickDataCache.isLoaded=false;
}
SimpleClickDataCache.treeModels=new Array();
SimpleClickDataCache.buddies=Array();
SimpleClickDataCache.setOwner=function (array,owner) {
for (a in array) array[a].owner=owner;
}
SimpleClickDataCache.deleteElement=function (list) {
for (var i=0;i<list.length;i++) {
var found=SimpleClickDataCache.uuidHash[list[i]];
if (found!=undefined && found.type!=undefined) {
var allGroup=SimpleClickDataCache.getContactsByType(found.type);
for (var j=0;i<allGroup.length;j++)
if (allGroup[j].uuid==list[i]) {
allGroup.splice(j,1);
break;
}
delete found;
}
}
}
SimpleClickDataCache.findListByKey=function (listType, key) {
if (listType=="group") {
if ((key=="personal") || (key==user_prefs.user_name)) return SimpleClickDataCache.cache.group;
if (key=="enterprise") return SimpleClickDataCache.cache.egroup;
if (key=="shared") return SimpleClickDataCache.cache.sgroup;
} else if (listType=="contact") {
if ((key=="personal") || (key==user_prefs.user_name)) return SimpleClickDataCache.cache.contact;
if (key=="enterprise") return SimpleClickDataCache.cache.econtact;
if (key=="shared") return SimpleClickDataCache.cache.scontact;
}
return null;
}
SimpleClickDataCache.loadComplete=function () {
SimpleClickDataCache.isLoaded=true;
SimpleClickDataCache.loadNextDataModel(0);
}
SimpleClickDataCache.canAddEnterpriseGroups=function () {
if (ApplicationOldContacts.hasEnterprise) {
return SimpleClickDataCache.enterpriseAllAccess=='f';
} else
return false;
}
SimpleClickDataCache.canAddEnterpriseContacts=function () {
if (ApplicationOldContacts.hasEnterprise) {
if (SimpleClickDataCache.enterpriseAllAccess=='f') return true;
for (var i=0;i<SimpleClickDataCache.cache.egroup.length;i++) 
if (SimpleClickDataCache.cache.egroup[i].access=='f') return true;	
}
return false;
}
SimpleClickDataCache.loadNextDataModel=function(which) {
var groupNames=new Array ("personal","enterprise","shared","currentlyOnline");
if (SimpleClickDataCache.treeModels[groupNames[which]]!=undefined) 
SimpleClickDataCache.getLiteTreeDataModel(groupNames[which],true);
if (which<3)
setTimeout('SimpleClickDataCache.loadNextDataModel('+(which+1)+');',100);
else
ApplicationOldContacts.getSimpleClick().setSimpleClickState(ApplicationOldContacts.getSimpleClickState());
}
SimpleClickDataCache.findUserGroupMembership=function (uuid) {
var contact=SimpleClickDataCache.findUser(uuid);
var groupNames;
if (contact) {
for (var i=0;i< contact.groups.length;i++)
groupNames+=(i==0)?"":","+SimpleClickDataCache.findUser(contact.groups[i]).name;
return groupNames;
}
else
return "";
}
SimpleClickDataCache.getSharers=function () {
var sharers=new Array();
var shareHash=new Array();
var list=SimpleClickDataCache.getContactsByType("sgroup");
if (!list || !(list.length))  {
return sharers;
}
for (var i=0;i<list.length;i++)  {
shareHash[list[i].owner]='1';
}
for (var i in shareHash) {
if (shareHash[i]=='1') {
sharers.push(i);
}
}
return sharers;
}
SimpleClickDataCache.hasAccess=function (group,permLevel) {
var foundGroup=SimpleClickDataCache.findUser(group);
if (foundGroup)
return ((permLevel=="r") ? true : (permLevel=="w") ? (foundGroup.access=="w" || foundGroup.access=="f") : (permLevel=="f") ? (foundGroup.access=="f") : false);
else
return false;
}
SimpleClickDataCache.unencodeEntry=function(entry) {
if(entry && entry.name) {
entry.name=htmlUnencode(entry.name);
}
return entry;
}
SimpleClickDataCache.createUuidEntry=function (a, t) {
for (var i=0;i<a.length;i++) 
SimpleClickDataCache.uuidHash[a[i].uuid]={"type":t,"value":SimpleClickDataCache.unencodeEntry(a[i])};
}
SimpleClickDataCache.regenerateArrays=function () {
SimpleClickDataCache.uuidHash=new Array()
SimpleClickDataCache.createUuidEntry(SimpleClickDataCache.cache.contact,"contact");
SimpleClickDataCache.createUuidEntry(SimpleClickDataCache.cache.econtact,"econtact");
SimpleClickDataCache.createUuidEntry(SimpleClickDataCache.cache.scontact,"scontact");
SimpleClickDataCache.createUuidEntry(SimpleClickDataCache.cache.group,"group");
SimpleClickDataCache.createUuidEntry(SimpleClickDataCache.cache.egroup,"egroup");
SimpleClickDataCache.createUuidEntry(SimpleClickDataCache.cache.sgroup,"sgroup");
for (var i in SimpleClickDataCache.cache.econtact) {
if (SimpleClickDataCache.cache.econtact[i].username==user_prefs.user_name)
SimpleClickDataCache.uuidHash['self']={"type":"econtact","value":SimpleClickDataCache.unencodeEntry(SimpleClickDataCache.cache.econtact[i])};
}
for (var i in SimpleClickDataCache.cache.sgroup) {
var grp=SimpleClickDataCache.cache.sgroup[i];
if (grp.uuid!=undefined) {
var uuid=grp.uuid;
if (uuid.match(/All_.*/)) 
for (var j in SimpleClickDataCache.cache.scontact)  
if (SimpleClickDataCache.cache.scontact[j].owner==grp.owner)
grp.contacts.push(SimpleClickDataCache.cache.scontact[j].uuid);
}
}
}
SimpleClickDataCache.loadSimpleClickCache=function (whenDone) {
SimpleClickDataCache.callerLoadComplete=whenDone;
var unm=user_prefs['user_name'];
var sid=user_prefs['session_id'];
var url='/cgi-bin/contacts/core-GetAllContactsJSON.fcg';
var xml='<params><caller>'+unm+'</caller>'+'<owner>'+unm+'</owner>'+'<shared>'+((ApplicationOldContacts.hasEnterprise)?"true":"false")+'</shared>'+'<method>GetAllContactsJSON</method></params>';
var post=new ResourcePost();
post.param('xml', xml);
post.param('unm', unm);
post.param('sid', sid);
ResourceManager.request(url, 1, SimpleClickDataCache.handleJSONReturn, post);
}
SimpleClickDataCache.handleJSONReturn=function(data) {
setTimeout(function() {
if (SimpleClickDataCache.callerLoadComplete!=undefined) 
SimpleClickDataCache.callerLoadComplete();
}, 100);
eval(data);
}
SimpleClickDataCache.getSortedTypeList=function (type,listName) {
if (listName && listName.length > 0) {
listName=listName.toLowerCase();
if (listName==user_prefs.user_name || listName=="personal" || listName=="contact")
return SimpleClickDataCache.findListByKey(type, "personal");
if (listName=="enterprise")
return SimpleClickDataCache.findListByKey(type , "enterprise");
var tmp=SimpleClickDataCache.findListByKey(type,"shared");
if (listName=="shared") return tmp;
var out=new Array();
for (var i in tmp)
if (tmp[i].owner==listName)
out.push(tmp[i]);
return out;
} else {
return;
}
}
SimpleClickDataCache.getSortedContactList=function (listName) {
return SimpleClickDataCache.getSortedTypeList("contact",listName);
}
SimpleClickDataCache.getContactsByType=function (type) {
if (type=="contact") return SimpleClickDataCache.findListByKey("contact","personal");
if (type=="econtact") return SimpleClickDataCache.findListByKey("contact","enterprise");
if (type=="scontact") return SimpleClickDataCache.findListByKey("contact","shared");
if (type=="group") return SimpleClickDataCache.findListByKey("group","personal");
if (type=="egroup") return SimpleClickDataCache.findListByKey("group","enterprise");
if (type=="sgroup") return SimpleClickDataCache.findListByKey("group","shared");
}
SimpleClickDataCache.getType=function (uuid) {
var struct=SimpleClickDataCache.uuidHash[uuid];
if (struct)
return struct.type;
else
if(uuid=='AllPers') {
return 'group';
}else if(uuid=='AllEnt') {
return 'egroup';
}else if(uuid=='AllShare') {
return 'sgroup';
}
return undefined;
}
SimpleClickDataCache.getModelType=function (uuid) {
var ownerType=SimpleClickDataCache.getType(uuid);
if (ownerType=="contact" || ownerType=="group") return "personal";
else if (ownerType=="econtact" || ownerType=="egroup") return "enterprise";
else if (ownerType=="scontact" || ownerType=="sgroup") return "shared";
else return ""; 
}
SimpleClickDataCache.getSortedGroupList=function (listName) {
return SimpleClickDataCache.getSortedTypeList("group",listName);
}
SimpleClickDataCache.findAllUsersByUserName=function (username) {
var retVal=new Array();
for (var i in SimpleClickDataCache.cache.contact)
if (SimpleClickDataCache.cache.contact[i].username==username)
retVal.push(SimpleClickDataCache.cache.contact[i]);
for (var i in SimpleClickDataCache.cache.econtact)
if (SimpleClickDataCache.cache.econtact[i].username==username)
retVal.push(SimpleClickDataCache.cache.econtact[i]);
for (var i in SimpleClickDataCache.cache.scontact)
if (SimpleClickDataCache.cache.scontact[i].username==username)
retVal.push(SimpleClickDataCache.cache.scontact[i]);
return retVal;
}
SimpleClickDataCache.findUserByUserName=function (username, type) {
if ((!type || type=="contact") && SimpleClickDataCache.cache && SimpleClickDataCache.cache.contact)
for (var i in SimpleClickDataCache.cache.contact)
if (SimpleClickDataCache.cache.contact[i].username==username)
return SimpleClickDataCache.cache.contact[i];
if ((!type || type=="econtact") && SimpleClickDataCache.cache && SimpleClickDataCache.cache.econtact)
for (var i in SimpleClickDataCache.cache.econtact)
if (SimpleClickDataCache.cache.econtact[i].username==username)
return SimpleClickDataCache.cache.econtact[i];
if ((!type || type=="scontact") && SimpleClickDataCache.cache && SimpleClickDataCache.cache.scontact)
for (var i in SimpleClickDataCache.cache.scontact)
if (SimpleClickDataCache.cache.scontact[i].username==username)
return SimpleClickDataCache.cache.scontact[i];
return null;
}
SimpleClickDataCache.generateEmailAddresses=function(email) {
var emailString="";
var emailItems=email.split(",");
var groups=SimpleClickDataCache.getSortedGroupList('personal');
for (var i=0;i<emailItems.length;i++) {
var groupFound=false;
for (var j=0;!groupFound && j<groups.length;j++) {
if (groups[j].name==emailItems[i]) {
groupFound=true;
var groupContacts=groups[j].contacts;
for (var k=0;k<groupContacts.length;k++)  {
var user=SimpleClickDataCache.findUser(groupContacts[k]);
if (user.email && user.email!="")
emailString+=user.email+",";
}
}
}
if (!groupFound) emailString+=emailItems[i]+",";
}
return emailString.substring(0,emailString.length-1);
}
SimpleClickDataCache.findUser=function (uuid) { 
var found=SimpleClickDataCache.uuidHash[uuid];
if (!found) 
return null;
else 
return found.value;
}
SimpleClickDataCache.findGroupByUuid=SimpleClickDataCache.findUser;
SimpleClickDataCache.findGroup=function (uuid) { 
var found=SimpleClickDataCache.uuidHash[uuid];
if (!found || found==undefined || found=="undefined") return new Object();
return found.value;
}
SimpleClickDataCache.findOwner=function (uuid) { 
if (uuid=="All" || uuid=="AllPers") return user_prefs["user_name"];
if (uuid=="AllEnt") return  "enterprise";
var found=SimpleClickDataCache.uuidHash[uuid];
if (!found || found==undefined || found=="undefined") return "";
if ((found.type=="contact") || (found.type=="group")) return user_prefs["user_name"];
if ((found.type=="econtact") || (found.type=="egroup")) return  "enterprise";
if ((found.type=="scontact") || (found.type=="sgroup")) return found.value.owner;
}
SimpleClickDataCache.findGroupOwner=function (uuid) {
if (uuid=="All" || uuid=="AllPers") return user_prefs["user_name"];
var found=SimpleClickDataCache.uuidHash[uuid];
return (!found) ? null : (found.type=="egroup") ? "enterprise" : (found.type=="group") ? user_prefs.user_name : (found.type=="sgroup") ? found.value.owner : null;
}
SimpleClickDataCache.getLiteTreeDataModel=function (which,override) { 
if (override!=true && SimpleClickDataCache.treeModels[which]!=undefined)
return SimpleClickDataCache.treeModels[which];
var model;
if (override!=true) {
model=new LiteTreeDataModel();
SimpleClickDataCache.treeModels[which]=model;
}
else
model=SimpleClickDataCache.treeModels[which];
if (SimpleClickDataCache.cache==undefined && which!="currentlyOnline") {
return model;
}
if (which=="currentlyOnline") {
var cur=new LiteDataNode(0, "CO", "CO", undefined, true);
if(!model) {
model=SimpleClickDataCache.getLiteTreeDataModel("currentlyOnline");
}
model.rootNode(cur);
var a=SimpleClickDataCache.aeo=="true"?SimpleClickDataCache.eusers:SimpleClickDataCache.busers;
var sortingArray=new Array();
if (a!=undefined) {
for (var i=0;i<a.length;i++) {
var contact=SimpleClickDataCache.findUserByUserName(a[i])
if (!contact) { 
contact=new Object();
contact.name=a[i];
contact.uuid=a[i];
contact.type="contact";
}
var name=unescape(contact.name);
var newNode=new LiteDataNode(contact.uuid,name,name,1);
newNode.uuid=contact.uuid;
newNode.contact=contact;
newNode.type="contact";
sortingArray.push({"name":name, "node":newNode});
}
}
sortingArray.sort(function(a,b) {return a.name<b.name?-1:1;});
for (var i=0;i<sortingArray.length;i++) 
cur.addNode(sortingArray[i].node);
} else { 
var cur=new LiteDataNode(0, "Never Shown", "Never Shown", undefined, true);
model.rootNode(cur);
var groupList=SimpleClickDataCache.getSortedGroupList(which);
var contactList=SimpleClickDataCache.getSortedContactList(which);
var groupNodes=new Array();
if (which!="shared") {
var prefix=(which=="personal")?"Pers":(which=="enterprise")?"Ent":"Share";
var allGroups=new LiteDataNode('group-All'+prefix,'<b>'+((which=='enterprise')?'Enterprise Contacts':'My Contacts')+'</b>','All'+" - "+contactList.length+" contacts",undefined);
allGroups.type="group";
allGroups.uuid="All"+prefix;
allGroups.group=new Object();
allGroups.group.uuid=allGroups.uuid;
allGroups.group.name="All";
allGroups.group.type=(which=="personal")?"personal":(which=="enterprise")?"enterprise":"shared";
allGroups.group.access=(which=="personal" ? "f" : SimpleClickDataCache.cache.enterpriseAllAccess);
cur.addNode(allGroups);
groupNodes.push(allGroups);
var contactNodes=new Array();
for (var j=0;j<contactList.length;j++) {
var newNode=new LiteDataNode("All"+prefix+"Contacts-"+contactList[j].uuid,"&nbsp;"+unescape(contactList[j].name),unescape(contactList[j].name),0);
newNode.type="contact";
newNode.uuid=contactList[j].uuid;
newNode.contact=contactList[j];
contactNodes.push(newNode);
}
if (contactList.length!=0) groupNodes[0].addNode(contactNodes);
}
for (var i=0;i<groupList.length;i++) {
if (which=="shared" && groupList[i].owner && groupList[i].owner=="enterprise")
continue; 
var contactList=groupList[i].contacts;
if (groupList[i].owner && groupList[i].uuid.match(/^All_.+/)) {
var owner=SimpleClickDataCache.findUserByUserName(groupList[i].owner);
var name=((owner && owner.name)?unescape(owner.name):unescape(groupList[i].owner))+"'s Contacts";
var group=new LiteDataNode("group-"+groupList[i].uuid,"<b>"+htmlEncode(name)+"</b>",name+" - "+contactList.length+" contacts");
}
else
var group=new LiteDataNode("group-"+groupList[i].uuid,"<b>"+htmlEncode(unescape(groupList[i].name))+"</b>", unescape(groupList[i].name)+" - "+contactList.length+" contacts");
group.uuid=groupList[i].uuid;
group.group=groupList[i];
group.type="group";
cur.addNode(group);
var contactNodes=new Array();
if (!contactList) continue;
for (var j=0;j<contactList.length;j++) {
var contact=SimpleClickDataCache.findUser(contactList[j]);
if (contact && contact.name && contact.uuid) {
var newNode=new LiteDataNode(groupList[i].uuid+"-"+contact.uuid,"&nbsp;"+unescape(contact.name),unescape(contact.name),0);
newNode.type="contact";
newNode.uuid=contact.uuid;
newNode.contact=contact;
contactNodes.push(newNode);
}
}
if (contactList.length!=0) group.addNode(contactNodes);
groupNodes.push(group);	
}
}
return model;
}
SimpleClickDataCache.setSharingData=function (data) {
SimpleClickDataCache.sharingData=new Array();
var shareItems=data.getElementsByTagName("share");
for (var i=0; i < shareItems.length; i++) {
var currentUuid=shareItems[i].getElementsByTagName("uid")[0].childNodes[0].nodeValue;
var shareRecipients=shareItems[i].getElementsByTagName("recipient");
for (var j=0; j < shareRecipients.length; j++) {
var shareItem=new Object();
shareItem.groupUuid=currentUuid;
if(shareRecipients[j].getElementsByTagName("name")[0].childNodes.length > 0) { 
shareItem.uuid=shareRecipients[j].getElementsByTagName("name")[0].childNodes[0].nodeValue;
shareItem.permission=shareRecipients[j].getElementsByTagName("perm")[0].childNodes[0].nodeValue;
SimpleClickDataCache.sharingData.push(shareItem);
}
}
}
}
SimpleClickDataCache.getSharingData=function (uuid) {
var groupSharingData=new Array();
for (var i=0; i < SimpleClickDataCache.sharingData.length; i++)
if (SimpleClickDataCache.sharingData[i].groupUuid==uuid) groupSharingData.push(SimpleClickDataCache.sharingData[i]);
return groupSharingData;
}
SimpleClickDataCache.addContact=function (uuid, name, email, username, group, which, owner, fax) {
var contactList=SimpleClickDataCache.getSortedContactList(which);
var newContact=SimpleClickDataCache.findUser(uuid);
if(newContact==undefined) {
newContact=new Object();
}
newContact.email=email;
newContact.name=name;
newContact.uuid=uuid;
if(group && newContact.groups!=undefined) {
newContact.groups.push(group);
} else {
newContact.groups=new Array();
}
newContact.username=username
newContact.access="f"; 
if(!owner) {
owner=(which=="enterprise")?"enterprise":user_prefs["user_name"];
}
newContact.owner=owner;
newContact.fax=fax;
var min=0;
var max=contactList.length;
while (max-min>1) {
var mid=min+Math.floor((max-min)/2);
if (contactList[mid].name.toLowerCase()>name.toLowerCase())
max=mid;
else
min=mid;
}
if (group) {
var groupNode=SimpleClickDataCache.findUser(group);
if (groupNode && groupNode!=undefined) {
var groupMin=0;
var groupMax=groupNode.contacts.length;
while (groupMax-groupMin>1) {
var groupMid=groupMin+Math.floor((groupMax-groupMin)/2);
if (SimpleClickDataCache.findUser(groupNode.contacts[groupMid]).name.toLowerCase()>name.toLowerCase()) {
groupMax=groupMid;
} else {
groupMin=groupMid;
}
}
groupNode.contacts.splice(groupMax,0,uuid);
}
}
contactList.splice(max,0,newContact);
var entry=new Object();
if(which=="enterprise") {
entry.type="econtact";
} else if(which=="shared") {
entry.type="scontact";
} else {
entry.type="contact";
}
entry.value=newContact;
SimpleClickDataCache.uuidHash[newContact.uuid]=entry;
SimpleClickDataCache.refreshCurrentView(which);
return newContact; 
}
SimpleClickDataCache.renameGroup=function(uuid,newName) {
var grp=SimpleClickDataCache.findGroup(uuid);
if (grp.name) {
grp.name=newName;
var groupNames=new Array ("personal","enterprise","shared");
var state=ApplicationOldContacts.getSimpleClick().getSimpleClickState();
for (var groupId=0;groupId<groupNames.length;groupId++) 
SimpleClickDataCache.getLiteTreeDataModel(groupNames[groupId],true);
ApplicationOldContacts.getSimpleClick().setSimpleClickState(state);
}
}
SimpleClickDataCache.renameContact=function (uuid, displayName, email, fax) {
var contact=SimpleClickDataCache.findUser(uuid);
var which=SimpleClickDataCache.getModelType(uuid);
if (!contact)
return;
contact.email=email;
contact.fax=fax;
if (contact.name!=displayName) {
contact.name=displayName;
var allGroup=SimpleClickDataCache.getSortedContactList(which);
var done=false;
for (var i=0;i<allGroup.length;i++)
if (allGroup[i].uuid==uuid) {
allGroup.splice(i,1);
break;
}
for (var i=0;i<allGroup.length;i++)
if (allGroup[i].name.toLowerCase()>displayName.toLowerCase()) { 
allGroup.splice(Math.max(i,0),0,contact);
done=true;
break;
}
if (!done)
allGroup.push(contact);
for (var g in contact.groups) {
var group=SimpleClickDataCache.findGroup(contact.groups[g]);
if (!group || !(group.contacts))
continue;
for (var i=0;i<group.contacts.length;i++)
if (group.contacts[i]==uuid) {
group.contacts.splice(i,1);
break;
}
var done=false;
for (var i=0;i<group.contacts.length;i++)
if (SimpleClickDataCache.findUser(group.contacts[i]).name.toLowerCase()>displayName.toLowerCase()) {
group.contacts.splice(Math.max(0,i),0,uuid);
done=true;
break;
}
if (!done)
group.contacts.push(uuid);
}
}
var state=ApplicationOldContacts.getSimpleClick().getSimpleClickState();
SimpleClickDataCache.getLiteTreeDataModel(which,true);
ApplicationOldContacts.getSimpleClick().setSimpleClickState(state);
}
SimpleClickDataCache.addGroup=function (uuid, name, contacts, which) {
var newGroup=new Object();
newGroup.name=name;
newGroup.uuid=uuid;
newGroup.access='f';
if (contacts)
newGroup.contacts=contacts.split();
else
newGroup.contacts=new Array();
var groupList=SimpleClickDataCache.getSortedGroupList(which);
var min=0;
var max=groupList.length;
while (max-min>1) {
var mid=min+Math.floor((max-min)/2);
if (groupList[mid].name.toLowerCase()>name.toLowerCase())
max=mid;
else
min=mid;
}
groupList.splice(max,0,newGroup);
var entry=new Object();
entry.type=(which=="enterprise")?"egroup":"group";
entry.value=newGroup;
SimpleClickDataCache.uuidHash[newGroup.uuid]=entry;
var state=ApplicationOldContacts.getSimpleClick().getSimpleClickState();
SimpleClickDataCache.getLiteTreeDataModel(which,true);
ApplicationOldContacts.getSimpleClick().setSimpleClickState(state);
}
SimpleClickDataCache.handleCO=function (data, xml, req, args) {
SimpleClickDataCache.eusers=new Array();
SimpleClickDataCache.busers=new Array();
var allUsers=xml.getElementsByTagName("user");
for (var i=0;i<allUsers.length;i++) {
var nm=allUsers[i].childNodes[0].nodeValue;
SimpleClickDataCache.eusers.push(nm);
if (allUsers[i].getAttribute("type")!="E")
SimpleClickDataCache.busers.push(nm);
}
var ref=xml.getElementsByTagName("refresh");
if (ref.length) { 
SimpleClickDataCache.refresh=ref[0].childNodes[0].nodeValue;
SimpleClickDataCache.count=xml.getElementsByTagName("buddyListCount")[0].childNodes[0].nodeValue;
SimpleClickDataCache.aeo=XML.getTagData(xml, 'AllEnterpriseOnline');
}
else
SimpleClickDataCache.refresh=5; 
var model=model=SimpleClickDataCache.treeModels["currentlyOnline"];
if (model!=undefined) {
SimpleClickDataCache.getLiteTreeDataModel("currentlyOnline",true);
}
if (SimpleClickDataCache.refresh>0) setTimeout(SimpleClickDataCache.getCurrentlyOnline,60000*SimpleClickDataCache.refresh);
SimpleClickDataCache.updateLightBulbs();
}
SimpleClickDataCache.findInCO=function (username)  {
for (var i=0; i< SimpleClickDataCache.buddies.length; i++)
if (username==SimpleClickDataCache.buddies[i])
return i;
return -1;
}
SimpleClickDataCache.removeContactFromGroup=function (groupuuid,contactuuid)  {
var ownerName=SimpleClickDataCache.findOwner(contactuuid);
ResourceManager.request('/cgi-bin/contacts/core-RemoveContactFromGroup.fcg?xml=<params><caller>'+user_prefs["user_name"]+'</caller><owner>'+ownerName+"</owner><method>RemoveContactFromGroup</method><contactid>"+contactuuid+"</contactid><groupid>"+groupuuid+"</groupid></params>"+"&unm="+user_prefs["user_name"]+"&sid="+user_prefs.session_id , 1, SimpleClickDataCache.handleRemoveContactFromGroup, undefined, [groupuuid, contactuuid]);
}
SimpleClickDataCache.handleRemoveContactFromGroup=function(data, xml, req, args)  {
var groupuuid=args[0];
var contactuuid=args[1];
var group=SimpleClickDataCache.findUser(groupuuid);
if (group && group.contacts) 
for (var i=0;i<group.contacts.length;i++)
if (group.contacts[i]==contactuuid)
group.contacts.splice(i,1);
var contact=SimpleClickDataCache.findUser(contactuuid);
if (contact && contact.groups) 
for (var i=0;i<contact.groups.length;i++)
if (contact.groups[i]==groupuuid)
contact.groups.splice(i,1);
SimpleClickDataCache.refreshCurrentView(SimpleClickDataCache.getModelType(groupuuid));
}
SimpleClickDataCache.updateLightBulbs=function () {
var uuids=new Array();
if (SimpleClickDataCache.eusers==undefined) return;
if (SimpleClickDataCache.cache==undefined) {
setTimeout(SimpleClickDataCache.updateLightBulbs,1000);
return;
}
for (var i=0;i<SimpleClickDataCache.eusers.length;i++) {
var contactArray=SimpleClickDataCache.findAllUsersByUserName(SimpleClickDataCache.eusers[i])
for (var j in contactArray)
if (contactArray[j].uuid)
uuids[contactArray[j].uuid]=true;
}
var groupNames=new Array ("personal","enterprise","shared");
for (var groupId=0;groupId<groupNames.length;groupId++) {
var model=SimpleClickDataCache.getLiteTreeDataModel(groupNames[groupId]);
if (model!=undefined) {
if (model.rootNode().children()!=undefined) {
var groups=model.rootNode().children();
if (groups!=undefined) {
for (var i=0;i<groups.length;i++) {
var contacts=groups[i].children();
if (contacts && contacts.length) 
for (var j=0;j<contacts.length;j++) {
var contact=contacts[j];
contact.iconId((uuids[contact.uuid]==true)?1:0);
}
}
}
}
}
}
}
SimpleClickDataCache.getCurrentlyOnline=function() {
var requestNumber=Math.floor(Math.random()*100000)
ResourceManager.request('/cgi-bin/contacts/core-GetCurrentlyOnline.fcg?requestid='+requestNumber+'&xml=<params><caller>'+user_prefs["user_name"]+'</caller><owner>'+user_prefs["user_name"]+"</owner><method>GetCurrentlyOnline</method></params>"+"&unm="+user_prefs["user_name"]+"&sid="+user_prefs.session_id , 1, SimpleClickDataCache.handleCO);
}
SimpleClickDataCache.getBuddyList=function() {
ResourceManager.request('/cgi-bin/contacts/core-GetBuddyList.fcg?xml=<params><caller>'+user_prefs["user_name"]+'</caller><owner>'+user_prefs["user_name"]+"</owner><method>GetBuddyList</method></params>"+"&unm="+user_prefs["user_name"]+"&sid="+user_prefs.session_id , 1, SimpleClickDataCache.handleGetBuddyList,undefined,[SimpleClickDataCache]);
}
SimpleClickDataCache.setBuddyList=function() {
ResourceManager.request('/cgi-bin/contacts/core-SetBuddyList.fcg?xml=<params><caller>'+user_prefs["user_name"]+'</caller><owner>'+user_prefs["user_name"]+"</owner><method>SetBuddyList</method>"+SimpleClickDataCache.buddyListToXml()+"</params>"+"&unm="+user_prefs["user_name"]+"&sid="+user_prefs.session_id , 1);
}
SimpleClickDataCache.handleGetBuddyList=function (data, xml, req, args) {
args[0].buddies=new Array();
var buddyNode=xml.getElementsByTagName("buddies");
if (!buddyNode.length)
return;
buddyNode=buddyNode[0];
if (buddyNode.childNodes.length > 0) {
var buddies=buddyNode.childNodes[0].nodeValue;
SimpleClickDataCache.buddies=buddies.split(",");
}
else
SimpleClickDataCache.buddies=new Array();
SimpleClickDataCache.aeo=XML.getTagData(xml, 'AllEnterpriseOnline');
}
SimpleClickDataCache.buddyListToXml=function ()  {
return "<buddies>"+SimpleClickDataCache.buddies.join(",")+"</buddies>"+"<AllEnterpriseOnline>"+SimpleClickDataCache.aeo+"</AllEnterpriseOnline>";
}
SimpleClickDataCache.getContactUUIDsForGroup=function(uuid) {
var group=SimpleClickDataCache.findUser(uuid);
if (group) return group.contacts;	
else if (uuid=='AllPers') group=SimpleClickDataCache.getSortedContactList('personal')
else if (uuid=='AllEnt') group=SimpleClickDataCache.getSortedContactList('enterprise')
else if (uuid=='AllShare') group=SimpleClickDataCache.getSortedContactList('shared')
else return null;
var result=new Array();
for (var i=0;i<group.length;i++)
result[i]=group[i].uuid;
return result.join(",");
}
SimpleClickDataCache.emailsForGroup=function(group) {
if (group=="undefined" || !group)
return '';
var emails='';
var i=0;
var validate=new RegExp('^[a-zA-Z0-9-_.]+\@[a-zA-Z0-9-_.]+\\.[a-zA-Z0-9-_]+$', "");
if (group.uuid=="AllPers") {
for (var i=0;i<SimpleClickDataCache.cache.contact.length;i++) {
var contact=SimpleClickDataCache.cache.contact[i];
if (contact && contact.email) {
if (contact.email.match(validate)) {
emails+=(emails.length?",":"")+contact.email;
}
}
}
} else if (group.uuid=="AllEnt") {
for (var i=0;i<SimpleClickDataCache.cache.econtact.length;i++) {
var contact=SimpleClickDataCache.cache.econtact[i];
if (contact && contact.email) {
if (contact.email.match(validate)) {
emails+=(emails.length?",":"")+contact.email;
}
}
}
} else if (group.contacts==undefined) {
return emails;
} else {
for (var i=0;i<group.contacts.length;i++) {
var contact=SimpleClickDataCache.findUser(group.contacts[i]);
if (contact && contact.email) {
if (contact.email.match(validate)) {
emails+=(emails.length?",":"")+contact.email;
}
}
}
}
return (emails=="" ? " " : emails);	
}
SimpleClickDataCache.findGroupByName=function(groupName) {
if (groupName=="All") {
return null;
}
if (groupName=="EnterpriseAll") {
return null;
}	
for (var i in SimpleClickDataCache.cache.group)
if (SimpleClickDataCache.cache.group[i].name==groupName)
return SimpleClickDataCache.cache.group[i];
for (var i in SimpleClickDataCache.cache.egroup)
if (SimpleClickDataCache.cache.egroup[i].name==groupName)
return SimpleClickDataCache.cache.egroup[i];
for (var i in SimpleClickDataCache.cache.sgroup)
if (SimpleClickDataCache.cache.sgroup[i].name==groupName)
return SimpleClickDataCache.cache.sgroup[i];
return null;
}
SimpleClickDataCache.validate_recipients=function(recIn,groupArray) {
var i, j, q, potentialRecList, addr_list;
if((typeof recIn!="undefined") && (recIn!='')) {
recIn=trim(recIn);
recIn=recIn.replace(/\;/g,",");		 
recIn=recIn.replace(/\"[^\"]*\"/g,"");  // eliminate all double quotes
		recIn=recIn.replace(/\s*\,\s*/g,",");   // eliminate all ' 's around ','s
		recIn=recIn.replace(/\<\s*/g,"<");
		recIn=recIn.replace(/\s*\>/g,">");
		recIn=recIn.replace(/\,[^\,]*\</g,",<");
		recIn=recIn.replace(/\>[^\,]*\,/g,">,");
		recIn=recIn.replace(/^[^\,]*\</g,"<");
		if(recIn.search(/\<[^\>]*[\,]/)!=-1) return null;
		if(recIn.search(/\<[^\>]*$/)!=-1) return null;
		if(recIn.search(/\,[^\<]*[\>]/)!=-1) return null;
		if(recIn.search(/^[^\<]*[\>]/)!=-1) return null;
		recIn=recIn.replace(/[\<\>]/g,"");
		recIn=recIn.replace(/\,\,*\,/g,",");
		potentialRecList = recIn.split(',');
		
		// Try to replace groups with email addresses
		var group_substitution = false;
		for( i=0; i<potentialRecList.length; i++ ) {
			addr_list = '';
			SimpleClick_found = false;
			
			// Scan through the list of groups that were passed in (i.e. the client tracked the UUID's) and sub those
			if (groupArray != undefined) {
				for( j=0; j<groupArray.length; j++) {
					if( groupArray[j].name == potentialRecList[i] || 
					    (groupArray[j].uuid == "AllEnt" && potentialRecList[i] == "EnterpriseAll") ||
						(groupArray[j].uuid == "AllPers" && potentialRecList[i] == "All"))
					{
						addr_list = SimpleClickDataCache.emailsForGroup(groupArray[j]);
						//groupArray.splice( j, 1 );
						SimpleClick_found = true;
						break;
					}
				}
			}
			
			// If there was not a matching UUID in the groupArray, try to match to an existing group
			if( !SimpleClick_found )  {
				var pe = SimpleClickDataCache.findGroupByName(potentialRecList[i] );
				if (pe != undefined) {
					if (pe.splice != undefined) {
						for (var z = 0; z< pe.length; z++) {
							var ex = SimpleClickDataCache.emailsForGroup(pe[z]);
							if (ex != "" && ex != undefined) {
								addr_list += (addr_list != "" ? "," : "") + ex;
							}
						}
					} else {
						addr_list = SimpleClickDataCache.emailsForGroup(pe);
					}
				}
			}
			
			// If we succeeded in finding a group, replace the group reference with the email addresses.
			if( addr_list != '' ) {
				// If a group with no recipients was found we still want to
				// treat it as a substitution, but spaces mess up a later
				// validation.
				if(addr_list == " ") {
					addr_list = "";
				}

				potentialRecList[i] = addr_list;
				group_substitution = true;
			}
		}

		// After group substitution, any potentialRecList element could have more than one comma separated value in it. 
		// Rebuild so that we have one value per array element
		if( group_substitution ) {
			var new_recs = '';
			for( i=0; i<potentialRecList.length; i++ ) {
				if( (i>0) && (potentialRecList[i] != '') ) new_recs += ',';
				new_recs += potentialRecList[i];
			}
			potentialRecList = new_recs.split(',');
		}
		
		// I swear Phipps had no idea what he was doing, or was really tired, or both.
		// Instead of multiple conversions, lets get this all done in one pass, and join it at the end.
		var addrlist = [], seen = [];
		for (var i = 0; i < potentialRecList.length; ++i) {
			if (potentialRecList[i].search(/[\ \:]/) != -1) return "";
			if (!seen[potentialRecList[i]]) {
				seen[potentialRecList[i]] = true;
				addrlist.push(potentialRecList[i]);
			}
		}
		
		// Last cleanup of the semicolons and delimiters
		var recipients = addrlist.join(",").replace(/([,;\s]+$)|(^[,;\s]+)|\s+/g,"");
		return recipients.replace(/[,;]+/g, ",");
	}
	return "";
} 

//----------------------------------------------------------------------------------------------

SimpleClickDataCache.emailGroup = function(uuid, type) {
	var uname;
	if (uuid == "AllEnt") {
		uname = "EnterpriseAll";
	}
	else if (uuid == "AllPers") {
		uname = "All";
	}
	else {
		uname =  SimpleClickDataCache.findUser(uuid).name;
	}
	openSendEmail( htmlUnencode(uname),"");
	}

SimpleClickDataCache.scheduleGroup = function(uuid) {
	var cal_app = Application.getApplicationById(1004);
	if (cal_app != undefined) {
		var ev = new CalendarEvent();
		ev.isNew(true);
		var d = new Date();
		d.setTime(d.getTime() + ((60 - d.getMinutes()) * (60000))); // round to next hour
		var ed = d.copy();
		ed.setTime(ed.getTime() + 3600000); // add an hour
		ev.startTime(d);
		ev.endTime(ed);

		var att_dm = ev.getAttendeesDM();
		// JEF - add code here to add each member of the group in a loop
		var uidlist = SimpleClickDataCache.getContactUUIDsForGroup(uuid);
		var i;
		for( i=0; i<uidlist.length; i++ ) {
			var u = SimpleClickDataCache.findUser(uidlist[i]);
			att_dm.addItem(new EventAttendee(Math.floor(Math.random() * 99999), u.name, u.email, 1));
		}
		cal_app.popEvent(ev, CalendarDataModel.getDefaultCalendar());
	}
}

SimpleClickDataCache.shareGroup = function(uuid) {
    var ownerName = SimpleClickDataCache.findGroupOwner(uuid);
	ResourceManager.request('/cgi-bin/contacts/core-GetCurrentShares.fcg?xml=<params><caller>' + user_prefs["user_name"] + '</caller><owner>' + ownerName + "</owner><method>GetCurrentShares</method></params>"+"&unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id , 1, SimpleClickDataCache.handleShareGroup,undefined,[uuid]);
	}

SimpleClickDataCache.handleShareGroup = function (data, xml, req, args) {
	SimpleClickDataCache.setSharingData(xml);
	window.open ("../contacts/contactsShares.html?unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id + "&gid=" + args[0],"newShare","resizable=yes,height=500,width=700,screenX=150,left=150,screenY=300,top=300,status=no");
	}

SimpleClickDataCache.modifyGroup = function(uuid) {
	var ownerType=SimpleClickDataCache.getType(uuid);
	var owner;

	if (ownerType=="egroup") { owner="enterprise"; }
	else if (ownerType=="sgroup") { owner=SimpleClickDataCache.findUser(uuid).owner; }
	else {
		owner=user_prefs["user_name"];
	}
	
		
	var win=window.open ("../contacts/contactsGroups.html?unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id + "&owner=" + owner + "&gid=" + uuid,"newGroup","resizable=yes,height=600,width=800,status=no,screenX=150,left=150,screenY=300,top=300");
	if (win) win.focus();
	}

SimpleClickDataCache.deleteGroup = function(uuid) {
    var ownerName = SimpleClickDataCache.findGroupOwner(uuid);
	if (confirm("Are you sure you want to permanently delete this group?")) {
		ResourceManager.request('/cgi-bin/contacts/core-DeleteGroup.fcg?xml=<params><caller>' + user_prefs["user_name"] + '</caller><owner>' + ownerName + "</owner><method>DeleteGroup</method><groupid>" + uuid + "</groupid></params>"+"&unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id , 1, SimpleClickDataCache.handleDeleteGroup);
		}
	}

SimpleClickDataCache.handleDeleteGroup = function (data, xml, req, args) {
	var contactList=xml.getElementsByTagName("groupId")[0].childNodes[0].nodeValue.split(",");
	SimpleClickDataCache.handleDeleteGroup2(contactList);
	}

SimpleClickDataCache.handleDeleteGroup2 = function (contactList) {
	SimpleClickDataCache.deleteElement(contactList);

	var groupNames = new Array ("personal","enterprise","shared");
	for (var groupId=0;groupId<groupNames.length;groupId++) {
		var model=SimpleClickDataCache.treeModels[groupNames[groupId]]
			if (model != undefined) {
				var groups=model.rootNode().children();
				if( groups ) {
					for (var i=0;i<groups.length;i++) {
						for (var k=0;k<contactList.length;k++) {
							if (groups[i].uuid==contactList[k])
								model.rootNode().removeNode(groups[i]);
						}
					}
				}
			}
		}

	var state=ApplicationOldContacts.getSimpleClick().getSimpleClickState();
	ApplicationOldContacts.getSimpleClick().setSimpleClickState(state);
	}

SimpleClickDataCache.newGroup = function(uuid,type) {
	var ownerType=SimpleClickDataCache.getType(uuid);
	var owner;

	if (ownerType=="egroup") { owner="enterprise"; }
	else if (ownerType=="sgroup") { owner=SimpleClickDataCache.findUser(uuid).owner; }
	else {
		owner=user_prefs["user_name"];
	}
	
	
	var win=window.open ("../contacts/contactsGroups.html?unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id + "&owner=" + owner ,"newGroup","resizable=yes,height=600,width=800,status=no,screenX=150,left=150,screenY=300,top=300");
	if (win) win.focus();
	}

SimpleClickDataCache.emailContact = function(uuid) {
	openSendEmail( SimpleClickDataCache.findUser(uuid).email ,"");
	}

SimpleClickDataCache.scheduleContact = function(uuid) {
	var cal_app = Application.getApplicationById(1004);
	if (cal_app != undefined) {
		var u = SimpleClickDataCache.findUser(uuid);
		var ev = new CalendarEvent();
		ev.isNew(true);
		var d = new Date();
		d.setTime(d.getTime() + ((60 - d.getMinutes()) * (60000))); // round to next hour
		var ed = d.copy();
		ed.setTime(ed.getTime() + 3600000); // add an hour
		ev.startTime(d);
		ev.endTime(ed);

		// 141022 - add attendees to the new event
		if( u.username != undefined ) {
			ev.attendees( u.username );
		} else if( u.email != undefined ) {
			ev.attendees( u.email );
		}

		cal_app.popEvent( ev, CalendarDataModel.getDefaultCalendar() );
	}
}

SimpleClickDataCache.imContact = function(uuid) {
	top.document.getElementById("IM_Alert").currentlyOnlineClicked(SimpleClickDataCache.findUser(uuid).username);
	}

SimpleClickDataCache.imContactByUsername = function( username ) {
	top.document.getElementById("IM_Alert").currentlyOnlineClicked(username);
	}

SimpleClickDataCache.modifyContact = function(uuid) {
	ApplicationOldContacts.popContact(uuid, "edit");
	}

SimpleClickDataCache.addToCo = function(uuid) {
	var contact=SimpleClickDataCache.findUser(uuid);
	SimpleClickDataCache.buddies.push(contact.username);
	SimpleClickDataCache.setBuddyList();
	SimpleClickDataCache.getCurrentlyOnline();
	}

SimpleClickDataCache.rmFromCo = function(uuid) {
	var contact=SimpleClickDataCache.findUser(uuid);
	SimpleClickDataCache.buddies.splice(SimpleClickDataCache.findInCO(contact.username) ,1);
	SimpleClickDataCache.setBuddyList();
	SimpleClickDataCache.getCurrentlyOnline();
	}
	
SimpleClickDataCache.newContact = function(uuid) { // uuid can be a contact or a group, so resolve
	var entity=SimpleClickDataCache.findUser(uuid);
	if (SimpleClickDataCache.getType(uuid).indexOf("group")>=0)
		top.contactsApp.popNewContact(uuid,SimpleClickDataCache.findOwner(uuid))
	else
		top.contactsApp.popNewContact('',SimpleClickDataCache.findOwner(uuid));
	}

SimpleClickDataCache.deleteContact = function(uuid) {
    var ownerName = SimpleClickDataCache.findOwner(uuid);
	if (confirm("Are you sure you want to permanently delete this contact?")) {
		ResourceManager.request('/cgi-bin/contacts/core-DeleteContact.fcg?xml=<params><caller>' + user_prefs["user_name"] + '</caller><owner>' + ownerName + "</owner><method>DeleteContact</method><contactid>" + uuid + "</contactid></params>"+"&unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id , 1, SimpleClickDataCache.handleContactDelete);
		}
	}

SimpleClickDataCache.addToGroup = function(uuid,gid) {
	var owner=SimpleClickDataCache.findOwner(uuid);
	var user = SimpleClickDataCache.findUser(uuid);
	var found = (gid=="AllPers") || (gid=="AllEnt")
	for( var x = 0; (!found) && (x < user.groups.length); x++ ) {
		if( user.groups[x] == gid ) {
			found = true;
		}
	}	

	if( !found ) {
		ResourceManager.request('/cgi-bin/contacts/core-AddContactToGroup.fcg?xml=<params><caller>' + user_prefs["user_name"] + '</caller><owner>' + owner + "</owner><method>AddContactToGroup</method><contactid>" + uuid + "</contactid><groupid>" + gid + "</groupid></params>"+"&unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id , 1, SimpleClickDataCache.handleAddToGroup,undefined,[uuid,gid]);
	}
}

SimpleClickDataCache.createPersonalContact = function (name, group, xml, handler, scope) {
      ResourceManager.request('/cgi-bin/contacts/core-CreateContact.fcg?xml=<params><caller>' + user_prefs["user_name"] + 
                                                      '</caller><owner>'  + user_prefs["user_name"] + 
                                                      "</owner><method>CreateContact</method><contactname>" + escape(htmlEncode(name)) + 
                                                      "</contactname><groupId>" + group + 
                                                      "</groupId>" + xml + "</params>" + 
                                                      "&unm=" + user_prefs["user_name"] + "&sid=" + user_prefs.session_id , 
                                                      1, SimpleClickDataCache.handleCreatePersonalContact, undefined, Array( handler, scope ));
      }

SimpleClickDataCache.getValue = function(xml,name) {
      var allNodes=xml.getElementsByTagName(name);
      if (allNodes.length && allNodes[0].childNodes.length)
                      return allNodes[0].childNodes[0].nodeValue;
      return "";
      }

SimpleClickDataCache.handleCreatePersonalContact = function(data, xml, req, args)  {
	var handler = args[ 0 ];

      if (xml != undefined) {
              var nodes=xml.getElementsByTagName("contact");
              if (nodes.length) {
                      var node=nodes[0];
                      var uuid=node.getAttribute("uuid");
                      var displayName=node.getAttribute("name");
                      var email=node.getAttribute("email");
                      var group=node.getAttribute("groups");
                      SimpleClickDataCache.addContact (uuid,displayName,email,'',group,"personal",user_prefs["user_name"]);
                      }
              }

		if( handler != undefined ) {
			var scope = args[ 1 ];
			if( scope != undefined ) {
				handler.call( scope );
			} else {
				handler();
			}
		}

	}

// Passing contact uuid as arg0 and gid as arg1
SimpleClickDataCache.handleAddToGroup = function (data, xml, req, args) {
	var contact=SimpleClickDataCache.findUser(args[0]);
	var displayName = contact.name;
		
	var model=SimpleClickDataCache.treeModels[SimpleClickDataCache.getModelType(args[0])];
	if (model == undefined) // Model not in use (shouldn't happen!)
		return;

	contact.groups.push(args[1]);
	var group=SimpleClickDataCache.findUser(args[1]);
	if (group) // Shouldn't ever fail, but...
		group.contacts.push(args[0]);

	var newNode = new LiteDataNode(args[1] + "-" + args[0],"&nbsp;" + unescape(displayName),unescape(displayName),0);
	newNode.type=SimpleClickDataCache.getType(args[0]);
	newNode.uuid=args[0]
	newNode.contact=contact;

	var groups=model.rootNode().children();
	for (var i=0;i<groups.length;i++) {
		if (groups[i].uuid==args[1]) {
			groups[i].addNode(newNode);
			}
		}
	}

SimpleClickDataCache.handleContactDelete = function (data, xml, req, args) {
	var uuidList=xml.getElementsByTagName("uuid");
	if (!uuidList || uuidList[0].childNodes[0].nodeValue=="")
		return;
	var contactList=uuidList[0].childNodes[0].nodeValue.split(",");
	var type=SimpleClickDataCache.getModelType(contactList[0]);
	// Delete the contact(s) from the groups that it was a member of...
	for (var contact=0;contact<contactList.length;contact++) { // For each contact
		var thisContact=SimpleClickDataCache.findUser(contactList[contact]);
		var groups=thisContact.groups;
		for (var group=0;group<groups.length;group++) { // for each groupUUID that has a claim on the current Contact
			if (groups[group] != undefined && groups[group] != "undefined" ) {
				var groupObj = SimpleClickDataCache.findGroup(groups[group]); // find the group object
				if (groupObj == undefined || groupObj == "undefined" || groupObj.contacts == undefined)
					continue;
				for (var index=0;index<groupObj.contacts.length;index++) {
					//Fix for Bug #135634
					if (groupObj.contacts[index]==thisContact.uuid)
						groupObj.contacts.splice(index,1);
				}
			}
		}
	}
	// Delete the contact itself now that there are no references
	SimpleClickDataCache.deleteElement(contactList);
	SimpleClickDataCache.refreshCurrentView(type);

	/*
	var model=SimpleClickDataCache.getLiteTreeDataModel(owner);
	var groups=model.rootNode().children();
	for (i=0;i<groups.length;i++) {
		var contacts=groups[i].children();
		if (contacts && contacts.length) {
			for (j=0;j<contacts.length;j++) {
				var contact=contacts[j];
				for (k=0;k<contactList.length;k++) {
					if (contactList[k]==contact.uuid) {
						groups[i].removeNode(contact);
						}
					}
				}
			}
		}
	*/
	}

/**
 * After changes have been made, simple click needs to be refreshed and if the
 * contacts app is open, the currently shown group also needs to be refreshed.
 *
 * @param	type	What type we need to refresh in simple click (personal,
 * 					enterprise, etc)
 */
SimpleClickDataCache.refreshCurrentView = function(type) {
	var contacts_app, refresh_group, refresh_group_type;

	// Grab the contacts app iframe if we have that loaded.
	if(WindowObject.getWindowById("cn1") && WindowObject.getWindowById("cn1").getFrame()) {
		contacts_app = WindowObject.getWindowById("cn1").getFrame().contentWindow;
	}

	var simple_click = ApplicationOldContacts.getSimpleClick();

	// Fetch the currently loaded group in the grid view if contacts is open.
	if(contacts_app) {
		refresh_group = SimpleClickDataCache.findUser(contacts_app.contactView.currentDir);
		if(refresh_group) {
			refresh_group_type = SimpleClickDataCache.getModelType(refresh_group.uuid);
		}
	}

	// See what simple click looks like right now.
	var state = simple_click.getSimpleClickState();

	// Rebuild this part of the simple click tree.
	SimpleClickDataCache.getLiteTreeDataModel(type, true);

	// Clear the cache so the contacts view is reloaded.
	GridCache.clear();

	// Reset the simple clicks state which also refreshes the contacts app grid
	// view, but displays the default group (ie. the Personal Contacts rather
	// than a specific group we may have been looking at).
	simple_click.setSimpleClickState(state);

	// Refresh the grid view with our actual group.
	if(simple_click.handleViewChange && refresh_group && refresh_group_type) {
		simple_click.handleViewChange(refresh_group_type, refresh_group);
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GridView Cache. This is the cache for the contacts app grid view. It should be removed from here when we go full GDS.
// For now, the cache needs to survive frame teardown/construction, so it needs to be here.
// Very simple cache, based on an array. Stores all of the parameters in an object (the index of the array)
// And the result as an XML object (the value of the array).
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function GridCache () { 
}

GridCache.i_cache = new Array();
GridCache.MAX_CACHE_SIZE = 5;

GridCache.find = function (contactUserName, fields, group, sortField, min, max, displayChars, search) {
    for (var i=0;i<GridCache.i_cache.length;i++) {
        if ((GridCache.i_cache[i] != undefined)
         && (GridCache.i_cache[i].user==contactUserName)
         && (GridCache.i_cache[i].fields==fields)
         && (GridCache.i_cache[i].group==group)
         && (GridCache.i_cache[i].sort==sortField)
         && (GridCache.i_cache[i].min==min)
         && (GridCache.i_cache[i].max==max)
         && (GridCache.i_cache[i].displayChars==displayChars)
         && (GridCache.i_cache[i].search==search))
        return GridCache.i_cache[i];
        }
    var req = new Object();
    req.user=contactUserName;
    req.fields=fields;
    req.group=group;
    req.sort=sortField;
    req.min=min;
    req.max=max;
    req.displayChars=displayChars;
    req.search=search;
    GridCache.i_cache.push(req);
    if (GridCache.i_cache.length > GridCache.MAX_CACHE_SIZE)
        GridCache.i_cache.shift();
    return GridCache.i_cache.length-1;
    }

GridCache.set = function (index,data) {
	if( !GridCache.i_cache[index] ) {
		GridCache.i_cache[index] = new Object();
	}
    GridCache.i_cache[index].data=data;
    }

GridCache.clear = function() {
    GridCache.i_cache = new Array();
	ContactList.invalidate(); // This is for auto-complete - invalidate the ContactList when contacts are altered.
    }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UDF Cache. This is the cache for the contacts app user defined fields. It should be removed from here when we go full GDS.
// For now, the cache needs to survive frame teardown/construction, so it needs to be here.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function UDFCache () { 
}

UDFCache.i_cache = new Array();

UDFCache.find = function (user) {
	if (UDFCache.i_cache[user] == undefined)
    	UDFCache.i_cache[user]=UDFCache.goGetOne(user);
		
    return UDFCache.i_cache[user];
    }

UDFCache.set = function (user,data) {
    UDFCache.i_cache[user]=data;
    }

UDFCache.clear = function(user) {
    UDFCache.i_cache[user] = null;
    }

UDFCache.goGetOne = function (user) {
	try {
		var xmlhttp = (navigator.appName == "Microsoft Internet Explorer")? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		xmlhttp.open("POST","/cgi-bin/contacts/core-GetUDFList.fcg", false );
		xmlhttp.send("xml=<params><method>GetUDFList</method><caller>" + user_prefs.user_name + "</caller><owner>" + user + "</owner></params>" + "&unm=" + user_prefs.user_name + "&sid=" + user_prefs.session_id);
		if(xmlhttp && xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var items = xmlhttp.responseXML.getElementsByTagName("udfs")[0];
			if (items != undefined && items.childNodes.length > 0) 
				return items.childNodes[0].nodeValue;
			else
				return "";
			}
		else 
			alert("An error occurred in the application.");
		return ""; 
	} catch (e) { alert("An error occurred in the application: " + e.message); return ""; }
	}

/**
 *	Resource Manager Notification
 */
JavaScriptResource.notifyComplete("./src/Applications/OldContacts/components/DataModel.SimpleClickDataCache.js");	
/*
	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% ApplicationOldContacts %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
	/**
	 *	ApplicationOldContacts
	 *	This is the contacts application class.  It contains the main framework behind the contacts interface.
	 *
	 *	@constructor
	 */
	function ApplicationOldContacts() {
		// Call super constructor
		this.superApplication();
		
		// Set the application ID
		this.id(2005);	
		
		// Set the applications name
		this.name("Contacts");
		
		// Define the icons for this application
		this.smallIcon("ApplicationContacts_small");	// 16x16
		this.largeIcon("ApplicationContacts");		// 60x60
		
		// Set the loading order of this application
		this.loadingOrder(4);

		// Define the preference files
		this.registerPreference("./btAppOContactsPreferences.js");

		// Handle initialization		
		EventHandler.register(this, "oninitialize", this.handleInitialize, this);
		EventHandler.register(this, "onload", this.handleLoad, this);
		
		ApplicationOldContacts.hasEnterprise=false;
		ApplicationOldContacts.hasIM=false;
		ApplicationOldContacts.hasCal=false;
		ApplicationOldContacts.hasShare=false;

		for (var id in app_ids) {
			if (app_ids[id]=="1010") {
				ApplicationOldContacts.hasIM=true;
			}
			else if (app_ids[id]=="1004") {
				ApplicationOldContacts.hasCal=true;
			}
			else if (app_ids[id]=="1018") {
				ApplicationOldContacts.hasShare=true;
				// FOLLOWING IS A HACK!!! Should be replaced with a real app id!!!
				ApplicationOldContacts.hasEnterprise=user_prefs[ 'user_name' ].split(".")[1]!="unwired";
			}
		}
		
		if (ApplicationOldContacts.hasIM){
			ApplicationOldContacts.i_title_refresh_sc = new IconButton("IconButton_Refresh", 9, 9, 16, 16, "Refresh Currently Online");
		}
	}

	ApplicationOldContacts.openWindows = new Array();

	/**
	 *	Handle when the application initializes
	 *
	 *	@private
	 *
	 *	@param e the event that triggered this
	 */
	ApplicationOldContacts.prototype.handleInitialize = function(e) {

		// Define the windows for this application
		//#141261 Change Simple Click to SimpleClick
		this.i_sc_window = new WindowObject('con-simple', "SimpleClick", 100, 100, Application.titleBarFactory());
		this.i_contacts_window = new WindowObject('con-main', "Contacts", 100, 100, Application.titleBarFactory());

		this.i_contacts_window.ondock = ApplicationOldContacts.handleDock;
		ApplicationOldContacts.i_contacts_window = this.i_contacts_window;

	
		// Add a navigation button to the tool bar, and have its click event launch this application
		this.i_nav_button = SystemCore.navigationBar().addButton(new NavigationButton(this.id(), this.name(), this.largeIcon(), this.smallIcon()));
		EventHandler.register(this.i_nav_button, "onclick", this.launchApplication, this);

	
		this.i_contacts_window.titleBar().removeButton( Application.i_title_close );
		this.i_sc_window.titleBar().removeButton(Application.i_title_close);

		if (ApplicationOldContacts.i_title_refresh_sc != undefined) {
			this.i_sc_window.titleBar().addButton( ApplicationOldContacts.i_title_refresh_sc );
			ApplicationOldContacts.i_title_refresh_sc.callback(SimpleClick2.handleRefreshCurrentlyOnline);
		}
		var contactsApp = document.getElementById( 'contactsApp' );
		
		if( contactsApp ) {
			contactsApp.src = user_prefs[ 'root_dir' ] + "/contacts/contacts_iframe.html";
		}

		// Register the shortcut
		this.i_shortcut_new_contact = SystemCore.shortcutPane().addShortcut(new ShortcutLink("New Contact", this.smallIcon()));
		EventHandler.register(this.i_shortcut_new_contact, "onclick", ApplicationOldContacts.handleNewContactShortcut);

		ApplicationOldContacts.i_reg_node=ApplicationRegistry.getNode("contacts_simpleclick_state");
		if (ApplicationOldContacts.i_reg_node == undefined) {
			ApplicationOldContacts.i_reg_node = ApplicationRegistry.addNode(new RegistryNode("contacts_simpleclick_state", "", ApplicationRegistry.REGISTRY_SERVER, undefined));
		}

		SimpleClickDataCache.loadSimpleClickCache(ApplicationOldContacts.loadComplete);
		
		if (ApplicationOldContacts.hasIM) {
			SimpleClickDataCache.getBuddyList();
			SimpleClickDataCache.getCurrentlyOnline();
		}
		
		this.i_sc_window.onresize = ApplicationOldContacts.resizeSimpleClick;
		this.i_sc_window.loadContent(ApplicationOldContacts.getSimpleClick().getSimpleClick());
		
		this.i_list_all_hotkey = new HotKey('A'.charCodeAt(0), HotKey.ctrlKey, ApplicationOldContacts.handleHotKeySelectAll);
		setInterval('ApplicationOldContacts.setSimpleClickState(ApplicationOldContacts.getSimpleClick().getSimpleClickState())',60000);
	}
	
	/**
	 *	Handle when the application is loaded
	 *
	 *	@private
	 *
	 *	@param e The event that triggered this
	 */
	ApplicationOldContacts.prototype.handleLoad = function(e) {
		this.i_nav_button.selectedState(true);

		this.i_contacts_window.url( user_prefs[ 'root_dir' ] +
			"/contacts/contacts.html?unm=" + user_prefs[ 'user_name' ] +
			"&sid=" + user_prefs[ 'session_id' ] + "&enm=" +
			user_prefs[ 'enterprise_name' ], true, "app_main" );

		this.i_list_all_hotkey.register();
	}

	ApplicationOldContacts.getSimpleClickState = function() {
		return ApplicationOldContacts.i_reg_node.singleValue().toString();
	}

	ApplicationOldContacts.setSimpleClickState = function(val) {
		// If the passed in value matches the current registry value, you don't need to write it out...
		if (ApplicationOldContacts.i_reg_node.singleValue().toString()==val) return;

		ApplicationOldContacts.i_reg_node.singleValue(val);
		ApplicationRegistry.save();
	}

	/**
	 *	Ugly Global function to support IM (Java) button
	 */
	function showBuddyListOptions() {
		// Listen for when all of the preferences have finished loading, so we
		// can open this manager to the IM pane.
		ApplicationOldContacts.i_preference_handler = EventHandler.register(SystemCore, "onpreferencesloadcomplete", ApplicationOldContacts.handlePreferencesLoadComplete);

		SystemCore.launchPreferences();
	}

	/**
	 *	Handle the preferences manager loading all of the needed files.
	 *
	 *	@param e The event that triggered this
	 */
	ApplicationOldContacts.handlePreferencesLoadComplete = function(e) {
		// We only want this to trigger this one time the preferences load, so
		// unregister this listener.
		ApplicationOldContacts.i_preference_handler.unregister();

		// Set the preference manager to initially load our IM pane.
		e.manager.customLoadPane(IMOnlinePane.obj);
	}

	/**
	 *	Get the main simple click object
	 *
	 *	@return the main simple click object
	 */
	ApplicationOldContacts.getSimpleClick = function() {
		if (ApplicationOldContacts.i_simpleClick == undefined) {
			ApplicationOldContacts.i_simpleClick = new SimpleClick2(100, 100);
		}
		return ApplicationOldContacts.i_simpleClick;
	}

	/**
	 *	Resize the simple click data after the window resizes
	 *
	 *	@return true
	 */
	ApplicationOldContacts.resizeSimpleClick = function(width, height) {
		var w = WindowObject.getWindowById("con-simple");
		var s = ApplicationOldContacts.getSimpleClick();
		if (width != undefined) {
			s.width(width - 2);
		}
		if (height != undefined) {
			// Bug #139058 Fix - Changed second int value from 3 to 2 for FF
			s.height(height - (w.titleBar().height() + (document.all ? 10 : 2)));
			////
		}
	}

	ApplicationOldContacts.handleDock = function( docked ) {

		if( !docked && document.all ) {
			ApplicationOldContacts.i_contacts_window.url( user_prefs[ 'root_dir' ] +
				"/contacts/contacts.html?unm=" + user_prefs[ 'user_name' ] +
				"&sid=" + user_prefs[ 'session_id' ] + "&enm=" +
				user_prefs[ 'enterprise_name' ], true, "app_main" );

		}

	}

	/**
	 *	Handle when the ctrl+A select all hotkey is used
	 *
	 *	@param e The event that triggered this
	 *
	 *	@return true
	 */
	ApplicationOldContacts.handleHotKeySelectAll = function(e) {
		WindowObject.getWindowById('con-list').getFrame().contentWindow.contactView.selectAll(e);
		return true;
	}

	ApplicationOldContacts.loadComplete = function () { 
		ApplicationOldContacts.i_sp_loaded = true;
		//this.i_simple_click_window.loadComplete();
	}

	var fileWin; // Global so that we can close the window from the popup...

	ApplicationOldContacts.popFileSharing = function(unm,sid,cf,root_id) {
		fileWin = new WindowObject("FileSharingWindow", "Share Files", 100, 100, Application.titleBarFactory());
		var div = document.createElement('DIV');
		var if2 = new IFrameSettingsPane('share_main','Share Files',user_prefs[ 'root_dir' ] + "/Ioffice/FilingCabinet/share.asp?unm=" + unm + "&sid=" + sid + "&cf=" + cf + "&fid=" + cf + "&root_id=" + root_id,750,580);
		div.appendChild(if2.getSubContent());

		fileWin.loadContent(div);
		fileWin.modal(true);
		fileWin.popWindow(800,600,true);
	}

	ApplicationOldContacts.handleNewContactShortcutFromAttachment = function( groupUuid, contactOwner, contactName, contactEmail, folderId, messageId, attemId, attachmentId) {
		top.contactsApp.popNewContact( groupUuid, contactOwner, contactName, contactEmail, folderId, messageId, attemId, attachmentId);
	}

	ApplicationOldContacts.handleNewContactShortcut = function() {//groupUuid, contactOwner, contactName, contactEmail, folderId, messageId, attemId, attachmentId) {
		top.contactsApp.popNewContact(); //groupUuid, contactOwner, contactName, contactEmail, folderId, messageId, attemId, attachmentId);
	}

	ApplicationOldContacts.popContact = function(contactUuid, mode) {
		top.contactsApp.popContact(contactUuid, mode);
	}

	ApplicationOldContacts.getAutoCompleteSettings = function(method, context) {
		var contacts = Application.getApplicationById(2005);

		var settings = {
			"autopopulate_enabled": contacts.param("autopopulate_enabled"),
			"autopopulate_auto": contacts.param("autopopulate_auto"),
			"autopopulate_group": contacts.param("autopopulate_group")
		};

		// Set some default values.
		if(settings.autopopulate_enabled == undefined) {
			settings.autopopulate_enabled = "true";
		}

		if(settings.autopopulate_auto == undefined) {
			settings.autopopulate_auto = "false";
		}

		if(settings.autopopulate_group == undefined) {
			settings.autopopulate_group = "";
		}

		if(method) {
			method.call(context, settings);
		}
	}

	ApplicationOldContacts.saveAutoCompleteSettings = function(settings, method, context) {
		var contacts = Application.getApplicationById(2005);

		contacts.param("autopopulate_enabled", settings.autopopulate_enabled);
		contacts.param("autopopulate_auto", settings.autopopulate_auto);
		contacts.param("autopopulate_group", settings.autopopulate_group);

		if(method) {
			method.call(context, settings);
		}
	}

/**
 * Enable the eFax Extension.
 */
ApplicationOldContacts.enableEfax = function() {
	ApplicationOldContacts.efaxEnabled = true;

	// In case the simple click context menu has already been triggered before
	// we finished loading the extension, enable the eFax menu item now.
	var menu_item = ApplicationOldContacts.getSimpleClick().i_contact_context_efax;
	if(menu_item) {
		ApplicationOldContacts.getSimpleClick().i_contact_context_efax.visible(true);
	}
}

/*
	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% System Integration %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
	
	
	// Inherit from the application object
	ApplicationOldContacts.inherit(Application);
	
	// Register the application
	if( typeof( ContactsPopup ) == "undefined" ) {
    	SystemCore.registerApplication(new ApplicationOldContacts());
	}
	
	
/**
 *	Resource Manager Notification
 */
JavaScriptResource.notifyComplete("./src/Applications/OldContacts/Application.OldContacts.js");
var CONTACT_TYPE_ONLINE = "currentlyonline";
var CONTACT_TYPE_PERSONAL = "personal";
var CONTACT_TYPE_SHARED = "shared";
var CONTACT_TYPE_ENTERPRISE = "enterprise";


/*
	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% SimpleClick %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
	/**
	 *	SimpleClick
	 *	This object provides an interface into contacts which can be used to populate text fields, lists, etc...
	 *
	 *	@param width The width of the simple click pane
	 *	@param height The height of the simple click pane
	 *
	 *	@constructor
	 */
	function SimpleClick2(width, height) {
		this.i_width = width;
		this.i_height = height;
		
		this.i_listen_stack = Array();
	}
	
	/**
	 *	Handle the event where the accordion pane changes views
	 *
	 *	@param view The text of the new view
	 */
	SimpleClick2.prototype.handleViewChange = null;
	
	/**
	 *	Request simple click notifications when a contact is selected 
	 *
	 *	@param doThis The function to call when a contact is selected
	 *
	 *	@return the object used to identify this listener.  You will need this to cancel the listner later on
	 */
	SimpleClick2.prototype.requestOnContact = function (doThis, scope) { 
		var o = new Object();
		o.type = "contact";
		o.func = doThis;
		o.scope = scope;
		this.i_listen_stack[this.i_listen_stack.length] = o;
		return o;
	}
	
	/**
	 *	Cleanup the simple click's binding with the current data model
	 *
	 *	@return true
	 */
	SimpleClick2.prototype.cleanup = function() {
		this.getTree().dataModel(false);
	}
	
	/**
	 *	Request simple click notifications when a group is selected 
	 *
	 *	@param doThis The function to call when a group is selected
	 *
	 *	@return the object used to identify the listener.  You will need this to cancel the listener later on
	 */
	SimpleClick2.prototype.requestOnGroup = function (doThis, scope) {
		var o = new Object();
		o.type = "group";
		o.func = doThis;
		o.scope = scope;
		this.i_listen_stack[this.i_listen_stack.length] = o;
		return o;
	}
	
	/**
	 *	Request simple click notifications when a group is selected 
	 *
	 *	@param doThis The function to call when a group is selected
	 *
	 *	@return the object used to identify the listener.  You will need this to cancel the listener later on
	 */
	SimpleClick2.prototype.requestOnBoth = function (doThis, scope) {
		var o = new Object();
		o.type = "both";
		o.func = doThis;
		o.scope = scope;
		this.i_listen_stack[this.i_listen_stack.length] = o;
		return o;
	}
	
	/**
	 *	Remove a simple click listener
	 *
	 *	@param o The object returned when registering as a listener
	 *
	 *	@return true if the listener was cancelled, false otherwise
	 */
	SimpleClick2.prototype.cancelRequest = function(o) {
		for (var x = 0; x < this.i_listen_stack.length; x++) {
			if (this.i_listen_stack[x] == o) {
				this.i_listen_stack.splice(x, 1);
				return true;
			}
		}
		return false;
	}
	
	/**
	 *	Get/Set the width of this simple click pane
	 *
	 *	@param width (Optional) The new width of the simple click pane
	 *
	 *	@return the current width of the simple click pane
	 */
	SimpleClick2.prototype.width = function(width) {
		if (width != undefined) {
			this.i_width = width;
			if (this.i_simple_click != undefined) {
				this.i_simple_click.style.width = width + "px";
				this.i_accord.width(width);
			}
		}	
		return this.i_width;
	}	
	
	/**
	 *	Get/Set the height of this simple click pane
	 *
	 *	@param height (Optional) The new height of this simple click pane
	 *
	 *	@return the current height of this pane
	 */
	SimpleClick2.prototype.height = function(height) {
		if (height != undefined) {
			this.i_height = height;
			if (this.i_simple_click != undefined) { 
				this.i_simple_click.style.height = height + "px";
				this.i_accord.height(height);
			}
		}
		return this.i_height;
	}
	
	SimpleClick2.prototype.resize = function(e) {
		
		//// Bug #139800 - Fixed formatting for SimpleClick dimensions in New Event pop-out
		//// Commented out for above bug ////

		//var height = parseInt(e.originalScope.effectiveHeight() - WindowManager.window_border_width - 2);
		//var width = parseInt(e.originalScope.effectiveWidth() - WindowManager.window_border_width - 2);
		////
		var height = parseInt(e.originalScope.effectiveHeight() - WindowManager.window_border_width - (document.all ? 6 : 0));
		var width = parseInt(e.originalScope.effectiveWidth() - WindowManager.window_border_width);
		////
		
		this.height( height );
		this.width( width );

	}
	
	/**
	 *	Get the Tree object that will be used to display the contacts in each bar
	 *
	 *	@return the Tree object
	 */
	SimpleClick2.prototype.getTree = function() {
		if (this.i_tree == undefined) {
			this.i_tree = new LiteTree(false, Array("SimpleClick-contact-off","SimpleClick-contact-on"), Array("SimpleClick-contact-off","SimpleClick-contact-on"), 100, 100);
			this.i_tree.i_simple_click = this;
			this.i_tree.oncontextmenu = SimpleClick2.handleContextMenu;
			this.i_tree.onmousedown = SimpleClick2.handleDragStart;
			this.i_tree.onmouseover = SimpleClick2.setDropTarget;
			this.i_tree.onmouseout = SimpleClick2.clearDropTarget;
			this.i_tree.onclick = SimpleClick2.handleClick;
			this.i_tree.actionOpenCSS("SimpleClick-group-open");
			this.i_tree.actionClosedCSS("SimpleClick-group-closed");
			this.i_tree.rootVisible(false);
			this.i_tree.ondblclick=SimpleClick2.handleDoubleClick;
		}
		return this.i_tree;
	}
	
	SimpleClick2.handleDoubleClick = function( tree ) {
		if (tree.i_simple_click.i_accord.activeBar() == tree.i_simple_click.i_accord_online) {
			return;
		}
		var node = tree.getSelectedNode();
		if (node.type=="contact")
			ApplicationOldContacts.popContact( node.uuid );
	}
	
	/**
	 *	Set a node as the active drop target
	 *
	 *	@private
	 *
	 *	@param tree the tree that called this
	 *	@param display The node used to display in the tree
	 *	@param node the actual node
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.setDropTarget = function(tree, display, node, e) {
		SimpleClick2.i_drop_target = node;
	}
	
	/**
	 *	Set a node as the active drop target
	 *
	 *	@private
	 *
	 *	@param tree the tree that called this
	 *	@param display The node used to display in the tree
	 *	@param node the actual node
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.clearDropTarget = function(tree, display, node, e) {
		if (SimpleClick2.i_drop_target == node) {
			SimpleClick2.i_drop_target = null;
		}
	}
	
	/**
	 *	Begin dragging a contact (with a tolerance)
	 *
	 *	@private
	 *
	 *	@param tree the tree that called this
	 *	@param display The node used to display in the tree
	 *	@param node the actual node
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleDragStart = function(tree, display, node, e) {
		if (node.contact != undefined) {
			if (SimpleClick2.i_start_x != null) SimpleClick2.handleDragOutOfWindow({type:"blur"});
			SimpleClick2.i_start_x = CursorMonitor.getX();
			SimpleClick2.i_start_y = CursorMonitor.getY();
			SimpleClick2.i_active_sc = this;
			SimpleClick2.i_active_node = node;
			SimpleClick2.i_monitor_drag = EventListener.listen(document.body, "ondragstart", function() {
				if (document.selection) document.selection.empty();
				e.cancelBubble = true;
				return false;
			});
			SimpleClick2.i_monitor_out = EventListener.listen(document, "onmouseout", SimpleClick2.handleDragOutOfWindow);
			SimpleClick2.i_monitor_blur = EventListener.listen(window, "onblur" , SimpleClick2.handleDragOutOfWindow);
			SimpleClick2.i_monitor_id = CursorMonitor.addListener(SimpleClick2.handleDragMove);
			SimpleClick2.i_monitor_up = EventListener.listen(document.body, "onmouseup", SimpleClick2.handleDragStop);
			SimpleClick2.i_drag_init = false;
			SimpleClick2.i_drop_target = null;
		}
		return false;
	}
	
	/**
	 *	Get the DIV used to display dragging items
	 *
	 *	@return a DIV
	 */
	SimpleClick2.getDragDiv = function() {
		if (SimpleClick2.i_drag_div == undefined) {
			SimpleClick2.i_drag_div = document.createElement('DIV');
		}
		return SimpleClick2.i_drag_div;
	}
	
	/**
	 *	Handle when the mouse is moved during a drag
	 *
	 *	@private
	 *
	 *	@param x The x position of the cursor
	 *	@param y The y position of the cursor
	 *
	 *	@return true
	 */
	SimpleClick2.handleDragMove = function(x, y) {
		var dd = SimpleClick2.getDragDiv();
		dd.style.top = (y + 8) + "px";
		dd.style.left = (x + 8) + "px";
		if (SimpleClick2.i_drag_init == false && (SimpleClick2.i_start_x < x - 5 || 
							  SimpleClick2.i_start_x > x + 5 ||
							  SimpleClick2.i_start_y < y - 5 ||
							  SimpleClick2.i_start_y > y + 5)) {
			SimpleClick2.i_drag_init = true;
			dd.innerHTML = SimpleClick2.i_active_node.name();
			document.body.appendChild(dd);
			if (SystemCore != undefined) {
				SystemCore.windowManager().captureAll(true, WindowObject.getWindowById('con-simple'));
			}
		}
		
		
		if (SimpleClick2.i_drop_target != undefined) {
			if (SimpleClick2.i_drop_target.contact != undefined || SimpleClick2.i_drop_target.group.access != "f") {
				SimpleClick2.i_drop_target = null;
			}
		}
		dd.className = ((SimpleClick2.i_drop_target != null) ? "SimpleClick_drag" : "SimpleClick_drag_nodrop");
	
		if (document.all) {
			if (document.selection) {
				document.selection.empty();
			} else if (window.getSelection()) {
				window.getSelection().removeAllRanges();
			}
		}
	}
	
	/**
	 *	Handle when the use stops dragging 
	 *
	 *	@private
	 *
	 *	@param e The event that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleDragStop = function(e) {
		EventListener.silence(document.body, "onmouseup", SimpleClick2.i_monitor_up);
		EventListener.silence(document, "onmouseout", SimpleClick2.i_monitor_out);
		EventListener.silence(window, "onblur" , SimpleClick2.i_monitor_blur);
		EventListener.silence(document.body, "ondragstart" , SimpleClick2.i_monitor_drag);
		CursorMonitor.removeListener(SimpleClick2.i_monitor_id);
		
		if (SimpleClick2.i_drag_init == true) {
			document.body.removeChild(SimpleClick2.getDragDiv());
			SystemCore.windowManager().captureAll(false);
			
			if (SimpleClick2.i_drop_target != undefined) {
				//alert('moving ' + SimpleClick2.i_active_node.name() + ' to ' + SimpleClick2.i_drop_target.name());
				SimpleClickDataCache.addToGroup(SimpleClick2.i_active_node.uuid, SimpleClick2.i_drop_target.uuid);
			}
		}
		
		SimpleClick2.i_start_x = null;
		SimpleClick2.i_start_y = null;
		SimpleClick2.i_active_sc = null;
		SimpleClick2.i_active_node = null;
		SimpleClick2.i_monitor_id = null;
		SimpleClick2.i_monitor_up = null;
		SimpleClick2.i_monitor_blur = null;
		SimpleClick2.i_monitor_out = null;
		SimpleClick2.i_monitor_drag = null
		SimpleClick2.i_drag_init = null;
	}
	
	/**
	 * Ignore the drag and drop if the window is blurred or the cursor attempts to drag out
	 * of the window.
	 * Note: This will not always trigger with IE thanks to it's event system.
	 *
	 * @param {Event} e The mouse/blur events that triggered this.
	*/
	SimpleClick2.handleDragOutOfWindow = function(e) {
		if (!e) e = window.event; // Go IE!
		if (e.type == "blur" || e.relatedTarget == document.documentElement
			|| (e.fromElement != null && e.toElement == null)) {
			if (SimpleClick2.i_start_x != null) {
				EventListener.silence(document.body, "onmouseup", SimpleClick2.i_monitor_up);
				EventListener.silence(document, "onmouseout", SimpleClick2.i_monitor_out);
				EventListener.silence(window, "onblur" , SimpleClick2.i_monitor_blur);
				EventListener.silence(document.body, "ondragstart" , SimpleClick2.i_monitor_drag);
				CursorMonitor.removeListener(SimpleClick2.i_monitor_id);
				
				if (SimpleClick2.i_drag_init == true) {
					document.body.removeChild(SimpleClick2.getDragDiv());
					SystemCore.windowManager().captureAll(false);
				}
				
				SimpleClick2.i_start_x = null;
				SimpleClick2.i_start_y = null;
				SimpleClick2.i_active_sc = null;
				SimpleClick2.i_active_node = null;
				SimpleClick2.i_monitor_id = null;
				SimpleClick2.i_monitor_up = null;
				SimpleClick2.i_monitor_blur = null;
				SimpleClick2.i_monitor_out = null;
				SimpleClick2.i_monitor_drag = null;
				SimpleClick2.i_drag_init = null;
			}
		}
	}
	
	/**
	 *	Internal handler for when a contact is selected
	 *
	 *	@private
	 *
	 *	@param tree the tree that called this
	 *	@param display The node used to display in the tree
	 *	@param node the actual node
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleClick = function(tree, display, node, e) {
		if (node.group != undefined && ApplicationOldContacts != undefined) {
			ApplicationOldContacts.i_lastSimpleClick = node.group;
		}
		if (node.group != undefined && (node.group.uuid=="AllPers" || node.group.uuid=="AllEnt"))
			return true; // Do NOT allow anyone to select the 'My Contacts' or 'All Enterprise' groups as destinations of any SimpleClick action
		if (tree.i_simple_click.i_listen_stack.length > 0) {
			var o = tree.i_simple_click.i_listen_stack[tree.i_simple_click.i_listen_stack.length - 1];
			if (o.type == "both" || (o.type == "group" && node.contact == undefined) || (o.type == "contact" && node.contact != undefined)) {
				if (o.func.execute != undefined) {
					o.func.execute.call((o.scope != undefined ? o.scope : this), Array(tree.i_simple_click.i_accord.activeBar().name(), node.group, node.contact));
				}
				else {
					o.func.call((o.scope != undefined ? o.scope : this), tree.i_simple_click.i_accord.activeBar().name(), node.group, node.contact);
				}
			}
		}
		if (tree.i_simple_click.i_accord.activeBar() == tree.i_simple_click.i_accord_online) {
			SimpleClick2.handleImContact(undefined, node, undefined);
		}
		return true;
	}
	

	
	/**
	 *	Handle when the accordion is changed
	 *
	 *	@param e The event that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleFocusChange = function(e) {
		this.parent().i_simple_click.getTree().dataModel(this.i_data_model());
		this.contentPane().appendChild(this.parent().i_simple_click.getTree().getTree());
		this.parent().i_simple_click.getTree().scrollPosition(0);
		this.parent().i_simple_click.getTree().refresh();
		if (this.parent().i_simple_click.handleViewChange) {
			this.parent().i_simple_click.handleViewChange(e.bar.name());
		}
		if(typeof ExtensionBannerAds != "undefined")
			ExtensionBannerAds.refreshAll();
	}
	
	/**
	 *	Handle when the content pane in the accordion view resizes
	 *
	 *	@param e the event that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleResize = function(e) {	
		if (this.parent().i_simple_click.i_tree != undefined && this.parent().i_simple_click.i_simple_click != undefined) {
			this.parent().i_simple_click.i_tree.width(this.parent().i_simple_click.i_accord.width());
			this.parent().i_simple_click.i_tree.height(this.parent().i_simple_click.i_accord.contentHeight());
		}
	}
	
	/**
	 *	Get the data model that contains the personal contacts
	 *
	 *	@return the data model to load personal contacts
	 */
	SimpleClick2.getPersonalDataModel = function() {
		return SimpleClickDataCache.getLiteTreeDataModel("personal");
	}
	
	/**
	 *	Get the data model that contains the enterprise contacts
	 *
	 *	@return the data model that contains enterprise contaccts
	 */
	SimpleClick2.getEnterpriseDataModel = function() {
		return SimpleClickDataCache.getLiteTreeDataModel("enterprise");
	}
	
	/**
	 *	Get the data model that contains shared contacts
	 *
	 *	@return the data model that contains shared contacts
	 */
	SimpleClick2.getSharedDataModel = function() {
		return SimpleClickDataCache.getLiteTreeDataModel("shared");
	}
	
	/**
	 *	Get the data model that contains online contacts
	 *
	 *	@return the data model that contains online contacts
	 */
	SimpleClick2.getOnlineDataModel = function() {
		return SimpleClickDataCache.getLiteTreeDataModel("currentlyOnline");
	}
	

	/**
	 *	Get the context menu used for simple click groups
	 *
	 *	@return the context menu for simple click groups
	 */
	SimpleClick2.prototype.getGroupContextMenu = function() {
		if (this.i_group_context == undefined) {
			this.i_group_context = new ContextMenu(200);
	
			this.i_group_context_email = this.i_group_context.addItem(new ContextMenuItem("Email Group", true, SimpleClick2.handleEmailGroup));
			if (ApplicationOldContacts.hasCal) {
				this.i_group_context_schedule = this.i_group_context.addItem(new ContextMenuItem("Schedule Event", true, SimpleClick2.handleScheduleGroup));
			}
			this.i_group_context.addItem(new ContextMenuDivider());
			if (ApplicationOldContacts.hasShare) {
				this.i_group_context_share = this.i_group_context.addItem(new ContextMenuItem("Share Group", true, SimpleClick2.handleShareGroup));
			}
			this.i_group_context_modify = this.i_group_context.addItem(new ContextMenuItem("Modify Group", true, SimpleClick2.handleModifyGroup));
			this.i_group_context_delete = this.i_group_context.addItem(new ContextMenuItem("Delete Group", true, SimpleClick2.handleDeleteGroup));
			this.i_group_context_new = this.i_group_context.addItem(new ContextMenuItem("New Group", true, SimpleClick2.handleNewGroup));
			this.i_group_context.addItem(new ContextMenuDivider());
			this.i_group_context_new_contact = this.i_group_context.addItem(new ContextMenuItem("New Contact", true, SimpleClick2.handleNewContact));
		}
		return this.i_group_context;
	}
	
	/**
	 *	Get the context menu used for simple click contacts
	 *
	 *	@return the context menu used for simple click contacts
	 */
	SimpleClick2.prototype.getContactContextMenu = function() {
		if (this.i_contact_context == undefined) {
			this.i_contact_context = new ContextMenu(210);
			this.i_contact_context_email = this.i_contact_context.addItem(new ContextMenuItem("Email Contact", true, SimpleClick2.handleEmailContact));

			this.i_contact_context_efax = this.i_contact_context.addItem(new ContextMenuItem("Send Fax", true, SimpleClick2.handleFaxContact));
			if(!ApplicationOldContacts.efaxEnabled) {
				this.i_contact_context_efax.visible(false);
			}

			if (SystemCore.hasApp(1004)) {
				this.i_contact_context_schedule = this.i_contact_context.addItem(new ContextMenuItem("Schedule Event", true, SimpleClick2.scheduleContact));
			}

			if (SystemCore.hasApp(1010)) {
				this.i_contact_context_IM = this.i_contact_context.addItem(new ContextMenuItem("Send IM", true, SimpleClick2.handleImContact));
			}
			
			this.i_contact_context.addItem(new ContextMenuDivider());
			this.i_contact_context_modify = this.i_contact_context.addItem(new ContextMenuItem("Modify Contact", true, SimpleClick2.handleModifyContact));
			this.i_contact_context_delete = this.i_contact_context.addItem(new ContextMenuItem("Delete Contact", true, SimpleClick2.handleDeleteContact));
			this.i_contact_context_new = this.i_contact_context.addItem(new ContextMenuItem("New Contact", true, SimpleClick2.handleNewContact));
			this.i_contact_context_remove_from_group = this.i_contact_context.addItem(new ContextMenuItem("Remove Contact From Group", true, SimpleClick2.handleRemoveContactFromGroup));
			if (SystemCore.hasApp(1010)) {
				this.i_contact_context_add_to_co = this.i_contact_context.addItem(new ContextMenuItem("Add To Currently Online", true, SimpleClick2.handleAddToCo));
				this.i_contact_context_remove_from_co = this.i_contact_context.addItem(new ContextMenuItem("Remove From Currently Online", true, SimpleClick2.handleRmFromCo));
			}
		}
		return this.i_contact_context;
	}
	
	/**
	 *	Get the context menu for refresh
	 *
	 *	@return the context menu for refresh
	 */
	SimpleClick2.prototype.getRefreshContextMenu = function() {
		if (this.i_refresh_context == undefined) {	
			this.i_refresh_context = new ContextMenu(150, "<b>Currently Online</b>");
			this.i_co_context_email = this.i_refresh_context.addItem(new ContextMenuItem("Email Contact", true, SimpleClick2.handleEmailContact));
			if (SystemCore.hasApp(1004)) {
				this.i_co_context_schedule = this.i_refresh_context.addItem(new ContextMenuItem("Schedule Event", true, SimpleClick2.scheduleContact));
			}
			if (SystemCore.hasApp(1010)) {
				this.i_co_context_IM = this.i_refresh_context.addItem(new ContextMenuItem("Send IM", true, SimpleClick2.handleImContact));
			}
			this.i_refresh_context.addItem(new ContextMenuDivider());
			this.i_refresh_context_refresh = this.i_refresh_context.addItem(new ContextMenuItem("Refresh", true, SimpleClick2.handleRefreshCurrentlyOnline));
		}
		return this.i_refresh_context;
	}
	
	/**
	 *	Internal handler for when a context menu is requested off a node in a tree
	 *
	 *	@private
	 *
	 *	@param tree the tree that called this
	 *	@param display The node used to display in the tree
	 *	@param node the actual node
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleContextMenu = function(tree, display, node, e) {
		if (tree.i_simple_click.i_accord.activeBar() == tree.i_simple_click.i_accord_online) {
			tree.i_simple_click.getRefreshContextMenu().contextFocus(node);
			tree.i_simple_click.getRefreshContextMenu().show(CursorMonitor.getX(), CursorMonitor.getY());
			e.cancelBubble = true;
			return false;
		}

		if (node.group != undefined && ApplicationOldContacts != undefined) {
			ApplicationOldContacts.i_lastSimpleClick = node.group;
		}
		
		var all_ent=SimpleClickDataCache.findUser("All_enterprise");
		if (node.type == "group") {
			var groupType = SimpleClickDataCache.getModelType(node.group.uuid);

			tree.i_simple_click.getGroupContextMenu();
			if (tree.i_simple_click.i_group_context_share != undefined) {
				tree.i_simple_click.i_group_context_share.enabled(ApplicationOldContacts.hasShare && node.group.access=="f" && groupType != "shared");
			}
			if (node.group.uuid == "AllPers") {
				tree.i_simple_click.i_group_context_modify.enabled(false);
				tree.i_simple_click.i_group_context_delete.enabled(false);
				tree.i_simple_click.i_group_context_new_contact.enabled(true);
			} if (node.group.uuid == "AllEnt") {
				tree.i_simple_click.i_group_context_modify.enabled(false);
				tree.i_simple_click.i_group_context_delete.enabled(false);
				tree.i_simple_click.i_group_context_new_contact.enabled(SimpleClickDataCache.canAddEnterpriseContacts());
			} else {
				tree.i_simple_click.i_group_context_modify.enabled(node.group.access == "f");
				tree.i_simple_click.i_group_context_delete.enabled(node.group.access == "f" && groupType != "shared");
				tree.i_simple_click.i_group_context_new_contact.enabled(node.group.access == "f");
			}
			tree.i_simple_click.i_group_context_new.enabled(tree.i_simple_click.i_accord.activeBar() == tree.i_simple_click.i_accord_personal || (tree.i_simple_click.i_accord.activeBar() == tree.i_simple_click.i_accord_enterprise && SimpleClickDataCache.canAddEnterpriseGroups()));

			tree.i_simple_click.i_group_context_email.enabled(!(node.group.uuid=="AllPers" || node.group.uuid=="AllEnt"));

			if( typeof tree.i_simple_click.i_group_context_schedule != 'undefined' ) 
				tree.i_simple_click.i_group_context_schedule.enabled(!(node.group.uuid=="AllPers" || node.group.uuid=="AllEnt"));
			
			tree.i_simple_click.getGroupContextMenu().contextFocus(node);
			tree.i_simple_click.getGroupContextMenu().show(CursorMonitor.getX(), CursorMonitor.getY());
		}
		else {
			tree.i_simple_click.getContactContextMenu();
			tree.i_simple_click.i_contact_context_email.enabled(node.contact.email != undefined && node.contact.email.length>0);
			tree.i_simple_click.i_contact_context_efax.enabled(node.contact.fax != undefined && node.contact.fax.length>0);
			if (SystemCore.hasApp(1004)) 
				tree.i_simple_click.i_contact_context_schedule.enabled(node.contact.email != undefined && node.contact.email.length>0);
			if (SystemCore.hasApp(1010)) 
				tree.i_simple_click.i_contact_context_IM.enabled(node.contact.username != undefined && node.contact.username.length>0);

			tree.i_simple_click.i_contact_context_modify.enabled(node.contact.access=="w" || node.contact.access == "f");
			tree.i_simple_click.i_contact_context_delete.enabled(node.contact.access == "f");
			tree.i_simple_click.i_contact_context_new.enabled(node.parent().group.access=="f");

			tree.i_simple_click.i_contact_context_remove_from_group.enabled(node.parent().group.uuid.substr(0, 3) != "All" && (node.parent().group.access == "f"));

			var fico = SimpleClickDataCache.findInCO(node.contact.username);
			if (SystemCore.hasApp(1010)) {
				tree.i_simple_click.i_contact_context_add_to_co.enabled(node.contact.username != undefined && node.contact.username.length>0 && fico == -1);
				tree.i_simple_click.i_contact_context_remove_from_co.enabled(node.contact.username != undefined  && node.contact.username.length>0 && fico > -1);
				}

			tree.i_simple_click.getContactContextMenu().contextFocus(node);
			tree.i_simple_click.getContactContextMenu().show(CursorMonitor.getX(), CursorMonitor.getY());
		}
		
		
		
		e.cancelBubble = true;
		return false;
	}
	
	
	/**
	 *	Get the DIV that contains simple click
	 *
	 *	@return the DIV that contains simple click
	 */
	SimpleClick2.prototype.getSimpleClick = function( disableCurrentlyOnline ) {
		if (this.i_simple_click == undefined) {
			this.i_simple_click = document.createElement('DIV');
			this.i_simple_click.className = "SimpleClick_n";
			this.i_simple_click.style.width = this.width() + "px";
			this.i_simple_click.style.height = this.height() + "px";
			// Bug #139058 Fix - Added hidden overflow to prevent scrollbars in Firefox
			if (document.all == undefined) this.i_simple_click.style.overflow = "hidden";
			////
			
			this.i_accord = new AccordionPane(this.width(), this.height());
			this.i_accord.i_simple_click = this;
			this.i_accord.onviewchange = SimpleClick2.handleViewChange;
					
			this.i_accord_personal = this.i_accord.addBar(new AccordionBar("Personal", true));
			this.i_accord_personal.i_data_model = SimpleClick2.getPersonalDataModel;
			EventListener.listen(this.i_accord_personal, "onfocus", SimpleClick2.handleFocusChange);
			EventListener.listen(this.i_accord_personal, "onresize", SimpleClick2.handleResize);
					
			if (!_LITE_ && ApplicationOldContacts.hasEnterprise) {
				this.i_accord_enterprise = this.i_accord.addBar(new AccordionBar("Enterprise"));
				this.i_accord_enterprise.i_data_model = SimpleClick2.getEnterpriseDataModel;
				EventListener.listen(this.i_accord_enterprise, "onfocus", SimpleClick2.handleFocusChange);
				EventListener.listen(this.i_accord_enterprise, "onresize", SimpleClick2.handleResize);
				}
				
			if (!_LITE_ && ApplicationOldContacts.hasShare) {
				this.i_accord_shared = this.i_accord.addBar(new AccordionBar("Shared"));
				this.i_accord_shared.i_data_model = SimpleClick2.getSharedDataModel;
				EventListener.listen(this.i_accord_shared, "onfocus", SimpleClick2.handleFocusChange);
				EventListener.listen(this.i_accord_shared, "onresize", SimpleClick2.handleResize);
			}
			if (!_LITE_) {
				if ( !disableCurrentlyOnline && SystemCore.hasApp(1010)) {
					this.i_accord_online = this.i_accord.addBar(new AccordionBar("Currently Online"));
					this.i_accord_online.i_data_model = SimpleClick2.getOnlineDataModel;
					EventListener.listen(this.i_accord_online, "onfocus", SimpleClick2.handleFocusChange);
					EventListener.listen(this.i_accord_online, "onresize", SimpleClick2.handleResize);
				}
			}
					
			this.i_simple_click.appendChild(this.i_accord.getPane());
					
		}
		return this.i_simple_click;
	}
	
	/**
	 *	Get a string that represents the current open/closed state of all groups plus the accordian bar
	 *
	 *	@return string in the format: barName:uuid1,uuid2,uuid3... 
	 *		where barName in (enterprise, personal, shared, currentlyOnline)
	 *		uuid's are the uuid's of groups that are "open"
	 */
	SimpleClick2.prototype.getSimpleClickState = function( ) {
		var retVal="";
		if (this.i_accord.activeBar()==this.i_accord_personal ) retVal="personal;";
		if (this.i_accord.activeBar()==this.i_accord_enterprise ) retVal="enterprise;";
		if (this.i_accord.activeBar()==this.i_accord_shared ) retVal="shared;";
		if (this.i_accord.activeBar()==this.i_accord_online ) retVal="currentlyOnline;";

		var nodes=this.i_tree.dataModel().openNodes();
		for (var i=0;i<nodes.length;i++) retVal+=nodes[i].uuid+",";
		return retVal;
	}
	
	/**
	 *	Given a string that represents the current open/closed state of all groups plus the accordian bar
	 *	Restore the simpleClick to the state that it was in
	 *
	 *	@param string in the format: barName:uuid1,uuid2,uuid3... 
	 *		where barName in (enterprise, personal, shared, currentlyOnline)
	 *		uuid's are the uuid's of groups that are "open"
	 */
	SimpleClick2.prototype.setSimpleClickState = function( state ) {
		if (state == undefined)
			return;
		var splitState=state.split(";");
		if (splitState.length!=2) // activebar on one side, uuids on the other
			return;

		if (splitState[0]=="personal") this.i_accord_personal.active(true);
		if (splitState[0]=="enterprise") this.i_accord_enterprise.active(true);
		if (splitState[0]=="shared") this.i_accord_shared.active(true);
		if (splitState[0]=="currentlyOnline") {this.i_accord_online.active(true);return;}

		var openNodes=splitState[1].split(",");
		var nodes=this.i_tree.dataModel().rootNode().children();
		if (nodes==undefined) return;
		for (var i=0;i<nodes.length;i++) for (var j=0;j<openNodes.length;j++)
				if (nodes[i].uuid==openNodes[j])
					nodes[i].open(true);
	}
	
	/**
	 *	Remove the enterprise bar from SimpleClick
	 */
	SimpleClick2.prototype.removeEnterprise = function( ) {
		this.i_accord.removeBar(this.i_accord_enterprise);
		if (this.i_accord.activeBar() == this.i_accord_enterprise) {
			this.i_accord_personal.active(true);
			}
		}
/*
	%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% API INTERFACE %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
	
	/**
	 *	Handle a new group email
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleEmailGroup = function(but, foc, e) {
		SimpleClickDataCache.emailGroup(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle scheduling of a group
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleScheduleGroup = function(but, foc, e) {
		SimpleClickDataCache.scheduleGroup(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle sharing of a group
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleShareGroup = function(but, foc, e) {
		SimpleClickDataCache.shareGroup(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle modifing a group
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleModifyGroup = function(but, foc, e) {
		SimpleClickDataCache.modifyGroup(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle deleting a group
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleDeleteGroup = function(but, foc, e) {
		SimpleClickDataCache.deleteGroup(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle a new group email
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleNewGroup = function(but, foc, e) {
		SimpleClickDataCache.newGroup(foc.uuid, foc.type)
	}
	
	/**
	 *	Handle emailing a contact
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleEmailContact = function(but, foc, e) {
		SimpleClickDataCache.emailContact(foc.uuid, foc.type);
	}

	/**
	 *	Handle faxing a contact
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleFaxContact = function(but, foc, e) {
		EfaxContactsInterface.obj.newFax(foc.uuid);
	}
	
	/**
	 *	Schedule a contact
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.scheduleContact = function(but, foc, e) {
		SimpleClickDataCache.scheduleContact(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle IM'ing a contact
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleImContact = function(but, foc, e) {
		if( foc.contact ) {
			if( foc.contact.username ) {
				SimpleClickDataCache.imContactByUsername(foc.contact.username);
				return;
			}
		}
		SimpleClickDataCache.imContact(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle modifing a contact
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleModifyContact = function(but, foc, e) {
		SimpleClickDataCache.modifyContact(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle deleting a contact
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleDeleteContact = function(but, foc, e) {
		SimpleClickDataCache.deleteContact(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle creating a new contact
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleNewContact = function(but, foc, e) {
		SimpleClickDataCache.newContact(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle removing a contact from a certain group.
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleRemoveContactFromGroup = function(but, foc, e) {
		SimpleClickDataCache.removeContactFromGroup(foc.parent().uuid, foc.uuid);
	}

	/**
	 *	Handle adding a contact to currently online
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleAddToCo = function(but, foc, e) {
		SimpleClickDataCache.addToCo(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle removing a contact from the currently online list
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleRmFromCo = function(but, foc, e) {
		SimpleClickDataCache.rmFromCo(foc.uuid, foc.type);
	}
	
	/**
	 *	Handle refreshing contacts in currently online
	 *
	 *	@param but the button on the context menu
	 *	@param foc the focus of the context menu
	 *	@param e The even that triggered this
	 *
	 *	@return true
	 */
	SimpleClick2.handleRefreshCurrentlyOnline = function(but, foc, e) {
		ExtensionBannerAds.refreshAll();
		SimpleClickDataCache.getCurrentlyOnline();
	}
	
	
	
	
	
	
// -----------------------------------
// -- Resource Manager Notification --
// -----------------------------------

JavaScriptResource.notifyComplete("./src/Applications/OldContacts/components/Component.SimpleClick2.js" );
JavaScriptResource.notifyComplete("./btAppOContactsCore.js");
