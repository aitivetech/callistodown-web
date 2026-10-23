// The one place for the downloads: the released flag, the platforms and the URL pattern. File names must match what
// the release workflow uploads to the R2 bucket behind download.callistodown.com (see README.md, "Downloads").
window.CALLISTO_DOWNLOADS = {
  // false until the first public build is uploaded: the section says "First public test build coming soon" and
  // nothing can be downloaded. Set to true once the files of every available platform exist.
  released: false,

  // Channel preselected in the toggle: "stable" or "unstable".
  defaultStability: "stable",

  // The five launcher RIDs. available: false shows the platform as "coming later" (not downloadable).
  platforms: {
    "win-x64":     { os: "Windows", arch: "x64",                 available: true },
    "win-arm64":   { os: "Windows", arch: "Arm64",               available: false },
    "linux-x64":   { os: "Linux",   arch: "x64",                 available: true },
    "linux-arm64": { os: "Linux",   arch: "Arm64",               available: false },
    "osx-arm64":   { os: "macOS",   arch: "Apple Silicon",       available: false },
  },

  // The download URL of a launcher. rid: one of the keys above; stability: "stable" or "unstable".
  url(rid, stability) {
    const base = "https://download.callistodown.com/launcher/CallistoDown-" + rid + "-" + stability;
    if (rid.startsWith("win-")) return base + "-Setup.exe";
    if (rid.startsWith("linux-")) return base + ".AppImage";
    return base + ".pkg";
  },

  // File type shown under the button.
  kind(rid) {
    if (rid.startsWith("win-")) return "installer (.exe)";
    if (rid.startsWith("linux-")) return "AppImage";
    return "installer (.pkg)";
  },
};
