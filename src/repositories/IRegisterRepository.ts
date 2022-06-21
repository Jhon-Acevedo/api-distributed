import {Register} from "../models/Register";
// import {Subject} from "../models/Subject";

export default interface IRegisterRepository {
    create(register:Register): Promise<Register>;
    findSubjectsByStudent(student_id:number): Promise<number[]>;
    findStudentsBySubject(subject_id:number): Promise<number[]>;
    // removeStudent(student_id:number,subject_id:number): Promise<null>;
}