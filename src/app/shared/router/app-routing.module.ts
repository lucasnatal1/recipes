import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: () => import('../../components/recipes/recipes.module').then(m => m.RecipesModule) }, //lazy loading
  { path: 'shopping-list', loadChildren: () => import('../../components/shopping-list/shopping-list.module').then(m => m.ShoppingListModule) }, //lazy loading
  { path: 'auth', loadChildren: () => import('../../components/auth/auth.module').then(m => m.AuthModule) }, //lazy loading
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules})], //preloadingStrategy: PreloadAllModules - preloads all lazy loaded modules after the app has been loaded
  exports: [RouterModule],
})
export class AppRoutingModule {}
