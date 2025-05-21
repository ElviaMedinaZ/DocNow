// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importación de Componentes

//Admin

import PantallaAdminPrincipal from './componentes/Admin/PantallaAdminPrincipal';
import PantallaAdminRegistro from './componentes/Admin/PantallaAdminRegistro';
import PantallaMultiLista from './componentes/Admin/PantallaMultiLista';

//Doctor

import PantallaRegistroDoctor from './componentes/Doctores/PantallaRegistroDoctores';

//usuarios
import PantallaInicioSesion from './componentes/PantallaInicioSesion';
import PantallaPrincipal from './componentes/PantallaPrincipal';
import PantallaRegistro from './componentes/PantallaRegistro';
import PantallaOlvideContrasena from './componentes/PantallaOlvideContrasena';
import PantallaVerificarCodigo from './componentes/PantallaVerificarCodigo';
import VerificacionCompletada from './componentes/VerificacionCompletada';
import PantallaRestablecerContrasena from './componentes/PantallaRestablecerContrasena';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InicioSesion">
        <Stack.Screen
          name="InicioSesion"
          component={PantallaInicioSesion}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name='Multilist'
          component={PantallaMultiLista}
          options={{headerShown: false}}
        />


        {/*Admin*/}

        <Stack.Screen
          name="MenuAdmin"
          component={PantallaAdminPrincipal}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name='RegistroAdmin'
          component={PantallaAdminRegistro}
          options={{headerShown: false}}
        />

        


        {/*Doctor*/}

        <Stack.Screen
          name='RegistroDoctor'
          component={PantallaRegistroDoctor}
          options={{headerShown: false}}        
        />



        {/*Usuario*/}
        <Stack.Screen
          name="MenuPrincipal"
          component={PantallaPrincipal}
          options={{ title: 'Menú Principal' }}
        />
        <Stack.Screen
          name="Registro"
          component={PantallaRegistro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RestablecerContrasena"
          component={PantallaRestablecerContrasena}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OlvideContrasena"
          component={PantallaOlvideContrasena}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerificarCodigo"
          component={PantallaVerificarCodigo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerificacionCompletada"
          component={VerificacionCompletada}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
