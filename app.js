const SPOONACULAR_API_KEY = 'ea8b7eafbeb04e7988a853894b8b08ea';
const YOUTUBE_API_KEY = 'AIzaSyB-Sa6mkuvqGjxKDy4I1A7Xx7WRfRCRhKU';

document.getElementById('find-recipes').addEventListener('click', () => {
    const selectedIngredients = Array.from(document.querySelectorAll('.ingredient-selector input:checked')).map(input => input.value).join(',');
    
    if (selectedIngredients) {
        fetchRecipes(selectedIngredients);
    } else {
        document.getElementById('recipe-results').innerHTML = '<p>Please select some ingredients.</p>';
        document.getElementById('youtube-results').innerHTML = '';
    }
});

async function fetchRecipes(ingredients) {
    const recipeUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${SPOONACULAR_API_KEY}&number=5`;
    
    try {
        const response = await fetch(recipeUrl);
        const data = await response.json();
        displayRecipes(data);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        document.getElementById('recipe-results').innerHTML = '<p>An error occurred while fetching recipes.</p>';
        document.getElementById('youtube-results').innerHTML = '';
    }
}

function displayRecipes(recipes) {
    const recipeResults = document.getElementById('recipe-results');
    recipeResults.innerHTML = '';

    if (recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            recipeItem.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}" width="100">
                <h3>${recipe.title}</h3>
                <button onclick="searchYouTube('${recipe.title}')">Watch Recipe Video</button>
            `;
            recipeResults.appendChild(recipeItem);
        });
    } else {
        recipeResults.innerHTML = '<p>No recipes found for the selected ingredients.</p>';
        document.getElementById('youtube-results').innerHTML = '';
    }
}

async function searchYouTube(query) {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1`;
    
    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        redirectToYouTubeVideo(data.items);
    } catch (error) {
        console.error('Error searching YouTube:', error);
        document.getElementById('youtube-results').innerHTML = '<p>An error occurred while searching YouTube.</p>';
    }
}

function redirectToYouTubeVideo(videos) {
    if (videos.length > 0) {
        const videoId = videos[0].id.videoId;
        window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
    } else {
        document.getElementById('youtube-results').innerHTML = '<p>No YouTube videos found for the selected recipe.</p>';
    }
}
