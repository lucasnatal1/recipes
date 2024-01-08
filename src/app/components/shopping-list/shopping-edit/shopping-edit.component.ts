import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlaceholderDirective } from 'src/app/shared/directives/placeholder.directive';

import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { ShoppingListService } from 'src/app/shared/services/shopping-list.service';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) form: NgForm;
  subscription: Subscription;
  editMode = false;
  fetchingListFlag = false;
  savingListFlag = false;
  deletingListFlag = false;
  editedIngredientIndex: number;
  editedItem: Ingredient;
  displayAlert = false;
  @ViewChild(PlaceholderDirective, { static: true })
  cmpHost!: PlaceholderDirective;
  modalSubscription!: Subscription;
  alertSubscription!: Subscription;

  constructor(
    private shoppingListService: ShoppingListService,
    private storageService: DataStorageService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedIngredientIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.form.form.patchValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount, 'ToDo');
    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedIngredientIndex,
        newIngredient
      );
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedIngredientIndex);
    this.onClear();
  }

  onStoreList() {
    this.savingListFlag = true;
    this.storageService.storeShoppingList().subscribe(
      (res) => {
        this.showAlert(true, 'List was saved!');
        this.savingListFlag = false;
      },
      (error) => {
        this.showAlert(false, 'Error saving list!');
        this.savingListFlag = false;
      }
    );
  }

  onFetchList() {
    this.fetchingListFlag = true;
    this.storageService.fetchShoppingList().subscribe(
      (res) => {
        this.showAlert(true, 'List was loaded!');
        this.fetchingListFlag = false;
      },
      (error) => {
        this.showAlert(false, 'Error loading list!');
        this.fetchingListFlag = false;
      }
    );
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
    this.storageService.deleteShoppingList().subscribe(
      (res) => {
        this.showAlert(true, 'List was deleted!');
        this.deletingListFlag = false;
      },
      (error) => {
        this.showAlert(false, 'Error deleting list!');
        this.deletingListFlag = false;
      }
    );
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
