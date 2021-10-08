// Create NGL Stage object
var stage = new NGL.Stage("viewport");

// Handle window resizing
window.addEventListener( "resize", function( event ){
    stage.handleResize();
}, false );

// Load PDB entry 1CRN
stage.loadFile(
  "rcsb://1crn",
  // "https://raw.githubusercontent.com/neoformit/alphafold-galaxy/main/data/ranked_0.pdb",
  { defaultRepresentation: true }
);
