import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent implements OnInit {

  APIURL = 'http://localhost:8000/'

  users: any[] = [];
  roles: any[] = [];
  selectedUser: any = null;

  // Pagination variable
  displayedUsers: any[] = []; // Users to be displayed on the current page
  currentPage = 1; // Start on the first page
  usersPerPage = 5; // Number of users to show per page
  totalUsers: any[] = []; // Store the complete list of users
  totalPages: number = 0; // Total number of pages
  currentPageGroup: number[] = []; // The current group of 5 page numbers to display
  pageNumbers: number[] = []; // Array of page numbers for pagination

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchUsers();
    this.fetchRoles();
  }


  fetchUsers(): void {
    this.http.get<any[]>(this.APIURL + 'users')
      .subscribe({
        next: (userdata) => {
          this.users = userdata;
          this.totalUsers = [...userdata]; // Store the complete users list
          this.updatePagination();
          console.log(this.users);
        },
        error: (usererror) => {
          console.error('Error fetching data', usererror);
        },
        complete: () => {
          console.log('Data fetching complete');
        }
      });
  }

  fetchRoles(): void {
    this.http.get<any[]>(this.APIURL + 'roles')
      .subscribe({
        next: (roledata) => {
          this.roles = roledata;
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
    this.totalPages = Math.ceil(this.totalUsers.length / this.usersPerPage); // Total pages based on user count
    this.changePage(this.currentPage); // Show the first page of users
    this.updatePageGroup(); // Update the page group to display 5 page numbers
  }

  // Change page and update displayed users for that page
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Prevent invalid page numbers

    this.currentPage = page; // Update current page
    const startIndex = (this.currentPage - 1) * this.usersPerPage; // Calculate start index for the current page
    const endIndex = Math.min(startIndex + this.usersPerPage, this.totalUsers.length); // Calculate end index for the current page

    // Slice the users array to get the users for the current page
    this.displayedUsers = this.totalUsers.slice(startIndex, endIndex);
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


  //---------------------------------- User table filter ----------------------------------

  filterUsers(firstName: string, lastName: string, roleName: string): void {
    if (!roleName.trim() && !firstName.trim() && !lastName.trim()) {
      alert('Please input required to search');
      return;
    }
    let queryParams = [];
    if (firstName) queryParams.push(`first_name=${encodeURIComponent(firstName)}`);
    if (lastName) queryParams.push(`last_name=${encodeURIComponent(lastName)}`);
    if (roleName) queryParams.push(`role_name=${encodeURIComponent(roleName)}`);

    let url = `${this.APIURL}get-user/by_filter?${queryParams.join('&')}`;

    this.http.get<any[]>(url)
      .subscribe({
        next: (filteredUsers) => {
          this.users = filteredUsers;
          this.totalUsers = [...filteredUsers]; // Store the complete users list
          this.updatePagination();
          console.log('Filtered users:', this.users);
        },
        error: (error) => {
          console.error('Error fetching filtered users:', error);
          alert('No users found or an error occurred.');
          this.fetchRoles();
        },
        complete: () => {
          console.log('User filtering complete');
        }
      });
  }

  //---------------------------------- View User Popup ----------------------------------

  openUserView(user: any) {
    this.selectedUser = user;
    const modal = document.getElementById("view-user");
    if (modal) {
      modal.style.display = "block";
    }
  }

  //---------------------------------- Add User Popup ----------------------------------
  openAddUser(): void {
    this.selectedUser = {};
    const modal = document.getElementById('add-user');
    if (modal) {
      modal.style.display = "block";
    }
    // Reset the form data for a new user.
  }

  addUser(firstName: string, lastName: string, role_name: number): void {

    let queryParams = [];
    if (firstName) queryParams.push(`first_name=${encodeURIComponent(firstName)}`);
    if (lastName) queryParams.push(`last_name=${encodeURIComponent(lastName)}`);
    if (role_name) queryParams.push(`role_id_FK=${encodeURIComponent(role_name)}`);

    let url = `${this.APIURL}create-user?${queryParams.join('&')}`;

    this.http.post(url, null)
      .subscribe({
        next: (response) => {
          this.fetchUsers(); // Refresh the user list after adding a new user.
          console.log('User added successfully', response);
          this.closeUserPopup(); // Close the modal after addition.
        },
        error: (error) => {
          console.error('Error adding user', error);
        },
        complete: () => {
          console.log('User add complete');
        }
      });
  }

  //---------------------------------- Edit User Popup ----------------------------------

  openUserEdit(user: any): void {
    const modal = document.getElementById('edit-user');
    if (modal) {
      modal.style.display = "block";
    }
    this.selectedUser = { ...user };
  }

  updateUser(firstName: string, lastName: string, roleId: number): void {

    let queryParams = [];
    if (firstName) queryParams.push(`first_name=${encodeURIComponent(firstName)}`);
    if (lastName) queryParams.push(`last_name=${encodeURIComponent(lastName)}`);
    if (roleId) queryParams.push(`role_id_FK=${encodeURIComponent(roleId)}`);

    let url = `${this.APIURL}update-user/${this.selectedUser.user_id}?${queryParams.join('&')}`;

    this.http.put(url, null)
      .subscribe({
        next: () => {
          this.fetchUsers();
          this.selectedUser = null;
          console.log('User updated successfully');
          this.closeUserPopup();
        },
        error: (error) => {
          console.error('Error updating user', error);
        },
        complete: () => {
          console.log('User update complete');
        }
      });
  }

  //---------------------------------- Delete User Popup ----------------------------------
  openUserDelete(user: any) {
    this.selectedUser = user
    const modal = document.getElementById('delete-user');
    if (modal) {
      modal.style.display = "block";
    }
  }

  deleteUser(): void {
    if (!this.selectedUser?.user_id) {
      alert('User id are required');
      return;
    }
    this.http.delete(this.APIURL + 'delete-user/' + this.selectedUser?.user_id)
      .subscribe({
        next: () => {
          this.fetchUsers();
          console.log('User deleted successfully');
          this.closeUserPopup();
        },
        error: (error) => {
          console.error('Error deleting user', error);
        },
        complete: () => {
          console.log('User deletion complete');
        }
      });
  }

  //---------------------------------- User Popup Close ----------------------------------
  closeUserPopup() {
    this.selectedUser = null;
    const modal0 = document.getElementById("view-user");
    const modal1 = document.getElementById('edit-user');
    const modal2 = document.getElementById('delete-user');
    const modal3 = document.getElementById("add-user");
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
