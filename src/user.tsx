import { Stack, router } from "expo-router";
import { Button, Text, Image, StyleSheet } from 'react-native';
import { useState } from 'react';

function LogoTitle() {
  return (
    <Image style={styles.image} source={require ('../assets/images/icon.png')} />
  );
}

export default function Home() {
  

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => (
            <Button
              onPress={() => router.replace("/login")}
              title="Đăng nhập"
            />
          ),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
