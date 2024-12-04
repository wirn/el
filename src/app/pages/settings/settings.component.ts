import { Component, OnInit } from '@angular/core';
import { Region } from '../../models/regions.enum';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [CookieService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  form: any = [];
  region: Region | null = null;

  options = [
    { value: Region.SE1, label: '1' },
    { value: Region.SE2, label: '2' },
    { value: Region.SE3, label: '3' },
    { value: Region.SE4, label: '4' },
  ];

  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.region = this.getRegion();
    const formValue = this.region ? this.region : Region.SE3;
    this.form = this.fb.group({
      dropdown: new FormControl<Region>(formValue, { nonNullable: true }),
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
