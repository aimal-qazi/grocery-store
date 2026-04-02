import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'admin',
    database: 'grocery_store_db',
    port: 5432
});

pool.on('connect', () => {
    console.log('Database is connected successfully');
})

export default pool;