import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Formik } from "formik";
import { API_URL2 } from "@env";
import { AuthContext } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setIsLoggedIn, user, setUser } = React.useContext(AuthContext);

  const url = `${API_URL2}/user/login`;

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values) => {
        console.log("(Login) email: " + values.email);
        console.log("(Login) pw: " + values.password);
        console.log("(Login) userId before success: " + user._id);
        AsyncStorage.setItem("password", values.password);

        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        })
          .then((data) => data.json())
          .then((json) => {
            if (json.success === true) {
              try {
                alert("Successfully logged in... redirecting to homepage");
                setIsLoggedIn(true);
                // Storing whole user object in authContext on log in
                setUser(json.user);
                console.log("(Login) userId after success: " + json.user._id);

                navigation.navigate("Home");
              } catch (error) {
                console.log(error);
              }
            } else {
              console.log("Login failed: " + json.success);
            }
          })
          .catch((error) => console.log(error));
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <KeyboardAvoidingView className="flex-1 items-center justify-center">
          <View className="w-50">
            <TextInput
              placeholder="Email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              className="bg-white w-60 p-5 text-center rounded-lg m-5"
            />
            <TextInput
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              className="bg-white w-60 p-5 text-center rounded-lg m-5"
              secureTextEntry
            />
          </View>
          <View className="w-60 items-center justify-center mt-10">
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-500 items-center w-full py-4 rounded-lg"
            >
              <Text className="text-white font-semibold text-base">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              className="bg-white items-center w-full mt-1 py-4 rounded-lg border-blue-500 border-2"
            >
              <Text className="text-blue-500 font-semibold text-base">Not yet registered? </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
};

export default LoginScreen;
