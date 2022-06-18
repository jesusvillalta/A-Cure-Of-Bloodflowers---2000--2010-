function ExtBannerAds(){
this.superApplication();
this.name("Banner Ads");
this.id(3006);
this.i_ads=new Array();
this.i_adHash=new Array();
this.i_impressions=new Array();
this.i_impressionsMutex=false;
this.i_hasBeenInitialized=false;
this.i_sidebarIsDisplaying=true;
EventHandler.register(this, "onintegrate", this.initialize, this);
EventHandler.register(this, "onintegrate", this.embedSimpleClick, this);
var self=this;
EventHandler.register(SystemCore, "onchangeapplication", function(o){
self.reconfigureSidebar(o.newApplication);
}, this);
}
ExtBannerAds.prototype.initialize=function(){
if(!this.i_hasBeenInitialized){
this.i_hasBeenInitialized=true;
var tempAds=GDSConfiguration.ads;
if(tempAds!=undefined){
var hasLeft=false;
var hasRight=false;
var hasWide=false;
this.i_hasLeaderboard=false;
this.i_hasSidebar=false;
this.i_hasMyDayAd=false;
if (tempAds.length > 0) {
WindowObject.movable(false);
}
var isTwoStory=undefined;
for(var x=0;x<tempAds.length; x++){
var thisAd=new Ad();
thisAd.readFromLiteObject(tempAds[x]);
if(thisAd.getType()==ExtensionBannerAds.constants.TWOBOXTOP || thisAd.getType()==ExtensionBannerAds.constants.TWOBOXBOTTOM){
if(isTwoStory==undefined) isTwoStory=true;
else if(isTwoStory==false){
}
}else if(thisAd.getType()==ExtensionBannerAds.constants.RIGHT){
if(isTwoStory==undefined) isTwoStory=false;
else if(isTwoStory==true){
}
}
this.i_ads[x]=thisAd;
this.i_adHash[thisAd.getType()]=thisAd;
this.i_impressions[thisAd.getType()]=0;
}
this.i_impressions[ExtensionBannerAds.constants.ALL]=0;
this.i_hasSidebar=(isTwoStory!=undefined);
this.i_sidebarIsDisplaying=!this.hasMyDayTall();
this.getSidebarDiv();
this.getLeaderboardDiv();
this.getLeftSidebarDiv();
this.getBaseboardDiv();
for(var x=0;x<this.i_ads.length;x++){
var thisAd=this.i_ads[x];
if(thisAd.getType()==ExtensionBannerAds.constants.MYDAY){
}else{
var iFrame=document.createElement("iframe");
thisAd.setIframe(iFrame);
if(thisAd.getType()==ExtensionBannerAds.constants.TWOBOXTOP ||
thisAd.getType()==ExtensionBannerAds.constants.TWOBOXBOTTOM ||
thisAd.getType()==ExtensionBannerAds.constants.RIGHT || 
thisAd.getType()==ExtensionBannerAds.constants.SKINNYRIGHT){
this.getSidebarDiv().appendChild(iFrame);
}else if(thisAd.getType()==ExtensionBannerAds.constants.LEADERBOARD){
var elem=this.getLeaderboardDiv();
elem.style.height="90px";
elem.style.width="728px";
elem.style.padding="0px";
elem.style.margin="4px 0px 4px 0px"; 
elem.appendChild(iFrame);
}else if(thisAd.getType()==ExtensionBannerAds.constants.LEADERBOARDLEFT ||
thisAd.getType()==ExtensionBannerAds.constants.LEADERBOARDRIGHT){
var divId="Leaderboard";
divId+=(thisAd.getType()==ExtensionBannerAds.constants.LEADERBOARDLEFT ? "Left" : "Right");
divId+="ButtonBannerAd";
var elem=document.getElementById(divId);
elem.style.width="120px";
elem.style.height="90px";
elem.style.padding="0px";
elem.style.overflow="hidden";
elem.appendChild(iFrame);
}else if(thisAd.getType()==ExtensionBannerAds.constants.BASEBOARD){
var elem=this.getBaseboardDiv();
elem.style.height="90px";
elem.style.width="728px";
elem.style.padding="0px";
elem.style.margin="4px 0px 4px 0px"; 
elem.appendChild(iFrame);
}else if(thisAd.getType()==ExtensionBannerAds.constants.BASEBOARDLEFT ||
thisAd.getType()==ExtensionBannerAds.constants.BASEBOARDRIGHT){
var divId="Baseboard";
divId+=(thisAd.getType()==ExtensionBannerAds.constants.BASEBOARDLEFT ? "Left" : "Right");
divId+="ButtonBannerAd";
var elem=document.getElementById(divId);
elem.style.width="120px";
elem.style.height="90px";
elem.style.padding="0px";
elem.style.overflow="hidden";
elem.appendChild(iFrame);
}else if(thisAd.getType()==ExtensionBannerAds.constants.LEFTTOP && !(this.hasBaseboard() || this.hasLeaderboard())) {
this.i_left_top_window=new WindowObject('ba-lt', "", 100, 100, undefined);
this.i_left_top_window.minimumHeight(242);
this.i_left_top_window.minimumWidth(122);
this.i_left_top_window.static_height(true, 242);
this.i_left_top_window.transparent(true);
var wrap=document.createElement('div');
wrap.style.textAlign="center";
wrap.appendChild(iFrame);
this.i_left_top_window.loadContent(wrap);
}else if(thisAd.getType()==ExtensionBannerAds.constants.LEFTBOTTOM && !(this.hasBaseboard() || this.hasLeaderboard())){
this.i_left_bottom_window=new WindowObject('ba-lb', "", 100, 100, undefined);
this.i_left_bottom_window.minimumHeight(62);
this.i_left_bottom_window.minimumWidth(122);
this.i_left_bottom_window.static_height(true, 62);
this.i_left_bottom_window.transparent(true);
var wrap=document.createElement('div');
wrap.style.textAlign="center";
wrap.className="ApplicationWorkspace";
wrap.style.padding="0px";
wrap.appendChild(iFrame);
this.i_left_bottom_window.loadContent(wrap);
}else if(thisAd.getType()==ExtensionBannerAds.constants.SKINNYRIGHT){
this.getSidebarDiv().appendChild(iFrame);	
}
}
this.reconfigureSidebar();
} 
this.reconfigureSidebar();
if(document.defaultView!=undefined && document.defaultView.getComputedStyle!=undefined){
document.getElementById("ApplicationWorkspace").parentNode.style.backgroundColor=document.defaultView.getComputedStyle(SystemCore.windowManager().getManager().parentNode,"").getPropertyValue("background-color");
}else{
document.body.style.backgroundColor=SystemCore.windowManager().getManager().parentNode.currentStyle.backgroundColor;
}
if(this.hasLeaderboard() || this.hasBaseboard()){
}else{
if(this.adExists(this.constants.LEFTTOP) || this.adExists(this.constants.LEFTBOTTOM)){
var win=WindowObject.getWindowById("con-simple-invisible");
if(win){
win.id("con-simple");
}
win=WindowObject.getWindowById("gen-shortcuts");
if(win){
win.id("gen-shortcuts-invisible");
}
}
}
var me=this;
setInterval(function(){me.handleLogImpressions(me);},30000);	
}
}
}	
ExtBannerAds.prototype.initEventHandlers=function(){
if(this.i_eventHandlers==undefined){
this.i_eventHandlers={};
var calApp=Application.getApplicationById("1004").getCalendarView();
if(calApp){
}
}
}
ExtBannerAds.prototype.hasMyDayAds=function(){
return (this.adExists(ExtensionBannerAds.constants.MYDAY) ||
this.adExists(ExtensionBannerAds.constants.MYDAYTALL) ||
this.adExists(ExtensionBannerAds.constants.MYDAYTALLSKINNY));
}
ExtBannerAds.prototype.clearAdWithType=function(type){
if(this.adExists(type)){
this.getAd(type).clearAd();
}
}
ExtBannerAds.prototype.reconfigureSidebar=function(app){
if(SystemCore.windowManager()!=undefined && typeof app!="undefined" && this.hasMyDayAds()){
if(!this.i_hasBeenInitialized) this.initialize();
var c=ExtensionBannerAds.constants;
if (app.id()==1020) {
this.regenerateMyDay();
}
if(app.id()==1020 && this.i_sidebarIsDisplaying && this.hasMyDayTall()){
this.i_sidebarIsDisplaying=false;
if(typeof this.getBaseboardDiv()!="undefined"){
this.getBaseboardDiv().parentNode.style.display="none";
}
if(typeof this.getSidebarDiv()!="undefined"){
this.getSidebarDiv().style.display="none";
}
fixSize();
this.clearAdWithType(c.BASEBOARD);
this.clearAdWithType(c.BASEBOARDLEFT);
this.clearAdWithType(c.BASEBOARDRIGHT);
this.clearAdWithType(c.TWOBOXTOP);
this.clearAdWithType(c.TWOBOXBOTTOM);
this.clearAdWithType(c.RIGHT);
this.clearAdWithType(c.SKINNYRIGHT);
}else if(app.id()!=1020) {
if (!this.i_sidebarIsDisplaying && this.hasMyDayTall()){
this.i_sidebarIsDisplaying=true;
if(typeof this.getBaseboardDiv().parentNode!="undefined"){
this.getBaseboardDiv().parentNode.style.display="block";
var needsRefresh=false;
if(this.adExists(c.BASEBOARD)){
if(this.getAd(c.BASEBOARD).setActive(true)) needsRefresh=true;
}
if(this.adExists(c.BASEBOARDLEFT)){
if(this.getAd(c.BASEBOARDLEFT).setActive(true)) needsRefresh=true;
}
if(this.adExists(c.BASEBOARDRIGHT)){
if(this.getAd(c.BASEBOARDRIGHT).setActive(true)) needsRefresh=true;
}
if(needsRefresh){ 
this.refreshAll();
}
}
if(typeof this.getSidebarDiv()!="undefined"){
this.getSidebarDiv().style.display="block";
}
fixSize();
} else { this.refreshAll() }
}
}
}
ExtBannerAds.prototype.hasMyDayAds=function(){
return (this.adExists(ExtensionBannerAds.constants.MYDAY) ||
this.adExists(ExtensionBannerAds.constants.MYDAYTALL) ||
this.adExists(ExtensionBannerAds.constants.MYDAYTALLSKINNY));
}
ExtBannerAds.prototype.refreshAll=function(){
this.getSidebarDiv();
if(this.i_ads.length > 0){
var me=this;
setTimeout(function(){
var successfulTypes=Array();
for(var x=0;x<me.i_ads.length;x++){
var adType=me.i_ads[x].getType();
try{
if(adType==me.constants.MYDAYANNOUNCEMENTS || 
(!me.i_sidebarIsDisplaying && (adType==me.constants.RIGHT ||
adType==me.constants.TWOBOXTOP ||
adType==me.constants.TWOBOXBOTTOM ||
adType==me.constants.SKINNYRIGHT ||
adType==me.constants.BASEBOARD ||
adType==me.constants.BASEBOARDLEFT ||
adType==me.constants.BASEBOARDRIGHT))){
successfulTypes[adType]=false;
}else{
me.i_ads[x].refresh();
successfulTypes[adType]=true;
}
}catch(e){
successfulTypes[adType]=false;
}
}
var cleanedTypes=Array();
for(type in successfulTypes){
if(successfulTypes[type]==true){
cleanedTypes.push(type);
}
}
if(document.all && me.i_simpleClickDiv!=undefined) {
var orig_disp=me.i_simpleClickDiv.style.display;
me.i_simpleClickDiv.style.display="none";
me.i_simpleClickDiv.style.display=orig_disp;
}
me.logImpressions(cleanedTypes);
me=undefined;
},100);
}
}
ExtBannerAds.prototype.refreshAdWithType=function(type){
try{
this.i_adHash[type].refresh();
this.logImpressions(Array(type));
}catch(e){
}
}
ExtBannerAds.prototype.lockImpressions=function(cb,me,params){
if(me.i_impressionsMutex==true){
setTimeout(function(){me.lockImpressions(cb,me,params);},100);
}else{
me.i_impressionsMutex=true;
cb(me,params);
}
}
ExtBannerAds.prototype.unlockImpressions=function(){
this.i_impressionsMutex=false;
}
ExtBannerAds.prototype.logImpressions=function(typeArray){
this.lockImpressions(this.logImpressions2,this,Array(typeArray));
}
ExtBannerAds.prototype.logImpressions2=function(me,params){
var typeArray=params[0];
var str="";
for(var x=0;x<typeArray.length;x++){
me.i_impressions[typeArray[x]]+=1;
}
me.i_impressions[ExtensionBannerAds.constants.ALL]+=1;
me.unlockImpressions();
}	
ExtBannerAds.prototype.handleLogImpressions=function(me){
me.lockImpressions(me.handleLogImpressions2,me);
}
ExtBannerAds.prototype.handleLogImpressions2=function(me){
var typeString="";
var hasImpressions=false;
for(var key in me.i_impressions){
if(key!="exists" && me.i_impressions[key] > 0){
hasImpressions=true;
typeString+=key+":"+me.i_impressions[key]+",";
me.i_impressions[key]=0;
}
}
me.unlockImpressions();
if(hasImpressions){
typeString=typeString.substr(0,typeString.length - 1);
var xml="<log><sid>"+user_prefs['session_id']+"</sid><unm>"+user_prefs['user_id']+"</unm><t>"+typeString+"</t></log>";
var post=new ResourcePost();
post.param("unm",user_prefs['user_name']);
post.param("sid",user_prefs['session_id']);
post.param("xml",xml);
ResourceManager.request("/cgi-bin/phoenix/LogImpressionsCGI.fcg",1,
ExtBannerAds.handleLogImpressions3,post,Array(typeString,me));
}
}
ExtBannerAds.prototype.handleLogImpressions3=function(data,xml,req,arr){
var typeString=arr[0];
var me=arr[1];
try{
var result=eval("("+data+")");
if(result.code=="20000000"){
}else{
throw "Fail";
}
}catch(e){
var types=typeString.split(",");
for(var x=0;x<types.length;x++){
var thisType=types[x].split(":");
var typeID=thisType[0];
var count=thisType[1];
var oldV=me.i_impressions[typeID];
me.i_impressions[typeID]+=parseInt(count);
var newV=me.i_impressions[typeID];
}
}
}
ExtBannerAds.prototype.getSidebarDiv=function(){
if(!this.i_hasBeenInitialized) this.initialize();
if(this.hasSidebar() && this.i_sidebarDiv==undefined){
this.i_sidebarDiv=document.createElement("div");
this.i_sidebarDiv.style.width=(this.adExists(ExtensionBannerAds.constants.SKINNYRIGHT) ? "120px" : "160px");
this.i_sidebarDiv.style.height="100%";
this.i_sidebarDiv.style.border="0px none";
this.i_sidebarDiv.style.margin="0px";
this.i_sidebarDiv.style.position="absolute";
this.i_sidebarDiv.style.right="0px";
this.i_sidebarDiv.style.top="0px";
this.i_sidebarDiv.style.backgroundColor="#FFFFFF";
document.body.appendChild(this.i_sidebarDiv);
}
if(typeof this.i_sidebarDiv!="undefined") this.i_sidebarDiv.style.display=(this.i_sidebarIsDisplaying ? "block" : "none");
return this.i_sidebarDiv;
}
ExtBannerAds.prototype.getLeftSidebarDiv=function(){
if(this.hasLeftSidebar() && this.i_leftSidebarDiv==undefined){
this.i_leftSidebarDiv=document.getElementById("LeftBannerAdsDiv");
this.i_leftSidebarDiv.style.width="120px";
this.i_leftSidebarDiv.style.height="100%";
this.i_leftSidebarDiv.style.margin="0px";
}
return this.i_leftSidebarDiv;
}
ExtBannerAds.prototype.hasLeftSidebar=function(){
return false;
if(!this.i_hasBeenInitialized) this.initialize();
return (this.adExists(ExtensionBannerAds.constants.LEFTTOP) || 
this.adExists(ExtensionBannerAds.constants.LEFTBOTTOM));
}
ExtBannerAds.prototype.getLeaderboardDiv=function(){
if(!this.i_hasBeenInitialized) this.initialize();
if(this.i_leaderboardDiv==undefined){
this.i_leaderboardDiv=document.getElementById("LeaderboardBannerAd");
var elem=null;
var hasWide=this.adExists(ExtensionBannerAds.constants.LEADERBOARD);
var hasLeftFlank=this.adExists(ExtensionBannerAds.constants.LEADERBOARDLEFT);
var hasRightFlank=this.adExists(ExtensionBannerAds.constants.LEADERBOARDRIGHT);
this.i_leaderboardDiv.style.overflow="hidden";
if (hasWide || hasLeftFlank || hasRightFlank) this.i_leaderboardDiv.parentNode.style.marginTop="3px";
else this.i_leaderboardDiv.parentNode.style.display="none"; 
this.i_leaderboardDiv.style.display=(hasWide ? "" : "none");
elem=document.getElementById("LeaderboardLeftButtonBannerAd");
elem.style.display=(hasLeftFlank ? "" : "none");
elem.style.margin="4px 0px 4px "+(hasWide ? "0px" : "4px");
elem=document.getElementById("LeaderboardRightButtonBannerAd");
elem.style.display=(hasRightFlank ? "" : "none");
elem.style.margin="4px "+(hasWide || hasLeftFlank ? "4px" : "0px")+" 4px 0px";
this.i_leaderboardDiv.parentNode.style.backgroundColor=SystemCore.windowManager().getManager().parentNode.style.backgroundColor;
}
return this.i_leaderboardDiv;
}
ExtBannerAds.prototype.getBaseboardDiv=function(){
if(!this.i_hasBeenInitialized) this.initialize();
if(this.i_baseboardDiv==undefined){
this.i_baseboardDiv=document.getElementById("BaseboardBannerAd");
var elem=null;
var hasWide=this.adExists(ExtensionBannerAds.constants.BASEBOARD);
var hasLeftFlank=this.adExists(ExtensionBannerAds.constants.BASEBOARDLEFT);
var hasRightFlank=this.adExists(ExtensionBannerAds.constants.BASEBOARDRIGHT);
this.i_baseboardDiv.style.overflow="hidden";
if (hasWide || hasLeftFlank || hasRightFlank) this.i_baseboardDiv.parentNode.style.marginBottom="5px";
else this.i_baseboardDiv.parentNode.style.display="none"; 
this.i_baseboardDiv.style.display=(hasWide ? "" : "none");
elem=document.getElementById("BaseboardLeftButtonBannerAd");
elem.style.display=(hasLeftFlank ? "" : "none");
elem.style.margin="4px 0px 4px "+(hasWide ? "0px" : "4px");
elem=document.getElementById("BaseboardRightButtonBannerAd");
elem.style.display=(hasRightFlank ? "" : "none");
elem.style.margin="4px "+(hasWide || hasLeftFlank ? "4px" : "0px")+" 4px 0px";
}
if(typeof this.i_baseboardDiv!="undefined") this.i_baseboardDiv.parentNode.style.display=(this.i_sidebarIsDisplaying ? "" : "none");
return this.i_baseboardDiv;
}
ExtBannerAds.prototype.hasBaseboard=function(){
if(!this.i_hasBeenInitialized) this.initialized();
return (this.adExists(ExtensionBannerAds.constants.BASEBOARD) ||
this.adExists(ExtensionBannerAds.constants.BASEBOARDLEFT) ||
this.adExists(ExtensionBannerAds.constants.BASEBOARDRIGHT));
}
ExtBannerAds.prototype.getAd=function(type){
return this.i_adHash[type];
}
ExtBannerAds.prototype.hasSidebar=function(){
if(!this.i_hasBeenInitialized) this.initialize();
return (this.adExists(ExtensionBannerAds.constants.RIGHT) ||
(this.adExists(ExtensionBannerAds.constants.TWOBOXTOP) &&
this.adExists(ExtensionBannerAds.constants.TWOBOXBOTTOM)) ||
this.adExists(ExtensionBannerAds.constants.SKINNYRIGHT));
}
ExtBannerAds.prototype.hasLeaderboard=function(){
if(!this.i_hasBeenInitialized) this.initialize();
return (this.adExists(ExtensionBannerAds.constants.LEADERBOARD) ||
this.adExists(ExtensionBannerAds.constants.LEADERBOARDLEFT) ||
this.adExists(ExtensionBannerAds.constants.LEADERBOARDRIGHT));
}
ExtBannerAds.prototype.hasSimpleClickAds=function() {
if(!this.i_hasBeenInitialized) this.initialize();
return ((this.adExists(ExtensionBannerAds.constants.LEFTTOP)) ||
(this.adExists(ExtensionBannerAds.constants.LEFTBOTTOM)));
}
ExtBannerAds.prototype.hasMyDayTall=function(){
if(!this.i_hasBeenInitialized) this.initialize();
return (this.adExists(ExtensionBannerAds.constants.MYDAYTALL) || this.adExists(ExtensionBannerAds.constants.MYDAYTALLSKINNY));
}
ExtBannerAds.prototype.appendSimpleClickAds=function(column) {
if(this.adExists(ExtensionBannerAds.constants.LEFTTOP) && !(this.hasBaseboard() || this.hasLeaderboard())) {
column.addWindow(new DisplayViewWindow("ba-lt", 240));
}
if(this.adExists(ExtensionBannerAds.constants.LEFTBOTTOM) && !(this.hasBaseboard() || this.hasLeaderboard())) {
column.addWindow(new DisplayViewWindow("ba-lb", 60));
}
}
ExtBannerAds.prototype.embedSimpleClick=function(){
if(this.hasLeaderboard() || this.hasBaseboard()){
if(typeof this.i_simpleClick=="undefined" && typeof ApplicationOldContacts!="undefined"){
this.i_simpleClick=ApplicationOldContacts.getSimpleClick();
this.i_simpleClick.width(this.embeddedSimpleClickWidth);
this.i_simpleClickDiv=document.getElementById("SimpleClickEmbedded");
this.i_simpleClickDiv.style.display="block";
this.i_simpleClickDiv.style.marginTop="5px";
this.i_simpleClickDiv.style.marginBottom="5px";
this.i_simpleClickDiv.className="window_manager_window";
this.i_simpleClickDiv.style.width=""+this.embeddedSimpleClickWidth+"px";
this.i_simpleClickTitleBar=new TitleBar(this.embeddedSimpleClickWidth,16,"SimpleClick");
if (ApplicationOldContacts.hasIM){
this.i_simpleClickRefreshIcon=new IconButton("IconButton_Refresh", 9, 9, 16, 16, "Refresh Currently Online", SimpleClick2.handleRefreshCurrentlyOnline);
this.i_simpleClickTitleBar.addButton(ApplicationOldContacts.i_title_refresh_sc);
}		
this.i_simpleClickDiv.appendChild(this.i_simpleClickTitleBar.getTitleBar());
this.i_simpleClickBackgroundDiv=document.createElement("div");
this.i_simpleClickBackgroundDiv.style.backgroundColor="#FFFFFF";
this.i_simpleClickDiv.appendChild(this.i_simpleClickBackgroundDiv);
if(this.adExists(ExtensionBannerAds.constants.LEFTTOP)){
this.i_leftTopAdDiv=document.createElement("div");
this.i_leftTopAdDiv.style.width=this.embeddedSimpleClickWidth+"px";
this.i_leftTopAdDiv.style.height="240px";
this.i_leftTopAdDiv.style.margin="5px auto 0px";
this.i_leftTopAdIframe=document.createElement("iframe");
this.i_leftTopAdDiv.appendChild(this.i_leftTopAdIframe);
this.i_simpleClickDiv.appendChild(this.i_leftTopAdDiv);
this.i_adHash[ExtensionBannerAds.constants.LEFTTOP].setIframe(this.i_leftTopAdIframe);
}
if(this.adExists(ExtensionBannerAds.constants.LEFTBOTTOM)){
this.i_leftBottomAdDiv=document.createElement("div");
this.i_leftBottomAdDiv.style.width=this.embeddedSimpleClickWidth+"px";
this.i_leftBottomAdDiv.style.height="60px";
this.i_leftBottomAdDiv.style.margin="5px auto 0px";
this.i_leftBottomAdIframe=document.createElement("iframe");
this.i_leftBottomAdDiv.appendChild(this.i_leftBottomAdIframe);
this.i_simpleClickDiv.appendChild(this.i_leftBottomAdDiv);
this.i_adHash[ExtensionBannerAds.constants.LEFTBOTTOM].setIframe(this.i_leftBottomAdIframe);
}
}
var win=WindowObject.getWindowById("con-simple");
if(win && (this.hasLeaderboard() || this.hasBaseboard())){
win.id("con-simple-invisible");
}
win=WindowObject.getWindowById("gen-shortcuts");
if(win){
win.id("gen-shortcuts-invisible");
}
if(this.i_simpleClickBackgroundDiv!=undefined && this.i_simpleClickBackgroundDiv.childNodes.length==0){
this.i_simpleClickBackgroundDiv.appendChild(this.i_simpleClick.getSimpleClick());
}
}
}
ExtBannerAds.prototype.embeddedSimpleClickWidth=120+(document.all ? 4 : 0);
ExtBannerAds.prototype.adjustSizes=function(){
var needsRefresh=false;
var margin=5;
if(!this.i_hasBeenInitialized) this.initialize();
var windowHeight=(CursorMonitor.browserHeight() - 9) - SystemCore.navigationBar().height(); 
var wmHeightPadding=this.getWindowManagerHeightPadding(); 
if(ExtensionBannerAds.hasLeaderboard() || ExtensionBannerAds.hasBaseboard()){
if (this.i_simpleClick==undefined) this.embedSimpleClick();
var windowWidth=CursorMonitor.browserWidth() - (document.all ? 9 : 0); 
var ieWidthPadding=(document.all ? 21 : 12); 
var wmWidthPadding=this.getWindowManagerWidthPadding(); 
var simpleClickPadding=(this.i_simpleClick==undefined ? 0 : this.embeddedSimpleClickWidth+margin);
var usableWidth=windowWidth - wmWidthPadding - simpleClickPadding - ieWidthPadding;
var scHeight=windowHeight - margin; 
SystemCore.windowManager().getManager().parentNode.style.marginLeft=simpleClickPadding+2; 
SystemCore.windowManager().getManager().parentNode.style.width=usableWidth;
SystemCore.windowManager().getManager().parentNode.parentNode.style.width=windowWidth - wmWidthPadding;
SystemCore.windowManager().width(usableWidth);
if(this.hasSimpleClickAds()){
var ieBorderBugPadding=(document.all ? 10 : 0);
if(this.adExists(ExtensionBannerAds.constants.LEFTTOP)) {
scHeight -=(245+ieBorderBugPadding);
}
if(this.adExists(ExtensionBannerAds.constants.LEFTBOTTOM)) {
scHeight -=(65+ieBorderBugPadding);
}
}
if(this.i_simpleClick!=undefined){
scHeight -=16 - 2+(document.all ? margin * 3 : 0); 
this.i_simpleClickDiv.style.height=scHeight+"px";
this.i_simpleClickBackgroundDiv.style.height=scHeight+"px";
this.i_simpleClick.height(scHeight);
}
if(this.adjustSizeForType(ExtensionBannerAds.constants.BASEBOARD)) needsRefresh=true;
if(this.adjustSizeForType(ExtensionBannerAds.constants.LEADERBOARD)) needsRefresh=true;
}
if(_LITE_ && ExtensionBannerAds.hasSimpleClickAds()){
windowHeight -=wmHeightPadding;
if(this.adExists(ExtensionBannerAds.constants.LEFTTOP)){
windowHeight -=245;
}
if(this.adExists(ExtensionBannerAds.constants.LEFTBOTTOM)){
windowHeight -=65;
var oldMin=WindowObject.getWindowById("ba-lb").minimized();
WindowObject.getWindowById("ba-lb").minimized(windowHeight < 100);
if(oldMin==false && windowHeight >=100) needsRefresh=true;
}		
}
if(needsRefresh==true) this.refreshAll();
if (document.all) {
document.getElementById("ApplicationWorkspace").style.display="inline";
document.getElementById("ApplicationWorkspace").style.display="";
}
}
ExtBannerAds.prototype.adjustSizeForType=function(type) {
var margin=5;						
var needsRefresh=false;			
switch (type) {
case ExtensionBannerAds.constants.LEADERBOARD:
case ExtensionBannerAds.constants.BASEBOARD:
var isLeaderBoard=(type==ExtensionBannerAds.constants.LEADERBOARD);
var hasWide=this.adExists(isLeaderBoard ? ExtensionBannerAds.constants.LEADERBOARD : ExtensionBannerAds.constants.BASEBOARD);
var hasLeftFlank=this.adExists(isLeaderBoard ? ExtensionBannerAds.constants.LEADERBOARDLEFT : ExtensionBannerAds.constants.BASEBOARDLEFT);
var hasRightFlank=this.adExists(isLeaderBoard ? ExtensionBannerAds.constants.LEADERBOARDRIGHT : ExtensionBannerAds.constants.BASEBOARDRIGHT);
var boardDiv=(isLeaderBoard ? this.getLeaderboardDiv() : this.getBaseboardDiv());
if (!hasWide && !hasLeftFlank && !hasRightFlank) {
boardDiv.parentNode.style.display="none";
return true; 
}
var flankWidth=120;		
var boardWidth=728;		
var adHeight=90;			
var scPaddingOffset=margin;	
var flankUpdate=false;	
var wmWidthPadding=this.getWindowManagerWidthPadding(); 
var wmHeightPadding=this.getWindowManagerHeightPadding(); 
var simpleClickPadding=(this.i_simpleClick==undefined ? 0 : this.embeddedSimpleClickWidth+(2 * margin));
var ieWidthPadding=(document.all ? 20 : 12); 
var windowWidth=CursorMonitor.browserWidth() - (document.all ? 9 : 0); 
var windowHeight=(CursorMonitor.browserHeight() - 9) - SystemCore.navigationBar().height(); 
var usableWidth=7+windowWidth - wmWidthPadding - simpleClickPadding - ieWidthPadding - scPaddingOffset;
var currentWidth=usableWidth;
var change=0; 			
var usedWidth=0;
var show=true;
if (hasWide) {
var change=boardWidth; 
if ((usableWidth -=change) < 0) usableWidth=0;
usedWidth+=change;
}
if (hasLeftFlank) {
change=flankWidth+(2 * margin); 
show=usableWidth - change > 0;
flankUpdate=this.i_adHash[isLeaderBoard ? ExtensionBannerAds.constants.LEADERBOARDLEFT : ExtensionBannerAds.constants.BASEBOARDLEFT].setActive(show);
if (show) { 
if (flankUpdate) needsRefresh=true;
usableWidth -=change;
usedWidth+=change;
}
}
if (hasRightFlank) {
change=flankWidth+((hasWide || !hasLeftFlank ? 2 : 1) * margin); 
show=usableWidth - change > 0;
flankUpdate=this.i_adHash[isLeaderBoard ? ExtensionBannerAds.constants.LEADERBOARDRIGHT : ExtensionBannerAds.constants.BASEBOARDRIGHT].setActive(show);
if (show) { 
if (flankUpdate) needsRefresh=true;
usableWidth -=change;
usedWidth+=change;
}
}
var finalWidth=usableWidth+usedWidth;
if (document.all && currentWidth < finalWidth) {
finalWidth=currentWidth;
usableWidth=0;
boardDiv.style.width=(finalWidth > boardWidth ?  boardWidth : finalWidth)+"px";
} else {
boardDiv.style.width=boardWidth;
}
var centerMargin=Math.floor(usableWidth / 2);
if (!_LITE_) {
boardDiv.parentNode.style.paddingLeft=centerMargin+(document.all ? margin : simpleClickPadding+scPaddingOffset)+"px";
boardDiv.parentNode.style.paddingRight=centerMargin+"px";
}
boardDiv.parentNode.style.width=finalWidth+"px";
boardDiv.parentNode.style.height=adHeight+"px";
break;
}
return needsRefresh;
}
ExtBannerAds.prototype.regenerateMyDay=function(){
if (!_LITE_) {
var myday=Application.getApplicationById(1020);
if (myday!=undefined) {
var ad=this.i_adHash[ExtensionBannerAds.constants.MYDAY];
if (ad!=undefined) {
if (myday.i_win_bannerad==undefined) {
myday.i_win_bannerad=new WindowObject('my-bannerad', '', 302, 252);
myday.i_win_bannerad.minimumWidth(302);
myday.i_win_bannerad.static_height(true, 252);
EventHandler.register(myday.i_win_inbox, "oncontentresize", this.regenerateMyDay, this);
}
myday.i_win_bannerad.contentPane();   
this.i_myDayDiv=myday.i_win_bannerad.i_content_data;
this.i_myDayDiv.style.width="300px";
this.i_myDayDiv.style.height="250px";
this.i_myDayDiv.style.border="0px none";
this.i_myDayDiv.style.overflow="hidden";
var iFrame=ad.getIframe();
if (iFrame==undefined) {
iFrame=document.createElement("iframe");
}
iFrame.style.position="relative";
iFrame.style.top="-14px";
this.i_myDayDiv.appendChild(iFrame);
ad.setIframe(iFrame);
}
var announcements=this.i_adHash[ExtensionBannerAds.constants.MYDAYANNOUNCEMENTS];
if (announcements!=undefined) {
if (myday.i_win_announcements==undefined) {
myday.i_win_announcements=new WindowObject('my-announcements', 'Announcements', 100, 100, Application.titleBarFactory());
myday.i_win_announcements.titleBar().removeButton(Application.i_title_close);
}
myday.i_win_announcements.contentPane();
this.i_myDayAnnouncementsDiv=myday.i_win_announcements.i_content_data;
this.i_myDayAnnouncementsDiv.style.width="100%";
this.i_myDayAnnouncementsDiv.style.border="0px none";
iFrame=announcements.getIframe();
if (iFrame==undefined) {
iFrame=document.createElement("iframe");
}
iFrame.style.position="relative";
iFrame.style.top="-14px";
this.i_myDayAnnouncementsDiv.appendChild(iFrame);
announcements.setIframe(iFrame);
}
}
}
}
ExtBannerAds.prototype.getWindowManagerWidthPadding=function(){
if(!this.i_hasBeenInitialized) this.initialize();
var width=0;
if(this.i_sidebarIsDisplaying){
if(this.adExists(ExtensionBannerAds.constants.RIGHT) ||
(this.adExists(ExtensionBannerAds.constants.TWOBOXTOP) &&
this.adExists(ExtensionBannerAds.constants.TWOBOXBOTTOM))) width=161;
else if(this.adExists(ExtensionBannerAds.constants.SKINNYRIGHT)) width=121;
}
return width;
}
ExtBannerAds.prototype.getWindowManagerHeightPadding=function(){
var height=0;
if(this.adExists(ExtensionBannerAds.constants.LEADERBOARD) ||
this.adExists(ExtensionBannerAds.constants.LEADERBOARDLEFT) ||
this.adExists(ExtensionBannerAds.constants.LEADERBOARDRIGHT)) height+=(document.all ? 100 : 92);
if(this.i_sidebarIsDisplaying &&
(this.adExists(ExtensionBannerAds.constants.BASEBOARD) ||
this.adExists(ExtensionBannerAds.constants.BASEBOARDLEFT) ||
this.adExists(ExtensionBannerAds.constants.BASEBOARDRIGHT))) height+=(document.all ? 100 : 92);
return height;
}
ExtBannerAds.prototype.getMyDayAdWidth=function(){
return (this.adExists(ExtensionBannerAds.constants.MYDAYTALL) ? 300 : 
(this.adExists(ExtensionBannerAds.constants.MYDAYTALLSKINNY) ? 160 : 0));
}
ExtBannerAds.prototype.adExists=function(type){
return (typeof this.i_adHash[type]!="undefined");
}
ExtBannerAds.prototype.constants=new Object();
ExtBannerAds.prototype.constants.MYDAY=1;
ExtBannerAds.prototype.constants.TWOBOXTOP=2;
ExtBannerAds.prototype.constants.TWOBOXBOTTOM=3;
ExtBannerAds.prototype.constants.RIGHT=4;
ExtBannerAds.prototype.constants.LEADERBOARD=5;
ExtBannerAds.prototype.constants.BASEBOARD=6;
ExtBannerAds.prototype.constants.LEFTTOP=7;
ExtBannerAds.prototype.constants.LEFTBOTTOM=8;
ExtBannerAds.prototype.constants.LEADERBOARDLEFT=9;
ExtBannerAds.prototype.constants.LEADERBOARDRIGHT=10;
ExtBannerAds.prototype.constants.BASEBOARDLEFT=11;
ExtBannerAds.prototype.constants.BASEBOARDRIGHT=12;
ExtBannerAds.prototype.constants.SKINNYRIGHT=13;
ExtBannerAds.prototype.constants.MYDAYTALL=14;
ExtBannerAds.prototype.constants.MYDAYTALLSKINNY=15;
ExtBannerAds.prototype.constants.MYDAYANNOUNCEMENTS=90;
ExtBannerAds.prototype.constants.ALL=0;
ExtBannerAds.inherit(Application);
var ExtensionBannerAds=new ExtBannerAds();
SystemCore.registerApplication(ExtensionBannerAds);
JavaScriptResource.notifyComplete("./src/Extensions/BannerAds/Extension.BannerAds.js");
function Ad(){
this.i_type=undefined;
this.i_iframe=undefined;
this.i_code=undefined;
this.i_isActive=true;
}
Ad.prototype.getType=function(){
return this.i_type;
}
Ad.prototype.getIframe=function(){
return this.i_iframe;
}
Ad.prototype.getCode=function(){
return this.i_code;
}
Ad.prototype.setActive=function(active){
if(typeof this.i_iframe=="undefined"){
return false;	
}
var ret=(this.i_isActive==false && active==true);
this.i_isActive=(active==true);
if(!this.i_isActive){
this.i_iframe.parentNode.style.display="none";
}else{
this.i_iframe.parentNode.style.display="";
}
return ret;
}
Ad.prototype.getActive=function(){
return this.i_isActive;
}
Ad.prototype.setCode=function(newCode){
this.i_code=this.cleanupCode(newCode);
}
Ad.prototype.cleanupCode=function(newCode){
var currentCode=newCode;
return currentCode;
}
Ad.prototype.refresh=function(){
if(this.i_iframe!=undefined && this.i_type!=ExtensionBannerAds.constants.MYDAYANNOUNCEMENTS && this.i_isActive==true){
if((this.i_type==ExtensionBannerAds.constants.RIGHT ||
this.i_type==ExtensionBannerAds.constants.TWOBOXTOP ||
this.i_type==ExtensionBannerAds.constants.TWOBOXBOTTOM ||
this.i_type==ExtensionBannerAds.constants.SKINNYRIGHT) &&
(SystemCore.activeApplication().id()==1020 &&
ExtensionBannerAds.hasMyDayTall())){
throw "Not displaying this ad";
return;
}else if((this.i_type==ExtensionBannerAds.constants.MYDAY ||
this.i_type==ExtensionBannerAds.constants.MYDAYTALL) &&
(SystemCore.activeApplication().id()!=1020)) {
throw "Not displaying this ad";
return;
}else if(this.i_type==ExtensionBannerAds.constants.MYDAYANNOUNCEMENTS){
throw "Not an ad";
return;
}else{
if(!this.writeToAd(this.i_code)){
throw "No iframe properties";
}
}
}else throw "Error";
}
Ad.prototype.clearAd=function(){
this.writeToAd("<html><body></body></html>");
}
Ad.prototype.writeToAd=function(html){
var doc=this.i_iframe.contentDocument;
if((doc==undefined || doc==null) && this.i_iframe.contentWindow!=undefined)
doc=this.i_iframe.contentWindow.document;
if(doc!=undefined && doc!=null){
doc.open();
doc.write(this.i_code);
doc.close(); 
doc.body.style.margin="0px";	
return true;
}else return false;
}
Ad.prototype.setIframe=function(newIframe){
this.i_iframe=newIframe;
if(typeof this.i_iframe!="undefined"){
this.i_iframe.setAttribute("border","0");
this.i_iframe.setAttribute("frameBorder","0");
this.i_iframe.style.border="0px none transparent";
this.i_iframe.style.marginLeft=(this.i_type==5 || this.i_type==ExtensionBannerAds.constants.BASEBOARD ? "auto" : "0px");
this.i_iframe.style.marginRight=(this.i_type==5 || this.i_type==ExtensionBannerAds.constants.BASEBOARD ? "auto" : "0px");
this.i_iframe.style.overflow="hidden";
this.i_iframe.setAttribute("scrolling","no");
var width=0;
var height=0;
if(this.i_type==ExtensionBannerAds.constants.MYDAYANNOUNCEMENTS){
this.i_iframe.setAttribute("border","0");
this.i_iframe.setAttribute("frameBorder","0");
this.i_iframe.style.width="100%";
this.i_iframe.style.height="250px"; 
this.i_iframe.style.border="none";
this.i_iframe.style.overflowX="hidden";
this.i_iframe.style.overflowY="visible";
this.i_iframe.setAttribute("scrolling","yes");
this.i_iframe.src="/cgi-bin/phoenix/RetrieveAnnouncementsCGI.fcg?unm="+user_prefs['user_name']+"&sid="+user_prefs['session_id'];
return;
}
switch(this.i_type){
case ExtensionBannerAds.constants.MYDAY:
width=300;
height=250;
break;
case ExtensionBannerAds.constants.TWOBOXTOP: 
case ExtensionBannerAds.constants.TWOBOXBOTTOM:
width=160;
height=295;
break;
case ExtensionBannerAds.constants.RIGHT:
width=160;
height=600;
break;
case ExtensionBannerAds.constants.LEADERBOARD: 
case ExtensionBannerAds.constants.BASEBOARD:
width=728;
height=90;
break;
case ExtensionBannerAds.constants.LEFTTOP:
width=ExtensionBannerAds.embeddedSimpleClickWidth;
height=240+(document.all ? (2*2) : 0);
break;
case ExtensionBannerAds.constants.LEFTBOTTOM:
width=ExtensionBannerAds.embeddedSimpleClickWidth;
height=60+(document.all ? (2*2) : 0);
break;
case ExtensionBannerAds.constants.LEADERBOARDLEFT:
case ExtensionBannerAds.constants.LEADERBOARDRIGHT:
case ExtensionBannerAds.constants.BASEBOARDLEFT:
case ExtensionBannerAds.constants.BASEBOARDRIGHT:
width=120;
height=90;
break;
case ExtensionBannerAds.constants.SKINNYRIGHT:
width=120;
height=600;
break;
case ExtensionBannerAds.constants.MYDAYTALL:
width=300;
height=600;
break;
case ExtensionBannerAds.constants.MYDAYTALLSKINNY:
width=160;
height=600;
break;
}
if(this.i_type==ExtensionBannerAds.constants.RIGHT ||
this.i_type==ExtensionBannerAds.constants.SKINNYRIGHT ||
this.i_type==ExtensionBannerAds.constants.TWOBOXTOP || 
this.i_type==ExtensionBannerAds.constants.TWOBOXBOTTOM){
this.i_iframe.style.position="absolute";
this.i_iframe.style.left="0px";
this.i_iframe.style.top="50%";
if(this.i_type==ExtensionBannerAds.constants.TWOBOXTOP){
this.i_iframe.style.marginTop="-"+height+"px";
}else if(this.i_type==ExtensionBannerAds.constants.TWOBOXBOTTOM){
this.i_iframe.style.marginTop="0px";
}else this.i_iframe.style.marginTop="-"+(height / 2)+"px";
}
this.i_iframe.style.width=width+"px";
this.i_iframe.style.height=height+"px";
}
ExtensionBannerAds.refreshAdWithType(this.getType());
}
Ad.prototype.readFromLiteObject=function(liteObject){
this.i_type=liteObject.type;
this.i_code=liteObject.code;
ExtensionBannerAds.refreshAdWithType(this.getType());
}
JavaScriptResource.notifyComplete("./src/Extensions/BannerAds/objects/Object.Ad.js");
JavaScriptResource.notifyComplete("./btBA.js");
