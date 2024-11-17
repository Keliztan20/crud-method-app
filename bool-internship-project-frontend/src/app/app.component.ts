import { Component } from '@angular/core';
import { UserDataComponent } from './components/user-data/user-data.component';
import { RoleDataComponent } from './components/role-data/role-data.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserDataComponent, RoleDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'User Management';
}
