// ********************* < page decription > *************************************
// formatDateTimeTextfield.inc
// purpose: contains functions that take a human-typed date or time and attempt to parse it into a clean, computer-
// recognizeable format
//
// functions in this file: formatTime, formatDate, getCharType
// ********************** </page decription > **************************************


	function fillZeros(instring) {
		var returnVal;
		if (instring < 10 || instring.length < 2) {
			returnVal = "0" + instring;
		} else {
			returnVal = instring;
		}
		return returnVal;
	}

	function getCharType(thechar) {
		if ((thechar == null) || (thechar == "")) { 
			return "eol"; //end of line
		}
		
		var charCode = thechar.charCodeAt(0);
		
		if ((charCode >= 48) && (charCode <= 57)) {
			return "n"; //number
		} else if (charCode == 32) {
			return "s"; //space
		} else if (charCode == 58) {
			return "c"; //colon
		} else if ((charCode == 65) || (charCode == 97)) {
			return "a"; //the letter A
		} else if ((charCode == 80) || (charCode == 112)) { 
			return "p"; //the letter p
		} else if (charCode == 47) {
			return "fs"; //forward slash
		} else {
			return "e"; //error (other char)
		}
	}
	
	
	function formatTime(element, hourElement, minElement, ampmElement, timeFormat) {
		var intime = element.value.toUpperCase();
		var finished = false; //used to exit loop
		var state = "start"; //current state
		var currentPosition = 0; //current character position
		var currentCharacter = ""; //current character
		
		var hour = "";
		var minute = "";
		var am_or_pm = "";
		var error = false;
		
		while (!(finished)) {
			switch (state) {
			
				case 'start':
					currentCharacter = intime.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							hour = hour + currentCharacter;
							state = "hour";
							break;
						case 's':
							break;
						case 'c':
							hour = "0";
							state = "minute";
							break;
						case 'a':
							error = true;
							finished = true;
							break;
						case 'p':
							error = true;
							finished = true;
							break;
						case 'e' || 'fs':
							error = true;
							finished = true;
							break;
						case 'eol':
							error = true;
							finished = true;
							break;
					}
					break;
					
				case 'hour':
					currentCharacter = intime.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							hour = hour + currentCharacter;
							break;
						case 's':
							break;
						case 'c':
							state = "minute";
							break;
						case 'a':
							am_or_pm = "AM";
							finished = true;
							break;
						case 'p':
							am_or_pm = "PM";
							finished = true;
							break;
						case 'e' || 'fs':
							error = true;
							finished = true;
							break;
						case 'eol':
							am_or_pm = "AM";
							finished = true;
							break;
					}
					break;		
					
				case 'minute':
					currentCharacter = intime.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							minute = minute + currentCharacter;
							break;
						case 's':
							break;
						case 'c':
							state = "second";
							break;
						case 'a':
							am_or_pm = "AM";
							finished = true;
							break;
						case 'p':
							am_or_pm = "PM";
							finished = true;
							break;
						case 'e' || 'fs':
							error = true;
							finished = true;
							break;
						case 'eol':
							am_or_pm = "AM";
							finished = true;
							break;
					}
					break;		
					
				case 'second':
					currentCharacter = intime.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							break;
						case 's':
							break;
						case 'c':
							error = true;
							finished = true;
							break;
						case 'a':
							am_or_pm = "AM";
							finished = true;
							break;
						case 'p':
							am_or_pm = "PM";
							finished = true;
							break;
						case 'e' || 'fs':
							error = true;
							finished = true;
							break;
						case 'eol':
							am_or_pm = "AM";
							finished = true;
							break;
					}
					break;	
			}
		}	
		
		//now we have to verify that the time is in correct format
		if ((hour > 24) || (minute > 59)) { //check that hour and minutes are not out of range
			element.value = "";
			element.focus();
			error = true;
		}
		
		//now we adjust the hour and am/pm for the given time format
		if (timeFormat == "%H:%M") {
			if ((parseInt(hour) < 12) && (am_or_pm == "PM"))
				hour = "" + (parseInt(hour) + 12);
			am_or_pm = "";
		} else {
			if (parseInt(hour) > 12) {
				hour = "" + (parseInt(hour) - 12);
				am_or_pm = "PM";
			} else if (hour == 0) {
				hour = "12";
				am_or_pm = "AM";
			}
			// Add a space here so that we don't have the space in 24 hour format
			am_or_pm = " " + am_or_pm;
		}
		
		if (error == true) {
			element.value = "";
			if(hourElement!=null)hourElement.value="";
			if(minElement!=null)minElement.value="";
			if(ampmElement!=null)ampmElement.value="";
		} else {
			if (minute == "") { minute = "00"; } //if no minute is specified, then minute is "00"
			if (minute.length == 1) { minute = "0" + minute; } //compensate for single-digit minutes
			if (hour.length == 1) { hour = "0" + hour; } //compensate for single-digit hours
			
			element.value = hour + ":" + minute + am_or_pm;
			if(hourElement!=null)hourElement.value=hour;
			if(minElement!=null)minElement.value=minute;
			if(ampmElement!=null)ampmElement.value=am_or_pm;
		}
	}
	
	function containsLetters(string) {
		string = string.toUpperCase();
		for(var i=0; i<string.length; i++) {
			var c = string.charCodeAt(i);
			if ((c >= 65) && (c <= 90)) {
				return true;
			}
		}
		return false;
	}
	
	function formatDate(element, dayElement, monthElement, yearElement, y2kBreak, dateFormat) {	
		var indate = element.value;
		
		var finished = false; //used to exit loop
		var state = "start"; //current state
		var currentPosition = 0; //current character position
		var currentCharacter = ""; //current character
		
		var month = "";
		var day = "";
		var year = "";
		var error = false;
		var final_date;
		
		//get info about this year
		var todays_date = new Date();
		var this_year = (todays_date.getYear()<1000)?(todays_date.getYear()+1900):todays_date.getYear(); // Y2k Netscape fix
		
		if (y2kBreak == null)
		{
			y2kBreak = 100;
		}
		
		//fix if someone used periods
		while (indate.indexOf('.') > -1) {
			indate = indate.replace('.', '/');
		}
		
		//replace all dashes with backslashes
		while (indate.indexOf('-') > -1) {
			indate = indate.replace('-', '/');
		}
		
		//since our state machine cannot parse text dates (eg: January 15, 2001) we'll let javascript try first
		if (containsLetters(indate)) {
			if (indate.indexOf(",") == -1) {
				indate = indate + ", " + this_year;
			}
			var jscript_date = new Date(indate);
			
			//if jscript returned a non-NaN value, use that instead
			if (!(isNaN(jscript_date))) {
				month = parseInt(jscript_date.getMonth() + 1);
				day = jscript_date.getDate();
				year = (jscript_date.getYear()<1000)?(jscript_date.getYear()+1900):jscript_date.getYear();
				
				//skip parse loop
				finished = true;
			}
		}
		
		
		while (!(finished)) {
			switch (state) {
			
				case 'start':
					currentCharacter = indate.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							if (dateFormat == "%d/%m/%Y") {
								day = day + currentCharacter;
								state = "day";
							} else {
								month = month + currentCharacter;
								state = "month";
							}
							break;
						case 'fs':
							error = true;
							finished = true;
							break;
						case 's':
							break;
						case 'e' || 'c' || 'a' || 'p':
							error = true;
							finished = true;
							break;
						case 'eol':
							error = true;
							finished = true;
							break;
					}
				break;
				
				case 'month':
					currentCharacter = indate.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							month = month + currentCharacter;
							break;
						case 'fs':
							if (dateFormat == "%d/%m/%Y")
								state = "year";
							else
								state = "day";
							break;
						case 's':
							break;
						case 'e' || 'c' || 'a' || 'p':
							error = true;
							finished = true;
							break;
						case 'eol':
							if (dateFormat == "%d/%m/%Y") {
								year = this_year;
								finished = true;
							} else {
								error = true;
								finished = true;
							}
							break;
					}
				break;
				
				case 'day':
					currentCharacter = indate.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							day = day + currentCharacter;
							break;
						case 'fs':
							if (dateFormat == "%d/%m/%Y")
								state = "month";
							else
								state = "year";
							break;
						case 's':
							break;
						case 'e' || 'c' || 'a' || 'p':
							error = true;
							finished = true;
							break;
						case 'eol':
							if (dateFormat == "%d/%m/%Y") {
								error = true;
								finished = true;
							} else {
								year = this_year;
								finished = true;
							}
							break;
					}
				break;
				
				case 'year':
					currentCharacter = indate.charAt(currentPosition); //read char
					currentPosition += 1;
					switch (getCharType(currentCharacter)) {
						case 'n':
							year = year + currentCharacter;
							break;
						case 'fs':
							error = true;
							finished = true;
							break;
						case 's':
							break;
						case 'e' || 'c' || 'a' || 'p':
							error = true;
							finished = true;
							break;
						case 'eol':
							finished = true;
							break;
					}
				break;
			}
		}
		
		//if error, break
		if (error) {
			element.value = "";
			if(dayElement!=null)dayElement.value="";
			if(monthElement!=null)monthElement.value="";
			if(yearElement!=null)yearElement.value="";
			return false;
		}
		
		//verify lengths and values
		if ((month > 12) || (month.length > 2)) {
			element.value = "";
			if(dayElement!=null)dayElement.value="";
			if(monthElement!=null)monthElement.value="";
			if(yearElement!=null)yearElement.value="";
			return false;
		} else if ((day > 31) || (day.length > 2)) {
			element.value = "";
			if(dayElement!=null)dayElement.value="";
			if(monthElement!=null)monthElement.value="";
			if(yearElement!=null)yearElement.value="";
			return false;
		} else if (year.length > 4) {
			element.value = "";
			if(dayElement!=null)dayElement.value="";
			if(monthElement!=null)monthElement.value="";
			if(yearElement!=null)yearElement.value="";
			return false;
		}
		
		//standardize year to four digits
		if (year.length == 1)
		{ 
			if(year < y2kBreak)
			{
				year = "200" + year;
			}
			else
			{
				year = "190" + year;
			}
			
		}		
		else if (year.length == 2) 
		{
			if(year < y2kBreak)
			{
				year = "20" + year;
			}
			else
			{
				year = "19" + year;
			}
		}
		
		// make sure that it is impossible to enter a year that is earlier than 1904. If the year is less than 1904, make
		// the year 1904
		if(year<1904)
		{
			// if year is < 1904, blank out the date
			element.value = "";
			if(dayElement!=null)dayElement.value="";
			if(monthElement!=null)monthElement.value="";
			if(yearElement!=null)yearElement.value="";
		}
		else
		{
			// create another date, this time to eliminate month overflows like Feb 30, etc.
			final_date = new Date(fillZeros(month) + "/" + fillZeros(day) + "/" + fillZeros(year));
			if(!isNaN(final_date))
			{
				day = final_date.getDate();
				month = final_date.getMonth() + 1;
				year = (final_date.getYear()<1000)?(final_date.getYear()+1900):final_date.getYear();
				
				//set text to formatted
				if (dateFormat == "%d/%m/%Y")
					element.value = fillZeros(day) + "/" + fillZeros(month) + "/" + fillZeros(year);
				else
					element.value = fillZeros(month) + "/" + fillZeros(day) + "/" + fillZeros(year);

				//set the day month and year elements
				if(dayElement!=null)dayElement.value=fillZeros(day);
				if(monthElement!=null)monthElement.value=fillZeros(month);
				if(yearElement!=null)yearElement.value=fillZeros(year);
			}
			else
			{
				// bad date
				element.value = "";
				if(dayElement!=null)dayElement.value="";
				if(monthElement!=null)monthElement.value="";
				if(yearElement!=null)yearElement.value="";
			}
		}
	}