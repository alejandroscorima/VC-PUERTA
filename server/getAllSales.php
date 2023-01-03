
<?php
//header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Origin: http://192.168.4.250");

$estado=$_GET['estado'];

$bd = include_once "bdTienda.php";
//$sentencia = $bd->query("select id, nombre, raza, edad from mascotas");
//$sentencia = $bd->prepare("select * from actas.actas where estado= '".$estado."'");
$sentencia = $bd->prepare("SELECT id, a.sala, sorteo, premio, ganador_doc, ganador_nombre, ganador_direccion, fecha_sorteo, hora_sorteo, cupon, seguridad_nombre, nombre, obs FROM actas.actas a INNER JOIN actas.personal p WHERE a.estado = '".$estado."' AND a.adj_doc=p.doc_number");
//where birth_date like '%?%'
$sentencia -> execute();
//[$fecha_cumple]
//$mascotas = $sentencia->fetchAll(PDO::FETCH_OBJ);
$actas = $sentencia->fetchAll(PDO::FETCH_OBJ);
//echo json_encode($mascotas);
echo json_encode($actas);

?>
