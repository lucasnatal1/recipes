import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeDetailComponent } from 'src/app/components/recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from 'src/app/components/recipes/recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from 'src/app/components/recipes/recipe-start/recipe-start.component';
import { RecipesResolverService } from 'src/app/components/recipes/recipes-resolver.service';
import { RecipesComponent } from 'src/app/components/recipes/recipes.component';
import { ShoppingListComponent } from 'src/app/components/shopping-list/shopping-list.component';
import { AuthComponent } from 'src/app/components/auth/auth.component';
import { AuthGuard } from 'src/app/components/auth/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes',
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
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
