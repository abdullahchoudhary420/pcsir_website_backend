const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const readData = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty structure
        if (error.code === 'ENOENT') {
            return { projects: [], news: [] };
        }
        throw error;
    }
};

const writeData = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readData, writeData };
