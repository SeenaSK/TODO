import React, { useLayoutEffect, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Task from "../components/Task";
import LevelBar from "../components/LevelBar";
import Info from "../components/Info";

const HomeScreen = () => {
  const { user } = React.useContext(AuthContext);

  // From Tut:
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task]);
    setTask(null);
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    setXp(xp + 20);

    if (xp === 80) {
      setLevel(level + 1);
      setXp(0);
    }
  };


  return (
    <View className="flex-1 bg-gray-200">
      {/* Today's task */}
      <View className="pt-10 px-5">
        <LevelBar level={user.level} xp={user.xp} />
        <Info />
        <Text className="text-2xl font-bold text-center">Today's Tasks</Text>
        <View className="mt-8">
          {/* This is where the tasks will go */}
          {taskItems.map((item, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={item} xp="20" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Write a Task */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="absolute bottom-14 flex-row justify-around items-center w-full"
      >
        <TextInput
          className="bg-white w-60 py-4 px-4 rounded-full border-zinc-300 border"
          placeholder={"Write a Task"}
          onChangeText={(text) => (text === null ? console.log("error") : setTask(text))}
          value={task}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View className="w-16 h-16 bg-white rounded-full justify-center items-center border-zinc-300 border">
            <Text>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HomeScreen;
