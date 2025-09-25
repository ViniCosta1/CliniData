import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';



const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
	home: 'home-outline',
	exames: 'medkit-outline',
	logout: 'log-out-outline',
};

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => (
					<Ionicons
						name={TAB_ICONS[route.name] ?? 'ellipse-outline'}
						size={size ?? 24}
						color={color}
					/>
				),
				tabBarActiveTintColor: '#1976d2',
				tabBarInactiveTintColor: '#888',
			})}
		>
			<Tabs.Screen name="home" options={{ title: 'Home' }} />
			<Tabs.Screen name="exames" options={{ title: 'Exames' }} />
			<Tabs.Screen name="logout" options={{ title: 'Logout' }} />

			{/* Rota de detalhes existe para navegação, mas não deve aparecer no Tab Bar */}
			<Tabs.Screen
				name="detalhes"
				options={{
					title: 'Detalhes',
					// remove o botão da tab bar
					tabBarButton: () => null,
				}}
			/>
		</Tabs>
	);
}
