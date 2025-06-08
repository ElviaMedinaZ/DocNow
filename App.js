// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importación de Componentes

//Admin
import PantallaAdminPrincipal from './componentes/Admin/PantallaAdminPrincipal';
import PantallaAdminRegistro from './componentes/Admin/PantallaAdminRegistro';
import PantallaMultiLista from './componentes/Admin/PantallaMultiLista';
import PantallaReportes from './componentes/Admin/PantallaReportes';
import PantallaRespaldos from './componentes/Admin/PantallaRespaldos';

//Doctor
import PantallaHomeDoctor from './componentes/Doctores/PantallaHomeDoctor';//pantalla principal
import PantallaEditarDoctor from './componentes/Doctores/PantallaEditarDoctor';//pantalla para edicion
import PantallaNotaConsulta from './componentes/Doctores/PantallaNotaConsulta';//pantalla para notas
import PantallaRegistroDoctor from './componentes/Doctores/PantallaRegistroDoctores';//pantalla para registrar
import PantallaPerfilDoctor from './componentes/Doctores/PantallaPerfilDoctor';//pantalla para perfil
import PantallaNotificacionesDoctor from './componentes/Doctores/PantallaNotificacionesDoctor';//pantalla para notificaciones
import PantallaPacieteDoctores from './componentes/Doctores/PantallaPacienteDoctor';//pantalla para pacientes
import PantallaNotas from './componentes/Doctores/PantallaNotas';//pantalla para ver notas 

//usuarios
import PantallaPerfilUsiario from './componentes/Usuario/PantallaPerfilUsuario';
import PantallaInicioSesion from './componentes/PantallaInicioSesion';
import PantallaHomeUsuario from './componentes/Usuario/PantallaHomeUsuario'
import PantallaRegistro from './componentes/PantallaRegistro';
import PantallaOlvideContrasena from './componentes/PantallaOlvideContrasena';
import PantallaVerificarCodigo from './componentes/PantallaVerificarCodigo';
import VerificacionCompletada from './componentes/VerificacionCompletada';
import PantallaRestablecerContrasena from './componentes/PantallaRestablecerContrasena';
import PantallaEditarRegistro from './componentes/Usuario/PantallaEditarRegistro';

//Multi
import PantallaRegistroExitoso from './componentes/PantallaRegistroExistoso';
import PantallaAjustes from './componentes/PantallaAjustes';



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
