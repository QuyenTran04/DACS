import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#f5f5f5', // light background color
  },
  title: {
    fontSize: 29,
    marginBottom: 20,
    textAlign: "center",
    color: "#007BFF", // Reuse primary color
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 20, // Increase padding for ease of use
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
    alignItems: "center",
    marginTop: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  forgotPassword: {
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 10,
  },
  signUp: {
    textAlign: "center",
    color: "#007BFF",
    marginTop: 20, // Add top margin for better spacing
  },
});

export default styles;