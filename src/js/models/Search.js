//Search module - Model
/*
API provider: Food2Fork.com
API key: 79a00b2800fb30e8a3f05fc1eec11e78 
Search requests: https://www.food2fork.com/api/search 
*/

import { key } from '../config.js';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async searchRecipe() {
        try {
            //const key = '79a00b2800fb30e8a3f05fc1eec11e78';   //move to config.js for reuse
            const result = await fetch(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
            const data = await result.json();
            this.recipes = data.recipes;
        } catch (error) {
            console.log(error);
        }
    /*
    If this application will be executed on old browsers, use axios to replace fetch,
    demon code as following:
    ------------------------------------------------------------------------------
    import axios from 'axios';
    async function searchRecipe(query) {
        const key = '79a00b2800fb30e8a3f05fc1eec11e78';
        try {
            const result = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
            const data = result.data;
            this.recipes = data.recipes;
            console.log(this.recipes);
        } catch (error) {
            console.log(error);
        }
    }
    searchRecipe('beef');
    */ 
    }
}
