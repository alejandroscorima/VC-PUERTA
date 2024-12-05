<?php
// Configuración de conexión a la base de datos
$contraseña = "Oscorpsvr";
$usuario = "root";
$nombre_base_de_datos = "vc_clients";

try {
    // Crear una nueva instancia de PDO para la conexión a la base de datos
    return new PDO(
        'mysql:host=localhost;dbname=' . $nombre_base_de_datos,
        $usuario,
        $contraseña,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Habilitar el modo de errores de excepción
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // Configurar el modo de obtención predeterminado
        ]
    );
} catch (PDOException $e) {
    // Manejar errores en la conexión
    echo "Error al conectar con la base de datos: " . $e->getMessage();
    exit; // Terminar el script en caso de error
}