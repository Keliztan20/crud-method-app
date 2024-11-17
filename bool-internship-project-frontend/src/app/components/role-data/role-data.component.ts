import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-role-data',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './role-data.component.html',
  styleUrl: './role-data.component.css'
})
export class RoleDataComponent {

  roles: any[] = [];
  selectedRole: any = null;

  // pagination variable
  displayedRoles: any[] = []; // Roles to be displayed on the current page
  currentPage = 1;
  rolesPerPage = 5;
  totalRoles: any[] = []; // To store the total list of roles
  totalPages: number = 0;
  currentPageGroup: number[] = []; // The current group of 5 page numbers to display
  pageNumbers: number[] = [];

  constructor(private http: HttpClient) { }

  APIURL = 'http://localhost:8000/'

  ngOnInit() {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.http.get<any[]>(this.APIURL + 'roles')
      .subscribe({
        next: (roledata) => {
          this.roles = roledata;
          this.totalRoles = [...roledata];
          this.updatePagination();
          console.log(this.roles);
        },
        error: (roleerror) => {
          console.error('Error fetching data', roleerror);
        },
        complete: () => {
          console.log('Data fetching complete');
        }
      });
  }
  
  // Update pagination (calculate total pages, etc.)
  updatePagination(): void {
    this.totalPages = Math.ceil(this.totalRoles.length / this.rolesPerPage); // Total pages based on role count
    this.changePage(this.currentPage); // Show the first page of roles
    this.updatePageGroup(); // Update the page group to display 5 page numbers
  }

  // Change page and update displayed roles for that page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Prevent invalid page numbers

    this.currentPage = page; // Update current page
    const startIndex = (this.currentPage - 1) * this.rolesPerPage; // Calculate start index for the current page
    const endIndex = Math.min(startIndex + this.rolesPerPage, this.totalRoles.length); // Calculate end index for the current page

    // Slice the roles array to get the roles for the current page
    this.displayedRoles = this.totalRoles.slice(startIndex, endIndex);
    this.updatePageGroup();
  }

  // Update the range of page numbers shown (display 5 pages at a time)
  updatePageGroup(): void {
    const startPage = Math.floor((this.currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, this.totalPages); // Show up to 5 pages

    this.currentPageGroup = [];
    for (let i = startPage; i <= endPage; i++) {
      this.currentPageGroup.push(i);
    }
  }

  // Go to the next group of pages
  nextGroup(): void {
    if (this.currentPage + 5 <= this.totalPages) {
      this.changePage(this.currentPage + 5); // Set to the first page of the next group
    }
  }

  // Go to the previous group of pages
  previousGroup(): void {
    if (this.currentPage - 5 > 0) {
      this.changePage(this.currentPage - 5); // Set to the first page of the previous group
    }
  }

  //---------------------------------- View User Popup ----------------------------------

  openRoleView(role: any) {
    this.selectedRole = role;
    const modal = document.getElementById("view-role");
    if (modal) {
      modal.style.display = "block";
    }
  }

  //---------------------------------- User role name based filter ----------------------------------

  filterRoles(roleName: string): void {
    if (!roleName.trim()) {
      alert('Please enter a role name to search');
      return;
    }

    this.http.get<any[]>(this.APIURL + `get-roles/${roleName}`)
      .subscribe({
        next: (filteredRoles) => {
          this.roles = filteredRoles;
          this.totalRoles = [...filteredRoles];
          this.updatePagination();
          console.log('Filtered roles:', this.roles);
        },
        error: (error) => {
          console.error('Error fetching filtered roles:', error);
          alert('No roles found or an error occurred.');
          this.fetchRoles();
        },
        complete: () => {
          console.log('Role filtering complete');
        }
      });
  }

  //---------------------------------- Add User Popup ----------------------------------
  openAddRole(): void {
    this.selectedRole = { role_name: ' ' };
    const modal = document.getElementById('add-role');
    if (modal) {
      modal.style.display = "block";
    }
  }

  addRole(roleName: string): void {
    if (!roleName.trim()) {
      alert('Role name is required');
      return;
    }
    this.http.post(`${this.APIURL}create-role?role_name=${encodeURIComponent(roleName)}`, null)
      .subscribe({
        next: (response) => {
          this.fetchRoles();
          console.log('Role added successfully', response);
          this.closeRolePopup();
        },
        error: (error) => {
          console.error('Error adding role', error);
        },
        complete: () => {
          console.log('Role addition complete');
        }
      });
  }

  //---------------------------------- Edit User Popup ----------------------------------
  openRoleEdit(role: any): void {
    const modal = document.getElementById('edit-role');
    if (modal) {
      modal.style.display = "block";
    }
    this.selectedRole = { ...role };
  }

  updateRole(roleName: string): void {
    if (!roleName.trim()) {
      alert('Role name is required');
      return;
    }

    this.http.put(`${this.APIURL}update-role/${this.selectedRole.role_id}?role_name=${encodeURIComponent(roleName)}`, null)
      .subscribe({
        next: (response) => {
          this.fetchRoles();
          this.selectedRole = null;
          console.log('Role updated successfully', response);
          this.closeRolePopup();
        },
        error: (error) => {
          console.error('Error updating role', error);
        },
        complete: () => {
          console.log('Role update complete');
        }
      });
  }

  //---------------------------------- Delete User Popup ----------------------------------
  openRoleDelete(role: any) {
    this.selectedRole = role
    const modal = document.getElementById('delete-role');
    if (modal) {
      modal.style.display = "block";
    }
  }

  deleteRole(): void {
    if (!this.selectedRole?.role_id) {
      alert('Role id is required');
      return;
    }
    this.http.delete(this.APIURL + 'delete-role/' + this.selectedRole?.role_id)
      .subscribe({
        next: () => {
          this.fetchRoles();
          console.log('Role deleted successfully');
          this.closeRolePopup();
        },
        error: (error) => {
          console.error('Error deleting role', error);
        },
        complete: () => {
          console.log('Role deletion complete');
        }
      });
  }

  //---------------------------------- User Popup Close ----------------------------------
  closeRolePopup() {
    const modal0 = document.getElementById("view-role");
    const modal1 = document.getElementById('edit-role');
    const modal2 = document.getElementById('delete-role');
    const modal3 = document.getElementById('add-role');
    if (modal0) {
      modal0.style.display = "none";
    }
    if (modal1) {
      modal1.style.display = "none";
    }
    if (modal2) {
      modal2.style.display = "none";
    }
    if (modal3) {
      modal3.style.display = "none";
    }
  }

}
