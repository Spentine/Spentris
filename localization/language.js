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
        // home
        menuHomeButtonGame: "Game",
        menuHomeButtonSettings: "Settings",
        menuHomeButtonLanguage: "Language",
        
        // game
        menuGameButtonBack: "Back",
        menuGameButtonStandardGamemodes: "Standard Gamemodes",
        menuGameButtonPuzzles: "Puzzles",
        
        // puzzles
        menuPuzzlesButtonBack: "Back",
        menuPuzzlesButtonPlay: "Play",
        menuPuzzlesButtonCreate: "Create",
        
        // play puzzles
        menuPlayPuzzlesButtonBack: "Back",
        menuPlayPuzzlesButtonListing: "Listing",
        menuPlayPuzzlesButtonImport: "Import",
        
        // create puzzles
        menuCreatePuzzlesButtonBack: "Back",
        menuCreatePuzzlesButtonNew: "New",
        menuCreatePuzzlesButtonTemplate: "Template",
        menuCreatePuzzlesButtonImport: "Import",
        
        // standard gamemodes
        menuStandardGamemodesButtonBack: "Back",
        menuStandardGamemodesButtonMarathon: "Marathon",
        menuStandardGamemodesButtonSprint: "Sprint",
        menuStandardGamemodesButtonUltra: "Ultra",
        
        // settings
        menuSettingsButtonBack: "Back",
        menuSettingsButtonHandling: "Handling",
        menuSettingsButtonKeybinds: "Keybinds",
        
        // handling
        menuHandlingButtonBack: "Back",
        menuHandlingARRLabel: "ARR",
        menuHandlingDASLabel: "DAS",
        menuHandlingSDFLabel: "SDF",
        menuHandlingDCDLabel: "DCD",
        menuHandlingMSGLabel: "MSG",
        menuHandlingARELabel: "ARE",
        menuHandlingLCALabel: "LCA",
        
        // keybinds
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
        
        // language
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
        // home
        menuHomeButtonGame: "ゲーム",
        menuHomeButtonSettings: "設定",
        menuHomeButtonLanguage: "言語",
        
        // game
        menuGameButtonBack: "戻る",
        menuGameButtonStandardGamemodes: "標準ゲームモード",
        menuGameButtonPuzzles: "パズル",
        
        // puzzles
        menuPuzzlesButtonBack: "戻る",
        menuPuzzlesButtonPlay: "プレイ",
        menuPuzzlesButtonCreate: "作成",
        
        // play puzzles
        menuPlayPuzzlesButtonBack: "戻る",
        menuPlayPuzzlesButtonListing: "リスト",
        menuPlayPuzzlesButtonImport: "インポート",
        
        // create puzzles
        menuCreatePuzzlesButtonBack: "戻る",
        menuCreatePuzzlesButtonNew: "新規",
        menuCreatePuzzlesButtonTemplate: "テンプレート",
        menuCreatePuzzlesButtonImport: "インポート",
        
        // standard gamemodes
        menuStandardGamemodesButtonBack: "戻る",
        menuStandardGamemodesButtonMarathon: "マラソン",
        menuStandardGamemodesButtonSprint: "スプリント",
        menuStandardGamemodesButtonUltra: "ウルトラ",
        
        // settings
        menuSettingsButtonBack: "戻る",
        menuSettingsButtonHandling: "操作",
        menuSettingsButtonKeybinds: "キーバインド",
        
        // handling
        menuHandlingButtonBack: "戻る",
        menuHandlingARRLabel: "ARR",
        menuHandlingDASLabel: "DAS",
        menuHandlingSDFLabel: "SDF",
        menuHandlingDCDLabel: "DCD",
        menuHandlingMSGLabel: "MSG",
        menuHandlingARELabel: "ARE",
        menuHandlingLCALabel: "LCA",
        
        // keybinds
        menuKeybindsButtonBack: "戻る",
        menuKeybindsLeftLabel: "左",
        menuKeybindsRightLabel: "右",
        menuKeybindsSoftDropLabel: "ソフトドロップ",
        menuKeybindsHardDropLabel: "ハードドロップ",
        menuKeybindsRotateCCWLabel: "反時計回り",
        menuKeybindsRotateCWLabel: "時計回り",
        menuKeybindsRotate180Label: "180度回転",
        menuKeybindsHoldPieceLabel: "ホールド",
        menuKeybindsResetGameLabel: "リセット",
        
        // language
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