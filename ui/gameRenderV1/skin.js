import { EventEmitter } from "../../eventEmitter.js";

// handle skin data

// from previous version
const tileMapData = {
  minos_0: {
    tiles: {
      Z: {x: 0, y: 0},
      L: {x: 96, y: 0},
      O: {x: 192, y: 0},
      S: {x: 288, y: 0},
      I: {x: 384, y: 0},
      J: {x: 0, y: 96},
      T: {x: 96, y: 96},
      hold: {x: 192, y: 96},
      garbage: {x: 288, y: 96},
      unclearableGarbage: {x: 384, y: 96},
    },
    ids: {
      0: {x: 0, y: 0},
    },
    tileSize: 96,
  },
  ghost_0: {
    tiles: {
      ghost: {x: 0, y: 0},
      spawn: {x: 96, y: 0},
    },
    ids: {
      0: {x: 0, y: 0},
    },
    tileSize: 96,
  },
  connectedMinos_0: {
    tiles: {
      Z: {x: 384, y: 0},
      L: {x: 768, y: 0},
      O: {x: 1152, y: 0},
      S: {x: 1536, y: 0},
      I: {x: 0, y: 576},
      J: {x: 96, y: 576},
      T: {x: 192, y: 576},
      hold: {x: 288, y: 576},
      garbage: {x: 1920, y: 0},
      unclearableGarbage: {x: 1920, y: 576},
    },
    ids: {
      0: {x: 0, y: 0},
      1: {x: 96, y: 0},
      2: {x: 192, y: 0},
      3: {x: 288, y: 0},
      4: {x: 0, y: 96},
      5: {x: 96, y: 96},
      6: {x: 192, y: 96},
      7: {x: 288, y: 96},
      8: {x: 0, y: 192},
      9: {x: 96, y: 192},
      10: {x: 192, y: 192},
      11: {x: 288, y: 192},
      12: {x: 0, y: 288},
      13: {x: 96, y: 288},
      14: {x: 192, y: 288},
      15: {x: 288, y: 288},
      16: {x: 0, y: 384},
      17: {x: 96, y: 384},
      18: {x: 192, y: 384},
      19: {x: 288, y: 384},
      20: {x: 0, y: 480},
      21: {x: 96, y: 480},
      22: {x: 192, y: 480},
      23: {x: 288, y: 480},
    },
    tileSize: 96,
  },
  connectedGhost_0: {
    tiles: {
      ghost: {x: 384, y: 0},
      spawn: {x: 768, y: 0},
    },
    ids: {
      0: {x: 0, y: 0},
      1: {x: 96, y: 0},
      2: {x: 192, y: 0},
      3: {x: 288, y: 0},
      4: {x: 0, y: 96},
      5: {x: 96, y: 96},
      6: {x: 192, y: 96},
      7: {x: 288, y: 96},
      8: {x: 0, y: 192},
      9: {x: 96, y: 192},
      10: {x: 192, y: 192},
      11: {x: 288, y: 192},
      12: {x: 0, y: 288},
      13: {x: 96, y: 288},
      14: {x: 192, y: 288},
      15: {x: 288, y: 288},
      16: {x: 0, y: 384},
      17: {x: 96, y: 384},
      18: {x: 192, y: 384},
      19: {x: 288, y: 384},
      20: {x: 0, y: 480},
      21: {x: 96, y: 480},
      22: {x: 192, y: 480},
      23: {x: 288, y: 480},
    },
    tileSize: 96,
  },
};

class TileMap {
  /**
   * @param {Object} settings
   */
  constructor(settings) {
    settings = settings ?? {};
    
    // name of tilemap
    this.name = settings.name ?? null;
    
    // tilemap type
    this.type = settings.type ?? null;
    this.tileMapData = tileMapData[this.type];
    
    // image of tilemap
    this.image = settings.image ?? null;
    
    // tilemap image url
    this.imageURL = settings.imageURL ?? null;
    
    // create event emitter
    this.event = new EventEmitter();
    
    // download image if given the url but not the image
    if (this.imageURL && !this.image) {
      this.image = new Image();
      
      // loaded
      this.image.addEventListener("load", () => {
        this.event.emit("load", {
          time: Date.now(),
          tilemap: this,
        });
      });
      
      // error
      this.image.addEventListener("error", (error) => {
        this.event.emit("loadError", {
          time: Date.now(),
          tilemap: this,
          error: error,
        });
      });
      
      // start loading
      this.image.src = this.imageURL;
    }
  }
  
  /**
   * return array with: [image, sx, sy, sWidth, sHeight]
   * @param {String} tile
   * @param {Number} id
   * @returns {Array}
   */
  getTile(tile, id) {
    const mainTile = this.tileMapData.tiles[tile];
    const idTile = this.tileMapData.ids[id];
    const size = this.tileMapData.tileSize;
    
    return [
      this.image,
      mainTile.x + idTile.x,
      mainTile.y + idTile.y,
      size,
      size,
    ];
  }
}

class GameSkin {
  constructor(settings) {
    settings = settings ?? {};
    
    // name of skin
    this.name = settings.name ?? null;
    
    // create tilemaps
    this.tilemaps = settings.tilemaps ?? {};
    
    // create event emitter
    this.event = new EventEmitter();
    
    // create event for skin loading
    const keys = Object.keys(this.tilemaps);
    let loaded = 0;
    for (let key of keys) {
      this.tilemaps[key].event.on("load", () => {
        loaded++;
        if (loaded === keys.length) {
          this.event.emit("load", {
            time: Date.now(),
            skin: this,
          });
        }
      });
    }
  }
}

// locate to Spentris folder
const urlPrefix = new URL("../..", import.meta.url).href;

const tetrioSkin = new GameSkin({
  "name": "TETRIO",
  "tilemaps": {
    "minos": new TileMap({
      "name": "minos",
      "type": "minos_0",
      "imageURL": `${urlPrefix}ui/skins/TETRIO/minos.png`,
    }),
    "ghost": new TileMap({
      "name": "ghost",
      "type": "ghost_0",
      "imageURL": `${urlPrefix}ui/skins/TETRIO/ghost.png`,
    }),
  },
});

export { TileMap, GameSkin, tetrioSkin };