const pool = require('../config/db');
require('dotenv').config({ path: './backend/.env' });

const psdpProjects = [
    {
        "serial_no": "1.",
        "psdp_no": "1048",
        "name": "Establishment of Technical Training Centre for Precision Mechanics and Instrument Technology, Gwadar.",
        "approval_status": "DDWP\n\n09.11.2020",
        "cost_total": "1210.150",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "6.465",
        "psdp_total": "6.465"
    },
    {
        "serial_no": "2.",
        "psdp_no": "1058",
        "name": "Up Gradation of Machinery, Equipment and Renovation of Buildings of IIEE & PSTC Karachi.",
        "approval_status": "DDWP\n\n02.04.2020\n\n24 Months",
        "cost_total": "125.000",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "50.000",
        "psdp_total": "50.000"
    },
    {
        "serial_no": "3.",
        "psdp_no": "1059",
        "name": "Up Gradation of Medicinal Botanic Centre as National Centre for Herbal Medicine, PCSIR Labs. Complex, Peshawar.",
        "approval_status": "CDWP\n\n02.05.2018\n\n24 Months\n\nRevised On\n\nDDWP\n\n08.09.2021",
        "cost_total": "286.00",
        "cost_foreign_aid": "51.00",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "23.686",
        "psdp_total": "23.686"
    },
    {
        "serial_no": "4.",
        "psdp_no": "1060",
        "name": "Up Gradation of Polymer & Plastics Laboratory at PCSIR Laboratories Complex, Lahore.",
        "approval_status": "CDWP\n\n06.05.2019\n\n24 Months\n\nExt 30.06.2022",
        "cost_total": "131.695",
        "cost_foreign_aid": "91.719",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "34.695",
        "psdp_total": "34.695"
    },
    {
        "serial_no": "5.",
        "psdp_no": "1062",
        "name": "Cultivation and Processing of Medicinal and Industrial Cannabis on Experimental Fields and Establishment of Testing and Product Development Facilities (PCSIR & Arid Agriculture University)",
        "approval_status": "DDWP\n\n06.05.2021\n\n36 Months",
        "cost_total": "1896.820",
        "cost_foreign_aid": "323.0",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "300.000",
        "psdp_total": "300.000"
    },
    {
        "serial_no": "6.",
        "psdp_no": "1063",
        "name": "Data Repository of Scientific Instrumentation",
        "approval_status": "DDWP\n\n27.05.2021\n\n36 Months",
        "cost_total": "300.00",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "50.000",
        "psdp_total": "50.000"
    },
    {
        "serial_no": "7.",
        "psdp_no": "1064",
        "name": "Development of Computer Controlled Fermenters and Production of Bio-Chemicals & Bio-Products",
        "approval_status": "DDWP\n\n06.05.2021\n\n24 Months",
        "cost_total": "1981.607",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "335.305",
        "psdp_total": "335.305"
    },
    {
        "serial_no": "8.",
        "psdp_no": "1065",
        "name": "Digital Transformation, Strengthening and Automation of PCSIR",
        "approval_status": "DDWP\n\n27.05.2021\n\n24 Months",
        "cost_total": "521.060",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "350.000",
        "psdp_total": "350.000"
    },
    {
        "serial_no": "9.",
        "psdp_no": "1069",
        "name": "Establishment of Material Resource Center and Development of Additive Manufacturing & Reverse Engineering Center at PCSIR",
        "approval_status": "DDWP\n\n27.05.2021\n\n36 Months",
        "cost_total": "1750.00",
        "cost_foreign_aid": "9.54",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "300.000",
        "psdp_total": "300.000"
    },
    {
        "serial_no": "10.",
        "psdp_no": "1070",
        "name": "Establishment of PCSIR Laboratories Complex,  Multan (Feasibility Study)",
        "approval_status": "CDWP\n\n03.06.2021\n\n12 Months",
        "cost_total": "30.00",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "30.000",
        "psdp_total": "30.000"
    },
    {
        "serial_no": "11.",
        "psdp_no": "1072",
        "name": "Gene Editing of Biological Agents for Nutritional Biochemical and Therapeutic Purpose",
        "approval_status": "DDWP\n\n10.12.2020\n\n36 Months",
        "cost_total": "1799.598",
        "cost_foreign_aid": "100.00",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "400.000",
        "psdp_total": "400.000"
    },
    {
        "serial_no": "12.",
        "psdp_no": "1074",
        "name": "Medical Equipment & Devices Innovation Center (MEDICen)",
        "approval_status": "DDWP\n\n27.05.2021\n\n48 Months",
        "cost_total": "1989.520",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "100.000",
        "psdp_total": "100.000"
    },
    {
        "serial_no": "13.",
        "psdp_no": "1077",
        "name": "Research, Development and Innovation in PCSIR",
        "approval_status": "DDWP\n\n27.05.2021\n\n24 Months",
        "cost_total": "1500.000",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "200.000",
        "psdp_total": "200.000"
    },
    {
        "serial_no": "14.",
        "psdp_no": "1080",
        "name": "Up Gradation of Calibration Centre Capabilities at PCSIR Peshawar",
        "approval_status": "DDWP\n\n11.05.2020\n\n18 Months",
        "cost_total": "35.000",
        "cost_foreign_aid": "0.000",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "15.000",
        "psdp_total": "15.000"
    },
    {
        "serial_no": "15.",
        "psdp_no": "1081",
        "name": "Up Gradation of Halal Authentication Labs at PCSIR Laboratories Complex, Lahore, Karachi and Peshawar",
        "approval_status": "CDWP\n\n03.06.2020\n\n36 Months",
        "cost_total": "722.980",
        "cost_foreign_aid": "563.66",
        "psdp_foreign_aid": "0.000",
        "psdp_rupees": "200.000",
        "psdp_total": "200.000"
    },
    {
        "serial_no": "16.",
        "psdp_no": "",
        "name": "Establishment of Medical Cannabis Greenhouses for bio-technology derived Bio-products, Natural Hemp & Cannabis Analytical Laboratory and Natural Industrial Hemp & Medical Cannabis Authority.",
        "approval_status": "",
        "cost_total": "",
        "cost_foreign_aid": "",
        "psdp_foreign_aid": "",
        "psdp_rupees": "",
        "psdp_total": "1946.014"
    },
    {
        "serial_no": "17.",
        "psdp_no": "",
        "name": "Research, Development and Technology Transfer of Selected Active Pharmaceutical Ingredients (APIS) for Impact Substitution (PCSIR)",
        "approval_status": "",
        "cost_total": "",
        "cost_foreign_aid": "",
        "psdp_foreign_aid": "",
        "psdp_rupees": "",
        "psdp_total": "1067.639"
    },
    {
        "serial_no": "",
        "psdp_no": "",
        "name": "Indigenous Development and Pilot Scale Production of Diagnostic Kits and Antisera for Priority Biological Agents",
        "approval_status": "In Process",
        "cost_total": "",
        "cost_foreign_aid": "",
        "psdp_foreign_aid": "",
        "psdp_rupees": "",
        "psdp_total": "1454.992"
    },
    {
        "serial_no": "",
        "psdp_no": "",
        "name": "Indigenous Development and Pilot Scale Production of Human Vaccines”",
        "approval_status": "In Process",
        "cost_total": "",
        "cost_foreign_aid": "",
        "psdp_foreign_aid": "",
        "psdp_rupees": "",
        "psdp_total": "1989.64"
    }
];

const seedPSDP = async () => {
    try {
        console.log('Seeding PSDP projects...');

        // Clear existing data
        await pool.query('DELETE FROM psdp_projects');
        console.log('Cleared existing PSDP projects.');

        for (const project of psdpProjects) {
            await pool.query(
                'INSERT INTO psdp_projects (serial_no, psdp_no, name, approval_status, cost_total, cost_foreign_aid, psdp_foreign_aid, psdp_rupees, psdp_total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [
                    project.serial_no,
                    project.psdp_no,
                    project.name,
                    project.approval_status,
                    project.cost_total,
                    project.cost_foreign_aid,
                    project.psdp_foreign_aid,
                    project.psdp_rupees,
                    project.psdp_total
                ]
            );
        }

        console.log('Successfully seeded PSDP projects.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding PSDP projects:', error);
        process.exit(1);
    }
};

seedPSDP();
