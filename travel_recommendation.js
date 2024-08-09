const apiUrl = './travel_recommendation_api.json';
const countries = [];
const temples = [];
const beaches = [];

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data received:", data);

        if (data.countries) {
            countries.push(...data.countries);
            console.log("countries: ", countries);
        }
        if (data.beaches) {
            beaches.push(...data.beaches);
            console.log("Beaches: ", beaches);
        }
        if (data.temples) {
            temples.push(...data.temples);
            console.log("Temples: ", temples);
        }
    })
    .catch(error => {
        console.error("Error caught:", error);
    });

const searchButton = document.getElementById("search-bttn");
let recommended = []; // Changed to let to allow reassignment

function search() {
    // Clear the recommended array before populating it
    recommended = [];

    let keyword = document.getElementById("search-input").value.toString().toLowerCase();

    if (keyword === "beach" || keyword === "beaches") {
        beaches.forEach(beach => {
            if (!recommended.some(item => item === beach)) {
                recommended.push(beach);
            }
        });
    } else if (keyword === "temples" || keyword === "temple") {
        temples.forEach(temple => {
            if (!recommended.some(item => item === temple)) {
                recommended.push(temple);
            }
        });
    } else if (keyword === "country" || keyword === "countries") {
        countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
                if (!recommended.some(item => item === country)) {
                    recommended.push(country);
                }
            } else {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword) || city.description.toLowerCase().includes(keyword)) {
                        if (!recommended.some(item => item === country)) {
                            recommended.push(country);
                        }
                    }
                });
            }
        });
    } else {
        // Search within countries
        countries.forEach(country => {
            if (country.name.toLowerCase().includes(keyword)) {
                if (!recommended.some(item => item === country)) {
                    recommended.push(country);
                }
            } else {
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword) || city.description.toLowerCase().includes(keyword)) {
                        if (!recommended.some(item => item === country)) {
                            recommended.push(country);
                        }
                    }
                });
            }
        });

        // Search within temples
        temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(keyword) || temple.description.toLowerCase().includes(keyword)) {
                if (!recommended.some(item => item === temple)) {
                    recommended.push(temple);
                }
            }
        });

        // Search within beaches
        beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(keyword) || beach.description.toLowerCase().includes(keyword)) {
                if (!recommended.some(item => item === beach)) {
                    recommended.push(beach);
                }
            }
        });
    }

    displaySearch();
}

// Add event listener to search button
searchButton.addEventListener("click", search);

function displaySearch() {
    let display = document.getElementById('home-recommendations');
    display.innerHTML = '';

    recommended.forEach(item => {
        // Assuming the first city should be displayed for specific countries
        if (item.name === 'Australia' || item.name === 'Japan' || item.name === 'Brazil') {
            if (item.cities && item.cities.length > 0) {
                display.innerHTML += `<div class="recommend">
                    <img src="${item.cities[0].imageUrl}">
                    <span>${item.cities[0].name}</span>
                    <p>${item.cities[0].description}</p>
                    <button class="recommend-bttn"> Visit </button>
                </div>`;
            }
        } else {
            display.innerHTML += `<div class="recommend">
                <img src="${item.imageUrl}">
                <span>${item.name}</span>
                <p>${item.description}</p>
                <button class="recommend-bttn"> Visit </button>
            </div>`;
        }
    });
}

// Clear button functionality
document.getElementById("clear-bttn").addEventListener('click', function () {
    document.getElementById('home-recommendations').innerHTML = '';
    document.getElementById("search-input").value='';
});