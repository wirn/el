import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElListComponent } from './el-list/el-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ElListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'el';
}
