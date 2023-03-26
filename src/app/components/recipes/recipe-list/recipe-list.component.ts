import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is just a Test',
      'https://thebrilliantkitchen.com/wp-content/uploads/2023/02/Crockpot-Keto-Meatloaf-1.jpeg.webp'
    ),
    new Recipe(
      'Another Test Recipe',
      'This is just another Test',
      'https://thebrilliantkitchen.com/wp-content/uploads/2023/02/Crockpot-Keto-Meatloaf-1.jpeg.webp'
    ),
  ];
  @Output() recipeSelected = new EventEmitter<Recipe>();

  constructor() {}

  ngOnInit(): void {}

  detailRecipe(index: number) {
    this.recipeSelected.emit(this.recipes[index]);
  }
}
