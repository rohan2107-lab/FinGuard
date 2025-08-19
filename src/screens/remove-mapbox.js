const fs = require("fs");
const path = require("path");

function removeLines(filePath, patterns) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  const newContent = content
    .split("\n")
    .filter(line => !patterns.some(p => line.includes(p)))
    .join("\n");
  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`✅ Cleaned ${filePath}`);
}

// Paths
const settingsGradle = path.join(__dirname, "android", "settings.gradle");
const appBuildGradle = path.join(__dirname, "android", "app", "build.gradle");
const mainApplication = path.join(
  __dirname,
  "android",
  "app",
  "src",
  "main",
  "java"
);

// Step 1: Remove from settings.gradle
removeLines(settingsGradle, ["rnmapbox_maps"]);

// Step 2: Remove from app/build.gradle
removeLines(appBuildGradle, ["rnmapbox_maps", "mapbox"]);

// Step 3: Remove from MainApplication.java or MainApplication.kt
function cleanJavaFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      cleanJavaFiles(filePath);
    } else if (file.includes("MainApplication")) {
      removeLines(filePath, ["RCTMGLPackage", "mapbox"]);
    }
  });
}
cleanJavaFiles(mainApplication);

console.log("🎉 Mapbox has been removed. Now run:");
console.log("   cd android && gradlew clean");
