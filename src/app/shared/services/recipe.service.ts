import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { ShoppingListService } from './shopping-list.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[];

  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient
  ) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(): Recipe[] {
    return this.recipes?.slice(); //sending a copy, not the reference
  }

  addIngredientsToTheShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipe(index: number): Recipe {
    // return this.recipes.find(
    //   (recipe) => { recipe.id === id }
    // );
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteAllRecipes() {
    this.recipes = [];
    this.recipesChanged.next(this.recipes.slice());
  }

  getDefaultImage() {
    return this.http.get('../../../assets/images/default-img-recipe.png', {
      responseType: 'blob',
    });
  }
}
