import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { ShoppingListService } from './shopping-list.service';
import { HttpClient } from '@angular/common/http';
import { DataStorageService } from './data-storage.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[];

  constructor(
    private shoppingListService: ShoppingListService,
    private http: HttpClient,
    private dataService: DataStorageService
  ) {}

  setRecipes(recipes: Recipe[]) {
    console.log("recipes serv", recipes);
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  private getIndex(id: string) {
    for (let i=0; i<this.recipes.length; i++) {
      if (this.recipes[i].id === id) {
        return i;
      }
    }
  }

  getRecipes(): Recipe[] {
    return this.recipes?.slice(); //sending a copy, not the reference
  }

  addIngredientsToTheShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipe(id: string): Recipe {
    let recipe: Recipe;
    this.recipes.forEach(item => {
      if (item.id === id) {
        recipe = item
      }
    });
    return recipe;
  }

  addRecipe(recipe: Recipe) {
    this.dataService.storeRecipe(recipe).subscribe({
      next: (data: {name: string}) => {
        recipe.id = data.name
        this.recipes.push(recipe);
      },
      error: e => console.log("addRecipe Error:", e),
      complete: () => {
        this.recipesChanged.next(this.recipes.slice());
      }
    });
  }

  updateRecipe(id: string, newRecipe: Recipe) {
    newRecipe.id = id;
    let i = this.getIndex(id);
    this.recipes[i] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(id: string) {
    this.dataService.deleteRecipe(id).subscribe({
      next: () => {
        this.recipes.splice(this.getIndex(id), 1);
      },
      error: e => console.log("deleteRecipe Error:", e),
      complete: () => {
        this.recipesChanged.next(this.recipes.slice());
      }
    });
  }

  deleteAllRecipes() {
    this.dataService.deleteAllRecipes().subscribe({
      next: () => {
        this.recipes = [];
      },
      error: e => console.log("deleteAllRecipes Error:", e),
      complete: () => {
        this.recipesChanged.next(this.recipes.slice());
      }
    });
  }

  getDefaultImage() {
    return this.http.get('../../../assets/images/default-img-recipe.png', {
      responseType: 'blob',
    });
  }
}
