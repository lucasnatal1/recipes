import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeDetailComponent } from 'src/app/components/recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from 'src/app/components/recipes/recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from 'src/app/components/recipes/recipe-start/recipe-start.component';

import { RecipesComponent } from 'src/app/components/recipes/recipes.component';
import { ShoppingListComponent } from 'src/app/components/shopping-list/shopping-list.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', component: RecipesComponent, children: [
        { path: '', component: RecipeStartComponent },
        { path: 'new', component: RecipeEditComponent },
        { path: ':id', component: RecipeDetailComponent },
        { path: ':id/edit', component: RecipeEditComponent },
    ] },
    { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
