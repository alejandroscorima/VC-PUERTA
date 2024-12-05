<?php

// Habilitar cabeceras necesarias para CORS y JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    // Incluir el archivo de conexión a la base de datos
    $bd = include_once "vc_db.php";

    // Preparar la consulta para obtener los puntos de acceso activos
    $query = "SELECT ap_id, ap_location, ap_description, client_id, status_system, image_url 
              FROM access_points 
              WHERE status_system = :status";
    $sentencia = $bd->prepare($query);

    // Parámetro de consulta
    $status = 'ACTIVO';
    $sentencia->bindParam(':status', $status, PDO::PARAM_STR);

    // Ejecutar la consulta
    $sentencia->execute();

    // Obtener los resultados
    $ap = $sentencia->fetchAll(PDO::FETCH_OBJ);

    // Verificar si se encontraron datos
    if ($ap) {
        echo json_encode($ap, JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No se encontraron puntos de acceso activos."
        ], JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    // Manejo de errores en caso de que falle la conexión o consulta
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error en el servidor: " . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}

?>
