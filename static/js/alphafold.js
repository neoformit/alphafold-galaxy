// Render NGLviewer for PDB files

// State management has been implemented with vanilla Js but could have used
// Vue - it's a fairly simple use case so a global 'state' object works fine
// without complicating things too much.

const MODELS = [
  'ranked_0.pdb',
  'ranked_1.pdb',
  'ranked_2.pdb',
  'ranked_3.pdb',
  'ranked_4.pdb',
]

const BUTTONS = [
  'cartoon',
  'ball+stick',
  'surface',
  'backbone',
]

const DEFAULT_REPRESENTATION = BUTTONS[0];

let stage;

let state = {
  model: 0,
  modelObject: null,
  representations: {},
  colorScheme: 'bfactor',
  darkMode: false,
  spin: true,
}

const uri = (i) => `/data/${MODELS[i]}`;
// const uri = (i) => `https://raw.githubusercontent.com/neoformit/alphafold-galaxy/main/data/${MODELS[i]}`;

document.addEventListener("DOMContentLoaded", async function () {
  // Create NGL Stage object
  stage = new NGL.Stage("ngl-root", { backgroundColor: 'white' });

  // Handle window resizing
  window.addEventListener("resize", stage.handleResize, false);

  // Load model with selected representations
  loadModel();
});

// Models ----------------------------------------------------------------------

const setModel = (ix) => {
  state.model = ix;
  stage.removeAllComponents();
  loadModel();
  updateButtons();
}

const loadModel = () => {
  setLoading(1);
  if (state.representations.length) {
    reps = Objects.keys(state.representations);
    clearModelRepresentations();
  } else {
    reps = [DEFAULT_REPRESENTATION];
  }

  // Load PDB entry
  return stage.loadFile(uri(state.model)).then( (o) => {
    state.modelObject = o;
    reps.forEach( (r) => addModelRepresentation(r) );
    stage.setSpin(state.spin);
    o.autoView();
    setLoading(0);
  })
}

// Representations -------------------------------------------------------------

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
  state.modelObject.removeRepresentation(o);
  delete state.representations[rep];
  updateButtons();
}

const clearModelRepresentations = () => {
  state.modelObject.removeAllRepresentations();
  state.representations = {};
}

// Actions ---------------------------------------------------------------------

const toggleDark = () => {
  state.darkMode = !state.darkMode;
  stage.setParameters({
    backgroundColor: state.darkMode ? 'black' : 'white',
  });
  const btn = document.querySelector('#btn-toggle-dark');
  btn.classList.toggle('selected');
}

const setLoading = (state) => {
  document.getElementById('ngl-loading')
    .style.display = state ? 'block' : 'none';
}

const toggleSpin = () => {
  stage.toggleSpin();
  const btn = document.querySelector('#btn-toggle-spin');
  btn.classList.toggle('selected');
  state.spin = !state.spin;
}

const downloadPng = () => {
  const params = {
    factor: 3,
    antialias: true,
  }
  stage.makeImage(params).then( (blob) => {
    const name = MODELS[state.model].replace('.pdb', '.png');
    const url = URL.createObjectURL(blob);
    makeDownload(url, name);
  })
}

const downloadPdb = () => {
  const url = uri(state.model);
  const name = `alphafold_${MODELS[state.model]}`;
  makeDownload(url, name);
}

const makeDownload = (url, name) => {
  // Will not work with cross-origin urls (i.e. during development)
  const saveLink = document.createElement('a');
  saveLink.href = url;
  saveLink.download = name;
  document.body.appendChild(saveLink);
  saveLink.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  );
  document.body.removeChild(saveLink);
}

const updateButtons = () => {
  MODELS.forEach( (name, i) => {
    const id = `#btn-${name.replace('.pdb', '')}`;
    const btn = document.querySelector(id);
    i == state.model ?
      btn.classList.add('selected')
      : btn.classList.remove('selected');
  })

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
