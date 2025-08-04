// Wix Velo integration for MacroSight.net
// This code should be placed in your Wix site's page code

import { fetch } from "wix-fetch";

// Feature flag to switch between embed mode and dynamic loading
const USE_EMBED = false;

function initializeDynamicLoading(htmlComponent) {
  async function loadPageContent(pageName) {
    try {
      const response = await fetch(
        `https://www.macrosight.net/${pageName}.html`,
      );
      const htmlContent = await response.text();

      const iframe = htmlComponent.contentWindow;
      iframe.postMessage(htmlContent, "https://www.macrosight.net");
    } catch (error) {
      console.error("Failed to load content:", error);
      htmlComponent.src = `https://www.macrosight.net/embed.html`;
    }
  }

  loadPageContent("home");

  $w("#homeButton").onClick(() => loadPageContent("home"));
  $w("#aboutButton").onClick(() => loadPageContent("about"));
  $w("#projectsButton").onClick(() => loadPageContent("projects"));
  $w("#experienceButton").onClick(() => loadPageContent("experience"));
  $w("#contactButton").onClick(() => loadPageContent("contact"));

  $w("#resumeButton").onClick(() => loadPageContent("resume"));
  $w("#investButton").onClick(() => loadPageContent("invest"));
}

function initializeEmbed(htmlComponent) {
  htmlComponent.src = "https://www.macrosight.net/embed.html";

  setTimeout(() => {
    const iframe = htmlComponent.contentWindow;

    fetch("https://www.macrosight.net/home.html")
      .then((response) => response.text())
      .then((html) => {
        iframe.postMessage(html, "https://www.macrosight.net");
      });
  }, 1000);
}

function initialize(htmlComponent) {
  if (USE_EMBED) {
    initializeEmbed(htmlComponent);
  } else {
    initializeDynamicLoading(htmlComponent);
  }
}

$w.onReady(() => {
  const htmlComponent = $w("#htmlComponent1");
  initialize(htmlComponent);
});
