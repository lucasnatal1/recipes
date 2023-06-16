import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeDetailComponent } from 'src/app/components/recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from 'src/app/components/recipes/recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from 'src/app/components/recipes/recipe-start/recipe-start.component';
import { RecipesResolverService } from 'src/app/components/recipes/recipes-resolver.service';
import { RecipesComponent } from 'src/app/components/recipes/recipes.component';
import { AuthGuard } from 'src/app/components/auth/auth.guard';

const recipeRoutes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(recipeRoutes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
