const bcrypt = require('bcryptjs');

const hash = '$2b$10$9POOt9VbADqFeEDJNfwpxuTVAA1wcnqsHmGEUNRlzK2ZZGCKBjJ6S';
const password = 'admin123';

bcrypt.compare(password, hash).then(res => {
    console.log('Match:', res);
    if (!res) {
        console.log('Generating new hash...');
        const newHash = bcrypt.hashSync(password, 10);
        console.log('New Hash:', newHash);
    }
});
