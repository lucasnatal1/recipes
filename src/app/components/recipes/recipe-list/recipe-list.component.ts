import { Component, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { Subscription } from 'rxjs';

import { Recipe } from 'src/app/shared/models/recipe.model';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;
  filterString = '';
  @ViewChild(PlaceholderDirective, { static: true })
  cmpHost!: PlaceholderDirective;
  modalSubscription!: Subscription;
  sortField: string;

  constructor(
    private recipeService: RecipeService,
    private utilService: UtilService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  onDeleteList() {
    const hostViewContainerRef = this.cmpHost.viewContainerRef;

    this.modalSubscription = this.utilService
      .showConfirm(
        'DELETE LIST',
        'Are you sure you want to delete the list?',
        hostViewContainerRef
      )
      .subscribe((response: boolean) => {
        this.modalSubscription.unsubscribe();
        hostViewContainerRef.clear();
        if (response) {
          this.onConfirmDeletion();
        }
      });
  }

  private onConfirmDeletion() {
    this.recipeService.deleteAllRecipes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }
}
