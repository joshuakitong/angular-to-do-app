import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Todo } from './app/todo/todo';

bootstrapApplication(Todo, appConfig)
  .catch((err) => console.error(err));
