import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../models/ingredient.model';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

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
    this.ingredientsChanged.next(this.ingredients.slice());
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
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  private searchForIngredientIndex(ingredient: Ingredient): number {
    let ingredientIndex = this.ingredients.findIndex((i) => {
      return i.name === ingredient.name;
    });
    return ingredientIndex;
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    const existingIngredientIndex = this.searchForIngredientIndex(newIngredient);
    if (existingIngredientIndex >= 0 && existingIngredientIndex !== index) {
      this.ingredients[existingIngredientIndex].amount += newIngredient.amount;
      this.ingredients.splice(index, 1);
    } else {
      this.ingredients[index] = newIngredient;
    }
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
