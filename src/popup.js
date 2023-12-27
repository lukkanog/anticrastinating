document.addEventListener("DOMContentLoaded", async function () {
  const form = document.getElementById("websiteForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const website = document.getElementById("website").value;
    const timeLimit = parseInt(document.getElementById("timeLimit").value);

    chrome.storage.local.get("websites", function (data) {
      const websites = data.websites || [];
      websites.push({ website, timeLimit });
      chrome.storage.local.set({ websites }, async function () {
        alert("Website and time limit added successfully!");

        
        const parent = document.getElementById('websiteListItems');
        parent.innerHTML = '';

        const websites = await getLimitedRoutes();

        websites.forEach(website => {
          createRouteItem(website.website, website.timeLimit);
        });
      });
    });
  });

  const websites = await getLimitedRoutes();

  websites.forEach(website => {
    createRouteItem(website.website, website.timeLimit);
  });
});


async function getLimitedRoutes() {
  const websites = await new Promise(resolve => {
    chrome.storage.local.get("websites", function (data) {
      resolve(data.websites);
    });
  });

  return websites;
}

function createRouteItem(websiteName, timeLimit) {
  const li = document.createElement('li');
  const div = document.createElement('div');
  const img = document.createElement('img');
  const websiteNameSpan = document.createElement('span');
  const timeLimitSpan = document.createElement('span');
  const button = document.createElement('button');
  const deleteSpan = document.createElement('span');

  li.className = 'route-item';
  div.className = 'icon-and-name';
  img.src = `https://www.google.com/s2/favicons?domain=${websiteName}`;
  img.className = 'website-icon';
  websiteNameSpan.className = 'website-name';
  websiteNameSpan.textContent = websiteName;
  timeLimitSpan.className = 'website-time-limit';
  timeLimitSpan.textContent = `${timeLimit} minutes`;
  button.className = 'remove-button';
  deleteSpan.className = 'material-symbols-outlined';
  deleteSpan.textContent = 'delete';

  div.appendChild(img);
  div.appendChild(websiteNameSpan);
  li.appendChild(div);
  li.appendChild(timeLimitSpan);
  li.appendChild(button);
  button.appendChild(deleteSpan);

  button.addEventListener('click', async function () {
    await removeRouteLimit(websiteName);
    li.remove();
  });

  const parent = document.getElementById('websiteListItems');
  parent.appendChild(li);
}

async function removeRouteLimit(websiteName) {
  await new Promise(resolve => {
    chrome.storage.local.get("websites", function (data) {
      const websites = data.websites || [];
      const websiteIndex = websites.findIndex(website => website.website === websiteName);

      websites.splice(websiteIndex, 1);

      chrome.storage.local.set({ websites }, function () {
        resolve();
      });
    });
  });
}