import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient) {
    const index = this.searchForIngredientIndex(ingredient);
    if (index >= 0) {
      this.ingredients[index].amount += ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    for (let ingredient of ingredients) {
      const index = this.searchForIngredientIndex(ingredient);
      if (index >= 0) {
        this.ingredients[index].amount += ingredient.amount;
      } else {
        this.ingredients.push(ingredient);
      }
    }
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  private searchForIngredientIndex(ingredient: Ingredient): number {
    let ingredientIndex = this.ingredients.findIndex((i) => {
      return i.name === ingredient.name;
    });
    return ingredientIndex;
  }
}
