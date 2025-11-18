import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.scss']
})
export class HeroSectionComponent {
  searchQuery = '';

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Navigate to results page with query parameter
      this.router.navigate(['/results'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
    }
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
