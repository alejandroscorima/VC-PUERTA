<?php
// Configuración para errores y CORS
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    exit("Solo acepto peticiones POST");
}

$jsonVisitor  = json_decode(file_get_contents("php://input"));
if (!$jsonVisitor ) {
    http_response_code(400); // Solicitud incorrecta
    exit("No hay datos");
}

if (empty($jsonVisitor->type)) {
    http_response_code(400);
    exit("Faltan datos obligatorios.");
}

// Conexión a la base de datos
$bd = include_once "vc_db.php";

// Preparar la consulta SQL para insertar un nuevo usuario
if ($jsonVisitor->type == 'PERSONA') {
    if (empty($jsonVisitor->type_doc) || empty($jsonVisitor->doc_number)) {
        http_response_code(400); // Bad Request
        exit("Faltan datos obligatorios: 'type_doc' o 'doc_number'");
    }
    if (empty($jsonVisitor->username_system)) {
        $jsonVisitor->username_system = 'USER_' . uniqid(); // Si el username_system de visitor es vacío, crea uno genérico aleatorio
    }
    $sql = "INSERT INTO users(
        type_doc,
        doc_number,
        first_name,
        paternal_surname,
        maternal_surname,
        role_system,
        username_system,
        status_validated,
        status_system
    ) VALUES (?,?,?,?,?,?,?,?,?)";
    $values = [
        $jsonVisitor->type_doc,
        $jsonVisitor->doc_number,
        $jsonVisitor->name,
        $jsonVisitor->paternal_surname,
        $jsonVisitor->maternal_surname,
        $jsonVisitor->role_system ?? null,
        $jsonVisitor->username_system,
        $jsonVisitor->status_validated,
        $jsonVisitor->status_system
    ];
}
elseif ($jsonVisitor->type == 'VEHICULO') {
    $sql = "INSERT INTO vehicles(
        license_plate,
        type_vehicle,
        status_validated,
        status_system
    ) VALUES (?,?,?,?)";
    $values = [
        $jsonVisitor->license_plate ?? null,
        $jsonVisitor->type_vehicle,
        $jsonVisitor->status_validated,
        $jsonVisitor->status_system,
    ];
}
try {
    if ($sql) {
        $sentencia = $bd->prepare($sql);
        $resultado = $sentencia->execute($values);

        if ($resultado) {
            echo json_encode(["success" => true, "message" => "Persona creada correctamente."]);
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