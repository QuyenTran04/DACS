import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    //backgroundColor: 'blue',
  },
  title: {
    fontSize: 29,
    marginBottom: 20,
    textAlign: "center",
    color: "blue",
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  optionsContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  optionText: {
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    backgroundColor: "#4267B2",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  socialButtonText: {
    color: "white",
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 10,
  },
  signUp: {
    textAlign: "center",
    color: "#007BFF",
  },
});

export default styles;
