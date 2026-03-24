const bcrypt = require('bcryptjs');
const hash = '$2b$12$xLgy35ff7jJdmL80UU10LO8DfV5jqrcruIXAmzkzZSXkN70HLq97a';
const pass = 'Admin@RentGhars2025!';
bcrypt.compare(pass, hash).then(r => console.log('Match:', r));