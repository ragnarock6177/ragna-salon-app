import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-main',
  imports: [RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {

  ngAfterViewInit(): void {
    console.log('MainComponent ngAfterViewInit');
  }
}
