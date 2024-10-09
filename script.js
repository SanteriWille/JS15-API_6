const apiKey = "8615eefc";
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const toggleThemeButton = document.getElementById("toggleTheme");
const movieInfo = document.getElementById("movieInfo");
const recommendedMovies = document.getElementById("recommendedMovies");
let darkMode = false;

async function fetchMovie(title) {
    const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`);
    const data = await response.json();
    return data;
}

async function fetchRecommendedMovies() {
    const response = await fetch(`https://www.omdbapi.com/?s=movie&apikey=${apiKey}`);
    const data = await response.json();
    if (data.Search) {
        // Shuffle the array and select the first 3 movies
        const shuffled = data.Search.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }
    return [];
}

function displayMovie(data) {
    if (data.Response === "True") {
        movieInfo.innerHTML = `
            <div class="movie">
                <h2>${data.Title} (${data.Year})</h2>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Plot:</strong> ${data.Plot}</p>
                ${data.Poster ? `<img class="poster" src="${data.Poster}" alt="${data.Title}">` : ''}
            </div>
        `;
    } else {
        movieInfo.innerHTML = `<p>No movies found.</p>`;
    }
}

function displayRecommended(movies) {
    recommendedMovies.innerHTML = movies.map(movie => `
        <div class="movie">
            <h3>${movie.Title} (${movie.Year})</h3>
            ${movie.Poster ? `<img class="poster" src="${movie.Poster}" alt="${movie.Title}">` : ''}
        </div>
    `).join('');
}

function handleSearch() {
    const title = searchInput.value;
    fetchMovie(title).then(displayMovie);
}

searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

toggleThemeButton.addEventListener("click", () => {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);
    document.querySelector(".container").classList.toggle("dark-mode", darkMode);
    document.querySelector("h1").classList.toggle("dark-mode", darkMode);
    const movies = document.querySelectorAll(".movie");
    movies.forEach(movie => movie.classList.toggle("dark-mode", darkMode));
});

window.onload = () => {
    fetchRecommendedMovies().then(displayRecommended);
};