import { Component, OnInit, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = signal(false);
  currentLanguage = this.languageService.currentLanguage;
  availableLanguages = this.languageService.availableLanguages;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.languageService.initializeLanguage();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  setLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.isMobileMenuOpen.set(false);
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}
