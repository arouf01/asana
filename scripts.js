// Checkiing If API Key In Local Storage
window.onload = () => {
      let getAPIKeyFromLocalStroge = localStorage.getItem('asana-api-key');
  
      if (getAPIKeyFromLocalStroge !== null) {
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
      // Get API Key
      var APIKey = document.getElementById('apiKey').value || localStorage.getItem('asana-api-key');

      // Getting Projects
      let response = await fetch('https://app.asana.com/api/1.0/projects', {
            method: 'GET',
            headers: {
                  'accept': 'application/json',
                  'authorization': `Bearer ${APIKey}`
            }
      });

      // Checking If Response is OK!
      if (response.ok) {

            // Saving API Key to Local Stroage
            localStorage.setItem('asana-api-key', APIKey);

            document.getElementById('connected').innerText = 'Connected';
            let allResponse = await response.json()
            let responseData = allResponse.data;
            //console.log(responseData)


            let getGroupFromHTML = document.getElementById('projectDropdown');
            for (let i = 0; i < responseData.length; i++){
                  let projectName = responseData[i].name;
                  let projectID = responseData[i].gid;
                  //console.log(projectName, projectID);

                  let createElementOptions = `<option id = "${projectName}" value="${projectID}">${projectName}</option>`
                  getGroupFromHTML.innerHTML += createElementOptions;
            }

            setTimeout(() => {
                  nextSection()
              },2000);
            

              
      }
      else {
            console.error('Error:', response.status, response.statusText);
            document.getElementById('connected').innerText = 'Invalid API Key';
        }
} 


// Add Event Listener For - Project Change then Change The Section
const getGroupID = document.getElementById('projectDropdown');

getGroupID.addEventListener('change', (event) => {
      let project_gid = event.target.value;

      let APIKey = document.getElementById('apiKey').value || localStorage.getItem('asana-api-key');

      // Getting Sections for the Project
      getSections()
      async function getSections() {
            let response = await fetch(`https://app.asana.com/api/1.0/projects/${project_gid}/sections`, {
                  method: 'GET',
                  headers: {
                        'accept': 'application/json',
                        'authorization': `Bearer ${APIKey}`
                      }
            })
            if (response.ok) {
                  let allResponse = await response.json()
                  let responseData = allResponse.data;
                  //console.log(responseData)

                  let sectionDropdown = document.getElementById('sectionDropdown');

                  // Reseting Drop-Down For Section
                  sectionDropdown.innerHTML = `<option value="">Select a Section</option>`;

                  for (let i = 0; i < responseData.length; i++){
                        
                        let sectionName = responseData[i].name;
                        let sectionID = responseData[i].gid;
                        //console.log(sectionName, sectionID);
      
                        let createElementOptions = `<option value="${sectionID}">${sectionName}</option>`
                        sectionDropdown.innerHTML += createElementOptions;
                        //console.log(createElementOptions)
                  }
            }
      }
      
});



// Create Task Function
async function createTask() {
      // Getting API Key
      let APIKey = document.getElementById('apiKey').value || localStorage.getItem('asana-api-key');


      // Getting Workspace
      let getWorkSpace = await fetch('https://app.asana.com/api/1.0/workspaces', {
            method: 'GET',
            headers: {
                  'accept': 'application/json',
                  'content-type': 'application/json',
                  'authorization': `Bearer ${APIKey}`
            }
      });
      let workSpaceID;
      if (getWorkSpace.ok) {
            let allWorkSpace = await getWorkSpace.json()
            workSpaceID = allWorkSpace.data[0].gid;
           // console.log(workSpaceID);
      }
      //console.log(workSpaceID);


      // Getting All the Needed Value
      let taskName = document.getElementById('taskName').value;
      let projectID = document.getElementById('projectDropdown').value;
      let sectionID = document.getElementById('sectionDropdown').value;

      //console.log('Project ID: ',projectID,'Section ID: ', sectionID, 'workSpace ID: ',workSpaceID)
      
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

      // Checking If Response is OK
      if (createTaskResponse.ok) {
            let allResponse = await createTaskResponse.json()
            let responseData = allResponse.data;
            console.log('response ok ', responseData);
            alert('Successfully Task Added')
            clearForm();
      }
      else {
            console.error(response.error,'response Not ok')
      }
      //console.log(response)
  
}


// Function For Clearing The Form
function clearForm() {
      document.getElementById('taskName').value = '';
      document.getElementById('projectDropdown').value = '';
      document.getElementById('sectionDropdown').value = '';
      
  }


// Logout Function and Clear Local Storage
function logOut() {
    localStorage.clear();
    location.reload();
}

