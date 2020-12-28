// Interfaces usually start with I
// Interfaces are used solely for Type checking

export interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
};