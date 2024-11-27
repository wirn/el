import { Component } from '@angular/core';
import { ElListComponent } from './el-list/el-list.component';

@Component({
  selector: 'app-root',
  imports: [ElListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'el';
}
