import { Component, signal } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {
  isDropdownOpen = signal(false);
  currentLanguage = this.languageService.currentLanguage;
  availableLanguages = this.languageService.availableLanguages;

  constructor(private languageService: LanguageService) {}

  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  setLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
    this.isDropdownOpen.set(false);
  }

  getCurrentLanguageName(): string {
    const lang = this.availableLanguages.find(l => l.code === this.currentLanguage());
    return lang ? `${lang.flag} ${lang.name}` : '🌐 English';
  }
}
