// Show all available NGL representations

// Max stages to render at one time
MAX_SHOW = 8;

REPS = [
  "axes",
  "backbone",
  "ball+stick",
  "base",
  "cartoon",
  "contact",
  "distance",
  "helixorient",
  "hyperball",
  "label",
  "licorice",
  "line",
  "point",
  "ribbon",
  "rocket",
  "rope",
  "spacefill",
  "surface",
  "trace",
  "tube",
  "unitcell",
  "validation",
]

document.addEventListener("DOMContentLoaded", async function () {
  await new Promise( resolve => setTimeout(resolve, 500) );
  showFrom(0);
});


const showFrom = (index) => {

  const main = $('.main');
  main.empty();

  REPS.slice(index, index + MAX_SHOW).forEach( async (repr, i) => {
    // Create root element
    const rootId = `${repr}-root`;
    const root = $(
      `<div>
        <h3>${repr}</h3>
        <div class="ngl-root" id="${rootId}"></div>
      </div>`
    );
    main.append(root);

    // Create NGL Stage object
    let stage = new NGL.Stage(rootId, { backgroundColor: 'grey' });
    await stage.loadFile("rcsb://1crn").then( (o) => {
      o.addRepresentation(repr, {colorScheme: "bfactor"});

      // Add additional representation(s)
      // o.addRepresentation('ball+stick', {colorScheme: "bfactor"});

      o.autoView();
    });
  });

}
