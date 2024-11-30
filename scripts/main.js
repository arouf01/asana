
// API KEY!
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

// Getting Connected Status
let connectStatus = document.getElementById('connectStatus');

 // Getting Project Drop-Down from HTML
let getProjects = document.getElementById('projectDropdown');

// Next Button Function For and Getting Projects
async function nextBtn() {
      APIKey = document.getElementById('apiKey').value || localStorage.getItem('asana-api-key');

      // Get Projects URL
      let getProjectsUrl = 'https://app.asana.com/api/1.0/projects';

      // Calling FetchFunction For Projects
      let response = await fetchFunction(APIKey, getProjectsUrl);

      // Checking If Response is OK!
      if (response.ok) {

            // Saving API Key to Local Stroage
            localStorage.setItem('asana-api-key', APIKey);

            // Removeing and Adding Class
            connectStatus.classList.remove('nConnected');
            connectStatus.classList.add('sConnected');

            // Changing Status
            connectStatus.innerText = 'Connected';

            // Converting Response to JSON and Getting The DATA
            let allResponse = await response.json()
            let responseData = allResponse.data;
            //console.log(responseData)
            
            // Calling FetchFunction For Upserting Projects
            projectsSections(getProjects, responseData);

            // Calling NextSection Function
            setTimeout(() => {
                  nextSection();
              },1500);
      }
      else {
            console.error('Error:', response.status, response.statusText);
            connectStatus.classList.add('nConnected');
            connectStatus.innerText = 'Invalid API Key';
      }

      document.getElementById("refreshBtn").disabled = false;
} 


// Project Refresh Button
function refreshBtn() {
      document.getElementById("refreshBtn").disabled = true;
      getProjects.innerHTML = `<option>Select a Project</option>`;
      sectionDropdown.innerHTML = `<option value="">Select a Section</option>`;
      nextBtn();
}


getProjects.addEventListener('change', (event) => {
      let project_gid = event.target.value;

      // Get Sections URL
      let sectionGetUrl = `https://app.asana.com/api/1.0/projects/${project_gid}/sections`;

      
      sectionFetch()
      async function sectionFetch() {

            // Calling FetchFunction For Fetching Sections
            response = await fetchFunction(APIKey, sectionGetUrl);
            //console.log(response)

            // Checking If Response is OK!
            if (response.ok) {
                  let allResponse = await response.json()
                  let responseData = allResponse.data;
                  //console.log('responseData',responseData)
      
                  // Getting Section From HTML
                  let sectionDropdown = document.getElementById('sectionDropdown');
      
                  // Reseting Drop-Down For Section
                  sectionDropdown.innerHTML = `<option value="">Select a Section</option>`;
      
                  // Calling Function For Upserting Sections
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

      // Calling The FetchFunction For Fetching the WorkSpace
      let getWorkSpaceID = await fetchFunction(APIKey, getWorkSpaceUrl);

      // Getting response and Getting WorkSpace ID
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
            clearForm(getProjects, sectionDropdown);
      }
      else {
            console.error(createTaskResponse.status,'response Not ok')
      }
      //console.log(response)
  
}
