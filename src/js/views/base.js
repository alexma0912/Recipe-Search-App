//any style or elements that will be reused across different modules

export const elements = {
    searchForm: document.getElementsByClassName('search')[0],
    searchInput: document.getElementsByClassName('search__field')[0],
    searchResult: document.getElementsByClassName('results__list')[0],
    searchRecipe: document.getElementsByClassName('results')[0],
    searchRecipePages: document.getElementsByClassName('results__pages')[0],
}

export const renderLoader = parent => {   //add a spinner after class results and recipe
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = document.getElementsByClassName('loader')[0];
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}