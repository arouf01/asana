async function fetchFunction(APIKey, url) {
      let response = await fetch(url, {
            method: 'GET',
            headers: {
                  'accept': 'application/json',
                  'authorization': `Bearer ${APIKey}`
            }
      });
      
      return response;
}