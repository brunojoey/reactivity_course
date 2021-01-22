// Interfaces usually start with I
// Interfaces are used solely for Type checking

export interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: any;
  city: string;
  venue: string;
};

// Partial indicates all the keys we pass in from IActivity will be optional
export interface IActivityFormValues extends Partial<IActivity> {
  time?: Date
};

export class ActivityFormValues implements IActivityFormValues {
  id?: string = undefined;
  title: string = "";
  category: string = "";
  description: string = "";
  date?: Date = undefined;
  time?: Date = undefined;
  city: string = "";
  venue: string = "";
  
  constructor(init?: IActivityFormValues) {
    if (init && init.date) {
      init.time = init.date
    }
    Object.assign(this, init);
  };
};