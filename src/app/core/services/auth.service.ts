import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  provider: 'google' | 'facebook';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<User | null>(null);
  private _isAuthenticated = signal<boolean>(false);

  user = this._user.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    // Mock implementation - will be replaced with real social auth
    console.log('AuthService initialized - Social auth setup required');
  }

  signInWithGoogle(): void {
    console.log('Google sign-in - Setup required with @abacritt/angularx-social-login');
    // Mock implementation
    this._user.set({
      id: 'google-123',
      name: 'Test User',
      email: 'test@dlaisd.com',
      photoUrl: '',
      provider: 'google'
    });
    this._isAuthenticated.set(true);
  }

  signInWithFacebook(): void {
    console.log('Facebook sign-in - Setup required with @abacritt/angularx-social-login');
    // Mock implementation
    this._user.set({
      id: 'facebook-123',
      name: 'Test User',
      email: 'test@dlaisd.com',
      photoUrl: '',
      provider: 'facebook'
    });
    this._isAuthenticated.set(true);
  }

  signOut(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
  }
}
