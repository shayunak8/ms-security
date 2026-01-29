export const ANIMATION_DURATION = {
  REEL_1_REVEAL: 1000,
  REEL_2_REVEAL: 2000,
  REEL_3_REVEAL: 3000,
} as const;

export const INITIAL_STATE = {
  SPINNING_SYMBOL: "X",
  INITIAL_SYMBOLS: ["X", "X", "X"] as const,
} as const;

export const STATUS_MESSAGE = {
  SESSION_CLOSED: "Session closed",
  STARTING_GAME: "Starting…",
  ROLLING: "Rolling…",
  START_GAME: "Start Game",
  ROLL: "Roll",
  CASH_OUT: "Cash Out",
  CREDITS_LABEL: "Credits:",
} as const;

export const CSS_CLASS = {
  APP: "App",
  APP_MAIN: "App-main",
  APP_TITLE: "App-title",
  STATUS_BAR: "StatusBar",
  STATUS_BAR_CREDITS: "StatusBar-credits",
  STATUS_BAR_LABEL: "StatusBar-label",
  STATUS_BAR_VALUE: "StatusBar-value",
  STATUS_BAR_CLOSED: "StatusBar-closed",
  STATUS_BAR_ERROR: "StatusBar-error",
  CONTROLS: "Controls",
  CONTROLS_BUTTON: "Controls-button",
  CONTROLS_BUTTON_PRIMARY: "Controls-button--primary",
  CONTROLS_BUTTON_SECONDARY: "Controls-button--secondary",
  CONTROLS_BUTTON_ACCENT: "Controls-button--accent",
  SLOT_REELS: "SlotReels",
  SLOT_REEL: "SlotReel",
  SLOT_REEL_SPINNING: "SlotReel--spinning",
  SLOT_REEL_PLACEHOLDER: "SlotReel-placeholder",
  SLOT_REEL_IMAGE: "SlotReel-image",
} as const;

export const REEL_COUNT = 3;
