import { ApplicationRef, enableProdMode } from '@angular/core';
import { enableDebugTools } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));

// In Devtools use command:
// ng.profiler.timeChangeDetection()
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((module) => enableDebugTools(module.injector.get(ApplicationRef).components[0]))
  .catch((err) => console.error(err));
