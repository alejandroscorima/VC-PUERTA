<?php
// Configuración para errores y CORS
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');  // Permite cualquier origen
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Content-Type: application/json");

// Verificar que la solicitud sea POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["error" => "Solo acepto peticiones POST"]);
    exit;
}

// Obtener los datos JSON del cuerpo de la solicitud
$jsonVisitor = json_decode(file_get_contents("php://input"));
if (!$jsonVisitor) {
    http_response_code(400); // Solicitud incorrecta
    echo json_encode(["error" => "No hay datos o el formato es incorrecto"]);
    exit;
}

// Conexión a la base de datos
$bd = include_once "vc_db.php";

// Inicializar variables
$sql = null;
$valuesVisitor = [];
$sql1 = null;
$values = [];

if ($jsonVisitor->log_type == 'access_logs') {
    if (empty($jsonVisitor->visitor_id)) {
        if ($jsonVisitor->type == 'PERSONA') {
            $sql1 = "INSERT INTO users(
                type_doc,
                doc_number,
                role_system,
                username_system,
                status_validated
            ) VALUES (?,?,?,?,?)";
            if (empty($jsonVisitor->username_system)) {
                $jsonVisitor->username_system = 'USER_' . uniqid(); // Genera un ID único como 'user_123abc'
            }
            $values = [
                $jsonVisitor->type_doc ?? null,
                $jsonVisitor->doc_number ?? null,
                $jsonVisitor->role_system ?? null,
                $jsonVisitor->username_system ?? null
                $jsonVisitor->status_validated
            ];
        } elseif ($jsonVisitor->type == 'VEHICULO') {
            $sql1 = "INSERT INTO vehicles(
                license_plate,
                status_validated
            ) VALUES (?,?)";
            $values = [
                $jsonVisitor->license_plate ?? null,
                $jsonVisitor->status_validated,
            ];
        }
    }

    // Inserción en access_logs
    $sql = "INSERT INTO access_logs (
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
    // Ejecutar la primera consulta, si existe (insertar usuario o vehículo)
    if ($sql1) {
        $sentencia1 = $bd->prepare($sql1);
        $resultado1 = $sentencia1->execute($values);

        if (!$resultado1) {
            throw new Exception("Error al ejecutar la consulta sql1.");
        }

        // Obtener el ID generado en la inserción
        $visitor_id = $bd->lastInsertId();
        if (!$visitor_id) {
            throw new Exception("No se generó un ID de usuario al insertar en users.");
        }
        
        // Si fue un usuario, asignar visitor_id al log
        if ($jsonVisitor->type == 'PERSONA') {
            $jsonVisitor->visitor_id = $visitor_id;
        }
        // Si fue un vehículo, asignar vehicle_id al log
        elseif ($jsonVisitor->type == 'VEHICULO') {
            $jsonVisitor->vehicle_id = $visitor_id;
        }
    }

    // Insertar en access_logs (o temporary_access_logs)
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
