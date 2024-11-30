let APIKey;

// Checkiing If API Key In Local Storage
window.onload = () => {
      APIKey = localStorage.getItem('asana-api-key');
  
      if (APIKey !== null) {
          if (!document.getElementById("section2").classList.contains("active")) {
                nextSection();
                nextBtn();
          }
      }
  };


// Function For Next Section
function nextSection() {
      document.getElementById("section1").classList.remove("active");
      document.getElementById("section2").classList.add("active");
}
  

// Next Button Function For - Getting Projects 
async function nextBtn() {
      APIKey = document.getElementById('apiKey').value || localStorage.getItem('asana-api-key');

      // Get Projects URL
      let getProjectsUrl = 'https://app.asana.com/api/1.0/projects';

      // Calling Fetch Function For Projects
      let response = await fetchFunction(APIKey, getProjectsUrl);

      let connectedBtn = document.getElementById('connected');

      // Checking If Response is OK!
      if (response.ok) {

            // Saving API Key to Local Stroage
            localStorage.setItem('asana-api-key', APIKey);

            connectedBtn.classList.remove('nConnected');
            connectedBtn.classList.add('sConnected');
            connectedBtn.innerText = 'Connected';

            let allResponse = await response.json()
            let responseData = allResponse.data;
            //console.log(responseData)

            // Getting Drop-Down from HTML
            let getDropDownFromHTML = document.getElementById('projectDropdown');
            
            // Calling Function For Upserting Projects
            projectsSections(getDropDownFromHTML, responseData);

            setTimeout(() => {
                  nextSection()
              },1500);
            

              
      }
      else {
            console.error('Error:', response.status, response.statusText);
            connectedBtn.classList.add('nConnected');
            connectedBtn.innerText = 'Invalid API Key';
      }
      document.getElementById("refreshBtn").disabled = false;
} 


// Project Refresh Button
function refreshBtn() {
      document.getElementById("refreshBtn").disabled = true;
      document.getElementById('projectDropdown').innerHTML = `<option>Select a Project</option>`;
      sectionDropdown.innerHTML = `<option value="">Select a Section</option>`;
      nextBtn();
}

// Add Event Listener For - Project Change then Change The Section
let getAllProjects = document.getElementById('projectDropdown');

getAllProjects.addEventListener('change', (event) => {
      let project_gid = event.target.value;

      // Get Sections URL
      let sectionGetUrl = `https://app.asana.com/api/1.0/projects/${project_gid}/sections`;

      
      sectionFetch()
      async function sectionFetch() {

            // Calling FetchFunction For Fetching Sections
            response = await fetchFunction(APIKey, sectionGetUrl);
            //console.log(response)
            if (response.ok) {
                  let allResponse = await response.json()
                  let responseData = allResponse.data;
                  //console.log('responseData',responseData)
      
                  // Getting Section From HTML
                  let sectionDropdown = document.getElementById('sectionDropdown');
      
                  // Reseting Drop-Down For Section
                  sectionDropdown.innerHTML = `<option value="">Select a Section</option>`;
      
                  //// Calling Function For Upserting Sections
                  projectsSections(sectionDropdown, responseData);
            }
            else {
                  sectionDropdown.innerHTML = `<option value="">Select a Section</option>`;
            }
      }
      
      
      
});



// Create Task Function
async function createTask() {

      // Get WordSpace ID URL
      let getWorkSpaceUrl = 'https://app.asana.com/api/1.0/workspaces';

      let getWorkSpaceID = await fetchFunction(APIKey, getWorkSpaceUrl);

      let workSpaceID;
      if (getWorkSpaceID.ok) {
            let allWorkSpace = await getWorkSpaceID.json()
            workSpaceID = allWorkSpace.data[0].gid;
      }

      // Getting All the Needed Value
      let taskName = document.getElementById('taskName').value;
      let projectID = document.getElementById('projectDropdown').value;
      let sectionID = document.getElementById('sectionDropdown').value;
      //console.log('Project ID: ',projectID,'Section ID: ', sectionID, 'workSpace ID: ',workSpaceID)
      
      // Mapping The Data for Creating a Task in Asana
      let data = {'data':{
            'name': taskName,
            "memberships": [{
                        "project":  projectID,
                        "section":  sectionID
                  }],
            'workspace': workSpaceID
      }

      }

      // Creating Task
      let createTaskResponse = await fetch('https://app.asana.com/api/1.0/tasks', {
            method: 'POST',
            headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json',
                  'authorization': `Bearer ${APIKey}`
            },
            body: JSON.stringify(data)
      });

      // Checking If Response is OK!
      if (createTaskResponse.ok) {
            let allResponse = await createTaskResponse.json()
            let responseData = allResponse.data;

            console.log('response ok ', responseData);

            alert(`Successfully Task Added.\nPermalink URL:\n${responseData.permalink_url}`);
 
            // Calling Clear Form Function
            clearForm(getAllProjects, sectionDropdown);
      }
      else {
            console.error(response.error,'response Not ok')
      }
      //console.log(response)
  
}
