<?php
// Configuración para errores y CORS
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');  // Permite cualquier origen
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    exit("Solo acepto peticiones POST");
}

$jsonVisitor = json_decode(file_get_contents("php://input"));
if (!$jsonVisitor) {
    http_response_code(400); // Solicitud incorrecta
    exit("No hay datos");
}

if (empty($jsonVisitor->date_entry) || empty($jsonVisitor->ap_id)) {
    http_response_code(400);
    exit("Faltan datos obligatorios.");
}

// Conexión a la base de datos
$bd = include_once "vc_db.php";

if ($jsonVisitor->log_type == 'access_logs') {
    // Inserción en access_logs
    $sql = "INSERT INTO access_logs(
        user_id,
        vehicle_id,
        entry_time,
        ap_id,
        status_validated,
        operario_id
    ) VALUES (?, ?, ?, ?, ?, ?)";
    $valuesVisitor = [
        $jsonVisitor->visitor_id ?? null,
        $jsonVisitor->vehicle_id ?? null,
        $jsonVisitor->date_entry,
        $jsonVisitor->ap_id,
        $jsonVisitor->status_validated,
        $jsonVisitor->operator_id
    ];
} elseif ($jsonVisitor->log_type == 'temporary_access_logs') {
    $sql = "INSERT INTO temporary_access_logs (
        temp_visit_id,
        temp_entry_time,
        temp_exit_time,
        ap_id,
        status_validated,
        house_id,
        operario_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $valuesVisitor = [
        $jsonVisitor->visitor_id ?? null,
        $jsonVisitor->date_entry,
        $jsonVisitor->date_exit ?? null,
        $jsonVisitor->ap_id,
        $jsonVisitor->status_validated,
        $jsonVisitor->house_id ?? null,
        $jsonVisitor->operator_id
    ];
}

try {
    if ($sql) {
        $sentencia = $bd->prepare($sql);
        $resultado = $sentencia->execute($valuesVisitor);

        if ($resultado) {
            echo json_encode(["success" => true, "message" => "Visitante creado correctamente."]);
        } else {
            throw new Exception("Error al ejecutar la consulta sql.");
        }
    } else {
        throw new Exception("La consulta principal no está definida.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
