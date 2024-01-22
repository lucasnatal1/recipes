import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit, OnDestroy {
  recipesState: 'none' | 'creatingFirst' | 'some' = 'none';
  userInRecipeList: boolean = true;
  subscriptionStore: Subscription;
  subscriptionRecipes: Subscription;
  loading: boolean;

  constructor(
    private storageService: DataStorageService,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        this.userInRecipeList = this.router.url.toString().split('/').length <= 2;
        if (this.recipesState == "creatingFirst" && !this.router.url.toString().match("new")) {
          this.recipesState = "none";
        }
      }
    });
    this.subscriptionRecipes = this.recipeService.recipesChanged.subscribe(
      (recipes) => {
        this.loading = false;
        this.recipesState = recipes.length > 0 ? 'some' : 'none';
      }
    );

    this.subscriptionStore = this.storageService
      .fetchRecipes()
      .subscribe((recipes) => {
        this.recipeService.setRecipes(recipes);
        this.loading = false;
        this.recipesState = recipes.length > 0 ? 'some' : 'none';
      });
  }

  newRecipe() {
    this.recipesState = 'creatingFirst';
    // this.router.navigate(['/new'], {relativeTo: this.route});
    this.router.navigate(['/recipes/new']);
  }

  ngOnDestroy(): void {
    this.subscriptionStore.unsubscribe();
    this.subscriptionRecipes.unsubscribe();
  }
}
