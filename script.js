const recipeForm = document.getElementById('recipeForm');
const recipesTable = document.getElementById('recipesTable');
const searchInput = document.getElementById('search');

let recipes = [];

function saveRecipes() {
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipes)
    });
}

recipeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(recipeForm);
    const recipe = {
        name: data.get('name'),
        cookTime: data.get('cookTime'),
        servings: data.get('servings'),
        ingredients: data.get('ingredients').split(',').map(i => i.trim()),
        pan: data.get('pan'),
        nutrition: data.get('nutrition'),
        rating: 0 // Start with 0 rating
    };
    recipes.push(recipe);
    renderRecipes();
    saveRecipes();
    recipeForm.reset();
});

searchInput.addEventListener('input', renderRecipes);

function renderRecipes() {
    const filter = searchInput.value.toLowerCase();
    recipesTable.innerHTML = '';
    recipes
        .filter(r => r.name.toLowerCase().includes(filter))
        .forEach((r, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.name}</td>
                <td>${r.cookTime}</td>
                <td>${r.servings}</td>
                <td>${r.rating}</td>
            `;
            tr.style.cursor = 'pointer';
            tr.title = 'Click to add a rating';
            tr.addEventListener('click', function() {
                recipes[idx].rating = (parseInt(recipes[idx].rating) || 0) + 1;
                renderRecipes();
                saveRecipes();
            });
            recipesTable.appendChild(tr);
        });
}
