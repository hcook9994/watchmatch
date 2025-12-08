import { TouchableOpacity, View, StyleSheet } from "react-native";

type Props = {
  isSelected: boolean;
  onPress: () => void;
};

const RadioButton = (props: Props) => {
  const { isSelected, onPress } = props;

  return (
    <TouchableOpacity style={styles.outer} onPress={onPress}>
      {isSelected && <View style={styles.inner} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outer: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
});

export { RadioButton };
