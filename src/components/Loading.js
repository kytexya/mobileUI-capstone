import React, { useState } from "react";
import { View, StyleSheet, Image, Button } from "react-native";

export const Loading = ({ show = false }) => {
  return (
    show ? (
      <View style={styles.overlay} pointerEvents="box-only">
        <Image
          source={require("../assets/loading.gif")}
          style={styles.loadingGif}
        />
      </View>
    ) : null
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  loadingGif: {
    width: 100,
    height: 100,
  },
});
