var socket;

const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');
const mth_element = document.querySelector('.date-picker .dates .month .mth');
const mth_element_h1 = document.querySelector(".date h1");
const next_mth_element = document.querySelector('.next-mth');
const prev_mth_element = document.querySelector('.prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//get today's date
let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

//initializing them with current date
let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

mth_element_h1.innerHTML = months[month] + ' ' + year;

//print the date on the calendar
selected_date_element.textContent = date.toDateString();
//highlight the selected day on the calendar
selected_date_element.dataset.value = selectedDate;
//connect to socket 
socket = io.connect('http://localhost:8887');

populateDates();

// EVENT LISTENERS
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);


function goToNextMonth (e) {
	month++;
	if (month > 11) {
		month = 0;
		year++;
	}
	mth_element_h1.textContent = months[month] + ' ' + year;
	populateDates();
}

function goToPrevMonth (e) {
	month--;
	if (month < 0) {
		month = 11;
		year--;
	}
	mth_element_h1.textContent = months[month] + ' ' + year;
	populateDates();
}

//receive sound from socket
socket.on('sounds', getSounds);
function getSounds(data){
	var player = document.getElementById('player');
	console.log('sound gotten: '+ data)
	player.setAttribute('src', data);
	console.log("playing audio "+player);
	var today = new Date();
	var time = (today.getHours()*3600) + (today.getMinutes() *60)+ today.getSeconds();
	console.log("current time - "+ time.toString());
	
	//player.currentTime = today.getSeconds();
	player.play();
	/*
	for creating dynamic audio attribute
	var audio = new Audio("music/"+data[1])
	if (audio.paused) {
		console.log()
		console.log("playing audio "+audio);var today = new Date();
		var time = (today.getHours()*3600) + (today.getMinutes() *60)+ today.getSeconds();
		console.log("current time - "+ time.toString());
		
		audio.currentTime = today.getSeconds();
		audio.play();
	}else{
		console.log("restarting audio");
		audio.currentTime = 0
	}*/

}

//Not Working for dynamic audio: stop multiple audio from playing concurrently
/*
document.addEventListener('play', function(e){
	var audios = document.getElementsByTagName('audio');
	for(var i = 0, len = audios.length; i < len;i++){
		if(audios[i] != e.target){
			audios[i].pause();
		}
	}
}, true);
*/
function populateDates (e) {
//function populateDates (e, selectedMonth, selectedYear) {
	days_element.innerHTML = '';
	let amount_days = 31;
	const month_30 = [3,5,8,10]
	if (month == 1) {
		amount_days = 28;
	}
	if(month_30.includes(month)){
		amount_days = 30;
	}
	let currentDate = new Date();//get today's date
	let currentday = date.getDate();
	let currentmonth = date.getMonth()+1;
	let currentyear = date.getFullYear();

	for (let i = 0; i < amount_days; i++) {
		const day_element = document.createElement('div');
		day_element.classList.add('day');
		day_element.textContent = i + 1;

        //highlights today's date
		if (currentday == (i + 1) && selectedYear == currentyear && selectedMonth+1 == currentmonth) {
			//day_element.classList.add('selected'); 
			
			console.log((i+1).toString()+selectedMonth.toString());
			day_element.classList.add('today');
		}
		// if (day == (i + 1) && selectedYear == year && selectedMonth == month) {
		// 	//day_element.classList.add('selected');
		// 	day_element.classList.add('today');
        // }
        
        //highlights selected date
        if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
			//day_element.classList.add('selected');
			day_element.classList.add('selected');
		}
		// if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
		// 	//day_element.classList.add('selected');
		// 	day_element.classList.add('selected');
		// }

		day_element.addEventListener('click', function () {
			//add +1 to month and day because they count from 0, not 1
			selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
			selectedDay = (i + 1);
			selectedMonth = month;
			selectedYear = year;

			selected_date_element.textContent = selectedDate.toDateString();
			selected_date_element.dataset.value = selectedDate;
			
			//adding +2 to day because it counts from zero, and ISO is usually a day behind for days behind today's date - making it 2 days.
			var data = new Date(year + '-' + (month + 1) + '-' + (i + 2)).toISOString();
			console.log(selectedDate);
			console.log("sending: "+data);
			
			//sending date to server
			socket.emit('dateSelected', data);
			populateDates();
		});

		days_element.appendChild(day_element);
	}
}

// HELPER FUNCTIONS
function checkEventPathForClass (path, selector) {
	for (let i = 0; i < path.length; i++) {
		if (path[i].classList && path[i].classList.contains(selector)) {
			return true;
		}
	}
	
	return false;
}
function formatDate (d) {
	let day = d.getDate();
	if (day < 10) {
		day = '0' + day;
	}

	let month = d.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}

	let year = d.getFullYear();

	return day + ' / ' + month + ' / ' + year;
}