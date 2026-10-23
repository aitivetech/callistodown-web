// node tests/detect.test.js
const assert = require("node:assert/strict");
const { ridFromHints } = require("../detect.js");

const cases = [
  ["Chrome on Windows (UA-CH, x86)", { uaPlatform: "Windows", architecture: "x86", bitness: "64",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36", platform: "Win32" }, "win-x64"],
  ["Edge on Windows on Arm (UA-CH arm, UA says x64)", { uaPlatform: "Windows", architecture: "arm", bitness: "64",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36 Edg/141.0", platform: "Win32" }, "win-arm64"],
  ["Firefox on Windows (no UA-CH)", { userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0", platform: "Win32" }, "win-x64"],
  ["Firefox on Linux x86_64", { userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144.0", platform: "Linux x86_64" }, "linux-x64"],
  ["Firefox on Linux aarch64", { userAgent: "Mozilla/5.0 (X11; Linux aarch64; rv:144.0) Gecko/20100101 Firefox/144.0", platform: "Linux aarch64" }, "linux-arm64"],
  ["Chrome on Linux (UA-CH arm)", { uaPlatform: "Linux", architecture: "arm", bitness: "64",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36", platform: "Linux x86_64" }, "linux-arm64"],
  ["Chrome OS", { uaPlatform: "Chrome OS", architecture: "x86",
    userAgent: "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36", platform: "Linux x86_64" }, "linux-x64"],
  ["Safari on a Mac", { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15", platform: "MacIntel", maxTouchPoints: 0 }, "osx-arm64"],
  ["Chrome on an Intel Mac (UA-CH x86): still Arm64", { uaPlatform: "macOS", architecture: "x86",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36", platform: "MacIntel" }, "osx-arm64"],
  ["iPad (desktop-class UA, touch)", { userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15", platform: "MacIntel", maxTouchPoints: 5 }, null],
  ["iPhone", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1", platform: "iPhone" }, null],
  ["Android", { uaPlatform: "Android", architecture: "", userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36", platform: "Linux armv8l" }, null],
  ["Unknown", { userAgent: "curl/8.0", platform: "" }, null],
];

let failed = 0;
for (const [name, hints, want] of cases) {
  const got = ridFromHints(hints);
  try { assert.equal(got, want); console.log("ok  ", name, "->", got); }
  catch { failed++; console.log("FAIL", name, "-> got", got, "want", want); }
}
if (failed) { console.log(failed + " failed"); process.exit(1); }
console.log(cases.length + " passed");
