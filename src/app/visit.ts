
export class Visit {
  constructor(
      public visitant_id: number,
      public age: number,
      //public address: string,
      public date_entrance: string,
      public hour_entrance: string,
      public obs: string,
      public visits: number,
      public status: string,
      public table_entrance: string,
      public type: string,
      public id?: number,
  ) { }
}
