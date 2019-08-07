//View
import {elements} from './base.js';

export const getInput = () => elements.searchInput.value;  //get user input of Search bar

export const renderRecipe = recipe => {  //render recipe on UI
    const markup = `
        <li>
            <a class="likes__link" href="#${recipe.recipe_id}">
                <figure class="likes__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="likes__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResult.insertAdjacentHTML('beforeend', markup);
}

//refactor duplicate code into one method
const createButton = (page, type) => ` 
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);  //round up
    let button;
    if(page === 1 && pages > 1) {
        //Button to go to next page
        button = createButton(page, 'next');
    } else if(page < pages) {
        //Buttons to go the previous page and next page
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if(page === pages && pages > 1) {
        //Buttons to go the previous page
        button = createButton(page, 'prev');
    }
    elements.searchRecipePages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page=1, resPerPage=10) => {  
    const start = (page-1) * resPerPage;  
    const end = page * resPerPage; 
    recipes.slice(start, end).forEach(renderRecipe);    //pass all search results to render on UI one by one, 10 recipes per page
    renderButtons(page, recipes.length, resPerPage);
}

const limitRecipeTitle = (title, limit = 17) => {  //set a limitation to the title length, any title exceeds the length will be displayed as xxxx...
    const newTitle = [];
    if(title.length > limit) {
        //(1) split the title by its space, then call a callback function to limit the title length
        title.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) { 
                newTitle.push(current);
            };
            return accumulator + current.length;
        }, 0);  
        //(2) return the result
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

export const clearInput = () => {  //clear input in the search bar
    elements.searchInput.value = '';
}

export const clearResults = () => {  //clear previous search results and buttons
    elements.searchResult.innerHTML = '';
    elements.searchRecipePages.innerHTML = '';
}
