import { Component } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-dashboard',
  imports: [StatsComponent, UsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

}
