// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importación de Componentes

//Admin
import PantallaAdminPrincipal from './Componentes/Otros/PantallaInicioSesion';
import PantallaAdminRegistro from './Componentes/Admin/PantallaAdminRegistro';
import PantallaMultiLista from './Componentes/Admin/PantallaMultiLista';
import PantallaReportes from './Componentes/Admin/PantallaReportes';
import PantallaRespaldos from './Componentes/Admin/PantallaRespaldos';

//Doctor
import PantallaHomeDoctor from './Componentes/Doctores/PantallaHomeDoctor';//pantalla principal
import PantallaEditarDoctor from './Componentes/Doctores/PantallaEditarDoctor';//pantalla para edicion
import PantallaNotaConsulta from './Componentes/Doctores/PantallaNotaConsulta';//pantalla para notas
import PantallaRegistroDoctor from './Componentes/Doctores/PantallaRegistroDoctores';//pantalla para registrar
import PantallaPerfilDoctor from './Componentes/Doctores/PantallaPerfilDoctor';//pantalla para perfil
import PantallaNotificacionesDoctor from './Componentes/Doctores/PantallaNotificacionesDoctor';//pantalla para notificaciones
import PantallaPacieteDoctores from './Componentes/Doctores/PantallaPacienteDoctor';//pantalla para pacientes
import PantallaNotas from './Componentes/Doctores/PantallaNotas';//pantalla para ver notas 

//usuarios
import PantallaEvaluacion from './Componentes/Usuario/PantallaEvaluacion';
import PantallaPerfilUsiario from './Componentes/Usuario/PantallaPerfilUsuario';
import PantallaServicios from './Componentes/Usuario/PantallaServicios';
import PanrallaVerDoctor from './Componentes/Usuario/PantallaVerDoctor';
import PantallaEditarCita from './Componentes/Usuario/PantallaEditarCita';
import PantallaHomeUsuario from './Componentes/Usuario/PantallaHomeUsuario';
import PantallaNotificaciones from './Componentes/Usuario/PantallaNotificaciones';
import PantallaCitas from './Componentes/Usuario/PantallaCitasUsuario';
import PantallaConfirmarCita from './Componentes/Usuario/PantallaConfirmarCita';
import PantallaRegistro from './Componentes/Usuario/PantallaRegistro';
import PantallaOlvideContrasena from './Componentes/Usuario/PantallaOlvideContrasena';
import PantallaVerificarCodigo from './Componentes/Usuario/PantallaVerificarCodigo';
import PantallaRestablecerContrasena from './Componentes/Usuario/PantallaRestablecerContrasena';
import PantallaEditarRegistro from './Componentes/Usuario/PantallaEditarRegistro';

//Multi
import PantallaInicioSesion from './Componentes/Otros/PantallaInicioSesion';
import PantallaRegistroExitoso from './Componentes/Otros/PantallaRegistroExistoso';
import PantallaAjustes from './Componentes/Otros/PantallaAjustes';
import VerificacionCompletada from './Componentes/Otros/VerificacionCompletada';


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
          name="PantallaServicios"
          component={PantallaServicios}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='PantallaVerDoctor'
          component={PanrallaVerDoctor}
          options={{headerShown: false}}
        />

        <Stack.Screen 
          name='PantallaEditarCita'
          component={PantallaEditarCita}
          options={{headerShown: false}}
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
