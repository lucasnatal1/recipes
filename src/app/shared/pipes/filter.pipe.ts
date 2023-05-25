import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Pipe({
  name: 'filter',
  // pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(items: Recipe[], filterString: string): Recipe[] {
    if (!items) {
      return [];
    }
    if (filterString.length === 0) {
      return items;
    }

    let result = [];
    result = items.filter((item) => {
      return item.name
        .toLocaleLowerCase()
        .includes(filterString.toLocaleLowerCase());
    });
    for (const item of items) {
      for (const ingredient of item.ingredients) {
        if (
          ingredient.name
            .toLocaleLowerCase()
            .includes(filterString.toLocaleLowerCase())
        ) {
          result.push(item);
        }
      }
    }
    return result;
  }
}
