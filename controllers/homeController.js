const db = require('../config/db');

exports.getHomeData = async (req, res) => {
    try {
        const [
            heroSettings,
            statistics,
            infoCards,
            aboutEntries,
            services,
            news,
            publications,
            labs
        ] = await Promise.all([
            db.query(`SELECT key, value FROM site_settings WHERE group_name = 'hero' OR group_name = 'general'`),
            db.query(`SELECT value, label FROM statistics ORDER BY display_order ASC`),
            db.query(`SELECT icon, type, title, description FROM info_cards ORDER BY id ASC`),
            db.query(`SELECT section, title, content, image_url FROM about_entries ORDER BY display_order ASC`),
            db.query(`SELECT title, description, icon, link FROM services ORDER BY display_order ASC`),
            db.query(`SELECT id, title, description, date FROM news ORDER BY id DESC LIMIT 3`),
            db.query(`SELECT title, type, year, link FROM publications ORDER BY display_order ASC LIMIT 3`),
            db.query(`SELECT name, location, specialization FROM labs ORDER BY display_order ASC LIMIT 3`)
        ]);

        // Convert site settings to key-value object
        const hero = heroSettings.rows.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
        }, {});

        // Group info cards by type
        const groupedInfoCards = infoCards.rows.reduce((acc, card) => {
            if (!acc[card.type]) acc[card.type] = [];
            acc[card.type].push(card);
            return acc;
        }, {});

        // Group about entries by section
        const groupedAbout = aboutEntries.rows.reduce((acc, entry) => {
            if (!acc[entry.section]) acc[entry.section] = [];
            acc[entry.section].push(entry);
            return acc;
        }, {});

        res.json({
            hero,
            statistics: statistics.rows,
            infoCards: groupedInfoCards,
            about: groupedAbout,
            services: services.rows,
            latestNews: news.rows,
            publications: publications.rows,
            labs: labs.rows
        });

    } catch (error) {
        console.error('getHomeData error:', error);
        res.status(500).json({ message: 'Failed to load home page data' });
    }
};
