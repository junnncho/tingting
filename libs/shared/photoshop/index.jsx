/// <reference types="types-for-adobe/Photoshop/2015.5"/>
//@include /c/Mintaka_Github/tingting/libs/photoshop/json.jsx
//@include /c/Mintaka_Github/tingting/libs/photoshop/constants.jsx
//@include /c/Mintaka_Github/tingting/libs/photoshop/createForLive2d.jsx
//@include /c/Mintaka_Github/tingting/libs/photoshop/splitGroupsToFiles.jsx
//@include /c/Mintaka_Github/tingting/libs/photoshop/renameLayerAndGroups.jsx
//@include /c/Mintaka_Github/tingting/libs/photoshop/createGenerative.jsx

//   const doc = documents.add(2000, 2000, 300, "testfilename", NewDocumentMode.RGB);
var doc = app.activeDocument;
// renameLayerAndGroups(doc);
// splitGroupsToFiles(doc, "neck", false);
splitGroupsToImages(doc);
// createForLive2d(doc, "eyes");
// createGenerative(2);
// generateTribe(doc);
