export class Visitor {
  constructor(
    public visitor_id: number,           // user_id o temp_visit_id
    public doc_number: string,           // Número de documento
    public name: string,                 // Nombre del visitante
    public date_entry: string,           // entry_time o temp_entry_time
    public ap_id: number,                // ID del punto de acceso
    public status_validated: string,     // Estado de validación
    public operator_id: number,         // ID del operario
    public log_type: string,             // Tipo de log: 'access_logs' o 'temporary_access_logs'
    public type: string,                 // Tipo de visitante ('PERSONA', 'VEHICULO', 'EXTERNO')
    public address_reniec: string,
    public paternal_surname?:string,
    public maternal_surname?: string,
    public status_reason?:string,
    public visits?: number,               // Número de visitas
    public date_exit?: string,           // temp_exit_time (solo para logs temporales)
    public age?: number,                 // Edad del visitante (solo si es relevante)
    public role_system?: string,         // Role del usuario en el sistema (si es un visitante tipo 'PERSONA')
    public username_system?: string,     // Username del sistema (si es un visitante tipo 'PERSONA')
    public status_system?:string,
    public house_address?: string,       // Dirección de la casa (si es necesario para 'PERSONA')
    public type_doc?: string,            // Tipo de documento (si es un visitante tipo 'PERSONA')
    public house_id?: number,            // ID de la casa (solo para 'access_logs')
    public vehicle_id?: number,          // ID del vehículo (solo para 'access_logs')
    public log_id?: number,              // ID del log (access_log_id o temp_access_log_id)
    public license_plate?: string,       // Placa del vehículo (solo si el tipo es 'VEHICULO')
    public type_vehicle?: string,        // Tipo de vehículo (solo si el tipo es 'VEHICULO')
    public category_entry?: string,      // Categoría de entrada del vehículo (solo si el tipo es 'VEHICULO')
    public temp_visit_name?: string,     // Nombre de la visita temporal (solo para 'EXTERNO')
    public temp_visit_doc?: string,      // Documento de la visita temporal (solo para 'EXTERNO')
    public temp_visit_plate?: string,    // Placa del vehículo de visita temporal (solo para 'EXTERNO')
    public temp_visit_cel?: string,      // Celular de la visita temporal (solo para 'EXTERNO')
    public temp_visit_type?: string,     // Tipo de visitante temporal (solo para 'EXTERNO')
  ) {}
}