import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { LanguageService } from './core/services/language.service';
import { AppSplashScreenService } from './core/services/splash-screen.service';

@Component({
  selector: 'app-root',
  template: `<ng-progress></ng-progress>
    <router-outlet></router-outlet> `,
})
export class AppComponent implements OnInit, OnDestroy {
  public constructor(
    private readonly _router: Router,
    private readonly _splashScreen: AppSplashScreenService,
    private readonly _iconRegistry: MatIconRegistry,
    private readonly _languageService: LanguageService
  ) {
    // Change material icons theme
    this._iconRegistry.setDefaultFontSetClass('material-icons-round');
  }

  private readonly _unsubscribeAll$ = new ReplaySubject<unknown>(1);

  public ngOnInit(): void {
    this._routerObserver();
  }

  // Watch router status
  private _routerObserver = (): void => {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        tap(() => {
          window.scrollTo(0, 0);
          this._splashScreen.hide();
        }),
        //Close subscription when component destroy
        takeUntil(this._unsubscribeAll$)
      )
      .subscribe();
  };

  public ngOnDestroy(): void {
    this._unsubscribeAll$.next(undefined);
    this._unsubscribeAll$.complete();
  }
}
