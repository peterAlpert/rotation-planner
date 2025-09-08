import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/Components/home/home.component';
import { YearlyReportComponent } from './app/Components/yearly-report/yearly-report.component';
import { provideHttpClient } from '@angular/common/http';

const routes = [
  { path: '', component: HomeComponent },   // الصفحة الرئيسية
  { path: 'report', component: YearlyReportComponent }, // صفحة التقرير
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    ...appConfig.providers,
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right', // 👈 فوق يمين
        preventDuplicates: true
      })
    )
  ]
});
