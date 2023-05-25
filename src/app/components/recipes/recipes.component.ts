import { Component, OnInit } from '@angular/core';

import { DataStorageService } from 'src/app/shared/services/data-storage.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  constructor(private storageService: DataStorageService) {}

  ngOnInit(): void {
    this.storageService.fetchRecipes().subscribe();
  }
}
