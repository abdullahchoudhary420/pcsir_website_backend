const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const pool = require('../config/db');
require('dotenv').config({ path: './backend/.env' });

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, response => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                // Follow redirect
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        }).on('error', err => {
            fs.unlink(dest, () => reject(err.message));
        });
    });
};

const items = [
    {
        title: "In-House Research Projects (2024-25)",
        description: "Yearly list of internal research and development projects.",
        url: "https://www.pcsir.gov.pk/uploads/inhouse_R&D.pdf",
        filename: "inhouse_R&D.pdf"
    },
    {
        title: "R&D Proforma",
        description: "Official R&D Proforma document.",
        url: "http://www.pcsir.gov.pk/uploads/1731488954_rnd_proforma.pdf",
        filename: "rnd_proforma.pdf"
    }
];

const seedInHouse = async () => {
    try {
        console.log('Seeding In-House projects...');

        // Ensure directory exists
        const uploadDir = path.join(__dirname, '../public/uploads/in-house');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Clear existing
        await pool.query('DELETE FROM in_house_projects');
        console.log('Cleared existing In-House projects.');

        for (const item of items) {
            const dest = path.join(uploadDir, item.filename);
            const dbPath = `/uploads/in-house/${item.filename}`;

            console.log(`Downloading ${item.title}...`);
            try {
                await downloadFile(item.url, dest);
                console.log(`Saved to ${dest}`);

                await pool.query(
                    'INSERT INTO in_house_projects (title, description, file_path) VALUES ($1, $2, $3)',
                    [item.title, item.description, dbPath]
                );
            } catch (err) {
                console.error(`Failed to download ${item.title}:`, err);
                // Continue with others
            }
        }

        console.log('Successfully seeded In-House projects.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding In-House projects:', error);
        process.exit(1);
    }
};

seedInHouse();
