import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loadedFeature = 'recipes';

  onFeatureSelected(feature: string) {
    this.loadedFeature = feature; 
  }
}
