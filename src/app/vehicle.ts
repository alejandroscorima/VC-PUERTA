
export class Vehicle {
  constructor(
    public plate: string,
    public house_id: number,
    public status: string,
    public type: string,
    public reason: string,
    public house_address?: string,
    public vehicle_id?: number,
  ) { }

}
