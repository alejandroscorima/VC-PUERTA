<?php
// Permitir solicitudes de cualquier origen (modificar en producción para mayor seguridad)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$bd = include_once "vc_db.php";

$license_plate=$_GET['license_plate'];

if (empty($license_plate)) {
    echo json_encode(['error' => 'Faltan parámetros requeridos.']);
    exit();
}

$sql="
SELECT 
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
    WHERE v.license_plate = :license_plate
";

try {
    $sentencia = $bd->prepare($sql);
    $sentencia->bindParam(':license_plate', $license_plate);
    $sentencia->execute();
    
    // Obtener los resultados como un arreglo de objetos
    $vehicle = $sentencia->fetchObject();
    
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

} catch (PDOException $e) {
    echo json_encode(['error' => 'Error al consultar la base de datos.', 'details' => $e->getMessage()]);
}

?>
