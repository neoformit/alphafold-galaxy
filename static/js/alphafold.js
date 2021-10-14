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

// const uri = "rcsb://1crn";
const uri = (i) => `/data/${MODELS[i]}`;

document.addEventListener("DOMContentLoaded", function () {
  // Create NGL Stage object
  stage = new NGL.Stage("ngl-root", { backgroundColor: 'white' });

  // Handle window resizing
  window.addEventListener( "resize", function( event ){
      stage.handleResize();
  }, false );

  loadModel();
  stage.setSpin(true);
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
  // state.modelObject.autoView();
  updateButtons();
}

const removeModelRepresentation = (rep) => {
  o = state.representations[rep];
  console.log(`Removing representation ${rep}`);
  state.modelObject.removeRepresentation(o);
  delete state.representations[rep];
  // state.modelObject.autoView();
  updateButtons();
}

const clearModelRepresentation = (rep) => {
  state.modelObject.removeAllRepresentation();
  // state.modelObject.autoView();
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
