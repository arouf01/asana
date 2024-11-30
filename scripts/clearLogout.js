// Function For Clearing The Form
function clearForm() {
    document.getElementById('taskName').value = '';  
}


// Logout Function and Clear Local Storage
function logOut() {
  localStorage.clear();
  location.reload();
}