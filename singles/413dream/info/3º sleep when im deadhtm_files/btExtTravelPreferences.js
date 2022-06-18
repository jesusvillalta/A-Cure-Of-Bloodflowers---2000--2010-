function TravelPane() {
this.superFormPreferencePane("Travel Settings", "Configure the settings for flight and hotel searching.");
this.i_sections={};
this.i_inputs={};
ExtensionTravel.obj.loadFiles("preferences");
EventHandler.register(this, "onload", this.handleLoad, this);
EventHandler.register(this, "onshow", this.handleShow, this);
}
TravelPane.prototype.getForm=function() {
if(!this.i_form) {
this.i_form=new UniversalForm(450, 110);
var section=this.i_form.addSection(new UniversalFormSection());
this.i_inputs.reset_tips=new UniversalButton("Reset All Travel Tips", undefined, undefined, undefined, 
true, 22);
EventHandler.register(this.i_inputs.reset_tips, "onclick", this.handleResetTipsClick, this);
var reset_input=new UniversalButtonInput(this.i_inputs.reset_tips, "left", undefined, "Travel Tips")
reset_input.disableColon(true);
reset_input.labelTextObject().style.fontSize="12px";
reset_input.labelTextObject().style.fontWeight="bold";
reset_input.labelTextObject().style.textAlign="left";
section.addRow(new UniversalFormRow(reset_input));
section=this.i_form.addSection(new UniversalFormSection("Flight Search Defaults"));
this.i_inputs.flight_twoway=new UniversalRadioInput("", "", "50%", [new UniversalRadioOption("Round-trip", "1"),
new UniversalRadioOption("One-way", "0")]);
this.i_inputs.flight_twoway.columns(2);
this.i_inputs.nonstop=new UniversalCheckBoxOption("I prefer nonstop flights", "Email");
var nonstop=new UniversalCheckBoxInput("", "", "50%", [this.i_inputs.nonstop]);
section.addRow(new UniversalFormRow(this.i_inputs.flight_twoway, nonstop));
var travel_input=new TravelInput(0, "100%");
this.i_inputs.departure_airport=new UniversalTypeaheadInput("Departure airport", "", travel_input, "50%");
this.i_inputs.include_nearby=new UniversalCheckBoxOption("Include nearby airports", "Email");
var include_nearby=new UniversalCheckBoxInput("", "", "50%", [this.i_inputs.include_nearby]);
section.addRow(new UniversalFormRow(this.i_inputs.departure_airport, include_nearby));
var flight_adult_label=new UniversalLabelInput("Travelers", "", undefined, "Adult<br />(18-64)", undefined, "center");
var flight_senior_label=new UniversalLabelInput("", "", undefined, "Senior<br />(65+)", undefined, "center");
var flight_youth_label=new UniversalLabelInput("", "", undefined, "Youth<br />(12-17)", undefined, "center");
var flight_child_label=new UniversalLabelInput("", "", undefined, "Child<br />(2-11)", undefined, "center");
var flight_infant_lap_label=new UniversalLabelInput("", "", undefined, "Infant (lap) (<2)", undefined, "center");
var flight_infant_seat_label=new UniversalLabelInput("", "", undefined, "Infant (seat) (<2)", undefined, "center");
section.addRow(new UniversalFormRow(flight_adult_label, flight_senior_label, flight_youth_label, flight_child_label, flight_infant_lap_label, flight_infant_seat_label));
this.i_inputs.flight_adult_travelers=new UniversalOptionBoxInput("", "", [new UniversalOptionBoxOption("0", "0"),
new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4"),
new UniversalOptionBoxOption("5", "5"),
new UniversalOptionBoxOption("6", "6"),
new UniversalOptionBoxOption("7", "7"),
new UniversalOptionBoxOption("8", "8"),
new UniversalOptionBoxOption("9", "9")]);
this.i_inputs.flight_senior_travelers=new UniversalOptionBoxInput("", "", [new UniversalOptionBoxOption("0", "0"),
new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4"),
new UniversalOptionBoxOption("5", "5"),
new UniversalOptionBoxOption("6", "6"),
new UniversalOptionBoxOption("7", "7"),
new UniversalOptionBoxOption("8", "8"),
new UniversalOptionBoxOption("9", "9")]);
this.i_inputs.flight_youth_travelers=new UniversalOptionBoxInput("", "", [new UniversalOptionBoxOption("0", "0"),
new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4"),
new UniversalOptionBoxOption("5", "5"),
new UniversalOptionBoxOption("6", "6"),
new UniversalOptionBoxOption("7", "7"),
new UniversalOptionBoxOption("8", "8")]);
this.i_inputs.flight_child_travelers=new UniversalOptionBoxInput("", "", [new UniversalOptionBoxOption("0", "0"),
new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4"),
new UniversalOptionBoxOption("5", "5"),
new UniversalOptionBoxOption("6", "6"),
new UniversalOptionBoxOption("7", "7"),
new UniversalOptionBoxOption("8", "8")]);
this.i_inputs.flight_infant_lap_travelers=new UniversalOptionBoxInput("", "", [new UniversalOptionBoxOption("0", "0"),
new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4"),
new UniversalOptionBoxOption("5", "5"),
new UniversalOptionBoxOption("6", "6"),
new UniversalOptionBoxOption("7", "7"),
new UniversalOptionBoxOption("8", "8")]);
this.i_inputs.flight_infant_seat_travelers=new UniversalOptionBoxInput("", "", [new UniversalOptionBoxOption("0", "0"),
new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4"),
new UniversalOptionBoxOption("5", "5"),
new UniversalOptionBoxOption("6", "6"),
new UniversalOptionBoxOption("7", "7"),
new UniversalOptionBoxOption("8", "8")]);
section.addRow(new UniversalFormRow(this.i_inputs.flight_adult_travelers, this.i_inputs.flight_senior_travelers, this.i_inputs.flight_youth_travelers, this.i_inputs.flight_child_travelers, this.i_inputs.flight_infant_lap_travelers, this.i_inputs.flight_infant_seat_travelers));
this.i_inputs.airline=new UniversalOptionBoxInput("Specific airline", "", [new UniversalOptionBoxOption("Any airline", "")]);
section.addRow(new UniversalFormRow(this.i_inputs.airline));
this.i_inputs.cabin=new UniversalOptionBoxInput("Cabin/Class", "", [new UniversalOptionBoxOption("Economy", "0"),
new UniversalOptionBoxOption("Business", "2"),
new UniversalOptionBoxOption("First", "3")]);
this.i_inputs.display=new UniversalOptionBoxInput("Display", "", [new UniversalOptionBoxOption("As separate list", "0"),
new UniversalOptionBoxOption("In calendar", "1")]);
section.addRow(new UniversalFormRow(this.i_inputs.cabin, this.i_inputs.display));
section=this.i_form.addSection(new UniversalFormSection("Flight Result Defaults"));
this.i_inputs.flight_sort_by=new UniversalOptionBoxInput("Sort by", "", [new UniversalOptionBoxOption("Airline", "0"),
new UniversalOptionBoxOption("Flight Number", "1"),
new UniversalOptionBoxOption("Departure Time", "2"),
new UniversalOptionBoxOption("Arrival Time", "3"),
new UniversalOptionBoxOption("Duration", "4"),
new UniversalOptionBoxOption("Price", "5"),
new UniversalOptionBoxOption("Stops", "6")]);
this.i_inputs.flight_sort_order=new UniversalOptionBoxInput("Sort order", "", [new UniversalOptionBoxOption("Ascending", "0"),
new UniversalOptionBoxOption("Descending", "1")]);
section.addRow(new UniversalFormRow(this.i_inputs.flight_sort_by, this.i_inputs.flight_sort_order));
section=this.i_form.addSection(new UniversalFormSection("Hotel Search Defaults"));
this.i_inputs.hotel_chain=new UniversalOptionBoxInput("Hotel chain", "", [new UniversalOptionBoxOption("All hotel chains", "")]);
section.addRow(new UniversalFormRow(this.i_inputs.hotel_chain));
this.i_inputs.hotel_stars=new UniversalOptionBoxInput("Stars", "", [new UniversalOptionBoxOption("Any", "0"),
new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4"),
new UniversalOptionBoxOption("5", "5")]);
this.i_inputs.hotel_stars.preferredInputWidth(60);
this.i_inputs.hotel_adult_travelers=new UniversalOptionBoxInput("Travelers", "", [new UniversalOptionBoxOption("1", "1"),
new UniversalOptionBoxOption("2", "2"),
new UniversalOptionBoxOption("3", "3"),
new UniversalOptionBoxOption("4", "4")]);
this.i_inputs.hotel_adult_travelers.preferredInputWidth(60);
section.addRow(new UniversalFormRow(this.i_inputs.hotel_stars, this.i_inputs.hotel_adult_travelers));
this.i_form.clearModified();
}
return this.i_form;
}
TravelPane.prototype.handleLoad=function(e) {
ExtensionTravel.store.listAirlines(new SmartHandler(this, this.handleLoadAirlines));
}
TravelPane.prototype.handleLoadAirlines=function(airlines) {
for(var i=0; i < airlines.length; i++) {
this.i_inputs.airline.addOption(new UniversalOptionBoxOption(airlines[i].getName(), airlines[i].getCode()));
}
ExtensionTravel.store.listHotelChains(new SmartHandler(this, this.handleLoadHotelChains));
}
TravelPane.prototype.handleLoadHotelChains=function(chains) {
for(var i=0; i < chains.length; i++) {
this.i_inputs.hotel_chain.addOption(new UniversalOptionBoxOption(chains[i].getName(), chains[i].getCode()));
}
ExtensionTravel.store.getSettings(new SmartHandler(this, this.handleLoadPreferences));
}
TravelPane.prototype.handleLoadPreferences=function(settings) {
if(settings==undefined) {
this.i_settings=TravelSettings.getDefaults();
} else {
this.i_settings=settings;
}
var flight_settings=this.i_settings.getFlightSettings();
var hotel_settings=this.i_settings.getHotelSettings();
var help_setting=this.i_settings.getHelpSetting();
var help_list=this.i_settings.getHelpDisableList();
this.i_help_list=Array();
if(help_setting) {
for(var x=0; x < help_list.length; x++) {
this.i_help_list.push(help_list[x]);
}
}
this.i_inputs.flight_twoway.value(flight_settings.getJourneyType());
this.i_inputs.departure_airport.typeahead().clear();
this.i_inputs.departure_airport.typeahead().setLocation(flight_settings.getDepartureLocation());
this.i_inputs.include_nearby.checked(flight_settings.getSearchAlternates());
this.i_inputs.flight_adult_travelers.value(flight_settings.getNumberOfAdults());
this.i_inputs.flight_senior_travelers.value(flight_settings.getNumberOfSeniors());
this.i_inputs.flight_youth_travelers.value(flight_settings.getNumberOfYouths());
this.i_inputs.flight_child_travelers.value(flight_settings.getNumberOfChildren());
this.i_inputs.flight_infant_lap_travelers.value(flight_settings.getNumberOfInfantsInLap());
this.i_inputs.flight_infant_seat_travelers.value(flight_settings.getNumberOfInfantsInSeat());
this.i_inputs.nonstop.checked(flight_settings.getMaxConnections()==0);
var flight_airlines_value=flight_settings.getAirlines();
if(flight_airlines_value!=undefined && 
flight_airlines_value.length > 0) {
this.i_inputs.airline.value(flight_airlines_value[0]);
} else {
this.i_inputs.airline.value("");
}
this.i_inputs.cabin.value(flight_settings.getCabinType());
this.i_inputs.display.value(flight_settings.getDisplayType());
this.i_inputs.flight_sort_by.value(flight_settings.getSortType());
this.i_inputs.flight_sort_order.value(flight_settings.getSortOrder());
var hotel_chain_value=hotel_settings.getHotelChains();
if(hotel_chain_value!=undefined && hotel_chain_value.length > 0) {
this.i_inputs.hotel_chain.value(hotel_chain_value[0]);
} else {
this.i_inputs.hotel_chain.value("");
}
this.i_inputs.hotel_adult_travelers.value(hotel_settings.getNumberOfAdults());
this.i_inputs.hotel_stars.value(hotel_settings.getNumberOfStars());
this.updateDefault();
this.loaded(true);
}
TravelPane.prototype.handleShow=function(e) {
ExtensionTravel.store.getSettings(new SmartHandler(this, this.handleLoadPreferences));
}
TravelPane.prototype.handleResetTipsClick=function() {
this.i_help_list=Array();
}
TravelPane.prototype.save=function() {
settings=new TravelSettings();
settings.setHelpDisableList(this.i_help_list);
var flight_settings=new FlightSettings();
flight_settings.setJourneyType((this.i_inputs.flight_twoway.value() ? 1 : 0));
flight_settings.setDepartureLocation(this.i_inputs.departure_airport.typeahead().getLocation());
flight_settings.setArrivalLocation(undefined);
flight_settings.setSearchAlternates(this.i_inputs.include_nearby.checked());
flight_settings.setNumberOfAdults(this.i_inputs.flight_adult_travelers.value());
flight_settings.setNumberOfSeniors(this.i_inputs.flight_senior_travelers.value());
flight_settings.setNumberOfYouths(this.i_inputs.flight_youth_travelers.value());
flight_settings.setNumberOfChildren(this.i_inputs.flight_child_travelers.value());
flight_settings.setNumberOfInfantsInLap(this.i_inputs.flight_infant_lap_travelers.value());
flight_settings.setNumberOfInfantsInSeat(this.i_inputs.flight_infant_seat_travelers.value());
if(this.i_inputs.nonstop.checked()) {
flight_settings.setMaxConnections(0);
}
if(this.i_inputs.airline.value()!="") {
flight_settings.setAirlines(this.i_inputs.airline.value());
}
flight_settings.setCabinType(this.i_inputs.cabin.value());
flight_settings.setDisplayType(this.i_inputs.display.value());
flight_settings.setSortType(this.i_inputs.flight_sort_by.value());
flight_settings.setSortOrder(this.i_inputs.flight_sort_order.value());
settings.setFlightSettings(flight_settings);
var hotel_settings=new HotelSettings();
if(this.i_inputs.hotel_chain.value()!="") {
hotel_settings.setHotelChains(this.i_inputs.hotel_chain.value());
}
hotel_settings.setLocation(undefined);
hotel_settings.setSameLocation(false);
hotel_settings.setHotelName("");
hotel_settings.setNumberOfAdults(this.i_inputs.hotel_adult_travelers.value());
hotel_settings.setNumberOfChildren(0);
hotel_settings.setNumberOfRooms(1);
hotel_settings.setNumberOfStars(this.i_inputs.hotel_stars.value());
settings.setHotelSettings(hotel_settings);
ExtensionTravel.store.saveSettings(settings);
}
TravelPane.inherit(FormPreferencePane);
Application.getApplicationById(1004).registerPreferencePane(new TravelPane());
JavaScriptResource.notifyComplete("./src/Extensions/Travel/Preference.Travel.js");
function TravelInput(type, width) {
this.i_type=type;
this.i_location=undefined;
this.i_cache=undefined;
this.i_cache_value=undefined;
this.superConstructor(width);
this.setInputLength(255);
}
TravelInput.prototype.getLocation=function() {
return this.i_location;
}
TravelInput.prototype.setLocation=function(location) {
this.i_location=location;
if(location==undefined) {
this.setInputValue("");
} else {
this.setInputValue(this.i_location.getName());
}
}
TravelInput.prototype.select=function(value) {
if(this.i_cache!=undefined) {
for(var x=0; x < this.i_cache.length; x++) {
var location=this.i_cache[x];
if(location.getLocationId()==value) {
this.i_location=location;
this.setInputValue(location.getName());
break;
}
}
}
}
TravelInput.prototype.resolve=function(quick_add) {
var value=this.getInputValue().toLowerCase();
this.i_location=undefined;
if(value.length > 2) {
if(this.i_cache_value==undefined || value.indexOf(this.i_cache_value)!=0) {
this.i_cache=undefined;
this.i_cache_value=value;
var location=new TravelLocation();
location.setType(this.i_type);
location.setName(value);
ExtensionTravel.store.resolveLocations(Array(location), 
new SmartHandler(this, this.handleLocations, quick_add));
} else {
this.displayLocations(this.i_cache, value, quick_add);
}
} else {
this.hideDropdown();
}
}
TravelInput.prototype.displayLocations=function(locations, value, 
quick_add) {
this.clearOptions();
var subset=Array();
if(locations!=undefined) {
locations.sort(TravelLocation.sortByNameAsc);
for(var x=0; x < locations.length; x++) {
var location=locations[x];
if(value.length==3 && location.isAirport() && 
location.getAirportCode().toLowerCase()==value) {
subset.splice(0, 0, location);
} else if(location.getName().toLowerCase().indexOf(value)==0) {
subset.push(location);
}
}
}
if(subset.length > 0) {
this.hideError();
if(quick_add && ((value.length!=3 && subset.length==1) || 
(value.length==3 && subset[0].isAirport() && value==subset[0].getAirportCode().toLowerCase()))) {
this.setLocation(subset[0]);
} else {
for(var x=0; x < subset.length; x++) {
var location=subset[x];
var name="";
if(this.i_type==undefined || this.i_type==-1) {
if(location.isAirport()) {
name+="<div class=\"TravelInput_flight\">";
} else {
name+="<div class=\"TravelInput_not_flight\">";
}
} else {
name+="<div class=\"TravelInput_normal\">";
}
if(location.getName().toLowerCase().indexOf(value)==0) {
name+="<span class=\"TravelInput_hilite\">"+location.getName().substr(0, value.length)+"</span>"+location.getName().substr(value.length);
} else {
name+=location.getName();
}
if(location.isAirport()) {
if(value.length==3 && 
location.getAirportCode().toLowerCase()==value) {
name+=" (<span class=\"TravelInput_hilite\">"+location.getAirportCode()+"</span>)";
} else {
name+=" ("+location.getAirportCode()+")";
}
}
name+="</div>";
this.addOption(new OptionBoxOption(name, 
location.getLocationId(), (x==0)));
}
this.showDropdown();
}
} else if(locations!=undefined) {
this.showError("No results found.");
}
}
TravelInput.prototype.handleLocations=function(locations, quick_add) {
this.i_cache=locations;
this.resolve(quick_add);
}
inherit(TypeaheadInput, TravelInput);
JavaScriptResource.notifyComplete("./src/Extensions/Travel/components/Component.TravelInput.js");
JavaScriptResource.notifyComplete("./btExtTravelPreferences.js");
