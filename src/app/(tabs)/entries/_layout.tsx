import { Stack } from "expo-router";

export default function EntriesStack() {
    return (
        <Stack>
            <Stack.Screen
                name="home"
                options={{
                    headerShown: false,
                }}
            />

        </Stack>
    );
};