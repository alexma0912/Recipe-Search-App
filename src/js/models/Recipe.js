import { key } from '../config.js';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await fetch(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            const data = await result.json();
            const recipe = data.recipe;
            this.title = recipe.title;
            this.author = recipe.publisher;
            this.img = recipe.image_url;
            this.url = recipe.source_url;
            this.ingredients = recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
    }

    calCookTime() {   //assume for every 3 ingredients, need 15 minutes
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calServings() {
        this.servings = 4;
    }

    parseIngredients() {
        //watch the order, ounces must be placed before ounce
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb'];
        const units = [...unitShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            //(1) Uniform units
            let ingredient = el.toLowerCase();
            unitLong.forEach( (unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);  //replace first matched string/character to another string/character in the long string
            } );

            //(2) Remove parentness - anything matches the format: (arbitrary number of other characters) will be removed
            //some recipes may have ingredient like: 1 teaspoon (.11 ounce) instant yeast. For better recipe detail format, remove the text in parentness with its parentness and leave it with one extra space
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //(3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1) {  
                //There is a unit
                // ex. 4 1/2 cups, arrCount is [4, 1/2]
                // ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);  

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));  //if the unit is integer, ex. 4 cups, arrCount is [4]
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));  //if the unit is not an integer, ex. 4 1/2 cups, arrCount is [4, 1/2] --> "4+1/2" --> eval("4+1/2") --> 4.5
                }

                objIng = {
                    count, 
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if(parseInt(arrIng[0], 10)) {
                //There is no such unit, but 1st element is number  ex. 1 bread
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                //There is no such unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
}