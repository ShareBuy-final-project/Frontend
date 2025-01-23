const COLORS = {
    primary: "#312651",
    secondary: "#444262",
    tertiary: "#FF7754",

    red: "red",
    green: "green",
  
    gray: "#83829A",
    gray2: "#C1C0C8",
  
    white: "#F3F4F8",
    lightWhite: "#FAFAFC",

    black: "black",

    glowingYeloow: "#D7F205",
    lightYellow : "#EBF3B0",
    darkYellow: "#B8C200",

    purple: "#7552F2",
    lightPurple: "#C8BCF2",
    darkPurple: "#977DF2",

    success: "#28a745",  // Bright green
    danger: "#dc3545",   // Bright red
  };
  
  const FONT = {
    regular: "DMRegular",
    medium: "DMMedium",
    bold: "DMBold",
    arial: "Arial",
    arialBold: "Arial-BoldMT",
    arialItalic: "Arial-ItalicMT",
    arialBoldItalic: "Arial-BoldItalicMT",
  };
  
  const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32,
  };
  
  const SHADOWS = {
    small: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,
      elevation: 5,
    },
  };
  
  export { COLORS, FONT, SIZES, SHADOWS };