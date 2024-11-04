import { COLORS } from "@/src/constants/Colors";
import { useAvatar } from "@/src/context/AvatarContext";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function EntriesStack() {
    const colorScheme = useColorScheme();
  const colors = useTheme().colors;
  const router = useRouter();
  const { name } = useAvatar();


    return (
        <Stack>
            <Stack.Screen
                name="home"
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: COLORS.White,
                        
                    },
                    headerRight: () => (
                        <Pressable onPress={() =>  router.push('/overview')} >
                            <Feather name="calendar" size={28} color={colors.text} style={{ marginRight: 15 }} />
                        </Pressable>
                    ),
                }}
            />

        </Stack>
    );
};