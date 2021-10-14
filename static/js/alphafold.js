// Render NGLviewer for PDB files

const MODELS = [
  'ranked_0.pdb',
  'ranked_1.pdb',
  'ranked_2.pdb',
  'ranked_3.pdb',
  'ranked_4.pdb',
]

const MATCHES = [];

const BUTTONS = [
  'cartoon',
  'ball+stick',
  'surface',
  'backbone',
]

const DEFAULT_REPRESENTATION = "cartoon";

let stage;

let state = {
  model: 0,
  modelObject: null,
  representations: {},
  colorScheme: 'bfactor',
  spin: true,
}

const uri = (i) => `/data/${MODELS[i]}`;
// const uri = (i) => `https://raw.githubusercontent.com/neoformit/alphafold-galaxy/main/data/${MODELS[i]}`;

document.addEventListener("DOMContentLoaded", function () {
  // Create NGL Stage object
  stage = new NGL.Stage("ngl-root", { backgroundColor: 'white' });
  stage.loadFile(uri(0), {defaultRepresentation: true});
  stage.setSpin(true);

  // Handle window resizing
  window.addEventListener( "resize", function( event ){
    stage.handleResize();
  }, false );
});

const loadModel = () => {
  // Load PDB entry
  stage.loadFile(uri(state.model)).then( (o) => {
    state.modelObject = o;
    addModelRepresentation(DEFAULT_REPRESENTATION);
    o.autoView();
  })
}

const toggleModelRepresentation = (rep) => {
  rep in state.representations ?
    removeModelRepresentation(rep)
    : addModelRepresentation(rep)
}

const addModelRepresentation = (rep) => {
  state.representations[rep] =
    state.modelObject.addRepresentation(rep, {colorScheme: "bfactor"});
  updateButtons();
}

const removeModelRepresentation = (rep) => {
  o = state.representations[rep];
  console.log(`Removing representation ${rep}`);
  state.modelObject.removeRepresentation(o);
  delete state.representations[rep];
  updateButtons();
}

const clearModelRepresentation = (rep) => {
  state.modelObject.removeAllRepresentation();
}

const updateButtons = () => {
  BUTTONS.forEach( (name) => {
    const id = `#btn-${name}`.replace('+', '-');
    const btn = document.querySelector(id);
    if (name in state.representations) {
      btn.classList.add('selected')
    } else {
      btn.classList.remove('selected');
    }
  });
}

const toggleSpin = () => {
  stage.toggleSpin();
  const btn = document.querySelector('#btn-toggle-spin');
  btn.classList.toggle('selected');
  state.spin = !state.spin;
}
