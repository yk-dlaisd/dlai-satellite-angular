import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _currentLanguage = signal<string>('en');
  private _availableLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
  ];

  currentLanguage = this._currentLanguage.asReadonly();
  availableLanguages = this._availableLanguages;

  constructor(private translate: TranslateService) {}

  setLanguage(langCode: string): void {
    if (this._availableLanguages.some(lang => lang.code === langCode)) {
      this._currentLanguage.set(langCode);
      this.translate.use(langCode);
      localStorage.setItem('preferredLanguage', langCode);
    }
  }

  initializeLanguage(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = savedLang || (browserLang && this._availableLanguages.some(lang => lang.code === browserLang) ? browserLang : 'en');
    
    this.setLanguage(defaultLang);
  }
}
