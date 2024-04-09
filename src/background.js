const cycleIntervalInMs = 5000;

const verificationInterval = setInterval(async () => {
  const currentRoute = await getCurrentRoute();
  console.log(currentRoute);

  if (!currentRoute) {
    return;
  }

  const limitedRoutes = await getLimitedRoutes();
  console.log(limitedRoutes);

  if (!limitedRoutes) {
    return;
  }

  const matchedRoutes = await getRouteLimits(currentRoute);
  console.log(matchedRoutes);

  if (!matchedRoutes) {
    return;
  }

  await updateRoutes(matchedRoutes);
}, cycleIntervalInMs);

async function updateRoutes(routes) {
  routes.forEach(async route => {
    console.log(await updateRouteTimeSpent(route));
  });
}

async function updateRouteTimeSpent(route) {
  await new Promise(resolve => {
    chrome.storage.local.get("websites", function (data) {
      const websites = data.websites || [];
      const websiteIndex = websites.findIndex(website => website.website === route.website);
      
      console.log(route)
      console.log(websiteIndex)

      const lastVisit = websites[websiteIndex]?.lastVisited 

      if (!lastVisit || !isDateFromToday(lastVisit)) {
        websites[websiteIndex].timeSpent = 0;
      }
      
      websites[websiteIndex].lastVisited = Date.now();
      websites[websiteIndex].timeSpent += cycleIntervalInMs;

      if (websites[websiteIndex].timeSpent >= route.timeLimit * 60 * 1000) {
        console.log(`You have reached your time limit for ${route.website}`);
        chrome.tabs.update({ url: "src/blocked.html" });
      }
      
      chrome.storage.local.set({ websites }, function () {
        resolve();
      });
    });
  });
}

async function getCurrentRoute() {
  const tabs = await new Promise(resolve => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      resolve(tabs);
    });
  });
  
  const url = tabs[0]?.url;
  return url;
}

async function getLimitedRoutes() {
  const websites = await new Promise(resolve => {
    chrome.storage.local.get("websites", function (data) {
      resolve(data.websites);
    });
  });
  
  return websites;
}

const getRouteLimits = async route => {
  const limitedRoutes = await getLimitedRoutes();
  const matchedRoutes = limitedRoutes.filter(limitedRoute => route.includes(limitedRoute.website));
  return matchedRoutes;
}

const isDateFromToday = date => {
  const today = new Date();
  const dateFromToday = new Date(date);

  return today.getDate() === dateFromToday.getDate() 
    && today.getMonth() === dateFromToday.getMonth() 
    && today.getFullYear() === dateFromToday.getFullYear();
}