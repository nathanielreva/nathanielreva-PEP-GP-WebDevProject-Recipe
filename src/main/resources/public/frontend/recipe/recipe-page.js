/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLink = document.getElementById('admin-link');
    const logoutButton = document.getElementById('logout-button');
    const recipeSearchInput = document.getElementById('search-input');
    const recipeSearchButton = document.getElementById('search-button');
    const recipeList = document.getElementById('recipe-list');
    const addRecipeNameInput = document.getElementById('add-recipe-name-input');
    const addRecipeInstructionsInput = document.getElementById('add-recipe-instructions-input');
    const addRecipeSubmitInput = document.getElementById('add-recipe-submit-input');
    const updateRecipeNameInput = document.getElementById('update-recipe-name-input');
    const updateRecipeInstructionsInput = document.getElementById('update-recipe-instructions-input');
    const updateRecipeSubmitInput = document.getElementById('update-recipe-submit-input');
    const deleteRecipeNameInput = document.getElementById('delete-recipe-name-input');
    const deleteRecipeNameSubmitInput = document.getElementById('delete-recipe-submit-input');
    

    //sessions
    let bearerToken = sessionStorage.getItem("auth-token") || "";
    let isAdmin = sessionStorage.getItem('isAdmin');

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */

    if(bearerToken !== ""){
        logoutButton.style.visibility = "visible";
        document.getElementById('logout-button').addEventListener('click', () => {
            logout(bearerToken);
        });
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if(isAdmin){
        adminLink.style.visibility = "visible";
    }
    
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */

    addRecipeSubmitInput.addEventListener('click', () => {

        addRecipe(addRecipeNameInput.value, addRecipeInstructionsInput.value);
    })
    updateRecipeSubmitInput.addEventListener('click', () => {
        updateRecipe(updateRecipeNameInput.value, updateRecipeInstructionsInput.value)
    });

    deleteRecipeNameSubmitInput.addEventListener('click', () => {
        deleteRecipe(deleteRecipeNameInput.value);
    });
    recipeSearchButton.addEventListener('click', searchRecipes);
    logoutButton.addEventListener('click', processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */

    (function(){
        getRecipes();
    })();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        try{
            const recipeSearch = recipeSearchInput.value;
            await fetch(`${BASE_URL}/recipes?name=${recipeSearch}`).then(async(res) => {
                
                if(res.status !== 200){
                    const errorText = await res.text();
                    throw new Error(errorText);
                }

                res.json().then(a => {
                    recipes = a;
                    refreshRecipeList();
                });
            });
        }catch(error){
            alert(error);
        }
    }


    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe(name, instructions) {
        
        const recipe = {
            name,
            instructions
        }

        await fetch(`${BASE_URL}/recipes`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${bearerToken}`,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(recipe)
        }).then(res => {
            if(res.status  == 201){
                addRecipeNameInput.value = "";
                addRecipeInstructionsInput.value ="";
                getRecipes();
            }
        })
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe(name, instructions) {
        // Implement update logic here
        
        const recipe_find = recipes.filter(a => a.name === name);
        const recipe_id = recipe_find[0].id;
        const recipe = {
            instructions
        }
        fetch(`${BASE_URL}/recipes/${recipe_id}`, {
            method: "PUT",
            headers: {
                 "Authorization": `Bearer ${bearerToken}`
            },
            body: JSON.stringify(recipe)
        }).then(res => {
            if(res.status == 200){
                updateRecipeNameInput.value = "";
                updateRecipeInstructionsInput.value = "";
                getRecipes();
            }
        });
    }


    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe(name) {

        const recipe_find = recipes.filter(a => a.name === name);
        const recipe_id = recipe_find[0].id;

        fetch(`${BASE_URL}/recipes/${recipe_id}`, {
            method: "DELETE",
            headers: {
                 "Authorization": `Bearer ${bearerToken}`
            }
        }).then(async(res) => {
            if(res.status == 200){
                deleteRecipeNameInput.value = "";
                getRecipes();
            }
        });
    }



    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        fetch(`${BASE_URL}/recipes`).then((res) => {
            if(res.status == 404){
                recipeList.innerHTML = "No Recipes Found, Consider adding one."
                return;
            }
            res.json().then(a => {
                recipes = a;
                refreshRecipeList();
            });
        });
        
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        recipeList.innerHTML = "";
        recipes.forEach(recipe => {
            const lineItem = document.createElement("li");
            lineItem.textContent = `${recipe.name} - ${recipe.instructions}`;
            recipeList.appendChild(lineItem);
        })
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
    }

    async function logout(bearer) {

    
        fetch(`${BASE_URL}/logout`, {
            method: "POST",
            headers: {
                 "Authorization": `Bearer ${bearer}`
            }
        }).then((res) => {
            if(res.status == 200){
                window.location.href = '/login/login-page.html';
            }
        });
    }
});
