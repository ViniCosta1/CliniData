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
				headerShown: false,
				tabBarShowLabel: false,
				tabBarActiveTintColor: '#1976d2',
				tabBarInactiveTintColor: '#888',
			})}
		>
			<Tabs.Screen name="home"/>
			<Tabs.Screen name="exames" />
			<Tabs.Screen name="logout" />
			<Tabs.Screen
				name="detalhes"
				options={{
					title: 'Detalhes',
					tabBarButton: () => null,
				}}
			/>
			{/* Certifique-se que NÃO existe index.tsx ou CadastroExameScreen.tsx em app/tabs/ */}
			{/* Mova esses arquivos para app/screens/ ou exclua se não forem necessários */}
		</Tabs>
	);
}

