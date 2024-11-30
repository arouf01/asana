// Function For Clearing The Form
function clearForm() {
    document.getElementById('taskName').value = '';
    //sectionDropdown.innerHTML = `<option value="">Select a Section</option>`;    
}


// Logout Function and Clear Local Storage
function logOut() {
  localStorage.clear();
  location.reload();
}