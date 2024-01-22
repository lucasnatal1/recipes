import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../models/recipe.model';
import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from '../models/ingredient.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private _baseUrl = 'https://natal-recipe-book-default-rtdb.firebaseio.com/';
  private _uid = 'uid-inserted-in-interceptor';

  constructor(
    private http: HttpClient,
    private shoppingListService: ShoppingListService,
  ) {}

  storeRecipe(recipe) {
    return this.http.post(environment.firebaseMainURL + '/users/'+ this._uid +'/recipes.json', recipe);
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(environment.firebaseMainURL + '/users/'+ this._uid +'/recipes.json').pipe(
      map((recipes) => {
        if (!recipes) {
          return [];
        }
        const recipesArray = [];
        Object.entries(recipes).forEach(entry => {
          entry[1].id = entry[0];
          recipesArray.push(entry[1]);
        })
        return recipesArray;
      })
    );
  }

  updateRecipe(id: string, recipe: Recipe) {
    return this.http.patch(environment.firebaseMainURL + '/users/'+ this._uid +'/recipes/'+ id +'.json', recipe);
  }

  deleteRecipe(id: string) {
    return this.http.delete(environment.firebaseMainURL + '/users/'+ this._uid +'/recipes/'+ id +'.json');
  }

  deleteAllRecipes() {
    return this.http.delete(environment.firebaseMainURL + '/users/'+ this._uid +'/recipes.json');
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
