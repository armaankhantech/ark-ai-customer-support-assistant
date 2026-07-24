class DirectResponses {

    constructor() {

        this.rules = [

            {
                keywords: [
                    "who created ark ai",
                    "who made ark ai",
                    "who is the founder of ark ai",
                    "founder of ark ai",
                    "creator of ark ai",
                    "who wrote this handbook",
                    "who built ark ai"
                ],

                answer:
                    "Mr. Armaan Khan created ARK AI and its Knowledge Base Handbook ,and take further information from the context provided."
            }

        ];

    }

    find(message) {

        const input = message.toLowerCase().trim();

        for (const rule of this.rules) {

            for (const keyword of rule.keywords) {

                if (input.includes(keyword)) {

                    return rule.answer;

                }

            }

        }

        return null;

    }

}

module.exports = new DirectResponses();