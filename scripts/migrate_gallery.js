const db = require('../config/db');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const galleryData = {
    "title": "PCSIR Islamabad Event Gallery",
    "images": [
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1756109414_cmftdaska25aug25.jpg",
            "caption": "Member Science at PCSIR, formally signed the contract extension with Mr. Zeeshan Tariq, Chairman of SIMAP"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1754380125_bannerdaskacopy.jpg",
            "caption": "MoU between Member Science, Dr. Naheed Kausar PCSIR and Mr. Muhammad Munir Peshawari, President of the GtCCI"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1709894036_collage.jpg",
            "caption": "MOU SIGNING BETWEEN PCSIR AND GCCI"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1701929171_pstck.JPG",
            "caption": "Sprint Oil & Gas Partners with PSTC for Exclusive Graduate Recruitment Drive"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1656669454_CoverCouncil.png",
            "caption": "HOLDING OF 34th COUNCIL MEETING OF PCSIR"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1652420779_CoverPic.jpg",
            "caption": "Ms. HUMAIRA AHMED, SECRETARY FOR MINISTRY OF SCIENCE AND TECHNOLOGY VISITED HEMP CULTIVATION SITE ON 12-05-2022"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1644222488_cover.jpg",
            "caption": "Honorable Federal Minister for Science and Technology, Senator Shibli Faraz Visited PCSIR Laboratories Complex, Lahore on February 05, 2022"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1745478815_daskaSlider.png",
            "caption": "A Memorandum of Understanding (MoU) has been signed between PCSIR-CM&FT Daska and Hazza Institute of Technology, Islamabad."
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1638770047_CoverHemp.png",
            "caption": "DR. AKHTAR NAZIR, SECRETARY FOR MINISTRY OF SCIENCE AND TECHNOLOGY VISITED HEMP CULTIVATION SITE ON 05-12-2021"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1638769213_coverLLC.png",
            "caption": "MR. FRANCISCO, AMBASSADOR ARGENTINE REPUBLIC VISITED PCSIR LABORATORIES COMPLEX, LAHORE ON 3-12-2021"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1635848574_sliderLLCFS.png",
            "caption": "Dr. Akhtar Nazir, Federal Secretary, Ministry of Science and Technology visited PCSIR Laboratories Complex, Lahore on 01.11.2021"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1634274592_FMKLCVisit.png",
            "caption": "Honorable Federal Minister for Science and Technology, Senator Shibli Faraz Visited PCSIR Laboratories Complex, Karachi on 08-10-2021"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1633001351_HempCover.jpg",
            "caption": "Inauguration of PCSIR-Hemp Value Chain Development Programme-2021 Thursday, 30th September 2021"
        },
        {
            "url": "https://www.pcsir.gov.pk/images/slideshow/1629114358_Cover_Plantation.png",
            "caption": "Tree Plantation Drive at PCSIR"
        }
    ]
};

async function downloadImage(url, filename) {
    const uploadDir = path.join(__dirname, '../public/uploads/gallery');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) resolve(`/uploads/gallery/${filename}`);
            });
        });
    } catch (error) {
        console.error(`Failed to download ${url}:`, error.message);
        return null; // Return null on failure instead of throwing
    }
}

async function migrate() {
    console.log('Starting migration...');

    try {
        // 1. Create a parent "Imported Gallery" event
        console.log('Creating parent event...');
        const eventResult = await db.query(
            'INSERT INTO media_events (title, description, event_date) VALUES ($1, $2, $3) RETURNING *',
            ['PCSIR Activities & Highlights', 'Imported highlights from recent PCSIR activities and events.', new Date()]
        );
        const eventId = eventResult.rows[0].id;
        console.log(`Created event with ID: ${eventId}`);

        // 2. Process each image
        for (const [index, img] of galleryData.images.entries()) {
            console.log(`Processing image ${index + 1}/${galleryData.images.length}...`);

            const filename = `imported_${Date.now()}_${index}.jpg`;
            const localPath = await downloadImage(img.url, filename);

            if (localPath) {
                await db.query(
                    'INSERT INTO media_images (event_id, image_url, caption, display_order) VALUES ($1, $2, $3, $4)',
                    [eventId, localPath, img.caption, index]
                );
                console.log(`  Saved image: ${img.caption.substring(0, 30)}...`);
            }
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
