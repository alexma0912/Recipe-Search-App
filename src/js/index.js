//Controller
import Search from './models/Search.js';
import Recipe from './models/Recipe.js';
import * as searchView from './views/searchView.js';  
import {elements, renderLoader, clearLoader} from './views/base.js';

/** 
Global state of the app
 - search object 
 - current recipe object
 - shopping list object
 - liked recipes 
*/
const state = {}; 

/**
 * Search Controller
 */
const controlSearch = async () => {
    //(1) get query from view
    const query = searchView.getInput();
    if (query) {
        //(2) create a new search object and add to state
        state.search = new Search(query);  //now there is a search property in the state object
        //(3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRecipe);
        try {
            //(4) Search for recipes
            await state.search.searchRecipe();  //return a promise object

            //(5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.recipes);
        } catch (error) {
            console.log(error);
            clearLoader();
        }
    }

}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();  //page won't reload when click on Search button
    controlSearch();
});

elements.searchRecipePages.addEventListener('click', element => {
    const btn = element.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);  
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
})

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
    //get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //prepare UI for changes

        //create a new recipe object
        state.recipe = new Recipe(id);

        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate servings and cook time
            state.recipe.calCookTime();
            state.recipe.calServings();
            //render recipe
            console.log(state.recipe);
        } catch (error) {
            console.log(error);
        }
    }
}; 
//Global event listener - hashchange on different recipe id
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



