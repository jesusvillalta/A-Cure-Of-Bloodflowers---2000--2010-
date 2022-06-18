function CreditCardsPane() {
this.superFormPreferencePane("Credit Cards", "Manage your credit cards.");
this.i_cards=[];
this.i_sub_content=undefined;
this.i_card_list=undefined;
this.i_card_delete_id=undefined;
CreditCardsPane.obj=this;
ExtensionBilling.obj.loadFiles("preferences");
EventHandler.register(this, "onload", this.handleLoad, this);
}
CreditCardsPane.prototype.getForm=function() {
var ret=new Object();
ret.getForm=CreditCardsPane.handleGetForm;
ret.isModified=function() { return false };
ret.height=function() { return 0 };
ret.width=function() { return 0 };
ret.reset=function() { };
ret.clearModified=function() { };
ret.updateHeight=function() { };
return ret;
}
CreditCardsPane.prototype.handleLoad=function(e) {
var note=Notifications.add("Retrieving billing information");
ExtensionBilling.store.getUserCards(new SmartHandler(this,
this.handleLoadPreferences, note));
ExtensionBilling.store.getContact();
}
CreditCardsPane.prototype.handleLoadPreferences=function(cards, note) {
if(cards!=undefined) {
Notifications.end(note);
this.i_cards=cards;
this.populateContent();
} else {
Notifications.end(note, 3, true);
DialogManager.alert("An error occurred while fetching your billing "+"information. Please try again later.");
}
this.updateDefault();
this.loaded(true);
}
CreditCardsPane.prototype.save=function() {
settings=new TravelSettings();
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
CreditCardsPane.prototype.getSubContent=function() {
if(this.i_sub_content==undefined) {
this.i_sub_content=document.createElement("div");
var paddingdiv=document.createElement("div");
paddingdiv.className="UniversalFormSection_padding";
paddingdiv.style.height="10px";
this.i_sub_content.appendChild(paddingdiv);
this.i_card_list=document.createElement("div");
var add_container=document.createElement("div");
add_container.className="Billing_settings_add";
var add_button=document.createElement("button");
add_button.innerHTML="Add Card";
EventListener.listen(add_button, "onclick", new SmartHandler(this,
this.handleClickAdd));
add_container.appendChild(add_button);
this.i_sub_content.appendChild(this.i_card_list);
this.i_sub_content.appendChild(add_container);
}
return this.i_sub_content;
}
CreditCardsPane.prototype.populateContent=function() {
if(this.i_sub_content!=undefined) {
this.i_card_list.innerHTML="";
for(var i=0; i < this.i_cards.length; i++) {
var card=this.i_cards[i];
var card_container=document.createElement("div");
card_container.className="Billing_settings_card";
var action_container=document.createElement("div");
action_container.className="Billing_settings_action";
var edit_button=document.createElement("button");
edit_button.innerHTML="Edit";
EventListener.listen(edit_button, "onclick", new SmartHandler(this, this.handleClickModify, card, false, true));
var delete_button=document.createElement("button");
delete_button.innerHTML="Delete";
EventListener.listen(delete_button, "onclick", new SmartHandler(this, this.handleClickDelete, card.getId(), false, true));
action_container.appendChild(edit_button);
action_container.appendChild(delete_button);
var info_container=document.createElement("div");
info_container.className="Billing_settings_info";
var card_info=document.createElement("div");
card_info.className="Billing_settings_card_info";
card_info.innerHTML=card.getType()+": "+card.getNumber();
var card_expiration=document.createElement("div");
if(card.isExpired()) {
card_expiration.innerHTML="Expired: "+card.getExpiration();
info_container.className+=" Billing_settings_card_expired";
} else {
card_expiration.innerHTML="Expiration: "+card.getExpiration();
}
info_container.appendChild(card_info);
info_container.appendChild(card_expiration);
card_container.appendChild(action_container);
card_container.appendChild(info_container);
this.i_card_list.appendChild(card_container);
}
}
}
CreditCardsPane.prototype.handleClickAdd=function() {
ExtensionBilling.obj.createCard(new SmartHandler(this, this.handleLoad));
}
CreditCardsPane.prototype.handleClickModify=function(card) {
ExtensionBilling.obj.modifyCard(card, new SmartHandler(this,
this.handleLoad));
}
CreditCardsPane.prototype.handleClickDelete=function(id) {
this.i_card_delete_id=id;
DialogManager.confirm("Are you sure you want to delete this credit card?",
"Confirm Delete", CreditCardsPane.handleDeleteConfirm);
}
CreditCardsPane.prototype.handleDeleteConfirm=function(confirm) {
if(confirm) {
ExtensionBilling.store.deleteUserCard(this.i_card_delete_id,
new SmartHandler(this, this.handleDelete));
}
this.i_card_delete_id=undefined;
}
CreditCardsPane.prototype.handleDelete=function(success) {
if(success) {
this.handleLoad();
} else {
DialogManager.alert("An error occurred while deleting this card. "+"Please try again later.");
}
}
CreditCardsPane.handleDeleteConfirm=function(value) {
if(value=="OK") {
CreditCardsPane.obj.handleDeleteConfirm(true);
} else {
CreditCardsPane.obj.handleDeleteConfirm(false);
}
}
CreditCardsPane.handleGetForm=function() {
return CreditCardsPane.obj.getSubContent();
}
CreditCardsPane.inherit(FormPreferencePane);
Application.getApplicationById("GP").registerPreferencePane(new CreditCardsPane());
JavaScriptResource.notifyComplete("./src/Extensions/Travel/Preference.Travel.js");
JavaScriptResource.notifyComplete("./btExtBillingPreferences.js");
