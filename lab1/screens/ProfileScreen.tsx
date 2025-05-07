import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import LabelInput from "../components/LabelInput";

export default function ProfileScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    lastName: "",
    firstName: "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    console.log("Submitted:", form);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registration</Text>

      <LabelInput
        label="Email"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
      />
      <LabelInput
        label="Password"
        value={form.password}
        secureTextEntry
        onChangeText={(v) => handleChange("password", v)}
      />
      <LabelInput
        label="Password"
        value={form.confirmPassword}
        secureTextEntry
        onChangeText={(v) => handleChange("confirmPassword", v)}
      />
      <LabelInput
        label="Last name"
        value={form.lastName}
        onChangeText={(v) => handleChange("lastName", v)}
      />
      <LabelInput
        label="First name"
        value={form.firstName}
        onChangeText={(v) => handleChange("firstName", v)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
