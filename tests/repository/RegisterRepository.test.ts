import { IConnection } from '../../src/connectionDB/IConnection';
import { Register } from '../../src/models/Register';
import IRegisterRepository from "../../src/repositories/IRegisterRepository";
import ConnectionMongo from "../../src/connectionDB/ConnectionMongo";
import RegisterRepository from "../../src/repositories/RegisterRepository";

describe('RegisterRepository', () => {
    let registerRepository: IRegisterRepository;
    let dbConnection: IConnection;
    let register: Register;

    beforeEach(() => {
        dbConnection = new ConnectionMongo();
        registerRepository = new RegisterRepository(dbConnection);
        register = {
            idStudent: 1,
            idSubject: 1,
            dateRegister: new Date()
        } as Register;
    });

    afterEach(async () => {
        await dbConnection.disconnect();
    });

    it('should be defined', async () => {
        expect(registerRepository).toBeDefined();
    });

    it('should be able to create a new register', async () => {
        await registerRepository.create(register);
        const result = await registerRepository.findStudentsBySubject(register.idSubject);
        expect(result).toContainEqual(register);
        // await registerRepository.delete(register.idStudent);
    });

});