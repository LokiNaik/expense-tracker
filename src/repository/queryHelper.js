const db = require('../db/db.config')

exports.queryHelper = async (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}
