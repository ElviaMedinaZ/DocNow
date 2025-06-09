// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importación de Componetes

//Admin
import PantallaAdminPrincipal from './Componetes/Admin/PantallaAdminPrincipal';
import PantallaAdminRegistro from './Componetes/Admin/PantallaAdminRegistro';
import PantallaMultiLista from './Componetes/Admin/PantallaMultiLista';
import PantallaReportes from './Componetes/Admin/PantallaReportes';
import PantallaRespaldos from './Componetes/Admin/PantallaRespaldos';

//Doctor
import PantallaHomeDoctor from './Componetes/Doctores/PantallaHomeDoctor';//pantalla principal
import PantallaEditarDoctor from './Componetes/Doctores/PantallaEditarDoctor';//pantalla para edicion
import PantallaNotaConsulta from './Componetes/Doctores/PantallaNotaConsulta';//pantalla para notas
import PantallaRegistroDoctor from './Componetes/Doctores/PantallaRegistroDoctores';//pantalla para registrar
import PantallaPerfilDoctor from './Componetes/Doctores/PantallaPerfilDoctor';//pantalla para perfil
import PantallaNotificacionesDoctor from './Componetes/Doctores/PantallaNotificacionesDoctor';//pantalla para notificaciones
import PantallaPacieteDoctores from './Componetes/Doctores/PantallaPacienteDoctor';//pantalla para pacientes
import PantallaNotas from './Componetes/Doctores/PantallaNotas';//pantalla para ver notas 

//usuarios
import PantallaEvaluacion from './Componetes/Usuario/PantallaEvaluacion';
import PantallaPerfilUsiario from './Componetes/Usuario/PantallaPerfilUsuario';

import PantallaHomeUsuario from './Componetes/Usuario/PantallaHomeUsuario';
import PantallaNotificaciones from './Componetes/Usuario/PantallaNotificaciones';
import PantallaCitas from './Componetes/Usuario/PantallaCitasUsuario';
import PantallaConfirmarCita from './Componetes/Usuario/PantallaConfirmarCita';
import PantallaRegistro from './Componetes/Usuario/PantallaRegistro';
import PantallaOlvideContrasena from './Componetes/Usuario/PantallaOlvideContrasena';
import PantallaVerificarCodigo from './Componetes/Usuario/PantallaVerificarCodigo';
import PantallaRestablecerContrasena from './Componetes/Usuario/PantallaRestablecerContrasena';
import PantallaEditarRegistro from './Componetes/Usuario/PantallaEditarRegistro';

//Multi
import PantallaInicioSesion from './Componetes/Otros/PantallaInicioSesion';
import PantallaRegistroExitoso from './Componetes/Otros/PantallaRegistroExistoso';
import PantallaAjustes from './Componetes/Otros/PantallaAjustes';
import VerificacionCompletada from './Componetes/Otros/VerificacionCompletada';


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
          name='MultiList'
          component={PantallaMultiLista}
          options={{headerShown: false}}
        />
        
        <Stack.Screen
          name='PantallaExitoso'
          component={PantallaRegistroExitoso}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name='PantallaAjustes'
          component={PantallaAjustes}
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

        
        <Stack.Screen 
          name='MenuRespaldos'
          component={PantallaRespaldos}
          options={{headerShown: false}}
        />

        
        <Stack.Screen 
          name='MenuReportes'
          component={PantallaReportes}
          options={{headerShown: false}}
        />

        {/*Doctor*/}

        <Stack.Screen
          name="PantallaHomeDoctor"
          component={PantallaHomeDoctor}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="EditarDoctor"
          component={PantallaEditarDoctor}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="NotaConsulta"
          component={PantallaNotaConsulta}
          options={{ headerShown: false }}
        />

         <Stack.Screen
            name="PantallaNotas"
            component={PantallaNotas}
            options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PerfilDoctor"
          component={PantallaPerfilDoctor}
          options={{ headerShown: false }}
        />


        <Stack.Screen
          name='RegistroDoctor'
          component={PantallaRegistroDoctor}
          options={{headerShown: false}}        
        />

        <Stack.Screen 
          name='PacienteDoctor'
          component={PantallaPacieteDoctores}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name='NotificacionesDoctores'
          component={PantallaNotificacionesDoctor}
          options={{headerShown: false}}
        />


        {/*Usuario*/}
        <Stack.Screen
          name="MenuPaciente"
          component={PantallaHomeUsuario}
          options={{headerShown: false}}
        />

        <Stack.Screen 
          name='PantallaPerfilUsuario'
          component={PantallaPerfilUsiario}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Registro"
          component={PantallaRegistro}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='EditarRegistro'
          component={PantallaEditarRegistro}
          options={{headerShown: false}}
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
          name="PantallaCitas"
          component={PantallaCitas}
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="PantallaConfirmarCita"
          component={PantallaConfirmarCita} 
          options={{ headerShown: false }}
        />

        <Stack.Screen
         name="PantallaEvaluacion" 
         component={PantallaEvaluacion} 
         options={{ headerShown: false }}/>


        <Stack.Screen
          name="PantallaNotificaciones"
          component={PantallaNotificaciones}
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
