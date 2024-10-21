import { StyleSheet } from "react-native";
import { colors } from "./colorsActivity";

export default StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
    flexDirection: 'row',

    position: 'absolute',
    top: 0,
    width: '109%',
    zIndex: 10,
  },
  headerText: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.palette.primary200,
    borderRadius: 30,
    bottom: 20,
    padding: 15,  
    position: "absolute",
    right: 20,
  },
  addCommentSection:{
    marginTop: 15,
  },
  inputComent: {
    borderBottomWidth: 1, // Mengganti outline border dengan garis bawah
    borderBottomColor: '#ccc', // Warna garis bawah
    paddingVertical: 10, // Spasi vertikal di dalam TextInput
    paddingHorizontal: 5, // Spasi horizontal di dalam TextInput
    fontSize: 16, // Ukuran font yang sesuai
  },
  boldText: {
    fontWeight: "bold",
  },
  textInput: {
    borderRadius: 10,
    shadowColor: colors.palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Untuk Android
  },
  addPhotoContainer: {
    alignItems: "center", 
    borderColor: colors.border,
    backgroundColor: colors.palette.white,
    borderRadius: 10,  
    flexDirection: "column",  
    justifyContent: "center",   
    marginBottom: 10, 
    marginTop: 10, 
    padding: 10,          
    width: "100%",            
  },
  box: {
  backgroundColor: colors.palette.background,
  borderRadius: 10,
  elevation: 2,
  marginBottom: 15,
  padding: 15,
  shadowColor: colors.palette.shadow,
  shadowOpacity: 0.1,
  shadowRadius: 5,
  
},
button: {
  backgroundColor: colors.palette.primary200,
  borderRadius: 10,
  fontSize: 12,
  marginLeft: 'auto',          
  paddingHorizontal: 8,             
  paddingVertical: 5,                
},
buttonSubmit:{
  flex: 1,
  padding: 12,
  marginHorizontal: 5,
  borderRadius: 25,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Memisahkan kedua tombol
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: colors.palette.neutral200,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.palette.white,
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "column",
    padding: 20,
  },
  commentItem: {
    borderBottomColor: colors.palette.lightGrey,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  commentText: {
    fontSize: 14,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    
  },
  description: {
    color: colors.palette.black,
    fontSize: 16,                // Keep the original size or adjust as needed
    fontWeight: '600',           // Semi-bold
},
  icon: {
    color: colors.palette.primary,
    marginLeft: 5,
    marginRight: 5,
    position: "absolute",
    right: 0,
    top: 0,
  },
  iconRight: {
    marginLeft: 10,  // Adds space between the text and the icon
  },
  imageStyle: {
    height: 200,
    marginBottom: 10,
    resizeMode: "cover",
    width: 200,
  },
  input: {
  backgroundColor: colors.palette.background,
  borderRadius: 10,
  elevation: 2,
  marginBottom: 15,padding: 15,
  shadowColor: colors.palette.shadow,
  shadowOpacity: 0.1,
  shadowRadius: 5
  },
  itemText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 5,
  },
  jobIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  judulKegiatan: {         
    fontSize: 14,   opacity: 0.5,             
},
  blurContent :{
    backgroundColor: colors.modalBackground,
    borderRadius: 10,
    flex: 1,
   
  },

  modalContent: {
  backgroundColor: colors.modalBackground,
  borderRadius: 10,
  flex: 1,
  padding: 20,
},
  modalDescription: {
    fontSize: 16,
  },
  modalRow: {
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 10,
},
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
  },
  noPhotoText: {
    marginTop: 10,
    color: colors.palette.grey,
  },
  opacityText: {
    opacity: 0.7,
  },
  photoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  photoSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedButton: {
    backgroundColor: colors.palette.primary100,
  },
  statusButton: {
    backgroundColor: colors.palette.neutral100,
    borderRadius: 20,
    padding: 10,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusText: {
    color: colors.text,
  },
  timeIcon: {
    marginRight: 5,  
    color : colors.palette.primary200            // Space between icon and text
},
timePickerContainer: {
  backgroundColor: colors.palette.background,
  borderColor: colors.border,
  borderRadius: 10,
  elevation: 2,
  height: 50,
  justifyContent: 'center',
  marginBottom: 15,padding: 15,
  shadowColor: colors.palette.shadow,
  shadowOpacity: 0.1,
  shadowRadius: 5
},
timePickerText: {
  color: colors.palette.grey,
  fontSize: 16,
},
  timeRow: {
    alignItems: 'center',       
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,             
},
  timeText: {
    color: colors.palette.grey,
    fontSize: 14,
    marginLeft: 5,
  },
  timestamp: {
    color: colors.palette.grey,
    fontSize: 12,
    marginTop: 5,
  },
  title: {
    fontSize: 20,

  },
  touchable: {
    letterSpacing : 10,
    padding : 10
  },
  locationInputContainer: {
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
},
input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 18,
  paddingHorizontal: 15,
  paddingVertical: 10,
  marginBottom: 10,
  backgroundColor: '#f9f9f9',
},
buttonContainerFloating: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

  iconCenter: {
    alignItems: 'center', // Centers content horizontally
  },
});