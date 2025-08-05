const pool = require('./db.js');

exports.logErrorToDB = async ({ pk_id, request_url, payload, message }) => {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO error_log (pk_id, request_url, payload, message) VALUES (?, ?, ?, ?)`;
        const safePkId = String(pk_id ?? 'unknown');
        const safeRequestUrl = String(request_url ?? 'unknown');
        const safePayload = typeof payload === 'object' ? JSON.stringify(payload) : '{}';
        let trimmedMessage = 'unknown error';
        if (typeof message === 'string' && message.length > 0) {
            const stackLines = message.split('\n');
            const topStack = stackLines.slice(0, 6).join('\n');
            trimmedMessage = topStack.length > 2000 ? topStack.substring(0, 2000) + '... [truncated]' : topStack;
        }
        await connection.query(sql, [safePkId, safeRequestUrl, safePayload, trimmedMessage]);
    } catch (err) {
        console.error('[DB ERROR_LOGGING FAILED]', err);
    } finally {
        connection.release();
    }
};
