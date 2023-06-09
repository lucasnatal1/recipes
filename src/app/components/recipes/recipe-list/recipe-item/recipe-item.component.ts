import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {
  //@Input() recipe: Recipe;
  recipe: Recipe;
  @Input() index: number;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipe = this.recipeService.getRecipe(this.index);
  }
}
