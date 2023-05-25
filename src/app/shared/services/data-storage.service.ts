import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from './recipe.service';
import { Recipe } from '../models/recipe.model';
import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from '../models/ingredient.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private _baseUrl = 'https://natal-recipe-book-default-rtdb.firebaseio.com/';
  private _uid = 'uid-inserted-in-interceptor';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private shoppingListService: ShoppingListService,
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put(this._baseUrl + '/users/'+ this._uid +'/recipes.json', recipes);
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this._baseUrl + '/users/'+ this._uid +'/recipes.json').pipe(
      map((recipes) => {
        if (!recipes) {
          return [];
        }
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }

  deleteRecipes() {
    return this.http.delete(this._baseUrl + '/users/'+ this._uid +'/recipes.json').pipe(
      tap(() => {
        this.recipeService.deleteAllRecipes();
      })
    );
  }

  storeShoppingList() {
    const ingredients = this.shoppingListService.getIngredients();
    return this.http.put(this._baseUrl + '/users/'+ this._uid +'/shopping-list.json', ingredients);
  }

  fetchShoppingList() {
    return this.http
      .get<Ingredient[]>(this._baseUrl + '/users/'+ this._uid +'/shopping-list.json')
      .pipe(
        tap((ingredients) => {
          this.shoppingListService.setIngredients(
            ingredients ? ingredients : []
          );
        })
      );
  }

  deleteShoppingList() {
    return this.http.delete(this._baseUrl + '/users/'+ this._uid +'/shopping-list.json').pipe(
      tap(() => {
        this.shoppingListService.deleteAllIngredients();
      })
    );
  }
}
