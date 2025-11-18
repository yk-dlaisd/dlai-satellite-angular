import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Leaflet Map
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Shared Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LanguageSwitcherComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    // Leaflet
    LeafletModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    LanguageSwitcherComponent,
    MapComponent,
    // Re-export modules
    CommonModule,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    LeafletModule
  ]
})
export class SharedModule { }
