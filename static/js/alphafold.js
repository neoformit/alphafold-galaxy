window.onload = function () {
  // Render NGLviewer for PDB files
  // const uri = "rcsb://1crn";
  const uri = "/data/ranked_0.pdb";

  // Create NGL Stage object
  var stage = new NGL.Stage("viewport");

  // Handle window resizing
  window.addEventListener( "resize", function( event ){
      stage.handleResize();
  }, false );

  // Load PDB entry
  stage.loadFile(uri).then(function (component) {
    component.addRepresentation("cartoon");
    component.autoView();
  });
};
