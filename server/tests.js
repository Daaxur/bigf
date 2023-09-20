const assert = require('assert');
const app = require('./server'); // Import your Express app instance
const db = require('./database'); // Import your database functions

describe('API Tests', () => {
  before(async () => {
    // Ce qu'il faut faire avant de lancer les tests
  });

  it('should register a user', async () => {
    const response = await app.post('/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'PasS$w0rd' });

    assert.strictEqual(response.status, 200);
  });

  it('should not register a user with missing information', async () => {
    const response = await app.post('/register')
      .send({ username: 'testuser' });

    assert.strictEqual(response.status, 400);
  });

  //   
  // Ajouter d'autres tests ici
  //

  after(async () => {
    // Ce qu'il faut faire après les tests pour netttoyer la base de données
    try {
        await db.execute_on_db('DELETE FROM user WHERE username = "testuser"');
    } catch (error) {
        console.error('Error deleting test user:', error);
    }
  });
});
