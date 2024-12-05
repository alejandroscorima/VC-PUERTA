<?php
// Permitir solicitudes de cualquier origen (modificar en producción para mayor seguridad)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Incluir conexión a la base de datos
$bd = include_once "vc_db.php";

// Validación y sanitización del parámetro 'license_plate'
$license_plate=$_GET['license_plate'];
if (empty($license_plate)) {
    echo json_encode(['error' => 'Faltan parámetros requeridos.']);
    exit();
}

try {
    $sentencia = $bd->prepare("SELECT 
        v.vehicle_id,
        v.license_plate,
        v.type_vehicle,
        v.house_id,
        v.status_validated,
        v.status_reason,
        v.status_system,
        v.category_entry,
        h.block_house,
        h.lot,
        h.apartment
    FROM vehicles AS v
    LEFT JOIN houses AS h ON v.house_id = h.house_id
    WHERE v.license_plate = :license_plate");

    // Vincula el parámetro
    $sentencia->bindParam(':license_plate', $license_plate);

    // Ejecutar la consulta
    $sentencia->execute();
    
    // Obtener los resultados como un arreglo de objetos
    $vehicle = $sentencia->fetch(PDO::FETCH_OBJ);
    
    // Comprobar si se encontraron resultados
    if ($vehicle) {
        // Devolver los resultados en formato JSON
        echo json_encode($vehicle);
    } else {
        // Si no se encuentran resultados, se devuelve un mensaje de error
        echo json_encode([
            "error" => true,
            "message" => "vehicle not found"
        ]);
    }

    // Cerrar la sentencia
    $sentencia = null;

} catch (Exception $e) {
    // Registrar el error en un archivo de log
    error_log($e->getMessage(), 3, '/var/log/php_errors.log');

    // Devolver un mensaje genérico
    echo json_encode([
        "error" => true,
        "message" => "An error occurred. Please try again later.",
        "server_error" => $e->getMessage()
    ]);
}

?>
