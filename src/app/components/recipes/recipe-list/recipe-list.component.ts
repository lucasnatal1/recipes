import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Recipe } from 'src/app/shared/models/recipe.model';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
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
  savingListFlag = false;
  deletingListFlag = false;
  displayAlert = false;
  @ViewChild(PlaceholderDirective, { static: true })
  cmpHost!: PlaceholderDirective;
  modalSubscription!: Subscription;
  alertSubscription!: Subscription;
  sortField: string;

  constructor(
    private recipeService: RecipeService,
    private storageService: DataStorageService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }

  onStoreList() {
    this.savingListFlag = true;
    this.storageService.storeRecipes().subscribe({
      next: () => {
        this.showAlert(true, 'List was saved!');
        this.savingListFlag = false;
      },
      error: () => {
        this.showAlert(false, 'Error saving list!');
        this.savingListFlag = false;
      }
    });
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
        console.log('response: ' + response);
        hostViewContainerRef.clear();
        if (response) {
          this.onConfirmDeletion();
        }
      });
  }

  private onConfirmDeletion() {
    this.deletingListFlag = true;
    this.storageService.deleteRecipes().subscribe({
      next: () => {
        this.showAlert(true, 'List was deleted!');
        this.deletingListFlag = false;
      },
      error: () => {
        this.showAlert(false, 'Error deleting list!');
        this.deletingListFlag = false;
      }
    });
  }

  showAlert(success: boolean, alertMessage: string) {
    this.displayAlert = true;
    const hostViewContainerRef = this.cmpHost.viewContainerRef;
    this.alertSubscription = this.utilService
      .showAlert(success, alertMessage, hostViewContainerRef)
      .subscribe(() => {
        hostViewContainerRef.clear();
        this.displayAlert = false;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }
}
