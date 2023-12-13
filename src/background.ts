setInterval(async () => {
  const currentRoute = await getCurrentRoute();
  console.log(currentRoute);
}, 5000);

async function getCurrentRoute(): Promise<string | undefined> {
  const tabs = await new Promise<chrome.tabs.Tab[]>(resolve => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      resolve(tabs);
    });
  });

  const url = tabs[0].url;
  return url;
}
