import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Pipe({
  name: 'sort',
  //pure: false,
})
export class SortPipe implements PipeTransform {
  transform(
    items: Recipe[],
    field: string,
  ): Recipe[] {
    if (!items) {
      return [];
    }

    if (!field || field.length === 0) {
      return items;
    }

    if (field === 'name') {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (field === 'dtCreated') {
      return items.sort((a, b) => {
        return new Date(a.dtCreated) < new Date(b.dtCreated)
          ? 1
          : new Date(a.dtCreated) > new Date(b.dtCreated)
          ? -1
          : 0;
      });
    } else {
        return items.sort((a, b)=> b.rating - a.rating);
    }
  }
}
