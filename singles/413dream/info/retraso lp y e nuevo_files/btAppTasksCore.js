function ApplicationTasks() {
this.superApplication();
this.id(1015);	
this.name("Tasks");
this.smallIcon("ApplicationTasks_small");	
this.largeIcon("ApplicationTasks");		
this.loadingOrder(6);
EventHandler.register(this, "oninitialize", this.handleInitialize, this);
EventHandler.register(this, "onintegrate", this.handleIntegration, this);
EventHandler.register(this, "onload", this.handleLoad, this);
}
ApplicationTasks.prototype.handleInitialize=function(e) {
this.i_win_tasks=new WindowObject('task-list', "Tasks", 100, 100, Application.titleBarFactory());
this.i_win_tasks.titleBar().removeButton(Application.i_title_close);
this.getTaskPreview().getWindow();
this.i_nav_button=SystemCore.navigationBar().addButton(new NavigationButton(this.id(), this.name(), this.largeIcon(), this.smallIcon()));
EventHandler.register(this.i_nav_button, "onclick", this.launchApplication, this);
EventHandler.register(this.i_nav_button, "onclick", this.previewMinimize, this);
this.i_shortcut_new_task=SystemCore.shortcutPane().addShortcut(new ShortcutLink("New Task", "CalendarView_icon_new_task"));
EventHandler.register(this.i_shortcut_new_task, "onclick", this.handleShortcutTask, this);
this.getTaskDataModel().getItems(0, 0);
}
ApplicationTasks.prototype.previewMinimize=function(){
if (this.i_first_load) {
this.i_first_load=false ;
if (this.getTaskDataModel().entries()==0) {
this.getTaskPreview().getWindow().minimized(true);
}
else {
this.getTaskPreview().getWindow().minimized(false);
}
}
}
ApplicationTasks.prototype.handleIntegration=function(e) {
var cal=Application.getApplicationById(1004);
if (cal!=undefined) {
EventHandler.register(cal.getCalendarView().getCalendarView(), "oncontext", this.getTaskList().handleCalendarContext, this.getTaskList());
EventHandler.register(cal.getCalendarView().getCalendarView(), "ondblclick", this.getTaskList().handleCalendarDoubleClick, this.getTaskList());
this.i_generic_new_task=cal.getCalendarView().getCalendarView().genericContextMenu().addItem(new ContextMenuIconItem("New Task"));
EventHandler.register(this.i_generic_new_task, "onclick", this.getTaskList().handleContextNew, this.getTaskList());
this.i_newtask_btn=new IconLabelButton("New Task", "CalendarView_icon_new_task", 16, 16, 80, 17, "Create new task");
EventHandler.register(this.i_newtask_btn, "onclick", this.getTaskList().handleContextNew, this.getTaskList());
var cal_tools=cal.getCalendarView().getCalendarTools();
cal_tools.addItem(new ToolBarButton(this.i_newtask_btn), cal.getCalendarView().i_calendar_tools_new_div);
cal.getCalendarView().getCalendarView().addDataModel(this.getTaskDataModel());
}
}
ApplicationTasks.prototype.handleLoad=function(e) {
if (e.first) {
this.i_win_tasks.loadContent(this.getTaskList().getList());
EventHandler.register(this.i_win_tasks, "oncontentresize", this.handleTaskListResize, this);
this.i_first_load=true ;
}
this.getTaskPreview().getWindow().minimumHeight(254);
this.i_nav_button.selectedState(true);
}
ApplicationTasks.prototype.handleTaskListResize=function(e) {
if (this.i_task_list!=undefined) {
if (this.i_win_tasks.effectiveWidth()!=undefined) {
this.i_task_list.width(this.i_win_tasks.effectiveWidth() - 3);
}
if (this.i_win_tasks.effectiveHeight()!=undefined) {
this.i_task_list.height(this.i_win_tasks.effectiveHeight() - this.i_win_tasks.titleBar().height() - 5);
}
}
}
ApplicationTasks.prototype.getTaskList=function() {
if (this.i_task_list==undefined) {
this.i_task_list=new TaskList(this, 100, 100);
}
return this.i_task_list;
}
ApplicationTasks.prototype.getTaskDataModel=function() {
if (this.i_dataModel==undefined) {
this.i_dataModel=new TaskDataModel(99);
}
return this.i_dataModel;
}
ApplicationTasks.prototype.handleShortcutTask=function(e) {
this.popTask();
}
ApplicationTasks.prototype.popTask=function(task, dm, default_date, edit_mode) {
if(task==undefined) {
task=new CalendarTask(Math.random());
task.title("New Task");
task.isNew(true);
task.dueDate(default_date!=undefined ? default_date : new Date());
task.priority(2); 
edit_mode=true;
}
if (edit_mode==undefined) {
edit_mode=false;
}
if (dm==undefined) {
dm=this.getTaskDataModel();
}
var p=new PopoutWindow("TaskDisplay", "task");
var o={task: task, dm:dm, 'edit_mode':edit_mode};
var e=EventHandler.register(p, "onready", ApplicationTasks.handleOnReadyPopout, o);
o.onready_event=e;
var popoutSetting=(Application.getApplicationById("GP").param("popout_"+p.getClassName())=="1" ? true : false);
p.pop(264, 280, popoutSetting);
}
ApplicationTasks.handleOnReadyPopout=function(o) {
var p=o.popoutWindow;
if(this.onready_event) {
this.onready_event.unregister();
this.onready_event=null;
}
p.getPopupObject().loadTask(this.task);
p.getPopupObject().dataModel(this.dm);
p.getPopupObject().edit(this.edit_mode);
}
ApplicationTasks.prototype.getTaskPreview=function() {
if (this.i_preview==undefined) {
this.i_preview=new TaskPreview(this);
}
return this.i_preview;
}
ApplicationTasks.inherit(Application);
SystemCore.registerApplication(new ApplicationTasks());
JavaScriptResource.notifyComplete("./src/Applications/Tasks/Application.Tasks.js");
function TaskDataModel(id) {
this.i_name=name;
this.superDataModelNode(id);
this.i_fake=false;
this.i_month_cache=Array();
this.i_completed_tasks=0;
this.i_cache_extra_sort=Array();
EventHandler.register(this, "onadd", this.handleAdd, this);
EventHandler.register(this, "ongetitems", this.handleGetItems, this);
EventHandler.register(this, "onrefresh", this.handleDataRefresh, this);
}
TaskDataModel.getDefaultColor=function() {
if (TaskDataModel.i_color==undefined) {
TaskDataModel.i_color=new CalendarColorClass(99, "#000000", "#FFFFFF", "#000000", "#333333", "TaskCalendarEvent", true);
}
return TaskDataModel.i_color;
}
TaskDataModel.prototype.fakeData=function(state) {
if (state!=undefined) {
this.i_fake=state;
this.clear();
}
return this.i_fake;
}
TaskDataModel.prototype.handleRefresh=function(e) {
this.i_cache_extra_sort=Array();
}
TaskDataModel.prototype.handleAdd=function(e) {
e.item.i_parent_dm=this;
}
TaskDataModel.prototype.addTask=function(tsk) {
var parent_dm_refresh=this.ignoreRefresh();
this.ignoreRefresh(false);
var task_due=tsk.param("start");
var task_month;
var task_year;
if (task_due!=null) {
task_month=task_due.getMonth();
task_year=task_due.getFullYear();
}
else {
task_month=0;
task_year=0;
}
var stmp=((task_year * 100)+task_month);
if (this.i_month_cache[stmp]!=undefined) {
this.i_month_cache[stmp].addItem(tsk);
}
else {
var month_srt=this.getItems(0, 1000, "sort", "asc", 1);
var months=Array();
var month_map=Array();
var l=month_srt.length();
var month;
for (var x=0; x < l; x++) {
var m=month_srt.getItem(x);
if (m.month()==task_month || m.year()==task_year) {
month=m;
}
else if (m.year() >=task_year && m.month() > task_month) {
month=this.addItem(new CalendarTaskMonth(task_month, task_year), m);
}
}
if (month==undefined) {
month=this.addItem(new CalendarTaskMonth(task_month, task_year));
}
month.addItem(tsk);
this.i_month_cache[stmp]=month;
}
if(tsk.status()==2) {++this.i_completed_tasks;
}
this.ignoreRefresh(parent_dm_refresh, true);
return tsk;
}
TaskDataModel.prototype.loadFakeData=function() {
this.ignoreRefresh(true);
var title_p1=Array("Call", "Send card to", "Fax", "Visit", "Complete report for", "Book flight for");
var title_p2=Array("joe", "john", "bill", "leroy", "rufus", "rex", "ronald", "betty", "gertrude", "gladis", "destiney", "mercadies", "shaniqua", "candy", "apple", "harmoney", "rainbow");
for (var x=0; x < 1000; x++) {
var d=new Date();
d.setTime(d.getTime()+(((Math.random() * 2) > 1 ? -1 : 1) * (Math.random() * (((60 * 60000) * 24) * 90))));
var ev_id=x;
var ev_due=d;
var ev_priority=Math.floor(Math.random() * 3);
var ev_status=Math.floor(Math.random() * 5);
var ev_title=title_p1[Math.floor(Math.random() * title_p1.length)]+" "+title_p2[Math.floor(Math.random() * title_p2.length)];
var ev_description=title_p1[Math.floor(Math.random() * title_p1.length)]+" "+title_p2[Math.floor(Math.random() * title_p2.length)];
var t=this.addTask(new CalendarTask(ev_id, ev_title, ev_due, ev_priority, ev_status, ev_description));
}
this.i_init=true;
this.i_has_update=true;
this.ignoreRefresh(false);	
}
TaskDataModel.prototype.handleTaskList=function(e) {
this.ignoreRefresh(true);
var data=e.response.data();
var tasks=data.xPath("task");
for (var x=0; x < tasks.length; x++){ 
var ev_id=tasks[x].children("id", 0, true);
var ev_due=iCaltoDate(tasks[x].children("dueDate", 0, true));
var ev_priority=tasks[x].children("priority", 0, true);
var ev_status=tasks[x].children("status", 0, true);
var ev_title=tasks[x].children("taskTitle", 0, true);
var ev_description=tasks[x].children("description", 0, true);
var t=this.addTask(new CalendarTask(ev_id, ev_title, ev_due, ev_priority, ev_status, ev_description));
}
this.i_init=true;
this.i_req=false;
this.i_has_update=true;
this.ignoreRefresh(false);	
}
TaskDataModel.prototype.handleGetItems=function(e) {
if (this.i_req!=true && this.i_init!=true) {	
this.i_req=true;	
e.cancel=true;
if (this.fakeData()==true) {
var me=this;
setTimeout(function() {
me.loadFakeData();
}, 1);
}
else {	
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "list"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("ownerId", user_prefs['user_id']));
dn.addNode(new DataNode("userId", user_prefs['user_id']));
var r=new RequestObject("Task", "list", dn);
EventHandler.register(r, "oncomplete", this.handleTaskList, this);
r.execute();
}	
}
}
TaskDataModel.prototype.getItems_real=DataModelNode.prototype.getItems;
TaskDataModel.prototype.getItems=function(start, length, sortParam, sortOrder, viewId) {
if (sortParam==undefined || sortOrder==undefined) {
var dat=this.getItems_real(start, length, undefined, undefined, viewId);
return dat;
}
if (this.i_cache_extra_sort[sortParam+":"+sortOrder+":"+viewId]!=undefined) {
var e=this.i_cache_extra_sort[sortParam+":"+sortOrder+":"+viewId];
return new EntrySet(e, undefined, start, (e.length > length ? length : e.length));
}
var dat=this.getItems_real(0, this.entries(), undefined, undefined, viewId);
var rarray=Array();
var datl=dat.length();
for (var x=0; x < datl; x++) {
rarray[x]=dat.getItem(x);
}
var lowI=0;
var lowV;
var sortTag='pm_'+sortParam;
for (var x=0; x < datl; x++) {
lowI=x;
lowV=rarray[x].i_dm_params[sortTag];
if (lowV!=undefined && lowV.toLowerCase!=undefined) {
lowV=lowV.toLowerCase();
}
for (var q=x; q < datl; q++) {
curV=rarray[q].i_dm_params[sortTag];
if (curV!=undefined && curV.toLowerCase!=undefined) {
curV=curV.toLowerCase();
}
if (curV < lowV) {
lowI=q;
lowV=curV;
}
}
if (lowI!=x) {
v=rarray[x];
rarray[x]=rarray[lowI];
rarray[lowI]=v;
}
}
if (sortOrder=="desc") {
rarray=rarray.reverse();
}
this.i_cache_extra_sort[sortParam+":"+sortOrder+":"+viewId]=rarray;
return this.getItems(start, length, sortParam, sortOrder, viewId);
}
TaskDataModel.prototype.refreshMonthRange=function(force, startMonth, startYear, endMonth, endYear, dontAdd) {
this.ignoreRefresh(true);
if (typeof startMonth!="number" || startMonth < 0 || startMonth > 11) return;
if (typeof endMonth!="number" || endMonth < 0 || endMonth > 11) endMonth=startMonth;
if (typeof startYear!="number" || startYear < 0) return;
if (typeof endYear!="number" || endYear < 0) endYear=startYear;
var months=this.getItems(0, 1000, "sort", "asc", 1);
var hit=[];
var start=new Date((startMonth+1)+"/01/"+startYear+" 0:00:00"),
end=new Date((endMonth+1)+"/01/"+endYear+" 23:59:59");
var update=false;
for (var i=0; i < months.length;++i) {
var item=months.getItem(i);
var year=item.year();
var month=item.month();
var itemDate=new Date((month+1)+"/01/"+year+" 0:00:00");
if (itemDate.valueOf() >=start.valueOf() && itemDate.valueOf() <=end.valueOf()) {
if (hit[year]==undefined) hit[year]=[];
if (hit[year][month]==undefined) hit[year][month]=true;
if (force) {
update=true;
item.getItems(0,1000);
}
}
}
if (dontAdd!=true) {
for (var y=startYear; y <=endYear;++y) {
for (var m=(y==startYear ? startMonth : 0); m <=(y==endYear ? endMonth : 11);++m) {
if (hit[y]==undefined || hit[y][m]==undefined) {
if (hit[y]==undefined) hit[y]=[];
if (hit[y][m]==undefined) hit[y][m]=true;
update=true;
var item=this.addItem(new CalendarTaskMonth(m,y));
}
}
}
}
if (update || force) {
this.handleGetItems(new Object());
APIManager.executeQueue();
}
this.ignoreRefresh(false);
}
TaskDataModel.prototype.dateRange=function(start, end, includeAll) {
if (this.i_init!=true) {
var o=new Object();
this.handleGetItems(o);
return new EntrySet([], undefined, 0, 0);
}
var tmp;
if (typeof start=="string") {
tmp=start.split(" ");
start=createDateFromStrings(tmp[0], tmp[1]);
}
if (typeof end=="string") {
tmp.split(" ");
end=createDateFromStrings(tmp[0], tmp[1]);
}
var result=[], startStamp, endStamp;
if (start!=undefined) startStamp=start.valueOf();
if (end!=undefined) endStamp=end.valueOf();
var ptr=0;
var entries=this.getItems_real(0, this.entries());
for (var i=0; i < entries.length();++i) {
var item=entries.getItem(i);
var itemStart=item.param("start");
var currentStart;
if ((itemStart==undefined && !includeAll) || itemStart.valueOf() < startStamp) {
continue;
}
if (endStamp!=undefined) {
if (itemStart!=undefined && itemStart.valueOf() > endStamp.valueOf()) continue;
}
if (result.length==0) {
result.push(item);
} else {
while (ptr > -1 && result[ptr].param("start").valueOf() > itemStart.valueOf()) { --ptr; }
while (ptr > -1 && ptr < result.length) {
currentStart=result[ptr].param("start");
if (currentStart.valueOf() > itemStart.valueOf()) {
break;
}
else if (currentStart.valueOf()==itemStart.valueOf()) {
break;
} else {++ptr;
}
}
if (ptr < 0) {
result.splice(0,0,item);
ptr=0;
} else if (ptr >=result.length) {
result.push(item);
} else {
result.splice(ptr,0,item);
}
}
}
return new EntrySet(result, undefined, 0, result.length);
}
TaskDataModel.saveTasks=function(tasks) {
if(tasks.splice==undefined) {
tasks=[tasks];
}
var queue=[];
for(var x=0; x < tasks.length; x++) {
var task=tasks[x];
var dn=new DataNode("params");
dn.addNode(new DataNode("method", (task.isNew() ? "create" : "update")));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
var t=dn.addNode(new DataNode("task"));
if(!task.isNew()) {
t.addNode(new DataNode("id", task.id()));
}
t.addNode(new DataNode("ownerId", user_prefs['user_id']));
t.addNode(new DataNode("userId", user_prefs['user_id']));
t.addNode(new DataNode("description", task.description()));
t.addNode(new DataNode("priority", task.priority()));
t.addNode(new DataNode("status", task.status()));
t.addNode(new DataNode("taskTitle", task.title()));
if(task.dueDate()!=undefined) {
t.addNode(new DataNode("dueDate", dateToICal(task.dueDate())));
}else{
t.addNode(new DataNode("dueDate", ""));
}
t.addNode(new DataNode("timeZone", "28"));
var r=new RequestObject("Task", (task.isNew() ? "create" : "update"), dn);
EventHandler.register(r, "oncomplete", task.handleSave, task);
queue.push(r);
task.isNew(false);
}
APIManager.execute(queue);
}
TaskDataModel.deleteTasks=function(tasks) {
if(tasks.splice==undefined) {
tasks=[tasks];
}
var queue=[];
for(var x=0; x < tasks.length; x++) {
var task=tasks[x];
var dm=task.parentDataModel();
if(task.status()==2) {
dm.completedTasks(dm.completedTasks() - 1);
}
if (dm.ondelete!=undefined) {
var o=new Object();
o.type="delete";
o.event=task;
dm.ondelete(o);
}
var dn=new DataNode("params");
dn.addNode(new DataNode("method", "delete"));
dn.addNode(new DataNode("aId", user_prefs['user_id']));
dn.addNode(new DataNode("id", task.id()));
var r=new RequestObject("Task", "delete", dn);
EventHandler.register(r, "oncomplete", task.handleDelete, task);
queue.push(r);
}
APIManager.execute(queue);
}
TaskDataModel.prototype.hasCompletedTasks=function() {
return (this.i_completed_tasks > 0);
}
TaskDataModel.prototype.completedTasks=function(count) {
if(count!=undefined) {
this.i_completed_tasks=count;
}
return this.i_completed_tasks;
}
TaskDataModel.inherit(DataModelNode);
function CalendarTaskMonth(month, year) {
this.superDataModelNode(month+"."+year);
this.i_dm_params['pm_sort']=year+(month < 10 ? "0" : "")+month;
this.i_dm_params['pm_month']=month;
this.i_dm_params['pm_year']=year;
this.open(true, 0);
this.open(false, 1);
this.i_visible=false;
EventHandler.register(this, "onadd", this.handleAdd, this);
EventHandler.register(this, "ongetitems", this.handleGetItems, this);
}
CalendarTaskMonth.prototype.handleAdd=function(e) {
e.item.i_parent_dm=this.i_parent_dm;
e.item.i_parent_month=this;
}
CalendarTaskMonth.prototype.month=function(month) {
if (month!=undefined) {
this.i_dm_params['pm_month']=month;
this.i_dm_params['pm_sort']=this.i_dm_params['pm_year']+(month < 10 ? "0" : "")+month;
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.entry=this;
this.onchange(o);
}
}
return this.i_dm_params['pm_month'];
}
CalendarTaskMonth.prototype.year=function(year) {
if (year!=undefined) {
this.i_dm_params['pm_year']=year;
this.i_dm_params['pm_sort']=year+(this.i_dm_params['pm_month'] < 10 ? "0" : "")+this.i_dm_params['pm_month'];
if (this.onchange!=undefined) {
var o=new Object();
o.type="change";
o.entry=this;
this.onchange(o);
}
}
return this.i_dm_params['pm_year'];
}
CalendarTaskMonth.inherit(DataModelNode);
function CalendarTask(id, title, due, priority, status, description) {
this.i_ev_type="task";
this.superDataModelNode(id)
this.i_dm_params['pm_start']=due;
this.i_dm_param_types['pm_start']="date";
this.i_dm_params['pm_start_raw']=""+(due==undefined ? 0 : due.valueOf());
this.i_dm_params['pm_start_disp']=(due==undefined ? "No due date" : getNumericDateString(due));
this.i_dm_params['pm_title']=title;
this.i_dm_params['pm_title_tip']=htmlEncode(title);
this.i_dm_params['pm_description']=description;
this.i_dm_params['pm_description_tip']=htmlEncode(description);
this.i_dm_params['pm_status']=status;
this.i_dm_params['pm_status_grd']=CalendarTask.statusNames[status];
this.i_dm_params['pm_priority']=priority;
this.i_dm_params['pm_priority_grd']=CalendarTask.priorityNames[priority];
this.i_dm_params['pm_sort']=id;
this.i_dm_params['pm_new']=false;
this.i_dm_params['pm_check']="<div class='DataGrid_icon "+(status==2 ? "DataGrid_check_box_checked" : "DataGrid_check_box")+"'></div>";
this.updateStyles();
}
CalendarTask.statusNames=Array('Not started', 'In progress', 'Completed', 'Waiting on someone', 'Deferred');
CalendarTask.priorityNames=Array('', 'Low', 'Normal', 'High');
CalendarTask.prototype.type=function() {
return this.i_ev_type;
}
CalendarTask.prototype.parentDataModel=function() {
return this.i_parent_dm;
}
CalendarTask.prototype.parentMonth=function() {
return this.i_parent_month;
}
CalendarTask.prototype.colorClass=function(color) {
if (color!=undefined) {
this.i_color_class=color;
} else if(this.i_color_class==undefined) {
this.i_color_class=TaskDataModel.getDefaultColor();
}
return this.i_color_class;
}
CalendarTask.prototype.displayBody=function(data) {
if (data!=undefined) {
this.i_display_body=data;
}
return this.i_display_body;
}
CalendarTask.prototype.updateStyles=function() {
var d=new Date();
d.setHours(0);
d.setMinutes(0);
d.setSeconds(0);
d.setMilliseconds(0);
if (this.status()==2) {
this.styleClass(2);
this.selectedStyleClass(3);
}
else if (this.dueDate()!=null && this.dueDate().getTime() < d.getTime()) {
this.styleClass(4);
this.selectedStyleClass(1);
}
else {
this.styleClass(0);
this.selectedStyleClass(1);
}
}
CalendarTask.prototype.eventType=function() {}
CalendarTask.prototype.access=function() { return "All"; }
CalendarTask.prototype.ownerId=function() { return user_prefs['user_id']; }
CalendarTask.prototype.dueDate=function(due) {
if (due!=undefined) {
if (due && !due.inclusiveDays) due=new Date(due);
if (due===false) due=undefined;
var changed=(this.i_dm_params['pm_start']!=due),
added=false;
this.i_dm_params['pm_start']=due;
this.i_dm_params['pm_start_raw']=""+(due==undefined ? 0 : due.valueOf());
this.i_dm_params['pm_start_disp']=(due==undefined ? "No due date" : getNumericDateString(due));
if (changed) {
var pMonth=this.parentMonth();
if (pMonth!=undefined) {
if (due==undefined) {
pMonth.removeItem(this);
} else if (pMonth.month()==due.getMonth() && pMonth.year()==due.getFullYear()) {
added=true;
} else {
pMonth.removeItem(this);
}
if (due!=undefined && !added) {
var otherMonths=this.parentDataModel().getItems(0, 1000, "sort", "asc", 1);
for (var i=0; i < otherMonths.length();++i) {
var dm=otherMonths.getItem(i);
if (dm.month()==due.getMonth() && dm.year()==due.getFullYear()) {
dm.addItem(this);
added=true;
}
}
}
if (!added) this.parentDataModel().addTask(this);
}
if (due!=undefined) this.updateStyles();
this.fireRefresh();
this.fireChange();
}
}
return this.i_dm_params['pm_start'];
}
CalendarTask.prototype.title=function(title) {
if (title!=undefined && this.i_dm_params['pm_title']!=title) {
this.i_dm_params['pm_title']=title;
this.i_dm_params['pm_title_tip']=htmlEncode(title);
this.fireRefresh();
this.fireChange();
}
return this.i_dm_params['pm_title'];
}
CalendarTask.prototype.priority=function(priority) {
if (priority!=undefined && this.i_dm_params['pm_priority']!=priority) {
this.i_dm_params['pm_priority']=priority;
this.i_dm_params['pm_priority_grd']=CalendarTask.priorityNames[priority];
this.fireRefresh();
this.fireChange();
}
return this.i_dm_params['pm_priority'];
}
CalendarTask.prototype.status=function(status) {
if (status!=undefined && this.i_dm_params["pm_status"]!=status) {
var dm=this.parentDataModel();
if(status==2) {
if (dm.completedTasks)
dm.completedTasks(dm.completedTasks()+1);
} else if(this.i_dm_params["pm_status"]==2) {
if (dm.completedTasks)
dm.completedTasks(dm.completedTasks() - 1);
}
this.i_dm_params['pm_status']=status;
this.i_dm_params['pm_status_grd']=CalendarTask.statusNames[status];
this.i_dm_params['pm_check']="<div class='DataGrid_icon "+(status==2 ? "DataGrid_check_box_checked" : "DataGrid_check_box")+"'></div>";
this.updateStyles();
this.fireRefresh();
this.fireChange();
}
return this.i_dm_params['pm_status'];
}
CalendarTask.prototype.description=function(description) {
if (description!=undefined && this.i_dm_params['pm_description']!=description) {
this.i_dm_params['pm_description']=description;
this.i_dm_params['pm_description_tip']=htmlEncode(description);
this.fireRefresh();
this.fireChange();
}
return this.i_dm_params['pm_description'];
}
CalendarTask.prototype.isNew=function(n) {
if(n!=undefined && this.i_dm_params['pm_new']!=n) {
this.i_dm_params['pm_new']=n;
this.fireRefresh();
this.fireChange();
}
return this.i_dm_params['pm_new'];
}
CalendarTask.prototype.fireChange=function() {
if(this.onchange!=undefined) {
var o={
type: "change",
collection: this
};
this.onchange(o);
}
}
CalendarTask.prototype.fireRefresh=function() {
if (this.onrefresh!=undefined) {
var o=new Object();
o.type="refresh";
o.collection=this;
this.onrefresh(o);
}
}
CalendarTask.prototype.save=function() {
TaskDataModel.saveTasks(this);
}
CalendarTask.prototype.handleSave=function(e) {
var data=e.response.data();
var id=data.xPath("task/id", true);
this.id(id);
if(this.onsave!=null) {
var o={
type: "save"
}
this.onsave(o);
}
}
CalendarTask.prototype.destroy=function() {
TaskDataModel.deleteTasks(this);
}
CalendarTask.prototype.handleDelete=function(e) {}
CalendarTask.inherit(DataModelNode);
JavaScriptResource.notifyComplete("./src/Applications/Tasks/DataModels/DataModel.Tasks.js");	
function TaskList(application, width, height) {
this.i_width=width;
this.i_height=height;
this.i_application=application;
}	
TaskList.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_list!=undefined) {
this.i_list.style.width=width+"px";
this.i_tools.width(width);
this.i_task_list.width(width);
var offset=(width - 176) / 2;
if(offset < 0) {
offset=0;
}
this.i_empty_list_element.style.paddingLeft=offset+"px";
}
}
return this.i_width;
}
TaskList.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_list!=undefined) {
this.i_list.style.height=height+"px";
this.i_task_list.height(height - this.i_tools.height());
}
}
return this.i_height;
}
TaskList.prototype.handleDeleteTask=function(e) {
var ev=e.item.parent().i_event;
var d=DialogManager.confirm("Are you sure you want to delete this task?", "Delete Task", undefined, Array("Yes", "No"), true, false, 1);
d.i_event=ev;
EventHandler.register(d, "onclose", this.handleDeleteTaskConfirm, this);
}
TaskList.prototype.handleDeleteTaskConfirm=function(e) {
if (e.button=="Yes") {
var ev=e.dialog.i_event;
if(ev.id()==this.application().getTaskPreview().getTaskId()) {
this.application().getTaskPreview().task(false); 
}
ev.parentMonth().removeItem(ev);
ev.destroy();
this.taskList().handleDataRefresh();
}
}
TaskList.prototype.handleViewTask=function(e) {
var ev=e.item.parent().i_event;
this.application().popTask(ev);
}
TaskList.prototype.handleEditTask=function(e) {
var ev=e.item.parent().i_event;
this.application().popTask(ev, undefined, undefined, true);
}
TaskList.prototype.handleCalendarDoubleClick=function(e) {
if (e.event.type()=="task") {
this.application().popTask(e.event);
}
}
TaskList.prototype.handleCalendarContext=function(e) {
var obj=e.event;
if (obj.type()=="task") {
if (this.i_tk_context==undefined) {
this.i_tk_context=new ContextMenu(150, "");
this.i_tk_context_view=this.i_tk_context.addItem(new ContextMenuIconItem("View Details"));
EventHandler.register(this.i_tk_context_view, "onclick", this.handleViewTask, this);
this.i_tk_context_edit=this.i_tk_context.addItem(new ContextMenuIconItem("Edit Task"));
EventHandler.register(this.i_tk_context_edit, "onclick", this.handleEditTask, this);
this.i_tk_context_delete=this.i_tk_context.addItem(new ContextMenuIconItem("Delete Task"));
EventHandler.register(this.i_tk_context_delete, "onclick", this.handleDeleteTask, this);
}
cx=this.i_tk_context;
cx.title(htmlEncode(obj.title()));
cx.i_event=obj;
cx.show();
}
}
TaskList.prototype.application=function(application) {
if (application!=undefined) {
this.i_application=application;
}
return this.i_application;
}
TaskList.prototype.taskList=function() {
if (this.i_task_list==undefined) {
this.i_task_list=new DataGrid(this.width(), this.height() - this.toolBar().height(), this.application().getTaskDataModel(), undefined, Array("DataGrid_column_selected", "Tasks_column_strike", "Tasks_column_strike DataGrid_column_selected", "Tasks_column_expired"));
this.i_empty_list_element=document.createElement("DIV");
this.i_empty_list_element.style.paddingTop="45px";
var empty_bold_text=document.createElement("DIV");
empty_bold_text.innerHTML="<b>You have not created any tasks.</b>";
this.i_empty_list_element.appendChild(empty_bold_text);
var empty_reg_text_div=document.createElement("DIV");
empty_reg_text_div.style.paddingLeft="28px";
empty_reg_text_div.style.paddingTop="3px";
var empty_reg_text1=document.createElement("SPAN");
empty_reg_text1.innerHTML="Click to add a ";
empty_reg_text_div.appendChild(empty_reg_text1);
var empty_reg_link=document.createElement("SPAN");
empty_reg_link.innerHTML="New Task";
empty_reg_link.style.color="#0261cd";
empty_reg_link.style.textDecoration="underline";
empty_reg_link.style.cursor="pointer";
EventHandler.register(empty_reg_link, "onclick", this.handleNew, this);
empty_reg_text_div.appendChild(empty_reg_link);
var empty_reg_text2=document.createElement("SPAN");
empty_reg_text2.innerHTML=".";
empty_reg_text_div.appendChild(empty_reg_text2);
this.i_empty_list_element.appendChild(empty_reg_text_div);
this.i_task_list.setEmptyListContent(this.i_empty_list_element);
this.i_check_header=this.i_task_list.addHeader(new DataGridHeader("check", "check", 30, "", "Completed", "DataList_header_icon_checked", true, "none"));
this.i_check_header.protected(false);
this.i_task_list.addHeader(new DataGridHeader("title", "title", 150, "Title", "Title", undefined, true, "none"));
this.i_task_list.addHeader(new DataGridHeader("description", "description", "100%", "Description", "Description", undefined, true, "none"));
this.i_task_list.addHeader(new DataGridHeader("start_disp", "start_raw", 100, "Due Date", "Due Date", undefined, true, "none"));
this.i_task_list.addHeader(new DataGridHeader("priority_grd", "priority", 80, "Priority", "Priority", undefined, true, "none"));
this.i_task_list.addHeader(new DataGridHeader("status_grd", "status", 80, "Status", "Status", undefined, true, "none"));
EventHandler.register(this.i_task_list, "onmousedown", this.handleItemClick, this);
EventHandler.register(this.i_task_list, "oncontextmenu", this.handleContextMenu, this);
EventHandler.register(this.i_task_list, "ondblclick", this.handleItemDblClick, this);
EventHandler.register(this.application().getTaskDataModel(), "onrefresh", this.handleListRefresh, this);
}
return this.i_task_list;
}
TaskList.prototype.handleContextMenu=function(e) {
if (e.item!=undefined) {
this.contextMenu().title(htmlEncode(e.item.title()));
for (var x=0; x < this.i_context_pri.length; x++) {
this.i_context_pri[x].state(e.item.priority()==x+1 ? true : false);
}
for (var x=0; x < this.i_context_stat.length; x++) {
this.i_context_stat[x].state(e.item.status()==x ? true : false);
}
this.i_active_context=e.item;
this.contextMenu().show();
e.cancelBubble=true;
e.returnValue=false;
}
else {
this.newContextMenu().show();
e.cancelBubble=true;
e.returnValue=false;
}
}
TaskList.prototype.handleItemClick=function(e) {
if (!e.item){
this.taskList().clearSelected();
this.application().getTaskPreview().task(false);
this.updateButtons();
return false;
}
if (e.header.id()=="check" && e.button!=2) {
e.item.status(e.item.status()==2 ? 0 : 2);
e.item.save();
} else if(e.item) {
this.application().getTaskPreview().task(e.item);
}
this.updateButtons();
}
TaskList.prototype.handleItemDblClick=function(e) {
this.taskList().clearSelected();
this.application().getTaskPreview().task(false);
this.updateButtons();
this.application().popTask(e.item);
}
TaskList.prototype.handleContextNew=function(e) {
var d=new Date();
if (e.item==undefined || e.item.parent()==undefined || e.item.parent().i_target_date==undefined) {
var cal=Application.getApplicationById(1004);
if (cal!=undefined) {
var caltab=cal.getCalendarView().getTabbedPane().activeTab();
if (caltab!=undefined) {
var calview=cal.getCalendarView().getCalendarView();
var view_obj=caltab.i_view;
if (view_obj.days!=undefined && view_obj.days()==1) {
d2=view_obj.focusDate().copy();
d2.setHours(d.getHours());
d2.setMinutes(d.getMinutes());
d2.setSeconds(d.getSeconds());
d2.setMilliseconds(0);
d=d2;
}
else {
if (calview.selectedDate()!=undefined) {
d2=calview.selectedDate().copy();
d2.setHours(d.getHours());
d2.setMinutes(d.getMinutes());
d2.setSeconds(d.getSeconds());
d2.setMilliseconds(0);
d=d2;
}
}
}
}
}
else {
d=e.item.parent().i_target_date.copy(true);
}
this.application().popTask(undefined, undefined, d);
}
TaskList.prototype.handleContextPriority=function(e) {
for (var x=0; x < this.i_context_pri.length; x++) {
if (e.item==this.i_context_pri[x]) {
this.i_active_context.priority(x+1);
this.i_active_context.save();
break;
}
}
}
TaskList.prototype.handleContextStatus=function(e) {
for (var x=0; x < this.i_context_stat.length; x++) {
if (e.item==this.i_context_stat[x]) {
this.i_active_context.status(x);
this.i_active_context.save();
break;
}
}
}
TaskList.prototype.handleContextDelete=function(e) {
if(this.i_active_context.id()==this.application().getTaskPreview().getTaskId()) {
this.application().getTaskPreview().task(false); 
}
var dm=this.i_active_context.parentMonth();
dm.removeItem(this.i_active_context);
this.i_active_context.destroy(); 
this.taskList().handleDataRefresh();
}
TaskList.prototype.handleNew=function(e) {
this.application().popTask(undefined, this.application().getTaskDataModel());
}
TaskList.prototype.handleContextEdit=function(e) {
this.application().popTask(this.i_active_context, this.application().getTaskDataModel(), undefined, true);
}
TaskList.prototype.contextMenu=function() {
if (this.i_context==undefined) {
this.i_context=new ContextMenu(180, "Task");
this.i_context_delete=this.i_context.addItem(new ContextMenuIconItem("Delete Task"));
EventHandler.register(this.i_context_delete, "onclick", this.handleContextDelete, this);
this.i_context_edit=this.i_context.addItem(new ContextMenuIconItem("Edit Task"));
EventHandler.register(this.i_context_edit, "onclick", this.handleContextEdit, this);
this.i_context.addItem(new ContextMenuDivider());
this.i_context_pri=Array();
this.i_context_pri[0]=this.i_context.addItem(new ContextMenuBoolean("Low", true));
this.i_context_pri[1]=this.i_context.addItem(new ContextMenuBoolean("Normal", false));
this.i_context_pri[2]=this.i_context.addItem(new ContextMenuBoolean("High", false));
for (var x=0; x < this.i_context_pri.length; x++) {
EventHandler.register(this.i_context_pri[x], "onclick", this.handleContextPriority, this);
}
this.i_context.addItem(new ContextMenuDivider());
this.i_context_stat=Array();
this.i_context_stat[0]=this.i_context.addItem(new ContextMenuBoolean("Not Started", true));
this.i_context_stat[1]=this.i_context.addItem(new ContextMenuBoolean("In progress", false));
this.i_context_stat[2]=this.i_context.addItem(new ContextMenuBoolean("Completed", false));
this.i_context_stat[3]=this.i_context.addItem(new ContextMenuBoolean("Waiting on someone else", false));
this.i_context_stat[4]=this.i_context.addItem(new ContextMenuBoolean("Deferred", false));
for (var x=0; x < this.i_context_stat.length; x++) {
EventHandler.register(this.i_context_stat[x], "onclick", this.handleContextStatus, this);
}
}
return this.i_context;
}
TaskList.prototype.newContextMenu=function() {
if (this.i_new_context==undefined) {
this.i_new_context=new ContextMenu(180);
this.i_new_context_new=this.i_new_context.addItem(new ContextMenuIconItem("New Task"));
EventHandler.register(this.i_new_context_new, "onclick", this.handleContextNew, this);
}
return this.i_new_context;
}
TaskList.prototype.handleDeleteSelected=function(e) {
var sels=this.i_task_list.getSelected();
var d=DialogManager.confirm("Are you sure you want to delete the selected tasks?", "Delete Tasks", undefined, Array("Yes", "No"), true, true, 1);
d.i_selection=sels;
EventHandler.register(d, "onclose", this.handleDeleteSelectedConfirm, this);
}
TaskList.prototype.handleDeleteSelectedConfirm=function(e) {
if (e.button=="Yes") {
var sels=e.dialog.i_selection;
this.i_task_list.dataModel().ignoreRefresh(true);
for (var x=0; x < sels.length; x++){ 
if(sels[x].id()==this.application().getTaskPreview().getTaskId()) {
this.application().getTaskPreview().task(false); 
}
sels[x].parentMonth().removeItem(sels[x]);
}
TaskDataModel.deleteTasks(sels);
this.i_task_list.dataModel().ignoreRefresh(false,true);
this.taskList().handleDataRefresh();
this.handleListRefresh();
}
}
TaskList.prototype.handleDeleteComplete=function(e) {
var d=DialogManager.confirm("Are you sure you want to delete all completed tasks?", "Delete Completed Tasks", undefined, Array("Yes", "No"), true, false, 1);
EventHandler.register(d, "onclose", this.handleDeleteCompleteConfirm, this);
}
TaskList.prototype.handleDeleteCompleteConfirm=function(e) {
if (e.button=="Yes") {
var itms=this.i_task_list.dataModel().getItems(0, this.i_task_list.dataModel().entries());
this.i_task_list.dataModel().ignoreRefresh(true);
var tasks=[];
for (var x=itms.length() - 1; x >=0; x--) {
var i=itms.getItem(x);
if (i.status()==2) {
if(i.id()==this.application().getTaskPreview().getTaskId()) {
this.application().getTaskPreview().task(false); 
}
i.parentMonth().removeItem(i);
tasks.push(i);
}
}
TaskDataModel.deleteTasks(tasks);
this.i_task_list.dataModel().ignoreRefresh(false,true);
this.taskList().handleDataRefresh();
this.handleListRefresh();
}
}
TaskList.prototype.handleListRefresh=function(e) {
this.updateButtons();
}
TaskList.prototype.updateButtons=function() {
var number_selected=this.i_task_list.getSelected().length;
if(this.i_task_list.entries() > 0) {
this.i_print_button.enabled(true);
if (0 < number_selected && number_selected < this.i_task_list.entries()) {
this.i_print_button.label('Print Selected');
} else {
this.i_print_button.label('Print All');
}
} else {
this.i_print_button.label('Print All');
this.i_print_button.enabled(false);
}
if(number_selected > 0) {
this.i_tools_delete.enabled(true);
} else {
this.i_tools_delete.enabled(false);
}
if(this.i_task_list.dataModel().hasCompletedTasks()) {
this.i_tools_complete.enabled(true);
} else {
this.i_tools_complete.enabled(false);
}
}
TaskList.prototype.handlePrint=function(e) {
var number_selected=this.i_task_list.getSelected().length;
if (0 < number_selected && number_selected < this.i_task_list.entries()) {
print_selected_only=true;   
} else {
print_selected_only=false;   
}
var d=document.createElement('DIV');
d.innerHTML=this.i_task_list.printHTML(undefined, print_selected_only);
SystemCore.loadPrintContent(d, true);
}
TaskList.prototype.toolBar=function() {
if (this.i_tools==undefined) {
this.i_tools=new ToolBar(this.width());
this.i_tools.width(this.width());
var new_btn=this.i_tools.addItem(new UniversalButton("New Task", "CalendarView_icon_new_task", 16, undefined, true, undefined, "left", "Create new task"));
EventHandler.register(new_btn, "onclick", this.handleNew, this);
this.i_tools.addItem(new ToolBarDivider());
this.i_tools_delete=this.i_tools.addItem(new UniversalButton("Delete", "ToolBar_icon_delete", 16, undefined, true, undefined, "left", "Delete Selected"));
this.i_tools_delete.enabled(false);
EventHandler.register(this.i_tools_delete, "onclick", this.handleDeleteSelected, this);
this.i_tools_complete=this.i_tools.addItem(new UniversalButton("Delete All Completed", "ToolBar_icon_delete_tasks", 16, undefined, true, undefined, "left", "Delete completed tasks"));
this.i_tools_complete.enabled(false);
EventHandler.register(this.i_tools_complete, "onclick", this.handleDeleteComplete, this);
this.i_tools.addItem(new ToolBarDivider());
this.i_print_button=this.i_tools.addItem(new UniversalButton("Print All", "ToolBar_icon_print", 16, undefined, true, undefined, "left", "Print"));
EventHandler.register(this.i_print_button, "onclick", this.handlePrint, this);
}
return this.i_tools;
}
TaskList.prototype.getList=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.className="TaskList";
this.i_list.style.width=this.width()+"px";
this.i_list.style.height=this.height()+"px";
this.i_list.appendChild(this.toolBar().getBar());
this.i_list.appendChild(this.taskList().getGrid());
this.updateButtons();
}
return this.i_list;
}
JavaScriptResource.notifyComplete("./src/Applications/Tasks/Components/Component.TaskList.js");	
function LiteTaskList(width, max) {
this.i_width=width;
this.i_height=100;
this.i_max=max;
this.i_item_cache=Array();
}
LiteTaskList.messageHeight=50;
LiteTaskList.buttonHeight=22;
LiteTaskList.buttonAreaPaddingLR=4;
LiteTaskList.buttonAreaPaddingTB=2;
LiteTaskList.prototype.dataModel=function(model) {
if (model!=undefined) {
if (model==false) {
model=undefined;
}
if (this.i_dm_r!=undefined) {
this.i_dm_r.unregister();
this.i_dm_r=null;
}
this.i_model=model;
if (model!=undefined) {
this.i_dm_r=EventHandler.register(this.i_model, "onrefresh", this.refreshData, this);
}
this.refreshData();
}
return this.i_model;
}
LiteTaskList.prototype.maxTasks=function(max) {
if (max!=undefined) {
this.i_max=max;
this.refreshData();
}
return this.i_max;
}
LiteTaskList.prototype.width=function(newWidth) {
if (newWidth!=undefined) {
this.i_width=(newWidth < 0 ? 0 : newWidth);
if (this.i_list!=undefined && this.i_list_data!=undefined) {
this.i_list.style.width=this.i_width+"px";
this.i_list_message.style.width=this.i_width+"px";
this.i_list_data.style.width=this.i_width+"px";
this.i_list_buttons.style.width=this.i_width+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(this.i_width);
}
var winHeight=(this.i_list.parentNode ? (this.i_list.parentNode.offsetHeight) : (this.i_list.offsetHeight));
if (this.i_list_data.offsetHeight+this.i_list_buttons.offsetHeight > winHeight) {
var scrollWidth=(this.i_width - (scrollBarWidth()+1));
this.i_list.style.width=scrollWidth+"px";
this.i_list_message.style.width=scrollWidth+"px";
this.i_list_data.style.width=scrollWidth+"px";
this.i_list_buttons.style.width=scrollWidth+"px";
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].width(scrollWidth);
}
}
}
}
return this.i_width;
}
LiteTaskList.prototype.height=function(height) {
if (height!=undefined) {
this.i_height=height;
if (this.i_list!=undefined) {
this.i_list.style.height=this.i_height+'px';
}
}
return this.i_height;
}
LiteTaskList.prototype.refreshData=function() {
if (this.i_list!=undefined && this.i_model!=undefined) {
var items=this.i_model.getItems(0, 1000);
if (items.length()==0) {
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
this.i_list_message.style.display="";
this.i_list_message.innerHTML=(this.dataModel().i_init==true ? "No tasks" : "Loading...");
}
else {
this.i_list_message.style.display="none";
var entries=items.length();
var temp_entries=Array();
temp_entries[0]=[];	
temp_entries[1]=[];	
temp_entries[2]=[];	
var z=0;
var now_d=new Date();
now_d.setHours(0);
now_d.setMinutes(0);
now_d.setSeconds(0);
now_d.setMilliseconds(0);
var now=now_d.getTime();
for (var x=0; x < entries; x++) {
var i=items.getItem(x);
if (i.dueDate()==undefined) {
temp_entries[0][temp_entries[0].length]=i;
}
else if (i.dueDate().getTime() < now) {
temp_entries[2][temp_entries[2].length]=i;
}
else {
temp_entries[1][temp_entries[1].length]=i;
}
z++;
}
var r=0;
for (var q=2; q >=0; q--) {
for (var x=0; x < temp_entries[q].length; x++) {
var i=temp_entries[q][x];
if (this.i_item_cache[r]==undefined) {
this.i_item_cache[r]=new TaskListItem();
this.i_list_data.appendChild(this.i_item_cache[r].getItem());
}
this.i_item_cache[r].visible(true);
this.i_item_cache[r].eventObject(i);
r++;
if (r==this.maxTasks()) {
break;
}
}
if (r==this.maxTasks()) {
break;
}
}
for (var x=r; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
}
this.width(this.i_width);
}
else {
for (var x=0; x < this.i_item_cache.length; x++) {
this.i_item_cache[x].visible(false);
}
}
}
LiteTaskList.prototype.handleAddTask=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (app_task!=undefined) {
app_task.popTask(undefined, this.dataModel()); 
}
}
LiteTaskList.prototype.getList=function() {
if (this.i_list==undefined) {
this.i_list=document.createElement('DIV');
this.i_list.className="LiteTaskList";
this.i_list.style.width=this.i_width+"px";
this.i_list.style.height=this.i_height+"px";
this.i_list_message=document.createElement('DIV');
this.i_list_message.className="LiteTaskList_message";
this.i_list_message.style.height=LiteTaskList.messageHeight+"px";
this.i_list_message.style.lineHeight=LiteTaskList.messageHeight+"px";
this.i_list_message.innerHTML="Loading...";
this.i_list.appendChild(this.i_list_message);
this.i_list_data=document.createElement('DIV');
this.i_list_data.className="LiteTaskList_data";
this.i_list.appendChild(this.i_list_data);
this.i_list_buttons=document.createElement('DIV');
this.i_list_buttons.className="LiteTaskList_buttons";
this.i_list_buttons.style.height=LiteTaskList.buttonHeight+"px";
this.i_list_buttons.style.paddingLeft=LiteTaskList.buttonAreaPaddingLR+"px";
this.i_list_buttons.style.paddingRight=LiteTaskList.buttonAreaPaddingLR+"px";
this.i_list_buttons.style.paddingTop=LiteTaskList.buttonAreaPaddingTB+"px";
this.i_list_buttons.style.paddingBottom=LiteTaskList.buttonAreaPaddingTB+"px";						
this.i_list.appendChild(this.i_list_buttons);
this.i_list_button_add=new UniversalButton("New Task", undefined, undefined, undefined, undefined, 22);
EventHandler.register(this.i_list_button_add, "onclick", this.handleAddTask, this);
this.i_list_buttons.appendChild(this.i_list_button_add.getButton());
this.refreshData();
}
return this.i_list;
}
function TaskListItem() {
this.i_completed=false;
this.i_overdue=false;
this.i_tk_context=undefined;
}
TaskListItem.itemList=new Array();
TaskListItem.checkWidth=20;
TaskListItem.itemHeight=18;
TaskListItem.timeWidth=75;
TaskListItem.timePaddingRight=4;
TaskListItem.prototype.handleContext=function(e) {
if (this.i_tk_context==undefined) {
this.i_tk_context=new ContextMenu(150, "");
this.i_tk_context_view=this.i_tk_context.addItem(new ContextMenuIconItem("View Details"));
EventHandler.register(this.i_tk_context_view, "onclick", this.handleViewTask, this);
this.i_tk_context_edit=this.i_tk_context.addItem(new ContextMenuIconItem("Edit Task"));
EventHandler.register(this.i_tk_context_edit, "onclick", this.handleEditTask, this);
this.i_tk_context_delete=this.i_tk_context.addItem(new ContextMenuIconItem("Delete Task"));
EventHandler.register(this.i_tk_context_delete, "onclick", this.handleDeleteTask, this);
}
this.i_tk_context.show();
EventHandler.cancelEvent(e);
}
TaskListItem.prototype.handleDeleteTask=function(e) {
var ev=this.eventObject();
var d=DialogManager.confirm("Are you sure you want to delete this task?", "Delete Task", undefined, Array("Yes", "No"), true, false, 1);
d.i_event=ev;
EventHandler.register(d, "onclose", this.handleDeleteTaskConfirm, this);
}
TaskListItem.prototype.handleDeleteTaskConfirm=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (e.button=="Yes") {
var ev=e.dialog.i_event;
if(ev.id()==app_task.getTaskPreview().getTaskId()) {
app_task.getTaskPreview().task(false); 
}
var dm=ev.parentMonth();
dm.removeItem(ev);
ev.destroy();
this.i_item.parentNode.removeChild(this.i_item);
}
}
TaskListItem.prototype.handleViewTask=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (app_task!=undefined) {
app_task.popTask(this.eventObject());
}
}
TaskListItem.prototype.handleEditTask=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (app_task!=undefined) {
app_task.popTask(this.eventObject(), undefined, undefined, true);
}
}
TaskListItem.prototype.handleContext=function(e) {
if (this.i_tk_context==undefined) {
var id=TaskListItem.itemList.length;
TaskListItem.itemList[id]=this;
this.i_tk_context=new jsDOMenu(100, "", "cursor", false); 
this.i_tk_context.addMenuItem(new menuItem("Edit Task","","JavaScript:TaskListItem.editTask("+id+")"));
this.i_tk_context.addMenuItem(new menuItem("Delete Task","","JavaScript:TaskListItem.deleteTask("+id+")"));			
}
this.setMenuPosition(e);
this.i_tk_context.show();
e.cancelBubble=true;
e.returnValue=false;
return false;
}
TaskListItem.prototype.setMenuPosition=function(e) {
if (this.i_tk_context!=undefined) {
var menu=this.i_tk_context;
var menuX, menuY;
var frame_width, frame_height;
if(navigator.userAgent.indexOf("MSIE")==-1) {
frame_width=window.innerWidth+window.pageXOffset;
frame_height=window.innerHeight+window.pageYOffset;
menuX=e.pageX+window.pageXOffset;
menuY=e.pageY;
} else {
frame_width=document.frames.frameElement.offsetWidth+document.body.scrollLeft;
frame_height=document.frames.frameElement.offsetHeight+document.body.scrollTop;
menuX=e.x+document.body.scrollLeft;
menuY=e.y;
}
if((menuX+parseInt(menu.menuObj.style.width)) > frame_width)
menuX=frame_width - (parseInt(menu.menuObj.style.width)+1);
if((menuY+parseInt(menu.menuObj.style.height)) > frame_height)
menuY=frame_height - (parseInt(menu.menuObj.style.height)+4);
menu.setX(menuX);
menu.setY(menuY);
}
}	
TaskListItem.editTask=function(id) {
if (id!=undefined && TaskListItem.itemList[id]!=undefined) {
var item=TaskListItem.itemList[id];
item.hideMenu();
item.handleEditTask(window.event);
}
}
TaskListItem.deleteTask=function(id) {
if (id!=undefined && TaskListItem.itemList[id]!=undefined) {
var item=TaskListItem.itemList[id];
var task=item.eventObject();
var title;
item.hideMenu();
var e=new Object();
e.button="Yes";
e.dialog=new Object();
e.dialog.i_event=task;
if (task.title()!=null && task.title().length > 0) {
title="'"+task.title()+"'";
} else {
title="task";
}
if (confirm("Delete "+title+"?")) {
item.handleDeleteTaskConfirm(e);
}
}
}
TaskListItem.prototype.hideMenu=function() {
if (this.i_tk_context!=undefined) {
this.i_tk_context.menuObj.style.visibility="hidden";
}
}
TaskListItem.prototype.handleDeleteTask=function(e) {
var ev=this.eventObject();
var d=DialogManager.confirm("Are you sure you want to delete this task?", "Delete Task", undefined, Array("Yes", "No"), true, false, 1);
d.i_event=ev;
EventHandler.register(d, "onclose", this.handleDeleteTaskConfirm, this);
}
TaskListItem.prototype.handleDeleteTaskConfirm=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (e.button=="Yes") {
var ev=e.dialog.i_event;
if(ev.id()==app_task.getTaskPreview().getTaskId()) {
app_task.getTaskPreview().task(false); 
}
var dm=ev.parentMonth();
dm.removeItem(ev);
ev.destroy();
}
}
TaskListItem.prototype.handleViewTask=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (app_task!=undefined) {
app_task.popTask(this.eventObject());
}
}
TaskListItem.prototype.handleEditTask=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (app_task!=undefined) {
app_task.popTask(this.eventObject(), undefined, undefined, true);
}
}
TaskListItem.prototype.eventObject=function(ev) {
if (ev!=undefined) {
this.i_event=ev;
if (this.i_item!=undefined) {
this.i_item_title.innerHTML=((this.eventObject()!=undefined && this.eventObject().title()!=undefined) ? this.eventObject().title().filterHTML() : "No Title");
this.i_item_due.innerHTML=this.timeTitle();
var d=this.eventObject().dueDate();
var dn=new Date();
dn.setHours(0);
dn.setSeconds(0);
dn.setMinutes(0);
dn.setMilliseconds(0);
var overdue=false;
if (d!=undefined) {
if (d.getTime() < dn.getTime()) {
overdue=true;
}
}
this.overdue(overdue);
if (ev.status()==2) {
this.completed(true);
} else {
this.completed(false);
}
}
}
return this.i_event;
}
TaskListItem.prototype.setItemClassName=function() {
if (this.completed()) {
this.i_item.className='TaskListItem_completed';
} else if (this.i_overdue) {
this.i_item.className='TaskListItem_overdue';
} else {
this.i_item.className='TaskListItem';
}
}
TaskListItem.prototype.overdue=function(state) {
if (state!=undefined) {
this.i_overdue=state;
if (this.i_item!=undefined) {
this.setItemClassName();
}
}
return this.i_overdue;
}
TaskListItem.prototype.completed=function(state) {
if (state!=undefined) {
this.i_completed=state;
if (this.i_item!=undefined) {
this.i_item_check_obj.checked=state;
this.setItemClassName();
}
}
return this.i_completed;
}
TaskListItem.prototype.completed=function(state) {
if (state!=undefined) {
this.i_completed=state;
if (this.i_item!=undefined) {
this.i_item_check_obj.checked=state;
if (this.i_completed) {
this.i_item.className='TaskListItem_completed';
} else if (this.overdue()) {
this.i_item.className='TaskListItem_overdue';
} else {
this.i_item.className='TaskListItem';
}
}
}
return this.i_completed;
}
TaskListItem.prototype.visible=function(state) {
if (state!=undefined) {
this.i_visible=state;
if (this.i_item!=undefined) {
this.i_item.style.display=(state ? "" : "none");
}
}
return this.i_visible;
}
TaskListItem.prototype.width=function(width) {
if (width!=undefined) {
this.i_width=width;
if (this.i_item!=undefined) {
this.i_item.style.width=this.i_width+"px";
var newWidth=this.i_width -
TaskListItem.checkWidth -
TaskListItem.timeWidth -
TaskListItem.timePaddingRight;
this.i_item_title.style.width=(newWidth > 0 ? newWidth : 0)+"px";
this.i_item_due.style.width=TaskListItem.timeWidth+"px";
}
}
return this.i_width;
}
TaskListItem.prototype.timeTitle=function() {
if (this.eventObject()!=undefined) {
var due=this.eventObject().dueDate();
if (due!=undefined) {
return parent.getNumericDateString(due);
}
else {
return "None";
}
}
else {
return "Invalid";
}
}
TaskListItem.prototype.handleMouseOver=function(e) {
if (this.completed()) {
this.i_item.className='TaskListItem_completed_hover';
} else if (this.overdue()) {
this.i_item.className='TaskListItem_overdue_hover';
} else {
this.i_item.className='TaskListItem_hover';
}
}
TaskListItem.prototype.handleMouseOut=function(e) {
this.setItemClassName();
}
TaskListItem.prototype.handleClick=function(e) {
var app_task=parent.Application.getApplicationById(1015);
if (app_task!=undefined) {
app_task.popTask(this.eventObject());
}
}
TaskListItem.prototype.handleItemCheck=function(e) {
if (this.i_item_check_obj.checked==true) {
var ev=this.eventObject();
ev.status("2");
ev.save();
}
else {
if (this.eventObject().status()!=0) {
var ev=this.eventObject();
ev.status("0");
ev.save();
}
}
}
TaskListItem.prototype.getItem=function() {
if (this.i_item==undefined) {
this.i_item=document.createElement('DIV');
this.setItemClassName();
if (this.width()!=undefined) {
this.i_item.style.width=this.width()+"px";
}
this.i_item.style.display=(this.visible() ? "" : "none");
EventHandler.register(this.i_item, "onmouseover", this.handleMouseOver, this);
EventHandler.register(this.i_item, "onmouseout", this.handleMouseOut, this);
EventHandler.register(this.i_item, "oncontextmenu", this.handleContext, this);
this.i_item_check=document.createElement('DIV');
this.i_item_check.className="TaskListItem_check";
this.i_item_check.style.width=TaskListItem.checkWidth+"px";
this.i_item_check.style.height=TaskListItem.itemHeight+"px";
this.i_item.appendChild(this.i_item_check);
this.i_item_check_obj=document.createElement('INPUT');
this.i_item_check_obj.type="checkbox";
this.i_item_check_obj.className="TaskListItem_checkbox";
this.i_item_check.appendChild(this.i_item_check_obj);
EventHandler.register(this.i_item_check_obj, "onclick", this.handleItemCheck, this);
this.i_item_title=document.createElement('DIV');
this.i_item_title.className="TaskListItem_title";
this.i_item_title.style.lineHeight=TaskListItem.itemHeight+"px";
this.i_item_title.innerHTML=((this.eventObject()!=undefined && this.eventObject().title()!=undefined) ? this.eventObject().title().filterHTML() : "No Title");
this.i_item.appendChild(this.i_item_title);
EventHandler.register(this.i_item_title, "onclick", this.handleClick, this);
this.i_item_due=document.createElement('DIV');
this.i_item_due.className="TaskListItem_time";
this.i_item_due.style.width=TaskListItem.timeWidth+"px";
this.i_item_due.style.height=TaskListItem.itemHeight+"px";
this.i_item_due.style.lineHeight=TaskListItem.itemHeight+"px";
this.i_item_due.innerHTML=this.timeTitle();
this.i_item.appendChild(this.i_item_due);
var newWidth;
if (this.i_width==undefined) {
newWidth=1;
} else {
newWidth=this.i_width -
TaskListItem.checkWidth -
TaskListItem.timeWidth -
TaskListItem.timePaddingRight;
}
this.i_item_title.style.width=(newWidth > 0 ? newWidth : 0)+"px";
this.i_item_float_clear=document.createElement('DIV');
this.i_item_float_clear.style.clear='both';
this.i_item.appendChild(this.i_item_float_clear);
}
return this.i_item;
}
JavaScriptResource.notifyComplete("./src/Applications/Tasks/Components/Component.LiteTaskList.js");
function TaskDisplay(config, preview) {
this.superPopoutDisplay(config);
if(this.i_popoutWindow!==undefined) {
this.i_event_popInternal=EventHandler.register(this.i_popoutWindow, "onpopinternal", this.handleInternalPop, this);
this.i_event_popExternal=EventHandler.register(this.i_popoutWindow, "onpopexternal", this.handleExternalPop, this);
this.i_event_terminate=EventHandler.register(this.i_popoutWindow, "onterminate",   this.handleTermination, this);
this.i_event_ready=EventHandler.register(this.i_popoutWindow, "onready",       this.handleReady,       this);
}
this.i_content=null;
this.i_task=null;
this.i_tab_content=new Object();
this.i_inputs=new Object();
this.i_handlers=[];
this.i_edit_mode=false;
this.i_preview_mode=(preview==true ? true : false);
this.i_col_one_width=0;
this.i_col_two_width=0;
this.i_include_simple_click=false; 
this.i_handlers.push(EventHandler.register(this.i_windowObject, "oncontentresize", this.oldresize, this));
this.i_windowObject.loadContent(this.getContent());
this.windowTitle('Task');
this.i_windowObject.closeOnImport(false);
}
TaskDisplay.dateCopy=function(d) {
return d.copy();
}
TaskDisplay.prototype.destructor=function() {
if (this.i_event_popInternal)	 this.i_event_popInternal=!this.i_event_popInternal.unregister()
if (this.i_event_popExternal)	 this.i_event_popExternal=!this.i_event_popExternal.unregister();
if (this.i_event_terminate) 	 this.i_event_terminate=!this.i_event_terminate.unregister();
if (this.i_event_ready)			 this.i_event_ready=!this.i_event_ready.unregister();
if (this.i_task_change_listener) this.i_task_change_listener=!this.i_task_change_listener.unregister();
if (this.i_save_task_listener)	 this.i_save_task_listener=!this.i_save_task_listener.unregister();
for (var i=0; i < this.i_handlers.length;++i) {
if (this.i_handlers[i]!=undefined && typeof this.i_handlers[i].unregister=="function") {
this.i_handlers[i].unregister();
}
}
var items=this.i_toolbar.items();
for (var i=0; i < items.length;++i) {
if (items[i].destructor) items[i].destructor();
}
this.i_handlers=[];
this.closeWindow();
}
TaskDisplay.prototype.onclose=null;
TaskDisplay.prototype.inPreviewPane=function(preview) {
if (preview!=undefined) {
this.i_preview_mode=preview;
}
return this.i_preview_mode;
}
TaskDisplay.prototype.getContent=function() {
if(this.i_content===null) {
this.i_content=document.createElement("div");
this.i_toolbar=new ToolBar(100);
if(this.i_showToolbar!=undefined && this.i_showToolbar!=false){
this.i_content.appendChild(this.i_toolbar.getBar());
}
this.i_edit_button=this.i_toolbar.addItem(new UniversalButton("Edit", "ToolBar_icon_edit", 16, undefined, true, undefined, "left", "Edit Task"));
this.i_handlers.push(EventHandler.register(this.i_edit_button, "onclick", this.handleEditClick, this));
this.i_save_button=this.i_toolbar.addItem(new UniversalButton((!this.inPreviewPane() ? "Save and Close" : "Save"), "Toolbar_icon_save", 16, undefined, true, undefined, "left", "Save Task"));
this.i_handlers.push(EventHandler.register(this.i_save_button, "onclick", this.handleSaveClick, this));
this.i_cancel_button=this.i_toolbar.addItem(new UniversalButton("Cancel", "Toolbar_icon_cancel", 16, undefined, true, undefined, "left", "Cancel Edit"));
this.i_handlers.push(EventHandler.register(this.i_cancel_button, "onclick", this.handleCancelClick, this));
if (this.i_popoutWindow!=undefined) {
this.i_close_button=this.i_toolbar.addItem(new UniversalButton("Close", "Toolbar_icon_close", 16, undefined, true, undefined, "left", "Close Task"));
this.i_handlers.push(EventHandler.register(this.i_close_button, "onclick", this.handleCloseClick, this));
}
this.i_print_button=this.i_toolbar.addItem(new UniversalButton("Print", "ToolBar_icon_print", 16, undefined, true, undefined, "left", "Print"));
this.i_handlers.push(EventHandler.register(this.i_print_button, "onclick", this.handlePrint, this));
if(this.i_popoutWindow!=undefined) {
var popout_button=this.getPopoutButton();
popout_button.float("right");
this.i_toolbar.addItem(popout_button);
}
this.i_save_button.visible(false);
this.i_cancel_button.visible(false);
this.i_inner_content=document.createElement('div');
this.i_inner_content.style.overflow="visible";
this.i_notification_bar=new NotificationBar(100);
this.i_notification_bar.text("");
this.i_notification_bar.width(this.width());
this.i_notification_bar.level(NotificationBar.INFO);
this.i_notification_bar.visible(false);
this.i_inner_content.appendChild(this.i_notification_bar.getContent());
this.i_inner_content.appendChild(this.getDetailsTabContent());
this.i_content.appendChild(this.i_inner_content);
}
return this.i_content;
}
TaskDisplay.prototype.handleReady=function(e){
if(this.edit() && this.task().isNew()){
var input=this.i_inputs.TITLE.inputObject();
this.mainWindow().setTimeout(function(){
try{
if (input.createTextRange) {
var r=input.createTextRange();
r.moveStart("character", 0);
r.moveEnd("character", input.value.length);
r.select();
}else if (input.setSelectionRange) {
input.setSelectionRange(0, input.value.length);
}else{
}
input.focus();
}catch(e){
}
input=null;
},100);
}
}
TaskDisplay.prototype.handlePrint=function(e) {
var pdata=document.createElement('DIV');
var statMode=this.i_tab_content.details.form.staticMode();
if (statMode==false) {
this.i_tab_content.details.form.staticMode(true);
}
pdata.innerHTML=this.i_tab_content.details.form.getForm().innerHTML;
if (statMode==false) {
this.i_tab_content.details.form.staticMode(false);
}
if (SystemCore.loadPrintContent!=undefined) {
SystemCore.loadPrintContent(pdata, true);
}
else {
alert('This window does not support printing.');
}
}
TaskDisplay.prototype.translateDueDate=function(e) {
if (this.i_inputs.NODUEDATE.value().length > 0) {
e.value="No Due Date";
}
}
TaskDisplay.prototype.translateNoDueDate=function(e) {
e.value="";
}
TaskDisplay.prototype.getDetailsTabContent=function() {
if(this.i_tab_content.details==undefined) {
this.i_tab_content.details={};
var div=document.createElement('div');
this.i_tab_content.details.content=div;
div.className="TaskDisplay_detailsTabContent";
var ins=this.i_inputs;
var form_width=(this.width()!=undefined ? parseInt(this.width()) - 10 : 461);
this.i_col_one_width=Math.floor(form_width * 0.45) - 1;
this.i_col_two_width=Math.floor(form_width * 0.55) - 1;
var form=new UniversalForm(form_width, 85);
form.staticMode(true);
form.lineUpAllColumns(true);
this.i_tab_content.details.form=form;
var sec=new UniversalFormSection("");
form.addSection(sec);
ins.TITLE=new UniversalTextInput("Title", "", "100%", 22);
sec.addRow(new UniversalFormRow(ins.TITLE));
ins.TITLE.addValidationRule(new StringLengthValidationRule(255, "The task title must be less than 255 characters long."));
this.i_handlers.push(EventHandler.register(ins.TITLE, "onchange", this.handleTitleChange, this));
this.i_handlers.push(EventHandler.register(ins.TITLE, "onfocus", this.handleSaveChange, this));
ins.DUEDATE=new UniversalDateInput("Due date", "", "45%", 22);
this.i_handlers.push(EventHandler.register(ins.DUEDATE, "ontranslate", this.translateDueDate, this));
this.i_handlers.push(EventHandler.register(ins.DUEDATE, "onchange", this.handleSaveChange, this));
this.i_handlers.push(EventHandler.register(ins.DUEDATE, "ondatefocus", this.handleSaveChange, this));
ins.NODUEDATE=new UniversalCheckBoxInput("", "", "55%", [new UniversalCheckBoxOption("", "noduedate", false)]);
this.i_handlers.push(EventHandler.register(ins.NODUEDATE, "ontranslate", this.translateNoDueDate, this));
this.i_handlers.push(EventHandler.register(ins.NODUEDATE, "onchange", this.handleSaveChange, this));
this.i_handlers.push(EventHandler.register(ins.NODUEDATE, "onchange", this.handleNoDueDateChanged, this));
sec.addRow(new UniversalFormRow(ins.DUEDATE, ins.NODUEDATE));
ins.PRIORITY=new UniversalOptionBoxInput("Priority", "", this.getPriorityOptions(), false, "45%", 1);
this.i_handlers.push(EventHandler.register(ins.PRIORITY, "onchange", this.handleSaveChange, this));
ins.STATUS=new UniversalOptionBoxInput("Status", "", this.getStatusOptions(), false, "55%", 1);
this.i_handlers.push(EventHandler.register(ins.STATUS, "onchange", this.handleSaveChange, this));
sec.addRow(new UniversalFormRow(ins.PRIORITY, ins.STATUS));
ins.DESCRIPTION=new UniversalTextAreaInput("Description", "", "100%", 70);
sec.addRow(new UniversalFormRow(ins.DESCRIPTION));
this.i_handlers.push(EventHandler.register(ins.DESCRIPTION, "onfocus", this.handleSaveChange, this));
var temp=form.getForm();
temp.style.position="relative";
temp.style.top="5px";
this.i_tab_content.details.content.appendChild(temp);
}
return this.i_tab_content.details.content;
}
TaskDisplay.prototype.handleTitleChange=function(e) {
if ((this.i_inputs.TITLE==undefined) ||
(this.i_inputs.TITLE.value()==undefined) ||
(this.i_task==undefined)) {
this.windowTitle("Task");
} else {
this.windowTitle(this.i_inputs.TITLE.value());
}
return true;
}
TaskDisplay.prototype.handleSaveChange=function(e) {
this.i_save_button.enabled(true);
}
TaskDisplay.prototype.getPriorityOptions=function() {
var o=[];
var pri=CalendarTask.priorityNames;
for(var x=1; x < pri.length; x++) {
o.push(new UniversalOptionBoxOption(pri[x], x, (x==2)));
}
return o;
}
TaskDisplay.prototype.getStatusOptions=function() {
var o=[];
var stat=CalendarTask.statusNames;
for(var x=0; x < stat.length; x++) {
o.push(new UniversalOptionBoxOption(stat[x], x, (x==0)));
}
return o;
}
TaskDisplay.prototype.oldresize=function(o) {
var width=parseInt(o.originalScope.effectiveWidth() - WindowManager.window_border_width);
var height=parseInt(o.originalScope.effectiveHeight() - (o.originalScope.titleBar()!==undefined ? o.originalScope.titleBar().height() : 0) - WindowManager.window_border_width);
this.resize({width: width, height: height});
}
TaskDisplay.prototype.resize=function(o) {
var width=o.width;
var height=o.height;
if(typeof width!="undefined") {
this.width(width);
}
if(typeof height!="undefined") {
this.height(height);
o.height=o.height - (this.i_showToolbar ? this.i_toolbar.height() : 0);
}
this.resizeForm();
}
TaskDisplay.prototype.resizeForm=function() {
if (this.task && this.i_windowObject.visible()) {
var width=this.width();
var height=this.height();
if (this.i_tab_content.details.form!=undefined && width!=undefined && height!=undefined) {
height -=(this.i_showToolbar==true ? this.i_toolbar.height() : 0);
this.i_tab_content.details.form.width(width - 19);  
this.i_inputs.DUEDATE.effectiveWidth(this.i_col_one_width);
this.i_inputs.PRIORITY.effectiveWidth(this.i_col_one_width);
this.i_inputs.NODUEDATE.effectiveWidth(this.i_col_two_width);
this.i_inputs.STATUS.effectiveWidth(this.i_col_two_width);
var contentHeight=height - (this.i_notification_bar.visible() ? this.i_notification_bar.height() - 2 : 0);
var formHeight=Math.ceil(this.i_tab_content.details.form.height());
var inputHeight=(contentHeight - formHeight)+this.i_inputs.DESCRIPTION.height() - 10;
if (inputHeight < 22) inputHeight=22;
if (inputHeight!=this.i_inputs.DESCRIPTION.height()) this.i_inputs.DESCRIPTION.height(inputHeight);
}
}
}
TaskDisplay.prototype.width=function(width) {
if(width!=undefined) {
this.i_width=width;
if(this.i_showToolbar) {
this.i_toolbar.width(width);
}
if(this.i_content!==null) {
this.i_content.style.width=width+"px";
this.i_notification_bar.width(width);
}
}
return this.i_width;
};
TaskDisplay.prototype.height=function(height) {
if(height!=undefined) {
this.i_height=height;
var h=height - (this.i_showToolbar ? this.i_toolbar.height() : 0);
if(this.i_content!==null) {
this.i_content.style.height=h+"px";
this.i_inner_content.style.height=h+"px";
}
}
return this.i_height;
};
TaskDisplay.prototype.loadTask=function(task, clear_state) {
if(clear_state==undefined) {
clear_state=true;
}
this.i_task=task;
if(clear_state==true) {
this.i_last_state.set=false;
this.i_last_state_meta.set=false;
}
if(task.parentDataModel()!=undefined) {
this.i_dm=task.parentDataModel();
}
if(this.i_task_change_listener) {
this.i_task_change_listener=!this.i_task_change_listener.unregister();
}
this.i_windowObject.minimized(false);
this.i_task_change_listener=EventHandler.register(this.i_task, "onchange", this.handleTaskChange, this);
this.refreshData();
}
TaskDisplay.prototype.unLoadTask=function() {
this.i_task=undefined;
this.i_last_state.set=false;
this.i_last_state_meta.set=false;
if(this.i_task_change_listener) {
this.i_task_change_listener=!this.i_task_change_listener.unregister();
}
this.windowTitle('Task');
}
TaskDisplay.prototype.task=function(task) {
if(task!=undefined) {
this.loadTask(task);
}
return this.i_task;
}
TaskDisplay.prototype.handleTaskChange=function() {
if(!this.edit()) {
this.refreshData();
}
this.updateNotification();
}
TaskDisplay.prototype.refreshData=function() {
var ins=this.i_inputs;
if(this.i_last_state.set!=false) {
ins.TITLE.value(this.i_last_state.TITLE);
this.windowTitle((this.i_last_state.TITLE.length > 0 ? (this.i_last_state.TITLE==undefined ? "Task" : this.i_last_state.TITLE) : "Task"));
ins.DUEDATE.value(this.i_last_state.DUEDATE);
ins.PRIORITY.value(this.i_last_state.PRIORITY);
ins.STATUS.value(this.i_last_state.STATUS);
ins.DESCRIPTION.value(this.i_last_state.DESCRIPTION);
ins.NODUEDATE.value([(this.i_last_state.NODUEDATE=="noduedate" ? "noduedate" : "")]);
}else if(this.i_task!=undefined) {
ins.TITLE.value(this.i_task.title());
this.windowTitle((this.i_task.title()==undefined ? "Task" : this.i_task.title()));
if(this.i_task.dueDate()) {
ins.NODUEDATE.value([]);
ins.DUEDATE.value(this.i_task.dueDate().copy());
}else{
ins.NODUEDATE.value(["noduedate"]);
ins.DUEDATE.value(undefined);
}
ins.PRIORITY.value(this.i_task.priority());
ins.STATUS.value(this.i_task.status());
var description=this.i_task.description();
if(description==undefined) {
description="";
}
ins.DESCRIPTION.value(description);
}
if(this.i_last_state_meta.set!=false) {
this.edit(this.i_last_state_meta.edit);
}else if(this.i_task!=undefined) {
this.edit(this.i_task.isNew());
}
this.i_tab_content.details.form.refreshStaticView();
this.updateNotification();
}
TaskDisplay.prototype.updateNotification=function() {
var overdue=false;
var now_d=new Date();
now_d.setHours(0);
now_d.setMinutes(0);
now_d.setSeconds(0);
now_d.setMilliseconds(0);
var now=now_d.getTime();
if(this.i_last_state.set!=false) {
overdue=(this.i_last_state.DUEDATE!=undefined  &&
this.i_last_state.DUEDATE < now_d &&
parseInt(this.i_inputs.STATUS.value())!=2);
}else if(this.i_task!=undefined) {
overdue=(this.i_task.dueDate()!=undefined &&
this.i_task.dueDate() < now_d && 
parseInt(this.i_task.status())!=2);
}
if(this.i_task && this.i_task.isNew()) {
overdue=false;
}
if(overdue) {
this.i_notification_bar.visible(true);
this.i_notification_bar.text("Task is overdue");
this.i_notification_bar.level(NotificationBar.WARNING);
}else{
this.i_notification_bar.visible(false);
}
}
TaskDisplay.prototype.updateMode=function() {
if(this.i_edit_mode==true) {
this.i_edit_button.visible(false);
this.i_save_button.visible(true);
this.i_save_button.enabled(false);
this.i_cancel_button.visible(true);
this.i_inputs.NODUEDATE.name("No due date");
if (this.i_popoutWindow!=undefined) {
this.i_close_button.visible(false);
}
this.i_tab_content.details.form.staticMode(false);
this.i_tab_content.details.form.clearModified();
}else{
this.i_edit_button.visible(true);
this.i_save_button.visible(false);
this.i_cancel_button.visible(false);
this.i_inputs.NODUEDATE.name("");
if (this.i_popoutWindow!=undefined) {
this.i_close_button.visible(true);
}
this.i_tab_content.details.form.staticMode(true);
}
this.resizeForm();
this.handleReady();
}
TaskDisplay.prototype.edit=function(edit) {
if(edit!=undefined) {
if (this.i_edit_mode!=edit) {
this.i_edit_mode=edit;
}
this.updateMode();
}
return this.i_edit_mode;
}
TaskDisplay.prototype.handleEditClick=function(o) {
this.edit(true);
}
TaskDisplay.prototype.handleSaveClick=function(o) {
if(this.i_tab_content.details.form.validate().length > 0) { 
this.i_tab_content.details.form.displayErrorBox(); 
return; 
}
this.i_tab_content.details.form.displayErrorBox(); 
this.saveTask(); 
this.i_save_button.enabled(false);
}
TaskDisplay.prototype.handleCloseClick=function(e) {
if(this.edit()) {
var d=DialogManager.confirm("You are currently editing this Task. Are you sure you want to close it?", "Close Task?", undefined, ["Yes", "No"]);
this.i_handlers.push(EventHandler.register(d, "onclose", this.handleConfirmClose, this));
}else{
this.closeTask();
}
}
TaskDisplay.prototype.handleConfirmCancel=function(e) {
if (e.button=="Yes") {
if (this.i_task.isNew()) {
this.closeTask();
}
else {
this.i_tab_content.details.form.reset();
this.edit(false);
}
}
}
TaskDisplay.prototype.handleCancelClick=function(e) {
if (this.i_tab_content.details.form.isModified()) {
var d=DialogManager.confirm("You have made changes to this task, are you sure you want to cancel?", "Edit Task", undefined, ["Yes", "No"], undefined, true);
this.i_handlers.push(EventHandler.register(d, "onclose", this.handleConfirmCancel, this));
}
else {
if(this.i_task.isNew()) {
this.closeTask();
}else{
this.edit(false);
}
}
}
TaskDisplay.prototype.handleConfirmClose=function(e) {
if(e.button=="Yes") {
this.closeTask();
}
}
TaskDisplay.prototype.closeTask=function() {
if(this.onclose!=undefined) {
this.onclose({type:"close"});
}
if (!this.inPreviewPane()) {
this.destructor(true); 
} else {
this.closeWindow();
}
}
TaskDisplay.prototype.saveTask=function(handleSave) {
if (handleSave==undefined)
handleSave=true;
var i=this.i_inputs;
var t=this.i_task;
if (i.TITLE.value()=="") {
i.TITLE.value("No Title");
}
t.title(i.TITLE.value());
if(i.NODUEDATE.value()[0]=="noduedate") {
t.dueDate(false); 
}else{
t.dueDate(TaskDisplay.dateCopy(i.DUEDATE.value()));
}
t.priority(i.PRIORITY.value()[0]);
t.status(i.STATUS.value()[0]);
t.description(i.DESCRIPTION.value());
if(t.parentDataModel()!=this.i_dm) {
this.i_dm.addTask(t);
}
this.i_last_save=undefined;
if(this.i_save_task_listener) {
this.i_save_task_listener=!this.i_save_task_listener.unregister();
}
if (this.inPreviewPane()==true) {
this.edit(false);
}
if (handleSave==true) {
this.i_save_task_listener=EventHandler.register(t, "onsave", this.handleTaskSave, this);
if(this.i_save_notification) {
Notifications.end(this.i_save_notification);
}
this.i_save_notification=Notifications.add("Saving task");
}
t.save();
}
TaskDisplay.prototype.handleNoDueDateChanged=function (e) {
if (this.i_inputs.NODUEDATE.value().length > 0) {
this.i_inputs.DUEDATE.disabled(true);
} else {
this.i_inputs.DUEDATE.disabled(false);
}
}
TaskDisplay.prototype.handleTaskSave=function(e) {
Notifications.end(this.i_save_notification);
if (!this.inPreviewPane()) {
this.closeTask();
}
}
TaskDisplay.prototype.dataModel=function(dm) {
if(dm!==undefined) {
this.i_dm=dm;
}
return this.i_dm;
}
TaskDisplay.prototype.handleExternalPop=function(e) {
this.i_last_state=e.stateData.fields;
this.i_last_state_meta=e.stateData.meta;
if(this.i_last_state_meta.set==true) {
this.loadTask(e.stateData.meta.task, false);
this.dataModel(e.stateData.meta.dm);
}
}
TaskDisplay.prototype.handleInternalPop=function(e) {
this.i_last_state=e.stateData.fields;
this.i_last_state_meta=e.stateData.meta;
if(this.i_last_state_meta.set==true) {
this.loadTask(e.stateData.meta.task, false);
this.dataModel(e.stateData.meta.dm);
}		
}
TaskDisplay.prototype.handleTermination=function(e) {
if(!e.final && this.edit()) {
var f=e.stateData.fields;
f.TITLE=this.i_inputs.TITLE.value();
f.DUEDATE=TaskDisplay.dateCopy(this.i_inputs.DUEDATE.value());
f.PRIORITY=this.i_inputs.PRIORITY.value()[0];
f.STATUS=this.i_inputs.STATUS.value()[0];
f.DESCRIPTION=this.i_inputs.DESCRIPTION.value();
f.NODUEDATE=this.i_inputs.NODUEDATE.value()[0];
f.set=true;
}else{
e.stateData.fields.set=false;
}
if(!e.final) {
var m=e.stateData.meta;
m.set=true;
m.edit=this.edit();
m.task=this.i_task;
m.dm=this.i_dm;
}else{
e.stateData.meta.set=false;
}
if (!this.inPreviewPane()) {
this.destructor();
}
}
TaskDisplay.getDependencies=function() {
return ["TaskDisplay",
"CalendarTask",
"=TaskDisplay.dateCopy"];
}
PopoutWindow.registerFiles("TaskDisplay", ["./btAppTasksCore.js",]);
TaskDisplay.inherit(PopoutDisplay);
JavaScriptResource.notifyComplete("./src/Applications/Tasks/Components/Component.TaskDisplay.js");
function TaskPreview(application) {
this.i_message_visible=false;
this.i_application=application;
}
TaskPreview.prototype.handlePreviewOverwrite=function(e) {
if (e.button=="Yes") {
this.i_task_display.saveTask(false); 
}
this.i_task_display.edit(false);
if(e.dialog.i_task===false){
this.noTaskMessageVisible(true);
this.i_task=undefined;
}
else{
this.task(e.dialog.i_task, true);
}
}
TaskPreview.prototype.task=function(task, force) {
if (task!=undefined) {
if (this.i_task_display!=undefined) {
if (force!=true && this.i_task_display.edit() && this.i_task_display.i_save_button.enabled()) {
var d=DialogManager.confirm("Do you want to save your changes?", this.i_task.title(), undefined, Array("Yes", "No"));
d.i_task=task;
EventHandler.register(d, "onclose", this.handlePreviewOverwrite, this);
return;
}
var numTasksSelected=this.application().getTaskList().taskList().getSelected().length;
if (numTasksSelected > 1) {
this.i_window.loadContent(this.multiplePreview(numTasksSelected));
this.i_task_display.unLoadTask();
}
else if(numTasksSelected==0 || task===false){
this.noTaskMessageVisible(true);
this.i_task=undefined;
this.i_task_display.unLoadTask();
return;
}
else {
this.noTaskMessageVisible(true);
if(!this.application().getTaskList().taskList().entrySelected(task)){
task=this.application().getTaskList().taskList().getSelected()[0];
}
this.i_task_display.loadTask(task);
}
}
this.i_task=task;
this.noTaskMessageVisible(false);
}
}
TaskPreview.prototype.getTaskId=function() {
if(this.i_task!=undefined) {
return this.i_task.id();
}
return undefined;
}
TaskPreview.prototype.emptyPreview=function() {
if (this.i_preview==undefined || this.i_preview.id=="multiple_preview_message") {
this.i_preview=document.createElement('DIV');
this.i_preview.className="TaskPreview_message";
this.i_preview.id="empty_preview_message";
var empty_bold_text=document.createElement("DIV");
empty_bold_text.style.lineHeight="0px";
empty_bold_text.style.paddingTop="45px";
empty_bold_text.innerHTML="<b>Select a task to view the details.</b>";
this.i_preview.appendChild(empty_bold_text);
var empty_reg_text_div=document.createElement("DIV");
empty_reg_text_div.style.lineHeight="0px";
empty_reg_text_div.style.paddingTop="10px";
var empty_reg_text1=document.createElement("SPAN");
empty_reg_text1.innerHTML="Or add a ";
empty_reg_text_div.appendChild(empty_reg_text1);
var empty_reg_link=document.createElement("SPAN");
empty_reg_link.innerHTML="New Task";
empty_reg_link.style.color="#0261cd";
empty_reg_link.style.textDecoration="underline";
empty_reg_link.style.cursor="pointer";
EventHandler.register(empty_reg_link, "onclick", this.application().getTaskList().handleNew, this);
empty_reg_text_div.appendChild(empty_reg_link);
var empty_reg_text2=document.createElement("SPAN");
empty_reg_text2.innerHTML=".";
empty_reg_text_div.appendChild(empty_reg_text2);
this.i_preview.appendChild(empty_reg_text_div);	
}
return this.i_preview;
}
TaskPreview.prototype.multiplePreview=function(numTasks) {
this.i_preview=document.createElement('DIV');
this.i_preview.className="TaskPreview_message";
this.i_preview.id="multiple_preview_message";
var empty_bold_text=document.createElement("DIV");
empty_bold_text.style.lineHeight="0px";
empty_bold_text.style.paddingTop="45px";
empty_bold_text.innerHTML="<b>"+numTasks+" task items selected.</b>";
this.i_preview.appendChild(empty_bold_text);
var empty_reg_text_div=document.createElement("DIV");
empty_reg_text_div.style.lineHeight="0px";
empty_reg_text_div.style.paddingTop="10px";
var empty_reg_link=document.createElement("SPAN");
empty_reg_link.innerHTML="Print selected tasks";
empty_reg_link.style.color="#0261cd";
empty_reg_link.style.textDecoration="underline";
empty_reg_link.style.cursor="pointer";
EventHandler.register(empty_reg_link, "onclick", this.application().getTaskList().handlePrint, this.application().getTaskList());
empty_reg_text_div.appendChild(empty_reg_link);
this.i_preview.appendChild(empty_reg_text_div);
return this.i_preview;
}
TaskPreview.prototype.application=function(application) {
if (application!=undefined) {
this.i_application=application;
}
return this.i_application;
}
TaskPreview.prototype.noTaskMessageVisible=function(state) {
if (this.i_window!=undefined) {
if (this.i_cache_interface==undefined) {
this.i_cache_interface=this.i_window.loadContent();
}
if (this.i_message_visible!=state) {
if (state) {
this.i_window.loadContent(this.emptyPreview());
this.i_task_display.windowTitle('Task');
}
else {
this.i_window.loadContent(this.i_cache_interface);
}
}
this.i_message_visible=state;
}
return this.i_message_visible;
}
TaskPreview.prototype.handleClosePreview=function(e) {
this.task(false);
}
TaskPreview.prototype.handleWindowResize=function(e) {
if (this.i_preview!=undefined) {
if (this.i_window.effectiveWidth()!=undefined) {
this.i_preview.style.width=(this.i_window.effectiveWidth() - 3)+"px";
}
if (this.i_window.effectiveHeight()!=undefined) {
var h=(this.i_window.effectiveHeight() - this.i_window.titleBar().height() - 3);
this.i_preview.style.height=h+"px";
this.i_preview.style.lineHeight=h+"px";
}
}
}
TaskPreview.prototype.getWindow=function() {
if (this.i_window==undefined) {
var t=this.i_task;
if (this.i_task!=undefined) {
this.task(false);
}
this.i_window=new WindowObject('task-preview', "Preview", 100, 100, Application.titleBarFactory());
this.i_window.titleBar().removeButton(Application.i_title_close);
this.i_task_display=new TaskDisplay({
windowObject: this.i_window,
showToolbar: true
}, true);
EventHandler.register(this.i_task_display, "onclose", this.handleClosePreview, this);
EventHandler.register(this.i_window, "oncontentresize", this.handleWindowResize, this);
if (t!=undefined) {
this.task(t);
}
else {
this.noTaskMessageVisible(true);
}
}			
return this.i_window;
}
JavaScriptResource.notifyComplete("./src/Applications/Tasks/Components/Component.TaskPreview.js");	
JavaScriptResource.notifyComplete("./btAppTasksCore.js");
