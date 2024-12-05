<?php

// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Obtener el valor del parámetro 'accessPoint_id'
$accessPoint_id = isset($_GET['accessPoint_id']) ? $_GET['accessPoint_id'] : null;

// Validar que 'accessPoint_id' no esté vacío y sea un número entero
if (!$accessPoint_id || !is_numeric($accessPoint_id)) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Invalid accessPoint_id"]);
    exit;
}

try {
    // Conectar a la base de datos
    $bd = include_once "vc_db.php";

    // Preparar y ejecutar la consulta
    $sentencia = $bd->prepare("SELECT ap_id, ap_location, ap_description, client_id, status_system, image_url 
                               FROM access_points 
                               WHERE ap_id = :accessPoint_id");
    $sentencia->bindParam(':accessPoint_id', $accessPoint_id, PDO::PARAM_INT);
    $sentencia->execute();

    // Obtener el resultado
    $ap = $sentencia->fetch(PDO::FETCH_OBJ);

    // Verificar si se encontró un resultado
    if ($ap) {
        echo json_encode($ap);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["error" => "Access point not found"]);
    }
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "An error occurred", "details" => $e->getMessage()]);
}

?>