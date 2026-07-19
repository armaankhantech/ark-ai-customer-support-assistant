const { formatBusiness } = require("./formatters/businessFormatter");
const { formatContacts } = require("./formatters/contactsFormatter");
const { formatServices } = require("./formatters/servicesFormatter");
const { formatPolicies } = require("./formatters/policiesFormatter");
const { formatFaq } = require("./formatters/faqFormatter");

const FORMATTERS = {
    business: (knowledge) => formatBusiness(knowledge.company),

    contacts: (knowledge) => formatContacts(knowledge.contacts),

    services: (knowledge) => formatServices(knowledge.services),

    policies: (knowledge) => formatPolicies(knowledge.policies),

    faq: (knowledge) => formatFaq(knowledge.faqs)
};

function buildContextText(intent, knowledge) {

    const formatter = FORMATTERS[intent];

    if (!formatter) {
        return "";
    }

    return formatter(knowledge);

}

module.exports = {
    buildContextText
};