/* Global Variables */
const generateButtonId = 'generate';
const zipcodeTextId = 'zip';
const weatherResponseTextId = 'feelings';
const dateDisplayTextId = 'date';
const tempDisplayTextId = 'temp';
const contentDisplayTextId = 'content';
const designatedEvent = 'click';

//Get all necessary Html compoenents
const generateButton = document.getElementById(generateButtonId);
const zipCode = document.getElementById(zipcodeTextId);
const weatherResponse = document.getElementById(weatherResponseTextId);

const datehtml = document.getElementById(dateDisplayTextId);
const temphtml = document.getElementById(tempDisplayTextId);
const contenthtml = document.getElementById(contentDisplayTextId);

//server side post url
const postDataUrl = '/api/v1/projectdata';

//error messages
const eventListenerButtonError = 'an error occured getting weather, saving & displaying ui';
const getWeatherError = 'an error occured getting weather temp';
const saveDataError = 'an error occured saving Data';


// API details
const url = 'https://api.openweathermap.org/data/2.5/weather'
const APIKey = '72d4d799de2aecd4c7267456faf6e47b'

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element

generateButton.addEventListener(designatedEvent, () => {
    //chaining promises
    getWeatherData()
      .then(temp => {
        return {date: newDate, temp, content: weatherResponse.value}
      })
      .then(data => {postData(postDataUrl, data)
        return data
      })
      .then(({temp, date, content}) => updateUIPage(temp, date, content))
      .catch(error => {
        console.log(eventListenerButtonError, error);
    })
})

const updateUIPage = async (tempToDisplay, dateToDisplay, weatherResponseToDisplay) => {
    datehtml.innerHTML = dateToDisplay
    temphtml.innerHTML = `${tempToDisplay}`
    contenthtml.innerHTML = weatherResponseToDisplay
}

/* GET Web API Data */
const getWeatherData = async () => {
    
    const zipCodeValue = zipCode.value;
    const unit = 'imperial';
    console.log(`zipcodevalue is ${zipCodeValue}`);

    const response  = await fetch(`${url}?zip=${zipCodeValue},us&units=${unit}&APPID=${APIKey}`);
    try {
        const apiData = await response.json();
        const {main: {temp},} = apiData
        return temp
      
    } catch(error) {
        console.log(getWeatherError, error);
    };
};

const contentType = 'application/json';
const methodUsed = 'POST';
const postData = async (url, data) => {
    try {
      await fetch(url, {
        method: methodUsed,
        headers: {
          'Content-Type': contentType,
        },
        body: JSON.stringify(data),
      })
    } catch (error) {
        console.log(saveDataError, error);
    }
}



