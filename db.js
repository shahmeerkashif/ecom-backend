import {pool} from 'pg';

import 'dotenv/config';

const db = new pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false, // Disable cert verification (fine for Neon/dev)
    },
})
export default db;