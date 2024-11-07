require("dotenv").config();

const m = require("masto");
const database = require('./db');

const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.TOKEN,
});

let currentQuestionIndex = 0;

// List of usernames to tag
const usernames = [
    "ChelseaLjx7@networked-media.itp.io",
    "LydiaPeng@networked-media.itp.io",
    "@TinaZZZ@networked-media.itp.io",
    "@patriktuka@networked-media.itp.io",
    "@Lailaelsalmi@networked-media.itp.io",
    "@lalunemi@networked-media.itp.io",
    "@samheckle@networked-media.itp.io",
    "@yt2694@networked-media.itp.io"
];

console.log("Bot server started.");

async function makeStatus(text) {
    try {
        const status = await masto.v1.statuses.create({
            status: text,
            visibility: "public",
        });
        console.log("Status posted:", status.url);
        saveStatusToDB(text, status.url);
    } catch (error) {
        console.error("Error posting status:", error);
    }
}

function saveStatusToDB(text, url) {
    const data = {
        text: text,
        url: url,
        date: new Date().toLocaleString(),
    };
    database.insert(data, (err, newData) => {
        if (err) {
            console.error("Error saving to database:", err);
        } else {
            console.log("Status saved to database:", newData);
        }
    });
}

async function replyToMentions() {
    try {
        const mentions = await masto.v1.notifications.list({ type: 'mention' });
        for (let mention of mentions) {
            const replyText = `Thanks for the mention! ${mention.status.content}!`;
            await masto.v1.statuses.create({
                status: replyText,
                in_reply_to_id: mention.status.id,
                visibility: "public",
            });
            console.log("Replied to mention:", mention.status.id);
        }
    } catch (error) {
        console.error("Error replying to mentions:", error);
    }
}

function postQuestions() {
    console.log("Fetching questions from the database...");
    database.find({ type: 'question' }).sort({ _id: 1 }).exec((err, questions) => {
        if (err) {
            console.error("Error fetching questions from database:", err);
        } else if (questions.length > 0) {
            const question = questions[currentQuestionIndex];
            let message = question.text;

            // Randomly decide whether to include a mention (1 in 10 chance)
            if (Math.random() < 0.1) { // 10% chance
                const randomUser = usernames[Math.floor(Math.random() * usernames.length)];
                message = `@${randomUser} ${message}`;
            }

            makeStatus(message);
            currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
            console.log("Posted question:", question.text);
        }
    });
}

setInterval(replyToMentions, 30000);
setInterval(postQuestions, 1800000);

replyToMentions();
postQuestions();