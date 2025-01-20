const translations = {
  en: {
    translations: {
      game: {
        scoreTitle: "score",
        linesTitle: "lines",
        levelTitle: "level",
        timeTitle: "time",
        spinTitle: "spin",
        ppsTitle: "pps", // pieces per second
        
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
      ui: {
        menuHomeButtonPlay: "Play",
        menuHomeButtonSettings: "Settings",
        menuHomeButtonLanguage: "Language",
        menuPlayButtonBack: "Back",
        menuPlayButtonMarathon: "Marathon",
        menuPlayButtonSprint: "Sprint",
        menuPlayButtonUltra: "Ultra",
        menuSettingsButtonBack: "Back",
        menuSettingsButtonHandling: "Handling",
        menuSettingsButtonKeybinds: "Keybinds",
        menuHandlingButtonBack: "Back",
        menuHandlingARRLabel: "ARR",
        menuHandlingDASLabel: "DAS",
        menuHandlingSDFLabel: "SDF",
        menuHandlingDCDLabel: "DCD",
        menuHandlingMSGLabel: "MSG",
        menuHandlingARELabel: "ARE",
        menuHandlingLCALabel: "LCA",
        menuKeybindsButtonBack: "Back",
        menuKeybindsLeftLabel: "Left",
        menuKeybindsRightLabel: "Right",
        menuKeybindsSoftDropLabel: "Soft Drop",
        menuKeybindsHardDropLabel: "Hard Drop",
        menuKeybindsRotateCCWLabel: "Rotate CCW",
        menuKeybindsRotateCWLabel: "Rotate CW",
        menuKeybindsRotate180Label: "Rotate 180",
        menuKeybindsHoldPieceLabel: "Hold Piece",
        menuKeybindsResetGameLabel: "Reset Game",
        menuLanguageButtonBack: "Back",
        menuLanguageButtonEnglish: "English",
        menuLanguageButtonJapanese: "日本語",
      }
    },
    font: {
      ui: `"Bloxyl", sans-serif`,
      gameStats: "Bloxyl",
    },
  },
  
  // please help with the translations if you can
  // thanks in advance
  // 翻訳できる場合はお手伝いください
  // お願いします
  jp: {
    translations: {
      game: {
        scoreTitle: "スコア",
        linesTitle: "ライン",
        levelTitle: "レベル",
        timeTitle: "時間",
        spinTitle: "スピン",
        ppsTitle: "pps",
        
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
            text.primary += " パフェ";
          }
          
          text.secondary = [];
          
          if (clear.b2b >= 2) {
            text.secondary.push(`バックトゥバック x${clear.b2b - 1}`);
          }
          
          if (clear.combo >= 2) {
            text.secondary.push(`${clear.combo - 1} REN`);
          }
          
          text.secondary = text.secondary.join(" ");
          
          return text;
        },
      },
      ui: {
        menuHomeButtonPlay: "プレイ",
        menuHomeButtonSettings: "設定",
        menuHomeButtonLanguage: "言語",
        menuPlayButtonBack: "戻る",
        menuPlayButtonMarathon: "マラソン",
        menuPlayButtonSprint: "スプリント",
        menuPlayButtonUltra: "ウルトラ",
        menuSettingsButtonBack: "戻る",
        menuSettingsButtonHandling: "操作",
        menuSettingsButtonKeybinds: "キーバインド",
        menuHandlingButtonBack: "戻る",
        menuHandlingARRLabel: "ARR",
        menuHandlingDASLabel: "DAS",
        menuHandlingSDFLabel: "SDF",
        menuHandlingDCDLabel: "DCD",
        menuHandlingMSGLabel: "MSG",
        menuHandlingARELabel: "ARE",
        menuHandlingLCALabel: "LCA",
        menuKeybindsButtonBack: "戻る",
        menuKeybindsLeftLabel: "左",
        menuKeybindsRightLabel: "右",
        menuKeybindsSoftDropLabel: "ソフトドロップ",
        menuKeybindsHardDropLabel: "ハードドロップ",
        menuKeybindsRotateCCWLabel: "反時計回りに回転",
        menuKeybindsRotateCWLabel: "時計回りに回転",
        menuKeybindsRotate180Label: "180度回転",
        menuKeybindsHoldPieceLabel: "ホールド",
        menuKeybindsResetGameLabel: "リセット",
        menuLanguageButtonBack: "戻る",
        menuLanguageButtonEnglish: "English",
        menuLanguageButtonJapanese: "日本語",
      }
    },
    font: {
      ui: `"Kaisotai", "Bloxyl", sans-serif`,
      gameStats: "Kaisotai",
    },
  },
}

var currentLanguage = null;

// set the current language
// when exporting currentLanguage it becomes a constant
function setLanguage(lang) {
  currentLanguage = lang;
}

export { translations, currentLanguage, setLanguage };