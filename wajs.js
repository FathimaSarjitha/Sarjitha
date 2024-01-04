var templateString;

function getWeather() {
	const apiKey = 'f4a8a418ee26cd78edb9b9cd7ea0829c' ; // Replace with your OpenWeatherMap API key
	const location = document.getElementById('locationInput').value;
	const weatherDisplay = document.getElementById('weatherDisplay');
	

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&cnt=8`;

    fetch(forecastURL)
      .then(response => response.json())
      .then(forecastData => {

		const todayForecast = forecastData.list[0];
        const nextDayForecast = forecastData.list[7];
		const Timezone = new Date(((Date.now()/1000) + forecastData.city.timezone)*1000);
	
		templateString = `
		${forecastData.city.country}, ${forecastData.city.name}
		Timezone: ${Timezone}
		Latitude: ${forecastData.city.coord.lat}
		Longitude: ${forecastData.city.coord.lon}

		${todayForecast.dt_txt} Forecast
		Temperature: ${todayForecast.main.temp}°C
		Humidity: ${todayForecast.main.humidity}%
		Weather: ${todayForecast.weather[0].description}

		${nextDayForecast.dt_txt} Forecast
		Temperature: ${nextDayForecast.main.temp}°C
		Humidity: ${nextDayForecast.main.humidity}%
		Weather: ${nextDayForecast.weather[0].description}
		`;



		// to add the details to div
        weatherDisplay.innerHTML = `
		<h2>${forecastData.city.country}, ${forecastData.city.name}</h2>
		<p> Timezone: ${Timezone}
		<p>Latitude: ${forecastData.city.coord.lat}</p>
		<p>Longitude: ${forecastData.city.coord.lon}</p>

		<h3> ${todayForecast.dt_txt} Forecast</h3>
		<p>Temperature: ${todayForecast.main.temp}°C</p>
		<p>Humidity: ${todayForecast.main.humidity}%</p>
		<p>Weather: ${todayForecast.weather[0].description}</p>


		<h3>${nextDayForecast.dt_txt} Forecast</h3>
		<p>Temperature: ${nextDayForecast.main.temp}°C</p>
		<p>Humidity: ${nextDayForecast.main.humidity}%</p>
		<p>Weather: ${nextDayForecast.weather[0].description}</p>
        `;
      })
	
    

    setTimeout(() => {
		Swal.fire({
			title: "Do You Want This Data",
			icon: "question",
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Send As SMS!"
		  }).then((result) => {
			if (result.isConfirmed) {
				const wantMessage = document.getElementById('getnotinfo');
				wantMessage.innerHTML = `<form><input type="number" require name="phone" class="form-control item" id="phone-number" placeholder="07XXXXXXXX" max='9999999999999'></form>
				<button id='sendbtn' onclick="showdata()">Send SMS</button>
				`;

				document.getElementById('sendbtn').addEventListener('click', (event) => {
					const phoneNumberInput = document.getElementById('phone-number');
					const toNumber = phoneNumberInput.value.trim();
				  
					// Validate phone number format 
					if (!/^07\d{8}$/.test(toNumber)) {
					  alert('Invalid phone number format. Please enter a valid Sri Lankan phone number.');
					  return;
					}
				  
					const formattedPhoneNumber = `+94${toNumber.substring(1)}`;			 
					const messageBody = templateString;

					fetch('http://127.0.0.1:3000/send-sms', {
					  method: 'POST',
					  headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					  },
					  body: `Number=${encodeURIComponent(formattedPhoneNumber)}&messageBody=${encodeURIComponent(messageBody)}`,
					})
					.then(response => response.json())
					.then(data => {
					  console.log(data);
					  alert('SMS sent successfully!');
					})
					.catch(error => {
					  console.error('Error sending SMS:', error);
					  alert('Error sending SMS. Check the console for details.');
					});
				  });


			}else{
				Swal.fire({
					title: "Thank You!",
					button:false,
				  });
			}
		  });
    }, 3000);


}

