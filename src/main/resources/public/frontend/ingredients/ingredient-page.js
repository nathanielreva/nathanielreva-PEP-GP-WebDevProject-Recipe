/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */


const addIngredientNameInput = document.getElementById('add-ingredient-name-input');
const deleteIngredientNameInput = document.getElementById('delete-ingredient-name-input');
const ingredientListContainer = document.getElementById('ingredient-list');
const addIngredientListSubmitButton = document.getElementById('add-ingredient-submit-button');
const deleteIngredientSubmitButton = document.getElementById('delete-ingredient-submit-button');


/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */

addIngredientListSubmitButton.addEventListener('click', () => {
    addIngredient(addIngredientNameInput.value);
});
deleteIngredientSubmitButton.addEventListener('click', () => {
    deleteIngredient(deleteIngredientNameInput.value);
});

/*
 * TODO: Create an array to keep track of ingredients
 */

var ingredients = [];

//sessions
let bearerToken = sessionStorage.getItem("auth-token") || "";
let isAdmin = sessionStorage.getItem('is-admin') === "true";


/* 
 * TODO: On page load, call getIngredients()
 */

(function(){
    getIngredients();
})();

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient(ingredient) {
    if(ingredient.trim() == ""){
        alert("Ingredient cannot be empty");
        return;
    }
    const ingredientPOST = {
        name: ingredient
    }

    fetch(`${BASE_URL}/ingredients`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${bearerToken}`
        },
        body: JSON.stringify(ingredientPOST)
    }).then(res => {
        if(res.status  == 201){
            addIngredientNameInput.value = "";
            getIngredients();
        }else{
            alert("Unkown error");
        }
    })

}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    fetch(`${BASE_URL}/ingredients`).then((res) => {
        res.json().then(a => {
            ingredients = a;
            refreshIngredientList();
        });
    });
}



/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient(ingredient) {
    // Implement delete ingredient logic here
    if(ingredient.trim() == ""){
        alert("Ingredient cannot be empty");
        return;
    }

    const ingredient_find = ingredients.filter(a => a.name === ingredient);
    const ingredient_id = ingredient_find[0].id;

    fetch(`${BASE_URL}/ingredients/${ingredient_id}`, {
        method: "DELETE",
        headers: {
                "Authorization": `Bearer ${bearerToken}`
        }
    }).then(async(res) => {
        if(res.status !== 204){
            alert( await res.text());
        }
        deleteIngredientNameInput.value = "";
        getIngredients();
    });
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    
    ingredientListContainer.innerHTML = "";
    console.log(ingredients);
    ingredients.forEach(ingredient => {
        const lineItem = document.createElement("li");
        lineItem.innerHTML = `<p>${ingredient.name}</p>`;
        ingredientListContainer.appendChild(lineItem);
    })
}
