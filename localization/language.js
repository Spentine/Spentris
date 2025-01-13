const languages = {
  en: {
    translations: {
      gameScoreTitle: "score",
      gameLinesTitle: "lines",
      gameLevelTitle: "level",
      gameTimeTitle: "time",
      gameSpinTitle: "spin",
      
      clearConvert: (clear) => {
        const lineClears = {
          1: "Single",
          2: "Double",
          3: "Triple",
          4: "Quadruple", // blatantly taken from spirit drop :<
          5: "Quintuple", // optional for pentominos
        };
        
        const text = {};
        
        if (clear.spin === null) {
          text.primary = lineClears[clear.lines];
        } else if (clear.spin === "mini") {
          text.primary = `Mini ${clear.piece}-Spin ${lineClears[clear.lines]}`;
        } else if (clear.spin === "full") {
          text.primary = `${clear.piece}-Spin ${lineClears[clear.lines]}`;
        } else {
          text.primary = `Invalid ${clear.spin} ${clear.piece}-Spin ${lineClears[clear.lines]}`;
        }
        
        if (clear.perfectClear) {
          text.primary += " Perfect Clear";
        }
        
        text.secondary = [];
        
        if (clear.b2b >= 2) {
          text.secondary.push(`Back-to-Back x${clear.b2b - 1}`);
        }
        
        if (clear.combo >= 2) {
          text.secondary.push(`Combo x${clear.combo - 1}`);
        }
        
        text.secondary = text.secondary.join(" ");
        
        return text;
      },
    },
    font: {
      gameBoard: "Bloxyl",
    },
  },
  
  // please help with the translations if you can
  // thanks in advance
  // 翻訳できる場合はお手伝いください
  // お願いします
  jp: {
    translations: {
      gameScoreTitle: "スコア",
      gameLinesTitle: "ライン",
      gameLevelTitle: "レベル",
      gameTimeTitle: "時間",
      gameSpinTitle: "スピン",
      
      // too much katakana spam
      // カタカナが多すぎる
      clearConvert: (clear) => {
        const lineClears = {
          1: "シングル",
          2: "ダブル",
          3: "トリプル",
          4: "クアドルプル",
          5: "クインタプル",
        };
        
        const text = {};
        
        if (clear.spin === null) {
          text.primary = lineClears[clear.lines];
        } else if (clear.spin === "mini") {
          text.primary = `ミニ ${clear.piece}-スピン ${lineClears[clear.lines]}`;
        } else if (clear.spin === "full") {
          text.primary = `${clear.piece}-スピン ${lineClears[clear.lines]}`;
        } else {
          text.primary = `無効 ${clear.spin} ${clear.piece}-スピン ${lineClears[clear.lines]}`;
        }
        
        if (clear.perfectClear) {
          text.primary += " パーフェクトクリア";
        }
        
        text.secondary = [];
        
        if (clear.b2b >= 2) {
          text.secondary.push(`バックトゥバック x${clear.b2b - 1}`);
        }
        
        if (clear.combo >= 2) {
          text.secondary.push(`コンボ x${clear.combo - 1}`);
        }
        
        text.secondary = text.secondary.join(" ");
        
        return text;
      },
    },
    font: {
      gameBoard: "sans-serif",
    },
  }
}

var currentLanguage = "en";

export { languages, currentLanguage };