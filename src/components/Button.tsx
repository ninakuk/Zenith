import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { forwardRef, useMemo } from 'react';
import { useTheme } from '@react-navigation/native';

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, ...pressableProps }, ref) => {
    const colors = useTheme().colors;
    const styles = useMemo(() => makeStyles(colors), [colors]);
    return (
      <Pressable ref={ref} {...pressableProps} style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    );
  }
);

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    padding: 14,
    alignItems: 'center',
    borderRadius: 100,
    marginVertical: 5,
    //width: 150,
    flex:1,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});

export default Button;