import ConnectionMongo from '../../src/ConnectionDB/ConnectionMongo';

describe('ConnectionMongo', () => {
  let connection: ConnectionMongo;

  test('If connection is not connected, result should be false', () => {
    connection = new ConnectionMongo();
    expect(connection.isConnected()).toBe(false);
  });

  test('If connection is connected, result should be true', async () => {
    await connection.connect();
    expect(connection.isConnected()).toBe(true);
    await connection.disconnect();
  });

  test('If connection is disconnected, result should be false', async () => {
    await connection.connect();
    await connection.disconnect();
    expect(connection.isConnected()).toBe(false);
    await connection.disconnect();
  });

  test('If connection doesnt exists and we try get data, result should be error', () => {
    connection = new ConnectionMongo();
    expect(() => {
      connection.client
        .db(process.env.DB_NAME)
        .collection(process.env.STUDENT_COLLECTION_NAME)
        .find()
        .toArray();
    }).toThrowError(TypeError);
  });

  test('If connection exists and we try get data, result should be array', async () => {
    connection = new ConnectionMongo();
    await connection.connect();
    const result = await connection.client
      .db(process.env.DB_NAME)
      .collection(process.env.STUDENT_COLLECTION_NAME)
      .find()
      .toArray();
    expect(result).toBeInstanceOf(Array);
    await connection.disconnect();
  });
});