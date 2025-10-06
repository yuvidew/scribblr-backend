const fs = require('fs');
const path = 'controller/auth/auth.controller.js';

let text = fs.readFileSync(path, 'utf8');

const duplicateBlock = '        } else {\r\n            await db.query(\r\n                "INSERT INTO user_followers (user_profile_id, following_profile_id) VALUES (?, ?)",\r\n                [user_profile_id, following_profile_id]\r\n            );\r\n            return res.status(201).json({ message: "Followed successfully" });\r\n        }\r\n\r\n';

if (!text.includes(duplicateBlock)) {
    console.error('Duplicate block not found.');
    process.exit(1);
}

text = text.replace(duplicateBlock, '');

fs.writeFileSync(path, text);
