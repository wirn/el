import { Component, OnInit } from '@angular/core';
import { Region } from '../../models/regions.enum';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule
],
  providers: [CookieService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  form: any = [];
  region: Region | null = null;

  options: string[] = [Region.SE1, Region.SE2, Region.SE3, Region.SE4];

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.region = this.getRegion();

    this.form = this.fb.group({
      dropdown: new FormControl<Region | null>(this.region ?? null),
    });

    this.form.controls.dropdown.valueChanges.subscribe((reg: Region) => {
      this.cookieService.set('region', reg, { expires: 365, path: '/' });
      this.router.navigate(['/']);
    });
  }

  private getRegion(): Region | null {
    return this.cookieService.get('region')
      ? (this.cookieService.get('region') as Region)
      : null;
  }
}
