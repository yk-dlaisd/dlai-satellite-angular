import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ResultsComponent } from './components/results/results.component';
import { CropInsightsComponent } from './components/crop-insights/crop-insights.component';
import { ServiceProvidersComponent } from './components/service-providers/service-providers.component';

@NgModule({
  declarations: [
    ResultsComponent,
    CropInsightsComponent,
    ServiceProvidersComponent
  ],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    SharedModule
  ]
})
export class ResultsModule { }
