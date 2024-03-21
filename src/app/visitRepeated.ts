
export class VisitRepeated {
  constructor(
    public visitant_id: number,
    //public age: number,
    //public address: string,
    public date_entrance: string,
    public hour_entrance: string,
    public obs: string,
    public sala: string,
    public type: string,
    public table_entrance?: string,
    public id?: number,
  ) { }
}
