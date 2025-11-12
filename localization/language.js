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
        spinTitle: "spin",
        
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
        menuKeybindsAddKeybindButton: "Add Keybind",
        menuKeybindsAwaitingInputButton: "Awaiting Input",
        
        // language
        menuLanguageButtonBack: "Back",
        menuLanguageButtonEnglish: "English",
        menuLanguageButtonJapanese: "日本語",
        menuLanguageButtonDev: "</>",
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
  ja: {
    translations: {
      game: {
        scoreTitle: "スコア",
        linesTitle: "ライン",
        levelTitle: "レベル",
        timeTitle: "時間",
        spinTitle: "スピン",
        ppsTitle: "pps",
        
        // basically english
        // 基本的に英語
        clearConvert: (clear) => {
          const lineClears = {
            1: "Single",
            2: "Double",
            3: "Triple",
            4: "Quadruple",
            5: "Quinuple",
          };
          
          const text = {};
          
          if (clear.spin === null) {
            text.primary = lineClears[clear.lines];
          } else if (clear.spin === "mini") {
            text.primary = `Mini ${clear.piece}-Spin ${lineClears[clear.lines]}`;
          } else if (clear.spin === "full") {
            text.primary = `${clear.piece}-Spin ${lineClears[clear.lines]}`;
          } else {
            text.primary = `無効 ${clear.spin} ${clear.piece}-Spin ${lineClears[clear.lines]}`;
          }
          
          text.secondary = [];
          
          if (clear.b2b >= 2) {
            // i think japanese uses btb for back-to-back
            // 日本語はバックトゥバックのためにbtbを使うと思います
            text.secondary.push(`BTB x${clear.b2b - 1}`);
          }
          
          if (clear.combo >= 2) {
            text.secondary.push(`${clear.combo - 1} REN`);
          }
          
          if (clear.perfectClear) {
            text.secondary += " 全消し";
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
        menuSettingsButtonHandling: "ハンドリング",
        menuSettingsButtonKeybinds: "キーコンフィグ",
        
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
        menuKeybindsLeftLabel: "左に移動",
        menuKeybindsRightLabel: "右に移動",
        menuKeybindsSoftDropLabel: "ソフトドロップ",
        menuKeybindsHardDropLabel: "ハードドロップ",
        menuKeybindsRotateCCWLabel: "左回転",
        menuKeybindsRotateCWLabel: "右回転",
        menuKeybindsRotate180Label: "180度回転",
        menuKeybindsHoldPieceLabel: "ホールド",
        menuKeybindsResetGameLabel: "リセット",
        menuKeybindsAddKeybindButton: "キーバインド追加",
        menuKeybindsAwaitingInputButton: "入力待ち",
        
        // language
        menuLanguageButtonBack: "戻る",
        menuLanguageButtonEnglish: "English",
        menuLanguageButtonJapanese: "日本語",
        menuLanguageButtonDev: "</>",
      }
    },
    font: {
      ui: `"Kaisotai", "Bloxyl", sans-serif`,
      gameStats: "Kaisotai",
    },
  },
  dev: {
    translations: {
      game: {
        scoreTitle: "scoreTitle",
        linesTitle: "linesTitle",
        levelTitle: "levelTitle",
        timeTitle: "timeTitle",
        spinTitle: "spinTitle",
        ppsTitle: "ppsTitle",
        
        clearConvert: (clear) => {
          const text = {};
          
          const textPrimary = {
            "spin": clear.spin,
            "piece": clear.piece,
            "lines": clear.lines,
          };
          text.primary = JSON.stringify(textPrimary);
          
          const textSecondary = {
            "b2b": clear.b2b,
            "combo": clear.combo,
            "perfectClear": clear.perfectClear,
          };
          text.secondary = JSON.stringify(textSecondary);
          
          return text;
        },
      },
      ui: {
        // home
        menuHomeButtonGame: "menuHomeButtonGame",
        menuHomeButtonSettings: "menuHomeButtonSettings",
        menuHomeButtonLanguage: "menuHomeButtonLanguage",
        
        // game
        menuGameButtonBack: "menuGameButtonBack",
        menuGameButtonStandardGamemodes: "menuGameButtonStandardGamemodes",
        menuGameButtonPuzzles: "menuGameButtonPuzzles",
        
        // puzzles
        menuPuzzlesButtonBack: "menuPuzzlesButtonBack",
        menuPuzzlesButtonPlay: "menuPuzzlesButtonPlay",
        menuPuzzlesButtonCreate: "menuPuzzlesButtonCreate",
        
        // play puzzles
        menuPlayPuzzlesButtonBack: "menuPlayPuzzlesButtonBack",
        menuPlayPuzzlesButtonListing: "menuPlayPuzzlesButtonListing",
        menuPlayPuzzlesButtonImport: "menuPlayPuzzlesButtonImport",
        
        // create puzzles
        menuCreatePuzzlesButtonBack: "menuCreatePuzzlesButtonBack",
        menuCreatePuzzlesButtonNew: "menuCreatePuzzlesButtonNew",
        menuCreatePuzzlesButtonTemplate: "menuCreatePuzzlesButtonTemplate",
        menuCreatePuzzlesButtonImport: "menuCreatePuzzlesButtonImport",
        
        // standard gamemodes
        menuStandardGamemodesButtonBack: "menuStandardGamemodesButtonBack",
        menuStandardGamemodesButtonMarathon: "menuStandardGamemodesButtonMarathon",
        menuStandardGamemodesButtonSprint: "menuStandardGamemodesButtonSprint",
        menuStandardGamemodesButtonUltra: "menuStandardGamemodesButtonUltra",
        
        // settings
        menuSettingsButtonBack: "menuSettingsButtonBack",
        menuSettingsButtonHandling: "menuSettingsButtonHandling",
        menuSettingsButtonKeybinds: "menuSettingsButtonKeybinds",
        
        // handling
        menuHandlingButtonBack: "menuHandlingButtonBack",
        menuHandlingARRLabel: "menuHandlingARRLabel",
        menuHandlingDASLabel: "menuHandlingDASLabel",
        menuHandlingSDFLabel: "menuHandlingSDFLabel",
        menuHandlingDCDLabel: "menuHandlingDCDLabel",
        menuHandlingMSGLabel: "menuHandlingMSGLabel",
        menuHandlingARELabel: "menuHandlingARELabel",
        menuHandlingLCALabel: "menuHandlingLCALabel",
        
        // keybinds
        menuKeybindsButtonBack: "menuKeybindsButtonBack",
        menuKeybindsLeftLabel: "menuKeybindsLeftLabel",
        menuKeybindsRightLabel: "menuKeybindsRightLabel",
        menuKeybindsSoftDropLabel: "menuKeybindsSoftDropLabel",
        menuKeybindsHardDropLabel: "menuKeybindsHardDropLabel",
        menuKeybindsRotateCCWLabel: "menuKeybindsRotateCCWLabel",
        menuKeybindsRotateCWLabel: "menuKeybindsRotateCWLabel",
        menuKeybindsRotate180Label: "menuKeybindsRotate180Label",
        menuKeybindsHoldPieceLabel: "menuKeybindsHoldPieceLabel",
        menuKeybindsResetGameLabel: "menuKeybindsResetGameLabel",
        menuKeybindsAddKeybindButton: "menuKeybindsAddKeybindButton",
        menuKeybindsAwaitingInputButton: "menuKeybindsAwaitingInputButton",
        
        // language
        menuLanguageButtonBack: "menuLanguageButtonBack",
        menuLanguageButtonEnglish: "menuLanguageButtonEnglish",
        menuLanguageButtonJapanese: "menuLanguageButtonJapanese",
        menuLanguageButtonDev: "menuLanguageButtonDev",
      }
    },
    font: {
      ui: `"Bloxyl", sans-serif`,
      gameStats: "Bloxyl",
    },
  },
};

export { translations };