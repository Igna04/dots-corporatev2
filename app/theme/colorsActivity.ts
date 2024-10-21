const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#C9E4FF",
  primary200: "#87CEEB",
  primary300: "#64C2A6",
  primary400: "#45B3FA",
  primary500: "#2196F3",
  primary600: "#1A73E8",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",

  background: "#FFFFFF", // Custom background color
  text: "#333333", // Custom text color
  white: "#FFFFFF",
  hitam: "#000000",
  blue: "#7CB9E8", // Custom blue for specific icon uses
  warnaikon: "#00CED1", // Custom turquoise color for icons
  semiTransparentWhite: "rgba(255, 255, 255, 0.8)", 
  saveButton: "#4CAF50", // Warna untuk tombol Simpan (hijau)
  cancelButton: "#A9A9A9", // Warna untuk tombol Tutup (abu-abu)




  primary: '#3FA2F6', 
  secondary: '#3FA2F6', // Aqua
  danger: '#b00020', // Merah
  success: '#03dac5', 
  black: '#000000',
  grey: '#737373',  
  lightGrey: '#d3d3d3',
  shadow : "#000"
} as const;

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  semiTransparentWhite: "rgba(255, 255, 255, 0.8)", 
  text: palette.neutral800, // Darker neutral for main text
  textDim: palette.neutral600, // Dimmed text color
  background: palette.neutral100, // Light neutral background
  border: palette.neutral400, // For borders or lines
  tint: palette.primary500, // Main accent/tint color
  separator: palette.neutral300,
  modalBackground: palette.semiTransparentWhite,
  error: palette.angry500, // Strong red for errors
  errorBackground: palette.angry100,
  icon: palette.warnaikon,
  iconBlue: palette.blue,
  saveButton: palette.saveButton, // Tambahkan warna simpan
  cancelButton: palette.cancelButton, // Tambahkan warna tutup
};
