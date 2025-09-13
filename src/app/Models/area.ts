import { Person } from "../person";
import { Shift } from "./shift";

export interface Area {
    name: string;
    color: string;
    supervisors: Person[];
    controllers: Person[]; // مش optional
    shifts: Shift[];       // مش optional
    image?: string;
}