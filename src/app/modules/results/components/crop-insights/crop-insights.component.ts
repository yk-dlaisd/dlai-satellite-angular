import { Component } from '@angular/core';

@Component({
  selector: 'app-crop-insights',
  templateUrl: './crop-insights.component.html',
  styleUrls: ['./crop-insights.component.scss']
})
export class CropInsightsComponent {
  // Mock data - will be replaced with real API data
  cropOccupancy = {
    yourCrop: 35,
    otherCrops: 65
  };

  landUsage = {
    farmLand: 70,
    emptyLand: 15,
    otherUse: 15
  };
}
