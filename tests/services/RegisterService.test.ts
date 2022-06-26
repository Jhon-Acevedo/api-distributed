import { IConnection } from '../../src/connectionDB/IConnection';
import { Register } from '../../src/models/Register';
import ConnectionMongo from '../../src/connectionDB/ConnectionMongo';
import RegisterService from '../../src/services/RegisterService';
import RegisterRepository from '../../src/repositories/RegisterRepository';
import SubjectRepository from '../../src/repositories/SubjectRepository';
import StudentRepository from '../../src/repositories/StudentRepository';

describe('RegisterService', () => {
  let registerService: RegisterService;
  let dbConnection: IConnection;
  let register: Register;

  beforeEach(() => {
    dbConnection = new ConnectionMongo();
    registerService = new RegisterService(
      new RegisterRepository(dbConnection),
      new StudentRepository(dbConnection),
      new SubjectRepository(dbConnection)
    );
    register = {
      idStudent: 1655829922404,
      idSubject: 1,
      dateRegister: new Date()
    } as Register;
  });

  afterEach(async () => {
    await dbConnection.disconnect();
  });

  it('should be defined', () => {
    expect(registerService).toBeDefined();
  });

  it('should be able to create a new register', async () => {
    await registerService.create(register);
    const result = await registerService.getAll();
    expect(result).toContainEqual(register);
    await registerService.delete(register.idStudent, register.idSubject);
  });

});
