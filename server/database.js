
// mysql connection
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'bigf',
});

// ------------- FUNCTIONS
function execute_on_db(q) {
    return new Promise((resolve, reject) => {
        connection.query(q, (error, results) => {
            if (error) {
                console.error('Error performing fetching:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function execute_with_params(q, params){
    return new Promise((resolve, reject) => {
        connection.query(q, params, (error, results) => {
            if (error) {
                console.error('Error performing fetching:', error);
                reject(error);
            } else {
                console.log(results);
                resolve(results);
            }
        });
    });
}



module.exports = {
    execute_on_db: execute_on_db,
    execute_with_params: execute_with_params
};