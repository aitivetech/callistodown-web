// The one place for the downloads. File names must match what the release workflow uploads to the R2 bucket
// behind download.callistodown.com (see README.md, "Downloads").
window.CALLISTO_DOWNLOADS = {
  // false until the first public build is uploaded: the section says "First public test build coming soon"
  // and the buttons are disabled. Set to true once both files below exist.
  released: false,
  windows: "https://download.callistodown.com/launcher/CallistoDown-win-x64-Setup.exe",
  linux: "https://download.callistodown.com/launcher/CallistoDown-linux-x64.AppImage",
};
