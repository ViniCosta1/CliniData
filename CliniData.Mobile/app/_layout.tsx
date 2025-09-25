import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={
      { headerShown: false }
    }>
      {/* Remova ou ajuste a linha abaixo se não quiser index como rota global */}
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
