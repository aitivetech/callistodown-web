// Maps the browser's platform to a launcher RID: win-x64, win-arm64, linux-x64, linux-arm64 or osx-arm64.
// ridFromHints is pure (tested in tests/detect.test.js); detectRid collects the hints in a browser.
(function (root) {
  "use strict";

  // hints: { uaPlatform, architecture, bitness } from User-Agent Client Hints (may be empty),
  //        { userAgent, platform } from navigator. Returns a RID, or null for phones and tablets.
  function ridFromHints(hints) {
    const uaPlatform = String(hints.uaPlatform || "");
    const architecture = String(hints.architecture || "").toLowerCase();
    const ua = String(hints.userAgent || "");
    const platform = String(hints.platform || "");
    const all = uaPlatform + " " + platform + " " + ua;

    // Phones and tablets cannot run the game. iPadOS 13+ claims to be a Mac but has touch points.
    if (/Android|iPhone|iPad|iPod|Mobile/i.test(all) && !/Windows NT/i.test(ua)) return null;
    if (/Mac/i.test(all) && hints.maxTouchPoints > 1) return null;

    let os = null;
    if (/^Windows$/i.test(uaPlatform) || /Win/i.test(platform) || /Windows/i.test(ua)) os = "win";
    else if (/^macOS$/i.test(uaPlatform) || /Mac/i.test(platform) || /Mac OS X|Macintosh/i.test(ua)) os = "osx";
    else if (/^(Linux|Chrome OS|ChromeOS)$/i.test(uaPlatform) || /Linux|X11|CrOS/i.test(platform + " " + ua)) os = "linux";
    if (!os) return null;

    // Apple Silicon cannot be told from Intel reliably; every Mac gets the Arm64 build.
    if (os === "osx") return "osx-arm64";

    let arm = false;
    if (architecture) arm = architecture === "arm";
    else arm = /aarch64|arm64|armv8|\barm\b/i.test(platform + " " + ua);
    return os + "-" + (arm ? "arm64" : "x64");
  }

  async function detectRid(nav) {
    nav = nav || root.navigator || {};
    const hints = { userAgent: nav.userAgent, platform: nav.platform, maxTouchPoints: nav.maxTouchPoints };
    const uad = nav.userAgentData;
    if (uad) {
      hints.uaPlatform = uad.platform;
      if (typeof uad.getHighEntropyValues === "function") {
        try {
          const v = await uad.getHighEntropyValues(["architecture", "bitness"]);
          hints.architecture = v.architecture;
          hints.bitness = v.bitness;
        } catch (e) { /* not granted: fall back to the user agent */ }
      }
    }
    return ridFromHints(hints);
  }

  const api = { ridFromHints, detectRid };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CallistoDetect = api;
})(typeof window !== "undefined" ? window : globalThis);
