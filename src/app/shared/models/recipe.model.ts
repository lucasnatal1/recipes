import { Ingredient } from "./ingredient.model";

export class Recipe {

    public name: string;
    public rating: number;
    public description: string;
    public imagePath: string;
    public ingredients: Ingredient[];
    public dtCreated: Date;

    constructor(name: string, rating: number, desc: string, imagePath: string, ingredients: Ingredient[]) {
        this.name = name;
        this.rating = rating;
        this.description = desc;
        this.imagePath = imagePath;
        this.ingredients = ingredients;
        this.dtCreated = new Date();
    }
}