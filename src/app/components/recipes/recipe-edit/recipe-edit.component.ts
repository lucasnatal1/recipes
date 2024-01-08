import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  imageSrc: string | ArrayBuffer;
  rating: number;
  innerWidth: number;
  breakIngredientLine: boolean;
  ingredientsUnit = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });

    if (!this.editMode) {
      this.recipeService.getDefaultImage().subscribe(img => {
        this.readFile(img);
      });
    }

    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 500 || (this.innerWidth >= 768 && this.innerWidth < 1000)) {
      this.breakIngredientLine = true;
    } else {
      this.breakIngredientLine = false;
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 500 || (this.innerWidth >= 768 && this.innerWidth < 1000)) {
      this.breakIngredientLine = true;
    } else {
      this.breakIngredientLine = false;
    }
  }

  validateFile(event) {
    if (!(event.target.files && event.target.files[0])) {
      this.imageSrc = null;
      return;
    }
    const file = event.target.files[0];
    const fileType = file?.name.split('.').slice(-1);
    if (fileType != "jpg" && fileType != "jpeg" && fileType != "png") {
      this.imageSrc = null;
      return;
    }
    this.readFile(file);
  }

  readFile(file: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      this.imageSrc = reader.result;

      this.recipeForm.patchValue({
        imagePath: reader.result
      });
    };
  }

  dropdownChange(r: number) {
    this.rating = r;
    this.recipeForm.patchValue({
      rating: this.rating
    });
  }

  dropdownIngredientChange(index: number, unit: string) {
    this.ingredientsUnit[index] = unit;
    (<FormArray>this.recipeForm.get('ingredients')).at(index).patchValue({
      unit: this.ingredientsUnit[index]
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeRating = 0;
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeRating = recipe.rating;
      this.rating = recipe.rating;
      recipeImagePath = recipe.imagePath;
      this.imageSrc = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          this.ingredientsUnit.push(ingredient.unit);
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
              unit: new FormControl(ingredient.unit, Validators.required),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      rating: new FormControl(recipeRating, Validators.required),
      imagePath: new FormControl(recipeImagePath),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onAddIngredient() {
    this.ingredientsUnit.push(null);
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^(0|[1-9]\d*)((\.|\/|\,)\d+)?$/),
        ]),
        unit: new FormControl(null, Validators.required),
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    this.ingredientsUnit.splice(index, 1);
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
