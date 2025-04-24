import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  constructor(private themeService: ThemeService) {}
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}