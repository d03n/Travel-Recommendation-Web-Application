const contentContainer = document.querySelector('#content-container');
contentContainer.style.display = "none";

class Place {
    constructor(keyword, name, imageUrl, description) {
        this.keyword = keyword;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

let places = [];
let searchFilter = [];

async function getData() {
    const urlApi = './travel_recommendation_api.json';
    try {
        const response = await fetch(urlApi);
        const data = await response.json();
        const countries = data.countries;
        const temples = data.temples;
        const beaches = data.beaches;

        countries.forEach(country => {
            const keyword = country.name;
            const cities = country.cities;
            cities.forEach(city => {
                places.push(new Place(keyword, city.name, city.imageUrl, city.description));
            });
        });

        temples.forEach(temple => {
            const keyword = "temples";
            places.push(new Place(keyword, temple.name, temple.imageUrl, temple.description));
        });

        beaches.forEach(beach => {
            const keyword = "beaches";
            places.push(new Place(keyword, beach.name, beach.imageUrl, beach.description));
        });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function searchCondition() {
    places = [];
    await getData();

    let input = document.querySelector('input[name="input-text"]').value;
    searchFilter = places.filter((place) => place.keyword.toLowerCase() === input.toLowerCase());
    
    display();
}

function display() {
    contentContainer.style.display = "flex";
    let contentHtml = searchFilter.map(data => {
        return `<div class="content">
        <img src="${data.imageUrl}">
        <h4 class="name">${data.name}</h4>
        <p class="description">
        ${data.description}
        </p>
        <button>More...</button>
        </div>`
    }).join('');
    document.querySelector("#content-container").innerHTML = contentHtml;
}

function clearSearchingResult() {
    searchFilter = [];
    display();
    contentContainer.style.display = "none";
}

const searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener("click", searchCondition);

const clearBtn = document.querySelector("#clear-btn");
clearBtn.addEventListener("click", clearSearchingResult);
