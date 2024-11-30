function projectsSections(projectsORSectionsDropdown, responseData) {
      for (let i = 0; i < responseData.length; i++){
            let projectORSectionName = responseData[i].name;
            let projectORSectionID = responseData[i].gid;
            //console.log(projectName, projectID);
      
            let createElementOptions = `<option value="${projectORSectionID}">${projectORSectionName}</option>`
            projectsORSectionsDropdown.innerHTML += createElementOptions;
      }
}

