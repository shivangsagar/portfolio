/*
  PROJECT CATALOG — EDIT THIS FILE WHEN YOU ADD WORK.

  AutoCAD:
  - Put .dwg/.dxf files in projects/autocad/
  - Add a project object below. Keep file paths relative to the website root.
  - Use chronological IDs (01 = oldest); cards map from 2 of clubs upward.
  - For MLightCAD preview, set viewer: true. The drawing must be publicly hosted.
  - If a drawing cannot be previewed in MLightCAD, set viewer: false; download still works.

  Revit:
  - RVT is not a browser-preview format. Add PDF sheets/images for previews,
    and keep the native .rvt file downloadable if you want to share it.

  STAAD:
  - Add .std input files and PDF calculation/design reports where useful.

  GitHub:
  - Add repositories in the github array with their repository URL.
*/
window.PROJECTS = {
  autocad: [
    { title: "Single Lug Mounting Plate", file: "projects/autocad/01-Single-Lug-Mounting-Plate.dwg", type: "DWG", description: "2D mechanical component drawing created in AutoCAD.", viewer: true, number: "01" },
    { title: "Three-Lobed Profile Plate", file: "projects/autocad/02-Three-Lobed-Profile-Plate.dwg", type: "DWG", description: "Profile plate drawing with a three-lobed geometry.", viewer: true, number: "02" },
    { title: "Slotted Link Plate", file: "projects/autocad/03-Slotted-Link-Plate.dwg", type: "DWG", description: "2D drafting exercise featuring a slotted link profile.", viewer: true, number: "03" },
    { title: "Double-Lug Support Bracket", file: "projects/autocad/04-Double-Lug-Support-Bracket.dwg", type: "DWG", description: "Support bracket geometry drafted in AutoCAD.", viewer: true, number: "04" },
    { title: "Three-Point Mounting Plate", file: "projects/autocad/05-Three-Point-Mounting-Plate.dwg", type: "DWG", description: "Mounting plate with three-point arrangement.", viewer: true, number: "05" },
    { title: "Double-Ended Connecting Plate", file: "projects/autocad/06-Double-Ended-Connecting-Plate.dwg", type: "DWG", description: "Connecting plate drawing with two end features.", viewer: true, number: "06" },
    { title: "Taper Key", file: "projects/autocad/07-Taper-Key.dwg", type: "DWG", description: "Taper key component drawing.", viewer: true, number: "07" }
  ],
  github: [
    { title: "Presencia", type: "ANDROID / KOTLIN", description: "A minimal, privacy-focused attendance tracker. Attendance data is stored locally on the device, with a clean interface and visual attendance summary.", url: "https://github.com/shivangsagar/Presencia", tags: ["Kotlin", "Android", "Room / Local Storage"] },
    { title: "LectureTracker", type: "ANDROID / KOTLIN", description: "A minimal lecture tracking application with attendance insights and a donut-chart summary.", url: "https://github.com/shivangsagar/LectureTracker", tags: ["Kotlin", "Android", "Data Visualization"] }
  ],
  revit: [],
  staad: []
};
