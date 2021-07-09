import * as oracledb from 'oracledb';
import { dbConfig } from './dbConfig';

export class DbConnection {

    constructor() {
        try {
            // Create a connection pool which will later be accessed via the
            // pool cache as the 'default' pool.
            oracledb.createPool({
                user: dbConfig.user,
                password: dbConfig.password,
                connectString: dbConfig.connectString

            });
            console.log('Connection pool started');
        } catch (err) {
            console.error('init() error: ' + err.message);
        }
    }


    public static async runDbQuary(sql: string) {
        let connection;
        let result
        try {
            // Get a connection from the default pool
            connection = await oracledb.getConnection();
            result = await connection.execute(sql);
            console.log(result);
        } catch (err) {
            console.error(err);
        } finally {
            if (connection) {
                try {
                    // Put the connection back in the pool
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
        return result
    }
}